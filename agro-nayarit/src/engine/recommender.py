"""Combina suelo + producción histórica del SIAP + aptitud."""
from sqlalchemy import text

from src.engine.crop_aptitude import calcular_aptitud
from src.engine.soil_lookup import obtener_suelo
from src.utils.db import get_engine

Q_MUNICIPIO = text("""
    SELECT nombre FROM municipios
    WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))
    LIMIT 1;
""")

Q_HISTORIAL = text("""
    SELECT cultivo, AVG(rendimiento_ton_ha) AS rendimiento_prom,
           AVG(precio_medio_ton) AS precio_prom
    FROM produccion p
    JOIN municipios m ON p.municipio_id = m.id
    WHERE m.nombre = :muni
    GROUP BY cultivo
    ORDER BY precio_prom DESC
    LIMIT 10;
""")


def recomendar(lat: float, lon: float) -> dict:
    suelo = obtener_suelo(lat, lon)
    if "error" in suelo:
        return suelo

    with get_engine().connect() as conn:
        muni = conn.execute(Q_MUNICIPIO, {"lat": lat, "lon": lon}).fetchone()
        municipio = muni.nombre if muni else "Desconocido"
        historial = conn.execute(Q_HISTORIAL, {"muni": municipio}).fetchall()

    cultivos = calcular_aptitud(suelo["tipo_suelo"], suelo["textura"], suelo["drenaje"])
    return {
        "ubicacion": {"lat": lat, "lon": lon, "municipio": municipio},
        "suelo": suelo,
        "recomendaciones": cultivos[:5],
        "historial_municipio": [dict(h._mapping) for h in historial],
    }
