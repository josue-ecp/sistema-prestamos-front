import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut } from 'lucide-react';

import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Clientes from './pages/Clientes/Clientes';
import AgregarCliente from './pages/Clientes/AgregarCliente';
import Cobratarios from './pages/Cobratarios/Cobratarios';
import DetalleCobratario from './pages/Cobratarios/DetalleCobratario';
import Prestamos from './pages/Prestamos/Prestamos';
import NuevoPrestamo from './pages/Prestamos/NuevoPrestamo';
import DetallePrestamo from './pages/Prestamos/DetallePrestamo';
import UsuariosWeb from './pages/UsuariosWeb/UsuariosWeb';
import Roles from './pages/Roles/Roles';
import Visitas from './pages/Visitas/Visitas';
import ZonasAsignadas from './pages/Zonas/ZonasAsignadas';
import AgregarZona from './pages/Zonas/AgregarZona';
import Renovaciones from './pages/Renovaciones/Renovaciones';
import DetalleRenovacion from './pages/Renovaciones/DetalleRenovacion';
import EmpresasList from './pages/Empresas/EmpresasList';
import EmpresaForm from './pages/Empresas/EmpresaForm';
import DetalleEmpresa from './pages/Empresas/DetalleEmpresa';
import Login from './pages/Login/Login';

import TiposDeCredito from './pages/TiposDeCredito/TiposDeCredito';
import NuevoTipoCredito from './pages/TiposDeCredito/NuevoTipoCredito';
import DetalleTipoCredito from './pages/TiposDeCredito/DetalleTipoCredito';

function ProtectedRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function MainLayout() {
  const navigate = useNavigate();

  // 1. Estado para el usuario del Header
  const [usuario, setUsuario] = useState({
    nombre: 'Cargando...',
    rol: '...',
    iniciales: ''
  });

  // 2. Efecto para buscar quién está logueado
  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        
        const partesNombre = userData.nombre ? userData.nombre.trim().split(' ') : ['Usuario'];
        let letras = 'US'; 
        
        if (partesNombre.length >= 2) {
          letras = partesNombre[0][0] + partesNombre[1][0]; 
        } else if (partesNombre.length === 1 && partesNombre[0].length >= 2) {
          letras = partesNombre[0].substring(0, 2);
        }

        let textoRol = 'Usuario';
        if (userData.id_rol === 1) textoRol = 'Super Admin';
        if (userData.id_rol === 2) textoRol = 'Admin Empresa';
        if (userData.id_rol === 3) textoRol = 'Cobratario';

        setUsuario({
          nombre: userData.nombre || 'Usuario Sin Nombre',
          rol: textoRol,
          iniciales: letras.toUpperCase()
        });
      } catch (error) {
        console.error("Error al leer el usuario del localStorage", error);
      }
    } else {
      setUsuario({
        nombre: 'Modo Invitado',
        rol: 'Sin sesión',
        iniciales: '??'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Header  */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-end items-center px-8 gap-6 shrink-0">
          <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800 leading-none">{usuario.nombre}</p>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  {usuario.rol}
                </span>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
                {usuario.iniciales}
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
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

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Clientes */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevo" element={<AgregarCliente />} />

          {/* Cobratarios */}
          <Route path="/cobratarios" element={<Cobratarios />} />
          <Route path="/cobratarios/detalle/:id" element={<DetalleCobratario />} />

          {/* Préstamos */}
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/prestamos/nuevo" element={<NuevoPrestamo />} />
          <Route path="/prestamos/:id" element={<DetallePrestamo />} />

          {/* Usuarios */}
          <Route path="/usuarios-web" element={<UsuariosWeb />} />
          <Route path="/roles" element={<Roles />} />
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
          <Route path="/tipos-de-credito/editar/:id" element={<NuevoTipoCredito />} />
          <Route path="/tipos-de-credito/detalle/:id" element={<DetalleTipoCredito />} />

          {/* Rutas de Empresas */}
          <Route path="/empresas" element={<EmpresasList />} />
          <Route path="/empresas/nueva" element={<EmpresaForm />} />
          <Route path="/empresas/editar/:id" element={<EmpresaForm />} />
          <Route path="/empresas/detalle/:id" element={<DetalleEmpresa />} />

          {/* Redirecciones al final para que no choquen */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}