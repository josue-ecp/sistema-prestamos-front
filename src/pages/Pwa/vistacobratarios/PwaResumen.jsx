import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../../api'; // Asegúrate de que esta ruta sea correcta según tu estructura

export default function PwaResumen() {
  const [resumen, setResumen] = useState({
    tasa_cobranza: 0,
    total_cobrado: 0,
    total_esperado: 0,
    clientes_visitados: 0,
    clientes_en_ruta: 0,
    pagos_exitosos: 0,
    sin_pago: 0,
    actividad_reciente: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Generador dinámico de la fecha de hoy
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaActual = new Date().toLocaleDateString('es-ES', opcionesFecha);
  const fechaMayuscula = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await api.get('/resumen-diario');
        setResumen(response.data);
      } catch (error) {
        console.error("Error al cargar el resumen diario:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumen();
  }, []);

  const formatMoney = (amount) => {
    return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5 font-bold text-slate-500">Cargando métricas...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 sm:p-5">
      
      {/* Cabecera */}
      <div className="mb-6 mt-2">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Operación de campo</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Resumen del día</h1>
        <p className="mt-1 text-sm text-slate-500 capitalize">{fechaMayuscula}</p>
      </div>

      {/* Tarjeta Principal Azul */}
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-950 p-4 text-white shadow-lg shadow-blue-900/10 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} />
          <span className="text-sm font-semibold">Tasa de cobranza</span>
        </div>
        <div className="mb-2 break-words text-4xl font-bold leading-none sm:text-[2.5rem]">
          {resumen.tasa_cobranza}%
        </div>
        <div className="text-xs text-blue-200 font-medium">
          ${formatMoney(resumen.total_cobrado)} de ${formatMoney(resumen.total_esperado)}
        </div>
      </div>

      {/* Grid de Métricas (2x2) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        
        {/* Tarjeta: Total Cobrado */}
        <div className="flex min-h-32 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <DollarSign size={22} className="mb-2 text-blue-800" />
          <div>
            <div className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">${formatMoney(resumen.total_cobrado)}</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Total Cobrado</div>
          </div>
        </div>

        {/* Tarjeta: Clientes Visitados */}
        <div className="flex min-h-32 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <CheckCircle2 size={22} className="mb-2 text-blue-800" />
          <div>
            <div className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{resumen.clientes_visitados}/{resumen.clientes_en_ruta}</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Visitados</div>
          </div>
        </div>

        {/* Tarjeta: Pagos Exitosos */}
        <div className="flex min-h-32 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <CheckCircle2 size={22} className="mb-2 text-blue-800" />
          <div>
            <div className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{resumen.pagos_exitosos}</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Pagos Exitosos</div>
          </div>
        </div>

        {/* Tarjeta: Sin Pago */}
        <div className="flex min-h-32 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <XCircle size={22} className="mb-2 text-slate-500" />
          <div>
            <div className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{resumen.sin_pago}</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Sin Pago</div>
          </div>
        </div>

      </div>

      {/* Actividad Reciente */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-900">Actividad Reciente</h2>
        
        {resumen.actividad_reciente.length > 0 ? (
          <div className="space-y-4">
            {resumen.actividad_reciente.map((actividad, index) => (
              <div key={index} className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-full bg-blue-50 p-2">
                    <CheckCircle2 size={16} className="text-blue-800" />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words text-xs font-bold text-slate-900">{actividad.nombre}</p>
                    <p className="text-[10px] text-slate-400">{actividad.hora}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right text-xs font-black text-blue-800 sm:text-sm">
                  +${formatMoney(actividad.monto)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pb-4 pt-2 text-center text-xs text-slate-400">
            No hay actividad aún
          </div>
        )}
      </div>

    </div>
  );
}