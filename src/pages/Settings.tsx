import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
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
    <DashboardLayout title="Settings" showSearch={false}>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Settings Navigation - Fixed Left Column */}
        <div className="w-80 border-r border-border bg-card">
          <SettingsNavigation 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Settings Content - Scrollable Right Column */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-4xl">
            {renderSection()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;