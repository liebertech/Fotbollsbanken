import { describe, expect, it } from 'vitest';
import { candidateFocusList, decideSubstituteFocus } from './substitute.ts';
import { candidatesForPart } from '../blocks/candidates.ts';
import { FOCUS_AREAS, PHASES, focusNeighbours } from '../keys.ts';
import type { CorePart, FocusArea, Phase } from '../keys.ts';
import { planTime } from '../time/plan.ts';
import { bankExercise } from '../__testdata__/bank-fixtur.ts';
import type { Exercise, Input } from '../types.ts';

const underlag: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 12,
  ledare: 1,
  passlangd: 60,
  fokus: ['lek'],
};

function beslut(bank: Exercise[], input: Input, phase: Phase) {
  const plan = planTime(phase, input.passlangd);
  const parts = (['del-ovning', 'del-spelovning'] as CorePart[]).map((part) => ({
    part,
    target: plan.parts.find((item) => item.part === part)?.target ?? 0,
    bank: candidatesForPart(bank, part, { input, phase }),
  }));
  return decideSubstituteFocus({
    context: { input, phase },
    chosenFocus: input.fokus,
    parts,
  });
}

const ovning = (id: string, fokus: FocusArea[]) =>
  bankExercise({
    id,
    fokusomraden: fokus,
    passdelar: ['del-ovning'],
    tid: { kortast: 5, rekommenderad: 10, langst: 15 },
  });

const spelovning = (id: string, fokus: FocusArea[]) =>
  bankExercise({
    id,
    fokusomraden: fokus,
    passdelar: ['del-spelovning'],
    grupptyp: 'tva-lag',
    spelare: { min: 4, max: 12 },
    tid: { kortast: 8, rekommenderad: 12, langst: 15 },
  });

describe('R-121 Närliggande fokusområde när kärnan annars blir tom', () => {
  it('R-121 steg 1: inget ersättningsfokus när valt fokus räcker', () => {
    const bank = [ovning('lek-ovning', ['lek']), spelovning('lek-spelovning', ['lek'])];
    expect(beslut(bank, underlag, 'fas-10-12')).toEqual([
      { part: 'del-ovning', substituteFocus: null, cannotFill: false },
      { part: 'del-spelovning', substituteFocus: null, cannotFill: false },
    ]);
  });

  it('R-121 steg 2 och 3: kandidatlistan byggs i tabellens ordning och rensas', () => {
    // Avvikelsen för lek i del-ovning gäller från fas-10-12.
    expect(
      candidateFocusList(['lek'], 'del-ovning', { input: underlag, phase: 'fas-10-12' }),
    ).toEqual(['dribbling', 'koordination', 'bollkansla']);
    expect(
      candidateFocusList(['lek'], 'del-ovning', {
        input: { ...underlag, alder: 9, spelform: '5mot5' },
        phase: 'fas-8-9',
      }),
    ).toEqual(['bollkansla', 'dribbling', 'koordination']);
  });

  it('R-121 steg 3: ledarens egna val tas bort ur listan', () => {
    const list = candidateFocusList(['lek', 'dribbling'], 'del-ovning', {
      input: { ...underlag, fokus: ['lek', 'dribbling'] },
      phase: 'fas-10-12',
    });
    expect(list).not.toContain('dribbling');
    expect(list).not.toContain('lek');
  });

  it('R-121 steg 3: fokusområden som är "-" för fasen tas bort', () => {
    const list = candidateFocusList(['passning-mottagning'], 'del-spelovning', {
      input: { ...underlag, alder: 7, spelform: '3mot3', fokus: ['passning-mottagning'] },
      phase: 'fas-6-7',
    });
    // speluppbyggnad är "-" för fas-6-7 och kan därför inte bli ersättningsfokus.
    expect(list).not.toContain('speluppbyggnad');
    expect(list).toContain('spelbarhet');
  });

  it('R-121 nickspel och malvaktsspel är aldrig ersättningsfokus', () => {
    for (const phase of PHASES) {
      for (const focus of FOCUS_AREAS) {
        for (const part of ['del-ovning', 'del-spelovning'] as CorePart[]) {
          const list = candidateFocusList([focus], part, { input: underlag, phase });
          expect(list).not.toContain('nickspel');
          expect(list).not.toContain('malvaktsspel');
        }
      }
    }
  });

  it('R-121 testfallet i regeln: lek i fas-10-12 ger dribbling i båda delarna', () => {
    const bank = [
      ovning('dribbling-ovning', ['dribbling']),
      spelovning('dribbling-spelovning', ['dribbling']),
      ovning('koordination-ovning', ['koordination']),
    ];
    expect(beslut(bank, underlag, 'fas-10-12')).toEqual([
      { part: 'del-ovning', substituteFocus: 'dribbling', cannotFill: false },
      { part: 'del-spelovning', substituteFocus: 'dribbling', cannotFill: false },
    ]);
  });

  it('R-121 steg 5: samma ersättning i båda delarna när ett fokus fungerar i båda', () => {
    // Testfallet i regeln: 9 år, koordination, bollkansla fungerar bara i Öva.
    const input: Input = {
      ...underlag,
      alder: 9,
      spelform: '5mot5',
      fokus: ['koordination'],
    };
    const anpassa = (exercise: Exercise): Exercise =>
      bankExercise({
        ...exercise,
        alder: { min: 8, max: 9 },
        spelformer: ['5mot5'],
        yta: { alla: { langd: 20, bredd: 20 } },
      });
    const bank = [
      anpassa(ovning('bollkansla-ovning', ['bollkansla'])),
      anpassa(ovning('snabbhet-ovning', ['snabbhet'])),
      anpassa(spelovning('snabbhet-spelovning', ['snabbhet'])),
    ];
    expect(beslut(bank, input, 'fas-8-9')).toEqual([
      { part: 'del-ovning', substituteFocus: 'snabbhet', cannotFill: false },
      { part: 'del-spelovning', substituteFocus: 'snabbhet', cannotFill: false },
    ]);
  });

  it('R-121 steg 4: varje del för sig när inget fokus fungerar i båda', () => {
    const bank = [
      ovning('dribbling-ovning', ['dribbling']),
      spelovning('spelbarhet-spelovning', ['spelbarhet']),
    ];
    expect(beslut(bank, underlag, 'fas-10-12')).toEqual([
      { part: 'del-ovning', substituteFocus: 'dribbling', cannotFill: false },
      { part: 'del-spelovning', substituteFocus: 'spelbarhet', cannotFill: false },
    ]);
  });

  it('R-121 låter delen stå tom när inget närliggande fokusområde heller fungerar', () => {
    const bank = [ovning('avslut-ovning', ['avslut'])];
    expect(beslut(bank, underlag, 'fas-10-12')).toEqual([
      { part: 'del-ovning', substituteFocus: null, cannotFill: true },
      { part: 'del-spelovning', substituteFocus: null, cannotFill: true },
    ]);
  });

  it('R-121 har en egen lista per del', () => {
    expect(focusNeighbours('bollkansla', 'del-ovning', 'fas-8-9')).toEqual([
      'dribbling',
      'passning-mottagning',
      'koordination',
    ]);
    expect(focusNeighbours('bollkansla', 'del-spelovning', 'fas-8-9')).toEqual([
      'ett-mot-ett',
      'dribbling',
    ]);
  });

  it('R-121 använder fasens avvikelse för koordination i del-ovning', () => {
    expect(focusNeighbours('koordination', 'del-ovning', 'fas-10-12')).toEqual([
      'bollkansla',
      'snabbhet',
    ]);
    expect(focusNeighbours('koordination', 'del-ovning', 'fas-13-14')).toEqual([
      'snabbhet',
      'skadeforebyggande',
      'bollkansla',
    ]);
  });
});
