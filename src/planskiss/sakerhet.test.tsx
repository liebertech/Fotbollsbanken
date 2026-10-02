/**
 * @vitest-environment jsdom
 *
 * RK-10 i docs/sakerhet/granskning-inkrement-2-schema.md, som är kriterium 10 i berättelse 06:
 *
 * 1. XSS-nyttolaster i `beskrivning`, i etiketterna och i övningens namn blir text och aldrig
 *    markup.
 * 2. Ett körtest som prövar varje renderat element och attribut mot en vitlista, och att inget
 *    attributvärde innehåller skissens text (RK-2, RK-3, RK-4, RK-5, F7, F9).
 * 3. En fuzz-slinga som visar att `readPlanskiss` aldrig kastar, och att allt som den godkänner
 *    ritas utan fel och inom vitlistan.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { planskissTexts, readPlanskiss } from '../regelmotor/schema/planskiss.ts';
import type { Planskissdata, PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { Planskiss } from './Planskiss.tsx';
import type { PlanskissStorlek } from './Planskiss.tsx';
import { Teckensymbol } from './Teckensymbol.tsx';
import { LEGEND_KINDS } from './teckenforklaring.ts';
import { ALLOWED_SVG_ATTRIBUTES, ALLOWED_SVG_ELEMENTS } from './vitlista.ts';
import { ELVA_MOT_ELVA, PER_SPELFORM, sketch } from './__testdata__/skisser.ts';

afterEach(cleanup);

/** Den slutna elementlistan i ADR 0012 avsnitt 6. */
const ALLOWED_TAGS = new Set([
  'svg',
  'title',
  'desc',
  'defs',
  'pattern',
  'g',
  'rect',
  'circle',
  'polygon',
  'line',
  'path',
  'text',
  'tspan',
]);

/** Alla attribut som ritmotorn sätter. Ett nytt attribut ska läggas till här medvetet. */
const ALLOWED_ATTRIBUTES = new Set([
  'class',
  'viewBox',
  'role',
  'aria-labelledby',
  'aria-hidden',
  'id',
  'x',
  'y',
  'width',
  'height',
  'cx',
  'cy',
  'r',
  'x1',
  'y1',
  'x2',
  'y2',
  'points',
  'd',
  'fill',
  'stroke-width',
  'stroke-dasharray',
  'font-size',
  'text-anchor',
  'dominant-baseline',
  'patternUnits',
]);

const numberPattern = String.raw`-?\d+(?:\.\d+)?`;
/** Formen på varje attributvärde. Inget värde får vara fri text (RK-2, RK-3). */
const VALUE_PATTERNS: Record<string, RegExp> = {
  x: new RegExp(`^${numberPattern}$`),
  y: new RegExp(`^${numberPattern}$`),
  width: new RegExp(`^${numberPattern}$`),
  height: new RegExp(`^${numberPattern}$`),
  cx: new RegExp(`^${numberPattern}$`),
  cy: new RegExp(`^${numberPattern}$`),
  r: new RegExp(`^${numberPattern}$`),
  x1: new RegExp(`^${numberPattern}$`),
  y1: new RegExp(`^${numberPattern}$`),
  x2: new RegExp(`^${numberPattern}$`),
  y2: new RegExp(`^${numberPattern}$`),
  'stroke-width': new RegExp(`^${numberPattern}$`),
  'font-size': new RegExp(`^${numberPattern}$`),
  'stroke-dasharray': new RegExp(`^${numberPattern}( ${numberPattern})*$`),
  viewBox: new RegExp(`^${numberPattern} ${numberPattern} ${numberPattern} ${numberPattern}$`),
  points: new RegExp(`^${numberPattern},${numberPattern}( ${numberPattern},${numberPattern})*$`),
  d: new RegExp(`^M${numberPattern} ${numberPattern}( L${numberPattern} ${numberPattern})*$`),
  role: /^img$/,
  'aria-hidden': /^true$/,
  'text-anchor': /^(start|middle|end)$/,
  'dominant-baseline': /^(central|hanging)$/,
  patternUnits: /^userSpaceOnUse$/,
  class: /^[A-Za-z0-9_ -]*$/,
};

/**
 * Prövar varje element och attribut under `root` mot vitlistorna, och att inget attributvärde
 * innehåller någon av `texts`. Returnerar antalet prövade attribut.
 */
function assertWhitelisted(root: Element, instanceId: string, texts: readonly string[]): number {
  const idPattern = new RegExp(`^${instanceId}-[a-z0-9-]+$`);
  const fillPattern = new RegExp(`^url\\(#${instanceId}-[a-z0-9-]+\\)$`);
  let checked = 0;
  for (const element of [root, ...root.querySelectorAll('*')]) {
    expect(ALLOWED_TAGS, `element ${element.tagName}`).toContain(element.tagName);
    for (const attribute of element.attributes) {
      checked += 1;
      const { name, value } = attribute;
      expect(ALLOWED_ATTRIBUTES, `attribut ${name} på ${element.tagName}`).toContain(name);
      if (name === 'id') {
        expect(value).toMatch(idPattern);
      } else if (name === 'aria-labelledby') {
        for (const id of value.split(' ')) {
          expect(id).toMatch(idPattern);
        }
      } else if (name === 'fill') {
        expect(value).toMatch(fillPattern);
      } else {
        const pattern = VALUE_PATTERNS[name];
        expect(pattern, `mönster för ${name}`).toBeDefined();
        expect(value, `${name} på ${element.tagName}`).toMatch(pattern ?? /^$/);
      }
      for (const text of texts) {
        expect(value.includes(text), `skisstext "${text}" i attributet ${name}`).toBe(false);
      }
    }
  }
  return checked;
}

function draw(
  data: Planskissdata,
  options: {
    storlek?: PlanskissStorlek;
    antal?: number;
    titel?: string;
    id?: string;
    yta?: { langd: number; bredd: number };
  } = {},
): SVGSVGElement {
  const { container } = render(
    <Planskiss
      skiss={data}
      storlek={options.storlek ?? 'normal'}
      titel={options.titel ?? 'Övning'}
      instansId={options.id ?? 'rk-10'}
      antalSpelare={options.antal}
      yta={options.yta}
      spelform="7mot7"
    />,
  );
  const svg = container.querySelector('svg');
  if (svg === null) {
    throw new Error('Ingen svg ritades');
  }
  return svg;
}

const XSS_DESCRIPTIONS = [
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "' onload='alert(1)",
  '</desc><script>alert(document.cookie)</script>',
  '<svg onload=alert(1)><foreignObject><iframe src=javascript:alert(1)>',
  '&lt;b&gt; &amp; &#60;script&#62;',
  '{{constructor.constructor("alert(1)")()}}',
  '<![CDATA[<script>alert(1)</script>]]>',
  'javascript:alert(1) url(#x) expression(alert(1))',
];

/** Långa etiketter som ser ut som URL:er och CSS (F7). De är giltiga enligt schemat. */
const XSS_LABELS = [
  'javascript:alert(1)',
  'url(javascript:alert(1))',
  'http://x.se/a',
  'expression(alert(1))',
  'data:text/html,a',
  'Kalle, Lisa (ÖÄ)',
];

function xssSketch(description: string, label: string): PlanskissInput {
  return {
    version: 1,
    omrade: { langd: 30, bredd: 20 },
    beskrivning: description,
    objekt: [
      { typ: 'zon', x: 0, y: 0, langd: 10, bredd: 20, monster: 'diagonal', etikett: label },
      { typ: 'ruta', x: 10, y: 0, langd: 20, bredd: 20, stil: 'streckad', etikett: label },
      { id: 'sp', typ: 'spelare', x: 5, y: 5, lag: 'a', etikett: 'ÅÄÖ' },
      { typ: 'spelare', x: 25, y: 5, lag: 'b', malvakt: true, etikett: 'QZ9' },
      { typ: 'ledare', x: 15, y: 21, etikett: 'LXQ' },
      { id: 'mal', typ: 'mal', x: 30, y: 10, storlek: 'eget', bredd: 3, riktning: 'vanster' },
    ],
    rorelser: [
      { typ: 'passning', fran: { objekt: 'sp' }, till: { x: 20, y: 10 }, etikett: label },
      { typ: 'skott', fran: { x: 20, y: 10 }, till: { objekt: 'mal' }, ordning: 1 },
    ],
    skalning: { strategi: 'koer', koer: [{ vid: 'sp', riktning: 90, etikett: label }] },
  };
}

describe('RK-10: XSS-nyttolaster blir text, aldrig markup', () => {
  it.each(XSS_DESCRIPTIONS)('beskrivning %s står ordagrant i desc', (payload) => {
    const data = sketch(xssSketch(payload, 'Zon'));
    const svg = draw(data, { antal: 3 });
    expect(svg.querySelector('desc')?.textContent).toBe(payload);
    expect(svg.querySelectorAll('script, img, iframe, foreignObject, a, style')).toHaveLength(0);
    expect(new XMLSerializer().serializeToString(svg)).not.toMatch(
      /<(script|img|iframe|foreignobject|svg[^>]*onload)/i,
    );
    assertWhitelisted(svg, 'rk-10', [payload]);
  });

  it.each(XSS_LABELS)('etiketten %s ritas som text och aldrig i ett attribut', (label) => {
    const data = sketch(xssSketch('Beskrivning', label));
    const svg = draw(data, { antal: 3 });
    const shown = [...svg.querySelectorAll('text')].map((node) => node.textContent);
    // Zonen, rutan, rörelsen och kön: minst en av dem ryms oförkortad.
    expect(shown).toContain(label);
    assertWhitelisted(
      svg,
      'rk-10',
      planskissTexts(data).map((entry) => entry.text),
    );
  });

  it('övningens namn med markup blir text i title', () => {
    const name = '<img src=x onerror=alert(1)> "Passa"';
    const svg = draw(sketch(xssSketch('Beskrivning', 'Zon')), { titel: name });
    expect(svg.querySelector('title')?.textContent).toBe(`${name}, planskiss`);
    expect(svg.querySelectorAll('img')).toHaveLength(0);
    assertWhitelisted(svg, 'rk-10', [name]);
  });

  it('ritmotorn returnerar ett React-element, aldrig en sträng', () => {
    const element = Planskiss({
      skiss: sketch(ELVA_MOT_ELVA),
      storlek: 'normal',
      titel: 'Övning',
      instansId: 'rk-10',
    });
    expect(typeof element).toBe('object');
    expect(element.type).toBe('svg');
  });
});

describe('RK-10: elementen och attributen i varje ritad skiss följer vitlistan', () => {
  const sizes: PlanskissStorlek[] = ['miniatyr', 'normal', 'planlage', 'utskrift'];

  it.each(Object.entries(PER_SPELFORM))('%s i alla storlekar och antal', (_, input) => {
    const data = sketch(input);
    const texts = planskissTexts(data)
      .map((entry) => entry.text)
      // En etikett på ett eller två tecken, som "1" eller "MV", finns också i tal och
      // klassnamn. De långa texterna och etiketterna med tre tecken prövas.
      .filter((text) => text.length >= 3);
    let checked = 0;
    for (const storlek of sizes) {
      for (const antal of [undefined, 1, 9, 50]) {
        checked += assertWhitelisted(draw(data, { storlek, antal }), 'rk-10', texts);
        cleanup();
      }
    }
    expect(checked).toBeGreaterThan(100);
  });

  it('teckenförklaringens symboler följer samma vitlista', () => {
    for (const kind of LEGEND_KINDS) {
      const { container } = render(<Teckensymbol kind={kind} instansId="rk-10" />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      if (svg !== null) {
        assertWhitelisted(svg, 'rk-10', []);
      }
      cleanup();
    }
  });
});

/** Ett litet, seedat slumptal (mulberry32), så att fuzz-slingan är reproducerbar. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEIRD_VALUES: unknown[] = [
  null,
  undefined,
  0,
  -0,
  -3.05,
  1e308,
  Number.NaN,
  Number.POSITIVE_INFINITY,
  '',
  'a',
  '<script>alert(1)</script>',
  'javascript:alert(1)',
  '‮',
  'x'.repeat(400),
  true,
  [],
  [1, 2, 3],
  {},
  { toString: 1 },
  { __proto__: { typ: 'spelare' } },
  JSON.parse('{"__proto__": {"x": 1}}'),
  { constructor: { prototype: 1 } },
];

function pick<T>(next: () => number, list: readonly T[]): T {
  return list[Math.floor(next() * list.length)] as T;
}

/** Byter ut ett slumpvis valt värde någonstans i strukturen. */
function mutate(value: unknown, next: () => number, depth = 0): unknown {
  if (Array.isArray(value)) {
    const list: readonly unknown[] = value;
    if (list.length === 0 || next() < 0.1) {
      return next() < 0.5 ? [...list, pick(next, WEIRD_VALUES)] : list.slice(1);
    }
    const index = Math.floor(next() * list.length);
    return list.map((item, at) => (at === index ? mutate(item, next, depth + 1) : item));
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value);
    if (entries.length === 0 || next() < 0.1 || depth > 6) {
      return pick(next, WEIRD_VALUES);
    }
    const [key] = pick(next, entries);
    return { ...value, [key]: mutate((value as Record<string, unknown>)[key], next, depth + 1) };
  }
  if (typeof value === 'number' && next() < 0.7) {
    // Små ändringar håller skissen giltig ofta nog för att ritmotorn också ska prövas.
    return Math.round((value + (next() - 0.5) * 20) * 10) / 10;
  }
  return pick(next, WEIRD_VALUES);
}

/** En Proxy som kastar vid varje åtkomst, som konstruerad indata ur databasen (F1). */
const THROWING = new Proxy(
  {},
  {
    get() {
      throw new Error('fientlig');
    },
    ownKeys() {
      throw new Error('fientlig');
    },
    getOwnPropertyDescriptor() {
      throw new Error('fientlig');
    },
  },
);

describe('RK-10: fuzz-slinga', () => {
  it(// Kvalitetssäkring 2026-10-02: slingan tog 12,3 s och föll en gång på vitest-förvalet
  // 15 s (vite.config.ts testTimeout) när sviten kördes parallellt med resten. 800 ritade
  // skisser är tidskrävande men inte ett fel i sig, så fixet är en egen, generös tidsgräns
  // för just det här testet i stället för färre varv (det skulle försvaga täckningen).
  'readPlanskiss kastar aldrig, och det som godkänns ritas utan fel inom vitlistan', () => {
    const next = random(20260929);
    const sources = Object.values(PER_SPELFORM);
    let valid = 0;
    let invalid = 0;
    for (let round = 0; round < 800; round += 1) {
      let candidate: unknown = pick(next, sources);
      const mutations = 1 + Math.floor(next() * 3);
      for (let step = 0; step < mutations; step += 1) {
        candidate = mutate(candidate, next);
      }
      let result: ReturnType<typeof readPlanskiss> | undefined;
      expect(() => {
        result = readPlanskiss(candidate);
      }).not.toThrow();
      if (result?.status === 'giltig') {
        valid += 1;
        const antal = Math.floor(next() * 60) - 5;
        const storlek = pick(next, ['miniatyr', 'normal'] as const);
        const svg = draw(result.skiss, { storlek, antal, id: `fuzz-${round}` });
        assertWhitelisted(
          svg,
          `fuzz-${round}`,
          planskissTexts(result.skiss)
            .map((entry) => entry.text)
            .filter((text) => text.length >= 3),
        );
        cleanup();
      } else {
        invalid += 1;
      }
    }
    // Slingan ska pröva båda vägarna.
    expect(valid).toBeGreaterThan(40);
    expect(invalid).toBeGreaterThan(50);
  }, 30_000);

  it('fientlig indata ger ogiltig, aldrig ett undantag', () => {
    const cyclic: Record<string, unknown> = { version: 1 };
    cyclic.self = cyclic;
    for (const value of [
      THROWING,
      { ...sketch(ELVA_MOT_ELVA), objekt: THROWING },
      { version: 1, omrade: THROWING, objekt: [] },
      cyclic,
      Symbol('x'),
      () => 1,
      10n,
    ]) {
      expect(readPlanskiss(value).status).toBe('ogiltig');
    }
  });
});

describe('Lintningens vitlistor stämmer med körtestets (R4)', () => {
  it('elementen i src/planskiss/vitlista.ts är ALLOWED_TAGS', () => {
    expect(new Set(ALLOWED_SVG_ELEMENTS)).toEqual(ALLOWED_TAGS);
  });

  it('attributen i src/planskiss/vitlista.ts är ALLOWED_ATTRIBUTES, med namnen i DOM:en', () => {
    const domNames = Object.values(ALLOWED_SVG_ATTRIBUTES).filter(
      (name): name is string => name !== null,
    );
    expect(new Set(domNames)).toEqual(ALLOWED_ATTRIBUTES);
    // Bara key, som React tar hand om, saknar ett namn i DOM:en.
    expect(
      Object.entries(ALLOWED_SVG_ATTRIBUTES)
        .filter(([, name]) => name === null)
        .map(([jsx]) => jsx),
    ).toEqual(['key']);
  });
});
