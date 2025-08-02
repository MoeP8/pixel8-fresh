import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings, Database, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { secureNotionService } from "@/services/SecureNotionService";

export const NotionMCPStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const fetchedTeams = await secureNotionService.getTeams();
      setTeams(fetchedTeams);
      setIsConnected(fetchedTeams.length > 0);
    } catch (error) {
      console.error('Failed to check Notion connection:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      const fetchedTeams = await secureNotionService.getTeams();
      
      if (fetchedTeams.length > 0) {
        setTeams(fetchedTeams);
        setIsConnected(true);
        toast({
          title: "Connection successful!",
          description: `Connected to ${fetchedTeams.length} Notion workspace${fetchedTeams.length > 1 ? 's' : ''}`
        });
      } else {
        setIsConnected(false);
        toast({
          title: "Connection failed",
          description: "Unable to connect to Notion workspaces. Please check your token.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setIsConnected(false);
      toast({
        title: "Connection error",
        description: error.message || "Failed to test Notion connection",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Notion MCP Integration
          {isConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Model Context Protocol integration for accessing Notion workspaces
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
              {teams.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {teams.length} workspace{teams.length > 1 ? 's' : ''} available
                </span>
              )}
            </div>
            {teams.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Workspaces: {teams.map(team => team.name).join(', ')}
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={testConnection}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
        </div>

        {isConnected && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            ✅ Notion MCP is configured and ready to use. You can now import content from your Notion workspaces.
          </div>
        )}

        {!isConnected && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            ⚠️ Notion MCP token is configured but not connecting. Please verify your token has the correct permissions.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
