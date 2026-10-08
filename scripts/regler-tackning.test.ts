// Testnamnen här innehåller avsiktligt inga regel-ID:n: kontrollen läser testnamnen i
// scripts/, och ett påhittat ID i ett namn skulle fälla den. Fixturerna står i testkropparna.
import { describe, expect, it } from 'vitest';
import {
  EXCEPTIONS,
  type Reference,
  type Rule,
  type RuleException,
  evaluate,
  findCodeTags,
  findTestReferences,
  formatMatrix,
  parseRules,
} from './regler-tackning.ts';

const ref = (id: string, file = 'src/a.ts', line = 1): Reference => ({ id, file, line });

const rule = (id: string, status: Rule['status'] = 'gäller'): Rule => ({
  id,
  title: `Regel ${id}`,
  status,
  line: 1,
});

const exception = (id: string, saknar: RuleException['saknar']): RuleException => ({
  id,
  saknar,
  motivering: 'Byggs i ett senare inkrement.',
  hanvisning: 'ADR 0011 avsnitt 4',
});

describe('parseRules läser regelrubrikerna', () => {
  const markdown = [
    '# Generatorregler',
    '## Grupp 1',
    '### R-001 Nivå är en lista',
    'Krav. Text.',
    '### R-112 Fokus som inte har förekommit på länge *(preliminär)*',
    '### R-040 Gammal regel *(utgår)*',
    '### Algoritmval som senior-systemutvecklare äger',
    '#### R-002 är ingen rubrik på rätt nivå',
    '| R-003 | en tabellrad räknas inte |',
  ].join('\r\n');

  it('tar bara rubriker på nivå tre som börjar med ett regel-ID', () => {
    const { rules, errors } = parseRules(markdown);
    expect(errors).toEqual([]);
    expect(rules.map((r) => r.id)).toEqual(['R-001', 'R-112', 'R-040']);
  });

  it('läser status ur markeringen i rubriken och tar bort markeringen ur titeln', () => {
    const { rules } = parseRules(markdown);
    expect(rules.map((r) => [r.status, r.title])).toEqual([
      ['gäller', 'Nivå är en lista'],
      ['preliminär', 'Fokus som inte har förekommit på länge'],
      ['utgår', 'Gammal regel'],
    ]);
    expect(rules[0]?.line).toBe(3);
  });

  it('underkänner ett regel-ID som förekommer två gånger', () => {
    const { errors } = parseRules('### R-001 A\n### R-001 B\n');
    expect(errors).toEqual(['generatorregler.md:2: R-001 finns redan på rad 1.']);
  });

  it('underkänner ett regel-ID utan tre siffror', () => {
    const { rules, errors } = parseRules('### R-01 A\n### R-0001 B\n');
    expect(rules).toEqual([]);
    expect(errors).toHaveLength(3);
  });

  it('underkänner en fil utan regelrubriker', () => {
    expect(parseRules('# Tom\n').errors).toEqual([
      'generatorregler.md: hittade inga regelrubriker (### R-…).',
    ]);
  });
});

describe('findCodeTags samlar @regel-taggarna', () => {
  it('tar varje tagg med fil och rad', () => {
    const text =
      '/**\n * Text.\n *\n * @regel R-051\n * @regel R-052\n */\nexport function f() {}\n';
    expect(findCodeTags('src/x.ts', text)).toEqual({
      tags: [ref('R-051', 'src/x.ts', 4), ref('R-052', 'src/x.ts', 5)],
      errors: [],
    });
  });

  it('räknar inte ett regel-ID i en vanlig kommentar som en tagg', () => {
    expect(findCodeTags('src/x.ts', '// R-120: materialtypen ovrigt\n').tags).toEqual([]);
  });

  it('underkänner en tagg som inte följs av ett regel-ID', () => {
    const { tags, errors } = findCodeTags('src/x.ts', ' * @regel\n * @regel R-51\n * @regel x\n');
    expect(tags).toEqual([]);
    expect(errors).toHaveLength(3);
    expect(errors[0]).toMatch(/^src\/x\.ts:1: @regel ska följas av ett regel-ID/);
  });
});

describe('findTestReferences läser regel-ID:n i testnamnen', () => {
  const ids = (text: string, file = 'src/x.test.ts'): string[] =>
    findTestReferences(file, text).map((r) => r.id);

  it('läser it och test med regel-ID:t i namnet eller i gruppens namn', () => {
    const text = [
      "describe('R-051 Antal grupper', () => {",
      "  it('R-051 delar 13 spelare i 7 och 6', () => {});",
      "  test('villkor 5 visar inte en övning två gånger (R-070)', () => {});",
      '});',
    ].join('\n');
    expect(ids(text)).toEqual(['R-051', 'R-051', 'R-070']);
  });

  it('läser varje regel en gång per namn, även när den nämns flera gånger', () => {
    expect(ids("it('R-104 ger alternativ som R-105 kan byta in, R-104 igen', () => {});")).toEqual([
      'R-104',
      'R-105',
    ]);
  });

  it('läser namn i mallar, sammanslagna strängar och each-tabeller', () => {
    const text = [
      'it(`R-058 testfall ${n} R-052`, () => {});',
      "it(\n  'R-082 räknar ett moment ' +\n    'en gång (R-065)',\n  () => {},\n);",
      "it.each(fall)('R-101 skapar inget pass för $namn', () => {});",
      "describe.each([1, 2])('R-034 för %s', () => { it('körs', () => {}); });",
    ].join('\n');
    expect(ids(text)).toEqual(['R-058', 'R-052', 'R-082', 'R-065', 'R-101', 'R-034']);
  });

  it('anger raden där namnet står', () => {
    const text = "\n\nit(\n  'R-049 ger ett giltigt pass',\n  () => {},\n);\n";
    expect(findTestReferences('src/x.test.ts', text)).toEqual([ref('R-049', 'src/x.test.ts', 4)]);
  });

  it('räknar inte överhoppade tester, inte heller de som ligger i en överhoppad grupp', () => {
    const text = [
      "it.skip('R-001 hoppas över', () => {});",
      "it.todo('R-002 ska skrivas');",
      "describe.skip('Grupp', () => { it('R-003 inne i en överhoppad grupp', () => {}); });",
      "it.only('R-004 körs', () => {});",
      "it.concurrent('R-005 körs', () => {});",
    ].join('\n');
    expect(ids(text)).toEqual(['R-004', 'R-005']);
  });

  it('räknar inte en grupp utan tester eller där alla tester är överhoppade', () => {
    const text = [
      "describe('R-091 Ytornas mått', () => {",
      "  it.skip('R-091 hoppas över', () => {});",
      "  it.todo('ska skrivas');",
      '});',
      "describe('R-092 Tom grupp', () => {});",
      "describe('R-093 Yttre', () => { describe('inre', () => { it.skip('x', () => {}); }); });",
    ].join('\n');
    expect(ids(text)).toEqual([]);
  });

  it('räknar ett test en gång per regel i gruppens och testets namn tillsammans', () => {
    const text = [
      "describe('R-058 Grupper', () => {",
      "  describe('R-052 och R-058 stationer', () => {",
      "    it('testfall 19', () => {});",
      "    it('R-065 testfall 20', () => {});",
      '  });',
      '});',
    ].join('\n');
    expect(findTestReferences('src/x.test.ts', text)).toEqual([
      ref('R-058', 'src/x.test.ts', 3),
      ref('R-052', 'src/x.test.ts', 3),
      ref('R-058', 'src/x.test.ts', 4),
      ref('R-052', 'src/x.test.ts', 4),
      ref('R-065', 'src/x.test.ts', 4),
    ]);
  });

  it('räknar inte regel-ID:n utanför testnamnen', () => {
    const text = [
      "it('räknar ett pass', () => {",
      "  expect(problems).toContain('R-070: förekommer två gånger');",
      '});',
      "const namn = 'R-099';",
      'it(namn, () => {});',
    ].join('\n');
    expect(ids(text)).toEqual([]);
  });

  it('läser tsx-filer', () => {
    const text = "it('R-058 visar gruppen', () => { render(<Kort grupp={2} />); });";
    expect(ids(text, 'src/x.test.tsx')).toEqual(['R-058']);
  });
});

describe('evaluate jämför reglerna med koden, testerna och undantagen', () => {
  it('godkänner när varje regel har en tagg och ett test', () => {
    const result = evaluate([rule('R-001')], [ref('R-001')], [ref('R-001')], []);
    expect(result.errors).toEqual([]);
    expect(result.rows).toEqual([{ rule: rule('R-001'), code: 1, tests: 1 }]);
  });

  it('underkänner en regel som saknar tagg eller test', () => {
    const result = evaluate(
      [rule('R-001'), rule('R-002'), rule('R-003')],
      [ref('R-001'), ref('R-003')],
      [ref('R-001'), ref('R-002')],
      [],
    );
    expect(result.errors).toEqual([
      'R-002 Regel R-002: ingen @regel-tagg i src/.',
      'R-003 Regel R-003: inget test med regel-ID:t i namnet.',
    ]);
  });

  it('kräver täckning också av en preliminär regel', () => {
    const result = evaluate([rule('R-112', 'preliminär')], [], [], []);
    expect(result.errors).toHaveLength(2);
  });

  it('kräver varken tagg eller test av en regel som utgår', () => {
    const result = evaluate([rule('R-040', 'utgår')], [], [], []);
    expect(result.errors).toEqual([]);
  });

  it('godtar det som undantaget säger får saknas, men inget mer', () => {
    const rules = [rule('R-110'), rule('R-106')];
    const exceptions = [exception('R-110', ['kod', 'test']), exception('R-106', ['test'])];
    expect(evaluate(rules, [ref('R-106')], [], exceptions).errors).toEqual([]);
    expect(evaluate(rules, [], [], exceptions).errors).toEqual([
      'R-106 Regel R-106: ingen @regel-tagg i src/.',
    ]);
  });

  it('underkänner ett undantag som inte längre behövs', () => {
    const result = evaluate(
      [rule('R-110')],
      [ref('R-110')],
      [],
      [exception('R-110', ['kod', 'test'])],
    );
    expect(result.errors).toEqual([
      'Undantaget för R-110 behövs inte längre för koden: ta bort det ur EXCEPTIONS.',
    ]);
  });

  it('underkänner ett undantag för en regel som inte finns eller som utgår', () => {
    const result = evaluate(
      [rule('R-040', 'utgår')],
      [],
      [],
      [exception('R-999', ['test']), exception('R-040', ['test'])],
    );
    expect(result.errors).toEqual([
      'Undantaget för R-999 gäller en regel som inte finns.',
      'Undantaget för R-040 behövs inte: regeln utgår och kräver varken kod eller test.',
    ]);
  });

  it('underkänner ett undantag utan motivering, hänvisning eller innehåll', () => {
    const result = evaluate(
      [rule('R-001')],
      [ref('R-001')],
      [ref('R-001')],
      [{ id: 'R-001', saknar: [], motivering: ' ', hanvisning: '' }],
    );
    expect(result.errors).toEqual([
      'Undantaget för R-001 saknar motivering eller hänvisning.',
      'Undantaget för R-001 anger inte vad som får saknas.',
    ]);
  });

  it('underkänner en tagg eller ett testnamn som pekar på en regel som inte finns', () => {
    const result = evaluate(
      [rule('R-001')],
      [ref('R-001'), ref('R-999', 'src/b.ts', 7)],
      [ref('R-001'), ref('R-998', 'src/b.test.ts', 3)],
      [],
    );
    expect(result.errors).toEqual([
      'src/b.ts:7: @regel-taggen pekar på R-999, som inte finns i generatorregler.md.',
      'src/b.test.ts:3: testnamnet pekar på R-998, som inte finns i generatorregler.md.',
    ]);
  });

  it('underkänner en tagg eller ett testnamn som pekar på en regel som utgår', () => {
    const result = evaluate([rule('R-040', 'utgår')], [ref('R-040')], [ref('R-040')], []);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toMatch(/pekar på R-040, som utgår/);
  });
});

describe('formatMatrix skriver en rad per regel', () => {
  it('visar status, antal och vad som saknas eller är undantaget', () => {
    const lines = formatMatrix([
      { rule: rule('R-001'), code: 2, tests: 10 },
      { rule: rule('R-002'), code: 0, tests: 1 },
      { rule: rule('R-040', 'utgår'), code: 0, tests: 0 },
      {
        rule: rule('R-112', 'preliminär'),
        code: 0,
        tests: 0,
        exception: exception('R-112', ['kod', 'test']),
      },
    ]);
    expect(lines).toEqual([
      'Regel  Status      Kod  Test  Anmärkning',
      '-----  ----------  ---  ----  ----------------------------------------',
      'R-001  gäller      2    10',
      'R-002  gäller      0    1     SAKNAS',
      'R-040  utgår       0    0     utgår, kräver inget',
      'R-112  preliminär  0    0     undantag (kod, test): ADR 0011 avsnitt 4',
    ]);
  });
});

describe('undantagslistan', () => {
  it('har en motivering och en hänvisning för varje undantag', () => {
    for (const entry of EXCEPTIONS) {
      expect(entry.motivering.trim()).not.toBe('');
      expect(entry.hanvisning.trim()).not.toBe('');
      expect(entry.saknar.length).toBeGreaterThan(0);
    }
  });
});
