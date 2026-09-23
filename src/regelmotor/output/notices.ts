/**
 * Påminnelser och tips (R-021, R-084, R-085).
 *
 * De lagras aldrig, utan räknas fram ur passet varje gång det visas (ADR 0011 avsnitt 3).
 * Det fungerar utan nät just därför att ögonblicksbilderna bär `material`, och det gör att
 * en rättad regel slår igenom på gamla pass utan migrering.
 *
 * Texterna ligger i gränssnittet (docs/design/texter.md, avsnitt 4).
 */
import { MATERIAL_TYPES_WITH_GOAL, coachCap } from '../keys.ts';
import type { Phase } from '../keys.ts';
import type { Exercise, Input, Notice, Row } from '../types.ts';

/**
 * Har övningen mål i sitt material? Både `mal` och `minimal` räknas, eftersom ett minimål
 * välter minst lika lätt som ett stort mål.
 *
 * @regel R-084
 */
export function hasGoal(exercise: Exercise): boolean {
  const material = exercise.material;
  if (material === undefined) {
    // En egen övning utan material ger alltid påminnelsen (R-106).
    return true;
  }
  return material.some((item) => MATERIAL_TYPES_WITH_GOAL.includes(item.typ));
}

/**
 * Är det fler spelare per ledare än vad som brukar rekommenderas för fasen?
 *
 * @regel R-021
 */
export function needsMoreAdults(input: Input, phase: Phase): boolean {
  return input.spelare > input.ledare * coachCap(phase);
}

/**
 * Påminnelserna för ett pass.
 *
 * @regel R-021
 * @regel R-084
 * @regel R-085
 */
export function buildNotices(rows: readonly Row[], input: Input, phase: Phase): Notice[] {
  const notices: Notice[] = [];
  if (needsMoreAdults(input, phase)) {
    notices.push({ kind: 'fler-vuxna', regel: 'R-021' });
  }
  const exercises = rows
    .map((row) => row.exercise)
    .filter((exercise): exercise is Exercise => exercise !== null);
  if (exercises.some((exercise) => hasGoal(exercise))) {
    notices.push({ kind: 'forankrade-mal', regel: 'R-084' });
  }
  // R-085: påminnelsen om benskydd visas alltid.
  notices.push({ kind: 'benskydd', regel: 'R-085' });
  return notices;
}
