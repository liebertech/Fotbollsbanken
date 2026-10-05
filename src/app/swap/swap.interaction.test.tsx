/**
 * @vitest-environment jsdom
 *
 * Byta en övning i passet (berättelse 04, skisser/04-byt-ovning.md): tangentbord, fokus
 * efter bytet och det en skärmläsare får, enligt designsystem.md avsnitt 5, 6 och 8.
 *
 * Passet kommer alltid ur motorn och alternativen ur `swapOptions` (ADR 0011 avsnitt 1).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { bankExercise } from '../../regelmotor/__testdata__/bank-fixtur.ts';
import { applySwap } from '../../regelmotor/index.ts';
import type { BankExercise } from '../../regelmotor/index.ts';
import { SJU_MOT_SJU } from '../../planskiss/__testdata__/skisser.ts';
import { Generator } from '../Generator.tsx';
import { FULL_BANK, INPUT, sessionOf } from '../__testdata__/session-fixture.ts';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const SEED = 'fro-1';

/**
 * Ett alternativ i Öva. Kortaste tiden 14 minuter gör att generatorn aldrig väljer det själv:
 * Öva har måltiden 10 minuter, och delen får inte bli längre än 13 (R-035). Efter ett byte
 * prövas R-035 inte (R-105), så alternativet går att byta in. Övningen i passet blir därmed
 * alltid fixturens "Passning med vändning".
 */
function alternative(overrides: Record<string, unknown>): BankExercise {
  return bankExercise({
    passdelar: ['del-ovning'],
    fokusomraden: ['passning-mottagning'],
    spelare: { min: 2, max: 12 },
    tid: { kortast: 14, rekommenderad: 14, langst: 15 },
    ...overrides,
  });
}

const WITH_SKETCH = alternative({
  id: 'ova-trekant',
  namn: 'Passning i trekant',
  yta: { alla: { langd: 15, bredd: 15 } },
  planskiss: SJU_MOT_SJU,
});
const WITHOUT_SKETCH = alternative({ id: 'ova-utan-skiss', namn: 'Passning utan skiss' });
const INVALID_SKETCH: BankExercise = {
  ...alternative({ id: 'ova-fel-skiss', namn: 'Passning med fel i skissen' }),
  planskiss: { version: 99 },
};
const LONG = alternative({
  id: 'ova-lang',
  namn: 'Lång passningsövning',
  tid: { kortast: 15, rekommenderad: 15, langst: 15 },
});
/** Träffar inte valt fokus, och får därför inte visas i Öva (R-041, R-104 villkor 3). */
const WRONG_FOCUS = alternative({
  id: 'ova-dribbling',
  namn: 'Dribbling i ruta',
  fokusomraden: ['dribbling'],
});

const BANK: BankExercise[] = [
  ...FULL_BANK,
  WITH_SKETCH,
  WITHOUT_SKETCH,
  INVALID_SKETCH,
  LONG,
  WRONG_FOCUS,
];

/** Namnet på Öva-övningen i passet, som generatorn valde den. */
const PRACTICE = 'Passning med vändning';

/** Fyller i underlaget som INPUT och genererar passet. */
async function generatePass(user: ReturnType<typeof userEvent.setup>, bank = BANK) {
  render(<Generator bank={bank} createSeed={() => SEED} />);
  await user.type(screen.getByLabelText('Ålder'), String(INPUT.alder));
  await user.click(screen.getByRole('checkbox', { name: /^Passning och mottagning\b/ }));
  const players = screen.getByLabelText('Antal spelare');
  await user.clear(players);
  await user.type(players, String(INPUT.spelare));
  await user.click(screen.getByRole('button', { name: 'Generera pass' }));
  await screen.findByRole('heading', { name: 'Ditt pass' });
}

/** Aktiverar en knapp från tangentbordet: fokus på den, sedan Enter. */
async function pressEnter(user: ReturnType<typeof userEvent.setup>, button: HTMLElement) {
  act(() => button.focus());
  await user.keyboard('{Enter}');
}

function openSwap(user: ReturnType<typeof userEvent.setup>, name = PRACTICE) {
  return pressEnter(user, screen.getByRole('button', { name: `Byt övning, ${name}` }));
}

describe('Berättelse 04: knappen Byt övning', () => {
  it('finns på varje övningskort, med ett unikt tillgängligt namn per kort', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    const buttons = screen.getAllByRole('button', { name: /^Byt övning, / });
    const cards = screen.getAllByRole('article');
    expect(buttons).toHaveLength(cards.length);
    const names = buttons.map((button) => button.getAttribute('aria-label'));
    expect(new Set(names).size).toBe(names.length);
    // Den synliga texten är "Byt övning" och ingår ordagrant i namnet (WCAG 2.5.3).
    expect(screen.getByRole('button', { name: `Byt övning, ${PRACTICE}` })).toHaveTextContent(
      /^Byt övning/,
    );
  });
});

describe('Berättelse 04: bytesvyn', () => {
  it('öppnas från tangentbordet och visar rubrik, ingress och fokus på första knappen', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    await openSwap(user);

    expect(screen.getByRole('heading', { level: 1, name: 'Byt övning: Öva' })).toBeVisible();
    const minutes = sessionOf(BANK, INPUT, SEED).rows.find(
      (row) => row.exercise?.namn === PRACTICE,
    )?.minutes;
    expect(screen.getByText(`Byter ut: "${PRACTICE}" (${minutes} min)`)).toBeVisible();
    // Fokus ligger inte kvar på en knapp som inte längre finns.
    expect(document.activeElement).toBe(
      screen.getAllByRole('button', { name: 'Tillbaka till passet' })[0],
    );
  });

  it('kriterium 1 och R-104: visar bara alternativ som motorn har godkänt, under bankens rubrik', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    await openSwap(user);

    const section = screen.getByRole('region', { name: 'Från den gemensamma banken' });
    const names = within(section)
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);
    expect(names).toEqual([
      'Lång passningsövning',
      'Passning i trekant',
      'Passning med fel i skissen',
      'Passning utan skiss',
    ]);
    expect(names).not.toContain(PRACTICE);
    expect(names).not.toContain('Dribbling i ruta');
  });

  it('kriterium 6: varje alternativ visar planskissen i miniatyr, eller platshållaren', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const user = userEvent.setup();
    await generatePass(user);
    await openSwap(user);

    const items = screen.getAllByRole('listitem');
    const item = (name: string) =>
      items.find((element) => within(element).queryByRole('heading', { name })) as HTMLElement;

    const sketch = within(item('Passning i trekant')).getByRole('button', {
      name: 'Förstora planskiss, Passning i trekant',
    });
    expect(sketch.querySelector('svg')).not.toBeNull();
    expect(within(item('Passning utan skiss')).getByText('Planskiss saknas')).toBeVisible();
    expect(
      within(item('Passning med fel i skissen')).getByText('Planskissen kunde inte visas'),
    ).toBeVisible();

    // Miniatyren fälls ut i samma kort, utan att något väljs (berättelse 06, kriterium 6).
    await pressEnter(user, sketch);
    expect(sketch).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('heading', { level: 1, name: 'Byt övning: Öva' })).toBeVisible();
  });

  it('skärmläsare: namn, fokus, tid och spelare kommer i den ordningen före knappen', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    await openSwap(user);

    const item = screen
      .getAllByRole('listitem')
      .find((element) => within(element).queryByRole('heading', { name: 'Lång passningsövning' }));
    const text = item?.textContent ?? '';
    const order = ['Lång passningsövning', 'Passning och mottagning', '15 min', '2–12 spelare'];
    const positions = order.map((part) => text.indexOf(part));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    const choose = within(item as HTMLElement).getByRole('button', {
      name: 'Välj denna: Lång passningsövning',
    });
    expect(text.indexOf('2–12 spelare')).toBeLessThan(text.indexOf(choose.textContent ?? ''));
  });

  it('sökfältet har en synlig etikett och filtrerar på namn och fokus', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    await openSwap(user);

    const search = screen.getByLabelText('Sök bland alternativen');
    await user.type(search, 'trekant');
    expect(screen.getAllByRole('button', { name: /^Välj denna/ })).toHaveLength(1);
    await user.clear(search);
    await user.type(search, 'mottagning');
    expect(screen.getAllByRole('button', { name: /^Välj denna/ })).toHaveLength(4);
    await user.clear(search);
    await user.type(search, 'finns inte');
    expect(screen.queryAllByRole('button', { name: /^Välj denna/ })).toHaveLength(0);
    expect(screen.getByText('Ingen av övningarna matchar sökningen.')).toBeVisible();
  });
});

describe('Berättelse 04: att byta', () => {
  it('kriterium 2 och 5: byter från tangentbordet, visar ny totaltid och bekräftelse, och flyttar fokus till kortet', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    await openSwap(user);
    await pressEnter(
      user,
      screen.getByRole('button', { name: 'Välj denna: Lång passningsövning' }),
    );

    expect(screen.getByRole('heading', { name: 'Ditt pass' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: PRACTICE })).toBeNull();
    const card = screen
      .getAllByRole('article')
      .find((element) => within(element).queryByRole('heading', { name: 'Lång passningsövning' }));
    expect(card).toBeDefined();
    expect(within(card as HTMLElement).getByText('Bytt till: Lång passningsövning.')).toBeVisible();
    expect(within(card as HTMLElement).getByText('15 min')).toBeVisible();

    // Den nya totaltiden, räknad av motorn, och avvikelsen från begärd längd (kriterium 5).
    const before = sessionOf(BANK, INPUT, SEED);
    const row = before.rows.find((item) => item.exercise?.namn === PRACTICE);
    const after = applySwap(before, { block: row?.block ?? 0, station: null }, LONG);
    const expected =
      after.totalMinutes === INPUT.passlangd
        ? `Faktisk tid: ${after.totalMinutes} min`
        : `Faktisk tid: ${after.totalMinutes} min (du bad om ${INPUT.passlangd} min)`;
    expect(screen.getByText(expected)).toBeVisible();

    // Fokus hamnar på det nya kortets bytesknapp, så att ledaren kan fortsätta därifrån.
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Byt övning, Lång passningsövning' }),
    );
  });

  it('skärmläsare: bekräftelsen läses upp ur en statusregion som fanns före bytet', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    await openSwap(user);
    await pressEnter(user, screen.getByRole('button', { name: 'Välj denna: Passning i trekant' }));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Bytt till: Passning i trekant.');
  });

  it('tillbaka utan byte: passet är oförändrat och fokus är på samma bytesknapp', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    const before = screen.getByText(/^Faktisk tid/).textContent;
    await openSwap(user);
    await pressEnter(user, screen.getAllByRole('button', { name: 'Tillbaka till passet' })[0]!);

    expect(screen.getByRole('heading', { name: PRACTICE })).toBeVisible();
    expect(screen.getByText(/^Faktisk tid/).textContent).toBe(before);
    expect(screen.queryByText(/^Bytt till/)).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: `Byt övning, ${PRACTICE}` }),
    );
  });

  it('kriterium 3: utan alternativ säger vyn det och övningen ligger kvar', async () => {
    const user = userEvent.setup();
    await generatePass(user, FULL_BANK);
    await openSwap(user);

    expect(
      screen.getByText(
        'Vi hittade ingen övning i banken som passar precis här. Övningen ligger kvar som den är.',
      ),
    ).toBeVisible();
    expect(screen.queryByLabelText('Sök bland alternativen')).toBeNull();
    const buttons = screen.getAllByRole('button', { name: 'Tillbaka till passet' });
    await pressEnter(user, buttons[buttons.length - 1]!);
    expect(screen.getByRole('heading', { name: PRACTICE })).toBeVisible();
  });

  it('kriterium 4: flera övningar kan bytas efter varandra', async () => {
    const user = userEvent.setup();
    await generatePass(user);
    await openSwap(user);
    await pressEnter(user, screen.getByRole('button', { name: 'Välj denna: Passning i trekant' }));
    await openSwap(user, 'Passning i trekant');
    // Den utbytta övningen är ett alternativ igen, och den nyss inbytta är det inte.
    expect(screen.getByRole('button', { name: `Välj denna: ${PRACTICE}` })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Välj denna: Passning i trekant' })).toBeNull();
    await pressEnter(user, screen.getByRole('button', { name: 'Välj denna: Passning utan skiss' }));
    const card = screen
      .getAllByRole('article')
      .find((element) => within(element).queryByRole('heading', { name: 'Passning utan skiss' }));
    expect(within(card as HTMLElement).getByText('Bytt till: Passning utan skiss.')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Bytt till: Passning utan skiss.');
  });
});
