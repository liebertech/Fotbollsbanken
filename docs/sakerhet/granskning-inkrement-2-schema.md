Status: granskning under inkrement 2, schemat för skissdata (2026-09-29)

# Säkerhets- och dataskyddsgranskning: schemat för skissdata

**Granskare:** agenten `sakerhet-integritet` · **Gren:** `feature/planskiss-schema` (7be8fde, db978bc) · **Inför:** merge av schemat, första steget i inkrement 2

Rapporten återges som agenten lämnade den och har sparats i repot av huvudsessionen. Fynden är numrerade F1–F9 och kraven på ritmotorn RK-1–RK-10 inom den här rapporten.

## Sammanfattning

Schemat håller i stort det som ADR 0012 avsnitt 6 lovar:

- objekten är strikta och formerna är slutna listor
- talen har gränser, och `NaN` och `Infinity` underkänns
- `__proto__` och `constructor` underkänns
- fältet har typen `unknown` i det publicerade paketet.

Ett fynd bryter mot ett uttryckligt krav: `readPlanskiss` kan kasta ett fel trots att den lovar att aldrig göra det (F1). Kommatecknet i etiketterna är ofarligt. Skyddet mot personuppgifter i skissen vilar nästan helt på människor, och redaktörskön visar i dag inte etiketterna (F2). Inget blockerar en merge, eftersom ingen övning har `planskiss` ännu, men F1 bör rättas före merge.

## Fynd

### F1 · Medel · `readPlanskiss` kastar på konstruerad data

**Var:** `src/regelmotor/schema/planskiss.ts`, `String(given)` i `unionError`.

**Problemet:** När `typ` eller `strategi` är ett objekt vars `toString` inte är en funktion kastar `String()` ett `TypeError`. Zod fångar inte ett fel som uppstår i funktionen som bygger felmeddelandet.

- Följande indata kastar: `{"typ":{"toString":1},"x":1,"y":1}`.
- Samma sak gäller för `skalning.strategi`.
- Det strider mot ”Kastar aldrig” och mot ADR 0012 avsnitt 7.

**Scenario (inkrement 3–4):**

1. En egen övning med den här skissen skrivs direkt via PostgREST.
2. Övningen synkas till alla i klubben och cachas i IndexedDB.
3. Vyn kraschar hos alla i klubben, och kraschen kommer tillbaka vid varje start.

**Åtgärd:**

- Visa bara säkra värden i felmeddelandet.
- Lägg `safeParse` inuti `try/catch` och returnera `ogiltig` om något kastas.
- Lägg till testfall för de två nyttolasterna.

### F2 · Medel · Personuppgifter i skissen fångas bara av e-postkontrollen, och redaktören ser inte etiketterna

Namn går inte att upptäcka tekniskt:

- En kort etikett (3 tecken) rymmer ”Ali”.
- En lång etikett (24 tecken) rymmer ”Kalle, Lisa, Omar”.
- `beskrivning` rymmer 300 tecken och hamnar i `<desc>`, som aldrig syns på skärmen.

Enligt ADR 0012 avsnitt 5 visar redaktörskön skissen som miniatyr, utan etiketter. En redaktör kan alltså godkänna en inskickad övning utan att ha sett skissens texter. Klubbens egna övningar granskas aldrig.

**Åtgärd:**

- (a) Redaktörens granskningsvy visar skissen i storleken `normal`, och alla texter från `planskissTexts` i klartext.
- (b) Skisseditorn i inkrement 4 får samma upplysning om spelarnamn som de andra fritextfälten (S-20).
- (c) Redaktörens checklista får punkten ”inga namn i skissens etiketter eller beskrivning”.
- (d) Eventuellt ett snävare mönster för korta etiketter, se *Beslut som behövs*.

### F3 · Låg · Kommatecknet i etikettmönstret avviker från ADR 0012 men är ofarligt

Kommatecknet har ingen betydelse i text eller i attributvärden i HTML och XML. Det blir bara ett problem om en etikett hamnar i ett attribut, och det förbjuder RK-2. Avvikelsen från en beslutad ADR behöver dokumenteras som ett eget beslut.

### F4 · Låg · Felmeddelanden upprepar indata utan gräns

20 000 okända nycklar gav ett felmeddelande på 1,1 miljoner tecken, och ett `typ` på 1 miljon tecken upprepades i sin helhet.

**Åtgärd:** Korta upprepade värden till cirka 40 tecken och lista högst 5 okända nycklar, följt av ”och N till”.

### F5 · Låg · `readPlanskiss` parsar hela strukturen innan antalsgränserna prövas

300 000 objekt (16 MB JSON) tog 544 ms. Zod 4 prövar `.max()` först när alla element har parsats.

**Åtgärd:**

- Gör en billig förkontroll av listornas längd och av `JSON.stringify(value).length` mot 8 192.
- Skriv ett pgTAP-test i inkrement 3 med en lätt komprimerbar skiss på 100 kB.
- Överväg `octet_length((content -> 'planskiss')::text)` i stället för `pg_column_size`, som räknar storleken efter komprimering.

### F6 · Låg · `beskrivning` har ingen teckenkontroll

Styrtecken och bidi-tecken, alltså tecken som styr skrivriktningen (U+202E och liknande), godtas i `beskrivning`. Skärmläsare läser upp dem, och de kan vända på texten runt omkring. Etiketter underkänner dem redan, men underkänner också ett ”é” med kombinerande accent (NFD).

**Åtgärd:**

- Underkänn `\p{Cc}` och bidi-tecknen U+202A–202E och U+2066–2069 i `beskrivning`, och gärna i alla fritextfält.
- Normalisera till NFC innan etikettmönstret prövas.

### F7 · Låg · Etiketter kan se ut som URL:er och CSS

`javascript:alert(1)`, `http://x.se` och `url(x)` godtas. De är ofarliga som text men farliga i ett attribut. Hanteras av RK-2 och RK-3.

### F8 · Låg · `Planskissdata` kan kringgås med `as`

**Åtgärd:**

- Gör typen märkt (`.brand<'Planskissdata'>()`).
- Förbjud `as Planskissdata` med en ESLint-regel.
- Datalagret i inkrement 3 typar `content.planskiss` som `unknown` (ADR 0016).

### F9 · Låg · ESLint-skyddet för ritmotorn är en svartlista där ADR 0012 kräver en vitlista

Följande fångas inte:

- elementen `animateMotion`, `animateTransform`, `set`, `feImage`, `textPath`, `iframe`, `object`, `embed`, `marker` och `symbol`
- attributen `href`, `xlinkHref`, `style` och `on*`
- `createElement` med dynamiska elementnamn.

**Åtgärd:** Gör regeln till en vitlista enligt ADR 0012 avsnitt 6, och förbjud attributen ovan och `createElement` i `src/planskiss/`.

## Krav på ritmotorn

- **RK-1:** Ritmotorn tar bara emot märkt `Planskissdata` från `readPlanskiss`. Vid `saknas` och `ogiltig` visas `PlanskissSaknas` respektive `PlanskissFel`. Varje skiss har en egen felgräns.
- **RK-2:** Text från skissen får bara vara React-barn till `<text>`, `<tspan>`, `<title>` eller `<desc>`, aldrig värdet i ett attribut.
- **RK-3:** Geometriska attribut räknas bara fram ur validerade tal och kontrolleras med `Number.isFinite`. Inga strängar från data sätts samman till `d`, `points` eller `transform`.
- **RK-4:** SVG-id:n är `instansId` plus ett fast suffix, där `instansId` valideras mot `^[a-z0-9-]{1,80}$`. Skissens `id` blir aldrig ett DOM-id.
- **RK-5:** Ingen `style` byggs från data. Färger sätts bara med fasta CSS-variabler och klasser (S-17).
- **RK-6:** Taken kontrolleras igen när skissen ritas: högst 40 spelarsymboler, högst 8 per kö och ingen division med noll.
- **RK-7:** Etiketter ritas med `unicode-bidi: isolate` och klipps eller kortas vid ytans kant.
- **RK-8:** Utskriften i inkrement 6 serialiserar aldrig SVG till en sträng som sätts in i DOM:en.
- **RK-9:** Redaktörskön visar skissens texter i klartext (F2).
- **RK-10:** Testerna omfattar XSS-nyttolaster i `beskrivning`, en kontroll att inget attributvärde innehåller skissens text, och en fuzz-slinga som visar att `readPlanskiss` aldrig kastar.

## Verifierat

- `git diff origin/main...HEAD` och de berörda filerna är lästa, liksom ADR 0012 avsnitt 5–7 och tidigare granskningar.
- `npx vitest run src/regelmotor/schema scripts/planskiss-readme.test.ts`: 178 av 178 gröna.
- Provkörning mot `planskiss.ts` gav mätvärdena i F1 och F3–F7.
- `npm audit --omit=dev`: 0 sårbarheter.
- Ingen övning i `content/ovningar/` har `planskiss` ännu.

## Kvarstår

- Hur `pg_column_size` beter sig i en `check` är inte verifierat, eftersom det saknas en databas. Det tas i inkrement 3.
- RK-1 till RK-10 är krav. Ritmotorn finns inte ännu.
- Namn på spelare går inte att upptäcka tekniskt.

## Beslut som behövs

1. **Kommatecken i etiketter (F3).** Rekommendation: godkänn, och dokumentera det i en ny ADR.
2. **Snävare korta etiketter (F2 d)**, `^[\p{Lu}\p{N}]{0,3}$`. Rekommendation: ja, om fotbollsexperten bekräftar att inga gemena förkortningar behövs.
3. **Redaktörens granskningsvy (F2 a, RK-9)** visar skissen läsbart med texterna i klartext, i strid med tabellen i ADR 0012 avsnitt 5. Rekommendation: ja, som ny ADR.

## Uppföljning 2026-09-29

Säkerhetsagenten prövade fynden igen mot `feature/planskiss-schema` (a2f28e8), efter rättelsen i 502706f. Användaren godkände rekommendationerna under *Beslut som behövs* samma dag, och de står i ADR 0018.

| Fynd | Utfall | Rest |
|---|---|---|
| F1 | Åtgärdat | Den nya `catch` fångar också programmeringsfel. Testet med ADR 0012:s exempel fångar en sådan regression. Låg. |
| F2 | (a) och (c) är krav i berättelse 16, (b) är en not i backloggen, (d) är genomfört | Namn går fortfarande inte att upptäcka tekniskt. |
| F4 | Delvis | Tre meddelanden i `checkSketch` upprepar `id`, `objekt` och `vid` utan gräns. Övningsschemat anropar schemat utan förkontroll. Låg. |
| F5 | Åtgärdat i klienten | pgTAP-testet och `octet_length` tas i inkrement 3. |
| F6 | Delvis | `\p{Cf}` (bland annat LRM, RLM, ZWSP, BOM och taggtecken), `\p{Zl}`, `\p{Zp}`, `\p{Co}` och `\p{Cn}` godtas fortfarande i `beskrivning`. Taggtecken kan gömma text för redaktören. Låg. |
| F7 | Inte åtgärdat i schemat, enligt plan | Vilar på RK-2 och RK-3. Attributtestet i RK-10 ska finnas innan ritmotorn mergas. |
| F8 | Delvis | Går att kringgå med ett alias, en namnrymdsimport, `Planskissdata[]` och tilldelning från `any`. Typad lint (`no-unsafe-*`) rekommenderas för `src/planskiss/` och `src/data/`. Låg. |
| F9 | Delvis | Versala JSX-namn bundna till en variabel, `createElement` under ett annat namn, `jsx()` från `react/jsx-runtime`, `ref` med `innerHTML` eller `setAttribute` och `createPortal` fångas inte. Ett körtest i RK-10 som kontrollerar taggar och attribut mot en vitlista är det starkaste skyddet. Låg. |

**Ny iakttagelse, låg:** version 1 har ingen skisseditor, men en ledare kan skriva `planskiss` i en egen övning direkt via PostgREST. Texten granskas då aldrig. Iakttagelsen står i backloggen under inkrement 3 som en spärr i databasen.

RK-1 till RK-10 är nu ett acceptanskriterium (kriterium 10) i berättelse 06.
