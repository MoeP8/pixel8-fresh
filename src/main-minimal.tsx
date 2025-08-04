// Minimal main.tsx to isolate the blocking import
console.log('🔬 Minimal Main: Starting execution');

// Step-by-step import testing
console.log('🔬 Minimal Main: Step 1 - Basic DOM check');
const rootElement = document.getElementById("root");
console.log('🔬 Root element:', rootElement ? 'Found' : 'NOT FOUND');

if (!rootElement) {
  console.error('❌ Minimal Main: Root element missing');
  document.body.innerHTML = '<div style="color:red;padding:20px;">MINIMAL TEST: Root element not found</div>';
} else {
  console.log('✅ Minimal Main: Root element found, proceeding...');
  
  // Test if we can at least modify the DOM
  rootElement.innerHTML = `
    <div style="background: #0f172a; color: white; padding: 40px; font-family: system-ui; text-align: center; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div>
        <h2 style="color: #10b981; margin-bottom: 20px;">🔬 MINIMAL TEST ACTIVE</h2>
        <p>Testing if main.tsx can execute basic DOM operations...</p>
        <div id="test-results" style="margin-top: 20px; font-family: monospace;"></div>
      </div>
    </div>
  `;
  
  const resultsDiv = document.getElementById('test-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = '<div style="color: #10b981;">✅ DOM manipulation working</div>';
    console.log('✅ Minimal Main: DOM manipulation successful');
    
    // Now test React imports step by step
    setTimeout(async () => {
      console.log('🔬 Minimal Main: Testing React import...');
      try {
        const React = await import('react');
        resultsDiv.innerHTML += '<div style="color: #10b981;">✅ React import successful</div>';
        console.log('✅ Minimal Main: React imported successfully');
        
        console.log('🔬 Minimal Main: Testing React DOM import...');
        const { createRoot } = await import('react-dom/client');
        resultsDiv.innerHTML += '<div style="color: #10b981;">✅ React DOM import successful</div>';
        console.log('✅ Minimal Main: React DOM imported successfully');
        
        console.log('🔬 Minimal Main: Creating React root...');
        const root = createRoot(rootElement);
        resultsDiv.innerHTML += '<div style="color: #10b981;">✅ React root created</div>';
        console.log('✅ Minimal Main: React root created successfully');
        
        console.log('🔬 Minimal Main: Rendering minimal React component...');
        root.render(React.createElement('div', {
          style: {
            background: '#059669',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0'
          }
        }, '🎉 REACT IS WORKING! The issue is in App.tsx or its imports.'));
        
        console.log('✅ Minimal Main: React render successful - problem is in App.tsx!');
        
      } catch (error) {
        console.error('❌ Minimal Main: React import/setup failed:', error);
        if (resultsDiv) {
          resultsDiv.innerHTML += `<div style="color: #dc2626;">❌ React failed: ${error.message}</div>`;
        }
      }
    }, 1000);
  }
}

console.log('🔬 Minimal Main: Script execution complete');