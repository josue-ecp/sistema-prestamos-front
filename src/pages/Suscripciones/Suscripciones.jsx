import React, { useState } from 'react';
import { Check, Shield, Star, Crown } from 'lucide-react'; 

const Suscripciones = () => {
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  const planes = [
    {
      id: 'basico',
      nombre: 'BÁSICO',
      precio: '$1,499',
      licencias: 'Hasta 3 Cobratarios',
      icono: <Shield className="w-6 h-6 text-blue-600" />,
      caracteristicas: [
        'Hasta 3 licencias de cobratario',
        'Pagos directos desde la PWA habilitados',
        'Historial de cobros básico',
        'Soporte vía email',
      ],
      colorBoton: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      popular: false
    },
    {
      id: 'pro',
      nombre: 'PRO',
      precio: '$3,499',
      licencias: 'Hasta 15 Cobratarios',
      icono: <Star className="w-6 h-6 text-blue-700" />,
      caracteristicas: [
        'Hasta 15 licencias de cobratario',
        'Pagos directos desde la PWA habilitados',
        'Gestión avanzada de zonas de cobro',
        'Métricas de rendimiento en Dashboard',
        'Soporte prioritario 24/7',
      ],
      colorBoton: 'bg-blue-800 text-white hover:bg-blue-900 shadow-sm',
      popular: true
    },
    {
      id: 'empresarial',
      nombre: 'EMPRESARIAL',
      precio: '$7,999',
      licencias: 'Licencias Ilimitadas',
      icono: <Crown className="w-6 h-6 text-blue-900" />,
      caracteristicas: [
        'Licencias de cobratario ilimitadas',
        'Pagos directos desde la PWA habilitados',
        'Informes personalizados y exportables',
        'Gerente de cuenta dedicado',
        'Integración vía API con sistemas internos',
      ],
      colorBoton: 'bg-blue-900 text-white hover:bg-blue-950 shadow-md',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
     
      <div className="mx-auto mb-10 max-w-7xl text-center sm:mb-12">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Planes de servicio</p>
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Elige tu Plan de Crecimiento para Empresas
        </h1>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-lg">
          Optimiza tu flujo de trabajo. Con <span className="font-bold text-blue-600">PrestaYA!</span>, tus clientes pagan directo desde la PWA, reduciendo la necesidad de reestructurar o saturar a tu personal de campo.
        </p>
      </div>

      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
              plan.popular 
                ? 'border-blue-500 ring-4 ring-blue-100 md:scale-105' 
                : 'border-slate-200 shadow-sm'
            }`}
          >
           
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-full bg-blue-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                Más Vendido / Recomendado
              </span>
            )}

          
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                {plan.nombre}
              </span>
              <div className="rounded-xl bg-blue-50 p-2">
                {plan.icono}
              </div>
            </div>

            
            <div className="mb-2 flex items-baseline text-slate-950">
              <span className="text-4xl md:text-5xl font-black tracking-tight">{plan.precio}</span>
              <span className="ml-2 text-sm font-semibold text-slate-500">MXN/mes</span>
            </div>
            
            
            <p className="mb-6 inline-block rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-blue-800">
              {plan.licencias}
            </p>

            <hr className="mb-6 border-slate-100" />

            {/* Características */}
            <ul className="space-y-4 mb-8 min-h-[220px]">
              {plan.caracteristicas.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-600">
                  <div className="mr-3 mt-0.5 flex-shrink-0 rounded-full bg-blue-50 p-0.5">
                    <Check className="h-4 w-4 text-blue-700" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            
            <button
              onClick={() => setPlanSeleccionado(plan.id)}
              className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 ${plan.colorBoton} ${
                planSeleccionado === plan.id ? 'ring-2 ring-offset-2 ring-blue-700' : ''
              }`}
            >
              {planSeleccionado === plan.id ? '✓ Plan Seleccionado' : `Seleccionar ${plan.nombre}`}
            </button>
            
            <p className="mt-3 text-center text-xs font-medium text-slate-400">
              Renovación automática mensual. Cancelas cuando quieras.
            </p>
          </div>
        ))}
      </div>

      {/* Sección Informativa / Beneficio de la PWA */}
      <div className="mx-auto mt-14 max-w-4xl rounded-2xl bg-blue-900 p-6 text-white shadow-lg sm:mt-16 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">¿Cómo funciona el flujo de cobros autónomo?</h3>
            <p className="text-sm text-blue-100 max-w-2xl">
              Al habilitar los pagos directos, el cliente recibe alertas automáticas y paga desde su propia interfaz móvil sin esperar al cobrador de campo. Las licencias contratadas te permiten mantener cobradores físicos únicamente para cuentas especiales o zonas de difícil acceso.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 text-center min-w-[150px]">
            <span className="block text-2xl font-black text-white">0%</span>
            <span className="text-xs text-blue-200">Riesgo de Efectivo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suscripciones;