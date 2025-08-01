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
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  Settings,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApprovalWorkflow {
  id: string;
  name: string;
  clientName: string;
  approvers: number;
  autoApprovalDays: number;
  rushEnabled: boolean;
  weekendHandling: "normal" | "extended" | "escalate";
  isDefault: boolean;
  status: "active" | "inactive";
}

export function ApprovalWorkflowsSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([
    {
      id: "1",
      name: "Standard Client Workflow",
      clientName: "Default Template",
      approvers: 2,
      autoApprovalDays: 3,
      rushEnabled: true,
      weekendHandling: "extended",
      isDefault: true,
      status: "active"
    },
    {
      id: "2", 
      name: "Enterprise Client Process",
      clientName: "Acme Corporation",
      approvers: 3,
      autoApprovalDays: 5,
      rushEnabled: false,
      weekendHandling: "escalate",
      isDefault: false,
      status: "active"
    },
    {
      id: "3",
      name: "Quick Approval",
      clientName: "TechStart Inc",
      approvers: 1,
      autoApprovalDays: 1,
      rushEnabled: true,
      weekendHandling: "normal",
      isDefault: false,
      status: "active"
    }
  ]);

  const [defaultSettings, setDefaultSettings] = useState({
    requiredApprovers: 2,
    autoApprovalEnabled: true,
    autoApprovalDays: 3,
    rushApprovalEnabled: true,
    weekendHandling: "extended",
    emergencyBypass: true,
    reminderFrequency: "daily"
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Approval workflows updated",
      description: "Your approval workflow settings have been saved.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return null;
    }
  };

  const getWeekendHandlingBadge = (handling: string) => {
    switch (handling) {
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      case "extended":
        return <Badge className="bg-warning text-warning-foreground">Extended</Badge>;
      case "escalate":
        return <Badge className="bg-destructive text-destructive-foreground">Escalate</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Approval Workflows</h1>
        <p className="text-muted-foreground mt-1">
          Configure content approval processes and escalation rules
        </p>
      </div>

      {/* Default Approval Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Default Approval Settings
          </CardTitle>
          <CardDescription>
            Configure the default approval process for new clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="requiredApprovers">Required Approvers</Label>
              <Select 
                value={defaultSettings.requiredApprovers.toString()}
                onValueChange={(value) => 
                  setDefaultSettings(prev => ({ ...prev, requiredApprovers: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Approver</SelectItem>
                  <SelectItem value="2">2 Approvers</SelectItem>
                  <SelectItem value="3">3 Approvers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
              <Select 
                value={defaultSettings.reminderFrequency}
                onValueChange={(value) => 
                  setDefaultSettings(prev => ({ ...prev, reminderFrequency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="twice-daily">Twice Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve content after specified time period
                </p>
              </div>
              <Switch 
                checked={defaultSettings.autoApprovalEnabled}
                onCheckedChange={(checked) => 
                  setDefaultSettings(prev => ({ ...prev, autoApprovalEnabled: checked }))
                }
              />
            </div>

            {defaultSettings.autoApprovalEnabled && (
              <div className="ml-4 space-y-2">
                <Label htmlFor="autoApprovalDays">Auto-approve after (days)</Label>
                <Input 
                  id="autoApprovalDays"
                  type="number"
                  min="1"
                  max="7"
                  value={defaultSettings.autoApprovalDays}
                  onChange={(e) => 
                    setDefaultSettings(prev => ({ ...prev, autoApprovalDays: parseInt(e.target.value) }))
                  }
                  className="w-24"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Rush Approval Process</Label>
              <p className="text-sm text-muted-foreground">
                Allow urgent content to bypass normal approval timelines
              </p>
            </div>
            <Switch 
              checked={defaultSettings.rushApprovalEnabled}
              onCheckedChange={(checked) => 
                setDefaultSettings(prev => ({ ...prev, rushApprovalEnabled: checked }))
              }
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base font-medium">Weekend & Holiday Handling</Label>
            <Select 
              value={defaultSettings.weekendHandling}
              onValueChange={(value) => 
                setDefaultSettings(prev => ({ ...prev, weekendHandling: value }))
              }
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal Process</SelectItem>
                <SelectItem value="extended">Extended Deadlines</SelectItem>
                <SelectItem value="escalate">Auto-escalate</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How to handle approvals during weekends and holidays
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Emergency Bypass</Label>
              <p className="text-sm text-muted-foreground">
                Allow certain team members to bypass approval for emergencies
              </p>
            </div>
            <Switch 
              checked={defaultSettings.emergencyBypass}
              onCheckedChange={(checked) => 
                setDefaultSettings(prev => ({ ...prev, emergencyBypass: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Client-Specific Workflows */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client-Specific Workflows</CardTitle>
              <CardDescription>
                Customize approval processes for individual clients
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Approvers</TableHead>
                <TableHead>Auto-Approval</TableHead>
                <TableHead>Weekend Handling</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{workflow.name}</span>
                      {workflow.isDefault && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{workflow.clientName}</TableCell>
                  <TableCell className="text-center">{workflow.approvers}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{workflow.autoApprovalDays} days</span>
                    </div>
                  </TableCell>
                  <TableCell>{getWeekendHandlingBadge(workflow.weekendHandling)}</TableCell>
                  <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      {!workflow.isDefault && (
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Approval Email Templates
          </CardTitle>
          <CardDescription>
            Customize email templates sent to approvers and clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="approvalRequest">Approval Request Template</Label>
              <Textarea
                id="approvalRequest"
                placeholder="Customize the email sent when content needs approval..."
                defaultValue="Hi {approver_name}, New content from {creator_name} is ready for your review. Please review and approve by {deadline}."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="approvalReminder">Approval Reminder Template</Label>
              <Textarea
                id="approvalReminder"
                placeholder="Customize the reminder email..."
                defaultValue="Reminder: Content approval needed for {content_title}. Deadline: {deadline}"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="approvalConfirmation">Approval Confirmation Template</Label>
              <Textarea
                id="approvalConfirmation"
                placeholder="Customize the confirmation email..."
                defaultValue="Content '{content_title}' has been approved and is scheduled for {publish_date}."
                className="mt-2"
              />
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Available Variables</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
              <span>{"{approver_name}"}</span>
              <span>{"{creator_name}"}</span>
              <span>{"{content_title}"}</span>
              <span>{"{deadline}"}</span>
              <span>{"{client_name}"}</span>
              <span>{"{publish_date}"}</span>
              <span>{"{content_type}"}</span>
              <span>{"{platform}"}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Templates"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}