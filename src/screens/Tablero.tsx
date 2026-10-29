import { useRef } from 'react';
import { FEATURES } from '../config/features';
import { TaskCard } from '../components/TaskCard';
import { ScreenHeader } from '../components/ScreenHeader';
import type { Task } from '../lib/types';
import { groupTasks } from '../lib/urgency';
import { URGENCY_STYLE } from '../lib/urgencyStyle';
import { useTasks } from '../state/TasksContext';
import { useToast } from '../state/Toast';

const GROUPS = [
  { key: 'hoy', label: 'Hoy' },
  { key: 'semana', label: 'Esta semana' },
  { key: 'despues', label: 'Después' },
  { key: 'vencida', label: 'Vencidas' }, // PROPUESTA: FEATURES.grupoVencidas
] as const;

export function Tablero() {
  const { tasks, now } = useTasks();
  const groups = groupTasks(tasks, now);
  // Todo lo no entregado cuenta, vencidas incluidas: también son pendientes (y las más urgentes).
  const pending = groups.hoy.length + groups.semana.length + groups.despues.length + groups.vencida.length;
  const visible = GROUPS.filter((g) => g.key !== 'vencida' || FEATURES.grupoVencidas);
  const empty = visible.every((g) => groups[g.key].length === 0);

  return (
    <>
      <ScreenHeader
        title="Mis pendientes"
        right={
          <PendingCounter count={pending} />
        }
      />
      <main className="flex flex-col gap-6 px-5 pt-6 pb-4">
        {empty && <p className="py-10 text-center text-ink-2">No tienes pendientes. ¡Vas al día!</p>}
        {visible.map(({ key, label }) => (
          <Group key={key} label={label} heading={URGENCY_STYLE[key].heading} tasks={groups[key]} now={now} />
        ))}
      </main>
    </>
  );
}

function Group({ label, heading, tasks, now }: { label: string; heading: string; tasks: Task[]; now: Date }) {
  if (tasks.length === 0) return null; // un grupo sin elementos no se muestra
  return (
    <section aria-label={`${label}: ${tasks.length}`}>
      <h2 className={`mb-2 text-[15px] font-bold tracking-wide uppercase ${heading}`}>{label}</h2>
      <ul className="flex flex-col gap-3">
        {tasks.map((t) => (
          <li key={t.id}>
            <TaskCard task={t} now={now} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Contador circular. Toque largo (~0.8 s) = reiniciar la demo entre
 * participantes de la prueba de usabilidad (también: `?reset` en la liga).
 */
function PendingCounter({ count }: { count: number }) {
  const { resetDemo } = useTasks();
  const toast = useToast();
  const timer = useRef<number>(undefined);
  const start = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      resetDemo();
      toast('Listo, empezamos de cero.');
    }, 800);
  };
  const cancel = () => window.clearTimeout(timer.current);
  return (
    <span
      className="flex size-9 touch-none items-center justify-center rounded-full bg-[#6b7280] text-[15px] font-bold text-white select-none [-webkit-touch-callout:none]"
      aria-label={`${count} pendientes sin entregar`}
      role="img"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {count}
    </span>
  );
}
