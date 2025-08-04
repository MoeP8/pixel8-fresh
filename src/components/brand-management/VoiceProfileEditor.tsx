import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Mic, Save, RotateCcw } from 'lucide-react';
import type { BrandVoiceProfile, VoiceTrait } from '@/types/brand-management';
import { useToast } from '@/hooks/use-toast';

interface VoiceProfileEditorProps {
  voiceProfiles: BrandVoiceProfile[];
  onUpdateVoiceProfile: (trait: VoiceTrait, value: number, description?: string, examples?: any) => void;
  clientId: string;
}

const voiceTraitConfig = {
  formal_casual: {
    label: 'Communication Style',
    leftLabel: 'Formal',
    rightLabel: 'Casual',
    description: 'How formal or casual should the brand voice be?'
  },
  serious_playful: {
    label: 'Tone',
    leftLabel: 'Serious',
    rightLabel: 'Playful',
    description: 'What emotional tone should the brand convey?'
  },
  authoritative_friendly: {
    label: 'Authority',
    leftLabel: 'Authoritative',
    rightLabel: 'Friendly',
    description: 'How should the brand position itself in terms of expertise?'
  },
  professional_conversational: {
    label: 'Approach',
    leftLabel: 'Professional',
    rightLabel: 'Conversational',
    description: 'What approach should the brand take when communicating?'
  },
  corporate_personal: {
    label: 'Personality',
    leftLabel: 'Corporate',
    rightLabel: 'Personal',
    description: 'How personal or corporate should the brand feel?'
  }
};

export function VoiceProfileEditor({ 
  voiceProfiles, 
  onUpdateVoiceProfile, 
  clientId 
}: VoiceProfileEditorProps) {
  const [profiles, setProfiles] = useState<Record<VoiceTrait, { value: number; description: string; examples: string[] }>>({
    formal_casual: { value: 3, description: '', examples: [] },
    serious_playful: { value: 3, description: '', examples: [] },
    authoritative_friendly: { value: 3, description: '', examples: [] },
    professional_conversational: { value: 3, description: '', examples: [] },
    corporate_personal: { value: 3, description: '', examples: [] }
  });
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize profiles from database data
    const updatedProfiles = { ...profiles };
    
    voiceProfiles.forEach(profile => {
      updatedProfiles[profile.trait_type] = {
        value: profile.trait_value,
        description: profile.description || '',
        examples: Array.isArray(profile.examples) ? profile.examples : []
      };
    });
    
    setProfiles(updatedProfiles);
  }, [voiceProfiles]);

  const handleSliderChange = (trait: VoiceTrait, value: number[]) => {
    setProfiles(prev => ({
      ...prev,
      [trait]: {
        ...prev[trait],
        value: value[0]
      }
    }));
    setHasChanges(true);
  };

  const handleDescriptionChange = (trait: VoiceTrait, description: string) => {
    setProfiles(prev => ({
      ...prev,
      [trait]: {
        ...prev[trait],
        description
      }
    }));
    setHasChanges(true);
  };

  const handleExamplesChange = (trait: VoiceTrait, examples: string) => {
    const exampleArray = examples.split('\n').filter(Boolean);
    setProfiles(prev => ({
      ...prev,
      [trait]: {
        ...prev[trait],
        examples: exampleArray
      }
    }));
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      // Save all voice profiles
      for (const [trait, profile] of Object.entries(profiles)) {
        await onUpdateVoiceProfile(
          trait as VoiceTrait,
          profile.value,
          profile.description,
          profile.examples
        );
      }
      
      setHasChanges(false);
      toast({
        title: 'Voice Profile Saved',
        description: 'Brand voice profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save voice profile changes.',
        variant: 'destructive',
      });
    }
  };

  const resetChanges = () => {
    // Reset to original database values
    const resetProfiles = { ...profiles };
    
    voiceProfiles.forEach(profile => {
      resetProfiles[profile.trait_type] = {
        value: profile.trait_value,
        description: profile.description || '',
        examples: Array.isArray(profile.examples) ? profile.examples : []
      };
    });
    
    setProfiles(resetProfiles);
    setHasChanges(false);
  };

  const getSliderColor = (value: number) => {
    if (value <= 2) return 'text-blue-600';
    if (value >= 4) return 'text-purple-600';
    return 'text-gray-600';
  };

  const getValueDescription = (trait: VoiceTrait, value: number) => {
    const config = voiceTraitConfig[trait];
    if (value <= 2) return `More ${config.leftLabel}`;
    if (value >= 4) return `More ${config.rightLabel}`;
    return 'Balanced';
  };

  return (
    <GlassCard className="p-6" variant="subtle" hover>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-foreground">Brand Voice Profile</h3>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button variant="outline" onClick={resetChanges}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            <Button onClick={saveChanges} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {Object.entries(voiceTraitConfig).map(([trait, config]) => {
          const traitKey = trait as VoiceTrait;
          const profile = profiles[traitKey];
          
          return (
            <div key={trait} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{config.label}</h4>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
                <Badge variant="outline" className={getSliderColor(profile.value)}>
                  {getValueDescription(traitKey, profile.value)}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="px-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{config.leftLabel}</span>
                    <span>{config.rightLabel}</span>
                  </div>
                  <Slider
                    value={[profile.value]}
                    onValueChange={(value) => handleSliderChange(traitKey, value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`description-${trait}`}>Context & Guidelines</Label>
                    <Textarea
                      id={`description-${trait}`}
                      value={profile.description}
                      onChange={(e) => handleDescriptionChange(traitKey, e.target.value)}
                      placeholder="Explain when and how to use this tone..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`examples-${trait}`}>Example Phrases</Label>
                    <Textarea
                      id={`examples-${trait}`}
                      value={profile.examples.join('\n')}
                      onChange={(e) => handleExamplesChange(traitKey, e.target.value)}
                      placeholder="Add example phrases (one per line)..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Voice Profile Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {Object.entries(voiceTraitConfig).map(([trait, config]) => {
              const traitKey = trait as VoiceTrait;
              const value = profiles[traitKey].value;
              
              return (
                <div key={trait} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{config.label}:</span>
                  <Badge variant="outline" className={`${getSliderColor(value)} text-xs`}>
                    {getValueDescription(traitKey, value)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}