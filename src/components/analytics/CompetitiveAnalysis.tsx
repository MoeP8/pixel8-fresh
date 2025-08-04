import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

interface CompetitiveAnalysisProps {
  data: any[];
  clientId?: string;
  dateRange: string;
  loading?: boolean;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function CompetitiveAnalysis({ data, clientId, dateRange, loading = false }: CompetitiveAnalysisProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const yourBrand = data.find(item => item.competitor === 'Your Brand');
  const competitors = data.filter(item => item.competitor !== 'Your Brand');

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
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
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <Skeleton className="h-4 w-48" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="w-48 h-48 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
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
            <DollarSign className="h-5 w-5" />
            Estimated Ad Spend Comparison
          </CardTitle>
          <CardDescription>
            Competitive spending analysis across platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="competitor" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  className="text-xs"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Estimated Spend']}
                />
                <Bar 
                  dataKey="spend_estimate" 
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {yourBrand && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Your Position:</span> You're spending{' '}
                {yourBrand.spend_estimate > Math.max(...competitors.map(c => c.spend_estimate)) 
                  ? 'more than' 
                  : 'less than'} your main competitors
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Market Share Analysis
          </CardTitle>
          <CardDescription>
            Share of voice in your competitive landscape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="market_share"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Market Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.map((item, index) => (
              <div key={item.competitor} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.competitor}</div>
                  <div className="text-xs text-muted-foreground">{item.market_share}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Competitive Insights
          </CardTitle>
          <CardDescription>
            Key findings and recommendations based on competitive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-600 mb-2">Opportunities</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Lower CPC on Google Ads vs. competitors</li>
                <li>• Untapped audience segments identified</li>
                <li>• Video content gap in competitor strategy</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-yellow-600 mb-2">Threats</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Competitor A increasing spend by 40%</li>
                <li>• New player entering the market</li>
                <li>• Holiday season competition intensifying</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-blue-600 mb-2">Recommendations</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Increase video ad spend by 25%</li>
                <li>• Target competitor A's keywords</li>
                <li>• Expand to LinkedIn advertising</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}