import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Phone, ChevronRight, Users } from 'lucide-react';
import api from '../../../api';

export default function PwaClientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDirectorio = async () => {
      try {
        const response = await api.get('/clientes/directorio');
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDirectorio();
  }, []);

  const clientesFiltrados = clientes.filter(cliente => {
    const nombreSeguro = cliente.nombre ? cliente.nombre.toLowerCase() : '';
    const busquedaSegura = busqueda ? busqueda.toLowerCase() : '';
    return nombreSeguro.includes(busquedaSegura);
  });

  const formatMoney = (amount) => {
    const numericAmount = Math.abs(Number(amount) || 0);
    return numericAmount.toFixed(2);
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* Título de la vista con diseño moderno */}
      <div className="mb-4 mt-1 flex items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Directorio
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {clientesFiltrados.length} clientes en ruta
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
          <Users size={20} />
        </div>
      </div>

      {/* Barra de Búsqueda Mejorada */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-xs placeholder:text-slate-400 border border-slate-200/80 shadow-sm"
          placeholder="Buscar cliente por nombre..."
        />
      </div>

      {/* Lista de Tarjetas de Clientes */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="text-center text-slate-400 py-16 bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
            <p className="text-xs font-bold animate-pulse">Cargando directorio...</p>
          </div>
        ) : clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all active:scale-[0.99] group">
              
              {/* Línea lateral decorativa de estado */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                cliente.tiene_retraso ? 'bg-slate-500' : 'bg-blue-700'
              }`} />

              {/* Cabecera de la tarjeta */}
              <div className="mb-2 flex items-start justify-between gap-2 pl-2">
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-sm font-black uppercase leading-snug tracking-tight text-slate-900">
                    {cliente.nombre || 'Cliente sin nombre'}
                  </h2>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                    <MapPin size={13} className="text-blue-500 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-[11px] font-medium">
                      {cliente.direccion || 'Sin dirección registrada'}
                    </span>
                  </div>
                </div>
                
                {/* Botón de llamada rápido */}
                {cliente.telefono && (
                  <a 
                    href={`tel:${cliente.telefono}`} 
                    className="shrink-0 rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-blue-800 shadow-sm transition hover:bg-blue-100"
                  >
                    <Phone size={16} />
                  </a>
                )}
              </div>

              {/* Pie de tarjeta con info financiera condensada */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pl-2 pt-3">
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Saldo Pendiente</p>
                  <div className="flex items-center gap-0.5 text-slate-900 mt-0.5">
                    <span className="text-xs font-bold text-slate-400">$</span>
                    <span className="break-all text-base font-black leading-none">{formatMoney(cliente.monto)}</span>
                  </div>
                </div>

                {cliente.tiene_retraso ? (
                  <span className="rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700">
                    Con atraso
                  </span>
                ) : (
                  <span className="rounded-xl border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-800">
                    Al día
                  </span>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 py-16 bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
            <p className="text-xs font-bold">No se encontraron clientes con ese nombre.</p>
          </div>
        )}
      </div>
    </div>
  );
}