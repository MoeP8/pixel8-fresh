import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Type, ExternalLink } from "lucide-react";
import { BrandTypography } from "@/types/brand-management";
import { toast } from "sonner";

interface BrandTypographyProps {
  typography: BrandTypography[];
  onAdd: (typography: Omit<BrandTypography, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<BrandTypography>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  clientId: string;
}

export const BrandTypographyManager = ({ typography, onAdd, onUpdate, onDelete, clientId }: BrandTypographyProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTypography, setNewTypography] = useState({
    name: '',
    font_family: '',
    font_weight: '',
    font_size_px: '',
    line_height: '',
    letter_spacing: '',
    usage_context: '',
    web_font_url: '',
    fallback_fonts: '',
    usage_notes: '',
    sort_order: 0
  });

  const handleAdd = async () => {
    if (!newTypography.name || !newTypography.font_family) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await onAdd({
        client_id: clientId,
        name: newTypography.name,
        font_family: newTypography.font_family,
        font_weight: newTypography.font_weight || undefined,
        font_size_px: newTypography.font_size_px ? parseInt(newTypography.font_size_px) : undefined,
        line_height: newTypography.line_height ? parseFloat(newTypography.line_height) : undefined,
        letter_spacing: newTypography.letter_spacing ? parseFloat(newTypography.letter_spacing) : undefined,
        usage_context: newTypography.usage_context || undefined,
        web_font_url: newTypography.web_font_url || undefined,
        fallback_fonts: newTypography.fallback_fonts ? newTypography.fallback_fonts.split(',').map(f => f.trim()) : [],
        usage_notes: newTypography.usage_notes || undefined,
        sort_order: newTypography.sort_order
      });
      
      setNewTypography({
        name: '',
        font_family: '',
        font_weight: '',
        font_size_px: '',
        line_height: '',
        letter_spacing: '',
        usage_context: '',
        web_font_url: '',
        fallback_fonts: '',
        usage_notes: '',
        sort_order: 0
      });
      setIsAdding(false);
      toast.success("Typography added successfully");
    } catch (error) {
      toast.error("Failed to add typography");
    }
  };

  const handleUpdate = async (id: string, updates: Partial<BrandTypography>) => {
    try {
      await onUpdate(id, updates);
      setEditingId(null);
      toast.success("Typography updated successfully");
    } catch (error) {
      toast.error("Failed to update typography");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Typography deleted successfully");
    } catch (error) {
      toast.error("Failed to delete typography");
    }
  };

  const fontWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
  const usageContexts = ['Headings', 'Body Text', 'Captions', 'Buttons', 'Navigation', 'Quotes', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Typography Specifications</h3>
          <p className="text-sm text-muted-foreground">
            Define font families, weights, and usage guidelines
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Typography
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Add New Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newTypography.name}
                  onChange={(e) => setNewTypography({ ...newTypography, name: e.target.value })}
                  placeholder="e.g., Primary Heading"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font_family">Font Family *</Label>
                <Input
                  id="font_family"
                  value={newTypography.font_family}
                  onChange={(e) => setNewTypography({ ...newTypography, font_family: e.target.value })}
                  placeholder="e.g., Inter, Arial"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font_weight">Font Weight</Label>
                <Select value={newTypography.font_weight} onValueChange={(value) => setNewTypography({ ...newTypography, font_weight: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight} value={weight}>{weight}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font_size">Font Size (px)</Label>
                <Input
                  id="font_size"
                  type="number"
                  value={newTypography.font_size_px}
                  onChange={(e) => setNewTypography({ ...newTypography, font_size_px: e.target.value })}
                  placeholder="16"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line_height">Line Height</Label>
                <Input
                  id="line_height"
                  type="number"
                  step="0.1"
                  value={newTypography.line_height}
                  onChange={(e) => setNewTypography({ ...newTypography, line_height: e.target.value })}
                  placeholder="1.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="letter_spacing">Letter Spacing</Label>
                <Input
                  id="letter_spacing"
                  type="number"
                  step="0.01"
                  value={newTypography.letter_spacing}
                  onChange={(e) => setNewTypography({ ...newTypography, letter_spacing: e.target.value })}
                  placeholder="0.02"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usage_context">Usage Context</Label>
                <Select value={newTypography.usage_context} onValueChange={(value) => setNewTypography({ ...newTypography, usage_context: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select context" />
                  </SelectTrigger>
                  <SelectContent>
                    {usageContexts.map((context) => (
                      <SelectItem key={context} value={context}>{context}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="web_font_url">Web Font URL</Label>
                <Input
                  id="web_font_url"
                  value={newTypography.web_font_url}
                  onChange={(e) => setNewTypography({ ...newTypography, web_font_url: e.target.value })}
                  placeholder="https://fonts.googleapis.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallback_fonts">Fallback Fonts (comma-separated)</Label>
              <Input
                id="fallback_fonts"
                value={newTypography.fallback_fonts}
                onChange={(e) => setNewTypography({ ...newTypography, fallback_fonts: e.target.value })}
                placeholder="Arial, sans-serif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage_notes">Usage Notes</Label>
              <Textarea
                id="usage_notes"
                value={newTypography.usage_notes}
                onChange={(e) => setNewTypography({ ...newTypography, usage_notes: e.target.value })}
                placeholder="Guidelines for when and how to use this typography..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Typography</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {typography.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Type className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Typography Defined</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by adding your brand's typography specifications
              </p>
              <Button onClick={() => setIsAdding(true)}>Add First Typography</Button>
            </CardContent>
          </Card>
        ) : (
          typography
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((typo) => (
              <Card key={typo.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span 
                          style={{ 
                            fontFamily: typo.font_family,
                            fontWeight: typo.font_weight || 'normal',
                            fontSize: typo.font_size_px ? `${typo.font_size_px}px` : undefined
                          }}
                        >
                          {typo.name}
                        </span>
                        {typo.usage_context && <Badge variant="secondary">{typo.usage_context}</Badge>}
                      </CardTitle>
                      <CardDescription>
                        {typo.font_family}
                        {typo.font_weight && ` • Weight: ${typo.font_weight}`}
                        {typo.font_size_px && ` • Size: ${typo.font_size_px}px`}
                        {typo.line_height && ` • Line Height: ${typo.line_height}`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {typo.web_font_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={typo.web_font_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(typo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <strong>Preview:</strong>
                    </div>
                    <div 
                      className="p-4 border rounded"
                      style={{ 
                        fontFamily: typo.font_family,
                        fontWeight: typo.font_weight || 'normal',
                        fontSize: typo.font_size_px ? `${typo.font_size_px}px` : '16px',
                        lineHeight: typo.line_height || 'normal',
                        letterSpacing: typo.letter_spacing ? `${typo.letter_spacing}em` : 'normal'
                      }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </div>
                    {typo.usage_notes && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Usage Notes:</strong> {typo.usage_notes}
                      </div>
                    )}
                    {typo.fallback_fonts && typo.fallback_fonts.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Fallback Fonts:</strong> {typo.fallback_fonts.join(', ')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};