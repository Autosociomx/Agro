"""Dado un punto (lat, lon), devuelve el tipo de suelo."""
from sqlalchemy import text

from src.utils.db import get_engine

QUERY_SUELO_POR_PUNTO = text("""
    SELECT tipo_suelo, textura, profundidad_cm, drenaje, salinidad
    FROM suelos
    WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))
    LIMIT 1;
""")


def obtener_suelo(lat: float, lon: float) -> dict:
    with get_engine().connect() as conn:
        row = conn.execute(QUERY_SUELO_POR_PUNTO, {"lat": lat, "lon": lon}).fetchone()
    if not row:
        return {"error": "No se encontró información de suelo en ese punto"}
    return dict(row._mapping)
