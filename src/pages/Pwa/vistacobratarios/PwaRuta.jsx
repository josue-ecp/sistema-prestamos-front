import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { MapPin, Phone, CheckCircle, XCircle, X, RotateCcw, AlertTriangle } from 'lucide-react';

export default function PwaRuta() {
  const [clientes, setClientes] = useState([]); 
  
  // ESTADOS PARA EL COBRO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ESTADOS PARA EL MODAL DE "NO PAGÓ"
  const [isNoPagoModalOpen, setIsNoPagoModalOpen] = useState(false);
  const [clienteParaNoPago, setClienteParaNoPago] = useState(null);

  // ESTADO: Pestaña activa (pendientes, pagado, no_pago)
  const [activeTab, setActiveTab] = useState('pendiente');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
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
    setIsModalOpen(true);
  };

  const handleConfirmarPago = async () => {
    if (!montoRecibido || montoRecibido <= 0) {
      alert("Por favor ingresa un monto válido.");
      return;
    }

    setIsSubmitting(true);
    
    // 1. Guardamos un respaldo por si el internet falla
    const clientesDeRespaldo = [...clientes];
    const idDelCliente = selectedClient.id;
    const montoEnviado = montoRecibido;

    // 2. ACTUALIZACIÓN OPTIMISTA
    setClientes(clientes.map(c => 
      c.id === idDelCliente ? { ...c, estado_visita: 'pagado' } : c
    ));
    setIsModalOpen(false);
    setMontoRecibido('');

    // 3. Petición
    try {
      await api.post(`/clientes/${idDelCliente}/cobrar`, { monto: montoEnviado });
    } catch (error) {
      console.error("Error al registrar el cobro:", error);
      setClientes(clientesDeRespaldo); 
      alert("Hubo un error de conexión. El cobro no se registró y el cliente volverá a pendientes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ABRE EL NUEVO MODAL DE CONFIRMACIÓN
  const handleNoPagoClick = (cliente) => {
    setClienteParaNoPago(cliente);
    setIsNoPagoModalOpen(true);
  };

  // EJECUTA LA ACCIÓN DESDE EL MODAL
  const confirmNoPago = async () => {
    if (!clienteParaNoPago) return;

    const cliente = clienteParaNoPago;
    
    // Cerramos el modal inmediatamente
    setIsNoPagoModalOpen(false);
    setClienteParaNoPago(null);

    // 1. Guardamos respaldo
    const clientesDeRespaldo = [...clientes];

    // 2. ACTUALIZACIÓN OPTIMISTA
    setClientes(clientes.map(c => 
      c.id === cliente.id ? { ...c, estado_visita: 'no_pago' } : c
    ));

    // 3. Petición en segundo plano
    try {
      await api.post(`/clientes/${cliente.id}/no-pago`);
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

  // LÓGICA DE FILTROS Y PROGRESO AUTOMÁTICO
  const clientesFiltrados = clientes.filter(c => c.estado_visita === activeTab);
  
  const totalClientesDia = clientes.length;
  const clientesProcesados = clientes.filter(c => c.estado_visita !== 'pendiente').length;
  const progresoPorcentaje = totalClientesDia === 0 ? 0 : Math.round((clientesProcesados / totalClientesDia) * 100);

  return (
    <div className="p-4 bg-gray-50 min-h-screen pb-20">
      {/* HEADER Y BARRA DE PROGRESO */}
      <div className="mb-6 mt-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Progreso de hoy</span>
          <span className="text-[11px] font-bold text-blue-600">
            {clientesProcesados}/{totalClientesDia} Visitados
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progresoPorcentaje}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-2xl font-black text-black mb-4">Ruta de hoy</h1>

      {/* PESTAÑAS (TABS) */}
      <div className="flex bg-gray-200 p-1 rounded-xl mb-6 shadow-inner">
        <button 
          onClick={() => setActiveTab('pendiente')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'pendiente' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pendientes
        </button>
        <button 
          onClick={() => setActiveTab('no_pago')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'no_pago' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          No Pagaron
        </button>
        <button 
          onClick={() => setActiveTab('pagado')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'pagado' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pagados
        </button>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="space-y-4">
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 ${
              activeTab === 'pagado' ? 'border-l-gray-300 opacity-80' : 
              cliente.tiene_retraso ? 'border-l-red-500' : 'border-l-green-500'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-md font-bold text-black">{cliente.nombre}</h2>
                <button className="text-blue-600 bg-blue-50 p-2 rounded-full">
                  <Phone size={18} />
                </button>
              </div>

              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cliente.direccion)}`, '_blank')}
                className="flex items-center gap-2 text-gray-600 mb-3 text-xs hover:bg-gray-100 p-1 rounded-lg transition-colors w-full text-left"
              >
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <MapPin size={14} className="text-blue-600" />
                </div>
                <span className="underline decoration-blue-200 underline-offset-2">
                  {cliente.direccion}
                </span>
              </button>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    {activeTab === 'pagado' ? "Cobro realizado" : (cliente.tiene_retraso ? "Total con Mora" : "Pago de hoy")}
                  </p>
                  <span className={`text-lg font-black ${activeTab === 'pagado' ? 'text-gray-500 line-through' : 'text-black'}`}>
                    ${formatMoney(cliente.monto)}
                  </span>
                </div>
                
                {activeTab !== 'pagado' && (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    cliente.tiene_retraso 
                      ? 'text-red-600 bg-red-50 border border-red-200' 
                      : 'text-green-600 bg-green-50 border border-green-200'
                  }`}>
                    {cliente.retraso}
                  </span>
                )}
              </div>

              {/* BOTONES DE ACCIÓN */}
              {activeTab === 'pendiente' && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button 
                    onClick={() => handleCobrarClick(cliente)}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition"
                  >
                    <CheckCircle size={18} /> Cobrar
                  </button>
                  <button 
                    onClick={() => handleNoPagoClick(cliente)}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition hover:bg-gray-50"
                  >
                    <XCircle size={18} /> No Pagó
                  </button>
                </div>
              )}

              {activeTab === 'no_pago' && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => handleCobrarClick(cliente)}
                    className="w-full flex items-center justify-center gap-2 bg-orange-100 text-orange-700 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition"
                  >
                    <RotateCcw size={18} /> Reintentar Cobro (2da Vuelta)
                  </button>
                </div>
              )}

              {activeTab === 'pagado' && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-green-600 font-bold text-sm">
                  <CheckCircle size={18} /> Pago completado
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p>
              {activeTab === 'pendiente' ? "¡Ruta completada! No hay clientes pendientes." : 
               activeTab === 'no_pago' ? "Ningún cliente ha faltado a su pago hoy." : 
               "Aún no se han registrado pagos hoy."}
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN NO PAGO (NUEVO) */}
      {isNoPagoModalOpen && clienteParaNoPago && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center scale-100 transition-transform">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-black text-black mb-2">¿Confirmar visita?</h2>
            <p className="text-gray-600 mb-6 text-sm">
              ¿Estás seguro de marcar que <span className="font-bold text-black">{clienteParaNoPago.nombre}</span> NO PAGÓ hoy?
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsNoPagoModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold text-sm hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmNoPago}
                className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-bold text-sm hover:bg-red-600 shadow-lg active:scale-95 transition"
              >
                Sí, No Pagó
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COBRO */}
      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">Registrar Cobro</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">Cliente: <span className="font-bold text-black">{selectedClient.nombre}</span></p>
            
            <label className="block text-sm font-bold text-gray-700 mb-2">Monto recibido</label>
            <input 
              type="number" 
              value={montoRecibido}
              onChange={(e) => setMontoRecibido(e.target.value)}
              className="w-full bg-gray-100 p-4 rounded-2xl text-2xl font-black mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="$ 0.00" 
            />
            
            <button 
              onClick={handleConfirmarPago}
              disabled={isSubmitting}
              className={`w-full text-white py-4 rounded-2xl font-black text-lg shadow-lg transition ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 active:scale-95 hover:bg-green-700'
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