/**
 * Deterministisk slump. Samma frö ger alltid samma tal, i varje webbläsare och på varje
 * maskin (ADR 0011 avsnitt 2). Egen kod med flit: ett npm-paket kan byta algoritm i en
 * patchversion och då tyst ändra alla pass.
 *
 * Fröet hashas med cyrb128 och driver en xoshiro128** -generator.
 */

/** Hashar fröet till fyra 32-bitarsord. */
function cyrb128(seed: string): [number, number, number, number] {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0; i < seed.length; i += 1) {
    const k = seed.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

export interface Rng {
  /** Ett heltal i [0, bound). */
  nextInt(bound: number): number;
  /** Väljer ett av alternativen. Listan ska redan vara filtrerad på de bästa (R-072, punkt 1). */
  pick<T>(options: readonly T[]): T;
}

/**
 * Skapar generatorn ur ett frö.
 *
 * @regel R-072
 */
export function createRng(seed: string): Rng {
  const [s0, s1, s2, s3] = cyrb128(seed);
  let a = s0;
  let b = s1;
  let c = s2;
  let d = s3;

  const next = (): number => {
    const t = (b << 9) >>> 0;
    let r = Math.imul(b, 5);
    r = ((((r << 7) | (r >>> 25)) >>> 0) * 9) >>> 0;
    c = (c ^ a) >>> 0;
    d = (d ^ b) >>> 0;
    b = (b ^ c) >>> 0;
    a = (a ^ d) >>> 0;
    c = (c ^ t) >>> 0;
    d = ((d << 11) | (d >>> 21)) >>> 0;
    return r >>> 0;
  };

  return {
    nextInt(bound: number): number {
      if (bound <= 1) {
        return 0;
      }
      return next() % bound;
    },
    pick<T>(options: readonly T[]): T {
      const chosen = options[this.nextInt(options.length)];
      if (chosen === undefined) {
        throw new Error('pick anropades med en tom lista');
      }
      return chosen;
    },
  };
}

/**
 * Jämför två övnings-id. `id` är en ASCII-slug (ADR 0010), så en vanlig `<`-jämförelse
 * räcker och är oberoende av språkinställning. `localeCompare` är förbjuden i motorn.
 *
 * @regel R-072
 */
export function compareIds(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}
