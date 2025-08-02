import { errorHandlingService, ErrorCategory, ErrorSeverity } from './ErrorHandlingService';

export interface RateLimitRule {
  endpoint: string;
  method: string;
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface SecurityConfig {
  enableCSP: boolean;
  enableCORS: boolean;
  allowedOrigins: string[];
  enableRateLimit: boolean;
  rateLimitRules: RateLimitRule[];
  enableRequestLogging: boolean;
  enableIPBlocking: boolean;
  blockedIPs: string[];
  trustedProxies: string[];
}

interface RequestLog {
  ip: string;
  endpoint: string;
  method: string;
  timestamp: number;
  userAgent?: string;
  status?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class SecurityService {
  private static instance: SecurityService;
  private requestLogs: Map<string, RequestLog[]> = new Map();
  private rateLimitCache: Map<string, RateLimitEntry> = new Map();
  private blockedIPs: Set<string> = new Set();
  private config: SecurityConfig;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private constructor() {
    this.config = this.getDefaultConfig();
    this.loadConfiguration();
    this.startCleanupJob();
  }

  private getDefaultConfig(): SecurityConfig {
    return {
      enableCSP: true,
      enableCORS: true,
      allowedOrigins: [
        import.meta.env.VITE_APP_URL || 'http://localhost:5173',
        'https://your-domain.com',
        'https://www.your-domain.com'
      ],
      enableRateLimit: true,
      rateLimitRules: [
        {
          endpoint: '/api/auth/*',
          method: 'POST',
          windowMs: 15 * 60 * 1000, // 15 minutes
          maxRequests: 5
        },
        {
          endpoint: '/api/social/publish',
          method: 'POST',
          windowMs: 60 * 1000, // 1 minute
          maxRequests: 10
        },
        {
          endpoint: '/api/*',
          method: '*',
          windowMs: 15 * 60 * 1000, // 15 minutes
          maxRequests: 100
        }
      ],
      enableRequestLogging: true,
      enableIPBlocking: true,
      blockedIPs: [],
      trustedProxies: ['127.0.0.1', '::1']
    };
  }

  private loadConfiguration() {
    try {
      const storedConfig = localStorage.getItem('security_config');
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        this.config = { ...this.config, ...parsedConfig };
      }

      // Load blocked IPs from environment
      const envBlockedIPs = import.meta.env.VITE_BLOCKED_IPS;
      if (envBlockedIPs) {
        const ips = envBlockedIPs.split(',').map((ip: string) => ip.trim());
        this.config.blockedIPs.push(...ips);
      }

      // Load allowed origins from environment
      const envAllowedOrigins = import.meta.env.VITE_ALLOWED_ORIGINS;
      if (envAllowedOrigins) {
        const origins = envAllowedOrigins.split(',').map((origin: string) => origin.trim());
        this.config.allowedOrigins = origins;
      }

      this.blockedIPs = new Set(this.config.blockedIPs);
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to load security configuration: ${error.message}`,
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        timestamp: new Date().toISOString()
      });
    }
  }

  private startCleanupJob() {
    // Clean up old rate limit entries and request logs every 5 minutes
    setInterval(() => {
      this.cleanupRateLimitCache();
      this.cleanupRequestLogs();
    }, 5 * 60 * 1000);
  }

  private cleanupRateLimitCache() {
    const now = Date.now();
    for (const [key, entry] of this.rateLimitCache.entries()) {
      if (now >= entry.resetTime) {
        this.rateLimitCache.delete(key);
      }
    }
  }

  private cleanupRequestLogs() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [ip, logs] of this.requestLogs.entries()) {
      const filteredLogs = logs.filter(log => log.timestamp > oneHourAgo);
      if (filteredLogs.length === 0) {
        this.requestLogs.delete(ip);
      } else {
        this.requestLogs.set(ip, filteredLogs);
      }
    }
  }

  private getClientIP(request: Request): string {
    // Check for forwarded IP headers
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
      return realIP;
    }

    const remoteAddr = request.headers.get('remote-addr');
    if (remoteAddr) {
      return remoteAddr;
    }

    return 'unknown';
  }

  private getRateLimitKey(ip: string, endpoint: string, method: string): string {
    return `${ip}:${method}:${endpoint}`;
  }

  private matchesEndpoint(requestPath: string, ruleEndpoint: string): boolean {
    if (ruleEndpoint.includes('*')) {
      const pattern = ruleEndpoint.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(requestPath);
    }
    return requestPath === ruleEndpoint;
  }

  validateRequest(request: Request): { allowed: boolean; reason?: string; retryAfter?: number } {
    const ip = this.getClientIP(request);
    const url = new URL(request.url);
    const endpoint = url.pathname;
    const method = request.method.toUpperCase();

    // Check if IP is blocked
    if (this.config.enableIPBlocking && this.blockedIPs.has(ip)) {
      errorHandlingService.logError({
        message: `Blocked IP attempted access: ${ip}`,
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH,
        context: { ip, endpoint, method },
        timestamp: new Date().toISOString()
      });
      return { allowed: false, reason: 'IP blocked' };
    }

    // Check rate limits
    if (this.config.enableRateLimit) {
      const rateLimitResult = this.checkRateLimit(ip, endpoint, method);
      if (!rateLimitResult.allowed) {
        return rateLimitResult;
      }
    }

    // Log request if enabled
    if (this.config.enableRequestLogging) {
      this.logRequest(ip, endpoint, method, request.headers.get('user-agent') || undefined);
    }

    return { allowed: true };
  }

  private checkRateLimit(ip: string, endpoint: string, method: string): { allowed: boolean; reason?: string; retryAfter?: number } {
    const applicableRules = this.config.rateLimitRules.filter(rule => 
      (rule.method === '*' || rule.method === method) &&
      this.matchesEndpoint(endpoint, rule.endpoint)
    );

    for (const rule of applicableRules) {
      const key = this.getRateLimitKey(ip, rule.endpoint, rule.method);
      const now = Date.now();
      
      let entry = this.rateLimitCache.get(key);
      
      if (!entry || now >= entry.resetTime) {
        // Create new entry or reset expired one
        entry = {
          count: 1,
          resetTime: now + rule.windowMs
        };
        this.rateLimitCache.set(key, entry);
        continue;
      }

      if (entry.count >= rule.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        
        errorHandlingService.logError({
          message: `Rate limit exceeded for IP ${ip} on endpoint ${endpoint}`,
          category: ErrorCategory.API,
          severity: ErrorSeverity.MEDIUM,
          context: { 
            ip, 
            endpoint, 
            method, 
            count: entry.count, 
            limit: rule.maxRequests,
            windowMs: rule.windowMs
          },
          timestamp: new Date().toISOString()
        });

        return { 
          allowed: false, 
          reason: 'Rate limit exceeded',
          retryAfter 
        };
      }

      // Increment counter
      entry.count++;
      this.rateLimitCache.set(key, entry);
    }

    return { allowed: true };
  }

  private logRequest(ip: string, endpoint: string, method: string, userAgent?: string) {
    const logs = this.requestLogs.get(ip) || [];
    logs.push({
      ip,
      endpoint,
      method,
      timestamp: Date.now(),
      userAgent
    });
    
    // Keep only last 100 requests per IP
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    this.requestLogs.set(ip, logs);
  }

  detectSuspiciousActivity(ip: string): { suspicious: boolean; reasons: string[] } {
    const logs = this.requestLogs.get(ip) || [];
    const reasons: string[] = [];
    const recentLogs = logs.filter(log => Date.now() - log.timestamp < 5 * 60 * 1000); // Last 5 minutes

    // Too many requests in short time
    if (recentLogs.length > 50) {
      reasons.push('High request frequency');
    }

    // Too many different endpoints accessed
    const uniqueEndpoints = new Set(recentLogs.map(log => log.endpoint));
    if (uniqueEndpoints.size > 20) {
      reasons.push('Accessing too many different endpoints');
    }

    // Suspicious patterns
    const authAttempts = recentLogs.filter(log => 
      log.endpoint.includes('auth') || 
      log.endpoint.includes('login') || 
      log.endpoint.includes('register')
    );
    if (authAttempts.length > 10) {
      reasons.push('Multiple authentication attempts');
    }

    // Missing or suspicious user agent
    const noUserAgentRequests = recentLogs.filter(log => !log.userAgent);
    if (noUserAgentRequests.length > recentLogs.length * 0.8) {
      reasons.push('Missing user agent headers');
    }

    return {
      suspicious: reasons.length > 0,
      reasons
    };
  }

  blockIP(ip: string, reason: string) {
    this.blockedIPs.add(ip);
    this.config.blockedIPs.push(ip);
    
    errorHandlingService.logError({
      message: `IP blocked: ${ip}`,
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      context: { ip, reason },
      timestamp: new Date().toISOString()
    });

    // Persist to storage
    this.saveConfiguration();
  }

  unblockIP(ip: string) {
    this.blockedIPs.delete(ip);
    this.config.blockedIPs = this.config.blockedIPs.filter(blocked => blocked !== ip);
    this.saveConfiguration();
  }

  generateCSPHeader(): string {
    if (!this.config.enableCSP) return '';

    const policies = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' blob:",
      "connect-src 'self' https://api.supabase.co https://*.supabase.co wss://*.supabase.co https://graph.facebook.com https://api.twitter.com https://api.linkedin.com https://www.notion.so",
      "frame-src 'self' https://www.facebook.com https://twitter.com https://www.linkedin.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];

    return policies.join('; ');
  }

  generateCORSHeaders(origin?: string): HeadersInit {
    if (!this.config.enableCORS) return {};

    const isAllowedOrigin = !origin || this.config.allowedOrigins.includes(origin) || this.config.allowedOrigins.includes('*');

    return {
      'Access-Control-Allow-Origin': isAllowedOrigin ? (origin || '*') : 'null',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    };
  }

  getSecurityHeaders(): HeadersInit {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': this.generateCSPHeader(),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    };
  }

  private saveConfiguration() {
    try {
      localStorage.setItem('security_config', JSON.stringify(this.config));
    } catch (error: any) {
      errorHandlingService.logError({
        message: `Failed to save security configuration: ${error.message}`,
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.LOW,
        timestamp: new Date().toISOString()
      });
    }
  }

  getSecurityMetrics() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    let totalRequests = 0;
    let blockedRequests = 0;
    let suspiciousIPs = 0;
    const topEndpoints: Map<string, number> = new Map();

    for (const [ip, logs] of this.requestLogs.entries()) {
      const recentLogs = logs.filter(log => log.timestamp > oneHourAgo);
      totalRequests += recentLogs.length;

      // Count blocked requests (approximation based on rate limits)
      const suspiciousActivity = this.detectSuspiciousActivity(ip);
      if (suspiciousActivity.suspicious) {
        suspiciousIPs++;
      }

      // Count endpoint usage
      for (const log of recentLogs) {
        const count = topEndpoints.get(log.endpoint) || 0;
        topEndpoints.set(log.endpoint, count + 1);
      }
    }

    return {
      totalRequests,
      blockedRequests,
      suspiciousIPs,
      blockedIPs: this.blockedIPs.size,
      topEndpoints: Array.from(topEndpoints.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      rateLimitCacheSize: this.rateLimitCache.size
    };
  }

  updateConfiguration(newConfig: Partial<SecurityConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.blockedIPs = new Set(this.config.blockedIPs);
    this.saveConfiguration();
  }

  getConfiguration(): SecurityConfig {
    return { ...this.config };
  }
}

export const securityService = SecurityService.getInstance();