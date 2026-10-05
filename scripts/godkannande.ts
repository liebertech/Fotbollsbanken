/**
 * Kontrollen `godkannande` och skrivningen av `status: godkand` (ADR 0013).
 *
 *   npm run godkannande -- kontroll --bas <sha> --huvud <sha>
 *   npm run godkannande -- godkann --fore <sha> --efter <sha> [--av <konto>] [--pr <nr>] [--skriv]
 *   npm run godkannande -- planera [--repo <ägare/namn>] [--ut <plan.json>]
 *   npm run godkannande -- tillampa --plan <plan.json> [--repo <ägare/namn>] [--skriv]
 *
 * `planera` och `tillampa` är arbetsflödets väg sedan ADR 0020: `planera` letar upp varje
 * övning i `granskad` på main och den merge som förde in den, och `tillampa` skriver just det.
 *
 * `kontroll` underkänner en pull request som sätter `godkand` på en övning, och en omgång som
 * samtidigt ändrar filer utanför `content/` och `docs/` (ADR 0013 avsnitt 3, lager 3).
 *
 * `godkann` sätter `godkand` på de granskade övningarna i en mergad omgång. Utan `--skriv`
 * ändras ingenting: skriptet visar bara vad det skulle göra, så att det går att pröva lokalt.
 *
 * Skriptet läser båda revisionerna ur git, aldrig ur arbetskatalogen. Då kan arbetsflödet checka
 * ut basgrenens kod och ändå läsa pull requestens innehåll utan att köra det (S-03).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSeq, parse, parseDocument } from 'yaml';
import type { ExerciseStatus } from '../src/regelmotor/keys.ts';

/** Mappen med övningsbanken, relativt repots rot. Samma som i valideringsskriptet. */
export const CONTENT_DIR = 'content/ovningar';

/** Statusen som bara arbetsflödet `godkann-omgang` får skriva (ADR 0010 avsnitt 1, ADR 0013). */
export const APPROVED_STATUS: ExerciseStatus = 'godkand';

/** Statusen fotbollsexperten sätter. Den enda status som `godkann-omgang` lyfter. */
export const REVIEWED_STATUS: ExerciseStatus = 'granskad';

/**
 * Sökvägar en omgång får röra. En pull request som ändrar övningar får inte i samma svep ändra
 * kod, arbetsflöden eller beroenden: mergen släpper fram just den koden till arbetsflödet som
 * sedan kör med `contents: write` (S-03, ADR 0013 avsnitt 3).
 */
export const PREFIXES_ALLOWED_WITH_EXERCISES = ['content/', 'docs/'] as const;

/** Rollen som skrivs i granskningsraden. `granskning.roll` är fri text i schemat. */
const APPROVAL_ROLE = 'redaktör';

/** En commit som inte finns, till exempel `github.event.before` för en ny gren. */
const EMPTY_SHA = '0000000000000000000000000000000000000000';

/** Läsning ur git. Allt skriptet behöver av repot, så att testerna slipper ett riktigt repo. */
export interface GitReader {
  /** Filer som skiljer sig mellan två revisioner, som sökvägar relativt repots rot. */
  changedFiles(from: string, to: string): string[];
  /** Filens innehåll vid en revision, eller `undefined` om filen inte finns där. */
  read(rev: string, path: string): string | undefined;
  /** Den gemensamma grenpunkten, alltså den commit grenen utgick från. */
  mergeBase(a: string, b: string): string;
}

export function createGitReader(cwd: string = process.cwd()): GitReader {
  // stderr fångas i stället för att skrivas ut: `read` frågar med flit efter filer som kan
  // saknas i en revision, och de svaren är inga fel. Går något annat fel följer git:s eget
  // meddelande med i undantaget.
  const git = (args: string[]): string => {
    try {
      return execFileSync('git', args, {
        cwd,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (cause) {
      const stderr = ((cause as { stderr?: string }).stderr ?? '').trim();
      throw new Error(
        `git ${args.join(' ')}: ${stderr === '' ? (cause as Error).message : stderr}`,
        {
          cause,
        },
      );
    }
  };

  return {
    // --no-renames: ett namnbyte ska synas som borttagen och tillagd fil, så att en godkänd
    // övning som byter namn räknas som ny och fångas av kontrollen.
    changedFiles: (from, to) =>
      git(['diff', '--name-only', '--no-renames', from, to])
        .split('\n')
        .filter((line) => line !== ''),
    read: (rev, path) => {
      try {
        return git(['show', `${rev}:${path}`]);
      } catch {
        return undefined;
      }
    },
    mergeBase: (a, b) => git(['merge-base', a, b]).trim(),
  };
}

/** Övningsfiler: `.yaml` direkt i `content/ovningar/`, utom de som börjar med `_` (ADR 0010). */
export function isExerciseFile(path: string): boolean {
  if (!path.startsWith(`${CONTENT_DIR}/`)) {
    return false;
  }
  const rest = path.slice(CONTENT_DIR.length + 1);
  return rest !== '' && !rest.includes('/') && rest.endsWith('.yaml') && !rest.startsWith('_');
}

export interface StatusReading {
  status?: string;
  /** Satt när filen inte går att läsa. Kontrollen fäller då filen i stället för att gissa. */
  error?: string;
}

/** Läser `status` ur en övningsfil utan att bry sig om resten. */
export function readStatus(text: string): StatusReading {
  let document: unknown;
  try {
    document = parse(text);
  } catch (cause) {
    return { error: `går inte att läsa som YAML: ${(cause as Error).message}` };
  }

  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    return { error: 'filen innehåller ingen övning som ett YAML-objekt' };
  }

  const status = (document as { status?: unknown }).status;
  if (status === undefined) {
    return {};
  }
  if (typeof status !== 'string') {
    return { error: 'status är inte en text' };
  }
  return { status };
}

/** Basename används bara för utskrifter; sökvägen i git är alltid hela sökvägen. */
export function fileName(path: string): string {
  return basename(path);
}

/** Ett skäl att underkänna. `file` är tom sträng när fyndet gäller hela omgången. */
export interface Finding {
  file: string;
  message: string;
}

export interface CheckOptions {
  /** Basgrenens commit, alltså `main` som pull requesten riktas mot. */
  base: string;
  /** Pull requestens översta commit. */
  head: string;
}

export interface CheckResult {
  ok: boolean;
  findings: Finding[];
  /** Ändrade övningsfiler, och ändrade filer utanför banken. Båda bara för utskriften. */
  exercises: string[];
  others: string[];
}

/** En rad per fynd: `fil: meddelande`, eller bara meddelandet när fyndet gäller omgången. */
export function formatFinding(finding: Finding): string {
  return finding.file === '' ? finding.message : `${finding.file}: ${finding.message}`;
}

function isAllowedWithExercises(path: string): boolean {
  return PREFIXES_ALLOWED_WITH_EXERCISES.some((prefix) => path.startsWith(prefix));
}

/**
 * Kontrollen `godkannande` (ADR 0013 avsnitt 3, lager 3). Underkänner två saker, utan undantag
 * för vem som skrev commiten:
 *
 * 1. en övningsfil som går från något annat till `status: godkand`,
 * 2. en omgång som samtidigt ändrar filer utanför `content/` och `docs/`.
 *
 * Jämförelsen utgår från grenpunkten, så att commits som kommit till på `main` under tiden
 * inte räknas som pull requestens ändringar.
 */
export function kontroll(git: GitReader, options: CheckOptions): CheckResult {
  const from = git.mergeBase(options.base, options.head);
  const changed = git.changedFiles(from, options.head);
  const exercises = changed.filter(isExerciseFile);
  const others = changed.filter((path) => !isExerciseFile(path));
  const findings: Finding[] = [];

  for (const path of exercises) {
    const after = git.read(options.head, path);
    if (after === undefined) {
      continue; // Filen är borttagen i pull requesten och kan inte sätta någon status.
    }

    const reading = readStatus(after);
    if (reading.error !== undefined) {
      findings.push({ file: path, message: reading.error });
      continue;
    }
    if (reading.status !== APPROVED_STATUS) {
      continue;
    }

    // En fil som redan stod i `godkand` före pull requesten får ändras. Det är övergången till
    // `godkand` som bara arbetsflödet får göra, och en ny fil har ingen tidigare status.
    const before = git.read(from, path);
    const wasApproved = before !== undefined && readStatus(before).status === APPROVED_STATUS;
    if (!wasApproved) {
      findings.push({
        file: path,
        message:
          `sätter status: ${APPROVED_STATUS}. Värdet skrivs bara av arbetsflödet ` +
          'godkann-omgang, efter att omgången mergats till main (ADR 0013 avsnitt 2)',
      });
    }
  }

  if (exercises.length > 0) {
    for (const path of others.filter((candidate) => !isAllowedWithExercises(candidate))) {
      findings.push({
        file: path,
        message:
          'ändras i samma pull request som en övning. En omgång får bara röra ' +
          `${PREFIXES_ALLOWED_WITH_EXERCISES.join(' och ')} (ADR 0013 avsnitt 3, S-03)`,
      });
    }
  }

  return { ok: findings.length === 0, findings, exercises, others };
}

/** Raden som skrivs in i `granskning` när en övning lyfts. Samma form som schemats poster. */
export interface ReviewLine {
  datum: string;
  av: string;
  roll: string;
  kommentar?: string;
}

export interface ApprovalOptions {
  /** Commiten före mergen, `github.event.before`. */
  before: string;
  /** Commiten mergen lade på `main`, `github.sha`. */
  after: string;
  /** Kontot som mergade, `pull_request.merged_by`. */
  av: string;
  /** Pull requestens nummer, om det är känt. */
  pr?: number;
  /** Dagens datum som ÅÅÅÅ-MM-DD. Går att sätta, så att testerna blir förutsägbara. */
  datum?: string;
  /** Utan detta ändras ingen fil: skriptet visar bara vad det skulle göra. */
  write?: boolean;
}

export type ApprovalOutcome = 'lyft' | 'orord' | 'fel';

export interface ApprovalFile {
  file: string;
  outcome: ApprovalOutcome;
  message: string;
  /** Filens nya innehåll. Satt bara för `lyft`, också vid torrkörning. */
  text?: string;
}

export interface ApprovalResult {
  ok: boolean;
  files: ApprovalFile[];
  /** Sant när filerna skrevs till disk. Falskt vid torrkörning. */
  written: boolean;
}

/** Granskningsraden som godkännandet lämnar efter sig. */
export function reviewLine(options: Pick<ApprovalOptions, 'av' | 'pr' | 'datum'>): ReviewLine {
  const datum = options.datum ?? new Date().toISOString().slice(0, 10);
  const kommentar =
    options.pr === undefined
      ? 'Godkänd genom merge till main.'
      : `Godkänd genom merge av pull request #${options.pr}.`;
  return { datum, av: options.av, roll: APPROVAL_ROLE, kommentar };
}

/**
 * Radbredden som återger filen ordagrant. Skriptet ska bara ändra `status` och `granskning`,
 * så det väljer den bredd som gör en oförändrad fil identisk med sig själv och rör därmed
 * inte hur resten av texten är radbruten.
 */
function chooseLineWidth(raw: string): number {
  for (const lineWidth of [100, 0, 80]) {
    try {
      if (parseDocument(raw).toString({ lineWidth }) === raw) {
        return lineWidth;
      }
    } catch {
      break;
    }
  }
  return 100;
}

/**
 * Sant när den nya texten skiljer sig från den gamla på exakt två sätt: `status` är höjd, och
 * granskningsraden ligger sist i `granskning`. Allt annat, varje övrigt fält och varje tidigare
 * granskningsrad, ska vara oförändrat. Skriptet skriver aldrig text (ADR 0013 avsnitt 3).
 */
function changesOnlyStatusAndReview(raw: string, text: string, entry: ReviewLine): boolean {
  const split = (source: string): { rest: string; reviews: string } => {
    const document = parse(source) as Record<string, unknown>;
    const { status: _status, granskning: reviews, ...rest } = document;
    return { rest: JSON.stringify(rest), reviews: JSON.stringify(reviews ?? []) };
  };

  try {
    const before = split(raw);
    const after = split(text);
    const expected = JSON.stringify([...(JSON.parse(before.reviews) as unknown[]), entry]);
    return after.rest === before.rest && after.reviews === expected;
  } catch {
    return false;
  }
}

/**
 * Lyfter en granskad övning till `godkand` och lägger till granskningsraden. Returnerar filens
 * nya text, eller ett fel. Allt annat i filen ska vara ordagrant oförändrat; är det inte det
 * lämnas filen orörd (ADR 0013 avsnitt 3, lager 4: skriptet skriver aldrig text).
 */
export function raiseToApproved(
  raw: string,
  entry: ReviewLine,
): { text: string } | { error: string } {
  const document = parseDocument(raw);
  if (document.errors.length > 0) {
    return { error: `går inte att läsa som YAML: ${document.errors[0]?.message ?? ''}` };
  }
  if (document.get('status') !== REVIEWED_STATUS) {
    return { error: `status är inte ${REVIEWED_STATUS}` };
  }

  const reviews = document.get('granskning', true);
  if (!isSeq(reviews)) {
    return { error: 'granskning är ingen lista' };
  }

  const lineWidth = chooseLineWidth(raw);
  document.set('status', APPROVED_STATUS);
  // En tom lista skrivs som `granskning: []`. Raden ska ändå ligga som ett block, som i banken.
  reviews.flow = false;
  reviews.add(document.createNode(entry));
  const text = document.toString({ lineWidth });

  if (!changesOnlyStatusAndReview(raw, text, entry)) {
    return { error: 'skrivningen skulle ändra mer än status och granskningsraden' };
  }
  return { text };
}

/** Skrivning av en fil. Testerna skickar in sin egen, så att inget hamnar på disk. */
export type WriteFile = (path: string, text: string) => void;

const writeToDisk: WriteFile = (path, text) => writeFileSync(path, text, 'utf8');

/**
 * Sätter `godkand` på de granskade övningarna i en mergad omgång (ADR 0013 avsnitt 4).
 * Filer i `utkast`, `atgarda` eller redan `godkand` lämnas orörda, så att en omkörning är
 * ofarlig. Utan `options.write` skrivs ingenting.
 */
export function godkann(
  git: GitReader,
  options: ApprovalOptions,
  writeFile: WriteFile = writeToDisk,
): ApprovalResult {
  const entry = reviewLine(options);
  const files: ApprovalFile[] = [];

  for (const path of git.changedFiles(options.before, options.after).filter(isExerciseFile)) {
    const raw = git.read(options.after, path);
    if (raw === undefined) {
      files.push({ file: path, outcome: 'orord', message: 'borttagen i omgången' });
      continue;
    }

    const reading = readStatus(raw);
    if (reading.error !== undefined) {
      files.push({ file: path, outcome: 'fel', message: reading.error });
      continue;
    }
    if (reading.status !== REVIEWED_STATUS) {
      files.push({
        file: path,
        outcome: 'orord',
        message: `status är ${reading.status ?? 'inte satt'}`,
      });
      continue;
    }

    const raised = raiseToApproved(raw, entry);
    if ('error' in raised) {
      files.push({ file: path, outcome: 'fel', message: raised.error });
      continue;
    }

    if (options.write === true) {
      writeFile(path, raised.text);
    }
    files.push({
      file: path,
      outcome: 'lyft',
      message: `${REVIEWED_STATUS} → ${APPROVED_STATUS}`,
      text: raised.text,
    });
  }

  return {
    ok: files.every((file) => file.outcome !== 'fel'),
    files,
    written: options.write === true,
  };
}

/*
 * Ikappskrivningen (ADR 0020). Arbetsflödet följer inte längre en enskild push. Det letar upp
 * varje övning på `main` som står i `granskad`, och knyter den till den merge som senast ändrade
 * filen. Det är den merge som förde in exakt den text som ska stämplas. En körning som avbryts
 * eller faller tappar därför ingen omgång: nästa körning hittar samma filer.
 */

/** Läsning ur git utöver `GitReader`, för ikappskrivningen. */
export interface HistoryReader extends GitReader {
  /** Filerna direkt under `dir` vid en revision, som sökvägar relativt repots rot. */
  listFiles(rev: string, dir: string): string[];
  /** Den commit på första-förälderkedjan som senast ändrade filen, eller `undefined`. */
  lastChange(rev: string, path: string): string | undefined;
  /** Commitens meddelande. */
  message(sha: string): string;
  /** Blobbens sha för filen vid en revision, eller `undefined` om filen inte finns där. */
  blob(rev: string, path: string): string | undefined;
  /** Den fullständiga sha:n för en revision. */
  resolve(rev: string): string;
}

export function createHistoryReader(cwd: string = process.cwd()): HistoryReader {
  const base = createGitReader(cwd);
  const git = (args: string[]): string | undefined => {
    try {
      return execFileSync('git', args, {
        cwd,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch {
      return undefined;
    }
  };
  const required = (args: string[]): string => {
    const out = git(args);
    if (out === undefined) {
      throw new Error(`git ${args.join(' ')} misslyckades`);
    }
    return out;
  };

  return {
    ...base,
    listFiles: (rev, dir) =>
      required(['ls-tree', '--name-only', rev, `${dir}/`])
        .split('\n')
        .filter((line) => line !== ''),
    // --first-parent: på main är varje ändring en merge eller statuscommiten. En merge jämförs
    // då bara med sin första förälder, alltså main före mergen, och räknas som den commit som
    // förde in filens innehåll.
    lastChange: (rev, path) => {
      const sha = required(['log', '--first-parent', '-1', '--format=%H', rev, '--', path]).trim();
      return sha === '' ? undefined : sha;
    },
    message: (sha) => required(['log', '-1', '--format=%B', sha]),
    blob: (rev, path) => git(['rev-parse', '--verify', '--quiet', `${rev}:${path}`])?.trim(),
    resolve: (rev) => required(['rev-parse', '--verify', `${rev}^{commit}`]).trim(),
  };
}

/** Ett anrop mot GitHubs REST-API. Returnerar svarskroppen som text. */
export type ApiGet = (path: string) => string;

/** `gh api` mot repot. GH_TOKEN sätts av arbetsflödet. */
export function createGhApi(repo: string): ApiGet {
  return (path) =>
    execFileSync('gh', ['api', `repos/${repo}/${path}`], {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
}

/**
 * Tolkar ett JSON-svar. Ett tomt svar är ett eget fel med ett begripligt meddelande, eftersom
 * det var just ett tomt svar som fällde körningen för pull request #15 med
 * "unexpected end of JSON input" (ADR 0020).
 */
export function parseJson(text: string, what: string): unknown {
  if (text.trim() === '') {
    throw new Error(`${what}: tomt svar`);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch (cause) {
    throw new Error(`${what}: svaret är inte JSON (${(cause as Error).message})`, { cause });
  }
}

export interface PullRequestInfo {
  number: number;
  mergedAt: string | null;
  mergeCommitSha: string | null;
  mergedBy: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Tolkar svaret från `pulls/{nummer}`. Kastar om svaret saknar det som behövs. */
export function parsePullRequest(text: string): PullRequestInfo {
  const data = parseJson(text, 'pull request');
  if (!isRecord(data) || typeof data.number !== 'number') {
    throw new Error('pull request: svaret saknar number');
  }
  const optionalString = (value: unknown): string | null =>
    typeof value === 'string' && value !== '' ? value : null;
  const mergedBy = isRecord(data.merged_by) ? optionalString(data.merged_by.login) : null;
  return {
    number: data.number,
    mergedAt: optionalString(data.merged_at),
    mergeCommitSha: optionalString(data.merge_commit_sha),
    mergedBy,
  };
}

/** Tolkar svaret från `commits/{sha}/pulls`: numren på de pull requests som är mergade. */
export function parseCommitPulls(text: string): number[] {
  const data = parseJson(text, 'pull requests för commiten');
  if (!Array.isArray(data)) {
    throw new Error('pull requests för commiten: svaret är ingen lista');
  }
  return data
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .filter((item) => typeof item.merged_at === 'string' && typeof item.number === 'number')
    .map((item) => item.number as number);
}

/**
 * Numret ur GitHubs merge-meddelande, `Merge pull request #N from …`. Numret är bara en
 * kandidat: det stäms alltid av mot API:t, eftersom meddelandet går att skriva om vid mergen.
 */
export function pullNumberFromMessage(message: string): number | undefined {
  const match = /^Merge pull request #(\d+) from /.exec(message);
  return match === null ? undefined : Number(match[1]);
}

export interface RetryOptions {
  /** Antal försök per anrop. */
  attempts: number;
  /** Väntan före försök nummer `n + 1`, i millisekunder. */
  delay: (attempt: number) => number;
  sleep: (ms: number) => void;
}

const sleepSync = (ms: number): void => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

/** Fem försök över knappt en halv minut. Kopplingen commit → pull request byggs med fördröjning. */
export const DEFAULT_RETRY: RetryOptions = {
  attempts: 5,
  delay: (attempt) => 2000 * 2 ** (attempt - 1),
  sleep: sleepSync,
};

/** Kör `call` tills den lyckas, och kastar det sista felet när försöken är slut. */
export function withRetry<T>(call: () => T, retry: RetryOptions): T {
  let last: unknown;
  for (let attempt = 1; attempt <= retry.attempts; attempt += 1) {
    try {
      return call();
    } catch (cause) {
      last = cause;
      if (attempt < retry.attempts) {
        retry.sleep(retry.delay(attempt));
      }
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}

export interface ResolvedPull {
  pr: number;
  av: string;
}

/**
 * Den mergade pull request som lade commiten på main, och kontot som mergade den. Kontot kommer
 * alltid ur API:t. Pull requesten godtas bara om dess `merge_commit_sha` är precis commiten.
 */
export function resolvePullRequest(
  api: ApiGet,
  commit: string,
  message: string,
  retry: RetryOptions = DEFAULT_RETRY,
): ResolvedPull | { error: string } {
  const fromMessage = pullNumberFromMessage(message);
  let candidates: number[];
  if (fromMessage !== undefined) {
    candidates = [fromMessage];
  } else {
    try {
      candidates = withRetry(() => {
        const numbers = parseCommitPulls(api(`commits/${commit}/pulls`));
        if (numbers.length === 0) {
          throw new Error(`ingen mergad pull request för ${commit}`);
        }
        return numbers;
      }, retry);
    } catch (cause) {
      return { error: (cause as Error).message };
    }
  }

  const reasons: string[] = [];
  for (const number of candidates) {
    let info: PullRequestInfo;
    try {
      info = withRetry(() => parsePullRequest(api(`pulls/${number}`)), retry);
    } catch (cause) {
      reasons.push(`#${number}: ${(cause as Error).message}`);
      continue;
    }
    if (info.mergedAt === null || info.mergedBy === null) {
      reasons.push(`#${number} är inte mergad`);
      continue;
    }
    if (info.mergeCommitSha !== commit) {
      reasons.push(
        `#${number} kom in med ${info.mergeCommitSha ?? 'ingen commit'}, inte ${commit}`,
      );
      continue;
    }
    return { pr: number, av: info.mergedBy };
  }
  return { error: `ingen mergad pull request för ${commit} (${reasons.join('; ')})` };
}

/** En fil som ska lyftas: vilken text (blob), vilken merge och vem som mergade. */
export interface PlanEntry {
  fil: string;
  blob: string;
  commit: string;
  pr: number;
  av: string;
}

/** Torrkörningens resultat. Skrivjobbet skriver bara det som står här (ADR 0020). */
export interface Plan {
  version: 1;
  /** Den commit på main som planen lästes ur. */
  bas: string;
  poster: PlanEntry[];
}

export interface PlanResult {
  plan: Plan;
  findings: Finding[];
}

/**
 * Letar upp varje övning som står i `granskad` vid `rev` och knyter den till den merge som
 * senast ändrade filen. Filens text vid `rev` är därmed exakt den text som mergades.
 */
export function planera(
  git: HistoryReader,
  api: ApiGet,
  rev = 'HEAD',
  retry: RetryOptions = DEFAULT_RETRY,
): PlanResult {
  const bas = git.resolve(rev);
  const poster: PlanEntry[] = [];
  const findings: Finding[] = [];
  const pulls = new Map<string, ResolvedPull | { error: string }>();
  const probe: ReviewLine = { datum: '2000-01-01', av: 'x', roll: APPROVAL_ROLE };

  for (const path of git.listFiles(bas, CONTENT_DIR).filter(isExerciseFile).sort()) {
    const raw = git.read(bas, path);
    if (raw === undefined) {
      continue;
    }
    const reading = readStatus(raw);
    if (reading.error !== undefined) {
      findings.push({ file: path, message: reading.error });
      continue;
    }
    if (reading.status !== REVIEWED_STATUS) {
      continue;
    }

    const raised = raiseToApproved(raw, probe);
    if ('error' in raised) {
      findings.push({ file: path, message: raised.error });
      continue;
    }

    const commit = git.lastChange(bas, path);
    const blob = git.blob(bas, path);
    if (commit === undefined || blob === undefined) {
      findings.push({ file: path, message: 'hittar ingen commit som förde in filen' });
      continue;
    }
    if (git.blob(commit, path) !== blob) {
      findings.push({ file: path, message: `texten skiljer sig från den i ${commit}` });
      continue;
    }

    let pull = pulls.get(commit);
    if (pull === undefined) {
      pull = resolvePullRequest(api, commit, git.message(commit), retry);
      pulls.set(commit, pull);
    }
    if ('error' in pull) {
      findings.push({ file: path, message: pull.error });
      continue;
    }
    poster.push({ fil: path, blob, commit, pr: pull.pr, av: pull.av });
  }

  return { plan: { version: 1, bas, poster }, findings };
}

const SHA = /^[0-9a-f]{40}$/;
/** GitHubs regler för kontonamn: bokstäver, siffror och bindestreck, högst 39 tecken. */
const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

/**
 * Tolkar planen som torrkörningen lämnade till skrivjobbet. Planen kommer från samma körning,
 * men skrivjobbet litar ändå inte på formen: allt som skrivs i en fil ska ha rätt form.
 */
export function parsePlan(text: string): Plan | { error: string } {
  let data: unknown;
  try {
    data = parseJson(text, 'planen');
  } catch (cause) {
    return { error: (cause as Error).message };
  }
  if (!isRecord(data) || data.version !== 1) {
    return { error: 'planen har inte version 1' };
  }
  if (typeof data.bas !== 'string' || !SHA.test(data.bas)) {
    return { error: 'planen saknar en giltig bas' };
  }
  if (!Array.isArray(data.poster)) {
    return { error: 'planen saknar poster' };
  }

  const poster: PlanEntry[] = [];
  for (const [index, item] of data.poster.entries()) {
    const valid =
      isRecord(item) &&
      typeof item.fil === 'string' &&
      isExerciseFile(item.fil) &&
      typeof item.blob === 'string' &&
      SHA.test(item.blob) &&
      typeof item.commit === 'string' &&
      SHA.test(item.commit) &&
      typeof item.pr === 'number' &&
      Number.isSafeInteger(item.pr) &&
      item.pr > 0 &&
      typeof item.av === 'string' &&
      LOGIN.test(item.av);
    if (!valid) {
      return { error: `planens post ${index + 1} har fel form` };
    }
    poster.push({
      fil: item.fil as string,
      blob: item.blob as string,
      commit: item.commit as string,
      pr: item.pr as number,
      av: item.av as string,
    });
  }
  if (new Set(poster.map((entry) => entry.fil)).size !== poster.length) {
    return { error: 'planen nämner samma fil två gånger' };
  }
  return { version: 1, bas: data.bas, poster };
}

/**
 * Skriver planen. Varje fil måste ha precis den text torrkörningen visade, ha ändrats senast i
 * planens merge, och planens pull request och konto måste stämma med det API:t svarar nu;
 * annars skrivs ingenting alls. Planen är bara det ägaren såg, inte en källa till det som
 * skrivs (F5). En fil som redan står i `godkand` hoppas över, så att två körningar med
 * överlappande planer inte krockar. Utan `write` ändras ingenting.
 */
export function tillampa(
  git: HistoryReader,
  api: ApiGet,
  plan: Plan,
  options: { rev?: string; datum?: string; write?: boolean; retry?: RetryOptions } = {},
  writeFile: WriteFile = writeToDisk,
): ApprovalResult {
  const rev = options.rev ?? 'HEAD';
  const files: ApprovalFile[] = [];
  const pulls = new Map<string, ResolvedPull | { error: string }>();

  for (const entry of plan.poster) {
    const raw = git.read(rev, entry.fil);
    const blob = git.blob(rev, entry.fil);
    if (raw === undefined || blob === undefined) {
      files.push({ file: entry.fil, outcome: 'fel', message: 'filen finns inte längre' });
      continue;
    }
    if (blob !== entry.blob) {
      const status = readStatus(raw).status;
      files.push(
        status === APPROVED_STATUS
          ? { file: entry.fil, outcome: 'orord', message: `status är redan ${APPROVED_STATUS}` }
          : {
              file: entry.fil,
              outcome: 'fel',
              message: 'filen har ändrats sedan torrkörningen',
            },
      );
      continue;
    }
    if (git.blob(entry.commit, entry.fil) !== entry.blob) {
      files.push({
        file: entry.fil,
        outcome: 'fel',
        message: `texten är inte den som kom in med ${entry.commit}`,
      });
      continue;
    }
    // Samma blob kan ha kommit in igen med en senare merge. Raden ska nämna den merge som
    // senast förde in texten, precis som i torrkörningen.
    const last = git.lastChange(rev, entry.fil);
    if (last !== entry.commit) {
      files.push({
        file: entry.fil,
        outcome: 'fel',
        message: `filen ändrades senast i ${last ?? 'ingen commit'}, inte i ${entry.commit}`,
      });
      continue;
    }

    let pull = pulls.get(entry.commit);
    if (pull === undefined) {
      pull = resolvePullRequest(
        api,
        entry.commit,
        git.message(entry.commit),
        options.retry ?? DEFAULT_RETRY,
      );
      pulls.set(entry.commit, pull);
    }
    if ('error' in pull) {
      files.push({ file: entry.fil, outcome: 'fel', message: pull.error });
      continue;
    }
    if (pull.pr !== entry.pr || pull.av !== entry.av) {
      files.push({
        file: entry.fil,
        outcome: 'fel',
        message:
          `planen säger pull request #${entry.pr} mergad av ${entry.av}, ` +
          `API:t säger #${pull.pr} mergad av ${pull.av}`,
      });
      continue;
    }

    const raised = raiseToApproved(
      raw,
      reviewLine({ av: pull.av, pr: pull.pr, datum: options.datum }),
    );
    if ('error' in raised) {
      files.push({ file: entry.fil, outcome: 'fel', message: raised.error });
      continue;
    }
    files.push({
      file: entry.fil,
      outcome: 'lyft',
      message: `${REVIEWED_STATUS} → ${APPROVED_STATUS} (pull request #${pull.pr}, mergad av ${pull.av})`,
      text: raised.text,
    });
  }

  const ok = files.every((file) => file.outcome !== 'fel');
  const write = ok && options.write === true;
  if (write) {
    for (const file of files) {
      if (file.outcome === 'lyft' && file.text !== undefined) {
        writeFile(file.file, file.text);
      }
    }
  }
  return { ok, files, written: write };
}

const COMMANDS = ['kontroll', 'godkann', 'planera', 'tillampa'] as const;
type Command = (typeof COMMANDS)[number];

const VALUE_FLAGS = [
  '--bas',
  '--huvud',
  '--fore',
  '--efter',
  '--av',
  '--pr',
  '--repo',
  '--ut',
  '--plan',
] as const;

export interface ParsedArguments {
  command: Command;
  values: Map<string, string>;
  write: boolean;
}

/** Argumenten: ett kommando, `--flagga värde` och den ensamma flaggan `--skriv`. */
export function parseArguments(argv: string[]): ParsedArguments | { error: string } {
  const [command, ...rest] = argv;
  if (command === undefined || !COMMANDS.includes(command as Command)) {
    return { error: `Ange ett kommando: ${COMMANDS.join(' eller ')}.` };
  }

  const values = new Map<string, string>();
  let write = false;

  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index] as string;
    if (flag === '--skriv') {
      write = true;
      continue;
    }
    if (!VALUE_FLAGS.includes(flag as (typeof VALUE_FLAGS)[number])) {
      return { error: `Okänd flagga: ${flag}.` };
    }
    const value = rest[index + 1];
    if (value === undefined || value.startsWith('--')) {
      return { error: `Flaggan ${flag} saknar värde.` };
    }
    values.set(flag, value);
    index += 1;
  }

  return { command: command as Command, values, write };
}

/** `1 övning` men `2 övningar`, så att utskriften går att läsa. */
function antal(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function runKontroll(git: GitReader, args: ParsedArguments, log: (line: string) => void): number {
  const base = args.values.get('--bas');
  const head = args.values.get('--huvud');
  if (base === undefined || head === undefined) {
    log('Ange --bas <sha> och --huvud <sha>.');
    return 1;
  }

  const result = kontroll(git, { base, head });
  log(
    `Omgången ändrar ${antal(result.exercises.length, 'övning', 'övningar')} och ` +
      `${antal(result.others.length, 'annan fil', 'andra filer')}.`,
  );
  for (const finding of result.findings) {
    log(formatFinding(finding));
  }
  log(result.ok ? 'Kontrollen godkänner omgången.' : `Kontrollen underkänner omgången.`);
  return result.ok ? 0 : 1;
}

function runGodkann(git: GitReader, args: ParsedArguments, log: (line: string) => void): number {
  const before = args.values.get('--fore');
  const after = args.values.get('--efter');
  if (before === undefined || after === undefined) {
    log('Ange --fore <sha> och --efter <sha>.');
    return 1;
  }
  if (before === EMPTY_SHA) {
    log(`Ingen tidigare commit (${EMPTY_SHA}). Ingenting skrivs.`);
    return 0;
  }

  const pr = args.values.get('--pr');
  if (pr !== undefined && !/^\d+$/.test(pr)) {
    log('Flaggan --pr ska vara ett nummer.');
    return 1;
  }

  const av = args.values.get('--av');
  if (args.write && av === undefined) {
    log('Ange --av <konto>, det konto som mergade omgången. Utan det skrivs ingenting.');
    return 1;
  }

  const result = godkann(git, {
    before,
    after,
    av: av ?? 'okänt konto',
    pr: pr === undefined ? undefined : Number(pr),
    write: args.write,
  });

  for (const file of result.files) {
    log(
      `${file.outcome === 'lyft' ? 'Lyfter' : file.outcome === 'orord' ? 'Rör inte' : 'Fel i'} ${fileName(file.file)}: ${file.message}`,
    );
  }

  const raised = result.files.filter((file) => file.outcome === 'lyft').length;
  log(
    result.written
      ? `${antal(raised, 'övning satt', 'övningar satta')} till ${APPROVED_STATUS}.`
      : `Torrkörning: ${antal(raised, 'övning', 'övningar')} skulle sättas till ` +
          `${APPROVED_STATUS}. Lägg till --skriv för att skriva.`,
  );
  return result.ok ? 0 : 1;
}

const MISSING_REPO = 'Ange --repo <ägare/namn>, eller kör med GITHUB_REPOSITORY satt.';

/** API:t för repot i `--repo` eller GITHUB_REPOSITORY, eller `undefined` om inget giltigt anges. */
function apiFromArguments(args: ParsedArguments): ApiGet | undefined {
  const repo = args.values.get('--repo') ?? process.env.GITHUB_REPOSITORY;
  return repo !== undefined && /^[\w.-]+\/[\w.-]+$/.test(repo) ? createGhApi(repo) : undefined;
}

function runPlanera(
  git: HistoryReader,
  args: ParsedArguments,
  log: (line: string) => void,
  api: ApiGet | undefined,
): number {
  const github = api ?? apiFromArguments(args);
  if (github === undefined) {
    log(MISSING_REPO);
    return 1;
  }

  const { plan, findings } = planera(git, github);
  for (const entry of plan.poster) {
    log(
      `Lyfter ${fileName(entry.fil)}: ${REVIEWED_STATUS} → ${APPROVED_STATUS} ` +
        `(pull request #${entry.pr}, mergad av ${entry.av})`,
    );
  }
  for (const finding of findings) {
    log(`Fel i ${formatFinding(finding)}`);
  }

  // Vid fel skrivs en tom plan, så att ett skrivjobb som ändå skulle starta inte har något att
  // skriva. Arbetsflödet startar det inte heller, eftersom steget faller.
  const out = args.values.get('--ut');
  if (out !== undefined) {
    writeFileSync(out, JSON.stringify(findings.length === 0 ? plan : { ...plan, poster: [] }));
  }
  log(
    findings.length === 0
      ? `Torrkörning: ${antal(plan.poster.length, 'övning', 'övningar')} skulle sättas till ` +
          `${APPROVED_STATUS}.`
      : `Torrkörningen hittade ${antal(findings.length, 'fel', 'fel')}. Ingenting skrivs.`,
  );
  return findings.length === 0 ? 0 : 1;
}

function runTillampa(
  git: HistoryReader,
  args: ParsedArguments,
  log: (line: string) => void,
  api: ApiGet | undefined,
): number {
  const path = args.values.get('--plan');
  if (path === undefined) {
    log('Ange --plan <fil>.');
    return 1;
  }
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (cause) {
    log(`Planen går inte att läsa: ${(cause as Error).message}`);
    return 1;
  }
  const plan = parsePlan(text);
  if ('error' in plan) {
    log(`Planen går inte att använda: ${plan.error}. Ingenting skrivs.`);
    return 1;
  }
  const github = api ?? apiFromArguments(args);
  if (github === undefined) {
    log(MISSING_REPO);
    return 1;
  }

  const result = tillampa(git, github, plan, { write: args.write });
  for (const file of result.files) {
    log(
      `${file.outcome === 'lyft' ? 'Lyfter' : file.outcome === 'orord' ? 'Rör inte' : 'Fel i'} ${fileName(file.file)}: ${file.message}`,
    );
  }
  if (!result.ok) {
    log('Minst en fil stämmer inte med torrkörningen. Ingenting skrivs.');
    return 1;
  }
  const raised = result.files.filter((file) => file.outcome === 'lyft').length;
  log(
    result.written
      ? `${antal(raised, 'övning satt', 'övningar satta')} till ${APPROVED_STATUS}.`
      : `Torrkörning: ${antal(raised, 'övning', 'övningar')} skulle sättas till ` +
          `${APPROVED_STATUS}. Lägg till --skriv för att skriva.`,
  );
  return 0;
}

/** Kör skriptet. Returnerar processens slutkod: 1 om något underkänns. */
export function main(
  argv: string[],
  log: (line: string) => void = console.log,
  git: HistoryReader = createHistoryReader(),
  api?: ApiGet,
): number {
  const args = parseArguments(argv);
  if ('error' in args) {
    log(args.error);
    return 1;
  }
  switch (args.command) {
    case 'kontroll':
      return runKontroll(git, args, log);
    case 'godkann':
      return runGodkann(git, args, log);
    case 'planera':
      return runPlanera(git, args, log, api);
    case 'tillampa':
      return runTillampa(git, args, log, api);
  }
}

const invokedDirectly =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exitCode = main(process.argv.slice(2));
}
