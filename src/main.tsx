import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

// Load CSS asynchronously to prevent blocking
const loadCSS = async () => {
  try {
    await import('./index.css')
    console.log('🎨 CSS loaded successfully')
  } catch (error) {
    console.warn('⚠️ CSS failed to load:', error)
  }
}

// Start loading CSS immediately but don't wait for it
loadCSS()

console.log('✅ Main.tsx: Script loaded successfully');

// Add global error handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

const initializeApp = () => {
  console.log('🚀 Main.tsx: Starting app initialization');
  
  const rootElement = document.getElementById("root");
  console.log('📍 Main.tsx: Root element:', rootElement ? 'Found' : 'NOT FOUND');

  if (!rootElement) {
    console.error('❌ Root element not found!');
    document.body.innerHTML = '<div style="color:red;padding:20px;font-family:system-ui;">Error: Root element not found</div>';
    return;
  }

  try {
    console.log('⚛️ Main.tsx: Creating React root');
    const root = createRoot(rootElement);
    
    console.log('🎨 Main.tsx: Rendering App component');
    
    // Wrap in error boundary and add timeout
    const renderTimeout = setTimeout(() => {
      console.error('⏱️ Main.tsx: Render timeout - app took too long to initialize');
      rootElement.innerHTML = `
        <div style="background: linear-gradient(135deg, #1e293b 0%, #dc2626 50%, #7c3aed 100%); color:white; padding:40px; font-family:system-ui; text-align:center; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
          <div>
            <h2 style="font-size: 2em; margin-bottom: 20px;">⚠️ App Initialization Timeout</h2>
            <p style="margin-bottom: 30px; opacity: 0.9;">The application failed to start within 5 seconds.</p>
            <button onclick="location.reload()" style="padding:12px 24px; background:white; color:#1e293b; border:none; border-radius:6px; cursor:pointer; font-size: 16px; font-weight: 600;">🔄 Retry</button>
            <div style="margin-top: 30px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 8px; text-align: left;">
              <p style="margin: 5px 0;"><strong>Possible causes:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Import errors in components</li>
                <li>Async initialization blocking</li>
                <li>Third-party service issues</li>
              </ul>
              <p style="margin-top: 15px; font-size: 0.9em; opacity: 0.8;">Check browser console for details</p>
            </div>
          </div>
        </div>
      `;
    }, 5000);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Clear timeout if render succeeds
    clearTimeout(renderTimeout);
    console.log('🎉 Main.tsx: App rendered successfully');
    
    // Mark app as loaded after a short delay to ensure React has mounted
    setTimeout(() => {
      const rootContent = rootElement.innerHTML;
      if (!rootContent.includes('Loading React application')) {
        console.log('✅ Main.tsx: App fully loaded and replaced loading screen');
      }
    }, 100);
    
  } catch (error) {
    console.error('💥 Main.tsx: Error during app rendering:', error);
    rootElement.innerHTML = `
      <div style="background: linear-gradient(135deg, #1e293b 0%, #dc2626 50%, #7c3aed 100%); color:white; padding:40px; font-family:system-ui; text-align:center; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div>
          <h2 style="font-size: 2em; margin-bottom: 20px;">⚠️ Application Error</h2>
          <p style="margin-bottom: 20px; opacity: 0.9;">Failed to initialize Pixel8 Social Hub</p>
          <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left; font-family: monospace; font-size: 0.9em;">
            ${error.stack || error.message}
          </div>
          <button onclick="location.reload()" style="padding:12px 24px; background:white; color:#1e293b; border:none; border-radius:6px; cursor:pointer; font-size: 16px; font-weight: 600;">🔄 Reload Application</button>
        </div>
      </div>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
