import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../../api'; // Asegúrate de que esta ruta sea correcta según tu estructura

export default function PwaResumen() {
  const [resumen, setResumen] = useState({
    tasa_cobranza: 0,
    total_cobrado: 0,
    total_esperado: 0,
    clientes_visitados: 0,
    clientes_en_ruta: 0,
    pagos_exitosos: 0,
    sin_pago: 0,
    actividad_reciente: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Generador dinámico de la fecha de hoy
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaActual = new Date().toLocaleDateString('es-ES', opcionesFecha);
  const fechaMayuscula = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await api.get('/resumen-diario');
        setResumen(response.data);
      } catch (error) {
        console.error("Error al cargar el resumen diario:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumen();
  }, []);

  const formatMoney = (amount) => {
    return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (isLoading) {
    return <div className="p-5 bg-gray-50 min-h-screen flex justify-center items-center text-gray-500 font-bold">Cargando métricas...</div>;
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen pb-24">
      
      {/* Cabecera */}
      <div className="mb-6 mt-2">
        <h1 className="text-3xl font-extrabold text-black">Resumen del día</h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">{fechaMayuscula}</p>
      </div>

      {/* Tarjeta Principal Azul */}
      <div className="bg-blue-600 text-white p-5 rounded-3xl mb-4 shadow-md shadow-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} />
          <span className="text-sm font-semibold">Tasa de cobranza</span>
        </div>
        <div className="text-[2.5rem] leading-none font-bold mb-2">
          {resumen.tasa_cobranza}%
        </div>
        <div className="text-xs text-blue-200 font-medium">
          ${formatMoney(resumen.total_cobrado)} de ${formatMoney(resumen.total_esperado)}
        </div>
      </div>

      {/* Grid de Métricas (2x2) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        
        {/* Tarjeta: Total Cobrado */}
        <div className="bg-[#eaf5eb] border border-[#d4ebd6] p-4 rounded-3xl flex flex-col justify-between aspect-[4/3]">
          <DollarSign size={22} className="text-green-600 mb-2" />
          <div>
            <div className="text-2xl font-bold text-black leading-tight">${formatMoney(resumen.total_cobrado)}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 uppercase font-bold tracking-wide">Total Cobrado</div>
          </div>
        </div>

        {/* Tarjeta: Clientes Visitados */}
        <div className="bg-[#eef3fb] border border-[#dbe6f7] p-4 rounded-3xl flex flex-col justify-between aspect-[4/3]">
          <CheckCircle2 size={22} className="text-blue-600 mb-2" />
          <div>
            <div className="text-2xl font-bold text-black leading-tight">{resumen.clientes_visitados}/{resumen.clientes_en_ruta}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 uppercase font-bold tracking-wide">Visitados</div>
          </div>
        </div>

        {/* Tarjeta: Pagos Exitosos */}
        <div className="bg-[#eaf5eb] border border-[#d4ebd6] p-4 rounded-3xl flex flex-col justify-between aspect-[4/3]">
          <CheckCircle2 size={22} className="text-green-600 mb-2" />
          <div>
            <div className="text-2xl font-bold text-black leading-tight">{resumen.pagos_exitosos}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 uppercase font-bold tracking-wide">Pagos Exitosos</div>
          </div>
        </div>

        {/* Tarjeta: Sin Pago */}
        <div className="bg-[#fcedeb] border border-[#f5d5d0] p-4 rounded-3xl flex flex-col justify-between aspect-[4/3]">
          <XCircle size={22} className="text-red-500 mb-2" />
          <div>
            <div className="text-2xl font-bold text-black leading-tight">{resumen.sin_pago}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 uppercase font-bold tracking-wide">Sin Pago</div>
          </div>
        </div>

      </div>

      {/* Actividad Reciente */}
      <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm mb-4">
        <h2 className="text-sm font-bold text-black mb-4">Actividad Reciente</h2>
        
        {resumen.actividad_reciente.length > 0 ? (
          <div className="space-y-4">
            {resumen.actividad_reciente.map((actividad, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">{actividad.nombre}</p>
                    <p className="text-[10px] text-gray-400">{actividad.hora}</p>
                  </div>
                </div>
                <div className="text-sm font-black text-green-600">
                  +${formatMoney(actividad.monto)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-xs pb-4 pt-2">
            No hay actividad aún
          </div>
        )}
      </div>

    </div>
  );
}