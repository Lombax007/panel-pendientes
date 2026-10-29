import { describe, expect, it } from 'vitest';
import { buildSampleTasks } from '../data/tasks';
import { PRESENT, TIME_STEPS, advance, describeOffset, shiftedNow } from './timeShift';
import { duePillText, getUrgency, groupTasks } from './urgency';

// Jueves 29 de octubre de 2026, 12:00 en Ciudad de México (hora "real").
const REAL_NOW = new Date('2026-10-29T12:00:00-06:00');
const step = (key: string) => TIME_STEPS.find((s) => s.key === key)!.ms;
const tasks = buildSampleTasks(REAL_NOW);
const byId = (id: string) => tasks.find((t) => t.id === id)!;

describe('modo demo: desfase de tiempo', () => {
  it('+1 día mueve una tarea de ESTA SEMANA a HOY', () => {
    const t = byId('cuestionario-unidad'); // vence mañana 23:59
    expect(getUrgency(t, shiftedNow(REAL_NOW, PRESENT))).toBe('semana');

    const offset = advance(PRESENT, step('1d'));
    const now = shiftedNow(REAL_NOW, offset);
    expect(getUrgency(t, now)).toBe('hoy');
    expect(groupTasks(tasks, now).hoy.map((x) => x.id)).toContain('cuestionario-unidad');
    expect(duePillText(t, now)).toBe('Vence hoy · 23:59');
  });

  it('"Volver al presente" la regresa a ESTA SEMANA', () => {
    const offset = advance(PRESENT, step('1d'));
    expect(getUrgency(byId('cuestionario-unidad'), shiftedNow(REAL_NOW, offset))).toBe('hoy');
    const back = PRESENT; // volver al presente = desfase 0
    expect(getUrgency(byId('cuestionario-unidad'), shiftedNow(REAL_NOW, back))).toBe('semana');
    expect(shiftedNow(REAL_NOW, back).getTime()).toBe(REAL_NOW.getTime());
  });

  it('los pasos se acumulan: +1 día tres veces pasa "en 3 días" a HOY', () => {
    let offset = PRESENT;
    for (let i = 0; i < 3; i++) offset = advance(offset, step('1d'));
    expect(getUrgency(byId('escala-redondeo'), shiftedNow(REAL_NOW, offset))).toBe('hoy');
  });

  it('+3 horas deja vencida la tarea que vencía en ~3 horas', () => {
    const now = shiftedNow(REAL_NOW, advance(PRESENT, step('3h') + 30 * 60_000));
    expect(getUrgency(byId('estadistica'), now)).toBe('vencida');
  });

  it('+1 semana pasa lo de DESPUÉS más cercano a ESTA SEMANA', () => {
    const now = shiftedNow(REAL_NOW, advance(PRESENT, step('1w')));
    expect(getUrgency(byId('unidad-4'), now)).toBe('semana');
  });

  it('describe el desfase en palabras', () => {
    expect(describeOffset(step('1d') + step('3h'))).toBe('1 día 3 h');
    expect(describeOffset(step('1w'))).toBe('1 semana');
  });
});
