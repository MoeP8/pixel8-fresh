import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Target, MessageCircle } from "lucide-react";
import type { BrandPerformanceMetric } from "@/hooks/useAnalytics";

interface BrandPerformanceOverviewProps {
  metrics: BrandPerformanceMetric[];
  loading?: boolean;
}

export function BrandPerformanceOverview({ metrics, loading }: BrandPerformanceOverviewProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-2 flex-1 mr-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate latest metrics
  const getLatestMetric = (type: string) => {
    const typeMetrics = metrics.filter(m => m.metric_type === type);
    return typeMetrics.length > 0 ? typeMetrics[0] : null;
  };

  const consistencyMetric = getLatestMetric('consistency_score');
  const voiceToneMetric = getLatestMetric('voice_tone');
  const complianceMetric = getLatestMetric('compliance');
  const engagementMetric = getLatestMetric('engagement');

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Improvement";
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-success" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <div className="h-4 w-4" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Brand Consistency</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {consistencyMetric ? Math.round(consistencyMetric.metric_value) : 0}%
          </div>
          <div className="flex items-center justify-between mt-2">
            <Progress 
              value={consistencyMetric?.metric_value || 0} 
              className="flex-1 mr-2" 
            />
            <Badge variant="outline" className={getScoreColor(consistencyMetric?.metric_value || 0)}>
              {getScoreLabel(consistencyMetric?.metric_value || 0)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Voice & Tone</CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {voiceToneMetric ? Math.round(voiceToneMetric.metric_value) : 0}%
          </div>
          <div className="flex items-center justify-between mt-2">
            <Progress 
              value={voiceToneMetric?.metric_value || 0} 
              className="flex-1 mr-2" 
            />
            <Badge variant="outline" className={getScoreColor(voiceToneMetric?.metric_value || 0)}>
              {getScoreLabel(voiceToneMetric?.metric_value || 0)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {complianceMetric ? Math.round(complianceMetric.metric_value) : 0}%
          </div>
          <div className="flex items-center justify-between mt-2">
            <Progress 
              value={complianceMetric?.metric_value || 0} 
              className="flex-1 mr-2" 
            />
            <Badge variant="outline" className={getScoreColor(complianceMetric?.metric_value || 0)}>
              {getScoreLabel(complianceMetric?.metric_value || 0)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {engagementMetric ? Math.round(engagementMetric.metric_value) : 0}%
          </div>
          <div className="flex items-center justify-between mt-2">
            <Progress 
              value={engagementMetric?.metric_value || 0} 
              className="flex-1 mr-2" 
            />
            <Badge variant="outline">
              {engagementMetric?.time_period || 'No data'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}