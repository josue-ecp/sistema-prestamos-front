import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import { UsuariosWeb } from './pages/UsuariosWeb/UsuariosWeb';
import Sidebar from './Components/Sidebar/Sidebar';
import AgregarCliente from './pages/Clientes/AgregarCliente';
import Cobratarios from './pages/Cobratarios/Cobratarios';
import Prestamos from './pages/Prestamos/Prestamos';
import DetallePrestamo from './pages/Prestamos/DetallePrestamo';
import NuevoPrestamo from './pages/Prestamos/NuevoPrestamo';

import Clientes from './pages/Clientes/Clientes';
import { Bell, ChevronDown } from 'lucide-react'; 

// 1. EL LAYOUT MAESTRO (Contiene el Sidebar y el Header)
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sirve para dejar el sidebar fijo*/}
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Para dejar fijo el header (Barra de arriba) */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-end items-center px-8 gap-6 shrink-0">
          <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 leading-none">Admin Principal</p>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Super admin</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
              AP
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
};

// 2. CONFIGURACIÓN DE RUTAS
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas con Layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios-web" element={<UsuariosWeb />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevo" element={<AgregarCliente />} />
          <Route path="/cobratarios" element={<Cobratarios />} />
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/prestamos/detalle/:id" element={<DetallePrestamo />} />
          <Route path="/prestamos/nuevo" element={<NuevoPrestamo />} />

          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;