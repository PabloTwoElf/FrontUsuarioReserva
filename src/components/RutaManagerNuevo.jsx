import React, { useState } from 'react';
import axios from 'axios';

function RutaManagerNuevo() {
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
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      margin: '0',
      padding: '0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: 'auto',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
    }}>
      
      {/* Video de fondo (opcional) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.15,
        background: 'radial-gradient(circle at 30% 70%, rgba(139, 69, 19, 0.1) 0%, transparent 70%), radial-gradient(circle at 70% 30%, rgba(75, 0, 130, 0.1) 0%, transparent 70%)'
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

      {/* Overlay con efecto glassmorphism */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), 
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Contenedor principal con scroll */}
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
        
        {/* Estilos CSS para animaciones */}
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
          }
        `}</style>

        {/* Header Principal Mejorado */}
        <div className="floating-animation" style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(25px)',
          borderRadius: '30px',
          padding: 'clamp(30px, 5vw, 50px)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
              textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.1)',
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

          {/* Formulario de Entrada */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
            maxWidth: '800px',
            margin: '0 auto 30px auto'
          }}>
            <input
              type="text"
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              placeholder="🏁 Ciudad de origen"
              style={{
                padding: '18px 25px',
                fontSize: '16px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#64b5f6';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
            
            <input
              type="text"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="🎯 Ciudad de destino"
              style={{
                padding: '18px 25px',
                fontSize: '16px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#81c784';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          {/* Botones */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center', 
            flexWrap: 'wrap' 
          }}>
            <button 
              onClick={calcularRuta}
              disabled={cargando}
              style={{
                background: cargando ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '18px 35px',
                borderRadius: '15px',
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                cursor: cargando ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => !cargando && (e.target.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {cargando ? '⏳ Calculando...' : '🚀 Calcular Ruta'}
            </button>

            {resultadoApi && (
              <button 
                onClick={limpiarResultados}
                style={{
                  background: 'linear-gradient(45deg, #ff7043, #ff5722)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 35px',
                  borderRadius: '15px',
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(255, 112, 67, 0.4)',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🔄 Nueva Consulta
              </button>
            )}
          </div>
        </div>

        {/* Resultados */}
        {resultadoApi && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              color: '#ffffff', 
              textAlign: 'center', 
              marginBottom: '30px',
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 'bold',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              📊 Resultado de tu Consulta
            </h2>

            {/* Información de la Ruta */}
            <div style={{
              background: 'linear-gradient(45deg, rgba(100, 181, 246, 0.1), rgba(156, 39, 176, 0.1))',
              border: '2px solid rgba(100, 181, 246, 0.3)',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '30px'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '25px', 
                marginBottom: '25px' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: '#64b5f6', margin: '0 0 15px 0', fontSize: 'clamp(18px, 3vw, 24px)' }}>
                    🏁 Origen
                  </h3>
                  <p style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '12px',
                    margin: 0,
                    fontSize: 'clamp(16px, 2.5vw, 20px)',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {resultadoApi.origen}
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: '#81c784', margin: '0 0 15px 0', fontSize: 'clamp(18px, 3vw, 24px)' }}>
                    🎯 Destino
                  </h3>
                  <p style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '12px',
                    margin: 0,
                    fontSize: 'clamp(16px, 2.5vw, 20px)',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {resultadoApi.destino}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#ffb74d', margin: '0 0 20px 0', fontSize: 'clamp(20px, 3.5vw, 28px)' }}>
                  ⏱️ Duración Estimada
                </h3>
                <div style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '25px',
                  borderRadius: '15px',
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  textShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }}>
                  🕐 {resultadoApi.duracion}
                </div>
              </div>
            </div>

            {/* Mapa de Google Maps Integrado */}
            <div style={{
              background: 'linear-gradient(45deg, rgba(255, 87, 34, 0.1), rgba(255, 112, 67, 0.1))',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center',
              marginBottom: '30px',
              border: '2px solid rgba(255, 87, 34, 0.3)'
            }}>
              <h3 style={{ color: '#ffab91', margin: '0 0 25px 0', fontSize: 'clamp(20px, 3.5vw, 26px)' }}>
                🗺️ Mapa Interactivo de la Ruta
              </h3>
              
              {/* Iframe de Google Maps */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '15px',
                marginBottom: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d995265.0977804684!2d-79.01677685!3d-1.2170534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x0%3A0x0!2s${encodeURIComponent(resultadoApi.origen + ', Ecuador')}!3m2!1d-1.2543449!2d-78.6340637!4m5!1s0x0%3A0x0!2s${encodeURIComponent(resultadoApi.destino + ', Ecuador')}!3m2!1d-0.1806532!2d-78.4678382!5e0!3m2!1sen!2sec!4v1640995200000!5m2!1sen!2sec`}
                  width="100%"
                  height="450"
                  style={{ 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    maxWidth: '100%'
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Ruta de ${resultadoApi.origen} a ${resultadoApi.destino}`}
                />
              </div>

              {/* Botones adicionales */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '15px', 
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                {resultadoApi.enlaceGoogleMaps && (
                  <a
                    href={resultadoApi.enlaceGoogleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffab91',
                      padding: '15px 25px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontSize: 'clamp(14px, 2.5vw, 18px)',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
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
                    navigator.clipboard.writeText(resultadoApi.enlaceGoogleMaps);
                    alert('📋 ¡Enlace copiado al portapapeles!');
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    padding: '15px 25px',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 2.5vw, 18px)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📋 Copiar Enlace
                </button>
              </div>
              
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '20px 0 0 0', fontSize: 'clamp(12px, 2vw, 16px)' }}>
                ↑ Navega, haz zoom y explora la ruta completa
              </p>
            </div>

            {/* Respuesta Completa de la API */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h3 style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 20px 0', fontSize: 'clamp(16px, 2.5vw, 20px)' }}>
                📝 Respuesta Completa de la API
              </h3>
              <pre style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '20px',
                borderRadius: '10px',
                margin: 0,
                fontSize: 'clamp(12px, 2vw, 16px)',
                color: '#e0e0e0',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'auto'
              }}>
                {resultadoApi.respuestaCompleta}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 'clamp(12px, 2vw, 16px)',
          padding: '20px'
        }}>
          🔧 Powered by Google Maps API | Responsive Design
        </div>
      </div>
    </div>
  );
}

export default RutaManagerNuevo;