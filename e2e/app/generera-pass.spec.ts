/**
 * Första e2e-testet av ritmotorn i den riktiga appen (berättelse 02, 06 och 07), mot
 * produktionsbygget via `vite preview`. Mobilbredd 375 px (designsystem.md avsnitt 1).
 *
 * Alla godkända övningar i banken har skissdata (berättelse 06, användarens beslut
 * 2026-09-28), så varje kort i ett genererat pass ska visa en planskiss. Fallen "Planskiss saknas"
 * och "Planskissen kunde inte visas" testas i komponenttesterna, se
 * src/app/planskiss/Planskissvy.test.tsx.
 *
 * Skärmbilderna sparas som vanliga filer i docs/design/skarmbilder/ritmotor/, inte som
 * Playwright-ögonblicksbilder: bildjämförelse mellan körningar är känsligt för typsnitt och
 * GPU-rendering och skulle själv kunna bli ett instabilt test (se CLAUDE.md, "ett test som
 * ibland går igenom och ibland inte är ett fynd"). Bilderna är till för mänsklig granskning.
 * De sparas bara med `SKARMBILDER=1`, se e2e/skarmbilder.ts.
 */
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { screenshotPath } from '../skarmbilder.ts';

async function generatePass(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByLabel('Ålder').fill('11');
  await page.getByRole('checkbox', { name: /^Passning och mottagning\b/ }).check();
  const players = page.getByLabel('Antal spelare');
  await players.fill('');
  await players.fill('12');
  await page.getByRole('button', { name: 'Generera pass' }).click();
  await expect(page.getByRole('heading', { name: 'Ditt pass' })).toBeVisible();
}

test.describe('Berättelse 02, 06 och 07: generera ett pass och se planskisserna', () => {
  test('varje övning i passet visar en planskiss i miniatyr', async ({ page }) => {
    await generatePass(page);

    const cards = page.locator('article');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await expect(
        cards.nth(index).getByRole('button', { name: /^Förstora planskiss, / }),
      ).toBeVisible();
    }
    // Berättelse 06, kriterium 2 och 3: bankens skisser är giltiga, så ingen platshållare visas.
    await expect(page.getByText('Planskiss saknas')).toHaveCount(0);
    await expect(page.getByText('Planskissen kunde inte visas')).toHaveCount(0);
  });

  test('miniatyren fälls ut i normal storlek med teckenförklaring', async ({ page }) => {
    await generatePass(page);
    const card = page.locator('article').first();
    // Berättelse 06, kriterium 6: ingen teckenförklaring i miniatyr.
    await expect(card.getByText('Teckenförklaring')).toHaveCount(0);

    await card.getByRole('button', { name: /^Förstora planskiss, / }).click();

    await expect(card.getByRole('button', { name: /^Dölj planskiss, / })).toBeVisible();
    await expect(card.getByText('Teckenförklaring')).toBeVisible();
  });

  test('axe hittar inga fel i den genererade passvyn', async ({ page }) => {
    await generatePass(page);
    const results = await new AxeBuilder({ page }).include('main').analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('axe hittar inga fel med en utfälld planskiss', async ({ page }) => {
    await generatePass(page);
    await page
      .locator('article')
      .first()
      .getByRole('button', { name: /^Förstora planskiss, / })
      .click();
    const results = await new AxeBuilder({ page }).include('main').analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('skärmbild: genererat pass med planskisser, ljust läge', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await generatePass(page);
    await page.screenshot({ path: screenshotPath('pass-med-skisser-ljust.png'), fullPage: true });
  });

  test('skärmbild: genererat pass med planskisser, mörkt läge', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await generatePass(page);
    await page.screenshot({ path: screenshotPath('pass-med-skisser-morkt.png'), fullPage: true });
  });
});
