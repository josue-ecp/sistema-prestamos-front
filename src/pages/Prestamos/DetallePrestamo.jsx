import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function DetallePrestamo() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      {/* Botón para volver */}
      <button 
        onClick={() => navigate('/prestamos')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
        {/* Encabezado Azul */}
        <div className="bg-[#0b66c2] px-4 sm:px-6 py-3">
          <h2 className="text-white text-sm font-medium">Prestamos - Folio: 181697 - 1470</h2>
        </div>

        {/* Panel de Información Superior - Tamaños normalizados */}
        <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 sm:gap-y-8 gap-x-4 items-center">
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Cliente</p>
            <p className="font-bold text-gray-900 text-sm uppercase">Josue Ceh Pool</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Crédito</p>
            <p className="font-bold text-gray-900 text-sm">$4,000.00</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Abonos</p>
            <p className="font-bold text-gray-900 text-sm">$1,000.00</p>
          </div>
          <div className="sm:col-span-2 md:col-span-1 flex sm:justify-start md:justify-end items-center">
            <button className="w-full sm:w-auto bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 uppercase">
              <Plus size={18} /> Agregar Pago
            </button>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Fecha de creación</p>
            <p className="font-bold text-gray-900 text-sm">02-02-2026 07:34:42</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Atrasos</p>
            <p className="font-bold text-red-600 text-sm">5</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Saldo Pendiente</p>
            <p className="font-bold text-gray-900 text-sm">$3,000.00</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Pagos H/P</p>
            <p className="font-bold text-gray-900 text-sm">9/26</p>
          </div>
        </div>

        {/* Tabla de Pagos */}
        <div className="px-4 sm:px-8 pb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 min-w-[700px]">
              <thead>
                <tr className="bg-[#b8b8b8] text-gray-800 text-xs uppercase tracking-wider">
                  <th className="border border-gray-400 py-3 px-2 font-bold">Fecha</th>
                  <th className="border border-gray-400 py-3 px-2 font-bold">Num. Pago</th>
                  <th className="border border-gray-400 py-3 px-2 font-bold">Monto</th>
                  <th className="border border-gray-400 py-3 px-2 font-bold">Cobratario</th>
                  <th className="border border-gray-400 py-3 px-2 font-bold">Comentarios</th>
                  <th className="border border-gray-400 py-3 px-2 font-bold">Tipo Pago</th>
                  <th className="border border-gray-400 py-3 px-2 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-center text-xs sm:text-sm text-gray-700">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="border border-gray-300 py-3 px-2 whitespace-nowrap">15/Ene/2026</td>
                    <td className="border border-gray-300 py-3 px-2">{item}</td>
                    <td className="border border-gray-300 py-3 px-2 font-medium whitespace-nowrap">$ 200.00</td>
                    <td className="border border-gray-300 py-3 px-2 uppercase text-xs">Roman G.</td>
                    <td className="border border-gray-300 py-3 px-2 italic text-gray-400 text-xs">Todo bien</td>
                    <td className="border border-gray-300 py-3 px-2">
                      <span className="bg-[#2ecc71] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">EFECTIVO</span>
                    </td>
                    <td className="border border-gray-300 py-3 px-2">
                      <div className="flex justify-center">
                        <button className="bg-[#e74c3c] text-white p-1 rounded hover:bg-red-600 transition-colors shadow-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {[...Array(5)].map((_, i) => (
                  <tr key={`empty-${i}`} className="h-10">
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-gray-500 font-medium">
            <p>Mostrando del 1 al 20 de 33</p>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100">Anterior</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded font-bold">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100">2</button>
              <button className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}