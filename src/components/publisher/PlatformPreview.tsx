import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Play,
  Volume2,
  User,
  Verified,
  Globe,
  Clock,
  TrendingUp,
  Users,
  Target,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: any;
  color: string;
  enabled: boolean;
  characterLimit: number;
  hashtagLimit: number;
  mediaLimit: number;
  features: string[];
}

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  name: string;
  size: number;
}

interface PostContent {
  title?: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  media: MediaItem[];
  link?: string;
  call_to_action?: string;
  scheduled_at?: string;
}

interface PlatformPreviewProps {
  content: PostContent;
  platforms: Platform[];
  viewMode?: "mobile" | "desktop" | "tablet";
}

export function PlatformPreview({ 
  content, 
  platforms, 
  viewMode = "mobile" 
}: PlatformPreviewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]?.id || "");
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);

  const formatContent = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return { text: "", truncated: false };

    let text = content.caption;
    
    // Add hashtags and mentions
    if (content.hashtags.length > 0) {
      const hashtags = content.hashtags.slice(0, platform.hashtagLimit).map(tag => `#${tag}`).join(" ");
      text += `\n\n${hashtags}`;
    }
    
    if (content.mentions.length > 0) {
      const mentions = content.mentions.map(mention => `@${mention}`).join(" ");
      text += `\n${mentions}`;
    }

    // Check if content needs truncation
    const truncated = text.length > platform.characterLimit;
    if (truncated) {
      text = text.substring(0, platform.characterLimit - 3) + "...";
    }

    return { text, truncated };
  };

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };

  const InstagramPreview = () => {
    const { text } = formatContent("instagram");
    
    return (
      <div className="bg-black rounded-lg overflow-hidden max-w-sm mx-auto">
        {/* Instagram Header */}
        <div className="flex items-center justify-between p-4 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-medium">your_brand</span>
                <Verified className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-gray-400 text-xs">Sponsored</span>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-white" />
        </div>

        {/* Media */}
        <div className="aspect-square bg-slate-800 flex items-center justify-center relative">
          {content.media.length > 0 ? (
            <div className="text-white text-sm">Media Preview</div>
          ) : (
            <div className="text-slate-400 text-sm">No media selected</div>
          )}
          {content.media.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              1/{content.media.length}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 bg-black">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-white" />
              <MessageCircle className="w-6 h-6 text-white" />
              <Share className="w-6 h-6 text-white" />
            </div>
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          
          <div className="space-y-2">
            <div className="text-white text-sm font-medium">1,234 likes</div>
            <div className="text-white text-sm">
              <span className="font-medium">your_brand</span> {text}
            </div>
            <div className="text-gray-400 text-xs">2 HOURS AGO</div>
          </div>
        </div>
      </div>
    );
  };

  const FacebookPreview = () => {
    const { text } = formatContent("facebook");
    
    return (
      <div className="bg-white rounded-lg overflow-hidden max-w-lg mx-auto shadow-lg">
        {/* Facebook Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-gray-900 text-sm font-medium">Your Brand</span>
                <Verified className="w-3 h-3 text-blue-500" />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>2h</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
              </div>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <p className="text-gray-900 text-sm leading-relaxed">{text}</p>
        </div>

        {/* Media */}
        {content.media.length > 0 && (
          <div className="aspect-video bg-slate-800 flex items-center justify-center">
            <div className="text-white text-sm">Media Preview</div>
          </div>
        )}

        {/* Link Preview */}
        {content.link && (
          <div className="mx-4 mb-3 border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <div className="p-3">
              <div className="text-gray-500 text-xs uppercase">example.com</div>
              <div className="text-gray-900 text-sm font-medium">Link Preview Title</div>
              <div className="text-gray-600 text-xs">Link description will appear here</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <div className="flex items-center gap-1 text-xs">
              <Heart className="w-4 h-4 text-blue-500 fill-current" />
              <span>You and 423 others</span>
            </div>
            <div className="text-xs">12 comments • 8 shares</div>
          </div>
          
          <div className="flex items-center justify-around border-t border-gray-200 pt-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
              <Heart className="w-4 h-4" />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-4 h-4" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const TwitterPreview = () => {
    const { text, truncated } = formatContent("twitter");
    
    return (
      <div className="bg-black rounded-lg overflow-hidden max-w-lg mx-auto border border-gray-800">
        {/* Twitter Header */}
        <div className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-white font-bold text-sm">Your Brand</span>
              <Verified className="w-4 h-4 text-blue-400" />
              <span className="text-gray-500 text-sm">@yourbrand</span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">2h</span>
            </div>
            
            <div className="space-y-3">
              <p className="text-white text-sm leading-relaxed break-words">{text}</p>
              
              {truncated && (
                <div className="text-sky-400 text-sm">Show this thread</div>
              )}
              
              {/* Media */}
              {content.media.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-gray-700">
                  <div className="aspect-video bg-slate-800 flex items-center justify-center">
                    <div className="text-white text-sm">Media Preview</div>
                  </div>
                </div>
              )}
              
              {/* Link Card */}
              {content.link && (
                <div className="border border-gray-700 rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-slate-700 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="p-3">
                    <div className="text-gray-400 text-xs">example.com</div>
                    <div className="text-white text-sm font-medium">Link Preview Title</div>
                    <div className="text-gray-400 text-xs">Link description</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between mt-3 max-w-md">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-500 hover:text-sky-400 p-0">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">24</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-500 hover:text-green-400 p-0">
                <Share className="w-4 h-4" />
                <span className="text-xs">8</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-500 hover:text-red-400 p-0">
                <Heart className="w-4 h-4" />
                <span className="text-xs">156</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-sky-400 p-0">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LinkedInPreview = () => {
    const { text } = formatContent("linkedin");
    
    return (
      <div className="bg-white rounded-lg overflow-hidden max-w-lg mx-auto shadow-lg border border-gray-200">
        {/* LinkedIn Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-medium">Your Brand</div>
              <div className="text-gray-500 text-sm">1,234 followers</div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <span>2h</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
              </div>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>

        {/* Media */}
        {content.media.length > 0 && (
          <div className="aspect-video bg-slate-100 flex items-center justify-center">
            <div className="text-gray-600 text-sm">Media Preview</div>
          </div>
        )}

        {/* Link Preview */}
        {content.link && (
          <div className="mx-4 mb-4 border border-gray-200 rounded overflow-hidden">
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <div className="p-3">
              <div className="text-gray-900 font-medium text-sm">Link Preview Title</div>
              <div className="text-gray-500 text-xs">example.com</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-3">
            <span>42 reactions • 8 comments</span>
          </div>
          
          <div className="flex items-center justify-around">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:bg-gray-50">
              <Heart className="w-4 h-4" />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:bg-gray-50">
              <MessageCircle className="w-4 h-4" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:bg-gray-50">
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = (platformId: string) => {
    switch (platformId) {
      case "instagram":
        return <InstagramPreview />;
      case "facebook":
        return <FacebookPreview />;
      case "twitter":
        return <TwitterPreview />;
      case "linkedin":
        return <LinkedInPreview />;
      default:
        return (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">Platform preview not available</p>
          </div>
        );
    }
  };

  if (platforms.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-12 text-center">
          <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No Platforms Selected</h3>
          <p className="text-slate-300">Select platforms to see live previews</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Platform Preview
            </CardTitle>
            <CardDescription className="text-slate-300">
              See how your content will look on each platform
            </CardDescription>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
            {["mobile", "tablet", "desktop"].map((mode) => (
              <Button
                key={mode}
                variant={currentViewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentViewMode(mode as any)}
                className={`h-8 w-8 p-0 ${
                  currentViewMode === mode ? "" : "text-slate-400 hover:text-white"
                }`}
              >
                {getViewModeIcon(mode)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Platform Tabs */}
        {platforms.length > 1 ? (
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList className="grid w-full bg-white/10" style={{ gridTemplateColumns: `repeat(${platforms.length}, 1fr)` }}>
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <TabsTrigger 
                    key={platform.id} 
                    value={platform.id}
                    className="data-[state=active]:bg-white/20 flex items-center gap-2"
                  >
                    <Icon />
                    <span className="hidden sm:inline">{platform.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {platforms.map((platform) => (
              <TabsContent key={platform.id} value={platform.id} className="mt-6">
                <div className={`transition-all duration-300 ${
                  currentViewMode === "mobile" ? "max-w-sm" : 
                  currentViewMode === "tablet" ? "max-w-md" : "max-w-2xl"
                } mx-auto`}>
                  {renderPreview(platform.id)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className={`transition-all duration-300 ${
            currentViewMode === "mobile" ? "max-w-sm" : 
            currentViewMode === "tablet" ? "max-w-md" : "max-w-2xl"
          } mx-auto`}>
            {renderPreview(platforms[0].id)}
          </div>
        )}

        {/* Content Analysis */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white">{content.caption.length}</div>
                <div className="text-xs text-slate-400">Characters</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{content.hashtags.length}</div>
                <div className="text-xs text-slate-400">Hashtags</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{content.mentions.length}</div>
                <div className="text-xs text-slate-400">Mentions</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{content.media.length}</div>
                <div className="text-xs text-slate-400">Media Items</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Specific Metrics */}
        {selectedPlatform && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Target className="w-4 h-4" />
                Platform Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(() => {
                  const platform = platforms.find(p => p.id === selectedPlatform);
                  if (!platform) return null;
                  const { current, limit, percentage } = (() => {
                    const current = content.caption.length + content.hashtags.join(" ").length;
                    return {
                      current,
                      limit: platform.characterLimit,
                      percentage: (current / platform.characterLimit) * 100
                    };
                  })();
                  
                  return (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Character Usage</span>
                        <span className={`${
                          percentage > 95 ? "text-red-400" :
                          percentage > 80 ? "text-yellow-400" : "text-green-400"
                        }`}>
                          {current}/{limit}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Hashtag Usage</span>
                        <span className={`${
                          content.hashtags.length > platform.hashtagLimit ? "text-red-400" : "text-green-400"
                        }`}>
                          {content.hashtags.length}/{platform.hashtagLimit}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Media Usage</span>
                        <span className={`${
                          content.media.length > platform.mediaLimit ? "text-red-400" : "text-green-400"
                        }`}>
                          {content.media.length}/{platform.mediaLimit}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}