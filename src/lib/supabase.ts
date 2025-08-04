// =============================================
// PIXEL8 SOCIAL HUB - SUPABASE CLIENT
// =============================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Use hardcoded values as fallback (from integrations/supabase/client.ts)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://wxbrfmjxrfhntjkdlcbz.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4YnJmbWp4cmZobnRqa2RsY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NzAzNTksImV4cCI6MjA2OTE0NjM1OX0.ie9jOgpXRcxS35K1JGkXxY88ymhtQWWIdEWJRzl6l-0";

console.log('🔐 Supabase: Initializing with URL:', supabaseUrl ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase: Missing environment variables, using defaults');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Get user's organizations
 */
export async function getUserOrganizations(userId: string) {
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      role,
      organizations (
        id,
        name,
        slug,
        description,
        logo_url,
        plan,
        created_at
      )
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

/**
 * Get organization's social accounts
 */
export async function getOrganizationSocialAccounts(organizationId: string) {
  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('platform');
  
  if (error) throw error;
  return data;
}

/**
 * Get organization's posts
 */
export async function getOrganizationPosts(organizationId: string, status?: string) {
  let query = supabase
    .from('posts')
    .select(`
      *,
      post_versions (
        id,
        platform_post_id,
        status,
        published_at,
        social_accounts (
          platform,
          account_name,
          account_handle
        )
      )
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Create a new post
 */
export async function createPost(post: Database['public']['Tables']['posts']['Insert']) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Upload file to Supabase storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options);
  
  if (error) throw error;
  return data;
}

/**
 * Get public URL for uploaded file
 */
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

// =============================================
// REAL-TIME SUBSCRIPTIONS
// =============================================

/**
 * Subscribe to post updates for an organization
 */
export function subscribeToOrganizationPosts(
  organizationId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`posts:${organizationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `organization_id=eq.${organizationId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to social account updates
 */
export function subscribeToSocialAccounts(
  organizationId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`social_accounts:${organizationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'social_accounts',
        filter: `organization_id=eq.${organizationId}`,
      },
      callback
    )
    .subscribe();
}

export default supabase;
