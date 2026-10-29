# Panel de pendientes por urgencia (prototipo LMS)

Lee este archivo primero. Después lee, en este orden: `docs/01-PRODUCT-SPEC.md`, `docs/02-DESIGN-SYSTEM.md`, `docs/03-RESEARCH.md`, `docs/04-ROADMAP.md`. Las capturas de Figma están en `assets/`.

## Qué es
Prototipo web interactivo, móvil primero, que simula cómo se vería dentro de Moodle un **panel de pendientes ordenados por urgencia real** (Hoy / Esta semana / Después). **No** es un plugin de Moodle ni se conecta a Moodle: usa datos de ejemplo.

Es el proyecto integrador individual de Gustavo Ahmed Lombardini Manuel (cuenta 200877), materia Tecnologías Digitales (LIIS2102), Ibero Puebla. Título: "Rediseño de notificaciones en plataformas LMS: hacia una reducción de la sobrecarga cognitiva y la procrastinación académica".

## Reglas para trabajar
- Sigue las pantallas de `assets/` y `docs/02-DESIGN-SYSTEM.md`. Si algo no está definido, elige lo más simple y anótalo en `DECISIONS.md` (créalo).
- Sin backend, sin login real, sin llamadas a Moodle. Datos de ejemplo en un archivo JSON local; estado de recordatorios en `localStorage`.
- Todo el texto de la interfaz va en **español de México**, claro y corto.
- El color nunca va solo: siempre acompaña a un texto (accesibilidad).
- Antes de dar algo por terminado, ábrelo en un navegador con ancho de celular (390 px) y revisa que se vea igual que las capturas.
- Lo marcado como **PROPUESTA** en los docs no lo aprobó Gustavo todavía; impleméntalo, pero déjalo fácil de quitar.

## Stack sugerido (no lo decidió Gustavo; cámbialo si hay una razón)
Vite + React + TypeScript + Tailwind, sin librerías pesadas, desplegable como sitio estático (Vercel o GitHub Pages). Debe correr con `npm install && npm run dev`.

## Criterio de éxito
Que Gustavo pueda abrir la liga en su celular, recorrer el flujo Tablero > Avisos > Detalle y mostrarlo en la presentación del 12 de noviembre, y que después otros estudiantes puedan usarlo en una prueba de usabilidad.
