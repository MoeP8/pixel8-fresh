import { DashboardLayout } from "@/components/DashboardLayout"
import { SchedulingCalendar } from "@/components/scheduling/SchedulingCalendar"
import { LivePostStatus } from "@/components/realtime/LivePostStatus"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealtimeScheduling } from "@/hooks/useRealtimeScheduling"

const Scheduler = () => {
  // Mock data - in real app, get from user's clients
  const clientIds = ['mock-client-1', 'mock-client-2'];
  const brandColors = {
    'mock-client-1': '#3b82f6',
    'mock-client-2': '#10b981'
  };

  const { scheduledPosts, realtimeUpdates } = useRealtimeScheduling();

  return (
    <DashboardLayout title="Content Scheduler" showSearch={true}>
      <div className="space-y-6">
        {/* Live Status Overview */}
        {scheduledPosts.some(post => ['publishing', 'scheduled'].includes(post.posting_status)) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Live Status Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledPosts
                  .filter(post => ['publishing', 'scheduled', 'failed'].includes(post.posting_status))
                  .slice(0, 6)
                  .map(post => (
                    <LivePostStatus 
                      key={post.id} 
                      post={post} 
                      showEngagement={post.posting_status === 'posted'}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <SchedulingCalendar clientIds={clientIds} brandColors={brandColors} />
      </div>
    </DashboardLayout>
  );
};

export default Scheduler;