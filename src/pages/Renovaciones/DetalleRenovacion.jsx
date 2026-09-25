import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import axios from 'axios';

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
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/renovaciones/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
      const token = localStorage.getItem('token');
      const fechaFormateada = formRenovacion.fecha_inicio.toISOString().split('T')[0];

      await axios.post(`http://127.0.0.1:8000/api/renovaciones/${id}/aprobar`, {
        monto: formRenovacion.monto,
        fecha_inicio: fechaFormateada,
        esquema_cobro: formRenovacion.esquema_cobro,
        tasa_interes: formRenovacion.tasa_interes,
        plazo: formRenovacion.plazo
      }, {
        headers: { Authorization: `Bearer ${token}` }
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

  if (loading) return <div className="p-8">Cargando detalles...</div>;
  if (!datos) return <div className="p-8">No se encontró información.</div>;

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/renovaciones')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="bg-[#0b66c2] px-6 py-2 flex justify-between items-center">
          <h2 className="text-white text-sm font-medium">Préstamo Anterior - Folio: {id}</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleAprobar}
              disabled={saving}
              className="bg-[#2ecc71] hover:bg-green-600 text-white text-[10px] font-bold px-4 py-1 rounded uppercase transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Aprobando...' : 'Aprobar'}
            </button>
            <button 
              onClick={() => navigate('/renovaciones')}
              className="bg-[#e74c3c] hover:bg-red-600 text-white text-[10px] font-bold px-4 py-1 rounded uppercase transition-all cursor-pointer"
            >
              Rechazar
            </button>
          </div>
        </div>

        {/* Resumen del Crédito */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 border-b border-gray-100 bg-gray-50/30">
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Cliente</p>
            <p className="font-bold text-gray-900 text-sm uppercase">{datos.cliente?.nombre}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Crédito Anterior</p>
            <p className="font-bold text-gray-900 text-sm">$ {datos.prestamo_anterior?.monto}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Fecha Creación</p>
            <p className="font-bold text-gray-900 text-sm">{datos.prestamo_anterior?.created_at}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Esquema</p>
            <p className="font-bold text-gray-900 text-sm uppercase">{datos.prestamo_anterior?.esquema_cobro}</p>
          </div>
        </div>

        {/* Tabla de Historial de Pagos */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-center text-sm">
            <thead>
              <tr className="bg-[#b8b8b8] text-gray-800 text-[10px] uppercase font-bold">
                <th className="border border-gray-400 py-2">Fecha</th>
                <th className="border border-gray-400 py-2">Num. Pago</th>
                <th className="border border-gray-400 py-2">Monto</th>
                <th className="border border-gray-400 py-2">Comentarios</th>
                <th className="border border-gray-400 py-2">Tipo Pago</th>
              </tr>
            </thead>
            <tbody>
              {datos.historial_pagos.length === 0 ? (
                <tr><td colSpan="5" className="py-4 text-gray-400">No hay pagos registrados.</td></tr>
              ) : (
                datos.historial_pagos.map((pago, index) => (
                  <tr key={index} className="text-gray-700">
                    <td className="border border-gray-300 py-2">{pago.fecha}</td>
                    <td className="border border-gray-300 py-2">{pago.num_pago}</td>
                    <td className="border border-gray-300 py-2">{pago.monto}</td>
                    <td className="border border-gray-300 py-2 italic text-gray-500 text-xs">{pago.comentarios}</td>
                    <td className="border border-gray-300 py-2">
                      <span className="bg-[#2ecc71] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{pago.tipo_pago}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Configuración del Nuevo Crédito por Renovación */}
        <div className="bg-gray-100 p-6 border-t border-gray-300">
          <h3 className="text-gray-500 text-[11px] font-bold uppercase mb-4 tracking-wider">Configuración de la Renovación</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Monto Solicitado</label>
              <input 
                type="number" 
                value={formRenovacion.monto}
                onChange={(e) => setFormRenovacion({ ...formRenovacion, monto: e.target.value })}
                className="border border-gray-400 bg-white rounded px-2 py-1.5 text-xs font-bold text-gray-700 focus:outline-none" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Fecha de inicio</label>
              <div className="relative">
                <DatePicker
                  selected={formRenovacion.fecha_inicio}
                  onChange={(date) => setFormRenovacion({ ...formRenovacion, fecha_inicio: date })}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="w-full border border-gray-400 bg-white rounded px-2 py-1.5 text-xs focus:outline-none"
                />
                <Calendar className="absolute right-2 top-1.5 text-blue-400 pointer-events-none" size={14} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Esquema de cobro</label>
              <select 
                value={formRenovacion.esquema_cobro}
                onChange={(e) => setFormRenovacion({ ...formRenovacion, esquema_cobro: e.target.value })}
                className="border border-gray-400 bg-white rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none uppercase font-bold cursor-pointer"
              >
                <option value="semanal">Semanal</option>
                <option value="diario">Diario</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Tasa de interés (%)</label>
              <div className="flex">
                <input 
                  type="number" 
                  value={formRenovacion.tasa_interes}
                  onChange={(e) => setFormRenovacion({ ...formRenovacion, tasa_interes: e.target.value })}
                  className="w-full border border-gray-400 bg-white rounded-l px-2 py-1.5 text-xs focus:outline-none text-center" 
                />
                <span className="bg-gray-200 border border-l-0 border-gray-400 rounded-r px-2 py-1.5 text-[10px] text-gray-500 flex items-center font-bold">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Plazo a pagar</label>
              <div className="flex">
                <input 
                  type="number" 
                  value={formRenovacion.plazo}
                  onChange={(e) => setFormRenovacion({ ...formRenovacion, plazo: e.target.value })}
                  className="w-full border border-gray-400 bg-white rounded-l px-2 py-1.5 text-xs focus:outline-none text-center" 
                />
                <span className="bg-gray-200 border border-l-0 border-gray-400 rounded-r px-2 py-1.5 text-[10px] text-gray-500 flex items-center font-bold">Pagos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}