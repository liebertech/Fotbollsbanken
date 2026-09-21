/**
 * Hela motorn mot en handbyggd testbank, med `check/session` som orakel
 * (ADR 0011 avsnitt 7).
 *
 * Testerna mot den riktiga banken i content/ovningar/ ligger i
 * scripts/regelmotor-mot-banken.test.ts, eftersom de behöver läsa filer och motorn aldrig
 * gör det själv.
 */
import { describe, expect, it } from 'vitest';
import { checkSession, generateSession } from './index.ts';
import { partCanBeFilled } from './output/explain.ts';
import { planTime } from './time/plan.ts';
import { PART_TOLERANCE, SESSION_SHORTFALL } from './keys.ts';
import { bankExercise, gameExercise } from './__testdata__/bank-fixtur.ts';
import type { Exercise, Input, Session } from './types.ts';

const underlag: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 14,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

/** En liten bank med exakt en användbar övning per del. */
const testbank: Exercise[] = [
  bankExercise({
    id: 'uppvarmning-passa',
    fokusomraden: ['koordination', 'passning-mottagning'],
    passdelar: ['del-uppvarmning'],
    spelare: { min: 2, max: 14 },
    tid: { kortast: 8, rekommenderad: 10, langst: 12 },
  }),
  bankExercise({
    id: 'ova-passa',
    fokusomraden: ['passning-mottagning'],
    passdelar: ['del-ovning'],
    spelare: { min: 2, max: 14 },
    tid: { kortast: 8, rekommenderad: 10, langst: 12 },
  }),
  bankExercise({
    id: 'spelovning-passa',
    fokusomraden: ['passning-mottagning'],
    passdelar: ['del-spelovning'],
    grupptyp: 'tva-lag',
    spelare: { min: 4, max: 14 },
    tid: { kortast: 10, rekommenderad: 12, langst: 14 },
  }),
  gameExercise({
    id: 'spel-passa',
    fokusomraden: ['passning-mottagning'],
    spelare: { min: 6, max: 14 },
    tid: { kortast: 16, rekommenderad: 19, langst: 22 },
  }),
];

/** Samma bank, men med en lek-övning i uppvärmningen och dribbling i kärnan. */
const lekbank: Exercise[] = [
  bankExercise({
    id: 'lek-uppvarmning',
    fokusomraden: ['lek'],
    passdelar: ['del-uppvarmning'],
    spelare: { min: 2, max: 14 },
    tid: { kortast: 8, rekommenderad: 10, langst: 12 },
  }),
  bankExercise({
    id: 'dribbling-ova',
    fokusomraden: ['dribbling'],
    passdelar: ['del-ovning'],
    spelare: { min: 2, max: 14 },
    tid: { kortast: 8, rekommenderad: 10, langst: 12 },
  }),
  bankExercise({
    id: 'dribbling-spelovning',
    fokusomraden: ['dribbling'],
    passdelar: ['del-spelovning'],
    grupptyp: 'tva-lag',
    spelare: { min: 4, max: 14 },
    tid: { kortast: 10, rekommenderad: 12, langst: 14 },
  }),
  gameExercise({
    id: 'spel-lek',
    fokusomraden: ['spelbarhet'],
    spelare: { min: 6, max: 14 },
    tid: { kortast: 16, rekommenderad: 19, langst: 22 },
  }),
];

function session(input: Input, bank: Exercise[] = testbank, seed = 'fro-1'): Session {
  const result = generateSession(input, bank, seed);
  if (result.kind !== 'session') {
    throw new Error(`inget pass skapades: ${JSON.stringify(result.reason)}`);
  }
  return result.session;
}

function exerciseIds(value: Session, part: string): string[] {
  return value.rows
    .filter((row) => row.part === part && row.exercise !== null)
    .map((row) => row.exercise?.id ?? '');
}

describe('R-049 Det här klarar ett genererat pass alltid', () => {
  it('R-049 lämnar ett giltigt pass: kontrollen av samtliga krav hittar inget fel', () => {
    expect(checkSession(session(underlag))).toEqual([]);
  });

  it('R-049 lämnar just det passet i en bank där bara ett pass klarar kraven', () => {
    const value = session(underlag);
    expect(exerciseIds(value, 'del-uppvarmning')).toEqual(['uppvarmning-passa']);
    expect(exerciseIds(value, 'del-ovning')).toEqual(['ova-passa']);
    expect(exerciseIds(value, 'del-spelovning')).toEqual(['spelovning-passa']);
    expect(exerciseIds(value, 'del-spel')).toEqual(['spel-passa']);
  });

  it('R-049 låter en del stå tom bara när den inte kan fyllas', () => {
    const bank = testbank.filter((exercise) => exercise.id !== 'ova-passa');
    const value = session(underlag, bank);
    for (const part of value.parts) {
      if (part.status !== 'saknar-ovning') {
        continue;
      }
      const fillable = partCanBeFilled(
        bank,
        underlag,
        'fas-10-12',
        part.part,
        part.target,
        underlag.fokus,
      );
      expect(part.emptyReason).toBe(fillable ? 'gar-inte-att-kombinera' : 'val-kan-andras');
    }
  });
});

describe('R-035 Varje del nära sin måltid', () => {
  it('R-035 håller varje fylld del inom 3 minuter från måltiden', () => {
    for (const part of session(underlag).parts) {
      if (part.status === 'fylld') {
        expect(Math.abs(part.minutes - part.target)).toBeLessThanOrEqual(PART_TOLERANCE);
      }
    }
  });
});

describe('R-036 Hela passets tid', () => {
  it('R-036 ger ett pass som är högst begärd längd och högst 5 minuter kortare', () => {
    const value = session(underlag);
    expect(value.totalMinutes).toBeLessThanOrEqual(underlag.passlangd);
    expect(value.totalMinutes).toBeGreaterThanOrEqual(underlag.passlangd - SESSION_SHORTFALL);
  });
});

describe('R-039 När en del saknas gäller inte tidsgränserna', () => {
  it('R-039 låter passet bli kortare när en del saknar övning, men håller delarnas måltider', () => {
    const bank = testbank.filter((exercise) => exercise.id !== 'ova-passa');
    const value = session(underlag, bank);
    expect(value.parts.some((part) => part.status === 'saknar-ovning')).toBe(true);
    expect(value.totalMinutes).toBeLessThan(underlag.passlangd - SESSION_SHORTFALL);
    for (const part of value.parts) {
      if (part.status === 'fylld') {
        expect(Math.abs(part.minutes - part.target)).toBeLessThanOrEqual(PART_TOLERANCE);
      }
    }
  });
});

describe('R-070 Samma övning bara en gång i ett pass', () => {
  it('R-070 lägger varje övning i högst ett moment', () => {
    const value = session(underlag);
    const blocksPerExercise = new Map<string, Set<number>>();
    for (const row of value.rows) {
      if (row.exercise === null) {
        continue;
      }
      const set = blocksPerExercise.get(row.exercise.id) ?? new Set<number>();
      set.add(row.block ?? 0);
      blocksPerExercise.set(row.exercise.id, set);
    }
    for (const set of blocksPerExercise.values()) {
      expect(set.size).toBe(1);
    }
  });
});

describe('R-100 En del som saknar övning', () => {
  it('R-100 visar delen på sin plats med sitt namn och sin måltid', () => {
    const bank = testbank.filter((exercise) => exercise.id !== 'ova-passa');
    const value = session(underlag, bank);
    const tom = value.rows.find((row) => row.kind === 'empty');
    expect(tom?.part).toBe('del-ovning');
    expect(tom?.minutes).toBe(
      planTime('fas-10-12', 60).parts.find((part) => part.part === 'del-ovning')?.target,
    );
  });
});

describe('R-101 När inget pass skapas', () => {
  it('R-101 skapar inget pass när banken är tom', () => {
    expect(generateSession(underlag, [], 'fro').kind).toBe('none');
  });

  it('R-101 skapar ett pass när bara Spel kan fyllas', () => {
    const bank = testbank.filter((exercise) => exercise.id === 'spel-passa');
    expect(generateSession(underlag, bank, 'fro').kind).toBe('session');
  });

  it('R-101 skapar inget pass när bara uppvärmningen kan fyllas', () => {
    const bank = testbank.filter((exercise) => exercise.id === 'uppvarmning-passa');
    expect(generateSession(underlag, bank, 'fro').kind).toBe('none');
  });
});

describe('R-102 Underlaget ändras aldrig av generatorn', () => {
  it('R-102 lämnar tillbaka exakt det underlag som skickades in, också med ersättningsfokus', () => {
    const input = { ...underlag, fokus: ['lek' as const] };
    const value = session(input, lekbank);
    expect(value.input).toEqual(input);
    expect(value.input.fokus).toEqual(['lek']);
  });
});

describe('R-103 Vilka val som kan ändras', () => {
  it('R-103 pekar ut val som var för sig skulle kunna ge en övning i delen', () => {
    const bank = testbank.map((exercise) =>
      exercise.id === 'ova-passa'
        ? bankExercise({ ...exercise, niva: ['niva-3'] })
        : exercise,
    );
    const value = session(underlag, bank);
    const tom = value.parts.find((part) => part.part === 'del-ovning');
    expect(tom?.status).toBe('saknar-ovning');
    expect(tom?.emptyReason).toBe('val-kan-andras');
    expect(tom?.changeableFields).toContain('niva');
  });

  it('R-103 gäller inte en del som fyllts med ett ersättningsfokus', () => {
    const value = session({ ...underlag, fokus: ['lek'] }, lekbank);
    for (const part of value.parts) {
      if (part.substituteFocus !== null) {
        expect(part.status).toBe('fylld');
        expect(part.changeableFields).toEqual([]);
      }
    }
  });
});

describe('R-121 Närliggande fokusområde när kärnan annars blir tom', () => {
  it('R-121 fyller kärnan med ett närliggande fokus och talar om vilket som saknades', () => {
    const value = session({ ...underlag, fokus: ['lek'] }, lekbank);
    const ova = value.parts.find((part) => part.part === 'del-ovning');
    const spelovning = value.parts.find((part) => part.part === 'del-spelovning');
    expect(ova?.substituteFocus).toBe('dribbling');
    expect(spelovning?.substituteFocus).toBe('dribbling');
    expect(ova?.missingFocus).toEqual(['lek']);
    expect(ova?.status).toBe('fylld');
  });

  it('R-121 ger inget ersättningsfokus när valt fokus räcker', () => {
    expect(session(underlag).parts.every((part) => part.substituteFocus === null)).toBe(true);
  });

  it('R-041 låter övningarna i delen träffa ersättningsfokuset', () => {
    const value = session({ ...underlag, fokus: ['lek'] }, lekbank);
    for (const part of ['del-ovning', 'del-spelovning'] as const) {
      const substitute = value.parts.find((item) => item.part === part)?.substituteFocus;
      if (substitute === null || substitute === undefined) {
        continue;
      }
      for (const row of value.rows.filter((item) => item.part === part)) {
        if (row.exercise !== null) {
          expect(row.exercise.fokusomraden).toContain(substitute);
        }
      }
    }
  });
});

describe('R-021 Många spelare per ledare', () => {
  it('R-021 visar tipset när N är större än L gånger taket per ledare', () => {
    const under = session({ ...underlag, spelare: 12, ledare: 1 });
    expect(under.notices.some((notice) => notice.kind === 'fler-vuxna')).toBe(false);
    const over = session({ ...underlag, spelare: 14, ledare: 1 });
    expect(over.notices.some((notice) => notice.kind === 'fler-vuxna')).toBe(true);
  });
});

describe('R-084 Påminnelse om mål', () => {
  it('R-084 visar påminnelsen bara när en övning har mål i sitt material', () => {
    const utanMal = session(underlag);
    expect(utanMal.notices.some((notice) => notice.kind === 'forankrade-mal')).toBe(false);

    const medMal = testbank.map((exercise) =>
      exercise.id === 'spel-passa'
        ? bankExercise({ ...exercise, material: [{ typ: 'minimal', antal: 2 }] })
        : exercise,
    );
    const value = session(underlag, medMal);
    expect(value.notices.some((notice) => notice.kind === 'forankrade-mal')).toBe(true);
  });
});

describe('R-085 Påminnelse om benskydd', () => {
  it('R-085 visar påminnelsen i varje pass', () => {
    expect(session(underlag).notices.some((notice) => notice.kind === 'benskydd')).toBe(true);
  });
});

describe('R-029 Varianterna visas alltid', () => {
  it('R-029 bär med sig båda varianterna i ögonblicksbilden', () => {
    for (const row of session(underlag).rows) {
      if (row.exercise !== null) {
        expect(row.exercise.varianter?.lattare).toBeTruthy();
        expect(row.exercise.varianter?.svarare).toBeTruthy();
      }
    }
  });
});

describe('R-031 Fasta inslag', () => {
  it('R-031 har alltid avslutningen sist och alla vattenpauser kvar', () => {
    const value = session(underlag);
    const plan = planTime('fas-10-12', 60);
    expect(value.rows.at(-1)?.kind).toBe('closing');
    expect(value.rows.filter((row) => row.kind === 'break')).toHaveLength(plan.breakCount);
  });
});

describe('R-030 Delar och ordning', () => {
  it('R-030 visar delarna i passets ordning', () => {
    const parts = session(underlag)
      .rows.map((row) => row.part)
      .filter((part): part is NonNullable<typeof part> => part !== null);
    const unika = [...new Set(parts)];
    expect(unika).toEqual([
      'del-uppvarmning',
      'del-ovning',
      'del-spelovning',
      'del-spel',
      'del-avslutning',
    ]);
  });
});
