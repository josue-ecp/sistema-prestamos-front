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
    <div className="flex min-h-screen bg-[#f8fafc] relative">
      {/* Panel Izquierdo (Oculto en móviles, visible en pantallas grandes) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-white">
        <div className="max-w-md text-center">
          <img 
            src="/Credurix.png" 
            alt="Logo CREDURIX" 
            className="mb-10 mx-auto w-72 object-contain"
          />
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            ¡Bienvenido!
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            Tu solución financiera rápida y segura
          </p>
        </div>
      </div>

      {/* Panel Derecho / Formulario de Inicio de Sesión */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16">
        <div className="w-full max-w-md space-y-6 sm:space-y-10">
          
          {/* Logo móvil adaptado */}
          <div className="lg:hidden flex justify-center mb-4 sm:mb-8">
            <img src="/logo3.png" alt="Logo" className="w-36 sm:w-48 object-contain" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">Inicio de sesión</h2>
            {error && <p className="text-red-500 text-xs sm:text-sm font-bold mt-2">{error}</p>}
          </div>

          <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-gray-700 ml-1">Correo electrónico</label>
              <input
                type="email"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-gray-200/50 border-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm sm:text-base text-gray-700"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs sm:text-sm font-bold text-gray-700">Contraseña</label>
                <button type="button" className="text-[11px] sm:text-xs font-semibold text-gray-400 hover:text-blue-600 transition-colors">
                  ¿Has olvidado tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-gray-200/50 border-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm sm:text-base text-gray-700 pr-12"
                  placeholder="Ingresa tu contraseña"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all transform active:scale-[0.98] mt-4 flex justify-center items-center text-sm sm:text-base"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Iniciar sesión'}
            </button>
          </form>

          {/* Marca de agua flotante en pantallas grandes */}
          <div className="absolute top-8 right-8 hidden lg:block">
              <span className="text-2xl font-black italic text-blue-600 tracking-tighter">CREDURIX</span>
          </div>
        </div>
      </div>
    </div>
  );
}