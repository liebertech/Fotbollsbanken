/**
 * @vitest-environment jsdom
 *
 * Bollen som ligger på en spelare med etikett flyttas ut till spelarens kant så att etiketten
 * går att läsa (riktning A, UX-fynd 8, 2026-10-12). Testerna bygger på kravet, inte på koden:
 * tröskeln är 0,75 D från spelarens mitt, bollen hamnar på just det avståndet i samma riktning
 * som den låg, och en boll exakt i mitten hamnar snett nedåt höger. Miniatyren, som saknar
 * etiketter, ritar bollen där skissen säger.
 *
 * Yta 36 x 36 m ger `D = 2 m` (kortaste sidan / 18), alltså 20 enheter i bilden, och ingen
 * omskalning eftersom skissen ritas på sin egen yta.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { Planskiss } from './Planskiss.tsx';
import type { PlanskissStorlek } from './Planskiss.tsx';
import { sketch } from './__testdata__/skisser.ts';

afterEach(cleanup);

/** Symbolens diameter i meter för ytan 36 x 36 m. */
const D = 2;
const AREA = { langd: 36, bredd: 36 };

type Item = Record<string, unknown>;

function draw(objekt: Item[], storlek: PlanskissStorlek = 'normal', rorelser: Item[] = []) {
  const input = {
    version: 1,
    omrade: AREA,
    objekt,
    ...(rorelser.length > 0 ? { rorelser } : {}),
  } as unknown as PlanskissInput;
  const { container } = render(
    <Planskiss
      skiss={sketch(input)}
      storlek={storlek}
      titel="Bollflytt"
      instansId="bollflytt"
      antalSpelare={undefined}
    />,
  );
  const svg = container.firstElementChild;
  if (svg === null) {
    throw new Error('Ingen svg ritades');
  }
  return svg;
}

/** Bollens mitt i meter, så som den ritades. */
function ballAt(svg: Element): { x: number; y: number } {
  const circles = svg.querySelectorAll('circle[class*="_boll_"]');
  expect(circles).toHaveLength(1);
  const circle = circles[0] as Element;
  return {
    x: Number(circle.getAttribute('cx')) / 10,
    y: Number(circle.getAttribute('cy')) / 10,
  };
}

const PLAYER = { x: 18, y: 18 };

function withBall(offset: { x: number; y: number }, player: Item = {}): Item[] {
  return [
    { id: 'p', typ: 'spelare', x: PLAYER.x, y: PLAYER.y, lag: 'a', etikett: '7', ...player },
    { id: 'b', typ: 'boll', x: PLAYER.x + offset.x, y: PLAYER.y + offset.y },
  ];
}

function gap(point: { x: number; y: number }): number {
  return Math.hypot(point.x - PLAYER.x, point.y - PLAYER.y);
}

describe('bollen på en spelare med etikett flyttas till 0,75 D', () => {
  it.each([0.1, 0.3, 0.5, 0.74])('en boll %f D från mitten flyttas ut till 0,75 D', (share) => {
    const svg = draw(withBall({ x: share * D, y: 0 }));
    const ball = ballAt(svg);
    expect(gap(ball)).toBeCloseTo(0.75 * D, 1);
    // Samma riktning som bollen låg: rakt åt höger.
    expect(ball.y).toBeCloseTo(PLAYER.y, 1);
    expect(ball.x).toBeGreaterThan(PLAYER.x);
  });

  it('behåller riktningen från spelarens mitt, också åt vänster och uppåt', () => {
    const left = ballAt(draw(withBall({ x: -0.4 * D, y: 0 })));
    expect(left.x).toBeCloseTo(PLAYER.x - 0.75 * D, 1);
    expect(left.y).toBeCloseTo(PLAYER.y, 1);
    cleanup();
    const up = ballAt(draw(withBall({ x: 0, y: -0.4 * D })));
    expect(up.x).toBeCloseTo(PLAYER.x, 1);
    expect(up.y).toBeCloseTo(PLAYER.y - 0.75 * D, 1);
  });

  it('en boll på en diagonal flyttas längs diagonalen', () => {
    const ball = ballAt(draw(withBall({ x: -0.3, y: -0.3 })));
    expect(gap(ball)).toBeCloseTo(0.75 * D, 1);
    expect(ball.x - PLAYER.x).toBeCloseTo(ball.y - PLAYER.y, 1);
    expect(ball.x).toBeLessThan(PLAYER.x);
  });

  it('en boll på tröskeln, 0,75 D, ligger kvar', () => {
    const ball = ballAt(draw(withBall({ x: 0.75 * D, y: 0 })));
    expect(ball.x).toBeCloseTo(PLAYER.x + 0.75 * D, 1);
    expect(ball.y).toBeCloseTo(PLAYER.y, 1);
  });

  it('en boll strax utanför tröskeln, 0,76 D, rörs inte', () => {
    const ball = ballAt(draw(withBall({ x: 0.76 * D, y: 0.1 })));
    expect(ball.x).toBeCloseTo(PLAYER.x + 0.76 * D, 1);
    expect(ball.y).toBeCloseTo(PLAYER.y + 0.1, 1);
  });

  it('en boll långt från spelaren rörs inte', () => {
    const ball = ballAt(draw(withBall({ x: 6, y: -5 })));
    expect(ball).toEqual({ x: PLAYER.x + 6, y: PLAYER.y - 5 });
  });
});

describe('bollen exakt i spelarens mitt', () => {
  it('hamnar snett nedåt höger, vid fötterna, på 0,75 D', () => {
    const ball = ballAt(draw(withBall({ x: 0, y: 0 })));
    const step = (0.75 * D) / Math.SQRT2;
    expect(ball.x).toBeCloseTo(PLAYER.x + step, 1);
    expect(ball.y).toBeCloseTo(PLAYER.y + step, 1);
  });

  it('också i planläget och i utskriften', () => {
    for (const storlek of ['planlage', 'utskrift'] as const) {
      const ball = ballAt(draw(withBall({ x: 0, y: 0 }), storlek));
      expect(ball.x).toBeGreaterThan(PLAYER.x);
      expect(ball.y).toBeGreaterThan(PLAYER.y);
      cleanup();
    }
  });
});

describe('vilka spelare som bollen flyttas från', () => {
  it('en målvakt utan etikett räknas som en spelare med etikett (den ritas med MV-markering)', () => {
    const ball = ballAt(draw(withBall({ x: 0.2, y: 0 }, { etikett: undefined, malvakt: true })));
    expect(gap(ball)).toBeCloseTo(0.75 * D, 1);
  });

  it('en spelare utan etikett och utan målvakt lämnar bollen kvar', () => {
    const ball = ballAt(draw(withBall({ x: 0.2, y: 0.1 }, { etikett: undefined })));
    expect(ball.x).toBeCloseTo(PLAYER.x + 0.2, 1);
    expect(ball.y).toBeCloseTo(PLAYER.y + 0.1, 1);
  });

  it('lag B och neutrala spelare med etikett flyttar också bollen', () => {
    for (const lag of ['b', 'neutral']) {
      const ball = ballAt(draw(withBall({ x: 0.2, y: 0 }, { lag })));
      expect(gap(ball)).toBeCloseTo(0.75 * D, 1);
      cleanup();
    }
  });

  it('flyttar från den närmaste av två spelare med etikett', () => {
    const svg = draw([
      { typ: 'spelare', x: 10, y: 10, lag: 'a', etikett: '1' },
      { typ: 'spelare', x: 11.6, y: 10, lag: 'b', etikett: '2' },
      // 0,4 från den andra och 1,2 från den första: båda är inom 1,5 (0,75 D).
      { typ: 'boll', x: 11.2, y: 10 },
    ]);
    const ball = ballAt(svg);
    // Närmast är spelare 2 (11,6), och bollen ligger till vänster om den.
    expect(Math.hypot(ball.x - 11.6, ball.y - 10)).toBeCloseTo(0.75 * D, 1);
    expect(ball.x).toBeLessThan(11.6);
  });

  it('en spelare med etikett som ligger på en annan än bollen påverkar inte bollen', () => {
    const svg = draw([
      { typ: 'spelare', x: 5, y: 5, lag: 'a', etikett: '1' },
      { typ: 'boll', x: 25, y: 25 },
    ]);
    expect(ballAt(svg)).toEqual({ x: 25, y: 25 });
  });

  it('flera bollar flyttas var för sig', () => {
    const svg = draw([
      { typ: 'spelare', x: 10, y: 10, lag: 'a', etikett: '1' },
      { typ: 'boll', x: 10, y: 10 },
      { typ: 'boll', x: 30, y: 30 },
    ]);
    const circles = [...svg.querySelectorAll('circle[class*="_boll_"]')];
    const centres = circles.map((c) => ({
      x: Number(c.getAttribute('cx')) / 10,
      y: Number(c.getAttribute('cy')) / 10,
    }));
    expect(centres).toHaveLength(2);
    expect(centres.some((c) => c.x === 30 && c.y === 30)).toBe(true);
    expect(centres.some((c) => c.x > 10 && c.y > 10 && c.x < 12)).toBe(true);
  });
});

describe('miniatyren', () => {
  it('ritar bollen där skissen säger, också när den ligger på en spelare med etikett', () => {
    const ball = ballAt(draw(withBall({ x: 0.2, y: 0.1 }), 'miniatyr'));
    expect(ball.x).toBeCloseTo(PLAYER.x + 0.2, 1);
    expect(ball.y).toBeCloseTo(PLAYER.y + 0.1, 1);
  });

  it('ritar en boll i spelarens exakta mitt i mitten', () => {
    expect(ballAt(draw(withBall({ x: 0, y: 0 }), 'miniatyr'))).toEqual(PLAYER);
  });
});

describe('rörelser som pekar på bollen', () => {
  it('börjar vid den flyttade bollen, inte vid spelarens mitt', () => {
    const svg = draw(withBall({ x: 0, y: 0 }), 'normal', [
      { typ: 'skott', fran: { objekt: 'b' }, till: { x: 34, y: 18 }, ordning: 1 },
    ]);
    const ball = ballAt(svg);
    const path = svg.querySelector('path[class*="_rorelse_"]');
    expect(path).not.toBeNull();
    const first = /M\s*([-\d.]+)[ ,]([-\d.]+)/.exec(path?.getAttribute('d') ?? '');
    expect(first).not.toBeNull();
    const start = { x: Number(first?.[1]) / 10, y: Number(first?.[2]) / 10 };
    // Banan kortas vid bollens kant, så den börjar nära den flyttade bollen och tydligt
    // utanför spelaren (0,5 D).
    expect(Math.hypot(start.x - ball.x, start.y - ball.y)).toBeLessThan(0.5 * D);
    expect(gap(start)).toBeGreaterThan(0.5 * D);
  });

  it('en rörelse som pekar på spelaren börjar fortfarande vid spelaren', () => {
    const svg = draw(withBall({ x: 0, y: 0 }), 'normal', [
      { typ: 'lopning', fran: { objekt: 'p' }, till: { x: 4, y: 4 }, ordning: 1 },
    ]);
    const path = svg.querySelector('path[class*="_rorelse_"]');
    const first = /M\s*([-\d.]+)[ ,]([-\d.]+)/.exec(path?.getAttribute('d') ?? '');
    const start = { x: Number(first?.[1]) / 10, y: Number(first?.[2]) / 10 };
    expect(gap(start)).toBeLessThan(0.75 * D);
  });
});
