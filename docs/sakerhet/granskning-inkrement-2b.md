Status: granskning under inkrement 2b, byta övning (2026-10-05)

# Säkerhetsgranskning: byta övning och `ref` för fokus

**Granskare:** agenten `sakerhet-integritet` · **Gren:** `feature/byt-ovning` (de0ad31)

Huvudsessionen har sparat rapporten i repot. Fynden är numrerade F1–F5 inom den här rapporten.

## Sammanfattning

`ref` kan tillåtas i `src/app/**` för att flytta fokus, men bara som en callback-ref från hooken `useFocusOnMount` i `src/app/fokus/useFocusOnMount.ts`. Hooken returnerar en stabil funktion och anropar bara `focus()`, så komponenten som använder den får aldrig tag i DOM-noden. Ett `RefObject` tillåts inte, eftersom det ger ut noden via `.current`.

Bytet i sig gav inga fynd med kritisk, hög eller medelhög allvarlighet. Flaggan `Session.swapped` släpper bara tidsmålen i R-035 och R-036, som R-105 kräver. Säkerhetsreglerna och resten av slutkontrollen gäller fortfarande. Sökfältet är ofarligt.

## Rekommenderade lintregler

- `ref` får bara vara `focusOnMount`, och `focusOnMount` får bara komma från `useFocusOnMount()`. Det får inte komma från props, inte från en tilldelning och inte under ett annat namn vid import.
- `useFocusOnMount` får bara definieras i hookfilen, och i hookfilen får bara `focus()` anropas på noden.
- `ref` som egenskap i ett objekt förbjuds, eftersom `{...{ ref }}` annars går förbi JSX-kontrollen (F1).
- N3 stängs, med förbud mot:
  - egenskapsnycklar och strängar som `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `setAttribute`, `setAttributeNS` och `srcdoc`
  - beräknade medlemsnamn
  - `write`, `writeln`, `execCommand` och `ownerDocument`
  - `srcDoc` och `formAction`
  - `href`, `src`, `action` och `xlinkHref` med ett uttryck
  - elementen `iframe`, `frame`, `object`, `embed`, `script` och `base`
  - globalerna `XMLSerializer`, `Reflect` och `document`. Undantag görs för `src/app/main.tsx` och för testfiler.
- Hooken har ett eget test som visar att fokus flyttas en gång vid montering och inte när användaren skriver i sökfältet.
- Undantagen `eslint-disable jsx-a11y/no-autofocus` tas bort.

## Fynd

- **F1 · Låg:** förbudet mot `ref` och flera N3-luckor går att kringgå i `src/app/` i dag. Sju av åtta prov gick igenom lintningen, bland annat `{...{ ref: … }}`, `Reflect.set`, `Object.assign` med `innerHTML`, `document.write`, `srcDoc` och `href` med ett uttryck. Med reglerna ovan fångas alla åtta.
- **F2 · Låg:** vyfältet `ref` i `ItemRef`, `StationView` och `TimelineItem` krockar med regeln mot `ref` i objekt. **Åtgärd:** byt namn till exempel till `place`, och behåll den breda regeln.
- **F3 · Låg:** `Session.swapped` gäller i dag bara R-035 och R-036. När pass sparas i inkrement 3 kommer flaggan från lagrad data. **Åtgärd:**
  - ett regressionstest som visar att `swapped: true` fortfarande fäller R-080, R-082 och R-022
  - ett test med byte efter byte
  - en kommentar i typen om att flaggan aldrig får lyfta mer.
- **F4 · Information:** sökfältet används bara med `toLocaleLowerCase` och `includes`. Söktexten visas inte, lagras inte och skickas inte någonstans. **Åtgärd, valfri:** `maxLength`. När klubbens egna övningar kommer i inkrement 4 är namnen fritext från ledare och ska få samma kontroll.
- **F5 · Låg:** ESLint 9.39.5 rapporteras som utan stöd. **Åtgärd:** planera en uppgradering.

Ett komplement som inte är prövat: Trusted Types i CSP:n stoppar strängar till `innerHTML` medan appen körs, oavsett vad lintningen fångar.

## Verifierat

- `npx eslint .` och testerna för bytet går igenom.
- `npm audit` visar 0 sårbarheter.
- Proven är gjorda med ESLints API mot dagens regler och mot de föreslagna reglerna.

## Kvarstår

Lintningen skyddar mot misstag, inte mot en utvecklare som avsiktligt går runt den. Det som skyddar medan appen körs är CSP:n i `public/_headers`.
