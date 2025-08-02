// =============================================
// PIXEL8 SOCIAL HUB - FILE UPLOAD REACT HOOK
// =============================================

import { useState, useCallback } from 'react';
import { fileUploadService, formatFileSize, getFileTypeCategory } from '../services/fileUploadService';

// =============================================
// TYPES
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

interface FileUploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  uploadedFiles: UploadResult[];
}

interface UseFileUploadReturn {
  // State
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  uploadedFiles: UploadResult[];
  availableServices: string[];
  
  // Actions
  uploadFile: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  uploadMultipleFiles: (files: File[], options?: UploadOptions) => Promise<UploadResult[]>;
  validateFile: (file: File) => { valid: boolean; error?: string };
  clearError: () => void;
  clearUploads: () => void;
  
  // Utilities
  formatFileSize: (bytes: number) => string;
  getFileCategory: (mimeType: string) => 'image' | 'video' | 'document' | 'other';
}

// =============================================
// HOOK IMPLEMENTATION
// =============================================

export function useFileUpload(): UseFileUploadReturn {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    uploadProgress: 0,
    uploadError: null,
    uploadedFiles: []
  });

  const [availableServices] = useState<string[]>(() => 
    fileUploadService.getAvailableServices()
  );

  // =============================================
  // UPLOAD SINGLE FILE
  // =============================================

  const uploadFile = useCallback(async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      uploadError: null
    }));

    try {
      // Validate file first
      const validation = fileUploadService.validateFile(file);
      if (!validation.valid) {
        const errorResult = {
          success: false,
          error: validation.error || 'File validation failed'
        };
        
        setState(prev => ({
          ...prev,
          isUploading: false,
          uploadError: errorResult.error!
        }));
        
        return errorResult;
      }

      // Simulate progress (since we don't have real progress tracking yet)
      setState(prev => ({ ...prev, uploadProgress: 25 }));

      // Upload the file
      const result = await fileUploadService.uploadFile(file, options);

      setState(prev => ({ ...prev, uploadProgress: 100 }));

      if (result.success) {
        setState(prev => ({
          ...prev,
          isUploading: false,
          uploadProgress: 0,
          uploadedFiles: [...prev.uploadedFiles, result]
        }));
      } else {
        setState(prev => ({
          ...prev,
          isUploading: false,
          uploadProgress: 0,
          uploadError: result.error || 'Upload failed'
        }));
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        uploadError: errorMessage
      }));

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  // =============================================
  // UPLOAD MULTIPLE FILES
  // =============================================

  const uploadMultipleFiles = useCallback(async (
    files: File[], 
    options: UploadOptions = {}
  ): Promise<UploadResult[]> => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      uploadError: null
    }));

    try {
      // Validate all files first
      const validationErrors: string[] = [];
      files.forEach((file, index) => {
        const validation = fileUploadService.validateFile(file);
        if (!validation.valid) {
          validationErrors.push(`File ${index + 1}: ${validation.error}`);
        }
      });

      if (validationErrors.length > 0) {
        const errorMessage = `Validation failed:\n${validationErrors.join('\n')}`;
        setState(prev => ({
          ...prev,
          isUploading: false,
          uploadError: errorMessage
        }));
        
        return files.map(() => ({
          success: false,
          error: 'File validation failed'
        }));
      }

      // Upload files with progress tracking
      const results: UploadResult[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = ((i + 1) / totalFiles) * 100;
        
        setState(prev => ({ ...prev, uploadProgress: progress }));
        
        const result = await fileUploadService.uploadFile(file, options);
        results.push(result);
      }

      // Update state with results
      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);

      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        uploadedFiles: [...prev.uploadedFiles, ...successfulUploads],
        uploadError: failedUploads.length > 0 
          ? `${failedUploads.length} file(s) failed to upload`
          : null
      }));

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Multiple upload failed';
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        uploadError: errorMessage
      }));

      return files.map(() => ({
        success: false,
        error: errorMessage
      }));
    }
  }, []);

  // =============================================
  // VALIDATE FILE
  // =============================================

  const validateFile = useCallback((file: File) => {
    return fileUploadService.validateFile(file);
  }, []);

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, uploadError: null }));
  }, []);

  const clearUploads = useCallback(() => {
    setState(prev => ({ ...prev, uploadedFiles: [] }));
  }, []);

  // =============================================
  // RETURN HOOK INTERFACE
  // =============================================

  return {
    // State
    isUploading: state.isUploading,
    uploadProgress: state.uploadProgress,
    uploadError: state.uploadError,
    uploadedFiles: state.uploadedFiles,
    availableServices,
    
    // Actions
    uploadFile,
    uploadMultipleFiles,
    validateFile,
    clearError,
    clearUploads,
    
    // Utilities
    formatFileSize,
    getFileCategory: getFileTypeCategory,
  };
}

// =============================================
// SPECIALIZED HOOKS
// =============================================

/**
 * Hook for image uploads specifically
 */
export function useImageUpload() {
  const fileUpload = useFileUpload();

  const uploadImage = useCallback(async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      };
    }

    return fileUpload.uploadFile(file, {
      ...options,
      folder: options.folder || 'images',
      public: options.public ?? true
    });
  }, [fileUpload]);

  const uploadImages = useCallback(async (
    files: File[], 
    options: UploadOptions = {}
  ): Promise<UploadResult[]> => {
    // Filter to only images
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      console.warn(`Filtered out ${files.length - imageFiles.length} non-image files`);
    }

    return fileUpload.uploadMultipleFiles(imageFiles, {
      ...options,
      folder: options.folder || 'images',
      public: options.public ?? true
    });
  }, [fileUpload]);

  return {
    ...fileUpload,
    uploadImage,
    uploadImages
  };
}

/**
 * Hook for video uploads specifically
 */
export function useVideoUpload() {
  const fileUpload = useFileUpload();

  const uploadVideo = useCallback(async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    // Validate it's a video
    if (!file.type.startsWith('video/')) {
      return {
        success: false,
        error: 'File must be a video'
      };
    }

    return fileUpload.uploadFile(file, {
      ...options,
      folder: options.folder || 'videos',
      public: options.public ?? true
    });
  }, [fileUpload]);

  return {
    ...fileUpload,
    uploadVideo
  };
}

/**
 * Hook for drag and drop file uploads
 */
export function useDragDropUpload() {
  const fileUpload = useFileUpload();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (
    e: React.DragEvent,
    options?: UploadOptions
  ) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return [];

    return fileUpload.uploadMultipleFiles(files, options);
  }, [fileUpload]);

  return {
    ...fileUpload,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}