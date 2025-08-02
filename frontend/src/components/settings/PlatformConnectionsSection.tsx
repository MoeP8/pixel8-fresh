import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  RefreshCw, 
  Settings, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlatformConnection {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "connected" | "expired" | "disconnected";
  accountCount: number;
  lastSync: string;
  apiUsage: number;
  permissions: string[];
}

export function PlatformConnectionsSection() {
  const { toast } = useToast();
  const [platforms] = useState<PlatformConnection[]>([
    {
      id: "facebook",
      name: "Facebook Pages",
      icon: Facebook,
      status: "connected",
      accountCount: 3,
      lastSync: "2 minutes ago",
      apiUsage: 65,
      permissions: ["manage_pages", "publish_pages", "read_insights"]
    },
    {
      id: "instagram",
      name: "Instagram Business",
      icon: Instagram,
      status: "connected", 
      accountCount: 2,
      lastSync: "5 minutes ago",
      apiUsage: 42,
      permissions: ["content_publish", "basic_info"]
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      status: "expired",
      accountCount: 1,
      lastSync: "2 days ago",
      apiUsage: 0,
      permissions: ["tweet.read", "tweet.write"]
    },
    {
      id: "linkedin",
      name: "LinkedIn Company",
      icon: Linkedin,
      status: "disconnected",
      accountCount: 0,
      lastSync: "Never",
      apiUsage: 0,
      permissions: []
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      status: "disconnected",
      accountCount: 0,
      lastSync: "Never",
      apiUsage: 0,
      permissions: []
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-success text-success-foreground gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-warning text-warning-foreground gap-1">
            <AlertTriangle className="h-3 w-3" />
            Expired
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

  const handleConnect = (platformId: string) => {
    toast({
      title: "Connecting platform",
      description: "Redirecting to authorization page...",
    });
  };

  const handleRefresh = (platformId: string) => {
    toast({
      title: "Refreshing connection",
      description: "Updating account data and permissions...",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Platform Connections</h1>
        <p className="text-muted-foreground mt-1">
          Manage your social media platform integrations and account connections
        </p>
      </div>

      {/* Connection Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>
            Overview of your connected social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">3</div>
              <p className="text-sm text-muted-foreground">Connected Platforms</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">6</div>
              <p className="text-sm text-muted-foreground">Total Accounts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">1</div>
              <p className="text-sm text-muted-foreground">Needs Attention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card key={platform.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <CardDescription>
                        {platform.accountCount > 0 
                          ? `${platform.accountCount} account${platform.accountCount > 1 ? 's' : ''} connected`
                          : "No accounts connected"
                        }
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(platform.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Connection Details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span>{platform.lastSync}</span>
                  </div>
                  
                  {platform.status === "connected" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">API Usage:</span>
                          <span>{platform.apiUsage}%</span>
                        </div>
                        <Progress value={platform.apiUsage} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Permissions:</span>
                        <div className="flex flex-wrap gap-1">
                          {platform.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {platform.status === "connected" ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRefresh(platform.id)}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Manage
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleConnect(platform.id)}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {platform.status === "expired" ? "Reconnect" : "Connect"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Health Check</CardTitle>
          <CardDescription>
            Monitoring connection status and API limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">All systems operational</p>
                  <p className="text-sm text-muted-foreground">No issues detected with connected platforms</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Run Health Check
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium">Last Health Check</p>
                <p className="text-muted-foreground">Today at 9:15 AM</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Next Scheduled Check</p>
                <p className="text-muted-foreground">Tomorrow at 9:00 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}