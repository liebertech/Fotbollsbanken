import { describe, expect, it } from 'vitest';
import { largestGroup, planWholeGroups, splitPlayers } from './groups.ts';
import { bankExercise, gameExercise } from '../__testdata__/bank-fixtur.ts';

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
