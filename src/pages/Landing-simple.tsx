import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%)",
      color: "white",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.2,
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)"
      }}></div>
      
      <div style={{
        position: "relative",
        zIndex: 10,
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px",
        paddingTop: "64px"
      }}>
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "64px"
        }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Pixel8 Social Hub</h1>
          <Link to="/dashboard" style={{
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none"
          }}>Enter Dashboard</Link>
        </nav>
        
        <div style={{
          maxWidth: "1024px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "16px",
              lineHeight: "1.1"
            }}>
              Manage All Your Social Media
              <span style={{
                display: "block",
                background: "linear-gradient(to right, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>In One Powerful Hub</span>
            </h2>
            <p style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.8)",
              maxWidth: "512px",
              margin: "0 auto"
            }}>
              Schedule posts, analyze performance, and collaborate with your team across all major social platforms from a single dashboard.
            </p>
          </div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
            marginBottom: "64px"
          }}>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{
                background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600"
              }}>Get Started →</button>
            </Link>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginTop: "64px"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✨</div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>AI-Powered</h3>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>Smart content suggestions and automated scheduling powered by advanced AI.</p>
            </div>
            
            <div style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Lightning Fast</h3>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>Publish to all platforms instantly with our optimized posting engine.</p>
            </div>
            
            <div style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛡️</div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Enterprise Security</h3>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>Bank-level encryption and compliance with all major data protection standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;