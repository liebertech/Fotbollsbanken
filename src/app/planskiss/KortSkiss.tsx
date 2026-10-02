/**
 * Planskissen på ett övningskort i passet (berättelse 06 kriterium 1, berättelse 07,
 * designsystem.md avsnitt 7, skisser/02-genererat-pass.md).
 *
 * Kortet visar skissen som miniatyr. Miniatyren är en knapp som fäller ut skissen i storleken
 * `normal` med teckenförklaringen, i samma kort och utan sidbyte (berättelse 07 kriterium 4).
 * Saknas skissen eller är den ogiltig visas platshållaren, som inte går att klicka på.
 *
 * Skissen ritas ur övningen som den ligger i passet. Ett sparat pass som bär sina övningar
 * som ögonblicksbild visar därför skissen som den såg ut när passet sparades (berättelse 06
 * kriterium 9), och läses ändå genom `readPlanskiss` (ADR 0012 avsnitt 6).
 */
import { useId, useMemo, useState } from 'react';
import { exerciseArea } from '../../regelmotor/index.ts';
import type { Exercise, GameFormat, Layout } from '../../regelmotor/index.ts';
import { readPlanskiss } from '../../regelmotor/schema/planskiss.ts';
import { Planskissvy, instanceId } from './Planskissvy.tsx';
import { TEXTS, fill } from '../text/texts.ts';
import styles from './Planskissvy.module.css';

interface KortSkissProps {
  exercise: Exercise;
  /** Spelformen ledaren valde. Styr ytan och målstorleken (ADR 0012 avsnitt 1 och 2). */
  format: GameFormat;
  /** Gruppindelningen. Skissen ritas för den största gruppen (ADR 0012 avsnitt 4). */
  layout: Layout | null;
  /** Kortets plats i passet, så att två kort med samma övning får olika id:n (RK-4). */
  placeKey: string;
}

/**
 * Antalet spelare som skissen ritas för: den största gruppen, så att den extra spelaren vid
 * udda antal syns. Utan gruppindelning är antalet okänt, och basskissen visas.
 */
export function sketchPlayerCount(layout: Layout | null): number | undefined {
  if (layout === null || layout.sizes.length === 0) {
    return undefined;
  }
  return Math.max(...layout.sizes);
}

export function KortSkiss({ exercise, format, layout, placeKey }: KortSkissProps) {
  const result = useMemo(() => readPlanskiss(exercise.planskiss), [exercise.planskiss]);
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const base = instanceId(exercise.id, placeKey);
  const shared = {
    result,
    titel: exercise.namn,
    spelform: format,
    yta: exerciseArea(exercise, format) ?? undefined,
    antalSpelare: sketchPlayerCount(layout),
  };

  if (result.status !== 'giltig') {
    return <Planskissvy {...shared} storlek="miniatyr" instansId={`${base}-mini`} />;
  }

  return (
    <div className={styles.cardSketch}>
      <button
        className={styles.thumbnail}
        type="button"
        aria-label={fill(open ? TEXTS.sketch.hide : TEXTS.sketch.enlarge, {
          name: exercise.namn,
        })}
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen(!open)}
      >
        {/* Knappen har ett eget namn, så miniatyren läses inte upp en gång till. */}
        <Planskissvy {...shared} storlek="miniatyr" instansId={`${base}-mini`} dold />
      </button>
      {open && (
        <div className={styles.enlarged} id={regionId}>
          <Planskissvy {...shared} storlek="normal" instansId={`${base}-stor`} />
        </div>
      )}
    </div>
  );
}
