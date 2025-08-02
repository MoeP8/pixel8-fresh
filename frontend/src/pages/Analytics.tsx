import { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { BrandPerformanceOverview } from "@/components/analytics/BrandPerformanceOverview";
import { CampaignPerformanceChart } from "@/components/analytics/CampaignPerformanceChart";
import { ContentPillarAnalytics } from "@/components/analytics/ContentPillarAnalytics";
import { CampaignManagement } from "@/components/analytics/CampaignManagement";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useBrandManagement } from "@/hooks/useBrandManagement";
import { useClients } from "@/hooks/useClients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

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
    <DashboardLayout title="Analytics" showSearch={false}>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Brand Analytics</h1>
            <p className="text-muted-foreground">
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
          </div>
        </div>

        {selectedClient ? (
          <>
            {/* Brand Performance Overview */}
            <BrandPerformanceOverview metrics={brandMetrics} loading={loading} />

            {/* Campaign Performance Chart */}
            <CampaignPerformanceChart campaigns={campaigns} loading={loading} />

            {/* Content Pillar Analytics */}
            <ContentPillarAnalytics 
              pillarPerformance={pillarPerformance}
              contentPillars={contentPillars}
              loading={loading}
            />

            {/* Campaign Management */}
            <CampaignManagement
              clientId={selectedClient}
              campaigns={campaigns}
              onCampaignCreate={createCampaign}
              onCampaignUpdate={updateCampaign}
            />

            {/* Voice & Tone Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Voice & Tone Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {voiceAnalytics.length > 0 
                        ? Math.round(voiceAnalytics.reduce((sum, v) => sum + v.overall_voice_score, 0) / voiceAnalytics.length)
                        : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Voice Score</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {voiceAnalytics.length > 0 
                        ? Math.round(voiceAnalytics.reduce((sum, v) => sum + v.tone_consistency_score, 0) / voiceAnalytics.length)
                        : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Tone Consistency</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {voiceAnalytics.length > 0 
                        ? Math.round(voiceAnalytics.reduce((sum, v) => sum + v.brand_voice_alignment, 0) / voiceAnalytics.length)
                        : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Brand Alignment</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Client</h3>
              <p className="text-muted-foreground">
                Choose a client from the dropdown above to view their brand analytics and performance metrics.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;