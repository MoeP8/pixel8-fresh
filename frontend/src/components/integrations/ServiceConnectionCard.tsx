import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  RefreshCw,
  ExternalLink,
  Zap,
  Shield
} from "lucide-react";

interface ServiceConnection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "error" | "testing";
  enabled: boolean;
  lastSync?: string;
  features: string[];
  connectionDetails?: {
    account?: string;
    workspace?: string;
    permissions?: string[];
  };
  apiEndpoint?: string;
  testConnection: () => Promise<boolean>;
}

interface ServiceConnectionCardProps {
  service: ServiceConnection;
  onConnect: (serviceId: string) => void;
  onDisconnect: (serviceId: string) => void;
  onToggle: (serviceId: string, enabled: boolean) => void;
  onConfigure: (serviceId: string) => void;
}

export function ServiceConnectionCard({
  service,
  onConnect,
  onDisconnect,
  onToggle,
  onConfigure
}: ServiceConnectionCardProps) {
  const [testing, setTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<boolean | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await service.testConnection();
      setLastTestResult(result);
    } catch (error) {
      setLastTestResult(false);
      console.error(`Failed to test ${service.name} connection:`, error);
    } finally {
      setTesting(false);
    }
  };

  const getStatusColor = () => {
    switch (service.status) {
      case "connected":
        return "text-green-400 border-green-400 bg-green-500/20";
      case "disconnected":
        return "text-gray-400 border-gray-400 bg-gray-500/20";
      case "error":
        return "text-red-400 border-red-400 bg-red-500/20";
      case "testing":
        return "text-yellow-400 border-yellow-400 bg-yellow-500/20";
      default:
        return "text-slate-400 border-slate-400 bg-slate-500/20";
    }
  };

  const getStatusIcon = () => {
    if (testing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    
    switch (service.status) {
      case "connected":
        return <CheckCircle className="w-4 h-4" />;
      case "disconnected":
        return <XCircle className="w-4 h-4" />;
      case "error":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatLastSync = (timestamp?: string) => {
    if (!timestamp) return "Never";
    
    const now = new Date();
    const lastSync = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              {service.icon}
            </div>
            <div>
              <CardTitle className="text-white text-lg">{service.name}</CardTitle>
              <CardDescription className="text-slate-300">
                {service.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              <span className="ml-1 capitalize">{testing ? "Testing" : service.status}</span>
            </Badge>
            
            <Switch
              checked={service.enabled}
              onCheckedChange={(enabled) => onToggle(service.id, enabled)}
              disabled={service.status === "disconnected"}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Details */}
        {service.connectionDetails && service.status === "connected" && (
          <div className="p-3 bg-white/5 rounded-lg">
            <h4 className="text-white text-sm font-medium mb-2">Connection Details</h4>
            <div className="space-y-1 text-xs text-slate-300">
              {service.connectionDetails.account && (
                <div>Account: {service.connectionDetails.account}</div>
              )}
              {service.connectionDetails.workspace && (
                <div>Workspace: {service.connectionDetails.workspace}</div>
              )}
              <div>Last Sync: {formatLastSync(service.lastSync)}</div>
            </div>
          </div>
        )}

        {/* Features */}
        <div>
          <h4 className="text-white text-sm font-medium mb-2">Available Features</h4>
          <div className="flex flex-wrap gap-1">
            {service.features.map((feature) => (
              <Badge 
                key={feature} 
                variant="outline" 
                className="text-xs border-slate-600 text-slate-300"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Test Result */}
        {lastTestResult !== null && (
          <div className={`p-3 rounded-lg ${
            lastTestResult 
              ? "bg-green-500/20 border border-green-400/30" 
              : "bg-red-500/20 border border-red-400/30"
          }`}>
            <div className="flex items-center gap-2">
              {lastTestResult ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm ${
                lastTestResult ? "text-green-400" : "text-red-400"
              }`}>
                {lastTestResult ? "Connection test successful" : "Connection test failed"}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/20">
          {service.status === "disconnected" ? (
            <Button
              onClick={() => onConnect(service.id)}
              className="bg-blue-500 hover:bg-blue-600 flex-1"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              Connect
            </Button>
          ) : (
            <Button
              onClick={() => onDisconnect(service.id)}
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 flex-1"
              size="sm"
            >
              Disconnect
            </Button>
          )}
          
          <Button
            onClick={handleTestConnection}
            variant="outline"
            className="bg-white/10 border-white/20 hover:bg-white/20"
            size="sm"
            disabled={testing}
          >
            {testing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              "Test"
            )}
          </Button>
          
          <Button
            onClick={() => onConfigure(service.id)}
            variant="outline"
            className="bg-white/10 border-white/20 hover:bg-white/20"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          {service.apiEndpoint && (
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => window.open(service.apiEndpoint, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Permissions */}
        {service.connectionDetails?.permissions && service.connectionDetails.permissions.length > 0 && (
          <div className="pt-2 border-t border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm">Permissions</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {service.connectionDetails.permissions.map((permission) => (
                <Badge 
                  key={permission}
                  variant="outline" 
                  className="text-xs border-green-400/50 text-green-400"
                >
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}