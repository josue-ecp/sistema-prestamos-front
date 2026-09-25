import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function DetallePrestamo() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID del préstamo
  
  const [prestamo, setPrestamo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/prestamos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPrestamo(response.data);
      } catch (error) {
        console.error("Error al cargar detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Cargando detalles...</div>;
  if (!prestamo) return <div className="p-8 text-center text-red-500">Préstamo no encontrado.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/prestamos')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm cursor-pointer"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
        <div className="bg-[#0b66c2] px-4 sm:px-6 py-3">
          <h2 className="text-white text-sm font-medium">Prestamo - Folio: {prestamo.id_prestamo}</h2>
        </div>

        <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 items-center">
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Cliente</p>
            <p className="font-bold text-gray-900 text-sm uppercase">{prestamo.cliente?.nombre}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Crédito Original</p>
            <p className="font-bold text-gray-900 text-sm">${Number(prestamo.monto).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1 font-medium">Saldo Pendiente</p>
            <p className="font-bold text-gray-900 text-sm">${Number(prestamo.saldo_pendiente).toLocaleString()}</p>
          </div>
          <div className="flex md:justify-end">
            <button className="bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded text-sm flex items-center gap-2 shadow-sm uppercase cursor-pointer">
              <Plus size={18} /> Agregar Pago
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-8 pb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 min-w-[700px]">
              <thead>
                <tr className="bg-[#b8b8b8] text-gray-800 text-xs uppercase">
                  <th className="border border-gray-400 py-3">Fecha</th>
                  <th className="border border-gray-400 py-3">Monto</th>
                  <th className="border border-gray-400 py-3">Método</th>
                  <th className="border border-gray-400 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-center text-sm text-gray-700">
                {prestamo.pagos && prestamo.pagos.map((pago) => (
                  <tr key={pago.id_pago} className="hover:bg-gray-50">
                    <td className="border border-gray-300 py-3">{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                    <td className="border border-gray-300 py-3">${Number(pago.monto_pagado).toFixed(2)}</td>
                    <td className="border border-gray-300 py-3">{pago.metodo}</td>
                    <td className="border border-gray-300 py-3">
                      <button className="bg-[#e74c3c] text-white p-1 rounded hover:bg-red-600 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}