/**
 * Kvalitetssäkrarens tester av målen för omgång 7 (plan-omgang-7.md, avsnitt 1.1): värdena är
 * skrivna ut oberoende av PLAN_GOALS, gränserna prövas vid planens egna tal, och omgång 6 är
 * orörd av namnbytet.
 */
import { describe, expect, it } from 'vitest';
import {
  GOAL_MEASURES,
  PLAN_GOALS,
  meetsCellGoal,
  meetsOmgang6Goal,
  sameOnGoalMeasures,
} from './tackning-celler.ts';

function stats(total: number, none: number, coreFilled: number, coreOnFocus: number) {
  return { total, none, coreFilled, coreOnFocus, coreRemoved: 0 };
}

const find = (group: string, spelform: string) =>
  PLAN_GOALS.find((g) => g.group === group && g.spelform === spelform)!;

describe('omgång 7: alla celler, värdena ur planens tabell', () => {
  // [group, spelform, none, coreFilled, coreOnFocus, typ]
  const table: [string, string, number, number, number, 'max' | 'oforandrat'][] = [
    ['3mot3', '3mot3', 0.0, 85.7, 33.9, 'oforandrat'],
    ['3mot3', '5mot5', 0.0, 85.7, 33.9, 'oforandrat'],
    ['5mot5', '5mot5', 0.3, 82.0, 36.0, 'max'],
    ['5mot5', '7mot7', 0.3, 82.0, 36.0, 'max'],
    ['5mot5', '3mot3', 2.3, 77.0, 32.0, 'max'],
    ['7mot7', '7mot7', 0.5, 82.0, 34.0, 'max'],
    ['7mot7', '5mot5', 0.5, 80.0, 33.0, 'max'],
    ['7mot7', '9mot9', 0.5, 82.0, 34.0, 'max'],
    ['9mot9', '9mot9', 1.5, 77.4, 53.5, 'oforandrat'],
    ['9mot9', '11mot11', 1.5, 77.4, 53.5, 'oforandrat'],
    ['9mot9', '7mot7', 2.8, 75.5, 44.6, 'oforandrat'],
    ['11mot11', '11mot11', 1.0, 89.5, 58.7, 'oforandrat'],
    ['11mot11', '9mot9', 1.0, 89.5, 58.7, 'oforandrat'],
  ];

  it('PLAN_GOALS har exakt de celler planen anger, och inga fler', () => {
    expect(PLAN_GOALS).toHaveLength(table.length);
  });

  it.each(table)('%s|%s har planens tal', (group, spelform, none, filled, onFocus, kind) => {
    const goal = find(group, spelform).omgang7;
    const rest = kind === 'max' ? 'min' : kind;
    expect(goal.none).toEqual({ kind, percent: none });
    expect(goal.coreFilled).toEqual({ kind: rest, percent: filled });
    expect(goal.coreOnFocus).toEqual({ kind: rest, percent: onFocus });
  });

  it('ett underlag med exakt målets tal uppfyller målet, och ett oförändrat mål bryts av en ändring', () => {
    for (const [group, spelform, none, filled, onFocus, kind] of table) {
      const goal = find(group, spelform).omgang7;
      // 100 000 körfall ger exakt de angivna procenttalen.
      const s = stats(
        100000,
        Math.round(none * 1000),
        Math.round(filled * 1000),
        Math.round(onFocus * 1000),
      );
      expect(GOAL_MEASURES.map((m) => meetsCellGoal(s, m, goal[m]))).toEqual([true, true, true]);
      if (kind === 'oforandrat') {
        const moved = { ...s, coreFilled: s.coreFilled + 100 };
        expect(meetsCellGoal(moved, 'coreFilled', goal.coreFilled)).toBe(false);
      }
    }
  });
});

describe('omgång 7: gränserna vid planens egna tal', () => {
  it('"högst 0,5" för 10-12 år: 5 av 1000 går, 6 av 1000 går inte', () => {
    const g = find('7mot7', '7mot7').omgang7.none;
    expect(meetsCellGoal(stats(1000, 5, 0, 0), 'none', g)).toBe(true);
    expect(meetsCellGoal(stats(1000, 6, 0, 0), 'none', g)).toBe(false);
  });

  it('"högst 0,3" för 8-9 år: 3 av 1000 går, 4 av 1000 går inte', () => {
    const g = find('5mot5', '5mot5').omgang7.none;
    expect(meetsCellGoal(stats(1000, 3, 0, 0), 'none', g)).toBe(true);
    expect(meetsCellGoal(stats(1000, 4, 0, 0), 'none', g)).toBe(false);
  });

  it('"minst 82,0": 820 av 1000 går, 819 går inte', () => {
    const g = find('7mot7', '7mot7').omgang7.coreFilled;
    expect(meetsCellGoal(stats(1000, 0, 820, 0), 'coreFilled', g)).toBe(true);
    expect(meetsCellGoal(stats(1000, 0, 819, 0), 'coreFilled', g)).toBe(false);
  });

  it('"minst 36,0" på kärna på valt fokus för 8-9 år', () => {
    const g = find('5mot5', '5mot5').omgang7.coreOnFocus;
    expect(meetsCellGoal(stats(1000, 0, 0, 360), 'coreOnFocus', g)).toBe(true);
    expect(meetsCellGoal(stats(1000, 0, 0, 359), 'coreOnFocus', g)).toBe(false);
  });

  it('fylld kärna för 10-12 år i 5 mot 5 har lägre mål än i 7 mot 7 och 9 mot 9', () => {
    const five = find('7mot7', '5mot5').omgang7.coreFilled.percent;
    expect(five).toBe(80.0);
    expect(five).toBeLessThan(find('7mot7', '7mot7').omgang7.coreFilled.percent);
    expect(five).toBeLessThan(find('7mot7', '9mot9').omgang7.coreFilled.percent);
  });
});

describe('omgång 7: likhetskontrollen', () => {
  const same = stats(25102, 72, 18776, 6401);

  it('celler med samma antal är lika', () => {
    expect(sameOnGoalMeasures(same, { ...same })).toBe(true);
  });

  it('ett enda körfall som skiljer på något mått fångas, åt båda hållen', () => {
    for (const key of ['none', 'coreFilled', 'coreOnFocus'] as const) {
      const other = { ...same, [key]: same[key] + 1 };
      expect(sameOnGoalMeasures(same, other)).toBe(false);
      expect(sameOnGoalMeasures(other, same)).toBe(false);
    }
  });

  it('ger null när båda cellerna saknas', () => {
    expect(sameOnGoalMeasures(undefined, undefined)).toBeNull();
  });
});

describe('omgång 6 är orörd av namnbytet', () => {
  it('omgang6 har fortfarande planens tal för alla celler', () => {
    const expected: [string, string, 'max' | 'oforandrat', number, number, number][] = [
      ['3mot3', '3mot3', 'oforandrat', 0.0, 85.7, 33.9],
      ['3mot3', '5mot5', 'oforandrat', 0.0, 85.7, 33.9],
      ['5mot5', '5mot5', 'oforandrat', 0.3, 74.8, 25.5],
      ['5mot5', '3mot3', 'oforandrat', 2.3, 69.4, 22.6],
      ['5mot5', '7mot7', 'oforandrat', 0.3, 74.8, 25.5],
      ['7mot7', '7mot7', 'oforandrat', 4.0, 73.9, 23.2],
      ['7mot7', '5mot5', 'oforandrat', 9.3, 73.9, 23.2],
      ['7mot7', '9mot9', 'oforandrat', 4.0, 73.9, 23.2],
      ['9mot9', '9mot9', 'max', 2.0, 68.0, 33.0],
      ['9mot9', '7mot7', 'max', 3.0, 58.0, 22.0],
      ['9mot9', '11mot11', 'max', 2.0, 68.0, 33.0],
      ['11mot11', '11mot11', 'max', 2.0, 65.0, 30.0],
      ['11mot11', '9mot9', 'max', 2.0, 65.0, 30.0],
    ];
    expect(expected).toHaveLength(PLAN_GOALS.length);
    for (const [group, spelform, kind, none, filled, onFocus] of expected) {
      const goal = find(group, spelform).omgang6;
      const rest = kind === 'max' ? 'min' : kind;
      expect(goal.none).toEqual({ kind, percent: none });
      expect(goal.coreFilled).toEqual({ kind: rest, percent: filled });
      expect(goal.coreOnFocus).toEqual({ kind: rest, percent: onFocus });
    }
  });

  it('aliaset meetsOmgang6Goal ger samma svar som meetsCellGoal för alla sorter', () => {
    for (const kind of ['max', 'min', 'oforandrat'] as const) {
      const goal = { kind, percent: 50 } as const;
      for (const none of [499, 500, 501]) {
        expect(meetsOmgang6Goal(stats(1000, none, 0, 0), 'none', goal)).toBe(
          meetsCellGoal(stats(1000, none, 0, 0), 'none', goal),
        );
      }
    }
  });
});
