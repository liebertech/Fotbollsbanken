/**
 * @vitest-environment jsdom
 *
 * Det ritade resultatet av skalningen och detaljnivån (ADR 0012 avsnitt 4, 5 och 8,
 * ADR 0018 punkt 4 och 5): målvakter vid skalning (S-7), udda antal, köns etikett och
 * överskott, miniatyrens detaljnivå och målens bredd per spelform.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { GameFormat } from '../regelmotor/keys.ts';
import type { PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { Planskiss } from './Planskiss.tsx';
import type { PlanskissStorlek } from './Planskiss.tsx';
import { GOAL_WIDTHS } from './matt.ts';
import { sketch } from './__testdata__/skisser.ts';

afterEach(cleanup);

function draw(
  input: PlanskissInput,
  antal?: number,
  storlek: PlanskissStorlek = 'normal',
  spelform?: GameFormat,
) {
  const { container } = render(
    <Planskiss
      skiss={sketch(input)}
      antalSpelare={antal}
      storlek={storlek}
      spelform={spelform}
      titel="Övning"
      instansId="ritning"
    />,
  );
  const svg = container.querySelector('svg');
  if (svg === null) {
    throw new Error('Ingen svg');
  }
  return svg;
}

/** Spelarsymboler: cirklar, kvadrater och romber med en spelarklass. */
function players(svg: Element): Element[] {
  return [...svg.querySelectorAll('[class*="spelare"]')];
}

/** Målvakter är de spelarsymboler som fylls med randmönstret. */
function keepers(svg: Element): number {
  return players(svg).filter((node) => node.getAttribute('fill')?.includes('-malvakt-')).length;
}

function texts(svg: Element): string[] {
  return [...svg.querySelectorAll('text')].map((node) => node.textContent ?? '');
}

/** En avslutsövning där skyttarna köar vid målvakten (exemplet i ADR 0012 avsnitt 4). */
const QUEUE_AT_KEEPER: PlanskissInput = {
  version: 1,
  omrade: { langd: 20, bredd: 15 },
  objekt: [
    { id: 'mv', typ: 'spelare', x: 19, y: 7.5, lag: 'a', malvakt: true },
    { typ: 'spelare', x: 5, y: 7.5, lag: 'b' },
  ],
  skalning: { strategi: 'koer', koer: [{ vid: 'mv', riktning: 90, avstand: 1.5 }] },
};

describe('S-7: en tillagd spelare är aldrig målvakt', () => {
  it.each([2, 3, 6, 12, 40])('koer från en målvakt, %i spelare: en målvakt', (antal) => {
    const svg = draw(QUEUE_AT_KEEPER, antal);
    expect(keepers(svg)).toBe(1);
    expect(players(svg)).toHaveLength(Math.min(antal, 2 + 8));
  });

  it('platser: en målvakt oavsett antal', () => {
    const places: PlanskissInput = {
      ...QUEUE_AT_KEEPER,
      skalning: {
        strategi: 'platser',
        platser: [
          { x: 10, y: 3, lag: 'a' },
          { x: 10, y: 12, lag: 'b' },
        ],
      },
    };
    expect(keepers(draw(places, 2))).toBe(1);
    expect(keepers(draw(places, 9))).toBe(1);
  });

  it('parallella ytor: basskissens målvakt och inga tillagda spelare', () => {
    const parallel: PlanskissInput = {
      ...QUEUE_AT_KEEPER,
      skalning: { strategi: 'parallella-ytor', per_yta: 2 },
    };
    const svg = draw(parallel, 8);
    expect(keepers(svg)).toBe(1);
    expect(players(svg)).toHaveLength(2);
  });
});

/** Fast storlek med udda antal: den extra spelaren står i en kö med övningens lösning. */
const ODD: PlanskissInput = {
  version: 1,
  omrade: { langd: 12, bredd: 12 },
  objekt: [
    { id: 'a1', typ: 'spelare', x: 0, y: 0, lag: 'a' },
    { typ: 'spelare', x: 12, y: 0, lag: 'a' },
    { typ: 'spelare', x: 12, y: 12, lag: 'a' },
    { typ: 'spelare', x: 0, y: 12, lag: 'a' },
    { typ: 'boll', x: 1, y: 1 },
  ],
  skalning: {
    strategi: 'koer',
    koer: [{ vid: 'a1', riktning: 270, avstand: 1.5, etikett: 'Rullar in bollar' }],
  },
};

describe('udda antal (ADR 0018 punkt 4)', () => {
  it('den extra spelaren ritas, och köns etikett står en gång', () => {
    const svg = draw(ODD, 5);
    expect(players(svg)).toHaveLength(5);
    expect(texts(svg).filter((text) => text === 'Rullar in bollar')).toHaveLength(1);
  });

  it('med två extra spelare står etiketten fortfarande en gång', () => {
    const svg = draw(ODD, 6);
    expect(players(svg)).toHaveLength(6);
    expect(texts(svg).filter((text) => text === 'Rullar in bollar')).toHaveLength(1);
  });

  it('köns etikett ritas inte när kön inte har någon spelare', () => {
    expect(texts(draw(ODD, 4))).not.toContain('Rullar in bollar');
    expect(texts(draw(ODD))).not.toContain('Rullar in bollar');
  });

  it('köns etikett utelämnas i miniatyr', () => {
    expect(texts(draw(ODD, 5, 'miniatyr'))).toEqual([]);
  });

  it('en kö längre än 8 ritar 8 spelare och antalet som "+N" vid köns slut', () => {
    const svg = draw(ODD, 4 + 11);
    expect(players(svg)).toHaveLength(4 + 8);
    expect(texts(svg)).toContain('+3');
  });
});

describe('detaljnivån per storlek (ADR 0012 avsnitt 5)', () => {
  const labelled: PlanskissInput = {
    version: 1,
    omrade: { langd: 20, bredd: 10 },
    objekt: [
      { id: 'a', typ: 'spelare', x: 2, y: 5, lag: 'a', etikett: 'A' },
      { typ: 'ruta', x: 0, y: 0, langd: 20, bredd: 10, stil: 'heldragen', etikett: 'Yta' },
    ],
    rorelser: [
      {
        typ: 'passning',
        fran: { objekt: 'a' },
        till: { x: 15, y: 5 },
        ordning: 1,
        etikett: 'Pass',
      },
    ],
  };

  it('miniatyren har inga etiketter, ingen måttext och inga ordningssiffror', () => {
    expect(texts(draw(labelled, undefined, 'miniatyr'))).toEqual([]);
  });

  it.each(['normal', 'planlage', 'utskrift'] as const)('%s har dem', (storlek) => {
    const shown = texts(draw(labelled, undefined, storlek));
    expect(shown).toEqual(expect.arrayContaining(['A', 'Yta', 'Pass', '1', '20 × 10 m']));
  });

  it('planläget ritar kraftigare linjer (D / 6)', () => {
    const width = (storlek: PlanskissStorlek) =>
      Number(
        draw(labelled, undefined, storlek).querySelector('path')?.getAttribute('stroke-width'),
      );
    const normal = width('normal');
    cleanup();
    expect(width('planlage')).toBeCloseTo((normal * 8) / 6, 1);
  });

  it('en lång etikett kortas vid ytans kant (RK-7)', () => {
    const edge: PlanskissInput = {
      version: 1,
      omrade: { langd: 10, bredd: 10 },
      objekt: [
        {
          typ: 'ruta',
          x: 8,
          y: 0,
          langd: 2,
          bredd: 2,
          stil: 'heldragen',
          etikett: 'En mycket lång etikett',
        },
      ],
    };
    const shown = texts(draw(edge)).filter((text) => text.startsWith('En'));
    expect(shown).toHaveLength(1);
    expect(shown[0]?.endsWith('…')).toBe(true);
  });
});

describe('målens bredd (ADR 0012 avsnitt 2)', () => {
  const goal = (storlek: '7mot7' | 'smamal'): PlanskissInput => ({
    version: 1,
    omrade: { langd: 30, bredd: 20 },
    objekt: [{ typ: 'mal', x: 30, y: 10, storlek, riktning: 'vanster' }],
  });

  function goalWidth(svg: Element): number {
    const posts = [...svg.querySelectorAll('circle')].map((node) =>
      Number(node.getAttribute('cy')),
    );
    return Math.abs((posts[1] ?? 0) - (posts[0] ?? 0)) / 10;
  }

  it('ett mål för en spelform ritas i den spelform som skissen visas för', () => {
    expect(goalWidth(draw(goal('7mot7')))).toBe(GOAL_WIDTHS['7mot7']);
    cleanup();
    expect(goalWidth(draw(goal('7mot7'), undefined, 'normal', '5mot5'))).toBe(3);
    cleanup();
    expect(goalWidth(draw(goal('7mot7'), undefined, 'normal', '11mot11'))).toBeCloseTo(7.32);
  });

  it('ett småmål har alltid samma bredd', () => {
    expect(goalWidth(draw(goal('smamal'), undefined, 'normal', '11mot11'))).toBe(1);
  });
});
