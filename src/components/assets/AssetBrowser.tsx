import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Upload,
  Download,
  Eye,
  Heart,
  Copy,
  Share,
  MoreHorizontal,
  Image,
  Video,
  FileText,
  Figma,
  Folder,
  Tag,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";
import { FigmaIntegration } from "./FigmaIntegration";
import { DropboxBrowser } from "./DropboxBrowser";

interface Asset {
  id: string;
  name: string;
  type: "image" | "video" | "design" | "document";
  source: "figma" | "dropbox" | "local";
  url: string;
  thumbnail?: string;
  size: number;
  dimensions?: { width: number; height: number };
  created_at: string;
  tags: string[];
  description?: string;
  usage_count: number;
  last_used?: string;
  client?: {
    name: string;
    logo_url?: string;
  };
}

interface AssetBrowserProps {
  onAssetSelect?: (asset: Asset) => void;
  onAssetImport?: (asset: Asset) => void;
  multiSelect?: boolean;
  selectedAssets?: Asset[];
}

export function AssetBrowser({ 
  onAssetSelect, 
  onAssetImport, 
  multiSelect = false,
  selectedAssets = []
}: AssetBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<"all" | "figma" | "dropbox" | "local">("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "usage" | "size">("date");

  // Mock data - will be replaced with real API data
  const mockAssets: Asset[] = [
    {
      id: "1",
      name: "Brand Logo Variations",
      type: "image",
      source: "figma",
      url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=150",
      size: 245000,
      dimensions: { width: 1200, height: 800 },
      created_at: "2024-01-15T10:30:00Z",
      tags: ["logo", "brand", "identity"],
      description: "Main brand logo with color variations",
      usage_count: 15,
      last_used: "2024-01-28T14:20:00Z"
    },
    {
      id: "2", 
      name: "Social Media Templates",
      type: "design",
      source: "figma",
      url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=150",
      size: 189000,
      created_at: "2024-01-20T09:15:00Z",
      tags: ["template", "social", "instagram"],
      description: "Instagram post templates",
      usage_count: 8,
      client: { name: "Tech Startup Co" }
    },
    {
      id: "3",
      name: "Product Photography",
      type: "image", 
      source: "dropbox",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150",
      size: 890000,
      dimensions: { width: 2000, height: 1500 },
      created_at: "2024-01-18T16:45:00Z",
      tags: ["product", "photography", "headphones"],
      usage_count: 12,
      last_used: "2024-01-25T11:30:00Z"
    },
    {
      id: "4",
      name: "Brand Video Intro",
      type: "video",
      source: "dropbox", 
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=150",
      size: 15600000,
      created_at: "2024-01-22T13:20:00Z",
      tags: ["video", "intro", "brand"],
      usage_count: 3,
      client: { name: "Fashion Brand" }
    }
  ];

  const availableFilters = [
    { id: "image", label: "Images", icon: Image },
    { id: "video", label: "Videos", icon: Video },
    { id: "design", label: "Designs", icon: Figma },
    { id: "document", label: "Documents", icon: FileText },
    { id: "recent", label: "Recent", icon: Calendar },
    { id: "popular", label: "Popular", icon: Heart }
  ];

  const availableTags = Array.from(new Set(mockAssets.flatMap(asset => asset.tags)));

  const filteredAssets = useMemo(() => {
    let filtered = mockAssets;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by source
    if (selectedSource !== "all") {
      filtered = filtered.filter(asset => asset.source === selectedSource);
    }

    // Filter by type/category
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(asset => {
        return selectedFilters.some(filter => {
          if (filter === "recent") return new Date(asset.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          if (filter === "popular") return asset.usage_count > 10;
          return asset.type === filter;
        });
      });
    }

    // Sort assets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "usage":
          return b.usage_count - a.usage_count;
        case "size":
          return b.size - a.size;
        case "date":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [mockAssets, searchQuery, selectedSource, selectedFilters, sortBy]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "figma":
        return <Figma className="w-4 h-4 text-orange-400" />;
      case "dropbox":
        return <Folder className="w-4 h-4 text-blue-400" />;
      default:
        return <Upload className="w-4 h-4 text-slate-400" />;
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filteredAssets.map((asset) => (
        <Card 
          key={asset.id}
          className={`group backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer ${
            selectedAssets.some(a => a.id === asset.id) ? "ring-2 ring-blue-400" : ""
          }`}
          onClick={() => onAssetSelect?.(asset)}
        >
          <CardContent className="p-3">
            {/* Asset Preview */}
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-slate-800">
              {asset.thumbnail ? (
                <img 
                  src={asset.thumbnail} 
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {asset.type === "image" && <Image className="w-8 h-8 text-slate-400" />}
                  {asset.type === "video" && <Video className="w-8 h-8 text-slate-400" />}
                  {asset.type === "design" && <Figma className="w-8 h-8 text-slate-400" />}
                  {asset.type === "document" && <FileText className="w-8 h-8 text-slate-400" />}
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssetImport?.(asset);
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Source Badge */}
              <div className="absolute top-2 right-2">
                {getSourceIcon(asset.source)}
              </div>

              {/* Type Badge */}
              <Badge className="absolute bottom-2 left-2 text-xs">
                {asset.type}
              </Badge>
            </div>

            {/* Asset Info */}
            <div className="space-y-1">
              <h4 className="text-white text-sm font-medium truncate">{asset.name}</h4>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{formatFileSize(asset.size)}</span>
                <span>{asset.usage_count} uses</span>
              </div>
              
              {/* Tags */}
              {asset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {asset.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs px-1 py-0 border-slate-600 text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                  {asset.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1 py-0 border-slate-600 text-slate-300">
                      +{asset.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {filteredAssets.map((asset) => (
        <Card 
          key={asset.id}
          className={`backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer ${
            selectedAssets.some(a => a.id === asset.id) ? "ring-2 ring-blue-400" : ""
          }`}
          onClick={() => onAssetSelect?.(asset)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                {asset.thumbnail ? (
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {asset.type === "image" && <Image className="w-6 h-6 text-slate-400" />}
                    {asset.type === "video" && <Video className="w-6 h-6 text-slate-400" />}
                    {asset.type === "design" && <Figma className="w-6 h-6 text-slate-400" />}
                    {asset.type === "document" && <FileText className="w-6 h-6 text-slate-400" />}
                  </div>
                )}
              </div>

              {/* Asset Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-medium truncate">{asset.name}</h4>
                  {getSourceIcon(asset.source)}
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                    {asset.type}
                  </Badge>
                </div>
                
                {asset.description && (
                  <p className="text-slate-300 text-sm mb-2 line-clamp-1">{asset.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{formatFileSize(asset.size)}</span>
                  {asset.dimensions && (
                    <span>{asset.dimensions.width} × {asset.dimensions.height}</span>
                  )}
                  <span>{asset.usage_count} uses</span>
                  {asset.client && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {asset.client.name}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {asset.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0 border-slate-600 text-slate-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssetImport?.(asset);
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Asset Browser</h2>
          <p className="text-slate-300">Browse and manage your design assets from Figma and Dropbox</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          
          <Button 
            variant={selectedView === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("grid")}
            className={selectedView === "grid" ? "" : "bg-white/10 border-white/20 hover:bg-white/20"}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          
          <Button 
            variant={selectedView === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("list")}
            className={selectedView === "list" ? "" : "bg-white/10 border-white/20 hover:bg-white/20"}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search assets by name, tags, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Source Filter */}
            <Tabs value={selectedSource} onValueChange={(value) => setSelectedSource(value as any)}>
              <TabsList className="bg-white/10 border-white/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
                <TabsTrigger value="figma" className="data-[state=active]:bg-white/20">Figma</TabsTrigger>
                <TabsTrigger value="dropbox" className="data-[state=active]:bg-white/20">Dropbox</TabsTrigger>
                <TabsTrigger value="local" className="data-[state=active]:bg-white/20">Local</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="usage">Sort by Usage</option>
              <option value="size">Sort by Size</option>
            </select>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {availableFilters.map(filter => {
              const Icon = filter.icon;
              const isActive = selectedFilters.includes(filter.id);
              
              return (
                <Button
                  key={filter.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={isActive ? "" : "bg-white/10 border-white/20 hover:bg-white/20"}
                  onClick={() => {
                    setSelectedFilters(prev => 
                      isActive 
                        ? prev.filter(f => f !== filter.id)
                        : [...prev, filter.id]
                    );
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Asset Grid/List */}
      <div>
        {filteredAssets.length === 0 ? (
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardContent className="p-12 text-center">
              <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No assets found</h3>
              <p className="text-slate-300 mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Upload className="w-4 h-4 mr-2" />
                Upload Assets
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 text-sm">
                {filteredAssets.length} assets found
              </span>
              {selectedAssets.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-sm">
                    {selectedAssets.length} selected
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    Import Selected
                  </Button>
                </div>
              )}
            </div>

            {selectedView === "grid" ? <GridView /> : <ListView />}
          </>
        )}
      </div>

      {/* Integration Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FigmaIntegration />
        <DropboxBrowser />
      </div>
    </div>
  );
}