import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/social-accounts';
import { useToast } from '@/hooks/use-toast';

interface ClientFilterProps {
  selectedClient: string | null;
  onClientSelect: (clientId: string | null) => void;
  accounts: any[];
}

export function ClientFilter({ selectedClient, onClientSelect, accounts }: ClientFilterProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const createClient = async () => {
    if (!newClient.name.trim()) return;

    setIsCreating(true);
    try {
      const slug = newClient.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('clients')
        .insert({
          name: newClient.name.trim(),
          slug,
          description: newClient.description.trim() || null,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: 'Client Created',
        description: `${newClient.name} has been added successfully.`,
      });

      setNewClient({ name: '', description: '' });
      setIsDialogOpen(false);
      fetchClients();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create client';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Get account counts per client
  const clientCounts = accounts.reduce((acc, account) => {
    if (account.client_id) {
      acc[account.client_id] = (acc[account.client_id] || 0) + 1;
    } else {
      acc['unassigned'] = (acc['unassigned'] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalAccounts = accounts.length;
  const unassignedCount = clientCounts['unassigned'] || 0;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter by Client:</span>
      </div>
      
      <Select value={selectedClient || 'all'} onValueChange={(value) => onClientSelect(value === 'all' ? null : value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Clients" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center justify-between w-full">
              <span>All Clients</span>
              <Badge variant="outline" className="ml-2">
                {totalAccounts}
              </Badge>
            </div>
          </SelectItem>
          <SelectItem value="unassigned">
            <div className="flex items-center justify-between w-full">
              <span>Unassigned</span>
              <Badge variant="outline" className="ml-2">
                {unassignedCount}
              </Badge>
            </div>
          </SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              <div className="flex items-center justify-between w-full">
                <span>{client.name}</span>
                <Badge variant="outline" className="ml-2">
                  {clientCounts[client.id] || 0}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                value={newClient.name}
                onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <Label htmlFor="client-description">Description (Optional)</Label>
              <Textarea
                id="client-description"
                value={newClient.description}
                onChange={(e) => setNewClient(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the client"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                onClick={createClient}
                disabled={isCreating || !newClient.name.trim()}
              >
                {isCreating ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}