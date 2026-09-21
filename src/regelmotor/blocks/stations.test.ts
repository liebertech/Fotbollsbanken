import { describe, expect, it } from 'vitest';
import {
  buildStationBlock,
  maxStations,
  stationBlockMinutes,
  stationsAllowed,
} from './stations.ts';
import { stationBlocks } from './candidates.ts';
import { bankExercise } from '../__testdata__/bank-fixtur.ts';
import type { Input } from '../types.ts';

const underlag: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 12,
  ledare: 3,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

const station = (id: string) =>
  bankExercise({ id, spelare: { min: 2, max: 8 }, passdelar: ['del-ovning'] });

describe('R-060 När stationer får användas', () => {
  it('R-060 ger inga stationer med en ensam ledare', () => {
    expect(stationsAllowed('del-ovning', 1)).toBe(false);
    expect(
      stationBlocks(
        [station('ovning-a'), station('ovning-b')],
        'del-ovning',
        { input: { ...underlag, ledare: 1 }, phase: 'fas-10-12' },
        underlag.fokus,
      ),
    ).toEqual([]);
  });

  it('R-060 tillåter stationer bara i Öva och Spelövning', () => {
    expect(stationsAllowed('del-ovning', 2)).toBe(true);
    expect(stationsAllowed('del-spelovning', 2)).toBe(true);
    expect(stationsAllowed('del-uppvarmning', 4)).toBe(false);
    expect(stationsAllowed('del-spel', 4)).toBe(false);
  });
});

describe('R-061 Antal stationer', () => {
  it('R-061 ger 2 till 4 stationer och aldrig fler än antalet ledare', () => {
    expect(maxStations(2)).toBe(2);
    expect(maxStations(3)).toBe(3);
    expect(maxStations(9)).toBe(4);
  });

  it('R-061 underkänner en uppsättning med fler stationer än ledare', () => {
    const block = buildStationBlock(
      [station('ovning-a'), station('ovning-b'), station('ovning-c')],
      'fas-10-12',
      'del-ovning',
      12,
      2,
    );
    expect(block).toBeNull();
  });
});

describe('R-062 Stationernas övningar', () => {
  it('R-062 kräver att alla stationsövningar är olika', () => {
    expect(
      buildStationBlock([station('ovning-a'), station('ovning-a')], 'fas-10-12', 'del-ovning', 12, 3),
    ).toBeNull();
  });
});

describe('R-063 Grupper vid stationer', () => {
  it('R-063 delar spelarna i en grupp per station', () => {
    const block = buildStationBlock(
      [station('ovning-a'), station('ovning-b'), station('ovning-c')],
      'fas-10-12',
      'del-ovning',
      13,
      3,
    );
    expect(block?.layout.sizes).toEqual([5, 4, 4]);
  });

  it('R-063 underkänner uppsättningen när en grupp inte passar en av övningarna', () => {
    const block = buildStationBlock(
      [station('ovning-a'), bankExercise({ id: 'ovning-b', spelare: { min: 8, max: 10 } })],
      'fas-10-12',
      'del-ovning',
      12,
      3,
    );
    expect(block).toBeNull();
  });

  it('R-063 låter ingen grupp bli större än taket per ledare', () => {
    const block = buildStationBlock(
      [station('ovning-a'), station('ovning-b')],
      'fas-6-7',
      'del-ovning',
      20,
      2,
    );
    expect(block).toBeNull();
  });
});

describe('R-064 Ledare vid stationer', () => {
  it('R-064 kräver minst en ledare per station', () => {
    const ledarstyrd = bankExercise({ id: 'ovning-c', ledarbehov: 2, spelare: { min: 2, max: 8 } });
    expect(
      buildStationBlock([station('ovning-a'), ledarstyrd], 'fas-10-12', 'del-ovning', 12, 2),
    ).toBeNull();
    expect(
      buildStationBlock([station('ovning-a'), ledarstyrd], 'fas-10-12', 'del-ovning', 12, 3),
    ).not.toBeNull();
  });
});

describe('R-065 Tid vid stationer', () => {
  it('R-065 ger 11 minuter för 2 stationer om 5 och 17 för 3 stationer om 5', () => {
    expect(stationBlockMinutes(2, 5)).toBe(11);
    expect(stationBlockMinutes(3, 5)).toBe(17);
  });

  it('R-065 håller stationstiden inom varje övnings gränser', () => {
    const kort = bankExercise({ id: 'ovning-a', tid: { kortast: 5, rekommenderad: 6, langst: 8 } });
    const lang = bankExercise({ id: 'ovning-b', tid: { kortast: 7, rekommenderad: 10, langst: 12 } });
    const block = buildStationBlock([kort, lang], 'fas-10-12', 'del-ovning', 12, 2);
    expect(block?.minStation).toBe(7);
    expect(block?.maxStation).toBe(8);
  });
});

describe('R-066 Rotation', () => {
  it('R-066 ger varje grupp varje station exakt en gång', () => {
    const block = buildStationBlock(
      [station('ovning-a'), station('ovning-b')],
      'fas-10-12',
      'del-ovning',
      12,
      2,
    );
    expect(block?.stationLayouts).toHaveLength(2);
    expect(block?.stationLayouts.every((layout) => layout.sizes.length === 2)).toBe(true);
  });
});
