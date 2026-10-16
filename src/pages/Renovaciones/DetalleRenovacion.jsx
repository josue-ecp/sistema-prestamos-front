import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import api from '../../api';

registerLocale('es', es);

export default function DetalleRenovacion() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Formulario para la configuración de la renovación
  const [formRenovacion, setFormRenovacion] = useState({
    monto: '5000',
    fecha_inicio: new Date(),
    esquema_cobro: 'semanal',
    tasa_interes: '30',
    plazo: '26'
  });

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response = await api.get(`/renovaciones/${id}`);
        setDatos(response.data);
        if (response.data.prestamo_anterior) {
          setFormRenovacion(prev => ({ ...prev, monto: response.data.prestamo_anterior.monto }));
        }
      } catch (error) {
        console.error("Error al cargar detalle de renovación:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  const handleAprobar = async () => {
    setSaving(true);
    try {
      const fechaFormateada = formRenovacion.fecha_inicio.toISOString().split('T')[0];

      await api.post(`/renovaciones/${id}/aprobar`, {
        monto: formRenovacion.monto,
        fecha_inicio: fechaFormateada,
        esquema_cobro: formRenovacion.esquema_cobro,
        tasa_interes: formRenovacion.tasa_interes,
        plazo: formRenovacion.plazo
      });

      alert('¡Renovación aprobada con éxito!');
      navigate('/renovaciones');
    } catch (error) {
      console.error("Error al aprobar renovación:", error);
      alert('Error al aprobar la renovación.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Cargando detalles...</div>;
  if (!datos) return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">No se encontró información.</div>;

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <button 
        onClick={() => navigate('/renovaciones')}
        className="mb-5 flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
        {/* Encabezado */}
        <div className="flex flex-col justify-between gap-4 bg-blue-900 px-5 py-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Detalle de renovación</p>
            <h2 className="text-lg font-bold tracking-tight text-white">Préstamo Anterior - Folio: {id}</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAprobar}
              disabled={saving}
              className="rounded-lg bg-white px-4 py-2 text-[10px] font-bold uppercase text-blue-900 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Aprobando...' : 'Aprobar'}
            </button>
            <button 
              onClick={() => navigate('/renovaciones')}
              className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 cursor-pointer"
            >
              Rechazar
            </button>
          </div>
        </div>

        {/* Resumen del Crédito */}
        <div className="grid grid-cols-2 gap-3 border-b border-slate-100 bg-slate-50/60 p-5 sm:gap-4 sm:p-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <p className="text-[10px] font-bold uppercase text-slate-500">Cliente</p>
            <p className="text-sm font-bold uppercase text-slate-900">{datos.cliente?.nombre}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <p className="text-[10px] font-bold uppercase text-slate-500">Crédito Anterior</p>
            <p className="text-sm font-bold text-slate-900">$ {datos.prestamo_anterior?.monto}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <p className="text-[10px] font-bold uppercase text-slate-500">Fecha Creación</p>
            <p className="text-sm font-bold text-slate-900">{datos.prestamo_anterior?.created_at}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <p className="text-[10px] font-bold uppercase text-slate-500">Esquema</p>
            <p className="text-sm font-bold uppercase text-slate-900">{datos.prestamo_anterior?.esquema_cobro}</p>
          </div>
        </div>

        {/* Tabla de Historial de Pagos */}
        <div className="overflow-x-auto p-5 sm:p-6">
          <table className="w-full min-w-[650px] overflow-hidden rounded-xl border-collapse border border-slate-200 text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <th className="border border-slate-200 px-3 py-3">Fecha</th>
                <th className="border border-slate-200 px-3 py-3">Num. Pago</th>
                <th className="border border-slate-200 px-3 py-3">Monto</th>
                <th className="border border-slate-200 px-3 py-3">Comentarios</th>
                <th className="border border-slate-200 px-3 py-3">Tipo Pago</th>
              </tr>
            </thead>
            <tbody>
              {datos.historial_pagos.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-slate-400">No hay pagos registrados.</td></tr>
              ) : (
                datos.historial_pagos.map((pago, index) => (
                  <tr key={index} className="text-slate-700 transition-colors hover:bg-blue-50/40">
                    <td className="border border-slate-100 py-3">{pago.fecha}</td>
                    <td className="border border-slate-100 py-3">{pago.num_pago}</td>
                    <td className="border border-slate-100 py-3 font-semibold text-slate-900">{pago.monto}</td>
                    <td className="border border-slate-100 py-3 text-xs italic text-slate-500">{pago.comentarios}</td>
                    <td className="border border-slate-100 py-3">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-800">{pago.tipo_pago}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Configuración del Nuevo Crédito por Renovación */}
        <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-6">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-600">Configuración de la Renovación</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Monto Solicitado</label>
              <input 
                type="number" 
                value={formRenovacion.monto}
                onChange={(e) => setFormRenovacion({ ...formRenovacion, monto: e.target.value })}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Fecha de inicio</label>
              <div className="relative">
                <DatePicker
                  selected={formRenovacion.fecha_inicio}
                  onChange={(date) => setFormRenovacion({ ...formRenovacion, fecha_inicio: date })}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
                <Calendar className="pointer-events-none absolute right-3 top-3 text-blue-700" size={14} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Esquema de cobro</label>
              <select 
                value={formRenovacion.esquema_cobro}
                onChange={(e) => setFormRenovacion({ ...formRenovacion, esquema_cobro: e.target.value })}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 uppercase"
              >
                <option value="semanal">Semanal</option>
                <option value="diario">Diario</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Tasa de interés (%)</label>
              <div className="flex">
                <input 
                  type="number" 
                  value={formRenovacion.tasa_interes}
                  onChange={(e) => setFormRenovacion({ ...formRenovacion, tasa_interes: e.target.value })}
                  className="w-full rounded-l-xl border border-slate-200 bg-white px-3 py-3 text-sm text-center focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" 
                />
                <span className="flex items-center rounded-r-xl border border-l-0 border-slate-200 bg-slate-100 px-3 py-3 text-xs font-bold text-slate-500">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Plazo a pagar</label>
              <div className="flex">
                <input 
                  type="number" 
                  value={formRenovacion.plazo}
                  onChange={(e) => setFormRenovacion({ ...formRenovacion, plazo: e.target.value })}
                  className="w-full rounded-l-xl border border-slate-200 bg-white px-3 py-3 text-sm text-center focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" 
                />
                <span className="flex items-center rounded-r-xl border border-l-0 border-slate-200 bg-slate-100 px-3 py-3 text-xs font-bold text-slate-500">Pagos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}