#!/usr/bin/env node

/**
 * JavaScript Error Detector - Check browser console for JS blocking issues
 */

const puppeteer = require('puppeteer');

async function detectJavaScriptErrors() {
  console.log('🔍 Starting JavaScript execution detection...');
  
  let browser;
  try {
    // Launch browser with console logging
    browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      devtools: true,  // Open DevTools
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox'
      ]
    });
    
    const page = await browser.newPage();
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      const message = `[${msg.type()}] ${msg.text()}`;
      console.log('Browser Console:', message);
      consoleMessages.push(message);
    });
    
    // Capture JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => {
      console.error('JavaScript Error:', error.message);
      jsErrors.push(error.message);
    });
    
    // Capture failed requests
    const failedRequests = [];
    page.on('requestfailed', request => {
      console.error('Request Failed:', request.url(), request.failure().errorText);
      failedRequests.push({ url: request.url(), error: request.failure().errorText });
    });
    
    console.log('🌐 Loading page: http://localhost:8080');
    await page.goto('http://localhost:8080', { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    // Wait a bit for JavaScript to execute
    await page.waitForTimeout(5000);
    
    // Check if basic JavaScript executed
    const rootContent = await page.evaluate(() => {
      return document.getElementById('root').innerHTML;
    });
    
    console.log('\n📊 DETECTION RESULTS:');
    console.log('===================');
    console.log(`Console Messages: ${consoleMessages.length}`);
    console.log(`JavaScript Errors: ${jsErrors.length}`);
    console.log(`Failed Requests: ${failedRequests.length}`);
    
    if (rootContent.includes('INLINE TEST SUCCESS')) {
      console.log('✅ JavaScript execution: WORKING');
    } else if (rootContent.includes('Loading React application')) {
      console.log('❌ JavaScript execution: BLOCKED (still on loading screen)');
    } else {
      console.log('❓ JavaScript execution: UNKNOWN STATE');
    }
    
    if (jsErrors.length > 0) {
      console.log('\n🚨 JavaScript Errors:');
      jsErrors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (failedRequests.length > 0) {
      console.log('\n🚨 Failed Requests:');
      failedRequests.forEach(req => console.log(`  - ${req.url}: ${req.error}`));
    }
    
    console.log('\n📋 Recent Console Messages:');
    consoleMessages.slice(-10).forEach(msg => console.log(`  ${msg}`));
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection...');
    console.log('Press Ctrl+C to close when done');
    
    // Wait indefinitely
    await new Promise(() => {});
    
  } catch (error) {
    console.error('Detection Error:', error.message);
  }
}

detectJavaScriptErrors().catch(console.error);