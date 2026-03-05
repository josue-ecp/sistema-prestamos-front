import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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

// placeholder for pages not implemented yet
function NotImplemented({ name }) {
  return (
    <div className="p-8 w-full min-h-screen">
      <h1 className="text-3xl font-bold">{name} (pendiente)</h1>
      <p className="text-gray-600 mt-4">Página aún no desarrollada.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="ml-64">
        <Routes>
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
          <Route path="/tipos-creditos" element={<NotImplemented name="Tipos de créditos" />} />
          <Route path="/renovaciones/detalle/:id" element={<DetalleRenovacion />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
