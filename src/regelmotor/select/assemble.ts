/**
 * Sätter ihop passet: tidstilldelning, pauser och den giriga fyllningen av delarna
 * (ADR 0011 avsnitt 5, steg 2 till 4).
 *
 * Delarna fylls i exakt den ordning post 2 i R-048 räknar upp dem, så att den del som
 * väger tyngst får välja övning först och inte blir utan för att en lättare del redan har
 * tagit övningen (R-070).
 */
import {
  BREAK_MINUTES,
  HEADING_MINUTES_CAP,
  PART_PRIORITY_ORDER,
  PART_TOLERANCE,
  SESSION_SHORTFALL,
} from '../keys.ts';
import type { FocusArea, Phase, SessionPartFromBank } from '../keys.ts';
import type { Rng } from '../random/rng.ts';
import { placeBreaks } from '../time/breaks.ts';
import type { BreakMoment } from '../time/breaks.ts';
import type { TimePlan } from '../time/plan.ts';
import { blockExercises } from '../blocks/candidates.ts';
import type { BuildContext } from '../blocks/candidates.ts';
import { blockSets, headingMinutes, pickAmongEqual, totalsFor } from './fill.ts';
import type { FillContext } from './fill.ts';
import type { Block, Draft, Input, PartFill, Selection } from '../types.ts';

/** Högst så här många tidskombinationer prövas mot pausplaceringen. */
const TIME_COMBINATION_LIMIT = 40;

export interface AssembleContext extends BuildContext {
  input: Input;
  phase: Phase;
  plan: TimePlan;
  /** Fokus som gäller i varje del: ledarens val, eller ett ersättningsfokus (R-121). */
  effectiveFocus: Map<SessionPartFromBank, FocusArea[]>;
  substituteFocus: Map<SessionPartFromBank, FocusArea>;
}

interface PartOption {
  part: SessionPartFromBank;
  blocks: Block[];
  target: number;
  /** Tider delen kan få, med fördelningen per moment. */
  totals: Map<number, number[]>;
  /** Den tid som ligger närmast momentens rekommenderade tider. */
  preferred: number;
}

function partOptions(selection: Selection, plan: TimePlan): PartOption[] | null {
  const options: PartOption[] = [];
  for (const { part, target } of plan.parts) {
    const blocks = selection.get(part);
    if (blocks === undefined || blocks.length === 0) {
      continue;
    }
    const all = totalsFor(blocks);
    const totals = new Map<number, number[]>();
    for (const [total, minutes] of all) {
      // R-035: varje del ligger inom måltiden +/- 3 minuter.
      if (total >= target - PART_TOLERANCE && total <= target + PART_TOLERANCE) {
        totals.set(total, minutes);
      }
    }
    if (totals.size === 0) {
      return null;
    }
    const preferred = [...totals.keys()].reduce((best, total) =>
      Math.abs(total - target) < Math.abs(best - target) ? total : best,
    );
    options.push({ part, blocks, target, totals, preferred });
  }
  return options;
}

/**
 * Tidstilldelningen. Delarnas tider väljs tillsammans, som en liten uttömmande sökning
 * över högst 7 summor per del (ADR 0011 avsnitt 5, steg 3).
 *
 * @regel R-034
 * @regel R-035
 * @regel R-036
 * @regel R-039
 * @regel R-065
 * @regel R-082
 */
export function assembleDraft(selection: Selection, context: AssembleContext): Draft | null {
  const { plan } = context;
  const options = partOptions(selection, plan);
  if (options === null) {
    return null;
  }
  const emptyParts = plan.parts
    .map((item) => item.part)
    .filter((part) => !options.some((option) => option.part === part));

  if (options.length === 0) {
    return null;
  }

  const fixedMinutes = plan.breakMinutes + plan.closingMinutes;
  const combinations: { totals: number[]; deviation: number; sum: number }[] = [];

  const walk = (index: number, chosen: number[], sum: number, deviation: number): void => {
    const option = options[index];
    if (option === undefined) {
      const total = sum + fixedMinutes;
      // R-036 gäller inte när en del saknar övning (R-039).
      if (
        emptyParts.length === 0 &&
        (total > plan.requestedMinutes || total < plan.requestedMinutes - SESSION_SHORTFALL)
      ) {
        return;
      }
      combinations.push({ totals: [...chosen], deviation, sum: total });
      return;
    }
    for (const total of [...option.totals.keys()].sort((a, b) => a - b)) {
      chosen.push(total);
      walk(index + 1, chosen, sum + total, deviation + Math.abs(total - option.preferred));
      chosen.pop();
    }
  };
  walk(0, [], 0, 0);

  if (combinations.length === 0) {
    return null;
  }

  combinations.sort((a, b) => {
    if (a.deviation !== b.deviation) {
      return a.deviation - b.deviation;
    }
    if (a.sum !== b.sum) {
      // Ett längre pass ligger närmare den begärda längden (R-036).
      return b.sum - a.sum;
    }
    for (let index = 0; index < a.totals.length; index += 1) {
      const left = a.totals[index] ?? 0;
      const right = b.totals[index] ?? 0;
      if (left !== right) {
        return left - right;
      }
    }
    return 0;
  });

  let best: Draft | null = null;
  for (const combination of combinations.slice(0, TIME_COMBINATION_LIMIT)) {
    const fills: PartFill[] = options.map((option, index) => {
      const total = combination.totals[index] ?? option.preferred;
      return {
        part: option.part,
        blocks: option.blocks,
        minutes: option.totals.get(total) ?? [],
        total,
      };
    });

    // R-082: nicktaket gäller hela passet.
    const heading = fills.reduce((sum, fill) => sum + headingMinutes(fill.blocks, fill.minutes), 0);
    if (heading > HEADING_MINUTES_CAP[context.phase]) {
      continue;
    }

    const moments: BreakMoment[] = [];
    for (const fill of fills) {
      for (const minutes of fill.minutes) {
        moments.push({ part: fill.part, minutes });
      }
    }
    const placement = placeBreaks(moments, plan.breakCount);

    const draft: Draft = {
      fills,
      emptyParts,
      effectiveFocus: context.effectiveFocus,
      substituteFocus: context.substituteFocus,
      totalMinutes: combination.sum,
      longestStretch: placement.longestStretch,
      breaksBeforeMoment: placement.before,
      breaksAfterLast: placement.after,
      gamePeriods: placement.periods,
    };
    if (best === null || draft.longestStretch < best.longestStretch) {
      best = draft;
    }
  }

  return best;
}

export interface SelectionContext extends AssembleContext {
  /** Kandidatmomenten per del, byggda med det fokus som gäller i delen (R-041, R-121). */
  blocks: Map<SessionPartFromBank, Block[]>;
  rng: Rng;
}

/**
 * Girig fyllning: delarna fylls i prioritetsordning, och inom en del väljs den
 * momentuppsättning som är bäst på de poster delen kan påverka.
 *
 * @regel R-038
 * @regel R-048
 * @regel R-070
 * @regel R-072
 */
export function buildSelection(context: SelectionContext): Selection {
  const selection: Selection = new Map();
  const used = new Set<string>();
  const covered = new Set<FocusArea>();
  const keptParts = new Set(context.plan.parts.map((item) => item.part));

  for (const part of PART_PRIORITY_ORDER) {
    if (!keptParts.has(part)) {
      continue;
    }
    const target = context.plan.parts.find((item) => item.part === part)?.target ?? 0;
    const focus = context.effectiveFocus.get(part) ?? context.input.fokus;
    const blocks = context.blocks.get(part) ?? [];
    const sets = blockSets(blocks, target, context.phase, used);
    if (sets.length === 0) {
      continue;
    }
    const coreFill = selection.get('del-ovning');
    const fillContext: FillContext = {
      input: context.input,
      phase: context.phase,
      focus,
      chosenFocus: context.input.fokus,
      coveredFocus: covered,
      coreFocus: context.effectiveFocus.get('del-ovning') ?? context.input.fokus,
      coreExercises: (coreFill ?? []).flatMap((block) => blockExercises(block)),
    };
    const ranked = pickAmongEqual(sets, part, fillContext, context.rng);
    const chosen = ranked[0];
    if (chosen === undefined) {
      continue;
    }
    selection.set(part, chosen.blocks);
    for (const block of chosen.blocks) {
      for (const exercise of blockExercises(block)) {
        used.add(exercise.id);
        for (const item of exercise.fokusomraden) {
          if (context.input.fokus.includes(item)) {
            covered.add(item);
          }
        }
      }
    }
  }

  return selection;
}

/** Hur många pauser passet har, i minuter. Används av kontrollen och av utdata. */
export function breakMinutes(count: number): number {
  return count * BREAK_MINUTES;
}
