#!/usr/bin/env node

/**
 * Network Debug Tool - Check what's happening with app loading
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const baseUrl = 'http://localhost:4173';

class NetworkDebugger {
  constructor() {
    this.results = [];
  }

  async fetchWithDetails(url, description) {
    console.log(`\n🔍 Testing: ${description}`);
    console.log(`   URL: ${url}`);
    
    return new Promise((resolve) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const startTime = Date.now();
      
      const req = client.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const loadTime = Date.now() - startTime;
          const result = {
            url,
            description,
            statusCode: res.statusCode,
            headers: res.headers,
            contentType: res.headers['content-type'],
            contentLength: data.length,
            loadTime,
            hasContent: data.length > 0,
            content: data.substring(0, 500) // First 500 chars
          };
          
          console.log(`   ✅ Status: ${res.statusCode} | Size: ${data.length} bytes | Time: ${loadTime}ms`);
          console.log(`   📄 Content-Type: ${res.headers['content-type']}`);
          
          // Check for specific content
          if (data.includes('Loading React application')) {
            console.log(`   ⚠️  Still shows loading screen`);
          }
          if (data.includes('App Initialization Timeout')) {
            console.log(`   🚨 Timeout error detected`);
          }
          if (data.includes('error') || data.includes('Error')) {
            console.log(`   🔴 Contains error text`);
          }
          if (data.includes('<script')) {
            const scriptCount = (data.match(/<script/g) || []).length;
            console.log(`   📜 Contains ${scriptCount} script tags`);
          }
          if (data.includes('main.tsx') || data.includes('App.tsx')) {
            console.log(`   ⚛️  React files referenced`);
          }
          
          this.results.push(result);
          resolve(result);
        });
      });
      
      req.on('error', (error) => {
        console.error(`   ❌ Network Error: ${error.message}`);
        resolve({ error: error.message, url, description });
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        console.error(`   ⏱️  Timeout after 10 seconds`);
        resolve({ error: 'Timeout', url, description });
      });
    });
  }

  async checkJavaScriptExecution() {
    console.log(`\n📜 JAVASCRIPT BUNDLE ANALYSIS`);
    console.log(`=====================================`);
    
    // Get the main HTML first
    const htmlResult = await this.fetchWithDetails(baseUrl, 'Main HTML');
    
    if (!htmlResult.content) {
      console.error('❌ No HTML content received');
      return;
    }
    
    // Extract script src from HTML
    const scriptRegex = /<script[^>]+src="([^"]+)"/g;
    const scripts = [];
    let match;
    
    while ((match = scriptRegex.exec(htmlResult.content)) !== null) {
      scripts.push(match[1]);
    }
    
    console.log(`\n📦 Found ${scripts.length} script files:`);
    scripts.forEach(script => console.log(`   - ${script}`));
    
    // Test each script
    for (const script of scripts) {
      const scriptUrl = script.startsWith('http') ? script : baseUrl + script;
      const result = await this.fetchWithDetails(scriptUrl, `Script: ${script}`);
      
      if (result.content) {
        // Analyze script content
        const hasReact = result.content.includes('React') || result.content.includes('react');
        const hasError = result.content.includes('Error(') || result.content.includes('throw');
        const hasMain = result.content.includes('main.tsx') || result.content.includes('App.tsx');
        const hasSyntaxError = result.content.includes('SyntaxError');
        
        console.log(`     🔍 Analysis:`);
        if (hasReact) console.log(`       ⚛️  Contains React code`);
        if (hasMain) console.log(`       📱 References main/App components`);
        if (hasError) console.log(`       ⚠️  Contains error handling`);
        if (hasSyntaxError) console.log(`       🚨 Contains syntax errors!`);
        
        // Check for specific error patterns
        if (result.content.includes('__assign is not a function')) {
          console.log(`       ❌ TypeScript helper issue: __assign`);
        }
        if (result.content.includes('Cannot resolve module')) {
          console.log(`       ❌ Module resolution error`);
        }
      }
    }
  }

  async runFullDiagnosis() {
    console.log(`🔬 PIXEL8 NETWORK DIAGNOSTIC TOOL`);
    console.log(`==================================`);
    console.log(`Target: ${baseUrl}`);
    console.log(`Time: ${new Date().toLocaleString()}\n`);
    
    // 1. Basic connectivity
    console.log(`📡 CONNECTIVITY TEST`);
    console.log(`====================`);
    await this.fetchWithDetails(baseUrl, 'Homepage');
    await this.fetchWithDetails(baseUrl + '/dashboard', 'Dashboard Route');
    await this.fetchWithDetails(baseUrl + '/diagnostics.html', 'Diagnostics Page');
    
    // 2. JavaScript analysis
    await this.checkJavaScriptExecution();
    
    // 3. Wait and test again (to see if timeout triggers)
    console.log(`\n⏱️  TIMEOUT TEST`);
    console.log(`===============`);
    console.log(`Waiting 7 seconds to see if timeout error appears...`);
    
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    const timeoutResult = await this.fetchWithDetails(baseUrl, 'After Timeout');
    if (timeoutResult.content && timeoutResult.content.includes('App Initialization Timeout')) {
      console.log(`✅ Timeout error properly triggered after 5 seconds`);
    } else if (timeoutResult.content && timeoutResult.content.includes('Loading React application')) {
      console.log(`❌ Still stuck on loading screen - timeout not working`);
    }
    
    // 4. Summary
    this.generateSummary();
  }

  generateSummary() {
    console.log(`\n📊 DIAGNOSTIC SUMMARY`);
    console.log(`=====================`);
    
    const successfulRequests = this.results.filter(r => !r.error && r.statusCode === 200);
    const failedRequests = this.results.filter(r => r.error || r.statusCode !== 200);
    
    console.log(`✅ Successful requests: ${successfulRequests.length}`);
    console.log(`❌ Failed requests: ${failedRequests.length}`);
    
    if (failedRequests.length > 0) {
      console.log(`\n🚨 FAILED REQUESTS:`);
      failedRequests.forEach(req => {
        console.log(`   - ${req.description}: ${req.error || `Status ${req.statusCode}`}`);
      });
    }
    
    const avgLoadTime = successfulRequests.length > 0 
      ? Math.round(successfulRequests.reduce((sum, r) => sum + r.loadTime, 0) / successfulRequests.length)
      : 0;
    
    console.log(`\n⚡ Average load time: ${avgLoadTime}ms`);
    
    console.log(`\n🎯 CONCLUSIONS:`);
    if (successfulRequests.length > 0 && failedRequests.length === 0) {
      console.log(`   ✅ Network connectivity is working`);
      console.log(`   ✅ All assets are loading successfully`);
      console.log(`   🔍 Issue is likely in JavaScript execution, not network`);
    } else {
      console.log(`   ❌ Network issues detected`);
    }
  }
}

// Run the diagnosis
const networkDebugger = new NetworkDebugger();
networkDebugger.runFullDiagnosis().catch(console.error);