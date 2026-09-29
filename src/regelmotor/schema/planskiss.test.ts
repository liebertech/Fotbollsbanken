/**
 * Tester för planskissens schema (ADR 0012 avsnitt 1–4, 6 och fallen i avsnitt 8, *Validering*).
 *
 * Varje underkänt fall kontrollerar både fältet (sökvägen) och att meddelandet är svenska
 * ord som övningsförfattaren kan agera på, eftersom felet visas rakt av i
 * `npm run validera:ovningar`.
 */
import { describe, expect, it } from 'vitest';
import {
  LABEL_PATTERN,
  PLANSKISS_LIMITS,
  planskissSchema,
  planskissTexts,
  readPlanskiss,
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

  it.fails(
    'BUGG: en fientlig getter som kastar när den läses får läsPlanskiss att kasta (bryter "kastar aldrig")',
    () => {
      const evil = {
        version: 1,
        get omrade() {
          throw new Error('fientlig getter');
        },
        objekt: [{ typ: 'kon', x: 1, y: 1 }],
      };
      expect(() => readPlanskiss(evil)).not.toThrow();
    },
  );

  it.fails(
    'BUGG: en Proxy vars has-fälla kastar får läsPlanskiss att kasta (bryter "kastar aldrig")',
    () => {
      const evil = new Proxy(
        { version: 1, omrade: { langd: 10, bredd: 10 }, objekt: [{ typ: 'kon', x: 1, y: 1 }] },
        {
          has() {
            throw new Error('fientlig proxy');
          },
        },
      );
      expect(() => readPlanskiss(evil)).not.toThrow();
    },
  );
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
