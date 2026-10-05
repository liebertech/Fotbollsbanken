/**
 * @vitest-environment jsdom
 *
 * useFocusOnMount (säkerhetsgranskningen av inkrement 2b): fokus flyttas en gång när
 * elementet monteras, och inte igen när komponenten ritas om för att ledaren skriver.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { useFocusOnMount } from './useFocusOnMount.ts';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** En vy med en rubrik som tar fokus och ett sökfält som ritar om vyn vid varje tecken. */
function View() {
  const focusOnMount = useFocusOnMount();
  const [query, setQuery] = useState('');
  return (
    <>
      <h1 tabIndex={-1} ref={focusOnMount}>
        Rubrik
      </h1>
      <label htmlFor="sok">Sök</label>
      <input id="sok" value={query} onChange={(event) => setQuery(event.target.value)} />
      <p>{query.length} tecken</p>
    </>
  );
}

describe('useFocusOnMount', () => {
  it('flyttar fokus till elementet en gång när det monteras', () => {
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    render(<View />);
    expect(screen.getByRole('heading', { name: 'Rubrik' })).toHaveFocus();
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it('flyttar inte fokus när användaren skriver i sökfältet och vyn ritas om', async () => {
    const user = userEvent.setup();
    render(<View />);
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    const search = screen.getByLabelText('Sök');
    await user.click(search);
    await user.type(search, 'pass');
    expect(screen.getByText('4 tecken')).toBeInTheDocument();
    expect(search).toHaveFocus();
    // Bara userEvents egen fokusering av fältet, aldrig rubriken.
    expect(focus.mock.contexts.every((element) => element === search)).toBe(true);
  });

  it('ger samma funktion vid varje rendering', () => {
    const seen: unknown[] = [];
    function Probe({ count }: { count: number }) {
      seen.push(useFocusOnMount());
      return <p>{count}</p>;
    }
    const { rerender } = render(<Probe count={1} />);
    rerender(<Probe count={2} />);
    expect(seen).toHaveLength(2);
    expect(seen[0]).toBe(seen[1]);
  });
});
