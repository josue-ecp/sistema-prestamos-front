import React from 'react';
import { User, Phone, Mail, MapPin, Settings, LogOut } from 'lucide-react';

export default function PwaPerfil() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* Encabezado Azul */}
      <div className="bg-[#0044ff] pt-12 pb-20 px-5 text-center relative rounded-b-[2.5rem]">
        {/* Avatar */}
        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg">
          <User size={40} className="text-[#0044ff]" />
        </div>
        
        {/* Nombre y Rol */}
        <h1 className="text-2xl font-extrabold text-white">Carlos Méndez</h1>
        <p className="text-blue-200 text-sm font-medium">Cobrador de Campo</p>
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
                <p className="text-xs font-semibold text-gray-800">+52 55 1234 5678</p>
              </div>
            </div>

            {/* Correo */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#eef3fb] flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-[#0044ff]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Correo</p>
                <p className="text-xs font-semibold text-gray-800">carlos.mendez@prestaya.com</p>
              </div>
            </div>

            {/* Zona Asignada */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#eef3fb] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#0044ff]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Zona Asignada</p>
                <p className="text-xs font-semibold text-gray-800">Zona Norte</p>
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
              <p className="text-2xl font-bold text-black leading-none">156</p>
              <p className="text-[10px] text-gray-500 mt-1">Visitas</p>
            </div>
            
            {/* Efectividad */}
            <div>
              <p className="text-2xl font-bold text-green-600 leading-none">89%</p>
              <p className="text-[10px] text-gray-500 mt-1">Efectividad</p>
            </div>

            {/* Cobrado */}
            <div>
              <p className="text-2xl font-bold text-black leading-none">$245K</p>
              <p className="text-[10px] text-gray-500 mt-1">Cobrado</p>
            </div>

            {/* Días Activo */}
            <div>
              <p className="text-2xl font-bold text-[#0044ff] leading-none">21</p>
              <p className="text-[10px] text-gray-500 mt-1">Días Activo</p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 pt-2">
          <button className="flex-1 bg-white border border-gray-100 shadow-sm rounded-xl py-3 flex items-center justify-center gap-2 transition-active active:scale-95">
            <Settings size={16} className="text-black" />
            <span className="text-xs font-bold text-black">Configuración</span>
          </button>
          
          <button className="flex-1 bg-[#fcedeb] rounded-xl py-3 flex items-center justify-center gap-2 transition-active active:scale-95">
            <LogOut size={16} className="text-red-500" />
            <span className="text-xs font-bold text-red-600">Cerrar sesión</span>
          </button>
        </div>

      </div>
    </div>
  );
}