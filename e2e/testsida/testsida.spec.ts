/**
 * Testsidans e2e-test (kvalitetssäkring av `feature/ritmotor`). Testsidan renderar ritmotorns
 * egna produktionskomponenter med ögonblicksbildernas testdata, eftersom bankens övningar
 * saknar skissdata på den här grenen (se e2e/app/generera-pass.spec.ts för motiveringen).
 *
 * Täcker det som inte går att pröva i den riktiga appen just nu:
 * - att fälla ut en miniatyr till normal storlek och läsa teckenförklaringen
 *   (berättelse 06, kriterium 6; berättelse 07, kriterium 4),
 * - ett exempel per spelform (ADR 0012 avsnitt 8),
 * - de två trånga fallen: en tätt packad kö och en kö som stannar vid bildens kant och visar
 *   "+N" (ADR 0012 avsnitt 4, fynd A i src/planskiss/skalning.ts).
 *
 * Skärmbilderna sparas i docs/design/skarmbilder/ritmotor/ för mänsklig granskning, inte som
 * Playwright-ögonblicksbilder (se motiveringen i generera-pass.spec.ts). De sparas bara med
 * `SKARMBILDER=1`, se e2e/skarmbilder.ts.
 */
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { screenshotPath } from '../skarmbilder.ts';

const GAME_FORMATS = ['3mot3', '5mot5', '7mot7', '9mot9', '11mot11'] as const;

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Testsida för planskisser' }),
  ).toBeVisible();
});

test.describe('Ett exempel per spelform (ADR 0012 avsnitt 8)', () => {
  for (const format of GAME_FORMATS) {
    test(`${format}: miniatyr visas, går att fälla ut, och teckenförklaringen visas (berättelse 06 kriterium 6)`, async ({
      page,
    }) => {
      const card = page.getByTestId(`kort-${format}`);
      const button = card.getByRole('button', { name: /planskiss/i });
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      // Miniatyren har ingen teckenförklaring (ADR 0012 avsnitt 3).
      await expect(card.getByRole('list', { name: 'Teckenförklaring' })).toHaveCount(0);

      await button.click();
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      const legend = card.getByRole('list', { name: 'Teckenförklaring' });
      await expect(legend).toBeVisible();
      await expect(legend.getByRole('listitem').first()).toBeVisible();

      await page.emulateMedia({ colorScheme: 'light' });
      await card.screenshot({ path: screenshotPath(`normal-${format}-ljust.png`) });
    });
  }

  test('7mot7 utfälld, mörkt läge (berättelse 06 kriterium 7)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    const card = page.getByTestId('kort-7mot7');
    await card.getByRole('button', { name: /planskiss/i }).click();
    await expect(card.getByRole('list', { name: 'Teckenförklaring' })).toBeVisible();
    await card.screenshot({ path: screenshotPath('normal-7mot7-morkt.png') });
  });
});

test.describe('Trånga fall (ADR 0012 avsnitt 4, src/planskiss/skalning.ts)', () => {
  test('tätt packad kö: det angivna avståndet är mindre än symbolens diameter, men symbolerna krockar inte (fynd A)', async ({
    page,
  }) => {
    const card = page.getByTestId('kort-overlappande-ko');
    await card.getByRole('button', { name: /planskiss/i }).click();
    await expect(card.getByRole('list', { name: 'Teckenförklaring' })).toBeVisible();

    await page.emulateMedia({ colorScheme: 'light' });
    await card.screenshot({ path: screenshotPath('trangt-overlappande-ko-ljust.png') });
    await page.emulateMedia({ colorScheme: 'dark' });
    await card.screenshot({ path: screenshotPath('trangt-overlappande-ko-morkt.png') });
  });

  test('en kö som stannar vid bildens kant och visar "+N" i stället för att klippas (fynd A)', async ({
    page,
  }) => {
    const card = page.getByTestId('kort-ko-vid-kanten');
    await card.getByRole('button', { name: /planskiss/i }).click();
    await expect(card.getByRole('list', { name: 'Teckenförklaring' })).toBeVisible();

    await page.emulateMedia({ colorScheme: 'light' });
    await card.screenshot({ path: screenshotPath('trangt-ko-vid-kanten-ljust.png') });
    await page.emulateMedia({ colorScheme: 'dark' });
    await card.screenshot({ path: screenshotPath('trangt-ko-vid-kanten-morkt.png') });
  });
});

test.describe('Hela testsidan', () => {
  test('översikt, ljust och mörkt läge', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.screenshot({
      path: screenshotPath('testsida-oversikt-ljust.png'),
      fullPage: true,
    });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.screenshot({
      path: screenshotPath('testsida-oversikt-morkt.png'),
      fullPage: true,
    });
  });

  test('axe hittar inga fel, varken hopfälld eller utfälld', async ({ page }) => {
    const before = await new AxeBuilder({ page }).analyze();
    expect(before.violations, JSON.stringify(before.violations, null, 2)).toEqual([]);

    for (const format of GAME_FORMATS) {
      await page
        .getByTestId(`kort-${format}`)
        .getByRole('button', { name: /planskiss/i })
        .click();
    }
    const after = await new AxeBuilder({ page }).analyze();
    expect(after.violations, JSON.stringify(after.violations, null, 2)).toEqual([]);
  });
});
