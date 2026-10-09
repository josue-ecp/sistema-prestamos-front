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
    <div className="p-4 sm:p-6 lg:p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      {/* Botón Volver */}
      <button 
        type="button"
        onClick={() => navigate('/prestamos')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden max-w-5xl mx-auto">
        <div className="bg-[#0b66c2] px-4 py-2">
          <h2 className="text-white text-sm font-medium">Nuevo Préstamo</h2>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {errorMessage}
          </div>
        )}

        <form className="p-4 sm:p-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
            
            {/* Campo: Cliente Dinámico */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Cliente</label>
              <select 
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                required
                className="border border-gray-400 bg-gray-50 rounded px-2 py-2 sm:py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">{loadingClientes ? 'Cargando clientes...' : 'SELECCIONE UN CLIENTE'}</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            {/* Campo: Fecha de inicio */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Fecha de inicio</label>
              <div className="relative custom-datepicker-container">
                <DatePicker
                  selected={formData.fecha_desembolso}
                  onChange={(date) => setFormData({ ...formData, fecha_desembolso: date })}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="w-full border border-gray-400 bg-gray-50 rounded px-2 py-2 sm:py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Calendar className="absolute right-2 top-2 sm:top-1.5 text-blue-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Campo: Plazo */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Plazo a pagar</label>
              <div className="flex shadow-sm">
                <input 
                  type="number" 
                  name="plazo"
                  value={formData.plazo}
                  onChange={handleChange}
                  placeholder="26" 
                  className="w-full border border-gray-400 bg-gray-50 rounded-l px-2 py-2 sm:py-1.5 text-xs focus:outline-none" 
                />
                <span className="bg-gray-200 border border-l-0 border-gray-400 rounded-r px-3 py-2 sm:py-1.5 text-[10px] text-gray-500 flex items-center font-bold">Pagos</span>
              </div>
            </div>

            {/* Campo: Esquema */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Esquema de cobro</label>
              <select 
                name="esquema_cobro"
                value={formData.esquema_cobro}
                onChange={handleChange}
                className="border border-gray-400 bg-gray-50 rounded px-2 py-2 sm:py-1.5 text-xs text-gray-800 focus:outline-none cursor-pointer uppercase"
              >
                <option value="semanal">Semanal</option>
                <option value="diario">Diario</option>
              </select>
            </div>

            {/* Campo: Préstamo (Monto) */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Préstamo</label>
              <div className="flex shadow-sm">
                <span className="bg-gray-200 border border-r-0 border-gray-400 rounded-l px-2 py-2 sm:py-1.5 text-xs text-gray-500">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  placeholder="0.00" 
                  required
                  className="w-full border border-gray-400 bg-gray-50 rounded-r px-2 py-2 sm:py-1.5 text-xs focus:outline-none" 
                />
              </div>
            </div>

            {/* Campo: Tasa de interés */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 text-sm font-medium">Tasa de interés</label>
              <div className="flex shadow-sm">
                <span className="bg-gray-200 border border-r-0 border-gray-400 rounded-l px-2 py-2 sm:py-1.5 text-xs text-gray-500">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  name="tasa_interes"
                  value={formData.tasa_interes}
                  onChange={handleChange}
                  placeholder="0.00" 
                  className="w-full border border-gray-400 bg-gray-50 rounded-r px-2 py-2 sm:py-1.5 text-xs focus:outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Sección Días de Visitas */}
          <div className="mt-8">
            <label className="text-gray-500 text-[10px] font-bold block mb-3 uppercase tracking-widest">Días de visitas</label>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              
              <div className="w-full md:w-48">
                <div className="relative">
                  <select 
                    value={formData.esquema_cobro}
                    onChange={(e) => setFormData({ ...formData, esquema_cobro: e.target.value })}
                    className="w-full border border-gray-400 bg-gray-50 rounded pl-8 pr-2 py-2 sm:py-1.5 text-[10px] font-bold text-gray-600 focus:outline-none uppercase cursor-pointer"
                  >
                    <option value="semanal">Semanal</option>
                    <option value="diario">Diario</option>
                  </select>
                  <Calendar className="absolute left-2 top-2 sm:top-1.5 text-gray-400" size={16} />
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="border-collapse w-full min-w-[500px] md:max-w-2xl border border-gray-400 text-center">
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

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 p-3 bg-[#e5e7eb] rounded">
            <button 
              type="submit"
              disabled={saving}
              className="bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-8 py-2 sm:py-1.5 rounded text-xs uppercase transition-all shadow-sm active:scale-95 text-center cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Agregar'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/prestamos')}
              className="bg-[#e74c3c] hover:bg-red-600 text-white font-bold px-8 py-2 sm:py-1.5 rounded text-xs uppercase transition-all shadow-sm active:scale-95 text-center cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}