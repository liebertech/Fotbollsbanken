/**
 * @vitest-environment jsdom
 *
 * Taken i RK-6 prövas på nytt vid ritning (säkerhetsgranskningen av ritmotorn, R1 och R2).
 *
 * Skissdata som schemat skulle ha underkänt ska inte kunna nå ritmotorn, men om den gör det,
 * genom en regression eller en förfalskning förbi `readPlanskiss`, ska bilden ändå hålla sig
 * inom taken. Testerna förfalskar därför data genom att utgå från en giltig skiss och byta ut
 * fälten, precis som en förfalskning skulle göra.
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import type { Planskissdata } from '../regelmotor/schema/planskiss.ts';
import { Planskiss, sketchLayout } from './Planskiss.tsx';
import { areaFrame } from './matt.ts';
import { MAX_MOVEMENTS, MAX_PLAYER_SYMBOLS, scalePlayers, withinLimits } from './skalning.ts';
import { sketch } from './__testdata__/skisser.ts';

const VALID = sketch({
  version: 1,
  omrade: { langd: 60, bredd: 40 },
  objekt: [{ id: 'a1', typ: 'spelare', x: 5, y: 5, lag: 'a' }],
});

type SketchObject = Planskissdata['objekt'][number];
type Movement = NonNullable<Planskissdata['rorelser']>[number];

function manyPlayers(count: number): SketchObject[] {
  return Array.from({ length: count }, (_, index) => ({
    typ: 'spelare' as const,
    id: `sp-${index + 1}`,
    x: 1 + (index % 10) * 5,
    y: 1 + Math.floor(index / 10) * 5,
    lag: 'a' as const,
  }));
}

function drawn(skiss: Planskissdata, antalSpelare?: number): SVGSVGElement {
  const { container } = render(
    <Planskiss
      skiss={skiss}
      storlek="normal"
      titel="Tak"
      instansId="tak"
      antalSpelare={antalSpelare}
    />,
  );
  const svg = container.querySelector('svg');
  if (svg === null) {
    throw new Error('Ingen svg ritades');
  }
  return svg;
}

function playerSymbols(svg: SVGSVGElement): number {
  return svg.querySelectorAll('[class*="spelare"]').length;
}

describe('R1: taket på 40 spelarsymboler gäller också basskissen', () => {
  const forged: Planskissdata = { ...VALID, objekt: manyPlayers(60) };

  it('60 förfalskade basspelare ritas som högst 40', () => {
    expect(playerSymbols(drawn(forged))).toBe(MAX_PLAYER_SYMBOLS);
  });

  it('spelarna som inte ritas räknas och nämns i beskrivningen', () => {
    const players = scalePlayers(forged, areaFrame(forged, undefined), undefined);
    expect(players.baseCount).toBe(60);
    expect(players.notDrawn).toBe(20);
    expect(drawn(forged).querySelector('desc')?.textContent).toContain(
      '20 spelare till står inte med i skissen.',
    );
  });

  it('köer och platser lägger inte till fler symboler när basskissen redan är full', () => {
    const queued: Planskissdata = {
      ...forged,
      skalning: {
        strategi: 'koer',
        koer: [{ vid: 'sp-1', riktning: 0 }],
      },
    };
    expect(playerSymbols(drawn(queued, 90))).toBe(MAX_PLAYER_SYMBOLS);
  });

  it('en kö vid en spelare som föll över taket ritas inte', () => {
    const queued: Planskissdata = {
      ...forged,
      skalning: { strategi: 'koer', koer: [{ vid: 'sp-60', riktning: 0 }] },
    };
    const players = scalePlayers(queued, areaFrame(queued, undefined), 65);
    expect(players.added).toHaveLength(0);
    expect(players.queues).toHaveLength(0);
    expect(players.notDrawn).toBe(25);
  });

  it('giltig skissdata kommer tillbaka oförändrad', () => {
    expect(withinLimits(VALID)).toBe(VALID);
  });

  it('sketchLayout ger den klamrade skissen, så att teckenförklaringen följer bilden', () => {
    const layout = sketchLayout(forged, undefined, undefined);
    expect(layout.sketch.objekt.filter((item) => item.typ === 'spelare')).toHaveLength(40);
  });
});

describe('R1: per_yta prövas på nytt', () => {
  it.each([0, -3, Number.NaN, Number.POSITIVE_INFINITY])(
    'per_yta %s ger ett ändligt antal ytor',
    (perArea) => {
      const forged: Planskissdata = {
        ...VALID,
        skalning: { strategi: 'parallella-ytor', per_yta: perArea },
      };
      const players = scalePlayers(forged, areaFrame(forged, undefined), 12);
      expect(Number.isFinite(players.areas)).toBe(true);
      expect(players.areas).toBeGreaterThanOrEqual(1);
      expect(drawn(forged, 12).querySelector('desc')?.textContent).not.toContain('Infinity');
    },
  );

  it('per_yta 0 behandlas som 1', () => {
    const forged: Planskissdata = {
      ...VALID,
      skalning: { strategi: 'parallella-ytor', per_yta: 0 },
    };
    expect(scalePlayers(forged, areaFrame(forged, undefined), 12).areas).toBe(12);
  });
});

describe('R1: taken för objekt och rörelser', () => {
  it('fler än 30 förfalskade rörelser ritas som högst 30', () => {
    const rorelser: Movement[] = Array.from({ length: 50 }, (_, index) => ({
      typ: 'passning' as const,
      fran: { x: 1, y: 1 + index * 0.5 },
      till: { x: 50, y: 1 + index * 0.5 },
    }));
    const forged: Planskissdata = { ...VALID, rorelser };
    expect(drawn(forged).querySelectorAll('polygon')).toHaveLength(MAX_MOVEMENTS);
  });

  it('fler än 60 förfalskade objekt ritas som högst 60', () => {
    const objekt: SketchObject[] = Array.from({ length: 100 }, (_, index) => ({
      typ: 'kon' as const,
      x: 1 + (index % 10) * 5,
      y: 1 + Math.floor(index / 10) * 3,
    }));
    const forged: Planskissdata = { ...VALID, objekt };
    expect(drawn(forged).querySelectorAll('polygon')).toHaveLength(60);
  });
});
