import React from 'react';
import { ArrowLeft, CreditCard, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PwaMisPagos() {
  const navigate = useNavigate();

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-2">María González</h1>
        <div className="ml-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          MG
        </div>
      </div>

      {/* Tarjeta de Monto */}
      <div className="bg-blue-700 text-white p-6 rounded-3xl shadow-lg mb-8">
        <p className="text-blue-100 text-sm font-medium mb-1">Monto a pagar</p>
        <h2 className="text-4xl font-bold mb-2">$15.000,00</h2>
        <p className="text-blue-200 text-sm">Cuota 2 de 12</p>
      </div>

      {/* Sección Método de Pago */}
      <h3 className="font-bold text-gray-800 mb-4">Método de pago</h3>
      
      <div className="space-y-4">
        {/* Opción Nueva Tarjeta */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm cursor-pointer hover:border-blue-500 transition-colors">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <PlusCircle size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-800">Nueva Tarjeta</p>
            <p className="text-xs text-gray-400">Ingresa datos de pago</p>
          </div>
        </div>

        {/* Opción Tarjeta guardada */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm cursor-pointer hover:border-blue-500 transition-colors">
          <div className="p-3 bg-gray-100 rounded-xl text-black">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-800">....4532</p>
            <p className="text-xs text-gray-400">Vence 08/27</p>
          </div>
        </div>
      </div>
    </div>
  );
}