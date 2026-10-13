Status: skärpt inför inkrement 3 (2026-10-13), väntar på godkännande (K4 inkrement 3). Tidigare: ändrad vid K2 (2026-09-12)

# 10. Klubbadmin hanterar lag

**Roll:** klubbadmin

**Som** klubbadmin **vill jag** skapa och redigera lag inom min klubb, **så att** ledare kan kopplas till rätt lag utifrån ålder och spelform.

Markeringar: **[Oförändrat]**, **[Skärpt]**, **[Ändrat]** och **[Nytt]** som i berättelse 05. Se *Ändringar efter K2* sist.

## Acceptanskriterier

1. **[Skärpt]** **Givet** att klubbadmin är inne i sin klubb, **när** klubbadmin skapar ett lag med namn och ålder (och vid behov spelform, som annars föreslås enligt `docs/doman/spelformer.md`), **då** finns laget listat under klubben med namn, ålder, spelform och antal ledare. Spelformen föreslås utifrån åldern och kan ändras fritt (ett lag kan spela en annan spelform än den vanliga, `docs/design/skisser/13-klubbadmin-lag.md`). Namn och ålder är obligatoriska. Åldern är den ålder spelarna fyller under det aktuella kalenderåret (R-010) och ligger inom samma intervall som generatorns underlag tillåter (berättelse 01).
2. **[Oförändrat]** **Givet** att ett lag finns, **när** klubbadmin redigerar lagets uppgifter, **då** uppdateras uppgifterna för alla som är kopplade till laget.
3. **[Skärpt]** **Givet** att ett lag inte längre används, **när** klubbadmin arkiverar laget, **då** tas det bort från de aktiva listorna och kan inte längre väljas för nya pass, och klubbadmin varnas i förväg om att laget har sparade pass (och, när berättelse 23 är byggd, en säsongsplan) kopplade till sig, med exakt antal, innan arkiveringen bekräftas. Varningen säger också att laget och dess pass finns kvar i 24 månader och därefter raderas (berättelse 29, kriterium 2; beslutat av användaren 2026-10-13). Klubbadmin ser antalet pass utan att kunna läsa dem (se kriterium 7). **Test:** (a) ett lag med 6 pass visar "6" i varningen, (b) efter bekräftelse finns laget inte i listan över aktiva lag och går inte att välja i dialogen "Spara pass", (c) passen är inte raderade. (d) varningen nämner 24 månader. Hur lagets pass nås under de 24 månaderna avgörs av ux-designern.
4. **[Oförändrat]** **Givet** att klubbadmin skriver lagets namn, **när** klubbadmin skriver, **då** upplyser appen om att namnet inte bör innehålla en spelares namn, eftersom lagnamnet syns för hela klubben och i alla pass som skapas för laget (säkerhetsgranskning K2, fynd S-20).
5. **[Nytt]** **Givet** att klubbadmin ger laget ett namn som är längre än 100 tecken, **när** klubbadmin försöker spara, **då** nekas det med ett tydligt fel som anger gränsen, och databasen upprätthåller gränsen (ADR 0003 princip 9).
6. **[Nytt]** **Givet** att laget sparas, **då** sparas lagets ålder så att den följer kalenderåret: ett lag som skapas som 11-åringar 2026 visar 12 år under 2027 utan att någon ändrar något (ADR 0003, lagets årgång; R-010). **Test:** med en styrd klocka visas rätt ålder före och efter årsskiftet. **Beslut som behövs:** fotbollsexperten bekräftar att det stämmer med R-010 och R-113, se rapporten, punkt 13.
7. **[Nytt]** **Givet** att en person är ledare i ett lag men inte klubbadmin, **när** personen försöker skapa, redigera eller arkivera ett lag, **då** nekas det, och knapparna för det visas inte. **Givet** att klubbadmin inte själv är ledare i ett visst lag, **då** kan klubbadmin se laget, dess ledare och antalet pass, men inte öppna lagets pass eller säsongsplan (ADR 0003, behörighetstabellen, minsta behörighet, berättelse 11 kriterium 2). **Test:** direkta anrop mot databasen som klubbadmin till lagets pass ger noll rader, och som vanlig ledare nekas skrivning mot lagtabellen.
8. **[Nytt]** **Givet** att nätet saknas, **när** klubbadmin skapar, ändrar eller arkiverar ett lag, **då** visas kravet på anslutning och det som skrivits ligger kvar (`texter.md` avsnitt 15).

## Beroenden

- 09 (klubbadmin skapar klubb).
- 28 (databasens skydd och gränser).

## Utanför denna berättelse

- Att flytta ett lag mellan klubbar.
- Detaljerad historik/logg över ändringar i lagets uppgifter (se backlog, Could).
- Att återställa (avarkivera) ett arkiverat lag – inte ett krav i version 1.
- Att ta bort ett lag direkt och permanent. Arkivering är den enda vägen, och rensningen sker enligt berättelse 29.
- Säsongsplanen (inkrement 7). Varningen i kriterium 3 nämner den först när den finns.

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-10-13 | Skärpt inför inkrement 3. Kriterium 1 och 3 gjorda testbara och rättade mot ADR 0003 ("tar bort eller arkiverar" blev arkiverar; varningen säger också hur länge materialet finns kvar). Nya kriterier 5–8: längdgräns, lagets ålder som följer kalenderåret, att bara klubbadmin ändrar lag och att klubbadmin inte automatiskt läser lagets pass, samt kravet på nät. Kriterium 2 och 4 är oförändrade. |
