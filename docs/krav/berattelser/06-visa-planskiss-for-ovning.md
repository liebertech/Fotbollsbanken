Status: utkast (skärpt inför K4, 2026-09-28)

# 06. Visa planskiss för en övning

**Roll:** ledare

**Som** ledare **vill jag** se en tydlig planskiss för varje övning, **så att** jag snabbt förstår hur övningen ska ställas upp på planen utan att behöva läsa hela beskrivningen.

## Acceptanskriterier

1. **Givet** att en övning har giltig skissdata, **när** ledaren öppnar övningen – i ett genererat eller sparat pass, vid byte av övning (berättelse 04, redan byggd i inkrement 1) eller i den samlade passvyn (berättelse 07) – **då** visas en planskiss tillsammans med övningens text, i den storlek (`miniatyr` eller `normal`) och det utförande som `docs/design/designsystem.md` avsnitt 7 anger för just den vyn.
2. **Givet** att en övning saknar skissdata, **när** ledaren öppnar övningen, **då** visas i stället en tydligt inramad yta i samma mått som skissen skulle haft, med texten "Planskiss saknas" (`docs/design/texter.md` avsnitt 8), aldrig ett fel, en trasig bildikon eller en tom lucka. Övningens text visas som vanligt.
3. **Givet** att en övning har skissdata som inte går att validera när den läses (till exempel skadad eller ogiltig data i databasen), **när** ledaren öppnar övningen, **då** visas samma inramade yta som i kriterium 2, men med texten "Planskissen kunde inte visas" (`docs/adr/0012-planskissformat.md`, avsnitt 7). Felet stoppar aldrig resten av sidan, och ledaren ser aldrig en teknisk felutskrift.
4. **Givet** att ledaren visar en planskiss i normal storlek på en mobil skärm, **då** är skissen läsbar och proportionerlig utan att ledaren behöver zooma för att se helheten (ADR 0012, avsnitt 5).
5. **Givet** att planskissen visar en yta med mått, **då** motsvarar de visade måtten och uppställningen övningens skissdata, skalade efter den spelform övningen visas för (ADR 0012, avsnitt 1). **Givet** att det faktiska antalet spelare per grupp är känt när skissen visas (till exempel i ett genererat eller sparat pass), **då** visas skissen skalad efter det antalet enligt skalningsreglerna i ADR 0012, avsnitt 4. **Givet** att antalet spelare inte är känt (till exempel vid en fristående visning av övningen utan ett underlag), **då** visas skissens minsta gruppstorlek (basskissen), utan tillagda spelare.
6. **Givet** att en planskiss visas i normal storlek, **då** visas alltid en skriven teckenförklaring under eller bredvid skissen, med en utskriven benämning för varje objekt- och rörelsetyp som faktiskt förekommer i just den skissen (ADR 0012, avsnitt 3). Förklaringen är aldrig gömd bakom en stängd knapp och saknas aldrig när skissen visas i läsbar storlek. I miniatyrstorlek visas ingen teckenförklaring; miniatyren är klickbar för att öppna skissen i normal storlek med förklaringen.
7. **Givet** att appen visas i ljust respektive mörkt läge (`docs/design/designsystem.md`, avsnitt 1–2), **när** en planskiss visas, **då** använder skissen samma färgtema som resten av appen och förblir läsbar i båda lägena, utan att någon del av skissen förmedlas enbart genom en färgnyans (ADR 0012, avsnitt 5, `designsystem.md` avsnitt 8).
8. **Givet** att en planskiss visas, **då** har den ett tillgängligt namn och en textbeskrivning som en skärmläsare kan läsa upp (`title`, `desc` och `aria-labelledby`, ADR 0012 avsnitt 5). Den exakta texten ägs av ux-designern och fastställs i `docs/design/texter.md` – se *Beslut som behövs* om den öppna motsägelsen mellan `texter.md` avsnitt 8 och ADR 0012 avsnitt 5.
9. **Givet** att ett pass har sparats (berättelse 05), **när** en övnings skissdata i banken senare ändras, **då** visar det redan sparade passet fortfarande den planskiss som fanns när passet sparades (ögonblicksbild, `docs/adr/0003-datamodell.md`), inte en uppdaterad skiss.

## Beroenden

- Innehåll: kräver övningar med giltig `planskiss` i `content/ovningar/`, skrivna av övningsförfattaren och fotbollsfackligt granskade av fotbollsexperten (se `content/ovningar/README.md`). **Omfattningen som krävs för att den här berättelsen ska räknas som klar är inte beslutad, se *Beslut som behövs*.**
- Skissformatet, ritmotorn och felhanteringen: `docs/adr/0012-planskissformat.md`, beslutad vid K2. Formatet ägs av senior-systemutvecklare och planskissutvecklare.
- Hur skissen ska rymmas i varje vy, färger och lägen: `docs/design/designsystem.md`, avsnitt 1, 2, 7 och 8.
- Texter: `docs/design/texter.md`, avsnitt 8.
- 04 (byta ut en övning i passet) och 05 (spara ett pass), redan byggda i inkrement 1 – den här berättelsen fyller deras befintliga övningskort med en riktig planskiss i stället för en platshållare.

## Utanför denna berättelse

- Att ledaren själv ritar eller redigerar en planskiss (endast läsning i denna berättelse). Beslutat vid K2 (2026-09-12): ingen ritredigerare i version 1, så en egen övning (berättelse 13) saknar alltid planskiss och visas enligt kriterium 2 ovan.
- Att visa flera övningars planskisser samlat för ett helt pass (se berättelse 07).
- Storleksvarianten `planlage` (stor skiss, minst 70 % av skärmbredden, i genomförandeläget) – hör till berättelse 19–21 (inkrement 5, planläge med timer).
- Storleksvarianten `utskrift` (fast bredd cirka 45 mm, svart på vitt, i A4-layouten) – hör till berättelse 22 (inkrement 6, utskrift/PDF).
- Att visa planskisser i redaktörskön (berättelse 16, inkrement 4) – samma miniatyrformat återanvänds då, men redaktörskön finns inte ännu.
- Den exakta utformningen av "Planskiss saknas", "Planskissen kunde inte visas" och teckenförklaringens layout (ux-designerns ansvar, `docs/design/texter.md` och `designsystem.md`).

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-09-28 | Acceptanskriterierna skärpta inför K4 (bygget av inkrement 2, förarbete på `feature/planskisser-forarbete`). Tillagt: separat fallback för ogiltig skissdata (kriterium 3, skild från "saknas"), krav på skalning efter antal spelare när det är känt (kriterium 5), krav på teckenförklaring (kriterium 6), krav på att skissen följer appens ljusa/mörka läge (kriterium 7), krav på tillgänglig textbeskrivning (kriterium 8) och att ett sparat pass behåller sin ögonblicksbild av skissen (kriterium 9). Tydliggjort i kriterium 1 vilka vyer och storlekar som ingår, och i "Utanför denna berättelse" vilka storleksvarianter som hör till senare inkrement. Beroendeavsnittet utökat med hänvisningar till ADR 0012, designsystem.md och texter.md, och med en öppen fråga om hur stor del av bankens 58 övningar som behöver skissdata för att berättelsen ska räknas som klar – se produktägarens rapport från förarbetet. |
