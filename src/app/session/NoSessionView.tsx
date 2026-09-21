/**
 * Inget matchande resultat (berättelse 03, docs/design/skisser/03-inget-matchande-resultat.md).
 *
 * Vyn visas bara när inget pass alls kunde skapas (R-101). Kunde minst en av Öva, Spelövning
 * och Spel fyllas visas passet i stället, med de tomma delarna markerade där.
 */
import type { Input, NoSessionReason } from '../../regelmotor/index.ts';
import {
  AREA_NAMES,
  FIELD_NAMES,
  FOCUS_AREA_NAMES,
  GAME_FORMAT_NAMES,
  LEVEL_NAMES,
} from '../text/names.ts';
import { TEXTS } from '../text/texts.ts';
import styles from './NoSessionView.module.css';

interface NoSessionViewProps {
  input: Input;
  reason: NoSessionReason;
  onChangeInput: () => void;
}

/** Underlaget i en rad, så att ledaren ser vad hon eller han bad om. */
export function summaryLine(input: Input): string {
  const parts = [
    `${input.alder} år`,
    GAME_FORMAT_NAMES[input.spelform],
    LEVEL_NAMES[input.niva],
    `${input.spelare} spelare`,
    `${input.ledare} ledare`,
    `${input.passlangd} min`,
    input.fokus.map((focus) => FOCUS_AREA_NAMES[focus]).join(', '),
  ];
  if (input.yta !== undefined) {
    parts.push(AREA_NAMES[input.yta]);
  }
  return parts.join(' · ');
}

export function NoSessionView({ input, reason, onChangeInput }: NoSessionViewProps) {
  const texts = TEXTS.noSession;
  // R-103: finns inget val som var för sig skulle lösa det är orsaken inte ett enskilt val.
  const fields = reason.changeableFields;

  return (
    <div className={styles.view}>
      <h1>{texts.heading}</h1>

      {fields.length > 0 ? (
        <>
          <p className={styles.text}>{texts.changeable}</p>
          <ul className={styles.fields}>
            {fields.map((field) => (
              <li key={field}>{FIELD_NAMES[field]}</li>
            ))}
          </ul>
        </>
      ) : (
        <p className={styles.text}>{texts.combination}</p>
      )}

      <p className={styles.reassurance}>{texts.reassurance}</p>

      <button className={styles.button} type="button" onClick={onChangeInput}>
        {texts.button}
      </button>

      <div className={styles.summary}>
        <h2 className={styles.summaryHeading}>{texts.summaryHeading}</h2>
        <p className={styles.text}>{summaryLine(input)}</p>
      </div>
    </div>
  );
}
