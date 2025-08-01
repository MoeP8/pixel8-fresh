import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Hash, TrendingUp } from "lucide-react";
import { HashtagStrategy } from "@/types/brand-management";
import { toast } from "sonner";

interface HashtagStrategyProps {
  strategies: HashtagStrategy[];
  onAdd: (strategy: Omit<HashtagStrategy, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<HashtagStrategy>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  clientId: string;
}

export const HashtagStrategyManager = ({ strategies, onAdd, onUpdate, onDelete, clientId }: HashtagStrategyProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    platform: '',
    strategy_name: '',
    hashtags: '',
    max_hashtags: '30',
    usage_notes: '',
    performance_notes: '',
    is_active: true
  });

  const platforms = [
    { value: 'instagram_business', label: 'Instagram', defaultMax: 30 },
    { value: 'twitter', label: 'Twitter/X', defaultMax: 10 },
    { value: 'linkedin_company', label: 'LinkedIn', defaultMax: 10 },
    { value: 'facebook_pages', label: 'Facebook', defaultMax: 20 },
    { value: 'tiktok_business', label: 'TikTok', defaultMax: 100 },
    { value: 'youtube', label: 'YouTube', defaultMax: 15 },
    { value: 'threads', label: 'Threads', defaultMax: 20 },
    { value: 'snapchat_business', label: 'Snapchat', defaultMax: 20 }
  ];

  const handleAdd = async () => {
    if (!newStrategy.platform || !newStrategy.strategy_name || !newStrategy.hashtags) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const hashtagsArray = newStrategy.hashtags
        .split(',')
        .map(tag => tag.trim().replace(/^#/, ''))
        .filter(tag => tag)
        .map(tag => `#${tag}`);

      await onAdd({
        client_id: clientId,
        platform: newStrategy.platform as HashtagStrategy['platform'],
        strategy_name: newStrategy.strategy_name,
        hashtags: hashtagsArray,
        max_hashtags: parseInt(newStrategy.max_hashtags),
        usage_notes: newStrategy.usage_notes || undefined,
        performance_notes: newStrategy.performance_notes || undefined,
        is_active: newStrategy.is_active
      });
      
      setNewStrategy({
        platform: '',
        strategy_name: '',
        hashtags: '',
        max_hashtags: '30',
        usage_notes: '',
        performance_notes: '',
        is_active: true
      });
      setIsAdding(false);
      toast.success("Hashtag strategy added successfully");
    } catch (error) {
      toast.error("Failed to add hashtag strategy");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Hashtag strategy deleted successfully");
    } catch (error) {
      toast.error("Failed to delete hashtag strategy");
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      await onUpdate(id, { is_active });
      toast.success(`Hashtag strategy ${is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update hashtag strategy");
    }
  };

  const handlePlatformChange = (platform: string) => {
    const platformInfo = platforms.find(p => p.value === platform);
    setNewStrategy({
      ...newStrategy,
      platform,
      max_hashtags: platformInfo?.defaultMax.toString() || '30'
    });
  };

  const getPlatformLabel = (platform: string) => {
    return platforms.find(p => p.value === platform)?.label || platform;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Hashtag Strategy</h3>
          <p className="text-sm text-muted-foreground">
            Organize hashtag collections for different platforms and campaigns
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Hashtag Strategy
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Add New Hashtag Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select value={newStrategy.platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label} (max {platform.defaultMax})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="strategy_name">Strategy Name *</Label>
                <Input
                  id="strategy_name"
                  value={newStrategy.strategy_name}
                  onChange={(e) => setNewStrategy({ ...newStrategy, strategy_name: e.target.value })}
                  placeholder="e.g., Product Launch Campaign"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hashtags">Hashtags (comma-separated) *</Label>
              <Textarea
                id="hashtags"
                value={newStrategy.hashtags}
                onChange={(e) => setNewStrategy({ ...newStrategy, hashtags: e.target.value })}
                placeholder="marketing, socialmedia, brand, content, strategy..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Enter hashtags without # symbol. They will be added automatically.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_hashtags">Max Hashtags</Label>
              <Input
                id="max_hashtags"
                type="number"
                min="1"
                max="100"
                value={newStrategy.max_hashtags}
                onChange={(e) => setNewStrategy({ ...newStrategy, max_hashtags: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage_notes">Usage Notes</Label>
              <Textarea
                id="usage_notes"
                value={newStrategy.usage_notes}
                onChange={(e) => setNewStrategy({ ...newStrategy, usage_notes: e.target.value })}
                placeholder="When to use these hashtags, best practices, etc..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="performance_notes">Performance Notes</Label>
              <Textarea
                id="performance_notes"
                value={newStrategy.performance_notes}
                onChange={(e) => setNewStrategy({ ...newStrategy, performance_notes: e.target.value })}
                placeholder="Track performance insights, which tags work best..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={newStrategy.is_active}
                onCheckedChange={(checked) => setNewStrategy({ ...newStrategy, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Strategy</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {strategies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Hash className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Hashtag Strategies Defined</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create hashtag collections to streamline your social media posting
              </p>
              <Button onClick={() => setIsAdding(true)}>Add First Strategy</Button>
            </CardContent>
          </Card>
        ) : (
          strategies.map((strategy) => (
            <Card key={strategy.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {strategy.strategy_name}
                      <Badge variant={strategy.is_active ? "default" : "secondary"}>
                        {getPlatformLabel(strategy.platform)}
                      </Badge>
                      <Badge variant="outline">
                        {strategy.hashtags.length}/{strategy.max_hashtags} tags
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {strategy.hashtags.length} hashtags for {getPlatformLabel(strategy.platform)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={strategy.is_active}
                      onCheckedChange={(checked) => handleToggleActive(strategy.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(strategy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Hashtags</h4>
                    <div className="flex flex-wrap gap-1">
                      {strategy.hashtags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs font-mono">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {strategy.usage_notes && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        Usage Notes
                      </h4>
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {strategy.usage_notes}
                      </p>
                    </div>
                  )}
                  
                  {strategy.performance_notes && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Performance Notes
                      </h4>
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {strategy.performance_notes}
                      </p>
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