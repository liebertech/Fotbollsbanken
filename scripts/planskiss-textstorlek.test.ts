/**
 * Ingen text i planskissvyerna (src/app/planskiss/Planskissvy.module.css) är mindre än 14 px (designsystem.md avsnitt 3, fynd D i
 * ux-granskningen av ritmotorn). Gäller platshållaren "Planskiss saknas" i miniatyren och
 * bildtexten under skissen.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const CSS = readFileSync(
  new URL('../src/app/planskiss/Planskissvy.module.css', import.meta.url),
  'utf8',
);

describe('textstorlek i Planskissvy.module.css', () => {
  it('varje font-size är minst 0.875rem (14 px)', () => {
    const sizes = [...CSS.matchAll(/font-size:\s*([^;]+);/g)].map((match) => match[1]?.trim());
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      const rem = /^([\d.]+)rem$/.exec(size ?? '');
      expect(rem, `font-size ${size ?? ''} ska anges i rem`).not.toBeNull();
      expect(Number(rem?.[1])).toBeGreaterThanOrEqual(0.875);
    }
  });

  it('platshållaren i miniatyr och bildtexten har 0.875rem', () => {
    expect(CSS).toMatch(/\.caption \{[^}]*font-size: 0\.875rem;/);
    expect(CSS).toMatch(/\.placeholder\.miniatyr \{[^}]*font-size: 0\.875rem;/);
  });
});
