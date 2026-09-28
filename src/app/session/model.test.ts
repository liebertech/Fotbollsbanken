/**
 * Vymodellen för ett pass: motorns rader grupperade per del.
 */
import { describe, expect, it } from 'vitest';
import { areaReference, buildSessionView } from './model.ts';
import { contentExercise } from '../../regelmotor/__testdata__/bank-fixtur.ts';
import {
  BANK_NEEDING_SUBSTITUTE,
  BANK_WITHOUT_GAME_PRACTICE,
  BANK_WITH_STATION_REFERENCE,
  BANK_WITH_TWO_AREA_REFERENCES,
  FULL_BANK,
  INPUT,
  STATION_INPUT,
  STATION_SEED,
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

/*
 * Ytförklaringen (docs/design/texter.md avsnitt 4, uppföljning till ADR 0017): bara det
 * första kortet i passet, i visningsordning och med stationerna inräknade, vars yta har en
 * ytreferens för passets spelform.
 */
describe('ADR 0017 Det första kortet med ytreferens', () => {
  it('är null när inget kort i passet har en ytreferens', () => {
    expect(buildSessionView(sessionOf(FULL_BANK)).firstAreaReferenceKey).toBeNull();
  });

  it('pekar på det första kortet med referens, inte på de senare', () => {
    const view = buildSessionView(sessionOf(BANK_WITH_TWO_AREA_REFERENCES));
    const warmup = view.parts.find((part) => part.part === 'del-uppvarmning')?.items[0];
    expect(warmup?.kind).toBe('exercise');
    expect(view.firstAreaReferenceKey).toBe(warmup?.key);
  });

  it('räknar stationerna var för sig, i sin ordning', () => {
    const view = buildSessionView(
      sessionOf(BANK_WITH_STATION_REFERENCE, STATION_INPUT, STATION_SEED),
    );
    const stations = view.parts
      .flatMap((part) => part.items)
      .find((item) => item.kind === 'stations');
    expect(stations?.kind).toBe('stations');
    const withReference =
      stations?.kind === 'stations'
        ? stations.stations.find((station) => station.exercise.id === 'station-med-ytreferens')
        : undefined;
    expect(withReference).toBeDefined();
    expect(view.firstAreaReferenceKey).toBe(withReference?.key);
  });

  it('ger stationerna unika nycklar', () => {
    const view = buildSessionView(
      sessionOf(BANK_WITH_STATION_REFERENCE, STATION_INPUT, STATION_SEED),
    );
    // Valet mellan stationer och en enskild övning avgörs av slumpen (R-072). Ger fröet inte
    // längre stationer skulle testet prövas mot vanliga kort och gå igenom av fel skäl.
    const stations = view.parts
      .flatMap((part) => part.items)
      .find((item) => item.kind === 'stations');
    expect(stations?.kind === 'stations' && stations.stations.length).toBeGreaterThanOrEqual(2);
    const keys = view.parts.flatMap((part) =>
      part.items.flatMap((item) =>
        item.kind === 'stations' ? [item.key, ...item.stations.map((s) => s.key)] : [item.key],
      ),
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('ger samma nycklar varje gång samma pass visas', () => {
    const session = sessionOf(BANK_WITH_STATION_REFERENCE, STATION_INPUT, STATION_SEED);
    const keysOf = (): string[] =>
      buildSessionView(session)
        .parts.flatMap((part) => part.items)
        .flatMap((item) =>
          item.kind === 'stations' ? [item.key, ...item.stations.map((s) => s.key)] : [item.key],
        );
    expect(keysOf()).toEqual(keysOf());
  });
});

describe('ADR 0017 areaReference', () => {
  // Schemat kräver en yta för varje spelform övningen har (R-092), så fallet prövas med en
  // spelform som övningen inte finns för: referensen står aldrig utan ett mått.
  it('ger ingen referens för en spelform som övningen saknar yta för', () => {
    const exercise = contentExercise({
      spelformer: ['7mot7'],
      yta: { '7mot7': { langd: 18, bredd: 12 } },
      ytreferens: { alla: 'stora planens målområde' },
    });
    expect(areaReference(exercise, '7mot7')).toBe('stora planens målområde');
    expect(areaReference(exercise, '5mot5')).toBeNull();
  });
});
