import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, TrendingUp, Pause, Play, Settings, AlertTriangle, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  type: 'performance' | 'budget' | 'content' | 'audience';
  trigger: {
    metric: string;
    operator: 'greater_than' | 'less_than' | 'equals';
    value: number;
    timeframe: string;
  };
  action: {
    type: string;
    parameters: Record<string, any>;
  };
  isActive: boolean;
  lastTriggered?: string;
  triggerCount: number;
}

interface SmartAutomationWorkflowsProps {
  clientId?: string;
}

export function SmartAutomationWorkflows({ clientId }: SmartAutomationWorkflowsProps) {
  const { toast } = useToast();
  const [activeRules, setActiveRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-boost High-Performing Posts',
      type: 'performance',
      trigger: {
        metric: 'engagement_rate',
        operator: 'greater_than',
        value: 5,
        timeframe: '24h'
      },
      action: {
        type: 'create_ad_campaign',
        parameters: {
          budget: 100,
          duration: '7_days',
          audience: 'lookalike'
        }
      },
      isActive: true,
      lastTriggered: '2024-01-15T10:30:00Z',
      triggerCount: 12
    },
    {
      id: '2',
      name: 'Pause Underperforming Campaigns',
      type: 'performance',
      trigger: {
        metric: 'roas',
        operator: 'less_than',
        value: 1.5,
        timeframe: '72h'
      },
      action: {
        type: 'pause_campaign',
        parameters: {
          notify: true,
          reason: 'Low ROAS performance'
        }
      },
      isActive: true,
      lastTriggered: '2024-01-14T15:20:00Z',
      triggerCount: 3
    },
    {
      id: '3',
      name: 'Scale Successful Campaigns',
      type: 'budget',
      trigger: {
        metric: 'roas',
        operator: 'greater_than',
        value: 4,
        timeframe: '48h'
      },
      action: {
        type: 'increase_budget',
        parameters: {
          increase_percentage: 25,
          max_daily_budget: 500
        }
      },
      isActive: true,
      triggerCount: 8
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    type: 'performance',
    trigger: {
      metric: 'engagement_rate',
      operator: 'greater_than',
      value: 0,
      timeframe: '24h'
    },
    action: {
      type: 'create_ad_campaign',
      parameters: {}
    },
    isActive: true
  });

  const toggleRule = (ruleId: string) => {
    setActiveRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    );
    toast({
      title: "Automation Rule Updated",
      description: "Rule status has been changed successfully."
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'budget': return 'bg-green-100 text-green-800';
      case 'content': return 'bg-purple-100 text-purple-800';
      case 'audience': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create_ad_campaign': return <TrendingUp className="h-4 w-4" />;
      case 'pause_campaign': return <Pause className="h-4 w-4" />;
      case 'increase_budget': return <Target className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Smart Automation Workflows</h2>
          <p className="text-muted-foreground">
            Intelligent automation connecting content, ads, and performance
          </p>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Create New Rule
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeRules.map((rule) => (
            <Card key={rule.id} className={`${rule.isActive ? 'border-green-200' : 'border-gray-200'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={rule.isActive}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(rule.type)}>
                          {rule.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Triggered {rule.triggerCount} times
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getActionIcon(rule.action.type)}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Trigger Condition</h4>
                    <div className="text-sm text-muted-foreground">
                      When <span className="font-medium">{rule.trigger.metric}</span> is{' '}
                      <span className="font-medium">
                        {rule.trigger.operator.replace('_', ' ')} {rule.trigger.value}
                        {rule.trigger.metric.includes('rate') ? '%' : ''}
                      </span>{' '}
                      over <span className="font-medium">{rule.trigger.timeframe}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Automated Action</h4>
                    <div className="text-sm text-muted-foreground">
                      {rule.action.type.replace('_', ' ').toUpperCase()}
                      {rule.action.parameters.budget && (
                        <span> (${rule.action.parameters.budget} budget)</span>
                      )}
                      {rule.action.parameters.increase_percentage && (
                        <span> (+{rule.action.parameters.increase_percentage}%)</span>
                      )}
                    </div>
                  </div>
                </div>
                {rule.lastTriggered && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Last triggered: {new Date(rule.lastTriggered).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Performance Booster</CardTitle>
                <CardDescription>
                  Automatically promote high-engaging organic posts as ads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Trigger:</strong> Organic post reaches 500+ engagements in 24h
                  </div>
                  <div className="text-sm">
                    <strong>Action:</strong> Create $50/day ad campaign with lookalike audience
                  </div>
                  <Button className="w-full">Use Template</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ROAS Optimizer</CardTitle>
                <CardDescription>
                  Scale winning campaigns and pause underperformers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Trigger:</strong> Campaign ROAS {'>'}3x for 48h
                  </div>
                  <div className="text-sm">
                    <strong>Action:</strong> Increase budget by 30% (max $300/day)
                  </div>
                  <Button className="w-full">Use Template</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>CRM Integration</CardTitle>
                <CardDescription>Sync ad conversions to customer database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>HubSpot</span>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Salesforce</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cross-Platform Sync</CardTitle>
                <CardDescription>Sync audiences between platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Google ↔ Meta</span>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>LinkedIn Sync</span>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeRules.filter(r => r.isActive).length}
                </div>
                <div className="text-xs text-muted-foreground">
                  of {activeRules.length} total
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Triggers Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <div className="text-xs text-green-600">+8 from yesterday</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Automation Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,340</div>
                <div className="text-xs text-muted-foreground">this month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-muted-foreground">rule execution</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}