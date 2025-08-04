import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, CheckSquare, Plus, ArrowRight, AlertTriangle, Eye, Clock, Target } from "lucide-react";
import { PresenceIndicator } from "@/components/realtime/PresenceIndicator";
import { ActivityFeed } from "@/components/realtime/ActivityFeed";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard" showSearch={true}>
      {/* Welcome Section */}
      <div className="mb-grid-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-grid-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-grid">Welcome back, Moe</h1>
            <p className="text-lg text-muted-foreground">
              Managing Demo Client • 3 campaigns active • 2 approvals pending
            </p>
          </div>
          <div className="flex gap-grid-2">
            <Button variant="outline" className="touch-target">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Campaign
            </Button>
            <Button className="touch-target shadow-premium">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </div>

      {/* Client Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-3 mb-grid-6">
        <Card className="shadow-premium hover:shadow-premium-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <div className="flex items-center gap-1 text-success text-sm">
              <TrendingUp className="h-3 w-3" />
              +1 from last week
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-premium hover:shadow-premium-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approvals
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <div className="text-warning text-sm">
              Requires attention
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-premium hover:shadow-premium-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Posts This Week
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="text-muted-foreground text-sm">
              8 published, 4 scheduled
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-premium hover:shadow-premium-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reach
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47.2K</div>
            <div className="flex items-center gap-1 text-success text-sm">
              <TrendingUp className="h-3 w-3" />
              +12.3% vs last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Presence & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-grid-3 mb-grid-6">
        <div className="lg:col-span-1">
          <PresenceIndicator />
        </div>
        <div className="lg:col-span-3">
          <ActivityFeed />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-6 mb-grid-6">
        {/* Quick Actions */}
        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for efficient workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-grid-sm">
            <Button variant="outline" className="w-full justify-between touch-target">
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Post
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between touch-target">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Campaign
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between touch-target">
              <span className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Request Approval
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between touch-target">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Analytics
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Urgent Items */}
        <Card className="shadow-premium border-warning/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Urgent Items
            </CardTitle>
            <CardDescription>
              Items requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-grid-sm">
            <div className="flex items-center justify-between p-grid py-grid-2 rounded-lg border border-warning/20 bg-warning/5">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-warning" />
                <div>
                  <p className="text-sm font-medium">Overdue approval</p>
                  <p className="text-xs text-muted-foreground">Instagram campaign - 2 days overdue</p>
                </div>
              </div>
              <Badge variant="outline" className="border-warning text-warning">Overdue</Badge>
            </div>
            <div className="flex items-center justify-between p-grid py-grid-2 rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Failed post</p>
                  <p className="text-xs text-muted-foreground">Twitter API error - needs retry</p>
                </div>
              </div>
              <Badge variant="destructive">Failed</Badge>
            </div>
            <div className="flex items-center justify-between p-grid py-grid-2 rounded-lg border border-warning/20 bg-warning/5">
              <div className="flex items-center gap-3">
                <CheckSquare className="h-4 w-4 text-warning" />
                <div>
                  <p className="text-sm font-medium">Client feedback needed</p>
                  <p className="text-xs text-muted-foreground">LinkedIn campaign draft</p>
                </div>
              </div>
              <Badge variant="outline" className="border-warning text-warning">Waiting</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and client interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-grid-sm">
            <div className="flex items-center justify-between p-grid py-grid-2 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success" />
                <div>
                  <p className="text-sm font-medium">Client approved campaign</p>
                  <p className="text-xs text-muted-foreground">TechCorp Solutions • 5 min ago</p>
                </div>
              </div>
              <Badge className="bg-success text-success-foreground">Approved</Badge>
            </div>
            <div className="flex items-center justify-between p-grid py-grid-2 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <div>
                  <p className="text-sm font-medium">Instagram post published</p>
                  <p className="text-xs text-muted-foreground">Demo Client • 12 min ago</p>
                </div>
              </div>
              <Badge variant="secondary">Published</Badge>
            </div>
            <div className="flex items-center justify-between p-grid py-grid-2 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <div>
                  <p className="text-sm font-medium">Campaign submitted for review</p>
                  <p className="text-xs text-muted-foreground">Green Energy Co. • 1 hour ago</p>
                </div>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-grid py-grid-2 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">New client onboarded</p>
                  <p className="text-xs text-muted-foreground">RetailMax Inc. • 2 hours ago</p>
                </div>
              </div>
              <Badge>New Client</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;