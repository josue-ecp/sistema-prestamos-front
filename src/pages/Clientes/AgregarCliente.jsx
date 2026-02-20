import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

// Importamos los íconos necesarios para la pestaña de Dirección
import { Search, Clock } from 'lucide-react';

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
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
};

export default function AgregarCliente() {
  const navigate = useNavigate();

  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState('Cliente');
  
  // Coordenadas iniciales (Mérida, Yucatán)
  const [position, setPosition] = useState({ lat: 20.9674, lng: -89.6236 });

  // Lista de archivos para la pestaña Expediente
  const archivosExpediente = [
    "Identificación Oficial (INE)",
    "Comprobante de domicilio",
    "Archivo libre 1",
    "Archivo libre 2",
    "Archivo libre 3"
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa]">
      
      <div className="bg-[#f0f0f0] rounded-lg shadow-sm overflow-hidden border border-gray-200 max-w-6xl mx-auto">
        
        <div className="bg-[#0b66c2] px-6 py-3">
          <h2 className="text-white font-semibold text-lg">Información del cliente</h2>
        </div>

        {/* Sistema de Pestañas */}
        <div className="flex gap-4 px-8 pt-8 mb-8">
          <button 
            onClick={() => setActiveTab('Cliente')}
            className={`px-12 py-2.5 font-bold rounded-sm border-2 transition-colors ${
              activeTab === 'Cliente' ? 'bg-[#b8b8b8] text-black border-gray-400' : 'bg-[#e5e5e5] text-gray-600 border-transparent hover:bg-[#d4d4d4]'
            }`}
          >
            Cliente
          </button>
          <button 
            onClick={() => setActiveTab('Dirección')}
            className={`px-12 py-2.5 font-bold rounded-sm border-2 transition-colors ${
              activeTab === 'Dirección' ? 'bg-[#b8b8b8] text-black border-gray-400' : 'bg-[#e5e5e5] text-gray-600 border-transparent hover:bg-[#d4d4d4]'
            }`}
          >
            Dirección
          </button>
          <button 
            onClick={() => setActiveTab('Expediente')}
            className={`px-12 py-2.5 font-bold rounded-sm border-2 transition-colors ${
              activeTab === 'Expediente' ? 'bg-[#b8b8b8] text-black border-gray-400' : 'bg-[#e5e5e5] text-gray-600 border-transparent hover:bg-[#d4d4d4]'
            }`}
          >
            Expediente
          </button>
        </div>

        {/* ========================================= */}
        {/* VISTA 1: CLIENTE (Formulario + Mapa)      */}
        {/* ========================================= */}
        {activeTab === 'Cliente' && (
          <div className="px-8 pb-8 flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre(s)</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Apellidos</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">E-mail</label>
                <input type="email" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Teléfonos de contacto</label>
                <input type="tel" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="flex-1">
              <div className="relative w-full h-[350px] bg-gray-300 rounded-sm overflow-hidden border border-gray-300 shadow-inner">
                <div className="absolute top-4 left-4 right-14 z-[1000]">
                  <input type="text" placeholder="Buscar dirección" className="w-full px-4 py-2.5 rounded-sm shadow-md border-none focus:outline-none text-sm font-medium" />
                </div>
                <MapContainer center={[20.9674, -89.6236]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                * Haz clic en el mapa para ajustar la ubicación exacta. (Lat: {position?.lat.toFixed(4)}, Lng: {position?.lng.toFixed(4)})
              </p>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VISTA 2: DIRECCIÓN                        */}
        {/* ========================================= */}
        {activeTab === 'Dirección' && (
          <div className="px-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-in fade-in duration-300">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Calle</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Número Interior</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Número Exterior</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Cruzamientos</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Referencias del lugar</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Colonia</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Ciudad</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Estado</label>
                <input type="text" className="w-full bg-[#d9d9d9] border-none rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Código Postal</label>
                <div className="flex w-3/4">
                  <input type="text" className="flex-1 bg-[#d9d9d9] border-none rounded-l-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button className="bg-[#0066ff] hover:bg-blue-700 text-white px-4 flex items-center justify-center rounded-r-sm transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Horario de visita</label>
                <div className="flex gap-4">
                  <div className="flex flex-1 border border-gray-400 rounded-sm overflow-hidden">
                    <input type="text" placeholder="12:00AM" className="w-full bg-[#e5e5e5] border-none text-center px-2 py-2.5 focus:outline-none" />
                    <div className="bg-[#f0f0f0] border-l border-gray-400 px-3 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-1 border border-gray-400 rounded-sm overflow-hidden">
                    <input type="text" placeholder="12:00PM" className="w-full bg-[#e5e5e5] border-none text-center px-2 py-2.5 focus:outline-none" />
                    <div className="bg-[#f0f0f0] border-l border-gray-400 px-3 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* VISTA 3: EXPEDIENTE                       */}
        {/* ========================================= */}
        {activeTab === 'Expediente' && (
          <div className="px-16 pb-12 pt-4 space-y-8 animate-in fade-in duration-300">
            {archivosExpediente.map((archivo, index) => (
              <div key={index} className="flex items-center gap-8">
                <span className="w-64 text-gray-700 font-medium">{archivo}</span>
                <button className="border border-[#e74c3c] bg-[#e5e5e5] text-gray-500 px-8 py-2.5 rounded-[2rem] hover:bg-red-50 transition-colors">
                  Adjuntar archivo
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ========================================= */}
        {/* FOOTER: BOTONES DE ACCIÓN                 */}
        {/* ========================================= */}
        <div className="bg-[#d9d9d9] px-8 py-4 flex gap-4 border-t border-gray-300">
          <button 
            onClick={() => navigate('/clientes')}
            className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold px-8 py-2.5 rounded-sm transition-colors shadow-sm"
          >
            ACEPTAR
          </button>
          <button 
            onClick={() => navigate('/clientes')} 
            className="bg-[#e74c3c] hover:bg-[#c0392b] text-white font-bold px-8 py-2.5 rounded-sm transition-colors shadow-sm"
          >
            CANCELAR
          </button>
        </div>

      </div>
    </div>
  );
}