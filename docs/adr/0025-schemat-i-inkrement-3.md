# 0025: Schemat i inkrement 3 och sparade pass medan banken är inbyggd

Status: föreslagen. Kompletterar entiteterna i ADR 0003 och gäller till och med inkrement 3, så länge ADR 0015 gäller

## Kontext

ADR 0003 (beslutad vid K2) beskriver hela datamodellen för version 1. Där refererar ett moment i ett sparat pass till sin övning med `session_items.exercise_id`, en främmande nyckel mot `exercises`, och bär en ögonblicksbild i `exercise_snapshot`.

I inkrement 3 finns ingen bankövning i databasen. Enligt ADR 0015 är banken inbyggd i appen till och med inkrement 3, och flytten till Supabase kräver en egen ADR innan inkrement 4 kodas. Tabellen `exercises` innehåller alltså inga rader med `scope = 'bank'`, och `exercise_id` har inget att peka på.

Säkerhetsgranskningen av kriterierna för inkrement 3 (`docs/sakerhet/granskning-inkrement-3-krav.md`) tillkommer:

- **S-38 (hög):** ögonblicksbilderna och underlaget i ett sparat pass har ingen storleksgräns, och antalet moment per pass inget tak. Ett skript kan fylla gratisnivåns 500 MB inom minuter.
- **S-39 (medel):** klienten skriver ögonblicksbilden. En ledare kan skriva in `status: godkand` och en skiss med namn i etiketterna. Användaren har beslutat (avsnitt 6, punkt 8) att strukturen kontrolleras i databasen och att restrisken dokumenteras.

Produktägaren frågade dessutom vilka tabeller den första migrationen skapar (backlogens översikt för inkrement 3).

## Beslut

### 1 Hur ett moment refererar till sin övning

`session_items` får två kolumner utöver dem i ADR 0003:

| Kolumn | Typ | Innehåll |
|---|---|---|
| `exercise_scope` | `text`, `'bank'` eller `'club'`, null när momentet saknar övning | Var övningen kommer ifrån |
| `exercise_source_id` | `text`, null utom för bankövningar | Bankövningens stabila id, samma som `id` i filen i `content/ovningar/` |

Regler, upprätthållna med `check`:

- `exercise_scope = 'bank'` kräver att `exercise_source_id` är satt och har samma format som övningsschemat kräver av ett id, och att `exercise_id` är null i inkrement 3.
- `exercise_scope = 'club'` används först i inkrement 4. I inkrement 3 nekas värdet.
- `exercise_snapshot` är satt om och bara om `exercise_scope` är satt.

`exercise_source_id` har ingen främmande nyckel, eftersom banken inte finns i databasen. När banken flyttar till Supabase fyller den ADR som beslutar flytten i `exercise_id` genom en koppling på `exercises.source_id`. Ögonblicksbilden är fortfarande det som visas.

**Ögonblicksbilden är det enda som visas** (berättelse 05, kriterium 8, R-102). Ett sparat pass läser aldrig den inbyggda banken. Ändras eller tas en övning bort ur banken påverkas inte passet.

**Det som sparas för passet** utöver kolumnerna i ADR 0003, för att 05.1 ska gälla: `requested_minutes` och `total_minutes` (heltal), `swapped` (sanningsvärde, R-105) och `notices` (jsonb, en lista med par av `kind` och `regel`). Per moment sparas `kind`, `block`, `station`, `station_minutes` och `layout` från motorns `Row` (ADR 0011 avsnitt 3), utöver `position`, `part` och `minutes`.

### 2 Ögonblicksbildens innehåll och kontroll (S-39)

**I klienten.** Ögonblicksbilden skapas med `publishExercise` och innehåller bara fälten i `PUBLISHED_FIELDS` (ADR 0015, S-27). Ett lagrat pass läses tillbaka genom samma schema, samma vitlista och `readPlanskiss` som banken (ADR 0016), och slutkontrollen körs på det som lästes (berättelse 05, kriterium 7). `swapped` från databasen släpper bara R-035 och R-036 (R-105, säkerhetsgranskningen av 2b, F3).

**I databasen.** Strukturen kontrolleras när raden skrivs:

- `exercise_snapshot` får bara ha nycklar ur `PUBLISHED_FIELDS`. Listan i migrationen genereras ur `src/regelmotor/schema/published.ts`, och CI underkänner bygget om de skiljer sig åt.
- Fältens typer kontrolleras med tillägget `pg_jsonschema` mot ett JSON-schema som genereras ur övningsschemat i Zod. Samma CI-kontroll gäller schemat.
- `training_sessions.input` får bara ha nycklarna i `INPUT_FIELDS` (`src/regelmotor/types.ts`), med tal eller de uppräknade värdena.

Om `pg_jsonschema` inte finns i det riktiga projektet skrivs kontrollen som en trigger i PL/pgSQL med samma regler. Det avgörs i 3b.

**Restrisken.** Databasen kan pröva att en ögonblicksbild har rätt form, men inte att innehållet är bankens. En ledare som skriver direkt mot databasen kan spara ett pass med en påhittad övning som har `status: godkand` och en skisstext med spelarnamn. Passet syns bara för ledaren själv eller för lagets ledare. Slutkontrollen hindrar fortfarande att ett pass som bryter mot säkerhetsreglerna visas som vanligt pass, men den prövar uppgifter som den som skriver styr över. Regeln om mänskligt godkännande gäller banken, inte vad en ledare skriver i sitt eget lags pass. Det här är en accepterad restrisk (användarens beslut 2026-10-13).

### 3 Gränser för storlek och antal (S-38)

Upprätthålls i databasen med `check` eller trigger, med ett pgTAP-test per gräns:

| Gräns | Värde |
|---|---|
| `octet_length(exercise_snapshot::text)` | under 100 000 byte, samma som övningsdokumentet (ADR 0003 punkt 9) |
| `octet_length((exercise_snapshot -> 'planskiss')::text)` | under 8 192 byte (ADR 0012, berättelse 28, kriterium 11) |
| `octet_length(input::text)` | under 2 000 byte |
| `octet_length(notices::text)` | under 4 000 byte |
| `octet_length(layout::text)` | under 2 000 byte |
| Moment per pass (`session_items` per `session_id`) | högst 40 |
| Passnamn | högst 100 tecken (ADR 0003, oförändrat) |
| Sparade pass per ledare och dygn | högst 200 (ADR 0003, oförändrat) |

Storleken mäts som text och inte med `pg_column_size`, så att en lätt komprimerbar ögonblicksbild inte slinker igenom (berättelse 28, kriterium 11).

Taket på 40 moment förutsätter att generatorn aldrig gör fler. Ett test i Vitest prövar det över de underlag som egenskapstesterna redan använder. Visar testet att 40 inte räcker höjs taket i samma pull request, och värdet står i rapporten.

### 4 Tabellerna som skapas i delsteg 3b

Allt skapas med åtkomstregler på radnivå och pgTAP-tester enligt ADR 0003 och berättelse 28, i flera migrationsfiler i samma pull request:

| Migration | Tabeller och annat |
|---|---|
| Grund | Hjälpfunktionerna `is_club_member`, `is_club_admin`, `is_team_member`, `is_editor` och, om provet håller, `session_is_active` (ADR 0023 avsnitt 3). Förvalda rättigheter för `anon` och `public` tas bort |
| Konton och klubbar | `profiles`, `clubs`, `club_members`, `teams`, `team_members`, `editors`, `editor_events` |
| Inbjudningar | `invitations`, med kolumnen `emailed_at` för gränsen per klubb, och `invitation_attempts` (ADR 0023 avsnitt 4) |
| Sparade pass | `training_sessions`, `session_items` enligt avsnitt 1–3 |
| Övningar och kö | `exercises`, `submissions`, `submission_events`. Tomma i inkrement 3 och utan gränssnitt, men med åtkomstregler, tak och spärren mot `planskiss` i klubbövningar (berättelse 28, kriterium 10), eftersom ett tak är dyrt att lägga till i efterhand (ADR 0003 punkt 9) |
| Rensning | Jobbet i `pg_cron` med lagringstiderna i ADR 0003 och ADR 0024 |

**Skapas inte i inkrement 3:**

- `season_plans` och `season_plan_entries`, som hör till inkrement 7.
- Databasrollen `importer` och `import_bank_exercises`. De behövs först när banken flyttar till Supabase, och tas med i den ADR som beslutar det.

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Importera banken till databasen redan i inkrement 3** så att `exercise_id` får något att peka på | Det är flytten som ADR 0015 lämnar till en egen ADR före inkrement 4. Den kräver importrollen, en GitHub-miljö och synk till IndexedDB, och skulle dubbla källorna till banken under en period |
| **Lägga bankens id i `exercise_snapshot` och inte i en egen kolumn** | Kopplingen till `exercises.source_id` när banken flyttar skulle läsa jsonb, och ingen `check` kunde kräva att id:t finns |
| **Spara passet som ett enda jsonb-dokument** | ADR 0003 har rader per moment, och säsongsplanen och listorna behöver kolumner. Gränsen per ögonblicksbild blir också svårare att uttrycka |
| **Ingen kontroll av strukturen i databasen**, bara i klienten | Användaren har beslutat att kontrollen ska finnas i databasen (S-39, punkt 8) |
| **Skapa alla tabeller i version 1 nu, också säsongsplanen** | Tabeller utan användning i flera inkrement blir otestade. Taket och åtskillnaden är det som är dyrt att lägga till senare, och de gäller övningarna, inte säsongsplanen |

## Konsekvenser

**Fördelar**

- Ett sparat pass är självbärande och fungerar utan att banken finns i databasen. Flytten av banken kräver ingen ändring av redan sparade pass, bara att `exercise_id` fylls i.
- Ingen enskild ledare kan fylla databasen med stora pass.
- Strukturen i ögonblicksbilden kontrolleras på båda sidor, mot samma vitlista och samma schema.

**Nackdelar och risker**

- **Två kontroller av samma struktur.** Schemat i Zod och JSON-schemat i databasen kan glida isär. CI-kontrollen i avsnitt 2 är det som hindrar det, och den måste finnas från första migrationen.
- **En ändring av övningsschemat blir en migration.** Ett nytt publicerat fält kräver en ny migration som byter JSON-schemat. Redan sparade pass ändras inte, eftersom kontrollen bara körs när en rad skrivs.
- **`pg_jsonschema` är inte verifierat** i det riktiga projektet. Reserven är en trigger.
- **Restrisken i avsnitt 2** finns kvar: innehållet i ett lags pass bygger på förtroende inom laget.
- **ADR 0003 läses tillsammans med den här.** Dess entitet `SESSION_ITEMS` gäller med kolumnerna i avsnitt 1 tillagda. ADR 0003 får ingen ny status, eftersom inget av dess beslut ersätts.
