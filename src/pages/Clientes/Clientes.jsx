import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Check, User, MapPin } from 'lucide-react';

export default function Clientes() {
  const navigate = useNavigate();

  const clientes = [
    { id: 1, zona: 'Oriente', nombre: 'Julian Perez Pool', ultVisita: '28/Ene/2026 05:38 PM', activo: true },
    { id: 2, zona: 'Centro', nombre: 'Josue Ceh Pool', ultVisita: '28/Ene/2026 05:38 PM', activo: true },
    { id: 3, zona: 'Poniente', nombre: 'Adrian Keb', ultVisita: '28/Ene/2026 05:38 PM', activo: true },
    { id: 4, zona: 'Sur', nombre: 'Mario Alejandro Pech Benitez', ultVisita: '28/Ene/2026 05:38 PM', activo: true },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Clientes</h1>

      {/* Buscador y Botón Nuevo */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-gray-200/70 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar cliente..."
          />
        </div>

        <button 
          onClick={() => navigate('/clientes/nuevo')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Nuevo Cliente
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-200/70 text-gray-700 text-sm">
              <th className="py-4 px-4 font-semibold border-r border-white/50 w-32">Zona</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50 w-32">Registro</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50 text-left pl-8">Cliente</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50">Ult. Visita</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50">Activo</th>
              <th className="py-4 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                
                <td className="py-4 px-4">{cliente.zona}</td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="bg-green-500 rounded-full p-1 text-white shadow-sm">
                      <User className="h-3 w-3" strokeWidth={3} />
                    </div>
                    <div className="bg-[#9b2c4a] rounded-full p-1 text-white shadow-sm">
                      <MapPin className="h-3 w-3" strokeWidth={3} />
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4 text-left pl-8 font-medium text-gray-900">
                  {cliente.nombre}
                </td>
                
                <td className="py-4 px-4 text-gray-700">{cliente.ultVisita}</td>
                
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    {cliente.activo && (
                      <div className="bg-green-500 rounded-full p-1 text-white shadow-sm">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded shadow-sm transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded shadow-sm transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

    </div>
  );
}