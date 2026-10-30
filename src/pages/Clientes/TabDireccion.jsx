import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { LoaderCircle, MapPin, Search } from 'lucide-react';
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

function MapSearchControl({ onSelectCoordinates }) {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const requestController = useRef(null);
  const controlRef = useRef(null);

  useEffect(() => {
    const control = controlRef.current;
    if (control) {
      L.DomEvent.disableClickPropagation(control);
      L.DomEvent.disableScrollPropagation(control);
    }

    return () => {
      requestController.current?.abort();
      requestController.current = null;
    };
  }, []);

  const goToPlace = (place) => {
    const [longitude, latitude] = place.geometry.coordinates;
    map.flyTo([latitude, longitude], Math.max(map.getZoom(), 16), {
      duration: 1.2,
    });
    onSelectCoordinates(latitude, longitude);
    setQuery(place.label);
    setSearchError('');
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchTerm = query.trim();

    if (!searchTerm) {
      setSearchError('Escribe una ubicación para buscar.');
      setSuggestions([]);
      return;
    }

    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setIsSearching(true);
    setSearchError('');
    setSuggestions([]);

    try {
      const center = map.getCenter();
      const params = new URLSearchParams({
        q: searchTerm,
        limit: '5',
        lang: 'es',
        lat: String(center.lat),
        lon: String(center.lng),
      });
      const response = await fetch(`https://photon.komoot.io/api/?${params}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`La búsqueda respondió con estado ${response.status}.`);
      }

      const data = await response.json();
      const places = (data.features || [])
        .map((feature) => {
          const [longitude, latitude] = feature.geometry?.coordinates || [];
          const properties = feature.properties || {};
          const street = [properties.housenumber, properties.street]
            .filter(Boolean)
            .join(' ');
          const label = [
            properties.name,
            street,
            properties.district,
            properties.city,
            properties.state,
            properties.country,
          ]
            .filter(Boolean)
            .filter((part, index, parts) => parts.indexOf(part) === index)
            .join(', ');

          if (
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90 ||
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
          ) {
            return null;
          }

          return {
            geometry: { coordinates: [longitude, latitude] },
            label: label || searchTerm,
          };
        })
        .filter(Boolean);

      if (places.length === 0) {
        setSearchError('No se encontraron ubicaciones. Prueba con otra búsqueda.');
        return;
      }

      setSuggestions(places);
      goToPlace(places[0]);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error al buscar la ubicación:', error);
        setSearchError('No se pudo completar la búsqueda. Inténtalo de nuevo.');
      }
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
        setIsSearching(false);
      }
    }
  };

  return (
    <div ref={controlRef} className="absolute left-3 right-3 top-3 z-[1000] sm:right-auto sm:w-96">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/15"
      >
        <Search size={18} className="ml-1 shrink-0 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar colonia, calle o municipio"
          aria-label="Buscar ubicación"
          aria-expanded={suggestions.length > 0}
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={isSearching}
          aria-label="Buscar ubicación"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-800 text-white transition hover:bg-blue-900 disabled:cursor-wait disabled:opacity-70"
        >
          {isSearching
            ? <LoaderCircle size={17} className="animate-spin" />
            : <Search size={17} />}
        </button>
      </form>

      {searchError && (
        <p role="status" className="mt-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-amber-800 shadow-md">
          {searchError}
        </p>
      )}

      {suggestions.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/15">
          {suggestions.map((place, index) => (
            <li key={`${place.label}-${index}`}>
              <button
                type="button"
                onClick={() => {
                  goToPlace(place);
                  setSuggestions([]);
                }}
                className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
                <span className="min-w-0 flex-1">{place.label}</span>
              </button>
            </li>
          ))}
          <li className="border-t border-slate-100 px-3 py-1.5 text-right text-[10px] text-slate-400">
            Resultados de Photon · © OpenStreetMap
          </li>
        </ul>
      )}
    </div>
  );
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
        <MapSearchControl
          onSelectCoordinates={(selectedLat, selectedLng) => {
            if (onChangeCoordinates) {
              onChangeCoordinates(selectedLat, selectedLng);
            }
          }}
        />
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