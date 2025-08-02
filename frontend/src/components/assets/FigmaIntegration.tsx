import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Figma,
  RefreshCw,
  Download,
  ExternalLink,
  Eye,
  Copy,
  Share,
  Clock,
  Users,
  Layers,
  Palette,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

interface FigmaFile {
  id: string;
  name: string;
  thumbnail_url?: string;
  last_modified: string;
  version: string;
  description?: string;
  collaborators: number;
  components_count: number;
  frames_count: number;
  status: "synced" | "outdated" | "error";
}

interface FigmaTeam {
  id: string;
  name: string;
  projects: FigmaProject[];
}

interface FigmaProject {
  id: string;
  name: string;
  files: FigmaFile[];
}

export function FigmaIntegration() {
  const [isConnected, setIsConnected] = useState(true); // Mock connected state
  const [isLoading, setIsLoading] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<string>("team1");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real Figma API calls
  const mockTeams: FigmaTeam[] = [
    {
      id: "team1",
      name: "Design Team",
      projects: [
        {
          id: "proj1",
          name: "Brand Assets",
          files: [
            {
              id: "file1",
              name: "Logo Variations",
              thumbnail_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200",
              last_modified: "2024-01-28T10:30:00Z",
              version: "1.2.3",
              description: "Main brand logo with color variations and usage guidelines",
              collaborators: 3,
              components_count: 12,
              frames_count: 8,
              status: "synced"
            },
            {
              id: "file2", 
              name: "Social Media Templates",
              thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200",
              last_modified: "2024-01-25T14:20:00Z",
              version: "2.1.0",
              description: "Instagram and Facebook post templates",
              collaborators: 5,
              components_count: 24,
              frames_count: 15,
              status: "outdated"
            }
          ]
        },
        {
          id: "proj2",
          name: "Campaign Materials",
          files: [
            {
              id: "file3",
              name: "Summer Campaign 2024",
              thumbnail_url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=300&h=200",
              last_modified: "2024-01-20T09:15:00Z",
              version: "1.0.5",
              collaborators: 4,
              components_count: 18,
              frames_count: 12,
              status: "synced"
            }
          ]
        }
      ]
    }
  ];

  const currentTeam = mockTeams.find(team => team.id === selectedTeam);
  const currentProject = currentTeam?.projects.find(proj => proj.id === selectedProject);
  const allFiles = selectedProject 
    ? currentProject?.files || []
    : currentTeam?.projects.flatMap(proj => proj.files) || [];

  const filteredFiles = allFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = async () => {
    setIsLoading(true);
    // Mock connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleSync = async () => {
    setIsLoading(true);
    setSyncProgress(0);
    
    // Mock sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExportAsset = async (fileId: string) => {
    console.log("Exporting asset:", fileId);
    // Implementation for exporting Figma assets
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "synced":
        return "text-green-400 border-green-400 bg-green-500/20";
      case "outdated":
        return "text-yellow-400 border-yellow-400 bg-yellow-500/20";
      case "error":
        return "text-red-400 border-red-400 bg-red-500/20";
      default:
        return "text-slate-400 border-slate-400 bg-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <CheckCircle className="w-3 h-3" />;
      case "outdated":
        return <Clock className="w-3 h-3" />;
      case "error":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Figma className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Figma Integration</CardTitle>
              <CardDescription className="text-slate-300">
                Connect your Figma account to access live designs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Figma className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">Connect to Figma</h3>
            <p className="text-slate-300 mb-6 max-w-sm mx-auto">
              Access your design files, components, and assets directly from Figma
            </p>
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Figma className="w-4 h-4 mr-2" />
                  Connect Figma
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Figma className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Figma Integration</CardTitle>
              <CardDescription className="text-slate-300">
                Live access to your design files and assets
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="text-green-400 border-green-400 bg-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSync}
              disabled={isLoading}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
              <span>Syncing files...</span>
              <span>{syncProgress}%</span>
            </div>
            <Progress value={syncProgress} className="h-2 bg-white/10" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Team and Project Selection */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm text-slate-300 mb-2 block">Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setSelectedProject("");
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
            >
              {mockTeams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm text-slate-300 mb-2 block">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
            >
              <option value="">All Projects</option>
              {currentTeam?.projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search Figma files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
          />
        </div>

        {/* Files List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <Figma className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm">No files found</p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <Card key={file.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                      {file.thumbnail_url ? (
                        <img 
                          src={file.thumbnail_url} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Figma className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium truncate">{file.name}</h4>
                        <Badge className={`text-xs ${getStatusColor(file.status)}`}>
                          {getStatusIcon(file.status)}
                          <span className="ml-1">{file.status}</span>
                        </Badge>
                      </div>
                      
                      {file.description && (
                        <p className="text-slate-300 text-sm mb-2 line-clamp-1">{file.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(file.last_modified).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {file.collaborators}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {file.components_count} components
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        title="View in Figma"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        onClick={() => handleExportAsset(file.id)}
                        title="Export Assets"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{allFiles.length}</div>
            <div className="text-xs text-slate-400">Files</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {allFiles.reduce((sum, file) => sum + file.components_count, 0)}
            </div>
            <div className="text-xs text-slate-400">Components</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {allFiles.filter(file => file.status === "synced").length}
            </div>
            <div className="text-xs text-slate-400">Synced</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}