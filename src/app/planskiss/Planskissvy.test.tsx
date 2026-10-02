/**
 * @vitest-environment jsdom
 *
 * Saknad och ogiltig skiss, felgränsen och teckenförklaringen i vyn (ADR 0012 avsnitt 3 och 7,
 * berättelse 06 kriterium 2, 3 och 6, berättelse 07 kriterium 2 och 3, RK-1).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { readPlanskiss } from '../../regelmotor/schema/planskiss.ts';
import { FEM_MOT_FEM, SJU_MOT_SJU } from '../../planskiss/__testdata__/skisser.ts';
import { Planskissvy, instanceId } from './Planskissvy.tsx';
import type { PlanskissvyProps } from './Planskissvy.tsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function view(planskiss: unknown, overrides: Partial<PlanskissvyProps> = {}) {
  return (
    <Planskissvy
      result={readPlanskiss(planskiss)}
      titel="Passa och följ"
      instansId="ovning-1"
      storlek="normal"
      {...overrides}
    />
  );
}

describe('berättelse 06 kriterium 2: skiss saknas', () => {
  it.each([
    ['utelämnad', undefined],
    ['null', null],
  ])('%s planskiss visar "Planskiss saknas" och ingen bild', (_, value) => {
    const { container } = render(view(value));
    expect(screen.getByText('Planskiss saknas')).toBeVisible();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('platshållaren finns också i miniatyr', () => {
    render(view(undefined, { storlek: 'miniatyr' }));
    expect(screen.getByText('Planskiss saknas')).toBeVisible();
  });
});

describe('berättelse 06 kriterium 3: ogiltig skiss', () => {
  it.each([
    ['okänt fält', { ...SJU_MOT_SJU, former: [] }],
    ['fel version', { ...SJU_MOT_SJU, version: 2 }],
    ['en sträng', 'inte en skiss'],
    ['en tom lista', []],
  ])('%s visar "Planskissen kunde inte visas" och ingen teknisk felutskrift', (_, value) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { container } = render(view(value));
    expect(screen.getByText('Planskissen kunde inte visas')).toBeVisible();
    expect(container.querySelector('svg')).toBeNull();
    expect(container.textContent).toBe('Planskissen kunde inte visas');
  });
});

describe('RK-1 och ADR 0012 avsnitt 7: varje skiss har en egen felgräns', () => {
  it('ett fel när en skiss ritas visar platshållaren för just den skissen', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <>
        <div data-testid="trasig">{view(SJU_MOT_SJU, { instansId: 'Ogiltigt id' })}</div>
        <div data-testid="hel">{view(FEM_MOT_FEM, { instansId: 'ovning-2' })}</div>
      </>,
    );
    expect(
      within(screen.getByTestId('trasig')).getByText('Planskissen kunde inte visas'),
    ).toBeVisible();
    expect(within(screen.getByTestId('hel')).getByRole('img')).toBeInTheDocument();
  });
});

describe('ADR 0012 avsnitt 3: teckenförklaringen', () => {
  it('visas i normal storlek, direkt och utan knapp', () => {
    const { container } = render(view(SJU_MOT_SJU));
    const list = screen.getByRole('list', { name: 'Teckenförklaring' });
    const items = within(list)
      .getAllByRole('listitem')
      .map((item) => item.textContent);
    expect(items).toEqual([
      'Spelare, lag A',
      'Kon',
      'Boll',
      'Ruta',
      'Passning',
      'Löpning utan boll',
    ]);
    expect(container.querySelector('button')).toBeNull();
  });

  it.each(['planlage', 'utskrift'] as const)('visas också i storleken %s', (storlek) => {
    render(view(SJU_MOT_SJU, { storlek }));
    expect(screen.getByRole('list', { name: 'Teckenförklaring' })).toBeVisible();
  });

  it('visas inte i miniatyr', () => {
    render(view(SJU_MOT_SJU, { storlek: 'miniatyr' }));
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryByText('Teckenförklaring')).toBeNull();
  });

  it('visas inte när skissen saknas eller är ogiltig', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <>
        {view(undefined)}
        {view({ version: 1 })}
      </>,
    );
    expect(screen.queryByText('Teckenförklaring')).toBeNull();
  });

  it('symbolernas mönster får egna id:n, olika från skissens', () => {
    const { container } = render(view(FEM_MOT_FEM, { antalSpelare: 3 }));
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('bildtexten', () => {
  it('parallella ytor: "Så här ser en av 3 ytor ut." i bildtexten och i desc', () => {
    const input = { ...SJU_MOT_SJU, skalning: { strategi: 'parallella-ytor', per_yta: 5 } };
    const { container } = render(view(input, { antalSpelare: 12 }));
    expect(screen.getByText('Så här ser en av 3 ytor ut.')).toBeVisible();
    expect(container.querySelector('desc')?.textContent).toMatch(/Så här ser en av 3 ytor ut\.$/);
  });

  it('ingen bildtext när skissen ritas som den är', () => {
    const { container } = render(view(SJU_MOT_SJU, { antalSpelare: 5 }));
    expect(container.querySelector('svg[role="img"] + span')).toBeNull();
  });
});

describe('instanceId', () => {
  it('gör ett giltigt instansId av övningens id och passets nyckel', () => {
    expect(instanceId('passa-och-folj', 'rad-3-2', 'mini')).toBe('passa-och-folj-rad-3-2-mini');
    expect(instanceId('Å Ä', '')).toBe('skiss');
    expect(instanceId('x'.repeat(100))).toHaveLength(70);
  });

  it('ger olika id:n för samma långa övning på olika platser (R6)', () => {
    const exerciseId = 'x'.repeat(64);
    const keys = ['g1-10', 'g1-100', 'g1-1000', 'rad-3-2', 'rad-3-20'];
    const ids = keys.map((key) => instanceId(exerciseId, key));
    expect(new Set(ids).size).toBe(keys.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]{1,70}$/);
      expect(`${id}-mini`).toMatch(/^[a-z0-9-]{1,80}$/);
    }
  });

  it('skiljer två långa övnings-id:n med samma början åt (R6)', () => {
    const first = instanceId(`${'a'.repeat(64)}-forsta`, 'g1');
    const second = instanceId(`${'a'.repeat(64)}-andra`, 'g1');
    expect(first).not.toBe(second);
    expect(first).toMatch(/^[a-z0-9-]{1,70}$/);
  });

  it('håller sig inom 70 tecken även när platsen i passet är lång', () => {
    const first = instanceId('ovning', 'p'.repeat(80));
    const second = instanceId('ovning', `${'p'.repeat(79)}q`);
    expect(first).toMatch(/^[a-z0-9-]{1,70}$/);
    expect(first).not.toBe(second);
  });
});
