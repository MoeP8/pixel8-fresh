import { errorHandlingService, ErrorCategory, ErrorSeverity } from '../ErrorHandlingService';

export interface DropboxFile {
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  size: number;
  is_downloadable: boolean;
  content_hash: string;
  client_modified: string;
  server_modified: string;
  rev: string;
  file_lock_id?: string;
}

export interface DropboxFolder {
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
}

export interface DropboxEntry {
  '.tag': 'file' | 'folder';
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  // File-specific properties
  size?: number;
  is_downloadable?: boolean;
  content_hash?: string;
  client_modified?: string;
  server_modified?: string;
  rev?: string;
}

export interface DropboxSearchResult {
  matches: Array<{
    metadata: DropboxEntry;
    match_type: {
      '.tag': string;
    };
  }>;
  has_more: boolean;
  cursor?: string;
}

export interface DropboxTemporaryLink {
  metadata: DropboxFile;
  link: string;
}

export interface DropboxUploadResponse {
  id: string;
  name: string;
  path_lower: string;
  path_display: string;
  size: number;
  content_hash: string;
  client_modified: string;
  server_modified: string;
  rev: string;
}

class DropboxService {
  private static instance: DropboxService;
  private readonly baseUrl = 'https://api.dropboxapi.com/2';
  private readonly contentUrl = 'https://content.dropboxapi.com/2';
  private readonly accessToken: string;

  constructor() {
    // Use environment variable for Dropbox access token
    this.accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN || '';
    
    if (!this.accessToken) {
      console.warn('Dropbox access token not found. Please set VITE_DROPBOX_ACCESS_TOKEN');
    }
  }

  static getInstance(): DropboxService {
    if (!DropboxService.instance) {
      DropboxService.instance = new DropboxService();
    }
    return DropboxService.instance;
  }

  private async makeRequest<T>(endpoint: string, data?: any, useContentApi: boolean = false): Promise<T> {
    try {
      const baseUrl = useContentApi ? this.contentUrl : this.baseUrl;
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Dropbox API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      await errorHandlingService.handleError(
        error instanceof Error ? error : new Error('Unknown Dropbox API error'),
        ErrorCategory.EXTERNAL_API,
        ErrorSeverity.MEDIUM,
        { endpoint, service: 'dropbox' }
      );
      throw error;
    }
  }

  /**
   * List folder contents
   */
  async listFolder(path: string = '', recursive: boolean = false, includeMediaInfo: boolean = true): Promise<DropboxEntry[]> {
    try {
      const response = await this.makeRequest<{ entries: DropboxEntry[], has_more: boolean, cursor?: string }>
        ('/files/list_folder', {
          path: path || '',
          recursive,
          include_media_info: includeMediaInfo,
          include_deleted: false,
          include_has_explicit_shared_members: false,
          include_mounted_folders: true,
          include_non_downloadable_files: true
        });

      let allEntries = response.entries;

      // Handle pagination
      while (response.has_more && response.cursor) {
        const nextResponse = await this.makeRequest<{ entries: DropboxEntry[], has_more: boolean, cursor?: string }>
          ('/files/list_folder/continue', {
            cursor: response.cursor
          });
        
        allEntries = allEntries.concat(nextResponse.entries);
        response.has_more = nextResponse.has_more;
        response.cursor = nextResponse.cursor;
      }

      return allEntries;
    } catch (error) {
      console.error('Failed to list Dropbox folder:', error);
      return [];
    }
  }

  /**
   * Get file/folder metadata
   */
  async getMetadata(path: string): Promise<DropboxEntry | null> {
    try {
      return await this.makeRequest<DropboxEntry>('/files/get_metadata', {
        path,
        include_media_info: true,
        include_deleted: false,
        include_has_explicit_shared_members: false
      });
    } catch (error) {
      console.error('Failed to get Dropbox metadata:', error);
      return null;
    }
  }

  /**
   * Search for files and folders
   */
  async search(query: string, path: string = '', maxResults: number = 100): Promise<DropboxEntry[]> {
    try {
      const response = await this.makeRequest<DropboxSearchResult>('/files/search_v2', {
        query,
        options: {
          path: path || '',
          max_results: maxResults,
          order_by: {
            '.tag': 'last_modified_time'
          },
          file_status: {
            '.tag': 'active'
          },
          filename_only: false
        }
      });

      return response.matches.map(match => match.metadata);
    } catch (error) {
      console.error('Failed to search Dropbox:', error);
      return [];
    }
  }

  /**
   * Get temporary download link for a file
   */
  async getTemporaryLink(path: string): Promise<string | null> {
    try {
      const response = await this.makeRequest<DropboxTemporaryLink>('/files/get_temporary_link', {
        path
      });

      return response.link;
    } catch (error) {
      console.error('Failed to get Dropbox temporary link:', error);
      return null;
    }
  }

  /**
   * Upload a file
   */
  async uploadFile(file: File, path: string, overwrite: boolean = false): Promise<DropboxUploadResponse | null> {
    try {
      const response = await fetch(`${this.contentUrl}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: path.startsWith('/') ? path : `/${path}`,
            mode: overwrite ? 'overwrite' : 'add',
            autorename: !overwrite,
            mute: false,
            strict_conflict: false
          })
        },
        body: file
      });

      if (!response.ok) {
        throw new Error(`Dropbox upload error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to upload file to Dropbox:', error);
      return null;
    }
  }

  /**
   * Download a file as blob
   */
  async downloadFile(path: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.contentUrl}/files/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({ path })
        }
      });

      if (!response.ok) {
        throw new Error(`Dropbox download error: ${response.status} ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Failed to download file from Dropbox:', error);
      return null;
    }
  }

  /**
   * Create a folder
   */
  async createFolder(path: string): Promise<DropboxFolder | null> {
    try {
      return await this.makeRequest<DropboxFolder>('/files/create_folder_v2', {
        path: path.startsWith('/') ? path : `/${path}`,
        autorename: false
      });
    } catch (error) {
      console.error('Failed to create Dropbox folder:', error);
      return null;
    }
  }

  /**
   * Delete a file or folder
   */
  async delete(path: string): Promise<boolean> {
    try {
      await this.makeRequest('/files/delete_v2', { path });
      return true;
    } catch (error) {
      console.error('Failed to delete from Dropbox:', error);
      return false;
    }
  }

  /**
   * Copy a file or folder
   */
  async copy(fromPath: string, toPath: string): Promise<DropboxEntry | null> {
    try {
      return await this.makeRequest<DropboxEntry>('/files/copy_v2', {
        from_path: fromPath,
        to_path: toPath,
        allow_shared_folder: false,
        autorename: false,
        allow_ownership_transfer: false
      });
    } catch (error) {
      console.error('Failed to copy in Dropbox:', error);
      return null;
    }
  }

  /**
   * Move a file or folder
   */
  async move(fromPath: string, toPath: string): Promise<DropboxEntry | null> {
    try {
      return await this.makeRequest<DropboxEntry>('/files/move_v2', {
        from_path: fromPath,
        to_path: toPath,
        allow_shared_folder: false,
        autorename: false,
        allow_ownership_transfer: false
      });
    } catch (error) {
      console.error('Failed to move in Dropbox:', error);
      return null;
    }
  }

  /**
   * Get account space usage
   */
  async getSpaceUsage(): Promise<{ used: number; allocated: number } | null> {
    try {
      const response = await this.makeRequest<{ used: number; allocation: { allocated: number } }>
        ('/users/get_space_usage');

      return {
        used: response.used,
        allocated: response.allocation.allocated
      };
    } catch (error) {
      console.error('Failed to get Dropbox space usage:', error);
      return null;
    }
  }

  /**
   * Get recent files (for quick access)
   */
  async getRecentFiles(limit: number = 20): Promise<DropboxEntry[]> {
    try {
      // Search for all files, then sort by modification date
      const allFiles = await this.search('', '', 1000);
      
      return allFiles
        .filter(entry => entry['.tag'] === 'file')
        .sort((a, b) => {
          const dateA = new Date(a.server_modified || a.client_modified || 0);
          const dateB = new Date(b.server_modified || b.client_modified || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get recent Dropbox files:', error);
      return [];
    }
  }

  /**
   * Get files by type (images, videos, documents)
   */
  async getFilesByType(type: 'images' | 'videos' | 'documents' | 'all' = 'all', path: string = ''): Promise<DropboxEntry[]> {
    try {
      const allEntries = await this.listFolder(path, true);
      const files = allEntries.filter(entry => entry['.tag'] === 'file');

      if (type === 'all') return files;

      const typeExtensions = {
        images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff'],
        videos: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'],
        documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.pages']
      };

      const extensions = typeExtensions[type];
      
      return files.filter(file => {
        const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        return extensions.includes(extension);
      });
    } catch (error) {
      console.error('Failed to get Dropbox files by type:', error);
      return [];
    }
  }

  /**
   * Test connection to Dropbox
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/users/get_current_account');
      return true;
    } catch (error) {
      console.error('Dropbox connection test failed:', error);
      return false;
    }
  }

  /**
   * Get file preview URL for supported file types
   */
  async getPreviewUrl(path: string): Promise<string | null> {
    try {
      // For images, we can use the temporary link as preview
      const metadata = await this.getMetadata(path);
      if (!metadata || metadata['.tag'] !== 'file') return null;

      const extension = metadata.name.toLowerCase().substring(metadata.name.lastIndexOf('.'));
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      
      if (imageExtensions.includes(extension)) {
        return await this.getTemporaryLink(path);
      }

      return null;
    } catch (error) {
      console.error('Failed to get Dropbox preview URL:', error);
      return null;
    }
  }
}

export const dropboxService = DropboxService.getInstance();