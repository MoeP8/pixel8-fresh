import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Figma, 
  FolderOpen,
  MessageSquare, 
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Zap,
  Download,
  Upload,
  Search,
  Eye,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import our services
import { figmaService, FigmaFile, FigmaProject } from "@/services/integrations/FigmaService";
import { dropboxService, DropboxEntry } from "@/services/integrations/DropboxService";
import { slackService, SlackChannel } from "@/services/integrations/SlackService";
import { notionService, NotionContentCalendarEntry } from "@/services/integrations/NotionService";

interface ServiceStatus {
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
  error?: string;
  stats?: { [key: string]: number | string };
}

export function IntegrationHub() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Figma', icon: <Figma className="h-5 w-5" />, connected: false },
    { name: 'Dropbox', icon: <FolderOpen className="h-5 w-5" />, connected: false },
    { name: 'Slack', icon: <MessageSquare className="h-5 w-5" />, connected: false },
    { name: 'Notion', icon: <FileText className="h-5 w-5" />, connected: false }
  ]);

  const [figmaFiles, setFigmaFiles] = useState<FigmaFile[]>([]);
  const [dropboxFiles, setDropboxFiles] = useState<DropboxEntry[]>([]);
  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([]);
  const [notionContent, setNotionContent] = useState<NotionContentCalendarEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAllConnections();
  }, []);

  const checkAllConnections = async () => {
    setIsLoading(true);
    
    const connectionTests = [
      { name: 'Figma', test: () => figmaService.testConnection() },
      { name: 'Dropbox', test: () => dropboxService.testConnection() },
      { name: 'Slack', test: () => slackService.testConnection() },
      { name: 'Notion', test: () => notionService.testConnection() }
    ];

    const results = await Promise.allSettled(
      connectionTests.map(async ({ name, test }) => ({
        name,
        connected: await test()
      }))
    );

    setServices(prev => prev.map(service => {
      const result = results.find(r => 
        r.status === 'fulfilled' && r.value.name === service.name
      );
      
      return {
        ...service,
        connected: result?.status === 'fulfilled' ? result.value.connected : false,
        lastSync: new Date().toISOString(),
        error: result?.status === 'rejected' ? 'Connection failed' : undefined
      };
    }));

    setIsLoading(false);
  };

  const loadFigmaFiles = async () => {
    setIsLoading(true);
    try {
      const files = await figmaService.getRecentFiles(20);
      setFigmaFiles(files);
      
      setServices(prev => prev.map(s => 
        s.name === 'Figma' 
          ? { ...s, stats: { files: files.length, lastSync: new Date().toLocaleTimeString() } }
          : s
      ));
    } catch (error) {
      toast({
        title: "Failed to load Figma files",
        description: "Check your Figma connection and try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const loadDropboxFiles = async () => {
    setIsLoading(true);
    try {
      const files = await dropboxService.getRecentFiles(20);
      setDropboxFiles(files);
      
      setServices(prev => prev.map(s => 
        s.name === 'Dropbox' 
          ? { ...s, stats: { files: files.length, lastSync: new Date().toLocaleTimeString() } }
          : s
      ));
    } catch (error) {
      toast({
        title: "Failed to load Dropbox files",
        description: "Check your Dropbox connection and try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const loadSlackChannels = async () => {
    setIsLoading(true);
    try {
      const channels = await slackService.getChannels();
      setSlackChannels(channels);
      
      setServices(prev => prev.map(s => 
        s.name === 'Slack' 
          ? { ...s, stats: { channels: channels.length, lastSync: new Date().toLocaleTimeString() } }
          : s
      ));
    } catch (error) {
      toast({
        title: "Failed to load Slack channels",
        description: "Check your Slack connection and try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const loadNotionContent = async () => {
    setIsLoading(true);
    try {
      const content = await notionService.getRecentContent(20);
      setNotionContent(content);
      
      setServices(prev => prev.map(s => 
        s.name === 'Notion' 
          ? { ...s, stats: { pages: content.length, lastSync: new Date().toLocaleTimeString() } }
          : s
      ));
    } catch (error) {
      toast({
        title: "Failed to load Notion content",
        description: "Check your Notion connection and try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const testSlackNotification = async () => {
    try {
      const success = await slackService.sendNotification(
        "🧪 Test notification from Pixel8 Social Hub - Integration working!"
      );
      
      if (success) {
        toast({
          title: "Test notification sent!",
          description: "Check your Slack channel for the test message.",
        });
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      toast({
        title: "Test notification failed",
        description: "Check your Slack webhook configuration.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (connected: boolean, error?: string) => {
    if (error) return <XCircle className="h-4 w-4 text-destructive" />;
    if (connected) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertCircle className="h-4 w-4 text-warning" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration Hub</h2>
          <p className="text-muted-foreground">
            Manage connections to your premium tools
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={checkAllConnections} 
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh All
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <Card key={service.name} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {service.icon}
                  <CardTitle className="text-sm">{service.name}</CardTitle>
                </div>
                {getStatusIcon(service.connected, service.error)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge 
                  variant={service.connected ? "default" : "secondary"}
                  className={cn(
                    service.connected 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  )}
                >
                  {service.connected ? 'Connected' : 'Disconnected'}
                </Badge>
                
                {service.stats && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {Object.entries(service.stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {service.error && (
                  <p className="text-xs text-destructive">{service.error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Tabs */}
      <Tabs defaultValue="figma" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="figma" className="flex items-center gap-2">
            <Figma className="h-4 w-4" />
            Figma
          </TabsTrigger>
          <TabsTrigger value="dropbox" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Dropbox
          </TabsTrigger>
          <TabsTrigger value="slack" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Slack
          </TabsTrigger>
          <TabsTrigger value="notion" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="figma" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Figma Files</CardTitle>
                  <CardDescription>Recent design files and components</CardDescription>
                </div>
                <Button onClick={loadFigmaFiles} disabled={isLoading}>
                  <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                  Load Files
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {figmaFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {figmaFiles.map((file) => (
                    <Card key={file.key} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{file.name}</h4>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Version: {file.version}</div>
                            <div>Modified: {new Date(file.last_modified).toLocaleDateString()}</div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Figma className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No Figma files loaded. Click "Load Files" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dropbox" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dropbox Files</CardTitle>
                  <CardDescription>Recent files and media assets</CardDescription>
                </div>
                <Button onClick={loadDropboxFiles} disabled={isLoading}>
                  <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                  Load Files
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dropboxFiles.length > 0 ? (
                <div className="space-y-2">
                  {dropboxFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size && formatFileSize(file.size)} • 
                            {file.server_modified && ` Modified: ${new Date(file.server_modified).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No Dropbox files loaded. Click "Load Files" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slack" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Slack Integration</CardTitle>
                  <CardDescription>Team communication and notifications</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={testSlackNotification} variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Test Notification
                  </Button>
                  <Button onClick={loadSlackChannels} disabled={isLoading}>
                    <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                    Load Channels
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {slackChannels.length > 0 ? (
                <div className="space-y-2">
                  {slackChannels.slice(0, 10).map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">#{channel.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {channel.is_private ? 'Private' : 'Public'} • 
                            {channel.num_members && ` ${channel.num_members} members`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={channel.is_private ? "secondary" : "default"}>
                        {channel.is_private ? 'Private' : 'Public'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No Slack channels loaded. Click "Load Channels" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notion" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notion Content</CardTitle>
                  <CardDescription>Content calendar and planning</CardDescription>
                </div>
                <Button onClick={loadNotionContent} disabled={isLoading}>
                  <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                  Load Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notionContent.length > 0 ? (
                <div className="space-y-2">
                  {notionContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{content.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {content.status} • {content.platforms.join(', ')} • 
                            {content.scheduled_date && ` Scheduled: ${new Date(content.scheduled_date).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        content.status === 'Published' ? 'default' :
                        content.status === 'Approved' ? 'secondary' :
                        'outline'
                      }>
                        {content.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No Notion content loaded. Click "Load Content" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}