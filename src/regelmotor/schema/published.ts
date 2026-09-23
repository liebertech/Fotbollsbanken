/**
 * Vitlistan över de fält som byggs in i paketet och når regelmotorn och gränssnittet (S-27).
 *
 * Listan ligger i en egen fil utan beroende på `zod`, eftersom den läses i klienten. Typen
 * hämtas som `import type` ur schemat och försvinner vid bygget, så YAML-tolken och
 * valideringen stannar i Node (ADR 0015).
 */
import type { Exercise } from './ovning.ts';

/**
 * Fälten som publiceras.
 *
 * Listan är en **vitlista**, inte en svartlista: ett nytt fält i schemat följer aldrig med ut
 * till klienten förrän det skrivs in här. Utanför listan ligger `granskning` (redaktionellt
 * arbetsmaterial, som varken motorn eller någon vy läser), `kalla` (källhänvisningen hör till
 * innehållet i content/, inte till paketet) och `schema` (filformatets version). `planskiss`
 * skrivs in här när inkrement 2 ritar skisserna. Samma vitlista ska gälla när banken senare
 * kommer från Supabase.
 */
export const PUBLISHED_FIELDS = [
  'id',
  'namn',
  'syfte',
  'beskrivning',
  'organisation',
  'fokusomraden',
  'alder',
  'spelformer',
  'niva',
  'passdelar',
  'ledarbehov',
  'ledaruppgift',
  'spelare',
  'grupptyp',
  'udda_antal_losning',
  'tid',
  'yta',
  'material',
  'coachningspunkter',
  'varianter',
  'anpassning',
  // R-022 läses av grundfiltret och av kontrollen, och måste därför följa med.
  'status',
] as const;

/** Övningen som den ser ut i paketet: bara de publicerade fälten (S-27). */
export type PublishedExercise = Pick<Exercise, (typeof PUBLISHED_FIELDS)[number]>;

/**
 * Projicerar en övning ner till de publicerade fälten. Fält som saknas tas inte med, så att
 * ett valfritt fält inte blir `undefined` i JSON.
 *
 * @sakerhet S-27
 */
export function publishExercise(exercise: PublishedExercise): PublishedExercise {
  const published: Record<string, unknown> = {};
  for (const field of PUBLISHED_FIELDS) {
    const value = (exercise as Record<string, unknown>)[field];
    if (value !== undefined) {
      published[field] = value;
    }
  }
  return published as PublishedExercise;
}
