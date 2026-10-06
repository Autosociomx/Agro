from src.engine.crop_aptitude import ordenar_aptitud

CULTIVOS = [
    {"cultivo": "Maíz elotero", "textura_optima": "franca", "drenaje_optimo": "bueno",
     "potencial_exportacion": False, "mercado_principal": "Nacional"},
    {"cultivo": "Aguacate Hass", "textura_optima": "franca", "drenaje_optimo": "bueno",
     "potencial_exportacion": True, "mercado_principal": "EE.UU."},
    {"cultivo": "Arroz", "textura_optima": "arcillosa", "drenaje_optimo": "pobre",
     "potencial_exportacion": False, "mercado_principal": "Nacional"},
]


def test_orden_y_puntaje():
    r = ordenar_aptitud(CULTIVOS, "franca", "bueno")
    assert [c["cultivo"] for c in r] == ["Aguacate Hass", "Maíz elotero", "Arroz"]
    assert r[0]["aptitud"] == 100 and r[1]["aptitud"] == 70 and r[2]["aptitud"] == 0
