/**
 * Indelningen i celler och måtten per cell för täckningsskriptet (`scripts/tackning.ts`).
 *
 * En cell är ålder gånger spelform. Den är **föreslagen** när spelformen är den appen föreslår
 * för åldern (R-013, `suggestedGameFormat`, samma funktion som formuläret i
 * src/app/input/form.ts använder) och **granne** annars (R-014). Planens celler i
 * docs/doman/plan-omgang-5.md slår ihop åldrarna med samma föreslagna spelform, till exempel
 * "6–7 år, 3 mot 3", och det är på den nivån målen i plan-omgang-5.md avsnitt 1.2 och i
 * plan-omgang-6.md och plan-omgang-7.md, avsnitt 1.1, står.
 *
 * Modulen har inga sidoeffekter, så att den går att testa utan att köra svepet.
 */
import { CORE_PARTS, GAME_FORMAT_AGES, suggestedGameFormat } from '../src/regelmotor/keys.ts';
import type { GameFormat, GenerationResult, SessionPartFromBank } from '../src/regelmotor/index.ts';

export type CellKind = 'foreslagen' | 'granne';

/** Föreslagen eller granne. Undefined för en ålder utan föreslagen spelform. */
export function cellKind(alder: number, spelform: GameFormat): CellKind | undefined {
  const suggested = suggestedGameFormat(alder);
  if (suggested === undefined) {
    return undefined;
  }
  return suggested === spelform ? 'foreslagen' : 'granne';
}

/** Nyckel för en cell på åldersnivå. */
export function ageCellKey(alder: number, spelform: GameFormat): string {
  return `${alder}|${spelform}`;
}

/**
 * Nyckel för en cell på planens nivå: åldersgruppen (den föreslagna spelformen för åldern)
 * och den valda spelformen.
 */
export function planCellKey(alder: number, spelform: GameFormat): string | undefined {
  const group = suggestedGameFormat(alder);
  return group === undefined ? undefined : `${group}|${spelform}`;
}

export function formatGameFormat(spelform: GameFormat): string {
  return spelform.replace('mot', ' mot ');
}

/** "6–7 år, 3 mot 3" för planens cell med åldersgruppen `group`. */
export function planCellLabel(group: GameFormat, spelform: GameFormat): string {
  const span = GAME_FORMAT_AGES[group];
  return `${span.min}–${span.max} år, ${formatGameFormat(spelform)}`;
}

// ---------------------------------------------------------------------------
// Utfallet av ett körfall
// ---------------------------------------------------------------------------

export interface Outcome {
  /** Generatorn gav ett pass (R-101). */
  pass: boolean;
  /** Varje kärndel som finns kvar i passet har en övning (se `classifyOutcome`). */
  coreFilled: boolean;
  /** Kärnan är fylld och ingen kärndel fick ersättningsfokus (R-121). */
  coreOnFocus: boolean;
  /** En kärndel togs bort av R-033 (för kort pass). */
  coreRemoved: boolean;
}

/**
 * Kärnan är `del-ovning` och `del-spelovning` (CORE_PARTS). Den räknas som fylld när varje
 * kärndel som finns kvar i passet har status `fylld`, och minst en kärndel finns kvar. En
 * kärndel som R-033 tagit bort räknas inte emot, eftersom reglerna kräver att den tas bort.
 *
 * "På valt fokus" betyder att ingen kärndel fick ersättningsfokus. Då träffar varje kärndel
 * minst ett av ledarens valda fokusområden (R-040, R-041).
 */
export function classifyOutcome(result: GenerationResult): Outcome {
  if (result.kind !== 'session') {
    return { pass: false, coreFilled: false, coreOnFocus: false, coreRemoved: false };
  }
  const core = CORE_PARTS as readonly SessionPartFromBank[];
  const coreRemoved = result.session.removedParts.some((part) => core.includes(part));
  const coreParts = result.session.parts.filter((part) => core.includes(part.part));
  const coreFilled = coreParts.length > 0 && coreParts.every((part) => part.status === 'fylld');
  const coreOnFocus = coreFilled && coreParts.every((part) => part.substituteFocus === null);
  return { pass: true, coreFilled, coreOnFocus, coreRemoved };
}

// ---------------------------------------------------------------------------
// Räkning per cell
// ---------------------------------------------------------------------------

export interface CellStats {
  total: number;
  none: number;
  coreFilled: number;
  coreOnFocus: number;
  coreRemoved: number;
}

export function emptyCellStats(): CellStats {
  return { total: 0, none: 0, coreFilled: 0, coreOnFocus: 0, coreRemoved: 0 };
}

export function addOutcome(stats: CellStats, outcome: Outcome): void {
  stats.total += 1;
  if (!outcome.pass) {
    stats.none += 1;
  }
  if (outcome.coreFilled) {
    stats.coreFilled += 1;
  }
  if (outcome.coreOnFocus) {
    stats.coreOnFocus += 1;
  }
  if (outcome.coreRemoved) {
    stats.coreRemoved += 1;
  }
}

export function mergeCellStats(target: CellStats, source: CellStats): void {
  target.total += source.total;
  target.none += source.none;
  target.coreFilled += source.coreFilled;
  target.coreOnFocus += source.coreOnFocus;
  target.coreRemoved += source.coreRemoved;
}

/** Summerar celler på åldersnivå (nycklar från `ageCellKey`) till planens celler. */
export function rollUpToPlanCells(
  ageCells: ReadonlyMap<string, CellStats>,
): Map<string, CellStats> {
  const result = new Map<string, CellStats>();
  for (const [key, stats] of ageCells) {
    const [alderText, spelform] = key.split('|') as [string, GameFormat];
    const planKey = planCellKey(Number(alderText), spelform);
    if (planKey === undefined) {
      continue;
    }
    const entry = result.get(planKey) ?? emptyCellStats();
    mergeCellStats(entry, stats);
    result.set(planKey, entry);
  }
  return result;
}

/** Summan av cellerna av en viss sort, eller av alla när `kind` saknas. */
export function sumByKind(ageCells: ReadonlyMap<string, CellStats>, kind?: CellKind): CellStats {
  const sum = emptyCellStats();
  for (const [key, stats] of ageCells) {
    const [alderText, spelform] = key.split('|') as [string, GameFormat];
    if (kind === undefined || cellKind(Number(alderText), spelform) === kind) {
      mergeCellStats(sum, stats);
    }
  }
  return sum;
}

// ---------------------------------------------------------------------------
// Målen i plan-omgang-5.md (avsnitt 1.1 och 1.2), plan-omgang-6.md, plan-omgang-7.md och
// plan-omgang-8.md (avsnitt 1.1, och för omgång 8 också 1.3)
// ---------------------------------------------------------------------------

export interface PlanGoal {
  group: GameFormat;
  spelform: GameFormat;
  /** Högsta andel "inget pass" efter omgång 5, som bråkdel. Null: planen sätter inget mål. */
  maxNoneOmgang5: number | null;
  /** Högsta andel "inget pass" efter omgång 5B. */
  maxNone5B: number | null;
  /** Målen efter omgång 6 för de tre måtten (plan-omgang-6.md, avsnitt 1.1). */
  omgang6: CellGoals;
  /** Målen efter omgång 7 för de tre måtten (plan-omgang-7.md, avsnitt 1.1). */
  omgang7: CellGoals;
  /** Målen efter omgång 8 för de tre måtten (plan-omgang-8.md, avsnitt 1.1). */
  omgang8: CellGoals;
}

/** Ett av de tre måtten per cell, med samma namn som fälten i `CellStats`. */
export type GoalMeasure = 'none' | 'coreFilled' | 'coreOnFocus';

export const GOAL_MEASURES: readonly GoalMeasure[] = ['none', 'coreFilled', 'coreOnFocus'];

/**
 * Ett mål i avsnitt 1.1 i plan-omgang-6.md eller plan-omgang-7.md, i procent med en decimal.
 * `max` och `min` är planens "högst" och "minst". `oforandrat` är "exakt oförändrat": lika
 * med värdet i den rapport planen pekar ut, tabellen *Per cell i planen*: för omgång 6
 * docs/doman/tackning-2026-10-07.md, *Banken nu*, och för omgång 7
 * docs/doman/tackning-2026-10-08.md, *Efter CI-rättning*.
 */
export type CellGoal =
  | { kind: 'max'; percent: number }
  | { kind: 'min'; percent: number }
  | { kind: 'oforandrat'; percent: number };

/** Ett mål per mått i en cell. */
export type CellGoals = Readonly<Record<GoalMeasure, CellGoal>>;

/** Det tidigare namnet på `CellGoal`, kvar för befintliga anropare. */
export type Omgang6Goal = CellGoal;

/** Högst `none`, minst `coreFilled` och minst `coreOnFocus`, i procent. */
function raise(none: number, coreFilled: number, coreOnFocus: number): CellGoals {
  return {
    none: { kind: 'max', percent: none },
    coreFilled: { kind: 'min', percent: coreFilled },
    coreOnFocus: { kind: 'min', percent: coreOnFocus },
  };
}

/** Exakt oförändrade värden, i procent som rapporten skriver dem. */
function keep(none: number, coreFilled: number, coreOnFocus: number): CellGoals {
  return {
    none: { kind: 'oforandrat', percent: none },
    coreFilled: { kind: 'oforandrat', percent: coreFilled },
    coreOnFocus: { kind: 'oforandrat', percent: coreOnFocus },
  };
}

/**
 * Målen i planernas tabeller, avskrivna för hand (planerna är dokument, inte data).
 *
 * plan-omgang-5.md, tabell 1.2: "oförändrat" för 8–9 år i 5 mot 5 och 10–12 år i 7 mot 7 är
 * översatt till huvudmålet i avsnitt 1.1, högst 5 procent i varje föreslagen cell. "100 %" i
 * kolumnen för omgång 5 är ett läge, inte ett mål, och blir null.
 *
 * plan-omgang-6.md, tabell 1.1: för 13–19 år "högst" för inget pass och "minst" för fylld
 * kärna och kärna på valt fokus (båda av alla körfall). "Alla celler för 6–12 år" ska vara
 * exakt oförändrade; värdena är avskrivna ur tackning-2026-10-07.md (Banken nu, Per cell i
 * planen).
 *
 * plan-omgang-7.md, tabell 1.1: för 8–12 år "högst" för inget pass och "minst" för fylld
 * kärna och kärna på valt fokus (båda av alla körfall). 6–7 år och 13–19 år ska vara exakt
 * oförändrade; värdena är avskrivna ur tackning-2026-10-08.md (Efter CI-rättning, Per cell i
 * planen), som planen anger som utgångsläge.
 *
 * plan-omgang-8.md, tabell 1.1: för 6–7 år "högst" för inget pass och "minst" för fylld
 * kärna och kärna på valt fokus (båda av alla körfall). 8–19 år ska vara exakt oförändrade;
 * värdena är avskrivna ur tackning-2026-10-08-omgang-7.md (Efter CI-rättning, Per cell i
 * planen), som planen anger som utgångsläge.
 */
export const PLAN_GOALS: readonly PlanGoal[] = [
  {
    group: '3mot3',
    spelform: '3mot3',
    maxNoneOmgang5: 0.05,
    maxNone5B: 0.05,
    omgang6: keep(0.0, 85.7, 33.9),
    omgang7: keep(0.0, 85.7, 33.9),
    omgang8: raise(0.0, 95.0, 70.0),
  },
  {
    group: '3mot3',
    spelform: '5mot5',
    maxNoneOmgang5: 0.05,
    maxNone5B: 0.05,
    omgang6: keep(0.0, 85.7, 33.9),
    omgang7: keep(0.0, 85.7, 33.9),
    omgang8: raise(0.0, 95.0, 70.0),
  },
  {
    group: '5mot5',
    spelform: '5mot5',
    maxNoneOmgang5: 0.05,
    maxNone5B: 0.05,
    omgang6: keep(0.3, 74.8, 25.5),
    omgang7: raise(0.3, 82.0, 36.0),
    omgang8: keep(0.0, 85.5, 46.0),
  },
  {
    group: '5mot5',
    spelform: '3mot3',
    maxNoneOmgang5: null,
    maxNone5B: 0.05,
    omgang6: keep(2.3, 69.4, 22.6),
    omgang7: raise(2.3, 77.0, 32.0),
    omgang8: keep(0.0, 85.5, 43.2),
  },
  {
    group: '5mot5',
    spelform: '7mot7',
    maxNoneOmgang5: null,
    maxNone5B: 0.05,
    omgang6: keep(0.3, 74.8, 25.5),
    omgang7: raise(0.3, 82.0, 36.0),
    omgang8: keep(0.0, 85.5, 46.0),
  },
  {
    group: '7mot7',
    spelform: '7mot7',
    maxNoneOmgang5: 0.05,
    maxNone5B: 0.05,
    omgang6: keep(4.0, 73.9, 23.2),
    omgang7: raise(0.5, 82.0, 34.0),
    omgang8: keep(0.0, 91.7, 47.4),
  },
  {
    group: '7mot7',
    spelform: '5mot5',
    maxNoneOmgang5: null,
    maxNone5B: 0.1,
    omgang6: keep(9.3, 73.9, 23.2),
    omgang7: raise(0.5, 80.0, 33.0),
    omgang8: keep(0.0, 91.7, 47.4),
  },
  {
    group: '7mot7',
    spelform: '9mot9',
    maxNoneOmgang5: null,
    maxNone5B: 0.05,
    omgang6: keep(4.0, 73.9, 23.2),
    omgang7: raise(0.5, 82.0, 34.0),
    omgang8: keep(0.0, 91.7, 47.4),
  },
  {
    group: '9mot9',
    spelform: '9mot9',
    maxNoneOmgang5: 0.05,
    maxNone5B: 0.05,
    omgang6: raise(2.0, 68.0, 33.0),
    omgang7: keep(1.5, 77.4, 53.5),
    omgang8: keep(1.5, 77.4, 53.5),
  },
  {
    group: '9mot9',
    spelform: '7mot7',
    maxNoneOmgang5: 0.1,
    maxNone5B: 0.05,
    omgang6: raise(3.0, 58.0, 22.0),
    omgang7: keep(2.8, 75.5, 44.6),
    omgang8: keep(2.8, 75.5, 44.6),
  },
  {
    group: '9mot9',
    spelform: '11mot11',
    maxNoneOmgang5: 0.05,
    maxNone5B: 0.05,
    omgang6: raise(2.0, 68.0, 33.0),
    omgang7: keep(1.5, 77.4, 53.5),
    omgang8: keep(1.5, 77.4, 53.5),
  },
  {
    group: '11mot11',
    spelform: '11mot11',
    maxNoneOmgang5: 0.05,
    maxNone5B: 0.05,
    omgang6: raise(2.0, 65.0, 30.0),
    omgang7: keep(1.0, 89.5, 58.7),
    omgang8: keep(1.0, 89.5, 58.7),
  },
  {
    group: '11mot11',
    spelform: '9mot9',
    maxNoneOmgang5: 0.05,
    maxNone5B: 0.05,
    omgang6: raise(2.0, 65.0, 30.0),
    omgang7: keep(1.0, 89.5, 58.7),
    omgang8: keep(1.0, 89.5, 58.7),
  },
];

/** Uppfyller andelen målet? Null när målet saknas eller cellen inte har några körfall. */
export function meetsGoal(stats: CellStats, max: number | null): boolean | null {
  if (max === null || stats.total === 0) {
    return null;
  }
  return stats.none / stats.total <= max;
}

/**
 * Andelen i procent, avrundad till en decimal. Rapportens tabeller (`pct` i
 * scripts/tackning.ts) och målprövningen använder båda den, så att de inte kan glida isär.
 * Null när `total` är noll.
 */
export function percentOneDecimal(count: number, total: number): number | null {
  if (total === 0) {
    return null;
  }
  return Number(((100 * count) / total).toFixed(1));
}

/** Måttets andel i procent så som rapporten skriver den. Null när cellen saknar körfall. */
export function reportedPercent(stats: CellStats, measure: GoalMeasure): number | null {
  return percentOneDecimal(stats[measure], stats.total);
}

/**
 * Uppfyller måttet målet i plan-omgang-6.md eller plan-omgang-7.md? Planerna prövar målen mot
 * rapportens värden (till exempel `<= 2.0` och `>= 65.0`), så jämförelsen görs på det
 * avrundade värdet, gränsen inräknad. Null när cellen saknar körfall.
 */
export function meetsCellGoal(
  stats: CellStats,
  measure: GoalMeasure,
  goal: CellGoal,
): boolean | null {
  return meetsPercentGoal(reportedPercent(stats, measure), goal);
}

/**
 * Uppfyller en andel, i procent avrundad till en decimal som rapporten skriver den, målet?
 * Gränsen räknas in. Null när andelen saknas.
 */
export function meetsPercentGoal(value: number | null, goal: CellGoal): boolean | null {
  if (value === null) {
    return null;
  }
  switch (goal.kind) {
    case 'max':
      return value <= goal.percent;
    case 'min':
      return value >= goal.percent;
    case 'oforandrat':
      return value === goal.percent;
  }
}

/** Det tidigare namnet på `meetsCellGoal`, kvar för befintliga anropare. */
export const meetsOmgang6Goal = meetsCellGoal;

/**
 * Cellpar som ska vara lika på alla tre måtten efter omgång 7 (plan-omgang-7.md, avsnitt
 * 1.1): alla övningar för 8–9 år som är märkta 5 mot 5 är också märkta 7 mot 7, och tvärtom.
 * Skiljer cellerna sig är en övning fel märkt.
 */
export const EQUAL_PLAN_CELLS_OMGANG7: readonly (readonly [string, string])[] = [
  ['5mot5|5mot5', '5mot5|7mot7'],
];

/**
 * Cellpar som ska vara lika på alla tre måtten efter omgång 8 (plan-omgang-8.md, avsnitt 1.1
 * och 1.4): alla övningar för 6–7 år är märkta både 3 mot 3 och 5 mot 5.
 */
export const EQUAL_PLAN_CELLS_OMGANG8: readonly (readonly [string, string])[] = [
  ['3mot3|3mot3', '3mot3|5mot5'],
];

/** Ersättningsfokus per spelform, eller för hela banken (`alla`). */
export type SubstituteScope = GameFormat | 'alla';

/**
 * Målen för ersättningsfokus (R-121) efter omgång 8, plan-omgang-8.md avsnitt 1.3: andelen
 * fyllda kärnmoment med ersättningsfokus i enkelfokussvepet. "Exakt oförändrat" är lika med
 * tackning-2026-10-08-omgang-7.md (Efter CI-rättning, *Ersättningsfokus (R-121)*).
 */
export const SUBSTITUTE_GOALS_OMGANG8: readonly { scope: SubstituteScope; goal: CellGoal }[] = [
  { scope: '3mot3', goal: { kind: 'max', percent: 31.0 } },
  { scope: '5mot5', goal: { kind: 'max', percent: 33.0 } },
  { scope: '7mot7', goal: { kind: 'oforandrat', percent: 35.7 } },
  { scope: '9mot9', goal: { kind: 'oforandrat', percent: 33.3 } },
  { scope: '11mot11', goal: { kind: 'oforandrat', percent: 31.6 } },
  { scope: 'alla', goal: { kind: 'max', percent: 33.2 } },
];

// ---------------------------------------------------------------------------
// Tom uppvärmning (användarens beslut B3, 2026-10-09, plan-omgang-8.md avsnitt 5)
// ---------------------------------------------------------------------------

/**
 * Saknar uppvärmningen övning i passet? Null när generatorn inte gav något pass.
 *
 * Uppvärmningen tas aldrig bort av R-033, som bara gäller Öva och Spelövning, så den finns
 * alltid bland passets delar. När den inte kunde fyllas har den status `saknar-ovning`
 * (R-100). En uppvärmning som av någon anledning saknas bland delarna räknas också som tom,
 * eftersom den då inte har någon övning.
 */
export function warmupIsEmpty(result: GenerationResult): boolean | null {
  if (result.kind !== 'session') {
    return null;
  }
  return !result.session.parts.some(
    (part) => part.part === 'del-uppvarmning' && part.status === 'fylld',
  );
}

/** Tom uppvärmning per cell: antal skapade pass och hur många av dem som saknar uppvärmning. */
export interface WarmupStats {
  sessions: number;
  warmupEmpty: number;
}

export function emptyWarmupStats(): WarmupStats {
  return { sessions: 0, warmupEmpty: 0 };
}

export function addWarmup(stats: WarmupStats, result: GenerationResult): void {
  const empty = warmupIsEmpty(result);
  if (empty === null) {
    return;
  }
  stats.sessions += 1;
  if (empty) {
    stats.warmupEmpty += 1;
  }
}

/** Summerar tom uppvärmning på åldersnivå (nycklar från `ageCellKey`) till planens celler. */
export function rollUpWarmupToPlanCells(
  ageCells: ReadonlyMap<string, WarmupStats>,
): Map<string, WarmupStats> {
  const result = new Map<string, WarmupStats>();
  for (const [key, stats] of ageCells) {
    const [alderText, spelform] = key.split('|') as [string, GameFormat];
    const planKey = planCellKey(Number(alderText), spelform);
    if (planKey === undefined) {
      continue;
    }
    const entry = result.get(planKey) ?? emptyWarmupStats();
    entry.sessions += stats.sessions;
    entry.warmupEmpty += stats.warmupEmpty;
    result.set(planKey, entry);
  }
  return result;
}

/**
 * Är två celler lika i antal körfall och i de tre måtten, räknat i antal och inte i avrundad
 * procent? Null när någon av cellerna saknas eller saknar körfall.
 */
export function sameOnGoalMeasures(
  a: CellStats | undefined,
  b: CellStats | undefined,
): boolean | null {
  if (a === undefined || b === undefined || a.total === 0 || b.total === 0) {
    return null;
  }
  return a.total === b.total && GOAL_MEASURES.every((measure) => a[measure] === b[measure]);
}

// ---------------------------------------------------------------------------
// Argument
// ---------------------------------------------------------------------------

export interface Options {
  /** Kör bara de föreslagna cellerna. */
  snabb: boolean;
}

export function parseOptions(argv: readonly string[]): Options | { error: string } {
  const options: Options = { snabb: false };
  for (const arg of argv) {
    if (arg === '--snabb') {
      options.snabb = true;
    } else {
      return { error: `Okänt argument: ${arg}. Tillåtet: --snabb.` };
    }
  }
  return options;
}

/** Körfallen i de föreslagna cellerna, för `--snabb`. */
export function onlySuggested<T extends { input: { alder: number; spelform: GameFormat } }>(
  cases: readonly T[],
): T[] {
  return cases.filter((kase) => cellKind(kase.input.alder, kase.input.spelform) === 'foreslagen');
}

/** Dagens datum i lokal tid, ÅÅÅÅ-MM-DD, för rapportens filnamn. */
export function localDate(now: Date): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Rapportens sökväg. En snabbkörning får ett eget namn och skriver aldrig över hela rapporten. */
export function reportPath(date: string, snabb: boolean): string {
  return `docs/doman/tackning-${date}${snabb ? '-snabb' : ''}.md`;
}
