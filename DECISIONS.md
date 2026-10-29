# Bitácora de decisiones

Decisiones que no estaban definidas en `docs/` o que se apartan del Figma de baja fidelidad (`assets/`). Cada una dice qué se decidió y por qué.

## Tablero

| # | Decisión | Por qué |
|---|---|---|
| D1 | El contador circular cuenta **todo lo no entregado, vencidas incluidas** (con los datos de ejemplo: 8). | Una tarea vencida y sin entregar sigue siendo un pendiente, y es la más urgente. Si se excluye, el número subestima lo que falta, que es justo lo que se le critica a Moodle en la investigación. El conteo no cambia si se apaga el flag `grupoVencidas`. |
| D2 | El círculo del contador es gris `#6B7280` en vez de `#9DA3AE`. | Con `#9DA3AE`, el número blanco tiene un contraste de ~2.5:1. Con `#6B7280` llega a ~4.8:1 (AA), que es el criterio de aceptación 8. |
| D3 | La barra lateral de las tarjetas mide 4 px, como en `02-DESIGN-SYSTEM.md`. | Así coincide con el sistema de diseño cuando se proyecta junto al Figma. |
| D4 | En el texto, los encabezados de grupo usan tonos más oscuros: ámbar `#A1520F` y gris `#5B6270`. Las barras y los puntos conservan los colores exactos del Figma (`#E9A23B`, `#9DA3AE`). | El design system pide "un ámbar más oscuro" para el encabezado. Además, `#E9A23B` y `#9DA3AE` no alcanzan el contraste AA como texto sobre blanco. El rojo `#CA3A31` sí pasa (~5:1) y se queda igual. |
| D5 | Con los datos de ejemplo hay 8 tareas (las 5 de la especificación y 3 más). | La especificación pide de 2 a 3 tareas más para que las listas se sientan reales. |

## Barra inferior y marco LMS

| # | Decisión | Por qué |
|---|---|---|
| D6 | **La barra inferior lleva íconos encima del texto** (casa, libro, campana). El Figma solo tiene texto. | Hacen el área de toque más grande y más fácil de reconocer en móvil (64 px de alto por pestaña, usable con el pulgar). El texto sigue ahí, así que el ícono nunca va solo. Para quitarlos basta con borrar `<Icon …/>` en `src/components/BottomNav.tsx`. |
| D7 | La pestaña activa se marca en **negritas, con el color de acento y una rayita arriba**. | El Figma no define un estado activo. Usar tres señales (peso, color y forma) evita depender solo del color. |
| D8 | Hay una barra superior azul marino con el texto "Campus virtual" y el avatar "AL" (de la persona Ale). No usa ninguna marca. | Le da "aire a LMS" sin usar el nombre ni el logotipo de Moodle o la Ibero. El acento vive en una sola variable, `LMS_ACCENT`, en `src/config/theme.ts`: si es `null`, desaparece la barra y la app queda con el gris neutro del Figma. Se revisó que a 390 × 844 "HOY" y la primera tarjeta se ven sin hacer scroll. |
| D9 | La tipografía es la del sistema (San Francisco en iPhone, Roboto en Android y Segoe UI en Windows). | Es limpia, parecida a Inter y no requiere descargar fuentes (regla de cero llamadas de red). Además, es la misma pila que usan muchos LMS. |

## Detalle de tarea

| # | Decisión | Por qué |
|---|---|---|
| D10 | El detalle **no lleva barra inferior**; se sale con la flecha. | Así está en el Figma: es una subpantalla con su propia acción principal, y sin la barra los botones quedan a la altura del pulgar. |
| D11 | La flecha regresa a la pantalla de origen, incluso con el filtro que estaba activo (por ejemplo `/avisos?filtro=hoy`). Si se entró por liga directa, va al tablero. | En el Figma no quedó conectada. Una liga compartida no tiene historial al cual regresar. |
| D12 | Texto de la píldora: hoy "Vence hoy · 15:30", mañana "Vence mañana · 23:59", después "Vence jue 26 nov · 23:59" y vencida "Venció hace 9 días". | La especificación pide que la hora límite sea lo primero que se lea. A partir de pasado mañana se muestran el día y la fecha porque la hora sola no basta. |
| D13 | Tiempo restante: menos de 1 h en minutos, menos de 24 h en horas completas y después en días completos. Si está vencida dice "Se acabó el tiempo" y si está entregada, "Ya entregaste". | Así coincide con el ejemplo del Figma ("3 horas") y no hace falta que el usuario haga cuentas. |
| D14 | La descripción del Figma (barras grises) se reemplazó por 2 o 3 líneas de texto de ejemplo para cada tarea. | Lo pide la especificación, en la sección 6.3. |

## Panel de avisos

| # | Decisión | Por qué |
|---|---|---|
| D15 | El filtro "Esta semana" **incluye lo que vence hoy** (todo lo de los próximos 7 días). | En el tablero, los grupos son **excluyentes**: una tarea está en HOY o en ESTA SEMANA, nunca en las dos. En el panel son **filtros**, y un filtro responde otra pregunta. Quien toca "Esta semana" quiere ver su semana completa para planear, y esconderle justo lo que vence hoy sería absurdo. |
| D16 | Orden: del más cercano al más lejano; las vencidas van al final, de la más reciente a la más vieja. Las entregadas no aparecen. | En el Figma la vencida aparece al final. Un aviso de algo ya entregado ya no pide ninguna acción. |
| D17 | El filtro activo se guarda en la URL (`?filtro=hoy`, `?filtro=semana`). | Así cada vista se puede compartir como liga, igual que las tres pantallas. |
| D18 | Cada aviso vencido se ve en gris (punto gris y título gris) y su texto dice "venció hace N días". | Viene de la especificación, sección 6.2. El texto evita que el gris sea la única señal. |
| D19 | El botón "Ver tarea" está a la izquierda y la etiqueta de tipo a su derecha, en la misma fila. | Así se aprovecha la fila del botón en vez de agregar una línea más a cada aviso. |

## Persistencia y prueba de usabilidad

| # | Decisión | Por qué |
|---|---|---|
| D20 | En `localStorage` (clave `panel-pendientes:v1`) solo se guardan las entregas y los recordatorios, **por id fijo de tarea** (los ids están escritos a mano en `src/data/tasks.ts`). Las fechas no se guardan. | Las fechas se recalculan cada vez que se abre la app, relativas a "ahora". Si se guardaran o si los ids se generaran al vuelo, se perdería el estado al cambiar de día. Hay una prueba automática que activa un recordatorio, entrega otra tarea, cierra la pestaña, adelanta el reloj un día y comprueba que todo se conservó. |
| D21 | **Reinicio discreto** entre participantes: abrir la app con `?reset` en la liga, o mantener presionado el contador del tablero por ~0.8 s. Aparece la confirmación "Listo, empezamos de cero". | En la prueba de usabilidad varios estudiantes van a usar el mismo celular y cada uno debe empezar sin las entregas del anterior. No hay un botón visible, para no contaminar las capturas ni distraer a los participantes. |
| D22 | La hora se puede simular con `?ahora=2026-11-25T10:00` (hora CDMX) y regresar a la real con `?ahora=real`. Solo dura mientras la pestaña está abierta. | Sirve para demostrar en la presentación el criterio de aceptación 2 (las tareas cambian de grupo según la hora) sin tocar el reloj del celular. Las fechas relativas se mueven junto con la hora simulada; la única que no se mueve es el proyecto final (26 nov), así que esa es la que se ve cambiar de grupo. |
| D23 | La hora se refresca cada 30 s y al volver a la pestaña. | Así, si la app se deja abierta, una tarea pasa de "Hoy" a "Vencidas" sin recargar. |
| D24 | Si el momento de un recordatorio ya pasó (por ejemplo, "24 h antes" cuando faltan 3 h), el botón se desactiva y dice "Ya pasó". Los recordatorios se ocultan en tareas vencidas o entregadas. | No tiene sentido programar un aviso en el pasado, y decirlo con texto evita que el botón parezca roto. |
| D25 | "Añadir entrega" muestra la confirmación "Entrega añadida…" y deja un enlace pequeño de "Deshacer entrega (demo)". | Permite repetir la demostración sin reiniciar todo. Es una simulación: no se sube ningún archivo. |
| D26 | Los recordatorios no lanzan notificaciones reales; solo se guarda la preferencia y se confirma la hora a la que sonarían. | Las notificaciones push quedan fuera de la versión 1 (sección 4 de la especificación) y requerirían permisos y un servidor. |
| D27 | Las transiciones duran 200 ms (desvanecer) en las pantallas principales y 220 ms (deslizar desde la derecha) al entrar al detalle; los cambios de color duran 150 ms. Con `prefers-reduced-motion` se apagan todas. | Siguen el rango de 150 a 250 ms del design system. |

## Hora y zona horaria

| # | Decisión | Por qué |
|---|---|---|
| D28 | Todo se calcula en la zona `America/Mexico_City` (UTC−06:00 fijo, porque México ya no cambia de horario) aunque el dispositivo esté en otra zona. | Es la zona del modelo de datos. "Hoy" y "mañana" son días de calendario de la CDMX, no bloques de 24 h. |
| D29 | "Ejercicios de estadística" vence dentro de ~3 h, redondeado a la siguiente media hora. Si eso cruza la medianoche, se queda hoy a las 23:59. | Así siempre cae en HOY y se lee limpio ("vence hoy 15:30"). Entre las 23:49 y las 23:59 puede caer en otro grupo; es un caso aceptable para un prototipo. |
| D30 | Para los datos de ejemplo se usa un archivo TypeScript (`src/data/tasks.ts`) y no un JSON. | Un JSON no puede calcular fechas relativas a "ahora". El archivo trae instrucciones para editarlo. |
