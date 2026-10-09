import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- IMPORTAMOS ESTO
import api from '../../api';

const statusStyles = {
  Pagado: 'bg-green-100 text-green-600',
  Pendiente: 'bg-yellow-100 text-yellow-600',
  Atrasado: 'bg-red-100 text-red-600',
  Activo: 'bg-blue-100 text-blue-600',
};

export default function MovimientosTable() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- INICIAMOS EL NAVEGADOR

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await api.get('/dashboard-stats'); 
        
        if (response.data && response.data.ultimosMovimientos) {
          const dataMapeada = response.data.ultimosMovimientos.map(pago => ({
            cliente: pago.prestamo?.cliente?.nombre || 'Cliente sin nombre',
            monto: `$${pago.monto_pagado}`,
            cobratario: 'Josué Ceh',
            hora: new Date(pago.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            estado: 'Pagado'
          }));
          setMovimientos(dataMapeada);
        }
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimientos();
  }, []);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Últimos Pagos Registrados</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400 font-bold">
            <tr>
              <th className="px-8 py-4">Cliente</th>
              <th className="px-8 py-4">Monto Pagado</th>
              <th className="px-8 py-4">Cobratario</th>
              <th className="px-8 py-4">Hora</th>
              <th className="px-8 py-4">Estado</th>
              <th className="px-8 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-8 py-6 text-center text-gray-400">Cargando pagos...</td>
              </tr>
            ) : movimientos.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-6 text-center text-gray-400">Aún no hay pagos registrados el día de hoy.</td>
              </tr>
            ) : (
              movimientos.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 font-semibold text-gray-700 capitalize">{m.cliente}</td>
                  <td className="px-8 py-4 text-gray-600">{m.monto}</td>
                  <td className="px-8 py-4 text-gray-500">{m.cobratario}</td>
                  <td className="px-8 py-4 text-gray-400">{m.hora}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${statusStyles[m.estado] || 'bg-gray-100 text-gray-600'}`}>
                      {m.estado}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <button className="text-blue-600 font-bold hover:underline">Ver</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* NUEVO: Botón para ir a la página dedicada */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-center">
        <button 
          onClick={() => navigate('/historial-pagos')}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Ver todos los movimientos &rarr;
        </button>
      </div>
    </div>
  );
}