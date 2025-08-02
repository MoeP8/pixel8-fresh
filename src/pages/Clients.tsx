import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassBadge } from "@/components/ui/glass-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Building2, Plus, ExternalLink, Filter } from "lucide-react"
import { useClients } from "@/hooks/useClients"

const Clients = () => {
  const { clients, loading, error } = useClients();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "onboarding": return "primary";
      case "paused": return "warning";
      case "completed": return "secondary";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
            <p className="text-slate-300">Loading your clients...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
            <p className="text-slate-300">Error loading clients</p>
          </div>
        </div>
        <GlassCard className="p-8 text-center">
          <EmptyState
            icon={<Users className="h-12 w-12 text-slate-400" />}
            title="Failed to Load Clients"
            description={`Error: ${error}. Check your Notion integration or try again.`}
            action={{
              label: "Retry",
              onClick: () => window.location.reload()
            }}
          />
        </GlassCard>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
            <p className="text-slate-300">No clients found</p>
          </div>
        </div>
        <GlassCard className="p-8 text-center">
          <EmptyState
            icon={<Users className="h-12 w-12 text-slate-400" />}
            title="No Clients Found"
            description="Connect your Notion workspace or add your first client to get started with client management."
            action={{
              label: "Add First Client",
              onClick: () => console.log("Add client")
            }}
          />
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
          <p className="text-slate-300">
            {clients.length} client{clients.length !== 1 ? 's' : ''} synced from Notion
          </p>
        </div>
        
        <div className="flex gap-3">
          <GlassButton variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </GlassButton>
          <GlassButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </GlassButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Clients</p>
              <p className="text-white text-2xl font-bold">{clients.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Active Projects</p>
              <p className="text-white text-2xl font-bold">{clients.filter(c => c.status === 'active').length}</p>
            </div>
            <Building2 className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Onboarding</p>
              <p className="text-white text-2xl font-bold">{clients.filter(c => c.status === 'onboarding').length}</p>
            </div>
            <Plus className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Paused</p>
              <p className="text-white text-2xl font-bold">{clients.filter(c => c.status === 'paused').length}</p>
            </div>
            <ExternalLink className="w-8 h-8 text-orange-400" />
          </div>
        </GlassCard>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <GlassCard key={client.id} className="p-6 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={client.logo_url} alt={client.name} />
                <AvatarFallback className="bg-white/10 text-white font-semibold">
                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg truncate">{client.name}</h3>
                {client.industry && (
                  <p className="text-slate-300 text-sm">{client.industry}</p>
                )}
              </div>
              <GlassButton variant="outline" size="sm">
                <ExternalLink className="w-4 h-4" />
              </GlassButton>
            </div>
            
            <div className="space-y-3">
              {client.description && (
                <p className="text-slate-300 text-sm line-clamp-2">
                  {client.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 flex-wrap">
                <GlassBadge variant={getStatusColor(client.status) as any}>
                  {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
                </GlassBadge>
                {client.brandColors && client.brandColors.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">Brand:</span>
                    <div className="flex gap-1">
                      {client.brandColors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {client.contactEmail && (
                <p className="text-xs text-slate-400 truncate">
                  Contact: {client.contactEmail}
                </p>
              )}

              <div className="text-xs text-slate-400">
                Created: {new Date(client.created_at).toLocaleDateString()}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Clients;
