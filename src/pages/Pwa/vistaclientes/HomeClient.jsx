import React from 'react';
import { FaUserCircle, FaCalendarAlt, FaCheckCircle, FaClock, FaHome, FaCreditCard, FaUser } from 'react-icons/fa';

const HomeClient = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Encabezado */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">María González</h1>
        <FaUserCircle className="text-4xl text-blue-600" />
      </header>

      {/* Tarjeta de Saldo */}
      <div className="mx-4 p-6 bg-blue-700 rounded-2xl text-white shadow-lg">
        <p className="text-blue-100 mb-1">Saldo Total a Pagar</p>
        <h2 className="text-4xl font-bold mb-2">$135.000,00</h2>
        <p className="text-sm opacity-90">Próximo vencimiento: 15 de Feb</p>
      </div>

      {/* Fecha de Cobro */}
      <div className="mx-4 mt-4 p-4 bg-indigo-100 rounded-xl flex items-center gap-3">
        <FaCalendarAlt className="text-blue-700 text-2xl" />
        <div>
          <p className="text-xs text-gray-600">Tu próxima fecha de cobro es:</p>
          <p className="font-bold text-gray-800">20 de Febrero, 2026</p>
        </div>
      </div>

      {/* Detalle de Cuotas */}
      <section className="mx-4 mt-6 flex-1">
        <h3 className="font-bold text-gray-800 mb-4">Detalle de Cuotas</h3>
        
        {/* Cuota Pagada */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Cuota 1 de 12</p>
            <p className="font-bold text-lg">$15.000,00</p>
          </div>
          <div className="text-center text-green-500">
            <FaCheckCircle className="mx-auto" />
            <p className="text-[10px] uppercase">Pagado</p>
          </div>
        </div>

        {/* Cuota Pendiente */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Cuota 2 de 12</p>
            <p className="font-bold text-lg">$15.000,00</p>
            <p className="text-[10px] text-gray-400">Vence: 15 de Feb</p>
          </div>
          <div className="text-center text-orange-400">
            <FaClock className="mx-auto" />
            <p className="text-[10px] uppercase">Pendiente</p>
          </div>
        </div>
      </section>

      {/* Botón Pagar */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-blue-700 transition">
          Pagar con tarjeta
        </button>
      </div>

      {/* Navbar inferior */}
      <nav className="fixed bottom-0 w-full bg-white border-t p-4 flex justify-around text-gray-500">
        <div className="text-center text-blue-600"><FaHome size={20}/><p className="text-[10px]">Inicio</p></div>
        <div className="text-center"><FaCreditCard size={20}/><p className="text-[10px]">Mis Pagos</p></div>
        <div className="text-center"><FaUser size={20}/><p className="text-[10px]">Perfil</p></div>
      </nav>
    </div>
  );
};

export default HomeClient;