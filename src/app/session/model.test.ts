/**
 * Vymodellen för ett pass: motorns rader grupperade per del.
 */
import { describe, expect, it } from 'vitest';
import { buildSessionView } from './model.ts';
import {
  BANK_NEEDING_SUBSTITUTE,
  BANK_WITHOUT_GAME_PRACTICE,
  FULL_BANK,
  INPUT,
  sessionOf,
} from '../__testdata__/session-fixture.ts';

describe('R-030 Delarna i ordning', () => {
  it('R-030 grupperar raderna per del, i passets ordning', () => {
    const view = buildSessionView(sessionOf(FULL_BANK));
    expect(view.parts.map((part) => part.part)).toEqual([
      'del-uppvarmning',
      'del-ovning',
      'del-spelovning',
      'del-spel',
      'del-avslutning',
    ]);
    expect(view.parts.map((part) => part.number)).toEqual([1, 2, 3, 4, 5]);
  });

  it('R-031 lägger avslutningen sist, som ett eget inslag utan övning', () => {
    const view = buildSessionView(sessionOf(FULL_BANK));
    const closing = view.parts.at(-1);
    expect(closing?.part).toBe('del-avslutning');
    expect(closing?.items.map((item) => item.kind)).toEqual(['closing']);
    expect(closing?.result).toBeNull();
  });

  it('R-036 bär passets faktiska tid och den begärda', () => {
    const session = sessionOf(FULL_BANK);
    const view = buildSessionView(session);
    expect(view.totalMinutes).toBe(session.totalMinutes);
    expect(view.requestedMinutes).toBe(INPUT.passlangd);
    expect(view.totalMinutes).toBeLessThanOrEqual(INPUT.passlangd);
  });
});

describe('R-100 En del som saknar övning', () => {
  it('R-100 visar delen med sitt namn och sin måltid, inte som en lucka', () => {
    const view = buildSessionView(sessionOf(BANK_WITHOUT_GAME_PRACTICE));
    const part = view.parts.find((item) => item.part === 'del-spelovning');
    expect(part).toBeDefined();
    expect(part?.result?.status).toBe('saknar-ovning');
    const empty = part?.items.find((item) => item.kind === 'empty');
    expect(empty?.minutes).toBe(part?.result?.target);
  });
});

describe('R-121 Ersättningsfokus i kärnan', () => {
  it('R-121 bär motorns ersättningsfokus och det fokus som saknade övningar', () => {
    const session = sessionOf(BANK_NEEDING_SUBSTITUTE, { ...INPUT, fokus: ['lek'] });
    const view = buildSessionView(session);
    const part = view.parts.find((item) => item.part === 'del-ovning');
    expect(part?.result?.substituteFocus).toBe('dribbling');
    expect(part?.result?.missingFocus).toEqual(['lek']);
    // R-102: ledarens val står kvar oförändrade.
    expect(session.input.fokus).toEqual(['lek']);
  });
});

describe('R-031 Pauser i tidslinjen', () => {
  it('R-031 behåller pauserna på sin plats i delen', () => {
    const view = buildSessionView(sessionOf(FULL_BANK));
    const breaks = view.parts.flatMap((part) => part.items.filter((item) => item.kind === 'break'));
    expect(breaks.length).toBeGreaterThan(0);
    expect(breaks.every((item) => item.minutes === 2)).toBe(true);
  });
});
