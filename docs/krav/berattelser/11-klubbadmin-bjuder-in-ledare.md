Status: skärpt inför inkrement 3 (2026-10-13), väntar på godkännande (K4 inkrement 3). Tidigare: godkänd (K1, 2026-09-11)

# 11. Klubbadmin bjuder in ledare

**Roll:** klubbadmin

**Som** klubbadmin **vill jag** bjuda in ledare till mina lag, **så att** rätt personer får tillgång till lagets pass och övningar.

Markeringar: **[Oförändrat]**, **[Skärpt]** och **[Nytt]** som i berättelse 05. Se *Ändringar efter K1* sist.

## Acceptanskriterier

1. **[Skärpt]** **Givet** att klubbadmin är inne på ett lag, **när** klubbadmin bjuder in en person via e-post, **då** får personen ett mejl med en inbjudan att skapa konto eller logga in och koppla sig till laget, och inbjudan syns i lagets ledarlista som "Inbjuden, väntar på svar". Mejlet säger vilket lag och vilken klubb inbjudan gäller och nämner inbjudarens namn (UX-rekommendation godkänd 2026-10-13). **[Skärpt 2026-10-13, S-48]** Mejlet anger också vem som är ansvarig för uppgifterna, ändamålet och lagringstiden, och länkar till integritetspolicyn. Policyn ska finnas innan den första riktiga inbjudan skickas. Klubbadmin kan i stället kopiera inbjudningslänken och skicka den på annat sätt (ADR 0004 punkt 4). Båda vägarna ger en inbjudan som är bunden till den angivna e-postadressen.
2. **[Skärpt]** **Givet** att en inbjuden person accepterar inbjudan, **då** får personen tillgång till det laget, men inte till klubbens övriga lag om personen inte också bjudits in dit. Personen blir också medlem i klubben, utan att bli klubbadmin. **Test:** med en klubb som har två lag ser den inbjudna bara det ena lagets pass, och direkta anrop mot det andra lagets pass ger noll rader. Accepterandet sker bara med en funktion som kontrollerar token och e-postadress (ADR 0004).
3. **[Skärpt]** **Givet** att klubbadmin vill ta bort en ledares åtkomst till ett lag, **när** klubbadmin gör det och bekräftar ("Ta bort {namn} från {lagnamn}? Personen behåller sitt konto och det som inte enbart hör till laget."), **då** förlorar ledaren åtkomst till lagets material, men behåller sitt eget konto och de sparade pass/egna övningar som inte enbart hör till det laget. Lagets pass finns kvar för kvarvarande ledare (berättelse 12, kriterium 3). Ledaren är kvar som medlem i klubben så länge hen har andra lag eller är klubbadmin. **Test:** (a) efter borttagningen ger direkta anrop mot lagets pass noll rader för den borttagna, (b) hens personliga pass är kvar, (c) **den lokala kopian** av lagets pass på hens enhet är borta efter nästa gång appen får kontakt med servern (ADR 0005, S-12). Mellan borttagningen och nästa kontakt kan kopian ligga kvar; det är en känd restrisk som användaren godtog 2026-10-13 (jämför berättelse 27), och texterna ska vara ärliga om den.
4. **[Nytt]** **Givet** att en inbjudan har skickats, **då** gäller den i 14 dagar. **Givet** att den har gått ut, har återkallats eller redan har använts, **när** någon öppnar länken, **då** visas ett begripligt besked om det, och ingen kopplas till laget. En inbjudan kan bara användas en gång.
5. **[Nytt]** **Givet** att inbjudan är bunden till en e-postadress, **när** någon som är inloggad med en annan adress öppnar länken, **då** kopplas ingen till laget och personen får veta att inbjudan gäller en annan adress. En vidarebefordrad länk fungerar alltså bara för den som har tillgång till den inbjudna adressen (jämförelsen ignorerar versaler). **Test:** konto med adress A öppnar inbjudan till adress B och nekas.
6. **[Nytt]** **Givet** att inbjudningslänken öppnas, **då** ligger nyckeln i URL-fragmentet (`/inbjudan#...`) och inte i frågesträngen, och den tas bort ur adressfältet direkt efter att appen läst den (S-14, ADR 0004). **Test:** (a) efter inläsning innehåller `location` och webbläsarhistoriken ingen nyckel, (b) inga anrop till andra servrar bär nyckeln eller `Referer` med den, (c) svarshuvudet `Referrer-Policy: no-referrer` finns (berättelse 28). Nyckeln är minst 128 bitar slumpmässig och bara dess hash lagras.
7. **[Nytt]** **Givet** att någon provar många felaktiga nycklar, **när** ett fastställt antal misslyckade försök är nått för samma inloggade konto (gränsen gäller per konto så att inga IP-adresser behöver lagras, S-53; en kort ny ADR ersätter "per IP" i ADR 0004), **då** nekas fler försök under en tid, med ett begripligt besked. Antalet och tiden fastställs av senior-systemutvecklare och dokumenteras så att testet kan pröva dem (S-14).
8. **[Nytt]** **Givet** att klubbadmin vill dra tillbaka en inbjudan som inte har accepterats, **när** klubbadmin återkallar den, **då** går länken inte längre att använda och raden försvinner ur ledarlistan.
9. **[Nytt]** **Givet** att klubben har skickat 50 inbjudningsmejl under det senaste dygnet, **när** klubbadmin försöker skicka ett till, **då** nekas det med ett begripligt besked, och ingen e-post skickas (ADR 0004 punkt 6). Att kopiera länken räknas inte som utskick.
10. **[Nytt]** **Givet** att en inbjudan accepteras, har gått ut eller har återkallats, **då** tas den inbjudnas e-postadress bort från inbjudan: direkt vid accepterande, och senast 30 dagar efter att den gått ut eller återkallats (ADR 0003, ADR 0004 punkt 5, berättelse 29).
11. **[Nytt]** **Givet** att en klubbadmin bjuder in en adress, **då** visar svaret aldrig om adressen redan har ett konto. Bara klubbadmin med behörighet kan skapa en inbjudan, och bara för sin egen klubbs lag (en klubbadmin i klubb A kan inte bjuda in till klubb B:s lag). **Test:** direkta anrop till funktionen för utskick som vanlig ledare eller som klubbadmin i en annan klubb nekas.
12. **[Nytt]** **Givet** att nätet saknas, **när** klubbadmin bjuder in, återkallar eller tar bort en ledare, **då** visas kravet på anslutning och det som skrivits ligger kvar.

13. **[Nytt 2026-10-13, S-52]** **Givet** att en inbjudan skapas, **då** sätts fältet för vem som bjöd in av databasen till den inloggade personen och kan inte sättas till någon annan. Detsamma gäller vem som lade till en medlem. **Test:** ett test per tabell.

## Beroenden

- 08 (registrera konto och logga in), 10 (klubbadmin hanterar lag).
- 28 (databasens skydd och gränser).
- Förutsätter att Brevo är uppsatt (se backlogens översikt för inkrement 3) och att säkerhetsagenten har granskat Brevos personuppgiftsbiträdesavtal och lagringsort innan riktiga e-postadresser skickas dit.

## Utanför denna berättelse

- Att en ledare själv ska kunna begära att gå med i ett lag utan inbjudan.
- Att sätta olika behörighetsnivåer bland ledare inom samma lag – i version 1 har alla ledare i ett lag samma rättigheter till lagets material.
- Att bjuda in någon som klubbadmin. Det görs genom att en befintlig medlem utses (berättelse 09, kriterium 4).
- Att skicka inbjudningar till flera adresser på en gång.
- Att skicka om en inbjudan automatiskt. Klubbadmin kan återkalla och bjuda in igen.

## Ändringar efter K1

| Datum | Ändring |
|---|---|
| 2026-10-13 | Skärpt inför inkrement 3 mot ADR 0003 och 0004 och säkerhetsgranskning K2. Kriterium 1–3 preciserade och gjorda testbara; kriterium 3 kompletterat med den lokala kopian på ledarens enhet. Nya kriterier 4–12: giltighetstid och engångsbruk, bundenhet till e-postadressen, nyckeln i fragmentet (S-14), gräns för felaktiga försök, återkallande, dygnsgräns för utskick, rensning av e-postadressen, att inbjudan inte röjer om ett konto finns, och kravet på nät. |
| 2026-10-13 (beslut och säkerhetsgranskning) | Kriterium 1: mejlet nämner inbjudaren och ger information enligt artikel 14 (S-48). Kriterium 7: gräns per konto (S-53). Nytt 13 (S-52). |
