import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, CreditCard, User } from 'lucide-react';

export default function PwaClientLayout() {
  const clientMenu = [
    { icon: <Home size={22} />, label: 'Inicio', path: '/pwa/cliente' },
    { icon: <CreditCard size={22} />, label: 'Mis Pagos', path: '/pwa/cliente/pagos' },
    { icon: <User size={22} />, label: 'Perfil', path: '/pwa/cliente/perfil' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Contenido Dinámico */}
      <main className="flex-1 overflow-y-auto pb-20"> 
        <Outlet /> 
      </main>

      {/* Navegación Inferior */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center p-2 pb-4 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {clientMenu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            // Importante: 'end' solo debe ser true para la ruta raíz del layout
            end={item.path === '/pwa/cliente'} 
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-blue-700' : 'text-gray-400'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}