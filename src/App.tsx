import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Sprout, 
  CloudRain, 
  DollarSign,
  Info,
  Layers,
  Map as MapIcon,
  Home,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { calculateQuimiasX, AgroParams } from './logic/agroEngine';
import { LandingPage } from './components/LandingPage';
import { GoogleMapComponent } from './components/GoogleMapComponent';
import { GroqChatComponent } from './components/GroqChatComponent';
import { ApiSettings } from './components/ApiSettings';

const INITIAL_PARAMS: AgroParams = {
  cicloDias: 85,
  elotesDiariosMeta: 1770,
  elotesPorMata: 1.17,
  distanciaSurcosCm: 45,
  distanciaMatasCm: 22,
  largoSurcoM: 100,
  precioElote: 8,
  costoKgSemilla: 120,
  costoKgUrea: 15,
  costoKgSulfatoMg: 25,
  costoMCintilla: 2.5,
  costoJornalDia: 450,
  jornalesPorBloque: 40,
  costosFijosBloque: 15000
};

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [params, setParams] = useState<AgroParams>({
    ...INITIAL_PARAMS,
    superficie: 0.82, // Default hectáreas based on current Santa Cruz lot
    cultivo: 'Maíz Elotero'
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [actualValues, setActualValues] = useState({
    yieldPerBlock: 11500, // Real result from Tepic
    totalCosts: 52000,   // Real spending
    actualPrice: 7.5,    // Market price achieved
    germinationRate: 0.85 
  });

  const prediction = useMemo(() => calculateQuimiasX(params), [params]);
  
  const actualProfit = useMemo(() => {
    return (actualValues.yieldPerBlock * actualValues.actualPrice) - actualValues.totalCosts;
  }, [actualValues]);

  const yieldDiscrepancy = ((actualValues.yieldPerBlock - prediction.elotesPorBloque) / prediction.elotesPorBloque) * 100;
  const costDiscrepancy = ((actualValues.totalCosts - prediction.costoTotalBloque) / prediction.costoTotalBloque) * 100;
  const actualROI = (actualProfit / actualValues.totalCosts) * 100;
  const profitMargin = (actualProfit / (actualValues.yieldPerBlock * actualValues.actualPrice)) * 100;

  if (view === 'landing') {
    return <LandingPage onEnterApp={(crop) => {
      if (crop) {
        setParams(prev => ({ ...prev, cultivo: crop }));
      }
      setView('dashboard');
    }} />;
  }

  return (
    <div className="w-full h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col overflow-hidden relative">
      <ApiSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      {/* Top Navigation */}
      <nav className="h-16 bg-brand-green-900 text-white flex items-center justify-between px-8 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('landing')}
            className="w-8 h-8 bg-brand-green-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Home size={14} className="text-brand-green-900" />
          </button>
          <span className="text-xl font-bold tracking-tight italic">
            AgroVision 3D <span className="font-light opacity-70 italic text-brand-green-300">[{params.cultivo}]</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest opacity-70">Clima Tepic, Nayarit</p>
            <p className="text-sm font-semibold italic flex items-center gap-2">
              <CloudRain size={14} className="text-brand-green-300" /> 22°C • Lluvia (Mayo)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mr-2"
              title="Configurar APIs"
            >
              <Settings size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-brand-green-700 border-2 border-brand-green-200 flex items-center justify-center overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        
        {/* LEFT COLUMN: 3D Visualization & Major Stats */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                  {/* 3D Viewer Card */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 text-[11px] font-bold uppercase tracking-tighter text-brand-green-900 flex items-center gap-2">
              <MapIcon size={12} /> Analizador IA: Santa Cruz, Nayarit (MODO API READY)
            </div>
            
            {/* AI HUD Overlay - Precision Topography */}
            <div className="absolute inset-0 z-10 pointer-events-none border-[24px] border-brand-green-900/5 flex flex-col justify-between p-8">
               <div className="flex justify-between items-start">
                  <div className="bg-brand-green-900/90 text-white p-3 rounded-xl text-[10px] font-mono backdrop-blur-sm border border-brand-green-400/30 shadow-2xl">
                     <p className="text-brand-green-400 mb-1 border-b border-brand-green-400/20 pb-1">DATOS GEODÉSICOS</p>
                     LAT: 21.528523<br/>
                     LON: -104.811171<br/>
                     ELE: 915 msnm (Estimado)
                  </div>
                  <div className="bg-brand-green-900/90 text-white p-3 rounded-xl text-[10px] font-mono text-right backdrop-blur-sm border border-brand-green-400/30 shadow-2xl">
                     <p className="text-brand-green-400 mb-1 border-b border-brand-green-400/20 pb-1">ANÁLISIS DE SUELO</p>
                     DRENAJE: 82% (PENDIENTE)<br/>
                     EROSIÓN: BAJA<br/>
                     ORIENTACIÓN: SW-22°
                  </div>
               </div>
               
               {/* Analysis Center Crosshair */}
               <div className="flex-1 flex items-center justify-center relative">
                  <div className="w-56 h-56 border border-brand-green-500/10 rounded-full animate-spin-slow"></div>
                  <div className="absolute w-64 h-64 border border-brand-green-500/5 rounded-full animate-reverse-spin-slow"></div>
                  <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-brand-green-500/20 to-transparent"></div>
                  <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-brand-green-500/20 to-transparent"></div>
                  
                  {/* AI Prediction Overlays */}
                  <div className="absolute top-[20%] left-[30%] bg-brand-green-900/90 text-[8px] px-2 py-1 rounded-lg border border-brand-green-400 text-white shadow-xl">
                     <p className="font-bold">BLOQUE A1 (SIEMBRA)</p>
                     <p className="opacity-70">HUMEDAD ÓPTIMA DETECTADA</p>
                  </div>

                  <div className="absolute bottom-[30%] right-[25%] bg-accent-yellow-400 text-[9px] px-3 py-1.5 rounded-lg border border-yellow-700 text-yellow-950 font-black uppercase shadow-xl animate-pulse">
                     PUNTO DE CORTE LUNES
                  </div>
               </div>

               <div className="flex justify-between items-end">
                  <div className="bg-brand-green-900/80 text-white px-3 py-1 rounded text-[10px] font-mono">
                     STATUS: SCANNING_TERRAIN_V4
                  </div>
                  <div className="bg-brand-green-500/20 border border-brand-green-500/50 text-brand-green-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase backdrop-blur-sm animate-pulse flex items-center gap-2">
                     <div className="w-2 h-2 bg-brand-green-500 rounded-full"></div>
                     Esperando Google Elevation API...
                  </div>
               </div>
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button className="px-4 py-2 bg-brand-green-700 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-brand-green-600 transition-all border border-brand-green-400/20">Iniciar Escaneo 3D</button>
            </div>
            
            {/* Map Placeholder with coordinate simulation */}
            <div className="flex-1 bg-[#1a1a1a] relative flex items-center justify-center overflow-hidden">
               <GoogleMapComponent 
                 onAreaChange={(area) => {
                   const hectares = area / 10000;
                   setParams(prev => ({ ...prev, superficie: Number(hectares.toFixed(2)) }));
                 }}
               />
               
               {/* Map Attribution/Scale Mockup (Conditional or static if map fails) */}
               <div className="absolute bottom-4 left-4 text-white/30 text-[8px] font-mono pointer-events-none">
                  INTEGRACIÓN GOOGLE MAPS JS API v3.55
               </div>

              {/* Legend Overlay */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-brand-green-950/90 backdrop-blur-xl p-4 rounded-2xl text-[10px] shadow-2xl border border-brand-green-500/20 text-white">
                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-yellow-400 rounded-sm shadow-sm shadow-yellow-200"></div><span className="font-bold opacity-80 uppercase tracking-tighter">SURCOS LISTOS</span></div>
                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-brand-green-700 rounded-sm"></div><span className="font-bold opacity-80 uppercase tracking-tighter">CRECIM. ACTIVO</span></div>
                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-brand-green-900/60 border border-brand-green-500/30 rounded-sm"></div><span className="font-bold opacity-80 uppercase tracking-tighter">TERRENO VIRGEN</span></div>
              </div>
            </div>
          </div>

          {/* Predicted Stats Cards */}
          <div className="h-40 flex gap-4 shrink-0 overflow-x-auto pb-2">
            <div className="flex-1 min-w-[200px] bg-brand-green-800 text-white p-5 rounded-2xl flex flex-col justify-between shadow-lg shadow-emerald-900/10">
              <p className="text-[11px] uppercase tracking-widest font-semibold opacity-70 italic">Producción Real Estimada</p>
              <div>
                <h3 className="text-4xl font-black tabular-nums tracking-tighter">{actualValues.yieldPerBlock.toLocaleString()}</h3>
                <p className="text-sm italic text-brand-green-300">Elotes Calidad Tepic</p>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
              <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-500 italic">Meta Diaria Quimias X</p>
              <div>
                <h3 className="text-4xl font-black tabular-nums tracking-tighter text-brand-green-900">{INITIAL_PARAMS.elotesDiariosMeta.toLocaleString()}</h3>
                <p className="text-sm italic text-slate-400 uppercase tracking-tighter font-bold">Continuidad: 50.7 Días</p>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] bg-accent-yellow-100 border border-yellow-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
              <p className="text-[11px] uppercase tracking-widest font-semibold text-yellow-800 italic">Estado Bloque Actual</p>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter text-yellow-700 uppercase italic">Activo</h3>
                  <p className="text-sm italic text-yellow-600 font-bold uppercase text-[10px]">Cosecha: 24 Surcos</p>
                </div>
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner text-xl">
                  🌽
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real Data Input & Timeline */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-1">
          
          {/* Inputs & Profitability Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-6 flex items-center justify-between">
              Calibración Beta: Elotón Pro <span>Tepic Mayo</span>
            </p>
            
            <div className="space-y-5">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Cosecha Real (Elotes)</label>
                  <input 
                    type="number" 
                    value={actualValues.yieldPerBlock}
                    onChange={(e) => setActualValues({...actualValues, yieldPerBlock: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-lg font-bold text-brand-green-900 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                  />
                  <div className={`text-[10px] font-bold mt-1 uppercase ${yieldDiscrepancy < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    Desvío: {yieldDiscrepancy.toFixed(1)}% {yieldDiscrepancy < 0 ? <TrendingDown size={10} className="inline ml-1" /> : <TrendingUp size={10} className="inline ml-1" />}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Inversión ($)</label>
                  <input 
                    type="number" 
                    value={actualValues.totalCosts}
                    onChange={(e) => setActualValues({...actualValues, totalCosts: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-md font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Precio Venta ($)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={actualValues.actualPrice}
                    onChange={(e) => setActualValues({...actualValues, actualPrice: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-md font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                  />
                </div>
              </div>

              {/* Profit Summary */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-brand-green-900 uppercase italic">Utilidad Neta</span>
                  <span className={`text-3xl font-black italic tracking-tighter ${actualProfit < 0 ? 'text-red-600' : 'text-brand-green-700'}`}>
                    ${actualProfit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                   <div className="bg-brand-green-700 h-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, profitMargin))}%` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <span>MARGEN REAL: {profitMargin.toFixed(1)}%</span>
                  <span>ROI LOGRADO: {actualROI.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Google Integration Status - NEW */}
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm ring-1 ring-blue-50">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Google Maps Platform: Status
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Maps JavaScript API', status: 'v3.55 READY', desc: 'Renderizado Topográfico' },
                { name: 'Geometry Library', status: 'ACTIVE', desc: 'Medición de Metros Reales' },
                { name: 'Elevation API', status: 'INTEGRATED', desc: 'Pendiente y Drenaje' },
                { name: 'Solar API', status: 'STANDBY', desc: 'Radiación Fotosintética' }
              ].map((api) => (
                <div key={api.name} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-800">{api.name}</p>
                    <p className="text-[8px] text-slate-400 uppercase tracking-tighter">{api.desc}</p>
                  </div>
                  <span className="text-[8px] font-black px-2 py-1 bg-slate-100 text-slate-400 rounded uppercase">
                    {api.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 bg-blue-50/50 p-3 rounded-xl">
               <p className="text-[9px] text-blue-800 font-medium leading-tight">
                 💡 Necesitamos tu <span className="font-bold">API KEY</span> para activar el escaneo real del terreno y dejar de usar simulaciones.
               </p>
            </div>
          </div>

          {/* Staggered Timeline Card */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Calendario Elotón v8</p>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase tracking-tighter flex items-center gap-1">
                <AlertTriangle size={10} /> Alerta Lluvia Tepic
              </span>
            </div>
            
            <div className="flex-1 space-y-6">
              {/* Block 1 */}
              <div className="relative pl-4 border-l-2 border-yellow-400 pb-2">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">BLOQUE 1 • EN COSECHA</p>
                <h4 className="text-sm font-bold">Corte: 28 Jul — 03 Ago</h4>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] bg-brand-green-100 text-brand-green-800 px-1.5 py-0.5 rounded font-bold uppercase">24 Surcos</span>
                   <span className="text-[10px] text-slate-500 italic">~13,200 elotes est.</span>
                </div>
              </div>
              
              {/* Block 2 */}
              <div className="relative pl-4 border-l-2 border-brand-green-900 pb-2">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-green-900"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">BLOQUE 2 • MADURACIÓN</p>
                <h4 className="text-sm font-bold text-brand-green-900">Corte: 04 Ago — 10 Ago</h4>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-brand-green-700 h-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Block 3 */}
              <div className="relative pl-4 border-l-2 border-brand-green-500 pb-2">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-green-500"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">BLOQUE 3 • CRECIMIENTO</p>
                <h4 className="text-sm font-bold text-slate-800">Corte: 11 Ago — 17 Ago</h4>
                <p className="text-[10px] text-brand-green-700 font-black mt-2 uppercase flex items-center gap-1">
                  <Layers size={10} /> Próximo Fertirriego: Día 50
                </p>
              </div>
            </div>

            <button className="w-full py-3 bg-brand-green-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-900/20 mt-6 hover:bg-brand-green-700 transition-all">
              Planificar Siguiente Bloque
            </button>
          </div>

          {/* Market Intelligence / Crop Insights */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-4 flex items-center gap-2">
              <TrendingUp size={14} /> Inteligencia de Mercado: {params.cultivo}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                <div>
                  <p className="text-[10px] font-bold text-indigo-200 uppercase">Precio Referencia</p>
                  <p className="text-xl font-black italic">$9.40 <span className="text-[10px] font-medium text-emerald-400 not-italic">↑ 2.1%</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-indigo-200 uppercase">Demanda</p>
                  <p className="text-xs font-black uppercase text-emerald-400">Alta</p>
                </div>
              </div>
              <p className="text-[10px] text-indigo-100/70 italic leading-relaxed">
                "El mercado de {params.cultivo} en la zona Occidente muestra una tendencia alcista por escasez en el Bajío. Se recomienda adelantar cosecha 3 días para capturar precio premium."
              </p>
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase transition-all shadow-lg active:scale-95">
                Ver Reporte de Futuros
              </button>
            </div>
          </div>

          {/* Groq AI Assistant */}
          <GroqChatComponent />

          {/* NDVI Health Analysis Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <CloudRain size={100} />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] uppercase tracking-widest font-black text-slate-400">Análisis NDVI & Biomasa</h3>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase">Óptimo (0.82)</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Vigor Vegetativo</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600">82%</span>
                  <span className="text-[10px] text-emerald-500 font-bold">↑ 4%</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Biomasa Est.</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">4.2</span>
                  <span className="text-[10px] text-slate-500 font-bold">Ton/Ha</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-medium">Uniformidad del Lote</span>
                <span className="font-bold text-slate-800">91%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '91%' }}></div>
              </div>
              <p className="text-[9px] text-slate-400 italic leading-relaxed mt-2">
                *Datos procesados vía <span className="font-bold">Sentinel-2</span>. La alta concentración de clorofila sugiere una excelente asimilación de nitrógeno en el Bloque 2.
              </p>
            </div>
          </div>

          {/* Calibration Report / Discrepancies */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-xl border border-stone-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-green-300 mb-4 flex items-center gap-2">
              <AlertTriangle size={14} /> Reporte de Calibración
            </h3>
            
            <div className="space-y-4 text-[11px] leading-relaxed">
              <div className="border-l-2 border-orange-500 pl-3">
                <p className="font-bold text-orange-400 uppercase tracking-tighter mb-1">Discrepancia de Rendimiento</p>
                <p className="opacity-80 italic">
                  Se detectó una merma del {Math.abs(yieldDiscrepancy).toFixed(1)}% vs predicción. Causa: Nubosidad persistente en Tepic redujo la fotosíntesis y el lixiviado de nitrógeno por lluvias intensas.
                </p>
              </div>

              <div className="border-l-2 border-red-500 pl-3">
                <p className="font-bold text-red-400 uppercase tracking-tighter mb-1">Impacto en Costos</p>
                <p className="opacity-80 italic">
                  Incremento del {costDiscrepancy.toFixed(1)}% en costos operativos. Causa: Mano de obra adicional para apertura de drenes de emergencia y aplicación de fungicida preventivo.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4">
                <p className="text-[10px] font-black text-brand-green-200 uppercase mb-2">Ajustes Sugeridos al Motor</p>
                <ul className="space-y-2 list-disc pl-4 opacity-90">
                  <li>Reducir <span className="font-bold">elotes_por_mata</span> a 1.05 durante temporada de lluvias.</li>
                  <li>Incrementar reserva de <span className="font-bold">jornales_por_bloque</span> en un 15% para mantenimiento de drenaje.</li>
                  <li>Implementar factor de corrección de fertilizante (+10% Urea) tras precipitaciones mayores a 50mm.</li>
                </ul>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
              Sincronizar Parámetros
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Utility Bar */}
      <div className="h-12 bg-white border-t border-slate-200 flex items-center justify-center px-8 shrink-0">
        <div className="flex gap-6 md:gap-12 overflow-x-auto no-scrollbar py-2">
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase hover:text-brand-green-700 tracking-tighter transition-colors shrink-0">Beta Test</a>
          <a href="#" className="text-[10px] font-black text-brand-green-700 uppercase border-b-2 border-brand-green-700 pb-1 tracking-tighter shrink-0">Estrategia GTM</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase hover:text-brand-green-700 tracking-tighter transition-colors shrink-0">Logística Elote</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase hover:text-brand-green-700 tracking-tighter transition-colors shrink-0">Alertas Satélite</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase hover:text-brand-green-700 tracking-tighter transition-colors shrink-0">Cerrar Sesión</a>
        </div>
      </div>
    </div>
  );
}
