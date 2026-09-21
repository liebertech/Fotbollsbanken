/**
 * Gruppindelning och udda antal (R-050 till R-057).
 *
 * Alla spelare ska vara med i allt, och ingen ska stå i kö. När det är fler spelare än en
 * övning rymmer delas de i flera grupper som gör samma sak sida vid sida.
 */
import { coachCap } from '../keys.ts';
import type { Phase, SessionPartFromBank } from '../keys.ts';
import type { Exercise, Layout } from '../types.ts';

/**
 * Övningens största grupp.
 *
 * Taket per ledare gäller inte i `del-spel` (R-057). Där är största gruppen övningens
 * högsta antal spelare, oavsett ledarbehov.
 *
 * @regel R-050
 * @regel R-057
 */
export function largestGroup(
  exercise: Exercise,
  phase: Phase,
  part: SessionPartFromBank,
): number {
  const limits: number[] = [];
  if (exercise.grupptyp === 'fast-storlek' && exercise.udda_antal_losning === true) {
    limits.push(exercise.spelare.max + 1);
  } else {
    limits.push(exercise.spelare.max);
  }
  if (exercise.ledarbehov >= 1 && part !== 'del-spel') {
    limits.push(coachCap(phase) * exercise.ledarbehov);
  }
  return Math.min(...limits);
}

/**
 * Delar N spelare i k grupper som skiljer sig med högst en spelare. De största grupperna
 * först.
 *
 * @regel R-051
 */
export function splitPlayers(players: number, groups: number): number[] {
  const base = Math.floor(players / groups);
  const rest = players % groups;
  return Array.from({ length: groups }, (_, index) => base + (index < rest ? 1 : 0));
}

/**
 * Hur ett udda antal i en grupp hanteras.
 *
 * @regel R-054
 */
function oddHandling(
  exercise: Exercise,
  sizes: number[],
): Pick<Layout, 'oddSolution' | 'oddText'> {
  const ownText = exercise.anpassning?.udda_antal ?? null;
  const hasOdd = sizes.some((size) => size % 2 === 1);
  if (exercise.grupptyp === 'par' && hasOdd) {
    return { oddSolution: 'trio', oddText: ownText };
  }
  if (exercise.grupptyp === 'tva-lag' && hasOdd) {
    return { oddSolution: 'joker', oddText: ownText };
  }
  if (exercise.grupptyp === 'fast-storlek' && sizes.some((size) => size > exercise.spelare.max)) {
    return { oddSolution: null, oddText: ownText };
  }
  return { oddSolution: null, oddText: null };
}

/**
 * Gruppindelningen för ett helgruppsmoment, eller `null` när övningen inte kan användas.
 *
 * @regel R-051
 * @regel R-052
 * @regel R-053
 * @regel R-054
 * @regel R-055
 * @regel R-056
 */
export function planWholeGroups(
  exercise: Exercise,
  phase: Phase,
  part: SessionPartFromBank,
  players: number,
  coaches: number,
): Layout | null {
  // R-053: för få spelare.
  if (players < exercise.spelare.min) {
    return null;
  }
  const largest = largestGroup(exercise, phase, part);
  if (largest < exercise.spelare.min) {
    return null;
  }
  // R-051: minsta antal grupper där ingen grupp blir större än största grupp.
  const groups = Math.ceil(players / largest);
  const sizes = splitPlayers(players, groups);
  // R-052: ingen grupp mindre än övningens minsta antal.
  if (sizes.some((size) => size < exercise.spelare.min)) {
    return null;
  }
  // R-055: ett moment med k grupper behöver k gånger ledarbehovet ledare.
  const coachesNeeded = groups * exercise.ledarbehov;
  if (coachesNeeded > coaches) {
    return null;
  }
  return {
    groups,
    sizes,
    coachesPerGroup: exercise.ledarbehov,
    coachesNeeded,
    ...oddHandling(exercise, sizes),
  };
}

/**
 * Gruppindelningen sedd från en station: samma grupper, men stationens egen lösning för
 * udda antal.
 *
 * @regel R-054
 * @regel R-063
 */
export function stationLayout(exercise: Exercise, sizes: number[]): Layout {
  return {
    groups: sizes.length,
    sizes,
    coachesPerGroup: Math.max(1, exercise.ledarbehov),
    coachesNeeded: Math.max(1, exercise.ledarbehov),
    ...oddHandling(exercise, sizes),
  };
}
