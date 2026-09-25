import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaCalendarAlt, FaCheckCircle, FaClock, FaHome, FaCreditCard, FaUser, FaShieldAlt, FaExclamationTriangle, FaAward, FaArrowRight, FaReceipt, FaWallet, FaBell } from 'react-icons/fa';
import api from '../../../api'; 

const HomeClient = () => {
  const [clienteData, setClienteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClienteInfo = async () => {
      try {
        const response = await api.get('/cliente/mi-cuenta');
        setClienteData(response.data);
      } catch (error) {
        console.error("Error al cargar la información del cliente:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClienteInfo();
  }, []);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Cargando tu cuenta...</p>
        </div>
      </div>
    );
  }

  const nombreCliente = clienteData?.nombre || 'Usuario';
  const proximoVencimiento = clienteData?.proximo_vencimiento || 'N/A';
  const diasRetraso = Number(clienteData?.dias_retraso || 0);
  const saldoTotalPrestamo = Number(clienteData?.saldo_pendiente || 0);
  
  const cuotaActiva = clienteData?.cuotas?.[0] || null;
  const montoAPagarHoy = cuotaActiva ? Number(cuotaActiva.monto) : 0;
  const isLiquidado = saldoTotalPrestamo <= 0;

  const handlePagar = () => {
    alert(`Redirigiendo a pasarela segura para procesar el pago de ${formatMoney(montoAPagarHoy)}...`);
  };

  if (isLiquidado) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 justify-between pb-24 font-sans max-w-md mx-auto shadow-2xl">
        <header className="p-5 flex justify-between items-center bg-white border-b border-slate-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Portal del Cliente</p>
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">{nombreCliente}</h1>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
            <FaUserCircle className="text-2xl" />
          </div>
        </header>

        <div className="mx-4 my-auto p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <FaAward className="text-4xl" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">¡Crédito Liquidado!</h2>
          <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
            Has completado exitosamente el pago de todas tus cuotas. Tu historial crediticio es excelente.
          </p>
          <button 
            onClick={() => alert("Solicitud de renovación enviada con éxito.")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 active:scale-95 transition flex items-center justify-center gap-2"
          >
            Solicitar Renovación <FaArrowRight />
          </button>
        </div>

        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 py-3 px-6 flex justify-around text-slate-400 shadow-lg z-20">
          <div className="text-center text-emerald-600 flex flex-col items-center cursor-pointer">
            <FaHome size={18}/><span className="text-[10px] font-black uppercase tracking-wider mt-1">Inicio</span>
          </div>
          <div className="text-center flex flex-col items-center cursor-pointer hover:text-slate-600 transition">
            <FaCreditCard size={18}/><span className="text-[10px] font-bold uppercase tracking-wider mt-1">Mis Pagos</span>
          </div>
          <div className="text-center flex flex-col items-center cursor-pointer hover:text-slate-600 transition">
            <FaUser size={18}/><span className="text-[10px] font-bold uppercase tracking-wider mt-1">Perfil</span>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-28 font-sans max-w-md mx-auto shadow-2xl">
      
      {/* Encabezado Profesional */}
      <header className="p-5 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-20">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Bienvenido de nuevo</p>
          <h1 className="text-base font-black text-slate-900 tracking-tight uppercase truncate max-w-[240px]">{nombreCliente}</h1>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm shrink-0">
          <FaUserCircle className="text-2xl" />
        </div>
      </header>

      <div className="p-4 space-y-4 flex-1">

        {/* ALERTA DE ATRASO / MORA CON MENSAJE DE PREVENCIÓN */}
        {diasRetraso > 0 ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <FaExclamationTriangle className="text-base" />
            </div>
            <div>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-wider">Aviso importante</p>
              <p className="text-xs font-bold text-slate-800">Tienes {diasRetraso} días de atraso. Liquida hoy para <span className="text-red-600 underline">evita más recargos</span> adicionales.</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <FaBell className="text-base" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Consejo financiero</p>
              <p className="text-xs font-bold text-slate-800">Mantén tus pagos al día y <span className="text-emerald-700 underline">evita recargos</span> por mora en tu crédito.</p>
            </div>
          </div>
        )}

        {/* TARJETA PRINCIPAL: MONTO A PAGAR HOY */}
        <div className="p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[32px] text-white shadow-xl shadow-blue-600/25 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-blue-100 text-[11px] font-bold uppercase tracking-wider">
                {diasRetraso > 0 ? 'Total Vencido con Mora' : 'Monto Próximo a Pagar'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md ${
              diasRetraso > 0 ? 'bg-red-500 text-white shadow-sm' : 'bg-white/20 text-white'
            }`}>
              {diasRetraso > 0 ? `${diasRetraso} Días de Atraso` : 'Crédito Activo'}
            </span>
          </div>

          <div className="my-3">
            <h2 className="text-4xl font-black tracking-tight">{formatMoney(montoAPagarHoy)}</h2>
            {diasRetraso > 0 && (
              <p className="text-[11px] text-red-200 font-bold mt-1">Incluye recargo acumulado por falta de pago</p>
            )}
          </div>

          <div className="pt-4 border-t border-white/15 flex justify-between items-center text-xs">
            <span className="text-blue-100 font-medium">Fecha límite de pago:</span>
            <span className="font-black text-white bg-white/10 px-2.5 py-1 rounded-lg">{proximoVencimiento}</span>
          </div>
        </div>

        {/* BOTÓN DE PAGO DIRECTO */}
        <button 
          onClick={handlePagar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 active:scale-95 transition flex items-center justify-center gap-2.5"
        >
          <FaShieldAlt className="text-base" /> Pagar {formatMoney(montoAPagarHoy)} Ahora
        </button>

        {/* RESUMEN / ESTADO GENERAL DEL CRÉDITO */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FaReceipt size={14} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider">Resumen de tu Crédito</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Total Restante</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{formatMoney(saldoTotalPrestamo)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cuota Regular Base</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                {formatMoney(cuotaActiva ? cuotaActiva.monto - (diasRetraso > 0 ? (diasRetraso * (clienteData?.esquema_cobro === 'semanal' ? 100 : 20)) : 0) : 0)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
              <FaWallet size={14} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Estado de cuenta</p>
              <p className="text-xs font-bold text-slate-700">
                {diasRetraso > 0 ? 'Tienes pagos pendientes por regularizar.' : 'Estás al corriente con tus pagos. ¡Felicidades!'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Navbar Inferior */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 py-3 px-6 flex justify-around text-slate-400 z-30 shadow-lg">
        <div className="text-center text-blue-600 flex flex-col items-center cursor-pointer">
          <FaHome size={18}/>
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">Inicio</span>
        </div>
        <div className="text-center flex flex-col items-center cursor-pointer hover:text-slate-600 transition">
          <FaCreditCard size={18}/>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Mis Pagos</span>
        </div>
        <div className="text-center flex flex-col items-center cursor-pointer hover:text-slate-600 transition">
          <FaUser size={18}/>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default HomeClient;