import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          correo: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // --- REDIRECCIÓN TEMPORAL A LA VISTA PWA ---
        navigate('/dashboard');
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error: El servidor de Alex no responde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Lado Izquierdo: Bienvenida (Solo visible en Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-white">
        <div className="max-w-md text-center">
          <img 
            src="/prestaya-logo-.png" 
            alt="Logo PrestaYA!" 
            className="mb-10 mx-auto w-72 object-contain"
          />
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            ¡Bienvenido a PrestaYA!
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            Tu solución financiera rápida y segura
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-10">
          
          {/* Logo para versión móvil (oculto en Desktop) */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/logo-entero.png" alt="Logo" className="w-48" />
          </div>

          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Inicio de sesión</h2>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Campo Correo */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Correo electrónico</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-200/50 border-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Contraseña</label>
                <button type="button" className="text-xs font-semibold text-gray-400 hover:text-blue-600 transition-colors">
                  ¿Has olvidado tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-200/50 border-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700"
                  placeholder="Ingresa tu contraseña"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Botón de Acción */}
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all transform active:scale-[0.98] mt-4"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Logo secundario pequeño en la esquina superior (como en tu diseño) */}
          <div className="absolute top-8 right-8 hidden lg:block">
             <span className="text-2xl font-black italic text-blue-600 tracking-tighter">PrestaYA!</span>
          </div>
        </div>
      </div>
    </div>
  );
}