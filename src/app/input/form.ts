/**
 * Formulärets tillstånd (berättelse 01). Fälten är strängar så länge ledaren skriver i dem,
 * och blir ett underlag först i `toInput`. Regelmotorn äger reglerna: den här filen bestämmer
 * ingenting om vad som är giltigt, den skickar vidare till `validateInput`.
 */
import {
  FOCUS_BY_PHASE,
  allowedGameFormats,
  phaseForAge,
  selectableFocusAreas,
  suggestedGameFormat,
  FOCUS_CHOICE_COUNT,
} from '../../regelmotor/index.ts';
import type {
  AreaKey,
  FocusArea,
  GameFormat,
  InputError,
  InputField,
  Level,
  Phase,
} from '../../regelmotor/index.ts';

export interface InputFormState {
  alder: string;
  spelform: GameFormat | '';
  niva: Level;
  spelare: string;
  ledare: string;
  passlangd: string;
  fokus: FocusArea[];
  yta: AreaKey | '';
  /**
   * Sant när ledaren själv har valt spelform. Då byter en ny ålder inte spelformen, så länge
   * den valda är tillåten för åldern (R-014, skisser/01-underlag.md).
   */
  gameFormatChosen: boolean;
}

/**
 * Förvalen. Ålder och antal spelare lämnas tomma, eftersom de skiljer sig åt varje gång;
 * de övriga är de vanligaste värdena och sparar knapptryck på mobilen.
 */
export const EMPTY_FORM: InputFormState = {
  alder: '',
  spelform: '',
  niva: 'niva-2',
  spelare: '',
  ledare: '2',
  passlangd: '60',
  fokus: [],
  yta: '',
  gameFormatChosen: false,
};

/** Talet som ledaren skrivit, eller `undefined` när fältet inte är ett heltal. */
function toNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === '' || !/^-?\d+$/.test(trimmed)) {
    return undefined;
  }
  return Number.parseInt(trimmed, 10);
}

/** Fasen som åldern i formuläret ger, när åldern är giltig (R-012). */
export function formPhase(form: InputFormState): Phase | undefined {
  const alder = toNumber(form.alder);
  return alder === undefined ? undefined : phaseForAge(alder);
}

/** Spelformerna ledaren kan välja mellan för åldern (R-013, R-014). */
export function formGameFormats(form: InputFormState): GameFormat[] {
  const alder = toNumber(form.alder);
  return alder === undefined ? [] : allowedGameFormats(alder);
}

/** Fokusområdena som får visas för åldern (R-019, R-080). */
export function formFocusAreas(form: InputFormState): FocusArea[] {
  const alder = toNumber(form.alder);
  const phase = formPhase(form);
  if (alder === undefined || phase === undefined) {
    return [];
  }
  return selectableFocusAreas(phase, alder);
}

/** Är fokusområdet ett kärnområde för fasen? Styr märkningen "(K)" i listan (R-002). */
export function isCoreFocus(focus: FocusArea, phase: Phase): boolean {
  return FOCUS_BY_PHASE[focus][phase] === 'K';
}

/**
 * Ny ålder. Spelformen följer med åldern så länge ledaren inte själv har valt en (R-013),
 * och en spelform som inte längre är tillåten byts mot den föreslagna (R-014). Fokusområden
 * som inte finns för den nya åldern tas bort, eftersom de inte längre visas i listan (R-019).
 */
export function withAge(form: InputFormState, alder: string): InputFormState {
  const next: InputFormState = { ...form, alder };
  const value = toNumber(alder);
  const suggested = value === undefined ? undefined : suggestedGameFormat(value);
  const allowed = value === undefined ? [] : allowedGameFormats(value);

  if (suggested !== undefined) {
    if (!next.gameFormatChosen || next.spelform === '' || !allowed.includes(next.spelform)) {
      next.spelform = suggested;
      next.gameFormatChosen = false;
    }
  }

  const selectable = formFocusAreas(next);
  next.fokus = next.fokus.filter((focus) => selectable.includes(focus));
  return next;
}

/** Ledaren väljer spelform själv (R-014). */
export function withGameFormat(form: InputFormState, spelform: GameFormat): InputFormState {
  return { ...form, spelform, gameFormatChosen: true };
}

/**
 * Kryssar i eller ur ett fokusområde. Fler än tre går inte att kryssa i; listan behåller
 * ordningen ledaren valde, eftersom R-121 bygger kandidatlistan i den ordningen.
 *
 * @regel R-019
 * @regel R-121
 */
export function withFocusToggled(form: InputFormState, focus: FocusArea): InputFormState {
  if (form.fokus.includes(focus)) {
    return { ...form, fokus: form.fokus.filter((item) => item !== focus) };
  }
  if (form.fokus.length >= FOCUS_CHOICE_COUNT.max) {
    return form;
  }
  return { ...form, fokus: [...form.fokus, focus] };
}

/** Formuläret som ett underlag att skicka till `validateInput`. Tomma fält blir `undefined`. */
export function toInput(form: InputFormState): Record<string, unknown> {
  return {
    alder: toNumber(form.alder),
    spelform: form.spelform === '' ? undefined : form.spelform,
    niva: form.niva,
    spelare: toNumber(form.spelare),
    ledare: toNumber(form.ledare),
    passlangd: toNumber(form.passlangd),
    fokus: form.fokus,
    yta: form.yta === '' ? undefined : form.yta,
  };
}

/** Felen per fält, så att varje fält kan visa sitt eget (skisser/01-underlag.md). */
export function errorsByField(errors: readonly InputError[]): Map<InputField, InputError> {
  const map = new Map<InputField, InputError>();
  for (const error of errors) {
    if (!map.has(error.field)) {
      map.set(error.field, error);
    }
  }
  return map;
}
