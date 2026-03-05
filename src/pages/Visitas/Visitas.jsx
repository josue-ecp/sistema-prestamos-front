import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { UserCheck } from 'lucide-react';

export default function Visitas() {
  const registros = [
    { id: 1, cliente: 'Josue Ceh Pool', checkIn: '14:25hrs', checkOut: '14:35hrs', duracion: '10 minutos' },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Visitas ( Supervisión )</h1>

      <div className="bg-[#cccccc] rounded shadow-sm border border-gray-300 overflow-hidden max-w-6xl">
        {/* Encabezado Azul Panorámico */}
        <div className="bg-[#0b66c2] px-4 py-1.5">
          <h2 className="text-white text-sm font-medium">Visitas ( Supervisión )</h2>
        </div>

        <div className="p-4 space-y-6">
          {/* MAPA PANORÁMICO */}
          <div className="w-full h-[250px] bg-gray-200 rounded border border-gray-400 overflow-hidden shadow-inner">
            <MapContainer center={[20.9674, -89.6236]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
          </div>

          {/* SELECTOR DE COBRATARIO */}
          <div className="max-w-xs space-y-1">
            <label className="text-gray-700 text-sm font-bold">Cobratario</label>
            <div className="relative">
              <select className="w-full border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs text-gray-500 font-bold focus:outline-none appearance-none uppercase">
                <option>SELECCIONE UN COBRATARIO</option>
                <option>ROMAN G.</option>
                <option>PEDRO P.</option>
              </select>
              <div className="absolute right-2 top-2 pointer-events-none text-gray-400">
                <UserCheck size={14} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-400">
            <table className="w-full border-collapse text-center text-sm">
              <thead>
                <tr className="bg-white text-gray-800 border-b border-gray-400">
                  <th className="border-r border-gray-400 py-2 px-4 font-bold">Cliente</th>
                  <th className="border-r border-gray-400 py-2 px-4 font-bold">Check-in</th>
                  <th className="border-r border-gray-400 py-2 px-4 font-bold">Check-out</th>
                  <th className="border-r border-gray-400 py-2 px-4 font-bold">Duración</th>
                  <th className="py-2 px-4 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 py-3 px-4">{reg.cliente}</td>
                    <td className="border-r border-gray-300 py-3 px-4">{reg.checkIn}</td>
                    <td className="border-r border-gray-300 py-3 px-4">{reg.checkOut}</td>
                    <td className="border-r border-gray-300 py-3 px-4">{reg.duracion}</td>
                    <td className="py-3 px-4"></td>
                  </tr>
                ))}
                {[...Array(4)].map((_, i) => (
                  <tr key={`empty-${i}`} className="h-12 border-b border-gray-300">
                    <td className="border-r border-gray-300"></td>
                    <td className="border-r border-gray-300"></td>
                    <td className="border-r border-gray-300"></td>
                    <td className="border-r border-gray-300"></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BARRA DE ESTADO INFERIOR */}
        <div className="bg-white border-t border-gray-400 px-4 py-1">
          <p className="text-[10px] text-gray-500 font-bold uppercase">
            Mostrando del 1 al 1 de 1
          </p>
        </div>
      </div>
    </div>
  );
}