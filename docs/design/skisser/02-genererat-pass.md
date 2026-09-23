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

## Beteende och tillstånd

- **Delnamn och ordning (02.2, R-030):** delarna visas alltid i fast ordning: Uppvärmning, Öva, Spelövning, Spel, Avslutning, med sina fasta nycklar dolda för ledaren (bara namnen visas).
- **Varje övning visar minst** namn, syfte, tilldelad tid och planskiss (eller "Planskiss saknas") (02.2, 06.2). Full beskrivning, coachningspunkter och varianter (R-029) nås via "Visa mer" som fäller ut i samma kort, utan sidbyte.
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

## Utskrift och planläge

- Samma passdata återanvänds i `06-planlage.md` (en övning i taget) och `07-utskrift.md` (allt på en gång, i A4-format). Den här vyn är arbetsytan; de andra två är renodlade vyer för sina egna syften.

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-09-23 | Tillagt: ersättningsfokus (R-121) som en egen informationsrad per del, och ett tredje läge för en tom del ("inget enskilt val hjälper"), utöver de två som redan fanns. Båda saknades vid K2 eftersom R-121 och det tredje läget tillkom senare. Upptäckt vid granskningen av det byggda gränssnittet inför K4. Statusraden överst ändras inte av en agent. |
| 2026-09-23 (uppföljning samma dag) | Bekräftat mot koden: till skillnad från vy 03 (se `03-inget-matchande-resultat.md`) hade den här vyn redan en riktig per-del-signal (`emptyReason` i `PartResult`) när det tredje läget skrevs, så beskrivningen ovan krävde ingen ändring – `SessionView.tsx` är nu kopplad exakt så här. |
