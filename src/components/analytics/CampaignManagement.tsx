import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, TrendingUp, Target, Calendar } from "lucide-react";
import { useAnalytics, type CampaignAnalytics } from "@/hooks/useAnalytics";
import { format } from 'date-fns';

interface CampaignManagementProps {
  clientId: string;
  campaigns: CampaignAnalytics[];
  onCampaignCreate: (campaign: Omit<CampaignAnalytics, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
  onCampaignUpdate: (id: string, updates: Partial<CampaignAnalytics>) => Promise<any>;
  loading?: boolean;
}

export function CampaignManagement({ 
  clientId, 
  campaigns, 
  onCampaignCreate, 
  onCampaignUpdate,
  loading = false
}: CampaignManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignAnalytics | null>(null);
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: 'general',
    start_date: '',
    end_date: '',
    target_posts: 0,
    target_engagement: 0,
    brand_kpis: {} as any
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaignData = {
      client_id: clientId,
      campaign_name: formData.campaign_name,
      campaign_type: formData.campaign_type,
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      total_posts: 0,
      total_engagement: 0,
      brand_consistency_avg: 0,
      content_pillar_distribution: {},
      platform_performance: {},
      roi_metrics: {
        target_posts: formData.target_posts,
        target_engagement: formData.target_engagement
      },
      brand_kpis: formData.brand_kpis,
      is_active: true
    };

    try {
      if (editingCampaign) {
        await onCampaignUpdate(editingCampaign.id, campaignData);
        setEditingCampaign(null);
      } else {
        await onCampaignCreate(campaignData);
        setIsCreateOpen(false);
      }
      
      setFormData({
        campaign_name: '',
        campaign_type: 'general',
        start_date: '',
        end_date: '',
        target_posts: 0,
        target_engagement: 0,
        brand_kpis: {}
      });
    } catch (error) {
      console.error('Error managing campaign:', error);
    }
  };

  const openEditDialog = (campaign: CampaignAnalytics) => {
    setEditingCampaign(campaign);
    setFormData({
      campaign_name: campaign.campaign_name,
      campaign_type: campaign.campaign_type,
      start_date: campaign.start_date,
      end_date: campaign.end_date || '',
      target_posts: campaign.roi_metrics?.target_posts || 0,
      target_engagement: campaign.roi_metrics?.target_engagement || 0,
      brand_kpis: campaign.brand_kpis || {}
    });
  };

  const getStatusBadge = (campaign: CampaignAnalytics) => {
    const now = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = campaign.end_date ? new Date(campaign.end_date) : null;

    if (!campaign.is_active) return <Badge variant="secondary">Inactive</Badge>;
    if (now < startDate) return <Badge variant="outline">Scheduled</Badge>;
    if (endDate && now > endDate) return <Badge variant="secondary">Completed</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  const calculateProgress = (campaign: CampaignAnalytics) => {
    const targetPosts = campaign.roi_metrics?.target_posts || 0;
    const targetEngagement = campaign.roi_metrics?.target_engagement || 0;
    
    const postProgress = targetPosts > 0 ? (campaign.total_posts / targetPosts) * 100 : 0;
    const engagementProgress = targetEngagement > 0 ? (campaign.total_engagement / targetEngagement) * 100 : 0;
    
    return {
      posts: Math.min(Math.round(postProgress), 100),
      engagement: Math.min(Math.round(engagementProgress), 100)
    };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Brand Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            <CardTitle>Campaign Management</CardTitle>
            <CardDescription>Create and track brand-aware campaigns</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new campaign with brand objectives and KPIs
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="campaign_name">Campaign Name</Label>
                  <Input
                    id="campaign_name"
                    value={formData.campaign_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, campaign_name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="campaign_type">Campaign Type</Label>
                  <Select 
                    value={formData.campaign_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, campaign_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="product_launch">Product Launch</SelectItem>
                      <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
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
                      required
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target_posts">Target Posts</Label>
                    <Input
                      id="target_posts"
                      type="number"
                      value={formData.target_posts}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_posts: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_engagement">Target Engagement</Label>
                    <Input
                      id="target_engagement"
                      type="number"
                      value={formData.target_engagement}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_engagement: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Campaign</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Brand Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const progress = calculateProgress(campaign);
                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.campaign_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(campaign.start_date), 'MMM dd, yyyy')}
                          {campaign.end_date && ` - ${format(new Date(campaign.end_date), 'MMM dd, yyyy')}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {campaign.campaign_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-3 w-3" />
                          <span>Posts: {progress.posts}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-3 w-3" />
                          <span>Engagement: {progress.engagement}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {Math.round(campaign.brand_consistency_avg)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Consistency</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Edit Campaign Dialog */}
        <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Campaign</DialogTitle>
              <DialogDescription>
                Update campaign details and targets
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Same form fields as create, but populated with existing data */}
              <div>
                <Label htmlFor="edit_campaign_name">Campaign Name</Label>
                <Input
                  id="edit_campaign_name"
                  value={formData.campaign_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaign_name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit_campaign_type">Campaign Type</Label>
                <Select 
                  value={formData.campaign_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, campaign_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="product_launch">Product Launch</SelectItem>
                    <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_start_date">Start Date</Label>
                  <Input
                    id="edit_start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_end_date">End Date</Label>
                  <Input
                    id="edit_end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingCampaign(null)}>
                  Cancel
                </Button>
                <Button type="submit">Update Campaign</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}