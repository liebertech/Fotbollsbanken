/**
 * Pass att visa i vytesterna. Passen kommer alltid ur motorn, aldrig ur ett handskrivet
 * objekt: vyn ska prövas mot det motorn faktiskt lämnar (ADR 0011 avsnitt 1).
 *
 * Banken är fixturer ur src/regelmotor/__testdata__/, inte content/ovningar/, så att ett
 * vytest inte går sönder när övningsbanken fylls på.
 */
import { bankExercise, gameExercise } from '../../regelmotor/__testdata__/bank-fixtur.ts';
import { generateSession } from '../../regelmotor/index.ts';
import type { Exercise, GenerationResult, Input, Session } from '../../regelmotor/index.ts';

/** Ett underlag för 11 år, som fixturerna är märkta för. */
export const INPUT: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 12,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

const warmup = bankExercise({
  id: 'uppvarmning-fixtur',
  namn: 'Passningslek i ruta',
  passdelar: ['del-uppvarmning'],
  fokusomraden: ['passning-mottagning', 'lek'],
  material: [{ typ: 'kon', antal: 8 }],
});

const practice = bankExercise({
  id: 'ova-fixtur',
  namn: 'Passning med vändning',
  passdelar: ['del-ovning'],
  fokusomraden: ['passning-mottagning'],
});

const gamePractice = bankExercise({
  id: 'spelovning-fixtur',
  namn: 'Spel mot två mål',
  passdelar: ['del-spelovning'],
  fokusomraden: ['passning-mottagning'],
  grupptyp: 'tva-lag',
  spelare: { min: 4, max: 12 },
  material: [{ typ: 'minimal', antal: 2 }],
});

const game = gameExercise({
  id: 'spel-fixtur',
  namn: 'Fyra mot fyra',
  fokusomraden: ['spelbarhet'],
});

/** En bank som räcker till alla delar. */
export const FULL_BANK: Exercise[] = [warmup, practice, gamePractice, game];

/** Samma bank utan spelövningar: Spelövning blir tom (R-100). */
export const BANK_WITHOUT_GAME_PRACTICE: Exercise[] = [warmup, practice, game];

/**
 * En bank vars kärna bara har `dribbling`. Väljer ledaren `lek` får kärnan ett
 * ersättningsfokus (R-121).
 */
export const BANK_NEEDING_SUBSTITUTE: Exercise[] = [
  warmup,
  bankExercise({
    id: 'ova-dribbling',
    passdelar: ['del-ovning'],
    fokusomraden: ['dribbling'],
  }),
  bankExercise({
    id: 'spelovning-dribbling',
    passdelar: ['del-spelovning'],
    fokusomraden: ['dribbling'],
    grupptyp: 'tva-lag',
    spelare: { min: 4, max: 12 },
  }),
  game,
];

/** En bank som bara har övningar för niva-1: inget pass går att skapa för niva-2 (R-101). */
export const BANK_WRONG_LEVEL: Exercise[] = [warmup, practice, gamePractice, game].map(
  (exercise) => ({ ...exercise, niva: ['niva-1'] }),
);

export function generate(bank: Exercise[], input: Input = INPUT, seed = 'fro'): GenerationResult {
  return generateSession(input, bank, seed);
}

/** Passet, eller ett fel som säger varför inget skapades. */
export function sessionOf(bank: Exercise[], input: Input = INPUT, seed = 'fro'): Session {
  const result = generate(bank, input, seed);
  if (result.kind !== 'session') {
    throw new Error(`inget pass skapades: ${JSON.stringify(result.reason)}`);
  }
  return result.session;
}
