import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Check, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cobratarios() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cobratarios = [
    { id: 1, nombre: 'JORGE CANDILA', zona: 'NORTE', ultIngreso: '28/Ene/2026 05:38 PM', activo: true },
    { id: 2, nombre: 'EDUARDO CANCHE', zona: 'SUR', ultIngreso: '28/Ene/2026 05:38 PM', activo: true },
    { id: 3, nombre: 'FELIX MAGAÑA', zona: 'ORIENTE', ultIngreso: '28/Ene/2026 05:38 PM', activo: true },
    { id: 4, nombre: 'JUAN PEREZ', zona: 'PONIENTE', ultIngreso: '28/Ene/2026 05:38 PM', activo: true },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Cobratarios</h1>

      {/* BARRA SUPERIOR */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-gray-200/60 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar Cobratario..."
          />
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm uppercase tracking-wide active:scale-95"
        >
          <Plus size={16} />
          Nuevo Cobratario
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-4 border-r border-white/50 text-left pl-12">Nombre</th>
                <th className="py-4 px-4 border-r border-white/50 w-64">Zona Asignada</th>
                <th className="py-4 px-4 border-r border-white/50">Ult. Ingreso</th>
                <th className="py-4 px-4 border-r border-white/50">Activo</th>
                <th className="py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {cobratarios.map((cobratario) => (
                <tr key={cobratario.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-left pl-12 font-medium text-gray-900 uppercase">{cobratario.nombre}</td>
                  
                  {/* Cambio de Correo a Zona con estilo estandarizado */}
                  <td className="py-4 px-4 text-gray-700 font-bold uppercase underline decoration-gray-400 underline-offset-2">
                    {cobratario.zona}
                  </td>
                  
                  <td className="py-4 px-4 text-gray-600 font-medium">{cobratario.ultIngreso}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      {cobratario.activo && (
                        <div className="bg-[#2ecc71] rounded-full p-0.5 text-white shadow-sm">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/cobratarios/detalle/${cobratario.id}`)}
                        className="bg-[#3b82f6] hover:bg-blue-700 text-white p-1.5 rounded shadow-sm transition-colors"
                        title="Previsualizar"
                      >
                        <Eye size={14} />
                      </button>
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
        <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Mostrando del 1 al {cobratarios.length} de {cobratarios.length}
          </p>
        </div>
      </div>

      {/* MODAL: NUEVO COBRATARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Header Azul Estilo PrestaYA! */}
            <div className="bg-[#0b66c2] px-4 py-2 flex justify-between items-center">
              <h2 className="text-white text-sm font-medium">Registrar Nuevo Cobratario</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200">
                <X size={18} />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-bold uppercase">Nombre Completo</label>
                <input type="text" className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-bold uppercase">Correo Electronico</label>
                <input type="email" className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-bold uppercase">Contraseña</label>
                <input type="password" placeholder="********" className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-xs font-bold uppercase">Zona Asignada</label>
                <select className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none uppercase font-bold">
                  <option>Zona Norte</option>
                  <option>Zona Sur</option>
                  <option>Zona Oriente</option>
                  <option>Zona Poniente</option>
                  <option>Zona Centro</option>
                </select>
              </div>

              {/* Botones estilo PrestaYA! */}
              <div className="mt-8 flex gap-3 p-3 bg-[#e5e7eb] -mx-6 -mb-6">
                <button type="submit" className="bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-6 py-1.5 rounded text-[10px] uppercase shadow-sm">
                  Agregar Cobratario
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-[#e74c3c] hover:bg-red-600 text-white font-bold px-6 py-1.5 rounded text-[10px] uppercase shadow-sm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}