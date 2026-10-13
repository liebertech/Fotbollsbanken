Status: skärpt inför inkrement 3 (2026-10-13), väntar på godkännande (K4 inkrement 3). Tidigare: ändrad vid K2 (2026-09-12)

# 08. Registrera konto och logga in

**Roll:** ledare, klubbadmin

**Som** ledare eller klubbadmin **vill jag** kunna skapa ett konto och logga in, **så att** mina sparade pass och min klubbs/lags material är knutna till mig.

Inloggningen sker med en engångskod via e-post, utan lösenord (`docs/adr/0004-inloggning.md`). Markeringar: **[Oförändrat]**, **[Skärpt]**, **[Ändrat]** och **[Nytt]** som i berättelse 05. Se *Ändringar efter K2* sist.

## Acceptanskriterier

1. **[Skärpt]** **Givet** att en person inte har något konto, **när** personen registrerar sig med namn och e-post och skriver in koden som skickats, **då** skapas ett konto knutet till den e-postadressen och personen är inloggad. Kontot skapas först när koden är bekräftad. Namnet är obligatoriskt (en tom eller bara blanksteg ger felet "Fyll i namn för att fortsätta") och är högst 100 tecken.
2. **[Skärpt]** **Givet** att en person har ett konto, **när** personen loggar in med e-post och rätt kod, **då** får personen tillgång till sina sparade pass och sin klubbs och sina lags material. **Givet** att personen därefter stänger och öppnar appen igen på samma enhet utan att ha loggat ut, **då** är personen fortfarande inloggad och behöver ingen ny kod (ADR 0004 punkt 5).
3. **[Ändrat]** **Givet** att fel kod, en utgången kod, en redan använd kod eller en ogiltigförklarad kod anges, **när** personen försöker logga in, **då** visas ett tydligt felmeddelande, fältet töms och personen loggas inte in. De fyra fallen har egna texter där de går att skilja åt (`texter.md` avsnitt 2). *Ändringen:* kriteriet hette tidigare "fel inloggningsuppgifter" och kunde läsas som att även en okänd e-postadress ska få ett felmeddelande. Det strider mot beslutet vid K2 (punkt 9) och kriterium 7 nedan. Kriteriet gäller koden, aldrig adressen.
4. **[Skärpt]** **Givet** att en person är inloggad, **när** personen loggar ut, **då** krävs inloggning igen innan personen kan se sina sparade pass eller sin klubbs material, och den lokala kopian på enheten (IndexedDB-cachen och osparade utkast) är raderad. **Test:** logga ut, kontrollera att lagringen på enheten inte längre innehåller pass, övningar eller andra personers namn, och att tillbaka-knappen i webbläsaren inte visar något av det. Utloggningen påverkar inte andra enheter (se berättelse 27, kriterium 3).
5. **[Oförändrat]** **Givet** att ett nytt konto skapas, **då** lagras bara de personuppgifter som krävs för kontot (till exempel namn och e-post för ledaren själv), och inga uppgifter om spelare samlas in vid registreringen.
6. **[Oförändrat]** **Givet** att appen skickar en inloggningskod till den angivna e-postadressen, **när** koden är skickad, **då** upplyser appen om att koden kan hamna i skräpposten, eftersom mejlen skickas från en delad avsändaradress (ingen egen domän i version 1, se backlog).
7. **[Nytt]** **Givet** att någon anger en e-postadress i inloggningsvyn, **när** personen trycker på "Skicka kod", **då** svarar appen likadant och går vidare till kodsteget oavsett om adressen har ett konto eller inte: "Om adressen finns hos oss har vi skickat en kod." (S-13, beslut vid K2 punkt 9). **Test:** svarets text, vyn och svarstiden (inom rimlig marginal) skiljer sig inte mellan en känd och en okänd adress, och en okänd adress får inget konto skapat vid inloggning (`shouldCreateUser: false`). Registrering (med namn) och inloggning är två skilda flöden.
8. **[Nytt]** **Givet** att inloggningskoder beställs och prövas, **då** gäller följande gränser, **verifierade mot det faktiska Supabase-projektet och inte bara mot dokumentationen** (ADR 0004 punkt 3, S-18): (a) koden gäller i högst 10 minuter, (b) högst 5 försök per kod, därefter är koden ogiltig och ett nytt försök med den nekas, (c) en ny kod ogiltigförklarar den förra, (d) minst 60 sekunder mellan beställningar till samma adress, och knappen visar nedräkningen som text, (e) kodlängden är 8 siffror om Supabase tillåter det, annars 6 (användarens beslut 2026-10-13; ux-designern uppdaterar skiss 14 och texterna), och fältets etikett, `autocomplete="one-time-code"` och texterna visar rätt antal, (f) Supabase Auths gräns för mejl per timme är satt till 100. **Test:** ett automatiserat test för (b), (c) och (d) mot den lokala eller staging-miljön. Värdena för (a) och (f) och möjligheten till (e) redovisas i en kort lista med skärmdump eller utdrag ur projektets inställningar, som kvalitetssäkraren kan kontrollera.9. **[Nytt]** **Givet** att kodbeställningen är skyddad av Cloudflare Turnstile, **när** Turnstile inte har godkänt besökaren, **då** går "Skicka kod" inte att genomföra och servern avvisar beställningen även om knappen kringgås. **Givet** att Turnstile inte går att ladda (blockerat, inget nät), **då** visar appen ett begripligt besked och personen sitter inte fast i ett tyst läge. Turnstile ersätter aldrig gränserna i kriterium 8.
10. **[Nytt]** **Givet** att två personer använder samma enhet efter varandra, **när** den andra loggar in, **då** ser den andra aldrig den förstes pass, lag, klubb eller namn, varken vid uppstart eller medan data hämtas. Detta gäller också om den förste aldrig loggade ut och sessionen gått ut, om utloggningen avbröts av att nätet försvann, och om kontot raderats (S-12, ADR 0005 punkt 4). **Test:** (a) logga in som A, stäng fliken utan att logga ut, logga in som B, och A:s data syns inte vid något tillfälle, (b) samma sak med nätet avstängt under A:s utloggning, (c) lagrad data för en annan användare än den inloggade rensas vid uppstart.
11. **[Nytt]** **Givet** att inloggningsmejlet skickas, **då** innehåller det bara koden, ingen inloggningslänk (ADR 0004 punkt 4), är skrivet på svenska enligt `texter.md` och talar om vem som skickat det. **Test:** mejlet inspekteras i en testinkorg (till exempel Mailpit i lokal Supabase).
12. **[Nytt]** **Givet** att nätet saknas, **när** personen försöker skicka eller bekräfta en kod, **då** visas "Du verkar sakna internetanslutning. Det du skrivit finns kvar – försök igen när du är uppkopplad." (`texter.md` avsnitt 15), och inget påstås ha skickats.
13. **[Nytt]** **Givet** att personen har bekräftat koden, **då** hamnar en ledare på "Mina pass", en klubbadmin utan klubb på uppmaningen att skapa klubb (berättelse 09), och en redaktör ser dessutom redaktörskön när den finns (`docs/design/floden.md` avsnitt 0).
14. **[Nytt]** **Givet** att mejlen skickas från den delade avsändaradressen, **när** inloggningen provas inför K4, **då** redovisas hur ofta en beställd kod aldrig leder till en inloggning, och leveransen provas mot Gmail, Outlook och en telefonoperatörs adress (ADR 0004, *Konsekvenser*; ADR 0002). Det är en mätning och en redovisning, inget krav på ett visst utfall. Fastnar mejlen i skräpposten lyfter produktägaren frågan om egen domän till användaren igen (backlog: Could).

## Beroenden

Inga berättelser. Detta är grunden för resten av inkrement 3.

Kriterium 8, 9, 11 och 14 förutsätter att användaren har satt upp Supabase, Brevo och Cloudflare Turnstile (se backlogens översikt för inkrement 3). Kriterium 10 och de gränser som databasen upprätthåller prövas även i berättelse 28.

## Utanför denna berättelse

- Exakt inloggningsmetod – tekniskt val, ägs av senior-systemutvecklare. Beslutad i ADR 0004 (engångskod via e-post, inget lösenord), så berättelsens tidigare rad om lösenordsåterställning gäller inte: det finns inget lösenord att återställa. Att personen tappat åtkomst till sin e-post hanteras inte i appen i version 1.
- Att koppla kontot till en klubb eller ett lag (se berättelse 09–11).
- Inloggning med Google, Microsoft eller Apple (ADR 0004, alternativ).
- Att byta e-postadress på ett konto – inte ett krav i version 1.
- Egen avsändardomän (Could i backloggen).
- Att logga ut på alla enheter (berättelse 27) och att radera kontot (berättelse 26).

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-10-13 | Skärpt inför inkrement 3. Kriterium 3 rättat så att det bara gäller koden och inte en okänd adress (K2-beslut punkt 9, S-13). Kriterium 1, 2 och 4 preciserade och gjorda testbara. Nya kriterier 7–14: samma svar för känd och okänd adress, kodgränserna från S-18 som ska verifieras mot projektet, Turnstile, åtskild cache per användare (S-12), mejlets innehåll, kravet på nät, startvy efter inloggning och mätning av leveransen. "Utanför" rättat: ADR 0004 gör att något lösenord inte finns. Kriterium 5 och 6 är oförändrade. |
