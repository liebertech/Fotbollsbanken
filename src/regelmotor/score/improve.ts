/**
 * Lokal förbättring till fixpunkt (R-049).
 *
 * De enkla ändringarna i regeln prövas i fast ordning: byta en övning (a), fylla en del som
 * saknar övning (b) och ersätta två moment med ett (c). Den första ändring som ger en
 * strikt bättre poänglista tillämpas, och loopen börjar om. När ingen ändring längre
 * förbättrar passet är R-049 uppfylld per definition.
 *
 * Ändring d, att flytta en vattenpaus, behöver ingen egen kandidat: pausplaceringen i
 * `time/breaks.ts` väljer redan den placering som ger kortast längsta sträcka utan paus för
 * de tider passet har, och den är deterministisk (R-037, ADR 0011 avsnitt 6).
 */
import type { SessionPartFromBank } from '../keys.ts';
import { blockExercises } from '../blocks/candidates.ts';
import { assembleDraft } from '../select/assemble.ts';
import type { SelectionContext } from '../select/assemble.ts';
import { blockSets } from '../select/fill.ts';
import type { Block, Draft, Selection } from '../types.ts';
import { compareScores, scoreSession } from './score.ts';

/** Skydd mot en oändlig loop om en poängpost någon gång skulle sluta vara ändlig. */
const MAX_ROUNDS = 100;

function copy(selection: Selection): Selection {
  const next: Selection = new Map();
  for (const [part, blocks] of selection) {
    next.set(part, [...blocks]);
  }
  return next;
}

function usedIds(selection: Selection, skip?: { part: SessionPartFromBank; index: number }): Set<string> {
  const ids = new Set<string>();
  for (const [part, blocks] of selection) {
    for (const [index, block] of blocks.entries()) {
      if (skip !== undefined && skip.part === part && skip.index === index) {
        continue;
      }
      for (const exercise of blockExercises(block)) {
        ids.add(exercise.id);
      }
    }
  }
  return ids;
}

function sameExercises(a: Block, b: Block): boolean {
  const left = blockExercises(a)
    .map((exercise) => exercise.id)
    .join(',');
  const right = blockExercises(b)
    .map((exercise) => exercise.id)
    .join(',');
  return left === right && a.kind === b.kind;
}

function targetFor(context: SelectionContext, part: SessionPartFromBank): number {
  return context.plan.parts.find((item) => item.part === part)?.target ?? 0;
}

/** Ändring a: byta en övning i ett moment, också i en station, mot en annan ur banken. */
function* swapNeighbours(selection: Selection, context: SelectionContext): Generator<Selection> {
  for (const [part, blocks] of selection) {
    const alternatives = context.blocks.get(part) ?? [];
    for (const [index, current] of blocks.entries()) {
      const taken = usedIds(selection, { part, index });
      for (const alternative of alternatives) {
        if (sameExercises(current, alternative)) {
          continue;
        }
        if (blockExercises(alternative).some((exercise) => taken.has(exercise.id))) {
          continue;
        }
        const next = copy(selection);
        const list = next.get(part);
        if (list === undefined) {
          continue;
        }
        list[index] = alternative;
        yield next;
      }
    }
  }
}

/** Ändring b: fylla en del som saknar övning med ett eller två moment. */
function* fillNeighbours(selection: Selection, context: SelectionContext): Generator<Selection> {
  for (const { part, target } of context.plan.parts) {
    const current = selection.get(part);
    if (current !== undefined && current.length > 0) {
      continue;
    }
    const sets = blockSets(
      context.blocks.get(part) ?? [],
      target,
      context.phase,
      usedIds(selection),
    );
    for (const set of sets) {
      const next = copy(selection);
      next.set(part, [...set.blocks]);
      yield next;
    }
  }
}

/** Ändring c: ersätta de två momenten i en del med ett moment. */
function* mergeNeighbours(selection: Selection, context: SelectionContext): Generator<Selection> {
  for (const [part, blocks] of selection) {
    if (blocks.length < 2) {
      continue;
    }
    const taken = usedIds(selection);
    for (const exercise of blocks.flatMap((block) => blockExercises(block))) {
      taken.delete(exercise.id);
    }
    const sets = blockSets(
      context.blocks.get(part) ?? [],
      targetFor(context, part),
      context.phase,
      taken,
    ).filter((set) => set.blocks.length === 1);
    for (const set of sets) {
      const next = copy(selection);
      next.set(part, [...set.blocks]);
      yield next;
    }
  }
}

export interface ImproveResult {
  selection: Selection;
  draft: Draft;
}

/**
 * Förbättrar passet till en fixpunkt.
 *
 * @regel R-049
 */
export function improve(
  selection: Selection,
  draft: Draft,
  context: SelectionContext,
): ImproveResult {
  let bestSelection = selection;
  let bestDraft = draft;
  let bestScore = scoreSession(draft, context);

  for (let round = 0; round < MAX_ROUNDS; round += 1) {
    let improved = false;
    const neighbours = [
      swapNeighbours(bestSelection, context),
      fillNeighbours(bestSelection, context),
      mergeNeighbours(bestSelection, context),
    ];
    for (const generator of neighbours) {
      for (const candidate of generator) {
        const candidateDraft = assembleDraft(candidate, context);
        if (candidateDraft === null) {
          continue;
        }
        const candidateScore = scoreSession(candidateDraft, context);
        if (compareScores(candidateScore, bestScore) > 0) {
          bestSelection = candidate;
          bestDraft = candidateDraft;
          bestScore = candidateScore;
          improved = true;
          break;
        }
      }
      if (improved) {
        break;
      }
    }
    if (!improved) {
      break;
    }
  }

  return { selection: bestSelection, draft: bestDraft };
}
