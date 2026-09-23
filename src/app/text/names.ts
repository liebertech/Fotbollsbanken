/**
 * Domännycklarnas namn på svenska. Nycklarna är frysta data; namnen är det ledaren läser
 * (docs/doman/fokusomraden.md, nivaer.md, spelformer.md och docs/design/texter.md).
 *
 * Namnen ligger samlade här, så att ingen vy hittar på ett eget namn för en nyckel.
 */
import {
  AREA_KEYS,
  FOCUS_AREAS,
  GAME_FORMATS,
  LEVELS,
  SESSION_PARTS,
} from '../../regelmotor/index.ts';
import type {
  AreaKey,
  FocusArea,
  GameFormat,
  Level,
  NoticeKind,
  Exercise,
  InputField,
  SessionPart,
} from '../../regelmotor/index.ts';

/** Källa: docs/doman/fokusomraden.md, kolumnen Namn. */
export const FOCUS_AREA_NAMES: Record<FocusArea, string> = {
  bollkansla: 'Bollkänsla',
  dribbling: 'Dribbling och driva bollen',
  'passning-mottagning': 'Passning och mottagning',
  avslut: 'Avslut',
  nickspel: 'Nickspel',
  'ett-mot-ett': '1 mot 1',
  spelbarhet: 'Spela tillsammans',
  speluppbyggnad: 'Speluppbyggnad',
  forsvarsspel: 'Försvarsspel',
  omstallning: 'Omställning',
  'fasta-situationer': 'Fasta situationer',
  malvaktsspel: 'Målvaktsspel',
  koordination: 'Rörelse och koordination',
  snabbhet: 'Snabbhet',
  uthallighet: 'Uthållighet',
  skadeforebyggande: 'Skadeförebyggande',
  lek: 'Lek',
};

/**
 * Fokusområdenas grupper, i den ordning de visas. Källa: fokusomraden.md, *Fokusområdena*.
 * Grupperna är bara en rubrik i listan; regelmotorn känner inte till dem.
 */
export const FOCUS_GROUPS: readonly { key: string; name: string; areas: readonly FocusArea[] }[] = [
  {
    key: 'grupp-teknik',
    name: 'Bollen och tekniken',
    areas: ['bollkansla', 'dribbling', 'passning-mottagning', 'avslut', 'nickspel'],
  },
  {
    key: 'grupp-spel',
    name: 'Spelet',
    areas: [
      'ett-mot-ett',
      'spelbarhet',
      'speluppbyggnad',
      'forsvarsspel',
      'omstallning',
      'fasta-situationer',
    ],
  },
  { key: 'grupp-malvakt', name: 'Målvakt', areas: ['malvaktsspel'] },
  {
    key: 'grupp-fysik',
    name: 'Kropp och rörelse',
    areas: ['koordination', 'snabbhet', 'uthallighet', 'skadeforebyggande'],
  },
  { key: 'grupp-lek', name: 'Lek', areas: ['lek'] },
];

/** Källa: docs/doman/nivaer.md. */
export const LEVEL_NAMES: Record<Level, string> = {
  'niva-1': 'Grund',
  'niva-2': 'Fortsättning',
  'niva-3': 'Fördjupning',
};

/** Källa: docs/doman/spelformer.md. */
export const GAME_FORMAT_NAMES: Record<GameFormat, string> = {
  '3mot3': '3 mot 3',
  '5mot5': '5 mot 5',
  '7mot7': '7 mot 7',
  '9mot9': '9 mot 9',
  '11mot11': '11 mot 11',
};

/** Källa: docs/design/texter.md avsnitt 4, raden *Del, namn*. */
export const PART_NAMES: Record<SessionPart, string> = {
  'del-uppvarmning': 'Uppvärmning',
  'del-ovning': 'Öva',
  'del-spelovning': 'Spelövning',
  'del-spel': 'Spel',
  'del-avslutning': 'Avslutning',
};

/** Källa: docs/design/texter.md avsnitt 3, raden *Alternativ, yta*. */
export const AREA_NAMES: Record<AreaKey, string> = {
  'yta-hel': 'Hel plan',
  'yta-halv': 'Halv plan',
  'yta-kvart': 'Kvarts plan',
};

/** Fältens namn, som de heter i formuläret och i listan över val som kan ändras (R-103). */
export const FIELD_NAMES: Record<InputField, string> = {
  alder: 'Ålder',
  spelform: 'Spelform',
  niva: 'Nivå',
  spelare: 'Antal spelare',
  ledare: 'Antal ledare',
  passlangd: 'Passets längd',
  fokus: 'Fokusområden',
  yta: 'Yta',
};

/** Källa: docs/design/texter.md avsnitt 4, tips- och varningsraderna. */
export const NOTICE_TEXTS: Record<NoticeKind, { kind: 'tips' | 'varning'; text: string }> = {
  'fler-vuxna': {
    kind: 'tips',
    text: 'Ni är fler spelare per ledare än vad som brukar rekommenderas för den här åldern. Ta gärna hjälp av en förälder eller en äldre spelare.',
  },
  'forankrade-mal': {
    kind: 'varning',
    text: 'Kom ihåg att alla mål, även små, ska vara förankrade så att de inte kan välta.',
  },
  benskydd: {
    kind: 'varning',
    text: 'Använd benskydd på träningen – spel innehåller alltid närkamper.',
  },
};

/** Stationernas etiketter. Källa: docs/design/texter.md avsnitt 4, *Stationsetikett*. */
const STATION_LETTERS = 'ABCDEFGH';

export function stationLabel(station: number): string {
  return `Station ${STATION_LETTERS[station - 1] ?? station}`;
}

/** Namnen används i tester för att kontrollera att ingen nyckel saknar namn. */
export const NAMED_KEYS = {
  focusAreas: FOCUS_AREAS,
  levels: LEVELS,
  gameFormats: GAME_FORMATS,
  parts: SESSION_PARTS,
  areas: AREA_KEYS,
} as const;

/** Materialtypen i klartext. Källa: docs/doman/passuppbyggnad.md, avsnittet *Material*. */
type MaterialType = NonNullable<Exercise['material']>[number]['typ'];

export const MATERIAL_NAMES: Record<MaterialType, { singular: string; plural: string }> = {
  boll: { singular: 'boll', plural: 'bollar' },
  kon: { singular: 'kon', plural: 'koner' },
  markering: { singular: 'markering', plural: 'markeringar' },
  vast: { singular: 'väst', plural: 'västar' },
  mal: { singular: 'mål', plural: 'mål' },
  minimal: { singular: 'minimål', plural: 'minimål' },
  hinder: { singular: 'hinder', plural: 'hinder' },
  ovrigt: { singular: 'övrigt', plural: 'övrigt' },
};

/** "3 koner", "1 boll". En anteckning ersätter typens namn (R-120). */
export function materialText(item: {
  typ: MaterialType;
  antal: number;
  anteckning?: string;
}): string {
  const name =
    item.anteckning ?? MATERIAL_NAMES[item.typ][item.antal === 1 ? 'singular' : 'plural'];
  return `${item.antal} ${name}`;
}
