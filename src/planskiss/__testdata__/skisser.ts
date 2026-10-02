/**
 * Skisser för ritmotorns tester. De är egna testdata och inte bankens övningar, så att testerna
 * inte går sönder när övningarna får skissdata på andra grenar. Varje skiss går genom
 * `readPlanskiss`, precis som i appen (RK-1).
 */
import { readPlanskiss } from '../../regelmotor/schema/planskiss.ts';
import type { Planskissdata, PlanskissInput } from '../../regelmotor/schema/planskiss.ts';
import type { GameFormat } from '../../regelmotor/keys.ts';

/** Validerar en skiss och kastar om den inte är giltig, så att ett fel i testdata syns direkt. */
export function sketch(input: PlanskissInput): Planskissdata {
  const result = readPlanskiss(input);
  if (result.status !== 'giltig') {
    throw new Error(`Ogiltig testskiss: ${JSON.stringify(result)}`);
  }
  return result.skiss;
}

/** 3 mot 3 utan målvakter, två små mål. Fast storlek. */
export const TRE_MOT_TRE: PlanskissInput = {
  version: 1,
  omrade: { langd: 15, bredd: 12 },
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 15, bredd: 12, stil: 'heldragen' },
    { id: 'mal-a', typ: 'mal', x: 0, y: 6, storlek: '3mot3', riktning: 'hoger' },
    { id: 'mal-b', typ: 'mal', x: 15, y: 6, storlek: '3mot3', riktning: 'vanster' },
    { id: 'a1', typ: 'spelare', x: 4, y: 3, lag: 'a' },
    { id: 'a2', typ: 'spelare', x: 4, y: 9, lag: 'a' },
    { id: 'a3', typ: 'spelare', x: 7, y: 6, lag: 'a', riktning: 0 },
    { typ: 'spelare', x: 10, y: 3, lag: 'b' },
    { typ: 'spelare', x: 10, y: 9, lag: 'b' },
    { typ: 'spelare', x: 12, y: 6, lag: 'b' },
    { typ: 'boll', x: 7.8, y: 6.4 },
  ],
  rorelser: [
    { typ: 'dribbling', fran: { objekt: 'a3' }, till: { x: 11, y: 7.5 }, ordning: 1 },
    { typ: 'skott', fran: { x: 11, y: 7.5 }, till: { objekt: 'mal-b' }, ordning: 2 },
  ],
};

/** 5 mot 5: ett mot ett till mål med målvakt och två köer (samma som README-exemplet). */
export const FEM_MOT_FEM: PlanskissInput = {
  version: 1,
  omrade: { langd: 15, bredd: 9 },
  beskrivning:
    'Yta 15 x 9 meter med ett mål och en målvakt på högra kortsidan. Anfallaren startar med boll vid vänstra kortsidan och försvararen vid nedre sidlinjen.',
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 15, bredd: 9, stil: 'heldragen' },
    { id: 'mal-1', typ: 'mal', x: 15, y: 4.5, storlek: '5mot5', riktning: 'vanster' },
    { typ: 'spelare', x: 14.2, y: 4.5, lag: 'b', malvakt: true, etikett: 'MV' },
    { id: 'anf', typ: 'spelare', x: 0, y: 4.5, lag: 'a', etikett: 'A' },
    { id: 'forsv', typ: 'spelare', x: 7, y: 9, lag: 'b', etikett: 'F' },
    { typ: 'boll', x: 0.9, y: 4.5 },
  ],
  rorelser: [
    {
      typ: 'dribbling',
      fran: { objekt: 'anf' },
      till: { x: 10, y: 3 },
      via: [{ x: 5, y: 3 }],
      ordning: 1,
    },
    { typ: 'lopning', fran: { objekt: 'forsv' }, till: { x: 9, y: 5 }, ordning: 1 },
    { typ: 'skott', fran: { x: 10, y: 3 }, till: { objekt: 'mal-1' }, ordning: 2 },
  ],
  skalning: {
    strategi: 'koer',
    koer: [
      { vid: 'anf', riktning: 270, avstand: 1.5, etikett: 'Anfallare' },
      { vid: 'forsv', riktning: 180, avstand: 1.5, etikett: 'Försvarare' },
    ],
  },
};

/** 7 mot 7: passa och följ i en kvadrat med fem spelare och fyra köer. */
export const SJU_MOT_SJU: PlanskissInput = {
  version: 1,
  omrade: { langd: 15, bredd: 15 },
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 15, bredd: 15, stil: 'streckad' },
    { typ: 'kon', x: 0, y: 0 },
    { typ: 'kon', x: 15, y: 0 },
    { typ: 'kon', x: 15, y: 15 },
    { typ: 'kon', x: 0, y: 15 },
    { id: 'sp-1', typ: 'spelare', x: -0.8, y: -0.8, lag: 'a', etikett: '1' },
    { id: 'sp-5', typ: 'spelare', x: -1.9, y: -1.9, lag: 'a', etikett: '5' },
    { id: 'sp-2', typ: 'spelare', x: 15.8, y: -0.8, lag: 'a', etikett: '2' },
    { id: 'sp-3', typ: 'spelare', x: 15.8, y: 15.8, lag: 'a', etikett: '3' },
    { id: 'sp-4', typ: 'spelare', x: -0.8, y: 15.8, lag: 'a', etikett: '4' },
    { typ: 'boll', x: 0.3, y: 0.3 },
  ],
  rorelser: [
    { typ: 'passning', fran: { objekt: 'sp-1' }, till: { objekt: 'sp-2' }, ordning: 1 },
    {
      typ: 'lopning',
      fran: { objekt: 'sp-1' },
      till: { x: 16.6, y: -1.6 },
      via: [{ x: 7.5, y: -2.5 }],
      ordning: 2,
    },
    { typ: 'passning', fran: { objekt: 'sp-2' }, till: { objekt: 'sp-3' }, ordning: 3 },
  ],
  skalning: {
    strategi: 'koer',
    koer: [
      { vid: 'sp-2', riktning: 315 },
      { vid: 'sp-3', riktning: 45 },
      { vid: 'sp-4', riktning: 135 },
      { vid: 'sp-5', riktning: 225 },
    ],
  },
};

/** 9 mot 9: smålagsspel med målvakter och platser för två lag. */
export const NIO_MOT_NIO: PlanskissInput = {
  version: 1,
  omrade: { langd: 40, bredd: 30 },
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 40, bredd: 30, stil: 'heldragen' },
    { id: 'mal-a', typ: 'mal', x: 0, y: 15, storlek: '9mot9', riktning: 'hoger' },
    { id: 'mal-b', typ: 'mal', x: 40, y: 15, storlek: '9mot9', riktning: 'vanster' },
    { typ: 'spelare', x: 1, y: 15, lag: 'a', malvakt: true },
    { typ: 'spelare', x: 39, y: 15, lag: 'b', malvakt: true },
    { id: 'a1', typ: 'spelare', x: 12, y: 8, lag: 'a' },
    { id: 'a2', typ: 'spelare', x: 12, y: 22, lag: 'a' },
    { id: 'a3', typ: 'spelare', x: 22, y: 15, lag: 'a', riktning: 0 },
    { typ: 'spelare', x: 28, y: 8, lag: 'b' },
    { typ: 'spelare', x: 28, y: 22, lag: 'b' },
    { typ: 'spelare', x: 18, y: 12, lag: 'b' },
    { typ: 'boll', x: 13, y: 9 },
    { typ: 'ledare', x: 20, y: 32 },
  ],
  rorelser: [
    { typ: 'passning', fran: { objekt: 'a1' }, till: { objekt: 'a3' }, ordning: 1 },
    { typ: 'lopning', fran: { objekt: 'a2' }, till: { x: 30, y: 20 }, ordning: 2 },
    { typ: 'passning', fran: { objekt: 'a3' }, till: { x: 30, y: 20 }, ordning: 3 },
    { typ: 'skott', fran: { x: 30, y: 20 }, till: { objekt: 'mal-b' }, ordning: 4 },
  ],
  skalning: {
    strategi: 'platser',
    platser: [
      { x: 20, y: 4, lag: 'a' },
      { x: 20, y: 26, lag: 'b' },
      { x: 8, y: 15, lag: 'a' },
      { x: 34, y: 9, lag: 'b' },
    ],
  },
};

/**
 * 11 mot 11: inlägg och avslut på halva planen, med zoner, markeringar, en neutral spelare,
 * ledare och ett eget mål. Visar de flesta objekttyperna i en och samma skiss.
 */
export const ELVA_MOT_ELVA: PlanskissInput = {
  version: 1,
  omrade: { langd: 52, bredd: 68 },
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 52, bredd: 68, stil: 'heldragen' },
    { typ: 'ruta', x: 35.5, y: 13.8, langd: 16.5, bredd: 40.3, stil: 'heldragen' },
    {
      typ: 'zon',
      x: 30,
      y: 0,
      langd: 22,
      bredd: 12,
      monster: 'diagonal',
      etikett: 'Inläggszon',
    },
    { typ: 'zon', x: 30, y: 56, langd: 22, bredd: 12, monster: 'prickar', etikett: 'Inläggszon' },
    { typ: 'zon', x: 0, y: 24, langd: 10, bredd: 20, monster: 'tom' },
    { typ: 'markering', form: 'linje', x: 26, y: 0, till: { x: 26, y: 68 } },
    { typ: 'markering', form: 'platta', x: 20, y: 34 },
    { typ: 'markering', form: 'prick', x: 41, y: 34 },
    { id: 'mal', typ: 'mal', x: 52, y: 34, storlek: '11mot11', riktning: 'vanster' },
    { typ: 'mal', x: 0, y: 10, storlek: 'eget', bredd: 2, riktning: 'hoger' },
    { typ: 'spelare', x: 51, y: 34, lag: 'b', malvakt: true },
    { id: 'ytter', typ: 'spelare', x: 34, y: 6, lag: 'a', etikett: 'Y' },
    { id: 'nia', typ: 'spelare', x: 30, y: 30, lag: 'a', etikett: '9' },
    { typ: 'spelare', x: 44, y: 28, lag: 'b', etikett: 'MB' },
    { id: 'joker', typ: 'spelare', x: 22, y: 40, lag: 'neutral', etikett: 'J' },
    { typ: 'boll', x: 35, y: 7 },
    { typ: 'ledare', x: 20, y: -2, etikett: 'L1' },
    { typ: 'kon', x: 26, y: 6 },
  ],
  rorelser: [
    { typ: 'passning', fran: { objekt: 'joker' }, till: { objekt: 'ytter' }, ordning: 1 },
    {
      typ: 'dribbling',
      fran: { objekt: 'ytter' },
      till: { x: 46, y: 8 },
      ordning: 2,
    },
    {
      typ: 'passning',
      fran: { x: 46, y: 8 },
      till: { x: 45, y: 32 },
      via: [{ x: 50, y: 20 }],
      ordning: 3,
      etikett: 'Inlägg',
    },
    {
      typ: 'lopning',
      fran: { objekt: 'nia' },
      till: { x: 45, y: 32 },
      via: [
        { x: 36, y: 24 },
        { x: 40, y: 34 },
      ],
      ordning: 3,
    },
    { typ: 'skott', fran: { x: 45, y: 32 }, till: { objekt: 'mal' }, ordning: 4 },
  ],
  skalning: {
    strategi: 'koer',
    koer: [{ vid: 'joker', riktning: 180, avstand: 2, etikett: 'Nästa inlägg' }],
  },
};

export const PER_SPELFORM: Record<GameFormat, PlanskissInput> = {
  '3mot3': TRE_MOT_TRE,
  '5mot5': FEM_MOT_FEM,
  '7mot7': SJU_MOT_SJU,
  '9mot9': NIO_MOT_NIO,
  '11mot11': ELVA_MOT_ELVA,
};

/**
 * Sex stationer i en cirkel på en liten yta, med en etikett på varje station och en lång
 * rörelseetikett. Uppställningen är samma typ som i `knakontroll-uppvarmning`, där
 * etiketterna krockade med symbolerna och med varandra (ux-granskningen, fynd C). Basskissen
 * har sex spelare, och platserna fyller på till tolv.
 */
export const STATIONER_I_CIRKEL: PlanskissInput = {
  version: 1,
  omrade: { langd: 12, bredd: 10 },
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 12, bredd: 10, stil: 'streckad' },
    { typ: 'kon', x: 0, y: 0 },
    { typ: 'kon', x: 12, y: 0 },
    { typ: 'kon', x: 12, y: 10 },
    { typ: 'kon', x: 0, y: 10 },
    ...(
      [
        [5.75, 0.75],
        [9.25, 2.75],
        [9.25, 6.75],
        [5.75, 8.75],
        [2.25, 6.75],
        [2.25, 2.75],
      ] as const
    ).map(([x, y], index) => ({
      typ: 'ruta' as const,
      x,
      y,
      langd: 0.5,
      bredd: 0.5,
      stil: 'heldragen' as const,
      etikett: `Station ${index + 1}`,
    })),
    { id: 'sp-1', typ: 'spelare', x: 6.7, y: 1, lag: 'neutral' },
    { id: 'sp-2', typ: 'spelare', x: 10.2, y: 3, lag: 'neutral' },
    { id: 'sp-3', typ: 'spelare', x: 10.2, y: 7, lag: 'neutral' },
    { id: 'sp-4', typ: 'spelare', x: 6.7, y: 9, lag: 'neutral' },
    { id: 'sp-5', typ: 'spelare', x: 3.2, y: 7, lag: 'neutral' },
    { id: 'sp-6', typ: 'spelare', x: 3.2, y: 3, lag: 'neutral' },
    { typ: 'ledare', x: 6, y: 5 },
  ],
  rorelser: [
    {
      typ: 'lopning',
      fran: { objekt: 'sp-1' },
      till: { objekt: 'sp-2' },
      etikett: 'Alla roterar medurs',
    },
    { typ: 'lopning', fran: { objekt: 'sp-2' }, till: { objekt: 'sp-3' } },
    { typ: 'lopning', fran: { objekt: 'sp-3' }, till: { objekt: 'sp-4' } },
    { typ: 'lopning', fran: { objekt: 'sp-4' }, till: { objekt: 'sp-5' } },
    { typ: 'lopning', fran: { objekt: 'sp-5' }, till: { objekt: 'sp-6' } },
    { typ: 'lopning', fran: { objekt: 'sp-6' }, till: { objekt: 'sp-1' } },
  ],
  skalning: {
    strategi: 'platser',
    platser: [
      { x: 5.3, y: 1, lag: 'neutral' },
      { x: 8.8, y: 3, lag: 'neutral' },
      { x: 8.8, y: 7, lag: 'neutral' },
      { x: 5.3, y: 9, lag: 'neutral' },
      { x: 1.8, y: 7, lag: 'neutral' },
      { x: 1.8, y: 3, lag: 'neutral' },
    ],
  },
};

/**
 * Måttexten och en spelare med etikett i nedre vänstra hörnet (ux-granskningen, fynd B/F5).
 * Spelaren står där måttexten annars skulle stå, strax under ytans nedre vänstra hörn.
 */
export const SPELARE_VID_MATTEXTEN: PlanskissInput = {
  version: 1,
  omrade: { langd: 20, bredd: 12 },
  objekt: [
    { typ: 'ruta', x: 0, y: 0, langd: 20, bredd: 12, stil: 'heldragen' },
    { id: 'a', typ: 'spelare', x: 1.5, y: 12.8, lag: 'a', etikett: 'A' },
    { typ: 'spelare', x: 10, y: 6, lag: 'b', etikett: 'F' },
  ],
};
