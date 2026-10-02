/**
 * Skalningen efter antal spelare (ADR 0012 avsnitt 4 och 8, ADR 0018 punkt 4, 5 och 8).
 */
import { describe, expect, it } from 'vitest';
import type { PlanskissInput } from '../regelmotor/schema/planskiss.ts';
import { areaFrame, symbolDiameter } from './matt.ts';
import {
  MAX_PLAYER_SYMBOLS,
  MAX_QUEUE_DRAWN,
  clampCount,
  minQueueSpacing,
  scalePlayers,
} from './skalning.ts';
import type { ScaledPlayers } from './skalning.ts';
import { FEM_MOT_FEM, NIO_MOT_NIO, SJU_MOT_SJU, sketch } from './__testdata__/skisser.ts';

function scaled(input: PlanskissInput, count: number | undefined): ScaledPlayers {
  const data = sketch(input);
  return scalePlayers(data, areaFrame(data, undefined), count);
}

/** En enkel skiss med `base` spelare i lag A i en rad och en given skalning. */
function row(
  base: number,
  skalning: PlanskissInput['skalning'],
  omrade: PlanskissInput['omrade'] = { langd: 60, bredd: 40 },
): PlanskissInput {
  return {
    version: 1,
    omrade,
    objekt: Array.from({ length: base }, (_, index) => ({
      typ: 'spelare' as const,
      id: `sp-${index + 1}`,
      x: 5 + (index % 10) * 5,
      y: 5 + Math.floor(index / 10) * 5,
      lag: 'a' as const,
    })),
    skalning,
  };
}

describe('ADR 0012 avsnitt 4, S-1 och S-2: basskissen', () => {
  it('ett okänt antal ritar basskissen (berättelse 06, kriterium 5)', () => {
    const result = scaled(SJU_MOT_SJU, undefined);
    expect(result).toMatchObject({ baseCount: 5, count: 5, added: [], queues: [], notDrawn: 0 });
  });

  it('ett antal under basantalet ritar basskissen oförändrad', () => {
    expect(scaled(SJU_MOT_SJU, 2)).toMatchObject({ count: 5, added: [] });
  });

  it('ett antal som inte är ett ändligt tal ritar basskissen', () => {
    expect(clampCount(5, Number.NaN)).toBe(5);
    expect(clampCount(5, Number.POSITIVE_INFINITY)).toBe(5);
  });

  it('antalet klamras till basantalet plus 30', () => {
    expect(clampCount(5, 1000)).toBe(35);
    expect(clampCount(5, 7.9)).toBe(7);
  });
});

describe('strategin fast', () => {
  it('lägger aldrig till någon spelare', () => {
    const result = scaled(row(4, { strategi: 'fast' }), 12);
    expect(result.added).toEqual([]);
    // Med fast är basskissen hela övningen, så inget redovisas som saknat.
    expect(result.notDrawn).toBe(0);
  });

  it('en utelämnad skalning betyder fast', () => {
    expect(scaled(row(4, undefined), 9).added).toEqual([]);
  });
});

describe('strategin koer', () => {
  it('fördelar cykliskt i listans ordning: spelare 1 till kö 1, spelare 2 till kö 2', () => {
    const result = scaled(SJU_MOT_SJU, 7);
    // Två extra spelare: en i kön vid sp-2 och en i kön vid sp-3.
    expect(result.queues.map((queue) => queue.index)).toEqual([0, 1]);
    expect(result.added).toHaveLength(2);
  });

  it('placerar den k:te spelaren k × avstand meter från startspelaren i köns riktning', () => {
    // Kön vid anf går uppåt (270°) och kön vid forsv åt vänster (180°), båda med 1,5 m.
    const result = scaled(FEM_MOT_FEM, 3 + 4);
    const up = result.added.filter((added) => added.lag === 'a').map((added) => added.at);
    expect(up).toEqual([
      { x: 0, y: 3 },
      { x: 0, y: 1.5 },
    ]);
    const left = result.added.filter((added) => added.lag === 'b').map((added) => added.at);
    expect(left).toEqual([
      { x: 5.5, y: 9 },
      { x: 4, y: 9 },
    ]);
  });

  it('använder förvalet 1,5 m när avstand saknas', () => {
    const result = scaled(
      row(1, { strategi: 'koer', koer: [{ vid: 'sp-1', riktning: 0 }] }, { langd: 30, bredd: 20 }),
      3,
    );
    expect(result.added.map((added) => added.at)).toEqual([
      { x: 6.5, y: 5 },
      { x: 8, y: 5 },
    ]);
  });

  it('köspelaren ärver lagets startspelare', () => {
    const result = scaled(FEM_MOT_FEM, 5);
    expect(result.added.map((added) => added.lag)).toEqual(['a', 'b']);
  });

  it('ritar högst 8 spelare per kö och räknar resten som dolda', () => {
    const result = scaled(row(1, { strategi: 'koer', koer: [{ vid: 'sp-1', riktning: 90 }] }), 12);
    expect(result.added).toHaveLength(MAX_QUEUE_DRAWN);
    expect(result.queues[0]?.hidden).toBe(3);
  });

  it('en kö utan spelare ritas inte, och då inte heller dess etikett', () => {
    const result = scaled(FEM_MOT_FEM, 4);
    expect(result.queues.map((queue) => queue.index)).toEqual([0]);
  });
});

describe('strategin platser', () => {
  it('fyller platserna i listans ordning', () => {
    const result = scaled(NIO_MOT_NIO, 10);
    expect(result.added).toEqual([
      { at: { x: 20, y: 4 }, lag: 'a' },
      { at: { x: 20, y: 26 }, lag: 'b' },
    ]);
  });

  it('stannar när platserna tar slut och räknar resten som inte ritade', () => {
    const result = scaled(NIO_MOT_NIO, 8 + 7);
    expect(result.added).toHaveLength(4);
    expect(result.notDrawn).toBe(3);
  });

  it('fyller platserna först och köerna därefter, oavsett strategi (ADR 0018 punkt 8)', () => {
    for (const strategi of ['koer', 'platser'] as const) {
      const result = scaled(
        row(2, {
          strategi,
          platser: [{ x: 30, y: 30, lag: 'b' }],
          koer: [{ vid: 'sp-1', riktning: 90 }],
        }),
        5,
      );
      expect(result.added.map((added) => added.lag)).toEqual(['b', 'a', 'a']);
      expect(result.added[0]?.at).toEqual({ x: 30, y: 30 });
    }
  });
});

describe('strategin parallella-ytor', () => {
  it('räknar antalet ytor som ceil(antal / per_yta) och lägger inte till spelare', () => {
    const input = row(4, { strategi: 'parallella-ytor', per_yta: 4 });
    expect(scaled(input, 4).areas).toBe(1);
    expect(scaled(input, 5).areas).toBe(2);
    expect(scaled(input, 8).areas).toBe(2);
    expect(scaled(input, 9).areas).toBe(3);
    expect(scaled(input, 9).added).toEqual([]);
  });

  it('basskissen utan känt antal är en yta', () => {
    expect(scaled(row(4, { strategi: 'parallella-ytor', per_yta: 4 }), undefined).areas).toBe(1);
  });
});

describe('S-5 och RK-6: högst 40 spelarsymboler', () => {
  it('ritar aldrig fler än 40 spelare, basskissen medräknad', () => {
    const koer = Array.from({ length: 6 }, (_, index) => ({
      vid: `sp-${index + 1}`,
      riktning: 90,
      avstand: 0.5,
    }));
    const result = scaled(row(30, { strategi: 'koer', koer }), 60);
    expect(result.baseCount + result.added.length).toBe(MAX_PLAYER_SYMBOLS);
  });
});

describe('ADR 0012 avsnitt 5: symbolstorleken', () => {
  it('D är kortaste sidan / 18 mellan gränserna', () => {
    expect(symbolDiameter({ langd: 50, bredd: 36 })).toBe(2);
  });

  it('D klamras till 1,2 m på en liten yta och 4 m på en stor', () => {
    expect(symbolDiameter({ langd: 15, bredd: 15 })).toBe(1.2);
    expect(symbolDiameter({ langd: 105, bredd: 65 })).toBeCloseTo(65 / 18);
    expect(symbolDiameter({ langd: 120, bredd: 80 })).toBe(4);
  });
});

describe('ADR 0012 avsnitt 1: koordinatomräkning', () => {
  it('räknar om x och y var för sig när övningens yta skiljer sig från omrade', () => {
    const data = sketch(SJU_MOT_SJU);
    const frame = areaFrame(data, { langd: 18, bredd: 16 });
    expect(frame).toMatchObject({ rescaled: true, sx: 1.2 });
    expect(frame.sy).toBeCloseTo(16 / 15);
  });

  it('avstår när sidförhållandet ändras mer än 25 %, men visar den valda ytans mått', () => {
    const data = sketch(SJU_MOT_SJU);
    const frame = areaFrame(data, { langd: 30, bredd: 15 });
    expect(frame).toMatchObject({
      rescaled: false,
      sx: 1,
      sy: 1,
      drawn: { langd: 15, bredd: 15 },
      shown: { langd: 30, bredd: 15 },
    });
  });

  it('en ändring på precis 25 % räknas om', () => {
    const frame = areaFrame(sketch(SJU_MOT_SJU), { langd: 18.75, bredd: 15 });
    expect(frame.rescaled).toBe(true);
  });

  it('köns avstånd är meter på marken och skalas inte med ytan', () => {
    // 4 m är längre än minsta köavståndet på den omskalade ytan (D = 48 / 18).
    const data = sketch(
      row(1, { strategi: 'koer', koer: [{ vid: 'sp-1', riktning: 0, avstand: 4 }] }),
    );
    const frame = areaFrame(data, { langd: 72, bredd: 48 });
    const result = scalePlayers(data, frame, 2);
    expect(result.added[0]?.at.x).toBeCloseTo(5 * 1.2 + 4);
  });
});

describe('fynd A: köspelarna går alltid att skilja åt', () => {
  /** Avståndet mellan två symbolers mittpunkter. */
  function gaps(points: { x: number; y: number }[]): number[] {
    return points.slice(1).map((p, i) => Math.hypot(p.x - points[i]!.x, p.y - points[i]!.y));
  }

  it.each([
    ['a', 0],
    ['a', 45],
    ['b', 0],
    ['b', 45],
    ['neutral', 0],
    ['neutral', 45],
  ] as const)('lag %s i riktningen %i° överlappar aldrig, ens med avstand 0,5', (lag, riktning) => {
    const input: PlanskissInput = {
      version: 1,
      omrade: { langd: 30, bredd: 20 },
      objekt: [{ id: 'start', typ: 'spelare', x: 2, y: 2, lag }],
      skalning: { strategi: 'koer', koer: [{ vid: 'start', riktning, avstand: 0.5 }] },
    };
    const result = scaled(input, 6);
    const d = symbolDiameter(input.omrade);
    const min = minQueueSpacing(lag, riktning, d);
    expect(min).toBeGreaterThan(0.5);
    expect(result.added).toHaveLength(5);
    for (const gap of gaps([{ x: 2, y: 2 }, ...result.added.map((added) => added.at)])) {
      expect(gap).toBeCloseTo(min);
    }
  });

  it('minsta avståndet är symbolens bredd längs riktningen plus 0,2 × D', () => {
    expect(minQueueSpacing('a', 0, 1.2)).toBeCloseTo(1.2 * 1.2);
    expect(minQueueSpacing('b', 0, 1.2)).toBeCloseTo(1.2 * 0.9 + 0.24);
    // Kvadraterna står hörn mot hörn på diagonalen och behöver mer.
    expect(minQueueSpacing('b', 45, 1.2)).toBeCloseTo(1.2 * 0.9 * Math.SQRT2 + 0.24);
    expect(minQueueSpacing('neutral', 0, 1.2)).toBeCloseTo(2 * 1.2 * 0.575 + 0.24);
  });

  it('ett avstand som är längre än minimum används oförändrat', () => {
    const result = scaled(
      row(1, { strategi: 'koer', koer: [{ vid: 'sp-1', riktning: 0, avstand: 5 }] }),
      2,
    );
    expect(result.added[0]?.at).toEqual({ x: 10, y: 5 });
  });

  it('kön stannar vid bildens kant och räknar resten som "+N"', () => {
    // Startspelaren står 1 m från högerkanten. Bilden slutar 3 m utanför ytan.
    const input: PlanskissInput = {
      version: 1,
      omrade: { langd: 10, bredd: 8 },
      objekt: [{ id: 'start', typ: 'spelare', x: 9, y: 4, lag: 'b' }],
      skalning: { strategi: 'koer', koer: [{ vid: 'start', riktning: 0, avstand: 1.5 }] },
    };
    const result = scaled(input, 6);
    const d = symbolDiameter(input.omrade);
    for (const added of result.added) {
      expect(added.at.x + d / 2).toBeLessThanOrEqual(10 + 3);
    }
    expect(result.added).toHaveLength(2);
    expect(result.queues[0]?.hidden).toBe(3);
    expect(result.notDrawn).toBe(0);
  });

  it('en kö där inte ens den första ryms redovisas i texten under skissen', () => {
    const input: PlanskissInput = {
      version: 1,
      omrade: { langd: 10, bredd: 8 },
      objekt: [{ id: 'start', typ: 'spelare', x: 12.5, y: 4, lag: 'a' }],
      skalning: { strategi: 'koer', koer: [{ vid: 'start', riktning: 0 }] },
    };
    const result = scaled(input, 3);
    expect(result.added).toEqual([]);
    expect(result.queues).toEqual([]);
    expect(result.notDrawn).toBe(2);
  });
});
