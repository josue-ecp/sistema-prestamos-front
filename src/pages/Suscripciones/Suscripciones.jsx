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
      icono: <Star className="w-6 h-6 text-emerald-600" />,
      caracteristicas: [
        'Hasta 15 licencias de cobratario',
        'Pagos directos desde la PWA habilitados',
        'Gestión avanzada de zonas de cobro',
        'Métricas de rendimiento en Dashboard',
        'Soporte prioritario 24/7',
      ],
      colorBoton: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md',
      popular: true
    },
    {
      id: 'empresarial',
      nombre: 'EMPRESARIAL',
      precio: '$7,999',
      licencias: 'Licencias Ilimitadas',
      icono: <Crown className="w-6 h-6 text-indigo-600" />,
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
     
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Elige tu Plan de Crecimiento para Empresas
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Optimiza tu flujo de trabajo. Con <span className="font-bold text-blue-600">PrestaYA!</span>, tus clientes pagan directo desde la PWA, reduciendo la necesidad de reestructurar o saturar a tu personal de campo.
        </p>
      </div>

      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border ${
              plan.popular 
                ? 'border-emerald-500 ring-4 ring-emerald-500 ring-opacity-10 md:scale-105' 
                : 'border-gray-200 shadow-sm'
            }`}
          >
           
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                Más Vendido / Recomendado
              </span>
            )}

          
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-black uppercase tracking-widest text-gray-400">
                {plan.nombre}
              </span>
              <div className="p-2 bg-gray-50 rounded-lg">
                {plan.icono}
              </div>
            </div>

            
            <div className="mb-2 flex items-baseline text-gray-950">
              <span className="text-4xl md:text-5xl font-black tracking-tight">{plan.precio}</span>
              <span className="ml-2 text-sm font-semibold text-gray-500">MXN/mes</span>
            </div>
            
            
            <p className="text-sm font-bold text-blue-600 mb-6 bg-blue-50 py-1 px-3 rounded-md inline-block">
              {plan.licencias}
            </p>

            <hr className="border-gray-100 mb-6" />

            {/* Características */}
            <ul className="space-y-4 mb-8 min-h-[220px]">
              {plan.caracteristicas.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-600">
                  <div className="flex-shrink-0 p-0.5 bg-blue-50 rounded-full mr-3 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            
            <button
              onClick={() => setPlanSeleccionado(plan.id)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-colors duration-200 ${plan.colorBoton} ${
                planSeleccionado === plan.id ? 'ring-2 ring-offset-2 ring-blue-600' : ''
              }`}
            >
              {planSeleccionado === plan.id ? '✓ Plan Seleccionado' : `Seleccionar ${plan.nombre}`}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-3 font-medium">
              Renovación automática mensual. Cancelas cuando quieras.
            </p>
          </div>
        ))}
      </div>

      {/* Sección Informativa / Beneficio de la PWA */}
      <div className="max-w-4xl mx-auto mt-16 bg-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">¿Cómo funciona el flujo de cobros autónomo?</h3>
            <p className="text-sm text-blue-100 max-w-2xl">
              Al habilitar los pagos directos, el cliente recibe alertas automáticas y paga desde su propia interfaz móvil sin esperar al cobrador de campo. Las licencias contratadas te permiten mantener cobradores físicos únicamente para cuentas especiales o zonas de difícil acceso.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 text-center min-w-[150px]">
            <span className="block text-2xl font-black text-emerald-400">0%</span>
            <span className="text-xs text-blue-200">Riesgo de Efectivo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suscripciones;