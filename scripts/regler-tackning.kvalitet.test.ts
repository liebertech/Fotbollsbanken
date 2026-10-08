// Kvalitetssäkrarens kompletterande prov av kontrollen. Testnamnen innehåller avsiktligt inga
// regel-ID:n, eftersom kontrollen läser namnen i scripts/ (se regler-tackning.test.ts).
import { describe, expect, it } from 'vitest';
import { findCodeTags, findTestReferences, parseRules } from './regler-tackning.ts';

const ids = (text: string): string[] =>
  findTestReferences('src/x.test.ts', text).map((reference) => reference.id);

describe('findTestReferences och villkorade eller avstängda tester', () => {
  it('räknar ett test med skipIf eller runIf, eftersom villkoret avgörs först vid körning', () => {
    const text = [
      "it.skipIf(true)('R-001 villkorat', () => {});",
      "it.runIf(false)('R-002 villkorat', () => {});",
    ].join('\n');
    expect(ids(text)).toEqual(['R-001', 'R-002']);
  });

  it('räknar inte xit eller xdescribe, som Vitest hoppar över', () => {
    const text = [
      "xit('R-001 avstängt', () => {});",
      "xdescribe('R-002 avstängt', () => {});",
    ].join('\n');
    expect(ids(text)).toEqual([]);
  });

  it('räknar ett test i en grupp där bara gruppens namn nämner regeln, men inte ett överhoppat', () => {
    const text = [
      "describe('R-001 Grupp', () => {",
      "  it('utan regel-ID', () => {});",
      "  it.skip('R-001 överhoppat', () => {});",
      '});',
    ].join('\n');
    expect(ids(text)).toEqual(['R-001']);
  });
});

describe('radslut och gränsfall i parsningen', () => {
  it('läser en regelfil och en källfil med CRLF som radslut', () => {
    const rules = parseRules('### R-001 Nivå\r\nKrav.\r\n### R-002 Fokus *(preliminär)*\r\n');
    expect(rules.errors).toEqual([]);
    expect(rules.rules.map((rule) => [rule.id, rule.status, rule.line])).toEqual([
      ['R-001', 'gäller', 1],
      ['R-002', 'preliminär', 3],
    ]);
    const tags = findCodeTags('src/a.ts', '/**\r\n * @regel R-001\r\n * @regel R-002\r\n */\r\n');
    expect(tags.errors).toEqual([]);
    expect(tags.tags.map((tag) => [tag.id, tag.line])).toEqual([
      ['R-001', 2],
      ['R-002', 3],
    ]);
  });

  it('underkänner ett regel-ID med fyra siffror i en tagg', () => {
    expect(findCodeTags('src/a.ts', '// @regel R-0511').errors).toHaveLength(1);
  });

  it('ger ingen tagg för ett regel-ID i ett testnamn med fyra siffror', () => {
    expect(ids("it('R-0511 fyra siffror', () => {});")).toEqual([]);
  });

  it('läser en tagg på samma rad som annan text', () => {
    expect(findCodeTags('src/a.ts', 'const x = 1; // @regel R-051 och mer text').tags).toHaveLength(
      1,
    );
  });
});
