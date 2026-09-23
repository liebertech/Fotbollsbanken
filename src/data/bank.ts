/**
 * Appens enda väg till övningsbanken (ADR 0015).
 *
 * I inkrement 1 byggs banken in vid bygget. När den senare kommer från Supabase och
 * IndexedDB (ADR 0005) byts innehållet i den här filen, och ingen vy behöver ändras.
 *
 * Här, och bara här, märks övningarna som den gemensamma bankens (S-28). Klubbens egna
 * övningar i inkrement 4 får aldrig gå den här vägen: de hämtas vid körning och passerar
 * säkerhetsreglerna för sig.
 */
import { bank as builtIn } from 'virtual:ovningsbanken';
import { toBankExercise } from '../regelmotor/index.ts';
import type { BankExercise } from '../regelmotor/index.ts';

/** Den gemensamma bankens godkända övningar. Generatorn väljer bara härifrån (R-022). */
export const bank: readonly BankExercise[] = builtIn.map((exercise) => toBankExercise(exercise));
