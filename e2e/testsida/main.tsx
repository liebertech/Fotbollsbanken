import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Testsida } from './Testsida.tsx';
// Appens egna designtokens (ljust/mörkt läge, se docs/design/designsystem.md avsnitt 1–2),
// så att skärmbilderna från testsidan har samma färger som i den riktiga appen.
import '../../src/app/app.css';

const container = document.getElementById('root');
if (container === null) {
  throw new Error('root-elementet saknas i e2e/testsida/index.html');
}

createRoot(container).render(
  <StrictMode>
    <Testsida />
  </StrictMode>,
);
