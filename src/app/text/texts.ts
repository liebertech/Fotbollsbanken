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
    /*
     * Märkningen "(K)" visas för ögat och ingår ordagrant i kryssrutans tillgängliga namn
     * (WCAG 2.5.3, Label in Name). Ordet här läggs till efter "(K)", så att en skärmläsare
     * får sammanhanget till bokstaven utan att den synliga texten försvinner ur namnet:
     * "Passning och mottagning (K), kärnområde". Se docs/design/skisser/01-underlag.md,
     * avsnittet Tillgänglighet, och docs/design/texter.md avsnitt 3.
     */
    focusCore: 'kärnområde',
    /*
     * Visas i stället för fokuslistan innan ålder är ifylld (R-019, listan kan inte filtreras
     * mot en åldersfas förrän åldern finns). Tillagd av ux-designern vid granskningen inför K4
     * (2026-09-23), se docs/design/texter.md avsnitt 3.
     */
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
    groups: '{groups} grupper à {size} spelare',
    groupsMixed: '{groups} grupper: {sizes} spelare',
    oneGroup: 'En grupp med {size} spelare',
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
     * R-100/R-103, tredje läget (ux-designer, granskning K4 2026-09-23): visas när delen varken
     * kan fyllas som den står (`emptyReason: 'val-kan-andras'`) eller genom att ändra ett enda
     * fält (`changeableFields` tom). Skiljer sig medvetet från både emptyChangeable (en lista med
     * fält finns) och emptyCombination (påstår att övningar som passar var för sig finns – det
     * vet vi inte här). `SessionView.tsx` skiljer lägena åt på `emptyReason`, aldrig på att
     * fältlistan råkar vara tom.
     */
    emptyNoSingleFix:
      'Vi hittade inga övningar som passar den här delen, och inget enskilt val skulle ensamt lösa det. Prova att ändra flera uppgifter i underlaget samtidigt.',
    /**
     * Ersättningsfokus (R-121, berättelse 03 kriterium 6). Texten saknades i texter.md, som
     * godkändes vid K2 innan regeln fanns – tillagd av ux-designern vid granskningen inför K4
     * (2026-09-23), se docs/design/texter.md avsnitt 4.
     */
    substituteFocus:
      'Inga övningar för {missing} passade den här delen, så vi använde {substitute} i stället. Dina val i underlaget är oförändrade.',
    newSession: 'Nytt pass',
    changeInput: 'Ändra uppgifter',
    generateAgain: 'Generera igen',
  },

  /** Avsnitt 5: inget matchande resultat. */
  noSession: {
    heading: 'Vi kunde inte skapa ett pass med de här uppgifterna',
    changeable:
      'Det finns för få övningar som matchar allt du valt. Prova att ändra ett av de här:',
    /**
     * R-100 andra punkten. Texten påstår att det finns övningar som passar var för sig, och
     * får därför bara visas när motorn har bekräftat det: `NoSessionReason.cause` är
     * `gar-inte-att-kombinera`. Villkoret var ux-designerns krav vid granskningen inför K4
     * (2026-09-23), och bekräftelsen lades till i motorn samtidigt.
     */
    combination:
      'Det finns övningar som skulle kunna passa var för sig, men de går inte att kombinera till ett helt pass med dina val.',
    /**
     * Tom fältlista och `cause: 'inget-matchar'` (t.ex. banken saknar övningar helt för den
     * valda spelformen, som för 11 mot 11 i dag). Påstår inte att övningar som passar var för
     * sig finns – till skillnad från `combination` ovan. Tillagd av ux-designern vid
     * granskningen inför K4 (2026-09-23).
     */
    noMatch:
      'Vi hittade inga övningar som matchar de här valen, och vi kan inte peka ut ett enskilt val som skulle lösa det. Prova att ändra flera uppgifter i underlaget samtidigt.',
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
