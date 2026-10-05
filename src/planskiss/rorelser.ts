/**
 * Rörelsernas geometri (ADR 0012 avsnitt 3): från skissens punkter till en brutna linje i
 * den ritade ytans meter, med pilspets, våg och dubbellinje.
 *
 * Kurvorna samplas till korta raka sträckor. Då kan alla fyra linjeformerna byggas på samma
 * sätt, och `d` i `<path>` blir bara tal som räknats fram här (RK-3).
 */
import type { Point } from './matt.ts';
import { distance } from './matt.ts';

/** Antal delsträckor per kurva. Räcker för en jämn kurva även i storleken `normal`. */
const CURVE_STEPS = 24;

function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Rak linje, kvadratisk eller kubisk bézierkurva, beroende på antalet `via` (0, 1 eller 2). */
export function samplePath(from: Point, via: readonly Point[], to: Point): Point[] {
  const [c1, c2] = via;
  if (c1 === undefined) {
    return [from, to];
  }
  const points: Point[] = [];
  for (let step = 0; step <= CURVE_STEPS; step += 1) {
    const t = step / CURVE_STEPS;
    if (c2 === undefined) {
      points.push(lerp(lerp(from, c1, t), lerp(c1, to, t), t));
    } else {
      const a = lerp(lerp(from, c1, t), lerp(c1, c2, t), t);
      const b = lerp(lerp(c1, c2, t), lerp(c2, to, t), t);
      points.push(lerp(a, b, t));
    }
  }
  return points;
}

export function polylineLength(points: readonly Point[]): number {
  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    if (a !== undefined && b !== undefined) {
      length += distance(a, b);
    }
  }
  return length;
}

/** Punkten och riktningen på avståndet `at` meter längs linjen. */
export function pointAt(points: readonly Point[], at: number): { point: Point; tangent: Point } {
  let walked = 0;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    if (a === undefined || b === undefined) {
      continue;
    }
    const segment = distance(a, b);
    if (segment === 0) {
      continue;
    }
    if (walked + segment >= at || index === points.length - 1) {
      const t = Math.min(1, Math.max(0, (at - walked) / segment));
      return {
        point: lerp(a, b, t),
        tangent: { x: (b.x - a.x) / segment, y: (b.y - a.y) / segment },
      };
    }
    walked += segment;
  }
  const only = points[0] ?? { x: 0, y: 0 };
  return { point: only, tangent: { x: 1, y: 0 } };
}

/** Delen av linjen mellan `start` och `end` meter från början. */
export function slice(points: readonly Point[], start: number, end: number): Point[] {
  if (end <= start) {
    return [];
  }
  const result: Point[] = [pointAt(points, start).point];
  let walked = 0;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    if (a === undefined || b === undefined) {
      continue;
    }
    walked += distance(a, b);
    if (walked > start && walked < end) {
      result.push(b);
    }
  }
  result.push(pointAt(points, end).point);
  return result;
}

/** Normalen åt vänster om riktningen, i SVG:s koordinater. */
export function normal(tangent: Point): Point {
  return { x: tangent.y, y: -tangent.x };
}

/** Linjen förskjuten `offset` meter åt sidan, för dubbellinjen vid skott. */
export function offsetLine(points: readonly Point[], offset: number): Point[] {
  return points.map((point, index) => {
    // Riktningen i en brytpunkt är riktningen mellan grannarna.
    const before = points[index - 1] ?? point;
    const after = points[index + 1] ?? point;
    const length = distance(before, after);
    const tangent =
      length === 0
        ? { x: 1, y: 0 }
        : { x: (after.x - before.x) / length, y: (after.y - before.y) / length };
    const side = normal(tangent);
    return { x: point.x + side.x * offset, y: point.y + side.y * offset };
  });
}

/**
 * Högst så här många punkter samplas för en bana (säkerhetsgranskningen R1 och R2). Utan tak
 * ger en lång dribbling på en smal yta, där symbolen och därmed våglängden är liten, tusentals
 * punkter, och en förfalskad bana på 1e7 m tar slut på minnet.
 */
export const MAX_PATH_POINTS = 400;

/**
 * Så många punkter får alla vågiga linjer i en skiss dela på (R2). En skiss med många långa
 * dribblingar blir då högst cirka 40 kB, i stället för flera hundra. Vanliga skisser når aldrig
 * taket och ritas som förut.
 */
export const MAX_SKETCH_WAVE_POINTS = 2400;

/** Antalet punkter som varje vågig linje får när `count` vågiga linjer delar på budgeten. */
export function wavePointBudget(count: number): number {
  if (!(count > 0)) {
    return MAX_PATH_POINTS;
  }
  return Math.max(16, Math.min(MAX_PATH_POINTS, Math.floor(MAX_SKETCH_WAVE_POINTS / count)));
}

/**
 * Vågig linje längs banan, för dribbling: en sinus med amplitud och våglängd i meter.
 *
 * Banan samplas med åtta punkter per våglängd och högst `maxPoints` punkter. Behövs fler blir
 * våglängden längre i stället, så att vågen förblir jämn och aldrig vikningsförvrängs.
 */
export function waveLine(
  points: readonly Point[],
  amplitude: number,
  wavelength: number,
  maxPoints: number = MAX_PATH_POINTS,
): Point[] {
  const total = polylineLength(points);
  const limit = Number.isFinite(maxPoints)
    ? Math.max(3, Math.min(MAX_PATH_POINTS, Math.floor(maxPoints)))
    : MAX_PATH_POINTS;
  const count = Math.min(limit - 1, Math.max(2, Math.ceil(total / (wavelength / 8))));
  const wave = Math.max(wavelength, (total / count) * 8);
  const result: Point[] = [];
  for (let index = 0; index <= count; index += 1) {
    const at = (total * index) / count;
    const { point, tangent } = pointAt(points, at);
    const side = normal(tangent);
    const swing = amplitude * Math.sin((2 * Math.PI * at) / wave);
    result.push({ x: point.x + side.x * swing, y: point.y + side.y * swing });
  }
  return result;
}
