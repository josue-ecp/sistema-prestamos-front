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
      <div className="flex justify-between items-center mb-4 mt-1 px-1">
        <div>
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
            <div key={cliente.id} className="bg-white p-4.5 rounded-3xl shadow-sm border border-slate-100/80 flex flex-col relative active:scale-[0.99] transition-all overflow-hidden group">
              
              {/* Línea lateral decorativa de estado */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                cliente.tiene_retraso ? 'bg-red-500' : 'bg-emerald-500'
              }`} />

              {/* Cabecera de la tarjeta */}
              <div className="flex justify-between items-start pl-2 mb-2">
                <div className="pr-10">
                  <h2 className="text-sm font-black text-slate-900 leading-snug uppercase tracking-tight">
                    {cliente.nombre || 'Cliente sin nombre'}
                  </h2>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                    <MapPin size={13} className="text-blue-500 shrink-0" />
                    <span className="text-[11px] font-medium truncate max-w-[220px]">
                      {cliente.direccion || 'Sin dirección registrada'}
                    </span>
                  </div>
                </div>
                
                {/* Botón de llamada rápido */}
                {cliente.telefono && (
                  <a 
                    href={`tel:${cliente.telefono}`} 
                    className="bg-blue-50 hover:bg-blue-100 p-2.5 rounded-2xl text-blue-600 transition shadow-sm shrink-0"
                  >
                    <Phone size={16} />
                  </a>
                )}
              </div>

              {/* Pie de tarjeta con info financiera condensada */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2 pl-2">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Saldo Pendiente</p>
                  <div className="flex items-center gap-0.5 text-slate-900 mt-0.5">
                    <span className="text-xs font-bold text-slate-400">$</span>
                    <span className="text-base font-black leading-none">{formatMoney(cliente.monto)}</span>
                  </div>
                </div>

                {cliente.tiene_retraso ? (
                  <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-xl border border-red-100 uppercase tracking-wider">
                    Con atraso
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl border border-emerald-100 uppercase tracking-wider">
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