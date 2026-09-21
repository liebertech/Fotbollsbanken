/**
 * Appskalet. Inkrement 1 har en enda vy: generatorn (docs/design/floden.md avsnitt 1.1).
 * Inloggning, sparade pass, planläge och säsongsplan kommer i senare inkrement.
 */
import { bank } from '../data/bank.ts';
import { Generator } from './Generator.tsx';

export function App() {
  return (
    <main>
      <Generator bank={bank} />
    </main>
  );
}
