// Inline non-module script test
console.log('🔥 INLINE: Inline script executing!');

setTimeout(() => {
  console.log('🔥 INLINE: Timeout triggered');
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    console.log('🔥 INLINE: Root found, replacing content');
    rootElement.innerHTML = `
      <div style="background: #ff0000; color: white; padding: 40px; text-align: center; font-family: monospace;">
        <h1>🔥 INLINE SCRIPT SUCCESS!</h1>
        <p>This is a regular JavaScript file (not a module)</p>
        <p>If you see this, basic JS works but modules might be blocked</p>
      </div>
    `;
  }
}, 1000);