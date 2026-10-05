/**
 * Teckenförklaringens innehåll (ADR 0012 avsnitt 3 och 8, berättelse 06 kriterium 6): bara de
 * typer som förekommer i den ritade skissen, med en benämning i ord för varje.
 */
import { describe, expect, it } from 'vitest';
import type { PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { sketchLayout } from './Planskiss.tsx';
import { LEGEND_KINDS, LEGEND_NAMES, legendEntries } from './teckenforklaring.ts';
import type { LegendKind } from './teckenforklaring.ts';
import {
  ELVA_MOT_ELVA,
  FEM_MOT_FEM,
  SJU_MOT_SJU,
  TRE_MOT_TRE,
  sketch,
} from './__testdata__/skisser.ts';

function kinds(input: PlanskissInput, count?: number): LegendKind[] {
  const data = sketch(input);
  return legendEntries(data, sketchLayout(data, undefined, count).players).map(
    (entry) => entry.kind,
  );
}

describe('teckenförklaringen visar bara typerna i skissen', () => {
  it('passa och följ: spelare i lag A, kon, boll, ruta, passning och löpning', () => {
    expect(kinds(SJU_MOT_SJU)).toEqual(['lag-a', 'kon', 'boll', 'ruta', 'passning', 'lopning']);
  });

  it('ett mot ett: lag A, lag B, målvakt, boll, mål, ruta och tre rörelsetyper', () => {
    expect(kinds(FEM_MOT_FEM)).toEqual([
      'lag-a',
      'lag-b',
      'malvakt',
      'boll',
      'mal',
      'ruta',
      'lopning',
      'dribbling',
      'skott',
    ]);
  });

  it('3 mot 3 har ingen målvakt och ingen passning i förklaringen', () => {
    const found = kinds(TRE_MOT_TRE);
    expect(found).not.toContain('malvakt');
    expect(found).not.toContain('passning');
  });

  it('11 mot 11 förklarar varje objekt- och rörelsetyp som skissen använder', () => {
    expect(kinds(ELVA_MOT_ELVA)).toEqual([...LEGEND_KINDS]);
  });

  it('räknar med spelare som skalningen lägger till', () => {
    const onlyKeeperAndQueue: PlanskissInput = {
      version: 1,
      omrade: { langd: 20, bredd: 10 },
      objekt: [{ id: 'mv', typ: 'spelare', x: 1, y: 5, lag: 'b', malvakt: true }],
      skalning: { strategi: 'koer', koer: [{ vid: 'mv', riktning: 0 }] },
    };
    expect(kinds(onlyKeeperAndQueue)).toEqual(['malvakt']);
    expect(kinds(onlyKeeperAndQueue, 2)).toEqual(['lag-b', 'malvakt']);
  });

  it('målvaktens rad har målvaktens lag, som avgör symbolens form', () => {
    const data = sketch(FEM_MOT_FEM);
    const entries = legendEntries(data, sketchLayout(data, undefined, undefined).players);
    expect(entries.find((entry) => entry.kind === 'malvakt')?.team).toBe('b');
  });
});

describe('benämningarna', () => {
  it('varje typ har en benämning i ord, och alla benämningar är olika', () => {
    const names = LEGEND_KINDS.map((kind) => LEGEND_NAMES[kind]);
    expect(names.every((name) => name.length > 2)).toBe(true);
    expect(new Set(names).size).toBe(names.length);
  });

  it('skott heter avslut, som i desc och ADR 0012 avsnitt 3', () => {
    expect(LEGEND_NAMES.skott).toBe('Avslut');
  });
});
