/**
 * Fixturer för testerna. Ligger här och aldrig i content/ovningar/, eftersom bankens
 * övningar är innehåll som importeras till produktionen (ADR 0011 avsnitt 7).
 *
 * Basövningen är exempelövningen i content/ovningar/README.md, så att ett test som går
 * sönder också visar att schemat och den dokumenterade formen har glidit isär.
 */

/** En giltig övning. Skicka in det som är intressant för just testet. */
export function validExercise(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schema: 1,
    id: 'passa-och-folj',
    namn: 'Passa och följ',
    syfte: 'Spelarna ska passa med rätt kraft och röra sig efter passningen.',
    beskrivning:
      'Fyra spelare står i varsitt hörn av en kvadrat. Spelaren med boll passar till nästa hörn och följer efter sin egen passning.',
    organisation:
      'En kvadrat per grupp om fyra. En boll per grupp. Byt riktning efter halva tiden.',
    fokusomraden: ['passning-mottagning', 'spelbarhet'],
    alder: { min: 10, max: 12 },
    spelformer: ['7mot7'],
    niva: ['niva-1', 'niva-2'],
    passdelar: ['del-uppvarmning', 'del-ovning'],
    ledarbehov: 0,
    spelare: { min: 4, max: 4 },
    grupptyp: 'fast-storlek',
    udda_antal_losning: true,
    tid: { kortast: 8, rekommenderad: 12, langst: 15 },
    yta: { '7mot7': { langd: 15, bredd: 15 } },
    // Nyckeln `alla` och inte `7mot7`, så att basövningen håller också i de tester som
    // byter spelform (ADR 0017: en nyckel måste finnas bland spelformerna).
    ytreferens: { alla: 'ungefär en tredjedel av stora planens straffområde' },
    material: [
      { typ: 'boll', antal: 1, anteckning: 'en per grupp' },
      { typ: 'kon', antal: 4 },
    ],
    coachningspunkter: ['Passa med insidan och lagom kraft.', 'Rör dig direkt efter passningen.'],
    varianter: {
      lattare: 'Stå stilla efter passningen.',
      svarare: 'Två bollar i gång samtidigt.',
    },
    anpassning: {
      fler_spelare: 'Fler kvadrater bredvid varandra.',
      udda_antal: 'Den femte spelaren vilar ett varv och byter in.',
      ledare: 'Med en ledare per grupp kan coachningen ske under gång.',
    },
    kalla: 'Egen övning, inspirerad av allmänt känd passningsövning.',
    status: 'utkast',
    granskning: [],
    ...overrides,
  };
}

/** En granskningsrad. */
export function reviewEntry(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    datum: '2026-09-12',
    av: 'fotbollsexpert Björn',
    roll: 'fotbollsexpert',
    kommentar: 'Granskad och godkänd fotbollsfackligt.',
    ...overrides,
  };
}
