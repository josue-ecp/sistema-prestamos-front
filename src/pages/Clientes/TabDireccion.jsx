import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

function MapSizeController() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let frameId;

    const invalidateSize = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        map.invalidateSize({ pan: false });
      });
    };

    invalidateSize();

    const observer = new ResizeObserver(invalidateSize);
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [map]);

  return null;
}

export default function TabDireccion({ lat, lng, onChangeCoordinates }) {
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  const hasCoordinates = lat != null && lat !== '' &&
    lng != null && lng !== '' &&
    Number.isFinite(parsedLat) && parsedLat >= -90 && parsedLat <= 90 &&
    Number.isFinite(parsedLng) && parsedLng >= -180 && parsedLng <= 180;
  const position = hasCoordinates ? [parsedLat, parsedLng] : [20.9674, -89.5926];

  const handleMarkerPlacement = (newPos) => {
    // Notificamos inmediatamente al componente padre (AgregarCliente)
    if (onChangeCoordinates) {
      onChangeCoordinates(newPos[0], newPos[1]);
    }
  };

  return (
    <div className="space-y-6 p-5 animate-in fade-in duration-300 sm:p-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-800">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">Ubicación y Geolocalización en Mapa</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Haz clic en cualquier punto del mapa para fijar la ubicación exacta del cliente.</p>
        </div>
      </div>

      <div className="relative z-0 h-80 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <MapContainer 
          center={position} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ width: '100%', height: '100%' }}
        >
          <MapSizeController />
          <TileLayer
            attribution='&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <LocationSelector position={position} onMapClick={handleMarkerPlacement} />
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Latitud Seleccionada</label>
          <input 
            type="text" 
            value={position[0]} 
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Longitud Seleccionada</label>
          <input 
            type="text" 
            value={position[1]} 
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600"
          />
        </div>
      </div>
    </div>
  );
}