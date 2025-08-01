import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  MessageSquare, 
  FileText, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useRealtime, RealtimeActivity } from "@/hooks/useRealtime";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
}

export function ActivityFeed({ className, maxItems = 10, showHeader = true }: ActivityFeedProps) {
  const { recentActivity, isConnected } = useRealtime();
  const [showAll, setShowAll] = useState(false);

  const displayedActivity = showAll ? recentActivity : recentActivity.slice(0, maxItems);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'post_created': return <FileText className="h-4 w-4" />;
      case 'post_published': return <Send className="h-4 w-4" />;
      case 'post_approved': return <CheckCircle className="h-4 w-4" />;
      case 'post_rejected': return <XCircle className="h-4 w-4" />;
      case 'post_scheduled': return <Clock className="h-4 w-4" />;
      case 'post_edited': return <Edit className="h-4 w-4" />;
      case 'post_deleted': return <Trash2 className="h-4 w-4" />;
      case 'comment_added': return <MessageSquare className="h-4 w-4" />;
      case 'user_joined': return <Users className="h-4 w-4" />;
      case 'post_viewed': return <Eye className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'post_published': return 'text-green-600';
      case 'post_approved': return 'text-green-600';
      case 'post_rejected': return 'text-red-600';
      case 'post_failed': return 'text-red-600';
      case 'post_scheduled': return 'text-blue-600';
      case 'post_created': return 'text-purple-600';
      case 'post_edited': return 'text-yellow-600';
      case 'comment_added': return 'text-indigo-600';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityMessage = (activity: RealtimeActivity) => {
    const { action, details } = activity;
    
    switch (action) {
      case 'post_created':
        return `created a new ${details?.platform || 'social'} post`;
      case 'post_published':
        return `published to ${details?.platform || 'social media'}`;
      case 'post_approved':
        return `approved "${details?.title || 'a post'}"`;
      case 'post_rejected':
        return `rejected "${details?.title || 'a post'}"`;
      case 'post_scheduled':
        return `scheduled for ${details?.scheduled_at ? new Date(details.scheduled_at).toLocaleDateString() : 'later'}`;
      case 'post_edited':
        return `edited "${details?.title || 'a post'}"`;
      case 'post_deleted':
        return `deleted "${details?.title || 'a post'}"`;
      case 'comment_added':
        return `commented on "${details?.post_title || 'a post'}"`;
      case 'user_joined':
        return 'joined the workspace';
      case 'post_viewed':
        return `viewed "${details?.title || 'a post'}"`;
      default:
        return action.replace(/_/g, ' ');
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  if (!isConnected) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Team Activity
              <Badge variant="outline" className="ml-auto">Connecting...</Badge>
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Connecting to real-time updates...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Team Activity
            <Badge variant="outline" className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          {displayedActivity.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayedActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-6 w-6 mt-0.5">
                    <AvatarFallback className="text-xs">
                      {activity.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start gap-2">
                      <div className={cn("mt-0.5", getActivityColor(activity.action))}>
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.username}</span>
                          {' '}
                          <span className="text-muted-foreground">
                            {getActivityMessage(activity)}
                          </span>
                        </p>
                        {activity.details?.content && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            "{activity.details.content}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(activity.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {recentActivity.length > maxItems && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="w-full text-xs"
            >
              {showAll ? 'Show Less' : `Show All (${recentActivity.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}