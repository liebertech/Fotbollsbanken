/**
 * Läser övningsbanken ur content/ovningar/ och lämnar de godkända övningarna som färdiga
 * objekt.
 *
 * Skriptet körs vid bygget (vite-insticket i vite.config.ts) och i testerna. Regelmotorn
 * läser aldrig filer själv (ADR 0011 avsnitt 1); den får banken inskickad.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { exerciseSchema } from '../src/regelmotor/schema/ovning.ts';
import type { Exercise } from '../src/regelmotor/schema/ovning.ts';

export const CONTENT_DIR = 'content/ovningar';

export interface BankResult {
  exercises: Exercise[];
  /** Filer som inte gick att läsa som en godkänd övning, med felet. */
  problems: { file: string; message: string }[];
}

/**
 * Läser banken. Bara övningar med status `godkand` kommer med: generatorn väljer bara
 * härifrån (R-022).
 */
export function loadBank(dir: string = CONTENT_DIR): BankResult {
  const exercises: Exercise[] = [];
  const problems: { file: string; message: string }[] = [];

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
    if (
      document === null ||
      typeof document !== 'object' ||
      (document as { status?: unknown }).status !== 'godkand'
    ) {
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

  return { exercises, problems };
}
