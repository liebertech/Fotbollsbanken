/**
 * Kompletterande tester för `scripts/tackning-celler.ts`, skrivna vid granskningen av
 * gren `analys/tackning` (PR #32). De täcker fall som saknades i
 * `scripts/tackning-celler.test.ts`: att `coreRemoved` sätts rätt även när kärnan inte blir
 * fylld, blandade fall där en kärndel är borttagen (R-033) och den andra saknar övning
 * (R-100), samt försvarsbeteende för en ålder utanför det giltiga spannet (R-011) i
 * `rollUpToPlanCells`, `sumByKind` och `onlySuggested`.
 *
 * Skriver inte om någon produktionskod. Skriver aldrig över en befintlig rapport (se
 * `reportPath`-testerna i huvudtestfilen).
 */
import { describe, expect, it } from 'vitest';
import type { GenerationResult, PartResult, SessionPartFromBank } from '../src/regelmotor/index.ts';
import {
  type CellStats,
  classifyOutcome,
  emptyCellStats,
  formatGameFormat,
  mergeCellStats,
  onlySuggested,
  rollUpToPlanCells,
  sumByKind,
} from './tackning-celler.ts';

function part(
  name: SessionPartFromBank,
  status: PartResult['status'],
  substituteFocus: PartResult['substituteFocus'] = null,
): PartResult {
  return {
    part: name,
    target: 10,
    minutes: status === 'fylld' ? 10 : 0,
    status,
    substituteFocus,
    missingFocus: [],
    emptyReason: status === 'fylld' ? null : 'val-kan-andras',
    changeableFields: [],
  };
}

function session(parts: PartResult[], removedParts: SessionPartFromBank[] = []): GenerationResult {
  return {
    kind: 'session',
    session: { parts, removedParts },
  } as unknown as GenerationResult;
}

describe('classifyOutcome, kompletterande fall för coreRemoved', () => {
  it('sätter coreRemoved även när ingen kärndel alls finns kvar (båda borttagna av R-033)', () => {
    // Fyller i luckan i huvudtestfilens test med samma namn: den kontrollerade bara
    // coreFilled, inte coreRemoved, trots att testnamnet handlar om borttagna kärndelar.
    const outcome = classifyOutcome(
      session([part('del-spel', 'fylld')], ['del-ovning', 'del-spelovning']),
    );
    expect(outcome).toEqual({
      pass: true,
      coreFilled: false,
      coreOnFocus: false,
      coreRemoved: true,
    });
  });

  it('sätter coreRemoved när en kärndel är borttagen (R-033) och den andra saknar övning (R-100)', () => {
    // Blandat fall som inte fanns i huvudtestfilen: en kärndel borttagen, den andra kvar
    // men tom. Kärnan ska inte räknas som fylld, men borttagningen ska synas.
    const outcome = classifyOutcome(
      session([part('del-spelovning', 'saknar-ovning'), part('del-spel', 'fylld')], ['del-ovning']),
    );
    expect(outcome).toEqual({
      pass: true,
      coreFilled: false,
      coreOnFocus: false,
      coreRemoved: true,
    });
  });

  it('coreRemoved är false när ingen kärndel är borttagen, även om kärnan inte är fylld', () => {
    const outcome = classifyOutcome(session([part('del-ovning', 'saknar-ovning')]));
    expect(outcome.coreRemoved).toBe(false);
  });
});

describe('mergeCellStats', () => {
  it('summerar fält för fält och ändrar target, inte source', () => {
    const target: CellStats = { total: 1, none: 1, coreFilled: 0, coreOnFocus: 0, coreRemoved: 0 };
    const source: CellStats = { total: 2, none: 0, coreFilled: 2, coreOnFocus: 1, coreRemoved: 1 };
    mergeCellStats(target, source);
    expect(target).toEqual({ total: 3, none: 1, coreFilled: 2, coreOnFocus: 1, coreRemoved: 1 });
    expect(source).toEqual({ total: 2, none: 0, coreFilled: 2, coreOnFocus: 1, coreRemoved: 1 });
  });

  it('en tom källa lämnar målet oförändrat', () => {
    const target: CellStats = { total: 4, none: 2, coreFilled: 1, coreOnFocus: 1, coreRemoved: 0 };
    mergeCellStats(target, emptyCellStats());
    expect(target).toEqual({ total: 4, none: 2, coreFilled: 1, coreOnFocus: 1, coreRemoved: 0 });
  });
});

describe('formatGameFormat', () => {
  it('lägger till mellanslag runt "mot" för varje spelform', () => {
    expect(formatGameFormat('3mot3')).toBe('3 mot 3');
    expect(formatGameFormat('5mot5')).toBe('5 mot 5');
    expect(formatGameFormat('7mot7')).toBe('7 mot 7');
    expect(formatGameFormat('9mot9')).toBe('9 mot 9');
    expect(formatGameFormat('11mot11')).toBe('11 mot 11');
  });
});

describe('försvar mot en ålder utanför det giltiga spannet (R-011)', () => {
  // Varken rollUpToPlanCells, sumByKind eller onlySuggested validerar sin indata mot
  // AGE_MIN/AGE_MAX (det är validateInput/R-011:s uppgift längre upp i kedjan). De här
  // testerna låser fast hur de i stället beter sig defensivt, så att ett ändrat beteende
  // upptäcks.
  it('rollUpToPlanCells hoppar tyst över en åldersnyckel utan planCellKey', () => {
    const cells = new Map<string, CellStats>([
      ['5|3mot3', { total: 3, none: 1, coreFilled: 1, coreOnFocus: 1, coreRemoved: 0 }],
    ]);
    const rolled = rollUpToPlanCells(cells);
    expect(rolled.size).toBe(0);
  });

  it('sumByKind med ett kind-filter utelämnar en åldersnyckel utanför spannet', () => {
    const cells = new Map<string, CellStats>([
      ['5|3mot3', { total: 3, none: 1, coreFilled: 1, coreOnFocus: 1, coreRemoved: 0 }],
      ['6|3mot3', { total: 2, none: 0, coreFilled: 2, coreOnFocus: 2, coreRemoved: 0 }],
    ]);
    expect(sumByKind(cells, 'foreslagen').total).toBe(2);
    expect(sumByKind(cells, 'granne').total).toBe(0);
  });

  it('sumByKind utan kind-filter räknar även en åldersnyckel utanför spannet', () => {
    // Asymmetri värd att dokumentera: utan filter läggs allt ihop oavsett om cellKind kan
    // avgöras, men med ett filter faller en sådan rad bort eftersom cellKind blir undefined.
    const cells = new Map<string, CellStats>([
      ['5|3mot3', { total: 3, none: 1, coreFilled: 1, coreOnFocus: 1, coreRemoved: 0 }],
    ]);
    expect(sumByKind(cells).total).toBe(3);
  });

  it('onlySuggested behåller inget körfall för en ålder utanför spannet', () => {
    const cases = [{ input: { alder: 5, spelform: '3mot3' as const } }];
    expect(onlySuggested(cases)).toEqual([]);
  });
});
