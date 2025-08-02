// =============================================
// PIXEL8 SOCIAL HUB - FILE UPLOAD SERVICE
// =============================================

import { supabase } from '../lib/supabase';

// =============================================
// TYPES & INTERFACES
// =============================================

interface UploadOptions {
  folder?: string;
  public?: boolean;
  cacheControl?: string;
  upsert?: boolean;
}

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  size?: number;
  type?: string;
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface DropboxConfig {
  accessToken: string;
}

// =============================================
// FILE UPLOAD SERVICE CLASS
// =============================================

export class FileUploadService {
  private cloudinaryConfig: CloudinaryConfig | null = null;
  private dropboxConfig: DropboxConfig | null = null;

  constructor() {
    this.loadConfigurations();
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfigurations() {
    // Cloudinary configuration
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && 
        !cloudName.includes('your_') && !apiKey.includes('your_') && !apiSecret.includes('your_')) {
      this.cloudinaryConfig = { cloudName, apiKey, apiSecret };
    }

    // Dropbox configuration
    const dropboxToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
    if (dropboxToken && !dropboxToken.includes('your_') && !dropboxToken.includes('token_here')) {
      this.dropboxConfig = { accessToken: dropboxToken };
    }
  }

  /**
   * Check if service is configured
   */
  isServiceReady(service: 'supabase' | 'cloudinary' | 'dropbox'): boolean {
    switch (service) {
      case 'supabase':
        return !!supabase;
      case 'cloudinary':
        return !!this.cloudinaryConfig;
      case 'dropbox':
        return !!this.dropboxConfig;
      default:
        return false;
    }
  }

  /**
   * Get available upload services
   */
  getAvailableServices(): string[] {
    const services: string[] = [];
    
    if (this.isServiceReady('supabase')) services.push('supabase');
    if (this.isServiceReady('cloudinary')) services.push('cloudinary');
    if (this.isServiceReady('dropbox')) services.push('dropbox');
    
    return services;
  }

  /**
   * Upload file to the best available service
   */
  async uploadFile(
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const availableServices = this.getAvailableServices();
    
    if (availableServices.length === 0) {
      return {
        success: false,
        error: 'No upload services configured. Please add API credentials to .env.local'
      };
    }

    // Try services in order of preference: Cloudinary -> Supabase -> Dropbox
    const serviceOrder = ['cloudinary', 'supabase', 'dropbox'];
    
    for (const service of serviceOrder) {
      if (availableServices.includes(service)) {
        try {
          const result = await this.uploadToService(file, service as any, options);
          if (result.success) {
            return result;
          }
        } catch (error) {
          console.warn(`Upload to ${service} failed:`, error);
          continue;
        }
      }
    }

    return {
      success: false,
      error: 'Upload failed for all available services'
    };
  }

  /**
   * Upload to specific service
   */
  async uploadToService(
    file: File,
    service: 'supabase' | 'cloudinary' | 'dropbox',
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    switch (service) {
      case 'supabase':
        return this.uploadToSupabase(file, options);
      case 'cloudinary':
        return this.uploadToCloudinary(file, options);
      case 'dropbox':
        return this.uploadToDropbox(file, options);
      default:
        return {
          success: false,
          error: `Unsupported service: ${service}`
        };
    }
  }

  /**
   * Upload to Supabase Storage
   */
  private async uploadToSupabase(
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const bucket = options.public ? 'post-media' : 'private-media';
      const folder = options.folder || 'uploads';
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}-${file.name}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: options.cacheControl || '3600',
          upsert: options.upsert || false
        });

      if (error) {
        return {
          success: false,
          error: `Supabase upload failed: ${error.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      return {
        success: false,
        error: `Supabase upload error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Upload to Cloudinary
   */
  private async uploadToCloudinary(
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    if (!this.cloudinaryConfig) {
      return {
        success: false,
        error: 'Cloudinary not configured'
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_preset'); // You'll need to create this in Cloudinary
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: `Cloudinary upload failed: ${data.error?.message || 'Unknown error'}`
        };
      }

      return {
        success: true,
        url: data.secure_url,
        path: data.public_id,
        size: data.bytes,
        type: file.type
      };
    } catch (error) {
      return {
        success: false,
        error: `Cloudinary upload error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Upload to Dropbox
   */
  private async uploadToDropbox(
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    if (!this.dropboxConfig) {
      return {
        success: false,
        error: 'Dropbox not configured'
      };
    }

    try {
      const folder = options.folder || '/pixel8-uploads';
      const timestamp = Date.now();
      const path = `${folder}/${timestamp}-${file.name}`;

      const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.dropboxConfig.accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path,
            mode: 'add',
            autorename: true
          })
        },
        body: file
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: `Dropbox upload failed: ${data.error_summary || 'Unknown error'}`
        };
      }

      // Create a shared link
      const shareResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.dropboxConfig.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: data.path_lower,
          settings: {
            requested_visibility: 'public'
          }
        })
      });

      const shareData = await shareResponse.json();
      
      // Convert Dropbox share URL to direct URL
      const directUrl = shareData.url ? shareData.url.replace('?dl=0', '?raw=1') : null;

      return {
        success: true,
        url: directUrl || `https://dropbox.com/preview${data.path_lower}`,
        path: data.path_lower,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      return {
        success: false,
        error: `Dropbox upload error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    // Upload files concurrently, but limit to 3 at a time to avoid overwhelming APIs
    const batchSize = 3;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map(file => this.uploadFile(file, options));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 50MB limit'
      };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
      'text/plain',
      'application/json'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} not supported`
      };
    }

    return { valid: true };
  }

  /**
   * Get upload progress (for future implementation with chunked uploads)
   */
  onUploadProgress(callback: (progress: number) => void) {
    // Placeholder for upload progress tracking
    // This would be implemented with chunked uploads or XMLHttpRequest
    console.log('Upload progress tracking would be implemented here');
  }

  /**
   * Delete file from service
   */
  async deleteFile(path: string, service: 'supabase' | 'cloudinary' | 'dropbox'): Promise<boolean> {
    try {
      switch (service) {
        case 'supabase':
          const { error } = await supabase.storage.from('post-media').remove([path]);
          return !error;
        
        case 'cloudinary':
          if (!this.cloudinaryConfig) return false;
          // Cloudinary deletion would require server-side implementation due to API signature requirements
          console.warn('Cloudinary deletion requires server-side implementation');
          return false;
        
        case 'dropbox':
          if (!this.dropboxConfig) return false;
          const response = await fetch('https://api.dropboxapi.com/2/files/delete_v2', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.dropboxConfig.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path })
          });
          return response.ok;
        
        default:
          return false;
      }
    } catch (error) {
      console.error(`Failed to delete file from ${service}:`, error);
      return false;
    }
  }
}

// =============================================
// SINGLETON INSTANCE
// =============================================

export const fileUploadService = new FileUploadService();

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file type category
 */
export function getFileTypeCategory(mimeType: string): 'image' | 'video' | 'document' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.includes('pdf') || mimeType.includes('text') || mimeType.includes('json')) return 'document';
  return 'other';
}

/**
 * Generate thumbnail for images
 */
export function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxSize = 200;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}