import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Wand2, Upload, Save, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBrandManagement } from "@/hooks/useBrandManagement";
import { PlatformPreview } from "./PlatformPreview";
import { AICaption } from "./AICaption";
import { BrandCompliance } from "./BrandCompliance";
import { HashtagSuggestions } from "./HashtagSuggestions";
import { MediaUploader } from "./MediaUploader";
import { useApprovals } from "@/hooks/useApprovals";
import { useToast } from "@/hooks/use-toast";

interface SmartComposerProps {
  clientId: string;
}

export function SmartComposer({ clientId }: SmartComposerProps) {
  const { toast } = useToast();
  const { createApproval } = useApprovals();
  
  const [content, setContent] = useState({
    caption: "",
    hashtags: "",
    platform: "instagram_business" as const,
    media: [] as File[],
    scheduled_at: "",
  });

  const [brandScore, setBrandScore] = useState(0);
  const [complianceIssues, setComplianceIssues] = useState<string[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<string>("");

  const {
    brandVoiceProfiles,
    contentPillars,
    hashtagStrategies,
    complianceNotes,
    brandColors,
    loading
  } = useBrandManagement(clientId);

  const platforms = [
    { id: "instagram_business", name: "Instagram", maxChars: 2200, ratio: "1:1" },
    { id: "tiktok_business", name: "TikTok", maxChars: 2200, ratio: "9:16" },
    { id: "linkedin_company", name: "LinkedIn", maxChars: 3000, ratio: "16:9" },
    { id: "facebook_pages", name: "Facebook", maxChars: 63206, ratio: "16:9" },
    { id: "twitter", name: "Twitter/X", maxChars: 280, ratio: "16:9" },
    { id: "youtube", name: "YouTube", maxChars: 5000, ratio: "16:9" },
  ];

  const currentPlatform = platforms.find(p => p.id === content.platform);
  const charactersUsed = content.caption.length;
  const isOverLimit = charactersUsed > (currentPlatform?.maxChars || 0);

  // Calculate brand voice consistency score
  useEffect(() => {
    if (content.caption && brandVoiceProfiles.length > 0) {
      // Simple scoring based on content analysis
      let score = 70; // Base score
      
      // Check for brand voice alignment
      const caption = content.caption.toLowerCase();
      
      // Adjust score based on voice profiles
      brandVoiceProfiles.forEach(profile => {
        if (profile.trait_type === 'formal_casual') {
          const formalWords = ['professional', 'expertise', 'solution', 'innovative'];
          const casualWords = ['awesome', 'amazing', 'love', 'fun'];
          const hasFormal = formalWords.some(word => caption.includes(word));
          const hasCasual = casualWords.some(word => caption.includes(word));
          
          if (profile.trait_value <= 2 && hasFormal) score += 10;
          if (profile.trait_value >= 4 && hasCasual) score += 10;
        }
      });

      setBrandScore(Math.min(score, 100));
    }
  }, [content.caption, brandVoiceProfiles]);

  // Check compliance
  useEffect(() => {
    const issues: string[] = [];
    
    complianceNotes.forEach(note => {
      if (note.is_active) {
        note.prohibited_terms.forEach(term => {
          if (content.caption.toLowerCase().includes(term.toLowerCase())) {
            issues.push(`Prohibited term detected: "${term}"`);
          }
        });
        
        note.required_disclaimers.forEach(disclaimer => {
          if (!content.caption.includes(disclaimer)) {
            issues.push(`Missing required disclaimer: "${disclaimer}"`);
          }
        });
      }
    });
    
    setComplianceIssues(issues);
  }, [content.caption, complianceNotes]);

  const handleSaveDraft = () => {
    console.log("Saving draft:", { ...content, pillar: selectedPillar, brandScore });
    toast({
      title: "Draft saved",
      description: "Your content has been saved as a draft.",
    });
  };

  const handleSchedule = () => {
    if (complianceIssues.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot schedule post",
        description: "Please resolve brand compliance issues before scheduling.",
      });
      return;
    }
    
    console.log("Scheduling post:", { ...content, pillar: selectedPillar });
    toast({
      title: "Post scheduled",
      description: "Your content has been scheduled successfully.",
    });
  };

  const handleSendForApproval = async () => {
    try {
      await createApproval({
        client_id: clientId,
        created_by: '', // Will be set in the hook
        content_type: 'social_post',
        title: `${content.platform} Post - ${new Date().toLocaleDateString()}`,
        description: content.caption.substring(0, 100) + (content.caption.length > 100 ? '...' : ''),
        content_data: {
          caption: content.caption,
          hashtags: content.hashtags,
          platform: content.platform,
          media: content.media,
          scheduled_at: content.scheduled_at,
          pillar: selectedPillar
        },
        platform: content.platform,
        scheduled_date: content.scheduled_at || null,
        brand_compliance_score: brandScore,
        brand_issues: complianceIssues,
        approval_status: 'pending',
        priority: 'medium',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
      });
      
      // Reset form after successful submission
      setContent({
        caption: "",
        hashtags: "",
        platform: "instagram_business" as const,
        media: [] as File[],
        scheduled_at: "",
      });
      setSelectedPillar("");
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Composer */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Smart Composer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Platform Selection */}
            <Tabs value={content.platform} onValueChange={(value: any) => setContent(prev => ({ ...prev, platform: value }))}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6">
                {platforms.map(platform => (
                  <TabsTrigger key={platform.id} value={platform.id} className="text-xs">
                    {platform.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Content Pillar Selection */}
            <div>
              <Label>Content Pillar</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedPillar}
                onChange={(e) => setSelectedPillar(e.target.value)}
              >
                <option value="">Select content pillar...</option>
                {contentPillars.filter(p => p.is_active).map(pillar => (
                  <option key={pillar.id} value={pillar.id}>
                    {pillar.name} ({pillar.pillar_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Caption Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Caption</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={isOverLimit ? "destructive" : "secondary"}>
                    {charactersUsed}/{currentPlatform?.maxChars}
                  </Badge>
                  <Badge variant={brandScore >= 80 ? "default" : brandScore >= 60 ? "secondary" : "destructive"}>
                    Brand Score: {brandScore}%
                  </Badge>
                </div>
              </div>
              <Textarea
                placeholder="Write your caption..."
                value={content.caption}
                onChange={(e) => setContent(prev => ({ ...prev, caption: e.target.value }))}
                className={`min-h-32 ${isOverLimit ? 'border-destructive' : ''}`}
              />
              {isOverLimit && (
                <Alert className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Caption exceeds {currentPlatform?.name} character limit
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* AI Caption Generator */}
            <AICaption 
              clientId={clientId}
              pillar={selectedPillar}
              platform={content.platform}
              onGenerate={(caption) => setContent(prev => ({ ...prev, caption }))}
            />

            {/* Hashtag Input */}
            <div>
              <Label>Hashtags</Label>
              <Input
                placeholder="Add hashtags..."
                value={content.hashtags}
                onChange={(e) => setContent(prev => ({ ...prev, hashtags: e.target.value }))}
              />
            </div>

            {/* Hashtag Suggestions */}
            <HashtagSuggestions
              clientId={clientId}
              platform={content.platform}
              onSuggest={(hashtags) => setContent(prev => ({ ...prev, hashtags: prev.hashtags + " " + hashtags }))}
            />

            {/* Media Upload */}
            <MediaUploader
              onUpload={(files) => setContent(prev => ({ ...prev, media: files }))}
              brandColors={brandColors}
            />

            {/* Schedule */}
            <div>
              <Label>Schedule (Optional)</Label>
              <Input
                type="datetime-local"
                value={content.scheduled_at}
                onChange={(e) => setContent(prev => ({ ...prev, scheduled_at: e.target.value }))}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                variant="outline"
                onClick={handleSendForApproval}
                disabled={!content.caption.trim()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Send for Approval
              </Button>
              <Button onClick={handleSchedule} disabled={complianceIssues.length > 0}>
                <Send className="h-4 w-4 mr-2" />
                {content.scheduled_at ? 'Schedule' : 'Post Now'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Brand Compliance */}
        <BrandCompliance issues={complianceIssues} />
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <PlatformPreview
          platform={content.platform}
          caption={content.caption}
          hashtags={content.hashtags}
          media={content.media}
        />
      </div>
    </div>
  );
}