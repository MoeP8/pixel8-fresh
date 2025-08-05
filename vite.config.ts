import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'scheduler', 'tslib'],
    exclude: [],
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis',
      },
    }
  },
  build: {
    target: "es2020", // More compatible target
    minify: "terser", // Use terser for safer minification
    cssMinify: true,
    cssCodeSplit: false, // Ensure CSS is always injected
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
        pure_funcs: [], // Don't drop console.log
        passes: 1, // Single pass for safer minification
        arrows: false, // Don't convert to arrow functions
        keep_fargs: true, // Keep unused function arguments
      },
      mangle: {
        safari10: true, // Fix Safari 10/11 bugs
        keep_fnames: true, // Keep function names for React DevTools
      },
      format: {
        comments: false,
        ascii_only: true, // Safer for various environments
        beautify: false,
        semicolons: true, // Always use semicolons
      },
    },
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: (id) => {
          // React and core dependencies - keep scheduler with React
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || 
              id.includes('scheduler')) {
            return 'react-vendor';
          }
          
          // UI component libraries
          if (id.includes('@radix-ui') || id.includes('lucide-react') || 
              id.includes('class-variance-authority') || id.includes('clsx') || 
              id.includes('tailwind-merge')) {
            return 'ui-vendor';
          }
          
          // Data and state management
          if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
            return 'data-vendor';
          }
          
          // Charts and visualization
          if (id.includes('recharts') || id.includes('react-big-calendar') || 
              id.includes('date-fns')) {
            return 'charts-vendor';
          }
          
          // Form and utilities
          if (id.includes('react-hot-toast') || id.includes('sonner') || 
              id.includes('react-hook-form') || id.includes('zod') || 
              id.includes('next-themes')) {
            return 'utils-vendor';
          }
          
          // Analytics pages and components
          if (id.includes('/pages/Analytics') || 
              id.includes('/components/analytics/') || 
              id.includes('/hooks/useAnalytics')) {
            return 'analytics-chunk';
          }
          
          // Brand management pages and components
          if (id.includes('/pages/BrandHub') || 
              id.includes('/components/brand-management/') || 
              id.includes('/hooks/useBrandManagement')) {
            return 'brand-chunk';
          }
          
          // Publishing and scheduling
          if (id.includes('/pages/publisher/') || 
              id.includes('/pages/Scheduler') || 
              id.includes('/components/scheduling/') || 
              id.includes('/hooks/useScheduling') || 
              id.includes('/hooks/useMultiAccountPublishing')) {
            return 'publishing-chunk';
          }
          
          // Other node_modules go to vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: true,
  },
}));
