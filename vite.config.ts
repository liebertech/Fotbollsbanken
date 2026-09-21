import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { ovningsbanken } from './scripts/ovningsbanken-plugin.ts';

export default defineConfig({
  // Övningsbanken byggs in som den virtuella modulen virtual:ovningsbanken (ADR 0015).
  plugins: [react(), ovningsbanken()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'scripts/**/*.test.ts'],
  },
});
