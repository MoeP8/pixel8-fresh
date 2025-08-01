import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Send,
  Save,
  Calendar,
  Image,
  Video,
  Hash,
  AtSign,
  Bold,
  Italic,
  Link,
  Smile,
  Globe,
  Eye,
  Clock,
  Sparkles,
  Plus,
  X,
  Upload,
  Mic,
  FileText,
  Target,
  TrendingUp,
  Users,
  MessageCircle,
  Settings,
  RefreshCw,
  Wand2,
  CheckCircle,
  AlertCircle,
  Loader
} from "lucide-react";
import { PlatformPreview } from "./PlatformPreview";
import { AIAssistant } from "./AIAssistant";
import { useSocialMedia, useContentValidation, usePublishStatus } from "../../hooks/useSocialMedia";
import { useDragDropUpload } from "../../hooks/useFileUpload";
import { toast } from "react-hot-toast";

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

interface ContentComposerProps {
  onPublish?: (content: PostContent, platforms: string[]) => void;
  onSaveDraft?: (content: PostContent, platforms: string[]) => void;
  initialContent?: Partial<PostContent>;
  availablePlatforms?: Platform[];
}

export function ContentComposer({
  onPublish,
  onSaveDraft,
  initialContent = {},
  availablePlatforms = []
}: ContentComposerProps) {
  // Social Media API hooks
  const { 
    platformStatus, 
    readyPlatforms, 
    isLoading, 
    publishContent, 
    publishError 
  } = useSocialMedia();
  
  const { validateForPlatforms, getMinCharacterLimit } = useContentValidation();
  const { getPublishSummary, getSuccessfulPublications, getFailedPublications } = usePublishStatus();
  
  // File upload hooks
  const { 
    uploadMultipleFiles, 
    isUploading, 
    uploadError, 
    uploadedFiles,
    availableServices,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useDragDropUpload();

  const [content, setContent] = useState<PostContent>({
    caption: initialContent.caption || "",
    hashtags: initialContent.hashtags || [],
    mentions: initialContent.mentions || [],
    media: initialContent.media || [],
    link: initialContent.link || "",
    call_to_action: initialContent.call_to_action || "",
    scheduled_at: initialContent.scheduled_at || "",
    ...initialContent
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    readyPlatforms.length > 0 ? readyPlatforms : availablePlatforms.filter(p => p.enabled).map(p => p.id)
  );
  const [activeTab, setActiveTab] = useState("compose");
  const [hashtagInput, setHashtagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use platform status from API or fallback to mock platforms
  const platforms: Platform[] = availablePlatforms.length > 0 ? availablePlatforms : [
    {
      id: "facebook",
      name: "Facebook",
      icon: () => <div className="w-4 h-4 bg-blue-500 rounded"></div>,
      color: "from-blue-500 to-blue-600",
      enabled: platformStatus.facebook?.ready ?? false,
      characterLimit: platformStatus.facebook?.config?.maxCharacters ?? 63206,
      hashtagLimit: 10,
      mediaLimit: 10,
      features: ["posts", "stories", "events"]
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: () => <div className="w-4 h-4 bg-pink-500 rounded"></div>,
      color: "from-pink-500 to-purple-500",
      enabled: platformStatus.instagram?.ready ?? false,
      characterLimit: platformStatus.instagram?.config?.maxCharacters ?? 2200,
      hashtagLimit: 30,
      mediaLimit: 10,
      features: ["stories", "reels", "posts", "carousel"]
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: () => <div className="w-4 h-4 bg-sky-400 rounded"></div>,
      color: "from-sky-400 to-blue-500",
      enabled: platformStatus.twitter?.ready ?? false,
      characterLimit: platformStatus.twitter?.config?.maxCharacters ?? 280,
      hashtagLimit: 10,
      mediaLimit: 4,
      features: ["tweets", "threads", "spaces"]
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: () => <div className="w-4 h-4 bg-blue-600 rounded"></div>,
      color: "from-blue-600 to-blue-700",
      enabled: platformStatus.linkedin?.ready ?? false,
      characterLimit: platformStatus.linkedin?.config?.maxCharacters ?? 3000,
      hashtagLimit: 5,
      mediaLimit: 9,
      features: ["posts", "articles", "newsletters"]
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: () => <div className="w-4 h-4 bg-red-500 rounded"></div>,
      color: "from-red-500 to-pink-500",
      enabled: platformStatus.tiktok?.ready ?? false,
      characterLimit: platformStatus.tiktok?.config?.maxCharacters ?? 2200,
      hashtagLimit: 20,
      mediaLimit: 1,
      features: ["videos", "stories"]
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: () => <div className="w-4 h-4 bg-red-600 rounded"></div>,
      color: "from-red-600 to-red-700",
      enabled: platformStatus.youtube?.ready ?? false,
      characterLimit: platformStatus.youtube?.config?.maxCharacters ?? 5000,
      hashtagLimit: 15,
      mediaLimit: 1,
      features: ["videos", "shorts", "community"]
    }
  ];

  const getCharacterCount = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return { current: 0, limit: 0, percentage: 0 };
    
    const current = content.caption.length + content.hashtags.join(" ").length + content.mentions.join(" ").length;
    const limit = platform.characterLimit;
    const percentage = (current / limit) * 100;
    
    return { current, limit, percentage };
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !content.hashtags.includes(hashtagInput)) {
      setContent(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.replace("#", "")]
      }));
      setHashtagInput("");
    }
  };

  const removeHashtag = (hashtag: string) => {
    setContent(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const addMention = () => {
    if (mentionInput.trim() && !content.mentions.includes(mentionInput)) {
      setContent(prev => ({
        ...prev,
        mentions: [...prev.mentions, mentionInput.replace("@", "")]
      }));
      setMentionInput("");
    }
  };

  const removeMention = (mention: string) => {
    setContent(prev => ({
      ...prev,
      mentions: prev.mentions.filter(m => m !== mention)
    }));
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const insertFormatting = (type: "bold" | "italic" | "link") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.caption.substring(start, end);
    
    let formattedText = "";
    switch (type) {
      case "bold":
        formattedText = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        formattedText = `*${selectedText || "italic text"}*`;
        break;
      case "link":
        formattedText = `[${selectedText || "link text"}](url)`;
        break;
    }

    const newCaption = content.caption.substring(0, start) + formattedText + content.caption.substring(end);
    setContent(prev => ({ ...prev, caption: newCaption }));
  };

  const handleAISuggestion = (suggestion: string) => {
    setContent(prev => ({ ...prev, caption: suggestion }));
    setIsAIAssistantOpen(false);
  };

  const handlePublish = async () => {
    if (isScheduling && !content.scheduled_at) {
      toast.error('Please select a date and time for scheduling');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (!content.caption.trim()) {
      toast.error('Please enter some content');
      return;
    }

    // Validate content for selected platforms
    const validationResults = validateForPlatforms(content.caption, selectedPlatforms);
    const invalidPlatforms = Object.entries(validationResults).filter(([_, result]) => !result.valid);
    
    if (invalidPlatforms.length > 0) {
      const errors = invalidPlatforms.map(([platform, result]) => `${platform}: ${result.error}`);
      toast.error(`Content validation failed:\n${errors.join('\n')}`);
      return;
    }

    setPublishStatus('publishing');

    try {
      const publishRequest = {
        content: content.caption,
        mediaUrls: content.media.map(m => m.url),
        scheduledTime: content.scheduled_at ? new Date(content.scheduled_at) : undefined,
        platforms: selectedPlatforms,
      };

      const results = await publishContent(publishRequest);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length === results.length) {
        setPublishStatus('success');
        toast.success(`Successfully published to ${successful.length} platform${successful.length === 1 ? '' : 's'}!`);
        
        // Call the original onPublish callback if provided
        onPublish?.(content, selectedPlatforms);
      } else if (successful.length > 0) {
        setPublishStatus('success');
        toast.success(`Published to ${successful.length}/${results.length} platforms`);
        if (failed.length > 0) {
          toast.error(`Failed: ${failed.map(f => f.platform).join(', ')}`);
        }
      } else {
        setPublishStatus('error');
        toast.error('Publishing failed for all platforms');
      }
    } catch (error) {
      setPublishStatus('error');
      toast.error(error instanceof Error ? error.message : 'Publishing failed');
    }

    // Reset status after 3 seconds
    setTimeout(() => setPublishStatus('idle'), 3000);
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(content, selectedPlatforms);
  };

  const getPlatformStatusColor = (platformId: string) => {
    const { percentage } = getCharacterCount(platformId);
    if (percentage > 95) return "text-red-400";
    if (percentage > 80) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main Composer */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Content Composer
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Create engaging content for multiple platforms
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Publish to Platforms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const isReady = platform.enabled;
                  const Icon = platform.icon;
                  const charData = getCharacterCount(platform.id);
                  
                  return (
                    <Card 
                      key={platform.id}
                      className={`cursor-pointer transition-all duration-200 relative ${
                        isSelected 
                          ? "bg-white/20 border-white/40 ring-2 ring-blue-400" 
                          : isReady
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-white/5 border-red-500/30 opacity-60 cursor-not-allowed"
                      }`}
                      onClick={() => isReady && togglePlatform(platform.id)}
                    >
                      <CardContent className="p-4 text-center">
                        {/* API Status Indicator */}
                        <div className="absolute top-2 right-2">
                          {isReady ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-red-400" />
                          )}
                        </div>
                        
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center mx-auto mb-2`}>
                          <Icon />
                        </div>
                        <h4 className="text-white text-sm font-medium mb-1">{platform.name}</h4>
                        
                        {!isReady && (
                          <div className="text-xs text-red-400 mb-1">Not configured</div>
                        )}
                        
                        {isSelected && isReady && (
                          <div className={`text-xs ${getPlatformStatusColor(platform.id)}`}>
                            {charData.current}/{charData.limit}
                          </div>
                        )}
                        {isSelected && charData.percentage > 0 && (
                          <Progress 
                            value={charData.percentage} 
                            className="h-1 mt-1"
                          />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white/10">
                <TabsTrigger value="compose" className="data-[state=active]:bg-white/20">
                  <FileText className="w-4 h-4 mr-2" />
                  Compose
                </TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-white/20">
                  <Image className="w-4 h-4 mr-2" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="hashtags" className="data-[state=active]:bg-white/20">
                  <Hash className="w-4 h-4 mr-2" />
                  Tags
                </TabsTrigger>
                <TabsTrigger value="schedule" className="data-[state=active]:bg-white/20">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </TabsTrigger>
              </TabsList>

              <TabsContent value="compose" className="space-y-4">
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting("bold")}
                    className="text-slate-400 hover:text-white"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting("italic")}
                    className="text-slate-400 hover:text-white"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting("link")}
                    className="text-slate-400 hover:text-white"
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-white/20 mx-2"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <AtSign className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Hash className="w-4 h-4" />
                  </Button>
                </div>

                {/* Main Text Area */}
                <div className="space-y-2">
                  <Textarea
                    ref={textareaRef}
                    placeholder="What's on your mind? Share your story..."
                    value={content.caption}
                    onChange={(e) => setContent(prev => ({ ...prev, caption: e.target.value }))}
                    className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-slate-400 resize-none"
                  />
                  
                  {/* Character Count for Selected Platforms */}
                  {selectedPlatforms.length > 0 && (
                    <div className="flex flex-wrap gap-4 text-xs">
                      {selectedPlatforms.map(platformId => {
                        const platform = platforms.find(p => p.id === platformId);
                        const charData = getCharacterCount(platformId);
                        if (!platform) return null;
                        
                        return (
                          <div key={platformId} className={`flex items-center gap-2 ${getPlatformStatusColor(platformId)}`}>
                            <span className="capitalize">{platform.name}:</span>
                            <span>{charData.current}/{charData.limit}</span>
                            {charData.percentage > 80 && (
                              <Progress 
                                value={charData.percentage} 
                                className="w-12 h-1"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Call to Action */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Call to Action (Optional)</label>
                  <Input
                    placeholder="e.g., Visit our website, Shop now, Learn more..."
                    value={content.call_to_action || ""}
                    onChange={(e) => setContent(prev => ({ ...prev, call_to_action: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Link (Optional)</label>
                  <Input
                    placeholder="https://example.com"
                    value={content.link || ""}
                    onChange={(e) => setContent(prev => ({ ...prev, link: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                {/* Upload Status */}
                {availableServices.length === 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">No Upload Services Configured</span>
                    </div>
                    <p className="text-red-300 text-sm">
                      Please configure Supabase, Cloudinary, or Dropbox in your .env.local file to enable media uploads.
                    </p>
                  </div>
                )}

                {/* Drag & Drop Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    isDragOver 
                      ? "border-blue-400 bg-blue-500/10" 
                      : "border-white/20 hover:border-white/40"
                  } ${availableServices.length === 0 ? "opacity-50" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, { folder: 'post-media', public: true })}
                >
                  {isUploading ? (
                    <>
                      <Loader className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
                      <h3 className="text-white font-medium mb-2">Uploading Media...</h3>
                      <p className="text-slate-300 text-sm">Please wait while your files are being uploaded</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-white font-medium mb-2">Add Media</h3>
                      <p className="text-slate-300 text-sm mb-4">
                        {isDragOver 
                          ? "Drop files here to upload" 
                          : "Drag & drop files here, or click to browse"
                        }
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          className="hidden"
                          id="file-upload"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              const results = await uploadMultipleFiles(files, { 
                                folder: 'post-media', 
                                public: true 
                              });
                              
                              const successful = results.filter(r => r.success);
                              successful.forEach(result => {
                                if (result.url) {
                                  const mediaItem = {
                                    id: Date.now().toString() + Math.random(),
                                    url: result.url,
                                    type: result.type?.startsWith('video/') ? 'video' as const : 'image' as const,
                                    name: result.path?.split('/').pop() || 'Unknown',
                                    size: result.size || 0
                                  };
                                  setContent(prev => ({
                                    ...prev,
                                    media: [...prev.media, mediaItem]
                                  }));
                                }
                              });
                              
                              if (successful.length < results.length) {
                                toast.error(`${results.length - successful.length} file(s) failed to upload`);
                              } else {
                                toast.success(`${successful.length} file(s) uploaded successfully!`);
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          className="bg-white/10 border-white/20 hover:bg-white/20"
                          disabled={availableServices.length === 0}
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Files
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-white/10 border-white/20 hover:bg-white/20"
                          disabled
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Asset Library
                        </Button>
                      </div>
                      
                      {availableServices.length > 0 && (
                        <div className="mt-4 text-xs text-slate-400">
                          Upload services: {availableServices.join(', ')}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Upload Error */}
                {uploadError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{uploadError}</span>
                    </div>
                  </div>
                )}

                {/* Media Grid */}
                {content.media.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {content.media.map((media, index) => (
                      <Card key={media.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-3">
                          <div className="aspect-square bg-slate-800 rounded-lg mb-2 relative overflow-hidden">
                            {media.url ? (
                              media.type === "image" ? (
                                <img 
                                  src={media.url} 
                                  alt={media.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.appendChild(
                                      Object.assign(document.createElement('div'), {
                                        className: 'w-8 h-8 text-slate-400 absolute inset-0 m-auto',
                                        innerHTML: '<svg>...</svg>' // Image icon
                                      })
                                    );
                                  }}
                                />
                              ) : (
                                <video 
                                  src={media.url}
                                  className="w-full h-full object-cover rounded-lg"
                                  muted
                                  onError={() => {
                                    // Fallback to icon if video fails to load
                                  }}
                                />
                              )
                            ) : (
                              media.type === "image" ? (
                                <Image className="w-8 h-8 text-slate-400 absolute inset-0 m-auto" />
                              ) : (
                                <Video className="w-8 h-8 text-slate-400 absolute inset-0 m-auto" />
                              )
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 text-slate-400 hover:text-white bg-black/50 hover:bg-black/70"
                              onClick={() => {
                                setContent(prev => ({
                                  ...prev,
                                  media: prev.media.filter((_, i) => i !== index)
                                }));
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-white text-xs truncate">{media.name}</p>
                          <p className="text-slate-400 text-xs">
                            {media.size > 0 && `${(media.size / 1024 / 1024).toFixed(1)}MB`}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="hashtags" className="space-y-4">
                {/* Add Hashtags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Add Hashtags</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="#hashtag"
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addHashtag()}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                    />
                    <Button onClick={addHashtag} disabled={!hashtagInput.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Hashtag List */}
                {content.hashtags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Hashtags ({content.hashtags.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.map((hashtag) => (
                        <Badge
                          key={hashtag}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 border-blue-400/30"
                        >
                          #{hashtag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-2 text-blue-300 hover:text-white"
                            onClick={() => removeHashtag(hashtag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Mentions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Add Mentions</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="@username"
                      value={mentionInput}
                      onChange={(e) => setMentionInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addMention()}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                    />
                    <Button onClick={addMention} disabled={!mentionInput.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Mention List */}
                {content.mentions.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Mentions ({content.mentions.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {content.mentions.map((mention) => (
                        <Badge
                          key={mention}
                          variant="secondary"
                          className="bg-green-500/20 text-green-300 border-green-400/30"
                        >
                          @{mention}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-2 text-green-300 hover:text-white"
                            onClick={() => removeMention(mention)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hashtag Suggestions */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Trending Hashtags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["socialmedia", "marketing", "branding", "digitalmarketing", "content"].map((tag) => (
                        <Button
                          key={tag}
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 hover:bg-white/20"
                          onClick={() => {
                            if (!content.hashtags.includes(tag)) {
                              setContent(prev => ({
                                ...prev,
                                hashtags: [...prev.hashtags, tag]
                              }));
                            }
                          }}
                        >
                          #{tag}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-white font-medium">Post Scheduling</h3>
                    <p className="text-slate-300 text-sm">
                      Publish now or schedule for later
                    </p>
                  </div>
                  <Switch
                    checked={isScheduling}
                    onCheckedChange={setIsScheduling}
                  />
                </div>

                {isScheduling && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Date</label>
                        <Input
                          type="date"
                          value={content.scheduled_at?.split("T")[0] || ""}
                          onChange={(e) => {
                            const time = content.scheduled_at?.split("T")[1] || "12:00";
                            setContent(prev => ({
                              ...prev,
                              scheduled_at: `${e.target.value}T${time}`
                            }));
                          }}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Time</label>
                        <Input
                          type="time"
                          value={content.scheduled_at?.split("T")[1]?.slice(0, 5) || ""}
                          onChange={(e) => {
                            const date = content.scheduled_at?.split("T")[0] || new Date().toISOString().split("T")[0];
                            setContent(prev => ({
                              ...prev,
                              scheduled_at: `${date}T${e.target.value}:00`
                            }));
                          }}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    {/* Optimal Posting Times */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-base flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Optimal Posting Times
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[
                            { platform: "Instagram", time: "12:00 PM - 3:00 PM", engagement: "87%" },
                            { platform: "Facebook", time: "1:00 PM - 4:00 PM", engagement: "82%" },
                            { platform: "Twitter", time: "9:00 AM - 10:00 AM", engagement: "75%" }
                          ].map((optimal) => (
                            <div key={optimal.platform} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-300">{optimal.platform}:</span>
                                <span className="text-white">{optimal.time}</span>
                              </div>
                              <Badge variant="outline" className="border-green-400 text-green-400">
                                {optimal.engagement}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedPlatforms.length === 0 && (
                  <p className="text-sm text-yellow-400">Select at least one platform</p>
                )}
                
                <Button
                  onClick={handlePublish}
                  disabled={selectedPlatforms.length === 0 || !content.caption.trim() || isLoading || publishStatus === 'publishing'}
                  className={`transition-all duration-200 ${
                    publishStatus === 'success' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : publishStatus === 'error'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } disabled:opacity-50`}
                >
                  {publishStatus === 'publishing' ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : publishStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Published!
                    </>
                  ) : publishStatus === 'error' ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Failed
                    </>
                  ) : isScheduling ? (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Post
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Previews */}
      <div className="space-y-6">
        <PlatformPreview
          content={content}
          platforms={selectedPlatforms.map(id => platforms.find(p => p.id === id)!).filter(Boolean)}
        />
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onSuggestion={handleAISuggestion}
        currentContent={content.caption}
        selectedPlatforms={selectedPlatforms}
      />
    </div>
  );
}