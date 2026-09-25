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
    <div className="p-4 bg-slate-50 min-h-screen pb-24 font-sans">
      {/* HEADER Y BARRA DE PROGRESO */}
      <div className="mb-5 mt-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Progreso de hoy</span>
          <span className="text-xs font-black text-blue-600">
            {clientesProcesados} de {totalClientesDia} Visitados
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progresoPorcentaje}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-2xl font-black text-slate-900 mb-4 px-1">Ruta de hoy</h1>

      {/* PESTAÑAS (TABS) MEJORADAS */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl mb-5 shadow-inner">
        <button 
          onClick={() => setActiveTab('pendiente')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'pendiente' ? 'bg-white text-blue-600 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Pendientes
        </button>
        <button 
          onClick={() => setActiveTab('no_pago')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'no_pago' ? 'bg-white text-red-500 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          No Pagaron
        </button>
        <button 
          onClick={() => setActiveTab('pagado')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeTab === 'pagado' ? 'bg-white text-emerald-600 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Pagados
        </button>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="space-y-4">
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden transition-all ${
              activeTab === 'pagado' ? 'opacity-80 bg-slate-50/50' : ''
            }`}>
              {/* Barra lateral indicadora de estado */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                activeTab === 'pagado' ? 'bg-slate-300' : 
                cliente.tiene_retraso ? 'bg-red-500' : 'bg-emerald-500'
              }`} />

              <div className="flex justify-between items-start mb-2 pl-1">
                <div>
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">{cliente.nombre}</h2>
                </div>
                <a 
                  href={`tel:${cliente.telefono}`}
                  className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2.5 rounded-2xl transition-colors shadow-sm"
                >
                  <Phone size={18} />
                </a>
              </div>

              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cliente.direccion)}`, '_blank')}
                className="flex items-center gap-2 text-slate-500 mb-4 text-xs hover:bg-slate-50 p-2 rounded-xl transition-colors w-full text-left pl-1"
              >
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600 shrink-0">
                  <MapPin size={15} />
                </div>
                <span className="font-medium underline decoration-blue-200 underline-offset-2 truncate">
                  {cliente.direccion}
                </span>
              </button>

              <div className="flex justify-between items-center mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 pl-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {activeTab === 'pagado' ? "Cobro realizado" : (cliente.tiene_retraso ? "Total con Mora" : "Pago de hoy")}
                  </p>
                  <span className={`text-xl font-black ${activeTab === 'pagado' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    ${formatMoney(cliente.monto)}
                  </span>
                </div>
                
                {activeTab !== 'pagado' && (
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                    cliente.tiene_retraso 
                      ? 'text-red-600 bg-red-50 border border-red-100' 
                      : 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                  }`}>
                    {cliente.retraso}
                  </span>
                )}
              </div>

              {/* BOTONES DE ACCIÓN */}
              {activeTab === 'pendiente' && (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleCobrarClick(cliente)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition"
                  >
                    <CheckCircle size={18} /> Cobrar
                  </button>
                  <button 
                    onClick={() => handleNoPagoClick(cliente)}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3 rounded-2xl font-black text-sm active:scale-95 transition shadow-sm"
                  >
                    <XCircle size={18} className="text-slate-400" /> No Pagó
                  </button>
                </div>
              )}

              {activeTab === 'no_pago' && (
                <div className="pt-2">
                  <button 
                    onClick={() => handleCobrarClick(cliente)}
                    className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 py-3 rounded-2xl font-black text-sm active:scale-95 transition border border-amber-200"
                  >
                    <RotateCcw size={18} /> Reintentar Cobro (2da Vuelta)
                  </button>
                </div>
              )}

              {activeTab === 'pagado' && (
                <div className="pt-1 flex items-center justify-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-wider bg-emerald-50/50 py-2.5 rounded-2xl">
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
        <div className="fixed inset-0 bg-slate-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[9999] backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl text-center animate-in slide-in-from-bottom duration-300">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertTriangle size={28} className="text-red-500" />
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
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsNoPagoModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmNoPago}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-red-500/30 active:scale-95 transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COBRO (CON OBSERVACIONES) */}
      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[9999] backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-black text-slate-900">Registrar Cobro</h2>
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
                  className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-3 rounded-2xl text-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
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
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
            
            <button 
              onClick={handleConfirmarPago}
              disabled={isSubmitting}
              className={`w-full text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition ${
                isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 active:scale-95'
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