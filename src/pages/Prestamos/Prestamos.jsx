import React from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Prestamos() {
  const navigate = useNavigate();
  
  // Datos de ejemplo estandarizados
  const prestamos = [
    { id: 1, folio: '181697-1470', cliente: 'JOSE PEREZ CHAN', responsable: 'PEDRO', saldo: '$3,400.00', pago: 9 },
    { id: 2, folio: '181697-1470', cliente: 'JOSE PEREZ CHAN', responsable: 'PEDRO', saldo: '$3,400.00', pago: 9 },
    { id: 3, folio: '181697-1470', cliente: 'JOSE PEREZ CHAN', responsable: 'PEDRO', saldo: '$3,400.00', pago: 9 },
    { id: 4, folio: '181697-1470', cliente: 'JOSE PEREZ CHAN', responsable: 'PEDRO', saldo: '$3,400.00', pago: 9 },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Préstamos</h1>

      {/* Barra de búsqueda y botón nuevo */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-gray-200/60 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar préstamo..."
          />
        </div>

        <button 
          onClick={() => navigate('/prestamos/nuevo')}
          className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm uppercase tracking-wide active:scale-95"
        >
          <Plus size={16} />
          Nuevo Préstamo
        </button>
      </div>

      {/* Tabla de Préstamos Estilo PrestaYA! */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-4 border-r border-white/50">Folio</th>
                <th className="py-4 px-4 border-r border-white/50 text-left pl-12">Cliente</th>
                <th className="py-4 px-4 border-r border-white/50">Co. Responsable</th>
                <th className="py-4 px-4 border-r border-white/50">Saldo</th>
                <th className="py-4 px-4 border-r border-white/50">Num. pago</th>
                <th className="py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {prestamos.map((p, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-600 font-medium">{p.folio}</td>
                  <td className="py-4 px-4 text-left pl-12 font-bold text-gray-900 uppercase">{p.cliente}</td>
                  <td className="py-4 px-4 text-gray-600 uppercase">{p.responsable}</td>
                  <td className="py-4 px-4 text-gray-900 font-bold">{p.saldo}</td>
                  <td className="py-4 px-4 text-gray-700 font-medium">{p.pago}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => navigate(`/prestamos/detalle/${p.id}`)}
                      className="bg-[#3b82f6] hover:bg-blue-700 text-white p-2 rounded shadow-sm transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación Estandarizada */}
        <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Mostrando del 1 al {prestamos.length} de {prestamos.length}
          </p>
        </div>
      </div>
    </div>
  );
}