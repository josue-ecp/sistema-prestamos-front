
import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Landmark,
  MapPin,
  Calendar,
  RefreshCcw,
  Briefcase,
  CreditCard,
  Building2,
  Menu,
  X,
  ShieldAlert,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

// --- MENÚ AGRUPADO POR SECCIONES ---
const menuSections = [
  {
    title: 'Principal',
    items: [
      { icon: Home, label: 'Inicio', path: '/dashboard' },
      { icon: Landmark, label: 'Préstamos', path: '/prestamos' },
      { icon: Users, label: 'Clientes', path: '/clientes' },
    ],
  },
  {
    title: 'Operación de Campo',
    items: [
      { icon: Calendar, label: 'Visitas', path: '/visitas' },
      { icon: MapPin, label: 'Zonas Asig.', path: '/zonas' },
      { icon: Briefcase, label: 'Cobratarios', path: '/cobratarios' },
    ],
  },
  {
    title: 'Configuración',
    items: [
      {
        icon: CreditCard,
        label: 'Tipos de crédito',
        path: '/tipos-de-credito',
      },
      {
        icon: RefreshCcw,
        label: 'Renovaciones',
        path: '/renovaciones',
      },
    ],
  },
  {
    title: 'Administración',
    items: [
      { icon: Building2, label: 'Empresas', path: '/empresas' },
      { icon: Users, label: 'Usuarios Web', path: '/usuarios-web' },
      { icon: ShieldAlert, label: 'Roles', path: '/roles' },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar el menú con Escape cuando esté abierto.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* BOTÓN DEL MENÚ MÓVIL */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        aria-expanded={isOpen}
        aria-controls="credurix-sidebar"
        className={`
          fixed left-3 top-3 z-60
          flex h-11 w-11 items-center justify-center
          rounded-xl border border-white/20
          bg-blue-700 text-white shadow-lg shadow-blue-900/20
          transition-all duration-200
          hover:bg-blue-800 active:scale-95
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-blue-400 focus-visible:ring-offset-2
          md:hidden
        `}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* FONDO OSCURO PARA MÓVILES */}
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-40 bg-slate-950/50
          backdrop-blur-[2px]
          transition-opacity duration-300 md:hidden
          ${
            isOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }
        `}
      />

      {/* SIDEBAR */}
      <aside
        id="credurix-sidebar"
        aria-label="Navegación principal"
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-[100dvh] w-[min(82vw,280px)]
          flex-col overflow-hidden
          border-r border-slate-200/80
          bg-white
          shadow-xl shadow-slate-900/5
          transition-transform duration-300 ease-in-out
          md:z-30 md:w-64 md:translate-x-0 md:shadow-none
          ${
            isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* IDENTIDAD DE CREDURIX */}
        <div className="flex min-h-[76px] shrink-0 items-center gap-3 border-b border-slate-100 px-5 pl-[68px] md:min-h-[84px] md:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
            <img
              src="/logo.png"
              alt="Logo CREDURIX"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div className="min-w-0">
            <span className="block truncate text-lg font-extrabold italic tracking-tight text-blue-950">
              CREDURIX
            </span>
            
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav
          className="min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-5"
          aria-label="Secciones del sistema"
        >
          {menuSections.map((section) => (
            <div key={section.title}>
              {/* TÍTULO DE SECCIÓN */}
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                {section.title}
              </p>

              {/* ENLACES */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        group relative flex min-h-[44px]
                        items-center gap-3 rounded-xl px-3 py-2.5
                        text-sm font-medium no-underline
                        transition-all duration-200
                        focus:outline-none focus-visible:ring-2
                        focus-visible:ring-blue-400
                        ${
                          isActive
                            ? 'bg-blue-600 font-semibold text-white shadow-md shadow-blue-600/20'
                            : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`
                              flex h-8 w-8 shrink-0 items-center
                              justify-center rounded-lg
                              transition-colors duration-200
                              ${
                                isActive
                                  ? 'bg-white/15 text-white'
                                  : 'text-slate-400 group-hover:bg-white group-hover:text-blue-600'
                              }
                            `}
                          >
                            <Icon size={18} strokeWidth={1.9} />
                          </span>

                          <span className="min-w-0 flex-1 truncate">
                            {item.label}
                          </span>

                          {isActive && (
                            <ChevronRight
                              size={16}
                              className="shrink-0 text-white/80"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER: ACCESO A LA PWA */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 p-3 pb-[max(16px,env(safe-area-inset-bottom))]">
          <Link
            to="/pwa"
            onClick={() => setIsOpen(false)}
            className="group flex min-h-[48px] items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 no-underline shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <Smartphone size={19} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block">Vista PWA</span>
              <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
                Acceso móvil
              </span>
            </span>

            <ChevronRight
              size={16}
              className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600"
            />
          </Link>

          <p className="mb-0 mt-3 text-center text-[9px] font-medium tracking-wider text-slate-400">
            CREDURIX · PANEL DE GESTIÓN
          </p>
        </div>
      </aside>
    </>
  );
}