import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

function RutaManager() {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarRutas, setMostrarRutas] = useState(false);
  const [nombrePasajero, setNombrePasajero] = useState('');
  const [reservas, setReservas] = useState([]);
  const [mostrarReservas, setMostrarReservas] = useState(false);

  const fetchRutas = async () => {
    try {
      const response = await axios.get('/api/rutas');
      setRutas(response.data);
      setMostrarRutas(true);
    } catch (error) {
      alert('Error al obtener rutas. Verifica la conexión.');
    }
  };

  const crearRuta = async () => {
    if (!origen || !destino || !descripcion) {
      alert('Por favor completa todos los campos');
      return;
    }
    try {
      await axios.post('/api/rutas', { origen, destino, descripcion });
      limpiarFormulario();
      fetchRutas();
      alert('Ruta creada exitosamente');
    } catch (error) {
      alert('Error al crear la ruta.');
    }
  };

  const actualizarRuta = async () => {
    if (!rutaSeleccionada) return;
    try {
      await axios.put(`/api/rutas/${rutaSeleccionada.id}`, { origen, destino, descripcion });
      limpiarFormulario();
      setModoEdicion(false);
      fetchRutas();
      alert('Ruta actualizada exitosamente');
    } catch (error) {
      alert('Error al actualizar la ruta.');
    }
  };

  const eliminarRuta = async (id) => {
    try {
      await axios.delete(`/api/rutas/${id}`);
      fetchRutas();
      if (rutaSeleccionada && rutaSeleccionada.id === id) {
        setRutaSeleccionada(null);
      }
      alert('Ruta eliminada exitosamente');
    } catch (error) {
      alert('Error al eliminar la ruta.');
    }
  };

  const reservarRuta = async () => {
    if (!rutaSeleccionada || !nombrePasajero) {
      alert('Selecciona una ruta y escribe el nombre del pasajero');
      return;
    }
    try {
      const reservaData = {
        nombre: nombrePasajero,
        ruta: {
          id: rutaSeleccionada.id
        }
      };
      
      await axios.post(`/api/reservas`, reservaData);
      setNombrePasajero('');
      alert(`Reserva registrada con éxito para ${nombrePasajero} en la ruta ${rutaSeleccionada.origen} → ${rutaSeleccionada.destino}`);
    } catch (error) {
      console.error('Error al registrar la reserva:', error);
      alert('Error al registrar la reserva. Verifica la conexión con el servidor.');
    }
  };

  const verReservasRuta = async () => {
    if (!rutaSeleccionada) {
      alert('Selecciona una ruta primero');
      return;
    }
    try {
      const response = await axios.get(`/api/reservas/ruta/${rutaSeleccionada.id}`);
      setReservas(response.data);
      setMostrarReservas(true);
      console.log('Reservas obtenidas:', response.data);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      if (error.response?.status === 404) {
        alert('Endpoint no encontrado. Asegúrate de haber agregado el método @GetMapping("/ruta/{rutaId}") a tu ReservaController y reiniciado el backend.');
      } else {
        alert('Error al obtener las reservas de esta ruta. Verifica que el backend esté corriendo.');
      }
    }
  };

  const seleccionarParaEditar = (ruta) => {
    setRutaSeleccionada(ruta);
    setOrigen(ruta.origen);
    setDestino(ruta.destino);
    setDescripcion(ruta.descripcion);
    setModoEdicion(true);
  };

  const limpiarFormulario = () => {
    setOrigen('');
    setDestino('');
    setDescripcion('');
    setRutaSeleccionada(null);
  };

  const ocultarRutas = () => {
    setMostrarRutas(false);
    setRutaSeleccionada(null);
    setMostrarReservas(false);
    setReservas([]);
  };

  return (
    <div className="app-container">
      <video autoPlay muted loop id="video-background">
        <source src="https://cdn.pixabay.com/video/2016/10/17/6012-187893760_large.mp4" type="video/mp4" />
      </video>
      <div className="overlay"></div>
      <div className="content">
        <h1 className="text-3xl font-bold text-white mb-4">Gestión de Rutas Interprovinciales</h1>
        <div className="mb-4 flex gap-2">
          <input value={origen} onChange={e => setOrigen(e.target.value)} placeholder="Origen" className="input" />
          <input value={destino} onChange={e => setDestino(e.target.value)} placeholder="Destino" className="input" />
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" className="input" />
          {modoEdicion ? (
            <button onClick={actualizarRuta} className="button-edit">Actualizar Ruta</button>
          ) : (
            <button onClick={crearRuta} className="button-create">Crear Ruta</button>
          )}
          <button onClick={fetchRutas} className="button-create">Ver Rutas</button>
          {mostrarRutas && (
            <button onClick={ocultarRutas} className="button-cancel">Ocultar Rutas</button>
          )}
          {rutaSeleccionada && !modoEdicion && mostrarRutas && (
            <button onClick={() => eliminarRuta(rutaSeleccionada.id)} className="button-delete">Eliminar Ruta Seleccionada</button>
          )}
          {modoEdicion && (
            <button onClick={() => { limpiarFormulario(); setModoEdicion(false); }} className="button-cancel">Cancelar</button>
          )}
        </div>

        {mostrarRutas && rutas.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Rutas Disponibles - Haz clic en una ruta para reservar:</h2>
            <ul className="space-y-3">
              {rutas.map((ruta) => (
                <li key={ruta.id} className={`ruta-item ${rutaSeleccionada?.id === ruta.id ? 'bg-gray-500 bg-opacity-60 border-gray-400' : ''}`}>
                  <div onClick={() => setRutaSeleccionada(ruta)} className="cursor-pointer p-4 rounded-lg hover:bg-gray-200 hover:bg-opacity-50 transition-all duration-200">
                    <div className={`font-semibold text-lg ${rutaSeleccionada?.id === ruta.id ? 'text-white' : 'text-gray-800'}`}>
                      {ruta.origen} ➜ {ruta.destino}
                    </div>
                    <div className={`text-sm mt-1 ${rutaSeleccionada?.id === ruta.id ? 'text-gray-200' : 'text-gray-600'}`}>
                      {ruta.descripcion}
                    </div>
                    {rutaSeleccionada?.id === ruta.id && (
                      <div className="text-sm text-green-300 font-medium mt-2 flex items-center">
                        <span className="mr-2">✓</span>
                        Ruta seleccionada - Ver opciones de reserva abajo
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-3 px-4 pb-2">
                    <button onClick={() => seleccionarParaEditar(ruta)} className="button-edit">Editar</button>
                    <button onClick={() => eliminarRuta(ruta.id)} className="button-delete">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
            
            {!rutaSeleccionada && (
              <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg">
                <p className="text-yellow-800 font-medium text-center">
                  👆 Haz clic en cualquiera de las rutas de arriba para ver las opciones de reserva
                </p>
              </div>
            )}
          </div>
        )}

        {rutaSeleccionada && !modoEdicion && mostrarRutas && (
          <div className="mt-8 p-6 border-2 border-blue-500 rounded-xl bg-white shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">🎫 Reservar Boleto</h2>
            
            {/* Información de la ruta seleccionada */}
            <div className="bg-blue-50 p-5 rounded-lg mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ruta Seleccionada:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <p className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <strong className="text-blue-600">Origen:</strong><br/>
                  <span className="text-lg">{rutaSeleccionada.origen}</span>
                </p>
                <p className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <strong className="text-blue-600">Destino:</strong><br/>
                  <span className="text-lg">{rutaSeleccionada.destino}</span>
                </p>
                <p className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <strong className="text-blue-600">Descripción:</strong><br/>
                  <span className="text-sm">{rutaSeleccionada.descripcion}</span>
                </p>
              </div>
            </div>
            
            {/* Formulario de reserva */}
            <div className="bg-green-50 p-5 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Hacer Reserva:</h3>
              <div className="space-y-4">
                <input 
                  value={nombrePasajero} 
                  onChange={e => setNombrePasajero(e.target.value)} 
                  placeholder="Ingresa tu nombre completo" 
                  className="input w-full text-lg p-4 rounded-lg border-2 border-gray-300 focus:border-green-500" 
                />
                <div className="flex gap-4 justify-center">
                  <button onClick={reservarRuta} className="button-create text-lg px-8 py-4 rounded-lg font-semibold">
                    🎫 Reservar Boleto
                  </button>
                  <button onClick={verReservasRuta} className="button-edit text-lg px-6 py-4 rounded-lg font-semibold">
                    👥 Ver Reservas
                  </button>
                </div>
              </div>
            </div>
            
            {/* Lista de reservas */}
            {mostrarReservas && (
              <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">👥 Pasajeros Registrados:</h3>
                {reservas.length > 0 ? (
                  <div className="space-y-3">
                    {reservas.map((reserva, index) => (
                      <div key={reserva.id || index} className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                        <span className="text-lg">🧑‍💼</span>
                        <span className="ml-3 text-lg font-medium text-gray-800">{reserva.nombre}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-lg text-gray-600 italic">
                      No hay reservas para esta ruta aún.<br/>
                      <span className="text-green-600 font-medium">¡Sé el primero en reservar!</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RutaManager;
