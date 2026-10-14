import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { UserCheck } from 'lucide-react';

export default function Visitas() {
  const registros = [
    { id: 1, cliente: 'Josue Ceh Pool', checkIn: '14:25hrs', checkOut: '14:35hrs', duracion: '10 minutos' },
  ];

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mb-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Operación de campo</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Visitas ( Supervisión )</h1>
      </div>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
        {/* Encabezado Azul Panorámico */}
        <div className="bg-blue-900 px-5 py-4">
          <h2 className="text-sm font-bold text-white">Visitas ( Supervisión )</h2>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* MAPA PANORÁMICO */}
          <div className="h-[250px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
            <MapContainer center={[20.9674, -89.6236]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
          </div>

          {/* SELECTOR DE COBRATARIO */}
          <div className="max-w-sm space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Cobratario</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 uppercase">
                <option>SELECCIONE UN COBRATARIO</option>
                <option>ROMAN G.</option>
                <option>PEDRO P.</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-3 text-blue-700">
                <UserCheck size={14} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[650px] border-collapse text-center text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-bold">Cliente</th>
                  <th className="px-4 py-3 font-bold">Check-in</th>
                  <th className="px-4 py-3 font-bold">Check-out</th>
                  <th className="px-4 py-3 font-bold">Duración</th>
                  <th className="px-4 py-3 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((reg) => (
                  <tr key={reg.id} className="border-b border-slate-100 text-slate-700 transition-colors hover:bg-blue-50/40">
                    <td className="px-4 py-3 font-medium">{reg.cliente}</td>
                    <td className="px-4 py-3">{reg.checkIn}</td>
                    <td className="px-4 py-3">{reg.checkOut}</td>
                    <td className="px-4 py-3">{reg.duracion}</td>
                    <td className="py-3 px-4"></td>
                  </tr>
                ))}
                {[...Array(4)].map((_, i) => (
                  <tr key={`empty-${i}`} className="h-12 border-b border-slate-100">
                    <td></td><td></td><td></td><td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BARRA DE ESTADO INFERIOR */}
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Mostrando del 1 al 1 de 1
          </p>
        </div>
      </div>
    </div>
  );
}