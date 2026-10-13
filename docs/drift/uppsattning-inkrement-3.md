Status: utkast (2026-10-13), underlag för delsteg 3a i inkrement 3. Rättad efter säkerhetsgranskningen `docs/sakerhet/granskning-eslint10-och-uppsattning.md` (S-61–S-73) och omgranskningen `docs/sakerhet/granskning-uppsattning-och-adr-0023-0025.md` (S-74–S-76)

# Uppsättning av externa tjänster för inkrement 3

Den här listan är till för dig som användare. Den beskriver vad du sätter upp i Supabase, Brevo, Cloudflare och GitHub så att bygget av konton kan provas mot staging. Gör stegen i den ordning de står. Allt ska ligga på gratisnivå (ADR 0002).

Två markeringar återkommer:

- **Stopp:** här kan en tjänst be om kort eller föreslå en betalplan, eller så ska du säga till innan du går vidare. Fortsätt inte utan ett eget beslut.
- **Väntar:** steget görs inte nu. Det står när det ska göras: i delsteg 3b eller 3c, eller vid K5.

Underlag:
- backlogens översikt för inkrement 3
- ADR 0002, 0003, 0004 och 0023
- säkerhetsgranskningarna av kriterierna för inkrement 3 och av den här listan
- dina beslut 2026-10-13

Vägarna i webbgränssnitten är hämtade ur tjänsternas dokumentation 2026-10-13 och har inte prövats i ett riktigt konto. Menyer byter ofta namn. Om en väg inte stämmer, leta efter inställningens namn, som står i fetstil. Det som inte gick att kontrollera finns samlat i [Inte kontrollerat](#inte-kontrollerat) sist.

## Översikt

| Steg | Vad | När |
|---|---|---|
| 0 | Hemligheter och tvåstegsverifiering | Nu |
| 1 | Supabase: konto och två projekt | Nu |
| 2 | Supabase: inloggning med engångskod, registreringen **av** | Nu |
| 3 | Brevo och SMTP, därefter gränserna i Supabase | Nu |
| 4 | Sessioner: 15 minuter i staging | Nu. Produktionen väntar på provet i staging |
| 5 | Cloudflare Turnstile | Nu |
| 6 | Adresser för inloggningen i Supabase | Nu |
| 7 | Publika värden i Cloudflare Pages | Nu |
| 8 | GitHub-miljöer och hemligheter | Nu. `IMPORTER_DB_URL` väntar på ADR:n om bankens flytt |
| 9 | Det dagliga anropet som håller produktionen vaken | Variabler nu. Arbetsflödet byggs i 3b |
| 10 | Vitlistan för registrering | **Väntar** till 3b |
| 11 | Lösenordet för `importer` | **Väntar** på ADR:n om bankens flytt, tidigast inför inkrement 4 |
| 12 | Slå på registreringen i produktionen | **Väntar** till K5 |

## 0. Före start

### 0.1 Hemligheter och chatten

Vissa uppgifter är publika och får lämnas till senior-systemutvecklare i en chatt eller i ett ärende. Andra är hemliga och får **aldrig klistras in i en chatt** med Claude eller någon annan, aldrig skrivas i ett ärende eller i en commit och aldrig ligga i repot, som är publikt. Lägg dem direkt där de ska användas: i Supabase, i GitHub-hemligheter eller i en lösenordshanterare.

| Uppgift | Publik eller hemlig | Var den ska ligga |
|---|---|---|
| Supabase-projektets adress (`https://<ref>.supabase.co`) och projekt-ref | Publik | Lämnas till senior-systemutvecklare. Läggs i Cloudflare Pages miljövariabler |
| Supabase **publishable key** (`sb_publishable_…`), eller äldre `anon` | Publik, avsedd för klientbygget | Samma som ovan |
| Turnstile **site key** | Publik | Samma som ovan |
| Regionen som valdes för varje projekt | Publik | Lämnas till senior-systemutvecklare |
| Databasens lösenord, och varje anslutningssträng som innehåller det | **Hemlig** | Lösenordshanterare, och GitHub-hemlighet i en miljö (steg 8). Aldrig som hemlighet direkt på repot |
| Lösenordet för databasrollen `importer` | **Hemlig** | Sätts av dig själv med `\password` i `psql` eller som SCRAM-hash (steg 11). Aldrig i klartext i SQL-editorn, i en migration eller i repot |
| Supabase **secret key** (`sb_secret_…`) och äldre `service_role` | **Hemlig**. Går förbi alla åtkomstregler | Ingenstans utanför Supabase. Edge Functions får den automatiskt. Aldrig i CI (ADR 0003) |
| JWT-hemligheten (äldre JWT Secret) | **Hemlig**. Kan signera en nyckel för vilken roll som helst | Ingenstans. Rör den inte |
| Supabase personlig åtkomsttoken (Account → Access Tokens) | **Hemlig**. Gäller alla projekt i kontot | Skapa ingen, utom i reservfallet i steg 2, och då tas den bort samma dag |
| Brevo **SMTP-nyckel** | **Hemlig** | Bara i Supabase, i SMTP-inställningarna |
| Brevo **API-nyckel** | **Hemlig** | Bara som hemlighet för Edge Functions i Supabase (steg 3.1) |
| Turnstile **secret key** | **Hemlig** | Bara i Supabase, i inställningen för CAPTCHA |
| Cloudflare API-token | **Hemlig** | Bara som GitHub-hemlighet, om den alls behövs (steg 8) |

Om en hemlig uppgift ändå hamnar i en chatt, ett ärende eller en commit ska den bytas ut direkt i tjänsten. Att ta bort texten räcker inte.

### 0.2 Tvåstegsverifiering (S-68)

Slå på tvåstegsverifiering i varje konto innan du skapar något där. Konton med tillgång till databaserna och mejlen är de mest värdefulla att ta över.

- **GitHub:** kontrollera under **Settings → Password and authentication** att tvåstegsverifiering är på.
- **Supabase:** **Account → Security** (steg 1).
- **Brevo:** **My profile → Security** eller **Account settings → Security** (steg 3).
- **Cloudflare:** **My Profile → Authentication → Two-Factor Authentication** (steg 5).
- **E-postkontot** du använder för tjänsterna, och för dina egna inloggningar i appen (S-75). Den som tar över e-posten kan återställa lösenordet i alla tjänster ovan och ta emot inloggningskoderna.
- **Lösenordshanteraren** där databaslösenorden ligger (S-75).

## 1. Supabase: konto och två projekt

**Mål:** två projekt i EU på gratisplanen, `fotbollsbanken-staging` och `fotbollsbanken-prod`.

1. Skapa ett konto på <https://supabase.com/dashboard>. Slå på tvåstegsverifiering under **Account → Security**.
2. Skapa en organisation och välj planen **Free**.
   - **Stopp:** om dialogen bara erbjuder Pro, Team eller en plan med kort, avbryt. Gratisplanen ska gå att välja utan kort.
3. **New project** för `fotbollsbanken-staging`:
   - **Database Password:** låt Supabase generera ett och spara det direkt i din lösenordshanterare.
   - **Region:** `North EU (Stockholm)` (`eu-north-1`) om den finns, annars `Central EU (Frankfurt)` (`eu-central-1`). Aldrig en region utanför EU. Skriv upp vilken du valde.
   - Behåll **Data API** påslaget med schemat `public` om dialogen frågar.
   - Slå på automatiska åtkomstregler på radnivå (RLS) för nya tabeller om rutan finns.
   - **Stopp:** dialogen får inte visa något pris för beräkningsstorleken.
4. Upprepa steg 3 för `fotbollsbanken-prod`, med ett **eget** lösenord och samma region.
   - **Stopp:** gratisplanen har högst två aktiva projekt. Om Supabase säger att gränsen är nådd, byt inte plan. Säg till.
5. Hämta projektets adress och **publishable key** under **Project Settings → API Keys** (eller **Connect**). Supabase fasar ut de äldre nycklarna `anon` och `service_role` till slutet av 2026, så bygget använder publishable key.

## 2. Supabase: inloggning med engångskod (båda projekten)

Värdena kommer från ADR 0004 punkt 3, ADR 0023 avsnitt 1 och berättelse 08, kriterium 8.

| Inställning | Värde | Väg enligt dokumentationen |
|---|---|---|
| **Allow new users to sign up** | **Av** i båda projekten (S-61, S-65). Se nedan | **Authentication → Sign In / Providers**, överst |
| E-post som inloggningssätt | På | **Authentication → Sign In / Providers → Email** |
| **Confirm email** | På | Samma panel |
| **Email OTP Expiration** | `600` sekunder | Samma panel |
| **Email OTP Length** | `8` | Samma panel. Supabase tillåter 6–10 siffror |
| Inloggning med Google, Apple och andra | Av | **Authentication → Sign In / Providers** |
| **Anonymous sign-ins** | Av | Samma sida |

**Registreringen är av** tills den kan släppas fram under kontroll:

- **Staging:** av tills vitlistan i steg 10 är på plats och testet i berättelse 08, kriterium 15, är grönt (S-65).
- **Produktion:** av tills kontrollistan A–D i `docs/sakerhet/granskning-inkrement-3-krav.md` avsnitt 5 är avbockad. Därefter slås den på som ett eget steg vid K5 (steg 12, S-61).

Konton för dina egna prov i staging, innan vitlistan finns, skapar du under **Authentication → Users → Add user**. Ange din egen adress och bekräfta den direkt. Ett befintligt konto kan logga in med kod också när registreringen är av.

**Stopp om fältet för kodlängden saknas (S-64).** Om **Email OTP Length** inte finns i panelen, eller inte går att sätta till 8, ska du inte välja 6 siffror. Stanna och säg till. Kodlängden sätts då till 8 via Supabases Management API:
1. Skapa en personlig åtkomsttoken under **Account → Access Tokens** med namnet `otp-langd-<datum>` och den **kortaste giltighetstid** som går att välja.
2. Senior-systemutvecklare ger dig ett färdigt kommando som sätter `mailer_otp_length` till 8 för de två projekten. Du kör det själv på din dator. Kommandot läser token med en dold fråga, eller ur en variabel som du sätter just före, så att token aldrig skrivs på kommandoraden och aldrig hamnar i skalets historik (S-76). Klistra aldrig in den i chatten.
3. **Ta bort token samma dag**, under **Account → Access Tokens**, också om den har en kortare giltighetstid.

Sex siffror godtas inte (ADR 0023).

Mejlmallarna, där koden skrivs med `{{ .Token }}` och ingen länk finns med (ADR 0004 punkt 4), läggs in i delsteg 3c. Du behöver inte ändra dem nu.

**Auths granskningslogg** ska fortsätta skrivas till databasen, så att rensningen efter 90 dagar kan göras där (ADR 0024, S-70). Om det finns en inställning för att sluta skriva granskningsloggen till databasen, låt den vara av.

## 3. Brevo och SMTP

**Mål:** ett Brevo-konto på gratisplanen som skickar Supabases inloggningsmejl.

1. Skapa ett konto på <https://www.brevo.com> och välj planen **Free**, med 300 mejl per dag och utan kort. Slå på tvåstegsverifiering under kontots säkerhetsinställningar (S-68).
   - **Stopp:** om Brevo ber om kort eller föreslår Starter eller Business för att du ska kunna fortsätta, avbryt och säg till. Hoppa över erbjudanden om att köpa en domän eller en dedikerad IP-adress.
   - Brevo brukar kräva ett verifierat telefonnummer innan något får skickas. Det är gratis.
2. Lägg till en avsändare under **Senders, Domains & Dedicated IPs → Senders → Add a sender**. Namnet ska vara `Fotbollsbanken`, och adressen en som du har tillgång till.
3. **Utan egen domän** byter Brevo ut avsändaradressens domän mot en adress hos `brevosend.com`, till exempel `fotbollsbanken@<nummer>.brevosend.com`. **Det godtas tills leveransen är mätt** (berättelse 08, kriterium 14; ditt beslut 2026-10-13; S-70). Visar mätningen att koderna hamnar i skräpposten lyfts frågan om egen domän, som kostar pengar.
4. Under **SMTP & API → SMTP** står servern `smtp-relay.brevo.com`, porten `587` och ett inloggningsnamn. Tryck **Generate a new SMTP key** och ge den namnet `supabase-staging`. Nyckeln visas bara en gång.
5. Lägg in SMTP-uppgifterna i stagingprojektet: **Authentication → Emails → SMTP Settings**, och slå på **Enable custom SMTP**.
   - **Sender email:** adressen från punkt 2
   - **Sender name:** `Fotbollsbanken (test)`
   - **Host:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Username:** inloggningsnamnet från punkt 4
   - **Password:** nyckeln från punkt 4
6. Upprepa punkt 4–5 för produktionen med en egen nyckel, `supabase-prod`, och avsändarnamnet `Fotbollsbanken`.
7. Om Brevo säger att ”the transactional platform has not been activated”, skapa ett supportärende i Brevo och be om aktivering. Det kostar ingenting.

Båda projekten delar Brevos 300 mejl per dag. Mejl från staging går bara till dina egna testadresser och till testare som har samtyckt (beslut 9 i granskningen av kriterierna).

### 3.1 API-nyckel för inbjudningar

**Väntar** till delsteg 3d. Skapa då nyckeln under **SMTP & API → API Keys** med namnet `edge-invitation-staging`. Lägg den som hemligheten `BREVO_API_KEY` under **Edge Functions → Secrets** i stagingprojektet.

### 3.2 Gränser i Supabase (båda projekten)

Gränsen för e-post går att ändra först när egen SMTP är inlagd. Gå till **Authentication → Rate Limits**:

| Gräns | Värde | Varför |
|---|---|---|
| **Rate limit for sending emails** | `100` per timme | ADR 0004, *E-postbudget* |
| **Rate limit for token verifications** (per 5 minuter och IP-adress) | **`10`** | ADR 0023 avsnitt 1, S-40, S-62. Förvalet 30 är för högt |
| Minsta tid mellan kodbeställningar till samma adress | `60` sekunder | 08.8 (d). Om fältet finns ska det stå på 60 |

## 4. Sessioner (S-69)

**Authentication → Sessions**. I äldre gränssnitt ligger giltighetstiden under **Project Settings → JWT Keys**.

| Inställning | Staging | Produktion |
|---|---|---|
| **Access token (JWT) expiry time** | `900` sekunder nu | Lämna `3600` tills vidare. **Väntar:** sätt `900` när provet i staging är godkänt i 3c (ADR 0023 avsnitt 2) |
| **Detect and revoke potentially compromised refresh tokens** | På | På |
| **Time-box user sessions** och **Inactivity timeout** | Rör inte | Rör inte |

**Stopp:** sessioner med fast livslängd och utloggning efter inaktivitet kräver Pro.

## 5. Cloudflare Turnstile

**Mål:** en widget för produktion och en för staging. Turnstile är gratis för obegränsat antal kontroller, med upp till 20 widgetar och 10 värdnamn per widget.

1. Logga in på <https://dash.cloudflare.com> och slå på tvåstegsverifiering under **My Profile → Authentication** om den inte redan är på (S-68).
2. **Turnstile → Add widget**:
   - **Widget name:** `fotbollsbanken-prod`
   - **Hostnames:** `fotbollsbanken.pages.dev`
   - **Widget Mode:** **Managed**
   - **Pre-clearance:** No
   - **Stopp:** Turnstile kräver inget kort. Om du ombeds lägga till betalning har du hamnat i en annan tjänst.
3. Skapa en andra widget, `fotbollsbanken-staging`, också den med `fotbollsbanken.pages.dev`. Förhandsadresserna `<gren>.fotbollsbanken.pages.dev` är underdomäner, och ett värdnamn gäller också sina underdomäner.
   - **Överlappet godtas (S-71):** båda widgetarna gäller i praktiken samma adresser, så en token från den ena kan prövas mot den andra. Det godtas tills det finns en egen domän, som skiljer produktionen från förhandsadresserna.
4. Efter att widgeten skapats visas **Site Key** och **Secret Key**. Site key är publik och lämnas till senior-systemutvecklare.
5. I Supabase: **Authentication → Attack Protection** (äldre: **Auth → Settings → Bot and Abuse Protection**). Slå på **Enable Captcha protection**, välj **Turnstile by Cloudflare** och klistra in respektive widgets **Secret Key** i rätt projekt.

När CAPTCHA är på nekar Supabase varje kodbeställning som saknar en Turnstile-token, också innan appen har stöd för den.

## 6. Adresser för inloggningen (S-73)

**Authentication → URL Configuration**, i båda projekten:

- **Site URL:** produktionsadressen i produktionen, `https://fotbollsbanken.pages.dev`. I staging en förhandsadress som du får av senior-systemutvecklare.
- **Redirect URLs:** bara **exakta** adresser, till exempel `https://fotbollsbanken.pages.dev`. Använd **aldrig** en stjärna, som `https://*.fotbollsbanken.pages.dev` eller `https://*.pages.dev`. Med en stjärna kan vem som helst som kan skapa en sida på `pages.dev` ta emot en inloggning. Koden skickas som siffror, så inloggningen använder inga omdirigeringar, men en bred adress får ändå inte finnas.

## 7. Cloudflare Pages: publika värden i bygget

**Workers & Pages → fotbollsbanken → Settings → Variables and Secrets** (äldre: **Environment variables**). Lägg in värdena som **Text**, inte **Secret**, eftersom de ändå hamnar i det publika bygget.

| Namn | Production | Preview |
|---|---|---|
| `VITE_SUPABASE_URL` | prod-projektets adress | staging-projektets adress |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | prod-projektets publishable key | staging-projektets publishable key |
| `VITE_TURNSTILE_SITE_KEY` | prod-widgetens site key | staging-widgetens site key |

Lägg aldrig en hemlighet här. Allt som börjar med `VITE_` kan läsas av alla. Om Pages-projektet inte finns ännu, säg till.

## 8. GitHub: miljöer och hemligheter (S-66, S-67)

Lägg anslutningssträngarna i **miljöer** under **Settings → Environments → New environment**, aldrig som hemligheter direkt på repot.

| Miljö | Skydd | Hemlighet | Behövs från |
|---|---|---|---|
| `staging` | **Required reviewers:** du själv. **Deployment branches:** bara `main` och `feature/*` | `STAGING_DB_URL` | Delsteg 3b |
| `produktion` | **Required reviewers:** du själv. **Deployment branches:** bara `main` | `PROD_DB_URL` | Delsteg 3b |
| `produktion` | Samma | `IMPORTER_DB_URL` | **Väntar** på ADR:n om bankens flytt, se steg 11. Läggs **bara** i `produktion`, inte i `godkannande` (S-67) |

I båda miljöerna:

- **Stäng av förbikopplingen för administratörer.** Kryssa ur **Allow administrators to bypass configured protection rules**. Annars kan ditt eget konto köra förbi granskningen.
- **Slå inte på *Prevent self-review*.** Du är den enda granskaren, och med den inställningen skulle du inte kunna godkänna körningar som du själv har startat.

Anslutningssträngen hämtas i Supabase under **Connect → Session pooler**. Byt `[YOUR-PASSWORD]` mot lösenordet **direkt i GitHub-fältet**, inte i en chatt eller i en textfil som synkas.

En anslutningssträng med databasens lösenord ger full åtkomst till databasen. Därför ligger den bara i en miljö med granskare. Supabases personliga åtkomsttoken används inte, eftersom den gäller alla projekt i kontot.

**Restrisk:** `gh` är inloggat med ditt konto, så det är tekniskt möjligt att godkänna en körning via API:t. Det hindras bara av regeln i `CLAUDE.md` att bara du godkänner miljöer, och bara i webbläsaren.

**Cloudflare:** om Pages bygger direkt från GitHub behövs ingen Cloudflare-token i GitHub. Behövs en senare ska den bara ha behörigheten **Account → Cloudflare Pages → Edit** och heta `CLOUDFLARE_API_TOKEN`.

## 9. Det dagliga anropet som håller produktionen vaken (S-72)

Supabase pausar ett gratisprojekt efter sju dagar med för lite aktivitet. Du beslutade 2026-10-13 att ett dagligt anrop ska hålla produktionen vaken.

**Upplägg:** ett schemalagt arbetsflöde i GitHub Actions gör en lätt läsning mot produktionen en gång per dygn med den publika nyckeln. Senior-systemutvecklare väljer i 3b ett anrop som fungerar **utan att rollen `anon` får några rättigheter** i databasen. Att ge `anon` rättigheter bara för det här anropet är uteslutet, eftersom det skulle öppna en väg in för vem som helst (S-42).

**Det du gör nu:** lägg in två **variabler**, inte hemligheter, eftersom värdena är publika. Vägen är **Settings → Secrets and variables → Actions → Variables → New repository variable**:

- `SUPABASE_PROD_URL`
- `SUPABASE_PROD_PUBLISHABLE_KEY`

**Begränsningar:**
- GitHub stänger av schemalagda arbetsflöden i ett publikt repo efter 60 dagar utan aktivitet. GitHub mejlar då, och arbetsflödet startas om under **Actions → Enable workflow**. Supabase varnar också ungefär en vecka innan ett projekt pausas.
- Staging hålls inte vaken. Starta det med **Resume project** när det behövs.

## 10. Vitlistan för registrering (väntar till 3b)

**Väntar** tills senior-systemutvecklare har byggt hooken *Before User Created* i delsteg 3b. Hooken släpper bara igenom adresser som står i en tabell i databasen. Adresserna ligger aldrig i repot, eftersom de är personuppgifter och repot är publikt.

När hooken finns:
1. **Authentication → Hooks → Before User Created:** välj funktionen som senior-systemutvecklare anger, i båda projekten.
2. Lägg in dina egna adresser i vitlistan med SQL-editorn, med det kommando du får. I produktionen bara dina egna adresser (S-61). I staging dina egna och testare som har samtyckt.
3. **Staging:** när testet i berättelse 08, kriterium 15, är grönt slår du på **Allow new users to sign up** i staging.
4. **Produktion:** registreringen förblir **av** (steg 12).

## 11. Lösenordet för `importer` (väntar på ADR:n om bankens flytt, S-63, S-74)

**Väntar** tills den ADR som flyttar banken till Supabase är beslutad och migrationen som skapar rollen har körts. Det är tidigast inför inkrement 4, inte direkt efter 3b. Migrationen skapar rollen `importer` **utan lösenord**, och CI underkänner en migration som innehåller `password`.

När rollen finns:
1. Generera ett långt lösenord i din lösenordshanterare.
2. Sätt lösenordet så att det aldrig står i klartext i Supabase (S-74). Skriv det **inte** i SQL-editorn i dashboarden, eftersom den kan spara frågor och Postgres kan logga `ALTER ROLE … PASSWORD`. Gör i stället på ett av två sätt, med de kommandon du får av senior-systemutvecklare:
   - anslut med `psql` från din dator och kör `\password importer`. Då frågar `psql` efter lösenordet utan att visa det och skickar bara en hash till servern, eller
   - räkna fram en SCRAM-hash av lösenordet lokalt och skriv bara hashen i `ALTER ROLE`.
3. Bygg anslutningssträngen för session-poolern med användaren `importer` och lägg den som `IMPORTER_DB_URL` i miljön `produktion`, och bara där.

## 12. Registreringen i produktionen (väntar till K5, S-61)

**Väntar** till K5. Registreringen i produktionen slås på först när:
- kontrollistan A–D i `docs/sakerhet/granskning-inkrement-3-krav.md` avsnitt 5 är avbockad: biträdesavtalen, lagringsorten, integritetspolicyn och rutinerna, och den tekniska kontrollen mot produktionsprojektet
- du har godkänt det vid K5

Då slår du på **Allow new users to sign up** i produktionen. Vad som händer med vitlistan beslutas samtidigt.

## Det här lämnar du till senior-systemutvecklare

När steg 1–9 är klara, lämna följande i chatten. Allt är publikt:

- regionen för varje projekt
- projektens adresser och projekt-ref
- om fältet **Email OTP Length** fanns och vilket värde som sparades
- en skärmdump av **Rate Limits** och av **Authentication → Sessions**
- om Brevo bytte ut avsändaradressen mot en `brevosend.com`-adress i ett provmejl

Lämna inga nycklar, lösenord eller anslutningssträngar.

## Inte kontrollerat

Följande kunde inte bekräftas mot tjänsternas dokumentation 2026-10-13. Det prövas mot de riktiga projekten i delsteg 3b och 3c.

1. **Kodlängden i webbgränssnittet.** Supabases referens för `config.toml` anger `otp_length` med tillåtna värden 6–10, men fältets namn och plats i panelen kommer från en tredjepartskälla. Reservvägen med Management API står i steg 2. Namnet på fältet i API:t, `mailer_otp_length`, är inte bekräftat.
2. **Verifieringar och koder.** Supabase har en gräns per IP-adress, som sätts till 10 i steg 3.2, men ingen gräns per kod. Om en ny kod gör den förra ogiltig prövas i testet för 08.8 (c). Restrisken är räknad i ADR 0023 avsnitt 1.
3. **Minsta tid mellan kodbeställningar.** Dokumentationen säger att den är 60 sekunder per användare och går att ändra, men inte var.
4. **Brevo.** Brevos hjälpsidor svarade HTTP 403. Bytet till `brevosend.com` kommer från sökresultat och tredjepartsguider. Om bytet är tillfälligt, och om transaktionsplattformen måste aktiveras via support, är inte bekräftat.
5. **Turnstile och underdomäner.** Säkerhetsgranskningen anger att ett värdnamn gäller också sina underdomäner. Det är inte prövat med en riktig förhandsadress.
6. **Hooken *Before User Created*** ingår i gratisplanen enligt säkerhetsgranskningen. Det är inte prövat i ett riktigt projekt.
7. **Inställningen för Auths granskningslogg.** Om den finns och vad den heter är inte bekräftat.
8. **Menyvägarna** har inte följts i ett riktigt konto.
9. **Paus vid inaktivitet.** Dokumentationen säger inte exakt vilka anrop som räknas.

## Källor

- Supabase, engångskod via e-post: <https://supabase.com/docs/guides/auth/auth-email-passwordless>
- Supabase, gränser i Auth: <https://supabase.com/docs/guides/auth/rate-limits>
- Supabase, sessioner: <https://supabase.com/docs/guides/auth/sessions>
- Supabase, egen SMTP: <https://supabase.com/docs/guides/auth/auth-smtp>
- Supabase, CAPTCHA: <https://supabase.com/docs/guides/auth/auth-captcha>
- Supabase, API-nycklar: <https://supabase.com/docs/guides/api/api-keys>
- Supabase, konfigurationsreferens för CLI: <https://supabase.com/docs/reference/cli/config-reference>
- Supabase, paus av gratisprojekt: <https://supabase.com/docs/guides/platform/free-project-pausing>
- Cloudflare Turnstile, planer: <https://developers.cloudflare.com/turnstile/plans/>
- Brevo, autentisering av domän (403 vid kontrollen, innehållet via sökresultat): <https://help.brevo.com/hc/en-us/articles/17286219877778>
- Brevo, SMTP för transaktionsmejl (via sökresultat): <https://help.brevo.com/hc/en-us/articles/7924908994450>
- Tredjepartskälla om kodlängden: <https://dev.to/incultnitollc/your-otp-regex-assumes-six-digits-supabase-magic-links-dont-33i1>
- Säkerhetsgranskningar: `docs/sakerhet/granskning-inkrement-3-krav.md` (på `krav/inkrement-3`) och `docs/sakerhet/granskning-eslint10-och-uppsattning.md`
