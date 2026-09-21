import { describe, expect, it } from 'vitest';
import { hasHeading, headingMinutesWithinCap, safetyRejection } from './safety.ts';
import { bankExercise } from '../__testdata__/bank-fixtur.ts';

const nickovning = (id: string) =>
  bankExercise({
    id,
    fokusomraden: ['nickspel', 'avslut'],
    alder: { min: 13, max: 14 },
    spelformer: ['9mot9'],
  });

describe('R-080 Ingen nickträning före 13 år', () => {
  it('R-080 väljer bort en nickövning för en yngre grupp', () => {
    expect(safetyRejection(nickovning('nick-a'), 12)).toBe('R-080');
    expect(safetyRejection(nickovning('nick-a'), 13)).toBeNull();
  });
});

describe('R-081 Nickövningar märks för rätt ålder', () => {
  it('R-081 känner igen en övning som har nickspel bland sina fokusområden', () => {
    expect(hasHeading(nickovning('nick-a'))).toBe(true);
    expect(hasHeading(bankExercise())).toBe(false);
  });

  it('R-081 låter inte en nickövning ha en lägsta ålder under 13', () => {
    expect(() =>
      bankExercise({
        fokusomraden: ['nickspel'],
        alder: { min: 12, max: 14 },
        spelformer: ['9mot9'],
      }),
    ).toThrow();
  });
});

describe('R-082 Begränsad mängd nickning', () => {
  it('R-082 ger testfallet i regeln: 8 + 5 minuter är mer än taket 10', () => {
    const atta = { exercise: nickovning('nick-a'), minutes: 8 };
    const fem = { exercise: nickovning('nick-b'), minutes: 5 };
    expect(headingMinutesWithinCap([atta], 'fas-13-14')).toBe(true);
    expect(headingMinutesWithinCap([atta, fem], 'fas-13-14')).toBe(false);
  });

  it('R-082 har ett högre tak för fas-15-19', () => {
    const entries = [
      { exercise: nickovning('nick-a'), minutes: 10 },
      { exercise: nickovning('nick-b'), minutes: 10 },
    ];
    expect(headingMinutesWithinCap(entries, 'fas-15-19')).toBe(true);
  });

  it('R-082 räknar övningens hela tid, även när nickning inte är huvudfokus', () => {
    const blandad = bankExercise({
      id: 'nick-c',
      fokusomraden: ['avslut', 'nickspel'],
      alder: { min: 13, max: 14 },
      spelformer: ['9mot9'],
    });
    expect(headingMinutesWithinCap([{ exercise: blandad, minutes: 12 }], 'fas-13-14')).toBe(false);
  });
});
