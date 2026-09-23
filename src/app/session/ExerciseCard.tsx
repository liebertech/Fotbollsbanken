/**
 * Ett övningskort i passet (berättelse 02, kriterium 2).
 *
 * Kortet visar alltid namn, syfte och tilldelad tid. Beskrivning, coachningspunkter och
 * varianter (R-029) fälls ut i samma kort med "Visa mer", utan sidbyte
 * (docs/design/skisser/02-genererat-pass.md).
 */
import { useId, useState } from 'react';
import type { Exercise, Layout } from '../../regelmotor/index.ts';
import { materialText } from '../text/names.ts';
import { TEXTS, fill } from '../text/texts.ts';
import styles from './ExerciseCard.module.css';

interface ExerciseCardProps {
  exercise: Exercise;
  minutes: number;
  layout: Layout | null;
  /** Stationens eller periodens etikett, när kortet ligger i ett sådant moment. */
  label?: string;
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

export function ExerciseCard({ exercise, minutes, layout, label }: ExerciseCardProps) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const texts = TEXTS.session;

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.name}>
          {label === undefined ? exercise.namn : `${label}: ${exercise.namn}`}
        </h3>
        <span className={styles.minutes}>{minutes} min</span>
      </div>

      {/* Planskissen ritas i inkrement 2 (docs/design/designsystem.md avsnitt 7). */}
      <p className={styles.sketch}>{texts.sketchMissing}</p>

      <p className={styles.purpose}>{exercise.syfte}</p>

      {layout !== null && (
        <p className={styles.layout}>
          {layoutText(layout)}
          {layout.oddText !== null && ` · ${texts.oddSolution} ${layout.oddText}`}
        </p>
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
