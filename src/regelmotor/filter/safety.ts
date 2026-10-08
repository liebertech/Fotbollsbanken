/**
 * Säkerhetsreglerna (R-080 till R-086). De gäller alltid, även när det gör att färre
 * övningar matchar.
 */
import { FOCUS_AREA_HEADING, HEADING_MINUTES_CAP, HEADING_MIN_AGE } from '../keys.ts';
import type { Phase } from '../keys.ts';
import type { Exercise, Input } from '../types.ts';

/**
 * Har övningen nickning bland sina fokusområden?
 *
 * @regel R-081
 */
export function hasHeading(exercise: Exercise): boolean {
  return exercise.fokusomraden.includes(FOCUS_AREA_HEADING);
}

/**
 * Får övningen väljas med hänsyn till åldern och ledarens fokus? Under 13 år väljs ingen
 * övning med `nickspel`, och ingen sådan kan bytas in (R-080). En övning med `nickspel` väljs
 * och visas som alternativ vid byte bara när ledaren själv har valt `nickspel` (R-086).
 *
 * @regel R-080
 * @regel R-086
 */
export function safetyRejection(
  exercise: Exercise,
  input: Pick<Input, 'alder' | 'fokus'>,
): string | null {
  if (!hasHeading(exercise)) {
    return null;
  }
  if (input.alder < HEADING_MIN_AGE) {
    return 'R-080';
  }
  if (!input.fokus.includes(FOCUS_AREA_HEADING)) {
    return 'R-086';
  }
  return null;
}

/**
 * Nicktaket för fasen. Övningens hela tid räknas, även om bara en del av den är nickning.
 * I ett stationsmoment räknas stationstiden per station.
 *
 * @regel R-082
 */
export function headingMinutesWithinCap(
  entries: readonly { exercise: Exercise; minutes: number }[],
  phase: Phase,
): boolean {
  const used = entries
    .filter((entry) => hasHeading(entry.exercise))
    .reduce((sum, entry) => sum + entry.minutes, 0);
  return used <= HEADING_MINUTES_CAP[phase];
}
