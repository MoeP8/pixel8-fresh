import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  MoreHorizontal,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";
import { CalendarDragDrop } from "./CalendarDragDrop";
import { useScheduling } from "@/hooks/useScheduling";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";

interface CalendarViewProps {
  onCreatePost?: () => void;
  onEditPost?: (postId: string) => void;
}

type CalendarView = "month" | "week" | "day" | "list";

export function CalendarView({ onCreatePost, onEditPost }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<CalendarView>("month");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const { scheduledPosts, loading } = useScheduling();

  const availableFilters = [
    { id: "instagram", label: "Instagram", color: "bg-pink-500" },
    { id: "facebook", label: "Facebook", color: "bg-blue-500" },
    { id: "twitter", label: "Twitter", color: "bg-sky-400" },
    { id: "linkedin", label: "LinkedIn", color: "bg-blue-600" },
    { id: "scheduled", label: "Scheduled", color: "bg-green-500" },
    { id: "published", label: "Published", color: "bg-gray-500" },
    { id: "failed", label: "Failed", color: "bg-red-500" }
  ];

  const filteredPosts = useMemo(() => {
    if (selectedFilters.length === 0) return scheduledPosts;
    
    return scheduledPosts.filter(post => {
      return selectedFilters.some(filter => 
        post.platform.includes(filter) || post.posting_status === filter
      );
    });
  }, [scheduledPosts, selectedFilters]);

  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter(post => 
      isSameDay(new Date(post.scheduled_at), date)
    );
  };

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => 
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: "bg-pink-500",
      facebook: "bg-blue-500", 
      twitter: "bg-sky-400",
      linkedin: "bg-blue-600"
    };
    return colors[platform] || "bg-gray-500";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "border-blue-400 bg-blue-500/20",
      posted: "border-green-400 bg-green-500/20",
      failed: "border-red-400 bg-red-500/20"
    };
    return colors[status] || "border-gray-400 bg-gray-500/20";
  };

  const MonthView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center text-slate-300 font-medium p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day, index) => {
          const dayPosts = getPostsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, new Date());
          
          return (
            <Card 
              key={index}
              className={`min-h-[120px] backdrop-blur-md border transition-all duration-200 hover:scale-105 cursor-pointer ${
                isCurrentMonth 
                  ? "bg-white/10 border-white/20 hover:bg-white/15" 
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              } ${isToday ? "ring-2 ring-blue-400" : ""}`}
            >
              <CardContent className="p-2">
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentMonth ? "text-white" : "text-slate-400"
                } ${isToday ? "text-blue-400" : ""}`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className={`text-xs p-1 rounded border ${getStatusColor(post.posting_status)} cursor-pointer hover:scale-105 transition-transform`}
                      onClick={() => onEditPost?.(post.id)}
                    >
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getPlatformColor(post.platform)}`}></div>
                        <span className="text-white truncate">{post.title}</span>
                      </div>
                      <div className="text-slate-300 text-xs">
                        {format(new Date(post.scheduled_at), "HH:mm")}
                      </div>
                    </div>
                  ))}
                  
                  {dayPosts.length > 3 && (
                    <div className="text-xs text-slate-400 text-center">
                      +{dayPosts.length - 3} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {filteredPosts.length === 0 ? (
        <Card className="backdrop-blur-md bg-white/10 border border-white/20">
          <CardContent className="p-8 text-center">
            <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No posts scheduled</h3>
            <p className="text-slate-300 mb-4">Create your first post to get started</p>
            <Button onClick={onCreatePost} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        filteredPosts.map((post) => (
          <Card 
            key={post.id} 
            className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer"
            onClick={() => onEditPost?.(post.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
                    <h3 className="text-white font-medium">{post.title}</h3>
                    <Badge 
                      variant="secondary"
                      className={getStatusColor(post.posting_status)}
                    >
                      {post.posting_status === 'posted' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {post.posting_status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {post.posting_status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
                      {post.posting_status}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                    {post.content_data?.caption || post.content_data?.message || "No preview available"}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {format(new Date(post.scheduled_at), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(post.scheduled_at), "h:mm a")}
                    </div>
                    <div className="flex items-center gap-1 capitalize">
                      <Eye className="w-4 h-4" />
                      {post.platform}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-1/4"></div>
          <div className="h-12 bg-white/10 rounded"></div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Calendar</h1>
          <p className="text-slate-300">Plan, schedule, and manage your social media content</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {availableFilters.slice(0, 4).map(filter => (
              <Button
                key={filter.id}
                variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                size="sm"
                className={`${filter.color} ${selectedFilters.includes(filter.id) ? '' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                onClick={() => {
                  setSelectedFilters(prev => 
                    prev.includes(filter.id) 
                      ? prev.filter(f => f !== filter.id)
                      : [...prev, filter.id]
                  );
                }}
              >
                {filter.label}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          <Button onClick={onCreatePost} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-2xl font-bold text-white">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigateMonth("next")}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as CalendarView)}>
              <TabsList className="bg-white/10 border-white/20">
                <TabsTrigger value="month" className="data-[state=active]:bg-white/20">Month</TabsTrigger>
                <TabsTrigger value="week" className="data-[state=active]:bg-white/20">Week</TabsTrigger>
                <TabsTrigger value="day" className="data-[state=active]:bg-white/20">Day</TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-white/20">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as CalendarView)}>
        <TabsContent value="month">
          <MonthView />
        </TabsContent>
        
        <TabsContent value="week">
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">Week view coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="day">
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">Day view coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <ListView />
        </TabsContent>
      </Tabs>

      {/* Drag and Drop Calendar */}
      <div className="mt-8">
        <CalendarDragDrop posts={filteredPosts} onPostMove={(postId, newDate) => {
          console.log("Moving post", postId, "to", newDate);
          // Handle post move logic
        }} />
      </div>
    </div>
  );
}