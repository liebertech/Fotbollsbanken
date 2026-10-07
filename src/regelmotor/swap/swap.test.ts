/**
 * Byte av övning (berättelse 04, R-104 och R-105), med `check/session` som orakel
 * (ADR 0011 avsnitt 7).
 */
import { describe, expect, it } from 'vitest';
import {
  applySwap,
  checkSession,
  generateSession,
  swapOptions,
  swapOptionsWithLayout,
} from '../index.ts';
import { bankExercise, gameExercise } from '../__testdata__/bank-fixtur.ts';
import { locateSwapTarget, nearestMinutes, trySwap } from './options.ts';
import type { BankExercise } from '../origin.ts';
import type { Input, ItemRef, Session } from '../types.ts';

const underlag: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 14,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

/** Exakt en användbar övning per del, alla som helgruppsmoment. */
const grundbank: BankExercise[] = [
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

/** Två korta övningar i Öva, som bara räcker till delen som två stationer. */
const stationsbank: BankExercise[] = [
  grundbank[0] as BankExercise,
  bankExercise({
    id: 'station-a',
    passdelar: ['del-ovning'],
    spelare: { min: 5, max: 8 },
    tid: { kortast: 5, rekommenderad: 6, langst: 6 },
  }),
  bankExercise({
    id: 'station-b',
    passdelar: ['del-ovning'],
    spelare: { min: 5, max: 8 },
    tid: { kortast: 5, rekommenderad: 6, langst: 6 },
  }),
  grundbank[2] as BankExercise,
  grundbank[3] as BankExercise,
];

/** Bara uppvärmning och spel. Spelet delas av en paus i två perioder (R-037). */
const periodbank: BankExercise[] = [
  grundbank[0] as BankExercise,
  gameExercise({
    id: 'spel-perioder',
    spelare: { min: 6, max: 14 },
    tid: { kortast: 16, rekommenderad: 19, langst: 22 },
  }),
];

/** En alternativ övning i Öva som uppfyller alla villkor. Skicka in det som ska skilja. */
function ovaAlternativ(overrides: Record<string, unknown> = {}): BankExercise {
  return bankExercise({
    id: 'ova-alternativ',
    namn: 'Alternativ i Öva',
    fokusomraden: ['passning-mottagning'],
    passdelar: ['del-ovning'],
    spelare: { min: 2, max: 14 },
    tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    ...overrides,
  });
}

function session(input: Input, bank: readonly BankExercise[], seed = 'fro-1'): Session {
  const result = generateSession(input, bank, seed);
  if (result.kind !== 'session') {
    throw new Error(`inget pass skapades: ${JSON.stringify(result.reason)}`);
  }
  return result.session;
}

/** Platsen i passet där övningen ligger. */
function refOf(value: Session, id: string): ItemRef {
  const row = value.rows.find((item) => item.exercise?.id === id);
  if (row?.block === null || row?.block === undefined) {
    throw new Error(`${id} finns inte i passet`);
  }
  return { block: row.block, station: row.kind === 'station' ? row.station : null };
}

/** Momentets tid i passet, med perioderna hopräknade. */
function blockMinutes(value: Session, ref: ItemRef): number {
  return locateSwapTarget(value, ref).minutes;
}

function ids(list: readonly { id: string }[]): string[] {
  return list.map((item) => item.id);
}

describe('R-104 Vilka övningar som kan ersätta en övning', () => {
  const pass = session(underlag, grundbank);
  const ova = refOf(pass, 'ova-passa');

  it('R-104 visar en övning ur banken som uppfyller alla villkor', () => {
    const alternativ = ovaAlternativ();
    expect(ids(swapOptions(pass, ova, [...grundbank, alternativ]))).toEqual(['ova-alternativ']);
  });

  it('R-104 sorterar alternativen på id, oberoende av bankens ordning', () => {
    const b = ovaAlternativ({ id: 'b-alternativ' });
    const a = ovaAlternativ({ id: 'a-alternativ' });
    expect(ids(swapOptions(pass, ova, [b, a]))).toEqual(['a-alternativ', 'b-alternativ']);
    expect(ids(swapOptions(pass, ova, [a, b]))).toEqual(['a-alternativ', 'b-alternativ']);
  });

  it('R-104 villkor 1 prövar grundfiltret: ålder, spelform och nivå (R-023, R-024, R-025)', () => {
    const target = locateSwapTarget(pass, ova);
    const fel = [
      ovaAlternativ({ id: 'fel-alder', alder: { min: 13, max: 14 } }),
      ovaAlternativ({ id: 'fel-spelform', spelformer: ['9mot9'] }),
      ovaAlternativ({ id: 'fel-niva', niva: ['niva-3'] }),
    ];
    expect(fel.map((item) => trySwap(pass, target, item))).toEqual([
      { ok: false, rejection: { villkor: 1, regel: 'R-023' } },
      { ok: false, rejection: { villkor: 1, regel: 'R-024' } },
      { ok: false, rejection: { villkor: 1, regel: 'R-025' } },
    ]);
    expect(swapOptions(pass, ova, fel)).toEqual([]);
  });

  it('R-104 villkor 1 prövar ytan när ledaren har valt en yta (R-092)', () => {
    const medYta = session({ ...underlag, yta: 'yta-halv' }, grundbank);
    const ref = refOf(medYta, 'ova-passa');
    const forStor = ovaAlternativ({ id: 'for-stor', yta: { alla: { langd: 80, bredd: 60 } } });
    const passar = ovaAlternativ({ id: 'passar', yta: { alla: { langd: 20, bredd: 20 } } });
    expect(trySwap(medYta, locateSwapTarget(medYta, ref), forStor)).toEqual({
      ok: false,
      rejection: { villkor: 1, regel: 'R-092' },
    });
    expect(ids(swapOptions(medYta, ref, [forStor, passar]))).toEqual(['passar']);
    // Utan vald yta prövas ingen yta (R-090).
    expect(ids(swapOptions(pass, ova, [forStor, passar]))).toEqual(['for-stor', 'passar']);
  });

  it('R-104 villkor 2 kräver att övningen är märkt med samma del som X ligger i (R-028)', () => {
    const fel = ovaAlternativ({ id: 'bara-spelovning', passdelar: ['del-spelovning'] });
    const target = locateSwapTarget(pass, ova);
    expect(trySwap(pass, target, fel)).toEqual({
      ok: false,
      rejection: { villkor: 2, regel: 'R-028' },
    });
  });

  it('R-104 villkor 3 kräver att övningen i kärnan träffar valt fokus (R-041)', () => {
    const annatFokus = ovaAlternativ({ id: 'dribbla', fokusomraden: ['dribbling'] });
    const target = locateSwapTarget(pass, ova);
    expect(trySwap(pass, target, annatFokus)).toEqual({
      ok: false,
      rejection: { villkor: 3, regel: 'R-041' },
    });
  });

  it('R-104 villkor 3 gäller inte utanför kärnan: uppvärmningen får ha annat fokus', () => {
    const uppvarmning = refOf(pass, 'uppvarmning-passa');
    const annatFokus = ovaAlternativ({
      id: 'uppvarmning-dribbla',
      fokusomraden: ['dribbling'],
      passdelar: ['del-uppvarmning'],
    });
    expect(ids(swapOptions(pass, uppvarmning, [annatFokus]))).toEqual(['uppvarmning-dribbla']);
  });

  it('R-104 villkor 3 prövas mot delens ersättningsfokus när delen har ett (R-121)', () => {
    const lekbank: BankExercise[] = [
      bankExercise({
        id: 'lek-uppvarmning',
        fokusomraden: ['lek'],
        passdelar: ['del-uppvarmning'],
        spelare: { min: 2, max: 14 },
        tid: { kortast: 8, rekommenderad: 10, langst: 12 },
      }),
      ovaAlternativ({ id: 'dribbling-ova', fokusomraden: ['dribbling'] }),
      grundbank[2] as BankExercise,
      grundbank[3] as BankExercise,
    ];
    const lekpass = session({ ...underlag, fokus: ['lek'] }, lekbank);
    const del = lekpass.parts.find((item) => item.part === 'del-ovning');
    expect(del?.substituteFocus).toBe('dribbling');

    const ref = refOf(lekpass, 'dribbling-ova');
    const dribbling = ovaAlternativ({ id: 'mer-dribbling', fokusomraden: ['dribbling'] });
    const passning = ovaAlternativ({ id: 'passning', fokusomraden: ['passning-mottagning'] });
    expect(ids(swapOptions(lekpass, ref, [dribbling, passning]))).toEqual(['mer-dribbling']);
  });

  it('R-104 villkor 4 kräver att grupperna går att bilda (R-058, fast storlek utan lösning)', () => {
    const fyraUtanLosning = ovaAlternativ({
      id: 'fyra-utan-losning',
      grupptyp: 'fast-storlek',
      spelare: { min: 4, max: 4 },
      udda_antal_losning: false,
    });
    // 14 spelare går inte jämnt upp i grupper om 4.
    const target = locateSwapTarget(pass, ova);
    expect(trySwap(pass, target, fyraUtanLosning)).toEqual({
      ok: false,
      rejection: { villkor: 4, regel: 'R-058' },
    });
  });

  it('R-104 villkor 4 kräver att momentets ledare räcker (R-055)', () => {
    // 14 spelare med högst 6 per grupp blir 3 grupper, som med ledarbehov 1 kräver 3 ledare.
    const treGrupper = ovaAlternativ({
      id: 'tre-grupper',
      spelare: { min: 4, max: 6 },
      ledarbehov: 1,
    });
    const target = locateSwapTarget(pass, ova);
    expect(trySwap(pass, target, treGrupper)).toEqual({
      ok: false,
      rejection: { villkor: 4, regel: 'R-055' },
    });
    const enGrupp = ovaAlternativ({ id: 'en-grupp', ledarbehov: 1, spelare: { min: 2, max: 14 } });
    // Taket per ledare är 8 för fas-10-12, så 14 spelare blir 2 grupper och 2 ledare.
    expect(trySwap(pass, target, enGrupp).ok).toBe(true);
  });

  it('R-104 villkor 5 visar inte en övning som redan finns någon annanstans i passet (R-070)', () => {
    const iUppvarmningen = grundbank[0] as BankExercise;
    const ocksaIOva = bankExercise({
      ...iUppvarmningen,
      passdelar: ['del-uppvarmning', 'del-ovning'],
      fokusomraden: ['passning-mottagning'],
    });
    const target = locateSwapTarget(pass, ova);
    expect(trySwap(pass, target, ocksaIOva)).toEqual({
      ok: false,
      rejection: { villkor: 5, regel: 'R-070' },
    });
  });

  it('R-104 visar inte X själv som alternativ', () => {
    expect(swapOptions(pass, ova, grundbank)).toEqual([]);
  });

  it('R-104 lämnar X kvar när inget alternativ finns (berättelse 04, kriterium 3)', () => {
    const fore = structuredClone(pass);
    expect(swapOptions(pass, ova, grundbank)).toEqual([]);
    expect(pass).toEqual(fore);
  });

  it('R-104 kastar när ett ref inte pekar på en övning', () => {
    expect(() => swapOptions(pass, { block: 99, station: null }, grundbank)).toThrow();
  });
});

describe('R-104 i ett stationsmoment', () => {
  const pass = session(underlag, stationsbank);
  const stationA = refOf(pass, 'station-a');

  it('passet har två stationer i Öva, var för sig utbytbara', () => {
    expect(stationA.station).toBe(1);
    expect(refOf(pass, 'station-b').station).toBe(2);
  });

  it('R-104 villkor 4 och R-065: alternativet måste rymma stationstiden t', () => {
    const t = blockMinutes(pass, stationA);
    expect(t).toBe(5);
    const forLang = ovaAlternativ({
      id: 'minst-sex',
      tid: { kortast: 6, rekommenderad: 8, langst: 10 },
    });
    const ryms = ovaAlternativ({ id: 'ryms', tid: { kortast: 5, rekommenderad: 8, langst: 10 } });
    const target = locateSwapTarget(pass, stationA);
    expect(trySwap(pass, target, forLang)).toEqual({
      ok: false,
      rejection: { villkor: 4, regel: 'R-065' },
    });
    expect(ids(swapOptions(pass, stationA, [forLang, ryms]))).toEqual(['ryms']);
  });

  it('R-104 villkor 4 och R-063: alternativet måste rymma stationsgruppen', () => {
    // Stationsgrupperna är 7 spelare.
    const forLiten = ovaAlternativ({ id: 'hogst-sex', spelare: { min: 2, max: 6 } });
    const target = locateSwapTarget(pass, stationA);
    expect(trySwap(pass, target, forLiten)).toEqual({
      ok: false,
      rejection: { villkor: 4, regel: 'R-063' },
    });
  });

  it('R-104 villkor 4 och R-064: stationerna får inte kräva fler ledare än underlaget har', () => {
    const tvaLedare = ovaAlternativ({
      id: 'tva-ledare',
      ledarbehov: 2,
      tid: { kortast: 5, rekommenderad: 8, langst: 10 },
    });
    const target = locateSwapTarget(pass, stationA);
    expect(trySwap(pass, target, tvaLedare)).toEqual({
      ok: false,
      rejection: { villkor: 4, regel: 'R-064' },
    });
  });

  it('R-104 villkor 5: den andra stationens övning är inget alternativ (R-070, R-062)', () => {
    const target = locateSwapTarget(pass, stationA);
    expect(trySwap(pass, target, stationsbank[2] as BankExercise)).toEqual({
      ok: false,
      rejection: { villkor: 5, regel: 'R-070' },
    });
  });

  it('R-105 ger Y stationstiden t och lämnar momentets tid oförändrad', () => {
    const ryms = ovaAlternativ({ id: 'ryms', tid: { kortast: 5, rekommenderad: 8, langst: 10 } });
    const efter = applySwap(pass, stationA, ryms);
    const rad = efter.rows.find((row) => row.exercise?.id === 'ryms');
    expect(rad?.kind).toBe('station');
    expect(rad?.station).toBe(1);
    expect(rad?.stationMinutes).toBe(5);
    expect(efter.totalMinutes).toBe(pass.totalMinutes);
    expect(checkSession(efter)).toEqual([]);
  });

  it('swapOptionsWithLayout ger stationens gruppindelning, samma som bytet ger raden', () => {
    const ryms = ovaAlternativ({ id: 'ryms', tid: { kortast: 5, rekommenderad: 8, langst: 10 } });
    const option = swapOptionsWithLayout(pass, stationA, [...stationsbank, ryms]).find(
      (item) => item.exercise.id === 'ryms',
    );
    const rad = applySwap(pass, stationA, ryms).rows.find((row) => row.exercise?.id === 'ryms');
    expect(option?.layout).toEqual(rad?.layout);
  });
});

describe('R-082 Nicktaket efter byte', () => {
  const nickunderlag: Input = {
    alder: 13,
    spelform: '9mot9',
    niva: 'niva-2',
    spelare: 14,
    ledare: 2,
    passlangd: 60,
    fokus: ['passning-mottagning', 'nickspel'],
  };
  const tretton = { alder: { min: 13, max: 14 }, spelformer: ['9mot9'] };
  const nickbank: BankExercise[] = [
    bankExercise({
      ...tretton,
      id: 'nick-uppvarmning',
      fokusomraden: ['nickspel', 'passning-mottagning'],
      passdelar: ['del-uppvarmning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 9, rekommenderad: 10, langst: 10 },
    }),
    bankExercise({
      ...tretton,
      id: 'ova-tretton',
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 5, rekommenderad: 15, langst: 20 },
    }),
    bankExercise({
      ...tretton,
      id: 'spelovning-tretton',
      passdelar: ['del-spelovning'],
      grupptyp: 'tva-lag',
      spelare: { min: 4, max: 14 },
      tid: { kortast: 5, rekommenderad: 15, langst: 20 },
    }),
    gameExercise({
      ...tretton,
      id: 'spel-tretton',
      spelare: { min: 6, max: 14 },
      tid: { kortast: 10, rekommenderad: 20, langst: 35 },
    }),
  ];

  it('R-082 visar inte en nickövning som tar passet över taket med sin nya tid', () => {
    const pass = session(nickunderlag, nickbank);
    expect(checkSession(pass)).toEqual([]);
    const ova = refOf(pass, 'ova-tretton');
    const nick = bankExercise({
      ...tretton,
      id: 'nick-ova',
      fokusomraden: ['passning-mottagning', 'nickspel'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 5, rekommenderad: 5, langst: 5 },
    });
    // Uppvärmningen har redan minst 9 minuter nickning, och 9 + 5 > 10 för fas-13-14.
    expect(trySwap(pass, locateSwapTarget(pass, ova), nick)).toEqual({
      ok: false,
      rejection: { villkor: 1, regel: 'R-082' },
    });

    // Byts uppvärmningen bort först ryms nickövningen.
    const uppvarmning = refOf(pass, 'nick-uppvarmning');
    const utanNick = bankExercise({
      ...tretton,
      id: 'uppvarmning-utan-nick',
      passdelar: ['del-uppvarmning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 9, rekommenderad: 10, langst: 10 },
    });
    const efter = applySwap(pass, uppvarmning, utanNick);
    expect(ids(swapOptions(efter, ova, [nick]))).toEqual(['nick-ova']);
  });
});

describe('R-086 Nickövningar vid byte', () => {
  const tretton = { alder: { min: 13, max: 14 }, spelformer: ['9mot9'] };
  const bank: BankExercise[] = [
    bankExercise({
      ...tretton,
      id: 'ova-tretton',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 14 },
      tid: { kortast: 5, rekommenderad: 10, langst: 15 },
    }),
    bankExercise({
      ...tretton,
      id: 'spelovning-tretton',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-spelovning'],
      grupptyp: 'tva-lag',
      spelare: { min: 4, max: 14 },
      tid: { kortast: 5, rekommenderad: 15, langst: 20 },
    }),
    gameExercise({
      ...tretton,
      id: 'spel-tretton',
      spelare: { min: 6, max: 14 },
      tid: { kortast: 10, rekommenderad: 20, langst: 35 },
    }),
  ];
  const utanNick: Input = {
    alder: 13,
    spelform: '9mot9',
    niva: 'niva-2',
    spelare: 14,
    ledare: 2,
    passlangd: 60,
    fokus: ['passning-mottagning'],
  };
  const nick = bankExercise({
    ...tretton,
    id: 'nick-ova',
    fokusomraden: ['passning-mottagning', 'nickspel'],
    passdelar: ['del-ovning'],
    spelare: { min: 2, max: 14 },
    tid: { kortast: 5, rekommenderad: 5, langst: 5 },
  });

  it('R-086 trySwap nekar en nickövning när ledaren inte har valt nickspel, och visar den inte', () => {
    const pass = session(utanNick, bank);
    const ova = refOf(pass, 'ova-tretton');
    expect(trySwap(pass, locateSwapTarget(pass, ova), nick)).toEqual({
      ok: false,
      rejection: { villkor: 1, regel: 'R-086' },
    });
    expect(ids(swapOptions(pass, ova, [nick]))).toEqual([]);
  });

  it('R-086 visar nickövningen när ledaren har valt nickspel och taket håller', () => {
    const medNick: Input = { ...utanNick, fokus: ['passning-mottagning', 'nickspel'] };
    const pass = session(medNick, bank);
    const ova = refOf(pass, 'ova-tretton');
    expect(ids(swapOptions(pass, ova, [nick]))).toEqual(['nick-ova']);
  });
});

describe('R-105 Tid efter byte', () => {
  const pass = session(underlag, grundbank);
  const ova = refOf(pass, 'ova-passa');
  const tid = blockMinutes(pass, ova);

  it('R-105 väljer den tid som ligger närmast, och den kortare vid lika avstånd', () => {
    expect(nearestMinutes([5, 6, 7], 10)).toBe(7);
    expect(nearestMinutes([12, 13], 10)).toBe(12);
    expect(nearestMinutes([8, 12], 10)).toBe(8);
    expect(nearestMinutes([12, 8], 10)).toBe(8);
    expect(nearestMinutes([], 10)).toBeNull();
  });

  it('R-105 ger Y samma tid som X när den ligger inom Y:s gränser', () => {
    const efter = applySwap(
      pass,
      ova,
      ovaAlternativ({ tid: { kortast: 5, rekommenderad: 8, langst: 15 } }),
    );
    expect(blockMinutes(efter, ova)).toBe(tid);
    expect(efter.totalMinutes).toBe(pass.totalMinutes);
  });

  it('R-105 ger Y sin kortaste tid när X:s tid ligger under Y:s gränser', () => {
    const lang = ovaAlternativ({ tid: { kortast: tid + 3, rekommenderad: tid + 3, langst: 15 } });
    const efter = applySwap(pass, ova, lang);
    expect(blockMinutes(efter, ova)).toBe(tid + 3);
    expect(efter.totalMinutes).toBe(pass.totalMinutes + 3);
  });

  it('R-105 ger Y sin längsta tid när X:s tid ligger över Y:s gränser', () => {
    const kort = ovaAlternativ({ tid: { kortast: 5, rekommenderad: 5, langst: 5 } });
    const efter = applySwap(pass, ova, kort);
    expect(blockMinutes(efter, ova)).toBe(5);
    expect(efter.totalMinutes).toBe(pass.totalMinutes - (tid - 5));
    const del = efter.parts.find((item) => item.part === 'del-ovning');
    expect(del?.minutes).toBe(5);
  });

  it('R-105 kontrollerar inte R-035 och R-036 efter bytet, men passet visar den nya totaltiden', () => {
    const kort = ovaAlternativ({ tid: { kortast: 5, rekommenderad: 5, langst: 5 } });
    const efter = applySwap(pass, ova, kort);
    expect(efter.swapped).toBe(true);
    expect(checkSession(efter)).toEqual([]);
    // Samma pass utan märket fälls av R-035, så det är märket som lyfter kontrollen.
    const problem = checkSession({ ...efter, swapped: false });
    expect(problem.some((text) => text.startsWith('R-035'))).toBe(true);
  });

  it('R-105 delar ett spel med paus i perioder efter den nya tiden (R-037)', () => {
    const periodpass = session(underlag, periodbank);
    const spel = refOf(periodpass, 'spel-perioder');
    expect(periodpass.rows.filter((row) => row.kind === 'period')).toHaveLength(2);
    const langre = gameExercise({
      id: 'langre-spel',
      spelare: { min: 6, max: 14 },
      tid: { kortast: 21, rekommenderad: 21, langst: 22 },
    });
    const efter = applySwap(periodpass, spel, langre);
    const perioder = efter.rows.filter((row) => row.kind === 'period');
    expect(perioder.map((row) => row.exercise?.id)).toEqual(['langre-spel', 'langre-spel']);
    expect(perioder.map((row) => row.minutes)).toEqual([11, 10]);
    expect(efter.rows.filter((row) => row.kind === 'break')).toHaveLength(
      periodpass.rows.filter((row) => row.kind === 'break').length,
    );
    expect(checkSession(efter)).toEqual([]);
  });
});

describe('Byte och grupperna (R-058)', () => {
  it('R-058 bildar par och en trio när en parövning byts in vid udda antal', () => {
    const udda = session({ ...underlag, spelare: 13 }, grundbank);
    const ova = refOf(udda, 'ova-passa');
    const par = ovaAlternativ({
      id: 'par',
      grupptyp: 'par',
      spelare: { min: 2, max: 2 },
      anpassning: {
        fler_spelare: 'Fler par bredvid varandra.',
        udda_antal: 'En tredje spelare tar emot och byter in.',
        ledare: 'Ledaren går runt.',
      },
    });
    const efter = applySwap(udda, ova, par);
    const rad = efter.rows.find((row) => row.exercise?.id === 'par');
    expect(rad?.layout?.groups).toBe(6);
    expect(rad?.layout?.sizes).toEqual([3, 2, 2, 2, 2, 2]);
    expect(rad?.layout?.oddSolution).toBe('trio');
    expect(rad?.layout?.oddText).toBe('En tredje spelare tar emot och byter in.');
    expect(checkSession(efter)).toEqual([]);

    // Kvalitetssäkrarens fynd 4: alternativet visas med den indelning bytet ger.
    const options = swapOptionsWithLayout(udda, ova, [...grundbank, par]);
    expect(options.map((option) => option.exercise.id)).toEqual(
      swapOptions(udda, ova, [...grundbank, par]).map((exercise) => exercise.id),
    );
    expect(options.find((option) => option.exercise.id === 'par')?.layout).toEqual(rad?.layout);
  });
});

describe('Berättelse 04: byten i följd', () => {
  const pass = session(underlag, grundbank);
  const ova = refOf(pass, 'ova-passa');
  const uppvarmning = refOf(pass, 'uppvarmning-passa');

  it('kriterium 4: flera övningar kan bytas oberoende av varandra', () => {
    const nyOva = ovaAlternativ({ id: 'ny-ova' });
    const nyUppvarmning = ovaAlternativ({ id: 'ny-uppvarmning', passdelar: ['del-uppvarmning'] });
    const bank = [...grundbank, nyOva, nyUppvarmning];
    const forst = applySwap(pass, ova, nyOva);
    expect(ids(swapOptions(forst, uppvarmning, bank))).toEqual(['ny-uppvarmning']);
    const sedan = applySwap(forst, uppvarmning, nyUppvarmning);
    expect(ids(sedan.rows.flatMap((row) => (row.exercise === null ? [] : [row.exercise])))).toEqual(
      ['ny-uppvarmning', 'ny-ova', 'spelovning-passa', 'spel-passa'],
    );
    expect(checkSession(sedan)).toEqual([]);
  });

  it('kriterium 4: den utbytta övningen kan bytas tillbaka', () => {
    const nyOva = ovaAlternativ({ id: 'ny-ova' });
    const forst = applySwap(pass, ova, nyOva);
    expect(ids(swapOptions(forst, ova, grundbank))).toEqual(['ova-passa']);
  });

  it('applySwap ändrar inte passet den får, och kastar för en övning som inte är ett alternativ', () => {
    const fore = structuredClone(pass);
    applySwap(pass, ova, ovaAlternativ());
    expect(pass).toEqual(fore);
    expect(() => applySwap(pass, ova, ovaAlternativ({ fokusomraden: ['dribbling'] }))).toThrow(
      /R-104/,
    );
  });

  it('R-084 räknar om påminnelsen om mål efter bytet', () => {
    expect(pass.notices.map((notice) => notice.kind)).not.toContain('forankrade-mal');
    const medMal = ovaAlternativ({ material: [{ typ: 'mal', antal: 2 }] });
    const efter = applySwap(pass, ova, medMal);
    expect(efter.notices.map((notice) => notice.kind)).toContain('forankrade-mal');
  });

  it('ADR 0011 steg 5: varje alternativ ger ett pass som klarar slutkontrollen', () => {
    const bank = [
      ...grundbank,
      ovaAlternativ({ id: 'kort', tid: { kortast: 5, rekommenderad: 5, langst: 5 } }),
      ovaAlternativ({ id: 'lang', tid: { kortast: 15, rekommenderad: 15, langst: 15 } }),
      ovaAlternativ({ id: 'alla-delar', passdelar: ['del-uppvarmning', 'del-ovning'] }),
      gameExercise({ id: 'annat-spel', spelare: { min: 6, max: 14 } }),
    ];
    for (const value of [pass, session(underlag, stationsbank), session(underlag, periodbank)]) {
      for (const row of value.rows) {
        if (row.exercise === null || row.block === null) {
          continue;
        }
        const ref: ItemRef = {
          block: row.block,
          station: row.kind === 'station' ? row.station : null,
        };
        for (const option of swapOptions(value, ref, bank)) {
          expect(checkSession(applySwap(value, ref, option))).toEqual([]);
        }
      }
    }
  });
});
