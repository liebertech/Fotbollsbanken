/**
 * Poänglistan i R-048: elva poster som jämförs uppifrån och ned. Varje post går att räkna
 * ut från passet självt, utan att andra pass behöver prövas.
 *
 * Posterna skrivs så att ett högre tal alltid är bättre, också för post 10 och 11 där
 * regeln säger "färre" och "kortare". Då blir jämförelsen en vanlig lexikografisk
 * jämförelse av tal.
 */
import { PART_PRIORITY_ORDER, WARMUP_BODY_FOCUS } from '../keys.ts';
import type { FocusArea, Phase, SessionPartFromBank } from '../keys.ts';
import { hasMainHit, hitsFocus } from '../filter/base.ts';
import { blockExercises } from '../blocks/candidates.ts';
import type { TimePlan } from '../time/plan.ts';
import type { Draft, Exercise, Input } from '../types.ts';

export interface ScoreContext {
  input: Input;
  phase: Phase;
  plan: TimePlan;
}

function exercisesIn(draft: Draft, part: SessionPartFromBank): Exercise[] {
  const fill = draft.fills.find((item) => item.part === part);
  if (fill === undefined) {
    return [];
  }
  return fill.blocks.flatMap((block) => blockExercises(block));
}

function partIsRemoved(plan: TimePlan, part: SessionPartFromBank): boolean {
  return plan.removedParts.includes(part);
}

function partHasBlocks(draft: Draft, part: SessionPartFromBank): boolean {
  return draft.fills.some((item) => item.part === part);
}

/**
 * Alla övningar i passet.
 *
 * @regel R-047
 */
export function allExercises(draft: Draft): Exercise[] {
  return draft.fills.flatMap((fill) => fill.blocks.flatMap((block) => blockExercises(block)));
}

/**
 * Post 3 och 4: alla övningar i delen har huvudträff mot det fokus som gäller i delen.
 * En del som tagits bort enligt R-033 räknas som uppfylld, en tom del som inte uppfylld.
 *
 * @regel R-042
 */
export function mainHitInPart(draft: Draft, plan: TimePlan, part: SessionPartFromBank): boolean {
  if (partIsRemoved(plan, part)) {
    return true;
  }
  const exercises = exercisesIn(draft, part);
  if (exercises.length === 0) {
    return false;
  }
  const focus = draft.effectiveFocus.get(part) ?? [];
  return exercises.every((exercise) => hasMainHit(exercise, focus));
}

/**
 * Post 5: minst en övning i Spelövning har ett fokusområde gemensamt med minst en övning i
 * Öva, bland de fokus som gäller för respektive del (R-121).
 *
 * @regel R-043
 */
export function redThread(draft: Draft, plan: TimePlan): boolean {
  if (partIsRemoved(plan, 'del-ovning') || partIsRemoved(plan, 'del-spelovning')) {
    return true;
  }
  const core = exercisesIn(draft, 'del-ovning');
  const game = exercisesIn(draft, 'del-spelovning');
  if (core.length === 0 || game.length === 0) {
    return false;
  }
  const coreFocus = draft.effectiveFocus.get('del-ovning') ?? [];
  const gameFocus = draft.effectiveFocus.get('del-spelovning') ?? [];
  return game.some((exercise) =>
    exercise.fokusomraden.some(
      (focus) =>
        gameFocus.includes(focus) &&
        coreFocus.includes(focus) &&
        core.some((other) => other.fokusomraden.includes(focus)),
    ),
  );
}

/**
 * Post 6: varje valt fokusområde träffas av minst en övning i passet. Prövas alltid mot
 * ledarens val, aldrig mot ett ersättningsfokus (R-121).
 *
 * @regel R-047
 */
export function allChosenFocusPresent(draft: Draft, chosen: readonly FocusArea[]): boolean {
  const exercises = allExercises(draft);
  return chosen.every((focus) =>
    exercises.some((exercise) => exercise.fokusomraden.includes(focus)),
  );
}

/**
 * Post 7: uppvärmningen förbereder kroppen.
 *
 * @regel R-044
 */
export function warmupPreparesBody(draft: Draft, phase: Phase): boolean {
  const exercises = exercisesIn(draft, 'del-uppvarmning');
  return exercises.some((exercise) => hitsFocus(exercise, WARMUP_BODY_FOCUS[phase]));
}

/**
 * Post 8 och 9: uppvärmningen och spelet träffar valt fokus.
 *
 * @regel R-045
 * @regel R-046
 */
export function partHitsChosenFocus(
  draft: Draft,
  part: SessionPartFromBank,
  chosen: readonly FocusArea[],
): boolean {
  return exercisesIn(draft, part).some((exercise) => hitsFocus(exercise, chosen));
}

/**
 * Hela poänglistan.
 *
 * @regel R-048
 */
export function scoreSession(draft: Draft, context: ScoreContext): number[] {
  const { plan, input, phase } = context;
  const keptParts = plan.parts.map((item) => item.part);

  // Post 1: antal delar som har minst ett moment, bland de delar som finns kvar efter R-033.
  const filled = keptParts.filter((part) => partHasBlocks(draft, part)).length;

  // Post 2: vilka delar som har moment, prövat i ordningen Öva, Spelövning, Spel, Uppvärmning.
  let pattern = 0;
  for (const part of PART_PRIORITY_ORDER) {
    const value = partIsRemoved(plan, part) || partHasBlocks(draft, part) ? 1 : 0;
    pattern = pattern * 2 + value;
  }

  const blocks = draft.fills.reduce((sum, fill) => sum + fill.blocks.length, 0);

  return [
    filled,
    pattern,
    mainHitInPart(draft, plan, 'del-ovning') ? 1 : 0,
    mainHitInPart(draft, plan, 'del-spelovning') ? 1 : 0,
    redThread(draft, plan) ? 1 : 0,
    allChosenFocusPresent(draft, input.fokus) ? 1 : 0,
    warmupPreparesBody(draft, phase) ? 1 : 0,
    partHitsChosenFocus(draft, 'del-uppvarmning', input.fokus) ? 1 : 0,
    partHitsChosenFocus(draft, 'del-spel', input.fokus) ? 1 : 0,
    -blocks,
    -draft.longestStretch,
  ];
}

/** Positivt tal betyder att `a` är det bättre passet. */
export function compareScores(a: readonly number[], b: readonly number[]): number {
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const left = a[index] ?? 0;
    const right = b[index] ?? 0;
    if (left !== right) {
      return left - right;
    }
  }
  return 0;
}
