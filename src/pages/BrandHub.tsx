import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  Palette, 
  FileImage, 
  Type, 
  Mic, 
  Target, 
  Hash, 
  Shield, 
  Building2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { BrandColorPalette } from '@/components/brand-management/BrandColorPalette';
import { BrandAssetLibrary } from '@/components/brand-management/BrandAssetLibrary';
import { VoiceProfileEditor } from '@/components/brand-management/VoiceProfileEditor';
import { useBrandManagement } from '@/hooks/useBrandManagement';
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/types/social-accounts';
import type { VoiceTrait } from '@/types/brand-management';

const BrandHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);

  const {
    brandAssets,
    brandColors,
    brandTypography,
    brandVoiceProfiles,
    contentPillars,
    hashtagStrategies,
    complianceNotes,
    brandGuidelines,
    assetRequests,
    loading,
    error,
    addBrandColor,
    updateBrandColor,
    deleteBrandColor,
    addBrandAsset,
    createAssetRequest,
    refetch
  } = useBrandManagement(selectedClient || undefined);

  // Fetch clients
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setClients(data || []);
      
      // Auto-select from URL params or first client
      const clientFromUrl = searchParams.get('client');
      if (clientFromUrl && data?.some(c => c.id === clientFromUrl)) {
        setSelectedClient(clientFromUrl);
      } else if (data && data.length > 0 && !selectedClient) {
        setSelectedClient(data[0].id);
        setSearchParams({ client: data[0].id });
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    setSearchParams({ client: clientId });
  };

  const handleUpdateVoiceProfile = async (
    trait: VoiceTrait, 
    value: number, 
    description?: string, 
    examples?: any
  ) => {
    if (!selectedClient) return;

    try {
      const { error } = await supabase
        .from('brand_voice_profiles')
        .upsert({
          client_id: selectedClient,
          trait_type: trait,
          trait_value: value,
          description: description || null,
          examples: examples || null
        });

      if (error) throw error;
      refetch();
    } catch (err) {
      console.error('Failed to update voice profile:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (loadingClients) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassCard key={i} className="p-4">
              <Skeleton className="h-32 w-full" />
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="h-12 w-12 text-muted-foreground" />}
        title="No Clients Found"
        description="You need to add clients before you can manage their brand guidelines."
        action={{
          label: "Add Client",
          onClick: () => {} // This would navigate to clients page
        }}
      />
    );
  }

  const selectedClientData = clients.find(c => c.id === selectedClient);

  return (
    <div className="space-y-6" data-tour="brand-overview">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brand Hub</h1>
          <p className="text-muted-foreground">
            Manage brand guidelines, assets, and voice profiles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedClient || ''} onValueChange={handleClientSelect}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {selectedClient && selectedClientData && (
        <>
          {/* Client Info Card */}
          <GlassCard className="p-6" variant="subtle" hover glow>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedClientData.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedClientData.description || 'No description available'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {brandAssets.length} Assets
                </Badge>
                <Badge variant="outline">
                  {brandColors.length} Colors
                </Badge>
                <Badge variant="outline">
                  {contentPillars.length} Pillars
                </Badge>
              </div>
            </div>
          </GlassCard>

          {/* Brand Management Tabs */}
          <Tabs defaultValue="colors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Hashtags
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Compliance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors">
              <BrandColorPalette
                colors={brandColors}
                onAddColor={addBrandColor}
                onUpdateColor={updateBrandColor}
                onDeleteColor={deleteBrandColor}
                clientId={selectedClient}
              />
            </TabsContent>

            <TabsContent value="assets">
              <BrandAssetLibrary
                assets={brandAssets}
                onAddAsset={addBrandAsset}
                clientId={selectedClient}
              />
            </TabsContent>

            <TabsContent value="typography">
              <GlassCard className="p-6" variant="subtle">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Typography Guidelines
                  </h3>
                </div>
                <EmptyState
                  icon={<Type className="h-12 w-12 text-muted-foreground" />}
                  title="Typography Management"
                  description="Typography management features coming soon. Define font families, sizes, and usage guidelines."
                />
              </GlassCard>
            </TabsContent>

            <TabsContent value="voice">
              <VoiceProfileEditor
                voiceProfiles={brandVoiceProfiles}
                onUpdateVoiceProfile={handleUpdateVoiceProfile}
                clientId={selectedClient}
              />
            </TabsContent>

            <TabsContent value="content">
              <GlassCard className="p-6" variant="subtle">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Content Strategy
                  </h3>
                </div>
                <EmptyState
                  icon={<Target className="h-12 w-12 text-muted-foreground" />}
                  title="Content Pillars & Strategy"
                  description="Content pillar management features coming soon. Define your content strategy and messaging frameworks."
                />
              </GlassCard>
            </TabsContent>

            <TabsContent value="hashtags">
              <GlassCard className="p-6" variant="subtle">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Hashtag Strategies
                  </h3>
                </div>
                <EmptyState
                  icon={<Hash className="h-12 w-12 text-muted-foreground" />}
                  title="Hashtag Strategy Management"
                  description="Hashtag strategy features coming soon. Create platform-specific hashtag collections and performance tracking."
                />
              </GlassCard>
            </TabsContent>

            <TabsContent value="compliance">
              <GlassCard className="p-6" variant="subtle">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Compliance & Guidelines
                  </h3>
                </div>
                <EmptyState
                  icon={<Shield className="h-12 w-12 text-muted-foreground" />}
                  title="Compliance Management"
                  description="Compliance features coming soon. Manage industry regulations, prohibited terms, and approval workflows."
                />
              </GlassCard>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default BrandHub;