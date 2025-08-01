import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMockData } from '@/hooks/useMockData';

export interface BrandPerformanceMetric {
  id: string;
  client_id: string;
  metric_type: string;
  metric_value: number;
  metric_data: any;
  time_period: string;
  date_recorded: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignAnalytics {
  id: string;
  client_id: string;
  campaign_name: string;
  campaign_type: string;
  start_date: string;
  end_date?: string;
  total_posts: number;
  total_engagement: number;
  brand_consistency_avg: number;
  content_pillar_distribution: any;
  platform_performance: any;
  roi_metrics: any;
  brand_kpis: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentPillarPerformance {
  id: string;
  client_id: string;
  content_pillar_id: string;
  time_period: string;
  date_recorded: string;
  posts_count: number;
  total_engagement: number;
  avg_brand_score: number;
  performance_data: any;
  created_at: string;
  updated_at: string;
}

export interface VoiceToneAnalytics {
  id: string;
  client_id: string;
  content_id?: string;
  voice_trait_scores: any;
  overall_voice_score: number;
  tone_consistency_score: number;
  brand_voice_alignment: number;
  analyzed_at: string;
  created_at: string;
}

export interface UnifiedMetrics {
  totalROI: number;
  totalSpend: number;
  totalRevenue: number;
  organicReach: number;
  paidReach: number;
}

export interface Anomaly {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  metric: string;
  value: number;
  threshold: number;
  detected_at: string;
}

export const useAnalytics = (clientId?: string, dateRange?: string) => {
  const [brandMetrics, setBrandMetrics] = useState<BrandPerformanceMetric[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignAnalytics[]>([]);
  const [pillarPerformance, setPillarPerformance] = useState<ContentPillarPerformance[]>([]);
  const [voiceAnalytics, setVoiceAnalytics] = useState<VoiceToneAnalytics[]>([]);
  const [unifiedMetrics, setUnifiedMetrics] = useState<UnifiedMetrics | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [roiData, setROIData] = useState<any[]>([]);
  const [attributionData, setAttributionData] = useState<any[]>([]);
  const [competitiveData, setCompetitiveData] = useState<any[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<any[]>([]);
  const [contentCorrelation, setContentCorrelation] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mockCampaigns } = useMockData();

  const fetchAnalyticsData = useCallback(async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch brand performance metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('brand_performance_metrics')
        .select('*')
        .eq('client_id', clientId)
        .order('date_recorded', { ascending: false });

      if (metricsError) throw metricsError;

      // Fetch campaign analytics
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      // Fetch content pillar performance
      const { data: pillarData, error: pillarError } = await supabase
        .from('content_pillar_performance')
        .select('*')
        .eq('client_id', clientId)
        .order('date_recorded', { ascending: false });

      if (pillarError) throw pillarError;

      // Fetch voice and tone analytics
      const { data: voiceData, error: voiceError } = await supabase
        .from('voice_tone_analytics')
        .select('*')
        .eq('client_id', clientId)
        .order('analyzed_at', { ascending: false });

      if (voiceError) throw voiceError;

      // Fetch campaign performance data for charts
      const { data: performanceChartData, error: performanceError } = await supabase
        .from('campaign_performance')
        .select(`
          *,
          ad_campaigns!inner(
            campaign_name,
            client_id
          )
        `)
        .eq('ad_campaigns.client_id', clientId)
        .order('date_recorded', { ascending: false });

      if (performanceError) throw performanceError;

      setBrandMetrics(metricsData || []);
      setCampaigns(campaignsData?.length ? campaignsData : mockCampaigns as CampaignAnalytics[]);
      setPillarPerformance(pillarData || []);
      setVoiceAnalytics(voiceData || []);
      setPerformanceData(performanceChartData || []);

      // Calculate unified metrics
      const totalSpend = performanceChartData?.reduce((sum, p) => sum + (p.cost || 0), 0) || 0;
      const totalRevenue = totalSpend * 2.5; // Mock calculation
      const totalImpressions = performanceChartData?.reduce((sum, p) => sum + (p.impressions || 0), 0) || 0;

      setUnifiedMetrics({
        totalROI: totalRevenue > 0 ? (totalRevenue - totalSpend) / totalSpend : 0,
        totalSpend,
        totalRevenue,
        organicReach: Math.floor(totalImpressions * 0.6), // Mock organic reach
        paidReach: Math.floor(totalImpressions * 0.4) // Mock paid reach
      });

      // Mock data for other analytics
      setROIData([
        { date: '2024-01-01', organic: 1.8, paid: 2.3, combined: 2.1 },
        { date: '2024-01-15', organic: 2.1, paid: 2.8, combined: 2.5 },
        { date: '2024-02-01', organic: 1.9, paid: 3.2, combined: 2.7 }
      ]);

      setAttributionData([
        { touchpoint: 'Organic Social', contribution: 35, revenue: totalRevenue * 0.35 },
        { touchpoint: 'Google Ads', contribution: 28, revenue: totalRevenue * 0.28 },
        { touchpoint: 'Meta Ads', contribution: 25, revenue: totalRevenue * 0.25 },
        { touchpoint: 'Direct', contribution: 12, revenue: totalRevenue * 0.12 }
      ]);

      // Generate mock anomalies
      const mockAnomalies: Anomaly[] = [];
      if (totalSpend > 5000) {
        mockAnomalies.push({
          id: '1',
          description: 'Unusual spike in ad spend detected',
          severity: 'high',
          metric: 'spend',
          value: totalSpend,
          threshold: 5000,
          detected_at: new Date().toISOString()
        });
      }
      setAnomalies(mockAnomalies);

      setCompetitiveData([
        { competitor: 'Competitor A', spend_estimate: totalSpend * 1.2, market_share: 23 },
        { competitor: 'Competitor B', spend_estimate: totalSpend * 0.8, market_share: 18 },
        { competitor: 'Your Brand', spend_estimate: totalSpend, market_share: 15 }
      ]);

      setAudienceInsights([
        { platform: 'Facebook', overlap: 65, unique_reach: 12000 },
        { platform: 'Instagram', overlap: 45, unique_reach: 8500 },
        { platform: 'Google', overlap: 25, unique_reach: 15000 }
      ]);

      setContentCorrelation([
        { content_type: 'Video', organic_engagement: 1250, ad_performance: 0.85 },
        { content_type: 'Image', organic_engagement: 890, ad_performance: 0.72 },
        { content_type: 'Carousel', organic_engagement: 1100, ad_performance: 0.91 }
      ]);

    } catch (err: any) {
      setError(err.message);
      // Fallback to mock data on error
      setCampaigns(mockCampaigns as CampaignAnalytics[]);
      setUnifiedMetrics({
        totalROI: 2.4,
        totalSpend: 5000,
        totalRevenue: 12000,
        organicReach: 50000,
        paidReach: 30000
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, mockCampaigns]);

  const calculateBrandConsistency = async (startDate: string, endDate: string) => {
    if (!clientId) return null;

    try {
      const { data, error } = await supabase.rpc('calculate_brand_consistency_score', {
        p_client_id: clientId,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const createCampaign = async (campaignData: Omit<CampaignAnalytics, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('campaign_analytics')
        .insert([campaignData])
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<CampaignAnalytics>) => {
    try {
      const { data, error } = await supabase
        .from('campaign_analytics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const recordBrandMetric = async (metricData: Omit<BrandPerformanceMetric, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('brand_performance_metrics')
        .insert([metricData])
        .select()
        .single();

      if (error) throw error;

      setBrandMetrics(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const recordVoiceAnalysis = async (voiceData: Omit<VoiceToneAnalytics, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('voice_tone_analytics')
        .insert([voiceData])
        .select()
        .single();

      if (error) throw error;

      setVoiceAnalytics(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [clientId, dateRange, fetchAnalyticsData]);

  return {
    brandMetrics,
    campaigns,
    pillarPerformance,
    voiceAnalytics,
    unifiedMetrics,
    anomalies,
    performanceData,
    roiData,
    attributionData,
    competitiveData,
    audienceInsights,
    contentCorrelation,
    loading,
    isLoading: loading,
    error,
    fetchAnalyticsData,
    calculateBrandConsistency,
    createCampaign,
    updateCampaign,
    recordBrandMetric,
    recordVoiceAnalysis,
    refetch: fetchAnalyticsData
  };
};