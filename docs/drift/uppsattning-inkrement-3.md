Status: utkast (2026-10-13), underlag för delsteg 3a i inkrement 3

# Uppsättning av externa tjänster för inkrement 3

Den här listan är till för dig som användare. Den beskriver vad du behöver sätta upp i Supabase, Brevo, Cloudflare och GitHub innan bygget av konton kan provas mot staging. Allt ska ligga på gratisnivå (ADR 0002). Varje ställe där en tjänst kan be om kort eller föreslå en betalplan är markerat med **Stopp**. Där ska du inte gå vidare utan att först fatta ett eget beslut.

Underlag: backlogens översikt för inkrement 3 (`docs/krav/backlog.md` på `krav/inkrement-3`), ADR 0002, 0003 och 0004 och dina beslut 2026-10-13:

- tjänsterna sätts upp nu
- bygget görs mot lokal databas och staging tills avtalen är granskade
- inloggningskoden ska ha 8 siffror om Supabase tillåter det
- ett dagligt anrop ska hålla produktionsdatabasen vaken

Vägarna i webbgränssnitten är hämtade ur tjänsternas dokumentation 2026-10-13 och har inte prövats i ett riktigt konto. Menyer byter ofta namn. Om en väg inte stämmer, leta efter inställningens namn, som står i fetstil. Det som inte gick att kontrollera finns samlat i avsnittet [Inte kontrollerat](#inte-kontrollerat) sist.

## Före start: hemligheter och chatten

Vissa uppgifter är publika och får lämnas till senior-systemutvecklare i en chatt eller i ett ärende. Andra är hemliga och får **aldrig klistras in i en chatt** med Claude eller någon annan, aldrig skrivas i ett ärende eller i en commit och aldrig ligga i repot. Lägg dem direkt där de ska användas: i Supabase, i GitHub-hemligheter eller i en lösenordshanterare.

| Uppgift | Publik eller hemlig | Var den ska ligga |
|---|---|---|
| Supabase-projektets adress (`https://<ref>.supabase.co`) och projekt-ref | Publik | Lämnas till senior-systemutvecklare. Läggs i Cloudflare Pages miljövariabler |
| Supabase **publishable key** (`sb_publishable_…`), eller äldre `anon` | Publik, avsedd för klientbygget | Samma som ovan |
| Turnstile **site key** | Publik | Samma som ovan |
| Regionen som valdes för varje projekt | Publik | Lämnas till senior-systemutvecklare |
| Databasens lösenord, och varje anslutningssträng som innehåller det | **Hemlig** | Lösenordshanterare, och GitHub-hemlighet i en miljö (steg 6) |
| Supabase **secret key** (`sb_secret_…`) och äldre `service_role` | **Hemlig**. Går förbi alla åtkomstregler | Ingenstans utanför Supabase. Edge Functions får den automatiskt. Aldrig i CI (ADR 0003) |
| JWT-hemligheten (äldre JWT Secret) | **Hemlig**. Kan signera en nyckel för vilken roll som helst | Ingenstans. Rör den inte |
| Supabase personlig åtkomsttoken (Account → Access Tokens) | **Hemlig**. Gäller alla projekt i kontot | Skapa ingen nu. Den behövs inte enligt planen nedan |
| Brevo **SMTP-nyckel** | **Hemlig** | Bara i Supabase, i SMTP-inställningarna |
| Brevo **API-nyckel** | **Hemlig** | Bara som hemlighet för Edge Functions i Supabase (steg 2.1) |
| Turnstile **secret key** | **Hemlig** | Bara i Supabase, i inställningen för CAPTCHA |
| Cloudflare API-token | **Hemlig** | Bara som GitHub-hemlighet, om den alls behövs (steg 6) |

Om en hemlig uppgift ändå hamnar i en chatt, ett ärende eller en commit ska den bytas ut direkt i tjänsten. Att ta bort texten räcker inte.

## 1. Supabase: konto och två projekt

**Mål:** två projekt i EU på gratisnivån, `fotbollsbanken-staging` och `fotbollsbanken-prod`.

1. Skapa ett konto på <https://supabase.com/dashboard> (”Start your project”). Logga gärna in med GitHub-kontot. Slå på tvåstegsverifiering under **Account → Security**, eftersom kontot når båda databaserna.
2. Skapa en organisation när du blir ombedd. Välj planen **Free**.
   - **Stopp:** om dialogen bara erbjuder Pro, Team eller en plan med kort, avbryt. Gratisplanen ska gå att välja utan kort.
3. Skapa det första projektet: **New project**.
   - **Name:** `fotbollsbanken-staging`
   - **Database Password:** låt Supabase generera ett, och spara det direkt i din lösenordshanterare. Lösenordet visas inte igen. Klistra inte in det någonstans annars.
   - **Region:** välj `North EU (Stockholm)` (`eu-north-1`) om den finns, annars `Central EU (Frankfurt)` (`eu-central-1`). Välj aldrig en region utanför EU. Skriv upp vilken region du valde.
   - Om dialogen har säkerhetsval för Data API: behåll **Data API** påslaget och schemat `public`. Appen talar direkt med databasen (ADR 0001).
   - Om dialogen har en ruta för att automatiskt slå på åtkomstregler på radnivå (RLS) på nya tabeller, slå på den. Migrationerna gör det ändå, men det skadar inte.
   - **Stopp:** dialogen får inte visa något pris för beräkningsstorleken. På gratisplanen finns bara den minsta, och ett tillval med pris betyder att du står i fel organisation.
4. Upprepa steg 3 för `fotbollsbanken-prod`, med ett **eget** lösenord och samma region.
   - **Stopp:** gratisplanen har högst två aktiva projekt. Om Supabase säger att du har nått gränsen finns redan ett annat aktivt projekt i kontot. Pausa eller ta bort det, eller fråga, men byt inte plan.
5. Hämta de publika uppgifterna för varje projekt: **Project Settings → API Keys** (eller knappen **Connect** högst upp). Ta projektets adress och **publishable key**. Lämna dem och regionen till senior-systemutvecklare.
   - Supabase fasar ut de äldre nycklarna `anon` och `service_role` till slutet av 2026. Bygget ska därför använda den nya publishable key och inte `anon`.

### 1.1 Inloggning med engångskod (båda projekten)

Gör följande i båda projekten. Värdena kommer från ADR 0004 punkt 3 och berättelse 08, kriterium 8.

| Inställning | Värde | Väg enligt dokumentationen |
|---|---|---|
| E-post som inloggningssätt | På | **Authentication → Sign In / Providers → Email** |
| **Allow new users to sign up** | På. Registreringen är öppen (08.1). Appen hindrar att en inloggning skapar ett konto (`shouldCreateUser: false`) | **Authentication → Sign In / Providers**, överst |
| **Confirm email** | På | **Authentication → Sign In / Providers → Email** |
| **Email OTP Expiration** | `600` sekunder (10 minuter) | **Authentication → Sign In / Providers → Email** |
| **Email OTP Length** | `8` | Samma panel. Supabases konfiguration tillåter 6–10 siffror (`otp_length`). Om fältet inte finns i panelen: lämna 6, notera det och säg till senior-systemutvecklare |
| Lösenordsinloggning | Inga lösenord används (ADR 0004). Lämna standardvärdet tills vidare. Senior-systemutvecklare avgör i delsteg 3c om något ska stängas av | – |
| Inloggning med Google, Apple och andra | Av | **Authentication → Sign In / Providers** |
| **Anonymous sign-ins** | Av | Samma sida |

Mejlmallarna, där koden skrivs med `{{ .Token }}` och ingen länk finns med (ADR 0004 punkt 4), läggs in i delsteg 3c när UX-designern har skrivit texterna. Du behöver inte ändra dem nu.

### 1.2 Gränser (båda projekten)

Gränserna för e-post kan bara ändras när egen SMTP är inlagd (steg 2.4). Gör därför den här delen efter steg 2.

**Authentication → Rate Limits**

| Gräns | Värde | Varför |
|---|---|---|
| **Rate limit for sending emails** | `100` per timme | ADR 0004, *E-postbudget*. Med egen SMTP är förvalet 30 per timme |
| **Rate limit for token verifications** (verifieringar per 5 minuter och IP-adress) | `30`, förvalt. Ändra inte | Se *Inte kontrollerat*, punkt 2 |
| Minsta tid mellan kodbeställningar till samma adress | `60` sekunder, förvalt | 08.8 (d). Om fältet finns ska det stå på 60 |

### 1.3 Sessionens livslängd

| Inställning | Värde | Väg |
|---|---|---|
| Åtkomstnyckelns giltighetstid (**Access token (JWT) expiry time**, ibland kallad **JWT expiry limit**) | `3600` sekunder tills vidare. Ändra inte nu | **Authentication → Sessions**. I äldre gränssnitt: **Project Settings → JWT Keys** |
| **Detect and revoke potentially compromised refresh tokens** (rotation av förnyelsenyckeln) | På | **Authentication → Sessions** |
| **Time-box user sessions** och **Inactivity timeout** | Rör inte | **Stopp:** de kräver Pro-planen och kan inte slås på gratis (ADR 0004) |

Om nyckelns giltighetstid ska kortas, till exempel till 15 minuter, är ett beslut som tas i rapporten, inte här. Se fråga 14 i rapporten från senior-systemutvecklare.

### 1.4 Övrigt i projekten

- **Authentication → URL Configuration → Site URL:** sätt adressen till appens Cloudflare Pages-adress. Staging får förhandsadressen och produktion produktionsadressen. Koden skickas som siffror, så adressen syns knappt för ledaren, men den ska inte peka på `localhost`.
- **Storage:** skapa inga buckets. CI underkänner bygget om en bucket finns (berättelse 28, kriterium 4).
- **Database → Extensions:** du behöver inte göra något. Migrationerna slår på `pg_cron` själva. Senior-systemutvecklare kontrollerar att tillägget finns.
- Staging får **bara** innehålla påhittade uppgifter. Produktionen får inte ta emot riktiga ledares namn eller e-postadresser förrän säkerhetsagenten har granskat biträdesavtalen och integritetspolicyn finns (backlogen, *Förutsättning före riktiga personuppgifter*).

## 2. Brevo: SMTP till Supabase

**Mål:** ett Brevo-konto på gratisplanen som skickar Supabases inloggningsmejl.

1. Skapa ett konto på <https://www.brevo.com> och välj planen **Free**. Den ger 300 mejl per dag och kräver enligt Brevo inget kort.
   - **Stopp:** om Brevo ber om kortuppgifter eller föreslår Starter eller Business för att du ska kunna fortsätta, avbryt och hör av dig. Hoppa över erbjudanden om att köpa en domän eller en dedikerad IP-adress.
   - Brevo ber om uppgifter om organisationen och brukar kräva ett verifierat telefonnummer innan något får skickas. Det är gratis.
2. Lägg till en avsändare: **Senders, Domains & Dedicated IPs → Senders → Add a sender**. Namn: `Fotbollsbanken`. Adress: en adress du har tillgång till och vill använda som avsändare, till exempel föreningens. Brevo skickar en kod till adressen för att verifiera den.
3. **Utan egen domän:** Brevo kräver att avsändardomänen är autentiserad (DKIM och DMARC) sedan februari 2024. Om den inte är det, och det kan den inte vara för en adress hos Gmail, Outlook eller en annan gratistjänst, byter Brevo ut domänen i avsändaradressen mot en adress hos `brevosend.com`. Mottagaren ser då en avsändare som liknar `fotbollsbanken@<nummer>.brevosend.com`. Det betyder att Brevo **fungerar utan egen domän**, men med en avsändaradress som ser främmande ut. Det ökar risken att koden hamnar i skräpposten, och det är just det mätningen i berättelse 08, kriterium 14, ska visa. En egen domän kostar pengar och står som Could i backlogen. Se *Inte kontrollerat*, punkt 4.
4. Hämta SMTP-uppgifterna: **SMTP & API → SMTP**. Där står servern `smtp-relay.brevo.com`, porten `587` och ett inloggningsnamn i form av en e-postadress. Tryck **Generate a new SMTP key** och ge nyckeln namnet `supabase-staging`. Kopiera den direkt till Supabase i nästa steg. Den visas bara en gång.
5. I Supabase, för stagingprojektet: **Authentication → Emails → SMTP Settings** (adressen `…/project/<ref>/auth/smtp`). Slå på **Enable custom SMTP** och fyll i:
   - **Sender email:** adressen från steg 2
   - **Sender name:** `Fotbollsbanken (test)` för staging och `Fotbollsbanken` för produktion
   - **Host:** `smtp-relay.brevo.com`, **Port:** `587`
   - **Username:** inloggningsnamnet från steg 4
   - **Password:** SMTP-nyckeln från steg 4
6. Upprepa steg 4–5 för produktionsprojektet med en egen nyckel, `supabase-prod`. Med två nycklar kan den ena spärras utan att den andra påverkas.
7. Gå tillbaka till steg 1.2 och sätt e-postgränsen till 100 per timme i båda projekten.
8. Om ett provmejl inte kommer fram och Brevo säger att ”the transactional platform has not been activated”, skapa ett supportärende i Brevo och be dem aktivera den. Det kostar ingenting.

Båda projekten delar Brevos 300 mejl per dag. Under bygget går staging-mejlen bara till dina egna testadresser (backlogen, *Testadresser*), aldrig till riktiga ledare (berättelse 28, kriterium 14).

### 2.1 API-nyckel för inbjudningar

Inbjudningsmejlen skickas av en Edge Function via Brevos API (ADR 0004). Nyckeln behövs först i delsteg 3d, och du kan vänta med den.

1. **SMTP & API → API Keys → Generate a new API key**, med namnet `edge-invitation-staging`.
2. I Supabase, för stagingprojektet: **Edge Functions → Secrets** (eller **Project Settings → Edge Functions**). Lägg till hemligheten med namnet `BREVO_API_KEY` och nyckeln som värde.
3. Gör likadant för produktionen när delsteg 3d ska driftsättas.

## 3. Cloudflare Turnstile

**Mål:** en widget för produktion och en för staging. Turnstile är gratis för obegränsat antal kontroller, med upp till 20 widgetar och 10 värdnamn per widget.

1. Logga in på <https://dash.cloudflare.com> med samma konto som Cloudflare Pages.
2. Välj **Turnstile** i vänstermenyn (ibland under **Application security** eller **Protect & Connect**), och sedan **Add widget**.
   - **Widget name:** `fotbollsbanken-prod`
   - **Hostnames:** produktionsadressen på `pages.dev`, till exempel `fotbollsbanken.pages.dev`
   - **Widget Mode:** **Managed**. Den är oftast osynlig och visar en kryssruta bara vid misstanke, vilket är bäst för tillgängligheten (granskning K2, avsnitt 4).
   - Svara **No** på frågan om förhandsgodkännande (**pre-clearance**).
   - **Stopp:** Turnstile kräver inget kort. Om du ombeds lägga till betalning har du hamnat i en annan tjänst, till exempel Bot Management.
3. Skapa en andra widget, `fotbollsbanken-staging`, med förhandsadresserna. Cloudflare Pages ger varje gren en adress av formen `<gren>.fotbollsbanken.pages.dev`. Om widgeten inte godtar en stjärna i värdnamnet, ange `fotbollsbanken.pages.dev` och fråga senior-systemutvecklare. Se *Inte kontrollerat*, punkt 5.
4. Efter att widgeten skapats visas **Site Key** och **Secret Key**. Site key är publik och lämnas till senior-systemutvecklare.
5. I Supabase, för respektive projekt: **Authentication → Attack Protection** (i äldre gränssnitt **Auth → Settings → Bot and Abuse Protection**). Slå på **Enable Captcha protection**, välj **Turnstile by Cloudflare** och klistra in widgetens **Secret Key**. Prod-widgetens nyckel i produktionsprojektet och staging-widgetens nyckel i stagingprojektet.

**Viktigt om ordningen:** när CAPTCHA är påslaget i ett projekt nekar Supabase varje kodbeställning som saknar en Turnstile-token. Det gäller också produktionen innan appen har stöd för Turnstile. Det är inget problem så länge ingen ska logga in där, men tänk på det om du provar något för hand.

## 4. Cloudflare Pages: publika värden i bygget

Cloudflare Pages bygger appen. De publika värdena ska ligga där, åtskilda för förhandsversioner och produktion, så att en förhandsversion aldrig får produktionens adress (berättelse 28, kriterium 14).

1. **Workers & Pages → fotbollsbanken → Settings → Variables and Secrets** (i äldre gränssnitt **Environment variables**).
2. Lägg in följande som **Text** (inte **Secret**, eftersom de ändå hamnar i det publika bygget):

| Namn | Production | Preview |
|---|---|---|
| `VITE_SUPABASE_URL` | prod-projektets adress | staging-projektets adress |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | prod-projektets publishable key | staging-projektets publishable key |
| `VITE_TURNSTILE_SITE_KEY` | prod-widgetens site key | staging-widgetens site key |

Namnen är ett förslag från senior-systemutvecklare och används i delsteg 3c. Lägg aldrig secret key, databasens lösenord eller någon annan hemlighet här. Allt som börjar med `VITE_` byggs in i appen och kan läsas av alla.

Om Pages-projektet inte finns ännu, säg till. Då sätter senior-systemutvecklare upp det i samband med 3b.

## 5. Det dagliga anropet som håller produktionen vaken

Supabase pausar ett gratisprojekt efter sju dagar med för lite aktivitet. Enligt dokumentationen räcker ”några anrop till databasen varje dag”. Ett pausat projekt kan återställas från dashboarden i upp till ett år, men under tiden kan ingen logga in. Du beslutade 2026-10-13 att ett dagligt anrop ska hålla produktionen vaken.

**Upplägg:** ett schemalagt arbetsflöde i GitHub Actions, `hall-vaken.yml`, gör en gång per dygn en läsning mot produktionens REST-gränssnitt med den publika nyckeln, till exempel `GET /rest/v1/clubs?select=id&limit=1`. Åtkomstreglerna gör att svaret är en tom lista, men frågan körs i databasen. Anropet ger varken läs- eller skrivrätt till något. Arbetsflödet skrivs av senior-systemutvecklare i delsteg 3b, när den första tabellen finns. Det kostar ungefär 30 Actions-minuter i månaden, och Actions är gratis för publika repon.

**Det du behöver göra:** lägg in två **variabler** (inte hemligheter, eftersom värdena är publika) i GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**:

- `SUPABASE_PROD_URL`, produktionsprojektets adress
- `SUPABASE_PROD_PUBLISHABLE_KEY`, produktionsprojektets publishable key

**Två begränsningar:**

- GitHub stänger av schemalagda arbetsflöden i ett publikt repo efter 60 dagar utan aktivitet i repot. Under ett långt uppehåll, till exempel över sommaren, kan anropet alltså sluta utan att någon märker det. GitHub skickar då ett mejl till dig. Starta om arbetsflödet under **Actions → hall-vaken → Enable workflow**. Supabase mejlar också en varning ungefär en vecka innan ett projekt pausas.
- Staging hålls inte vaken. Staging får pausas och startas med **Resume project** i dashboarden när det behövs (ADR 0002).

## 6. GitHub: miljöer och hemligheter

Lägg hemligheterna i **miljöer** och inte direkt på repot, så att ett nytt arbetsflöde inte kommer åt dem utan att du godkänner körningen (ADR 0002, ADR 0003). Vägen är **Settings → Environments → New environment**.

| Miljö | Skydd | Hemlighet | Innehåll | Behövs från |
|---|---|---|---|---|
| `staging` | **Deployment branches:** bara `main` och `feature/*` | `STAGING_DB_URL` | Anslutningssträng till stagingprojektets databas, via session-poolern. Används för att köra migrationer mot staging | Delsteg 3b |
| `produktion` | **Required reviewers:** du själv. **Deployment branches:** bara `main` | `PROD_DB_URL` | Samma sak för produktionen. Migrationerna startas för hand och väntar på ditt godkännande | Delsteg 3b, när produktionen ska få sitt första schema |
| `godkannande` (finns redan) eller `produktion` | **Required reviewers:** du själv | `IMPORTER_DB_URL` | Anslutningssträng för databasrollen `importer` (ADR 0003). Rollen och dess lösenord skapas av en migration, så den här hemligheten läggs in först efter 3b | Efter 3b |

Anslutningssträngen hämtas i Supabase under **Connect → Session pooler**. Byt `[YOUR-PASSWORD]` mot databasens lösenord **direkt i GitHub-fältet**, inte i en chatt eller i en textfil som synkas.

**Om behörigheten:** en anslutningssträng med databasens lösenord ger full åtkomst till den databasen. Det är därför den bara ligger i en miljö med skydd. Den andra vägen, Supabases personliga åtkomsttoken för `supabase db push`, ger åtkomst till **alla** projekt i kontot och går inte att begränsa till ett projekt. Den används därför inte. Om senior-systemutvecklare i 3b hittar ett sätt att köra migrationerna med en egen, begränsad databasroll i stället för `postgres`, ersätts strängarna. Det tas upp i 3b och granskas av säkerhetsagenten.

**Cloudflare:** om Pages bygger direkt från GitHub behövs ingen Cloudflare-token i GitHub. Behövs en senare, för `wrangler pages deploy`, ska den ha behörigheten **Account → Cloudflare Pages → Edit** och inget annat, och heta `CLOUDFLARE_API_TOKEN` (med `CLOUDFLARE_ACCOUNT_ID` som variabel).

**Hemligheter som aldrig ska finnas i GitHub:** Supabase secret key och `service_role`, JWT-hemligheten, Brevos nycklar, Turnstiles secret key och Supabase personliga åtkomsttoken. CI underkänner bygget om någon av dem dyker upp i paketet (berättelse 28, kriterium 13).

## 7. Testadresser och den första redaktören

- **Testadresser:** skaffa eller välj några adresser du själv har tillgång till: en hos Gmail, en hos Outlook eller Hotmail och en hos en telefonoperatör. De används för att mäta om koderna når inkorgen (berättelse 08, kriterium 14). Lämna adresserna till kvalitetssäkraren först när mätningen ska göras.
- **Den första redaktören:** när produktionen ska ta emot riktiga användare lägger du in dig själv som första redaktör och ägare med ett engångsskript (ADR 0003). Skriptet skrivs i 3b eller 3f. Inget att göra nu.

## Det här lämnar du till senior-systemutvecklare

När stegen ovan är klara, lämna följande i chatten. Allt är publikt:

- regionen för varje projekt
- projektens adresser och projekt-ref
- om fältet **Email OTP Length** fanns och vilket värde som sparades
- de exakta namnen på de gränser som finns under **Rate Limits**, gärna som skärmdump
- en skärmdump av **Authentication → Sessions**, så att vi ser vilka inställningar som finns på gratisplanen
- om Brevo bytte ut avsändaradressen mot en `brevosend.com`-adress i ett provmejl

Lämna inga nycklar, lösenord eller anslutningssträngar.

## Inte kontrollerat

Följande kunde inte bekräftas mot tjänsternas aktuella dokumentation 2026-10-13. Det prövas mot de riktiga projekten i delsteg 3a–3c.

1. **Kodlängden i webbgränssnittet.** Supabases referens för `config.toml` anger `auth.email.otp_length` med förval 6 och tillåtna värden 6–10. Dokumentationen för engångskod via e-post nämner bara sex siffror och visar inget fält för längden. Att fältet heter **Email OTP Length** och ligger under **Sign In / Providers → Email** kommer från en tredjepartskälla. Går det inte att ändra i gränssnittet kan värdet sättas med Supabases Management API, men det kräver en personlig åtkomsttoken, och den används inte (steg 6). Frågan lämnas då till dig.
2. **Fem försök per kod (08.8 b) och att en ny kod gör den förra ogiltig (08.8 c).** Supabase dokumenterar en gräns för antalet verifieringar per IP-adress (30 per 5 minuter) men ingen gräns per kod. Hur det beter sig mot ett riktigt projekt prövas av testet i 08.8. Visar det sig att Supabase saknar en gräns per kod behövs ett beslut, se rapporten.
3. **Minsta tid mellan kodbeställningar.** Dokumentationen säger att det är 60 sekunder per användare och att det går att ändra, men inte var i gränssnittet.
4. **Brevo utan egen domän.** Brevos hjälpsidor svarade HTTP 403, liksom vid kontrollen 2026-09-12. Att Brevo byter avsändaradressen mot `brevosend.com` kommer från sökresultat som återger Brevos hjälpsidor och från tredjepartsguider. Om bytet bara gäller tillfälligt, eller om Brevo senare spärrar avsändare utan autentiserad domän, är inte bekräftat. Om transaktionsplattformen måste aktiveras via support på nya konton är inte heller bekräftat.
5. **Turnstile och förhandsadresser.** Om ett värdnamn med stjärna, som `*.fotbollsbanken.pages.dev`, godtas, eller om det räcker med `fotbollsbanken.pages.dev` för att täcka underdomänerna, är inte bekräftat.
6. **Menyvägar.** Supabase och Cloudflare har bytt namn på menyer flera gånger. Vägarna ovan kommer från dokumentationen och har inte följts i ett riktigt konto.
7. **Paus vid inaktivitet.** Dokumentationen säger inte exakt vilka anrop som räknas. Att en läsning via REST-gränssnittet räknas är en tolkning av ”några anrop till databasen varje dag”.

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
