/**
 * Teckenförklaringen under en läsbar skiss (ADR 0012 avsnitt 3, berättelse 06 kriterium 6):
 * en lista med symbol och benämning i ord för varje typ som förekommer i skissen.
 *
 * Listan är HTML och ligger därför här och inte i src/planskiss/, där bara SVG-elementen i
 * vitlistan får skapas (ADR 0012 avsnitt 6). Symbolerna ritas av ritmotorn. Förklaringen är
 * aldrig hopfälld och har ingen knapp.
 */
import { useId } from 'react';
import { Teckensymbol } from '../../planskiss/index.ts';
import type { LegendEntry, PlanskissStorlek } from '../../planskiss/index.ts';
import { TEXTS } from '../text/texts.ts';
import styles from './Planskissvy.module.css';

interface TeckenforklaringProps {
  entries: readonly LegendEntry[];
  /** Skissens `instansId`. Symbolernas mönster får egna id:n under det. */
  instansId: string;
  storlek?: PlanskissStorlek;
}

export function Teckenforklaring({ entries, instansId, storlek }: TeckenforklaringProps) {
  const headingId = useId();
  if (entries.length === 0) {
    return null;
  }
  return (
    <div className={styles.legend}>
      <p className={styles.legendHeading} id={headingId}>
        {TEXTS.sketch.legendHeading}
      </p>
      <ul className={styles.legendList} aria-labelledby={headingId}>
        {entries.map((entry) => (
          <li className={styles.legendItem} key={entry.kind}>
            <Teckensymbol
              kind={entry.kind}
              team={entry.team}
              instansId={instansId}
              storlek={storlek}
            />
            <span>{entry.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
