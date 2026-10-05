/**
 * Generatorns flöde (docs/design/floden.md, avsnitt 1.1 och 1.2): underlag → pass, eller
 * underlag → inget matchande resultat.
 *
 * Ledarens val ligger kvar i formuläret hela tiden. Appen ändrar dem aldrig själv (R-102):
 * "Ändra uppgifter" går tillbaka till samma ifyllda formulär, och "Generera igen" kör om
 * samma underlag med ett nytt frö (R-072, ADR 0011 avsnitt 2).
 */
import { useEffect, useState } from 'react';
import { applySwap } from '../regelmotor/index.ts';
import type { BankExercise, InputError, ItemRef } from '../regelmotor/index.ts';
import { attemptGeneration } from './generate.ts';
import type { GeneratedResult } from './generate.ts';
import { InputForm } from './input/InputForm.tsx';
import { EMPTY_FORM } from './input/form.ts';
import type { InputFormState } from './input/form.ts';
import { SessionView } from './session/SessionView.tsx';
import { NoSessionView } from './session/NoSessionView.tsx';
import { SwapView } from './swap/SwapView.tsx';
import { TEXTS, fill } from './text/texts.ts';

interface GeneratorProps {
  /** Den gemensamma banken. Generatorn väljer bara härifrån (R-022). */
  bank: readonly BankExercise[];
  /** Ett nytt frö per generering (ADR 0011 avsnitt 2). */
  createSeed?: () => string;
}

/**
 * Ett frö till motorn. `Math.random` räcker: fröet ska vara varierat, inte oförutsägbart
 * (ADR 0011 avsnitt 2).
 *
 * **Fröet är ett algoritmvärde och får aldrig bli en identifierare.** Sparade och delade pass
 * i inkrement 5 till 7 ska adresseras med `crypto.randomUUID()`, aldrig med `Session.seed`:
 * ett gissningsbart frö skulle göra ett klubbpass läsbart för utomstående (S-33).
 */
function randomSeed(): string {
  return Math.random().toString(36).slice(2);
}

/** Byte av övning (berättelse 04): vilken plats som byts, och var fokus ska hamna efteråt. */
interface SwapState {
  /** Platsen som byts, medan bytesvyn visas. */
  target: ItemRef | null;
  /** Kortet som öppnade bytesvyn. */
  key: string | null;
  /** Kortet vars bytesknapp får fokus när ledaren gått tillbaka utan att byta. */
  returnKey: string | null;
  /** Namnet på övningen som just bytts in, för bekräftelsen. */
  swappedTo: string | null;
}

const NO_SWAP: SwapState = { target: null, key: null, returnKey: null, swappedTo: null };

export function Generator({ bank, createSeed = randomSeed }: GeneratorProps) {
  const [form, setForm] = useState<InputFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<readonly InputError[]>([]);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [swap, setSwap] = useState<SwapState>(NO_SWAP);

  useEffect(() => {
    // Vyn byts högst upp, inte där ledaren råkade ha skrollat. Tillbaka från bytesvyn flyttar
    // fokus till kortets bytesknapp, som då själv skrollas fram.
    if (swap.returnKey === null) {
      window.scrollTo(0, 0);
    }
  }, [result, swap.target, swap.returnKey]);

  const generate = () => {
    const seed = createSeed();
    const attempt = attemptGeneration(form, bank, seed);
    setErrors(attempt.errors);
    setResult(attempt.result);
    setSwap(NO_SWAP);

    // Ett pass som faller på kontrollen är alltid en bugg i motorn (ADR 0011 avsnitt 1).
    if (attempt.result?.kind === 'none' && attempt.result.reason.internalProblems.length > 0) {
      console.error('Passet klarade inte kontrollen', {
        seed,
        problems: attempt.result.reason.internalProblems,
      });
    }
  };

  const confirmation =
    swap.swappedTo === null ? null : fill(TEXTS.swap.confirmation, { name: swap.swappedTo });

  return (
    <>
      {/*
       * Bekräftelsen efter ett byte läses upp härifrån. Regionen finns kvar mellan vyerna, så
       * att en skärmläsare hör ändringen; en region som skapas samtidigt med texten läses
       * inte alltid upp.
       */}
      <p className="visually-hidden" role="status">
        {confirmation}
      </p>
      {renderView()}
    </>
  );

  function renderView() {
    if (result === null) {
      return <InputForm form={form} errors={errors} onChange={setForm} onGenerate={generate} />;
    }

    if (result.kind === 'none') {
      return (
        <NoSessionView
          input={result.input}
          reason={result.reason}
          onChangeInput={() => setResult(null)}
        />
      );
    }

    const session = result.session;
    const { target, key } = swap;
    if (target !== null && key !== null) {
      const choose = (exercise: BankExercise) => {
        try {
          setResult({ kind: 'session', session: applySwap(session, target, exercise) });
          setSwap({ ...NO_SWAP, returnKey: key, swappedTo: exercise.namn });
        } catch (error) {
          // Vyn visar bara alternativ som motorn har godkänt, så ett fel här är en bugg i
          // motorn. Passet ligger kvar oförändrat (berättelse 04, kriterium 3).
          console.error('Bytet klarade inte kontrollen', { seed: session.seed, error });
          setSwap({ ...NO_SWAP, returnKey: key });
        }
      };
      return (
        <SwapView
          session={session}
          target={target}
          bank={bank}
          onChoose={choose}
          onBack={() => setSwap({ ...NO_SWAP, returnKey: key })}
        />
      );
    }

    return (
      <SessionView
        session={session}
        onChangeInput={() => {
          setSwap(NO_SWAP);
          setResult(null);
        }}
        onGenerateAgain={generate}
        onSwap={(ref, cardKey) => setSwap({ ...NO_SWAP, target: ref, key: cardKey })}
        focusKey={swap.returnKey}
        confirmation={confirmation}
      />
    );
  }
}
