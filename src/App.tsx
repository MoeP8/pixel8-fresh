import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { RealtimeProvider } from "@/components/realtime/RealtimeProvider";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import "./styles/design-system.css";
import "./styles/responsive-enhancements.css";

// Lazy load pages for code splitting
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard").then(m => ({ default: m.Dashboard })));
const DashboardLayout = lazy(() => import("./components/DashboardLayout").then(m => ({ default: m.DashboardLayout })));
const Clients = lazy(() => import("./pages/Clients"));
const BrandHub = lazy(() => import("./pages/BrandHub"));
const ContentStudio = lazy(() => import("./pages/ContentStudio"));
const PublisherPage = lazy(() => import("./pages/publisher/PublisherPage").then(m => ({ default: m.PublisherPage })));
const AssetsPage = lazy(() => import("./pages/assets/AssetsPage").then(m => ({ default: m.AssetsPage })));
const Scheduler = lazy(() => import("./pages/Scheduler"));
const Approvals = lazy(() => import("./pages/Approvals"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Automation = lazy(() => import("./pages/Automation"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DesignSystemShowcase = lazy(() => import("./components/design-system/DesignSystemShowcase").then(m => ({ default: m.DesignSystemShowcase })));

// Loading component for route transitions
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="space-y-4 w-full max-w-md">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2 mt-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <HotToaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
          {/* <Sonner /> */}
          <AuthProvider>
            <RealtimeProvider>
              {children}
            </RealtimeProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

const App = () => (
  <Providers>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* Direct routes without dashboard wrapper */}
          <Route path="/brand-hub" element={<BrandHub />} />
          <Route path="/content-studio" element={<ContentStudio />} />
          <Route path="/publisher" element={<PublisherPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-old" element={<DashboardLayout />}>
            <Route path="clients" element={<Clients />} />
            <Route path="brand-hub" element={<BrandHub />} />
            <Route path="content-studio" element={<ContentStudio />} />
            <Route path="publisher" element={<PublisherPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="scheduler" element={<Scheduler />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="automation" element={<Automation />} />
            <Route path="settings/*" element={<Settings />} />
          </Route>
          <Route path="/design-system" element={<DesignSystemShowcase />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </Providers>
);

export default App;
