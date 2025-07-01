import React, { useState } from 'react';
import axios from 'axios';

function RutaManagerMejorado() {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [resultadoApi, setResultadoApi] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Función para obtener duración de Google Maps
  const calcularRuta = async () => {
    if (!origen.trim() || !destino.trim()) {
      alert('⚠️ Por favor ingresa tanto el origen como el destino');
      return;
    }

    setCargando(true);
    try {
      console.log('🗺️ Consultando ruta:', { origen, destino });
      
      // Primero intentemos directamente (sin proxy)
      const urlDirecta = `http://localhost:8082/api/ruta?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`;
      console.log('🔗 URL directa:', urlDirecta);
      
      let response;
      try {
        // Intento 1: Directo
        response = await axios.get(urlDirecta);
        console.log('✅ Respuesta directa exitosa:', response.data);
      } catch (errorDirecto) {
        console.log('❌ Error directo:', errorDirecto.message);
        console.log('🔄 Intentando con proxy...');
        
        // Intento 2: Con proxy
        const urlProxy = `/api2/ruta?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`;
        console.log('🔗 URL proxy:', urlProxy);
        response = await axios.get(urlProxy);
        console.log('✅ Respuesta proxy exitosa:', response.data);
      }
      
      // Extraer información de la respuesta
      const respuestaTexto = response.data;
      const duracionMatch = respuestaTexto.match(/(\d+)\s*horas?\s*y\s*(\d+)\s*minutos?/i);
      const enlaceMatch = respuestaTexto.match(/(https:\/\/www\.google\.com\/maps\/dir\/[^\s]+)/);
      
      setResultadoApi({
        origen: origen,
        destino: destino,
        respuestaCompleta: respuestaTexto,
        duracion: duracionMatch ? `${duracionMatch[1]} horas y ${duracionMatch[2]} minutos` : 'No disponible',
        enlaceGoogleMaps: enlaceMatch ? enlaceMatch[1] : null
      });
      
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      let mensajeError = 'Error: No se pudo obtener la información de la ruta.';
      if (error.response?.status === 404) {
        mensajeError += ' Endpoint no encontrado.';
      } else if (error.response?.status === 500) {
        mensajeError += ' Error interno del servidor.';
      } else if (error.code === 'ERR_NETWORK') {
        mensajeError += ' Problema de conectividad. ¿Está la API corriendo en puerto 8082?';
      } else {
        mensajeError += ` (${error.message})`;
      }
      
      alert(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  const limpiarResultados = () => {
    setResultadoApi(null);
    setOrigen('');
    setDestino('');
  };

  return (
    <>
      {/* Estilos CSS globales */}
      <style>{`
        @keyframes sparkle {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .floating-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        
        /* Scrollbar personalizada */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #764ba2, #667eea);
        }
        
        /* Responsive para móviles */
        @media (max-width: 768px) {
          .mobile-stack {
            grid-template-columns: 1fr !important;
          }
          .mobile-padding {
            padding: 15px !important;
          }
        }
        
        /* Efecto de hover para botones */
        .hover-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        }
        
        /* Efecto glassmorphism */
        .glass-effect {
          backdrop-filter: blur(25px);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        margin: '0',
        padding: '0',
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: 'auto',
        background: `
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
        `,
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 15s ease infinite'
      }}>
        
        {/* Capa de efectos de fondo */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.3,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%), 
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}>
          {/* Partículas animadas */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.1), transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.1), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.1), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.1), transparent),
              radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.1), transparent)
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 100px',
            animation: 'sparkle 20s linear infinite'
          }} />
        </div>

        {/* Contenedor principal */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '20px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          boxSizing: 'border-box'
        }}>
          
          {/* Header Principal Mejorado */}
          <div className="floating-animation glass-effect" style={{
            borderRadius: '30px',
            padding: 'clamp(30px, 5vw, 50px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Efecto de brillo animado */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.03), transparent)',
              animation: 'spin 10s linear infinite',
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 style={{ 
                color: '#ffffff', 
                fontSize: 'clamp(28px, 6vw, 48px)', 
                margin: '0 0 20px 0',
                fontWeight: '800',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                background: 'linear-gradient(45deg, #ffffff, #e3f2fd, #bbdefb)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px'
              }}>
                🗺️ Calculadora de Rutas Inteligente
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.85)', 
                fontSize: 'clamp(16px, 3vw, 22px)',
                margin: '0 0 40px 0',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                ✨ Descubre la duración exacta de tu viaje con tecnología avanzada de Google Maps
              </p>

              {/* Formulario de Entrada Mejorado */}
              <div className="mobile-stack" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
                maxWidth: '900px',
                margin: '0 auto 30px auto'
              }}>
                <input
                  type="text"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  placeholder="🏁 Ciudad de origen (ej: Quito)"
                  style={{
                    padding: '20px 25px',
                    fontSize: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#64b5f6';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                
                <input
                  type="text"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  placeholder="🎯 Ciudad de destino (ej: Guayaquil)"
                  style={{
                    padding: '20px 25px',
                    fontSize: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#81c784';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>

              {/* Botones Mejorados */}
              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                justifyContent: 'center', 
                flexWrap: 'wrap' 
              }}>
                <button 
                  onClick={calcularRuta}
                  disabled={cargando}
                  className="hover-button"
                  style={{
                    background: cargando ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    padding: '20px 40px',
                    borderRadius: '20px',
                    fontSize: 'clamp(16px, 2.5vw, 20px)',
                    cursor: cargando ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    minWidth: '220px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {cargando ? (
                    <span>⏳ Calculando ruta...</span>
                  ) : (
                    <span>🚀 Calcular Ruta</span>
                  )}
                </button>

                {resultadoApi && (
                  <button 
                    onClick={limpiarResultados}
                    className="hover-button"
                    style={{
                      background: 'linear-gradient(45deg, #ff7043, #ff5722)',
                      color: 'white',
                      border: 'none',
                      padding: '20px 40px',
                      borderRadius: '20px',
                      fontSize: 'clamp(16px, 2.5vw, 20px)',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      boxShadow: '0 12px 30px rgba(255, 112, 67, 0.4)',
                      transition: 'all 0.3s ease',
                      minWidth: '220px'
                    }}
                  >
                    🔄 Nueva Consulta
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Resultados Mejorados */}
          {resultadoApi && (
            <div className="glass-effect" style={{
              borderRadius: '30px',
              padding: 'clamp(30px, 5vw, 50px)',
              animation: 'float 4s ease-in-out infinite'
            }}>
              <h2 style={{ 
                color: '#ffffff', 
                textAlign: 'center', 
                marginBottom: '40px',
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 'bold',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                background: 'linear-gradient(45deg, #ffffff, #e8f5e8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                📊 Resultado de tu Consulta
              </h2>

              {/* Información de la Ruta */}
              <div style={{
                background: 'linear-gradient(45deg, rgba(100, 181, 246, 0.15), rgba(156, 39, 176, 0.15))',
                border: '2px solid rgba(100, 181, 246, 0.3)',
                borderRadius: '25px',
                padding: '40px',
                marginBottom: '40px',
                backdropFilter: 'blur(15px)'
              }}>
                <div className="mobile-stack" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '30px', 
                  marginBottom: '30px' 
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: '#64b5f6', margin: '0 0 20px 0', fontSize: 'clamp(18px, 3vw, 24px)' }}>
                      🏁 Origen
                    </h3>
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                      borderRadius: '15px',
                      margin: 0,
                      fontSize: 'clamp(16px, 2.5vw, 20px)',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {resultadoApi.origen}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: '#81c784', margin: '0 0 20px 0', fontSize: 'clamp(18px, 3vw, 24px)' }}>
                      🎯 Destino
                    </h3>
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                      borderRadius: '15px',
                      margin: 0,
                      fontSize: 'clamp(16px, 2.5vw, 20px)',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {resultadoApi.destino}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: '#ffb74d', margin: '0 0 25px 0', fontSize: 'clamp(20px, 3.5vw, 28px)' }}>
                    ⏱️ Duración Estimada
                  </h3>
                  <div className="pulse-animation" style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '30px',
                    borderRadius: '20px',
                    fontSize: 'clamp(22px, 4vw, 32px)',
                    fontWeight: 'bold',
                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
                    textShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    🕐 {resultadoApi.duracion}
                  </div>
                </div>
              </div>

              {/* Mapa de Google Maps Integrado */}
              <div style={{
                background: 'linear-gradient(45deg, rgba(255, 87, 34, 0.15), rgba(255, 112, 67, 0.15))',
                borderRadius: '25px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '40px',
                border: '2px solid rgba(255, 87, 34, 0.3)',
                backdropFilter: 'blur(15px)'
              }}>
                <h3 style={{ color: '#ffab91', margin: '0 0 30px 0', fontSize: 'clamp(20px, 3.5vw, 28px)' }}>
                  🗺️ Mapa Interactivo de la Ruta
                </h3>
                
                {/* Iframe de Google Maps */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '20px',
                  marginBottom: '25px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d995265.0977804684!2d-79.01677685!3d-1.2170534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x0%3A0x0!2s${encodeURIComponent(resultadoApi.origen + ', Ecuador')}!3m2!1d-1.2543449!2d-78.6340637!4m5!1s0x0%3A0x0!2s${encodeURIComponent(resultadoApi.destino + ', Ecuador')}!3m2!1d-0.1806532!2d-78.4678382!5e0!3m2!1sen!2sec!4v1640995200000!5m2!1sen!2sec`}
                    width="100%"
                    height="500"
                    style={{ 
                      border: 'none', 
                      borderRadius: '15px',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                      maxWidth: '100%'
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Ruta de ${resultadoApi.origen} a ${resultadoApi.destino}`}
                  />
                </div>

                {/* Botones adicionales mejorados */}
                <div className="mobile-stack" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                  gap: '20px', 
                  maxWidth: '700px',
                  margin: '0 auto'
                }}>
                  {resultadoApi.enlaceGoogleMaps && (
                    <a
                      href={resultadoApi.enlaceGoogleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-button"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: '#ffab91',
                        padding: '18px 30px',
                        borderRadius: '15px',
                        textDecoration: 'none',
                        fontSize: 'clamp(14px, 2.5vw, 18px)',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                        border: '2px solid rgba(255, 171, 145, 0.3)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🌍 Abrir en Google Maps
                    </a>
                  )}
                  
                  <button
                    onClick={() => {
                      if (resultadoApi.enlaceGoogleMaps) {
                        navigator.clipboard.writeText(resultadoApi.enlaceGoogleMaps);
                        alert('📋 ¡Enlace copiado al portapapeles!');
                      }
                    }}
                    className="hover-button"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      padding: '18px 30px',
                      borderRadius: '15px',
                      fontSize: 'clamp(14px, 2.5vw, 18px)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                    }}
                  >
                    📋 Copiar Enlace
                  </button>
                </div>
                
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  margin: '25px 0 0 0', 
                  fontSize: 'clamp(12px, 2vw, 16px)',
                  fontStyle: 'italic'
                }}>
                  ↑ Navega, haz zoom y explora la ruta completa de forma interactiva
                </p>
              </div>

              {/* Respuesta Completa de la API */}
              <details style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '25px',
                backdropFilter: 'blur(10px)'
              }}>
                <summary style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '20px'
                }}>
                  📝 Ver respuesta completa de la API
                </summary>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '25px',
                  borderRadius: '15px',
                  margin: 0,
                  fontSize: 'clamp(12px, 2vw, 16px)',
                  color: '#e0e0e0',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'auto',
                  lineHeight: '1.5'
                }}>
                  {resultadoApi.respuestaCompleta}
                </pre>
              </details>
            </div>
          )}

          {/* Footer Mejorado */}
          <div style={{
            textAlign: 'center',
            marginTop: '40px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 'clamp(12px, 2vw, 16px)',
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ marginBottom: '15px', fontSize: 'clamp(16px, 3vw, 24px)' }}>
              🔧 ⚡ 🌟
            </div>
            <div>
              Powered by Google Maps API | Diseño Responsive & Moderno
            </div>
            <div style={{ 
              marginTop: '10px', 
              fontSize: 'clamp(10px, 1.5vw, 14px)',
              opacity: '0.7'
            }}>
              Optimizado para todos los dispositivos
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RutaManagerMejorado;
