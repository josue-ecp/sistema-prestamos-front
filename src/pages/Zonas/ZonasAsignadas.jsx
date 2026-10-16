import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, Plus, Edit, Trash2, Check } from 'lucide-react';
import api from '../../api';

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
        const response = await api.get('/zonas', {
          headers: { Accept: 'application/json' },
          validateStatus: () => true
        });
        const result = response.data;
        console.log('GET /api/zonas result:', result);

        if (response.status >= 200 && response.status < 300) {
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

    try {
      const response = await api.delete(`/zonas/${id}`, {
        headers: { Accept: 'application/json' },
        validateStatus: () => true
      });
      const result = response.data;

      if (response.status >= 200 && response.status < 300 && (result.status === undefined || result.status)) {
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
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mb-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Administración</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Zonas Asignadas</h1>
        <p className="mt-1 text-sm text-slate-500">Consulta y administra las zonas de operación.</p>
      </div>

      {/* BARRA SUPERIOR: Buscador y Botón Nueva Zona */}
      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-700 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            placeholder="Buscar Zona..."
          />
        </div>

        <button 
          onClick={() => navigate('/zonas/nuevo')}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]"
        >
          <Plus size={16} />
          Nueva Zona
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 rounded-xl border p-4 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
          <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
          <p className="text-sm leading-6">{message.text}</p>
        </div>
      )}

      {/* TABLA DE ZONAS */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="w-48 border-b border-slate-200 px-5 py-4">Clave</th>
                <th className="border-b border-slate-200 px-5 py-4 pl-8 text-left sm:pl-12">Descripción de zona</th>
                <th className="w-32 border-b border-slate-200 px-5 py-4">Activo</th>
                <th className="w-40 border-b border-slate-200 px-5 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
                {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-slate-400">
                    Cargando zonas...
                  </td>
                </tr>
              ) : filteredZonas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-slate-400">
                    No hay zonas para mostrar.
                  </td>
                </tr>
              ) : filteredZonas.map((zona) => (
                <tr key={zona.id ?? zona.id_zona} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/40">
                  <td className="px-5 py-4 font-semibold text-slate-500">
                    {getClave(zona)}
                  </td>
                  <td className="py-4 pl-8 pr-5 text-left font-semibold uppercase text-slate-800 sm:pl-12">
                    {getDescripcion(zona)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      {getActivo(zona) && (
                        <div className="rounded-full bg-blue-100 p-1 text-blue-700">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate('/zonas/nuevo')}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-blue-800 shadow-sm transition hover:bg-blue-50"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(zona.id ?? zona.id_zona)}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
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
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Mostrando del 1 al {zonas.length} de {zonas.length}
          </p>
        </div>
      </div>
    </div>
  );
}