import { describe, expect, it } from 'vitest';
import { breakCount, closingMinutes, planTime } from './plan.ts';
import { PHASES, SESSION_LENGTH_MAX, SESSION_LENGTH_MIN } from '../keys.ts';
import type { Phase, SessionPartFromBank } from '../keys.ts';

function target(phase: Phase, minutes: number, part: SessionPartFromBank): number | undefined {
  return planTime(phase, minutes).parts.find((item) => item.part === part)?.target;
}

/** Tabellerna i docs/doman/passuppbyggnad.md, avsnittet *Tidsplaner per fas*. */
const TABELLER: {
  phase: Phase;
  rows: [number, number, number | null, number | null, number, number, number][];
}[] = [
  {
    phase: 'fas-6-7',
    rows: [
      [45, 9, 9, 5, 15, 4, 3],
      [60, 12, 12, 7, 20, 6, 3],
    ],
  },
  {
    phase: 'fas-8-9',
    rows: [
      [45, 7, 9, 7, 15, 4, 3],
      [60, 10, 12, 10, 19, 6, 3],
      [75, 12, 16, 12, 24, 8, 3],
    ],
  },
  {
    phase: 'fas-10-12',
    rows: [
      [45, 7, 7, 9, 15, 4, 3],
      [60, 10, 10, 12, 19, 4, 5],
      [75, 12, 12, 16, 24, 6, 5],
      [90, 15, 15, 19, 28, 8, 5],
    ],
  },
  {
    phase: 'fas-13-14',
    rows: [
      [45, 9, 5, 9, 15, 4, 3],
      [60, 12, 7, 12, 20, 4, 5],
      [75, 16, 9, 16, 23, 6, 5],
      [90, 19, 11, 19, 28, 8, 5],
    ],
  },
  {
    phase: 'fas-15-19',
    rows: [
      [45, 10, 6, 10, 14, 2, 3],
      [60, 12, 7, 12, 20, 4, 5],
      [75, 16, 9, 16, 25, 4, 5],
      [90, 19, 11, 19, 30, 6, 5],
    ],
  },
];

describe('R-031 Fasta inslag', () => {
  it('R-031 ger avslutningen 3 minuter för de yngsta och 3 eller 5 för övriga', () => {
    expect(closingMinutes('fas-6-7', 60)).toBe(3);
    expect(closingMinutes('fas-8-9', 75)).toBe(3);
    expect(closingMinutes('fas-10-12', 45)).toBe(3);
    expect(closingMinutes('fas-10-12', 60)).toBe(5);
    expect(closingMinutes('fas-15-19', 120)).toBe(5);
  });

  it('R-031 ger 2 pauser för P = 60 i fas-10-12, som exemplet i regeln', () => {
    expect(breakCount('fas-10-12', 60)).toBe(2);
    expect(breakCount('fas-8-9', 60)).toBe(3);
  });
});

describe('R-032 Måltider för delarna', () => {
  it('R-032 ger testfallet i regeln: fas-8-9, P = 60', () => {
    const plan = planTime('fas-8-9', 60);
    expect(plan.closingMinutes).toBe(3);
    expect(plan.breakMinutes).toBe(6);
    expect(plan.activeMinutes).toBe(51);
    expect(plan.parts).toEqual([
      { part: 'del-uppvarmning', target: 10 },
      { part: 'del-ovning', target: 12 },
      { part: 'del-spelovning', target: 10 },
      { part: 'del-spel', target: 19 },
    ]);
  });

  it.each(TABELLER)('R-032 stämmer med tidsplanen för $phase i passuppbyggnad.md', ({ phase, rows }) => {
    for (const [minutes, uppvarmning, ovning, spelovning, spel, vatten, avslutning] of rows) {
      const plan = planTime(phase, minutes);
      expect(plan.closingMinutes).toBe(avslutning);
      expect(plan.breakMinutes).toBe(vatten);
      expect(target(phase, minutes, 'del-uppvarmning')).toBe(uppvarmning);
      expect(target(phase, minutes, 'del-ovning')).toBe(ovning ?? undefined);
      expect(target(phase, minutes, 'del-spelovning')).toBe(spelovning ?? undefined);
      expect(target(phase, minutes, 'del-spel')).toBe(spel);
    }
  });
});

describe('R-033 För korta delar tas bort', () => {
  it('R-033 ger testfallet i regeln: fas-13-14, P = 30', () => {
    const plan = planTime('fas-13-14', 30);
    expect(plan.activeMinutes).toBe(25);
    expect(plan.removedParts).toEqual(['del-ovning']);
    expect(target('fas-13-14', 30, 'del-uppvarmning')).toBe(6);
    expect(target('fas-13-14', 30, 'del-spelovning')).toBe(6);
    expect(target('fas-13-14', 30, 'del-spel')).toBe(13);
  });
});

describe('R-030 Delar och ordning', () => {
  it('R-030 ger delarna i passets ordning för varje tillåten passlängd', () => {
    for (const phase of PHASES) {
      for (let minutes = SESSION_LENGTH_MIN; minutes <= SESSION_LENGTH_MAX[phase]; minutes += 1) {
        const plan = planTime(phase, minutes);
        const order = plan.parts.map((item) => item.part);
        expect(order).toEqual(
          ['del-uppvarmning', 'del-ovning', 'del-spelovning', 'del-spel'].filter((part) =>
            order.includes(part as SessionPartFromBank),
          ),
        );
        // Summan av måltiderna är hela den aktiva tiden.
        expect(plan.parts.reduce((sum, item) => sum + item.target, 0)).toBe(plan.activeMinutes);
        // R-033 gäller Öva och Spelövning: de finns kvar bara med minst 5 minuter.
        for (const part of ['del-ovning', 'del-spelovning'] as const) {
          const kept = plan.parts.find((item) => item.part === part);
          if (kept !== undefined) {
            expect(kept.target).toBeGreaterThanOrEqual(5);
          }
        }
      }
    }
  });
});
