/**
 * Ritmotorn (ADR 0012 avsnitt 5): en ren funktion från validerad skissdata till SVG.
 *
 * - Tar bara emot märkt `Planskissdata`, alltså skissdata som har gått genom `readPlanskiss`
 *   (RK-1). Anroparen visar `PlanskissSaknas` och `PlanskissFel` för de andra utfallen och
 *   lägger varje skiss i en egen felgräns.
 * - Läser ingen tid, inget slumptal och inget webbläsar-API, och hämtar ingenting. Samma
 *   indata ger samma utdata (S-4).
 * - Ett mått som inte är ett ändligt tal, eller ett ogiltigt `instansId`, kastar ett fel som
 *   felgränsen visar som "Planskissen kunde inte visas". Bilden blir aldrig trasig.
 */
import type { ReactElement } from 'react';
import type { GameFormat } from '../regelmotor/keys.ts';
import type { Planskissdata } from '../regelmotor/schema/planskiss.ts';
import { sketchDescription, sketchTitle } from './beskrivning.ts';
import {
  GOAL_DEPTH,
  GOAL_WIDTHS,
  MARGIN,
  areaFrame,
  decimal,
  direction,
  symbolDiameter,
  toDrawn,
  u,
} from './matt.ts';
import type { AreaFrame, Point, Size } from './matt.ts';
import { around, labelSize, layoutLabels } from './etiketter.ts';
import type { Box, LabelRequest } from './etiketter.ts';
import { samplePath, polylineLength, slice, wavePointBudget } from './rorelser.ts';
import { scalePlayers, withinLimits } from './skalning.ts';
import type { ScaledPlayers, Team } from './skalning.ts';
import {
  ORDER_RING,
  ball,
  cone,
  freeText,
  goal,
  leader,
  marking,
  movement,
  movementLabelAnchor,
  orderRingAt,
  patternDefs,
  patternIds,
  player,
  rectangle,
} from './symboler.tsx';
import type { DrawContext } from './symboler.tsx';
import styles from './planskiss.module.css';

export type PlanskissStorlek = 'miniatyr' | 'normal' | 'planlage' | 'utskrift';

export interface PlanskissProps {
  /** Redan validerad av `readPlanskiss` (ADR 0012 avsnitt 6, RK-1). */
  skiss: Planskissdata;
  /** Styr målstorleken för mål med en spelform som `storlek`. */
  spelform?: GameFormat;
  /** Övningens yta för spelformen. Utan den ritas skissens `omrade` (avsnitt 1). */
  yta?: Size;
  /** Spelarna i gruppen. Utan det ritas basskissen (berättelse 06, kriterium 5). */
  antalSpelare?: number;
  storlek: PlanskissStorlek;
  /** Övningens namn. Blir `<title>` som "{namn}, planskiss". */
  titel: string;
  /** Prefix för alla id:n i SVG:n, `^[a-z0-9-]{1,80}$` (RK-4). */
  instansId: string;
}

/** RK-4: `instansId` blir en del av varje id i SVG:n och måste därför vara en ren slug. */
export const INSTANCE_ID_PATTERN = /^[a-z0-9-]{1,80}$/;

export class InvalidInstanceIdError extends Error {
  constructor() {
    super('instansId ska vara 1–80 tecken, bara gemena a–z, siffror och bindestreck (RK-4)');
    this.name = 'InvalidInstanceIdError';
  }
}

const SIZE_CLASS: Record<PlanskissStorlek, string | undefined> = {
  miniatyr: styles.miniatyr,
  normal: styles.normal,
  planlage: styles.planlage,
  utskrift: styles.utskrift,
};

type SketchObject = Planskissdata['objekt'][number];

/** Etiketternas teckenstorlek, som andel av `D` (avsnitt 5). */
const LABEL_SIZE = 0.6;
/** En ruta eller zon vars båda sidor är högst så här många `D` räknas som en symbol. */
const SMALL_RECT = 2;

/** Rutan runt ett mål: stolparna och nätet bakom mållinjen. */
function goalBox(
  at: Point,
  width: number,
  opening: 'hoger' | 'vanster' | 'upp' | 'ner',
  d: number,
): Box {
  const post = d / 10;
  const half = width / 2 + post;
  const depth = GOAL_DEPTH + post;
  switch (opening) {
    case 'hoger':
      return { x0: at.x - depth, y0: at.y - half, x1: at.x + post, y1: at.y + half };
    case 'vanster':
      return { x0: at.x - post, y0: at.y - half, x1: at.x + depth, y1: at.y + half };
    case 'upp':
      return { x0: at.x - half, y0: at.y - post, x1: at.x + half, y1: at.y + depth };
    case 'ner':
      return { x0: at.x - half, y0: at.y - depth, x1: at.x + half, y1: at.y + post };
  }
}

/** Hur långt från mitten en rörelse börjar eller slutar när den pekar på ett objekt. */
function edgeOf(item: SketchObject, d: number): number {
  switch (item.typ) {
    case 'spelare':
      return d * 0.6;
    case 'ledare':
      return d * 0.55;
    case 'kon':
      return d * 0.3;
    case 'boll':
      return d * 0.25;
    case 'markering':
      return item.form === 'linje' ? 0 : d * 0.3;
    case 'mal':
    case 'zon':
    case 'ruta':
      return 0;
  }
}

function goalWidth(
  item: Extract<SketchObject, { typ: 'mal' }>,
  spelform: GameFormat | undefined,
): number {
  if (item.storlek === 'eget') {
    return item.bredd ?? GOAL_WIDTHS.smamal;
  }
  if (item.storlek === 'smamal') {
    return GOAL_WIDTHS.smamal;
  }
  // Ett mål för en spelform ritas i den spelform som skissen visas för, så att samma skiss
  // ger rätt målstorlek i varje spelform (ADR 0012 avsnitt 2 och 5).
  return GOAL_WIDTHS[spelform ?? item.storlek];
}

/** Rörelsernas banor i den ritade ytans meter, kortade vid symbolernas kanter (avsnitt 3). */
function movementPaths(sketch: Planskissdata, frame: AreaFrame, d: number) {
  const byId = new Map<string, SketchObject>();
  for (const item of sketch.objekt) {
    if (item.id !== undefined) {
      byId.set(item.id, item);
    }
  }
  const resolve = (end: { objekt: string } | { x: number; y: number }) => {
    if ('objekt' in end) {
      const target = byId.get(end.objekt);
      return target === undefined ? null : { at: toDrawn(frame, target), edge: edgeOf(target, d) };
    }
    return { at: toDrawn(frame, end), edge: 0 };
  };

  return (sketch.rorelser ?? []).flatMap((item) => {
    const from = resolve(item.fran);
    const to = resolve(item.till);
    if (from === null || to === null) {
      return [];
    }
    const via = (item.via ?? []).map((point) => toDrawn(frame, point));
    const full = samplePath(from.at, via, to.at);
    const length = polylineLength(full);
    const path = slice(
      full,
      Math.min(from.edge, length / 3),
      length - Math.min(to.edge, length / 3),
    );
    return [{ type: item.typ, path, order: item.ordning, label: item.etikett }];
  });
}

function usedPatterns(sketch: Planskissdata) {
  const keeper = new Set<Team>();
  let diagonal = false;
  let dots = false;
  let net = false;
  for (const item of sketch.objekt) {
    if (item.typ === 'spelare' && item.malvakt === true) {
      keeper.add(item.lag);
    } else if (item.typ === 'zon') {
      diagonal ||= item.monster === 'diagonal';
      dots ||= item.monster === 'prickar';
    } else if (item.typ === 'mal') {
      net = true;
    }
  }
  return { keeper, diagonal, dots, net };
}

/** Allt ritmotorn räknar fram innan något ritas. Används också av teckenförklaringen. */
export interface SketchLayout {
  /** Skissen inom taken för spelare, objekt och rörelser, som den ritas (RK-6, R1). */
  sketch: Planskissdata;
  frame: AreaFrame;
  players: ScaledPlayers;
}

export function sketchLayout(
  skiss: Planskissdata,
  yta: Size | undefined,
  antalSpelare: number | undefined,
): SketchLayout {
  const frame = areaFrame(skiss, yta);
  return {
    sketch: withinLimits(skiss),
    frame,
    players: scalePlayers(skiss, frame, antalSpelare),
  };
}

export function Planskiss({
  skiss: given,
  spelform,
  yta,
  antalSpelare,
  storlek,
  titel,
  instansId,
}: PlanskissProps): ReactElement {
  if (!INSTANCE_ID_PATTERN.test(instansId)) {
    throw new InvalidInstanceIdError();
  }
  // Allt nedan ritar den klamrade skissen, aldrig den givna (R1).
  const { sketch: skiss, frame, players } = sketchLayout(given, yta, antalSpelare);
  const drawn = frame.drawn;
  const d = symbolDiameter(drawn);
  const ctx: DrawContext = {
    d,
    line: storlek === 'planlage' ? d / 6 : d / 8,
    // Etiketter, måttext och ordningssiffror går inte att läsa i miniatyren (avsnitt 5).
    detail: storlek !== 'miniatyr',
    ids: patternIds(instansId),
    // Alla dribblingar delar på samma tak för antalet punkter (R2).
    wavePoints: wavePointBudget(
      (skiss.rorelser ?? []).filter((item) => item.typ === 'dribbling').length,
    ),
  };
  const titleId = `${instansId}-titel`;
  const descId = `${instansId}-beskrivning`;

  const at = (point: Point) => toDrawn(frame, point);
  const layers: {
    back: ReactElement[];
    lines: ReactElement[];
    front: ReactElement[];
  } = { back: [], lines: [], front: [] };
  // Symbolernas rutor och etiketterna som ska placeras runt dem (fynd C, etiketter.ts).
  const obstacles: Box[] = [];
  const requests: { request: LabelRequest; key: string; className?: string }[] = [];
  const fontSize = d * LABEL_SIZE;
  const middle = { x: drawn.langd / 2, y: drawn.bredd / 2 };
  const playerBox = (point: Point, facing?: number) => {
    obstacles.push(around(point, d * 0.6));
    if (facing !== undefined) {
      const dir = direction(facing);
      obstacles.push(
        around({ x: point.x + dir.x * d * 0.9, y: point.y + dir.y * d * 0.9 }, d * 0.3),
      );
    }
  };

  skiss.objekt.forEach((item, index) => {
    const key = `o${index}`;
    switch (item.typ) {
      case 'zon':
      case 'ruta': {
        const corner = at(item);
        const size = { langd: item.langd * frame.sx, bredd: item.bredd * frame.sy };
        layers.back.push(
          rectangle(
            ctx,
            item.typ,
            {
              ...corner,
              ...size,
              pattern: item.typ === 'zon' ? item.monster : undefined,
              dashed: item.typ === 'ruta' && item.stil === 'streckad',
            },
            key,
          ),
        );
        // En liten ruta, till exempel en station, är en symbol som etiketter inte får täcka.
        // Etiketten står då bredvid rutan, helst utåt från ytans mitt.
        const small = size.langd <= SMALL_RECT * d && size.bredd <= SMALL_RECT * d;
        const box = {
          x0: corner.x,
          y0: corner.y,
          x1: corner.x + size.langd,
          y1: corner.y + size.bredd,
        };
        if (small) {
          obstacles.push(box);
        }
        if (ctx.detail && item.etikett !== undefined && item.etikett.length > 0) {
          const centre = { x: (box.x0 + box.x1) / 2, y: (box.y0 + box.y1) / 2 };
          requests.push({
            key: `e${index}`,
            request: small
              ? {
                  text: item.etikett,
                  fontSize,
                  at: centre,
                  origin: 'center',
                  outward: { x: centre.x - middle.x, y: centre.y - middle.y },
                  mode: 'free',
                }
              : {
                  // I en stor zon eller ruta står etiketten i det övre vänstra hörnet.
                  text: item.etikett,
                  fontSize,
                  at: { x: corner.x + d * 0.3, y: corner.y + d * 0.3 },
                  origin: 'topLeft',
                  outward: { x: 1, y: 1 },
                  mode: 'free',
                },
          });
        }
        break;
      }
      case 'markering':
        layers.back.push(
          marking(
            ctx,
            item.form,
            at(item),
            item.till === undefined ? undefined : at(item.till),
            key,
          ),
        );
        if (item.form !== 'linje') {
          obstacles.push(around(at(item), d * 0.3));
        }
        break;
      case 'mal': {
        const width = goalWidth(item, spelform);
        layers.back.push(goal(ctx, at(item), width, item.riktning, key));
        obstacles.push(goalBox(at(item), width, item.riktning, d));
        break;
      }
      case 'kon':
        layers.front.push(cone(ctx, at(item), key));
        obstacles.push(around(at(item), d * 0.3));
        break;
      case 'spelare':
        layers.front.push(
          player(
            ctx,
            {
              at: at(item),
              lag: item.lag,
              keeper: item.malvakt === true,
              label: item.etikett,
              facing: item.riktning,
            },
            key,
          ),
        );
        playerBox(at(item), item.riktning);
        break;
      case 'ledare':
        layers.front.push(leader(ctx, at(item), item.etikett, key));
        obstacles.push(around(at(item), d * 0.6));
        break;
      case 'boll':
        // Bollarna ritas sist, ovanpå spelarna, se nedan.
        obstacles.push(around(at(item), d * 0.2));
        break;
    }
  });

  // Tillagda spelare: alltid utespelare utan etikett och utan pilar (S-6, S-7).
  players.added.forEach((added, index) => {
    layers.front.push(player(ctx, { at: added.at, lag: added.lag, keeper: false }, `t${index}`));
    playerBox(added.at);
  });

  skiss.objekt.forEach((item, index) => {
    if (item.typ === 'boll') {
      layers.front.push(ball(ctx, at(item), `b${index}`));
    }
  });

  const movementLabels: { request: LabelRequest; key: string }[] = [];
  movementPaths(skiss, frame, d).forEach((shape, index) => {
    const element = movement(ctx, shape, `r${index}`);
    if (element === null) {
      return;
    }
    layers.lines.push(element);
    const ring = orderRingAt(ctx, shape);
    if (ring !== null) {
      obstacles.push(around(ring, d * (ORDER_RING + 0.05)));
    }
    const anchor = ctx.detail && shape.label ? movementLabelAnchor(ctx, shape) : null;
    if (anchor !== null && shape.label !== undefined) {
      movementLabels.push({
        key: `re${index}`,
        request: {
          text: shape.label,
          fontSize,
          at: anchor.at,
          origin: 'center',
          outward: anchor.outward,
          mode: 'free',
        },
      });
    }
  });

  const texts: ReactElement[] = [];
  if (ctx.detail) {
    // Måttexten i ytans nedre vänstra hörn, strax under ytan (avsnitt 5). Den placeras
    // först, och flyttas bara nedåt i marginalen om en symbol står i vägen (fynd B/F5).
    const size = `${decimal(frame.shown.langd)} × ${decimal(frame.shown.bredd)} m`;
    const sizeHeight = labelSize(size, fontSize).h;
    const sizeY = drawn.bredd + Math.min(MARGIN * 0.55, d * 0.75);
    const sizeRequest = {
      key: 'matt',
      className: styles.matt,
      request: {
        text: size,
        fontSize,
        at: { x: 0, y: sizeY - sizeHeight / 2 },
        origin: 'topLeft' as const,
        outward: { x: 0, y: 1 },
        mode: 'down' as const,
      },
    };

    const queues =
      skiss.skalning !== undefined && 'koer' in skiss.skalning ? skiss.skalning.koer : undefined;
    const queueLabels: { request: LabelRequest; key: string }[] = [];
    players.queues.forEach((queue) => {
      const step = direction(queue.riktning);
      // Köns etikett ritas en gång, vid den första köspelaren och vid sidan av kön.
      const label = queues?.[queue.index]?.etikett;
      if (label !== undefined && label.length > 0) {
        const side = { x: -step.y, y: step.x };
        const flip = side.y > 0 || (side.y === 0 && side.x < 0) ? -1 : 1;
        const outward = { x: side.x * flip, y: side.y * flip };
        queueLabels.push({
          key: `k${queue.index}`,
          request: {
            text: label,
            fontSize,
            at: {
              x: queue.first.x + outward.x * d * 1.1,
              y: queue.first.y + outward.y * d * 1.1,
            },
            origin: 'center',
            outward,
            mode: 'free',
          },
        });
      }
      if (queue.hidden > 0) {
        queueLabels.push({
          key: `kn${queue.index}`,
          request: {
            text: `+${queue.hidden}`,
            fontSize,
            at: { x: queue.last.x + step.x * d * 1.2, y: queue.last.y + step.y * d * 1.2 },
            origin: 'center',
            outward: step,
            mode: 'free',
          },
        });
      }
    });

    const ordered = [sizeRequest, ...requests, ...queueLabels, ...movementLabels] as {
      request: LabelRequest;
      key: string;
      className?: string;
    }[];
    const placed = layoutLabels(
      ordered.map((item) => item.request),
      {
        bounds: { x0: -MARGIN, y0: -MARGIN, x1: drawn.langd + MARGIN, y1: drawn.bredd + MARGIN },
        obstacles,
        step: d / 4,
        reach: d * 6,
      },
    );
    placed.forEach((label, index) => {
      const item = ordered[index];
      if (label !== null && item !== undefined) {
        texts.push(freeText(ctx, label.at, label.text, 'middle', item.key, item.className));
      }
    });
  }

  const viewBox = [
    u(-MARGIN),
    u(-MARGIN),
    u(drawn.langd + 2 * MARGIN),
    u(drawn.bredd + 2 * MARGIN),
  ].join(' ');

  return (
    <svg
      className={[styles.skiss, SIZE_CLASS[storlek]].filter(Boolean).join(' ')}
      viewBox={viewBox}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{sketchTitle(titel)}</title>
      <desc id={descId}>{sketchDescription(skiss, frame, players)}</desc>
      {patternDefs(ctx, usedPatterns(skiss))}
      <rect className={styles.yta} x={0} y={0} width={u(drawn.langd)} height={u(drawn.bredd)} />
      <g>{layers.back}</g>
      <g>{layers.lines}</g>
      <g>{layers.front}</g>
      {texts.length > 0 && <g>{texts}</g>}
    </svg>
  );
}
