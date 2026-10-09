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
    return <div className="p-5 bg-gray-50 min-h-screen flex justify-center items-center text-gray-500 font-bold">Cargando perfil...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* Encabezado Azul */}
      <div className="bg-[#0044ff] pt-12 pb-20 px-5 text-center relative rounded-b-[2.5rem]">
        {/* Avatar */}
        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg">
          <User size={40} className="text-[#0044ff]" />
        </div>
        
        {/* Nombre y Rol */}
        <h1 className="text-2xl font-extrabold text-white capitalize">{perfil.nombre}</h1>
        <p className="text-blue-200 text-sm font-medium">{perfil.rol}</p>
      </div>

      {/* Contenedor superpuesto (Margen negativo) */}
      <div className="px-5 -mt-10 relative z-10 space-y-4">
        
        {/* Tarjeta: Información Personal */}
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-5">Información Personal</h2>
          
          <div className="space-y-4">
            {/* Teléfono */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#eef3fb] flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-[#0044ff]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Teléfono</p>
                <p className="text-xs font-semibold text-gray-800">{perfil.telefono}</p>
              </div>
            </div>

            {/* Correo */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#eef3fb] flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-[#0044ff]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-500 font-medium">Correo</p>
                <p className="text-xs font-semibold text-gray-800 truncate">{perfil.correo}</p>
              </div>
            </div>

            {/* Zona Asignada */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#eef3fb] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#0044ff]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Zona Asignada</p>
                <p className="text-xs font-semibold text-gray-800">{perfil.zona}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta: Estadísticas del Mes */}
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-5">Estadísticas del Mes</h2>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-center">
            {/* Visitas */}
            <div>
              <p className="text-2xl font-bold text-black leading-none">{perfil.stats.visitas}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold">Visitas</p>
            </div>
            
            {/* Efectividad */}
            <div>
              <p className="text-2xl font-bold text-green-600 leading-none">{perfil.stats.efectividad}%</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold">Efectividad</p>
            </div>

            {/* Cobrado */}
            <div>
              <p className="text-2xl font-bold text-black leading-none">{formatMoneyK(perfil.stats.cobrado)}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold">Cobrado</p>
            </div>

            {/* Días Activo */}
            <div>
              <p className="text-2xl font-bold text-[#0044ff] leading-none">{perfil.stats.dias_activos}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold">Días Activo</p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 pt-2">
          <button className="flex-1 bg-white border border-gray-100 shadow-sm rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition active:scale-95">
            <Settings size={16} className="text-black" />
            <span className="text-xs font-bold text-black">Ajustes</span>
          </button>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 bg-[#fcedeb] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-[#fae1dd] transition active:scale-95"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="text-red-500 animate-spin" />
            ) : (
              <LogOut size={16} className="text-red-500" />
            )}
            <span className="text-xs font-bold text-red-600">
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}