#!/usr/bin/env node

/**
 * PWA Validation Script
 * Comprehensive automated testing for PWA functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:4174';
const REQUIRED_FILES = [
  '/manifest.json',
  '/sw.js', 
  '/offline.html',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg'
];

const REQUIRED_MANIFEST_FIELDS = [
  'name',
  'short_name', 
  'start_url',
  'display',
  'theme_color',
  'background_color',
  'icons'
];

const PERFORMANCE_THRESHOLDS = {
  mainBundle: 25 * 1024, // 25KB gzipped
  totalJS: 150 * 1024,   // 150KB total JS gzipped
  totalCSS: 30 * 1024    // 30KB total CSS gzipped
};

class PWAValidator {
  constructor() {
    this.results = {
      manifest: { passed: 0, failed: 0, tests: [] },
      serviceWorker: { passed: 0, failed: 0, tests: [] },
      performance: { passed: 0, failed: 0, tests: [] },
      icons: { passed: 0, failed: 0, tests: [] },
      accessibility: { passed: 0, failed: 0, tests: [] },
      offline: { passed: 0, failed: 0, tests: [] }
    };
  }

  async runTest(category, name, testFn) {
    try {
      const result = await testFn();
      this.results[category].tests.push({ name, status: 'PASS', result });
      this.results[category].passed++;
      console.log(`✅ ${name}`);
      return true;
    } catch (error) {
      this.results[category].tests.push({ name, status: 'FAIL', error: error.message });
      this.results[category].failed++;
      console.log(`❌ ${name}: ${error.message}`);
      return false;
    }
  }

  async validateFileExists(url) {
    const response = await fetch(`${BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`File not accessible: ${response.status} ${response.statusText}`);
    }
    return response;
  }

  async validateManifest() {
    console.log('\n🔍 Testing PWA Manifest...');
    
    await this.runTest('manifest', 'Manifest file accessible', async () => {
      const response = await this.validateFileExists('/manifest.json');
      return `Status: ${response.status}`;
    });

    await this.runTest('manifest', 'Manifest has required fields', async () => {
      const response = await fetch(`${BASE_URL}/manifest.json`);
      const manifest = await response.json();
      
      const missing = REQUIRED_MANIFEST_FIELDS.filter(field => !manifest[field]);
      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }
      
      return `All ${REQUIRED_MANIFEST_FIELDS.length} required fields present`;
    });

    await this.runTest('manifest', 'Manifest display mode is standalone', async () => {
      const response = await fetch(`${BASE_URL}/manifest.json`);
      const manifest = await response.json();
      
      if (manifest.display !== 'standalone') {
        throw new Error(`Display mode is '${manifest.display}', expected 'standalone'`);
      }
      
      return `Display mode: ${manifest.display}`;
    });

    await this.runTest('manifest', 'Manifest has proper start_url', async () => {
      const response = await fetch(`${BASE_URL}/manifest.json`);
      const manifest = await response.json();
      
      if (!manifest.start_url || manifest.start_url === '/') {
        throw new Error('start_url should be set to a specific page (e.g., /dashboard)');
      }
      
      return `Start URL: ${manifest.start_url}`;
    });

    await this.runTest('manifest', 'Manifest has sufficient icons', async () => {
      const response = await fetch(`${BASE_URL}/manifest.json`);
      const manifest = await response.json();
      
      if (!manifest.icons || manifest.icons.length < 2) {
        throw new Error('Need at least 2 icon sizes for proper PWA support');
      }
      
      const has192 = manifest.icons.some(icon => icon.sizes.includes('192x192'));
      const has512 = manifest.icons.some(icon => icon.sizes.includes('512x512'));
      
      if (!has192 || !has512) {
        throw new Error('Missing required icon sizes: 192x192 and 512x512');
      }
      
      return `${manifest.icons.length} icons defined with required sizes`;
    });
  }

  async validateServiceWorker() {
    console.log('\n🔧 Testing Service Worker...');

    await this.runTest('serviceWorker', 'Service worker file accessible', async () => {
      const response = await this.validateFileExists('/sw.js');
      const contentType = response.headers.get('content-type');
      
      if (!contentType.includes('javascript')) {
        throw new Error(`Invalid content-type: ${contentType}`);
      }
      
      return `Content-Type: ${contentType}`;
    });

    await this.runTest('serviceWorker', 'Service worker has proper cache headers', async () => {
      const response = await fetch(`${BASE_URL}/sw.js`);
      const cacheControl = response.headers.get('cache-control');
      
      if (!cacheControl || !cacheControl.includes('no-cache')) {
        throw new Error('Service worker should have no-cache headers for updates');
      }
      
      return `Cache-Control: ${cacheControl}`;
    });

    await this.runTest('serviceWorker', 'Service worker contains required events', async () => {
      const response = await fetch(`${BASE_URL}/sw.js`);
      const swContent = await response.text();
      
      const requiredEvents = ['install', 'activate', 'fetch'];
      const missing = requiredEvents.filter(event => 
        !swContent.includes(`addEventListener('${event}'`)
      );
      
      if (missing.length > 0) {
        throw new Error(`Missing event listeners: ${missing.join(', ')}`);
      }
      
      return `All required events: ${requiredEvents.join(', ')}`;
    });
  }

  async validateIcons() {
    console.log('\n🎨 Testing PWA Icons...');

    const iconSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
    
    for (const size of iconSizes) {
      await this.runTest('icons', `Icon ${size} accessible`, async () => {
        const response = await this.validateFileExists(`/icons/icon-${size}.svg`);
        return `Status: ${response.status}`;
      });
    }

    await this.runTest('icons', 'Shortcut icons accessible', async () => {
      const shortcuts = ['dashboard', 'create', 'analytics', 'schedule'];
      for (const shortcut of shortcuts) {
        await this.validateFileExists(`/icons/shortcut-${shortcut}.svg`);
      }
      return `All ${shortcuts.length} shortcut icons accessible`;
    });
  }

  async validateOfflineSupport() {
    console.log('\n📱 Testing Offline Support...');

    await this.runTest('offline', 'Offline page accessible', async () => {
      const response = await this.validateFileExists('/offline.html');
      const content = await response.text();
      
      if (!content.includes('offline') && !content.includes('Offline')) {
        throw new Error('Offline page should contain offline-related content');
      }
      
      return 'Offline page contains appropriate content';
    });

    await this.runTest('offline', 'Offline page has proper styling', async () => {
      const response = await fetch(`${BASE_URL}/offline.html`);
      const content = await response.text();
      
      if (!content.includes('<style>') && !content.includes('.css')) {
        throw new Error('Offline page should be self-contained with embedded styles');
      }
      
      return 'Offline page has embedded styles';
    });
  }

  async validatePerformance() {
    console.log('\n⚡ Testing Performance...');

    await this.runTest('performance', 'Bundle size within limits', async () => {
      const distPath = path.join(__dirname, '../dist');
      const files = fs.readdirSync(path.join(distPath, 'assets'));
      
      let totalJS = 0;
      let totalCSS = 0;
      let mainBundle = 0;
      
      files.forEach(file => {
        const filePath = path.join(distPath, 'assets', file);
        const stats = fs.statSync(filePath);
        
        if (file.endsWith('.js')) {
          totalJS += stats.size;
          if (file.includes('index-') && !file.includes('vendor')) {
            mainBundle = stats.size;
          }
        } else if (file.endsWith('.css')) {
          totalCSS += stats.size;
        }
      });
      
      if (mainBundle > PERFORMANCE_THRESHOLDS.mainBundle) {
        throw new Error(`Main bundle too large: ${(mainBundle/1024).toFixed(1)}KB > ${(PERFORMANCE_THRESHOLDS.mainBundle/1024).toFixed(1)}KB`);
      }
      
      return `Main: ${(mainBundle/1024).toFixed(1)}KB, Total JS: ${(totalJS/1024).toFixed(1)}KB, Total CSS: ${(totalCSS/1024).toFixed(1)}KB`;
    });

    await this.runTest('performance', 'Code splitting implemented', async () => {
      const distPath = path.join(__dirname, '../dist/assets');
      const files = fs.readdirSync(distPath);
      
      const chunks = files.filter(file => 
        file.includes('chunk') || file.includes('vendor')
      ).length;
      
      if (chunks < 3) {
        throw new Error(`Insufficient code splitting: ${chunks} chunks found, expected at least 3`);
      }
      
      return `${chunks} code-split chunks found`;
    });
  }

  async validateAccessibility() {
    console.log('\n♿ Testing Accessibility...');

    await this.runTest('accessibility', 'HTML has proper meta tags', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();
      
      const requiredMeta = [
        'viewport',
        'theme-color',
        'description'
      ];
      
      const missing = requiredMeta.filter(meta => 
        !html.includes(`name="${meta}"`) && !html.includes(`property="${meta}"`)
      );
      
      if (missing.length > 0) {
        throw new Error(`Missing meta tags: ${missing.join(', ')}`);
      }
      
      return `All required meta tags present: ${requiredMeta.join(', ')}`;
    });

    await this.runTest('accessibility', 'Manifest linked in HTML', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();
      
      if (!html.includes('rel="manifest"')) {
        throw new Error('Manifest not linked in HTML head');
      }
      
      return 'Manifest properly linked';
    });

    await this.runTest('accessibility', 'Apple touch icon specified', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const html = await response.text();
      
      if (!html.includes('apple-touch-icon')) {
        throw new Error('Apple touch icon not specified for iOS');
      }
      
      return 'Apple touch icon specified';
    });
  }

  generateReport() {
    console.log('\n📊 PWA Validation Report');
    console.log('=' .repeat(50));
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    Object.entries(this.results).forEach(([category, results]) => {
      const { passed, failed, tests } = results;
      totalPassed += passed;
      totalFailed += failed;
      
      console.log(`\n${category.toUpperCase()}: ${passed}/${passed + failed} tests passed`);
      
      tests.forEach(test => {
        const status = test.status === 'PASS' ? '✅' : '❌';
        console.log(`  ${status} ${test.name}`);
        if (test.error) {
          console.log(`     Error: ${test.error}`);
        }
      });
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`TOTAL: ${totalPassed}/${totalPassed + totalFailed} tests passed`);
    
    const successRate = totalPassed / (totalPassed + totalFailed) * 100;
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    
    if (successRate >= 95) {
      console.log('🎉 EXCELLENT! PWA is production ready');
    } else if (successRate >= 85) {
      console.log('✅ GOOD! PWA meets minimum requirements');
    } else if (successRate >= 70) {
      console.log('⚠️  NEEDS WORK! Address failing tests before deployment');
    } else {
      console.log('❌ CRITICAL ISSUES! PWA not ready for production');
    }
    
    return successRate;
  }

  async validateAll() {
    console.log('🚀 Starting PWA Validation');
    console.log(`Testing against: ${BASE_URL}`);
    
    try {
      await this.validateManifest();
      await this.validateServiceWorker();
      await this.validateIcons();
      await this.validateOfflineSupport();
      await this.validatePerformance();
      await this.validateAccessibility();
      
      return this.generateReport();
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return 0;
    }
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new PWAValidator();
  
  validator.validateAll().then(successRate => {
    process.exit(successRate >= 85 ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default PWAValidator;