/**
 * Stationer, rotation och ledarbehov (R-060 till R-067).
 *
 * Stationer är ett bra sätt att använda flera ledare, men de tar tid att ställa i ordning
 * och att rotera, och de kräver en vuxen per station.
 */
import {
  EXERCISE_MIN_MINUTES,
  PARTS_ALLOWING_STATIONS,
  STATION_CHANGE_MINUTES,
  STATION_COUNT,
  STATION_MIN_COACHES,
  coachCap,
  maxExerciseMinutes,
} from '../keys.ts';
import type { Phase, SessionPartFromBank } from '../keys.ts';
import type { Exercise, Layout, StationBlock } from '../types.ts';
import { largestGroup, splitPlayers, stationLayout } from './groups.ts';

/**
 * Får delen ha ett stationsmoment?
 *
 * @regel R-060
 */
export function stationsAllowed(part: SessionPartFromBank, coaches: number): boolean {
  return PARTS_ALLOWING_STATIONS.includes(part) && coaches >= STATION_MIN_COACHES;
}

/**
 * Högsta antal stationer: aldrig fler än 4 och aldrig fler än antalet ledare.
 *
 * @regel R-061
 */
export function maxStations(coaches: number): number {
  return Math.min(STATION_COUNT.max, coaches);
}

/**
 * Ledarbehovet för ett stationsmoment: varje station behöver det största av 1 och
 * övningens ledarbehov.
 *
 * @regel R-064
 */
export function stationCoaches(exercises: readonly Exercise[]): number {
  return exercises.reduce((sum, exercise) => sum + Math.max(1, exercise.ledarbehov), 0);
}

/**
 * Bygger ett stationsmoment av S övningar, eller `null` när uppsättningen inte är giltig.
 *
 * @regel R-061
 * @regel R-062
 * @regel R-063
 * @regel R-064
 * @regel R-065
 * @regel R-066
 */
export function buildStationBlock(
  exercises: Exercise[],
  phase: Phase,
  part: SessionPartFromBank,
  players: number,
  coaches: number,
): StationBlock | null {
  const count = exercises.length;
  if (count < STATION_COUNT.min || count > maxStations(coaches)) {
    return null;
  }
  // R-062: alla stationsövningar är olika.
  if (new Set(exercises.map((exercise) => exercise.id)).size !== count) {
    return null;
  }
  // R-064: summan av stationernas ledare får inte vara större än L.
  const coachesNeeded = stationCoaches(exercises);
  if (coachesNeeded > coaches) {
    return null;
  }

  // R-063: spelarna delas i S grupper som skiljer sig med högst en spelare.
  const sizes = splitPlayers(players, count);
  const cap = coachCap(phase);
  for (const exercise of exercises) {
    const largest = Math.min(largestGroup(exercise, phase, part), cap);
    for (const size of sizes) {
      if (size < exercise.spelare.min || size > largest) {
        return null;
      }
    }
  }

  // R-065: samma stationstid t på varje station, inom varje övnings gränser.
  const minStation = Math.max(
    EXERCISE_MIN_MINUTES,
    ...exercises.map((exercise) => exercise.tid.kortast),
  );
  const maxStation = Math.min(
    maxExerciseMinutes(phase, part),
    ...exercises.map((exercise) => exercise.tid.langst),
  );
  if (minStation > maxStation) {
    return null;
  }
  const recommendedStation = Math.min(
    maxStation,
    Math.max(minStation, Math.min(...exercises.map((exercise) => exercise.tid.rekommenderad))),
  );

  const layout: Layout = {
    groups: count,
    sizes,
    coachesPerGroup: 1,
    coachesNeeded,
    oddSolution: null,
    oddText: null,
  };

  return {
    kind: 'stationer',
    exercises,
    layout,
    stationLayouts: exercises.map((exercise) => stationLayout(exercise, sizes)),
    minStation,
    maxStation,
    recommendedStation,
    coachesNeeded,
  };
}

/**
 * Momentets tid: S gånger stationstiden plus ett bytesminut mellan stationerna.
 *
 * @regel R-065
 */
export function stationBlockMinutes(count: number, stationMinutes: number): number {
  return count * stationMinutes + (count - 1) * STATION_CHANGE_MINUTES;
}
