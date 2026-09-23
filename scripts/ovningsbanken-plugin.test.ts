/**
 * Insticket som bygger in banken i appen (ADR 0015).
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { stringify as stringifyYaml } from 'yaml';
import {
  BANK_MODULE_ID,
  RESOLVED_BANK_MODULE_ID,
  buildBank,
  buildBankModule,
  ovningsbanken,
} from './ovningsbanken-plugin.ts';
import { CONTENT_DIR } from './bank.ts';
import { reviewEntry, validExercise } from '../src/regelmotor/__testdata__/ovning-fixtur.ts';
import { PUBLISHED_FIELDS } from '../src/regelmotor/schema/published.ts';

const FIELDS = new Set<string>(PUBLISHED_FIELDS);

/**
 * Övningarna ur den byggda modulen. Modulen är `JSON.parse` av en strängliteral (S-31), så
 * literalen läses som JSON och innehållet därefter som JSON igen.
 */
function bankFromModule(code: string): Record<string, unknown>[] {
  const start = code.indexOf('JSON.parse(') + 'JSON.parse('.length;
  const literal = code.slice(start, code.lastIndexOf(')'));
  return JSON.parse(JSON.parse(literal) as string) as Record<string, unknown>[];
}

describe('ADR 0015 Övningsbanken som virtuell modul', () => {
  it('löser bara sitt eget modulnamn', () => {
    const plugin = ovningsbanken();
    expect(plugin.resolveId(BANK_MODULE_ID)).toBe(RESOLVED_BANK_MODULE_ID);
    expect(plugin.resolveId('react')).toBeUndefined();
    expect(plugin.load.call({}, 'react')).toBeUndefined();
  });

  it('R-022 bygger en modul med bankens godkända övningar', () => {
    const code = buildBankModule(CONTENT_DIR);
    const bank = bankFromModule(code);
    expect(bank.length).toBeGreaterThan(0);
    expect(bank.every((exercise) => exercise.status === 'godkand')).toBe(true);
  });

  it('S-31 skriver övningarna som data att JSON.parse:a, inte som källkod', () => {
    const code = buildBankModule(CONTENT_DIR);
    expect(code).toContain('export const bank = JSON.parse("');
    // Hela innehållet ligger i en enda strängliteral, som JSON.parse läser.
    expect(bankFromModule(code).length).toBeGreaterThan(0);
  });

  it('S-27 bygger bara in de publicerade fälten, aldrig granskningsraderna', () => {
    const code = buildBankModule(CONTENT_DIR);
    // Varken fältnamnet eller granskarnas namn får finnas i modulen.
    expect(code).not.toContain('granskning');
    expect(code).not.toContain('fotbollsexpert');
    for (const exercise of bankFromModule(code)) {
      expect(Object.keys(exercise).every((key) => FIELDS.has(key))).toBe(true);
      expect(exercise).not.toHaveProperty('granskning');
      expect(exercise).not.toHaveProperty('kalla');
      expect(exercise).not.toHaveProperty('schema');
    }
  });

  it('S-27 har kvar de fält motorn och gränssnittet läser', () => {
    const [first] = bankFromModule(buildBankModule(CONTENT_DIR));
    expect(first).toBeDefined();
    for (const field of ['id', 'namn', 'syfte', 'status', 'passdelar', 'tid']) {
      expect(first).toHaveProperty(field);
    }
  });

  it('S-30 redovisar hur många övningar som byggdes in och hur många som hoppades över', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ovningsbank-'));
    writeFileSync(
      join(dir, 'passa-och-folj.yaml'),
      stringifyYaml(validExercise({ status: 'godkand', granskning: [reviewEntry()] })),
      'utf8',
    );
    writeFileSync(
      join(dir, 'granskad.yaml'),
      stringifyYaml(validExercise({ id: 'granskad', status: 'granskad' })),
      'utf8',
    );
    const { summary } = buildBank(dir);
    expect(summary).toContain('1 övningar inbyggda, 1 överhoppade');
    expect(summary).toContain('granskad.yaml (granskad)');
  });

  it('avbryter bygget när en fil inte går att läsa som en övning', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ovningsbank-'));
    writeFileSync(join(dir, 'trasig.yaml'), 'status: godkand\nid: trasig\n', 'utf8');
    expect(() => buildBankModule(dir)).toThrow(/trasig/);
  });
});
