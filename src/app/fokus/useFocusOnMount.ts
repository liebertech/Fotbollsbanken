/**
 * Flyttar fokus till ett element när det monteras (säkerhetsgranskningen av inkrement 2b).
 *
 * Det här är det enda sätt appen får använda `ref` på: lintningen tillåter bara
 * `ref={focusOnMount}`, och `focusOnMount` får bara komma från den här hooken. Komponenten
 * som använder den får därför aldrig tag i DOM-noden, och här görs inget annat med noden än
 * att anropa `focus()`.
 *
 * Funktionen är stabil (`useCallback` med tom beroendelista). React anropar en callback-ref
 * igen när funktionen byts, så en ny funktion vid varje rendering skulle flytta fokus varje
 * gång komponenten ritas om, till exempel när ledaren skriver i sökfältet.
 */
import { useCallback } from 'react';

export function useFocusOnMount(): (node: HTMLElement | null) => void {
  return useCallback((node: HTMLElement | null) => {
    node?.focus();
  }, []);
}
