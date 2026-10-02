/**
 * @vitest-environment jsdom
 *
 * Etiketternas placering (ux-granskningen av ritmotorn, fynd C och B/F5, etiketter.ts):
 * ingen etikett överlappar en symbol eller en annan etikett, ingen klipps av bildens kant, och
 * måttexten flyttas bara nedåt i nedre vänstra hörnet.
 *
 * Kontrollen av den ritade skissen läser bara SVG:n: symbolernas mått ur deras attribut och
 * etiketternas bredd med samma tumregel som ritmotorn (0,6 × teckenstorleken per tecken).
 * jsdom har ingen textmätning, så kontrollen är en modell, inte en mätning. Skärmbilderna i
 * docs/design/skarmbilder/ritmotor/ visar resultatet i en riktig webbläsare.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { parse as parseYaml } from 'yaml';
import type { GameFormat } from '../regelmotor/keys.ts';
import { readPlanskiss } from '../regelmotor/schema/planskiss.ts';
import type { Planskissdata, PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { Planskiss } from './Planskiss.tsx';
import { layoutLabels, overlaps } from './etiketter.ts';
import type { Box, LabelRequest } from './etiketter.ts';
import {
  PER_SPELFORM,
  SPELARE_VID_MATTEXTEN,
  STATIONER_I_CIRKEL,
  sketch,
} from './__testdata__/skisser.ts';

afterEach(cleanup);

interface Drawn {
  svg: SVGSVGElement;
  bounds: Box;
  symbols: { name: string; box: Box }[];
  labels: { text: string; box: Box }[];
}

/** Klassnamnet ur CSS-modulen, till exempel `spelare` ur `_spelare_a7e2bf`. */
function classNames(element: Element): string[] {
  return (element.getAttribute('class') ?? '')
    .split(' ')
    .map((name) => /^_([A-Za-z]+)_/.exec(name)?.[1] ?? name);
}

const SYMBOL_CLASSES = [
  'spelare',
  'ledare',
  'kon',
  'boll',
  'ordningRing',
  'malStolpe',
  'platta',
  'prick',
];

function elementBox(element: Element): Box | null {
  const n = (name: string) => Number(element.getAttribute(name));
  switch (element.tagName) {
    case 'circle':
      return {
        x0: n('cx') - n('r'),
        y0: n('cy') - n('r'),
        x1: n('cx') + n('r'),
        y1: n('cy') + n('r'),
      };
    case 'rect':
      return { x0: n('x'), y0: n('y'), x1: n('x') + n('width'), y1: n('y') + n('height') };
    case 'polygon': {
      const values = (element.getAttribute('points') ?? '')
        .split(' ')
        .map((pair) => pair.split(',').map(Number) as [number, number]);
      const xs = values.map(([x]) => x);
      const ys = values.map(([, y]) => y);
      return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
    }
    default:
      return null;
  }
}

function overlapping(a: Box, b: Box, tolerance = 0.5): boolean {
  return (
    a.x0 + tolerance < b.x1 &&
    b.x0 + tolerance < a.x1 &&
    a.y0 + tolerance < b.y1 &&
    b.y0 + tolerance < a.y1
  );
}

function draw(
  skiss: Planskissdata,
  antal?: number,
  spelform?: GameFormat,
  yta?: Box | { langd: number; bredd: number },
): Drawn {
  const { container } = render(
    <Planskiss
      skiss={skiss}
      antalSpelare={antal}
      spelform={spelform}
      yta={yta !== undefined && 'langd' in yta ? yta : undefined}
      storlek="normal"
      titel="Etiketter"
      instansId="etiketter"
    />,
  );
  const svg = container.querySelector('svg');
  if (svg === null) {
    throw new Error('Ingen svg ritades');
  }
  const [x, y, w, h] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number) as [
    number,
    number,
    number,
    number,
  ];
  // D i bildenheter, ur ytans mått (ADR 0012 avsnitt 5): ytan är viewBox minus marginalen.
  const d = Math.min(40, Math.max(12, Math.min(w - 60, h - 60) / 18));

  const symbols: Drawn['symbols'] = [];
  for (const element of svg.querySelectorAll('circle, rect, polygon')) {
    const names = classNames(element);
    const box = elementBox(element);
    if (box === null) {
      continue;
    }
    const name = names.find((candidate) => SYMBOL_CLASSES.includes(candidate));
    // En liten ruta, som en station, är en symbol. En stor ruta är en yta.
    const smallRect =
      names.includes('ruta') && box.x1 - box.x0 <= 2 * d && box.y1 - box.y0 <= 2 * d;
    if (name !== undefined || smallRect) {
      symbols.push({ name: name ?? 'ruta', box });
    }
  }

  // Etiketterna är den sista gruppen i SVG:n, där varje barn är en text.
  const groups = [...svg.children].filter((child) => child.tagName === 'g');
  const last = groups[groups.length - 1];
  const labelNodes =
    last !== undefined && [...last.children].every((child) => child.tagName === 'text')
      ? [...last.children]
      : [];
  const labels = labelNodes.map((node) => {
    const text = node.textContent ?? '';
    const size = Number(node.getAttribute('font-size'));
    const width = (Array.from(text).length * 0.6 + 0.25) * size;
    const height = 1.1 * size;
    const cx = Number(node.getAttribute('x'));
    const cy = Number(node.getAttribute('y'));
    expect(node.getAttribute('text-anchor')).toBe('middle');
    return {
      text,
      box: { x0: cx - width / 2, y0: cy - height / 2, x1: cx + width / 2, y1: cy + height / 2 },
    };
  });
  return { svg, bounds: { x0: x, y0: y, x1: x + w, y1: y + h }, symbols, labels };
}

/** Alla krockar i en ritad skiss, som läsbar text, så att ett fel säger vad som krockade. */
function collisions(drawn: Drawn): string[] {
  const found: string[] = [];
  drawn.labels.forEach((label, index) => {
    const { box } = label;
    if (
      box.x0 < drawn.bounds.x0 - 0.01 ||
      box.x1 > drawn.bounds.x1 + 0.01 ||
      box.y0 < drawn.bounds.y0 - 0.01 ||
      box.y1 > drawn.bounds.y1 + 0.01
    ) {
      found.push(`"${label.text}" klipps av bildens kant`);
    }
    for (const symbol of drawn.symbols) {
      if (overlapping(box, symbol.box)) {
        found.push(`"${label.text}" överlappar en symbol (${symbol.name})`);
      }
    }
    for (const other of drawn.labels.slice(index + 1)) {
      if (overlapping(box, other.box)) {
        found.push(`"${label.text}" överlappar "${other.text}"`);
      }
    }
  });
  return found;
}

describe('fynd C: stationer i en cirkel', () => {
  it.each([undefined, 6, 9, 12])('med %s spelare krockar ingen etikett', (antal) => {
    const drawn = draw(sketch(STATIONER_I_CIRKEL), antal);
    expect(collisions(drawn)).toEqual([]);
  });

  it('alla stationsetiketter och rörelseetiketten ritas, hela eller kortade', () => {
    const drawn = draw(sketch(STATIONER_I_CIRKEL), 12);
    const texts = drawn.labels.map((label) => label.text);
    for (let station = 1; station <= 6; station += 1) {
      expect(texts.some((text) => text === `Station ${station}` || text.startsWith('Sta'))).toBe(
        true,
      );
    }
    // Rörelseetiketten klipps aldrig i början: den är hel eller kortad i slutet (fynd C).
    const movement = texts.find((text) => text.startsWith('Al'));
    expect(movement).toBeDefined();
    expect('Alla roterar medurs'.startsWith((movement ?? '').replace(/…$/, ''))).toBe(true);
  });

  it('etiketterna ritas ovanpå symbolerna, i en egen grupp sist i bilden', () => {
    const drawn = draw(sketch(STATIONER_I_CIRKEL), 12);
    expect(drawn.labels.length).toBeGreaterThanOrEqual(7);
  });
});

describe('fynd B/F5: måttexten', () => {
  it('flyttas nedåt när en spelare står i vägen, och står kvar i nedre vänstra hörnet', () => {
    const drawn = draw(sketch(SPELARE_VID_MATTEXTEN));
    const size = drawn.labels.find((label) => label.text === '20 × 12 m');
    expect(size).toBeDefined();
    expect(collisions(drawn)).toEqual([]);
    // Texten börjar vid ytans vänsterkant, x = 0, och står under ytan.
    expect(size?.box.x0 ?? NaN).toBeCloseTo(0, 0);
    expect(size?.box.y0 ?? 0).toBeGreaterThan(120);
  });

  it('står på sin vanliga plats när inget är i vägen', () => {
    const free: PlanskissInput = {
      ...SPELARE_VID_MATTEXTEN,
      objekt: SPELARE_VID_MATTEXTEN.objekt.filter((item) => !('id' in item && item.id === 'a')),
    };
    const moved = draw(sketch(SPELARE_VID_MATTEXTEN)).labels.find((l) => l.text.endsWith(' m'));
    cleanup();
    const normal = draw(sketch(free)).labels.find((l) => l.text.endsWith(' m'));
    expect(normal).toBeDefined();
    expect(moved?.box.y0 ?? 0).toBeGreaterThan(normal?.box.y0 ?? 0);
  });

  it('utelämnas hellre än att överlappa, och flyttas aldrig till ett annat hörn', () => {
    // Spelare längs hela marginalen under ytans vänstra del: ingen plats nedåt.
    const blocked: PlanskissInput = {
      version: 1,
      omrade: { langd: 20, bredd: 12 },
      objekt: [0.6, 1.8, 3, 4.2, 5.4, 6.6, 7.8, 9].flatMap((x) => [
        { typ: 'spelare' as const, x, y: 12.8, lag: 'a' as const },
        { typ: 'spelare' as const, x, y: 14.4, lag: 'a' as const },
      ]),
    };
    const drawn = draw(sketch(blocked));
    expect(drawn.labels.map((label) => label.text)).not.toContain('20 × 12 m');
    expect(collisions(drawn)).toEqual([]);
  });
});

describe('exemplen per spelform och fler spelare', () => {
  it.each(Object.entries(PER_SPELFORM) as [GameFormat, PlanskissInput][])(
    '%s: ingen etikett krockar, från basskissen till 20 spelare',
    (format, input) => {
      for (const antal of [undefined, 8, 12, 20]) {
        const drawn = draw(sketch(input), antal, format);
        expect(collisions(drawn), `${format} med ${String(antal)} spelare`).toEqual([]);
        cleanup();
      }
    },
  );
});

/**
 * Bankens egna skisser, när de finns på grenen. Varje skiss ritas för varje spelform den
 * gäller och för varje gruppstorlek från `spelare.min` till `spelare.max + 1`, så att också
 * den extra spelaren vid udda antal kommer med. Utan skisser i banken prövas ingenting här.
 */
const bankFiles = import.meta.glob<string>('../../content/ovningar/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
});

interface BankSketch {
  id: string;
  skiss: Planskissdata;
  spelformer: GameFormat[];
  yta: Record<string, { langd: number; bredd: number }>;
  spelare: { min: number; max: number };
}

const bankSketches: BankSketch[] = Object.values(bankFiles).flatMap((raw) => {
  const document = parseYaml(raw) as {
    id?: string;
    planskiss?: unknown;
    spelformer?: GameFormat[];
    yta?: Record<string, { langd: number; bredd: number }>;
    spelare?: { min: number; max: number };
  };
  const result = readPlanskiss(document.planskiss);
  if (result.status !== 'giltig' || document.spelare === undefined) {
    return [];
  }
  return [
    {
      id: document.id ?? '?',
      skiss: result.skiss,
      spelformer: document.spelformer ?? [],
      yta: document.yta ?? {},
      spelare: document.spelare,
    },
  ];
});

describe('bankens skisser', () => {
  // Utan skisser i banken finns inget att pröva. Testet står då som överhoppat.
  it.skipIf(bankSketches.length > 0)('banken har inga skisser på den här grenen', () => {
    expect(bankSketches).toEqual([]);
  });

  it.each(bankSketches.map((item) => [item.id, item] as const))(
    '%s: ingen etikett krockar i någon spelform eller gruppstorlek',
    (_id, item) => {
      const found: string[] = [];
      for (const format of item.spelformer) {
        const yta = item.yta[format] ?? item.yta.alla;
        for (let antal = item.spelare.min; antal <= item.spelare.max + 1; antal += 1) {
          const drawn = draw(item.skiss, antal, format, yta);
          found.push(...collisions(drawn).map((text) => `${format}, ${antal} spelare: ${text}`));
          cleanup();
        }
      }
      expect(found).toEqual([]);
    },
  );
});

describe('layoutLabels', () => {
  const bounds: Box = { x0: 0, y0: 0, x1: 20, y1: 10 };
  const request = (overrides: Partial<LabelRequest> = {}): LabelRequest => ({
    text: 'Etikett',
    fontSize: 1,
    at: { x: 10, y: 5 },
    origin: 'center',
    outward: { x: 0, y: -1 },
    mode: 'free',
    ...overrides,
  });

  it('behåller platsen när den är fri', () => {
    const [placed] = layoutLabels([request()], { bounds, obstacles: [], step: 0.25, reach: 6 });
    expect(placed?.at).toEqual({ x: 10, y: 5 });
    expect(placed?.text).toBe('Etikett');
  });

  it('flyttar etiketten utåt när en symbol står i vägen', () => {
    const [placed] = layoutLabels([request()], {
      bounds,
      obstacles: [{ x0: 9, y0: 4, x1: 11, y1: 6 }],
      step: 0.25,
      reach: 6,
    });
    expect(placed).not.toBeNull();
    expect(placed?.at.y ?? 99).toBeLessThan(5);
    expect(placed?.at.x).toBeCloseTo(10);
  });

  it('en etikett som redan står på en plats tar den från nästa', () => {
    const [first, second] = layoutLabels([request(), request({ text: 'Annan' })], {
      bounds,
      obstacles: [],
      step: 0.25,
      reach: 6,
    });
    expect(first?.at).toEqual({ x: 10, y: 5 });
    expect(second?.at).not.toEqual({ x: 10, y: 5 });
  });

  it('kortar etiketten med "…" när den inte ryms hel någonstans', () => {
    const [placed] = layoutLabels(
      [request({ text: 'En mycket lång etikett', at: { x: 5, y: 1 } })],
      { bounds: { x0: 0, y0: 0, x1: 10, y1: 2 }, obstacles: [], step: 0.25, reach: 6 },
    );
    expect(placed?.text.endsWith('…')).toBe(true);
    expect(placed?.box.x1 ?? 99).toBeLessThanOrEqual(10);
  });

  it('utelämnar etiketten när inte ens tre tecken ryms', () => {
    const [placed] = layoutLabels([request({ at: { x: 1, y: 1 } })], {
      bounds: { x0: 0, y0: 0, x1: 1.5, y1: 2 },
      obstacles: [],
      step: 0.25,
      reach: 6,
    });
    expect(placed).toBeNull();
  });

  it('läget down flyttar bara nedåt och kortar aldrig', () => {
    const [placed] = layoutLabels(
      [request({ text: '20 × 12 m', origin: 'topLeft', at: { x: 0, y: 1 }, mode: 'down' })],
      { bounds, obstacles: [{ x0: 0, y0: 0, x1: 3, y1: 3 }], step: 0.25, reach: 6 },
    );
    expect(placed?.text).toBe('20 × 12 m');
    expect(placed?.box.x0).toBeCloseTo(0);
    expect(placed?.box.y0 ?? 0).toBeGreaterThanOrEqual(3);
  });

  it('är deterministisk', () => {
    const options = {
      bounds,
      obstacles: [{ x0: 9, y0: 4, x1: 11, y1: 6 }],
      step: 0.25,
      reach: 6,
    };
    expect(layoutLabels([request(), request()], options)).toEqual(
      layoutLabels([request(), request()], options),
    );
  });

  /**
   * Egna trånga fall (kvalitetssäkringens andra granskning): en liten yta, flera hinder och
   * flera etiketter som alla vill stå på samma ställe. Kontrollen är ett invariant-test, inte
   * hårdkodade positioner: oavsett var `place` landar ska ingen ritad etikett krocka med ett
   * hinder, med en annan etikett, eller hamna utanför bildytan.
   */
  it('trångt fall: fem hinder nära hörnen och sex etiketter som alla vill stå i mitten', () => {
    const tightBounds: Box = { x0: 0, y0: 0, x1: 6, y1: 6 };
    const obstacles: Box[] = [
      { x0: 2.3, y0: 2.3, x1: 3.7, y1: 3.7 },
      { x0: 0.3, y0: 0.3, x1: 1.5, y1: 1.5 },
      { x0: 4.5, y0: 0.3, x1: 5.7, y1: 1.5 },
      { x0: 0.3, y0: 4.5, x1: 1.5, y1: 5.7 },
      { x0: 4.5, y0: 4.5, x1: 5.7, y1: 5.7 },
    ];
    const requests: LabelRequest[] = Array.from({ length: 6 }, (_, index) => ({
      text: `Etikett ${index + 1} som är ganska lång`,
      fontSize: 0.6,
      at: { x: 3, y: 3 },
      origin: 'center',
      outward: {
        x: Math.cos((index / 6) * 2 * Math.PI),
        y: Math.sin((index / 6) * 2 * Math.PI),
      },
      mode: 'free',
    }));
    const placed = layoutLabels(requests, { bounds: tightBounds, obstacles, step: 0.1, reach: 4 });
    const boxes = placed
      .filter((label): label is NonNullable<(typeof placed)[number]> => label !== null)
      .map((label) => label.box);
    // Minst någon etikett ska hitta en plats, annars prövar testet ingenting.
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) {
      expect(box.x0).toBeGreaterThanOrEqual(tightBounds.x0 - 1e-9);
      expect(box.y0).toBeGreaterThanOrEqual(tightBounds.y0 - 1e-9);
      expect(box.x1).toBeLessThanOrEqual(tightBounds.x1 + 1e-9);
      expect(box.y1).toBeLessThanOrEqual(tightBounds.y1 + 1e-9);
      for (const obstacle of obstacles) {
        expect(overlaps(box, obstacle)).toBe(false);
      }
    }
    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        expect(overlaps(boxes[i]!, boxes[j]!)).toBe(false);
      }
    }
  });

  it('down-läget utelämnar måttexten hellre än att den krockar, när hela marginalen är blockerad', () => {
    const [placed] = layoutLabels(
      [
        request({
          text: '20 × 12 m',
          origin: 'topLeft',
          at: { x: 0, y: 8 },
          outward: { x: 0, y: 1 },
          mode: 'down',
        }),
      ],
      {
        bounds,
        // Ett hinder som täcker hela marginalen under startpunkten, ner till bildens kant.
        obstacles: [{ x0: -1, y0: 7, x1: 21, y1: 11 }],
        step: 0.25,
        reach: 6,
      },
    );
    expect(placed).toBeNull();
  });

  it('origin topLeft: en etikett flyttas undan ett hinder utan att krocka eller lämna ytan', () => {
    const smallBounds: Box = { x0: 0, y0: 0, x1: 10, y1: 10 };
    const obstacle: Box = { x0: 0.5, y0: 0.5, x1: 4, y1: 3 };
    const [placed] = layoutLabels(
      [request({ text: 'Zon', origin: 'topLeft', at: { x: 1, y: 1 }, outward: { x: 1, y: 1 } })],
      { bounds: smallBounds, obstacles: [obstacle], step: 0.1, reach: 6 },
    );
    expect(placed).not.toBeNull();
    const box = placed!.box;
    expect(overlaps(box, obstacle)).toBe(false);
    expect(box.x0).toBeGreaterThanOrEqual(smallBounds.x0 - 1e-9);
    expect(box.y0).toBeGreaterThanOrEqual(smallBounds.y0 - 1e-9);
    expect(box.x1).toBeLessThanOrEqual(smallBounds.x1 + 1e-9);
    expect(box.y1).toBeLessThanOrEqual(smallBounds.y1 + 1e-9);
  });
});
