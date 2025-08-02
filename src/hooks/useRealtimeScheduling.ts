import { useEffect, useState } from 'react';
import { useScheduling, type ScheduledPost } from '@/hooks/useScheduling';
import { broadcastActivity } from '@/components/realtime/RealtimeProvider';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeScheduling() {
  const scheduling = useScheduling();
  const [realtimeUpdates, setRealtimeUpdates] = useState<string[]>([]);

  // Enhance the scheduling hook with realtime capabilities
  const createScheduledPostWithActivity = async (postData: any) => {
    try {
      const result = await scheduling.createScheduledPost(postData);
      
      // Broadcast activity
      await broadcastActivity('post_created', {
        title: postData.title,
        platform: postData.platform,
        scheduled_at: postData.scheduled_at,
        content: postData.content_data?.caption || postData.content_data?.message
      });

      return result;
    } catch (error) {
      await broadcastActivity('post_creation_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        platform: postData.platform
      });
      throw error;
    }
  };

  const updateScheduledPostWithActivity = async (postId: string, updates: any) => {
    try {
      const result = await scheduling.updateScheduledPost(postId, updates);
      
      // Determine what was updated
      let action = 'post_edited';
      if (updates.posting_status === 'approved') action = 'post_approved';
      if (updates.posting_status === 'rejected') action = 'post_rejected';
      if (updates.posting_status === 'posted') action = 'post_published';
      
      await broadcastActivity(action, {
        post_id: postId,
        title: result.title,
        platform: result.platform,
        updates
      });

      return result;
    } catch (error) {
      await broadcastActivity('post_update_failed', {
        post_id: postId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  };

  const deleteScheduledPostWithActivity = async (postId: string) => {
    // Get post details before deletion
    const post = scheduling.scheduledPosts.find(p => p.id === postId);
    
    try {
      await scheduling.deleteScheduledPost(postId);
      
      await broadcastActivity('post_deleted', {
        post_id: postId,
        title: post?.title,
        platform: post?.platform
      });
    } catch (error) {
      await broadcastActivity('post_deletion_failed', {
        post_id: postId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  };

  const publishScheduledPostWithActivity = async (postId: string) => {
    const post = scheduling.scheduledPosts.find(p => p.id === postId);
    
    try {
      // Broadcast that publishing started
      await broadcastActivity('post_publishing_started', {
        post_id: postId,
        title: post?.title,
        platform: post?.platform
      });

      const result = await scheduling.publishScheduledPost(postId);
      
      await broadcastActivity('post_published', {
        post_id: postId,
        title: post?.title,
        platform: post?.platform,
        published_at: result.published_at
      });

      return result;
    } catch (error) {
      await broadcastActivity('post_publishing_failed', {
        post_id: postId,
        title: post?.title,
        platform: post?.platform,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  };

  // Listen for realtime post status changes
  useEffect(() => {
    const channel = supabase
      .channel('scheduling-updates')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'scheduled_posts' 
        },
        (payload) => {
          const { new: newRecord, old: oldRecord } = payload;
          
          // Track status changes
          if (newRecord.posting_status !== oldRecord.posting_status) {
            setRealtimeUpdates(prev => [
              ...prev.slice(-9), // Keep last 10 updates
              `${newRecord.id}: ${oldRecord.posting_status} → ${newRecord.posting_status}`
            ]);

            // Broadcast status change activity
            const statusActions = {
              'posted': 'post_published',
              'failed': 'post_publishing_failed',
              'approved': 'post_approved',
              'rejected': 'post_rejected'
            };

            const action = statusActions[newRecord.posting_status as keyof typeof statusActions];
            if (action) {
              broadcastActivity(action, {
                post_id: newRecord.id,
                title: newRecord.title,
                platform: newRecord.platform,
                status: newRecord.posting_status,
                posted_at: newRecord.posted_at,
                failure_reason: newRecord.failure_reason
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-refresh posts when realtime updates occur
  useEffect(() => {
    if (realtimeUpdates.length > 0) {
      // Debounce the refresh to avoid too many API calls
      const timer = setTimeout(() => {
        scheduling.fetchScheduledPosts();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [realtimeUpdates, scheduling]);

  return {
    ...scheduling,
    createScheduledPost: createScheduledPostWithActivity,
    updateScheduledPost: updateScheduledPostWithActivity,
    deleteScheduledPost: deleteScheduledPostWithActivity,
    publishScheduledPost: publishScheduledPostWithActivity,
    realtimeUpdates
  };
}