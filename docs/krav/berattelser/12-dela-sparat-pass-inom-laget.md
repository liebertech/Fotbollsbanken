Status: skärpt inför inkrement 3 (2026-10-13), väntar på godkännande (K4 inkrement 3). Tidigare: godkänd (K1, 2026-09-11)

# 12. Dela sparat pass inom laget

**Roll:** ledare

**Som** ledare **vill jag** att pass jag sparar för mitt lag syns för andra ledare i samma lag, **så att** vi kan samarbeta om planeringen utan att skicka filer till varandra.

Markeringar: **[Oförändrat]**, **[Skärpt]** och **[Nytt]** som i berättelse 05. Se *Ändringar efter K1* sist.

## Acceptanskriterier

1. **[Skärpt]** **Givet** att flera ledare är kopplade till samma lag, **när** en av ledarna sparar ett pass för laget (genom att välja laget i dialogen "Spara pass", förvalt till det senast använda laget), **då** kan de andra ledarna i laget se och öppna passet under lagets flik i listan över sparade pass, med uppgift om vem som sparade det ("Sparat av {namn}"). **Test:** med två ledare i samma lag syns passet för båda efter en uppdatering av listan, och hos ledaren som sparade står "Sparat av dig".
2. **[Skärpt]** **Givet** att en ledare sparar ett pass utan att koppla det till ett lag (till exempel innan ledaren har något lag, eller genom att välja bort laget), **då** är passet bara synligt för ledaren själv, och inte heller för klubbadmin eller andra ledare i klubben. Texten i dialogen säger det: "Sparas bara för dig, tills du kopplar det till ett lag." **Test:** direkta anrop från en annan ledare i klubben ger noll rader.
3. **[Skärpt]** **Givet** att en ledare inte längre är kopplad till ett lag (berättelse 11, kriterium 3), **när** ledaren tidigare har sparat pass för laget, **då** finns passen kvar för de kvarvarande ledarna i laget, men ledaren som lämnat ser dem inte längre bland sitt lags pass, och laget finns inte kvar som flik. Passen visar för de kvarvarande ledarna en neutral text som "Sparat av en tidigare ledare" i stället för namnet, eftersom den som lämnat inte längre delar lag med dem (personer ser bara namn på de i samma lag, ADR 0003, S-16). **Test:** (a) den som lämnat får noll rader vid direkt anrop, (b) kvarvarande ledare ser passet, (c) ingen visning avslöjar namnet på den som lämnat.
4. **[Nytt]** **Givet** att en ledare är ledare i lag A men inte i lag B i samma klubb, **när** ledaren tittar bland sparade pass, **då** ser ledaren aldrig lag B:s pass, och inte klubbens övriga ledares personliga pass (berättelse 11, kriterium 2; ADR 0003). **Test:** med två klubbar och två lag i en av dem ger direkta anrop noll rader för allt som ligger utanför ledarens egna pass och egna lag.
5. **[Nytt]** **Givet** att ledaren är ledare i flera lag, **när** passet sparas, **då** kan ledaren välja vilket lag passet delas med, och passet hör till ett lag (eller inget), aldrig till flera.
6. **[Nytt, Should]** **Givet** att ett sparat pass är personligt, **när** ledaren kopplar det till ett lag ledaren själv är med i, **då** blir passet synligt för lagets ledare. Ledaren kan inte koppla ett pass till ett lag hen inte är med i, och kan inte flytta ett lagpass till ett annat lag eller göra det personligt (flytt av ägarskap kräver skydd i databasen, ADR 0003 princip 8). Beslutat av användaren 2026-10-13 (Should). Ingen skiss beskriver ännu hur det görs; ux-designern ritar det.
7. **[Nytt]** **Givet** att ett lag är arkiverat (berättelse 10, kriterium 3), **när** ledare i laget sparar nya pass, **då** går laget inte att välja. Redan sparade pass raderas inte av arkiveringen och kan läsas och skrivas ut under fliken "Arkiverade lag" (berättelse 10, kriterium 3) tills rensningen; de kan inte sparas om eller kopplas till något nytt.
8. **[Nytt]** **Givet** att en ledare i laget tar bort ett lagpass (berättelse 05, kriterium 13), **då** försvinner det för alla i laget och rensas hårt efter 90 dagar. Alla ledare i laget får ta bort lagets pass, även andras (användarens beslut 2026-10-13). Appen ber om en bekräftelse som säger att passet försvinner för alla i laget.

9. **[Nytt 2026-10-13, S-52]** **Givet** att ett pass sparas, **då** sätts fältet för vem som sparade det av databasen till den inloggade personen och kan inte sättas till någon annan.
10. **[Nytt 2026-10-13, S-51]** **Givet** att ett lagpass har tagits bort, **när** en annan ledare i laget frågar efter det direkt mot databasen, **då** ger anropet noll rader, och passet saknas i andra ledares lokala kopia efter nästa synk.

## Beroenden

- 05 (spara ett pass), 10 (klubbadmin hanterar lag), 11 (klubbadmin bjuder in ledare).
- 26, kriterium 2 (avidentifiering av den som sparat passet när kontot raderas).
- 28 (databasens skydd och gränser).

## Utanför denna berättelse

- Att markera vem som senast ändrade ett delat pass (se backlog, Could).
- Samtidig redigering av samma pass av flera ledare i realtid.
- Kommentarer på ett delat pass.
- Att klubbadmin läser lagets pass utan att vara ledare i laget (ADR 0003: minsta behörighet).
- Läsning av delade pass utan nät. Cachen byggs i det här inkrementet (berättelse 08, kriterium 10), men testerna utan nät hör enligt ADR 0005 till inkrement 5.

## Ändringar efter K1

| Datum | Ändring |
|---|---|
| 2026-10-13 | Skärpt inför inkrement 3 mot ADR 0003, skiss 05 och säkerhetsgranskning K2 (S-16). Kriterium 1–3 preciserade och gjorda testbara; kriterium 3 kompletterat så att namnet på den som lämnat laget inte visas. Nya kriterier 4–8: avgränsning mot andra lag i klubben, val av lag, koppling i efterhand (Should, väntar på beslut), arkiverade lag och borttagning av lagpass. |
| 2026-10-13 (beslut och säkerhetsgranskning) | Kriterium 7: arkiverade lags pass läsbara och utskrivbara. Nya 9 (S-52) och 10 (S-51). |
