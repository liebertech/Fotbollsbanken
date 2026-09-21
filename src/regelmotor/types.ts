/**
 * Motorns typer. Allt som lämnar motorn är vanliga serialiserbara objekt, så att
 * `src/data/` kan skriva dem rakt av och `src/app/` visa dem (ADR 0011 avsnitt 1 och 3).
 */
import type {
  AreaKey,
  CorePart,
  FocusArea,
  GameFormat,
  Level,
  Phase,
  SessionPart,
  SessionPartFromBank,
} from './keys.ts';
import type { Exercise } from './schema/ovning.ts';

export type { Exercise };

/** Underlaget ledaren anger (R-020). */
export interface Input {
  alder: number;
  spelform: GameFormat;
  niva: Level;
  spelare: number;
  ledare: number;
  passlangd: number;
  fokus: FocusArea[];
  /** Yta är valfri (R-090). */
  yta?: AreaKey;
}

/** Fälten i underlaget, som de heter i gränssnittet och i R-103. */
export const INPUT_FIELDS = [
  'alder',
  'spelform',
  'niva',
  'spelare',
  'ledare',
  'passlangd',
  'fokus',
  'yta',
] as const;
export type InputField = (typeof INPUT_FIELDS)[number];

export interface InputError {
  field: InputField;
  /** Färdig text ur docs/design/texter.md, avsnitt 3. */
  message: string;
  /** Regeln som fällde värdet, för spårbarhet. */
  regel: string;
}

export type InputResult =
  | { ok: true; input: Input; phase: Phase }
  | { ok: false; errors: InputError[] };

/** Gruppindelningen för ett moment (R-051 till R-056, ADR 0011 avsnitt 3, `layout`). */
export interface Layout {
  groups: number;
  sizes: number[];
  coachesPerGroup: number;
  coachesNeeded: number;
  /** R-054. `null` när inget udda antal behöver lösas. */
  oddSolution: 'trio' | 'joker' | null;
  /** Övningens egen lösning ur `anpassning.udda_antal`, när den gäller (R-054). */
  oddText: string | null;
}

/** Ett helgruppsmoment: alla gör samma övning, i en eller flera grupper (R-038). */
export interface WholeBlock {
  kind: 'helgrupp';
  exercise: Exercise;
  layout: Layout;
  /** Tillåtna tider är varje heltal i [minMinutes, maxMinutes] (R-034). */
  minMinutes: number;
  maxMinutes: number;
  recommendedMinutes: number;
}

/** Ett stationsmoment (R-060 till R-066). */
export interface StationBlock {
  kind: 'stationer';
  exercises: Exercise[];
  /** Momentets gruppindelning: en grupp per station, som roterar (R-063, R-066). */
  layout: Layout;
  /** Samma grupper sedda från varje station, med stationens egen lösning för udda antal (R-054). */
  stationLayouts: Layout[];
  /** Stationstiden t är ett heltal i [minStation, maxStation] (R-065). */
  minStation: number;
  maxStation: number;
  recommendedStation: number;
  coachesNeeded: number;
}

export type Block = WholeBlock | StationBlock;

/** Ett moment med vald tid. */
export interface PlacedBlock {
  block: Block;
  /** Momentets tid i passet. För stationer S x t + (S - 1) (R-065). */
  minutes: number;
  /** Stationstiden t, bara för stationsmoment. */
  stationMinutes: number | null;
}

/** Radslagen i tidslinjen (ADR 0011 avsnitt 3). */
export type RowKind =
  | 'exercise'
  | 'period'
  | 'stations'
  | 'station'
  | 'break'
  | 'closing'
  | 'empty';

export interface Row {
  kind: RowKind;
  /** `null` bara för `break`, som ligger mellan delar (ADR 0011 avsnitt 3). */
  part: SessionPart | null;
  /** Momentets nummer i passet. Rader i samma moment delar värde. */
  block: number | null;
  /** Stationens nummer inom momentet, 1-baserat. */
  station: number | null;
  stationMinutes: number | null;
  /** Radens tid. Stationsrader äger ingen tid, de har 0 (ADR 0011 avsnitt 3). */
  minutes: number;
  /** Ögonblicksbild av övningen, oförändrad (ADR 0011 avsnitt 3). */
  exercise: Exercise | null;
  layout: Layout | null;
}

/** Varför en del saknar övning (R-100, R-103). */
export type EmptyReason =
  /** Delen kan inte fyllas för sig. R-103 pekar ut vilka val som kan ändras. */
  | 'val-kan-andras'
  /** Delen kan fyllas för sig men inte ihop med resten av passet (R-100, andra punkten). */
  | 'gar-inte-att-kombinera';

/** En del i det färdiga passet. */
export interface PartResult {
  part: SessionPartFromBank;
  /** Måltiden enligt R-032. */
  target: number;
  /** Faktisk tid. 0 när delen saknar övning. */
  minutes: number;
  status: 'fylld' | 'saknar-ovning';
  /** Ersättningsfokus enligt R-121, när delen har ett. */
  substituteFocus: FocusArea | null;
  /** Ledarens valda fokusområden som saknade övningar för delen (R-121). */
  missingFocus: FocusArea[];
  emptyReason: EmptyReason | null;
  /** Val som var för sig skulle kunna ge en övning i delen (R-103). */
  changeableFields: InputField[];
}

/** Påminnelser och tips. Texterna ligger i gränssnittet (docs/design/texter.md). */
export type NoticeKind = 'fler-vuxna' | 'forankrade-mal' | 'benskydd';

export interface Notice {
  kind: NoticeKind;
  regel: string;
}

export interface Session {
  input: Input;
  phase: Phase;
  seed: string;
  /** Passets faktiska totaltid, summan av radernas minuter utom stationsrader (R-036). */
  totalMinutes: number;
  /** Den längd ledaren bad om. */
  requestedMinutes: number;
  rows: Row[];
  parts: PartResult[];
  /** Delar som togs bort enligt R-033. De nämns aldrig i passet. */
  removedParts: SessionPartFromBank[];
  notices: Notice[];
  /** Längsta sammanhängande aktiva tid utan paus (post 11 i R-048). */
  longestStretch: number;
}

/** Förklaringen när inget pass kunde skapas (R-101, R-103). */
export interface NoSessionReason {
  /** Val som var för sig skulle kunna ge ett pass (R-103). */
  changeableFields: InputField[];
}

export type GenerationResult =
  | { kind: 'session'; session: Session }
  | { kind: 'none'; reason: NoSessionReason };

export type { AreaKey, CorePart, FocusArea, GameFormat, Level, Phase, SessionPart, SessionPartFromBank };
