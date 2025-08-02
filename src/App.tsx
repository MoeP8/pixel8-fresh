import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthProvider } from "./hooks/useAuth";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { RealtimeProvider } from "@/components/realtime/RealtimeProvider";
import { ThemeProvider } from "next-themes";
import "./styles/design-system.css";
import "./styles/responsive-enhancements.css";
import Landing from "./pages/Landing";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { DashboardLayout } from "./components/DashboardLayout";
import Clients from "./pages/Clients";
import BrandHub from "./pages/BrandHub";
import ContentStudio from "./pages/ContentStudio";
import { PublisherPage } from "./pages/publisher/PublisherPage";
import { AssetsPage } from "./pages/assets/AssetsPage";
import Scheduler from "./pages/Scheduler";
import Approvals from "./pages/Approvals";
import Analytics from "./pages/Analytics";
import Campaigns from "./pages/Campaigns";
import Automation from "./pages/Automation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DesignSystemShowcase } from "./components/design-system/DesignSystemShowcase";

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
    </BrowserRouter>
  </Providers>
);

export default App;
