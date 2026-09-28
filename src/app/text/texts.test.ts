/**
 * Regressionstest, granskningen av design/ytreferens-hjalptext (2026-09-28): texterna för
 * ytförklaringen ska stå ordagrant som i docs/design/texter.md avsnitt 4, och tecknen å/ä/ö
 * ska vara riktiga, hopsatta (NFC) tecken. Testet finns eftersom utvecklaren nämnde ett
 * verktygsfel med å-sekvenser vid arbetet – ett fel som annars är osynligt i editorn men kan
 * ge trasig text i webbläsaren (till exempel "å" i stället för "å").
 */
import { describe, expect, it } from 'vitest';
import { TEXTS } from './texts.ts';

describe('Ytförklaringens texter, ordagrant ur texter.md avsnitt 4', () => {
  it('Knapp, ytförklaring (fälld)', () => {
    expect(TEXTS.session.areaHelpShow).toBe('Vad betyder måttet i parentes?');
  });

  it('Knapp, ytförklaring (utfälld)', () => {
    expect(TEXTS.session.areaHelpHide).toBe('Dölj förklaringen');
  });

  it('Hjälptext, ytförklaring', () => {
    expect(TEXTS.session.areaHelpText).toBe(
      'Referensen jämför storlek. Var målen står följer övningens beskrivning.',
    );
  });
});

describe('Ytförklaringens texter, tecken å/ä/ö är riktiga tecken (inte trasiga sekvenser)', () => {
  const strings: [string, string][] = [
    ['areaHelpShow', TEXTS.session.areaHelpShow],
    ['areaHelpHide', TEXTS.session.areaHelpHide],
    ['areaHelpText', TEXTS.session.areaHelpText],
  ];

  it.each(strings)('%s är redan i NFC-form (inga isärtagna diakritiska tecken)', (_, text) => {
    expect(text.normalize('NFC')).toBe(text);
  });

  it.each(strings)('%s innehåller inga fristående kombinerande diakritiska tecken', (_, text) => {
    // U+0300–U+036F är Unicodes block för kombinerande diakritiska tecken. Ett riktigt "å"
    // är ett enda tecken (U+00E5) och ska aldrig innehålla något ur det blocket.
    expect(text).not.toMatch(/[̀-ͯ]/u);
  });

  it('minst en av texterna innehåller faktiskt å, ä eller ö (testet prövar rätt sak)', () => {
    expect(strings.some(([, text]) => /[åäö]/u.test(text))).toBe(true);
  });

  it.each(strings)('%s innehåller inga vanliga mojibake-tecken (Ã, Â, þ)', (_, text) => {
    expect(text).not.toMatch(/[ÃÂþ]/u);
  });
});
