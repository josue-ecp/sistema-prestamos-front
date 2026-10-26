import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaCalendarAlt, FaCheckCircle, FaClock, FaHome, FaCreditCard, FaUser, FaShieldAlt, FaExclamationTriangle, FaAward, FaArrowRight, FaReceipt, FaWallet, FaBell } from 'react-icons/fa';
import api from '../../../api'; 
import StripePaymentForm from '../../../Components/Payments/StripePaymentForm';

const HomeClient = () => {
  const [clienteData, setClienteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState('');

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
  const moraCalculada = diasRetraso > 0
    ? (clienteData?.esquema_cobro === 'semanal' ? Math.floor(diasRetraso / 7) * 100 : diasRetraso * 20)
    : 0;

  const handlePagar = () => {
    setPaymentSuccess('');
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (result) => {
    setPaymentSuccess(
      result.liquidated
        ? '¡Pago confirmado! Tu crédito quedó liquidado.'
        : `¡Pago confirmado! Se aplicaron ${formatMoney(result.amount_paid)} a tu crédito.`,
    );
    setClienteData((current) => ({
      ...current,
      saldo_pendiente: result.new_balance,
      cuotas: result.liquidated ? [] : current?.cuotas,
    }));
    setIsPaymentOpen(false);

    try {
      const response = await api.get('/cliente/mi-cuenta');
      setClienteData(response.data);
    } catch (error) {
      console.error('El pago se confirmó, pero no se pudo actualizar la vista de la cuenta:', error);
      setPaymentSuccess((message) => `${message} Recarga la página para ver el saldo actualizado.`);
    }
  };

  if (isLiquidado) {
    return (
      <div className="flex min-h-screen w-full max-w-md flex-col justify-between bg-slate-50 pb-24 font-sans mx-auto shadow-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white p-4 sm:p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Portal del Cliente</p>
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">{nombreCliente}</h1>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-800 shadow-sm">
            <FaUserCircle className="text-2xl" />
          </div>
        </header>

        <div className="mx-4 my-auto rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-lg sm:p-8">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-800 shadow-inner">
            <FaAward className="text-4xl" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">¡Crédito Liquidado!</h2>
          {paymentSuccess && (
            <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700" role="status">
              {paymentSuccess}
            </p>
          )}
          <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
            Has completado exitosamente el pago de todas tus cuotas. Tu historial crediticio es excelente.
          </p>
          <button 
            onClick={() => alert("Solicitud de renovación enviada con éxito.")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]"
          >
            Solicitar Renovación <FaArrowRight />
          </button>
        </div>

        <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 justify-around border-t border-slate-200 bg-white px-4 py-3 text-slate-400 shadow-lg sm:px-6">
          <div className="flex cursor-pointer flex-col items-center text-center text-blue-800">
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
    <div className="flex min-h-screen w-full max-w-md flex-col bg-slate-50 pb-28 font-sans mx-auto shadow-2xl">
      
      {/* Encabezado Profesional */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-100 bg-white p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Bienvenido de nuevo</p>
          <h1 className="max-w-full truncate text-base font-black uppercase tracking-tight text-slate-900">{nombreCliente}</h1>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-800 shadow-sm">
          <FaUserCircle className="text-2xl" />
        </div>
      </header>

      <div className="p-4 space-y-4 flex-1">
        {paymentSuccess && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800" role="status">
            {paymentSuccess}
          </p>
        )}

        {/* ALERTA DE ATRASO / MORA CON MENSAJE DE PREVENCIÓN */}
        {diasRetraso > 0 ? (
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-white shadow-sm">
              <FaExclamationTriangle className="text-base" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-700">Aviso importante</p>
              <p className="text-xs font-bold text-slate-800">Tienes {diasRetraso} días de atraso. Liquida hoy para <span className="underline">evita más recargos</span> adicionales.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3.5 rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white shadow-sm">
              <FaBell className="text-base" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-800">Consejo financiero</p>
              <p className="text-xs font-bold text-slate-800">Mantén tus pagos al día y <span className="text-blue-800 underline">evita recargos</span> por mora en tu crédito.</p>
            </div>
          </div>
        )}

        {/* TARJETA PRINCIPAL: MONTO A PAGAR HOY */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900 p-4 text-white shadow-xl shadow-blue-900/15 sm:p-6">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-blue-100 text-[11px] font-bold uppercase tracking-wider">
                {diasRetraso > 0 ? 'Total Vencido con Mora' : 'Monto Próximo a Pagar'}
              </p>
            </div>
            <span className={`max-w-full rounded-full px-3 py-1 text-center text-[9px] font-black uppercase tracking-wider backdrop-blur-md ${
              diasRetraso > 0 ? 'bg-slate-700 text-white shadow-sm' : 'bg-white/20 text-white'
            }`}>
              {diasRetraso > 0 ? `${diasRetraso} Días de Atraso` : 'Crédito Activo'}
            </span>
          </div>

          <div className="my-3">
            <h2 className="break-words text-3xl font-black tracking-tight sm:text-4xl">{formatMoney(montoAPagarHoy)}</h2>
            {diasRetraso > 0 && (
              <p className="mt-1 text-[11px] font-bold text-slate-300">Incluye recargo acumulado por falta de pago</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-4 text-xs">
            <span className="font-medium text-blue-100">Fecha límite de pago:</span>
            <span className="max-w-full break-words rounded-lg bg-white/10 px-2.5 py-1 font-black text-white">{proximoVencimiento}</span>
          </div>
        </div>

        {/* BOTÓN DE PAGO DIRECTO */}
        <button 
          onClick={handlePagar}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-800 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]"
        >
          <FaShieldAlt className="text-base" /> Pagar {formatMoney(montoAPagarHoy)} Ahora
        </button>

        {/* RESUMEN / ESTADO GENERAL DEL CRÉDITO */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
              <FaReceipt size={14} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider">Resumen de tu Crédito</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Total Restante</p>
              <p className="mt-0.5 break-words text-sm font-black text-slate-900">{formatMoney(saldoTotalPrestamo)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cuota Regular Base</p>
              <p className="mt-0.5 break-words text-sm font-black text-slate-900">
                {formatMoney(cuotaActiva ? Math.max(0, cuotaActiva.monto - moraCalculada) : 0)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
              <FaWallet size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Estado de cuenta</p>
              <p className="break-words text-xs font-bold text-slate-700">
                {diasRetraso > 0 ? 'Tienes pagos pendientes por regularizar.' : 'Estás al corriente con tus pagos. ¡Felicidades!'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Navbar Inferior */}
      <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 justify-around border-t border-slate-100 bg-white px-4 py-3 text-slate-400 shadow-lg sm:px-6">
        <div className="flex cursor-pointer flex-col items-center text-center text-blue-800">
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

      {isPaymentOpen && (
        <StripePaymentForm
          amount={montoAPagarHoy}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default HomeClient;