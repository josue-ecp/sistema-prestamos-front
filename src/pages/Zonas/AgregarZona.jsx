import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowLeft } from 'lucide-react';

// Configuración de icono para el mapa
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) { setPosition(e.latlng); },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

export default function AgregarZona() {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: 20.9674, lng: -89.6236 });
  
  // Lista de clientes basada en tu imagen
  const clientes = ["Josue Ceh Pool", "Adrián Keb", "Mario Pech"];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      
      {/* Botón Volver Estandarizado */}
      <button 
        onClick={() => navigate('/zonas')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden max-w-5xl">
        
        {/* Encabezado Azul */}
        <div className="bg-[#0b66c2] px-4 py-2">
          <h2 className="text-white text-sm font-medium">Agregar Nueva Zona</h2>
        </div>

        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Columna Izquierda: Tabla de Clientes */}
            <div className="w-full lg:w-1/3">
              <table className="w-full border-collapse border border-gray-400 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 py-2 px-4 text-left font-bold uppercase text-xs">Cliente</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 py-2 px-4 text-gray-700">{cliente}</td>
                    </tr>
                  ))}
                  {/* Fila de paginación interna */}
                  <tr className="bg-gray-50">
                    <td className="border border-gray-400 py-1 px-4 text-[10px] text-gray-400 font-bold">
                      Mostrando del 1 al 1 de 1
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Columna Derecha: Mapa y Descripción */}
            <div className="flex-1 space-y-6">
              <div className="w-full h-[350px] bg-gray-200 rounded border border-gray-300 overflow-hidden relative shadow-inner">
                <MapContainer center={[20.9674, -89.6236]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-bold uppercase tracking-tight">Descripción de la zona</label>
                <input 
                  type="text" 
                  placeholder="Ingresa el nombre de la zona" 
                  className="w-full border border-gray-400 bg-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Barra de Acciones Inferior Estandarizada */}
          <div className="mt-12 flex gap-3 p-3 bg-[#e5e7eb] rounded">
            <button 
              type="submit"
              className="bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-8 py-1.5 rounded text-xs uppercase transition-all shadow-sm active:scale-95"
            >
              Aceptar
            </button>
            <button 
              type="button"
              onClick={() => navigate('/zonas')}
              className="bg-[#e74c3c] hover:bg-red-600 text-white font-bold px-8 py-1.5 rounded text-xs uppercase transition-all shadow-sm active:scale-95"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}