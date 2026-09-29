/**
 * Planskissens schema: formatet för fältet `planskiss` i en övning (ADR 0012 avsnitt 1–4 och 6).
 *
 * Schemat ligger här och inte i src/planskiss/, eftersom övningsschemat i ovning.ts importerar
 * det (ADR 0010 avsnitt 1) och regelmotorn inte får bero på ritmotorn (ADR 0001, regeln i
 * eslint.config.js). Beroendet går alltså åt ett håll: ritmotorn i src/planskiss/ läser
 * formatet härifrån. Filen ägs av planskissutvecklaren.
 *
 * Säkerhetskraven i S-07 styr formen:
 * - varje objekt är `strict`, så att ett okänt fält underkänner skissen i stället för att
 *   ignoreras,
 * - former och rörelser är slutna listor (`discriminatedUnion` på `typ`),
 * - bara primitiva värden och fasta punkter `{ x, y }`, inga fria nycklar,
 * - varje tal har en undre och en övre gräns, och `NaN` och `Infinity` underkänns,
 * - varje text har en längdgräns, och etiketterna en sluten teckenuppsättning.
 *
 * Felmeddelandena är på svenska och skrivs för övningsförfattaren. Sökvägen till fältet
 * följer med i Zods `path`, så valideringsskriptet visar till exempel
 * `planskiss.objekt.3.etikett – etiketten får vara högst 3 tecken`.
 *
 * Filen importerar inget ur Node och kan köras i klienten, där skissen valideras igen när
 * den läses (ADR 0012 avsnitt 6, `readPlanskiss` nedan).
 */
import { z } from 'zod';
import { GAME_FORMATS } from '../keys.ts';

/** Formatets version. Samma fält som ADR 0010 reserverar. */
export const PLANSKISS_VERSION = 1;

/** Gränserna i ADR 0012. Varje värde har sin källa i avsnittet som står vid det. */
export const PLANSKISS_LIMITS = {
  /** Avsnitt 2: `omrade` i meter. Samma gränser som övningens `yta`. */
  omrade: { langd: { min: 5, max: 120 }, bredd: { min: 5, max: 80 } },
  /** Avsnitt 1: objekt får ligga upp till 3 m utanför ytan. */
  marginal: 3,
  /** Avsnitt 2 och 6. */
  beskrivning: 300,
  objekt: { min: 1, max: 60 },
  rorelser: 30,
  /** Avsnitt 4, S-5 och avsnitt 6: högst 40 spelarsymboler. Gäller basskissen. */
  spelare: 40,
  /** Avsnitt 6: `spelare.etikett` och `ledare.etikett`. */
  kortEtikett: 3,
  /** Avsnitt 6: `zon`, `ruta`, rörelser och köer. */
  langEtikett: 24,
  /** Avsnitt 2: `id` är en slug, 1–24 tecken. */
  idPattern: /^[a-z0-9-]{1,24}$/,
  /** Avsnitt 2 och 4: grader, där 0 är positiv `x`. */
  riktning: { min: 0, max: 359 },
  /** Avsnitt 2: `mal.bredd` när `storlek` är `eget`. */
  malBredd: { min: 0.5, max: 8 },
  /**
   * `zon` och `ruta`: ADR 0012 anger inga gränser för `langd` och `bredd`. Den undre är
   * samma som minsta målbredden, den övre är den största ytan plus marginalen på båda sidor.
   * Att rektangeln ryms inom ytan prövas för sig, mot skissens `omrade`.
   */
  rektangel: { min: 0.5, langd: 126, bredd: 86 },
  /** Avsnitt 3. */
  via: 2,
  ordning: { min: 1, max: 9 },
  /** Avsnitt 4. */
  koer: { min: 1, max: 6 },
  avstand: { min: 0.5, max: 5 },
  platser: { min: 1, max: 20 },
  perYta: { min: 2, max: 20 },
} as const;

/**
 * Teckenuppsättningen i etiketterna (ADR 0012 avsnitt 6): bokstäver, siffror, mellanslag och
 * `. : - / + ( )`.
 *
 * **Kommatecknet är ett tillägg till ADR:ns mönster.** ADR 0012 avsnitt 4 föreskriver
 * etiketten "Vilande, byter in" för den extra spelaren vid udda antal, och den går inte att
 * skriva utan komma. Kommat är inget tecken med betydelse i markup, så tillägget försvagar
 * inte skyddet. Se rapporten till K4.
 */
export const LABEL_PATTERN = /^[\p{L}\p{N} .,:\-/+()]*$/u;

const MAX_X = PLANSKISS_LIMITS.omrade.langd.max + PLANSKISS_LIMITS.marginal;
const MAX_Y = PLANSKISS_LIMITS.omrade.bredd.max + PLANSKISS_LIMITS.marginal;
const MIN_COORD = -PLANSKISS_LIMITS.marginal;

/** Talet med decimalkomma, som i löptexten. */
function sv(value: number): string {
  return String(value).replace('.', ',');
}

/** "a, b eller c". */
function orList(values: readonly string[]): string {
  return values.length < 2
    ? values.join('')
    : `${values.slice(0, -1).join(', ')} eller ${values.slice(-1).join('')}`;
}

/** Avsnitt 1: värden avrundas till närmaste decimeter vid validering. */
function roundToDecimetre(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Felet för ett fält som saknas eller har fel typ. */
function typeError(label: string, expected: string) {
  return (issue: { input?: unknown }) =>
    issue.input === undefined ? `${label} saknas` : `${label} ska vara ${expected}`;
}

/** Ett mått eller en koordinat i meter, avrundad till en decimal. */
function meters(label: string, min: number, max: number) {
  return z
    .number({ error: typeError(label, 'ett tal i meter') })
    .min(min, `${label} får inte vara mindre än ${sv(min)} m`)
    .max(max, `${label} får inte vara större än ${sv(max)} m`)
    .transform(roundToDecimetre);
}

function integer(label: string, min: number, max: number) {
  return z
    .number({ error: typeError(label, 'ett heltal') })
    .int(`${label} ska vara ett heltal`)
    .min(min, `${label} får inte vara mindre än ${min}`)
    .max(max, `${label} får inte vara större än ${max}`);
}

function oneOf<const T extends readonly [string, ...string[]]>(values: T, label: string) {
  return z.enum(values, { error: typeError(label, orList(values)) });
}

function label(max: number) {
  return z
    .string({
      error: typeError('etiketten', 'text. Skriv siffror inom citattecken, till exempel "1"'),
    })
    .max(max, `etiketten får vara högst ${max} tecken`)
    .regex(
      LABEL_PATTERN,
      'etiketten får bara innehålla bokstäver, siffror, mellanslag och tecknen . , : - / + ( )',
    );
}

const idSchema = z
  .string({ error: typeError('id', 'text') })
  .regex(
    PLANSKISS_LIMITS.idPattern,
    'id ska vara 1–24 tecken, bara gemena a–z, siffror och bindestreck',
  );

/**
 * Ett objekt där okända fält underkänns (S-07). Meddelandet räknar upp de tillåtna fälten,
 * så att ett stavfel går att rätta utan att läsa ADR:n.
 */
function strict<const T extends z.ZodRawShape>(shape: T, what: string) {
  const allowed = Object.keys(shape).join(', ');
  return z.strictObject(shape, {
    error: (issue) => {
      if (issue.code === 'unrecognized_keys') {
        return `okänt fält i ${what}: ${issue.keys.join(', ')}. Tillåtna fält är ${allowed}`;
      }
      if (issue.code === 'invalid_type') {
        return issue.input === undefined ? `${what} saknas` : `${what} ska vara ett objekt`;
      }
      return undefined;
    },
  });
}

const xSchema = meters('x', MIN_COORD, MAX_X);
const ySchema = meters('y', MIN_COORD, MAX_Y);

/** En fast punkt `{ x, y }` i meter. */
const pointSchema = strict({ x: xSchema, y: ySchema }, 'punkten');

export const OBJECT_TYPES = [
  'spelare',
  'ledare',
  'kon',
  'markering',
  'mal',
  'boll',
  'zon',
  'ruta',
] as const;

export const TEAMS = ['a', 'b', 'neutral'] as const;
export const MARKING_FORMS = ['platta', 'prick', 'linje'] as const;
export const GOAL_SIZES = [...GAME_FORMATS, 'smamal', 'eget'] as const;
export const GOAL_DIRECTIONS = ['hoger', 'vanster', 'upp', 'ner'] as const;
export const ZONE_PATTERNS = ['diagonal', 'prickar', 'tom'] as const;
export const BOX_STYLES = ['heldragen', 'streckad'] as const;
export const MOVEMENT_TYPES = ['passning', 'lopning', 'dribbling', 'skott'] as const;
export const SCALING_STRATEGIES = ['fast', 'koer', 'platser', 'parallella-ytor'] as const;

/** Fälten som alla objekt har (avsnitt 2). `id` krävs bara när något pekar på objektet. */
const common = { id: idSchema.optional(), x: xSchema, y: ySchema };

const playerSchema = strict(
  {
    typ: z.literal('spelare'),
    ...common,
    lag: oneOf(TEAMS, 'lag'),
    malvakt: z.boolean({ error: typeError('malvakt', 'true eller false') }).optional(),
    etikett: label(PLANSKISS_LIMITS.kortEtikett).optional(),
    riktning: integer(
      'riktning',
      PLANSKISS_LIMITS.riktning.min,
      PLANSKISS_LIMITS.riktning.max,
    ).optional(),
  },
  'spelaren',
);

const leaderSchema = strict(
  { typ: z.literal('ledare'), ...common, etikett: label(PLANSKISS_LIMITS.kortEtikett).optional() },
  'ledaren',
);

const coneSchema = strict({ typ: z.literal('kon'), ...common }, 'konen');

const ballSchema = strict({ typ: z.literal('boll'), ...common }, 'bollen');

const markingSchema = strict(
  {
    typ: z.literal('markering'),
    ...common,
    form: oneOf(MARKING_FORMS, 'form'),
    till: pointSchema.optional(),
  },
  'markeringen',
).superRefine((value, ctx) => {
  if (value.form === 'linje' && value.till === undefined) {
    ctx.addIssue({
      code: 'custom',
      path: ['till'],
      message: 'till krävs när form är linje: linjens andra ände som { x, y }',
    });
  }
  if (value.form !== 'linje' && value.till !== undefined) {
    ctx.addIssue({
      code: 'custom',
      path: ['till'],
      message: `till får bara anges när form är linje, inte ${value.form}`,
    });
  }
});

const goalSchema = strict(
  {
    typ: z.literal('mal'),
    ...common,
    storlek: oneOf(GOAL_SIZES, 'storlek'),
    bredd: meters('bredd', PLANSKISS_LIMITS.malBredd.min, PLANSKISS_LIMITS.malBredd.max).optional(),
    riktning: oneOf(GOAL_DIRECTIONS, 'riktning'),
  },
  'målet',
).superRefine((value, ctx) => {
  if (value.storlek === 'eget' && value.bredd === undefined) {
    ctx.addIssue({
      code: 'custom',
      path: ['bredd'],
      message: 'bredd krävs när storlek är eget',
    });
  }
  if (value.storlek !== 'eget' && value.bredd !== undefined) {
    ctx.addIssue({
      code: 'custom',
      path: ['bredd'],
      message: `bredd får bara anges när storlek är eget. Storleken ${value.storlek} har en fast bredd`,
    });
  }
});

const rectangleSize = {
  langd: meters('langd', PLANSKISS_LIMITS.rektangel.min, PLANSKISS_LIMITS.rektangel.langd),
  bredd: meters('bredd', PLANSKISS_LIMITS.rektangel.min, PLANSKISS_LIMITS.rektangel.bredd),
};

const zoneSchema = strict(
  {
    typ: z.literal('zon'),
    ...common,
    ...rectangleSize,
    monster: oneOf(ZONE_PATTERNS, 'monster'),
    etikett: label(PLANSKISS_LIMITS.langEtikett).optional(),
  },
  'zonen',
);

const boxSchema = strict(
  {
    typ: z.literal('ruta'),
    ...common,
    ...rectangleSize,
    stil: oneOf(BOX_STYLES, 'stil'),
    etikett: label(PLANSKISS_LIMITS.langEtikett).optional(),
  },
  'rutan',
);

/** Felet när `typ` saknas eller inte finns i den slutna listan. */
function unionError(field: string, values: readonly string[], what: string) {
  return (issue: { code?: string; input?: unknown }) => {
    if (issue.code === 'invalid_type' || typeof issue.input !== 'object' || issue.input === null) {
      return `${what} ska vara ett objekt med fältet ${field}`;
    }
    const given = (issue.input as Record<string, unknown>)[field];
    return given === undefined
      ? `${field} saknas. Välj ${orList(values)}`
      : `${field} "${String(given)}" finns inte. Välj ${orList(values)}`;
  };
}

const objectSchema = z.discriminatedUnion(
  'typ',
  [
    playerSchema,
    leaderSchema,
    coneSchema,
    markingSchema,
    goalSchema,
    ballSchema,
    zoneSchema,
    boxSchema,
  ],
  { error: unionError('typ', OBJECT_TYPES, 'objektet') },
);

/**
 * Rörelsens start eller slut: en punkt `{ x, y }` eller en hänvisning `{ objekt: "<id>" }`
 * (avsnitt 3). Fälten prövas för sig och slås sedan ihop, så att felet pekar på det fält som
 * är fel i stället för att bli ett allmänt "passar ingen variant".
 */
const endpointSchema = strict(
  { x: xSchema.optional(), y: ySchema.optional(), objekt: idSchema.optional() },
  'punkten',
)
  .superRefine((value, ctx) => {
    const hasPoint = value.x !== undefined || value.y !== undefined;
    if (value.objekt !== undefined && hasPoint) {
      ctx.addIssue({
        code: 'custom',
        message: 'ange antingen { x, y } eller { objekt: "<id>" }, inte båda',
      });
    } else if (value.objekt === undefined && (value.x === undefined || value.y === undefined)) {
      ctx.addIssue({
        code: 'custom',
        message: 'ange { x, y } med båda koordinaterna, eller { objekt: "<id>" }',
      });
    }
  })
  .transform((value): { objekt: string } | { x: number; y: number } =>
    value.objekt !== undefined ? { objekt: value.objekt } : { x: value.x ?? 0, y: value.y ?? 0 },
  );

function movementVariant<const T extends (typeof MOVEMENT_TYPES)[number]>(typ: T) {
  return strict(
    {
      typ: z.literal(typ),
      fran: endpointSchema,
      till: endpointSchema,
      via: z
        .array(pointSchema, { error: typeError('via', 'en lista med punkter') })
        .max(PLANSKISS_LIMITS.via, `via får ha högst ${PLANSKISS_LIMITS.via} punkter`)
        .optional(),
      ordning: integer(
        'ordning',
        PLANSKISS_LIMITS.ordning.min,
        PLANSKISS_LIMITS.ordning.max,
      ).optional(),
      etikett: label(PLANSKISS_LIMITS.langEtikett).optional(),
    },
    'rörelsen',
  );
}

const movementSchema = z.discriminatedUnion(
  'typ',
  [
    movementVariant('passning'),
    movementVariant('lopning'),
    movementVariant('dribbling'),
    movementVariant('skott'),
  ],
  { error: unionError('typ', MOVEMENT_TYPES, 'rörelsen') },
);

/** En kö (avsnitt 4). `avstand` har förvalet 1,5 m, som ritmotorn sätter. */
const queueSchema = strict(
  {
    vid: idSchema,
    riktning: integer('riktning', PLANSKISS_LIMITS.riktning.min, PLANSKISS_LIMITS.riktning.max),
    avstand: meters(
      'avstand',
      PLANSKISS_LIMITS.avstand.min,
      PLANSKISS_LIMITS.avstand.max,
    ).optional(),
    etikett: label(PLANSKISS_LIMITS.langEtikett).optional(),
  },
  'kön',
);

/** En plats (avsnitt 4). Fältet `malvakt` finns inte, så en plats kan aldrig bli målvakt (S-7). */
const placeSchema = strict({ x: xSchema, y: ySchema, lag: oneOf(TEAMS, 'lag') }, 'platsen');

const queuesSchema = z
  .array(queueSchema, { error: typeError('koer', 'en lista med köer') })
  .min(PLANSKISS_LIMITS.koer.min, `koer ska ha minst ${PLANSKISS_LIMITS.koer.min} kö`)
  .max(PLANSKISS_LIMITS.koer.max, `koer får ha högst ${PLANSKISS_LIMITS.koer.max} köer`);

const placesSchema = z
  .array(placeSchema, { error: typeError('platser', 'en lista med platser') })
  .min(PLANSKISS_LIMITS.platser.min, `platser ska ha minst ${PLANSKISS_LIMITS.platser.min} plats`)
  .max(
    PLANSKISS_LIMITS.platser.max,
    `platser får ha högst ${PLANSKISS_LIMITS.platser.max} platser`,
  );

/**
 * Skalningen (avsnitt 4). `koer` och `platser` får kombineras: då fylls platserna först,
 * därefter köerna. ADR:n säger inte vilken strategi en kombination anges med, så båda
 * strategierna tillåter den andra listan som tillägg. Se rapporten till K4.
 */
const scalingSchema = z.discriminatedUnion(
  'strategi',
  [
    strict({ strategi: z.literal('fast') }, 'skalningen'),
    strict(
      { strategi: z.literal('koer'), koer: queuesSchema, platser: placesSchema.optional() },
      'skalningen',
    ),
    strict(
      { strategi: z.literal('platser'), platser: placesSchema, koer: queuesSchema.optional() },
      'skalningen',
    ),
    strict(
      {
        strategi: z.literal('parallella-ytor'),
        per_yta: integer('per_yta', PLANSKISS_LIMITS.perYta.min, PLANSKISS_LIMITS.perYta.max),
      },
      'skalningen',
    ),
  ],
  { error: unionError('strategi', SCALING_STRATEGIES, 'skalningen') },
);

type Path = (string | number)[];

function addIssue(ctx: z.RefinementCtx, path: Path, message: string): void {
  ctx.addIssue({ code: 'custom', path, message });
}

/**
 * Kontrollerna som gäller hela skissen: unika id:n, hänvisningar som pekar rätt, taket för
 * spelarsymboler och att allt ligger inom ytan plus marginalen (avsnitt 1, 2, 3, 4 och 6).
 */
function checkSketch(sketch: z.output<typeof sketchObject>, ctx: z.RefinementCtx): void {
  const { langd, bredd } = sketch.omrade;
  const margin = PLANSKISS_LIMITS.marginal;
  const maxX = langd + margin;
  const maxY = bredd + margin;

  const checkX = (path: Path, value: number, what = 'x') => {
    if (value < -margin || value > maxX) {
      addIssue(
        ctx,
        path,
        `${what} = ${sv(value)} ligger utanför ytan. Tillåtet är ${sv(-margin)} till ${sv(maxX)} m: omrade.langd ${sv(langd)} m och ${margin} m marginal`,
      );
    }
  };
  const checkY = (path: Path, value: number, what = 'y') => {
    if (value < -margin || value > maxY) {
      addIssue(
        ctx,
        path,
        `${what} = ${sv(value)} ligger utanför ytan. Tillåtet är ${sv(-margin)} till ${sv(maxY)} m: omrade.bredd ${sv(bredd)} m och ${margin} m marginal`,
      );
    }
  };
  const checkPoint = (path: Path, point: { x: number; y: number }) => {
    checkX([...path, 'x'], point.x);
    checkY([...path, 'y'], point.y);
  };

  const byId = new Map<string, { index: number; typ: string }>();
  let players = 0;

  for (const [index, item] of sketch.objekt.entries()) {
    const path: Path = ['objekt', index];

    if (item.id !== undefined) {
      const previous = byId.get(item.id);
      if (previous !== undefined) {
        addIssue(
          ctx,
          [...path, 'id'],
          `id "${item.id}" används redan av objekt ${previous.index}. Ett id ska vara unikt i skissen`,
        );
      } else {
        byId.set(item.id, { index, typ: item.typ });
      }
    }

    checkPoint(path, item);

    if (item.typ === 'spelare') {
      players += 1;
    }
    if (item.typ === 'markering' && item.till !== undefined) {
      checkPoint([...path, 'till'], item.till);
    }
    if (item.typ === 'zon' || item.typ === 'ruta') {
      // Rektangelns bortre hörn ska också ligga inom ytan plus marginalen.
      checkX([...path, 'langd'], roundToDecimetre(item.x + item.langd), 'x + langd');
      checkY([...path, 'bredd'], roundToDecimetre(item.y + item.bredd), 'y + bredd');
    }
  }

  if (players > PLANSKISS_LIMITS.spelare) {
    addIssue(
      ctx,
      ['objekt'],
      `skissen har ${players} spelare. Högst ${PLANSKISS_LIMITS.spelare} spelarsymboler ritas (ADR 0012, S-5)`,
    );
  }

  const checkEndpoint = (path: Path, endpoint: { objekt: string } | { x: number; y: number }) => {
    if ('objekt' in endpoint) {
      if (!byId.has(endpoint.objekt)) {
        addIssue(
          ctx,
          [...path, 'objekt'],
          `objekt "${endpoint.objekt}" finns inte i skissen. Ge objektet det id:t, eller rätta stavningen`,
        );
      }
    } else {
      checkPoint(path, endpoint);
    }
  };

  for (const [index, movement] of (sketch.rorelser ?? []).entries()) {
    const path: Path = ['rorelser', index];
    checkEndpoint([...path, 'fran'], movement.fran);
    checkEndpoint([...path, 'till'], movement.till);
    movement.via?.forEach((point, viaIndex) => checkPoint([...path, 'via', viaIndex], point));
  }

  const scaling = sketch.skalning;
  if (
    scaling !== undefined &&
    scaling.strategi !== 'fast' &&
    scaling.strategi !== 'parallella-ytor'
  ) {
    scaling.koer?.forEach((queue, index) => {
      const target = byId.get(queue.vid);
      const path: Path = ['skalning', 'koer', index, 'vid'];
      if (target === undefined) {
        addIssue(ctx, path, `vid pekar på "${queue.vid}", som inte finns i skissen`);
      } else if (target.typ !== 'spelare') {
        // Köspelaren ärver laget från startobjektet (avsnitt 4), och bara en spelare har ett lag.
        addIssue(
          ctx,
          path,
          `vid pekar på en ${target.typ}. En kö utgår från en spelare, eftersom köspelarna ärver spelarens lag`,
        );
      }
    });
    scaling.platser?.forEach((place, index) => checkPoint(['skalning', 'platser', index], place));
  }
}

const sketchObject = strict(
  {
    version: z.literal(PLANSKISS_VERSION, {
      error: typeError('version', String(PLANSKISS_VERSION)),
    }),
    omrade: strict(
      {
        langd: meters(
          'langd',
          PLANSKISS_LIMITS.omrade.langd.min,
          PLANSKISS_LIMITS.omrade.langd.max,
        ),
        bredd: meters(
          'bredd',
          PLANSKISS_LIMITS.omrade.bredd.min,
          PLANSKISS_LIMITS.omrade.bredd.max,
        ),
      },
      'omrade',
    ),
    beskrivning: z
      .string({ error: typeError('beskrivning', 'text') })
      .trim()
      .max(
        PLANSKISS_LIMITS.beskrivning,
        `beskrivning får vara högst ${PLANSKISS_LIMITS.beskrivning} tecken`,
      )
      .optional(),
    objekt: z
      .array(objectSchema, { error: typeError('objekt', 'en lista med objekt') })
      .min(PLANSKISS_LIMITS.objekt.min, 'objekt ska ha minst ett objekt')
      .max(
        PLANSKISS_LIMITS.objekt.max,
        `objekt får ha högst ${PLANSKISS_LIMITS.objekt.max} objekt`,
      ),
    rorelser: z
      .array(movementSchema, { error: typeError('rorelser', 'en lista med rörelser') })
      .max(PLANSKISS_LIMITS.rorelser, `rorelser får ha högst ${PLANSKISS_LIMITS.rorelser} rörelser`)
      .optional(),
    skalning: scalingSchema.optional(),
  },
  'planskissen',
);

/** Schemat för fältet `planskiss`. Används vid sparande och vid läsning (ADR 0012 avsnitt 6). */
export const planskissSchema = sketchObject.superRefine(checkSketch);

/** Skissdata som den ser ut efter validering. Ritmotorn tar bara emot den här typen. */
export type Planskissdata = z.output<typeof planskissSchema>;

/** Skissdata som den skrivs i en övningsfil, före avrundningen. */
export type PlanskissInput = z.input<typeof planskissSchema>;

/**
 * Skissens fritexter med sin sökväg inom skissen. Övningsschemat kör dem genom samma
 * e-postkontroll som övningens övriga textfält.
 *
 * @sakerhet S-21
 * @sakerhet S-32
 */
export function planskissTexts(sketch: Planskissdata): { path: Path; text: string }[] {
  const texts: { path: Path; text: string }[] = [];
  const add = (path: Path, text: string | undefined) => {
    if (text !== undefined && text.length > 0) {
      texts.push({ path, text });
    }
  };
  add(['beskrivning'], sketch.beskrivning);
  sketch.objekt.forEach((item, index) => {
    if ('etikett' in item) {
      add(['objekt', index, 'etikett'], item.etikett);
    }
  });
  sketch.rorelser?.forEach((movement, index) =>
    add(['rorelser', index, 'etikett'], movement.etikett),
  );
  const scaling = sketch.skalning;
  if (scaling !== undefined && 'koer' in scaling) {
    scaling.koer?.forEach((queue, index) =>
      add(['skalning', 'koer', index, 'etikett'], queue.etikett),
    );
  }
  return texts;
}

/** Ett valideringsfel med sökvägen inom skissen, till exempel `objekt.3.etikett`. */
export interface PlanskissIssue {
  path: string;
  message: string;
}

/**
 * Utfallet när skissdata läses. De tre lägena visas olika (ADR 0012 avsnitt 7, berättelse 06
 * kriterium 2 och 3): `saknas` ger "Planskiss saknas", `ogiltig` ger "Planskissen kunde inte
 * visas", och bara `giltig` når ritmotorn.
 */
export type PlanskissReadResult =
  | { status: 'saknas' }
  | { status: 'ogiltig'; issues: PlanskissIssue[] }
  | { status: 'giltig'; skiss: Planskissdata };

/**
 * Läser skissdata ur en övning, en ögonblicksbild eller cachen och validerar den igen
 * (ADR 0012 avsnitt 6). Kastar aldrig.
 *
 * `undefined` och `null` betyder att skiss saknas: fältet är utelämnat, eller en JSON-kolumn
 * har värdet `null`. Allt annat som inte klarar schemat är ogiltigt.
 *
 * @sakerhet S-07
 */
export function readPlanskiss(value: unknown): PlanskissReadResult {
  if (value === undefined || value === null) {
    return { status: 'saknas' };
  }
  const result = planskissSchema.safeParse(value);
  if (result.success) {
    return { status: 'giltig', skiss: result.data };
  }
  return {
    status: 'ogiltig',
    issues: result.error.issues.map((issue) => ({
      path: issue.path.map((part) => String(part)).join('.'),
      message: issue.message,
    })),
  };
}
