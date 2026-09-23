/**
 * Läser övningsbanken ur content/ovningar/ och lämnar de godkända övningarna som färdiga
 * objekt.
 *
 * Skriptet körs vid bygget (vite-insticket i vite.config.ts) och i testerna. Regelmotorn
 * läser aldrig filer själv (ADR 0011 avsnitt 1); den får banken inskickad.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { exerciseSchema } from '../src/regelmotor/schema/ovning.ts';
import type { Exercise } from '../src/regelmotor/schema/ovning.ts';

/**
 * Övningsbankens mapp. Den enda definitionen (S-34): valideringsskriptet, insticket och
 * testerna läser samma mapp. Sökvägen räknas ut från den här filen och inte från processens
 * arbetskatalog, så att bygget läser samma mapp som valideringen oavsett var det startas.
 */
export const CONTENT_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'content',
  'ovningar',
);

export interface BankResult {
  exercises: Exercise[];
  /** Filer som inte gick att läsa som en godkänd övning, med felet. */
  problems: { file: string; message: string }[];
  /**
   * Filer som lästes men som inte är en godkänd övning, med statusen de hade. De hoppas
   * över tyst i banken, och redovisas här så att ett tapp syns i byggloggen (S-30).
   */
  skipped: { file: string; status: string }[];
}

/**
 * Läser banken. Bara övningar med status `godkand` kommer med: generatorn väljer bara
 * härifrån (R-022).
 */
export function loadBank(dir: string = CONTENT_DIR): BankResult {
  const exercises: Exercise[] = [];
  const problems: { file: string; message: string }[] = [];
  const skipped: { file: string; status: string }[] = [];

  const files = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => extname(name) === '.yaml' && !name.startsWith('_'))
    .sort();

  for (const name of files) {
    const file = join(dir, name);
    let document: unknown;
    try {
      document = parseYaml(readFileSync(file, 'utf8'));
    } catch (cause) {
      problems.push({ file, message: (cause as Error).message });
      continue;
    }
    if (document === null || typeof document !== 'object' || Array.isArray(document)) {
      skipped.push({ file, status: 'ingen övning' });
      continue;
    }
    const status = (document as { status?: unknown }).status;
    if (status !== 'godkand') {
      skipped.push({ file, status: typeof status === 'string' ? status : 'utan status' });
      continue;
    }
    const result = exerciseSchema.safeParse(document);
    if (!result.success) {
      problems.push({
        file,
        message: result.error.issues.map((issue) => issue.message).join('; '),
      });
      continue;
    }
    exercises.push(result.data);
  }

  return { exercises, problems, skipped };
}
