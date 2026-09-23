/**
 * Underlagsvyn (berättelse 01, docs/design/skisser/01-underlag.md).
 *
 * Vyn känner inga regler. Den frågar `form.ts` vad som är valbart och visar de fel som
 * `validateInput` lämnar, med texterna ur docs/design/texter.md.
 */
import {
  AREA_KEYS,
  LEVELS,
  SESSION_LENGTH_MAX,
  SESSION_LENGTH_MIN,
} from '../../regelmotor/index.ts';
import type { AreaKey, FocusArea, InputError, InputField, Level } from '../../regelmotor/index.ts';
import {
  errorsByField,
  formFocusAreas,
  formGameFormats,
  formPhase,
  isCoreFocus,
  withAge,
  withFocusToggled,
  withGameFormat,
} from './form.ts';
import type { InputFormState } from './form.ts';
import {
  AREA_NAMES,
  FOCUS_AREA_NAMES,
  FOCUS_GROUPS,
  GAME_FORMAT_NAMES,
  LEVEL_NAMES,
} from '../text/names.ts';
import { TEXTS, fill } from '../text/texts.ts';
import styles from './InputForm.module.css';

/** Högst tre fokusområden kan kryssas i (R-019). */
const FOCUS_MAX = 3;

interface InputFormProps {
  form: InputFormState;
  /** Felen från senaste försöket att generera. Tom lista innan ledaren har tryckt. */
  errors: readonly InputError[];
  onChange: (form: InputFormState) => void;
  onGenerate: () => void;
}

function FieldError({ id, error }: { id: string; error: InputError | undefined }) {
  if (error === undefined) {
    return null;
  }
  return (
    <p className={styles.error} id={id}>
      <span aria-hidden="true">⛔ </span>
      {error.message}
    </p>
  );
}

function classes(...values: (string | false | undefined)[]): string {
  return values.filter((value) => typeof value === 'string').join(' ');
}

export function InputForm({ form, errors, onChange, onGenerate }: InputFormProps) {
  const byField = errorsByField(errors);
  const phase = formPhase(form);
  const gameFormats = formGameFormats(form);
  const focusAreas = formFocusAreas(form);
  const texts = TEXTS.input;

  const describedBy = (field: InputField, ...extra: string[]): string | undefined => {
    const ids = [...extra];
    if (byField.has(field)) {
      ids.push(`fel-${field}`);
    }
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onGenerate();
      }}
    >
      <h1>{texts.heading}</h1>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="alder">
          {texts.age}
        </label>
        <p className={styles.help} id="hjalp-alder">
          <span aria-hidden="true">ⓘ </span>
          {texts.ageHelp}
        </p>
        <input
          className={styles.number}
          id="alder"
          type="number"
          inputMode="numeric"
          min={6}
          max={19}
          value={form.alder}
          aria-invalid={byField.has('alder')}
          aria-describedby={describedBy('alder', 'hjalp-alder')}
          onChange={(event) => onChange(withAge(form, event.target.value))}
        />
        <FieldError id="fel-alder" error={byField.get('alder')} />
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>{texts.gameFormat}</legend>
        <p className={styles.help}>{texts.gameFormatHelp}</p>
        <div className={styles.choices}>
          {gameFormats.map((format) => (
            <label
              key={format}
              className={classes(styles.choice, form.spelform === format && styles.choiceSelected)}
            >
              <input
                className="visually-hidden"
                type="radio"
                name="spelform"
                value={format}
                checked={form.spelform === format}
                onChange={() => onChange(withGameFormat(form, format))}
              />
              <span aria-hidden="true">{form.spelform === format ? '● ' : ''}</span>
              {GAME_FORMAT_NAMES[format]}
            </label>
          ))}
        </div>
        <FieldError id="fel-spelform" error={byField.get('spelform')} />
      </fieldset>

      <fieldset className={styles.field}>
        <legend className={styles.label}>{texts.level}</legend>
        <p className={styles.help}>{texts.levelHelp}</p>
        <div className={styles.choices}>
          {LEVELS.map((level: Level) => (
            <label
              key={level}
              className={classes(styles.choice, form.niva === level && styles.choiceSelected)}
            >
              <input
                className="visually-hidden"
                type="radio"
                name="niva"
                value={level}
                checked={form.niva === level}
                onChange={() => onChange({ ...form, niva: level })}
              />
              <span aria-hidden="true">{form.niva === level ? '● ' : ''}</span>
              {LEVEL_NAMES[level]}
            </label>
          ))}
        </div>
        <FieldError id="fel-niva" error={byField.get('niva')} />
      </fieldset>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="spelare">
          {texts.players}
        </label>
        <input
          className={styles.number}
          id="spelare"
          type="number"
          inputMode="numeric"
          min={1}
          max={40}
          value={form.spelare}
          aria-invalid={byField.has('spelare')}
          aria-describedby={describedBy('spelare')}
          onChange={(event) => onChange({ ...form, spelare: event.target.value })}
        />
        <FieldError id="fel-spelare" error={byField.get('spelare')} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ledare">
          {texts.coaches}
        </label>
        <input
          className={styles.number}
          id="ledare"
          type="number"
          inputMode="numeric"
          min={1}
          max={10}
          value={form.ledare}
          aria-invalid={byField.has('ledare')}
          aria-describedby={describedBy('ledare')}
          onChange={(event) => onChange({ ...form, ledare: event.target.value })}
        />
        <FieldError id="fel-ledare" error={byField.get('ledare')} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="passlangd">
          {texts.length}
        </label>
        {phase !== undefined && (
          <p className={styles.help} id="hjalp-passlangd">
            {fill(texts.lengthHelp, { min: SESSION_LENGTH_MIN, max: SESSION_LENGTH_MAX[phase] })}
          </p>
        )}
        <input
          className={styles.number}
          id="passlangd"
          type="number"
          inputMode="numeric"
          min={SESSION_LENGTH_MIN}
          value={form.passlangd}
          aria-invalid={byField.has('passlangd')}
          aria-describedby={describedBy(
            'passlangd',
            ...(phase === undefined ? [] : ['hjalp-passlangd']),
          )}
          onChange={(event) => onChange({ ...form, passlangd: event.target.value })}
        />
        <FieldError id="fel-passlangd" error={byField.get('passlangd')} />
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>{texts.focus}</legend>
        {phase === undefined ? (
          <p className={styles.help}>{texts.focusNeedsAge}</p>
        ) : (
          FOCUS_GROUPS.map((group) => {
            // Kärnområdena ligger överst i sin grupp (skisser/01-underlag.md).
            const areas = group.areas
              .filter((area) => focusAreas.includes(area))
              .sort((a, b) => Number(isCoreFocus(b, phase)) - Number(isCoreFocus(a, phase)));
            if (areas.length === 0) {
              return null;
            }
            return (
              <div className={styles.group} key={group.key}>
                <p className={styles.groupName}>{group.name}</p>
                <div className={styles.checkboxes}>
                  {areas.map((area: FocusArea) => {
                    const checked = form.fokus.includes(area);
                    const blocked = !checked && form.fokus.length >= FOCUS_MAX;
                    return (
                      <label
                        key={area}
                        className={classes(styles.checkbox, blocked && styles.checkboxDisabled)}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={blocked}
                          onChange={() => onChange(withFocusToggled(form, area))}
                        />
                        <span>
                          {FOCUS_AREA_NAMES[area]}
                          {/*
                           * "(K)" syns men läses inte bokstavligt: en skärmläsare får ordet
                           * i stället (skisser/01-underlag.md, Tillgänglighet).
                           */}
                          {isCoreFocus(area, phase) && (
                            <>
                              <span aria-hidden="true"> (K)</span>
                              {/* Kommatecknet skiljer orden åt i det tillgängliga namnet. */}
                              <span className="visually-hidden">{`, ${texts.focusCore}`}</span>
                            </>
                          )}
                          {blocked && <span className="visually-hidden"> {texts.focusFull}</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
        <FieldError id="fel-fokus" error={byField.get('fokus')} />
      </fieldset>

      <fieldset className={styles.field}>
        <legend className={styles.label}>{texts.area}</legend>
        <div className={styles.choices}>
          {(['', ...AREA_KEYS] as (AreaKey | '')[]).map((area) => {
            const name = area === '' ? texts.areaNone : AREA_NAMES[area];
            return (
              <label
                key={name}
                className={classes(styles.choice, form.yta === area && styles.choiceSelected)}
              >
                <input
                  className="visually-hidden"
                  type="radio"
                  name="yta"
                  value={area}
                  checked={form.yta === area}
                  onChange={() => onChange({ ...form, yta: area })}
                />
                <span aria-hidden="true">{form.yta === area ? '● ' : ''}</span>
                {name}
              </label>
            );
          })}
        </div>
        <FieldError id="fel-yta" error={byField.get('yta')} />
      </fieldset>

      {errors.length > 0 && (
        <p className={styles.summaryError} role="alert">
          <span aria-hidden="true">⛔ </span>
          {texts.summaryError}
        </p>
      )}

      <button className={styles.submit} type="submit">
        {texts.submit}
      </button>
    </form>
  );
}
