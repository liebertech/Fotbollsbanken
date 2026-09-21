Status: utkast (ändring inför K4, 2026-09-21)

# 02. Generera ett träningspass

**Roll:** ledare

**Som** ledare **vill jag** att appen sätter ihop ett komplett träningspass av övningar som passar mitt underlag, **så att** jag slipper leta och kombinera övningar själv.

## Acceptanskriterier

1. **Givet** att ledaren har fyllt i giltigt underlag (se berättelse 01) och det finns tillräckligt många godkända övningar som matchar, **när** ledaren begär att generera passet, **då** visar appen ett förslag på träningspass uppbyggt enligt delarna i `docs/doman/passuppbyggnad.md`, som hamnar inom den tillåtna marginalen för den begärda passlängden (R-030 till R-036).
2. **Givet** att passet genereras, **då** innehåller varje övning i passet minst namn, syfte, beskrivning och tilldelad tid, och är märkt med vilken av passets delar den hör till: `del-uppvarmning`, `del-ovning`, `del-spelovning`, `del-spel` eller `del-avslutning` (R-028, `docs/doman/passuppbyggnad.md`).
3. **Givet** att ledaren har angett 1 ledare, **när** passet genereras, **då** innehåller passet inga stationer. En ensam ledare kan ha flera självgående grupper som gör samma övning sida vid sida (övningar med ledarbehov 0); det räknas inte som stationer (R-055, R-060).
4. **Givet** att ledaren har angett fler än 1 ledare, **när** passet genereras, **då** kan passet innehålla ett stationsmoment i `del-ovning` eller `del-spelovning`, med mellan 2 och 4 stationer, aldrig fler än antalet angivna ledare (R-060, R-061).
5. **Givet** att antalet angivna spelare är lägre än det minsta antal en övning kräver, **när** passet genereras, **då** väljs inte den övningen (R-053).
6. **Givet** att antalet angivna spelare är högre än det största antal en övning stödjer i en grupp, **när** passet genereras, **då** delas spelarna i flera grupper som gör övningen samtidigt, enligt reglerna för antal grupper och ledarbehov i `docs/doman/generatorregler.md` (R-050 till R-052, R-055). Om ingen giltig gruppindelning går att göra väljs övningen inte.
7. **Givet** att antalet spelare är udda, **när** appen sätter ihop grupperna för en övning, **då** hanteras det udda antalet enligt övningens grupptyp: ingen åtgärd för `fri`, en trio i stället för ett par för `par`, en joker eller övningens egen anpassning för `tva-lag`, och för `fast-storlek` bara om övningen har en beskriven lösning för udda antal (R-054). Bara en övning med grupptypen `fast-storlek` kan väljas bort enbart på grund av udda antal.
8. **Givet** att summan av de valda övningarnas tider inte exakt motsvarar den begärda passlängden, **när** appen sätter ihop passet, **då** hamnar varje dels tid inom 3 minuter från sin måltid, och passets totala tid inom 5 minuter kortare än den begärda längden, men aldrig längre (R-035, R-036), och appen visar passets faktiska totala tid. **Givet** att en del saknar övning, **då** gäller inte gränsen för passets totala tid (R-036), men varje del som har ett moment ligger ändå inom 3 minuter från sin måltid (R-035); se berättelse 03 för hur den tomma delen visas (R-039).
9. **Givet** att ledaren har valt en nivå, **när** passet genereras, **då** innehåller passet bara övningar vars nivålista innehåller den valda nivån. Övningar från angränsande nivåer väljs aldrig, även om det innebär att en del inte kan fyllas (R-025, R-026).
10. **Givet** att ledaren har valt ett eller flera fokusområden, **när** passet genereras, **då** träffar varje övning i `del-ovning` och `del-spelovning` minst ett av de valda fokusområdena (R-041). Övningar i `del-uppvarmning` och `del-spel` bör också träffa valt fokus, men det är inte ett krav (R-045, R-046).
11. **Givet** att övningsbanken innehåller övningar med olika status, **när** passet genereras, **då** används bara övningar med status `godkand` (R-022).
12. **Givet** att ledaren har angett en yta, **när** passet genereras, **då** används bara moment vars övningar får plats på den angivna ytan enligt `docs/doman/generatorregler.md` (R-090 till R-094). Har ledaren inte angett någon yta påverkar ytan inte vilka övningar som väljs.
13. **Givet** att antalet spelare är fler än antalet ledare gånger taket per ledare för åldersfasen (se `docs/doman/passuppbyggnad.md`), **när** passet genereras, **då** genereras passet ändå, och appen visar ett tips om att ta hjälp av fler vuxna (R-021).
14. **Givet** att ledaren är 13 år eller äldre, **när** passet genereras, **då** är den sammanlagda tiden för alla övningar i passet som har `nickspel` bland sina fokusområden högst 10 minuter för åldersfasen 13–14 år och högst 20 minuter för åldersfasen 15–19 år (R-082). Taket gäller oavsett hur många sådana övningar som annars skulle matcha, och oavsett om `nickspel` är övningens huvudfokus eller inte – alltså även för en övning som valts in för ett annat fokus men som är märkt med `nickspel` (R-081).
15. **Givet** att någon övning i passet har mål i sitt material, **då** visar appen en påminnelse om att alla mål ska vara förankrade så att de inte kan välta. **Givet** att passet genereras, **då** visar appen alltid en påminnelse om benskydd, eftersom Spel alltid innehåller närkamper (R-084, R-085).
16. **Givet** att en del inte kan fyllas med en övning som träffar valt fokus, **då** prövar appen först fallbacken på ett närliggande fokusområde för just den delen (berättelse 03, kriterium 5–7) innan delen visas som att övning saknas. **Givet** att inga övningar alls matchar underlaget för en del, varken med valt fokus eller efter fallbacken, **då** hanteras det enligt berättelse 03, inte genom att visa ett tomt eller felaktigt pass.

## Beroenden

- 01 (ange underlag och spelform).
- 03 (inget matchande resultat), för fallbacken på närliggande fokusområde som kriterium 16 hänvisar till.
- Innehåll: kräver att det finns godkända övningar i banken som matchar olika kombinationer av ålder, spelform, nivå, spelarantal och fokusområde (se `content/ovningar/`).

## Utanför denna berättelse

- Att rendera planskisser grafiskt (kommer med inkrement 2, se berättelse 06–07). I inkrement 1 räcker det att passet visas med text.
- Att byta ut en enskild övning i efterhand (se berättelse 04).
- Att spara passet (se berättelse 05).
- Att förklara för ledaren varför just en viss övning valdes framför en annan (möjlig förbättring, se backlog).
- Att ge olika kombinationer av övningar vid upprepad generering med samma underlag (algoritmval, ägs av senior-systemutvecklare).
- Att ta hänsyn till tillgängligt material (bollar, koner, mål) – ingår inte i version 1 (se backlog).

## Ändringar efter K1

| Datum | Ändring |
|---|---|
| 2026-09-21 | Kriterium 16 kompletterat med en hänvisning till fallbacken på närliggande fokusområde (se berättelse 03, kriterium 5–7). Innehållet i kriteriet är i övrigt oförändrat. |
