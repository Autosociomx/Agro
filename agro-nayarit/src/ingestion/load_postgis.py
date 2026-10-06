"""
Carga los shapefiles del INEGI a PostGIS.
Datos de suelos: https://www.inegi.org.mx/temas/edafologia/
Antes, crea las tablas con: psql -f db/schema.sql
"""
import sys

import geopandas as gpd
from sqlalchemy import create_engine

from src.utils.constants import DB_URL

COLUMNAS_SUELO = {
    "TIPO": "tipo_suelo",
    "TEXTURA": "textura",
    "PROFUNDIDAD": "profundidad_cm",
    "DRENAJE": "drenaje",
    "SALINIDAD": "salinidad",
}


def cargar_suelos(shapefile_path: str):
    """Carga la carta edafológica a la tabla `suelos` (conserva el esquema)."""
    gdf = gpd.read_file(shapefile_path).to_crs(4326)
    gdf = gdf.rename(columns=COLUMNAS_SUELO).rename_geometry("geom")
    columnas = [c for c in [*COLUMNAS_SUELO.values(), "geom"] if c in gdf.columns]
    gdf = gdf[columnas]
    gdf.to_postgis("suelos", create_engine(DB_URL), if_exists="append", index=False)
    print(f"✅ {len(gdf)} polígonos de suelo cargados")


if __name__ == "__main__":
    ruta = sys.argv[1] if len(sys.argv) > 1 else "data/raw/inegi_edafologia/F13-8.shp"
    cargar_suelos(ruta)
