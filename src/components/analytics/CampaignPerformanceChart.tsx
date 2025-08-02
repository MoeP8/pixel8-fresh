import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from 'react';
import { CampaignAnalytics } from "@/hooks/useAnalytics";

interface CampaignPerformanceChartProps {
  campaigns: CampaignAnalytics[];
  loading?: boolean;
}

export function CampaignPerformanceChart({ campaigns, loading }: CampaignPerformanceChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [metric, setMetric] = useState<'engagement' | 'consistency' | 'posts'>('engagement');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[140px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] space-y-4">
            {/* Chart area skeleton */}
            <div className="h-full relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-3 w-8" />
                ))}
              </div>
              {/* Chart lines/bars */}
              <div className="ml-12 h-full flex items-end justify-between px-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <Skeleton 
                      className="w-12 bg-primary/20" 
                      style={{ height: `${Math.random() * 200 + 50}px` }}
                    />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = campaigns.map(campaign => ({
    name: campaign.campaign_name,
    engagement: campaign.total_engagement,
    consistency: Math.round(campaign.brand_consistency_avg),
    posts: campaign.total_posts,
    startDate: new Date(campaign.start_date).toLocaleDateString()
  }));

  const getMetricColor = () => {
    switch (metric) {
      case 'engagement': return 'hsl(var(--chart-1))';
      case 'consistency': return 'hsl(var(--chart-2))';
      case 'posts': return 'hsl(var(--chart-3))';
      default: return 'hsl(var(--chart-1))';
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'engagement': return 'Total Engagement';
      case 'consistency': return 'Brand Consistency %';
      case 'posts': return 'Total Posts';
      default: return 'Metric';
    }
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke={getMetricColor()} 
              strokeWidth={2}
              dot={{ fill: getMetricColor(), strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
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
              dataKey={metric} 
              stroke={getMetricColor()} 
              fill={getMetricColor()}
              fillOpacity={0.2}
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey={metric} fill={getMetricColor()} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Brand performance metrics across campaigns</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={metric} onValueChange={(value) => setMetric(value as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="consistency">Consistency</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={chartType} onValueChange={(value) => setChartType(value as any)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No campaign data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}