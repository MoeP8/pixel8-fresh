import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

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
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('🎉 Main.tsx: App rendered successfully');
  } catch (error) {
    console.error('💥 Main.tsx: Error during app rendering:', error);
    rootElement.innerHTML = `
      <div style="color:red;padding:20px;font-family:system-ui;text-align:center;">
        <h2>⚠️ App Failed to Load</h2>
        <p>Error: ${error.message}</p>
        <button onclick="location.reload()" style="padding:8px 16px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;">Reload Page</button>
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
