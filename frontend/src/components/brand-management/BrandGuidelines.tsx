import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, FileText, Download, Eye, Upload } from "lucide-react";
import { BrandGuideline } from "@/types/brand-management";
import { toast } from "sonner";

interface BrandGuidelinesProps {
  guidelines: BrandGuideline[];
  onAdd: (guideline: Omit<BrandGuideline, 'id' | 'created_at' | 'updated_at'>, file: File) => Promise<void>;
  onUpdate: (id: string, updates: Partial<BrandGuideline>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  clientId: string;
}

export const BrandGuidelinesManager = ({ guidelines, onAdd, onUpdate, onDelete, clientId }: BrandGuidelinesProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newGuideline, setNewGuideline] = useState({
    title: '',
    description: '',
    version_number: 1,
    is_active: true
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a PDF or Word document");
        return;
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error("File size must be less than 50MB");
        return;
      }

      setSelectedFile(file);
      if (!newGuideline.title) {
        setNewGuideline({ ...newGuideline, title: file.name.split('.')[0] });
      }
    }
  };

  const handleAdd = async () => {
    if (!newGuideline.title || !selectedFile) {
      toast.error("Please fill in required fields and select a file");
      return;
    }

    try {
      await onAdd({
        client_id: clientId,
        title: newGuideline.title,
        description: newGuideline.description || undefined,
        version_number: newGuideline.version_number,
        is_active: newGuideline.is_active
      }, selectedFile);
      
      setNewGuideline({
        title: '',
        description: '',
        version_number: 1,
        is_active: true
      });
      setSelectedFile(null);
      setIsAdding(false);
      toast.success("Brand guideline added successfully");
    } catch (error) {
      toast.error("Failed to add brand guideline");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Brand guideline deleted successfully");
    } catch (error) {
      toast.error("Failed to delete brand guideline");
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      await onUpdate(id, { is_active });
      toast.success(`Brand guideline ${is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update brand guideline");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    return '📄';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Brand Guidelines</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage brand guideline documents (PDF/Word)
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Guidelines
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Add New Brand Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">File Upload *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="text-sm text-muted-foreground mb-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="font-medium text-primary hover:underline">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PDF or Word documents up to 50MB
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-muted rounded border">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getFileIcon(selectedFile.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newGuideline.title}
                  onChange={(e) => setNewGuideline({ ...newGuideline, title: e.target.value })}
                  placeholder="e.g., Brand Guidelines v2.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version Number</Label>
                <Input
                  id="version"
                  type="number"
                  min="1"
                  value={newGuideline.version_number}
                  onChange={(e) => setNewGuideline({ ...newGuideline, version_number: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newGuideline.description}
                onChange={(e) => setNewGuideline({ ...newGuideline, description: e.target.value })}
                placeholder="Describe what's included in these guidelines..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={newGuideline.is_active}
                onCheckedChange={(checked) => setNewGuideline({ ...newGuideline, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={!selectedFile}>
                Add Guidelines
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {guidelines.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Brand Guidelines Uploaded</h3>
              <p className="text-muted-foreground text-center mb-4">
                Upload your brand guideline documents to centralize brand assets
              </p>
              <Button onClick={() => setIsAdding(true)}>Upload First Guidelines</Button>
            </CardContent>
          </Card>
        ) : (
          guidelines
            .sort((a, b) => b.version_number - a.version_number)
            .map((guideline) => (
              <Card key={guideline.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-lg">{getFileIcon(guideline.file_type || '')}</span>
                        {guideline.title}
                        <Badge variant={guideline.is_active ? "default" : "secondary"}>
                          v{guideline.version_number}
                        </Badge>
                        {!guideline.is_active && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {guideline.description}
                        {guideline.file_size && (
                          <span className="ml-2">• {formatFileSize(guideline.file_size)}</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={guideline.is_active}
                        onCheckedChange={(checked) => handleToggleActive(guideline.id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(guideline.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {guideline.file_url && (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <a href={guideline.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={guideline.file_url} download>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      </>
                    )}
                    <div className="ml-auto text-xs text-muted-foreground">
                      Created: {new Date(guideline.created_at).toLocaleDateString()}
                      {guideline.approved_at && (
                        <span className="block">
                          Approved: {new Date(guideline.approved_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};