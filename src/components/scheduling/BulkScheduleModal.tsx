import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileSpreadsheet } from "lucide-react";

interface BulkScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientIds: string[];
  onSuccess: () => void;
}

export function BulkScheduleModal({ 
  open, 
  onOpenChange, 
  clientIds, 
  onSuccess 
}: BulkScheduleModalProps) {
  const [csvData, setCsvData] = useState('');
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);

  const sampleCSV = `title,platform,scheduled_at,caption,hashtags,client_id
"Instagram Post 1","instagram_business","2024-02-01T10:00","Great content here!","#marketing #social",""
"Facebook Post 1","facebook_pages","2024-02-01T14:00","Another amazing post","#business #growth",""`;

  const handleCSVParse = () => {
    if (!csvData.trim()) return;
    
    setParsing(true);
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const posts = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        const post: any = {};
        
        headers.forEach((header, index) => {
          if (header === 'content_data') {
            post[header] = JSON.parse(values[index] || '{}');
          } else {
            post[header] = values[index] || '';
          }
        });
        
        // Set default client if not provided
        if (!post.client_id && clientIds.length > 0) {
          post.client_id = clientIds[0];
        }
        
        return post;
      });
      
      setPreview(posts);
    } catch (error) {
      console.error('CSV parsing error:', error);
    } finally {
      setParsing(false);
    }
  };

  const handleBulkSchedule = async () => {
    try {
      // Here you would call the bulk scheduling function
      // await bulkSchedulePosts(preview);
      onSuccess();
    } catch (error) {
      console.error('Bulk scheduling error:', error);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_schedule_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Schedule Posts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-medium">Need a template?</h3>
              <p className="text-sm text-muted-foreground">
                Download our CSV template to get started
              </p>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* CSV Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste CSV Data</label>
            <Textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Paste your CSV data here..."
              rows={8}
              className="font-mono text-sm"
            />
            <Button onClick={handleCSVParse} disabled={!csvData.trim() || parsing}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              {parsing ? 'Parsing...' : 'Parse CSV'}
            </Button>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Preview ({preview.length} posts)</h3>
                <Badge variant="secondary">{preview.length} posts ready</Badge>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Title</th>
                      <th className="p-2 text-left">Platform</th>
                      <th className="p-2 text-left">Scheduled</th>
                      <th className="p-2 text-left">Caption</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 10).map((post, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 font-medium">{post.title}</td>
                        <td className="p-2">
                          <Badge variant="outline">{post.platform}</Badge>
                        </td>
                        <td className="p-2">{new Date(post.scheduled_at).toLocaleString()}</td>
                        <td className="p-2 truncate max-w-40">{post.caption}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 10 && (
                  <div className="p-2 text-center text-sm text-muted-foreground border-t">
                    And {preview.length - 10} more posts...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkSchedule} 
              disabled={preview.length === 0}
            >
              Schedule {preview.length} Posts
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}