import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, CircleDot, Target } from 'lucide-react';

interface AudienceInsightsProps {
  data: any[];
  clientId?: string;
  dateRange: string;
  loading?: boolean;
}


export function AudienceInsights({ data, loading = false }: AudienceInsightsProps) {
  const totalReach = data.reduce((sum, item) => sum + item.unique_reach, 0);
  const averageOverlap = data.reduce((sum, item) => sum + item.overlap, 0) / data.length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-muted rounded-lg">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-64" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="space-y-3 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3 bg-muted rounded-lg">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDot className="h-5 w-5" />
            Audience Overlap Analysis
          </CardTitle>
          <CardDescription>
            Overlap between organic followers and paid audiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((platform, index) => (
              <div key={platform.platform} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{platform.platform}</span>
                  <span className="text-sm text-muted-foreground">{platform.overlap}% overlap</span>
                </div>
                <Progress value={platform.overlap} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {platform.unique_reach.toLocaleString()} unique reach
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <div className="text-sm">
              <span className="font-medium">Average Overlap:</span> {averageOverlap.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Higher overlap indicates good audience consistency between organic and paid efforts
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Reach Distribution
          </CardTitle>
          <CardDescription>
            Unique audience reach by platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="platform" className="text-xs" />
                <YAxis 
                  className="text-xs"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Unique Reach']}
                />
                <Bar 
                  dataKey="unique_reach" 
                  fill="hsl(var(--chart-1))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Audience Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Key findings about your audience across platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Cross-Platform Reach</h4>
              <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total unique users</div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Best Performing Platform</h4>
              <div className="text-2xl font-bold">
                {data.reduce((best, current) => 
                  current.unique_reach > best.unique_reach ? current : best
                ).platform}
              </div>
              <div className="text-xs text-muted-foreground">Highest unique reach</div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Highest Overlap</h4>
              <div className="text-2xl font-bold">
                {data.reduce((best, current) => 
                  current.overlap > best.overlap ? current : best
                ).platform}
              </div>
              <div className="text-xs text-muted-foreground">
                {data.reduce((best, current) => 
                  current.overlap > best.overlap ? current : best
                ).overlap}% overlap
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Growth Opportunity</h4>
              <div className="text-2xl font-bold">
                {data.reduce((lowest, current) => 
                  current.overlap < lowest.overlap ? current : lowest
                ).platform}
              </div>
              <div className="text-xs text-muted-foreground">Increase paid targeting</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Key Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800 mb-1">Optimize Facebook Strategy</div>
                <div className="text-blue-600">
                  High overlap indicates good alignment. Consider lookalike audiences based on organic followers.
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800 mb-1">Expand Google Reach</div>
                <div className="text-green-600">
                  Lower overlap suggests untapped potential. Increase search and display targeting.
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800 mb-1">Cross-Platform Retargeting</div>
                <div className="text-purple-600">
                  Use organic engagement data to create custom audiences for paid campaigns.
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-medium text-orange-800 mb-1">Content Synchronization</div>
                <div className="text-orange-600">
                  Align organic content themes with paid campaigns for better audience resonance.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}