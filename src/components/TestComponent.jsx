import React from 'react';

function TestComponent() {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>🚨 TEST - ¿PUEDES VER ESTO?</h1>
      <p style={{ fontSize: '24px', color: 'blue' }}>Si ves este mensaje, React está funcionando</p>
      <button style={{ padding: '20px', fontSize: '20px', background: 'green', color: 'white' }}>
        BOTÓN DE PRUEBA
      </button>
    </div>
  );
}

export default TestComponent;
