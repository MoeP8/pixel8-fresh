// Static imports - should work with Vite
import React from 'react'
import { createRoot } from 'react-dom/client'

console.log('🧪 STATIC: Starting main-static.tsx with static imports');
console.log('🧪 STATIC: React imported:', !!React);
console.log('🧪 STATIC: createRoot imported:', !!createRoot);

const rootElement = document.getElementById("root");
console.log('🧪 STATIC: Root element found:', !!rootElement);

if (!rootElement) {
  console.error('❌ STATIC: No root element');
  alert('No root element found!');
} else {
  try {
    console.log('🧪 STATIC: Creating React root...');
    const root = createRoot(rootElement);
    console.log('✅ STATIC: React root created successfully');
    
    console.log('🧪 STATIC: Rendering React component...');
    root.render(
      React.createElement('div', {
        style: {
          background: '#059669',
          color: 'white', 
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'system-ui',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, 
      React.createElement('div', {}, 
        React.createElement('h1', { style: { fontSize: '3em', marginBottom: '20px' } }, '🎉 REACT IS WORKING!'),
        React.createElement('p', { style: { fontSize: '1.2em', marginBottom: '20px' } }, 'React initialized successfully with static imports!'),
        React.createElement('p', { style: { fontSize: '16px', opacity: 0.8 } }, 
          'Static imports work correctly. The issue was with dynamic import resolution.')
      ))
    );
    
    console.log('🎉 STATIC: React render complete - SUCCESS!');
    
  } catch (error) {
    console.error('❌ STATIC: React failed:', error);
    alert('React failed: ' + error.message);
    rootElement.innerHTML = `<div style="color:red;padding:20px;font-family:system-ui;">
      <h2>React Static Import Failed</h2>
      <p>Error: ${error.message}</p>
      <pre>${error.stack}</pre>
    </div>`;
  }
}