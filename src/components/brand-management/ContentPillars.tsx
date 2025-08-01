import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Target, Lightbulb } from "lucide-react";
import { ContentPillar, ContentPillarType } from "@/types/brand-management";
import { toast } from "sonner";

interface ContentPillarsProps {
  pillars: ContentPillar[];
  onAdd: (pillar: Omit<ContentPillar, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<ContentPillar>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  clientId: string;
}

export const ContentPillarsManager = ({ pillars, onAdd, onUpdate, onDelete, clientId }: ContentPillarsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPillar, setNewPillar] = useState({
    name: '',
    pillar_type: '' as ContentPillarType,
    description: '',
    percentage_target: '',
    example_topics: '',
    messaging_framework: '',
    is_active: true,
    sort_order: 0
  });

  const pillarTypes: { value: ContentPillarType; label: string; description: string }[] = [
    { value: 'educational', label: 'Educational', description: 'Informative content that teaches your audience' },
    { value: 'promotional', label: 'Promotional', description: 'Content that promotes products or services' },
    { value: 'behind_scenes', label: 'Behind the Scenes', description: 'Show the human side of your brand' },
    { value: 'user_generated', label: 'User Generated', description: 'Content created by your community' },
    { value: 'industry_news', label: 'Industry News', description: 'Latest trends and news in your industry' },
    { value: 'company_culture', label: 'Company Culture', description: 'Share your values and team culture' },
    { value: 'product_showcase', label: 'Product Showcase', description: 'Highlight your products or services' },
    { value: 'testimonials', label: 'Testimonials', description: 'Customer success stories and reviews' },
    { value: 'other', label: 'Other', description: 'Custom content pillar type' }
  ];

  const handleAdd = async () => {
    if (!newPillar.name || !newPillar.pillar_type) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const topicsArray = newPillar.example_topics 
        ? newPillar.example_topics.split(',').map(t => t.trim()).filter(t => t)
        : [];

      let messagingFramework = null;
      if (newPillar.messaging_framework) {
        try {
          messagingFramework = JSON.parse(newPillar.messaging_framework);
        } catch {
          messagingFramework = { notes: newPillar.messaging_framework };
        }
      }

      await onAdd({
        client_id: clientId,
        name: newPillar.name,
        pillar_type: newPillar.pillar_type,
        description: newPillar.description || undefined,
        percentage_target: newPillar.percentage_target ? parseInt(newPillar.percentage_target) : undefined,
        example_topics: topicsArray,
        messaging_framework: messagingFramework,
        is_active: newPillar.is_active,
        sort_order: newPillar.sort_order
      });
      
      setNewPillar({
        name: '',
        pillar_type: '' as ContentPillarType,
        description: '',
        percentage_target: '',
        example_topics: '',
        messaging_framework: '',
        is_active: true,
        sort_order: 0
      });
      setIsAdding(false);
      toast.success("Content pillar added successfully");
    } catch (error) {
      toast.error("Failed to add content pillar");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Content pillar deleted successfully");
    } catch (error) {
      toast.error("Failed to delete content pillar");
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      await onUpdate(id, { is_active });
      toast.success(`Content pillar ${is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update content pillar");
    }
  };

  const getPillarTypeInfo = (type: ContentPillarType) => {
    return pillarTypes.find(pt => pt.value === type) || { label: type, description: '' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Content Pillars</h3>
          <p className="text-sm text-muted-foreground">
            Define your content strategy framework and messaging guidelines
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Content Pillar
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Add New Content Pillar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pillar Name *</Label>
                <Input
                  id="name"
                  value={newPillar.name}
                  onChange={(e) => setNewPillar({ ...newPillar, name: e.target.value })}
                  placeholder="e.g., Educational Content"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pillar_type">Pillar Type *</Label>
                <Select value={newPillar.pillar_type} onValueChange={(value) => setNewPillar({ ...newPillar, pillar_type: value as ContentPillarType })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {pillarTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div>{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPillar.description}
                onChange={(e) => setNewPillar({ ...newPillar, description: e.target.value })}
                placeholder="Describe the purpose and goals of this content pillar..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage_target">Target Percentage (%)</Label>
              <Input
                id="percentage_target"
                type="number"
                min="0"
                max="100"
                value={newPillar.percentage_target}
                onChange={(e) => setNewPillar({ ...newPillar, percentage_target: e.target.value })}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example_topics">Example Topics (comma-separated)</Label>
              <Textarea
                id="example_topics"
                value={newPillar.example_topics}
                onChange={(e) => setNewPillar({ ...newPillar, example_topics: e.target.value })}
                placeholder="Industry trends, How-to guides, Best practices..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="messaging_framework">Messaging Framework (JSON or notes)</Label>
              <Textarea
                id="messaging_framework"
                value={newPillar.messaging_framework}
                onChange={(e) => setNewPillar({ ...newPillar, messaging_framework: e.target.value })}
                placeholder='{"tone": "helpful", "focus": "problem-solving"} or simple text notes...'
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={newPillar.is_active}
                onCheckedChange={(checked) => setNewPillar({ ...newPillar, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Content Pillar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {pillars.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Content Pillars Defined</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create content pillars to organize your content strategy
              </p>
              <Button onClick={() => setIsAdding(true)}>Add First Content Pillar</Button>
            </CardContent>
          </Card>
        ) : (
          pillars
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((pillar) => {
              const typeInfo = getPillarTypeInfo(pillar.pillar_type);
              return (
                <Card key={pillar.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {pillar.name}
                          <Badge variant={pillar.is_active ? "default" : "secondary"}>
                            {typeInfo.label}
                          </Badge>
                          {pillar.percentage_target && (
                            <Badge variant="outline">{pillar.percentage_target}%</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{pillar.description || typeInfo.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={pillar.is_active}
                          onCheckedChange={(checked) => handleToggleActive(pillar.id, checked)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pillar.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pillar.example_topics && pillar.example_topics.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Lightbulb className="h-4 w-4" />
                            Example Topics
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {pillar.example_topics.map((topic, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {pillar.messaging_framework && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Messaging Framework</h4>
                          <div className="bg-muted p-3 rounded text-sm">
                            {typeof pillar.messaging_framework === 'object' 
                              ? JSON.stringify(pillar.messaging_framework, null, 2)
                              : pillar.messaging_framework}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
        )}
      </div>
    </div>
  );
};