CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS suelos (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(20),
    tipo_suelo VARCHAR(50),
    textura VARCHAR(30),
    profundidad_cm INTEGER,
    drenaje VARCHAR(20),
    salinidad VARCHAR(20),
    fase_fisica VARCHAR(50),
    fase_quimica VARCHAR(50),
    geom GEOMETRY(POLYGON, 4326)
);
CREATE INDEX IF NOT EXISTS idx_suelos_geom ON suelos USING GIST(geom);

CREATE TABLE IF NOT EXISTS municipios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    clave_inegi VARCHAR(10),
    geom GEOMETRY(MULTIPOLYGON, 4326)
);
CREATE INDEX IF NOT EXISTS idx_municipios_geom ON municipios USING GIST(geom);

CREATE TABLE IF NOT EXISTS produccion (
    id SERIAL PRIMARY KEY,
    municipio_id INTEGER REFERENCES municipios(id),
    cultivo VARCHAR(100),
    anio INTEGER,
    superficie_sembrada_ha NUMERIC,
    superficie_cosechada_ha NUMERIC,
    volumen_ton NUMERIC,
    rendimiento_ton_ha NUMERIC,
    precio_medio_ton NUMERIC,
    valor_produccion_mxn NUMERIC
);

CREATE TABLE IF NOT EXISTS cultivos_requerimientos (
    id SERIAL PRIMARY KEY,
    cultivo VARCHAR(100),
    profundidad_min_cm INTEGER,
    textura_optima VARCHAR(50),
    drenaje_optimo VARCHAR(20),
    ph_min NUMERIC,
    ph_max NUMERIC,
    tolera_salinidad BOOLEAN,
    potencial_exportacion BOOLEAN,
    mercado_principal VARCHAR(100)
);
