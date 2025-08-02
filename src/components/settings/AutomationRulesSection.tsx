import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Zap, 
  TrendingUp, 
  Target, 
  Hash, 
  Calendar, 
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
  Save,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutomationRule {
  id: string;
  name: string;
  type: "performance" | "content" | "scheduling";
  trigger: string;
  action: string;
  isActive: boolean;
  lastTriggered?: string;
  triggerCount: number;
}

interface ValidationError {
  field: string;
  message: string;
}

interface NewRuleForm {
  name: string;
  type: string;
  trigger: string;
  action: string;
  threshold: string;
  timeframe: string;
}

export function AutomationRulesSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError>>({});
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Auto-boost High Engagement",
      type: "performance",
      trigger: "Post reaches 100+ likes in 1 hour",
      action: "Boost post with $20 budget",
      isActive: true,
      lastTriggered: "2 hours ago",
      triggerCount: 12
    },
    {
      id: "2", 
      name: "Pause Low-Performing Campaigns",
      type: "performance", 
      trigger: "Campaign CPA exceeds $50",
      action: "Pause campaign and send alert",
      isActive: true,
      lastTriggered: "Never",
      triggerCount: 0
    },
    {
      id: "3",
      name: "Auto-add Trending Hashtags",
      type: "content",
      trigger: "New post created",
      action: "Suggest trending hashtags for industry",
      isActive: false,
      lastTriggered: "1 day ago",
      triggerCount: 45
    },
    {
      id: "4",
      name: "Content Pillar Distribution",
      type: "content",
      trigger: "Weekly content review",
      action: "Adjust pillar distribution to maintain 30% educational",
      isActive: true,
      lastTriggered: "3 days ago",
      triggerCount: 8
    }
  ]);

  const [newRule, setNewRule] = useState<NewRuleForm>({
    name: "",
    type: "performance",
    trigger: "",
    action: "",
    threshold: "",
    timeframe: "1h"
  });

  // Validation functions
  const validateField = (field: string, value: string): ValidationError | null => {
    switch (field) {
      case 'name':
        if (!value || value.trim() === "") {
          return { field, message: "Rule name is required" };
        }
        if (value.length < 3) {
          return { field, message: "Rule name must be at least 3 characters" };
        }
        if (value.length > 100) {
          return { field, message: "Rule name must be less than 100 characters" };
        }
        // Check for duplicate names
        const existingRule = rules.find(rule => 
          rule.name.toLowerCase() === value.toLowerCase()
        );
        if (existingRule) {
          return { field, message: "A rule with this name already exists" };
        }
        break;
      
      case 'trigger':
        if (!value || value.trim() === "") {
          return { field, message: "Please select a trigger condition" };
        }
        break;
      
      case 'action':
        if (!value || value.trim() === "") {
          return { field, message: "Please select an action" };
        }
        break;
      
      case 'threshold':
        if (!value || value.trim() === "") {
          return { field, message: "Threshold value is required" };
        }
        
        // Validate based on trigger type
        if (newRule.trigger === 'engagement_rate') {
          const num = parseFloat(value.replace('%', ''));
          if (isNaN(num) || num < 0 || num > 100) {
            return { field, message: "Engagement rate must be between 0% and 100%" };
          }
        } else if (newRule.trigger === 'roas' || newRule.trigger === 'cpa') {
          const num = parseFloat(value.replace('$', ''));
          if (isNaN(num) || num < 0) {
            return { field, message: "Amount must be a positive number" };
          }
        } else if (newRule.trigger === 'clicks' || newRule.trigger === 'impressions') {
          const num = parseInt(value);
          if (isNaN(num) || num < 1) {
            return { field, message: "Count must be a positive integer" };
          }
        }
        break;
    }
    return null;
  };

  const validateNewRule = (): boolean => {
    const errors: Record<string, ValidationError> = {};
    
    Object.entries(newRule).forEach(([field, value]) => {
      if (field !== 'type' && field !== 'timeframe') {
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleFieldChange = (field: keyof NewRuleForm, value: string) => {
    setNewRule(prev => ({ ...prev, [field]: value }));
    clearValidationError(field);
    
    // Clear threshold validation when trigger changes
    if (field === 'trigger') {
      clearValidationError('threshold');
      setNewRule(prev => ({ ...prev, threshold: '' }));
    }
    
    // Validate on change
    if (value.trim()) {
      const error = validateField(field, value);
      if (error) {
        setValidationErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  };

  const handleCreateRule = async () => {
    if (!validateNewRule()) {
      toast({
        title: "Validation errors",
        description: "Please fix the errors below before creating the rule.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingRule(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the new rule
      const newRuleObj: AutomationRule = {
        id: (rules.length + 1).toString(),
        name: newRule.name,
        type: newRule.type as "performance" | "content" | "scheduling",
        trigger: getTriggerText(newRule.trigger, newRule.threshold, newRule.timeframe),
        action: getActionText(newRule.action),
        isActive: true,
        triggerCount: 0
      };
      
      setRules(prev => [...prev, newRuleObj]);
      
      // Reset form
      setNewRule({
        name: "",
        type: "performance",
        trigger: "",
        action: "",
        threshold: "",
        timeframe: "1h"
      });
      
      toast({
        title: "Rule created",
        description: "Your automation rule has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Failed to create rule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingRule(false);
    }
  };

  const getTriggerText = (trigger: string, threshold: string, timeframe: string): string => {
    const timeframes = {
      '15m': '15 minutes',
      '1h': '1 hour', 
      '6h': '6 hours',
      '24h': '24 hours',
      '7d': '7 days'
    };
    
    const triggers = {
      'engagement_rate': `Engagement rate exceeds ${threshold} in ${timeframes[timeframe as keyof typeof timeframes]}`,
      'roas': `ROAS falls below ${threshold}`,
      'cpa': `CPA exceeds ${threshold}`,
      'clicks': `Clicks exceed ${threshold} in ${timeframes[timeframe as keyof typeof timeframes]}`,
      'impressions': `Impressions exceed ${threshold} in ${timeframes[timeframe as keyof typeof timeframes]}`
    };
    
    return triggers[trigger as keyof typeof triggers] || trigger;
  };

  const getActionText = (action: string): string => {
    const actions = {
      'pause_campaign': 'Pause campaign and send alert',
      'boost_post': 'Boost post with default budget',
      'send_alert': 'Send notification alert',
      'adjust_budget': 'Automatically adjust budget',
      'change_bid': 'Change bid strategy'
    };
    
    return actions[action as keyof typeof actions] || action;
  };

  const getThresholdPlaceholder = (trigger: string): string => {
    const placeholders = {
      'engagement_rate': 'e.g., 5%',
      'roas': 'e.g., $3.50',
      'cpa': 'e.g., $25',
      'clicks': 'e.g., 100',
      'impressions': 'e.g., 10000'
    };
    
    return placeholders[trigger as keyof typeof placeholders] || 'Enter value...';
  };

  const getThresholdHint = (trigger: string): string => {
    const hints = {
      'engagement_rate': 'Enter percentage (0-100)',
      'roas': 'Enter dollar amount (e.g., 3.50)',
      'cpa': 'Enter cost per acquisition',
      'clicks': 'Enter number of clicks',
      'impressions': 'Enter number of impressions'
    };
    
    return hints[trigger as keyof typeof hints] || '';
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Automation rules updated",
        description: "Your automation settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Save failed", 
        description: "Failed to save automation rules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <TrendingUp className="h-4 w-4" />;
      case "content":
        return <Hash className="h-4 w-4" />;
      case "scheduling":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "performance":
        return <Badge className="bg-success text-success-foreground">Performance</Badge>;
      case "content":
        return <Badge className="bg-primary text-primary-foreground">Content</Badge>;
      case "scheduling":
        return <Badge className="bg-warning text-warning-foreground">Scheduling</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Automation Rules</h1>
        <p className="text-muted-foreground mt-1">
          Configure automated triggers and actions for your campaigns and content
        </p>
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Automation Settings
          </CardTitle>
          <CardDescription>
            Enable common automation features with one click
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-boost High Performers</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically promote posts with high engagement
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Smart Hashtag Suggestions</Label>
                <p className="text-sm text-muted-foreground">
                  Suggest relevant hashtags based on content
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Campaign Budget Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alert when campaigns approach budget limits
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Content Compliance Checks</Label>
                <p className="text-sm text-muted-foreground">
                  Auto-check content against brand guidelines
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create New Rule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Rule
          </CardTitle>
          <CardDescription>
            Set up a custom automation rule with specific triggers and actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name *</Label>
              <Input 
                id="ruleName"
                placeholder="e.g., Auto-pause low ROAS campaigns"
                value={newRule.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={validationErrors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {validationErrors.name && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.name.message}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruleType">Rule Type</Label>
              <Select 
                value={newRule.type}
                onValueChange={(value) => handleFieldChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance Trigger</SelectItem>
                  <SelectItem value="content">Content Automation</SelectItem>
                  <SelectItem value="scheduling">Scheduling Rule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Condition *</Label>
              <Select 
                value={newRule.trigger}
                onValueChange={(value) => handleFieldChange('trigger', value)}
              >
                <SelectTrigger 
                  className={validationErrors.trigger ? 'border-destructive focus-visible:ring-destructive' : ''}
                >
                  <SelectValue placeholder="Select trigger..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement_rate">Engagement Rate</SelectItem>
                  <SelectItem value="roas">Return on Ad Spend</SelectItem>
                  <SelectItem value="cpa">Cost Per Acquisition</SelectItem>
                  <SelectItem value="clicks">Click Count</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.trigger && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.trigger.message}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold *</Label>
              <Input 
                id="threshold"
                placeholder={getThresholdPlaceholder(newRule.trigger)}
                value={newRule.threshold}
                onChange={(e) => handleFieldChange('threshold', e.target.value)}
                className={validationErrors.threshold ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {validationErrors.threshold && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.threshold.message}</span>
                </div>
              )}
              {!validationErrors.threshold && newRule.trigger && (
                <p className="text-xs text-muted-foreground">
                  {getThresholdHint(newRule.trigger)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select 
                value={newRule.timeframe}
                onValueChange={(value) => handleFieldChange('timeframe', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="6h">6 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action to Take *</Label>
            <Select 
              value={newRule.action}
              onValueChange={(value) => handleFieldChange('action', value)}
            >
              <SelectTrigger
                className={validationErrors.action ? 'border-destructive focus-visible:ring-destructive' : ''}
              >
                <SelectValue placeholder="Select action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pause_campaign">Pause Campaign</SelectItem>
                <SelectItem value="boost_post">Boost Post</SelectItem>
                <SelectItem value="send_alert">Send Alert</SelectItem>
                <SelectItem value="adjust_budget">Adjust Budget</SelectItem>
                <SelectItem value="change_bid">Change Bid Strategy</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.action && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span>{validationErrors.action.message}</span>
              </div>
            )}
          </div>

          <Button 
            onClick={handleCreateRule}
            disabled={isCreatingRule || Object.keys(validationErrors).length > 0}
            className="gap-2"
          >
            {isCreatingRule ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isCreatingRule ? 'Creating...' : 'Create Rule'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Active Automation Rules</CardTitle>
          <CardDescription>
            Manage your existing automation rules and monitor their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Triggered</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">{rule.trigger}</p>
                      <p className="text-xs text-muted-foreground">→ {rule.action}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(rule.type)}</TableCell>
                  <TableCell>
                    {rule.isActive ? (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <Play className="h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Pause className="h-3 w-3" />
                        Paused
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{rule.triggerCount}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {rule.lastTriggered}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleRule(rule.id)}
                      >
                        {rule.isActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end pt-6 border-t border-border">
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
