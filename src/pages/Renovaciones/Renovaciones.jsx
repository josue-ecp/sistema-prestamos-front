import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import axios from 'axios';

export default function Renovaciones() {
  const navigate = useNavigate();
  const [renovaciones, setRenovaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenovaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/renovaciones', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRenovaciones(response.data);
      } catch (error) {
        console.error("Error al cargar renovaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRenovaciones();
  }, []);

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Renovaciones de créditos</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#e5e5e5] text-gray-700 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-4 border-r border-white/50">Fecha</th>
                <th className="py-4 px-4 border-r border-white/50">Folio</th>
                <th className="py-4 px-4 border-r border-white/50">Cliente</th>
                <th className="py-4 px-4 border-r border-white/50">Zona</th>
                <th className="py-4 px-4 border-r border-white/50">Préstamo</th>
                <th className="py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="py-6 text-gray-400">Cargando renovaciones...</td></tr>
              ) : renovaciones.length === 0 ? (
                <tr><td colSpan="6" className="py-6 text-gray-400">No hay créditos pendientes de renovación.</td></tr>
              ) : (
                renovaciones.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-600">{item.fecha}</td>
                    <td className="py-4 px-4 font-medium text-gray-700">{item.folio}</td>
                    <td className="py-4 px-4 font-bold text-gray-900 uppercase">{item.cliente}</td>
                    <td className="py-4 px-4 text-gray-600">{item.zona}</td>
                    <td className="py-4 px-4 font-bold text-gray-900">{item.prestamo}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => navigate(`/renovaciones/detalle/${item.id}`)}
                        className="bg-[#f39c12] hover:bg-orange-500 text-white p-2 rounded shadow-sm transition-colors cursor-pointer"
                        aria-label="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}