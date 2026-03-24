import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, Plus, Edit, Trash2, Check } from 'lucide-react';

export default function ZonasAsignadas() {
  const navigate = useNavigate();
  const zonas = [
    { id: 1, clave: '152', descripcion: 'ZONA NORTE', activo: true },
    { id: 2, clave: '152', descripcion: 'ORIENTE', activo: true },
    { id: 3, clave: '152', descripcion: 'PONIENTE', activo: true },
    { id: 4, clave: '152', descripcion: 'SUR', activo: true },
  ];

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
              {zonas.map((zona) => (
                <tr key={zona.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-600 font-medium">
                    {zona.clave}
                  </td>
                  <td className="py-4 px-4 text-left pl-12 font-medium text-gray-900 uppercase">
                    {zona.descripcion}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      {zona.activo && (
                        <div className="bg-[#2ecc71] rounded-full p-0.5 text-white shadow-sm">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="bg-[#f39c12] hover:bg-orange-500 text-white p-1.5 rounded shadow-sm transition-colors">
                        <Edit size={14} />
                      </button>
                      <button className="bg-[#e74c3c] hover:bg-red-600 text-white p-1.5 rounded shadow-sm transition-colors">
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