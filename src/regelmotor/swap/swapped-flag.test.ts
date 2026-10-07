/**
 * Flaggan `Session.swapped` släpper bara R-035 och R-036 (R-105), och ingenting annat
 * (säkerhetsgranskningen av inkrement 2b, F3).
 *
 * När pass sparas i inkrement 3 kommer flaggan från lagrad data. Testerna här bygger därför
 * pass som har flaggan satt men innehåller sådant som slutkontrollen ska fälla, som om de
 * hade lästs in, och visar att kontrollen fäller dem lika med som utan flaggan.
 */
import { describe, expect, it } from 'vitest';
import { applySwap, checkSession, generateSession } from '../index.ts';
import { bankExercise, contentExercise, gameExercise } from '../__testdata__/bank-fixtur.ts';
import type { BankExercise } from '../origin.ts';
import type { Exercise, Input, ItemRef, Session } from '../types.ts';

/** Regler som flaggan får släppa (R-105). */
const LIFTED = /^R-03[56]:/;

function session(input: Input, bank: readonly BankExercise[]): Session {
  const result = generateSession(input, bank, 'fro-1');
  if (result.kind !== 'session') {
    throw new Error(`inget pass skapades: ${JSON.stringify(result.reason)}`);
  }
  return result.session;
}

function placeOf(value: Session, id: string): ItemRef {
  const row = value.rows.find((item) => item.exercise?.id === id);
  if (row?.block === null || row?.block === undefined) {
    throw new Error(`${id} finns inte i passet`);
  }
  return { block: row.block, station: row.kind === 'station' ? row.station : null };
}

/** Ett pass där övningen `id` har ersatts av `exercise` utan att gå via applySwap. */
function tampered(value: Session, id: string, exercise: Exercise): Session {
  return {
    ...value,
    rows: value.rows.map((row) => (row.exercise?.id === id ? { ...row, exercise } : row)),
  };
}

/** Slutkontrollen med flaggan satt, och samma kontroll utan flaggan minus R-035 och R-036. */
function bothWays(value: Session): { swapped: string[]; expected: string[] } {
  return {
    swapped: checkSession({ ...value, swapped: true }),
    expected: checkSession({ ...value, swapped: false }).filter((item) => !LIFTED.test(item)),
  };
}

function rulesOf(problems: readonly string[]): string[] {
  return [...new Set(problems.map((problem) => problem.slice(0, 5)))].sort();
}

describe('Session.swapped släpper bara R-035 och R-036 (F3)', () => {
  const underlag11: Input = {
    alder: 11,
    spelform: '7mot7',
    niva: 'niva-2',
    spelare: 14,
    ledare: 2,
    passlangd: 60,
    fokus: ['passning-mottagning'],
  };
  const bank11: BankExercise[] = [
    bankExercise({
      id: 'uppvarmning-passa',
      fokusomraden: ['koordination', 'passning-mottagning'],
      passdelar: ['del-uppvarmning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    }),
    bankExercise({
      id: 'ova-passa',
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    }),
    bankExercise({
      id: 'spelovning-passa',
      passdelar: ['del-spelovning'],
      grupptyp: 'tva-lag',
      spelare: { min: 4, max: 14 },
      tid: { kortast: 10, rekommenderad: 12, langst: 14 },
    }),
    gameExercise({
      id: 'spel-passa',
      spelare: { min: 6, max: 14 },
      tid: { kortast: 16, rekommenderad: 19, langst: 22 },
    }),
  ];

  const underlag13: Input = { ...underlag11, alder: 13, spelform: '9mot9' };
  const for13 = { alder: { min: 13, max: 14 }, spelformer: ['9mot9'] };
  const bank13: BankExercise[] = bank11.map((exercise) =>
    exercise.passdelar.includes('del-spel')
      ? gameExercise({ ...exercise, ...for13 })
      : bankExercise({ ...exercise, ...for13 }),
  );
  /** Ett spel med nickning, för 13–14 år. */
  const nickspel = gameExercise({
    ...for13,
    id: 'spel-nick',
    fokusomraden: ['nickspel', 'passning-mottagning'],
    spelare: { min: 6, max: 14 },
    tid: { kortast: 16, rekommenderad: 19, langst: 22 },
  });

  it('ett pass med flaggan satt men utan fel klarar kontrollen', () => {
    expect(checkSession({ ...session(underlag11, bank11), swapped: true })).toEqual([]);
  });

  it('R-080 fälls fortfarande: en övning med nickspel för 11 år', () => {
    const pass = tampered(session(underlag11, bank11), 'ova-passa', {
      ...(bank11[1] as BankExercise),
      fokusomraden: ['nickspel', 'passning-mottagning'],
    });
    const { swapped, expected } = bothWays(pass);
    expect(rulesOf(swapped)).toContain('R-080');
    expect(swapped).toEqual(expected);
  });

  it('R-082 fälls fortfarande: ett spel med nickning över taket för 13 år', () => {
    const medNick: Input = { ...underlag13, fokus: ['passning-mottagning', 'nickspel'] };
    const pass = tampered(session(medNick, bank13), 'spel-passa', nickspel);
    const { swapped, expected } = bothWays(pass);
    expect(rulesOf(swapped)).toEqual(['R-082']);
    expect(swapped).toEqual(expected);
  });

  it('R-086 fälls fortfarande: en nickövning när ledaren inte har valt nickspel', () => {
    const pass = tampered(session(underlag13, bank13), 'spel-passa', nickspel);
    const { swapped, expected } = bothWays(pass);
    expect(rulesOf(swapped)).toContain('R-086');
    expect(swapped).toEqual(expected);
  });

  it('R-022 fälls fortfarande: en övning som inte kommer ur den gemensamma banken', () => {
    const klubbens = contentExercise({
      id: 'ova-passa',
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 14 },
    });
    const pass = tampered(session(underlag11, bank11), 'ova-passa', klubbens);
    const { swapped, expected } = bothWays(pass);
    expect(rulesOf(swapped)).toEqual(['R-022']);
    expect(swapped).toEqual(expected);
  });

  describe('byte efter byte', () => {
    const alternativ = (id: string, passdel: string): BankExercise =>
      bankExercise({
        id,
        passdelar: [passdel],
        spelare: { min: 2, max: 14 },
        tid: { kortast: 8, rekommenderad: 10, langst: 12 },
      });
    const nyOva = alternativ('ny-ova', 'del-ovning');
    const nyUppvarmning = alternativ('ny-uppvarmning', 'del-uppvarmning');
    const pass = session(underlag11, bank11);
    const forst = applySwap(pass, placeOf(pass, 'ova-passa'), nyOva);
    const sedan = applySwap(forst, placeOf(forst, 'uppvarmning-passa'), nyUppvarmning);

    it('det andra bytet utgår från ett pass som redan har flaggan och klarar kontrollen', () => {
      expect(forst.swapped).toBe(true);
      expect(sedan.swapped).toBe(true);
      expect(checkSession(sedan)).toEqual([]);
    });

    it('efter två byten fäller kontrollen fortfarande R-080 och R-022', () => {
      const nick = tampered(sedan, 'ny-ova', { ...nyOva, fokusomraden: ['nickspel'] });
      expect(rulesOf(checkSession(nick))).toContain('R-080');
      expect(checkSession(nick)).toEqual(bothWays(nick).expected);

      const klubbens = contentExercise({
        id: 'ny-ova',
        passdelar: ['del-ovning'],
        spelare: { min: 2, max: 14 },
      });
      const egen = tampered(sedan, 'ny-ova', klubbens);
      expect(rulesOf(checkSession(egen))).toEqual(['R-022']);
    });

    it('applySwap vägrar ett tredje byte som skulle ge ett pass med R-080', () => {
      const nick = bankExercise({
        ...for13,
        id: 'ova-nick',
        fokusomraden: ['nickspel', 'passning-mottagning'],
        passdelar: ['del-ovning'],
      });
      expect(() => applySwap(sedan, placeOf(sedan, 'ny-ova'), nick)).toThrow(/R-104/);
    });
  });
});
