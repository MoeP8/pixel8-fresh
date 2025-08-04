import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AdCampaign, CampaignPerformance } from "@/hooks/useAdsManagement";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CampaignOverviewProps {
  campaigns: AdCampaign[];
  performance: CampaignPerformance[];
  loading: boolean;
}

const PLATFORM_COLORS = {
  google_ads: 'hsl(var(--chart-1))',
  meta: 'hsl(var(--chart-2))',
  microsoft_ads: 'hsl(var(--chart-3))',
  linkedin: 'hsl(var(--chart-4))',
  tiktok: 'hsl(var(--chart-5))',
};

export function CampaignOverview({ campaigns, performance, loading }: CampaignOverviewProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Group campaigns by platform
  const campaignsByPlatform = campaigns.reduce((acc, campaign) => {
    const platform = campaign.ad_account?.platform || 'unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformData = Object.entries(campaignsByPlatform).map(([platform, count]) => ({
    name: platform.replace('_', ' ').toUpperCase(),
    value: count,
    fill: PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS] || 'hsl(var(--chart-1))'
  }));

  // Recent performance trend
  const performanceByDate = performance.reduce((acc, perf) => {
    const date = perf.date_recorded;
    if (!acc[date]) {
      acc[date] = { date, cost: 0, clicks: 0, impressions: 0, conversions: 0 };
    }
    acc[date].cost += perf.cost;
    acc[date].clicks += perf.clicks;
    acc[date].impressions += perf.impressions;
    acc[date].conversions += perf.conversions;
    return acc;
  }, {} as Record<string, any>);

  const performanceTrend = Object.values(performanceByDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days

  // Campaign status distribution
  const statusData = campaigns.reduce((acc, campaign) => {
    acc[campaign.campaign_status] = (acc[campaign.campaign_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'paused': return 'bg-warning';
      case 'removed': return 'bg-destructive';
      case 'draft': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  // Top performing campaigns
  const campaignPerformance = campaigns.map(campaign => {
    const campPerf = performance.filter(p => p.ad_campaign_id === campaign.id);
    const totalCost = campPerf.reduce((sum, p) => sum + p.cost, 0);
    const totalConversions = campPerf.reduce((sum, p) => sum + p.conversions, 0);
    const totalClicks = campPerf.reduce((sum, p) => sum + p.clicks, 0);
    const roas = totalCost > 0 ? (totalConversions * 100) / totalCost : 0; // Simplified ROAS calculation
    
    return {
      ...campaign,
      totalCost,
      totalConversions,
      totalClicks,
      roas
    };
  }).sort((a, b) => b.roas - a.roas).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spend Trend</CardTitle>
            <CardDescription>Daily spend over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {performanceTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="hsl(var(--chart-1))" 
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No performance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Campaigns by advertising platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {platformData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No campaigns to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Status & Top Performers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Status</CardTitle>
            <CardDescription>Current status of all campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(statusData).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>Campaigns ranked by ROAS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaignPerformance.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{campaign.campaign_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.ad_account?.platform?.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {campaign.roas > 200 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : campaign.roas > 100 ? (
                        <TrendingUp className="h-4 w-4 text-warning" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className="font-bold">{campaign.roas.toFixed(1)}%</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${campaign.totalCost.toFixed(2)} spent
                    </div>
                  </div>
                </div>
              ))}
              
              {campaignPerformance.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No performance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}