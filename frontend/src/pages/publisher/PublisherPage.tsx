import { useState } from "react";
import { ContentComposer } from "@/components/publisher/ContentComposer";
import { AccountSelector } from "@/components/publishing/AccountSelector";
import { useMultiAccountPublishing, BulkPublishRequest } from "@/hooks/useMultiAccountPublishing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Zap,
  Globe,
  MessageSquare
} from "lucide-react";

interface PostContent {
  title?: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  media: any[];
  link?: string;
  call_to_action?: string;
  scheduled_at?: string;
}

interface Draft {
  id: string;
  title: string;
  content: PostContent;
  platforms: string[];
  created_at: string;
  updated_at: string;
  status: "draft" | "scheduled" | "published" | "failed";
}

export function PublisherPage() {
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isMultiAccountMode, setIsMultiAccountMode] = useState(false);
  
  const {
    accounts,
    isLoading: accountsLoading,
    isPublishing,
    publishToMultipleAccounts,
    getPublishingStats,
    updateAccountStatus
  } = useMultiAccountPublishing();
  
  // Mock drafts data
  const [drafts] = useState<Draft[]>([
    {
      id: "1",
      title: "Summer Campaign Launch",
      content: {
        caption: "🌞 Ready for summer? Our new collection drops tomorrow! Get ready to shine with styles that capture the season's energy...",
        hashtags: ["summer", "fashion", "newcollection", "style"],
        mentions: ["fashionweek"],
        media: [],
        call_to_action: "Shop the collection"
      },
      platforms: ["instagram", "facebook"],
      created_at: "2024-01-28T10:30:00Z",
      updated_at: "2024-01-28T14:20:00Z",
      status: "draft"
    },
    {
      id: "2",
      title: "Behind the Scenes Content",
      content: {
        caption: "Take a peek behind the scenes at our creative process! From concept to creation, here's how we bring your favorite designs to life 🎨",
        hashtags: ["behindthescenes", "creative", "design", "process"],
        mentions: [],
        media: [],
        scheduled_at: "2024-01-30T12:00:00Z"
      },
      platforms: ["instagram", "linkedin"],
      created_at: "2024-01-27T16:45:00Z",
      updated_at: "2024-01-28T09:15:00Z",
      status: "scheduled"
    },
    {
      id: "3",
      title: "Customer Success Story",
      content: {
        caption: "Amazing transformation story from our client @happycustomer! 🌟 See how our solutions helped them achieve their goals...",
        hashtags: ["success", "transformation", "testimonial", "results"],
        mentions: ["happycustomer"],
        media: []
      },
      platforms: ["linkedin", "twitter"],
      created_at: "2024-01-26T11:20:00Z",
      updated_at: "2024-01-28T08:30:00Z",
      status: "published"
    }
  ]);

  const handlePublish = async (content: PostContent, platforms: string[]) => {
    if (isMultiAccountMode && selectedAccounts.length > 0) {
      // Use multi-account publishing
      const bulkRequest: BulkPublishRequest = {
        content: content.caption,
        media_urls: content.media.map(m => m.url),
        scheduled_at: content.scheduled_at,
        account_ids: selectedAccounts,
        platform_specific: platforms.reduce((acc, platform) => {
          acc[platform] = {
            content: content.caption,
            hashtags: content.hashtags,
            mentions: content.mentions,
            link: content.link
          };
          return acc;
        }, {} as { [platform: string]: any })
      };
      
      await publishToMultipleAccounts(bulkRequest);
    } else {
      // Legacy single-account publishing (keeping old N8N approach)
      console.log("Publishing content:", { content, platforms });
      
      try {
        const response = await fetch('https://moep8.app.n8n.cloud/webhook/publish-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            post_id: Date.now().toString(),
            platforms: platforms,
            content: content.caption,
            hashtags: content.hashtags,
            mentions: content.mentions,
            media_urls: content.media.map(m => m.url),
            scheduled_at: content.scheduled_at,
            call_to_action: content.call_to_action,
            link: content.link
          })
        });
        
        if (response.ok) {
          console.log("Successfully triggered N8N publishing workflow");
        }
      } catch (error) {
        console.error("Failed to trigger N8N workflow:", error);
      }
    }
  };

  const handleSaveDraft = (content: PostContent, platforms: string[]) => {
    console.log("Saving draft:", { content, platforms });
    // Implementation for saving drafts
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-400 border-green-400 bg-green-500/20";
      case "scheduled":
        return "text-blue-400 border-blue-400 bg-blue-500/20";
      case "failed":
        return "text-red-400 border-red-400 bg-red-500/20";
      default:
        return "text-slate-400 border-slate-400 bg-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-3 h-3" />;
      case "scheduled":
        return <Clock className="w-3 h-3" />;
      case "failed":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  // Get real-time publishing stats
  const stats = getPublishingStats();
  const publishingStats = {
    todayPosts: 8,
    scheduledPosts: 23,
    drafts: 12,
    totalReach: "45.2K",
    engagementRate: "7.8%",
    bestPerformingTime: "2:00 PM",
    totalAccounts: stats.totalAccounts,
    activeAccounts: stats.activeAccounts,
    teamMembers: stats.teamMembers,
    totalFollowers: stats.totalFollowers
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slide-down">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Content Publisher
          </h1>
          <p className="text-slate-300 leading-relaxed">
            Create, schedule, and publish engaging content across all your social platforms
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant={isMultiAccountMode ? "default" : "outline"}
            onClick={() => setIsMultiAccountMode(!isMultiAccountMode)}
            className={`transition-all duration-300 hover-lift ${
              isMultiAccountMode 
                ? "btn-primary shadow-primary" 
                : "glass hover-glow"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Multi-Account Mode
          </Button>
          
          <Button variant="outline" className="glass hover-glow hover-lift">
            <Settings className="w-4 h-4 mr-2" />
            Publisher Settings
          </Button>
          
          <Button className="btn-secondary hover-lift">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Templates
          </Button>
        </div>
      </div>

      {/* Multi-Account Stats */}
      {isMultiAccountMode && (
        <div className="mb-8 animate-slide-up">
          <Card className="glass-dark hover-lift card-interactive">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Team Account Overview
              </CardTitle>
              <CardDescription className="text-slate-300">
                Multi-account publishing system for your entire team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl glass hover-lift transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2 animate-bounce-in">{publishingStats.totalAccounts}</div>
                  <div className="text-sm text-slate-300 font-medium">Total Accounts</div>
                </div>
                <div className="text-center p-4 rounded-xl glass hover-lift transition-all duration-300">
                  <div className="text-3xl font-bold text-green-400 mb-2 animate-bounce-in">{publishingStats.activeAccounts}</div>
                  <div className="text-sm text-slate-300 font-medium">Active Accounts</div>
                </div>
                <div className="text-center p-4 rounded-xl glass hover-lift transition-all duration-300">
                  <div className="text-3xl font-bold text-blue-400 mb-2 animate-bounce-in">{publishingStats.teamMembers}</div>
                  <div className="text-sm text-slate-300 font-medium">Team Members</div>
                </div>
                <div className="text-center p-4 rounded-xl glass hover-lift transition-all duration-300">
                  <div className="text-3xl font-bold text-purple-400 mb-2 animate-bounce-in">{(publishingStats.totalFollowers / 1000).toFixed(1)}K</div>
                  <div className="text-sm text-slate-300 font-medium">Total Followers</div>
                </div>
              </div>
              
              {selectedAccounts.length > 0 && (
                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">
                        {selectedAccounts.length} accounts selected for publishing
                      </span>
                    </div>
                    <Badge className="bg-blue-500 text-white">
                      Ready to publish
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Publishing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <Card className="glass-dark hover-lift card-interactive animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Today's Posts</p>
                <p className="text-3xl font-bold text-white">{publishingStats.todayPosts}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark hover-lift card-interactive animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Scheduled</p>
                <p className="text-3xl font-bold text-white">{publishingStats.scheduledPosts}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark hover-lift card-interactive animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Drafts</p>
                <p className="text-3xl font-bold text-white">{publishingStats.drafts}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark hover-lift card-interactive animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Total Reach</p>
                <p className="text-3xl font-bold text-white">{publishingStats.totalReach}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark hover-lift card-interactive animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Engagement</p>
                <p className="text-3xl font-bold text-white">{publishingStats.engagementRate}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark hover-lift card-interactive animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Best Time</p>
                <p className="text-2xl font-bold text-white">{publishingStats.bestPerformingTime}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-slide-up">
        <Card className="glass-dark">
          <CardHeader className="pb-0">
            <TabsList className="grid w-full grid-cols-3 glass p-1 rounded-xl">
              <TabsTrigger 
                value="compose" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300 rounded-lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Compose
              </TabsTrigger>
              <TabsTrigger 
                value="drafts" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300 rounded-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Drafts & Scheduled
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300 rounded-lg"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>
          </CardHeader>
        </Card>

        <TabsContent value="compose" className="space-y-6">
          {isMultiAccountMode && (
            <AccountSelector
              selectedAccounts={selectedAccounts}
              onAccountsChange={setSelectedAccounts}
              accounts={accounts}
              isLoading={accountsLoading}
              className="backdrop-blur-md bg-white/10 border border-white/20"
            />
          )}
          
          <ContentComposer
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
          />
          
          {isMultiAccountMode && isPublishing && (
            <Card className="backdrop-blur-md bg-white/10 border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="animate-spin">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">Publishing to Multiple Accounts</h3>
                    <p className="text-slate-300 text-sm">
                      Publishing content to {selectedAccounts.length} selected accounts...
                    </p>
                    <Progress value={66} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          {/* Filters */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      placeholder="Search drafts..."
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-slate-400 w-64"
                    />
                  </div>
                  
                  <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drafts List */}
          <div className="space-y-4">
            {drafts.map((draft) => (
              <Card key={draft.id} className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">{draft.title}</h3>
                        <Badge className={getStatusColor(draft.status)}>
                          {getStatusIcon(draft.status)}
                          <span className="ml-1 capitalize">{draft.status}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                        {draft.content.caption}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Platforms: {draft.platforms.join(", ")}</span>
                        <span>•</span>
                        <span>Updated: {new Date(draft.updated_at).toLocaleDateString()}</span>
                        {draft.content.scheduled_at && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Scheduled: {new Date(draft.content.scheduled_at).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Tags */}
                      {draft.content.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {draft.content.hashtags.slice(0, 5).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs px-2 py-0 border-slate-600 text-slate-300">
                              #{tag}
                            </Badge>
                          ))}
                          {draft.content.hashtags.length > 5 && (
                            <Badge variant="outline" className="text-xs px-2 py-0 border-slate-600 text-slate-300">
                              +{draft.content.hashtags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Publishing Performance</CardTitle>
              <CardDescription className="text-slate-300">
                Track your content performance and optimization insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-slate-300">
                  Detailed performance analytics and insights will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}