/**
 * Ytkontrollen (R-090 till R-094). Den görs för ett moment i taget, eftersom momenten
 * görs efter varandra och kan använda samma yta.
 *
 * Kontrollen är en areajämförelse, precis som R-092 är skriven, inte ett packningstest.
 * Se anmärkningen om R-092 i ADR 0011, grupp 10.
 */
import { AREA_MARGIN, AREA_SIZES } from '../keys.ts';
import type { AreaKey, GameFormat } from '../keys.ts';
import type { Exercise } from '../types.ts';

export interface Size {
  langd: number;
  bredd: number;
}

/**
 * Övningens yta per grupp för spelformen. Anger övningen olika ytor för olika spelformer
 * används ytan för den valda spelformen.
 *
 * @regel R-092
 */
export function exerciseArea(exercise: Exercise, format: GameFormat): Size | null {
  const yta = exercise.yta as Record<string, Size | undefined> | undefined;
  if (!yta) {
    return null;
  }
  return yta[format] ?? yta.alla ?? null;
}

function fitsInside(size: Size, area: Size): boolean {
  const { langd: a, bredd: b } = area;
  return (size.langd <= a && size.bredd <= b) || (size.langd <= b && size.bredd <= a);
}

/**
 * Får momentet plats på den valda ytan? `groupAreas` är en yta per grupp eller station
 * som är i gång samtidigt.
 *
 * @regel R-092
 * @regel R-093
 * @regel R-094
 */
export function momentFitsArea(
  groupAreas: readonly (Size | null)[],
  areaKey: AreaKey | undefined,
): boolean {
  if (areaKey === undefined) {
    // Ingen yta vald: inget ytfilter (R-090).
    return true;
  }
  const area = AREA_SIZES[areaKey];
  // R-093: en övning som saknar yta kan inte användas när en yta är vald.
  if (groupAreas.some((size) => size === null)) {
    return false;
  }
  const sizes = groupAreas as Size[];
  if (sizes.length === 1) {
    const only = sizes[0];
    return only !== undefined && fitsInside(only, area);
  }
  const withMargin = sizes.map((size) => ({
    langd: size.langd + AREA_MARGIN,
    bredd: size.bredd + AREA_MARGIN,
  }));
  if (!withMargin.every((size) => fitsInside(size, area))) {
    return false;
  }
  const used = withMargin.reduce((sum, size) => sum + size.langd * size.bredd, 0);
  return used <= area.langd * area.bredd;
}
