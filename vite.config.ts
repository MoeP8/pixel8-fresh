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
    include: ['react', 'react-dom', 'react-router-dom', 'scheduler'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    target: "esnext",
    minify: "esbuild", // Use esbuild with safe settings
    cssMinify: true,
    esbuildOptions: {
      keepNames: true, // Preserve function names for React
      legalComments: 'none',
      pure: ['console.log'], // Remove console.logs in production
    },
    rollupOptions: {
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
