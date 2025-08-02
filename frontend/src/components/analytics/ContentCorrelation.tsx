import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3, Zap } from 'lucide-react';

interface ContentCorrelationProps {
  data: any[];
  clientId?: string;
  dateRange: string;
}

export function ContentCorrelation({ data, clientId, dateRange }: ContentCorrelationProps) {
  const correlationCoefficient = 0.78; // Mock correlation coefficient
  
  const getCorrelationStrength = (coefficient: number) => {
    if (coefficient >= 0.7) return { strength: 'Strong', color: 'text-green-600' };
    if (coefficient >= 0.5) return { strength: 'Moderate', color: 'text-yellow-600' };
    return { strength: 'Weak', color: 'text-red-600' };
  };

  const correlation = getCorrelationStrength(correlationCoefficient);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Content Performance Correlation
          </CardTitle>
          <CardDescription>
            Relationship between organic engagement and paid ad performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="organic_engagement" 
                  className="text-xs"
                  name="Organic Engagement"
                />
                <YAxis 
                  dataKey="ad_performance" 
                  className="text-xs"
                  name="Ad Performance Score"
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'ad_performance' 
                      ? `${(value * 100).toFixed(1)}%` 
                      : value.toLocaleString(),
                    name === 'ad_performance' ? 'Ad Performance' : 'Organic Engagement'
                  ]}
                />
                <Scatter 
                  dataKey="ad_performance" 
                  fill="hsl(var(--chart-1))"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Correlation Strength:</span>
              <span className={`text-sm font-bold ${correlation.color}`}>
                {correlation.strength} ({correlationCoefficient.toFixed(2)})
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Higher organic engagement typically leads to better ad performance
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Content Type Performance
          </CardTitle>
          <CardDescription>
            How different content types perform in organic vs. paid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="content_type" className="text-xs" />
                <YAxis 
                  className="text-xs"
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Performance Score']}
                />
                <Bar 
                  dataKey="ad_performance" 
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
            <Zap className="h-5 w-5" />
            Content Strategy Insights
          </CardTitle>
          <CardDescription>
            Actionable insights based on content performance correlation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-600 mb-2">Top Performing Content</h4>
              <div className="space-y-2">
                {data
                  .sort((a, b) => b.ad_performance - a.ad_performance)
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={item.content_type} className="flex justify-between text-sm">
                      <span>{item.content_type}</span>
                      <span className="font-medium">
                        {(item.ad_performance * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-blue-600 mb-2">Content Recommendations</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Increase carousel ad spend by 30%</li>
                <li>• Test video content in more campaigns</li>
                <li>• Optimize image-based organic posts</li>
                <li>• A/B test content formats</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-purple-600 mb-2">Optimization Opportunities</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use top organic posts as ad creative</li>
                <li>• Retarget organic video viewers</li>
                <li>• Create lookalike audiences from high-engagement posts</li>
                <li>• Sync content calendar with ad campaigns</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-medium mb-2">Strategic Insight</h4>
            <p className="text-sm text-muted-foreground">
              Your organic content performance strongly predicts paid campaign success. 
              Content that receives high organic engagement (especially carousel posts) 
              should be prioritized for paid promotion. Consider creating a feedback loop 
              where successful paid creative informs your organic content strategy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}