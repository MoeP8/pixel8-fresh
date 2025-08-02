import { useState } from "react";
import { AssetBrowser } from "@/components/assets/AssetBrowser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload,
  FolderOpen,
  Image,
  Video,
  FileText,
  Figma,
  Folder,
  TrendingUp,
  Clock,
  Users,
  Tag,
  Search
} from "lucide-react";

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

export function AssetsPage() {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState("browser");

  const handleAssetSelect = (asset: Asset) => {
    console.log("Asset selected:", asset);
    // Handle asset selection
  };

  const handleAssetImport = (asset: Asset) => {
    console.log("Asset imported:", asset);
    // Handle asset import to content composer
  };

  // Mock analytics data
  const assetStats = {
    totalAssets: 1247,
    totalStorage: "15.8 GB",
    mostUsedType: "Images",
    recentUploads: 23,
    figmaFiles: 45,
    dropboxFiles: 892,
    localFiles: 310
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Asset Management</h1>
          <p className="text-slate-300">
            Organize and manage your creative assets from Figma, Dropbox, and local storage
          </p>
        </div>
        
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Upload className="w-4 h-4 mr-2" />
          Upload Assets
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Assets</p>
                <p className="text-2xl font-bold text-white">{assetStats.totalAssets.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-white">{assetStats.totalStorage}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
              <span>68% of 23 GB</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Figma Files</p>
                <p className="text-2xl font-bold text-white">{assetStats.figmaFiles}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Figma className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-400">
              <Clock className="w-3 h-3" />
              <span>Last sync: 2 hours ago</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Dropbox Files</p>
                <p className="text-2xl font-bold text-white">{assetStats.dropboxFiles}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
              <span>Connected</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="browser" className="data-[state=active]:bg-white/20">
                <Search className="w-4 h-4 mr-2" />
                Asset Browser
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-white/20">
                <Tag className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-white/20">
                <Clock className="w-4 h-4 mr-2" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="shared" className="data-[state=active]:bg-white/20">
                <Users className="w-4 h-4 mr-2" />
                Shared
              </TabsTrigger>
            </TabsList>
          </CardHeader>
        </Card>

        <TabsContent value="browser">
          <AssetBrowser 
            onAssetSelect={handleAssetSelect}
            onAssetImport={handleAssetImport}
            multiSelect={true}
            selectedAssets={selectedAssets}
          />
        </TabsContent>

        <TabsContent value="categories">
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Asset Categories</CardTitle>
              <CardDescription className="text-slate-300">
                Browse assets organized by type and category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Image className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">Images</h3>
                    <p className="text-slate-400 text-sm">847 files</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Video className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">Videos</h3>
                    <p className="text-slate-400 text-sm">156 files</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Figma className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">Designs</h3>
                    <p className="text-slate-400 text-sm">124 files</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">Documents</h3>
                    <p className="text-slate-400 text-sm">120 files</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recently Added</CardTitle>
              <CardDescription className="text-slate-300">
                Assets uploaded or modified in the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">Recent assets view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared">
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Shared Assets</CardTitle>
              <CardDescription className="text-slate-300">
                Assets shared with team members and collaborators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">Shared assets view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Assets Summary */}
      {selectedAssets.length > 0 && (
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">
                  {selectedAssets.length} Asset{selectedAssets.length > 1 ? "s" : ""} Selected
                </h3>
                <p className="text-slate-300 text-sm">
                  Ready to import into your content workflow
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  Clear Selection
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Import to Content
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}