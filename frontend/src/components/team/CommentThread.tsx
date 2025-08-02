import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  MessageCircle,
  Send,
  Reply,
  Heart,
  Pin,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  AtSign,
  Smile,
  Paperclip,
  Image,
  Video,
  FileText,
  Link,
  CheckCircle,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  Users,
  Clock,
  Filter,
  Search,
  X,
  ThumbsUp,
  MessageSquare,
  Zap
} from "lucide-react";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  message: string;
  timestamp: string;
  edited?: boolean;
  editedAt?: string;
  parentId?: string;
  mentions: string[];
  attachments?: {
    id: string;
    type: "image" | "video" | "file" | "link";
    url: string;
    name: string;
    size?: number;
  }[];
  reactions: {
    type: "like" | "love" | "approve" | "disapprove";
    userId: string;
    userName: string;
  }[];
  isPinned?: boolean;
  isResolved?: boolean;
  visibility: "public" | "internal" | "private";
  metadata?: {
    isSystemMessage?: boolean;
    actionType?: "approval" | "rejection" | "status_change";
    relatedItemId?: string;
  };
}

interface CommentThreadProps {
  resourceId: string;
  resourceType: "post" | "asset" | "campaign" | "page";
  currentUserId?: string;
  allowComments?: boolean;
  showNotifications?: boolean;
  compact?: boolean;
  maxHeight?: string;
}

export function CommentThread({
  resourceId,
  resourceType,
  currentUserId = "user1",
  allowComments = true,
  showNotifications = true,
  compact = false,
  maxHeight = "400px"
}: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [filterBy, setFilterBy] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(true);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Mock team members for mentions
  const teamMembers = [
    { id: "user1", name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", role: "owner" },
    { id: "user2", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face", role: "admin" },
    { id: "user3", name: "Mike Rodriguez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", role: "editor" },
    { id: "user4", name: "Emily Davis", role: "client" },
    { id: "user5", name: "David Kim", role: "editor" }
  ];

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: "comment-1",
      userId: "user2",
      userName: "Sarah Chen",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face",
      userRole: "Strategy Lead",
      message: "This looks great! I love the direction we're taking with the summer campaign. The messaging really resonates with our target audience.",
      timestamp: "2024-01-28T10:30:00Z",
      mentions: [],
      reactions: [
        { type: "like", userId: "user1", userName: "Alex Johnson" },
        { type: "approve", userId: "user3", userName: "Mike Rodriguez" }
      ],
      isPinned: true,
      visibility: "public"
    },
    {
      id: "comment-2",
      userId: "user3",
      userName: "Mike Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      userRole: "Content Creator",
      message: "@sarah @alex Should we consider adding more visual elements to enhance engagement? I have some ideas for graphics that could complement this content.",
      timestamp: "2024-01-28T11:15:00Z",
      mentions: ["user2", "user1"],
      reactions: [
        { type: "like", userId: "user2", userName: "Sarah Chen" }
      ],
      visibility: "public"
    },
    {
      id: "comment-3",
      userId: "user4",
      userName: "Emily Davis",
      userRole: "Client",
      message: "I'm concerned about the tone here. Can we make it more professional while still keeping the summer vibe? Our brand voice should remain consistent.",
      timestamp: "2024-01-28T12:45:00Z",
      mentions: [],
      reactions: [],
      visibility: "public"
    },
    {
      id: "comment-4",
      userId: "user1",
      userName: "Alex Johnson",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      userRole: "Creative Director",
      message: "@emily You're absolutely right. Let's adjust the copy to be more aligned with the brand guidelines. @mike can you work on some visual mockups?",
      timestamp: "2024-01-28T13:20:00Z",
      mentions: ["user4", "user3"],
      reactions: [
        { type: "approve", userId: "user4", userName: "Emily Davis" },
        { type: "like", userId: "user3", userName: "Mike Rodriguez" }
      ],
      visibility: "public"
    },
    {
      id: "comment-5",
      userId: "user3",
      userName: "Mike Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      userRole: "Content Creator",
      message: "Absolutely! I'll have some options ready by end of day. Here's a quick preview of the direction I'm thinking:",
      timestamp: "2024-01-28T13:25:00Z",
      parentId: "comment-4",
      mentions: [],
      attachments: [
        {
          id: "attachment-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200",
          name: "summer-campaign-mockup.jpg",
          size: 245000
        }
      ],
      reactions: [
        { type: "love", userId: "user1", userName: "Alex Johnson" },
        { type: "approve", userId: "user2", userName: "Sarah Chen" }
      ],
      visibility: "public"
    },
    {
      id: "comment-6",
      userId: "user5",
      userName: "David Kim",
      userRole: "Developer",
      message: "Quick note - we need to ensure all assets are optimized for web performance. Current image sizes might slow down loading times.",
      timestamp: "2024-01-28T14:10:00Z",
      mentions: [],
      reactions: [],
      visibility: "internal",
      metadata: {
        isSystemMessage: false
      }
    }
  ];

  useEffect(() => {
    setComments(mockComments);
  }, [resourceId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUserId,
      userName: "You",
      userRole: "Current User",
      message: newComment,
      timestamp: new Date().toISOString(),
      mentions: extractMentions(newComment),
      reactions: [],
      parentId: replyingTo || undefined,
      visibility: "public"
    };

    setComments(prev => [...prev, comment]);
    setNewComment("");
    setReplyingTo(null);
    
    // Simulate Slack notification trigger
    if (comment.mentions.length > 0) {
      console.log("Triggering Slack notifications for mentions:", comment.mentions);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedUser = teamMembers.find(member => 
        member.name.toLowerCase().includes(match[1].toLowerCase())
      );
      if (mentionedUser) {
        mentions.push(mentionedUser.id);
      }
    }
    
    return mentions;
  };

  const handleReaction = (commentId: string, reactionType: "like" | "love" | "approve" | "disapprove") => {
    setComments(prev => prev.map(comment => {
      if (comment.id !== commentId) return comment;
      
      const existingReaction = comment.reactions.find(r => r.userId === currentUserId);
      
      if (existingReaction && existingReaction.type === reactionType) {
        // Remove reaction
        return {
          ...comment,
          reactions: comment.reactions.filter(r => r.userId !== currentUserId)
        };
      } else {
        // Add or update reaction
        const updatedReactions = comment.reactions.filter(r => r.userId !== currentUserId);
        updatedReactions.push({
          type: reactionType,
          userId: currentUserId,
          userName: "You"
        });
        
        return {
          ...comment,
          reactions: updatedReactions
        };
      }
    }));
  };

  const handleEdit = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditText(comment.message);
    }
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    
    setComments(prev => prev.map(comment => {
      if (comment.id !== editingComment) return comment;
      
      return {
        ...comment,
        message: editText,
        edited: true,
        editedAt: new Date().toISOString()
      };
    }));
    
    setEditingComment(null);
    setEditText("");
  };

  const handleDelete = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const togglePin = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id !== commentId) return comment;
      return { ...comment, isPinned: !comment.isPinned };
    }));
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="w-3 h-3" />;
      case "love":
        return <Heart className="w-3 h-3" />;
      case "approve":
        return <CheckCircle className="w-3 h-3" />;
      case "disapprove":
        return <X className="w-3 h-3" />;
      default:
        return <ThumbsUp className="w-3 h-3" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const filteredComments = comments.filter(comment => {
    // Apply search filter
    if (searchQuery && !comment.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply visibility filter
    switch (filterBy) {
      case "public":
        return comment.visibility === "public";
      case "internal":
        return comment.visibility === "internal";
      case "mentions":
        return comment.mentions.includes(currentUserId);
      case "pinned":
        return comment.isPinned;
      default:
        return true;
    }
  });

  const threadedComments = filteredComments.filter(comment => !comment.parentId);
  const getReplies = (parentId: string) => filteredComments.filter(comment => comment.parentId === parentId);

  if (compact) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-slate-400" />
              <span className="text-white text-sm">{comments.length} comments</span>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              View All
            </Button>
          </div>
          
          {comments.slice(-2).map(comment => (
            <div key={comment.id} className="flex items-start gap-3 mb-3 last:mb-0">
              <Avatar className="w-6 h-6">
                <AvatarImage src={comment.userAvatar} />
                <AvatarFallback className="bg-slate-700 text-white text-xs">
                  {comment.userName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-300 text-xs font-medium">{comment.userName}</span>
                  <span className="text-slate-500 text-xs">{formatTimestamp(comment.timestamp)}</span>
                </div>
                <p className="text-slate-300 text-xs line-clamp-2">{comment.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({comments.length})
            </CardTitle>
            <CardDescription className="text-slate-300">
              Collaborate and discuss content changes
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
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Filter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-slate-800/95 border-slate-700 backdrop-blur-md">
                <div className="space-y-2">
                  <h4 className="text-white text-sm font-medium">Filter Comments</h4>
                  {["all", "public", "internal", "mentions", "pinned"].map(filter => (
                    <Button
                      key={filter}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start capitalize ${
                        filterBy === filter ? "bg-white/20 text-white" : "text-slate-300 hover:text-white"
                      }`}
                      onClick={() => setFilterBy(filter)}
                    >
                      {filter === "mentions" ? "@mentions" : filter.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
          />
        </div>
      </CardHeader>

      <CardContent>
        {/* Comments List */}
        <div 
          className="space-y-4 mb-6 overflow-y-auto pr-2"
          style={{ maxHeight }}
        >
          {threadedComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No comments yet</h3>
              <p className="text-slate-300">Start the conversation!</p>
            </div>
          ) : (
            threadedComments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                {/* Main Comment */}
                <div className={`p-4 rounded-lg transition-colors ${
                  comment.isPinned 
                    ? "bg-yellow-500/10 border border-yellow-400/30" 
                    : "bg-white/5 hover:bg-white/10"
                }`}>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback className="bg-slate-700 text-white text-xs">
                        {comment.userName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-medium text-sm">{comment.userName}</span>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {comment.userRole}
                        </Badge>
                        <span className="text-slate-500 text-xs">{formatTimestamp(comment.timestamp)}</span>
                        {comment.edited && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            edited
                          </Badge>
                        )}
                        {comment.isPinned && (
                          <Pin className="w-3 h-3 text-yellow-400" />
                        )}
                        {comment.visibility === "internal" && (
                          <Badge variant="outline" className="text-xs border-orange-400 text-orange-400">
                            internal
                          </Badge>
                        )}
                      </div>
                      
                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                          />
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm">Save</Button>
                            <Button 
                              onClick={() => setEditingComment(null)} 
                              variant="ghost" 
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {comment.message}
                          </p>
                          
                          {/* Attachments */}
                          {comment.attachments && comment.attachments.length > 0 && (
                            <div className="space-y-2">
                              {comment.attachments.map(attachment => (
                                <div key={attachment.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                  {attachment.type === "image" && <Image className="w-4 h-4 text-green-400" />}
                                  {attachment.type === "video" && <Video className="w-4 h-4 text-purple-400" />}
                                  {attachment.type === "file" && <FileText className="w-4 h-4 text-blue-400" />}
                                  {attachment.type === "link" && <Link className="w-4 h-4 text-cyan-400" />}
                                  
                                  <div className="flex-1">
                                    <span className="text-white text-sm">{attachment.name}</span>
                                    {attachment.size && (
                                      <span className="text-slate-400 text-xs ml-2">
                                        ({Math.round(attachment.size / 1024)}KB)
                                      </span>
                                    )}
                                  </div>
                                  
                                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Reactions */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              {["like", "love", "approve", "disapprove"].map(reactionType => {
                                const count = comment.reactions.filter(r => r.type === reactionType).length;
                                const hasReacted = comment.reactions.some(r => r.type === reactionType && r.userId === currentUserId);
                                
                                return (
                                  <Button
                                    key={reactionType}
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 px-2 ${hasReacted ? "text-blue-400" : "text-slate-400 hover:text-white"}`}
                                    onClick={() => handleReaction(comment.id, reactionType as any)}
                                  >
                                    {getReactionIcon(reactionType)}
                                    {count > 0 && <span className="ml-1 text-xs">{count}</span>}
                                  </Button>
                                );
                              })}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white"
                              onClick={() => setReplyingTo(comment.id)}
                            >
                              <Reply className="w-4 h-4 mr-1" />
                              Reply
                            </Button>
                            
                            {(comment.userId === currentUserId || currentUserId === "user1") && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 bg-slate-800/95 border-slate-700 backdrop-blur-md">
                                  <div className="space-y-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start text-slate-300 hover:text-white"
                                      onClick={() => handleEdit(comment.id)}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start text-slate-300 hover:text-white"
                                      onClick={() => togglePin(comment.id)}
                                    >
                                      <Pin className="w-4 h-4 mr-2" />
                                      {comment.isPinned ? "Unpin" : "Pin"}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start text-red-400 hover:text-red-300"
                                      onClick={() => handleDelete(comment.id)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Replies */}
                {getReplies(comment.id).map(reply => (
                  <div key={reply.id} className="ml-8 p-3 bg-white/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={reply.userAvatar} />
                        <AvatarFallback className="bg-slate-700 text-white text-xs">
                          {reply.userName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{reply.userName}</span>
                          <span className="text-slate-500 text-xs">{formatTimestamp(reply.timestamp)}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{reply.message}</p>
                        
                        {reply.attachments && reply.attachments.length > 0 && (
                          <div className="mt-2">
                            {reply.attachments.map(attachment => (
                              <img 
                                key={attachment.id}
                                src={attachment.url} 
                                alt={attachment.name}
                                className="max-w-xs rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>
        
        {/* New Comment Form */}
        {allowComments && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {replyingTo && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Reply className="w-4 h-4" />
                <span>Replying to {comments.find(c => c.id === replyingTo)?.userName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  className="text-slate-400 hover:text-white h-auto p-1"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-slate-700 text-white text-xs">
                  You
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <Textarea
                  ref={textareaRef}
                  placeholder="Add a comment... Use @username to mention team members"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 min-h-[80px]"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <AtSign className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">{newComment.length}/2000</span>
                    <Button 
                      type="submit" 
                      disabled={!newComment.trim()}
                      className="bg-blue-500 hover:bg-blue-600"
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {replyingTo ? "Reply" : "Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}