import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Eye,
  ThumbsUp,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PostStatus {
  id: string;
  posting_status: 'draft' | 'scheduled' | 'publishing' | 'posted' | 'failed' | 'approved' | 'rejected';
  platform: string;
  scheduled_at?: string;
  posted_at?: string;
  failure_reason?: string;
  engagement_data?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
}

interface LivePostStatusProps {
  post: PostStatus;
  showEngagement?: boolean;
  className?: string;
}

export function LivePostStatus({ post, showEngagement = false, className }: LivePostStatusProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when status changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [post.posting_status]);

  const getStatusConfig = (status: PostStatus['posting_status']) => {
    switch (status) {
      case 'draft':
        return {
          icon: <Eye className="h-3 w-3" />,
          label: 'Draft',
          color: 'bg-gray-500',
          variant: 'secondary' as const,
          description: 'In progress'
        };
      case 'scheduled':
        return {
          icon: <Clock className="h-3 w-3" />,
          label: 'Scheduled',
          color: 'bg-blue-500',
          variant: 'default' as const,
          description: post.scheduled_at ? `for ${new Date(post.scheduled_at).toLocaleString()}` : ''
        };
      case 'publishing':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          label: 'Publishing',
          color: 'bg-yellow-500',
          variant: 'default' as const,
          description: `to ${post.platform}`
        };
      case 'posted':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Published',
          color: 'bg-green-500',
          variant: 'default' as const,
          description: post.posted_at ? `${new Date(post.posted_at).toLocaleString()}` : 'Successfully published'
        };
      case 'failed':
        return {
          icon: <XCircle className="h-3 w-3" />,
          label: 'Failed',
          color: 'bg-red-500',
          variant: 'destructive' as const,
          description: post.failure_reason || 'Publishing failed'
        };
      case 'approved':
        return {
          icon: <ThumbsUp className="h-3 w-3" />,
          label: 'Approved',
          color: 'bg-green-500',
          variant: 'default' as const,
          description: 'Ready to publish'
        };
      case 'rejected':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          label: 'Rejected',
          color: 'bg-red-500',
          variant: 'destructive' as const,
          description: 'Needs revision'
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          label: status,
          color: 'bg-gray-500',
          variant: 'secondary' as const,
          description: ''
        };
    }
  };

  const config = getStatusConfig(post.posting_status);

  const getPublishingProgress = () => {
    switch (post.posting_status) {
      case 'draft': return 0;
      case 'scheduled': return 25;
      case 'approved': return 50;
      case 'publishing': return 75;
      case 'posted': return 100;
      case 'failed': return 100;
      case 'rejected': return 25;
      default: return 0;
    }
  };

  const formatEngagementNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={config.variant}
          className={cn(
            "flex items-center gap-1 transition-all duration-300",
            isAnimating && "scale-105 shadow-md"
          )}
        >
          {config.icon}
          {config.label}
        </Badge>
        
        {/* Live indicator for active statuses */}
        {['publishing', 'scheduled'].includes(post.posting_status) && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {post.posting_status !== 'draft' && (
        <div className="space-y-1">
          <Progress 
            value={getPublishingProgress()} 
            className="h-1"
          />
          <p className="text-xs text-muted-foreground">
            {config.description}
          </p>
        </div>
      )}

      {/* Engagement Metrics (for published posts) */}
      {showEngagement && post.posting_status === 'posted' && post.engagement_data && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {post.engagement_data.views && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatEngagementNumber(post.engagement_data.views)}
            </div>
          )}
          {post.engagement_data.likes && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {formatEngagementNumber(post.engagement_data.likes)}
            </div>
          )}
          {post.engagement_data.comments && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {formatEngagementNumber(post.engagement_data.comments)}
            </div>
          )}
        </div>
      )}

      {/* Platform indicator */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">
          {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
        </span>
      </div>
    </div>
  );
}