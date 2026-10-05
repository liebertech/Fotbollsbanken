/**
 * Byte av övning vid gränsvärden som den övriga sviten inte prövar: åldrarna 6 och 19 år
 * (fasernas ytterkanter, R-011), en ensam ledare jämfört med flera, och stationer med fler
 * än minsta antal ledare. `swap.test.ts` prövar själva reglerna i R-104 och R-105 i detalj;
 * den här filen visar att samma kod fungerar vid ändarna av de intervall reglerna definierar.
 *
 * Kvalitetssäkring, 2026-10-05, inkrement 2b (byta övning).
 */
import { describe, expect, it } from 'vitest';
import { applySwap, checkSession, generateSession, swapOptions } from '../index.ts';
import { bankExercise, gameExercise } from '../__testdata__/bank-fixtur.ts';
import { locateSwapTarget, trySwap } from './options.ts';
import type { BankExercise } from '../origin.ts';
import type { Input, ItemRef, Session } from '../types.ts';

function session(input: Input, bank: readonly BankExercise[], seed = 'fro-1'): Session {
  const result = generateSession(input, bank, seed);
  if (result.kind !== 'session') {
    throw new Error(`inget pass skapades: ${JSON.stringify(result.reason)}`);
  }
  return result.session;
}

function refOf(value: Session, id: string): ItemRef {
  const row = value.rows.find((item) => item.exercise?.id === id);
  if (row?.block === null || row?.block === undefined) {
    throw new Error(`${id} finns inte i passet`);
  }
  return { block: row.block, station: row.kind === 'station' ? row.station : null };
}

function ids(list: readonly { id: string }[]): string[] {
  return list.map((item) => item.id);
}

describe('Byte vid den nedre åldersgränsen, 6 år (fas-6-7, 3 mot 3)', () => {
  const underlag: Input = {
    alder: 6,
    spelform: '3mot3',
    niva: 'niva-1',
    spelare: 6,
    ledare: 1,
    passlangd: 45,
    fokus: ['passning-mottagning'],
  };
  const bank: BankExercise[] = [
    bankExercise({
      id: 'uppvarmning-6',
      alder: { min: 6, max: 7 },
      spelformer: ['3mot3'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-uppvarmning'],
      spelare: { min: 2, max: 6 },
      tid: { kortast: 5, rekommenderad: 6, langst: 8 },
    }),
    bankExercise({
      id: 'ova-6',
      alder: { min: 6, max: 7 },
      spelformer: ['3mot3'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 6 },
      tid: { kortast: 5, rekommenderad: 6, langst: 8 },
    }),
    bankExercise({
      id: 'spelovning-6',
      alder: { min: 6, max: 7 },
      spelformer: ['3mot3'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-spelovning'],
      grupptyp: 'tva-lag',
      spelare: { min: 4, max: 6 },
      tid: { kortast: 5, rekommenderad: 6, langst: 8 },
    }),
    gameExercise({
      id: 'spel-6',
      alder: { min: 6, max: 7 },
      spelformer: ['3mot3'],
      fokusomraden: ['passning-mottagning'],
      spelare: { min: 4, max: 6 },
      tid: { kortast: 10, rekommenderad: 12, langst: 14 },
    }),
  ];

  it('ger ett alternativ som går att byta in, och passet klarar slutkontrollen', () => {
    const pass = session(underlag, bank);
    const ova = refOf(pass, 'ova-6');
    const alternativ = bankExercise({
      id: 'ova-6-alt',
      alder: { min: 6, max: 7 },
      spelformer: ['3mot3'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 6 },
      tid: { kortast: 5, rekommenderad: 6, langst: 8 },
    });
    expect(ids(swapOptions(pass, ova, [...bank, alternativ]))).toEqual(['ova-6-alt']);
    const efter = applySwap(pass, ova, alternativ);
    expect(checkSession(efter)).toEqual([]);
  });

  it('R-023 nekar ett alternativ som inte täcker 6-åringar, precis vid gränsen', () => {
    const pass = session(underlag, bank);
    const ova = refOf(pass, 'ova-6');
    // Minsta ålder 7 täcker inte en 6-åring, fast bara med ett år.
    const forGammal = bankExercise({
      id: 'ova-6-for-gammal',
      alder: { min: 7, max: 9 },
      spelformer: ['3mot3'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 6 },
      tid: { kortast: 5, rekommenderad: 6, langst: 8 },
    });
    expect(trySwap(pass, locateSwapTarget(pass, ova), forGammal)).toEqual({
      ok: false,
      rejection: { villkor: 1, regel: 'R-023' },
    });
  });
});

describe('Byte vid den övre åldersgränsen, 19 år (fas-15-19, 11 mot 11)', () => {
  const underlag: Input = {
    alder: 19,
    spelform: '11mot11',
    niva: 'niva-2',
    spelare: 20,
    ledare: 2,
    passlangd: 90,
    fokus: ['passning-mottagning'],
  };
  const bank: BankExercise[] = [
    bankExercise({
      id: 'uppvarmning-19',
      alder: { min: 15, max: 19 },
      spelformer: ['11mot11'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-uppvarmning'],
      spelare: { min: 2, max: 20 },
      tid: { kortast: 10, rekommenderad: 15, langst: 20 },
    }),
    bankExercise({
      id: 'ova-19',
      alder: { min: 15, max: 19 },
      spelformer: ['11mot11'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 20 },
      tid: { kortast: 10, rekommenderad: 12, langst: 20 },
    }),
    bankExercise({
      id: 'spelovning-19',
      alder: { min: 15, max: 19 },
      spelformer: ['11mot11'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-spelovning'],
      grupptyp: 'tva-lag',
      spelare: { min: 4, max: 20 },
      tid: { kortast: 10, rekommenderad: 15, langst: 20 },
    }),
    gameExercise({
      id: 'spel-19',
      alder: { min: 15, max: 19 },
      spelformer: ['11mot11'],
      fokusomraden: ['passning-mottagning'],
      spelare: { min: 6, max: 20 },
      tid: { kortast: 20, rekommenderad: 30, langst: 45 },
    }),
  ];

  it('ger ett alternativ som går att byta in, och passet klarar slutkontrollen', () => {
    const pass = session(underlag, bank);
    const ova = refOf(pass, 'ova-19');
    const alternativ = bankExercise({
      id: 'ova-19-alt',
      alder: { min: 15, max: 19 },
      spelformer: ['11mot11'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 20 },
      tid: { kortast: 10, rekommenderad: 12, langst: 20 },
    });
    expect(ids(swapOptions(pass, ova, [...bank, alternativ]))).toEqual(['ova-19-alt']);
    const efter = applySwap(pass, ova, alternativ);
    expect(checkSession(efter)).toEqual([]);
  });

  it('R-023 nekar ett alternativ som inte täcker 19-åringar, precis vid gränsen', () => {
    const pass = session(underlag, bank);
    const ova = refOf(pass, 'ova-19');
    // Högsta ålder 18 täcker inte en 19-åring, fast bara med ett år.
    const forUng = bankExercise({
      id: 'ova-19-for-ung',
      alder: { min: 15, max: 18 },
      spelformer: ['11mot11'],
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 20 },
      tid: { kortast: 10, rekommenderad: 12, langst: 20 },
    });
    expect(trySwap(pass, locateSwapTarget(pass, ova), forUng)).toEqual({
      ok: false,
      rejection: { villkor: 1, regel: 'R-023' },
    });
  });
});

describe('Byte med en ensam ledare jämfört med flera (R-055, R-064)', () => {
  const grundunderlag: Input = {
    alder: 11,
    spelform: '7mot7',
    niva: 'niva-2',
    spelare: 6,
    ledare: 1,
    passlangd: 60,
    fokus: ['passning-mottagning'],
  };
  const bank: BankExercise[] = [
    bankExercise({
      id: 'uppvarmning-l1',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-uppvarmning'],
      spelare: { min: 2, max: 6 },
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    }),
    bankExercise({
      id: 'ova-l1',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 6 },
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    }),
    bankExercise({
      id: 'spelovning-l1',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-spelovning'],
      grupptyp: 'tva-lag',
      spelare: { min: 4, max: 6 },
      tid: { kortast: 10, rekommenderad: 12, langst: 14 },
    }),
    gameExercise({
      id: 'spel-l1',
      fokusomraden: ['passning-mottagning'],
      spelare: { min: 4, max: 6 },
      tid: { kortast: 16, rekommenderad: 19, langst: 22 },
    }),
  ];

  it('en ensam ledare (L = 1) räcker till ett alternativ med en grupp (R-055)', () => {
    const pass = session(grundunderlag, bank);
    const ova = refOf(pass, 'ova-l1');
    // 6 spelare, högst 6 per grupp: en grupp, ett ledarbehov räcker med L = 1.
    const enGrupp = bankExercise({
      id: 'en-grupp-l1',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 6 },
      ledarbehov: 1,
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    });
    expect(trySwap(pass, locateSwapTarget(pass, ova), enGrupp).ok).toBe(true);
    expect(checkSession(applySwap(pass, ova, enGrupp))).toEqual([]);
  });

  it('en ensam ledare (L = 1) räcker inte till ett alternativ som kräver två grupper (R-055)', () => {
    const pass = session(grundunderlag, bank);
    const ova = refOf(pass, 'ova-l1');
    // 6 spelare, högst 3 per grupp: två grupper, och ledarbehov 1 vardera kräver 2 ledare > 1.
    const tvaGrupper = bankExercise({
      id: 'tva-grupper-l1',
      fokusomraden: ['passning-mottagning'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 3 },
      ledarbehov: 1,
      tid: { kortast: 8, rekommenderad: 10, langst: 12 },
    });
    // `placeReplacement` rapporterar alltid R-051 när `planWholeGroups` returnerar null, även
    // när orsaken är R-055 (för få ledare). Testet kontrollerar därför bara att bytet
    // nekas, på samma sätt som "R-104 villkor 4 kräver att momentets ledare räcker (R-055)"
    // i swap.test.ts gör – se fyndet i kvalitetssäkrarens rapport om `SwapRejection.regel`.
    expect(trySwap(pass, locateSwapTarget(pass, ova), tvaGrupper).ok).toBe(false);
  });

  it('flera ledare (L = 3, mer än minikravet 2) räcker till stationer, tills ledarbehovet blir för stort (R-064)', () => {
    // Samma mått som "R-104 i ett stationsmoment" i swap.test.ts, med en ledare mer än de två
    // stationerna kräver av sig själva: L = 3 ger lite marginal, inte bara exakt nog.
    const stationsunderlag: Input = {
      alder: 11,
      spelform: '7mot7',
      niva: 'niva-2',
      spelare: 14,
      ledare: 3,
      passlangd: 60,
      fokus: ['passning-mottagning'],
    };
    const stationsbank: BankExercise[] = [
      bankExercise({
        id: 'uppvarmning-stationer',
        fokusomraden: ['passning-mottagning'],
        passdelar: ['del-uppvarmning'],
        spelare: { min: 2, max: 14 },
        tid: { kortast: 8, rekommenderad: 10, langst: 12 },
      }),
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
      bankExercise({
        id: 'spelovning-stationer',
        fokusomraden: ['passning-mottagning'],
        passdelar: ['del-spelovning'],
        grupptyp: 'tva-lag',
        spelare: { min: 4, max: 14 },
        tid: { kortast: 10, rekommenderad: 12, langst: 14 },
      }),
      gameExercise({
        id: 'spel-stationer',
        fokusomraden: ['passning-mottagning'],
        spelare: { min: 6, max: 14 },
        tid: { kortast: 16, rekommenderad: 19, langst: 22 },
      }),
    ];
    const pass = session(stationsunderlag, stationsbank);
    const stationer = pass.rows.filter((row) => row.kind === 'station');
    expect(stationer).toHaveLength(2);
    const stationA = refOf(pass, 'station-a');

    // Station A kräver 2 ledare, station B behåller sin 1: 2 + 1 = 3, precis vad L = 3 ger.
    const kraverTvaLedare = bankExercise({
      id: 'station-tva-ledare',
      passdelar: ['del-ovning'],
      spelare: { min: 5, max: 8 },
      ledarbehov: 2,
      tid: { kortast: 5, rekommenderad: 6, langst: 6 },
    });
    expect(trySwap(pass, locateSwapTarget(pass, stationA), kraverTvaLedare).ok).toBe(true);
    const efter = applySwap(pass, stationA, kraverTvaLedare);
    expect(checkSession(efter)).toEqual([]);

    // Station A kräver redan 2 ledare efter bytet ovan. Om station B också byts till en
    // övning som kräver 2 ledare blir summan 2 + 2 = 4 > L = 3.
    const stationB = refOf(efter, 'station-b');
    const bAvenTvaLedare = bankExercise({
      id: 'station-b-tva-ledare',
      passdelar: ['del-ovning'],
      spelare: { min: 5, max: 8 },
      ledarbehov: 2,
      tid: { kortast: 5, rekommenderad: 6, langst: 6 },
    });
    expect(trySwap(efter, locateSwapTarget(efter, stationB), bAvenTvaLedare)).toEqual({
      ok: false,
      rejection: { villkor: 4, regel: 'R-064' },
    });
  });
});
