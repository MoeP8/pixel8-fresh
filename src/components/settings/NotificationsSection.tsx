import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Users, 
  Calendar,
  Slack,
  Save,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  category: string;
  icon: React.ElementType;
  description: string;
  email: boolean;
  inApp: boolean;
  push: boolean;
  priority: "high" | "medium" | "low";
}

interface ValidationError {
  field: string;
  message: string;
}

export function NotificationsSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError>>({});
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "failed_posts",
      category: "Failed Posts",
      icon: AlertTriangle,
      description: "When scheduled posts fail to publish",
      email: true,
      inApp: true,
      push: true,
      priority: "high"
    },
    {
      id: "overdue_approvals",
      category: "Overdue Approvals", 
      icon: AlertTriangle,
      description: "Content pending approval past deadline",
      email: true,
      inApp: true,
      push: false,
      priority: "high"
    },
    {
      id: "content_approved",
      category: "Content Approved",
      icon: CheckCircle2,
      description: "When client approves submitted content",
      email: true,
      inApp: true,
      push: false,
      priority: "medium"
    },
    {
      id: "content_ready",
      category: "Content Ready for Review",
      icon: CheckCircle2,
      description: "New content submitted for approval",
      email: true,
      inApp: true,
      push: false,
      priority: "medium"
    },
    {
      id: "performance_alerts",
      category: "Performance Alerts",
      icon: BarChart3,
      description: "Significant metric changes or campaign alerts",
      email: false,
      inApp: true,
      push: false,
      priority: "medium"
    },
    {
      id: "team_changes",
      category: "Team Changes",
      icon: Users,
      description: "New team members or role updates",
      email: true,
      inApp: true,
      push: false,
      priority: "low"
    },
    {
      id: "post_confirmations",
      category: "Post Confirmations",
      icon: Calendar,
      description: "Confirmations when posts are successfully published",
      email: false,
      inApp: true,
      push: false,
      priority: "low"
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    emailDigest: true,
    digestFrequency: "daily",
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00",
    slackIntegration: false
  });

  // Validation functions
  const validateQuietHours = (startTime: string, endTime: string): ValidationError | null => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (start.getTime() === end.getTime()) {
      return { field: 'quietHours', message: 'Start and end times cannot be the same' };
    }
    
    return null;
  };

  const validateDigestFrequency = (frequency: string): ValidationError | null => {
    const validFrequencies = ['hourly', 'daily', 'weekly'];
    if (!validFrequencies.includes(frequency)) {
      return { field: 'digestFrequency', message: 'Invalid digest frequency selected' };
    }
    return null;
  };

  const validateNotificationChannels = (): ValidationError | null => {
    // Ensure high priority notifications have at least one channel enabled
    const highPriorityNotifications = notifications.filter(n => n.priority === 'high');
    const hasDisabledHighPriority = highPriorityNotifications.some(n => 
      !n.email && !n.inApp && !n.push
    );
    
    if (hasDisabledHighPriority) {
      return { 
        field: 'notificationChannels', 
        message: 'High priority notifications must have at least one delivery method enabled' 
      };
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

  const handleQuietHoursChange = (field: 'quietStart' | 'quietEnd', value: string) => {
    const newSettings = { ...globalSettings, [field]: value };
    setGlobalSettings(newSettings);
    
    if (globalSettings.quietHours) {
      const error = validateQuietHours(
        field === 'quietStart' ? value : globalSettings.quietStart,
        field === 'quietEnd' ? value : globalSettings.quietEnd
      );
      
      if (error) {
        setValidationErrors(prev => ({ ...prev, quietHours: error }));
      } else {
        clearValidationError('quietHours');
      }
    }
  };

  const handleDigestFrequencyChange = (frequency: string) => {
    setGlobalSettings(prev => ({ ...prev, digestFrequency: frequency }));
    
    const error = validateDigestFrequency(frequency);
    if (error) {
      setValidationErrors(prev => ({ ...prev, digestFrequency: error }));
    } else {
      clearValidationError('digestFrequency');
    }
  };

  const updateNotification = (id: string, field: keyof NotificationSetting, value: boolean) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, [field]: value }
        : notification
    ));
    
    // Clear validation error when channels are updated
    clearValidationError('notificationChannels');
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, ValidationError> = {};
    
    // Validate quiet hours if enabled
    if (globalSettings.quietHours) {
      const quietHoursError = validateQuietHours(globalSettings.quietStart, globalSettings.quietEnd);
      if (quietHoursError) {
        errors.quietHours = quietHoursError;
      }
    }
    
    // Validate digest frequency if email digest is enabled
    if (globalSettings.emailDigest) {
      const digestError = validateDigestFrequency(globalSettings.digestFrequency);
      if (digestError) {
        errors.digestFrequency = digestError;
      }
    }
    
    // Validate notification channels
    const channelsError = validateNotificationChannels();
    if (channelsError) {
      errors.notificationChannels = channelsError;
    }
    
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
        title: "Notification settings saved",
        description: "Your notification preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-destructive text-destructive-foreground">High</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Manage your notification preferences across all channels
        </p>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Global Settings
          </CardTitle>
          <CardDescription>
            Configure general notification behavior and delivery preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Digest */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Email Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a summary of notifications via email
              </p>
            </div>
            <Switch 
              checked={globalSettings.emailDigest}
              onCheckedChange={(checked) => 
                setGlobalSettings(prev => ({ ...prev, emailDigest: checked }))
              }
            />
          </div>

          {globalSettings.emailDigest && (
            <div className="ml-4 space-y-2">
              <Label htmlFor="digestFrequency">Digest Frequency *</Label>
              <Select 
                value={globalSettings.digestFrequency}
                onValueChange={handleDigestFrequencyChange}
              >
                <SelectTrigger className={`w-40 ${validationErrors.digestFrequency ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.digestFrequency && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.digestFrequency.message}</span>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Disable push notifications during specified hours
                </p>
              </div>
              <Switch 
                checked={globalSettings.quietHours}
                onCheckedChange={(checked) => 
                  setGlobalSettings(prev => ({ ...prev, quietHours: checked }))
                }
              />
            </div>

            {globalSettings.quietHours && (
              <div className="ml-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quietStart">Start Time *</Label>
                    <Select 
                      value={globalSettings.quietStart}
                      onValueChange={(value) => handleQuietHoursChange('quietStart', value)}
                    >
                      <SelectTrigger className={`w-24 ${validationErrors.quietHours ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-muted-foreground mt-6">to</span>
                  <div className="space-y-2">
                    <Label htmlFor="quietEnd">End Time *</Label>
                    <Select 
                      value={globalSettings.quietEnd}
                      onValueChange={(value) => handleQuietHoursChange('quietEnd', value)}
                    >
                      <SelectTrigger className={`w-24 ${validationErrors.quietHours ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {validationErrors.quietHours && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{validationErrors.quietHours.message}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Push notifications will be silenced during these hours
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Slack Integration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Slack className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base font-medium">Slack Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications to your Slack workspace
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {globalSettings.slackIntegration && (
                <Badge className="bg-success text-success-foreground">Connected</Badge>
              )}
              <Switch 
                checked={globalSettings.slackIntegration}
                onCheckedChange={(checked) => 
                  setGlobalSettings(prev => ({ ...prev, slackIntegration: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Categories</CardTitle>
          <CardDescription>
            Configure how you want to be notified for different types of events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {validationErrors.notificationChannels && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span>{validationErrors.notificationChannels.message}</span>
              </div>
            )}
            
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 pb-3 border-b border-border text-sm font-medium">
              <div>Category</div>
              <div className="text-center">
                <Mail className="h-4 w-4 mx-auto" />
                <span className="text-xs">Email</span>
              </div>
              <div className="text-center">
                <Bell className="h-4 w-4 mx-auto" />
                <span className="text-xs">In-App</span>
              </div>
              <div className="text-center">
                <Smartphone className="h-4 w-4 mx-auto" />
                <span className="text-xs">Push</span>
              </div>
              <div className="text-center">Priority</div>
            </div>

            {/* Notification Rows */}
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div key={notification.id} className="grid grid-cols-5 gap-4 items-center py-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{notification.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Switch 
                      checked={notification.email}
                      onCheckedChange={(checked) => 
                        updateNotification(notification.id, "email", checked)
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch 
                      checked={notification.inApp}
                      onCheckedChange={(checked) => 
                        updateNotification(notification.id, "inApp", checked)
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch 
                      checked={notification.push}
                      onCheckedChange={(checked) => 
                        updateNotification(notification.id, "push", checked)
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    {getPriorityBadge(notification.priority)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-6 border-t border-border">
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
              {isLoading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}