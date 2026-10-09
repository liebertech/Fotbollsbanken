/**
 * Gränsvärdena i målen för omgång 8 (plan-omgang-8.md, avsnitt 1.1 och 1.3): varje mål ska
 * vara nått precis på gränsen och inte en tiondel vid sidan om.
 */
import { describe, expect, it } from 'vitest';
import type { GameFormat } from '../src/regelmotor/index.ts';
import {
  type CellGoal,
  PLAN_GOALS,
  SUBSTITUTE_GOALS_OMGANG8,
  meetsPercentGoal,
} from './tackning-celler.ts';

describe('omgang8 i PLAN_GOALS', () => {
  const sixSeven = PLAN_GOALS.filter((g) => g.group === '3mot3');

  it('höjer kärna på valt fokus till minst 70,0 och fylld kärna till minst 95,0 för 6–7 år', () => {
    expect(sixSeven).toHaveLength(2);
    for (const g of sixSeven) {
      expect(g.omgang8.none).toEqual({ kind: 'max', percent: 0.0 });
      expect(g.omgang8.coreFilled).toEqual({ kind: 'min', percent: 95.0 });
      expect(g.omgang8.coreOnFocus).toEqual({ kind: 'min', percent: 70.0 });
      expect(meetsPercentGoal(70.0, g.omgang8.coreOnFocus)).toBe(true);
      expect(meetsPercentGoal(69.9, g.omgang8.coreOnFocus)).toBe(false);
      expect(meetsPercentGoal(0.1, g.omgang8.none)).toBe(false);
    }
  });

  it('har oförändrade mål för alla övriga celler', () => {
    for (const g of PLAN_GOALS.filter((x) => x.group !== '3mot3')) {
      for (const measure of ['none', 'coreFilled', 'coreOnFocus'] as const) {
        expect(g.omgang8[measure].kind).toBe('oforandrat');
      }
    }
  });
});

describe('SUBSTITUTE_GOALS_OMGANG8', () => {
  const goalOf = (scope: GameFormat | 'alla'): CellGoal =>
    SUBSTITUTE_GOALS_OMGANG8.find((entry) => entry.scope === scope)!.goal;

  it.each([
    ['3mot3', 31.0],
    ['5mot5', 33.0],
    ['alla', 33.2],
  ] as const)('är "högst" för %s med gränsen %s och räknar gränsen in', (scope, limit) => {
    const goal = goalOf(scope);
    expect(goal).toEqual({ kind: 'max', percent: limit });
    expect(meetsPercentGoal(limit, goal)).toBe(true);
    expect(meetsPercentGoal(Math.round((limit + 0.1) * 10) / 10, goal)).toBe(false);
  });

  it.each([
    ['7mot7', 35.7],
    ['9mot9', 33.3],
    ['11mot11', 31.6],
  ] as const)('är exakt oförändrat för %s', (scope, value) => {
    const goal = goalOf(scope);
    expect(goal).toEqual({ kind: 'oforandrat', percent: value });
    expect(meetsPercentGoal(value, goal)).toBe(true);
    expect(meetsPercentGoal(value - 0.1, goal)).toBe(false);
    expect(meetsPercentGoal(value + 0.1, goal)).toBe(false);
  });
});
