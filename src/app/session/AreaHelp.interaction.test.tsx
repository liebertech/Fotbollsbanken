/**
 * @vitest-environment jsdom
 *
 * Ytförklaringen på övningskortet (docs/design/texter.md avsnitt 4 och
 * skisser/02-genererat-pass.md, uppföljning till ADR 0017). Den står bara på det första
 * kortet i passet vars yta har en ytreferens, är en egen disclosure med `aria-expanded`, och
 * texten finns i DOM:en bara när den är utfälld.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { SessionView } from './SessionView.tsx';
import {
  BANK_WITH_AREA_REFERENCE,
  BANK_WITH_STATION_REFERENCE,
  BANK_WITH_TWO_AREA_REFERENCES,
  FULL_BANK,
  INPUT,
  STATION_INPUT,
  STATION_SEED,
  sessionOf,
} from '../__testdata__/session-fixture.ts';
import type { BankExercise, Input } from '../../regelmotor/index.ts';

const SHOW = 'Vad betyder måttet i parentes?';
const HIDE = 'Dölj förklaringen';
const HELP = 'Referensen jämför storlek. Var målen står följer övningens beskrivning.';

afterEach(() => {
  cleanup();
});

function renderSession(bank: BankExercise[], input: Input = INPUT, seed = 'fro') {
  render(
    <SessionView
      session={sessionOf(bank, input, seed)}
      onChangeInput={() => undefined}
      onGenerateAgain={() => undefined}
    />,
  );
}

/** Kortet (article) som har rubriken `name`. */
function card(name: string | RegExp): HTMLElement {
  const article = screen.getByRole('heading', { name }).closest('article');
  if (article === null) {
    throw new Error(`inget kort med rubriken ${String(name)}`);
  }
  return article;
}

describe('Ytförklaringen, var den står', () => {
  it('saknas helt när inget kort i passet har en ytreferens', () => {
    renderSession(FULL_BANK);
    expect(screen.queryByRole('button', { name: SHOW })).not.toBeInTheDocument();
    expect(screen.queryByText(HELP)).not.toBeInTheDocument();
  });

  it('står på det första kortet med referens och inte på de senare', () => {
    renderSession(BANK_WITH_TWO_AREA_REFERENCES);
    expect(screen.getAllByRole('button', { name: SHOW })).toHaveLength(1);
    expect(
      within(card('Passningslek i ruta')).getByRole('button', { name: SHOW }),
    ).toBeInTheDocument();
    // Spelövningen har också en referens, men ingen förklaring.
    const later = card('Spel mot två mål');
    expect(within(later).getByText(/ungefär en fjärdedel av stora planen/)).toBeInTheDocument();
    expect(within(later).queryByRole('button', { name: SHOW })).not.toBeInTheDocument();
  });

  it('står på den station som har referensen, inte på stationen före eller spelövningen efter', () => {
    renderSession(BANK_WITH_STATION_REFERENCE, STATION_INPUT, STATION_SEED);
    // Passet ska verkligen ha stationer, annars prövar testet fel sak.
    expect(screen.getByText(/2 stationer/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: SHOW })).toHaveLength(1);
    expect(within(card(/Vändning i ruta/)).getByRole('button', { name: SHOW })).toBeInTheDocument();
    expect(
      within(card(/Passning i par/)).queryByRole('button', { name: SHOW }),
    ).not.toBeInTheDocument();
    expect(
      within(card('Spel mot två mål')).queryByRole('button', { name: SHOW }),
    ).not.toBeInTheDocument();
  });
});

describe('Ytförklaringen, fälla ut och in', () => {
  it('växlar aria-expanded och visar texten bara när den är utfälld', async () => {
    const user = userEvent.setup();
    renderSession(BANK_WITH_AREA_REFERENCE);

    const button = screen.getByRole('button', { name: SHOW });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(HELP)).not.toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAccessibleName(HIDE);
    const help = screen.getByText(HELP);
    expect(button).toHaveAttribute('aria-controls', help.id);
    expect(button).not.toHaveAttribute('title');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAccessibleName(SHOW);
    expect(screen.queryByText(HELP)).not.toBeInTheDocument();
  });

  it('är ett eget tillstånd, inte kopplat till "Visa mer"', async () => {
    const user = userEvent.setup();
    renderSession(BANK_WITH_AREA_REFERENCE);
    const warmup = card('Passningslek i ruta');

    await user.click(within(warmup).getByRole('button', { name: SHOW }));
    expect(within(warmup).getByRole('button', { name: 'Visa mer' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await user.click(within(warmup).getByRole('button', { name: 'Visa mer' }));
    expect(within(warmup).getByRole('button', { name: HIDE })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
