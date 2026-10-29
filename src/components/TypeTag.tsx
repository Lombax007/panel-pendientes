import { FEATURES } from '../config/features';
import { TYPE_LABEL } from '../lib/urgency';
import type { TaskType } from '../lib/types';

/** PROPUESTA: etiqueta de tipo de entrega. Se apaga con FEATURES.etiquetaTipoEntrega. */
export function TypeTag({ type, className = '' }: { type: TaskType; className?: string }) {
  if (!FEATURES.etiquetaTipoEntrega) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-white px-2.5 py-0.5 text-[13px] font-medium text-ink-2 ${className}`}
    >
      <span className="sr-only">Tipo de entrega: </span>
      {TYPE_LABEL[type]}
    </span>
  );
}
