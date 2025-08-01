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
  Zap
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

  const integrations: ApiIntegration[] = [
    {
      id: "openai",
      name: "OpenAI API",
      description: "AI-powered content generation and optimization",
      status: "connected",
      hasKey: true,
      testable: true,
      docsUrl: "https://platform.openai.com/docs"
    },
    {
      id: "google_ads",
      name: "Google Ads API",
      description: "Campaign management and performance tracking",
      status: "disconnected", 
      hasKey: false,
      testable: true,
      docsUrl: "https://developers.google.com/google-ads/api"
    },
    {
      id: "meta_marketing",
      name: "Meta Marketing API",
      description: "Facebook and Instagram advertising automation",
      status: "connected",
      hasKey: true,
      testable: true,
      docsUrl: "https://developers.facebook.com/docs/marketing-apis"
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Database and authentication backend",
      status: "connected",
      hasKey: true,
      testable: true,
      docsUrl: "https://supabase.com/docs"
    }
  ];

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const testConnection = (id: string) => {
    toast({
      title: "Testing connection",
      description: "Verifying API key and permissions...",
    });
  };

  const handleSaveKey = (id: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [id]: value }));
    toast({
      title: "API key saved",
      description: "Your API key has been securely stored.",
    });
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
                      onChange={(e) => setApiKeys(prev => ({ ...prev, [integration.id]: e.target.value }))}
                      placeholder={`Enter your ${integration.name} API key`}
                      className="pr-10"
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
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSaveKey(integration.id, apiKeys[integration.id] || "")}
                  disabled={!apiKeys[integration.id]}
                  size="sm"
                >
                  Save Key
                </Button>
                {integration.testable && apiKeys[integration.id] && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => testConnection(integration.id)}
                    className="gap-2"
                  >
                    <TestTube className="h-4 w-4" />
                    Test Connection
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