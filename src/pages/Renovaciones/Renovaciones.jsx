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
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mb-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Cartera de crédito</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Renovaciones de créditos</h1>
        <p className="mt-1 text-sm text-slate-500">Revisa los créditos disponibles para renovación.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="border-b border-slate-200 px-5 py-4">Fecha</th>
                <th className="border-b border-slate-200 px-5 py-4">Folio</th>
                <th className="border-b border-slate-200 px-5 py-4">Cliente</th>
                <th className="border-b border-slate-200 px-5 py-4">Zona</th>
                <th className="border-b border-slate-200 px-5 py-4">Préstamo</th>
                <th className="border-b border-slate-200 px-5 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-slate-400">Cargando renovaciones...</td></tr>
              ) : renovaciones.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-slate-400">No hay créditos pendientes de renovación.</td></tr>
              ) : (
                renovaciones.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/40">
                    <td className="px-5 py-4 text-slate-500">{item.fecha}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{item.folio}</td>
                    <td className="px-5 py-4 font-semibold uppercase text-slate-900">{item.cliente}</td>
                    <td className="px-5 py-4 text-slate-600">{item.zona}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{item.prestamo}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/renovaciones/detalle/${item.id}`)}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-blue-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
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