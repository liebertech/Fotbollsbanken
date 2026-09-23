/**
 * Fyller en del: bygger momentuppsättningar av kandidatmomenten och rangordnar dem efter
 * de poster i R-048 som delen själv kan påverka (ADR 0011 avsnitt 5, steg 2).
 *
 * Här bor också begreppet *Delen kan fyllas* ur generatorreglernas avsnitt *Begrepp*, som
 * R-100, R-101, R-103 och R-121 alla vilar på.
 */
import { HEADING_MINUTES_CAP, PART_TOLERANCE, WARMUP_BODY_FOCUS } from '../keys.ts';
import type { FocusArea, Phase, SessionPartFromBank } from '../keys.ts';
import { compareIds } from '../random/rng.ts';
import type { Rng } from '../random/rng.ts';
import { hasMainHit, hitsFocus } from '../filter/base.ts';
import { hasHeading } from '../filter/safety.ts';
import {
  blockExercises,
  blockMinutesOptions,
  blocksForPart,
  preferredMinutes,
} from '../blocks/candidates.ts';
import type { BuildContext } from '../blocks/candidates.ts';
import type { Block, Exercise } from '../types.ts';

/** Högst så här många moment går in i paren när en del fylls med två moment. */
const PAIR_LIMIT = 30;

export interface BlockSet {
  blocks: Block[];
  /** Tider delen kan få med de här momenten, inom måltiden +/- 3 (R-035). */
  totals: number[];
  /** Den tid som ligger närmast momentens rekommenderade tider. */
  preferred: number;
}

function setExerciseIds(blocks: readonly Block[]): string[] {
  return blocks.flatMap((block) => blockExercises(block).map((exercise) => exercise.id));
}

function setExercises(blocks: readonly Block[]): Exercise[] {
  return blocks.flatMap((block) => blockExercises(block));
}

/**
 * Nicktaket prövat för delen för sig, som begreppet *Delen kan fyllas* kräver. Ett
 * stationsmoment räknas med stationstiden per station (R-082).
 *
 * @regel R-082
 */
export function headingMinutes(blocks: readonly Block[], minutes: readonly number[]): number {
  let used = 0;
  for (const [index, block] of blocks.entries()) {
    const blockMinutes = minutes[index] ?? 0;
    if (block.kind === 'helgrupp') {
      if (hasHeading(block.exercise)) {
        used += blockMinutes;
      }
      continue;
    }
    const count = block.exercises.length;
    const stationMinutes = (blockMinutes - (count - 1)) / count;
    for (const exercise of block.exercises) {
      if (hasHeading(exercise)) {
        used += stationMinutes;
      }
    }
  }
  return used;
}

function headingWithinCapForSet(
  blocks: readonly Block[],
  minutes: number[],
  phase: Phase,
): boolean {
  return headingMinutes(blocks, minutes) <= HEADING_MINUTES_CAP[phase];
}

/** Summor som momenten tillsammans kan ge, och en fördelning per moment för varje summa. */
export function totalsFor(blocks: readonly Block[]): Map<number, number[]> {
  const result = new Map<number, number[]>();
  const options = blocks.map((block) => blockMinutesOptions(block));
  const preferred = blocks.map((block) => preferredMinutes(block));

  const walk = (index: number, minutes: number[], sum: number): void => {
    if (index === blocks.length) {
      const existing = result.get(sum);
      const deviation = (values: number[]): number =>
        values.reduce((total, value, i) => total + Math.abs(value - (preferred[i] ?? value)), 0);
      if (existing === undefined || deviation(minutes) < deviation(existing)) {
        result.set(sum, [...minutes]);
      }
      return;
    }
    for (const value of options[index] ?? []) {
      minutes.push(value);
      walk(index + 1, minutes, sum + value);
      minutes.pop();
    }
  };
  walk(0, [], 0);
  return result;
}

/** Tidfördelningen inom delen för en vald summa. */
export function minutesForTotal(blocks: readonly Block[], total: number): number[] | null {
  return totalsFor(blocks).get(total) ?? null;
}

/**
 * Momentuppsättningar för en del: ett eller två moment, med olika övningar, vars
 * sammanlagda tid kan ligga inom måltiden +/- 3 minuter och som håller nicktaket.
 *
 * @regel R-035
 * @regel R-038
 * @regel R-070
 * @regel R-082
 */
export function blockSets(
  blocks: readonly Block[],
  target: number,
  phase: Phase,
  usedIds: ReadonlySet<string> = new Set(),
): BlockSet[] {
  const low = target - PART_TOLERANCE;
  const high = target + PART_TOLERANCE;
  const available = blocks.filter((block) => {
    const ids = setExerciseIds([block]);
    if (ids.some((id) => usedIds.has(id))) {
      return false;
    }
    const options = blockMinutesOptions(block);
    const min = options[0] ?? Number.POSITIVE_INFINITY;
    return min <= high;
  });

  const sets: BlockSet[] = [];
  const add = (group: Block[]): void => {
    const map = totalsFor(group);
    const totals = [...map.keys()]
      .filter((total) => total >= low && total <= high)
      .filter((total) => headingWithinCapForSet(group, map.get(total) ?? [], phase))
      .sort((a, b) => a - b);
    if (totals.length === 0) {
      return;
    }
    const wanted = group.reduce((sum, block) => sum + preferredMinutes(block), 0);
    const preferred = totals.reduce((best, total) =>
      Math.abs(total - wanted) < Math.abs(best - wanted) ? total : best,
    );
    sets.push({ blocks: group, totals, preferred });
  };

  for (const block of available) {
    add([block]);
  }

  const forPairs = available.slice(0, PAIR_LIMIT);
  for (let i = 0; i < forPairs.length; i += 1) {
    for (let j = i + 1; j < forPairs.length; j += 1) {
      const first = forPairs[i];
      const second = forPairs[j];
      if (first === undefined || second === undefined) {
        continue;
      }
      const ids = setExerciseIds([first, second]);
      if (new Set(ids).size !== ids.length) {
        continue;
      }
      add([first, second]);
    }
  }

  return sets;
}

export interface FillContext extends BuildContext {
  /** Fokus som gäller i delen: ledarens val, eller ett ersättningsfokus (R-121). */
  focus: readonly FocusArea[];
  /** Ledarens egna val, som R-045 till R-047 alltid prövas mot. */
  chosenFocus: readonly FocusArea[];
  /** Fokusområden som redan är täckta av tidigare fyllda delar (R-047). */
  coveredFocus: ReadonlySet<FocusArea>;
  /** Fokus som gäller i `del-ovning`, för den röda tråden (R-043). */
  coreFocus?: readonly FocusArea[];
  /** Övningarna i `del-ovning`, för den röda tråden (R-043). */
  coreExercises?: readonly Exercise[];
}

/**
 * Rangordnar en momentuppsättning efter de poster i R-048 som delen kan påverka.
 * Högre värde är bättre, och posterna jämförs uppifrån och ned.
 *
 * @regel R-042
 * @regel R-043
 * @regel R-044
 * @regel R-045
 * @regel R-046
 * @regel R-047
 * @regel R-038
 */
export function rankKey(set: BlockSet, part: SessionPartFromBank, context: FillContext): number[] {
  const exercises = setExercises(set.blocks);
  const key: number[] = [];

  if (part === 'del-ovning' || part === 'del-spelovning') {
    // Post 3 och 4: huvudträff för varje övning i delen.
    key.push(exercises.every((exercise) => hasMainHit(exercise, context.focus)) ? 1 : 0);
  }
  if (part === 'del-spelovning') {
    // Post 5: röd tråd mot Öva.
    const coreFocus = context.coreFocus ?? [];
    const core = context.coreExercises ?? [];
    const shared = exercises.some((exercise) =>
      exercise.fokusomraden.some(
        (focus) =>
          context.focus.includes(focus) &&
          coreFocus.includes(focus) &&
          core.some((other) => other.fokusomraden.includes(focus)),
      ),
    );
    key.push(shared ? 1 : 0);
  }
  if (part === 'del-uppvarmning') {
    // Post 7: uppvärmningen förbereder kroppen.
    const body = WARMUP_BODY_FOCUS[context.phase];
    key.push(exercises.some((exercise) => hitsFocus(exercise, body)) ? 1 : 0);
    // Post 8: uppvärmningen träffar valt fokus.
    key.push(exercises.some((exercise) => hitsFocus(exercise, context.chosenFocus)) ? 1 : 0);
  }
  if (part === 'del-spel') {
    // Post 9: spelet träffar valt fokus.
    key.push(exercises.some((exercise) => hitsFocus(exercise, context.chosenFocus)) ? 1 : 0);
  }

  // Post 6: hur många av ledarens valda fokusområden delen lägger till.
  const added = new Set<FocusArea>();
  for (const exercise of exercises) {
    for (const focus of exercise.fokusomraden) {
      if (context.chosenFocus.includes(focus) && !context.coveredFocus.has(focus)) {
        added.add(focus);
      }
    }
  }
  key.push(added.size);

  // Post 10: så få moment som möjligt.
  key.push(-set.blocks.length);
  return key;
}

/** Jämför två nyckellistor. Positivt tal betyder att `a` är bättre. */
export function compareKeys(a: readonly number[], b: readonly number[]): number {
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const left = a[index] ?? 0;
    const right = b[index] ?? 0;
    if (left !== right) {
      return left - right;
    }
  }
  return 0;
}

/**
 * Sorterar uppsättningarna, bäst först. Sista utslagsgivare är övningarnas id, så att
 * ordningen är oberoende av den ordning banken kom i (R-072).
 */
export function sortSets(
  sets: BlockSet[],
  part: SessionPartFromBank,
  context: FillContext,
): BlockSet[] {
  return [...sets].sort((a, b) => {
    const compared = compareKeys(rankKey(b, part, context), rankKey(a, part, context));
    if (compared !== 0) {
      return compared;
    }
    const idsA = setExerciseIds(a.blocks).join(',');
    const idsB = setExerciseIds(b.blocks).join(',');
    return compareIds(idsA, idsB);
  });
}

/**
 * Väljer bland de uppsättningar som är lika bra. Slumpen används bara som sista utslag
 * mellan alternativ som är lika bra i just den jämförelsen (R-072, punkt 1).
 *
 * @regel R-067
 * @regel R-072
 */
export function pickAmongEqual(
  sets: BlockSet[],
  part: SessionPartFromBank,
  context: FillContext,
  rng: Rng,
): BlockSet[] {
  const sorted = sortSets(sets, part, context);
  const first = sorted[0];
  if (first === undefined) {
    return sorted;
  }
  const bestKey = rankKey(first, part, context);
  const equal = sorted.filter((set) => compareKeys(rankKey(set, part, context), bestKey) === 0);
  if (equal.length <= 1) {
    return sorted;
  }
  const chosen = rng.pick(equal);
  return [chosen, ...sorted.filter((set) => set !== chosen)];
}

/**
 * *Delen kan fyllas*: det finns ett eller två giltiga moment för delen, med olika
 * övningar, vars sammanlagda tid kan ligga inom måltiden +/- 3 minuter och som tillsammans
 * håller nicktaket. Prövas för delen för sig, utan hänsyn till resten av passet.
 *
 * @regel R-100
 * @regel R-101
 * @regel R-103
 * @regel R-121
 */
export function canFillPart(
  bankForPart: readonly Exercise[],
  part: SessionPartFromBank,
  target: number,
  context: BuildContext,
  focus: readonly FocusArea[],
): boolean {
  const blocks = blocksForPart(bankForPart, part, context, focus);
  return blockSets(blocks, target, context.phase).length > 0;
}
