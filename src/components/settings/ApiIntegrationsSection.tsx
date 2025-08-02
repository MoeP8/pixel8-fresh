import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  TestTube,
  Key,
  ExternalLink,
  Zap,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiIntegration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "error";
  hasKey: boolean;
  testable: boolean;
  docsUrl?: string;
  keyFormat?: RegExp;
  keyHint?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface TestResult {
  success: boolean;
  message: string;
  details?: string;
}

export function ApiIntegrationsSection() {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    openai: "sk-proj-...",
    google_ads: "",
    meta_marketing: "EAABwz...",
    supabase: "sbp_...",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testingKeys, setTestingKeys] = useState<Record<string, boolean>>({});
  const [savingKeys, setSavingKeys] = useState<Record<string, boolean>>({});

  const integrations: ApiIntegration[] = [
    {
      id: "openai",
      name: "OpenAI API",
      description: "AI-powered content generation and optimization",
      status: "connected",
      hasKey: true,
      testable: true,
      docsUrl: "https://platform.openai.com/docs",
      keyFormat: /^sk-proj-[a-zA-Z0-9]{64}T3BlbkFJ[a-zA-Z0-9]{20}$/,
      keyHint: "Must start with 'sk-proj-' and be 104 characters long"
    },
    {
      id: "google_ads",
      name: "Google Ads API",
      description: "Campaign management and performance tracking",
      status: "disconnected", 
      hasKey: false,
      testable: true,
      docsUrl: "https://developers.google.com/google-ads/api",
      keyFormat: /^[A-Za-z0-9_-]{20,100}$/,
      keyHint: "OAuth 2.0 client credentials (20-100 characters)"
    },
    {
      id: "meta_marketing",
      name: "Meta Marketing API",
      description: "Facebook and Instagram advertising automation",
      status: "connected",
      hasKey: true,
      testable: true,
      docsUrl: "https://developers.facebook.com/docs/marketing-apis",
      keyFormat: /^EAA[A-Za-z0-9]{20,}$/,
      keyHint: "Must start with 'EAA' followed by alphanumeric characters"
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Database and authentication backend",
      status: "connected",
      hasKey: true,
      testable: true,
      docsUrl: "https://supabase.com/docs",
      keyFormat: /^sbp_[a-f0-9]{32}$/,
      keyHint: "Must start with 'sbp_' followed by 32 hex characters"
    }
  ];

  // Validation functions
  const validateApiKey = (integrationId: string, key: string): ValidationError | null => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return null;

    if (!key || key.trim() === "") {
      return {
        field: integrationId,
        message: "API key is required"
      };
    }

    if (key.length < 8) {
      return {
        field: integrationId,
        message: "API key is too short (minimum 8 characters)"
      };
    }

    if (integration.keyFormat && !integration.keyFormat.test(key)) {
      return {
        field: integrationId,
        message: integration.keyHint || "Invalid API key format"
      };
    }

    return null;
  };

  const clearValidationError = (integrationId: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[integrationId];
      return newErrors;
    });
  };

  const clearTestResult = (integrationId: string) => {
    setTestResults(prev => {
      const newResults = { ...prev };
      delete newResults[integrationId];
      return newResults;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-success text-success-foreground gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="secondary" className="gap-1">
            <XCircle className="h-3 w-3" />
            Disconnected
          </Badge>
        );
      default:
        return null;
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleKeyChange = (integrationId: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [integrationId]: value }));
    
    // Clear validation error and test result when user types
    clearValidationError(integrationId);
    clearTestResult(integrationId);
    
    // Validate on change if not empty
    if (value.trim()) {
      const error = validateApiKey(integrationId, value);
      if (error) {
        setValidationErrors(prev => ({ ...prev, [integrationId]: error }));
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const testConnection = async (id: string) => {
    const key = apiKeys[id];
    const error = validateApiKey(id, key);
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [id]: error }));
      return;
    }

    setTestingKeys(prev => ({ ...prev, [id]: true }));
    clearValidationError(id);
    
    try {
      // Simulate API test with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation logic for demo
      const isValid = Math.random() > 0.3; // 70% success rate for demo
      
      const result: TestResult = {
        success: isValid,
        message: isValid 
          ? "Connection successful! API key is valid and has proper permissions."
          : "Connection failed. Please check your API key and permissions.",
        details: isValid 
          ? "All required scopes are available" 
          : "Invalid credentials or insufficient permissions"
      };
      
      setTestResults(prev => ({ ...prev, [id]: result }));
      
      toast({
        title: result.success ? "Connection successful" : "Connection failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: "Network error occurred during testing",
        details: "Please check your internet connection and try again"
      };
      
      setTestResults(prev => ({ ...prev, [id]: result }));
      
      toast({
        title: "Test failed",
        description: result.message,
        variant: "destructive",
      });
    } finally {
      setTestingKeys(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSaveKey = async (id: string, value: string) => {
    const error = validateApiKey(id, value);
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [id]: error }));
      toast({
        title: "Validation error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSavingKeys(prev => ({ ...prev, [id]: true }));
    clearValidationError(id);
    
    try {
      // Simulate save with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApiKeys(prev => ({ ...prev, [id]: value }));
      
      toast({
        title: "API key saved",
        description: "Your API key has been securely stored.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingKeys(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">API Integrations</h1>
        <p className="text-muted-foreground mt-1">
          Manage your marketing APIs and external service connections
        </p>
      </div>

      {/* Integration Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Overview of your API connections and service health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">3</div>
              <p className="text-sm text-muted-foreground">Connected APIs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">1</div>
              <p className="text-sm text-muted-foreground">Pending Setup</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <p className="text-sm text-muted-foreground">Service Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Management */}
      <div className="space-y-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(integration.status)}
                  {integration.docsUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor={`${integration.id}-key`}>API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id={`${integration.id}-key`}
                      type={showKeys[integration.id] ? "text" : "password"}
                      value={apiKeys[integration.id] || ""}
                      onChange={(e) => handleKeyChange(integration.id, e.target.value)}
                      placeholder={`Enter your ${integration.name} API key`}
                      className={`pr-10 ${validationErrors[integration.id] ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleKeyVisibility(integration.id)}
                    >
                      {showKeys[integration.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {apiKeys[integration.id] && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiKeys[integration.id])}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* Validation Error */}
                {validationErrors[integration.id] && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{validationErrors[integration.id].message}</span>
                  </div>
                )}
                
                {/* Format Hint */}
                {!validationErrors[integration.id] && integration.keyHint && (
                  <p className="text-xs text-muted-foreground">
                    {integration.keyHint}
                  </p>
                )}
                
                {/* Test Result */}
                {testResults[integration.id] && (
                  <div className={`p-3 rounded-lg border ${
                    testResults[integration.id].success 
                      ? 'border-success/20 bg-success/5' 
                      : 'border-destructive/20 bg-destructive/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      {testResults[integration.id].success ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <p className={`text-sm font-medium ${
                        testResults[integration.id].success ? 'text-success' : 'text-destructive'
                      }`}>
                        {testResults[integration.id].message}
                      </p>
                    </div>
                    {testResults[integration.id].details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {testResults[integration.id].details}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSaveKey(integration.id, apiKeys[integration.id] || "")}
                  disabled={!apiKeys[integration.id] || !!validationErrors[integration.id] || savingKeys[integration.id]}
                  size="sm"
                  className="gap-2"
                >
                  {savingKeys[integration.id] && <Loader2 className="h-4 w-4 animate-spin" />}
                  {savingKeys[integration.id] ? 'Saving...' : 'Save Key'}
                </Button>
                {integration.testable && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => testConnection(integration.id)}
                    disabled={!apiKeys[integration.id] || !!validationErrors[integration.id] || testingKeys[integration.id]}
                    className="gap-2"
                  >
                    {testingKeys[integration.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    {testingKeys[integration.id] ? 'Testing...' : 'Test Connection'}
                  </Button>
                )}
              </div>

              {/* Integration-specific notes */}
              {integration.id === "openai" && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    Used for AI content generation, hashtag suggestions, and caption optimization.
                    Get your API key from the OpenAI platform dashboard.
                  </p>
                </div>
              )}
              {integration.id === "google_ads" && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    Required for Google Ads campaign management and performance tracking.
                    Set up OAuth 2.0 credentials in Google Cloud Console.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Webhook Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Webhook Endpoints
          </CardTitle>
          <CardDescription>
            Configure webhooks for automation and real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-sm">Post Status Updates</p>
                <p className="text-xs text-muted-foreground">
                  Receives notifications when posts are published or fail
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Active</Badge>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-sm">Campaign Performance</p>
                <p className="text-xs text-muted-foreground">
                  Real-time campaign metrics and alerts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Inactive</Badge>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="gap-2">
            <Zap className="h-4 w-4" />
            Add Webhook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}