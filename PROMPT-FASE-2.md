# Fase 2 — Comparativo "Antes / Después" y control de tiempo simulado

Vamos a agregar dos cosas al prototipo. Las dos son para la presentación del 12 de
noviembre, así que lo que importa es que se vean bien proyectadas y que no rompan nada
de lo que ya funciona.

Antes de empezar, relee `DECISIONS.md` y `docs/01-PRODUCT-SPEC.md`. Las dos funciones
nuevas van detrás de su propio flag en `src/config/features.ts`, igual que las otras
propuestas, y las documentas en `DECISIONS.md` cuando termines.

Regla que no se rompe: las 22 pruebas existentes deben seguir pasando sin que las
modifiques. Si una se rompe, el problema es tu código nuevo, no la prueba.

---

## Función A — Comparativo "Antes / Después"

Una pantalla nueva en `/comparativo` que muestre **los mismos datos de ejemplo**
renderizados de dos maneras, para demostrar de un vistazo qué cambia con el rediseño.

**Lado "Antes":** una recreación de cómo se ven hoy las notificaciones en la campanita
de un LMS genérico. Así es como debe verse, y es a propósito:

- Todo en el mismo texto gris, mismo tamaño, mismo peso. Nada destaca.
- Ordenado por fecha de publicación del aviso, **no** por urgencia. O sea: la entrega
  que vence en 3 horas puede quedar hasta abajo.
- Sin fecha límite visible. El aviso dice algo como "Se ha añadido una nueva actividad"
  o "Recordatorio de entrega", sin decir cuándo cierra.
- Mezclado con ruido real de LMS: una calificación publicada hace tres semanas, un
  mensaje del foro, un aviso de que un profesor subió material. Mete 4 o 5 de estos
  entre las tareas para que se sienta el desorden.
- Nombres de materia con la clave larga y cortados, como salen de verdad
  (ej. "LIIS2102-01-2026O-Tecnologías Di..."). Esto viene de la Entrevista 2.

**Lado "Después":** el tablero que ya tienes, tal cual, sin tocarlo.

**Cómo se presenta:**
- En móvil (390 px), un toggle arriba que cambia entre las dos vistas. Nada de dos
  columnas apretadas.
- En pantalla ancha (desde 900 px), las dos lado a lado, porque así es como lo voy a
  proyectar. Esta es la única parte del proyecto que no es móvil primero, y es
  intencional: anótalo en `DECISIONS.md`.
- Abajo, tres o cuatro líneas de texto corto que digan qué cambió y por qué, citando
  los datos de la investigación. Por ejemplo, que la pregunta 7 de la encuesta
  ("distingo lo urgente de lo que no") salió con media de 2.21 sobre 5 y que nadie
  marcó 5. Saca los datos de `docs/03-RESEARCH.md`, no los inventes.
- Que se llegue por una liga directa (`/comparativo`), no desde la barra inferior.
  No quiero que un estudiante en la prueba de usabilidad se lo encuentre por accidente.

**Importante:** el lado "Antes" es una recreación ilustrativa hecha por mí, no una
captura real. No uses el logo, el nombre ni los colores de marca de Moodle. Pon en la
pantalla una nota chiquita que diga que es una recreación con fines de comparación.

---

## Función B — Control de tiempo simulado

Un control para adelantar la hora y ver cómo las tarjetas se reagrupan solas. Sirve
para demostrar en vivo que la urgencia se **calcula**, no se pinta a mano.

- Botones: **+3 horas**, **+1 día**, **+1 semana**, y **Volver al presente**.
- Al tocarlos, el tablero y los avisos se reagrupan en vivo: lo de "en 3 días" se pasa
  a HOY y se pone rojo, la píldora del detalle cambia, el contador se actualiza.
- Mientras el tiempo esté desfasado, una barra delgada fija hasta arriba que diga algo
  como "Hora simulada: viernes 30 oct, 15:30" con un botón para volver al presente.
  Tiene que ser obvio que no es la hora real.
- El desfase vive en memoria (no en `localStorage`): al recargar vuelve al presente.
- **No** metas el reloj simulado dentro del módulo de cálculo de urgencia. Ese módulo
  ya recibe la hora como parámetro y está probado; déjalo puro. El desfase va en una
  capa de arriba (un contexto de React o un hook) que decide qué hora le pasa.
- El control se activa solo con `?demo=1` en la liga. Sin ese parámetro no existe ni
  se ve, por la misma razón que el comparativo: que no se lo encuentre un estudiante
  en la prueba de usabilidad.

---

## Antes de dar esto por terminado

1. Las 22 pruebas originales pasan sin modificarse.
2. Agrega pruebas nuevas para el desfase de tiempo: que +1 día mueva una tarea de
   ESTA SEMANA a HOY, y que "volver al presente" la regrese.
3. Con Playwright, capturas de: `/comparativo` a 390 px (las dos vistas del toggle) y
   a 1280 px (lado a lado), y del tablero con `?demo=1` antes y después de +1 día.
   Revísalas tú y arregla lo que se vea mal.
4. Verifica que sin `?demo=1` no aparezca ningún rastro del control de tiempo, y que
   el flujo normal (tablero → detalle → avisos → filtros) siga igual que antes.
5. `npm run build` sin errores.

## Para terminar

1. Anota en `DECISIONS.md` las decisiones nuevas, incluyendo por qué el comparativo
   rompe el móvil primero y por qué las dos funciones van escondidas detrás de un
   parámetro.
2. Actualiza el `README.md`: cómo abrir el comparativo y cómo usar el modo demo,
   explicado para alguien que no programó esto.
3. Commit con mensaje claro y `git push`. Vercel redespliega solo; confírmame que el
   build pasó y dame las dos ligas: la del comparativo y la del tablero con `?demo=1`.

Cuando acabes, dime en 5 líneas qué quedó, nada más.
