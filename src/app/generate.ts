/**
 * Ett försök att generera ett pass ur formuläret: kontrollera underlaget, och om det håller,
 * fråga motorn. Steget ligger utanför komponenten, eftersom det är här berättelse 01, 02 och
 * 03 möts och därför är det som behöver prövas med tester.
 */
import { generateSession, validateInput } from '../regelmotor/index.ts';
import type { Exercise, Input, InputError, NoSessionReason, Session } from '../regelmotor/index.ts';
import { toInput } from './input/form.ts';
import type { InputFormState } from './input/form.ts';

export type GeneratedResult =
  { kind: 'session'; session: Session } | { kind: 'none'; input: Input; reason: NoSessionReason };

export interface Attempt {
  /** Felen i underlaget (R-011 till R-020). Tom lista när underlaget håller. */
  errors: InputError[];
  /** Motorns svar, eller `null` när underlaget inte höll och motorn aldrig kördes. */
  result: GeneratedResult | null;
}

/**
 * Kör ett försök. Underlaget lämnas oförändrat: appen ändrar aldrig ledarens val (R-102).
 *
 * @regel R-020
 * @regel R-101
 * @regel R-102
 */
export function attemptGeneration(
  form: InputFormState,
  bank: readonly Exercise[],
  seed: string,
): Attempt {
  const validated = validateInput(toInput(form));
  if (!validated.ok) {
    return { errors: validated.errors, result: null };
  }

  const outcome = generateSession(validated.input, bank, seed);
  if (outcome.kind === 'session') {
    return { errors: [], result: { kind: 'session', session: outcome.session } };
  }
  return {
    errors: [],
    result: { kind: 'none', input: validated.input, reason: outcome.reason },
  };
}
