# Säkerhetsgranskning: ESLint 10 (F5) och listan för uppsättningen av inkrement 3

**Status:** granskad 2026-10-13
**Granskare:** agenten `sakerhet-integritet`. Huvudsessionen har sparat rapporten.
**Underlag:** `origin/feature/eslint-9` (bc8fe03), `origin/docs/uppsattning-3` (`docs/drift/uppsattning-inkrement-3.md`) och `origin/krav/inkrement-3` (granskningen av kriterierna, backloggen och berättelserna 08 och 28). Granskaren har bara läst och inte ändrat något.

Fynden fortsätter S-serien efter S-58.

## Sammanfattning

**ESLint 10:** F5 från granskningen av inkrement 2b kan stängas när grenen är mergad. Egna prov ger samma resultat före och efter uppgraderingen. `overrides` byter inte ut några paket eller källor, så det tillför ingen ny risk i leveranskedjan. Det stänger däremot av kontrollen av vilka ESLint-versioner regelpaketen stöder. Därför behöver proven ligga i repot.

**Listan för uppsättningen:** fördelningen mellan publika och hemliga uppgifter är rätt. Tre av användarens beslut från 2026-10-13 saknas i listan, och den har inget tekniskt hinder mot riktiga personuppgifter i produktion.

| Nr | Grad | Kort |
|---|---|---|
| S-59 | Låg | `overrides` stänger av kontrollen av vilka ESLint-versioner regelpaketen stöder |
| S-60 | Låg | De negativa proven fanns inte i repot (åtgärdat: `scripts/lint-sakerhetsregler.test.ts`, e3420d5) |
| S-61 | Hög | Inget hindrar riktiga personuppgifter i produktion innan kontrollistan är avbockad |
| S-62 | Hög | Gränsen för verifieringar står på 30 med texten "Ändra inte". Beslutet är 10 |
| S-63 | Hög | Lösenordet för `importer` beskrivs som något en migration skapar. Repot är publikt |
| S-64 | Medel | Reservalternativet med 6 siffror står kvar |
| S-65 | Medel | Stängningen av staging (S-45) saknas |
| S-66 | Medel | Miljön `staging` saknar granskare, och förbikopplingen för administratörer nämns inte |
| S-67 | Medel | Det är oklart var `IMPORTER_DB_URL` ska ligga, och `godkannande` är fel plats |
| S-68 | Medel | Tvåstegsverifiering saknas för Brevo och Cloudflare |
| S-69 | Låg | Åtkomstnyckelns livstid följer inte beslutet om 15 minuter |
| S-70 | Låg | Rensningen av Auths logg och beslutet om `brevosend.com` står inte i listan |
| S-71 | Låg | Turnstiles värdnamn gäller också alla underdomäner, så de två widgetarna gäller samma adresser |
| S-72 | Låg | Anropet som håller produktionen vaken krockar med S-42 |
| S-73 | Låg | Listan varnar inte för omdirigeringsadresser med stjärna |

## Del 1: ESLint 10

- Versionerna är låsta exakt, och låsfilen är regenererad. Det finns 16 nya och 18 borttagna indirekta paket, alla från `registry.npmjs.org` med `integrity`. De nya följer med ESLint 10. Det enda installationsskriptet är `fsevents`, som bara gäller macOS.
- Att React-versionen anges uttryckligen i `eslint.config.js` är rätt. Detekteringen i `eslint-plugin-react` anropar `getFilename()`, som är borttagen i ESLint 10.

**S-59 · Låg.** Regelpaketen deklarerar inte stöd för ESLint 10, och överstyrningen gör att npm inte heller varnar när ESLint 11 kommer. Två regler som är avstängda (`forward-ref-uses-ref` och `jsx-filename-extension`) använder borttagna API:er. Värre vore om en regel tyst slutade rapportera.
*Åtgärd:* skriv en kommentar vid `REACT_VERSION` om när överstyrningen ska tas bort. Lägg en punkt om det i backloggen. Lägg inte till fler överstyrningar utan granskning.

**S-60 · Låg.** Proven kördes en gång för hand. *Åtgärdat:* kvalitetssäkraren har lagt in testet `scripts/lint-sakerhetsregler.test.ts` med 12 negativa prov och 1 kontrollprov. Det kontrollerar regel-ID men inte meddelandetexten.

## Del 2: listan för uppsättningen

**Rätt:**
- Tabellen över publika och hemliga uppgifter.
- Ingen personlig åtkomsttoken skapas, och hemligheterna läggs i miljöer och inte på repot.
- Regionerna i EU, egna lösenord och egna SMTP-nycklar per projekt.
- Turnstile med Managed-läge.
- Kodens giltighet på 600 s, väntetiden på 60 s och gränsen på 100 mejl per timme.

**S-61 · Hög.** "Allow new users to sign up: På" i båda projekten, och förbudet mot riktiga uppgifter står bara som text. När 3c mergas kan en ledare registrera sig i produktionen innan kontrollistan A–C är avbockad.
*Åtgärd:*
- Registreringen är **Av** i produktionen tills kontrollistan A–D är avbockad.
- Hooken "Before User Created" med vitlista läggs också i produktionen, med bara användarens egna adresser.
- Att slå på registreringen blir ett eget steg vid K5.

**S-62 · Hög.** Gränsen för verifieringar står på 30 med texten "Ändra inte".
*Åtgärd:* sätt den till 10 i båda projekten och skriv om avsnittet *Inte kontrollerat* enligt 08.8.

**S-63 · Hög.** "Rollen och dess lösenord skapas av en migration." Repot är publikt, och historiken kan inte skrivas om.
*Åtgärd:*
- Migrationen skapar rollen utan lösenord.
- Användaren sätter lösenordet själv i SQL-editorn och lägger anslutningssträngen direkt i GitHub-miljön.
- CI underkänner `password` i migrationerna.

**S-64 · Medel.** "Om fältet inte finns i panelen: lämna 6."
*Åtgärd:* om fältet saknas stannar användaren och säger till. Därefter sätts `otp_length = 8` via Management API med en tillfällig token som tas bort samma dag. Sex siffror godtas aldrig.

**S-65 · Medel.** Staging är öppen för registrering fram till 3b.
*Åtgärd:*
- Registreringen är **Av** i staging tills hooken "Before User Created" med vitlista är på plats.
- Testet i 08.15 ska vara grönt innan registreringen slås på.

**S-66 · Medel.** Miljön `staging` har ingen granskare. En gren `feature/*` med ett arbetsflöde kan skriva ut `STAGING_DB_URL`.
*Åtgärd:*
- `produktion`: granskare = användaren, bara `main`, och förbikopplingen för administratörer avstängd. Slå inte på *Prevent self-review*.
- `staging`: kräver också granskare.
- Lägg aldrig anslutningssträngar som hemligheter på repot.

*Restrisk:* `gh`-token är användarens egen, så ett godkännande via API:t är tekniskt möjligt. Det stoppas bara av regeln från 2026-10-05.

**S-67 · Medel.** *Åtgärd:* `IMPORTER_DB_URL` läggs bara i `produktion`.

**S-68 · Medel.** *Åtgärd:* slå på tvåstegsverifiering i Brevo och Cloudflare, och kontrollera att GitHub-kontot har det.

**S-69 · Låg.** *Åtgärd:* sätt åtkomstnyckelns livstid till 900 s i staging, pröva där och sätt sedan samma värde i produktionen.

**S-70 · Låg.** *Åtgärd:*
- Skriv att avsändaren hos `brevosend.com` godtas tills leveransen är mätt.
- Auths granskningslogg skrivs fortfarande till databasen, så att `pg_cron` kan rensa den.

**S-71 · Låg.** Ett värdnamn gäller också alla underdomäner. *Åtgärd:* godta överlappet tills det finns en egen domän och skriv in det i listan.

**S-72 · Låg.** *Åtgärd:* ge aldrig `anon` rättigheter för anropet som håller produktionen vaken. Utvecklaren väljer i 3b ett anrop som fungerar utan dem.

**S-73 · Låg.** *Åtgärd:* bara exakta omdirigeringsadresser används, aldrig en stjärna i `pages.dev`.

## Användarens beslut 2026-10-13

Användaren godkände alla rekommendationer:
1. Registreringen är avstängd i produktionen tills kontrollistan A–D är avbockad. Dessutom släpper en vitlista bara igenom egna adresser, och att slå på registreringen blir ett eget steg vid K5 (S-61).
2. `produktion` och `staging` kräver granskare. Förbikopplingen för administratörer är avstängd i `produktion` (S-66).
3. `IMPORTER_DB_URL` läggs bara i `produktion`, och lösenordet sätts för hand (S-63, S-67).
4. Om fältet för kodlängden saknas sätts den via Management API med en tillfällig token. Sex siffror godtas inte (S-64).
5. F5 stängs när `feature/eslint-9` är mergad, och S-59 och S-60 följs upp i backloggen.
6. Turnstiles överlapp godtas tills det finns en egen domän (S-71).

## Verifierat

- Diffen och låsfilerna är granskade. På grenen gav `npm audit` 0 sårbarheter, och `npx eslint .`, `tsc` och `vitest` (1 380 godkända) gick igenom.
- 12 egna negativa prov med `ESLint.lintText` gav samma resultat på main och på grenen.
- `gh repo view` och `gh api .../environments`, bara läsning: repot är publikt, och `godkannande` har en granskare och `can_admins_bypass: false`.
- Dokumentation lästa 2026-10-13: Supabase om gränser i Auth och om auth hooks, GitHub om miljöer och Cloudflare Turnstile om värdnamn.

## Kvarstår

- Inget i listan är prövat i ett riktigt konto.
- Hur grenpolicyn för miljöer tillämpas på arbetsflöden som startas av `pull_request` är inte bekräftat.
- Brevos avtal och lagringsort är inte kontrollerade (kontrollistan A).
