import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdAccount, AdCampaign } from "@/hooks/useAdsManagement";
import { Plus, Sparkles, Target, Zap } from "lucide-react";

interface CampaignCreatorProps {
  clientId: string;
  adAccounts: AdAccount[];
  onCampaignCreate: (campaign: Omit<AdCampaign, 'id' | 'created_at' | 'updated_at'>) => Promise<AdCampaign>;
}

export function CampaignCreator({ clientId, adAccounts, onCampaignCreate }: CampaignCreatorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ad_account_id: '',
    campaign_name: '',
    campaign_type: '',
    objective: '',
    daily_budget: '',
    total_budget: '',
    bid_strategy: '',
    target_cpa: '',
    target_roas: '',
    start_date: '',
    end_date: '',
    targeting_keywords: '',
    audience_description: '',
    ad_copy_brief: ''
  });

  const [aiSuggestions, setAiSuggestions] = useState({
    campaign_name: '',
    keywords: [],
    ad_copy: {
      headlines: [],
      descriptions: []
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const campaignData = {
        ad_account_id: formData.ad_account_id,
        client_id: clientId,
        platform_campaign_id: `temp_${Date.now()}`, // Will be replaced when synced with platform
        campaign_name: formData.campaign_name,
        campaign_type: formData.campaign_type,
        campaign_status: 'draft' as const,
        objective: formData.objective,
        daily_budget: formData.daily_budget ? parseFloat(formData.daily_budget) : undefined,
        total_budget: formData.total_budget ? parseFloat(formData.total_budget) : undefined,
        bid_strategy: formData.bid_strategy,
        target_cpa: formData.target_cpa ? parseFloat(formData.target_cpa) : undefined,
        target_roas: formData.target_roas ? parseFloat(formData.target_roas) : undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        targeting_data: {
          keywords: formData.targeting_keywords.split(',').map(k => k.trim()).filter(Boolean),
          audience_description: formData.audience_description
        },
        campaign_settings: {},
        brand_compliance_score: 85, // Default score, will be calculated later
        automation_rules: []
      };

      await onCampaignCreate(campaignData);
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ad_account_id: '',
      campaign_name: '',
      campaign_type: '',
      objective: '',
      daily_budget: '',
      total_budget: '',
      bid_strategy: '',
      target_cpa: '',
      target_roas: '',
      start_date: '',
      end_date: '',
      targeting_keywords: '',
      audience_description: '',
      ad_copy_brief: ''
    });
  };

  const generateAISuggestions = async () => {
    // TODO: Implement AI-powered campaign suggestions
    setAiSuggestions({
      campaign_name: `${formData.objective.charAt(0).toUpperCase() + formData.objective.slice(1)} Campaign - ${new Date().getFullYear()}`,
      keywords: ['digital marketing', 'online advertising', 'brand awareness', 'lead generation'],
      ad_copy: {
        headlines: [
          'Boost Your Business Today',
          'Get Results That Matter',
          'Transform Your Marketing'
        ],
        descriptions: [
          'Discover proven strategies that drive real results for your business.',
          'Join thousands of satisfied customers who trust our solutions.'
        ]
      }
    });
  };

  const applySuggestion = (field: string, value: any) => {
    if (field === 'campaign_name') {
      setFormData(prev => ({ ...prev, campaign_name: value }));
    } else if (field === 'keywords') {
      setFormData(prev => ({ ...prev, targeting_keywords: value.join(', ') }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>Create and manage advertising campaigns across platforms</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAIAssistOpen} onOpenChange={setIsAIAssistOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>AI Campaign Assistant</DialogTitle>
                    <DialogDescription>
                      Get AI-powered suggestions for your campaign setup
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label>Campaign Objective</Label>
                      <Select value={formData.objective} onValueChange={(value) => setFormData(prev => ({ ...prev, objective: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select objective" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="awareness">Brand Awareness</SelectItem>
                          <SelectItem value="traffic">Website Traffic</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="leads">Lead Generation</SelectItem>
                          <SelectItem value="sales">Sales/Conversions</SelectItem>
                          <SelectItem value="app_promotion">App Promotion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Target Audience Description</Label>
                      <Textarea
                        value={formData.audience_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, audience_description: e.target.value }))}
                        placeholder="Describe your target audience (demographics, interests, behaviors...)"
                      />
                    </div>

                    <div>
                      <Label>Ad Copy Brief</Label>
                      <Textarea
                        value={formData.ad_copy_brief}
                        onChange={(e) => setFormData(prev => ({ ...prev, ad_copy_brief: e.target.value }))}
                        placeholder="Describe your product/service and key messaging points..."
                      />
                    </div>

                    <Button onClick={generateAISuggestions} className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Generate AI Suggestions
                    </Button>

                    {aiSuggestions.campaign_name && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-semibold">AI Suggestions</h4>
                        
                        <div>
                          <Label>Campaign Name</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input value={aiSuggestions.campaign_name} readOnly />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => applySuggestion('campaign_name', aiSuggestions.campaign_name)}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label>Suggested Keywords</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {aiSuggestions.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer">
                                {keyword}
                              </Badge>
                            ))}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => applySuggestion('keywords', aiSuggestions.keywords)}
                            >
                              Apply All
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Set up a new advertising campaign with targeting and budget settings
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ad_account_id">Ad Account</Label>
                        <Select value={formData.ad_account_id} onValueChange={(value) => setFormData(prev => ({ ...prev, ad_account_id: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {adAccounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.account_name} ({account.platform.replace('_', ' ').toUpperCase()})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="campaign_name">Campaign Name</Label>
                        <Input
                          id="campaign_name"
                          value={formData.campaign_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, campaign_name: e.target.value }))}
                          placeholder="Summer Sale Campaign"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="campaign_type">Campaign Type</Label>
                        <Select value={formData.campaign_type} onValueChange={(value) => setFormData(prev => ({ ...prev, campaign_type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="search">Search</SelectItem>
                            <SelectItem value="display">Display</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="shopping">Shopping</SelectItem>
                            <SelectItem value="performance_max">Performance Max</SelectItem>
                            <SelectItem value="facebook_ads">Facebook Ads</SelectItem>
                            <SelectItem value="instagram_ads">Instagram Ads</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="objective">Objective</Label>
                        <Select value={formData.objective} onValueChange={(value) => setFormData(prev => ({ ...prev, objective: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select objective" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="awareness">Brand Awareness</SelectItem>
                            <SelectItem value="traffic">Website Traffic</SelectItem>
                            <SelectItem value="engagement">Engagement</SelectItem>
                            <SelectItem value="leads">Lead Generation</SelectItem>
                            <SelectItem value="sales">Sales/Conversions</SelectItem>
                            <SelectItem value="app_promotion">App Promotion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="daily_budget">Daily Budget</Label>
                        <Input
                          id="daily_budget"
                          type="number"
                          step="0.01"
                          value={formData.daily_budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, daily_budget: e.target.value }))}
                          placeholder="100.00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="total_budget">Total Budget</Label>
                        <Input
                          id="total_budget"
                          type="number"
                          step="0.01"
                          value={formData.total_budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, total_budget: e.target.value }))}
                          placeholder="3000.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bid_strategy">Bid Strategy</Label>
                      <Select value={formData.bid_strategy} onValueChange={(value) => setFormData(prev => ({ ...prev, bid_strategy: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpc">Cost Per Click (CPC)</SelectItem>
                          <SelectItem value="cpm">Cost Per Mille (CPM)</SelectItem>
                          <SelectItem value="cpa">Cost Per Acquisition (CPA)</SelectItem>
                          <SelectItem value="roas">Return on Ad Spend (ROAS)</SelectItem>
                          <SelectItem value="maximize_clicks">Maximize Clicks</SelectItem>
                          <SelectItem value="target_cpa">Target CPA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="targeting_keywords">Keywords (comma-separated)</Label>
                      <Textarea
                        id="targeting_keywords"
                        value={formData.targeting_keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, targeting_keywords: e.target.value }))}
                        placeholder="digital marketing, online advertising, brand awareness"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Campaign'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {adAccounts.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Ad Accounts Connected</h3>
              <p className="text-muted-foreground">
                Connect an advertising account first to create campaigns.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Create Campaigns</h3>
              <p className="text-muted-foreground mb-4">
                Use the Create Campaign button to get started with AI-powered campaign setup.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}