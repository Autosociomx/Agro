# 🌽 AgroNayarit — Motor de recomendación de cultivos

Cruza suelos (INEGI), producción (SIAP) y aptitud de cultivos para recomendar qué sembrar en una parcela de Nayarit.
Stack: Python · PostgreSQL + PostGIS · FastAPI. (El frontend React del repositorio raíz es el cliente.)

## Arrancar
```bash
cd agro-nayarit
pip install -r requirements.txt
cp .env.example .env            # edita DB_URL
psql -d agro_nayarit -f db/schema.sql   # o ejecuta db/schema.sql en tu cliente SQL
python -m src.ingestion.download_inegi   # guía de descarga
python -m src.ingestion.download_siap
python -m src.ingestion.load_postgis data/raw/inegi_edafologia/F13-8.shp
uvicorn src.api.main:app --reload
curl "http://localhost:8000/recomendar?lat=21.5044&lon=-104.8945"
pytest
```

## Motor de ventana comercial
`db/schema.sql` incluye la tabla maestra `crop_market_calendar_mexico` (cultivo, origen, mes, destino, precio, flete, margen, ventana, capacidad, evidencia).
`src/engine/market_window.py` calcula margen por kg/viaje (merma, comisión, flete), clasifica cada mes (verde/amarillo/rojo), detecta ventanas y avisa si el volumen planeado satura el mercado.
Falta: cargar los datos de estacionalidad SIAP y precios SNIIM en esa tabla.

## Estado
- ☑ v0.1 Esquema de BD + carga de suelos INEGI
- ☐ v0.2 Ingesta SIAP (tablas `municipios`, `produccion`, `cultivos_requerimientos` aún sin datos)
- ☐ v0.3 API probada con datos reales
- ☐ v0.4 Frontend con mapa
- ☐ v0.5 Validación con red de eloteros de Tepic

## Fuentes (abiertas)
INEGI edafología / uso de suelo / límites (Shapefile), SIAP cierre agrícola (CSV), FAO / MicroLEIS (requerimientos).
Licencia: MIT.
