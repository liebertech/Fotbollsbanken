/**
 * Tester för indelningen i celler och måtten per cell i täckningsskriptet.
 */
import { describe, expect, it } from 'vitest';
import type {
  GameFormat,
  GenerationResult,
  PartResult,
  SessionPartFromBank,
} from '../src/regelmotor/index.ts';
import { AGE_MAX, AGE_MIN, allowedGameFormats } from '../src/regelmotor/keys.ts';
import {
  PLAN_GOALS,
  addOutcome,
  ageCellKey,
  cellKind,
  classifyOutcome,
  emptyCellStats,
  localDate,
  meetsGoal,
  onlySuggested,
  parseOptions,
  planCellKey,
  planCellLabel,
  reportPath,
  rollUpToPlanCells,
  sumByKind,
} from './tackning-celler.ts';

function part(
  name: SessionPartFromBank,
  status: PartResult['status'],
  substituteFocus: PartResult['substituteFocus'] = null,
): PartResult {
  return {
    part: name,
    target: 10,
    minutes: status === 'fylld' ? 10 : 0,
    status,
    substituteFocus,
    missingFocus: [],
    emptyReason: status === 'fylld' ? null : 'val-kan-andras',
    changeableFields: [],
  };
}

/** Ett pass med bara de fält `classifyOutcome` läser. */
function session(parts: PartResult[], removedParts: SessionPartFromBank[] = []): GenerationResult {
  return {
    kind: 'session',
    session: { parts, removedParts },
  } as unknown as GenerationResult;
}

const NONE: GenerationResult = {
  kind: 'none',
  reason: { cause: 'inget-matchar', changeableFields: [], internalProblems: [] },
};

describe('cellKind', () => {
  it('märker den föreslagna spelformen för åldern som föreslagen (R-013)', () => {
    expect(cellKind(6, '3mot3')).toBe('foreslagen');
    expect(cellKind(9, '5mot5')).toBe('foreslagen');
    expect(cellKind(12, '7mot7')).toBe('foreslagen');
    expect(cellKind(13, '9mot9')).toBe('foreslagen');
    expect(cellKind(19, '11mot11')).toBe('foreslagen');
  });

  it('märker de andra tillåtna spelformerna som grannar (R-014)', () => {
    expect(cellKind(7, '5mot5')).toBe('granne');
    expect(cellKind(10, '5mot5')).toBe('granne');
    expect(cellKind(10, '9mot9')).toBe('granne');
    expect(cellKind(15, '9mot9')).toBe('granne');
  });

  it('ger exakt en föreslagen cell per ålder bland de tillåtna spelformerna', () => {
    for (let alder = AGE_MIN; alder <= AGE_MAX; alder += 1) {
      const kinds = allowedGameFormats(alder).map((spelform) => cellKind(alder, spelform));
      expect(kinds.filter((kind) => kind === 'foreslagen')).toHaveLength(1);
    }
  });

  it('ger undefined för en ålder utanför spannet', () => {
    expect(cellKind(5, '3mot3')).toBeUndefined();
    expect(planCellKey(20, '11mot11')).toBeUndefined();
  });
});

describe('planens celler', () => {
  it('slår ihop åldrarna med samma föreslagna spelform', () => {
    expect(planCellKey(10, '9mot9')).toBe('7mot7|9mot9');
    expect(planCellKey(12, '9mot9')).toBe('7mot7|9mot9');
    expect(planCellLabel('7mot7', '9mot9')).toBe('10–12 år, 9 mot 9');
  });

  it('har ett mål för var och en av de 13 cellerna i avsnitt 1.2 och inga andra', () => {
    const planKeys = new Set<string>();
    for (let alder = AGE_MIN; alder <= AGE_MAX; alder += 1) {
      for (const spelform of allowedGameFormats(alder)) {
        planKeys.add(planCellKey(alder, spelform)!);
      }
    }
    const goalKeys = PLAN_GOALS.map((goal) => `${goal.group}|${goal.spelform}`);
    expect(goalKeys).toHaveLength(13);
    expect(new Set(goalKeys)).toEqual(planKeys);
  });

  it('summerar åldersceller till planens celler', () => {
    const cells = new Map([
      [
        ageCellKey(10, '9mot9'),
        { total: 4, none: 4, coreFilled: 0, coreOnFocus: 0, coreRemoved: 0 },
      ],
      [
        ageCellKey(11, '9mot9'),
        { total: 6, none: 2, coreFilled: 3, coreOnFocus: 1, coreRemoved: 1 },
      ],
      [
        ageCellKey(11, '7mot7'),
        { total: 5, none: 0, coreFilled: 5, coreOnFocus: 5, coreRemoved: 0 },
      ],
    ]);
    const rolled = rollUpToPlanCells(cells);
    expect(rolled.get('7mot7|9mot9')).toEqual({
      total: 10,
      none: 6,
      coreFilled: 3,
      coreOnFocus: 1,
      coreRemoved: 1,
    });
    expect(rolled.get('7mot7|7mot7')?.total).toBe(5);
    expect(sumByKind(cells, 'foreslagen').total).toBe(5);
    expect(sumByKind(cells, 'granne').total).toBe(10);
    expect(sumByKind(cells).total).toBe(15);
  });
});

describe('classifyOutcome', () => {
  it('räknar "inget pass" som varken pass eller fylld kärna', () => {
    expect(classifyOutcome(NONE)).toEqual({
      pass: false,
      coreFilled: false,
      coreOnFocus: false,
      coreRemoved: false,
    });
  });

  it('räknar ett pass där bara spelet fylldes som pass men inte fylld kärna', () => {
    const outcome = classifyOutcome(
      session([
        part('del-uppvarmning', 'saknar-ovning'),
        part('del-ovning', 'saknar-ovning'),
        part('del-spelovning', 'saknar-ovning'),
        part('del-spel', 'fylld'),
      ]),
    );
    expect(outcome.pass).toBe(true);
    expect(outcome.coreFilled).toBe(false);
  });

  it('kräver både Öva och Spelövning för fylld kärna', () => {
    const outcome = classifyOutcome(
      session([part('del-ovning', 'fylld'), part('del-spelovning', 'saknar-ovning')]),
    );
    expect(outcome.coreFilled).toBe(false);
  });

  it('räknar kärnan på valt fokus bara när ingen kärndel fick ersättningsfokus (R-121)', () => {
    const onFocus = classifyOutcome(
      session([part('del-ovning', 'fylld'), part('del-spelovning', 'fylld')]),
    );
    expect(onFocus).toMatchObject({ coreFilled: true, coreOnFocus: true });

    const substituted = classifyOutcome(
      session([part('del-ovning', 'fylld', 'dribbling'), part('del-spelovning', 'fylld')]),
    );
    expect(substituted).toMatchObject({ coreFilled: true, coreOnFocus: false });
  });

  it('räknar inte en kärndel som R-033 tagit bort emot fylld kärna, men noterar den', () => {
    const outcome = classifyOutcome(
      session([part('del-spelovning', 'fylld'), part('del-spel', 'fylld')], ['del-ovning']),
    );
    expect(outcome).toMatchObject({ coreFilled: true, coreOnFocus: true, coreRemoved: true });
  });

  it('räknar inte en kärna där båda kärndelarna är borttagna som fylld', () => {
    const outcome = classifyOutcome(
      session([part('del-spel', 'fylld')], ['del-ovning', 'del-spelovning']),
    );
    expect(outcome.coreFilled).toBe(false);
  });

  it('räknas ihop per cell', () => {
    const stats = emptyCellStats();
    addOutcome(stats, classifyOutcome(NONE));
    addOutcome(
      stats,
      classifyOutcome(session([part('del-ovning', 'fylld'), part('del-spelovning', 'fylld')])),
    );
    expect(stats).toEqual({ total: 2, none: 1, coreFilled: 1, coreOnFocus: 1, coreRemoved: 0 });
  });
});

describe('meetsGoal', () => {
  it('jämför andelen "inget pass" med målet, gränsen inräknad', () => {
    const stats = { total: 100, none: 5, coreFilled: 0, coreOnFocus: 0, coreRemoved: 0 };
    expect(meetsGoal(stats, 0.05)).toBe(true);
    expect(meetsGoal({ ...stats, none: 6 }, 0.05)).toBe(false);
  });

  it('ger null utan mål eller utan körfall', () => {
    expect(meetsGoal({ ...emptyCellStats(), total: 1 }, null)).toBeNull();
    expect(meetsGoal(emptyCellStats(), 0.05)).toBeNull();
  });
});

describe('argument och sökväg', () => {
  it('känner igen --snabb och avvisar annat', () => {
    expect(parseOptions([])).toEqual({ snabb: false });
    expect(parseOptions(['--snabb'])).toEqual({ snabb: true });
    expect(parseOptions(['--snab'])).toHaveProperty('error');
  });

  it('behåller bara körfallen i föreslagna celler med --snabb', () => {
    const cases: { input: { alder: number; spelform: GameFormat } }[] = [
      { input: { alder: 6, spelform: '3mot3' } },
      { input: { alder: 6, spelform: '5mot5' } },
      { input: { alder: 15, spelform: '11mot11' } },
      { input: { alder: 15, spelform: '9mot9' } },
    ];
    expect(onlySuggested(cases).map((kase) => kase.input)).toEqual([
      { alder: 6, spelform: '3mot3' },
      { alder: 15, spelform: '11mot11' },
    ]);
  });

  it('ger snabbkörningen ett eget filnamn', () => {
    expect(reportPath('2026-10-06', false)).toBe('docs/doman/tackning-2026-10-06.md');
    expect(reportPath('2026-10-06', true)).toBe('docs/doman/tackning-2026-10-06-snabb.md');
    expect(localDate(new Date(2026, 9, 6, 23, 59))).toBe('2026-10-06');
  });
});
