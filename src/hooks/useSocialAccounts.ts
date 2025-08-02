import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SocialAccount, PlatformGuidelines } from '@/types/social-accounts';
import { useToast } from '@/hooks/use-toast';
import { useMockData } from '@/hooks/useMockData';

export function useSocialAccounts() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [guidelines, setGuidelines] = useState<PlatformGuidelines[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { mockSocialAccounts } = useMockData();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_social_accounts');
      
      if (error) throw error;
      
      // Use mock data if no real data exists
      setAccounts(data?.length ? data : mockSocialAccounts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch social accounts';
      setError(message);
      // Fallback to mock data on error
      setAccounts(mockSocialAccounts);
      toast({
        title: 'Error',
        description: 'Using demo data. ' + message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGuidelines = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_guidelines')
        .select('*');
      
      if (error) throw error;
      
      setGuidelines(data || []);
    } catch (err) {
      console.error('Failed to fetch guidelines:', err);
    }
  };

  const connectAccount = async (platform: string) => {
    // This would initiate OAuth flow for the specific platform
    toast({
      title: 'OAuth Connection',
      description: `Initiating connection to ${platform}...`,
    });
    // Implementation would depend on each platform's OAuth flow
  };

  const disconnectAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ connection_status: 'disconnected' })
        .eq('id', accountId);

      if (error) throw error;

      toast({
        title: 'Account Disconnected',
        description: 'Account has been disconnected successfully.',
      });
      
      fetchAccounts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect account';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const refreshConnection = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ 
          connection_status: 'pending',
          last_health_check: new Date().toISOString()
        })
        .eq('id', accountId);

      if (error) throw error;

      toast({
        title: 'Refreshing Connection',
        description: 'Attempting to refresh account connection...',
      });
      
      fetchAccounts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh connection';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchGuidelines();
  }, []);

  return {
    accounts,
    guidelines,
    loading,
    error,
    connectAccount,
    disconnectAccount,
    refreshConnection,
    refetch: fetchAccounts
  };
}