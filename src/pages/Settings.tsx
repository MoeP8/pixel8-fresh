import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { BrandDefaultsSection } from "@/components/settings/BrandDefaultsSection";
import { PlatformConnectionsSection } from "@/components/settings/PlatformConnectionsSection";
import { ApiIntegrationsSection } from "@/components/settings/ApiIntegrationsSection";
import { TeamAccessSection } from "@/components/settings/TeamAccessSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { AutomationRulesSection } from "@/components/settings/AutomationRulesSection";
import { ApprovalWorkflowsSection } from "@/components/settings/ApprovalWorkflowsSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotionIntegrationSection } from "@/components/settings/NotionIntegrationSection";
import { Settings as SettingsIcon, Save, Download, Upload, Shield, Users, Bell, Zap } from "lucide-react";

export type SettingsSection = 
  | "profile"
  | "brand-defaults"
  | "platform-connections"
  | "api-integrations"
  | "notion-integration"
  | "team-access"
  | "notifications"
  | "automation-rules"
  | "approval-workflows"
  | "security";

const Settings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "brand-defaults":
        return <BrandDefaultsSection />;
      case "platform-connections":
        return <PlatformConnectionsSection />;
      case "api-integrations":
        return <ApiIntegrationsSection />;
      case "notion-integration":
        return <NotionIntegrationSection />;
      case "team-access":
        return <TeamAccessSection />;
      case "notifications":
        return <NotificationsSection />;
      case "automation-rules":
        return <AutomationRulesSection />;
      case "approval-workflows":
        return <ApprovalWorkflowsSection />;
      case "security":
        return <SecuritySection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-300">
            Configure your workspace, integrations, and preferences
          </p>
        </div>
        
        <div className="flex gap-3">
          <GlassButton variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Config
          </GlassButton>
          <GlassButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </GlassButton>
          <GlassButton variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save All
          </GlassButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Connected Accounts</p>
              <p className="text-white text-2xl font-bold">6</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Active Integrations</p>
              <p className="text-white text-2xl font-bold">4</p>
            </div>
            <Zap className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Notifications</p>
              <p className="text-white text-2xl font-bold">12</p>
            </div>
            <Bell className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Security Score</p>
              <p className="text-white text-2xl font-bold">98%</p>
            </div>
            <Shield className="w-8 h-8 text-orange-400" />
          </div>
        </GlassCard>
      </div>

      {/* Settings Content */}
      <div className="flex gap-6 h-[calc(100vh-20rem)]">
        {/* Settings Navigation - Left Column */}
        <GlassCard className="w-80 p-6">
          <SettingsNavigation 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
          />
        </GlassCard>

        {/* Settings Content - Right Column */}
        <GlassCard className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl">
            {renderSection()}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Settings;