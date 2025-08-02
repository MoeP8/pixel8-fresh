import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notionService, NotionClient } from '@/services/NotionService';

export interface Client extends NotionClient {}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try Notion first, fallback to Supabase
      try {
        const notionClients = await notionService.getClients();
        setClients(notionClients);
      } catch (notionError) {
        console.warn('Notion unavailable, falling back to Supabase:', notionError);
        
        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .order('name');

        if (fetchError) throw fetchError;
        
        // Transform Supabase data to match Client interface
        const transformedData = (data || []).map(item => ({
          ...item,
          status: 'active' as const,
          industry: undefined,
          contactEmail: undefined,
          brandColors: undefined,
        }));
        
        // If no data from either source, create some demo data
        if (transformedData.length === 0) {
          const demoClients = [
            {
              id: 'demo-client-1',
              name: 'Demo Client',
              slug: 'demo-client',
              description: 'Demo client for testing purposes',
              user_id: 'demo-user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              status: 'active' as const,
              industry: 'Technology',
              contactEmail: undefined,
              brandColors: undefined,
            },
            {
              id: 'techcorp-solutions',
              name: 'TechCorp Solutions',
              slug: 'techcorp-solutions',
              description: 'Technology consulting company',
              user_id: 'demo-user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              status: 'active' as const,
              industry: 'Technology',
              contactEmail: undefined,
              brandColors: undefined,
            },
            {
              id: 'green-energy-co',
              name: 'Green Energy Co.',
              slug: 'green-energy-co',
              description: 'Renewable energy solutions',
              user_id: 'demo-user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              status: 'active' as const,
              industry: 'Energy',
              contactEmail: undefined,
              brandColors: undefined,
            }
          ];
          setClients(demoClients);
        } else {
          setClients(transformedData);
        }
      }
    } catch (err: any) {
      setError(err.message);
      // Fallback to demo data on any error
      const demoClients = [
        {
          id: 'demo-client-1',
          name: 'Demo Client',
          slug: 'demo-client',
          description: 'Demo client for testing purposes',
          user_id: 'demo-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active' as const,
          industry: 'Technology',
          contactEmail: undefined,
          brandColors: undefined,
        }
      ];
      setClients(demoClients);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients
  };
};