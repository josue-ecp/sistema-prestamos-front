import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Prestamos() {
  // Datos de ejemplo basados en tu captura
  const navigate = useNavigate();
  const prestamos = [
    { id: 1, folio: '181697-1470', cliente: 'Jose Perez Chan', responsable: 'PEDRO', saldo: '$3,400.00', pago: 9 },
    { id: 2, folio: '181697-1470', cliente: 'Jose Perez Chan', responsable: 'PEDRO', saldo: '$3,400.00', pago: 9 },
    { id: 3, folio: '181697-1470', cliente: 'Jose Perez Chan', responsable: 'PEDRO', saldo: '$3,400.00', pago: 9 },
    { id: 4, folio: '181697-1470', cliente: 'Jose Perez Chan', responsable: 'PEDRO', saldo: '$3,400.00', pago: 9 },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa]">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Préstamos</h1>

      {/* Barra de búsqueda y botón nuevo */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-gray-200/70 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar préstamo..."
          />
        </div>

        <button 
          onClick={() => navigate('/prestamos/nuevo')}
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
        <Plus className="h-5 w-5" />
        Nuevo Préstamo
        </button>
      </div>

      {/* Tabla de Préstamos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#e5e5e5] text-gray-700 text-sm">
              <th className="py-4 px-4 font-semibold border-r border-white/50">Folio</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50">Cliente</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50">Co. Responsable</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50">Saldo</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50">Num. pago</th>
              <th className="py-4 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {prestamos.map((p, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-gray-700 font-medium">{p.folio}</td>
                <td className="py-4 px-4 text-gray-900">{p.cliente}</td>
                <td className="py-4 px-4 text-gray-600">{p.responsable}</td>
                <td className="py-4 px-4 text-gray-900 font-semibold">{p.saldo}</td>
                <td className="py-4 px-4 text-gray-700">{p.pago}</td>
                <td className="py-4 px-4">
                  <button 
                onClick={() => navigate(`/prestamos/detalle/${p.id}`)}
                className="bg-[#f39c12] hover:bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded shadow-sm transition-colors uppercase"
              >
                VER DETALLES
              </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}