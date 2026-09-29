/**
 * Platshållarna när en skiss inte kan ritas (ADR 0012 avsnitt 7, berättelse 06 kriterium 2
 * och 3, designsystem.md avsnitt 7): en tydligt inramad yta i skissens storlek med en text,
 * aldrig en tom lucka, en trasig bild eller en teknisk felutskrift.
 *
 * Platshållarna är `span`, så att de också kan stå där en skiss står inuti en knapp.
 */
import type { PlanskissStorlek } from '../../planskiss/index.ts';
import { TEXTS } from '../text/texts.ts';
import styles from './Planskissvy.module.css';

interface PlatshallareProps {
  storlek: PlanskissStorlek;
}

function Frame({ storlek, text }: { storlek: PlanskissStorlek; text: string }) {
  return (
    <span className={`${styles.placeholder} ${styles[storlek] ?? ''}`}>
      <span className={styles.placeholderText}>{text}</span>
    </span>
  );
}

/** Övningen saknar skissdata. */
export function PlanskissSaknas({ storlek }: PlatshallareProps) {
  return <Frame storlek={storlek} text={TEXTS.sketch.missing} />;
}

/** Skissdata gick inte att validera, eller ritningen föll i felgränsen. */
export function PlanskissFel({ storlek }: PlatshallareProps) {
  return <Frame storlek={storlek} text={TEXTS.sketch.invalid} />;
}
