import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Image,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Figma,
  Dropbox,
  MessageSquare
} from "lucide-react";

interface Widget {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  size: "small" | "medium" | "large";
}

export function DashboardWidgets() {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([
    "publishing-queue",
    "platform-status", 
    "asset-status",
    "analytics",
    "team-activity"
  ]);

  const PublishingQueueWidget = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">Next 5 Scheduled Posts</h4>
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {[
          { title: "Monday Motivation Post", platform: "Instagram", time: "9:00 AM", status: "scheduled" },
          { title: "Product Launch Tweet", platform: "Twitter", time: "2:00 PM", status: "scheduled" },
          { title: "Behind the Scenes", platform: "Facebook", time: "4:00 PM", status: "scheduled" },
          { title: "Team Spotlight", platform: "LinkedIn", time: "6:00 PM", status: "scheduled" },
          { title: "Week Recap Story", platform: "Instagram", time: "8:00 PM", status: "scheduled" }
        ].map((post, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div>
                <p className="text-white text-sm font-medium">{post.title}</p>
                <p className="text-slate-400 text-xs">{post.time} • {post.platform}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Clock className="w-3 h-3 mr-1" />
              {post.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const AssetStatusWidget = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">Latest Assets</h4>
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
              <Figma className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Brand Guidelines Update</p>
              <p className="text-slate-400 text-xs">Figma • 2 hours ago</p>
            </div>
          </div>
          <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            New
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
              <Dropbox className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Product Photos - Q1</p>
              <p className="text-slate-400 text-xs">Dropbox • 5 hours ago</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Image className="w-3 h-3 mr-1" />
            12 files
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
              <Image className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Social Media Templates</p>
              <p className="text-slate-400 text-xs">Figma • 1 day ago</p>
            </div>
          </div>
          <Badge variant="outline" className="border-slate-500/30 text-slate-400">
            Updated
          </Badge>
        </div>
      </div>
    </div>
  );

  const AnalyticsWidget = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">Today's Performance</h4>
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-center gap-1 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <ArrowUp className="w-3 h-3 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">2.4K</div>
          <div className="text-slate-400 text-xs">Impressions</div>
          <div className="text-green-400 text-xs">+12%</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <ArrowUp className="w-3 h-3 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">186</div>
          <div className="text-slate-400 text-xs">Engagements</div>
          <div className="text-blue-400 text-xs">+8%</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">Engagement Rate</span>
          <span className="text-white">7.8%</span>
        </div>
        <Progress value={78} className="h-2 bg-white/10" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">Reach Goal</span>
          <span className="text-white">64%</span>
        </div>
        <Progress value={64} className="h-2 bg-white/10" />
      </div>
    </div>
  );

  const TeamActivityWidget = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">Team Activity</h4>
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-medium">MZ</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm">Mo created a new campaign</p>
            <p className="text-slate-400 text-xs">5 minutes ago</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
            <span className="text-white text-xs font-medium">AB</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm">Abdullah approved 3 posts</p>
            <p className="text-slate-400 text-xs">12 minutes ago</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm">New client feedback received</p>
            <p className="text-slate-400 text-xs">25 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  const widgets: Widget[] = [
    {
      id: "publishing-queue",
      title: "Publishing Queue",
      description: "Shows next 5 scheduled posts",
      component: <PublishingQueueWidget />,
      size: "large"
    },
    {
      id: "asset-status", 
      title: "Asset Status",
      description: "New designs from Figma & Dropbox",
      component: <AssetStatusWidget />,
      size: "medium"
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Today's engagement metrics",
      component: <AnalyticsWidget />,
      size: "medium"
    },
    {
      id: "team-activity",
      title: "Team Activity",
      description: "Recent actions from Slack integration",
      component: <TeamActivityWidget />,
      size: "medium"
    }
  ];

  const activeWidgets = widgets.filter(widget => selectedWidgets.includes(widget.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Dashboard Widgets</h2>
        <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
          Customize Widgets
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeWidgets.map((widget) => (
          <Card 
            key={widget.id} 
            className={`backdrop-blur-md bg-white/10 border border-white/20 ${
              widget.size === 'large' ? 'lg:col-span-2' : 
              widget.size === 'medium' ? 'lg:col-span-1' : 'lg:col-span-1'
            }`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg">{widget.title}</CardTitle>
              <CardDescription className="text-slate-300">{widget.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {widget.component}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}