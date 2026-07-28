import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Phone, ChevronRight } from 'lucide-react';
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

  // Lógica del buscador BLINDADA contra clientes sin nombre (nulos)
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
    <div className="p-5 bg-gray-50 min-h-screen pb-20">
      
      {/* Título de la vista */}
      <h1 className="text-3xl font-extrabold text-black mb-4 mt-2">
        Directorio
      </h1>

      {/* Barra de Búsqueda Activa */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#E2E4E9] text-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-gray-500 shadow-sm"
          placeholder="Buscar por nombre..."
        />
      </div>

      {/* Contador dinámico */}
      <p className="text-xs font-bold text-gray-400 mb-4 ml-1 uppercase tracking-wide">
        {clientesFiltrados.length} clientes encontrados
      </p>

      {/* Lista de Tarjetas de Clientes */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-gray-500 mt-10">Cargando directorio...</p>
        ) : clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative active:scale-[0.98] transition-transform">
              
              {/* Cabecera de la tarjeta */}
              <div className="flex justify-between items-start mb-2">
                <div className="pr-8">
                  <h2 className="text-md font-black text-black leading-tight">
                    {cliente.nombre || 'Cliente sin nombre'}
                  </h2>
                  <div className="flex items-center gap-1 text-gray-500 mt-1 mb-2">
                    <MapPin size={12} />
                    <span className="text-[11px] truncate w-48">
                      {cliente.direccion || 'Sin dirección registrada'}
                    </span>
                  </div>
                </div>
                
                {/* Botón de llamada rápido */}
                {cliente.telefono && (
                  <a 
                    href={`tel:${cliente.telefono}`} 
                    className="bg-blue-50 p-2.5 rounded-full text-blue-600 hover:bg-blue-100 transition absolute top-4 right-4"
                  >
                    <Phone size={16} fill="currentColor" />
                  </a>
                )}
              </div>

              {/* Pie de tarjeta con info financiera condensada */}
              <div className="flex justify-between items-end pt-3 border-t border-gray-50 mt-1">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Saldo Pendiente</p>
                  <div className="flex items-center gap-1 text-black">
                    <DollarSign size={14} className="text-blue-500" />
                    <span className="text-lg font-black leading-none">{formatMoney(cliente.monto)}</span>
                  </div>
                </div>

                {cliente.tiene_retraso ? (
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg border border-red-100">
                    Con atraso
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg border border-green-100">
                    Al día
                  </span>
                )}
              </div>
              
              {/* Indicador visual de que se puede tocar para ver detalles */}
              <div className="absolute right-4 bottom-4 text-gray-300">
                <ChevronRight size={18} />
              </div>

            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p>No se encontraron clientes.</p>
          </div>
        )}
      </div>
    </div>
  );
}