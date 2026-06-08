import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { MapPin, Users, BarChart2, User } from 'lucide-react';

export default function PwaLayout() {
  const pwaMenu = [
    { icon: <MapPin size={22} />, label: 'Ruta', path: '/pwa' },
    { icon: <Users size={22} />, label: 'Clientes', path: '/pwa/clientes' },
    { icon: <BarChart2 size={22} />, label: 'Resumen', path: '/pwa/resumen' },
    { icon: <User size={22} />, label: 'Perfil', path: '/pwa/perfil' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* main content */}
      <main className="flex-1 overflow-y-auto pb-20"> 
        <Outlet /> 
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center p-2 pb-4 z-50">
        {pwaMenu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === '/pwa'} 
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-blue-700' : 'text-gray-800'
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