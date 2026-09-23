/**
 * Den virtuella modul som Vite-insticket bygger ur content/ovningar/ (ADR 0015).
 * Filen finns inte på disk; typen beskriver bara vad insticket lämnar.
 */
declare module 'virtual:ovningsbanken' {
  import type { Exercise } from '../regelmotor/types.ts';

  /** Bankens godkända övningar, i filnamnsordning (R-022). */
  export const bank: Exercise[];
}
