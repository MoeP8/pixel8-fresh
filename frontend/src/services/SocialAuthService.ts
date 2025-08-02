import { supabase } from '@/integrations/supabase/client';
import { errorHandlingService, ErrorCategory, ErrorSeverity } from './ErrorHandlingService';

export interface AuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes: string[];
}

export interface AuthResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  accountInfo?: {
    id: string;
    name: string;
    username?: string;
    profilePicture?: string;
  };
  error?: string;
}

class SocialAuthService {
  private static instance: SocialAuthService;
  
  static getInstance(): SocialAuthService {
    if (!SocialAuthService.instance) {
      SocialAuthService.instance = new SocialAuthService();
    }
    return SocialAuthService.instance;
  }

  private getAuthConfig(platform: string): AuthConfig {
    const configs: Record<string, AuthConfig> = {
      facebook: {
        clientId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
        redirectUri: `${window.location.origin}/auth/facebook/callback`,
        scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list', 'instagram_basic', 'instagram_content_publish']
      },
      instagram: {
        clientId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
        redirectUri: `${window.location.origin}/auth/instagram/callback`,
        scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'pages_read_engagement']
      },
      twitter: {
        clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || '',
        redirectUri: `${window.location.origin}/auth/twitter/callback`,
        scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
      },
      linkedin: {
        clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
        redirectUri: `${window.location.origin}/auth/linkedin/callback`,
        scopes: ['w_member_social', 'r_liteprofile', 'r_emailaddress']
      }
    };

    return configs[platform];
  }

  async initiateAuth(platform: string, clientId: string): Promise<{ authUrl: string }> {
    try {
      const config = this.getAuthConfig(platform);
      if (!config.clientId) {
        throw new Error(`${platform} authentication not configured`);
      }

      let authUrl = '';
      const state = this.generateState(clientId, platform);

      switch (platform) {
        case 'facebook':
        case 'instagram':
          authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
            `client_id=${config.clientId}&` +
            `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
            `scope=${config.scopes.join(',')}&` +
            `state=${state}&` +
            `response_type=code`;
          break;

        case 'twitter': {
          // Twitter OAuth 2.0 with PKCE
          const codeVerifier = this.generateCodeVerifier();
          const codeChallenge = await this.generateCodeChallenge(codeVerifier);
          
          // Store code verifier for later use
          sessionStorage.setItem(`twitter_code_verifier_${state}`, codeVerifier);
          
          authUrl = `https://twitter.com/i/oauth2/authorize?` +
            `response_type=code&` +
            `client_id=${config.clientId}&` +
            `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
            `scope=${config.scopes.join('%20')}&` +
            `state=${state}&` +
            `code_challenge=${codeChallenge}&` +
            `code_challenge_method=S256`;
          break;
        }

        case 'linkedin':
          authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
            `response_type=code&` +
            `client_id=${config.clientId}&` +
            `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
            `scope=${config.scopes.join('%20')}&` +
            `state=${state}`;
          break;

        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      return { authUrl };
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to initiate ${platform} auth: ${error.message}`,
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH,
        context: { platform, clientId }
      });
      throw error;
    }
  }

  async handleAuthCallback(platform: string, code: string, state: string): Promise<AuthResult> {
    try {
      const { clientId } = this.parseState(state);
      const config = this.getAuthConfig(platform);

      let tokenResponse: any;

      switch (platform) {
        case 'facebook':
        case 'instagram':
          tokenResponse = await this.exchangeFacebookCode(code, config);
          break;
        case 'twitter':
          tokenResponse = await this.exchangeTwitterCode(code, state, config);
          break;
        case 'linkedin':
          tokenResponse = await this.exchangeLinkedInCode(code, config);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      if (!tokenResponse.success) {
        return tokenResponse;
      }

      // Get account information
      const accountInfo = await this.getAccountInfo(platform, tokenResponse.accessToken!);
      if (!accountInfo.success) {
        return accountInfo;
      }

      // Store account in database
      await this.saveAccountToDatabase(clientId, platform, {
        ...tokenResponse,
        accountInfo: accountInfo.accountInfo
      });

      return {
        ...tokenResponse,
        accountInfo: accountInfo.accountInfo
      };
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Auth callback failed for ${platform}: ${error.message}`,
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH,
        context: { platform, state }
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async exchangeFacebookCode(code: string, config: AuthConfig): Promise<AuthResult> {
    try {
      const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: config.clientId,
          client_secret: import.meta.env.VITE_FACEBOOK_APP_SECRET || '',
          code,
          redirect_uri: config.redirectUri
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Token exchange failed');
      }

      // Exchange short-lived token for long-lived token
      const longLivedResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      return {
        success: true,
        accessToken: data.access_token,
        expiresIn: data.expires_in
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async exchangeTwitterCode(code: string, state: string, config: AuthConfig): Promise<AuthResult> {
    try {
      const codeVerifier = sessionStorage.getItem(`twitter_code_verifier_${state}`);
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }

      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${config.clientId}:${import.meta.env.VITE_TWITTER_CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: config.clientId,
          redirect_uri: config.redirectUri,
          code_verifier: codeVerifier
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || 'Token exchange failed');
      }

      // Clean up code verifier
      sessionStorage.removeItem(`twitter_code_verifier_${state}`);

      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async exchangeLinkedInCode(code: string, config: AuthConfig): Promise<AuthResult> {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: config.clientId,
          client_secret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '',
          redirect_uri: config.redirectUri
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || 'Token exchange failed');
      }

      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async getAccountInfo(platform: string, accessToken: string): Promise<AuthResult> {
    try {
      let response: Response;
      let data: any;

      switch (platform) {
        case 'facebook':
          response = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,picture&access_token=${accessToken}`);
          data = await response.json();
          break;
        case 'instagram':
          response = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,username&access_token=${accessToken}`);
          data = await response.json();
          break;
        case 'twitter':
          response = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          data = await response.json();
          data = data.data; // Twitter wraps response in data object
          break;
        case 'linkedin':
          response = await fetch('https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          data = await response.json();
          break;
        default:
          throw new Error(`Account info not implemented for ${platform}`);
      }

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get account info');
      }

      // Normalize account info across platforms
      let accountInfo: any = {};
      
      switch (platform) {
        case 'facebook':
          accountInfo = {
            id: data.id,
            name: data.name,
            profilePicture: data.picture?.data?.url
          };
          break;
        case 'instagram':
          accountInfo = {
            id: data.id,
            name: data.username,
            username: data.username
          };
          break;
        case 'twitter':
          accountInfo = {
            id: data.id,
            name: data.name,
            username: data.username,
            profilePicture: data.profile_image_url
          };
          break;
        case 'linkedin':
          accountInfo = {
            id: data.id,
            name: `${data.firstName?.localized?.en_US || ''} ${data.lastName?.localized?.en_US || ''}`.trim(),
            profilePicture: data.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier
          };
          break;
      }

      return { success: true, accountInfo };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async saveAccountToDatabase(clientId: string, platform: string, authResult: AuthResult) {
    try {
      const expiresAt = authResult.expiresIn 
        ? new Date(Date.now() + authResult.expiresIn * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('social_accounts')
        .upsert({
          client_id: clientId,
          platform,
          account_id: authResult.accountInfo!.id,
          access_token: authResult.accessToken,
          refresh_token: authResult.refreshToken,
          expires_at: expiresAt,
          account_name: authResult.accountInfo!.name,
          account_username: authResult.accountInfo!.username,
          profile_picture_url: authResult.accountInfo!.profilePicture,
          is_active: true,
          connected_at: new Date().toISOString()
        }, {
          onConflict: 'client_id,platform,account_id'
        });

      if (error) {
        errorHandlingService.handleDatabaseError('save social account', error);
        throw error;
      }
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to save ${platform} account: ${error.message}`,
        category: ErrorCategory.DATABASE,
        severity: ErrorSeverity.HIGH,
        context: { clientId, platform }
      });
      throw error;
    }
  }

  private generateState(clientId: string, platform: string): string {
    const data = { clientId, platform, timestamp: Date.now() };
    return btoa(JSON.stringify(data));
  }

  private parseState(state: string): { clientId: string; platform: string; timestamp: number } {
    try {
      return JSON.parse(atob(state));
    } catch {
      throw new Error('Invalid state parameter');
    }
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async disconnectAccount(accountId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ is_active: false, disconnected_at: new Date().toISOString() })
        .eq('id', accountId);

      if (error) {
        errorHandlingService.handleDatabaseError('disconnect social account', error);
        throw error;
      }
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to disconnect account: ${error.message}`,
        category: ErrorCategory.DATABASE,
        severity: ErrorSeverity.MEDIUM,
        context: { accountId }
      });
      throw error;
    }
  }

  async getConnectedAccounts(clientId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .order('connected_at', { ascending: false });

      if (error) {
        errorHandlingService.handleDatabaseError('fetch social accounts', error);
        throw error;
      }

      return data || [];
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to fetch connected accounts: ${error.message}`,
        category: ErrorCategory.DATABASE,
        severity: ErrorSeverity.MEDIUM,
        context: { clientId }
      });
      return [];
    }
  }
}

export const socialAuthService = SocialAuthService.getInstance();