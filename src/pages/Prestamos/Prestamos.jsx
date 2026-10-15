import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Prestamos() {
  const navigate = useNavigate();
  const [prestamos, setPrestamos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar préstamos reales desde la API de Laravel
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await api.get('/prestamos');
        setPrestamos(response.data);
      } catch (error) {
        console.error("Error al cargar los préstamos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  // Filtrar préstamos por cliente o folio
  const prestamosFiltrados = prestamos.filter(p => 
    p.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id_prestamo?.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1500px]">
      <div className="mb-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Cartera de crédito</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Gestión de Préstamos</h1>
        <p className="mt-1 text-sm text-slate-500">Consulta y administra los créditos registrados.</p>
      </div>

      {/* Barra de búsqueda y botón nuevo */}
      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.035)] sm:flex-row sm:items-center sm:p-5">
        <div className="relative w-full sm:max-w-md sm:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            placeholder="Buscar por cliente o folio..."
          />
        </div>

        <button 
          onClick={() => navigate('/prestamos/nuevo')}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-blue-800 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} />
          Nuevo Préstamo
        </button>
      </div>

      {/* Tabla de Préstamos */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="border-b border-slate-200 px-5 py-4">Folio</th>
                <th className="border-b border-slate-200 px-5 py-4 pl-8 text-left sm:pl-12">Cliente</th>
                <th className="border-b border-slate-200 px-5 py-4">Estado</th>
                <th className="border-b border-slate-200 px-5 py-4">Saldo Pendiente</th>
                <th className="border-b border-slate-200 px-5 py-4">Esquema</th>
                <th className="border-b border-slate-200 px-5 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">Cargando préstamos...</td>
                </tr>
              ) : prestamosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">No hay préstamos registrados.</td>
                </tr>
              ) : (
                prestamosFiltrados.map((p) => (
                  <tr key={p.id_prestamo} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/40">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-500">#{p.id_prestamo}</td>
                    <td className="py-4 pl-8 pr-5 text-left font-semibold uppercase text-slate-800 sm:pl-12">
                      {p.cliente ? p.cliente.nombre : 'Cliente sin nombre'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase ${p.estado === 'activo' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">
                      ${Number(p.saldo_pendiente || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4 font-medium capitalize text-slate-600">{p.esquema_cobro}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/prestamos/detalle/${p.id_prestamo}`)}
                        aria-label={`Ver préstamo ${p.id_prestamo}`}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-blue-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Mostrando del 1 al {prestamosFiltrados.length} de {prestamos.length} registros
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}