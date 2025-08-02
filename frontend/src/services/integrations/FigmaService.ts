import { errorHandlingService, ErrorCategory, ErrorSeverity } from '../ErrorHandlingService';

export interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url?: string;
  last_modified: string;
  version: string;
}

export interface FigmaProject {
  id: string;
  name: string;
  files: FigmaFile[];
}

export interface FigmaTeam {
  id: string;
  name: string;
  projects: FigmaProject[];
}

export interface FigmaImage {
  id: string;
  name: string;
  url: string;
  format: 'jpg' | 'png' | 'svg' | 'pdf';
  scale: number;
}

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    handle: string;
    img_url: string;
  };
}

class FigmaService {
  private static instance: FigmaService;
  private readonly baseUrl = 'https://api.figma.com/v1';
  private readonly accessToken: string;

  constructor() {
    // Use environment variable for Figma access token
    this.accessToken = import.meta.env.VITE_FIGMA_ACCESS_TOKEN || '';
    
    if (!this.accessToken) {
      console.warn('Figma access token not found. Please set VITE_FIGMA_ACCESS_TOKEN');
    }
  }

  static getInstance(): FigmaService {
    if (!FigmaService.instance) {
      FigmaService.instance = new FigmaService();
    }
    return FigmaService.instance;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'X-Figma-Token': this.accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      await errorHandlingService.handleError(
        error instanceof Error ? error : new Error('Unknown Figma API error'),
        ErrorCategory.EXTERNAL_API,
        ErrorSeverity.MEDIUM,
        { endpoint, service: 'figma' }
      );
      throw error;
    }
  }

  /**
   * Get user's teams
   */
  async getTeams(): Promise<FigmaTeam[]> {
    try {
      const response = await this.makeRequest<{ teams: any[] }>('/me');
      
      return response.teams.map(team => ({
        id: team.id,
        name: team.name,
        projects: []
      }));
    } catch (error) {
      console.error('Failed to fetch Figma teams:', error);
      return [];
    }
  }

  /**
   * Get projects in a team
   */
  async getTeamProjects(teamId: string): Promise<FigmaProject[]> {
    try {
      const response = await this.makeRequest<{ projects: any[] }>(`/teams/${teamId}/projects`);
      
      return response.projects.map(project => ({
        id: project.id,
        name: project.name,
        files: []
      }));
    } catch (error) {
      console.error('Failed to fetch Figma projects:', error);
      return [];
    }
  }

  /**
   * Get files in a project
   */
  async getProjectFiles(projectId: string): Promise<FigmaFile[]> {
    try {
      const response = await this.makeRequest<{ files: any[] }>(`/projects/${projectId}/files`);
      
      return response.files.map(file => ({
        key: file.key,
        name: file.name,
        thumbnail_url: file.thumbnail_url,
        last_modified: file.last_modified,
        version: file.version
      }));
    } catch (error) {
      console.error('Failed to fetch Figma files:', error);
      return [];
    }
  }

  /**
   * Get file details and metadata
   */
  async getFile(fileKey: string): Promise<any> {
    try {
      return await this.makeRequest(`/files/${fileKey}`);
    } catch (error) {
      console.error('Failed to fetch Figma file:', error);
      return null;
    }
  }

  /**
   * Get exportable images from a file
   */
  async getFileImages(fileKey: string, nodeIds: string[] = [], options: {
    format?: 'jpg' | 'png' | 'svg' | 'pdf';
    scale?: number;
    use_absolute_bounds?: boolean;
  } = {}): Promise<FigmaImage[]> {
    try {
      const params = new URLSearchParams({
        ids: nodeIds.join(','),
        format: options.format || 'png',
        scale: (options.scale || 1).toString(),
        use_absolute_bounds: options.use_absolute_bounds?.toString() || 'false'
      });

      const response = await this.makeRequest<{ images: { [key: string]: string } }>
        (`/images/${fileKey}?${params}`);

      return Object.entries(response.images).map(([id, url]) => ({
        id,
        name: `Node ${id}`,
        url,
        format: options.format || 'png',
        scale: options.scale || 1
      }));
    } catch (error) {
      console.error('Failed to fetch Figma images:', error);
      return [];
    }
  }

  /**
   * Get components from a file
   */
  async getFileComponents(fileKey: string): Promise<FigmaComponent[]> {
    try {
      const response = await this.makeRequest<{ meta: { components: any[] } }>
        (`/files/${fileKey}/components`);

      return response.meta.components.map(component => ({
        key: component.key,
        name: component.name,
        description: component.description || '',
        created_at: component.created_at,
        updated_at: component.updated_at,
        user: component.user
      }));
    } catch (error) {
      console.error('Failed to fetch Figma components:', error);
      return [];
    }
  }

  /**
   * Search for files across teams
   */
  async searchFiles(query: string): Promise<FigmaFile[]> {
    try {
      const teams = await this.getTeams();
      const allFiles: FigmaFile[] = [];

      for (const team of teams) {
        const projects = await this.getTeamProjects(team.id);
        for (const project of projects) {
          const files = await this.getProjectFiles(project.id);
          const matchingFiles = files.filter(file => 
            file.name.toLowerCase().includes(query.toLowerCase())
          );
          allFiles.push(...matchingFiles);
        }
      }

      return allFiles;
    } catch (error) {
      console.error('Failed to search Figma files:', error);
      return [];
    }
  }

  /**
   * Get recent files (most recently modified first)
   */
  async getRecentFiles(limit: number = 20): Promise<FigmaFile[]> {
    try {
      const teams = await this.getTeams();
      const allFiles: FigmaFile[] = [];

      for (const team of teams) {
        const projects = await this.getTeamProjects(team.id);
        for (const project of projects) {
          const files = await this.getProjectFiles(project.id);
          allFiles.push(...files);
        }
      }

      // Sort by last modified date and limit
      return allFiles
        .sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch recent Figma files:', error);
      return [];
    }
  }

  /**
   * Get file thumbnail URL
   */
  async getFileThumbnail(fileKey: string): Promise<string | null> {
    try {
      const file = await this.getFile(fileKey);
      return file?.thumbnail_url || null;
    } catch (error) {
      console.error('Failed to fetch Figma file thumbnail:', error);
      return null;
    }
  }

  /**
   * Export specific nodes as images for social media
   */
  async exportForSocialMedia(fileKey: string, nodeIds: string[], platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' = 'instagram'): Promise<FigmaImage[]> {
    const platformSpecs = {
      instagram: { format: 'jpg' as const, scale: 2 },
      facebook: { format: 'jpg' as const, scale: 2 },
      twitter: { format: 'png' as const, scale: 2 },
      linkedin: { format: 'jpg' as const, scale: 2 }
    };

    const spec = platformSpecs[platform];
    
    return await this.getFileImages(fileKey, nodeIds, {
      format: spec.format,
      scale: spec.scale,
      use_absolute_bounds: true
    });
  }

  /**
   * Check if Figma API is accessible
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/me');
      return true;
    } catch (error) {
      console.error('Figma connection test failed:', error);
      return false;
    }
  }
}

export const figmaService = FigmaService.getInstance();