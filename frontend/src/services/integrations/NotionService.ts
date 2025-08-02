import { errorHandlingService, ErrorCategory, ErrorSeverity } from '../ErrorHandlingService';

export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: { id: string };
  last_edited_by: { id: string };
  cover?: {
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string };
  };
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
  parent: {
    type: 'database_id' | 'page_id' | 'workspace';
    database_id?: string;
    page_id?: string;
  };
  archived: boolean;
  properties: { [key: string]: any };
  url: string;
  public_url?: string;
}

export interface NotionDatabase {
  id: string;
  created_time: string;
  last_edited_time: string;
  title: Array<{
    type: 'text';
    text: { content: string };
  }>;
  description: Array<{
    type: 'text';
    text: { content: string };
  }>;
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
  cover?: {
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string };
  };
  properties: { [key: string]: any };
  parent: {
    type: 'database_id' | 'page_id' | 'workspace';
    database_id?: string;
    page_id?: string;
  };
  url: string;
  archived: boolean;
}

export interface NotionContentCalendarEntry {
  id: string;
  title: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Scheduled';
  platforms: string[];
  content: string;
  scheduled_date?: string;
  published_date?: string;
  author: string;
  tags: string[];
  client?: string;
  campaign?: string;
  engagement_goal?: string;
  notes?: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  created_time: string;
  last_edited_time: string;
  created_by: { id: string };
  last_edited_by: { id: string };
  archived: boolean;
  has_children: boolean;
  parent: {
    type: 'database_id' | 'page_id' | 'workspace';
    database_id?: string;
    page_id?: string;
  };
  [key: string]: any; // Block-specific properties
}

class NotionService {
  private static instance: NotionService;
  private readonly baseUrl = 'https://api.notion.com/v1';
  private readonly accessToken: string;
  private readonly contentDatabaseId: string;
  private readonly clientsDatabaseId: string;

  constructor() {
    // Use environment variables for Notion configuration
    this.accessToken = import.meta.env.VITE_NOTION_ACCESS_TOKEN || '';
    this.contentDatabaseId = import.meta.env.VITE_NOTION_CONTENT_DATABASE_ID || '';
    this.clientsDatabaseId = import.meta.env.VITE_NOTION_CLIENTS_DATABASE_ID || '';
    
    if (!this.accessToken) {
      console.warn('Notion access token not found. Please set VITE_NOTION_ACCESS_TOKEN');
    }
  }

  static getInstance(): NotionService {
    if (!NotionService.instance) {
      NotionService.instance = new NotionService();
    }
    return NotionService.instance;
  }

  private async makeRequest<T>(endpoint: string, data?: any, method: string = 'POST'): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      await errorHandlingService.handleError(
        error instanceof Error ? error : new Error('Unknown Notion API error'),
        ErrorCategory.EXTERNAL_API,
        ErrorSeverity.MEDIUM,
        { endpoint, service: 'notion' }
      );
      throw error;
    }
  }

  /**
   * Get content calendar entries
   */
  async getContentCalendar(filter?: any, sorts?: any[]): Promise<NotionContentCalendarEntry[]> {
    try {
      if (!this.contentDatabaseId) {
        console.warn('Notion content database ID not configured');
        return [];
      }

      const response = await this.makeRequest<{ results: NotionPage[] }>
        (`/databases/${this.contentDatabaseId}/query`, {
          filter,
          sorts: sorts || [
            {
              property: 'Scheduled Date',
              direction: 'ascending'
            }
          ]
        });

      return response.results.map(page => this.parseContentCalendarEntry(page));
    } catch (error) {
      console.error('Failed to get Notion content calendar:', error);
      return [];
    }
  }

  /**
   * Create a new content calendar entry
   */
  async createContentPage(content: {
    title: string;
    status: string;
    platforms: string[];
    content: string;
    scheduled_date?: string;
    author: string;
    tags?: string[];
    client?: string;
    campaign?: string;
  }): Promise<NotionPage | null> {
    try {
      if (!this.contentDatabaseId) {
        console.warn('Notion content database ID not configured');
        return null;
      }

      const properties: any = {
        'Title': {
          title: [
            {
              text: {
                content: content.title
              }
            }
          ]
        },
        'Status': {
          select: {
            name: content.status
          }
        },
        'Platforms': {
          multi_select: content.platforms.map(platform => ({ name: platform }))
        },
        'Content': {
          rich_text: [
            {
              text: {
                content: content.content
              }
            }
          ]
        },
        'Author': {
          rich_text: [
            {
              text: {
                content: content.author
              }
            }
          ]
        }
      };

      if (content.scheduled_date) {
        properties['Scheduled Date'] = {
          date: {
            start: content.scheduled_date
          }
        };
      }

      if (content.tags && content.tags.length > 0) {
        properties['Tags'] = {
          multi_select: content.tags.map(tag => ({ name: tag }))
        };
      }

      if (content.client) {
        properties['Client'] = {
          rich_text: [
            {
              text: {
                content: content.client
              }
            }
          ]
        };
      }

      if (content.campaign) {
        properties['Campaign'] = {
          rich_text: [
            {
              text: {
                content: content.campaign
              }
            }
          ]
        };
      }

      return await this.makeRequest<NotionPage>('/pages', {
        parent: {
          database_id: this.contentDatabaseId
        },
        properties
      });
    } catch (error) {
      console.error('Failed to create Notion content page:', error);
      return null;
    }
  }

  /**
   * Update content status
   */
  async updateContentStatus(pageId: string, status: string, publishedDate?: string): Promise<boolean> {
    try {
      const properties: any = {
        'Status': {
          select: {
            name: status
          }
        }
      };

      if (publishedDate && status === 'Published') {
        properties['Published Date'] = {
          date: {
            start: publishedDate
          }
        };
      }

      await this.makeRequest(`/pages/${pageId}`, {
        properties
      }, 'PATCH');

      return true;
    } catch (error) {
      console.error('Failed to update Notion content status:', error);
      return false;
    }
  }

  /**
   * Get database schema
   */
  async getDatabaseSchema(databaseId: string): Promise<NotionDatabase | null> {
    try {
      return await this.makeRequest<NotionDatabase>(`/databases/${databaseId}`, undefined, 'GET');
    } catch (error) {
      console.error('Failed to get Notion database schema:', error);
      return null;
    }
  }

  /**
   * Search content
   */
  async searchContent(query: string): Promise<NotionPage[]> {
    try {
      const response = await this.makeRequest<{ results: NotionPage[] }>('/search', {
        query,
        filter: {
          value: 'page',
          property: 'object'
        },
        sort: {
          direction: 'descending',
          timestamp: 'last_edited_time'
        }
      });

      return response.results;
    } catch (error) {
      console.error('Failed to search Notion content:', error);
      return [];
    }
  }

  /**
   * Get page content (blocks)
   */
  async getPageContent(pageId: string): Promise<NotionBlock[]> {
    try {
      const response = await this.makeRequest<{ results: NotionBlock[] }>
        (`/blocks/${pageId}/children`, undefined, 'GET');

      return response.results;
    } catch (error) {
      console.error('Failed to get Notion page content:', error);
      return [];
    }
  }

  /**
   * Add content to page
   */
  async addContentToPage(pageId: string, blocks: any[]): Promise<boolean> {
    try {
      await this.makeRequest(`/blocks/${pageId}/children`, {
        children: blocks
      }, 'PATCH');

      return true;
    } catch (error) {
      console.error('Failed to add content to Notion page:', error);
      return false;
    }
  }

  /**
   * Get content by status
   */
  async getContentByStatus(status: string): Promise<NotionContentCalendarEntry[]> {
    try {
      return await this.getContentCalendar({
        property: 'Status',
        select: {
          equals: status
        }
      });
    } catch (error) {
      console.error('Failed to get Notion content by status:', error);
      return [];
    }
  }

  /**
   * Get scheduled content for a date range
   */
  async getScheduledContent(startDate: string, endDate: string): Promise<NotionContentCalendarEntry[]> {
    try {
      return await this.getContentCalendar({
        and: [
          {
            property: 'Scheduled Date',
            date: {
              on_or_after: startDate
            }
          },
          {
            property: 'Scheduled Date',
            date: {
              on_or_before: endDate
            }
          }
        ]
      });
    } catch (error) {
      console.error('Failed to get scheduled Notion content:', error);
      return [];
    }
  }

  /**
   * Get content by client
   */
  async getContentByClient(clientName: string): Promise<NotionContentCalendarEntry[]> {
    try {
      return await this.getContentCalendar({
        property: 'Client',
        rich_text: {
          contains: clientName
        }
      });
    } catch (error) {
      console.error('Failed to get Notion content by client:', error);
      return [];
    }
  }

  /**
   * Get recent content
   */
  async getRecentContent(limit: number = 20): Promise<NotionContentCalendarEntry[]> {
    try {
      return await this.getContentCalendar(undefined, [
        {
          property: 'Last Edited',
          direction: 'descending'
        }
      ]);
    } catch (error) {
      console.error('Failed to get recent Notion content:', error);
      return [];
    }
  }

  /**
   * Create content template
   */
  async createContentTemplate(template: {
    name: string;
    platforms: string[];
    content_structure: string;
    tags: string[];
  }): Promise<NotionPage | null> {
    try {
      return await this.createContentPage({
        title: `[TEMPLATE] ${template.name}`,
        status: 'Draft',
        platforms: template.platforms,
        content: template.content_structure,
        author: 'System',
        tags: ['template', ...template.tags]
      });
    } catch (error) {
      console.error('Failed to create Notion content template:', error);
      return null;
    }
  }

  /**
   * Test connection to Notion
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/users/me', undefined, 'GET');
      return true;
    } catch (error) {
      console.error('Notion connection test failed:', error);
      return false;
    }
  }

  /**
   * Parse a Notion page into a content calendar entry
   */
  private parseContentCalendarEntry(page: NotionPage): NotionContentCalendarEntry {
    const properties = page.properties;

    return {
      id: page.id,
      title: this.extractText(properties.Title?.title || properties.Name?.title || []),
      status: properties.Status?.select?.name || 'Draft',
      platforms: properties.Platforms?.multi_select?.map((p: any) => p.name) || [],
      content: this.extractText(properties.Content?.rich_text || []),
      scheduled_date: properties['Scheduled Date']?.date?.start,
      published_date: properties['Published Date']?.date?.start,
      author: this.extractText(properties.Author?.rich_text || []),
      tags: properties.Tags?.multi_select?.map((t: any) => t.name) || [],
      client: this.extractText(properties.Client?.rich_text || []),
      campaign: this.extractText(properties.Campaign?.rich_text || []),
      engagement_goal: this.extractText(properties['Engagement Goal']?.rich_text || []),
      notes: this.extractText(properties.Notes?.rich_text || [])
    };
  }

  /**
   * Extract plain text from Notion rich text array
   */
  private extractText(richText: any[]): string {
    return richText.map(text => text.plain_text || text.text?.content || '').join('');
  }

  /**
   * Get workspace databases
   */
  async getDatabases(): Promise<NotionDatabase[]> {
    try {
      const response = await this.makeRequest<{ results: NotionDatabase[] }>('/search', {
        filter: {
          value: 'database',
          property: 'object'
        }
      });

      return response.results;
    } catch (error) {
      console.error('Failed to get Notion databases:', error);
      return [];
    }
  }
}

export const notionService = NotionService.getInstance();