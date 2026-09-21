/**
 * Appens enda väg till övningsbanken (ADR 0015).
 *
 * I inkrement 1 byggs banken in vid bygget. När den senare kommer från Supabase och
 * IndexedDB (ADR 0005) byts innehållet i den här filen, och ingen vy behöver ändras.
 */
import { bank as builtIn } from 'virtual:ovningsbanken';
import type { Exercise } from '../regelmotor/types.ts';

/** Den gemensamma bankens godkända övningar. Generatorn väljer bara härifrån (R-022). */
export const bank: readonly Exercise[] = builtIn;
