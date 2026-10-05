/**
 * Byta en övning i ett genererat pass (berättelse 04, berättelse 06 kriterium 1), mot
 * produktionsbygget och den riktiga banken. Mobilbredd 375 px (designsystem.md avsnitt 1).
 *
 * Vilka övningar som har alternativ beror på banken, så testet letar upp det första kortet
 * som har några i stället för att peka ut en bestämd övning.
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function generatePass(page: Page) {
  await page.goto('/');
  await page.getByLabel('Ålder').fill('11');
  await page.getByRole('checkbox', { name: /^Passning och mottagning\b/ }).check();
  const players = page.getByLabel('Antal spelare');
  await players.fill('');
  await players.fill('12');
  await page.getByRole('button', { name: 'Generera pass' }).click();
  await expect(page.getByRole('heading', { name: 'Ditt pass' })).toBeVisible();
}

/** Öppnar bytesvyn för det första kortet som har alternativ, och lämnar den öppen. */
async function openSwapWithOptions(page: Page): Promise<void> {
  const count = await page.getByRole('button', { name: /^Byt övning, / }).count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    await page
      .getByRole('button', { name: /^Byt övning, / })
      .nth(index)
      .click();
    await expect(page.getByRole('heading', { level: 1, name: /^Byt övning: / })).toBeVisible();
    if ((await page.getByRole('button', { name: /^Välj denna: / }).count()) > 0) {
      return;
    }
    await page.getByRole('button', { name: 'Tillbaka till passet' }).first().click();
    await expect(page.getByRole('heading', { name: 'Ditt pass' })).toBeVisible();
  }
  throw new Error('Inget kort i passet har alternativ i banken');
}

test.describe('Berättelse 04: byta ut en övning i passet', () => {
  test('byter en övning, och det nya kortet visas med en planskiss', async ({ page }) => {
    await generatePass(page);
    await openSwapWithOptions(page);

    // Kriterium 6: varje alternativ visar planskissen i miniatyr.
    const options = page.getByRole('listitem');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(0);
    for (let index = 0; index < optionCount; index += 1) {
      await expect(
        options.nth(index).getByRole('button', { name: /^Förstora planskiss, / }),
      ).toBeVisible();
    }

    const first = options.first();
    const name = (await first.getByRole('heading', { level: 3 }).innerText()).trim();
    await first.getByRole('button', { name: `Välj denna: ${name}` }).click();

    await expect(page.getByRole('heading', { name: 'Ditt pass' })).toBeVisible();
    const card = page.locator('article').filter({
      has: page.getByRole('heading', { level: 3, name: new RegExp(`${escape(name)}$`) }),
    });
    await expect(card).toHaveCount(1);
    await expect(card.getByText(`Bytt till: ${name}.`)).toBeVisible();
    await expect(card.getByRole('button', { name: `Förstora planskiss, ${name}` })).toBeVisible();
    await expect(card.locator('svg[role="img"]')).toHaveCount(1);
    await expect(page.getByText('Planskiss saknas')).toHaveCount(0);
    await expect(page.getByText('Planskissen kunde inte visas')).toHaveCount(0);
    // Fokus på det nya kortets bytesknapp.
    await expect(card.getByRole('button', { name: /^Byt övning, / })).toBeFocused();
  });

  test('knapparna har minst 48 × 48 px träffyta (designsystem.md avsnitt 5)', async ({ page }) => {
    await generatePass(page);
    const swapButton = page.getByRole('button', { name: /^Byt övning, / }).first();
    await expectTapTarget(swapButton);
    await openSwapWithOptions(page);
    await expectTapTarget(page.getByRole('button', { name: /^Välj denna: / }).first());
    await expectTapTarget(page.getByRole('button', { name: 'Tillbaka till passet' }).first());
  });

  test('axe hittar inga fel i bytesvyn', async ({ page }) => {
    await generatePass(page);
    await openSwapWithOptions(page);
    const results = await new AxeBuilder({ page }).include('main').analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('axe hittar inga fel i passet efter ett byte', async ({ page }) => {
    await generatePass(page);
    await openSwapWithOptions(page);
    await page
      .getByRole('button', { name: /^Välj denna: / })
      .first()
      .click();
    await expect(page.getByRole('heading', { name: 'Ditt pass' })).toBeVisible();
    const results = await new AxeBuilder({ page }).include('main').analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});

async function expectTapTarget(locator: import('@playwright/test').Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(48);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
}

/** Gör en text till en del av ett reguljärt uttryck. */
function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
