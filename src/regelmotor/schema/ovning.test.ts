/**
 * Tester för övningsschemat (ADR 0010 avsnitt 5).
 *
 * Varje test som prövar en generatorregel eller ett säkerhetsfynd bär regel-ID:t eller
 * fyndets ID i sitt namn, så att spårbarheten går att söka fram (ADR 0001).
 *
 * Ett fält som bryter mot sin egen typ stoppas av Zod redan i objektet, och då körs inte
 * korsreglerna i superRefine. Testerna håller därför alla övriga fält giltiga, så att det
 * verkligen är regeln som fäller övningen och inte en felaktig typ i ett annat fält.
 */
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  CLOSING_PART,
  FOCUS_AREA_HEADING,
  HEADING_MIN_AGE,
  SESSION_PARTS_FROM_BANK,
} from '../keys.ts';
import { LIMITS, createExerciseSchemas, exerciseFileSchema, looksLikeEmail } from './ovning.ts';
import { reviewEntry, validExercise } from '../__testdata__/ovning-fixtur.ts';

/** Felen som schemat ger, en rad per fel som `fält: meddelande`. */
function issuesFor(input: Record<string, unknown>): string[] {
  const result = exerciseFileSchema.safeParse(input);
  return result.success
    ? []
    : result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
}

/** Sant när minst ett fel gäller just det fältet och nämner regeln. */
function failsWith(input: Record<string, unknown>, field: string, rule: string): boolean {
  return issuesFor(input).some((line) => line.startsWith(`${field}: `) && line.includes(rule));
}

function isValid(input: Record<string, unknown>): boolean {
  return exerciseFileSchema.safeParse(input).success;
}

describe('övningsschemat', () => {
  it('godkänner exempelövningen i content/ovningar/README.md', () => {
    expect(issuesFor(validExercise())).toEqual([]);
  });
});

describe('R-001 nivå är en lista', () => {
  it('R-001: en lista med niva-1 och niva-3 måste också innehålla niva-2', () => {
    expect(failsWith(validExercise({ niva: ['niva-1', 'niva-3'] }), 'niva', 'R-001')).toBe(true);
  });

  it('R-001: niva-1, niva-2 och niva-3 tillsammans är en tillåten kombination', () => {
    expect(isValid(validExercise({ niva: ['niva-1', 'niva-2', 'niva-3'] }))).toBe(true);
  });

  it('R-001: niva-1 och niva-2 utan niva-3 är en tillåten kombination', () => {
    expect(isValid(validExercise({ niva: ['niva-1', 'niva-2'] }))).toBe(true);
  });

  it('R-001: nivålistan får inte innehålla dubletter', () => {
    expect(failsWith(validExercise({ niva: ['niva-2', 'niva-2'] }), 'niva', 'R-001')).toBe(true);
  });

  it('R-001: en tom nivålista underkänns', () => {
    expect(isValid(validExercise({ niva: [] }))).toBe(false);
  });

  it('R-001: en nivå utanför listan underkänns', () => {
    expect(isValid(validExercise({ niva: ['niva-4'] }))).toBe(false);
  });
});

describe('R-002 fokusområden', () => {
  it('R-002: fasta-situationer är "–" för fas-8-9 och kan inte användas för åldern 8-12', () => {
    const input = validExercise({
      alder: { min: 8, max: 12 },
      fokusomraden: ['fasta-situationer'],
    });
    expect(failsWith(input, 'fokusomraden.0', 'R-002')).toBe(true);
  });

  it('R-002: ett fokusområde som är K för båda faserna godkänns för åldern 8-12', () => {
    const input = validExercise({
      alder: { min: 8, max: 12 },
      fokusomraden: ['passning-mottagning'],
    });
    expect(issuesFor(input)).toEqual([]);
  });

  it('R-002: fokusområdena får inte innehålla dubletter', () => {
    const input = validExercise({ fokusomraden: ['spelbarhet', 'spelbarhet'] });
    expect(failsWith(input, 'fokusomraden', 'R-002')).toBe(true);
  });

  it('R-002: fler än tre fokusområden underkänns', () => {
    const input = validExercise({
      fokusomraden: ['dribbling', 'avslut', 'spelbarhet', 'koordination'],
    });
    expect(isValid(input)).toBe(false);
  });
});

describe('R-005 passdelar', () => {
  it('R-005: del-avslutning finns inte bland passdelarna som fylls från banken', () => {
    expect(SESSION_PARTS_FROM_BANK).not.toContain(CLOSING_PART);
  });

  it('R-005: del-avslutning får aldrig märkas på en övning', () => {
    const input = validExercise({ passdelar: ['del-uppvarmning', CLOSING_PART] });
    expect(failsWith(input, 'passdelar.1', 'R-005')).toBe(true);
  });

  it('R-005: passdelarna får inte innehålla dubletter', () => {
    const input = validExercise({ passdelar: ['del-ovning', 'del-ovning'] });
    expect(failsWith(input, 'passdelar', 'R-005')).toBe(true);
  });

  it('R-005: en tom lista med passdelar underkänns', () => {
    expect(isValid(validExercise({ passdelar: [] }))).toBe(false);
  });
});

/** En övning med fri gruppindelning, där `udda_antal_losning` inte får förekomma (R-008). */
function freeGroup(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const exercise = validExercise({ grupptyp: 'fri', ...overrides });
  if (!('udda_antal_losning' in overrides)) {
    delete exercise.udda_antal_losning;
  }
  return exercise;
}

describe('R-003 ålder', () => {
  it('R-003: alder.min får inte vara större än alder.max', () => {
    expect(failsWith(validExercise({ alder: { min: 14, max: 10 } }), 'alder', 'R-003')).toBe(true);
  });

  it('R-003: en ålder under 6 underkänns', () => {
    expect(isValid(validExercise({ alder: { min: 5, max: 10 } }))).toBe(false);
  });

  it('R-003: en ålder över 19 underkänns', () => {
    expect(isValid(validExercise({ alder: { min: 15, max: 20 } }))).toBe(false);
  });

  it('R-003: alder.min lika med alder.max är tillåtet', () => {
    expect(isValid(validExercise({ alder: { min: 12, max: 12 } }))).toBe(true);
  });
});

describe('R-004 spelformer', () => {
  it('R-004: 11mot11 är inte tillåten för någon ålder i 10-12', () => {
    const input = validExercise({
      spelformer: ['11mot11'],
      yta: { alla: { langd: 15, bredd: 15 } },
    });
    expect(failsWith(input, 'spelformer.0', 'R-004')).toBe(true);
  });

  it('R-004: den föreslagna spelformen och dess grannar godkänns för åldern 10-12', () => {
    const input = validExercise({
      spelformer: ['5mot5', '7mot7', '9mot9'],
      yta: { alla: { langd: 15, bredd: 15 } },
    });
    expect(issuesFor(input)).toEqual([]);
  });

  it('R-004: spelformerna får inte innehålla dubletter', () => {
    const input = validExercise({ spelformer: ['7mot7', '7mot7'] });
    expect(failsWith(input, 'spelformer', 'R-004')).toBe(true);
  });
});

describe('R-006 ledarbehov per grupp', () => {
  it('R-006: ledarbehov 1 kräver att ledaruppgift beskriver vad ledaren gör', () => {
    expect(failsWith(validExercise({ ledarbehov: 1 }), 'ledaruppgift', 'R-006')).toBe(true);
  });

  it('R-006: ledarbehov 1 med ledaruppgift godkänns', () => {
    const input = validExercise({ ledarbehov: 1, ledaruppgift: 'Matar bollar och räknar poäng.' });
    expect(issuesFor(input)).toEqual([]);
  });

  it('R-006: ledarbehov 0 behöver ingen ledaruppgift', () => {
    expect(isValid(validExercise({ ledarbehov: 0 }))).toBe(true);
  });

  it('R-006: ett ledarbehov utanför 0, 1 och 2 underkänns', () => {
    expect(isValid(validExercise({ ledarbehov: 3 }))).toBe(false);
  });
});

describe('R-007 antal spelare', () => {
  it('R-007: spelare.min får inte vara större än spelare.max', () => {
    const input = freeGroup({ spelare: { min: 8, max: 4 } });
    expect(failsWith(input, 'spelare', 'R-007')).toBe(true);
  });

  it('R-007: färre än en spelare per grupp underkänns', () => {
    expect(isValid(freeGroup({ spelare: { min: 0, max: 4 } }))).toBe(false);
  });

  it('R-007: fler än 40 spelare per grupp underkänns', () => {
    expect(isValid(freeGroup({ spelare: { min: 4, max: 41 } }))).toBe(false);
  });

  it('R-007: 1 till 40 spelare per grupp godkänns', () => {
    expect(issuesFor(freeGroup({ spelare: { min: 1, max: 40 } }))).toEqual([]);
  });
});

describe('R-008 grupptyp', () => {
  it('R-008: udda_antal_losning får bara anges när grupptypen är fast-storlek', () => {
    const input = freeGroup({ udda_antal_losning: true });
    expect(failsWith(input, 'udda_antal_losning', 'R-008')).toBe(true);
  });

  it('R-008: fast-storlek kräver att udda_antal_losning är ifylld', () => {
    const input = validExercise({ grupptyp: 'fast-storlek' });
    delete input.udda_antal_losning;
    expect(failsWith(input, 'udda_antal_losning', 'R-008')).toBe(true);
  });

  it('R-008: fast-storlek kräver att spelare.min och spelare.max är lika', () => {
    const input = validExercise({ grupptyp: 'fast-storlek', spelare: { min: 4, max: 6 } });
    expect(failsWith(input, 'spelare', 'R-008')).toBe(true);
  });

  it('R-008: par kräver minst 2 spelare', () => {
    const input = freeGroup({ grupptyp: 'par', spelare: { min: 1, max: 4 } });
    expect(failsWith(input, 'spelare.min', 'R-008')).toBe(true);
  });

  it('R-008: en övning med del-spel ska ha grupptypen tva-lag', () => {
    const input = validExercise({ passdelar: ['del-spel'] });
    expect(failsWith(input, 'grupptyp', 'R-008')).toBe(true);
  });

  it('R-008: del-spel med grupptypen tva-lag godkänns', () => {
    const input = freeGroup({
      grupptyp: 'tva-lag',
      passdelar: ['del-spel'],
      spelare: { min: 6, max: 10 },
    });
    expect(issuesFor(input)).toEqual([]);
  });
});

describe('R-009 tid', () => {
  it('R-009: kortast får inte vara längre än rekommenderad', () => {
    const input = validExercise({ tid: { kortast: 15, rekommenderad: 10, langst: 20 } });
    expect(failsWith(input, 'tid', 'R-009')).toBe(true);
  });

  it('R-009: rekommenderad får inte vara längre än langst', () => {
    const input = validExercise({ tid: { kortast: 8, rekommenderad: 20, langst: 15 } });
    expect(failsWith(input, 'tid', 'R-009')).toBe(true);
  });

  it('R-009: en tid under 5 minuter underkänns', () => {
    expect(isValid(validExercise({ tid: { kortast: 4, rekommenderad: 10, langst: 15 } }))).toBe(
      false,
    );
  });

  it('R-009: lika kortast, rekommenderad och langst godkänns', () => {
    const input = validExercise({ tid: { kortast: 10, rekommenderad: 10, langst: 10 } });
    expect(issuesFor(input)).toEqual([]);
  });
});

describe('R-081 nickövningar märks för rätt ålder', () => {
  it('R-081: nickspel kräver alder.min minst 13', () => {
    const input = validExercise({
      fokusomraden: [FOCUS_AREA_HEADING],
      alder: { min: HEADING_MIN_AGE - 1, max: 14 },
      spelformer: ['9mot9'],
      yta: { alla: { langd: 30, bredd: 20 } },
    });
    expect(failsWith(input, 'alder.min', 'R-081')).toBe(true);
  });

  it('R-081: nickspel från 13 år godkänns', () => {
    const input = validExercise({
      fokusomraden: [FOCUS_AREA_HEADING],
      alder: { min: HEADING_MIN_AGE, max: 14 },
      spelformer: ['9mot9'],
      yta: { alla: { langd: 30, bredd: 20 } },
    });
    expect(issuesFor(input)).toEqual([]);
  });
});

describe('R-120 materialtyper är en sluten lista', () => {
  it('R-120: materialtypen ovrigt kräver en anteckning', () => {
    const input = validExercise({ material: [{ typ: 'ovrigt', antal: 2 }] });
    expect(failsWith(input, 'material.0.anteckning', 'R-120')).toBe(true);
  });

  it('R-120: ovrigt med en anteckning godkänns', () => {
    const input = validExercise({
      material: [{ typ: 'ovrigt', antal: 2, anteckning: 'två tunnor att dribbla runt' }],
    });
    expect(issuesFor(input)).toEqual([]);
  });

  it('R-120: en materialtyp utanför den slutna listan underkänns', () => {
    expect(isValid(validExercise({ material: [{ typ: 'trampolin', antal: 1 }] }))).toBe(false);
  });
});

describe('R-092 ytan per spelform', () => {
  it('R-092: en ytnyckel som inte finns bland spelformerna underkänns', () => {
    const input = validExercise({ yta: { '5mot5': { langd: 20, bredd: 15 } } });
    expect(failsWith(input, 'yta.5mot5', 'R-092')).toBe(true);
  });

  it('R-092: en spelform får inte täckas både av alla och av sin egen nyckel', () => {
    const input = validExercise({
      yta: { alla: { langd: 20, bredd: 15 }, '7mot7': { langd: 15, bredd: 15 } },
    });
    expect(failsWith(input, 'yta.7mot7', 'R-092')).toBe(true);
  });
});

describe('S-07 och S-08 planskiss', () => {
  it('S-07: en övning med planskiss underkänns så länge ADR 0012:s schema saknas', () => {
    const input = validExercise({ planskiss: { former: [] } });
    expect(failsWith(input, 'planskiss', 'S-07')).toBe(true);
  });

  it('S-08: skissdata över databasens gräns underkänns', () => {
    // Platshållaren underkänner varje skiss, och Zod hoppar då över korsreglerna. Storleks-
    // kontrollen prövas därför med ett tillåtande skissschema, som ADR 0012 senare ersätter.
    const schemas = createExerciseSchemas({ planskiss: z.unknown() });
    const stor = { former: Array.from({ length: 500 }, (_, index) => ({ typ: 'kon', x: index })) };
    expect(new TextEncoder().encode(JSON.stringify(stor)).length).toBeGreaterThan(
      LIMITS.planskissBytes,
    );

    const result = schemas.exerciseFileSchema.safeParse(validExercise({ planskiss: stor }));
    const messages = result.success
      ? []
      : result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    expect(messages.some((line) => line.startsWith('planskiss: ') && line.includes('S-08'))).toBe(
      true,
    );
  });

  it('S-08: en liten skiss ryms inom gränsen', () => {
    const schemas = createExerciseSchemas({ planskiss: z.unknown() });
    const liten = { former: [{ typ: 'kon', x: 1, y: 1 }] };
    expect(schemas.exerciseFileSchema.safeParse(validExercise({ planskiss: liten })).success).toBe(
      true,
    );
  });
});

describe('S-21 inga e-postadresser i fält som blir publika', () => {
  it('S-21: granskning.av får inte innehålla en e-postadress', () => {
    const input = validExercise({
      status: 'granskad',
      granskning: [reviewEntry({ av: 'expert@example.com' })],
    });
    expect(failsWith(input, 'granskning.0.av', 'S-21')).toBe(true);
  });

  it('S-21: kalla får inte innehålla en e-postadress', () => {
    const input = validExercise({ kalla: 'Fråga tranaren pa tranare@example.com' });
    expect(failsWith(input, 'kalla', 'S-21')).toBe(true);
  });

  it('S-21: en omskriven e-postadress känns igen', () => {
    expect(looksLikeEmail('bjorn (at) exempel (dot) se')).toBe(true);
    expect(looksLikeEmail('bjorn snabel-a exempel.se')).toBe(true);
  });

  /*
   * Tidsgränsen är kontrollen: med obegränsade kvantifierare i mönstret tog en text på
   * 100 000 tecken över en minut, och det är precis så långt ett `beskrivning`-fält kan
   * vara i en fil. Testet faller på timeouten om sökningen börjar skena igen.
   */
  it('S-32: en mycket lång text kontrolleras utan att sökningen skenar', { timeout: 2_000 }, () => {
    expect(looksLikeEmail('abc.'.repeat(25_000))).toBe(false);
    expect(looksLikeEmail('aaaa at '.repeat(12_500))).toBe(false);
    expect(looksLikeEmail(`${'a'.repeat(50_000)} at exempel.se`)).toBe(true);
  });

  it.each([
    ['namn', { namn: 'Passa till bjorn@example.com' }],
    ['syfte', { syfte: 'Spelarna ska passa. Fragor: tranare@example.com tar emot dem.' }],
    [
      'beskrivning',
      {
        beskrivning:
          'Fyra spelare star i varsitt horn av en kvadrat och passar runt. Hor av dig till tranare@example.com om du undrar nagot om upplagget.',
      },
    ],
    ['organisation', { organisation: 'En boll per grupp. Kontakt: tranare@example.com' }],
    ['ledaruppgift', { ledaruppgift: 'Ledaren mailar tranare@example.com efter passet.' }],
    [
      'coachningspunkter.0',
      { coachningspunkter: ['Fraga tranare@example.com.', 'Titta upp mellan touchningarna.'] },
    ],
    [
      'varianter.lattare',
      { varianter: { lattare: 'Fraga tranare@example.com.', svarare: 'Tva bollar i gang.' } },
    ],
    [
      'anpassning.udda_antal',
      {
        anpassning: {
          fler_spelare: 'Fler kvadrater bredvid varandra.',
          udda_antal: 'Fraga tranare@example.com.',
          ledare: 'En ledare per grupp.',
        },
      },
    ],
    [
      'material.0.anteckning',
      { material: [{ typ: 'boll', antal: 1, anteckning: 'lanas av tranare@example.com' }] },
    ],
    [
      'granskning.0.kommentar',
      { granskning: [reviewEntry({ kommentar: 'Fraga tranare@example.com.' })] },
    ],
  ])('S-32: %s får inte innehålla en e-postadress', (field, overrides) => {
    expect(failsWith(validExercise(overrides), field, 'S-21')).toBe(true);
  });

  it('S-21: roll och förnamn är tillåtet', () => {
    expect(looksLikeEmail('fotbollsexpert Björn')).toBe(false);
    expect(issuesFor(validExercise({ granskning: [reviewEntry()] }))).toEqual([]);
  });
});

describe('statusarna i en fil i content/ovningar/', () => {
  it('en utkastfil får sakna bankfälten', () => {
    expect(isValid({ schema: 1, id: 'ny-ovning', status: 'utkast' })).toBe(true);
  });

  it('status granskad kräver bankfälten', () => {
    const messages = issuesFor({ schema: 1, id: 'ny-ovning', status: 'granskad' });
    expect(messages.some((line) => line.includes('krävs för status granskad'))).toBe(true);
  });

  it('status godkand kräver bankfälten och minst en granskningsrad', () => {
    const messages = issuesFor(validExercise({ status: 'godkand', granskning: [] }));
    expect(messages.some((line) => line.includes('minst en granskningsrad'))).toBe(true);
  });

  it('status atgarda kräver en kommentar som säger vad som ska ändras', () => {
    const input = validExercise({
      status: 'atgarda',
      granskning: [reviewEntry({ kommentar: '' })],
    });
    expect(failsWith(input, 'granskning.0.kommentar', 'atgarda')).toBe(true);
  });

  it('en status utanför listan underkänns', () => {
    expect(isValid(validExercise({ status: 'publicerad' }))).toBe(false);
  });
});
