import { describe, expect, it } from 'vitest';
import {
  baseGroupSize,
  largestGroup,
  planWholeGroups,
  splitFixedSize,
  splitPlayers,
} from './groups.ts';
import { bankExercise, gameExercise } from '../__testdata__/bank-fixtur.ts';
import type { Phase } from '../keys.ts';
import type { Exercise } from '../types.ts';

describe('R-050 Största grupp', () => {
  it('R-050 använder övningens högsta antal spelare', () => {
    const exercise = bankExercise({ spelare: { min: 2, max: 8 } });
    expect(largestGroup(exercise, 'fas-10-12', 'del-ovning')).toBe(8);
  });

  it('R-050 låter fast-storlek med lösning för udda antal bli en spelare större', () => {
    const exercise = bankExercise({
      grupptyp: 'fast-storlek',
      spelare: { min: 4, max: 4 },
      udda_antal_losning: true,
    });
    expect(largestGroup(exercise, 'fas-10-12', 'del-ovning')).toBe(5);
  });

  it('R-050 låter en parövning bli en trio (s + 1 enligt R-058)', () => {
    const exercise = bankExercise({ grupptyp: 'par', spelare: { min: 2, max: 2 } });
    expect(largestGroup(exercise, 'fas-10-12', 'del-ovning')).toBe(3);
  });

  it('R-050 ger fast-storlek utan lösning för udda antal största grupp s', () => {
    const exercise = bankExercise({
      grupptyp: 'fast-storlek',
      spelare: { min: 4, max: 4 },
      udda_antal_losning: false,
    });
    expect(largestGroup(exercise, 'fas-10-12', 'del-ovning')).toBe(4);
  });

  it('R-050 håller en ledarstyrd grupp inom taket per ledare', () => {
    const exercise = bankExercise({ spelare: { min: 2, max: 20 }, ledarbehov: 1 });
    expect(largestGroup(exercise, 'fas-6-7', 'del-ovning')).toBe(8);
    expect(largestGroup(exercise, 'fas-10-12', 'del-ovning')).toBe(12);
  });
});

describe('R-051 Antal grupper', () => {
  it('R-051 delar 14 spelare i 2 grupper om 7 när största grupp är 8', () => {
    const exercise = bankExercise({ spelare: { min: 2, max: 8 } });
    const layout = planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 14, 2);
    expect(layout?.groups).toBe(2);
    expect(layout?.sizes).toEqual([7, 7]);
  });

  it('R-051 delar 13 spelare i 7 och 6', () => {
    const exercise = bankExercise({ spelare: { min: 2, max: 8 } });
    expect(planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 13, 2)?.sizes).toEqual([7, 6]);
  });

  it('R-051 fördelar så att grupperna skiljer sig med högst en spelare', () => {
    expect(splitPlayers(17, 4)).toEqual([5, 4, 4, 4]);
  });
});

describe('R-052 Ingen grupp för liten', () => {
  it('R-052 väljer bort övningen när en grupp blir mindre än minsta antal', () => {
    const exercise = bankExercise({ spelare: { min: 6, max: 8 } });
    expect(planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 9, 2)).toBeNull();
  });
});

describe('R-053 För få spelare', () => {
  it('R-053 väljer bort övningen när spelarna är färre än minsta antal', () => {
    const exercise = bankExercise({ spelare: { min: 8, max: 12 } });
    expect(planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 6, 2)).toBeNull();
  });
});

describe('R-054 Udda antal', () => {
  it('R-054 gör en trio av ett par', () => {
    const exercise = bankExercise({ grupptyp: 'par', spelare: { min: 2, max: 3 } });
    const layout = planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 9, 2);
    expect(layout?.oddSolution).toBe('trio');
  });

  it('R-054 gör en joker i tva-lag och visar övningens egen lösning', () => {
    const exercise = gameExercise({ spelare: { min: 6, max: 14 } });
    const layout = planWholeGroups(exercise, 'fas-10-12', 'del-spel', 13, 2);
    expect(layout?.oddSolution).toBe('joker');
    expect(layout?.oddText).toBe(exercise.anpassning?.udda_antal);
  });

  it('R-054 väljer bort fast-storlek utan lösning när antalet inte går jämnt upp', () => {
    const exercise = bankExercise({
      grupptyp: 'fast-storlek',
      spelare: { min: 4, max: 4 },
      udda_antal_losning: false,
    });
    expect(planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 9, 2)).toBeNull();
    expect(planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 8, 2)?.sizes).toEqual([4, 4]);
  });

  it('R-054 lämnar fri grupptyp orörd vid udda antal', () => {
    const exercise = bankExercise({ grupptyp: 'fri', spelare: { min: 2, max: 12 } });
    expect(planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 11, 2)?.oddSolution).toBeNull();
  });
});

describe('R-055 Ledare för ett helgruppsmoment', () => {
  it('R-055 väljer bort en ledarstyrd övning som kräver fler ledare än underlaget har', () => {
    const exercise = bankExercise({ spelare: { min: 2, max: 6 }, ledarbehov: 1 });
    expect(planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 12, 1)).toBeNull();
  });

  it('R-055 låter en självgående övning köras i hur många grupper som helst', () => {
    const exercise = bankExercise({ spelare: { min: 2, max: 6 }, ledarbehov: 0 });
    const layout = planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 12, 1);
    expect(layout?.groups).toBe(2);
    expect(layout?.coachesNeeded).toBe(0);
  });
});

describe('R-056 Alla är med', () => {
  it('R-056 har alla spelare med i varje moment', () => {
    const exercise = bankExercise({ spelare: { min: 2, max: 5 } });
    const layout = planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 17, 4);
    expect(layout?.sizes.reduce((sum, size) => sum + size, 0)).toBe(17);
  });
});

describe('R-057 Taket per ledare gäller inte i del-spel', () => {
  it('R-057 ger ett spel om 14 i stället för två spel om 7', () => {
    const exercise = gameExercise({ spelare: { min: 10, max: 14 }, ledarbehov: 1 });
    const spel = planWholeGroups(exercise, 'fas-10-12', 'del-spel', 14, 2);
    expect(spel?.groups).toBe(1);
    expect(spel?.sizes).toEqual([14]);
    expect(spel?.coachesNeeded).toBe(1);
  });

  it('R-057 gäller inte utanför del-spel, där taket delar gruppen', () => {
    const exercise = bankExercise({ spelare: { min: 2, max: 14 }, ledarbehov: 1 });
    const ovning = planWholeGroups(exercise, 'fas-10-12', 'del-ovning', 14, 2);
    expect(ovning?.groups).toBe(2);
  });
});

describe('R-058 Grupper med fast grundstorlek', () => {
  const pair = () => bankExercise({ grupptyp: 'par', spelare: { min: 2, max: 2 } });
  const fixed = (size: number, solution: boolean, ledarbehov = 0) =>
    bankExercise({
      grupptyp: 'fast-storlek',
      spelare: { min: size, max: size },
      udda_antal_losning: solution,
      ledarbehov,
    });
  const plan = (exercise: Exercise, players: number, coaches = 1, phase: Phase = 'fas-10-12') =>
    planWholeGroups(exercise, phase, 'del-ovning', players, coaches);

  it('R-058 testfall 1: par med 12 spelare ger 6 par och ingen text om udda antal', () => {
    const layout = plan(pair(), 12);
    expect(layout?.sizes).toEqual([2, 2, 2, 2, 2, 2]);
    expect(layout?.oddSolution).toBeNull();
    expect(layout?.oddText).toBeNull();
  });

  it('R-058 testfall 2: par med 13 spelare ger 5 par och 1 trio och visar anpassning.udda_antal', () => {
    const exercise = pair();
    const layout = plan(exercise, 13);
    expect(layout?.groups).toBe(6);
    expect(layout?.sizes).toEqual([3, 2, 2, 2, 2, 2]);
    expect(layout?.oddSolution).toBe('trio');
    expect(layout?.oddText).toBe(exercise.anpassning?.udda_antal);
  });

  it('R-058 testfall 3: par med 3 spelare ger 1 trio', () => {
    const layout = plan(pair(), 3);
    expect(layout?.sizes).toEqual([3]);
    expect(layout?.oddSolution).toBe('trio');
  });

  it('R-058 testfall 4: par med 2 spelare ger 1 par', () => {
    const layout = plan(pair(), 2);
    expect(layout?.sizes).toEqual([2]);
    expect(layout?.oddSolution).toBeNull();
  });

  it('R-058 testfall 5: par med 1 spelare kan inte användas (k = 0)', () => {
    expect(plan(pair(), 1)).toBeNull();
  });

  it('R-058 testfall 6: fast-storlek s = 3 med lösning och 12 spelare ger 4 grupper om 3, inte 3 om 4', () => {
    const layout = plan(fixed(3, true), 12);
    expect(layout?.sizes).toEqual([3, 3, 3, 3]);
    expect(layout?.oddText).toBeNull();
  });

  it('R-058 testfall 7: fast-storlek s = 3 med lösning och 10 spelare ger 4, 3 och 3', () => {
    const exercise = fixed(3, true);
    const layout = plan(exercise, 10);
    expect(layout?.sizes).toEqual([4, 3, 3]);
    expect(layout?.oddText).toBe(exercise.anpassning?.udda_antal);
  });

  it('R-058 testfall 8: fast-storlek s = 3 med lösning och 11 spelare ger 4, 4 och 3', () => {
    expect(plan(fixed(3, true), 11)?.sizes).toEqual([4, 4, 3]);
  });

  it('R-058 testfall 9: fast-storlek s = 3 med lösning och 5 spelare kan inte användas (r > k)', () => {
    expect(plan(fixed(3, true), 5)).toBeNull();
  });

  it('R-058 testfall 10: fast-storlek s = 4 med lösning och 5 spelare ger en grupp om 5', () => {
    expect(plan(fixed(4, true), 5)?.sizes).toEqual([5]);
  });

  it('R-058 testfall 11: fast-storlek s = 4 med lösning och 7 spelare kan inte användas (r > k)', () => {
    expect(plan(fixed(4, true), 7)).toBeNull();
  });

  it('R-058 testfall 12: fast-storlek s = 4 med lösning och 3 spelare kan inte användas (k = 0)', () => {
    expect(plan(fixed(4, true), 3)).toBeNull();
  });

  it('R-058 testfall 13: fast-storlek s = 4 utan lösning och 12 spelare ger 3 grupper om 4', () => {
    expect(plan(fixed(4, false), 12)?.sizes).toEqual([4, 4, 4]);
  });

  it('R-058 testfall 14: fast-storlek s = 4 utan lösning och 13 spelare kan inte användas', () => {
    expect(plan(fixed(4, false), 13)).toBeNull();
  });

  it('R-058 testfall 15: grupper om 5, 5 och 4 med ledarbehov 1 kräver 3 ledare, och L = 2 räcker inte (R-055)', () => {
    expect(plan(fixed(4, true, 1), 14, 2)).toBeNull();
  });

  it('R-058 testfall 16: grupper om 5, 5 och 4 med ledarbehov 1 och L = 3 får en ledare var', () => {
    const layout = plan(fixed(4, true, 1), 14, 3);
    expect(layout?.sizes).toEqual([5, 5, 4]);
    expect(layout?.coachesPerGroup).toBe(1);
    expect(layout?.coachesNeeded).toBe(3);
  });

  it('R-058 testfall 17: en grupp om 9 i fas-6-7 är större än taket 8 × 1 och kan inte användas', () => {
    expect(plan(fixed(8, true, 1), 9, 2, 'fas-6-7')).toBeNull();
  });

  it('R-058 testfall 18: 16 spelare i fas-6-7 ger 2 grupper om 8 med en ledare var', () => {
    const layout = plan(fixed(8, true, 1), 16, 2, 'fas-6-7');
    expect(layout?.sizes).toEqual([8, 8]);
    expect(layout?.coachesNeeded).toBe(2);
  });

  it('R-058 lägger aldrig mer än en extra spelare i en grupp', () => {
    expect(splitFixedSize(11, 3, true)).toEqual([4, 4, 3]);
    expect(splitFixedSize(8, 3, true)).toEqual([4, 4]);
    expect(splitFixedSize(9, 4, true)).toEqual([5, 4]);
    expect(splitFixedSize(9, 4, false)).toBeNull();
    expect(splitFixedSize(14, 5, true)).toBeNull();
  });

  it('R-058 väljer aldrig bort en parövning på grund av udda antal', () => {
    for (let players = 2; players <= 40; players += 1) {
      const sizes = plan(pair(), players)?.sizes ?? [];
      expect(sizes.reduce((sum, size) => sum + size, 0)).toBe(players);
      expect(Math.max(...sizes)).toBeLessThanOrEqual(3);
    }
  });

  it('R-058 gäller par med spelare 2–2 och fast-storlek, inte par med ett annat spann', () => {
    expect(baseGroupSize(pair())).toBe(2);
    expect(baseGroupSize(fixed(3, false))).toBe(3);
    expect(
      baseGroupSize(bankExercise({ grupptyp: 'par', spelare: { min: 2, max: 3 } })),
    ).toBeNull();
    expect(baseGroupSize(bankExercise({ grupptyp: 'fri' }))).toBeNull();
  });
});
