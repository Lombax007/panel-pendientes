/**
 * Propuestas que salieron de la investigación (docs/03-RESEARCH.md).
 * Todavía no las aprueba Gustavo: si en la retroalimentación del 12 de
 * noviembre piden quitar alguna, cambia su valor a `false` y listo.
 */
export const FEATURES = {
  /**
   * Recordatorios escalonados "24 h antes" y "2 h antes" en el detalle.
   * Apagado: vuelve el botón original del Figma, "Recordarme en 1 hora".
   */
  remindersEscalonados: true,

  /** Etiqueta "Cuestionario" / "Subir archivo" en tarjetas, avisos y detalle. */
  etiquetaTipoEntrega: true,

  /**
   * Grupo "VENCIDAS" en gris al final del tablero.
   * Apagado: las vencidas solo aparecen en Avisos (como en el Figma).
   */
  grupoVencidas: true,
} as const;
