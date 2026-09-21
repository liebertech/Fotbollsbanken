/**
 * Insticket som bygger in banken i appen (ADR 0015).
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  BANK_MODULE_ID,
  RESOLVED_BANK_MODULE_ID,
  buildBankModule,
  ovningsbanken,
} from './ovningsbanken-plugin.ts';
import { CONTENT_DIR } from './validera-ovningar.ts';

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

  it('avbryter bygget när en fil inte går att läsa som en övning', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ovningsbank-'));
    writeFileSync(join(dir, 'trasig.yaml'), 'status: godkand\nid: trasig\n', 'utf8');
    expect(() => buildBankModule(dir)).toThrow(/trasig/);
  });
});
