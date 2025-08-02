import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Plus, X, Save, Palette, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BrandDefaultsSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [brandColors, setBrandColors] = useState([
    { id: 1, name: "Primary", hex: "#0C0A3E", usage: "Headers, CTAs" },
    { id: 2, name: "Secondary", hex: "#FF1254", usage: "Accents, Links" },
    { id: 3, name: "Background", hex: "#FDFDFD", usage: "Backgrounds" }
  ]);
  const [contentPillars, setContentPillars] = useState([
    "Educational Content",
    "Behind the Scenes", 
    "Customer Stories",
    "Product Features"
  ]);
  const [hashtagSets, setHashtagSets] = useState([
    { industry: "Technology", hashtags: ["#tech", "#innovation", "#software"] },
    { industry: "Retail", hashtags: ["#retail", "#shopping", "#fashion"] }
  ]);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Brand defaults updated",
      description: "Your brand default settings have been saved successfully.",
    });
  };

  const addBrandColor = () => {
    const newColor = {
      id: Date.now(),
      name: "New Color",
      hex: "#000000",
      usage: ""
    };
    setBrandColors([...brandColors, newColor]);
  };

  const removeBrandColor = (id: number) => {
    setBrandColors(brandColors.filter(color => color.id !== id));
  };

  const addContentPillar = () => {
    setContentPillars([...contentPillars, "New Pillar"]);
  };

  const removeContentPillar = (index: number) => {
    setContentPillars(contentPillars.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Brand Defaults</h1>
        <p className="text-muted-foreground mt-1">
          Set default brand elements and templates for new clients
        </p>
      </div>

      {/* Agency Brand Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Agency Brand Settings
          </CardTitle>
          <CardDescription>
            Configure your agency's brand elements and visual identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agency Logo */}
          <div className="space-y-3">
            <Label>Agency Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6 text-muted-foreground" />
              </div>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Logo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG or SVG recommended. Will be used in client reports and proposals.
            </p>
          </div>

          <Separator />

          {/* Brand Colors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Brand Colors</Label>
              <Button variant="outline" size="sm" onClick={addBrandColor} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Color
              </Button>
            </div>
            <div className="space-y-3">
              {brandColors.map((color) => (
                <div key={color.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <div 
                    className="w-10 h-10 rounded-lg border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input 
                      placeholder="Color name" 
                      value={color.name}
                      onChange={(e) => {
                        setBrandColors(brandColors.map(c => 
                          c.id === color.id ? { ...c, name: e.target.value } : c
                        ));
                      }}
                    />
                    <Input 
                      placeholder="#000000" 
                      value={color.hex}
                      onChange={(e) => {
                        setBrandColors(brandColors.map(c => 
                          c.id === color.id ? { ...c, hex: e.target.value } : c
                        ));
                      }}
                    />
                    <Input 
                      placeholder="Usage notes" 
                      value={color.usage}
                      onChange={(e) => {
                        setBrandColors(brandColors.map(c => 
                          c.id === color.id ? { ...c, usage: e.target.value } : c
                        ));
                      }}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeBrandColor(color.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Typography */}
          <div className="space-y-4">
            <Label className="text-base">Default Typography</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryFont">Primary Font</Label>
                <Input 
                  id="primaryFont" 
                  placeholder="e.g., Inter, Roboto"
                  defaultValue="Inter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryFont">Secondary Font</Label>
                <Input 
                  id="secondaryFont" 
                  placeholder="e.g., Georgia, Times"
                  defaultValue="Georgia"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Onboarding Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Client Onboarding Defaults
          </CardTitle>
          <CardDescription>
            Default templates and configurations for new client setups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Content Pillars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Default Content Pillars</Label>
              <Button variant="outline" size="sm" onClick={addContentPillar} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Pillar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {contentPillars.map((pillar, index) => (
                <Badge key={index} variant="secondary" className="gap-2 py-2 px-3">
                  <span>{pillar}</span>
                  <button 
                    onClick={() => removeContentPillar(index)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Standard Hashtag Sets */}
          <div className="space-y-4">
            <Label className="text-base">Standard Hashtag Sets by Industry</Label>
            <div className="space-y-3">
              {hashtagSets.map((set, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Input 
                      value={set.industry}
                      onChange={(e) => {
                        const newSets = [...hashtagSets];
                        newSets[index].industry = e.target.value;
                        setHashtagSets(newSets);
                      }}
                      className="font-medium max-w-xs"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setHashtagSets(hashtagSets.filter((_, i) => i !== index))}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Enter hashtags separated by commas..."
                    value={set.hashtags.join(", ")}
                    onChange={(e) => {
                      const newSets = [...hashtagSets];
                      newSets[index].hashtags = e.target.value.split(", ").filter(tag => tag.trim());
                      setHashtagSets(newSets);
                    }}
                    className="text-sm"
                  />
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => setHashtagSets([...hashtagSets, { industry: "New Industry", hashtags: [] }])}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Industry Set
              </Button>
            </div>
          </div>

          <Separator />

          {/* Approval Workflow Template */}
          <div className="space-y-4">
            <Label className="text-base">Default Approval Workflow</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Input 
                  placeholder="Template name"
                  defaultValue="Standard Client Workflow"
                  className="max-w-xs"
                />
                <Badge variant="outline">2 Approvers Required</Badge>
              </div>
              <Textarea
                placeholder="Describe the default approval process..."
                defaultValue="Content requires approval from account manager and client before publishing. Auto-escalation after 24 hours."
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Defaults"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}