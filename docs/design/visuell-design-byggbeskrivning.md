Status: utkast

# Visuell design, riktning A: byggbeskrivning

Till senior-systemutvecklare och planskissutvecklare. Beslut: riktning A, Gräsmattan, 2026-10-12 (`visuell-design-forslag.md`). De exakta värdena finns i `designsystem.md` (2.1, 2.2, 3, 4, 6.1–6.5, 6.10, 6.11 och 10). Det här dokumentet säger bara vilka filer som berörs och vad som ska göras. Referensen för utseendet är `docs/design/skisser/visuell/riktning-a-grasmattan.html` (öppna i 390 px bredd, växla ljust och mörkt läge).

Ingen funktion ändras. Inga knapptexter eller rubriker ändras. En ny synlig text tillkommer: varumärkesraden "Fotbollsbanken" (`texter.md` avsnitt 1). Planläget (`.planlage`), utskriften (`.utskrift`, `@media print`) och alla tester av beteende är oförändrade.

## Förslag på ordning

1. Tokens och typografi (`app.css`). Det räcker för att hela appen ska byta färg.
2. Ikoner och sidhuvud.
3. Underlaget (val-piller) och passet (delrubrik, kort, varningar).
4. Planskissens färger (planskissutvecklaren). Kan göras parallellt med steg 2–3.

Varje steg går att granska för sig, och jag granskar det byggda gränssnittet i 390 px i ljust och mörkt läge.

## 1. Tokens: `src/app/app.css` (senior-systemutvecklare)

- Byt värdena på befintliga variabler enligt `designsystem.md` 2.1 (`:root`) och 2.2 (`@media (prefers-color-scheme: dark)`): `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-error`, `--color-warning-bg`, `--color-warning-text`. `--color-primary` och `--color-focus` behåller sina värden i båda lägena. I mörkt läge får `--color-on-primary` det nya värdet `#0D1A12`.
- **Dela `--color-border` i två.** Idag används den både för kort och för fält (`InputForm.module.css`: `.number`, `.choice`). Fältets kant `#d6d9d6` mot vitt är bara 1,5:1 och klarar inte 3:1 för icke-text (WCAG 1.4.11), vilket är ett fynd i det byggda gränssnittet som den här ändringen rättar. Nya variabler:
  - `--color-field-border` (`#7C8F80` / `#6F8A76`) för fält, val-piller och sekundärknappar
  - `--color-card-border` (`#C9D3C4` / `#2C4533`) för kort och dekor
- Nya variabler: `--color-accent` (`#FFD23F`), `--color-on-accent` (`#14231A`), `--color-header` (`#0B5A31` / `#123422`), `--color-on-header` (`#FFFFFF` / `#EEF4EA`), `--color-selected-bg`, `--color-selected-text` (`#0B5A31`/`#FFFFFF`, `#57C98A`/`#0D1A12`), `--color-warning-edge` (`#E9C453` / `#6B5518`), `--color-primary-edge` (`#07502A` / samma som primär).
- Radier och typsnitt: `--radius` 8 px finns. Lägg till `--radius-card` 16 px, `--radius-field` 12 px, `--radius-pill` 999 px, `--radius-notice` 14 px. Typsnittsstacken blir `ui-rounded, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`.
- Typografi: h1 32 px/800, h2 18 px/800 (versaler görs per komponent, inte globalt), övningsnamn 17 px/700, brödtext 16 px. Se tabellen i `designsystem.md` 3.
- Fokusramen (3 px, `--color-focus`, `outline-offset: 2px`) och 48 px-träffytorna är oförändrade.

## 2. Ikoner: ny fil `src/app/ui/Icon.tsx` (senior-systemutvecklare)

Fem inline-SVG:er ritade på 24 × 24 med `currentColor`: boll, varningstriangel, gult kort, droppe, bakåtpil. Förlaga: `<symbol>` i skissen `riktning-a-grasmattan.html` (egna ritningar, fria att använda i koden under Apache-2.0). Komponenten tar `name` och ritar `aria-hidden="true" focusable="false"` (6.11). Ersätt tecknen:

| Fil | Nu | Blir |
|---|---|---|
| `src/app/session/SessionView.tsx` rad 185 | `💧` | Droppe |
| `src/app/session/SessionView.tsx` rad 244, `NOTICE_TEXTS`-lista | `⚠` | Gult kort |
| `src/app/session/SessionView.tsx` rad 244, tipsrutan (R-021) | `💡` | Behålls |
| `src/app/session/SessionView.tsx` rad 59 och `InputForm.tsx` rad 93 | `ⓘ` | Behålls |

Varning med triangeln används först av senare vyer (säsongsplan, redaktörskö). Bakåtpilen används där en vy får en "tillbaka"-knapp. Boll visas i sidhuvudet.

## 3. Sidhuvud: ny komponent `src/app/ui/PageHeader.tsx` med CSS-modul (senior-systemutvecklare)

Dagens `<h1>` ligger i `InputForm.tsx` (rad 86), `SessionView.tsx` (rad 219), `NoSessionView.tsx` (rad 54) och `SwapView.tsx` (rad 98, med `tabIndex={-1}` och `ref={focusOnMount}`). Alla fyra byter till `PageHeader`:

- Egenskaper: `heading` (texten, oförändrad från `TEXTS`), valfri `focusHeading` så att fokus vid mount fungerar som i `SwapView` (utvecklarens val i stället för `headingRef`, godkänt: komponenten äger själv fokushanteringen), och `children` för en knapp i bandet ("Tillbaka till passet").
- Utseende enligt `designsystem.md` 6.10: gräsrandat band, boll och "Fotbollsbanken", h1, mittcirkelsdekor och gul list. Dekoren är CSS (`::before`/`::after`), inte innehåll.
- "Fotbollsbanken" är den enda nya texten. Lägg den i `src/app/text/texts.ts` (`TEXTS.app.name`), inte inbakad i komponenten.
- Ingen sidscroll vid 390 px och 200 % textförstoring. Dekoren ska klippas (`overflow: hidden`).
- Inte i planläget och inte i utskriften.

## 4. Underlaget: `src/app/input/InputForm.module.css` (senior-systemutvecklare)

Mest CSS. `InputForm.tsx` ändras i två små avseenden som CSS inte kan göra: de gamla `●`-tecknen tas bort (✓ ersätter dem) och knappen får en omslutande rad för den fasta knappraden. Inga texter ändras. (Rättat efter granskningen: beskrivningen sade tidigare "bara CSS".)

- `.choice` blir pill (`--radius-pill`), 2 px kant i `--color-field-border`. `.choiceSelected` får `--color-selected-bg`/`--color-selected-text`, ingen kantändring i bredd och ✓ före texten via `::before` (`content: "✓" / ""`, dekorativt).
- `.number`: 2 px kant i `--color-field-border`, `--radius-field`, `--color-surface` som bakgrund.
- `.label` 17 px/700. Kryssrutor oförändrade (24 px, `accent-color`), 48 px-raderna är kvar.
- Fokusgrupperna (`.group`) får en linje i `--color-card-border` ovanför varje grupp men ingen `▸`/`▾`-markör så länge grupperna inte går att fälla ihop (beslut vid granskningen, `designsystem.md` 6.7).
- Knappen "Generera pass" och den fasta knappraden: se avsnitt 6.

## 5. Passet och övningskortet (senior-systemutvecklare)

**`SessionView.module.css` och `SessionView.tsx`:**

- `.partHeading` (rad 131–134 i `SessionView.tsx`): behåll rubrikens text och ordning i det tillgängliga namnet ("1. Uppvärmning · 9 min"), så att befintliga tester och skärmläsare ser samma sak. Visuellt delas den: gul cirkel med siffran (`aria-hidden`, dolt "1. " för skärmläsare), delnamn i versaler via CSS, tidspill till höger (`designsystem.md` 6.10). "·" kan göras dold med `.visually-hidden`.
- `.notices`/`.notice`: gult kort (6.4) med ikonen från avsnitt 2. Texten är oförändrad.
- Vattenpausraden (rad 183–187): droppikonen, ingen ändring av texten.
- Avslutningsraden (`.closing`): gul vänsterkant, rundade hörn.
- `.actions`: fast knappraden längst ner (sidans bakgrund, 1 px linje, svag skugga), primärknapp minst 56 px, och `padding-bottom` på vyn motsvarande knappradens höjd (2.4.11, `01-underlag.md`).
- Sammanfattningsraden (`.summaryLine`, rad 221–226): **kan vänta.** Skissen visar den som piller (6.5). Det ändrar DOM-strukturen och påverkar `generator.interaction.test.tsx` (rad 56, 145 och 161, som söker `12 spelare · 2 ledare`). Bygg den först som den är och ta piller i ett senare steg tillsammans med testerna.

**`ExerciseCard.module.css` (och `ExerciseCard.tsx` vid behov):**

- `.card`: 16 px radie, 2 px kant i `--color-card-border`, `0 2px 0`-skugga, 16 px padding.
- Rutnät med två kolumner `96px 1fr`: planskissen till vänster, `.head` och `.purpose` till höger, och `.layout`, `.area`, `.helpToggle`, "Visa mer" och "Byt övning" över hela bredden. Miniatyren är kvar på 96 × 72 px (`Planskissvy.module.css`), ingen storleksändring och ingen ändrad klickbarhet: den förstoras vid tryck som i dag.
- Sekundärknappar (`Visa mer`, `Byt övning`) 16 px radie, 2 px kant i `--color-field-border`. Länkknappen `.helpToggle` är oförändrad.

**`SwapView.module.css`, `NoSessionView.module.css`:** samma tokens, kort och knappar. Inga strukturändringar utöver sidhuvudet.

## 6. Knappar: i varje CSS-modul som idag definierar `.primary`/`.secondary`

Primär: `--color-primary`, 16 px radie, 56 px hög i knappraden, 18 px/700, och i ljust läge 3 px undre kant i `--color-primary-edge`. Sekundär: 2 px `--color-field-border`. Se `designsystem.md` 6.1.

## 7. Planskissens färger: `src/planskiss/planskiss.module.css` (planskissutvecklaren)

Värdena står i `designsystem.md` avsnitt 10. I korthet:

- Nya värden för `--skiss-yta`, `--skiss-linje`, `--skiss-tunn`, `--skiss-lag-a`, `--skiss-pa-lag-a`, `--skiss-lag-b`, `--skiss-neutral`, `--skiss-ledare`, `--skiss-kon`, `--skiss-text`, `--skiss-halo` och `--skiss-monster` i `.skiss` (ljust) och i det mörka `@media`-blocket. Idag pekar flera av dem på `--color-*`; de ska nu ha egna värden (planen är grön med vita linjer även när kortet är vitt).
- Två nya variabler: `--skiss-yta-2` (andra gräsrandens ton) och `--skiss-lag-a-kant` (mörk kant runt lag A och konen).
- Ritmotorn: ytan ritas med rutor/band av `--skiss-yta` och `--skiss-yta-2` (9 enheter breda i skissens skala, gärna som ett mönster i SVG), lag A får kant `--skiss-lag-a-kant` (minst 1,5 px) och konen likaså. Lag B och neutrala förblir ofyllda. Kontrollera att lagen fortfarande skiljs på form och mönster, inte bara färg.
- **Lägg till de två nya variablerna också i `.planlage`, `.utskrift` och `@media print`**, med `--skiss-yta-2` lika med `--skiss-yta` och `--skiss-lag-a-kant` lika med `--skiss-linje`, så att planläge och utskrift ritas exakt som i dag. Inget av dem ska få grön yta eller gult.
- `ogonblicksbild.test.tsx` och övriga ögonblicksbilder under `src/planskiss/__snapshots__/` ändras, och det ska granskas av planskissutvecklaren. Etiketterna (`--skiss-text` på `--skiss-halo`) ska ha samma läsbarhet som i dag.
- Lag B ofylld på färgad yta är en tolkning av ADR 0012 avsnitt 2 som planskissutvecklaren bekräftar. Om det behöver ändras kräver det en ny ADR.

## 8. Det som inte ska ändras

- Planläget (`.planlage`-temat), utskriften och deras skissvärden.
- Texter, rubriker, knapptexter och ordningen i passet (utöver varumärkesraden).
- Träffytor (minst 48 px), fokusram (3 px), 8 px mellan intilliggande träffytor, 200 % förstoring.
- Mörkt läge följer enhetens inställning som i dag. Manuell växling är inte en del av det här.

## 9. Kontroll efter bygget (UX-designern)

Jag granskar i 390 px, ljust och mörkt läge, de berörda vyerna: underlaget, genererat pass, inget matchande resultat och byt övning. Kvalitetssäkraren gör axe-kontrollen och kontrastkontrollen mot byggda pixlar, och planskissutvecklaren intygar skisserna i båda lägena. Det som byggts ska också jämföras med skissfilen ovan.
