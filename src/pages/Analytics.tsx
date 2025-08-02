import { useState } from 'react';
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { BrandPerformanceOverview } from "@/components/analytics/BrandPerformanceOverview";
import { CampaignPerformanceChart } from "@/components/analytics/CampaignPerformanceChart";
import { ContentPillarAnalytics } from "@/components/analytics/ContentPillarAnalytics";
import { CampaignManagement } from "@/components/analytics/CampaignManagement";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useBrandManagement } from "@/hooks/useBrandManagement";
import { useClients } from "@/hooks/useClients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, BarChart3, TrendingUp, Users, Target, Filter, Download } from "lucide-react";

const Analytics = () => {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  const { 
    brandMetrics, 
    campaigns, 
    pillarPerformance, 
    voiceAnalytics, 
    loading, 
    createCampaign,
    updateCampaign 
  } = useAnalytics(selectedClient);
  
  const { contentPillars } = useBrandManagement(selectedClient);
  const { clients } = useClients();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Brand Analytics</h1>
          <p className="text-slate-300">
            Track brand performance, compliance, and campaign effectiveness
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <GlassButton variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </GlassButton>
          <GlassButton variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </GlassButton>
        </div>
      </div>

      {/* Stats Overview */}
      {selectedClient && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Impressions</p>
                <p className="text-white text-2xl font-bold">
                  {brandMetrics?.total_impressions ? (brandMetrics.total_impressions / 1000).toFixed(1) + 'K' : '0'}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Engagement Rate</p>
                <p className="text-white text-2xl font-bold">
                  {brandMetrics?.engagement_rate ? brandMetrics.engagement_rate.toFixed(1) + '%' : '0%'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Reach</p>
                <p className="text-white text-2xl font-bold">
                  {brandMetrics?.reach ? (brandMetrics.reach / 1000).toFixed(1) + 'K' : '0'}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Brand Score</p>
                <p className="text-white text-2xl font-bold">
                  {brandMetrics?.brand_voice_score ? brandMetrics.brand_voice_score.toFixed(0) + '%' : '0%'}
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-400" />
            </div>
          </GlassCard>
        </div>
      )}

      {selectedClient ? (
        <div className="space-y-6">
          {/* Brand Performance Overview */}
          <GlassCard className="p-6">
            <BrandPerformanceOverview metrics={brandMetrics} loading={loading} />
          </GlassCard>

          {/* Campaign Performance Chart */}
          <GlassCard className="p-6">
            <CampaignPerformanceChart campaigns={campaigns} loading={loading} />
          </GlassCard>

          {/* Content Pillar Analytics */}
          <GlassCard className="p-6">
            <ContentPillarAnalytics 
              pillarPerformance={pillarPerformance}
              contentPillars={contentPillars}
              loading={loading}
            />
          </GlassCard>

          {/* Campaign Management */}
          <GlassCard className="p-6">
            <CampaignManagement
              clientId={selectedClient}
              campaigns={campaigns}
              onCampaignCreate={createCampaign}
              onCampaignUpdate={updateCampaign}
            />
          </GlassCard>

          {/* Voice & Tone Insights */}
          <GlassCard className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-white">
                <CalendarDays className="h-5 w-5" />
                Voice & Tone Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="grid gap-4 md:grid-cols-3">
                <GlassCard className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {voiceAnalytics.length > 0 
                      ? Math.round(voiceAnalytics.reduce((sum, v) => sum + v.overall_voice_score, 0) / voiceAnalytics.length)
                      : 0}%
                  </div>
                  <div className="text-sm text-slate-300">Overall Voice Score</div>
                </GlassCard>
                
                <GlassCard className="text-center p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {voiceAnalytics.length > 0 
                      ? Math.round(voiceAnalytics.reduce((sum, v) => sum + v.tone_consistency_score, 0) / voiceAnalytics.length)
                      : 0}%
                  </div>
                  <div className="text-sm text-slate-300">Tone Consistency</div>
                </GlassCard>
                
                <GlassCard className="text-center p-4">
                  <div className="text-2xl font-bold text-purple-400">
                    {voiceAnalytics.length > 0 
                      ? Math.round(voiceAnalytics.reduce((sum, v) => sum + v.brand_voice_alignment, 0) / voiceAnalytics.length)
                      : 0}%
                  </div>
                  <div className="text-sm text-slate-300">Brand Alignment</div>
                </GlassCard>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      ) : (
        <GlassCard className="p-16 text-center">
          <CalendarDays className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-white">Select a Client</h3>
          <p className="text-slate-300">
            Choose a client from the dropdown above to view their brand analytics and performance metrics.
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default Analytics;