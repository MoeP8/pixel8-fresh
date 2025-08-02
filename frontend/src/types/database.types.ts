// =============================================
// PIXEL8 SOCIAL HUB - DATABASE TYPES
// =============================================
// Auto-generated TypeScript types for Supabase

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'owner' | 'admin' | 'editor' | 'viewer';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'owner' | 'admin' | 'editor' | 'viewer';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'owner' | 'admin' | 'editor' | 'viewer';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          plan: 'free' | 'pro' | 'enterprise';
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          plan?: 'free' | 'pro' | 'enterprise';
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          plan?: 'free' | 'pro' | 'enterprise';
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_accounts: {
        Row: {
          id: string;
          organization_id: string;
          platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
          account_name: string;
          account_handle: string;
          account_id: string;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          avatar_url: string | null;
          follower_count: number;
          is_active: boolean;
          connected_by: string | null;
          connected_at: string;
          last_sync_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
          account_name: string;
          account_handle: string;
          account_id: string;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          avatar_url?: string | null;
          follower_count?: number;
          is_active?: boolean;
          connected_by?: string | null;
          connected_at?: string;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          platform?: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
          account_name?: string;
          account_handle?: string;
          account_id?: string;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          avatar_url?: string | null;
          follower_count?: number;
          is_active?: boolean;
          connected_by?: string | null;
          connected_at?: string;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          organization_id: string;
          title: string | null;
          content: string;
          status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
          post_type: 'text' | 'image' | 'video' | 'carousel' | 'story';
          scheduled_at: string | null;
          published_at: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title?: string | null;
          content: string;
          status?: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
          post_type?: 'text' | 'image' | 'video' | 'carousel' | 'story';
          scheduled_at?: string | null;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string | null;
          content?: string;
          status?: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
          post_type?: 'text' | 'image' | 'video' | 'carousel' | 'story';
          scheduled_at?: string | null;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
