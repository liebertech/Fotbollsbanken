/**
 * Målbredderna i ritmotorn ska stämma med docs/doman/spelformer.md, så att tabellen i koden
 * och dokumentet inte glider isär (ADR 0012 avsnitt 1 och 8, *Målstorlekar*).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GAME_FORMATS } from '../src/regelmotor/keys.ts';
import { GOAL_WIDTHS } from '../src/planskiss/matt.ts';

const DOC = readFileSync(join(import.meta.dirname, '..', 'docs', 'doman', 'spelformer.md'), 'utf8');

/**
 * Målets bredd i meter ur spelformens rad i tabellen: den rekommenderade bredden om raden
 * anger en, annars det första måttet.
 */
function documentedWidth(format: string): number {
  const row = DOC.split('\n').find((line) => line.startsWith(`| \`${format}\` |`));
  expect(row, `raden för ${format} saknas i spelformer.md`).toBeDefined();
  const goal = (row ?? '').split('|')[6]?.trim() ?? '';
  const recommended = /\(([\d,]+) × [\d,]+ rekommenderas\)/.exec(goal);
  const width = recommended?.[1] ?? /([\d,]+) ×/.exec(goal)?.[1] ?? '';
  return Number(width.replace(',', '.'));
}

describe('målbredderna stämmer med spelformer.md', () => {
  it.each(GAME_FORMATS)('%s', (format) => {
    expect(GOAL_WIDTHS[format]).toBe(documentedWidth(format));
  });
});
