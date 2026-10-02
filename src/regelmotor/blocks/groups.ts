/**
 * Gruppindelning och udda antal (R-050 till R-058).
 *
 * Alla spelare ska vara med i allt, och ingen ska stå i kö. När det är fler spelare än en
 * övning rymmer delas de i flera grupper som gör samma sak sida vid sida.
 */
import { coachCap } from '../keys.ts';
import type { Phase, SessionPartFromBank } from '../keys.ts';
import type { Exercise, Layout } from '../types.ts';

/**
 * Grundstorleken s för en övning som R-058 gäller för, annars `null`.
 *
 * För `par` förutsätter regeln att `spelare` är 2–2. En parövning med ett annat spann delas
 * enligt R-051 och R-052 som tidigare.
 *
 * @regel R-058
 */
export function baseGroupSize(exercise: Exercise): number | null {
  if (exercise.grupptyp === 'par') {
    return exercise.spelare.min === 2 && exercise.spelare.max === 2 ? 2 : null;
  }
  if (exercise.grupptyp === 'fast-storlek') {
    return exercise.spelare.min;
  }
  return null;
}

/**
 * Får en grupp bli en spelare större än grundstorleken? Ja för `par` och för `fast-storlek`
 * med en lösning för udda antal.
 *
 * @regel R-050
 * @regel R-058
 */
function allowsExtraPlayer(exercise: Exercise): boolean {
  return (
    exercise.grupptyp === 'par' ||
    (exercise.grupptyp === 'fast-storlek' && exercise.udda_antal_losning === true)
  );
}

/**
 * Övningens största grupp.
 *
 * Taket per ledare gäller inte i `del-spel` (R-057). Där är största gruppen övningens
 * högsta antal spelare, oavsett ledarbehov.
 *
 * @regel R-050
 * @regel R-057
 * @regel R-058
 */
export function largestGroup(exercise: Exercise, phase: Phase, part: SessionPartFromBank): number {
  const limits: number[] = [];
  const base = baseGroupSize(exercise);
  if (base !== null && allowsExtraPlayer(exercise)) {
    limits.push(base + 1);
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
function oddHandling(exercise: Exercise, sizes: number[]): Pick<Layout, 'oddSolution' | 'oddText'> {
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
 * Så många grupper av grundstorleken s som möjligt. De r spelare som blir över läggs en och
 * en i grupperna, de större grupperna först. `null` när k = 0, när r > k, eller när r > 0
 * och ingen grupp får bli större än s.
 *
 * @regel R-058
 */
export function splitFixedSize(
  players: number,
  base: number,
  extraAllowed: boolean,
): number[] | null {
  const groups = Math.floor(players / base);
  const rest = players - groups * base;
  if (groups === 0 || rest > groups || (rest > 0 && !extraAllowed)) {
    return null;
  }
  return Array.from({ length: groups }, (_, index) => base + (index < rest ? 1 : 0));
}

/**
 * Gruppernas storlekar i ett helgruppsmoment: R-058 för en övning med grundstorlek, annars
 * R-051 och R-052. `null` när ingen giltig indelning finns.
 */
function wholeGroupSizes(exercise: Exercise, largest: number, players: number): number[] | null {
  const base = baseGroupSize(exercise);
  if (base !== null) {
    const sizes = splitFixedSize(players, base, allowsExtraPlayer(exercise));
    // R-058: taket per ledare (R-050) gäller för varje grupp.
    if (sizes === null || sizes.some((size) => size > largest)) {
      return null;
    }
    return sizes;
  }
  // R-051: minsta antal grupper där ingen grupp blir större än största grupp.
  const sizes = splitPlayers(players, Math.ceil(players / largest));
  // R-052: ingen grupp mindre än övningens minsta antal.
  if (sizes.some((size) => size < exercise.spelare.min)) {
    return null;
  }
  return sizes;
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
 * @regel R-058
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
  const sizes = wholeGroupSizes(exercise, largest, players);
  if (sizes === null) {
    return null;
  }
  const groups = sizes.length;
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
