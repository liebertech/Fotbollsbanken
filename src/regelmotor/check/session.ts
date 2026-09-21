/**
 * Kontroll av samtliga krav mot det färdiga passet.
 *
 * Modulen importerar bara `keys` och `types`, aldrig den kod den kontrollerar. Det är
 * avsiktligt: kontrollen är en oberoende andra implementation av kraven och används som
 * orakel i testerna (ADR 0011 avsnitt 1 och 7). Den räknar därför fram tidsplanen själv i
 * stället för att lita på `time/plan.ts`.
 *
 * Steg 5 i kedjan körs alltid, även i produktion: ett pass som inte klarar kontrollen
 * lämnas aldrig ut.
 */
import {
  AREA_SIZES,
  AREA_MARGIN,
  BREAK_INTERVAL,
  BREAK_MINUTES,
  CLOSING_LONG_FROM_MINUTES,
  CLOSING_MINUTES,
  EXERCISE_MIN_MINUTES,
  FOCUS_AREA_HEADING,
  HEADING_MINUTES_CAP,
  HEADING_MIN_AGE,
  PARTS_ALLOWING_STATIONS,
  PART_MIN_MINUTES,
  PART_SHARES,
  PART_TOLERANCE,
  PHASES_WITH_SHORT_CLOSING,
  SESSION_SHORTFALL,
  STATION_COUNT,
  COACH_CAP,
  EXERCISE_MAX_MINUTES,
  FOCUS_BY_PHASE,
  SESSION_PARTS,
} from '../keys.ts';
import type { FocusArea, GameFormat, Phase, SessionPartFromBank } from '../keys.ts';
import type { Exercise, Row, Session } from '../types.ts';

interface Targets {
  closing: number;
  breaks: number;
  targets: Map<SessionPartFromBank, number>;
  removed: SessionPartFromBank[];
}

/** Tidsplanen, räknad oberoende av `time/plan.ts` (R-031 till R-033). */
function targetsFor(phase: Phase, sessionMinutes: number): Targets {
  const closing = PHASES_WITH_SHORT_CLOSING.includes(phase)
    ? CLOSING_MINUTES.kort
    : sessionMinutes < CLOSING_LONG_FROM_MINUTES
      ? CLOSING_MINUTES.kort
      : CLOSING_MINUTES.lang;
  const breaks = Math.ceil(sessionMinutes / BREAK_INTERVAL[phase]) - 1;
  const active = sessionMinutes - closing - breaks * BREAK_MINUTES;
  const shares = PART_SHARES[phase];
  const targets = new Map<SessionPartFromBank, number>();
  const removed: SessionPartFromBank[] = [];
  let used = 0;
  targets.set('del-uppvarmning', Math.floor((active * shares['del-uppvarmning']) / 100));
  used += targets.get('del-uppvarmning') ?? 0;
  for (const part of ['del-ovning', 'del-spelovning'] as const) {
    const value = Math.floor((active * shares[part]) / 100);
    if (value < PART_MIN_MINUTES) {
      removed.push(part);
    } else {
      targets.set(part, value);
      used += value;
    }
  }
  targets.set('del-spel', active - used);
  return { closing, breaks, targets, removed };
}

function exerciseRows(rows: readonly Row[]): { row: Row; exercise: Exercise }[] {
  return rows
    .filter((row) => row.exercise !== null)
    .map((row) => ({ row, exercise: row.exercise as Exercise }));
}

function areaFor(exercise: Exercise, format: GameFormat): { langd: number; bredd: number } | null {
  const yta = exercise.yta as Record<string, { langd: number; bredd: number } | undefined>;
  return yta?.[format] ?? yta?.alla ?? null;
}

function fitsInside(
  size: { langd: number; bredd: number },
  area: { langd: number; bredd: number },
): boolean {
  return (
    (size.langd <= area.langd && size.bredd <= area.bredd) ||
    (size.langd <= area.bredd && size.bredd <= area.langd)
  );
}

/**
 * Prövar samtliga krav. En tom lista betyder att passet är giltigt.
 *
 * @regel R-022
 * @regel R-023
 * @regel R-024
 * @regel R-025
 * @regel R-027
 * @regel R-028
 * @regel R-030
 * @regel R-031
 * @regel R-034
 * @regel R-035
 * @regel R-036
 * @regel R-039
 * @regel R-041
 * @regel R-051
 * @regel R-052
 * @regel R-055
 * @regel R-056
 * @regel R-057
 * @regel R-060
 * @regel R-061
 * @regel R-064
 * @regel R-065
 * @regel R-070
 * @regel R-080
 * @regel R-082
 * @regel R-092
 * @regel R-093
 * @regel R-102
 */
export function checkSession(session: Session): string[] {
  const problems: string[] = [];
  const { input, phase, rows } = session;
  const plan = targetsFor(phase, input.passlangd);

  // R-030: delarna kommer i rätt ordning och avslutningen ligger sist.
  const order = rows
    .map((row) => row.part)
    .filter((part): part is (typeof SESSION_PARTS)[number] => part !== null);
  let previous = -1;
  for (const part of order) {
    const index = SESSION_PARTS.indexOf(part);
    if (index < previous) {
      problems.push(`R-030: delarna ligger inte i passets ordning (${part})`);
      break;
    }
    previous = index;
  }
  const last = rows.at(-1);
  if (last?.kind !== 'closing' || last.minutes !== plan.closing) {
    problems.push('R-031: avslutningen ligger inte sist med rätt tid');
  }

  // R-031: antalet vattenpauser och deras längd.
  const breakRows = rows.filter((row) => row.kind === 'break');
  if (breakRows.length !== plan.breaks) {
    problems.push(`R-031: passet har ${breakRows.length} pauser, ska ha ${plan.breaks}`);
  }
  if (breakRows.some((row) => row.minutes !== BREAK_MINUTES)) {
    problems.push('R-031: en vattenpaus är inte 2 minuter');
  }

  // R-035: varje del som har moment ligger inom måltiden +/- 3 minuter.
  const emptyParts = rows
    .filter((row) => row.kind === 'empty')
    .map((row) => row.part as SessionPartFromBank);
  for (const [part, target] of plan.targets) {
    const minutes = rows
      .filter((row) => row.part === part && row.kind !== 'station' && row.kind !== 'empty')
      .reduce((sum, row) => sum + row.minutes, 0);
    if (emptyParts.includes(part)) {
      continue;
    }
    if (Math.abs(minutes - target) > PART_TOLERANCE) {
      problems.push(`R-035: ${part} har ${minutes} minuter, måltid ${target}`);
    }
  }
  // R-033: en borttagen del får inga rader alls.
  for (const part of plan.removed) {
    if (rows.some((row) => row.part === part)) {
      problems.push(`R-033: ${part} skulle ha tagits bort ur passet`);
    }
  }

  // R-036 och R-039: hela passets tid, utom när en del saknar övning.
  const total = rows
    .filter((row) => row.kind !== 'station' && row.kind !== 'empty')
    .reduce((sum, row) => sum + row.minutes, 0);
  if (total !== session.totalMinutes) {
    problems.push('R-036: passets totaltid stämmer inte med raderna');
  }
  if (emptyParts.length === 0) {
    if (total > input.passlangd || total < input.passlangd - SESSION_SHORTFALL) {
      problems.push(`R-036: passet är ${total} minuter, begärt ${input.passlangd}`);
    }
  }

  // R-070: samma övning förekommer högst en gång, i ett moment. Flera rader i samma moment,
  // till exempel två perioder av samma spel, räknas som en gång.
  const blocksPerExercise = new Map<string, Set<number>>();
  for (const { row, exercise } of exerciseRows(rows)) {
    const blocks = blocksPerExercise.get(exercise.id) ?? new Set<number>();
    blocks.add(row.block ?? 0);
    blocksPerExercise.set(exercise.id, blocks);
  }
  for (const [id, blocks] of blocksPerExercise) {
    if (blocks.size > 1) {
      problems.push(`R-070: ${id} förekommer i flera moment i passet`);
    }
  }

  for (const { row, exercise } of exerciseRows(rows)) {
    // Grundfiltret (grupp 3).
    if (exercise.status !== 'godkand') {
      problems.push(`R-022: ${exercise.id} har status ${exercise.status}`);
    }
    if (input.alder < exercise.alder.min || input.alder > exercise.alder.max) {
      problems.push(`R-023: ${exercise.id} passar inte åldern ${input.alder}`);
    }
    if (!exercise.spelformer.includes(input.spelform)) {
      problems.push(`R-024: ${exercise.id} saknar spelformen ${input.spelform}`);
    }
    if (!exercise.niva.includes(input.niva)) {
      problems.push(`R-025: ${exercise.id} saknar nivån ${input.niva}`);
    }
    if (exercise.fokusomraden.some((focus) => FOCUS_BY_PHASE[focus][phase] === '-')) {
      problems.push(`R-027: ${exercise.id} har ett fokusområde som inte passar ${phase}`);
    }
    if (row.part !== null && row.part !== 'del-avslutning') {
      if (!exercise.passdelar.includes(row.part)) {
        problems.push(`R-028: ${exercise.id} är inte märkt med ${row.part}`);
      }
    }

    // R-080: ingen nickträning före 13 år.
    if (exercise.fokusomraden.includes(FOCUS_AREA_HEADING) && input.alder < HEADING_MIN_AGE) {
      problems.push(`R-080: ${exercise.id} har nickspel men åldern är ${input.alder}`);
    }

    // R-041: kärnan träffar det fokus som gäller i delen.
    if (row.part === 'del-ovning' || row.part === 'del-spelovning') {
      const result = session.parts.find((item) => item.part === row.part);
      const focus: readonly FocusArea[] =
        result?.substituteFocus !== null && result?.substituteFocus !== undefined
          ? [result.substituteFocus]
          : input.fokus;
      if (!exercise.fokusomraden.some((item) => focus.includes(item))) {
        problems.push(`R-041: ${exercise.id} träffar inte delens fokus`);
      }
    }

    // R-034 och R-065: tiderna.
    const maxMinutes =
      row.part === 'del-spel' ? EXERCISE_MAX_MINUTES[phase].spel : EXERCISE_MAX_MINUTES[phase].ovrigt;
    const minutes = row.kind === 'station' ? (row.stationMinutes ?? 0) : blockMinutes(rows, row);
    if (minutes < EXERCISE_MIN_MINUTES || minutes > maxMinutes) {
      problems.push(`R-034: ${exercise.id} har ${minutes} minuter i ${row.part}`);
    }
    if (minutes < exercise.tid.kortast || minutes > exercise.tid.langst) {
      problems.push(`R-034: ${exercise.id} ligger utanför övningens egna tider`);
    }

    // Grupperna (grupp 6) och ledarna.
    const layout = row.layout;
    if (layout !== null) {
      if (layout.sizes.reduce((sum, size) => sum + size, 0) !== input.spelare) {
        problems.push(`R-056: alla spelare är inte med i ${exercise.id}`);
      }
      if (Math.max(...layout.sizes) - Math.min(...layout.sizes) > 1) {
        problems.push(`R-051: grupperna i ${exercise.id} skiljer sig med mer än en spelare`);
      }
      if (layout.sizes.some((size) => size < exercise.spelare.min)) {
        problems.push(`R-052: en grupp i ${exercise.id} är mindre än övningens minsta antal`);
      }
      const cap =
        exercise.ledarbehov >= 1 && row.part !== 'del-spel'
          ? COACH_CAP[phase] * exercise.ledarbehov
          : Number.POSITIVE_INFINITY;
      const largest =
        exercise.grupptyp === 'fast-storlek' && exercise.udda_antal_losning === true
          ? exercise.spelare.max + 1
          : exercise.spelare.max;
      if (layout.sizes.some((size) => size > Math.min(largest, cap))) {
        problems.push(`R-050: en grupp i ${exercise.id} är större än övningens största grupp`);
      }
    }

    // R-092 och R-093: ytan.
    if (input.yta !== undefined) {
      const size = areaFor(exercise, input.spelform);
      if (size === null) {
        problems.push(`R-093: ${exercise.id} saknar yta och ytan är vald`);
      } else {
        const groups = layout?.groups ?? 1;
        const area = AREA_SIZES[input.yta];
        const margin = groups > 1 || row.kind === 'station' ? AREA_MARGIN : 0;
        const withMargin = { langd: size.langd + margin, bredd: size.bredd + margin };
        if (!fitsInside(withMargin, area)) {
          problems.push(`R-092: ${exercise.id} får inte plats på ${input.yta}`);
        }
      }
    }
  }

  // Stationsmomenten (grupp 7).
  for (const row of rows.filter((item) => item.kind === 'stations')) {
    const stations = rows.filter((item) => item.kind === 'station' && item.block === row.block);
    if (row.part === null || !PARTS_ALLOWING_STATIONS.includes(row.part)) {
      problems.push('R-060: ett stationsmoment ligger i fel del');
    }
    if (stations.length < STATION_COUNT.min || stations.length > STATION_COUNT.max) {
      problems.push(`R-061: momentet har ${stations.length} stationer`);
    }
    if (stations.length > input.ledare) {
      problems.push('R-061: fler stationer än ledare');
    }
    const coaches = stations.reduce(
      (sum, station) => sum + Math.max(1, station.exercise?.ledarbehov ?? 1),
      0,
    );
    if (coaches > input.ledare) {
      problems.push('R-064: stationerna kräver fler ledare än underlaget har');
    }
    const stationMinutes = row.stationMinutes ?? 0;
    if (row.minutes !== stations.length * stationMinutes + (stations.length - 1)) {
      problems.push('R-065: stationsmomentets tid stämmer inte med stationstiden');
    }
  }

  // R-055: ett helgruppsmoment behöver k gånger ledarbehovet ledare.
  for (const { row, exercise } of exerciseRows(rows)) {
    if (row.kind === 'exercise' || row.kind === 'period') {
      const needed = (row.layout?.groups ?? 1) * exercise.ledarbehov;
      if (needed > input.ledare) {
        problems.push(`R-055: ${exercise.id} kräver ${needed} ledare`);
      }
    }
  }

  // R-082: nicktaket för fasen.
  let headingMinutes = 0;
  for (const { row, exercise } of exerciseRows(rows)) {
    if (!exercise.fokusomraden.includes(FOCUS_AREA_HEADING)) {
      continue;
    }
    headingMinutes +=
      row.kind === 'station' ? (row.stationMinutes ?? 0) : blockMinutes(rows, row);
  }
  if (headingMinutes > HEADING_MINUTES_CAP[phase]) {
    problems.push(`R-082: ${headingMinutes} minuter nickning, taket är ${HEADING_MINUTES_CAP[phase]}`);
  }

  return problems;
}

/** Momentets hela tid, med perioder hopräknade (R-034, ADR 0011 avsnitt 3). */
function blockMinutes(rows: readonly Row[], row: Row): number {
  if (row.block === null) {
    return row.minutes;
  }
  return rows
    .filter((item) => item.block === row.block && item.kind !== 'station')
    .reduce((sum, item) => sum + item.minutes, 0);
}
