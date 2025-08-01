import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  UserPlus, 
  Mail, 
  MoreHorizontal, 
  Shield, 
  Edit3, 
  Trash2,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotionTeam } from "@/hooks/useNotionTeam";
import { useClients } from "@/hooks/useClients";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "creator" | "viewer";
  lastActive: string;
  status: "active" | "pending" | "inactive";
  avatar?: string;
}

export function TeamAccessSection() {
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("creator");
  const { teamMembers, loading: teamLoading, error: teamError, refetch: refetchTeam } = useNotionTeam();
  const { clients, loading: clientsLoading } = useClients();

  const rolePermissions = {
    admin: {
      color: "bg-destructive text-destructive-foreground",
      permissions: ["Full access", "Team management", "Billing", "Client management"]
    },
    manager: {
      color: "bg-warning text-warning-foreground", 
      permissions: ["Client management", "Approvals", "Campaign management", "Team viewing"]
    },
    creator: {
      color: "bg-primary text-primary-foreground",
      permissions: ["Content creation", "Scheduling", "Client viewing", "Basic analytics"]
    },
    viewer: {
      color: "bg-secondary text-secondary-foreground",
      permissions: ["Read-only access", "Dashboard viewing", "Report access"]
    }
  };

  const handleInvite = () => {
    if (!inviteEmail) return;
    
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${inviteEmail} as ${inviteRole}`,
    });
    
    setInviteEmail("");
    setInviteRole("creator");
  };

  const getRoleBadge = (role: string) => {
    const config = rolePermissions[role as keyof typeof rolePermissions];
    if (!config) return <Badge variant="secondary">{role}</Badge>;
    return (
      <Badge className={config.color}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatLastActive = (lastActive: string) => {
    try {
      const date = new Date(lastActive);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffHours < 1) return "Online now";
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    } catch {
      return lastActive;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Team Access</h1>
        <p className="text-muted-foreground mt-1">
          Manage team members, roles, and permissions
        </p>
      </div>

      {/* Invite New Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Member
          </CardTitle>
          <CardDescription>
            Send an invitation to add a new team member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="inviteEmail" className="sr-only">Email address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="Enter email address..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInvite} disabled={!inviteEmail} className="gap-2">
              <Mail className="h-4 w-4" />
              Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {teamError ? 'Failed to load team data from Notion' : 'Manage existing team members and their permissions'}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetchTeam}
              disabled={teamLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${teamLoading ? 'animate-spin' : ''}`} />
              Sync Notion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {teamLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : teamError ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Unable to load team data from Notion. Please check your integration settings.
              </p>
              <Button onClick={refetchTeam} variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No team members found in Notion
                    </TableCell>
                  </TableRow>
                ) : (
                  teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.profilePhoto} alt={member.name} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatLastActive(member.lastActive)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
          <CardDescription>
            Overview of permissions for each role level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(rolePermissions).map(([role, config]) => (
              <div key={role} className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={config.color}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {config.permissions.map((permission) => (
                    <li key={permission} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Access Management */}
      <Card>
        <CardHeader>
          <CardTitle>Client Access Management</CardTitle>
          <CardDescription>
            Assign team members to specific clients and manage permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientsLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <div className="flex -space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {clients.slice(0, 3).map((client) => (
                <div key={client.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 4) + 1} team members assigned
                        {client.industry && ` • ${client.industry}`}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      Manage Access
                    </Button>
                  </div>
                  <div className="flex -space-x-2">
                    {teamMembers.slice(0, Math.floor(Math.random() * 3) + 1).map((member) => (
                      <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={member.profilePhoto} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No clients found. Add clients to manage team access.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}