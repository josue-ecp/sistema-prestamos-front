import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TiposDeCredito() {
    const navigate = useNavigate();

    // Datos de ejemplo
    const tiposCredito = [
        { id: 1, descripcion: 'Crédito Personal' },
        { id: 2, descripcion: 'Crédito Hipotecario' },
        { id: 3, descripcion: 'Crédito Automotriz' },
    ];

    return (
        <div className="p-8 w-full min-h-screen bg-[#f8f9fa]">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Tipos de crédito</h1>

            {/* Botón agregar */}
            <div className="flex justify-end items-center mb-6">
                <button
                    onClick={() => navigate('/tipos-de-credito/nuevo')}
                    className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Agregar tipo de crédito
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="bg-[#e5e5e5] text-gray-700 text-sm">
                            <th className="py-4 px-4 font-semibold border-r border-white/50">Descripción</th>
                            <th className="py-4 px-4 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {tiposCredito.map((tipo, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 text-gray-900">{tipo.descripcion}</td>
                                <td className="py-4 px-4">
                                    <div className="flex justify-center gap-2">
                                        <button className="bg-[#f39c12] hover:bg-orange-500 text-white p-2 rounded shadow-sm transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button className="bg-[#e74c3c] hover:bg-red-600 text-white p-2 rounded shadow-sm transition-colors">
                                            <Trash2 size={16} />
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