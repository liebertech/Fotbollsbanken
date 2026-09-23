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

describe('ADR 0015 Övningsbanken som virtuell modul', () => {
  it('löser bara sitt eget modulnamn', () => {
    const plugin = ovningsbanken();
    expect(plugin.resolveId(BANK_MODULE_ID)).toBe(RESOLVED_BANK_MODULE_ID);
    expect(plugin.resolveId('react')).toBeUndefined();
    expect(plugin.load.call({}, 'react')).toBeUndefined();
  });

  it('R-022 bygger en modul med bankens godkända övningar', () => {
    const code = buildBankModule(CONTENT_DIR);
    expect(code).toContain('export const bank = ');
    const json = code.slice(code.indexOf('['), code.lastIndexOf(']') + 1);
    const bank = JSON.parse(json) as { id: string; status: string }[];
    expect(bank.length).toBeGreaterThan(0);
    expect(bank.every((exercise) => exercise.status === 'godkand')).toBe(true);
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
