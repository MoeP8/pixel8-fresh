import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Key, 
  Download, 
  Trash2, 
  Copy, 
  Eye,
  EyeOff,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Save,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationError {
  field: string;
  message: string;
}

export function SecuritySection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError>>({});
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    passwordRequirements: {
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true,
      requireUnique: true
    },
    sessionSettings: {
      maxSessions: 5,
      sessionTimeout: 24,
      requireReauth: true
    },
    dataRetention: {
      exportEnabled: true,
      autoDelete: false,
      retentionPeriod: 36
    }
  });

  const backupCodes = [
    "8c2f4e91",
    "3a7b9d5f", 
    "1e6c8a4b",
    "9f2d7e3c",
    "5b8e1a6f",
    "7d3c9e2a",
    "4f8b2d7e",
    "6a1e9c5b"
  ];

  // Validation functions
  const validatePasswordLength = (length: number): ValidationError | null => {
    if (isNaN(length) || length < 8 || length > 32) {
      return { field: 'minLength', message: 'Password length must be between 8 and 32 characters' };
    }
    return null;
  };

  const validateRetentionPeriod = (months: number): ValidationError | null => {
    if (isNaN(months) || months < 12 || months > 84) {
      return { field: 'retentionPeriod', message: 'Retention period must be between 12 and 84 months' };
    }
    return null;
  };

  const validateMaxSessions = (sessions: number): ValidationError | null => {
    if (isNaN(sessions) || sessions < 1 || sessions > 10) {
      return { field: 'maxSessions', message: 'Maximum sessions must be between 1 and 10' };
    }
    return null;
  };

  const validateSessionTimeout = (hours: number): ValidationError | null => {
    if (isNaN(hours) || hours < 1 || hours > 168) {
      return { field: 'sessionTimeout', message: 'Session timeout must be between 1 and 168 hours (7 days)' };
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

  const handlePasswordLengthChange = (length: number) => {
    setSecuritySettings(prev => ({
      ...prev,
      passwordRequirements: {
        ...prev.passwordRequirements,
        minLength: length
      }
    }));

    const error = validatePasswordLength(length);
    if (error) {
      setValidationErrors(prev => ({ ...prev, minLength: error }));
    } else {
      clearValidationError('minLength');
    }
  };

  const handleRetentionPeriodChange = (months: number) => {
    setSecuritySettings(prev => ({
      ...prev,
      dataRetention: {
        ...prev.dataRetention,
        retentionPeriod: months
      }
    }));

    const error = validateRetentionPeriod(months);
    if (error) {
      setValidationErrors(prev => ({ ...prev, retentionPeriod: error }));
    } else {
      clearValidationError('retentionPeriod');
    }
  };

  const handleMaxSessionsChange = (sessions: number) => {
    setSecuritySettings(prev => ({
      ...prev,
      sessionSettings: {
        ...prev.sessionSettings,
        maxSessions: sessions
      }
    }));

    const error = validateMaxSessions(sessions);
    if (error) {
      setValidationErrors(prev => ({ ...prev, maxSessions: error }));
    } else {
      clearValidationError('maxSessions');
    }
  };

  const handleSessionTimeoutChange = (hours: number) => {
    setSecuritySettings(prev => ({
      ...prev,
      sessionSettings: {
        ...prev.sessionSettings,
        sessionTimeout: hours
      }
    }));

    const error = validateSessionTimeout(hours);
    if (error) {
      setValidationErrors(prev => ({ ...prev, sessionTimeout: error }));
    } else {
      clearValidationError('sessionTimeout');
    }
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, ValidationError> = {};
    
    // Validate password requirements
    const lengthError = validatePasswordLength(securitySettings.passwordRequirements.minLength);
    if (lengthError) {
      errors.minLength = lengthError;
    }

    // Validate session settings
    const maxSessionsError = validateMaxSessions(securitySettings.sessionSettings.maxSessions);
    if (maxSessionsError) {
      errors.maxSessions = maxSessionsError;
    }

    const sessionTimeoutError = validateSessionTimeout(securitySettings.sessionSettings.sessionTimeout);
    if (sessionTimeoutError) {
      errors.sessionTimeout = sessionTimeoutError;
    }

    // Validate data retention if enabled
    if (securitySettings.dataRetention.autoDelete) {
      const retentionError = validateRetentionPeriod(securitySettings.dataRetention.retentionPeriod);
      if (retentionError) {
        errors.retentionPeriod = retentionError;
      }
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
        title: "Security settings updated",
        description: "Your security preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBackupCodes = () => {
    toast({
      title: "Backup codes generated",
      description: "New backup codes have been created. Please save them securely.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export initiated",
      description: "Your account data export will be emailed to you within 24 hours.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "A confirmation email has been sent to verify this action.",
      variant: "destructive"
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Backup code copied to clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Security</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account security, authentication, and data settings
        </p>
      </div>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Require authentication app verification for login
              </p>
            </div>
            <div className="flex items-center gap-3">
              {twoFactorEnabled && (
                <Badge className="bg-success text-success-foreground gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Enabled
                </Badge>
              )}
              <Switch 
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
          </div>

          {twoFactorEnabled && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Backup Codes</Label>
                    <p className="text-sm text-muted-foreground">
                      Use these codes if you lose access to your authenticator app
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="gap-2"
                    >
                      {showBackupCodes ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {showBackupCodes ? "Hide" : "Show"} Codes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateBackupCodes}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                {showBackupCodes && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {backupCodes.map((code, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-background rounded border font-mono text-sm"
                        >
                          <span>{code}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyCode(code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Save these backup codes in a secure location. Each code can only be used once.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Authenticator App</span>
                  <Badge className="bg-success text-success-foreground">Connected</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Google Authenticator configured on iPhone
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Password Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Requirements
          </CardTitle>
          <CardDescription>
            Configure password policies for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minLength">Minimum Length *</Label>
              <Input 
                id="minLength"
                type="number"
                min="8"
                max="32"
                value={securitySettings.passwordRequirements.minLength}
                onChange={(e) => handlePasswordLengthChange(parseInt(e.target.value) || 8)}
                className={`w-24 ${validationErrors.minLength ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {validationErrors.minLength && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.minLength.message}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum number of characters required for passwords
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSessions">Maximum Sessions *</Label>
              <Input 
                id="maxSessions"
                type="number"
                min="1"
                max="10"
                value={securitySettings.sessionSettings.maxSessions}
                onChange={(e) => handleMaxSessionsChange(parseInt(e.target.value) || 1)}
                className={`w-24 ${validationErrors.maxSessions ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {validationErrors.maxSessions && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.maxSessions.message}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum number of concurrent sessions allowed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours) *</Label>
              <Input 
                id="sessionTimeout"
                type="number"
                min="1"
                max="168"
                value={securitySettings.sessionSettings.sessionTimeout}
                onChange={(e) => handleSessionTimeoutChange(parseInt(e.target.value) || 1)}
                className={`w-24 ${validationErrors.sessionTimeout ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {validationErrors.sessionTimeout && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validationErrors.sessionTimeout.message}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Automatically log out inactive users after this period
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Require uppercase letters</Label>
              <Switch 
                checked={securitySettings.passwordRequirements.requireUppercase}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({
                  ...prev,
                  passwordRequirements: {
                    ...prev.passwordRequirements,
                    requireUppercase: checked
                  }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Require numbers</Label>
              <Switch 
                checked={securitySettings.passwordRequirements.requireNumbers}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({
                  ...prev,
                  passwordRequirements: {
                    ...prev.passwordRequirements,
                    requireNumbers: checked
                  }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Require symbols</Label>
              <Switch 
                checked={securitySettings.passwordRequirements.requireSymbols}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({
                  ...prev,
                  passwordRequirements: {
                    ...prev.passwordRequirements,
                    requireSymbols: checked
                  }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Must be unique from last 5 passwords</Label>
              <Switch 
                checked={securitySettings.passwordRequirements.requireUnique}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({
                  ...prev,
                  passwordRequirements: {
                    ...prev.passwordRequirements,
                    requireUnique: checked
                  }
                }))}
              />
            </div>
          </div>

          <Separator />

          <Button variant="outline" className="gap-2">
            <Key className="h-4 w-4" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export your data or manage account deletion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Data Export</Label>
                <p className="text-sm text-muted-foreground">
                  Download all your account data, including clients, content, and analytics
                </p>
              </div>
              <Button variant="outline" onClick={handleExportData} className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Data Retention</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically delete old data after specified period
                </p>
              </div>
              <Switch 
                checked={securitySettings.dataRetention.autoDelete}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({
                  ...prev,
                  dataRetention: {
                    ...prev.dataRetention,
                    autoDelete: checked
                  }
                }))}
              />
            </div>

            {securitySettings.dataRetention.autoDelete && (
              <div className="ml-4 space-y-2">
                <Label htmlFor="retentionPeriod">Delete data after (months) *</Label>
                <Input 
                  id="retentionPeriod"
                  type="number"
                  min="12"
                  max="84"
                  value={securitySettings.dataRetention.retentionPeriod}
                  onChange={(e) => handleRetentionPeriodChange(parseInt(e.target.value) || 12)}
                  className={`w-24 ${validationErrors.retentionPeriod ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {validationErrors.retentionPeriod && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{validationErrors.retentionPeriod.message}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Data will be permanently deleted after this period
                </p>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium text-destructive">Delete Account</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Account deletion is permanent and cannot be undone. All your clients, content, and data will be permanently removed.
              </AlertDescription>
            </Alert>
            
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
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
              {isLoading ? "Saving..." : "Save Security Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}