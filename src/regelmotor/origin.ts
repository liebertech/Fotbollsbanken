/**
 * Gränsen mellan den gemensamma banken och klubbens egna övningar (S-28).
 *
 * R-022 säger att generatorn bara väljer ur den gemensamma, redaktörsgodkända banken. Den
 * gränsen vilade tidigare på statusfältet, och R-106 upphäver uttryckligen statuskravet när
 * ledaren byter in en egen övning i inkrement 4. Ursprunget är därför en egenskap hos typen:
 * `generateSession` tar `BankExercise`, och en klubbövning – som bara är en `Exercise` – går
 * inte att skicka in utan att det blir ett kompileringsfel.
 */
import { publishExercise } from './schema/published.ts';
import type { Exercise } from './types.ts';

/** Märket som säger att övningen kommer ur den gemensamma banken. */
export const BANK_ORIGIN = 'bank';

/** En övning ur den gemensamma banken: godkänd av en redaktör och märkt med sitt ursprung. */
export interface BankExercise extends Exercise {
  status: 'godkand';
  ursprung: typeof BANK_ORIGIN;
}

/**
 * Den enda vägen till en `BankExercise`. Appen anropar den på ett enda ställe,
 * `src/data/bank.ts` (ADR 0015), och övningen projiceras samtidigt ner till de publicerade
 * fälten (S-27).
 *
 * @regel R-022
 */
export function toBankExercise(exercise: Exercise): BankExercise {
  if (exercise.status !== 'godkand') {
    throw new Error(
      `R-022: ${exercise.id} har status ${exercise.status} och hör inte till den gemensamma banken`,
    );
  }
  return { ...publishExercise(exercise), status: 'godkand', ursprung: BANK_ORIGIN };
}

/**
 * Kommer övningen ur den gemensamma banken? Slutkontrollen nycklar R-022 mot det här och
 * inte bara mot statusfältet, så att kontrollen håller också när R-106 släpper in klubbens
 * egna övningar i inkrement 4.
 *
 * @regel R-022
 */
export function isBankExercise(exercise: Exercise): exercise is BankExercise {
  const origin = (exercise as Partial<BankExercise>).ursprung;
  return exercise.status === 'godkand' && origin === BANK_ORIGIN;
}
