/**
 * Ritmotorn för planskisser (ADR 0012, ADR 0018). Modulen ägs av planskissutvecklaren.
 *
 * Vyer läser skissdata med `readPlanskiss` och ritar bara utfallet `giltig` med `Planskiss`
 * (RK-1). Platshållarna för saknad och ogiltig skiss och felgränsen ligger i
 * src/app/planskiss/, eftersom de är HTML och ritmotorn bara får skapa SVG-elementen i
 * vitlistan (ADR 0012 avsnitt 6, eslint.config.js).
 */
export { Planskiss, INSTANCE_ID_PATTERN, sketchLayout } from './Planskiss.tsx';
export type { PlanskissProps, PlanskissStorlek, SketchLayout } from './Planskiss.tsx';
export { notDrawnText, parallelAreasText, sketchDescription, sketchTitle } from './beskrivning.ts';
export { Teckensymbol } from './Teckensymbol.tsx';
export type { TeckensymbolProps } from './Teckensymbol.tsx';
export { LEGEND_KINDS, LEGEND_NAMES, legendEntries } from './teckenforklaring.ts';
export type { LegendEntry, LegendKind } from './teckenforklaring.ts';
