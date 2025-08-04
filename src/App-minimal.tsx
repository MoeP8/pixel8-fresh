import { useState } from "react";

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  
  if (currentPage === 'dashboard') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e293b 0%, #059669 50%, #7c3aed 100%)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        padding: '20px'
      }}>
        <nav style={{ marginBottom: '40px' }}>
          <button onClick={() => setCurrentPage('home')} style={{ 
            color: 'white', 
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>← Back to Home</button>
        </nav>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>📊 Dashboard</h1>
          <p style={{ fontSize: '20px', opacity: 0.9 }}>Welcome to your analytics dashboard!</p>
          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px' }}>
              <h3>Total Posts</h3>
              <p style={{ fontSize: '32px', margin: '10px 0' }}>1,247</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px' }}>
              <h3>Engagement</h3>
              <p style={{ fontSize: '32px', margin: '10px 0' }}>94.2%</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px' }}>
              <h3>Followers</h3>
              <p style={{ fontSize: '32px', margin: '10px 0' }}>45.8K</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Pixel8 Social Hub</h1>
        <button onClick={() => setCurrentPage('dashboard')} style={{ 
          color: 'white', 
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>Dashboard</button>
      </nav>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
          🚀 Social Media Management
        </h2>
        <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '40px' }}>
          Professional-grade platform - Ultra minimal version for testing!
        </p>
        
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Test Navigation:</h3>
          <button onClick={() => setCurrentPage('dashboard')} style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '15px', 
            borderRadius: '8px',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px'
          }}>📊 Go to Dashboard</button>
        </div>
        
        <div style={{ marginTop: '40px', fontSize: '16px', opacity: 0.8 }}>
          ✅ Zero Dependencies<br/>
          ✅ Pure React + useState<br/>
          ✅ No Router, No Imports<br/>
          🔧 Browser Diagnostic Version
        </div>
      </div>
    </div>
  );
};

export default App;