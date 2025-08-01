import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AdCampaign, CampaignPerformance } from "@/hooks/useAdsManagement";
import { useState } from 'react';
import { TrendingUp, TrendingDown, Eye, MousePointer, Target, DollarSign } from "lucide-react";

interface PerformanceMonitorProps {
  campaigns: AdCampaign[];
  performance: CampaignPerformance[];
  loading: boolean;
}

export function PerformanceMonitor({ campaigns, performance, loading }: PerformanceMonitorProps) {
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'clicks' | 'impressions' | 'conversions'>('cost');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
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

  // Aggregate performance data by date
  const performanceByDate = performance.reduce((acc, perf) => {
    const date = perf.date_recorded;
    if (!acc[date]) {
      acc[date] = { 
        date, 
        cost: 0, 
        clicks: 0, 
        impressions: 0, 
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpa: 0
      };
    }
    acc[date].cost += perf.cost;
    acc[date].clicks += perf.clicks;
    acc[date].impressions += perf.impressions;
    acc[date].conversions += perf.conversions;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(performanceByDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-parseInt(timeRange.replace('d', ''))); // Show last N days

  // Calculate metrics for each data point
  const processedChartData = chartData.map(data => ({
    ...data,
    ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0,
    cpc: data.clicks > 0 ? data.cost / data.clicks : 0,
    cpa: data.conversions > 0 ? data.cost / data.conversions : 0
  }));

  // Campaign performance summary
  const campaignSummary = campaigns.map(campaign => {
    const campPerf = performance.filter(p => p.ad_campaign_id === campaign.id);
    const totalCost = campPerf.reduce((sum, p) => sum + p.cost, 0);
    const totalClicks = campPerf.reduce((sum, p) => sum + p.clicks, 0);
    const totalImpressions = campPerf.reduce((sum, p) => sum + p.impressions, 0);
    const totalConversions = campPerf.reduce((sum, p) => sum + p.conversions, 0);
    
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cpc = totalClicks > 0 ? totalCost / totalClicks : 0;
    const cpa = totalConversions > 0 ? totalCost / totalConversions : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return {
      ...campaign,
      totalCost,
      totalClicks,
      totalImpressions,
      totalConversions,
      ctr,
      cpc,
      cpa,
      conversionRate
    };
  }).sort((a, b) => b.totalCost - a.totalCost);

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'cost': return 'hsl(var(--chart-1))';
      case 'clicks': return 'hsl(var(--chart-2))';
      case 'impressions': return 'hsl(var(--chart-3))';
      case 'conversions': return 'hsl(var(--chart-4))';
      default: return 'hsl(var(--chart-1))';
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'cost': return 'Spend';
      case 'clicks': return 'Clicks';
      case 'impressions': return 'Impressions';
      case 'conversions': return 'Conversions';
      default: return 'Metric';
    }
  };

  const getPerformanceIcon = (value: number, benchmark: number) => {
    if (value > benchmark) {
      return <TrendingUp className="h-4 w-4 text-success" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      case 'removed':
        return <Badge variant="destructive">Removed</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Key metrics summary
  const totalMetrics = {
    cost: performance.reduce((sum, p) => sum + p.cost, 0),
    clicks: performance.reduce((sum, p) => sum + p.clicks, 0),
    impressions: performance.reduce((sum, p) => sum + p.impressions, 0),
    conversions: performance.reduce((sum, p) => sum + p.conversions, 0)
  };

  const overallCTR = totalMetrics.impressions > 0 ? (totalMetrics.clicks / totalMetrics.impressions) * 100 : 0;
  const overallCPC = totalMetrics.clicks > 0 ? totalMetrics.cost / totalMetrics.clicks : 0;
  const overallConversionRate = totalMetrics.clicks > 0 ? (totalMetrics.conversions / totalMetrics.clicks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMetrics.cost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallCTR.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {getPerformanceIcon(overallCTR, 2.5)} vs 2.5% benchmark
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Click</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overallCPC.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Average across campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConversionRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {getPerformanceIcon(overallConversionRate, 3.0)} vs 3.0% benchmark
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Track key metrics over time</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost">Spend</SelectItem>
                  <SelectItem value="clicks">Clicks</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="conversions">Conversions</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {processedChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedChartData}>
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
                    dataKey={selectedMetric} 
                    stroke={getMetricColor()} 
                    fill={getMetricColor()}
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

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Detailed metrics for each campaign</CardDescription>
        </CardHeader>
        <CardContent>
          {campaignSummary.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>CPC</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignSummary.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.campaign_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.ad_account?.platform?.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.campaign_status)}</TableCell>
                      <TableCell>${campaign.totalCost.toFixed(2)}</TableCell>
                      <TableCell>{campaign.totalImpressions.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getPerformanceIcon(campaign.ctr, 2.5)}
                          {campaign.ctr.toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell>${campaign.cpc.toFixed(2)}</TableCell>
                      <TableCell>{campaign.totalConversions}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getPerformanceIcon(campaign.conversionRate, 3.0)}
                          {campaign.conversionRate.toFixed(2)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No campaigns to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}