import React, { useState, useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';

// --- IMPORTACIONES DE LAYOUTS ---
import Sidebar from './Components/Sidebar/Sidebar';
import PwaLayout from './Components/PwaLayout/PwaLayout'; 
import PwaRuta from './pages/Pwa/PwaRuta';

// --- IMPORTACIONES DE PÁGINAS WEB ---
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
import EmpresasList from './pages/Empresas/EmpresasList';
import EmpresaForm from './pages/Empresas/EmpresaForm';
import Login from './pages/Login/Login';
import Suscripciones from './pages/Suscripciones/Suscripciones';
import TiposDeCredito from './pages/TiposDeCredito/TiposDeCredito';
import NuevoTipoCredito from './pages/TiposDeCredito/NuevoTipoCredito';

// --- COMPONENTES TEMPORALES PARA PWA (Puedes moverlos a sus propios archivos después) ---
const PwaClientes = () => (
  <div className="p-6 mt-4">
    <h2 className="text-2xl font-bold text-blue-900">Mis Clientes</h2>
    <p className="text-gray-500">Lista de clientes para cobrar...</p>
  </div>
);
const PwaVisitas = () => (
  <div className="p-6 mt-4">
    <h2 className="text-2xl font-bold text-blue-900">Ruta de Visitas</h2>
    <p className="text-gray-500">Mapa o lista de direcciones...</p>
  </div>
);

// --- LAYOUT DE ESCRITORIO (WEB) ---
function MainLayout() {
  // Estado para el usuario del Header
  const [usuario, setUsuario] = useState({
    nombre: 'Cargando...',
    rol: '...',
    iniciales: ''
  });

  // Efecto para buscar quién está logueado
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

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      {/* Ajuste dinámico del margen para cuando el sidebar sea desplegable en pantallas pequeñas */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-screen overflow-hidden transition-all">
        
        {/* Header Dinámico */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-end items-center px-8 gap-4 shrink-0">
          
          <Link
            to="/planes"
            className="flex items-center gap-2 px-3 py-1.5 mr-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-bold text-xs uppercase tracking-wider hover:bg-blue-100 hover:text-blue-700 transition-all no-underline shadow-sm"
          >
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            Ver Planes 
          </Link>

          {/* Icono de Notificaciones */}
          <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
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

        </header>

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
        
        {/* Hacemos que si entras a localhost:5173/ sin nada, te mande al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta del Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* --- RUTAS WEB (Escritorio) --- */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevo" element={<AgregarCliente />} />
          <Route path="/cobratarios" element={<Cobratarios />} />
          
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/prestamos/nuevo" element={<NuevoPrestamo />} />
          <Route path="/prestamos/:id" element={<DetallePrestamo />} />
          
          <Route path="/usuarios-web" element={<UsuariosWeb />} />
          <Route path="/visitas" element={<Visitas />} />
          
          <Route path="/zonas" element={<ZonasAsignadas />} />
          <Route path="/zonas/nuevo" element={<AgregarZona />} />
          
          <Route path="/renovaciones" element={<Renovaciones />} />
          <Route path="/renovaciones/detalle/:id" element={<DetalleRenovacion />} />
          
          <Route path="/tipos-creditos" element={<TiposDeCredito />} />
          <Route path="/tipos-de-credito/nuevo" element={<NuevoTipoCredito />} />
          
          <Route path="/empresas" element={<EmpresasList />} />
          <Route path="/empresas/nueva" element={<EmpresaForm />} />
          <Route path="/empresas/editar/:id" element={<EmpresaForm />} />
          
          <Route path="/planes" element={<Suscripciones />} />
        </Route>

        {/* --- RUTAS PWA (Móvil) --- */}
        <Route path="/pwa" element={<PwaLayout />}>
          {/* Carga directamente la nueva vista de Ruta que maquetamos */}
          <Route index element={<PwaRuta />} />
          <Route path="clientes" element={<PwaClientes />} />
          <Route path="visitas" element={<PwaVisitas />} />
        </Route>

        {/* Catch-all: Redirección para cualquier ruta que no exista */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;