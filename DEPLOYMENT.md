# 🚀 Pixel8 Social Hub - Production Deployment Guide

## Custom Domain Configuration

### Option 1: Vercel Dashboard (Recommended)

1. **Access Vercel Dashboard**
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy to production
   vercel --prod
   ```

2. **Add Custom Domain**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project: `pixel8-fresh`
   - Navigate to **Settings** → **Domains**
   - Click **Add Domain**
   - Enter your domain: `pixel8.com` (or your domain)
   - Click **Add**

3. **Configure DNS Records**
   
   **For Apex Domain (pixel8.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   TTL: 3600
   ```
   
   **For WWW Subdomain (www.pixel8.com):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

### Option 2: Vercel CLI

```bash
# Add domain via CLI
vercel domains add pixel8.com

# Check domain status
vercel domains ls

# Remove domain if needed
vercel domains rm pixel8.com
```

### Option 3: Custom DNS Configuration

If using your own DNS provider (Cloudflare, GoDaddy, etc.):

1. **A Record for Apex Domain:**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

2. **CNAME for WWW:**
   ```
   Type: CNAME
   Name: www
   Value: [your-vercel-domain].vercel.app
   ```

3. **TXT Record for Verification (if required):**
   ```
   Type: TXT
   Name: @
   Value: [verification-code-from-vercel]
   ```

## SSL/TLS Configuration

Vercel automatically provisions SSL certificates via Let's Encrypt:
- ✅ Automatic HTTPS redirect
- ✅ HTTP/2 support
- ✅ Certificate auto-renewal
- ✅ Edge network optimization

## Environment Variables

Set production environment variables in Vercel dashboard:

```bash
# Via CLI
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_APP_ENV production

# Via Dashboard
# Settings → Environment Variables
```

## Performance Optimizations

### 1. Build Optimization
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 2. Caching Strategy
- **Static Assets**: 1 year cache with immutable
- **Service Worker**: No cache (always fresh)
- **PWA Manifest**: 1 year cache
- **HTML**: Dynamic (no cache)

### 3. Security Headers
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy: camera=(), microphone=(), geolocation=()

## PWA Configuration

### Service Worker
- **URL**: `/sw.js`
- **Scope**: `/` (entire domain)
- **Cache Strategy**: Network-first for API, Cache-first for assets
- **Offline Support**: Custom offline page

### App Manifest
- **Start URL**: `/dashboard`
- **Display**: `standalone`
- **Theme Color**: `#8b5cf6` (purple)
- **Background**: `#0f172a` (dark blue)

## Monitoring & Analytics

### 1. Vercel Analytics
```bash
# Enable Vercel Analytics
vercel analytics enable
```

### 2. Web Vitals Monitoring
- Core Web Vitals tracking built-in
- Real User Monitoring (RUM)
- Performance insights dashboard

### 3. Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- PostHog for product analytics

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Custom domain DNS records updated
- [ ] SSL certificate provisioned
- [ ] Service worker registration working
- [ ] PWA manifest accessible at `/manifest.json`
- [ ] Offline page accessible at `/offline.html`
- [ ] All icon sizes generated and placed in `/public/icons/`
- [ ] Build process completes without errors
- [ ] TypeScript compilation successful
- [ ] Responsive design tested on mobile
- [ ] Performance audit passed (Lighthouse score >90)

## Deployment Commands

### Development
```bash
npm run dev          # Local development server
npm run build        # Production build
npm run preview      # Preview production build locally
```

### Production
```bash
vercel --prod        # Deploy to production
vercel --prod --force # Force deployment (bypass cache)
vercel alias         # Manage domain aliases
```

## Domain Migration

If migrating from another domain:

1. **Redirect Setup**
   ```javascript
   // Add to vercel.json
   {
     "redirects": [
       {
         "source": "https://old-domain.com/:path*",
         "destination": "https://pixel8.com/:path*",
         "permanent": true
       }
     ]
   }
   ```

2. **Update PWA Manifest**
   - Update `start_url` to new domain
   - Update any hardcoded URLs

3. **SEO Considerations**
   - Submit new sitemap to Google Search Console
   - Update social media profiles
   - Notify users of domain change

## Troubleshooting

### Common Issues

1. **Domain Not Resolving**
   ```bash
   # Check DNS propagation
   nslookup pixel8.com
   dig pixel8.com
   ```

2. **SSL Certificate Issues**
   - Wait 24-48 hours for DNS propagation
   - Check Vercel dashboard for certificate status
   - Verify DNS records are correct

3. **Service Worker Not Loading**
   - Check browser network tab for `/sw.js` request
   - Verify service worker scope is correct
   - Clear browser cache and hard refresh

4. **PWA Install Prompt Not Showing**
   - Ensure HTTPS is working
   - Check manifest.json is accessible
   - Verify all required manifest fields
   - Test on different browsers/devices

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [PWA Best Practices](https://web.dev/pwa-checklist/)
- [Lighthouse Performance Guide](https://web.dev/lighthouse-performance/)

---

## Quick Setup Summary

1. `vercel --prod` (deploy)
2. Add domain in Vercel dashboard
3. Update DNS records
4. Wait for SSL provisioning
5. Test PWA functionality
6. Monitor performance metrics

**Total Setup Time**: 15-30 minutes (plus DNS propagation time)