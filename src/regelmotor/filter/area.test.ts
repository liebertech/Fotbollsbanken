import { describe, expect, it } from 'vitest';
import { exerciseArea, momentFitsArea } from './area.ts';
import { AREA_SIZES } from '../keys.ts';
import { bankExercise } from '../__testdata__/bank-fixtur.ts';

describe('R-091 Ytornas mått', () => {
  it('R-091 har måtten ur regeln', () => {
    expect(AREA_SIZES['yta-hel']).toEqual({ langd: 105, bredd: 65 });
    expect(AREA_SIZES['yta-halv']).toEqual({ langd: 65, bredd: 52 });
    expect(AREA_SIZES['yta-kvart']).toEqual({ langd: 52, bredd: 32 });
  });
});

describe('R-092 Momentet får plats', () => {
  it('R-092 ger testfallet i regeln: två grupper om 25 x 20 ryms på en kvarts plan, tre gör det inte', () => {
    const grupp = { langd: 25, bredd: 20 };
    expect(momentFitsArea([grupp, grupp], 'yta-kvart')).toBe(true);
    expect(momentFitsArea([grupp, grupp, grupp], 'yta-kvart')).toBe(false);
  });

  it('R-092 vänder gruppens yta när den passar åt andra hållet', () => {
    expect(momentFitsArea([{ langd: 30, bredd: 50 }], 'yta-kvart')).toBe(true);
    expect(momentFitsArea([{ langd: 60, bredd: 50 }], 'yta-kvart')).toBe(false);
  });

  it('R-092 använder ytan för den valda spelformen', () => {
    const exercise = bankExercise({
      spelformer: ['5mot5', '7mot7'],
      alder: { min: 9, max: 11 },
      yta: { '5mot5': { langd: 20, bredd: 15 }, '7mot7': { langd: 40, bredd: 25 } },
    });
    expect(exerciseArea(exercise, '7mot7')).toEqual({ langd: 40, bredd: 25 });
    expect(exerciseArea(exercise, '5mot5')).toEqual({ langd: 20, bredd: 15 });
  });
});

describe('R-093 Övning utan yta', () => {
  it('R-093 väljer bort en övning utan yta när ledaren har valt en yta', () => {
    expect(momentFitsArea([null], 'yta-hel')).toBe(false);
  });
});

describe('R-090 Ledaren kan ange yta', () => {
  it('R-090 använder inget ytfilter när ingen yta är vald', () => {
    expect(momentFitsArea([null], undefined)).toBe(true);
    expect(momentFitsArea([{ langd: 200, bredd: 200 }], undefined)).toBe(true);
  });
});

describe('R-094 Ytan gäller ett moment i taget', () => {
  it('R-094 prövar varje moment för sig', () => {
    const stort = { langd: 50, bredd: 30 };
    expect(momentFitsArea([stort], 'yta-kvart')).toBe(true);
    expect(momentFitsArea([stort, stort], 'yta-kvart')).toBe(false);
  });
});
