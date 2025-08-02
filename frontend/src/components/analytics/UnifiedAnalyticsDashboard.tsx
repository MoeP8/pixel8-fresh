import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle, Download } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useAnalytics } from '@/hooks/useAnalytics';
import { CampaignPerformanceChart } from './CampaignPerformanceChart';
import { BrandPerformanceOverview } from './BrandPerformanceOverview';
import { ROITracker } from './ROITracker';
import { AttributionAnalysis } from './AttributionAnalysis';
import { AnomalyDetector } from './AnomalyDetector';
import { CompetitiveAnalysis } from './CompetitiveAnalysis';
import { AudienceInsights } from './AudienceInsights';
import { ContentCorrelation } from './ContentCorrelation';

interface UnifiedAnalyticsDashboardProps {
  selectedClient?: string;
}

export function UnifiedAnalyticsDashboard({ selectedClient }: UnifiedAnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState('30d');
  const [activeView, setActiveView] = useState('overview');
  const { clients } = useClients();
  const { 
    campaigns,
    brandMetrics,
    performanceData, 
    unifiedMetrics, 
    roiData, 
    attributionData,
    anomalies,
    competitiveData,
    audienceInsights,
    contentCorrelation,
    isLoading 
  } = useAnalytics(selectedClient, dateRange);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const totalROI = unifiedMetrics?.totalROI || 0;
  const totalSpend = unifiedMetrics?.totalSpend || 0;
  const totalRevenue = unifiedMetrics?.totalRevenue || 0;
  const organicReach = unifiedMetrics?.organicReach || 0;
  const paidReach = unifiedMetrics?.paidReach || 0;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Unified Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive view of organic social and paid advertising performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(totalROI)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {totalROI > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              vs. previous period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpend)}</div>
            <div className="text-xs text-muted-foreground">
              Across all platforms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combined Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(organicReach + paidReach).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {organicReach.toLocaleString()} organic + {paidReach.toLocaleString()} paid
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-muted-foreground">
              From all channels
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Alerts */}
      {anomalies && anomalies.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Performance Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {anomalies.slice(0, 3).map((anomaly, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-orange-700">{anomaly.description}</span>
                  <Badge variant="outline" className="text-orange-600">
                    {anomaly.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Analytics Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignPerformanceChart 
              campaigns={campaigns} 
              loading={isLoading}
            />
            <BrandPerformanceOverview 
              metrics={brandMetrics} 
              loading={isLoading}
            />
          </div>
          <ROITracker 
            data={roiData} 
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnomalyDetector 
              anomalies={anomalies}
              clientId={selectedClient}
            />
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance Breakdown</CardTitle>
                <CardDescription>
                  Performance metrics by platform and campaign type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Platform performance breakdown would go here */}
                <div className="text-sm text-muted-foreground">
                  Detailed platform performance analysis
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <AttributionAnalysis 
            data={attributionData}
            clientId={selectedClient}
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <AudienceInsights 
            data={audienceInsights}
            clientId={selectedClient}
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          <CompetitiveAnalysis 
            data={competitiveData}
            clientId={selectedClient}
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <ContentCorrelation 
            data={contentCorrelation}
            clientId={selectedClient}
            dateRange={dateRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}