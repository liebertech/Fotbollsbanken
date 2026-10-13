Status: skärpt inför inkrement 3 (2026-10-13), väntar på godkännande (K4 inkrement 3). Tidigare: godkänd (K2, 2026-09-12)

# 27. Logga ut på alla enheter

**Roll:** ledare, klubbadmin, redaktör

**Som** inloggad person **vill jag** kunna logga ut från alla enheter samtidigt, **så att** jag kan avbryta åtkomsten till mitt konto om en telefon eller annan enhet där jag varit inloggad blir borttappad, stulen eller hamnar i orätta händer.

> **Obs:** användaren beslutade vid K2 (2026-09-12) att flytta detta från backloggen till Must i version 1, efter att senior systemutvecklare och säkerhetsagenten invänt mot att lägga det i backloggen: utan funktionen har ledaren ingen väg alls att avbryta åtkomsten från en borttappad telefon, eftersom sessionen inte kan tidsbegränsas på gratisnivån och en vanlig utloggning bara rör den enhet den görs på. Se säkerhetsgranskning K2, fynd S-11 (`docs/sakerhet/granskning-k2.md`).

Markeringar: **[Oförändrat]**, **[Ändrat]**, **[Skärpt]** och **[Nytt]** som i berättelse 05. Se *Ändringar efter K2* sist.

## Acceptanskriterier

1. **[Skärpt]** **Givet** att en person är eller kan ha varit inloggad på fler än en enhet, **när** personen väljer att logga ut från alla enheter (från *Mitt konto*, på vilken enhet som helst där personen är inloggad, och skilt från den vanliga utloggningen), **då** återkallas omedelbart alla personens inloggningar, inklusive den enhet som används just nu, som loggas ut direkt och får sin lokala kopia (cache och utkast) rensad. **Test:** med två webbläsarsessioner för samma konto loggas båda ut av åtgärden i den ena, och den enhet där åtgärden görs visar inloggningssidan och har ingen personlig data kvar i lagringen.
2. **[Ändrat]** **Givet** att alla enheter har loggats ut på detta sätt, **när** en tidigare inloggad enhet, till exempel den borttappade telefonen, försöker förnya sin inloggning eller hämta data, **då** avvisas den, och en ny inloggning (ny engångskod till e-post, se berättelse 08) krävs innan kontot går att använda igen där. Enheten loggas ut **senast när dess åtkomstnyckel går ut, inom en timme** (ADR 0004: nyckeln gäller i en timme och förnyelsen nekas); under den tiden kan servern fortfarande svara på anrop som redan har en giltig nyckel. Så snart enheten får kontakt med servern rensas dess lokala kopia. *Ändringen:* det tidigare "nästa gång den försöker använda appen" gav intryck av omedelbar verkan på andra enheter, vilket ADR 0004 inte lovar. **Test:** efter åtgärden nekas den andra sessionens förnyelse, och den andra sessionens hämtningar nekas senast efter att nyckelns giltighetstid gått ut (i testet med en kort giltighetstid). Användaren godtog fördröjningen på upp till en timme 2026-10-13; senior-systemutvecklare undersöker om tiden kan kortas på gratisnivån, och kriteriet skärps i så fall.
3. **[Oförändrat]** **Givet** att personen bara vill avsluta sin egen, aktuella session, **när** personen istället väljer en vanlig utloggning, **då** påverkas inte andra enheters inloggningar – detta skiljer den vanliga utloggningen från "logga ut på alla enheter". **Test:** i två sessioner loggar utloggning i den ena inte ut den andra.
4. **[Ändrat]** **Givet** att personen har valt att logga ut från alla enheter, **när** åtgärden har genomförts, **då** bekräftar appen tydligt att åtgärden är gjord för alla enheter, utan att påstå att andra enheter redan är stängda ute i samma ögonblick: texten säger att alla enheter loggas ut och att en enhet som är utan nät eller inte används kan ligga kvar en kort stund (högst en timme). Bekräftelsen syns på inloggningssidan som personen kommer till. **[Skärpt 2026-10-13, UX-rekommendation godkänd]** Innan åtgärden genomförs ber appen om bekräftelse i en dialog. *Ändringen:* det tidigare "bekräftar att alla enheter är utloggade" stämmer inte med kriterium 2. Texten saknas i `texter.md` och beställs av ux-designern.
5. **[Nytt]** **Givet** att nätet saknas, **när** personen väljer att logga ut på alla enheter, **då** visas att åtgärden kräver anslutning, ingen enhet loggas ut och ingenting påstås vara gjort. Den egna enhetens lokala kopia rensas inte heller och sessionen finns kvar tills åtgärden har lyckats (annars skulle personen tro att den borttappade telefonen är stängd ute). **Test:** med nätet avstängt ger åtgärden felet och personen är kvar inloggad.
6. **[Nytt]** **Givet** att personen väljer "Logga ut på alla enheter", **då** är knappen skild från den vanliga "Logga ut" och ligger i vyn *Mitt konto* (`docs/design/skisser/15-radera-konto.md`), så att den inte trycks av misstag i stället för en vanlig utloggning. Åtgärden är tillgänglig för alla tre roller.

7. **[Nytt 2026-10-13, S-57, beslut 7]** **Givet** att åtkomstnyckeln bär ett sessions-id, **när** databasen prövar behörighet, **då** prövas i delsteg 3b om en hjälpfunktion i åtkomstreglerna kan kräva att sessionen finns kvar, så att en utloggad enhet (och ett raderat kontos nyckel) stängs ute från databasen direkt i stället för efter högst en timme. Kostnaden mäts. Behålls kontrollen skrivs en ny ADR, och kriterium 2 skärps då till omedelbar verkan mot databasen. **Test (om den behålls):** efter åtgärden ger den andra sessionens anrop noll rader omedelbart.

## Beroenden

- 08 (registrera konto och logga in).
- 28 (cacherensningen och sessionshanteringen prövas också där).

## Utanför denna berättelse

- Att se en lista över vilka enheter eller platser som är inloggade. Version 1 innehåller bara den samlade åtgärden "logga ut alla", ingen enhetsöversikt.
- Automatisk tidsbegränsning av sessioner – inte möjligt på gratisnivån (säkerhetsgranskning K2, fynd S-11). "Logga ut på alla enheter" är den funktion som ersätter det i version 1.
- Att fjärrradera data på en enhet utan kontakt med servern. En enhet som aldrig får nät behåller sin lokala kopia tills den får det (restrisk, se rapporten, punkt 7).

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-10-13 | Skärpt och rättat inför inkrement 3 mot ADR 0004 och 0005. Kriterium 2 och 4 ändrade: ADR 0004 ger andra enheter en fördröjning på högst en timme, och bekräftelsetexten får inte påstå mer än så. Kriterium 1 preciserat med rensning av den egna enhetens kopia. Nytt kriterium 5 om att åtgärden kräver nät och inte får se ut att ha lyckats, och 6 om placeringen i *Mitt konto*. Kriterium 3 är oförändrat. |
| 2026-10-13 (beslut och säkerhetsgranskning) | Kriterium 4: dialog före åtgärden. Nytt kriterium 7 (S-57: sessionskontroll i åtkomstreglerna prövas i 3b). |
