# Säkerhetsgranskning: visuell design, riktning A

**Status:** granskad 2026-10-12
**Granskare:** agenten `sakerhet-integritet`. Huvudsessionen har sparat rapporten.
**Underlag:** `git diff origin/main...HEAD` på `feature/visuell-design` (55cdd10), 29 filer. Granskningen är jämförd mot `docs/sakerhet/granskning-inkrement-2b.md` (avsnittet om rekommenderade lintregler) och mot `eslint.config.js`.

## Sammanfattning

Grenen har inga fynd med allvarlighet kritisk, hög eller medel. Den nya komponenten `PageHeader` följer kraven för fokusflytten från granskningen av inkrement 2b (R3):

- `ref={focusOnMount}` är den enda `ref` som används.
- `focusOnMount` binds inuti komponenten med `const focusOnMount = useFocusOnMount()` och kommer inte från props.
- Den nya propen `focusHeading` är en boolesk flagga, så den som anropar komponenten får aldrig tag i DOM-noden.

Grenen lägger inte till några externa resurser eller beroenden och använder inte `dangerouslySetInnerHTML`. CSP:n (`public/_headers`), `index.html`, `package.json`, `eslint.config.js` och Vite-konfigurationen är oförändrade.

## Kontroll av PageHeader mot R3 och lintregeln

- `src/app/ui/PageHeader.tsx`: `FocusedHeading` binder `useFocusOnMount()` och använder bara `ref={focusOnMount}` på en `h1` med `tabIndex={-1}`. Utan `focusHeading` ritas en vanlig `h1` utan `ref` och utan `tabindex`.
- `src/app/swap/SwapView.tsx`: bytesvyn anropar inte längre hooken själv. Den skickar `focusHeading` som en konstant, och rubriktexten ritas som React-text, alltså escapad.
- Lintregeln slår till på komponenten. Fyra kringgående varianter prövades i minnet med ESLints API mot den riktiga konfigurationen, och alla fyra stoppades av `no-restricted-syntax`: `focusOnMount` som prop, en inline-callback som `ref`, `let` i stället för `const` och en spridd `ref`. Originalfilen gav 0 fel.
- Testkravet är uppfyllt. `src/app/ui/ui.test.tsx` visar att rubriken tar fokus bara med `focusHeading`. `src/app/swap/swap.interaction.test.tsx` visar att fokus hamnar på rubriken när vyn öppnas och stannar i sökfältet medan ledaren skriver.

## Fynd

**F1 · Låg: `focusHeading` styr fokusflytten genom att montera rubriken på nytt.**
När `focusHeading` ändras byter rubriken komponenttyp. Om en framtida vy kopplar propen till ett tillstånd, till exempel `focusHeading={!searching}`, monteras `FocusedHeading` om och tar fokus från ett fält medan ledaren skriver. Det är samma risk som R3 skyddar mot, men den här vägen fångas inte av lintregeln. Felet ger ingen åtkomst till DOM:en.
*Åtgärd:* skriv i propens dokumentation att den bara får vara en konstant för vyn. Lägg till ett test som ritar om `PageHeader` med samma `focusHeading` och ny `heading`, och som visar att fokus inte flyttas.

**F2 · Låg: de klickbara skisserna i `docs/design/skisser/visuell/` skriver HTML med `innerHTML`.**
Strängen byggs bara av konstanter, och åldern används bara som index, så det går inte att injicera något. Filerna byggs inte in i appen. Om mönstret kopieras in i `src/` stoppas det av lintregeln mot `innerHTML`.
*Åtgärd:* ingen.

**F3 · Information: den nya inline-SVG:n i `src/app/ui/Icon.tsx` är statisk.**
Ikonerna kommer ur en fast tabell. Ingen `href`, `<use>` eller `<foreignObject>` används, och inget innehåll kommer från data.
*Åtgärd:* ingen.

**F4 · Information: R-049-testet i `scripts/regelmotor-mot-banken.test.ts` överskrider sin tidsgräns.**
Grenen ändrar inte regelmotorn, banken eller skripten. Kvalitetssäkraren har mätt 59 s när testet körs ensamt och 222 s i hela sviten. Felet beror alltså på belastning. Det är ingen säkerhetsfråga, men en röd körning i CI kan skymma andra fel.
*Åtgärd:* en egen pull request.

## Kontroll av hela diffen

- **Externa resurser:** inget nytt i `src/`. `url(#…)` i skisserna pekar bara på interna SVG-id. Typsnitten är systemtypsnitt.
- **`dangerouslySetInnerHTML`:** förekommer inte.
- **Nya beroenden:** inga. `package.json` och `package-lock.json` är oförändrade.
- **CSP och `index.html`:** oförändrade.
- **CSS:** innehållet i `content:` är fasta tecken. Bakgrunderna laddar inga resurser.
- **Skärmbilder:** PNG-filerna i `docs/design/skarmbilder/visuell-a/` följer inte med i bygget.

## Verifierat

- `npm run lint`: 0 fel.
- `npm run typecheck`: inga fel.
- `npm audit`: 0 sårbarheter.
- `npx vitest run`: allt godkänt utom tidsgränsen i R-049 (F4).
- Lintproven med ESLints API: alla fyra kringgående varianter fastnade.

## Kvarstår

- F1 är inte åtgärdad.
- F5 från granskningen av inkrement 2b, uppgraderingen av ESLint, är fortfarande öppen.
