import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScheduling, type ScheduledPost } from "@/hooks/useScheduling";
import { SchedulePostModal } from "./SchedulePostModal";
import { BulkScheduleModal } from "./BulkScheduleModal";
import { CalendarEvent } from "./CalendarEvent";
import { CalendarToolbar } from "./CalendarToolbar";
import { Plus, Upload, BarChart3, Settings } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface SchedulingCalendarProps {
  clientIds: string[];
  brandColors: { [clientId: string]: string };
}

export function SchedulingCalendar({ clientIds, brandColors }: SchedulingCalendarProps) {
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduledPost | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  const { 
    scheduledPosts, 
    loading, 
    updateScheduledPost, 
    deleteScheduledPost,
    fetchScheduledPosts
  } = useScheduling();

  // Transform scheduled posts to calendar events
  const events = useMemo(() => {
    return scheduledPosts.map(post => ({
      id: post.id,
      title: post.title,
      start: new Date(post.scheduled_at),
      end: new Date(new Date(post.scheduled_at).getTime() + 30 * 60 * 1000), // 30 min duration
      resource: post,
    }));
  }, [scheduledPosts]);

  // Get status counts for dashboard
  const getStatusCounts = () => {
    return {
      scheduled: scheduledPosts.filter(p => p.posting_status === 'scheduled').length,
      posted: scheduledPosts.filter(p => p.posting_status === 'posted').length,
      failed: scheduledPosts.filter(p => p.posting_status === 'failed').length,
    };
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const newPost = {
      scheduled_at: start.toISOString(),
      client_id: clientIds[0] || '',
    };
    setSelectedEvent(newPost as any);
    setShowScheduleModal(true);
  };

  const handleEventDrop = async ({ event, start, end }: any) => {
    try {
      await updateScheduledPost(event.id, {
        scheduled_at: start.toISOString(),
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleEventResize = async ({ event, start, end }: any) => {
    try {
      await updateScheduledPost(event.id, {
        scheduled_at: start.toISOString(),
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const eventStyleGetter = (event: any) => {
    const post = event.resource as ScheduledPost;
    const clientColor = brandColors[post.client_id] || '#3174ad';
    
    let backgroundColor = clientColor;
    let borderColor = clientColor;
    
    // Adjust colors based on status
    switch (post.posting_status) {
      case 'posted':
        backgroundColor = '#10b981'; // green
        borderColor = '#059669';
        break;
      case 'failed':
        backgroundColor = '#ef4444'; // red
        borderColor = '#dc2626';
        break;
      case 'cancelled':
        backgroundColor = '#6b7280'; // gray
        borderColor = '#4b5563';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: `2px solid ${borderColor}`,
        borderRadius: '6px',
        opacity: post.posting_status === 'cancelled' ? 0.6 : 1,
      },
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-16"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-12"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-96 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Badge variant="secondary">{statusCounts.scheduled}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.scheduled}</div>
            <p className="text-xs text-muted-foreground">Posts awaiting publishing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Badge variant="default">{statusCounts.posted}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.posted}</div>
            <p className="text-xs text-muted-foreground">Successfully posted</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <Badge variant="destructive">{statusCounts.failed}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.failed}</div>
            <p className="text-xs text-muted-foreground">Posting failures</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkModal(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Bulk Schedule
              </Button>
              <Button
                size="sm"
                onClick={() => setShowScheduleModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 lg:h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={currentView}
              onView={setCurrentView}
              date={currentDate}
              onNavigate={setCurrentDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              eventPropGetter={eventStyleGetter}
              selectable
              popup
              components={{
                event: CalendarEvent,
                toolbar: CalendarToolbar,
              }}
              views={['month', 'week', 'day', 'agenda']}
              step={30}
              timeslots={2}
              defaultDate={new Date()}
              className="rbc-calendar"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showScheduleModal && (
        <SchedulePostModal
          open={showScheduleModal}
          onOpenChange={setShowScheduleModal}
          clientIds={clientIds}
          initialData={selectedEvent}
          onSuccess={() => {
            fetchScheduledPosts(clientIds);
            setShowScheduleModal(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {showBulkModal && (
        <BulkScheduleModal
          open={showBulkModal}
          onOpenChange={setShowBulkModal}
          clientIds={clientIds}
          onSuccess={() => {
            fetchScheduledPosts(clientIds);
            setShowBulkModal(false);
          }}
        />
      )}
    </div>
  );
}