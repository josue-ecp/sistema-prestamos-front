import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut } from 'lucide-react';

// --- IMPORTACIONES DE LAYOUTS ---
import Sidebar from './Components/Sidebar/Sidebar'; 
import PwaLayout from './Components/PwaLayout/PwaLayout'; 
import PwaClientLayout from './Components/PwaLayout/PwaClientLayout';
import PwaRuta from './pages/Pwa/vistacobratarios/PwaRuta';
import PwaClientes from './pages/Pwa/vistacobratarios/PwaClientes';
import PwaResumen from './pages/Pwa/vistacobratarios/PwaResumen';
import PwaPerfil from './pages/Pwa/vistacobratarios/PwaPerfil';
import HomeClient from './pages/Pwa/vistaclientes/HomeClient';
import PwaMisPagos from './pages/Pwa/vistaclientes/PwaMisPagos';
import PwaPerfilCliente from './pages/Pwa/vistaclientes/PwaPerfilCliente';

// --- IMPORTACIONES DE PÁGINAS WEB ---
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
import Suscripciones from './pages/Suscripciones/Suscripciones';
import TiposDeCredito from './pages/TiposDeCredito/TiposDeCredito'; 
import NuevoTipoCredito from './pages/TiposDeCredito/NuevoTipoCredito';
import DetalleTipoCredito from './pages/TiposDeCredito/DetalleTipoCredito';
import HistorialPagos from './pages/Historial/HistorialPagos';

// --- COMPONENTES TEMPORALES PARA PWA ---
const PwaVisitas = () => (
  <div className="p-6 mt-4">
    <h2 className="text-2xl font-bold text-blue-900">Ruta de Visitas</h2>
    <p className="text-gray-500">Mapa o lista de direcciones...</p>
  </div>
);

// --- COMPONENTE DE RUTA PROTEGIDA ---
function ProtectedRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// --- LAYOUT DE ESCRITORIO (WEB) ---
function MainLayout() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: 'Cargando...',
    rol: '...',
    iniciales: ''
  });

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
      {/* Menú Lateral Operativo */}
      <Sidebar />
      
      {/* Contenedor de Vistas */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-screen overflow-hidden transition-all">
        
        {/* Header Dinámico Premium */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-end items-center px-8 gap-4 shrink-0">
          
          {/* Botón de acceso a Planes */}
          <Link
            to="/planes"
            className="flex items-center gap-2 px-3 py-1.5 mr-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-bold text-xs uppercase tracking-wider hover:bg-blue-100 hover:text-blue-700 transition-all no-underline shadow-sm"
          >
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            Ver Planes 
          </Link>

          {/* Notificaciones */}
          <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Bloque de Identidad de Perfil */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-none m-0">{usuario.nombre}</p>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1 block">
                  {usuario.rol}
                </span>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-200 flex-shrink-0">
                {usuario.iniciales}
              </div>
              <ChevronDown size={16} className="text-gray-400 flex-shrink-0 hidden sm:block" />
            </div>

            {/* Botón de Cierre de Sesión de tu equipo */}
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-2 ml-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors flex items-center justify-center"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>

        </header>

        {/* Zona operativa de renderizado */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// --- CONFIGURACIÓN PRINCIPAL DE RUTAS ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* --- RUTAS PROTEGIDAS (Escritorio Web) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Redirección raíz interna */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Módulos core */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios-web" element={<UsuariosWeb />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/visitas" element={<Visitas />} />
            
            {/* Clientes */}
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/nuevo" element={<AgregarCliente />} />
            <Route path="/clientes/editar/:id" element={<AgregarCliente />} />
            
            {/* Cobratarios */}
            <Route path="/cobratarios" element={<Cobratarios />} />
            <Route path="/cobratarios/detalle/:id" element={<DetalleCobratario />} />
            
            {/* Préstamos */}
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/prestamos/nuevo" element={<NuevoPrestamo />} />
            <Route path="/prestamos/:id" element={<DetallePrestamo />} />
            
            {/* Zonas */}
            <Route path="/zonas" element={<ZonasAsignadas />} />
            <Route path="/zonas/nuevo" element={<AgregarZona />} />
            <Route path="/zonas/editar/:id" element={<AgregarZona />} />
            
            {/* Renovaciones */}
            <Route path="/renovaciones" element={<Renovaciones />} />
            <Route path="/renovaciones/detalle/:id" element={<DetalleRenovacion />} />
            
            {/* Tipos de Crédito */}
            <Route path="/tipos-de-credito" element={<TiposDeCredito />} />
            <Route path="/tipos-creditos" element={<TiposDeCredito />} />
            <Route path="/tipos-de-credito/nuevo" element={<NuevoTipoCredito />} />
            <Route path="/tipos-de-credito/editar/:id" element={<NuevoTipoCredito />} />
            <Route path="/tipos-de-credito/detalle/:id" element={<DetalleTipoCredito />} />
            
            {/* Empresas */}
            <Route path="/empresas" element={<EmpresasList />} />
            <Route path="/empresas/nueva" element={<EmpresaForm />} />
            <Route path="/empresas/editar/:id" element={<EmpresaForm />} />
            <Route path="/empresas/detalle/:id" element={<DetalleEmpresa />} />
            
            {/* Planes tarifarios */}
            <Route path="/planes" element={<Suscripciones />} />

            {/* Historial de pagos */}
            <Route path="/historial-pagos" element={<HistorialPagos />} />
          </Route>
        </Route>

        {/* --- RUTAS PWA (Móvil) --- */}

        {/* Redirección por defecto: si entran a /pwa, los mandamos a cobratario */}
        <Route path="/pwa" element={<Navigate to="/pwa/cobratario" replace />} />

        {/* 1. Rutas para el COBRATARIO */}
        <Route path="/pwa/cobratario" element={<PwaLayout />}>
          <Route index element={<PwaRuta />} />
          <Route path="clientes" element={<PwaClientes />} />
          <Route path="visitas" element={<PwaVisitas />} />
          <Route path="resumen" element={<PwaResumen />} />
          <Route path="perfil" element={<PwaPerfil />} />
        </Route>

        {/* 2. Rutas para el CLIENTE */}
        <Route path="/pwa/cliente" element={<PwaClientLayout />}>
          <Route index element={<HomeClient />} />
          <Route path="pagos" element={<PwaMisPagos />} />
          <Route path="perfil" element={<PwaPerfilCliente />} />
        </Route>

        {/* Catch-all general si se pierde en la URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}