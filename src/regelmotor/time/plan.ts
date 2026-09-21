/**
 * Tidsplanen: avslutning, vattenpauser, aktiv tid och måltid per del (R-030 till R-033).
 *
 * Planen beror bara på passlängden och fasen och är alltså känd innan en enda övning har
 * valts (ADR 0011 avsnitt 1). Måltiderna räknas i heltalsaritmetik, aldrig via flyttal
 * (ADR 0011 avsnitt 2).
 */
import {
  BREAK_INTERVAL,
  BREAK_MINUTES,
  CLOSING_LONG_FROM_MINUTES,
  CLOSING_MINUTES,
  PART_MIN_MINUTES,
  PART_SHARES,
  PHASES_WITH_SHORT_CLOSING,
} from '../keys.ts';
import type { Phase, SessionPartFromBank } from '../keys.ts';

export interface PartTarget {
  part: SessionPartFromBank;
  target: number;
}

export interface TimePlan {
  phase: Phase;
  requestedMinutes: number;
  closingMinutes: number;
  breakCount: number;
  breakMinutes: number;
  activeMinutes: number;
  /** Delarna som finns kvar efter R-033, i passets ordning (R-030). */
  parts: PartTarget[];
  /** Delar som togs bort för att måltiden var under 5 minuter (R-033). */
  removedParts: SessionPartFromBank[];
}

/**
 * Avslutningens längd.
 *
 * @regel R-031
 */
export function closingMinutes(phase: Phase, sessionMinutes: number): number {
  if (PHASES_WITH_SHORT_CLOSING.includes(phase)) {
    return CLOSING_MINUTES.kort;
  }
  return sessionMinutes < CLOSING_LONG_FROM_MINUTES ? CLOSING_MINUTES.kort : CLOSING_MINUTES.lang;
}

/**
 * Antal vattenpauser: passlängden delad med pausintervallet, uppåt, minus 1.
 *
 * @regel R-031
 */
export function breakCount(phase: Phase, sessionMinutes: number): number {
  return Math.ceil(sessionMinutes / BREAK_INTERVAL[phase]) - 1;
}

/**
 * Hela tidsplanen.
 *
 * @regel R-030
 * @regel R-031
 * @regel R-032
 * @regel R-033
 */
export function planTime(phase: Phase, sessionMinutes: number): TimePlan {
  const closing = closingMinutes(phase, sessionMinutes);
  const breaks = breakCount(phase, sessionMinutes);
  const breakTotal = breaks * BREAK_MINUTES;
  const active = sessionMinutes - closing - breakTotal;

  const shares = PART_SHARES[phase];
  const raw = {
    'del-uppvarmning': Math.floor((active * shares['del-uppvarmning']) / 100),
    'del-ovning': Math.floor((active * shares['del-ovning']) / 100),
    'del-spelovning': Math.floor((active * shares['del-spelovning']) / 100),
  } as const;

  // R-033: Öva och Spelövning tas bort om måltiden är under 5 minuter, och minuterna
  // läggs på Spel, som får det som blir kvar av den aktiva tiden.
  const removedParts: SessionPartFromBank[] = [];
  const parts: PartTarget[] = [];
  parts.push({ part: 'del-uppvarmning', target: raw['del-uppvarmning'] });
  for (const part of ['del-ovning', 'del-spelovning'] as const) {
    if (raw[part] < PART_MIN_MINUTES) {
      removedParts.push(part);
    } else {
      parts.push({ part, target: raw[part] });
    }
  }
  const used = parts.reduce((sum, item) => sum + item.target, 0);
  parts.push({ part: 'del-spel', target: active - used });

  parts.sort((a, b) => partOrder(a.part) - partOrder(b.part));

  return {
    phase,
    requestedMinutes: sessionMinutes,
    closingMinutes: closing,
    breakCount: breaks,
    breakMinutes: breakTotal,
    activeMinutes: active,
    parts,
    removedParts,
  };
}

const ORDER: SessionPartFromBank[] = [
  'del-uppvarmning',
  'del-ovning',
  'del-spelovning',
  'del-spel',
];

/**
 * Delarnas ordning i passet.
 *
 * @regel R-030
 */
export function partOrder(part: SessionPartFromBank): number {
  return ORDER.indexOf(part);
}
