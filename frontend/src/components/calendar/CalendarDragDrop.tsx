import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format, isSameDay, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

interface Post {
  id: string;
  title: string;
  platform: string;
  scheduled_at: string;
  posting_status: "scheduled" | "posted" | "failed";
  content_data?: {
    caption?: string;
    message?: string;
  };
}

interface CalendarDragDropProps {
  posts: Post[];
  onPostMove: (postId: string, newDate: Date) => void;
}

interface DraggablePostProps {
  post: Post;
  isOverlay?: boolean;
}

function DraggablePost({ post, isOverlay = false }: DraggablePostProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
      scheduled: "border-blue-400 bg-blue-500/20 text-blue-400",
      posted: "border-green-400 bg-green-500/20 text-green-400",
      failed: "border-red-400 bg-red-500/20 text-red-400"
    };
    return colors[status] || "border-gray-400 bg-gray-500/20 text-gray-400";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isOverlay ? 'z-50' : ''}`}
    >
      <Card className={`backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 ${
        isDragging ? 'shadow-lg scale-105' : ''
      } ${isOverlay ? 'shadow-2xl' : ''}`}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
              <h4 className="text-white text-sm font-medium truncate">{post.title}</h4>
            </div>
            <Badge 
              variant="secondary"
              className={`text-xs ${getStatusColor(post.posting_status)}`}
            >
              {post.posting_status === 'posted' && <CheckCircle className="w-3 h-3 mr-1" />}
              {post.posting_status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
              {post.posting_status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
              {post.posting_status}
            </Badge>
          </div>
          
          <p className="text-slate-300 text-xs mb-2 line-clamp-1">
            {post.content_data?.caption || post.content_data?.message || "No preview"}
          </p>
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="capitalize">{post.platform}</span>
            <span>{format(new Date(post.scheduled_at), "HH:mm")}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DroppableCalendarDayProps {
  date: Date;
  posts: Post[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

function DroppableCalendarDay({ date, posts, isCurrentMonth, isToday }: DroppableCalendarDayProps) {
  const dayPosts = posts.filter(post => isSameDay(new Date(post.scheduled_at), date));

  return (
    <Card 
      className={`min-h-[140px] backdrop-blur-md border transition-all duration-200 hover:scale-105 ${
        isCurrentMonth 
          ? "bg-white/10 border-white/20 hover:bg-white/15" 
          : "bg-white/5 border-white/10 hover:bg-white/10"
      } ${isToday ? "ring-2 ring-blue-400" : ""}`}
    >
      <CardContent className="p-3">
        <div className={`text-sm font-medium mb-3 ${
          isCurrentMonth ? "text-white" : "text-slate-400"
        } ${isToday ? "text-blue-400" : ""}`}>
          {date.getDate()}
        </div>
        
        <SortableContext items={dayPosts.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {dayPosts.map((post) => (
              <DraggablePost key={post.id} post={post} />
            ))}
          </div>
        </SortableContext>
        
        {dayPosts.length === 0 && (
          <div className="h-full flex items-center justify-center opacity-50">
            <div className="w-full h-16 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-slate-400">Drop here</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CalendarDragDrop({ posts, onPostMove }: CalendarDragDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentDate] = useState(new Date());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const monthDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate))
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activePost = posts.find(p => p.id === active.id);
    if (!activePost) return;

    // Find which day the post was dropped on
    const dayIndex = monthDays.findIndex(day => 
      over.id === `day-${day.getTime()}`
    );

    if (dayIndex !== -1) {
      const newDate = monthDays[dayIndex];
      const currentTime = new Date(activePost.scheduled_at);
      const newDateTime = new Date(newDate);
      newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes());
      
      onPostMove(activePost.id, newDateTime);
    }
  };

  const activePost = posts.find(p => p.id === activeId);

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Drag & Drop Calendar</h3>
          <p className="text-slate-300 text-sm">Drag posts between dates to reschedule them</p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-slate-300 font-medium p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, new Date());
              
              return (
                <div key={`day-${day.getTime()}`} id={`day-${day.getTime()}`}>
                  <DroppableCalendarDay
                    date={day}
                    posts={posts}
                    isCurrentMonth={isCurrentMonth}
                    isToday={isToday}
                  />
                </div>
              );
            })}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activePost && <DraggablePost post={activePost} isOverlay />}
          </DragOverlay>
        </DndContext>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-slate-300 text-sm">Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-300 text-sm">Facebook</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                <span className="text-slate-300 text-sm">Twitter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-slate-300 text-sm">LinkedIn</span>
              </div>
            </div>
            
            <div className="text-slate-400 text-sm">
              {posts.length} posts • Drag to reschedule
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}