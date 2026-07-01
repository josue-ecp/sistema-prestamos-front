import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';

export default function PwaRuta() {
  // Datos de prueba basados en tu diseño
  const clientes = [
    { id: 1, nombre: 'María González', direccion: 'Av. Insurgentes 234, Col. Roma Norte', monto: '324,500', retraso: '5 dias de retraso', estado: 'Pendiente' },
    { id: 2, nombre: 'María González', direccion: 'Av. Insurgentes 234, Col. Roma Norte', monto: '324,500', retraso: '5 dias de retraso', estado: 'Pendiente' },
    { id: 3, nombre: 'María González', direccion: 'Av. Insurgentes 234, Col. Roma Norte', monto: '324,500', retraso: '5 dias de retraso', estado: 'Pendiente' },
  ];

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      
      {/* Progreso de Cobranza */}
      <div className="mb-6 mt-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[11px] font-bold text-gray-800 tracking-wide">PROGRESO DE COBRANZA</span>
          <span className="text-[11px] font-bold text-gray-800">0/12</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-gray-300 h-1.5 rounded-full w-[5%]"></div>
        </div>
      </div>

      {/* Título de la sección */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-black">Ruta del dia</h1>
        <p className="text-sm text-gray-500">Clientes Asignados</p>
      </div>

      {/* Lista de Tarjetas */}
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