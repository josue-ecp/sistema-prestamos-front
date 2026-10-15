import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Eye, EyeOff, AtSign } from 'lucide-react';
import api from '../../api';

export default function EmpresaForm() {
  const navigate = useNavigate();
  // Extraemos el ID de la URL (si existe)
  const { id } = useParams(); 
  const dateInputRef = useRef(null);

  // Estados del formulario
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [responsable, setResponsable] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [usuariosWeb, setUsuariosWeb] = useState('');
  const [cobratarios, setCobratarios] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  };

  // EFECTO MAGICO: Si hay un ID en la URL, vamos por los datos a Laravel
  useEffect(() => {
    if (id) {
      const cargarEmpresa = async () => {
        try {
          const response = await api.get(`/empresas/${id}`, { validateStatus: () => true });
          const result = response.data;

          if (response.status >= 200 && response.status < 300 && result.status) {
            const emp = result.data;
            // Llenamos los estados con lo que llegó de la BD
            setNombreEmpresa(emp.nombre_negocio);
            setResponsable(emp.responsable);
            setCorreo(emp.correo);
            setFechaVencimiento(emp.fecha_vencimiento_licencia);
            setUsuariosWeb(emp.limite_usuarios_web);
            setCobratarios(emp.limite_cobratarios);
            // OJO: La contraseña nunca se devuelve por seguridad, así que se queda en blanco
          }
        } catch (error) {
          console.error("Error al cargar los datos para editar:", error);
        }
      };
      cargarEmpresa();
    }
  }, [id]);

  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch {
        dateInputRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const datosFormulario = {
      nombreEmpresa,
      responsable,
      correo,
      password, // Si está editando y lo dejó en blanco, Laravel lo ignorará
      fechaVencimiento,
      usuariosWeb: parseInt(usuariosWeb) || 1,
      cobratarios: parseInt(cobratarios) || 1,
    };

    try {
      // DECISIÓN INTELIGENTE: ¿Es POST (Crear) o PUT (Editar)?
      const url = id ? `/empresas/${id}` : '/empresas';
      const method = id ? 'PUT' : 'POST';

      const response = await api.request({
        url,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: datosFormulario,
        validateStatus: () => true
      });

      const result = response.data;

      if (response.status >= 200 && response.status < 300 && result.status) {
        showMessage(id ? 'Empresa actualizada correctamente' : 'Empresa creada con éxito', 'success');
        window.setTimeout(() => navigate('/empresas'), 800);
      } else {
        showMessage('Error del servidor: ' + (result.message || 'Verifica los datos'), 'error');
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      showMessage('Error de conexión con el backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate('/empresas')}
          className="mb-5 flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <ArrowLeft />
          Volver al listado
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
          
          <div className="bg-blue-900 px-6 py-5 sm:px-8">
            {/* Título dinámico */}
            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">{id ? 'Editar empresa' : 'Agregar empresa'}</h2>
          </div>

          {message.text && (
            <div className={`mx-5 mt-5 rounded-xl border p-4 sm:mx-8 ${message.type === 'success' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-300 bg-slate-100 text-slate-900'}`}>
              <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
              <p className="text-sm leading-6">{message.text}</p>
            </div>
          )}

          <form className="space-y-6 p-5 sm:space-y-8 sm:p-8" onSubmit={handleSubmit}>
            
            <div className="space-y-1">
              <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-slate-600">Nombre de empresa</label>
              <input 
                type="text" 
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-1">
              <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-slate-600">Nombre(s) y Apellidos (Responsable)</label>
              <input 
                type="text" 
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-slate-600">Correo electrónico</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Contraseña {id && <span className="text-xs text-gray-500">(Deja en blanco para no cambiarla)</span>}
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!id} // Solo es obligatoria si estamos creando una nueva
                    minLength="6"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="space-y-1">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-slate-600">Fecha de vencimiento de licencia</label>
                <div className="flex">
                  <input 
                    type="date" 
                    ref={dateInputRef}
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    required
                    className="w-full cursor-pointer rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0"
                  />
                  <div 
                    onClick={handleOpenCalendar}
                    className="flex cursor-pointer items-center justify-center rounded-r-xl border border-slate-200 bg-slate-100 px-3 text-blue-800 transition-colors hover:bg-blue-50"
                  >
                    <CalendarIcon className="text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-slate-600">Usuarios WEB</label>
                <select 
                  value={usuariosWeb}
                  onChange={(e) => setUsuariosWeb(e.target.value)}
                  required
                  className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px'}}
                >
                   <option value="">Seleccionar...</option>
                   <option value="1">1 Usuario</option>
                   <option value="2">2 Usuarios</option>
                   <option value="3">3 Usuarios</option>
                   <option value="4">4 Usuarios</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="ml-1 block text-xs font-bold uppercase tracking-wide text-slate-600">Cobratarios</label>
                <select 
                  value={cobratarios}
                  onChange={(e) => setCobratarios(e.target.value)}
                  required
                  className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px'}}
                >
                   <option value="">Seleccionar...</option>
                   <option value="1">1 Usuario</option>
                   <option value="2">2 Usuarios</option>
                   <option value="3">3 Usuarios</option>
                   <option value="4">4 Usuarios</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:pt-8">
              <button 
                type="submit"
                disabled={loading}
                className={`rounded-xl bg-blue-800 px-8 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] sm:px-10 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Aceptar')}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/empresas')}
                disabled={loading}
                className={`rounded-xl border border-slate-200 bg-white px-8 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 sm:px-10 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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