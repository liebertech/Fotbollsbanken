/**
 * Tester för kolumnen "Uppvärmning saknar övning" i täckningsrapporten (användarens beslut B3,
 * 2026-10-09, plan-omgang-8.md avsnitt 5).
 */
import { describe, expect, it } from 'vitest';
import { loadBank } from './bank.ts';
import {
  type GenerationResult,
  type Input,
  type PartResult,
  type SessionPartFromBank,
  generateSession,
  toBankExercise,
} from '../src/regelmotor/index.ts';
import {
  addWarmup,
  ageCellKey,
  emptyWarmupStats,
  rollUpWarmupToPlanCells,
  warmupIsEmpty,
} from './tackning-celler.ts';
import { CELL_COLUMN_COUNT, CELL_HEADER, cellColumns } from './tackning-mal.ts';

function part(name: SessionPartFromBank, status: PartResult['status']): PartResult {
  return {
    part: name,
    target: 10,
    minutes: status === 'fylld' ? 10 : 0,
    status,
    substituteFocus: null,
    missingFocus: [],
    emptyReason: status === 'fylld' ? null : 'gar-inte-att-kombinera',
    changeableFields: [],
  };
}

/** Ett pass med bara de fält `warmupIsEmpty` läser. */
function session(parts: PartResult[]): GenerationResult {
  return { kind: 'session', session: { parts, removedParts: [] } } as unknown as GenerationResult;
}

const NONE: GenerationResult = {
  kind: 'none',
  reason: { cause: 'inget-matchar', changeableFields: [], internalProblems: [] },
};

const FILLED = session([
  part('del-uppvarmning', 'fylld'),
  part('del-ovning', 'fylld'),
  part('del-spel', 'fylld'),
]);
const EMPTY = session([
  part('del-uppvarmning', 'saknar-ovning'),
  part('del-ovning', 'fylld'),
  part('del-spel', 'fylld'),
]);

describe('warmupIsEmpty', () => {
  it('är falsk när uppvärmningen har en övning', () => {
    expect(warmupIsEmpty(FILLED)).toBe(false);
  });

  it('är sann när uppvärmningen har status saknar-ovning (R-100)', () => {
    expect(warmupIsEmpty(EMPTY)).toBe(true);
  });

  it('räknar en uppvärmning som saknas bland delarna som tom', () => {
    expect(warmupIsEmpty(session([part('del-ovning', 'fylld')]))).toBe(true);
  });

  it('bryr sig inte om andra delar som saknar övning', () => {
    const result = session([
      part('del-uppvarmning', 'fylld'),
      part('del-ovning', 'saknar-ovning'),
      part('del-spelovning', 'saknar-ovning'),
      part('del-spel', 'fylld'),
    ]);
    expect(warmupIsEmpty(result)).toBe(false);
  });

  it('ger null när inget pass skapades', () => {
    expect(warmupIsEmpty(NONE)).toBeNull();
  });
});

describe('addWarmup och rollUpWarmupToPlanCells', () => {
  it('räknar bara skapade pass', () => {
    const stats = emptyWarmupStats();
    addWarmup(stats, FILLED);
    addWarmup(stats, EMPTY);
    addWarmup(stats, EMPTY);
    addWarmup(stats, NONE);
    expect(stats).toEqual({ sessions: 3, warmupEmpty: 2 });
  });

  it('slår ihop 6 och 7 år till cellen 6–7 år och hoppar över åldrar utan cell', () => {
    const ageCells = new Map([
      [ageCellKey(6, '3mot3'), { sessions: 10, warmupEmpty: 4 }],
      [ageCellKey(7, '3mot3'), { sessions: 20, warmupEmpty: 1 }],
      [ageCellKey(7, '5mot5'), { sessions: 5, warmupEmpty: 5 }],
      [ageCellKey(5, '3mot3'), { sessions: 99, warmupEmpty: 99 }],
    ]);
    const plan = rollUpWarmupToPlanCells(ageCells);
    expect(plan.get('3mot3|3mot3')).toEqual({ sessions: 30, warmupEmpty: 5 });
    expect(plan.get('3mot3|5mot5')).toEqual({ sessions: 5, warmupEmpty: 5 });
    expect(plan.size).toBe(2);
  });
});

describe('cellColumns', () => {
  const stats = { total: 200, none: 20, coreFilled: 90, coreOnFocus: 45, coreRemoved: 10 };

  it('lägger tom uppvärmning sist, i antal och av de skapade passen', () => {
    const columns = cellColumns(stats, { sessions: 180, warmupEmpty: 45 }).split(' | ');
    expect(columns).toHaveLength(CELL_COLUMN_COUNT);
    expect(columns).toEqual([
      '200',
      '20 (10.0 %)',
      '45.0 %',
      '50.0 %',
      '22.5 %',
      '5.0 %',
      '45 (25.0 %)',
    ]);
  });

  it('har rubriken "Uppvärmning saknar övning" som sista kolumn', () => {
    expect(CELL_HEADER.split(' | ').at(-1)).toBe('Uppvärmning saknar övning, av skapade pass');
  });

  it('visar streck när uppvärmningen saknar räkning eller cellen saknar pass', () => {
    expect(cellColumns(stats, undefined).split(' | ').at(-1)).toBe('–');
    expect(cellColumns(stats, emptyWarmupStats()).split(' | ').at(-1)).toBe('0 (–)');
  });
});

describe('warmupIsEmpty mot generatorn och den riktiga banken', () => {
  const underlag: Input = {
    alder: 11,
    spelform: '7mot7',
    niva: 'niva-2',
    spelare: 14,
    ledare: 2,
    passlangd: 60,
    fokus: ['passning-mottagning'],
  };
  const exercises = loadBank().exercises;

  it('ger en fylld uppvärmning med hela banken', () => {
    const result = generateSession(underlag, exercises.map(toBankExercise), 'fro-1');
    expect(result.kind).toBe('session');
    expect(warmupIsEmpty(result)).toBe(false);
  });

  it('ger ett pass där uppvärmningen saknar övning när ingen övning får del-uppvarmning', () => {
    const utanUppvarmning = exercises
      .map((exercise) => ({
        ...exercise,
        passdelar: exercise.passdelar.filter((name) => name !== 'del-uppvarmning'),
      }))
      .filter((exercise) => exercise.passdelar.length > 0)
      .map(toBankExercise);
    const result = generateSession(underlag, utanUppvarmning, 'fro-1');
    expect(result.kind).toBe('session');
    if (result.kind !== 'session') {
      return;
    }
    // Så ser ett pass med tom uppvärmning ut: delen finns kvar, med status saknar-ovning.
    const warmup = result.session.parts.find((item) => item.part === 'del-uppvarmning');
    expect(warmup?.status).toBe('saknar-ovning');
    expect(warmupIsEmpty(result)).toBe(true);
  });
});
