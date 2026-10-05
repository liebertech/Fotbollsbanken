/**
 * Skissens tillgängliga namn och beskrivning: `<title>` och `<desc>` (ADR 0012 avsnitt 5,
 * docs/design/texter.md avsnitt 8, berättelse 06 kriterium 8).
 *
 * Texterna blir bara barn till `<title>` och `<desc>`, aldrig attributvärden (RK-2).
 */
import type { Planskissdata } from '../regelmotor/schema/planskiss.ts';
import { decimal } from './matt.ts';
import type { AreaFrame } from './matt.ts';
import type { ScaledPlayers, Team } from './skalning.ts';

/** `<title>`: alltid "{övningsnamn}, planskiss" (texter.md avsnitt 8). */
export function sketchTitle(exerciseName: string): string {
  return `${exerciseName}, planskiss`;
}

/** Meningen för parallella ytor, i bildtexten och sist i `desc` (ADR 0012 avsnitt 4). */
export function parallelAreasText(areas: number): string | null {
  return areas > 1 ? `Så här ser en av ${areas} ytor ut.` : null;
}

/**
 * Meningen när spelare inte får plats i skissen: platserna räckte inte till, eller taket på
 * 40 spelarsymboler nåddes (ADR 0012 avsnitt 4, S-5). Texten saknas i texter.md och är ett
 * förslag till UX-designern.
 */
export function notDrawnText(count: number): string | null {
  if (count <= 0) {
    return null;
  }
  return count === 1
    ? '1 spelare till står inte med i skissen.'
    : `${count} spelare till står inte med i skissen.`;
}

interface Counts {
  outfield: Record<Team, number>;
  keepers: number;
  goals: number;
  movements: Record<'passning' | 'lopning' | 'dribbling' | 'skott', number>;
}

/** Det som faktiskt ritas: basskissen och de tillagda spelarna. */
function count(sketch: Planskissdata, players: ScaledPlayers): Counts {
  const counts: Counts = {
    outfield: { a: 0, b: 0, neutral: 0 },
    keepers: 0,
    goals: 0,
    movements: { passning: 0, lopning: 0, dribbling: 0, skott: 0 },
  };
  for (const item of sketch.objekt) {
    if (item.typ === 'spelare') {
      if (item.malvakt === true) {
        counts.keepers += 1;
      } else {
        counts.outfield[item.lag] += 1;
      }
    } else if (item.typ === 'mal') {
      counts.goals += 1;
    }
  }
  // En tillagd spelare är alltid utespelare (S-7).
  for (const added of players.added) {
    counts.outfield[added.lag] += 1;
  }
  for (const movement of sketch.rorelser ?? []) {
    counts.movements[movement.typ] += 1;
  }
  return counts;
}

/** "a, b och c". */
function andList(parts: readonly string[]): string {
  if (parts.length < 2) {
    return parts.join('');
  }
  return `${parts.slice(0, -1).join(', ')} och ${parts[parts.length - 1] ?? ''}`;
}

const MOVEMENT_WORDS = {
  passning: ['passning', 'passningar'],
  lopning: ['löpning', 'löpningar'],
  dribbling: ['dribbling', 'dribblingar'],
  // texter.md avsnitt 8: skott skrivs "avslut", som i teckenförklaringen.
  skott: ['avslut', 'avslut'],
} as const;

/** Den andra meningen: spelarna per lag och målvakterna. Utelämnas helt utan spelare. */
function playerSentence(counts: Counts): string | null {
  const parts: string[] = [];
  const first = () => parts.length === 0;
  const { a, b, neutral } = counts.outfield;
  if (a > 0) {
    parts.push(`${a} spelare i lag A`);
  }
  if (b > 0) {
    parts.push(first() ? `${b} spelare i lag B` : `${b} i lag B`);
  }
  if (neutral > 0) {
    const word = neutral === 1 ? 'neutral' : 'neutrala';
    parts.push(first() ? `${neutral} ${word} spelare` : `${neutral} ${word}`);
  }
  if (counts.keepers > 0) {
    parts.push(`${counts.keepers} ${counts.keepers === 1 ? 'målvakt' : 'målvakter'}`);
  }
  return parts.length === 0 ? null : `${parts.join(', ')}.`;
}

function movementSentence(counts: Counts): string | null {
  const parts = (Object.keys(MOVEMENT_WORDS) as (keyof typeof MOVEMENT_WORDS)[])
    .filter((type) => counts.movements[type] > 0)
    .map((type) => {
      const amount = counts.movements[type];
      const [one, many] = MOVEMENT_WORDS[type];
      return `${amount} ${amount === 1 ? one : many}`;
    });
  return parts.length === 0 ? null : `${andList(parts)}.`;
}

/**
 * `<desc>`: skissens `beskrivning` ordagrant när den finns, annars den genererade
 * sammanfattningen enligt mallen i texter.md avsnitt 8. "×" skrivs som "gånger".
 * Meningen om parallella ytor läggs till sist i båda fallen.
 */
export function sketchDescription(
  sketch: Planskissdata,
  frame: AreaFrame,
  players: ScaledPlayers,
): string {
  const sentences: string[] = [];
  if (sketch.beskrivning !== undefined && sketch.beskrivning.length > 0) {
    sentences.push(sketch.beskrivning);
  } else {
    const counts = count(sketch, players);
    sentences.push(`Yta ${decimal(frame.shown.langd)} gånger ${decimal(frame.shown.bredd)} meter.`);
    const playersText = playerSentence(counts);
    if (playersText !== null) {
      sentences.push(playersText);
    }
    if (counts.goals > 0) {
      sentences.push(`${counts.goals} mål.`);
    }
    const movementsText = movementSentence(counts);
    if (movementsText !== null) {
      sentences.push(movementsText);
    }
  }
  const notDrawn = notDrawnText(players.notDrawn);
  if (notDrawn !== null) {
    sentences.push(notDrawn);
  }
  const parallel = parallelAreasText(players.areas);
  if (parallel !== null) {
    sentences.push(parallel);
  }
  return sentences.join(' ');
}
