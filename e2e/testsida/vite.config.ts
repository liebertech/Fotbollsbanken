/**
 * Egen, minimal Vite-konfiguration för kvalitetssäkrarens testsida (index.html i den här
 * mappen). Testsidan importerar bara befintliga produktionskomponenter ur src/planskiss/ och
 * src/app/planskiss/ och ändrar ingen produktionskod. Den delar inte huvudappens
 * vite.config.ts, eftersom den inte behöver den virtuella bankmodulen (ADR 0015) och inte ska
 * riskera att påverka appens bygge.
 *
 * `root` sätts uttryckligen till den här mappen (Vites förval är annars `process.cwd()`, som
 * är repo-roten när kommandot körs av Playwright). `server.fs.allow` måste utökas till
 * repo-roten, eftersom testsidan importerar moduler utanför `root`.
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const here = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  root: here,
  plugins: [react()],
  server: {
    strictPort: true,
    fs: { allow: [repoRoot] },
  },
});
