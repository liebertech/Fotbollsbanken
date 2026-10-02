/**
 * Vitlistorna för ritmotorns element och attribut (ADR 0012 avsnitt 6, S-07, F9, R4).
 *
 * Listorna läses av eslint.config.js, som underkänner allt annat i JSX i src/planskiss/.
 * Körtestet i sakerhet.test.tsx har en egen lista över det som får finnas i den ritade
 * SVG:n och prövar att den stämmer med de här listorna, så att de två kontrollerna inte kan
 * glida isär.
 *
 * Filen får bara innehålla syntax som Node kan läsa utan att översätta den, eftersom
 * eslint.config.js importerar den direkt.
 */

/** De enda element som ritmotorn får skapa: den slutna listan i ADR 0012 avsnitt 6. */
export const ALLOWED_SVG_ELEMENTS: readonly string[] = [
  'svg',
  'title',
  'desc',
  'defs',
  'pattern',
  'g',
  'rect',
  'circle',
  'polygon',
  'line',
  'path',
  'text',
  'tspan',
];

/**
 * De enda attribut som ritmotorn får sätta på ett element, med namnet så som det skrivs i
 * JSX, och namnet i DOM:en. `key` hör till React och hamnar aldrig i DOM:en.
 */
export const ALLOWED_SVG_ATTRIBUTES: Readonly<Record<string, string | null>> = {
  key: null,
  className: 'class',
  viewBox: 'viewBox',
  role: 'role',
  'aria-labelledby': 'aria-labelledby',
  'aria-hidden': 'aria-hidden',
  id: 'id',
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  cx: 'cx',
  cy: 'cy',
  r: 'r',
  x1: 'x1',
  y1: 'y1',
  x2: 'x2',
  y2: 'y2',
  points: 'points',
  d: 'd',
  fill: 'fill',
  strokeWidth: 'stroke-width',
  strokeDasharray: 'stroke-dasharray',
  fontSize: 'font-size',
  textAnchor: 'text-anchor',
  dominantBaseline: 'dominant-baseline',
  patternUnits: 'patternUnits',
};
