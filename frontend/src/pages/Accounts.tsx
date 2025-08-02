import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, Wifi, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { PlatformCard } from '@/components/social-accounts/PlatformCard';
import { ClientFilter } from '@/components/social-accounts/ClientFilter';
import { useSocialAccounts } from '@/hooks/useSocialAccounts';
import { SocialPlatform } from '@/types/social-accounts';

const SUPPORTED_PLATFORMS: SocialPlatform[] = [
  'instagram_business',
  'facebook_pages',
  'tiktok_business',
  'youtube',
  'linkedin_company',
  'twitter',
  'threads',
  'snapchat_business'
];

const Accounts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { 
    accounts, 
    guidelines, 
    loading, 
    error, 
    connectAccount, 
    disconnectAccount, 
    refreshConnection,
    refetch 
  } = useSocialAccounts();

  // Filter accounts based on search and client selection
  const filteredAccounts = useMemo(() => {
    let filtered = accounts;

    // Filter by client
    if (selectedClient === 'unassigned') {
      filtered = filtered.filter(account => !account.client_id);
    } else if (selectedClient) {
      filtered = filtered.filter(account => account.client_id === selectedClient);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(account => 
        account.account_name.toLowerCase().includes(query) ||
        account.account_username?.toLowerCase().includes(query) ||
        account.platform.toLowerCase().includes(query) ||
        account.client_name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [accounts, selectedClient, searchQuery]);

  // Get statistics
  const stats = useMemo(() => {
    const connected = accounts.filter(acc => acc.connection_status === 'connected').length;
    const needsAuth = accounts.filter(acc => acc.connection_status === 'needs_reauth').length;
    const errors = accounts.filter(acc => acc.connection_status === 'error').length;
    const health = {
      healthy: accounts.filter(acc => acc.health_status === 'healthy').length,
      warning: accounts.filter(acc => acc.health_status === 'warning').length,
      critical: accounts.filter(acc => acc.health_status === 'critical').length
    };

    return { connected, needsAuth, errors, health, total: accounts.length };
  }, [accounts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load accounts"
        message="We couldn't load your social media accounts. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Social Media Accounts</h1>
          <p className="text-muted-foreground">
            Manage connections to your social media platforms
          </p>
        </div>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Connected</CardTitle>
              <Wifi className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.connected}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Needs Auth</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.needsAuth}</div>
            <p className="text-xs text-muted-foreground">Require reconnection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Health Issues</CardTitle>
              <Activity className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.health.warning + stats.health.critical}
            </div>
            <p className="text-xs text-muted-foreground">Accounts with issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Badge variant="outline">{stats.total}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <ClientFilter 
          selectedClient={selectedClient}
          onClientSelect={setSelectedClient}
          accounts={accounts}
        />
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Platforms Grid */}
      {accounts.length === 0 ? (
        <EmptyState
          icon={<Wifi className="h-12 w-12 text-muted-foreground" />}
          title="No Connected Accounts"
          description="Connect your first social media account to start managing your posts across platforms."
          action={{
            label: "Connect Account",
            onClick: () => {}
          }}
        />
      ) : filteredAccounts.length === 0 ? (
        <EmptyState
          title="No Matching Accounts"
          description="No accounts match your current filters. Try adjusting your search or client selection."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SUPPORTED_PLATFORMS.map((platform) => {
            const account = filteredAccounts.find(acc => acc.platform === platform);
            return (
              <PlatformCard
                key={platform}
                account={account}
                platform={platform}
                onConnect={connectAccount}
                onDisconnect={disconnectAccount}
                onRefresh={refreshConnection}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Accounts;