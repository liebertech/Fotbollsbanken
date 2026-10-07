/**
 * Tester för ikappskrivningen i `godkannande.ts` (ADR 0020): tolkningen av API-svaren, uppslaget
 * av pull requesten, planen och skrivningen av planen.
 *
 * Regressionen för pull request #15: körningen 36387044602 föll med "unexpected end of JSON input"
 * när `gh api` fick ett tomt svar strax efter mergen. Testerna under "uppslaget av pull requesten"
 * återskapar det svaret.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse, stringify } from 'yaml';
import { reviewEntry, validExercise } from '../src/regelmotor/__testdata__/ovning-fixtur.ts';
import {
  APPROVED_STATUS,
  CONTENT_DIR,
  type ApiGet,
  type HistoryReader,
  type Plan,
  type RetryOptions,
  createHistoryReader,
  main,
  parseCommitPulls,
  parseJson,
  parsePlan,
  parsePullRequest,
  planera,
  pullNumberFromMessage,
  resolvePullRequest,
  tillampa,
  withRetry,
} from './godkannande.ts';

function exercise(status: string, overrides: Record<string, unknown> = {}): string {
  return stringify(
    validExercise({
      status,
      granskning: status === 'utkast' ? [] : [reviewEntry()],
      ...overrides,
    }),
  );
}

const sha = (text: string): string => createHash('sha1').update(text).digest('hex');

const MERGE_15 = sha('merge 15');
const MERGE_17 = sha('merge 17');
const HEAD = sha('head');

const A = `${CONTENT_DIR}/a-ovning.yaml`;
const B = `${CONTENT_DIR}/b-ovning.yaml`;
const C = `${CONTENT_DIR}/c-ovning.yaml`;

/** Inga pauser i testerna, men samma antal försök som i arbetsflödet. */
const NO_WAIT: RetryOptions = { attempts: 5, delay: () => 0, sleep: () => undefined };

function pullJson(
  number: number,
  mergeSha: string | null,
  login: string | null = 'benbom',
): string {
  return JSON.stringify({
    number,
    merged_at: mergeSha === null ? null : '2026-09-28T06:33:10Z',
    merge_commit_sha: mergeSha,
    merged_by: login === null ? null : { login },
  });
}

/** Ett API som svarar ur en karta, och som kan ge ett antal tomma svar först. */
function fakeApi(responses: Record<string, string | string[]>): ApiGet & { calls: string[] } {
  const queues = new Map(
    Object.entries(responses).map(([path, value]) => [
      path,
      Array.isArray(value) ? [...value] : [value],
    ]),
  );
  const calls: string[] = [];
  const api = ((path: string) => {
    calls.push(path);
    const queue = queues.get(path);
    if (queue === undefined || queue.length === 0) {
      throw new Error(`HTTP 404 för ${path}`);
    }
    return queue.length > 1 ? (queue.shift() as string) : (queue[0] as string);
  }) as ApiGet & { calls: string[] };
  api.calls = calls;
  return api;
}

/**
 * En `HistoryReader` över namngivna revisioner. `last` säger vilken commit som senast ändrade
 * en fil, och `messages` vad commiten heter. Revisionen `HEAD` nås också med sin sha.
 */
function fakeHistory(
  revisions: Record<string, Record<string, string>>,
  last: Record<string, string>,
  messages: Record<string, string>,
): HistoryReader {
  const at = (rev: string): Record<string, string> | undefined =>
    revisions[rev === HEAD ? 'HEAD' : rev];
  return {
    changedFiles: () => [],
    read: (rev, path) => at(rev)?.[path],
    mergeBase: (a) => a,
    listFiles: (rev) => Object.keys(at(rev) ?? {}),
    lastChange: (_rev, path) => last[path],
    message: (commit) => messages[commit] ?? '',
    blob: (rev, path) => {
      const text = at(rev)?.[path];
      return text === undefined ? undefined : sha(text);
    },
    resolve: (rev) => (rev === 'HEAD' ? HEAD : rev),
    isAncestor: (ancestor) => ancestor === HEAD || revisions[ancestor] !== undefined,
  };
}

describe('tolkningen av API-svaren', () => {
  it('ett tomt svar ger ett begripligt fel i stället för "unexpected end of JSON input"', () => {
    expect(() => parseJson('', 'pull request')).toThrow('pull request: tomt svar');
    expect(() => parseJson('  \n', 'pull request')).toThrow('tomt svar');
  });

  it('ett svar som inte är JSON ger ett fel som säger vad som lästes', () => {
    expect(() => parseJson('<html>', 'pull request')).toThrow(/pull request: svaret är inte JSON/);
  });

  it('läser en mergad pull request', () => {
    expect(parsePullRequest(pullJson(15, MERGE_15))).toEqual({
      number: 15,
      mergedAt: '2026-09-28T06:33:10Z',
      mergeCommitSha: MERGE_15,
      mergedBy: 'benbom',
    });
  });

  it('läser en pull request som inte är mergad', () => {
    expect(parsePullRequest(pullJson(15, null, null))).toMatchObject({
      mergedAt: null,
      mergedBy: null,
    });
  });

  it('kastar för ett svar utan number och för ett tomt svar', () => {
    expect(() => parsePullRequest('{}')).toThrow('saknar number');
    expect(() => parsePullRequest('')).toThrow('tomt svar');
  });

  it('läser bara de mergade ur commitens pull requests', () => {
    const text = JSON.stringify([
      { number: 3, merged_at: null },
      { number: 15, merged_at: '2026-09-28T06:33:10Z' },
    ]);
    expect(parseCommitPulls(text)).toEqual([15]);
    expect(parseCommitPulls('[]')).toEqual([]);
    expect(() => parseCommitPulls('')).toThrow('tomt svar');
    expect(() => parseCommitPulls('{}')).toThrow('ingen lista');
  });

  it.each([
    ['Merge pull request #15 from liebertech/omgang/4-9mot9-och-luckor\n\nText', 15],
    ['Sätt godkand på omgången från pull request #11', undefined],
    ['Lägg till övning (#12)', undefined],
  ])('läser numret ur %j', (message, expected) => {
    expect(pullNumberFromMessage(message)).toBe(expected);
  });
});

describe('försöken', () => {
  it('försöker igen efter ett fel och väntar däremellan', () => {
    const waits: number[] = [];
    let calls = 0;
    const value = withRetry(
      () => {
        calls += 1;
        if (calls < 3) {
          throw new Error('tomt svar');
        }
        return 'ok';
      },
      { attempts: 5, delay: (attempt) => attempt * 10, sleep: (ms) => waits.push(ms) },
    );
    expect(value).toBe('ok');
    expect(waits).toEqual([10, 20]);
  });

  it('kastar det sista felet när försöken är slut', () => {
    let calls = 0;
    expect(() =>
      withRetry(() => {
        calls += 1;
        throw new Error(`fel ${calls}`);
      }, NO_WAIT),
    ).toThrow('fel 5');
    expect(calls).toBe(5);
  });
});

describe('uppslaget av pull requesten', () => {
  const message15 = 'Merge pull request #15 from liebertech/omgang/4-9mot9-och-luckor';

  it('regression #15: ett tomt svar strax efter mergen fäller inte uppslaget', () => {
    const api = fakeApi({ 'pulls/15': ['', '', pullJson(15, MERGE_15)] });
    expect(resolvePullRequest(api, MERGE_15, message15, NO_WAIT)).toEqual({
      pr: 15,
      av: 'benbom',
    });
    expect(api.calls).toEqual(['pulls/15', 'pulls/15', 'pulls/15']);
  });

  it('regression #15: tomma svar hela vägen ger ett fel, aldrig ett tyst "ingenting att göra"', () => {
    const api = fakeApi({ 'pulls/15': '' });
    const result = resolvePullRequest(api, MERGE_15, message15, NO_WAIT);
    expect(result).toHaveProperty('error');
    expect((result as { error: string }).error).toContain('tomt svar');
  });

  it('använder inte commits/{sha}/pulls när meddelandet har ett nummer', () => {
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_15) });
    resolvePullRequest(api, MERGE_15, message15, NO_WAIT);
    expect(api.calls).toEqual(['pulls/15']);
  });

  it('godtar inte ett nummer i meddelandet som hör till en annan commit', () => {
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_17) });
    const result = resolvePullRequest(api, MERGE_15, message15, NO_WAIT);
    expect((result as { error: string }).error).toContain(`#15 kom in med ${MERGE_17}`);
  });

  it('godtar inte en pull request som inte är mergad', () => {
    const api = fakeApi({ 'pulls/15': pullJson(15, null, null) });
    const result = resolvePullRequest(api, MERGE_15, message15, NO_WAIT);
    expect((result as { error: string }).error).toContain('#15 är inte mergad');
  });

  it('F6: frågar commits/{sha}/pulls när numret i meddelandet hör till en annan commit', () => {
    // Meddelandet skrevs om vid mergen och pekar på #15, men mergen är #17:s.
    const api = fakeApi({
      'pulls/15': pullJson(15, MERGE_15),
      [`commits/${MERGE_17}/pulls`]: JSON.stringify([{ number: 17, merged_at: 'x' }]),
      'pulls/17': pullJson(17, MERGE_17),
    });
    expect(resolvePullRequest(api, MERGE_17, message15, NO_WAIT)).toEqual({
      pr: 17,
      av: 'benbom',
    });
    expect(api.calls).toEqual(['pulls/15', `commits/${MERGE_17}/pulls`, 'pulls/17']);
  });

  it('F6: frågar inte samma pull request två gånger när commits/{sha}/pulls ger samma nummer', () => {
    const api = fakeApi({
      'pulls/15': pullJson(15, MERGE_17),
      [`commits/${MERGE_15}/pulls`]: JSON.stringify([{ number: 15, merged_at: 'x' }]),
    });
    const result = resolvePullRequest(api, MERGE_15, message15, NO_WAIT);
    expect((result as { error: string }).error).toContain(`#15 kom in med ${MERGE_17}`);
    expect(api.calls).toEqual(['pulls/15', `commits/${MERGE_15}/pulls`]);
  });

  it('frågar commits/{sha}/pulls när meddelandet saknar nummer, och väntar ut en tom lista', () => {
    const api = fakeApi({
      [`commits/${MERGE_15}/pulls`]: ['[]', JSON.stringify([{ number: 15, merged_at: 'x' }])],
      'pulls/15': pullJson(15, MERGE_15),
    });
    expect(resolvePullRequest(api, MERGE_15, 'Egen titel', NO_WAIT)).toEqual({
      pr: 15,
      av: 'benbom',
    });
  });

  it('ger fel när ingen pull request hittas för commiten', () => {
    const api = fakeApi({ [`commits/${MERGE_15}/pulls`]: '[]' });
    const result = resolvePullRequest(api, MERGE_15, 'Egen titel', NO_WAIT);
    expect((result as { error: string }).error).toContain('ingen mergad pull request');
  });
});

describe('planen', () => {
  const messages = {
    [MERGE_15]: 'Merge pull request #15 from liebertech/omgang',
    [MERGE_17]: 'Merge pull request #17 from liebertech/ytreferenser',
  };

  it('tar med varje granskad övning och knyter den till den merge som senast ändrade den', () => {
    const a = exercise('granskad');
    const b = exercise('granskad', { ledarbehov: 2 });
    const git = fakeHistory(
      {
        HEAD: { [A]: a, [B]: b, [C]: exercise('godkand') },
        [MERGE_15]: { [A]: a },
        [MERGE_17]: { [B]: b },
      },
      { [A]: MERGE_15, [B]: MERGE_17, [C]: MERGE_15 },
      messages,
    );
    const api = fakeApi({
      'pulls/15': pullJson(15, MERGE_15),
      'pulls/17': pullJson(17, MERGE_17),
    });

    const { plan, findings } = planera(git, api, 'HEAD', NO_WAIT);

    expect(findings).toEqual([]);
    expect(plan).toEqual({
      version: 1,
      bas: HEAD,
      poster: [
        { fil: A, blob: sha(a), commit: MERGE_15, pr: 15, av: 'benbom' },
        { fil: B, blob: sha(b), commit: MERGE_17, pr: 17, av: 'benbom' },
      ],
    });
  });

  it.each(['utkast', 'atgarda', 'godkand'])('tar inte med en övning i %s', (status) => {
    const git = fakeHistory({ HEAD: { [A]: exercise(status) } }, { [A]: MERGE_15 }, messages);
    expect(planera(git, fakeApi({}), 'HEAD', NO_WAIT).plan.poster).toEqual([]);
  });

  it('frågar API:t en gång per merge, inte en gång per fil', () => {
    const a = exercise('granskad');
    const b = exercise('granskad', { ledarbehov: 2 });
    const git = fakeHistory(
      { HEAD: { [A]: a, [B]: b }, [MERGE_15]: { [A]: a, [B]: b } },
      { [A]: MERGE_15, [B]: MERGE_15 },
      messages,
    );
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_15) });

    expect(planera(git, api, 'HEAD', NO_WAIT).plan.poster).toHaveLength(2);
    expect(api.calls).toEqual(['pulls/15']);
  });

  it('rapporterar fel för en fil vars merge saknar pull request', () => {
    const a = exercise('granskad');
    const git = fakeHistory(
      { HEAD: { [A]: a }, [MERGE_15]: { [A]: a } },
      { [A]: MERGE_15 },
      { [MERGE_15]: 'En direkt commit' },
    );
    const api = fakeApi({ [`commits/${MERGE_15}/pulls`]: '[]' });

    const { plan, findings } = planera(git, api, 'HEAD', NO_WAIT);
    expect(plan.poster).toEqual([]);
    expect(findings[0]?.file).toBe(A);
  });

  it('rapporterar fel för en granskad fil som skriptet inte kan lyfta', () => {
    const git = fakeHistory(
      { HEAD: { [A]: 'status: granskad\ngranskning: nej\n' } },
      { [A]: MERGE_15 },
      messages,
    );
    const { findings } = planera(git, fakeApi({}), 'HEAD', NO_WAIT);
    expect(findings).toEqual([{ file: A, message: 'granskning är ingen lista' }]);
  });

  it('gränsfall: meddelandet nämner ett annat nummer än det verkliga ger ett fel i planen, inte en felaktig post', () => {
    const a = exercise('granskad');
    // Meddelandet pekar på #15, men den pull requesten kom in med en annan commit (MERGE_17).
    const git = fakeHistory(
      { HEAD: { [A]: a }, [MERGE_15]: { [A]: a } },
      { [A]: MERGE_15 },
      { [MERGE_15]: 'Merge pull request #15 from liebertech/fel-gren' },
    );
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_17) });

    const { plan, findings } = planera(git, api, 'HEAD', NO_WAIT);
    expect(plan.poster).toEqual([]);
    expect(findings).toHaveLength(1);
    expect(findings[0]?.file).toBe(A);
    expect(findings[0]?.message).toContain(`#15 kom in med ${MERGE_17}`);
  });

  it('gränsfall: en fil som tagits bort sedan den stod i granskad finns inte med i planen och ger inget fel', () => {
    const a = exercise('granskad');
    // B fanns i granskad vid ett tidigare tillfälle men är borttagen vid bas: listFiles(bas, …)
    // visar bara A, så B kan aldrig bli ett fynd eller en post.
    const git = fakeHistory(
      { HEAD: { [A]: a }, [MERGE_15]: { [A]: a } },
      { [A]: MERGE_15 },
      { [MERGE_15]: 'Merge pull request #15 from liebertech/omgang' },
    );
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_15) });

    const { plan, findings } = planera(git, api, 'HEAD', NO_WAIT);
    expect(findings).toEqual([]);
    expect(plan.poster.map((entry) => entry.fil)).toEqual([A]);
  });

  /*
   * Regression 2026-10-07: `git show` föll på Windows med "Filename too long" för en övning,
   * läsaren gav `undefined` och torrkörningen listade 29 i stället för 30 utan något fel.
   */
  const ab = (): HistoryReader =>
    fakeHistory(
      {
        HEAD: { [A]: exercise('granskad'), [B]: exercise('granskad') },
        [MERGE_15]: { [A]: exercise('granskad'), [B]: exercise('granskad') },
      },
      { [A]: MERGE_15, [B]: MERGE_15 },
      messages,
    );

  it('regression: en fil som listas men ger undefined vid läsningen blir ett fynd', () => {
    const git = ab();
    const reader: HistoryReader = {
      ...git,
      read: (rev, path) => (path === B ? undefined : git.read(rev, path)),
    };
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_15) });

    const { findings } = planera(reader, api, 'HEAD', NO_WAIT);
    expect(findings).toEqual([{ file: B, message: `listas i ${HEAD} men går inte att läsa` }]);
  });

  it('regression: en fil som listas men vars läsning kastar blir ett fynd', () => {
    const git = ab();
    const reader: HistoryReader = {
      ...git,
      read: (rev, path) => {
        if (path === B) {
          throw new Error(`git cat-file blob ${rev}:${path}: Filename too long`);
        }
        return git.read(rev, path);
      },
    };
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_15) });

    const { findings } = planera(reader, api, 'HEAD', NO_WAIT);
    expect(findings).toHaveLength(1);
    expect(findings[0]?.file).toBe(B);
    expect(findings[0]?.message).toContain('Filename too long');
  });
});

describe('tolkningen av planen', () => {
  const plan: Plan = {
    version: 1,
    bas: HEAD,
    poster: [{ fil: A, blob: sha('a'), commit: MERGE_15, pr: 15, av: 'benbom' }],
  };

  it('läser tillbaka en plan som skrivits som JSON', () => {
    expect(parsePlan(JSON.stringify(plan))).toEqual(plan);
  });

  it('ett tomt svar är ett fel, inte en tom plan', () => {
    expect(parsePlan('')).toEqual({ error: 'planen: tomt svar' });
  });

  it.each([
    ['fel version', { ...plan, version: 2 }],
    ['ogiltig bas', { ...plan, bas: 'main' }],
    ['ingen övningsfil', { ...plan, poster: [{ ...plan.poster[0], fil: 'src/app.ts' }] }],
    ['ogiltig blob', { ...plan, poster: [{ ...plan.poster[0], blob: 'x' }] }],
    ['negativt nummer', { ...plan, poster: [{ ...plan.poster[0], pr: -1 }] }],
    ['konto med radbrytning', { ...plan, poster: [{ ...plan.poster[0], av: 'a\nstatus: x' }] }],
    ['samma fil två gånger', { ...plan, poster: [plan.poster[0], plan.poster[0]] }],
  ])('underkänner en plan med %s', (_name, broken) => {
    expect(parsePlan(JSON.stringify(broken))).toHaveProperty('error');
  });
});

describe('skrivningen av planen', () => {
  const a = exercise('granskad');
  const b = exercise('granskad', { ledarbehov: 2 });
  const plan: Plan = {
    version: 1,
    bas: HEAD,
    poster: [
      { fil: A, blob: sha(a), commit: MERGE_15, pr: 15, av: 'benbom' },
      { fil: B, blob: sha(b), commit: MERGE_17, pr: 17, av: 'benbom' },
    ],
  };
  const last = { [A]: MERGE_15, [B]: MERGE_17 };
  const messages = {
    [MERGE_15]: 'Merge pull request #15 from liebertech/omgang',
    [MERGE_17]: 'Merge pull request #17 from liebertech/ytreferenser',
  };
  const okApi = (): ApiGet =>
    fakeApi({ 'pulls/15': pullJson(15, MERGE_15), 'pulls/17': pullJson(17, MERGE_17) });

  it('lyfter varje fil med granskningsraden för sin egen pull request', () => {
    const git = fakeHistory(
      { HEAD: { [A]: a, [B]: b }, [MERGE_15]: { [A]: a }, [MERGE_17]: { [B]: b } },
      last,
      messages,
    );
    const written = new Map<string, string>();

    const result = tillampa(
      git,
      okApi(),
      plan,
      { datum: '2026-10-05', write: true },
      (path, text) => written.set(path, text),
    );

    expect(result.ok).toBe(true);
    expect(result.written).toBe(true);
    const after = parse(written.get(B) as string) as Record<string, unknown>;
    expect(after.status).toBe(APPROVED_STATUS);
    expect((after.granskning as unknown[]).at(-1)).toEqual({
      datum: '2026-10-05',
      av: 'benbom',
      roll: 'redaktör',
      kommentar: 'Godkänd genom merge av pull request #17.',
    });
  });

  it('ändrar bara status och granskning, inget annat fält i övningen', () => {
    const git = fakeHistory(
      { HEAD: { [A]: a, [B]: b }, [MERGE_15]: { [A]: a }, [MERGE_17]: { [B]: b } },
      last,
      messages,
    );
    const written = new Map<string, string>();

    tillampa(git, okApi(), plan, { datum: '2026-10-05', write: true }, (path, text) =>
      written.set(path, text),
    );

    const before = parse(b) as Record<string, unknown>;
    const after = parse(written.get(B) as string) as Record<string, unknown>;
    expect(after.granskning).toEqual([...(before.granskning as unknown[]), expect.anything()]);
    expect({ ...after, status: undefined, granskning: undefined }).toEqual({
      ...before,
      status: undefined,
      granskning: undefined,
    });
  });

  it('hoppar över en fil som redan blivit godkand, så att två körningar inte krockar', () => {
    const git = fakeHistory(
      {
        HEAD: { [A]: exercise('godkand'), [B]: b },
        [MERGE_15]: { [A]: a },
        [MERGE_17]: { [B]: b },
      },
      last,
      messages,
    );
    const written: string[] = [];

    const result = tillampa(git, okApi(), plan, { write: true }, (path) => written.push(path));

    expect(result.ok).toBe(true);
    expect(result.files.map((file) => file.outcome)).toEqual(['orord', 'lyft']);
    expect(written).toEqual([B]);
  });

  it('skriver ingenting alls när en fil har ändrats sedan torrkörningen', () => {
    const git = fakeHistory(
      {
        HEAD: { [A]: a, [B]: exercise('granskad', { ledarbehov: 3 }) },
        [MERGE_15]: { [A]: a },
        [MERGE_17]: { [B]: b },
      },
      last,
      messages,
    );
    const written: string[] = [];

    const result = tillampa(git, okApi(), plan, { write: true }, (path) => written.push(path));

    expect(result.ok).toBe(false);
    expect(result.written).toBe(false);
    expect(written).toEqual([]);
  });

  it('skriver ingenting när texten inte är den som kom in med mergen i planen', () => {
    const git = fakeHistory(
      { HEAD: { [A]: a, [B]: b }, [MERGE_15]: { [A]: exercise('utkast') }, [MERGE_17]: { [B]: b } },
      last,
      messages,
    );
    const written: string[] = [];
    expect(tillampa(git, okApi(), plan, { write: true }, (path) => written.push(path)).ok).toBe(
      false,
    );
    expect(written).toEqual([]);
  });

  it('ändrar ingenting utan write', () => {
    const git = fakeHistory(
      { HEAD: { [A]: a, [B]: b }, [MERGE_15]: { [A]: a }, [MERGE_17]: { [B]: b } },
      last,
      messages,
    );
    const written: string[] = [];
    const result = tillampa(git, okApi(), plan, {}, (path) => written.push(path));
    expect(result.written).toBe(false);
    expect(written).toEqual([]);
  });

  it.each([
    ['ger undefined', (): undefined => undefined, 'går inte att läsa'],
    [
      'kastar',
      (): never => {
        throw new Error('Filename too long');
      },
      'Filename too long',
    ],
  ])('regression: skriver ingenting när läsningen av en fil som finns %s', (_, fail, message) => {
    const git = fakeHistory(
      { HEAD: { [A]: a, [B]: b }, [MERGE_15]: { [A]: a }, [MERGE_17]: { [B]: b } },
      last,
      messages,
    );
    const reader: HistoryReader = {
      ...git,
      read: (rev, path) => (path === B ? fail() : git.read(rev, path)),
    };
    const written: string[] = [];

    const result = tillampa(reader, okApi(), plan, { write: true }, (path) => written.push(path));

    expect(result.ok).toBe(false);
    expect(result.files.find((file) => file.file === B)?.message).toContain(message);
    expect(written).toEqual([]);
  });

  /** HEAD och mergarna har samma text som i planen; bara uppslagen skiljer sig. */
  const sameTexts: Record<string, Record<string, string>> = {
    HEAD: { [A]: a, [B]: b },
    [MERGE_15]: { [A]: a },
    [MERGE_17]: { [B]: b },
  };

  it('F8: skriver ingenting och frågar inte API:t när planens bas inte ligger på main', () => {
    const git = fakeHistory(sameTexts, last, messages);
    const api = fakeApi({});
    const written: string[] = [];

    const result = tillampa(
      git,
      api,
      { ...plan, bas: sha('en annan gren') },
      { write: true, retry: NO_WAIT },
      (path) => written.push(path),
    );

    expect(result.ok).toBe(false);
    expect(result.files).toEqual([
      {
        file: '',
        outcome: 'fel',
        message: `planen lästes ur ${sha('en annan gren')}, som inte ligger på main`,
      },
    ]);
    expect(api.calls).toEqual([]);
    expect(written).toEqual([]);
  });

  it('F8: en bas som inte har formen av en sha når aldrig git', () => {
    const git = { ...fakeHistory(sameTexts, last, messages), isAncestor: () => true };
    const result = tillampa(git, okApi(), { ...plan, bas: '--output=/tmp/x' }, { write: true });
    expect(result.ok).toBe(false);
  });

  it('F5: skriver ingenting när filen senast ändrades i en annan merge än planens', () => {
    // Samma blob, men en senare merge (MERGE_17) förde in den på nytt.
    const git = fakeHistory(
      { ...sameTexts, [MERGE_17]: { [A]: a, [B]: b } },
      { [A]: MERGE_17, [B]: MERGE_17 },
      messages,
    );
    const written: string[] = [];

    const result = tillampa(git, okApi(), plan, { write: true, retry: NO_WAIT }, (path) =>
      written.push(path),
    );

    expect(result.ok).toBe(false);
    expect(result.files[0]).toMatchObject({
      file: A,
      outcome: 'fel',
      message: `filen ändrades senast i ${MERGE_17}, inte i ${MERGE_15}`,
    });
    expect(written).toEqual([]);
  });

  it('F5: skriver ingenting när planens pull request inte är den API:t ger för mergen', () => {
    const git = fakeHistory(sameTexts, last, messages);
    const forged: Plan = {
      ...plan,
      poster: plan.poster.map((entry, index) => (index === 0 ? { ...entry, pr: 99 } : entry)),
    };
    const written: string[] = [];

    const result = tillampa(git, okApi(), forged, { write: true, retry: NO_WAIT }, (path) =>
      written.push(path),
    );

    expect(result.ok).toBe(false);
    expect(result.files[0]?.message).toContain('planen säger pull request #99');
    expect(written).toEqual([]);
  });

  it('F5: skriver ingenting när planens konto inte är det som mergade enligt API:t', () => {
    const git = fakeHistory(sameTexts, last, messages);
    const forged: Plan = {
      ...plan,
      poster: plan.poster.map((entry, index) =>
        index === 0 ? { ...entry, av: 'nagon-annan' } : entry,
      ),
    };
    const written: string[] = [];

    const result = tillampa(git, okApi(), forged, { write: true, retry: NO_WAIT }, (path) =>
      written.push(path),
    );

    expect(result.ok).toBe(false);
    expect(result.files[0]?.message).toContain('API:t säger #15 mergad av benbom');
    expect(written).toEqual([]);
  });

  it('F5: skriver ingenting när API:t inte kan bekräfta pull requesten', () => {
    const git = fakeHistory(sameTexts, last, messages);
    const api = fakeApi({ 'pulls/15': '', 'pulls/17': pullJson(17, MERGE_17) });
    const written: string[] = [];

    const result = tillampa(git, api, plan, { write: true, retry: NO_WAIT }, (path) =>
      written.push(path),
    );

    expect(result.ok).toBe(false);
    expect(result.files[0]?.message).toContain('tomt svar');
    expect(written).toEqual([]);
  });

  it('F5: granskningsraden skrivs med API:ts värden och frågar API:t en gång per merge', () => {
    const git = fakeHistory(sameTexts, last, messages);
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_15), 'pulls/17': pullJson(17, MERGE_17) });
    const written = new Map<string, string>();

    tillampa(git, api, plan, { datum: '2026-10-05', write: true, retry: NO_WAIT }, (path, text) =>
      written.set(path, text),
    );

    expect(api.calls).toEqual(['pulls/15', 'pulls/17']);
    const after = parse(written.get(A) as string) as Record<string, unknown>;
    expect((after.granskning as unknown[]).at(-1)).toMatchObject({
      av: 'benbom',
      kommentar: 'Godkänd genom merge av pull request #15.',
    });
  });
});

const temporary: string[] = [];

afterEach(() => {
  for (const dir of temporary.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

// Varje test kör ett tjugotal git-processer, som på Windows kan ta längre än standardgränsen.
describe('ikappskrivningen mot ett riktigt repo', { timeout: 30_000 }, () => {
  /**
   * main får omgång 1 genom en merge, sedan en merge som ändrar en annan fil, sedan en
   * merge som ändrar den granskade filens text. Den sista mergen är den som ska stå i planen.
   */
  it('knyter filen till den senaste mergen på main som ändrade den, inte till grenens commits', () => {
    const dir = mkdtempSync(join(tmpdir(), 'godkannande-ikapp-'));
    temporary.push(dir);
    const git = (...args: string[]): string =>
      execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
    git('init', '--quiet', '--initial-branch=main');
    git('config', 'user.email', 'test@example.invalid');
    git('config', 'user.name', 'Test');
    git('config', 'commit.gpgsign', 'false');

    mkdirSync(join(dir, CONTENT_DIR), { recursive: true });
    writeFileSync(join(dir, 'README.md'), 'start\n', 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Start');

    const mergeBranch = (branch: string, number: number, change: () => void): string => {
      git('checkout', '--quiet', '-b', branch);
      change();
      git('add', '--all');
      git('commit', '--quiet', '--message', `Ändra på ${branch}`);
      git('checkout', '--quiet', 'main');
      git(
        'merge',
        '--quiet',
        '--no-ff',
        '--message',
        `Merge pull request #${number} from x/${branch}`,
        branch,
      );
      return git('rev-parse', 'HEAD').trim();
    };

    mergeBranch('omgang', 15, () => writeFileSync(join(dir, A), exercise('granskad'), 'utf8'));
    mergeBranch('annat', 16, () => writeFileSync(join(dir, 'README.md'), 'annat\n', 'utf8'));
    const merge17 = mergeBranch('ytreferenser', 17, () =>
      writeFileSync(join(dir, A), exercise('granskad', { ledarbehov: 2 }), 'utf8'),
    );

    const reader = createHistoryReader(dir);
    const api = fakeApi({ 'pulls/17': pullJson(17, merge17) });
    const { plan, findings } = planera(reader, api, 'HEAD', NO_WAIT);

    expect(findings).toEqual([]);
    expect(plan.poster).toEqual([
      { fil: A, blob: reader.blob('HEAD', A), commit: merge17, pr: 17, av: 'benbom' },
    ]);

    const written = new Map<string, string>();
    const result = tillampa(reader, api, plan, { datum: '2026-10-05', write: true }, (path, text) =>
      written.set(path, text),
    );
    expect(result.ok).toBe(true);
    expect(written.get(A)).toContain(`status: ${APPROVED_STATUS}`);

    expect(reader.isAncestor(plan.bas, 'HEAD')).toBe(true);
    expect(reader.isAncestor(sha('finns inte'), 'HEAD')).toBe(false);
  });

  /** Ett nytt, tomt repo med main och git-identitet, utan att skriva något innehåll. */
  function freshRepo(): { dir: string; git: (...args: string[]) => string } {
    const dir = mkdtempSync(join(tmpdir(), 'godkannande-ikapp-'));
    temporary.push(dir);
    const git = (...args: string[]): string =>
      execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
    git('init', '--quiet', '--initial-branch=main');
    git('config', 'user.email', 'test@example.invalid');
    git('config', 'user.name', 'Test');
    git('config', 'commit.gpgsign', 'false');
    mkdirSync(join(dir, CONTENT_DIR), { recursive: true });
    writeFileSync(join(dir, 'README.md'), 'start\n', 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Start');
    return { dir, git };
  }

  it('gränsfall: en squash-merge löses upp via commits/{sha}/pulls, eftersom meddelandet saknar GitHubs mergeform', () => {
    const { dir, git } = freshRepo();
    git('checkout', '--quiet', '-b', 'omgang');
    writeFileSync(join(dir, A), exercise('granskad'), 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Lägg till övning');
    git('checkout', '--quiet', 'main');
    // GitHubs squash-merge lägger en enda ny commit på main med meddelandet
    // "<titel> (#<nummer>)", som inte matchar "Merge pull request #N from …".
    git('merge', '--quiet', '--squash', 'omgang');
    git('commit', '--quiet', '--message', 'Lägg till övning (#21)');
    const squash = git('rev-parse', 'HEAD').trim();

    const reader = createHistoryReader(dir);
    const api = fakeApi({
      [`commits/${squash}/pulls`]: JSON.stringify([{ number: 21, merged_at: 'x' }]),
      'pulls/21': pullJson(21, squash),
    });
    const { plan, findings } = planera(reader, api, 'HEAD', NO_WAIT);

    expect(findings).toEqual([]);
    expect(plan.poster).toEqual([
      { fil: A, blob: reader.blob('HEAD', A), commit: squash, pr: 21, av: 'benbom' },
    ]);
  });

  it('gränsfall: en rebase-merge faller rött när filen inte är den sista rebasade commiten (ADR 0020, känd begränsning)', () => {
    const { dir, git } = freshRepo();
    // En rebase-merge lägger grenens commits direkt på main, var och en med sitt ursprungliga
    // meddelande och utan någon gemensam merge-commit. Filen ändras i den FÖRSTA av två
    // commits, medan GitHub skulle rapportera merge_commit_sha som den SISTA — precis den
    // diskrepans ADR 0020 avsnitt *Nackdelar* beskriver som en känd begränsning.
    writeFileSync(join(dir, A), exercise('granskad'), 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Lägg till övning');
    const first = git('rev-parse', 'HEAD').trim();
    writeFileSync(join(dir, 'README.md'), 'annat\n', 'utf8');
    git('add', '--all');
    git('commit', '--quiet', '--message', 'Städa dokumentation');
    const last = git('rev-parse', 'HEAD').trim();

    const reader = createHistoryReader(dir);
    const api = fakeApi({
      [`commits/${first}/pulls`]: JSON.stringify([{ number: 22, merged_at: 'x' }]),
      'pulls/22': pullJson(22, last),
    });
    const { plan, findings } = planera(reader, api, 'HEAD', NO_WAIT);

    expect(plan.poster).toEqual([]);
    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain(`#22 kom in med ${last}, inte ${first}`);
  });

  it('gränsfall: en övning som bytt namn sedan den granskades knyts till rätt merge under sitt nya namn', () => {
    const { dir, git } = freshRepo();
    const mergeBranch = (branch: string, number: number, change: () => void): string => {
      git('checkout', '--quiet', '-b', branch);
      change();
      git('add', '--all');
      git('commit', '--quiet', '--message', `Ändra på ${branch}`);
      git('checkout', '--quiet', 'main');
      git(
        'merge',
        '--quiet',
        '--no-ff',
        '--message',
        `Merge pull request #${number} from x/${branch}`,
        branch,
      );
      return git('rev-parse', 'HEAD').trim();
    };

    mergeBranch('omgang', 23, () => writeFileSync(join(dir, A), exercise('granskad'), 'utf8'));
    const renameMerge = mergeBranch('byt-namn', 24, () => git('mv', A, B));

    const reader = createHistoryReader(dir);
    const api = fakeApi({ 'pulls/24': pullJson(24, renameMerge) });
    const { plan, findings } = planera(reader, api, 'HEAD', NO_WAIT);

    expect(findings).toEqual([]);
    expect(plan.poster).toEqual([
      { fil: B, blob: reader.blob('HEAD', B), commit: renameMerge, pr: 24, av: 'benbom' },
    ]);
  });
});

describe('kommandoraden', () => {
  it('planera skriver en plan som tillampa kan läsa, och tillampa skriver inget utan --skriv', () => {
    const dir = mkdtempSync(join(tmpdir(), 'godkannande-plan-'));
    temporary.push(dir);
    const planPath = join(dir, 'plan.json');
    const a = exercise('granskad');
    const git = fakeHistory(
      { HEAD: { [A]: a }, [MERGE_15]: { [A]: a } },
      { [A]: MERGE_15 },
      { [MERGE_15]: 'Merge pull request #15 from x/y' },
    );
    const api = fakeApi({ 'pulls/15': pullJson(15, MERGE_15) });
    const lines: string[] = [];

    expect(main(['planera', '--ut', planPath], (line) => lines.push(line), git, api)).toBe(0);
    expect(lines.at(-1)).toBe('Torrkörning: 1 övning skulle sättas till godkand.');

    lines.length = 0;
    expect(main(['tillampa', '--plan', planPath], (line) => lines.push(line), git, api)).toBe(0);
    expect(lines[0]).toContain('Lyfter a-ovning.yaml');
    expect(lines.at(-1)).toContain('Lägg till --skriv');
  });

  /**
   * Regression #15, andra halvan: "ett tomt svar i form av en lista hade dessutom gett grönt
   * utan att något skrevs" (ADR 0020). Den här täcker vägen genom `main`/`runPlanera`, inte
   * bara `planera` själv: även när en av flera filer går bra ska hela körningen falla rött och
   * planfilen bli tom, så att ett skrivjobb som ändå startade inte har något att skriva.
   */
  it('planera avslutar rött och skriver en tom plan när minst en fil inte går att slå upp, trots att andra filer gick bra', () => {
    const dir = mkdtempSync(join(tmpdir(), 'godkannande-plan-'));
    temporary.push(dir);
    const planPath = join(dir, 'plan.json');
    const a = exercise('granskad');
    const b = exercise('granskad', { ledarbehov: 2 });
    const git = fakeHistory(
      { HEAD: { [A]: a, [B]: b }, [MERGE_15]: { [A]: a }, [MERGE_17]: { [B]: b } },
      { [A]: MERGE_15, [B]: MERGE_17 },
      {
        [MERGE_15]: 'Merge pull request #15 from x/y',
        // Numret i meddelandet hör till en annan commit, och commits/{sha}/pulls ger samma
        // nummer: felet kommer direkt, utan att withRetry behöver vänta ut de riktiga
        // fördröjningarna i DEFAULT_RETRY.
        [MERGE_17]: 'Merge pull request #99 from x/z',
      },
    );
    const api = fakeApi({
      'pulls/15': pullJson(15, MERGE_15),
      'pulls/99': pullJson(99, MERGE_15),
      [`commits/${MERGE_17}/pulls`]: JSON.stringify([{ number: 99, merged_at: 'x' }]),
    });
    const lines: string[] = [];

    const code = main(['planera', '--ut', planPath], (line) => lines.push(line), git, api);

    expect(code).toBe(1);
    expect(lines.some((line) => line.includes('Torrkörningen hittade'))).toBe(true);
    const written = JSON.parse(readFileSync(planPath, 'utf8')) as { poster: unknown[] };
    expect(written.poster).toEqual([]);
  });

  it('tillampa faller med ett tydligt meddelande på en tom plan', () => {
    const dir = mkdtempSync(join(tmpdir(), 'godkannande-plan-'));
    temporary.push(dir);
    const planPath = join(dir, 'plan.json');
    writeFileSync(planPath, '', 'utf8');
    const lines: string[] = [];
    const git = fakeHistory({}, {}, {});

    expect(main(['tillampa', '--plan', planPath], (line) => lines.push(line), git)).toBe(1);
    expect(lines).toEqual(['Planen går inte att använda: planen: tomt svar. Ingenting skrivs.']);
  });
});
