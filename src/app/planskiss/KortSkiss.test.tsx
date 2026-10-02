/**
 * @vitest-environment jsdom
 *
 * Planskissen på övningskortet och i passvyn (berättelse 06 kriterium 1, 5 och 6,
 * berättelse 07 kriterium 1–4).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { contentExercise } from '../../regelmotor/__testdata__/bank-fixtur.ts';
import type { BankExercise, Exercise, Layout } from '../../regelmotor/index.ts';
import { FEM_MOT_FEM, PAR_MED_TRIO, SJU_MOT_SJU } from '../../planskiss/__testdata__/skisser.ts';
import { ExerciseCard } from '../session/ExerciseCard.tsx';
import { SessionView } from '../session/SessionView.tsx';
import { FULL_BANK, sessionOf } from '../__testdata__/session-fixture.ts';
import { sketchPlayerCount } from './KortSkiss.tsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const WITH_SKETCH: Exercise = contentExercise({
  id: 'passa-och-folj',
  namn: 'Passa och följ',
  spelare: { min: 5, max: 9 },
  yta: { alla: { langd: 15, bredd: 15 } },
  planskiss: SJU_MOT_SJU,
});

function layout(sizes: number[]): Layout {
  return {
    groups: sizes.length,
    sizes,
    coachesPerGroup: 0,
    coachesNeeded: 0,
    oddSolution: null,
    oddText: null,
  };
}

function card(exercise: Exercise, sizes: number[] | null = null) {
  return render(
    <ExerciseCard
      exercise={exercise}
      minutes={10}
      layout={sizes === null ? null : layout(sizes)}
      format="7mot7"
      placeKey="rad-1"
    />,
  );
}

describe('miniatyren på övningskortet', () => {
  it('visar skissen i en hopfälld knapp som heter "Förstora planskiss, {övningsnamn}"', () => {
    const { container } = card(WITH_SKETCH);
    const button = screen.getByRole('button', { name: 'Förstora planskiss, Passa och följ' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    // Miniatyren finns kvar med title och desc, men är dold för skärmläsare (texter.md avsnitt 8).
    const svg = button.querySelector('svg[role="img"]');
    expect(svg).not.toBeNull();
    expect(svg?.querySelector('title')?.textContent).toBe('Passa och följ, planskiss');
    expect(svg?.querySelector('desc')?.textContent).not.toBe('');
    expect(svg?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(within(button).queryByRole('img')).toBeNull();
    expect(container.querySelectorAll('[aria-hidden="true"] svg')).toHaveLength(1);
    expect(screen.queryByText('Teckenförklaring')).toBeNull();
  });

  it('knappens namn blir "Dölj planskiss, {övningsnamn}" när skissen är utfälld', async () => {
    const user = userEvent.setup();
    card(WITH_SKETCH);
    await user.click(screen.getByRole('button', { name: 'Förstora planskiss, Passa och följ' }));
    const button = screen.getByRole('button', { name: 'Dölj planskiss, Passa och följ' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    // Den förstorade skissen ligger utanför knappen och är inte dold.
    expect(screen.getByRole('img', { name: /Passa och följ, planskiss/ })).toBeInTheDocument();
  });

  it('miniatyren saknar etiketter och måttext (ADR 0012 avsnitt 5)', () => {
    const { container } = card(WITH_SKETCH);
    expect(container.querySelectorAll('svg text')).toHaveLength(0);
  });

  it('ett klick fäller ut skissen i normal storlek med teckenförklaringen, ett till fäller ihop', async () => {
    const user = userEvent.setup();
    const { container } = card(WITH_SKETCH);
    const button = screen.getByRole('button', { name: /Förstora planskiss, Passa och följ/ });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const region = container.querySelector(`[id="${button.getAttribute('aria-controls') ?? ''}"]`);
    expect(region).not.toBeNull();
    const big = within(region as HTMLElement).getByRole('img');
    // Den stora skissen har måttext och etiketter.
    expect(within(big).getByText('15 × 15 m')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Teckenförklaring' })).toBeVisible();
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Teckenförklaring')).toBeNull();
  });

  it('en övning utan skiss visar "Planskiss saknas" utan knapp', () => {
    card(contentExercise({ id: 'utan-skiss' }));
    expect(screen.getByText('Planskiss saknas')).toBeVisible();
    expect(screen.queryByRole('button', { name: /planskiss/ })).toBeNull();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('en övning med ogiltig skiss visar "Planskissen kunde inte visas" och resten av kortet', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    card({ ...WITH_SKETCH, planskiss: { version: 1, objekt: 'fel' } });
    expect(screen.getByText('Planskissen kunde inte visas')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Passa och följ' })).toBeVisible();
    expect(screen.getByText(WITH_SKETCH.syfte)).toBeVisible();
  });
});

describe('berättelse 06 kriterium 5: skalning efter antalet i gruppen', () => {
  it('utan gruppindelning visas basskissen', () => {
    const { container } = card(WITH_SKETCH);
    expect(container.querySelectorAll('svg circle[class*="lagA"]')).toHaveLength(5);
  });

  it('med en känd grupp ritas skissen för den största gruppen', () => {
    const { container } = card(WITH_SKETCH, [7, 6]);
    expect(container.querySelectorAll('svg circle[class*="lagA"]')).toHaveLength(7);
  });

  it('en övning för par ritas för trion när generatorn har gjort en (R-054)', async () => {
    const pair = contentExercise({
      id: 'en-mot-en-par',
      namn: 'Ett mot ett i par',
      grupptyp: 'par',
      spelare: { min: 2, max: 2 },
      yta: { alla: { langd: 12, bredd: 8 } },
      planskiss: PAR_MED_TRIO,
    });
    const trio: Layout = { ...layout([3, 2, 2]), oddSolution: 'trio', oddText: 'x' };
    const user = userEvent.setup();
    const { container } = render(
      <ExerciseCard exercise={pair} minutes={10} layout={trio} format="7mot7" placeKey="rad-1" />,
    );
    // Gruppen är större än spelare.max, och skissen visar alla tre.
    expect(container.querySelectorAll('svg [class*="spelare"]')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'Förstora planskiss, Ett mot ett i par' }));
    const big = screen.getByRole('img', { name: /Ett mot ett i par, planskiss/ });
    expect(big.querySelectorAll('[class*="spelare"]')).toHaveLength(3);
    expect(within(big).getByText('Väntar med ny boll')).toBeInTheDocument();
  });

  it('sketchPlayerCount tar den största gruppen, och inget antal utan grupper', () => {
    expect(sketchPlayerCount(null)).toBeUndefined();
    expect(sketchPlayerCount(layout([]))).toBeUndefined();
    expect(sketchPlayerCount(layout([4, 5, 4]))).toBe(5);
  });
});

describe('berättelse 07: skisserna i passvyn', () => {
  function bankWithSketches(): BankExercise[] {
    return FULL_BANK.map((exercise, index) => ({
      ...exercise,
      planskiss: index % 2 === 0 ? SJU_MOT_SJU : FEM_MOT_FEM,
    }));
  }

  it('varje övning i passet har en miniatyr, och alla id:n i vyn är unika', () => {
    const session = sessionOf(bankWithSketches());
    const { container } = render(
      <SessionView
        session={session}
        onChangeInput={() => undefined}
        onGenerateAgain={() => undefined}
      />,
    );
    const cards = container.querySelectorAll('article');
    expect(cards.length).toBeGreaterThan(2);
    for (const article of cards) {
      expect(article.querySelectorAll('svg[role="img"]')).toHaveLength(1);
      expect(
        within(article as HTMLElement).getAllByRole('button', { name: /^Förstora planskiss, / }),
      ).toHaveLength(1);
    }
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('en övning utan skiss och en med ogiltig skiss stoppar inte de andra', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const bank = bankWithSketches().map((exercise, index) =>
      index === 0
        ? { ...exercise, planskiss: undefined }
        : index === 1
          ? { ...exercise, planskiss: { version: 99 } }
          : exercise,
    );
    const session = sessionOf(bank);
    render(
      <SessionView
        session={session}
        onChangeInput={() => undefined}
        onGenerateAgain={() => undefined}
      />,
    );
    expect(screen.getByText('Planskiss saknas')).toBeVisible();
    expect(screen.getByText('Planskissen kunde inte visas')).toBeVisible();
    expect(screen.getAllByRole('button', { name: /^Förstora planskiss, / }).length).toBeGreaterThan(
      0,
    );
  });
});
