"""API REST consumida por el frontend (app móvil o web)."""
from fastapi import FastAPI, HTTPException

from src.engine.recommender import recomendar

app = FastAPI(title="AgroNayarit API", version="0.1.0")


@app.get("/recomendar")
def get_recomendacion(lat: float, lon: float):
    """Ejemplo: /recomendar?lat=21.5044&lon=-104.8945"""
    resultado = recomendar(lat, lon)
    if "error" in resultado:
        raise HTTPException(status_code=404, detail=resultado["error"])
    return resultado


@app.get("/health")
def health():
    return {"status": "ok", "fuente_datos": ["INEGI", "SIAP", "CONABIO"]}
