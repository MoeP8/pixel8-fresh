// Ultra-minimal test to isolate import failures
console.log('🧪 TEST: main-test.tsx executing');

// Test 1: Basic DOM manipulation
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.innerHTML = '<div style="background:#059669;color:white;padding:20px;text-align:center;font-family:system-ui;"><h2>🧪 MAIN-TEST ACTIVE</h2><p>Basic execution working, testing imports...</p><div id="import-results"></div></div>';
}

const logResult = (message: string, success: boolean) => {
  console.log(message);
  const resultsDiv = document.getElementById('import-results');
  if (resultsDiv) {
    resultsDiv.innerHTML += `<div style="color: ${success ? '#10b981' : '#ef4444'};">${message}</div>`;
  }
};

// Test 2: React import
logResult('🧪 Testing React import...', true);
import('react').then(() => {
  logResult('✅ React import successful', true);
  
  // Test 3: React DOM import  
  return import('react-dom/client');
}).then(() => {
  logResult('✅ React DOM import successful', true);
  
  // Test 4: CSS import
  return import('./index.css');
}).then(() => {
  logResult('✅ CSS import successful', true);
  
  // Test 5: App component import (most likely to fail)
  return import('./App.tsx');
}).then(() => {
  logResult('✅ App component import successful', true);
  logResult('🎉 ALL IMPORTS WORKING - Issue is in App component execution', true);
}).catch((error) => {
  logResult(`❌ Import failed: ${error.message}`, false);
  logResult(`📍 Error stack: ${error.stack?.split('\n')[0] || 'No stack trace'}`, false);
});

console.log('🧪 TEST: main-test.tsx setup complete');