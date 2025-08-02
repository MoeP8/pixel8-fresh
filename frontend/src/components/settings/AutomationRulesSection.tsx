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
  Save
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

export function AutomationRulesSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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

  const [newRule, setNewRule] = useState({
    name: "",
    type: "performance",
    trigger: "",
    action: "",
    threshold: "",
    timeframe: "1h"
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Automation rules updated",
      description: "Your automation settings have been saved.",
    });
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
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input 
                id="ruleName"
                placeholder="e.g., Auto-pause low ROAS campaigns"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruleType">Rule Type</Label>
              <Select 
                value={newRule.type}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, type: value }))}
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
              <Label htmlFor="trigger">Trigger Condition</Label>
              <Select>
                <SelectTrigger>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold</Label>
              <Input 
                id="threshold"
                placeholder="e.g., 5% or $50"
                value={newRule.threshold}
                onChange={(e) => setNewRule(prev => ({ ...prev, threshold: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select 
                value={newRule.timeframe}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, timeframe: value }))}
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
            <Label htmlFor="action">Action to Take</Label>
            <Select>
              <SelectTrigger>
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
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Rule
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
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
