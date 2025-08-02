import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Edit2, Trash2, Palette } from 'lucide-react';
import type { BrandColor } from '@/types/brand-management';
import { useToast } from '@/hooks/use-toast';

interface BrandColorPaletteProps {
  colors: BrandColor[];
  onAddColor: (color: Omit<BrandColor, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateColor: (id: string, updates: Partial<BrandColor>) => void;
  onDeleteColor: (id: string) => void;
  clientId: string;
}

export function BrandColorPalette({ 
  colors, 
  onAddColor, 
  onUpdateColor, 
  onDeleteColor, 
  clientId 
}: BrandColorPaletteProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<BrandColor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hex_code: '#000000',
    usage_notes: '',
    is_primary: false,
    sort_order: 0
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      hex_code: '#000000',
      usage_notes: '',
      is_primary: false,
      sort_order: 0
    });
    setEditingColor(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingColor) {
      onUpdateColor(editingColor.id, formData);
    } else {
      onAddColor({
        ...formData,
        client_id: clientId
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (color: BrandColor) => {
    setEditingColor(color);
    setFormData({
      name: color.name,
      hex_code: color.hex_code,
      usage_notes: color.usage_notes || '',
      is_primary: color.is_primary,
      sort_order: color.sort_order
    });
    setIsDialogOpen(true);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: 'Copied!',
      description: `Color ${hex} copied to clipboard.`,
    });
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <GlassCard className="p-6" variant="subtle" hover>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-foreground">Brand Colors</h3>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Color
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingColor ? 'Edit Color' : 'Add Brand Color'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color-name">Color Name</Label>
                    <Input
                      id="color-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Primary Blue"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hex-code">Hex Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="hex-code"
                        type="color"
                        value={formData.hex_code}
                        onChange={(e) => setFormData(prev => ({ ...prev, hex_code: e.target.value }))}
                        className="w-20 h-10 p-1 border"
                      />
                      <Input
                        value={formData.hex_code}
                        onChange={(e) => setFormData(prev => ({ ...prev, hex_code: e.target.value }))}
                        placeholder="#000000"
                        className="flex-1"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="usage-notes">Usage Notes</Label>
                  <Textarea
                    id="usage-notes"
                    value={formData.usage_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, usage_notes: e.target.value }))}
                    placeholder="Use for primary buttons and headers"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-primary"
                      checked={formData.is_primary}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_primary: checked }))}
                    />
                    <Label htmlFor="is-primary">Primary Color</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sort-order">Order</Label>
                    <Input
                      id="sort-order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                      className="w-20"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingColor ? 'Update Color' : 'Add Color'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div>
        {colors.length === 0 ? (
          <div className="text-center py-8">
            <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No brand colors defined yet.</p>
            <p className="text-sm text-muted-foreground">Add colors to establish your brand palette.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colors.map((color) => {
              const rgb = hexToRgb(color.hex_code);
              return (
                <GlassCard key={color.id} className="group p-4" variant="glass" size="sm" hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border shadow-sm"
                        style={{ backgroundColor: color.hex_code }}
                      />
                      <div>
                        <h4 className="font-medium">{color.name}</h4>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {color.hex_code}
                          </code>
                          {color.is_primary && (
                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(color.hex_code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(color)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteColor(color.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {rgb && (
                    <div className="text-xs text-muted-foreground mb-2">
                      RGB: {rgb.r}, {rgb.g}, {rgb.b}
                    </div>
                  )}
                  
                  {color.usage_notes && (
                    <p className="text-sm text-muted-foreground">{color.usage_notes}</p>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </GlassCard>
  );
}