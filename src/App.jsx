import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';

import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Clientes from './pages/Clientes/Clientes';
import AgregarCliente from './pages/Clientes/AgregarCliente';
import Cobratarios from './pages/Cobratarios/Cobratarios';
import Prestamos from './pages/Prestamos/Prestamos';
import NuevoPrestamo from './pages/Prestamos/NuevoPrestamo';
import DetallePrestamo from './pages/Prestamos/DetallePrestamo';
import UsuariosWeb from './pages/UsuariosWeb/UsuariosWeb';
import Visitas from './pages/Visitas/Visitas';
import ZonasAsignadas from './pages/Zonas/ZonasAsignadas';
import AgregarZona from './pages/Zonas/AgregarZona';
import Renovaciones from './pages/Renovaciones/Renovaciones';
import DetalleRenovacion from './pages/Renovaciones/DetalleRenovacion';
import Login from './pages/Login/Login';

import TiposDeCredito from './pages/TiposDeCredito/TiposDeCredito';
import NuevoTipoCredito from './pages/TiposDeCredito/NuevoTipoCredito';

function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-end items-center px-8 gap-6 shrink-0">
          <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 leading-none">Admin Principal</p>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Super admin
              </span>
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
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Layout con rutas hijas */}
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Clientes */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevo" element={<AgregarCliente />} />

          {/* Cobratarios */}
          <Route path="/cobratarios" element={<Cobratarios />} />

          {/* Préstamos */}
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/prestamos/nuevo" element={<NuevoPrestamo />} />
          <Route path="/prestamos/:id" element={<DetallePrestamo />} />

          {/* Usuarios */}
          <Route path="/usuarios-web" element={<UsuariosWeb />} />
          <Route path="/visitas" element={<Visitas />} />

          {/* Zonas */}
          <Route path="/zonas" element={<ZonasAsignadas />} />
          <Route path="/zonas/nuevo" element={<AgregarZona />} />

          {/* Renovaciones */}
          <Route path="/renovaciones" element={<Renovaciones />} />
          <Route path="/renovaciones/detalle/:id" element={<DetalleRenovacion />} />

          {/* Tipos de crédito */}
          <Route path="/tipos-creditos" element={<TiposDeCredito />} />
          <Route path="/tipos-de-credito/nuevo" element={<NuevoTipoCredito />} />

          {/* Redirecciones */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}