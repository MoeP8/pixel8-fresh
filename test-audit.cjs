#!/usr/bin/env node

/**
 * Pixel8 Social Hub - Comprehensive User Testing Audit
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

class WebAppAuditor {
  constructor(baseUrl = 'http://localhost:4173') {
    this.baseUrl = baseUrl;
    this.results = {
      critical: [],
      improvements: [],
      working: []
    };
  }

  async testEndpoint(path, description) {
    const url = `${this.baseUrl}${path}`;
    
    return new Promise((resolve) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const startTime = Date.now();
      
      const req = client.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const loadTime = Date.now() - startTime;
          resolve({
            path,
            description,
            statusCode: res.statusCode,
            loadTime,
            hasContent: data.length > 0,
            hasError: data.includes('error') || data.includes('Error'),
            hasLoadingScreen: data.includes('loading-screen'),
            hasReactRoot: data.includes('id="root"'),
            contentLength: data.length
          });
        });
      });
      
      req.on('error', (error) => {
        resolve({
          path,
          description,
          statusCode: 0,
          error: error.message,
          loadTime: Date.now() - startTime
        });
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          path,
          description,
          statusCode: 0,
          error: 'Timeout',
          loadTime: 5000
        });
      });
    });
  }

  async runAudit() {
    console.log('🔍 Starting Pixel8 Social Hub User Testing Audit\n');
    console.log('=' .repeat(60));

    // Test core routes
    const routes = [
      { path: '/', desc: 'Landing Page' },
      { path: '/dashboard', desc: 'Dashboard' },
      { path: '/brand-hub', desc: 'Brand Hub' },
      { path: '/content-studio', desc: 'Content Studio' },
      { path: '/analytics', desc: 'Analytics' },
      { path: '/campaigns', desc: 'Campaigns' },
      { path: '/settings', desc: 'Settings' },
      { path: '/design-system', desc: 'Design System' },
      { path: '/nonexistent', desc: '404 Page Test' },
      { path: '/diagnostics.html', desc: 'Diagnostics Tool' }
    ];

    console.log('\n📍 ROUTE TESTING\n');
    const routeResults = [];
    
    for (const route of routes) {
      const result = await this.testEndpoint(route.path, route.desc);
      routeResults.push(result);
      
      const status = result.statusCode === 200 ? '✅' : 
                     result.statusCode === 404 ? '⚠️' : '❌';
      const time = result.loadTime < 500 ? '⚡' : 
                   result.loadTime < 1000 ? '⏱' : '🐌';
      
      console.log(`${status} ${route.desc.padEnd(20)} | Status: ${result.statusCode} | Load: ${result.loadTime}ms ${time}`);
      
      // Categorize issues
      if (result.statusCode !== 200 && route.path !== '/nonexistent') {
        this.results.critical.push({
          type: 'Routing',
          issue: `${route.desc} returns ${result.statusCode}`,
          path: route.path,
          priority: 'High'
        });
      }
      
      if (result.loadTime > 1000) {
        this.results.improvements.push({
          type: 'Performance',
          issue: `${route.desc} slow load time: ${result.loadTime}ms`,
          path: route.path,
          priority: 'Medium'
        });
      }
      
      if (result.statusCode === 200 && result.loadTime < 500) {
        this.results.working.push(`${route.desc} loads quickly`);
      }
    }

    // Check for SPA behavior
    console.log('\n🔄 SPA BEHAVIOR CHECK\n');
    const spaRoutes = routeResults.filter(r => 
      r.path !== '/diagnostics.html' && 
      r.path !== '/nonexistent'
    );
    
    const allReturnSameContent = spaRoutes.every(r => 
      r.hasReactRoot && r.hasLoadingScreen
    );
    
    if (allReturnSameContent) {
      console.log('✅ SPA routing detected - all routes return index.html');
      this.results.working.push('SPA routing working correctly');
    } else {
      console.log('❌ SPA routing issues detected');
      this.results.critical.push({
        type: 'Routing',
        issue: 'SPA routing not functioning properly',
        priority: 'High'
      });
    }

    // Performance Analysis
    console.log('\n⚡ PERFORMANCE ANALYSIS\n');
    const avgLoadTime = routeResults
      .filter(r => r.statusCode === 200)
      .reduce((sum, r) => sum + r.loadTime, 0) / 
      routeResults.filter(r => r.statusCode === 200).length;
    
    console.log(`Average Load Time: ${Math.round(avgLoadTime)}ms`);
    
    if (avgLoadTime > 1000) {
      this.results.improvements.push({
        type: 'Performance',
        issue: `High average load time: ${Math.round(avgLoadTime)}ms`,
        priority: 'High'
      });
    }

    // Generate Report
    this.generateReport();
  }

  generateReport() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 USER TESTING AUDIT REPORT');
    console.log('=' .repeat(60));

    // Critical Issues
    console.log('\n🔴 CRITICAL ISSUES (Breaks core functionality)\n');
    if (this.results.critical.length === 0) {
      console.log('  ✅ No critical issues found');
    } else {
      this.results.critical.forEach((issue, i) => {
        console.log(`  ${i + 1}. [${issue.type}] ${issue.issue}`);
        if (issue.path) console.log(`     Location: ${issue.path}`);
        console.log(`     Priority: ${issue.priority}`);
        console.log();
      });
    }

    // Improvements
    console.log('\n🟡 IMPROVEMENT OPPORTUNITIES (UX/Performance enhancements)\n');
    if (this.results.improvements.length === 0) {
      console.log('  ✅ No major improvements needed');
    } else {
      this.results.improvements.forEach((issue, i) => {
        console.log(`  ${i + 1}. [${issue.type}] ${issue.issue}`);
        if (issue.path) console.log(`     Location: ${issue.path}`);
        console.log(`     Priority: ${issue.priority}`);
        console.log();
      });
    }

    // Working Well
    console.log('\n🟢 WORKING WELL (Positive observations)\n');
    if (this.results.working.length === 0) {
      console.log('  ⚠️ No positive observations recorded');
    } else {
      this.results.working.forEach((item, i) => {
        console.log(`  ${i + 1}. ${item}`);
      });
    }

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📈 SUMMARY');
    console.log('=' .repeat(60));
    console.log(`  Critical Issues: ${this.results.critical.length}`);
    console.log(`  Improvements Needed: ${this.results.improvements.length}`);
    console.log(`  Working Features: ${this.results.working.length}`);
    
    const score = Math.max(0, 100 - (this.results.critical.length * 20) - (this.results.improvements.length * 5));
    console.log(`\n  Overall Health Score: ${score}/100`);
    
    if (score >= 80) {
      console.log('  Status: 🟢 Good - Minor improvements needed');
    } else if (score >= 60) {
      console.log('  Status: 🟡 Fair - Several improvements recommended');
    } else {
      console.log('  Status: 🔴 Poor - Critical issues need immediate attention');
    }

    console.log('\n' + '=' .repeat(60));
    console.log('Audit completed at:', new Date().toLocaleString());
  }
}

// Run the audit
const auditor = new WebAppAuditor();
auditor.runAudit().catch(console.error);