/**
 * Var vattenpauserna ligger (R-037).
 *
 * Kravdelen: en paus ligger mellan två moment, eller i `del-spel` mellan två perioder av
 * samma spel. Aldrig före första momentet och aldrig efter det sista. Undantaget, när
 * pauserna inte får plats, tillåter flera pauser efter varandra och pauser efter det enda
 * momentet.
 *
 * Prioritetsdelen: placeringen ska göra den längsta sammanhängande aktiva tiden så kort som
 * möjligt. När flera placeringar är lika bra väljs den som ligger tidigast i passet
 * (algoritmval enligt R-072, ADR 0011 avsnitt 6).
 */
import type { SessionPartFromBank } from '../keys.ts';

export interface BreakMoment {
  part: SessionPartFromBank;
  minutes: number;
}

export interface BreakPlacement {
  /** Antal pauser omedelbart före momentet med index i. */
  before: number[];
  /** Antal pauser efter sista momentet. Bara undantaget i R-037 ger ett värde över 0. */
  after: number;
  /** Periodindelning av ett spelmoment, när en paus ligger inuti det (R-037). */
  periods: { momentIndex: number; minutes: number[] } | null;
  /** Längsta sammanhängande aktiva tid utan paus, post 11 i R-048. */
  longestStretch: number;
}

/** Delar ett spelmoment i så jämna perioder som möjligt. De längsta perioderna först. */
function splitEvenly(minutes: number, periods: number): number[] {
  const base = Math.floor(minutes / periods);
  const rest = minutes % periods;
  return Array.from({ length: periods }, (_, index) => base + (index < rest ? 1 : 0));
}

/** Alla delmängder av storlek k ur [0, n), i stigande ordning. */
function combinations(n: number, k: number): number[][] {
  if (k === 0) {
    return [[]];
  }
  const result: number[][] = [];
  const current: number[] = [];
  const walk = (start: number): void => {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let index = start; index < n; index += 1) {
      current.push(index);
      walk(index + 1);
      current.pop();
    }
  };
  walk(0);
  return result;
}

function longestStretchOf(segments: number[], boundaries: Set<number>): number {
  let longest = 0;
  let current = 0;
  for (const [index, minutes] of segments.entries()) {
    if (index > 0 && boundaries.has(index)) {
      current = 0;
    }
    current += minutes;
    longest = Math.max(longest, current);
  }
  return longest;
}

/** Jämför två placeringar: färre minuter i den längsta sträckan först, sedan tidigast. */
function better(
  candidate: { stretch: number; positions: number[] },
  best: { stretch: number; positions: number[] } | null,
): boolean {
  if (best === null) {
    return true;
  }
  if (candidate.stretch !== best.stretch) {
    return candidate.stretch < best.stretch;
  }
  for (let index = 0; index < candidate.positions.length; index += 1) {
    const a = candidate.positions[index] ?? 0;
    const b = best.positions[index] ?? 0;
    if (a !== b) {
      return a < b;
    }
  }
  return false;
}

/**
 * Placerar pauserna.
 *
 * @regel R-031
 * @regel R-037
 */
export function placeBreaks(moments: BreakMoment[], breaks: number): BreakPlacement {
  const empty: BreakPlacement = {
    before: moments.map(() => 0),
    after: 0,
    periods: null,
    longestStretch: moments.reduce((sum, moment) => sum + moment.minutes, 0),
  };
  if (moments.length === 0 || breaks === 0) {
    return empty;
  }

  const gameIndex = moments.findIndex((moment) => moment.part === 'del-spel');
  let best: {
    stretch: number;
    positions: number[];
    placement: BreakPlacement;
  } | null = null;

  const maxInsideGame =
    gameIndex >= 0 ? Math.min(breaks, Math.max(0, (moments[gameIndex]?.minutes ?? 0) - 1)) : 0;

  for (let inside = 0; inside <= maxInsideGame; inside += 1) {
    // Tidslinjen som segment: spelmomentet ersätts av sina perioder.
    const segments: number[] = [];
    const fixedBoundaries = new Set<number>();
    let gameFirstSegment = -1;
    for (const [index, moment] of moments.entries()) {
      if (index === gameIndex && inside > 0) {
        gameFirstSegment = segments.length;
        const periods = splitEvenly(moment.minutes, inside + 1);
        for (const [periodIndex, periodMinutes] of periods.entries()) {
          if (periodIndex > 0) {
            fixedBoundaries.add(segments.length);
          }
          segments.push(periodMinutes);
        }
      } else {
        segments.push(moment.minutes);
      }
    }

    const remaining = breaks - inside;
    const freeBoundaries: number[] = [];
    for (let index = 1; index < segments.length; index += 1) {
      if (!fixedBoundaries.has(index)) {
        freeBoundaries.push(index);
      }
    }

    // Undantaget i R-037: får pauserna inte plats en och en, läggs flera efter varandra,
    // och om passet bara har ett moment ligger de direkt efter det.
    if (remaining > freeBoundaries.length) {
      const before = moments.map(() => 0);
      let left = remaining;
      const stacked = new Set<number>(fixedBoundaries);
      for (const boundary of freeBoundaries) {
        stacked.add(boundary);
      }
      const extras = remaining - freeBoundaries.length;
      for (const boundary of freeBoundaries) {
        const momentIndex = segmentToMoment(moments, gameIndex, gameFirstSegment, inside, boundary);
        if (momentIndex !== null) {
          before[momentIndex] = (before[momentIndex] ?? 0) + 1;
          left -= 1;
        }
      }
      const placement: BreakPlacement = {
        before,
        after: left > 0 ? left : 0,
        periods:
          inside > 0 && gameIndex >= 0
            ? {
                momentIndex: gameIndex,
                minutes: splitEvenly(moments[gameIndex]?.minutes ?? 0, inside + 1),
              }
            : null,
        longestStretch: longestStretchOf(segments, stacked),
      };
      const positions = [...stacked].sort((a, b) => a - b);
      for (let index = 0; index < extras; index += 1) {
        positions.push(segments.length);
      }
      if (better({ stretch: placement.longestStretch, positions }, best)) {
        best = { stretch: placement.longestStretch, positions, placement };
      }
      continue;
    }

    for (const chosen of combinations(freeBoundaries.length, remaining)) {
      const boundaries = new Set<number>(fixedBoundaries);
      for (const item of chosen) {
        const boundary = freeBoundaries[item];
        if (boundary !== undefined) {
          boundaries.add(boundary);
        }
      }
      const stretch = longestStretchOf(segments, boundaries);
      const positions = [...boundaries].sort((a, b) => a - b);
      if (!better({ stretch, positions }, best)) {
        continue;
      }
      const before = moments.map(() => 0);
      for (const item of chosen) {
        const boundary = freeBoundaries[item];
        if (boundary === undefined) {
          continue;
        }
        const momentIndex = segmentToMoment(moments, gameIndex, gameFirstSegment, inside, boundary);
        if (momentIndex !== null) {
          before[momentIndex] = (before[momentIndex] ?? 0) + 1;
        }
      }
      best = {
        stretch,
        positions,
        placement: {
          before,
          after: 0,
          periods:
            inside > 0 && gameIndex >= 0
              ? {
                  momentIndex: gameIndex,
                  minutes: splitEvenly(moments[gameIndex]?.minutes ?? 0, inside + 1),
                }
              : null,
          longestStretch: stretch,
        },
      };
    }
  }

  return best?.placement ?? empty;
}

/** Vilket moment ett segmentgränsvärde hör till, alltså vilket moment pausen ligger före. */
function segmentToMoment(
  moments: BreakMoment[],
  gameIndex: number,
  gameFirstSegment: number,
  inside: number,
  boundary: number,
): number | null {
  let segment = 0;
  for (const [index] of moments.entries()) {
    const span = index === gameIndex && inside > 0 ? inside + 1 : 1;
    if (boundary === segment) {
      return index;
    }
    if (boundary > segment && boundary < segment + span) {
      // Gränsen ligger inuti spelmomentet och hanteras av periodindelningen.
      return null;
    }
    segment += span;
  }
  void gameFirstSegment;
  return null;
}
