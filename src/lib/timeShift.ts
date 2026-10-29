/**
 * Desfase de tiempo para el modo demo. Funciones puras: el módulo de urgencia
 * no sabe nada de esto; solo recibe la hora que se le pase.
 */
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export const TIME_STEPS = [
  { key: '3h', label: '+3 horas', ms: 3 * HOUR },
  { key: '1d', label: '+1 día', ms: DAY },
  { key: '1w', label: '+1 semana', ms: 7 * DAY },
] as const;

export const PRESENT = 0;

/** Hora que ve la app: la real más el desfase. */
export function shiftedNow(real: Date, offsetMs: number): Date {
  return new Date(real.getTime() + offsetMs);
}

export function advance(offsetMs: number, stepMs: number): number {
  return offsetMs + stepMs;
}

/** "1 día 3 h", "1 semana", "3 h"… para decir cuánto se adelantó. */
export function describeOffset(offsetMs: number): string {
  const weeks = Math.floor(offsetMs / (7 * DAY));
  const days = Math.floor((offsetMs % (7 * DAY)) / DAY);
  const hours = Math.round((offsetMs % DAY) / HOUR);
  const parts: string[] = [];
  if (weeks) parts.push(weeks === 1 ? '1 semana' : `${weeks} semanas`);
  if (days) parts.push(days === 1 ? '1 día' : `${days} días`);
  if (hours) parts.push(`${hours} h`);
  return parts.join(' ') || '0 h';
}
