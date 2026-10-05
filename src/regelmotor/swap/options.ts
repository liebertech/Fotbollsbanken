/**
 * Vilka övningar som kan ersätta en övning i passet (R-104), och var den nya övningen hamnar:
 * grupper, ledare och tid (R-105).
 *
 * Prioriteterna i R-048 används inte här. Ledaren väljer själv bland alla övningar som
 * uppfyller villkoren, så listan sorteras bara med en total ordning (ADR 0011 avsnitt 2).
 *
 * Klubbens egna övningar (R-106) tas inte emot ännu. De kommer med kontona och klubbens
 * övningar i inkrement 3 och 4 (berättelse 04, Beroenden).
 */
import { EXERCISE_MIN_MINUTES, maxExerciseMinutes } from '../keys.ts';
import type { FocusArea, Phase, SessionPartFromBank } from '../keys.ts';
import { compareIds } from '../random/rng.ts';
import { baseRejection, fitsPart } from '../filter/base.ts';
import { headingMinutesWithinCap, safetyRejection } from '../filter/safety.ts';
import { exerciseArea, momentFitsArea } from '../filter/area.ts';
import { meetsPartFocus } from '../blocks/candidates.ts';
import { planWholeGroupsWithReason } from '../blocks/groups.ts';
import { buildStationBlock, stationCoaches } from '../blocks/stations.ts';
import type { BankExercise } from '../origin.ts';
import type { Exercise, ItemRef, Layout, Session } from '../types.ts';

/** Övningen X som ska bytas, och var den ligger i passet. */
export interface SwapTarget {
  ref: ItemRef;
  part: SessionPartFromBank;
  exercise: Exercise;
  /** Raderna som bär X. Fler än en när en paus delar spelet i perioder (R-037). */
  rowIndexes: number[];
  /** Stationsmomentets blockrad, bara i ett stationsmoment. */
  stationsRowIndex: number | null;
  /** Övningarna på momentets stationer, i stationsordning. Tom lista i helgrupp. */
  stationExercises: Exercise[];
  /** X:s tid: momentets hela tid i helgrupp, stationstiden t i ett stationsmoment. */
  minutes: number;
}

/** Var Y hamnar i passet. */
export type Placement =
  | { kind: 'helgrupp'; layout: Layout; minutes: number }
  | { kind: 'station'; layout: Layout; blockLayout: Layout; stationMinutes: number };

/** Vilket villkor i R-104 som fällde en övning, och vilken regel bakom villkoret. */
export interface SwapRejection {
  villkor: 1 | 2 | 3 | 4 | 5;
  regel: string;
}

export type PlacementResult =
  { ok: true; placement: Placement } | { ok: false; rejection: SwapRejection };

/**
 * Letar upp övningen i passet. Ett `ref` som inte pekar på en övning är ett programfel i den
 * som anropar, inte ett läge ledaren kan hamna i.
 */
export function locateSwapTarget(session: Session, ref: ItemRef): SwapTarget {
  const rowIndexes: number[] = [];
  let stationsRowIndex: number | null = null;
  const stationExercises: Exercise[] = [];
  for (const [index, row] of session.rows.entries()) {
    if (row.block !== ref.block) {
      continue;
    }
    if (row.kind === 'stations') {
      stationsRowIndex = index;
    } else if (row.kind === 'station' && row.exercise !== null) {
      stationExercises.push(row.exercise);
      if (row.station === ref.station) {
        rowIndexes.push(index);
      }
    } else if ((row.kind === 'exercise' || row.kind === 'period') && ref.station === null) {
      rowIndexes.push(index);
    }
  }

  const first = rowIndexes[0] === undefined ? undefined : session.rows[rowIndexes[0]];
  if (
    first === undefined ||
    first.exercise === null ||
    first.part === null ||
    first.part === 'del-avslutning' ||
    (ref.station !== null && stationsRowIndex === null)
  ) {
    throw new Error(`Passet har ingen övning i moment ${ref.block}, station ${ref.station}`);
  }

  const minutes =
    ref.station === null
      ? rowIndexes.reduce((sum, index) => sum + (session.rows[index]?.minutes ?? 0), 0)
      : (first.stationMinutes ?? 0);

  return {
    ref,
    part: first.part,
    exercise: first.exercise,
    rowIndexes,
    stationsRowIndex,
    stationExercises: ref.station === null ? [] : stationExercises,
    minutes,
  };
}

/**
 * Det fokus som gäller i delen: ersättningsfokuset om delen har ett, annars ledarens val.
 *
 * @regel R-041
 * @regel R-121
 */
export function partFocus(session: Session, part: SessionPartFromBank): readonly FocusArea[] {
  const substitute = session.parts.find((item) => item.part === part)?.substituteFocus ?? null;
  return substitute === null ? session.input.fokus : [substitute];
}

/**
 * Den tid bland `options` som ligger närmast `target`. Ligger två lika nära väljs den
 * kortare.
 *
 * @regel R-105
 */
export function nearestMinutes(options: readonly number[], target: number): number | null {
  let best: number | null = null;
  for (const minutes of options) {
    if (
      best === null ||
      Math.abs(minutes - target) < Math.abs(best - target) ||
      (Math.abs(minutes - target) === Math.abs(best - target) && minutes < best)
    ) {
      best = minutes;
    }
  }
  return best;
}

/** Tiderna en övning får ha i delen, i stigande ordning (R-034). */
function allowedMinutes(exercise: Exercise, phase: Phase, part: SessionPartFromBank): number[] {
  const min = Math.max(EXERCISE_MIN_MINUTES, exercise.tid.kortast);
  const max = Math.min(exercise.tid.langst, maxExerciseMinutes(phase, part));
  const options: number[] = [];
  for (let minutes = min; minutes <= max; minutes += 1) {
    options.push(minutes);
  }
  return options;
}

/**
 * Var Y hamnar om Y ersätter X: grupper och ledare enligt grupp 6 och 7, tid enligt R-105
 * och ytan enligt grupp 10.
 *
 * @regel R-034
 * @regel R-050
 * @regel R-051
 * @regel R-052
 * @regel R-055
 * @regel R-058
 * @regel R-063
 * @regel R-064
 * @regel R-065
 * @regel R-092
 * @regel R-093
 * @regel R-105
 */
export function placeReplacement(
  session: Session,
  target: SwapTarget,
  candidate: Exercise,
): PlacementResult {
  const { input, phase } = session;
  const { part } = target;

  if (target.ref.station === null) {
    const groups = planWholeGroupsWithReason(candidate, phase, part, input.spelare, input.ledare);
    if (!groups.ok) {
      return { ok: false, rejection: { villkor: 4, regel: groups.regel } };
    }
    const { layout } = groups;
    const areas = Array.from({ length: layout.groups }, () =>
      exerciseArea(candidate, input.spelform),
    );
    if (!momentFitsArea(areas, input.yta)) {
      return { ok: false, rejection: { villkor: 1, regel: 'R-092' } };
    }
    const minutes = nearestMinutes(allowedMinutes(candidate, phase, part), target.minutes);
    if (minutes === null) {
      return { ok: false, rejection: { villkor: 1, regel: 'R-034' } };
    }
    return { ok: true, placement: { kind: 'helgrupp', layout, minutes } };
  }

  // R-104 villkor 4: Y ska passa stationens grupper, stationstiden t och ledarna.
  const stationIndex = target.ref.station - 1;
  const exercises = target.stationExercises.map((exercise, index) =>
    index === stationIndex ? candidate : exercise,
  );
  if (stationCoaches(exercises) > input.ledare) {
    return { ok: false, rejection: { villkor: 4, regel: 'R-064' } };
  }
  const block = buildStationBlock(exercises, phase, part, input.spelare, input.ledare);
  if (block === null) {
    return { ok: false, rejection: { villkor: 4, regel: 'R-063' } };
  }
  // R-105: i ett stationsmoment får Y stationstiden t.
  const stationMinutes = target.minutes;
  if (stationMinutes < block.minStation || stationMinutes > block.maxStation) {
    return { ok: false, rejection: { villkor: 4, regel: 'R-065' } };
  }
  const areas = exercises.map((exercise) => exerciseArea(exercise, input.spelform));
  if (!momentFitsArea(areas, input.yta)) {
    return { ok: false, rejection: { villkor: 1, regel: 'R-092' } };
  }
  const layout = block.stationLayouts[stationIndex];
  if (layout === undefined) {
    return { ok: false, rejection: { villkor: 4, regel: 'R-063' } };
  }
  return {
    ok: true,
    placement: { kind: 'station', layout, blockLayout: block.layout, stationMinutes },
  };
}

/**
 * Nicktaket för hela passet efter bytet, med Y:s tid enligt R-105. Ett helgruppsmoment räknas
 * en gång, med momentets hela tid, också när det är delat i perioder. En station räknas med
 * stationstiden t.
 *
 * @regel R-082
 */
function headingCapHolds(
  session: Session,
  target: SwapTarget,
  candidate: Exercise,
  placement: Placement,
): boolean {
  const entries: { exercise: Exercise; minutes: number }[] = [];
  const counted = new Set<number>();
  for (const [index, row] of session.rows.entries()) {
    if (row.exercise === null || target.rowIndexes.includes(index)) {
      continue;
    }
    if (row.kind === 'station') {
      entries.push({ exercise: row.exercise, minutes: row.stationMinutes ?? 0 });
      continue;
    }
    if (row.block === null || counted.has(row.block)) {
      continue;
    }
    counted.add(row.block);
    const minutes = session.rows
      .filter((item) => item.block === row.block && item.kind !== 'station')
      .reduce((sum, item) => sum + item.minutes, 0);
    entries.push({ exercise: row.exercise, minutes });
  }
  entries.push({
    exercise: candidate,
    minutes: placement.kind === 'helgrupp' ? placement.minutes : placement.stationMinutes,
  });
  return headingMinutesWithinCap(entries, session.phase);
}

/**
 * Prövar om övningen Y kan ersätta X. Returnerar platsen Y får, eller villkoret i R-104 som
 * sa nej.
 *
 * @regel R-022
 * @regel R-028
 * @regel R-041
 * @regel R-070
 * @regel R-080
 * @regel R-082
 * @regel R-104
 * @regel R-121
 */
export function trySwap(
  session: Session,
  target: SwapTarget,
  candidate: Exercise,
): PlacementResult {
  const { input, phase } = session;

  // Villkor 1: grundfiltret (grupp 3) och säkerheten (grupp 9). Ytan prövas med grupperna.
  const base = baseRejection(candidate, input, phase);
  if (base !== null) {
    return { ok: false, rejection: { villkor: 1, regel: base } };
  }
  const safety = safetyRejection(candidate, input.alder);
  if (safety !== null) {
    return { ok: false, rejection: { villkor: 1, regel: safety } };
  }

  // Villkor 2: samma del som X ligger i.
  if (!fitsPart(candidate, target.part)) {
    return { ok: false, rejection: { villkor: 2, regel: 'R-028' } };
  }

  // Villkor 3: R-041 i kärnan, mot delens ersättningsfokus om den har ett (R-121).
  if (!meetsPartFocus(candidate, target.part, partFocus(session, target.part))) {
    return { ok: false, rejection: { villkor: 3, regel: 'R-041' } };
  }

  // Villkor 5: Y finns inte redan någon annanstans i passet. X själv är inget byte.
  if (session.rows.some((row) => row.exercise?.id === candidate.id)) {
    return { ok: false, rejection: { villkor: 5, regel: 'R-070' } };
  }

  // Villkor 4, ytan och tiden.
  const placed = placeReplacement(session, target, candidate);
  if (!placed.ok) {
    return placed;
  }

  // Villkor 1: nicktaket för hela passet efter bytet.
  if (!headingCapHolds(session, target, candidate, placed.placement)) {
    return { ok: false, rejection: { villkor: 1, regel: 'R-082' } };
  }
  return placed;
}

/**
 * Övningarna ur den gemensamma banken som kan ersätta övningen på platsen `ref`, sorterade
 * på `id`. En tom lista betyder att det saknas alternativ och att X ligger kvar (berättelse
 * 04, kriterium 3).
 *
 * @regel R-104
 */
export function swapOptions(
  session: Session,
  ref: ItemRef,
  bank: readonly BankExercise[],
): BankExercise[] {
  return swapOptionsWithLayout(session, ref, bank).map((option) => option.exercise);
}

/** Ett alternativ, och den gruppindelning det skulle få i passet om det byts in. */
export interface SwapOption {
  exercise: BankExercise;
  /** Gruppindelningen enligt grupp 6 och 7, samma som `applySwap` ger raden. */
  layout: Layout;
}

/**
 * Samma alternativ som `swapOptions`, i samma ordning, med gruppindelningen som bytet skulle
 * ge. Bytesvyn ritar miniatyren efter den, så att en parövning vid udda antal visas som
 * den trio den blir (berättelse 06, kriterium 5).
 *
 * @regel R-104
 */
export function swapOptionsWithLayout(
  session: Session,
  ref: ItemRef,
  bank: readonly BankExercise[],
): SwapOption[] {
  const target = locateSwapTarget(session, ref);
  const options: SwapOption[] = [];
  for (const candidate of bank) {
    const result = trySwap(session, target, candidate);
    if (result.ok) {
      options.push({ exercise: candidate, layout: result.placement.layout });
    }
  }
  return options.sort((a, b) => compareIds(a.exercise.id, b.exercise.id));
}
