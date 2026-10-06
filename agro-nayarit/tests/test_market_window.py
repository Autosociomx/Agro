from src.engine.market_window import (CostosViaje, aviso_saturacion, capacidad_adicional_ton,
                                      clasificar_mes, encontrar_ventanas, margen_kg, margen_viaje)


def test_margen_piña_tijuana():
    c = CostosViaje(flete_kg=3, empaque_kg=1, maniobras_kg=0.5, comision_pct=5, merma_pct=8)
    m = margen_kg(8, 22, c)
    assert m == round(22 * 0.92 * 0.95 - 12.5, 2)
    assert margen_viaje(20, m, regreso_margen=5000) == round(20000 * m + 5000, 2)


def test_clasificar():
    assert clasificar_mes(100, 40, 5) == "verde"
    assert clasificar_mes(100, 150, 5) == "amarillo"
    assert clasificar_mes(100, 40, -1) == "rojo"


def test_ventanas_con_vuelta_de_año():
    meses = [{"mes": m, "oferta_origen": 100, "oferta_destino": 10 if m in (12, 1, 4) else 500,
              "margen": 3} for m in range(1, 13)]
    v = encontrar_ventanas(meses)
    assert {"mes_inicio": 12, "mes_fin": 1, "duracion_meses": 2} in v
    assert {"mes_inicio": 4, "mes_fin": 4, "duracion_meses": 1} in v


def test_saturacion():
    cap = capacidad_adicional_ton(300, 250)
    assert cap == 50
    assert "Cuidado" in aviso_saturacion(500, cap)
    assert "No sembrar" in aviso_saturacion(10, capacidad_adicional_ton(100, 200))
