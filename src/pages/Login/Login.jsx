import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');

    try {
      // Petición directa al login (sin csrf-cookie)
      const response = await api.post('/login', {
        correo: email,
        password: password
      });

      const data = response.data;

      if (data.status) {
        // Guardamos el token y los datos en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirección inteligente según el rol del usuario (Admin, Cobrador o Cliente)
        if (data.user.tipo === 'cliente') {
          navigate('/pwa/cliente'); // Ruta para la PWA del cliente
        } else if (data.user.tipo === 'cobratario') {
          navigate('/pwa/cobratario'); // Ruta para trabajadores de campo
        } else {
          navigate('/dashboard'); // Ruta para administradores
        }
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error: El servidor no responde o credenciales inválidas');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="relative flex min-h-screen bg-slate-50">
      {/* Panel Izquierdo (Oculto en móviles, visible en pantallas grandes) */}
      <div className="hidden flex-col items-center justify-center border-r border-slate-100 bg-white p-12 lg:flex lg:w-1/2">
        <div className="max-w-md text-center">
          <img 
            src="/Credurix.png" 
            alt="Logo CREDURIX" 
            className="mb-10 mx-auto w-72 object-contain"
          />
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">
            ¡Bienvenido!
          </h1>
          <p className="text-lg font-medium text-slate-500">
            Tu solución financiera rápida y segura
          </p>
        </div>
      </div>

      {/* Panel Derecho / Formulario de Inicio de Sesión */}
      <div className="flex w-full items-center justify-center p-4 sm:p-8 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.07)] sm:space-y-8 sm:p-10">
          
          {/* Logo móvil adaptado */}
          <div className="lg:hidden flex justify-center mb-4 sm:mb-8">
            <img src="/logo3.png" alt="Logo" className="w-36 sm:w-48 object-contain" />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Acceso seguro</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">Inicio de sesión</h2>
            {error && <p className="mt-2 text-xs font-bold text-slate-600 sm:text-sm">{error}</p>}
          </div>

          <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold text-slate-600 sm:text-sm">Correo electrónico</label>
              <input
                type="email"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-5 sm:py-4 sm:text-base"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-600 sm:text-sm">Contraseña</label>
                <button type="button"                 className="text-[11px] font-semibold text-slate-400 transition-colors hover:text-blue-800 sm:text-xs">
                  ¿Has olvidado tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-5 sm:py-4 sm:text-base"
                  placeholder="Ingresa tu contraseña"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-800 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] sm:py-4 sm:text-base"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Iniciar sesión'}
            </button>
          </form>

          {/* Marca de agua flotante en pantallas grandes */}
          <div className="absolute top-8 right-8 hidden lg:block">
              <span className="text-2xl font-bold italic tracking-tighter text-blue-900">CREDURIX</span>
          </div>
        </div>
      </div>
    </div>
  );
}