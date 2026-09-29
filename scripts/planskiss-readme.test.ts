/**
 * Exemplen på planskisser i content/ovningar/README.md ska vara giltiga, eftersom
 * övningsförfattaren kopierar dem som utgångspunkt (ADR 0012). Testet kräver också ett
 * exempel för varje spelform som bankens godkända övningar använder.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import { readPlanskiss } from '../src/regelmotor/schema/planskiss.ts';
import { exerciseFileSchema } from '../src/regelmotor/schema/ovning.ts';
import { CONTENT_DIR, loadBank } from './bank.ts';

const README = readFileSync(join(CONTENT_DIR, 'README.md'), 'utf8');

/** Avsnittet om planskissen, fram till nästa rubrik på samma nivå. */
function planskissSection(): string {
  const start = README.indexOf('## `planskiss`');
  expect(start).toBeGreaterThanOrEqual(0);
  const end = README.indexOf('\n## ', start + 1);
  return README.slice(start, end === -1 ? undefined : end);
}

/** Kodblocken i avsnittet som är hela skisser, med spelformen ur raden `# Spelform:`. */
function examples(): { spelform: string; planskiss: unknown }[] {
  const blocks = [...planskissSection().matchAll(/```yaml\n([\s\S]*?)```/g)].map(
    (match) => match[1] ?? '',
  );
  return blocks
    .filter((block) => block.startsWith('# Spelform:'))
    .map((block) => ({
      spelform: /^# Spelform: (\S+)/.exec(block)?.[1] ?? '',
      planskiss: (parseYaml(block) as { planskiss?: unknown }).planskiss,
    }));
}

describe('planskissexemplen i content/ovningar/README.md', () => {
  it('varje exempel är en giltig planskiss', () => {
    const found = examples();
    expect(found.length).toBeGreaterThanOrEqual(3);
    for (const { spelform, planskiss } of found) {
      const result = readPlanskiss(planskiss);
      expect({ spelform, result: result.status === 'ogiltig' ? result.issues : 'ok' }).toEqual({
        spelform,
        result: 'ok',
      });
    }
  });

  it('det finns ett exempel för varje spelform som bankens övningar använder', () => {
    const inBank = new Set(loadBank(CONTENT_DIR).exercises.flatMap((item) => item.spelformer));
    const inReadme = new Set(examples().map((example) => example.spelform));
    for (const spelform of inBank) {
      expect(inReadme, `exempel saknas för ${spelform}`).toContain(spelform);
    }
  });

  it('exemplet för 7 mot 7 passar i exempelövningen längre ned i filen', () => {
    const exercise = [...README.matchAll(/```yaml\n(schema: 1[\s\S]*?)```/g)][0]?.[1];
    expect(exercise).toBeDefined();
    const planskiss = examples().find((example) => example.spelform === '7mot7')?.planskiss;
    const document = { ...(parseYaml(exercise ?? '') as Record<string, unknown>), planskiss };
    const result = exerciseFileSchema.safeParse(document);
    expect(result.success ? [] : result.error.issues.map((issue) => issue.message)).toEqual([]);
  });
});
