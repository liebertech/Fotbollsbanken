/**
 * @vitest-environment jsdom
 *
 * Uppföljning av säkerhetsagentens granskning 2026-10-02 av `feature/ritmotor`, utöver
 * `sakerhet.test.tsx` (RK-1 till RK-10). Två fynd gav inga nya RK-nummer men är ändå
 * reproducerbara: en mycket stor SVG vid vågiga dribblingar över en lång, smal yta, och en
 * namnkollision i `instanceId` (src/app/planskiss/Planskissvy.tsx) när övningens id är långt.
 *
 * Testerna nedan är skrivna med `it.fails`: de uttrycker vad som BORDE gälla och misslyckas
 * så länge felen inte är rättade, i stället för att dölja dem bakom en passerande men svag
 * kontroll. Den dagen en rättning gör testet grönt ska `it.fails` bytas mot `it` – det är
 * meningen att testet då ska börja klaga, som en påminnelse om att städa bort markeringen.
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import type { PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { Planskiss } from './Planskiss.tsx';
import { ELVA_MOT_ELVA, sketch } from './__testdata__/skisser.ts';
import { instanceId } from '../app/planskiss/Planskissvy.tsx';

function renderedSize(input: PlanskissInput): number {
  const { container } = render(
    <Planskiss
      skiss={sketch(input)}
      storlek="normal"
      titel="Mätning av SVG-storlek"
      instansId="storlek"
    />,
  );
  const svg = container.querySelector('svg');
  if (svg === null) {
    throw new Error('Ingen svg ritades');
  }
  return new XMLSerializer().serializeToString(svg).length;
}

describe('Stor SVG vid många vågiga dribblingar (säkerhetsagentens uppföljning 2026-10-02)', () => {
  /**
   * 30 dribblingar (taket i PLANSKISS_LIMITS.rorelser) över en lång, smal yta (120 × 5 m, inom
   * ADR 0012 avsnitt 2:s gränser 5–120 × 5–80 m). En smal yta ger den minsta symboldiametern
   * (D = 1,2 m), vilket ger den kortaste vågsteglängden (`waveLine`, D × 0,9 / 8) och därmed
   * flest punkter per meter dribbling. Uppmätt till 368 078 tecken i detta repo (säkerhets-
   * agenten uppmätte 414 kB på ett näraliggande exempel). En skiss i den storleken är tung att
   * hämta på en ledares mobil och tung att lägga i ett utskriftsdokument med flera skisser
   * (ADR 0012 avsnitt 8: "Ett helt pass i utskriftsvyn med flera skisser").
   */
  it.fails(
    'en giltig skiss med 30 vågiga dribblingar håller sig inom en rimlig SVG-storlek',
    () => {
      const narrow: PlanskissInput = {
        version: 1,
        omrade: { langd: 120, bredd: 5 },
        objekt: [{ typ: 'kon', x: 1, y: 1 }],
        rorelser: Array.from({ length: 30 }, () => ({
          typ: 'dribbling' as const,
          fran: { x: 0, y: 0 },
          till: { x: 120, y: 5 },
        })),
      };
      // 50 000 tecken (cirka 50 kB) är en rimlig övre gräns för en enskild skiss: långt över de
      // 8 342 tecken en fullsatt 11 mot 11-skiss (ELVA_MOT_ELVA) mäter, men långt under det som
      // faktiskt ritas här.
      expect(renderedSize(narrow)).toBeLessThan(50_000);
    },
  );

  it('en normal skiss (11 mot 11, alla objekttyper) är liten: referensvärde för gränsen ovan', () => {
    // Inte it.fails: det här ska alltid vara sant, och visar att gränsen på 50 000 tecken
    // ovan inte är orimligt snäv för en vanlig skiss.
    expect(renderedSize(ELVA_MOT_ELVA)).toBeLessThan(50_000);
  });
});

describe('instanceId kan kollidera för två kort med samma långa övnings-id (säkerhetsagentens uppföljning 2026-10-02)', () => {
  /**
   * `instanceId()` i src/app/planskiss/Planskissvy.tsx slår ihop `exercise.id` och `placeKey`
   * med "-" och kortar resultatet till 70 tecken (för att ritmotorns eget suffix, upp till
   * 10 tecken, ska rymmas inom RK-4:s gräns på 80). Är `exercise.id` 64 tecken återstår bara
   * 5 tecken av `placeKey` innan avklippningen. Två olika platser i passet, till exempel
   * "g1-10" och "g1-100", delar då sina första 5 tecken ("g1-10") och får samma instansId.
   *
   * Konsekvens: RK-4 ("Skissens id:n är unika i SVG:n") och ADR 0012 avsnitt 5 ("instansId...
   * som anroparen sätter från övningens id och positionen i passet") bryts. Två skisser i
   * samma pass eller samma utskriftsdokument kan då dela mönster-id:n (<pattern> i <defs>), så
   * att den andra skissens målvaktsrandmönster eller zonmönster visas i den första.
   */
  it.fails(
    'två olika placeKey-värden ger olika instansId, även när övningens id är 64 tecken',
    () => {
      const exerciseId = 'x'.repeat(64);
      const first = instanceId(exerciseId, 'g1-10');
      const second = instanceId(exerciseId, 'g1-100');
      expect(first).not.toBe(second);
    },
  );
});
