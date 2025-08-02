import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMockData } from "@/hooks/useMockData";
import { socialMediaService, type PublishPostRequest } from "@/services/SocialMediaService";
import { errorHandlingService, ErrorCategory, ErrorSeverity } from "@/services/ErrorHandlingService";

export interface ScheduledPost {
  id: string;
  client_id: string;
  created_by: string;
  title: string;
  content_data: any;
  platform: string;
  scheduled_at: string;
  content_pillar_id?: string;
  approval_id?: string;
  posting_status: 'scheduled' | 'posted' | 'failed' | 'cancelled';
  brand_compliance_score: number;
  optimal_time_score: number;
  recurring_rule_id?: string;
  posted_at?: string;
  failure_reason?: string;
  engagement_data: any;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
    logo_url?: string;
  };
  content_pillar?: {
    name: string;
    pillar_type: string;
  };
}

export interface OptimalTime {
  id: string;
  client_id: string;
  platform: string;
  day_of_week: number;
  hour_of_day: number;
  engagement_score: number;
  audience_size_score: number;
  brand_pillar_id?: string;
  performance_data: any;
}

export interface ContentDistributionRule {
  id: string;
  client_id: string;
  name: string;
  pillar_distribution: any;
  platform_distribution: any;
  minimum_gap_hours: number;
  maximum_posts_per_day: number;
  is_active: boolean;
}

export function useScheduling() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [distributionRules, setDistributionRules] = useState<ContentDistributionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { mockScheduledPosts } = useMockData();

  const fetchScheduledPosts = async (clientIds?: string[]) => {
    try {
      setLoading(true);
      let query = supabase
        .from('scheduled_posts')
        .select(`
          *,
          client:clients(name, logo_url),
          content_pillar:content_pillars(name, pillar_type)
        `)
        .order('scheduled_at', { ascending: true });

      if (clientIds && clientIds.length > 0) {
        query = query.in('client_id', clientIds);
      }

      const { data, error } = await query;
      if (error) throw error;
      // Use mock data if no real data exists
      setScheduledPosts(data?.length ? (data as any) : mockScheduledPosts as ScheduledPost[]);
    } catch (err: any) {
      setError(err.message);
      // Fallback to mock data on error
      setScheduledPosts(mockScheduledPosts as ScheduledPost[]);
      toast({
        variant: "destructive",
        title: "Error fetching scheduled posts",
        description: "Using demo data. " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOptimalTimes = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('optimal_posting_times')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;
      setOptimalTimes((data as any) || []);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error fetching optimal times",
        description: err.message,
      });
    }
  };

  const createScheduledPost = async (postData: any) => {
    try {
      const userResult = await supabase.auth.getUser();
      
      // Validate post content before scheduling
      const validation = await socialMediaService.validatePostContent(
        postData.platform,
        postData.content_data?.caption || postData.content_data?.message || '',
        postData.content_data?.media_urls
      );
      
      if (!validation.valid) {
        const errorMessage = validation.errors.join(', ');
        errorHandlingService.logError({
          message: `Post validation failed: ${errorMessage}`,
          category: ErrorCategory.VALIDATION,
          severity: ErrorSeverity.MEDIUM,
          context: { postData, validationErrors: validation.errors }
        });
        throw new Error(errorMessage);
      }

      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert([{
          ...postData,
          created_by: userResult.data.user?.id,
          posting_status: 'scheduled'
        }])
        .select()
        .single();

      if (error) {
        errorHandlingService.handleDatabaseError('insert scheduled_post', error);
        throw error;
      }
      
      setScheduledPosts(prev => [...prev, data as any]);
      toast({
        title: "Post scheduled",
        description: "Your content has been scheduled successfully.",
      });
      
      // If scheduled for immediate posting, publish now
      const scheduledTime = new Date(postData.scheduled_at);
      const now = new Date();
      if (scheduledTime <= now) {
        await publishScheduledPost(data.id);
      }
      
      return data;
    } catch (err: any) {
      errorHandlingService.handleSchedulingError('new_post', err);
      toast({
        variant: "destructive",
        title: "Error scheduling post",
        description: err.message,
      });
      throw err;
    }
  };

  const updateScheduledPost = async (postId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('scheduled_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      setScheduledPosts(prev => prev.map(post => 
        post.id === postId ? data as any : post
      ));

      toast({
        title: "Post updated",
        description: "Scheduled post has been updated successfully.",
      });
      return data;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error updating post",
        description: err.message,
      });
      throw err;
    }
  };

  const deleteScheduledPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setScheduledPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "Scheduled post has been removed.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error deleting post",
        description: err.message,
      });
      throw err;
    }
  };

  const bulkSchedulePosts = async (posts: any[]) => {
    try {
      const userResult = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert(posts.map(post => ({
          ...post,
          created_by: userResult.data.user?.id,
        })))
        .select();

      if (error) throw error;

      setScheduledPosts(prev => [...prev, ...(data as any)]);
      toast({
        title: "Bulk scheduling completed",
        description: `${posts.length} posts have been scheduled.`,
      });
      return data;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error bulk scheduling",
        description: err.message,
      });
      throw err;
    }
  };

  const getOptimalTimeSuggestions = (clientId: string, platform: string, pillarId?: string) => {
    return optimalTimes
      .filter(time => 
        time.client_id === clientId && 
        time.platform === platform &&
        (!pillarId || time.brand_pillar_id === pillarId)
      )
      .sort((a, b) => (b.engagement_score + b.audience_size_score) - (a.engagement_score + a.audience_size_score))
      .slice(0, 5);
  };

  const publishScheduledPost = async (postId: string) => {
    try {
      const post = scheduledPosts.find(p => p.id === postId);
      if (!post) {
        throw new Error('Scheduled post not found');
      }

      // Get social media account for this post
      const { data: account, error: accountError } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('client_id', post.client_id)
        .eq('platform', post.platform)
        .eq('is_active', true)
        .single();

      if (accountError || !account) {
        throw new Error(`No active ${post.platform} account found for this client`);
      }

      // Prepare publish request
      const publishRequest: PublishPostRequest = {
        content: post.content_data?.caption || post.content_data?.message || post.title,
        media_urls: post.content_data?.media_urls,
        platform_specific: {
          [post.platform]: {
            ...post.content_data,
            hashtags: post.content_data?.hashtags
          }
        }
      };

      // Publish to social media platform
      const publishResult = await socialMediaService.publishPost(
        account.id,
        post.platform,
        publishRequest
      );

      if (!publishResult.success) {
        throw new Error(publishResult.error || 'Publishing failed');
      }

      // Update post status in database
      const { error: updateError } = await supabase
        .from('scheduled_posts')
        .update({
          posting_status: 'posted',
          posted_at: publishResult.published_at,
          engagement_data: {
            platform_post_id: publishResult.platform_post_id,
            published_at: publishResult.published_at
          }
        })
        .eq('id', postId);

      if (updateError) {
        errorHandlingService.handleDatabaseError('update posted status', updateError);
      }

      // Update local state
      setScheduledPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              posting_status: 'posted' as const,
              posted_at: publishResult.published_at,
              engagement_data: {
                platform_post_id: publishResult.platform_post_id,
                published_at: publishResult.published_at
              }
            }
          : p
      ));

      toast({
        title: "Post published successfully",
        description: `Your ${post.platform} post is now live!`,
      });

      return publishResult;
    } catch (err: any) {
      // Update post status to failed
      const { error: failError } = await supabase
        .from('scheduled_posts')
        .update({
          posting_status: 'failed',
          failure_reason: err.message
        })
        .eq('id', postId);

      if (failError) {
        errorHandlingService.handleDatabaseError('update failed status', failError);
      }

      setScheduledPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, posting_status: 'failed' as const, failure_reason: err.message }
          : p
      ));

      errorHandlingService.handlePublishingError('unknown', postId, err);
      toast({
        variant: "destructive",
        title: "Publishing failed",
        description: err.message,
      });
      throw err;
    }
  };

  const retryFailedPost = async (postId: string) => {
    try {
      // Reset post status to scheduled
      const { error } = await supabase
        .from('scheduled_posts')
        .update({
          posting_status: 'scheduled',
          failure_reason: null
        })
        .eq('id', postId);

      if (error) throw error;

      // Attempt to publish again
      await publishScheduledPost(postId);
    } catch (err: any) {
      errorHandlingService.handleSchedulingError(postId, err);
      throw err;
    }
  };

  const validateContentDistribution = (newPost: any, existingPosts: ScheduledPost[]) => {
    const rule = distributionRules.find(r => r.client_id === newPost.client_id && r.is_active);
    if (!rule) return { valid: true, issues: [] };

    const issues: string[] = [];
    const postDate = new Date(newPost.scheduled_at);
    const dayStart = new Date(postDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(postDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Check posts on the same day
    const sameDayPosts = existingPosts.filter(post => {
      const postScheduledAt = new Date(post.scheduled_at);
      return postScheduledAt >= dayStart && postScheduledAt <= dayEnd && post.client_id === newPost.client_id;
    });

    // Check maximum posts per day
    if (sameDayPosts.length >= rule.maximum_posts_per_day) {
      issues.push(`Maximum ${rule.maximum_posts_per_day} posts per day exceeded`);
    }

    // Check minimum gap between posts
    const minGapMs = rule.minimum_gap_hours * 60 * 60 * 1000;
    const hasConflict = sameDayPosts.some(post => {
      const timeDiff = Math.abs(new Date(post.scheduled_at).getTime() - postDate.getTime());
      return timeDiff < minGapMs;
    });

    if (hasConflict) {
      issues.push(`Minimum ${rule.minimum_gap_hours} hour gap required between posts`);
    }

    return { valid: issues.length === 0, issues };
  };

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  return {
    scheduledPosts,
    optimalTimes,
    distributionRules,
    loading,
    error,
    fetchScheduledPosts,
    fetchOptimalTimes,
    createScheduledPost,
    updateScheduledPost,
    deleteScheduledPost,
    bulkSchedulePosts,
    publishScheduledPost,
    retryFailedPost,
    getOptimalTimeSuggestions,
    validateContentDistribution,
  };
}