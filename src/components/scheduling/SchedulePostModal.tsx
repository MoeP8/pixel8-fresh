import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScheduling } from "@/hooks/useScheduling";
import { useBrandManagement } from "@/hooks/useBrandManagement";

interface SchedulePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientIds: string[];
  initialData?: any;
  onSuccess: () => void;
}

export function SchedulePostModal({ 
  open, 
  onOpenChange, 
  clientIds, 
  initialData, 
  onSuccess 
}: SchedulePostModalProps) {
  const [formData, setFormData] = useState({
    client_id: initialData?.client_id || clientIds[0] || '',
    title: initialData?.title || '',
    content_data: {
      caption: initialData?.content_data?.caption || '',
      hashtags: initialData?.content_data?.hashtags || '',
    },
    platform: initialData?.platform || 'instagram_business',
    scheduled_at: initialData?.scheduled_at || new Date().toISOString().slice(0, 16),
    content_pillar_id: initialData?.content_pillar_id || '',
  });

  const { createScheduledPost, updateScheduledPost } = useScheduling();
  const { contentPillars } = useBrandManagement();

  const platforms = [
    { id: "instagram_business", name: "Instagram" },
    { id: "facebook_pages", name: "Facebook" },
    { id: "twitter", name: "Twitter/X" },
    { id: "linkedin_company", name: "LinkedIn" },
    { id: "tiktok_business", name: "TikTok" },
    { id: "youtube", name: "YouTube" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const postData = {
        ...formData,
        brand_compliance_score: 75, // Default score
        optimal_time_score: 85, // Default score
      };

      if (initialData?.id) {
        await updateScheduledPost(initialData.id, postData);
      } else {
        await createScheduledPost(postData);
      }
      
      onSuccess();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? 'Edit Scheduled Post' : 'Schedule New Post'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Platform</Label>
              <Select 
                value={formData.platform} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Content Pillar</Label>
              <Select 
                value={formData.content_pillar_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, content_pillar_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pillar..." />
                </SelectTrigger>
                <SelectContent>
                  {contentPillars.filter(p => p.is_active).map(pillar => (
                    <SelectItem key={pillar.id} value={pillar.id}>
                      {pillar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Post title..."
              required
            />
          </div>

          <div>
            <Label>Caption</Label>
            <Textarea
              value={formData.content_data.caption}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                content_data: { ...prev.content_data, caption: e.target.value }
              }))}
              placeholder="Write your caption..."
              rows={4}
            />
          </div>

          <div>
            <Label>Hashtags</Label>
            <Input
              value={formData.content_data.hashtags}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                content_data: { ...prev.content_data, hashtags: e.target.value }
              }))}
              placeholder="#hashtag1 #hashtag2"
            />
          </div>

          <div>
            <Label>Scheduled Date & Time</Label>
            <Input
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData?.id ? 'Update Post' : 'Schedule Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}