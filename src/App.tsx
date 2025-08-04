import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

console.log('App.tsx: Loading app component');

// Restore all imports now that we know CSS was the issue
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import BrandHub from "@/pages/BrandHub";
import ContentStudio from "@/pages/ContentStudio";
import Analytics from "@/pages/Analytics";
import Campaigns from "@/pages/Campaigns";
import Settings from "@/pages/Settings";
import DesignSystem from "@/pages/DesignSystem";

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
