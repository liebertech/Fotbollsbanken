/**
 * Ljust och mörkt läge (berättelse 06 kriterium 7, ADR 0012 avsnitt 5, RK-5): varje fyllning
 * och kontur i skissen kommer från en fast CSS-variabel, och varje variabel har ett värde i
 * ljust läge, mörkt läge, planläget och utskriften.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Testet ligger i scripts/, eftersom det läser CSS-filen som text med Node.
const CSS = readFileSync(
  join(import.meta.dirname, '..', 'src', 'planskiss', 'planskiss.module.css'),
  'utf8',
);

/** Innehållet i första regeln med exakt den här väljaren, efter `start` i filen. */
function block(selector: string, start = 0): string {
  const at = CSS.indexOf(`${selector} {`, start);
  expect(at, `regeln ${selector} saknas`).toBeGreaterThanOrEqual(0);
  return CSS.slice(at, CSS.indexOf('}', at));
}

function variables(css: string): string[] {
  return [...css.matchAll(/(--skiss-[a-z0-9-]+):/g)].map((match) => match[1] ?? '').sort();
}

/** Variabelns värde i ett block, utan blanksteg. */
function value(css: string, name: string): string {
  const match = new RegExp(`${name}:\\s*([^;]+);`).exec(css);
  expect(match, `${name} saknas`).not.toBeNull();
  return match?.[1]?.trim() ?? '';
}

describe('färgerna i planskissen', () => {
  it('varje fill och stroke pekar på en --skiss-variabel eller är none', () => {
    const declarations = [...CSS.matchAll(/(?:^|[\s;{])(fill|stroke):\s*([^;]+);/g)].map(
      (match) => match[2]?.trim() ?? '',
    );
    expect(declarations.length).toBeGreaterThan(20);
    for (const value of declarations) {
      expect(value).toMatch(/^(none|var\(--skiss-[a-z0-9-]+\))$/);
    }
  });

  it('ljust och mörkt läge sätter samma variabler', () => {
    const light = variables(block('.skiss'));
    const darkStart = CSS.indexOf('@media (prefers-color-scheme: dark)');
    const dark = variables(block('.skiss', darkStart));
    expect(light.length).toBeGreaterThan(10);
    expect(dark).toEqual(light);
  });

  it('planeringsläget har gräsmattans egna värden (designsystem.md avsnitt 10)', () => {
    const darkStart = CSS.indexOf('@media (prefers-color-scheme: dark)');
    const expected = {
      light: { '--skiss-yta': '#3e8e4f', '--skiss-yta-2': '#46995a' },
      dark: { '--skiss-yta': '#357847', '--skiss-yta-2': '#3b8350' },
    };
    for (const [mode, css] of [
      ['light', block('.skiss')],
      ['dark', block('.skiss', darkStart)],
    ] as const) {
      for (const [name, colour] of Object.entries(expected[mode])) {
        expect(value(css, name)).toBe(colour);
      }
      expect(value(css, '--skiss-linje')).toBe('#ffffff');
      expect(value(css, '--skiss-lag-a')).toBe('#ffd23f');
      expect(value(css, '--skiss-lag-a-kant')).toBe('#14231a');
      expect(value(css, '--skiss-kon')).toBe('#ff8a3d');
      expect(value(css, '--skiss-text')).toBe('#14231a');
      expect(value(css, '--skiss-halo')).toBe('#ffffff');
      expect(value(css, '--skiss-marginal')).toBe('var(--skiss-yta)');
    }
  });

  it('planläget och utskriften ritas som förut: en färg på ytan, ingen marginal', () => {
    const blocks = [
      block('.planlage'),
      block(
        '.planlage',
        CSS.indexOf('@media (prefers-color-scheme: dark)', CSS.indexOf('.planlage {')),
      ),
      block('.utskrift'),
      block('.skiss', CSS.indexOf('@media print')),
    ];
    for (const css of blocks) {
      expect(value(css, '--skiss-yta-2')).toBe(value(css, '--skiss-yta'));
      expect(value(css, '--skiss-yta')).toBe(value(css, '--skiss-bakgrund'));
      expect(value(css, '--skiss-halo')).toBe(value(css, '--skiss-bakgrund'));
      expect(value(css, '--skiss-lag-a-kant')).toBe(value(css, '--skiss-linje'));
      expect(value(css, '--skiss-lag-a-kant')).toBe(value(css, '--skiss-lag-a'));
      expect(value(css, '--skiss-marginal')).toBe('none');
    }
  });

  it('kanterna och halon som bara hör till gräset gäller inte planläget eller utskriften', () => {
    const screen = CSS.slice(CSS.indexOf('@media screen'));
    expect(screen).toContain('.skiss:not(.planlage):not(.utskrift) .kon');
    expect(screen).toContain('.skiss:not(.planlage):not(.utskrift) .etikettPaOfylld');
  });

  it('planläget, utskriften och utskriftsmediet sätter alla variabler', () => {
    const light = variables(block('.skiss'));
    expect(variables(block('.planlage'))).toEqual(light);
    expect(variables(block('.utskrift'))).toEqual(light);
    const print = CSS.indexOf('@media print');
    expect(print).toBeGreaterThan(0);
    expect(variables(block('.skiss', print))).toEqual(light);
  });

  it('utskriften är bara svart, vitt och grått', () => {
    const values = [...block('.utskrift').matchAll(/--skiss-[a-z-]+:\s*(#[0-9a-f]{6})/g)].map(
      (match) => match[1] ?? '',
    );
    for (const value of values) {
      const [r, g, b] = [1, 3, 5].map((index) => value.slice(index, index + 2));
      expect(r === g && g === b, `${value} är inte en gråton`).toBe(true);
    }
  });

  it('text ur skissen isoleras från omgivande skrivriktning (RK-7)', () => {
    expect(block('.etikett')).toContain('unicode-bidi: isolate');
  });
});
