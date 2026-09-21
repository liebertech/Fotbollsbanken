/**
 * Frysta domännycklar och de tabellvärden schemat behöver.
 *
 * ADR 0011 avsnitt 1: keys.ts är den enda platsen där domänens siffror finns, och varje
 * tabell pekar ut sin källfil och sitt regel-ID. Filen fylls på när regelmotorn byggs;
 * här finns det som övningsschemat (ADR 0010) behöver.
 *
 * Domännycklarna är data och behåller sin svenska stavning (ADR 0011, *Namn*).
 */

/** Åldersfaser. Källa: docs/doman/aldrar-och-fokus.md, R-012. */
export const PHASES = ['fas-6-7', 'fas-8-9', 'fas-10-12', 'fas-13-14', 'fas-15-19'] as const;
export type Phase = (typeof PHASES)[number];

/** Åldersspann per fas. Källa: R-012. */
export const PHASE_AGES: Record<Phase, { min: number; max: number }> = {
  'fas-6-7': { min: 6, max: 7 },
  'fas-8-9': { min: 8, max: 9 },
  'fas-10-12': { min: 10, max: 12 },
  'fas-13-14': { min: 13, max: 14 },
  'fas-15-19': { min: 15, max: 19 },
};

/** Lägsta och högsta ålder appen stöder. Källa: R-011, R-003. */
export const AGE_MIN = 6;
export const AGE_MAX = 19;

/** Spelformer i ordning. Källa: docs/doman/spelformer.md, R-014. */
export const GAME_FORMATS = ['3mot3', '5mot5', '7mot7', '9mot9', '11mot11'] as const;
export type GameFormat = (typeof GAME_FORMATS)[number];

/** Spelform som föreslås för en ålder. Källa: spelformer.md, R-013. */
export const GAME_FORMAT_AGES: Record<GameFormat, { min: number; max: number }> = {
  '3mot3': { min: 6, max: 7 },
  '5mot5': { min: 8, max: 9 },
  '7mot7': { min: 10, max: 12 },
  '9mot9': { min: 13, max: 14 },
  '11mot11': { min: 15, max: 19 },
};

/** Nivåer. Källa: docs/doman/nivaer.md, R-001, R-016. */
export const LEVELS = ['niva-1', 'niva-2', 'niva-3'] as const;
export type Level = (typeof LEVELS)[number];

/** Passdelar som fylls från banken. Källa: docs/doman/passuppbyggnad.md, R-005, R-030. */
export const SESSION_PARTS_FROM_BANK = [
  'del-uppvarmning',
  'del-ovning',
  'del-spelovning',
  'del-spel',
] as const;
export type SessionPartFromBank = (typeof SESSION_PARTS_FROM_BANK)[number];

/** Avslutningen är ett fast inslag och får aldrig märkas på en övning. Källa: R-005, R-031. */
export const CLOSING_PART = 'del-avslutning';

/** Grupptyper. Källa: passuppbyggnad.md, R-008. */
export const GROUP_TYPES = ['fri', 'par', 'tva-lag', 'fast-storlek'] as const;
export type GroupType = (typeof GROUP_TYPES)[number];

/** Materialtyper, sluten lista. Källa: passuppbyggnad.md avsnitt *Material*, R-120. */
export const MATERIAL_TYPES = [
  'boll',
  'kon',
  'markering',
  'vast',
  'mal',
  'minimal',
  'hinder',
  'ovrigt',
] as const;
export type MaterialType = (typeof MATERIAL_TYPES)[number];

/** Materialtyp som kräver en anteckning. Källa: R-120. */
export const MATERIAL_TYPE_REQUIRING_NOTE = 'ovrigt';

/** Materialtyper som utlöser påminnelsen om förankrade mål. Källa: R-084, passuppbyggnad.md. */
export const MATERIAL_TYPES_WITH_GOAL: readonly MaterialType[] = ['mal', 'minimal'];

/** Fokusområden. Källa: docs/doman/fokusomraden.md, R-002. */
export const FOCUS_AREAS = [
  'bollkansla',
  'dribbling',
  'passning-mottagning',
  'avslut',
  'nickspel',
  'ett-mot-ett',
  'spelbarhet',
  'speluppbyggnad',
  'forsvarsspel',
  'omstallning',
  'fasta-situationer',
  'malvaktsspel',
  'koordination',
  'snabbhet',
  'uthallighet',
  'skadeforebyggande',
  'lek',
] as const;
export type FocusArea = (typeof FOCUS_AREAS)[number];

/** Fokusområdet nickning. Källa: R-080 till R-083, aldrar-och-fokus.md. */
export const FOCUS_AREA_HEADING = 'nickspel';

/** Lägsta ålder för nickspel. Källa: R-081, SvFF via aldrar-och-fokus.md. */
export const HEADING_MIN_AGE = 13;

/**
 * K = kärnområde, R = relevant, '-' = inte aktuellt för fasen.
 * Källa: fokusomraden.md, tabellen *Vilka fokusområden som gäller för vilka åldrar*, R-002.
 */
export type FocusRelevance = 'K' | 'R' | '-';

export const FOCUS_BY_PHASE: Record<FocusArea, Record<Phase, FocusRelevance>> = {
  bollkansla: {
    'fas-6-7': 'K',
    'fas-8-9': 'K',
    'fas-10-12': 'R',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  dribbling: {
    'fas-6-7': 'K',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  'passning-mottagning': {
    'fas-6-7': 'R',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  avslut: { 'fas-6-7': 'K', 'fas-8-9': 'K', 'fas-10-12': 'K', 'fas-13-14': 'K', 'fas-15-19': 'K' },
  nickspel: {
    'fas-6-7': '-',
    'fas-8-9': '-',
    'fas-10-12': '-',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  'ett-mot-ett': {
    'fas-6-7': 'K',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  spelbarhet: {
    'fas-6-7': 'R',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  speluppbyggnad: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  forsvarsspel: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  omstallning: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  'fasta-situationer': {
    'fas-6-7': '-',
    'fas-8-9': '-',
    'fas-10-12': 'R',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  malvaktsspel: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'R',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  koordination: {
    'fas-6-7': 'K',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  snabbhet: {
    'fas-6-7': 'R',
    'fas-8-9': 'R',
    'fas-10-12': 'R',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  uthallighet: {
    'fas-6-7': '-',
    'fas-8-9': '-',
    'fas-10-12': '-',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  skadeforebyggande: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'R',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  lek: { 'fas-6-7': 'K', 'fas-8-9': 'K', 'fas-10-12': 'R', 'fas-13-14': 'R', 'fas-15-19': 'R' },
};

/** Statusvärden för en fil i content/ovningar/. Källa: ADR 0010 avsnitt 4, content/ovningar/README.md. */
export const EXERCISE_STATUSES = ['utkast', 'granskad', 'atgarda', 'godkand'] as const;
export type ExerciseStatus = (typeof EXERCISE_STATUSES)[number];

/** Statusar som kräver att alla bankfält är ifyllda. Källa: ADR 0010 avsnitt 5. */
export const STATUSES_REQUIRING_BANK_FIELDS: readonly ExerciseStatus[] = ['granskad', 'godkand'];

/**
 * Fasen bestäms av åldern, aldrig av spelformen.
 *
 * @regel R-012
 */
export function phaseForAge(age: number): Phase | undefined {
  return PHASES.find((phase) => {
    const span = PHASE_AGES[phase];
    return age >= span.min && age <= span.max;
  });
}

/**
 * Alla faser som ett åldersspann berör.
 *
 * @regel R-002
 */
export function phasesForAgeSpan(minAge: number, maxAge: number): Phase[] {
  return PHASES.filter((phase) => {
    const span = PHASE_AGES[phase];
    return span.min <= maxAge && span.max >= minAge;
  });
}

/**
 * Spelformen som föreslås för en ålder.
 *
 * @regel R-013
 */
export function suggestedGameFormat(age: number): GameFormat | undefined {
  return GAME_FORMATS.find((format) => {
    const span = GAME_FORMAT_AGES[format];
    return age >= span.min && age <= span.max;
  });
}

/**
 * Den föreslagna spelformen och dess närmaste grannar i ordningen.
 *
 * @regel R-014
 */
export function allowedGameFormats(age: number): GameFormat[] {
  const suggested = suggestedGameFormat(age);
  if (suggested === undefined) {
    return [];
  }
  const index = GAME_FORMATS.indexOf(suggested);
  return GAME_FORMATS.slice(Math.max(0, index - 1), index + 2);
}

/**
 * Är fokusområdet K eller R för fasen?
 *
 * @regel R-002
 * @regel R-027
 */
export function isFocusAreaRelevant(focus: FocusArea, phase: Phase): boolean {
  return FOCUS_BY_PHASE[focus][phase] !== '-';
}

// ---------------------------------------------------------------------------
// Tabellvärden som generatorn använder. Varje tabell pekar ut sin källfil och sitt
// regel-ID (ADR 0011 avsnitt 1). Ingen annan modul får ha en siffra ur domänen
// inbakad i logiken.
// ---------------------------------------------------------------------------

/** Passets delar i ordning. Källa: passuppbyggnad.md, R-030. */
export const SESSION_PARTS = [
  'del-uppvarmning',
  'del-ovning',
  'del-spelovning',
  'del-spel',
  CLOSING_PART,
] as const;
export type SessionPart = (typeof SESSION_PARTS)[number];

/** Kärnan i passet. Bara de här delarna kan få ett ersättningsfokus. Källa: R-041, R-121. */
export const CORE_PARTS = ['del-ovning', 'del-spelovning'] as const;
export type CorePart = (typeof CORE_PARTS)[number];

/**
 * Ordningen delarna prövas i, post 2 i R-048. Generatorn fyller delarna i samma ordning
 * (ADR 0011 avsnitt 5, steg 2).
 *
 * @regel R-048
 */
export const PART_PRIORITY_ORDER = [
  'del-ovning',
  'del-spelovning',
  'del-spel',
  'del-uppvarmning',
] as const;

/** Delarna som R-101 prövar: kan ingen av dem fyllas skapas inget pass. Källa: R-101. */
export const PARTS_REQUIRED_FOR_SESSION = ['del-ovning', 'del-spelovning', 'del-spel'] as const;

/** Högsta antal spelare per ledare. Källa: passuppbyggnad.md, R-050, R-021. */
export const COACH_CAP: Record<Phase, number> = {
  'fas-6-7': 8,
  'fas-8-9': 10,
  'fas-10-12': 12,
  'fas-13-14': 14,
  'fas-15-19': 16,
};

/** Hur ofta åldern behöver en vattenpaus, i minuter. Källa: passuppbyggnad.md, R-031. */
export const BREAK_INTERVAL: Record<Phase, number> = {
  'fas-6-7': 15,
  'fas-8-9': 15,
  'fas-10-12': 20,
  'fas-13-14': 20,
  'fas-15-19': 25,
};

/** En vattenpaus är 2 minuter. Källa: R-031. */
export const BREAK_MINUTES = 2;

/** Avslutningens längd. Källa: R-031. */
export const CLOSING_MINUTES = { kort: 3, lang: 5 } as const;

/** Faser där avslutningen alltid är kort, oavsett passlängd. Källa: R-031. */
export const PHASES_WITH_SHORT_CLOSING: readonly Phase[] = ['fas-6-7', 'fas-8-9'];

/** Passlängden som avgör om avslutningen är 3 eller 5 minuter för övriga faser. Källa: R-031. */
export const CLOSING_LONG_FROM_MINUTES = 60;

/** Kortaste passlängd, alla faser. Källa: passuppbyggnad.md, R-018. */
export const SESSION_LENGTH_MIN = 30;

/** Längsta passlängd per fas. Källa: passuppbyggnad.md, R-018. */
export const SESSION_LENGTH_MAX: Record<Phase, number> = {
  'fas-6-7': 60,
  'fas-8-9': 75,
  'fas-10-12': 90,
  'fas-13-14': 90,
  'fas-15-19': 120,
};

/**
 * Andel av den aktiva tiden per del, i hela procent. `del-spel` får resten.
 * Källa: passuppbyggnad.md, R-032.
 */
export const PART_SHARES: Record<
  Phase,
  Record<'del-uppvarmning' | 'del-ovning' | 'del-spelovning', number>
> = {
  'fas-6-7': { 'del-uppvarmning': 25, 'del-ovning': 25, 'del-spelovning': 15 },
  'fas-8-9': { 'del-uppvarmning': 20, 'del-ovning': 25, 'del-spelovning': 20 },
  'fas-10-12': { 'del-uppvarmning': 20, 'del-ovning': 20, 'del-spelovning': 25 },
  'fas-13-14': { 'del-uppvarmning': 25, 'del-ovning': 15, 'del-spelovning': 25 },
  'fas-15-19': { 'del-uppvarmning': 25, 'del-ovning': 15, 'del-spelovning': 25 },
};

/** En del under så här många minuter tas bort ur passet. Källa: R-033. */
export const PART_MIN_MINUTES = 5;

/** Hur mycket en del får avvika från sin måltid. Källa: R-035. */
export const PART_TOLERANCE = 3;

/** Hur mycket kortare hela passet får bli än den begärda längden. Källa: R-036. */
export const SESSION_SHORTFALL = 5;

/** Kortaste tid en övning kan få i ett pass. Källa: R-034, R-065. */
export const EXERCISE_MIN_MINUTES = 5;

/** Längsta tid en övning får ta, per fas och del. Källa: passuppbyggnad.md, R-034. */
export const EXERCISE_MAX_MINUTES: Record<Phase, { ovrigt: number; spel: number }> = {
  'fas-6-7': { ovrigt: 8, spel: 20 },
  'fas-8-9': { ovrigt: 10, spel: 25 },
  'fas-10-12': { ovrigt: 15, spel: 30 },
  'fas-13-14': { ovrigt: 20, spel: 35 },
  'fas-15-19': { ovrigt: 25, spel: 45 },
};

/** Antal stationer i ett stationsmoment. Källa: R-061. */
export const STATION_COUNT = { min: 2, max: 4 } as const;

/** Ett stationsbyte tar en minut. Källa: R-065. */
export const STATION_CHANGE_MINUTES = 1;

/** Delarna där ett stationsmoment får förekomma. Källa: R-060. */
export const PARTS_ALLOWING_STATIONS: readonly SessionPart[] = ['del-ovning', 'del-spelovning'];

/** Minsta antal ledare för ett stationsmoment. Källa: R-060. */
export const STATION_MIN_COACHES = 2;

/** Antal spelare och ledare i underlaget. Källa: R-017. */
export const PLAYER_COUNT = { min: 1, max: 40 } as const;
export const COACH_COUNT = { min: 1, max: 10 } as const;

/** Antal fokusområden ledaren kan välja. Källa: R-019. */
export const FOCUS_CHOICE_COUNT = { min: 1, max: 3 } as const;

/** Fokusområden som förbereder kroppen i uppvärmningen, per fas. Källa: R-044. */
export const WARMUP_BODY_FOCUS: Record<Phase, readonly FocusArea[]> = {
  'fas-6-7': ['lek', 'bollkansla', 'koordination'],
  'fas-8-9': ['lek', 'bollkansla', 'koordination', 'skadeforebyggande'],
  'fas-10-12': ['skadeforebyggande', 'koordination'],
  'fas-13-14': ['skadeforebyggande'],
  'fas-15-19': ['skadeforebyggande'],
};

/**
 * Sammanlagd tid för övningar med `nickspel` per pass. Faserna under 13 år har taket 0,
 * eftersom nickning inte förekommer alls där (R-080).
 *
 * Källa: R-082.
 */
export const HEADING_MINUTES_CAP: Record<Phase, number> = {
  'fas-6-7': 0,
  'fas-8-9': 0,
  'fas-10-12': 0,
  'fas-13-14': 10,
  'fas-15-19': 20,
};

/** Ytor ledaren kan välja. Källa: R-090. */
export const AREA_KEYS = ['yta-hel', 'yta-halv', 'yta-kvart'] as const;
export type AreaKey = (typeof AREA_KEYS)[number];

/** Ytornas mått, längd x bredd i meter. Källa: R-091. */
export const AREA_SIZES: Record<AreaKey, { langd: number; bredd: number }> = {
  'yta-hel': { langd: 105, bredd: 65 },
  'yta-halv': { langd: 65, bredd: 52 },
  'yta-kvart': { langd: 52, bredd: 32 },
};

/** Marginal i meter runt varje grupp när flera grupper är i gång samtidigt. Källa: R-092. */
export const AREA_MARGIN = 3;

/**
 * Närliggande fokusområden per passdel. Ordningen i varje lista är den ordning generatorn
 * prövar dem i.
 *
 * Källa: R-121, tabellen *Vilka fokusområden som ligger nära varandra*.
 */
export const FOCUS_NEIGHBOURS: Record<FocusArea, Record<CorePart, readonly FocusArea[]>> = {
  bollkansla: {
    'del-ovning': ['dribbling', 'passning-mottagning', 'koordination'],
    'del-spelovning': ['ett-mot-ett', 'dribbling'],
  },
  dribbling: {
    'del-ovning': ['bollkansla', 'ett-mot-ett'],
    'del-spelovning': ['ett-mot-ett', 'omstallning'],
  },
  'passning-mottagning': {
    'del-ovning': ['bollkansla', 'spelbarhet'],
    'del-spelovning': ['spelbarhet', 'speluppbyggnad'],
  },
  avslut: {
    'del-ovning': ['dribbling', 'passning-mottagning'],
    'del-spelovning': ['ett-mot-ett', 'omstallning'],
  },
  nickspel: {
    'del-ovning': ['avslut', 'passning-mottagning'],
    'del-spelovning': ['fasta-situationer', 'avslut'],
  },
  'ett-mot-ett': {
    'del-ovning': ['dribbling', 'bollkansla'],
    'del-spelovning': ['dribbling', 'forsvarsspel'],
  },
  spelbarhet: {
    'del-ovning': ['passning-mottagning', 'bollkansla'],
    'del-spelovning': ['speluppbyggnad', 'passning-mottagning'],
  },
  speluppbyggnad: {
    'del-ovning': ['passning-mottagning', 'spelbarhet'],
    'del-spelovning': ['spelbarhet', 'passning-mottagning'],
  },
  forsvarsspel: {
    'del-ovning': ['ett-mot-ett', 'koordination'],
    'del-spelovning': ['ett-mot-ett', 'omstallning'],
  },
  omstallning: {
    'del-ovning': ['passning-mottagning', 'snabbhet'],
    'del-spelovning': ['forsvarsspel', 'spelbarhet'],
  },
  'fasta-situationer': {
    'del-ovning': ['passning-mottagning', 'avslut'],
    'del-spelovning': ['avslut', 'forsvarsspel'],
  },
  malvaktsspel: {
    'del-ovning': ['avslut', 'passning-mottagning'],
    'del-spelovning': ['avslut', 'speluppbyggnad'],
  },
  koordination: {
    'del-ovning': ['bollkansla', 'snabbhet'],
    'del-spelovning': ['snabbhet', 'ett-mot-ett'],
  },
  snabbhet: {
    'del-ovning': ['koordination', 'dribbling'],
    'del-spelovning': ['ett-mot-ett', 'omstallning'],
  },
  uthallighet: {
    'del-ovning': ['snabbhet', 'koordination'],
    'del-spelovning': ['spelbarhet', 'omstallning'],
  },
  skadeforebyggande: {
    'del-ovning': ['koordination', 'bollkansla'],
    'del-spelovning': ['koordination', 'snabbhet'],
  },
  lek: {
    'del-ovning': ['bollkansla', 'dribbling', 'koordination'],
    'del-spelovning': ['ett-mot-ett', 'spelbarhet'],
  },
};

/**
 * Avvikelser per åldersfas. Där en rad gäller används dess ordning i stället för tabellens.
 *
 * Källa: R-121, tabellen *Avvikelser per åldersfas*.
 */
export const FOCUS_NEIGHBOUR_DEVIATIONS: readonly {
  focus: FocusArea;
  part: CorePart;
  phases: readonly Phase[];
  order: readonly FocusArea[];
}[] = [
  {
    focus: 'lek',
    part: 'del-ovning',
    phases: ['fas-10-12', 'fas-13-14', 'fas-15-19'],
    order: ['dribbling', 'koordination', 'bollkansla'],
  },
  {
    focus: 'lek',
    part: 'del-spelovning',
    phases: ['fas-13-14', 'fas-15-19'],
    order: ['spelbarhet', 'ett-mot-ett'],
  },
  {
    focus: 'koordination',
    part: 'del-ovning',
    phases: ['fas-13-14', 'fas-15-19'],
    order: ['snabbhet', 'skadeforebyggande', 'bollkansla'],
  },
];

/** Fokusområden som aldrig kan bli ersättningsfokus. Källa: R-121. */
export const FOCUS_NEVER_SUBSTITUTE: readonly FocusArea[] = ['nickspel', 'malvaktsspel'];

/**
 * Taket per ledare för fasen.
 *
 * @regel R-050
 * @regel R-021
 */
export function coachCap(phase: Phase): number {
  return COACH_CAP[phase];
}

/**
 * Längsta tid en övning får ta i en del.
 *
 * @regel R-034
 */
export function maxExerciseMinutes(phase: Phase, part: SessionPart): number {
  return part === 'del-spel' ? EXERCISE_MAX_MINUTES[phase].spel : EXERCISE_MAX_MINUTES[phase].ovrigt;
}

/**
 * Den ordnade listan med närliggande fokusområden för ett valt fokus och en del, med fasens
 * avvikelse inräknad.
 *
 * @regel R-121
 */
export function focusNeighbours(
  focus: FocusArea,
  part: CorePart,
  phase: Phase,
): readonly FocusArea[] {
  const deviation = FOCUS_NEIGHBOUR_DEVIATIONS.find(
    (row) => row.focus === focus && row.part === part && row.phases.includes(phase),
  );
  return deviation ? deviation.order : FOCUS_NEIGHBOURS[focus][part];
}
