import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Check, User, MapPin } from 'lucide-react';

export default function Clientes() {
  const navigate = useNavigate();

  const clientes = [
    { id: 1, zona: 'ORIENTE', nombre: 'JULIAN PEREZ POOL', ultVisita: '28/Ene/2026 05:38 PM', activo: true },
    { id: 2, zona: 'CENTRO', nombre: 'JOSUE CEH POOL', ultVisita: '28/Ene/2026 05:38 PM', activo: true },
    { id: 3, zona: 'PONIENTE', nombre: 'ADRIAN KEB', ultVisita: '28/Ene/2026 05:38 PM', activo: true },
    { id: 4, zona: 'SUR', nombre: 'MARIO ALEJANDRO PECH BENITEZ', ultVisita: '28/Ene/2026 05:38 PM', activo: true },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
        Gestión de Clientes
      </h1>

      {/* Barra superior de búsqueda y acciones (se apila en pantallas pequeñas, row en md+) */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-gray-200/60 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar cliente..."
          />
        </div>

        <button 
          onClick={() => navigate('/clientes/nuevo')}
          className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all shadow-sm uppercase tracking-wide active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} />
          Nuevo Cliente
        </button>
      </div>

      {/* Tabla con Estilo "Excel" de PrestaYA! */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Contenedor responsivo con scroll horizontal automático */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-3 sm:py-4 px-4 border-r border-white/50 w-28 sm:w-32">Zona</th>
                <th className="py-3 sm:py-4 px-4 border-r border-white/50 w-28 sm:w-32">Registro</th>
                <th className="py-3 sm:py-4 px-4 border-r border-white/50 text-left pl-8 sm:pl-12">Cliente</th>
                <th className="py-3 sm:py-4 px-4 border-r border-white/50">Ult. Visita</th>
                <th className="py-3 sm:py-4 px-4 border-r border-white/50">Activo</th>
                <th className="py-3 sm:py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm text-gray-800">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 sm:py-4 px-4 text-gray-600 font-medium uppercase">{cliente.zona}</td>
                  
                  <td className="py-3 sm:py-4 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="bg-[#2ecc71] rounded-full p-1 text-white shadow-sm" title="Registro de Usuario">
                        <User size={12} strokeWidth={3} />
                      </div>
                      <div className="bg-[#9b2c4a] rounded-full p-1 text-white shadow-sm" title="Ubicación Mapas">
                        <MapPin size={12} strokeWidth={3} />
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-3 sm:py-4 px-4 text-left pl-8 sm:pl-12 font-medium text-gray-900 uppercase">
                    {cliente.nombre}
                  </td>
                  
                  <td className="py-3 sm:py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{cliente.ultVisita}</td>
                  
                  <td className="py-3 sm:py-4 px-4">
                    <div className="flex justify-center">
                      {cliente.activo && (
                        <div className="bg-[#2ecc71] rounded-full p-0.5 text-white shadow-sm">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-3 sm:py-4 px-4">
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

        {/* Paginación Estandarizada */}
        <div className="bg-gray-50 px-4 sm:px-6 py-2.5 sm:py-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Mostrando del 1 al {clientes.length} de {clientes.length}
          </p>
        </div>
      </div>
    </div>
  );
}