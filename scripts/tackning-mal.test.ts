/**
 * Tester för sammanfattningarna mot målen per cell i plan-omgang-6.md, plan-omgang-7.md och
 * plan-omgang-8.md, med syntetiska scenarier i stället för svepet.
 */
import { describe, expect, it } from 'vitest';
import type { GameFormat } from '../src/regelmotor/index.ts';
import { GAME_FORMAT_AGES } from '../src/regelmotor/keys.ts';
import { type CellStats, PLAN_GOALS, ageCellKey } from './tackning-celler.ts';
import {
  OMGANG6,
  OMGANG7,
  OMGANG8,
  type SubstituteCount,
  type SubstituteScenario,
  type SummaryScenario,
  agesLabel,
  renderSummaryOmgang6,
  renderSummaryOmgang7,
  renderSummaryOmgang8,
  summarizeCellGoals,
  summarizeSubstituteGoals,
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

  it('märker ändrade värden för 6–7 år "ändras av omgång 8", eftersom omgång 7 inte höjer dem', () => {
    const efter = { ...EFTER_CI_2026_10_08, '3mot3|3mot3': cell(0.0, 85.8, 33.9) };
    const summary = summarizeCellGoals(planMap(EFTER_CI_2026_10_08), planMap(efter), OMGANG6);
    const row = summary.rows.find(
      (r) => r.goal.group === '3mot3' && r.goal.spelform === '3mot3' && r.measure === 'coreFilled',
    )!;
    expect(row.verdictEfter).toBe('ändras av omgång 8');
    expect(summary.changedByLater.efter).toBe(1);
  });

  it('har omgång 7 och 8 som senare omgångar för omgång 6, omgång 8 för omgång 7 och ingen för omgång 8', () => {
    expect(OMGANG6.later?.map((later) => later.round)).toEqual([7, 8]);
    expect(OMGANG7.later?.map((later) => later.round)).toEqual([8]);
    expect(OMGANG8.later).toBeUndefined();
  });
});

describe('summarizeCellGoals för omgång 7, med omgång 8 som senare omgång', () => {
  it('märker ändrade värden för 6–7 år "ändras av omgång 8" i stället för "nej"', () => {
    // Efter omgång 8: 6–7 år når sina nya mål och skiljer sig därför från omgång 7.
    const efter = {
      ...EFTER_CI_2026_10_08,
      '3mot3|3mot3': cell(0.0, 95.0, 70.0),
      '3mot3|5mot5': cell(0.0, 95.0, 70.0),
    };
    const summary = summarizeCellGoals(planMap(EFTER_CI_2026_10_08), planMap(efter), OMGANG7);
    const sixSeven = summary.rows.filter((r) => r.goal.group === '3mot3');
    expect(sixSeven).toHaveLength(6);
    for (const row of sixSeven) {
      // "Inget pass" är oförändrat 0,0 och visas som "ja".
      expect(row.verdictEfter).toBe(row.measure === 'none' ? 'ja' : 'ändras av omgång 8');
      expect(row.verdictNu).toBe('ja');
    }
    expect(summary.changedByLater).toEqual({ nu: 0, efter: 4 });
    expect(summary.kept.efter).toBe(17);
    const keptRows = summary.rows.filter((r) => r.target.kind === 'oforandrat');
    expect(keptRows.some((r) => r.verdictEfter === 'nej')).toBe(false);
  });

  it('visar fortfarande "nej" för 13–19 år, som omgång 8 inte höjer', () => {
    const efter = { ...EFTER_CI_2026_10_08, '11mot11|9mot9': cell(1.0, 89.4, 58.7) };
    const summary = summarizeCellGoals(planMap(EFTER_CI_2026_10_08), planMap(efter), OMGANG7);
    const row = summary.rows.find(
      (r) =>
        r.goal.group === '11mot11' && r.goal.spelform === '9mot9' && r.measure === 'coreFilled',
    )!;
    expect(row.verdictEfter).toBe('nej');
    expect(summary.changedByLater.efter).toBe(0);
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
      'Värdena för 6–7 år och 13–19 år: 21 av 21 oförändrade nu och 21 av 21 efter CI. Av de ändrade är 0 nu och 0 efter CI märkta "ändras av omgång 8": omgång 8 höjer målen för dem med avsikt, och de bedöms i sammanfattningen för omgång 8.',
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
    expect(text).toContain(
      'Av de ändrade är 0 nu och 3 efter CI märkta "ändras av omgång 7" eller "ändras av omgång 8": omgång 7 och 8 höjer målen för dem med avsikt, och de bedöms i sammanfattningen för den omgång som märkningen anger.',
    );
  });
});

/** Utgångsläget för omgång 8: tackning-2026-10-08-omgang-7.md, Efter CI, per cell i planen. */
const EFTER_CI_OMGANG7: Record<string, CellStats> = {
  '3mot3|3mot3': cell(0.0, 85.7, 33.9),
  '3mot3|5mot5': cell(0.0, 85.7, 33.9),
  '5mot5|5mot5': cell(0.0, 85.5, 46.0),
  '5mot5|3mot3': cell(0.0, 85.5, 43.2),
  '5mot5|7mot7': cell(0.0, 85.5, 46.0),
  '7mot7|7mot7': cell(0.0, 91.7, 47.4),
  '7mot7|5mot5': cell(0.0, 91.7, 47.4),
  '7mot7|9mot9': cell(0.0, 91.7, 47.4),
  '9mot9|9mot9': cell(1.5, 77.4, 53.5),
  '9mot9|7mot7': cell(2.8, 75.5, 44.6),
  '9mot9|11mot11': cell(1.5, 77.4, 53.5),
  '11mot11|11mot11': cell(1.0, 89.5, 58.7),
  '11mot11|9mot9': cell(1.0, 89.5, 58.7),
};

/** Ersättningsfokus i tackning-2026-10-08-omgang-7.md, Efter CI, enkelfokussvepet. */
const SUBSTITUTE_EFTER_CI_OMGANG7: Record<GameFormat, SubstituteCount> = {
  '3mot3': { filled: 68420, substitute: 27448 },
  '5mot5': { filled: 142814, substitute: 51589 },
  '7mot7': { filled: 157752, substitute: 56393 },
  '9mot9': { filled: 221118, substitute: 73638 },
  '11mot11': { filled: 146724, substitute: 46329 },
};

function substituteScenario(
  planCells: Record<string, CellStats>,
  bySpelform: Record<GameFormat, SubstituteCount>,
  bankSize = 98,
): SubstituteScenario {
  const base = scenario(planCells, bankSize);
  const entries = Object.entries(bySpelform) as [GameFormat, SubstituteCount][];
  return {
    bankSize,
    agg: {
      cells: base.agg.cells,
      coreFilled: entries.reduce((sum, [, count]) => sum + count.filled, 0),
      coreSubstitute: entries.reduce((sum, [, count]) => sum + count.substitute, 0),
      coreBySpelform: new Map(entries.map(([spelform, count]) => [spelform, { ...count }])),
    },
  };
}

describe('summarizeCellGoals för omgång 8', () => {
  it('läser åldrarna ur målen: 6–7 år höjs, 8–19 år ska vara oförändrade', () => {
    const summary = summarizeCellGoals(new Map(), new Map(), OMGANG8);
    expect(summary.raisedAges).toBe('6–7 år');
    expect(summary.keptAges).toBe('8–19 år');
  });

  it('räknar 6 höjda och 33 oförändrade mått, och vilka som är nådda i utgångsläget', () => {
    const cells = planMap(EFTER_CI_OMGANG7);
    const summary = summarizeCellGoals(cells, cells, OMGANG8);
    expect(summary.raised.count).toBe(6);
    expect(summary.kept.count).toBe(33);
    // Bara "inget pass" för 6–7 år är nått i utgångsläget: två celler, ett mått var.
    expect(summary.raised.nu).toBe(2);
    expect(summary.kept.nu).toBe(33);
    expect(summary.changedByLater).toEqual({ nu: 0, efter: 0 });
  });

  it('räknar målen som nådda på gränsen och inte en tiondel under', () => {
    const atGoal = {
      ...EFTER_CI_OMGANG7,
      '3mot3|3mot3': cell(0.0, 95.0, 70.0),
      '3mot3|5mot5': cell(0.0, 94.9, 70.0),
    };
    const summary = summarizeCellGoals(planMap(EFTER_CI_OMGANG7), planMap(atGoal), OMGANG8);
    expect(summary.raised.efter).toBe(5);
    const row = summary.rows.find(
      (r) => r.goal.spelform === '5mot5' && r.goal.group === '3mot3' && r.measure === 'coreFilled',
    )!;
    expect(row.verdictEfter).toBe('nej');
  });

  it('visar "nej", inte en märkning, när ett värde för 8–19 år ändras', () => {
    const efter = { ...EFTER_CI_OMGANG7, '5mot5|3mot3': cell(0.0, 85.5, 43.3) };
    const summary = summarizeCellGoals(planMap(EFTER_CI_OMGANG7), planMap(efter), OMGANG8);
    expect(summary.kept.efter).toBe(32);
    const row = summary.rows.find(
      (r) => r.goal.group === '5mot5' && r.goal.spelform === '3mot3' && r.measure === 'coreOnFocus',
    )!;
    expect(row.verdictEfter).toBe('nej');
  });
});

describe('summarizeSubstituteGoals', () => {
  const nu = substituteScenario(EFTER_CI_OMGANG7, SUBSTITUTE_EFTER_CI_OMGANG7);

  it('ger utgångslägets andelar: oförändrat nått, de höjda inte', () => {
    const rows = summarizeSubstituteGoals(nu, nu);
    expect(rows.map((row) => [row.scope, row.metNu])).toEqual([
      ['3mot3', false],
      ['5mot5', false],
      ['7mot7', true],
      ['9mot9', true],
      ['11mot11', true],
      ['alla', false],
    ]);
    const alla = rows.find((row) => row.scope === 'alla')!;
    expect(alla.nu).toEqual({ filled: 736828, substitute: 255397 });
  });

  it('räknar planens uträkning efter omgången som nådd', () => {
    // Avsnitt 1.3: 19 576 av 70 436 i 3 mot 3 (27,8 %) och 43 717 av 144 830 i 5 mot 5 (30,2 %).
    const efter = substituteScenario(EFTER_CI_OMGANG7, {
      ...SUBSTITUTE_EFTER_CI_OMGANG7,
      '3mot3': { filled: 70436, substitute: 19576 },
      '5mot5': { filled: 144830, substitute: 43717 },
    });
    const rows = summarizeSubstituteGoals(nu, efter);
    expect(rows.every((row) => row.metEfter === true)).toBe(true);
  });

  it('prövar gränserna på rapportens avrundning', () => {
    const at = (substitute: number) =>
      substituteScenario(EFTER_CI_OMGANG7, {
        ...SUBSTITUTE_EFTER_CI_OMGANG7,
        '3mot3': { filled: 1000, substitute },
      });
    const metFor3mot3 = (substitute: number) =>
      summarizeSubstituteGoals(nu, at(substitute)).find((row) => row.scope === '3mot3')!.metEfter;
    expect(metFor3mot3(310)).toBe(true);
    expect(metFor3mot3(311)).toBe(false);
  });

  it('fäller ett oförändrat mål när andelen för 7 mot 7 ändras', () => {
    const efter = substituteScenario(EFTER_CI_OMGANG7, {
      ...SUBSTITUTE_EFTER_CI_OMGANG7,
      '7mot7': { filled: 157752, substitute: 56393 - 200 },
    });
    const row = summarizeSubstituteGoals(nu, efter).find((r) => r.scope === '7mot7')!;
    expect(row.metEfter).toBe(false);
  });

  it('ger streck, inte "nej", när en spelform saknar kärnmoment', () => {
    const empty = substituteScenario({}, {} as Record<GameFormat, SubstituteCount>);
    const rows = summarizeSubstituteGoals(empty, empty);
    expect(rows.every((row) => row.metNu === null)).toBe(true);
  });
});

describe('renderSummaryOmgang8', () => {
  it('skriver räknarna, åldrarna, likhetskontrollen och ersättningsfokuset', () => {
    const text = renderSummaryOmgang8(
      substituteScenario(EFTER_CI_OMGANG7, SUBSTITUTE_EFTER_CI_OMGANG7, 98),
      substituteScenario(EFTER_CI_OMGANG7, SUBSTITUTE_EFTER_CI_OMGANG7, 104),
      false,
    );
    expect(text).toContain('## Sammanfattning: målen i plan-omgang-8.md, avsnitt 1.1');
    expect(text).toContain('de 6 granskade');
    expect(text).toContain('Målen i avsnitt 1.2 prövas för hand');
    expect(text).toContain('| Mål efter omgång 8 |');
    expect(text).toContain(
      '| 6–7 år, 3 mot 3 | föreslagen | Fylld kärna | 85.7 % | 85.7 % | ≥ 95.0 % | nej | nej |',
    );
    expect(text).toContain('Målen för 6–7 år: 2 av 6 nådda nu och 2 av 6 efter CI.');
    expect(text).toContain(
      'Värdena för 8–19 år: 33 av 33 oförändrade nu och 33 av 33 efter CI; ett ändrat värde där är enligt planen ett fel',
    );
    expect(text).toContain(
      'att 6–7 år, 3 mot 3 och 6–7 år, 5 mot 5 är lika i antal körfall och i de tre måtten (räknat i antal): ja nu och ja efter CI.',
    );
    expect(text).toContain('### Ersättningsfokus (R-121), avsnitt 1.3');
    expect(text).toContain('| 3mot3 | 40.1 % | 40.1 % | ≤ 31.0 % | nej | nej |');
    expect(text).toContain('| 7mot7 | 35.7 % | 35.7 % | = 35.7 % (oförändrat) | ja | ja |');
    expect(text).toContain('| Hela banken | 34.7 % | 34.7 % | ≤ 33.2 % | nej | nej |');
    expect(text).toContain('Målen för ersättningsfokus: 3 av 6 nådda nu och 3 av 6 efter CI.');
  });

  it('fångar en övning för 6–7 år som bara är märkt med den ena spelformen', () => {
    const efter = {
      ...EFTER_CI_OMGANG7,
      '3mot3|3mot3': cell(0.0, 96.0, 72.0),
      '3mot3|5mot5': cell(0.0, 95.9, 72.0),
    };
    const text = renderSummaryOmgang8(
      substituteScenario(EFTER_CI_OMGANG7, SUBSTITUTE_EFTER_CI_OMGANG7),
      substituteScenario(efter, SUBSTITUTE_EFTER_CI_OMGANG7),
      false,
    );
    expect(text).toContain('(räknat i antal): ja nu och nej efter CI.');
  });

  it('bedömer inte ersättningsfokus i en snabbkörning', () => {
    const nu = substituteScenario(EFTER_CI_OMGANG7, SUBSTITUTE_EFTER_CI_OMGANG7);
    const text = renderSummaryOmgang8(nu, nu, true);
    expect(text).toContain('Körningen gjordes med `--snabb`, så andelarna bygger bara på');
    expect(text).toContain('| 7mot7 | 35.7 % | 35.7 % | = 35.7 % (oförändrat) | – | – |');
    expect(text).not.toContain('Målen för ersättningsfokus:');
  });
});

describe('PLAN_GOALS och sammanfattningen', () => {
  it('har samma celler som utgångsläget i testerna', () => {
    expect(PLAN_GOALS.map((g) => `${g.group}|${g.spelform}`).sort()).toEqual(
      Object.keys(EFTER_CI_2026_10_08).sort(),
    );
  });
});
