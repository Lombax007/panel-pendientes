import { TIME_STEPS, describeOffset } from '../lib/timeShift';
import { formatTime, formatWeekdayDate } from '../lib/urgency';
import { useTime } from '../state/TimeContext';
import { ClockIcon } from './Icons';

/**
 * Control de tiempo simulado del modo demo (solo con `?demo=1`).
 * Va fijo hasta arriba; si la hora está adelantada lo dice con texto y con
 * un fondo morado a rayas, que no se parece a ningún color de urgencia.
 */
export function DemoTimeBar() {
  const { demoEnabled, now, offsetMs, advanceBy, backToPresent } = useTime();
  if (!demoEnabled) return null;
  const shifted = offsetMs !== 0;
  const btn =
    'min-h-11 rounded-full border px-2 text-[13px] leading-tight font-semibold transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div
      data-demo-time
      role="region"
      aria-label="Control de tiempo simulado (modo demo)"
      className={`sticky top-0 z-40 text-white ${
        shifted ? 'bg-[repeating-linear-gradient(135deg,#5b21b6_0_14px,#4c1d95_14px_28px)]' : 'bg-[#3b3f4a]'
      }`}
    >
      <p className="mx-auto flex max-w-[480px] items-center gap-2 px-4 pt-2 text-[14px] leading-tight" aria-live="polite">
        <ClockIcon className="size-4 shrink-0" />
        {shifted ? (
          <span>
            <strong>Hora simulada:</strong> {formatWeekdayDate(now)}, {formatTime(now)}{' '}
            <span className="opacity-85">(+{describeOffset(offsetMs)}, no es la hora real)</span>
          </span>
        ) : (
          <span>
            <strong>Modo demo</strong> · hora real: {formatWeekdayDate(now)}, {formatTime(now)}
          </span>
        )}
      </p>
      <div className="mx-auto grid max-w-[480px] grid-cols-4 gap-1.5 px-3 pt-1.5 pb-2">
        {TIME_STEPS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => advanceBy(s.ms)}
            className={`${btn} border-white/60 bg-white/10 hover:bg-white/20`}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={backToPresent}
          disabled={!shifted}
          className={`${btn} border-white bg-white text-[#4c1d95] disabled:border-white/30 disabled:bg-transparent disabled:text-white/60`}
        >
          Volver al presente
        </button>
      </div>
    </div>
  );
}
