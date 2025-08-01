import { toast } from 'sonner';
import React from 'react';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  API = 'api',
  NETWORK = 'network',
  VALIDATION = 'validation',
  PUBLISHING = 'publishing',
  SCHEDULING = 'scheduling',
  DATABASE = 'database',
  UNKNOWN = 'unknown'
}

export interface ErrorDetails {
  message: string;
  code?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  clientId?: string;
  platform?: string;
  stackTrace?: string;
}

export interface ErrorLogEntry extends ErrorDetails {
  id: string;
  resolved: boolean;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private errorQueue: ErrorDetails[] = [];
  private isProcessing = false;

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  private constructor() {
    this.setupGlobalErrorHandlers();
    this.startErrorProcessor();
  }

  private setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.HIGH,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        stackTrace: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.HIGH,
        context: {
          reason: event.reason,
          promise: event.promise
        },
        timestamp: new Date().toISOString()
      });
    });
  }

  private startErrorProcessor() {
    setInterval(() => {
      if (!this.isProcessing && this.errorQueue.length > 0) {
        this.processErrorQueue();
      }
    }, 5000);
  }

  private async processErrorQueue() {
    this.isProcessing = true;
    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.batchLogErrors(errors);
    } catch (error) {
      console.error('Failed to process error queue:', error);
      this.errorQueue.unshift(...errors);
    } finally {
      this.isProcessing = false;
    }
  }

  private async batchLogErrors(errors: ErrorDetails[]) {
    if (errors.length === 0) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const errorEntries = errors.map(error => ({
        ...error,
        id: crypto.randomUUID(),
        resolved: false
      }));

      const { error } = await supabase
        .from('error_logs')
        .insert(errorEntries);

      if (error) {
        console.error('Failed to log errors to database:', error);
        localStorage.setItem('pending_errors', JSON.stringify([
          ...JSON.parse(localStorage.getItem('pending_errors') || '[]'),
          ...errors
        ]));
      }
    } catch (error) {
      console.error('Error logging service failed:', error);
      localStorage.setItem('pending_errors', JSON.stringify([
        ...JSON.parse(localStorage.getItem('pending_errors') || '[]'),
        ...errors
      ]));
    }
  }

  logError(error: Partial<ErrorDetails> & { message: string; category: ErrorCategory; severity: ErrorSeverity }) {
    const fullError: ErrorDetails = {
      ...error,
      timestamp: error.timestamp || new Date().toISOString(),
      userId: this.getCurrentUserId(),
    };

    this.errorQueue.push(fullError);
    this.showUserNotification(fullError);
    
    if (fullError.severity === ErrorSeverity.CRITICAL) {
      this.handleCriticalError(fullError);
    }
  }

  private showUserNotification(error: ErrorDetails) {
    const shouldShow = this.shouldShowToUser(error);
    if (!shouldShow) return;

    const message = this.getUserFriendlyMessage(error);
    
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        toast.error(message, {
          duration: 10000,
          action: {
            label: 'Report',
            onClick: () => this.reportError(error)
          }
        });
        break;
      case ErrorSeverity.MEDIUM:
        toast.warning(message, { duration: 5000 });
        break;
      case ErrorSeverity.LOW:
        toast.info(message, { duration: 3000 });
        break;
    }
  }

  private shouldShowToUser(error: ErrorDetails): boolean {
    const silentCategories = [ErrorCategory.DATABASE, ErrorCategory.UNKNOWN];
    return !silentCategories.includes(error.category) || error.severity === ErrorSeverity.CRITICAL;
  }

  private getUserFriendlyMessage(error: ErrorDetails): string {
    const categoryMessages: Record<ErrorCategory, string> = {
      [ErrorCategory.AUTHENTICATION]: 'Authentication failed. Please log in again.',
      [ErrorCategory.API]: 'Service temporarily unavailable. Please try again.',
      [ErrorCategory.NETWORK]: 'Network connection issue. Check your internet connection.',
      [ErrorCategory.VALIDATION]: 'Please check your input and try again.',
      [ErrorCategory.PUBLISHING]: 'Failed to publish content. Please try again.',
      [ErrorCategory.SCHEDULING]: 'Failed to schedule post. Please try again.',
      [ErrorCategory.DATABASE]: 'Data operation failed. Please try again.',
      [ErrorCategory.UNKNOWN]: 'An unexpected error occurred. Please try again.'
    };

    return error.message.length < 100 ? error.message : categoryMessages[error.category];
  }

  private handleCriticalError(error: ErrorDetails) {
    console.error('CRITICAL ERROR:', error);
    
    if (typeof window !== 'undefined' && 'navigator' in window && 'sendBeacon' in navigator) {
      navigator.sendBeacon('/api/critical-error', JSON.stringify(error));
    }
  }

  private reportError(error: ErrorDetails) {
    const reportData = {
      ...error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    navigator.clipboard?.writeText(JSON.stringify(reportData, null, 2)).then(() => {
      toast.success('Error details copied to clipboard');
    });
  }

  private getCurrentUserId(): string | undefined {
    try {
      const user = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
      return user?.user?.id;
    } catch {
      return undefined;
    }
  }

  handleApiError(error: any, context?: Record<string, any>): ErrorDetails {
    let category = ErrorCategory.API;
    let severity = ErrorSeverity.MEDIUM;
    let message = 'API request failed';

    if (error?.response?.status) {
      const status = error.response.status;
      
      if (status === 401 || status === 403) {
        category = ErrorCategory.AUTHENTICATION;
        severity = ErrorSeverity.HIGH;
        message = 'Authentication required or access denied';
      } else if (status >= 500) {
        severity = ErrorSeverity.HIGH;
        message = 'Server error occurred';
      } else if (status >= 400) {
        category = ErrorCategory.VALIDATION;
        message = error.response?.data?.message || 'Invalid request';
      }
    } else if (error?.code === 'NETWORK_ERROR') {
      category = ErrorCategory.NETWORK;
      severity = ErrorSeverity.MEDIUM;
      message = 'Network connection failed';
    }

    const errorDetails: ErrorDetails = {
      message,
      code: error?.code || error?.response?.status?.toString(),
      category,
      severity,
      context: {
        ...context,
        originalError: error?.message,
        response: error?.response?.data,
        url: error?.config?.url,
        method: error?.config?.method
      },
      timestamp: new Date().toISOString()
    };

    this.logError(errorDetails);
    return errorDetails;
  }

  handlePublishingError(platform: string, accountId: string, error: any): ErrorDetails {
    let message = `Failed to publish to ${platform}`;
    let severity = ErrorSeverity.HIGH;

    if (error?.message?.includes('token')) {
      message = `${platform} authentication expired. Please reconnect your account.`;
      severity = ErrorSeverity.HIGH;
    } else if (error?.message?.includes('rate limit')) {
      message = `${platform} rate limit exceeded. Please try again later.`;
      severity = ErrorSeverity.MEDIUM;
    } else if (error?.message?.includes('media')) {
      message = `Media upload failed for ${platform}. Please check your media files.`;
      severity = ErrorSeverity.MEDIUM;
    }

    const errorDetails: ErrorDetails = {
      message,
      category: ErrorCategory.PUBLISHING,
      severity,
      platform,
      context: {
        accountId,
        originalError: error?.message,
        platform
      },
      timestamp: new Date().toISOString()
    };

    this.logError(errorDetails);
    return errorDetails;
  }

  handleSchedulingError(postId: string, error: any): ErrorDetails {
    const errorDetails: ErrorDetails = {
      message: `Failed to schedule post: ${error?.message || 'Unknown error'}`,
      category: ErrorCategory.SCHEDULING,
      severity: ErrorSeverity.MEDIUM,
      context: {
        postId,
        originalError: error?.message
      },
      timestamp: new Date().toISOString()
    };

    this.logError(errorDetails);
    return errorDetails;
  }

  handleDatabaseError(operation: string, error: any): ErrorDetails {
    const errorDetails: ErrorDetails = {
      message: `Database ${operation} failed: ${error?.message || 'Unknown error'}`,
      category: ErrorCategory.DATABASE,
      severity: ErrorSeverity.MEDIUM,
      context: {
        operation,
        originalError: error?.message,
        code: error?.code
      },
      timestamp: new Date().toISOString()
    };

    this.logError(errorDetails);
    return errorDetails;
  }

  createErrorBoundary(fallbackComponent: any) {
    const service = this;
    return class ErrorBoundary extends React.Component<any, any> {
      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, errorInfo: any) {
        service.logError({
          message: error.message,
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.HIGH,
          context: {
            componentStack: errorInfo.componentStack,
            errorBoundary: true
          },
          stackTrace: error.stack,
          timestamp: new Date().toISOString()
        });
      }

      render() {
        if (this.state.hasError && this.state.error) {
          return React.createElement(fallbackComponent, {
            error: this.state.error,
            resetError: () => this.setState({ hasError: false, error: undefined })
          });
        }
        return this.props.children;
      }
    };
  }

  async getErrorLogs(filters?: {
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    platform?: string;
    startDate?: string;
    endDate?: string;
    resolved?: boolean;
  }): Promise<ErrorLogEntry[]> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      let query = supabase
        .from('error_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.platform) {
        query = query.eq('platform', filters.platform);
      }
      if (filters?.resolved !== undefined) {
        query = query.eq('resolved', filters.resolved);
      }
      if (filters?.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      return (data as ErrorLogEntry[]) || [];
    } catch (error) {
      console.error('Failed to fetch error logs:', error);
      return [];
    }
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();