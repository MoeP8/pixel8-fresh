import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdCampaign, AutomationRule } from "@/hooks/useAdsManagement";
import { Plus, Zap, Play, Pause, Settings } from "lucide-react";
import { format } from 'date-fns';

interface AutomationRulesProps {
  clientId: string;
  campaigns: AdCampaign[];
  automationRules: AutomationRule[];
  onRuleCreate: (rule: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at'>) => Promise<AutomationRule>;
  loading: boolean;
}

export function AutomationRules({ 
  clientId, 
  campaigns, 
  automationRules, 
  onRuleCreate, 
  loading 
}: AutomationRulesProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    rule_name: '',
    rule_type: '',
    applies_to: '',
    target_campaigns: [] as string[],
    conditions: {
      metric: '',
      operator: '',
      threshold: '',
      timeframe: 'daily'
    },
    actions: {
      action_type: '',
      value: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const ruleData = {
        client_id: clientId,
        rule_name: formData.rule_name,
        rule_type: formData.rule_type as AutomationRule['rule_type'],
        applies_to: formData.applies_to as AutomationRule['applies_to'],
        target_ids: formData.target_campaigns,
        conditions: formData.conditions,
        actions: formData.actions,
        is_active: true,
        trigger_count: 0
      };

      await onRuleCreate(ruleData);
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating automation rule:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      rule_name: '',
      rule_type: '',
      applies_to: '',
      target_campaigns: [],
      conditions: {
        metric: '',
        operator: '',
        threshold: '',
        timeframe: 'daily'
      },
      actions: {
        action_type: '',
        value: ''
      }
    });
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return '💰';
      case 'bid':
        return '🎯';
      case 'pause_resume':
        return '⏸️';
      case 'creative_rotation':
        return '🔄';
      case 'audience_expansion':
        return '📈';
      default:
        return '⚙️';
    }
  };

  const getRuleTypeBadge = (type: string) => {
    const colors = {
      budget: 'bg-green-500',
      bid: 'bg-blue-500',
      pause_resume: 'bg-orange-500',
      creative_rotation: 'bg-purple-500',
      audience_expansion: 'bg-pink-500'
    };
    
    return (
      <Badge className={`${colors[type as keyof typeof colors] || 'bg-gray-500'} text-white border-none`}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-success">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
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
            <CardTitle>Automation Rules</CardTitle>
            <CardDescription>Create intelligent rules to automate campaign management</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Automation Rule</DialogTitle>
                <DialogDescription>
                  Set up intelligent automation to optimize your campaigns
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="rule_name">Rule Name</Label>
                  <Input
                    id="rule_name"
                    value={formData.rule_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, rule_name: e.target.value }))}
                    placeholder="Auto-pause low performing ads"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rule_type">Rule Type</Label>
                    <Select value={formData.rule_type} onValueChange={(value) => setFormData(prev => ({ ...prev, rule_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget Management</SelectItem>
                        <SelectItem value="bid">Bid Optimization</SelectItem>
                        <SelectItem value="pause_resume">Pause/Resume</SelectItem>
                        <SelectItem value="creative_rotation">Creative Rotation</SelectItem>
                        <SelectItem value="audience_expansion">Audience Expansion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="applies_to">Applies To</Label>
                    <Select value={formData.applies_to} onValueChange={(value) => setFormData(prev => ({ ...prev, applies_to: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campaign">Campaigns</SelectItem>
                        <SelectItem value="ad_group">Ad Groups</SelectItem>
                        <SelectItem value="ad">Individual Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Target Campaigns</Label>
                  <div className="space-y-2">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={campaign.id}
                          checked={formData.target_campaigns.includes(campaign.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                target_campaigns: [...prev.target_campaigns, campaign.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                target_campaigns: prev.target_campaigns.filter(id => id !== campaign.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={campaign.id} className="text-sm">
                          {campaign.campaign_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Conditions</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Metric</Label>
                      <Select 
                        value={formData.conditions.metric} 
                        onValueChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          conditions: { ...prev.conditions, metric: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ctr">Click-Through Rate</SelectItem>
                          <SelectItem value="cpc">Cost Per Click</SelectItem>
                          <SelectItem value="cpa">Cost Per Acquisition</SelectItem>
                          <SelectItem value="roas">Return on Ad Spend</SelectItem>
                          <SelectItem value="quality_score">Quality Score</SelectItem>
                          <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Operator</Label>
                      <Select 
                        value={formData.conditions.operator} 
                        onValueChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          conditions: { ...prev.conditions, operator: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="greater_than">Greater than</SelectItem>
                          <SelectItem value="less_than">Less than</SelectItem>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="greater_equal">Greater than or equal</SelectItem>
                          <SelectItem value="less_equal">Less than or equal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Threshold</Label>
                      <Input
                        value={formData.conditions.threshold}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          conditions: { ...prev.conditions, threshold: e.target.value }
                        }))}
                        placeholder="2.5"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Actions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Action Type</Label>
                      <Select 
                        value={formData.actions.action_type} 
                        onValueChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          actions: { ...prev.actions, action_type: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pause">Pause</SelectItem>
                          <SelectItem value="resume">Resume</SelectItem>
                          <SelectItem value="increase_bid">Increase Bid</SelectItem>
                          <SelectItem value="decrease_bid">Decrease Bid</SelectItem>
                          <SelectItem value="increase_budget">Increase Budget</SelectItem>
                          <SelectItem value="decrease_budget">Decrease Budget</SelectItem>
                          <SelectItem value="send_alert">Send Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Value (if applicable)</Label>
                      <Input
                        value={formData.actions.value}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          actions: { ...prev.actions, value: e.target.value }
                        }))}
                        placeholder="10% or $50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Rule</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {automationRules.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Triggers</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automationRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span>{getRuleTypeIcon(rule.rule_type)}</span>
                          {rule.rule_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Applies to {rule.target_ids.length} {rule.applies_to}(s)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRuleTypeBadge(rule.rule_type)}</TableCell>
                    <TableCell>{getStatusBadge(rule.is_active)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.trigger_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {rule.last_triggered_at ? (
                          format(new Date(rule.last_triggered_at), 'MMM dd, HH:mm')
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Automation Rules</h3>
            <p className="text-muted-foreground mb-4">
              Create intelligent automation rules to optimize your campaigns automatically.
            </p>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Rule
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}