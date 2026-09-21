/**
 * Gränssnittets texter, ordagrant ur docs/design/texter.md. Texterna ligger samlade här
 * så att en ändrad formulering inte kräver att en vy ändras.
 *
 * Nycklarna är engelska som all annan kod; värdena är det ledaren läser.
 */
export const TEXTS = {
  /** Avsnitt 3: underlaget. */
  input: {
    heading: 'Nytt pass',
    age: 'Ålder',
    ageHelp:
      'Ange den ålder som flest i gruppen fyller i år. Har ni två lika vanliga åldrar, ange den yngre.',
    gameFormat: 'Spelform',
    gameFormatHelp:
      'Föreslagen utifrån åldern. Du kan också välja spelformen närmast före eller efter.',
    level: 'Nivå',
    levelHelp: 'Välj den nivå som stämmer för ungefär två av tre spelare i gruppen.',
    players: 'Antal spelare',
    coaches: 'Antal ledare',
    length: 'Passets längd (minuter)',
    lengthHelp: 'Kortast {min}, längst {max} min för den här åldern.',
    focus: 'Fokusområden (välj 1–3)',
    focusFull: 'Inaktiverad, redan tre valda',
    /* Egen text: listan visar bara fokusområden som passar åldern (R-019). */
    focusNeedsAge: 'Ange ålder först, så visar vi de fokusområden som passar åldern.',
    area: 'Yta (valfritt)',
    areaNone: 'Ingen',
    summaryError: 'Några uppgifter saknas eller stämmer inte – se markeringarna ovan.',
    submit: 'Generera pass',
  },

  /** Avsnitt 4: det genererade passet. */
  session: {
    heading: 'Ditt pass',
    actualTime: 'Faktisk tid: {actual} min (du bad om {requested} min)',
    time: 'Faktisk tid: {actual} min',
    focusLabel: 'Fokus:',
    showMore: 'Visa mer',
    showLess: 'Visa mindre',
    purpose: 'Syfte',
    description: 'Beskrivning',
    organisation: 'Organisation',
    coachTask: 'Ledarens uppgift',
    coachingPoints: 'Coachningspunkter',
    variants: 'Varianter',
    easier: 'Lättare',
    harder: 'Svårare',
    material: 'Material',
    groups: '{groups} grupper à {sizes} spelare',
    oneGroup: 'En grupp med {sizes} spelare',
    oddSolution: 'Udda antal:',
    stationsHeading: '{count} stationer · {minutes} min',
    period: 'Period {number}',
    breakRow: 'Vattenpaus',
    closingRow: 'Samling: vad tränade vi på, vad gick bra?',
    sketchMissing: 'Planskiss saknas',
    emptyPart: 'Övning saknas',
    emptyTarget: 'Måltid: {minutes} min.',
    emptyChangeable:
      'Vi kunde inte hitta en övning som passar här. Testa att ändra ett av de här: {fields}.',
    emptyCombination:
      'De övningar som annars skulle passa här gick inte att kombinera med resten av passet.',
    /**
     * Ersättningsfokus (R-121, berättelse 03 kriterium 6). Texten saknas i texter.md, som
     * godkändes vid K2 innan regeln fanns. Förslaget nedan följer principerna i avsnittet
     * *Principer bakom formuleringarna* och ska granskas av ux-designern.
     */
    substituteFocus:
      'Vi hittade ingen övning för {missing} i den här delen, så vi valde {substitute} i stället. Dina val står kvar oförändrade.',
    newSession: 'Nytt pass',
    changeInput: 'Ändra uppgifter',
    generateAgain: 'Generera igen',
  },

  /** Avsnitt 5: inget matchande resultat. */
  noSession: {
    heading: 'Vi kunde inte skapa ett pass med de här uppgifterna',
    changeable:
      'Det finns för få övningar som matchar allt du valt. Prova att ändra ett av de här:',
    combination:
      'Det finns övningar som skulle kunna passa var för sig, men de går inte att kombinera till ett helt pass med dina val.',
    reassurance: 'Vi ändrar ingenting åt dig – gå tillbaka och justera det du vill testa.',
    button: 'Ändra uppgifter',
    summaryHeading: 'Ditt underlag just nu',
  },

  /** Avsnitt 15: generella fel. */
  general: {
    unexpected: 'Något gick fel just nu. Försök igen om en liten stund.',
  },
} as const;

/** Byter ut {platshållare} mot värden. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
