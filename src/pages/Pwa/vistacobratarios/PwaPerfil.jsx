import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Settings, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api'; 

export default function PwaPerfil() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [perfil, setPerfil] = useState({
    nombre: '',
    rol: '',
    telefono: '',
    correo: '',
    zona: '',
    stats: { visitas: 0, efectividad: 0, cobrado: 0, dias_activos: 0 }
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await api.get('/perfil');
        setPerfil(response.data);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleLogout = async () => {
    // Confirmación nativa simple y segura
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      setIsLoggingOut(true);
      try {
        // Le avisamos a Laravel que destruya el token
        await api.post('/logout');
      } catch (error) {
        console.error("Error al cerrar sesión en el servidor:", error);
      } finally {
        // Limpiamos el celular y redirigimos sin importar qué responda el servidor
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); // O la ruta que tengas configurada para el Login
      }
    }
  };

  // Formateador para convertir 1500 a 1.5K
  const formatMoneyK = (amount) => {
    const num = Number(amount) || 0;
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num}`;
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5 font-bold text-slate-500">Cargando perfil...</div>;
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50 pb-24">
      
      {/* Encabezado Azul */}
      <div className="relative rounded-b-3xl bg-gradient-to-br from-blue-800 to-blue-950 px-4 pb-20 pt-8 text-center sm:px-5 sm:pt-12">
        {/* Avatar */}
        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg">
          <User size={40} className="text-blue-800" />
        </div>
        
        {/* Nombre y Rol */}
        <h1 className="break-words text-xl font-extrabold capitalize text-white sm:text-2xl">{perfil.nombre}</h1>
        <p className="text-blue-200 text-sm font-medium">{perfil.rol}</p>
      </div>

      {/* Contenedor superpuesto (Margen negativo) */}
      <div className="relative z-10 -mt-10 space-y-4 px-4 sm:px-5">
        
        {/* Tarjeta: Información Personal */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-sm font-bold text-slate-900">Información Personal</h2>
          
          <div className="space-y-4">
            {/* Teléfono */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Phone size={18} className="text-blue-800" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 font-medium">Teléfono</p>
                <p className="break-words text-xs font-semibold text-gray-800">{perfil.telefono}</p>
              </div>
            </div>

            {/* Correo */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Mail size={18} className="text-blue-800" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-500 font-medium">Correo</p>
                <p className="break-all text-xs font-semibold text-gray-800">{perfil.correo}</p>
              </div>
            </div>

            {/* Zona Asignada */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                <MapPin size={18} className="text-blue-800" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 font-medium">Zona Asignada</p>
                <p className="break-words text-xs font-semibold text-gray-800">{perfil.zona}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta: Estadísticas del Mes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-sm font-bold text-slate-900">Estadísticas del Mes</h2>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-center">
            {/* Visitas */}
            <div>
              <p className="break-words text-xl font-bold leading-none text-slate-900 sm:text-2xl">{perfil.stats.visitas}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold">Visitas</p>
            </div>
            
            {/* Efectividad */}
            <div>
              <p className="break-words text-xl font-bold leading-none text-blue-800 sm:text-2xl">{perfil.stats.efectividad}%</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold">Efectividad</p>
            </div>

            {/* Cobrado */}
            <div>
              <p className="break-words text-xl font-bold leading-none text-slate-900 sm:text-2xl">{formatMoneyK(perfil.stats.cobrado)}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold">Cobrado</p>
            </div>

            {/* Días Activo */}
            <div>
              <p className="break-words text-xl font-bold leading-none text-blue-800 sm:text-2xl">{perfil.stats.dias_activos}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold">Días Activo</p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2 pt-2 sm:gap-3">
          <button className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-3 shadow-sm transition hover:bg-slate-50 active:scale-95 sm:gap-2">
            <Settings size={16} className="text-slate-700" />
            <span className="text-[11px] font-bold text-slate-700 sm:text-xs">Ajustes</span>
          </button>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-2 py-3 transition hover:bg-slate-200 active:scale-95 sm:gap-2"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="animate-spin text-slate-600" />
            ) : (
              <LogOut size={16} className="text-slate-600" />
            )}
            <span className="text-[11px] font-bold text-slate-700 sm:text-xs">
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}