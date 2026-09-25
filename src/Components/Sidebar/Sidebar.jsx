import React, { useState } from 'react';
import { 
  Home, Users, Landmark, MapPin, Calendar, 
  RefreshCcw, Briefcase, CreditCard, Building2, 
  Menu, X, ShieldAlert, Smartphone 
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

// 📋 MENÚ AGRUPADO POR SECCIONES LÓGICAS
const menuSections = [
  {
    title: 'Principal',
    items: [
      { icon: <Home size={18}/>, label: 'Inicio', path: '/dashboard' },
      { icon: <Landmark size={18}/>, label: 'Préstamos', path: '/prestamos' },
      { icon: <Users size={18}/>, label: 'Clientes', path: '/clientes' },
    ]
  },
  {
    title: 'Operación de Campo',
    items: [
      { icon: <Calendar size={18}/>, label: 'Visitas', path: '/visitas' },
      { icon: <MapPin size={18}/>, label: 'Zonas Asig.', path: '/zonas' },
      { icon: <Briefcase size={18}/>, label: 'Cobratarios', path: '/cobratarios' },
    ]
  },
  {
    title: 'Configuración',
    items: [
      { icon: <CreditCard size={18}/>, label: 'Tipos de crédito', path: '/tipos-de-credito' },
      { icon: <RefreshCcw size={18}/>, label: 'Renovaciones', path: '/renovaciones' },
    ]
  },
  {
    title: 'Administración',
    items: [
      { icon: <Building2 size={18}/>, label: 'Empresas', path: '/empresas' },
      { icon: <Users size={18}/>, label: 'Usuarios Web', path: '/usuarios-web' },
      { icon: <ShieldAlert size={18}/>, label: 'Roles', path: '/roles' },
    ]
  }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón de Menú Móvil (Hamburguesa) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-30 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors md:hidden flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Fondo oscuro traslúcido para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-10 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 💻 CONTENEDOR DEL SIDEBAR */}
      <aside className={`
        w-64 bg-white h-[100dvh] border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0
      `}>
        
        {/* Identidad Oficial: CREDURIX */}
        <div className="p-8 mt-10 md:mt-0 flex items-center gap-2 border-b border-gray-50 shrink-0">
          <div className="bg-white p-1 rounded-lg border border-gray-100 flex items-center justify-center shadow-sm">
            <img src="/logo.png" alt="Logo CREDURIX" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-xl font-bold text-blue-900 italic tracking-tighter">CREDURIX</span>
        </div>

        {/* Navegación Organizada por Secciones */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              {/* Título de la Sección */}
              <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </p>
              
              {/* Enlaces de la Sección */}
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <NavLink 
                    key={itemIdx} 
                    to={item.path}
                    onClick={() => setIsOpen(false)} 
                    className={({ isActive }) => 
                      `flex items-center gap-3 p-3 rounded-xl cursor-pointer font-semibold transition-all no-underline ${
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
              </div>
            </div>
          ))}
        </nav>

        {/* Footer del Sidebar: Acceso Operativo PWA */}
        <div className="p-6 pb-10 md:pb-6 border-t border-gray-100 shrink-0 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
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