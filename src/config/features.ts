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

  /**
   * Pantalla /comparativo: "Antes" (campanita de un LMS genérico, recreada)
   * contra "Después" (el tablero). Solo se llega por liga directa.
   * Apagado: /comparativo redirige al tablero.
   */
  comparativo: true,

  /**
   * Control de tiempo simulado (+3 h, +1 día, +1 semana, Volver al presente).
   * Solo aparece si la liga trae `?demo=1`. Apagado: no aparece nunca.
   */
  modoDemoTiempo: true,
} as const;
