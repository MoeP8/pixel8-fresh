import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Users, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  Shield,
  ShieldCheck,
  ShieldX,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialAccount {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  account_name: string;
  account_username: string;
  account_id: string;
  access_token: string;
  is_active: boolean;
  owner_name: string;
  owner_id: string;
  follower_count?: number;
  profile_image?: string;
  last_post_at?: string;
  account_type: 'personal' | 'business' | 'creator';
  team_role: 'owner' | 'admin' | 'editor' | 'viewer';
}

interface AccountSelectorProps {
  selectedAccounts: string[];
  onAccountsChange: (accountIds: string[]) => void;
  maxSelections?: number;
  filterByPlatform?: string[];
  className?: string;
  accounts?: SocialAccount[];
  isLoading?: boolean;
}

export function AccountSelector({ 
  selectedAccounts, 
  onAccountsChange, 
  maxSelections,
  filterByPlatform,
  className,
  accounts: providedAccounts,
  isLoading: providedLoading
}: AccountSelectorProps) {
  const [localAccounts, setLocalAccounts] = useState<SocialAccount[]>([]);
  
  // Use provided accounts or fallback to local state
  const accounts = providedAccounts || localAccounts;
  const isLoading = providedLoading || false;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterOwner, setFilterOwner] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInactive, setShowInactive] = useState(false);

  // Mock data fallback - only used if no accounts provided
  useEffect(() => {
    if (!providedAccounts) {
      const mockAccounts: SocialAccount[] = [
        // Moe's accounts
        {
          id: 'moe-ig-1',
          platform: 'instagram',
          account_name: 'Pixel8 Agency',
          account_username: '@pixel8agency',
          account_id: 'pixel8_agency_ig',
          access_token: 'mock_token_1',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: 'moe-123',
          follower_count: 15420,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'owner'
        },
        {
          id: 'moe-fb-1',
          platform: 'facebook',
          account_name: 'Pixel8 Digital',
          account_username: 'pixel8digital',
          account_id: 'pixel8_digital_fb',
          access_token: 'mock_token_2',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: 'moe-123',
          follower_count: 8760,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'owner'
        },
        {
          id: 'moe-twitter-1',
          platform: 'twitter',
          account_name: 'Pixel8 Studios',
          account_username: '@pixel8studios',
          account_id: 'pixel8_studios_tw',
          access_token: 'mock_token_3',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: 'moe-123',
          follower_count: 5240,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'owner'
        },
        {
          id: 'moe-linkedin-1',
          platform: 'linkedin',
          account_name: 'Moe EZ - CEO',
          account_username: 'moeez-ceo',
          account_id: 'moeez_ceo_li',
          access_token: 'mock_token_4',
          is_active: true,
          owner_name: 'Moe EZ',
          owner_id: 'moe-123',
          follower_count: 3420,
          profile_image: '/api/placeholder/40/40',
          account_type: 'personal',
          team_role: 'owner'
        },
        // Team member accounts
        {
          id: 'sarah-ig-1',
          platform: 'instagram',
          account_name: 'TechCorp Official',
          account_username: '@techcorp_official',
          account_id: 'techcorp_official_ig',
          access_token: 'mock_token_5',
          is_active: true,
          owner_name: 'Sarah Chen',
          owner_id: 'sarah-456',
          follower_count: 42300,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'admin'
        },
        {
          id: 'alex-twitter-1',
          platform: 'twitter',
          account_name: 'GreenEnergy Co',
          account_username: '@greenenergy_co',
          account_id: 'greenenergy_co_tw',
          access_token: 'mock_token_6',
          is_active: false,
          owner_name: 'Alex Rodriguez',
          owner_id: 'alex-789',
          follower_count: 18900,
          profile_image: '/api/placeholder/40/40',
          account_type: 'business',
          team_role: 'editor'
        }
      ];
      setLocalAccounts(mockAccounts);
    }
  }, [providedAccounts]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'facebook': return 'bg-blue-600';
      case 'twitter': return 'bg-sky-500';
      case 'linkedin': return 'bg-blue-800';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <ShieldCheck className="h-3 w-3 text-green-500" />;
      case 'admin': return <Shield className="h-3 w-3 text-blue-500" />;
      case 'editor': return <Eye className="h-3 w-3 text-yellow-500" />;
      case 'viewer': return <Lock className="h-3 w-3 text-gray-500" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'border-green-400 text-green-600 bg-green-50';
      case 'admin': return 'border-blue-400 text-blue-600 bg-blue-50';
      case 'editor': return 'border-yellow-400 text-yellow-600 bg-yellow-50';
      case 'viewer': return 'border-gray-400 text-gray-600 bg-gray-50';
      default: return 'border-gray-400 text-gray-600 bg-gray-50';
    }
  };

  const canUserPublish = (role: string) => {
    return ['owner', 'admin', 'editor'].includes(role);
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.account_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = filterPlatform === 'all' || account.platform === filterPlatform;
    const matchesOwner = filterOwner === 'all' || account.owner_id === filterOwner;
    const matchesActive = showInactive || account.is_active;
    const matchesPlatformFilter = !filterByPlatform || filterByPlatform.includes(account.platform);

    return matchesSearch && matchesPlatform && matchesOwner && matchesActive && matchesPlatformFilter;
  });

  const uniqueOwners = Array.from(new Set(accounts.map(acc => acc.owner_name)));

  const handleAccountToggle = (accountId: string) => {
    const isSelected = selectedAccounts.includes(accountId);
    
    if (isSelected) {
      onAccountsChange(selectedAccounts.filter(id => id !== accountId));
    } else {
      if (maxSelections && selectedAccounts.length >= maxSelections) {
        return; // Don't allow more selections
      }
      onAccountsChange([...selectedAccounts, accountId]);
    }
  };

  const handleSelectAll = () => {
    const visibleAccountIds = filteredAccounts.map(acc => acc.id);
    onAccountsChange(visibleAccountIds);
  };

  const handleClearAll = () => {
    onAccountsChange([]);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Accounts
            {selectedAccounts.length > 0 && (
              <Badge variant="secondary">
                {selectedAccounts.length} selected
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts, usernames, or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="platform-filter">Platform</Label>
              <select
                id="platform-filter"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div className="flex-1">
              <Label htmlFor="owner-filter">Owner</Label>
              <select
                id="owner-filter"
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
              >
                <option value="all">All Team Members</option>
                {uniqueOwners.map(owner => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All Visible
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading accounts...</span>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map(account => {
              const isSelected = selectedAccounts.includes(account.id);
              const isDisabled = maxSelections && selectedAccounts.length >= maxSelections && !isSelected;
              const canPublish = canUserPublish(account.team_role);
              const isAccountDisabled = isDisabled || !canPublish;

              return (
                <Card
                  key={account.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    isSelected && "ring-2 ring-primary bg-primary/5",
                    !account.is_active && "opacity-60",
                    isAccountDisabled && "opacity-40 cursor-not-allowed",
                    !canPublish && "border-gray-300 bg-gray-50"
                  )}
                  onClick={() => !isAccountDisabled && handleAccountToggle(account.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg text-white", getPlatformColor(account.platform))}>
                          {getPlatformIcon(account.platform)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{account.account_name}</h4>
                          <p className="text-xs text-muted-foreground">{account.account_username}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                      {!account.is_active && <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Owner</span>
                        <span className="font-medium">{account.owner_name}</span>
                      </div>
                      
                      {account.follower_count && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Followers</span>
                          <span className="font-medium">{account.follower_count.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge variant={account.account_type === 'business' ? 'default' : 'secondary'} className="text-xs">
                          {account.account_type}
                        </Badge>
                        <Badge variant="outline" className={cn("text-xs flex items-center gap-1", getRoleColor(account.team_role))}>
                          {getRoleIcon(account.team_role)}
                          {account.team_role}
                        </Badge>
                      </div>
                      
                      {!canPublish && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                          <ShieldX className="h-3 w-3" />
                          <span>View only - cannot publish</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAccounts.map(account => {
              const isSelected = selectedAccounts.includes(account.id);
              const isDisabled = maxSelections && selectedAccounts.length >= maxSelections && !isSelected;
              const canPublish = canUserPublish(account.team_role);
              const isAccountDisabled = isDisabled || !canPublish;

              return (
                <div
                  key={account.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50",
                    isSelected && "bg-primary/5 border-primary",
                    !account.is_active && "opacity-60",
                    isAccountDisabled && "opacity-40 cursor-not-allowed",
                    !canPublish && "border-gray-300 bg-gray-50"
                  )}
                  onClick={() => !isAccountDisabled && handleAccountToggle(account.id)}
                >
                  <div className={cn("p-2 rounded-lg text-white", getPlatformColor(account.platform))}>
                    {getPlatformIcon(account.platform)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{account.account_name}</span>
                      <span className="text-sm text-muted-foreground">{account.account_username}</span>
                      {!account.is_active && <AlertCircle className="h-4 w-4 text-warning" />}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Owner: {account.owner_name}</span>
                      {account.follower_count && <span>{account.follower_count.toLocaleString()} followers</span>}
                      <Badge variant="outline" className={cn("text-xs flex items-center gap-1", getRoleColor(account.team_role))}>
                        {getRoleIcon(account.team_role)}
                        {account.team_role}
                      </Badge>
                      {!canPublish && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <ShieldX className="h-3 w-3" />
                          <span>View only</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
              );
            })}
          </div>
        )}

        {filteredAccounts.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No accounts found matching your filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}