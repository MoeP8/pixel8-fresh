// Pixel8 Social Hub Service Worker
const CACHE_NAME = 'pixel8-social-hub-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/analytics',
  '/campaigns',
  '/content-studio',
  '/scheduler',
  '/offline.html',
  '/manifest.json'
];

// Dynamic cache patterns
const CACHE_PATTERNS = {
  api: /^https:\/\/.*\.supabase\.co\/rest\/v1\//,
  images: /\.(png|jpg|jpeg|svg|gif|webp)$/,
  fonts: /\.(woff|woff2|ttf|eot)$/,
  scripts: /\.(js|css)$/
};

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request, url));
  }
});

// Handle GET requests with appropriate caching strategy
async function handleGetRequest(request, url) {
  try {
    // Strategy 1: Network first for API calls
    if (CACHE_PATTERNS.api.test(url.href)) {
      return await networkFirstStrategy(request);
    }

    // Strategy 2: Cache first for static assets
    if (CACHE_PATTERNS.images.test(url.pathname) || 
        CACHE_PATTERNS.fonts.test(url.pathname) || 
        CACHE_PATTERNS.scripts.test(url.pathname)) {
      return await cacheFirstStrategy(request);
    }

    // Strategy 3: Stale while revalidate for pages
    if (url.origin === self.location.origin) {
      return await staleWhileRevalidateStrategy(request);
    }

    // Default: Network only for external resources
    return await fetch(request);
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return await handleOfflineFallback(request, url);
  }
}

// Network first strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache first strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    throw error;
  }
}

// Stale while revalidate strategy (for pages)
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch((error) => {
    console.log('[SW] Network update failed:', error);
    return cachedResponse;
  });

  return cachedResponse || fetchPromise;
}

// Handle offline fallbacks
async function handleOfflineFallback(request, url) {
  // For navigation requests, show offline page
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
  }

  // For API requests, return a meaningful offline response
  if (CACHE_PATTERNS.api.test(url.href)) {
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: 'You are currently offline. Please check your connection.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // For other requests, throw the error
  throw new Error('Offline and no cached version available');
}

// Background sync for when connectivity is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-posts') {
    event.waitUntil(syncPendingPosts());
  }
});

// Sync pending posts when back online
async function syncPendingPosts() {
  try {
    // Get pending posts from IndexedDB or localStorage
    // This would integrate with your actual post queue
    console.log('[SW] Syncing pending posts...');
    
    // Implementation would depend on your specific needs
    // For now, just log that sync is working
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Pixel8 Social Hub',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/dashboard'
    },
    actions: [
      {
        action: 'view',
        title: 'View Dashboard',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ],
    tag: 'pixel8-notification',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification('Pixel8 Social Hub', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    });
  }
});

console.log('[SW] Service worker script loaded');