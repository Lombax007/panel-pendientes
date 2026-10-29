import type { Task } from '../lib/types';

/**
 * Lado "Antes" del comparativo: RECREACIÓN ILUSTRATIVA de la campanita de un
 * LMS genérico (no es captura de ninguna plataforma real). A propósito:
 * - ordenada por fecha de publicación, no por urgencia;
 * - sin fecha límite visible;
 * - mezclada con ruido (calificaciones viejas, foros, material);
 * - materia con la clave larga y cortada (Entrevista 2).
 */
export type BeforeNotice = { id: string; text: string; course: string; publishedAt: Date };

/** Claves largas de ejemplo, como salen en el LMS. Solo LIIS2102 es la clave real de la materia. */
const COURSE_CODES: Record<string, string> = {
  'Modelos de Pronóstico': 'ESTA2304-02-2026O-Modelos de Pronóstico',
  'Narrativas Corporales': 'ARTE1107-01-2026O-Narrativas Corporales',
  'Estudio del Trabajo': 'INIA2203-03-2026O-Estudio del Trabajo',
  'Tecnologías Digitales': 'LIIS2102-01-2026O-Tecnologías Digitales',
};

/** Corta como en el celular: "LIIS2102-01-2026O-Tecnologías Di..." */
export const cutCourse = (name: string, max = 32) => {
  const long = COURSE_CODES[name] ?? name;
  return long.length > max ? `${long.slice(0, max)}...` : long;
};

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** Cuándo se publicó el aviso de cada tarea y qué decía (sin fecha límite). */
const TASK_NOTICES: Record<string, { ago: number; text: (t: Task) => string }> = {
  'unidad-4': { ago: 0.5 * HOUR, text: (t) => `Se ha añadido una nueva actividad: ${t.title}` },
  'medicion-tiempos': { ago: 6 * HOUR, text: () => 'Recordatorio de entrega' },
  'cuestionario-unidad': { ago: 26 * HOUR, text: (t) => `Se ha añadido una nueva actividad: ${t.title}` },
  'escala-redondeo': { ago: 2 * DAY + 5 * HOUR, text: (t) => `Se ha añadido una nueva actividad: ${t.title}` },
  'proyecto-final': { ago: 3 * DAY, text: () => 'Recordatorio de entrega' },
  'lectura-cuerpo': { ago: 4 * DAY, text: () => 'Recordatorio de entrega' },
  // La que vence en ~3 horas se publicó hace casi dos semanas: queda hasta abajo.
  estadistica: { ago: 12 * DAY, text: (t) => `Se ha añadido una nueva actividad: ${t.title}` },
  'diagramas-flujo': { ago: 16 * DAY, text: (t) => `Se ha añadido una nueva actividad: ${t.title}` },
};

/** Ruido real de LMS que se mezcla con las tareas. */
const NOISE = [
  { id: 'foro-dudas', ago: 10 * 60_000, course: 'Estudio del Trabajo', text: 'Nuevo mensaje en el foro: Dudas generales' },
  { id: 'material', ago: 5 * HOUR, course: 'Modelos de Pronóstico', text: 'El profesor ha subido un nuevo archivo: Presentación semana 9.pdf' },
  { id: 'foro-avisos', ago: 2 * DAY + 3 * HOUR, course: 'Tecnologías Digitales', text: 'Nuevo mensaje en el foro: Avisos del curso' },
  { id: 'calif-practica', ago: 8 * DAY, course: 'Estudio del Trabajo', text: 'Tu calificación ha sido publicada: Práctica 2' },
  { id: 'calif-mapa', ago: 21 * DAY, course: 'Narrativas Corporales', text: 'Tu calificación ha sido publicada: Mapa conceptual de la unidad 1' },
];

/** Avisos del "Antes", del más reciente al más viejo (orden de publicación). */
export function buildBeforeNotices(tasks: Task[], openedAt: Date): BeforeNotice[] {
  const at = (ago: number) => new Date(openedAt.getTime() - ago);
  const fromTasks = tasks
    .filter((t) => TASK_NOTICES[t.id])
    .map((t) => ({ id: t.id, text: TASK_NOTICES[t.id].text(t), course: t.course, publishedAt: at(TASK_NOTICES[t.id].ago) }));
  const noise = NOISE.map((n) => ({ id: n.id, text: n.text, course: n.course, publishedAt: at(n.ago) }));
  return [...fromTasks, ...noise].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

/** "hace 10 minutos", "hace 5 horas", "hace 2 días", "hace 3 semanas". */
export function publishedAgo(date: Date, now: Date): string {
  const ms = Math.max(0, now.getTime() - date.getTime());
  const n = (v: number, one: string, many: string) => `hace ${v} ${v === 1 ? one : many}`;
  if (ms < HOUR) return n(Math.max(1, Math.round(ms / 60_000)), 'minuto', 'minutos');
  if (ms < DAY) return n(Math.floor(ms / HOUR), 'hora', 'horas');
  if (ms < 14 * DAY) return n(Math.floor(ms / DAY), 'día', 'días');
  return n(Math.floor(ms / (7 * DAY)), 'semana', 'semanas');
}
