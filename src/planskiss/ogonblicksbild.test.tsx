/**
 * @vitest-environment jsdom
 *
 * Ögonblicksbilder av den ritade SVG-strukturen (ADR 0012 avsnitt 8): ett exempel per
 * spelform, en skiss per skalningsstrategi och en per storlek. Testdata är egna, inte bankens
 * övningar, så att bilderna inte ändras när banken får skisser.
 *
 * En ändrad ögonblicksbild är inte ett fel i sig, men ska granskas: den betyder att skissen
 * ser annorlunda ut för ledaren. Uppdatera med `npx vitest run -u` först när ändringen är
 * avsiktlig.
 */
import type { ReactElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { GameFormat } from '../regelmotor/keys.ts';
import { Planskiss } from './Planskiss.tsx';
import type { PlanskissStorlek } from './Planskiss.tsx';
import {
  FEM_MOT_FEM,
  NIO_MOT_NIO,
  PER_SPELFORM,
  SJU_MOT_SJU,
  sketch,
} from './__testdata__/skisser.ts';

afterEach(cleanup);

function svgOf(element: ReactElement): Element {
  const { container } = render(element);
  const svg = container.firstElementChild;
  if (svg === null) {
    throw new Error('Ingen svg ritades');
  }
  return svg;
}

/** Spelformens vanliga antal i en grupp, så att skalningen syns i bilden. */
const GROUP: Record<GameFormat, number> = {
  '3mot3': 6,
  '5mot5': 7,
  '7mot7': 9,
  '9mot9': 12,
  '11mot11': 7,
};

describe('ett exempel per spelform', () => {
  it.each(Object.entries(PER_SPELFORM) as [GameFormat, (typeof PER_SPELFORM)[GameFormat]][])(
    '%s i storleken normal',
    (format, input) => {
      expect(
        svgOf(
          <Planskiss
            skiss={sketch(input)}
            spelform={format}
            antalSpelare={GROUP[format]}
            storlek="normal"
            titel={`Exempel ${format}`}
            instansId={`exempel-${format}`}
          />,
        ),
      ).toMatchSnapshot();
    },
  );
});

describe('en skiss per skalningsstrategi', () => {
  it('fast', () => {
    expect(
      svgOf(
        <Planskiss
          skiss={sketch({ ...SJU_MOT_SJU, skalning: { strategi: 'fast' } })}
          antalSpelare={9}
          storlek="normal"
          titel="Fast"
          instansId="fast"
        />,
      ),
    ).toMatchSnapshot();
  });

  it('köer, med en kö längre än 8', () => {
    expect(
      svgOf(
        <Planskiss
          skiss={sketch(FEM_MOT_FEM)}
          antalSpelare={3 + 20}
          storlek="normal"
          titel="Köer"
          instansId="koer"
        />,
      ),
    ).toMatchSnapshot();
  });

  it('platser, fler spelare än platser', () => {
    expect(
      svgOf(
        <Planskiss
          skiss={sketch(NIO_MOT_NIO)}
          antalSpelare={14}
          storlek="normal"
          titel="Platser"
          instansId="platser"
        />,
      ),
    ).toMatchSnapshot();
  });

  it('parallella ytor', () => {
    expect(
      svgOf(
        <Planskiss
          skiss={sketch({ ...SJU_MOT_SJU, skalning: { strategi: 'parallella-ytor', per_yta: 5 } })}
          antalSpelare={14}
          storlek="normal"
          titel="Parallella ytor"
          instansId="parallella"
        />,
      ),
    ).toMatchSnapshot();
  });
});

describe('en skiss per storlek', () => {
  it.each(['miniatyr', 'normal', 'planlage', 'utskrift'] as PlanskissStorlek[])('%s', (storlek) => {
    expect(
      svgOf(
        <Planskiss
          skiss={sketch(FEM_MOT_FEM)}
          spelform="5mot5"
          yta={{ langd: 18, bredd: 10 }}
          antalSpelare={5}
          storlek={storlek}
          titel="Storlek"
          instansId={`storlek-${storlek}`}
        />,
      ),
    ).toMatchSnapshot();
  });
});

describe('ADR 0012 avsnitt 5: renhet', () => {
  it('samma indata ger samma utdata två gånger', () => {
    const draw = () =>
      svgOf(
        <Planskiss
          skiss={sketch(NIO_MOT_NIO)}
          antalSpelare={12}
          storlek="normal"
          titel="Renhet"
          instansId="renhet"
        />,
      );
    const serialize = () => new XMLSerializer().serializeToString(draw());
    const first = serialize();
    cleanup();
    expect(serialize()).toBe(first);
  });
});
