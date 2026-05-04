import React, { useState } from 'react';
import { getGroqCompletion } from '../services/groqService';
import { Brain, Send, Loader2, Sparkles } from 'lucide-react';

export const GroqChatComponent: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);

    // Priorizar llave de localStorage para sesión rápida
    const userApiKey = localStorage.getItem('user_groq_key');

    try {
      const result = await getGroqCompletion(prompt, undefined, userApiKey || undefined);
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con Groq');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Brain size={80} />
      </div>
      
      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-4 flex items-center gap-2">
        <Sparkles size={14} className="text-indigo-400" /> Consultor IA (Groq)
      </h3>

      <div className="space-y-4 relative z-10">
        {!response ? (
          <p className="text-[11px] text-indigo-100/70 italic">
            Pregúntale a la IA sobre estrategias de siembra, fertilización o logística de elote para Santa Cruz.
          </p>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 max-h-48 overflow-y-auto custom-scrollbar">
            <p className="text-[11px] leading-relaxed text-indigo-50 whitespace-pre-wrap font-medium">
              {response}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 p-2 rounded-lg text-red-200 text-[10px] font-bold">
            ⚠️ {error}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
            placeholder="Ej: ¿Cómo afecta el exceso de lluvia al nitrógeno?"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-indigo-300/50"
            disabled={loading}
          />
          <button
            onClick={handleAnalysis}
            disabled={loading || !prompt.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 p-3 rounded-xl transition-all shadow-lg shadow-indigo-900/40"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>

        {response && (
          <button 
            onClick={() => { setResponse(null); setPrompt(''); }}
            className="text-[9px] uppercase font-black text-indigo-300/60 hover:text-indigo-300 transition-colors"
          >
            Nueva Consulta
          </button>
        )}
      </div>
    </div>
  );
};
