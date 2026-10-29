import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from './Icons';

/** Regresa a la pantalla de origen; si se entró por liga directa, al tablero. */
export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromApp = Boolean((location.state as { from?: string } | null)?.from);
  return (
    <button
      type="button"
      onClick={() => (cameFromApp ? navigate(-1) : navigate('/', { replace: true }))}
      aria-label="Regresar"
      className="-ml-2 flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-black/5 active:bg-black/10 focus-visible:outline-3 focus-visible:outline-[var(--lms-accent)]"
    >
      <ArrowLeft className="size-6" />
    </button>
  );
}
