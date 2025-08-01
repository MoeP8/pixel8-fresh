// =============================================
// PIXEL8 SOCIAL HUB - AUTHENTICATION REACT HOOK
// =============================================

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authService, type AuthUser, type SignUpData, type SignInData } from '../services/authService';
import type { Session } from '@supabase/supabase-js';

// =============================================
// TYPES & INTERFACES
// =============================================

interface AuthContextType {
  // State
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  signUp: (data: SignUpData) => Promise<boolean>;
  signIn: (data: SignInData) => Promise<boolean>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: any) => Promise<boolean>;
  clearError: () => void;
  
  // Utilities
  hasRole: (role: 'owner' | 'admin' | 'editor' | 'viewer') => boolean;
  canPerformAction: (action: 'create' | 'read' | 'update' | 'delete' | 'publish') => boolean;
  isAuthenticated: boolean;
}

// =============================================
// AUTH CONTEXT
// =============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// =============================================
// AUTH PROVIDER COMPONENT
// =============================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =============================================
  // INITIALIZATION
  // =============================================

  useEffect(() => {
    // Get initial session
    authService.getCurrentSession().then(({ user, session }) => {
      setUser(user);
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((user, session) => {
      setUser(user);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // =============================================
  // AUTHENTICATION ACTIONS
  // =============================================

  const signUp = useCallback(async (data: SignUpData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signUp(data);
      
      if (result.success) {
        setUser(result.user || null);
        setSession(result.session || null);
        return true;
      } else {
        setError(result.error || 'Sign up failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (data: SignInData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signIn(data);
      
      if (result.success) {
        setUser(result.user || null);
        setSession(result.session || null);
        return true;
      } else {
        setError(result.error || 'Sign in failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signOut();
      
      if (!result.success && result.error) {
        setError(result.error);
      }
      
      // Clear state regardless of result
      setUser(null);
      setSession(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    setError(null);

    try {
      const result = await authService.updatePassword(newPassword);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
      
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password update failed';
      setError(errorMessage);
      return false;
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setError(null);

    try {
      const result = await authService.resetPassword(email);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
      
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (updates: any): Promise<boolean> => {
    setError(null);

    try {
      const result = await authService.updateProfile(updates);
      
      if (result.success && result.profile) {
        // Update user state with new profile
        setUser(prev => prev ? { ...prev, profile: result.profile } : null);
        return true;
      } else if (result.error) {
        setError(result.error);
        return false;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  const hasRole = useCallback((role: 'owner' | 'admin' | 'editor' | 'viewer'): boolean => {
    return authService.hasRole(user, role);
  }, [user]);

  const canPerformAction = useCallback((action: 'create' | 'read' | 'update' | 'delete' | 'publish'): boolean => {
    return authService.canPerformAction(user, action);
  }, [user]);

  const isAuthenticated = Boolean(user && session);

  // =============================================
  // CONTEXT VALUE
  // =============================================

  const contextValue: AuthContextType = {
    // State
    user,
    session,
    loading,
    error,
    
    // Actions
    signUp,
    signIn,
    signOut,
    updatePassword,
    resetPassword,
    updateProfile,
    clearError,
    
    // Utilities
    hasRole,
    canPerformAction,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================
// DEMO UTILITIES FOR DEVELOPMENT
// =============================================

export function useDemoAuth() {
  const { signIn } = useAuth();
  
  const loginAsRole = useCallback(async (role: 'owner' | 'admin' | 'editor' | 'viewer'): Promise<boolean> => {
    const email = `${role}@pixel8.social`;
    const password = 'demo123456';
    
    return signIn({ email, password });
  }, [signIn]);
  
  return {
    loginAsOwner: () => loginAsRole('owner'),
    loginAsAdmin: () => loginAsRole('admin'),
    loginAsEditor: () => loginAsRole('editor'),
    loginAsViewer: () => loginAsRole('viewer'),
  };
}