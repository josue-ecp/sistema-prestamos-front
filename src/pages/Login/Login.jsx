import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      // Ajustado al puerto estándar de Laravel
      const response = await fetch('http://127.0.0.1:8000/api/login', {
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
        
        // Redirección definitiva al dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error: El servidor no responde');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-10">
          
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/logo-entero.png" alt="Logo" className="w-48" />
          </div>

          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Inicio de sesión</h2>
            {error && <p className="text-red-500 text-sm font-bold mt-2">{error}</p>}
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Correo electrónico</label>
              <input
                type="email"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-5 py-4 rounded-2xl bg-gray-200/50 border-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>

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
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all transform active:scale-[0.98] mt-4 flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Iniciar sesión'}
            </button>
          </form>

          <div className="absolute top-8 right-8 hidden lg:block">
             <span className="text-2xl font-black italic text-blue-600 tracking-tighter">PrestaYA!</span>
          </div>
        </div>
      </div>
    </div>
  );
}