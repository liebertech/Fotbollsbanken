/**
 * Övningens schema. En definition, som används av valideringsskriptet, av importen och av
 * appens formulär för egna övningar (ADR 0010 avsnitt 1 och 5).
 *
 * Fälten är domändata och behåller sin svenska stavning; koden runt omkring är engelsk
 * (ADR 0011, *Namn*).
 */
import { z } from 'zod';
import {
  AGE_MAX,
  AGE_MIN,
  CLOSING_PART,
  EXERCISE_STATUSES,
  FOCUS_AREAS,
  FOCUS_AREA_HEADING,
  FOCUS_BY_PHASE,
  GAME_FORMATS,
  GROUP_TYPES,
  HEADING_MIN_AGE,
  LEVELS,
  MATERIAL_TYPES,
  MATERIAL_TYPE_REQUIRING_NOTE,
  SESSION_PARTS_FROM_BANK,
  STATUSES_REQUIRING_BANK_FIELDS,
  allowedGameFormats,
  phasesForAgeSpan,
} from '../keys.ts';
import { planskissPlaceholderSchema } from './planskiss.ts';

/** Versionen av det här schemat. Källa: ADR 0010 avsnitt 1. */
export const SCHEMA_VERSION = 1;

/**
 * Gränser. De som inte står i ADR 0010 kommer från säkerhetsfynden:
 * S-08 kräver textgränser och tak så att innehåll inte kan fylla gratisnivån,
 * S-07 kräver tak för allt som en ledare kan styra.
 */
export const LIMITS = {
  /** ADR 0010 avsnitt 1: slug, 3-64 tecken, bara ASCII. */
  idPattern: /^[a-z0-9]([a-z0-9-]{1,62})[a-z0-9]$/,
  namn: { min: 3, max: 60 },
  syfte: { min: 10, max: 200 },
  /** Undre gränsen ur ADR 0010, övre ur S-08 (`beskrivning` 5 000). */
  beskrivning: { min: 40, max: 5000 },
  organisation: { min: 10, max: 2000 },
  ledaruppgift: { min: 3, max: 500 },
  coachningspunkter: { minCount: 2, maxCount: 4, min: 3, max: 200 },
  fritext: { min: 3, max: 500 },
  kalla: { min: 3, max: 200 },
  material: { maxCount: 20, maxAntal: 200, anteckning: { min: 1, max: 200 } },
  granskning: {
    maxCount: 30,
    av: { min: 2, max: 60 },
    roll: { min: 2, max: 40 },
    kommentar: { max: 2000 },
  },
  /** Ytans mått i meter. Samma gränser som `omrade` i ADR 0012 avsnitt 2. */
  yta: { langd: { min: 5, max: 120 }, bredd: { min: 5, max: 80 } },
  /** Övningens tid i minuter. Övre gränsen är längsta tillåtna passlängd (R-018). */
  tid: { min: 5, max: 120 },
  spelare: { min: 1, max: 40 },
  /** ADR 0012 avsnitt 6 och S-08: `pg_column_size(content -> 'planskiss') < 8192`. */
  planskissBytes: 8192,
  /** S-08: `pg_column_size(content) < 100000`. */
  contentBytes: 100000,
} as const;

/**
 * Fält som en egen övning måste ha ifyllda för att kunna bytas in i ett pass.
 * Källa: ADR 0010 avsnitt 1, kolumnen R-106.
 *
 * @regel R-106
 */
export const R106_REQUIRED_FIELDS = [
  'namn',
  'syfte',
  'beskrivning',
  'fokusomraden',
  'alder',
  'spelformer',
  'niva',
  'passdelar',
  'ledarbehov',
  'spelare',
  'grupptyp',
  'tid',
] as const;

/** Fält som krävs för att en fil ska få status `granskad` eller `godkand` (ADR 0010, kolumnen Bank). */
const BANK_FIELDS = {
  namn: true,
  syfte: true,
  beskrivning: true,
  organisation: true,
  fokusomraden: true,
  alder: true,
  spelformer: true,
  niva: true,
  passdelar: true,
  ledarbehov: true,
  spelare: true,
  grupptyp: true,
  tid: true,
  yta: true,
  material: true,
  coachningspunkter: true,
  varianter: true,
  anpassning: true,
  granskning: true,
} as const;

export const BANK_FIELD_NAMES = Object.keys(BANK_FIELDS) as (keyof typeof BANK_FIELDS)[];

/**
 * Sant när texten innehåller ett `@` eller ett mönster som liknar en e-postadress.
 *
 * Varje kvantifierare är begränsad. Kontrollen gäller sedan S-32 också `beskrivning` och de
 * andra långa fälten, och med obegränsade kvantifierare blir sökningen katastrofalt
 * långsam på en lång text: en `beskrivning` på 100 000 tecken tog över en minut. Gränserna
 * är rundligt tilltagna mot de längsta delar en riktig adress har.
 *
 * @sakerhet S-21
 * @sakerhet S-32
 */
export function looksLikeEmail(text: string): boolean {
  if (text.includes('@')) {
    return true;
  }
  const obfuscated =
    /[\p{L}\p{N}._%+-]{1,64}\s{0,4}(?:\(at\)|\[at\]|\{at\}|\bat\b|\bsnabel-?a\b)\s{0,4}[\p{L}\p{N}-]{1,64}(?:\s{0,4}(?:\(dot\)|\[dot\]|\.)\s{0,4}[\p{L}]{2,64}){1,4}/iu;
  return obfuscated.test(text);
}

const trimmedText = (min: number, max: number) => z.string().trim().min(min).max(max);

const positiveInt = (min: number, max: number) => z.number().int().min(min).max(max);

const areaSchema = z.strictObject({
  langd: z.number().min(LIMITS.yta.langd.min).max(LIMITS.yta.langd.max),
  bredd: z.number().min(LIMITS.yta.bredd.min).max(LIMITS.yta.bredd.max),
});

/** `yta` är en sluten karta: spelformsnycklarna eller `alla`. Inga fria nycklar (S-07). */
const ytaSchema = z
  .strictObject({
    alla: areaSchema.optional(),
    '3mot3': areaSchema.optional(),
    '5mot5': areaSchema.optional(),
    '7mot7': areaSchema.optional(),
    '9mot9': areaSchema.optional(),
    '11mot11': areaSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'yta måste ange minst en yta, `alla` eller en spelformsnyckel (R-092)',
  });

const materialItemSchema = z.strictObject({
  typ: z.enum(MATERIAL_TYPES),
  antal: positiveInt(1, LIMITS.material.maxAntal),
  anteckning: trimmedText(
    LIMITS.material.anteckning.min,
    LIMITS.material.anteckning.max,
  ).optional(),
});

const reviewEntrySchema = z.strictObject({
  datum: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'datum skrivs som ÅÅÅÅ-MM-DD')
    .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), {
      message: 'datum är inget giltigt datum',
    }),
  av: trimmedText(LIMITS.granskning.av.min, LIMITS.granskning.av.max),
  roll: trimmedText(LIMITS.granskning.roll.min, LIMITS.granskning.roll.max),
  kommentar: z.string().trim().max(LIMITS.granskning.kommentar.max).optional(),
});

export interface ExerciseSchemaOptions {
  /**
   * Planskissens schema (ADR 0012). Utan det underkänns varje övning som har fältet,
   * eftersom skissdata aldrig får släppas igenom ovaliderad (S-07).
   */
  planskiss?: z.ZodType<unknown>;
}

function buildObject(planskiss: z.ZodType<unknown>) {
  return z.strictObject({
    schema: z.literal(SCHEMA_VERSION),
    id: z
      .string()
      .regex(LIMITS.idPattern, 'id är en slug med gemener, siffror och bindestreck, 3-64 tecken'),
    namn: trimmedText(LIMITS.namn.min, LIMITS.namn.max),
    syfte: trimmedText(LIMITS.syfte.min, LIMITS.syfte.max),
    beskrivning: trimmedText(LIMITS.beskrivning.min, LIMITS.beskrivning.max),
    organisation: trimmedText(LIMITS.organisation.min, LIMITS.organisation.max),
    fokusomraden: z.array(z.enum(FOCUS_AREAS)).min(1).max(3),
    alder: z.strictObject({
      min: positiveInt(AGE_MIN, AGE_MAX),
      max: positiveInt(AGE_MIN, AGE_MAX),
    }),
    spelformer: z.array(z.enum(GAME_FORMATS)).min(1).max(GAME_FORMATS.length),
    niva: z.array(z.enum(LEVELS)).min(1).max(LEVELS.length),
    // R-005: listan SESSION_PARTS_FROM_BANK saknar CLOSING_PART, så enum:et stänger ute
    // `del-avslutning`. Felmeddelandet nämner regeln, så att den går att följa i utdata.
    passdelar: z
      .array(
        z.enum(SESSION_PARTS_FROM_BANK, {
          error: (issue) =>
            issue.input === CLOSING_PART
              ? `${CLOSING_PART} är ett fast inslag i passet och märks aldrig på en övning (R-005)`
              : `passdelen måste vara en av ${SESSION_PARTS_FROM_BANK.join(', ')} (R-005)`,
        }),
      )
      .min(1)
      .max(SESSION_PARTS_FROM_BANK.length),
    ledarbehov: positiveInt(0, 2),
    ledaruppgift: trimmedText(LIMITS.ledaruppgift.min, LIMITS.ledaruppgift.max).optional(),
    spelare: z.strictObject({
      min: positiveInt(LIMITS.spelare.min, LIMITS.spelare.max),
      max: positiveInt(LIMITS.spelare.min, LIMITS.spelare.max),
    }),
    grupptyp: z.enum(GROUP_TYPES),
    udda_antal_losning: z.boolean().optional(),
    tid: z.strictObject({
      kortast: positiveInt(LIMITS.tid.min, LIMITS.tid.max),
      rekommenderad: positiveInt(LIMITS.tid.min, LIMITS.tid.max),
      langst: positiveInt(LIMITS.tid.min, LIMITS.tid.max),
    }),
    yta: ytaSchema,
    material: z.array(materialItemSchema).max(LIMITS.material.maxCount),
    coachningspunkter: z
      .array(trimmedText(LIMITS.coachningspunkter.min, LIMITS.coachningspunkter.max))
      .min(LIMITS.coachningspunkter.minCount)
      .max(LIMITS.coachningspunkter.maxCount),
    varianter: z.strictObject({
      lattare: trimmedText(LIMITS.fritext.min, LIMITS.fritext.max),
      svarare: trimmedText(LIMITS.fritext.min, LIMITS.fritext.max),
    }),
    anpassning: z.strictObject({
      fler_spelare: trimmedText(LIMITS.fritext.min, LIMITS.fritext.max),
      udda_antal: trimmedText(LIMITS.fritext.min, LIMITS.fritext.max),
      ledare: trimmedText(LIMITS.fritext.min, LIMITS.fritext.max),
    }),
    planskiss: planskiss.optional(),
    kalla: trimmedText(LIMITS.kalla.min, LIMITS.kalla.max).optional(),
    status: z.enum(EXERCISE_STATUSES),
    granskning: z.array(reviewEntrySchema).max(LIMITS.granskning.maxCount),
  });
}

type ExerciseObject = ReturnType<typeof buildObject>;

/** En komplett bankövning. */
export type Exercise = z.infer<ExerciseObject>;

// Vitlistan över de fält som publiceras ligger i schema/published.ts, utan beroende på zod,
// eftersom den läses i klienten (S-27).

/** En fil i content/ovningar/, där bankfälten får saknas så länge statusen är `utkast`. */
export type ExerciseFile = Partial<Exercise> &
  Pick<Exercise, 'schema' | 'id' | 'status'> & { granskning?: Exercise['granskning'] };

function addIssue(ctx: z.RefinementCtx, path: (string | number)[], message: string): void {
  ctx.addIssue({ code: 'custom', path, message });
}

/**
 * Samtliga fritextfält i övningen, med sin sökväg. Kontrollen mot e-postadresser gällde
 * tidigare bara `kalla` och `granskning[].av`, medan de stora texterna – som är de en ledare
 * skriver själv i inkrement 4 – var okontrollerade.
 *
 * @sakerhet S-32
 */
function freeTextFields(value: Partial<Exercise>): { path: (string | number)[]; text: string }[] {
  const fields: { path: (string | number)[]; text: string }[] = [];
  const add = (path: (string | number)[], text: string | undefined): void => {
    if (typeof text === 'string' && text.length > 0) {
      fields.push({ path, text });
    }
  };

  add(['namn'], value.namn);
  add(['syfte'], value.syfte);
  add(['beskrivning'], value.beskrivning);
  add(['organisation'], value.organisation);
  add(['ledaruppgift'], value.ledaruppgift);
  add(['kalla'], value.kalla);
  add(['varianter', 'lattare'], value.varianter?.lattare);
  add(['varianter', 'svarare'], value.varianter?.svarare);
  add(['anpassning', 'fler_spelare'], value.anpassning?.fler_spelare);
  add(['anpassning', 'udda_antal'], value.anpassning?.udda_antal);
  add(['anpassning', 'ledare'], value.anpassning?.ledare);
  value.coachningspunkter?.forEach((point, index) => add(['coachningspunkter', index], point));
  value.material?.forEach((item, index) => add(['material', index, 'anteckning'], item.anteckning));
  value.granskning?.forEach((entry, index) => {
    add(['granskning', index, 'av'], entry.av);
    add(['granskning', index, 'kommentar'], entry.kommentar);
  });

  return fields;
}

/** Felmeddelandet för fältet, med den vägledning som passar just det fältet. */
function emailMessage(path: (string | number)[]): string {
  const field = path.join('.');
  if (field === 'kalla') {
    return 'kalla får inte innehålla en e-postadress. Hänvisa till publicerat material (S-21)';
  }
  if (path[0] === 'granskning' && path[2] === 'av') {
    return 'av ska vara roll och förnamn eller ett handtag, aldrig en e-postadress (S-21)';
  }
  return `${field} får inte innehålla en e-postadress. Övningen publiceras, och kontaktuppgifter hör inte hemma i den (S-21, S-32)`;
}

/**
 * Reglerna som schemat kontrollerar utöver fälttyperna (ADR 0010 avsnitt 1).
 * Varje kontroll tål att fältet saknas, eftersom samma funktion används för en `utkast`-fil.
 */
function checkCrossRules(value: Partial<Exercise>, ctx: z.RefinementCtx): void {
  const { alder, fokusomraden, spelformer, niva, passdelar, spelare, grupptyp, tid, yta } = value;

  // R-003: åldersspannet är riktat åt rätt håll.
  if (alder && alder.min > alder.max) {
    addIssue(
      ctx,
      ['alder'],
      `min (${alder.min}) får inte vara större än max (${alder.max}) (R-003)`,
    );
  }

  // R-001: nivålistan.
  if (niva) {
    if (new Set(niva).size !== niva.length) {
      addIssue(ctx, ['niva'], 'nivålistan får inte innehålla dubletter (R-001)');
    }
    if (niva.includes('niva-1') && niva.includes('niva-3') && !niva.includes('niva-2')) {
      addIssue(
        ctx,
        ['niva'],
        'en lista med niva-1 och niva-3 måste också innehålla niva-2 (R-001)',
      );
    }
  }

  // R-002: varje fokusområde är K eller R för varje fas som åldern berör.
  if (fokusomraden) {
    if (new Set(fokusomraden).size !== fokusomraden.length) {
      addIssue(ctx, ['fokusomraden'], 'fokusområdena får inte innehålla dubletter (R-002)');
    }
    if (alder && alder.min <= alder.max) {
      const phases = phasesForAgeSpan(alder.min, alder.max);
      for (const [index, focus] of fokusomraden.entries()) {
        for (const phase of phases) {
          if (FOCUS_BY_PHASE[focus][phase] === '-') {
            addIssue(
              ctx,
              ['fokusomraden', index],
              `${focus} är "-" för ${phase} och kan inte användas för åldern ${alder.min}-${alder.max} (R-002)`,
            );
          }
        }
      }
    }
  }

  // R-081: nickning tidigast från 13 år.
  if (fokusomraden?.includes(FOCUS_AREA_HEADING) && alder && alder.min < HEADING_MIN_AGE) {
    addIssue(
      ctx,
      ['alder', 'min'],
      `en övning med ${FOCUS_AREA_HEADING} måste ha alder.min minst ${HEADING_MIN_AGE} (R-081)`,
    );
  }

  // R-004: varje spelform är tillåten (R-014) för minst en ålder i spannet.
  if (spelformer) {
    if (new Set(spelformer).size !== spelformer.length) {
      addIssue(ctx, ['spelformer'], 'spelformerna får inte innehålla dubletter (R-004)');
    }
    if (alder && alder.min <= alder.max) {
      const allowed = new Set<string>();
      for (let age = alder.min; age <= alder.max; age += 1) {
        for (const format of allowedGameFormats(age)) {
          allowed.add(format);
        }
      }
      for (const [index, format] of spelformer.entries()) {
        if (!allowed.has(format)) {
          addIssue(
            ctx,
            ['spelformer', index],
            `${format} är inte tillåten för någon ålder i ${alder.min}-${alder.max} (R-004, R-014)`,
          );
        }
      }
    }
  }

  // R-005: passdelarna, utan dubletter. Avslutningen stängs ute av enum:et ovan.
  if (passdelar && new Set(passdelar).size !== passdelar.length) {
    addIssue(ctx, ['passdelar'], 'passdelarna får inte innehålla dubletter (R-005)');
  }

  // R-006: ledarstyrda övningar beskriver vad ledaren gör.
  if (value.ledarbehov !== undefined && value.ledarbehov >= 1 && !value.ledaruppgift) {
    addIssue(ctx, ['ledaruppgift'], 'krävs när ledarbehov är 1 eller 2 (R-006)');
  }

  // R-007: antalet spelare per grupp.
  if (spelare && spelare.min > spelare.max) {
    addIssue(
      ctx,
      ['spelare'],
      `min (${spelare.min}) får inte vara större än max (${spelare.max}) (R-007)`,
    );
  }

  // R-008: grupptypen och dess följder.
  if (grupptyp) {
    if ((grupptyp === 'par' || grupptyp === 'tva-lag') && spelare && spelare.min < 2) {
      addIssue(ctx, ['spelare', 'min'], `grupptypen ${grupptyp} kräver minst 2 spelare (R-008)`);
    }
    if (grupptyp === 'fast-storlek') {
      if (spelare && (spelare.min !== spelare.max || spelare.min < 2)) {
        addIssue(
          ctx,
          ['spelare'],
          'fast-storlek kräver att min och max är lika och minst 2 (R-008)',
        );
      }
      if (value.udda_antal_losning === undefined) {
        addIssue(ctx, ['udda_antal_losning'], 'krävs när grupptyp är fast-storlek (R-008)');
      }
    } else if (value.udda_antal_losning !== undefined) {
      addIssue(
        ctx,
        ['udda_antal_losning'],
        'får bara anges när grupptyp är fast-storlek (R-008, R-050)',
      );
    }
    if (passdelar?.includes('del-spel') && grupptyp !== 'tva-lag') {
      addIssue(ctx, ['grupptyp'], 'en övning med del-spel ska ha grupptypen tva-lag (R-008)');
    }
  }

  // R-009: tiderna.
  if (tid && !(tid.kortast <= tid.rekommenderad && tid.rekommenderad <= tid.langst)) {
    addIssue(
      ctx,
      ['tid'],
      `kortast (${tid.kortast}) <= rekommenderad (${tid.rekommenderad}) <= langst (${tid.langst}) gäller inte (R-009)`,
    );
  }

  // R-092: ytans nycklar hör ihop med spelformerna, och varje spelform täcks av exakt en nyckel.
  if (yta) {
    const keys = Object.keys(yta);
    if (spelformer) {
      for (const key of keys) {
        if (key !== 'alla' && !spelformer.includes(key as (typeof GAME_FORMATS)[number])) {
          addIssue(ctx, ['yta', key], `${key} finns inte i spelformer (R-092)`);
        }
      }
      const hasAll = 'alla' in yta;
      for (const format of spelformer) {
        const covers = (hasAll ? 1 : 0) + (format in yta ? 1 : 0);
        if (covers === 0) {
          addIssue(ctx, ['yta'], `${format} saknar yta. Ange ${format} eller alla (R-092)`);
        } else if (covers > 1) {
          addIssue(
            ctx,
            ['yta', format],
            `${format} täcks både av alla och av sin egen nyckel. Bara en av dem (R-092)`,
          );
        }
      }
    }
  }

  // R-120: materialtypen `ovrigt` säger vad materialet är.
  if (value.material) {
    for (const [index, item] of value.material.entries()) {
      if (item.typ === MATERIAL_TYPE_REQUIRING_NOTE && !item.anteckning) {
        addIssue(
          ctx,
          ['material', index, 'anteckning'],
          'materialtypen ovrigt kräver en anteckning som säger vad materialet är (R-120)',
        );
      }
    }
  }

  // S-21 och S-32: inga e-postadresser i något fritextfält.
  for (const { path, text } of freeTextFields(value)) {
    if (looksLikeEmail(text)) {
      addIssue(ctx, path, emailMessage(path));
    }
  }

  // S-07 och S-08: skissdata får inte vara större än vad databasen tar emot.
  if (value.planskiss !== undefined) {
    const bytes = new TextEncoder().encode(JSON.stringify(value.planskiss) ?? '').length;
    if (bytes >= LIMITS.planskissBytes) {
      addIssue(
        ctx,
        ['planskiss'],
        `skissdata är ${bytes} byte. Gränsen är ${LIMITS.planskissBytes} byte (S-08, ADR 0012)`,
      );
    }
  }
}

/**
 * Statusberoende krav på en fil i content/ovningar/ (ADR 0010 avsnitt 5).
 * En `utkast`-fil behöver bara följa schemats typer.
 */
function checkStatusRules(
  value: Partial<Exercise> & { status: Exercise['status'] },
  ctx: z.RefinementCtx,
): void {
  const { status } = value;

  if (STATUSES_REQUIRING_BANK_FIELDS.includes(status)) {
    for (const field of BANK_FIELD_NAMES) {
      if (value[field] === undefined) {
        addIssue(ctx, [field], `krävs för status ${status} (ADR 0010 avsnitt 1)`);
      }
    }
    if (!value.granskning || value.granskning.length === 0) {
      addIssue(ctx, ['granskning'], `status ${status} kräver minst en granskningsrad (ADR 0010)`);
    }
  }

  if (status === 'atgarda') {
    const last = value.granskning?.at(-1);
    if (!last) {
      addIssue(ctx, ['granskning'], 'status atgarda kräver minst en granskningsrad (ADR 0010)');
    } else if (!last.kommentar || last.kommentar.length === 0) {
      addIssue(
        ctx,
        ['granskning', value.granskning ? value.granskning.length - 1 : 0, 'kommentar'],
        'status atgarda kräver en kommentar som säger vad som ska ändras (ADR 0010)',
      );
    }
  }
}

/**
 * Bygger schemana. Planskissens schema skickas in, så att övningsschemat inte behöver
 * känna till src/planskiss/ (ADR 0010 avsnitt 1, ADR 0012 avsnitt 6).
 */
export function createExerciseSchemas(options: ExerciseSchemaOptions = {}) {
  const planskiss = options.planskiss ?? planskissPlaceholderSchema;
  const object = buildObject(planskiss);

  return {
    /** Alla fält, som en godkänd bankövning. */
    exerciseSchema: object.superRefine(checkCrossRules),
    /** En fil i content/ovningar/. Bankfälten krävs först vid `granskad` och `godkand`. */
    exerciseFileSchema: object
      .partial(BANK_FIELDS)
      .superRefine(checkCrossRules)
      .superRefine(checkStatusRules),
  };
}

const defaultSchemas = createExerciseSchemas();

/** Schemat för en komplett bankövning. */
export const exerciseSchema = defaultSchemas.exerciseSchema;

/** Schemat för en fil i content/ovningar/. */
export const exerciseFileSchema = defaultSchemas.exerciseFileSchema;
