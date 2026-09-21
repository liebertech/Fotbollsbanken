/**
 * Regelmotorns publika API. Det här är det enda appen importerar (ADR 0011 avsnitt 1).
 *
 * `generateSession` är en ren funktion: samma underlag, samma bank och samma frö ger alltid
 * exakt samma pass. Att funktionen bara tar `bank` gör R-022 till en egenskap hos typerna –
 * klubbens egna övningar kan inte nå generatorn, eftersom det inte finns någon parameter
 * att skicka in dem i.
 */
import { CORE_PARTS, PARTS_REQUIRED_FOR_SESSION, PART_PRIORITY_ORDER } from './keys.ts';
import type { CorePart, FocusArea, Phase, SessionPartFromBank } from './keys.ts';
import { createRng } from './random/rng.ts';
import { validateInput } from './input/validate.ts';
import { planTime } from './time/plan.ts';
import type { TimePlan } from './time/plan.ts';
import { blocksForPart, candidatesForPart } from './blocks/candidates.ts';
import { decideSubstituteFocus } from './focus/substitute.ts';
import { assembleDraft, buildSelection } from './select/assemble.ts';
import type { SelectionContext } from './select/assemble.ts';
import { improve } from './score/improve.ts';
import { scoreSession } from './score/score.ts';
import { checkSession } from './check/session.ts';
import { buildRows, totalMinutesOfRows } from './output/build.ts';
import { buildNotices } from './output/notices.ts';
import { explainEmptyPart, partCanBeFilled } from './output/explain.ts';
import { changeableFields } from './output/explain.ts';
import type {
  Block,
  Draft,
  Exercise,
  GenerationResult,
  Input,
  InputField,
  PartResult,
  Selection,
  Session,
} from './types.ts';

export { validateInput } from './input/validate.ts';
export { selectableFocusAreas } from './input/validate.ts';
export { planTime } from './time/plan.ts';
export { checkSession } from './check/session.ts';
export { scoreSession } from './score/score.ts';
export * from './types.ts';

/**
 * Tabellvärdena och härledningarna som gränssnittet behöver för att bygga formuläret:
 * vilka val som finns och vilka som är tillåtna för åldern. Appen importerar bara den här
 * filen (ADR 0011 avsnitt 1), så det appen ska kunna läsa exporteras här.
 */
export {
  AREA_KEYS,
  COACH_COUNT,
  FOCUS_AREAS,
  FOCUS_BY_PHASE,
  FOCUS_CHOICE_COUNT,
  GAME_FORMATS,
  LEVELS,
  PLAYER_COUNT,
  SESSION_LENGTH_MAX,
  SESSION_LENGTH_MIN,
  SESSION_PARTS,
  SESSION_PARTS_FROM_BANK,
  allowedGameFormats,
  phaseForAge,
  suggestedGameFormat,
} from './keys.ts';

/** Bygger kandidatlistan och momenten per del, med det fokus som gäller i delen. */
function buildBlocks(
  bank: readonly Exercise[],
  input: Input,
  phase: Phase,
  plan: TimePlan,
  effectiveFocus: Map<SessionPartFromBank, FocusArea[]>,
): { candidates: Map<SessionPartFromBank, Exercise[]>; blocks: Map<SessionPartFromBank, Block[]> } {
  const candidates = new Map<SessionPartFromBank, Exercise[]>();
  const blocks = new Map<SessionPartFromBank, Block[]>();
  for (const { part } of plan.parts) {
    const list = candidatesForPart(bank, part, { input, phase });
    candidates.set(part, list);
    blocks.set(
      part,
      blocksForPart(list, part, { input, phase }, effectiveFocus.get(part) ?? input.fokus),
    );
  }
  return { candidates, blocks };
}

/**
 * Ersättningsfokus för kärnan (R-121), och det fokus som därmed gäller i varje del.
 *
 * @regel R-121
 */
function decideFocus(
  bank: readonly Exercise[],
  input: Input,
  phase: Phase,
  plan: TimePlan,
): {
  effectiveFocus: Map<SessionPartFromBank, FocusArea[]>;
  substituteFocus: Map<SessionPartFromBank, FocusArea>;
  missingFocus: Map<SessionPartFromBank, FocusArea[]>;
} {
  const effectiveFocus = new Map<SessionPartFromBank, FocusArea[]>();
  const substituteFocus = new Map<SessionPartFromBank, FocusArea>();
  const missingFocus = new Map<SessionPartFromBank, FocusArea[]>();
  for (const { part } of plan.parts) {
    effectiveFocus.set(part, [...input.fokus]);
  }

  const coreParts = plan.parts
    .filter((item): item is { part: CorePart; target: number } =>
      (CORE_PARTS as readonly string[]).includes(item.part),
    )
    .map((item) => ({
      part: item.part,
      target: item.target,
      bank: candidatesForPart(bank, item.part, { input, phase }),
    }));

  const decisions = decideSubstituteFocus({
    context: { input, phase },
    chosenFocus: input.fokus,
    parts: coreParts,
  });

  for (const decision of decisions) {
    if (decision.substituteFocus !== null) {
      effectiveFocus.set(decision.part, [decision.substituteFocus]);
      substituteFocus.set(decision.part, decision.substituteFocus);
      missingFocus.set(decision.part, [...input.fokus]);
    }
  }
  return { effectiveFocus, substituteFocus, missingFocus };
}

/**
 * Om delarna inte går att kombinera tas den minst tungt vägande delen bort, i omvänd
 * prioritetsordning enligt post 2 i R-048, tills passet går ihop. Förbättringsloopen prövar
 * sedan att fylla den igen med en annan uppsättning (R-049, ändring b).
 *
 * @regel R-100
 */
function assembleWithFallback(
  selection: Selection,
  context: SelectionContext,
): { selection: Selection; draft: Draft } | null {
  const direct = assembleDraft(selection, context);
  if (direct !== null) {
    return { selection, draft: direct };
  }
  const order = [...PART_PRIORITY_ORDER].reverse();
  const reduced: Selection = new Map(selection);
  for (const part of order) {
    if (!reduced.has(part)) {
      continue;
    }
    reduced.delete(part);
    const draft = assembleDraft(reduced, context);
    if (draft !== null) {
      return { selection: new Map(reduced), draft };
    }
  }
  return null;
}

function partResults(
  draft: Draft,
  plan: TimePlan,
  bank: readonly Exercise[],
  input: Input,
  phase: Phase,
  missingFocus: Map<SessionPartFromBank, FocusArea[]>,
): PartResult[] {
  return plan.parts.map(({ part, target }) => {
    const fill = draft.fills.find((item) => item.part === part);
    const substitute = draft.substituteFocus.get(part) ?? null;
    if (fill !== undefined) {
      return {
        part,
        target,
        minutes: fill.total,
        status: 'fylld',
        substituteFocus: substitute,
        missingFocus: substitute === null ? [] : (missingFocus.get(part) ?? []),
        emptyReason: null,
        changeableFields: [],
      };
    }
    const explained = explainEmptyPart(
      part,
      target,
      { bank, input, phase },
      draft.effectiveFocus.get(part) ?? input.fokus,
    );
    return {
      part,
      target,
      minutes: 0,
      status: 'saknar-ovning',
      substituteFocus: null,
      missingFocus: [],
      emptyReason: explained.reason,
      changeableFields: explained.fields,
    };
  });
}

/**
 * Genererar ett pass, eller förklarar varför inget pass kunde skapas.
 *
 * @regel R-049
 * @regel R-100
 * @regel R-101
 * @regel R-102
 */
export function generateSession(
  input: Input,
  bank: readonly Exercise[],
  seed: string,
): GenerationResult {
  const validated = validateInput(input);
  if (!validated.ok) {
    return { kind: 'none', reason: { changeableFields: [], internalProblems: [] } };
  }
  const phase = validated.phase;
  const plan = planTime(phase, input.passlangd);
  const { effectiveFocus, substituteFocus, missingFocus } = decideFocus(bank, input, phase, plan);
  const { blocks } = buildBlocks(bank, input, phase, plan, effectiveFocus);

  const context: SelectionContext = {
    input,
    phase,
    plan,
    effectiveFocus,
    substituteFocus,
    blocks,
    rng: createRng(seed),
  };

  const selection = buildSelection(context);
  const assembled = assembleWithFallback(selection, context);

  // R-101: kan ingen av Öva, Spelövning och Spel fyllas skapas inget pass.
  const anyRequiredFilled = assembled
    ? PARTS_REQUIRED_FOR_SESSION.some((part) =>
        assembled.draft.fills.some((fill) => fill.part === part),
      )
    : false;
  if (assembled === null || !anyRequiredFilled) {
    return {
      kind: 'none',
      reason: {
        changeableFields: noSessionFields(bank, input, phase, plan),
        internalProblems: [],
      },
    };
  }

  const improved = improve(assembled.selection, assembled.draft, context);
  const draft = improved.draft;
  const rows = buildRows(draft, plan);
  const session: Session = {
    // R-102: underlaget i svaret är identiskt med det inskickade.
    input,
    phase,
    seed,
    totalMinutes: totalMinutesOfRows(rows),
    requestedMinutes: input.passlangd,
    rows,
    parts: partResults(draft, plan, bank, input, phase, missingFocus),
    removedParts: plan.removedParts,
    notices: buildNotices(rows, input, phase),
    longestStretch: draft.longestStretch,
  };

  // Steg 5 i kedjan: ett pass som inte klarar kontrollen lämnas aldrig ut (ADR 0011).
  const problems = checkSession(session);
  if (problems.length > 0) {
    return {
      kind: 'none',
      reason: {
        changeableFields: noSessionFields(bank, input, phase, plan),
        internalProblems: problems,
      },
    };
  }

  return { kind: 'session', session };
}

/**
 * Vilka val som, var för sig, skulle kunna ge ett pass när inget pass kunde skapas.
 *
 * @regel R-103
 */
function noSessionFields(
  bank: readonly Exercise[],
  input: Input,
  phase: Phase,
  plan: TimePlan,
): InputField[] {
  const fields = new Set<InputField>();
  for (const part of PARTS_REQUIRED_FOR_SESSION) {
    const target = plan.parts.find((item) => item.part === part)?.target;
    if (target === undefined) {
      continue;
    }
    for (const field of changeableFields(part, target, { bank, input, phase })) {
      fields.add(field);
    }
  }
  return [...fields];
}

/** Räknar fram poänglistan för ett genererat pass. Används av testerna (R-048). */
export function scoreOf(draft: Draft, input: Input, phase: Phase, plan: TimePlan): number[] {
  return scoreSession(draft, { input, phase, plan });
}

/** Kan delen fyllas med ledarens eget fokus? Exporteras för testernas skull (R-100). */
export { partCanBeFilled };
