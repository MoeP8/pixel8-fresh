import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, RefreshCw } from "lucide-react";
import { useBrandManagement } from "@/hooks/useBrandManagement";
import { useToast } from "@/hooks/use-toast";

interface AICaptionProps {
  clientId: string;
  pillar?: string;
  platform: string;
  onGenerate: (caption: string) => void;
}

export function AICaption({ clientId, pillar, platform, onGenerate }: AICaptionProps) {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    brandVoiceProfiles,
    contentPillars,
    complianceNotes,
    loading: brandLoading
  } = useBrandManagement(clientId);

  const selectedPillar = contentPillars.find(p => p.id === pillar);

  const generateCaptions = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for caption generation",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Build context from brand data
      const voiceContext = brandVoiceProfiles.map(profile => {
        const traitLabels = {
          formal_casual: profile.trait_value <= 2 ? 'formal' : 'casual',
          serious_playful: profile.trait_value <= 2 ? 'serious' : 'playful',
          authoritative_friendly: profile.trait_value <= 2 ? 'authoritative' : 'friendly',
          professional_conversational: profile.trait_value <= 2 ? 'professional' : 'conversational',
          corporate_personal: profile.trait_value <= 2 ? 'corporate' : 'personal'
        };
        return `${profile.trait_type}: ${traitLabels[profile.trait_type] || 'balanced'}`;
      }).join(', ');

      const pillarContext = selectedPillar ? 
        `Content pillar: ${selectedPillar.name} (${selectedPillar.pillar_type}). ${selectedPillar.description || ''}` : '';

      const complianceContext = complianceNotes
        .filter(note => note.is_active)
        .map(note => `Avoid: ${note.prohibited_terms.join(', ')}`)
        .join('. ');

      // Simulate AI caption generation (in real implementation, this would call OpenAI API)
      const mockCaptions = [
        generateMockCaption(prompt, voiceContext, platform, 1),
        generateMockCaption(prompt, voiceContext, platform, 2),
        generateMockCaption(prompt, voiceContext, platform, 3)
      ];

      setSuggestions(mockCaptions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate captions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockCaption = (prompt: string, voice: string, platform: string, variant: number): string => {
    const isFormal = voice.includes('formal') || voice.includes('professional');
    const isPlayful = voice.includes('playful') || voice.includes('casual');
    
    const templates = {
      1: isFormal ? 
        `${prompt}. Our innovative approach delivers exceptional results for our clients. Experience the difference with professional excellence.` :
        `${prompt} ✨ We're so excited to share this with you! Let us know what you think in the comments below 👇`,
      2: isPlayful ?
        `Ready for something amazing? ${prompt}! 🔥 This is exactly what we've been working on and we can't wait for you to try it!` :
        `${prompt}. This represents our commitment to delivering outstanding solutions that meet your business needs.`,
      3: isFormal ?
        `${prompt}. Through strategic planning and expert execution, we continue to set industry standards.` :
        `${prompt} 💫 Tag someone who needs to see this! We love connecting with our community ❤️`
    };

    return templates[variant as keyof typeof templates] || templates[1];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Caption copied to clipboard"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Caption Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe what you want to post about..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateCaptions()}
          />
          <Button 
            onClick={generateCaptions} 
            disabled={loading || brandLoading}
            size="sm"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </div>

        {/* Brand Context Display */}
        <div className="flex flex-wrap gap-2">
          {selectedPillar && (
            <Badge variant="secondary">
              {selectedPillar.name}
            </Badge>
          )}
          <Badge variant="outline">
            {platform.replace('_', ' ')}
          </Badge>
          {brandVoiceProfiles.length > 0 && (
            <Badge variant="outline">
              Brand Voice Applied
            </Badge>
          )}
        </div>

        {/* Generated Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Suggestions:</h4>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <p className="text-sm">{suggestion}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(suggestion)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onGenerate(suggestion)}
                  >
                    Use This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}