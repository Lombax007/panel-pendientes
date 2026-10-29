import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { FEATURES } from '../config/features';
import { PRESENT, advance, shiftedNow } from '../lib/timeShift';

/**
 * Hora de la app. Capa por encima del módulo de urgencia (que se queda puro):
 *
 *   hora real  (+ `?ahora=` opcional, ver D22)  (+ desfase del modo demo)
 *
 * Se refresca cada 30 s y al volver a la pestaña, para que las tareas cambien
 * de grupo sin recargar (criterio de aceptación 2).
 */
const KEY = 'panel-pendientes:ahora';

function readAhoraOffset(): number {
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

const ahoraOffset = typeof window === 'undefined' ? 0 : readAhoraOffset();
/** Hora "presente" (real, o la de `?ahora=`). No incluye el desfase del modo demo. */
export const currentTime = () => new Date(Date.now() + ahoraOffset);

/** El modo demo solo existe si la liga con la que se abrió la app trae `?demo=1`. */
const demoEnabled =
  FEATURES.modoDemoTiempo &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('demo') === '1';

type TimeCtx = {
  now: Date;
  /** Desfase del modo demo en ms (0 = presente). Vive solo en memoria. */
  offsetMs: number;
  demoEnabled: boolean;
  advanceBy: (ms: number) => void;
  backToPresent: () => void;
};

const TimeContext = createContext<TimeCtx | null>(null);

export function TimeProvider({ children, intervalMs = 30_000 }: { children: ReactNode; intervalMs?: number }) {
  const [real, setReal] = useState(currentTime);
  const [offsetMs, setOffsetMs] = useState(PRESENT);

  useEffect(() => {
    const tick = () => setReal(currentTime());
    const id = window.setInterval(tick, intervalMs);
    const onVisible = () => document.visibilityState === 'visible' && tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalMs]);

  const advanceBy = useCallback((ms: number) => {
    setReal(currentTime());
    setOffsetMs((o) => advance(o, ms));
  }, []);
  const backToPresent = useCallback(() => {
    setReal(currentTime());
    setOffsetMs(PRESENT);
  }, []);

  const value = useMemo(
    () => ({ now: shiftedNow(real, offsetMs), offsetMs, demoEnabled, advanceBy, backToPresent }),
    [real, offsetMs, advanceBy, backToPresent],
  );
  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
}

export function useTime(): TimeCtx {
  const ctx = useContext(TimeContext);
  if (!ctx) throw new Error('useTime debe usarse dentro de <TimeProvider>');
  return ctx;
}
