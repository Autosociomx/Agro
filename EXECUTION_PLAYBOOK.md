# Playbook de Ejecución y Expansión Global

Documento operativo: cómo hacer que AgroVision realmente crezca, cómo escalarlo a 100 cultivos, y cómo volverlo universal de México a Latinoamérica, EE. UU. y Europa.

Este documento NO es estrategia abstracta. Es un manual de ejecución para un founder único dueño 100% del proyecto.

---

## PARTE 1 — Cómo hacer que esto realmente suceda

### 1.1 La verdad incómoda primero
Hoy AgroVision **no puede crecer** por 3 razones técnicas concretas, no por falta de marketing:

1. **El motor está hardcodeado a elote.** `agroEngine.ts:64-69` asume 13 kg de urea, 1 kg Mg y 25 kg de semilla por hectárea. Con elote en Nayarit funciona; con aguacate en Michoacán da números absurdos. **Sin recetas multi-cultivo no hay 100 cultivos. Sin 100 cultivos no hay TAM grande. Sin TAM grande no hay levantamiento de capital.**
2. **No hay backend ni base de datos.** Cada usuario que cierra la pestaña pierde su parcela. Sin persistencia no hay retención, no hay datos vendibles, no hay producto SaaS.
3. **BYOK (Bring Your Own Key) es enemigo del crecimiento masivo.** Pedir a un agricultor su API key de Google Maps es como pedirle que arme su propio tractor. Funciona para demos técnicas; mata la adopción de pequeños productores.

**Estas 3 cosas se arreglan en 4 semanas de código.** Sin ellas, ningún plan de marketing funciona.

### 1.2 Los primeros 10 clientes pagantes (no 1,000, diez)
Olvida el funnel masivo hasta que tengas 10 que paguen $29 USD/mes voluntariamente. Esos 10 te enseñan más que cualquier estudio de mercado.

**Plan táctico de 60 días para conseguirlos:**

| Semana | Acción concreta | Tu tiempo |
| :--- | :--- | :--- |
| 1 | Lista de 50 productores en Nayarit (LinkedIn, cooperativas, ferias, contactos personales) | 8 hrs |
| 2 | 50 mensajes WhatsApp personalizados con video de 60s del producto en su parcela | 6 hrs |
| 3-4 | 10 visitas presenciales en Tepic. Demos en su tierra, con su parcela en pantalla | 40 hrs |
| 5-6 | Onboarding manual 1-a-1 con los primeros que digan sí. Tú haces el setup | 30 hrs |
| 7-8 | Cobrar. Si no quieren pagar, pregunta por qué y vuelve al paso 3 | 10 hrs |

**Métrica única**: dinero en la cuenta de los primeros 10. Nada más importa hasta entonces.

### 1.3 La matemática del bootstrap vs. capital
Como dueño único tienes dos caminos. La decisión depende de una pregunta:

> ¿Puedes vivir 18 meses sin sueldo de AgroVision?

**Si NO**: Bootstrap servicios. Cobra $4-8k MXN por reportes Due Diligence (M4 del documento previo) a fondos agrícolas. Es el flujo de caja que financia el desarrollo. **30 reportes/año = ~$180k MXN sin levantar un peso.**

**Si SÍ (o tienes ahorros)**: Llega a $10k MXN MRR (Monthly Recurring Revenue) con tracción real, luego levanta una pre-semilla de $250-500k USD con fondos AgTech LATAM (SP Ventures, The Yield Lab, Glocal Managers, 500 Global LATAM, Mountain Nazca). A esa cifra ya negocias desde fortaleza.

**No hagas las dos cosas a medias.** Es la trampa más común: ni servicios bien hechos, ni producto bien hecho.

### 1.4 Los 3 errores que matan el proyecto en 2026
1. **Construir features sin haber cobrado.** Cada línea de código antes del primer pago es deuda contra ti mismo.
2. **Internacionalizar antes de dominar Nayarit.** Es tentador pensar global desde el día 1. No lo hagas hasta tener 500 usuarios pagados en una región.
3. **Vender el dato antes de tener volumen.** Vender "datos agrícolas anónimos" con 50 parcelas es vender humo. La regla mínima creíble: 5,000 hectáreas en una región específica.

---

## PARTE 2 — Arquitectura para 100 cultivos (versatilidad técnica)

### 2.1 El concepto: "Cultivo como JSON"
La única forma de escalar a 100 cultivos sin reescribir código 100 veces es separar **motor** (estable) de **receta** (variable). El motor es matemática agnóstica; la receta es agronomía específica.

### 2.2 Esquema propuesto de receta
Crear `src/data/crops/<crop_id>.json`:

```json
{
  "id": "elote_nayarit",
  "nombre": "Elote (Maíz Elotero)",
  "region": ["MX-NAY", "MX-JAL"],
  "ciclo_dias": 90,
  "siembra": {
    "kg_semilla_por_ha": 25,
    "distancia_surcos_cm": 80,
    "distancia_matas_cm": 25,
    "unidades_por_planta": 1.2
  },
  "fertilizacion": [
    { "etapa_dias": 25, "producto": "urea", "kg_por_ha": 130 },
    { "etapa_dias": 50, "producto": "urea", "kg_por_ha": 90 },
    { "etapa_dias": 70, "producto": "sulfato_mg", "kg_por_ha": 15 }
  ],
  "riego": { "tipo": "cintilla", "metros_por_ha": 12500 },
  "mano_obra": { "jornales_por_ha_ciclo": 35 },
  "precios_referencia": { "moneda": "MXN", "unidad_venta": "elote", "precio": 4.5 },
  "ventana_cosecha_dias": [85, 95],
  "riesgos": ["lluvia_intensa_drenaje", "radiacion_excesiva_floracion"]
}
```

**Versatilidad real**: el mismo motor calcula elote en Nayarit, aguacate en Michoacán, sandía en Sonora, café en Chiapas. Solo cambia el JSON.

### 2.3 Refactor concreto del engine
Pasos puntuales sobre el código actual:

1. `src/logic/agroEngine.ts:64-69` — eliminar constantes hardcodeadas. Reemplazar por iteración sobre `crop.fertilizacion[]`.
2. `src/logic/agroEngine.ts:1-18` — la interface `AgroParams` debe recibir `crop: CropRecipe` en lugar de campos aplanados.
3. Crear `src/logic/cropLoader.ts` — carga JSON desde `src/data/crops/` y valida con un schema (Zod).
4. Crear `src/logic/recipeRunner.ts` — orquesta: recibe receta + parámetros del agricultor (área, precios locales) → produce `AgroReport` genérico.
5. Mantener `calculateQuimiasX` como adaptador legacy con flag de deprecación durante 2 sprints.

**Tiempo estimado**: 3-5 días de trabajo enfocado.

### 2.4 La librería de las 100 recetas: ¿cómo se llena?
Tres caminos, en orden de eficiencia:

1. **Convertir publicaciones del INIFAP / CIMMYT / SAGARPA** a JSON. Cada publicación oficial es una receta validada. Trabajo de un agrónomo junior + Groq para parsear: ~10 recetas/semana.
2. **Pedir a 10 ingenieros agrónomos** que aporten su receta favorita a cambio de licencia gratis vitalicia. Vanity + utilidad real.
3. **Programa universitario**: convenio con UAN, Chapingo, Tecnológico de Monterrey. Estudiantes de tesis aportan recetas regionales como caso de estudio.

Meta realista: 30 cultivos en 6 meses, 100 en 18 meses. No los 100 de golpe.

### 2.5 Groq como traductor universal de receta a consejo
La IA no calcula (eso lo hace el motor). La IA **traduce**: receta + clima local + foto del cultivo → consejo accionable en lenguaje regional.

```
Input: { receta: aguacate_michoacan, clima: { lluvia_24h: 45mm }, etapa: floracion }
Output: "Don José, con esa lluvia hay riesgo de antracnosis. Aplique cobre mañana
        antes de las 10 a.m. mientras seca el árbol."
```

Esto se construye en `src/services/groqService.ts` agregando un prompt template por etapa fenológica.

---

## PARTE 3 — Universalidad geográfica (México → LATAM → USA → Europa)

### 3.1 Las 3 capas de localización
La internacionalización no es traducir botones. Son 3 capas con dificultad creciente:

| Capa | Qué cambia | Dificultad | Costo |
| :--- | :--- | :--- | :--- |
| **Datos** | Recetas, precios, clima, NDVI regional | Media | Tiempo agronómico |
| **Regulación** | Pesticidas permitidos, certificaciones, datos personales | Alta | Asesoría legal por país |
| **UX cultural** | Idioma, unidades, modismos, métodos de pago | Media | Diseño + i18n |

**Implicación práctica**: cada país requiere ~3 meses de trabajo serio. No 3 países por mes.

### 3.2 La secuencia recomendada (12-24 meses)

**Fase 1 — México (mes 1-9)**
- Dominar Nayarit, Sinaloa, Jalisco, Michoacán.
- Meta: 2,000 productores activos, $50k USD MRR.

**Fase 2 — Triángulo LATAM (mes 9-15)**
- Colombia (café, palma), Perú (palta, arándanos), Guatemala (caña, café).
- Por qué estos: idioma compartido, recetas casi transferibles desde México, agricultura de exportación con productores tecnificados pagadores.
- Modelo: partner local en cada país (cooperativa o consultora agrónoma con cartera).

**Fase 3 — Brasil + Argentina (mes 15-21)**
- Brasil es 50% del PIB agrícola de LATAM. Pero idioma, regulación y mercado distintos.
- Requiere oficina local o partner fuerte. No improvisar.

**Fase 4 — EE. UU. con un giro (mes 18-30)**
- **No competir con John Deere Operations Center, Climate FieldView o Granular.** Pierdes.
- Sí entrar por el flanco: **agricultores hispanohablantes en California, Texas, Florida**. ~250,000 productores que las apps gringas ignoran.
- Producto bilingüe nativo, precios en USD, integración con USDA RMA para subsidios de seguro.

**Fase 5 — Europa (mes 24-36)**
- **No es un mercado, son 27.** Atacar 1 país: España (idioma, cultivos similares: olivo, cítricos, hortalizas) o Países Bajos (tech-friendly, exportador a toda la UE).
- Cumplimiento GDPR obligatorio desde el día 1. Auditoría legal: ~$8-15k EUR.
- Diferenciador: integración con la PAC (Política Agrícola Común) y reportes de sostenibilidad ESG.

### 3.3 Arquitectura "núcleo + adaptadores"
Para que el código soporte esto sin volverse spaghetti:

```
core/                    ← motor agnóstico, no toca por país
├── engine
├── recipe schema
└── ai orchestrator

adapters/
├── mx/                  ← precios CONASUPO, clima CONAGUA, idioma es-MX
├── co/                  ← precios DANE, clima IDEAM, idioma es-CO
├── us-hispanic/         ← USDA, NOAA, idioma es-US + en-US
└── es/                  ← MAPA, AEMET, GDPR, idioma es-ES
```

Cada adapter expone la misma interfaz al core. Agregar un país = crear una carpeta, no tocar el motor.

### 3.4 Modelo de partners regionales
**No abrir oficina en cada país.** Modelo de revenue share con un operador local por país durante los primeros 24 meses:

- AgroVision aporta: tecnología, marca, recetas base.
- Partner local aporta: agrónomos, soporte, ventas, recetas regionales, cumplimiento.
- Split: 60/40 a favor de AgroVision en suscripciones. 50/50 en marketplace.
- Cláusula de recompra: AgroVision puede comprar la operación local a 3× revenue después del año 2 si quiere consolidar.

Este modelo ya lo usaron Rappi, Kavak y Nubank para escalar LATAM. Funciona.

---

## PARTE 4 — Plan personal de los próximos 90 días

Esto es lo que tú, dueño único, haces. Sin equipo, sin levantar capital primero.

### Semanas 1-2: Desbloqueo técnico (tú con Claude/Cursor)
- [ ] Refactor del motor a recetas JSON (Parte 2.3).
- [ ] 3 recetas escritas: elote, aguacate, sandía.
- [ ] Backend mínimo: Supabase o Firebase con auth + tabla `parcelas`.
- [ ] Quitar BYOK del flujo de onboarding. Mover keys a variables del servidor.

### Semanas 3-4: Producto vendible
- [ ] Onboarding sin formulario (Modo Compadre con voz Groq).
- [ ] Pantalla diaria "Bitácora de Parcela".
- [ ] Stripe / Mercado Pago integrados con plan de $29 USD o $499 MXN.
- [ ] Landing pública en `agrovision.mx` con pre-registro.

### Semanas 5-8: Primeros 10 clientes (Parte 1.2)
- [ ] Visitas presenciales en Nayarit. Demos en parcela.
- [ ] Cobrar a los primeros 5. Onboarding 1-a-1.
- [ ] Documentar TODO: objeciones, precios percibidos, features pedidas.

### Semanas 9-12: Iterar y abrir grifo
- [ ] Reescribir landing con testimonios reales de los 10.
- [ ] Lanzar bot WhatsApp como funnel de adquisición.
- [ ] Activar 5 promotores agrónomos (programa D1).
- [ ] Meta semana 12: **30 clientes pagados, $15k MXN MRR**.

A esa cifra, con producto recetadriven y backend funcional, **ya estás en condiciones de levantar pre-semilla o seguir bootstrap con confianza**.

---

## PARTE 5 — Tres decisiones que solo tú puedes tomar

Como dueño 100%, antes de empezar a ejecutar, necesitas tomar 3 decisiones. Sin ellas el plan no avanza:

1. **¿Cuánto tiempo personal le metes por semana?** Menos de 30 hrs = el proyecto muere. 30-50 hrs = creces orgánico. >50 hrs = puedes acelerar pero quemas.
2. **¿Vas a contratar al primer agrónomo de planta o sigues solo?** Recomendación: a los 50 clientes pagados, contratas 1 agrónomo a $25k MXN/mes. Antes no.
3. **¿Vendes equity o no?** Si vendes 15-20% por $300k USD a fondo AgTech, aceleras 2 años. Si no, tardas 4 años pero te quedas con todo. Las dos respuestas son válidas, pero no se puede dudar a la mitad.

Una vez tomadas, todo lo anterior es ejecución mecánica.

---

## Apéndice — Qué quiero que hagas a continuación

Tres opciones, en orden de impacto:

**A. Empezar el refactor del motor a recetas JSON.** Es el desbloqueo #1. Puedo dejarlo listo en una sola sesión: schema Zod, 3 recetas de ejemplo, motor refactorizado, tests.

**B. Construir el backend mínimo (Supabase) y migrar el estado actual a persistencia real.** Desbloqueo #2. ~1 día de trabajo.

**C. Diseñar la landing de pre-registro en `agrovision.mx` con copy en español, captura de email y video demo.** Desbloqueo de adquisición.

Dime cuál y lo ejecuto en este mismo branch.
