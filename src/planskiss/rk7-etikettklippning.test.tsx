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
 * texterna i köer och måttexten (`freeText`-anropen i Planskiss.tsx) är `room` i stället
 * `room.width`, alltså hela bildens bredd – oavsett var etiketten faktiskt är ankrad. En
 * etikett som är centrerad långt till höger i bilden kan då "rymmas" enligt budgeten men ändå
 * sticka ut genom bildens högerkant, eftersom budgeten räknas från bildens vänsterkant och
 * inte från etikettens egen position.
 *
 * Testet nedan är skrivet med `it.fails`: det uttrycker vad RK-7 kräver (etiketten ligger inom
 * `viewBox`) och misslyckas så länge gapet finns kvar.
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import type { PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { Planskiss } from './Planskiss.tsx';
import { sketch } from './__testdata__/skisser.ts';

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
  it.fails('en rörelseetikett centrerad nära högerkanten sticker inte ut genom viewBox', () => {
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

    const label = [...svg.querySelectorAll('text')].find(
      (node) => node.textContent === 'En lång rörelseetikett',
    );
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
