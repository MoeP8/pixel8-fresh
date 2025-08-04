import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdAccount } from "@/hooks/useAdsManagement";
import { Plus, Settings, RefreshCw, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { format } from 'date-fns';

interface AdAccountsManagerProps {
  adAccounts: AdAccount[];
  loading: boolean;
}

export function AdAccountsManager({ adAccounts, loading }: AdAccountsManagerProps) {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    account_id: '',
    account_name: '',
    currency: 'USD',
    timezone: 'UTC',
    daily_budget_limit: '',
    monthly_budget_limit: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement OAuth flow for account connection
    console.log('Add account:', formData);
    setIsAddAccountOpen(false);
    setFormData({
      platform: '',
      account_id: '',
      account_name: '',
      currency: 'USD',
      timezone: 'UTC',
      daily_budget_limit: '',
      monthly_budget_limit: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'disabled':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };


  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'google_ads': return 'bg-blue-500';
      case 'meta': return 'bg-blue-600';
      case 'microsoft_ads': return 'bg-green-600';
      case 'linkedin': return 'bg-blue-700';
      case 'tiktok': return 'bg-black';
      default: return 'bg-gray-500';
    }
  };

  const handleSync = async (accountId: string) => {
    // TODO: Implement account sync
    console.log('Syncing account:', accountId);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ad Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ad Accounts</CardTitle>
            <CardDescription>Manage connected advertising accounts across platforms</CardDescription>
          </div>
          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Connect Ad Account</DialogTitle>
                <DialogDescription>
                  Connect a new advertising account to manage campaigns
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google_ads">Google Ads</SelectItem>
                      <SelectItem value="meta">Meta (Facebook & Instagram)</SelectItem>
                      <SelectItem value="microsoft_ads">Microsoft Ads</SelectItem>
                      <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                      <SelectItem value="tiktok">TikTok Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="account_name">Account Name</Label>
                  <Input
                    id="account_name"
                    value={formData.account_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                    placeholder="My Business Account"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern</SelectItem>
                        <SelectItem value="America/Chicago">Central</SelectItem>
                        <SelectItem value="America/Denver">Mountain</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="daily_budget_limit">Daily Budget Limit</Label>
                    <Input
                      id="daily_budget_limit"
                      type="number"
                      step="0.01"
                      value={formData.daily_budget_limit}
                      onChange={(e) => setFormData(prev => ({ ...prev, daily_budget_limit: e.target.value }))}
                      placeholder="1000.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly_budget_limit">Monthly Budget Limit</Label>
                    <Input
                      id="monthly_budget_limit"
                      type="number"
                      step="0.01"
                      value={formData.monthly_budget_limit}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthly_budget_limit: e.target.value }))}
                      placeholder="30000.00"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Connect Account</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {adAccounts.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget Limits</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{account.account_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {account.account_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getPlatformBadgeColor(account.platform)} text-white border-none`}
                      >
                        {account.platform.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(account.account_status)}
                        <span className="capitalize">{account.account_status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {account.daily_budget_limit && (
                          <div>Daily: {account.currency} {account.daily_budget_limit}</div>
                        )}
                        {account.monthly_budget_limit && (
                          <div>Monthly: {account.currency} {account.monthly_budget_limit}</div>
                        )}
                        {!account.daily_budget_limit && !account.monthly_budget_limit && (
                          <span className="text-muted-foreground">No limits set</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {account.last_sync_at ? (
                          format(new Date(account.last_sync_at), 'MMM dd, HH:mm')
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSync(account.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Ad Accounts Connected</h3>
            <p className="text-muted-foreground mb-4">
              Connect your first advertising account to start managing campaigns.
            </p>
            <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Account
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}