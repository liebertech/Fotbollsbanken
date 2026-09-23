/**
 * Validerar övningsfilerna i content/ovningar/ (ADR 0010 avsnitt 5).
 *
 *   npm run validera:ovningar            # alla filer
 *   npm run validera:ovningar -- <fil>   # en fil eller en mapp
 *
 * Skriptet körs av Node direkt, utan byggsteg, och innehåller ingen egen regelkunskap:
 * all kunskap om fält och regler ligger i src/regelmotor/schema/ovning.ts.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { LIMITS, exerciseFileSchema } from '../src/regelmotor/schema/ovning.ts';
// Mappen med övningsbanken har en enda definition, i scripts/bank.ts (S-34).
import { CONTENT_DIR } from './bank.ts';

export interface ValidationError {
  /** Filens sökväg, relativt den katalog skriptet startades i. */
  file: string;
  /** Fältet felet gäller, till exempel `fokusomraden.0`. Tom sträng för fel på hela filen. */
  field: string;
  message: string;
}

export interface ValidationResult {
  files: string[];
  errors: ValidationError[];
}

/** En rad per fel: `fil: fält – meddelande`. */
export function formatError(error: ValidationError): string {
  const field = error.field === '' ? '(filen)' : error.field;
  return `${error.file}: ${field} – ${error.message}`;
}

/** Filer som valideras: `.yaml` i mappen, utom de som börjar med `_` (ADR 0010 avsnitt 1). */
export function findExerciseFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => extname(name) === '.yaml' && !name.startsWith('_'))
    .sort()
    .map((name) => join(dir, name));
}

function pathToField(path: readonly PropertyKey[]): string {
  return path.map((part) => String(part)).join('.');
}

/** Validerar en fil. `seenIds` bär id:n från tidigare filer, så att dubbletter upptäcks. */
export function validateFile(
  file: string,
  seenIds: Map<string, string> = new Map(),
): ValidationError[] {
  const errors: ValidationError[] = [];
  const add = (field: string, message: string) => errors.push({ file, field, message });

  let raw: string;
  try {
    raw = readFileSync(file, 'utf8');
  } catch (cause) {
    add('', `filen går inte att läsa: ${(cause as Error).message}`);
    return errors;
  }

  let document: unknown;
  try {
    document = parseYaml(raw);
  } catch (cause) {
    add('', `filen går inte att läsa som YAML: ${(cause as Error).message}`);
    return errors;
  }

  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    add('', 'filen ska innehålla en övning som ett YAML-objekt');
    return errors;
  }

  const result = exerciseFileSchema.safeParse(document);
  if (!result.success) {
    for (const issue of result.error.issues) {
      add(pathToField(issue.path), issue.message);
    }
  }

  // Filnamnet och fältet `id` ska vara lika, och ett id används bara av en fil (ADR 0010).
  const expectedId = basename(file, '.yaml');
  const actualId = (document as { id?: unknown }).id;
  if (typeof actualId === 'string') {
    if (actualId !== expectedId) {
      add('id', `id är "${actualId}" men filen heter "${expectedId}.yaml". De ska vara lika`);
    }
    const previous = seenIds.get(actualId);
    if (previous !== undefined) {
      add('id', `id "${actualId}" används också av ${previous}. Ett id återanvänds aldrig`);
    } else {
      seenIds.set(actualId, file);
    }
  }

  // S-08: innehållet ska rymmas i databasens `content`.
  const bytes = new TextEncoder().encode(JSON.stringify(document) ?? '').length;
  if (bytes >= LIMITS.contentBytes) {
    add(
      '',
      `innehållet är ${bytes} byte. Gränsen i databasen är ${LIMITS.contentBytes} byte (S-08)`,
    );
  }

  return errors;
}

/** Validerar en lista med filer och mappar. */
export function validateFiles(targets: string[]): ValidationResult {
  const files: string[] = [];
  for (const target of targets) {
    if (statSync(target).isDirectory()) {
      files.push(...findExerciseFiles(target));
    } else {
      files.push(target);
    }
  }

  const seenIds = new Map<string, string>();
  const errors = files.flatMap((file) => validateFile(file, seenIds));
  return { files, errors };
}

/** Kör skriptet. Returnerar processens slutkod: 1 om något underkänns. */
export function main(argv: string[], log: (line: string) => void = console.log): number {
  const targets = argv.length > 0 ? argv : [CONTENT_DIR];

  for (const target of targets) {
    try {
      statSync(target);
    } catch {
      log(`Hittar inte ${target}`);
      return 1;
    }
  }

  const { files, errors } = validateFiles(targets);

  if (files.length === 0) {
    log(`Inga övningsfiler att validera i ${targets.join(', ')}.`);
    return 0;
  }

  for (const error of errors) {
    log(formatError({ ...error, file: relative(process.cwd(), error.file) || error.file }));
  }

  if (errors.length === 0) {
    log(`${files.length} övningar validerade utan fel.`);
    return 0;
  }

  log(`${files.length} övningar kontrollerade, ${errors.length} fel.`);
  return 1;
}

const invokedDirectly =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exitCode = main(process.argv.slice(2));
}
