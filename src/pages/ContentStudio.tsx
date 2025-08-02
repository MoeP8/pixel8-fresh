import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmartComposer } from "@/components/content-studio/SmartComposer";
import { PenTool, Building2, Filter, Save, Share, FileText, Image, Video } from "lucide-react";

const ContentStudio = () => {
  const [selectedClient, setSelectedClient] = useState<string>("");

  // Mock clients data - in real app, this would come from a hook
  const mockClients = [
    { id: "client-1", name: "Acme Corporation" },
    { id: "client-2", name: "TechStart Inc." },
    { id: "client-3", name: "Creative Agency" }
  ];

  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Studio</h1>
            <p className="text-slate-300">
              Create engaging content with AI-powered brand-aware composition
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Content Types</p>
                <p className="text-white text-2xl font-bold">3</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Templates</p>
                <p className="text-white text-2xl font-bold">12</p>
              </div>
              <Image className="w-8 h-8 text-green-400" />
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Drafts</p>
                <p className="text-white text-2xl font-bold">8</p>
              </div>
              <Save className="w-8 h-8 text-purple-400" />
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Published</p>
                <p className="text-white text-2xl font-bold">24</p>
              </div>
              <Share className="w-8 h-8 text-orange-400" />
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="max-w-md">
              <label className="block text-sm font-medium mb-2 text-white">Select Client</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client to create content for..." />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {client.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </GlassCard>

          <GlassCard className="p-16 text-center">
            <EmptyState
              icon={<PenTool className="h-12 w-12 text-slate-400" />}
              title="Select a Client"
              description="Choose a client above to start creating content with their brand guidelines and voice profile."
            />
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Studio</h1>
          <p className="text-slate-300">
            Creating content for {mockClients.find(c => c.id === selectedClient)?.name}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {client.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <GlassButton variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Templates
          </GlassButton>
          <GlassButton variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </GlassButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Words Generated</p>
              <p className="text-white text-2xl font-bold">2.4K</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Images Created</p>
              <p className="text-white text-2xl font-bold">18</p>
            </div>
            <Image className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Video Clips</p>
              <p className="text-white text-2xl font-bold">6</p>
            </div>
            <Video className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Brand Score</p>
              <p className="text-white text-2xl font-bold">94%</p>
            </div>
            <Share className="w-8 h-8 text-orange-400" />
          </div>
        </GlassCard>
      </div>

      {/* Smart Composer */}
      <GlassCard className="p-6">
        <SmartComposer clientId={selectedClient} />
      </GlassCard>
    </div>
  );
};

export default ContentStudio;