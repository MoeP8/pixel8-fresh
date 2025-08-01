import { useState } from "react";
import { TeamPresence } from "@/components/team/TeamPresence";
import { ApprovalFlow } from "@/components/team/ApprovalFlow";
import { CommentThread } from "@/components/team/CommentThread";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  MessageCircle,
  CheckSquare,
  Clock,
  TrendingUp,
  Activity,
  UserPlus,
  Settings,
  Bell,
  Video,
  Calendar,
  FileText,
  Target,
  Zap,
  Globe,
  Shield,
  Eye,
  Heart,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

export function TeamPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock team activity data
  const teamActivity = [
    {
      id: "activity-1",
      type: "approval_completed",
      user: "Sarah Chen",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face",
      action: "approved",
      resource: "Summer Campaign Post",
      timestamp: "2024-01-28T14:30:00Z",
      icon: CheckSquare,
      color: "text-green-400"
    },
    {
      id: "activity-2",
      type: "comment_added",
      user: "Mike Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      action: "commented on",
      resource: "Brand Guidelines Update",
      timestamp: "2024-01-28T13:45:00Z",
      icon: MessageCircle,
      color: "text-blue-400"
    },
    {
      id: "activity-3",
      type: "content_submitted",
      user: "David Kim",
      action: "submitted for review",
      resource: "Instagram Stories Template",
      timestamp: "2024-01-28T12:20:00Z",
      icon: FileText,
      color: "text-purple-400"
    },
    {
      id: "activity-4",
      type: "team_joined",
      user: "Emily Davis",
      action: "joined the team",
      resource: "Project Alpha",
      timestamp: "2024-01-28T11:15:00Z",
      icon: UserPlus,
      color: "text-yellow-400"
    },
    {
      id: "activity-5",
      type: "approval_requested",
      user: "Alex Johnson",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      action: "requested approval for",
      resource: "Q1 Marketing Strategy",
      timestamp: "2024-01-28T10:30:00Z",
      icon: Clock,
      color: "text-orange-400"
    }
  ];

  // Mock team stats
  const teamStats = {
    totalMembers: 12,
    onlineMembers: 8,
    pendingApprovals: 5,
    activeDiscussions: 3,
    completedTasks: 28,
    avgResponseTime: "2.3h"
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Collaboration</h1>
          <p className="text-slate-300">
            Manage team presence, approvals, and discussions in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
            <Video className="w-4 h-4 mr-2" />
            Team Call
          </Button>
          
          <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
            <Settings className="w-4 h-4 mr-2" />
            Team Settings
          </Button>
          
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Members
          </Button>
        </div>
      </div>

      {/* Team Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Team Members</p>
                <p className="text-2xl font-bold text-white">{teamStats.totalMembers}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Online Now</p>
                <p className="text-2xl font-bold text-green-400">{teamStats.onlineMembers}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{teamStats.pendingApprovals}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Discussions</p>
                <p className="text-2xl font-bold text-purple-400">{teamStats.activeDiscussions}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-400">{teamStats.completedTasks}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Avg Response</p>
                <p className="text-2xl font-bold text-cyan-400">{teamStats.avgResponseTime}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
                <Activity className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="presence" className="data-[state=active]:bg-white/20">
                <Users className="w-4 h-4 mr-2" />
                Team Presence
              </TabsTrigger>
              <TabsTrigger value="approvals" className="data-[state=active]:bg-white/20">
                <CheckSquare className="w-4 h-4 mr-2" />
                Approvals
              </TabsTrigger>
              <TabsTrigger value="discussions" className="data-[state=active]:bg-white/20">
                <MessageCircle className="w-4 h-4 mr-2" />
                Discussions
              </TabsTrigger>
            </TabsList>
          </CardHeader>
        </Card>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Presence Compact */}
            <TeamPresence compact={true} />
            
            {/* Recent Approvals */}
            <ApprovalFlow compact={true} />
          </div>

          {/* Team Activity Feed */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-slate-300">
                Latest team actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {activity.userAvatar && (
                            <img 
                              src={activity.userAvatar} 
                              alt={activity.user}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-white font-medium text-sm">{activity.user}</span>
                          <span className="text-slate-300 text-sm">{activity.action}</span>
                          <span className="text-blue-400 text-sm font-medium">{activity.resource}</span>
                        </div>
                        <span className="text-slate-400 text-xs">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-medium mb-2">Start Team Call</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Instant video conference with online team members
                </p>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  Start Call
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-medium mb-2">Submit for Review</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Submit content for team approval workflow
                </p>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  Submit Content
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-medium mb-2">Invite Team Member</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Add new team members and set permissions ting permissions
                </p>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  Send Invite
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="presence">
          <TeamPresence showDetailedActivity={true} />
        </TabsContent>

        <TabsContent value="approvals">
          <ApprovalFlow showStats={true} />
        </TabsContent>

        <TabsContent value="discussions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CommentThread
                resourceId="demo-content"
                resourceType="post"
                allowComments={true}
                showNotifications={true}
                maxHeight="600px"
              />
            </div>
            
            <div className="space-y-6">
              {/* Discussion Stats */}
              <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-base">Discussion Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300 text-sm">Total Comments</span>
                      </div>
                      <span className="text-white font-medium">247</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-slate-300 text-sm">Reactions</span>
                      </div>
                      <span className="text-white font-medium">89</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300 text-sm">Participants</span>
                      </div>
                      <span className="text-white font-medium">12</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300 text-sm">This Week</span>
                      </div>
                      <span className="text-green-400 font-medium">+23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Discussions */}
              <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-base">Active Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: "Summer Campaign Feedback", comments: 12, participants: 5 },
                      { title: "Brand Guidelines Update", comments: 8, participants: 3 },
                      { title: "Q1 Strategy Review", comments: 15, participants: 7 }
                    ].map((discussion, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                        <h4 className="text-white text-sm font-medium mb-1">{discussion.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {discussion.comments} comments
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {discussion.participants} people
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">New Comments</span>
                      <div className="w-8 h-5 bg-blue-500 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Mentions</span>
                      <div className="w-8 h-5 bg-blue-500 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Slack Updates</span>
                      <div className="w-8 h-5 bg-gray-600 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute left-1 top-1"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}