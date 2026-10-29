import { useEffect, useState } from 'react';

/**
 * Hora actual que se refresca cada 30 s y al volver a la pestaña, para que
 * las tareas cambien de grupo sin recargar (criterio de aceptación 2).
 *
 * Para la demo se puede simular otra hora con `?ahora=2026-11-25T10:00`
 * (hora de CDMX). Se guarda en sessionStorage; `?ahora=real` la quita.
 */
const KEY = 'panel-pendientes:ahora';

function readOffset(): number {
  try {
    const param = new URLSearchParams(window.location.search).get('ahora');
    if (param === 'real') sessionStorage.removeItem(KEY);
    else if (param) {
      const target = Date.parse(/[zZ]|[+-]\d\d:\d\d$/.test(param) ? param : `${param}-06:00`);
      if (!Number.isNaN(target)) sessionStorage.setItem(KEY, String(target - Date.now()));
    }
    return Number(sessionStorage.getItem(KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

const offset = typeof window === 'undefined' ? 0 : readOffset();
export const isSimulatedTime = offset !== 0;
export const currentTime = () => new Date(Date.now() + offset);

export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(currentTime);
  useEffect(() => {
    const tick = () => setNow(currentTime());
    const id = window.setInterval(tick, intervalMs);
    const onVisible = () => document.visibilityState === 'visible' && tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalMs]);
  return now;
}
