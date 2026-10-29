import type { Urgency } from './urgency';

/** Clases por urgencia. El color siempre va junto a un texto (encabezado o "vence…"). */
export const URGENCY_STYLE: Record<Urgency, { bar: string; dot: string; heading: string; pill: string }> = {
  hoy: { bar: 'bg-hoy', dot: 'bg-hoy', heading: 'text-hoy', pill: 'bg-hoy-bg border-hoy text-hoy-text' },
  semana: {
    bar: 'bg-semana',
    dot: 'bg-semana',
    heading: 'text-semana-text',
    pill: 'bg-semana-bg border-semana text-semana-text',
  },
  despues: {
    bar: 'bg-despues',
    dot: 'bg-despues',
    heading: 'text-despues-text',
    pill: 'bg-despues-bg border-despues text-despues-text',
  },
  vencida: {
    bar: 'bg-despues',
    dot: 'bg-despues',
    heading: 'text-despues-text',
    pill: 'bg-despues-bg border-despues text-despues-text',
  },
  entregada: {
    bar: 'bg-despues',
    dot: 'bg-despues',
    heading: 'text-despues-text',
    pill: 'bg-white border-ink-2 text-ink',
  },
};
