/**
 * Tester för kontrollen `godkannande` och skrivningen av `godkand` (ADR 0013).
 *
 * Testerna matar en egen `GitReader` med innehåll i stället för att bygga ett riktigt repo.
 * Undantaget är namnbytet längst ned, som kontrollerar att `createGitReader` verkligen kör
 * `--no-renames` och därför behöver git.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse, stringify } from 'yaml';
import { reviewEntry, validExercise } from '../src/regelmotor/__testdata__/ovning-fixtur.ts';
import {
  APPROVED_STATUS,
  CONTENT_DIR,
  type GitReader,
  createGitReader,
  godkann,
  isExerciseFile,
  kontroll,
  parseArguments,
  raiseToApproved,
  readStatus,
} from './godkannande.ts';

/** En övningsfil som YAML, med den status testet vill ha. */
function exercise(status: string, overrides: Record<string, unknown> = {}): string {
  return stringify(
    validExercise({
      status,
      granskning: status === 'utkast' ? [] : [reviewEntry()],
      ...overrides,
    }),
  );
}

const PATH = `${CONTENT_DIR}/passa-och-folj.yaml`;

/**
 * En `GitReader` över två revisioner: `bas` och `huvud`. Varje revision är en karta från
 * sökväg till innehåll, och en sökväg som saknas är en fil som inte finns i revisionen.
 */
function fakeGit(
  base: Record<string, string>,
  head: Record<string, string>,
  names: { base: string; head: string } = { base: 'bas', head: 'huvud' },
): GitReader {
  const revisions: Record<string, Record<string, string>> = {
    [names.base]: base,
    [names.head]: head,
  };
  return {
    changedFiles: (from, to) => {
      const a = revisions[from] ?? {};
      const b = revisions[to] ?? {};
      return [...new Set([...Object.keys(a), ...Object.keys(b)])]
        .filter((path) => a[path] !== b[path])
        .sort();
    },
    read: (rev, path) => revisions[rev]?.[path],
    mergeBase: (a) => a,
  };
}

const CHECK = { base: 'bas', head: 'huvud' };

/** Samma läsare, men läsningen av `path` kastar, som `git show` med "Filename too long". */
function failingRead(git: GitReader, path: string): GitReader {
  return {
    ...git,
    read: (rev, candidate) => {
      if (candidate === path) {
        throw new Error(`git cat-file blob ${rev}:${path}: Filename too long`);
      }
      return git.read(rev, candidate);
    },
  };
}

describe('kontrollen godkannande', () => {
  it('S-04: underkänner en pull request som sätter godkand på en granskad övning', () => {
    const git = fakeGit({ [PATH]: exercise('granskad') }, { [PATH]: exercise('godkand') });
    const result = kontroll(git, CHECK);

    expect(result.ok).toBe(false);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]?.file).toBe(PATH);
    expect(result.findings[0]?.message).toContain(APPROVED_STATUS);
  });

  it('S-04: underkänner en ny fil som redan står i godkand', () => {
    const git = fakeGit({}, { [PATH]: exercise('godkand') });
    expect(kontroll(git, CHECK).ok).toBe(false);
  });

  it('släpper igenom en pull request som sätter granskad', () => {
    const git = fakeGit({ [PATH]: exercise('utkast') }, { [PATH]: exercise('granskad') });
    const result = kontroll(git, CHECK);

    expect(result.findings).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('släpper igenom en ändring av en övning som redan var godkand', () => {
    const git = fakeGit(
      { [PATH]: exercise('godkand') },
      { [PATH]: exercise('godkand', { ledarbehov: 1 }) },
    );
    expect(kontroll(git, CHECK).ok).toBe(true);
  });

  it('underkänner en fil som inte går att läsa i stället för att gissa', () => {
    const git = fakeGit({ [PATH]: exercise('granskad') }, { [PATH]: 'status: [inte, en, text' });
    expect(kontroll(git, CHECK).ok).toBe(false);
  });

  it('regression: ett läsfel ger ett fynd och räknas inte som en borttagen fil', () => {
    const git = failingRead(
      fakeGit({ [PATH]: exercise('granskad') }, { [PATH]: exercise('godkand') }),
      PATH,
    );
    const result = kontroll(git, CHECK);

    expect(result.ok).toBe(false);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]?.file).toBe(PATH);
    expect(result.findings[0]?.message).toContain('Filename too long');
  });
});

describe('kontrollen godkannande, omgången rör bara innehåll (S-03)', () => {
  it('underkänner en omgång som samtidigt ändrar src/', () => {
    const git = fakeGit(
      { [PATH]: exercise('utkast'), 'src/app.ts': 'a' },
      { [PATH]: exercise('granskad'), 'src/app.ts': 'b' },
    );
    const result = kontroll(git, CHECK);

    expect(result.ok).toBe(false);
    expect(result.findings[0]?.file).toBe('src/app.ts');
  });

  it('underkänner en omgång som samtidigt ändrar package.json', () => {
    const git = fakeGit(
      { [PATH]: exercise('utkast'), 'package.json': '{}' },
      { [PATH]: exercise('granskad'), 'package.json': '{ }' },
    );
    expect(kontroll(git, CHECK).ok).toBe(false);
  });

  it('släpper igenom en omgång som ändrar docs/ och content/ vid sidan av övningen', () => {
    const git = fakeGit(
      { [PATH]: exercise('utkast'), 'docs/doman/x.md': 'a', 'content/LICENSE': 'a' },
      { [PATH]: exercise('granskad'), 'docs/doman/x.md': 'b', 'content/LICENSE': 'b' },
    );
    expect(kontroll(git, CHECK).ok).toBe(true);
  });

  it('släpper igenom en pull request som bara ändrar kod, utan övningar', () => {
    const git = fakeGit({ 'src/app.ts': 'a' }, { 'src/app.ts': 'b' });
    expect(kontroll(git, CHECK).ok).toBe(true);
  });
});

describe('godkann', () => {
  const options = { before: 'bas', after: 'huvud', av: 'benbom', pr: 42, datum: '2026-09-13' };

  it('lyfter en granskad övning till godkand och lägger till granskningsraden', () => {
    const git = fakeGit({ [PATH]: exercise('utkast') }, { [PATH]: exercise('granskad') });
    const written = new Map<string, string>();

    const result = godkann(git, { ...options, write: true }, (path, text) =>
      written.set(path, text),
    );

    expect(result.ok).toBe(true);
    expect(result.files[0]?.outcome).toBe('lyft');
    const after = parse(written.get(PATH) as string) as Record<string, unknown>;
    expect(after.status).toBe(APPROVED_STATUS);
    expect((after.granskning as unknown[]).at(-1)).toEqual({
      datum: '2026-09-13',
      av: 'benbom',
      roll: 'redaktör',
      kommentar: 'Godkänd genom merge av pull request #42.',
    });
  });

  it.each(['utkast', 'atgarda', 'godkand'])('rör inte en övning i %s', (status) => {
    const git = fakeGit({}, { [PATH]: exercise(status) });
    const written: string[] = [];

    const result = godkann(git, { ...options, write: true }, (path) => written.push(path));

    expect(written).toEqual([]);
    expect(result.files[0]?.outcome).toBe('orord');
    expect(result.ok).toBe(true);
  });

  it('ändrar ingenting utan --skriv', () => {
    const git = fakeGit({ [PATH]: exercise('utkast') }, { [PATH]: exercise('granskad') });
    const written: string[] = [];

    const result = godkann(git, options, (path) => written.push(path));

    expect(written).toEqual([]);
    expect(result.written).toBe(false);
    expect(result.files[0]?.outcome).toBe('lyft');
    expect(result.files[0]?.text).toContain(`status: ${APPROVED_STATUS}`);
  });

  it('rör bara filer som omgången ändrade', () => {
    const git = fakeGit(
      { [`${CONTENT_DIR}/gammal.yaml`]: exercise('granskad') },
      {
        [`${CONTENT_DIR}/gammal.yaml`]: exercise('granskad'),
        [PATH]: exercise('granskad'),
      },
    );
    const result = godkann(git, { ...options, write: true }, () => undefined);

    expect(result.files.map((file) => file.file)).toEqual([PATH]);
  });

  it('rapporterar fel utan att skriva när filen inte går att läsa', () => {
    const git = fakeGit({}, { [PATH]: 'status: [trasig' });
    const written: string[] = [];

    const result = godkann(git, { ...options, write: true }, (path) => written.push(path));

    expect(result.ok).toBe(false);
    expect(written).toEqual([]);
  });

  it('regression: ett läsfel ger fel och räknas inte som en borttagen fil', () => {
    const git = failingRead(
      fakeGit({ [PATH]: exercise('utkast') }, { [PATH]: exercise('granskad') }),
      PATH,
    );
    const written: string[] = [];

    const result = godkann(git, { ...options, write: true }, (path) => written.push(path));

    expect(result.ok).toBe(false);
    expect(result.files[0]?.outcome).toBe('fel');
    expect(result.files[0]?.message).toContain('Filename too long');
    expect(written).toEqual([]);
  });
});

describe('skrivningen i filen', () => {
  const entry = { datum: '2026-09-13', av: 'benbom', roll: 'redaktör' };

  it('rör bara status och granskning, och behåller kommentarer och radbrytning', () => {
    const raw = ['# En kommentar överst', 'status: granskad', 'granskning: []', ''].join('\n');
    const raised = raiseToApproved(raw, entry) as { text: string };

    expect(raised.text).toBe(
      [
        '# En kommentar överst',
        'status: godkand',
        'granskning:',
        '  - datum: 2026-09-13',
        '    av: benbom',
        '    roll: redaktör',
        '',
      ].join('\n'),
    );
  });

  it('vägrar när granskning saknas som lista', () => {
    const raised = raiseToApproved('status: granskad\ngranskning: nej\n', entry);
    expect(raised).toEqual({ error: 'granskning är ingen lista' });
  });

  it('vägrar när status inte är granskad', () => {
    expect(raiseToApproved(exercise('utkast'), entry)).toEqual({
      error: 'status är inte granskad',
    });
  });

  it('behåller varje tidigare granskningsrad och varje annat fält', () => {
    const raw = exercise('granskad');
    const raised = raiseToApproved(raw, entry) as { text: string };

    const before = parse(raw) as Record<string, unknown>;
    const after = parse(raised.text) as Record<string, unknown>;
    expect(after.granskning).toEqual([...(before.granskning as unknown[]), entry]);
    expect({ ...after, status: undefined, granskning: undefined }).toEqual({
      ...before,
      status: undefined,
      granskning: undefined,
    });
  });
});

describe('argumenten', () => {
  it('läser kommando, flaggor och --skriv', () => {
    expect(parseArguments(['godkann', '--fore', 'a', '--efter', 'b', '--skriv'])).toEqual({
      command: 'godkann',
      values: new Map([
        ['--fore', 'a'],
        ['--efter', 'b'],
      ]),
      write: true,
    });
  });

  it('underkänner okänd flagga, saknat värde och saknat kommando', () => {
    expect(parseArguments(['kontroll', '--allt'])).toHaveProperty('error');
    expect(parseArguments(['kontroll', '--bas'])).toHaveProperty('error');
    expect(parseArguments([])).toHaveProperty('error');
  });
});

describe('filurvalet', () => {
  it.each([
    [`${CONTENT_DIR}/passa-och-folj.yaml`, true],
    [`${CONTENT_DIR}/_mall.yaml`, false],
    [`${CONTENT_DIR}/README.md`, false],
    [`${CONTENT_DIR}/undermapp/x.yaml`, false],
    ['content/LICENSE', false],
  ])('%s räknas som övningsfil: %s', (path, expected) => {
    expect(isExerciseFile(path)).toBe(expected);
  });

  it('läser status ur en fil och rapporterar trasig YAML', () => {
    expect(readStatus(exercise('granskad')).status).toBe('granskad');
    expect(readStatus('status: [trasig').error).toBeDefined();
  });
});

const temporary: string[] = [];

afterEach(() => {
  for (const dir of temporary.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

/**
 * Ett litet riktigt repo. Behövs bara för `createGitReader`, som är den enda delen av
 * skriptet där git självt avgör svaret.
 */
function temporaryRepo(): { dir: string; git: (...args: string[]) => string } {
  const dir = mkdtempSync(join(tmpdir(), 'godkannande-'));
  temporary.push(dir);
  const git = (...args: string[]): string =>
    execFileSync('git', args, { cwd: dir, encoding: 'utf8' });

  git('init', '--quiet', '--initial-branch=main');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'Test');
  git('config', 'commit.gpgsign', 'false');
  return { dir, git };
}

describe('createGitReader mot ett riktigt repo', () => {
  it('S-04: ett namnbyte räknas som en ny fil, så en godkänd övning som byter namn fångas', () => {
    const { dir, git } = temporaryRepo();
    const other = `${CONTENT_DIR}/passa-och-vand.yaml`;
    mkdirSync(join(dir, CONTENT_DIR), { recursive: true });
    writeFileSync(join(dir, PATH), exercise('godkand'), 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Lagg till ovning');
    const base = git('rev-parse', 'HEAD').trim();

    git('mv', PATH, other);
    git('commit', '--quiet', '--message', 'Byt namn');
    const head = git('rev-parse', 'HEAD').trim();

    const reader = createGitReader(dir);
    expect(reader.changedFiles(base, head).sort()).toEqual([other, PATH].sort());

    const result = kontroll(reader, { base, head });
    expect(result.ok).toBe(false);
    expect(result.findings.map((finding) => finding.file)).toEqual([other]);
  });

  it('läser en fil ur en revision och ger undefined för en fil som inte finns', () => {
    const { dir, git } = temporaryRepo();
    writeFileSync(join(dir, 'a.txt'), 'hej\n', 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Lagg till a');

    const reader = createGitReader(dir);
    expect(reader.read('HEAD', 'a.txt')).toBe('hej\n');
    expect(reader.read('HEAD', 'saknas.txt')).toBeUndefined();
  });

  it('läser en fil i en undermapp med sökvägen från repots rot', () => {
    const { dir, git } = temporaryRepo();
    mkdirSync(join(dir, CONTENT_DIR), { recursive: true });
    writeFileSync(join(dir, PATH), 'status: granskad\n', 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Lagg till ovning');

    const reader = createGitReader(dir);
    expect(reader.read('HEAD', PATH)).toBe('status: granskad\n');
    expect(reader.read('HEAD', `${CONTENT_DIR}/saknas.yaml`)).toBeUndefined();
  });

  it('kastar i stället för att ge undefined när revisionen inte går att läsa', () => {
    const { dir, git } = temporaryRepo();
    writeFileSync(join(dir, 'a.txt'), 'hej\n', 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Lagg till a');

    const reader = createGitReader(dir);
    expect(() => reader.read('finns-inte', 'a.txt')).toThrow(/git /);
  });
});
