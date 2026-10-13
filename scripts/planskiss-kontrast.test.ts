/**
 * Kontrasten mot gräset i planeringsläget (riktning A, designsystem.md avsnitt 10, WCAG 1.4.11):
 * vita linjer, lag B:s kontur, den mörka kanten runt lag A och konen samt etiketternas text
 * ska ha minst 3:1 mot båda gräsränderna, i ljust och mörkt läge. Värdena läses ur CSS-filen,
 * så ett ändrat värde som bryter kravet fäller testet. Formeln är WCAG:s relativa luminans.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const CSS = readFileSync(
  join(import.meta.dirname, '..', 'src', 'planskiss', 'planskiss.module.css'),
  'utf8',
);

function block(selector: string, start = 0): string {
  const at = CSS.indexOf(`${selector} {`, start);
  expect(at, `regeln ${selector} saknas`).toBeGreaterThanOrEqual(0);
  return CSS.slice(at, CSS.indexOf('}', at));
}

function colour(css: string, name: string): string {
  const match = new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6});`).exec(css);
  expect(match, `${name} ska vara en sexsiffrig färgkod`).not.toBeNull();
  return match?.[1] ?? '#000000';
}

function luminance(hex: string): number {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

const darkStart = CSS.indexOf('@media (prefers-color-scheme: dark)');
const MODES = [
  ['ljust', block('.skiss')],
  ['mörkt', block('.skiss', darkStart)],
] as const;

describe('kontrast mot gräset, minst 3:1 i båda lägena och mot båda ränderna', () => {
  for (const [mode, css] of MODES) {
    const stripes = [colour(css, '--skiss-yta'), colour(css, '--skiss-yta-2')];

    it.each([
      ['vita linjer och pilar', '--skiss-linje'],
      ['lag B:s kontur', '--skiss-lag-b'],
      ['ledarens kontur', '--skiss-ledare'],
      ['neutrala spelares kontur', '--skiss-neutral'],
      ['tunna linjer', '--skiss-tunn'],
      ['mönster i zoner', '--skiss-monster'],
      ['den mörka kanten runt lag A, konen och bollen', '--skiss-lag-a-kant'],
    ])(`${mode}: %s mot gräset`, (_name, variable) => {
      for (const stripe of stripes) {
        expect(contrast(colour(css, variable), stripe)).toBeGreaterThanOrEqual(3);
      }
    });

    it(`${mode}: etikettens text står på vit halo eller på lag A:s gula fyllning, minst 4,5:1`, () => {
      const text = colour(css, '--skiss-text');
      expect(contrast(text, colour(css, '--skiss-halo'))).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(colour(css, '--skiss-pa-lag-a'), colour(css, '--skiss-lag-a')),
      ).toBeGreaterThanOrEqual(4.5);
    });

    it(`${mode}: lag A:s gula fyllning och konens orange bär ingen information ensamma`, () => {
      // Båda omges av den mörka kanten (3:1 ovan). Fyllningen i sig behöver inte klara 3:1,
      // men kanten mot fyllningen gör att formen syns också utan färgseende.
      const edge = colour(css, '--skiss-lag-a-kant');
      expect(contrast(edge, colour(css, '--skiss-lag-a'))).toBeGreaterThanOrEqual(3);
      expect(contrast(edge, colour(css, '--skiss-kon'))).toBeGreaterThanOrEqual(3);
    });
  }
});
