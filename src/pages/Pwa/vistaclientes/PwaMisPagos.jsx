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
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20 font-sans max-w-md mx-auto shadow-2xl">
      
      {/* Header */}
      <div className="p-5 flex items-center bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-xl transition">
          <ArrowLeft size={22} />
        </button>
        <div className="ml-2">
          <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">{nombreCliente}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historial y Mis Pagos</p>
        </div>
        <div className="ml-auto w-10 h-10 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xs shadow-sm">
          {iniciales}
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">

        {/* Tarjeta de Resumen Informativo (Sin repetir el botón de pagar) */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[28px] text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Saldo Pendiente en Crédito</p>
          <h2 className="text-3xl font-black tracking-tight">{formatMoney(saldoRestante)}</h2>
          <p className="text-[11px] text-slate-300 font-medium mt-2 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" /> Todos tus abonos se aplican directamente a tu saldo.
          </p>
        </div>

        {/* Sección del Historial de Transacciones */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <History size={14} className="text-blue-600" /> Comprobantes y Abonos Realizados
            </h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
              {historialPagos.length} Registros
            </span>
          </div>

          {historialPagos.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-slate-100 p-8 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Receipt size={22} />
              </div>
              <p className="text-xs font-black text-slate-800 mb-1">Sin pagos registrados aún</p>
              <p className="text-[11px] text-slate-400">Tus abonos en efectivo o en línea aparecerán reflejados aquí de forma automática.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {historialPagos.map((pago, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition hover:border-slate-200">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-xs">{pago.comentarios}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{pago.fecha} • <span className="text-blue-600">{pago.metodo}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-600 text-sm">+{formatMoney(pago.monto)}</p>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
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