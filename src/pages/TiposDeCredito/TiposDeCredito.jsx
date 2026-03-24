import React from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react'; // Importamos Eye
import { useNavigate } from 'react-router-dom';

export default function TiposDeCredito() {
  const navigate = useNavigate();

  const tiposCredito = [
    { id: 1, descripcion: 'CRÉDITO PERSONAL' },
    { id: 2, descripcion: 'CRÉDITO HIPOTECARIO' },
    { id: 3, descripcion: 'CRÉDITO AUTOMOTRIZ' },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tipos de crédito</h1>

      {/* Botón agregar estandarizado */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <button
          onClick={() => navigate('/tipos-de-credito/nuevo')}
          className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 uppercase tracking-wide"
        >
          <Plus size={16} />
          Agregar tipo de crédito
        </button>
      </div>

      {/* Tabla con estilo unificado */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-4 border-r border-white/50 text-left pl-12">Descripción</th>
                <th className="py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {tiposCredito.map((tipo, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-left pl-12 font-medium text-gray-900 uppercase">
                    {tipo.descripcion}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      {/* NUEVO BOTÓN: Previsualizar */}
                      <button 
                        onClick={() => navigate(`/tipos-de-credito/detalle/${tipo.id}`)}
                        className="bg-[#3b82f6] hover:bg-blue-700 text-white p-1.5 rounded shadow-sm transition-colors"
                        title="Previsualizar"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Botón: Editar */}
                      <button 
                        className="bg-[#f39c12] hover:bg-orange-500 text-white p-1.5 rounded shadow-sm transition-colors"
                        title="Editar"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Botón: Eliminar */}
                      <button 
                        className="bg-[#e74c3c] hover:bg-red-600 text-white p-1.5 rounded shadow-sm transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación estandarizada */}
        <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Mostrando del 1 al {tiposCredito.length} de {tiposCredito.length}
          </p>
        </div>
      </div>
    </div>
  );
}