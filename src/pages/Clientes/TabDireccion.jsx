import React from 'react';
import { Search, Clock } from 'lucide-react';

export default function TabDireccion() {
  return (
    <div className="px-4 sm:px-8 pb-8 sm:pb-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-in fade-in duration-300">
      
      {/* Columna Izquierda */}
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Calle</label>
          <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Número Interior</label>
          <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Número Exterior</label>
          <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Cruzamientos</label>
          <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Referencias del lugar</label>
          <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Colonia</label>
          <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Ciudad</label>
          <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Estado</label>
          <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        
        {/* Código Postal */}
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Código Postal</label>
          <div className="flex w-full sm:w-3/4">
            <input type="text" className="flex-1 bg-[#d9d9d9] border-none rounded-l-sm px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="bg-[#0066ff] hover:bg-blue-700 text-white px-4 flex items-center justify-center rounded-r-sm transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Horario de Visita */}
        <div>
          <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Horario de visita</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-1 border border-gray-400 rounded-sm overflow-hidden">
              <input type="text" placeholder="12:00AM" className="w-full bg-[#e5e5e5] border-none text-center px-2 py-2.5 text-sm sm:text-base focus:outline-none" />
              <div className="bg-[#f0f0f0] border-l border-gray-400 px-3 flex items-center justify-center">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="flex flex-1 border border-gray-400 rounded-sm overflow-hidden">
              <input type="text" placeholder="12:00PM" className="w-full bg-[#e5e5e5] border-none text-center px-2 py-2.5 text-sm sm:text-base focus:outline-none" />
              <div className="bg-[#f0f0f0] border-l border-gray-400 px-3 flex items-center justify-center">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}