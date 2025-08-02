import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { SchedulingCalendar } from "@/components/scheduling/SchedulingCalendar"
import { LivePostStatus } from "@/components/realtime/LivePostStatus"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealtimeScheduling } from "@/hooks/useRealtimeScheduling"
import { Calendar, Clock, Filter, Plus, BarChart3, Users, CheckCircle, AlertCircle } from "lucide-react"

const Scheduler = () => {
  // Mock data - in real app, get from user's clients
  const clientIds = ['mock-client-1', 'mock-client-2'];
  const brandColors = {
    'mock-client-1': '#3b82f6',
    'mock-client-2': '#10b981'
  };

  const { scheduledPosts, realtimeUpdates } = useRealtimeScheduling();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Scheduler</h1>
          <p className="text-slate-300">
            Schedule and manage your content calendar across all platforms
          </p>
        </div>
        
        <div className="flex gap-3">
          <GlassButton variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </GlassButton>
          <GlassButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Post
          </GlassButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Scheduled Today</p>
              <p className="text-white text-2xl font-bold">
                {scheduledPosts.filter(post => {
                  const today = new Date().toDateString();
                  return new Date(post.scheduled_for).toDateString() === today;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Publishing Now</p>
              <p className="text-white text-2xl font-bold">
                {scheduledPosts.filter(post => post.posting_status === 'publishing').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Published</p>
              <p className="text-white text-2xl font-bold">
                {scheduledPosts.filter(post => post.posting_status === 'posted').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Failed</p>
              <p className="text-white text-2xl font-bold">
                {scheduledPosts.filter(post => post.posting_status === 'failed').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-400" />
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        {/* Live Status Overview */}
        {scheduledPosts.some(post => ['publishing', 'scheduled'].includes(post.posting_status)) && (
          <GlassCard className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Live Status Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
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
          </GlassCard>
        )}
        
        {/* Calendar */}
        <GlassCard className="p-6">
          <SchedulingCalendar clientIds={clientIds} brandColors={brandColors} />
        </GlassCard>
      </div>
    </div>
  );
};

export default Scheduler;