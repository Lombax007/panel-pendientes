import type { Reminders, Task } from './types';

/**
 * Lo único que se guarda: entregas y recordatorios, por id FIJO de tarea.
 * Las fechas no se guardan (se recalculan al abrir), así el estado
 * sobrevive aunque cambie el día.
 */
export type Saved = Record<string, { submitted?: boolean; reminders?: Partial<Reminders> }>;

export const STORAGE_KEY = 'panel-pendientes:v1';

export function applySaved(base: Task[], saved: Saved): Task[] {
  return base.map((t) => {
    const s = saved[t.id];
    return s ? { ...t, submitted: s.submitted ?? t.submitted, reminders: { ...t.reminders, ...s.reminders } } : t;
  });
}

/** Lee lo guardado. Con `?reset` en la liga, borra todo y quita el parámetro. */
export function loadSaved(): Saved {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('reset')) {
      localStorage.removeItem(STORAGE_KEY);
      url.searchParams.delete('reset');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      return {};
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Saved;
  } catch {
    return {};
  }
}

export function storeSaved(data: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* modo privado o almacenamiento lleno: la demo sigue funcionando sin guardar */
  }
}
