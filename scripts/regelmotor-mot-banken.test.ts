/**
 * Motorn mot den riktiga banken i content/ovningar/.
 *
 * Testet ligger här och inte i src/, eftersom det läser filer. Motorn gör det aldrig själv:
 * den får banken inskickad (ADR 0011 avsnitt 1).
 *
 * Testerna körs mot de godkända övningarna och, när det finns granskade övningar, också mot
 * banken med dem räknade som godkända (`bankVariantsForTests`). En omgång som skulle fälla
 * testerna fälls då i sin egen pull request och inte först när redaktören har godkänt den.
 */
import { describe, expect, it } from 'vitest';
import { bankVariantsForTests, loadBank } from './bank.ts';
import {
  applySwap,
  checkSession,
  generateSession,
  selectableFocusAreas,
  swapOptions,
  toBankExercise,
} from '../src/regelmotor/index.ts';
import { candidatesForPart } from '../src/regelmotor/blocks/candidates.ts';
import {
  PART_TOLERANCE,
  SESSION_LENGTH_MAX,
  SESSION_SHORTFALL,
  allowedGameFormats,
  phaseForAge,
} from '../src/regelmotor/keys.ts';
import type { GameFormat, Input } from '../src/regelmotor/types.ts';

const underlag: Input = {
  alder: 11,
  spelform: '7mot7',
  niva: 'niva-2',
  spelare: 14,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

describe.each(bankVariantsForTests())('Banken med $name', (variant) => {
  /**
   * Banken som generatorn tar emot: övningarna märkta med sitt ursprung, precis som
   * src/data/bank.ts gör i appen (S-28).
   */
  const banken = variant.exercises.map(toBankExercise);

  function session(input: Input, seed = 'fro-1') {
    const result = generateSession(input, banken, seed);
    if (result.kind !== 'session') {
      throw new Error(`inget pass skapades: ${JSON.stringify(result.reason)}`);
    }
    return result.session;
  }

  describe('R-022 Bara godkända övningar ur den gemensamma banken', () => {
    it('R-022 läser bara godkända övningar ur content/ovningar/', () => {
      expect(variant.problems).toEqual([]);
      expect(variant.exercises.length).toBeGreaterThan(0);
      expect(variant.exercises.every((exercise) => exercise.status === 'godkand')).toBe(true);
    });

    it('S-28 märker varje övning som generatorn får med sitt ursprung', () => {
      expect(banken.length).toBe(variant.exercises.length);
      expect(banken.every((exercise) => exercise.ursprung === 'bank')).toBe(true);
    });

    it('S-28 vägrar märka en övning som inte är godkänd', () => {
      const [first] = loadBank().exercises;
      expect(first).toBeDefined();
      expect(() => toBankExercise({ ...first!, status: 'granskad' })).toThrow(/R-022/);
    });
  });

  describe('R-049 Det här klarar ett genererat pass alltid', () => {
    it('R-049 ger ett pass som klarar kontrollen av samtliga krav', () => {
      expect(checkSession(session(underlag))).toEqual([]);
    });

    /*
     * Egen tidsgräns: testet går igenom varje underlag banken räcker till och räknar i tiotals
     * sekunder, alltså långt över sviten förval. Uppmätt: 7,2 s ensamt på full klockfrekvens,
     * 26-28 s när maskinen klockade ned till 1,7 av 3,0 GHz. 60 s gav bara dubbla marginalen
     * mot det sämsta mätvärdet, vilket räckte för att testet skulle störas när sviten var
     * flakig. 120 s tål samma nedklockning med marginal och fäller fortfarande en oändlig loop.
     *
     * QA-granskning av R-058 (2026-10-02): lade till 13 (udda antal) i `spelare`, så att
     * trion i parövningar prövas mot den riktiga banken. Uppmätt ensamt på full klockfrekvens:
     * 8,1 s före, 9,9 s efter, alltså en ökning på ungefär en fjärdedel. Tidsgränsen ovan har
     * ändå gott om marginal kvar och lämnas oförändrad.
     */
    it(
      'R-049 ger ett pass som klarar kontrollen för varje underlag banken räcker till',
      { timeout: 120_000 },
      () => {
        let skapade = 0;
        for (const alder of [9, 11]) {
          const phase = phaseForAge(alder);
          if (phase === undefined) {
            continue;
          }
          for (const spelform of allowedGameFormats(alder)) {
            for (const niva of ['niva-1', 'niva-2', 'niva-3'] as const) {
              for (const spelare of [8, 12, 13, 14, 20]) {
                for (const ledare of [1, 2, 4]) {
                  for (const passlangd of [30, 60, Math.min(75, SESSION_LENGTH_MAX[phase])]) {
                    for (const fokus of selectableFocusAreas(phase, alder).map((item) => [item])) {
                      const input: Input = {
                        alder,
                        spelform,
                        niva,
                        spelare,
                        ledare,
                        passlangd,
                        fokus,
                      };
                      const result = generateSession(input, banken, 'fro');
                      if (result.kind === 'none') {
                        // Kontrollen får aldrig vara skälet till att inget pass skapades.
                        expect(result.reason.internalProblems).toEqual([]);
                        continue;
                      }
                      skapade += 1;
                      expect(checkSession(result.session)).toEqual([]);
                    }
                  }
                }
              }
            }
          }
        }
        expect(skapade).toBeGreaterThan(100);
      },
    );
  });

  describe('R-072 Gränsen mellan fotbollsregler och algoritmval', () => {
    it('R-072 ger samma pass för samma frö', () => {
      expect(JSON.stringify(session(underlag, 'fro-a').rows)).toBe(
        JSON.stringify(session(underlag, 'fro-a').rows),
      );
    });

    it('R-072 ger samma pass oavsett vilken ordning banken kommer i', () => {
      const blandad = [...banken].reverse();
      const forsta = generateSession(underlag, banken, 'fro-b');
      const andra = generateSession(underlag, blandad, 'fro-b');
      expect(forsta.kind).toBe('session');
      expect(andra.kind).toBe('session');
      if (forsta.kind === 'session' && andra.kind === 'session') {
        expect(JSON.stringify(andra.session.rows)).toBe(JSON.stringify(forsta.session.rows));
      }
    });

    it('R-072 ger ett pass som klarar kraven för varje frö', () => {
      for (const seed of ['1', '2', '3', '4', '5', '6', '7', '8']) {
        expect(checkSession(session(underlag, seed))).toEqual([]);
      }
    });
  });

  describe('R-035 Varje del nära sin måltid', () => {
    it('R-035 och R-036 håller tiderna mot den riktiga banken', () => {
      const value = session(underlag);
      for (const part of value.parts) {
        if (part.status === 'fylld') {
          expect(Math.abs(part.minutes - part.target)).toBeLessThanOrEqual(PART_TOLERANCE);
        }
      }
      expect(value.totalMinutes).toBeLessThanOrEqual(underlag.passlangd);
      expect(value.totalMinutes).toBeGreaterThanOrEqual(underlag.passlangd - SESSION_SHORTFALL);
    });
  });

  describe('R-121 Närliggande fokusområde när kärnan annars blir tom', () => {
    it('R-121 testfallet i regeln: lek för 11 år ger dribbling i kärnan', () => {
      const value = session({ ...underlag, fokus: ['lek'] });
      expect(value.parts.find((part) => part.part === 'del-ovning')?.substituteFocus).toBe(
        'dribbling',
      );
      expect(value.parts.find((part) => part.part === 'del-spelovning')?.substituteFocus).toBe(
        'dribbling',
      );
      expect(value.input.fokus).toEqual(['lek']);
    });

    it('R-121 ger inget ersättningsfokus när banken har övningar för valt fokus', () => {
      expect(session(underlag).parts.every((part) => part.substituteFocus === null)).toBe(true);
    });
  });

  describe('R-101 När inget pass skapas', () => {
    /*
     * Testerna bygger inte på att banken saknar en viss spelform. De tar i stället bort
     * spelformens övningar ur den riktiga banken, så att ingen av Öva, Spelövning och Spel kan
     * fyllas oavsett vad banken innehåller. Åldrarna 6 och 19 år är samtidigt gränsvärdena för
     * R-011.
     */
    const fall: { namn: string; input: Input }[] = [
      {
        namn: '3 mot 3 vid nedre åldersgränsen (6 år)',
        input: { ...underlag, alder: 6, spelform: '3mot3', passlangd: 60, fokus: ['lek'] },
      },
      {
        namn: '9 mot 9 (13 år)',
        input: { ...underlag, alder: 13, spelform: '9mot9', passlangd: 90, fokus: ['avslut'] },
      },
      {
        namn: '11 mot 11 (16 år)',
        input: { ...underlag, alder: 16, spelform: '11mot11', passlangd: 90, fokus: ['avslut'] },
      },
      {
        namn: '11 mot 11 vid övre åldersgränsen (19 år)',
        input: { ...underlag, alder: 19, spelform: '11mot11', passlangd: 90, fokus: ['avslut'] },
      },
    ];

    /** Den riktiga banken utan de övningar som går att använda i spelformen. */
    function utan(spelform: GameFormat) {
      return banken.filter((exercise) => !exercise.spelformer.includes(spelform));
    }

    it.each(fall)('R-101 skapar inget pass för $namn när banken saknar spelformen', ({ input }) => {
      const result = generateSession(input, utan(input.spelform), 'fro');
      expect(result.kind).toBe('none');
      if (result.kind === 'none') {
        expect(result.reason.cause).toBe('inget-matchar');
        expect(result.reason.internalProblems).toEqual([]);
      }
    });

    /*
     * Motsatsen: med spelformens övningar kvar i banken kan minst en av delarna fyllas, och då
     * skapas ett pass. Banken har sedan omgång 5 övningar för alla fem spelformerna, så testet
     * fäller om en spelform tappas ur banken eller slutar räcka till ett pass.
     */
    it.each(fall)('R-101 skapar ett pass för $namn när banken har spelformen', ({ input }) => {
      expect(utan(input.spelform).length).toBeLessThan(banken.length);
      const result = generateSession(input, banken, 'fro');
      expect(result.kind === 'none' ? result.reason : 'pass').toBe('pass');
      if (result.kind === 'session') {
        expect(checkSession(result.session)).toEqual([]);
      }
    });
  });

  /*
   * R-049 ovan prövar bara 9 och 11 år. Det här testet prövar varje ålder mellan
   * åldersgränserna i de övriga faserna, med varje spelform och varje fokus, mot spelformerna
   * som kom med omgång 5.
   */
  it(
    'R-049 ger ett pass som klarar kontrollen för varje ålder och spelform banken räcker till',
    { timeout: 120_000 },
    () => {
      const spelformer = new Set<GameFormat>();
      for (const alder of [6, 7, 8, 10, 12, 13, 14, 15, 17, 19]) {
        const phase = phaseForAge(alder);
        if (phase === undefined) {
          continue;
        }
        for (const spelform of allowedGameFormats(alder)) {
          for (const fokus of selectableFocusAreas(phase, alder).map((item) => [item])) {
            const input: Input = {
              ...underlag,
              alder,
              spelform,
              passlangd: Math.min(60, SESSION_LENGTH_MAX[phase]),
              fokus,
            };
            const result = generateSession(input, banken, 'fro');
            if (result.kind === 'none') {
              expect(result.reason.internalProblems).toEqual([]);
              continue;
            }
            spelformer.add(spelform);
            expect(checkSession(result.session)).toEqual([]);
          }
        }
      }
      expect([...spelformer].sort()).toEqual(['11mot11', '3mot3', '5mot5', '7mot7', '9mot9']);
    },
  );

  describe('R-104 och R-105 Byte av övning mot den riktiga banken', () => {
    /*
     * Varje alternativ som swapOptions visar ska gå att byta in, och passet efter bytet ska
     * klara slutkontrollen (ADR 0011 avsnitt 1, steg 5). Egen tidsgräns av samma skäl som
     * R-049-testet ovan: varje plats i varje pass prövas mot hela banken.
     */
    it(
      'R-104 ger bara alternativ som R-105 kan byta in och som klarar slutkontrollen',
      { timeout: 120_000 },
      () => {
        let byten = 0;
        for (const alder of [9, 11]) {
          const phase = phaseForAge(alder);
          if (phase === undefined) {
            continue;
          }
          for (const spelform of allowedGameFormats(alder)) {
            for (const spelare of [8, 13, 14]) {
              for (const ledare of [1, 2, 4]) {
                for (const fokus of selectableFocusAreas(phase, alder).map((item) => [item])) {
                  const input: Input = { ...underlag, alder, spelform, spelare, ledare, fokus };
                  const result = generateSession(input, banken, 'fro');
                  if (result.kind === 'none') {
                    continue;
                  }
                  const pass = result.session;
                  for (const row of pass.rows) {
                    if (row.exercise === null || row.block === null) {
                      continue;
                    }
                    const ref = {
                      block: row.block,
                      station: row.kind === 'station' ? row.station : null,
                    };
                    for (const option of swapOptions(pass, ref, banken)) {
                      expect(checkSession(applySwap(pass, ref, option))).toEqual([]);
                      byten += 1;
                    }
                  }
                }
              }
            }
          }
        }
        expect(byten).toBeGreaterThan(100);
      },
    );

    /*
     * Testet ovan når aldrig stationer: banken ger stationer först vid 75 och 90 minuter, och
     * underlaget där har 60. En kartläggning mot banken 2026-10-05 (ålder 8–12, alla nivåer,
     * 8–20 spelare, 1–4 ledare, 30–90 minuter, varje fokus) gav 798 pass med stationer, men
     * byten vid en station bara för 7 mot 7 med 8 spelare, nivå 1 eller 2, 75 eller 90 minuter
     * och fokus avslut, fasta situationer eller målvaktsspel. Parametrarna nedan är riktade dit,
     * och testet fäller om de slutar ge byten vid stationer, så att det inte tyst blir tomt.
     * Utfall 2026-10-05: 288 pass med stationer och 180 byten vid stationer, samma 180 som
     * hela kartläggningen gav. Uppmätt ensamt: 1,4 s, mot ungefär 60 s för hela kartläggningen.
     */
    it(
      'R-104 ger vid stationer bara alternativ som R-105 kan byta in och som klarar slutkontrollen',
      { timeout: 120_000 },
      () => {
        let passMedStationer = 0;
        let bytenVidStationer = 0;
        for (const alder of [10, 11, 12]) {
          const phase = phaseForAge(alder);
          if (phase === undefined) {
            continue;
          }
          for (const niva of ['niva-1', 'niva-2'] as const) {
            for (const ledare of [2, 3, 4]) {
              for (const passlangd of [75, 90]) {
                for (const fokus of selectableFocusAreas(phase, alder).map((item) => [item])) {
                  const input: Input = {
                    ...underlag,
                    alder,
                    spelform: '7mot7',
                    niva,
                    spelare: 8,
                    ledare,
                    passlangd,
                    fokus,
                  };
                  const result = generateSession(input, banken, 'fro');
                  if (result.kind === 'none') {
                    continue;
                  }
                  const pass = result.session;
                  const stationer = pass.rows.filter((row) => row.kind === 'station');
                  if (stationer.length === 0) {
                    continue;
                  }
                  passMedStationer += 1;
                  for (const row of stationer) {
                    if (row.block === null) {
                      continue;
                    }
                    const place = { block: row.block, station: row.station };
                    for (const option of swapOptions(pass, place, banken)) {
                      const efter = applySwap(pass, place, option);
                      expect(checkSession(efter)).toEqual([]);
                      // Bytet ändrar bara stationen, inte stationsmomentets tider (R-065).
                      expect(efter.rows.filter((item) => item.kind === 'station').length).toBe(
                        stationer.length,
                      );
                      bytenVidStationer += 1;
                    }
                  }
                }
              }
            }
          }
        }
        expect(passMedStationer).toBeGreaterThan(50);
        expect(bytenVidStationer).toBeGreaterThan(50);
      },
    );
  });

  describe('R-086 Nickning bara när ledaren har valt nickspel', () => {
    /*
     * Testfallen i beslut B1 (plan-omgang-6.md): 13 år där ledaren har valt fasta situationer.
     * hornor-med-nickar har både fasta-situationer och nickspel, och träffade därför fokuset
     * innan R-086 fanns. Svepet går över de underlag där övningen kan komma i fråga
     * (9 mot 9, nivå 2 och 3, 8 eller 16 spelare) och över flera frön.
     */
    const nickovningar = new Set(
      banken
        .filter((exercise) => exercise.fokusomraden.includes('nickspel'))
        .map((item) => item.id),
    );
    const tretton: Input = {
      alder: 13,
      spelform: '9mot9',
      niva: 'niva-2',
      spelare: 8,
      ledare: 2,
      passlangd: 60,
      fokus: ['fasta-situationer'],
    };

    function sweep(fokus: Input['fokus']) {
      const pass = [];
      for (const niva of ['niva-2', 'niva-3'] as const) {
        for (const spelare of [8, 16]) {
          for (const passlangd of [45, 60, 90]) {
            for (const seed of ['fro-1', 'fro-2', 'fro-3', 'fro-4', 'fro-5']) {
              const input: Input = { ...tretton, niva, spelare, passlangd, fokus };
              const result = generateSession(input, banken, seed);
              if (result.kind === 'session') {
                pass.push(result.session);
              }
            }
          }
        }
      }
      return pass;
    }

    function exerciseIds(pass: { rows: readonly { exercise: { id: string } | null }[] }) {
      return pass.rows.flatMap((row) => (row.exercise === null ? [] : [row.exercise.id]));
    }

    it('R-086 testfallet: banken har hornor-med-nickar med fasta-situationer och nickspel', () => {
      const hornor = banken.find((exercise) => exercise.id === 'hornor-med-nickar');
      expect(hornor?.fokusomraden).toEqual(
        expect.arrayContaining(['fasta-situationer', 'nickspel']),
      );
    });

    it('R-086 väljer inte hornor-med-nickar för 13 år när ledaren bara har valt fasta-situationer', () => {
      const context = { input: tretton, phase: 'fas-13-14' as const };
      expect(
        candidatesForPart(banken, 'del-spelovning', context).map((item) => item.id),
      ).not.toContain('hornor-med-nickar');
      const pass = sweep(['fasta-situationer']);
      expect(pass.length).toBeGreaterThan(0);
      for (const item of pass) {
        expect(exerciseIds(item).filter((id) => nickovningar.has(id))).toEqual([]);
        expect(checkSession(item)).toEqual([]);
      }
    });

    it('R-086 låter hornor-med-nickar väljas när ledaren också har valt nickspel', () => {
      const medNick: Input = { ...tretton, fokus: ['fasta-situationer', 'nickspel'] };
      const context = { input: medNick, phase: 'fas-13-14' as const };
      expect(candidatesForPart(banken, 'del-spelovning', context).map((item) => item.id)).toContain(
        'hornor-med-nickar',
      );
      const pass = sweep(['fasta-situationer', 'nickspel']);
      expect(pass.some((item) => exerciseIds(item).includes('hornor-med-nickar'))).toBe(true);
      for (const item of pass) {
        expect(checkSession(item)).toEqual([]);
      }
    });

    it('R-086 visar ingen nickövning som alternativ vid byte när ledaren inte har valt nickspel', () => {
      /*
       * Samma pass prövas två gånger: med ledarens fokus som det är, och med nickspel tillagt.
       * Det andra är kontrollfallet. Det visar att nickövningen annars hade varit ett
       * alternativ, så att testet inte är tomt av andra skäl.
       */
      let platser = 0;
      const visadeMedNick = new Set<string>();
      // Med bara fasta-situationer har Spelövning ett ersättningsfokus (R-121), och då träffar
      // nickövningen inte delens fokus ens med nickspel tillagt. Avslut ger kontrollfallet.
      for (const item of [...sweep(['fasta-situationer']), ...sweep(['avslut'])]) {
        const medNick = {
          ...item,
          input: { ...item.input, fokus: [...item.input.fokus, 'nickspel' as const] },
        };
        for (const row of item.rows) {
          if (row.exercise === null || row.block === null) {
            continue;
          }
          const ref = { block: row.block, station: row.kind === 'station' ? row.station : null };
          const alternativ = swapOptions(item, ref, banken).map((option) => option.id);
          expect(alternativ.filter((id) => nickovningar.has(id))).toEqual([]);
          platser += 1;
          for (const option of swapOptions(medNick, ref, banken)) {
            if (nickovningar.has(option.id)) {
              visadeMedNick.add(option.id);
            }
          }
        }
      }
      expect(platser).toBeGreaterThan(0);
      expect(visadeMedNick).toContain('hornor-med-nickar');
    });
  });
});
