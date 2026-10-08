/**
 * Tester för sammanfattningarna mot målen per cell i plan-omgang-6.md och plan-omgang-7.md,
 * med syntetiska scenarier i stället för svepet.
 */
import { describe, expect, it } from 'vitest';
import type { GameFormat } from '../src/regelmotor/index.ts';
import { GAME_FORMAT_AGES } from '../src/regelmotor/keys.ts';
import { type CellStats, PLAN_GOALS, ageCellKey } from './tackning-celler.ts';
import {
  OMGANG6,
  OMGANG7,
  type SummaryScenario,
  agesLabel,
  renderSummaryOmgang6,
  renderSummaryOmgang7,
  summarizeCellGoals,
} from './tackning-mal.ts';

/** Cellen med andelarna i procent, med 1000 körfall så att en decimal blir exakt. */
function cell(none: number, coreFilled: number, coreOnFocus: number): CellStats {
  return {
    total: 1000,
    none: Math.round(none * 10),
    coreFilled: Math.round(coreFilled * 10),
    coreOnFocus: Math.round(coreOnFocus * 10),
    coreRemoved: 0,
  };
}

/** Utgångsläget i tackning-2026-10-08.md, Efter CI, per cell i planen. */
const EFTER_CI_2026_10_08: Record<string, CellStats> = {
  '3mot3|3mot3': cell(0.0, 85.7, 33.9),
  '3mot3|5mot5': cell(0.0, 85.7, 33.9),
  '5mot5|5mot5': cell(0.3, 74.8, 25.5),
  '5mot5|3mot3': cell(2.3, 69.4, 22.6),
  '5mot5|7mot7': cell(0.3, 74.8, 25.5),
  '7mot7|7mot7': cell(4.0, 73.9, 23.2),
  '7mot7|5mot5': cell(9.3, 73.9, 23.2),
  '7mot7|9mot9': cell(4.0, 73.9, 23.2),
  '9mot9|9mot9': cell(1.5, 77.4, 53.5),
  '9mot9|7mot7': cell(2.8, 75.5, 44.6),
  '9mot9|11mot11': cell(1.5, 77.4, 53.5),
  '11mot11|11mot11': cell(1.0, 89.5, 58.7),
  '11mot11|9mot9': cell(1.0, 89.5, 58.7),
};

/** Ett scenario där varje cell i planen ligger på gruppens yngsta ålder. */
function scenario(planCells: Record<string, CellStats>, bankSize = 86): SummaryScenario {
  const cells = new Map<string, CellStats>();
  for (const [key, stats] of Object.entries(planCells)) {
    const [group, spelform] = key.split('|') as [GameFormat, GameFormat];
    cells.set(ageCellKey(GAME_FORMAT_AGES[group].min, spelform), { ...stats });
  }
  return { bankSize, agg: { cells } };
}

/** Plancellerna i en ålders-map, för summarizeCellGoals direkt. */
function planMap(planCells: Record<string, CellStats>): Map<string, CellStats> {
  return new Map(Object.entries(planCells).map(([key, stats]) => [key, { ...stats }]));
}

describe('agesLabel', () => {
  it('slår ihop angränsande åldersgrupper', () => {
    expect(agesLabel(['3mot3', '5mot5', '7mot7'])).toBe('6–12 år');
    expect(agesLabel(['11mot11', '9mot9'])).toBe('13–19 år');
    expect(agesLabel(['5mot5', '7mot7'])).toBe('8–12 år');
  });

  it('skiljer spann som inte gränsar till varandra', () => {
    expect(agesLabel(['9mot9', '3mot3', '11mot11'])).toBe('6–7 år och 13–19 år');
    expect(agesLabel(['3mot3', '7mot7', '11mot11'])).toBe('6–7 år, 10–12 år och 15–19 år');
  });

  it('ger ett streck utan grupper', () => {
    expect(agesLabel([])).toBe('–');
  });
});

describe('summarizeCellGoals för omgång 7', () => {
  it('läser åldrarna ur målen: 8–12 år höjs, 6–7 och 13–19 år ska vara oförändrade', () => {
    const summary = summarizeCellGoals(new Map(), new Map(), OMGANG7);
    expect(summary.raisedAges).toBe('8–12 år');
    expect(summary.keptAges).toBe('6–7 år och 13–19 år');
  });

  it('räknar 18 höjda och 21 oförändrade mått, och vilka som är nådda i utgångsläget', () => {
    const cells = planMap(EFTER_CI_2026_10_08);
    const summary = summarizeCellGoals(cells, cells, OMGANG7);
    expect(summary.raised.count).toBe(18);
    expect(summary.kept.count).toBe(21);
    // Bara "inget pass" för 8–9 år är nått i utgångsläget: tre celler, ett mått var.
    expect(summary.raised.nu).toBe(3);
    expect(summary.raised.efter).toBe(3);
    expect(summary.kept.nu).toBe(21);
    expect(summary.kept.efter).toBe(21);
    expect(summary.changedByLater).toEqual({ nu: 0, efter: 0 });
  });

  it('räknar ett ändrat värde för 13–19 år som inte oförändrat, med "nej"', () => {
    const efter = { ...EFTER_CI_2026_10_08, '9mot9|9mot9': cell(1.5, 77.5, 53.5) };
    const summary = summarizeCellGoals(planMap(EFTER_CI_2026_10_08), planMap(efter), OMGANG7);
    expect(summary.kept.efter).toBe(20);
    const row = summary.rows.find(
      (r) => r.goal.group === '9mot9' && r.goal.spelform === '9mot9' && r.measure === 'coreFilled',
    )!;
    expect(row.verdictNu).toBe('ja');
    expect(row.verdictEfter).toBe('nej');
  });

  it('räknar höjda mål som nådda när värdet ligger på gränsen', () => {
    const efter = {
      ...EFTER_CI_2026_10_08,
      '7mot7|5mot5': cell(0.5, 80.0, 33.0),
    };
    const summary = summarizeCellGoals(planMap(EFTER_CI_2026_10_08), planMap(efter), OMGANG7);
    expect(summary.raised.efter).toBe(6);
  });

  it('hoppar över celler som saknas, som i en snabbkörning', () => {
    const only = { '5mot5|5mot5': EFTER_CI_2026_10_08['5mot5|5mot5']! };
    const summary = summarizeCellGoals(planMap(only), planMap(only), OMGANG7);
    expect(summary.rows).toHaveLength(3);
    expect(summary.raised.count).toBe(3);
    expect(summary.kept.count).toBe(0);
    // Åldrarna läses ur målen, inte ur vilka celler som kördes.
    expect(summary.keptAges).toBe('6–7 år och 13–19 år');
  });
});

describe('summarizeCellGoals för omgång 6', () => {
  it('läser åldrarna ur målen: 13–19 år höjs, 6–12 år ska vara oförändrade', () => {
    const summary = summarizeCellGoals(new Map(), new Map(), OMGANG6);
    expect(summary.raisedAges).toBe('13–19 år');
    expect(summary.keptAges).toBe('6–12 år');
  });

  it('märker ändrade värden för 8–12 år "ändras av omgång 7" i stället för "nej"', () => {
    // Efter omgång 7: 8–12 år når sina nya mål och skiljer sig därför från omgång 6.
    const efter = {
      ...EFTER_CI_2026_10_08,
      '5mot5|5mot5': cell(0.3, 82.0, 36.0),
      '7mot7|7mot7': cell(0.5, 82.0, 34.0),
    };
    const summary = summarizeCellGoals(planMap(EFTER_CI_2026_10_08), planMap(efter), OMGANG6);
    const rowsFor = (key: string) =>
      summary.rows.filter((r) => `${r.goal.group}|${r.goal.spelform}` === key);
    for (const key of ['5mot5|5mot5', '7mot7|7mot7']) {
      const rows = rowsFor(key);
      // "Inget pass" är oförändrat i 5 mot 5 för 8–9 år och visas som "ja".
      for (const row of rows) {
        const unchanged = row.efter[row.measure] === EFTER_CI_2026_10_08[key]![row.measure];
        expect(row.verdictEfter).toBe(unchanged ? 'ja' : 'ändras av omgång 7');
      }
    }
    // 5 mot 5: två mått ändrade; 7 mot 7: alla tre.
    expect(summary.changedByLater).toEqual({ nu: 0, efter: 5 });
    expect(summary.rows.some((r) => r.verdictEfter === 'nej')).toBe(false);
  });

  it('visar fortfarande "nej" för 6–7 år, som omgång 7 inte höjer', () => {
    const efter = { ...EFTER_CI_2026_10_08, '3mot3|3mot3': cell(0.0, 85.8, 33.9) };
    const summary = summarizeCellGoals(planMap(EFTER_CI_2026_10_08), planMap(efter), OMGANG6);
    const row = summary.rows.find(
      (r) => r.goal.group === '3mot3' && r.goal.spelform === '3mot3' && r.measure === 'coreFilled',
    )!;
    expect(row.verdictEfter).toBe('nej');
    expect(summary.changedByLater.efter).toBe(0);
  });

  it('har ingen senare omgång för omgång 7', () => {
    expect(OMGANG7.later).toBeUndefined();
    expect(OMGANG6.later?.round).toBe(7);
  });
});

describe('renderSummaryOmgang7', () => {
  it('skriver räknarna och åldrarna i slutraden', () => {
    const text = renderSummaryOmgang7(
      scenario(EFTER_CI_2026_10_08, 72),
      scenario(EFTER_CI_2026_10_08, 86),
      false,
    );
    expect(text).toContain('## Sammanfattning: målen i plan-omgang-7.md, avsnitt 1.1');
    expect(text).toContain('de 14 granskade');
    expect(text).toContain('| Mål efter omgång 7 |');
    expect(text).toContain('Målen för 8–12 år: 3 av 18 nådda nu och 3 av 18 efter CI.');
    expect(text).toContain(
      'Värdena för 6–7 år och 13–19 år: 21 av 21 oförändrade nu och 21 av 21 efter CI;',
    );
    expect(text).toContain('| 8–9 år, 5 mot 5 | föreslagen | Inget pass | 0.3 % | 0.3 % |');
  });

  it('skriver kontrollen av 8–9 år i 5 mot 5 och 7 mot 7', () => {
    const efter = { ...EFTER_CI_2026_10_08, '5mot5|7mot7': cell(0.3, 74.9, 25.5) };
    const text = renderSummaryOmgang7(scenario(EFTER_CI_2026_10_08), scenario(efter), false);
    expect(text).toContain(
      'att 8–9 år, 5 mot 5 och 8–9 år, 7 mot 7 är lika i antal körfall och i de tre måtten (räknat i antal): ja nu och nej efter CI.',
    );
  });

  it('nämner snabbkörningen', () => {
    const text = renderSummaryOmgang7(scenario({}), scenario({}), true);
    expect(text).toContain('Körningen gjordes med `--snabb`');
    expect(text).toContain('Målen för 8–12 år: 0 av 0 nådda nu');
    expect(text).toContain('– nu och – efter CI');
  });
});

describe('renderSummaryOmgang6', () => {
  it('skriver märkningen och hur många mått omgång 7 ändrar', () => {
    const efter = { ...EFTER_CI_2026_10_08, '7mot7|9mot9': cell(0.5, 82.0, 34.0) };
    const text = renderSummaryOmgang6(scenario(EFTER_CI_2026_10_08), scenario(efter), false);
    expect(text).toContain('## Sammanfattning: målen i plan-omgang-6.md, avsnitt 1.1');
    expect(text).toContain(
      '| 10–12 år, 9 mot 9 | granne | Fylld kärna | 73.9 % | 82.0 % | = 73.9 % (oförändrat) | ja | ändras av omgång 7 |',
    );
    expect(text).toContain('Målen för 13–19 år:');
    expect(text).toContain('Värdena för 6–12 år: 24 av 24 oförändrade nu och 21 av 24 efter CI.');
    expect(text).toContain('Av de ändrade är 0 nu och 3 efter CI märkta "ändras av omgång 7"');
  });
});

describe('PLAN_GOALS och sammanfattningen', () => {
  it('har samma celler som utgångsläget i testerna', () => {
    expect(PLAN_GOALS.map((g) => `${g.group}|${g.spelform}`).sort()).toEqual(
      Object.keys(EFTER_CI_2026_10_08).sort(),
    );
  });
});
