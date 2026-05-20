import { useEffect, useRef, useState } from 'react';
import { PenTool, Grid, CalendarDays, Map as MapIcon, Layers, Trash2 } from 'lucide-react';

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
  
  // States para la nueva funcionalidad
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [drawingManager, setDrawingManager] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygons, setPolygons] = useState<any[]>([]);
  const [mapType, setMapType] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [showSchedule, setShowSchedule] = useState(false);
  const [templateApplied, setTemplateApplied] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setError('API Key faltante');
      return;
    }

    const initMap = async () => {
      try {
        (setOptions as any)({ apiKey, version: 'weekly', libraries: ['maps', 'marker', 'geometry', 'drawing'] });
        
        const [
          { Map, InfoWindow },
          { Marker },
          { spherical },
          { DrawingManager }
        ] = await Promise.all([
          importLibrary('maps') as Promise<google.maps.MapsLibrary>,
          importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
          importLibrary('geometry') as Promise<google.maps.GeometryLibrary>,
          importLibrary('drawing') as any
        ]);

        if (mapRef.current) {
          const map = new Map(mapRef.current, {
            center: center,
            zoom: zoom,
            mapTypeId: mapType,
            mapId: 'DEMO_MAP_ID',
            tilt: 45,
            heading: 0,
            gestureHandling: 'greedy',
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          setMapInstance(map);

          const dm = new DrawingManager({
            drawingMode: null,
            drawingControl: false,
            polygonOptions: {
              fillColor: '#34d399',
              fillOpacity: 0.35,
              strokeWeight: 2,
              strokeColor: '#34d399',
              clickable: true,
              editable: true,
              zIndex: 1,
            },
          });

          dm.setMap(map);
          setDrawingManager(dm);

          window.google.maps.event.addListener(dm, 'polygoncomplete', (polygon: any) => {
            setPolygons(prev => [...prev, polygon]);
            dm.setDrawingMode(null);
            setIsDrawing(false);
            
            const areaM2 = spherical.computeArea(polygon.getPath());
            if (onAreaChange) onAreaChange(areaM2);
          });

          // Marcador Inicial
          const marker = new Marker({
            position: center,
            map: map,
            title: 'Santa Cruz, Nayarit - AgroVision Core',
          });

          const infoWindow = new InfoWindow({
            content: `
              <div style="color: #1a1a1a; font-family: sans-serif; padding: 8px;">
                <h4 style="margin: 0; font-size: 12px; font-weight: 800; color: #064e3b; text-transform: uppercase;">Lote Principal</h4>
                <p style="margin: 2px 0 0; font-size: 10px; color: #666;">Selecciona herramientas para delimitar.</p>
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
  }, [apiKey, center, zoom]); // Omit mapType initially to avoid full re-rendering of the map, handled below.

  // Handle Map Type Change
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setMapTypeId(mapType);
    }
  }, [mapType, mapInstance]);

  const toggleDrawingMode = () => {
    if (drawingManager) {
      const newMode = isDrawing ? null : window.google.maps.drawing.OverlayType.POLYGON;
      drawingManager.setDrawingMode(newMode);
      setIsDrawing(!isDrawing);
    }
  };

  const clearPolygons = () => {
    polygons.forEach(p => p.setMap(null));
    setPolygons([]);
    setTemplateApplied(false);
    setShowSchedule(false);
  };

  const toggleTemplate = () => {
    if (polygons.length === 0) {
      alert("Traza tu lote primero usando la herramienta de dibujo.");
      return;
    }
    
    // Cambiar el estilo de los poligonos para simular los surcos
    const isNowApplied = !templateApplied;
    polygons.forEach(p => {
      p.setOptions({
        fillColor: isNowApplied ? '#fbbf24' : '#34d399',
        fillOpacity: isNowApplied ? 0.6 : 0.35,
        strokeColor: isNowApplied ? '#b45309' : '#34d399',
        strokeWeight: isNowApplied ? 3 : 2,
      });
    });
    setTemplateApplied(isNowApplied);
    if (isNowApplied) setShowSchedule(true);
  };

  const cycleMapType = () => {
    if (mapType === 'satellite') setMapType('terrain');
    else if (mapType === 'terrain') setMapType('hybrid');
    else setMapType('satellite');
  };

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
      
      {/* Floating Toolbar */}
      {mapLoaded && (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-2 flex flex-col gap-2">
            <button 
              onClick={toggleDrawingMode}
              className={`p-3 rounded-xl transition-all flex items-center justify-center group relative overflow-hidden ${isDrawing ? 'bg-emerald-500 text-white shadow-inner shadow-emerald-700/50' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
              title="Trazar Lote"
            >
              <PenTool size={18} className={isDrawing ? 'animate-pulse' : ''} />
              <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-[9px] rounded uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                Marcar Terreno
              </div>
            </button>

            <button 
              onClick={toggleTemplate}
              className={`p-3 rounded-xl transition-all flex items-center justify-center group relative overflow-hidden ${templateApplied ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
              title="Plantilla de Surcos"
            >
              <Grid size={18} />
              <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-[9px] rounded uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                Plantilla Surcos
              </div>
            </button>

            <button 
              onClick={() => setShowSchedule(!showSchedule)}
              className={`p-3 rounded-xl transition-all flex items-center justify-center group relative overflow-hidden ${(showSchedule && templateApplied) ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
              title="Rol de Siembra"
            >
              <CalendarDays size={18} />
              <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-[9px] rounded uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                Productividad y Rol
              </div>
            </button>

            <div className="w-full h-[1px] bg-white/10 my-1"></div>

            <button 
              onClick={cycleMapType}
              className="p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center group relative"
              title="Cambiar Vista"
            >
              {mapType === 'satellite' ? <Layers size={18} /> : <MapIcon size={18} />}
              <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-[9px] rounded uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                Vista: {mapType}
              </div>
            </button>

            {polygons.length > 0 && (
              <button 
                onClick={clearPolygons}
                className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center group relative mt-1"
                title="Limpiar Mapa"
              >
                <Trash2 size={18} />
                <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-[9px] rounded uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                  Limpiar Lotes
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Schedule / Productivity Overlay */}
      {showSchedule && templateApplied && (
        <div className="absolute bottom-4 left-4 right-4 z-20 md:left-[80px] md:right-auto md:w-80">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 shadow-2xl rounded-2xl p-5">
            <h3 className="text-white font-black uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
              <CalendarDays size={14} className="text-blue-400" />
              Rol de Siembra Activo
            </h3>
            
            <div className="space-y-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Configuración del Surco</p>
                <div className="flex justify-between items-end">
                  <span className="text-white font-semibold text-sm">Alta Densidad</span>
                  <span className="text-blue-400 text-[10px] font-black">90x30 cm</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">Día 1-15</span>
                  <span className="text-white font-black text-xs block">Siembra Zona A</span>
                  <span className="text-slate-400 text-[9px]">Goteo nocturno</span>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  <span className="text-[10px] text-amber-400 font-bold block mb-1 uppercase">Día 16-30</span>
                  <span className="text-white font-black text-xs block">Siembra Zona B</span>
                  <span className="text-slate-400 text-[9px]">Preparación suelo</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic leading-relaxed pt-2 border-t border-white/10 mt-2">
                Esta plantilla garantiza la rotación mensual, manteniendo el flujo de caja activo y respetando los ciclos del mercado seleccionados.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
