/**
 * @vitest-environment jsdom
 *
 * Riktning A, Gräsmattan (docs/design/visuell-design-byggbeskrivning.md): sidhuvudet, ikonerna
 * och passdelens rubrik får nytt utseende, men de tillgängliga namnen är desamma som förut.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Icon } from './Icon.tsx';
import type { IconName } from './Icon.tsx';
import { PageHeader } from './PageHeader.tsx';
import { SessionView } from '../session/SessionView.tsx';
import {
  BANK_WITHOUT_GAME_PRACTICE,
  FULL_BANK,
  sessionOf,
} from '../__testdata__/session-fixture.ts';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderSession(bank = FULL_BANK) {
  const session = sessionOf(bank);
  render(
    <SessionView
      session={session}
      onChangeInput={() => undefined}
      onGenerateAgain={() => undefined}
    />,
  );
  return session;
}

describe('Ikonerna (designsystem.md avsnitt 6.11)', () => {
  const names: IconName[] = ['ball', 'warning', 'yellow-card', 'drop', 'back'];

  it.each(names)('%s är dekor: dold för skärmläsare och utan tabbstopp', (name) => {
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg?.childElementCount).toBeGreaterThan(0);
  });
});

describe('Sidhuvudet (designsystem.md avsnitt 6.10)', () => {
  it('visar varumärkesraden och vyns rubrik som h1', () => {
    render(<PageHeader heading="Nytt pass" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Nytt pass' })).toBeVisible();
    expect(screen.getByText('Fotbollsbanken')).toBeVisible();
  });

  it('rubriken tar inte fokus och står inte i tabbordningen som förval', () => {
    render(<PageHeader heading="Ditt pass" />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Ditt pass' });
    expect(heading).not.toHaveFocus();
    expect(heading).not.toHaveAttribute('tabindex');
  });

  it('med focusHeading tar rubriken fokus när den visas, utan att hamna i tabbordningen', () => {
    render(<PageHeader heading="Byt övning: Öva" focusHeading />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Byt övning: Öva' });
    expect(heading).toHaveFocus();
    expect(heading).toHaveAttribute('tabindex', '-1');
  });

  /*
   * Säkerhetsgranskningen av den visuella designen, F1: focusHeading är en konstant för vyn.
   * Ritas vyn om med samma värde och en ny rubrik, till exempel när bytet gäller en annan
   * del, ska rubriken inte monteras om och fokus ska stanna där ledaren har det.
   */
  it('flyttar inte fokus när vyn ritas om med samma focusHeading och ny rubrik', () => {
    const view = (heading: string) => (
      <>
        <PageHeader heading={heading} focusHeading />
        <button type="button">Sök</button>
      </>
    );
    const { rerender } = render(view('Byt övning: Öva'));
    const first = screen.getByRole('heading', { level: 1, name: 'Byt övning: Öva' });
    expect(first).toHaveFocus();

    const button = screen.getByRole('button', { name: 'Sök' });
    button.focus();
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    rerender(view('Byt övning: Spel'));

    const second = screen.getByRole('heading', { level: 1, name: 'Byt övning: Spel' });
    expect(second).toBe(first);
    expect(button).toHaveFocus();
    expect(focus).not.toHaveBeenCalled();
  });

  it('det som skickas in står före rubriken', () => {
    render(
      <PageHeader heading="Rubrik">
        <button type="button">Tillbaka till passet</button>
      </PageHeader>,
    );
    const button = screen.getByRole('button', { name: 'Tillbaka till passet' });
    const heading = screen.getByRole('heading', { level: 1, name: 'Rubrik' });
    expect(button.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe('Passets delrubriker har samma tillgängliga namn som före riktning A', () => {
  it('"{n}. {delnamn} · {n} min", och siffercirkeln läses inte upp', () => {
    const session = renderSession();
    const parts = session.parts.filter((part) => part.status !== 'saknar-ovning');
    expect(parts.length).toBeGreaterThan(0);
    const warmup = parts.find((part) => part.part === 'del-uppvarmning');
    expect(
      screen.getByRole('heading', { level: 2, name: `1. Uppvärmning · ${warmup?.minutes} min` }),
    ).toBeInTheDocument();
  });

  it('en tom del har bara nummer och namn i rubriken, som förut', () => {
    renderSession(BANK_WITHOUT_GAME_PRACTICE);
    expect(screen.getByRole('heading', { level: 2, name: '3. Spelövning' })).toBeInTheDocument();
  });

  it('påminnelserna visas med gult kort som dekor, och texten är oförändrad', () => {
    renderSession();
    const notices = screen
      .getAllByRole('listitem')
      .filter((item) => /benskydd|förankrade/.test(item.textContent ?? ''));
    expect(notices.length).toBe(2);
    for (const notice of notices) {
      const icon = notice.querySelector('svg[data-icon="yellow-card"]');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('vattenpausen har droppen som dekor och samma text', () => {
    const session = renderSession();
    const breaks = session.rows.filter((row) => row.kind === 'break');
    expect(breaks.length).toBeGreaterThan(0);
    const icons = document.querySelectorAll('svg[data-icon="drop"]');
    expect(icons).toHaveLength(breaks.length);
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon.parentElement?.textContent).toMatch(/^Vattenpaus · \d+ min$/);
    }
  });
});
