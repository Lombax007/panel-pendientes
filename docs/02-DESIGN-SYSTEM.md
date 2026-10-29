# 02 · Sistema de diseño (tomado del Figma de baja fidelidad)

Estas son las pantallas de baja fidelidad hechas en Figma (3 frames móviles). Las capturas están en `assets/`. Si un valor no aparece aquí, se tomó a ojo de las capturas y se puede afinar.

## Color
| Uso | Valor aproximado |
|---|---|
| Urgente (Hoy), barra, punto y píldora | `#CA3A31` |
| Fondo de la píldora de vencimiento roja | `#F9E3E2` |
| Esta semana | `#E9A23B` |
| Después / vencida / secundario | `#9DA3AE` |
| Acción principal (botón negro, píldora activa) | `#121826` |
| Fondo de pantalla | `#F5F5F5` |
| Encabezado y barra inferior | `#E5E7EB` |
| Fondo de tarjeta | `#F3F4F6` |
| Texto principal | casi negro (`#111827`); texto secundario gris medio |

Los encabezados de grupo usan el mismo color que su urgencia: HOY en rojo, ESTA SEMANA en un ámbar más oscuro, DESPUÉS en gris.

## Tipografía
Sans-serif limpia (el Figma usa una tipografía tipo Inter). Dos pesos: **negritas** para título de pantalla, nombre de tarea y botones; normal para datos. Encabezados de grupo en mayúsculas, tamaño pequeño y negritas.

## Forma y espacio
- Lienzo móvil de alrededor de 390 px de ancho.
- Esquinas redondeadas en tarjetas, botones, cuadro de estado y píldoras (píldoras totalmente redondas).
- Tarjetas con borde fino gris y barra de color de 4 px a la izquierda en el tablero.
- Barra inferior de tres pestañas con texto (Inicio, Cursos, Avisos).

## Componentes
1. **Encabezado de pantalla:** título en negritas, fondo gris claro; el tablero lleva un contador circular gris a la derecha; el detalle lleva flecha de regreso a la izquierda.
2. **Encabezado de grupo:** texto en mayúsculas del color de urgencia.
3. **Tarjeta de pendiente (tablero):** barra lateral de color, tarea en negritas, línea gris "Materia · vence ...".
4. **Tarjeta de aviso (panel):** punto de color, tarea en negritas, línea gris, botón de contorno "Ver tarea".
5. **Píldora de filtro:** activa = fondo negro y texto blanco; inactiva = contorno.
6. **Píldora de vencimiento (detalle):** fondo rojo claro, borde y texto rojos ("Vence hoy · 11:00").
7. **Cuadro de estado:** borde fino, tres líneas de texto.
8. **Botón primario:** negro relleno, texto blanco, ancho completo.
9. **Botón secundario:** contorno negro, fondo blanco, ancho completo.
10. **Barra inferior:** tres textos centrados, fija abajo.

## Principios de jerarquía visual (por qué está así)
- Lo primero que se lee debe ser la **hora límite** (en detalle, la píldora roja).
- La urgencia se comunica con color **y** con texto, nunca solo color.
- Una acción principal por pantalla (detalle: "Añadir entrega"; panel: "Ver tarea").
- Misma paleta, mismas formas y misma barra inferior en las tres pantallas para que se sienta una sola app.

## Flujo de navegación (Figma, vista Prototype)
- Tablero > Detalle: clic en la tarjeta de "Hoy".
- Tablero > Panel: clic en "Avisos" de la barra inferior.
- Panel > Detalle: clic en "Ver tarea".
- Detalle > Tablero: la flecha de regreso. **No quedó conectada en el Figma**; en la app sí debe funcionar.
- Interacciones y transiciones: en Figma solo se configuraron conectores de clic; en la app usar transiciones simples (deslizar o desvanecer, 150 a 250 ms), respetando `prefers-reduced-motion`.

## Pendientes del diseño (la versión 2 del Figma aún no existe)
- Mockup de media o alta fidelidad con paleta justificada (tarea 3.4 del plan, 29 oct a 5 nov).
- Título del encabezado del panel ("Avisos").
- Diseño de los recordatorios 24 h y 2 h y de la etiqueta de tipo de entrega.
Mientras no exista esa versión, la app puede ir con este estilo y actualizarse después.
