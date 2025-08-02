import { cn } from "@/lib/utils";
import type { SettingsSection } from "@/pages/Settings";
import { 
  User, 
  Palette, 
  Plug, 
  Key, 
  Database,
  Users, 
  Bell, 
  Zap, 
  CheckCircle, 
  Shield 
} from "lucide-react";

interface SettingsNavigationProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const navigationItems = [
  {
    id: "profile" as SettingsSection,
    label: "Profile & Account",
    icon: User,
    description: "Personal settings and account management"
  },
  {
    id: "brand-defaults" as SettingsSection,
    label: "Brand Defaults",
    icon: Palette,
    description: "Agency brand settings and client defaults"
  },
  {
    id: "platform-connections" as SettingsSection,
    label: "Platform Connections",
    icon: Plug,
    description: "Social media platform integrations"
  },
  {
    id: "api-integrations" as SettingsSection,
    label: "API Integrations",
    icon: Key,
    description: "Marketing APIs and external services"
  },
  {
    id: "notion-integration" as SettingsSection,
    label: "Notion Integration",
    icon: Database,
    description: "Connect and sync with Notion workspace"
  },
  {
    id: "team-access" as SettingsSection,
    label: "Team Access",
    icon: Users,
    description: "Team members and permissions"
  },
  {
    id: "notifications" as SettingsSection,
    label: "Notifications",
    icon: Bell,
    description: "Email and in-app notification preferences"
  },
  {
    id: "automation-rules" as SettingsSection,
    label: "Automation Rules",
    icon: Zap,
    description: "Performance triggers and content automation"
  },
  {
    id: "approval-workflows" as SettingsSection,
    label: "Approval Workflows",
    icon: CheckCircle,
    description: "Content approval processes and rules"
  },
  {
    id: "security" as SettingsSection,
    label: "Security",
    icon: Shield,
    description: "Authentication and data management"
  }
];

export function SettingsNavigation({ activeSection, onSectionChange }: SettingsNavigationProps) {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account, team, and platform configurations
        </p>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200",
                "hover:bg-accent/50",
                isActive 
                  ? "bg-accent text-accent-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                isActive ? "text-accent-foreground" : "text-muted-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium text-sm",
                  isActive ? "text-accent-foreground" : "text-foreground"
                )}>
                  {item.label}
                </div>
                <div className={cn(
                  "text-xs mt-0.5 line-clamp-2",
                  isActive ? "text-accent-foreground/80" : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}