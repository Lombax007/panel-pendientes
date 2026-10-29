export type TaskType = 'cuestionario' | 'archivo';

export type Reminders = {
  h24: boolean;
  h2: boolean;
  /** Solo se usa si FEATURES.remindersEscalonados está apagado ("Recordarme en 1 hora"). */
  h1?: boolean;
};

/** Modelo de datos de docs/01-PRODUCT-SPEC.md, sección 8. */
export type Task = {
  id: string;
  title: string;
  course: string;
  type: TaskType;
  /** ISO 8601 con zona America/Mexico_City (UTC-06:00). */
  dueAt: string;
  submitted: boolean;
  /** null = "Sin calificar" */
  grade: string | null;
  description: string;
  reminders: Reminders;
};
