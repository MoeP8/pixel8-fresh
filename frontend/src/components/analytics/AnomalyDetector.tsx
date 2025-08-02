import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, TrendingDown, Eye, Settings } from 'lucide-react';
import { Anomaly } from '@/hooks/useAnalytics';

interface AnomalyDetectorProps {
  anomalies: Anomaly[];
  clientId?: string;
}

export function AnomalyDetector({ anomalies, clientId }: AnomalyDetectorProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      case 'low': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatValue = (value: number, metric: string) => {
    if (metric === 'spend') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
    if (metric.includes('rate') || metric.includes('ctr')) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Performance Anomaly Detection
            </CardTitle>
            <CardDescription>
              Automated detection of unusual patterns in campaign performance
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {anomalies.length > 0 ? (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div 
                key={anomaly.id} 
                className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5">
                  {getSeverityIcon(anomaly.severity)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{anomaly.description}</h4>
                    <Badge variant={getSeverityColor(anomaly.severity) as any}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Current Value:</span>{' '}
                      {formatValue(anomaly.value, anomaly.metric)}
                    </div>
                    <div>
                      <span className="font-medium">Threshold:</span>{' '}
                      {formatValue(anomaly.threshold, anomaly.metric)}
                    </div>
                    <div>
                      <span className="font-medium">Metric:</span> {anomaly.metric}
                    </div>
                    <div>
                      <span className="font-medium">Detected:</span>{' '}
                      {new Date(anomaly.detected_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Investigate
                    </Button>
                    <Button variant="outline" size="sm">
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-700 mb-2">All Systems Normal</h3>
            <p className="text-muted-foreground">
              No performance anomalies detected in the current period.
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Monitoring Settings</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Spend Threshold:</span> $5,000
            </div>
            <div>
              <span className="font-medium">CTR Drop:</span> {'>'}20%
            </div>
            <div>
              <span className="font-medium">CPA Increase:</span> {'>'}50%
            </div>
            <div>
              <span className="font-medium">ROAS Drop:</span> {'>'}30%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}