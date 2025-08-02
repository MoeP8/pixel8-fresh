// =============================================
// PIXEL8 SOCIAL HUB - SOCIAL MEDIA REACT HOOK
// =============================================

import { useState, useEffect, useCallback } from 'react';
import { socialMediaAPI, getPlatformStatus, getReadyPlatforms } from '../services/socialMediaAPI';
import type { SocialAccount, Post } from '../types/database.types';

// =============================================
// TYPES
// =============================================

interface PublishRequest {
  content: string;
  mediaUrls?: string[];
  scheduledTime?: Date;
  platforms: string[];
}

interface PublishResponse {
  success: boolean;
  platformPostId?: string;
  error?: string;
  platform: string;
}

interface PlatformStatus {
  ready: boolean;
  config: any;
}

interface UseSocialMediaReturn {
  // Status
  platformStatus: Record<string, PlatformStatus>;
  readyPlatforms: string[];
  isLoading: boolean;
  
  // Actions
  publishContent: (request: PublishRequest) => Promise<PublishResponse[]>;
  validateContent: (platform: string, content: string) => { valid: boolean; error?: string };
  syncAccounts: (organizationId: string) => Promise<void>;
  getAccountInfo: (platform: string) => Promise<any>;
  
  // State
  lastPublishResults: PublishResponse[] | null;
  publishError: string | null;
}

// =============================================
// HOOK IMPLEMENTATION
// =============================================

export function useSocialMedia(): UseSocialMediaReturn {
  const [platformStatus, setPlatformStatus] = useState<Record<string, PlatformStatus>>({});
  const [readyPlatforms, setReadyPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPublishResults, setLastPublishResults] = useState<PublishResponse[] | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  // =============================================
  // INITIALIZATION
  // =============================================

  useEffect(() => {
    const status = getPlatformStatus();
    const ready = getReadyPlatforms();
    
    setPlatformStatus(status);
    setReadyPlatforms(ready);
  }, []);

  // =============================================
  // PUBLISH CONTENT
  // =============================================

  const publishContent = useCallback(async (request: PublishRequest): Promise<PublishResponse[]> => {
    setIsLoading(true);
    setPublishError(null);
    setLastPublishResults(null);

    try {
      // Validate that we have platforms to publish to
      if (!request.platforms || request.platforms.length === 0) {
        throw new Error('No platforms selected for publishing');
      }

      // Validate that selected platforms are ready
      const unavailablePlatforms = request.platforms.filter(
        platform => !readyPlatforms.includes(platform)
      );

      if (unavailablePlatforms.length > 0) {
        throw new Error(
          `Platforms not configured: ${unavailablePlatforms.join(', ')}. ` +
          `Please add API credentials to .env.local`
        );
      }

      // Validate content for each platform
      const validationErrors: string[] = [];
      request.platforms.forEach(platform => {
        const validation = socialMediaAPI.validateContent(platform, request.content);
        if (!validation.valid && validation.error) {
          validationErrors.push(`${platform}: ${validation.error}`);
        }
      });

      if (validationErrors.length > 0) {
        throw new Error(`Content validation failed:\n${validationErrors.join('\n')}`);
      }

      // Publish to all platforms
      const results = await socialMediaAPI.publishToMultiplePlatforms(request);
      
      setLastPublishResults(results);

      // Check if any publications failed
      const failures = results.filter(r => !r.success);
      if (failures.length > 0) {
        const errorMessage = failures
          .map(f => `${f.platform}: ${f.error}`)
          .join('\n');
        setPublishError(`Some publications failed:\n${errorMessage}`);
      }

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Publishing failed';
      setPublishError(errorMessage);
      
      // Return error results for all platforms
      const errorResults = request.platforms.map(platform => ({
        success: false,
        error: errorMessage,
        platform,
      }));
      
      setLastPublishResults(errorResults);
      return errorResults;
    } finally {
      setIsLoading(false);
    }
  }, [readyPlatforms]);

  // =============================================
  // VALIDATE CONTENT
  // =============================================

  const validateContent = useCallback((platform: string, content: string) => {
    return socialMediaAPI.validateContent(platform, content);
  }, []);

  // =============================================
  // SYNC ACCOUNTS
  // =============================================

  const syncAccounts = useCallback(async (organizationId: string) => {
    setIsLoading(true);
    setPublishError(null);

    try {
      await socialMediaAPI.syncSocialAccounts(organizationId);
      
      // Refresh platform status after sync
      const status = getPlatformStatus();
      const ready = getReadyPlatforms();
      
      setPlatformStatus(status);
      setReadyPlatforms(ready);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Account sync failed';
      setPublishError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =============================================
  // GET ACCOUNT INFO
  // =============================================

  const getAccountInfo = useCallback(async (platform: string) => {
    setIsLoading(true);
    setPublishError(null);

    try {
      const accountInfo = await socialMediaAPI.getAccountInfo(platform);
      return accountInfo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get account info';
      setPublishError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =============================================
  // RETURN HOOK INTERFACE
  // =============================================

  return {
    // Status
    platformStatus,
    readyPlatforms,
    isLoading,
    
    // Actions
    publishContent,
    validateContent,
    syncAccounts,
    getAccountInfo,
    
    // State
    lastPublishResults,
    publishError,
  };
}

// =============================================
// PLATFORM-SPECIFIC HOOKS
// =============================================

/**
 * Hook for managing a specific platform
 */
export function usePlatform(platform: string) {
  const {
    platformStatus,
    isLoading,
    validateContent,
    getAccountInfo,
    publishError,
  } = useSocialMedia();

  const isReady = platformStatus[platform]?.ready || false;
  const config = platformStatus[platform]?.config || null;

  const validateContentForPlatform = useCallback((content: string) => {
    return validateContent(platform, content);
  }, [platform, validateContent]);

  const getAccountInfoForPlatform = useCallback(() => {
    return getAccountInfo(platform);
  }, [platform, getAccountInfo]);

  return {
    isReady,
    config,
    isLoading,
    publishError,
    validateContent: validateContentForPlatform,
    getAccountInfo: getAccountInfoForPlatform,
  };
}

// =============================================
// UTILITY HOOKS
// =============================================

/**
 * Hook for content validation across multiple platforms
 */
export function useContentValidation() {
  const { validateContent, platformStatus } = useSocialMedia();

  const validateForPlatforms = useCallback((content: string, platforms: string[]) => {
    const results: Record<string, { valid: boolean; error?: string; maxChars?: number }> = {};
    
    platforms.forEach(platform => {
      const validation = validateContent(platform, content);
      const config = platformStatus[platform]?.config;
      
      results[platform] = {
        ...validation,
        maxChars: config?.maxCharacters,
      };
    });
    
    return results;
  }, [validateContent, platformStatus]);

  const getCharacterLimits = useCallback((platforms: string[]) => {
    const limits: Record<string, number> = {};
    
    platforms.forEach(platform => {
      const config = platformStatus[platform]?.config;
      if (config) {
        limits[platform] = config.maxCharacters;
      }
    });
    
    return limits;
  }, [platformStatus]);

  const getMinCharacterLimit = useCallback((platforms: string[]) => {
    const limits = getCharacterLimits(platforms);
    const values = Object.values(limits);
    return values.length > 0 ? Math.min(...values) : Infinity;
  }, [getCharacterLimits]);

  return {
    validateForPlatforms,
    getCharacterLimits,
    getMinCharacterLimit,
  };
}

/**
 * Hook for monitoring publish status
 */
export function usePublishStatus() {
  const { lastPublishResults, publishError, isLoading } = useSocialMedia();

  const getSuccessfulPublications = useCallback(() => {
    return lastPublishResults?.filter(r => r.success) || [];
  }, [lastPublishResults]);

  const getFailedPublications = useCallback(() => {
    return lastPublishResults?.filter(r => !r.success) || [];
  }, [lastPublishResults]);

  const getPublishSummary = useCallback(() => {
    if (!lastPublishResults) {
      return null;
    }

    const successful = getSuccessfulPublications();
    const failed = getFailedPublications();

    return {
      total: lastPublishResults.length,
      successful: successful.length,
      failed: failed.length,
      successRate: lastPublishResults.length > 0 
        ? (successful.length / lastPublishResults.length) * 100 
        : 0,
      results: lastPublishResults,
    };
  }, [lastPublishResults, getSuccessfulPublications, getFailedPublications]);

  return {
    lastPublishResults,
    publishError,
    isLoading,
    getSuccessfulPublications,
    getFailedPublications,
    getPublishSummary,
  };
}