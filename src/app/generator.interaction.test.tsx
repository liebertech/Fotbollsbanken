/**
 * @vitest-environment jsdom
 *
 * Interaktionstester för `Generator`: ledaren skriver, klickar och läser vad som faktiskt
 * hamnar i DOM:en, i stället för att bara jämföra statisk HTML (som view.test.tsx gör).
 *
 * De här testerna kompletterar view.test.tsx och de rena funktionerna i form.test.ts. De
 * ersätter inte Playwright (ADR 0001): riktig webbläsarmiljö, mobil viewport och tangentbords-
 * navigering hör dit. Men själva tillståndshanteringen i `Generator` – att formuläret behåller
 * ledarens ifyllda värden när hon går tillbaka (R-102, berättelse 03 kriterium 3), att fel
 * visas när hon försöker generera med ofullständigt underlag, och att fokusvalet stoppar vid
 * tre kryss (R-019) – går att pröva i jsdom utan en riktig webbläsare, och bör inte vänta på
 * att Playwright sätts upp i ett senare inkrement.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Generator } from './Generator.tsx';
import { BANK_WRONG_LEVEL, FULL_BANK, INPUT } from './__testdata__/session-fixture.ts';

afterEach(() => {
  cleanup();
});

/**
 * Fokusområdenas kryssrutor har namnet ur `FOCUS_AREA_NAMES`, men InputForm.tsx lägger till
 * " (K)" i etiketten när området är kärnområde för åldern (isCoreFocus). "Passning och
 * mottagning", "Dribbling och driva bollen", "Avslut" och "1 mot 1" är alla kärnområden för
 * 11 år (fas-10-12), så den riktiga tillgängliga namnen är till exempel
 * "Passning och mottagning (K)". Testerna matchar därför bara början av namnet.
 */
function focusCheckbox(name: string) {
  return screen.getByRole('checkbox', { name: new RegExp(`^${name}\\b`) });
}

/** Fyller i underlaget som `session-fixture.ts` INPUT motsvarar, förutom fokus. */
async function fillBaseForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Ålder'), String(INPUT.alder));
  await user.click(focusCheckbox('Passning och mottagning'));
  const spelare = screen.getByLabelText('Antal spelare');
  await user.clear(spelare);
  await user.type(spelare, String(INPUT.spelare));
}

describe('Berättelse 01 och 02: fylla i underlaget och generera ett pass', () => {
  it('visar det genererade passet med ledarens uppgifter när underlaget är komplett', async () => {
    const user = userEvent.setup();
    render(<Generator bank={FULL_BANK} createSeed={() => 'fro-1'} />);

    await fillBaseForm(user);
    await user.click(screen.getByRole('button', { name: 'Generera pass' }));

    expect(await screen.findByRole('heading', { name: 'Ditt pass' })).toBeInTheDocument();
    expect(screen.getByText(/12 spelare · 2 ledare/)).toBeInTheDocument();
    expect(screen.getByText(/7 mot 7/)).toBeInTheDocument();
  });

  it('R-020: visar en samlad felrad och stannar på underlaget när fält saknas', async () => {
    const user = userEvent.setup();
    render(<Generator bank={FULL_BANK} createSeed={() => 'fro-1'} />);

    // Inget fält ifyllt: åldern saknas, och därmed även spelform, fokus osv.
    await user.click(screen.getByRole('button', { name: 'Generera pass' }));

    expect(
      await screen.findByText('Några uppgifter saknas eller stämmer inte – se markeringarna ovan.'),
    ).toBeInTheDocument();
    // Fortfarande på underlagssteget, inget pass visas.
    expect(screen.getByRole('heading', { name: 'Nytt pass' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Ditt pass' })).not.toBeInTheDocument();
  });

  it('R-019: går inte att kryssa i ett fjärde fokusområde', async () => {
    const user = userEvent.setup();
    render(<Generator bank={FULL_BANK} createSeed={() => 'fro-1'} />);

    await user.type(screen.getByLabelText('Ålder'), String(INPUT.alder));
    await user.click(focusCheckbox('Passning och mottagning'));
    await user.click(focusCheckbox('Dribbling och driva bollen'));
    await user.click(focusCheckbox('Avslut'));

    const fourth = focusCheckbox('1 mot 1');
    expect(fourth).toBeDisabled();
    await user.click(fourth);
    expect(fourth).not.toBeChecked();

    // De tre första står kvar ikryssade.
    expect(focusCheckbox('Passning och mottagning')).toBeChecked();
    expect(focusCheckbox('Dribbling och driva bollen')).toBeChecked();
    expect(focusCheckbox('Avslut')).toBeChecked();
  });
});

describe('Berättelse 02 och 03: gå tillbaka och ändra ett val (R-102)', () => {
  it('behåller ledarens ifyllda värden när hon går tillbaka från ett genererat pass', async () => {
    const user = userEvent.setup();
    render(<Generator bank={FULL_BANK} createSeed={() => 'fro-1'} />);

    await fillBaseForm(user);
    await user.click(screen.getByRole('button', { name: 'Generera pass' }));
    await screen.findByRole('heading', { name: 'Ditt pass' });

    await user.click(screen.getByRole('button', { name: 'Ändra uppgifter' }));

    expect(await screen.findByRole('heading', { name: 'Nytt pass' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ålder')).toHaveValue(INPUT.alder);
    expect(screen.getByLabelText('Antal spelare')).toHaveValue(INPUT.spelare);
    expect(focusCheckbox('Passning och mottagning')).toBeChecked();
  });

  it('genererar om med bara ett fält ändrat, utan att ledaren fyller i underlaget på nytt', async () => {
    const user = userEvent.setup();
    render(<Generator bank={FULL_BANK} createSeed={() => 'fro-1'} />);

    await fillBaseForm(user);
    await user.click(screen.getByRole('button', { name: 'Generera pass' }));
    await screen.findByRole('heading', { name: 'Ditt pass' });

    await user.click(screen.getByRole('button', { name: 'Ändra uppgifter' }));
    const spelare = await screen.findByLabelText('Antal spelare');
    await user.clear(spelare);
    await user.type(spelare, '8');
    await user.click(screen.getByRole('button', { name: 'Generera pass' }));

    expect(await screen.findByRole('heading', { name: 'Ditt pass' })).toBeInTheDocument();
    expect(screen.getByText(/8 spelare · 2 ledare/)).toBeInTheDocument();
  });

  it('"Generera igen" kör om samma underlag utan att ledaren lämnar passvyn', async () => {
    const user = userEvent.setup();
    const seeds = ['fro-1', 'fro-2'];
    render(<Generator bank={FULL_BANK} createSeed={() => seeds.shift() ?? 'fro-x'} />);

    await fillBaseForm(user);
    await user.click(screen.getByRole('button', { name: 'Generera pass' }));
    await screen.findByRole('heading', { name: 'Ditt pass' });

    await user.click(screen.getByRole('button', { name: 'Generera igen' }));

    // Fortfarande på passvyn, med samma underlag (12 spelare, 7 mot 7).
    expect(await screen.findByRole('heading', { name: 'Ditt pass' })).toBeInTheDocument();
    expect(screen.getByText(/12 spelare · 2 ledare/)).toBeInTheDocument();
    expect(screen.getByText(/7 mot 7/)).toBeInTheDocument();
  });
});

describe('Berättelse 03: inget matchande resultat, sett genom faktiska klick', () => {
  it('R-101/R-103: visar vilka val som kan ändras, och underlaget står kvar när ledaren går tillbaka', async () => {
    const user = userEvent.setup();
    render(<Generator bank={BANK_WRONG_LEVEL} createSeed={() => 'fro-1'} />);

    // BANK_WRONG_LEVEL har bara niva-1, formuläret börjar på niva-2.
    await fillBaseForm(user);
    await user.click(screen.getByRole('button', { name: 'Generera pass' }));

    expect(
      await screen.findByRole('heading', {
        name: 'Vi kunde inte skapa ett pass med de här uppgifterna',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Vi ändrar ingenting åt dig – gå tillbaka och justera det du vill testa.'),
    ).toBeInTheDocument();
    const list = screen.getByRole('list');
    expect(within(list).getByText('Nivå')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ändra uppgifter' }));

    // R-102: appen har inte ändrat nivån eller något annat val åt ledaren.
    expect(await screen.findByRole('heading', { name: 'Nytt pass' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ålder')).toHaveValue(INPUT.alder);
    // "Fortsättning" är namnet på niva-2 (LEVEL_NAMES), formulärets förval.
    expect(screen.getByRole('radio', { name: 'Fortsättning' })).toBeChecked();
  });
});
