/**
 * Teckenförklaringens innehåll (ADR 0012 avsnitt 3, berättelse 06 kriterium 6): en rad för
 * varje objekt- och rörelsetyp som faktiskt förekommer i den ritade skissen, i fast ordning.
 *
 * Benämningarna saknas i docs/design/texter.md och är ett förslag till UX-designern. De följer
 * orden i ADR 0012: "avslut" för skott, som i `desc`.
 */
import type { Planskissdata } from '../regelmotor/schema/planskiss.ts';
import type { ScaledPlayers, Team } from './skalning.ts';

export const LEGEND_KINDS = [
  'lag-a',
  'lag-b',
  'neutral',
  'malvakt',
  'ledare',
  'kon',
  'boll',
  'mal',
  'platta',
  'prick',
  'linje',
  'zon',
  'ruta',
  'passning',
  'lopning',
  'dribbling',
  'skott',
] as const;

export type LegendKind = (typeof LEGEND_KINDS)[number];

export const LEGEND_NAMES: Record<LegendKind, string> = {
  'lag-a': 'Spelare, lag A',
  'lag-b': 'Spelare, lag B',
  neutral: 'Neutral spelare',
  malvakt: 'Målvakt',
  ledare: 'Ledare',
  kon: 'Kon',
  boll: 'Boll',
  mal: 'Mål',
  platta: 'Platta',
  prick: 'Prick',
  linje: 'Linje på marken',
  zon: 'Zon',
  ruta: 'Ruta',
  passning: 'Passning',
  lopning: 'Löpning utan boll',
  dribbling: 'Dribbling med boll',
  skott: 'Avslut',
};

export interface LegendEntry {
  kind: LegendKind;
  name: string;
  /** Målvaktens lag, som avgör symbolens form. Bara för `malvakt`. */
  team?: Team;
}

const TEAM_KIND: Record<Team, LegendKind> = { a: 'lag-a', b: 'lag-b', neutral: 'neutral' };

/**
 * Raderna i teckenförklaringen för skissen som den ritas, med de tillagda spelarna
 * medräknade: en skiss där bara köspelarna hör till lag A ska ändå förklara lag A.
 */
export function legendEntries(sketch: Planskissdata, players: ScaledPlayers): LegendEntry[] {
  const present = new Set<LegendKind>();
  let keeperTeam: Team | undefined;
  for (const item of sketch.objekt) {
    switch (item.typ) {
      case 'spelare':
        if (item.malvakt === true) {
          present.add('malvakt');
          keeperTeam ??= item.lag;
        } else {
          present.add(TEAM_KIND[item.lag]);
        }
        break;
      case 'markering':
        present.add(item.form);
        break;
      default:
        present.add(item.typ);
    }
  }
  for (const added of players.added) {
    present.add(TEAM_KIND[added.lag]);
  }
  for (const movement of sketch.rorelser ?? []) {
    present.add(movement.typ);
  }
  return LEGEND_KINDS.filter((kind) => present.has(kind)).map((kind) =>
    kind === 'malvakt'
      ? { kind, name: LEGEND_NAMES[kind], team: keeperTeam ?? 'a' }
      : { kind, name: LEGEND_NAMES[kind] },
  );
}
