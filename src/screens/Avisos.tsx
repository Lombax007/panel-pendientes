import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ScreenHeader } from '../components/ScreenHeader';
import { TypeTag } from '../components/TypeTag';
import type { Task } from '../lib/types';
import { URGENCY_LABEL, filterNotices, getUrgency, relativeDueText, type NoticeFilter } from '../lib/urgency';
import { URGENCY_STYLE } from '../lib/urgencyStyle';
import { useTasks } from '../state/TasksContext';

const FILTERS: { key: NoticeFilter; label: string; empty: string }[] = [
  { key: 'todas', label: 'Todas', empty: 'No tienes avisos.' },
  { key: 'hoy', label: 'Hoy', empty: 'Nada vence hoy.' },
  { key: 'semana', label: 'Esta semana', empty: 'Nada vence en los próximos 7 días.' },
];

const focus = 'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--lms-accent)]';

export function Avisos() {
  const { tasks, now } = useTasks();
  // El filtro vive en la URL (?filtro=hoy) para poder compartir la liga.
  const [params, setParams] = useSearchParams();
  const current = FILTERS.find((f) => f.key === params.get('filtro')) ?? FILTERS[0];
  const notices = filterNotices(tasks, current.key, now);

  return (
    <>
      <ScreenHeader title="Avisos" />
      <main className="px-5 pt-5 pb-4">
        <div role="group" aria-label="Filtrar avisos" className="flex gap-2.5">
          {FILTERS.map((f) => {
            const active = f.key === current.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={active}
                onClick={() => setParams(f.key === 'todas' ? {} : { filtro: f.key }, { replace: true })}
                className={`h-11 rounded-full border px-5 text-[16px] transition-colors duration-150 ${focus} ${
                  active ? 'border-primary bg-primary font-bold text-white' : 'border-line bg-white text-ink'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {notices.length} avisos
        </p>
        {notices.length === 0 ? (
          <p className="py-12 text-center text-ink-2">{current.empty}</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {notices.map((t) => (
              <li key={t.id}>
                <Notice task={t} now={now} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

function Notice({ task, now }: { task: Task; now: Date }) {
  const location = useLocation();
  const urgency = getUrgency(task, now);
  const overdue = urgency === 'vencida';
  return (
    <article className="rounded-lg border border-line bg-card p-4">
      <h2 className={`flex items-start gap-2.5 text-[17px] leading-snug font-bold ${overdue ? 'text-ink-2' : 'text-ink'}`}>
        <span aria-hidden className={`mt-[5px] size-3.5 shrink-0 rounded-full ${URGENCY_STYLE[urgency].dot}`} />
        {task.title}
      </h2>
      <p className="mt-1 pl-6 text-[15px] leading-snug text-ink-2">
        <span className="sr-only">{overdue ? 'Vencida' : URGENCY_LABEL[urgency]}. </span>
        {task.course} · {relativeDueText(task, now)}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 pl-6">
        <Link
          to={`/tarea/${task.id}`}
          state={{ from: location.pathname + location.search }}
          aria-label={`Ver tarea: ${task.title}`}
          className={`inline-flex h-11 items-center rounded-lg border border-ink-2 bg-white px-6 text-[16px] text-ink transition-colors duration-150 active:bg-chrome ${focus}`}
        >
          Ver tarea
        </Link>
        <TypeTag type={task.type} />
      </div>
    </article>
  );
}
