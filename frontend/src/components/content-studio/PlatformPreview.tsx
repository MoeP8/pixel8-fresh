import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";

interface PlatformPreviewProps {
  platform: string;
  caption: string;
  hashtags: string;
  media: File[];
}

export function PlatformPreview({ platform, caption, hashtags, media }: PlatformPreviewProps) {
  const platformConfig = {
    instagram_business: {
      name: "Instagram",
      bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
      aspect: "aspect-square",
    },
    tiktok_business: {
      name: "TikTok",
      bgColor: "bg-black",
      aspect: "aspect-[9/16]",
    },
    linkedin_company: {
      name: "LinkedIn",
      bgColor: "bg-blue-600",
      aspect: "aspect-[16/9]",
    },
    facebook_pages: {
      name: "Facebook",
      bgColor: "bg-blue-600",
      aspect: "aspect-[16/9]",
    },
    twitter: {
      name: "Twitter/X",
      bgColor: "bg-black",
      aspect: "aspect-[16/9]",
    },
    youtube: {
      name: "YouTube",
      bgColor: "bg-red-600",
      aspect: "aspect-video",
    },
  };

  const config = platformConfig[platform as keyof typeof platformConfig] || platformConfig.instagram_business;

  const renderInstagramPreview = () => (
    <div className="bg-white rounded-lg overflow-hidden max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b">
        <Avatar className="h-8 w-8">
          <AvatarFallback>CB</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold text-sm">client_brand</div>
          <div className="text-xs text-muted-foreground">Sponsored</div>
        </div>
        <MoreHorizontal className="h-5 w-5" />
      </div>

      {/* Media */}
      <div className={`${config.aspect} bg-gray-100 flex items-center justify-center`}>
        {media.length > 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            {media.length} media file{media.length > 1 ? 's' : ''} uploaded
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">No media</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <Heart className="h-6 w-6" />
          <MessageCircle className="h-6 w-6" />
          <Share className="h-6 w-6" />
        </div>
        <Bookmark className="h-6 w-6" />
      </div>

      {/* Caption */}
      <div className="px-3 pb-3">
        <div className="text-sm">
          <span className="font-semibold">client_brand</span>{" "}
          {caption || "Your caption will appear here..."}
        </div>
        {hashtags && (
          <div className="text-sm text-blue-600 mt-1">
            {hashtags}
          </div>
        )}
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white rounded-lg border max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar className="h-12 w-12">
          <AvatarFallback>CB</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold">Client Brand</div>
          <div className="text-sm text-muted-foreground">Company • 1,234 followers</div>
          <div className="text-xs text-muted-foreground">2h • 🌐</div>
        </div>
        <MoreHorizontal className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-sm mb-3">
          {caption || "Your professional content will appear here..."}
        </div>
        {hashtags && (
          <div className="text-sm text-blue-600 mb-3">
            {hashtags}
          </div>
        )}
        
        {/* Media placeholder */}
        {media.length > 0 && (
          <div className={`${config.aspect} bg-gray-100 rounded flex items-center justify-center mb-3`}>
            <div className="text-center text-sm text-muted-foreground">
              {media.length} media file{media.length > 1 ? 's' : ''} uploaded
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>👍 Like</span>
          <span>💬 Comment</span>
          <span>↗️ Share</span>
          <span>📩 Send</span>
        </div>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white rounded-lg border max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback>CB</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Client Brand</span>
            <span className="text-muted-foreground">@clientbrand</span>
            <span className="text-muted-foreground">• 2h</span>
          </div>
          <div className="text-sm mt-1">
            {caption || "Your tweet will appear here..."}
          </div>
          {hashtags && (
            <div className="text-sm text-blue-500 mt-1">
              {hashtags}
            </div>
          )}
          
          {/* Media placeholder */}
          {media.length > 0 && (
            <div className={`${config.aspect} bg-gray-100 rounded-lg mt-3 flex items-center justify-center`}>
              <div className="text-center text-sm text-muted-foreground">
                {media.length} media file{media.length > 1 ? 's' : ''} uploaded
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between mt-3 text-muted-foreground max-w-md">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">12</span>
            </div>
            <div className="flex items-center gap-1">
              <Share className="h-4 w-4" />
              <span className="text-sm">3</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="text-sm">48</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGenericPreview = () => (
    <div className="bg-white rounded-lg border max-w-lg mx-auto p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded ${config.bgColor} flex items-center justify-center text-white text-sm font-bold`}>
          {config.name[0]}
        </div>
        <div>
          <div className="font-semibold">{config.name} Preview</div>
          <div className="text-sm text-muted-foreground">Client Brand</div>
        </div>
      </div>
      
      {media.length > 0 && (
        <div className={`${config.aspect} bg-gray-100 rounded mb-3 flex items-center justify-center`}>
          <div className="text-center text-sm text-muted-foreground">
            {media.length} media file{media.length > 1 ? 's' : ''} uploaded
          </div>
        </div>
      )}
      
      <div className="text-sm">
        {caption || "Your content will appear here..."}
      </div>
      
      {hashtags && (
        <div className="text-sm text-blue-600 mt-2">
          {hashtags}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded ${config.bgColor}`} />
          {config.name} Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {platform === 'instagram_business' && renderInstagramPreview()}
        {platform === 'linkedin_company' && renderLinkedInPreview()}
        {platform === 'twitter' && renderTwitterPreview()}
        {!['instagram_business', 'linkedin_company', 'twitter'].includes(platform) && renderGenericPreview()}
      </CardContent>
    </Card>
  );
}