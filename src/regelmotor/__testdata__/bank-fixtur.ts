/**
 * Fixturer för motorns tester: godkända bankövningar med bestämda egenskaper.
 *
 * De ligger här och aldrig i content/ovningar/, eftersom bankens övningar är innehåll som
 * importeras till produktionen (ADR 0011 avsnitt 7). Varje fixtur går genom övningsschemat,
 * så att ett test aldrig kan bygga en övning som schemat skulle underkänna.
 */
import { exerciseSchema } from '../schema/ovning.ts';
import type { Exercise } from '../schema/ovning.ts';

type Overrides = Record<string, unknown>;

/** En godkänd bankövning. Skicka in det som är intressant för just testet. */
export function bankExercise(overrides: Overrides = {}): Exercise {
  const base: Overrides = {
    schema: 1,
    id: 'testovning',
    namn: 'Testövning',
    syfte: 'Spelarna ska öva på det som testet handlar om.',
    beskrivning:
      'En enkel övning som finns för att testa regelmotorn. Spelarna arbetar i en yta och byter uppgift efter halva tiden.',
    organisation: 'En yta per grupp och en boll per spelare.',
    fokusomraden: ['passning-mottagning'],
    alder: { min: 10, max: 12 },
    spelformer: ['7mot7'],
    niva: ['niva-1', 'niva-2', 'niva-3'],
    passdelar: ['del-ovning'],
    ledarbehov: 0,
    spelare: { min: 2, max: 12 },
    grupptyp: 'fri',
    tid: { kortast: 5, rekommenderad: 10, langst: 15 },
    yta: { alla: { langd: 20, bredd: 20 } },
    material: [{ typ: 'boll', antal: 1 }],
    coachningspunkter: ['Håll bollen nära foten.', 'Titta upp mellan touchningarna.'],
    varianter: { lattare: 'Gå i stället för att springa.', svarare: 'Lägg till en motståndare.' },
    anpassning: {
      fler_spelare: 'Fler ytor bredvid varandra.',
      udda_antal: 'En spelare går in som joker.',
      ledare: 'Ledaren peppar från sidan.',
    },
    status: 'godkand',
    granskning: [
      {
        datum: '2026-09-21',
        av: 'fotbollsexpert',
        roll: 'fotbollsexpert',
        kommentar: 'Fixtur för testerna.',
      },
    ],
  };
  const merged = { ...base, ...overrides };
  if (merged.ledarbehov !== 0 && merged.ledaruppgift === undefined) {
    merged.ledaruppgift = 'Ledaren servar bollar och styr tempot.';
  }
  return exerciseSchema.parse(merged);
}

/** En övning för `del-spel`. Grupptypen är alltid `tva-lag` (R-008). */
export function gameExercise(overrides: Overrides = {}): Exercise {
  return bankExercise({
    id: 'testspel',
    namn: 'Testspel',
    passdelar: ['del-spel'],
    grupptyp: 'tva-lag',
    spelare: { min: 6, max: 14 },
    tid: { kortast: 10, rekommenderad: 18, langst: 30 },
    ...overrides,
  });
}
