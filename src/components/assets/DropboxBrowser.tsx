import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Folder,
  File,
  Image,
  Video,
  FileText,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
  Home,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Eye,
  Share,
  Copy,
  Trash2,
  Star,
  Clock,
  HardDrive,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";

interface DropboxItem {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  size?: number;
  modified: string;
  thumbnail?: string;
  mime_type?: string;
  is_shared: boolean;
  is_starred: boolean;
  download_url?: string;
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function DropboxBrowser() {
  const [isConnected, setIsConnected] = useState(true); // Mock connected state
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size" | "type">("name");

  // Mock data - will be replaced with real Dropbox API calls
  const mockItems: DropboxItem[] = [
    {
      id: "folder1",
      name: "Brand Assets",
      type: "folder",
      path: "/Brand Assets",
      modified: "2024-01-28T10:30:00Z",
      is_shared: true,
      is_starred: false
    },
    {
      id: "folder2",
      name: "Campaign Materials",
      type: "folder", 
      path: "/Campaign Materials",
      modified: "2024-01-25T14:20:00Z",
      is_shared: false,
      is_starred: true
    },
    {
      id: "file1",
      name: "Product_Hero_Image.jpg",
      type: "file",
      path: "/Product_Hero_Image.jpg",
      size: 2456789,
      modified: "2024-01-28T09:15:00Z",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150",
      mime_type: "image/jpeg",
      is_shared: false,
      is_starred: false,
      download_url: "https://example.com/download/1"
    },
    {
      id: "file2",
      name: "Brand_Video_Intro.mp4",
      type: "file",
      path: "/Brand_Video_Intro.mp4", 
      size: 15678901,
      modified: "2024-01-27T16:45:00Z",
      thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=150",
      mime_type: "video/mp4",
      is_shared: true,
      is_starred: true,
      download_url: "https://example.com/download/2"
    },
    {
      id: "file3",
      name: "Brand_Guidelines.pdf",
      type: "file",
      path: "/Brand_Guidelines.pdf",
      size: 3456789,
      modified: "2024-01-26T11:20:00Z",
      mime_type: "application/pdf",
      is_shared: true,
      is_starred: false,
      download_url: "https://example.com/download/3"
    }
  ];

  const breadcrumbs: BreadcrumbItem[] = currentPath === "/" 
    ? [{ name: "Home", path: "/" }]
    : [
        { name: "Home", path: "/" },
        ...currentPath.split("/").filter(Boolean).map((segment, index, array) => ({
          name: segment,
          path: "/" + array.slice(0, index + 1).join("/")
        }))
      ];

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPath = item.path.startsWith(currentPath) && 
      item.path !== currentPath &&
      !item.path.slice(currentPath.length).includes("/");
    return matchesSearch && (currentPath === "/" ? true : matchesPath);
  }).sort((a, b) => {
    switch (sortBy) {
      case "modified":
        return new Date(b.modified).getTime() - new Date(a.modified).getTime();
      case "size":
        return (b.size || 0) - (a.size || 0);
      case "type":
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "folder" ? -1 : 1;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (item: DropboxItem) => {
    if (item.type === "folder") return <Folder className="w-5 h-5 text-blue-400" />;
    
    if (item.mime_type?.startsWith("image/")) return <Image className="w-5 h-5 text-green-400" />;
    if (item.mime_type?.startsWith("video/")) return <Video className="w-5 h-5 text-purple-400" />;
    if (item.mime_type?.includes("pdf")) return <FileText className="w-5 h-5 text-red-400" />;
    
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleItemClick = (item: DropboxItem) => {
    if (item.type === "folder") {
      setCurrentPath(item.path);
    } else {
      // Handle file selection/preview
      console.log("Selected file:", item);
    }
  };

  const handleDownload = (item: DropboxItem) => {
    console.log("Downloading:", item.name);
    // Implementation for downloading files
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (!isConnected) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Dropbox Integration</CardTitle>
              <CardDescription className="text-slate-300">
                Connect your Dropbox to access files and media
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Folder className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">Connect to Dropbox</h3>
            <p className="text-slate-300 mb-6 max-w-sm mx-auto">
              Access your files, images, and videos stored in Dropbox
            </p>
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Folder className="w-4 h-4 mr-2" />
                  Connect Dropbox
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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Dropbox Browser</CardTitle>
              <CardDescription className="text-slate-300">
                Browse and manage your cloud files
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
              onClick={() => setIsLoading(true)}
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs ${
                  index === breadcrumbs.length - 1 
                    ? "text-white" 
                    : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setCurrentPath(crumb.path)}
              >
                {index === 0 ? <Home className="w-3 h-3" /> : crumb.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Search and Controls */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
          >
            <option value="name">Name</option>
            <option value="modified">Modified</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>

          <div className="flex border border-white/20 rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`rounded-r-none ${viewMode === "grid" ? "" : "bg-white/10 hover:bg-white/20"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`rounded-l-none ${viewMode === "list" ? "" : "bg-white/10 hover:bg-white/20"}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selected Items Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
            <span className="text-blue-300 text-sm">
              {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Copy className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        )}

        {/* File Browser */}
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm">
                {searchQuery ? "No items match your search" : "This folder is empty"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id}
                  className={`group bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${
                    selectedItems.includes(item.id) ? "ring-2 ring-blue-400" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square mb-2 rounded-lg overflow-hidden bg-slate-800 relative">
                      {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(item)}
                        </div>
                      )}
                      
                      {/* Selection Checkbox */}
                      <button
                        className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedItems.includes(item.id)
                            ? "bg-blue-500 border-blue-500" 
                            : "border-white/50 bg-black/50 opacity-0 group-hover:opacity-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItemSelection(item.id);
                        }}
                      >
                        {selectedItems.includes(item.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </button>

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {item.is_starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                        {item.is_shared && <Share className="w-4 h-4 text-blue-400" />}
                      </div>

                      {/* Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {item.type === "file" && (
                          <>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{formatFileSize(item.size)}</span>
                        <span>{new Date(item.modified).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id}
                  className={`bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${
                    selectedItems.includes(item.id) ? "ring-2 ring-blue-400" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getFileIcon(item)}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium truncate">{item.name}</h4>
                          <div className="flex gap-1">
                            {item.is_starred && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                            {item.is_shared && <Share className="w-3 h-3 text-blue-400" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                          <span>{formatFileSize(item.size)}</span>
                          <span>{new Date(item.modified).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {item.type === "file" && (
                          <>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-300">Storage Used</span>
            <span className="text-white">8.2 GB of 16 GB</span>
          </div>
          <Progress value={51} className="h-2 bg-white/10" />
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>51% used</span>
            <span>7.8 GB available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}