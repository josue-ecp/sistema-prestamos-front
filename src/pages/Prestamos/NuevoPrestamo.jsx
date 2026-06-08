import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

// Librería para el calendario funcional
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es'; 
registerLocale('es', es);

export default function NuevoPrestamo() {
  const navigate = useNavigate();
  
  // Estado para la fecha de inicio
  const [startDate, setStartDate] = useState(new Date());

  // Estado para los checkboxes de días de visita
  const [diasVisita, setDiasVisita] = useState({
    Lunes: false, Martes: false, Miércoles: false, Jueves: false, 
    Viernes: false, Sábado: false, Domingo: false
  });

  const handleCheckboxChange = (dia) => {
    setDiasVisita(prev => ({ ...prev, [dia]: !prev[dia] }));
  };

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate('/prestamos')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden max-w-5xl">
        <div className="bg-[#0b66c2] px-4 py-2">
          <h2 className="text-white text-sm font-medium">Nuevo Préstamo</h2>
        </div>

        <form className="p-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            
            {/* Campo: Cliente */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Cliente</label>
              <select className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>SELECCIONE UN CLIENTE</option>
                <option>JOSUE CEH POOL</option>
                <option>JOSE PEREZ CHAN</option>
              </select>
            </div>

            {/* Campo: Fecha de inicio (CALENDARIO FUNCIONAL) */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Fecha de inicio</label>
              <div className="relative custom-datepicker-container">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="w-full border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Calendar className="absolute right-2 top-1.5 text-blue-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Campo: Plazo */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Plazo a pagar</label>
              <div className="flex shadow-sm">
                <input type="text" placeholder="26" className="w-full border border-gray-400 bg-gray-50 rounded-l px-2 py-1.5 text-xs focus:outline-none" />
                <span className="bg-gray-200 border border-l-0 border-gray-400 rounded-r px-3 py-1.5 text-[10px] text-gray-500 flex items-center font-bold">Pagos</span>
              </div>
            </div>

            {/* Campo: Esquema */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Esquema de cobro</label>
              <select className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs text-gray-500 focus:outline-none">
                <option>POR DEFINIR</option>
                <option>DIARIO</option>
                <option>SEMANAL</option>
              </select>
            </div>

            {/* Campo: Préstamo */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Préstamo</label>
              <div className="flex shadow-sm">
                <span className="bg-gray-200 border border-r-0 border-gray-400 rounded-l px-2 py-1.5 text-xs text-gray-500">$</span>
                <input type="text" placeholder="0.00" className="w-full border border-gray-400 bg-gray-50 rounded-r px-2 py-1.5 text-xs focus:outline-none" />
              </div>
            </div>

            {/* Campo: Taza de interés */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Taza de interés</label>
              <div className="flex shadow-sm">
                <span className="bg-gray-200 border border-r-0 border-gray-400 rounded-l px-2 py-1.5 text-xs text-gray-500">$</span>
                <input type="text" placeholder="0.00" className="w-full border border-gray-400 bg-gray-50 rounded-r px-2 py-1.5 text-xs focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Sección Días de Visitas */}
          <div className="mt-8">
            <label className="text-gray-500 text-[10px] font-bold block mb-3 uppercase tracking-widest">Días de visitas</label>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              <div className="w-48">
                <div className="relative">
                  <select className="w-full border border-gray-400 bg-gray-50 rounded pl-8 pr-2 py-1.5 text-[10px] font-bold text-gray-600 focus:outline-none uppercase">
                    <option>Semanal</option>
                    <option>Diario</option>
                  </select>
                  <Calendar className="absolute left-2 top-1.5 text-gray-400" size={16} />
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="border-collapse w-full max-w-2xl border border-gray-400 text-center">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-[10px] uppercase">
                      {Object.keys(diasVisita).map(dia => (
                        <th key={dia} className="border border-gray-400 py-1.5 px-3 font-bold">{dia}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {Object.keys(diasVisita).map(dia => (
                        <td key={dia} className="border border-gray-400 p-2">
                          <div className="flex justify-center">
                            <input 
                              type="checkbox" 
                              checked={diasVisita[dia]}
                              onChange={() => handleCheckboxChange(dia)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-3 p-3 bg-[#e5e7eb] rounded">
            <button 
              type="submit"
              className="bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-8 py-1.5 rounded text-xs uppercase transition-all shadow-sm active:scale-95"
            >
              Agregar
            </button>
            <button 
              type="button"
              onClick={() => navigate('/prestamos')}
              className="bg-[#e74c3c] hover:bg-red-600 text-white font-bold px-8 py-1.5 rounded text-xs uppercase transition-all shadow-sm active:scale-95"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}