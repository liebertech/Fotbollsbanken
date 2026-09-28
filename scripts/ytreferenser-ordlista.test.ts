/**
 * Håller ordlistan för ytreferenser (docs/doman/ytreferenser.md) och schemats kontroll av
 * fältet `ytreferens` (ADR 0017) ihop. Varje formulering i facit, avsnitt 6.1, ska gå igenom
 * måttkontrollen och längdgränserna. Ändras ordlistan eller valideringen så att de glider
 * isär, fäller testet.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LIMITS, containsMeasurement } from '../src/regelmotor/schema/ovning.ts';

const DOCUMENT = join(import.meta.dirname, '..', 'docs', 'doman', 'ytreferenser.md');

/** Raderna i tabellen under "6.1 Med referens", som [övning, referens, antal tecken]. */
function facitRows(): [string, string, number][] {
  const text = readFileSync(DOCUMENT, 'utf-8');
  const start = text.indexOf('### 6.1');
  const end = text.indexOf('### 6.2', start);
  const section = text.slice(start, end);
  return section
    .split('\n')
    .filter((line) => line.startsWith('| `'))
    .map((line) => {
      // | övning | spelform | mått | referens | tecken | var |
      const [, exercise = '', , , reference = '', count] = line
        .split('|')
        .map((cell) => cell.trim());
      return [exercise.replaceAll('`', ''), reference, Number(count)];
    });
}

describe('ADR 0017 ordlistan för ytreferenser mot schemat', () => {
  const rows = facitRows();

  it('facit i avsnitt 6.1 hittas och har 46 övningar', () => {
    expect(rows).toHaveLength(46);
  });

  it.each(rows)('%s: "%s" godkänns av måttkontrollen och längdgränserna', (_, text, count) => {
    expect(containsMeasurement(text)).toBe(false);
    expect([...text].length).toBe(count);
    expect(text.length).toBeGreaterThanOrEqual(LIMITS.ytreferens.min);
    expect(text.length).toBeLessThanOrEqual(LIMITS.ytreferens.max);
  });
});
