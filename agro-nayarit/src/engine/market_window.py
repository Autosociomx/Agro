"""
Ventana comercial: cruza la temporada del origen con la del destino,
el precio y el flete para estimar el margen real y la capacidad del mercado.
"""
from dataclasses import dataclass


@dataclass
class CostosViaje:
    flete_kg: float            # combustible + casetas + operador, por kg
    empaque_kg: float = 0.0
    maniobras_kg: float = 0.0
    comision_pct: float = 0.0  # intermediación sobre precio destino
    merma_pct: float = 0.0     # % del producto que se pierde


def margen_kg(precio_origen: float, precio_destino: float, c: CostosViaje) -> float:
    """Margen por kg vendido, considerando merma y comisión."""
    ingreso = precio_destino * (1 - c.merma_pct / 100) * (1 - c.comision_pct / 100)
    costo = precio_origen + c.flete_kg + c.empaque_kg + c.maniobras_kg
    return round(ingreso - costo, 2)


def margen_viaje(toneladas: float, margen_por_kg: float, regreso_margen: float = 0.0) -> float:
    """Margen total del viaje (ida + carga de regreso, si existe)."""
    return round(toneladas * 1000 * margen_por_kg + regreso_margen, 2)


def clasificar_mes(oferta_origen: float, oferta_destino: float, margen: float,
                   margen_minimo: float = 0.0) -> str:
    """
    verde: margen positivo y el destino tiene menos oferta que el origen.
    amarillo: margen positivo pero hay oferta competida en destino.
    rojo: margen no cubre el mínimo.
    """
    if margen <= margen_minimo:
        return "rojo"
    return "verde" if oferta_destino < oferta_origen else "amarillo"


def encontrar_ventanas(meses: list[dict]) -> list[dict]:
    """
    meses: 12 dicts con mes, oferta_origen, oferta_destino, margen.
    Devuelve rangos consecutivos de meses 'verde' (con vuelta de diciembre a enero).
    """
    verdes = {m["mes"] for m in meses
              if clasificar_mes(m["oferta_origen"], m["oferta_destino"], m["margen"]) == "verde"}
    if not verdes:
        return []
    if len(verdes) == 12:
        return [{"mes_inicio": 1, "mes_fin": 12, "duracion_meses": 12}]
    # empezar en un mes verde cuyo anterior no es verde
    inicios = [m for m in sorted(verdes) if ((m - 2) % 12) + 1 not in verdes]
    ventanas = []
    for ini in inicios:
        fin, n = ini, 1
        while (fin % 12) + 1 in verdes:
            fin = (fin % 12) + 1
            n += 1
        ventanas.append({"mes_inicio": ini, "mes_fin": fin, "duracion_meses": n})
    return ventanas


def capacidad_adicional_ton(demanda_ton: float, oferta_actual_ton: float) -> float:
    """Toneladas extra que el mercado absorbe; evita recomendar sobreproducción."""
    return max(0.0, round(demanda_ton - oferta_actual_ton, 2))


def aviso_saturacion(toneladas_planeadas: float, capacidad_ton: float) -> str:
    if capacidad_ton <= 0:
        return "No sembrar: el mercado ya está saturado en esa ventana."
    if toneladas_planeadas > capacidad_ton:
        return (f"Cuidado: la ventana soporta ~{capacidad_ton:g} t adicionales; "
                f"planeas {toneladas_planeadas:g} t.")
    return "Dentro de la capacidad estimada del mercado."
