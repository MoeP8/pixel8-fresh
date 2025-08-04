import { useState, useCallback } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Upload, 
  FileImage, 
  Download, 
  Edit2, 
  Trash2, 
  Star,
  StarOff,
  ImageIcon,
  FileIcon,
  VideoIcon,
  PaletteIcon
} from 'lucide-react';
import type { BrandAsset, BrandAssetType } from '@/types/brand-management';
import { useToast } from '@/hooks/use-toast';

interface BrandAssetLibraryProps {
  assets: BrandAsset[];
  onAddAsset: (assetData: Omit<BrandAsset, 'id' | 'file_url' | 'created_at' | 'updated_at'>, file: File) => void;
  clientId: string;
}

const assetTypeConfig = {
  logo: { icon: Star, label: 'Logo', color: 'bg-yellow-100 text-yellow-800' },
  graphic: { icon: PaletteIcon, label: 'Graphic', color: 'bg-purple-100 text-purple-800' },
  template: { icon: FileIcon, label: 'Template', color: 'bg-blue-100 text-blue-800' },
  document: { icon: FileIcon, label: 'Document', color: 'bg-gray-100 text-gray-800' },
  image: { icon: ImageIcon, label: 'Image', color: 'bg-green-100 text-green-800' },
  video: { icon: VideoIcon, label: 'Video', color: 'bg-red-100 text-red-800' },
  other: { icon: FileIcon, label: 'Other', color: 'bg-slate-100 text-slate-800' }
};

export function BrandAssetLibrary({ assets, onAddAsset, clientId }: BrandAssetLibraryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [filter, setFilter] = useState<BrandAssetType | 'all'>('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    asset_type: 'logo' as BrandAssetType,
    usage_notes: '',
    tags: '',
    is_primary: false
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      asset_type: 'logo',
      usage_notes: '',
      tags: '',
      is_primary: false
    });
    setSelectedFile(null);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    onAddAsset({
      client_id: clientId,
      name: formData.name,
      description: formData.description,
      asset_type: formData.asset_type,
      file_name: selectedFile.name,
      usage_notes: formData.usage_notes,
      tags: tagsArray,
      is_primary: formData.is_primary
    }, selectedFile);

    setIsDialogOpen(false);
    resetForm();
  };

  const filteredAssets = filter === 'all' 
    ? assets 
    : assets.filter(asset => asset.asset_type === filter);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getAssetIcon = (assetType: BrandAssetType) => {
    const IconComponent = assetTypeConfig[assetType].icon;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <GlassCard className="p-6" variant="subtle" hover>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-foreground">Brand Asset Library</h3>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(value: BrandAssetType | 'all') => setFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(assetTypeConfig).map(([type, config]) => (
                  <SelectItem key={type} value={type}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Brand Asset</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileIcon className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                        <p className="text-sm text-muted-foreground">
                          Support for images, videos, documents, and design files
                        </p>
                      </div>
                    )}
                    <Input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      accept="image/*,video/*,.pdf,.doc,.docx,.psd,.ai,.sketch,.fig"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="mt-4">
                        Choose File
                      </Button>
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="asset-name">Asset Name</Label>
                      <Input
                        id="asset-name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Logo Primary"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="asset-type">Asset Type</Label>
                      <Select 
                        value={formData.asset_type} 
                        onValueChange={(value: BrandAssetType) => setFormData(prev => ({ ...prev, asset_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(assetTypeConfig).map(([type, config]) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                {getAssetIcon(type as BrandAssetType)}
                                {config.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Primary logo for use on light backgrounds"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="usage-notes">Usage Notes</Label>
                    <Textarea
                      id="usage-notes"
                      value={formData.usage_notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, usage_notes: e.target.value }))}
                      placeholder="Minimum size 150px width, use for headers and primary branding"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="logo, primary, light-bg, header"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Upload Asset</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div>
        {filteredAssets.length === 0 ? (
          <div className="text-center py-8">
            <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No brand assets uploaded yet.</p>
            <p className="text-sm text-muted-foreground">Upload your first asset to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => {
              const config = assetTypeConfig[asset.asset_type];
              const IconComponent = config.icon;
              
              return (
                <GlassCard key={asset.id} className="group overflow-hidden" variant="glass" size="sm" hover>
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    {asset.file_type?.startsWith('image/') ? (
                      <img 
                        src={asset.file_url} 
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <IconComponent className="h-12 w-12 mb-2" />
                        <span className="text-xs">{asset.file_type}</span>
                      </div>
                    )}
                    
                    {asset.is_primary && (
                      <div className="absolute top-2 right-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => window.open(asset.file_url, '_blank')}>
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="secondary" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">{asset.name}</h4>
                      <Badge variant="secondary" className={config.color}>
                        {config.label}
                      </Badge>
                    </div>
                    
                    {asset.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {asset.description}
                      </p>
                    )}
                    
                    {asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {asset.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {asset.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{asset.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(asset.file_size)}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </GlassCard>
  );
}