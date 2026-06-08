import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';

registerLocale('es', es);

export default function DetalleRenovacion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/renovaciones')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
        {/* Encabezado Azul */}
        <div className="bg-[#0b66c2] px-6 py-2 flex justify-between items-center">
          <h2 className="text-white text-sm font-medium">Prestamos - Folio: 181697 - 1470</h2>
          <div className="flex gap-2">
            <button className="bg-[#2ecc71] hover:bg-green-600 text-white text-[10px] font-bold px-4 py-1 rounded uppercase transition-all">Aprobar</button>
            <button className="bg-[#e74c3c] hover:bg-red-600 text-white text-[10px] font-bold px-4 py-1 rounded uppercase transition-all">Rechazar</button>
          </div>
        </div>

        {/* Resumen Superior del Crédito Anterior */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 border-b border-gray-100 bg-gray-50/30">
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Cliente</p>
            <p className="font-bold text-gray-900 text-sm">JOSUE CEH POOL</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Crédito Solicitado</p>
            <p className="font-bold text-gray-900 text-sm">$5,000.00</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Pagos ult. Crédito</p>
            <p className="font-bold text-gray-900 text-sm">26/26</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Ult. Crédito</p>
            <p className="font-bold text-gray-900 text-sm">$3,800.00</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Fecha de creación</p>
            <p className="font-bold text-gray-900 text-sm">02-02-2026 07:34:42</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Atrasos ult. Crédito</p>
            <p className="font-bold text-gray-900 text-sm">2</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Último pago registrado</p>
            <p className="font-bold text-gray-900 text-sm">01/Feb/2026</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase">Renovaciones Totales</p>
            <p className="font-bold text-gray-900 text-sm">3</p>
          </div>
        </div>

        {/* Tabla de Historial (Excel Style) */}
        <div className="p-6">
          <table className="w-full border-collapse border border-gray-300 text-center text-sm">
            <thead>
              <tr className="bg-[#b8b8b8] text-gray-800 text-[10px] uppercase font-bold">
                <th className="border border-gray-400 py-2">Fecha</th>
                <th className="border border-gray-400 py-2">Num. Pago</th>
                <th className="border border-gray-400 py-2">Monto</th>
                <th className="border border-gray-400 py-2">Cobratario</th>
                <th className="border border-gray-400 py-2">Comentarios</th>
                <th className="border border-gray-400 py-2">Tipo Pago</th>
                <th className="border border-gray-400 py-2 w-20">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="text-gray-700">
                  <td className="border border-gray-300 py-2">15/Ene/2026</td>
                  <td className="border border-gray-300 py-2">{i}</td>
                  <td className="border border-gray-300 py-2">$ 200.00</td>
                  <td className="border border-gray-300 py-2 uppercase">Roman G.</td>
                  <td className="border border-gray-300 py-2 italic text-gray-400 text-xs text-left px-4">Todo bien</td>
                  <td className="border border-gray-300 py-2">
                    <span className="bg-[#2ecc71] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">EFECTIVO</span>
                  </td>
                  <td className="border border-gray-300 py-2"></td>
                </tr>
              ))}
              {[...Array(5)].map((_, i) => (
                <tr key={`empty-${i}`} className="h-8 border border-gray-300">
                  <td className="border border-gray-300" colSpan="7"></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">Mostrando del 1 al 10 de 33</p>
        </div>

        {/* SECCIÓN INFERIOR: Configuración de la Renovación */}
        <div className="bg-gray-100 p-6 border-t border-gray-300">
          <h3 className="text-gray-500 text-[11px] font-bold uppercase mb-4 tracking-wider">Configuración de la Renovación</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Monto Solicitado</label>
              <input type="text" defaultValue="$5,000.00" className="border border-gray-400 bg-white rounded px-2 py-1.5 text-xs font-bold text-gray-700 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Fecha de inicio</label>
              <div className="relative custom-datepicker-container">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="w-full border border-gray-400 bg-white rounded px-2 py-1.5 text-xs focus:outline-none"
                />
                <Calendar className="absolute right-2 top-1.5 text-blue-400 pointer-events-none" size={14} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Esquema de cobro</label>
              <select className="border border-gray-400 bg-white rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none uppercase font-bold">
                <option>POR DEFINIR</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Taza de interés</label>
              <div className="flex">
                <input type="text" defaultValue="30" className="w-full border border-gray-400 bg-white rounded-l px-2 py-1.5 text-xs focus:outline-none text-center" />
                <span className="bg-gray-200 border border-l-0 border-gray-400 rounded-r px-2 py-1.5 text-[10px] text-gray-500 flex items-center font-bold">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600 font-bold">Plazo a pagar</label>
              <div className="flex">
                <input type="text" defaultValue="26" className="w-full border border-gray-400 bg-white rounded-l px-2 py-1.5 text-xs focus:outline-none text-center" />
                <span className="bg-gray-200 border border-l-0 border-gray-400 rounded-r px-2 py-1.5 text-[10px] text-gray-500 flex items-center font-bold">Pagos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}