/**
 * Kontroll av slutkontrollen i checkSession, isolerad från genereringen och från byte
 * (ADR 0011 avsnitt 7). Testerna bygger ett `Session`-objekt för hand, så att exakt den
 * situation som ska prövas uppstår, i stället för att gissa vilket frö generatorn råkar ge.
 *
 * Kvalitetssäkring, 2026-10-05: regressionstest för utvecklarens fynd om R-082 och perioder.
 */
import { describe, expect, it } from 'vitest';
import { checkSession } from './session.ts';
import { gameExercise } from '../__testdata__/bank-fixtur.ts';
import type { Input, Row, Session } from '../types.ts';

const underlag: Input = {
  alder: 13,
  spelform: '9mot9',
  niva: 'niva-2',
  spelare: 14,
  ledare: 2,
  passlangd: 60,
  fokus: ['passning-mottagning'],
};

/** Ett minimalt men komplett pass, byggt direkt ur `rows`, utan att gå via generatorn. */
function sessionFromRows(rows: Row[]): Session {
  return {
    input: underlag,
    phase: 'fas-13-14',
    seed: 'test',
    totalMinutes: rows.reduce((sum, row) => sum + row.minutes, 0),
    requestedMinutes: underlag.passlangd,
    rows,
    parts: [],
    removedParts: [],
    notices: [],
    longestStretch: 0,
    swapped: true,
  };
}

describe('R-082 Begränsad mängd nickning, över flera rader i samma moment', () => {
  /*
   * Spelet delas av en vattenpaus i två perioder (R-037). De två raderna hör till samma
   * moment (samma block) och samma övning, och ska räknas en gång med momentets hela tid
   * (8 minuter), inte en gång per rad.
   */
  const nickspel = gameExercise({
    id: 'nick-period-game',
    fokusomraden: ['nickspel', 'passning-mottagning'],
    alder: { min: 13, max: 14 },
    spelformer: ['9mot9'],
    spelare: { min: 6, max: 14 },
    tid: { kortast: 8, rekommenderad: 8, langst: 8 },
  });

  const periodRow = (minutes: number): Row => ({
    kind: 'period',
    part: 'del-spel',
    block: 1,
    station: null,
    stationMinutes: null,
    minutes,
    exercise: nickspel,
    layout: null,
  });

  // Regressionstest för utvecklarens fynd: checkSession räknade nicktaket per rad i stället
  // för per moment, så ett spel delat i perioder (R-037) räknades två gånger.
  it(
    'R-082 räknar ett moment som delas i perioder en gång, inte en gång per period ' +
      '(utvecklarens fynd, 2026-10-02)',
    () => {
      // Momentets hela tid är 4 + 4 = 8 minuter, under taket på 10 för fas-13-14 (R-082).
      const pass = sessionFromRows([periodRow(4), periodRow(4)]);
      const headingProblems = checkSession(pass).filter((problem) => problem.startsWith('R-082'));
      expect(headingProblems).toEqual([]);
    },
  );

  it('R-082 fäller fortfarande ett moment i perioder vars hela tid är över taket', () => {
    // 6 + 6 = 12 minuter, över taket på 10 för fas-13-14.
    const pass = sessionFromRows([periodRow(6), periodRow(6)]);
    const headingProblems = checkSession(pass).filter((problem) => problem.startsWith('R-082'));
    expect(headingProblems).toEqual(['R-082: 12 minuter nickning, taket är 10']);
  });

  it('samma moment, odelat i en enda rad, ger inget R-082-problem (kontrollfall utan buggen)', () => {
    const pass = sessionFromRows([periodRow(8)]);
    const row = pass.rows[0];
    if (row !== undefined) {
      pass.rows = [{ ...row, kind: 'exercise' }];
    }
    const headingProblems = checkSession(pass).filter((problem) => problem.startsWith('R-082'));
    expect(headingProblems).toEqual([]);
  });
});
