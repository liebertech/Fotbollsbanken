/**
 * @vitest-environment jsdom
 *
 * Tillgänglighet (berättelse 06 kriterium 8, ADR 0012 avsnitt 5, texter.md avsnitt 8):
 * `role="img"`, `<title>`, `<desc>` och `aria-labelledby`, med id:n prefixade av `instansId`.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { Planskiss } from './Planskiss.tsx';
import {
  ELVA_MOT_ELVA,
  FEM_MOT_FEM,
  NIO_MOT_NIO,
  SJU_MOT_SJU,
  TRE_MOT_TRE,
  sketch,
} from './__testdata__/skisser.ts';

afterEach(cleanup);

function draw(
  input: PlanskissInput,
  options: { antal?: number; yta?: { langd: number; bredd: number }; id?: string } = {},
) {
  const { container } = render(
    <Planskiss
      skiss={sketch(input)}
      storlek="normal"
      titel="Övningen"
      instansId={options.id ?? 'ovning-1'}
      antalSpelare={options.antal}
      yta={options.yta}
    />,
  );
  const svg = container.querySelector('svg');
  if (svg === null) {
    throw new Error('Ingen svg');
  }
  return svg;
}

function desc(input: PlanskissInput, options?: Parameters<typeof draw>[1]): string {
  return draw(input, options).querySelector('desc')?.textContent ?? '';
}

/** En skiss utan beskrivning, så att sammanfattningen genereras. */
function withoutDescription(input: PlanskissInput): PlanskissInput {
  const copy = { ...input };
  delete copy.beskrivning;
  return copy;
}

describe('title, desc och aria-labelledby', () => {
  it('SVG:n är en bild med title och desc som tillgängligt namn', () => {
    const svg = draw(SJU_MOT_SJU);
    expect(svg.getAttribute('role')).toBe('img');
    const ids = (svg.getAttribute('aria-labelledby') ?? '').split(' ');
    expect(ids).toEqual(['ovning-1-titel', 'ovning-1-beskrivning']);
    expect(svg.querySelector(`[id="${ids[0] ?? ''}"]`)?.tagName).toBe('title');
    expect(svg.querySelector(`[id="${ids[1] ?? ''}"]`)?.tagName).toBe('desc');
  });

  it('title är "{övningsnamn}, planskiss"', () => {
    expect(draw(SJU_MOT_SJU).querySelector('title')?.textContent).toBe('Övningen, planskiss');
  });

  it('varje id i SVG:n börjar med instansId (RK-4)', () => {
    const svg = draw(ELVA_MOT_ELVA, { id: 'pass-7-rad-2' });
    const ids = [...svg.querySelectorAll('[id]')].map((element) => element.id);
    expect(ids.length).toBeGreaterThan(4);
    for (const id of ids) {
      expect(id.startsWith('pass-7-rad-2-')).toBe(true);
    }
  });

  it('skissens egna id:n blir aldrig DOM-id:n (RK-4)', () => {
    const svg = draw(FEM_MOT_FEM);
    for (const own of ['mal-1', 'anf', 'forsv']) {
      expect(svg.querySelector(`[id="${own}"]`)).toBeNull();
    }
  });

  it('ett ogiltigt instansId ritas aldrig', () => {
    expect(() => draw(SJU_MOT_SJU, { id: 'x" onload="alert(1)' })).toThrow(/instansId/);
    expect(() => draw(SJU_MOT_SJU, { id: 'Stor' })).toThrow(/instansId/);
    expect(() => draw(SJU_MOT_SJU, { id: 'a'.repeat(81) })).toThrow(/instansId/);
  });
});

describe('desc enligt mallen i texter.md avsnitt 8', () => {
  it('skissens beskrivning står ordagrant och utan tillägg', () => {
    expect(desc(FEM_MOT_FEM)).toBe(sketch(FEM_MOT_FEM).beskrivning);
  });

  it('passa och följ: yta, spelare och rörelser, med "gånger" i stället för ×', () => {
    expect(desc(SJU_MOT_SJU)).toBe(
      'Yta 15 gånger 15 meter. 5 spelare i lag A. 2 passningar och 1 löpning.',
    );
  });

  it('räknar tillagda spelare som utespelare', () => {
    expect(desc(SJU_MOT_SJU, { antal: 7 })).toBe(
      'Yta 15 gånger 15 meter. 7 spelare i lag A. 2 passningar och 1 löpning.',
    );
  });

  it('två lag med målvakter, mål och alla rörelsetyper i ADR:ns ordning', () => {
    expect(desc(NIO_MOT_NIO)).toBe(
      'Yta 40 gånger 30 meter. 3 spelare i lag A, 3 i lag B, 2 målvakter. 2 mål. 2 passningar, 1 löpning och 1 avslut.',
    );
    expect(desc(withoutDescription(FEM_MOT_FEM))).toBe(
      'Yta 15 gånger 9 meter. 1 spelare i lag A, 1 i lag B, 1 målvakt. 1 mål. 1 löpning, 1 dribbling och 1 avslut.',
    );
  });

  it('neutrala spelare räknas för sig', () => {
    expect(desc(ELVA_MOT_ELVA)).toMatch(
      /^Yta 52 gånger 68 meter\. 2 spelare i lag A, 1 i lag B, 1 neutral, 1 målvakt\. 2 mål\./,
    );
    expect(desc(ELVA_MOT_ELVA, { antal: 7 })).toMatch(/1 i lag B, 3 neutrala, 1 målvakt\./);
  });

  it('utan spelare står ytan som en egen mening', () => {
    const cones: PlanskissInput = {
      version: 1,
      omrade: { langd: 20, bredd: 10 },
      objekt: [{ typ: 'kon', x: 1, y: 1 }],
    };
    expect(desc(cones)).toBe('Yta 20 gånger 10 meter.');
  });

  it('en ensam målvakt eller ett ensamt lag B blir en hel mening', () => {
    const keeper: PlanskissInput = {
      version: 1,
      omrade: { langd: 20, bredd: 10 },
      objekt: [
        { typ: 'spelare', x: 1, y: 5, lag: 'a', malvakt: true },
        { typ: 'mal', x: 0, y: 5, storlek: 'smamal', riktning: 'hoger' },
      ],
    };
    expect(desc(keeper)).toBe('Yta 20 gånger 10 meter. 1 målvakt. 1 mål.');
    const teamB = {
      ...keeper,
      objekt: [{ typ: 'spelare' as const, x: 1, y: 5, lag: 'b' as const }],
    };
    expect(desc(teamB)).toBe('Yta 20 gånger 10 meter. 1 spelare i lag B.');
  });

  it('ytans mått är övningens yta för spelformen, med decimalkomma', () => {
    expect(desc(TRE_MOT_TRE, { yta: { langd: 16.5, bredd: 12.5 } })).toMatch(
      /^Yta 16,5 gånger 12,5 meter\./,
    );
  });

  it('parallella ytor läggs till sist, också efter skissens egen beskrivning', () => {
    const parallel = {
      ...FEM_MOT_FEM,
      skalning: { strategi: 'parallella-ytor' as const, per_yta: 3 },
    };
    expect(desc(parallel, { antal: 7 })).toBe(
      `${sketch(FEM_MOT_FEM).beskrivning ?? ''} Så här ser en av 3 ytor ut.`,
    );
    expect(desc(parallel, { antal: 3 })).toBe(sketch(FEM_MOT_FEM).beskrivning);
  });

  it('desc innehåller aldrig tecknet ×', () => {
    for (const input of [TRE_MOT_TRE, SJU_MOT_SJU, NIO_MOT_NIO, ELVA_MOT_ELVA]) {
      expect(desc(input)).not.toContain('×');
    }
  });
});
