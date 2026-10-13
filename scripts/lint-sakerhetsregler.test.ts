import { describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';

/**
 * Negativa prov för lintreglerna (S-07, ADR 0001, ADR 0011, ADR 0012). Varje prov är kod som
 * lintningen måste underkänna. Provet fångar att en uppgradering av ESLint eller ett regelpaket
 * tyst slutar tillämpa en regel, vilket `npm run lint` på felfri kod aldrig märker.
 * Provet lintar text mot den riktiga eslint.config.js. Sökvägen måste vara en riktig fil, eftersom
 * den typade lintningen i src/app och src/planskiss läser projektet.
 */
const eslint = new ESLint({ cwd: process.cwd() });

async function ruleIds(code: string, filePath: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath });
  if (result === undefined) throw new Error(`Inget lintresultat för ${filePath}`);
  return result.messages.map((m) => m.ruleId ?? `fatal:${m.message}`);
}

const ENGINE = 'src/regelmotor/index.ts';
const RENDERER = 'src/planskiss/Planskiss.tsx';
const APP = 'src/app/main.tsx';

const cases: ReadonlyArray<{ namn: string; fil: string; kod: string; regel: string }> = [
  {
    namn: 'dangerouslySetInnerHTML i appen',
    fil: APP,
    kod: 'export const A = () => <div dangerouslySetInnerHTML={{ __html: "x" }} />;\n',
    regel: 'react/no-danger',
  },
  {
    namn: 'dangerouslySetInnerHTML i ritmotorn',
    fil: RENDERER,
    kod: 'export const A = () => <g dangerouslySetInnerHTML={{ __html: "x" }} />;\n',
    regel: 'react/no-danger',
  },
  {
    namn: 'innerHTML-tilldelning i appen',
    fil: APP,
    kod: 'export function f(e: HTMLElement) { e.innerHTML = "x"; }\n',
    regel: 'no-restricted-syntax',
  },
  {
    namn: 'ref skickad som prop i ritmotorn',
    fil: RENDERER,
    kod: 'export const A = (p: { ref: unknown }) => <g {...p} />;\n',
    regel: 'no-restricted-syntax',
  },
  {
    namn: 'element utanför vitlistan i ritmotorn',
    fil: RENDERER,
    kod: 'export const A = () => <script />;\n',
    regel: 'no-restricted-syntax',
  },
  {
    namn: 'attribut utanför vitlistan i ritmotorn',
    fil: RENDERER,
    kod: 'export const A = () => <g onClick={() => 1} />;\n',
    regel: 'no-restricted-syntax',
  },
  {
    namn: 'Math.random i regelmotorn',
    fil: ENGINE,
    kod: 'export const r = Math.random();\n',
    regel: 'no-restricted-properties',
  },
  {
    namn: 'Date.now i regelmotorn',
    fil: ENGINE,
    kod: 'export const r = Date.now();\n',
    regel: 'no-restricted-properties',
  },
  {
    namn: 'new Date() utan argument i regelmotorn',
    fil: ENGINE,
    kod: 'export const r = new Date();\n',
    regel: 'no-restricted-syntax',
  },
  {
    namn: 'window i regelmotorn',
    fil: ENGINE,
    kod: 'export const r = window;\n',
    regel: 'no-restricted-globals',
  },
  {
    namn: 'React-import i regelmotorn',
    fil: ENGINE,
    kod: "import { useState } from 'react';\nexport const r = useState;\n",
    regel: 'no-restricted-imports',
  },
  {
    namn: 'createElement i appen',
    fil: APP,
    kod: "import { createElement } from 'react';\nexport const r = createElement('div');\n",
    regel: 'no-restricted-syntax',
  },
];

describe('lintreglerna underkänner kod som bryter mot säkerhets- och determinismreglerna', () => {
  for (const { namn, fil, kod, regel } of cases) {
    it(
      namn,
      async () => {
        const ids = await ruleIds(kod, fil);
        expect(ids).toContain(regel);
      },
      60_000,
    );
  }

  it('felfri kod i regelmotorn ger inga fynd (kontroll att provet kan gå igenom)', async () => {
    expect(await ruleIds('export const r = 1;\n', ENGINE)).toEqual([]);
  }, 60_000);
});
