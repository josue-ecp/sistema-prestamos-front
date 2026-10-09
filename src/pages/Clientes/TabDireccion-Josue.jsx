import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente auxiliar para corregir el tamaño gris cuando el mapa está en pestañas ocultas
// Componente auxiliar con ResizeObserver para corregir el mapa en pestañas automáticamente
function MapController() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    
    const container = map.getContainer();
    if (container) {
      observer.observe(container);
    }

    return () => {
      observer.disconnect();
    };
  }, [map]);
  return null;
}

function LocationSelector({ position, onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function TabDireccion({ lat, lng, onChangeCoordinates }) {
  const [position, setPosition] = useState(() => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      return [parseFloat(lat), parseFloat(lng)];
    }
    return [20.9674, -89.5926];
  });

  useEffect(() => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      setPosition([parseFloat(lat), parseFloat(lng)]);
    }
  }, [lat, lng]);

  const handleMarkerPlacement = (newPos) => {
    setPosition(newPos);
    if (onChangeCoordinates) {
      onChangeCoordinates(newPos[0], newPos[1]);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase">Ubicación y Geolocalización en Mapa</h3>
          <p className="text-xs text-gray-500">Haz clic en cualquier punto del mapa para fijar la ubicación exacta del cliente.</p>
        </div>
      </div>

      <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-300 shadow-xs relative z-0">
        <MapContainer 
          center={position} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ width: '100%', height: '100%' }}
        >
          <MapController />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationSelector position={position} onMapClick={handleMarkerPlacement} />
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Latitud Seleccionada</label>
          <input 
            type="text" 
            value={position[0]} 
            readOnly
            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Longitud Seleccionada</label>
          <input 
            type="text" 
            value={position[1]} 
            readOnly
            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}