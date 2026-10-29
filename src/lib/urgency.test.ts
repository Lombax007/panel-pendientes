import { describe, expect, it } from 'vitest';
import {
  duePillText,
  filterNotices,
  getUrgency,
  groupTasks,
  isReminderPast,
  relativeDueText,
  timeRemainingText,
} from './urgency';
import type { Task } from './types';
import { buildSampleTasks } from '../data/tasks';

// Jueves 29 de octubre de 2026, 12:00 en Ciudad de México.
const NOW = new Date('2026-10-29T12:00:00-06:00');

const task = (dueAt: string, submitted = false): Task => ({
  id: dueAt,
  title: 'Tarea',
  course: 'Materia',
  type: 'archivo',
  dueAt,
  submitted,
  grade: null,
  description: '',
  reminders: { h24: false, h2: false },
});

describe('cálculo de urgencia: casos borde', () => {
  it('vence en 20 minutos → Hoy, "vence en 20 min"', () => {
    const t = task('2026-10-29T12:20:00-06:00');
    expect(getUrgency(t, NOW)).toBe('hoy');
    expect(relativeDueText(t, NOW)).toBe('vence en 20 min');
    expect(timeRemainingText(t, NOW)).toBe('20 minutos');
    expect(duePillText(t, NOW)).toBe('Vence en 20 min · 12:20');
  });

  it('vence hoy más tarde → Hoy, "vence hoy HH:MM"', () => {
    const t = task('2026-10-29T15:00:00-06:00');
    expect(getUrgency(t, NOW)).toBe('hoy');
    expect(relativeDueText(t, NOW)).toBe('vence hoy 15:00');
    expect(timeRemainingText(t, NOW)).toBe('3 horas');
    expect(duePillText(t, NOW)).toBe('Vence hoy · 15:00');
  });

  it('vence hoy a las 23:59 sigue siendo Hoy', () => {
    expect(getUrgency(task('2026-10-29T23:59:00-06:00'), NOW)).toBe('hoy');
  });

  it('vence mañana → Esta semana, "vence mañana HH:MM"', () => {
    const t = task('2026-10-30T23:59:00-06:00');
    expect(getUrgency(t, NOW)).toBe('semana');
    expect(relativeDueText(t, NOW)).toBe('vence mañana 23:59');
    expect(duePillText(t, NOW)).toBe('Vence mañana · 23:59');
  });

  it('mañana a las 00:30 (menos de 24 h) cuenta como mañana, no como hoy', () => {
    const t = task('2026-10-30T00:30:00-06:00');
    expect(getUrgency(t, NOW)).toBe('semana');
    expect(relativeDueText(t, NOW)).toBe('vence mañana 00:30');
  });

  it('vence en 3 días → Esta semana, "vence en 3 días"', () => {
    const t = task('2026-11-01T18:00:00-06:00');
    expect(getUrgency(t, NOW)).toBe('semana');
    expect(relativeDueText(t, NOW)).toBe('vence en 3 días');
    expect(duePillText(t, NOW)).toBe('Vence dom 1 nov · 18:00');
  });

  it('a 7 días sigue en Esta semana; a 8 ya es Después', () => {
    expect(getUrgency(task('2026-11-05T09:00:00-06:00'), NOW)).toBe('semana');
    const t8 = task('2026-11-06T09:00:00-06:00');
    expect(getUrgency(t8, NOW)).toBe('despues');
    expect(relativeDueText(t8, NOW)).toBe('vence 6 nov');
  });

  it('vence en más de 7 días → Después, fecha corta', () => {
    const t = task('2026-11-26T23:59:00-06:00');
    expect(getUrgency(t, NOW)).toBe('despues');
    expect(relativeDueText(t, NOW)).toBe('vence 26 nov');
    expect(duePillText(t, NOW)).toBe('Vence jue 26 nov · 23:59');
  });

  it('vencida hace 9 días → Vencida, "venció hace 9 días"', () => {
    const t = task('2026-10-20T23:59:00-06:00');
    expect(getUrgency(t, NOW)).toBe('vencida');
    expect(relativeDueText(t, NOW)).toBe('venció hace 9 días');
    expect(duePillText(t, NOW)).toBe('Venció hace 9 días');
  });

  it('vencida hace unos minutos', () => {
    const t = task('2026-10-29T11:50:00-06:00');
    expect(getUrgency(t, NOW)).toBe('vencida');
    expect(relativeDueText(t, NOW)).toBe('venció hace 10 min');
  });

  it('entregada → sale de los grupos de pendientes', () => {
    const t = task('2026-10-29T15:00:00-06:00', true);
    expect(getUrgency(t, NOW)).toBe('entregada');
    const g = groupTasks([t], NOW);
    expect(g.hoy).toHaveLength(0);
    expect(filterNotices([t], 'todas', NOW)).toHaveLength(0);
  });

  it('usa la zona de Ciudad de México, no UTC', () => {
    // 23:30 del 29 en CDMX = 05:30 UTC del 30.
    const lateNight = new Date('2026-10-30T05:30:00Z');
    expect(getUrgency(task('2026-10-29T23:50:00-06:00'), lateNight)).toBe('hoy');
    // 01:00 del 30 en CDMX: misma fecha UTC que "ahora", pero es mañana en CDMX.
    const t = task('2026-10-30T01:00:00-06:00');
    expect(getUrgency(t, lateNight)).toBe('semana');
    expect(relativeDueText(t, lateNight)).toBe('vence mañana 01:00');
  });
});

describe('agrupado y filtros', () => {
  const tasks = [
    task('2026-11-26T23:59:00-06:00'),
    task('2026-10-29T15:00:00-06:00'),
    task('2026-10-20T23:59:00-06:00'),
    task('2026-11-01T18:00:00-06:00'),
    task('2026-10-29T12:20:00-06:00'),
  ];

  it('ordena cada grupo del más cercano al más lejano', () => {
    const g = groupTasks(tasks, NOW);
    expect(g.hoy.map((t) => t.dueAt)).toEqual(['2026-10-29T12:20:00-06:00', '2026-10-29T15:00:00-06:00']);
    expect(g.semana).toHaveLength(1);
    expect(g.despues).toHaveLength(1);
    expect(g.vencida).toHaveLength(1);
  });

  it('filtros del panel: Todas / Hoy / Esta semana', () => {
    expect(filterNotices(tasks, 'todas', NOW)).toHaveLength(5);
    expect(filterNotices(tasks, 'todas', NOW).at(-1)?.dueAt).toBe('2026-10-20T23:59:00-06:00');
    expect(filterNotices(tasks, 'hoy', NOW)).toHaveLength(2);
    expect(filterNotices(tasks, 'semana', NOW)).toHaveLength(3);
  });

  it('recordatorios que ya pasaron', () => {
    const t = task('2026-10-29T15:00:00-06:00'); // faltan 3 h
    expect(isReminderPast(t, 24, NOW)).toBe(true);
    expect(isReminderPast(t, 2, NOW)).toBe(false);
  });
});

describe('datos de ejemplo', () => {
  const moments = [
    '2026-10-29T12:00:00-06:00',
    '2026-10-29T08:00:00-06:00',
    '2026-10-29T22:40:00-06:00',
    '2026-11-03T00:10:00-06:00',
    '2027-02-14T17:00:00-06:00',
  ];
  it.each(moments)('a las %s se ven Hoy, Esta semana, Después y Vencidas', (iso) => {
    const now = new Date(iso);
    const g = groupTasks(buildSampleTasks(now), now);
    expect(g.hoy.length).toBeGreaterThan(0);
    expect(g.semana.length).toBeGreaterThan(0);
    expect(g.despues.length).toBeGreaterThan(0);
    expect(g.vencida.length).toBeGreaterThan(0);
  });

  it('"Ejercicios de estadística" vence hoy en ~3 horas', () => {
    const tasks = buildSampleTasks(NOW);
    const t = tasks.find((x) => x.id === 'estadistica')!;
    expect(relativeDueText(t, NOW)).toBe('vence hoy 15:00');
    expect(timeRemainingText(t, NOW)).toBe('3 horas');
  });

  it('el proyecto final siempre es el 26 de noviembre de 2026', () => {
    const t = buildSampleTasks(NOW).find((x) => x.id === 'proyecto-final')!;
    expect(t.dueAt).toBe(new Date('2026-11-26T23:59:00-06:00').toISOString());
  });
});
