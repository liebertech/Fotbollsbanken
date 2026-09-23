/**
 * Vite-insticket som bygger in övningsbanken i appen (ADR 0015).
 *
 * Modulen `virtual:ovningsbanken` finns inte som fil. Den byggs när Vite frågar efter den,
 * ur content/ovningar/ med samma inläsning, samma schema och samma statusfilter som
 * valideringsskriptet och testerna använder (scripts/bank.ts). YAML-filerna och yaml-tolken
 * hamnar därför aldrig i paketet: allt det sker i Node vid bygget.
 */
import { CONTENT_DIR, loadBank } from './bank.ts';
import { findExerciseFiles } from './validera-ovningar.ts';

/** Modulnamnet appen importerar. Bara src/data/bank.ts gör det (ADR 0015). */
export const BANK_MODULE_ID = 'virtual:ovningsbanken';

/** Rollups konvention: en löst virtuell modul börjar med en nollbyte. */
export const RESOLVED_BANK_MODULE_ID = `\0${BANK_MODULE_ID}`;

export interface BankPluginOptions {
  /** Mappen med övningsbanken. Bara testerna skickar in en annan. */
  dir?: string;
}

/**
 * Bygger modulens kod. En fil som inte går att läsa som en godkänd övning avbryter bygget
 * med filnamnet och felet: ett halvt inläst innehåll får aldrig nå ett pass (ADR 0015).
 *
 * @regel R-022
 */
export function buildBankModule(dir: string = CONTENT_DIR): string {
  return buildBank(dir).code;
}

/**
 * Modulen och en rad om vad som byggdes in. Raden skrivs i byggloggen, så att ett fall från
 * 42 till 41 övningar syns i bygget och inte bara i valideringen (S-30).
 */
export function buildBank(dir: string = CONTENT_DIR): { code: string; summary: string } {
  const { exercises, problems, skipped } = loadBank(dir);
  if (problems.length > 0) {
    const lines = problems.map((problem) => `${problem.file}: ${problem.message}`);
    throw new Error(`Övningsbanken går inte att läsa:\n${lines.join('\n')}`);
  }
  const code = [
    '// Byggd av scripts/ovningsbanken-plugin.ts (ADR 0015). Ändra övningarna i content/ovningar/.',
    `export const bank = ${JSON.stringify(exercises)};`,
  ].join('\n');
  const skippedFiles = skipped.map((item) => `${item.file} (${item.status})`);
  const summary = [
    `${exercises.length} övningar inbyggda, ${skipped.length} överhoppade`,
    ...skippedFiles.map((file) => `  överhoppad: ${file}`),
  ].join('\n');
  return { code, summary };
}

/** Insticket. Returtypen är Vites `Plugin`, men skrivs strukturellt för att slippa importen. */
export function ovningsbanken(options: BankPluginOptions = {}) {
  const dir = options.dir ?? CONTENT_DIR;
  return {
    name: 'fotbollsbanken:ovningsbanken',
    resolveId(id: string): string | undefined {
      return id === BANK_MODULE_ID ? RESOLVED_BANK_MODULE_ID : undefined;
    },
    load(
      this: { addWatchFile?: (file: string) => void; info?: (message: string) => void },
      id: string,
    ): string | undefined {
      if (id !== RESOLVED_BANK_MODULE_ID) {
        return undefined;
      }
      // Utvecklingsservern laddar om sidan när en övningsfil ändras.
      for (const file of findExerciseFiles(dir)) {
        this.addWatchFile?.(file);
      }
      const { code, summary } = buildBank(dir);
      if (this.info === undefined) {
        console.log(summary);
      } else {
        this.info(summary);
      }
      return code;
    },
  };
}
