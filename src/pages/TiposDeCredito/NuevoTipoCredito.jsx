import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function NuevoTipoCredito() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        tipoCredito: '',
        descripcion: '',
        esquema: '',
        tasaInteres: '',
        plazoCredito: '',
        periodicidad: 'SEMANAL',
        diasVisita: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (dia) => {
        setFormData(prev => ({
            ...prev,
            diasVisita: prev.diasVisita.includes(dia)
                ? prev.diasVisita.filter(d => d !== dia)
                : [...prev.diasVisita, dia]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para guardar
        console.log(formData);
        // Navegar de vuelta
        navigate('/tipos-credito');
    };

    const handleCancel = () => {
        navigate('/tipos-credito');
    };

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    return (
        <div className="w-full min-h-screen bg-[#f8f9fa]">
            {/* Encabezado azul */}
            <div className="bg-[#0b66c2] px-6 py-3">
                <h2 className="text-white text-sm font-medium">Agregar tipo de crédito</h2>
            </div>

            {/* Sección principal gris claro */}
            <div className="bg-[#f8f9fa] p-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Fila 1: dos campos anchos */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de crédito</label>
                                <input
                                    type="text"
                                    name="tipoCredito"
                                    value={formData.tipoCredito}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Fila 2: tres columnas */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                                <div className="relative">
                                    <select
                                        name="esquema"
                                        value={formData.esquema}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                        required
                                    >
                                        <option value="">SELECCIONE UN ESQUEMA</option>
                                        <option value="esquema1">Esquema 1</option>
                                        <option value="esquema2">Esquema 2</option>
                                        <option value="esquema3">Esquema 3</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Tasa de interés</label>
                                <input
                                    type="text"
                                    name="tasaInteres"
                                    value={formData.tasaInteres}
                                    onChange={handleChange}
                                    placeholder="Porcentaje de interés"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Tasa de interés</label>
                                <input
                                    type="text"
                                    name="plazoCredito"
                                    value={formData.plazoCredito}
                                    onChange={handleChange}
                                    placeholder="Plazo del crédito"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Sección periodicidad */}
                        <div>
                            <p className="text-gray-700 text-sm font-medium">Asigne la periodicidad de visitas</p>
                            <hr className="my-4 border-gray-300" />
                            <p className="text-gray-700 text-sm font-medium mb-4">Tipo de periodicidad para el cliente</p>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-gray-500" />
                                    <select
                                        name="periodicidad"
                                        value={formData.periodicidad}
                                        onChange={handleChange}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="SEMANAL">SEMANAL</option>
                                        <option value="MENSUAL">MENSUAL</option>
                                        <option value="QUINCENAL">QUINCENAL</option>
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                {diasSemana.map(dia => (
                                                    <th key={dia} className="border border-gray-300 py-2 px-2 text-xs font-medium text-gray-700">{dia}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {diasSemana.map(dia => (
                                                    <td key={dia} className="border border-gray-300 py-2 px-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.diasVisita.includes(dia)}
                                                            onChange={() => handleCheckboxChange(dia)}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                className="bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded text-sm uppercase transition-colors"
                            >
                                Aceptar
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-[#e74c3c] hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded text-sm uppercase transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}