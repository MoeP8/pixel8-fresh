import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

console.log('App-full.tsx: Loading full app component');

// Import working pages - using relative paths (simplified versions)
import Landing from "./pages/Landing-simple";
import Dashboard from "./pages/Dashboard-simple";

console.log('App-full.tsx: Core pages imported successfully');

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%)',
    color: 'white',
    fontFamily: 'system-ui, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }}>
    <div>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>Loading Page...</div>
      <div style={{ fontSize: '14px', opacity: 0.8 }}>Please wait while we load the page</div>
    </div>
  </div>
);

function App() {
  console.log('App-full.tsx: App function rendering');
  
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          
          {/* Fallback route for testing */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #1e293b 0%, #dc2626 50%, #7c3aed 100%)',
              color: 'white',
              fontFamily: 'system-ui, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <div>
                <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>🚧 Page Not Found</h1>
                <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
                  The page you're looking for doesn't exist yet.
                </p>
                <a href="/" style={{ 
                  color: '#60a5fa', 
                  textDecoration: 'underline',
                  fontSize: '18px'
                }}>
                  ← Back to Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

console.log('App-full.tsx: App component defined');

export default App;