/**
 * Ett övningskort i passet (berättelse 02, kriterium 2).
 *
 * Kortet visar alltid namn, syfte och tilldelad tid. Beskrivning, coachningspunkter och
 * varianter (R-029) fälls ut i samma kort med "Visa mer", utan sidbyte
 * (docs/design/skisser/02-genererat-pass.md).
 */
import { useId, useState } from 'react';
import { exerciseArea } from '../../regelmotor/index.ts';
import type { Exercise, GameFormat, Layout } from '../../regelmotor/index.ts';
import { KortSkiss } from '../planskiss/KortSkiss.tsx';
import { materialText } from '../text/names.ts';
import { TEXTS, fill } from '../text/texts.ts';
import { areaReference } from './model.ts';
import styles from './ExerciseCard.module.css';

interface ExerciseCardProps {
  exercise: Exercise;
  minutes: number;
  layout: Layout | null;
  /** Spelformen ledaren valde. Ytan och ytreferensen anges per spelform (R-092, ADR 0017). */
  format: GameFormat;
  /** Stationens eller periodens etikett, när kortet ligger i ett sådant moment. */
  label?: string;
  /**
   * Sant på det första kortet i passet med en ytreferens (`firstAreaReferenceKey` i
   * model.ts). Förklaringen visas bara om kortet också har en referens att förklara.
   */
  showAreaHelp?: boolean;
  /**
   * Kortets plats i passet (`key` i model.ts). Blir en del av planskissens id:n, så att två
   * kort med samma övning inte delar mönster (ADR 0012 avsnitt 5, RK-4).
   */
  placeKey?: string;
  /** Öppnar bytesvyn för kortets övning (berättelse 04). Utan den visas ingen bytesknapp. */
  onSwap?: () => void;
  /** Sätter fokus på bytesknappen, när ledaren kommer tillbaka från bytesvyn. */
  focusSwap?: boolean;
  /** Bekräftelsen efter ett byte, på kortet med den nya övningen (skisser/04-byt-ovning.md). */
  confirmation?: string | null;
}

/**
 * Ett mått med svenskt decimaltecken: 18 × 12, eller 18,3 × 5,5. Hårda mellanslag runt "×"
 * så att tecknet aldrig hamnar ensamt på en rad (docs/design/texter.md avsnitt 4).
 */
function sizeText(langd: number, bredd: number): string {
  const decimal = (value: number): string => String(value).replace('.', ',');
  return `${decimal(langd)}\u00a0×\u00a0${decimal(bredd)}`;
}

/**
 * Ytraden: metertalet, och ytreferensen i parentes när övningen har en för spelformen.
 * Referensen står aldrig ensam och räknas aldrig fram ur måttet (ADR 0017).
 */
function areaLine(exercise: Exercise, format: GameFormat): string | null {
  const area = exerciseArea(exercise, format);
  if (area === null) {
    return null;
  }
  const size = sizeText(area.langd, area.bredd);
  const reference = areaReference(exercise, format);
  const texts = TEXTS.session;
  return reference === null
    ? fill(texts.area, { size })
    : fill(texts.areaWithReference, { size, reference });
}

/** Gruppindelningen i ord (R-051 till R-056). */
function layoutText(layout: Layout): string {
  const texts = TEXTS.session;
  const first = layout.sizes[0] ?? 0;
  if (layout.groups === 1) {
    return fill(texts.oneGroup, { size: first });
  }
  // Lika stora grupper skrivs som en storlek, ojämna som hela listan (R-052).
  return layout.sizes.every((size) => size === first)
    ? fill(texts.groups, { groups: layout.groups, size: first })
    : fill(texts.groupsMixed, { groups: layout.groups, sizes: layout.sizes.join(' + ') });
}

/**
 * Ytförklaringen: en egen disclosure, inte kopplad till "Visa mer". Texten finns bara i DOM:en
 * när den är utfälld, och ingenting ges bara vid hovring (skisser/02-genererat-pass.md).
 */
function AreaHelp() {
  const [open, setOpen] = useState(false);
  const helpId = useId();
  const texts = TEXTS.session;
  return (
    <>
      <button
        className={styles.helpToggle}
        type="button"
        aria-expanded={open}
        aria-controls={helpId}
        onClick={() => setOpen(!open)}
      >
        {open ? texts.areaHelpHide : texts.areaHelpShow}
      </button>
      {open && (
        <p className={styles.helpText} id={helpId}>
          {texts.areaHelpText}
        </p>
      )}
    </>
  );
}

export function ExerciseCard({
  exercise,
  minutes,
  layout,
  format,
  label,
  showAreaHelp = false,
  placeKey = 'kort',
  onSwap,
  focusSwap = false,
  confirmation = null,
}: ExerciseCardProps) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const texts = TEXTS.session;
  const area = areaLine(exercise, format);
  const areaHelp = showAreaHelp && areaReference(exercise, format) !== null;
  const heading = label === undefined ? exercise.namn : `${label}: ${exercise.namn}`;

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.name}>{heading}</h3>
        <span className={styles.minutes}>{minutes} min</span>
      </div>

      {confirmation !== null && <p className={styles.confirmation}>{confirmation}</p>}

      {/* Miniatyr som fälls ut till normal storlek (designsystem.md avsnitt 7, berättelse 07). */}
      <KortSkiss exercise={exercise} format={format} layout={layout} placeKey={placeKey} />

      <p className={styles.purpose}>{exercise.syfte}</p>

      {layout !== null && (
        <p className={styles.layout}>
          {layoutText(layout)}
          {layout.oddText !== null && ` · ${texts.oddSolution} ${layout.oddText}`}
        </p>
      )}

      {area !== null && <p className={styles.area}>{area}</p>}

      {areaHelp && <AreaHelp />}

      <div className={styles.actions}>
        {onSwap !== undefined && (
          <button
            className={styles.toggle}
            type="button"
            onClick={onSwap}
            // Ett unikt namn per kort, så att knapplistan i en skärmläsare går att använda. Det
            // börjar med den synliga texten (WCAG 2.5.3), som miniatyrknappens namn.
            aria-label={fill(texts.swapButtonName, { name: heading })}
            /*
             * Fokus tillbaka till kortet efter bytesvyn, med eller utan byte. Fokus flyttas bara
             * när ledaren själv har tryckt på knappen, aldrig när sidan laddas. autoFocus och
             * inte en ref, eftersom ref är spärrad i appen (R3).
             */
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={focusSwap}
          >
            {texts.swapButton}
          </button>
        )}
        <button
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen(!open)}
        >
          {open ? texts.showLess : texts.showMore}
        </button>
      </div>

      {open && (
        <div className={styles.details} id={detailsId}>
          <p className={styles.detailHeading}>{texts.description}</p>
          <p className={styles.detailText}>{exercise.beskrivning}</p>

          {exercise.organisation !== undefined && (
            <>
              <p className={styles.detailHeading}>{texts.organisation}</p>
              <p className={styles.detailText}>{exercise.organisation}</p>
            </>
          )}

          {exercise.ledaruppgift !== undefined && (
            <>
              <p className={styles.detailHeading}>{texts.coachTask}</p>
              <p className={styles.detailText}>{exercise.ledaruppgift}</p>
            </>
          )}

          {exercise.coachningspunkter !== undefined && (
            <>
              <p className={styles.detailHeading}>{texts.coachingPoints}</p>
              <ul className={styles.list}>
                {exercise.coachningspunkter.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </>
          )}

          {exercise.varianter !== undefined && (
            <>
              <p className={styles.detailHeading}>{texts.variants}</p>
              <ul className={styles.list}>
                <li>
                  {texts.easier}: {exercise.varianter.lattare}
                </li>
                <li>
                  {texts.harder}: {exercise.varianter.svarare}
                </li>
              </ul>
            </>
          )}

          {exercise.material !== undefined && exercise.material.length > 0 && (
            <>
              <p className={styles.detailHeading}>{texts.material}</p>
              <ul className={styles.list}>
                {exercise.material.map((item) => (
                  <li key={`${item.typ}-${item.anteckning ?? ''}`}>{materialText(item)}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </article>
  );
}
