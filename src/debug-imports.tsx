// Minimal import chain test to isolate blocking dependency
console.log('🧪 Debug: Starting import analysis');

// Test 1: Core React imports
try {
  console.log('🧪 Debug: Testing React imports...');
  import('react').then(() => {
    console.log('✅ Debug: React imported successfully');
  }).catch(e => {
    console.error('❌ Debug: React import failed:', e);
  });
} catch (e) {
  console.error('❌ Debug: React import threw:', e);
}

// Test 2: React DOM imports
try {
  console.log('🧪 Debug: Testing React DOM imports...');
  import('react-dom/client').then(() => {
    console.log('✅ Debug: React DOM imported successfully');
  }).catch(e => {
    console.error('❌ Debug: React DOM import failed:', e);
  });
} catch (e) {
  console.error('❌ Debug: React DOM import threw:', e);
}

// Test 3: App component imports
try {
  console.log('🧪 Debug: Testing App component import...');
  import('./App.tsx').then(() => {
    console.log('✅ Debug: App component imported successfully');
  }).catch(e => {
    console.error('❌ Debug: App component import failed:', e);
  });
} catch (e) {
  console.error('❌ Debug: App component import threw:', e);
}

// Test 4: CSS imports
try {
  console.log('🧪 Debug: Testing CSS import...');
  import('./index.css').then(() => {
    console.log('✅ Debug: CSS imported successfully');
  }).catch(e => {
    console.error('❌ Debug: CSS import failed:', e);
  });
} catch (e) {
  console.error('❌ Debug: CSS import threw:', e);
}

// Test 5: Error Boundary
try {
  console.log('🧪 Debug: Testing ErrorBoundary import...');
  import('./components/ErrorBoundary.tsx').then(() => {
    console.log('✅ Debug: ErrorBoundary imported successfully');
  }).catch(e => {
    console.error('❌ Debug: ErrorBoundary import failed:', e);
  });
} catch (e) {
  console.error('❌ Debug: ErrorBoundary import threw:', e);
}

console.log('🧪 Debug: Import test setup complete');