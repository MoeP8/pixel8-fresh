import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ROITrackerProps {
  data: any[];
  dateRange: string;
  loading?: boolean;
}

export function ROITracker({ data, dateRange, loading = false }: ROITrackerProps) {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  
  const averageROI = data.length > 0 
    ? data.reduce((sum, item) => sum + item.combined, 0) / data.length 
    : 0;

  const latestROI = data.length > 0 ? data[data.length - 1]?.combined || 0 : 0;
  const previousROI = data.length > 1 ? data[data.length - 2]?.combined || 0 : 0;
  const roiTrend = latestROI - previousROI;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="text-right">
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
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
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>ROI Performance Tracker</CardTitle>
            <CardDescription>
              Return on investment across organic and paid channels
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold">{formatPercentage(averageROI)}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                {roiTrend > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                {formatPercentage(Math.abs(roiTrend))} vs. last period
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                className="text-xs"
                tickFormatter={formatPercentage}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                formatter={(value: number, name: string) => [formatPercentage(value), name]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="organic" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                name="Organic ROI"
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="paid" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Paid ROI"
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="combined" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={3}
                name="Combined ROI"
                dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}