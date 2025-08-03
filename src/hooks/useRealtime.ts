import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import type { PostgrestSingleResponse } from '@supabase/postgrest-js';
import { useToast } from '@/hooks/use-toast';

export interface RealtimePresence {
  user_id: string;
  username: string;
  avatar_url?: string;
  online_at: string;
  status: 'online' | 'away' | 'busy';
  current_page?: string;
}

export interface RealtimeActivity {
  id: string;
  user_id: string;
  username: string;
  action: string;
  details: any;
  created_at: string;
}

export function useRealtime() {
  const [presenceState, setPresenceState] = useState<Record<string, RealtimePresence>>({});
  const [recentActivity, setRecentActivity] = useState<RealtimeActivity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Track current user's presence
  const updatePresence = useCallback(async (status: 'online' | 'away' | 'busy', currentPage?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const presence = {
        user_id: user.id,
        username: user.user_metadata?.full_name || user.email || 'Anonymous',
        avatar_url: user.user_metadata?.avatar_url,
        online_at: new Date().toISOString(),
        status,
        current_page: currentPage
      };

      // Update presence in realtime channel
      const channel = supabase.channel('pixel8-presence');
      await channel.track(presence);
    } catch (error) {
      console.error('useRealtime: Failed to update presence:', error);
    }
  }, []);

  // Initialize realtime connections
  useEffect(() => {
    let presenceChannel: RealtimeChannel;
    let activityChannel: RealtimeChannel;
    let postsChannel: RealtimeChannel;

    const initializeRealtime = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('useRealtime: No authenticated user, skipping realtime initialization');
          return;
        }

      // 1. Presence Channel - Track who's online
      presenceChannel = supabase
        .channel('pixel8-presence')
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel.presenceState<RealtimePresence>();
          setPresenceState(state);
          setIsConnected(true);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          const newUser = newPresences[0];
          if (newUser && newUser.user_id !== user.id) {
            toast({
              title: `${newUser.username} joined`,
              description: 'Now online',
              duration: 3000,
            });
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          const leftUser = leftPresences[0];
          if (leftUser && leftUser.user_id !== user.id) {
            toast({
              title: `${leftUser.username} left`,
              description: 'Now offline',
              duration: 3000,
            });
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await updatePresence('online', window.location.pathname);
          }
        });

      // 2. Activity Feed Channel - Track team actions
      activityChannel = supabase
        .channel('pixel8-activity')
        .on('broadcast', { event: 'activity' }, ({ payload }) => {
          setRecentActivity(prev => [payload, ...prev].slice(0, 20));
          
          // Show toast for important activities
          if (payload.user_id !== user.id && ['post_published', 'post_approved', 'post_rejected'].includes(payload.action)) {
            toast({
              title: `${payload.username} ${payload.action.replace('_', ' ')}`,
              description: payload.details?.title || payload.details?.content?.substring(0, 50) + '...',
              duration: 4000,
            });
          }
        })
        .subscribe();

      // 3. Posts Channel - Live post status updates
      postsChannel = supabase
        .channel('pixel8-posts')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'scheduled_posts' },
          (payload: any) => {
            const { eventType, new: newRecord, old: oldRecord } = payload;
            
            if (eventType === 'UPDATE' && newRecord && oldRecord) {
              // Status changed
              if (newRecord.posting_status !== oldRecord.posting_status) {
                const statusMessages = {
                  'posted': '✅ Post published successfully!',
                  'failed': '❌ Post failed to publish',
                  'approved': '👍 Post approved',
                  'rejected': '👎 Post rejected'
                };
                
                const message = statusMessages[newRecord.posting_status as keyof typeof statusMessages];
                if (message) {
                  toast({
                    title: message,
                    description: newRecord.title || 'Social media post',
                    duration: 5000,
                  });
                }
              }
            }
            
            if (eventType === 'INSERT' && newRecord) {
              toast({
                title: '📝 New post scheduled',
                description: `${newRecord.platform} post for ${new Date(newRecord.scheduled_at).toLocaleDateString()}`,
                duration: 4000,
              });
            }
          }
        )
        .subscribe();
      } catch (error) {
        console.error('useRealtime: Failed to initialize realtime connections:', error);
        setIsConnected(false);
      }
    };

    initializeRealtime();

    // Cleanup
    return () => {
      if (presenceChannel) supabase.removeChannel(presenceChannel);
      if (activityChannel) supabase.removeChannel(activityChannel);
      if (postsChannel) supabase.removeChannel(postsChannel);
      setIsConnected(false);
    };
  }, [toast, updatePresence]);

  // Update presence when page changes
  useEffect(() => {
    updatePresence('online', window.location.pathname);
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away');
      } else {
        updatePresence('online', window.location.pathname);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updatePresence]);

  // Broadcast activity to team
  const broadcastActivity = useCallback(async (action: string, details: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const activity: RealtimeActivity = {
        id: crypto.randomUUID(),
        user_id: user.id,
        username: user.user_metadata?.full_name || user.email || 'Anonymous',
        action,
        details,
        created_at: new Date().toISOString()
      };

      const channel = supabase.channel('pixel8-activity');
      await channel.send({
        type: 'broadcast',
        event: 'activity',
        payload: activity
      });
    } catch (error) {
      console.error('useRealtime: Failed to broadcast activity:', error);
    }
  }, []);

  // Get online team members
  const getOnlineUsers = useCallback(() => {
    return Object.values(presenceState).flat().filter(user => 
      user.status === 'online' && 
      Date.now() - new Date(user.online_at).getTime() < 5 * 60 * 1000 // 5 minutes
    );
  }, [presenceState]);

  return {
    presenceState,
    recentActivity,
    isConnected,
    updatePresence,
    broadcastActivity,
    getOnlineUsers
  };
}