/**
 * Första e2e-testet av ritmotorn i den riktiga appen (berättelse 02, 06 och 07), mot
 * produktionsbygget via `vite preview`. Mobilbredd 375 px (designsystem.md avsnitt 1).
 *
 * Bankens övningar saknar skissdata på den här grenen (0 av 58 i content/ovningar/, se
 * content/ovningar/README.md), så det enda utfallet som går att se här är "Planskiss saknas"
 * (berättelse 06, kriterium 2; berättelse 07, kriterium 2). Att fälla ut en miniatyr och läsa
 * teckenförklaringen (berättelse 06, kriterium 6; berättelse 07, kriterium 4) kräver en övning
 * med giltig skiss och testas i stället mot testsidan, se e2e/testsida/testsida.spec.ts.
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
  test('passet visar "Planskiss saknas" för varje övning (banken saknar skissdata)', async ({
    page,
  }) => {
    await generatePass(page);

    const cards = page.locator('article');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await expect(cards.nth(index).getByText('Planskiss saknas')).toBeVisible();
    }
    // Berättelse 06, kriterium 2: aldrig en trasig bildikon eller en teknisk felutskrift.
    await expect(page.locator('svg')).toHaveCount(0);
    await expect(page.getByText('Planskissen kunde inte visas')).toHaveCount(0);
  });

  test('platshållaren är ingen knapp: det finns ingenting att fälla ut utan skissdata', async ({
    page,
  }) => {
    await generatePass(page);
    await expect(page.getByRole('button', { name: /planskiss/i })).toHaveCount(0);
  });

  test('axe hittar inga fel i den genererade passvyn', async ({ page }) => {
    await generatePass(page);
    const results = await new AxeBuilder({ page }).include('main').analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('skärmbild: genererat pass med "Planskiss saknas", ljust läge', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await generatePass(page);
    await page.screenshot({
      path: screenshotPath('pass-planskiss-saknas-ljust.png'),
      fullPage: true,
    });
  });

  test('skärmbild: genererat pass med "Planskiss saknas", mörkt läge', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await generatePass(page);
    await page.screenshot({
      path: screenshotPath('pass-planskiss-saknas-morkt.png'),
      fullPage: true,
    });
  });
});
