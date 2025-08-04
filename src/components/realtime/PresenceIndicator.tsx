import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRealtime, type RealtimePresence } from "@/hooks/useRealtime";
import { cn } from "@/lib/utils";

interface PresenceIndicatorProps {
  className?: string;
  showDetails?: boolean;
  maxUsers?: number;
}

export function PresenceIndicator({ className, showDetails = false, maxUsers = 5 }: PresenceIndicatorProps) {
  const { getOnlineUsers, isConnected } = useRealtime();
  const onlineUsers = getOnlineUsers();

  if (!isConnected || onlineUsers.length === 0) {
    return null;
  }

  const displayUsers = onlineUsers.slice(0, maxUsers);
  const remainingCount = Math.max(0, onlineUsers.length - maxUsers);

  const getStatusColor = (status: RealtimePresence['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: RealtimePresence['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Unknown';
    }
  };

  if (showDetails) {
    return (
      <div className={cn("space-y-2", className)}>
        <h3 className="text-sm font-medium text-muted-foreground">
          Team Online ({onlineUsers.length})
        </h3>
        <div className="space-y-2">
          {displayUsers.map((user) => (
            <div key={user.user_id} className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                  <AvatarFallback className="text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                  getStatusColor(user.status)
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username}</p>
                {user.current_page && (
                  <p className="text-xs text-muted-foreground truncate">
                    {user.current_page.replace(/^\//, '').replace(/-/g, ' ') || 'Dashboard'}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {getStatusText(user.status)}
              </Badge>
            </div>
          ))}
          {remainingCount > 0 && (
            <p className="text-xs text-muted-foreground">
              +{remainingCount} more online
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn("flex items-center", className)}>
        <div className="flex -space-x-2">
          {displayUsers.map((user) => (
            <Tooltip key={user.user_id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.avatar_url} alt={user.username} />
                    <AvatarFallback className="text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                    getStatusColor(user.status)
                  )} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{getStatusText(user.status)}</p>
                  {user.current_page && (
                    <p className="text-xs text-muted-foreground">
                      {user.current_page.replace(/^\//, '').replace(/-/g, ' ') || 'Dashboard'}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-background">
                  <span className="text-xs font-medium">+{remainingCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{remainingCount} more team members online</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {onlineUsers.length > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {onlineUsers.length} online
          </span>
        )}
      </div>
    </TooltipProvider>
  );
}