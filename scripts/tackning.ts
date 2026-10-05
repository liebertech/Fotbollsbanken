/**
 * Mäter hur ofta regelmotorn svarar "inget pass", och för vilka val, mot den riktiga
 * övningsbanken i content/ovningar/. Skriver en rapport till docs/doman/.
 *
 *   npm run tackning
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

function pct(count: number, total: number): string {
  if (total === 0) {
    return '–';
  }
  return `${((100 * count) / total).toFixed(1)} %`;
}

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
  },
): string {
  const lines: string[] = [];
  lines.push(`# Täckningsmätning av generatorn, ${method.date}`);
  lines.push('');
  lines.push(
    'Siffror, inte tolkning. Skriptet är `scripts/tackning.ts` (`npm run tackning`) och körs mot den riktiga övningsbanken i `content/ovningar/` genom `src/regelmotor/index.ts`. Fotbollsfrågor avgörs inte här.',
  );
  lines.push('');
  lines.push('## Metod');
  lines.push('');
  lines.push(
    `Underlagsrymden är för stor för en fullständig korsprodukt av alla val (se huvudet av scripts/tackning.ts för uträkningen). Skriptet kör i stället två svep:`,
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
    `Mätt körtid för hela skriptet (båda bankerna): ${(method.runtimeMs / 1000).toFixed(1)} s.`,
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

  log('Bygger underlagsrymden...');
  const singleSweep = buildSingleFocusSweep();
  const comboSweep = buildFocusComboSweep();
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
    label: 'Banken nu (42 godkända övningar)',
    bankSize: nuBank.length,
    agg: nuAgg,
    bankCounts: staticBankCounts(nuBank),
  };
  const efterScenario: ScenarioResult = {
    label: 'Efter CI-rättning (42 godkända + 16 granskade räknade som godkända)',
    bankSize: efterBank.length,
    agg: efterAgg,
    bankCounts: staticBankCounts(efterBank),
  };

  const runtimeMs = Date.now() - start;
  const date = '2026-10-05';
  const report = renderReport(nuScenario, efterScenario, granskadProblems, sensitivity, {
    singleCount: singleSweep.length,
    comboCount: comboSweep.length,
    seeds: [seed],
    sensitivitySeeds,
    runtimeMs,
    date,
  });

  const outPath = `docs/doman/tackning-${date}.md`;
  writeFileSync(outPath, report, 'utf8');
  log(`Skrev ${outPath}. Total körtid: ${(runtimeMs / 1000).toFixed(1)} s.`);
}

main();
