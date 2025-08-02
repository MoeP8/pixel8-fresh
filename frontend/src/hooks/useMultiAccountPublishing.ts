import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { socialMediaService, PublishPostRequest } from '@/services/SocialMediaService';
import { slackService } from '@/services/integrations/SlackService';
import { supabase } from '@/integrations/supabase/client';

export interface SocialAccount {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  account_name: string;
  account_username: string;
  account_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  is_active: boolean;
  owner_name: string;
  owner_id: string;
  follower_count?: number;
  profile_image?: string;
  last_post_at?: string;
  account_type: 'personal' | 'business' | 'creator';
  team_role: 'owner' | 'admin' | 'editor' | 'viewer';
  client_id?: string;
  client_name?: string;
}

export interface PublishingResult {
  account_id: string;
  account_name: string;
  platform: string;
  success: boolean;
  post_id?: string;
  error?: string;
  published_at?: string;
}

export interface BulkPublishRequest {
  content: string;
  media_urls?: string[];
  scheduled_at?: string;
  account_ids: string[];
  platform_specific?: {
    [platform: string]: {
      content?: string;
      hashtags?: string[];
      mentions?: string[];
      link?: string;
    };
  };
}

export function useMultiAccountPublishing() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  // Load accounts on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  /**
   * Load all social media accounts for the current user and team
   */
  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // In a real implementation, this would fetch from the database
      // For now, using mock data that represents your 10+ team members with 40+ accounts
      const mockAccounts: SocialAccount[] = [
        // Moe's accounts
        {
          id: 'moe-ig-pixel8',
          platform: 'instagram',
          account_name: 'Pixel8 Agency',
          account_username: '@pixel8agency',
          account_id: 'pixel8_agency_ig',
          access_token: 'ig_token_1',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: user.id,
          follower_count: 15420,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'owner',
          client_id: 'pixel8-client',
          client_name: 'Pixel8 Internal'
        },
        {
          id: 'moe-fb-pixel8',
          platform: 'facebook',
          account_name: 'Pixel8 Digital',
          account_username: 'pixel8digital',
          account_id: 'pixel8_digital_fb',
          access_token: 'fb_token_1',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: user.id,
          follower_count: 8760,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'owner',
          client_id: 'pixel8-client',
          client_name: 'Pixel8 Internal'
        },
        {
          id: 'moe-twitter-pixel8',
          platform: 'twitter',
          account_name: 'Pixel8 Studios',
          account_username: '@pixel8studios',
          account_id: 'pixel8_studios_tw',
          access_token: 'tw_token_1',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: user.id,
          follower_count: 5240,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'owner',
          client_id: 'pixel8-client',
          client_name: 'Pixel8 Internal'
        },
        {
          id: 'moe-linkedin-personal',
          platform: 'linkedin',
          account_name: 'Moe EZ - CEO',
          account_username: 'moeez-ceo',
          account_id: 'moeez_ceo_li',
          access_token: 'li_token_1',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: user.id,
          follower_count: 3420,
          profile_image: '/api/placeholder/40/40',
          account_type: 'personal',
          team_role: 'owner'
        },
        // Client accounts managed by Moe
        {
          id: 'client-techcorp-ig',
          platform: 'instagram',
          account_name: 'TechCorp Official',
          account_username: '@techcorp_official',
          account_id: 'techcorp_official_ig',
          access_token: 'ig_token_2',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: user.id,
          follower_count: 42300,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'admin',
          client_id: 'techcorp-client',
          client_name: 'TechCorp Solutions'
        },
        {
          id: 'client-greenenergy-fb',
          platform: 'facebook',
          account_name: 'GreenEnergy Co',
          account_username: 'greenenergy.co',
          account_id: 'greenenergy_co_fb',
          access_token: 'fb_token_2',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: user.id,
          follower_count: 18900,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'admin',
          client_id: 'greenenergy-client',
          client_name: 'GreenEnergy Co'
        },
        // Team member accounts (Sarah Chen)
        {
          id: 'sarah-retailmax-ig',
          platform: 'instagram',
          account_name: 'RetailMax Inc',
          account_username: '@retailmax_inc',
          account_id: 'retailmax_inc_ig',
          access_token: 'ig_token_3',
          is_active: true,
          owner_name: 'Sarah Chen',
          owner_id: 'sarah-chen-id',
          follower_count: 25600,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'editor',
          client_id: 'retailmax-client',
          client_name: 'RetailMax Inc'
        },
        {
          id: 'sarah-foodtech-li',
          platform: 'linkedin',
          account_name: 'FoodTech Innovations',
          account_username: 'foodtech-innovations',
          account_id: 'foodtech_innovations_li',
          access_token: 'li_token_2',
          is_active: true,
          owner_name: 'Sarah Chen',
          owner_id: 'sarah-chen-id',
          follower_count: 12400,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'editor',
          client_id: 'foodtech-client',
          client_name: 'FoodTech Innovations'
        },
        // Team member accounts (Alex Rodriguez)
        {
          id: 'alex-healthplus-fb',
          platform: 'facebook',
          account_name: 'HealthPlus Wellness',
          account_username: 'healthplus.wellness',
          account_id: 'healthplus_wellness_fb',
          access_token: 'fb_token_3',
          is_active: false, // Temporarily disabled
          owner_name: 'Alex Rodriguez',
          owner_id: 'alex-rodriguez-id',
          follower_count: 31200,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'editor',
          client_id: 'healthplus-client',
          client_name: 'HealthPlus Wellness'
        },
        {
          id: 'alex-fintech-tw',
          platform: 'twitter',
          account_name: 'FinTech Solutions',
          account_username: '@fintech_solutions',
          account_id: 'fintech_solutions_tw',
          access_token: 'tw_token_2',
          is_active: true,
          owner_name: 'Alex Rodriguez',
          owner_id: 'alex-rodriguez-id',
          follower_count: 8900,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'editor',
          client_id: 'fintech-client',
          client_name: 'FinTech Solutions'
        }
      ];

      setAccounts(mockAccounts);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      toast({
        title: "Failed to load accounts",
        description: "Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Publish to multiple accounts simultaneously
   */
  const publishToMultipleAccounts = async (request: BulkPublishRequest): Promise<PublishingResult[]> => {
    setIsPublishing(true);
    const results: PublishingResult[] = [];

    try {
      // Get current user for permission checking
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get selected accounts and filter by permissions
      const selectedAccounts = accounts.filter(account => 
        request.account_ids.includes(account.id) && 
        canPublishToAccount(account, user.id)
      );

      if (selectedAccounts.length === 0) {
        throw new Error('No valid accounts selected for publishing or insufficient permissions');
      }

      // Check if any accounts were filtered out due to permissions
      const filteredCount = request.account_ids.length - selectedAccounts.length;
      if (filteredCount > 0) {
        toast({
          title: "Permission Notice",
          description: `${filteredCount} account(s) skipped due to insufficient permissions.`,
          variant: "default"
        });
      }

      // Send notification that publishing started
      await slackService.sendNotification(
        `🚀 Publishing to ${selectedAccounts.length} accounts: ${selectedAccounts.map(a => `${a.account_name} (${a.platform})`).join(', ')}`
      );

      // Publish to each account
      const publishPromises = selectedAccounts.map(async (account) => {
        try {
          // Prepare platform-specific content
          const platformContent = request.platform_specific?.[account.platform] || {};
          const finalContent = platformContent.content || request.content;

          const publishRequest: PublishPostRequest = {
            content: finalContent,
            media_urls: request.media_urls,
            scheduled_at: request.scheduled_at,
            platform_specific: {
              [account.platform]: {
                caption: finalContent,
                hashtags: platformContent.hashtags,
                mentions: platformContent.mentions,
                link: platformContent.link
              }
            }
          };

          // Use the existing SocialMediaService to publish
          const result = await socialMediaService.publishPost(
            account.account_id,
            account.platform,
            publishRequest
          );

          const publishResult: PublishingResult = {
            account_id: account.id,
            account_name: account.account_name,
            platform: account.platform,
            success: result.success,
            post_id: result.platform_post_id,
            published_at: result.published_at,
            error: result.error
          };

          // Update account last post time if successful
          if (result.success) {
            const accountIndex = accounts.findIndex(a => a.id === account.id);
            if (accountIndex !== -1) {
              setAccounts(prev => prev.map((acc, idx) => 
                idx === accountIndex 
                  ? { ...acc, last_post_at: new Date().toISOString() }
                  : acc
              ));
            }
          }

          return publishResult;
        } catch (error) {
          return {
            account_id: account.id,
            account_name: account.account_name,
            platform: account.platform,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const publishResults = await Promise.all(publishPromises);
      results.push(...publishResults);

      // Send summary notification
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length === 0) {
        await slackService.sendPublishingSuccess(
          'Multi-Account Campaign',
          successful.map(r => `${r.account_name} (${r.platform})`),
          { views: 0, likes: 0, comments: 0 }
        );

        toast({
          title: `🎉 Published to all ${successful.length} accounts!`,
          description: "Content successfully published across all selected platforms.",
        });
      } else {
        await slackService.sendNotification(
          `⚠️ Publishing completed with mixed results: ${successful.length} succeeded, ${failed.length} failed. Failed accounts: ${failed.map(f => `${f.account_name} (${f.error})`).join(', ')}`
        );

        toast({
          title: `⚠️ Partially successful`,
          description: `${successful.length} succeeded, ${failed.length} failed. Check details for errors.`,
          variant: failed.length > successful.length ? "destructive" : "default"
        });
      }

    } catch (error) {
      console.error('Bulk publishing failed:', error);
      toast({
        title: "Publishing failed",
        description: "An error occurred during bulk publishing.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }

    return results;
  };

  /**
   * Get accounts filtered by various criteria
   */
  const getAccountsByPlatform = (platform: string): SocialAccount[] => {
    return accounts.filter(account => account.platform === platform);
  };

  const getAccountsByOwner = (ownerId: string): SocialAccount[] => {
    return accounts.filter(account => account.owner_id === ownerId);
  };

  const getAccountsByClient = (clientId: string): SocialAccount[] => {
    return accounts.filter(account => account.client_id === clientId);
  };

  const getActiveAccounts = (): SocialAccount[] => {
    return accounts.filter(account => account.is_active);
  };

  /**
   * Check if user can publish to an account based on team role
   */
  const canPublishToAccount = (account: SocialAccount, currentUserId: string): boolean => {
    // Owner can always publish
    if (account.owner_id === currentUserId) return true;
    
    // Role-based permissions
    switch (account.team_role) {
      case 'owner':
        return account.owner_id === currentUserId;
      case 'admin':
        return true; // Admins can publish to any account they have access to
      case 'editor':
        return true; // Editors can publish
      case 'viewer':
        return false; // Viewers cannot publish
      default:
        return false;
    }
  };

  /**
   * Get accounts the current user can publish to
   */
  const getPublishableAccounts = async (): Promise<SocialAccount[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      return accounts.filter(account => 
        account.is_active && canPublishToAccount(account, user.id)
      );
    } catch (error) {
      console.error('Failed to get publishable accounts:', error);
      return [];
    }
  };

  /**
   * Check if user can manage account settings
   */
  const canManageAccount = (account: SocialAccount, currentUserId: string): boolean => {
    // Only owners and admins can manage account settings
    return account.owner_id === currentUserId || 
           ['owner', 'admin'].includes(account.team_role);
  };

  /**
   * Get publishing statistics
   */
  const getPublishingStats = () => {
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter(a => a.is_active).length;
    const platformCounts = accounts.reduce((acc, account) => {
      acc[account.platform] = (acc[account.platform] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const teamMembers = new Set(accounts.map(a => a.owner_name)).size;
    const clients = new Set(accounts.map(a => a.client_name).filter(Boolean)).size;
    
    return {
      totalAccounts,
      activeAccounts,
      inactiveAccounts: totalAccounts - activeAccounts,
      platformCounts,
      teamMembers,
      clients,
      totalFollowers: accounts.reduce((sum, acc) => sum + (acc.follower_count || 0), 0)
    };
  };

  /**
   * Test connection to a specific account
   */
  const testAccountConnection = async (accountId: string): Promise<boolean> => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return false;

    try {
      // This would test the actual API connection
      // For now, simulate with the account's active status
      return account.is_active;
    } catch (error) {
      console.error('Account connection test failed:', error);
      return false;
    }
  };

  /**
   * Update account status
   */
  const updateAccountStatus = async (accountId: string, isActive: boolean): Promise<boolean> => {
    try {
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { ...account, is_active: isActive }
          : account
      ));
      
      toast({
        title: isActive ? "Account activated" : "Account deactivated",
        description: "Account status updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Failed to update account status:', error);
      return false;
    }
  };

  return {
    accounts,
    isLoading,
    isPublishing,
    loadAccounts,
    publishToMultipleAccounts,
    getAccountsByPlatform,
    getAccountsByOwner,
    getAccountsByClient,
    getActiveAccounts,
    getPublishableAccounts,
    canPublishToAccount,
    canManageAccount,
    getPublishingStats,
    testAccountConnection,
    updateAccountStatus
  };
}