import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowLeft } from 'lucide-react';
import api from '../../api';

// Configuración de icono para el mapa
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) { 
      setPosition(e.latlng); 
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

export default function AgregarZona() {
  const navigate = useNavigate();
  // Coordenadas iniciales centradas en la región (puedes ajustarlas según prefieras)
  const [position, setPosition] = useState({ lat: 20.9674, lng: -89.6236 });
  const [descripcion, setDescripcion] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  // Lista de clientes estática de referencia visual
  const clientes = ["Josue Ceh Pool", "Adrián Keb", "Mario Pech"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      showMessage('Ingresa la descripción o nombre de la zona.', 'error');
      return;
    }

    setSaving(true);
    // Objeto adaptado 100% a las columnas requeridas por tu tabla de BD y controlador
    const payload = {
      nombre_zona: descripcion,
      descripcion: descripcion,
      latitud: position.lat,
      longitud: position.lng,
      estado: 'activo'
    };

    try {
      const response = await api.post('/zonas', payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        validateStatus: () => true
      });

      const result = response.data;
      
      if (response.status >= 200 && response.status < 300 && (result.status === undefined || result.status)) {
        showMessage(result.message || 'Zona creada correctamente.', 'success');
        window.setTimeout(() => navigate('/zonas'), 900);
      } else {
        showMessage('Error al guardar zona: ' + (result.message || 'Verifica los datos.'), 'error');
      }
    } catch (error) {
      console.error('Error al guardar zona:', error);
      showMessage('Error de conexión con el backend.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      
      {/* Botón Volver Estandarizado */}
      <button 
        type="button"
        onClick={() => navigate('/zonas')}
        className="mb-5 flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
        
        {/* Mensajes de Alerta */}
        {message.text && (
          <div className={`mx-5 mt-5 rounded-xl border p-4 sm:mx-8 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
            <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
            <p className="text-sm leading-6">{message.text}</p>
          </div>
        )}

        {/* Encabezado Azul */}
        <div className="bg-blue-900 px-6 py-5">
          <h2 className="text-lg font-bold tracking-tight text-white">Agregar Nueva Zona</h2>
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            
            {/* Columna Izquierda: Tabla de Clientes */}
            <div className="w-full lg:w-1/3">
              <table className="w-full overflow-hidden rounded-xl border-collapse border border-slate-200 text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Cliente</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente, index) => (
                    <tr key={index}>
                      <td className="border border-slate-100 px-4 py-3 font-medium text-slate-700">{cliente}</td>
                    </tr>
                  ))}
                  {/* Fila de paginación interna */}
                  <tr className="bg-slate-50">
                    <td className="border border-slate-100 px-4 py-2 text-[10px] font-bold uppercase text-slate-400">
                      Mostrando del 1 al {clientes.length} de {clientes.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Columna Derecha: Mapa y Formulario */}
            <div className="flex-1 space-y-6">
              <div className="relative h-[350px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                <MapContainer center={[20.9674, -89.6236]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Descripción de la zona</label>
                  <input 
                    type="text" 
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ingresa el nombre de la zona" 
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Barra de Acciones Inferior Estandarizada */}
                <div className="mt-8 flex flex-col-reverse justify-start gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="cursor-pointer rounded-xl bg-blue-800 px-8 py-3 text-xs font-bold uppercase text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Aceptar'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => navigate('/zonas')}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-8 py-3 text-xs font-bold uppercase text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}