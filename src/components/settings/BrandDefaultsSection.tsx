import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Plus, X, Save, Palette, Image, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationError {
  field: string;
  message: string;
}

interface BrandColor {
  id: number;
  name: string;
  hex: string;
  usage: string;
}

interface HashtagSet {
  industry: string;
  hashtags: string[];
}

export function BrandDefaultsSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError>>({});
  const [brandColors, setBrandColors] = useState<BrandColor[]>([
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
  const [hashtagSets, setHashtagSets] = useState<HashtagSet[]>([
    { industry: "Technology", hashtags: ["#tech", "#innovation", "#software"] },
    { industry: "Retail", hashtags: ["#retail", "#shopping", "#fashion"] }
  ]);
  const [primaryFont, setPrimaryFont] = useState("Inter");
  const [secondaryFont, setSecondaryFont] = useState("Georgia");

  // Validation functions
  const validateHexColor = (hex: string): boolean => {
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    return hexRegex.test(hex);
  };

  const validateColorName = (name: string, colorId: number): ValidationError | null => {
    if (!name || name.trim() === "") {
      return { field: `color-name-${colorId}`, message: "Color name is required" };
    }
    if (name.length > 50) {
      return { field: `color-name-${colorId}`, message: "Color name must be less than 50 characters" };
    }
    // Check for duplicate color names
    const duplicate = brandColors.find(c => 
      c.id !== colorId && c.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      return { field: `color-name-${colorId}`, message: "A color with this name already exists" };
    }
    return null;
  };

  const validateFont = (font: string, field: string): ValidationError | null => {
    if (!font || font.trim() === "") {
      return { field, message: "Font name is required" };
    }
    if (font.length > 100) {
      return { field, message: "Font name must be less than 100 characters" };
    }
    if (!/^[a-zA-Z\s,'-]+$/.test(font)) {
      return { field, message: "Font name can only contain letters, spaces, commas, hyphens, and apostrophes" };
    }
    return null;
  };

  const validateHashtag = (hashtag: string): boolean => {
    const hashtagRegex = /^#[a-zA-Z0-9_]+$/;
    return hashtagRegex.test(hashtag);
  };

  const validateContentPillar = (pillar: string): boolean => {
    if (!pillar || pillar.trim() === "") return false;
    if (pillar.length > 100) return false;
    // Check for duplicates
    const count = contentPillars.filter(p => 
      p.toLowerCase() === pillar.toLowerCase()
    ).length;
    return count <= 1;
  };

  const clearValidationError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleColorChange = (colorId: number, field: keyof BrandColor, value: string) => {
    setBrandColors(brandColors.map(c => 
      c.id === colorId ? { ...c, [field]: value } : c
    ));

    // Validate on change
    if (field === 'name') {
      const error = validateColorName(value, colorId);
      if (error) {
        setValidationErrors(prev => ({ ...prev, [`color-name-${colorId}`]: error }));
      } else {
        clearValidationError(`color-name-${colorId}`);
      }
    } else if (field === 'hex') {
      if (!validateHexColor(value) && value.trim() !== "") {
        setValidationErrors(prev => ({ 
          ...prev, 
          [`color-hex-${colorId}`]: { 
            field: `color-hex-${colorId}`, 
            message: "Invalid hex color format (e.g., #FF0000)" 
          }
        }));
      } else {
        clearValidationError(`color-hex-${colorId}`);
      }
    }
  };

  const handleFontChange = (field: 'primary' | 'secondary', value: string) => {
    if (field === 'primary') {
      setPrimaryFont(value);
    } else {
      setSecondaryFont(value);
    }

    const error = validateFont(value, field + 'Font');
    if (error) {
      setValidationErrors(prev => ({ ...prev, [field + 'Font']: error }));
    } else {
      clearValidationError(field + 'Font');
    }
  };

  const handleLogoUpload = async () => {
    setIsUploadingLogo(true);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Logo uploaded",
        description: "Your agency logo has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, ValidationError> = {};
    
    // Validate all colors
    brandColors.forEach(color => {
      const nameError = validateColorName(color.name, color.id);
      if (nameError) {
        errors[`color-name-${color.id}`] = nameError;
      }
      if (!validateHexColor(color.hex)) {
        errors[`color-hex-${color.id}`] = {
          field: `color-hex-${color.id}`,
          message: "Invalid hex color format"
        };
      }
    });

    // Validate fonts
    const primaryFontError = validateFont(primaryFont, 'primaryFont');
    if (primaryFontError) {
      errors.primaryFont = primaryFontError;
    }

    const secondaryFontError = validateFont(secondaryFont, 'secondaryFont');
    if (secondaryFontError) {
      errors.secondaryFont = secondaryFontError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateAllFields()) {
      toast({
        title: "Validation errors",
        description: "Please fix the errors below before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Brand defaults updated",
        description: "Your brand default settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save brand defaults. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleLogoUpload}
                disabled={isUploadingLogo}
              >
                {isUploadingLogo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
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
                    <div className="space-y-1">
                      <Input 
                        placeholder="Color name" 
                        value={color.name}
                        onChange={(e) => handleColorChange(color.id, 'name', e.target.value)}
                        className={validationErrors[`color-name-${color.id}`] ? 'border-destructive focus-visible:ring-destructive' : ''}
                      />
                      {validationErrors[`color-name-${color.id}`] && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {validationErrors[`color-name-${color.id}`].message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Input 
                        placeholder="#000000" 
                        value={color.hex}
                        onChange={(e) => handleColorChange(color.id, 'hex', e.target.value)}
                        className={validationErrors[`color-hex-${color.id}`] ? 'border-destructive focus-visible:ring-destructive' : ''}
                      />
                      {validationErrors[`color-hex-${color.id}`] && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {validationErrors[`color-hex-${color.id}`].message}
                        </p>
                      )}
                    </div>
                    <Input 
                      placeholder="Usage notes" 
                      value={color.usage}
                      onChange={(e) => handleColorChange(color.id, 'usage', e.target.value)}
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
                <Label htmlFor="primaryFont">Primary Font *</Label>
                <Input 
                  id="primaryFont" 
                  placeholder="e.g., Inter, Roboto"
                  value={primaryFont}
                  onChange={(e) => handleFontChange('primary', e.target.value)}
                  className={validationErrors.primaryFont ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {validationErrors.primaryFont && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{validationErrors.primaryFont.message}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryFont">Secondary Font *</Label>
                <Input 
                  id="secondaryFont" 
                  placeholder="e.g., Georgia, Times"
                  value={secondaryFont}
                  onChange={(e) => handleFontChange('secondary', e.target.value)}
                  className={validationErrors.secondaryFont ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {validationErrors.secondaryFont && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{validationErrors.secondaryFont.message}</span>
                  </div>
                )}
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
            <Button 
              onClick={handleSave} 
              disabled={isLoading || Object.keys(validationErrors).length > 0}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? "Saving..." : "Save Defaults"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}