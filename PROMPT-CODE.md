# Prompt para Claude Code — Prototipo "Panel de pendientes por urgencia"

> Cómo usarlo: abre una terminal en esta carpeta, corre `claude`, y pega TODO lo que
> está debajo de la línea. Los archivos del handoff ya están aquí (`CLAUDE.md`,
> `docs/`, `assets/`).

---

Hola. Vas a construir un prototipo web completo, de principio a fin, en esta carpeta.

## Primero lee el contexto

Antes de escribir una sola línea de código, lee en este orden:

1. `CLAUDE.md`
2. `docs/01-PRODUCT-SPEC.md`  ← la especificación real, síguela al pie de la letra
3. `docs/02-DESIGN-SYSTEM.md`
4. `docs/03-RESEARCH.md`
5. `docs/04-ROADMAP.md`
6. Las 4 capturas de `assets/` (ábrelas, son la referencia visual obligatoria)

No me pidas permiso para leerlos ni me los resumas. Léelos y empieza.

## Qué es esto (resumen de una línea)

Prototipo web móvil-primero que simula, con datos de ejemplo, cómo se vería dentro de
un LMS un panel de pendientes ordenados por urgencia real (Hoy / Esta semana / Después).
Es el proyecto integrador de la materia Tecnologías Digitales, Ibero Puebla. Se presenta
el 12 de noviembre y después se usará en una prueba de usabilidad con otros estudiantes.

**NO** es un plugin de Moodle, **NO** se conecta a Moodle, **NO** tiene backend, **NO**
tiene login. Es un demo. No intentes replicar Moodle completo: solo estas tres pantallas.

## Decisiones ya tomadas (no las cuestiones, ya las decidí)

- **Stack:** Vite + React + TypeScript + Tailwind. Sin librerías pesadas de UI. Debe
  correr con `npm install && npm run dev`. Router: `react-router-dom` está bien, o
  estado local si lo prefieres — lo que sea más simple, pero las 3 pantallas deben
  tener su propia ruta para poder compartir ligas.
- **Hosting:** Vercel. Deja el proyecto listo para `vercel --prod` (build estático,
  sin variables de entorno). Incluye en el README los pasos exactos.
- **Estilo visual:** el layout, la jerarquía y el flujo salen del Figma de `assets/`
  y de `docs/02-DESIGN-SYSTEM.md`, **pero** con aire a Moodle para que en la
  presentación se sienta que vive dentro del LMS: tipografía sans limpia, barra
  superior con un acento azul-marino tipo LMS, densidad y espaciado de plataforma
  educativa. Usa colores propios inspirados, **no** uses el logotipo, el nombre ni la
  marca de Moodle ni de la Ibero en ningún lado. Los colores de urgencia
  (rojo / ámbar / gris) del design system se respetan tal cual: son el corazón del
  proyecto. Déjame el acento del LMS en una sola variable de tema para poder
  cambiarlo o apagarlo rápido.
- **Propuestas de la investigación: SÍ, todas.** Implementa las tres cosas marcadas
  como PROPUESTA en los docs:
  1. Recordatorios escalonados de 24 h y 2 h (en vez de "Recordarme en 1 hora"),
     persistidos en `localStorage`.
  2. Etiqueta de tipo de entrega ("Cuestionario" / "Subir archivo") en tarjetas y detalle.
  3. Grupo "VENCIDAS" en gris al final del tablero.
  Cada una debe quedar detrás de un flag en un solo archivo `src/config/features.ts`,
  para poder apagarla en segundos si en la retroalimentación del 12 de noviembre me lo piden.

## Orden de construcción

Sigue el orden de `docs/04-ROADMAP.md`:

1. Proyecto base, datos de ejemplo y módulo de cálculo de urgencia **con pruebas**
   (Vitest) de los casos borde: vence en 20 min, vence hoy, mañana, en 3 días,
   en más de 7, vencida hace 9 días, entregada.
2. Tablero con grupos, tarjetas y barra inferior.
3. Detalle de tarea y navegación hacia atrás.
4. Panel de avisos con filtros Todas / Hoy / Esta semana.
5. Recordatorios, "Añadir entrega" y persistencia en `localStorage`.
6. Pulido: transiciones de 150–250 ms respetando `prefers-reduced-motion`,
   accesibilidad, revisión a 390 px, build de producción.

Detente y enséñame avance al terminar el paso 2 y al terminar el paso 4. En el resto
avanza solo.

## Reglas duras

- **Las fechas de los datos de ejemplo se calculan relativas a "ahora"**, nunca
  hardcodeadas, para que el prototipo siempre muestre los tres grupos sin importar
  qué día lo abra. Única excepción: "Entrega del proyecto final" va fijo al
  26 de noviembre de 2026.
- Todo el texto de interfaz en **español de México**, corto y claro. Sin tecnicismos.
- **El color nunca va solo**: siempre acompañado de texto. Es un criterio de
  accesibilidad del proyecto y lo voy a defender en la presentación.
- Zona horaria `America/Mexico_City` para el modelo de datos.
- Móvil primero, 390 px de ancho, usable con el pulgar, **sin scroll horizontal**.
- Sin llamadas de red de ningún tipo. Datos en un JSON/TS local.
- Si algo no está definido en los docs, **elige lo más simple y anótalo en
  `DECISIONS.md`** (créalo). No te detengas a preguntarme cosas menores.

## Antes de darlo por terminado

1. Corre las pruebas del cálculo de urgencia y que pasen.
2. Levanta el dev server, ábrelo con Playwright a 390 px de ancho y toma captura de
   las tres pantallas. Compáralas contra `assets/` y arregla lo que no cuadre.
3. Recorre el flujo completo: Tablero → toca tarjeta → Detalle → flecha atrás →
   Avisos → filtros → "Ver tarea" → "Añadir entrega" → recarga y verifica que el
   recordatorio y la entrega se conservaron.
4. Verifica uno por uno los 8 criterios de aceptación de la sección 9 de
   `docs/01-PRODUCT-SPEC.md` y repórtame cuáles cumplen.
5. Corre `npm run build` y que no truene.

## Entregables

- La app funcionando.
- `DECISIONS.md` con todo lo que decidiste tú y por qué.
- `README.md` con: cómo correrlo, cómo desplegarlo a Vercel, cómo editar los datos de
  ejemplo, y cómo apagar cada flag de las propuestas.
- Un commit inicial limpio con `.gitignore` de Node.

Cuando termines, dime en 5 líneas qué quedó y qué no, nada más.
