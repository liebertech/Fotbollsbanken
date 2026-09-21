/**
 * Vyerna renderade till HTML. Testet prövar att det som motorn svarar också syns för
 * ledaren: delar, tider, påminnelser, tomma delar, ersättningsfokus och förklaringen när
 * inget pass kunde skapas.
 *
 * Renderingen sker med react-dom/server, så att testet klarar sig utan webbläsarmiljö.
 * Klick och tangentbord prövas av kvalitetssäkraren i Playwright (ADR 0001).
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InputForm } from './input/InputForm.tsx';
import { EMPTY_FORM, withAge, withFocusToggled } from './input/form.ts';
import { SessionView } from './session/SessionView.tsx';
import { NoSessionView } from './session/NoSessionView.tsx';
import { validateInput } from '../regelmotor/index.ts';
import type { InputError } from '../regelmotor/index.ts';
import {
  BANK_NEEDING_SUBSTITUTE,
  BANK_WITHOUT_GAME_PRACTICE,
  BANK_WRONG_LEVEL,
  FULL_BANK,
  INPUT,
  generate,
  sessionOf,
} from './__testdata__/session-fixture.ts';

function html(element: React.ReactElement): string {
  // Renderad HTML utan entiteter, så att svenska texter kan jämföras som de skrivs.
  return renderToStaticMarkup(element)
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&#183;', '·')
    .replaceAll('&middot;', '·');
}

function sessionHtml(bank = FULL_BANK, input = INPUT): string {
  return html(
    <SessionView
      session={sessionOf(bank, input)}
      onChangeInput={() => undefined}
      onGenerateAgain={() => undefined}
    />,
  );
}

describe('Berättelse 02: det genererade passet', () => {
  it('02.2 visar varje del med namn och varje övning med namn, syfte och tid', () => {
    const markup = sessionHtml();
    for (const name of ['Uppvärmning', 'Öva', 'Spelövning', 'Spel', 'Avslutning']) {
      expect(markup).toContain(name);
    }
    expect(markup).toContain('Passning med vändning');
    expect(markup).toContain('Spelarna ska öva på det som testet handlar om.');
    expect(markup).toMatch(/\d+ min/);
    // R-052: gruppindelningen skrivs ut för varje moment.
    expect(markup).toContain('En grupp med 12 spelare');
  });

  it('02.8 visar passets faktiska tid mot den begärda', () => {
    const session = sessionOf(FULL_BANK);
    const markup = sessionHtml();
    expect(markup).toContain(`Faktisk tid: ${session.totalMinutes} min`);
  });

  it('02.15 visar påminnelsen om benskydd och om förankrade mål', () => {
    const markup = sessionHtml();
    expect(markup).toContain('Använd benskydd på träningen');
    expect(markup).toContain('förankrade så att de inte kan välta');
  });

  it('02.13 visar tipset om fler vuxna när spelarna är fler än taket per ledare', () => {
    const markup = sessionHtml(FULL_BANK, { ...INPUT, spelare: 20, ledare: 1 });
    expect(markup).toContain('Ta gärna hjälp av en förälder');
  });

  it('02.2 visar fokusområdena med sina namn, inte med sina nycklar', () => {
    const markup = sessionHtml();
    expect(markup).toContain('Passning och mottagning');
    expect(markup).not.toContain('passning-mottagning');
  });
});

describe('Berättelse 03: delar utan övning och inget matchande resultat', () => {
  it('03.4 visar en tom del med sitt namn, sin måltid och att övning saknas', () => {
    const session = sessionOf(BANK_WITHOUT_GAME_PRACTICE);
    const part = session.parts.find((item) => item.part === 'del-spelovning');
    const markup = html(
      <SessionView
        session={session}
        onChangeInput={() => undefined}
        onGenerateAgain={() => undefined}
      />,
    );
    expect(markup).toContain('Övning saknas');
    expect(markup).toContain(`Måltid: ${part?.target} min.`);
  });

  it('03.2 visar antingen vilka val som kan ändras eller att delen inte gick att kombinera', () => {
    const session = sessionOf(BANK_WITHOUT_GAME_PRACTICE);
    const part = session.parts.find((item) => item.part === 'del-spelovning');
    const markup = html(
      <SessionView
        session={session}
        onChangeInput={() => undefined}
        onGenerateAgain={() => undefined}
      />,
    );
    if ((part?.changeableFields.length ?? 0) > 0) {
      expect(markup).toContain('Testa att ändra ett av de här');
    } else {
      expect(markup).toContain('gick inte att kombinera med resten av passet');
    }
  });

  it('03.6 visar vilket fokus som saknade övningar och vilket som användes i stället', () => {
    const markup = sessionHtml(BANK_NEEDING_SUBSTITUTE, { ...INPUT, fokus: ['lek'] });
    expect(markup).toContain('Vi hittade ingen övning för Lek');
    expect(markup).toContain('Dribbling och driva bollen');
    expect(markup).toContain('Dina val står kvar oförändrade.');
  });

  it('03.1 och 03.2 visar rubriken, de val som kan ändras och trygghetstexten', () => {
    const result = generate(BANK_WRONG_LEVEL);
    expect(result.kind).toBe('none');
    if (result.kind !== 'none') {
      return;
    }
    const markup = html(
      <NoSessionView input={INPUT} reason={result.reason} onChangeInput={() => undefined} />,
    );
    expect(markup).toContain('Vi kunde inte skapa ett pass med de här uppgifterna');
    expect(markup).toContain('Nivå');
    expect(markup).toContain('Vi ändrar ingenting åt dig');
    expect(markup).toContain('Ändra uppgifter');
  });

  it('03.3 visar ledarens underlag oförändrat', () => {
    const result = generate(BANK_WRONG_LEVEL);
    if (result.kind !== 'none') {
      throw new Error('förväntade inget pass');
    }
    const markup = html(
      <NoSessionView input={INPUT} reason={result.reason} onChangeInput={() => undefined} />,
    );
    expect(markup).toContain('Ditt underlag just nu');
    expect(markup).toContain('11 år');
    expect(markup).toContain('7 mot 7');
    expect(markup).toContain('Fortsättning');
    expect(markup).toContain('12 spelare');
  });
});

describe('Berättelse 01: underlagsformuläret', () => {
  const render = (form = withAge(EMPTY_FORM, '11'), errors: InputError[] = []) =>
    html(
      <InputForm
        form={form}
        errors={errors}
        onChange={() => undefined}
        onGenerate={() => undefined}
      />,
    );

  it('01.2 visar bara den föreslagna spelformen och dess grannar', () => {
    const markup = render();
    expect(markup).toContain('7 mot 7');
    expect(markup).toContain('5 mot 5');
    expect(markup).toContain('9 mot 9');
    expect(markup).not.toContain('11 mot 11');
  });

  it('01.9 och 01.10 visar fokusområdena för åldern, utan nickspel före 13 år', () => {
    expect(render()).toContain('Passning och mottagning');
    expect(render()).not.toContain('Nickspel');
    expect(render(withAge(EMPTY_FORM, '14'))).toContain('Nickspel');
  });

  it('01.3 och 01.5 visar motorns felmeddelanden och en samlad rad', () => {
    const invalid = withFocusToggled(withAge(EMPTY_FORM, '3'), 'lek');
    const result = validateInput({ alder: 3, niva: 'niva-2', fokus: [] });
    expect(result.ok).toBe(false);
    const errors = result.ok ? [] : result.errors;
    const markup = render(invalid, errors);
    expect(markup).toContain('Ange en ålder mellan 6 och 19 år.');
    expect(markup).toContain('Några uppgifter saknas eller stämmer inte');
  });

  it('01.11 visar hjälptexten om vilken ålder som ska anges', () => {
    expect(render()).toContain('Ange den ålder som flest i gruppen fyller i år.');
  });

  it('01.12 visar yta som ett valfritt val med Ingen som förval', () => {
    const markup = render();
    expect(markup).toContain('Yta (valfritt)');
    expect(markup).toContain('Hel plan');
    expect(markup).toContain('Ingen');
  });
});
