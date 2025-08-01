import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  MoreHorizontal,
  Eye,
  Users,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface CalendarEventProps {
  post: {
    id: string;
    title: string;
    platform: string;
    scheduled_at: string;
    posting_status: "scheduled" | "posted" | "failed";
    content_data?: {
      caption?: string;
      message?: string;
      media_urls?: string[];
    };
    client?: {
      name: string;
      logo_url?: string;
    };
    content_pillar?: {
      name: string;
      pillar_type: string;
    };
    brand_compliance_score?: number;
    optimal_time_score?: number;
  };
  size?: "small" | "medium" | "large";
  showDetails?: boolean;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onDuplicate?: (postId: string) => void;
  onPublishNow?: (postId: string) => void;
  onPause?: (postId: string) => void;
}

export function CalendarEvent({
  post,
  size = "medium",
  showDetails = false,
  onEdit,
  onDelete,
  onDuplicate,
  onPublishNow,
  onPause
}: CalendarEventProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: "bg-pink-500",
      facebook: "bg-blue-500",
      twitter: "bg-sky-400",
      linkedin: "bg-blue-600"
    };
    return colors[platform] || "bg-gray-500";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "border-blue-400 bg-blue-500/20 text-blue-400",
      posted: "border-green-400 bg-green-500/20 text-green-400",
      failed: "border-red-400 bg-red-500/20 text-red-400"
    };
    return colors[status] || "border-gray-400 bg-gray-500/20 text-gray-400";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "posted":
        return <CheckCircle className="w-3 h-3" />;
      case "failed":
        return <AlertCircle className="w-3 h-3" />;
      case "scheduled":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const SmallEvent = () => (
    <div 
      className={`p-2 rounded border ${getStatusColor(post.posting_status)} cursor-pointer hover:scale-105 transition-all duration-200`}
      onClick={() => setIsPopoverOpen(true)}
    >
      <div className="flex items-center gap-1 mb-1">
        <div className={`w-2 h-2 rounded-full ${getPlatformColor(post.platform)}`}></div>
        <span className="text-white text-xs font-medium truncate">{post.title}</span>
      </div>
      <div className="text-slate-300 text-xs">
        {format(new Date(post.scheduled_at), "HH:mm")}
      </div>
    </div>
  );

  const MediumEvent = () => (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
            <h4 className="text-white text-sm font-medium truncate">{post.title}</h4>
          </div>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-auto text-slate-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-slate-800/95 border-slate-700 backdrop-blur-md" align="end">
              <EventActions />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant="secondary"
            className={`text-xs ${getStatusColor(post.posting_status)}`}
          >
            {getStatusIcon(post.posting_status)}
            <span className="ml-1">{post.posting_status}</span>
          </Badge>
          <span className="text-slate-400 text-xs">
            {format(new Date(post.scheduled_at), "HH:mm")}
          </span>
        </div>
        
        {post.content_data?.caption && (
          <p className="text-slate-300 text-xs line-clamp-2 mb-2">
            {post.content_data.caption}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="capitalize">{post.platform}</span>
          {post.client && (
            <span className="truncate">{post.client.name}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const LargeEvent = () => (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getPlatformColor(post.platform)}`}></div>
            <div>
              <CardTitle className="text-white text-base">{post.title}</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                {format(new Date(post.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(post.posting_status)}>
              {getStatusIcon(post.posting_status)}
              <span className="ml-1">{post.posting_status}</span>
            </Badge>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-slate-800/95 border-slate-700 backdrop-blur-md" align="end">
                <EventActions />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {post.content_data?.caption && (
          <p className="text-slate-300 text-sm mb-4 line-clamp-3">
            {post.content_data.caption}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {post.brand_compliance_score && (
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-white">{post.brand_compliance_score}%</div>
              <div className="text-xs text-slate-400">Brand Compliance</div>
            </div>
          )}
          
          {post.optimal_time_score && (
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold text-white">{post.optimal_time_score}%</div>
              <div className="text-xs text-slate-400">Optimal Timing</div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="capitalize">{post.platform}</span>
            </div>
            {post.client && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{post.client.name}</span>
              </div>
            )}
          </div>
          
          {post.content_pillar && (
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              {post.content_pillar.name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EventActions = () => (
    <div className="space-y-1">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-white hover:bg-white/10"
        onClick={() => {
          onEdit?.(post.id);
          setIsPopoverOpen(false);
        }}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Post
      </Button>
      
      {post.posting_status === "scheduled" && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-green-400 hover:bg-green-500/10"
            onClick={() => {
              onPublishNow?.(post.id);
              setIsPopoverOpen(false);
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            Publish Now
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-yellow-400 hover:bg-yellow-500/10"
            onClick={() => {
              onPause?.(post.id);
              setIsPopoverOpen(false);
            }}
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        </>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-blue-400 hover:bg-blue-500/10"
        onClick={() => {
          onDuplicate?.(post.id);
          setIsPopoverOpen(false);
        }}
      >
        <Copy className="w-4 h-4 mr-2" />
        Duplicate
      </Button>
      
      <div className="border-t border-slate-700 my-1"></div>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-red-400 hover:bg-red-500/10"
        onClick={() => {
          onDelete?.(post.id);
          setIsPopoverOpen(false);
        }}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );

  switch (size) {
    case "small":
      return <SmallEvent />;
    case "large":
      return <LargeEvent />;
    default:
      return <MediumEvent />;
  }
}