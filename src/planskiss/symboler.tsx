/**
 * Symbolerna i ADR 0012 avsnitt 2 och linjeformerna i avsnitt 3, som funktioner från
 * validerade tal till SVG-element.
 *
 * Reglerna för hela filen (S-07, RK-2, RK-3, RK-5):
 * - bara elementen i vitlistan i eslint.config.js,
 * - varje geometriskt attribut går genom `u()` eller `finite()`, som kontrollerar att talet
 *   är ändligt,
 * - text ur skissen står bara som barn till `<text>`, aldrig i ett attribut,
 * - färger sätts med klasser som pekar på fasta CSS-variabler, aldrig med `style`.
 *
 * Funktionerna är vanliga funktioner, inte komponenter. De anropas medan `Planskiss` ritas,
 * så att ett mått som inte är ändligt kastar där och fångas av felgränsen.
 */
import type { ReactElement } from 'react';
import { GOAL_DEPTH, finite, u } from './matt.ts';
import type { Point } from './matt.ts';
import type { Team } from './skalning.ts';
import { normal, pointAt, polylineLength, slice, offsetLine, waveLine } from './rorelser.ts';
import styles from './planskiss.module.css';

/** Id:n på mönstren i `<defs>`, alla med `instansId` som prefix (RK-4). */
export interface PatternIds {
  keeper: Record<Team, string>;
  diagonal: string;
  dots: string;
  net: string;
}

export function patternIds(instanceId: string): PatternIds {
  return {
    keeper: {
      a: `${instanceId}-malvakt-a`,
      b: `${instanceId}-malvakt-b`,
      neutral: `${instanceId}-malvakt-neutral`,
    },
    diagonal: `${instanceId}-zon-diagonal`,
    dots: `${instanceId}-zon-prickar`,
    net: `${instanceId}-mal-nat`,
  };
}

/** Allt en symbol behöver veta om ritningen. */
export interface DrawContext {
  /** Spelarsymbolens diameter `D` i meter (avsnitt 5). */
  d: number;
  /** Linjebredden i meter: `D / 8`, eller `D / 6` i planläget. */
  line: number;
  /** Etiketter, ordningssiffror och måttext ritas bara när `detail` är sant. */
  detail: boolean;
  ids: PatternIds;
  /** Högst så här många punkter i varje vågig linje, se `wavePointBudget` (R2). */
  wavePoints: number;
}

const TEAM_CLASS: Record<Team, string | undefined> = {
  a: styles.lagA,
  b: styles.lagB,
  neutral: styles.lagNeutral,
};

/** Målvaktens kontur. Fyllningen är randmönstret i fill-attributet. */
const KEEPER_CLASS: Record<Team, string | undefined> = {
  a: styles.konturA,
  b: styles.konturB,
  neutral: styles.konturNeutral,
};

const STRIPE_CLASS: Record<Team, string | undefined> = {
  a: styles.randA,
  b: styles.randB,
  neutral: styles.randNeutral,
};

function classes(...names: (string | undefined | false)[]): string {
  return names.filter((name): name is string => typeof name === 'string' && name !== '').join(' ');
}

function points(list: readonly Point[]): string {
  return list.map((point) => `${u(point.x)},${u(point.y)}`).join(' ');
}

function pathData(list: readonly Point[]): string {
  return list
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${u(point.x)} ${u(point.y)}`)
    .join(' ');
}

/** Mönstren som skissen använder. Bara de som behövs ritas, så att utdata hålls liten. */
export function patternDefs(
  ctx: DrawContext,
  needed: { keeper: ReadonlySet<Team>; diagonal: boolean; dots: boolean; net: boolean },
): ReactElement | null {
  const stripe = u(ctx.d / 4);
  const teams = (['a', 'b', 'neutral'] as const).filter((team) => needed.keeper.has(team));
  if (teams.length === 0 && !needed.diagonal && !needed.dots && !needed.net) {
    return null;
  }
  const hatch = u(0.5);
  const dotStep = u(ctx.d / 2);
  return (
    <defs>
      {teams.map((team) => (
        <pattern
          key={team}
          id={ctx.ids.keeper[team]}
          patternUnits="userSpaceOnUse"
          width={stripe}
          height={stripe}
        >
          <rect className={styles.randBakgrund} x={0} y={0} width={stripe} height={stripe} />
          <rect
            className={STRIPE_CLASS[team]}
            x={0}
            y={0}
            width={stripe}
            height={finite(stripe / 2)}
          />
        </pattern>
      ))}
      {needed.diagonal && (
        <pattern
          id={ctx.ids.diagonal}
          patternUnits="userSpaceOnUse"
          width={dotStep}
          height={dotStep}
        >
          <line
            className={styles.monsterLinje}
            x1={0}
            y1={dotStep}
            x2={dotStep}
            y2={0}
            strokeWidth={u(ctx.line / 2)}
          />
        </pattern>
      )}
      {needed.dots && (
        <pattern id={ctx.ids.dots} patternUnits="userSpaceOnUse" width={dotStep} height={dotStep}>
          <circle
            className={styles.monsterPrick}
            cx={finite(dotStep / 2)}
            cy={finite(dotStep / 2)}
            r={u(ctx.d / 16)}
          />
        </pattern>
      )}
      {needed.net && (
        <pattern id={ctx.ids.net} patternUnits="userSpaceOnUse" width={hatch} height={hatch}>
          <line
            className={styles.monsterLinje}
            x1={0}
            y1={0}
            x2={hatch}
            y2={hatch}
            strokeWidth={u(0.05)}
          />
          <line
            className={styles.monsterLinje}
            x1={hatch}
            y1={0}
            x2={0}
            y2={hatch}
            strokeWidth={u(0.05)}
          />
        </pattern>
      )}
    </defs>
  );
}

/** En etikett i en symbol. `onFilled` ger ljus text på lag A:s fyllda cirkel. */
function symbolLabel(
  at: Point,
  text: string,
  size: number,
  kind: 'filled' | 'halo' | 'plain',
): ReactElement {
  return (
    <text
      className={classes(
        styles.etikett,
        kind === 'filled' && styles.etikettPaFylld,
        kind === 'halo' && styles.etikettHalo,
      )}
      x={u(at.x)}
      y={u(at.y)}
      fontSize={u(size)}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {text}
    </text>
  );
}

export interface PlayerSymbol {
  at: Point;
  lag: Team;
  keeper: boolean;
  label?: string;
  /** Grader, där 0 är åt höger. */
  facing?: number;
}

/** Spelarens form: cirkel, kvadrat eller romb efter lag, med randmönster för målvakt. */
export function player(ctx: DrawContext, symbol: PlayerSymbol, key: string): ReactElement {
  const r = ctx.d / 2;
  const { at, lag, keeper } = symbol;
  const fill = keeper ? `url(#${ctx.ids.keeper[lag]})` : undefined;
  const shapeClass = classes(styles.spelare, keeper ? KEEPER_CLASS[lag] : TEAM_CLASS[lag]);
  let shape: ReactElement;
  if (lag === 'a') {
    shape = <circle className={shapeClass} cx={u(at.x)} cy={u(at.y)} r={u(r)} fill={fill} />;
  } else if (lag === 'b') {
    const side = ctx.d * 0.9;
    shape = (
      <rect
        className={shapeClass}
        x={u(at.x - side / 2)}
        y={u(at.y - side / 2)}
        width={u(side)}
        height={u(side)}
        strokeWidth={u(ctx.line * 1.6)}
        fill={fill}
      />
    );
  } else {
    const half = r * 1.15;
    shape = (
      <polygon
        className={shapeClass}
        points={points([
          { x: at.x, y: at.y - half },
          { x: at.x + half, y: at.y },
          { x: at.x, y: at.y + half },
          { x: at.x - half, y: at.y },
        ])}
        strokeWidth={u(ctx.line)}
        fill={fill}
      />
    );
  }

  // Målvakten får etiketten MV om skissen inte anger någon (avsnitt 2).
  const label = symbol.label ?? (keeper ? 'MV' : undefined);
  const facing = symbol.facing;
  let facingLine: ReactElement | null = null;
  if (facing !== undefined) {
    const radians = (facing * Math.PI) / 180;
    const dir = { x: Math.cos(radians), y: Math.sin(radians) };
    const from = r * 1.15;
    const to = r * 1.15 + ctx.d * 0.6;
    facingLine = (
      <line
        className={styles.riktning}
        x1={u(at.x + dir.x * from)}
        y1={u(at.y + dir.y * from)}
        x2={u(at.x + dir.x * to)}
        y2={u(at.y + dir.y * to)}
        strokeWidth={u(ctx.line)}
      />
    );
  }
  return (
    <g key={key}>
      {shape}
      {facingLine}
      {ctx.detail &&
        label !== undefined &&
        label.length > 0 &&
        symbolLabel(
          at,
          label,
          ctx.d * (label.length > 2 ? 0.45 : 0.6),
          keeper ? 'halo' : lag === 'a' ? 'filled' : 'plain',
        )}
    </g>
  );
}

/** Ledaren: ofylld triangel med spetsen uppåt, etiketten L om inget annat anges. */
export function leader(ctx: DrawContext, at: Point, label: string | undefined, key: string) {
  const h = ctx.d;
  const text = label ?? 'L';
  return (
    <g key={key}>
      <polygon
        className={styles.ledare}
        points={points([
          { x: at.x, y: at.y - h * 0.6 },
          { x: at.x + h * 0.55, y: at.y + h * 0.4 },
          { x: at.x - h * 0.55, y: at.y + h * 0.4 },
        ])}
        strokeWidth={u(ctx.line)}
      />
      {ctx.detail &&
        text.length > 0 &&
        symbolLabel({ x: at.x, y: at.y + h * 0.12 }, text, ctx.d * 0.4, 'plain')}
    </g>
  );
}

/** Kon: liten fylld triangel, `0,5 × D`. */
export function cone(ctx: DrawContext, at: Point, key: string): ReactElement {
  const s = ctx.d * 0.5;
  return (
    <polygon
      key={key}
      className={styles.kon}
      points={points([
        { x: at.x, y: at.y - s * 0.55 },
        { x: at.x + s * 0.5, y: at.y + s * 0.45 },
        { x: at.x - s * 0.5, y: at.y + s * 0.45 },
      ])}
    />
  );
}

/** Boll: liten cirkel, `0,35 × D`, med ett inskrivet kryss så att den skiljs från en prick. */
export function ball(ctx: DrawContext, at: Point, key: string): ReactElement {
  const r = (ctx.d * 0.35) / 2;
  const k = r * 0.7;
  const width = u(Math.max(ctx.line / 3, r / 5));
  return (
    <g key={key}>
      <circle className={styles.boll} cx={u(at.x)} cy={u(at.y)} r={u(r)} strokeWidth={width} />
      <line
        className={styles.bollKryss}
        x1={u(at.x - k)}
        y1={u(at.y - k)}
        x2={u(at.x + k)}
        y2={u(at.y + k)}
        strokeWidth={width}
      />
      <line
        className={styles.bollKryss}
        x1={u(at.x - k)}
        y1={u(at.y + k)}
        x2={u(at.x + k)}
        y2={u(at.y - k)}
        strokeWidth={width}
      />
    </g>
  );
}

/** Markering: platta, prick eller punktstreckad linje. */
export function marking(
  ctx: DrawContext,
  form: 'platta' | 'prick' | 'linje',
  at: Point,
  to: Point | undefined,
  key: string,
): ReactElement {
  if (form === 'platta') {
    const s = ctx.d / 2;
    return (
      <rect
        key={key}
        className={styles.platta}
        x={u(at.x - s / 2)}
        y={u(at.y - s / 2)}
        width={u(s)}
        height={u(s)}
        strokeWidth={u(ctx.line * 0.8)}
      />
    );
  }
  if (form === 'prick') {
    return <circle key={key} className={styles.prick} cx={u(at.x)} cy={u(at.y)} r={u(ctx.d / 6)} />;
  }
  const end = to ?? at;
  const dash = ctx.d * 0.6;
  return (
    <line
      key={key}
      className={styles.markeringLinje}
      x1={u(at.x)}
      y1={u(at.y)}
      x2={u(end.x)}
      y2={u(end.y)}
      strokeWidth={u(ctx.line)}
      strokeDasharray={`${u(dash)} ${u(dash / 2)} ${u(dash / 6)} ${u(dash / 2)}`}
    />
  );
}

const GOAL_OPENINGS = {
  hoger: { x: 1, y: 0 },
  vanster: { x: -1, y: 0 },
  upp: { x: 0, y: -1 },
  ner: { x: 0, y: 1 },
} as const;

/**
 * Mål: två stolpar och ett tvärstreckat nät mellan dem, öppet åt `riktning` (avsnitt 2).
 * `x` och `y` är målets mitt på mållinjen, och nätet ligger 1 m bakom.
 */
export function goal(
  ctx: DrawContext,
  at: Point,
  width: number,
  opening: keyof typeof GOAL_OPENINGS,
  key: string,
): ReactElement {
  const n = GOAL_OPENINGS[opening];
  const t = { x: -n.y, y: n.x };
  const half = width / 2;
  const p1 = { x: at.x + t.x * half, y: at.y + t.y * half };
  const p2 = { x: at.x - t.x * half, y: at.y - t.y * half };
  const b1 = { x: p1.x - n.x * GOAL_DEPTH, y: p1.y - n.y * GOAL_DEPTH };
  const b2 = { x: p2.x - n.x * GOAL_DEPTH, y: p2.y - n.y * GOAL_DEPTH };
  const post = Math.max(ctx.line * 0.9, ctx.d / 10);
  return (
    <g key={key}>
      <polygon
        className={styles.malNat}
        points={points([p1, b1, b2, p2])}
        fill={`url(#${ctx.ids.net})`}
      />
      <path className={styles.malRam} d={pathData([p1, b1, b2, p2])} strokeWidth={u(ctx.line)} />
      <circle className={styles.malStolpe} cx={u(p1.x)} cy={u(p1.y)} r={u(post)} />
      <circle className={styles.malStolpe} cx={u(p2.x)} cy={u(p2.y)} r={u(post)} />
    </g>
  );
}

/**
 * Kortar en etikett så att den ryms på `room` meter (RK-7). Tecknen räknas som kodpunkter,
 * så att ett surrogatpar, till exempel ett emoji, aldrig delas mitt itu.
 */
export function fitLabel(text: string, fontSize: number, room: number): string {
  // Ett tecken är i medeltal drygt halva teckenstorleken brett.
  const fits = Math.floor(room / (fontSize * 0.58));
  const chars = Array.from(text);
  if (chars.length <= fits) {
    return text;
  }
  if (!(fits > 1)) {
    return '';
  }
  return `${chars
    .slice(0, fits - 1)
    .join('')
    .trimEnd()}…`;
}

/**
 * Zon med mönster, eller ruta med bara kontur. Etiketten placeras av `layoutLabels` i
 * etiketter.ts, så att den aldrig hamnar på en symbol eller en annan etikett (fynd C).
 */
export function rectangle(
  ctx: DrawContext,
  kind: 'zon' | 'ruta',
  item: {
    x: number;
    y: number;
    langd: number;
    bredd: number;
    pattern?: 'diagonal' | 'prickar' | 'tom';
    dashed?: boolean;
  },
  key: string,
): ReactElement {
  const fill =
    item.pattern === 'diagonal'
      ? `url(#${ctx.ids.diagonal})`
      : item.pattern === 'prickar'
        ? `url(#${ctx.ids.dots})`
        : undefined;
  return (
    <rect
      key={key}
      className={
        kind === 'zon' ? classes(styles.zon, fill === undefined && styles.zonTom) : styles.ruta
      }
      x={u(item.x)}
      y={u(item.y)}
      width={u(item.langd)}
      height={u(item.bredd)}
      fill={fill}
      strokeWidth={u(kind === 'zon' ? ctx.line / 2 : ctx.line)}
      strokeDasharray={item.dashed === true ? `${u(ctx.d * 0.5)} ${u(ctx.d * 0.35)}` : undefined}
    />
  );
}

export type MovementType = 'passning' | 'lopning' | 'dribbling' | 'skott';

export interface MovementShape {
  type: MovementType;
  /** Banan i den ritade ytans meter, redan kortad vid symbolernas kanter. */
  path: readonly Point[];
  order?: number;
  label?: string;
}

/** Bildens kanter i x-led, i den ritade ytans meter, för att korta långa etiketter (RK-7). */
export interface TextRoom {
  /** Bildens vänsterkant, alltså `-MARGIN`. */
  left: number;
  /** Bildens högerkant, alltså ytans längd plus `MARGIN`. */
  right: number;
}

/**
 * Bredden som en text med ankaret `anchor` i `x` har innan den når bildens kant (RK-7, F3).
 * En centrerad text växer åt båda hållen och får därför dubbla avståndet till den närmaste
 * kanten.
 */
export function roomAt(room: TextRoom, x: number, anchor: 'start' | 'middle' | 'end'): number {
  const toLeft = x - room.left;
  const toRight = room.right - x;
  const width =
    anchor === 'start' ? toRight : anchor === 'end' ? toLeft : 2 * Math.min(toLeft, toRight);
  return Math.max(0, width);
}

/** Radien på rörelsens ordningsring, som andel av `D`. */
export const ORDER_RING = 0.36;

/** Mitten av rörelsens ordningsring, eller `null` när rörelsen inte har någon. */
export function orderRingAt(ctx: DrawContext, shape: MovementShape): Point | null {
  const total = polylineLength(shape.path);
  if (!ctx.detail || shape.order === undefined || !(total > 0.05)) {
    return null;
  }
  const start = pointAt(shape.path, Math.min(ctx.d * 0.8, total / 3));
  const away = normal(start.tangent);
  return {
    x: start.point.x + away.x * ctx.d * 0.7,
    y: start.point.y + away.y * ctx.d * 0.7,
  };
}

/**
 * Var rörelsens etikett helst står: vid linjens mitt, på den sida som vetter uppåt så att
 * den inte hamnar i pilen. `outward` är samma sida, dit etiketten flyttas vid platsbrist.
 */
export function movementLabelAnchor(
  ctx: DrawContext,
  shape: MovementShape,
): { at: Point; outward: Point } | null {
  const total = polylineLength(shape.path);
  if (!(total > 0.05)) {
    return null;
  }
  const middle = pointAt(shape.path, total / 2);
  const away = normal(middle.tangent);
  const flip = away.y > 0 ? -1 : 1;
  const outward = { x: away.x * flip, y: away.y * flip };
  return {
    at: {
      x: middle.point.x + outward.x * ctx.d * 0.8,
      y: middle.point.y + outward.y * ctx.d * 0.8,
    },
    outward,
  };
}

/**
 * En rörelse: linjeformen efter typ (avsnitt 3) och en fylld pilspets. Linjen slutar vid
 * pilspetsens bas, så att dubbellinjen och strecken inte sticker ut genom spetsen. Etiketten
 * placeras av `layoutLabels` (etiketter.ts), se `movementLabelAnchor`.
 */
export function movement(ctx: DrawContext, shape: MovementShape, key: string): ReactElement | null {
  const total = polylineLength(shape.path);
  if (!(total > 0.05)) {
    return null;
  }
  const head = Math.min(ctx.d / 2, total * 0.6);
  const tip = pointAt(shape.path, total);
  const body = slice(shape.path, 0, total - head * 0.9);
  const width = u(ctx.line);
  const baseCenter = pointAt(shape.path, total - head).point;
  const side = normal(tip.tangent);
  const halfHead = head * 0.45;
  const arrow = (
    <polygon
      className={styles.pilspets}
      points={points([
        tip.point,
        { x: baseCenter.x + side.x * halfHead, y: baseCenter.y + side.y * halfHead },
        { x: baseCenter.x - side.x * halfHead, y: baseCenter.y - side.y * halfHead },
      ])}
    />
  );

  let lines: ReactElement;
  switch (shape.type) {
    case 'passning':
      lines = <path className={styles.rorelse} d={pathData(body)} strokeWidth={width} />;
      break;
    case 'lopning': {
      const dash = u(ctx.d * 0.45);
      lines = (
        <path
          className={styles.rorelse}
          d={pathData(body)}
          strokeWidth={width}
          strokeDasharray={`${dash} ${dash}`}
        />
      );
      break;
    }
    case 'dribbling':
      lines = (
        <path
          className={styles.rorelse}
          d={pathData(waveLine(body, ctx.d * 0.22, ctx.d * 0.9, ctx.wavePoints))}
          strokeWidth={width}
        />
      );
      break;
    case 'skott': {
      const gap = Math.max(ctx.line * 1.1, ctx.d / 9);
      lines = (
        <>
          <path
            className={styles.rorelse}
            d={pathData(offsetLine(body, gap))}
            strokeWidth={width}
          />
          <path
            className={styles.rorelse}
            d={pathData(offsetLine(body, -gap))}
            strokeWidth={width}
          />
        </>
      );
      break;
    }
  }

  let order: ReactElement | null = null;
  const at = orderRingAt(ctx, shape);
  if (at !== null) {
    order = (
      <g>
        <circle
          className={styles.ordningRing}
          cx={u(at.x)}
          cy={u(at.y)}
          r={u(ctx.d * 0.36)}
          strokeWidth={u(ctx.line * 0.6)}
        />
        <text
          className={classes(styles.etikett, styles.ordningText)}
          x={u(at.x)}
          y={u(at.y)}
          fontSize={u(ctx.d * 0.46)}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {String(shape.order)}
        </text>
      </g>
    );
  }

  return (
    <g key={key}>
      {lines}
      {arrow}
      {order}
    </g>
  );
}

/** En fri text i skissen, till exempel köns etikett eller måttexten. */
export function freeText(
  ctx: DrawContext,
  at: Point,
  text: string,
  anchor: 'start' | 'middle' | 'end',
  key: string,
  extraClass?: string,
): ReactElement {
  return (
    <text
      key={key}
      className={classes(styles.etikett, styles.etikettHalo, extraClass)}
      x={u(at.x)}
      y={u(at.y)}
      fontSize={u(ctx.d * 0.6)}
      textAnchor={anchor}
      dominantBaseline="central"
    >
      {text}
    </text>
  );
}
