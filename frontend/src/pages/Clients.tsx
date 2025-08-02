import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, Building2, Plus, ExternalLink } from "lucide-react"
import { useClients } from "@/hooks/useClients"

const Clients = () => {
  const { clients, loading, error } = useClients();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "onboarding": return "bg-primary text-primary-foreground";
      case "paused": return "bg-warning text-warning-foreground";
      case "completed": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Clients" showSearch={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Clients" showSearch={true}>
        <EmptyState
          icon={<Users className="h-12 w-12 text-muted-foreground" />}
          title="Failed to Load Clients"
          description={`Error: ${error}. Check your Notion integration or try again.`}
          action={{
            label: "Retry",
            onClick: () => window.location.reload()
          }}
        />
      </DashboardLayout>
    );
  }

  if (clients.length === 0) {
    return (
      <DashboardLayout title="Clients" showSearch={true}>
        <EmptyState
          icon={<Users className="h-12 w-12 text-muted-foreground" />}
          title="No Clients Found"
          description="Connect your Notion workspace or add your first client to get started with client management."
          action={{
            label: "Add First Client",
            onClick: () => console.log("Add client")
          }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Clients" showSearch={true}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">
            {clients.length} client{clients.length !== 1 ? 's' : ''} synced from Notion
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.logo_url} alt={client.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{client.name}</CardTitle>
                  {client.industry && (
                    <p className="text-sm text-muted-foreground">{client.industry}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {client.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {client.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(client.status)}>
                    {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
                  </Badge>
                  {client.brandColors && client.brandColors.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Brand:</span>
                      <div className="flex gap-1">
                        {client.brandColors.slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {client.contactEmail && (
                  <p className="text-xs text-muted-foreground truncate">
                    Contact: {client.contactEmail}
                  </p>
                )}

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(client.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Clients;