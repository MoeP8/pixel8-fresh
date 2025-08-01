import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Palette, Download } from "lucide-react";
import { BrandColor } from "@/types/brand-management";

interface MediaUploaderProps {
  onUpload: (files: File[]) => void;
  brandColors: BrandColor[];
}

export function MediaUploader({ onUpload, brandColors }: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [showBrandOverlay, setShowBrandOverlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onUpload(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (file: File) => file.type.startsWith('image/');
  const isVideoFile = (file: File) => file.type.startsWith('video/');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Media Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Images, videos, documents
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Brand Color Overlay Options */}
        {brandColors.length > 0 && (
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBrandOverlay(!showBrandOverlay)}
              className="w-full"
            >
              <Palette className="h-4 w-4 mr-2" />
              Brand Overlay Options
            </Button>

            {showBrandOverlay && (
              <div className="p-3 border rounded-lg space-y-3">
                <div className="text-sm font-medium">Apply Brand Colors:</div>
                <div className="flex flex-wrap gap-2">
                  {brandColors.slice(0, 6).map((color) => (
                    <div
                      key={color.id}
                      className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted"
                      onClick={() => console.log(`Apply color ${color.name} to media`)}
                    >
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color.hex_code }}
                      />
                      <span className="text-xs">{color.name}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Select a brand color to apply as overlay or border
                </div>
              </div>
            )}
          </div>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Uploaded Files:</div>
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-2 border rounded">
                <div className="flex-1">
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} •{" "}
                    <Badge variant="outline" className="text-xs">
                      {isImageFile(file) ? "Image" : isVideoFile(file) ? "Video" : "Document"}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Auto-optimization Info */}
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <strong>Auto-optimization:</strong> Images will be automatically resized and compressed for optimal platform performance.
        </div>
      </CardContent>
    </Card>
  );
}