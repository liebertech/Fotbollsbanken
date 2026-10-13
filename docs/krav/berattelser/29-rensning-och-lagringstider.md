Status: utkast (2026-10-13)

# 29. Rensning och lagringstider

**Roll:** ledare, klubbadmin, redaktör (indirekt)

**Som** ledare **vill jag** att det jag har tagit bort, och de uppgifter som inte längre behövs, verkligen försvinner efter en rimlig tid, **så att** ett spelarnamn som råkat hamna i en text inte ligger kvar för alltid och mina uppgifter inte sparas längre än de behövs.

Lagringstiderna är beslutade i ADR 0003 (*Lagringstider*, S-19, användarens beslut 2026-09-12). Berättelsen gör dem till krav som går att testa. Rensningen sker i databasen och inte som en driftrutin.

## Acceptanskriterier

1. **Givet** att ett pass, en övning eller något annat har tagits bort med mjuk borttagning, **när** det har gått 90 dagar, **då** raderas raden och dess underrader (till exempel passets moment) hårt. **Test:** med en förskjuten tid raderas en rad som markerats för 91 dagar sedan och en rad som markerats för 89 dagar sedan finns kvar.
2. **Givet** att ett lag har arkiverats, **när** det har gått 24 månader, **då** raderas laget hårt. **Test:** på samma sätt som kriterium 1. Lagets pass får samma frist och raderas tillsammans med laget (användarens beslut 2026-10-13); varningen vid arkivering säger det (berättelse 10, kriterium 3). Samma tid gäller säsongsplaner (inkrement 7).
3. **Givet** att en inbjudan har accepterats, gått ut eller återkallats, **när** den inbjudnas e-postadress ska rensas, **då** tas adressen bort direkt vid accepterande och senast 30 dagar efter att inbjudan gått ut eller återkallats (ADR 0003, ADR 0004).
4. **Givet** att ett konto inte har använts för inloggning på 24 månader, **när** tiden är nådd, **då** får personen först en påminnelse per e-post med en rimlig tid att logga in, och om personen inte loggar in raderas kontot på samma väg som när personen själv raderar det (berättelse 26). Must (användarens beslut 2026-10-13). Det byggs som ett eget delsteg efter inkrement 3 och före K5, utanför inkrementets K4. Tidigast kan ett konto nå gränsen hösten 2028.
5. **Givet** att rensningen körs dagligen av databasen, **när** den har körts, **då** finns en spårbar loggrad med antal rensade rader per typ, och körningen misslyckas inte tyst: ett fel syns i loggen. **Test:** körningen ger en rad även när inget rensades, och ett påtvingat fel syns.
6. **Givet** att en rad rensas, **då** påverkas inga andra klubbars eller lags rader, och inga rader som inte uppfyller kriterium 1–4 raderas (negativa tester).
7. **Givet** att personuppgifter finns i säkerhetskopior i upp till 30 dagar (ADR 0002), **då** står det i integritetspolicyn (fas 5, se backlog). Det är ingen del av byggd funktion i det här inkrementet.

8. **[Nytt 2026-10-13, S-41, beslut 5]** **Givet** att ett konto har skapats men koden aldrig bekräftats, **när** det har gått 24 timmar, **då** raderas kontot. **Test:** med förskjuten tid raderas ett obekräftat konto efter 25 timmar och ett bekräftat konto rörs inte.
9. **[Nytt 2026-10-13, S-44, beslut 4]** **Givet** att Supabase Auths granskningslogg (IP, användaragent, troligen e-post) och sessionsdata behålls, **när** det har gått 90 dagar, **då** rensas posterna. Loggposter och spärrdata för ett raderat konto rensas med kontot. Brevos sändloggar omfattas av avtalskontrollen (backloggens kontrollista). Tiderna, och lagringstiden för redaktörshistoriken (`editor_events`), skrivs i en ny ADR (senior-systemutvecklare). **Test:** på samma sätt som kriterium 1.

Kriterium 5 gäller även de nya rensningarna, och loggraderna får bara innehålla antal, inga personuppgifter.

## Beroenden

- 05 (passen som tas bort), 10 (arkivering), 11 (inbjudningar), 26 (radering).
- 28 (databasens skydd och gränser).
- Förutsätter att tillägget `pg_cron` finns och fungerar i Supabase gratisnivå. Det ska bekräftas när projektet skapas (ADR 0003 utgår från att det ingår).

## Utanför denna berättelse

- Säkerhetskopiernas lagringstid och krypteringen av dem (ADR 0002, fas 5).
- Integritetspolicyn.
- Att rensa övningar som är godkända i den gemensamma banken. De ägs inte av en ledare och följer inga lagringstider i den här berättelsen.
- Export av egna uppgifter (Could).

## Ändringar efter K2

Nytt dokument 2026-10-13. Samma dag tillkom kriterium 8 (S-41) och 9 (S-44), och kriterium 5 skärptes till att loggraderna bara har antal.
