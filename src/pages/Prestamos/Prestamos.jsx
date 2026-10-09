import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Prestamos() {
  const navigate = useNavigate();
  const [prestamos, setPrestamos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar préstamos reales desde la API de Laravel
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/prestamos', {
          headers: { Authorization: `Bearer ${token}` }
        });
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
    <div className="p-4 sm:p-6 lg:p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
        Gestión de Préstamos
      </h1>

      {/* Barra de búsqueda y botón nuevo */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-gray-200/60 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar por cliente o folio..."
          />
        </div>

        <button 
          onClick={() => navigate('/prestamos/nuevo')}
          className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all shadow-sm uppercase tracking-wide active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <Plus size={16} />
          Nuevo Préstamo
        </button>
      </div>

      {/* Tabla de Préstamos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-3 sm:py-4 px-4 border-r border-white/50">Folio</th>
                <th className="py-3 sm:py-4 px-4 border-r border-white/50 text-left pl-8 sm:pl-12">Cliente</th>
                <th className="py-3 sm:py-4 px-4 border-r border-white/50">Estado</th>
                <th className="py-3 sm:py-4 px-4 border-r border-white/50">Saldo Pendiente</th>
                <th className="py-3 sm:py-4 px-4 border-r border-white/50">Esquema</th>
                <th className="py-3 sm:py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-gray-500 text-center">Cargando préstamos...</td>
                </tr>
              ) : prestamosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-gray-500 text-center">No hay préstamos registrados.</td>
                </tr>
              ) : (
                prestamosFiltrados.map((p) => (
                  <tr key={p.id_prestamo} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 sm:py-4 px-4 text-gray-600 font-medium whitespace-nowrap">#{p.id_prestamo}</td>
                    <td className="py-3 sm:py-4 px-4 text-left pl-8 sm:pl-12 font-bold text-gray-900 uppercase">
                      {p.cliente ? p.cliente.nombre : 'Cliente sin nombre'}
                    </td>
                    <td className="py-3 sm:py-4 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.estado === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-4 text-gray-900 font-bold whitespace-nowrap">
                      ${Number(p.saldo_pendiente || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 sm:py-4 px-4 text-gray-700 font-medium capitalize">{p.esquema_cobro}</td>
                    <td className="py-3 sm:py-4 px-4">
                      <button
                        onClick={() => navigate(`/prestamos/detalle/${p.id_prestamo}`)}
                        className="bg-[#3b82f6] hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded shadow-sm transition-colors cursor-pointer"
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

        <div className="bg-gray-50 px-4 sm:px-6 py-2.5 sm:py-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Mostrando del 1 al {prestamosFiltrados.length} de {prestamos.length} registros
          </p>
        </div>
      </div>
    </div>
  );
}