import { useState, type ReactNode } from 'react';
import { BottomNav } from '../components/BottomNav';
import { DemoTimeBar } from '../components/DemoTimeBar';
import { BellIcon } from '../components/Icons';
import { LmsBar } from '../components/LmsBar';
import { LMS_ACCENT } from '../config/theme';
import { buildBeforeNotices, cutCourse, publishedAgo } from '../data/beforeNotices';
import { currentTime } from '../state/TimeContext';
import { useTasks } from '../state/TasksContext';
import { Tablero } from './Tablero';

type View = 'antes' | 'despues';

/**
 * /comparativo — los mismos datos de ejemplo de dos maneras.
 * Única pantalla que NO es móvil primero: desde 900 px van lado a lado para
 * proyectarse; en celular, un toggle cambia entre las dos (ver DECISIONS.md).
 */
export function Comparativo() {
  const [view, setView] = useState<View>('antes');

  return (
    <div className="min-h-dvh bg-screen">
      <DemoTimeBar />
      <header className="bg-[var(--lms-accent)] px-5 py-4 text-white min-[900px]:py-6">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[22px] font-bold min-[900px]:text-[30px]">Antes y después</h1>
          <p className="mt-0.5 text-[15px] opacity-90 min-[900px]:text-[18px]">
            Los mismos pendientes, mostrados de dos maneras.
          </p>
        </div>
      </header>

      {/* Toggle: solo en pantallas angostas */}
      <div className="sticky top-0 z-30 bg-screen px-5 py-3 min-[900px]:hidden">
        <div role="group" aria-label="Elegir vista" className="flex rounded-full border border-line bg-white p-1">
          {(['antes', 'despues'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`h-10 flex-1 rounded-full text-[16px] transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--lms-accent)] ${
                view === v ? 'bg-primary font-bold text-white' : 'text-ink'
              }`}
            >
              {v === 'antes' ? 'Antes' : 'Después'}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-5 pb-6 min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:gap-12 min-[900px]:pt-8">
        <Pane
          visible={view === 'antes'}
          tag="Antes"
          caption="La campanita de un LMS genérico"
          tagClass="bg-[#6b7280] text-white"
        >
          <BeforeBell />
        </Pane>
        <Pane
          visible={view === 'despues'}
          tag="Después"
          caption="Panel de pendientes por urgencia"
          tagClass="bg-[var(--lms-accent)] text-white"
        >
          {LMS_ACCENT && <LmsBar />}
          <Tablero />
          <BottomNav inline />
        </Pane>
      </div>

      <ResearchNotes />
    </div>
  );
}

function Pane({
  visible,
  tag,
  caption,
  tagClass,
  children,
}: {
  visible: boolean;
  tag: string;
  caption: string;
  tagClass: string;
  children: ReactNode;
}) {
  return (
    <section aria-label={`${tag}: ${caption}`} className={`${visible ? 'block' : 'hidden'} min-[900px]:block`}>
      <h2 className="mb-3 flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-[14px] font-bold tracking-wide uppercase min-[900px]:text-[18px] ${tagClass}`}>
          {tag}
        </span>
        <span className="text-[15px] font-semibold text-ink-2 min-[900px]:text-[18px]">{caption}</span>
      </h2>
      {/* En pantalla ancha, marco de celular de 390 px con scroll interno */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-[#d1d5db] bg-white min-[900px]:mx-auto min-[900px]:h-[720px] min-[900px]:w-[390px] min-[900px]:overflow-y-auto min-[900px]:rounded-[28px] min-[900px]:border-[6px] min-[900px]:border-[#1f2937] min-[900px]:shadow-xl">
        {children}
      </div>
    </section>
  );
}

/** Recreación ilustrativa: todo igual de gris, sin fecha límite, en orden de publicación. */
function BeforeBell() {
  const { tasks, now } = useTasks();
  // Las publicaciones se fechan respecto a cuando se abrió la app, igual que las tareas.
  const [openedAt] = useState(currentTime);
  const notices = buildBeforeNotices(tasks, openedAt);
  const gray = 'text-[14px] font-normal text-[#6b7280]';
  return (
    <div className="flex-1 bg-white">
      <div className={`flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3 ${gray}`}>
        <span>Notificaciones</span>
        <span>Marcar todo como leído</span>
      </div>
      <ul>
        {notices.map((n) => (
          <li key={n.id} className={`flex gap-3 border-b border-[#e5e7eb] px-4 py-3 ${gray}`}>
            <span aria-hidden className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e5e7eb]">
              <BellIcon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block">{n.text}</span>
              <span className="block">{cutCourse(n.course)}</span>
              <span className="block">{publishedAgo(n.publishedAt, now)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Qué cambió y por qué, con datos de docs/03-RESEARCH.md (encuesta n = 14, 2 entrevistas). */
function ResearchNotes() {
  const items = [
    <>
      <strong>La urgencia se ve, no se lee.</strong> En la encuesta, “las notificaciones distinguen lo urgente de lo que
      no” sacó una media de 2.21 sobre 5: el 57.1% estuvo en desacuerdo y nadie marcó 5. Por eso, los grupos HOY, ESTA
      SEMANA y DESPUÉS, con color y texto.
    </>,
    <>
      <strong>La hora límite en cada aviso.</strong> El 57.1% dijo que ha olvidado o entregado tarde por no ver una
      notificación (4 o 5 sobre 5). Antes, ningún aviso dice cuándo cierra; después, cada tarjeta lo dice.
    </>,
    <>
      <strong>Materia corta y sin ruido.</strong> “Todo se ve igual, todo es texto gris”, y los nombres con clave larga se
      cortan en el celular (Entrevista 2). Después: nombre corto de materia y solo lo que hay que entregar.
    </>,
    <>
      <strong>Lo pidieron.</strong> El 85.7% marcó 4 o 5 a “me sería útil un panel por urgencia real” (media 4.36).
    </>,
  ];
  return (
    <section aria-labelledby="que-cambio" className="mx-auto max-w-[1100px] px-5 pb-10">
      <h2 id="que-cambio" className="mb-3 text-[18px] font-bold text-ink min-[900px]:text-[22px]">
        Qué cambió y por qué
      </h2>
      <ul className="grid gap-3 min-[900px]:grid-cols-2 min-[900px]:gap-x-10">
        {items.map((item, i) => (
          <li key={i} className="text-[15px] leading-relaxed text-ink-2 min-[900px]:text-[17px]">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[13px] text-ink-2">
        Datos: encuesta digital (n = 14, muestra por conveniencia) y 2 entrevistas, Ibero Puebla, otoño 2026. El lado
        “Antes” es una recreación ilustrativa con fines de comparación; no es una captura de ninguna plataforma real.
      </p>
    </section>
  );
}
