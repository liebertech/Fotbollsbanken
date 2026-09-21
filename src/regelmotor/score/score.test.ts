import { describe, expect, it } from 'vitest';
import { compareScores, redThread, scoreSession } from './score.ts';
import { planTime } from '../time/plan.ts';
import { bankExercise, gameExercise } from '../__testdata__/bank-fixtur.ts';
import type { FocusArea, SessionPartFromBank } from '../keys.ts';
import type { Block, Draft, Exercise, Input, PartFill } from '../types.ts';

const input: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 12,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};
const plan = planTime('fas-10-12', 60);
const context = { input, phase: 'fas-10-12' as const, plan };

function block(exercise: Exercise): Block {
  return {
    kind: 'helgrupp',
    exercise,
    layout: {
      groups: 1,
      sizes: [12],
      coachesPerGroup: 0,
      coachesNeeded: 0,
      oddSolution: null,
      oddText: null,
    },
    minMinutes: exercise.tid.kortast,
    maxMinutes: exercise.tid.langst,
    recommendedMinutes: exercise.tid.rekommenderad,
  };
}

function draft(
  parts: Partial<Record<SessionPartFromBank, Exercise[]>>,
  options: {
    effective?: Partial<Record<SessionPartFromBank, FocusArea[]>>;
    longestStretch?: number;
  } = {},
): Draft {
  const fills: PartFill[] = [];
  const effectiveFocus = new Map<SessionPartFromBank, FocusArea[]>();
  for (const { part, target } of plan.parts) {
    effectiveFocus.set(part, options.effective?.[part] ?? [...input.fokus]);
    const exercises = parts[part];
    if (exercises === undefined) {
      continue;
    }
    fills.push({
      part,
      blocks: exercises.map(block),
      minutes: exercises.map(() => target),
      total: target,
    });
  }
  return {
    fills,
    emptyParts: plan.parts.map((item) => item.part).filter((part) => parts[part] === undefined),
    effectiveFocus,
    substituteFocus: new Map(),
    totalMinutes: 60,
    longestStretch: options.longestStretch ?? 20,
    breaksBeforeMoment: [],
    breaksAfterLast: 0,
    gamePeriods: null,
  };
}

const huvudtraff = bankExercise({
  id: 'huvudtraff',
  fokusomraden: ['passning-mottagning', 'spelbarhet'],
});
const sidotraff = bankExercise({
  id: 'sidotraff',
  fokusomraden: ['dribbling', 'passning-mottagning'],
});
const annat = bankExercise({ id: 'annat-fokus', fokusomraden: ['dribbling'] });
const uppvarmning = bankExercise({
  id: 'uppvarmning-kropp',
  fokusomraden: ['koordination'],
  passdelar: ['del-uppvarmning'],
});
const spel = gameExercise({ id: 'spelet', fokusomraden: ['passning-mottagning'] });

describe('R-042 Huvudträff i kärnan', () => {
  it('R-042 är uppfylld när alla övningar i delen har huvudträff', () => {
    const med = scoreSession(draft({ 'del-ovning': [huvudtraff] }), context);
    const utan = scoreSession(draft({ 'del-ovning': [sidotraff] }), context);
    expect(med[2]).toBe(1);
    expect(utan[2]).toBe(0);
  });

  it('R-042 prövas mot delens ersättningsfokus när delen har ett', () => {
    const value = scoreSession(
      draft({ 'del-ovning': [annat] }, { effective: { 'del-ovning': ['dribbling'] } }),
      context,
    );
    expect(value[2]).toBe(1);
  });

  it('R-042 räknas som inte uppfylld för en tom del', () => {
    expect(scoreSession(draft({}), context)[2]).toBe(0);
  });
});

describe('R-043 Röd tråd', () => {
  it('R-043 är uppfylld när Öva och Spelövning delar ett fokusområde', () => {
    const value = draft({ 'del-ovning': [huvudtraff], 'del-spelovning': [sidotraff] });
    expect(redThread(value, plan)).toBe(true);
  });

  it('R-043 är inte uppfylld när delarna saknar gemensamt fokusområde', () => {
    const value = draft(
      { 'del-ovning': [annat], 'del-spelovning': [huvudtraff] },
      { effective: { 'del-ovning': ['dribbling'] } },
    );
    expect(redThread(value, plan)).toBe(false);
  });
});

describe('R-044 Uppvärmningen förbereder kroppen', () => {
  it('R-044 är uppfylld när uppvärmningen har ett fokus ur fasens lista', () => {
    expect(scoreSession(draft({ 'del-uppvarmning': [uppvarmning] }), context)[6]).toBe(1);
    expect(scoreSession(draft({ 'del-uppvarmning': [huvudtraff] }), context)[6]).toBe(0);
  });
});

describe('R-045 Uppvärmningen träffar valt fokus', () => {
  it('R-045 är post 8 i poänglistan', () => {
    expect(scoreSession(draft({ 'del-uppvarmning': [huvudtraff] }), context)[7]).toBe(1);
    expect(scoreSession(draft({ 'del-uppvarmning': [uppvarmning] }), context)[7]).toBe(0);
  });
});

describe('R-046 Spelet träffar valt fokus', () => {
  it('R-046 är post 9 i poänglistan', () => {
    expect(scoreSession(draft({ 'del-spel': [spel] }), context)[8]).toBe(1);
  });
});

describe('R-047 Alla valda fokus finns med', () => {
  it('R-047 prövas mot ledarens val, aldrig mot ett ersättningsfokus', () => {
    const tva = {
      ...context,
      input: { ...input, fokus: ['passning-mottagning', 'dribbling'] as FocusArea[] },
    };
    expect(scoreSession(draft({ 'del-ovning': [huvudtraff] }), tva)[5]).toBe(0);
    expect(scoreSession(draft({ 'del-ovning': [huvudtraff, annat] }), tva)[5]).toBe(1);
  });
});

describe('R-048 Hur två pass jämförs', () => {
  it('R-048 låter post 3 avgöra före post 5 och 10, som testfallet i regeln', () => {
    // Pass A: huvudträff i Öva men ingen röd tråd. Pass B: röd tråd och färre moment.
    const a = [4, 15, 1, 1, 0, 1, 1, 1, 1, -5, -20];
    const b = [4, 15, 0, 1, 1, 1, 1, 1, 1, -4, -18];
    expect(compareScores(a, b)).toBeGreaterThan(0);
  });

  it('R-048 post 1 är inte redundant mot post 2', () => {
    // Ett pass med bara Öva (mönstret 1000) mot ett med de tre andra delarna (0111).
    const baraOva = [1, 0b1000, 1, 0, 0, 1, 0, 0, 0, -1, -10];
    const treDelar = [3, 0b0111, 0, 1, 0, 1, 1, 1, 1, -3, -20];
    expect(compareScores(treDelar, baraOva)).toBeGreaterThan(0);
  });

  it('R-048 post 10 föredrar färre moment och post 11 kortare sträcka utan paus', () => {
    const faerre = scoreSession(draft({ 'del-ovning': [huvudtraff] }), context);
    const fler = scoreSession(draft({ 'del-ovning': [huvudtraff, sidotraff] }), context);
    expect(compareScores(faerre, fler)).toBeGreaterThan(0);

    const kort = scoreSession(
      draft({ 'del-ovning': [huvudtraff] }, { longestStretch: 18 }),
      context,
    );
    const lang = scoreSession(
      draft({ 'del-ovning': [huvudtraff] }, { longestStretch: 25 }),
      context,
    );
    expect(compareScores(kort, lang)).toBeGreaterThan(0);
  });

  it('R-048 ger fler fyllda delar företräde framför allt annat', () => {
    const helt = scoreSession(
      draft({
        'del-uppvarmning': [uppvarmning],
        'del-ovning': [huvudtraff],
        'del-spelovning': [sidotraff],
        'del-spel': [spel],
      }),
      context,
    );
    const halvt = scoreSession(draft({ 'del-ovning': [huvudtraff] }), context);
    expect(compareScores(helt, halvt)).toBeGreaterThan(0);
    expect(helt[0]).toBe(4);
    expect(halvt[0]).toBe(1);
  });
});
