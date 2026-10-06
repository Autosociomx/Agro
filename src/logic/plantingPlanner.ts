export interface PlannerParams {
  hectareas: number;
  distanciaSurcosCm: number;
  distanciaMatasCm: number;
  elotesPorMata: number;
  supervivencia: number; // 0-1, plantas que sobreviven/germinan
  cicloDias: number; // siembra -> primer corte
  ventanaCosechaDias: number; // días de corte por lote (normalmente 9)
  diasProduccion: number; // cuántos días quieres cosechar continuo (30 = un mes)
  fechaInicio: string; // YYYY-MM-DD, primera siembra
  precioElote: number;
  elotesPorSaco: number;
}

export interface Lote {
  numero: number;
  hectareas: number;
  siembra: Date;
  inicioCorte: Date;
  finCorte: Date;
  elotesTotales: number;
  elotesPorDia: number;
}

export interface PlannerReport {
  plantasPorHa: number;
  elotesPorHa: number;
  sacosPorHa: number;
  ventaPorHa: number;
  lotes: Lote[];
  elotesTotales: number;
  elotesPorDiaPromedio: number;
  sacosPorDia: number;
  ventaTotal: number;
}

const DAY_MS = 86_400_000;

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

export function calcularPlan(p: PlannerParams): PlannerReport {
  const hectareas = Math.max(0, p.hectareas);
  const surco = Math.max(1, p.distanciaSurcosCm);
  const mata = Math.max(1, p.distanciaMatasCm);
  const ventana = Math.max(1, Math.round(p.ventanaCosechaDias));
  const dias = Math.max(1, Math.round(p.diasProduccion));
  const saco = Math.max(1, p.elotesPorSaco);

  const plantasPorHa = Math.floor(10000 / ((surco / 100) * (mata / 100)));
  const elotesPorHa = Math.floor(plantasPorHa * p.supervivencia * p.elotesPorMata);
  const sacosPorHa = elotesPorHa / saco;
  const ventaPorHa = elotesPorHa * p.precioElote;

  // Un lote nuevo madura cada `ventana` días para tener corte continuo.
  const numLotes = hectareas > 0 ? Math.ceil(dias / ventana) : 0;
  const haPorLote = numLotes ? hectareas / numLotes : 0;
  const inicio = new Date(`${p.fechaInicio}T00:00:00Z`);

  const lotes: Lote[] = [];
  for (let i = 0; i < numLotes; i++) {
    const siembra = addDays(inicio, i * ventana);
    const inicioCorte = addDays(siembra, p.cicloDias);
    const elotesTotales = Math.round(haPorLote * elotesPorHa);
    lotes.push({
      numero: i + 1,
      hectareas: Number(haPorLote.toFixed(2)),
      siembra,
      inicioCorte,
      finCorte: addDays(inicioCorte, ventana - 1),
      elotesTotales,
      elotesPorDia: Math.round(elotesTotales / ventana)
    });
  }

  const elotesTotales = lotes.reduce((s, l) => s + l.elotesTotales, 0);
  const elotesPorDiaPromedio = Math.round(elotesTotales / (numLotes * ventana || 1));
  return {
    plantasPorHa,
    elotesPorHa,
    sacosPorHa: Number(sacosPorHa.toFixed(1)),
    ventaPorHa,
    lotes,
    elotesTotales,
    elotesPorDiaPromedio,
    sacosPorDia: Number((elotesPorDiaPromedio / saco).toFixed(1)),
    ventaTotal: elotesTotales * p.precioElote
  };
}
