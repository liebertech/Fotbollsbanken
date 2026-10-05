/**
 * Tester för valideringsskriptet (ADR 0010 avsnitt 5).
 *
 * Skriptet äger tre kontroller som schemat inte kan göra: att filnamnet och `id` är lika,
 * att ett `id` bara används av en fil, och att innehållet ryms i databasens `content` (S-08).
 * Resten av kunskapen ligger i schemat och testas i src/regelmotor/schema/ovning.test.ts.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { stringify } from 'yaml';
import { reviewEntry, validExercise } from '../src/regelmotor/__testdata__/ovning-fixtur.ts';
import { findExerciseFiles, main, validateFiles } from './validera-ovningar.ts';

const created: string[] = [];

afterEach(() => {
  for (const dir of created.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

/** En tom övningsbank i en temporär mapp, som städas bort efter testet. */
function tempBank(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fotbollsbanken-'));
  created.push(dir);
  return dir;
}

/** Skriver en övning som YAML. Filnamnet styrs separat, så att det kan skilja sig från `id`. */
function writeExercise(dir: string, fileName: string, exercise: Record<string, unknown>): string {
  const file = join(dir, fileName);
  writeFileSync(file, stringify(exercise), 'utf8');
  return file;
}

/** Kör skriptet och fångar utdata i stället för att skriva till konsolen. */
function run(targets: string[]): { code: number; output: string } {
  const lines: string[] = [];
  const code = main(targets, (line) => lines.push(line));
  return { code, output: lines.join('\n') };
}

describe('valideringsskriptet', () => {
  it('godkänner en giltig övningsfil', () => {
    const dir = tempBank();
    writeExercise(dir, 'passa-och-folj.yaml', validExercise());
    expect(validateFiles([dir]).errors).toEqual([]);
  });

  it('underkänner en fil där id skiljer sig från filnamnet', () => {
    const dir = tempBank();
    writeExercise(dir, 'nagot-annat.yaml', validExercise({ id: 'passa-och-folj' }));

    const errors = validateFiles([dir]).errors;
    expect(errors).toHaveLength(1);
    expect(errors[0]?.field).toBe('id');
    expect(errors[0]?.message).toContain('nagot-annat.yaml');
  });

  it('underkänner två filer som använder samma id', () => {
    const dir = tempBank();
    writeExercise(dir, 'passa-och-folj.yaml', validExercise());
    writeExercise(dir, 'passa-och-folj-2.yaml', validExercise({ id: 'passa-och-folj' }));

    const messages = validateFiles([dir]).errors.map((error) => error.message);
    expect(messages.some((message) => message.includes('används också av'))).toBe(true);
  });

  it('hoppar över filer som börjar med _ och allt som inte är .yaml', () => {
    const dir = tempBank();
    writeExercise(dir, 'passa-och-folj.yaml', validExercise());
    writeExercise(dir, '_mall.yaml', { schema: 1 });
    writeFileSync(join(dir, 'anteckningar.md'), 'inte en övning', 'utf8');

    expect(findExerciseFiles(dir)).toEqual([join(dir, 'passa-och-folj.yaml')]);
  });

  it('underkänner en fil som inte går att läsa som YAML', () => {
    const dir = tempBank();
    writeFileSync(join(dir, 'trasig.yaml'), 'namn: [olukt\n  - ja\n', 'utf8');

    const errors = validateFiles([dir]).errors;
    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toContain('går inte att läsa som YAML');
  });

  it('slutar med kod 0 och säger till när banken är tom', () => {
    const { code, output } = run([tempBank()]);
    expect(code).toBe(0);
    expect(output).toContain('Inga övningsfiler att validera');
  });

  it('slutar med kod 1 när målet inte finns', () => {
    const { code, output } = run([join(tempBank(), 'finns-inte')]);
    expect(code).toBe(1);
    expect(output).toContain('Hittar inte');
  });

  it('S-08: en fil som är större än databasens gräns för content underkänns', () => {
    const dir = tempBank();
    writeExercise(dir, 'stor.yaml', validExercise({ id: 'stor', beskrivning: 'x'.repeat(150000) }));

    const messages = validateFiles([dir]).errors.map((error) => error.message);
    expect(messages.some((message) => message.includes('(S-08)'))).toBe(true);
  });

  it('slutar med kod 1 och skriver ut felet när en fil underkänns', () => {
    const dir = tempBank();
    const incomplete = validExercise({ id: 'ofullstandig', status: 'godkand' });
    delete incomplete.organisation;
    writeExercise(dir, 'ofullstandig.yaml', incomplete);

    const { code, output } = run([dir]);
    expect(code).toBe(1);
    expect(output).toContain('krävs för status godkand');
    expect(output).toContain('1 övningar kontrollerade');
  });

  it('status godkand kräver minst en granskningsrad', () => {
    const dir = tempBank();
    writeExercise(
      dir,
      'utan-granskning.yaml',
      validExercise({
        id: 'utan-granskning',
        status: 'godkand',
        granskning: [],
      }),
    );

    const messages = validateFiles([dir]).errors.map((error) => error.message);
    expect(messages.some((message) => message.includes('minst en granskningsrad'))).toBe(true);
  });

  it('skyddet mot ett handskrivet godkand ligger i CI, inte i schemat (ADR 0010 avsnitt 3)', () => {
    // En komplett fil med status godkand passerar valideringen. Att värdet bara får skrivas av
    // arbetsflödet godkann-omgang kontrolleras av lager 2 i ADR 0010 avsnitt 3, som jämför
    // commitens författare. Testet finns för att gränsen mellan de två kontrollerna ska vara
    // uttalad och inte förväxlas med schemats ansvar.
    const dir = tempBank();
    writeExercise(
      dir,
      'godkand-ovning.yaml',
      validExercise({ id: 'godkand-ovning', status: 'godkand', granskning: [reviewEntry()] }),
    );

    expect(validateFiles([dir]).errors).toEqual([]);
  });

  describe('namnet på en godkänd övning är unikt (kvalitetssäkrarens fynd 5)', () => {
    const godkand = (id: string, namn: string, status = 'godkand') =>
      validExercise({ id, namn, status, granskning: [reviewEntry()] });

    it('underkänner två godkända övningar med samma namn, och slutar med kod 1', () => {
      const dir = tempBank();
      writeExercise(dir, 'forsta.yaml', godkand('forsta', 'Passa och följ'));
      writeExercise(dir, 'andra.yaml', godkand('andra', 'Passa och följ'));

      const errors = validateFiles([dir]).errors;
      expect(errors).toHaveLength(1);
      expect(errors[0]?.field).toBe('namn');
      // Filerna läses i bokstavsordning, så felet hamnar på den andra som läses.
      expect(errors[0]?.file).toContain('forsta.yaml');
      expect(errors[0]?.message).toContain('andra.yaml');
      const { code, output } = run([dir]);
      expect(code).toBe(1);
      expect(output).toContain('Två godkända övningar får inte heta lika');
    });

    it('räknar namn som skiljer sig bara i versaler eller mellanrum som samma namn', () => {
      const dir = tempBank();
      writeExercise(dir, 'forsta.yaml', godkand('forsta', 'Passa och följ'));
      writeExercise(dir, 'andra.yaml', godkand('andra', '  passa  och FÖLJ '));
      expect(validateFiles([dir]).errors.map((error) => error.field)).toEqual(['namn']);
    });

    it('godkänner samma namn när bara en av övningarna är godkänd', () => {
      const dir = tempBank();
      writeExercise(dir, 'forsta.yaml', godkand('forsta', 'Passa och följ'));
      writeExercise(dir, 'andra.yaml', validExercise({ id: 'andra', namn: 'Passa och följ' }));
      expect(validateFiles([dir]).errors).toEqual([]);
    });

    it('godkänner godkända övningar med olika namn', () => {
      const dir = tempBank();
      writeExercise(dir, 'forsta.yaml', godkand('forsta', 'Passa och följ'));
      writeExercise(dir, 'andra.yaml', godkand('andra', 'Passa och vänd'));
      expect(validateFiles([dir]).errors).toEqual([]);
    });
  });
});
