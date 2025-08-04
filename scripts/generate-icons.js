#!/usr/bin/env node

/**
 * PWA Icon Generator
 * Generates all required PWA icons from a base design
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes required for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const shortcutSizes = [96];

// Create icons directory
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon template
const generateSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#gradient)" />
  
  <!-- P8 Logo -->
  <g transform="translate(${size * 0.2}, ${size * 0.2}) scale(${size / 256})">
    <!-- P -->
    <path d="M20 40 L20 160 L80 160 L120 160 C140 160 160 140 160 120 C160 100 140 80 120 80 L80 80 L80 120 L120 120" 
          stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- 8 -->
    <circle cx="200" cy="100" r="30" stroke="white" stroke-width="8" fill="none"/>
    <circle cx="200" cy="140" r="20" stroke="white" stroke-width="8" fill="none"/>
  </g>
</svg>
`.trim();

// Generate favicon ICO data (simplified)
const generateFaviconData = () => `
data:image/svg+xml,${encodeURIComponent(generateSVGIcon(32))}
`.trim();

console.log('🎨 Generating PWA icons...');

// Generate main app icons
iconSizes.forEach(size => {
  const svgContent = generateSVGIcon(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // For this demo, we'll create SVG files that browsers can use
  // In production, you'd convert these to PNG using a tool like Sharp
  const svgFilename = `icon-${size}x${size}.svg`;
  const svgFilepath = path.join(iconsDir, svgFilename);
  
  fs.writeFileSync(svgFilepath, svgContent);
  console.log(`✅ Generated ${svgFilename}`);
});

// Generate shortcut icons
const shortcuts = [
  { name: 'dashboard', icon: '📊' },
  { name: 'create', icon: '✏️' },
  { name: 'analytics', icon: '📈' },
  { name: 'schedule', icon: '📅' }
];

shortcuts.forEach(shortcut => {
  shortcutSizes.forEach(size => {
    const filename = `shortcut-${shortcut.name}.png`;
    const svgFilename = `shortcut-${shortcut.name}.svg`;
    const filepath = path.join(iconsDir, svgFilename);
    
    const svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#gradient)" />
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
        font-size="${size * 0.5}" fill="white">${shortcut.icon}</text>
</svg>
    `.trim();
    
    fs.writeFileSync(filepath, svgContent);
    console.log(`✅ Generated ${svgFilename}`);
  });
});

// Generate additional icons
const additionalIcons = [
  { name: 'badge-72x72', size: 72 },
  { name: 'action-view', size: 24 },
  { name: 'action-dismiss', size: 24 }
];

additionalIcons.forEach(icon => {
  const svgContent = generateSVGIcon(icon.size);
  const filename = `${icon.name}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Generated ${filename}`);
});

// Generate favicon
const faviconPath = path.join(__dirname, '../public/favicon.ico');
const faviconSvgPath = path.join(__dirname, '../public/favicon.svg');
const faviconSvg = generateSVGIcon(32);

fs.writeFileSync(faviconSvgPath, faviconSvg);
console.log('✅ Generated favicon.svg');

// Create a simple HTML file to test icons
const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>PWA Icon Test</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: white; }
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 20px; }
        .icon-item { text-align: center; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px; }
        .icon-item img { width: 64px; height: 64px; margin-bottom: 10px; }
        .icon-item small { display: block; font-size: 12px; opacity: 0.7; }
    </style>
</head>
<body>
    <h1>🎨 PWA Icons Preview</h1>
    <div class="icon-grid">
        ${iconSizes.map(size => `
            <div class="icon-item">
                <img src="icons/icon-${size}x${size}.svg" alt="${size}x${size}">
                <div>${size}x${size}</div>
                <small>App Icon</small>
            </div>
        `).join('')}
        ${shortcuts.map(shortcut => `
            <div class="icon-item">
                <img src="icons/shortcut-${shortcut.name}.svg" alt="${shortcut.name}">
                <div>${shortcut.name}</div>
                <small>Shortcut</small>
            </div>
        `).join('')}
    </div>
    
    <h2>🔗 Links</h2>
    <ul>
        <li><a href="manifest.json" style="color: #8b5cf6;">manifest.json</a></li>
        <li><a href="sw.js" style="color: #8b5cf6;">sw.js</a></li>
        <li><a href="offline.html" style="color: #8b5cf6;">offline.html</a></li>
    </ul>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../public/icons-test.html'), testHtml);
console.log('✅ Generated icons-test.html');

console.log(`
🚀 PWA Icon generation complete!

Generated files:
- ${iconSizes.length} app icons (multiple sizes)
- ${shortcuts.length} shortcut icons  
- 3 additional utility icons
- 1 favicon
- 1 test page

Next steps:
1. Run 'npm run build' to test the build
2. Deploy to Vercel: 'vercel --prod'
3. Configure custom domain in Vercel dashboard
4. Test PWA functionality on mobile device

Note: For production, convert SVG icons to PNG format using tools like Sharp or ImageMagick for better browser compatibility.
`);