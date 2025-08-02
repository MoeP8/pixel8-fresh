import { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { CampaignOverview } from "@/components/ads/CampaignOverview";
import { AdAccountsManager } from "@/components/ads/AdAccountsManager";
import { CampaignCreator } from "@/components/ads/CampaignCreator";
import { PerformanceMonitor } from "@/components/ads/PerformanceMonitor";
import { AutomationRules } from "@/components/ads/AutomationRules";
import { useAdsManagement } from "@/hooks/useAdsManagement";
import { useClients } from "@/hooks/useClients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Zap, TrendingUp, Settings } from "lucide-react";

const AdsManager = () => {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { clients } = useClients();
  const { 
    adAccounts, 
    campaigns, 
    performance, 
    automationRules, 
    loading,
    createCampaign,
    updateCampaign,
    createAutomationRule 
  } = useAdsManagement(selectedClient);

  // Calculate summary stats
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.campaign_status === 'active').length;
  const totalSpend = performance.reduce((sum, p) => sum + p.cost, 0);
  const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);

  return (
    <DashboardLayout title="Ads Manager" showSearch={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ads Management</h1>
            <p className="text-muted-foreground">
              Manage campaigns across Google Ads, Meta, and other platforms
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedClient ? (
          <>
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCampaigns}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeCampaigns} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSpend.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    All campaigns
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Automation Rules</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{automationRules.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {automationRules.filter(r => r.is_active).length} active
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="accounts">Ad Accounts</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="automation">Automation</TabsTrigger>
                </TabsList>
                
                {activeTab === 'campaigns' && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                )}
              </div>

              <TabsContent value="overview" className="space-y-6">
                <CampaignOverview 
                  campaigns={campaigns}
                  performance={performance}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="campaigns" className="space-y-6">
                <CampaignCreator
                  clientId={selectedClient}
                  adAccounts={adAccounts}
                  onCampaignCreate={createCampaign}
                />
              </TabsContent>

              <TabsContent value="accounts" className="space-y-6">
                <AdAccountsManager
                  clientId={selectedClient}
                  adAccounts={adAccounts}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <PerformanceMonitor
                  campaigns={campaigns}
                  performance={performance}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="automation" className="space-y-6">
                <AutomationRules
                  clientId={selectedClient}
                  campaigns={campaigns}
                  automationRules={automationRules}
                  onRuleCreate={createAutomationRule}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Client</h3>
              <p className="text-muted-foreground">
                Choose a client from the dropdown above to start managing their ad campaigns.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdsManager;