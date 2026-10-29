# 01 · Especificación del producto

## 1. Problema
Los estudiantes dependen de Moodle para enterarse de tareas y fechas límite, pero las notificaciones son genéricas: la campanita mezcla una calificación de hace tres semanas con una entrega de hoy y todo se ve igual (texto gris). Además, los avisos no dicen qué tarea es, de qué materia ni cuándo cierra. Resultado: olvidos, entregas tardías y que los alumnos armen sistemas paralelos (Notion, Notas del celular, WhatsApp).

## 2. Propuesta de valor
Una sola pantalla que ordena los pendientes por urgencia real y muestra, en cada uno, **materia, tarea y hora límite legibles**, con enlace directo a la actividad y recordatorios antes del cierre.

Pregunta de investigación: ¿De qué manera el rediseño de las notificaciones y la jerarquización visual de urgencia en un LMS puede reducir la carga cognitiva y la procrastinación académica en estudiantes universitarios?

## 3. Usuario objetivo (Persona compuesta, "Ale")
Estudiante de licenciatura, 3.º a 5.º semestre, 4 a 7 cursos activos en Moodle. Revisa la plataforma una vez al día o menos, sobre todo en laptop, a veces desde el navegador del celular. Se entera de las tareas por compañeros, WhatsApp o porque el profesor lo dice en clase. Guarda sus pendientes en Notion o en las Notas del celular. Necesita ver de inmediato materia, tarea y tiempo restante.

## 4. Alcance de la versión 1
**Dentro:**
1. Tablero "Mis pendientes" agrupado en Hoy / Esta semana / Después.
2. Panel de notificaciones con filtros Todas / Hoy / Esta semana.
3. Detalle de tarea con estado, tiempo restante, calificación, "Añadir entrega" y recordatorios.
4. Cálculo automático de urgencia a partir de la fecha límite y la hora actual.
5. Recordatorios escalonados 24 h y 2 h antes (PROPUESTA, viene de la investigación; reemplaza "Recordarme en 1 hora" del Figma).
6. Tarjetas con nombre corto de materia y tipo de entrega (PROPUESTA, viene de la investigación).

**Fuera (versión 1):** conexión real con Moodle, login, notificaciones push reales, widget de pantalla de inicio, WhatsApp, múltiples usuarios, base de datos, panel de profesor.

## 5. Historias de usuario
- Como estudiante, quiero ver qué se me vence **hoy** sin buscar, para no olvidar una entrega.
- Como estudiante, quiero distinguir de un vistazo lo urgente de lo que puede esperar.
- Como estudiante, quiero que cada aviso diga materia, tarea y hora límite, para no tener que abrirlo.
- Como estudiante, quiero abrir directo la tarea desde el aviso.
- Como estudiante, quiero activar recordatorios antes del cierre sin configurarlos uno por uno.
- Como estudiante, quiero saber qué tipo de entrega es (cuestionario rápido o archivo), para calcular cuánto tiempo necesito.

## 6. Pantallas y comportamiento
Referencias visuales en `assets/figma-1-tablero.png`, `figma-2-panel.png`, `figma-3-detalle.png` y `figma-flujo-prototype.png`.

### 6.1 Tablero de pendientes (pantalla de inicio)
- Encabezado: título "Mis pendientes" y un contador circular gris con el total de pendientes activos.
- Tres grupos con encabezado en mayúsculas: **HOY** (rojo), **ESTA SEMANA** (ámbar), **DESPUÉS** (gris). Un grupo sin elementos no se muestra.
- Tarjeta: barra lateral del color de urgencia, tarea en negritas, y en gris "Materia · vence hoy 11:00" / "vence en 3 días" / "vence 26 nov".
- Tocar una tarjeta abre el Detalle de esa tarea.
- Barra inferior fija: Inicio, Cursos, Avisos. "Avisos" lleva al Panel. "Cursos" puede mostrar una pantalla vacía con el texto "Próximamente" (no está en el alcance).

### 6.2 Panel de notificaciones
- Fila de píldoras: **Todas** (activa por defecto, negro con texto blanco), **Hoy**, **Esta semana** (contorno).
- Lista de avisos ordenada por urgencia (más cercano primero). Cada aviso: punto de color de urgencia, tarea en negritas, "Materia · vence ..." en gris y botón de contorno "Ver tarea" que abre el Detalle.
- Un aviso vencido se muestra en gris con el texto "venció hace N días".
- Filtros: Hoy muestra solo lo que vence hoy; Esta semana, lo de los próximos 7 días; Todas, todo.
- Misma barra inferior que el tablero.
- Nota del Figma: el encabezado de esta pantalla quedó en blanco (falta título). Poner "Avisos".

### 6.3 Detalle de tarea
- Encabezado con flecha de regreso (vuelve a la pantalla de origen) y el texto "Detalle de tarea".
- Título de la tarea en grande y la materia debajo.
- Píldora roja de vencimiento, por ejemplo "Vence hoy · 11:00" (el color cambia según la urgencia).
- Bloque de descripción (en el Figma son barras grises de relleno; poner texto de ejemplo de 2 a 3 líneas).
- Cuadro "Estado de la entrega" con tres líneas: Estado (Sin entrega / Entregada), Tiempo restante (se calcula, p. ej. "3 horas"), Calificación (Sin calificar).
- Botón principal negro: **Añadir entrega**. Al tocarlo, en la versión 1, cambia el estado a "Entregada" y muestra una confirmación breve (simulación; no sube archivos).
- Botón secundario de contorno: **Recordarme** (PROPUESTA: en lugar de "Recordarme en 1 hora" ofrece "24 h antes" y "2 h antes", activables). El estado se guarda en `localStorage`.
- PROPUESTA: etiqueta de tipo de entrega junto a la píldora ("Cuestionario" o "Subir archivo").

## 7. Reglas de urgencia
Se calculan con la hora actual del dispositivo contra `dueAt`:
- **Hoy:** vence hoy (misma fecha local), aunque sea en 20 minutos.
- **Esta semana:** vence en los siguientes 1 a 7 días.
- **Después:** vence en más de 7 días.
- **Vencida:** ya pasó la fecha límite y no está entregada. Decisión PROPUESTA: grupo "VENCIDAS" gris al final del tablero (el Figma solo la muestra en el panel como "venció hace 9 días").
- Una tarea entregada sale de los grupos de pendientes.
- El texto relativo: menos de 1 h "vence en N min"; menos de 24 h "vence en N horas" o "vence hoy HH:MM"; 1 día "vence mañana HH:MM"; 2 a 7 días "vence en N días"; más de 7 días fecha corta "vence 26 nov".

## 8. Modelo de datos (JSON local)
```ts
type Task = {
  id: string;
  title: string;            // "Ejercicios de estadística"
  course: string;           // nombre corto: "Modelos de Pronóstico"
  type: "cuestionario" | "archivo";
  dueAt: string;            // ISO 8601, zona America/Mexico_City
  submitted: boolean;
  grade: string | null;     // null = "Sin calificar"
  description: string;
  reminders: { h24: boolean; h2: boolean };
};
```
Datos de ejemplo mínimos (las fechas deben calcularse relativas a "ahora" para que el prototipo siempre muestre los tres grupos):
| Tarea | Materia | Vence | Tipo |
|---|---|---|---|
| Ejercicios de estadística | Modelos de Pronóstico | hoy, dentro de ~3 horas | archivo |
| Escala y redondeo de calificaciones | Narrativas Corporales | en 3 días | archivo |
| Entrega del proyecto final | Tecnologías Digitales | 26 de noviembre | archivo |
| Diagramas de flujo del proceso | Estudio del Trabajo | hace 9 días (vencida) | archivo |
| Cuestionario rápido de unidad | Modelos de Pronóstico | mañana 23:59 | cuestionario |
Agregar de 2 a 3 tareas más para que las listas se sientan reales.

## 9. Criterios de aceptación
1. Al abrir la app, el tablero muestra los grupos con el orden y colores del Figma.
2. Cambiar la hora del sistema o editar `dueAt` mueve la tarea al grupo correcto sin recargar código.
3. Tocar una tarjeta o "Ver tarea" abre el detalle correcto; la flecha regresa a la pantalla anterior.
4. Los filtros del panel funcionan y la píldora activa cambia de estilo.
5. "Añadir entrega" marca la tarea como entregada y desaparece de pendientes.
6. Los recordatorios 24 h y 2 h se pueden activar y se conservan al recargar.
7. Todo se ve bien a 390 px de ancho y es usable con el pulgar; sin scroll horizontal.
8. Contraste de texto legible; el color de urgencia siempre acompañado de texto.

## 10. Métricas para la prueba de usabilidad (opcional)
Tiempo para encontrar "qué vence hoy", cantidad de toques para abrir una tarea y comentarios. Puede registrarse con un log simple en consola o `localStorage`; no es obligatorio.
