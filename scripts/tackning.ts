/**
 * Mäter hur ofta regelmotorn svarar "inget pass", och för vilka val, mot den riktiga
 * övningsbanken i content/ovningar/. Skriver en rapport till docs/doman/.
 *
 *   npm run tackning               hela svepet, skriver docs/doman/tackning-<datum>.md
 *   npm run tackning -- --snabb    bara de föreslagna cellerna, skriver ...-snabb.md
 *
 * Uppmätt 2026-10-06 med 42 + 16 övningar: --snabb 288 s (183 934 körfall per bank), hela
 * svepet se rapportens metodavsnitt.
 *
 * Rapporten redovisar också måtten per cell (ålder gånger spelform, föreslagen eller granne)
 * och jämför dem med målen i docs/doman/plan-omgang-8.md (avsnitt 1.1 och 1.3),
 * plan-omgang-7.md och plan-omgang-6.md (avsnitt 1.1) och, som förut,
 * docs/doman/plan-omgang-5.md (avsnitt 1.1 och 1.2). Den visar också per cell hur ofta
 * uppvärmningen saknar övning (beslut B3 i plan-omgang-8.md). Indelningen och måtten ligger i
 * `scripts/tackning-celler.ts` och sammanfattningarna i `scripts/tackning-mal.ts`, som har
 * egna tester.
 *
 * Syftet är att ge fotbollsexperten siffror att planera nästa omgång övningar efter, inte att
 * tolka dem fotbollsfackligt. Skriptet ändrar aldrig filer i content/ovningar/: den andra
 * körningen, med de granskade övningarna räknade som godkända, byggs bara i minnet (se
 * `loadGranskadAsApproved`). Generatorn anropas bara genom `src/regelmotor/index.ts`, den
 * enda publika ytan (ADR 0011 avsnitt 1).
 *
 * Underlagsrymden är för stor för en fullständig korsprodukt av alla val (se avsnittet
 * *Metod* i rapporten för den exakta avvägningen): ålder, spelform och nivå körs fullt ut,
 * fokusområden körs fullt ut både ensamma och i alla tillåtna kombinationer, antal spelare,
 * antal ledare och ytor körs som ett givet urval, och passlängden sampla vid min, mitten och
 * max för varje åldersfas, eftersom fältet är ett fritt tal utan en sluten lista.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { CONTENT_DIR, loadBank } from './bank.ts';
import {
  AREA_KEYS,
  BANK_ORIGIN,
  LEVELS,
  generateSession,
  partCanBeFilled,
  planTime,
  selectableFocusAreas,
  toBankExercise,
} from '../src/regelmotor/index.ts';
import {
  AGE_MAX,
  AGE_MIN,
  CORE_PARTS,
  SESSION_LENGTH_MAX,
  SESSION_LENGTH_MIN,
  allowedGameFormats,
  phaseForAge,
} from '../src/regelmotor/keys.ts';
import { exerciseSchema } from '../src/regelmotor/schema/ovning.ts';
import {
  type CellKind,
  type CellStats,
  PLAN_GOALS,
  type WarmupStats,
  addOutcome,
  addWarmup,
  ageCellKey,
  cellKind,
  classifyOutcome,
  emptyCellStats,
  emptyWarmupStats,
  formatGameFormat,
  localDate,
  meetsGoal,
  onlySuggested,
  parseOptions,
  planCellLabel,
  reportPath,
  rollUpToPlanCells,
  rollUpWarmupToPlanCells,
  sumByKind,
} from './tackning-celler.ts';
import {
  CELL_COLUMN_COUNT,
  CELL_HEADER,
  KIND_LABEL,
  cellColumns,
  pct,
  renderSummaryOmgang6,
  renderSummaryOmgang7,
  renderSummaryOmgang8,
  verdict,
} from './tackning-mal.ts';
import { publishExercise } from '../src/regelmotor/schema/published.ts';
import type {
  AreaKey,
  BankExercise,
  FocusArea,
  GameFormat,
  GenerationResult,
  Input,
  Level,
  Phase,
  SessionPartFromBank,
} from '../src/regelmotor/index.ts';

// ---------------------------------------------------------------------------
// Underlagsrymden
// ---------------------------------------------------------------------------

/** "ett rimligt urval av antal spelare" ur uppdraget. */
const PLAYER_SAMPLE = [4, 6, 8, 10, 12, 14, 16, 20];
/** "ett rimligt urval ... av antal ledare" ur uppdraget. */
const COACH_SAMPLE = [1, 2, 3];
/** Ytorna formuläret tillåter, plus att inte välja någon (R-090). */
const AREA_SAMPLE: (AreaKey | undefined)[] = [undefined, ...AREA_KEYS];
const LEVEL_SAMPLE: readonly Level[] = LEVELS;

/** Ett körfall: ett fullständigt underlag, redan vid giltig ålder och fas. */
interface SweepCase {
  input: Input;
  phase: Phase;
  /** `single`: precis ett fokusområde (tabellerna och R-121-måtten bygger på de här).
   *  `combo`: en tillåten kombination av två eller tre fokusområden. */
  group: 'single' | 'combo';
}

/** Alla heltal i [min, max]. */
function range(min: number, max: number): number[] {
  const values: number[] = [];
  for (let value = min; value <= max; value += 1) {
    values.push(value);
  }
  return values;
}

/**
 * Passlängder att pröva för fasen: kortast, mitten (avrundat till närmaste 5 minuter) och
 * längst tillåtna (R-018). Fältet är ett fritt tal, så ett urval görs i stället för en
 * fullständig lista.
 */
function lengthSample(phase: Phase): number[] {
  const min = SESSION_LENGTH_MIN;
  const max = SESSION_LENGTH_MAX[phase];
  const mid = Math.round((min + max) / 2 / 5) * 5;
  return [...new Set([min, mid, max])].sort((a, b) => a - b);
}

/** Alla delmängder av `items` med exakt `size` element, i den ordning items står i. */
function combinations<T>(items: readonly T[], size: number): T[][] {
  if (size === 0) {
    return [[]];
  }
  const result: T[][] = [];
  const pick: T[] = [];
  const go = (start: number): void => {
    if (pick.length === size) {
      result.push([...pick]);
      return;
    }
    for (let index = start; index < items.length; index += 1) {
      pick.push(items[index]!);
      go(index + 1);
      pick.pop();
    }
  };
  go(0);
  return result;
}

/**
 * Huvudsvepet: varje ålder, varje tillåten spelform och nivå för åldern, det givna urvalet av
 * spelare, ledare och yta, passlängdens urval för fasen, och varje enskilt fokusområde
 * formuläret tillåter för åldern (R-019). `nickspel` ensamt är inte ett giltigt underlag
 * (R-083) och testas bara i `buildFocusCombos`.
 */
function buildSingleFocusSweep(): SweepCase[] {
  const cases: SweepCase[] = [];
  for (const alder of range(AGE_MIN, AGE_MAX)) {
    const phase = phaseForAge(alder);
    if (phase === undefined) {
      continue;
    }
    const lengths = lengthSample(phase);
    const singles = selectableFocusAreas(phase, alder).filter((focus) => focus !== 'nickspel');
    for (const spelform of allowedGameFormats(alder)) {
      for (const niva of LEVEL_SAMPLE) {
        for (const spelare of PLAYER_SAMPLE) {
          for (const ledare of COACH_SAMPLE) {
            for (const passlangd of lengths) {
              for (const yta of AREA_SAMPLE) {
                for (const focus of singles) {
                  const input: Input = {
                    alder,
                    spelform,
                    niva,
                    spelare,
                    ledare,
                    passlangd,
                    fokus: [focus],
                  };
                  if (yta !== undefined) {
                    input.yta = yta;
                  }
                  cases.push({ input, phase, group: 'single' });
                }
              }
            }
          }
        }
      }
    }
  }
  return cases;
}

/**
 * Kombinationssvepet: varje tillåten kombination av två eller tre fokusområden formuläret
 * tillåter (R-019), för varje ålder och spelform, mot ett representativt underlag för övrigt
 * (nivå 2, 12 spelare, 2 ledare, mittlängden, ingen yta vald). De andra valen körs redan fullt
 * ut i `buildSingleFocusSweep`; här är poängen att själva kombinationerna är uttömmande.
 */
function buildFocusComboSweep(): SweepCase[] {
  const cases: SweepCase[] = [];
  for (const alder of range(AGE_MIN, AGE_MAX)) {
    const phase = phaseForAge(alder);
    if (phase === undefined) {
      continue;
    }
    const lengths = lengthSample(phase);
    const baseline = lengths[Math.floor(lengths.length / 2)]!;
    const selectable = selectableFocusAreas(phase, alder);
    const combos = [...combinations(selectable, 2), ...combinations(selectable, 3)];
    for (const spelform of allowedGameFormats(alder)) {
      for (const fokus of combos) {
        const input: Input = {
          alder,
          spelform,
          niva: 'niva-2',
          spelare: 12,
          ledare: 2,
          passlangd: baseline,
          fokus,
        };
        cases.push({ input, phase, group: 'combo' });
      }
    }
  }
  return cases;
}

// ---------------------------------------------------------------------------
// Banken: den riktiga (R-022) och jämförelseläget med granskade övningar inräknade
// ---------------------------------------------------------------------------

function readExerciseDocuments(): { file: string; document: Record<string, unknown> }[] {
  const files = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => extname(name) === '.yaml' && !name.startsWith('_'))
    .sort();
  return files.map((name) => {
    const file = join(CONTENT_DIR, name);
    const document = parseYaml(readFileSync(file, 'utf8')) as Record<string, unknown>;
    return { file, document };
  });
}

/**
 * De övningar som i dag har status `granskad`, byggda som om de var godkända, men bara i
 * minnet. content/ovningar/ läses, aldrig skrivs. Det här är inte vägen in i den riktiga
 * banken (R-022 gäller fortfarande där) utan ett jämförelseläge för uppdragets punkt 2.
 */
function loadGranskadAsApproved(): { extra: BankExercise[]; problems: string[] } {
  const extra: BankExercise[] = [];
  const problems: string[] = [];
  for (const { file, document } of readExerciseDocuments()) {
    if ((document as { status?: unknown }).status !== 'granskad') {
      continue;
    }
    const result = exerciseSchema.safeParse(document);
    if (!result.success) {
      problems.push(`${file}: ${result.error.issues.map((issue) => issue.message).join('; ')}`);
      continue;
    }
    extra.push({
      ...publishExercise(result.data),
      status: 'godkand',
      ursprung: BANK_ORIGIN,
    });
  }
  return { extra, problems };
}

// ---------------------------------------------------------------------------
// Insamling
// ---------------------------------------------------------------------------

interface CountPair {
  total: number;
  none: number;
}

interface PartFillEntry {
  /** Antal körfall där delen inte tagits bort av R-033. */
  attempts: number;
  /** Av `attempts`, hur många där delen *inte* kan fyllas för sig (begreppet i generatorregler.md). */
  notFillable: number;
}

interface Aggregate {
  totalAttempts: number;
  noneCount: number;
  sessionCount: number;
  noneByCause: Map<string, number>;
  /** R-103: vilket enskilt val som, om det ändrades, skulle kunna ge ett pass. */
  changeableFieldCounts: Map<string, number>;
  /** Ska alltid vara tom. En post här är en bugg i motorn, inte ett fotbollsfynd. */
  internalProblems: string[];
  ageTotals: Map<number, CountPair>;
  spelformTotals: Map<GameFormat, CountPair>;
  /** Nyckel: `${spelform}|${del}|${fokus}`. Bara från `single`-svepet. */
  partFill: Map<string, PartFillEntry>;
  /** R-121, bara från `single`-svepet, bara pass som faktiskt skapades. */
  coreFilled: number;
  coreSubstitute: number;
  coreBySpelform: Map<GameFormat, { filled: number; substitute: number }>;
  substituteMapping: Map<string, number>;
  /** Körfall som fick orsaken "gar-inte-att-kombinera", för frökänslighetskontrollen. */
  combinationFailures: SweepCase[];
  /** Per cell på åldersnivå (`ageCellKey`), från båda sveparna. */
  cells: Map<string, CellStats>;
  /** Tom uppvärmning per cell på åldersnivå (beslut B3), från båda sveparna. */
  warmup: Map<string, WarmupStats>;
}

function newAggregate(): Aggregate {
  return {
    totalAttempts: 0,
    noneCount: 0,
    sessionCount: 0,
    noneByCause: new Map(),
    changeableFieldCounts: new Map(),
    internalProblems: [],
    ageTotals: new Map(),
    spelformTotals: new Map(),
    partFill: new Map(),
    coreFilled: 0,
    coreSubstitute: 0,
    coreBySpelform: new Map(),
    substituteMapping: new Map(),
    combinationFailures: [],
    cells: new Map(),
    warmup: new Map(),
  };
}

function bump(map: Map<string, number>, key: string, by = 1): void {
  map.set(key, (map.get(key) ?? 0) + by);
}

function bumpPair<K>(map: Map<K, CountPair>, key: K, isNone: boolean): void {
  const entry = map.get(key) ?? { total: 0, none: 0 };
  entry.total += 1;
  if (isNone) {
    entry.none += 1;
  }
  map.set(key, entry);
}

function recordAttempt(
  agg: Aggregate,
  bank: readonly BankExercise[],
  kase: SweepCase,
  result: GenerationResult,
): void {
  agg.totalAttempts += 1;
  const isNone = result.kind === 'none';
  bumpPair(agg.ageTotals, kase.input.alder, isNone);
  bumpPair(agg.spelformTotals, kase.input.spelform, isNone);
  const cellKey = ageCellKey(kase.input.alder, kase.input.spelform);
  const cell = agg.cells.get(cellKey) ?? emptyCellStats();
  addOutcome(cell, classifyOutcome(result));
  agg.cells.set(cellKey, cell);
  const warmup = agg.warmup.get(cellKey) ?? emptyWarmupStats();
  addWarmup(warmup, result);
  agg.warmup.set(cellKey, warmup);

  if (result.kind === 'none') {
    agg.noneCount += 1;
    bump(agg.noneByCause, result.reason.cause);
    for (const field of result.reason.changeableFields) {
      bump(agg.changeableFieldCounts, field);
    }
    if (result.reason.internalProblems.length > 0) {
      agg.internalProblems.push(
        `${JSON.stringify(kase.input)}: ${result.reason.internalProblems.join('; ')}`,
      );
    }
    if (result.reason.cause === 'gar-inte-att-kombinera') {
      agg.combinationFailures.push(kase);
    }
  } else {
    agg.sessionCount += 1;
  }

  if (kase.group !== 'single') {
    return;
  }
  const focus = kase.input.fokus[0]!;
  const plan = planTime(kase.phase, kase.input.passlangd);
  for (const { part, target } of plan.parts) {
    const key = `${kase.input.spelform}|${part}|${focus}`;
    const entry = agg.partFill.get(key) ?? { attempts: 0, notFillable: 0 };
    entry.attempts += 1;
    if (!partCanBeFilled(bank, kase.input, kase.phase, part, target, [focus])) {
      entry.notFillable += 1;
    }
    agg.partFill.set(key, entry);
  }

  if (result.kind !== 'session') {
    return;
  }
  for (const partResult of result.session.parts) {
    if (!(CORE_PARTS as readonly SessionPartFromBank[]).includes(partResult.part)) {
      continue;
    }
    if (partResult.status !== 'fylld') {
      continue;
    }
    agg.coreFilled += 1;
    const entry = agg.coreBySpelform.get(kase.input.spelform) ?? { filled: 0, substitute: 0 };
    entry.filled += 1;
    if (partResult.substituteFocus !== null) {
      agg.coreSubstitute += 1;
      entry.substitute += 1;
      bump(agg.substituteMapping, `${focus} -> ${partResult.substituteFocus}`);
    }
    agg.coreBySpelform.set(kase.input.spelform, entry);
  }
}

function analyse(
  bank: readonly BankExercise[],
  seed: string,
  singleSweep: readonly SweepCase[],
  comboSweep: readonly SweepCase[],
  onProgress: (done: number, total: number) => void,
): Aggregate {
  const agg = newAggregate();
  const total = singleSweep.length + comboSweep.length;
  let done = 0;
  for (const kase of singleSweep) {
    recordAttempt(agg, bank, kase, generateSession(kase.input, bank, seed));
    done += 1;
    if (done % 50_000 === 0) {
      onProgress(done, total);
    }
  }
  for (const kase of comboSweep) {
    recordAttempt(agg, bank, kase, generateSession(kase.input, bank, seed));
    done += 1;
    if (done % 50_000 === 0) {
      onProgress(done, total);
    }
  }
  onProgress(done, total);
  return agg;
}

/** Hur ofta ett annat frö gör att ett "gar-inte-att-kombinera"-fall i stället ger ett pass. */
function seedSensitivity(
  bank: readonly BankExercise[],
  failures: readonly SweepCase[],
  extraSeeds: readonly string[],
): { checked: number; flipped: number } {
  let flipped = 0;
  for (const kase of failures) {
    const changed = extraSeeds.some(
      (seed) => generateSession(kase.input, bank, seed).kind === 'session',
    );
    if (changed) {
      flipped += 1;
    }
  }
  return { checked: failures.length, flipped };
}

// ---------------------------------------------------------------------------
// Statiska bankmått (oberoende av sveparna)
// ---------------------------------------------------------------------------

function staticBankCounts(bank: readonly BankExercise[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const exercise of bank) {
    for (const spelform of exercise.spelformer) {
      for (const del of exercise.passdelar) {
        for (const focus of exercise.fokusomraden) {
          bump(counts, `${spelform}|${del}|${focus}`);
        }
      }
    }
  }
  return counts;
}

/** Fokusområden som är valbara för minst en ålder där spelformen är tillåten (R-013, R-019). */
function relevantFocusForSpelform(spelform: GameFormat): FocusArea[] {
  const set = new Set<FocusArea>();
  for (const alder of range(AGE_MIN, AGE_MAX)) {
    const phase = phaseForAge(alder);
    if (phase === undefined || !allowedGameFormats(alder).includes(spelform)) {
      continue;
    }
    for (const focus of selectableFocusAreas(phase, alder)) {
      set.add(focus);
    }
  }
  return [...set];
}

// ---------------------------------------------------------------------------
// Rapport
// ---------------------------------------------------------------------------

const GAME_FORMAT_LIST: GameFormat[] = ['3mot3', '5mot5', '7mot7', '9mot9', '11mot11'];
const PART_LIST: SessionPartFromBank[] = [
  'del-uppvarmning',
  'del-ovning',
  'del-spelovning',
  'del-spel',
];

function partTable(agg: Aggregate, bankCounts: Map<string, number>, spelform: GameFormat): string {
  const focusList = relevantFocusForSpelform(spelform);
  const lines: string[] = [];
  for (const del of PART_LIST) {
    lines.push(`\n**${del}**\n`);
    lines.push(
      '| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |',
    );
    lines.push('|---|---|---|---|');
    for (const focus of focusList) {
      const key = `${spelform}|${del}|${focus}`;
      const bankCount = bankCounts.get(key) ?? 0;
      const fill = agg.partFill.get(key);
      const attempts = fill?.attempts ?? 0;
      const notFillable = fill?.notFillable ?? 0;
      lines.push(`| ${focus} | ${bankCount} | ${attempts} | ${pct(notFillable, attempts)} |`);
    }
  }
  return lines.join('\n');
}

function renderCauseTable(agg: Aggregate): string {
  const lines = [
    '| Orsak (regelmotorns kod) | Regel | Antal | Andel av alla "inget pass" |',
    '|---|---|---|---|',
  ];
  const causes: { key: string; regel: string }[] = [
    {
      key: 'inget-matchar',
      regel:
        'R-101 (ingen av del-ovning, del-spelovning, del-spel kan fyllas, se R-100 "Delen kan fyllas")',
    },
    {
      key: 'gar-inte-att-kombinera',
      regel:
        'R-100, andra punkten (en del kan fyllas för sig men gick inte ihop med resten av passet)',
    },
  ];
  for (const cause of causes) {
    const count = agg.noneByCause.get(cause.key) ?? 0;
    lines.push(`| \`${cause.key}\` | ${cause.regel} | ${count} | ${pct(count, agg.noneCount)} |`);
  }
  return lines.join('\n');
}

function renderChangeableFieldTable(agg: Aggregate): string {
  const lines = [
    '| Val som, ensamt ändrat, skulle kunna ge ett pass (R-103) | Antal "inget pass" där det hjälper | Andel |',
    '|---|---|---|',
  ];
  const sorted = [...agg.changeableFieldCounts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [field, count] of sorted) {
    lines.push(`| ${field} | ${count} | ${pct(count, agg.noneCount)} |`);
  }
  if (sorted.length === 0) {
    lines.push('| (inga) | 0 | – |');
  }
  return lines.join('\n');
}

function renderAgeTable(agg: Aggregate): string {
  const lines = ['| Ålder | Körfall | Inget pass | Andel |', '|---|---|---|---|'];
  for (const alder of range(AGE_MIN, AGE_MAX)) {
    const entry = agg.ageTotals.get(alder) ?? { total: 0, none: 0 };
    lines.push(`| ${alder} | ${entry.total} | ${entry.none} | ${pct(entry.none, entry.total)} |`);
  }
  return lines.join('\n');
}

function renderSpelformTable(agg: Aggregate): string {
  const lines = ['| Spelform | Körfall | Inget pass | Andel |', '|---|---|---|---|'];
  for (const spelform of GAME_FORMAT_LIST) {
    const entry = agg.spelformTotals.get(spelform) ?? { total: 0, none: 0 };
    lines.push(
      `| ${spelform} | ${entry.total} | ${entry.none} | ${pct(entry.none, entry.total)} |`,
    );
  }
  return lines.join('\n');
}

function renderSubstituteSection(agg: Aggregate): string {
  const lines: string[] = [];
  lines.push(
    `Av ${agg.coreFilled} fyllda kärnmoment (del-ovning eller del-spelovning, över alla körfall i enkelfokussvepet som gav ett pass) fick ${agg.coreSubstitute} ett ersättningsfokus (R-121): ${pct(agg.coreSubstitute, agg.coreFilled)}.`,
  );
  lines.push('');
  lines.push('| Spelform | Fyllda kärnmoment | Med ersättningsfokus | Andel |');
  lines.push('|---|---|---|---|');
  for (const spelform of GAME_FORMAT_LIST) {
    const entry = agg.coreBySpelform.get(spelform) ?? { filled: 0, substitute: 0 };
    lines.push(
      `| ${spelform} | ${entry.filled} | ${entry.substitute} | ${pct(entry.substitute, entry.filled)} |`,
    );
  }
  lines.push('');
  lines.push('De tio vanligaste ersättningarna (valt fokus -> ersättningsfokus):');
  lines.push('');
  lines.push('| Valt fokus -> ersättning | Antal |');
  lines.push('|---|---|');
  const sorted = [...agg.substituteMapping.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  for (const [mapping, count] of sorted) {
    lines.push(`| ${mapping} | ${count} |`);
  }
  if (sorted.length === 0) {
    lines.push('| (inga) | 0 |');
  }
  return lines.join('\n');
}

function separatorRow(columns: number): string {
  return `|${'---|'.repeat(columns)}`;
}

function renderAgeCellTable(agg: Aggregate): string {
  const lines = [
    `| Ålder | Spelform | Typ | ${CELL_HEADER} |`,
    separatorRow(3 + CELL_COLUMN_COUNT),
  ];
  for (const alder of range(AGE_MIN, AGE_MAX)) {
    for (const spelform of allowedGameFormats(alder)) {
      const key = ageCellKey(alder, spelform);
      const stats = agg.cells.get(key);
      if (stats === undefined) {
        continue;
      }
      const kind = cellKind(alder, spelform);
      const kindLabel = kind === undefined ? '–' : KIND_LABEL[kind];
      lines.push(
        `| ${alder} | ${formatGameFormat(spelform)} | ${kindLabel} | ${cellColumns(stats, agg.warmup.get(key))} |`,
      );
    }
  }
  return lines.join('\n');
}

function renderPlanCellTable(agg: Aggregate): string {
  const planCells = rollUpToPlanCells(agg.cells);
  const planWarmup = rollUpWarmupToPlanCells(agg.warmup);
  const lines = [`| Cell | Typ | ${CELL_HEADER} |`, separatorRow(2 + CELL_COLUMN_COUNT)];
  for (const goal of PLAN_GOALS) {
    const key = `${goal.group}|${goal.spelform}`;
    const stats = planCells.get(key);
    if (stats === undefined) {
      continue;
    }
    const kind = goal.group === goal.spelform ? 'foreslagen' : 'granne';
    lines.push(
      `| ${planCellLabel(goal.group, goal.spelform)} | ${KIND_LABEL[kind]} | ${cellColumns(stats, planWarmup.get(key))} |`,
    );
  }
  return lines.join('\n');
}

function goalText(max: number | null): string {
  return max === null ? 'inget mål' : `≤ ${Math.round(max * 100)} %`;
}

function renderSummary(nu: ScenarioResult, efter: ScenarioResult, snabb: boolean): string {
  const nuCells = rollUpToPlanCells(nu.agg.cells);
  const efterCells = rollUpToPlanCells(efter.agg.cells);
  const lines: string[] = [];
  lines.push('## Sammanfattning: målen i plan-omgang-5.md, avsnitt 1.1 och 1.2');
  lines.push('');
  lines.push(
    `"Nu" är banken med ${nu.bankSize} godkända övningar. "Efter CI" räknar också de ${efter.bankSize - nu.bankSize} granskade som godkända (bara i minnet). Målet gäller "inget pass" efter omgång 5; för fylld kärna sätter avsnitt 1.2 inget mål, så de kolumnerna redovisas utan bedömning (se *Metod*).`,
  );
  if (snabb) {
    lines.push('');
    lines.push(
      'Körningen gjordes med `--snabb`: bara de föreslagna cellerna är med. Grannceller och "alla körfall" saknas därför.',
    );
  }
  lines.push('');
  lines.push(
    '| Cell | Typ | Inget pass, nu | Inget pass, efter CI | Mål efter omgång 5 | Nått nu | Nått efter CI | Mål efter 5B | Fylld kärna, nu | Fylld kärna, efter CI | Kärna på valt fokus, nu | Kärna på valt fokus, efter CI |',
  );
  lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
  const row = (
    label: string,
    kind: string,
    a: CellStats,
    b: CellStats,
    goal5: string,
    met: [string, string],
    goal5B: string,
  ): string =>
    `| ${label} | ${kind} | ${pct(a.none, a.total)} | ${pct(b.none, b.total)} | ${goal5} | ${met[0]} | ${met[1]} | ${goal5B} | ${pct(a.coreFilled, a.total)} | ${pct(b.coreFilled, b.total)} | ${pct(a.coreOnFocus, a.total)} | ${pct(b.coreOnFocus, b.total)} |`;
  let suggestedMetNu = 0;
  let suggestedMetEfter = 0;
  let suggestedCount = 0;
  for (const goal of PLAN_GOALS) {
    const key = `${goal.group}|${goal.spelform}`;
    const a = nuCells.get(key);
    const b = efterCells.get(key);
    if (a === undefined || b === undefined) {
      continue;
    }
    const kind = goal.group === goal.spelform ? 'foreslagen' : 'granne';
    const metNu = meetsGoal(a, goal.maxNoneOmgang5);
    const metEfter = meetsGoal(b, goal.maxNoneOmgang5);
    if (kind === 'foreslagen') {
      suggestedCount += 1;
      suggestedMetNu += metNu === true ? 1 : 0;
      suggestedMetEfter += metEfter === true ? 1 : 0;
    }
    lines.push(
      row(
        planCellLabel(goal.group, goal.spelform),
        KIND_LABEL[kind],
        a,
        b,
        goalText(goal.maxNoneOmgang5),
        [verdict(metNu), verdict(metEfter)],
        goalText(goal.maxNone5B),
      ),
    );
  }
  const totals: { label: string; kind?: CellKind; goal: string }[] = [
    {
      label: '**Föreslagna celler sammantaget**',
      kind: 'foreslagen',
      goal: 'uträknat ≤ 4 % (1.3)',
    },
    { label: '**Grannceller sammantaget**', kind: 'granne', goal: '–' },
    { label: '**Alla körfall**', goal: 'uträknat ≤ 32 % (1.3)' },
  ];
  for (const total of totals) {
    const a = sumByKind(nu.agg.cells, total.kind);
    const b = sumByKind(efter.agg.cells, total.kind);
    if (a.total === 0 || (snabb && total.kind !== 'foreslagen')) {
      continue;
    }
    lines.push(row(total.label, '', a, b, total.goal, ['–', '–'], '–'));
  }
  lines.push('');
  lines.push(
    `Huvudmålet i avsnitt 1.1 (högst 5 % "inget pass" i varje föreslagen cell): uppfyllt i ${suggestedMetNu} av ${suggestedCount} föreslagna celler nu och i ${suggestedMetEfter} av ${suggestedCount} efter CI.`,
  );
  return lines.join('\n');
}

interface ScenarioResult {
  label: string;
  bankSize: number;
  agg: Aggregate;
  bankCounts: Map<string, number>;
}

function renderScenario(scenario: ScenarioResult, withPartTables: boolean): string {
  const { label, bankSize, agg, bankCounts } = scenario;
  const lines: string[] = [];
  lines.push(`## ${label}`);
  lines.push('');
  lines.push(`Banken som regelmotorn fick: ${bankSize} övningar.`);
  lines.push('');
  lines.push(
    `Körfall totalt: ${agg.totalAttempts}. "Inget pass": ${agg.noneCount} (${pct(agg.noneCount, agg.totalAttempts)}). Pass skapat: ${agg.sessionCount} (${pct(agg.sessionCount, agg.totalAttempts)}).`,
  );
  lines.push('');
  lines.push('### Per cell i planen (åldersgrupp och spelform)');
  lines.push('');
  lines.push(renderPlanCellTable(agg));
  lines.push('');
  lines.push('### Per cell (ålder och spelform)');
  lines.push('');
  lines.push(renderAgeCellTable(agg));
  lines.push('');
  lines.push('### Andel "inget pass" per ålder');
  lines.push('');
  lines.push(renderAgeTable(agg));
  lines.push('');
  lines.push('### Andel "inget pass" per spelform');
  lines.push('');
  lines.push(renderSpelformTable(agg));
  lines.push('');
  lines.push('### Orsaker, enligt generatorns egna koder');
  lines.push('');
  lines.push(renderCauseTable(agg));
  lines.push('');
  lines.push('### Vilket enskilt val som skulle kunna ge ett pass (R-103), bland "inget pass"');
  lines.push('');
  lines.push(renderChangeableFieldTable(agg));
  lines.push('');
  lines.push('### Ersättningsfokus (R-121)');
  lines.push('');
  lines.push(renderSubstituteSection(agg));
  if (withPartTables) {
    lines.push('');
    lines.push(
      '### Per spelform, passdel och fokusområde: bankens täckning och om delen kan fyllas för sig',
    );
    lines.push('');
    lines.push(
      '"Kan inte fyllas för sig" är andelen körfall i enkelfokussvepet där begreppet *Delen kan fyllas* (generatorregler.md) är falskt för just den delen, oavsett resten av passet. Delar som R-033 tar bort (måltid under 5 minuter) räknas inte in i "Körfall" här.',
    );
    for (const spelform of GAME_FORMAT_LIST) {
      lines.push('');
      lines.push(`#### ${spelform}`);
      lines.push(partTable(agg, bankCounts, spelform));
    }
  }
  if (agg.internalProblems.length > 0) {
    lines.push('');
    lines.push(
      `### Internt fel (bugg, inte ett fotbollsfynd): ${agg.internalProblems.length} körfall`,
    );
    lines.push('');
    lines.push('De första tio:');
    lines.push('');
    for (const problem of agg.internalProblems.slice(0, 10)) {
      lines.push(`- ${problem}`);
    }
  }
  return lines.join('\n');
}

function renderReport(
  nu: ScenarioResult,
  efter: ScenarioResult,
  granskadProblems: string[],
  sensitivity: { checked: number; flipped: number },
  method: {
    singleCount: number;
    comboCount: number;
    seeds: string[];
    sensitivitySeeds: string[];
    runtimeMs: number;
    date: string;
    snabb: boolean;
  },
): string {
  const lines: string[] = [];
  lines.push(
    `# Täckningsmätning av generatorn, ${method.date}${method.snabb ? ' (snabbkörning)' : ''}`,
  );
  lines.push('');
  lines.push(
    `Siffror, inte tolkning. Skriptet är \`scripts/tackning.ts\` (\`npm run tackning${method.snabb ? ' -- --snabb' : ''}\`) och körs mot den riktiga övningsbanken i \`content/ovningar/\` genom \`src/regelmotor/index.ts\`. Fotbollsfrågor avgörs inte här; fotbollsexperten äger tolkningen av målen.`,
  );
  lines.push('');
  lines.push(renderSummaryOmgang8(nu, efter, method.snabb));
  lines.push('');
  lines.push(renderSummaryOmgang7(nu, efter, method.snabb));
  lines.push('');
  lines.push(renderSummaryOmgang6(nu, efter, method.snabb));
  lines.push('');
  lines.push(renderSummary(nu, efter, method.snabb));
  lines.push('');
  lines.push('## Metod');
  lines.push('');
  lines.push('### Celler och mått');
  lines.push('');
  lines.push(
    '- **Cell:** ålder gånger spelform. En cell är **föreslagen** när spelformen är den appen själv föreslår för åldern (R-013, funktionen `suggestedGameFormat` i `src/regelmotor/keys.ts`, som formuläret i `src/app/input/form.ts` använder) och **granne** annars (R-014). **Cell i planen** slår ihop åldrarna med samma föreslagna spelform, som i plan-omgang-5.md avsnitt 0, till exempel "6–7 år, 3 mot 3".',
  );
  lines.push(
    '- **Inget pass:** generatorn svarade `none` (R-101). Andelen räknas av alla körfall i cellen.',
  );
  lines.push(
    '- **Fylld kärna:** passet skapades och varje kärndel (`del-ovning`, `del-spelovning`) som finns kvar i passet har en övning. En kärndel som R-033 tar bort i ett kort pass räknas inte emot, eftersom reglerna kräver att den tas bort; kolumnen "Kärndel borttagen (R-033)" visar hur ofta det hände. Andelen redovisas både av alla körfall (det ledaren möter) och av de skapade passen.',
  );
  lines.push(
    '- **Kärna på valt fokus:** kärnan är fylld och ingen kärndel fick ersättningsfokus (R-121). Då träffar varje kärndel minst ett av ledarens valda fokusområden (R-040, R-041). Andelen räknas av alla körfall.',
  );
  lines.push(
    '- **Uppvärmning saknar övning** (beslut B3 i plan-omgang-8.md): passet skapades, men `del-uppvarmning` har ingen övning (status `saknar-ovning`, R-100). Uppvärmningen tas aldrig bort av R-033. Andelen räknas av de skapade passen. Den påverkar inte "fylld kärna", som bara gäller Öva och Spelövning, och planerna sätter inget mål för den.',
  );
  lines.push(
    '- Måtten per cell bygger på **båda** sveparna nedan, så att cellernas körfall stämmer med planens tabell i avsnitt 0. Avsnittet om ersättningsfokus längre ned bygger, som förut, bara på enkelfokussvepet.',
  );
  lines.push('');
  lines.push('### Hur målen i plan-omgang-8.md avsnitt 1.1 och 1.3 är översatta');
  lines.push('');
  lines.push(
    '- Målen i avsnitt 1.1 är avskrivna för hand i fältet `omgang8` i `PLAN_GOALS` i `scripts/tackning-celler.ts`: "högst" för inget pass och "minst" för fylld kärna och kärna på valt fokus i cellerna för 6–7 år.',
  );
  lines.push(
    '- "Exakt oförändrat" för 8–19 år betyder lika med värdet i `tackning-2026-10-08-omgang-7.md` (Efter CI-rättning, *Per cell i planen*), på rapportens precision. Jämförelsen görs, som för omgång 6 och 7, på andelen avrundad till en decimal, och gränsen räknas in.',
  );
  lines.push(
    '- Planens kontroll att 6–7 år i 3 mot 3 och i 5 mot 5 är lika görs på antal körfall och antalen bakom de tre måtten, inte på avrundad procent.',
  );
  lines.push(
    '- Målen för ersättningsfokus i avsnitt 1.3 är avskrivna i `SUBSTITUTE_GOALS_OMGANG8` i `scripts/tackning-celler.ts` och prövas mot tabellen *Ersättningsfokus (R-121)* (enkelfokussvepet), på samma sätt. "Exakt oförändrat" för `7mot7`, `9mot9` och `11mot11` betyder lika med värdet i `tackning-2026-10-08-omgang-7.md` (Efter CI-rättning). Listan över de vanligaste ersättningarna är inte mål i planen och prövas inte.',
  );
  lines.push(
    '- Målen i avsnitt 1.2 (per spelform och del) är inte inlagda i skriptet. Planen prövar dem för hand mot tabellerna *Per spelform, passdel och fokusområde*, kolumnen "Kan inte fyllas för sig" efter CI.',
  );
  lines.push('');
  lines.push('### Hur målen i plan-omgang-7.md avsnitt 1.1 är översatta');
  lines.push('');
  lines.push(
    '- Målen är avskrivna för hand i fältet `omgang7` i `PLAN_GOALS` i `scripts/tackning-celler.ts`: "högst" för inget pass och "minst" för fylld kärna och kärna på valt fokus i cellerna för 8–12 år.',
  );
  lines.push(
    '- Jämförelsen görs, som för omgång 6, på andelen avrundad till en decimal, och gränsen räknas in.',
  );
  lines.push(
    '- "Exakt oförändrat" för 6–7 år och 13–19 år betyder lika med värdet i `tackning-2026-10-08.md` (Efter CI-rättning, *Per cell i planen*), på rapportens precision. En ändring mindre än 0,05 procentenheter syns alltså inte.',
  );
  lines.push(
    '- Planens kontroll att 8–9 år i 5 mot 5 och i 7 mot 7 är lika görs på antal körfall och antalen bakom de tre måtten, inte på avrundad procent.',
  );
  lines.push(
    '- Ett värde för 6–7 år som inte längre är oförändrat står som "ändras av omgång 8" i stället för "nej", eftersom plan-omgang-8.md höjer målen för de cellerna med avsikt. De bedöms i sammanfattningen för omgång 8.',
  );
  lines.push(
    '- Målen i avsnitt 1.2 (per spelform och del) och 1.3 (ersättningsfokus) är inte inlagda i skriptet. Planen prövar dem för hand mot tabellerna *Per spelform, passdel och fokusområde* och *Ersättningsfokus (R-121)*.',
  );
  lines.push('');
  lines.push('### Hur målen i plan-omgang-6.md avsnitt 1.1 är översatta');
  lines.push('');
  lines.push(
    '- Planen har status `utkast`; målen är avskrivna för hand i fältet `omgang6` i `PLAN_GOALS` i `scripts/tackning-celler.ts`.',
  );
  lines.push(
    '- Planen prövar målen som `<= 2.0` och `>= 65.0` mot rapportens värden. Jämförelsen görs därför på andelen avrundad till en decimal, som tabellerna skriver den, och gränsen räknas in.',
  );
  lines.push(
    '- "Exakt oförändrat" för 6–12 år betyder lika med värdet i `tackning-2026-10-07.md` (Banken nu, *Per cell i planen*), på rapportens precision. En ändring mindre än 0,05 procentenheter syns alltså inte.',
  );
  lines.push(
    '- Ett värde för 8–12 år som inte längre är oförändrat står som "ändras av omgång 7" i stället för "nej", eftersom plan-omgang-7.md höjer målen för de cellerna med avsikt. De bedöms i sammanfattningen för omgång 7. På samma sätt står ett ändrat värde för 6–7 år som "ändras av omgång 8".',
  );
  lines.push(
    '- Målen i avsnitt 1.2 (per spelform och del) och 1.3 (ersättningsfokus) är inte inlagda i skriptet. Planen prövar dem för hand mot tabellerna *Per spelform, passdel och fokusområde* och *Ersättningsfokus (R-121)*.',
  );
  lines.push('');
  lines.push('### Hur målen i plan-omgang-5.md avsnitt 1.2 är översatta');
  lines.push('');
  lines.push(
    '- Målen jämförs med andelen "inget pass" per cell i planen. Planen har status `utkast`; målen är avskrivna för hand i `PLAN_GOALS` i `scripts/tackning-celler.ts`.',
  );
  lines.push(
    '- "oförändrat" för 8–9 år i 5 mot 5 och 10–12 år i 7 mot 7 är översatt till huvudmålet i avsnitt 1.1, högst 5 % i varje föreslagen cell, i stället för dagens exakta värde.',
  );
  lines.push(
    '- "100 %" i kolumnen för omgång 5 är ett läge, inte ett mål. De cellerna står som "inget mål" för omgång 5.',
  );
  lines.push(
    '- Avsnitt 1.2 sätter inget mål för fylld kärna. Det närmaste är avsnitt 1.5 (ersättningsfokus högst 40 % efter omgång 7). Fylld kärna och kärna på valt fokus redovisas därför utan bedömning i sammanfattningen för omgång 5. Målen för dem i plan-omgang-6.md bedöms i sammanfattningen för omgång 6.',
  );
  lines.push(
    '- Raderna "sammantaget" jämförs med de uträknade väntevärdena i avsnitt 1.3 (högst cirka 4 % i föreslagna celler och 32 % för alla körfall efter omgång 5). De är inte mål i planens mening.',
  );
  lines.push('');
  lines.push('### Underlagsrymden');
  lines.push('');
  lines.push(
    `Underlagsrymden är för stor för en fullständig korsprodukt av alla val (se huvudet av scripts/tackning.ts för uträkningen). Skriptet kör i stället två svep${method.snabb ? ', här begränsade till de föreslagna cellerna (`--snabb`)' : ''}:`,
  );
  lines.push('');
  lines.push(
    `1. **Enkelfokussvepet** (${method.singleCount} körfall): varje ålder 6–19, varje spelform och nivå som är tillåten för åldern, det angivna urvalet av antal spelare (${PLAYER_SAMPLE.join(', ')}) och ledare (${COACH_SAMPLE.join(', ')}), varje yta formuläret tillåter plus att inte välja någon, passlängden vid kortast/mitten/längst tillåtna för åldersfasen, och **varje enskilt fokusområde** formuläret tillåter för åldern.`,
  );
  lines.push(
    `2. **Kombinationssvepet** (${method.comboCount} körfall): för varje ålder och spelform, **alla** tillåtna kombinationer av två och tre fokusområden (R-019), mot ett representativt underlag i övrigt (nivå 2, 12 spelare, 2 ledare, mittlängden, ingen yta vald).`,
  );
  lines.push('');
  lines.push(
    `Frö: \`${method.seeds.join(', ')}\` för huvudsvepen. Frökänslighet prövades separat (se nedan) för körfall med orsaken \`gar-inte-att-kombinera\`, med fröna \`${method.sensitivitySeeds.join(', ')}\`, eftersom det bara är den orsaken som beror på slumptalskällan (R-072); \`inget-matchar\` avgörs av om banken strukturellt har en matchande övning, vilket inte beror på fröet.`,
  );
  lines.push('');
  lines.push(
    `Mätt körtid för hela skriptet (båda bankerna${method.snabb ? ', `--snabb`' : ''}): ${(method.runtimeMs / 1000).toFixed(1)} s.`,
  );
  lines.push('');
  lines.push(
    `Frökänslighet: av ${sensitivity.checked} körfall med orsaken \`gar-inte-att-kombinera\` gav ett annat frö ett pass i ${sensitivity.flipped} fall (${pct(sensitivity.flipped, sensitivity.checked)}).`,
  );
  if (granskadProblems.length > 0) {
    lines.push('');
    lines.push(
      `Observera: ${granskadProblems.length} av filerna med status \`granskad\` gick inte att läsa som en fullständig övning och är **inte** med i "efter CI-rättning" nedan: ${granskadProblems.join('; ')}`,
    );
  }
  lines.push('');
  lines.push(renderScenario(nu, true));
  lines.push('');
  lines.push(renderScenario(efter, true));
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Kör
// ---------------------------------------------------------------------------

function main(): void {
  const start = Date.now();
  const log = (line: string): void => {
    process.stderr.write(`${line}\n`);
  };

  const options = parseOptions(process.argv.slice(2));
  if ('error' in options) {
    log(options.error);
    process.exitCode = 1;
    return;
  }

  log(`Bygger underlagsrymden${options.snabb ? ' (bara föreslagna celler)' : ''}...`);
  const fullSingle = buildSingleFocusSweep();
  const fullCombo = buildFocusComboSweep();
  const singleSweep = options.snabb ? onlySuggested(fullSingle) : fullSingle;
  const comboSweep = options.snabb ? onlySuggested(fullCombo) : fullCombo;
  log(
    `Enkelfokussvepet: ${singleSweep.length} körfall. Kombinationssvepet: ${comboSweep.length} körfall.`,
  );

  const nuBank = loadBank().exercises.map(toBankExercise);
  const { extra: granskadExtra, problems: granskadProblems } = loadGranskadAsApproved();
  const efterBank = [...nuBank, ...granskadExtra];
  log(`Banken nu: ${nuBank.length} övningar. Efter CI-rättning: ${efterBank.length} övningar.`);

  const seed = 'tackning-1';
  const onProgress = (done: number, total: number): void => {
    log(`  ${done}/${total} körfall`);
  };

  log('Kör svepet mot banken nu...');
  const nuAgg = analyse(nuBank, seed, singleSweep, comboSweep, onProgress);
  log('Kör svepet mot banken efter CI-rättning...');
  const efterAgg = analyse(efterBank, seed, singleSweep, comboSweep, onProgress);

  log(
    `Frökänslighet: prövar ${nuAgg.combinationFailures.length} "gar-inte-att-kombinera"-fall med extra frön...`,
  );
  const sensitivitySeeds = ['tackning-2', 'tackning-3', 'tackning-4', 'tackning-5'];
  const sensitivity = seedSensitivity(nuBank, nuAgg.combinationFailures, sensitivitySeeds);

  const nuScenario: ScenarioResult = {
    label: `Banken nu (${nuBank.length} godkända övningar)`,
    bankSize: nuBank.length,
    agg: nuAgg,
    bankCounts: staticBankCounts(nuBank),
  };
  const efterScenario: ScenarioResult = {
    label: `Efter CI-rättning (${nuBank.length} godkända + ${granskadExtra.length} granskade räknade som godkända)`,
    bankSize: efterBank.length,
    agg: efterAgg,
    bankCounts: staticBankCounts(efterBank),
  };

  const runtimeMs = Date.now() - start;
  const date = localDate(new Date());
  const report = renderReport(nuScenario, efterScenario, granskadProblems, sensitivity, {
    singleCount: singleSweep.length,
    comboCount: comboSweep.length,
    seeds: [seed],
    sensitivitySeeds,
    runtimeMs,
    date,
    snabb: options.snabb,
  });

  const outPath = reportPath(date, options.snabb);
  writeFileSync(outPath, report, 'utf8');
  log(`Skrev ${outPath}. Total körtid: ${(runtimeMs / 1000).toFixed(1)} s.`);
}

main();
