Status: godkänd (K2, 2026-09-12)

# Vy: Genererat pass

**Uppfyller:** berättelse 02 (generera träningspass), 07 (planskisser i pass, inbäddat), delar av 03 (tomma delar), ingång till 04 (byta övning) och 05 (spara).

**Läge:** Planeringsläget.

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Ditt pass            [Spara] │
│                                 │
│ 7 mot 7 · Fortsättning · 60 min │
│ Faktisk tid: 58 min             │
│ Fokus: Passning och mottagning, │
│ Spela tillsammans                │
│                                 │
│ ⚠ Kom ihåg benskydd – spel      │
│   innehåller alltid närkamper.  │
│ ⚠ Se till att alla mål är       │
│   förankrade.                   │
│ 💡 Ni är fler än 8 spelare per  │
│   ledare – be gärna en förälder │
│   om hjälp.                     │
│                                 │
│ ──────────────────────────────  │
│ 1. UPPVÄRMNING · 10 min         │
│ ┌───────────────────────────┐  │
│ │ [Planskiss, liten]         │  │
│ │ Passningslek i ruta         │  │
│ │ Syfte: komma igång, träna   │  │
│ │ första touchen              │  │
│ │ Yta: 20 × 15 meter          │  │
│ │ (något större än cirkeln)   │  │
│ │ Vad betyder måttet i        │  │
│ │ parentes? ▾                 │  │
│ │ [Byt övning]  [Visa mer ▾] │  │
│ └───────────────────────────┘  │
│                                 │
│ 2. ÖVA · 11 min · 2 stationer  │
│ ┌───────────────────────────┐  │
│ │ Station A: Passning med    │  │
│ │ vändning (5 min)            │  │
│ │ [Planskiss] [Byt] [Mer ▾]  │  │
│ ├───────────────────────────┤  │
│ │ Station B: Passningsbana   │  │
│ │ i par (5 min)               │  │
│ │ [Planskiss] [Byt] [Mer ▾]  │  │
│ └───────────────────────────┘  │
│                                 │
│ 💧 Vattenpaus · 2 min           │
│                                 │
│ 3. SPELÖVNING · 12 min          │
│ ┌───────────────────────────┐  │
│ │ [Planskiss]                │  │
│ │ 3 mot 3 med joker           │  │
│ │ [Byt övning]  [Visa mer ▾] │  │
│ └───────────────────────────┘  │
│                                 │
│ 4. SPEL · Övning saknas         │
│ ┌───────────────────────────┐  │
│ │ Vi kunde inte hitta en      │  │
│ │ övning som passade den här  │  │
│ │ delen. Måltid: 19 min.      │  │
│ │ Testa att ändra: nivå,      │  │
│ │ antal spelare eller yta.    │  │
│ └───────────────────────────┘  │
│                                 │
│ 5. AVSLUTNING · 5 min (fast)    │
│ Samling: vad tränade vi på,     │
│ vad gick bra?                   │
│                                 │
│ ┌───────────────────────────┐  │
│ │        Spara pass          │  │  ← sticky, 48 px
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

**Om "▾" i wireframen (klargjort vid granskningen 2026-09-28):** symbolen markerar bara för ögat att en kontroll fäller ut eller ihop – "Vad betyder måttet i parentes? ▾", "Visa mer ▾", "Mer ▾" – den är inte del av knapptexten. Den knapptext som ska implementeras är den som står i `texter.md` avsnitt 4, ordagrant och utan "▾" (till exempel "Vad betyder måttet i parentes?", "Visa mer"). Samma konvention används i flera andra wireframes (`01-underlag.md`, `05-sparade-pass.md`, `06-planlage.md`, `11-hantera-egna-ovningar.md`) och gäller där på samma sätt. Vill man visa en pil i gränssnittet ska den vara en dekorativ ikon (`aria-hidden`, till exempel via CSS), aldrig inbakad i den klickbara texten eller i det tillgängliga namnet – annars bryter det mot att knapptexten ska vara exakt den som står i `texter.md`. Se `designsystem.md` avsnitt 6.7.

## Beteende och tillstånd

- **Delnamn och ordning (02.2, R-030):** delarna visas alltid i fast ordning: Uppvärmning, Öva, Spelövning, Spel, Avslutning, med sina fasta nycklar dolda för ledaren (bara namnen visas).
- **Varje övning visar minst** namn, syfte, tilldelad tid, yta och planskiss (eller "Planskiss saknas") (02.2, 06.2). Full beskrivning, coachningspunkter och varianter (R-029) nås via "Visa mer" som fäller ut i samma kort, utan sidbyte.
- **Yta (tillagd 2026-09-28, ADR 0017):** en egen rad längst ner bland korets nyckeltal, efter gruppindelningen och före "Visa mer". Visar alltid metertalet, till exempel "Yta: 18 × 12 meter". Har övningen en ytreferens för spelformen står den direkt efter i parentes: "Yta: 18 × 12 meter (stora planens målområde, dubbelt så djupt)". Saknar övningen en referens visas bara måttet – ingen tom parentes. Referensen kan bli lång (upp till 90 tecken) och radbryter då fritt, men själva måttet ("Yta: 18 × 12 meter" och parentesens första tecken) ska hållas ihop så att till exempel "×" eller "(" aldrig hamnar ensamt på en rad. Se `texter.md` avsnitt 4.
- **Ytförklaring (tillagd 2026-09-28, uppföljning till ADR 0017):** en liten utfällbar förklaring direkt under yta-raden, samma mönster som "Visa mer" (accordion, `designsystem.md` 6.7), men bara på den första övningen i passet – i visningsordning, stationer inräknade – vars yta har en ytreferens. Den upprepas alltså inte på varje kort. Fälld: "Vad betyder måttet i parentes?". Utfälld: "Referensen jämför storlek. Var målen står följer övningens beskrivning." och knapptexten byter till "Dölj förklaringen". Skälet: fotbollsexperten påpekade vid granskningen att en ledare kan läsa referensen som en plats, till exempel ställa målet på straffområdets riktiga mållinje, i stället för en jämförelse av storlek. Saknar hela passet ytreferenser visas ingenting. Se `texter.md` avsnitt 4.
- **Stationer (02.4):** när en del har ett stationsmoment visas varje station som en egen rad inom samma kort, tydligt numrerad A, B, C … med egen tid och egen "Byt"-knapp (byte gäller den stationens övning).
- **Tom del (02.16, 03.4, R-100):** visas med delens namn, måltid och texten "Vi kunde inte hitta en övning …". Tre lägen, inte två (det tredje tillagt vid granskningen inför K4, 2026-09-23):
  1. Orsaken är ett enskilt val som skulle kunna lösa det (R-103): de valen listas.
  2. Delen går i sig att fylla men inte ihop med resten av passet (R-100 andra punkten, `emptyReason: 'gar-inte-att-kombinera'`): "De övningar som annars skulle passa här gick inte att kombinera med resten av passet."
  3. Delen går varken att fylla som den står, eller genom att ändra ett enda fält (`emptyReason: 'val-kan-andras'` **och** `changeableFields` är tom): "Vi hittade inga övningar som passar den här delen, och inget enskilt val skulle ensamt lösa det. Prova att ändra flera uppgifter i underlaget samtidigt." Utan det här tredje läget visas läge 2 även när det inte stämmer att andra övningar skulle passa var för sig – till exempel när banken helt saknar övningar för spelformen (11 mot 11 i dag). Se `texter.md` avsnitt 4.
- **Ersättningsfokus i en del (R-121, tillagt 2026-09-23):** när `del-ovning` eller `del-spelovning` fylldes med ett annat fokus än det ledaren valde, visas en informationsrad direkt under delens rubrik, före övningskortet/stationerna: "Inga övningar för {missing} passade den här delen, så vi använde {substitute} i stället. Dina val i underlaget är oförändrade." Delen räknas inte som tom och visas i övrigt som en fylld del (övningskort, planskiss, tid). Se `texter.md` avsnitt 4 och berättelse 03, kriterium 6.
- **Tips om många spelare per ledare (02.13, R-021):** visas som en gul infobox direkt under sammanfattningen, alltid synlig när tillämpligt, aldrig gömd bakom en klick.
- **Säkerhetspåminnelser (02.15):** benskydd visas alltid. Mål-påminnelsen visas bara när någon övning i passet har mål i sitt material.
- **Total tid (02.8):** "Faktisk tid" visas bredvid den begärda längden när de skiljer sig åt (aldrig längre, högst 5 minuter kortare).
- **Byt övning:** öppnar `04-byt-ovning.md` för just den övningen/stationen.
- **Spara pass:** öppnar namnge-steget, se `05-sparade-pass.md`.
- **Inget pass alls kunde skapas:** denna vy visas då inte över huvud taget – ledaren kommer i stället till `03-inget-matchande-resultat.md` direkt från underlagsvyn.

## Tillgänglighet

- Rubriknivåer: delnamnen är riktiga rubriker (h2/motsvarande) så att en skärmläsare kan navigera mellan delarna.
- "Visa mer ▾" är en riktig disclosure-knapp med `aria-expanded`.
- Varningar (⚠) och tips (💡) har text som förmedlar innebörden utan ikonen (ikonen är dekorativ, inte enda bäraren av information).
- Ersättningsfokus-raden (ⓘ, tillagd 2026-09-23) följer samma mönster: ikonen är dekorativ, texten ensam förklarar vad som hänt och varför.
- Kontrast: se `designsystem.md` för varnings-/tipsfärger i ljust och mörkt läge.
- Ytraden (tillagd 2026-09-28): "×" i måttet ska läsas begripligt av en skärmläsare (till exempel som "gånger"). Kvalitetssäkraren kontrollerar detta med en riktig skärmläsare. Läses det oklart, läggs ett `.visually-hidden`-tillägg till på samma sätt som för "kärnområde" i `01-underlag.md` – den synliga symbolen ändras inte.
- Ytförklaringen (tillagd 2026-09-28) är en riktig disclosure-knapp med `aria-expanded`, precis som "Visa mer" – ett eget tillstånd, inte kopplat till det. Innehållet är helt dolt för skärmläsare när den är fälld, inte bara visuellt gömt. Ingen information ges bara vid hovring (`title` används inte), så förklaringen fungerar med pekskärm och tangentbord likaväl som med mus.

## Utskrift och planläge

- Samma passdata återanvänds i `06-planlage.md` (en övning i taget) och `07-utskrift.md` (allt på en gång, i A4-format). Den här vyn är arbetsytan; de andra två är renodlade vyer för sina egna syften.

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-09-23 | Tillagt: ersättningsfokus (R-121) som en egen informationsrad per del, och ett tredje läge för en tom del ("inget enskilt val hjälper"), utöver de två som redan fanns. Båda saknades vid K2 eftersom R-121 och det tredje läget tillkom senare. Upptäckt vid granskningen av det byggda gränssnittet inför K4. Statusraden överst ändras inte av en agent. |
| 2026-09-23 (uppföljning samma dag) | Bekräftat mot koden: till skillnad från vy 03 (se `03-inget-matchande-resultat.md`) hade den här vyn redan en riktig per-del-signal (`emptyReason` i `PartResult`) när det tredje läget skrevs, så beskrivningen ovan krävde ingen ändring – `SessionView.tsx` är nu kopplad exakt så här. |
| 2026-09-28 | Tillagt: ytraden på övningskortet (ADR 0017, `feature/ytreferens`) – metertalet och en eventuell ytreferens i parentes. Fanns inte vid K2; måttet visades inte alls på kortet innan den här ändringen. Wireframen och tillgänglighetsavsnittet uppdaterade. |
| 2026-09-28 (uppföljning samma dag) | Tillagt: en utfällbar ytförklaring på den första övningen i passet som har en ytreferens, efter att fotbollsexperten vid granskningen såg att referensen kan läsas som en plats i stället för en jämförelse av storlek. Grenen `design/ytreferens-hjalptext`. Wireframen, beteendeavsnittet och tillgänglighetsavsnittet uppdaterade. |
| 2026-09-28 (granskning av det byggda gränssnittet) | Två frågor från senior-systemutvecklaren avgjorda. (1) `.helpToggle` får se ut som en länk i stället för en kantad knapp – godkänt, se `designsystem.md` avsnitt 6.7, "Länkliknande utfällningsknapp". (2) "▾" i wireframen är bara en sketchkonvention, inte del av knapptexten – utvecklaren gjorde rätt i att inte lägga till "▾" i `AreaHelp`, eftersom `texter.md` avsnitt 4 aldrig innehållit tecknet. Klargörande tillagt ovanför "Beteende och tillstånd" och i `designsystem.md` avsnitt 6.7. Ingen kod ändrad av ux-designern. |
