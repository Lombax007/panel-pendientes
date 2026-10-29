import { Link, useParams } from 'react-router-dom';
import { FEATURES } from '../config/features';
import { BackButton } from '../components/BackButton';
import { CheckIcon } from '../components/Icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { TypeTag } from '../components/TypeTag';
import type { Reminders, Task } from '../lib/types';
import {
  duePillText,
  formatTime,
  formatWeekdayDate,
  getUrgency,
  isReminderPast,
  timeRemainingText,
} from '../lib/urgency';
import { URGENCY_STYLE } from '../lib/urgencyStyle';
import { useTasks } from '../state/TasksContext';
import { useToast } from '../state/Toast';

export function Detalle() {
  const { id = '' } = useParams();
  const { getTask, now, setSubmitted } = useTasks();
  const toast = useToast();
  const task = getTask(id);

  if (!task) {
    return (
      <>
        <ScreenHeader title="Detalle de tarea" left={<BackButton />} />
        <main className="px-5 py-10 text-center">
          <p className="font-bold">No encontramos esa tarea.</p>
          <Link to="/" className="mt-3 inline-block underline">
            Ir a Mis pendientes
          </Link>
        </main>
      </>
    );
  }

  const urgency = getUrgency(task, now);
  const submit = () => {
    setSubmitted(task.id, true);
    toast('Entrega añadida. Ya no aparece en tus pendientes.');
  };
  const undo = () => {
    setSubmitted(task.id, false);
    toast('Entrega quitada. La tarea volvió a tus pendientes.');
  };

  return (
    <>
      <ScreenHeader title="Detalle de tarea" left={<BackButton />} />
      <main className="flex flex-col px-5 pt-5 pb-8">
        <h2 className="text-[26px] leading-tight font-bold text-ink">{task.title}</h2>
        <p className="mt-1 text-[17px] text-ink-2">{task.course}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[16px] font-bold ${URGENCY_STYLE[urgency].pill}`}
          >
            {urgency === 'entregada' && <CheckIcon className="mr-1.5 size-4" />}
            {duePillText(task, now)}
          </span>
          <TypeTag type={task.type} />
        </div>

        <p className="mt-5 text-[16px] leading-relaxed text-ink-2">{task.description}</p>

        <h3 className="mt-6 mb-2 text-[17px] font-bold text-ink">Estado de la entrega</h3>
        <dl className="rounded-lg border border-line bg-card px-4 py-3 text-[16px] leading-7 text-ink">
          <Row label="Estado" value={task.submitted ? 'Entregada' : 'Sin entrega'} />
          <Row label="Tiempo restante" value={timeRemainingText(task, now)} />
          <Row label="Calificación" value={task.grade ?? 'Sin calificar'} />
        </dl>

        <div className="mt-6 flex flex-col gap-3">
          {task.submitted ? (
            <>
              <p className="flex h-14 items-center justify-center gap-2 rounded-lg border-2 border-line bg-card text-[17px] font-bold text-ink">
                <CheckIcon className="size-5" /> Entregada
              </p>
              <button
                type="button"
                onClick={undo}
                className="mx-auto min-h-11 px-4 text-[15px] text-ink-2 underline underline-offset-2"
              >
                Deshacer entrega (demo)
              </button>
            </>
          ) : (
            <button type="button" onClick={submit} className={btnPrimary}>
              Añadir entrega
            </button>
          )}

          {urgency !== 'entregada' && urgency !== 'vencida' && <ReminderControls task={task} now={now} />}
        </div>
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <dt>{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}

const focus = 'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--lms-accent)]';
const btnPrimary = `h-14 w-full rounded-lg bg-primary text-[17px] font-bold text-white transition-opacity duration-150 active:opacity-85 ${focus}`;
const btnSecondary = `min-h-14 w-full rounded-lg border-2 border-primary bg-white px-3 text-[17px] font-bold text-ink transition-colors duration-150 ${focus}`;

/** Momento en que sonaría el recordatorio, en palabras: "mié 28 oct, 23:59". */
const reminderAt = (task: Task, hours: number) => {
  const d = new Date(Date.parse(task.dueAt) - hours * 3_600_000);
  return `${formatWeekdayDate(d)}, ${formatTime(d)}`;
};

function ReminderControls({ task, now }: { task: Task; now: Date }) {
  const { setReminder } = useTasks();
  const toast = useToast();

  const toggle = (key: keyof Reminders, hours: number, label: string) => {
    const on = !task.reminders[key];
    setReminder(task.id, key, on);
    toast(on ? `Listo: te recordamos ${label} (${reminderAt(task, hours)}).` : `Recordatorio ${label} desactivado.`);
  };

  // Figma original: un solo botón "Recordarme en 1 hora".
  if (!FEATURES.remindersEscalonados) {
    const on = Boolean(task.reminders.h1);
    return (
      <button
        type="button"
        aria-pressed={on}
        onClick={() => toggle('h1', 1, 'en 1 hora')}
        className={`${btnSecondary} ${on ? 'bg-primary text-white' : ''}`}
      >
        {on ? '✓ Te recordaremos en 1 hora' : 'Recordarme en 1 hora'}
      </button>
    );
  }

  // PROPUESTA: recordatorios escalonados 24 h y 2 h antes del cierre.
  const options = [
    { key: 'h24' as const, hours: 24, label: '24 h antes' },
    { key: 'h2' as const, hours: 2, label: '2 h antes' },
  ];
  return (
    <fieldset className="mt-1">
      <legend className="mb-2 text-[17px] font-bold text-ink">Recordarme</legend>
      <div className="grid grid-cols-2 gap-3">
        {options.map(({ key, hours, label }) => {
          const on = task.reminders[key];
          const past = isReminderPast(task, hours, now);
          return (
            <button
              key={key}
              type="button"
              aria-pressed={on}
              disabled={past && !on}
              onClick={() => toggle(key, hours, label)}
              className={`${btnSecondary} flex flex-col items-center justify-center py-1.5 leading-tight ${
                on ? 'bg-primary text-white' : ''
              } disabled:border-line disabled:text-ink-2`}
            >
              <span className="flex items-center gap-1.5">
                {on && <CheckIcon className="size-4" />}
                {label}
              </span>
              <span className="text-[13px] font-normal">{past && !on ? 'Ya pasó' : on ? 'Activado' : 'Desactivado'}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
