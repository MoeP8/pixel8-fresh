#!/usr/bin/env node

/**
 * 🔍 Pixel8 Social Hub - Dependency Diagnostic Script
 * 
 * Comprehensive health check for all third-party service dependencies
 * Run with: node scripts/dependency-diagnostics.js
 */

import https from 'https';
import http from 'http';
import { performance } from 'perf_hooks';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const STATUS = {
  HEALTHY: `${colors.green}✅ HEALTHY${colors.reset}`,
  WARNING: `${colors.yellow}⚠️  WARNING${colors.reset}`,
  ERROR: `${colors.red}❌ ERROR${colors.reset}`,
  UNKNOWN: `${colors.magenta}❓ UNKNOWN${colors.reset}`
};

class DependencyDiagnostics {
  constructor() {
    this.results = [];
    this.startTime = performance.now();
  }

  async checkEndpoint(name, url, options = {}) {
    const startTime = performance.now();
    
    try {
      const result = await this.makeRequest(url, options);
      const responseTime = Math.round(performance.now() - startTime);
      
      const status = this.interpretResponse(result.statusCode, options.expectedStatus);
      
      this.results.push({
        name,
        url: url.replace(/\/+$/, ''), // Remove trailing slashes
        status,
        statusCode: result.statusCode,
        responseTime: `${responseTime}ms`,
        details: result.details,
        category: options.category || 'Unknown'
      });

      return { success: status === STATUS.HEALTHY, statusCode: result.statusCode };
    } catch (error) {
      this.results.push({
        name,
        url,
        status: STATUS.ERROR,
        statusCode: 'N/A',
        responseTime: 'N/A',
        details: error.message,
        category: options.category || 'Unknown'
      });
      return { success: false, error: error.message };
    }
  }

  makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const requestModule = urlObj.protocol === 'https:' ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'HEAD',
        timeout: options.timeout || 10000,
        headers: {
          'User-Agent': 'Pixel8-Diagnostics/1.0',
          ...options.headers
        }
      };

      const req = requestModule.request(requestOptions, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          if (options.method === 'GET') {
            body += chunk;
          }
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body.slice(0, 200), // First 200 chars
            details: this.extractDetails(res.headers, body)
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(options.timeout || 10000);
      req.end();
    });
  }

  interpretResponse(statusCode, expectedStatus = [200, 401, 404]) {
    if (Array.isArray(expectedStatus) ? expectedStatus.includes(statusCode) : statusCode === expectedStatus) {
      return STATUS.HEALTHY;
    }
    if (statusCode >= 500) {
      return STATUS.ERROR;
    }
    if (statusCode >= 400) {
      return STATUS.WARNING;
    }
    return STATUS.UNKNOWN;
  }

  extractDetails(headers, body) {
    const details = [];
    
    if (headers['x-ratelimit-remaining']) {
      details.push(`Rate limit: ${headers['x-ratelimit-remaining']} remaining`);
    }
    
    if (headers['server']) {
      details.push(`Server: ${headers['server']}`);
    }
    
    if (body && body.includes('error')) {
      try {
        const error = JSON.parse(body);
        if (error.error) {
          details.push(`Error: ${error.error}`);
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
    
    return details.join(', ') || 'Service responding';
  }

  async runAllChecks() {
    console.log(`${colors.cyan}🔍 Pixel8 Social Hub - Dependency Diagnostics${colors.reset}`);
    console.log(`${colors.cyan}================================================${colors.reset}\n`);

    // 1. Core Backend Services
    console.log(`${colors.bright}📊 Core Backend Services${colors.reset}`);
    await this.checkSupabaseServices();
    
    // 2. Social Media APIs
    console.log(`\n${colors.bright}📱 Social Media APIs${colors.reset}`);
    await this.checkSocialMediaAPIs();
    
    // 3. Integration Services
    console.log(`\n${colors.bright}🔗 Integration Services${colors.reset}`);
    await this.checkIntegrationServices();
    
    // 4. External Resources
    console.log(`\n${colors.bright}🌐 External Resources${colors.reset}`);
    await this.checkExternalResources();

    // 5. Generate Report
    console.log(`\n${colors.bright}📋 Diagnostic Report${colors.reset}`);
    this.generateReport();
  }

  async checkSupabaseServices() {
    const supabaseUrl = 'https://wxbrfmjxrfhntjkdlcbz.supabase.co';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4YnJmbWp4cmZobnRqa2RsY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NzAzNTksImV4cCI6MjA2OTE0NjM1OX0.ie9jOgpXRcxS35K1JGkXxY88ymhtQWWIdEWJRzl6l-0';

    await this.checkEndpoint(
      'Supabase REST API',
      `${supabaseUrl}/rest/v1/`,
      {
        category: 'Backend',
        headers: {
          'apikey': apiKey,
          'authorization': `Bearer ${apiKey}`
        },
        expectedStatus: [200]
      }
    );

    await this.checkEndpoint(
      'Supabase Auth',
      `${supabaseUrl}/auth/v1/`,
      {
        category: 'Backend',
        headers: { 'apikey': apiKey },
        expectedStatus: [200, 404]
      }
    );

    await this.checkEndpoint(
      'Supabase Storage',
      `${supabaseUrl}/storage/v1/`,
      {
        category: 'Backend',
        headers: { 'apikey': apiKey },
        expectedStatus: [200, 404]
      }
    );

    await this.checkEndpoint(
      'Supabase Realtime',
      `${supabaseUrl}/realtime/v1/`,
      {
        category: 'Backend',
        headers: { 'apikey': apiKey },
        expectedStatus: [200, 404, 426] // 426 = Upgrade Required (WebSocket)
      }
    );
  }

  async checkSocialMediaAPIs() {
    // Facebook/Meta APIs
    await this.checkEndpoint(
      'Facebook Graph API',
      'https://graph.facebook.com/v18.0/',
      {
        category: 'Social Media',
        expectedStatus: [400, 401] // Expected without access token
      }
    );

    await this.checkEndpoint(
      'Facebook OAuth',
      'https://www.facebook.com/v18.0/dialog/oauth',
      {
        category: 'Social Media',
        expectedStatus: [400, 401, 200]
      }
    );

    // Twitter/X APIs
    await this.checkEndpoint(
      'Twitter API v2',
      'https://api.twitter.com/2/',
      {
        category: 'Social Media',
        expectedStatus: [401, 404] // Expected without auth
      }
    );

    await this.checkEndpoint(
      'Twitter Upload API',
      'https://upload.twitter.com/1.1/media/upload.json',
      {
        category: 'Social Media',
        expectedStatus: [400, 401, 403]
      }
    );

    // LinkedIn APIs
    await this.checkEndpoint(
      'LinkedIn API',
      'https://api.linkedin.com/v2/',
      {
        category: 'Social Media',
        expectedStatus: [401, 403] // Expected without auth
      }
    );

    await this.checkEndpoint(
      'LinkedIn OAuth',
      'https://www.linkedin.com/oauth/v2/',
      {
        category: 'Social Media',
        expectedStatus: [400, 401, 404]
      }
    );
  }

  async checkIntegrationServices() {
    // Figma API
    await this.checkEndpoint(
      'Figma API',
      'https://api.figma.com/v1/me',
      {
        category: 'Integrations',
        expectedStatus: [401, 403] // Expected without auth token
      }
    );

    // Dropbox API
    await this.checkEndpoint(
      'Dropbox API',
      'https://api.dropboxapi.com/2/users/get_current_account',
      {
        category: 'Integrations',
        expectedStatus: [400, 401],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Slack API
    await this.checkEndpoint(
      'Slack API',
      'https://slack.com/api/api.test',
      {
        category: 'Integrations',
        expectedStatus: [200] // This endpoint works without auth
      }
    );

    // Notion API
    await this.checkEndpoint(
      'Notion API',
      'https://api.notion.com/v1/users/me',
      {
        category: 'Integrations',
        expectedStatus: [401, 400] // Expected without auth
      }
    );
  }

  async checkExternalResources() {
    // Google Fonts
    await this.checkEndpoint(
      'Google Fonts API',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      {
        category: 'External Resources',
        expectedStatus: [200]
      }
    );

    await this.checkEndpoint(
      'Google Fonts Static',
      'https://fonts.gstatic.com/',
      {
        category: 'External Resources',
        expectedStatus: [200, 404]
      }
    );

    // CDN Resources
    await this.checkEndpoint(
      'Vercel Edge Network',
      'https://vercel.com',
      {
        category: 'External Resources',
        expectedStatus: [200]
      }
    );
  }

  generateReport() {
    const totalTime = Math.round(performance.now() - this.startTime);
    
    // Group results by category
    const categories = {};
    this.results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    });

    // Print results by category
    Object.entries(categories).forEach(([category, results]) => {
      console.log(`\n${colors.cyan}${category}:${colors.reset}`);
      results.forEach(result => {
        console.log(`  ${result.status} ${result.name}`);
        console.log(`    ${colors.blue}URL:${colors.reset} ${result.url}`);
        console.log(`    ${colors.blue}Status:${colors.reset} ${result.statusCode} | ${colors.blue}Response:${colors.reset} ${result.responseTime}`);
        if (result.details && result.details !== 'Service responding') {
          console.log(`    ${colors.blue}Details:${colors.reset} ${result.details}`);
        }
      });
    });

    // Summary statistics
    const healthy = this.results.filter(r => r.status === STATUS.HEALTHY).length;
    const warning = this.results.filter(r => r.status === STATUS.WARNING).length;
    const error = this.results.filter(r => r.status === STATUS.ERROR).length;
    const total = this.results.length;

    console.log(`\n${colors.cyan}================================================${colors.reset}`);
    console.log(`${colors.bright}📊 Summary${colors.reset}`);
    console.log(`Total Services Checked: ${total}`);
    console.log(`${STATUS.HEALTHY}: ${healthy} services`);
    console.log(`${STATUS.WARNING}: ${warning} services`);
    console.log(`${STATUS.ERROR}: ${error} services`);
    console.log(`Total Diagnostic Time: ${totalTime}ms`);

    // Overall health assessment
    const healthPercentage = Math.round((healthy / total) * 100);
    let overallStatus;
    if (healthPercentage >= 90) {
      overallStatus = `${colors.green}EXCELLENT${colors.reset}`;
    } else if (healthPercentage >= 80) {
      overallStatus = `${colors.yellow}GOOD${colors.reset}`;
    } else if (healthPercentage >= 60) {
      overallStatus = `${colors.yellow}WARNING${colors.reset}`;
    } else {
      overallStatus = `${colors.red}CRITICAL${colors.reset}`;
    }

    console.log(`\n${colors.bright}🎯 Overall System Health: ${overallStatus} (${healthPercentage}%)${colors.reset}`);

    // Recommendations
    if (error > 0) {
      console.log(`\n${colors.red}⚠️  Critical Issues Found:${colors.reset}`);
      this.results
        .filter(r => r.status === STATUS.ERROR)
        .forEach(result => {
          console.log(`  • ${result.name}: ${result.details}`);
        });
    }

    if (warning > 0) {
      console.log(`\n${colors.yellow}⚠️  Warnings Found:${colors.reset}`);
      this.results
        .filter(r => r.status === STATUS.WARNING)
        .forEach(result => {
          console.log(`  • ${result.name}: Status ${result.statusCode}`);
        });
    }

    // Environment Check
    console.log(`\n${colors.bright}🔧 Environment Configuration${colors.reset}`);
    this.checkEnvironmentVariables();

    console.log(`\n${colors.cyan}Diagnostic complete! 🚀${colors.reset}`);
  }

  checkEnvironmentVariables() {
    // Check if we're using hardcoded values (production pattern)
    const hardcodedSupabaseUrl = 'https://wxbrfmjxrfhntjkdlcbz.supabase.co';
    const hasHardcodedConfig = this.results.some(r => 
      r.name === 'Supabase REST API' && r.url.includes('wxbrfmjxrfhntjkdlcbz')
    );

    if (hasHardcodedConfig) {
      console.log(`  ${STATUS.HEALTHY} Supabase Configuration: Using hardcoded production values`);
      console.log(`  ${colors.blue}ℹ️  Environment variables not needed (using hardcoded config)${colors.reset}`);
      return;
    }

    const requiredEnvVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];

    const optionalEnvVars = [
      'VITE_INSTAGRAM_CLIENT_ID',
      'VITE_FACEBOOK_APP_ID',
      'VITE_TWITTER_API_KEY',
      'VITE_LINKEDIN_CLIENT_ID',
      'VITE_NOTION_TOKEN',
      'VITE_DROPBOX_ACCESS_TOKEN',
      'VITE_FIGMA_ACCESS_TOKEN',
      'VITE_SLACK_WEBHOOK_URL'
    ];

    requiredEnvVars.forEach(envVar => {
      const value = process.env[envVar];
      if (value && value !== 'your-key' && value !== 'https://your-project.supabase.co') {
        console.log(`  ${STATUS.HEALTHY} ${envVar}: Configured`);
      } else {
        console.log(`  ${STATUS.ERROR} ${envVar}: Missing or placeholder value`);
      }
    });

    console.log(`\n  Optional API Keys:`);
    optionalEnvVars.forEach(envVar => {
      const value = process.env[envVar];
      if (value && !value.startsWith('your-')) {
        console.log(`  ${STATUS.HEALTHY} ${envVar}: Configured`);
      } else {
        console.log(`  ${colors.blue}ℹ️  ${envVar}: Not configured (optional)${colors.reset}`);
      }
    });
  }
}

// Export for use as module or run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const diagnostics = new DependencyDiagnostics();
  diagnostics.runAllChecks().catch(console.error);
}

export default DependencyDiagnostics;