import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Key, LogOut, ChevronRight, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

export default function PwaPerfilCliente() {
  const navigate = useNavigate();
  const [clienteData, setClienteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerfilInfo = async () => {
      try {
        const response = await api.get('/cliente/mi-cuenta');
        setClienteData(response.data);
      } catch (error) {
        console.error("Error al cargar el perfil del cliente:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerfilInfo();
  }, []);

  const handleCerrarSesion = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      // Limpiamos token o datos de sesión si los guardas en localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_type');
      alert("Sesión cerrada correctamente.");
      navigate('/login'); // O la ruta de inicio de sesión de tu PWA
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const nombreCliente = clienteData?.nombre || 'Cliente';
  const iniciales = nombreCliente.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const idCliente = clienteData?.id_cliente || 'N/A';
  const telefonoCliente = clienteData?.telefono || 'No registrado';
  const direccionCliente = clienteData?.direccion || 'No registrada';
  const correoCliente = clienteData?.correo || 'No registrado';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-28 font-sans max-w-md mx-auto shadow-2xl">
      
      {/* Header */}
      <div className="p-5 flex items-center bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-xl transition">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-black text-slate-900 ml-2 uppercase tracking-tight">Mi Perfil</h1>
      </div>

      <div className="p-4 space-y-5 flex-1">

        {/* Tarjeta de Presentación / Avatar */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="w-24 h-24 bg-white border-4 border-white rounded-3xl flex items-center justify-center text-blue-600 text-3xl font-black shadow-lg mb-3 mt-6 relative z-10">
            {iniciales}
          </div>
          
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">{nombreCliente}</h2>
          <div className="flex items-center gap-1.5 mt-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
            <Shield size={12} /> ID de Cliente: #{idCliente}
          </div>
        </div>

        {/* Opciones de Información Personal (Datos Reales) */}
        <div className="bg-white rounded-[28px] p-4 shadow-sm border border-slate-100 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">Información de Contacto</p>
          
          <OptionItem 
            icon={<Phone size={18} />} 
            label="Teléfono" 
            value={telefonoCliente} 
          />
          <OptionItem 
            icon={<Mail size={18} />} 
            label="Correo Electrónico" 
            value={correoCliente} 
          />
          <OptionItem 
            icon={<MapPin size={18} />} 
            label="Dirección" 
            value={direccionCliente} 
          />
        </div>

        {/* Seguridad y Sesión */}
        <div className="bg-white rounded-[28px] p-4 shadow-sm border border-slate-100 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">Seguridad</p>
          
          <div onClick={() => alert("Función de cambio de contraseña en desarrollo.")}>
            <OptionItem icon={<Key size={18} />} label="Cambiar Contraseña" />
          </div>

          <button 
            onClick={handleCerrarSesion} 
            className="w-full flex items-center justify-between p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors mt-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <LogOut size={18} />
              </div>
              <span className="font-black text-xs uppercase tracking-wider">Cerrar Sesión</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

// Componente pequeño adaptado para mostrar valor y etiqueta de forma limpia
function OptionItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
      <div className="flex items-center gap-3.5">
        <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">{icon}</div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
          <span className="font-black text-slate-800 text-xs">{value}</span>
        </div>
      </div>
      {value ? null : <ChevronRight size={16} className="text-slate-300" />}
    </div>
  );
}