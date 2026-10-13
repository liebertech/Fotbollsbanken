/**
 * Ingen sidled skroll vid 195 px (200 % text på 390 px, designsystem.md avsnitt 6.10), oavsett
 * vilka övningar som slumpas fram och vilket typsnitt som finns.
 *
 * Bakgrund: bytesvyn skrollade 4 px i sidled i CI (Ubuntu, bredare typsnitt än lokalt) när ett
 * alternativ hade ett långt sammansatt ord, till exempel "Skadeförebyggande" eller
 * "omställningsregel". Kontrollen i visuell-design.spec.ts berodde på slumpen och typsnittet.
 *
 * Här görs två saker:
 * - Långa ord: varje rubrik och textstycke i pass- och bytesvyn byts mot ett ord som är längre
 *   än vyn är bred. Då beror kontrollen varken på banken, fröet eller typsnittet.
 * - Banken: med ett fast frö genereras ett pass per fokusområde och spelform, och varje
 *   bytesvy öppnas. Spelformer utan övningar i banken ger inget pass och hoppas över.
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const LONG_WORD = 'Skadeförebyggandeomställningsregelmålvaktsspelsuppbyggnad';

/** Fast följd för `Math.random`, så att fröet till motorn blir detsamma i varje körning. */
async function fixRandom(page: Page) {
  await page.addInitScript(() => {
    let state = 20261012;
    Math.random = () => {
      state = (state * 1103515245 + 12345) % 2147483648;
      return state / 2147483648;
    };
  });
}

async function overflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

/**
 * Byter texten i vyns textstycken och kortrubriker mot ord som inte ryms på en rad. Det är där
 * bankens innehåll och fokusområdena står. Vy- och delrubrikerna (h1, h2) har ett fast ordförråd,
 * och element som är flex eller rutnät är rader med ikon och text, så de lämnas orörda.
 */
async function fillWithLongWords(page: Page): Promise<number> {
  return page.evaluate((word) => {
    let filled = 0;
    for (const element of Array.from(document.querySelectorAll('main :is(h3, p)'))) {
      if (element.children.length > 0 || (element.textContent ?? '').trim() === '') continue;
      if (getComputedStyle(element).display !== 'block') continue;
      element.textContent = `${word} ${word}`;
      filled += 1;
    }
    return filled;
  }, LONG_WORD);
}

const focusBoxes = (page: Page) =>
  page.getByRole('group', { name: /^Fokusområden/ }).getByRole('checkbox');

/**
 * Fyller i underlaget och genererar. Svarar om ett pass skapades: underlaget kan underkännas
 * (Nickspel kräver ett fokusområde till) och banken kan sakna övningar för underlaget.
 */
async function generatePass(
  page: Page,
  age: string,
  players: string,
  focusIndexes: readonly number[],
): Promise<boolean> {
  await page.goto('/');
  await page.getByLabel('Ålder').fill(age);
  const playerField = page.getByLabel('Antal spelare');
  await playerField.fill('');
  await playerField.fill(players);
  for (const index of focusIndexes) await focusBoxes(page).nth(index).check();
  await page.getByRole('button', { name: 'Generera pass' }).click();
  const passHeading = page.getByRole('heading', { level: 1, name: 'Ditt pass' });
  await expect(
    passHeading
      .or(page.getByRole('heading', { level: 1, name: /^Vi kunde inte skapa/ }))
      .or(page.getByText(/se markeringarna ovan/)),
  ).toBeVisible();
  return passHeading.isVisible();
}

const swapButtons = (page: Page) => page.getByRole('button', { name: /^Byt övning, / });

async function openSwap(page: Page, index: number) {
  await swapButtons(page).nth(index).click();
  await expect(page.getByRole('heading', { level: 1, name: /^Byt övning: / })).toBeVisible();
}

async function backToPass(page: Page) {
  await page.getByRole('button', { name: 'Tillbaka till passet' }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Ditt pass' })).toBeVisible();
}

test.describe('ingen sidled skroll vid 195 px', () => {
  test.use({ viewport: { width: 195, height: 800 } });

  test('långa ord i pass- och bytesvyn bryts', async ({ page }) => {
    await fixRandom(page);
    expect(await generatePass(page, '11', '12', [0])).toBe(true);
    const count = await swapButtons(page).count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await openSwap(page, index);
      expect(await fillWithLongWords(page)).toBeGreaterThan(1);
      expect(await overflow(page), `bytesvy ${index + 1}`).toBeLessThanOrEqual(0);
      await backToPass(page);
    }

    expect(await fillWithLongWords(page)).toBeGreaterThan(1);
    expect(await overflow(page), 'passvyn').toBeLessThanOrEqual(0);
  });

  for (const [format, age, players] of [
    ['3 mot 3', '7', '6'],
    ['5 mot 5', '9', '10'],
    ['7 mot 7', '11', '14'],
    ['9 mot 9', '13', '18'],
    ['11 mot 11', '16', '22'],
  ] as const) {
    test(`underlag, pass och varje bytesvy per fokusområde, ${format}`, async ({ page }) => {
      test.setTimeout(180_000);
      await fixRandom(page);
      await page.goto('/');
      await page.getByLabel('Ålder').fill(age);
      expect(await overflow(page), 'underlaget').toBeLessThanOrEqual(0);
      const focusCount = await focusBoxes(page).count();
      expect(focusCount).toBeGreaterThan(0);

      let passes = 0;
      for (let focus = 0; focus < focusCount; focus += 1) {
        const created =
          (await generatePass(page, age, players, [focus])) ||
          (await generatePass(page, age, players, [focus, focus === 0 ? 1 : 0]));
        if (!created) continue;
        passes += 1;
        expect(await overflow(page), `passvyn, fokus ${focus + 1}`).toBeLessThanOrEqual(0);
        const count = await swapButtons(page).count();
        for (let index = 0; index < count; index += 1) {
          await openSwap(page, index);
          expect(
            await overflow(page),
            `fokus ${focus + 1}, bytesvy ${index + 1}`,
          ).toBeLessThanOrEqual(0);
          await backToPass(page);
        }
      }
      expect(passes, 'minst ett pass i spelformen').toBeGreaterThan(0);
    });
  }
});
