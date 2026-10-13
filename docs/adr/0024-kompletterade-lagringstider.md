# 0024: Kompletterade lagringstider

Status: föreslagen. Kompletterar *Lagringstider* och *Radering av konto* i ADR 0003, som gäller oförändrade

## Kontext

ADR 0003 (beslutad vid K2, 2026-09-12) fastställde lagringstider för appens egna tabeller och en väg för radering av konto, `delete_my_account`. Säkerhetsgranskningen av kriterierna för inkrement 3 (`docs/sakerhet/granskning-inkrement-3-krav.md`) visar att det finns personuppgifter som tabellen inte täcker:

| Uppgift | Varför den inte täcks | Fynd |
|---|---|---|
| Obekräftade konton i `auth.users` | Supabase skapar raden när koden beställs, inte när den bekräftas. Någon kan registrera en annan persons adress med ett påhittat namn som sedan ligger kvar | S-41 |
| `auth.audit_log_entries` | Supabase Auths egen logg innehåller IP-adress, användaragent och troligen e-post, och har ingen lagringstid | S-44 |
| `editor_events` och spärrdata | Saknas i tabellen över lagringstider, och spärrdata är ny i ADR 0023 | S-43, S-44 |
| `invitations.invited_by`, `clubs.created_by`, `editors.appointed_by` | Saknas i ADR 0003:s steg *Avidentifieras* | S-43 |
| `auth.sessions` och `auth.refresh_tokens` | Innehåller IP-adress och användaragent och tas bara bort när kontot raderas. Sessioner med fast livslängd kräver Pro | S-77 |
| Auths loggpost om att ett konto raderats | Raderingen skapar troligen en egen post med e-post och id, där personen är föremål och inte aktör | S-80 |
| `cron.job_run_details` | Loggen över körningar av `pg_cron` saknar lagringstid | S-84 |

Användaren har beslutat (2026-10-13, avsnitt 6 i granskningen): obekräftade konton rensas efter 24 timmar (punkt 5), och Auths granskningslogg behålls i databasen och rensas efter 90 dagar (punkt 4). Samma dag godkände användaren också två förslag som den här ADR:n lägger fram: att `editor_events` sparas utan tidsgräns men avidentifieras vid radering, och att `invitation_attempts` rensas efter 24 timmar.

Efter omgranskningen (`docs/sakerhet/granskning-uppsattning-och-adr-0023-0025.md`) beslutade användaren 2026-10-13 dessutom:

- sessioner som inte har förnyats på 180 dagar raderas, tillsammans med sina rader i `auth.refresh_tokens` (S-77)
- Auths loggpost om att ett konto raderats behålls i 90 dagar som säkerhetslogg, med berättigat intresse som rättslig grund, och det ska stå i integritetspolicyn. Övriga poster där personen är aktör eller föremål rensas med kontot (S-80)

ADR 0003 ändras inte. Tabellerna nedan ska läsas som tillägg till tabellerna *Lagringstider* och *Radering av konto* där.

## Beslut

### 1 Profilen skapas först när adressen är bekräftad

- Triggern som skapar raden i `profiles` (ADR 0004 punkt 1) körs när `auth.users.email_confirmed_at` går från null till ett värde, och vid insättning bara om värdet redan är satt. En beställd men obekräftad kod lämnar alltså ingen profil.
- Profilen skapas med `on conflict do nothing`. En ny registrering med en adress som redan har ett konto skriver aldrig över namnet.
- Namnet läses ur `raw_user_meta_data` en gång, när profilen skapas. Därefter ändras det bara av personen själv.
- **Test i 3c (S-81):** två registreringar av samma obekräftade adress med olika namn, följda av att koden bekräftas, ska ge profilen namnet från den registrering vars kod bekräftades. Om Supabase i stället behåller namnet från den första registreringen ska personen kunna rätta namnet direkt efter den första inloggningen, och appen visar då namnet för bekräftelse innan det används. Utfallet står i rapporten för 3c.

### 2 Nya lagringstider

| Vad | Tid | Vad som händer |
|---|---|---|
| Obekräftade konton (`auth.users` med `email_confirmed_at is null`) | **24 timmar** efter `created_at` | Raden raderas hårt. Det finns ingen profil och inget annat innehåll att ta hänsyn till |
| Auths granskningslogg (`auth.audit_log_entries`) | **90 dagar** | Raderas hårt |
| Inloggningssessioner (`auth.sessions`) som inte har förnyats | **180 dagar** efter senaste förnyelse, mätt på `refreshed_at` eller, om kolumnen saknas, `updated_at`. Vilken som finns prövas i 3b (användarens beslut 2026-10-13, S-77) | Sessionen raderas hårt tillsammans med sina rader i `auth.refresh_tokens`. Enheten loggas ut och behöver en ny kod |
| Loggen över körningar av `pg_cron` (`cron.job_run_details`) | **90 dagar** (S-84) | Raderas hårt. Jobbens meddelanden innehåller bara antal, aldrig id:n eller adresser |
| Misslyckade försök med inbjudningsnyckel (`invitation_attempts`, ADR 0023 avsnitt 4) | **24 timmar** (användarens beslut 2026-10-13) | Raderas hårt. Spärren behöver bara den senaste timmen |
| Händelser för redaktörer (`editor_events`) | **Utan tidsgräns** (användarens beslut 2026-10-13). Personens id avidentifieras vid radering, se avsnitt 3 | Raderna behålls. De visar vem som utsett eller återkallat en redaktör, och utan dem går en ändring i den gemensamma bankens redaktörer inte att följa |

Rensningen görs av samma dagliga `pg_cron`-jobb som i ADR 0003. Jobbet loggar bara antalet raderade rader per tabell, aldrig id:n eller adresser (berättelse 29, kriterium 5).

Gränsen per klubb för inbjudningsmejl (ADR 0004 punkt 6) och gränsen för sparade pass per dygn (ADR 0003 punkt 9) räknas på `invitations` och `training_sessions` och kräver ingen egen spärrdata.

### 3 Radering av konto: fler kolumner avidentifieras och fler rader raderas

Tillägg till stegen i ADR 0003, *Radering av konto*:

| Steg | Vad som tillkommer |
|---|---|
| Raderas | Personens rader i `invitation_attempts`. Rader i `auth.audit_log_entries` där personen är aktör eller föremål, utom posten om själva raderingen |
| Behålls i 90 dagar | Auths loggpost om att kontot raderats, som säkerhetslogg med berättigat intresse som grund (användarens beslut 2026-10-13, S-80). Den rensas med den vanliga gränsen på 90 dagar i avsnitt 2 |
| Avidentifieras | `invitations.invited_by`, `clubs.created_by`, `editors.appointed_by`, och `actor_id` och `subject_id` i `editor_events` sätts till null |

Supabase raderar själv personens rader i `auth.sessions` och `auth.refresh_tokens` när raden i `auth.users` tas bort.

**Prövas i 3b (S-80):** vilka poster raderingen faktiskt skapar i `auth.audit_log_entries`, vad de innehåller och i vilka fält personens id och e-post står. Om det visar sig att det inte går att skilja raderingsposten från andra poster, eller att den innehåller mer än e-post, id och tidpunkt, tas det upp med säkerhetsagenten innan riktiga personuppgifter finns i produktionen.

**Ett allmänt test ersätter listan.** I stället för ett test per kolumn hämtar pgTAP-testet alla kolumner i `public` som refererar till `profiles.id` eller `auth.users.id` ur systemkatalogen och kontrollerar att ingen av dem innehåller den raderade personens id. En kolumn som läggs till senare kommer då med automatiskt (S-43).

### 4 Utanför databasen

Brevos sändloggar och mejlinnehåll lagras hos Brevo. Hur länge, och om det går att begränsa, ingår i säkerhetsagentens granskning av Brevos biträdesavtal (kontrollistan i granskningen, avsnitt 5 A) och beslutas inte här.

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Profilen skapas vid insättning, som tidigare** | En obekräftad registrering lämnar ett påhittat namn knutet till en främmande persons adress (S-41) |
| **Stänga av Auths granskningslogg i databasen** | Den behövs för att utreda en misstänkt kontokapning. Användaren valde att behålla den i 90 dagar |
| **Rensa obekräftade konton efter 7 dagar** | En kod gäller i 10 minuter (ADR 0023). Ett konto som inte bekräftats inom ett dygn bekräftas inte |
| **Radera `editor_events` med personen** | Historiken över vem som utsett vem i den gemensamma banken försvinner. Att avidentifiera tar bort personuppgiften och behåller händelsen |
| **Ett test per kolumn för radering** | En kolumn som läggs till i inkrement 4 eller 7 skulle kunna glömmas |

## Konsekvenser

**Fördelar**

- Varje personuppgift som inkrement 3 skapar har en lagringstid eller en väg ut vid radering.
- Ingen kan lämna ett namn på en annan persons adress.
- Testet för radering täcker också kolumner som läggs till senare.

**Nackdelar och risker**

- **Rensningen rör Supabases eget schema `auth`.** Att jobbet i `pg_cron` får radera i `auth.users` och `auth.audit_log_entries` är inte verifierat mot ett riktigt projekt. Om det inte får det, görs raderingen av en Edge Function med Supabases admin-API, startad av `pg_cron` via `pg_net`, på samma sätt som sista steget i `delete_my_account`. Det prövas i delsteg 3b.
- **Supabase kan ändra sitt schema.** Kolumnnamnen i `auth.audit_log_entries` och var aktörens id ligger i loggposten prövas i 3b och kan ändras vid en uppgradering av Supabase. Testet för rensningen fångar det.
- **En ledare som inte har öppnat appen på 180 dagar loggas ut** och behöver en ny kod. Det är längre än ett uppehåll mellan två säsonger, så det märks sällan.
- **Raderingsposten finns kvar i 90 dagar efter raderingen** med personens e-post. Det ska stå i integritetspolicyn (fas 5).
- **`editor_events` växer utan gräns.** Raderna är små och få, en per utnämning, så det har ingen betydelse för gratisnivåns 500 MB.
- **Lagringstiderna ska stå i integritetspolicyn** (fas 5), tillsammans med dem i ADR 0003.
