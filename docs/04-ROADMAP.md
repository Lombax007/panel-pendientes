# 04 · Plan, restricciones y pendientes

## Contexto académico
Materia Tecnologías Digitales (LIIS2102), Ibero Puebla, otoño 2026. Proyecto individual. Clases los jueves de 11:00 a 13:00, salón G102. La entrega final del proyecto es el **26 de noviembre de 2026**. Entregar tarde resta 1 punto por día natural.

## Fechas que importan para la app
| Fecha | Qué pasa |
|---|---|
| 29 oct a 5 nov | Wireframes v2 y mockup con paleta de color justificada |
| 29 oct a 12 nov | **Construir el prototipo funcional** (esta app) |
| 12 nov | **Presentación del prototipo al grupo** y retroalimentación |
| 12 a 26 nov | Prueba de usabilidad con estudiantes e integración de resultados |
| 26 nov | Entrega final del proyecto |

## Orden de construcción sugerido
1. Proyecto base, datos de ejemplo y cálculo de urgencia (con pruebas del cálculo).
2. Tablero con grupos, tarjetas y barra inferior.
3. Detalle de tarea y navegación hacia atrás.
4. Panel de avisos con filtros.
5. Recordatorios 24 h y 2 h, "Añadir entrega" y persistencia en `localStorage`.
6. Pulido: transiciones, accesibilidad, revisión a 390 px, despliegue con liga pública.

## Preguntas abiertas para Gustavo
- ¿Se va a usar el nombre y estilo de Moodle/Ibero o un estilo neutro? (Por ahora, neutro, como el Figma.)
- ¿Prefiere hospedarlo en Vercel o GitHub Pages?
- ¿Se quiere medir tiempos en la prueba de usabilidad o basta con observación?
- ¿Se agrega el grupo "Vencidas" aunque no esté en el Figma?

## Decisiones ya tomadas
- Es un prototipo web, no un plugin de Moodle ni una app nativa.
- Datos simulados; sin backend.
- Móvil primero.
- Español de México.
- Los recordatorios de 24 h y 2 h reemplazan al de 1 hora.
- La investigación fue real (14 encuestas y 2 entrevistas), no simulada.
