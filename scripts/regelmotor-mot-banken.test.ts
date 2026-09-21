/**
 * Motorn mot den riktiga banken i content/ovningar/.
 *
 * Testet ligger här och inte i src/, eftersom det läser filer. Motorn gör det aldrig själv:
 * den får banken inskickad (ADR 0011 avsnitt 1).
 */
import { describe, expect, it } from 'vitest';
import { loadBank } from './bank.ts';
import { checkSession, generateSession, selectableFocusAreas } from '../src/regelmotor/index.ts';
import {
  PART_TOLERANCE,
  SESSION_LENGTH_MAX,
  SESSION_SHORTFALL,
  allowedGameFormats,
  phaseForAge,
} from '../src/regelmotor/keys.ts';
import type { Input } from '../src/regelmotor/types.ts';

const banken = loadBank().exercises;

const underlag: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 14,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

function session(input: Input, seed = 'fro-1') {
  const result = generateSession(input, banken, seed);
  if (result.kind !== 'session') {
    throw new Error(`inget pass skapades: ${JSON.stringify(result.reason)}`);
  }
  return result.session;
}

describe('R-022 Bara godkända övningar ur den gemensamma banken', () => {
  it('R-022 läser bara godkända övningar ur content/ovningar/', () => {
    const { exercises, problems } = loadBank();
    expect(problems).toEqual([]);
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises.every((exercise) => exercise.status === 'godkand')).toBe(true);
  });
});

describe('R-049 Det här klarar ett genererat pass alltid', () => {
  it('R-049 ger ett pass som klarar kontrollen av samtliga krav', () => {
    expect(checkSession(session(underlag))).toEqual([]);
  });

  it(
    'R-049 ger ett pass som klarar kontrollen för varje underlag banken räcker till',
    { timeout: 60_000 },
    () => {
      let skapade = 0;
      for (const alder of [9, 11]) {
        const phase = phaseForAge(alder);
        if (phase === undefined) {
          continue;
        }
        for (const spelform of allowedGameFormats(alder)) {
          for (const niva of ['niva-1', 'niva-2', 'niva-3'] as const) {
            for (const spelare of [8, 12, 14, 20]) {
              for (const ledare of [1, 2, 4]) {
                for (const passlangd of [30, 60, Math.min(75, SESSION_LENGTH_MAX[phase])]) {
                  for (const fokus of selectableFocusAreas(phase, alder).map((item) => [item])) {
                    const input: Input = {
                      alder,
                      spelform,
                      niva,
                      spelare,
                      ledare,
                      passlangd,
                      fokus,
                    };
                    const result = generateSession(input, banken, 'fro');
                    if (result.kind === 'none') {
                      // Kontrollen får aldrig vara skälet till att inget pass skapades.
                      expect(result.reason.internalProblems).toEqual([]);
                      continue;
                    }
                    skapade += 1;
                    expect(checkSession(result.session)).toEqual([]);
                  }
                }
              }
            }
          }
        }
      }
      expect(skapade).toBeGreaterThan(100);
    },
  );
});

describe('R-072 Gränsen mellan fotbollsregler och algoritmval', () => {
  it('R-072 ger samma pass för samma frö', () => {
    expect(JSON.stringify(session(underlag, 'fro-a').rows)).toBe(
      JSON.stringify(session(underlag, 'fro-a').rows),
    );
  });

  it('R-072 ger samma pass oavsett vilken ordning banken kommer i', () => {
    const blandad = [...banken].reverse();
    const forsta = generateSession(underlag, banken, 'fro-b');
    const andra = generateSession(underlag, blandad, 'fro-b');
    expect(forsta.kind).toBe('session');
    expect(andra.kind).toBe('session');
    if (forsta.kind === 'session' && andra.kind === 'session') {
      expect(JSON.stringify(andra.session.rows)).toBe(JSON.stringify(forsta.session.rows));
    }
  });

  it('R-072 ger ett pass som klarar kraven för varje frö', () => {
    for (const seed of ['1', '2', '3', '4', '5', '6', '7', '8']) {
      expect(checkSession(session(underlag, seed))).toEqual([]);
    }
  });
});

describe('R-035 Varje del nära sin måltid', () => {
  it('R-035 och R-036 håller tiderna mot den riktiga banken', () => {
    const value = session(underlag);
    for (const part of value.parts) {
      if (part.status === 'fylld') {
        expect(Math.abs(part.minutes - part.target)).toBeLessThanOrEqual(PART_TOLERANCE);
      }
    }
    expect(value.totalMinutes).toBeLessThanOrEqual(underlag.passlangd);
    expect(value.totalMinutes).toBeGreaterThanOrEqual(underlag.passlangd - SESSION_SHORTFALL);
  });
});

describe('R-121 Närliggande fokusområde när kärnan annars blir tom', () => {
  it('R-121 testfallet i regeln: lek för 11 år ger dribbling i kärnan', () => {
    const value = session({ ...underlag, fokus: ['lek'] });
    expect(value.parts.find((part) => part.part === 'del-ovning')?.substituteFocus).toBe(
      'dribbling',
    );
    expect(value.parts.find((part) => part.part === 'del-spelovning')?.substituteFocus).toBe(
      'dribbling',
    );
    expect(value.input.fokus).toEqual(['lek']);
  });

  it('R-121 ger inget ersättningsfokus när banken har övningar för valt fokus', () => {
    expect(session(underlag).parts.every((part) => part.substituteFocus === null)).toBe(true);
  });
});

describe('R-101 När inget pass skapas', () => {
  it('R-101 skapar inget pass för en spelform som banken saknar övningar för', () => {
    const result = generateSession(
      { ...underlag, alder: 16, spelform: '11mot11', fokus: ['avslut'], passlangd: 90 },
      banken,
      'fro',
    );
    expect(result.kind).toBe('none');
    if (result.kind === 'none') {
      expect(result.reason.internalProblems).toEqual([]);
    }
  });
});
