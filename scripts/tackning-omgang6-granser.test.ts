/**
 * Kvalitetssäkrarens tester av målen för omgång 6 mot källorna och av gränsvärdena i
 * jämförelsen. Målen läses ur täckningsrapporten (för 6–12 år) och jämförs med PLAN_GOALS.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  GOAL_MEASURES,
  PLAN_GOALS,
  emptyCellStats,
  meetsOmgang6Goal,
  planCellLabel,
  reportedPercent,
} from './tackning-celler.ts';

function stats(total: number, none: number, coreFilled: number, coreOnFocus: number) {
  return { total, none, coreFilled, coreOnFocus, coreRemoved: 0 };
}

describe('PLAN_GOALS.omgang6 mot rapporten tackning-2026-10-07.md', () => {
  // Första förekomsten av tabellen är "Banken nu"; den andra är "Efter CI-rättning".
  const report = readFileSync(
    new URL('../docs/doman/tackning-2026-10-07.md', import.meta.url),
    'utf8',
  );
  const nuSection = report.slice(
    report.indexOf('## Banken nu'),
    report.indexOf('## Efter CI-rättning'),
  );
  const rowOf = (label: string, kind: string) => {
    const line = nuSection.split('\n').find((l) => l.startsWith(`| ${label} | ${kind} |`));
    expect(line, `${label} saknas i rapporten`).toBeDefined();
    const cols = line!.split('|').map((c) => c.trim());
    // | Cell | Typ | Körfall | Inget pass | Fylld kärna alla | skapade | Kärna på fokus | ...
    return {
      none: Number(/\(([\d.]+) %\)/.exec(cols[4]!)![1]),
      coreFilled: Number(cols[5]!.replace(' %', '')),
      coreOnFocus: Number(cols[7]!.replace(' %', '')),
    };
  };

  it('har för varje cell för 6–12 år samma värden som rapporten', () => {
    const kept = PLAN_GOALS.filter((g) => g.omgang6.none.kind === 'oforandrat');
    expect(kept).toHaveLength(8);
    for (const goal of kept) {
      const kind = goal.group === goal.spelform ? 'föreslagen' : 'granne';
      const row = rowOf(planCellLabel(goal.group, goal.spelform), kind);
      for (const measure of GOAL_MEASURES) {
        expect(goal.omgang6[measure].percent, `${goal.group}|${goal.spelform} ${measure}`).toBe(
          row[measure],
        );
      }
    }
  });

  it('har exakt fem celler med höjda mål och de gäller bara 13–19 år', () => {
    const raised = PLAN_GOALS.filter((g) => g.omgang6.none.kind === 'max');
    expect(raised.map((g) => `${g.group}|${g.spelform}`).sort()).toEqual([
      '11mot11|11mot11',
      '11mot11|9mot9',
      '9mot9|11mot11',
      '9mot9|7mot7',
      '9mot9|9mot9',
    ]);
    for (const g of raised) {
      expect(g.omgang6.coreFilled.kind).toBe('min');
      expect(g.omgang6.coreOnFocus.kind).toBe('min');
    }
  });

  it('klarar inte nuläget för 13–19 år (målen är höjningar, inte redan nådda)', () => {
    const now = stats(73200, 6030, 23424, 9296); // 8,2 / 32,0 / 12,7 %
    const goal = PLAN_GOALS.find((g) => g.group === '11mot11' && g.spelform === '11mot11')!;
    for (const measure of GOAL_MEASURES) {
      expect(meetsOmgang6Goal(now, measure, goal.omgang6[measure])).toBe(false);
    }
  });
});

describe('meetsOmgang6Goal, gränsvärden', () => {
  it('"högst 2,0": exakt gräns, strax under, strax över (avrundat värde)', () => {
    const goal = { kind: 'max', percent: 2.0 } as const;
    expect(meetsOmgang6Goal(stats(1000, 20, 0, 0), 'none', goal)).toBe(true);
    expect(meetsOmgang6Goal(stats(1000, 19, 0, 0), 'none', goal)).toBe(true);
    expect(meetsOmgang6Goal(stats(1000, 21, 0, 0), 'none', goal)).toBe(false);
    expect(meetsOmgang6Goal(stats(1000, 0, 0, 0), 'none', goal)).toBe(true);
  });

  it('"minst 65,0": exakt gräns, strax under, strax över', () => {
    const goal = { kind: 'min', percent: 65.0 } as const;
    expect(meetsOmgang6Goal(stats(1000, 0, 650, 0), 'coreFilled', goal)).toBe(true);
    expect(meetsOmgang6Goal(stats(1000, 0, 649, 0), 'coreFilled', goal)).toBe(false);
    expect(meetsOmgang6Goal(stats(1000, 0, 651, 0), 'coreFilled', goal)).toBe(true);
    expect(meetsOmgang6Goal(stats(1000, 0, 1000, 0), 'coreFilled', goal)).toBe(true);
  });

  it('mäter varje mått mot rätt fält', () => {
    const s = stats(1000, 10, 700, 400);
    expect(reportedPercent(s, 'none')).toBe(1.0);
    expect(reportedPercent(s, 'coreFilled')).toBe(70.0);
    expect(reportedPercent(s, 'coreOnFocus')).toBe(40.0);
  });

  it('"oförändrat" släpper igenom ändringar under 0,05 procentenheter (känd begränsning)', () => {
    // 30,04 % skrivs "30.0 %" och räknas därför som oförändrat mot 30,0 %.
    const goal = { kind: 'oforandrat', percent: 30.0 } as const;
    expect(meetsOmgang6Goal(stats(10000, 0, 0, 3004), 'coreOnFocus', goal)).toBe(true);
    expect(meetsOmgang6Goal(stats(10000, 0, 0, 3006), 'coreOnFocus', goal)).toBe(false);
  });

  it('jämför mot det avrundade värdet även när det exakta överskrider gränsen (dokumenterar beteendet)', () => {
    // 20,4 av 1000 är inte möjligt; 205 av 10000 är exakt 2,05 % men skrivs "2.0 %".
    // Omgång 5 (meetsGoal) skulle ha underkänt exakta 2,05 mot 2,0.
    const goal = { kind: 'max', percent: 2.0 } as const;
    expect(meetsOmgang6Goal(stats(10000, 205, 0, 0), 'none', goal)).toBe(true);
    expect(meetsOmgang6Goal(stats(10000, 206, 0, 0), 'none', goal)).toBe(false);
  });

  it('ger null utan körfall för alla tre målsorterna', () => {
    for (const kind of ['max', 'min', 'oforandrat'] as const) {
      expect(meetsOmgang6Goal(emptyCellStats(), 'none', { kind, percent: 1 })).toBeNull();
    }
  });
});
