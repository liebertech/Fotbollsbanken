import { describe, expect, it } from 'vitest';
import { selectableFocusAreas, validateInput } from './validate.ts';
import { allowedGameFormats, phaseForAge, suggestedGameFormat } from '../keys.ts';
import type { Input } from '../types.ts';

const giltigt: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 14,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

function fel(input: Record<string, unknown>): string[] {
  const result = validateInput({ ...giltigt, ...input });
  return result.ok ? [] : result.errors.map((error) => `${error.field}:${error.regel}`);
}

describe('R-011 Giltig ålder', () => {
  it('R-011 godtar 6 till 19 år', () => {
    for (const alder of [6, 10, 19]) {
      expect(validateInput({ ...giltigt, alder, spelform: suggestedGameFormat(alder) }).ok).toBe(
        true,
      );
    }
  });

  it('R-011 ger ett fel för en ålder utanför spannet', () => {
    expect(fel({ alder: 5 })).toContain('alder:R-011');
    expect(fel({ alder: 20 })).toContain('alder:R-011');
    expect(fel({ alder: 11.5 })).toContain('alder:R-011');
  });
});

describe('R-012 Fas från ålder', () => {
  it('R-012 ger fasen ur åldern', () => {
    expect(phaseForAge(7)).toBe('fas-6-7');
    expect(phaseForAge(9)).toBe('fas-8-9');
    expect(phaseForAge(12)).toBe('fas-10-12');
    expect(phaseForAge(13)).toBe('fas-13-14');
    expect(phaseForAge(19)).toBe('fas-15-19');
  });
});

describe('R-013 Föreslagen spelform', () => {
  it('R-013 föreslår spelformen för åldern', () => {
    expect(suggestedGameFormat(6)).toBe('3mot3');
    expect(suggestedGameFormat(9)).toBe('5mot5');
    expect(suggestedGameFormat(11)).toBe('7mot7');
    expect(suggestedGameFormat(14)).toBe('9mot9');
    expect(suggestedGameFormat(17)).toBe('11mot11');
  });
});

describe('R-014 Tillåtna spelformer', () => {
  it('R-014 ger de två exemplen i regeln', () => {
    expect(allowedGameFormats(12)).toEqual(['5mot5', '7mot7', '9mot9']);
    expect(allowedGameFormats(6)).toEqual(['3mot3', '5mot5']);
  });

  it('R-014 stänger ute en spelform som ligger längre bort', () => {
    expect(fel({ alder: 8, spelform: '11mot11' })).toContain('spelform:R-014');
  });
});

describe('R-015 Fasen styrs av åldern, inte av spelformen', () => {
  it('R-015 behåller fasen när ledaren väljer grannspelformen', () => {
    const result = validateInput({ ...giltigt, alder: 12, spelform: '9mot9' });
    expect(result.ok && result.phase).toBe('fas-10-12');
  });
});

describe('R-016 Nivå', () => {
  it('R-016 kräver exakt en av de tre nivåerna', () => {
    expect(fel({ niva: 'niva-4' })).toContain('niva:R-016');
  });
});

describe('R-017 Antal spelare och ledare', () => {
  it('R-017 kräver 1 till 40 spelare', () => {
    expect(fel({ spelare: 0 })).toContain('spelare:R-017');
    expect(fel({ spelare: 41 })).toContain('spelare:R-017');
    expect(fel({ spelare: -3 })).toContain('spelare:R-017');
  });

  it('R-017 kräver 1 till 10 ledare', () => {
    expect(fel({ ledare: 0 })).toContain('ledare:R-017');
    expect(fel({ ledare: 11 })).toContain('ledare:R-017');
  });
});

describe('R-018 Passlängd', () => {
  it('R-018 kräver minst 30 minuter', () => {
    expect(fel({ passlangd: 29 })).toContain('passlangd:R-018');
  });

  it('R-018 har ett eget tak per fas', () => {
    expect(fel({ alder: 7, spelform: '3mot3', passlangd: 61 })).toContain('passlangd:R-018');
    expect(fel({ alder: 7, spelform: '3mot3', passlangd: 60 })).toEqual([]);
    expect(fel({ alder: 16, spelform: '11mot11', passlangd: 120 })).toEqual([]);
    expect(fel({ alder: 16, spelform: '11mot11', passlangd: 121 })).toContain('passlangd:R-018');
  });

  it('R-018 säger vilken längsta passlängd som gäller för åldern', () => {
    const result = validateInput({ ...giltigt, passlangd: 120 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0]?.message).toContain('90');
    }
  });
});

describe('R-019 Val av fokusområden', () => {
  it('R-019 kräver minst ett och högst tre fokusområden', () => {
    expect(fel({ fokus: [] })).toContain('fokus:R-019');
    expect(fel({ fokus: ['passning-mottagning', 'dribbling', 'avslut', 'spelbarhet'] })).toContain(
      'fokus:R-019',
    );
  });

  it('R-019 visar bara fokusområden som är K eller R för fasen', () => {
    expect(selectableFocusAreas('fas-6-7', 7)).not.toContain('uthallighet');
    expect(selectableFocusAreas('fas-10-12', 11)).toContain('dribbling');
    expect(fel({ fokus: ['uthallighet'] })).toContain('fokus:R-019');
  });
});

describe('R-020 Komplett underlag', () => {
  it('R-020 godtar ett underlag utan yta', () => {
    expect(validateInput(giltigt).ok).toBe(true);
  });

  it('R-020 samlar alla fel när flera fält saknas', () => {
    const result = validateInput({ alder: 11 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.field)).toEqual(
        expect.arrayContaining(['spelform', 'niva', 'spelare', 'ledare', 'passlangd', 'fokus']),
      );
    }
  });
});

describe('R-080 Ingen nickträning före 13 år', () => {
  it('R-080 gör nickspel omöjligt att välja före 13 år', () => {
    expect(selectableFocusAreas('fas-10-12', 12)).not.toContain('nickspel');
    expect(selectableFocusAreas('fas-13-14', 13)).toContain('nickspel');
  });
});

describe('R-083 Nickspel väljs tillsammans med ett annat fokus', () => {
  it('R-083 underkänner nickspel som enda fokus', () => {
    expect(fel({ alder: 13, spelform: '9mot9', fokus: ['nickspel'] })).toContain('fokus:R-083');
  });

  it('R-083 godtar nickspel tillsammans med ett annat fokusområde', () => {
    expect(fel({ alder: 13, spelform: '9mot9', fokus: ['nickspel', 'avslut'] })).toEqual([]);
  });
});

describe('R-090 Ledaren kan ange yta', () => {
  it('R-090 godtar de tre ytorna och inget val alls', () => {
    expect(fel({ yta: 'yta-kvart' })).toEqual([]);
    expect(fel({ yta: undefined })).toEqual([]);
    expect(fel({ yta: 'yta-inomhus' })).toContain('yta:R-090');
  });
});
