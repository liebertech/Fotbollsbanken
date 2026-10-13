Status: utkast (2026-10-13)

# 28. Databasens skydd och gränser

**Roll:** klubbadmin, ledare och redaktör (indirekt). Berättelsen beskriver det alla tre förväntar sig av appen utan att se det: att ingen klubbs data syns för en annan, att ingen kan ge sig själv fler rättigheter, och att en enskild användare inte kan fylla eller sänka tjänsten.

**Som** klubbadmin eller ledare **vill jag** att min klubbs uppgifter är skyddade från andra klubbar och från att ändras på otillåtet sätt, **så att** jag kan lita på att appen håller isär klubbarna och att bara en människa kan släppa in en övning i den gemensamma banken.

Berättelsen samlar de tvärgående säkerhetskraven på inkrement 3 som inte hör till en enskild användarhandling. De kommer från ADR 0003 och 0004 och från säkerhetsgranskningarna `docs/sakerhet/granskning-k2.md` (S-01, S-02, S-06, S-08, S-12, S-16, S-17, S-23, S-24), `granskning-inkrement-1.md` (avsnitt 4, S-26, S-35, S-37) och `granskning-inkrement-2-schema.md` (F5, ny iakttagelse). Alla kriterier är utformade så att kvalitetssäkraren kan skriva ett automatiskt test, vanligen ett pgTAP-test mot lokal Supabase eller ett CI-steg. Hur skyddet uppnås är senior-systemutvecklares val.

## Acceptanskriterier

**Isolering**

1. **Givet** att varje tabell i schemat `public` har åtkomstregler på radnivå, **när** bygget kontrolleras i CI, **då** underkänns det om någon tabell saknar dem, och en inloggad person utan någon regel som ger åtkomst får noll rader och kan inte skriva (nekande som förval).
2. **Givet** testdata med två klubbar, två lag i den ena klubben och personer i alla rollkombinationer (ledare i ett lag, ledare i två lag, klubbadmin, klubbadmin som också är ledare, redaktör, person utan koppling), **när** varje person försöker läsa, skriva, ändra och ta bort rader i varje tabell, **då** får personen exakt det som behörighetstabellen i ADR 0003 anger och inget mer. Testerna skrivs som negativa tester: **en person i klubb A får noll rader och nekas skrivning mot klubb B på varje tabell**, och en ledare i lag 1 når inte lag 2:s pass i samma klubb. Särskilt prövas att (a) personer ser namn bara på dem de delar lag med, och klubbadmin ser hela klubbens ledare, och att en ledare i en stor klubb inte kan lista klubbens samtliga ledare (S-16, den snävare tolkningen), (b) klubbadmin inte läser lagets pass eller säsongsplan om hen inte är ledare i laget, (c) en inloggad person inte kan lägga till sig själv i en klubb, ett lag eller i redaktörerna.
3. **Givet** att en vy finns i schemat `public`, **när** bygget kontrolleras, **då** underkänns det om vyn saknar `security_invoker = true`, och en ledare kan inte via en vy läsa rader som tabellens regler nekar (S-02).
4. **Givet** att `storage.buckets` ska vara tom (version 1 laddar inte upp filer), **när** bygget kontrolleras, **då** underkänns det om någon bucket finns (S-24).

**Funktioner och rättigheter**

5. **Givet** att varje funktion i `public` som appen anropar (bland andra `create_club`, `accept_invitation`, `delete_my_account`, funktionen för namnkontroll av klubb, funktionerna för att utse klubbadmin och för uppslagning av konto) är skapad, **när** den anropas utan inloggning, **då** nekas anropet, och inte en enda av dem går att köra som anonym (ADR 0003 princip 3, S-06). Det finns ett test per funktion. Varje funktion som körs med ägarens rättigheter avbryter när ingen är inloggad.
6. **Givet** en ledare som är medlem i en klubb, **när** ledaren försöker ändra skyddade kolumner direkt (till exempel `scope`, `club_id`, `origin`, `approved_by` eller `source_id` på en övning, eller `is_admin` på ett medlemskap, eller `team_id` så att ett pass flyttas dit ledaren inte hör hemma), **då** nekas ändringen, och en rad i klubbens omfång (`scope = club`) kan aldrig ha `origin` annat än klubbens egen (S-01, ADR 0003 princip 8). Varje kolumn har ett eget test. En övning kan inte få `scope = bank` av en ledare.

**Gränser för storlek och antal** (ADR 0003 princip 9, S-08)

7. **Givet** att texter och dokument har gränser, **när** en rad skrivs som överskrider dem, **då** nekas den av databasen och inte bara av formuläret: passnamn och lagnamn och klubbnamn högst 100 tecken, redaktörens kommentar 2 000, övningens `beskrivning` 5 000, hela övningsdokumentet under 100 000 byte. Det finns ett test per gräns, och exakta värden kan justeras av senior-systemutvecklare om testerna följer med.
8. **Givet** att en klubb har 1 000 övningar, **när** klubben försöker skapa en till, **då** nekas det. **Givet** att en ledare har sparat 200 pass under det senaste dygnet, **när** ledaren försöker spara ett till, **då** nekas det (berättelse 05, kriterium 11). Gränserna gäller inte andra klubbar eller andra ledare.
9. **Givet** att en fråga kan returnera hela tabeller, **när** en ledare hämtar utan filter, **då** begränsas antalet rader av servern (`max_rows`), så att ingen enskild fråga hämtar hela banken eller en hel klubbs data i ett svep.

**Skissdata i klubbens egna övningar** (backlogg inkrement 3, `granskning-inkrement-2-schema.md`)

10. **Givet** att version 1 saknar skisseditor, **när** en klubbövning (`scope = club`) skrivs med ett `planskiss`-fält i innehållet, vare sig det är en ny rad eller en ändring, **då** nekas det av databasen med en `check` eller trigger, och fältet kan inte läggas till via direkt skrivning mot databasen (texten i en skiss granskas aldrig av någon och får därför inte in via klubbens övningar). Bankens övningar (`scope = bank`) som kommer från importen får ha `planskiss`.
11. **Givet** att en bankövning har en planskiss, **när** skissen är större än 8 192 byte, **då** nekas raden, mätt som textstorlek (`octet_length` av skissen som text) och inte som komprimerad storlek. **Test:** en lätt komprimerbar skiss på 100 kB nekas (granskning av schemat för skissdata, F5). Mätmetoden prövas mot en riktig databas, eftersom `pg_column_size` inte har verifierats.

**Webbläsarens skydd och hemligheter** (S-17, S-26, S-35, granskning inkrement 1 avsnitt 4)

12. **Givet** att appen levereras med säkerhetsheaders, **när** bygget kontrolleras i CI, **då** innehåller `_headers` (a) en innehållspolicy med `connect-src` begränsad till projektets Supabase-adress, Cloudflare Turnstile och egen adress och inget annat, `frame-src` begränsad till Turnstile, `form-action 'self'`, `frame-ancestors 'none'`, `object-src 'none'` och `base-uri 'none'`, (b) `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` och `Referrer-Policy: no-referrer`. CI kontrollerar innehållet i policyn (bärande teckenföljder) och inte bara att rubrikerna finns, och underkänner ett bygge där Supabase-adressen eller Turnstile saknas i `connect-src` (annars blir inloggningen blockerad), eller där en bred källa som `*` finns. **[Skärpt 2026-10-13, S-49]** Policyn innehåller `script-src 'self' https://challenges.cloudflare.com` och `frame-src https://challenges.cloudflare.com`, och `connect-src` innehåller exakt projektets Supabase-adress. CI underkänner `'unsafe-inline'`, `'unsafe-eval'`, `https:`, `data:` och `*` i `script-src` och `connect-src`.
13. **Givet** att Supabase har en publik nyckel som är avsedd att ligga i klientbygget, **när** bygget kontrolleras, **då** underkänns det om servicenyckeln (den som går förbi åtkomstreglerna), databasens lösenord, Brevos nyckel eller Turnstiles hemliga nyckel finns i det byggda paketet, i miljövariabler som exponeras för webbläsaren, eller i CI. Servicenyckeln används bara i Edge Functions och i användarens egna ingrepp (ADR 0003).
14. **Givet** att förhandsversioner av grenar pekar på stagingprojektet, **när** ett bygge för en annan gren än `main` skapas, **då** innehåller det aldrig produktionsprojektets adress eller nycklar, och CI underkänner ett bygge där det händer (S-23). Staging innehåller aldrig riktiga personuppgifter: riktiga ledares e-postadresser får inte användas där, och inloggningsmejl från staging går till en testinkorg. **[Skärpt 2026-10-13, S-45]** Staging är stängd för okända adresser med hooken "Before User Created" och en vitlista; en adress utanför vitlistan nekas vid registrering (berättelse 08, kriterium 15). Innan Brevos avtal är bekräftat skickas e-post bara till användarens egna adresser och till testare som har samtyckt.

**Cachen och körtidsvägen för data** (ADR 0005, ADR 0016, S-12, S-37)

15. **Givet** att data som hämtas från servern (pass, övningar, lag) sparas lokalt, **när** en rad har fel eller ogiltigt format, **då** hoppas den raden över och redovisas, och resten visas; appen kastar inget fel under uppstart och sidan blir inte vit (S-37, ADR 0016). Gränsen mellan bankens övningar och klubbens kvarstår: en klubbövning blir aldrig en bankövning i generatorn (S-28).

**Tillägg 2026-10-13 efter säkerhetsgranskningen av kriterierna** (`docs/sakerhet/granskning-inkrement-3-krav.md`, användarens beslut samma dag)

16. **[Nytt, S-42]** **Givet** rollen `anon` (ej inloggad), **när** den försöker läsa eller skriva i någon tabell eller vy i `public`, **då** får den noll rader och nekas skrivning. Helst har `anon` inga rättigheter alls i `public`. CI underkänner en policy som gäller `public` eller `anon`.
17. **[Nytt, S-38]** **Givet** att sparade pass lagrar ögonblicksbilder, **när** en rad skrivs, **då** nekar databasen: ögonblicksbild över 100 000 byte (mätt som text), planskiss i den över 8 192 byte, `input` över cirka 2 000 byte, fler än cirka 40 moment per pass. Ett test per gräns (se berättelse 05, kriterium 15).
18. **[Nytt, S-39, beslut 8]** **Givet** att en ögonblicksbild skrivs av klienten, **när** den har okända fält, en struktur som inte följer övningsschemat eller en förfalskad status, **då** nekas den av databasen (schemakontroll eller trigger). `input` får bara ha kända nycklar med tal eller uppräknade värden. Restrisken inom laget dokumenteras och är godtagen.
19. **[Nytt, S-52]** **Givet** att en rad skapas i en tabell med fält för vem som skapat den (`created_by`, `added_by`, `invited_by`, `submitted_by`), **när** fältet sätts till någon annan än den inloggade, **då** nekas raden (`with check`). Ett test per tabell.
20. **[Nytt, S-54]** **Givet** att visnings-, lag-, klubb- och passnamn skrivs, **när** de innehåller `\p{Cc}` eller bidi-tecknen U+202A–202E och U+2066–2069, **då** nekas de av databasen; texten normaliseras till NFC.
21. **[Nytt, S-55]** **Givet** att Realtime och GraphQL inte används, **när** bygget kontrolleras, **då** underkänns det om publiceringen `supabase_realtime` innehåller någon tabell, eller om `pg_graphql` är på och öppen för `anon`.
22. **[Nytt, S-57, beslut 7]** Sessionskontroll i åtkomstreglerna (att sessionen finns kvar i `auth.sessions`) prövas och kostnaden mäts i delsteg 3b; behålls den skrivs en ny ADR (berättelse 27, kriterium 7).
23. **[Nytt, S-46]** Ingen klubbadmin kan ta bort en annan eller ändra någon annans `is_admin` (berättelse 09, kriterium 8). Spärren ligger i databasen och prövas här i isoleringstesterna.

## Beroenden

- Gäller alla tabeller och funktioner som inkrement 3 skapar. 08–12, 26–27, 05 och 29 hänvisar hit.
- Förutsätter att pgTAP körs mot lokal Supabase i CI (ADR 0002) och att Supabase-projekt finns för staging (se backlogens översikt).
- Kvalitetssäkraren äger testerna (ADR 0003). Säkerhetsagenten granskar de faktiska migrationerna mot S-01, S-02 och S-06 före K4.

## Utanför denna berättelse

- Att redaktören kan godkänna, återsända eller utse andra redaktörer. Funktionerna och deras rättigheter prövas i inkrement 4 (berättelse 15–18). Tabellerna och regler som finns från inkrement 3 prövas här.
- Att kontrollera övningsfilerna i `content/ovningar/` (egen kedja, ADR 0010, 0013, 0020).
- Integritetspolicy, biträdesavtal och rättslig grund (fas 5, se backlog).
- Säkerhetskopior (fas 5, ADR 0002 punkt 6).

## Ändringar efter K2

Nytt dokument 2026-10-13. Samma dag tillkom kriterium 16–23 och skärptes kriterium 12 och 14 efter säkerhetsgranskningen av kriterierna (S-38, S-39, S-42, S-45, S-46, S-49, S-52, S-54, S-55, S-57).
