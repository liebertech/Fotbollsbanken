/**
 * Ytraden på övningskortet (ADR 0017), testad direkt mot komponenten i stället för genom ett
 * helt genererat pass. `view.test.tsx` prövar att ytraden syns i ett riktigt pass; de här
 * testerna prövar uppslagningen per spelform i isolering: vilken nyckel som vinner när flera
 * skulle kunna gälla, och att ett kort för en spelform utan referens inte visar en parentes
 * som hör till en annan spelform.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ExerciseCard } from './ExerciseCard.tsx';
import { contentExercise } from '../../regelmotor/__testdata__/bank-fixtur.ts';
import type { Exercise, GameFormat } from '../../regelmotor/index.ts';

function cardHtml(overrides: Record<string, unknown>, format: GameFormat): string {
  const exercise = contentExercise(overrides);
  return renderToStaticMarkup(
    <ExerciseCard exercise={exercise} minutes={10} layout={null} format={format} />,
  );
}

describe('ADR 0017 ytreferensens uppslagning per spelform', () => {
  /*
   * Schemat tillåter aldrig att en spelform täcks av både `alla` och sin egen nyckel
   * (ADR 0017, samma kontroll som R-092), så de två nycklarna prövas var för sig, aldrig i
   * en övning som har båda för samma spelform.
   */
  it('en spelformsnyckel visas för sin egen spelform', () => {
    const markup = cardHtml(
      {
        spelformer: ['5mot5', '7mot7'],
        yta: { alla: { langd: 18, bredd: 12 } },
        ytreferens: { '7mot7': 'ert eget straffområde' },
      },
      '7mot7',
    );
    expect(markup).toContain('ert eget straffområde');
  });

  it('alla används för varje spelform som saknar egen nyckel', () => {
    const overrides = {
      spelformer: ['5mot5', '7mot7'],
      yta: { alla: { langd: 18, bredd: 12 } },
      ytreferens: { alla: 'stora planens målområde' },
    };
    expect(cardHtml(overrides, '7mot7')).toContain('stora planens målområde');
    expect(cardHtml(overrides, '5mot5')).toContain('stora planens målområde');
  });

  it('ingen referens visas för en spelform som varken har egen nyckel eller alla', () => {
    const markup = cardHtml(
      {
        spelformer: ['5mot5', '7mot7'],
        yta: { alla: { langd: 18, bredd: 12 } },
        ytreferens: { '7mot7': 'ert eget straffområde' },
      },
      '5mot5',
    );
    expect(markup).toContain('Yta:\u00a018\u00a0×\u00a012\u00a0meter');
    expect(markup).not.toContain('ert eget straffområde');
    expect(markup).not.toMatch(/meter\s*\(/u);
  });

  it('måttet visas med svenskt decimaltecken, med och utan referens', () => {
    const withoutReference = cardHtml({ yta: { alla: { langd: 18.5, bredd: 12.3 } } }, '7mot7');
    expect(withoutReference).toContain('Yta:\u00a018,5\u00a0×\u00a012,3\u00a0meter');

    const withReference = cardHtml(
      {
        yta: { alla: { langd: 18.5, bredd: 12.3 } },
        ytreferens: { alla: 'ungefär en fjärdedel av stora planen' },
      },
      '7mot7',
    );
    expect(withReference).toContain(
      'Yta:\u00a018,5\u00a0×\u00a012,3\u00a0meter\u00a0(ungefär en fjärdedel av stora planen)',
    );
  });

  /*
   * docs/design/texter.md avsnitt 4: "Yta: {mått} meter (" hålls ihop med hårda mellanslag,
   * så att "×" eller "(" aldrig hamnar ensamt på en rad. Referensen bryter fritt och behåller
   * sina vanliga mellanslag.
   */
  it('måttet och parentesens början hålls ihop, referensen bryter fritt', () => {
    const markup = cardHtml(
      {
        yta: { alla: { langd: 18, bredd: 12 } },
        ytreferens: { alla: 'stora planens målområde, dubbelt så djupt' },
      },
      '7mot7',
    );
    const line = /Yta:[^<]*\)/u.exec(markup)?.[0] ?? '';
    const [measure = '', reference = ''] = line.split('(');
    expect(measure).toBe('Yta:\u00a018\u00a0×\u00a012\u00a0meter\u00a0');
    expect(measure).not.toContain(' ');
    expect(reference).toBe('stora planens målområde, dubbelt så djupt)');
    expect(reference).not.toContain('\u00a0');
  });

  /*
   * Schemat underkänner en övning som täcker samma spelform med både `alla` och sin egen
   * nyckel (testet ovan om ADR 0017), så det här läget kan inte uppstå för en giltig
   * bankövning. Kortet läser objektet direkt utan att validera om det, så koden har ändå ett
   * bestämt svar om ett sådant objekt någonsin når den (till exempel efter en framtida
   * ändring uppströms) — och exact-optional-property-types i tsconfig gör att `ytreferens`
   * inte kan sättas till `undefined` här, så testet går via `as Exercise` för att kringgå
   * schemat, inte typen.
   */
  it('en spelformsnyckel vinner över alla, om ett objekt ändå skulle ha båda (kortet validerar inte om)', () => {
    const exercise = {
      ...contentExercise({
        spelformer: ['5mot5', '7mot7'],
        yta: { alla: { langd: 18, bredd: 12 } },
      }),
      ytreferens: { alla: 'stora planens målområde', '7mot7': 'ert eget straffområde' },
    } as Exercise;
    const markup = renderToStaticMarkup(
      <ExerciseCard exercise={exercise} minutes={10} layout={null} format="7mot7" />,
    );
    expect(markup).toContain('ert eget straffområde');
    expect(markup).not.toContain('stora planens målområde');
  });
});

describe('Ytförklaringen på kortet', () => {
  function withHelp(overrides: Record<string, unknown>, showAreaHelp: boolean): string {
    return renderToStaticMarkup(
      <ExerciseCard
        exercise={contentExercise(overrides)}
        minutes={10}
        layout={null}
        format="7mot7"
        showAreaHelp={showAreaHelp}
      />,
    );
  }

  it('visas fälld, utan texten i DOM:en, när kortet har en referens och är utpekat', () => {
    const markup = withHelp({ ytreferens: { alla: 'stora planens målområde' } }, true);
    expect(markup).toContain('Vad betyder måttet i parentes?');
    expect(markup).toMatch(/aria-expanded="false"[^>]*>Vad betyder/u);
    expect(markup).not.toContain('Referensen jämför storlek.');
  });

  it('visas inte på ett kort som inte är utpekat', () => {
    const markup = withHelp({ ytreferens: { alla: 'stora planens målområde' } }, false);
    expect(markup).not.toContain('Vad betyder måttet i parentes?');
  });

  it('visas inte när kortet saknar en referens att förklara', () => {
    expect(withHelp({}, true)).not.toContain('Vad betyder måttet i parentes?');
  });
});
