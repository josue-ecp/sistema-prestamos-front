import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Renovaciones() {
  const navigate = useNavigate();

  const renovaciones = [
    { id: 1, fecha: '02/Feb/2026', folio: '234799-11567', cliente: 'ADRIAN KEB', zona: 'ORIENTE', prestamo: '$ 3,000.00' },
    { id: 2, fecha: '02/Feb/2026', folio: '234799-11567', cliente: 'ADRIAN KEB', zona: 'ORIENTE', prestamo: '$ 3,000.00' },
    { id: 3, fecha: '02/Feb/2026', folio: '234799-11567', cliente: 'ADRIAN KEB', zona: 'ORIENTE', prestamo: '$ 3,000.00' },
    { id: 4, fecha: '02/Feb/2026', folio: '234799-11567', cliente: 'ADRIAN KEB', zona: 'ORIENTE', prestamo: '$ 3,000.00' },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Renovaciones de créditos</h1>

      {/* Barra de búsqueda estandarizada */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-gray-200/60 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar renovación..."
          />
        </div>
      </div>

      {/* Tabla de Renovaciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
              <th className="py-4 px-4 border-r border-white/50">Fecha</th>
              <th className="py-4 px-4 border-r border-white/50">Folio</th>
              <th className="py-4 px-4 border-r border-white/50">Cliente</th>
              <th className="py-4 px-4 border-r border-white/50">Zona</th>
              <th className="py-4 px-4 border-r border-white/50">Préstamo</th>
              <th className="py-4 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {renovaciones.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-gray-600">{item.fecha}</td>
                <td className="py-4 px-4 font-medium text-gray-700">{item.folio}</td>
                <td className="py-4 px-4 font-bold text-gray-900 uppercase">{item.cliente}</td>
                <td className="py-4 px-4 text-gray-600">{item.zona}</td>
                <td className="py-4 px-4 font-bold text-gray-900">{item.prestamo}</td>
                <td className="py-4 px-4">
                  <button 
  onClick={() => navigate(`/renovaciones/detalle/${item.id}`)}
  className="bg-[#f39c12] hover:bg-orange-500 text-white text-[10px] font-bold px-4 py-1.5 rounded shadow-sm transition-colors uppercase tracking-wider"
>
  VER DETALLES
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación Estandarizada */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-100">
          <p className="text-[11px] text-gray-500 font-bold uppercase">
            Mostrando del 1 al {renovaciones.length} de {renovaciones.length}
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 text-xs font-bold text-gray-600">
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold shadow-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 text-xs font-bold text-gray-600">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}