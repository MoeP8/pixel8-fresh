import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { ContentPillarPerformance } from "@/hooks/useAnalytics";
import type { ContentPillar } from "@/types/brand-management";

interface ContentPillarAnalyticsProps {
  pillarPerformance: ContentPillarPerformance[];
  contentPillars: ContentPillar[];
  loading?: boolean;
}

const PILLAR_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function ContentPillarAnalytics({ pillarPerformance, contentPillars, loading }: ContentPillarAnalyticsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pillar distribution skeleton */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-3 h-3 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-2 flex-1" />
                    <Skeleton className="h-2 flex-1" />
                  </div>
                </div>
              ))}
              {/* Pie chart skeleton */}
              <div className="mt-6 h-[200px] flex items-center justify-center">
                <Skeleton className="w-32 h-32 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {/* Performance items skeleton */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-10 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
            {/* Bar chart skeleton */}
            <div className="h-[200px] flex items-end justify-between px-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <Skeleton 
                    className="w-8 bg-primary/20" 
                    style={{ height: `${Math.random() * 120 + 40}px` }}
                  />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Aggregate performance data by pillar
  const pillarData = contentPillars.map((pillar, index) => {
    const performance = pillarPerformance.filter(p => p.content_pillar_id === pillar.id);
    const totalPosts = performance.reduce((sum, p) => sum + p.posts_count, 0);
    const totalEngagement = performance.reduce((sum, p) => sum + p.total_engagement, 0);
    const avgBrandScore = performance.length > 0 
      ? performance.reduce((sum, p) => sum + p.avg_brand_score, 0) / performance.length 
      : 0;

    return {
      name: pillar.name,
      type: pillar.pillar_type,
      target: pillar.percentage_target || 0,
      posts: totalPosts,
      engagement: totalEngagement,
      brandScore: Math.round(avgBrandScore),
      color: PILLAR_COLORS[index % PILLAR_COLORS.length]
    };
  });

  // Calculate total posts for distribution
  const totalPosts = pillarData.reduce((sum, p) => sum + p.posts, 0);
  const distributionData = pillarData.map(pillar => ({
    ...pillar,
    percentage: totalPosts > 0 ? Math.round((pillar.posts / totalPosts) * 100) : 0
  }));

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getTargetStatus = (actual: number, target: number) => {
    const diff = Math.abs(actual - target);
    if (diff <= 5) return { status: "On Target", color: "bg-success" };
    if (diff <= 10) return { status: "Near Target", color: "bg-warning" };
    return { status: "Off Target", color: "bg-destructive" };
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Content Distribution</CardTitle>
          <CardDescription>Actual vs target content pillar distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {distributionData.map((pillar, index) => {
              const targetStatus = getTargetStatus(pillar.percentage, pillar.target);
              return (
                <div key={pillar.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: pillar.color }}
                      />
                      <span className="font-medium">{pillar.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={targetStatus.color}>
                        {targetStatus.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {pillar.percentage}% / {pillar.target}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress value={pillar.percentage} className="flex-1" />
                    <Progress 
                      value={pillar.target} 
                      className="flex-1 opacity-50" 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {distributionData.length > 0 && (
            <div className="mt-6 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="posts"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pillar Performance</CardTitle>
          <CardDescription>Brand score and engagement by content pillar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {pillarData.map((pillar) => (
              <div key={pillar.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {pillar.type.replace('_', ' ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getPerformanceColor(pillar.brandScore)}`}>
                    {pillar.brandScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pillar.engagement.toLocaleString()} eng.
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pillarData.length > 0 && (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pillarData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={60} />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="brandScore" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}