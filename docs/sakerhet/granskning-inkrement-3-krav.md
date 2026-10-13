# Säkerhets- och dataskyddsgranskning: acceptanskriterierna för inkrement 3

**Status:** granskad 2026-10-13
**Granskare:** agenten `sakerhet-integritet`. Huvudsessionen har sparat rapporten.
**Underlag:** `origin/krav/inkrement-3` (2419f8a), 12 filer. Berättelserna 05, 06, 08–12 och 26–29, backloggens översikt, ADR 0002–0005, 0015 och 0016, och granskningarna av K2, inkrement 1, inkrement 2b och schemat. Granskningen har bara läst och inte ändrat några filer.

Fynden fortsätter S-serien från `granskning-k2.md` och `granskning-inkrement-1.md`, som slutade på S-37. Radhänvisningarna gäller filerna på grenen.

## 1 Sammanfattning

Nästan alla krav som K2-granskningen och granskningen av inkrement 1 ställde på inkrement 3 finns med, och de flesta har ett test som går att automatisera. Berättelse 28 gör isoleringen testbar: negativa tester på varje tabell, med två klubbar och alla rollkombinationer.

Fyra saker ska rättas innan delsteg 3b och 3c byggs:

1. **S-38 (hög):** ögonblicksbilderna i sparade pass har ingen storleksgräns och inget tak för antal moment. S-08 öppnas därmed igen.
2. **S-40 (hög):** "högst 5 försök per kod" går inte att uppfylla i Supabase. Det behövs andra skydd och en ny ADR.
3. **S-41 (medel):** Supabase skapar kontot redan när koden beställs.
4. **S-45 (medel):** staging är öppen för registrering av vem som helst.

Användarens åtta beslut från 2026-10-13 följer lagen och ADR 0003–0005.

| Nr | Grad | Kort |
|---|---|---|
| S-38 | Hög | Ögonblicksbilder och underlag i sparade pass saknar storleksgräns och tak för antal moment |
| S-39 | Medel | En ögonblicksbild kan förfalskas till en "godkänd bankövning" och bära ogranskad skisstext |
| S-40 | Hög | "Högst 5 försök per kod" kan inte uppfyllas i Supabase |
| S-41 | Medel | Supabase skapar kontot innan koden är bekräftad |
| S-42 | Medel | Rollen `anon` prövas inte mot tabeller och vyer |
| S-43 | Medel | Kontrollen att personens id försvinner vid radering är för smal |
| S-44 | Medel | Supabase Auths egna loggar och sessioner saknar lagringstid |
| S-45 | Medel | Staging är öppen för registrering av vem som helst |
| S-46 | Medel | En klubbadmin kan ta bort en annan klubbadmin enligt ADR 0003:s tabell |
| S-47 | Medel | Spärrad radering har ingen utväg inom artikel 12.3:s månad |
| S-48 | Medel | Den som bjuds in får ingen information enligt artikel 14 |
| S-49 | Medel | CSP-kriteriet saknar `script-src` för Turnstile och förbud mot `'unsafe-inline'` |
| S-50 | Låg | Skyddet i S-13 gäller bara gränssnittet, inte API:et |
| S-51 | Låg | Mjukt borttagna pass kan nås via API:et och ligga kvar i andras cache |
| S-52 | Låg | Fältet för vem som skapat en rad kan förfalskas när raden skapas |
| S-53 | Låg | Gränsen för felaktiga inbjudningsnycklar "per adress" är tvetydig |
| S-54 | Låg | Namnfälten saknar spärr mot styrtecken |
| S-55 | Låg | Realtime och GraphQL nämns inte i berättelse 28 |
| S-56 | Låg | Användarens beslut är inte införda i kriterierna (åtgärdat i a456c59) |
| S-57 | Låg | Utloggningen av andra enheter kan göras omedelbar för databasen |
| S-58 | Låg | Registerförteckning enligt artikel 30 saknas helt i planen |

## 2 Fynd

### S-38 · Hög · Sparade pass saknar storleksgräns och tak för antal moment
**Var:** 28 kriterium 7 och 8, 05 kriterium 1, ADR 0003.

Kriterium 7 sätter gränser för pass-, lag- och klubbnamn, för redaktörskommentarer och för övningsdokumentet. Det finns ingen gräns för `session_items.exercise_snapshot`, för `training_sessions.input` eller för antalet `session_items` per pass. Taket på 200 pass per dygn begränsar bara antalet pass, inte hur stort varje pass är.

*Scenario:* ett skript sparar 200 pass om dygnet, vart och ett med 2 000 moment och ögonblicksbilder på 100 kB. Databasen når gratisnivåns 500 MB inom minuter och blir skrivskyddad för alla klubbar. Lagets ledare laddar dessutom ned samma data till IndexedDB.

*Åtgärd:* lägg till i kriterium 7:
- `octet_length(exercise_snapshot::text) < 100000`
- planskissen i ögonblicksbilden högst 8 192 byte
- `input` högst cirka 2 000 byte
- högst cirka 40 moment per pass.

Gör ett test per gräns.

### S-39 · Medel · En ögonblicksbild kan förfalskas till en "godkänd bankövning"
**Var:** 28 kriterium 10, 05 kriterium 1 och 7.

Kriterium 10 spärrar `planskiss` i klubbens egna övningar, men `session_items.exercise_snapshot` skrivs av klienten. En ledare kan skriva in `status: godkand`, `ursprung: bank`, påhittade uppgifter om nickning och en skiss med namn i etiketterna. Slutkontrollen prövar R-022, R-080 och R-082 mot uppgifter som den som skriver kan styra. Det rör bara laget, men regeln om mänskligt godkännande blir då en fråga om förtroende inom laget.

*Åtgärd:*
- Ett lagrat pass läses tillbaka genom samma schema, vitlista (`PUBLISHED_FIELDS`) och `readPlanskiss` som banken (ADR 0016).
- Strukturen kontrolleras också i databasen, med `pg_jsonschema` eller en trigger.
- `input` får bara innehålla kända nycklar med tal eller uppräknade värden.
- Restrisken dokumenteras.

### S-40 · Hög · "Högst 5 försök per kod" kan inte uppfyllas i Supabase
**Var:** 08 kriterium 8 b och e, ADR 0004.

Supabases dokumentation anger ingen gräns för antal försök per kod. Det finns bara `token_verifications`: 30 verifieringar per 5 minuter per IP. Hookarna för verifieringsförsök gäller MFA och lösenord och kräver Teams eller Enterprise. `otp_length` får vara 6–10 siffror, så 8 siffror går att få.

*Scenario:* med 100 IP-adresser blir det ungefär 860 000 gissningar per dygn mot ett konto. Med 6 siffror tas kontot över inom timmar. Med 8 siffror är sannolikheten ungefär 1 % per dygn.

*Åtgärd:*
- Skriv om 8 b till skydd som går att verifiera: 8 siffror, koden gäller i 600 sekunder, `token_verifications` sänks till till exempel 10, och väntetiden mellan beställningar är 60 sekunder.
- Redovisa restrisken och ta bort reservalternativet 6 siffror.
- Avvikelsen från ADR 0004 punkt 3 skrivs som en ny ADR.

### S-41 · Medel · Supabase skapar kontot innan koden är bekräftad
**Var:** 08 kriterium 1, ADR 0004.

"If the user hasn't signed up yet, they are automatically signed up by default." Raden i `auth.users` skapas när koden beställs. Någon kan registrera en annan persons adress med ett påhittat namn som sedan ligger kvar.

*Åtgärd:*
- Profilen skapas först när adressen är bekräftad (`email_confirmed_at`).
- Obekräftade konton rensas efter en beslutad tid, till exempel 24 timmar. Det blir ett nytt kriterium i berättelse 29.
- Test: en obekräftad registrering lämnar ingen profil.
- En registrering med en befintlig adress skriver aldrig över namnet.

### S-42 · Medel · Rollen `anon` prövas inte mot tabeller och vyer
**Var:** 28 kriterium 1–2.

Supabase ger som förval `anon` åtkomst till `public`, och RLS är det enda skyddet. En policy utan `to authenticated` kan göra banken publik.

*Åtgärd:*
- `anon` får noll rader och nekas skrivning på varje tabell och vy.
- Ta helst bort `anon`:s rättigheter i `public`.
- CI underkänner policyer för `public` eller `anon`.

### S-43 · Medel · Kontrollen att personens id försvinner vid radering är för smal
**Var:** 26 kriterium 1, 2 och 9, ADR 0003.

Testet täcker inte `clubs.created_by`, `invitations.invited_by`, `editors.appointed_by` eller `editor_events`. Kriterium 9 nämner inte klubbens inskickningar. En åtkomsttoken gäller i upp till en timme efter raderingen och kan skriva rader med det raderade id:t.

*Åtgärd:*
- Ett allmänt test: noll träffar på personens id i alla kolumner som refererar `profiles` eller `auth.users`.
- Inskickningarna läggs till i kriterium 9.
- Skrivning med ett raderat kontos token nekas, och det testas.
- Beslutet om `editor_events` läggs i den ADR som S-44 kräver.

### S-44 · Medel · Supabase Auths egna loggar och sessioner saknar lagringstid
**Var:** 29, ADR 0003.

`auth.audit_log_entries` (IP, användaragent och troligen e-post) och `auth.sessions` (IP och användaragent) saknar lagringstid. Det gäller också spärrdata och Brevos sändloggar.

*Åtgärd:*
- Nytt kriterium i 29: granskningsloggen rensas efter en beslutad tid, eller så stängs skrivningen till databasen av.
- Loggposter och spärrdata för ett raderat konto rensas med kontot.
- Kriterium 29.5 kräver att loggraderna bara innehåller antal.
- Tiderna skrivs i en ny ADR.

### S-45 · Medel · Staging är öppen för registrering
**Var:** 28 kriterium 14, backloggen.

Förhandsadresserna ligger publikt, registreringen är öppen, och staging skickar via Brevo till vilken adress som helst. Riktiga uppgifter kan hamna i staging innan avtalen är granskade.

*Åtgärd:*
- I staging slås hooken "Before User Created" på, med en vitlista. Den ingår i Free.
- Alternativet är Cloudflare Access.
- Test: en adress utanför vitlistan nekas.

### S-46 · Medel · En klubbadmin kan ta bort en annan klubbadmin
**Var:** ADR 0003 (`club_members`), 09.

Berättelse 09 säger att en klubbadmin inte kan återkallas i version 1. Om policyerna följer ADR-tabellen kan det ändå göras direkt i databasen.

*Åtgärd:*
- Ingen kan ändra `is_admin` på en annan person eller ta bort en klubbadmins medlemskap. Det enda som går är att utse en ny via funktionen.
- Gör ett test för det.

### S-47 · Medel · Spärrad radering har ingen utväg
**Var:** 26 kriterium 3, 4 och 10.

Om ingen vill bli klubbadmin kommer personen aldrig vidare. Rätten till radering ska verkställas inom en månad (artikel 12.3 och 17).

*Åtgärd:*
- Spärrmeddelandet visar en kontaktväg till föreningen.
- En skriven rutin anger hur föreningen hanterar begäran inom 30 dagar.

### S-48 · Medel · Den som bjuds in får ingen information enligt artikel 14
**Var:** 11 kriterium 1, 08 kriterium 11.

*Åtgärd:*
- Inbjudningsmejlet och inloggningsmejlet anger den ansvarige, ändamålet och lagringstiden, och länkar till integritetspolicyn.
- Policyn ska finnas innan den första riktiga inbjudan skickas.

### S-49 · Medel · CSP-kriteriet saknar `script-src` för Turnstile
**Var:** 28 kriterium 12, `public/_headers`.

*Åtgärd:*
- `script-src 'self' https://challenges.cloudflare.com` och `frame-src https://challenges.cloudflare.com`.
- `connect-src` innehåller exakt projektets Supabase-adress.
- CI underkänner `'unsafe-inline'`, `'unsafe-eval'`, `https:`, `data:` och `*` i `script-src` och `connect-src`.

### S-50 · Låg · Skyddet i S-13 gäller bara gränssnittet
API:et kan svara olika för okända adresser. Det är inte verifierat mot ett projekt.
*Åtgärd:* testet gäller gränssnittet. Restrisken dokumenteras och mildras av Turnstile.

### S-51 · Låg · Mjukt borttagna pass kan nås via API:et
*Åtgärd:*
- Efter borttagningen ger direkta anrop noll rader.
- Andra ledares cache saknar passet efter nästa synk.
- Ett pass som inte klarar slutkontrollen ska ändå gå att ta bort.

### S-52 · Låg · Fältet för vem som skapat en rad kan förfalskas
*Åtgärd:* `with check (created_by = auth.uid())` och motsvarande för `added_by` och `invited_by`, med ett test per tabell.

### S-53 · Låg · Gränsen för felaktiga inbjudningsnycklar är tvetydig
*Åtgärd:* gränsen gäller per konto, så inga IP-adresser behöver lagras. En kort ny ADR behövs om ADR 0004:s "per IP" ersätts.

### S-54 · Låg · Namnfälten saknar spärr mot styrtecken
*Åtgärd:*
- Databasen nekar `\p{Cc}` och bidi-tecknen U+202A–202E och U+2066–2069 i visnings-, lag-, klubb- och passnamn.
- Texten normaliseras till NFC.

### S-55 · Låg · Realtime och GraphQL nämns inte
*Åtgärd:* CI kontrollerar att publiceringen `supabase_realtime` är tom och att `pg_graphql` är avstängt eller stängt för `anon`.

### S-56 · Låg · Användarens beslut är inte införda i kriterierna
Åtgärdat på grenen i a456c59, efter granskningen.

### S-57 · Låg · Utloggningen av andra enheter kan göras omedelbar för databasen
Åtkomsttoken har anspråket `session_id`. En hjälpfunktion i RLS kan kräva att sessionen finns kvar i `auth.sessions`. Det stänger också ute ett raderat kontos token direkt.
*Åtgärd:* pröva det i 3b och mät kostnaden. Om det behålls skrivs en ny ADR.

### S-58 · Låg · Registerförteckning saknas
Undantaget i artikel 30.5 gäller inte.
*Åtgärd:* förteckningen tas med i kontrollistan och som en egen post i backloggen.

**Iakttagelse:** ESLint 9.39.5 är `maintenance` och 10.12.0 är `latest`. Att uppgradera först är ändå rätt.

## 3 Täckning av tidigare krav

| Krav | Täckt i | Brist |
|---|---|---|
| S-01 skyddade kolumner | 28.6 | När rader skapas: S-52 |
| S-02 vyer | 28.3 | – |
| S-06 funktioner, `anon` | 28.5, 26.14, 11.11 | Tabeller och vyer för `anon`: S-42 |
| S-08 storlek och antal | 28.7–9, 05.10–11, 11.9 | Ögonblicksbilder och moment: S-38 |
| S-10 radering | 26 | S-43, S-47 |
| S-11 logga ut på alla enheter | 27 | (S-57) |
| S-12 cache per användare | 08.10, 11.3c | Borttagna pass: S-51 |
| S-13 samma svar | 08.7 | S-50 |
| S-14 nyckel i fragmentet | 11.6–7 | S-53 |
| S-15 redaktörens ägare | 26.4, 26.10, 28.2c | Resten hör till inkrement 4 |
| S-16 vem ser vem | 28.2a, 12.3 | – |
| S-17, S-26, S-35 headers | 28.12 | S-49 |
| S-18 kodgränser | 08.8 | Kan inte uppfyllas: S-40 |
| S-19 lagringstider | 29 | S-41, S-44 |
| S-20 spelarnamn | 05.5, 09.5, 10.4, texter.md | – |
| S-23 staging | 28.14 | Ingen mekanism: S-45 |
| S-24 buckets | 28.4 | – |
| S-29, S-37 körtidsvägen | 28.15 | Importgränsen före inkrement 4 |
| 2b F3 `swapped` | 05.6 | – |
| 2b F5 ESLint | 3a | – |
| Schemat F5, planskiss i klubbövning | 28.10–11 | Hål via ögonblicksbilder: S-39 |
| Inkrement 1 avsnitt 4, dataskydd | Backloggen | Kontrollistan nedan, S-58 |

## 4 Användarens beslut mot lagen och ADR:erna

| Beslut | Bedömning |
|---|---|
| Lokal databas och staging tills avtalen är granskade | Lagligt, om staging verkligen är stängd (S-45). Mätningen av mejlleveransen använder bara egna adresser och testare som vet om det. |
| Koden har 8 siffror | Går att få (6–10). Följer ADR 0004. |
| Ett lagrat pass som inte klarar slutkontrollen visas inte | Följer ADR 0016. Passet ska ändå gå att ta bort (S-51). |
| Ensam medlem raderas med klubben efter förvarning | Följer ADR 0003 och artikel 17. Komplettera med inskickningarna (S-43). |
| Arkiverade lag och pass rensas efter 24 månader | Följer ADR 0003. Ska stå i policyn. |
| Utloggning kan dröja upp till en timme | Följer ADR 0004. Kan förbättras (S-57). |
| Alla ledare i laget får ta bort lagets pass | Följer ADR 0003. Bra för dataskyddet. |
| Inaktiva konton byggs före K5 | Lagligt. Ska stå i policyn. |

**Nya ADR:er som behövs:**
1. Ersättningsskydd för gränsen per kod (S-40).
2. Kompletterade lagringstider: obekräftade konton, Auths loggar, `editor_events` och spärrdata (S-41, S-43, S-44).
3. Hur ett sparat pass refererar till en bankövning medan banken är inbyggd (senior systemutvecklare).
4. Om användaren väljer det: sessionskontroll i RLS (S-57) och gräns per konto (S-53).

## 5 Kontrollista före riktiga personuppgifter i produktion

Användaren bockar av A, B och C. Säkerhetsagenten granskar och bockar av D.

**A. Biträdesavtal**
- [ ] **Supabase:** bekräfta att avtalet omfattar Free och läs underbiträdeslistan.
- [ ] **Cloudflare:** läs underbiträdeslistan och notera att uppgifter behandlas globalt.
- [ ] **Brevo, inte verifierat:**
  - Ladda ned avtalet.
  - Bekräfta lagringsorten (EU), underbiträdena, eventuella överföringar ut ur EU och hur länge sändloggar och mejlinnehåll sparas.
  - Bekräfta att transaktionsmejl inte skapar kontakter.
  - Går det inte att bekräfta byts leverantören, enligt beslut 7 vid K2.
- [ ] **GitHub:** blir biträde bara om säkerhetskopiorna läggs där, och då krypterade.

**B. Lagringsort**
- [ ] En skärmdump av regionen för Supabase-projekten i produktion och staging.
- [ ] Brevos lagringsort, bekräftad i avtalet.
- [ ] Överföringen via Cloudflare dokumenterad med standardavtalsklausuler.

**C. Dokument och rutiner**
- [ ] **Integritetspolicy**, nåbar utan inloggning och länkad från inloggningen och mejlen. Den ska ta upp:
  - den ansvarige och kontaktvägen
  - vilka uppgifter som behandlas
  - ändamål och rättslig grund
  - biträden och överföringar
  - lagringstider
  - att delat material blir kvar avidentifierat
  - de registrerades rättigheter
  - rätten att klaga hos IMY
  - att man inte ska skriva namn på spelare
  - att redaktörer ser inskickade övningar.
- [ ] **Registerförteckning** enligt artikel 30.1 (S-58).
- [ ] **Intresseavvägning** för inbjudnas adresser och säkerhetsloggar.
- [ ] **Rutin för begäranden från registrerade**, inom en månad (S-47).
- [ ] **Rutin för personuppgiftsincidenter**: anmälan till IMY inom 72 timmar och en utsedd ansvarig.

**D. Teknik, verifierad mot produktionsprojektet**
- [ ] Inställningarna för Auth enligt S-40, med Turnstile på och beslutad livstid för åtkomsttoken.
- [ ] Migrationerna granskade mot S-01, S-02, S-06, S-16 och S-42, med gröna pgTAP-tester.
- [ ] CSP enligt S-49. Ingen servicenyckel i bygget eller i CI.
- [ ] Staging stängd för okända adresser (S-45).
- [ ] `delete_my_account` provad hela vägen i produktion.
- [ ] `pg_cron` aktivt, och rensningen loggar enligt 29.
- [ ] Rekommenderas: krypterade säkerhetskopior och en provad återläsning.

## 6 Beslut som behövs

1. **Gränsen per kod (S-40):** godta ersättningsskydden och skriv dem i en ny ADR. Bygg ingen egen verifiering i version 1.
2. **Kan en klubbadmin ta bort en annan (S-46)?** Nej i version 1, spärrat i databasen.
3. **Utväg vid spärrad radering (S-47):** en kontaktväg i meddelandet och en rutin inom 30 dagar.
4. **Auths granskningslogg (S-44):** behålls i databasen och rensas efter 90 dagar.
5. **Obekräftade konton (S-41):** rensas efter 24 timmar.
6. **Hur staging stängs (S-45):** hooken "Before User Created" med en vitlista.
7. **Omedelbar utloggning (S-57):** pröva sessionskontrollen i RLS i 3b.
8. **Förtroende inom laget för ögonblicksbilder (S-39):** kontrollera i databasen och dokumentera restrisken.
9. **Testadresser före Brevos avtal:** bara egna adresser och testare som har samtyckt.

## Verifierat

- `git diff origin/main...origin/krav/inkrement-3`. Alla berättelser, backloggen, ADR 0002–0005, 0015 och 0016 och de tidigare granskningarna är lästa i sin helhet.
- `npm audit`: 0 sårbarheter.
- `npx vitest run src/regelmotor/swap/swapped-flag.test.ts` på main: 8 av 8.
- Supabases dokumentation om gränser för anrop, CLI-konfigurationen, auth-hooks, sessioner, passwordless och avtalet, samt Cloudflares avtal och Turnstiles CSP, lästa 2026-10-13.

## Kvarstår

- Brevos avtal, lagringsort och loggtider är inte verifierade.
- Supabases underbiträdeslista (pdf) är inte läst.
- S-50 och innehållet i `auth.audit_log_entries` är inte prövade mot ett riktigt projekt.
- RLS-policyerna och migrationerna ska granskas mot koden före K4.
- Ett passnamn med den raderade personens eget namn blir kvar i lagets pass. Det ska stå i policyn.
