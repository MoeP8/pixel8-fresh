// =============================================
// PIXEL8 SOCIAL HUB - SOCIAL MEDIA API SERVICE
// =============================================

import { supabase } from '../lib/supabase';
import type { SocialAccount, Post } from '../types/database.types';

// =============================================
// TYPES & INTERFACES
// =============================================

interface PublishRequest {
  content: string;
  mediaUrls?: string[];
  scheduledTime?: Date;
  platforms: string[];
}

interface PublishResponse {
  success: boolean;
  platformPostId?: string;
  error?: string;
  platform: string;
}

interface PlatformConfig {
  name: string;
  apiUrl: string;
  authMethod: 'bearer' | 'oauth';
  maxCharacters: number;
  supportsMedia: boolean;
  supportsScheduling: boolean;
}

// =============================================
// PLATFORM CONFIGURATIONS
// =============================================

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  facebook: {
    name: 'Facebook',
    apiUrl: 'https://graph.facebook.com/v18.0',
    authMethod: 'bearer',
    maxCharacters: 63206,
    supportsMedia: true,
    supportsScheduling: true,
  },
  instagram: {
    name: 'Instagram',
    apiUrl: 'https://graph.facebook.com/v18.0',
    authMethod: 'bearer',
    maxCharacters: 2200,
    supportsMedia: true,
    supportsScheduling: true,
  },
  twitter: {
    name: 'Twitter/X',
    apiUrl: 'https://api.twitter.com/2',
    authMethod: 'bearer',
    maxCharacters: 280,
    supportsMedia: true,
    supportsScheduling: false, // Requires third-party scheduling
  },
  linkedin: {
    name: 'LinkedIn',
    apiUrl: 'https://api.linkedin.com/v2',
    authMethod: 'bearer',
    maxCharacters: 3000,
    supportsMedia: true,
    supportsScheduling: false, // Requires third-party scheduling
  },
  tiktok: {
    name: 'TikTok',
    apiUrl: 'https://open-api.tiktok.com',
    authMethod: 'bearer',
    maxCharacters: 2200,
    supportsMedia: true,
    supportsScheduling: false,
  },
  youtube: {
    name: 'YouTube',
    apiUrl: 'https://www.googleapis.com/youtube/v3',
    authMethod: 'bearer',
    maxCharacters: 5000,
    supportsMedia: true,
    supportsScheduling: true,
  },
};

// =============================================
// SOCIAL MEDIA API SERVICE CLASS
// =============================================

export class SocialMediaAPIService {
  private accessTokens: Map<string, string> = new Map();

  constructor() {
    this.loadAccessTokens();
  }

  /**
   * Load access tokens from environment variables
   */
  private loadAccessTokens() {
    this.accessTokens.set('facebook', import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN || '');
    this.accessTokens.set('instagram', import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || '');
    this.accessTokens.set('twitter', import.meta.env.VITE_TWITTER_BEARER_TOKEN || '');
    this.accessTokens.set('linkedin', import.meta.env.VITE_LINKEDIN_ACCESS_TOKEN || '');
    this.accessTokens.set('tiktok', import.meta.env.VITE_TIKTOK_ACCESS_TOKEN || '');
    this.accessTokens.set('youtube', import.meta.env.VITE_YOUTUBE_ACCESS_TOKEN || '');
  }

  /**
   * Check if platform is configured and ready
   */
  isPlatformReady(platform: string): boolean {
    const token = this.accessTokens.get(platform);
    return !!(token && !token.includes('your_') && !token.includes('token_here'));
  }

  /**
   * Get platform configuration
   */
  getPlatformConfig(platform: string): PlatformConfig | null {
    return PLATFORM_CONFIGS[platform] || null;
  }

  /**
   * Validate content for platform constraints
   */
  validateContent(platform: string, content: string): { valid: boolean; error?: string } {
    const config = this.getPlatformConfig(platform);
    if (!config) {
      return { valid: false, error: 'Platform not supported' };
    }

    if (content.length > config.maxCharacters) {
      return { 
        valid: false, 
        error: `Content exceeds ${config.maxCharacters} character limit for ${config.name}` 
      };
    }

    return { valid: true };
  }

  /**
   * Publish content to multiple platforms
   */
  async publishToMultiplePlatforms(request: PublishRequest): Promise<PublishResponse[]> {
    const results: PublishResponse[] = [];

    for (const platform of request.platforms) {
      try {
        const result = await this.publishToPlatform(platform, request);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          platform,
        });
      }
    }

    return results;
  }

  /**
   * Publish content to a single platform
   */
  async publishToPlatform(platform: string, request: PublishRequest): Promise<PublishResponse> {
    if (!this.isPlatformReady(platform)) {
      return {
        success: false,
        error: `${platform} not configured. Please add API credentials to .env.local`,
        platform,
      };
    }

    // Validate content
    const validation = this.validateContent(platform, request.content);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        platform,
      };
    }

    // Route to platform-specific publish method
    switch (platform) {
      case 'facebook':
        return this.publishToFacebook(request);
      case 'instagram':
        return this.publishToInstagram(request);
      case 'twitter':
        return this.publishToTwitter(request);
      case 'linkedin':
        return this.publishToLinkedIn(request);
      case 'tiktok':
        return this.publishToTikTok(request);
      case 'youtube':
        return this.publishToYouTube(request);
      default:
        return {
          success: false,
          error: `Platform ${platform} not implemented`,
          platform,
        };
    }
  }

  /**
   * Facebook publishing
   */
  private async publishToFacebook(request: PublishRequest): Promise<PublishResponse> {
    const token = this.accessTokens.get('facebook');
    const config = PLATFORM_CONFIGS.facebook;

    try {
      const payload: any = {
        message: request.content,
        access_token: token,
      };

      // Add media if provided
      if (request.mediaUrls && request.mediaUrls.length > 0) {
        payload.link = request.mediaUrls[0]; // Facebook handles media via URL
      }

      // Add scheduling if provided
      if (request.scheduledTime && config.supportsScheduling) {
        payload.published = false;
        payload.scheduled_publish_time = Math.floor(request.scheduledTime.getTime() / 1000);
      }

      const response = await fetch(`${config.apiUrl}/me/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        return {
          success: true,
          platformPostId: data.id,
          platform: 'facebook',
        };
      } else {
        return {
          success: false,
          error: data.error?.message || 'Facebook API error',
          platform: 'facebook',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Facebook publish failed',
        platform: 'facebook',
      };
    }
  }

  /**
   * Instagram publishing
   */
  private async publishToInstagram(request: PublishRequest): Promise<PublishResponse> {
    const token = this.accessTokens.get('instagram');
    const config = PLATFORM_CONFIGS.instagram;

    try {
      // Instagram requires media for posts
      if (!request.mediaUrls || request.mediaUrls.length === 0) {
        return {
          success: false,
          error: 'Instagram posts require at least one media item',
          platform: 'instagram',
        };
      }

      // Step 1: Create media container
      const mediaPayload = {
        image_url: request.mediaUrls[0],
        caption: request.content,
        access_token: token,
      };

      const mediaResponse = await fetch(`${config.apiUrl}/me/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaPayload),
      });

      const mediaData = await mediaResponse.json();

      if (!mediaResponse.ok || !mediaData.id) {
        return {
          success: false,
          error: mediaData.error?.message || 'Instagram media creation failed',
          platform: 'instagram',
        };
      }

      // Step 2: Publish the media container
      const publishPayload = {
        creation_id: mediaData.id,
        access_token: token,
      };

      const publishResponse = await fetch(`${config.apiUrl}/me/media_publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishPayload),
      });

      const publishData = await publishResponse.json();

      if (publishResponse.ok && publishData.id) {
        return {
          success: true,
          platformPostId: publishData.id,
          platform: 'instagram',
        };
      } else {
        return {
          success: false,
          error: publishData.error?.message || 'Instagram publish failed',
          platform: 'instagram',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Instagram publish failed',
        platform: 'instagram',
      };
    }
  }

  /**
   * Twitter/X publishing
   */
  private async publishToTwitter(request: PublishRequest): Promise<PublishResponse> {
    const token = this.accessTokens.get('twitter');
    const config = PLATFORM_CONFIGS.twitter;

    try {
      const payload: any = {
        text: request.content,
      };

      // Add media if provided (requires media upload first)
      if (request.mediaUrls && request.mediaUrls.length > 0) {
        // Note: Twitter requires uploading media first to get media_ids
        // This is a simplified version - full implementation would handle media upload
        payload.media = {
          media_ids: [], // Would be populated after media upload
        };
      }

      const response = await fetch(`${config.apiUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.data?.id) {
        return {
          success: true,
          platformPostId: data.data.id,
          platform: 'twitter',
        };
      } else {
        return {
          success: false,
          error: data.errors?.[0]?.detail || 'Twitter API error',
          platform: 'twitter',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Twitter publish failed',
        platform: 'twitter',
      };
    }
  }

  /**
   * LinkedIn publishing
   */
  private async publishToLinkedIn(request: PublishRequest): Promise<PublishResponse> {
    const token = this.accessTokens.get('linkedin');
    const config = PLATFORM_CONFIGS.linkedin;

    try {
      const payload = {
        author: 'urn:li:person:YOUR_PERSON_ID', // Would be dynamically determined
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: request.content,
            },
            shareMediaCategory: 'NONE', // or 'IMAGE', 'VIDEO', etc.
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await fetch(`${config.apiUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        return {
          success: true,
          platformPostId: data.id,
          platform: 'linkedin',
        };
      } else {
        return {
          success: false,
          error: data.message || 'LinkedIn API error',
          platform: 'linkedin',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'LinkedIn publish failed',
        platform: 'linkedin',
      };
    }
  }

  /**
   * TikTok publishing
   */
  private async publishToTikTok(request: PublishRequest): Promise<PublishResponse> {
    return {
      success: false,
      error: 'TikTok API integration coming soon',
      platform: 'tiktok',
    };
  }

  /**
   * YouTube publishing
   */
  private async publishToYouTube(request: PublishRequest): Promise<PublishResponse> {
    return {
      success: false,
      error: 'YouTube API integration coming soon',
      platform: 'youtube',
    };
  }

  /**
   * Get account information for a platform
   */
  async getAccountInfo(platform: string): Promise<any> {
    if (!this.isPlatformReady(platform)) {
      throw new Error(`${platform} not configured`);
    }

    const token = this.accessTokens.get(platform);
    const config = this.getPlatformConfig(platform);

    if (!config) {
      throw new Error(`Platform ${platform} not supported`);
    }

    try {
      let endpoint = '';
      const headers: Record<string, string> = {};

      switch (platform) {
        case 'facebook':
          endpoint = `${config.apiUrl}/me?fields=id,name,picture&access_token=${token}`;
          break;
        case 'instagram':
          endpoint = `${config.apiUrl}/me?fields=id,username,media_count&access_token=${token}`;
          break;
        case 'twitter':
          endpoint = `${config.apiUrl}/users/me`;
          headers['Authorization'] = `Bearer ${token}`;
          break;
        case 'linkedin':
          endpoint = `${config.apiUrl}/me`;
          headers['Authorization'] = `Bearer ${token}`;
          break;
        default:
          throw new Error(`Account info not implemented for ${platform}`);
      }

      const response = await fetch(endpoint, { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `${platform} API error`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get ${platform} account info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sync social accounts with database
   */
  async syncSocialAccounts(organizationId: string): Promise<void> {
    const platforms = Object.keys(PLATFORM_CONFIGS);
    
    for (const platform of platforms) {
      if (!this.isPlatformReady(platform)) {
        continue;
      }

      try {
        const accountInfo = await this.getAccountInfo(platform);
        
        // Update or insert social account
        const { error } = await supabase
          .from('social_accounts')
          .upsert({
            organization_id: organizationId,
            platform,
            account_name: accountInfo.name || accountInfo.username || 'Unknown',
            account_handle: accountInfo.username || accountInfo.id,
            account_id: accountInfo.id,
            avatar_url: accountInfo.picture?.data?.url || accountInfo.profile_image_url,
            last_sync_at: new Date().toISOString(),
            is_active: true,
          }, {
            onConflict: 'organization_id,platform,account_id'
          });

        if (error) {
          console.error(`Failed to sync ${platform} account:`, error);
        }
      } catch (error) {
        console.error(`Failed to sync ${platform}:`, error);
      }
    }
  }
}

// =============================================
// SINGLETON INSTANCE
// =============================================

export const socialMediaAPI = new SocialMediaAPIService();

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Get platform status for UI display
 */
export function getPlatformStatus(): Record<string, { ready: boolean; config: PlatformConfig | null }> {
  const status: Record<string, { ready: boolean; config: PlatformConfig | null }> = {};
  
  Object.keys(PLATFORM_CONFIGS).forEach(platform => {
    status[platform] = {
      ready: socialMediaAPI.isPlatformReady(platform),
      config: socialMediaAPI.getPlatformConfig(platform),
    };
  });
  
  return status;
}

/**
 * Get ready platforms list
 */
export function getReadyPlatforms(): string[] {
  return Object.keys(PLATFORM_CONFIGS).filter(platform => 
    socialMediaAPI.isPlatformReady(platform)
  );
}

/**
 * Format platform name for display
 */
export function formatPlatformName(platform: string): string {
  const config = PLATFORM_CONFIGS[platform];
  return config?.name || platform.charAt(0).toUpperCase() + platform.slice(1);
}