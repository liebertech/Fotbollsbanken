/**
 * Varje domännyckel ska ha ett namn på svenska. Ett tomt namn i gränssnittet syns annars
 * först när en ledare råkar välja just den nyckeln.
 */
import { describe, expect, it } from 'vitest';
import { FOCUS_AREAS, INPUT_FIELDS } from '../../regelmotor/index.ts';
import {
  AREA_NAMES,
  FIELD_NAMES,
  FOCUS_AREA_NAMES,
  FOCUS_GROUPS,
  GAME_FORMAT_NAMES,
  LEVEL_NAMES,
  MATERIAL_NAMES,
  NAMED_KEYS,
  PART_NAMES,
  materialText,
  stationLabel,
} from './names.ts';

const names = [
  { keys: NAMED_KEYS.focusAreas, values: FOCUS_AREA_NAMES, name: 'fokusområden' },
  { keys: NAMED_KEYS.levels, values: LEVEL_NAMES, name: 'nivåer' },
  { keys: NAMED_KEYS.gameFormats, values: GAME_FORMAT_NAMES, name: 'spelformer' },
  { keys: NAMED_KEYS.parts, values: PART_NAMES, name: 'passdelar' },
  { keys: NAMED_KEYS.areas, values: AREA_NAMES, name: 'ytor' },
  { keys: INPUT_FIELDS, values: FIELD_NAMES, name: 'underlagets fält' },
];

describe('Namn för domännycklarna', () => {
  for (const group of names) {
    it(`ger ett namn för alla ${group.name}`, () => {
      for (const key of group.keys) {
        expect((group.values as Record<string, string>)[key]).toBeTruthy();
      }
    });
  }

  it('lägger varje fokusområde i exakt en grupp', () => {
    const grouped = FOCUS_GROUPS.flatMap((group) => group.areas);
    expect([...grouped].sort()).toEqual([...FOCUS_AREAS].sort());
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it('R-120 skriver materialet i klartext, med anteckningen när den finns', () => {
    expect(Object.keys(MATERIAL_NAMES).length).toBeGreaterThan(0);
    expect(materialText({ typ: 'boll', antal: 1 })).toBe('1 boll');
    expect(materialText({ typ: 'kon', antal: 8 })).toBe('8 koner');
    expect(materialText({ typ: 'ovrigt', antal: 2, anteckning: 'tennisbollar' })).toBe(
      '2 tennisbollar',
    );
  });

  it('ger stationerna bokstäver, som i texter.md', () => {
    expect(stationLabel(1)).toBe('Station A');
    expect(stationLabel(4)).toBe('Station D');
  });
});
