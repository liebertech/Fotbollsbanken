/**
 * Grundfiltret (R-022 till R-028). En övning som inte klarar det är aldrig aktuell,
 * oavsett hur passet ser ut i övrigt.
 */
import { isFocusAreaRelevant } from '../keys.ts';
import type { FocusArea, Phase, SessionPartFromBank } from '../keys.ts';
import { compareIds } from '../random/rng.ts';
import type { Exercise, Input } from '../types.ts';

/** Vad som fällde en övning, så att ett bortval går att spåra till sin regel. */
export interface Rejection {
  id: string;
  regel: string;
}

/**
 * Prövar grundfiltret för en övning. Returnerar regeln som sa nej, eller `null`.
 *
 * @regel R-022
 * @regel R-023
 * @regel R-024
 * @regel R-025
 * @regel R-026
 * @regel R-027
 */
export function baseRejection(exercise: Exercise, input: Input, phase: Phase): string | null {
  // R-022: bara godkända övningar ur den gemensamma banken.
  if (exercise.status !== 'godkand') {
    return 'R-022';
  }
  // R-023: underlagets ålder ligger inom övningens åldersspann.
  if (input.alder < exercise.alder.min || input.alder > exercise.alder.max) {
    return 'R-023';
  }
  // R-024: underlagets spelform finns i övningens spelformer.
  if (!exercise.spelformer.includes(input.spelform)) {
    return 'R-024';
  }
  // R-025 och R-026: nivån matchar strikt, aldrig en angränsande nivå.
  if (!exercise.niva.includes(input.niva)) {
    return 'R-025';
  }
  // R-027: alla övningens fokusområden är K eller R för fasen.
  if (!exercise.fokusomraden.every((focus) => isFocusAreaRelevant(focus, phase))) {
    return 'R-027';
  }
  return null;
}

/**
 * Övningarna som klarar grundfiltret, sorterade med en total ordning. Ordningen är
 * oberoende av den ordning banken råkar komma i (ADR 0011 avsnitt 2).
 *
 * @regel R-022
 */
export function baseFilter(bank: readonly Exercise[], input: Input, phase: Phase): Exercise[] {
  return bank
    .filter((exercise) => baseRejection(exercise, input, phase) === null)
    .sort((a, b) => compareIds(a.id, b.id));
}

/**
 * Är övningen märkt med delen?
 *
 * @regel R-028
 */
export function fitsPart(exercise: Exercise, part: SessionPartFromBank): boolean {
  return exercise.passdelar.includes(part);
}

/**
 * Träffar övningen fokuset? Huvudträff betyder att övningens första fokusområde finns
 * bland dem.
 *
 * @regel R-040
 */
export function hitsFocus(exercise: Exercise, focus: readonly FocusArea[]): boolean {
  return exercise.fokusomraden.some((item) => focus.includes(item));
}

/**
 * @regel R-040
 */
export function hasMainHit(exercise: Exercise, focus: readonly FocusArea[]): boolean {
  const main = exercise.fokusomraden[0];
  return main !== undefined && focus.includes(main);
}
