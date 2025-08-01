// =============================================
// PIXEL8 SOCIAL HUB - AUTHENTICATION SERVICE
// =============================================

import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// =============================================
// TYPES & INTERFACES
// =============================================

export interface AuthUser extends User {
  profile?: Database['public']['Tables']['users']['Row'];
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role?: 'owner' | 'admin' | 'editor' | 'viewer';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  session?: Session;
  error?: string;
}

// =============================================
// AUTHENTICATION SERVICE CLASS
// =============================================

export class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          }
        }
      });

      if (authError) {
        return {
          success: false,
          error: authError.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'User creation failed'
        };
      }

      // Create user profile
      const profile = await this.createUserProfile(authData.user, data);
      
      return {
        success: true,
        user: { ...authData.user, profile },
        session: authData.session
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed'
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        return {
          success: false,
          error: authError.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Sign in failed'
        };
      }

      // Get user profile
      const profile = await this.getUserProfile(authData.user.id);

      return {
        success: true,
        user: { ...authData.user, profile },
        session: authData.session
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed'
      };
    }
  }

  /**
   * Get current user session
   */
  async getCurrentSession(): Promise<{ user: AuthUser | null; session: Session | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return { user: null, session: null };
      }

      const profile = await this.getUserProfile(session.user.id);
      
      return {
        user: { ...session.user, profile },
        session
      };
    } catch (error) {
      console.error('Failed to get current session:', error);
      return { user: null, session: null };
    }
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        return {
          success: false,
          error: error?.message || 'Session refresh failed'
        };
      }

      const profile = await this.getUserProfile(data.session.user.id);

      return {
        success: true,
        user: { ...data.session.user, profile },
        session: data.session
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Session refresh failed'
      };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password update failed'
      };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed'
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<Database['public']['Tables']['users']['Update']>): Promise<{
    success: boolean;
    profile?: Database['public']['Tables']['users']['Row'];
    error?: string;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        profile: data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed'
      };
    }
  }

  /**
   * Create user profile in database
   */
  private async createUserProfile(
    user: User, 
    signUpData: SignUpData
  ): Promise<Database['public']['Tables']['users']['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: signUpData.fullName,
          role: signUpData.role || 'viewer',
          avatar_url: user.user_metadata?.avatar_url || null
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to create user profile:', error);
      return null;
    }
  }

  /**
   * Get user profile from database
   */
  private async getUserProfile(userId: string): Promise<Database['public']['Tables']['users']['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Failed to get user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id);
        callback({ ...session.user, profile }, session);
      } else {
        callback(null, null);
      }
    });
  }

  /**
   * Check if user has required role
   */
  hasRole(user: AuthUser | null, requiredRole: 'owner' | 'admin' | 'editor' | 'viewer'): boolean {
    if (!user?.profile) return false;

    const roleHierarchy = {
      owner: 4,
      admin: 3,
      editor: 2,
      viewer: 1
    };

    const userRole = user.profile.role;
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * Check if user can perform action
   */
  canPerformAction(
    user: AuthUser | null, 
    action: 'create' | 'read' | 'update' | 'delete' | 'publish'
  ): boolean {
    if (!user?.profile) return false;

    const permissions = {
      owner: ['create', 'read', 'update', 'delete', 'publish'],
      admin: ['create', 'read', 'update', 'delete', 'publish'],
      editor: ['create', 'read', 'update', 'publish'],
      viewer: ['read']
    };

    const userRole = user.profile.role;
    return permissions[userRole].includes(action);
  }
}

// =============================================
// SINGLETON INSTANCE
// =============================================

export const authService = new AuthService();

// =============================================
// AUTH GUARDS
// =============================================

/**
 * Check if user meets role requirement (utility function)
 */
export function checkAuthRequirement(
  user: AuthUser | null,
  requiredRole?: 'owner' | 'admin' | 'editor' | 'viewer'
): { hasAccess: boolean; reason?: string } {
  if (!user) {
    return { hasAccess: false, reason: 'Authentication required' };
  }

  if (requiredRole && !authService.hasRole(user, requiredRole)) {
    return { hasAccess: false, reason: `Required role: ${requiredRole}` };
  }

  return { hasAccess: true };
}

// =============================================
// DEMO/DEVELOPMENT UTILITIES
// =============================================

/**
 * Create demo users for development
 */
export async function createDemoUsers(): Promise<void> {
  const demoUsers = [
    {
      email: 'owner@pixel8.social',
      password: 'demo123456',
      fullName: 'Demo Owner',
      role: 'owner' as const
    },
    {
      email: 'admin@pixel8.social',
      password: 'demo123456',
      fullName: 'Demo Admin',
      role: 'admin' as const
    },
    {
      email: 'editor@pixel8.social',
      password: 'demo123456',
      fullName: 'Demo Editor',
      role: 'editor' as const
    },
    {
      email: 'viewer@pixel8.social',
      password: 'demo123456',
      fullName: 'Demo Viewer',
      role: 'viewer' as const
    }
  ];

  console.log('Creating demo users...');
  
  for (const userData of demoUsers) {
    const result = await authService.signUp(userData);
    if (result.success) {
      console.log(`✅ Created demo user: ${userData.email} (${userData.role})`);
    } else {
      console.warn(`⚠️ Failed to create ${userData.email}: ${result.error}`);
    }
  }
}

/**
 * Auto-login for development
 */
export async function autoLoginDemo(role: 'owner' | 'admin' | 'editor' | 'viewer' = 'owner'): Promise<AuthResponse> {
  const email = `${role}@pixel8.social`;
  const password = 'demo123456';
  
  return authService.signIn({ email, password });
}