import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BrandAsset, 
  BrandColor, 
  BrandTypography, 
  BrandVoiceProfile, 
  ContentPillar,
  HashtagStrategy,
  ComplianceNote,
  BrandGuideline,
  BrandAssetRequest,
  BrandAssetType
} from '@/types/brand-management';

export function useBrandManagement(clientId?: string) {
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([]);
  const [brandColors, setBrandColors] = useState<BrandColor[]>([]);
  const [brandTypography, setBrandTypography] = useState<BrandTypography[]>([]);
  const [brandVoiceProfiles, setBrandVoiceProfiles] = useState<BrandVoiceProfile[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [hashtagStrategies, setHashtagStrategies] = useState<HashtagStrategy[]>([]);
  const [complianceNotes, setComplianceNotes] = useState<ComplianceNote[]>([]);
  const [brandGuidelines, setBrandGuidelines] = useState<BrandGuideline[]>([]);
  const [assetRequests, setAssetRequests] = useState<BrandAssetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all brand data
  const fetchBrandData = async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      
      const [
        assetsRes,
        colorsRes,
        typographyRes,
        voiceRes,
        pillarsRes,
        hashtagsRes,
        complianceRes,
        guidelinesRes,
        requestsRes
      ] = await Promise.all([
        supabase.from('brand_assets').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
        supabase.from('brand_colors').select('*').eq('client_id', clientId).order('sort_order'),
        supabase.from('brand_typography').select('*').eq('client_id', clientId).order('sort_order'),
        supabase.from('brand_voice_profiles').select('*').eq('client_id', clientId),
        supabase.from('content_pillars').select('*').eq('client_id', clientId).order('sort_order'),
        supabase.from('hashtag_strategies').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
        supabase.from('compliance_notes').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
        supabase.from('brand_guidelines').select('*').eq('client_id', clientId).order('version_number', { ascending: false }),
        supabase.from('brand_asset_requests').select('*').eq('client_id', clientId).order('created_at', { ascending: false })
      ]);

      if (assetsRes.error) throw assetsRes.error;
      if (colorsRes.error) throw colorsRes.error;
      if (typographyRes.error) throw typographyRes.error;
      if (voiceRes.error) throw voiceRes.error;
      if (pillarsRes.error) throw pillarsRes.error;
      if (hashtagsRes.error) throw hashtagsRes.error;
      if (complianceRes.error) throw complianceRes.error;
      if (guidelinesRes.error) throw guidelinesRes.error;
      if (requestsRes.error) throw requestsRes.error;

      setBrandAssets(assetsRes.data || []);
      setBrandColors(colorsRes.data || []);
      setBrandTypography(typographyRes.data || []);
      setBrandVoiceProfiles(voiceRes.data || []);
      setContentPillars(pillarsRes.data || []);
      setHashtagStrategies(hashtagsRes.data || []);
      setComplianceNotes(complianceRes.data || []);
      setBrandGuidelines(guidelinesRes.data || []);
      setAssetRequests(requestsRes.data || []);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch brand data';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Brand Colors
  const addBrandColor = async (color: Omit<BrandColor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('brand_colors').insert(color);
      if (error) throw error;
      
      toast({
        title: 'Color Added',
        description: 'Brand color has been added successfully.',
      });
      
      fetchBrandData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add color';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const updateBrandColor = async (id: string, updates: Partial<BrandColor>) => {
    try {
      const { error } = await supabase
        .from('brand_colors')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Color Updated',
        description: 'Brand color has been updated successfully.',
      });
      
      fetchBrandData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update color';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const deleteBrandColor = async (id: string) => {
    try {
      const { error } = await supabase.from('brand_colors').delete().eq('id', id);
      if (error) throw error;
      
      toast({
        title: 'Color Deleted',
        description: 'Brand color has been removed successfully.',
      });
      
      fetchBrandData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete color';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  // File upload helper
  const uploadFile = async (file: File, bucket: string, path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
        
      return publicUrl;
    } catch (err) {
      throw new Error(`Failed to upload file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Brand Assets
  const addBrandAsset = async (
    assetData: Omit<BrandAsset, 'id' | 'file_url' | 'created_at' | 'updated_at'>,
    file: File
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${clientId}/${fileName}`;
      
      const fileUrl = await uploadFile(file, 'brand-assets', filePath);
      
      const { error } = await supabase.from('brand_assets').insert({
        ...assetData,
        file_url: fileUrl,
        file_size: file.size,
        file_type: file.type,
        created_by: user.id
      });
      
      if (error) throw error;
      
      toast({
        title: 'Asset Added',
        description: 'Brand asset has been uploaded successfully.',
      });
      
      fetchBrandData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add asset';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  // Asset Requests
  const createAssetRequest = async (request: Omit<BrandAssetRequest, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('brand_asset_requests').insert({
        ...request,
        requested_by: user.id
      });
      
      if (error) throw error;
      
      toast({
        title: 'Request Created',
        description: 'Asset request has been submitted successfully.',
      });
      
      fetchBrandData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create request';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchBrandData();
    }
  }, [clientId]);

  // Add missing CRUD functions for new components
  const addBrandTypography = async (typography: Omit<BrandTypography, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('brand_typography').insert([typography]);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Typography added successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const updateBrandTypography = async (id: string, updates: Partial<BrandTypography>) => {
    try {
      const { error } = await supabase.from('brand_typography').update(updates).eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Typography updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const deleteBrandTypography = async (id: string) => {
    try {
      const { error } = await supabase.from('brand_typography').delete().eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Typography deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const addContentPillar = async (pillar: Omit<ContentPillar, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('content_pillars').insert([pillar]);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Content pillar added successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const updateContentPillar = async (id: string, updates: Partial<ContentPillar>) => {
    try {
      const { error } = await supabase.from('content_pillars').update(updates).eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Content pillar updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const deleteContentPillar = async (id: string) => {
    try {
      const { error } = await supabase.from('content_pillars').delete().eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Content pillar deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const addHashtagStrategy = async (strategy: Omit<HashtagStrategy, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('hashtag_strategies').insert([strategy]);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Hashtag strategy added successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const updateHashtagStrategy = async (id: string, updates: Partial<HashtagStrategy>) => {
    try {
      const { error } = await supabase.from('hashtag_strategies').update(updates).eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Hashtag strategy updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const deleteHashtagStrategy = async (id: string) => {
    try {
      const { error } = await supabase.from('hashtag_strategies').delete().eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Hashtag strategy deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const addComplianceNote = async (note: Omit<ComplianceNote, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('compliance_notes').insert([note]);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Compliance note added successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const updateComplianceNote = async (id: string, updates: Partial<ComplianceNote>) => {
    try {
      const { error } = await supabase.from('compliance_notes').update(updates).eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Compliance note updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const deleteComplianceNote = async (id: string) => {
    try {
      const { error } = await supabase.from('compliance_notes').delete().eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Compliance note deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const addBrandGuideline = async (guidelineData: Omit<BrandGuideline, 'id' | 'file_url' | 'created_at' | 'updated_at'>, file: File) => {
    try {
      const fileUrl = await uploadFile(file, 'brand-guidelines', `${clientId}/${Date.now()}_${file.name}`);
      
      const { error } = await supabase.from('brand_guidelines').insert([{
        ...guidelineData,
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      }]);

      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Brand guideline added successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const updateBrandGuideline = async (id: string, updates: Partial<BrandGuideline>) => {
    try {
      const { error } = await supabase.from('brand_guidelines').update(updates).eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Brand guideline updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const deleteBrandGuideline = async (id: string) => {
    try {
      const { error } = await supabase.from('brand_guidelines').delete().eq('id', id);
      if (error) throw error;
      await fetchBrandData();
      toast({ title: 'Brand guideline deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  return {
    // Data
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
    
    // Actions
    addBrandColor,
    updateBrandColor,
    deleteBrandColor,
    addBrandAsset,
    createAssetRequest,
    addBrandTypography,
    updateBrandTypography,
    deleteBrandTypography,
    addContentPillar,
    updateContentPillar,
    deleteContentPillar,
    addHashtagStrategy,
    updateHashtagStrategy,
    deleteHashtagStrategy,
    addComplianceNote,
    updateComplianceNote,
    deleteComplianceNote,
    addBrandGuideline,
    updateBrandGuideline,
    deleteBrandGuideline,
    refetch: fetchBrandData
  };
}