import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Calendar, 
  Users, 
  TrendingUp, 
  Play, 
  Pause, 
  Edit, 
  BarChart3,
  Plus,
  Filter
} from "lucide-react";

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState("active");

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: "Summer Collection Launch",
      status: "active",
      budget: "$5,000",
      spent: "$3,200",
      reach: "125K",
      engagement: "8.5%",
      startDate: "Jun 15, 2024",
      endDate: "Aug 30, 2024",
      platforms: ["Instagram", "Facebook", "TikTok"]
    },
    {
      id: 2,
      name: "Back to School Promo",
      status: "draft",
      budget: "$3,500",
      spent: "$0",
      reach: "0",
      engagement: "0%",
      startDate: "Aug 1, 2024",
      endDate: "Sep 15, 2024",
      platforms: ["Instagram", "YouTube"]
    },
    {
      id: 3,
      name: "Holiday Campaign 2024",
      status: "scheduled",
      budget: "$8,000",
      spent: "$0",
      reach: "0",
      engagement: "0%",
      startDate: "Nov 1, 2024",
      endDate: "Dec 31, 2024",
      platforms: ["Instagram", "Facebook", "TikTok", "YouTube"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "warning";
      case "scheduled": return "primary";
      case "completed": return "secondary";
      default: return "secondary";
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === "all") return true;
    return campaign.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaign Management</h1>
          <p className="text-slate-300">
            Create, manage, and track multi-platform social media campaigns
          </p>
        </div>
        
        <div className="flex gap-3">
          <GlassButton variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </GlassButton>
          <GlassButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </GlassButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Active Campaigns</p>
              <p className="text-white text-2xl font-bold">3</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Reach</p>
              <p className="text-white text-2xl font-bold">125K</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Avg Engagement</p>
              <p className="text-white text-2xl font-bold">8.5%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Budget Utilized</p>
              <p className="text-white text-2xl font-bold">64%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-400" />
          </div>
        </GlassCard>
      </div>

      {/* Campaign Tabs */}
      <GlassCard className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Campaigns</CardTitle>
            <div className="flex gap-2">
              {["active", "draft", "scheduled", "all"].map((tab) => (
                <GlassButton
                  key={tab}
                  variant={activeTab === tab ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </GlassButton>
              ))}
            </div>
          </div>
        </CardHeader>
      </GlassCard>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <GlassCard key={campaign.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-semibold text-lg">{campaign.name}</h3>
                  <GlassBadge variant={getStatusColor(campaign.status) as any}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </GlassBadge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Budget</p>
                    <p className="text-white">{campaign.budget}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Spent</p>
                    <p className="text-white">{campaign.spent}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Reach</p>
                    <p className="text-white">{campaign.reach}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Engagement</p>
                    <p className="text-white">{campaign.engagement}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Duration</p>
                    <p className="text-white">{campaign.startDate} - {campaign.endDate}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  {campaign.platforms.map((platform) => (
                    <GlassBadge key={platform} variant="secondary" size="sm">
                      {platform}
                    </GlassBadge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <GlassButton variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </GlassButton>
                <GlassButton 
                  variant={campaign.status === "active" ? "warning" : "primary"} 
                  size="sm"
                >
                  {campaign.status === "active" ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </GlassButton>
                <GlassButton variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4" />
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;