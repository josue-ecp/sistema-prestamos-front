import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import axios from 'axios';

// Librería para el calendario funcional
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es'; 
registerLocale('es', es);

export default function NuevoPrestamo() {
  const navigate = useNavigate();
  
  // Lista de clientes reales cargados desde la BD
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estado unificado del formulario de préstamo
  const [formData, setFormData] = useState({
    id_cliente: '',
    fecha_desembolso: new Date(),
    plazo: '26',
    esquema_cobro: 'semanal',
    monto: '',
    tasa_interes: ''
  });

  // Estado para los checkboxes de días de visita
  const [diasVisita, setDiasVisita] = useState({
    Lunes: false, Martes: false, Miércoles: false, Jueves: false, 
    Viernes: false, Sábado: false, Domingo: false
  });

  // Cargar clientes reales al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/clientes/disponibles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (dia) => {
    setDiasVisita(prev => ({ ...prev, [dia]: !prev[dia] }));
  };

  // Función para enviar el nuevo préstamo a Laravel
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.id_cliente || !formData.monto) {
      setErrorMessage('Selecciona un cliente e ingresa el monto del préstamo.');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Formatear la fecha a YYYY-MM-DD para MySQL
      const fechaFormateada = formData.fecha_desembolso.toISOString().split('T')[0];

      const payload = {
        id_cliente: formData.id_cliente,
        fecha_desembolso: fechaFormateada,
        plazo: formData.plazo,
        esquema_cobro: formData.esquema_cobro.toLowerCase(),
        monto: formData.monto,
        tasa_interes: formData.tasa_interes || 0,
        dias_visita: diasVisita
      };

      await axios.post('http://127.0.0.1:8000/api/prestamos', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/prestamos');
    } catch (error) {
      console.error("Error al registrar préstamo:", error);
      setErrorMessage(error.response?.data?.message || 'Error al registrar el préstamo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl">
      {/* Botón Volver */}
      <button 
        type="button"
        onClick={() => navigate('/prestamos')}
        className="mb-5 flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
        <div className="bg-blue-900 px-6 py-5 sm:px-8">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Cartera de crédito</p>
          <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">Nuevo Préstamo</h2>
        </div>

        {errorMessage && (
          <div className="mx-5 mt-5 rounded-xl border border-slate-300 bg-slate-100 p-4 text-xs text-slate-800 sm:mx-8">
            {errorMessage}
          </div>
        )}

        <form className="p-5 sm:p-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-3 sm:gap-y-6">
            
            {/* Campo: Cliente Dinámico */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Cliente</label>
              <select 
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                required
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <option value="">{loadingClientes ? 'Cargando clientes...' : 'SELECCIONE UN CLIENTE'}</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            {/* Campo: Fecha de inicio */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Fecha de inicio</label>
              <div className="relative custom-datepicker-container">
                <DatePicker
                  selected={formData.fecha_desembolso}
                  onChange={(date) => setFormData({ ...formData, fecha_desembolso: date })}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
                <Calendar className="pointer-events-none absolute right-3 top-3 text-blue-700" size={16} />
              </div>
            </div>

            {/* Campo: Plazo */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Plazo a pagar</label>
              <div className="flex">
                <input 
                  type="number" 
                  name="plazo"
                  value={formData.plazo}
                  onChange={handleChange}
                  placeholder="26" 
                  className="w-full rounded-l-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" 
                />
                <span className="flex items-center rounded-r-xl border border-l-0 border-slate-200 bg-slate-100 px-3 py-3 text-xs font-bold text-slate-500">Pagos</span>
              </div>
            </div>

            {/* Campo: Esquema */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Esquema de cobro</label>
              <select 
                name="esquema_cobro"
                value={formData.esquema_cobro}
                onChange={handleChange}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 uppercase"
              >
                <option value="semanal">Semanal</option>
                <option value="diario">Diario</option>
              </select>
            </div>

            {/* Campo: Préstamo (Monto) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Préstamo</label>
              <div className="flex">
                <span className="rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-500">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  placeholder="0.00" 
                  required
                  className="w-full rounded-r-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" 
                />
              </div>
            </div>

            {/* Campo: Tasa de interés */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Tasa de interés</label>
              <div className="flex">
                <span className="rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-500">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  name="tasa_interes"
                  value={formData.tasa_interes}
                  onChange={handleChange}
                  placeholder="0.00" 
                  className="w-full rounded-r-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" 
                />
              </div>
            </div>
          </div>

          {/* Sección Días de Visitas */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <label className="mb-4 block text-xs font-bold uppercase tracking-[0.14em] text-slate-600">Días de visitas</label>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              
              <div className="w-full md:w-48">
                <div className="relative">
                  <select 
                    value={formData.esquema_cobro}
                    onChange={(e) => setFormData({ ...formData, esquema_cobro: e.target.value })}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 uppercase"
                  >
                    <option value="semanal">Semanal</option>
                    <option value="diario">Diario</option>
                  </select>
                  <Calendar className="absolute left-3 top-3 text-blue-700" size={16} />
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse text-center md:max-w-2xl">
                  <thead>
                    <tr className="bg-white text-[10px] uppercase text-slate-500">
                      {Object.keys(diasVisita).map(dia => (
                        <th key={dia} className="border border-slate-200 px-3 py-2 font-bold">{dia}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {Object.keys(diasVisita).map(dia => (
                        <td key={dia} className="border border-slate-200 p-3">
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

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:mt-10 sm:flex-row sm:justify-end">
            <button 
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-xl bg-blue-800 px-8 py-3 text-xs font-bold uppercase text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Agregar'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/prestamos')}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-8 py-3 text-xs font-bold uppercase text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}