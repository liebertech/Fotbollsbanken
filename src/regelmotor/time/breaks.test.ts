import { describe, expect, it } from 'vitest';
import { placeBreaks } from './breaks.ts';
import type { BreakMoment } from './breaks.ts';

const delarna: BreakMoment[] = [
  { part: 'del-uppvarmning', minutes: 10 },
  { part: 'del-ovning', minutes: 11 },
  { part: 'del-spelovning', minutes: 12 },
  { part: 'del-spel', minutes: 18 },
];

describe('R-037 Var vattenpauserna ligger', () => {
  it('R-037 ger 21 minuter som längsta sträcka för exemplet i regeln', () => {
    const placement = placeBreaks(delarna, 2);
    expect(placement.longestStretch).toBe(21);
    expect(placement.before.reduce((sum, value) => sum + value, 0) + placement.after).toBe(2);
  });

  it('R-037 lägger ingen paus före första momentet', () => {
    const placement = placeBreaks(delarna, 2);
    expect(placement.before[0]).toBe(0);
  });

  it('R-037 lägger ingen paus efter sista momentet när pauserna får plats', () => {
    const placement = placeBreaks(delarna, 3);
    expect(placement.after).toBe(0);
  });

  it('R-037 delar spelet i perioder i stället för att korta pausen', () => {
    const placement = placeBreaks([{ part: 'del-spel', minutes: 20 }], 2);
    expect(placement.periods?.minutes).toEqual([7, 7, 6]);
    expect(placement.longestStretch).toBe(7);
  });

  it('R-037 lägger pauserna efter momentet när passet bara har ett moment utan spel', () => {
    const placement = placeBreaks([{ part: 'del-uppvarmning', minutes: 10 }], 2);
    expect(placement.after).toBe(2);
    expect(placement.longestStretch).toBe(10);
  });

  it('R-037 tar aldrig bort en paus när platserna är färre än pauserna', () => {
    const moments: BreakMoment[] = [
      { part: 'del-uppvarmning', minutes: 8 },
      { part: 'del-ovning', minutes: 8 },
    ];
    const placement = placeBreaks(moments, 3);
    const placed = placement.before.reduce((sum, value) => sum + value, 0) + placement.after;
    expect(placed).toBe(3);
  });
});

describe('R-031 Fasta inslag', () => {
  it('R-031 placerar inga pauser när passet inte har några', () => {
    const placement = placeBreaks(delarna, 0);
    expect(placement.before).toEqual([0, 0, 0, 0]);
    expect(placement.longestStretch).toBe(51);
  });
});
