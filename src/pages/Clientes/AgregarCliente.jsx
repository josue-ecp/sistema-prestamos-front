import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Search, Clock, ArrowLeft } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('Cliente');
  const [position, setPosition] = useState({ lat: 20.9674, lng: -89.6236 });

  const archivosExpediente = [
    "Identificación Oficial (INE)",
    "Comprobante de domicilio",
    "Archivo libre 1",
    "Archivo libre 2",
    "Archivo libre 3"
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-[#f8f9fa] animate-in fade-in duration-500">
      
      {/* Botón Volver - */}
      <button 
        onClick={() => navigate('/clientes')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline text-sm"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
        
        {/* Encabezado  */}
        <div className="bg-[#0b66c2] px-4 py-2">
          <h2 className="text-white text-sm font-medium">Información del cliente</h2>
        </div>

        {/* Sistema de Pestañas*/}
        <div className="flex gap-2 px-6 pt-6 mb-6">
          {['Cliente', 'Dirección', 'Expediente'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab 
                ? 'border-blue-600 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        <div className="p-6">
          
          {/* VISTA 1: CLIENTE */}
          {activeTab === 'Cliente' && (
            <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
              <div className="flex-1 grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-600 text-sm font-medium">Nombre(s)</label>
                  <input type="text" className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-600 text-sm font-medium">Apellidos</label>
                  <input type="text" className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-600 text-sm font-medium">E-mail</label>
                  <input type="email" placeholder="ejemplo@correo.com" className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-600 text-sm font-medium">Teléfonos de contacto</label>
                  <input type="tel" className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none" />
                </div>
              </div>

              <div className="flex-1">
                <div className="w-full h-[300px] bg-gray-200 rounded border border-gray-300 overflow-hidden relative">
                  <MapContainer center={[20.9674, -89.6236]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tight">
                  * Haz clic para ajustar ubicación (Lat: {position?.lat.toFixed(4)}, Lng: {position?.lng.toFixed(4)})
                </p>
              </div>
            </div>
          )}

          {/* VISTA 2: DIRECCIÓN */}
          {activeTab === 'Dirección' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 animate-in fade-in duration-300">
              {[
                { label: 'Calle', type: 'text' },
                { label: 'Número Interior', type: 'text' },
                { label: 'Número Exterior', type: 'text' },
                { label: 'Cruzamientos', type: 'text' },
                { label: 'Colonia', type: 'text' },
                { label: 'Ciudad', type: 'text' },
                { label: 'Estado', type: 'text' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <label className="text-gray-600 text-sm font-medium">{item.label}</label>
                  <input type={item.type} className="border border-gray-400 bg-gray-50 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              ))}
              
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-sm font-medium">Código Postal</label>
                <div className="flex shadow-sm w-1/2">
                  <input type="text" className="w-full border border-gray-400 bg-gray-50 rounded-l px-2 py-1.5 text-xs focus:outline-none" />
                  <button className="bg-blue-600 text-white px-3 flex items-center justify-center rounded-r hover:bg-blue-700 transition-colors">
                    <Search size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-gray-600 text-sm font-medium">Horario de visita</label>
                <div className="flex gap-4">
                  <div className="flex border border-gray-400 rounded bg-gray-50 overflow-hidden w-40">
                    <input type="text" placeholder="12:00 AM" className="w-full text-center px-2 py-1.5 text-xs focus:outline-none bg-transparent" />
                    <div className="bg-gray-200 px-2 flex items-center border-l border-gray-400"><Clock size={14} /></div>
                  </div>
                  <div className="flex border border-gray-400 rounded bg-gray-50 overflow-hidden w-40">
                    <input type="text" placeholder="12:00 PM" className="w-full text-center px-2 py-1.5 text-xs focus:outline-none bg-transparent" />
                    <div className="bg-gray-200 px-2 flex items-center border-l border-gray-400"><Clock size={14} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 3: EXPEDIENTE */}
          {activeTab === 'Expediente' && (
            <div className="space-y-4 animate-in fade-in duration-300 max-w-2xl">
              {archivosExpediente.map((archivo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-700 font-medium">{archivo}</span>
                  <button className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                    Adjuntar archivo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER: BOTONES DE ACCIÓN (Barra Gris Estandarizada) */}
        <div className="mt-4 flex gap-3 p-3 bg-[#e5e7eb]">
          <button 
            onClick={() => navigate('/clientes')}
            className="bg-[#2ecc71] hover:bg-green-600 text-white font-bold px-8 py-1.5 rounded text-xs uppercase transition-all shadow-sm active:scale-95"
          >
            Aceptar
          </button>
          <button 
            onClick={() => navigate('/clientes')} 
            className="bg-[#e74c3c] hover:bg-red-600 text-white font-bold px-8 py-1.5 rounded text-xs uppercase transition-all shadow-sm active:scale-95"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}