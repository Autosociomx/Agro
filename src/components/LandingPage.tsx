import React from 'react';
import { 
  Sprout, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Zap, 
  ShieldCheck, 
  CloudRain,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: (selectedCrop?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [selectedCrop, setSelectedCrop] = React.useState('Maíz Elotero');
  
  const crops = [
    { id: 'maiz', name: 'Maíz Elotero', icon: '🌽', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'aguacate', name: 'Aguacate', icon: '🥑', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'agave', name: 'Agave Azul', icon: '🌵', color: 'bg-blue-100 text-blue-700' },
    { id: 'tomate', name: 'Tomate', icon: '🍅', color: 'bg-red-100 text-red-700' },
    { id: 'berries', name: 'Berries', icon: '🫐', color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-green-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-8 md:px-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green-900 rounded-xl flex items-center justify-center shadow-lg shadow-brand-green-900/20">
            <Sprout size={24} className="text-brand-green-200" />
          </div>
          <span className="text-xl font-black text-brand-green-900 tracking-tighter italic">AGROVISION 3D</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
          <a href="#solucion" className="hover:text-brand-green-700 transition-colors">Solución</a>
          <a href="#beneficios" className="hover:text-brand-green-700 transition-colors">Beneficios</a>
          <a href="#precios" className="hover:text-brand-green-700 transition-colors">Precios</a>
        </div>
        <button 
          onClick={() => onEnterApp(selectedCrop)}
          className="bg-brand-green-900 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-green-700 transition-all shadow-xl shadow-brand-green-900/20 active:scale-95"
        >
          Ver Demo Beta
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-brand-green-100 text-brand-green-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              🚀 Nueva Era en Agrotecnología
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-brand-green-900 leading-[0.9] mb-8 italic tracking-tighter">
              DOMINA TU TIERRA. <br />
              <span className="text-brand-green-600">ASEGURA TU RIQUEZA.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-md">
              La primera plataforma de agricultura de precisión diseñada para el agricultor real. Modelado 3D, predicción de cosecha y control financiero en la palma de tu mano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => onEnterApp(selectedCrop)}
                className="bg-brand-green-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-green-700 transition-all shadow-2xl shadow-brand-green-900/30 group"
              >
                Acceder al Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <p className="text-[10px] font-black text-brand-green-700 uppercase tracking-widest mb-4">Selecciona tu Motor de Cultivo:</p>
              <div className="flex flex-wrap gap-3">
                {crops.map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop.name)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95 ${
                      selectedCrop === crop.name 
                      ? 'border-brand-green-600 bg-brand-green-50' 
                      : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-xl">{crop.icon}</span>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedCrop === crop.name ? 'text-brand-green-900' : 'text-slate-400'}`}>
                      {crop.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Visual Asset / Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-4 rounded-[40px] shadow-2xl border border-slate-200 rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="bg-slate-100 rounded-[30px] aspect-video flex items-center justify-center overflow-hidden relative">
                  {/* Mock of the 3D grid */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-green-100 to-slate-200 flex items-center justify-center">
                    <div className="w-64 h-32 bg-brand-green-700/20 rounded-xl isometric-field rotate-12 scale-150 opacity-40"></div>
                  </div>
                  <div className="relative z-10 text-center">
                     <p className="text-4xl font-black text-brand-green-900 italic tracking-tighter mb-1">76,176</p>
                     <p className="text-[10px] font-bold text-brand-green-700 uppercase tracking-widest">Elotes Proyectados</p>
                  </div>
               </div>
            </div>
            {/* Floating Badges */}
            <div className="absolute -top-10 -right-10 bg-yellow-400 p-6 rounded-3xl shadow-xl -rotate-6 z-20">
               <span className="text-3xl">🌽</span>
               <p className="text-xs font-black text-yellow-900 mt-2 uppercase tracking-tighter">ROI 85%</p>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-brand-green-900 p-6 rounded-3xl shadow-xl rotate-6 z-20 text-white">
               <CloudRain className="text-brand-green-300 mb-2" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Factor Lluvia Tepic Enabled</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="solucion" className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-brand-green-700 uppercase tracking-[0.3em] mb-4">La Solución Quimias X</h2>
            <p className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter">Agricultura que piensa por ti.</p>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-brand-green-200 transition-all hover:bg-brand-green-50/30">
              <div className="w-16 h-16 bg-brand-green-100 rounded-2xl flex items-center justify-center mb-8">
                <Target size={32} className="text-brand-green-700" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase italic">Topografía 3D</h3>
              <p className="text-slate-500 leading-relaxed text-sm">Visualiza tu parcela con relieve real usando Photorealistic 3D Tiles. Detecta pendientes y planea el drenaje para evitar inundaciones.</p>
            </div>
            <div className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-brand-green-200 transition-all hover:bg-brand-green-50/30">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                <Zap size={32} className="text-blue-700" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase italic">Energía Solar</h3>
              <p className="text-slate-500 leading-relaxed text-sm">Usamos la Solar API de Google para medir la radiación exacta sobre tu elote. Predice el crecimiento fotosintético con precisión científica.</p>
            </div>
            <div className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-brand-green-200 transition-all hover:bg-brand-green-50/30">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8">
                <ShieldCheck size={32} className="text-emerald-700" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase italic">Consultoría IA</h3>
              <p className="text-slate-500 leading-relaxed text-sm">Tu asistente experto agrónomo (Groq SDK) disponible 24/7. Pregúntale sobre plagas, fertilización o logística de corte en segundos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study / Testimonial */}
      <section className="py-24 px-8 md:px-16 max-w-5xl mx-auto">
        <div className="bg-brand-green-900 rounded-[64px] p-12 md:p-20 text-white relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green-700 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
            <Users size={48} className="text-brand-green-300 mb-8" />
            <p className="text-2xl md:text-4xl font-light italic leading-snug mb-10">
              \"Gracias a AgroVision, logramos estabilizar la venta de 1,500 elotes diarios en nuestro negocio familiar. El código Quimias X nos salvó de las lluvias de Tepic.\"
            </p>
            <div>
              <p className="font-black uppercase tracking-widest text-brand-green-200">Socio Fundador</p>
              <p className="text-xs uppercase tracking-tighter opacity-70">El Elotón de Nayarit</p>
            </div>
        </div>
      </section>

      {/* Final CTA / Pricing Preview */}
      <section id="precios" className="py-24 px-8 md:px-16 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-brand-green-900 italic tracking-tighter mb-8 lowercase">no pierdas tu lugar gÜey.</h2>
        <p className="text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
          Estamos abriendo el acceso beta por regiones. Los pioneros de Tepic y Nayarit tendrán un 50% de descuento vitalicio. Únete a la lista de espera hoy mismo.
        </p>
        <div className="bg-white p-2 rounded-[32px] shadow-2xl border border-slate-200 inline-flex flex-col md:flex-row items-center gap-2 max-w-xl w-full">
          <input 
            type="email" 
            placeholder="Tu correo electrónico" 
            className="flex-1 px-8 py-4 bg-transparent outline-none font-bold text-slate-800 placeholder:text-slate-300 w-full"
          />
          <button className="bg-brand-green-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-brand-green-700 transition-all w-full md:w-auto active:scale-95">
            Reservar Mi Acceso
          </button>
        </div>
        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-brand-green-600" /> Sin tarjetas</span>
           <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-brand-green-600" /> Acceso prioritario</span>
           <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-brand-green-600" /> Soporte 3D</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 px-8 text-center bg-white">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <div className="w-5 h-5 bg-brand-green-900 rounded-md"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-green-900">AgroVision 3D © 2026</p>
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Puro Elote. Puro Billete. Cero Paja.</p>
      </footer>
    </div>
  );
};
