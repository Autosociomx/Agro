export interface AgroParams {
  cicloDias: number;
  elotesDiariosMeta: number;
  elotesPorMata: number;
  distanciaSurcosCm: number;
  distanciaMatasCm: number;
  largoSurcoM: number;
  precioElote: number;
  costoKgSemilla: number;
  costoKgUrea: number;
  costoKgSulfatoMg: number;
  costoMCintilla: number;
  costoJornalDia: number;
  jornalesPorBloque: number;
  costosFijosBloque: number;
  superficie?: number;
  cultivo?: string;
}

export interface AgroReport {
  matasPorSurco: number;
  surcosPorBloque: number;
  elotesPorBloque: number;
  ventaBrutaBloque: number;
  hectareasBloque: number;
  costoSemilla: number;
  costoFertilizante: number;
  costoCintilla: number;
  costoManoObra: number;
  costoTotalBloque: number;
  utilidadNeta: number;
  margen: number;
  roi: number;
}

export function calculateQuimiasX(params: AgroParams): AgroReport {
  const {
    elotesDiariosMeta,
    elotesPorMata,
    distanciaSurcosCm,
    distanciaMatasCm,
    largoSurcoM,
    precioElote,
    costoKgSemilla,
    costoKgUrea,
    costoKgSulfatoMg,
    costoMCintilla,
    costoJornalDia,
    jornalesPorBloque,
    costosFijosBloque
  } = params;

  const matasPorSurco = Math.floor((largoSurcoM * 100) / distanciaMatasCm);
  const matasASembrarDiario = Math.ceil(elotesDiariosMeta / elotesPorMata);
  const surcosDiarios = matasASembrarDiario / matasPorSurco;
  const surcosPorBloque = Math.ceil(surcosDiarios * 7);

  const elotesPorBloque = surcosPorBloque * matasPorSurco * elotesPorMata;
  const ventaBrutaBloque = elotesPorBloque * precioElote;

  const hectareasBloque = (surcosPorBloque * distanciaSurcosCm / 100 * largoSurcoM) / 10000;

  const kgSemillaBloque = hectareasBloque * 25;
  const costoSemilla = kg_semilla_bloque_logic(hectareasBloque) * costoKgSemilla;

  // Fertilizer logic based on the "5+1 + 4 + 3" protocol (~13kg Urea + 1kg Mg)
  const kgUreaBloque = 13;
  const kgMgBloque = 1;
  const costoFertilizante = (kgUreaBloque * costoKgUrea) + (kgMgBloque * costoKgSulfatoMg);

  const costoCintilla = (surcosPorBloque * largoSurcoM / 2) * costoMCintilla;
  const costoManoObra = jornalesPorBloque * costoJornalDia;

  const costoVariableTotal = costoSemilla + costoFertilizante + costoCintilla + costoManoObra;
  const costoTotalBloque = costoVariableTotal + costosFijosBloque;

  const utilidadNeta = ventaBrutaBloque - costoTotalBloque;
  const margen = (utilidadNeta / ventaBrutaBloque) * 100;
  const roi = (utilidadNeta / costoTotalBloque) * 100;

  return {
    matasPorSurco,
    surcosPorBloque,
    elotesPorBloque,
    ventaBrutaBloque,
    hectareasBloque,
    costoSemilla,
    costoFertilizante,
    costoCintilla,
    costoManoObra,
    costoTotalBloque,
    utilidadNeta: Math.round(utilidadNeta),
    margen: Number(margen.toFixed(2)),
    roi: Number(roi.toFixed(2))
  };
}

function kg_semilla_bloque_logic(hectareas: number): number {
    return hectareas * 25;
}
