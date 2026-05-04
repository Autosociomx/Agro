# Propuestas de Crecimiento AgroVision

Documento ejecutable de iniciativas de crecimiento priorizadas. Complementa `STRATEGIC_PLAN.md`, `GO_TO_MARKET.md` y `CROP_EXPANSION_STRATEGY.md` con acciones concretas, métricas y plazos.

---

## 0. Diagnóstico Rápido

**Activos actuales**
- MVP funcional con React 19 + Vite, BYOK para Google Maps y Groq.
- Motor de cálculo agnóstico (`agroEngine.ts`) listo para recetas multi-cultivo.
- Posicionamiento claro: "Plataforma de Simulación de Riesgos" para agricultor mexicano de valor medio-alto.

**Brechas detectadas**
1. Sin loop de retención: el usuario entra, mide su parcela, y no tiene razón clara para volver mañana.
2. Sin captura de datos: cada interacción se pierde (sin backend persistente visible).
3. Sin canal de distribución probado: WhatsApp y alianzas están en plan, no en ejecución.
4. Sin moneda de cambio social: no hay forma de que un agricultor demuestre resultados a otros.

Las propuestas siguientes atacan estas 4 brechas en orden de palanca.

---

## 1. Propuestas de Producto (Retención y Activación)

### P1. "Bitácora de Parcela" — *Hook diario, 2 semanas de build*
Convertir AgroVision de herramienta de consulta a **diario digital** del lote.
- El agricultor abre la app cada mañana y ve: clima de hoy, alerta Groq, tarea sugerida ("Aplica nitrógeno antes de las 11 a.m.").
- Una sola pantalla, una sola decisión por día.
- **KPI**: DAU/MAU > 35% (benchmark: apps consumer agrícolas suelen estar en 8-12%).

### P2. "Modo Compadre" — *Onboarding por voz en 30 segundos*
El 60% de los agricultores objetivo tienen baja alfabetización digital.
- Botón único "Háblale a la app" → Groq pregunta cultivo, hectáreas, fecha de siembra → genera plan.
- Elimina el formulario. Texto solo para confirmar.
- **KPI**: Tasa de activación de nuevo usuario > 70% (vs ~25% típico de apps con formulario).

### P3. "Calendario de Pagos" — *Monetiza la ansiedad financiera*
El dolor real del pequeño agricultor no es el rendimiento, es el **flujo de caja**.
- Vista de timeline: "Semana 4: $8,400 MXN urea | Semana 8: $12,000 MXN agroquímicos | Semana 14: cosecha esperada $145,000 MXN".
- Permite pre-comprometer crédito o ahorro.
- **KPI**: % de usuarios que registran su presupuesto real > 40%.

### P4. "Comparador de Vecinos" (anonimizado) — *Network effect inicial*
Usar geocercas para mostrar: "5 parcelas en 10 km cultivan elote. Tu costo por hectárea está 12% sobre la media regional".
- Crea FOMO y enseña sin sermón.
- Requiere masa crítica (~30 parcelas activas por municipio).
- **KPI**: Densidad de parcelas activas por municipio.

---

## 2. Propuestas de Distribución (Adquisición)

### D1. Programa "Promotor Rural" — *CAC bajo, escalable*
- Reclutar 50 ingenieros agrónomos jóvenes (recién egresados UAN, Chapingo, ITSON) como promotores comisionistas.
- Reciben $200 MXN por cada agricultor activado + 10% de la suscripción durante 12 meses.
- **Inversión**: ~$50,000 MXN/mes en comisiones para captar ~250 usuarios/mes.
- **CAC objetivo**: < $200 MXN. **LTV objetivo**: > $1,800 MXN (12 × $150 MXN suscripción local).

### D2. "Reto del Elote 2026" — *Marketing con prueba social real*
- Convocatoria pública en Nayarit: 100 productores compiten por mayor utilidad por hectárea.
- AgroVision audita y publica resultados en TikTok/Facebook semanalmente.
- Premio: $50,000 MXN + insumos de marca aliada.
- **KPI**: 5 millones de impresiones orgánicas, 2,000 pre-registros.

### D3. Integración WhatsApp Business API — *Donde ya están*
- Bot que recibe foto de hoja → Groq diagnostica plaga/deficiencia → responde en 30 segundos.
- Funnel: bot gratuito → al 3er uso, invita a abrir la app web para ver el lote en 3D.
- **Costo**: ~$0.005 USD por mensaje. Monetizable como funnel de adquisición.

### D4. Plantilla "Landing del Cultivo" — *SEO programático*
- Generar 100 landing pages: `agrovision.mx/cultivo/aguacate-michoacan`, `/elote-nayarit`, etc.
- Cada una con calculadora interactiva de rentabilidad + capa de búsqueda orgánica.
- **KPI**: 50,000 visitas orgánicas/mes a 6 meses.

---

## 3. Propuestas de Monetización (Más allá de la suscripción)

### M1. "AgroVision Capital" — *Take rate sobre crédito de avío*
- Alianza con FIRA, fintechs (Verqor, Heru) o cooperativas de crédito.
- AgroVision genera el "score agronómico" del proyecto → entrega leads pre-evaluados.
- **Modelo**: 1.5% del monto del crédito originado.
- Una parcela de elote típica requiere $80-150k MXN de avío → **$1,200-2,250 MXN por lead**.
- Margen mucho mayor que la suscripción ($29/mes).

### M2. Marketplace de Insumos con Listing Fee + Take Rate
- No solo "botón de comprar" (ya en plan), sino **subasta de proveedores locales**.
- Distribuidor de fertilizante paga por aparecer cuando AgroVision recomienda 20 bultos de urea en un radio de 15 km.
- **Modelo**: $500 MXN/mes listing + 3% por venta cerrada.

### M3. "Datos Anónimos para Aseguradoras y Commodities"
- Vender el dataset agregado a:
  - Aseguradoras agrícolas (modelos de riesgo climático).
  - Traders de commodities (predicción de oferta regional).
  - Gobierno (SADER, gobiernos estatales).
- **Tamaño potencial**: contratos anuales de $500k - $5M MXN cada uno.
- Requiere: 10,000+ parcelas mapeadas para tener señal estadística.

### M4. Reporte PDF "Due Diligence Agrícola" — *Producto B2B inmediato*
- Para fondos de inversión y compradores de tierras.
- Reporte de 20 páginas: topografía, drenaje, radiación solar, riesgo climático, comparables regionales.
- **Precio**: $4,000-8,000 MXN por reporte. Generación 90% automatizada (Groq + Maps).
- **Margen bruto**: > 90%.

---

## 4. Propuestas de Foso Defensivo (Moat)

### F1. "Receta de Cultivo" como estándar abierto
- Publicar el JSON schema de recetas en GitHub bajo licencia Creative Commons.
- Atraer agrónomos/universidades a contribuir recetas regionales.
- AgroVision se vuelve la **referencia técnica**, no solo una app.

### F2. Calibración local con sensores IoT propios
- Diseñar un sensor de humedad/temperatura de bajo costo (~$300 MXN) co-brandeado.
- Cada sensor calibra el modelo regional → loop de mejora continua que competidores no pueden replicar sin presencia física.

### F3. "Memoria del Lote" — *Switching cost*
- Cada decisión, foto, cosecha, pago queda en el historial del lote.
- A los 2 ciclos, salirse de AgroVision = perder el equivalente al cuaderno de campo de 2 años.
- **Foso emocional + práctico**.

---

## 5. Roadmap Sugerido (90 días)

| Semana | Iniciativa | Owner sugerido | Métrica de éxito |
| :--- | :--- | :--- | :--- |
| 1-2 | P2 "Modo Compadre" (onboarding por voz) | Producto + Groq | 70% activación |
| 3-4 | P1 "Bitácora de Parcela" diaria | Producto | DAU/MAU 25% |
| 5-6 | D3 Bot WhatsApp diagnóstico | Growth | 1,000 conversaciones/sem |
| 7-8 | D1 Programa Promotor Rural (piloto Nayarit) | Ventas | 50 usuarios pagados |
| 9-10 | M4 Reporte Due Diligence (primer cliente B2B) | Comercial | 1 venta cerrada |
| 11-12 | D2 "Reto del Elote" anuncio público | Marketing | 2,000 pre-registros |

---

## 6. Métricas Norte (North Star)

**Métrica principal**: *Hectáreas Activamente Monitoreadas (HAM)*.
- Combina adquisición (nuevas parcelas) y retención (uso continuo).
- Meta 2026: **25,000 HAM** = ~2,500 productores activos.
- A esa escala se desbloquea M1 (originación de crédito) y M3 (venta de datos).

**Métricas secundarias**
- ARPU mensual: $250 MXN (mix freemium + premium + servicios).
- Margen de contribución por usuario premium: > 75%.
- NPS regional (Nayarit): > 60.

---

## 7. Riesgos y Cómo Mitigarlos

| Riesgo | Probabilidad | Mitigación |
| :--- | :--- | :--- |
| Costo de APIs Google escala más rápido que ingresos | Alta | Caché agresivo de tiles, Solar API solo on-demand premium |
| Competencia de Bayer/Syngenta con apps gratis | Media | Foso de datos locales + independencia de marca de insumos |
| Adopción lenta por desconfianza | Alta | Programa Campeones + casos de éxito en video local |
| Dependencia de Groq (proveedor único de IA) | Media | Abstracción del LLM en `groqService.ts` para swap a Gemini/Claude |

---

## 8. Pregunta Decisiva

> ¿Queremos ser una **herramienta SaaS para agricultores** ($5-10M USD ARR techo en México), o la **infraestructura de datos del campo mexicano** ($50-100M USD valuación por dato + transacciones)?

Las propuestas **M1, M3, F1 y F2** apuestan por la segunda. Las demás funcionan en ambos escenarios.

La recomendación es ejecutar el roadmap de 90 días enfocado en SaaS, mientras se construye el dataset que habilita la apuesta grande del año 2.
