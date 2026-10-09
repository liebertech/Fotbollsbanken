/**
 * Sammanfattningarna mot målen per cell i plan-omgang-6.md och plan-omgang-7.md (avsnitt 1.1)
 * för täckningsskriptet (`scripts/tackning.ts`).
 *
 * Modulen har inga sidoeffekter, så att sammanställningen går att testa med syntetiska
 * celler utan att köra svepet. `scripts/tackning.ts` kör svepet när den importeras och kan
 * därför inte importeras i tester.
 */
import { GAME_FORMAT_AGES } from '../src/regelmotor/keys.ts';
import type { GameFormat } from '../src/regelmotor/index.ts';
import {
  type CellGoal,
  type CellGoals,
  type CellKind,
  type CellStats,
  EQUAL_PLAN_CELLS_OMGANG7,
  GOAL_MEASURES,
  type GoalMeasure,
  PLAN_GOALS,
  type PlanGoal,
  meetsCellGoal,
  percentOneDecimal,
  planCellLabel,
  rollUpToPlanCells,
  sameOnGoalMeasures,
} from './tackning-celler.ts';

export function pct(count: number, total: number): string {
  const value = percentOneDecimal(count, total);
  return value === null ? '–' : `${value.toFixed(1)} %`;
}

export function verdict(value: boolean | null): string {
  if (value === null) {
    return '–';
  }
  return value ? 'ja' : 'nej';
}

export const KIND_LABEL: Record<CellKind, string> = { foreslagen: 'föreslagen', granne: 'granne' };

const MEASURE_LABEL: Record<GoalMeasure, string> = {
  none: 'Inget pass',
  coreFilled: 'Fylld kärna',
  coreOnFocus: 'Kärna på valt fokus',
};

export function cellGoalText(goal: CellGoal): string {
  const value = `${goal.percent.toFixed(1)} %`;
  switch (goal.kind) {
    case 'max':
      return `≤ ${value}`;
    case 'min':
      return `≥ ${value}`;
    case 'oforandrat':
      return `= ${value} (oförändrat)`;
  }
}

/**
 * Åldrarna för åldersgrupperna, med angränsande spann ihopslagna: `['3mot3', '9mot9',
 * '11mot11']` ger "6–7 år och 13–19 år".
 */
export function agesLabel(groups: Iterable<GameFormat>): string {
  const spans = [...new Set(groups)]
    .map((group) => ({ ...GAME_FORMAT_AGES[group] }))
    .sort((a, b) => a.min - b.min);
  const merged: { min: number; max: number }[] = [];
  for (const span of spans) {
    const last = merged.at(-1);
    if (last !== undefined && span.min <= last.max + 1) {
      last.max = Math.max(last.max, span.max);
    } else {
      merged.push(span);
    }
  }
  if (merged.length === 0) {
    return '–';
  }
  const texts = merged.map((span) => `${span.min}–${span.max} år`);
  return texts.length === 1
    ? texts[0]!
    : `${texts.slice(0, -1).join(', ')} och ${texts[texts.length - 1]!}`;
}

/** Vad som skiljer sammanfattningarna för omgång 6 och omgång 7 åt. */
export interface CellGoalRound {
  round: number;
  goalsOf: (goal: PlanGoal) => CellGoals;
  /**
   * En senare omgång som höjer mål som den här omgången kräver ska vara oförändrade. Ett
   * sådant värde som inte längre är oförändrat märks "ändras av omgång N" i stället för "nej".
   */
  later?: { round: number; goalsOf: (goal: PlanGoal) => CellGoals };
}

export const OMGANG6: CellGoalRound = {
  round: 6,
  goalsOf: (goal) => goal.omgang6,
  later: { round: 7, goalsOf: (goal) => goal.omgang7 },
};

export const OMGANG7: CellGoalRound = {
  round: 7,
  goalsOf: (goal) => goal.omgang7,
};

export interface GoalRow {
  goal: PlanGoal;
  measure: GoalMeasure;
  target: CellGoal;
  nu: CellStats;
  efter: CellStats;
  verdictNu: string;
  verdictEfter: string;
}

export interface GoalTally {
  count: number;
  nu: number;
  efter: number;
}

export interface GoalSummary {
  rows: GoalRow[];
  /** Mål "högst" och "minst". */
  raised: GoalTally;
  /** Mål "exakt oförändrat". */
  kept: GoalTally;
  /** Oförändrat-mål som inte nåtts och som den senare omgången höjer. */
  changedByLater: { nu: number; efter: number };
  raisedAges: string;
  keptAges: string;
}

function emptyTally(): GoalTally {
  return { count: 0, nu: 0, efter: 0 };
}

/** Raderna och räknarna i sammanfattningen, utan text. */
export function summarizeCellGoals(
  nuCells: ReadonlyMap<string, CellStats>,
  efterCells: ReadonlyMap<string, CellStats>,
  spec: CellGoalRound,
): GoalSummary {
  const raised = emptyTally();
  const kept = emptyTally();
  const changedByLater = { nu: 0, efter: 0 };
  const rows: GoalRow[] = [];
  const raisedGroups = new Set<GameFormat>();
  const keptGroups = new Set<GameFormat>();
  for (const goal of PLAN_GOALS) {
    for (const measure of GOAL_MEASURES) {
      const kind = spec.goalsOf(goal)[measure].kind;
      (kind === 'oforandrat' ? keptGroups : raisedGroups).add(goal.group);
    }
    const key = `${goal.group}|${goal.spelform}`;
    const a = nuCells.get(key);
    const b = efterCells.get(key);
    if (a === undefined || b === undefined) {
      continue;
    }
    for (const measure of GOAL_MEASURES) {
      const target = spec.goalsOf(goal)[measure];
      const metNu = meetsCellGoal(a, measure, target);
      const metEfter = meetsCellGoal(b, measure, target);
      const isKept = target.kind === 'oforandrat';
      const bucket = isKept ? kept : raised;
      bucket.count += 1;
      bucket.nu += metNu === true ? 1 : 0;
      bucket.efter += metEfter === true ? 1 : 0;
      const raisedLater =
        isKept &&
        spec.later !== undefined &&
        spec.later.goalsOf(goal)[measure].kind !== 'oforandrat';
      const label = (met: boolean | null): string =>
        raisedLater && met === false ? `ändras av omgång ${spec.later!.round}` : verdict(met);
      if (raisedLater && metNu === false) {
        changedByLater.nu += 1;
      }
      if (raisedLater && metEfter === false) {
        changedByLater.efter += 1;
      }
      rows.push({
        goal,
        measure,
        target,
        nu: a,
        efter: b,
        verdictNu: label(metNu),
        verdictEfter: label(metEfter),
      });
    }
  }
  return {
    rows,
    raised,
    kept,
    changedByLater,
    raisedAges: agesLabel(raisedGroups),
    keptAges: agesLabel(keptGroups),
  };
}

/** Det som sammanfattningen behöver av ett scenario i scripts/tackning.ts. */
export interface SummaryScenario {
  bankSize: number;
  agg: { cells: ReadonlyMap<string, CellStats> };
}

export function renderCellGoalSummary(
  nu: SummaryScenario,
  efter: SummaryScenario,
  snabb: boolean,
  spec: CellGoalRound,
): string {
  const summary = summarizeCellGoals(
    rollUpToPlanCells(nu.agg.cells),
    rollUpToPlanCells(efter.agg.cells),
    spec,
  );
  const lines: string[] = [];
  lines.push(`## Sammanfattning: målen i plan-omgang-${spec.round}.md, avsnitt 1.1`);
  lines.push('');
  lines.push(
    `"Nu" är banken med ${nu.bankSize} godkända övningar. "Efter CI" räknar också de ${efter.bankSize - nu.bankSize} granskade som godkända (bara i minnet). Planen prövar målen mot "Banken nu" när omgång ${spec.round} är godkänd, eller mot "Efter CI" när omgångens övningar är granskade men inte godkända. Fylld kärna och kärna på valt fokus räknas av alla körfall. Målen i avsnitt 1.2 och 1.3 prövas för hand mot tabellerna längre ned (se *Metod*).`,
  );
  if (snabb) {
    lines.push('');
    lines.push(
      'Körningen gjordes med `--snabb`: bara de föreslagna cellerna är med. Grannceller saknas därför.',
    );
  }
  lines.push('');
  lines.push(
    `| Cell | Typ | Mått | Nu | Efter CI | Mål efter omgång ${spec.round} | Nått nu | Nått efter CI |`,
  );
  lines.push('|---|---|---|---|---|---|---|---|');
  for (const row of summary.rows) {
    const { goal, measure, nu: a, efter: b } = row;
    const kind = goal.group === goal.spelform ? 'foreslagen' : 'granne';
    lines.push(
      `| ${planCellLabel(goal.group, goal.spelform)} | ${KIND_LABEL[kind]} | ${MEASURE_LABEL[measure]} | ${pct(a[measure], a.total)} | ${pct(b[measure], b.total)} | ${cellGoalText(row.target)} | ${row.verdictNu} | ${row.verdictEfter} |`,
    );
  }
  const { raised, kept, changedByLater } = summary;
  let keptText = `Värdena för ${summary.keptAges}: ${kept.nu} av ${kept.count} oförändrade nu och ${kept.efter} av ${kept.count} efter CI`;
  if (spec.later === undefined) {
    keptText +=
      '; ett ändrat värde där är enligt planen ett fel i skriptet eller i en fil, inte en effekt av omgången.';
  } else {
    const marker = `"ändras av omgång ${spec.later.round}"`;
    keptText += `. Av de ändrade är ${changedByLater.nu} nu och ${changedByLater.efter} efter CI märkta ${marker}: omgång ${spec.later.round} höjer målen för dem med avsikt, och de bedöms i sammanfattningen för omgång ${spec.later.round}. Ett annat ändrat värde är enligt planen ett fel i skriptet eller i en fil, inte en effekt av omgången.`;
  }
  lines.push('');
  lines.push(
    `Målen för ${summary.raisedAges}: ${raised.nu} av ${raised.count} nådda nu och ${raised.efter} av ${raised.count} efter CI. ${keptText}`,
  );
  return lines.join('\n');
}

export function renderSummaryOmgang6(
  nu: SummaryScenario,
  efter: SummaryScenario,
  snabb: boolean,
): string {
  return renderCellGoalSummary(nu, efter, snabb, OMGANG6);
}

export function renderSummaryOmgang7(
  nu: SummaryScenario,
  efter: SummaryScenario,
  snabb: boolean,
): string {
  const lines = [renderCellGoalSummary(nu, efter, snabb, OMGANG7)];
  const nuCells = rollUpToPlanCells(nu.agg.cells);
  const efterCells = rollUpToPlanCells(efter.agg.cells);
  const label = (key: string): string => {
    const [group, spelform] = key.split('|') as [GameFormat, GameFormat];
    return planCellLabel(group, spelform);
  };
  for (const [keyA, keyB] of EQUAL_PLAN_CELLS_OMGANG7) {
    const nuSame = sameOnGoalMeasures(nuCells.get(keyA), nuCells.get(keyB));
    const efterSame = sameOnGoalMeasures(efterCells.get(keyA), efterCells.get(keyB));
    lines.push('');
    lines.push(
      `Kontrollen i avsnitt 1.1, att ${label(keyA)} och ${label(keyB)} är lika i antal körfall och i de tre måtten (räknat i antal): ${verdict(nuSame)} nu och ${verdict(efterSame)} efter CI. Om de skiljer sig är en övning fel märkt.`,
    );
  }
  return lines.join('\n');
}
