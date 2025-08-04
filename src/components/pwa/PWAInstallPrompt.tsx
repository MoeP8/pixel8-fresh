import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      // Show prompt after a delay (give user time to explore the app)
      setTimeout(() => {
        if (!isInstalled) {
          setIsVisible(true);
        }
      }, 10000); // Show after 10 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User ${outcome} the install prompt`);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setIsVisible(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed, not installable, or dismissed this session
  if (isInstalled || !isInstallable || !isVisible || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
      <div className="glass-card p-4 border border-white/20 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4 text-white/70" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white mb-1">
              Install Pixel8 Social Hub
            </h3>
            <p className="text-xs text-white/70 mb-3 leading-relaxed">
              Get the full app experience with offline access, faster loading, and desktop notifications.
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 
                         text-white text-xs font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 
                         transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <Download className="w-3 h-3" />
                <span>Install App</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-xs font-medium text-white/70 hover:text-white 
                         transition-colors rounded-lg hover:bg-white/10"
              >
                Later
              </button>
            </div>
          </div>
        </div>
        
        {/* Benefits list */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
              <span>Offline access</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span>Faster loading</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              <span>Push notifications</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
              <span>App shortcuts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;