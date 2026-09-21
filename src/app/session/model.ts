/**
 * Vymodellen för ett genererat pass: motorns rader grupperade per del, i samma ordning
 * (ADR 0011 avsnitt 3). Modellen räknar inte om något och lägger inte till något; den
 * ordnar bara raderna så att vyn kan rita dem.
 */
import type { Exercise, Layout, PartResult, Session, SessionPart } from '../../regelmotor/index.ts';

export interface StationView {
  station: number;
  exercise: Exercise;
  layout: Layout | null;
}

export type TimelineItem =
  | {
      kind: 'exercise';
      key: string;
      minutes: number;
      exercise: Exercise;
      layout: Layout | null;
      /** Periodens nummer när en paus delar spelmomentet (R-037), annars `null`. */
      period: number | null;
    }
  | {
      kind: 'stations';
      key: string;
      minutes: number;
      stationMinutes: number | null;
      layout: Layout | null;
      stations: StationView[];
    }
  | { kind: 'break'; key: string; minutes: number }
  | { kind: 'closing'; key: string; minutes: number }
  | { kind: 'empty'; key: string; minutes: number };

export interface PartView {
  part: SessionPart;
  /** Delens nummer i passet, 1-baserat, som i skisser/02-genererat-pass.md. */
  number: number;
  /** Delens tid: motorns `PartResult.minutes`, eller avslutningens fasta tid. */
  minutes: number;
  items: TimelineItem[];
  /** Motorns svar för delen. `null` för avslutningen, som inte kommer ur banken. */
  result: PartResult | null;
}

export interface SessionView {
  parts: PartView[];
  totalMinutes: number;
  requestedMinutes: number;
  /** Sant när passet blev kortare än den begärda längden (R-036, R-039). */
  shorterThanRequested: boolean;
}

/**
 * Grupperar raderna per del. En paus hör till den del den står i, och visas mellan momenten
 * precis där motorn placerade den (R-031, R-037).
 *
 * @regel R-030
 * @regel R-100
 */
export function buildSessionView(session: Session): SessionView {
  const parts: PartView[] = [];
  let current: PartView | undefined;
  let periodNumber = 0;
  let previousBlock: number | null = null;

  const partResult = (part: SessionPart): PartResult | null =>
    session.parts.find((item) => item.part === part) ?? null;

  const open = (part: SessionPart, minutes: number): PartView => {
    const view: PartView = {
      part,
      number: parts.length + 1,
      minutes,
      items: [],
      result: partResult(part),
    };
    parts.push(view);
    return view;
  };

  for (const [index, row] of session.rows.entries()) {
    const key = `rad-${index}`;

    if (row.kind === 'break') {
      // Pausen ligger mellan två moment och hör till den del som just visats.
      const target = current ?? open('del-uppvarmning', 0);
      target.items.push({ kind: 'break', key, minutes: row.minutes });
      continue;
    }

    if (row.part === null) {
      continue;
    }

    if (current === undefined || current.part !== row.part) {
      const result = partResult(row.part);
      current = open(row.part, result?.minutes ?? row.minutes);
      periodNumber = 0;
      previousBlock = null;
    }

    switch (row.kind) {
      case 'exercise':
        if (row.exercise !== null) {
          current.items.push({
            kind: 'exercise',
            key,
            minutes: row.minutes,
            exercise: row.exercise,
            layout: row.layout,
            period: null,
          });
        }
        break;

      case 'period':
        if (row.exercise !== null) {
          periodNumber = row.block === previousBlock ? periodNumber + 1 : 1;
          previousBlock = row.block;
          current.items.push({
            kind: 'exercise',
            key,
            minutes: row.minutes,
            exercise: row.exercise,
            layout: row.layout,
            period: periodNumber,
          });
        }
        break;

      case 'stations':
        current.items.push({
          kind: 'stations',
          key,
          minutes: row.minutes,
          stationMinutes: row.stationMinutes,
          layout: row.layout,
          stations: [],
        });
        break;

      case 'station': {
        const last = current.items.at(-1);
        if (last?.kind === 'stations' && row.exercise !== null && row.station !== null) {
          last.stations.push({
            station: row.station,
            exercise: row.exercise,
            layout: row.layout,
          });
        }
        break;
      }

      case 'closing':
        current.items.push({ kind: 'closing', key, minutes: row.minutes });
        break;

      case 'empty':
        current.items.push({ kind: 'empty', key, minutes: row.minutes });
        break;
    }
  }

  return {
    parts,
    totalMinutes: session.totalMinutes,
    requestedMinutes: session.requestedMinutes,
    shorterThanRequested: session.totalMinutes < session.requestedMinutes,
  };
}
