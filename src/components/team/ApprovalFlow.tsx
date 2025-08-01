import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Send,
  MessageCircle,
  User,
  Users,
  FileText,
  Eye,
  Edit,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckSquare,
  Flag,
  Calendar,
  Bell,
  Zap,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Settings,
  Filter,
  Plus,
  History
} from "lucide-react";

interface ApprovalStage {
  id: string;
  name: string;
  description: string;
  required: boolean;
  order: number;
  approvers: string[];
  minApprovals: number;
  autoApprove?: boolean;
  timeoutHours?: number;
}

interface ApprovalItem {
  id: string;
  title: string;
  type: "post" | "campaign" | "asset" | "strategy";
  content: {
    caption?: string;
    media_urls?: string[];
    platforms?: string[];
    scheduled_at?: string;
  };
  submittedBy: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  currentStage: string;
  status: "pending" | "approved" | "rejected" | "revision_requested" | "cancelled";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "urgent";
  client?: {
    id: string;
    name: string;
    logo?: string;
  };
  stages: {
    stageId: string;
    status: "pending" | "approved" | "rejected" | "skipped";
    approvedBy?: string[];
    rejectedBy?: string[];
    comments?: string;
    completedAt?: string;
  }[];
  comments: {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    message: string;
    timestamp: string;
    type: "comment" | "approval" | "rejection" | "revision";
  }[];
  metadata: {
    brandCompliance?: number;
    contentScore?: number;
    riskLevel?: "low" | "medium" | "high";
  };
}

interface ApprovalFlowProps {
  currentUserId?: string;
  compact?: boolean;
  showStats?: boolean;
}

export function ApprovalFlow({ 
  currentUserId = "user1", 
  compact = false,
  showStats = true 
}: ApprovalFlowProps) {
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [newComment, setNewComment] = useState("");
  const [filterBy, setFilterBy] = useState<string[]>([]);

  // Mock approval stages
  const approvalStages: ApprovalStage[] = [
    {
      id: "content_review",
      name: "Content Review",
      description: "Initial content and brand compliance check",
      required: true,
      order: 1,
      approvers: ["user2", "user3"],
      minApprovals: 1,
      timeoutHours: 24
    },
    {
      id: "brand_approval",
      name: "Brand Approval",
      description: "Brand guidelines and messaging approval",
      required: true,
      order: 2,
      approvers: ["user1"],
      minApprovals: 1,
      timeoutHours: 48
    },
    {
      id: "client_approval",
      name: "Client Approval",
      description: "Final client sign-off",
      required: false,
      order: 3,
      approvers: ["user4"],
      minApprovals: 1,
      timeoutHours: 72
    },
    {
      id: "legal_review",
      name: "Legal Review",
      description: "Legal and compliance review for sensitive content",
      required: false,
      order: 4,
      approvers: ["user5"],
      minApprovals: 1,
      timeoutHours: 24
    }
  ];

  // Mock approval items
  const mockApprovalItems: ApprovalItem[] = [
    {
      id: "approval-1",
      title: "Summer Campaign Launch Post",
      type: "post",
      content: {
        caption: "🌞 Ready for summer? Our new collection drops tomorrow! #SummerVibes #NewCollection",
        platforms: ["instagram", "facebook"],
        scheduled_at: "2024-02-01T14:00:00Z"
      },
      submittedBy: {
        id: "user3",
        name: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        role: "Content Creator"
      },
      currentStage: "content_review",
      status: "pending",
      createdAt: "2024-01-28T10:30:00Z",
      updatedAt: "2024-01-28T10:30:00Z",
      dueDate: "2024-01-30T12:00:00Z",
      priority: "high",
      client: {
        id: "client1",
        name: "Fashion Brand Co",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop"
      },
      stages: [
        { stageId: "content_review", status: "pending" },
        { stageId: "brand_approval", status: "pending" },
        { stageId: "client_approval", status: "pending" }
      ],
      comments: [
        {
          id: "comment-1",
          userId: "user3",
          userName: "Mike Rodriguez", 
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          message: "Added summer campaign content for review. Please check brand compliance and messaging.",
          timestamp: "2024-01-28T10:30:00Z",
          type: "comment"
        }
      ],
      metadata: {
        brandCompliance: 85,
        contentScore: 92,
        riskLevel: "low"
      }
    },
    {
      id: "approval-2",
      title: "Q1 Strategy Presentation",
      type: "campaign",
      content: {
        caption: "Quarterly strategy overview and campaign roadmap"
      },
      submittedBy: {
        id: "user2",
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face",
        role: "Strategy Lead"
      },
      currentStage: "brand_approval",
      status: "pending",
      createdAt: "2024-01-27T16:45:00Z",
      updatedAt: "2024-01-28T09:15:00Z",
      dueDate: "2024-01-31T17:00:00Z",
      priority: "medium",
      stages: [
        { 
          stageId: "content_review", 
          status: "approved", 
          approvedBy: ["user3"],
          completedAt: "2024-01-28T08:30:00Z"
        },
        { stageId: "brand_approval", status: "pending" },
        { stageId: "client_approval", status: "pending" }
      ],
      comments: [
        {
          id: "comment-2",
          userId: "user3",
          userName: "Mike Rodriguez",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          message: "Content looks good, approved for brand review.",
          timestamp: "2024-01-28T08:30:00Z",
          type: "approval"
        }
      ],
      metadata: {
        brandCompliance: 94,
        contentScore: 88,
        riskLevel: "low"
      }
    },
    {
      id: "approval-3",
      title: "Behind the Scenes Video",
      type: "post",
      content: {
        caption: "Take a peek behind the scenes at our creative process! 🎬 #BehindTheScenes",
        platforms: ["instagram", "tiktok"],
        media_urls: ["video-url-1"]
      },
      submittedBy: {
        id: "user5",
        name: "David Kim",
        role: "Video Producer"
      },
      currentStage: "content_review",
      status: "revision_requested",
      createdAt: "2024-01-26T11:20:00Z",
      updatedAt: "2024-01-27T14:30:00Z",
      priority: "low",
      stages: [
        { 
          stageId: "content_review", 
          status: "rejected",
          rejectedBy: ["user2"],
          comments: "Video quality needs improvement, audio is unclear in some sections."
        }
      ],
      comments: [
        {
          id: "comment-3",
          userId: "user2",
          userName: "Sarah Chen",
          userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face",
          message: "The concept is great but we need to improve the video quality and fix the audio issues in the middle section.",
          timestamp: "2024-01-27T14:30:00Z",
          type: "revision"
        }
      ],
      metadata: {
        brandCompliance: 78,
        contentScore: 72,
        riskLevel: "medium"
      }
    }
  ];

  useEffect(() => {
    setApprovalItems(mockApprovalItems);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400 border-green-400 bg-green-500/20";
      case "pending":
        return "text-yellow-400 border-yellow-400 bg-yellow-500/20";
      case "rejected":
      case "revision_requested":
        return "text-red-400 border-red-400 bg-red-500/20";
      case "cancelled":
        return "text-gray-400 border-gray-400 bg-gray-500/20";
      default:
        return "text-slate-400 border-slate-400 bg-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
      case "revision_requested":
        return <XCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-400 border-red-400 bg-red-500/20";
      case "high":
        return "text-orange-400 border-orange-400 bg-orange-500/20";
      case "medium":
        return "text-yellow-400 border-yellow-400 bg-yellow-500/20";
      case "low":
        return "text-green-400 border-green-400 bg-green-500/20";
      default:
        return "text-slate-400 border-slate-400 bg-slate-500/20";
    }
  };

  const getStageProgress = (item: ApprovalItem) => {
    const completedStages = item.stages.filter(stage => 
      stage.status === "approved" || stage.status === "skipped"
    ).length;
    const totalStages = item.stages.length;
    return (completedStages / totalStages) * 100;
  };

  const handleApproval = (itemId: string, action: "approve" | "reject", comment?: string) => {
    setApprovalItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const updatedStages = item.stages.map(stage => {
        if (stage.stageId === item.currentStage) {
          return {
            ...stage,
            status: action === "approve" ? "approved" : "rejected",
            [action === "approve" ? "approvedBy" : "rejectedBy"]: [currentUserId],
            comments: comment,
            completedAt: new Date().toISOString()
          };
        }
        return stage;
      });
      
      const newComment = {
        id: `comment-${Date.now()}`,
        userId: currentUserId,
        userName: "You",
        message: comment || (action === "approve" ? "Approved" : "Rejected"),
        timestamp: new Date().toISOString(),
        type: action as "approval" | "rejection"
      };
      
      return {
        ...item,
        stages: updatedStages,
        status: action === "approve" ? "approved" : "rejected",
        comments: [...item.comments, newComment],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const addComment = (itemId: string) => {
    if (!newComment.trim()) return;
    
    setApprovalItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const comment = {
        id: `comment-${Date.now()}`,
        userId: currentUserId,
        userName: "You",
        message: newComment,
        timestamp: new Date().toISOString(),
        type: "comment" as const
      };
      
      return {
        ...item,
        comments: [...item.comments, comment],
        updatedAt: new Date().toISOString()
      };
    }));
    
    setNewComment("");
  };

  const filteredItems = approvalItems.filter(item => {
    switch (activeTab) {
      case "pending":
        return item.status === "pending" || item.status === "revision_requested";
      case "approved":
        return item.status === "approved";
      case "rejected":
        return item.status === "rejected";
      case "my_items":
        return item.submittedBy.id === currentUserId;
      default:
        return true;
    }
  });

  const stats = {
    pending: approvalItems.filter(item => item.status === "pending" || item.status === "revision_requested").length,
    approved: approvalItems.filter(item => item.status === "approved").length,
    rejected: approvalItems.filter(item => item.status === "rejected").length,
    myItems: approvalItems.filter(item => item.submittedBy.id === currentUserId).length
  };

  if (compact) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">Approvals</h3>
                <p className="text-slate-400 text-sm">{stats.pending} pending review</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
              View All
            </Button>
          </div>
          
          {stats.pending > 0 && (
            <div className="mt-4 space-y-2">
              {filteredItems.slice(0, 2).map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={item.submittedBy.avatar} />
                    <AvatarFallback className="bg-slate-700 text-white text-xs">
                      {item.submittedBy.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{item.title}</p>
                    <p className="text-slate-400 text-xs">{item.submittedBy.name}</p>
                  </div>
                  <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Rejected</p>
                  <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-md bg-white/10 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">My Items</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.myItems}</p>
                </div>
                <User className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Approval Interface */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Approval Workflow
              </CardTitle>
              <CardDescription className="text-slate-300">
                Review and approve content before publishing
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Settings className="w-4 h-4 mr-2" />
                Workflow
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white/10 mb-6">
              <TabsTrigger value="pending" className="data-[state=active]:bg-white/20">
                <Clock className="w-4 h-4 mr-2" />
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-white/20">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approved ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-white/20">
                <XCircle className="w-4 h-4 mr-2" />
                Rejected ({stats.rejected})
              </TabsTrigger>
              <TabsTrigger value="my_items" className="data-[state=active]:bg-white/20">
                <User className="w-4 h-4 mr-2" />
                My Items ({stats.myItems})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="space-y-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">No items found</h3>
                    <p className="text-slate-300">There are no approval items in this category</p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <Card key={item.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={item.submittedBy.avatar} />
                              <AvatarFallback className="bg-slate-700 text-white">
                                {item.submittedBy.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-white font-medium">{item.title}</h3>
                                <Badge className={getStatusColor(item.status)}>
                                  {getStatusIcon(item.status)}
                                  <span className="ml-1 capitalize">{item.status.replace("_", " ")}</span>
                                </Badge>
                                <Badge className={getPriorityColor(item.priority)}>
                                  <Flag className="w-3 h-3 mr-1" />
                                  {item.priority}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                                <span>By {item.submittedBy.name}</span>
                                <span>•</span>
                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                {item.client && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <img src={item.client.logo} alt="" className="w-4 h-4 rounded" />
                                      {item.client.name}
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              {item.content.caption && (
                                <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                                  {item.content.caption}
                                </p>
                              )}
                              
                              {/* Progress Bar */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-slate-300 text-xs">Approval Progress</span>
                                  <span className="text-slate-400 text-xs">
                                    {item.stages.filter(s => s.status === "approved").length} of {item.stages.length} stages
                                  </span>
                                </div>
                                <Progress value={getStageProgress(item)} className="h-2 bg-white/10" />
                              </div>
                              
                              {/* Approval Stages */}
                              <div className="flex items-center gap-2 mb-4">
                                {item.stages.map((stage, index) => {
                                  const stageInfo = approvalStages.find(s => s.id === stage.stageId);
                                  if (!stageInfo) return null;
                                  
                                  return (
                                    <div key={stage.stageId} className="flex items-center">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        stage.status === "approved" ? "bg-green-500 text-white" :
                                        stage.status === "rejected" ? "bg-red-500 text-white" :
                                        stage.stageId === item.currentStage ? "bg-yellow-500 text-white" :
                                        "bg-slate-600 text-slate-300"
                                      }`}>
                                        {stage.status === "approved" ? "✓" :
                                         stage.status === "rejected" ? "✗" :
                                         index + 1}
                                      </div>
                                      {index < item.stages.length - 1 && (
                                        <ArrowRight className="w-3 h-3 text-slate-400 mx-1" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Metadata */}
                              {item.metadata && (
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                  {item.metadata.brandCompliance && (
                                    <span>Brand: {item.metadata.brandCompliance}%</span>
                                  )}
                                  {item.metadata.contentScore && (
                                    <span>Quality: {item.metadata.contentScore}%</span>
                                  )}
                                  {item.metadata.riskLevel && (
                                    <span className={`capitalize ${
                                      item.metadata.riskLevel === "high" ? "text-red-400" :
                                      item.metadata.riskLevel === "medium" ? "text-yellow-400" :
                                      "text-green-400"
                                    }`}>
                                      Risk: {item.metadata.riskLevel}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        {item.status === "pending" && item.currentStage && (
                          <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                            <Button
                              onClick={() => handleApproval(item.id, "approve")}
                              className="bg-green-500 hover:bg-green-600"
                              size="sm"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            
                            <Button
                              onClick={() => handleApproval(item.id, "reject")}
                              variant="outline"
                              className="border-red-400 text-red-400 hover:bg-red-500/20"
                              size="sm"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            
                            <Button
                              variant="outline"
                              className="bg-white/10 border-white/20 hover:bg-white/20"
                              size="sm"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Comment
                            </Button>
                            
                            <Button
                              variant="outline"
                              className="bg-white/10 border-white/20 hover:bg-white/20"
                              size="sm"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        )}
                        
                        {/* Comments Section */}
                        {item.comments.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/20">
                            <h4 className="text-slate-300 text-sm font-medium mb-3">
                              Comments ({item.comments.length})
                            </h4>
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                              {item.comments.slice(-3).map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={comment.userAvatar} />
                                    <AvatarFallback className="bg-slate-700 text-white text-xs">
                                      {comment.userName.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-slate-300 text-sm font-medium">{comment.userName}</span>
                                      <Badge variant="outline" className={`text-xs ${
                                        comment.type === "approval" ? "border-green-400 text-green-400" :
                                        comment.type === "rejection" ? "border-red-400 text-red-400" :
                                        comment.type === "revision" ? "border-yellow-400 text-yellow-400" :
                                        "border-slate-600 text-slate-300"
                                      }`}>
                                        {comment.type}
                                      </Badge>
                                      <span className="text-slate-500 text-xs">
                                        {new Date(comment.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-slate-300 text-sm">{comment.message}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Add Comment */}
                            <div className="flex items-center gap-3 mt-4">
                              <Textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 min-h-[80px] bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                              />
                              <Button
                                onClick={() => addComment(item.id)}
                                disabled={!newComment.trim()}
                                className="bg-blue-500 hover:bg-blue-600"
                                size="sm"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}