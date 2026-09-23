/**
 * Steget från formulär till pass (berättelse 01, 02 och 03).
 */
import { describe, expect, it } from 'vitest';
import { attemptGeneration } from './generate.ts';
import { EMPTY_FORM, withAge, withFocusToggled } from './input/form.ts';
import type { InputFormState } from './input/form.ts';
import { BANK_WRONG_LEVEL, FULL_BANK, INPUT } from './__testdata__/session-fixture.ts';

/** Ett ifyllt formulär som motsvarar INPUT i fixturen. */
function filledForm(): InputFormState {
  const withPlayers = {
    ...withAge(EMPTY_FORM, String(INPUT.alder)),
    spelare: String(INPUT.spelare),
  };
  return withFocusToggled(withPlayers, 'passning-mottagning');
}

describe('R-020 Underlaget kontrolleras innan motorn körs', () => {
  it('R-020 kör inte motorn när underlaget saknar uppgifter', () => {
    const attempt = attemptGeneration(EMPTY_FORM, FULL_BANK, 'fro');
    expect(attempt.result).toBeNull();
    expect(attempt.errors.map((error) => error.field)).toContain('alder');
  });

  it('R-020 ger ett pass när underlaget håller', () => {
    const attempt = attemptGeneration(filledForm(), FULL_BANK, 'fro');
    expect(attempt.errors).toEqual([]);
    expect(attempt.result?.kind).toBe('session');
  });
});

describe('R-102 Underlaget ändras aldrig', () => {
  it('R-102 lämnar tillbaka ledarens underlag oförändrat när inget pass kunde skapas', () => {
    const form = filledForm();
    const attempt = attemptGeneration(form, BANK_WRONG_LEVEL, 'fro');
    expect(attempt.result?.kind).toBe('none');
    if (attempt.result?.kind === 'none') {
      expect(attempt.result.input.niva).toBe(form.niva);
      expect(attempt.result.input.fokus).toEqual(form.fokus);
      expect(attempt.result.input.alder).toBe(Number(form.alder));
    }
  });

  it('R-103 pekar ut minst ett val som skulle kunna ge ett pass', () => {
    const attempt = attemptGeneration(filledForm(), BANK_WRONG_LEVEL, 'fro');
    if (attempt.result?.kind !== 'none') {
      throw new Error('förväntade inget pass');
    }
    expect(attempt.result.reason.changeableFields).toContain('niva');
    // Ett pass som faller på motorns egen kontroll vore en bugg (ADR 0011 avsnitt 1).
    expect(attempt.result.reason.internalProblems).toEqual([]);
  });
});

describe('R-072 Samma frö ger samma pass', () => {
  it('R-072 ger identiska pass för samma underlag och samma frö', () => {
    const first = attemptGeneration(filledForm(), FULL_BANK, 'fro-a');
    const second = attemptGeneration(filledForm(), FULL_BANK, 'fro-a');
    expect(JSON.stringify(first.result)).toBe(JSON.stringify(second.result));
  });

  it('R-072 ger ett giltigt pass för varje frö', () => {
    for (const seed of ['1', '2', '3', '4']) {
      const attempt = attemptGeneration(filledForm(), FULL_BANK, seed);
      expect(attempt.result?.kind).toBe('session');
    }
  });
});
