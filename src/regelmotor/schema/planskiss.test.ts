/**
 * Tester för planskissens schema (ADR 0012 avsnitt 1–4, 6 och fallen i avsnitt 8, *Validering*).
 *
 * Varje underkänt fall kontrollerar både fältet (sökvägen) och att meddelandet är svenska
 * ord som övningsförfattaren kan agera på, eftersom felet visas rakt av i
 * `npm run validera:ovningar`.
 */
import { describe, expect, it } from 'vitest';
import {
  FORBIDDEN_TEXT_CHARACTERS,
  LABEL_PATTERN,
  PLANSKISS_LIMITS,
  planskissSchema,
  planskissTexts,
  readPlanskiss,
  SHORT_LABEL_PATTERN,
  type Planskissdata,
} from './planskiss.ts';

type Sketch = Record<string, unknown>;

/** En giltig minsta skiss. Skicka in det som är intressant för just testet. */
function sketch(overrides: Sketch = {}): Sketch {
  return {
    version: 1,
    omrade: { langd: 20, bredd: 10 },
    objekt: [{ id: 'sp-1', typ: 'spelare', x: 2, y: 5, lag: 'a' }],
    ...overrides,
  };
}

/** Skissen med de här objekten. */
function withObjects(...objekt: Sketch[]): Sketch {
  return sketch({ objekt });
}

/** Felen som `fält: meddelande`, en rad per fel. */
function issues(input: unknown): string[] {
  const result = readPlanskiss(input);
  return result.status === 'ogiltig'
    ? result.issues.map((issue) => `${issue.path}: ${issue.message}`)
    : [];
}

function isValid(input: unknown): boolean {
  return readPlanskiss(input).status === 'giltig';
}

/** Sant när minst ett fel gäller fältet och innehåller texten. */
function failsOn(input: unknown, field: string, text: string): boolean {
  return issues(input).some((line) => line.startsWith(`${field}: `) && line.includes(text));
}

/** Exemplet i ADR 0012 avsnitt 9, ordagrant i sak. */
const ADR_EXAMPLE: Sketch = {
  version: 1,
  omrade: { langd: 15, bredd: 15 },
  beskrivning:
    'Kvadrat 15 x 15 meter med en kon i varje hörn och en spelare vid varje kon. Bollen börjar i övre vänstra hörnet och passas medsols.',
  objekt: [
    { id: 'kon-1', typ: 'kon', x: 0, y: 0 },
    { id: 'kon-2', typ: 'kon', x: 15, y: 0 },
    { id: 'kon-3', typ: 'kon', x: 15, y: 15 },
    { id: 'kon-4', typ: 'kon', x: 0, y: 15 },
    { id: 'sp-1', typ: 'spelare', x: 1.2, y: 1.2, lag: 'a', etikett: '1' },
    { id: 'sp-2', typ: 'spelare', x: 13.8, y: 1.2, lag: 'a', etikett: '2' },
    { id: 'sp-3', typ: 'spelare', x: 13.8, y: 13.8, lag: 'a', etikett: '3' },
    { id: 'sp-4', typ: 'spelare', x: 1.2, y: 13.8, lag: 'a', etikett: '4' },
    { id: 'boll-1', typ: 'boll', x: 2.4, y: 2.0 },
    { id: 'ruta-1', typ: 'ruta', x: 0, y: 0, langd: 15, bredd: 15, stil: 'streckad' },
  ],
  rorelser: [
    { typ: 'passning', fran: { objekt: 'sp-1' }, till: { objekt: 'sp-2' }, ordning: 1 },
    {
      typ: 'lopning',
      fran: { objekt: 'sp-1' },
      till: { objekt: 'sp-2' },
      via: [{ x: 7.5, y: 3.5 }],
      ordning: 2,
    },
    { typ: 'passning', fran: { objekt: 'sp-2' }, till: { objekt: 'sp-3' }, ordning: 3 },
  ],
  skalning: { strategi: 'parallella-ytor', per_yta: 4 },
};

describe('giltiga skisser', () => {
  it('godkänner exemplet i ADR 0012 avsnitt 9', () => {
    expect(issues(ADR_EXAMPLE)).toEqual([]);
  });

  it('godkänner den minsta skissen: version, omrade och ett objekt', () => {
    expect(issues(sketch())).toEqual([]);
  });

  it('godkänner varje objekttyp med sina egna fält', () => {
    const input = withObjects(
      {
        id: 'sp-1',
        typ: 'spelare',
        x: 2,
        y: 5,
        lag: 'a',
        malvakt: true,
        etikett: 'MV',
        riktning: 0,
      },
      { typ: 'spelare', x: 3, y: 5, lag: 'b' },
      { typ: 'spelare', x: 4, y: 5, lag: 'neutral', riktning: 359 },
      { typ: 'ledare', x: 10, y: 11, etikett: 'L' },
      { typ: 'kon', x: 0, y: 0 },
      { typ: 'markering', x: 1, y: 1, form: 'platta' },
      { typ: 'markering', x: 1, y: 2, form: 'prick' },
      { typ: 'markering', x: 10, y: 0, form: 'linje', till: { x: 10, y: 10 } },
      { typ: 'mal', x: 20, y: 5, storlek: '5mot5', riktning: 'vanster' },
      { typ: 'mal', x: 0, y: 5, storlek: 'eget', bredd: 2.5, riktning: 'hoger' },
      { typ: 'mal', x: 10, y: 0, storlek: 'smamal', riktning: 'ner' },
      { typ: 'boll', x: 3, y: 6 },
      { typ: 'zon', x: 0, y: 0, langd: 5, bredd: 10, monster: 'diagonal', etikett: 'Fredad zon' },
      { typ: 'ruta', x: 0, y: 0, langd: 20, bredd: 10, stil: 'heldragen' },
    );
    expect(issues(input)).toEqual([]);
  });

  it('godkänner varje spelformsstorlek på målet', () => {
    for (const storlek of ['3mot3', '5mot5', '7mot7', '9mot9', '11mot11', 'smamal']) {
      expect(isValid(withObjects({ typ: 'mal', x: 0, y: 5, storlek, riktning: 'hoger' }))).toBe(
        true,
      );
    }
  });

  it('godkänner varje rörelsetyp, med punkter, hänvisningar, via, ordning och etikett', () => {
    const input = sketch({
      rorelser: ['passning', 'lopning', 'dribbling', 'skott'].map((typ, index) => ({
        typ,
        fran: { objekt: 'sp-1' },
        till: { x: 15, y: 5 },
        via:
          index === 0
            ? []
            : index === 1
              ? [{ x: 8, y: 2 }]
              : [
                  { x: 8, y: 2 },
                  { x: 12, y: 8 },
                ],
        ordning: index + 1,
        etikett: 'Steg 1',
      })),
    });
    expect(issues(input)).toEqual([]);
  });

  it('godkänner varje skalningsstrategi', () => {
    const koer = [{ vid: 'sp-1', riktning: 180 }];
    const platser = [{ x: 5, y: 5, lag: 'b' }];
    for (const skalning of [
      { strategi: 'fast' },
      { strategi: 'koer', koer },
      { strategi: 'platser', platser },
      { strategi: 'parallella-ytor', per_yta: 4 },
    ]) {
      expect(issues(sketch({ skalning }))).toEqual([]);
    }
  });

  it('godkänner kombinationen platser och koer, angiven med båda strategierna', () => {
    const koer = [{ vid: 'sp-1', riktning: 180, avstand: 1.5 }];
    const platser = [{ x: 5, y: 5, lag: 'b' }];
    expect(isValid(sketch({ skalning: { strategi: 'platser', platser, koer } }))).toBe(true);
    expect(isValid(sketch({ skalning: { strategi: 'koer', koer, platser } }))).toBe(true);
  });

  it('godkänner kön för den vilande spelaren vid udda antal (ADR 0012 avsnitt 4)', () => {
    const skalning = {
      strategi: 'koer',
      koer: [{ vid: 'sp-1', riktning: 90, avstand: 3, etikett: 'Vilande, byter in' }],
    };
    expect(issues(sketch({ skalning }))).toEqual([]);
  });
});

describe('koordinater och avrundning (avsnitt 1)', () => {
  it('avrundar koordinater och mått till närmaste decimeter', () => {
    const result = planskissSchema.parse(
      sketch({
        omrade: { langd: 20.04, bredd: 10.06 },
        objekt: [{ typ: 'kon', x: 1.26, y: 1.04 }],
      }),
    );
    expect(result.omrade).toEqual({ langd: 20, bredd: 10.1 });
    expect(result.objekt[0]).toEqual({ typ: 'kon', x: 1.3, y: 1 });
  });

  it('godkänner ett objekt exakt 3 m utanför ytan åt alla håll', () => {
    expect(isValid(withObjects({ typ: 'kon', x: -3, y: -3 }))).toBe(true);
    expect(isValid(withObjects({ typ: 'kon', x: 23, y: 13 }))).toBe(true);
  });

  it('underkänner ett objekt mer än 3 m utanför ytan, med ytans mått i felet', () => {
    expect(failsOn(withObjects({ typ: 'kon', x: 23.5, y: 5 }), 'objekt.0.x', 'utanför ytan')).toBe(
      true,
    );
    expect(failsOn(withObjects({ typ: 'kon', x: 5, y: 13.5 }), 'objekt.0.y', '-3 till 13 m')).toBe(
      true,
    );
    expect(failsOn(withObjects({ typ: 'kon', x: -3.5, y: 5 }), 'objekt.0.x', 'x')).toBe(true);
  });

  it('underkänner NaN och Infinity som koordinat', () => {
    for (const bad of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      expect(failsOn(withObjects({ typ: 'kon', x: bad, y: 1 }), 'objekt.0.x', 'ska vara')).toBe(
        true,
      );
    }
  });

  it('underkänner en koordinat skriven som text', () => {
    expect(failsOn(withObjects({ typ: 'kon', x: '5', y: 1 }), 'objekt.0.x', 'ett tal')).toBe(true);
  });

  it('underkänner en zon vars bortre hörn hamnar utanför ytan', () => {
    const input = withObjects({ typ: 'zon', x: 10, y: 0, langd: 14, bredd: 5, monster: 'tom' });
    expect(failsOn(input, 'objekt.0.langd', 'x + langd')).toBe(true);
  });

  it('underkänner en linjemarkering, en rörelsepunkt, en via-punkt och en plats utanför ytan', () => {
    expect(
      failsOn(
        withObjects({ typ: 'markering', x: 1, y: 1, form: 'linje', till: { x: 30, y: 1 } }),
        'objekt.0.till.x',
        'utanför ytan',
      ),
    ).toBe(true);
    const movement = { typ: 'passning', fran: { x: 1, y: -4 }, till: { objekt: 'sp-1' } };
    expect(failsOn(sketch({ rorelser: [movement] }), 'rorelser.0.fran.y', 'utanför ytan')).toBe(
      true,
    );
    const curved = {
      ...movement,
      fran: { x: 1, y: 1 },
      via: [
        { x: 1, y: 1 },
        { x: 40, y: 1 },
      ],
    };
    expect(failsOn(sketch({ rorelser: [curved] }), 'rorelser.0.via.1.x', 'utanför ytan')).toBe(
      true,
    );
    const skalning = { strategi: 'platser', platser: [{ x: 5, y: 20, lag: 'a' }] };
    expect(failsOn(sketch({ skalning }), 'skalning.platser.0.y', 'utanför ytan')).toBe(true);
  });
});

describe('toppnivån (avsnitt 2)', () => {
  it('underkänner en annan version än 1', () => {
    expect(failsOn(sketch({ version: 2 }), 'version', 'ska vara 1')).toBe(true);
  });

  it('underkänner en skiss utan version, omrade eller objekt', () => {
    for (const field of ['version', 'omrade', 'objekt']) {
      const input = sketch();
      delete input[field];
      expect(failsOn(input, field, 'saknas')).toBe(true);
    }
  });

  it('prövar omrade mot 5–120 och 5–80 meter', () => {
    expect(
      isValid(sketch({ omrade: { langd: 5, bredd: 5 }, objekt: [{ typ: 'kon', x: 1, y: 1 }] })),
    ).toBe(true);
    expect(isValid(sketch({ omrade: { langd: 120, bredd: 80 } }))).toBe(true);
    expect(
      failsOn(sketch({ omrade: { langd: 4.9, bredd: 10 } }), 'omrade.langd', 'mindre än 5'),
    ).toBe(true);
    expect(
      failsOn(sketch({ omrade: { langd: 20, bredd: 80.5 } }), 'omrade.bredd', 'större än 80'),
    ).toBe(true);
  });

  it('underkänner ett okänt fält på toppnivån och i omrade (.strict())', () => {
    expect(failsOn(sketch({ farg: 'gron' }), '', 'okänt fält i planskissen: farg')).toBe(true);
    expect(
      failsOn(sketch({ omrade: { langd: 20, bredd: 10, djup: 1 } }), 'omrade', 'okänt fält'),
    ).toBe(true);
  });

  it('godkänner en beskrivning på 300 tecken och underkänner 301', () => {
    expect(isValid(sketch({ beskrivning: 'a'.repeat(PLANSKISS_LIMITS.beskrivning) }))).toBe(true);
    expect(
      failsOn(
        sketch({ beskrivning: 'a'.repeat(PLANSKISS_LIMITS.beskrivning + 1) }),
        'beskrivning',
        'högst 300 tecken',
      ),
    ).toBe(true);
  });

  it('godkänner 60 objekt och underkänner 61', () => {
    const cones = (count: number) =>
      Array.from({ length: count }, (_, index) => ({ typ: 'kon', x: index % 20, y: 1 }));
    expect(isValid(sketch({ objekt: cones(60) }))).toBe(true);
    expect(failsOn(sketch({ objekt: cones(61) }), 'objekt', 'högst 60 objekt')).toBe(true);
  });

  it('underkänner en tom objektlista', () => {
    expect(failsOn(sketch({ objekt: [] }), 'objekt', 'minst ett objekt')).toBe(true);
  });

  it('godkänner 30 rörelser och underkänner 31', () => {
    const moves = (count: number) =>
      Array.from({ length: count }, () => ({
        typ: 'passning',
        fran: { objekt: 'sp-1' },
        till: { x: 5, y: 5 },
      }));
    expect(isValid(sketch({ rorelser: moves(30) }))).toBe(true);
    expect(failsOn(sketch({ rorelser: moves(31) }), 'rorelser', 'högst 30 rörelser')).toBe(true);
  });

  it('godkänner 40 spelare och underkänner 41 (S-5)', () => {
    const players = (count: number) =>
      Array.from({ length: count }, (_, index) => ({
        typ: 'spelare',
        x: index % 20,
        y: Math.floor(index / 20),
        lag: 'a',
      }));
    expect(isValid(sketch({ objekt: players(40) }))).toBe(true);
    expect(failsOn(sketch({ objekt: players(41) }), 'objekt', 'Högst 40 spelarsymboler')).toBe(
      true,
    );
  });
});

describe('objekten (avsnitt 2)', () => {
  it('underkänner ett okänt typ och ett objekt utan typ, och räknar upp de tillåtna', () => {
    expect(
      failsOn(withObjects({ typ: 'hink', x: 1, y: 1 }), 'objekt.0.typ', 'Välj spelare, ledare'),
    ).toBe(true);
    expect(failsOn(withObjects({ x: 1, y: 1 }), 'objekt.0.typ', 'typ saknas')).toBe(true);
  });

  it('underkänner ett okänt fält på ett objekt och säger vilka fält som finns', () => {
    expect(
      failsOn(
        withObjects({ typ: 'kon', x: 1, y: 1, farg: 'rod' }),
        'objekt.0',
        'okänt fält i konen: farg. Tillåtna fält är typ, id, x, y',
      ),
    ).toBe(true);
  });

  it('underkänner en spelare utan lag eller med ett okänt lag', () => {
    expect(failsOn(withObjects({ typ: 'spelare', x: 1, y: 1 }), 'objekt.0.lag', 'lag saknas')).toBe(
      true,
    );
    expect(
      failsOn(
        withObjects({ typ: 'spelare', x: 1, y: 1, lag: 'c' }),
        'objekt.0.lag',
        'a, b eller neutral',
      ),
    ).toBe(true);
  });

  it('prövar spelarens riktning som heltal 0–359', () => {
    const player = (riktning: number) =>
      withObjects({ typ: 'spelare', x: 1, y: 1, lag: 'a', riktning });
    expect(isValid(player(0))).toBe(true);
    expect(isValid(player(359))).toBe(true);
    expect(failsOn(player(360), 'objekt.0.riktning', 'större än 359')).toBe(true);
    expect(failsOn(player(-1), 'objekt.0.riktning', 'mindre än 0')).toBe(true);
    expect(failsOn(player(45.5), 'objekt.0.riktning', 'heltal')).toBe(true);
  });

  it('underkänner malvakt som inte är true eller false', () => {
    expect(
      failsOn(
        withObjects({ typ: 'spelare', x: 1, y: 1, lag: 'a', malvakt: 'ja' }),
        'objekt.0.malvakt',
        'true eller false',
      ),
    ).toBe(true);
  });

  it('underkänner bredd på ett mål utan storlek eget', () => {
    const input = withObjects({
      typ: 'mal',
      x: 0,
      y: 5,
      storlek: '5mot5',
      bredd: 3,
      riktning: 'hoger',
    });
    expect(failsOn(input, 'objekt.0.bredd', 'bara anges när storlek är eget')).toBe(true);
  });

  it('kräver bredd när målets storlek är eget, och prövar den mot 0,5–8 m', () => {
    const goal = (bredd?: number) =>
      withObjects({ typ: 'mal', x: 0, y: 5, storlek: 'eget', riktning: 'hoger', bredd });
    expect(failsOn(goal(), 'objekt.0.bredd', 'bredd krävs')).toBe(true);
    expect(isValid(goal(0.5))).toBe(true);
    expect(isValid(goal(8))).toBe(true);
    expect(failsOn(goal(0.4), 'objekt.0.bredd', 'mindre än 0,5 m')).toBe(true);
    expect(failsOn(goal(8.1), 'objekt.0.bredd', 'större än 8 m')).toBe(true);
  });

  it('kräver målets riktning och storlek', () => {
    expect(
      failsOn(
        withObjects({ typ: 'mal', x: 0, y: 5, storlek: '5mot5' }),
        'objekt.0.riktning',
        'saknas',
      ),
    ).toBe(true);
    expect(
      failsOn(
        withObjects({ typ: 'mal', x: 0, y: 5, riktning: 'hoger' }),
        'objekt.0.storlek',
        'saknas',
      ),
    ).toBe(true);
  });

  it('underkänner till på en markering som inte är en linje', () => {
    const input = withObjects({
      typ: 'markering',
      x: 1,
      y: 1,
      form: 'prick',
      till: { x: 2, y: 2 },
    });
    expect(failsOn(input, 'objekt.0.till', 'bara anges när form är linje')).toBe(true);
  });

  it('kräver till på en linjemarkering', () => {
    const input = withObjects({ typ: 'markering', x: 1, y: 1, form: 'linje' });
    expect(failsOn(input, 'objekt.0.till', 'till krävs')).toBe(true);
  });

  it('kräver zonens mönster och rutans stil', () => {
    expect(
      failsOn(
        withObjects({ typ: 'zon', x: 0, y: 0, langd: 5, bredd: 5 }),
        'objekt.0.monster',
        'saknas',
      ),
    ).toBe(true);
    expect(
      failsOn(
        withObjects({ typ: 'ruta', x: 0, y: 0, langd: 5, bredd: 5 }),
        'objekt.0.stil',
        'saknas',
      ),
    ).toBe(true);
  });

  it('prövar zonens och rutans mått mot den odokumenterade rektangelgränsen (0,5 m lägst)', () => {
    // ADR 0012 sätter ingen egen gräns för zon/ruta langd och bredd (utvecklarens eget val,
    // se kommentaren vid PLANSKISS_LIMITS.rektangel). Måtten prövas ändå mot ytan.
    expect(
      isValid(withObjects({ typ: 'zon', x: 0, y: 0, langd: 0.5, bredd: 0.5, monster: 'tom' })),
    ).toBe(true);
    expect(
      failsOn(
        withObjects({ typ: 'zon', x: 0, y: 0, langd: 0.4, bredd: 5, monster: 'tom' }),
        'objekt.0.langd',
        'mindre än 0,5 m',
      ),
    ).toBe(true);
    expect(
      failsOn(
        withObjects({ typ: 'ruta', x: 0, y: 0, langd: 5, bredd: 0.4, stil: 'streckad' }),
        'objekt.0.bredd',
        'mindre än 0,5 m',
      ),
    ).toBe(true);
  });

  it('godkänner en ruta vars mått precis når det största omradet plus marginalen på båda sidor', () => {
    // Med omrade 120x80 och ett objekt vid den tillåtna marginalen (-3) räcker langd/bredd upp
    // till 126/86 för att nå den bortre marginalen (120+3), som är gränsen i PLANSKISS_LIMITS.
    const input = sketch({
      omrade: { langd: 120, bredd: 80 },
      objekt: [{ typ: 'ruta', x: -3, y: -3, langd: 126, bredd: 86, stil: 'streckad' }],
    });
    expect(issues(input)).toEqual([]);
  });

  it('underkänner en ruta vars mått är större än den odokumenterade rektangelgränsen (126/86)', () => {
    const overLength = sketch({
      omrade: { langd: 120, bredd: 80 },
      objekt: [{ typ: 'ruta', x: -3, y: -3, langd: 126.1, bredd: 80, stil: 'streckad' }],
    });
    expect(failsOn(overLength, 'objekt.0.langd', 'större än')).toBe(true);
    const overWidth = sketch({
      omrade: { langd: 120, bredd: 80 },
      objekt: [{ typ: 'ruta', x: -3, y: -3, langd: 120, bredd: 86.1, stil: 'streckad' }],
    });
    expect(failsOn(overWidth, 'objekt.0.bredd', 'större än')).toBe(true);
  });

  it('underkänner ett dubblerat id och pekar på det andra objektet', () => {
    const input = withObjects(
      { id: 'kon-1', typ: 'kon', x: 1, y: 1 },
      { id: 'kon-1', typ: 'kon', x: 2, y: 1 },
    );
    expect(failsOn(input, 'objekt.1.id', 'används redan av objekt 0')).toBe(true);
  });

  it('prövar id som slug med 1–24 tecken', () => {
    const cone = (id: string) => withObjects({ id, typ: 'kon', x: 1, y: 1 });
    expect(isValid(cone('a'))).toBe(true);
    expect(isValid(cone('a'.repeat(24)))).toBe(true);
    expect(failsOn(cone('a'.repeat(25)), 'objekt.0.id', '1–24 tecken')).toBe(true);
    expect(failsOn(cone('Kon1'), 'objekt.0.id', 'gemena')).toBe(true);
    expect(failsOn(cone(''), 'objekt.0.id', 'gemena')).toBe(true);
  });
});

describe('etiketter (avsnitt 6)', () => {
  it('godkänner tre tecken på en spelare och underkänner fyra', () => {
    const player = (etikett: string) =>
      withObjects({ typ: 'spelare', x: 1, y: 1, lag: 'a', etikett });
    expect(isValid(player('MV'))).toBe(true);
    expect(isValid(player(''))).toBe(true);
    expect(failsOn(player('ABCD'), 'objekt.0.etikett', 'högst 3 tecken')).toBe(true);
  });

  it('godkänner 24 tecken på en zon och underkänner 25', () => {
    const zone = (etikett: string) =>
      withObjects({ typ: 'zon', x: 0, y: 0, langd: 5, bredd: 5, monster: 'tom', etikett });
    expect(isValid(zone('å'.repeat(24)))).toBe(true);
    expect(failsOn(zone('å'.repeat(25)), 'objekt.0.etikett', 'högst 24 tecken')).toBe(true);
  });

  it('underkänner styrtecken och osynliga formateringstecken i etiketter', () => {
    // Nolltecken, andra C0-styrtecken och Unicode-riktningsöverstyrning (kan användas för att
    // dölja text för en granskare, s.k. "Trojan Source"). Inget av dem är \p{L} eller \p{N}.
    for (const bad of ['a\u0000b', 'a\u0007b', 'a\u001fb', 'a‮b', 'a​b']) {
      expect(
        failsOn(
          withObjects({ typ: 'spelare', x: 1, y: 1, lag: 'a', etikett: bad }),
          'objekt.0.etikett',
          'får bara innehålla',
        ),
      ).toBe(true);
    }
  });

  it('underkänner tecken utanför den slutna teckenuppsättningen', () => {
    for (const bad of ['<b>', 'a&b', 'a"b', "a'b", 'a\\b', 'a\nb', 'a@b', 'a;b']) {
      expect(
        failsOn(
          withObjects({
            typ: 'ruta',
            x: 0,
            y: 0,
            langd: 5,
            bredd: 5,
            stil: 'streckad',
            etikett: bad,
          }),
          'objekt.0.etikett',
          'får bara innehålla',
        ),
      ).toBe(true);
    }
  });

  it('godkänner bokstäver med diakritiska tecken, siffror och de tillåtna skiljetecknen', () => {
    expect(LABEL_PATTERN.test('Zon 1: Å/Ä (Ö) +2 - 3.5, ok')).toBe(true);
  });

  it('underkänner en etikett skriven som tal och säger att den ska citeras', () => {
    expect(
      failsOn(
        withObjects({ typ: 'spelare', x: 1, y: 1, lag: 'a', etikett: 1 }),
        'objekt.0.etikett',
        'inom citattecken',
      ),
    ).toBe(true);
  });

  it('prövar också rörelsens och köns etikett', () => {
    const movement = {
      typ: 'passning',
      fran: { objekt: 'sp-1' },
      till: { x: 5, y: 5 },
      etikett: '<',
    };
    expect(failsOn(sketch({ rorelser: [movement] }), 'rorelser.0.etikett', 'får bara')).toBe(true);
    const skalning = {
      strategi: 'koer',
      koer: [{ vid: 'sp-1', riktning: 0, etikett: 'x'.repeat(25) }],
    };
    expect(failsOn(sketch({ skalning }), 'skalning.koer.0.etikett', 'högst 24 tecken')).toBe(true);
  });
});

describe('rörelser (avsnitt 3)', () => {
  const move = (overrides: Sketch = {}) => ({
    typ: 'passning',
    fran: { objekt: 'sp-1' },
    till: { x: 5, y: 5 },
    ...overrides,
  });

  it('underkänner ett okänt rörelsetyp', () => {
    expect(
      failsOn(sketch({ rorelser: [move({ typ: 'nick' })] }), 'rorelser.0.typ', 'passning, lopning'),
    ).toBe(true);
  });

  it('underkänner en rörelse som pekar på ett id som inte finns', () => {
    const input = sketch({ rorelser: [move({ till: { objekt: 'sp-9' } })] });
    expect(failsOn(input, 'rorelser.0.till.objekt', '"sp-9" finns inte i skissen')).toBe(true);
  });

  it('underkänner en punkt med bara x, och en punkt med både x, y och objekt', () => {
    expect(
      failsOn(
        sketch({ rorelser: [move({ fran: { x: 1 } })] }),
        'rorelser.0.fran',
        'båda koordinaterna',
      ),
    ).toBe(true);
    expect(
      failsOn(
        sketch({ rorelser: [move({ fran: { x: 1, y: 1, objekt: 'sp-1' } })] }),
        'rorelser.0.fran',
        'inte båda',
      ),
    ).toBe(true);
  });

  it('underkänner ett okänt fält i en punkt', () => {
    expect(
      failsOn(
        sketch({ rorelser: [move({ till: { x: 1, y: 1, z: 0 } })] }),
        'rorelser.0.till',
        'okänt fält',
      ),
    ).toBe(true);
  });

  it('godkänner två via-punkter och underkänner tre', () => {
    const via = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    expect(isValid(sketch({ rorelser: [move({ via: via.slice(0, 2) })] }))).toBe(true);
    expect(
      failsOn(sketch({ rorelser: [move({ via })] }), 'rorelser.0.via', 'högst 2 punkter'),
    ).toBe(true);
  });

  it('prövar ordning som heltal 1–9', () => {
    expect(isValid(sketch({ rorelser: [move({ ordning: 1 })] }))).toBe(true);
    expect(isValid(sketch({ rorelser: [move({ ordning: 9 })] }))).toBe(true);
    expect(
      failsOn(sketch({ rorelser: [move({ ordning: 0 })] }), 'rorelser.0.ordning', 'mindre än 1'),
    ).toBe(true);
    expect(
      failsOn(sketch({ rorelser: [move({ ordning: 10 })] }), 'rorelser.0.ordning', 'större än 9'),
    ).toBe(true);
  });

  it('godkänner en rörelse mellan två punkter utan hänvisning', () => {
    expect(isValid(sketch({ rorelser: [move({ fran: { x: 0, y: 0 } })] }))).toBe(true);
  });
});

describe('skalning (avsnitt 4)', () => {
  it('underkänner en okänd strategi och räknar upp de fyra', () => {
    expect(
      failsOn(
        sketch({ skalning: { strategi: 'allt' } }),
        'skalning.strategi',
        'fast, koer, platser eller parallella-ytor',
      ),
    ).toBe(true);
  });

  it('S-7: underkänner malvakt i en plats', () => {
    const skalning = { strategi: 'platser', platser: [{ x: 5, y: 5, lag: 'a', malvakt: true }] };
    expect(
      failsOn(sketch({ skalning }), 'skalning.platser.0', 'okänt fält i platsen: malvakt'),
    ).toBe(true);
  });

  it('underkänner fält som hör till en annan strategi', () => {
    expect(
      failsOn(sketch({ skalning: { strategi: 'fast', per_yta: 4 } }), 'skalning', 'okänt fält'),
    ).toBe(true);
    expect(
      failsOn(
        sketch({ skalning: { strategi: 'parallella-ytor', per_yta: 4, koer: [] } }),
        'skalning',
        'okänt fält',
      ),
    ).toBe(true);
  });

  it('kräver listan som strategin är uppkallad efter', () => {
    expect(failsOn(sketch({ skalning: { strategi: 'koer' } }), 'skalning.koer', 'saknas')).toBe(
      true,
    );
    expect(
      failsOn(sketch({ skalning: { strategi: 'platser' } }), 'skalning.platser', 'saknas'),
    ).toBe(true);
  });

  it('godkänner 6 köer och underkänner 7', () => {
    const koer = (count: number) =>
      Array.from({ length: count }, () => ({ vid: 'sp-1', riktning: 180 }));
    expect(isValid(sketch({ skalning: { strategi: 'koer', koer: koer(6) } }))).toBe(true);
    expect(
      failsOn(
        sketch({ skalning: { strategi: 'koer', koer: koer(7) } }),
        'skalning.koer',
        'högst 6 köer',
      ),
    ).toBe(true);
    expect(
      failsOn(sketch({ skalning: { strategi: 'koer', koer: [] } }), 'skalning.koer', 'minst 1 kö'),
    ).toBe(true);
  });

  it('godkänner 20 platser och underkänner 21', () => {
    const platser = (count: number) =>
      Array.from({ length: count }, (_, index) => ({
        x: index % 20,
        y: 1,
        lag: index % 2 ? 'b' : 'a',
      }));
    expect(isValid(sketch({ skalning: { strategi: 'platser', platser: platser(20) } }))).toBe(true);
    expect(
      failsOn(
        sketch({ skalning: { strategi: 'platser', platser: platser(21) } }),
        'skalning.platser',
        'högst 20 platser',
      ),
    ).toBe(true);
  });

  it('prövar köns avstånd mot 0,5–5 m och riktning mot 0–359', () => {
    const queue = (overrides: Sketch) =>
      sketch({
        skalning: { strategi: 'koer', koer: [{ vid: 'sp-1', riktning: 0, ...overrides }] },
      });
    expect(isValid(queue({ avstand: 0.5 }))).toBe(true);
    expect(isValid(queue({ avstand: 5 }))).toBe(true);
    expect(failsOn(queue({ avstand: 0.4 }), 'skalning.koer.0.avstand', 'mindre än 0,5 m')).toBe(
      true,
    );
    expect(failsOn(queue({ avstand: 5.1 }), 'skalning.koer.0.avstand', 'större än 5 m')).toBe(true);
    expect(failsOn(queue({ riktning: 360 }), 'skalning.koer.0.riktning', 'större än 359')).toBe(
      true,
    );
    expect(failsOn(queue({ riktning: undefined }), 'skalning.koer.0.riktning', 'saknas')).toBe(
      true,
    );
  });

  it('underkänner en kö som utgår från ett id som inte finns', () => {
    const skalning = { strategi: 'koer', koer: [{ vid: 'sp-9', riktning: 0 }] };
    expect(failsOn(sketch({ skalning }), 'skalning.koer.0.vid', '"sp-9", som inte finns')).toBe(
      true,
    );
  });

  it('underkänner en kö som utgår från något annat än en spelare', () => {
    const input = sketch({
      objekt: [
        { id: 'sp-1', typ: 'spelare', x: 2, y: 5, lag: 'a' },
        { id: 'kon-1', typ: 'kon', x: 1, y: 1 },
      ],
      skalning: { strategi: 'koer', koer: [{ vid: 'kon-1', riktning: 0 }] },
    });
    expect(failsOn(input, 'skalning.koer.0.vid', 'utgår från en spelare')).toBe(true);
  });

  it('prövar per_yta som heltal 2–20', () => {
    const parallel = (per_yta: number) =>
      sketch({ skalning: { strategi: 'parallella-ytor', per_yta } });
    expect(isValid(parallel(2))).toBe(true);
    expect(isValid(parallel(20))).toBe(true);
    expect(failsOn(parallel(1), 'skalning.per_yta', 'mindre än 2')).toBe(true);
    expect(failsOn(parallel(21), 'skalning.per_yta', 'större än 20')).toBe(true);
    expect(failsOn(parallel(2.5), 'skalning.per_yta', 'heltal')).toBe(true);
  });
});

describe('readPlanskiss: saknad, ogiltig och giltig skiss (berättelse 06, kriterium 2 och 3)', () => {
  it('ger saknas för undefined och null', () => {
    expect(readPlanskiss(undefined)).toEqual({ status: 'saknas' });
    expect(readPlanskiss(null)).toEqual({ status: 'saknas' });
  });

  it('ger ogiltig, inte saknas, för skadad data av alla slag', () => {
    for (const bad of [
      {},
      [],
      'skiss',
      0,
      false,
      { version: 1 },
      sketch({ objekt: [{ typ: 'hink' }] }),
    ]) {
      const result = readPlanskiss(bad);
      expect(result.status).toBe('ogiltig');
      expect(result.status === 'ogiltig' && result.issues.length > 0).toBe(true);
    }
  });

  it('ger giltig med den avrundade skissen', () => {
    const result = readPlanskiss(withObjects({ typ: 'kon', x: 1.26, y: 1 }));
    expect(result).toEqual({
      status: 'giltig',
      skiss: {
        version: 1,
        omrade: { langd: 20, bredd: 10 },
        objekt: [{ typ: 'kon', x: 1.3, y: 1 }],
      },
    });
  });

  it('kastar aldrig, inte heller för cykliska eller mycket djupa värden', () => {
    const cyclic: Record<string, unknown> = { version: 1 };
    cyclic.omrade = cyclic;
    expect(() => readPlanskiss(cyclic)).not.toThrow();
    expect(readPlanskiss(cyclic).status).toBe('ogiltig');
  });

  it('kastar aldrig för mycket djupt nästlade, icke-cykliska värden', () => {
    let deep: unknown = 'x';
    for (let i = 0; i < 20000; i += 1) {
      deep = { nested: deep };
    }
    // Fältet som inte är en sträng underkänns bara på typ, men får inte krascha byggnaden av
    // ett så djupt objekt eller valideringen av det.
    expect(() => readPlanskiss(sketch({ beskrivning: deep }))).not.toThrow();
    expect(readPlanskiss(sketch({ beskrivning: deep })).status).toBe('ogiltig');
  });

  it('kastar aldrig för __proto__ eller constructor som fältnamn, och förorenar aldrig Object.prototype', () => {
    const viaProto = JSON.parse(
      '{"version":1,"omrade":{"langd":20,"bredd":10},"objekt":[{"typ":"kon","x":1,"y":1}],"__proto__":{"fororenad":"ja"}}',
    );
    expect(() => readPlanskiss(viaProto)).not.toThrow();
    expect(readPlanskiss(viaProto).status).toBe('ogiltig');
    expect(({} as Record<string, unknown>).fororenad).toBeUndefined();

    const viaConstructor = withObjects({
      typ: 'kon',
      x: 1,
      y: 1,
      constructor: { prototype: { fororenad2: 'ja' } },
    });
    expect(() => readPlanskiss(viaConstructor)).not.toThrow();
    expect(readPlanskiss(viaConstructor).status).toBe('ogiltig');
    expect(({} as Record<string, unknown>).fororenad2).toBeUndefined();
  });

  it('godkänner -0 som koordinat, och underkänner det stora talet 1e308 som ADR 0012 avsnitt 6 nämner', () => {
    // -0 accepteras (arittmetiskt lika med 0) och skrivs oförändrat ut ur schemat. Det blir
    // "0" så fort skissen serialiseras till JSON (JSON.stringify(-0) === "0"), vilket är hur
    // den alltid lämnar minnet, så skillnaden är utan praktisk betydelse.
    const result = readPlanskiss(withObjects({ typ: 'kon', x: -0, y: 1 }));
    expect(result.status).toBe('giltig');
    expect(JSON.stringify(result)).toBe(
      JSON.stringify({
        status: 'giltig',
        skiss: {
          version: 1,
          omrade: { langd: 20, bredd: 10 },
          objekt: [{ typ: 'kon', x: 0, y: 1 }],
        },
      }),
    );
    expect(failsOn(withObjects({ typ: 'kon', x: 1e308, y: 1 }), 'objekt.0.x', 'större än')).toBe(
      true,
    );
  });

  it('förblir snabb för en skiss med ett mycket stort antal objekt (inte kvadratisk tidsåtgång)', () => {
    const huge = sketch({
      objekt: Array.from({ length: 50000 }, (_, index) => ({
        typ: 'kon',
        x: index % 20,
        y: 1,
      })),
    });
    // Date.now/performance.now och Node-globaler är förbjudna i src/regelmotor/ (ADR 0001,
    // ADR 0011), så tiden mäts inte explicit här. Testets eget timeout (Vitest, några
    // sekunder) fäller i stället om valideringen blir kvadratisk eller hänger sig.
    const result = readPlanskiss(huge);
    expect(result.status).toBe('ogiltig'); // fler än 60 objekt (avsnitt 2)
  });

  it('kastar aldrig för en fientlig getter som kastar när den läses (F1)', () => {
    const evil = {
      version: 1,
      get omrade() {
        throw new Error('fientlig getter');
      },
      objekt: [{ typ: 'kon', x: 1, y: 1 }],
    };
    expect(() => readPlanskiss(evil)).not.toThrow();
    expect(readPlanskiss(evil).status).toBe('ogiltig');
  });

  it('kastar aldrig för en Proxy vars has-fälla kastar (F1)', () => {
    const evil = new Proxy(
      { version: 1, omrade: { langd: 10, bredd: 10 }, objekt: [{ typ: 'kon', x: 1, y: 1 }] },
      {
        has() {
          throw new Error('fientlig proxy');
        },
      },
    );
    expect(() => readPlanskiss(evil)).not.toThrow();
    expect(readPlanskiss(evil).status).toBe('ogiltig');
  });
  it('kastar aldrig för typ eller strategi vars toString inte är en funktion (F1)', () => {
    const badType = JSON.parse('{"typ":{"toString":1},"x":1,"y":1}');
    const inObjects = withObjects(badType);
    expect(() => readPlanskiss(inObjects)).not.toThrow();
    expect(failsOn(inObjects, 'objekt.0.typ', 'typ ska vara text')).toBe(true);

    const badStrategy = sketch({ skalning: JSON.parse('{"strategi":{"toString":1}}') });
    expect(() => readPlanskiss(badStrategy)).not.toThrow();
    expect(failsOn(badStrategy, 'skalning.strategi', 'strategi ska vara text')).toBe(true);
  });

  it('kastar aldrig för en återkallad Proxy, var den än ligger (F1)', () => {
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();
    for (const input of [
      proxy,
      sketch({ omrade: proxy }),
      withObjects(proxy),
      withObjects({ typ: proxy, x: 1, y: 1 }),
      sketch({ skalning: { strategi: proxy } }),
    ]) {
      expect(() => readPlanskiss(input)).not.toThrow();
      expect(readPlanskiss(input).status).toBe('ogiltig');
    }
  });

  it('upprepar ett långt värde kortat till 40 tecken (F4)', () => {
    // Förkontrollen av storleken (F5) slår till först för så stor indata. Prova schemat direkt.
    const result = planskissSchema.safeParse(
      withObjects({ typ: 'x'.repeat(1_000_000), x: 1, y: 1 }),
    );
    const messages = result.error?.issues.map((issue) => issue.message) ?? [];
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain(`"${'x'.repeat(40)}…"`);
    expect(messages[0]?.length).toBeLessThan(200);
  });

  it('räknar upp högst 5 okända fält och skriver hur många till (F4)', () => {
    const extra = Object.fromEntries(
      Array.from({ length: 20_000 }, (_, index) => [`falt${index}`, 1]),
    );
    // Förkontrollen av storleken (F5) slår till först för så stor indata. Prova schemat direkt.
    const result = planskissSchema.safeParse(sketch(extra));
    const unknown = result.error?.issues.find((issue) => issue.message.includes('okänt fält'));
    expect(unknown?.message).toContain('falt0, falt1, falt2, falt3, falt4 och 19995 till');
    expect(unknown?.message.length).toBeLessThan(300);
  });

  it('underkänner för många objekt utan att parsa dem, med samma meddelande som schemat (F5)', () => {
    const huge = sketch({
      objekt: Array.from({ length: 300_000 }, () => ({ typ: 'kon', x: 1, y: 1 })),
    });
    expect(readPlanskiss(huge)).toEqual({
      status: 'ogiltig',
      issues: [{ path: 'objekt', message: 'objekt får ha högst 60 objekt' }],
    });
    const manyPlaces = sketch({
      skalning: {
        strategi: 'platser',
        platser: Array.from({ length: 21 }, () => ({ x: 1, y: 1, lag: 'a' })),
      },
    });
    expect(failsOn(manyPlaces, 'skalning.platser', 'högst 20 platser')).toBe(true);
  });

  it('underkänner skissdata på 8 192 tecken eller mer före parsningen (F5)', () => {
    const result = readPlanskiss(sketch({ okant: 'x'.repeat(8192) }));
    expect(result.status).toBe('ogiltig');
    expect(result.status === 'ogiltig' && result.issues).toEqual([
      { path: '', message: expect.stringContaining('Gränsen är 8192 byte') },
    ]);
  });

  it('kastar aldrig för slumpad och fientlig indata (fuzz, RK-10)', () => {
    // Deterministisk slump (LCG), eftersom Math.random är förbjuden i src/regelmotor/ (ADR 0011).
    let state = 20260929;
    const next = (n: number): number => {
      state = (state * 1103515245 + 12345) % 2147483648;
      return state % n;
    };
    const revoked = Proxy.revocable({}, {});
    revoked.revoke();
    const leaves: (() => unknown)[] = [
      () => undefined,
      () => null,
      () => true,
      () => 0,
      () => -0,
      () => Number.NaN,
      () => Number.POSITIVE_INFINITY,
      () => 1e308,
      () => 3.14159,
      () => -4,
      () => 10n,
      () => Symbol('s'),
      () => () => 1,
      () => '',
      () => 'spelare',
      () => 'kon',
      () => 'koer',
      () => 'a\u202Eb',
      () => 'x'.repeat(next(3) === 0 ? 10_000 : 30),
      () => ({ toString: 1 }),
      () => ({ valueOf: 1, toString: 1 }),
      () => Object.create(null),
      () => revoked.proxy,
      () =>
        new Proxy(
          {},
          {
            get() {
              throw new Error('get');
            },
            has() {
              throw new Error('has');
            },
            ownKeys() {
              throw new Error('ownKeys');
            },
          },
        ),
      () => ({
        get x() {
          throw new Error('getter');
        },
      }),
    ];
    const keys = [
      'version',
      'omrade',
      'objekt',
      'rorelser',
      'skalning',
      'beskrivning',
      'typ',
      'x',
      'y',
      'id',
      'lag',
      'etikett',
      'strategi',
      'koer',
      'platser',
      'vid',
      'fran',
      'till',
      '__proto__',
      'constructor',
    ];
    const randomValue = (depth: number): unknown => {
      const kind = next(depth > 3 ? 1 : 4);
      if (kind === 1) {
        return Array.from({ length: next(4) }, () => randomValue(depth + 1));
      }
      if (kind === 2) {
        const value: Record<string, unknown> = {};
        for (let i = next(4); i > 0; i -= 1) {
          value[keys[next(keys.length)] ?? 'x'] = randomValue(depth + 1);
        }
        return value;
      }
      return leaves[next(leaves.length)]?.();
    };
    /** Byter ut ett slumpat fält på slumpat djup i en giltig skiss. */
    const mutate = (): unknown => {
      const base = structuredClone(ADR_EXAMPLE) as Record<string, unknown>;
      let target: Record<string, unknown> = base;
      for (let depth = next(4); depth > 0; depth -= 1) {
        const children = Object.values(target).filter(
          (child): child is Record<string, unknown> => typeof child === 'object' && child !== null,
        );
        const child = children[next(Math.max(children.length, 1))];
        if (child === undefined) {
          break;
        }
        target = child;
      }
      const fields = Object.keys(target);
      const field =
        next(3) === 0 ? (keys[next(keys.length)] ?? 'x') : (fields[next(fields.length)] ?? 'x');
      target[field] = randomValue(0);
      return base;
    };

    const statuses = new Set<string>();
    for (let round = 0; round < 3000; round += 1) {
      const input = round % 3 === 0 ? randomValue(0) : mutate();
      let result: ReturnType<typeof readPlanskiss> | undefined;
      expect(() => {
        result = readPlanskiss(input);
      }).not.toThrow();
      expect(['saknas', 'ogiltig', 'giltig']).toContain(result?.status);
      statuses.add(result?.status ?? '');
      if (result?.status === 'ogiltig') {
        for (const issue of result.issues) {
          expect(typeof issue.path).toBe('string');
          expect(issue.message.length).toBeLessThan(1000);
        }
      }
    }
    // Slingan ska ha nått alla tre utfallen, annars prövar den för lite.
    expect([...statuses].sort()).toEqual(['giltig', 'ogiltig', 'saknas']);
  });
});

describe('planskissTexts', () => {
  it('räknar upp beskrivningen och varje etikett med sin sökväg', () => {
    const parsed = planskissSchema.parse(
      sketch({
        beskrivning: 'En kvadrat.',
        objekt: [
          { id: 'sp-1', typ: 'spelare', x: 2, y: 5, lag: 'a', etikett: 'A' },
          { typ: 'kon', x: 1, y: 1 },
          { typ: 'zon', x: 0, y: 0, langd: 5, bredd: 5, monster: 'tom', etikett: 'Zon' },
        ],
        rorelser: [
          { typ: 'lopning', fran: { objekt: 'sp-1' }, till: { x: 5, y: 5 }, etikett: 'Djupled' },
        ],
        skalning: {
          strategi: 'koer',
          koer: [{ vid: 'sp-1', riktning: 90, etikett: 'Vilande, byter in' }],
        },
      }),
    );
    expect(planskissTexts(parsed)).toEqual([
      { path: ['beskrivning'], text: 'En kvadrat.' },
      { path: ['objekt', 0, 'etikett'], text: 'A' },
      { path: ['objekt', 2, 'etikett'], text: 'Zon' },
      { path: ['rorelser', 0, 'etikett'], text: 'Djupled' },
      { path: ['skalning', 'koer', 0, 'etikett'], text: 'Vilande, byter in' },
    ]);
  });
});

describe('ändringarna efter säkerhetsgranskningen och ADR 0018', () => {
  const player = (etikett: string) =>
    withObjects({ typ: 'spelare', x: 1, y: 1, lag: 'a', etikett });
  const leader = (etikett: string) => withObjects({ typ: 'ledare', x: 1, y: 1, etikett });
  const zone = (etikett: string) =>
    withObjects({ typ: 'zon', x: 0, y: 0, langd: 5, bredd: 5, monster: 'tom', etikett });

  it('godkänner versaler och siffror som kort etikett (ADR 0018, beslut 2)', () => {
    for (const good of ['', 'A', 'F', 'MV', 'L', '1', '12', 'Ö', 'ALI']) {
      expect(isValid(player(good))).toBe(true);
      expect(isValid(leader(good))).toBe(true);
    }
  });

  it('underkänner gemener, mellanslag och skiljetecken i en kort etikett (ADR 0018, beslut 2)', () => {
    for (const bad of ['Ali', 'a', 'mv', 'A 1', 'A.', 'A-1', 'A,B']) {
      expect(failsOn(player(bad), 'objekt.0.etikett', 'versaler och siffror')).toBe(true);
      expect(failsOn(leader(bad), 'objekt.0.etikett', 'versaler och siffror')).toBe(true);
    }
    expect(SHORT_LABEL_PATTERN.test('Ali')).toBe(false);
  });

  it('godkänner komma i en lång etikett och ingen fast etikett för udda antal (beslut 1 och 4)', () => {
    expect(isValid(zone('Rullar in bollar, byter'))).toBe(true);
    const koer = [{ vid: 'sp-1', riktning: 90, etikett: 'Nästa målvakt' }];
    expect(isValid(sketch({ skalning: { strategi: 'koer', koer } }))).toBe(true);
  });

  it('normaliserar etiketter till NFC innan mönstret prövas (F6)', () => {
    const decomposed = 'Pa\u0301se'; // "Páse" med kombinerande accent
    const result = readPlanskiss(zone(decomposed));
    expect(result.status).toBe('giltig');
    const item = result.status === 'giltig' ? result.skiss.objekt[0] : undefined;
    expect(item !== undefined && 'etikett' in item && item.etikett).toBe('Páse');
    expect(isValid(player('E\u0301'))).toBe(true);
  });

  it('underkänner styrtecken och bidi-tecken i beskrivning (F6)', () => {
    for (const bad of [
      'rad ett\nrad två',
      'a\tb',
      'a\u0000b',
      'a\u007fb',
      'a\u202Ab',
      'a\u202Eb',
      'a\u2066b',
      'a\u2069b',
    ]) {
      expect(failsOn(sketch({ beskrivning: bad }), 'beskrivning', 'styrtecken')).toBe(true);
    }
    expect(isValid(sketch({ beskrivning: 'En kvadrat 15 x 15 m, två lag – A och B.' }))).toBe(true);
    expect(FORBIDDEN_TEXT_CHARACTERS.test('vanlig text')).toBe(false);
  });

  it('godkänner lag neutral på en plats, för jokrar', () => {
    const skalning = { strategi: 'platser', platser: [{ x: 5, y: 5, lag: 'neutral' }] };
    expect(isValid(sketch({ skalning }))).toBe(true);
  });

  it('Planskissdata går inte att skapa utan schemat (F8)', () => {
    // @ts-expect-error: ett vanligt objekt saknar märket och är ingen Planskissdata.
    const fake: Planskissdata = { version: 1, omrade: { langd: 20, bredd: 10 }, objekt: [] };
    expect(readPlanskiss(fake).status).toBe('ogiltig');
  });
});
