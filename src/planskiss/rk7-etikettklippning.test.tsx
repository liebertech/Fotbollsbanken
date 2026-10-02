/**
 * @vitest-environment jsdom
 *
 * RK-7 (docs/sakerhet/granskning-inkrement-2-schema.md): "Etiketter ritas med
 * `unicode-bidi: isolate` och klipps eller kortas vid ytans kant."
 *
 * `fitLabel(text, fontSize, room)` (src/planskiss/symboler.ts) kortar en etikett så att den
 * ryms på `room` meter. För en rektangels etikett (`rectangle()`) är `room` den faktiska
 * återstående bredden från etikettens vänsterkant till ytans högerkant
 * (`labelRoom = drawn.langd + MARGIN - corner.x` i Planskiss.tsx), så klippningen är
 * positionsmedveten. För en rörelseetikett (`movement()` i symboler.tsx) och för de fria
 * texterna i köer och måttexten (`freeText`-anropen i Planskiss.tsx) var `room` tidigare hela
 * bildens bredd, oavsett var etiketten var ankrad (F3). Nu räknas `room` med `roomAt()` från
 * ankarpunkten till bildens kant.
 *
 * Testet skrevs med `it.fails` medan gapet fanns kvar och är nu ett vanligt `it`.
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import type { PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { Planskiss } from './Planskiss.tsx';
import { fitLabel, roomAt } from './symboler.tsx';
import { sketch } from './__testdata__/skisser.ts';

function svgOf(input: PlanskissInput, antalSpelare?: number): SVGSVGElement {
  const { container } = render(
    <Planskiss
      skiss={sketch(input)}
      storlek="normal"
      titel="RK-7"
      instansId="rk7"
      antalSpelare={antalSpelare}
    />,
  );
  const svg = container.querySelector('svg');
  if (svg === null) {
    throw new Error('Ingen svg ritades');
  }
  return svg;
}

/** Varje `<text>` i skissen ligger inom viewBox i x-led, med samma breddmodell som fitLabel. */
function expectTextsInside(svg: SVGSVGElement): void {
  const [minX = 0, , widthUnits = 0] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
  const maxX = minX + widthUnits;
  for (const node of svg.querySelectorAll('text')) {
    const x = Number(node.getAttribute('x'));
    const width =
      Array.from(node.textContent ?? '').length * Number(node.getAttribute('font-size')) * 0.58;
    const anchor = node.getAttribute('text-anchor');
    const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
    const right = anchor === 'middle' ? x + width / 2 : anchor === 'end' ? x : x + width;
    expect(left, `"${node.textContent ?? ''}" börjar utanför viewBox`).toBeGreaterThanOrEqual(minX);
    expect(right, `"${node.textContent ?? ''}" slutar utanför viewBox`).toBeLessThanOrEqual(maxX);
  }
}

describe('RK-7: roomAt och fitLabel', () => {
  const room = { left: -3, right: 23 };

  it('roomAt räknar från ankaret till bildens kant', () => {
    expect(roomAt(room, 0, 'start')).toBe(23);
    expect(roomAt(room, 20, 'end')).toBe(23);
    expect(roomAt(room, 20, 'middle')).toBe(6);
    expect(roomAt(room, 0, 'middle')).toBe(6);
    expect(roomAt(room, 30, 'start')).toBe(0);
  });

  it('fitLabel delar aldrig ett surrogatpar', () => {
    const loneSurrogate = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;
    const text = 'A😀😀😀😀😀😀😀😀😀';
    for (let step = 0; step < 100; step += 1) {
      const fitted = fitLabel(text, 1, step / 10);
      expect(loneSurrogate.test(fitted), `room ${step / 10}: ${fitted}`).toBe(false);
    }
    // 3 m räcker till 5 tecken med teckenstorleken 1: fyra kodpunkter och "…".
    expect(fitLabel('Ab😀😀😀😀😀😀😀😀', 1, 3)).toBe('Ab😀😀…');
  });
});

describe('RK-7: köns etikett och rörelseetiketter nära vänsterkanten', () => {
  it('en köetikett och en rörelseetikett vid vänsterkanten ryms i bilden', () => {
    const svg = svgOf(
      {
        version: 1,
        omrade: { langd: 20, bredd: 10 },
        objekt: [
          { id: 'a', typ: 'spelare', x: 1.5, y: 5, lag: 'a' },
          { id: 'b', typ: 'spelare', x: 1.5, y: 9, lag: 'a' },
        ],
        rorelser: [
          {
            typ: 'lopning',
            fran: { objekt: 'a' },
            till: { objekt: 'b' },
            etikett: 'En lång rörelseetikett',
          },
        ],
        skalning: {
          strategi: 'koer',
          koer: [{ vid: 'a', riktning: 180, etikett: 'En lång köetikett här' }],
        },
      },
      4,
    );
    const texts = [...svg.querySelectorAll('text')].map((node) => node.textContent ?? '');
    // Båda etiketterna ritas, hela eller kortade.
    expect(texts.some((text) => text.startsWith('En lång k'))).toBe(true);
    expect(texts.some((text) => text.startsWith('En lång r'))).toBe(true);
    expectTextsInside(svg);
  });
});

/**
 * En grov uppskattning av en texts bredd i bildenheter, med samma tumregel som `fitLabel`
 * använder för att besluta vad som får plats (symboler.tsx: `fontSize * 0.58` per tecken).
 * Uppskattningen är inte exakt – jsdom har ingen textmätning – men den är samma modell som
 * produktionskoden själv styr efter, så den är rättvis mot koden den prövar.
 */
function estimatedWidthUnits(text: string, fontSizeUnits: number): number {
  return text.length * fontSizeUnits * 0.58;
}

describe('RK-7: en rörelseetikett klipps eller kortas vid ytans kant, inte bara vid bildens totala bredd', () => {
  it('en rörelseetikett centrerad nära högerkanten sticker inte ut genom viewBox', () => {
    const input: PlanskissInput = {
      version: 1,
      omrade: { langd: 20, bredd: 10 },
      objekt: [
        { id: 'a', typ: 'spelare', x: 18, y: 5, lag: 'a' },
        { id: 'b', typ: 'spelare', x: 19.5, y: 5, lag: 'a' },
      ],
      rorelser: [
        {
          typ: 'passning',
          fran: { objekt: 'a' },
          till: { objekt: 'b' },
          // 23 tecken, inom gränsen på 24 (ADR 0012 avsnitt 6).
          etikett: 'En lång rörelseetikett',
        },
      ],
    };
    const { container } = render(
      <Planskiss skiss={sketch(input)} storlek="normal" titel="RK-7" instansId="rk7" />,
    );
    const svg = container.querySelector('svg');
    if (svg === null) {
      throw new Error('Ingen svg ritades');
    }
    const viewBox = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number) as [
      number,
      number,
      number,
      number,
    ];
    const [minX, , widthUnits] = viewBox;
    const maxX = minX + widthUnits;

    // Etiketten får vara hel eller kortad med "…" (RK-7), men ska finnas.
    const full = 'En lång rörelseetikett';
    const label = [...svg.querySelectorAll('text')].find((node) => {
      const shown = node.textContent ?? '';
      return (
        shown === full ||
        (shown.endsWith('…') && shown.length > 1 && full.startsWith(shown.slice(0, -1)))
      );
    });
    if (label === null || label === undefined) {
      throw new Error('Rörelseetiketten ritades inte alls');
    }
    const x = Number(label.getAttribute('x'));
    const fontSizeUnits = Number(label.getAttribute('font-size'));
    const anchor = label.getAttribute('text-anchor');
    const width = estimatedWidthUnits(label.textContent ?? '', fontSizeUnits);
    const right = anchor === 'middle' ? x + width / 2 : anchor === 'end' ? x : x + width;

    expect(
      right,
      `etikettens högerkant (${right}) ska ligga innanför viewBox (${maxX})`,
    ).toBeLessThanOrEqual(maxX);
  });
});
