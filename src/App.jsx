
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
  useNavigate,
} from 'react-router-dom';
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
  <div className="mt-4 p-4 sm:p-6">
    <h2 className="text-xl font-bold text-blue-900 sm:text-2xl">
      Ruta de Visitas
    </h2>
    <p className="mt-2 text-sm text-gray-500 sm:text-base">
      Mapa o lista de direcciones...
    </p>
  </div>
);

// --- COMPONENTE DE RUTA PROTEGIDA ---
function ProtectedRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

// --- LAYOUT PRINCIPAL RESPONSIVO ---
function MainLayout() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: 'Cargando...',
    rol: '...',
    iniciales: '',
  });

  useEffect(() => {
    const userDataString = localStorage.getItem('user');

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);

        const partesNombre = userData.nombre
          ? userData.nombre.trim().split(' ')
          : ['Usuario'];

        let letras = 'US';

        if (partesNombre.length >= 2) {
          letras = partesNombre[0][0] + partesNombre[1][0];
        } else if (
          partesNombre.length === 1 &&
          partesNombre[0].length >= 2
        ) {
          letras = partesNombre[0].substring(0, 2);
        }

        let textoRol = 'Usuario';

        if (userData.id_rol === 1) textoRol = 'Super Admin';
        if (userData.id_rol === 2) textoRol = 'Admin Empresa';
        if (userData.id_rol === 3) textoRol = 'Cobratario';

        setUsuario({
          nombre: userData.nombre || 'Usuario Sin Nombre',
          rol: textoRol,
          iniciales: letras.toUpperCase(),
        });
      } catch (error) {
        console.error(
          'Error al leer el usuario del localStorage',
          error
        );
      }
    } else {
      setUsuario({
        nombre: 'Modo Invitado',
        rol: 'Sin sesión',
        iniciales: '??',
      });
    }
  }, []);

  // --- CIERRE DE SESIÓN ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen h-[100dvh] min-h-0 w-full overflow-hidden bg-slate-50">
      {/* MENÚ LATERAL */}
      <Sidebar />

      {/* CONTENEDOR PRINCIPAL */}
      <main className="ml-0 flex h-screen h-[100dvh] min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-all md:ml-64">

        {/* ENCABEZADO RESPONSIVO */}
        <header className="relative z-20 flex w-full shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-2 border-b border-slate-200/80 bg-white/95 px-3 py-2 shadow-sm backdrop-blur sm:gap-4 sm:px-6 sm:py-3 lg:px-8">

          {/* ACCESO A PLANES */}
          <Link
            to="/planes"
            className="mr-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-blue-700 no-underline shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:mr-2 sm:px-4 sm:text-xs"
          >
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-blue-600" />
            <span>Ver Planes</span>
          </Link>

          {/* ACCIONES Y PERFIL */}
          <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-3">

            {/* NOTIFICACIONES */}
            <button
              type="button"
              aria-label="Notificaciones"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Bell size={20} strokeWidth={1.8} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>

            {/* IDENTIDAD DEL USUARIO */}
            <div className="flex min-w-0 items-center gap-2 border-l border-slate-200 pl-2 sm:gap-3 sm:pl-4">

              <div className="flex min-w-0 items-center gap-2 sm:gap-3">

                {/* NOMBRE Y ROL: visibles desde tablet */}
                <div className="hidden max-w-[180px] text-right sm:block">
                  <p className="m-0 truncate text-sm font-bold leading-tight text-slate-800">
                    {usuario.nombre}
                  </p>

                  <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {usuario.rol}
                  </span>
                </div>

                {/* AVATAR */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-md shadow-blue-200/70 sm:h-10 sm:w-10"
                  aria-label={`Usuario: ${usuario.nombre}`}
                  title={`${usuario.nombre} - ${usuario.rol}`}
                >
                  {usuario.iniciales}
                </div>

                <ChevronDown
                  size={16}
                  className="hidden shrink-0 text-slate-400 sm:block"
                />
              </div>

              {/* CERRAR SESIÓN */}
              <button
                type="button"
                onClick={handleLogout}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <LogOut size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
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

        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS PROTEGIDAS: ESCRITORIO WEB */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* REDIRECCIÓN PRINCIPAL */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* MÓDULOS PRINCIPALES */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios-web" element={<UsuariosWeb />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/visitas" element={<Visitas />} />

            {/* CLIENTES */}
            <Route path="/clientes" element={<Clientes />} />
            <Route
              path="/clientes/nuevo"
              element={<AgregarCliente />}
            />
            <Route
              path="/clientes/editar/:id"
              element={<AgregarCliente />}
            />

            {/* COBRATARIOS */}
            <Route path="/cobratarios" element={<Cobratarios />} />
            <Route
              path="/cobratarios/detalle/:id"
              element={<DetalleCobratario />}
            />

            {/* PRÉSTAMOS */}
            <Route path="/prestamos" element={<Prestamos />} />
            <Route
              path="/prestamos/nuevo"
              element={<NuevoPrestamo />}
            />
            <Route
              path="/prestamos/:id"
              element={<DetallePrestamo />}
            />

            {/* ZONAS */}
            <Route path="/zonas" element={<ZonasAsignadas />} />
            <Route path="/zonas/nuevo" element={<AgregarZona />} />
            <Route
              path="/zonas/editar/:id"
              element={<AgregarZona />}
            />

            {/* RENOVACIONES */}
            <Route path="/renovaciones" element={<Renovaciones />} />
            <Route
              path="/renovaciones/detalle/:id"
              element={<DetalleRenovacion />}
            />

            {/* TIPOS DE CRÉDITO */}
            <Route
              path="/tipos-de-credito"
              element={<TiposDeCredito />}
            />
            <Route
              path="/tipos-creditos"
              element={<TiposDeCredito />}
            />
            <Route
              path="/tipos-de-credito/nuevo"
              element={<NuevoTipoCredito />}
            />
            <Route
              path="/tipos-de-credito/editar/:id"
              element={<NuevoTipoCredito />}
            />
            <Route
              path="/tipos-de-credito/detalle/:id"
              element={<DetalleTipoCredito />}
            />

            {/* EMPRESAS */}
            <Route path="/empresas" element={<EmpresasList />} />
            <Route
              path="/empresas/nueva"
              element={<EmpresaForm />}
            />
            <Route
              path="/empresas/editar/:id"
              element={<EmpresaForm />}
            />
            <Route
              path="/empresas/detalle/:id"
              element={<DetalleEmpresa />}
            />

            {/* PLANES TARIFARIOS */}
            <Route path="/planes" element={<Suscripciones />} />

            {/* HISTORIAL DE PAGOS */}
            <Route
              path="/historial-pagos"
              element={<HistorialPagos />}
            />
          </Route>
        </Route>

        {/* RUTAS PWA: COBRATARIO */}
        <Route
          path="/pwa"
          element={<Navigate to="/pwa/cobratario" replace />}
        />

        <Route path="/pwa/cobratario" element={<PwaLayout />}>
          <Route index element={<PwaRuta />} />
          <Route path="clientes" element={<PwaClientes />} />
          <Route path="visitas" element={<PwaVisitas />} />
          <Route path="resumen" element={<PwaResumen />} />
          <Route path="perfil" element={<PwaPerfil />} />
        </Route>

        {/* RUTAS PWA: CLIENTE */}
        <Route path="/pwa/cliente" element={<PwaClientLayout />}>
          <Route index element={<HomeClient />} />
          <Route path="pagos" element={<PwaMisPagos />} />
          <Route path="perfil" element={<PwaPerfilCliente />} />
        </Route>

        {/* REDIRECCIÓN PARA RUTAS DESCONOCIDAS */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}