/**
 * Byter en övning i passet och räknar om det som bytet påverkar (R-104, R-105).
 *
 * Bytet rör bara momentet där X låg. Pauserna ligger kvar där de låg. Ett spel som en paus
 * delar i perioder (R-037) delas på samma sätt som generatorn gör, i så jämna perioder som
 * möjligt. Passet efter bytet går genom samma slutkontroll som ett genererat pass
 * (ADR 0011 avsnitt 1, steg 5), med den skillnad R-105 gör: R-035 och R-036 prövas inte.
 */
import { checkSession } from '../check/session.ts';
import { buildNotices } from '../output/notices.ts';
import { totalMinutesOfRows } from '../output/build.ts';
import { splitEvenly } from '../time/breaks.ts';
import type { BankExercise } from '../origin.ts';
import type { ItemRef, PartResult, Row, Session } from '../types.ts';
import { locateSwapTarget, trySwap } from './options.ts';

/**
 * Längsta sammanhängande aktiva tid utan paus, räknad ur raderna på samma sätt som
 * pausplaceringen räknar den: momenten och perioderna, inte avslutningen och inte en tom del.
 */
function longestStretchOfRows(rows: readonly Row[]): number {
  let longest = 0;
  let current = 0;
  for (const row of rows) {
    if (row.kind === 'break') {
      current = 0;
      continue;
    }
    if (row.kind === 'exercise' || row.kind === 'period' || row.kind === 'stations') {
      current += row.minutes;
      longest = Math.max(longest, current);
    }
  }
  return longest;
}

/**
 * Ersätter övningen på platsen `ref` med `chosen`. `chosen` ska vara ett av alternativen
 * från `swapOptions`; annars, eller om passet efter bytet inte klarar slutkontrollen, kastas
 * ett fel och passet lämnas oförändrat.
 *
 * @regel R-104
 * @regel R-105
 */
export function applySwap(session: Session, ref: ItemRef, chosen: BankExercise): Session {
  const target = locateSwapTarget(session, ref);
  const result = trySwap(session, target, chosen);
  if (!result.ok) {
    throw new Error(
      `R-104: ${chosen.id} kan inte ersätta ${target.exercise.id} ` +
        `(villkor ${result.rejection.villkor}, ${result.rejection.regel})`,
    );
  }
  const { placement } = result;

  const rows: Row[] = session.rows.map((row) => ({ ...row }));
  if (placement.kind === 'helgrupp') {
    // R-105: Y får den tid som ligger närmast X:s. Perioderna delas som generatorn delar dem.
    const periods = splitEvenly(placement.minutes, target.rowIndexes.length);
    for (const [position, index] of target.rowIndexes.entries()) {
      const row = rows[index];
      if (row !== undefined) {
        rows[index] = {
          ...row,
          exercise: chosen,
          layout: placement.layout,
          minutes: periods[position] ?? 0,
        };
      }
    }
  } else {
    for (const index of target.rowIndexes) {
      const row = rows[index];
      if (row !== undefined) {
        rows[index] = { ...row, exercise: chosen, layout: placement.layout };
      }
    }
    // R-064: stationernas ledarbehov kan ha ändrats med den nya övningen.
    const blockRow = target.stationsRowIndex === null ? undefined : rows[target.stationsRowIndex];
    if (blockRow !== undefined && target.stationsRowIndex !== null) {
      rows[target.stationsRowIndex] = { ...blockRow, layout: placement.blockLayout };
    }
  }

  const partMinutes = rows
    .filter((row) => row.part === target.part && row.kind !== 'station' && row.kind !== 'empty')
    .reduce((sum, row) => sum + row.minutes, 0);
  const parts: PartResult[] = session.parts.map((item) =>
    item.part === target.part ? { ...item, minutes: partMinutes } : item,
  );

  const swapped: Session = {
    ...session,
    rows,
    parts,
    // Berättelse 04, kriterium 5: passet visar den nya totaltiden.
    totalMinutes: totalMinutesOfRows(rows),
    notices: buildNotices(rows, session.input, session.phase),
    longestStretch: longestStretchOfRows(rows),
    swapped: true,
  };

  // Steg 5 i kedjan gäller också efter ett byte (ADR 0011 avsnitt 1).
  const problems = checkSession(swapped);
  if (problems.length > 0) {
    throw new Error(`Passet klarade inte kontrollen efter bytet: ${problems.join('; ')}`);
  }
  return swapped;
}
