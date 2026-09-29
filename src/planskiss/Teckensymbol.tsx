/**
 * Symbolen på en rad i teckenförklaringen: samma symbol som i skissen, ritad med samma
 * funktioner, i en liten SVG. Symbolen är dekorativ (`aria-hidden`): benämningen i ord står
 * bredvid i listan (ADR 0012 avsnitt 3).
 */
import type { ReactElement } from 'react';
import { INSTANCE_ID_PATTERN, InvalidInstanceIdError } from './Planskiss.tsx';
import type { PlanskissStorlek } from './Planskiss.tsx';
import { u } from './matt.ts';
import type { Point } from './matt.ts';
import type { Team } from './skalning.ts';
import {
  ball,
  cone,
  goal,
  leader,
  marking,
  movement,
  patternDefs,
  patternIds,
  player,
  rectangle,
} from './symboler.tsx';
import type { DrawContext } from './symboler.tsx';
import type { LegendKind } from './teckenforklaring.ts';
import styles from './planskiss.module.css';

/** Symbolrutan är 4 × 2 m, ritad med den minsta spelarsymbolen. */
const BOX = { langd: 4, bredd: 2 };
const D = 1.2;
const CENTER: Point = { x: BOX.langd / 2, y: BOX.bredd / 2 };

export interface TeckensymbolProps {
  kind: LegendKind;
  /** Målvaktens lag, som avgör formen. */
  team?: Team;
  /** Samma prefix som skissen. Symbolens mönster får egna id:n under det (RK-4). */
  instansId: string;
  storlek?: PlanskissStorlek;
}

function symbol(ctx: DrawContext, kind: LegendKind, team: Team): ReactElement | null {
  const line = (type: 'passning' | 'lopning' | 'dribbling' | 'skott') =>
    movement(
      ctx,
      {
        type,
        path: [
          { x: 0.2, y: CENTER.y },
          { x: BOX.langd - 0.2, y: CENTER.y },
        ],
      },
      { width: BOX.langd },
      kind,
    );
  switch (kind) {
    case 'lag-a':
      return player(ctx, { at: CENTER, lag: 'a', keeper: false }, kind);
    case 'lag-b':
      return player(ctx, { at: CENTER, lag: 'b', keeper: false }, kind);
    case 'neutral':
      return player(ctx, { at: CENTER, lag: 'neutral', keeper: false }, kind);
    case 'malvakt':
      return player(ctx, { at: CENTER, lag: team, keeper: true }, kind);
    case 'ledare':
      return leader(ctx, CENTER, undefined, kind);
    case 'kon':
      return cone(ctx, CENTER, kind);
    case 'boll':
      return ball({ ...ctx, d: D * 2.5 }, CENTER, kind);
    case 'mal':
      return goal(ctx, { x: 1.4, y: CENTER.y }, 1.6, 'hoger', kind);
    case 'platta':
    case 'prick':
      return marking(ctx, kind, CENTER, undefined, kind);
    case 'linje':
      return marking(
        ctx,
        'linje',
        { x: 0.2, y: CENTER.y },
        { x: BOX.langd - 0.2, y: CENTER.y },
        kind,
      );
    case 'zon':
      return rectangle(
        ctx,
        'zon',
        { x: 0.4, y: 0.2, langd: 3.2, bredd: 1.6, pattern: 'diagonal' },
        0,
        kind,
      );
    case 'ruta':
      return rectangle(ctx, 'ruta', { x: 0.4, y: 0.2, langd: 3.2, bredd: 1.6 }, 0, kind);
    case 'passning':
    case 'lopning':
    case 'dribbling':
    case 'skott':
      return line(kind);
  }
}

export function Teckensymbol({
  kind,
  team = 'a',
  instansId,
  storlek = 'normal',
}: TeckensymbolProps): ReactElement {
  if (!INSTANCE_ID_PATTERN.test(instansId)) {
    throw new InvalidInstanceIdError();
  }
  const ctx: DrawContext = {
    d: D,
    line: storlek === 'planlage' ? D / 6 : D / 8,
    // Symbolen visar formen, aldrig en etikett.
    detail: false,
    ids: patternIds(`${instansId}-tf-${kind}`),
  };
  const needed = {
    keeper: new Set<Team>(kind === 'malvakt' ? [team] : []),
    diagonal: kind === 'zon',
    dots: false,
    net: kind === 'mal',
  };
  const sizeClass = storlek === 'normal' || storlek === 'miniatyr' ? undefined : styles[storlek];
  return (
    <svg
      className={[styles.skiss, styles.teckensymbol, sizeClass].filter(Boolean).join(' ')}
      viewBox={`0 0 ${u(BOX.langd)} ${u(BOX.bredd)}`}
      aria-hidden="true"
    >
      {patternDefs(ctx, needed)}
      {symbol(ctx, kind, team)}
    </svg>
  );
}
