// Minimal React test - step by step
console.log('🧪 SIMPLE: Starting main-simple.tsx');

// Test 1: Check DOM
const rootElement = document.getElementById("root");
console.log('🧪 SIMPLE: Root element found:', !!rootElement);

if (!rootElement) {
  console.error('❌ SIMPLE: No root element');
  alert('No root element found!');
} else {
  console.log('🧪 SIMPLE: Importing React...');
  
  // Test 2: Import React
  import('react').then((React) => {
    console.log('✅ SIMPLE: React imported successfully');
    
    // Test 3: Import React DOM
    return import('react-dom/client');
  }).then(({ createRoot }) => {
    console.log('✅ SIMPLE: React DOM imported successfully');
    
    // Test 4: Create React root
    const root = createRoot(rootElement);
    console.log('✅ SIMPLE: React root created');
    
    // Test 5: Render simple component
    root.render(React.createElement('div', {
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
    }, React.createElement('div', {}, 
      React.createElement('h1', {}, '🎉 REACT IS WORKING!'),
      React.createElement('p', {}, 'React initialized successfully!'),
      React.createElement('p', { style: { marginTop: '20px', fontSize: '14px', opacity: 0.8 } }, 
        'The issue was with dynamic imports in browser context.')
    )));
    
    console.log('🎉 SIMPLE: React render complete!');
    
  }).catch(error => {
    console.error('❌ SIMPLE: Failed:', error);
    alert('React failed to load: ' + error.message);
    rootElement.innerHTML = '<div style="color:red;padding:20px;">React failed: ' + error.message + '</div>';
  });
}