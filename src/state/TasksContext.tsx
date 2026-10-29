import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildSampleTasks } from '../data/tasks';
import { applySaved, loadSaved, storeSaved, type Saved } from '../lib/persistence';
import type { Reminders, Task } from '../lib/types';
import { currentTime, useNow } from './useNow';

type Ctx = {
  tasks: Task[];
  now: Date;
  getTask: (id: string) => Task | undefined;
  setSubmitted: (id: string, submitted: boolean) => void;
  setReminder: (id: string, key: keyof Reminders, on: boolean) => void;
  resetDemo: () => void;
};

const TasksContext = createContext<Ctx | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const now = useNow();
  // Las fechas se calculan una vez al abrir la app, relativas a ese momento.
  const [base] = useState(() => buildSampleTasks(currentTime()));
  const [saved, setSaved] = useState<Saved>(loadSaved);

  useEffect(() => storeSaved(saved), [saved]);

  const tasks = useMemo(() => applySaved(base, saved), [base, saved]);

  const getTask = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks]);

  const setSubmitted = useCallback((id: string, submitted: boolean) => {
    setSaved((prev) => ({ ...prev, [id]: { ...prev[id], submitted } }));
  }, []);

  const setReminder = useCallback((id: string, key: keyof Reminders, on: boolean) => {
    setSaved((prev) => ({
      ...prev,
      [id]: { ...prev[id], reminders: { ...prev[id]?.reminders, [key]: on } },
    }));
  }, []);

  /** Borra entregas y recordatorios (para pasar al siguiente participante). */
  const resetDemo = useCallback(() => setSaved({}), []);

  const value = useMemo(
    () => ({ tasks, now, getTask, setSubmitted, setReminder, resetDemo }),
    [tasks, now, getTask, setSubmitted, setReminder, resetDemo],
  );
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): Ctx {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de <TasksProvider>');
  return ctx;
}
