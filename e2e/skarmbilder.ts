/**
 * Skärmbilderna i docs/design/skarmbilder/ritmotor/ är incheckade för mänsklig granskning.
 * De skrivs bara när de begärs uttryckligen, med `SKARMBILDER=1 npm run test:e2e`, så att en
 * vanlig testkörning inte ändrar filer i git. Utan variabeln tas bilden ändå, så att steget
 * prövas, men den sparas inte.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCREENSHOT_DIR = fileURLToPath(
  new URL('../docs/design/skarmbilder/ritmotor/', import.meta.url),
);

export const SAVE_SCREENSHOTS = process.env.SKARMBILDER === '1';

/** Sökvägen som skärmbilden ska sparas till, eller `undefined` när den inte ska sparas. */
export function screenshotPath(name: string): string | undefined {
  return SAVE_SCREENSHOTS ? path.join(SCREENSHOT_DIR, name) : undefined;
}
