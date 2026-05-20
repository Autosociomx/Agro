# Minuta de Junta Consultiva: Integración de Datos Satelitales (Google Earth Engine) a AgroVision

**Fecha:** 13 de Mayo de 2026
**Participantes:**
- **Don Rigo** (Representante de Campesinos y Productores)
- **Ing. Silva** (Agrónomo Especialista en Nutrición y Fisiología Vegetal)
- **Dev/Agente AI** (Líder de Desarrollo e Integración API)

---

## [09:00] Apertura y Análisis de Capturas de Pantalla

**Dev/Agente AI:** "Buenos días equipo. Hoy tenemos sobre la mesa las capturas de Google Earth Engine: datos de Evapotranspiración (WAPOR 3.0), conjuntos de datos del USDA sobre capas de cultivos, y la vista topográfica 3D de Google Earth. Tenemos que decidir cómo meter esto en AgroVision para que sirva a los 20 cultivos más rentables."

**Don Rigo (Campesino):** "Con todo respeto, Inge, yo veo esos mapas de África y de colores amarillo y azul y no me dicen nada. Si estoy sembrando Aguacate en el cerro o Agave, a mí díganme: ¿cuánta agua chupa la planta hoy?, ¿se me va a lavar el fertilizante con la pendiente que se ve en la foto 3D del 'Cementerio de la labor'?"

**Ing. Silva (Agrónomo):** "Tiene toda la razón, Don Rigo. Mire, esos colores (WAPOR) miden la Evapotranspiración (ET). Básicamente, nos dice cuánta agua transpiró la planta y cuánta se evaporó del suelo. Si logramos que la aplicación cruce ese dato con el coeficiente (Kc) de cada uno de los 20 cultivos, podemos decirle exactamente cuántos litros le faltan a su parcela."

## [09:30] Definición de Funciones del Agente Tecnológico

**Dev/Agente AI:** "Entendido. Entonces, mi función como equipo de desarrollo no es mostrarle a Don Rigo el mapa global crudo. Mi función será:
1. **Recorte de Coordenadas (Clipping):** Hacer ping a la API de Google Earth Engine y aislar solo los píxeles de la parcela exacta del usuario.
2. **Modelo 3D con Topografía:** Usar la API de Mapas 3D de Google (como en su captura) para calcular los grados de inclinación. Así el motor sabrá que el agua escurre hacia abajo y ajustará la recomendación de riego.
3. **Conversión a Lenguaje Natural:** Traducir los 'mm/día de ET' a 'Horas de riego por goteo' en la app."

**Don Rigo (Campesino):** "Eso me gusta más. Si la app me dice 'Riega 2 horas en la parte alta y 1 en la baja porque el satélite dice que ahí pega más el sol', eso me ahorra dinero en diésel para la bomba."

## [10:00] Expansión a los 20 Cultivos de Oro

**Ing. Silva (Agrónomo):** "Para que esto escale a México, EE.UU. y LatAm, necesitamos configurar el motor de AgroVision para los 20 prospectos principales. No es lo mismo el estrés hídrico de la Cereza en Chile, que el del Mango en Nayarit o el del Tomate de Invernadero."

**Dev/Agente AI:** "¡Hecho! En este momento voy a actualizar la base de datos de la aplicación (`agroEngine.ts`) para incluir los 20 cultivos acordados (Aguacate, Soya, Almendras, Uva, Cereza, etc.). Además, agregaré un panel en el Dashboard simulando el cálculo de **Evapotranspiración (Satélite WAPOR)** e **Inclinación Topográfica 3D**."

## [10:30] Cierre y Siguientes Pasos
- **Campesinos:** Probarán la app en campo para ver si las horas de riego coinciden con la realidad del suelo.
- **Agrónomos:** Calibrarán los coeficientes de riego (Kc) y alertas de plaga por cultivo.
- **Tecnología:** Implementar la UI para seleccionar los 20 cultivos y la nueva visualización de variables satelitales en el dashboard.

---
*Fin de la junta. Procediendo a implementar los acuerdos en el código de AgroVision.*
