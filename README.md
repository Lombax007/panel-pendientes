# Mis pendientes — prototipo de panel por urgencia para un LMS

Prototipo web, pensado primero para celular, que simula cómo se vería dentro de una plataforma educativa (LMS) un **panel de pendientes ordenados por urgencia real**: Hoy, Esta semana y Después.

Es el proyecto integrador de **Gustavo Ahmed Lombardini Manuel** (cuenta 200877) para la materia Tecnologías Digitales (LIIS2102) de la Ibero Puebla, otoño 2026:
*"Rediseño de notificaciones en plataformas LMS: hacia una reducción de la sobrecarga cognitiva y la procrastinación académica"*.

> Es una demostración. **No** se conecta a ninguna plataforma real, no tiene servidor, no pide iniciar sesión y no hace ninguna llamada a internet. Los datos son de ejemplo y lo que hace el usuario se guarda solo en su navegador.

## Pantallas

| Pantalla | Liga | Qué hace |
|---|---|---|
| Mis pendientes (tablero) | `/` | Tareas agrupadas en HOY (rojo), ESTA SEMANA (ámbar), DESPUÉS (gris) y VENCIDAS (gris). El contador cuenta todo lo que falta entregar. |
| Avisos | `/avisos` | Lista ordenada por urgencia con los filtros Todas, Hoy y Esta semana (`/avisos?filtro=hoy`, `/avisos?filtro=semana`). |
| Detalle de tarea | `/tarea/estadistica` (por ejemplo) | Fecha límite, tiempo restante, estado, "Añadir entrega" y recordatorios. |
| Cursos | `/cursos` | Dice "Próximamente" (está fuera del alcance). |
| Antes y después | `/comparativo` | Solo para la presentación (ver abajo). No aparece en ningún menú. |

Cada pantalla tiene su propia liga, así que se puede compartir directo.

## Cómo correrlo en tu computadora

Necesitas [Node.js](https://nodejs.org) 20 o más reciente.

```bash
npm install
```

```bash
npm run dev
```

Abre la dirección que aparece en la terminal (normalmente http://localhost:5173). Para verlo como en el celular, abre las herramientas de desarrollador del navegador y elige un ancho de 390 px.

Otros comandos:

| Comando | Para qué |
|---|---|
| `npm test` | Corre las pruebas del cálculo de urgencia, de la persistencia y del modo demo (Vitest). |
| `npm run build` | Genera la versión final en la carpeta `dist/`. |
| `npm run preview` | Sirve la versión final en tu computadora para revisarla. |
| `npm run capturas` | Con `npm run dev` corriendo, toma capturas a 390 px en `screenshots/` (Playwright). |
| `npm run capturas:demo` | Igual, pero del comparativo (a 390 y 1280 px) y del modo demo. |
| `npm run prueba:recarga` | Con `npm run dev` corriendo, prueba que los recordatorios y las entregas se conserven al cerrar, recargar y cambiar de día. |

> Las dos últimas usan Playwright. Si te pide el navegador, corre una vez `npx playwright install chromium`.

## Cómo publicarlo en Vercel

El proyecto ya está listo: es un sitio estático, sin variables de entorno, y `vercel.json` hace que las ligas como `/avisos` funcionen al recargar.

**Opción A: desde la terminal**

1. Instala la herramienta de Vercel (solo la primera vez):
   ```bash
   npm install -g vercel
   ```
2. Inicia sesión (solo la primera vez):
   ```bash
   vercel login
   ```
3. Desde esta carpeta, publica:
   ```bash
   vercel --prod
   ```
   La primera vez te hará unas preguntas: acepta los valores que propone (detecta Vite, el comando `npm run build` y la carpeta `dist`). Al final te da la liga pública.

**Opción B: desde GitHub**

1. Sube esta carpeta a un repositorio de GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio y presiona **Deploy** sin cambiar nada.
3. Cada vez que subas cambios a GitHub, Vercel publica la nueva versión solo.

## Cómo editar los datos de ejemplo

Todo está en **`src/data/tasks.ts`**. Cada tarea se ve así:

```ts
{
  id: 'escala-redondeo',              // identificador fijo, sin espacios. No lo cambies una vez publicado.
  title: 'Escala y redondeo de calificaciones',
  course: 'Narrativas Corporales',    // nombre corto de la materia (sin clave)
  type: 'archivo',                    // 'archivo' o 'cuestionario'
  due: { days: 3, at: '18:00' },      // cuándo vence (ver abajo)
  description: 'Texto de 2 a 3 líneas…',
},
```

Formas de escribir la fecha límite (`due`). Todas usan la hora de la Ciudad de México:

| Escribes | Significa |
|---|---|
| `{ inHours: 3 }` | Dentro de unas 3 horas (siempre hoy) |
| `{ days: 0, at: '23:59' }` | Hoy a las 23:59 |
| `{ days: 1, at: '23:59' }` | Mañana a las 23:59 |
| `{ days: 3, at: '18:00' }` | En 3 días a las 18:00 |
| `{ days: -9, at: '23:59' }` | Hace 9 días (vencida) |
| `{ fixed: '2026-11-26T23:59' }` | Fecha fija |

Las fechas son relativas a "ahora" a propósito: así el tablero siempre muestra todos los grupos sin importar qué día se abra. La única fija es la **Entrega del proyecto final (26 de noviembre de 2026)**.

Opcionalmente puedes agregar `submitted: true` (ya entregada) o `grade: '9.5'` (calificación).

Con `npm run dev` abierto, los cambios se ven al instante y las tareas se mueven solas al grupo que les toca.

## Cómo apagar las propuestas

Las propuestas (las tres de la investigación y las dos herramientas de la presentación) están en un solo archivo, **`src/config/features.ts`**. Para apagar una, cambia `true` por `false` y vuelve a publicar.

| Flag | Qué hace encendida | Qué pasa si la apagas |
|---|---|---|
| `remindersEscalonados` | En el detalle, los recordatorios "24 h antes" y "2 h antes". | Regresa el botón original del Figma, "Recordarme en 1 hora". |
| `etiquetaTipoEntrega` | La etiqueta "Cuestionario" o "Subir archivo" en tarjetas, avisos y detalle. | Desaparece la etiqueta. |
| `grupoVencidas` | El grupo "VENCIDAS" en gris al final del tablero. | Las vencidas solo aparecen en Avisos, como en el Figma. El contador las sigue contando. |
| `comparativo` | La pantalla `/comparativo` (Antes y después). | `/comparativo` lleva al tablero. |
| `modoDemoTiempo` | El control de tiempo con `?demo=1`. | `?demo=1` no hace nada. |

**Acento azul tipo LMS.** Está en `src/config/theme.ts`. Cambia el color en `LMS_ACCENT` o ponlo en `null` para quitar la barra "Campus virtual" y regresar al gris neutro del Figma.

## Para la presentación y la prueba de usabilidad

- **Empezar de cero entre participantes.** Hay dos formas:
  - Abre la liga con `?reset` al final (por ejemplo `https://tu-liga.vercel.app/?reset`).
  - Mantén presionado el círculo del contador en "Mis pendientes" por un segundo.

  Cualquiera de las dos borra entregas y recordatorios. Aparece la confirmación "Listo, empezamos de cero".
- **Simular otra fecha.** Abre la liga con `?ahora=2026-11-25T10:00` para ver cómo se movería todo ese día; por ejemplo, el proyecto final pasa a "vence mañana". Para volver a la hora real usa `?ahora=real`.
- **Qué se guarda.** Las entregas y los recordatorios se guardan en el navegador del celular (`localStorage`) y se conservan aunque cierres la pestaña o cambie el día.
- **Los recordatorios son simulados.** Se guarda la preferencia y la app confirma a qué hora sonaría, pero no manda notificaciones reales.

## Para la presentación: comparativo y modo demo

Estas dos herramientas están escondidas a propósito: solo se llega a ellas con una liga especial, para que un estudiante no se las encuentre durante la prueba de usabilidad.

### Comparativo "Antes y después"

Abre **`https://panel-pendientes.vercel.app/comparativo`**.

- **En la computadora o el proyector** (pantalla de 900 px o más ancha), las dos versiones aparecen lado a lado, cada una dentro de un marco de celular:
  - **Antes**: una recreación de la campanita de notificaciones de un LMS genérico. Todo en el mismo gris, en el orden en que se publicaron, sin decir cuándo vence nada y mezclado con avisos de foros y calificaciones viejas.
  - **Después**: el tablero de pendientes de este prototipo.
  Puedes hacer scroll dentro de cada marco.
- **En el celular**, arriba hay un interruptor **Antes / Después** para cambiar de una vista a la otra.
- Abajo vienen cuatro puntos cortos con los datos de la encuesta y las entrevistas que justifican cada cambio.
- El lado "Antes" es una recreación hecha para comparar, no una captura de ninguna plataforma real; la pantalla lo dice.

### Modo demo: adelantar el tiempo

Abre **`https://panel-pendientes.vercel.app/?demo=1`**. Aparece una barra gris hasta arriba con cuatro botones:

| Botón | Qué hace |
|---|---|
| **+3 horas** | Adelanta el reloj 3 horas. Lo que vencía en menos de 3 horas se pasa a VENCIDAS (tócalo dos veces para ver vencer "Ejercicios de estadística"). |
| **+1 día** | Adelanta un día. Lo que vencía "mañana" se pasa a HOY y se pone rojo. |
| **+1 semana** | Adelanta 7 días. Lo de DESPUÉS se acerca a ESTA SEMANA. |
| **Volver al presente** | Regresa a la hora real. |

Los botones se pueden tocar varias veces y se van sumando (por ejemplo, 3 veces "+1 día" pasa "Escala y redondeo", que vencía en 3 días, a HOY).

Mientras la hora esté adelantada, la barra se pone **morada a rayas** y dice "Hora simulada: …, no es la hora real". Todo reacciona en vivo: el tablero, el contador, los avisos y sus filtros, y la píldora de vencimiento del detalle.

Algunas cosas que conviene saber:
- La hora adelantada **no se guarda**: si recargas la página, todo vuelve al presente.
- El modo demo sigue activo mientras navegas dentro de la app, pero si recargas en una pantalla cuya liga no tiene `?demo=1`, la barra desaparece. Para volver a verla, abre otra vez la liga con `?demo=1`.
- Sin `?demo=1` en la liga, la barra no existe: los estudiantes de la prueba de usabilidad nunca la ven.
- Para la presentación conviene abrir antes `https://panel-pendientes.vercel.app/?reset&demo=1`, que borra entregas y recordatorios y además activa el modo demo.

## Accesibilidad

- El color **nunca va solo**: cada grupo tiene encabezado de texto, cada tarea dice "vence hoy 15:30", "venció hace 9 días", etc., y la pestaña activa también va en negritas.
- Contraste AA en todos los textos. Los colores de urgencia del Figma se respetan en barras y puntos; donde hay texto, se oscurecieron un poco (ver `DECISIONS.md`).
- Botones de al menos 44 px de alto, usables con el pulgar.
- Funciona con lector de pantalla: títulos, estados de filtros y recordatorios (`aria-pressed`) y confirmaciones anunciadas.
- Las transiciones (150 a 250 ms) se apagan si el sistema tiene activado "reducir movimiento".

## Estructura

```
src/
  config/features.ts   ← flags de las propuestas
  config/theme.ts      ← acento tipo LMS
  data/tasks.ts        ← datos de ejemplo
  lib/urgency.ts       ← reglas de urgencia y textos ("vence en 3 días"…) + pruebas
  lib/persistence.ts   ← qué se guarda en localStorage + pruebas
  lib/timeShift.ts     ← desfase de tiempo del modo demo + pruebas
  data/beforeNotices.ts← avisos del lado "Antes" del comparativo
  state/TimeContext.tsx← la hora que ve la app (real + desfase del modo demo)
  screens/             ← Tablero, Avisos, Detalle, Cursos, Comparativo
  components/          ← tarjetas, encabezados, barra inferior…
docs/                  ← especificación, design system, investigación y plan
assets/                ← capturas del Figma
DECISIONS.md           ← bitácora de decisiones de diseño e implementación
```

Hecho con Vite, React, TypeScript y Tailwind CSS.
