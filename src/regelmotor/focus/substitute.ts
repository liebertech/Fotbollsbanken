/**
 * Ersättningsfokus när kärnan annars blir tom (R-121).
 *
 * Regelns fem steg ligger som fem steg i koden, och närhetstabellen ligger som data i
 * `keys.ts` (FOCUS_NEIGHBOURS och FOCUS_NEIGHBOUR_DEVIATIONS). Regeln gäller bara
 * `del-ovning` och `del-spelovning`: `del-uppvarmning` och `del-spel` har egna lösningar,
 * eftersom fokus är en prioritet där (R-044 till R-046).
 */
import { CORE_PARTS, FOCUS_NEVER_SUBSTITUTE, focusNeighbours, isFocusAreaRelevant } from '../keys.ts';
import type { CorePart, FocusArea } from '../keys.ts';
import type { BuildContext } from '../blocks/candidates.ts';
import { canFillPart } from '../select/fill.ts';
import type { Exercise } from '../types.ts';

/** Vilket fokus en del i kärnan använder, och vilka valda fokus som saknade övningar. */
export interface SubstituteDecision {
  part: CorePart;
  /** `null` betyder att ledarens valda fokus räcker för delen. */
  substituteFocus: FocusArea | null;
  /** Sant när delen inte kan fyllas alls, varken med valt fokus eller med en kandidat. */
  cannotFill: boolean;
}

export interface SubstituteInput {
  context: BuildContext;
  chosenFocus: readonly FocusArea[];
  /** Övningarna som kan komma i fråga för delen, och delens måltid. */
  parts: { part: CorePart; bank: readonly Exercise[]; target: number }[];
}

/**
 * Steg 2 och 3: kandidatlistan byggs ur ledarens fokusområden i vald ordning och rensas.
 *
 * @regel R-121
 */
export function candidateFocusList(
  chosenFocus: readonly FocusArea[],
  part: CorePart,
  context: BuildContext,
): FocusArea[] {
  const list: FocusArea[] = [];
  // Steg 2: för varje valt fokus läggs dess grannar för delen till, i tabellens ordning.
  for (const focus of chosenFocus) {
    for (const neighbour of focusNeighbours(focus, part, context.phase)) {
      list.push(neighbour);
    }
  }
  // Steg 3: dubbletter tas bort så att den första förekomsten står kvar, sedan ledarens
  // egna val, sedan fokus som är "-" för fasen, sist nickspel och malvaktsspel.
  const seen = new Set<FocusArea>();
  return list.filter((focus) => {
    if (seen.has(focus)) {
      return false;
    }
    seen.add(focus);
    if (chosenFocus.includes(focus)) {
      return false;
    }
    if (!isFocusAreaRelevant(focus, context.phase)) {
      return false;
    }
    return !FOCUS_NEVER_SUBSTITUTE.includes(focus);
  });
}

/**
 * Hela regeln, steg 1 till 5.
 *
 * @regel R-121
 */
export function decideSubstituteFocus(input: SubstituteInput): SubstituteDecision[] {
  const { context, chosenFocus } = input;
  const parts = CORE_PARTS.map((part) => input.parts.find((item) => item.part === part)).filter(
    (item): item is { part: CorePart; bank: readonly Exercise[]; target: number } =>
      item !== undefined,
  );

  const fillsWith = (
    item: { part: CorePart; bank: readonly Exercise[]; target: number },
    focus: readonly FocusArea[],
  ): boolean => canFillPart(item.bank, item.part, item.target, context, focus);

  // Steg 1: valt fokus först. Ett ersättningsfokus får aldrig användas för att få ett
  // bättre pass, bara för att en del i kärnan annars skulle stå tom.
  const needsSubstitute = parts.filter((item) => !fillsWith(item, chosenFocus));
  const decisions: SubstituteDecision[] = parts
    .filter((item) => !needsSubstitute.includes(item))
    .map((item) => ({ part: item.part, substituteFocus: null, cannotFill: false }));

  if (needsSubstitute.length === 0) {
    return decisions;
  }

  // Steg 5: samma ersättning i båda delarna om det går.
  if (needsSubstitute.length === 2) {
    const first = needsSubstitute[0];
    const second = needsSubstitute[1];
    if (first !== undefined && second !== undefined) {
      for (const focus of candidateFocusList(chosenFocus, first.part, context)) {
        if (fillsWith(first, [focus]) && fillsWith(second, [focus])) {
          return [
            ...decisions,
            { part: first.part, substituteFocus: focus, cannotFill: false },
            { part: second.part, substituteFocus: focus, cannotFill: false },
          ];
        }
      }
    }
  }

  // Steg 4: första kandidaten som fungerar, för varje del för sig.
  for (const item of needsSubstitute) {
    const focus = candidateFocusList(chosenFocus, item.part, context).find((candidate) =>
      fillsWith(item, [candidate]),
    );
    decisions.push({
      part: item.part,
      substituteFocus: focus ?? null,
      // Inget fokusområde i den rensade listan fungerar: delen ska stå tom (R-100).
      cannotFill: focus === undefined,
    });
  }

  return decisions;
}
