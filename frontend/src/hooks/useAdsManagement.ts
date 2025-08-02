import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdAccount {
  id: string;
  client_id: string;
  platform: 'google_ads' | 'meta' | 'microsoft_ads' | 'linkedin' | 'tiktok';
  account_id: string;
  account_name: string;
  currency: string;
  timezone: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  account_status: 'active' | 'suspended' | 'disabled' | 'pending';
  daily_budget_limit?: number;
  monthly_budget_limit?: number;
  is_active: boolean;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TargetingData {
  locations?: string[];
  age_range?: [number, number];
  interests?: string[];
  genders?: ('male' | 'female' | 'other')[];
  languages?: string[];
  devices?: string[];
  [key: string]: any;
}

export interface CampaignSettings {
  ad_placement?: string[];
  optimization_goal?: string;
  delivery_type?: 'standard' | 'accelerated';
  schedule?: {
    start: string;
    end?: string;
    days?: string[];
  };
  [key: string]: any;
}

export interface AdCampaign {
  id: string;
  ad_account_id: string;
  client_id: string;
  platform_campaign_id: string;
  campaign_name: string;
  campaign_type: string;
  campaign_status: 'active' | 'paused' | 'removed' | 'draft';
  objective: string;
  daily_budget?: number;
  total_budget?: number;
  bid_strategy: string;
  target_cpa?: number;
  target_roas?: number;
  start_date?: string;
  end_date?: string;
  targeting_data: TargetingData;
  campaign_settings: CampaignSettings;
  brand_compliance_score: number;
  automation_rules: AutomationRule[];
  created_by?: string;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
  ad_account?: AdAccount;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number | boolean;
}

export interface RuleAction {
  type: 'increase_budget' | 'decrease_budget' | 'pause' | 'resume' | 'rotate_creative' | 'expand_audience';
  params?: Record<string, any>;
}

export interface AutomationRule {
  id: string;
  client_id: string;
  rule_name: string;
  rule_type: 'budget' | 'bid' | 'pause_resume' | 'creative_rotation' | 'audience_expansion';
  conditions: RuleCondition[];
  actions: RuleAction[];
  applies_to: 'campaign' | 'ad_group' | 'ad';
  target_ids: string[];
  is_active: boolean;
  last_triggered_at?: string;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignPerformance {
  cost: number;
  id: string;
  ad_campaign_id: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  frequency: number;
  video_views: number;
  engagement_rate: number;
  conversion_rate: number;
  date_recorded: string;
  created_at: string;
}

export const useAdsManagement = (clientId?: string) => {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [performance, setPerformance] = useState<CampaignPerformance[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdAccounts = async () => {
    if (!clientId) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAdAccounts((data || []) as AdAccount[]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchCampaigns = async () => {
    if (!clientId) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('ad_campaigns')
        .select(`
          *,
          ad_account:ad_accounts(*)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCampaigns(
        (data || []).map((item: any) => ({
          ...item,
          automation_rules: Array.isArray(item.automation_rules)
            ? item.automation_rules as AutomationRule[]
            : [],
          targeting_data: typeof item.targeting_data === 'object'
            ? item.targeting_data as TargetingData
            : {},
          campaign_settings: typeof item.campaign_settings === 'object'
            ? item.campaign_settings as CampaignSettings
            : {},
          ad_account: item.ad_account as AdAccount | undefined,
        }))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPerformanceData = async (campaignIds: string[]) => {
    if (campaignIds.length === 0) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('campaign_performance')
        .select('*')
        .in('ad_campaign_id', campaignIds)
        .order('date_recorded', { ascending: false })
        .limit(30); // Last 30 days

      if (fetchError) throw fetchError;
      setPerformance(
        (data || []).map((item: any) => ({
          ...item,
          spend: item.spend ?? item.cost ?? 0, // fallback if spend is missing
        })) as CampaignPerformance[]
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAutomationRules = async () => {
    if (!clientId) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAutomationRules(
        (data || []).map((item: any) => ({
          ...item,
          conditions: Array.isArray(item.conditions)
            ? item.conditions as RuleCondition[]
            : typeof item.conditions === 'string'
              ? JSON.parse(item.conditions) as RuleCondition[]
              : [],
          actions: Array.isArray(item.actions)
            ? item.actions as RuleAction[]
            : typeof item.actions === 'string'
              ? JSON.parse(item.actions) as RuleAction[]
              : [],
        }))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAllData = async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch ad accounts and automation rules in parallel, fetch campaigns separately
      const [adAccountsPromise, automationRulesPromise, campaignsResult] = await Promise.all([
        fetchAdAccounts(),
        fetchAutomationRules(),
        (async () => {
          const { data, error: fetchError } = await supabase
            .from('ad_campaigns')
            .select(`
              *,
              ad_account:ad_accounts(*)
            `)
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });
          if (fetchError) throw fetchError;
          setCampaigns(
            (data || []).map((item: any) => ({
              ...item,
              automation_rules: Array.isArray(item.automation_rules)
                ? item.automation_rules as AutomationRule[]
                : typeof item.automation_rules === 'string'
                  ? JSON.parse(item.automation_rules) as AutomationRule[]
                  : [],
              targeting_data: typeof item.targeting_data === 'object'
                ? item.targeting_data as TargetingData
                : typeof item.targeting_data === 'string'
                  ? JSON.parse(item.targeting_data) as TargetingData
                  : {},
              campaign_settings: typeof item.campaign_settings === 'object'
                ? item.campaign_settings as CampaignSettings
                : typeof item.campaign_settings === 'string'
                  ? JSON.parse(item.campaign_settings) as CampaignSettings
                  : {},
              ad_account: item.ad_account as AdAccount | undefined,
            }))
          );
          return (data || []).map((item: any) => ({
            ...item,
            automation_rules: Array.isArray(item.automation_rules)
              ? item.automation_rules as AutomationRule[]
              : typeof item.automation_rules === 'string'
                ? JSON.parse(item.automation_rules) as AutomationRule[]
                : [],
            targeting_data: typeof item.targeting_data === 'object'
              ? item.targeting_data as TargetingData
              : typeof item.targeting_data === 'string'
                ? JSON.parse(item.targeting_data) as TargetingData
                : {},
            campaign_settings: typeof item.campaign_settings === 'object'
              ? item.campaign_settings as CampaignSettings
              : typeof item.campaign_settings === 'string'
                ? JSON.parse(item.campaign_settings) as CampaignSettings
                : {},
            ad_account: item.ad_account as AdAccount | undefined,
          })) as AdCampaign[] || [];
        })()
      ]);

      // Fetch performance data after campaigns are loaded
      const campaignIds = campaignsResult.map(c => c.id);
      if (campaignIds.length > 0) {
        await fetchPerformanceData(campaignIds);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAdAccount = async (accountData: Omit<AdAccount, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ad_accounts')
        .insert([accountData])
        .select()
        .single();

      if (error) throw error;

      setAdAccounts(prev => [data as AdAccount, ...prev]);
      return data as AdAccount;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createCampaign = async (campaignData: Omit<AdCampaign, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const payload = {
        ...campaignData,
        automation_rules: JSON.stringify(campaignData.automation_rules ?? []),
        targeting_data: JSON.stringify(campaignData.targeting_data ?? {}),
        campaign_settings: JSON.stringify(campaignData.campaign_settings ?? {}),
      };
      const { data, error } = await supabase
        .from('ad_campaigns')
        .insert([payload])
        .select(`
          *,
          ad_account:ad_accounts(*)
        `)
        .single();

      if (error) throw error;

      // Parse JSON fields after insert
      const parsed = {
        ...data,
        automation_rules: typeof data.automation_rules === 'string'
          ? JSON.parse(data.automation_rules)
          : data.automation_rules,
        targeting_data: typeof data.targeting_data === 'string'
          ? JSON.parse(data.targeting_data)
          : data.targeting_data,
        campaign_settings: typeof data.campaign_settings === 'string'
          ? JSON.parse(data.campaign_settings)
          : data.campaign_settings,
        ad_account: data.ad_account,
      } as AdCampaign;

      setCampaigns(prev => [parsed, ...prev]);
      return parsed;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<AdCampaign>) => {
    try {
      const payload = {
        ...updates,
        ...(updates.automation_rules && { automation_rules: JSON.stringify(updates.automation_rules) }),
        ...(updates.targeting_data && { targeting_data: JSON.stringify(updates.targeting_data) }),
        ...(updates.campaign_settings && { campaign_settings: JSON.stringify(updates.campaign_settings) }),
      };
      const { data, error } = await supabase
        .from('ad_campaigns')
        .update(payload)
        .eq('id', id)
        .select(`
          *,
          ad_account:ad_accounts(*)
        `)
        .single();

      if (error) throw error;

      // Parse JSON fields after update
      const parsed = {
        ...data,
        automation_rules: typeof data.automation_rules === 'string'
          ? JSON.parse(data.automation_rules)
          : data.automation_rules,
        targeting_data: typeof data.targeting_data === 'string'
          ? JSON.parse(data.targeting_data)
          : data.targeting_data,
        campaign_settings: typeof data.campaign_settings === 'string'
          ? JSON.parse(data.campaign_settings)
          : data.campaign_settings,
        ad_account: data.ad_account,
      } as AdCampaign;

      setCampaigns(prev => prev.map(c => c.id === id ? parsed : c));
      return parsed;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createAutomationRule = async (ruleData: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const payload = {
        ...ruleData,
        conditions: JSON.stringify(ruleData.conditions ?? []),
        actions: JSON.stringify(ruleData.actions ?? []),
      };
      const { data, error } = await supabase
        .from('automation_rules')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      // Parse JSON fields after insert
      const parsed = {
        ...data,
        conditions: typeof data.conditions === 'string'
          ? JSON.parse(data.conditions)
          : data.conditions,
        actions: typeof data.actions === 'string'
          ? JSON.parse(data.actions)
          : data.actions,
      } as AutomationRule;

      setAutomationRules(prev => [parsed, ...prev]);
      return parsed;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateAutomationRule = async (id: string, updates: Partial<AutomationRule>) => {
    try {
      const payload = {
        ...updates,
        ...(updates.conditions && { conditions: JSON.stringify(updates.conditions) }),
        ...(updates.actions && { actions: JSON.stringify(updates.actions) }),
      };
      const { data, error } = await supabase
        .from('automation_rules')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Parse JSON fields after update
      const parsed = {
        ...data,
        conditions: typeof data.conditions === 'string'
          ? JSON.parse(data.conditions)
          : data.conditions,
        actions: typeof data.actions === 'string'
          ? JSON.parse(data.actions)
          : data.actions,
      } as AutomationRule;

      setAutomationRules(prev => prev.map(r => r.id === id ? parsed : r));
      return parsed;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const syncCampaignData = async (campaignId: string) => {
    try {
      // This would typically call the platform APIs to sync data
      // For now, we'll just update the last_sync_at timestamp
      const { data, error } = await supabase
        .from('ad_campaigns')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', campaignId)
        .select(`
          *,
          ad_account:ad_accounts(*)
        `)
        .single();

      if (error) throw error;

      // Parse JSON fields after update
      const parsed = {
        ...data,
        automation_rules: typeof data.automation_rules === 'string'
          ? JSON.parse(data.automation_rules)
          : data.automation_rules,
        targeting_data: typeof data.targeting_data === 'string'
          ? JSON.parse(data.targeting_data)
          : data.targeting_data,
        campaign_settings: typeof data.campaign_settings === 'string'
          ? JSON.parse(data.campaign_settings)
          : data.campaign_settings,
        ad_account: data.ad_account,
      } as AdCampaign;

      setCampaigns(prev => prev.map(c => c.id === campaignId ? parsed : c));
      return parsed;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchAllData();
    }
  }, [clientId]);

  // Auto-refresh performance data every 5 minutes
  useEffect(() => {
    if (!clientId || campaigns.length === 0) return;
    
    const interval = setInterval(() => {
      const campaignIds = campaigns.map(c => c.id);
      fetchPerformanceData(campaignIds);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [clientId, campaigns]);

  return {
    adAccounts,
    campaigns,
    performance,
    automationRules,
    loading,
    error,
    createAdAccount,
    createCampaign,
    updateCampaign,
    createAutomationRule,
    updateAutomationRule,
    syncCampaignData,
    refetch: fetchAllData
  };
};