/**
 * Det genererade passet (berättelse 02 och 03, docs/design/skisser/02-genererat-pass.md).
 *
 * Vyn räknar ingenting själv: tider, delar, ersättningsfokus och förklaringar kommer som de
 * är ur motorns svar (ADR 0011 avsnitt 1).
 */
import type { PartResult, Session } from '../../regelmotor/index.ts';
import { buildSessionView } from './model.ts';
import type { PartView } from './model.ts';
import { ExerciseCard } from './ExerciseCard.tsx';
import {
  FIELD_NAMES,
  FOCUS_AREA_NAMES,
  GAME_FORMAT_NAMES,
  LEVEL_NAMES,
  NOTICE_TEXTS,
  PART_NAMES,
  stationLabel,
} from '../text/names.ts';
import { TEXTS, fill } from '../text/texts.ts';
import styles from './SessionView.module.css';

interface SessionViewProps {
  session: Session;
  onChangeInput: () => void;
  onGenerateAgain: () => void;
}

/** Fältnamnen i en läsbar rad: "Nivå, Antal spelare". */
function fieldNames(fields: PartResult['changeableFields']): string {
  return fields.map((field) => FIELD_NAMES[field]).join(', ');
}

/**
 * Texten som säger att delen fylldes med ett annat fokusområde än det ledaren valde.
 *
 * @regel R-121
 */
function SubstituteNote({ result }: { result: PartResult }) {
  if (result.substituteFocus === null) {
    return null;
  }
  const missing = result.missingFocus.map((focus) => FOCUS_AREA_NAMES[focus]).join(', ');
  return (
    <p className={styles.substitute}>
      <span aria-hidden="true">ⓘ </span>
      {fill(TEXTS.session.substituteFocus, {
        missing,
        substitute: FOCUS_AREA_NAMES[result.substituteFocus],
      })}
    </p>
  );
}

/**
 * En del som saknar övning: namn, måltid och förklaring, aldrig en tyst lucka.
 *
 * @regel R-100
 * @regel R-103
 */
function EmptyPart({ result, minutes }: { result: PartResult | null; minutes: number }) {
  const texts = TEXTS.session;
  const fields = result?.changeableFields ?? [];
  const combination = result?.emptyReason === 'gar-inte-att-kombinera' || fields.length === 0;
  return (
    <div className={styles.empty}>
      <p className={styles.emptyHeading}>{texts.emptyPart}</p>
      <p className={styles.emptyText}>{fill(texts.emptyTarget, { minutes })}</p>
      {combination ? (
        <p className={styles.emptyText}>{texts.emptyCombination}</p>
      ) : (
        <>
          <p className={styles.emptyText}>
            {fill(texts.emptyChangeable, { fields: fieldNames(fields) })}
          </p>
          <ul className={styles.fields}>
            {fields.map((field) => (
              <li key={field}>{FIELD_NAMES[field]}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Part({ part }: { part: PartView }) {
  const texts = TEXTS.session;
  const empty = part.result?.status === 'saknar-ovning';
  return (
    <section className={styles.part}>
      <h2 className={styles.partHeading}>
        {part.number}. {PART_NAMES[part.part]}
        {empty ? '' : ` · ${part.minutes} min`}
      </h2>

      {part.result !== null && <SubstituteNote result={part.result} />}

      {part.items.map((item) => {
        switch (item.kind) {
          case 'exercise':
            return (
              <ExerciseCard
                key={item.key}
                exercise={item.exercise}
                minutes={item.minutes}
                layout={item.layout}
                label={
                  item.period === null ? undefined : fill(texts.period, { number: item.period })
                }
              />
            );

          case 'stations':
            return (
              <div className={styles.stations} key={item.key}>
                <p className={styles.stationsHeading}>
                  {fill(texts.stationsHeading, {
                    count: item.stations.length,
                    minutes: item.minutes,
                  })}
                </p>
                {item.stations.map((station) => (
                  <ExerciseCard
                    key={`${item.key}-${station.station}`}
                    exercise={station.exercise}
                    minutes={item.stationMinutes ?? 0}
                    layout={station.layout}
                    label={stationLabel(station.station)}
                  />
                ))}
              </div>
            );

          case 'break':
            return (
              <p className={styles.break} key={item.key}>
                <span aria-hidden="true">💧 </span>
                {texts.breakRow} · {item.minutes} min
              </p>
            );

          case 'closing':
            return (
              <p className={styles.closing} key={item.key}>
                {texts.closingRow}
              </p>
            );

          case 'empty':
            return <EmptyPart key={item.key} result={part.result} minutes={item.minutes} />;
        }
      })}
    </section>
  );
}

export function SessionView({ session, onChangeInput, onGenerateAgain }: SessionViewProps) {
  const view = buildSessionView(session);
  const texts = TEXTS.session;
  const { input } = session;

  return (
    <div className={styles.view}>
      <h1>{texts.heading}</h1>

      <div className={styles.summary}>
        <p className={styles.summaryLine}>
          {input.alder} år · {GAME_FORMAT_NAMES[input.spelform]} · {LEVEL_NAMES[input.niva]} ·{' '}
          {input.spelare} spelare · {input.ledare} ledare · {input.passlangd} min
        </p>
        <p className={styles.summaryLine}>
          {view.shorterThanRequested
            ? fill(texts.actualTime, {
                actual: view.totalMinutes,
                requested: view.requestedMinutes,
              })
            : fill(texts.time, { actual: view.totalMinutes })}
        </p>
        <p className={styles.summaryLine}>
          {texts.focusLabel} {input.fokus.map((focus) => FOCUS_AREA_NAMES[focus]).join(', ')}
        </p>
      </div>

      <ul className={styles.notices}>
        {session.notices.map((notice) => {
          const text = NOTICE_TEXTS[notice.kind];
          return (
            <li className={styles.notice} key={notice.kind}>
              <span aria-hidden="true">{text.kind === 'tips' ? '💡' : '⚠'}</span>
              <span>{text.text}</span>
            </li>
          );
        })}
      </ul>

      {view.parts.map((part) => (
        <Part key={part.part} part={part} />
      ))}

      <div className={styles.actions}>
        <button className={styles.secondary} type="button" onClick={onChangeInput}>
          {texts.changeInput}
        </button>
        <button className={styles.primary} type="button" onClick={onGenerateAgain}>
          {texts.generateAgain}
        </button>
      </div>
    </div>
  );
}
