# 03 · Investigación con usuarios y decisiones que salieron de ella

## Qué se hizo
- **Encuesta digital** (Google Forms, 11 preguntas, anónima): **14 respuestas** (la meta era 15 a 20).
- **2 entrevistas semiestructuradas** de 7 preguntas.
- **Guion de grupo focal** con tarjeta de concepto: diseñado, **no aplicado**.
- Datos importados al Gemini Notebook del proyecto (5 fuentes) y analizados ahí.

**Limitaciones:** muestra por conveniencia (grupos de clase), mayoría de 5.º semestre; nadie marcó el celular como dispositivo principal en la encuesta aunque la Entrevista 2 es 100% celular; son pocas respuestas para generalizar. Son una guía de diseño, no una conclusión final.

## Perfil de la muestra de la encuesta
8 de 5.º semestre, 3 de 9.º, 1 de 3.º, 1 de 7.º, 1 sin dato. Promedio de 4.2 cursos activos. Dispositivo: 8 laptop o computadora, 6 ambos por igual, 0 solo celular. Revisión de Moodle: 8 una vez al día o menos, 4 de 2 a 3 veces, 2 de 4 a 6, 0 más de 6.

## Resultados (n = 14)
Canales para enterarse (varias opciones): compañero 7 (50%), reviso a mano 6 (42.9%), el profe lo dice en clase 5 (35.7%), correo 4 (28.6%), push de la app 3 (21.4%).

Escala 1 a 5:
| Pregunta | Distribución 1 a 5 | Media | Dato |
|---|---|---|---|
| P6 Las notificaciones dicen claro qué tarea y qué curso | 1, 3, 3, 4, 3 | 3.36 | 50% de acuerdo (4 o 5) |
| P7 Distinguen lo urgente de lo que no | 5, 3, 4, 2, 0 | 2.21 | 57.1% en desacuerdo; nadie marcó 5 |
| P8 Olvidé o entregué tarde por no ver una notificación | 1, 1, 4, 6, 2 | 3.50 | 57.1% marcó 4 o 5 |
| P9 Es fácil ver de un vistazo mis pendientes urgentes | 0, 3, 1, 7, 3 | 3.71 | 71.4% marcó 4 o 5 |
| P10 Me sería útil un panel por urgencia real | 0, 1, 1, 4, 8 | 4.36 | 85.7% marcó 4 o 5 |

Comentarios abiertos: "La barra de archivos de las materias, luego cuesta encontrar los archivos"; "Notificaciones cada que se publique una tarea"; "Nunca me llegan las notificaciones me gustaría que me avisara"; "Quitar que los profesores puedan quitar notificaciones"; "No tengo idea".

## Entrevistas (resumen)
**Entrevista 1:** Diseño de Interacción y Animación, 5.º semestre, 6 cursos, laptop. Se entera por el profesor o abriendo la línea de tiempo por la tarde; no confía en que Moodle avise solo. Pasa a mano cada lunes las entregas a Notion ("doble chamba"). Borró la app móvil (no cargaba, cerraba sesión). Perdió una entrega porque el profesor cambió la fecha a viernes 2:00 pm sin avisar. Quiere ver materia, tarea y tiempo restante; cambiaría: alertas automáticas 24 h y 2 h antes. Dato extra: muchos profesores suben la tarea dentro de un PDF y no crean actividad con fecha, así que no sale en el calendario.

**Entrevista 2:** Ingeniería Industrial, 3.er semestre, 7 cursos, navegador del celular. "El 80% de las veces me entero por mis amigos." La campanita mezcla todo ("todo es texto gris"). Perdió un cuestionario que cerraba a media noche porque ninguna alerta sonó. Quiere la hora límite en grande, el tipo de entrega y un enlace directo; cambiaría: widget en la pantalla de inicio con las próximas tres entregas y un contador de horas. Dato extra: los nombres de materia salen con la clave larga y en el celular se cortan.

Frases fuertes: "Si yo no entro a buscar activamente qué hay, ni en cuenta." · "Te avisa de todo menos de lo que importa." · "Todo se ve igual, todo es texto gris." · "Simplemente de ningún lado me pitó el celular para acordarme."

## Hallazgos y decisiones de diseño
1. **La urgencia debe verse, no leerse. (Confirma)** P7 media 2.21 y P10 media 4.36 > se mantiene el agrupado Hoy / Esta semana / Después con color y texto.
2. **Un solo recordatorio no alcanza. (Modifica)** Los olvidos vienen de avisos que no llegan (P8, Entrevista 2). > cambiar "Recordarme en 1 hora" por recordatorios escalonados de 24 h y 2 h.
3. **La tarjeta debe decir qué es, de qué materia y cuándo cierra. (Modifica)** > mostrar nombre corto de materia (sin clave larga) y tipo de entrega (cuestionario o archivo) en la tarjeta.
4. **Ver la lista no es lo difícil; lo difícil es que el aviso llegue con datos claros.** P9 alto (71.4%) pero P6 solo 50% y P7 bajo > el valor del panel está en quitar la "doble chamba" y en que cada tarjeta traiga materia, tarea y hora límite legibles. Por validar con grupo focal por qué P9 salió alto.
5. **Trabajo futuro (fuera de la versión 1):** 50% se entera por un compañero y solo 21.4% por push, así que el panel idealmente tendría que vivir donde ya miran (pantalla de bloqueo, widget, WhatsApp).
