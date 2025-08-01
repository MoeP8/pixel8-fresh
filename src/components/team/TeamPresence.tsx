import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Users,
  Circle,
  Eye,
  Edit,
  MessageCircle,
  Clock,
  Wifi,
  WifiOff,
  User,
  Crown,
  Shield,
  UserCheck,
  Activity,
  MousePointer,
  Cursor,
  PhoneCall,
  Video,
  Settings,
  Bell,
  BellOff
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "editor" | "viewer" | "client";
  status: "online" | "away" | "busy" | "offline";
  lastSeen?: string;
  currentActivity?: {
    type: "viewing" | "editing" | "commenting" | "reviewing";
    resource: string;
    resourceId: string;
    timestamp: string;
  };
  permissions: string[];
  isTyping?: boolean;
  cursorPosition?: { x: number; y: number; page: string };
}

interface TeamPresenceProps {
  currentUserId?: string;
  showDetailedActivity?: boolean;
  compact?: boolean;
}

export function TeamPresence({ 
  currentUserId = "user1", 
  showDetailedActivity = true,
  compact = false 
}: TeamPresenceProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showOfflineMembers, setShowOfflineMembers] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Mock team data - will be replaced with real-time data
  const mockTeamMembers: TeamMember[] = [
    {
      id: "user1",
      name: "Alex Johnson",
      email: "alex@company.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      role: "owner",
      status: "online",
      currentActivity: {
        type: "editing",
        resource: "Summer Campaign Post",
        resourceId: "post-123",
        timestamp: new Date().toISOString()
      },
      permissions: ["read", "write", "admin", "publish"],
      isTyping: false
    },
    {
      id: "user2", 
      name: "Sarah Chen",
      email: "sarah@company.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face",
      role: "admin",
      status: "online",
      currentActivity: {
        type: "reviewing",
        resource: "Brand Guidelines Update",
        resourceId: "post-124",
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      permissions: ["read", "write", "admin"],
      isTyping: true
    },
    {
      id: "user3",
      name: "Mike Rodriguez",
      email: "mike@company.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      role: "editor",
      status: "away",
      lastSeen: new Date(Date.now() - 1800000).toISOString(),
      currentActivity: {
        type: "viewing",
        resource: "Content Calendar",
        resourceId: "calendar",
        timestamp: new Date(Date.now() - 900000).toISOString()
      },
      permissions: ["read", "write"]
    },
    {
      id: "user4",
      name: "Emily Davis",
      email: "emily@agency.com",
      role: "client",
      status: "online",
      currentActivity: {
        type: "commenting",
        resource: "Q1 Strategy Presentation",
        resourceId: "post-125",
        timestamp: new Date(Date.now() - 120000).toISOString()
      },
      permissions: ["read", "comment"]
    },
    {
      id: "user5",
      name: "David Kim",
      email: "david@company.com",
      role: "editor",
      status: "busy",
      currentActivity: {
        type: "editing",
        resource: "Instagram Stories Template",
        resourceId: "post-126",
        timestamp: new Date(Date.now() - 600000).toISOString()
      },
      permissions: ["read", "write"]
    },
    {
      id: "user6",
      name: "Lisa Wang",
      email: "lisa@company.com",
      role: "viewer",
      status: "offline",
      lastSeen: new Date(Date.now() - 7200000).toISOString(),
      permissions: ["read"]
    }
  ];

  useEffect(() => {
    setTeamMembers(mockTeamMembers);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTeamMembers(prev => prev.map(member => {
        // Randomly update typing status
        if (Math.random() < 0.1) {
          return { ...member, isTyping: !member.isTyping };
        }
        
        // Randomly update activity
        if (Math.random() < 0.05) {
          const activities = ["viewing", "editing", "commenting", "reviewing"] as const;
          const resources = ["Summer Campaign", "Brand Assets", "Content Calendar", "Analytics Dashboard"];
          
          return {
            ...member,
            currentActivity: {
              type: activities[Math.floor(Math.random() * activities.length)],
              resource: resources[Math.floor(Math.random() * resources.length)],
              resourceId: `resource-${Math.floor(Math.random() * 1000)}`,
              timestamp: new Date().toISOString()
            }
          };
        }
        
        return member;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-3 h-3 text-yellow-400" />;
      case "admin":
        return <Shield className="w-3 h-3 text-blue-400" />;
      case "client":
        return <User className="w-3 h-3 text-purple-400" />;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "editing":
        return <Edit className="w-3 h-3 text-blue-400" />;
      case "viewing":
        return <Eye className="w-3 h-3 text-green-400" />;
      case "commenting":
        return <MessageCircle className="w-3 h-3 text-purple-400" />;
      case "reviewing":
        return <UserCheck className="w-3 h-3 text-orange-400" />;
      default:
        return <Activity className="w-3 h-3 text-slate-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const onlineMembers = teamMembers.filter(member => member.status !== "offline");
  const offlineMembers = teamMembers.filter(member => member.status === "offline");
  const currentUser = teamMembers.find(member => member.id === currentUserId);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center -space-x-2">
          {onlineMembers.slice(0, 5).map((member) => (
            <TooltipProvider key={member.id}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="relative">
                    <Avatar className="w-8 h-8 border-2 border-white/20">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-slate-700 text-white text-xs">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white/20 ${getStatusColor(member.status)}`}></div>
                    {member.isTyping && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-slate-700">
                  <div className="text-white text-sm">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-slate-300 text-xs capitalize">{member.status}</div>
                    {member.currentActivity && (
                      <div className="text-slate-400 text-xs mt-1">
                        {member.currentActivity.type} {member.currentActivity.resource}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          
          {onlineMembers.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-white/20 flex items-center justify-center">
              <span className="text-white text-xs">+{onlineMembers.length - 5}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
          <span>{onlineMembers.length} online</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Presence
            </CardTitle>
            <CardDescription className="text-slate-300">
              {onlineMembers.length} of {teamMembers.length} members online
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications(!notifications)}
              className={`text-slate-400 hover:text-white ${notifications ? "text-blue-400" : ""}`}
            >
              {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </Button>
            
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current User */}
        {currentUser && (
          <div className="pb-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium text-sm">You</h3>
              <Badge variant="outline" className="border-green-400 text-green-400 text-xs">
                <Circle className="w-2 h-2 fill-current mr-1" />
                {currentUser.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-slate-700 text-white">
                    {currentUser.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${getStatusColor(currentUser.status)}`}></div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{currentUser.name}</span>
                  {getRoleIcon(currentUser.role)}
                </div>
                <div className="text-slate-400 text-xs capitalize">{currentUser.role}</div>
                
                {currentUser.currentActivity && showDetailedActivity && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                    {getActivityIcon(currentUser.currentActivity.type)}
                    <span className="capitalize">{currentUser.currentActivity.type}</span>
                    <span className="text-slate-400">•</span>
                    <span className="truncate">{currentUser.currentActivity.resource}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 w-8 p-0">
                  <PhoneCall className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 w-8 p-0">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Online Team Members */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
              Online ({onlineMembers.filter(m => m.id !== currentUserId).length})
            </h3>
          </div>
          
          <div className="space-y-3">
            {onlineMembers.filter(member => member.id !== currentUserId).map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-slate-700 text-white">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${getStatusColor(member.status)}`}></div>
                  {member.isTyping && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium truncate">{member.name}</span>
                    {getRoleIcon(member.role)}
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 capitalize">
                      {member.role}
                    </Badge>
                  </div>
                  
                  {member.isTyping && (
                    <div className="flex items-center gap-2 text-xs text-blue-400 mb-1">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span>typing...</span>
                    </div>
                  )}
                  
                  {member.currentActivity && showDetailedActivity && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      {getActivityIcon(member.currentActivity.type)}
                      <span className="capitalize">{member.currentActivity.type}</span>
                      <span className="text-slate-400">•</span>
                      <span className="truncate">{member.currentActivity.resource}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400">{formatTimeAgo(member.currentActivity.timestamp)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 w-8 p-0">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  {member.role !== "client" && (
                    <>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 w-8 p-0">
                        <PhoneCall className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 w-8 p-0">
                        <Video className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Members Toggle */}
        {offlineMembers.length > 0 && (
          <div>
            <Button
              variant="ghost"
              onClick={() => setShowOfflineMembers(!showOfflineMembers)}
              className="w-full justify-between text-slate-400 hover:text-white hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <Circle className="w-2 h-2 fill-gray-500 text-gray-500" />
                Offline ({offlineMembers.length})
              </span>
              <span className="text-xs">{showOfflineMembers ? "Hide" : "Show"}</span>
            </Button>
            
            {showOfflineMembers && (
              <div className="space-y-2 mt-3">
                {offlineMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg opacity-60">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-slate-700 text-white text-xs">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 bg-gray-500"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm truncate">{member.name}</span>
                        {getRoleIcon(member.role)}
                      </div>
                      {member.lastSeen && (
                        <div className="text-slate-500 text-xs">
                          Last seen {formatTimeAgo(member.lastSeen)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Quick Actions</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Users className="w-4 h-4 mr-2" />
                Invite Team
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Video className="w-4 h-4 mr-2" />
                Team Call
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}