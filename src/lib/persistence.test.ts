import { describe, expect, it } from 'vitest';
import { buildSampleTasks, SEED_TASKS } from '../data/tasks';
import { applySaved, type Saved } from './persistence';
import { getUrgency, groupTasks } from './urgency';

describe('persistencia por id fijo', () => {
  it('los ids de los datos de ejemplo son fijos y únicos', () => {
    const ids = SEED_TASKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    const a = buildSampleTasks(new Date('2026-10-29T12:00:00-06:00')).map((t) => t.id);
    const b = buildSampleTasks(new Date('2026-10-30T09:00:00-06:00')).map((t) => t.id);
    expect(b).toEqual(a);
  });

  it('lo guardado un día se conserva al día siguiente aunque las fechas se recalculen', () => {
    const saved: Saved = {
      'escala-redondeo': { reminders: { h24: true } },
      estadistica: { submitted: true },
    };
    const tomorrow = new Date('2026-10-30T09:00:00-06:00');
    const tasks = applySaved(buildSampleTasks(tomorrow), saved);
    expect(tasks.find((t) => t.id === 'escala-redondeo')!.reminders).toEqual({ h24: true, h2: false });
    const est = tasks.find((t) => t.id === 'estadistica')!;
    expect(getUrgency(est, tomorrow)).toBe('entregada');
    expect(groupTasks(tasks, tomorrow).hoy.some((t) => t.id === 'estadistica')).toBe(false);
  });

  it('ignora ids guardados que ya no existen', () => {
    const tasks = applySaved(buildSampleTasks(new Date()), { 'tarea-borrada': { submitted: true } });
    expect(tasks.every((t) => !t.submitted)).toBe(true);
  });
});
