import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { ovningsbanken } from './scripts/ovningsbanken-plugin.ts';

export default defineConfig({
  // Övningsbanken byggs in som den virtuella modulen virtual:ovningsbanken (ADR 0015).
  plugins: [react(), ovningsbanken()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'scripts/**/*.test.ts'],

    /*
     * Sviten är CPU-bunden, inte I/O-bunden: egenskapstestet mot den riktiga banken i
     * scripts/regelmotor-mot-banken.test.ts räknar i flera sekunder utan att någonsin vänta,
     * och interaktionstesterna kör en egen jsdom-miljö med React-rendering per fil.
     *
     * Vitests förval är `availableParallelism() - 1` arbetsprocesser. På en fyrkärnig maskin
     * blir det tre processer plus huvudprocessen om fyra kärnor, och då slåss allt om samma
     * CPU. Hälften av kärnorna lämnar utrymme åt huvudprocessen. Uppmätt på den här maskinen:
     * egenskapstestet tog 7,2 s ensamt, 12,2 s och 20,9 s med tre processer och 10,4 s med
     * två. En senare jämförelse, när CPU:n klockade ned till 1,7 av 3,0 GHz, gav samma tid
     * för två och tre processer. Ändringen är alltså i värsta fall verkningslös och i bästa
     * fall märkbar – den tar bort översatsningen, den gör inte maskinen snabbare.
     * (Förvalet var aldrig 24 processer: 24 är antalet testfiler.)
     */
    maxWorkers: '50%',

    /*
     * Förvalet 5000 ms är en väggklocka över arbete som till största delen är väntan på CPU.
     * Interaktionstesterna tar 85–675 ms var när de kör ensamma, så förvalet såg ut att räcka
     * med god marginal, men under trängsel drog enstaka block över gränsen – olika block
     * varje gång, vilket är svält och inte ett tajmingfel i koden. 15 s är drygt tjugo gånger
     * det uppmätta värsta fallet och fäller fortfarande ett test som hängt sig på riktigt.
     * Testet i scripts/regelmotor-mot-banken.test.ts sätter sin egen gräns på 60 s och rörs
     * inte av det här.
     */
    testTimeout: 15_000,
    hookTimeout: 15_000,
  },
});
