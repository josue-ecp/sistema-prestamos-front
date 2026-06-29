import React from 'react';
import { TrendingUp, DollarSign, CheckCircle2, XCircle } from 'lucide-react';

export default function PwaResumen() {
  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      
      {/* Cabecera */}
      <div className="mb-6 mt-2">
        <h1 className="text-3xl font-extrabold text-black">Resumen del dia</h1>
        <p className="text-sm text-gray-500 mt-1">Miércoles, 4 de febrero de 2026</p>
      </div>

      {/* Tarjeta Principal Azul */}
      <div className="bg-blue-600 text-white p-5 rounded-3xl mb-4 shadow-md shadow-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} />
          <span className="text-sm font-semibold">Tasa de cobranza</span>
        </div>
        <div className="text-[2.5rem] leading-none font-bold mb-2">
          0.0%
        </div>
        <div className="text-xs text-blue-200 font-medium">
          $0 de $44,500
        </div>
      </div>

      {/* Grid de Métricas (2x2) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        
        {/* Tarjeta: Total Cobrado */}
        <div className="bg-[#eaf5eb] border border-[#d4ebd6] p-4 rounded-3xl flex flex-col justify-between aspect-[4/3]">
          <DollarSign size={22} className="text-green-600 mb-2" />
          <div>
            <div className="text-2xl font-bold text-black leading-tight">$0</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Total Cobrado</div>
          </div>
        </div>

        {/* Tarjeta: Clientes Visitados */}
        <div className="bg-[#eef3fb] border border-[#dbe6f7] p-4 rounded-3xl flex flex-col justify-between aspect-[4/3]">
          <CheckCircle2 size={22} className="text-blue-600 mb-2" />
          <div>
            <div className="text-2xl font-bold text-black leading-tight">0/12</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Clientes Visitados</div>
          </div>
        </div>

        {/* Tarjeta: Pagos Exitosos */}
        <div className="bg-[#eaf5eb] border border-[#d4ebd6] p-4 rounded-3xl flex flex-col justify-between aspect-[4/3]">
          <CheckCircle2 size={22} className="text-green-600 mb-2" />
          <div>
            <div className="text-2xl font-bold text-black leading-tight">0</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Pagos Exitosos</div>
          </div>
        </div>

        {/* Tarjeta: Sin Pago */}
        <div className="bg-[#fcedeb] border border-[#f5d5d0] p-4 rounded-3xl flex flex-col justify-between aspect-[4/3]">
          <XCircle size={22} className="text-red-500 mb-2" />
          <div>
            <div className="text-2xl font-bold text-black leading-tight">0</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Sin Pago</div>
          </div>
        </div>

      </div>

      {/* Actividad Reciente */}
      <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm mb-4">
        <h2 className="text-sm font-bold text-black mb-8">Actividad Reciente</h2>
        <div className="text-center text-gray-400 text-xs pb-6">
          No hay actividad aún
        </div>
      </div>

    </div>
  );
}