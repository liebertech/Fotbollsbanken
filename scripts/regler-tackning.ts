/**
 * Kontrollerar att varje generatorregel är spårbar i koden och har minst ett test
 * (ADR 0011 avsnitt 7, ADR 0021).
 *
 *   npm run regler:tackning
 *
 * Reglerna läses ur rubrikerna (`### R-…`) i docs/doman/generatorregler.md, inte ur en kopia,
 * så att en ny regel fäller kontrollen tills den har kod och test. Koden är `@regel R-…`-
 * taggarna i src/ utanför testfilerna. Testerna är `it` och `test` i testfilerna i src/ och
 * scripts/, de som Vitest kör. Ett test räknas för varje regel-ID i sitt namn eller i namnet
 * på en `describe` det ligger i (ADR 0021 avsnitt 2). Överhoppade tester (`skip`, `todo`,
 * `xit`) räknas inte, och en `describe` utan tester som körs ger ingen täckning.
 *
 * Skriptet skriver ut en matris med en rad per regel och avslutar med kod 1 när
 *   - en regel saknar kod eller test och inte står i undantagslistan `EXCEPTIONS`,
 *   - ett undantag inte längre behövs, eller gäller en regel som inte finns,
 *   - en tagg eller ett testnamn pekar på en regel som inte finns eller som utgår,
 *   - en `@regel`-tagg inte följs av ett regel-ID.
 *
 * Regler som utgår behöver varken kod eller test. Preliminära regler kräver samma täckning som
 * andra; den som inte byggs står i undantagslistan med motivering, som R-112.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export type RuleStatus = 'gäller' | 'preliminär' | 'utgår';

export interface Rule {
  id: string;
  title: string;
  status: RuleStatus;
  line: number;
}

/** En förekomst av ett regel-ID i koden eller i ett testnamn. */
export interface Reference {
  id: string;
  file: string;
  line: number;
}

export type Coverage = 'kod' | 'test';

export interface RuleException {
  id: string;
  /** Det som får saknas. */
  saknar: readonly Coverage[];
  motivering: string;
  hanvisning: string;
}

export interface ParsedRules {
  rules: Rule[];
  errors: string[];
}

export interface CodeTags {
  tags: Reference[];
  errors: string[];
}

export interface MatrixRow {
  rule: Rule;
  code: number;
  tests: number;
  exception?: RuleException;
}

export interface Result {
  rows: MatrixRow[];
  errors: string[];
}

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
export const RULES_FILE = join(ROOT, 'docs', 'doman', 'generatorregler.md');
const SOURCE_DIR = join(ROOT, 'src');
const SCRIPTS_DIR = join(ROOT, 'scripts');

const RULE_ID = /\bR-\d{3}\b/g;
const RULE_HEADING = /^### (R-\d+)\s+(.*)$/;

/**
 * Regler som får sakna kod eller test. Varje rad skrivs in medvetet och syns i en diff
 * (ADR 0011 avsnitt 7). Ett undantag som inte längre behövs fäller kontrollen, så att listan
 * inte blir kvar efter att regeln har byggts.
 *
 * Två slags undantag finns:
 *   - De regler som ADR 0011 avsnitt 4 räknar som inte byggda eller inte fullt testbara:
 *     R-010, R-072, R-081 och R-112. Bara de som faktiskt saknar kod eller test står här.
 *     R-010, R-072 och R-081 är byggda och testade i den del som går att bygga och testa.
 *   - Regler som hör till ett inkrement som inte är byggt än (CLAUDE.md, inkrementen i fas 4).
 *     De ska tas bort ur listan i det inkrement som bygger regeln, och kontrollen påminner om
 *     det genom att fälla ett undantag som inte längre behövs.
 */
export const EXCEPTIONS: readonly RuleException[] = [
  {
    id: 'R-106',
    saknar: ['test'],
    motivering:
      'Byte till klubbens egna övningar kräver konton och egna övningar. Fältlistan R106_REQUIRED_FIELDS finns, men bytet är inte byggt och har inget test.',
    hanvisning:
      'CLAUDE.md inkrement 4; docs/krav/backlog.md, noten om R-106; ADR 0011 avsnitt 4, grupp 11',
  },
  {
    id: 'R-110',
    saknar: ['kod', 'test'],
    motivering: 'Säsongsplanen är inte byggd.',
    hanvisning: 'CLAUDE.md inkrement 7; berättelse 24, kriterium 2; ADR 0011 avsnitt 4, grupp 12',
  },
  {
    id: 'R-111',
    saknar: ['kod', 'test'],
    motivering: 'Säsongsplanen är inte byggd.',
    hanvisning: 'CLAUDE.md inkrement 7; ADR 0011 avsnitt 4, grupp 12, raden R-111',
  },
  {
    id: 'R-112',
    saknar: ['kod', 'test'],
    motivering:
      'Preliminär och Could i backloggen. Ingår inte i berättelse 24 och byggs inte i version 1.',
    hanvisning: 'ADR 0011 avsnitt 4, grupp 12, raden R-112 (Bygg: ja, men byggs inte i version 1)',
  },
  {
    id: 'R-113',
    saknar: ['kod', 'test'],
    motivering: 'Säsongsplanen är inte byggd.',
    hanvisning: 'CLAUDE.md inkrement 7; berättelse 24, kriterium 5; ADR 0011 avsnitt 4, grupp 12',
  },
];

/** Läser reglerna ur rubrikerna i generatorregler.md, med status ur markeringen i rubriken. */
export function parseRules(markdown: string): ParsedRules {
  const rules: Rule[] = [];
  const errors: string[] = [];
  const seen = new Map<string, number>();

  markdown.split(/\r?\n/).forEach((text, index) => {
    const match = RULE_HEADING.exec(text);
    if (!match) {
      return;
    }
    const line = index + 1;
    const id = match[1] ?? '';
    const heading = (match[2] ?? '').trim();
    if (!/^R-\d{3}$/.test(id)) {
      errors.push(`generatorregler.md:${line}: regel-ID:t ${id} har inte tre siffror.`);
      return;
    }
    const previous = seen.get(id);
    if (previous !== undefined) {
      errors.push(`generatorregler.md:${line}: ${id} finns redan på rad ${previous}.`);
      return;
    }
    seen.set(id, line);

    const lower = heading.toLowerCase();
    const status: RuleStatus = lower.includes('(utgår)')
      ? 'utgår'
      : lower.includes('(preliminär)')
        ? 'preliminär'
        : 'gäller';
    const title = heading.replace(/\s*\*?\((?:utgår|preliminär)\)\*?\s*/gi, ' ').trim();
    rules.push({ id, title, status, line });
  });

  if (rules.length === 0) {
    errors.push('generatorregler.md: hittade inga regelrubriker (### R-…).');
  }
  return { rules, errors };
}

/** Samlar `@regel`-taggarna i en källfil. En tagg utan regel-ID är ett fel. */
export function findCodeTags(file: string, text: string): CodeTags {
  const tags: Reference[] = [];
  const errors: string[] = [];
  text.split(/\r?\n/).forEach((content, index) => {
    for (const match of content.matchAll(/@regel\b(.*)$/g)) {
      const tag = /^\s+(R-\d{3})\b/.exec(match[1] ?? '');
      if (tag?.[1]) {
        tags.push({ id: tag[1], file, line: index + 1 });
      } else {
        errors.push(
          `${file}:${index + 1}: @regel ska följas av ett regel-ID, till exempel @regel R-051.`,
        );
      }
    }
  });
  return { tags, errors };
}

const GROUP_FUNCTIONS = new Set(['describe', 'suite']);
const TEST_FUNCTIONS = new Set([...GROUP_FUNCTIONS, 'it', 'test']);
const SKIPPED_FUNCTIONS = new Set(['xit', 'xtest', 'xdescribe']);
const SKIPPING_MODIFIERS = new Set(['skip', 'todo']);

/**
 * Följer en anropskedja som `it`, `it.only`, `it.each(fall)` eller `describe.skip` tillbaka
 * till sin rot. Returnerar rotens namn och modifierarna längs vägen.
 */
function testCallee(expression: ts.Expression): { name: string; modifiers: string[] } | null {
  const modifiers: string[] = [];
  let current: ts.Expression = expression;
  for (;;) {
    if (ts.isIdentifier(current)) {
      return { name: current.text, modifiers };
    }
    if (ts.isPropertyAccessExpression(current)) {
      modifiers.push(current.name.text);
      current = current.expression;
    } else if (ts.isCallExpression(current)) {
      current = current.expression;
    } else {
      return null;
    }
  }
}

/** Texten i ett testnamn: en sträng, en mall eller strängar som slås ihop med `+`. */
function titleText(node: ts.Expression): string | null {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    return [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join(' ');
  }
  if (ts.isParenthesizedExpression(node)) {
    return titleText(node.expression);
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = titleText(node.left);
    const right = titleText(node.right);
    return left === null || right === null ? null : left + right;
  }
  return null;
}

/**
 * Samlar regel-ID:n per test i en testfil. Bara `it` och `test` räknas, så att varje
 * förekomst är ett test som körs (ADR 0011 avsnitt 7: minst ett test). Ett test räknas för
 * regel-ID:n i sitt eget namn och i namnen på de grupper (`describe`) det ligger i. En grupp
 * utan tester, eller där alla tester är överhoppade, ger alltså ingen täckning.
 */
export function findTestReferences(file: string, text: string): Reference[] {
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const references: Reference[] = [];

  const visit = (node: ts.Node, inherited: readonly string[]): void => {
    if (ts.isCallExpression(node)) {
      const callee = testCallee(node.expression);
      if (callee && SKIPPED_FUNCTIONS.has(callee.name)) {
        return;
      }
      const first = node.arguments[0];
      if (callee && TEST_FUNCTIONS.has(callee.name) && first) {
        if (callee.modifiers.some((modifier) => SKIPPING_MODIFIERS.has(modifier))) {
          return;
        }
        const title = titleText(first);
        const ids = [...new Set([...inherited, ...(title?.match(RULE_ID) ?? [])])];
        if (GROUP_FUNCTIONS.has(callee.name)) {
          ts.forEachChild(node, (child) => visit(child, ids));
          return;
        }
        if (title !== null) {
          const line = source.getLineAndCharacterOfPosition(first.getStart(source)).line + 1;
          for (const id of ids) {
            references.push({ id, file, line });
          }
          return;
        }
      }
    }
    ts.forEachChild(node, (child) => visit(child, inherited));
  };
  visit(source, []);
  return references;
}

/** Jämför reglerna med taggarna, testnamnen och undantagen. */
export function evaluate(
  rules: readonly Rule[],
  code: readonly Reference[],
  tests: readonly Reference[],
  exceptions: readonly RuleException[],
): Result {
  const errors: string[] = [];
  const byId = new Map(rules.map((rule) => [rule.id, rule]));
  const exceptionById = new Map<string, RuleException>();

  for (const exception of exceptions) {
    const rule = byId.get(exception.id);
    if (!rule) {
      errors.push(`Undantaget för ${exception.id} gäller en regel som inte finns.`);
    } else if (rule.status === 'utgår') {
      errors.push(
        `Undantaget för ${exception.id} behövs inte: regeln utgår och kräver varken kod eller test.`,
      );
    } else if (exceptionById.has(exception.id)) {
      errors.push(`${exception.id} står två gånger i undantagslistan.`);
    }
    if (!exception.motivering.trim() || !exception.hanvisning.trim()) {
      errors.push(`Undantaget för ${exception.id} saknar motivering eller hänvisning.`);
    }
    if (exception.saknar.length === 0) {
      errors.push(`Undantaget för ${exception.id} anger inte vad som får saknas.`);
    }
    exceptionById.set(exception.id, exception);
  }

  for (const [kind, references] of [
    ['@regel-taggen', code],
    ['testnamnet', tests],
  ] as const) {
    for (const reference of references) {
      const rule = byId.get(reference.id);
      if (!rule) {
        errors.push(
          `${reference.file}:${reference.line}: ${kind} pekar på ${reference.id}, som inte finns i generatorregler.md.`,
        );
      } else if (rule.status === 'utgår') {
        errors.push(
          `${reference.file}:${reference.line}: ${kind} pekar på ${reference.id}, som utgår. Hänvisa till regeln som ersätter den.`,
        );
      }
    }
  }

  const count = (references: readonly Reference[], id: string): number =>
    references.filter((reference) => reference.id === id).length;

  const rows = rules.map((rule): MatrixRow => {
    const row: MatrixRow = { rule, code: count(code, rule.id), tests: count(tests, rule.id) };
    const exception = exceptionById.get(rule.id);
    if (exception) {
      row.exception = exception;
    }
    if (rule.status === 'utgår') {
      return row;
    }
    const missing: Coverage[] = [];
    if (row.code === 0) missing.push('kod');
    if (row.tests === 0) missing.push('test');

    for (const coverage of missing) {
      if (!exception?.saknar.includes(coverage)) {
        errors.push(
          coverage === 'kod'
            ? `${rule.id} ${rule.title}: ingen @regel-tagg i src/.`
            : `${rule.id} ${rule.title}: inget test med regel-ID:t i namnet.`,
        );
      }
    }
    for (const coverage of exception?.saknar ?? []) {
      if (!missing.includes(coverage)) {
        errors.push(
          `Undantaget för ${rule.id} behövs inte längre för ${coverage === 'kod' ? 'koden' : 'testerna'}: ta bort det ur EXCEPTIONS.`,
        );
      }
    }
    return row;
  });

  return { rows, errors };
}

/** Matrisen med en rad per regel. */
export function formatMatrix(rows: readonly MatrixRow[]): string[] {
  const header = ['Regel', 'Status', 'Kod', 'Test', 'Anmärkning'];
  const body = rows.map(({ rule, code, tests, exception }) => {
    const note =
      rule.status === 'utgår'
        ? 'utgår, kräver inget'
        : exception
          ? `undantag (${exception.saknar.join(', ')}): ${exception.hanvisning}`
          : code === 0 || tests === 0
            ? 'SAKNAS'
            : '';
    return [rule.id, rule.status, String(code), String(tests), note];
  });
  const widths = header.map((title, column) =>
    Math.max(title.length, ...body.map((cells) => (cells[column] ?? '').length)),
  );
  const line = (cells: readonly string[]): string =>
    cells
      .map((cell, column) =>
        column === cells.length - 1 ? cell : cell.padEnd(widths[column] ?? 0),
      )
      .join('  ')
      .trimEnd();
  return [line(header), line(widths.map((width) => '-'.repeat(width))), ...body.map(line)];
}

function listFiles(dir: string, accept: (name: string) => boolean): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') {
        files.push(...listFiles(path, accept));
      }
    } else if (accept(entry.name)) {
      files.push(path);
    }
  }
  return files.sort();
}

const isTestFile = (name: string): boolean => /\.test\.tsx?$/.test(name);
const isSourceFile = (name: string): boolean => /\.tsx?$/.test(name) && !isTestFile(name);

/** Kör kontrollen. Returnerar processens slutkod: 1 om något saknas eller pekar fel. */
export function main(log: (line: string) => void = console.log): number {
  const display = (file: string): string => relative(ROOT, file).replaceAll('\\', '/');

  const parsed = parseRules(readFileSync(RULES_FILE, 'utf8'));

  const codeErrors: string[] = [];
  const code: Reference[] = [];
  for (const file of listFiles(SOURCE_DIR, isSourceFile)) {
    const found = findCodeTags(display(file), readFileSync(file, 'utf8'));
    code.push(...found.tags);
    codeErrors.push(...found.errors);
  }

  const tests = [SOURCE_DIR, SCRIPTS_DIR]
    .flatMap((dir) => listFiles(dir, isTestFile))
    .flatMap((file) => findTestReferences(display(file), readFileSync(file, 'utf8')));

  const result = evaluate(parsed.rules, code, tests, EXCEPTIONS);
  const errors = [...parsed.errors, ...codeErrors, ...result.errors];

  for (const line of formatMatrix(result.rows)) {
    log(line);
  }
  log('');

  const counted = result.rows.filter((row) => row.rule.status !== 'utgår').length;
  if (errors.length === 0) {
    log(
      `${result.rows.length} regler, varav ${counted} som gäller eller är preliminära. ` +
        `Alla har @regel-tagg och test, utom ${EXCEPTIONS.length} med undantag.`,
    );
    return 0;
  }
  for (const error of errors) {
    log(error);
  }
  log('');
  log(`${errors.length} fel. Se ADR 0011 avsnitt 7 för konventionen.`);
  return 1;
}

const invokedDirectly =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exitCode = main();
}
