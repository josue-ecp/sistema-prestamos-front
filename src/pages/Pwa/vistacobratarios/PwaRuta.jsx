import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { MapPin, Phone, CheckCircle, XCircle, X, RotateCcw, AlertTriangle, MessageSquare } from 'lucide-react';

export default function PwaRuta() {
  const [clientes, setClientes] = useState([]); 
  
  // ESTADOS PARA EL COBRO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [comentarioCobro, setComentarioCobro] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ESTADOS PARA EL MODAL DE "NO PAGÓ"
  const [isNoPagoModalOpen, setIsNoPagoModalOpen] = useState(false);
  const [clienteParaNoPago, setClienteParaNoPago] = useState(null);
  const [comentarioNoPago, setComentarioNoPago] = useState('');

  // ESTADO: Pestaña activa (pendientes, pagado, no_pago)
  const [activeTab, setActiveTab] = useState('pendiente');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes/directorio');
        setClientes(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.error("No autorizado, redirigiendo a login...");
        }
      } 
    }; 
    fetchClientes();
  }, []);

  const handleCobrarClick = (cliente) => {
    setSelectedClient(cliente);
    setMontoRecibido(cliente.monto); 
    setComentarioCobro('');
    setIsModalOpen(true);
  };

  const handleConfirmarPago = async () => {
    if (!montoRecibido || montoRecibido <= 0) {
      alert("Por favor ingresa un monto válido.");
      return;
    }

    setIsSubmitting(true);
    
    const clientesDeRespaldo = [...clientes];
    const idDelCliente = selectedClient.id;
    const montoEnviado = montoRecibido;
    const comentarioEnviado = comentarioCobro;

    setClientes(clientes.map(c => 
      c.id === idDelCliente ? { ...c, estado_visita: 'pagado' } : c
    ));
    setIsModalOpen(false);
    setMontoRecibido('');
    setComentarioCobro('');

    try {
      await api.post(`/clientes/${idDelCliente}/cobrar`, { 
        monto: montoEnviado,
        comentarios: comentarioEnviado 
      });
    } catch (error) {
      console.error("Error al registrar el cobro:", error);
      setClientes(clientesDeRespaldo); 
      alert("Hubo un error de conexión. El cobro no se registró y el cliente volverá a pendientes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoPagoClick = (cliente) => {
    setClienteParaNoPago(cliente);
    setComentarioNoPago('');
    setIsNoPagoModalOpen(true);
  };

  const confirmNoPago = async () => {
    if (!clienteParaNoPago) return;

    const cliente = clienteParaNoPago;
    const comentarioEnviado = comentarioNoPago;
    
    setIsNoPagoModalOpen(false);
    setClienteParaNoPago(null);
    setComentarioNoPago('');

    const clientesDeRespaldo = [...clientes];

    setClientes(clientes.map(c => 
      c.id === cliente.id ? { ...c, estado_visita: 'no_pago' } : c
    ));

    try {
      await api.post(`/clientes/${cliente.id}/no-pago`, {
        comentarios: comentarioEnviado
      });
    } catch (error) {
      console.error("Error al registrar visita fallida:", error);
      setClientes(clientesDeRespaldo);
      alert("Error de conexión. El cliente regresará a la pestaña de pendientes.");
    }
  };

  const formatMoney = (amount) => {
    const numericAmount = Math.abs(Number(amount) || 0);
    return numericAmount.toFixed(2);
  };

  const clientesFiltrados = clientes.filter(c => c.estado_visita === activeTab);
  
  const totalClientesDia = clientes.length;
  const clientesProcesados = clientes.filter(c => c.estado_visita !== 'pendiente').length;
  const progresoPorcentaje = totalClientesDia === 0 ? 0 : Math.round((clientesProcesados / totalClientesDia) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-3 pb-24 font-sans sm:p-4">
      {/* HEADER Y BARRA DE PROGRESO */}
      <div className="mb-5 mt-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Progreso de hoy</span>
          <span className="text-xs font-black text-blue-600">
            {clientesProcesados} de {totalClientesDia} Visitados
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-700 to-blue-900 transition-all duration-500 ease-out" 
            style={{ width: `${progresoPorcentaje}%` }}
          ></div>
        </div>
      </div>

      <h1 className="mb-4 px-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Ruta de hoy</h1>

      {/* PESTAÑAS (TABS) MEJORADAS */}
      <div className="mb-5 flex rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
        <button 
          onClick={() => setActiveTab('pendiente')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'pendiente' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Pendientes
        </button>
        <button 
          onClick={() => setActiveTab('no_pago')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'no_pago' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          No Pagaron
        </button>
        <button 
          onClick={() => setActiveTab('pagado')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'pagado' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Pagados
        </button>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="space-y-4">
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className={`relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all sm:p-5 ${
              activeTab === 'pagado' ? 'opacity-80 bg-slate-50/50' : ''
            }`}>
              {/* Barra lateral indicadora de estado */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                activeTab === 'pagado' ? 'bg-slate-300' : 
                cliente.tiene_retraso ? 'bg-slate-500' : 'bg-blue-700'
              }`} />

              <div className="mb-2 flex items-start justify-between gap-2 pl-1">
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-sm font-black uppercase tracking-tight text-slate-900 sm:text-base">{cliente.nombre}</h2>
                </div>
                <a 
                  href={`tel:${cliente.telefono}`}
                  className="rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-blue-800 shadow-sm transition-colors hover:bg-blue-100"
                >
                  <Phone size={18} />
                </a>
              </div>

              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cliente.direccion)}`, '_blank')}
                className="flex items-center gap-2 text-slate-500 mb-4 text-xs hover:bg-slate-50 p-2 rounded-xl transition-colors w-full text-left pl-1"
              >
                <div className="shrink-0 rounded-xl bg-blue-50 p-2 text-blue-800">
                  <MapPin size={15} />
                </div>
                <span className="min-w-0 flex-1 truncate font-medium underline decoration-blue-200 underline-offset-2">
                  {cliente.direccion}
                </span>
              </button>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 pl-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {activeTab === 'pagado' ? "Cobro realizado" : (cliente.tiene_retraso ? "Total con Mora" : "Pago de hoy")}
                  </p>
                  <span className={`break-all text-lg font-black sm:text-xl ${activeTab === 'pagado' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    ${formatMoney(cliente.monto)}
                  </span>
                </div>
                
                {activeTab !== 'pagado' && (
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                    cliente.tiene_retraso 
                      ? 'border border-slate-200 bg-slate-100 text-slate-700' 
                      : 'border border-blue-100 bg-blue-50 text-blue-800'
                  }`}>
                    {cliente.retraso}
                  </span>
                )}
              </div>

              {/* BOTONES DE ACCIÓN */}
              {activeTab === 'pendiente' && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button 
                    onClick={() => handleCobrarClick(cliente)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-800 px-2 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] sm:gap-2 sm:text-sm"
                  >
                    <CheckCircle size={18} /> Cobrar
                  </button>
                  <button 
                    onClick={() => handleNoPagoClick(cliente)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] sm:gap-2 sm:text-sm"
                  >
                    <XCircle size={18} className="text-slate-400" /> No Pagó
                  </button>
                </div>
              )}

              {activeTab === 'no_pago' && (
                <div className="pt-2">
                  <button 
                    onClick={() => handleCobrarClick(cliente)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 active:scale-[0.98]"
                  >
                    <RotateCcw size={18} /> Reintentar Cobro (2da Vuelta)
                  </button>
                </div>
              )}

              {activeTab === 'pagado' && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 pt-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                  <CheckCircle size={16} /> Pago completado con éxito
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 py-16 bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
            <p className="text-sm font-bold">
              {activeTab === 'pendiente' ? "¡Ruta completada! No hay clientes pendientes." : 
               activeTab === 'no_pago' ? "Ningún cliente ha faltado a su pago hoy." : 
               "Aún no se han registrado pagos hoy."}
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN NO PAGO (CON OBSERVACIONES) */}
      {isNoPagoModalOpen && clienteParaNoPago && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-900/60 p-2 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
          <div className="max-h-[calc(100dvh-1rem)] w-full max-w-sm overflow-y-auto overscroll-contain rounded-t-[28px] bg-white p-4 text-center shadow-2xl animate-in slide-in-from-bottom duration-300 sm:rounded-3xl sm:p-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
              <AlertTriangle size={28} className="text-slate-700" />
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1">Registrar Visita Fallida</h2>
            <p className="text-slate-500 mb-4 text-xs">
              Cliente: <span className="font-bold text-slate-800 uppercase">{clienteParaNoPago.nombre}</span>
            </p>
            
            <div className="text-left mb-5">
              <label className="flex items-center gap-1.5 text-xs font-black text-slate-700 mb-2">
                <MessageSquare size={14} className="text-slate-400" /> Motivo u Observaciones
              </label>
              <textarea 
                rows="3"
                value={comentarioNoPago}
                onChange={(e) => setComentarioNoPago(e.target.value)}
                placeholder="Ej. No se encontraba en casa, pagará más tarde..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsNoPagoModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmNoPago}
                className="flex-1 rounded-xl bg-blue-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-900 active:scale-[0.98]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COBRO (CON OBSERVACIONES) */}
      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-900/60 p-2 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
          <div className="max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-[28px] bg-white p-4 shadow-2xl animate-in slide-in-from-bottom duration-300 sm:rounded-3xl sm:p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="min-w-0 text-base font-black text-slate-900 sm:text-lg">Registrar Cobro</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-slate-500 mb-3 text-xs">Cliente: <span className="font-bold text-slate-900 uppercase">{selectedClient.nombre}</span></p>
            
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-700 mb-2">Monto recibido</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-xl font-black text-slate-400">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={montoRecibido}
                  onChange={(e) => setMontoRecibido(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-xl font-bold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" 
                  placeholder="0.00" 
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-1.5 text-xs font-black text-slate-700 mb-2">
                <MessageSquare size={14} className="text-slate-400" /> Observaciones o Comentarios
              </label>
              <textarea 
                rows="2"
                value={comentarioCobro}
                onChange={(e) => setComentarioCobro(e.target.value)}
                placeholder="Ej. Dejó un adelanto, pidió cambio de billete de 500..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>
            
            <button 
              onClick={handleConfirmarPago}
              disabled={isSubmitting}
              className={`w-full text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition ${
                isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-blue-800 hover:bg-blue-900 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}