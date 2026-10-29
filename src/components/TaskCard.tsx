import { Link, useLocation } from 'react-router-dom';
import type { Task } from '../lib/types';
import { URGENCY_LABEL, getUrgency, relativeDueText } from '../lib/urgency';
import { URGENCY_STYLE } from '../lib/urgencyStyle';
import { TypeTag } from './TypeTag';

/** Tarjeta del tablero: barra lateral de color + tarea + "Materia · vence …". */
export function TaskCard({ task, now }: { task: Task; now: Date }) {
  const location = useLocation();
  const urgency = getUrgency(task, now);
  return (
    <Link
      to={`/tarea/${task.id}`}
      state={{ from: location.pathname }}
      className="relative block overflow-hidden rounded-lg border border-line bg-card py-3 pr-4 pl-5 transition-colors duration-150 hover:bg-[#eceef1] active:bg-chrome focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--lms-accent)]"
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${URGENCY_STYLE[urgency].bar}`} />
      <span className="block text-[17px] leading-snug font-bold text-ink">{task.title}</span>
      <span className="mt-1 block text-[15px] leading-snug text-ink-2">
        <span className="sr-only">{URGENCY_LABEL[urgency]}. </span>
        {task.course} · {relativeDueText(task, now)}
      </span>
      <TypeTag type={task.type} className="mt-2" />
    </Link>
  );
}
