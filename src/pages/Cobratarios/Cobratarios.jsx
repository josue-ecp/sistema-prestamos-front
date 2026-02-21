import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Check, X } from 'lucide-react';

export default function Cobratarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cobratarios = [
    { id: 1, nombre: 'Jorge Candila', correo: 'JorgeCand@gmail.com', ultIngreso: '28/Ene/2026 05:38 PM', activo: true },
    { id: 2, nombre: 'Eduardo Canche', correo: 'EduardoC@gmail.com', ultIngreso: '28/Ene/2026 05:38 PM', activo: true },
    { id: 3, nombre: 'Felix Magaña', correo: 'FelixMag@gmail.com', ultIngreso: '28/Ene/2026 05:38 PM', activo: true },
    { id: 4, nombre: 'Juan Perez', correo: 'JuanPerez@gmail.com', ultIngreso: '28/Ene/2026 05:38 PM', activo: true },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de cobratarios</h1>

      {/* BARRA SUPERIOR: Buscador y Botón Nuevo           */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-gray-200/70 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar Cobratario..."
          />
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Nuevo Cobratario
        </button>
      </div>

      {/* TABLA PRINCIPAL                                */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#e5e5e5] text-gray-700 text-sm">
              <th className="py-4 px-4 font-semibold border-r border-white/50 text-left pl-8">Nombre</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50 w-64">Zona<br/>Asignada</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50">Ult. Ingreso</th>
              <th className="py-4 px-4 font-semibold border-r border-white/50">Activo</th>
              <th className="py-4 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {cobratarios.map((cobratario) => (
              <tr key={cobratario.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                
                <td className="py-4 px-4 text-left pl-8 font-medium text-gray-900">
                  {cobratario.nombre}
                </td>
                
                <td className="py-4 px-4 text-gray-700 underline decoration-gray-400 underline-offset-2">
                  {cobratario.correo}
                </td>
                
                <td className="py-4 px-4 text-gray-700">{cobratario.ultIngreso}</td>
                
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    {cobratario.activo && (
                      <div className="bg-[#2ecc71] rounded-full p-1 text-white shadow-sm">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="bg-[#f39c12] hover:bg-orange-500 text-white p-1.5 rounded shadow-sm transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="bg-[#e74c3c] hover:bg-red-600 text-white p-1.5 rounded shadow-sm transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NUEVO COBRATARIO                */}
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200 relative">
            
            {/* Botón de cerrar (X) flotante */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-8">Registrar Nuevo Cobratario</h2>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Nombre Completo</label>
                <input 
                  type="text" 
                  placeholder="Ingrese el nombre completo" 
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Correo Electronico</label>
                <input 
                  type="email" 
                  placeholder="Usuario@ejemplo.com" 
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Contraseña</label>
                <input 
                  type="password" 
                  placeholder="********" 
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xl tracking-widest"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Zona Asignada</label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700">
                  <option>Zona Norte</option>
                  <option>Zona Sur</option>
                  <option>Zona Oriente</option>
                  <option>Zona Poniente</option>
                  <option>Zona Centro</option>
                </select>
              </div>

              <div className="flex justify-between gap-4 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#2563eb] rounded-xl text-white font-bold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Agregar Cobratario
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}