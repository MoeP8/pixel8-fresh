import { supabase } from '@/integrations/supabase/client';

export interface SocialMediaAccount {
  id: string;
  platform: string;
  account_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  account_name: string;
  account_username?: string;
  is_active: boolean;
}

export interface PublishPostRequest {
  content: string;
  media_urls?: string[];
  scheduled_at?: string;
  platform_specific?: {
    instagram?: {
      caption?: string;
      alt_text?: string;
    };
    facebook?: {
      message?: string;
      link?: string;
    };
    twitter?: {
      tweet_text?: string;
      reply_to?: string;
    };
    linkedin?: {
      commentary?: string;
      article_url?: string;
    };
  };
}

export interface PublishResponse {
  success: boolean;
  platform_post_id?: string;
  error?: string;
  published_at?: string;
}

class SocialMediaService {
  private static instance: SocialMediaService;
  
  static getInstance(): SocialMediaService {
    if (!SocialMediaService.instance) {
      SocialMediaService.instance = new SocialMediaService();
    }
    return SocialMediaService.instance;
  }

  async publishToInstagram(accountId: string, postData: PublishPostRequest): Promise<PublishResponse> {
    try {
      const account = await this.getAccountById(accountId);
      if (!account || !account.access_token) {
        throw new Error('Instagram account not connected or token expired');
      }

      const mediaIds: string[] = [];
      
      if (postData.media_urls && postData.media_urls.length > 0) {
        for (const mediaUrl of postData.media_urls) {
          const mediaId = await this.uploadInstagramMedia(account.access_token, account.account_id, mediaUrl);
          mediaIds.push(mediaId);
        }
      }

      const caption = postData.platform_specific?.instagram?.caption || postData.content;
      
      let publishResponse;
      if (mediaIds.length > 1) {
        publishResponse = await this.publishInstagramCarousel(account.access_token, account.account_id, mediaIds, caption);
      } else if (mediaIds.length === 1) {
        publishResponse = await this.publishInstagramSingleMedia(account.access_token, account.account_id, mediaIds[0], caption);
      } else {
        throw new Error('Instagram posts require at least one media item');
      }

      return {
        success: true,
        platform_post_id: publishResponse.id,
        published_at: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Instagram publish error:', error);
      return {
        success: false,
        error: error.message || 'Failed to publish to Instagram'
      };
    }
  }

  async publishToFacebook(accountId: string, postData: PublishPostRequest): Promise<PublishResponse> {
    try {
      const account = await this.getAccountById(accountId);
      if (!account || !account.access_token) {
        throw new Error('Facebook account not connected or token expired');
      }

      const message = postData.platform_specific?.facebook?.message || postData.content;
      const link = postData.platform_specific?.facebook?.link;

      const postPayload: any = {
        message,
        access_token: account.access_token
      };

      if (link) {
        postPayload.link = link;
      }

      if (postData.media_urls && postData.media_urls.length > 0) {
        postPayload.url = postData.media_urls[0];
      }

      const response = await fetch(`https://graph.facebook.com/v18.0/${account.account_id}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Facebook API error');
      }

      return {
        success: true,
        platform_post_id: result.id,
        published_at: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Facebook publish error:', error);
      return {
        success: false,
        error: error.message || 'Failed to publish to Facebook'
      };
    }
  }

  async publishToTwitter(accountId: string, postData: PublishPostRequest): Promise<PublishResponse> {
    try {
      const account = await this.getAccountById(accountId);
      if (!account || !account.access_token) {
        throw new Error('Twitter account not connected or token expired');
      }

      const tweetText = postData.platform_specific?.twitter?.tweet_text || postData.content;
      
      if (tweetText.length > 280) {
        throw new Error('Tweet text exceeds 280 character limit');
      }

      const tweetData: any = {
        text: tweetText
      };

      if (postData.media_urls && postData.media_urls.length > 0) {
        const mediaIds = await this.uploadTwitterMedia(account.access_token, postData.media_urls);
        tweetData.media = { media_ids: mediaIds };
      }

      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tweetData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || 'Twitter API error');
      }

      return {
        success: true,
        platform_post_id: result.data.id,
        published_at: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Twitter publish error:', error);
      return {
        success: false,
        error: error.message || 'Failed to publish to Twitter'
      };
    }
  }

  async publishToLinkedIn(accountId: string, postData: PublishPostRequest): Promise<PublishResponse> {
    try {
      const account = await this.getAccountById(accountId);
      if (!account || !account.access_token) {
        throw new Error('LinkedIn account not connected or token expired');
      }

      const commentary = postData.platform_specific?.linkedin?.commentary || postData.content;
      
      const postPayload: any = {
        author: `urn:li:person:${account.account_id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: commentary
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      if (postData.media_urls && postData.media_urls.length > 0) {
        const mediaAssets = await this.uploadLinkedInMedia(account.access_token, postData.media_urls);
        postPayload.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
        postPayload.specificContent['com.linkedin.ugc.ShareContent'].media = mediaAssets;
      }

      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'LinkedIn API error');
      }

      return {
        success: true,
        platform_post_id: result.id,
        published_at: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('LinkedIn publish error:', error);
      return {
        success: false,
        error: error.message || 'Failed to publish to LinkedIn'
      };
    }
  }

  private async uploadInstagramMedia(accessToken: string, accountId: string, mediaUrl: string): Promise<string> {
    const response = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: mediaUrl,
        access_token: accessToken
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to upload Instagram media');
    }

    return result.id;
  }

  private async publishInstagramSingleMedia(accessToken: string, accountId: string, mediaId: string, caption: string): Promise<any> {
    const response = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media_publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creation_id: mediaId,
        caption,
        access_token: accessToken
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to publish Instagram media');
    }

    return result;
  }

  private async publishInstagramCarousel(accessToken: string, accountId: string, mediaIds: string[], caption: string): Promise<any> {
    const carouselResponse = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media_type: 'CAROUSEL',
        children: mediaIds,
        caption,
        access_token: accessToken
      })
    });

    const carouselResult = await carouselResponse.json();
    if (!carouselResponse.ok) {
      throw new Error(carouselResult.error?.message || 'Failed to create Instagram carousel');
    }

    return await this.publishInstagramSingleMedia(accessToken, accountId, carouselResult.id, caption);
  }

  private async uploadTwitterMedia(accessToken: string, mediaUrls: string[]): Promise<string[]> {
    const mediaIds: string[] = [];
    
    for (const mediaUrl of mediaUrls) {
      const response = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: new URLSearchParams({
          media_url: mediaUrl
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || 'Failed to upload Twitter media');
      }

      mediaIds.push(result.media_id_string);
    }

    return mediaIds;
  }

  private async uploadLinkedInMedia(accessToken: string, mediaUrls: string[]): Promise<any[]> {
    const mediaAssets: any[] = [];

    for (const mediaUrl of mediaUrls) {
      const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: `urn:li:person:${accessToken}`,
            serviceRelationships: [{
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }]
          }
        })
      });

      const registerResult = await registerResponse.json();
      if (!registerResponse.ok) {
        throw new Error('Failed to register LinkedIn media upload');
      }

      mediaAssets.push({
        status: 'READY',
        media: registerResult.value.asset
      });
    }

    return mediaAssets;
  }

  private async getAccountById(accountId: string): Promise<SocialMediaAccount | null> {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('id', accountId)
        .single();

      if (error) throw error;
      return data as SocialMediaAccount;
    } catch (error) {
      console.error('Error fetching social account:', error);
      return null;
    }
  }

  async refreshAccessToken(accountId: string, platform: string): Promise<boolean> {
    try {
      const account = await this.getAccountById(accountId);
      if (!account || !account.refresh_token) {
        return false;
      }

      let refreshUrl = '';
      let refreshPayload: any = {};

      switch (platform) {
        case 'facebook':
        case 'instagram':
          refreshUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
          refreshPayload = {
            grant_type: 'fb_exchange_token',
            client_id: process.env.VITE_FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: account.access_token
          };
          break;
        case 'twitter':
          refreshUrl = 'https://api.twitter.com/2/oauth2/token';
          refreshPayload = {
            grant_type: 'refresh_token',
            refresh_token: account.refresh_token,
            client_id: process.env.VITE_TWITTER_CLIENT_ID
          };
          break;
        case 'linkedin':
          refreshUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
          refreshPayload = {
            grant_type: 'refresh_token',
            refresh_token: account.refresh_token,
            client_id: process.env.VITE_LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET
          };
          break;
        default:
          return false;
      }

      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(refreshPayload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error_description || 'Token refresh failed');
      }

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + result.expires_in);

      await supabase
        .from('social_accounts')
        .update({
          access_token: result.access_token,
          refresh_token: result.refresh_token || account.refresh_token,
          expires_at: expiresAt.toISOString()
        })
        .eq('id', accountId);

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  async publishPost(accountId: string, platform: string, postData: PublishPostRequest): Promise<PublishResponse> {
    try {
      const account = await this.getAccountById(accountId);
      if (!account || !account.is_active) {
        throw new Error('Social media account not found or inactive');
      }

      if (account.expires_at && new Date(account.expires_at) <= new Date()) {
        const refreshed = await this.refreshAccessToken(accountId, platform);
        if (!refreshed) {
          throw new Error('Access token expired and refresh failed');
        }
      }

      switch (platform) {
        case 'instagram':
        case 'instagram_business':
          return await this.publishToInstagram(accountId, postData);
        case 'facebook':
        case 'facebook_pages':
          return await this.publishToFacebook(accountId, postData);
        case 'twitter':
          return await this.publishToTwitter(accountId, postData);
        case 'linkedin':
        case 'linkedin_company':
          return await this.publishToLinkedIn(accountId, postData);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async validatePostContent(platform: string, content: string, mediaUrls?: string[]): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    switch (platform) {
      case 'twitter':
        if (content.length > 280) {
          errors.push('Tweet content exceeds 280 character limit');
        }
        if (mediaUrls && mediaUrls.length > 4) {
          errors.push('Twitter allows maximum 4 media attachments');
        }
        break;
      case 'instagram':
      case 'instagram_business':
        if (content.length > 2200) {
          errors.push('Instagram caption exceeds 2200 character limit');
        }
        if (!mediaUrls || mediaUrls.length === 0) {
          errors.push('Instagram requires at least one media attachment');
        }
        if (mediaUrls && mediaUrls.length > 10) {
          errors.push('Instagram allows maximum 10 media attachments in carousel');
        }
        break;
      case 'facebook':
      case 'facebook_pages':
        if (content.length > 63206) {
          errors.push('Facebook post content is too long');
        }
        break;
      case 'linkedin':
      case 'linkedin_company':
        if (content.length > 3000) {
          errors.push('LinkedIn post content exceeds 3000 character limit');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const socialMediaService = SocialMediaService.getInstance();