export type SocialPlatform = 
  | 'instagram_business'
  | 'facebook_pages' 
  | 'tiktok_business'
  | 'youtube'
  | 'linkedin_company'
  | 'twitter'
  | 'threads'
  | 'snapchat_business';

export type ConnectionStatus = 
  | 'connected'
  | 'disconnected'
  | 'needs_reauth'
  | 'error'
  | 'pending';

export type HealthStatus = 
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'unknown';

export interface SocialAccount {
  account_id: string;
  platform: SocialPlatform;
  platform_account_id: string;
  account_name: string;
  account_username?: string;
  account_avatar_url?: string;
  connection_status: ConnectionStatus;
  health_status: HealthStatus;
  last_health_check?: string;
  health_issues: any;
  client_name?: string;
  client_id?: string;
  created_at: string;
}

export interface PlatformGuidelines {
  platform: SocialPlatform;
  character_limits: any;
  posting_guidelines: any;
  supported_media_types: any;
  api_rate_limits: any;
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}