import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, RefreshCw } from 'lucide-react';

export const PWAStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    // Check if PWA is installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    // Check online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check for service worker updates
    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const hasUpdate = registration.waiting !== null;
          setUpdateAvailable(hasUpdate);
          setCacheStatus('ready');
        } catch (error) {
          console.error('Error checking for updates:', error);
          setCacheStatus('error');
        }
      }
    };

    // Initial checks
    checkInstallStatus();
    checkForUpdates();

    // Event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleUpdate = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          registration.waiting.addEventListener('statechange', () => {
            if (registration.waiting?.state === 'activated') {
              window.location.reload();
            }
          });
        }
      } catch (error) {
        console.error('Error updating app:', error);
      }
    }
  };

  // Only show status if PWA is installed or there are important updates
  if (!isInstalled && !updateAvailable && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="glass-card p-2 border border-white/20 shadow-lg">
        <div className="flex items-center space-x-2">
          {/* Online/Offline Status */}
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className="text-xs text-white/70">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* PWA Installation Status */}
          {isInstalled && (
            <div className="flex items-center space-x-1 pl-2 border-l border-white/20">
              <Download className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white/70">Installed</span>
            </div>
          )}

          {/* Update Available */}
          {updateAvailable && (
            <div className="pl-2 border-l border-white/20">
              <button
                onClick={handleUpdate}
                className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 
                         text-white text-xs font-medium rounded-md hover:from-purple-600 hover:to-blue-600 
                         transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Update</span>
              </button>
            </div>
          )}

          {/* Cache Status */}
          <div className="flex items-center space-x-1 pl-2 border-l border-white/20">
            <div className={`w-2 h-2 rounded-full ${
              cacheStatus === 'ready' ? 'bg-green-400' :
              cacheStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
            }`}></div>
            <span className="text-xs text-white/70">
              {cacheStatus === 'ready' ? 'Cached' :
               cacheStatus === 'error' ? 'Error' : 'Loading'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAStatus;