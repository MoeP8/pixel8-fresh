import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  TestTube, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { secureNotionService } from "@/services/SecureNotionService";
import { NotionMCPStatus } from "@/components/notion/NotionMCPStatus";import { notionService } from "@/services/NotionService";

export function NotionIntegrationSection() {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const connectionStatus = notionService.getConnectionStatus();

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await notionService.testConnection();
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Connection successful",
          description: "Successfully connected to your Notion workspace",
        });
      } else {
        toast({
          title: "Connection failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTestResult({ success: false, message: errorMessage });
      toast({
        title: "Connection failed", 
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    
    try {
      notionService.clearCache();
      toast({
        title: "Sync completed",
        description: "Data refreshed from Notion workspace",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to refresh data from Notion",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const maskToken = (token: string) => {
    if (!token) return 'Not configured';
    return `${token.substring(0, 8)}${'•'.repeat(Math.max(0, token.length - 12))}${token.substring(token.length - 4)}`;
  };

  const formatLastSync = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Notion Integration</h1>
        <p className="text-muted-foreground mt-1">
          Connect your Notion workspace to sync team and client data
        </p>
      </div>


      {/* MCP Status */}
      <NotionMCPStatus />
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Current status of your Notion workspace integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {connectionStatus.isConfigured ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <div>
                <p className="font-medium">
                  {connectionStatus.isConfigured ? 'Connected' : 'Not Connected'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {connectionStatus.isConfigured 
                    ? 'Integration is configured and ready' 
                    : 'Setup required to sync with Notion'
                  }
                </p>
              </div>
            </div>
            <Badge variant={connectionStatus.isConfigured ? "default" : "secondary"}>
              {connectionStatus.isConfigured ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Last Sync</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatLastSync(connectionStatus.lastSync)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Cached Items</p>
              <p className="font-medium">{connectionStatus.cacheSize} datasets</p>
            </div>
            <div>
              <p className="text-muted-foreground">Auto-refresh</p>
              <p className="font-medium">Every 30 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure your Notion API credentials and database IDs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiToken">Notion API Token</Label>
            <div className="flex gap-2">
              <Input
                id="apiToken"
                type={showTokens ? "text" : "password"}
                value={showTokens ? import.meta.env.VITE_NOTION_API_TOKEN || '' : maskToken(import.meta.env.VITE_NOTION_API_TOKEN || '')}
                readOnly
                placeholder="secret_xxx..."
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTokens(!showTokens)}
              >
                {showTokens ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Create an integration at{" "}
              <a 
                href="https://www.notion.so/my-integrations" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                notion.so/my-integrations
              </a>
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamDb">Team Database ID</Label>
              <Input
                id="teamDb"
                value={showTokens ? import.meta.env.VITE_NOTION_TEAM_DB_ID || '' : maskToken(import.meta.env.VITE_NOTION_TEAM_DB_ID || '')}
                readOnly
                placeholder="Database ID..."
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientsDb">Clients Database ID</Label>
              <Input
                id="clientsDb"
                value={showTokens ? import.meta.env.VITE_NOTION_CLIENTS_DB_ID || '' : maskToken(import.meta.env.VITE_NOTION_CLIENTS_DB_ID || '')}
                readOnly
                placeholder="Database ID..."
                className="font-mono text-sm"
              />
            </div>
          </div>

          {!connectionStatus.isConfigured && (
            <div className="p-4 border border-warning/20 bg-warning/5 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-warning">Environment Variables Required</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure these environment variables in your project settings:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_NOTION_API_TOKEN</code></li>
                    <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_NOTION_TEAM_DB_ID</code></li>
                    <li>• <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_NOTION_CLIENTS_DB_ID</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Test your connection and manually sync data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={handleTestConnection}
              disabled={testing}
              variant="outline"
              className="gap-2"
            >
              <TestTube className={`h-4 w-4 ${testing ? 'animate-pulse' : ''}`} />
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <Button 
              onClick={handleSyncNow}
              disabled={syncing || !connectionStatus.isConfigured}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>

          {testResult && (
            <div className={`mt-4 p-3 rounded-lg border ${
              testResult.success 
                ? 'border-success/20 bg-success/5 text-success' 
                : 'border-destructive/20 bg-destructive/5 text-destructive'
            }`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <p className="text-sm font-medium">
                  {testResult.success ? 'Connection successful' : 'Connection failed'}
                </p>
              </div>
              <p className="text-sm mt-1 opacity-90">
                {testResult.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Database Structure</CardTitle>
          <CardDescription>
            Your Notion databases should have these properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Team Database</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Name</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Title</code>
                </li>
                <li className="flex justify-between">
                  <span>Role</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Select</code>
                </li>
                <li className="flex justify-between">
                  <span>Email</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Email</code>
                </li>
                <li className="flex justify-between">
                  <span>Status</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Select</code>
                </li>
                <li className="flex justify-between">
                  <span>Profile Photo</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Files</code>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Clients Database</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Client Name</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Title</code>
                </li>
                <li className="flex justify-between">
                  <span>Industry</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Select</code>
                </li>
                <li className="flex justify-between">
                  <span>Status</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Select</code>
                </li>
                <li className="flex justify-between">
                  <span>Contact Email</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Email</code>
                </li>
                <li className="flex justify-between">
                  <span>Brand Colors</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Rich Text</code>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}