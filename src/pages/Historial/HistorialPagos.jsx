import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const statusStyles = {
  Pagado: 'bg-blue-100 text-blue-800',
  Pendiente: 'bg-slate-100 text-slate-600',
  Atrasado: 'bg-slate-200 text-slate-700',
};

export default function HistorialPagos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState(''); // <-- Estado para el texto del buscador
  const navigate = useNavigate();

  // Función para traer los datos (ahora acepta texto para buscar)
  const fetchHistorial = async (termino = '') => {
    setLoading(true);
    try {
      // Llamamos al nuevo endpoint de Laravel enviando el parámetro de búsqueda
      const response = await api.get('/historial-pagos', {
        params: { buscar: termino }
      }); 
      
      // Laravel paginate() regresa los datos dentro de .data
      const pagosData = response.data.data || response.data;

      if (Array.isArray(pagosData)) {
        const dataMapeada = pagosData.map(pago => ({
          cliente: pago.prestamo?.cliente?.nombre || 'Cliente sin nombre',
          monto: `$${pago.monto_pagado}`,
          cobratario: 'Josué Ceh',
          hora: new Date(pago.created_at).toLocaleDateString() + ' ' + new Date(pago.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          estado: 'Pagado'
        }));
        setMovimientos(dataMapeada);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al cargar la página y cada vez que cambia el texto de búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchHistorial(busqueda);
    }, 300); // Espera 300ms después de que el usuario deje de escribir para buscar

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      {/* Encabezado de la página */}
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          &larr; Volver
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Historial de Movimientos
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Registro completo de todos los cobros y operaciones
          </p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
        
        {/* BUSCADOR DESBLOQUEADO */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre de cliente..." 
            className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
          />
          {busqueda && (
            <button 
              onClick={() => setBusqueda('')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-8 py-4">Cliente</th>
                <th className="px-8 py-4">Monto</th>
                <th className="px-8 py-4">Cobratario</th>
                <th className="px-8 py-4">Fecha y Hora</th>
                <th className="px-8 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-400">Buscando...</td></tr>
              ) : movimientos.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-400">No se encontraron registros.</td></tr>
              ) : (
                movimientos.map((m, i) => (
                  <tr key={i} className="transition-colors hover:bg-blue-50/40">
                    <td className="px-5 py-4 font-semibold capitalize text-slate-800 sm:px-8">{m.cliente}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900 sm:px-8">{m.monto}</td>
                    <td className="px-5 py-4 text-slate-600 sm:px-8">{m.cobratario}</td>
                    <td className="px-5 py-4 text-slate-500 sm:px-8">{m.hora}</td>
                    <td className="px-5 py-4 sm:px-8">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusStyles[m.estado]}`}>
                        {m.estado}
                      </span>
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