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
  Save,
  Loader2
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

interface ValidationError {
  field: string;
  message: string;
}

interface EmailTemplate {
  approvalRequest: string;
  approvalReminder: string;
  approvalConfirmation: string;
}

export function ApprovalWorkflowsSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError>>({});
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

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate>({
    approvalRequest: "Hi {approver_name}, New content from {creator_name} is ready for your review. Please review and approve by {deadline}.",
    approvalReminder: "Reminder: Content approval needed for {content_title}. Deadline: {deadline}",
    approvalConfirmation: "Content '{content_title}' has been approved and is scheduled for {publish_date}."
  });

  // Validation functions
  const validateApprovalDays = (days: number): ValidationError | null => {
    if (isNaN(days) || days < 1 || days > 7) {
      return { field: 'autoApprovalDays', message: 'Auto-approval days must be between 1 and 7' };
    }
    return null;
  };

  const validateWorkflowName = (name: string, workflowId?: string): ValidationError | null => {
    if (!name || name.trim() === "") {
      return { field: 'workflowName', message: 'Workflow name is required' };
    }
    if (name.length < 3) {
      return { field: 'workflowName', message: 'Workflow name must be at least 3 characters' };
    }
    if (name.length > 100) {
      return { field: 'workflowName', message: 'Workflow name must be less than 100 characters' };
    }
    
    // Check for duplicate workflow names
    const duplicate = workflows.find(w => 
      w.id !== workflowId && w.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      return { field: 'workflowName', message: 'A workflow with this name already exists' };
    }
    return null;
  };

  const validateEmailTemplate = (template: string, field: string): ValidationError | null => {
    if (!template || template.trim() === "") {
      return { field, message: 'Email template is required' };
    }
    if (template.length < 10) {
      return { field, message: 'Email template must be at least 10 characters' };
    }
    if (template.length > 1000) {
      return { field, message: 'Email template must be less than 1000 characters' };
    }
    
    // Check for required variables based on template type
    const requiredVars = {
      approvalRequest: ['{approver_name}', '{creator_name}'],
      approvalReminder: ['{content_title}', '{deadline}'],
      approvalConfirmation: ['{content_title}']
    };
    
    const required = requiredVars[field as keyof typeof requiredVars];
    if (required) {
      const missing = required.filter(variable => !template.includes(variable));
      if (missing.length > 0) {
        return { 
          field, 
          message: `Template must include: ${missing.join(', ')}` 
        };
      }
    }
    
    return null;
  };

  const clearValidationError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleApprovalDaysChange = (days: number) => {
    setDefaultSettings(prev => ({ ...prev, autoApprovalDays: days }));
    
    const error = validateApprovalDays(days);
    if (error) {
      setValidationErrors(prev => ({ ...prev, autoApprovalDays: error }));
    } else {
      clearValidationError('autoApprovalDays');
    }
  };

  const handleEmailTemplateChange = (field: keyof EmailTemplate, value: string) => {
    setEmailTemplates(prev => ({ ...prev, [field]: value }));
    
    const error = validateEmailTemplate(value, field);
    if (error) {
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    } else {
      clearValidationError(field);
    }
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, ValidationError> = {};
    
    // Validate auto-approval days
    const daysError = validateApprovalDays(defaultSettings.autoApprovalDays);
    if (daysError) {
      errors.autoApprovalDays = daysError;
    }
    
    // Validate email templates
    Object.entries(emailTemplates).forEach(([field, template]) => {
      const error = validateEmailTemplate(template, field);
      if (error) {
        errors[field] = error;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateAllFields()) {
      toast({
        title: "Validation errors",
        description: "Please fix the errors below before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Approval workflows updated",
        description: "Your approval workflow settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save approval workflows. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                <Label htmlFor="autoApprovalDays">Auto-approve after (days) *</Label>
                <Input 
                  id="autoApprovalDays"
                  type="number"
                  min="1"
                  max="7"
                  value={defaultSettings.autoApprovalDays}
                  onChange={(e) => handleApprovalDaysChange(parseInt(e.target.value) || 0)}
                  className={`w-24 ${validationErrors.autoApprovalDays ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {validationErrors.autoApprovalDays && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{validationErrors.autoApprovalDays.message}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Content will be automatically approved after this many days
                </p>
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
            <div className="space-y-2">
              <Label htmlFor="approvalRequest">Approval Request Template *</Label>
              <Textarea
                id="approvalRequest"
                placeholder="Customize the email sent when content needs approval..."
                value={emailTemplates.approvalRequest}
                onChange={(e) => handleEmailTemplateChange('approvalRequest', e.target.value)}
                className={`mt-2 ${validationErrors.approvalRequest ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {validationErrors.approvalRequest && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.approvalRequest.message}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvalReminder">Approval Reminder Template *</Label>
              <Textarea
                id="approvalReminder"
                placeholder="Customize the reminder email..."
                value={emailTemplates.approvalReminder}
                onChange={(e) => handleEmailTemplateChange('approvalReminder', e.target.value)}
                className={`mt-2 ${validationErrors.approvalReminder ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {validationErrors.approvalReminder && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.approvalReminder.message}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvalConfirmation">Approval Confirmation Template *</Label>
              <Textarea
                id="approvalConfirmation"
                placeholder="Customize the confirmation email..."
                value={emailTemplates.approvalConfirmation}
                onChange={(e) => handleEmailTemplateChange('approvalConfirmation', e.target.value)}
                className={`mt-2 ${validationErrors.approvalConfirmation ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {validationErrors.approvalConfirmation && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.approvalConfirmation.message}</span>
                </div>
              )}
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
            <Button 
              onClick={handleSave} 
              disabled={isLoading || Object.keys(validationErrors).length > 0} 
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? "Saving..." : "Save Templates"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}