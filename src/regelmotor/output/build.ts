/**
 * Tidslinjen som rader (ADR 0011 avsnitt 3). `src/data/` kan skriva listan rakt av till
 * `session_items` med `position` = index, och gränssnittet visar den i samma ordning.
 *
 * Ögonblicksbilden är hela övningen, oförändrad. Motorn plockar aldrig ut ett urval av
 * fält, eftersom passet ska gå att visa och skriva ut utan banken, och R-029 (varianterna),
 * R-054 (anpassningen) och R-084 (materialet) läser fält som ett urval lätt hade tappat.
 */
import { BREAK_MINUTES, CLOSING_PART } from '../keys.ts';
import type { SessionPartFromBank } from '../keys.ts';
import type { TimePlan } from '../time/plan.ts';
import type { Draft, Row } from '../types.ts';

/**
 * Bygger raderna.
 *
 * @regel R-029
 * @regel R-030
 * @regel R-031
 * @regel R-037
 * @regel R-054
 * @regel R-100
 */
export function buildRows(draft: Draft, plan: TimePlan): Row[] {
  const rows: Row[] = [];
  let blockNumber = 0;
  let momentIndex = 0;

  const breakRow = (): Row => ({
    kind: 'break',
    part: null,
    block: null,
    station: null,
    stationMinutes: null,
    minutes: BREAK_MINUTES,
    exercise: null,
    layout: null,
  });

  for (const { part, target } of plan.parts) {
    const fill = draft.fills.find((item) => item.part === part);
    if (fill === undefined) {
      // R-100: delen visas på sin plats, med sitt namn och sin måltid.
      rows.push({
        kind: 'empty',
        part,
        block: null,
        station: null,
        stationMinutes: null,
        minutes: target,
        exercise: null,
        layout: null,
      });
      continue;
    }

    for (const [index, block] of fill.blocks.entries()) {
      const minutes = fill.minutes[index] ?? 0;
      for (let i = 0; i < (draft.breaksBeforeMoment[momentIndex] ?? 0); i += 1) {
        rows.push(breakRow());
      }
      blockNumber += 1;

      if (block.kind === 'stationer') {
        const count = block.exercises.length;
        const stationMinutes = (minutes - (count - 1)) / count;
        rows.push({
          kind: 'stations',
          part,
          block: blockNumber,
          station: null,
          stationMinutes,
          minutes,
          exercise: null,
          layout: block.layout,
        });
        for (const [stationIndex, exercise] of block.exercises.entries()) {
          rows.push({
            kind: 'station',
            part,
            block: blockNumber,
            station: stationIndex + 1,
            stationMinutes,
            minutes: 0,
            exercise,
            layout: block.stationLayouts[stationIndex] ?? block.layout,
          });
        }
      } else if (
        draft.gamePeriods !== null &&
        draft.gamePeriods.momentIndex === momentIndex &&
        draft.gamePeriods.minutes.length > 1
      ) {
        // R-037: en paus i Spel ligger mellan två perioder av samma spel.
        for (const [periodIndex, periodMinutes] of draft.gamePeriods.minutes.entries()) {
          if (periodIndex > 0) {
            rows.push(breakRow());
          }
          rows.push({
            kind: 'period',
            part,
            block: blockNumber,
            station: null,
            stationMinutes: null,
            minutes: periodMinutes,
            exercise: block.exercise,
            layout: block.layout,
          });
        }
      } else {
        rows.push({
          kind: 'exercise',
          part,
          block: blockNumber,
          station: null,
          stationMinutes: null,
          minutes,
          exercise: block.exercise,
          layout: block.layout,
        });
      }
      momentIndex += 1;
    }
  }

  for (let i = 0; i < draft.breaksAfterLast; i += 1) {
    rows.push(breakRow());
  }

  rows.push({
    kind: 'closing',
    part: CLOSING_PART,
    block: null,
    station: null,
    stationMinutes: null,
    minutes: plan.closingMinutes,
    exercise: null,
    layout: null,
  });

  return rows;
}

/**
 * Passets faktiska totaltid: summan av radernas minuter utom stationsraderna, som äger
 * ingen tid, och utom en tom del, vars måltid inte händer på planen (R-039).
 *
 * @regel R-036
 * @regel R-039
 */
export function totalMinutesOfRows(rows: readonly Row[]): number {
  return rows
    .filter((row) => row.kind !== 'station' && row.kind !== 'empty')
    .reduce((sum, row) => sum + row.minutes, 0);
}

/** Delar som saknar övning i raderna. */
export function emptyPartsOfRows(rows: readonly Row[]): SessionPartFromBank[] {
  return rows
    .filter((row) => row.kind === 'empty')
    .map((row) => row.part)
    .filter((part): part is SessionPartFromBank => part !== null && part !== CLOSING_PART);
}
