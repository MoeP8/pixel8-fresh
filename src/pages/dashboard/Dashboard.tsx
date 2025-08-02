import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Zap,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Home,
  BarChart3,
  Target,
  Bot,
  FolderOpen,
  UserCheck,
  Building2,
  Menu
} from "lucide-react";
import { DashboardWidgets } from "./DashboardWidgets";
import { DashboardMetrics } from "./DashboardMetrics";
import { useScheduling } from "@/hooks/useScheduling";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { useAnalytics } from "@/hooks/useAnalytics";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
}

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { scheduledPosts, loading: scheduleLoading } = useScheduling();
  const { accounts, loading: accountsLoading } = useSocialAccounts();
  const { analytics, loading: analyticsLoading } = useAnalytics();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: "new-post",
      label: "Create Post",
      icon: Plus,
      action: () => {/* Navigate to composer */},
      variant: "default",
      color: "bg-gradient-to-r from-blue-500 to-purple-600"
    },
    {
      id: "schedule-content",
      label: "Schedule Content",
      icon: Calendar,
      action: () => {/* Navigate to calendar */},
      variant: "secondary",
      color: "bg-gradient-to-r from-green-500 to-teal-600"
    },
    {
      id: "view-analytics",
      label: "View Analytics",
      icon: TrendingUp,
      action: () => {/* Navigate to analytics */},
      variant: "outline",
      color: "bg-gradient-to-r from-orange-500 to-red-600"
    },
    {
      id: "team-activity",
      label: "Team Activity",
      icon: Users,
      action: () => {/* Navigate to team */},
      variant: "secondary",
      color: "bg-gradient-to-r from-purple-500 to-pink-600"
    }
  ];

  const platformStatus = accounts.map(account => ({
    platform: account.platform,
    status: account.is_active ? 'connected' : 'disconnected',
    lastSync: account.updated_at,
    health: account.is_active ? 'healthy' : 'error'
  }));

  const todayPosts = scheduledPosts.filter(post => {
    const today = new Date().toDateString();
    const postDate = new Date(post.scheduled_at).toDateString();
    return today === postDate;
  }).slice(0, 5);

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Clients", href: "/clients", icon: Building2 },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Campaigns", href: "/campaigns", icon: Target },
    { name: "Automation", href: "/automation", icon: Bot },
    { name: "Scheduler", href: "/scheduler", icon: Calendar },
    { name: "Assets", href: "/assets", icon: FolderOpen },
    { name: "Approvals", href: "/approvals", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Pixel8 Social Hub</h2>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-all text-sm"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Social Command Center
            </h1>
            <p className="text-slate-300 text-lg">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-4 h-4 mr-1" />
              All Systems Operational
            </Badge>
            <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.id} className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{action.label}</p>
                    <p className="text-slate-300 text-sm mt-1">Quick action</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Today's Schedule & Metrics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Publishing Schedule */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Today's Publishing Schedule
              </CardTitle>
              <CardDescription className="text-slate-300">
                {todayPosts.length} posts scheduled for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scheduleLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-white/10 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : todayPosts.length > 0 ? (
                <div className="space-y-4">
                  {todayPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <div>
                          <p className="text-white font-medium">{post.title}</p>
                          <p className="text-slate-300 text-sm">
                            {new Date(post.scheduled_at).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} • {post.platform}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={post.posting_status === 'posted' ? 'default' : 'secondary'}
                        className={
                          post.posting_status === 'posted' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : post.posting_status === 'failed'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }
                      >
                        {post.posting_status === 'posted' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {post.posting_status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {post.posting_status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
                        {post.posting_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300">No posts scheduled for today</p>
                  <p className="text-slate-400 text-sm">Create your first post to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Metrics */}
          <DashboardMetrics analytics={analytics} loading={analyticsLoading} />
        </div>

        {/* Right Column - Platform Status & Activity */}
        <div className="space-y-8">
          {/* Platform Status */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Platform Status
              </CardTitle>
              <CardDescription className="text-slate-300">
                Connection health for all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-white/10 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {platformStatus.length > 0 ? platformStatus.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          platform.health === 'healthy' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <div>
                          <p className="text-white font-medium capitalize">{platform.platform}</p>
                          <p className="text-slate-400 text-xs">
                            Last sync: {new Date(platform.lastSync).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={platform.status === 'connected' ? 'default' : 'destructive'}
                        className={
                          platform.status === 'connected'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {platform.status}
                      </Badge>
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <Zap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-300 text-sm">No platforms connected</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Activity Feed */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                Team Activity
              </CardTitle>
              <CardDescription className="text-slate-300">
                Recent actions from your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock team activity - will be replaced with real Slack integration */}
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">MZ</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-medium">Mo</span> scheduled a new Instagram post
                    </p>
                    <p className="text-slate-400 text-xs">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AB</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-medium">Abdullah</span> approved client content
                    </p>
                    <p className="text-slate-400 text-xs">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AI</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-medium">AI Assistant</span> generated 5 new captions
                    </p>
                    <p className="text-slate-400 text-xs">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="backdrop-blur-md bg-white/10 border border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-slate-300 text-sm">Posts This Week</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md bg-white/10 border border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">5.2K</div>
                <div className="text-slate-300 text-sm">Total Reach</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Widgets Section */}
      <div className="mt-8">
        <DashboardWidgets />
      </div>
    </div>
  );
}