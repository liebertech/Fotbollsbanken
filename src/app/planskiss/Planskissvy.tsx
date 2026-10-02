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
  /**
   * Döljer den ritade skissen för skärmläsare. Används för miniatyren inuti knappen, som har
   * ett eget tillgängligt namn (texter.md avsnitt 8). `<title>` och `<desc>` finns kvar.
   */
  dold?: boolean;
}

/** Längsta `instansId`, så att `-mini` och ritmotorns suffix ryms inom RK-4:s 80 tecken. */
const MAX_INSTANCE_ID = 70;

/** Gemena a–z, siffror och enkla bindestreck, utan bindestreck först eller sist. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** FNV-1a på 32 bitar, som sju tecken i bas 36. Deterministisk och utan beroenden. */
function shortHash(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).padStart(7, '0');
}

/**
 * Ett `instansId` ur övningens id och platsen i passet (ADR 0012 avsnitt 5, RK-4). Allt utom
 * gemena a–z, siffror och bindestreck blir bindestreck, och id:t blir högst 70 tecken så att
 * ritmotorns suffix ryms inom 80.
 *
 * Ett för långt id kortas i den första delen, övningens id, innan delarna fogas ihop. Resten,
 * platsen i passet, behålls hel, så att två kort med samma övning alltid får olika id:n (R6).
 * Efter den kortade delen står en hash av hela övnings-id:t, så att två långa övnings-id:n med
 * samma början också skiljs åt. Ryms inte ens resten kortas hela id:t och slutar med en hash
 * av alla delar.
 */
export function instanceId(...parts: string[]): string {
  const slugs = parts.map(slugify).filter((slug) => slug.length > 0);
  const joined = slugs.join('-');
  if (joined.length === 0) {
    return 'skiss';
  }
  if (joined.length <= MAX_INSTANCE_ID) {
    return joined;
  }
  const [head = '', ...rest] = slugs;
  const tail = rest.join('-');
  const headHash = shortHash(head);
  const headRoom = MAX_INSTANCE_ID - headHash.length - 1 - (tail.length > 0 ? tail.length + 1 : 0);
  if (headRoom >= 1) {
    const shortHead = head.slice(0, headRoom).replace(/-+$/, '');
    return [shortHead, headHash, tail].filter((part) => part.length > 0).join('-');
  }
  const allHash = shortHash(slugs.join('/'));
  const prefix = joined.slice(0, MAX_INSTANCE_ID - allHash.length - 1).replace(/-+$/, '');
  return `${prefix}-${allHash}`;
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
  dold,
}: ValidProps) {
  const { skiss } = result;
  const { sketch, players } = sketchLayout(skiss, yta, antalSpelare);
  const caption = [parallelAreasText(players.areas), notDrawnText(players.notDrawn)]
    .filter((text): text is string => text !== null)
    .join(' ');
  return (
    <>
      <span
        className={`${styles.sketch} ${styles[storlek] ?? ''}`}
        aria-hidden={dold === true ? true : undefined}
      >
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
          entries={legendEntries(sketch, players)}
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
