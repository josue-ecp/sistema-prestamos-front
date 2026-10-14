import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function DetallePrestamo() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID del préstamo
  
  const [prestamo, setPrestamo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/prestamos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPrestamo(response.data);
      } catch (error) {
        console.error("Error al cargar detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Cargando detalles...</div>;
  if (!prestamo) return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-600">Préstamo no encontrado.</div>;

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
      <button 
        onClick={() => navigate('/prestamos')}
        className="mb-5 flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
        <div className="bg-blue-900 px-6 py-5 sm:px-8">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Detalle de cartera</p>
          <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">Préstamo - Folio: {prestamo.id_prestamo}</h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 p-5 sm:grid-cols-2 sm:p-8 md:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="mb-1 text-xs font-semibold text-slate-500">Cliente</p>
            <p className="text-sm font-bold uppercase text-slate-900">{prestamo.cliente?.nombre}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="mb-1 text-xs font-semibold text-slate-500">Crédito Original</p>
            <p className="text-sm font-bold text-slate-900">${Number(prestamo.monto).toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="mb-1 text-xs font-semibold text-slate-500">Saldo Pendiente</p>
            <p className="text-sm font-bold text-slate-900">${Number(prestamo.saldo_pendiente).toLocaleString()}</p>
          </div>
          <div className="flex md:justify-end">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-6 py-3 text-sm font-bold uppercase text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 md:w-auto cursor-pointer">
              <Plus size={18} /> Agregar Pago
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  <th className="border-b border-slate-200 px-5 py-4">Fecha</th>
                  <th className="border-b border-slate-200 px-5 py-4">Monto</th>
                  <th className="border-b border-slate-200 px-5 py-4">Método</th>
                  <th className="border-b border-slate-200 px-5 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-center text-sm text-slate-700">
                {prestamo.pagos && prestamo.pagos.map((pago) => (
                  <tr key={pago.id_pago} className="transition-colors hover:bg-blue-50/40">
                    <td className="border-b border-slate-100 px-5 py-4">{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                    <td className="border-b border-slate-100 px-5 py-4 font-semibold text-slate-900">${Number(pago.monto_pagado).toFixed(2)}</td>
                    <td className="border-b border-slate-100 px-5 py-4">{pago.metodo}</td>
                    <td className="border-b border-slate-100 px-5 py-4">
                      <button aria-label="Eliminar pago" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}