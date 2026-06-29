import React from 'react';
import { Search, MapPin, DollarSign } from 'lucide-react';

export default function PwaClientes() {
  // Datos de prueba basados en tu mockup
  const clientes = [
    { id: 1, nombre: 'María González', direccion: 'Av. Insurgentes 234, Col. Roma Norte', monto: '324,500', retraso: '5 dias de retraso', estado: 'Pendiente' },
    { id: 2, nombre: 'María González', direccion: 'Av. Insurgentes 234, Col. Roma Norte', monto: '324,500', retraso: '5 dias de retraso', estado: 'Pendiente' },
    { id: 3, nombre: 'María González', direccion: 'Av. Insurgentes 234, Col. Roma Norte', monto: '324,500', retraso: '5 dias de retraso', estado: 'Pendiente' },
  ];

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      
      {/* Título de la vista */}
      <h1 className="text-3xl font-extrabold text-black mb-4 mt-2">
        Clientes
      </h1>

      {/* Barra de Búsqueda */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          className="w-full pl-11 pr-4 py-3 bg-[#E2E4E9] text-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-gray-500"
          placeholder="Buscar clientes..."
        />
      </div>

      {/* Contador de clientes */}
      <p className="text-xs text-gray-500 mb-4 ml-1">
        12 clientes
      </p>

      {/* Lista de Tarjetas de Clientes */}
      <div className="space-y-4">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            {/* Cabecera de la tarjeta */}
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-bold text-black">{cliente.nombre}</h2>
              <span className="px-3 py-1 bg-[#FDF0C6] text-[#B0891D] text-[10px] font-bold rounded-full">
                {cliente.estado}
              </span>
            </div>

            {/* Dirección */}
            <div className="flex items-start gap-2 text-gray-600 mb-3">
              <MapPin size={16} className="flex-shrink-0 mt-0.5" />
              <span className="text-xs">{cliente.direccion}</span>
            </div>

            {/* Monto */}
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={18} className="text-blue-500 font-bold" />
              <span className="text-lg font-extrabold text-black">${cliente.monto}</span>
            </div>

            {/* Alerta de retraso */}
            <p className="text-[11px] font-bold text-red-600">{cliente.retraso}</p>
          </div>
        ))}
      </div>
    </div>
  );
}