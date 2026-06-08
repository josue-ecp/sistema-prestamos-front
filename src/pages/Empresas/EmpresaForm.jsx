import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Eye, EyeOff, AtSign } from 'lucide-react';

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
          const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}`);
          const result = await response.json();

          if (response.ok && result.status) {
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
      const url = id ? `http://127.0.0.1:8000/api/empresas/${id}` : 'http://127.0.0.1:8000/api/empresas';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(datosFormulario)
      });

      const result = await response.json();

      if (response.ok && result.status) {
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
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate('/empresas')}
          className="flex items-center gap-2 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft />
          Volver al listado
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="bg-[#0061bd] px-8 py-4">
            {/* Título dinámico */}
            <h2 className="text-white">{id ? 'Editar empresa' : 'Agregar empresa'}</h2>
          </div>

          {message.text && (
            <div className={`mx-8 mt-6 rounded-3xl p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
              <p className="font-semibold mb-1">{message.type === 'success' ? '¡Éxito!' : 'Error'}</p>
              <p className="text-sm leading-6">{message.text}</p>
            </div>
          )}

          <form className="p-10 space-y-8" onSubmit={handleSubmit}>
            
            <div className="space-y-1">
              <label className="ml-1 block">Nombre de empresa</label>
              <input 
                type="text" 
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                required
                className="w-full p-3 bg-[#e0e0e0] border border-gray-400 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="ml-1 block">Nombre(s) y Apellidos (Responsable)</label>
              <input 
                type="text" 
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                required
                className="w-full p-3 bg-[#e0e0e0] border border-gray-400 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="ml-1 block">Correo electrónico</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    className="w-full p-3 pr-10 bg-[#e0e0e0] border border-gray-400 outline-none focus:border-blue-500 transition-all"
                  />
                  <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="ml-1 block">
                  Contraseña {id && <span className="text-xs text-gray-500">(Deja en blanco para no cambiarla)</span>}
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!id} // Solo es obligatoria si estamos creando una nueva
                    minLength="6"
                    className="w-full p-3 pr-10 bg-[#e0e0e0] border border-gray-400 outline-none focus:border-blue-500 transition-all"
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
                <label className="ml-1 block">Fecha de vencimiento de licencia</label>
                <div className="flex">
                  <input 
                    type="date" 
                    ref={dateInputRef}
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    required
                    className="w-full p-3 bg-[#e0e0e0] border border-gray-400 border-r-0 outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0"
                  />
                  <div 
                    onClick={handleOpenCalendar}
                    className="px-3 flex items-center justify-center bg-[#f4f4f4] border border-gray-400 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <CalendarIcon className="text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="ml-1 block">Usuarios WEB</label>
                <select 
                  value={usuariosWeb}
                  onChange={(e) => setUsuariosWeb(e.target.value)}
                  required
                  className="w-full p-3 bg-[#e0e0e0] border border-gray-400 outline-none appearance-none cursor-pointer"
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
                <label className="ml-1 block">Cobratarios</label>
                <select 
                  value={cobratarios}
                  onChange={(e) => setCobratarios(e.target.value)}
                  required
                  className="w-full p-3 bg-[#e0e0e0] border border-gray-400 outline-none appearance-none cursor-pointer"
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

            <div className="pt-10 flex gap-4">
              <button 
                type="submit"
                disabled={loading}
                className={`bg-[#2ecc71] hover:bg-[#27ae60] text-white px-10 py-3 rounded-lg shadow-md transition-all active:scale-95 uppercase tracking-widest ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Aceptar')}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/empresas')}
                disabled={loading}
                className={`bg-[#ff4d4d] hover:bg-[#e60000] text-white px-10 py-3 rounded-lg shadow-md transition-all active:scale-95 uppercase tracking-widest ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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