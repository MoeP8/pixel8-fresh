import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  Share,
  ArrowUp,
  ArrowDown,
  Target,
  Calendar,
  Clock
} from "lucide-react";

interface MetricData {
  label: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "stable";
  icon: any;
  color: string;
  target?: number;
  period: string;
}

interface DashboardMetricsProps {
  analytics: any;
  loading: boolean;
}

export function DashboardMetrics({ analytics, loading }: DashboardMetricsProps) {
  // Mock data - will be replaced with real analytics data
  const metrics: MetricData[] = [
    {
      label: "Total Impressions",
      value: "24.5K",
      change: 12.5,
      trend: "up",
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
      target: 85,
      period: "This Week"
    },
    {
      label: "Engagement Rate",
      value: "7.8%",
      change: 2.3,
      trend: "up", 
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      target: 78,
      period: "Last 7 Days"
    },
    {
      label: "Followers Growth",
      value: "+186",
      change: -5.2,
      trend: "down",
      icon: Users,
      color: "from-green-500 to-emerald-500", 
      target: 62,
      period: "This Month"
    },
    {
      label: "Click-through Rate",
      value: "3.2%",
      change: 8.7,
      trend: "up",
      icon: Share,
      color: "from-purple-500 to-violet-500",
      target: 91,
      period: "Campaign Average"
    },
    {
      label: "Comments",
      value: "342",
      change: 15.8,
      trend: "up",
      icon: MessageCircle,
      color: "from-orange-500 to-amber-500",
      target: 68,
      period: "This Week"
    },
    {
      label: "Shares",
      value: "89",
      change: 4.2,
      trend: "up",
      icon: Share,
      color: "from-teal-500 to-cyan-500",
      target: 45,
      period: "Last 7 Days"
    }
  ];

  const platformMetrics = [
    {
      platform: "Instagram",
      posts: 12,
      reach: "8.2K",
      engagement: "6.8%",
      color: "from-pink-500 to-purple-500"
    },
    {
      platform: "Facebook", 
      posts: 8,
      reach: "5.4K",
      engagement: "4.2%",
      color: "from-blue-500 to-blue-600"
    },
    {
      platform: "Twitter",
      posts: 15,
      reach: "3.8K", 
      engagement: "8.9%",
      color: "from-sky-400 to-blue-500"
    },
    {
      platform: "LinkedIn",
      posts: 6,
      reach: "2.1K",
      engagement: "5.4%",
      color: "from-blue-600 to-blue-700"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="backdrop-blur-md bg-white/10 border border-white/20">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-16 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Performance Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <Clock className="w-4 h-4" />
            Updated 2 minutes ago
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === "up" ? ArrowUp : metric.trend === "down" ? ArrowDown : null;
            
            return (
              <Card key={index} className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {TrendIcon && (
                      <div className={`flex items-center gap-1 text-sm ${
                        metric.trend === "up" ? "text-green-400" : "text-red-400"
                      }`}>
                        <TrendIcon className="w-4 h-4" />
                        {Math.abs(metric.change)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-slate-300 text-sm">{metric.label}</div>
                    <div className="text-slate-400 text-xs">{metric.period}</div>
                    
                    {metric.target && (
                      <div className="pt-3">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Progress to Target</span>
                          <span>{metric.target}%</span>
                        </div>
                        <Progress 
                          value={metric.target} 
                          className="h-2 bg-white/10"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Platform Performance */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Platform Performance</h3>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <Calendar className="w-4 h-4" />
            This Week
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformMetrics.map((platform, index) => (
            <Card key={index} className="backdrop-blur-md bg-white/10 border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">{platform.platform}</h4>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Posts</span>
                    <span className="text-white font-medium">{platform.posts}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Reach</span>
                    <span className="text-white font-medium">{platform.reach}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Engagement</span>
                    <span className="text-green-400 font-medium">{platform.engagement}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Goals & Targets */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            Monthly Goals & Targets
          </CardTitle>
          <CardDescription className="text-slate-300">
            Track progress towards your monthly objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Content Creation</span>
                <span className="text-white">75/100</span>
              </div>
              <Progress value={75} className="h-3 bg-white/10" />
              <div className="text-xs text-slate-400">25 posts remaining</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Engagement Rate</span>
                <span className="text-white">7.8/10%</span>
              </div>
              <Progress value={78} className="h-3 bg-white/10" />
              <div className="text-xs text-slate-400">2.2% to target</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Follower Growth</span>
                <span className="text-white">620/1000</span>
              </div>
              <Progress value={62} className="h-3 bg-white/10" />
              <div className="text-xs text-slate-400">380 followers to go</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Client Satisfaction</span>
                <span className="text-white">9.2/10</span>
              </div>
              <Progress value={92} className="h-3 bg-white/10" />
              <div className="text-xs text-slate-400">Exceeding target!</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}