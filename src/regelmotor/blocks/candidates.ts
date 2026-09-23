/**
 * Bygger giltiga moment av kandidatövningar (R-034, R-041, R-050 till R-067, R-092).
 *
 * Ett kandidatmoment bär sina grupper, sina ledare och ett tidsintervall, inte en bestämd
 * tid (ADR 0011 avsnitt 5, steg 1). Det är det som gör tidstilldelningen exakt lösbar.
 */
import { EXERCISE_MIN_MINUTES, STATION_COUNT, maxExerciseMinutes } from '../keys.ts';
import type { FocusArea, Phase, SessionPartFromBank } from '../keys.ts';
import { compareIds } from '../random/rng.ts';
import { baseRejection, fitsPart, hasMainHit, hitsFocus } from '../filter/base.ts';
import { safetyRejection } from '../filter/safety.ts';
import { exerciseArea, momentFitsArea } from '../filter/area.ts';
import type { Size } from '../filter/area.ts';
import { planWholeGroups } from './groups.ts';
import {
  buildStationBlock,
  maxStations,
  stationBlockMinutes,
  stationsAllowed,
} from './stations.ts';
import type { Block, Exercise, Input, StationBlock, WholeBlock } from '../types.ts';

/** Högst så här många övningar går in i kombinationerna för ett stationsmoment. */
const STATION_CANDIDATE_LIMIT = 10;

/** Högst så här många stationsuppsättningar byggs per del och antal stationer. */
const STATION_SET_LIMIT = 200;

export interface BuildContext {
  input: Input;
  phase: Phase;
}

/**
 * Övningarna som kan komma i fråga för en del: grundfiltret, rätt del och säkerheten.
 *
 * @regel R-022
 * @regel R-028
 * @regel R-080
 */
export function candidatesForPart(
  bank: readonly Exercise[],
  part: SessionPartFromBank,
  context: BuildContext,
): Exercise[] {
  const { input, phase } = context;
  return bank
    .filter(
      (exercise) =>
        baseRejection(exercise, input, phase) === null &&
        fitsPart(exercise, part) &&
        safetyRejection(exercise, input.alder) === null,
    )
    .sort((a, b) => compareIds(a.id, b.id));
}

/**
 * Träffar övningen det fokus som gäller i delen? Kravet gäller bara kärnan.
 *
 * @regel R-041
 */
export function meetsPartFocus(
  exercise: Exercise,
  part: SessionPartFromBank,
  focus: readonly FocusArea[],
): boolean {
  if (part !== 'del-ovning' && part !== 'del-spelovning') {
    return true;
  }
  return hitsFocus(exercise, focus);
}

function areaForBlockGroups(exercise: Exercise, groups: number, input: Input): (Size | null)[] {
  const size = exerciseArea(exercise, input.spelform);
  return Array.from({ length: groups }, () => size);
}

/**
 * Helgruppsmoment för en del.
 *
 * @regel R-034
 * @regel R-038
 * @regel R-041
 * @regel R-092
 */
export function wholeBlocks(
  exercises: readonly Exercise[],
  part: SessionPartFromBank,
  context: BuildContext,
  focus: readonly FocusArea[],
): WholeBlock[] {
  const { input, phase } = context;
  const blocks: WholeBlock[] = [];
  for (const exercise of exercises) {
    if (!meetsPartFocus(exercise, part, focus)) {
      continue;
    }
    const layout = planWholeGroups(exercise, phase, part, input.spelare, input.ledare);
    if (layout === null) {
      continue;
    }
    if (!momentFitsArea(areaForBlockGroups(exercise, layout.groups, input), input.yta)) {
      continue;
    }
    // R-034: tiden är minst 5 minuter, inom övningens gränser och högst fasens tak för delen.
    const min = Math.max(EXERCISE_MIN_MINUTES, exercise.tid.kortast);
    const max = Math.min(exercise.tid.langst, maxExerciseMinutes(phase, part));
    if (min > max) {
      continue;
    }
    blocks.push({
      kind: 'helgrupp',
      exercise,
      layout,
      minMinutes: min,
      maxMinutes: max,
      recommendedMinutes: Math.min(max, Math.max(min, exercise.tid.rekommenderad)),
    });
  }
  return blocks;
}

/** Kombinationer av storlek k ur listan, i listans ordning, med ett tak på antalet. */
function combinationsOf<T>(items: readonly T[], size: number, limit: number): T[][] {
  const result: T[][] = [];
  const current: T[] = [];
  const walk = (start: number): void => {
    if (result.length >= limit) {
      return;
    }
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    for (let index = start; index < items.length; index += 1) {
      const item = items[index];
      if (item === undefined) {
        continue;
      }
      current.push(item);
      walk(index + 1);
      current.pop();
      if (result.length >= limit) {
        return;
      }
    }
  };
  walk(0);
  return result;
}

/**
 * Stationsmoment för en del. Kandidaterna sorteras med huvudträff först, så att de
 * uppsättningar som är bäst enligt R-042 byggs först.
 *
 * @regel R-060
 * @regel R-061
 * @regel R-062
 * @regel R-063
 * @regel R-064
 * @regel R-065
 * @regel R-092
 */
export function stationBlocks(
  exercises: readonly Exercise[],
  part: SessionPartFromBank,
  context: BuildContext,
  focus: readonly FocusArea[],
): StationBlock[] {
  const { input, phase } = context;
  if (!stationsAllowed(part, input.ledare)) {
    return [];
  }
  const usable = exercises
    .filter((exercise) => meetsPartFocus(exercise, part, focus))
    .sort((a, b) => {
      const mainA = hasMainHit(a, focus) ? 0 : 1;
      const mainB = hasMainHit(b, focus) ? 0 : 1;
      return mainA !== mainB ? mainA - mainB : compareIds(a.id, b.id);
    })
    .slice(0, STATION_CANDIDATE_LIMIT);

  const blocks: StationBlock[] = [];
  const highest = maxStations(input.ledare);
  for (let count = STATION_COUNT.min; count <= highest; count += 1) {
    for (const set of combinationsOf(usable, count, STATION_SET_LIMIT)) {
      const block = buildStationBlock(set, phase, part, input.spelare, input.ledare);
      if (block === null) {
        continue;
      }
      const areas = block.exercises.map((exercise) => exerciseArea(exercise, input.spelform));
      if (!momentFitsArea(areas, input.yta)) {
        continue;
      }
      blocks.push(block);
    }
  }
  return blocks;
}

/**
 * Alla moment som kan användas i delen, helgrupp och stationer.
 *
 * @regel R-038
 */
export function blocksForPart(
  exercises: readonly Exercise[],
  part: SessionPartFromBank,
  context: BuildContext,
  focus: readonly FocusArea[],
): Block[] {
  return [
    ...wholeBlocks(exercises, part, context, focus),
    ...stationBlocks(exercises, part, context, focus),
  ];
}

/** Övningarna i ett moment. */
export function blockExercises(block: Block): Exercise[] {
  return block.kind === 'helgrupp' ? [block.exercise] : block.exercises;
}

/**
 * De tider momentet kan få, i stigande ordning.
 *
 * @regel R-034
 * @regel R-065
 */
export function blockMinutesOptions(block: Block): number[] {
  if (block.kind === 'helgrupp') {
    const options: number[] = [];
    for (let minutes = block.minMinutes; minutes <= block.maxMinutes; minutes += 1) {
      options.push(minutes);
    }
    return options;
  }
  const options: number[] = [];
  for (let station = block.minStation; station <= block.maxStation; station += 1) {
    options.push(stationBlockMinutes(block.exercises.length, station));
  }
  return options;
}

/** Stationstiden som ger momentet den valda tiden, eller `null` för helgruppsmoment. */
export function stationMinutesFor(block: Block, minutes: number): number | null {
  if (block.kind === 'helgrupp') {
    return null;
  }
  const count = block.exercises.length;
  const station = (minutes - (count - 1)) / count;
  return Number.isInteger(station) ? station : null;
}

/** Momentets tid som ligger närmast de rekommenderade tiderna (ADR 0011 avsnitt 6). */
export function preferredMinutes(block: Block): number {
  return block.kind === 'helgrupp'
    ? block.recommendedMinutes
    : stationBlockMinutes(block.exercises.length, block.recommendedStation);
}
