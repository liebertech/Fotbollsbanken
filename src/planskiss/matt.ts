/**
 * Mått och geometri för ritmotorn (ADR 0012 avsnitt 1, 2 och 5).
 *
 * Allt här är rena funktioner av validerade tal. Ingen text ur skissen passerar den här filen,
 * så inget av det som räknas fram kan bära skissens text in i ett attribut (RK-2, RK-3).
 */
import type { GameFormat } from '../regelmotor/keys.ts';
import type { Planskissdata } from '../regelmotor/schema/planskiss.ts';

export interface Size {
  langd: number;
  bredd: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Målbredder i meter per `storlek`, ur `docs/doman/spelformer.md` (ADR 0012 avsnitt 2).
 * `3mot3` är SvFF:s rekommendation, högst 1,6 m. `eget` har ingen bredd här: den står i
 * målets eget fält `bredd`.
 */
export const GOAL_WIDTHS: Record<GameFormat | 'smamal', number> = {
  '3mot3': 1.5,
  '5mot5': 3,
  '7mot7': 5,
  '9mot9': 6,
  '11mot11': 7.32,
  smamal: 1,
};

/** Målets djup ritas som 1 m i alla spelformer, eftersom det bara är en symbol. */
export const GOAL_DEPTH = 1;

/** Objekt får ligga upp till 3 m utanför ytan (avsnitt 1). Bildytan tar med marginalen. */
export const MARGIN = 3;

/** 1 m är 10 enheter i bildytan (avsnitt 5), så att koordinaterna får få decimaler. */
export const UNITS_PER_METRE = 10;

/** Omskalningen uteblir när sidförhållandet ändras mer än 25 % (avsnitt 1). */
export const MAX_ASPECT_CHANGE = 1.25;

/** Gränserna för spelarsymbolens diameter i meter (avsnitt 5). */
export const SYMBOL_MIN = 1.2;
export const SYMBOL_MAX = 4;

/** Spelarsymbolens diameter `D` i meter: klamp(1,2; kortaste sidan / 18; 4,0). */
export function symbolDiameter(area: Size): number {
  const shortest = Math.min(area.langd, area.bredd);
  return Math.min(SYMBOL_MAX, Math.max(SYMBOL_MIN, shortest / 18));
}

/**
 * Ytan som skissen ritas efter, och hur koordinaterna räknas om (avsnitt 1).
 *
 * - `shown` är måtten som skrivs i måttexten och i `desc`: övningens yta för spelformen, eller
 *   skissens `omrade` när övningen saknar yta.
 * - `drawn` är ytan som faktiskt ritas. Den är `shown`, utom när sidförhållandet ändras mer
 *   än 25 %: då ritas `omrade` som det står.
 * - `sx` och `sy` räknar om en koordinat ur `omrade` till den ritade ytan, var för sig.
 */
export interface AreaFrame {
  shown: Size;
  drawn: Size;
  sx: number;
  sy: number;
  rescaled: boolean;
}

export function areaFrame(sketch: Planskissdata, yta: Size | undefined): AreaFrame {
  const omrade = sketch.omrade;
  const shown = yta ?? omrade;
  const same = shown.langd === omrade.langd && shown.bredd === omrade.bredd;
  if (same) {
    return { shown, drawn: omrade, sx: 1, sy: 1, rescaled: false };
  }
  const change = shown.langd / shown.bredd / (omrade.langd / omrade.bredd);
  if (!Number.isFinite(change) || change <= 0 || Math.max(change, 1 / change) > MAX_ASPECT_CHANGE) {
    return { shown, drawn: omrade, sx: 1, sy: 1, rescaled: false };
  }
  return {
    shown,
    drawn: shown,
    sx: shown.langd / omrade.langd,
    sy: shown.bredd / omrade.bredd,
    rescaled: true,
  };
}

/** En punkt ur skissen i den ritade ytans meter. */
export function toDrawn(frame: AreaFrame, point: Point): Point {
  return { x: point.x * frame.sx, y: point.y * frame.sy };
}

/** Enhetsvektorn för en vinkel i grader, där 0 är åt höger och 90 nedåt (ADR 0018 punkt 8). */
export function direction(degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  // Avrundat, så att 90° ger exakt 0 i x och inte 6e-17.
  return {
    x: Math.round(Math.cos(radians) * 1e9) / 1e9,
    y: Math.round(Math.sin(radians) * 1e9) / 1e9,
  };
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Ett tal som ska bli ett attributvärde. Talet avrundas till två decimaler i bildenheter.
 * Är det inte ändligt kastas `NonFiniteError`, som `Planskiss` fångar och visar som
 * "Planskissen kunde inte visas" (RK-3, RK-6).
 */
export class NonFiniteError extends Error {
  constructor() {
    super('Ett uträknat mått i planskissen är inte ett ändligt tal');
    this.name = 'NonFiniteError';
  }
}

export function finite(value: number): number {
  if (!Number.isFinite(value)) {
    throw new NonFiniteError();
  }
  const rounded = Math.round(value * 100) / 100;
  // -0 skrivs som "0".
  return rounded === 0 ? 0 : rounded;
}

/** Meter till bildenheter, kontrollerat (RK-3). */
export function u(metres: number): number {
  return finite(metres * UNITS_PER_METRE);
}

/** Talet med decimalkomma, som i löptexten: 7,32. */
export function decimal(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return String(rounded).replace('.', ',');
}
