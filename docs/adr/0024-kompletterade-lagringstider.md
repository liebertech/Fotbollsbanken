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

Användaren har beslutat (2026-10-13, avsnitt 6 i granskningen): obekräftade konton rensas efter 24 timmar (punkt 5), och Auths granskningslogg behålls i databasen och rensas efter 90 dagar (punkt 4). Samma dag godkände användaren också två förslag som den här ADR:n lägger fram: att `editor_events` sparas utan tidsgräns men avidentifieras vid radering, och att `invitation_attempts` rensas efter 24 timmar.

ADR 0003 ändras inte. Tabellerna nedan ska läsas som tillägg till tabellerna *Lagringstider* och *Radering av konto* där.

## Beslut

### 1 Profilen skapas först när adressen är bekräftad

- Triggern som skapar raden i `profiles` (ADR 0004 punkt 1) körs när `auth.users.email_confirmed_at` går från null till ett värde, och vid insättning bara om värdet redan är satt. En beställd men obekräftad kod lämnar alltså ingen profil.
- Profilen skapas med `on conflict do nothing`. En ny registrering med en adress som redan har ett konto skriver aldrig över namnet.
- Namnet läses ur `raw_user_meta_data` en gång, när profilen skapas. Därefter ändras det bara av personen själv.

### 2 Nya lagringstider

| Vad | Tid | Vad som händer |
|---|---|---|
| Obekräftade konton (`auth.users` med `email_confirmed_at is null`) | **24 timmar** efter `created_at` | Raden raderas hårt. Det finns ingen profil och inget annat innehåll att ta hänsyn till |
| Auths granskningslogg (`auth.audit_log_entries`) | **90 dagar** | Raderas hårt |
| Misslyckade försök med inbjudningsnyckel (`invitation_attempts`, ADR 0023 avsnitt 4) | **24 timmar** (användarens beslut 2026-10-13) | Raderas hårt. Spärren behöver bara den senaste timmen |
| Händelser för redaktörer (`editor_events`) | **Utan tidsgräns** (användarens beslut 2026-10-13). Personens id avidentifieras vid radering, se avsnitt 3 | Raderna behålls. De visar vem som utsett eller återkallat en redaktör, och utan dem går en ändring i den gemensamma bankens redaktörer inte att följa |

Rensningen görs av samma dagliga `pg_cron`-jobb som i ADR 0003. Jobbet loggar bara antalet raderade rader per tabell, aldrig id:n eller adresser (berättelse 29, kriterium 5).

Gränsen per klubb för inbjudningsmejl (ADR 0004 punkt 6) och gränsen för sparade pass per dygn (ADR 0003 punkt 9) räknas på `invitations` och `training_sessions` och kräver ingen egen spärrdata.

### 3 Radering av konto: fler kolumner avidentifieras och fler rader raderas

Tillägg till stegen i ADR 0003, *Radering av konto*:

| Steg | Vad som tillkommer |
|---|---|
| Raderas | Personens rader i `invitation_attempts`. Rader i `auth.audit_log_entries` där personen är aktör |
| Avidentifieras | `invitations.invited_by`, `clubs.created_by`, `editors.appointed_by`, och `actor_id` och `subject_id` i `editor_events` sätts till null |

Supabase raderar själv personens rader i `auth.sessions` och `auth.refresh_tokens` när raden i `auth.users` tas bort.

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
- **`editor_events` växer utan gräns.** Raderna är små och få, en per utnämning, så det har ingen betydelse för gratisnivåns 500 MB.
- **Lagringstiderna ska stå i integritetspolicyn** (fas 5), tillsammans med dem i ADR 0003.
