import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const statusStyles = {
  Pagado: 'bg-green-100 text-green-600',
  Pendiente: 'bg-yellow-100 text-yellow-600',
  Atrasado: 'bg-red-100 text-red-600',
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto h-screen flex flex-col">
      {/* Encabezado de la página */}
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          &larr; Volver
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
            Historial de Movimientos
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Registro completo de todos los cobros y operaciones
          </p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
        
        {/* BUSCADOR DESBLOQUEADO */}
        <div className="p-6 border-b border-gray-100 flex gap-4">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre de cliente..." 
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full max-w-sm focus:outline-none focus:border-blue-500"
          />
          {busqueda && (
            <button 
              onClick={() => setBusqueda('')}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400 font-bold sticky top-0">
              <tr>
                <th className="px-8 py-4">Cliente</th>
                <th className="px-8 py-4">Monto</th>
                <th className="px-8 py-4">Cobratario</th>
                <th className="px-8 py-4">Fecha y Hora</th>
                <th className="px-8 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-6 text-center text-gray-400">Buscando...</td></tr>
              ) : movimientos.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-6 text-center text-gray-400">No se encontraron registros.</td></tr>
              ) : (
                movimientos.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4 font-semibold text-gray-700 capitalize">{m.cliente}</td>
                    <td className="px-8 py-4 text-gray-600">{m.monto}</td>
                    <td className="px-8 py-4 text-gray-500">{m.cobratario}</td>
                    <td className="px-8 py-4 text-gray-400">{m.hora}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${statusStyles[m.estado]}`}>
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