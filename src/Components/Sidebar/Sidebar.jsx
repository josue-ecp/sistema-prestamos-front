import React, { useState } from 'react';
import { 
  Home, Users, Landmark, MapPin, Calendar, 
  RefreshCcw, Briefcase, CreditCard, Smartphone,
  Building2, Menu, X 
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

const menuItems = [
  { icon: <Home size={18}/>, label: 'Inicio', path: '/dashboard' },
  { icon: <Users size={18}/>, label: 'Usuarios Web', path: '/usuarios-web' },
  { icon: <Users size={18}/>, label: 'Clientes', path: '/clientes' },
  { icon: <Landmark size={18}/>, label: 'Prestamos', path: '/prestamos' },
  { icon: <MapPin size={18}/>, label: 'Zonas Asig.', path: '/zonas' },
  { icon: <Calendar size={18}/>, label: 'Visitas', path: '/visitas' },
  { icon: <RefreshCcw size={18}/>, label: 'Renovaciones', path: '/renovaciones' },
  { icon: <Briefcase size={18}/>, label: 'Cobratarios', path: '/cobratarios' },
  { icon: <CreditCard size={18}/>, label: 'Tipos de crédito', path: '/tipos-creditos' },
  { icon: <Building2 size={18}/>, label: 'Empresas', path: '/empresas' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón de Menú Móvil */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-30 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Fondo oscuro cuando el menú móvil está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-10 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Contenedor del Sidebar */}
      <aside className={`
        w-64 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0
      `}>
        
        {/* Logo */}
        <div className="p-8 mt-10 md:mt-0 flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Landmark size={20} />
          </div>
          <span className="text-xl font-bold text-blue-900 italic tracking-tighter">PrestaYA!</span>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink 
              key={index} 
              to={item.path}
              onClick={() => setIsOpen(false)} 
              className={({ isActive }) => 
                `flex items-center gap-3 p-3 rounded-xl cursor-pointer font-semibold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer del Sidebar - Enlace PWA */}
        <div className="p-6 border-t border-gray-50 space-y-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
          <Link 
            to="/pwa" 
            onClick={() => setIsOpen(false)} 
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors no-underline text-gray-400"
          >
            <Smartphone size={16} /> Vista PWA
          </Link>
        </div>
      </aside>
    </>
  );
}