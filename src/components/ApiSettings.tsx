import React, { useState, useEffect } from 'react';
import { Key, Save, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ApiSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSettings: React.FC<ApiSettingsProps> = ({ isOpen, onClose }) => {
  const [mapsKey, setMapsKey] = useState(localStorage.getItem('user_google_maps_key') || '');
  const [groqKey, setGroqKey] = useState(localStorage.getItem('user_groq_key') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('user_google_maps_key', mapsKey);
    localStorage.setItem('user_groq_key', groqKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload(); // Recargar para aplicar cambios dinámicos
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900 to-indigo-950">
          <div>
            <h2 className="text-white font-black text-lg flex items-center gap-2">
              <Key size={20} className="text-indigo-400" /> Configuración de APIs
            </h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">AgroVision Santa Cruz v2.0</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Google Maps Platform Key</label>
            <input 
              type="password"
              value={mapsKey}
              onChange={(e) => setMapsKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-white/10"
            />
            <p className="text-[9px] text-white/30 italic">Necesaria para el renderizado satelital 3D y topografía.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Groq Cloud API Key</label>
            <input 
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-white/10"
            />
            <p className="text-[9px] text-white/30 italic">Necesaria para el asistente agronómico de IA.</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3">
            <AlertCircle size={18} className="text-amber-500 shrink-0" />
            <p className="text-[10px] text-amber-200/80 leading-relaxed">
              Estas llaves se guardarán en tu almacenamiento local. Nunca las compartas en entornos públicos sin protección.
            </p>
          </div>

          <button 
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
              saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 size={18} /> Guardado y Reiniciando
              </>
            ) : (
              <>
                <Save size={18} /> Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
