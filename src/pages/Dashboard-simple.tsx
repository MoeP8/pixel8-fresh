import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #059669 50%, #7c3aed 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <nav style={{ marginBottom: '40px' }}>
        <Link to="/" style={{ 
          color: 'white', 
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '8px 16px',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block'
        }}>← Back to Home</Link>
      </nav>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>📊 Dashboard</h1>
        <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '40px' }}>
          Welcome to your analytics dashboard!
        </p>
        
        <div style={{ 
          marginTop: '40px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          maxWidth: '1200px',
          margin: '40px auto'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>📈 Total Posts</h3>
            <p style={{ fontSize: '36px', margin: '10px 0', fontWeight: 'bold' }}>1,247</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>↗️ +12% this month</p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>💡 Engagement</h3>
            <p style={{ fontSize: '36px', margin: '10px 0', fontWeight: 'bold' }}>94.2%</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>↗️ +8% this week</p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>👥 Followers</h3>
            <p style={{ fontSize: '36px', margin: '10px 0', fontWeight: 'bold' }}>45.8K</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>↗️ +2.1K this month</p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>🎯 Campaigns</h3>
            <p style={{ fontSize: '36px', margin: '10px 0', fontWeight: 'bold' }}>12</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>3 active, 9 completed</p>
          </div>
        </div>

        <div style={{ 
          marginTop: '60px',
          background: 'rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          maxWidth: '800px',
          margin: '60px auto'
        }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>🚀 Pixel8 Social Hub</h2>
          <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>
            Professional social media management platform
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📱</div>
              <h4>Multi-Platform</h4>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>Manage all your social accounts</p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
              <h4>Analytics</h4>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>Track performance metrics</p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚡</div>
              <h4>Automation</h4>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>Schedule and automate posts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;