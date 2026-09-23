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
import type { BankExercise } from './origin.ts';

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
const testbank: BankExercise[] = [
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
const lekbank: BankExercise[] = [
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

function session(input: Input, bank: BankExercise[] = testbank, seed = 'fro-1'): Session {
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

/*
 * S-28: `checkSession` nycklar R-022 mot ursprunget (`isBankExercise`), inte bara mot
 * statusfältet, eftersom R-106 i inkrement 4 upphäver statuskravet för en egen övning som
 * ledaren byter in. Alla andra tester i den här filen bygger sina pass av `bankExercise`, så
 * `ursprung` är alltid satt och den nya grenen i `checkSession` prövas aldrig av dem. Testet
 * tar bort ursprungsmärket från en övning i ett annars giltigt pass, precis som en klubbövning
 * utan märket skulle se ut om den någonsin nådde fram till en rad.
 */
describe('R-022 Slutkontrollen prövar ursprunget, inte bara statusfältet (S-28)', () => {
  it('R-022 underkänner ett pass där en rad har en övning utan bankens ursprungsmärke', () => {
    const value = session(underlag);
    const row = value.rows.find((item) => item.part === 'del-ovning' && item.exercise !== null);
    expect(row).toBeDefined();
    const exercise = row!.exercise!;
    const exerciseId = exercise.id;
    const utanUrsprung: Exercise = { ...exercise, ursprung: undefined } as Exercise;
    const utanUrsprungSession: Session = {
      ...value,
      rows: value.rows.map((item) => (item === row ? { ...item, exercise: utanUrsprung } : item)),
    };
    expect(checkSession(utanUrsprungSession)).toContain(
      `R-022: ${exerciseId} kommer inte ur den gemensamma banken`,
    );
  });

  it('R-022 släpper igenom passet när ursprunget står kvar (jämförelsepunkt)', () => {
    // Samma pass, orört: visar att det inte är någon annan skillnad som fäller föregående test.
    expect(checkSession(session(underlag))).toEqual([]);
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

  it('R-100 andra punkten: en del som kan fyllas för sig men inte ihop med resten (R-070)', () => {
    // Övningen passar både Öva och Spelövning, men R-070 tillåter den bara på en plats.
    // Öva fylls först (post 2 i R-048), så Spelövning blir kvar utan övning, trots att den
    // för sig själv skulle kunna fyllas av exakt samma övning.
    const shared = bankExercise({
      id: 'delad-ovning',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning', 'del-spelovning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    });
    const bank = [
      testbank.find((exercise) => exercise.id === 'uppvarmning-passa')!,
      shared,
      testbank.find((exercise) => exercise.id === 'spel-passa')!,
    ];
    const value = session(underlag, bank);
    expect(exerciseIds(value, 'del-ovning')).toEqual(['delad-ovning']);
    const spelovning = value.parts.find((part) => part.part === 'del-spelovning');
    expect(spelovning?.status).toBe('saknar-ovning');
    // R-103: ingen lista med fält, eftersom orsaken inte är ett enskilt val (R-100, andra
    // punkten) utan att övningen redan behövs i Öva.
    expect(spelovning?.emptyReason).toBe('gar-inte-att-kombinera');
    expect(spelovning?.changeableFields).toEqual([]);
  });
});

describe('R-101 När inget pass skapas', () => {
  it('R-101 skapar inget pass när banken är tom', () => {
    expect(generateSession(underlag, [], 'fro').kind).toBe('none');
  });

  it('R-101 säger att ingen övning matchar när banken är tom, inte att den inte går att kombinera', () => {
    const result = generateSession(underlag, [], 'fro');
    expect(result.kind).toBe('none');
    if (result.kind === 'none') {
      expect(result.reason.cause).toBe('inget-matchar');
      expect(result.reason.changeableFields).toEqual([]);
    }
  });

  it('R-101 säger att ingen övning matchar när ingen av Öva, Spelövning och Spel kan fyllas', () => {
    // Bara uppvärmningen finns: ingen av de tre delar som krävs kan fyllas ens för sig.
    const bank = testbank.filter((exercise) => exercise.id === 'uppvarmning-passa');
    const result = generateSession(underlag, bank, 'fro');
    expect(result.kind).toBe('none');
    if (result.kind === 'none') {
      expect(result.reason.cause).toBe('inget-matchar');
    }
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
      exercise.id === 'ova-passa' ? bankExercise({ ...exercise, niva: ['niva-3'] }) : exercise,
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

  it('R-103 pekar ut val på hela underlaget, också när inget pass alls kunde skapas (kind: none)', () => {
    // Hela banken är märkt niva-3, men underlaget ber om niva-2: inget pass kan skapas alls.
    const bank = testbank.map((exercise) => bankExercise({ ...exercise, niva: ['niva-3'] }));
    const result = generateSession(underlag, bank, 'fro');
    expect(result.kind).toBe('none');
    if (result.kind === 'none') {
      expect(result.reason.changeableFields).toContain('niva');
      expect(result.reason.internalProblems).toEqual([]);
      // Orsaken och listan är två skilda uppgifter: ingen övning matchar nivån som den står,
      // men nivån är ändå ett val som var för sig skulle lösa det.
      expect(result.reason.cause).toBe('inget-matchar');
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

describe('R-072 Gränsen mellan fotbollsregler och algoritmval', () => {
  /** Två likvärdiga övningar för Öva, så att slumpen faktiskt har något att välja mellan. */
  const tiedBank: BankExercise[] = [
    ...testbank.filter((exercise) => exercise.id !== 'ova-passa'),
    bankExercise({
      id: 'ova-passa-a',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    }),
    bankExercise({
      id: 'ova-passa-b',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    }),
  ];

  it('R-072 punkt 4: samma frö ger exakt samma pass, också när flera övningar är lika bra', () => {
    const first = session(underlag, tiedBank, 'samma-fro');
    const second = session(underlag, tiedBank, 'samma-fro');
    expect(JSON.stringify(second.rows)).toBe(JSON.stringify(first.rows));
  });

  it('R-072: olika frön kan faktiskt ge olika pass när flera övningar är lika bra', () => {
    const chosen = new Set<string>();
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']) {
      const value = session(underlag, tiedBank, seed);
      for (const id of exerciseIds(value, 'del-ovning')) {
        chosen.add(id);
      }
    }
    // Slumpen väljer bara mellan ova-passa-a och ova-passa-b, som är lika bra (R-072 punkt 1).
    expect(chosen).toEqual(new Set(['ova-passa-a', 'ova-passa-b']));
  });

  it('R-072 punkt 3: golvet (R-049) gäller varje frö, även när flera övningar är lika bra', () => {
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']) {
      expect(checkSession(session(underlag, tiedBank, seed))).toEqual([]);
    }
  });
});

describe('generateSession är en ren funktion', () => {
  /** Fryser ett objekt och dess direkta listfält, så att en mutation kastar i strict mode. */
  function freeze<T extends object>(value: T): T {
    for (const entry of Object.values(value)) {
      if (Array.isArray(entry)) {
        Object.freeze(entry);
      }
    }
    return Object.freeze(value);
  }

  it('muterar varken underlaget eller övningarna i den inskickade banken', () => {
    const frozenInput = freeze({ ...underlag, fokus: [...underlag.fokus] });
    const frozenBank = Object.freeze(testbank.map((exercise) => freeze({ ...exercise })));

    expect(() => generateSession(frozenInput, frozenBank, 'fro-frys')).not.toThrow();

    // Efteråt är underlaget och banken bit för bit oförändrade.
    expect(frozenInput).toEqual({ ...underlag, fokus: [...underlag.fokus] });
    expect(frozenBank.map((exercise) => exercise.id)).toEqual(
      testbank.map((exercise) => exercise.id),
    );
  });
});
