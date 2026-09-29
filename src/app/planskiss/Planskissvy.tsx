/**
 * En planskiss i en vy: utfallet av `readPlanskiss` blir skissen, "Planskiss saknas" eller
 * "Planskissen kunde inte visas" (ADR 0012 avsnitt 7, RK-1, berättelse 06 kriterium 1–3).
 *
 * Bara utfallet `giltig` når ritmotorn, och varje ritad skiss ligger i en egen felgräns. I
 * storleken `normal` och större visas teckenförklaringen alltid direkt under skissen
 * (ADR 0012 avsnitt 3). Bildtexten säger hur många ytor övningen behöver och hur många spelare
 * som inte fick plats (ADR 0012 avsnitt 4).
 */
import { useEffect } from 'react';
import type { GameFormat } from '../../regelmotor/index.ts';
import type { PlanskissReadResult } from '../../regelmotor/schema/planskiss.ts';
import {
  Planskiss,
  legendEntries,
  notDrawnText,
  parallelAreasText,
  sketchLayout,
} from '../../planskiss/index.ts';
import type { PlanskissStorlek } from '../../planskiss/index.ts';
import { PlanskissGrans } from './PlanskissGrans.tsx';
import { PlanskissFel, PlanskissSaknas } from './Platshallare.tsx';
import { Teckenforklaring } from './Teckenforklaring.tsx';
import styles from './Planskissvy.module.css';

export interface PlanskissvyProps {
  /** Utfallet av `readPlanskiss` för övningens `planskiss`. */
  result: PlanskissReadResult;
  /** Övningens namn, som blir skissens `<title>`. */
  titel: string;
  /** Prefix för skissens id:n, se `instanceId`. */
  instansId: string;
  storlek: PlanskissStorlek;
  spelform?: GameFormat;
  yta?: { langd: number; bredd: number };
  antalSpelare?: number;
}

/**
 * Ett `instansId` ur övningens id och platsen i passet (ADR 0012 avsnitt 5, RK-4). Allt utom
 * gemena a–z, siffror och bindestreck blir bindestreck, och id:t kortas till 70 tecken så att
 * ritmotorns suffix ryms inom 80.
 */
export function instanceId(...parts: string[]): string {
  const slug = parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);
  return slug.length > 0 ? slug : 'skiss';
}

type ValidProps = Omit<PlanskissvyProps, 'result'> & {
  result: Extract<PlanskissReadResult, { status: 'giltig' }>;
};

function DrawnSketch({
  result,
  titel,
  instansId,
  storlek,
  spelform,
  yta,
  antalSpelare,
}: ValidProps) {
  const { skiss } = result;
  const { players } = sketchLayout(skiss, yta, antalSpelare);
  const caption = [parallelAreasText(players.areas), notDrawnText(players.notDrawn)]
    .filter((text): text is string => text !== null)
    .join(' ');
  return (
    <>
      <span className={`${styles.sketch} ${styles[storlek] ?? ''}`}>
        <Planskiss
          skiss={skiss}
          spelform={spelform}
          yta={yta}
          antalSpelare={antalSpelare}
          storlek={storlek}
          titel={titel}
          instansId={instansId}
        />
        {caption.length > 0 && (
          // Texten finns redan i skissens desc, så skärmläsaren behöver den inte två gånger.
          <span className={styles.caption} aria-hidden="true">
            {caption}
          </span>
        )}
      </span>
      {storlek !== 'miniatyr' && (
        <Teckenforklaring
          entries={legendEntries(skiss, players)}
          instansId={instansId}
          storlek={storlek}
        />
      )}
    </>
  );
}

export function Planskissvy(props: PlanskissvyProps) {
  const { result, storlek } = props;

  useEffect(() => {
    if (result.status === 'ogiltig' && import.meta.env.DEV) {
      // Bara i utvecklingsläge (ADR 0012 avsnitt 7). Ledaren ser bara platshållaren.
      console.error('Planskissen är ogiltig', result.issues);
    }
  }, [result]);

  if (result.status === 'saknas') {
    return <PlanskissSaknas storlek={storlek} />;
  }
  if (result.status === 'ogiltig') {
    return <PlanskissFel storlek={storlek} />;
  }
  return (
    <PlanskissGrans storlek={storlek}>
      <DrawnSketch {...props} result={result} />
    </PlanskissGrans>
  );
}
