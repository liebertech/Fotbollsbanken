/**
 * Skalning efter antal spelare (ADR 0012 avsnitt 4, ADR 0018 punkt 4, 5 och 8).
 *
 * Funktionen är ren och deterministisk (S-4): samma skiss och samma antal ger alltid samma
 * utplacering. Den lägger aldrig till rörelser (S-6) och gör aldrig en tillagd spelare till
 * målvakt (S-7).
 */
import { PLANSKISS_LIMITS } from '../regelmotor/schema/planskiss.ts';
import type { Planskissdata } from '../regelmotor/schema/planskiss.ts';
import { MARGIN, direction, symbolDiameter, toDrawn } from './matt.ts';
import type { AreaFrame, Point } from './matt.ts';

type SketchObject = Planskissdata['objekt'][number];
export type Team = 'a' | 'b' | 'neutral';

/** Högst så här många spelarsymboler ritas (S-5, RK-6). Gäller också basskissens spelare. */
export const MAX_PLAYER_SYMBOLS: number = PLANSKISS_LIMITS.spelare;
/** Högst så här många objekt och rörelser ritas, samma tak som i schemat (RK-6, R1). */
export const MAX_OBJECTS: number = PLANSKISS_LIMITS.objekt.max;
export const MAX_MOVEMENTS: number = PLANSKISS_LIMITS.rorelser;
/** Antalet klamras till högst basantalet plus 30 (avsnitt 4, *Två gränser*). */
export const MAX_EXTRA = 30;
/** En kö ritas med högst 8 spelare (avsnitt 4, RK-6). */
export const MAX_QUEUE_DRAWN = 8;
/** Förvalt avstånd mellan spelarna i en kö, i meter (avsnitt 4). */
export const DEFAULT_QUEUE_SPACING = 1.5;
/** Glappet mellan två köspelare, som andel av `D`, så att varje symbol syns för sig (fynd A). */
export const QUEUE_GAP = 0.2;

/**
 * Minsta avståndet mellan två köspelare i köns riktning, så att symbolerna aldrig överlappar
 * och kön alltid går att räkna (ux-granskningen, fynd A). Avståndet är symbolens utsträckning
 * längs riktningen plus ett glapp på `0,2 × D`: cirkeln är `D` bred, kvadraten `0,9 × D` och
 * romben har halvdiagonalen `0,575 × D`, mått som i `symboler.tsx`. Ett kortare `avstand` i
 * skissen ritas med det här avståndet i stället.
 */
export function minQueueSpacing(lag: Team, degrees: number, d: number): number {
  const step = direction(degrees);
  const ax = Math.abs(step.x);
  const ay = Math.abs(step.y);
  let extent: number;
  if (lag === 'a') {
    extent = d;
  } else if (lag === 'b') {
    extent = (d * 0.9) / Math.max(ax, ay);
  } else {
    extent = (2 * d * 0.575) / (ax + ay);
  }
  return extent + QUEUE_GAP * d;
}

/**
 * Ryms en köspelare med mitten i `at` inom bildytan, alltså ytan plus marginalen? En
 * köspelare som inte ryms ritas inte, utan räknas med i köns "+N" (fynd A och kön vid kanten).
 */
function insideImage(frame: AreaFrame, at: Point, d: number): boolean {
  const half = d / 2;
  return (
    at.x >= -MARGIN + half &&
    at.x <= frame.drawn.langd + MARGIN - half &&
    at.y >= -MARGIN + half &&
    at.y <= frame.drawn.bredd + MARGIN - half
  );
}

/** En spelare som skalningen har lagt till. Alltid utespelare och alltid utan etikett (S-7). */
export interface AddedPlayer {
  /** Positionen i den ritade ytans meter. */
  at: Point;
  lag: Team;
}

/** En kö som har fått minst en spelare. */
export interface DrawnQueue {
  /** Köns index i `skalning.koer`, för att hämta etiketten i ritningen. */
  index: number;
  /** Den första köspelaren, där köns etikett ritas. */
  first: Point;
  /** Den sista ritade köspelaren, där ett överskott skrivs som "+N". */
  last: Point;
  /** Köns riktning i grader. */
  riktning: number;
  /** Köspelare utöver de 8 som ritas. */
  hidden: number;
}

export interface ScaledPlayers {
  /** Antalet spelare i basskissen, alltså `spelare`-objekten. */
  baseCount: number;
  /** Antalet som skissen ritas för, efter klamringen. Basantalet när antalet inte är känt. */
  count: number;
  added: AddedPlayer[];
  queues: DrawnQueue[];
  /** Spelare som varken fick en plats eller en kö, eller som föll över taket på 40. */
  notDrawn: number;
  /** Antal ytor vid `parallella-ytor`, annars 1. */
  areas: number;
}

function basePlayers(sketch: Planskissdata) {
  return sketch.objekt.filter(
    (item): item is Extract<SketchObject, { typ: 'spelare' }> => item.typ === 'spelare',
  );
}

/**
 * Skissen inom schemats tak, prövade på nytt vid ritning (RK-6, säkerhetsgranskningen R1):
 * högst 40 spelare, 60 objekt och 30 rörelser. Validerad data ligger alltid inom taken och
 * kommer tillbaka oförändrad. Data som har tagit sig förbi `readPlanskiss`, genom en
 * regression eller en förfalskning, ritas bara till taket i stället för att bli en mycket
 * stor bild. De första objekten och rörelserna i listorna behålls.
 */
export function withinLimits(sketch: Planskissdata): Planskissdata {
  const movements = sketch.rorelser;
  if (
    sketch.objekt.length <= MAX_OBJECTS &&
    basePlayers(sketch).length <= MAX_PLAYER_SYMBOLS &&
    (movements === undefined || movements.length <= MAX_MOVEMENTS)
  ) {
    return sketch;
  }
  let keptPlayers = 0;
  const objekt = sketch.objekt.filter((item) => {
    if (item.typ !== 'spelare') {
      return true;
    }
    keptPlayers += 1;
    return keptPlayers <= MAX_PLAYER_SYMBOLS;
  });
  return {
    ...sketch,
    objekt: objekt.slice(0, MAX_OBJECTS),
    ...(movements === undefined ? {} : { rorelser: movements.slice(0, MAX_MOVEMENTS) }),
  };
}

/**
 * Antalet som skissen ska ritas för (S-2, avsnitt 4). Ett okänt antal ger basskissen
 * (berättelse 06, kriterium 5), och ett orimligt antal klamras till [basantal, basantal + 30].
 */
export function clampCount(baseCount: number, count: number | undefined): number {
  if (count === undefined || !Number.isFinite(count)) {
    return baseCount;
  }
  return Math.min(baseCount + MAX_EXTRA, Math.max(baseCount, Math.floor(count)));
}

/**
 * Fördelar överskottet enligt `skalning`. Platserna fylls först och köerna sedan, oavsett
 * vilken strategi som anges (ADR 0018 punkt 8).
 */
export function scalePlayers(
  sketch: Planskissdata,
  frame: AreaFrame,
  count: number | undefined,
): ScaledPlayers {
  const baseCount = basePlayers(sketch).length;
  // Bara basskissens spelare inom taken ritas. Resten står inte med i skissen (R1).
  const base = basePlayers(withinLimits(sketch));
  const total = clampCount(baseCount, count);
  const result: ScaledPlayers = {
    baseCount,
    count: total,
    added: [],
    queues: [],
    notDrawn: baseCount - base.length,
    areas: 1,
  };
  const scaling = sketch.skalning ?? { strategi: 'fast' as const };

  if (scaling.strategi === 'fast') {
    return result;
  }
  if (scaling.strategi === 'parallella-ytor') {
    // Ingen spelare läggs till. Skissen visar en yta och antalet ytor skrivs i text.
    // Schemat kräver minst 1 per yta. Det prövas ändå på nytt, så att 0 eller ett tal som
    // inte är ändligt aldrig ger "en av Infinity ytor" (R1).
    const perArea = Number.isFinite(scaling.per_yta) ? Math.max(1, scaling.per_yta) : 1;
    result.areas = Math.max(1, Math.ceil(total / perArea));
    return result;
  }

  let extra = total - baseCount;
  // Taket gäller alla ritade spelarsymboler, basskissens medräknade (S-5).
  let room = Math.max(0, MAX_PLAYER_SYMBOLS - base.length);

  for (const place of scaling.platser ?? []) {
    if (extra === 0) {
      break;
    }
    extra -= 1;
    if (room === 0) {
      result.notDrawn += 1;
      continue;
    }
    room -= 1;
    // Posten har inget fält för målvakt, så platsen blir alltid en utespelare (S-7).
    result.added.push({ at: toDrawn(frame, place), lag: place.lag });
  }

  const queues = scaling.koer ?? [];
  if (queues.length === 0) {
    result.notDrawn += extra;
    return result;
  }

  const d = symbolDiameter(frame.drawn);
  // Cykliskt: spelare 1 till kö 1, spelare 2 till kö 2 och så vidare (avsnitt 4).
  const perQueue = queues.map(
    (_, index) => Math.floor(extra / queues.length) + (index < extra % queues.length ? 1 : 0),
  );

  queues.forEach((queue, index) => {
    const size = perQueue[index] ?? 0;
    const start = base.find((player) => player.id === queue.vid);
    if (size === 0) {
      return;
    }
    if (start === undefined) {
      // Kan inte hända med validerad data (ADR 0018 punkt 5), men ger aldrig en trasig bild.
      result.notDrawn += size;
      return;
    }
    const origin = toDrawn(frame, start);
    const step = direction(queue.riktning);
    // Avståndet är i meter på marken och skalas inte med ytan, men blir aldrig så kort att
    // symbolerna överlappar (fynd A).
    const spacing = Math.max(
      queue.avstand ?? DEFAULT_QUEUE_SPACING,
      minQueueSpacing(start.lag, queue.riktning, d),
    );
    const positions: Point[] = [];
    for (let k = 1; k <= Math.min(size, MAX_QUEUE_DRAWN, room); k += 1) {
      const at = { x: origin.x + step.x * k * spacing, y: origin.y + step.y * k * spacing };
      // Kön stannar vid bildens kant. Resten skrivs som "+N" i stället för att klippas.
      if (!insideImage(frame, at, d)) {
        break;
      }
      positions.push(at);
      // Köspelaren ärver bara laget, aldrig målvaktsmarkeringen (S-7).
      result.added.push({ at, lag: start.lag });
    }
    const drawable = positions.length;
    room -= drawable;
    const first = positions[0];
    const last = positions[positions.length - 1];
    if (first !== undefined && last !== undefined) {
      result.queues.push({
        index,
        first,
        last,
        riktning: queue.riktning,
        hidden: size - drawable,
      });
    } else {
      result.notDrawn += size;
    }
  });

  return result;
}
