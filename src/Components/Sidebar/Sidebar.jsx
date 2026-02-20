import { 
  Home, Users, Landmark, MapPin, Calendar, 
  RefreshCcw, Briefcase, CreditCard, Smartphone 
} from 'lucide-react';
import { NavLink } from 'react-router-dom'; 

const menuItems = [
  { icon: <Home size={18}/>, label: 'Inicio', path: '/dashboard' },
  { icon: <Users size={18}/>, label: 'Usuarios Web', path: '/usuarios-web' },
  { icon: <Users size={18}/>, label: 'Clientes', path: '/clientes' },
  { icon: <Landmark size={18}/>, label: 'Prestamos', path: '/prestamos' },
  { icon: <MapPin size={18}/>, label: 'Zonas Asig.', path: '/zonas' },
  { icon: <Calendar size={18}/>, label: 'Visitas', path: '/visitas' },
  { icon: <RefreshCcw size={18}/>, label: 'Renovaciones', path: '/renovaciones' },
  { icon: <Briefcase size={18}/>, label: 'Cobratarios', path: '/cobratarios' },
  { icon: <CreditCard size={18}/>, label: 'Tipos de créditos', path: '/tipos-creditos' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-8 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <Landmark size={20} />
        </div>
        <span className="text-xl font-bold text-blue-900 italic tracking-tighter">PrestaYA!</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
         
          <NavLink 
            key={index} 
            to={item.path}
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

      <div className="p-6 border-t border-gray-50 space-y-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
          <Smartphone size={16} /> Vista pwa
        </div>
        <div className="cursor-pointer hover:text-blue-600 pl-6 lowercase first-letter:uppercase">Vista pwa Clientes</div>
      </div>
    </aside>
  );
}