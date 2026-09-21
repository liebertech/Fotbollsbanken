/**
 * Formulärets tillstånd (berättelse 01). Reglerna ligger i motorn; det här testet prövar
 * att formuläret frågar den och inte hittar på egna svar.
 */
import { describe, expect, it } from 'vitest';
import { validateInput } from '../../regelmotor/index.ts';
import {
  EMPTY_FORM,
  errorsByField,
  formFocusAreas,
  formGameFormats,
  formPhase,
  isCoreFocus,
  toInput,
  withAge,
  withFocusToggled,
  withGameFormat,
} from './form.ts';

const form = (alder: string) => withAge(EMPTY_FORM, alder);

describe('R-013 Spelformen föreslås ur åldern', () => {
  it('R-013 väljer den spelform som gäller för åldern', () => {
    expect(form('11').spelform).toBe('7mot7');
    expect(form('8').spelform).toBe('5mot5');
    expect(form('16').spelform).toBe('11mot11');
  });

  it('R-011 lämnar spelformen tom för en ålder utanför 6-19', () => {
    expect(form('4').spelform).toBe('');
    expect(form('').spelform).toBe('');
    expect(formPhase(form('4'))).toBeUndefined();
  });
});

describe('R-014 Bara den föreslagna spelformen och dess grannar', () => {
  it('R-014 erbjuder tre spelformer för en ålder mitt i ordningen', () => {
    expect(formGameFormats(form('11'))).toEqual(['5mot5', '7mot7', '9mot9']);
  });

  it('R-014 behåller ledarens egna val när åldern ändras inom det tillåtna', () => {
    const chosen = withGameFormat(form('11'), '9mot9');
    expect(withAge(chosen, '12').spelform).toBe('9mot9');
  });

  it('R-014 byter till den föreslagna när ledarens val inte längre är tillåtet', () => {
    const chosen = withGameFormat(form('11'), '5mot5');
    const older = withAge(chosen, '16');
    expect(older.spelform).toBe('11mot11');
    expect(formGameFormats(older)).not.toContain('5mot5');
  });
});

describe('R-019 Fokusområden som passar åldern', () => {
  it('R-019 visar bara fokusområden som är K eller R för fasen', () => {
    const areas = formFocusAreas(form('7'));
    expect(areas).toContain('lek');
    expect(areas).not.toContain('speluppbyggnad');
  });

  it('R-080 visar inte nickspel före 13 år, men från 13 år', () => {
    expect(formFocusAreas(form('12'))).not.toContain('nickspel');
    expect(formFocusAreas(form('13'))).toContain('nickspel');
  });

  it('R-002 märker kärnområden för fasen', () => {
    expect(isCoreFocus('dribbling', 'fas-10-12')).toBe(true);
    expect(isCoreFocus('snabbhet', 'fas-10-12')).toBe(false);
  });

  it('R-019 kryssar i högst tre fokusområden och behåller ledarens ordning', () => {
    let value = form('11');
    for (const focus of ['dribbling', 'avslut', 'spelbarhet', 'forsvarsspel'] as const) {
      value = withFocusToggled(value, focus);
    }
    expect(value.fokus).toEqual(['dribbling', 'avslut', 'spelbarhet']);
    expect(withFocusToggled(value, 'avslut').fokus).toEqual(['dribbling', 'spelbarhet']);
  });

  it('R-019 tar bort ett valt fokusområde som inte finns för den nya åldern', () => {
    const young = withFocusToggled(form('7'), 'lek');
    expect(withAge(young, '11').fokus).toEqual(['lek']);
    const heading = withFocusToggled(form('14'), 'nickspel');
    expect(withAge(heading, '11').fokus).toEqual([]);
  });
});

describe('R-020 Underlaget som formuläret skickar till motorn', () => {
  const filled = () => {
    let value = withAge(EMPTY_FORM, '11');
    value = { ...value, spelare: '14' };
    return withFocusToggled(value, 'passning-mottagning');
  };

  it('R-020 blir ett giltigt underlag när allt är ifyllt', () => {
    const result = validateInput(toInput(filled()));
    expect(result.ok).toBe(true);
  });

  it('R-090 lämnar yta utanför underlaget när ledaren inte valt någon', () => {
    expect(toInput(filled()).yta).toBeUndefined();
    expect(toInput({ ...filled(), yta: 'yta-halv' }).yta).toBe('yta-halv');
  });

  it('R-017 lämnar tomma och ogiltiga tal som undefined, så att motorn fäller dem', () => {
    const empty = toInput({ ...filled(), spelare: '' });
    expect(empty.spelare).toBeUndefined();
    const result = validateInput(empty);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.field)).toContain('spelare');
    }
  });

  it('R-020 visar ett fel per fält, med motorns egen text', () => {
    const result = validateInput(toInput({ ...filled(), spelare: '0', ledare: '0' }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const byField = errorsByField(result.errors);
      expect(byField.get('spelare')?.message).toBe('Antal spelare måste vara mellan 1 och 40.');
      expect(byField.get('ledare')?.message).toBe('Antal ledare måste vara mellan 1 och 10.');
    }
  });
});
