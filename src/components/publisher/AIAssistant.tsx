import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Wand2,
  TrendingUp,
  Target,
  Hash,
  AtSign,
  Lightbulb,
  Brain,
  Zap,
  Clock,
  Globe,
  Users,
  MessageCircle,
  Heart,
  Share,
  Eye,
  ChevronRight,
  Star,
  Loader2
} from "lucide-react";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggestion: (suggestion: string) => void;
  currentContent?: string;
  selectedPlatforms?: string[];
}

interface Suggestion {
  id: string;
  type: "caption" | "hashtags" | "improvement" | "variation";
  content: string;
  platform?: string;
  tone?: string;
  confidence: number;
  reasoning?: string;
}

interface AIPrompt {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: "creative" | "optimization" | "engagement" | "trending";
  template: string;
}

export function AIAssistant({ 
  isOpen, 
  onClose, 
  onSuggestion, 
  currentContent = "", 
  selectedPlatforms = [] 
}: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedTone, setSelectedTone] = useState("professional");
  const [selectedLength, setSelectedLength] = useState("medium");

  // AI Prompt Templates
  const aiPrompts: AIPrompt[] = [
    {
      id: "engage",
      title: "Boost Engagement",
      description: "Create content that drives likes, comments, and shares",
      icon: Heart,
      category: "engagement",
      template: "Create an engaging social media post that encourages interaction and builds community around: {topic}"
    },
    {
      id: "trending",
      title: "Trending Topics",
      description: "Incorporate current trends and viral content patterns",
      icon: TrendingUp,
      category: "trending",
      template: "Write a post that taps into current trends while staying authentic to the brand voice about: {topic}"
    },
    {
      id: "storytelling",
      title: "Tell a Story",
      description: "Transform your message into a compelling narrative",
      icon: MessageCircle,
      category: "creative",
      template: "Transform this into a compelling story that resonates with the audience: {topic}"
    },
    {
      id: "cta",
      title: "Strong Call-to-Action",
      description: "Add powerful CTAs that drive specific actions",
      icon: Target,
      category: "optimization",
      template: "Optimize this content with a compelling call-to-action that drives conversions: {topic}"
    },
    {
      id: "hashtags",
      title: "Hashtag Strategy",
      description: "Generate relevant hashtags for maximum reach",
      icon: Hash,
      category: "optimization",
      template: "Generate a strategic mix of hashtags (trending, niche, and branded) for: {topic}"
    },
    {
      id: "platform",
      title: "Platform Optimization",
      description: "Tailor content for specific platform algorithms",
      icon: Globe,
      category: "optimization",
      template: "Optimize this content specifically for {platform} to maximize algorithmic reach: {topic}"
    }
  ];

  const toneOptions = [
    { id: "professional", label: "Professional", description: "Formal and authoritative" },
    { id: "casual", label: "Casual", description: "Friendly and approachable" },
    { id: "humorous", label: "Humorous", description: "Light-hearted and fun" },
    { id: "inspirational", label: "Inspirational", description: "Motivational and uplifting" },
    { id: "educational", label: "Educational", description: "Informative and instructive" }
  ];

  const lengthOptions = [
    { id: "short", label: "Short", description: "Concise and punchy" },
    { id: "medium", label: "Medium", description: "Balanced length" },
    { id: "long", label: "Long", description: "Detailed and comprehensive" }
  ];

  // Mock AI suggestions - replace with real AI API calls
  const generateSuggestions = async (prompt?: string) => {
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSuggestions: Suggestion[] = [
      {
        id: "1",
        type: "caption",
        content: "🚀 Ready to transform your social media game? Our new tool helps you create stunning content that resonates with your audience and drives real engagement. What's your biggest content challenge? Let us know in the comments! #SocialMediaMarketing #ContentCreation #DigitalMarketing",
        confidence: 92,
        tone: selectedTone,
        reasoning: "This caption includes an engaging question, clear value proposition, and relevant hashtags optimized for engagement."
      },
      {
        id: "2", 
        type: "variation",
        content: "Transform your social presence with content that actually converts 📈 Stop posting into the void and start creating posts that your audience can't ignore. Drop a 👇 if you're ready to level up your content strategy! #ContentStrategy #SocialMedia #Growth",
        confidence: 89,
        tone: selectedTone,
        reasoning: "Uses emotional triggers and clear visual cues to encourage interaction while maintaining brand voice."
      },
      {
        id: "3",
        type: "hashtags",
        content: "#SocialMediaMarketing #ContentCreation #DigitalMarketing #MarketingStrategy #OnlineMarketing #SocialMediaTips #ContentStrategy #DigitalTransformation #MarketingTech #SocialMediaGrowth",
        confidence: 85,
        reasoning: "Mix of high-volume and niche hashtags for optimal reach and engagement balance."
      },
      {
        id: "4",
        type: "improvement",
        content: "Consider adding a personal story or behind-the-scenes element to make the content more relatable. Also, try using more visual elements like emojis or formatting to break up the text and improve readability.",
        confidence: 87,
        reasoning: "Based on current engagement trends, personal storytelling increases connection rates by 34%."
      }
    ];
    
    setSuggestions(mockSuggestions);
    setIsGenerating(false);
  };

  const handlePromptTemplate = async (template: AIPrompt) => {
    const prompt = template.template.replace("{topic}", currentContent || "your content");
    const platformPrompt = selectedPlatforms.length > 0 
      ? prompt.replace("{platform}", selectedPlatforms.join(", "))
      : prompt;
    
    setCustomPrompt(platformPrompt);
    await generateSuggestions(platformPrompt);
    setActiveTab("suggestions");
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) return;
    await generateSuggestions(customPrompt);
  };

  const copySuggestion = (content: string) => {
    navigator.clipboard?.writeText(content);
    // Show toast notification
  };

  const applySuggestion = (suggestion: Suggestion) => {
    onSuggestion(suggestion.content);
    onClose();
  };

  useEffect(() => {
    if (isOpen && currentContent) {
      generateSuggestions();
    }
  }, [isOpen, currentContent, selectedTone, selectedLength]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-slate-900/95 border-slate-700 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            AI Content Assistant
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Get AI-powered suggestions to improve your content and boost engagement
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="suggestions" className="data-[state=active]:bg-slate-700">
                <Brain className="w-4 h-4 mr-2" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="prompts" className="data-[state=active]:bg-slate-700">
                <Lightbulb className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="custom" className="data-[state=active]:bg-slate-700">
                <Wand2 className="w-4 h-4 mr-2" />
                Custom
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-6">
              <TabsContent value="suggestions" className="space-y-4 h-full">
                {/* Settings */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Tone</label>
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white text-sm"
                    >
                      {toneOptions.map(tone => (
                        <option key={tone.id} value={tone.id}>{tone.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Length</label>
                    <select
                      value={selectedLength}
                      onChange={(e) => setSelectedLength(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white text-sm"
                    >
                      {lengthOptions.map(length => (
                        <option key={length.id} value={length.id}>{length.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-slate-300 text-sm">
                    Based on: "{currentContent?.slice(0, 50)}${currentContent?.length > 50 ? '...' : ''}"
                  </div>
                  <Button
                    onClick={() => generateSuggestions()}
                    disabled={isGenerating}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </div>

                {/* Suggestions List */}
                {isGenerating ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-slate-700 rounded"></div>
                              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize border-slate-600 text-slate-300">
                                {suggestion.type}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-slate-400">{suggestion.confidence}% match</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copySuggestion(suggestion.content)}
                                className="text-slate-400 hover:text-white"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-white text-sm leading-relaxed">
                              {suggestion.content}
                            </p>
                            
                            {suggestion.reasoning && (
                              <div className="bg-slate-700/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Brain className="w-4 h-4 text-blue-400" />
                                  <span className="text-blue-400 text-xs font-medium">AI Reasoning</span>
                                </div>
                                <p className="text-slate-300 text-xs">{suggestion.reasoning}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                {suggestion.tone && (
                                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                                    {suggestion.tone}
                                  </Badge>
                                )}
                                {suggestion.platform && (
                                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                                    {suggestion.platform}
                                  </Badge>
                                )}
                              </div>
                              
                              <Button
                                onClick={() => applySuggestion(suggestion)}
                                className="bg-green-500 hover:bg-green-600"
                                size="sm"
                              >
                                Use This
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="prompts" className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-2">Choose a Template</h3>
                  <p className="text-slate-300 text-sm">
                    Select from our curated AI prompts designed for specific content goals
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiPrompts.map((prompt) => {
                    const Icon = prompt.icon;
                    return (
                      <Card 
                        key={prompt.id}
                        className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                        onClick={() => handlePromptTemplate(prompt)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              prompt.category === "creative" ? "bg-purple-500/20 text-purple-400" :
                              prompt.category === "engagement" ? "bg-pink-500/20 text-pink-400" :
                              prompt.category === "optimization" ? "bg-blue-500/20 text-blue-400" :
                              "bg-green-500/20 text-green-400"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{prompt.title}</h4>
                              <Badge 
                                variant="outline" 
                                className="text-xs mt-1 border-slate-600 text-slate-400 capitalize"
                              >
                                {prompt.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-slate-300 text-sm">{prompt.description}</p>
                          
                          <div className="mt-4 pt-3 border-t border-slate-700">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-slate-400 hover:text-white justify-center"
                            >
                              Use Template
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-2">Custom AI Prompt</h3>
                  <p className="text-slate-300 text-sm">
                    Describe exactly what you want the AI to help you with
                  </p>
                </div>

                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe what you want help with... For example: 'Write a humorous Instagram post about coffee that will appeal to millennials and includes trending hashtags'"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[120px] bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-sm">
                      {customPrompt.length}/500 characters
                    </div>
                    
                    <Button
                      onClick={handleCustomPrompt}
                      disabled={!customPrompt.trim() || isGenerating}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Tips */}
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        Be specific about your target audience and platform
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        Mention the tone and style you want (professional, casual, funny)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        Include any specific requirements (hashtags, mentions, CTAs)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        Reference current content to get variations or improvements
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}