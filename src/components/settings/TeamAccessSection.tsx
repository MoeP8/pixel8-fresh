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
  RefreshCw,
  AlertTriangle,
  Loader2,
  Check
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

interface ValidationError {
  field: string;
  message: string;
}

interface InviteResult {
  success: boolean;
  message: string;
}

export function TeamAccessSection() {
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("creator");
  const [isInviting, setIsInviting] = useState(false);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [inviteResult, setInviteResult] = useState<InviteResult | null>(null);
  const { teamMembers, loading: teamLoading, error: teamError, refetch: refetchTeam } = useNotionTeam();
  const { clients, loading: clientsLoading } = useClients();

  // Validation functions
  const validateEmail = (email: string): ValidationError | null => {
    if (!email || email.trim() === "") {
      return {
        field: "email",
        message: "Email address is required"
      };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return {
        field: "email",
        message: "Please enter a valid email address"
      };
    }

    // Check if email already exists
    const existingMember = teamMembers.find(member => 
      member.email.toLowerCase() === email.toLowerCase()
    );
    if (existingMember) {
      return {
        field: "email",
        message: "This email address is already in the team"
      };
    }

    return null;
  };

  const clearValidationError = () => {
    setValidationError(null);
  };

  const clearInviteResult = () => {
    setInviteResult(null);
  };

  const handleEmailChange = (email: string) => {
    setInviteEmail(email);
    clearValidationError();
    clearInviteResult();
    
    // Validate on change if not empty
    if (email.trim()) {
      const error = validateEmail(email);
      if (error) {
        setValidationError(error);
      }
    }
  };

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

  const handleInvite = async () => {
    const error = validateEmail(inviteEmail);
    
    if (error) {
      setValidationError(error);
      toast({
        title: "Validation error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    clearValidationError();
    clearInviteResult();
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/failure for demo (90% success rate)
      const success = Math.random() > 0.1;
      
      const result: InviteResult = {
        success,
        message: success 
          ? `Invitation sent to ${inviteEmail} as ${inviteRole}` 
          : "Failed to send invitation. Please try again."
      };
      
      setInviteResult(result);
      
      if (success) {
        toast({
          title: "Invitation sent",
          description: result.message,
        });
        
        // Reset form on success
        setInviteEmail("");
        setInviteRole("creator");
      } else {
        toast({
          title: "Failed to send invitation",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const result: InviteResult = {
        success: false,
        message: "Network error occurred. Please check your connection and try again."
      };
      
      setInviteResult(result);
      
      toast({
        title: "Invitation failed",
        description: result.message,
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
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
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="inviteEmail" className="sr-only">Email address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="Enter email address..."
                value={inviteEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={validationError ? 'border-destructive focus-visible:ring-destructive' : ''}
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
            <Button 
              onClick={handleInvite} 
              disabled={!inviteEmail || !!validationError || isInviting}
              className="gap-2"
            >
              {isInviting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {isInviting ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
          
          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>{validationError.message}</span>
            </div>
          )}
          
          {/* Invite Result */}
          {inviteResult && (
            <div className={`p-3 rounded-lg border ${
              inviteResult.success 
                ? 'border-success/20 bg-success/5' 
                : 'border-destructive/20 bg-destructive/5'
            }`}>
              <div className="flex items-center gap-2">
                {inviteResult.success ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
                <p className={`text-sm font-medium ${
                  inviteResult.success ? 'text-success' : 'text-destructive'
                }`}>
                  {inviteResult.message}
                </p>
              </div>
            </div>
          )}
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