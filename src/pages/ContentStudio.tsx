import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmartComposer } from "@/components/content-studio/SmartComposer";
import { PenTool, Building2 } from "lucide-react";

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
      <DashboardLayout title="Content Studio" showSearch={true}>
        <div className="space-y-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium mb-2">Select Client</label>
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

          <EmptyState
            icon={<PenTool className="h-12 w-12 text-muted-foreground" />}
            title="Select a Client"
            description="Choose a client above to start creating content with their brand guidelines and voice profile."
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Content Studio" showSearch={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Smart Content Creator</h2>
            <p className="text-muted-foreground">
              Creating content for {mockClients.find(c => c.id === selectedClient)?.name}
            </p>
          </div>
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
        </div>

        <SmartComposer clientId={selectedClient} />
      </div>
    </DashboardLayout>
  );
};

export default ContentStudio;