/**
 * Förklaringen när en del saknar övning (R-100, R-103).
 *
 * Ledaren ska alltid förstå vad som hände och själv bestämma vad som ska ändras. Appen
 * pekar ut vilka av ledarens val som, var för sig, skulle kunna ge en övning i delen, och
 * aldrig vilket nytt värde som är rätt.
 */
import { AREA_KEYS, COACH_COUNT, LEVELS, PLAYER_COUNT, allowedGameFormats } from '../keys.ts';
import type { FocusArea, Phase, SessionPartFromBank } from '../keys.ts';
import { selectableFocusAreas } from '../input/validate.ts';
import { candidatesForPart } from '../blocks/candidates.ts';
import { canFillPart } from '../select/fill.ts';
import type { EmptyReason, Exercise, Input, InputField } from '../types.ts';

export interface ExplainContext {
  bank: readonly Exercise[];
  input: Input;
  phase: Phase;
}

/**
 * Kan delen fyllas med ett givet underlag och ett givet fokus? Prövningen görs för delen
 * för sig, som begreppet *Delen kan fyllas* föreskriver.
 *
 * @regel R-100
 */
export function partCanBeFilled(
  bank: readonly Exercise[],
  input: Input,
  phase: Phase,
  part: SessionPartFromBank,
  target: number,
  focus: readonly FocusArea[],
): boolean {
  const context = { input, phase };
  const candidates = candidatesForPart(bank, part, context);
  return canFillPart(candidates, part, target, context, focus);
}

/** Underlag med ett ändrat värde, allt annat oförändrat. */
function withValue(input: Input, field: InputField, value: unknown): Input {
  const next: Input = { ...input, fokus: [...input.fokus] };
  switch (field) {
    case 'niva':
      next.niva = value as Input['niva'];
      break;
    case 'spelare':
      next.spelare = value as number;
      break;
    case 'ledare':
      next.ledare = value as number;
      break;
    case 'spelform':
      next.spelform = value as Input['spelform'];
      break;
    case 'fokus':
      next.fokus = value as FocusArea[];
      break;
    case 'yta':
      if (value === undefined) {
        delete next.yta;
      } else {
        next.yta = value as Input['yta'];
      }
      break;
    default:
      break;
  }
  return next;
}

/** Alternativa värden per val. Åldern och passlängden prövas inte (R-103). */
function alternatives(input: Input, phase: Phase): { field: InputField; values: unknown[] }[] {
  const focusValues = selectableFocusAreas(phase, input.alder)
    .map((focus) => [focus])
    .filter((value) => !(value.length === input.fokus.length && value[0] === input.fokus[0]));

  const players: number[] = [];
  for (let count = PLAYER_COUNT.min; count <= PLAYER_COUNT.max; count += 1) {
    if (count !== input.spelare) {
      players.push(count);
    }
  }
  const coaches: number[] = [];
  for (let count = COACH_COUNT.min; count <= COACH_COUNT.max; count += 1) {
    if (count !== input.ledare) {
      coaches.push(count);
    }
  }

  const list: { field: InputField; values: unknown[] }[] = [
    { field: 'niva', values: LEVELS.filter((level) => level !== input.niva) },
    { field: 'fokus', values: focusValues },
    { field: 'spelare', values: players },
    { field: 'ledare', values: coaches },
    {
      field: 'spelform',
      values: allowedGameFormats(input.alder).filter((format) => format !== input.spelform),
    },
  ];
  if (input.yta !== undefined) {
    list.push({
      field: 'yta',
      values: [...AREA_KEYS.filter((key) => key !== input.yta), undefined],
    });
  }
  return list;
}

/**
 * Vilka av ledarens val som, var för sig, skulle kunna ge en övning i delen. Prövningen
 * görs alltid mot ledarens egna val, aldrig mot ett ersättningsfokus (R-121).
 *
 * @regel R-102
 * @regel R-103
 */
export function changeableFields(
  part: SessionPartFromBank,
  target: number,
  context: ExplainContext,
): InputField[] {
  const { bank, input, phase } = context;
  const fields: InputField[] = [];
  for (const { field, values } of alternatives(input, phase)) {
    const helps = values.some((value) => {
      const candidate = withValue(input, field, value);
      return partCanBeFilled(bank, candidate, phase, part, target, candidate.fokus);
    });
    if (helps) {
      fields.push(field);
    }
  }
  return fields;
}

/**
 * Varför delen saknar övning, och vilka val som kan ändras.
 *
 * En del som kan fyllas för sig men ändå saknar övning har inte ett enskilt val som orsak.
 * Då visar appen i stället att delens övningar inte gick att kombinera med resten av passet.
 *
 * @regel R-100
 * @regel R-103
 */
export function explainEmptyPart(
  part: SessionPartFromBank,
  target: number,
  context: ExplainContext,
  effectiveFocus: readonly FocusArea[],
): { reason: EmptyReason; fields: InputField[] } {
  const fillable = partCanBeFilled(
    context.bank,
    context.input,
    context.phase,
    part,
    target,
    effectiveFocus,
  );
  if (fillable) {
    return { reason: 'gar-inte-att-kombinera', fields: [] };
  }
  return { reason: 'val-kan-andras', fields: changeableFields(part, target, context) };
}
