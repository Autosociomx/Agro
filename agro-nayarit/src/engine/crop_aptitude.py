"""Motor de aptitud (versión simplificada): suelo vs requerimientos del cultivo."""
from sqlalchemy import text

from src.utils.db import get_engine


def puntuar(cultivo: dict, textura: str, drenaje: str) -> int:
    """Puntaje 0-100: textura 40 + drenaje 30 + exportación 30."""
    score = 0
    if cultivo["textura_optima"] == textura:
        score += 40
    if cultivo["drenaje_optimo"] == drenaje:
        score += 30
    if cultivo["potencial_exportacion"]:
        score += 30
    return score


def ordenar_aptitud(cultivos: list[dict], textura: str, drenaje: str) -> list[dict]:
    resultados = [
        {
            "cultivo": c["cultivo"],
            "aptitud": puntuar(c, textura, drenaje),
            "mercado": c["mercado_principal"],
            "exporta": bool(c["potencial_exportacion"]),
        }
        for c in cultivos
    ]
    return sorted(resultados, key=lambda x: x["aptitud"], reverse=True)


def calcular_aptitud(tipo_suelo: str, textura: str, drenaje: str) -> list[dict]:
    query = text("""
        SELECT cultivo, textura_optima, drenaje_optimo,
               potencial_exportacion, mercado_principal
        FROM cultivos_requerimientos
    """)
    with get_engine().connect() as conn:
        cultivos = [dict(r._mapping) for r in conn.execute(query).fetchall()]
    return ordenar_aptitud(cultivos, textura, drenaje)
