/**
 * Underlaget kontrolleras och normaliseras (R-010 till R-021). Felmeddelandena är
 * texterna ur docs/design/texter.md, avsnitt 3, så att gränssnittet kan visa dem som de är.
 */
import {
  AREA_KEYS,
  COACH_COUNT,
  FOCUS_AREAS,
  FOCUS_AREA_HEADING,
  FOCUS_CHOICE_COUNT,
  GAME_FORMATS,
  HEADING_MIN_AGE,
  LEVELS,
  PLAYER_COUNT,
  SESSION_LENGTH_MAX,
  SESSION_LENGTH_MIN,
  allowedGameFormats,
  isFocusAreaRelevant,
  phaseForAge,
} from '../keys.ts';
import type { AreaKey, FocusArea, GameFormat, Level, Phase } from '../keys.ts';
import type { Input, InputError, InputResult } from '../types.ts';

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

/**
 * Fokusområden som ledaren kan välja för fasen: K eller R i fokusomraden.md, och
 * aldrig `nickspel` före 13 år.
 *
 * @regel R-019
 * @regel R-080
 */
export function selectableFocusAreas(phase: Phase, age: number): FocusArea[] {
  return FOCUS_AREAS.filter((focus) => {
    if (!isFocusAreaRelevant(focus, phase)) {
      return false;
    }
    return !(focus === FOCUS_AREA_HEADING && age < HEADING_MIN_AGE);
  });
}

/**
 * Kontrollerar underlaget. Generatorn körs bara med ett komplett underlag.
 *
 * @regel R-011
 * @regel R-014
 * @regel R-016
 * @regel R-017
 * @regel R-018
 * @regel R-019
 * @regel R-020
 * @regel R-080
 * @regel R-083
 * @regel R-090
 */
export function validateInput(raw: unknown): InputResult {
  const errors: InputError[] = [];
  const value = (raw ?? {}) as Record<string, unknown>;

  // R-011: åldern avgör allt annat, så den prövas först.
  const alder = value.alder;
  const phase = isInteger(alder) ? phaseForAge(alder) : undefined;
  if (!isInteger(alder) || phase === undefined) {
    errors.push({
      field: 'alder',
      message: 'Ange en ålder mellan 6 och 19 år.',
      regel: 'R-011',
    });
  }

  // R-014: den föreslagna spelformen eller dess närmaste grannar. R-015: fasen följer åldern.
  const spelform = value.spelform;
  const allowedFormats = isInteger(alder) ? allowedGameFormats(alder) : [];
  if (
    typeof spelform !== 'string' ||
    !(GAME_FORMATS as readonly string[]).includes(spelform) ||
    (allowedFormats.length > 0 && !allowedFormats.includes(spelform as GameFormat))
  ) {
    errors.push({
      field: 'spelform',
      message: 'Välj den föreslagna spelformen eller den närmast före eller efter.',
      regel: 'R-014',
    });
  }

  // R-016: exakt en nivå.
  const niva = value.niva;
  if (typeof niva !== 'string' || !(LEVELS as readonly string[]).includes(niva)) {
    errors.push({ field: 'niva', message: 'Välj en nivå.', regel: 'R-016' });
  }

  // R-017: antal spelare och ledare.
  const spelare = value.spelare;
  if (!isInteger(spelare) || spelare < PLAYER_COUNT.min || spelare > PLAYER_COUNT.max) {
    errors.push({
      field: 'spelare',
      message: `Antal spelare måste vara mellan ${PLAYER_COUNT.min} och ${PLAYER_COUNT.max}.`,
      regel: 'R-017',
    });
  }
  const ledare = value.ledare;
  if (!isInteger(ledare) || ledare < COACH_COUNT.min || ledare > COACH_COUNT.max) {
    errors.push({
      field: 'ledare',
      message: `Antal ledare måste vara mellan ${COACH_COUNT.min} och ${COACH_COUNT.max}.`,
      regel: 'R-017',
    });
  }

  // R-018: passlängden, med fasens tak.
  const passlangd = value.passlangd;
  if (!isInteger(passlangd)) {
    errors.push({
      field: 'passlangd',
      message: `Passet måste vara minst ${SESSION_LENGTH_MIN} minuter.`,
      regel: 'R-018',
    });
  } else if (passlangd < SESSION_LENGTH_MIN) {
    errors.push({
      field: 'passlangd',
      message: `Passet måste vara minst ${SESSION_LENGTH_MIN} minuter.`,
      regel: 'R-018',
    });
  } else if (phase !== undefined && passlangd > SESSION_LENGTH_MAX[phase]) {
    errors.push({
      field: 'passlangd',
      message: `Det längsta passet för den här åldern är ${SESSION_LENGTH_MAX[phase]} minuter.`,
      regel: 'R-018',
    });
  }

  // R-019, R-080 och R-083: fokusområdena.
  const fokus = value.fokus;
  if (!Array.isArray(fokus) || fokus.length < FOCUS_CHOICE_COUNT.min) {
    errors.push({ field: 'fokus', message: 'Välj minst ett fokusområde.', regel: 'R-019' });
  } else if (fokus.length > FOCUS_CHOICE_COUNT.max) {
    errors.push({
      field: 'fokus',
      message: `Du kan välja högst ${FOCUS_CHOICE_COUNT.max} fokusområden. Ta bort ett för att lägga till ett nytt.`,
      regel: 'R-019',
    });
  } else if (new Set(fokus).size !== fokus.length) {
    errors.push({
      field: 'fokus',
      message: 'Samma fokusområde kan bara väljas en gång.',
      regel: 'R-019',
    });
  } else if (phase !== undefined && isInteger(alder)) {
    const selectable = selectableFocusAreas(phase, alder);
    const unusable = fokus.filter(
      (item) => typeof item !== 'string' || !selectable.includes(item as FocusArea),
    );
    if (unusable.length > 0) {
      errors.push({
        field: 'fokus',
        message: 'Välj fokusområden som passar åldern.',
        regel: 'R-019',
      });
    } else if (fokus.length === 1 && fokus[0] === FOCUS_AREA_HEADING) {
      // R-083: nickspel väljs tillsammans med ett annat fokusområde.
      errors.push({
        field: 'fokus',
        message: 'Nickspel måste väljas tillsammans med minst ett annat fokusområde.',
        regel: 'R-083',
      });
    }
  }

  // R-090: yta är valfri.
  const yta = value.yta;
  if (yta !== undefined && yta !== null) {
    if (typeof yta !== 'string' || !(AREA_KEYS as readonly string[]).includes(yta)) {
      errors.push({ field: 'yta', message: 'Välj en yta eller låt bli.', regel: 'R-090' });
    }
  }

  if (errors.length > 0 || phase === undefined || !isInteger(alder)) {
    return { ok: false, errors };
  }

  const input: Input = {
    alder,
    spelform: spelform as GameFormat,
    niva: niva as Level,
    spelare: spelare as number,
    ledare: ledare as number,
    passlangd: passlangd as number,
    fokus: [...(fokus as FocusArea[])],
  };
  if (typeof yta === 'string') {
    input.yta = yta as AreaKey;
  }
  return { ok: true, input, phase };
}
