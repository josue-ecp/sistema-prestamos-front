import React from 'react';
import { User, Mail, Phone, MapPin, Key, LogOut, ChevronRight } from 'lucide-react';

export default function PwaPerfilCliente() {
  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      {/* Header Perfil */}
      <div className="flex flex-col items-center mb-8 mt-4">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
          MG
        </div>
        <h2 className="text-xl font-bold text-gray-800">María González</h2>
        <p className="text-gray-500 text-sm">ID: 882910</p>
      </div>

      {/* Opciones */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-1">
        <OptionItem icon={<User size={20} />} label="Información Personal" />
        <OptionItem icon={<Mail size={20} />} label="Correo Electrónico" />
        <OptionItem icon={<Phone size={20} />} label="Teléfono" />
        <OptionItem icon={<MapPin size={20} />} label="Dirección" />
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mt-4 space-y-1">
        <OptionItem icon={<Key size={20} />} label="Cambiar Contraseña" />
        <button 
          onClick={() => alert("Cerrando sesión...")} 
          className="w-full flex items-center justify-between p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// Componente pequeño para no repetir código
function OptionItem({ icon, label }) {
  return (
    <div className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="text-gray-400">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </div>
  );
}