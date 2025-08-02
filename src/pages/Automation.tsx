import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Workflow, 
  Clock, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  Edit, 
  Copy,
  Plus,
  Filter,
  Calendar,
  Hash,
  Share,
  Bell
} from "lucide-react";

const Automation = () => {
  const [activeTab, setActiveTab] = useState("active");

  // Mock automation data
  const automations = [
    {
      id: 1,
      name: "Daily Quote Posts",
      description: "Automatically post inspirational quotes every morning at 9 AM",
      status: "active",
      trigger: "Time-based",
      frequency: "Daily",
      platforms: ["Instagram", "Twitter"],
      lastRun: "Today, 9:00 AM",
      nextRun: "Tomorrow, 9:00 AM",
      postsCreated: 47,
      engagement: "12.3%"
    },
    {
      id: 2,
      name: "Hashtag Research & Auto-tag",
      description: "Analyze trending hashtags and automatically add relevant ones to posts",
      status: "draft",
      trigger: "Content upload",
      frequency: "On demand",
      platforms: ["Instagram", "TikTok"],
      lastRun: "Never",
      nextRun: "On trigger",
      postsCreated: 0,
      engagement: "0%"
    },
    {
      id: 3,
      name: "Cross-Platform Sharing",
      description: "Automatically share Instagram posts to Facebook and Twitter",
      status: "paused",
      trigger: "Instagram post",
      frequency: "Real-time",
      platforms: ["Facebook", "Twitter"],
      lastRun: "2 days ago",
      nextRun: "Paused",
      postsCreated: 23,
      engagement: "8.7%"
    },
    {
      id: 4,
      name: "Weekly Performance Report",
      description: "Generate and email weekly analytics reports every Monday",
      status: "active",
      trigger: "Time-based",
      frequency: "Weekly",
      platforms: ["Email"],
      lastRun: "Monday, 8:00 AM",
      nextRun: "Next Monday, 8:00 AM",
      postsCreated: 0,
      engagement: "N/A"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "warning";
      case "paused": return "secondary";
      default: return "secondary";
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "Time-based": return <Clock className="w-4 h-4" />;
      case "Content upload": return <Share className="w-4 h-4" />;
      case "Instagram post": return <Hash className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const filteredAutomations = automations.filter(automation => {
    if (activeTab === "all") return true;
    return automation.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Automation Hub</h1>
          <p className="text-slate-300">
            Set up automated workflows, triggers, and rules to streamline your social media management
          </p>
        </div>
        
        <div className="flex gap-3">
          <GlassButton variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </GlassButton>
          <GlassButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Automation
          </GlassButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Active Workflows</p>
              <p className="text-white text-2xl font-bold">2</p>
            </div>
            <Workflow className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Posts Automated</p>
              <p className="text-white text-2xl font-bold">70</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Time Saved</p>
              <p className="text-white text-2xl font-bold">24h</p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Success Rate</p>
              <p className="text-white text-2xl font-bold">98%</p>
            </div>
            <Bell className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
      </div>

      {/* Automation Tabs */}
      <GlassCard className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Automation Workflows</CardTitle>
            <div className="flex gap-2">
              {["active", "draft", "paused", "all"].map((tab) => (
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

      {/* Automation List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => (
          <GlassCard key={automation.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-white font-semibold text-lg">{automation.name}</h3>
                  <GlassBadge variant={getStatusColor(automation.status) as any}>
                    {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
                  </GlassBadge>
                  <GlassBadge variant="outline" size="sm">
                    {getTriggerIcon(automation.trigger)}
                    {automation.trigger}
                  </GlassBadge>
                </div>
                
                <p className="text-slate-300 text-sm mb-4">{automation.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-slate-400">Frequency</p>
                    <p className="text-white">{automation.frequency}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Last Run</p>
                    <p className="text-white">{automation.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Next Run</p>
                    <p className="text-white">{automation.nextRun}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Posts Created</p>
                    <p className="text-white">{automation.postsCreated}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Avg Engagement</p>
                    <p className="text-white">{automation.engagement}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Platforms</p>
                    <p className="text-white">{automation.platforms.length}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {automation.platforms.map((platform) => (
                    <GlassBadge key={platform} variant="secondary" size="sm">
                      {platform}
                    </GlassBadge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <GlassButton variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </GlassButton>
                <GlassButton variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </GlassButton>
                <GlassButton variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </GlassButton>
                <GlassButton 
                  variant={automation.status === "active" ? "warning" : "primary"} 
                  size="sm"
                >
                  {automation.status === "active" ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Start Templates */}
      <GlassCard className="mt-8">
        <CardHeader>
          <CardTitle className="text-white">Quick Start Templates</CardTitle>
          <p className="text-slate-300 text-sm">
            Get started quickly with pre-built automation templates
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-blue-400" />
                <h4 className="text-white font-medium">Schedule Posts</h4>
              </div>
              <p className="text-slate-300 text-sm">Automatically publish content at optimal times</p>
            </GlassCard>
            
            <GlassCard className="p-4 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Hash className="w-6 h-6 text-green-400" />
                <h4 className="text-white font-medium">Auto Hashtags</h4>
              </div>
              <p className="text-slate-300 text-sm">Add trending hashtags to your posts automatically</p>
            </GlassCard>
            
            <GlassCard className="p-4 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Share className="w-6 h-6 text-purple-400" />
                <h4 className="text-white font-medium">Cross-Post</h4>
              </div>
              <p className="text-slate-300 text-sm">Share content across multiple platforms instantly</p>
            </GlassCard>
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
};

export default Automation;