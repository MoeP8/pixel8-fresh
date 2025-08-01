interface NotionProperty {
  id: string;
  type: string;
  [key: string]: any;
}

interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
  created_time: string;
  last_edited_time: string;
}

interface NotionResponse {
  results: NotionPage[];
  has_more: boolean;
  next_cursor?: string;
}

export interface NotionTeamMember {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'creator' | 'viewer';
  email: string;
  status: 'active' | 'inactive';
  profilePhoto?: string;
  lastActive: string;
}

export interface NotionClient {
  id: string;
  name: string;
  industry?: string;
  status: 'active' | 'onboarding' | 'paused' | 'completed';
  contactEmail?: string;
  brandColors?: string[];
  slug: string;
  description?: string;
  logo_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

class NotionService {
  private apiToken: string;
  private teamDbId: string;
  private clientsDbId: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.apiToken = import.meta.env.VITE_NOTION_API_TOKEN || '';
    this.teamDbId = import.meta.env.VITE_NOTION_TEAM_DB_ID || '';
    this.clientsDbId = import.meta.env.VITE_NOTION_CLIENTS_DB_ID || '';
  }

  private isConfigured(): boolean {
    return !!(this.apiToken && this.teamDbId && this.clientsDbId);
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async makeNotionRequest(url: string): Promise<NotionResponse> {
    if (!this.isConfigured()) {
      throw new Error('Notion integration not configured. Please add API token and database IDs.');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        page_size: 100,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  private extractTextProperty(property: NotionProperty): string {
    if (property.type === 'title' && property.title?.length > 0) {
      return property.title[0]?.plain_text || '';
    }
    if (property.type === 'rich_text' && property.rich_text?.length > 0) {
      return property.rich_text[0]?.plain_text || '';
    }
    return '';
  }

  private extractSelectProperty(property: NotionProperty): string {
    if (property.type === 'select' && property.select) {
      return property.select.name || '';
    }
    return '';
  }

  private extractEmailProperty(property: NotionProperty): string {
    if (property.type === 'email') {
      return property.email || '';
    }
    return '';
  }

  private extractFileProperty(property: NotionProperty): string {
    if (property.type === 'files' && property.files?.length > 0) {
      const file = property.files[0];
      return file.type === 'external' ? file.external.url : file.file.url;
    }
    return '';
  }

  async getTeamMembers(): Promise<NotionTeamMember[]> {
    const cacheKey = 'team-members';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.makeNotionRequest(
        `https://api.notion.com/v1/databases/${this.teamDbId}/query`
      );

      const teamMembers = response.results.map((page): NotionTeamMember => {
        const props = page.properties;
        return {
          id: page.id,
          name: this.extractTextProperty(props.Name || props.name || props.title),
          role: this.extractSelectProperty(props.Role || props.role).toLowerCase() as any || 'viewer',
          email: this.extractEmailProperty(props.Email || props.email),
          status: this.extractSelectProperty(props.Status || props.status).toLowerCase() as any || 'active',
          profilePhoto: this.extractFileProperty(props['Profile Photo'] || props.photo),
          lastActive: page.last_edited_time,
        };
      });

      this.setCachedData(cacheKey, teamMembers);
      return teamMembers;
    } catch (error) {
      console.error('Failed to fetch team members from Notion:', error);
      throw error;
    }
  }

  async getClients(): Promise<NotionClient[]> {
    const cacheKey = 'clients';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.makeNotionRequest(
        `https://api.notion.com/v1/databases/${this.clientsDbId}/query`
      );

      const clients = response.results.map((page): NotionClient => {
        const props = page.properties;
        const clientName = this.extractTextProperty(props['Client Name'] || props.name || props.title);
        const brandColorsText = this.extractTextProperty(props['Brand Colors'] || props.colors);
        
        return {
          id: page.id,
          name: clientName,
          industry: this.extractSelectProperty(props.Industry || props.industry),
          status: this.extractSelectProperty(props.Status || props.status).toLowerCase() as any || 'active',
          contactEmail: this.extractEmailProperty(props['Contact Email'] || props.email),
          brandColors: brandColorsText ? brandColorsText.split(',').map(c => c.trim()) : [],
          slug: clientName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          description: this.extractTextProperty(props.Description || props.description),
          logo_url: this.extractFileProperty(props.Logo || props.logo),
          user_id: 'notion-user', // placeholder
          created_at: page.created_time,
          updated_at: page.last_edited_time,
        };
      });

      this.setCachedData(cacheKey, clients);
      return clients;
    } catch (error) {
      console.error('Failed to fetch clients from Notion:', error);
      throw error;
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          message: 'Notion integration not configured. Please add API token and database IDs.',
        };
      }

      // Test both database connections
      await Promise.all([
        this.makeNotionRequest(`https://api.notion.com/v1/databases/${this.teamDbId}/query`),
        this.makeNotionRequest(`https://api.notion.com/v1/databases/${this.clientsDbId}/query`),
      ]);

      return {
        success: true,
        message: 'Successfully connected to Notion workspace',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to Notion',
      };
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getConnectionStatus(): {
    isConfigured: boolean;
    lastSync?: string;
    cacheSize: number;
  } {
    const lastSyncEntry = Array.from(this.cache.values()).reduce((latest, entry) => {
      return !latest || entry.timestamp > latest.timestamp ? entry : latest;
    }, null as any);

    return {
      isConfigured: this.isConfigured(),
      lastSync: lastSyncEntry ? new Date(lastSyncEntry.timestamp).toISOString() : undefined,
      cacheSize: this.cache.size,
    };
  }
}

export const notionService = new NotionService();