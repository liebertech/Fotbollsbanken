/**
 * Playwright-konfiguration (kvalitetssäkring av `feature/ritmotor`, berättelse 06 och 07).
 *
 * Bara Chromium ingår (`npx playwright install chromium`), enligt uppdraget. Två webbservrar
 * körs upp:
 *
 * - "app": appens riktiga produktionsbygge, visat med `vite preview`. Här testas det riktiga
 *   ledarflödet: fylla i underlag, generera ett pass, se planskisserna (eller "Planskiss
 *   saknas"). Bankens övningar saknar ännu skissdata på den här grenen (0 av 58, se
 *   content/ovningar/README.md), så det är det enda utfallet som går att se i appen i dag.
 * - "testsida": en liten testsida (e2e/testsida/) som renderar ritmotorns egna produktions-
 *   komponenter (KortSkiss, Planskissvy, Teckenforklaring) med ögonblicksbildernas testdata
 *   (src/planskiss/__testdata__/skisser.ts), ett exempel per spelform. Den används för att
 *   kunna fälla ut en miniatyr, läsa teckenförklaringen och visa de trånga fallen (en tätt
 *   packad kö och en kö som stannar vid kanten och visar "+N", se e2e/testsida/trangafall.ts)
 *   som bankens tomma skissfält annars gör omöjligt att se i den riktiga appen just nu.
 *
 * Mobilbredd 375 px är förvalet för båda projekten (designsystem.md avsnitt 1).
 */
import { defineConfig, devices } from '@playwright/test';

const APP_PORT = 4173;
const TESTSIDA_PORT = 4174;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  webServer: [
    {
      // vite preview kräver ett färskt bygge: npm run build gör det, och är idempotent.
      command: `npm run build && npm run preview -- --port ${APP_PORT} --strictPort`,
      url: `http://localhost:${APP_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: 'pipe',
    },
    {
      command: `npx vite --config e2e/testsida/vite.config.ts --port ${TESTSIDA_PORT} --strictPort`,
      url: `http://localhost:${TESTSIDA_PORT}/index.html`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: 'pipe',
    },
  ],

  projects: [
    {
      name: 'app',
      testMatch: /app\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${APP_PORT}`,
        viewport: { width: 375, height: 800 },
      },
    },
    {
      name: 'testsida',
      testMatch: /testsida\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TESTSIDA_PORT}`,
        viewport: { width: 375, height: 900 },
      },
    },
  ],
});
