import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  RefreshCw, 
  Unlink,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { SocialAccount, SocialPlatform } from '@/types/social-accounts';

interface PlatformCardProps {
  account?: SocialAccount;
  platform: SocialPlatform;
  onConnect: (platform: string) => void;
  onDisconnect: (accountId: string) => void;
  onRefresh: (accountId: string) => void;
}

const platformConfig = {
  instagram_business: {
    name: 'Instagram Business',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    icon: '📷'
  },
  facebook_pages: {
    name: 'Facebook Pages',
    color: 'bg-blue-600',
    icon: '📘'
  },
  tiktok_business: {
    name: 'TikTok Business',
    color: 'bg-black',
    icon: '🎵'
  },
  youtube: {
    name: 'YouTube',
    color: 'bg-red-600',
    icon: '📺'
  },
  linkedin_company: {
    name: 'LinkedIn Company',
    color: 'bg-blue-700',
    icon: '💼'
  },
  twitter: {
    name: 'X (Twitter)',
    color: 'bg-black',
    icon: '𝕏'
  },
  threads: {
    name: 'Threads',
    color: 'bg-black',
    icon: '🧵'
  },
  snapchat_business: {
    name: 'Snapchat Business',
    color: 'bg-yellow-400',
    icon: '👻'
  }
};

const statusConfig = {
  connected: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  disconnected: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted/20' },
  needs_reauth: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  pending: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10' }
};

const healthConfig = {
  healthy: { color: 'text-success', bg: 'bg-success/10' },
  warning: { color: 'text-warning', bg: 'bg-warning/10' },
  critical: { color: 'text-destructive', bg: 'bg-destructive/10' },
  unknown: { color: 'text-muted-foreground', bg: 'bg-muted/20' }
};

export function PlatformCard({ 
  account, 
  platform, 
  onConnect, 
  onDisconnect, 
  onRefresh 
}: PlatformCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const config = platformConfig[platform];
  const StatusIcon = account ? statusConfig[account.connection_status].icon : WifiOff;
  const statusColors = account ? statusConfig[account.connection_status] : statusConfig.disconnected;
  const healthColors = account ? healthConfig[account.health_status] : healthConfig.unknown;

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect(platform);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
      <div className={`h-2 ${config.color}`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-white text-lg font-semibold`}>
              {config.icon}
            </div>
            <div>
              <CardTitle className="text-base">{config.name}</CardTitle>
              {account && (
                <p className="text-sm text-muted-foreground">
                  @{account.account_username || account.account_name}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${statusColors.bg} ${statusColors.color} border-0`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {account?.connection_status || 'disconnected'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {account ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={account.account_avatar_url} />
                  <AvatarFallback>
                    {account.account_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{account.account_name}</p>
                  {account.client_name && (
                    <p className="text-xs text-muted-foreground">
                      Client: {account.client_name}
                    </p>
                  )}
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className={`${healthColors.bg} ${healthColors.color} border-0 text-xs`}
              >
                {account.health_status}
              </Badge>
            </div>

            {account.health_issues && Array.isArray(account.health_issues) && account.health_issues.length > 0 && (
              <div className="bg-warning/10 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning">Health Issues</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {account.health_issues.slice(0, 2).map((issue: any, index: number) => (
                    <li key={index}>• {issue.message || issue}</li>
                  ))}
                  {account.health_issues.length > 2 && (
                    <li>• +{account.health_issues.length - 2} more issues</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              {account.connection_status === 'needs_reauth' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onRefresh(account.account_id)}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconnect
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDisconnect(account.account_id)}
                className={account.connection_status === 'needs_reauth' ? 'flex-1' : 'w-full'}
              >
                <Unlink className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <WifiOff className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Connect your {config.name} account to start managing posts
            </p>
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}