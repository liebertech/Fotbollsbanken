import { describe, expect, it } from 'vitest';
import { blockSets, canFillPart, headingMinutes, totalsFor } from './fill.ts';
import { blockMinutesOptions, blocksForPart, candidatesForPart } from '../blocks/candidates.ts';
import { bankExercise } from '../__testdata__/bank-fixtur.ts';
import type { Exercise, Input } from '../types.ts';

const underlag: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 12,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};
const context = { input: underlag, phase: 'fas-10-12' as const };

const ovning = (id: string, tid: { kortast: number; rekommenderad: number; langst: number }) =>
  bankExercise({ id, tid, passdelar: ['del-ovning'], spelare: { min: 2, max: 12 } });

function blocks(bank: Exercise[]) {
  return blocksForPart(candidatesForPart(bank, 'del-ovning', context), 'del-ovning', context, underlag.fokus);
}

describe('R-034 Tid för en övning', () => {
  it('R-034 håller tiden inom övningens gränser och fasens tak för delen', () => {
    const lang = ovning('lang-ovning', { kortast: 12, rekommenderad: 18, langst: 25 });
    const options = blockMinutesOptions(blocks([lang])[0]!);
    // Fasens tak för Öva är 15 minuter i fas-10-12.
    expect(options[0]).toBe(12);
    expect(options.at(-1)).toBe(15);
  });

  it('R-034 ger ingen tid under 5 minuter', () => {
    const kort = ovning('kort-ovning', { kortast: 5, rekommenderad: 5, langst: 6 });
    expect(blockMinutesOptions(blocks([kort])[0]!)[0]).toBe(5);
  });
});

describe('R-035 Varje del nära sin måltid', () => {
  it('R-035 ger bara summor inom måltiden plus minus 3 minuter', () => {
    const exercise = ovning('passa-ovning', { kortast: 5, rekommenderad: 10, langst: 15 });
    const sets = blockSets(blocks([exercise]), 10, 'fas-10-12');
    expect(sets).toHaveLength(1);
    expect(sets[0]?.totals).toEqual([7, 8, 9, 10, 11, 12, 13]);
  });

  it('R-035 utesluter en övning som aldrig kan komma nära måltiden', () => {
    const exercise = ovning('kort-ovning', { kortast: 5, rekommenderad: 5, langst: 6 });
    expect(blockSets(blocks([exercise]), 15, 'fas-10-12')).toEqual([]);
  });
});

describe('R-038 Antal moment per del', () => {
  it('R-038 bygger uppsättningar med ett eller två moment', () => {
    const a = ovning('ovning-ett', { kortast: 5, rekommenderad: 6, langst: 8 });
    const b = ovning('ovning-tva', { kortast: 5, rekommenderad: 6, langst: 8 });
    const sets = blockSets(blocks([a, b]), 12, 'fas-10-12');
    expect(sets.every((set) => set.blocks.length <= 2)).toBe(true);
    expect(sets.some((set) => set.blocks.length === 2)).toBe(true);
  });
});

describe('R-070 Samma övning bara en gång i ett pass', () => {
  it('R-070 utesluter en övning som redan används i passet', () => {
    const exercise = ovning('passa-ovning', { kortast: 5, rekommenderad: 10, langst: 15 });
    expect(blockSets(blocks([exercise]), 10, 'fas-10-12', new Set(['passa-ovning']))).toEqual([]);
  });
});

describe('R-071 Varianter är samma övning', () => {
  it('R-071 har varianterna som fält på övningen, inte som egna övningar', () => {
    const exercise = ovning('passa-ovning', { kortast: 5, rekommenderad: 10, langst: 15 });
    expect(exercise.varianter).toEqual({
      lattare: expect.any(String),
      svarare: expect.any(String),
    });
    expect((exercise.varianter as unknown as { id?: string }).id).toBeUndefined();
  });
});

describe('R-082 Begränsad mängd nickning', () => {
  it('R-082 räknar stationstiden per station i ett stationsmoment', () => {
    const nick = bankExercise({
      id: 'nick-ovning',
      fokusomraden: ['nickspel', 'avslut'],
      alder: { min: 13, max: 14 },
      spelformer: ['9mot9'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 12 },
    });
    const annan = bankExercise({
      id: 'annan-ovning',
      fokusomraden: ['avslut'],
      alder: { min: 13, max: 14 },
      spelformer: ['9mot9'],
      passdelar: ['del-ovning'],
      spelare: { min: 2, max: 12 },
    });
    const aldre: Input = { ...underlag, alder: 13, spelform: '9mot9', fokus: ['avslut'] };
    const aldreContext = { input: aldre, phase: 'fas-13-14' as const };
    const list = blocksForPart(
      candidatesForPart([nick, annan], 'del-ovning', aldreContext),
      'del-ovning',
      aldreContext,
      aldre.fokus,
    );
    const stationer = list.find((block) => block.kind === 'stationer');
    expect(stationer).toBeDefined();
    if (stationer !== undefined) {
      // Momentets tid är 2 x t + 1. Bara nickstationens t räknas mot taket.
      expect(headingMinutes([stationer], [21])).toBe(10);
    }
  });
});

describe('R-067 Val mellan stationer och helgrupp', () => {
  it('R-067 bygger både helgruppsmoment och stationsmoment när båda är giltiga', () => {
    const a = ovning('ovning-ett', { kortast: 5, rekommenderad: 6, langst: 10 });
    const b = ovning('ovning-tva', { kortast: 5, rekommenderad: 6, langst: 10 });
    const list = blocks([a, b]);
    expect(list.some((block) => block.kind === 'helgrupp')).toBe(true);
    expect(list.some((block) => block.kind === 'stationer')).toBe(true);
  });
});

describe('R-100 En del som saknar övning', () => {
  it('R-100 svarar på om delen kan fyllas, prövat för delen för sig', () => {
    const exercise = ovning('passa-ovning', { kortast: 5, rekommenderad: 10, langst: 15 });
    const bank = candidatesForPart([exercise], 'del-ovning', context);
    expect(canFillPart(bank, 'del-ovning', 10, context, underlag.fokus)).toBe(true);
    expect(canFillPart(bank, 'del-ovning', 10, context, ['forsvarsspel'])).toBe(false);
  });
});

describe('R-065 Tid vid stationer', () => {
  it('R-065 ger momentets tid som S gånger t plus bytesminuterna', () => {
    const a = ovning('ovning-ett', { kortast: 5, rekommenderad: 6, langst: 10 });
    const b = ovning('ovning-tva', { kortast: 5, rekommenderad: 6, langst: 10 });
    const stationer = blocks([a, b]).find((block) => block.kind === 'stationer');
    expect(stationer && totalsFor([stationer]).has(11)).toBe(true);
    expect(stationer && totalsFor([stationer]).has(12)).toBe(false);
  });
});
