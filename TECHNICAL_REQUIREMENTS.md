# Requerimientos Técnicos: Integración de Google Maps Platform

Para habilitar el **Escaneo 3D Real** y el **Análisis Topográfico de Precisión** en Santa Cruz, Nayarit, necesitamos activar las siguientes APIs en tu Google Cloud Console:

### 1. APIs Fundamentales (Obligatorias)
- **Maps JavaScript API**: Es el motor principal. Permite renderizar el mapa y los marcadores avanzados.
- **Elevation API**: Crítica para el "Protocolo de Lluvia Tepic". Nos dará la altura exacta (msnm) de cada punto para calcular pendientes y drenaje.
- **Geocoding API**: Para convertir coordenadas GPS en direcciones y nombres de parcelas.

### 2. APIs de Especialidad (Activación Obligatoria para AgroVision 3D)
- **Solar API**: **FUNDAMENTAL**. Permite analizar la radiación solar histórica y predictiva en el lote. Imprescindible para predecir fotosíntesis y densidad de elote.
- **Elevation API**: **FUNDAMENTAL**. Proporciona el perfil topográfico para simular el drenaje del "Protocolo de Lluvia Tepic".
- **Photorealistic 3D Tiles**: **FUNDAMENTAL**. Habilita el renderizado del relieve real de Nayarit con precisión milimétrica y realismo visual.
- **Sentinel-2 / Landsat (Arquitectura)**: AgroVision está preparado para recibir capas de Infrarrojo Cercano (NIR) para el cálculo de NDVI real.

### 3. Modulo de Análisis NDVI (Vigor Vegetativo)
- **Cálculo (NIR-Red)/(NIR+Red)**: Implementación de algoritmos para detectar estrés hídrico y deficiencia de nitrógeno.
- **Mapeo de Biomasa**: Estimación de toneladas de materia verde por hectárea basadas en el índice de verdor.
- [x] **JS Loader Actualizado**: Usando la nueva API funcional `importLibrary` para compatibilidad total.
- [x] **Componente React Ready**: `GoogleMapComponent.tsx` con soporte para polígonos y modo satelital 3D.
- [x] **Sincronización de Campo**: El área medida en el mapa actualiza automáticamente el motor de costos en tiempo real.
- [x] **IA Groq Integrada**: SDK de Groq instalado y `GroqChatComponent` listo para análisis agronómico.
- [x] **Panel de Ajustes (BYOK)**: El usuario puede ingresar sus propias llaves de Maps y Groq sin reiniciar el entorno.
- [ ] **API Key Maps Pendiente**: Necesitas configurar `VITE_GOOGLE_MAPS_API_KEY`.
- [ ] **API Key Groq Pendiente**: Necesitas configurar `VITE_GROQ_API_KEY`.

### 4. Cálculo de "Paquetes por Metro" (IA Agro)
Usando la `Geometry Library`, AgroVision realizará lo siguiente:
1. **Dimensionamiento**: Trazado manual o automático del perímetro del lote.
2. **Cálculo de Superficie**: Obtención de metros cuadrados netos descontando caminos/árboles (identificados por IA en la imagen satelital).
3. **Optimización de Siembra**: Proyección de surcos según la pendiente de `Elevation API`.
4. **Densidad**: Cálculo exacto de sacos de semilla/fertilizante necesarios por cada metro lineal analizado.

### 5. Pasos para la Activación Final
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto llamado `AgroVision-SantaCruz`.
3. Busca y activa las 5 APIs mencionadas arriba.
4. Crea una **API Key** desde la sección de "Credenciales".
5. Copia esa llave y dímela para que pueda integrarla en el código.

---
**Nota:** Una vez que tengamos la llave, podré reemplazar la simulación actual por un mapa real que analice tu terreno en tiempo real.
