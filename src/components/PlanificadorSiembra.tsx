import { useMemo, useState } from 'react';
import { calcularPlan, PlannerParams } from '../logic/plantingPlanner';

const fmt = (n: number) => n.toLocaleString('es-MX');
const fecha = (d: Date) => d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', timeZone: 'UTC' });

const FIELDS: { key: keyof PlannerParams; label: string; step?: number }[] = [
  { key: 'hectareas', label: 'Hectáreas totales', step: 1 },
  { key: 'diasProduccion', label: 'Días de producción continua (30 = 1 mes)' },
  { key: 'ventanaCosechaDias', label: 'Días de corte por surco/lote' },
  { key: 'cicloDias', label: 'Días de siembra a primer corte' },
  { key: 'distanciaSurcosCm', label: 'Distancia entre surcos (cm)' },
  { key: 'distanciaMatasCm', label: 'Distancia entre matas (cm)' },
  { key: 'elotesPorMata', label: 'Elotes por mata', step: 0.01 },
  { key: 'supervivencia', label: 'Plantas logradas (0-1)', step: 0.01 },
  { key: 'precioElote', label: 'Precio por elote ($)', step: 0.5 },
  { key: 'elotesPorSaco', label: 'Elotes por saco/costal' }
];

export function PlanificadorSiembra({ onBack }: { onBack: () => void }) {
  const [p, setP] = useState<PlannerParams>({
    hectareas: 100,
    distanciaSurcosCm: 80,
    distanciaMatasCm: 22,
    elotesPorMata: 1.17,
    supervivencia: 0.9,
    cicloDias: 85,
    ventanaCosechaDias: 9,
    diasProduccion: 30,
    fechaInicio: new Date().toISOString().slice(0, 10),
    precioElote: 8,
    elotesPorSaco: 100
  });
  const r = useMemo(() => calcularPlan(p), [p]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <button onClick={onBack} className="mb-4 text-sm underline">← Volver</button>
      <h1 className="text-2xl font-bold mb-1">Planificador de siembra escalonada – Maíz elotero</h1>
      <p className="text-sm text-slate-600 mb-4">
        Cada lote se corta ~{p.ventanaCosechaDias} días. Se siembra un lote nuevo cada {p.ventanaCosechaDias} días para
        tener cosecha todos los días del periodo. Los resultados son estimaciones; ajusta con tus datos reales.
      </p>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <label className="text-xs font-semibold">Fecha de primera siembra
          <input type="date" className="block w-full border rounded p-2 mt-1" value={p.fechaInicio}
            onChange={e => e.target.value && setP({ ...p, fechaInicio: e.target.value })} />
        </label>
        {FIELDS.map(f => (
          <label key={f.key} className="text-xs font-semibold">{f.label}
            <input type="number" min={0} step={f.step ?? 1} className="block w-full border rounded p-2 mt-1"
              value={p[f.key] as number}
              onChange={e => setP({ ...p, [f.key]: Number(e.target.value) })} />
          </label>
        ))}
      </div>

      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <Card t="Elotes por hectárea" v={fmt(r.elotesPorHa)} s={`${fmt(r.plantasPorHa)} matas/ha · ${r.sacosPorHa} sacos`} />
        <Card t="Venta por hectárea" v={`$${fmt(Math.round(r.ventaPorHa))}`} s="bruta, antes de costos" />
        <Card t={`Total ${p.hectareas} ha`} v={fmt(r.elotesTotales)} s={`$${fmt(Math.round(r.ventaTotal))}`} />
        <Card t="Promedio diario" v={fmt(r.elotesPorDiaPromedio)} s={`≈ ${r.sacosPorDia} sacos/día`} />
      </div>

      <h2 className="font-bold mb-2">Calendario de siembra y corte</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white border">
          <thead className="bg-slate-100 text-left">
            <tr><th className="p-2">Lote</th><th>Ha</th><th>Siembra</th><th>Corte</th><th>Elotes</th><th>Elotes/día</th></tr>
          </thead>
          <tbody>
            {r.lotes.map(l => (
              <tr key={l.numero} className="border-t">
                <td className="p-2">{l.numero}</td><td>{l.hectareas}</td><td>{fecha(l.siembra)}</td>
                <td>{fecha(l.inicioCorte)} – {fecha(l.finCorte)}</td><td>{fmt(l.elotesTotales)}</td><td>{fmt(l.elotesPorDia)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ t, v, s }: { t: string; v: string; s: string }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-xs uppercase text-slate-500">{t}</p>
      <p className="text-2xl font-bold">{v}</p>
      <p className="text-xs text-slate-500">{s}</p>
    </div>
  );
}
