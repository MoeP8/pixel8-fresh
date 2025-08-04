// Service Worker Registration and Management
const isProduction = import.meta.env.PROD;
const swUrl = '/sw.js';

export interface ServiceWorkerMessage {
  type: string;
  version?: string;
}

// Check if service workers are supported
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

// Register the service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.log('[SW] Service workers not supported');
    return null;
  }

  try {
    console.log('[SW] Registering service worker...');
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('[SW] Service worker registered successfully:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        console.log('[SW] New service worker installing...');
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New service worker installed, prompting for update');
            promptForUpdate(registration);
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    return null;
  }
};

// Unregister the service worker
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const result = await registration.unregister();
    console.log('[SW] Service worker unregistered:', result);
    return result;
  } catch (error) {
    console.error('[SW] Service worker unregistration failed:', error);
    return false;
  }
};

// Check for service worker updates
export const checkForUpdates = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    console.log('[SW] Checked for updates');
  } catch (error) {
    console.error('[SW] Update check failed:', error);
  }
};

// Send message to service worker
export const sendMessageToServiceWorker = (message: ServiceWorkerMessage): void => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  navigator.serviceWorker.ready.then(registration => {
    registration.active?.postMessage(message);
  });
};

// Get service worker version
export const getServiceWorkerVersion = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isServiceWorkerSupported()) {
      reject(new Error('Service workers not supported'));
      return;
    }

    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event.data?.type === 'VERSION') {
        resolve(event.data.version);
      } else {
        reject(new Error('Invalid response'));
      }
    };

    sendMessageToServiceWorker({ type: 'GET_VERSION' });
  });
};

// Prompt user for service worker update
const promptForUpdate = (registration: ServiceWorkerRegistration): void => {
  // This would typically show a notification or modal to the user
  // For now, we'll auto-update in development and prompt in production
  if (isProduction) {
    const updateConfirmed = confirm(
      'A new version of the app is available. Would you like to update now?'
    );
    
    if (updateConfirmed) {
      skipWaitingAndReload(registration);
    }
  } else {
    // Auto-update in development
    console.log('[SW] Auto-updating in development...');
    skipWaitingAndReload(registration);
  }
};

// Skip waiting and reload the page
const skipWaitingAndReload = (registration: ServiceWorkerRegistration): void => {
  const newWorker = registration.waiting;
  if (newWorker) {
    newWorker.postMessage({ type: 'SKIP_WAITING' });
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'activated') {
        window.location.reload();
      }
    });
  }
};

// Listen for service worker messages
export const setupServiceWorkerListeners = (): void => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('[SW] Message received from service worker:', event.data);
    
    // Handle different message types
    switch (event.data?.type) {
      case 'CACHE_UPDATED':
        console.log('[SW] Cache updated');
        break;
      case 'OFFLINE_READY':
        console.log('[SW] App ready for offline use');
        break;
      default:
        console.log('[SW] Unknown message type:', event.data?.type);
    }
  });

  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('[SW] App is back online');
    checkForUpdates();
  });

  window.addEventListener('offline', () => {
    console.log('[SW] App is now offline');
  });
};

// Initialize service worker
export const initServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.log('[SW] Service workers not supported in this browser');
    return null;
  }

  console.log('[SW] Initializing service worker...');
  
  // Setup listeners first
  setupServiceWorkerListeners();
  
  // Register the service worker
  const registration = await registerServiceWorker();
  
  if (registration) {
    console.log('[SW] Service worker initialized successfully');
    
    // Check for updates periodically (every 60 seconds)
    setInterval(() => {
      checkForUpdates();
    }, 60000);
  }
  
  return registration;
};