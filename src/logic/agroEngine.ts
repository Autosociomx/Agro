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

export const CROP_CONFIGS: Record<string, any> = {
  'Maíz Elotero': { price: 9.40, yield: 4.2, ndvi: 0.82, trend: '↑ 2.1%', status: 'Óptimo', insight: '"El mercado de Maíz Elotero en la zona Occidente muestra una tendencia alcista por escasez en el Bajío. Se recomienda adelantar cosecha 3 días."' },
  'Aguacate': { price: 45.00, yield: 12.5, ndvi: 0.88, trend: '↑ 5.4%', status: 'Excepcional', insight: '"La demanda internacional de exportación (Hass) se mantiene fuerte. Monitorear humedad de suelo (ET) usando datos WAPOR para evitar estrés radicular."' },
  'Agave Azul': { price: 28.00, yield: 150, ndvi: 0.75, trend: '↓ 1.2%', status: 'Estable', insight: '"Sobreoferta temporal de jima. Retrasar cosecha si el grado Brix no ha alcanzado su punto óptimo (24+)."' },
  'Tomate': { price: 18.50, yield: 65, ndvi: 0.84, trend: '↑ 8.2%', status: 'Óptimo', insight: '"Las heladas en el norte han reducido la oferta nacional. Excelente ventana de oportunidad para cosecha en Invernadero."' },
  'Berries': { price: 120.00, yield: 18, ndvi: 0.91, trend: '↑ 1.5%', status: 'Premium', insight: '"Calidad de exportación confirmada. Monitorear índice ET de FAO en zonas de alta pendiente para ajustar riego por goteo."' },
  'Limón': { price: 22.00, yield: 25, ndvi: 0.79, trend: '↑ 12.0%', status: 'Alta Demanda', insight: '"Escasez de limón persa en Veracruz. Tu zona tiene ventaja competitiva. Aumentar ritmo de corte."' },
  'Mango': { price: 14.50, yield: 15, ndvi: 0.81, trend: '↓ 0.5%', status: 'Normal', insight: '"Pico de producción en Nayarit. Priorizar selección por calibre para mercado nacional de alta gama."' },
  'Chile': { price: 32.00, yield: 40, ndvi: 0.83, trend: '↑ 4.3%', status: 'Óptimo', insight: '"El mercado de chiles frescos se mantiene sólido. Riesgo detectado por humedad relativa en topografía baja, aplicar preventivos."' },
  'Café': { price: 180.00, yield: 1.2, ndvi: 0.89, trend: '↑ 6.7%', status: 'Especialidad', insight: '"Precios de café especial (Q) subiendo. Los mapas satelitales indican sombra óptima en el 85% del lote."' },
  'Caña de Azúcar': { price: 1.10, yield: 85, ndvi: 0.77, trend: '→ 0.0%', status: 'Estable', insight: '"Zafra estable. Optimizar logística de acarreo basada en la topografía mapeada en 3D para ahorrar diésel."' },
  'Sorgo': { price: 6.20, yield: 5.5, ndvi: 0.78, trend: '↓ 2.0%', status: 'Precaución', insight: '"Demanda de forraje a la baja. Vigilar estrés térmico según GEE."' },
  'Soya': { price: 8.50, yield: 3.2, ndvi: 0.80, trend: '↑ 3.1%', status: 'Favorable', insight: '"Mercados internacionales demandando volumen. WAPOR reporta buena retención hídrica en suelo."' },
  'Almendra': { price: 85.00, yield: 2.5, ndvi: 0.86, trend: '↑ 1.8%', status: 'Estable', insight: '"Demanda californiana sólida. Monitoreo de ET esencial para fase de llenado de grano."' },
  'Nuez': { price: 95.00, yield: 2.0, ndvi: 0.85, trend: '↑ 2.5%', status: 'Premium', insight: '"Mercado asiático activo. Altas necesidades hídricas detectadas por USDA NAIP."' },
  'Cacao': { price: 210.00, yield: 0.8, ndvi: 0.90, trend: '↑ 15.0%', status: 'Histórico', insight: '"Déficit global dispara precios. Proteger lotes sombreados, índice de biomasa es crítico."' },
  'Uva de Mesa': { price: 35.00, yield: 22, ndvi: 0.87, trend: '↑ 4.0%', status: 'Óptimo', insight: '"Ventana de exportación abierta. Controlar riego vía evapotranspiración para concentración de azúcares."' },
  'Plátano': { price: 9.00, yield: 45, ndvi: 0.88, trend: '→ 0.0%', status: 'Normal', insight: '"Condiciones tropicales estables. La topografía 3D no muestra riesgos de encharcamiento."' },
  'Espárrago': { price: 42.00, yield: 6.0, ndvi: 0.82, trend: '↑ 5.2%', status: 'Alta Demanda', insight: '"Ventana temprana para exportación a EE.UU. Monitorear estrés térmico."' },
  'Cereza': { price: 150.00, yield: 8.5, ndvi: 0.89, trend: '↑ 7.5%', status: 'Premium', insight: '"Exportación asiática liderando. Horas frío completadas según datos climáticos satelitales."' },
  'Papaya': { price: 12.00, yield: 60, ndvi: 0.84, trend: '↓ 1.0%', status: 'Estable', insight: '"Maduración acelerada por ola de calor. Coordinar cortes según madurez detectada por NDVI."' },
};

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
