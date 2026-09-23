Status: godkänd (K2, 2026-09-12)

# Vy: Underlag för generatorn

**Uppfyller:** berättelse 01 (ange underlag och få spelform föreslagen), grunden för 02.

**Läge:** Planeringsläget.

**Princip:** ett fåtal steg, rimliga förval, senaste val sparas till nästa gång (se `.claude/agents/ux-designer.md`). Formuläret visas som en enda skrollbar sida på mobil, inte en flerstegs-wizard, så att ledaren ser hela underlaget och kan gå tillbaka och ändra utan att "backa" i flera steg.

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Nytt pass                    │
│                                 │
│ Ålder (den ålder flest fyller  │
│ i år)                    (i)   │
│ ┌───────────────────────────┐  │
│ │ 11                        │  │
│ └───────────────────────────┘  │
│                                 │
│ Spelform                       │
│ ┌─────────┬─────────┬───────┐  │
│ │ 5 mot 5 │ 7 mot 7●│ 9 mot 9│  │  ● = föreslagen/vald
│ └─────────┴─────────┴───────┘  │
│ Föreslagen utifrån åldern.      │
│                                 │
│ Nivå                    (i)    │
│ ┌───────────┬───────────┬────┐ │
│ │ Grund     │Fortsättn.●│Förd.│ │
│ └───────────┴───────────┴────┘ │
│                                 │
│ Antal spelare                  │
│ ┌───────────────────────────┐  │
│ │ 14                        │  │
│ └───────────────────────────┘  │
│                                 │
│ Antal ledare                   │
│ ┌───────────────────────────┐  │
│ │ 2                         │  │
│ └───────────────────────────┘  │
│                                 │
│ Passets längd (minuter)        │
│ ┌───────────────────────────┐  │
│ │ 60                        │  │
│ └───────────────────────────┘  │
│ Kortast 30, längst 90 min för   │
│ den här åldern.                 │
│                                 │
│ Fokusområden (välj 1–3)        │
│ ▾ Bollen och tekniken           │
│   ☐ Bollkänsla                 │
│   ☑ Passning och mottagning (K)│
│   ☐ Avslut (K)                 │
│ ▾ Spelet                       │
│   ☐ 1 mot 1                    │
│   ☑ Spela tillsammans (K)      │
│   ☐ Speluppbyggnad (K)         │
│   ☐ Försvarsspel (K)           │
│   ☐ Omställning (K)            │
│ ▸ Kropp och rörelse             │
│ ▸ Lek                          │
│                                 │
│ Yta (valfritt)          (i)    │
│ ┌───────┬────────┬───────────┐ │
│ │ Ingen●│Hel plan│Halv│Kvart │ │
│ └───────┴────────┴───────────┘ │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Generera pass         │  │  ← 48 px, alltid synlig
│ └───────────────────────────┘  │  (sticky längst ner)
└────────────────────────────────┘
```

## Beteende och tillstånd

- **Spelform (01.1, 01.2):** när åldern anges/ändras väljs automatiskt den föreslagna spelformen om ledaren inte redan gjort ett eget val för samma ålder. Endast tre alternativ visas: föreslagen, samt närmast före/efter. Övriga spelformer visas inte alls (inte gråtonade – de finns inte som val).
- **Ogiltig ålder (01.3):** ålder utanför 6–19 ger felmeddelande direkt under fältet (se `texter.md`), och "Generera pass" är fortsatt klickbar men visar samma fel igen om ledaren försöker.
- **Blandad ålder (01.11):** infotexten `(i)` bredvid Ålder öppnar/visar alltid en kort rad: "Har gruppen flera åldrar? Ange den ålder som flest fyller i år." På mobil kan detta stå som statisk hjälptext direkt under fältet i stället för ett ikon-info, eftersom utrymmet finns.
- **Nivå (i):** infotext länkar till en kort beskrivning från `docs/doman/nivaer.md` (två av tre spelare-regeln), som en utfällbar textruta, inte en ny sida.
- **Fokusområden (01.9, 01.10):**
  - Innan ålder är ifylld kan listan inte filtreras mot en åldersfas. Fokusfältet visar då bara texten "Ange ålder först, så visar vi de fokusområden som passar åldern." i stället för grupperna (tillagd vid granskningen inför K4, 2026-09-23, se `texter.md` avsnitt 3).
  - Listan grupperas som i `fokusomraden.md`, grupperna kan fällas ihop/ut. Kärnområden (K) märks med "(K)" efter namnet och ligger överst i sin grupp.
  - Bara fokusområden som är K eller R för den valda åldersfasen visas alls.
  - Kryssrutor låser sig vid tre valda: övriga blir inaktiva (men fortfarande lästa av skärmläsare som "inaktiverad, redan tre valda") tills ledaren avmarkerar en.
  - `nickspel` visas bara från 13 år. Väljer ledaren bara `nickspel` visas felet i `texter.md` när hon eller han försöker generera.
- **Yta (01.12, R-090):** tre val plus "Ingen" som förval. Att välja "Ingen" är alltid giltigt.
- **Obligatoriska fält saknas (01.5–01.8):** vid tryck på "Generera pass" märks varje ofullständigt/ogiltigt fält med röd ram och en textrad under fältet. Sidan skrollar automatiskt upp till det första felet. Ett samlat fel visas också ovanför knappen: "Några uppgifter saknas eller stämmer inte – se markeringarna ovan."
- **Senaste val sparas:** nästa gång ledaren öppnar "Nytt pass" är fälten förifyllda med senaste körningens värden (utom antal spelare, som ofta varierar per tillfälle – produktbeslut, se rapport).
- **Sticky knapp:** "Generera pass" ligger fast i nederkanten så att ledaren aldrig behöver skrolla för att hitta den, oavsett hur många fokusgrupper som är utfällda.

## Tillgänglighet

- Alla knappgrupper (spelform, nivå, yta) är riktiga knappgrupper (radiogrupp-semantik), inte bara färgade rutor – markerat val har både färg och en synlig bock/prick, aldrig färg som enda signal (WCAG 1.4.1).
- Kryssrutor för fokus har minst 48 × 48 px träffyta inklusive textetiketten (hela raden är klickbar).
- **Avstånd mellan kryssrutornas rader:** minst 8 px mellan varje rad i fokuslistan, som mellan alla andra intilliggande träffytor (`designsystem.md` avsnitt 4) – annars är kravet om 48 × 48 px otillräckligt när raderna ligger direkt an mot varandra. (Rättat 2026-09-23, stod tidigare på 4 px.)
- **"(K)" och det tillgängliga namnet (löst och slutgiltigt beslutat 2026-09-23):** "(K)" är nu `aria-hidden` och följs av en dold text som läses upp i stället: "Passning och mottagning, kärnområde", inte "Passning och mottagning (K)". Det ger ett begripligt namn – en ensam bokstav "K" utan sammanhang hade varit sämre – men bryter mot den strikta ordalydelsen i WCAG 2.5.3 (*Label in Name*): kravet är att det tillgängliga namnet ska **innehålla** den text som visas, och "(K)" visas fortfarande men finns inte längre bokstavligen i namnet.
  **Beslut:** mönstret ska justeras, inte stå kvar som det är. Lösningen är att låta "(K)" vara kvar i det tillgängliga namnet – ta bort `aria-hidden` från just de tecknen – och lägga den förklarande texten *efter*, i stället för att ersätta "(K)" med den. Det tillgängliga namnet blir då "Passning och mottagning (K), kärnområde": hela den synliga etiketten ingår ordagrant (2.5.3 uppfylld, precis som för `focusFull`-texten som också läggs till efter den synliga etiketten i stället för att ersätta något), och en skärmläsare får ändå sammanhanget till bokstaven "K" direkt efter. Skälet att inte bara behålla dagens lösning: en röststyrningsanvändare som läser den synliga etiketten "(K)" och försöker aktivera rutan genom att säga hela den upplästa texten ska inte behöva gissa sig till att bokstäverna hon ser inte finns i namnet. Det är en `InputForm.tsx`-ändring (byt `<span aria-hidden="true"> (K)</span>` mot att låta "(K)" vara en vanlig del av `<span>`-texten, med den dolda utläsningen kvar direkt efter) – se rapporten från uppföljningen 2026-09-23.
- Kontrastkrav: se `designsystem.md`.

## Vad som INTE är med här

- Materialfilter, inomhushall, antal målvakter – utanför version 1 (se backlog).
- Koppling till lag – sker vid spara (se `05-sparade-pass.md`), inte här.

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-09-23 | Tillagt vid granskningen av det byggda gränssnittet inför K4: texten för fokusfältet innan ålder är ifylld, ett förtydligande om avståndet mellan kryssrutornas rader, och en anmärkning om hur "(K)" läses upp av skärmläsare. Statusraden överst ändras inte av en agent. |
| 2026-09-23 (uppföljning samma dag) | Avståndet mellan kryssrutornas rader rättat till 8 px i koden – anmärkningen ovan bekräftar det i stället för att flagga det. "(K)"-frågan avgjord: mönstret med `aria-hidden` runt "(K)" ska justeras så att "(K)" ligger kvar i det tillgängliga namnet (WCAG 2.5.3), med den dolda utläsningen tillagd efter i stället för att ersätta "(K)". Se anmärkningen ovan för skälet. |
