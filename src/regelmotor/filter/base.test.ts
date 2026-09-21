import { describe, expect, it } from 'vitest';
import { baseFilter, baseRejection, fitsPart, hasMainHit, hitsFocus } from './base.ts';
import { bankExercise } from '../__testdata__/bank-fixtur.ts';
import type { Input } from '../types.ts';

const underlag: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 12,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

describe('R-022 Bara godkända övningar ur den gemensamma banken', () => {
  it('R-022 väljer bort en övning som inte är godkänd', () => {
    const granskad = bankExercise({ status: 'granskad' });
    expect(baseRejection(granskad, underlag, 'fas-10-12')).toBe('R-022');
  });

  it('R-022 släpper igenom en godkänd övning', () => {
    expect(baseRejection(bankExercise(), underlag, 'fas-10-12')).toBeNull();
  });
});

describe('R-023 Ålder', () => {
  it('R-023 väljer bort en övning vars åldersspann inte rymmer åldern', () => {
    const ung = bankExercise({ alder: { min: 6, max: 9 }, spelformer: ['5mot5'] });
    expect(baseRejection(ung, underlag, 'fas-10-12')).toBe('R-023');
  });
});

describe('R-024 Spelform', () => {
  it('R-024 väljer bort en övning utan underlagets spelform', () => {
    const femMotFem = bankExercise({ spelformer: ['5mot5'], alder: { min: 9, max: 11 } });
    expect(baseRejection(femMotFem, underlag, 'fas-10-12')).toBe('R-024');
  });
});

describe('R-025 Nivå', () => {
  it('R-025 väljer en övning bara när nivålistan innehåller nivån', () => {
    const ettOchTva = bankExercise({ niva: ['niva-1', 'niva-2'] });
    expect(baseRejection(ettOchTva, underlag, 'fas-10-12')).toBeNull();
    expect(baseRejection(ettOchTva, { ...underlag, niva: 'niva-3' }, 'fas-10-12')).toBe('R-025');
  });
});

describe('R-026 Inga angränsande nivåer', () => {
  it('R-026 tar aldrig en övning från en annan nivå, även när banken annars är tom', () => {
    const bara3 = bankExercise({ niva: ['niva-3'] });
    expect(baseFilter([bara3], underlag, 'fas-10-12')).toEqual([]);
  });
});

describe('R-027 Alla övningens fokusområden passar fasen', () => {
  it('R-027 väljer bort en övning med ett fokusområde som är "-" för fasen', () => {
    const uthallighet = bankExercise({
      fokusomraden: ['uthallighet'],
      alder: { min: 15, max: 19 },
      spelformer: ['11mot11'],
    });
    // Övningen passar underlaget i övrigt: det är bara fasen som säger nej.
    const aldre = { ...underlag, alder: 16, spelform: '11mot11' } as const;
    expect(baseRejection(uthallighet, aldre, 'fas-15-19')).toBeNull();
    expect(baseRejection(uthallighet, aldre, 'fas-10-12')).toBe('R-027');
  });
});

describe('R-028 Rätt del', () => {
  it('R-028 lägger bara en övning i en del den är märkt med', () => {
    const ovning = bankExercise({ passdelar: ['del-ovning'] });
    expect(fitsPart(ovning, 'del-ovning')).toBe(true);
    expect(fitsPart(ovning, 'del-uppvarmning')).toBe(false);
  });
});

describe('R-040 Träff och huvudträff', () => {
  it('R-040 skiljer träff från huvudträff', () => {
    const exercise = bankExercise({ fokusomraden: ['dribbling', 'passning-mottagning'] });
    expect(hitsFocus(exercise, ['passning-mottagning'])).toBe(true);
    expect(hasMainHit(exercise, ['passning-mottagning'])).toBe(false);
    expect(hasMainHit(exercise, ['dribbling'])).toBe(true);
  });
});

describe('R-072 Gränsen mellan fotbollsregler och algoritmval', () => {
  it('R-072 sorterar kandidatlistan oberoende av bankens ordning', () => {
    const a = bankExercise({ id: 'aaa' });
    const b = bankExercise({ id: 'bbb' });
    const c = bankExercise({ id: 'ccc' });
    expect(baseFilter([c, a, b], underlag, 'fas-10-12').map((item) => item.id)).toEqual([
      'aaa',
      'bbb',
      'ccc',
    ]);
  });
});
