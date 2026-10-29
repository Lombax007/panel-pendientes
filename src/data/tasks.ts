import type { Task } from '../lib/types';
import { MX_OFFSET, mxDateAt } from '../lib/urgency';

/**
 * DATOS DE EJEMPLO
 * ----------------
 * Las fechas se calculan relativas a "ahora" para que el tablero siempre
 * muestre Hoy / Esta semana / Después, sin importar qué día se abra.
 *
 * Formas de escribir `due`:
 *   { inHours: 3 }                      → dentro de ~3 horas (sin pasarse de hoy)
 *   { days: 3, at: '18:00' }            → en 3 días a las 18:00 (hora CDMX)
 *   { days: -9, at: '23:59' }           → hace 9 días (vencida)
 *   { fixed: '2026-11-26T23:59' }       → fecha fija (hora CDMX)
 */
type DueSpec = { inHours: number } | { days: number; at: string } | { fixed: string };

type SeedTask = Omit<Task, 'dueAt' | 'submitted' | 'grade' | 'reminders'> & {
  due: DueSpec;
  submitted?: boolean;
  grade?: string | null;
};

export const SEED_TASKS: SeedTask[] = [
  {
    id: 'estadistica',
    title: 'Ejercicios de estadística',
    course: 'Modelos de Pronóstico',
    type: 'archivo',
    due: { inHours: 3 },
    description:
      'Resuelve los ejercicios 1 a 8 del capítulo 4 (medias móviles y suavizamiento exponencial). Sube un solo PDF con tu procedimiento.',
  },
  {
    id: 'lectura-cuerpo',
    title: 'Cuestionario de lectura: el cuerpo en escena',
    course: 'Narrativas Corporales',
    type: 'cuestionario',
    due: { days: 0, at: '23:59' },
    description:
      '10 preguntas de opción múltiple sobre la lectura de la semana. Tienes un solo intento de 20 minutos.',
  },
  {
    id: 'cuestionario-unidad',
    title: 'Cuestionario rápido de unidad',
    course: 'Modelos de Pronóstico',
    type: 'cuestionario',
    due: { days: 1, at: '23:59' },
    description:
      'Repaso de la unidad 3: series de tiempo y tendencia. 8 preguntas, 15 minutos, un intento.',
  },
  {
    id: 'escala-redondeo',
    title: 'Escala y redondeo de calificaciones',
    course: 'Narrativas Corporales',
    type: 'archivo',
    due: { days: 3, at: '18:00' },
    description:
      'Propón una escala de evaluación para tu ejercicio escénico y explica cómo redondearías las calificaciones. Máximo 2 cuartillas.',
  },
  {
    id: 'medicion-tiempos',
    title: 'Reporte de medición de tiempos',
    course: 'Estudio del Trabajo',
    type: 'archivo',
    due: { days: 5, at: '13:00' },
    description:
      'Cronometra 10 ciclos de una operación de tu elección y entrega la hoja de cálculo con el tiempo estándar.',
  },
  {
    id: 'unidad-4',
    title: 'Cuestionario de la unidad 4',
    course: 'Tecnologías Digitales',
    type: 'cuestionario',
    due: { days: 12, at: '23:59' },
    description: 'Preguntas sobre experiencia de usuario y carga cognitiva. 12 preguntas, 25 minutos.',
  },
  {
    id: 'proyecto-final',
    title: 'Entrega del proyecto final',
    course: 'Tecnologías Digitales',
    type: 'archivo',
    due: { fixed: '2026-11-26T23:59' },
    description:
      'Sube el documento final del proyecto integrador con la liga al prototipo y los resultados de la prueba de usabilidad. Cada día de retraso resta 1 punto.',
  },
  {
    id: 'diagramas-flujo',
    title: 'Diagramas de flujo del proceso',
    course: 'Estudio del Trabajo',
    type: 'archivo',
    due: { days: -9, at: '23:59' },
    description:
      'Elabora el diagrama de flujo y el diagrama de recorrido del proceso que observaste en la visita a planta.',
  },
];

const HALF_HOUR = 30 * 60_000;

function resolveDue(spec: DueSpec, now: Date): Date {
  if ('fixed' in spec) return new Date(`${spec.fixed}:00${MX_OFFSET}`);
  if ('inHours' in spec) {
    // Redondea a la siguiente media hora para que se lea limpio ("vence hoy 15:30"),
    // y si se pasa de medianoche lo deja hoy a las 23:59 para que siga en "Hoy".
    const target = new Date(Math.ceil((now.getTime() + spec.inHours * 3_600_000) / HALF_HOUR) * HALF_HOUR);
    const endOfToday = mxDateAt(now, 0, 23, 59);
    return target > endOfToday ? endOfToday : target;
  }
  const [h, m] = spec.at.split(':').map(Number);
  return mxDateAt(now, spec.days, h, m);
}

/** Convierte las semillas en tareas con fechas ISO reales, relativas a `now`. */
export function buildSampleTasks(now: Date): Task[] {
  return SEED_TASKS.map(({ due, submitted = false, grade = null, ...rest }) => ({
    ...rest,
    dueAt: resolveDue(due, now).toISOString(),
    submitted,
    grade,
    reminders: { h24: false, h2: false },
  }));
}
