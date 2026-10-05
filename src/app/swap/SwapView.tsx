/**
 * Byta en övning i passet (berättelse 04, docs/design/skisser/04-byt-ovning.md).
 *
 * Vyn visar bara de alternativ motorn har godkänt (R-104). Den räknar inget själv: vilka
 * övningar som får visas och vilken tid den nya övningen får (R-105) avgörs av regelmotorn.
 * Klubbens egna övningar (R-106) kommer med inkrement 4, så här finns bara bankens sektion.
 */
import { useId, useMemo, useState } from 'react';
import { swapOptions } from '../../regelmotor/index.ts';
import type { BankExercise, ItemRef, Session } from '../../regelmotor/index.ts';
import { KortSkiss } from '../planskiss/KortSkiss.tsx';
import { FOCUS_AREA_NAMES, PART_NAMES, stationLabel } from '../text/names.ts';
import { TEXTS, fill } from '../text/texts.ts';
import styles from './SwapView.module.css';

interface SwapViewProps {
  session: Session;
  /** Platsen i passet där övningen som ska bytas ligger. */
  target: ItemRef;
  /** Den gemensamma banken (R-104). */
  bank: readonly BankExercise[];
  onChoose: (exercise: BankExercise) => void;
  onBack: () => void;
}

/** Ett spann som text: "5–15", eller "2" när båda ändarna är lika. */
function span(min: number, max: number): string {
  return min === max ? String(min) : `${min}–${max}`;
}

/** Övningen som byts ut, som ingressen beskriver den. */
function replacedText(session: Session, target: ItemRef): { part: string; text: string } {
  const rows = session.rows.filter(
    (row) =>
      row.block === target.block &&
      (target.station === null
        ? row.kind === 'exercise' || row.kind === 'period'
        : row.kind === 'station' && row.station === target.station),
  );
  const first = rows[0];
  const name = first?.exercise?.namn ?? '';
  const part = first?.part === null || first?.part === undefined ? '' : PART_NAMES[first.part];
  if (target.station !== null) {
    return {
      part,
      text: fill(TEXTS.swap.replacingStation, {
        name,
        station: stationLabel(target.station),
        minutes: first?.stationMinutes ?? 0,
      }),
    };
  }
  const minutes = rows.reduce((sum, row) => sum + row.minutes, 0);
  return { part, text: fill(TEXTS.swap.replacing, { name, minutes }) };
}

/** Söker på namn och fokusområden, utan hänsyn till skiftläge. Ändrar inte vad som är tillåtet. */
function matches(exercise: BankExercise, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase('sv');
  if (needle.length === 0) {
    return true;
  }
  const haystack = [
    exercise.namn,
    ...exercise.fokusomraden.map((focus) => FOCUS_AREA_NAMES[focus]),
  ];
  return haystack.some((text) => text.toLocaleLowerCase('sv').includes(needle));
}

export function SwapView({ session, target, bank, onChoose, onBack }: SwapViewProps) {
  const texts = TEXTS.swap;
  const options = useMemo(() => swapOptions(session, target, bank), [session, target, bank]);
  const [query, setQuery] = useState('');
  const searchId = useId();
  const sectionId = useId();
  const replaced = replacedText(session, target);
  const visible = options
    .filter((exercise) => matches(exercise, query))
    .sort((a, b) => a.namn.localeCompare(b.namn, 'sv'));

  return (
    <div className={styles.view}>
      <button
        className={styles.back}
        type="button"
        onClick={onBack}
        /*
         * Vyn byts när ledaren trycker "Byt övning", och fokus får inte bli kvar på en knapp
         * som inte längre finns. Första elementet i vyn får fokus; rubriken kommer direkt
         * efter. autoFocus och inte en ref, eftersom ref är spärrad i appen (R3).
         */
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      >
        <span aria-hidden="true">← </span>
        {texts.back}
      </button>

      <h1>{fill(texts.heading, { part: replaced.part })}</h1>
      <p className={styles.replacing}>{replaced.text}</p>

      {options.length === 0 ? (
        <div className={styles.none}>
          <p className={styles.noneText}>{texts.noOptions}</p>
          <button className={styles.primary} type="button" onClick={onBack}>
            {texts.back}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.search}>
            <label htmlFor={searchId}>{texts.search}</label>
            <input
              id={searchId}
              className={styles.searchInput}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <section aria-labelledby={sectionId} className={styles.section}>
            <h2 id={sectionId} className={styles.sectionHeading}>
              {texts.bankSection}
            </h2>
            {visible.length === 0 ? (
              <p role="status">{texts.noSearchMatch}</p>
            ) : (
              <ul className={styles.list}>
                {visible.map((exercise) => (
                  <li key={exercise.id} className={styles.card}>
                    <h3 className={styles.name}>{exercise.namn}</h3>
                    <p className={styles.focus}>
                      {exercise.fokusomraden.map((focus) => FOCUS_AREA_NAMES[focus]).join(', ')}
                    </p>
                    <p className={styles.figures}>
                      {fill(texts.figures, {
                        time: span(exercise.tid.kortast, exercise.tid.langst),
                        players: span(exercise.spelare.min, exercise.spelare.max),
                      })}
                    </p>
                    {/* Miniatyren, som på passets kort (designsystem.md avsnitt 7). */}
                    <KortSkiss
                      exercise={exercise}
                      format={session.input.spelform}
                      layout={null}
                      placeKey={`alternativ-${exercise.id}`}
                    />
                    <button
                      className={styles.choose}
                      type="button"
                      onClick={() => onChoose(exercise)}
                    >
                      {texts.choose}
                      <span className="visually-hidden">: {exercise.namn}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
