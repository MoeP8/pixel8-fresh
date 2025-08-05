console.log('🔄 Main.tsx: Starting imports...');

import React from 'react'
console.log('✅ React imported:', typeof React);

import { createRoot } from 'react-dom/client'
console.log('✅ createRoot imported:', typeof createRoot);

import App from './App.tsx'
console.log('✅ App imported:', typeof App);

import ErrorBoundary from './components/ErrorBoundary.tsx'
console.log('✅ ErrorBoundary imported:', typeof ErrorBoundary);

// Import CSS statically - this works with Vite
import './index.css'
console.log('✅ CSS imported');

console.log('✅ Main.tsx: Script loaded successfully');
console.log('🔍 DEBUG: Current URL:', window.location.href);
console.log('🔍 DEBUG: User agent:', navigator.userAgent);
console.log('🔍 DEBUG: Document ready state:', document.readyState);

// Add global error handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

const initializeApp = () => {
  console.log('🚀 Main.tsx: Starting app initialization');
  console.log('🔍 DEBUG: All window globals:', Object.getOwnPropertyNames(window).filter(name => name.includes('React') || name.includes('react')));
  console.log('🔍 DEBUG: React available:', typeof React !== 'undefined');
  console.log('🔍 DEBUG: createRoot available:', typeof createRoot !== 'undefined');
  
  const rootElement = document.getElementById("root");
  console.log('📍 Main.tsx: Root element:', rootElement ? 'Found' : 'NOT FOUND');
  if (rootElement) {
    console.log('🔍 DEBUG: Root element HTML:', rootElement.innerHTML.substring(0, 200));
  }

  if (!rootElement) {
    console.error('❌ Root element not found!');
    document.body.innerHTML = '<div style="color:red;padding:20px;font-family:system-ui;">Error: Root element not found</div>';
    return;
  }

  try {
    console.log('⚛️ Main.tsx: Creating React root');
    console.log('🔍 DEBUG: About to call createRoot with element:', rootElement);
    const root = createRoot(rootElement);
    console.log('🔍 DEBUG: React root created successfully:', root);
    
    console.log('🎨 Main.tsx: Rendering App component');
    console.log('🔍 DEBUG: App component type:', typeof App);
    console.log('🔍 DEBUG: React.StrictMode available:', typeof React.StrictMode);
    
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
        <App />
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
