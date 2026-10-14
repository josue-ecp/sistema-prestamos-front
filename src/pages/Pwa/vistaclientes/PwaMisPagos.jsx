import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Receipt, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

export default function PwaMisPagos() {
  const navigate = useNavigate();
  const [cuentaData, setCuentaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPagosInfo = async () => {
      try {
        const response = await api.get('/cliente/mi-cuenta');
        setCuentaData(response.data);
      } catch (error) {
        console.error("Error al cargar historial de pagos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPagosInfo();
  }, []);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const nombreCliente = cuentaData?.nombre || 'Cliente';
  const iniciales = nombreCliente.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const historialPagos = cuentaData?.historial_pagos || [];
  const saldoRestante = Number(cuentaData?.saldo_pendiente || 0);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 pb-20 font-sans shadow-2xl">
      
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-xl transition">
          <ArrowLeft size={22} />
        </button>
        <div className="ml-1 min-w-0">
          <h1 className="truncate text-base font-black uppercase tracking-tight text-slate-900">{nombreCliente}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historial y Mis Pagos</p>
        </div>
        <div className="ml-auto w-10 h-10 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xs shadow-sm">
          {iniciales}
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">

        {/* Tarjeta de Resumen Informativo (Sin repetir el botón de pagar) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 to-slate-900 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Saldo Pendiente en Crédito</p>
          <h2 className="break-words text-2xl font-black tracking-tight sm:text-3xl">{formatMoney(saldoRestante)}</h2>
          <p className="mt-2 flex items-start gap-1.5 text-[11px] font-medium text-slate-300">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-blue-200" /> Todos tus abonos se aplican directamente a tu saldo.
          </p>
        </div>

        {/* Sección del Historial de Transacciones */}
        <div className="space-y-3">
          <div className="flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex min-w-0 items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
              <History size={14} className="shrink-0 text-blue-600" /> Comprobantes y Abonos Realizados
            </h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
              {historialPagos.length} Registros
            </span>
          </div>

          {historialPagos.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                <Receipt size={22} />
              </div>
              <p className="text-xs font-black text-slate-800 mb-1">Sin pagos registrados aún</p>
              <p className="text-[11px] text-slate-400">Tus abonos en efectivo o en línea aparecerán reflejados aquí de forma automática.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {historialPagos.map((pago, index) => (
                <div key={index} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-800">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-xs font-black text-slate-900">{pago.comentarios}</p>
                      <p className="mt-0.5 text-[10px] font-bold text-slate-400">{pago.fecha} • <span className="text-blue-800">{pago.metodo}</span></p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="break-words text-sm font-black text-blue-800">+{formatMoney(pago.monto)}</p>
                    <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-800">
                      Aplicado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}