/**
 * Generatorns flöde (docs/design/floden.md, avsnitt 1.1 och 1.2): underlag → pass, eller
 * underlag → inget matchande resultat.
 *
 * Ledarens val ligger kvar i formuläret hela tiden. Appen ändrar dem aldrig själv (R-102):
 * "Ändra uppgifter" går tillbaka till samma ifyllda formulär, och "Generera igen" kör om
 * samma underlag med ett nytt frö (R-072, ADR 0011 avsnitt 2).
 */
import { useEffect, useState } from 'react';
import type { Exercise, InputError } from '../regelmotor/index.ts';
import { attemptGeneration } from './generate.ts';
import type { GeneratedResult } from './generate.ts';
import { InputForm } from './input/InputForm.tsx';
import { EMPTY_FORM } from './input/form.ts';
import type { InputFormState } from './input/form.ts';
import { SessionView } from './session/SessionView.tsx';
import { NoSessionView } from './session/NoSessionView.tsx';

interface GeneratorProps {
  /** Den gemensamma banken. Generatorn väljer bara härifrån (R-022). */
  bank: readonly Exercise[];
  /** Ett nytt frö per generering (ADR 0011 avsnitt 2). */
  createSeed?: () => string;
}

function randomSeed(): string {
  return Math.random().toString(36).slice(2);
}

export function Generator({ bank, createSeed = randomSeed }: GeneratorProps) {
  const [form, setForm] = useState<InputFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<readonly InputError[]>([]);
  const [result, setResult] = useState<GeneratedResult | null>(null);

  useEffect(() => {
    // Vyn byts högst upp, inte där ledaren råkade ha skrollat.
    window.scrollTo(0, 0);
  }, [result]);

  const generate = () => {
    const seed = createSeed();
    const attempt = attemptGeneration(form, bank, seed);
    setErrors(attempt.errors);
    setResult(attempt.result);

    // Ett pass som faller på kontrollen är alltid en bugg i motorn (ADR 0011 avsnitt 1).
    if (attempt.result?.kind === 'none' && attempt.result.reason.internalProblems.length > 0) {
      console.error('Passet klarade inte kontrollen', {
        seed,
        problems: attempt.result.reason.internalProblems,
      });
    }
  };

  if (result === null) {
    return <InputForm form={form} errors={errors} onChange={setForm} onGenerate={generate} />;
  }

  if (result.kind === 'session') {
    return (
      <SessionView
        session={result.session}
        onChangeInput={() => setResult(null)}
        onGenerateAgain={generate}
      />
    );
  }

  return (
    <NoSessionView
      input={result.input}
      reason={result.reason}
      onChangeInput={() => setResult(null)}
    />
  );
}
