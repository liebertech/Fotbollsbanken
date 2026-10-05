/**
 * Placering av skissens etiketter (ADR 0012 avsnitt 5, ux-granskningen av ritmotorn, fynd C
 * och B/F5).
 *
 * Reglerna:
 * - **Ingen etikett överlappar en symbol eller en annan etikett, och ingen klipps** av
 *   bildens kant. Symbolerna är spelare, ledare, koner, bollar, markeringar, mål, små rutor
 *   och zoner och rörelsernas ordningsringar. Stora rutor och zoner, linjer och pilar är inte
 *   hinder: en etikett får ligga på en linje, och halon gör den läsbar.
 * - **Vid platsbrist flyttas etiketten**, så nära sin plats som möjligt och helst utåt, bort
 *   från det den hör till. Den stannar alltid inom bildytan, alltså ytan plus marginalen.
 * - **Ryms den inte ens då, kortas den** med "…", och flyttas på samma sätt. Ryms inte ens två
 *   tecken utelämnas den. Övningens text och skissens `desc` har alltid samma information.
 * - **Måttexten** flyttas bara nedåt i marginalen, aldrig till ett annat hörn, och kortas
 *   aldrig. Ryms den inte utelämnas den. Ytans mått står också i `desc` och på övningskortet.
 *
 * Allt är rena funktioner av validerade tal och textens längd. Samma skiss ger alltid samma
 * placering (S-4). Texten själv passerar bara genom `Array.from` och `slice`.
 */
import type { Point } from './matt.ts';

/** En axelparallell rektangel i den ritade ytans meter. */
export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Ett tecken räknas som 0,6 × teckenstorleken brett, lite mer än `fitLabel`. */
export const CHAR_WIDTH = 0.6;
/** Halon är 0,25 em bred och ligger till hälften utanför tecknen (planskiss.module.css). */
const HALO = 0.125;
/** Radhöjden som en etikett tar, med halon. */
const LINE_HEIGHT = 1.3;
/** Antal riktningar som prövas på varje avstånd. */
const DIRECTIONS = 16;

export function labelSize(text: string, fontSize: number): { w: number; h: number } {
  return {
    w: (Array.from(text).length * CHAR_WIDTH + 2 * HALO) * fontSize,
    h: LINE_HEIGHT * fontSize,
  };
}

export function overlaps(a: Box, b: Box): boolean {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

function inside(box: Box, bounds: Box): boolean {
  return box.x0 >= bounds.x0 && box.x1 <= bounds.x1 && box.y0 >= bounds.y0 && box.y1 <= bounds.y1;
}

/** Rutan runt en punkt med halva sidan `half`. */
export function around(at: Point, half: number): Box {
  return { x0: at.x - half, y0: at.y - half, x1: at.x + half, y1: at.y + half };
}

/** Texten kortad till `count` tecken, det sista ersatt med "…" (RK-7). */
function shortened(text: string, count: number): string {
  const chars = Array.from(text);
  if (chars.length <= count) {
    return text;
  }
  return `${chars
    .slice(0, count - 1)
    .join('')
    .trimEnd()}…`;
}

/** Längderna som prövas: hela texten, sedan allt kortare, ned till två tecken och "…". */
function lengths(text: string): number[] {
  const full = Array.from(text).length;
  const result = [full];
  for (const share of [0.8, 0.65, 0.5, 0.35]) {
    const count = Math.max(3, Math.floor(full * share));
    if (count < (result[result.length - 1] ?? 0)) {
      result.push(count);
    }
  }
  if (full > 3 && (result[result.length - 1] ?? 0) > 3) {
    result.push(3);
  }
  return result;
}

export interface LabelRequest {
  text: string;
  fontSize: number;
  /**
   * Var etiketten helst står: mitten (`center`), eller det övre vänstra hörnet av texten
   * (`topLeft`), som för en zons etikett i zonens hörn.
   */
  at: Point;
  origin: 'center' | 'topLeft';
  /** Åt vilket håll etiketten helst flyttas. Behöver inte vara normerad. */
  outward: Point;
  /** `free` flyttar och kortar. `down` flyttar bara nedåt och kortar aldrig (måttexten). */
  mode: 'free' | 'down';
}

export interface PlacedLabel {
  text: string;
  /** Textens mitt. Etiketten ritas centrerad där. */
  at: Point;
  box: Box;
}

export interface LabelLayoutOptions {
  /** Bildytan: ytan plus marginalen. Ingen etikett lämnar den. */
  bounds: Box;
  /** Symbolernas rutor. */
  obstacles: readonly Box[];
  /** Steget mellan prövade avstånd, och det största avståndet, i meter. */
  step: number;
  reach: number;
}

/** Riktningarna sorterade efter hur nära de ligger `outward`, de närmaste först. */
function directions(outward: Point): Point[] {
  const length = Math.hypot(outward.x, outward.y);
  const base = length > 0 ? Math.atan2(outward.y, outward.x) : -Math.PI / 2;
  const list: Point[] = [];
  list.push({ x: Math.cos(base), y: Math.sin(base) });
  for (let k = 1; k <= DIRECTIONS / 2; k += 1) {
    const turn = (k * 2 * Math.PI) / DIRECTIONS;
    list.push({ x: Math.cos(base + turn), y: Math.sin(base + turn) });
    if (k < DIRECTIONS / 2) {
      list.push({ x: Math.cos(base - turn), y: Math.sin(base - turn) });
    }
  }
  return list;
}

/**
 * Placerar etiketterna i tur och ordning. En placerad etikett blir ett hinder för de
 * följande, så ordningen avgör vem som får sin plats först.
 */
export function layoutLabels(
  requests: readonly LabelRequest[],
  options: LabelLayoutOptions,
): (PlacedLabel | null)[] {
  const taken: Box[] = [...options.obstacles];
  const free = (box: Box) =>
    inside(box, options.bounds) && !taken.some((other) => overlaps(box, other));

  return requests.map((request) => {
    const placed = place(request, options, free);
    if (placed !== null) {
      taken.push(placed.box);
    }
    return placed;
  });
}

function place(
  request: LabelRequest,
  options: LabelLayoutOptions,
  free: (box: Box) => boolean,
): PlacedLabel | null {
  const counts =
    request.mode === 'down' ? [Array.from(request.text).length] : lengths(request.text);
  for (const count of counts) {
    if (count < 1) {
      continue;
    }
    const text = shortened(request.text, count);
    const { w, h } = labelSize(text, request.fontSize);
    const center =
      request.origin === 'center'
        ? request.at
        : { x: request.at.x + w / 2, y: request.at.y + h / 2 };
    const boxAt = (c: Point): Box => ({
      x0: c.x - w / 2,
      y0: c.y - h / 2,
      x1: c.x + w / 2,
      y1: c.y + h / 2,
    });

    if (request.mode === 'down') {
      // Bara nedåt, i små steg, till bildens underkant.
      const step = request.fontSize / 10;
      for (let y = center.y; y + h / 2 <= options.bounds.y1 + 1e-9; y += step) {
        const c = { x: center.x, y };
        const box = boxAt(c);
        if (free(box)) {
          return { text, at: c, box };
        }
      }
      return null;
    }

    if (free(boxAt(center))) {
      return { text, at: center, box: boxAt(center) };
    }
    const turns = directions(request.outward);
    for (let r = options.step; r <= options.reach + 1e-9; r += options.step) {
      for (const dir of turns) {
        const c = { x: center.x + dir.x * r, y: center.y + dir.y * r };
        const box = boxAt(c);
        if (free(box)) {
          return { text, at: c, box };
        }
      }
    }
  }
  return null;
}
