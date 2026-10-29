import type { Task, TaskType } from './types';

/** Zona horaria del modelo de datos. */
export const TIME_ZONE = 'America/Mexico_City';
/** México ya no tiene horario de verano (desde 2022): siempre UTC-06:00. */
export const MX_OFFSET = '-06:00';

export type Urgency = 'hoy' | 'semana' | 'despues' | 'vencida' | 'entregada';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

type ZonedParts = { year: number; month: number; day: number; hour: number; minute: number };

/** Fecha y hora de pared en la Ciudad de México. */
export function zonedParts(date: Date): ZonedParts {
  const out: Record<string, number> = {};
  for (const p of partsFormatter.formatToParts(date)) {
    if (p.type !== 'literal') out[p.type] = Number(p.value);
  }
  return { year: out.year, month: out.month, day: out.day, hour: out.hour % 24, minute: out.minute };
}

function dayNumber(date: Date): number {
  const { year, month, day } = zonedParts(date);
  return Date.UTC(year, month - 1, day) / DAY;
}

/** Días de calendario (CDMX) de `from` a `to`. Mañana = 1 aunque falten 2 horas. */
export function calendarDaysBetween(from: Date, to: Date): number {
  return dayNumber(to) - dayNumber(from);
}

/** Crea una fecha a cierta hora de pared en CDMX, `addDays` días después de `base`. */
export function mxDateAt(base: Date, addDays: number, hour: number, minute = 0): Date {
  const { year, month, day } = zonedParts(base);
  const d = new Date(Date.UTC(year, month - 1, day + addDays));
  const pad = (n: number) => String(n).padStart(2, '0');
  return new Date(
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(hour)}:${pad(minute)}:00${MX_OFFSET}`,
  );
}

type Dueable = Pick<Task, 'dueAt' | 'submitted'>;

/** Reglas de docs/01-PRODUCT-SPEC.md, sección 7. */
export function getUrgency(task: Dueable, now: Date): Urgency {
  if (task.submitted) return 'entregada';
  const due = new Date(task.dueAt);
  if (due.getTime() <= now.getTime()) return 'vencida';
  const days = calendarDaysBetween(now, due);
  if (days <= 0) return 'hoy';
  if (days <= 7) return 'semana';
  return 'despues';
}

export function formatTime(date: Date): string {
  const { hour, minute } = zonedParts(date);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** "26 nov" */
export function formatShortDate(date: Date): string {
  const { month, day } = zonedParts(date);
  return `${day} ${MONTHS[month - 1]}`;
}

/** "jue 26 nov" */
export function formatWeekdayDate(date: Date): string {
  const { year, month, day } = zonedParts(date);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return `${WEEKDAYS[weekday]} ${day} ${MONTHS[month - 1]}`;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function overdueText(due: Date, now: Date): string {
  const days = calendarDaysBetween(due, now);
  if (days >= 2) return `venció hace ${days} días`;
  if (days === 1) return `venció ayer ${formatTime(due)}`;
  const ms = now.getTime() - due.getTime();
  if (ms >= HOUR) return `venció hace ${plural(Math.floor(ms / HOUR), 'hora', 'horas')}`;
  return `venció hace ${Math.max(1, Math.floor(ms / MINUTE))} min`;
}

/** Texto corto de tarjetas y avisos: "vence hoy 11:00", "vence en 3 días", "vence 26 nov"… */
export function relativeDueText(task: Dueable, now: Date): string {
  const due = new Date(task.dueAt);
  const urgency = getUrgency(task, now);
  if (urgency === 'entregada') return 'entregada';
  if (urgency === 'vencida') return overdueText(due, now);

  const ms = due.getTime() - now.getTime();
  if (ms < HOUR) return `vence en ${Math.max(1, Math.ceil(ms / MINUTE))} min`;
  const days = calendarDaysBetween(now, due);
  if (days === 0) return `vence hoy ${formatTime(due)}`;
  if (days === 1) return `vence mañana ${formatTime(due)}`;
  if (days <= 7) return `vence en ${days} días`;
  return `vence ${formatShortDate(due)}`;
}

/** Texto de la píldora del detalle: lo primero que se lee es la hora límite. */
export function duePillText(task: Dueable, now: Date): string {
  const due = new Date(task.dueAt);
  const urgency = getUrgency(task, now);
  if (urgency === 'entregada') return 'Entregada';
  if (urgency === 'vencida') {
    const t = overdueText(due, now);
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  const ms = due.getTime() - now.getTime();
  const time = formatTime(due);
  if (ms < HOUR) return `Vence en ${Math.max(1, Math.ceil(ms / MINUTE))} min · ${time}`;
  const days = calendarDaysBetween(now, due);
  if (days === 0) return `Vence hoy · ${time}`;
  if (days === 1) return `Vence mañana · ${time}`;
  return `Vence ${formatWeekdayDate(due)} · ${time}`;
}

/** "Tiempo restante" del cuadro de estado: "3 horas", "45 minutos", "3 días"… */
export function timeRemainingText(task: Dueable, now: Date): string {
  const due = new Date(task.dueAt);
  const urgency = getUrgency(task, now);
  if (urgency === 'entregada') return 'Ya entregaste';
  if (urgency === 'vencida') return 'Se acabó el tiempo';
  const ms = due.getTime() - now.getTime();
  if (ms < HOUR) return plural(Math.max(1, Math.ceil(ms / MINUTE)), 'minuto', 'minutos');
  if (ms < DAY) return plural(Math.floor(ms / HOUR), 'hora', 'horas');
  return plural(Math.floor(ms / DAY), 'día', 'días');
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  hoy: 'Hoy',
  semana: 'Esta semana',
  despues: 'Después',
  vencida: 'Vencidas',
  entregada: 'Entregada',
};

export const TYPE_LABEL: Record<TaskType, string> = {
  cuestionario: 'Cuestionario',
  archivo: 'Subir archivo',
};

const byDueAsc = (a: Task, b: Task) => Date.parse(a.dueAt) - Date.parse(b.dueAt);
const byDueDesc = (a: Task, b: Task) => Date.parse(b.dueAt) - Date.parse(a.dueAt);

export type BoardGroups = Record<'hoy' | 'semana' | 'despues' | 'vencida', Task[]>;

/** Agrupa pendientes para el tablero. Las entregadas salen de los grupos. */
export function groupTasks(tasks: Task[], now: Date): BoardGroups {
  const groups: BoardGroups = { hoy: [], semana: [], despues: [], vencida: [] };
  for (const t of tasks) {
    const u = getUrgency(t, now);
    if (u !== 'entregada') groups[u].push(t);
  }
  groups.hoy.sort(byDueAsc);
  groups.semana.sort(byDueAsc);
  groups.despues.sort(byDueAsc);
  groups.vencida.sort(byDueDesc); // la que venció más recientemente primero
  return groups;
}

export type NoticeFilter = 'todas' | 'hoy' | 'semana';

/**
 * Avisos del panel, del más cercano al más lejano; las vencidas van al final.
 * "Esta semana" = lo que vence en los próximos 7 días (incluye hoy).
 */
export function filterNotices(tasks: Task[], filter: NoticeFilter, now: Date): Task[] {
  const g = groupTasks(tasks, now);
  if (filter === 'hoy') return g.hoy;
  if (filter === 'semana') return [...g.hoy, ...g.semana];
  return [...g.hoy, ...g.semana, ...g.despues, ...g.vencida];
}

/** ¿Ya pasó el momento de un recordatorio de `hoursBefore` horas? */
export function isReminderPast(task: Pick<Task, 'dueAt'>, hoursBefore: number, now: Date): boolean {
  return Date.parse(task.dueAt) - hoursBefore * HOUR <= now.getTime();
}
