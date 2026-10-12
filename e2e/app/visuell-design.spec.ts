/**
 * Slutgranskning av riktning A, Gräsmattan (docs/design/designsystem.md avsnitt 2, 6.10 och 6.11).
 *
 * Kontrollerar mot byggda pixlar, inte mot tokens: axe med färgkontrast, kantkontrast
 * (WCAG 1.4.11, minst 3:1) uträknad ur skärmbildens pixlar, delrubrikernas tillgängliga namn och
 * att sidhuvudets dekor inte följer med på utskrift. Ljust och mörkt läge, bredd 390 px och
 * 195 px (200 % zoom på 390 px).
 */
import { inflateSync } from 'node:zlib';
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type Rgb = [number, number, number];

/** Läser en PNG (8 bitar, RGB eller RGBA, utan interlace) som Playwright skriver ut. */
function decodePng(buffer: Buffer): { px: (x: number, y: number) => Rgb } {
  let offset = 8;
  let width = 0;
  let height = 0;
  let channels = 3;
  const idat: Buffer[] = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      expect(data[8]).toBe(8);
      expect([2, 6]).toContain(data[9]);
      expect(data[12]).toBe(0);
      channels = data[9] === 6 ? 4 : 3;
    } else if (type === 'IDAT') {
      idat.push(data);
    }
    offset += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)]!;
    for (let i = 0; i < stride; i += 1) {
      const cur = raw[y * (stride + 1) + 1 + i]!;
      const left = i >= channels ? out[y * stride + i - channels]! : 0;
      const up = y > 0 ? out[(y - 1) * stride + i]! : 0;
      const upLeft = y > 0 && i >= channels ? out[(y - 1) * stride + i - channels]! : 0;
      let value = cur;
      if (filter === 1) value = cur + left;
      else if (filter === 2) value = cur + up;
      else if (filter === 3) value = cur + Math.floor((left + up) / 2);
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        value = cur + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft);
      }
      out[y * stride + i] = value & 255;
    }
  }
  return {
    px: (x, y) => {
      const o = y * stride + x * channels;
      return [out[o]!, out[o + 1]!, out[o + 2]!];
    },
  };
}

function luminance([r, g, b]: Rgb): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: Rgb, b: Rgb): number {
  const hi = Math.max(luminance(a), luminance(b));
  const lo = Math.min(luminance(a), luminance(b));
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Kontrasten mellan en kant och det som ligger utanför den, mätt i pixlar på mitten av
 * elementets vänstra kant (en pixel in i kanten, fyra pixlar utanför).
 */
async function edgeContrast(page: Page, element: Locator): Promise<number> {
  await element.scrollIntoViewIfNeeded();
  const box = (await element.boundingBox())!;
  const x = Math.round(box.x);
  const y = Math.round(box.y + box.height / 2);
  const png = await page.screenshot({
    clip: { x: x - 4, y, width: 8, height: 1 },
    scale: 'css',
  });
  const image = decodePng(png);
  return contrast(image.px(5, 0), image.px(1, 0));
}

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

async function openSwap(page: Page) {
  const count = await page.getByRole('button', { name: /^Byt övning, / }).count();
  for (let index = 0; index < count; index += 1) {
    await page
      .getByRole('button', { name: /^Byt övning, / })
      .nth(index)
      .click();
    await expect(page.getByRole('heading', { level: 1, name: /^Byt övning: / })).toBeVisible();
    if ((await page.getByRole('button', { name: /^Välj denna: / }).count()) > 0) return;
    await page.getByRole('button', { name: 'Tillbaka till passet' }).first().click();
  }
  throw new Error('Inget kort har alternativ');
}

const SCHEMES = ['light', 'dark'] as const;
const WIDTHS = [390, 195] as const;

for (const scheme of SCHEMES) {
  for (const width of WIDTHS) {
    test.describe(`riktning A, ${scheme}, ${width} px`, () => {
      test.use({ colorScheme: scheme, viewport: { width, height: 800 } });

      test('axe (med färgkontrast) hittar inga fel i underlag, pass och byte', async ({ page }) => {
        await page.goto('/');
        let results = await new AxeBuilder({ page }).analyze();
        expect(results.violations, `underlag: ${JSON.stringify(results.violations)}`).toEqual([]);

        await generatePass(page);
        results = await new AxeBuilder({ page }).analyze();
        expect(results.violations, `pass: ${JSON.stringify(results.violations)}`).toEqual([]);

        await openSwap(page);
        results = await new AxeBuilder({ page }).analyze();
        expect(results.violations, `byte: ${JSON.stringify(results.violations)}`).toEqual([]);
      });

      test('ingen sidled skroll i underlag, pass och byte', async ({ page }) => {
        const overflow = () =>
          page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
        await page.goto('/');
        expect(await overflow()).toBeLessThanOrEqual(0);
        await generatePass(page);
        expect(await overflow()).toBeLessThanOrEqual(0);
        await openSwap(page);
        expect(await overflow()).toBeLessThanOrEqual(0);
      });

      test('fältens och knapparnas kant är minst 3:1 mot omgivningen', async ({ page }) => {
        await page.goto('/');
        const players = await edgeContrast(page, page.getByLabel('Antal spelare'));
        const age = await edgeContrast(page, page.getByLabel('Ålder'));
        await generatePass(page);
        const swap = await edgeContrast(
          page,
          page.getByRole('button', { name: /^Byt övning, / }).first(),
        );
        for (const value of [players, age, swap]) expect(value).toBeGreaterThanOrEqual(3);
      });

      // Designsystemet (avsnitt 6.10) kräver fältkantens färg på miniatyren (WCAG 1.4.11).
      // Koden använder kortkantens färg (1,5:1). Testet är avsiktligt rött tills det rättas.
      test('miniatyrknappens kant är minst 3:1 mot kortet', async ({ page }) => {
        await generatePass(page);
        const thumb = await edgeContrast(
          page,
          page.getByRole('button', { name: /^Förstora planskiss, / }).first(),
        );
        expect(thumb).toBeGreaterThanOrEqual(3);
      });
    });
  }
}

test.describe('tillgängliga namn och utskrift', () => {
  test('delrubrikerna heter "{n}. {del} · {n} min", tomma delar "{n}. {del}"', async ({ page }) => {
    await generatePass(page);
    const headings = await page.getByRole('heading', { level: 2 }).all();
    expect(headings.length).toBeGreaterThan(2);
    for (const heading of headings) {
      const snapshot = (await heading.ariaSnapshot()).trim();
      expect(snapshot).toMatch(/^- heading "\d\. [^"·]+?( · \d+ min)?" \[level=2\]$/);
    }
    await expect(
      page.getByRole('heading', { level: 2, name: /^1\. Uppvärmning · \d+ min$/ }),
    ).toBeVisible();
  });

  test('sidhuvudets dekor och varumärkesrad visas inte på utskrift', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });
    const header = page.locator('h1').locator('..');
    const info = await header.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        image: cs.backgroundImage,
        color: cs.backgroundColor,
        borderBottom: cs.borderBottomWidth,
        before: getComputedStyle(el, '::before').display,
        after: getComputedStyle(el, '::after').display,
        brand: getComputedStyle(el.querySelector('p')!).display,
      };
    });
    expect(info.image).toBe('none');
    expect(info.color).toBe('rgba(0, 0, 0, 0)');
    expect(info.borderBottom).toBe('0px');
    expect(info.before).toBe('none');
    expect(info.after).toBe('none');
    expect(info.brand).toBe('none');
  });
});
