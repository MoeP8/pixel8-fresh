import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hash, Plus } from "lucide-react";
import { useBrandManagement } from "@/hooks/useBrandManagement";

interface HashtagSuggestionsProps {
  clientId: string;
  platform: string;
  onSuggest: (hashtags: string) => void;
}

export function HashtagSuggestions({ clientId, platform, onSuggest }: HashtagSuggestionsProps) {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const { hashtagStrategies } = useBrandManagement(clientId);

  const platformStrategy = hashtagStrategies.find(
    strategy => strategy.platform === platform && strategy.is_active
  );

  const handleToggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const handleAddSelected = () => {
    if (selectedHashtags.length > 0) {
      const hashtagString = selectedHashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
      onSuggest(hashtagString);
      setSelectedHashtags([]);
    }
  };

  const handleAddAll = () => {
    if (platformStrategy) {
      const allHashtags = platformStrategy.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
      onSuggest(allHashtags);
    }
  };

  if (!platformStrategy || platformStrategy.hashtags.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Hashtag Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hashtag strategy found for {platform.replace('_', ' ')}. 
            Set up hashtag strategies in Brand Hub.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Hashtag Suggestions
          <Badge variant="outline">
            {platformStrategy.strategy_name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {platformStrategy.hashtags.map((hashtag, index) => {
            const isSelected = selectedHashtags.includes(hashtag);
            return (
              <Badge
                key={index}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleToggleHashtag(hashtag)}
              >
                {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
              </Badge>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddSelected}
            disabled={selectedHashtags.length === 0}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Selected ({selectedHashtags.length})
          </Button>
          <Button 
            size="sm"
            onClick={handleAddAll}
          >
            Add All
          </Button>
        </div>

        {platformStrategy.usage_notes && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <strong>Usage Notes:</strong> {platformStrategy.usage_notes}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Max hashtags for {platform.replace('_', ' ')}: {platformStrategy.max_hashtags}
        </div>
      </CardContent>
    </Card>
  );
}