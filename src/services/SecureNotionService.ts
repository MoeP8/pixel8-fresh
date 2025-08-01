import { errorHandlingService, ErrorCategory, ErrorSeverity } from './ErrorHandlingService';

export interface NotionTeam {
  id: string;
  name: string;
  icon?: string;
  domain?: string;
  plan_type?: string;
}

export interface NotionDatabase {
  id: string;
  title: string;
  url: string;
  properties: Record<string, any>;
}

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  created_time: string;
  last_edited_time: string;
}

class SecureNotionService {
  private static instance: SecureNotionService;
  private apiKey: string | null = null;

  static getInstance(): SecureNotionService {
    if (!SecureNotionService.instance) {
      SecureNotionService.instance = new SecureNotionService();
    }
    return SecureNotionService.instance;
  }

  private constructor() {
    this.apiKey = import.meta.env.VITE_NOTION_API_KEY || null;
  }

  private getHeaders(): HeadersInit {
    if (!this.apiKey) {
      throw new Error('Notion API key not configured');
    }

    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };
  }

  async getTeams(): Promise<NotionTeam[]> {
    try {
      if (!this.apiKey) {
        errorHandlingService.logError({
          message: 'Notion API key not configured',
          category: ErrorCategory.AUTHENTICATION,
          severity: ErrorSeverity.HIGH,
          timestamp: new Date().toISOString()
        });
        return [];
      }

      // In a real implementation, this would fetch from Notion's API
      // For now, return mock data if API key exists
      return [
        {
          id: 'team-1',
          name: 'Demo Team',
          icon: '🏢',
          domain: 'demo.notion.so',
          plan_type: 'team'
        }
      ];
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to fetch Notion teams: ${error.message}`,
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        context: { service: 'notion', operation: 'getTeams' },
        timestamp: new Date().toISOString()
      });
      return [];
    }
  }

  async getDatabases(): Promise<NotionDatabase[]> {
    try {
      const response = await fetch('https://api.notion.com/v1/search', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          filter: {
            value: 'database',
            property: 'object'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.results.map((db: any) => ({
        id: db.id,
        title: db.title?.[0]?.plain_text || 'Untitled Database',
        url: db.url,
        properties: db.properties || {}
      }));
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to fetch Notion databases: ${error.message}`,
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        context: { service: 'notion', operation: 'getDatabases' },
        timestamp: new Date().toISOString()
      });
      return [];
    }
  }

  async getPages(databaseId?: string): Promise<NotionPage[]> {
    try {
      let url = 'https://api.notion.com/v1/search';
      let body: any = {
        filter: {
          value: 'page',
          property: 'object'
        }
      };

      if (databaseId) {
        url = `https://api.notion.com/v1/databases/${databaseId}/query`;
        body = {};
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.results.map((page: any) => ({
        id: page.id,
        title: this.extractPageTitle(page),
        url: page.url,
        created_time: page.created_time,
        last_edited_time: page.last_edited_time
      }));
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to fetch Notion pages: ${error.message}`,
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        context: { service: 'notion', operation: 'getPages', databaseId },
        timestamp: new Date().toISOString()
      });
      return [];
    }
  }

  async createPage(databaseId: string, properties: Record<string, any>, content?: any[]): Promise<NotionPage | null> {
    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties,
          children: content || []
        })
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        title: this.extractPageTitle(data),
        url: data.url,
        created_time: data.created_time,
        last_edited_time: data.last_edited_time
      };
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to create Notion page: ${error.message}`,
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        context: { service: 'notion', operation: 'createPage', databaseId },
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  async updatePage(pageId: string, properties: Record<string, any>): Promise<NotionPage | null> {
    try {
      const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ properties })
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        title: this.extractPageTitle(data),
        url: data.url,
        created_time: data.created_time,
        last_edited_time: data.last_edited_time
      };
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to update Notion page: ${error.message}`,
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        context: { service: 'notion', operation: 'updatePage', pageId },
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }

      return { success: true };
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Notion connection test failed: ${error.message}`,
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        context: { service: 'notion', operation: 'testConnection' },
        timestamp: new Date().toISOString()
      });
      
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  private extractPageTitle(page: any): string {
    if (page.properties) {
      // Try to find title property
      const titleProperty = Object.values(page.properties).find((prop: any) => 
        prop.type === 'title' && prop.title?.[0]?.plain_text
      ) as any;
      
      if (titleProperty) {
        return titleProperty.title[0].plain_text;
      }
    }

    // Fallback to page title if available
    if (page.title?.[0]?.plain_text) {
      return page.title[0].plain_text;
    }

    return 'Untitled';
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }
}

export const secureNotionService = SecureNotionService.getInstance();