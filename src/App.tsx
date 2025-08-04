import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

console.log('App.tsx: Loading app component');

// Add debug for imports
console.log('App.tsx: Starting imports...');

import Landing from "@/pages/Landing";
console.log('App.tsx: Landing imported');

import Dashboard from "@/pages/Dashboard";
console.log('App.tsx: Dashboard imported');

import BrandHub from "@/pages/BrandHub";
console.log('App.tsx: BrandHub imported');

import ContentStudio from "@/pages/ContentStudio";
console.log('App.tsx: ContentStudio imported');

import Analytics from "@/pages/Analytics";
console.log('App.tsx: Analytics imported');

import Campaigns from "@/pages/Campaigns";
console.log('App.tsx: Campaigns imported');

import Settings from "@/pages/Settings";
console.log('App.tsx: Settings imported');

import DesignSystem from "@/pages/DesignSystem";
console.log('App.tsx: DesignSystem imported');

import Automation from "@/pages/Automation";
console.log('App.tsx: Automation imported');

import Accounts from "@/pages/Accounts";
console.log('App.tsx: Accounts imported');

import AdsManager from "@/pages/AdsManager";
console.log('App.tsx: AdsManager imported');

import Approvals from "@/pages/Approvals";
console.log('App.tsx: Approvals imported');

import Calendar from "@/pages/Calendar";
console.log('App.tsx: Calendar imported');

import Clients from "@/pages/Clients";
console.log('App.tsx: Clients imported');

import Posts from "@/pages/Posts";
console.log('App.tsx: Posts imported');

import Scheduler from "@/pages/Scheduler";
console.log('App.tsx: Scheduler imported');

import { AssetsPage } from "@/pages/assets/AssetsPage";
console.log('App.tsx: AssetsPage imported');

import { PublisherPage } from "@/pages/publisher/PublisherPage";
console.log('App.tsx: PublisherPage imported');

import { TeamPage } from "@/pages/team/TeamPage";
console.log('App.tsx: TeamPage imported');

console.log('App.tsx: ✅ All imports completed');

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
      <h2>Loading Pixel8 Social Hub...</h2>
      <p style={{ opacity: 0.8 }}>Loading advanced features</p>
    </div>
  </div>
);

// Simple error fallback
const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #1e293b 0%, #dc2626 50%, #7c3aed 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <div style={{ textAlign: 'center', maxWidth: '500px', padding: '20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
      <h2>Something went wrong</h2>
      <p style={{ opacity: 0.8, margin: '20px 0' }}>
        The app encountered an error. Please refresh the page.
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Refresh Page
      </button>
      <details style={{ marginTop: '20px', textAlign: 'left' }}>
        <summary style={{ cursor: 'pointer', opacity: 0.7 }}>Error Details</summary>
        <pre style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '10px', 
          borderRadius: '4px', 
          fontSize: '12px',
          marginTop: '10px',
          overflowX: 'auto'
        }}>
          {error.toString()}
        </pre>
      </details>
    </div>
  </div>
);

const App = () => {
  console.log('🎯 App.tsx: App component rendering');
  
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-700 to-purple-600">
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/brand-hub" element={<BrandHub />} />
              <Route path="/content-studio" element={<ContentStudio />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/design-system" element={<DesignSystem />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/ads-manager" element={<AdsManager />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/publisher" element={<PublisherPage />} />
              <Route path="/team" element={<TeamPage />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    );
  } catch (error) {
    console.error('💥 App.tsx: Error caught:', error);
    return <ErrorFallback error={error as Error} />;
  }
};

export default App;
