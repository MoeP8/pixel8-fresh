import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Upload, Save, Smartphone, Monitor, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ProfileSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const activeSessions = [
    {
      device: "Chrome on MacOS",
      location: "San Francisco, CA",
      lastActive: "Current session",
      icon: Monitor
    },
    {
      device: "Mobile App",
      location: "San Francisco, CA", 
      lastActive: "2 hours ago",
      icon: Smartphone
    }
  ];

  const recentActivity = [
    { action: "Logged in", timestamp: "Today at 9:14 AM", location: "San Francisco, CA" },
    { action: "Changed password", timestamp: "Yesterday at 3:22 PM", location: "San Francisco, CA" },
    { action: "Updated profile", timestamp: "Jan 15 at 11:05 AM", location: "San Francisco, CA" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profile & Account</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal settings and account preferences
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and profile photo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Profile photo" />
              <AvatarFallback className="text-lg">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload new photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB. Recommended: 400x400px
              </p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="Enter your first name" 
                defaultValue="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Enter your last name" 
                defaultValue="Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value="john.doe@agency.com" 
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email address
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title/Role</Label>
              <Input 
                id="title" 
                placeholder="e.g., Social Media Manager" 
                defaultValue="Creative Director"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="america/los_angeles">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                  <SelectItem value="europe/london">London (GMT)</SelectItem>
                  <SelectItem value="europe/paris">Paris (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultClient">Default Client</Label>
              <Select defaultValue="auto">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-select last used</SelectItem>
                  <SelectItem value="acme">Acme Corporation</SelectItem>
                  <SelectItem value="techstart">TechStart Inc</SelectItem>
                  <SelectItem value="retail">Retail Brand Co</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active login sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session, index) => {
                const Icon = session.icon;
                return (
                  <TableRow key={index}>
                    <TableCell className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{session.device}</span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">Current</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {session.location}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {session.lastActive}
                    </TableCell>
                    <TableCell>
                      {index !== 0 && (
                        <Button variant="outline" size="sm">
                          End Session
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Account Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Account Activity
          </CardTitle>
          <CardDescription>
            Your recent security and account events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.location}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}