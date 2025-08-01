import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useRealtime } from '@/hooks/useRealtime';
import { useToast } from '@/hooks/use-toast';

interface RealtimeContextType {
  isConnected: boolean;
  broadcastActivity: (action: string, details: any) => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { isConnected, broadcastActivity } = useRealtime();
  const { toast } = useToast();

  // Show connection status
  useEffect(() => {
    if (isConnected) {
      toast({
        title: "🟢 Connected to live updates",
        description: "You'll receive real-time notifications",
        duration: 3000,
      });
    }
  }, [isConnected, toast]);

  // Broadcast common activities automatically
  useEffect(() => {
    const handleActivityBroadcast = async (event: CustomEvent) => {
      const { action, details } = event.detail;
      await broadcastActivity(action, details);
    };

    // Listen for custom activity events
    window.addEventListener('pixel8-activity', handleActivityBroadcast as EventListener);
    
    return () => {
      window.removeEventListener('pixel8-activity', handleActivityBroadcast as EventListener);
    };
  }, [broadcastActivity]);

  const value = {
    isConnected,
    broadcastActivity,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeContext() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtimeContext must be used within a RealtimeProvider');
  }
  return context;
}

// Helper function to broadcast activities from anywhere in the app
export function broadcastActivity(action: string, details: any) {
  const event = new CustomEvent('pixel8-activity', {
    detail: { action, details }
  });
  window.dispatchEvent(event);
}