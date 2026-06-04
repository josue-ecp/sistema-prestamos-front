import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, Plus, Edit, Trash2, Check } from 'lucide-react';

export default function ZonasAsignadas() {
  const navigate = useNavigate();
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const normalizeZones = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (!payload || typeof payload !== 'object') return [];
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.zonas)) return payload.zonas;
      if (Array.isArray(payload.data?.zonas)) return payload.data.zonas;
      if (Array.isArray(payload.data?.data)) return payload.data.data;
      return [];
    };

    const fetchZonas = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/zonas', { headers });
        const result = await response.json();
        console.log('GET /api/zonas result:', result);

        if (response.ok) {
          const zones = normalizeZones(result);
          setZonas(zones);
          if (zones.length === 0) {
            console.warn('No se encontraron zonas en la respuesta del backend.', result);
          }
        } else {
          console.error('Error al cargar zonas:', result.message || response.statusText, result);
        }
      } catch (error) {
        console.error('Error de conexión al cargar zonas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZonas();
  }, []);

  const getClave = (zona) => zona.clave ?? zona.id_zona ?? zona.id;
  const getDescripcion = (zona) => zona.descripcion || zona.nombre_zona || zona.descripcion_zona || '-';
  const getActivo = (zona) => zona.activo ?? zona.estatus ?? zona.status ?? true;

  const filteredZonas = zonas.filter((zona) =>
    getDescripcion(zona).toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClave(zona).toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta zona?')) return;

    const token = localStorage.getItem('token');
    const headers = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/zonas/${id}`, {
        method: 'DELETE',
        headers
      });
      const result = await response.json();

      if (response.ok && (result.status === undefined || result.status)) {
        setZonas(zonas.filter((zona) => zona.id !== id && zona.id_zona !== id));
      } else {
        showMessage('Error al eliminar zona: ' + (result.message || 'Revisa el backend'), 'error');
      }
    } catch (error) {
      console.error('Error al eliminar zona:', error);
      showMessage('Error de conexión con el servidor.', 'error');
    }
  };

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Zonas Asignadas</h1>

      {/* BARRA SUPERIOR: Buscador y Botón Nueva Zona */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-gray-200/60 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar Zona..."
          />
        </div>

        <button 
          onClick={() => navigate('/zonas/nuevo')}
          className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm uppercase tracking-wide active:scale-95"
        >
          <Plus size={16} />
          Nueva Zona
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 rounded-3xl p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
          <p className="text-sm leading-6">{message.text}</p>
        </div>
      )}

      {/* TABLA DE ZONAS */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              {/* Cambiado a bg-[#e5e5e5] para estandarizar con los demás módulos */}
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-4 border-r border-white/50 w-48">Clave</th>
                <th className="py-4 px-4 border-r border-white/50 text-left pl-12">Descripción de zona</th>
                <th className="py-4 px-4 border-r border-white/50 w-32">Activo</th>
                <th className="py-4 px-4 w-40">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
                {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-gray-400">
                    Cargando zonas...
                  </td>
                </tr>
              ) : filteredZonas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-gray-400">
                    No hay zonas para mostrar.
                  </td>
                </tr>
              ) : filteredZonas.map((zona) => (
                <tr key={zona.id ?? zona.id_zona} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-600 font-medium">
                    {getClave(zona)}
                  </td>
                  <td className="py-4 px-4 text-left pl-12 font-medium text-gray-900 uppercase">
                    {getDescripcion(zona)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      {getActivo(zona) && (
                        <div className="bg-[#2ecc71] rounded-full p-0.5 text-white shadow-sm">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate('/zonas/nuevo')}
                        className="bg-[#f39c12] hover:bg-orange-500 text-white p-1.5 rounded shadow-sm transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(zona.id ?? zona.id_zona)}
                        className="bg-[#e74c3c] hover:bg-red-600 text-white p-1.5 rounded shadow-sm transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Información de paginación */}
        <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Mostrando del 1 al {zonas.length} de {zonas.length}
          </p>
        </div>
      </div>
    </div>
  );
}