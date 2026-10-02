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
import { samplePath, polylineLength, slice, wavePointBudget } from './rorelser.ts';
import { scalePlayers, withinLimits } from './skalning.ts';
import type { ScaledPlayers, Team } from './skalning.ts';
import {
  ball,
  cone,
  fitLabel,
  freeText,
  goal,
  leader,
  marking,
  movement,
  patternDefs,
  patternIds,
  player,
  rectangle,
  roomAt,
} from './symboler.tsx';
import type { DrawContext, TextRoom } from './symboler.tsx';
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
  // Bildens kanter. En etikett kortas mot avståndet från sitt ankare till kanten (RK-7, F3).
  const room: TextRoom = { left: -MARGIN, right: drawn.langd + MARGIN };

  const at = (point: Point) => toDrawn(frame, point);
  const layers: {
    back: ReactElement[];
    lines: ReactElement[];
    front: ReactElement[];
  } = { back: [], lines: [], front: [] };

  skiss.objekt.forEach((item, index) => {
    const key = `o${index}`;
    switch (item.typ) {
      case 'zon':
      case 'ruta': {
        const corner = at(item);
        layers.back.push(
          rectangle(
            ctx,
            item.typ,
            {
              ...corner,
              langd: item.langd * frame.sx,
              bredd: item.bredd * frame.sy,
              pattern: item.typ === 'zon' ? item.monster : undefined,
              dashed: item.typ === 'ruta' && item.stil === 'streckad',
              label: item.etikett,
            },
            drawn.langd + MARGIN - corner.x,
            key,
          ),
        );
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
        break;
      case 'mal':
        layers.back.push(goal(ctx, at(item), goalWidth(item, spelform), item.riktning, key));
        break;
      case 'kon':
        layers.front.push(cone(ctx, at(item), key));
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
        break;
      case 'ledare':
        layers.front.push(leader(ctx, at(item), item.etikett, key));
        break;
      case 'boll':
        // Bollarna ritas sist, ovanpå spelarna, se nedan.
        break;
    }
  });

  // Tillagda spelare: alltid utespelare utan etikett och utan pilar (S-6, S-7).
  players.added.forEach((added, index) => {
    layers.front.push(player(ctx, { at: added.at, lag: added.lag, keeper: false }, `t${index}`));
  });

  skiss.objekt.forEach((item, index) => {
    if (item.typ === 'boll') {
      layers.front.push(ball(ctx, at(item), `b${index}`));
    }
  });

  movementPaths(skiss, frame, d).forEach((shape, index) => {
    const element = movement(ctx, shape, room, `r${index}`);
    if (element !== null) {
      layers.lines.push(element);
    }
  });

  const texts: ReactElement[] = [];
  if (ctx.detail) {
    const queues =
      skiss.skalning !== undefined && 'koer' in skiss.skalning ? skiss.skalning.koer : undefined;
    players.queues.forEach((queue) => {
      const step = direction(queue.riktning);
      // Köns etikett ritas en gång, vid den första köspelaren och vid sidan av kön.
      const label = queues?.[queue.index]?.etikett;
      if (label !== undefined && label.length > 0) {
        const side = { x: -step.y, y: step.x };
        const flip = side.y > 0 || (side.y === 0 && side.x < 0) ? -1 : 1;
        const place = {
          x: queue.first.x + side.x * flip * d * 1.1,
          y: queue.first.y + side.y * flip * d * 1.1,
        };
        const text = fitLabel(label, d * 0.6, roomAt(room, place.x, 'middle'));
        if (text.length > 0) {
          texts.push(freeText(ctx, place, text, 'middle', `k${queue.index}`));
        }
      }
      if (queue.hidden > 0) {
        const place = { x: queue.last.x + step.x * d * 1.2, y: queue.last.y + step.y * d * 1.2 };
        texts.push(freeText(ctx, place, `+${queue.hidden}`, 'middle', `kn${queue.index}`));
      }
    });
    // Måttexten i ytans nedre vänstra hörn, strax under ytan (avsnitt 5).
    const size = `${decimal(frame.shown.langd)} × ${decimal(frame.shown.bredd)} m`;
    const sizeAt = { x: 0, y: drawn.bredd + Math.min(MARGIN * 0.55, d * 0.75) };
    const sizeText = fitLabel(size, d * 0.6, roomAt(room, sizeAt.x, 'start'));
    if (sizeText.length > 0) {
      texts.push(freeText(ctx, sizeAt, sizeText, 'start', 'matt', styles.matt));
    }
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
