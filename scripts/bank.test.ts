/**
 * Inläsningen av banken (ADR 0015, R-022).
 *
 * Testet skriver egna filer i en temporär katalog och rör aldrig content/ovningar/.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { stringify as stringifyYaml } from 'yaml';
import { CONTENT_DIR, loadBank } from './bank.ts';
import { reviewEntry, validExercise } from '../src/regelmotor/__testdata__/ovning-fixtur.ts';

/** En katalog med de filer testet behöver. */
function bankDir(files: Record<string, unknown>): string {
  const dir = mkdtempSync(join(tmpdir(), 'bank-'));
  for (const [name, document] of Object.entries(files)) {
    writeFileSync(join(dir, name), stringifyYaml(document), 'utf8');
  }
  return dir;
}

function approved(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return validExercise({ status: 'godkand', granskning: [reviewEntry()], ...overrides });
}

describe('R-022 loadBank läser bara godkända övningar', () => {
  it('R-022 tar med den godkända övningen', () => {
    const dir = bankDir({ 'passa-och-folj.yaml': approved() });
    const { exercises, problems, skipped } = loadBank(dir);
    expect(problems).toEqual([]);
    expect(skipped).toEqual([]);
    expect(exercises.map((exercise) => exercise.id)).toEqual(['passa-och-folj']);
  });

  it('S-30 redovisar varje fil som hoppades över och varför', () => {
    const dir = bankDir({
      'passa-och-folj.yaml': approved(),
      'granskad.yaml': validExercise({ id: 'granskad', status: 'granskad' }),
      'prickig.yaml': validExercise({ id: 'prickig', status: 'godkänd' }),
      'lista.yaml': ['inte ett objekt'],
    });
    const { exercises, problems, skipped } = loadBank(dir);
    expect(problems).toEqual([]);
    expect(exercises).toHaveLength(1);
    expect(skipped.map((item) => item.status).sort()).toEqual([
      'godkänd',
      'granskad',
      'ingen övning',
    ]);
  });
});

describe('S-34 Sökvägen till övningarna', () => {
  it('S-34 pekar ut content/ovningar oavsett var processen startades', () => {
    expect(CONTENT_DIR.replaceAll('\\', '/')).toMatch(/\/content\/ovningar$/);
    expect(loadBank().exercises.length).toBeGreaterThan(0);
  });
});
