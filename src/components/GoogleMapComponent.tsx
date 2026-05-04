import { useEffect, useRef, useState } from 'react';

// Intentamos importar la nueva API funcional. Si falla, fallará en tiempo de compilación/ejecución
// pero según el error del usuario, esta es la forma correcta ahora.
// @ts-ignore - Dependiendo de la versión, puede que los tipos no estén actualizados
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

interface GoogleMapComponentProps {
  apiKey?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  onAreaChange?: (areaM2: number) => void;
}

export function GoogleMapComponent({ 
  apiKey: propApiKey, 
  center = { lat: 21.528523, lng: -104.811171 }, 
  zoom = 18,
  onAreaChange
}: GoogleMapComponentProps) {
  // Priorizar prop -> localStorage -> env
  const apiKey = propApiKey || localStorage.getItem('user_google_maps_key') || (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'satellite' | 'ndvi'>('satellite');

  useEffect(() => {
    if (!apiKey) {
      setError('API Key faltante');
      return;
    }

    const initMap = async () => {
      try {
        (setOptions as any)({ apiKey, version: 'weekly' });
        
        const [
          { Map, InfoWindow },
          { Marker },
          { Polygon },
          { spherical }
        ] = await Promise.all([
          importLibrary('maps') as Promise<google.maps.MapsLibrary>,
          importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
          importLibrary('maps') as unknown as Promise<google.maps.MapsLibrary>, 
          importLibrary('geometry') as Promise<google.maps.GeometryLibrary>
        ]);

        if (mapRef.current) {
          const map = new Map(mapRef.current, {
            center: center,
            zoom: zoom,
            mapTypeId: 'satellite',
            tilt: 45,
            mapId: '90f00ed64687d559',
            heading: 0,
            gestureHandling: 'greedy',
            mapTypeControl: false,
            streetViewControl: false
          });

          const plantingAreaCoords = [
            { lat: 21.5290, lng: -104.8115 },
            { lat: 21.5290, lng: -104.8105 },
            { lat: 21.5280, lng: -104.8105 },
            { lat: 21.5280, lng: -104.8115 },
          ];

          const areaPolygon = new Polygon({
            paths: plantingAreaCoords,
            strokeColor: viewMode === 'ndvi' ? '#4ade80' : '#34d399',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: viewMode === 'ndvi' ? '#166534' : '#064e3b',
            fillOpacity: viewMode === 'ndvi' ? 0.6 : 0.35,
            map: map
          });

          const areaM2 = spherical.computeArea(areaPolygon.getPath());
          if (onAreaChange) onAreaChange(areaM2);
          
          const marker = new Marker({
            position: center,
            map: map,
            title: 'Santa Cruz, Nayarit - AgroVision Core',
          });

          const infoWindow = new InfoWindow({
            content: `
              <div style="color: #1a1a1a; font-family: sans-serif; padding: 8px;">
                <h4 style="margin: 0; font-size: 12px; font-weight: 800; color: #064e3b; text-transform: uppercase;">Lote Santa Cruz A1</h4>
                <p style="margin: 4px 0 0; font-size: 10px; font-weight: 600;">Área: ${(areaM2 / 10000).toFixed(2)} Ha</p>
                <p style="margin: 2px 0 0; font-size: 10px; color: #666;">Topografía: Pendiente SW 4°</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          setMapLoaded(true);
        }
      } catch (e) {
        console.error('Google Maps Load Error:', e);
        setError('Error al cargar Google Maps');
      }
    };

    initMap();
  }, [apiKey, center, zoom, viewMode]);

  if (error) {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white/50 p-8 text-center transition-all">
        <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-xl">⚠️</span>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
        <p className="text-[10px] mt-2 opacity-60">Configura VITE_GOOGLE_MAPS_API_KEY en .env</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10 transition-opacity">
          <div className="w-8 h-8 border-4 border-brand-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" id="google-map-container" />
      
      {/* NDVI Toggle UI */}
      {mapLoaded && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button 
            onClick={() => setViewMode(viewMode === 'satellite' ? 'ndvi' : 'satellite')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all border ${
              viewMode === 'ndvi' 
              ? 'bg-emerald-500 text-white border-emerald-400' 
              : 'bg-white/10 text-white/70 backdrop-blur-md border-white/20 hover:bg-white/20'
            }`}
          >
            {viewMode === 'ndvi' ? '☘️ Salud Activa (NDVI)' : '📡 Ver Vigor (NDVI)'}
          </button>
        </div>
      )}
    </div>
  );
}
