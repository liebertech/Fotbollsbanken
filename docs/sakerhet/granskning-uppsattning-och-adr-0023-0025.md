# Säkerhetsgranskning: den rättade listan för uppsättningen och ADR 0023–0025

**Status:** granskad 2026-10-13
**Granskare:** agenten `sakerhet-integritet`. Huvudsessionen har sparat rapporten.
**Underlag:**
- `origin/docs/uppsattning-3` (36e2fb2), filen `docs/drift/uppsattning-inkrement-3.md`
- `origin/adr/inkrement-3` (6577dc2), ADR 0023, 0024 och 0025
- `origin/krav/inkrement-3` (8c6d260)

Granskaren har bara läst och inte ändrat något. Fynden fortsätter S-serien från S-74.

## Sammanfattning

**Listan för uppsättningen är klar att lämnas till användaren.** Fynden S-61 till S-73 är rätt åtgärdade.

- **Får göras nu:** steg 0–7, steg 8 utom `IMPORTER_DB_URL`, och variablerna i steg 9.
- **Väntar:**
  - 3.1, till delsteg 3d.
  - Produktionens 900 sekunder i steg 4, tills provet i staging är godkänt.
  - `IMPORTER_DB_URL`.
  - Steg 10–12.
- Innan steg 11 görs ska S-74 vara åtgärdat.

**ADR 0023–0025 stämmer med användarens beslut från 2026-10-13.** Två saker saknas eller är för svaga: inloggningssessionerna saknar lagringstid (S-77), och uträkningen av kodens restrisk bygger på antaganden som inte är prövade (S-78).

## Kontroll av S-61 till S-73

| Fynd | Åtgärdat | Var |
|---|---|---|
| S-61 | Ja: registreringen är av i produktionen, vitlistan finns i båda projekten och den slås på i ett eget steg vid K5 | Steg 2, 10, 12 |
| S-62 | Ja: gränsen är 10 | Steg 3.2 |
| S-63 | Ja: rollen skapas utan lösenord och CI underkänner `password` (se S-74) | Steg 11 |
| S-64 | Ja: användaren stannar, reservvägen går via Management API och 6 siffror godtas inte | Steg 2 |
| S-65 | Ja: staging är stängd tills vitlistan finns och 08.15 är grönt | Steg 2, 10 |
| S-66 | Ja: granskare, avstängd förbikoppling, ingen *Prevent self-review*, och restrisken står med | Steg 8 |
| S-67 | Ja: nyckeln läggs bara i `produktion` | Steg 8, 11 |
| S-68 | Ja: tvåstegsverifiering i fyra tjänster (se S-75) | 0.2 |
| S-69 | Ja: 900 s, i produktionen först efter provet | Steg 4 |
| S-70 | Ja | Steg 2, 3 |
| S-71 | Ja | Steg 5.3 |
| S-72 | Ja | Steg 9 |
| S-73 | Ja | Steg 6 |

## ADR 0023–0025 mot besluten

| Beslut eller fynd | ADR | Bedömning |
|---|---|---|
| Koden: 8 siffror, 600 s, 10 verifieringar per 5 minuter och Turnstile (S-40) | 0023 avsnitt 1 | Stämmer. Se S-78 och S-79 |
| Åtkomstnyckeln gäller 15 minuter efter prov i staging | 0023 avsnitt 2 | Stämmer |
| Sessionskontroll prövas i 3b (S-57) | 0023 avsnitt 3 | Stämmer |
| Inbjudningsnyckeln: 10 felförsök per konto och timme, sedan 1 timmes spärr (S-53) | 0023 avsnitt 4 | Stämmer |
| Obekräftade konton rensas efter 24 timmar, profilen skapas efter bekräftelse (S-41) | 0024 | Stämmer. Se S-81 |
| Auths logg rensas efter 90 dagar (S-44) | 0024 | Stämmer. Se S-80 |
| `invitation_attempts` rensas efter 24 timmar, `editor_events` avidentifieras | 0024 | Stämmer |
| Allmänt test av radering (S-43) | 0024 | Stämmer |
| Storleksgränser (S-38) | 0025 | Stämmer. Se S-82 |
| Strukturen i ögonblicksbilder kontrolleras (S-39) | 0025 | Stämmer. Se S-83 |
| `anon` får inga rättigheter (S-42) | 0025 | Finns. Se S-84 |
| Sessionsdata (S-44, 29.9) | – | **Saknas.** Se S-77 |

## Fynd

**S-74 · Medel · Lösenordet för `importer` kan bli kvar i Supabase.**
Steg 11 låter användaren skriva lösenordet i SQL-editorn. Studio kan spara frågor automatiskt, och Postgres kan logga `ALTER ROLE ... PASSWORD`. Inget av det är bekräftat.
*Åtgärd:*
- Sätt lösenordet med `\password importer` i `psql`, eller skriv bara en SCRAM-hash som räknats fram lokalt.
- Reglerna från S-63 förs in i den ADR som flyttar banken till Supabase.
- Rätta att översikten och steg 8 säger "efter 3b" medan steg 11 säger att steget väntar på ADR:n om flytten. Det senare gäller.

**S-75 · Låg · Tvåstegsverifiering saknas för användarens e-post.**
E-posten tar emot inloggningskoderna och återställer lösenord i alla tjänster.
*Åtgärd:* lägg till e-postkontot och lösenordshanteraren i 0.2.

**S-76 · Låg · Token för reservvägen kan hamna i skalets historik.**
*Åtgärd:* kommandot läser token med en dold fråga eller ur en variabel. Sätt kortast möjliga giltighetstid och ta bort token samma dag.

**S-77 · Medel · Inloggningssessionerna saknar lagringstid.**
`auth.sessions` sparar IP-adress och användaragent, och ADR 0024 tar bara bort dem när kontot raderas. Sessioner med fast livslängd kräver Pro.
*Åtgärd:* sessioner som inte har förnyats på N dagar raderas, tillsammans med sina rader i `auth.refresh_tokens`.

**S-78 · Medel · Uträkningen av kodens restrisk bygger på antaganden som inte är prövade.**
Uträkningen på cirka 0,3 % per dygn förutsätter att gränsen per IP-adress inte går att kringgå. Dokumentationen säger inget om IPv6, och verify har bursts upp till 30. Räknas gränsen per enskild IPv6-adress har en angripare med ett eget /64-nät i praktiken ingen gräns.
*Åtgärd:*
- Lägg till båda punkterna under *Ej verifierat*.
- Gör ett test i staging för 08.8 b som visar att den elfte verifieringen inom 5 minuter får svaret 429.
- Pröva två adresser i samma /64-nät, om det går.
- Visar proven att gränsen går att kringgå behövs ett tak för koder per adress och dygn.

**S-79 · Låg · Ett ihållande angrepp förbrukar mejlbudgeten.**
Ungefär 144 koder per dygn och angrepp, mot Brevos 300 mejl per dygn som båda projekten delar.
*Åtgärd:* skriv in risken och vilken signal som visar den, till exempel larm från Brevo eller Auths logg.

**S-80 · Låg · Loggposter där personen är föremål tas inte bort vid radering.**
Själva raderingen skapar troligen posten `user_deleted` med e-post och id. Det är inte prövat.
*Åtgärd:* pröva i 3b och besluta sedan om posten.

**S-81 · Låg · Ett namn som någon annan registrerat kan följa med när kontot bekräftas.**
*Åtgärd:* ett test i 3c. Två registreringar av samma obekräftade adress ska ge namnet från den som bekräftar. Annars ska namnet kunna rättas direkt efter den första inloggningen.

**S-82 · Låg · Taken som räknar rader kan kringgås med samtidiga anrop, och kortare fält saknar spärrar.**
*Åtgärd:*
- Triggern låser passets rad, eller använder ett advisory-lås per ledare.
- Ett test med parallella anrop visar att taket håller.
- `check` för `kind`, `block`, `station`, `part` och minutfälten.

**S-83 · Låg · Texterna säger emot ADR:erna.**
Kriterium 28.18 säger att en förfalskad status nekas, men ADR 0025 säger med rätta att databasen inte kan skilja en förfalskad status från en äkta. Kriterium 08.8 anger restrisken till ungefär 1 %, medan ADR 0023 räknar fram 0,3 %.
*Åtgärd:* produktägaren rättar texterna.

**S-84 · Låg · Förvalda rättigheter, Realtime, GraphQL och loggen för `pg_cron`.**
*Åtgärd:*
- Ta också bort `alter default privileges` för `anon`.
- Hänvisa till S-55 i migrationen *Grund*.
- Ge `cron.job_run_details` en lagringstid, till exempel 90 dagar, och låt dess meddelanden bara innehålla antal.

## Användarens beslut 2026-10-13

1. **S-77:** sessioner som inte har förnyats på 180 dagar raderas. Det skrivs i ADR 0024.
2. **S-80:** Auths loggpost om raderingen behålls i 90 dagar som säkerhetslogg, med berättigat intresse som grund, och det står i integritetspolicyn. Övriga poster där personen är aktör eller föremål rensas med kontot.
3. **S-78:** inget eget tak byggs nu. Gränsen prövas i 3c. Om den inte håller införs ett tak på 10 koder per adress och dygn med hooken *Send Email*, och det skrivs i en ny ADR innan riktiga personuppgifter får finnas i produktionen.

## Verifierat

- Med `git show` lästes listan, förra granskningen, ADR 0023–0025, granskningen av kriterierna, berättelserna 08 och 29, backloggen, ADR 0003 och `published.ts`. Med `git diff --stat` kontrollerades att grenarna bara ändrar de angivna filerna.
- Supabases sida om gränser i Auth, läst 2026-10-13: verify har gränsen 30 per 5 minuter per IP-adress med bursts upp till 30, och klientens IP-adress anges utan något om IPv6.
- Supabases sida om roller i Postgres säger inget om att lösenord loggas eller att frågor sparas.

## Kvarstår

- Inget i listan är prövat i ett riktigt konto.
- Följande prövas i 3b och 3c: S-74 (sparade frågor och loggning av DDL), IPv6 och burst (S-78), posten `user_deleted` (S-80), metadata vid ny registrering (S-81), läsning av `auth.sessions` och radering i `auth`, och om `pg_jsonschema` finns.
- Hur grenpolicyn för miljöer gäller arbetsflöden som startas av `pull_request` är inte bekräftat.
- Brevos avtal, lagringsort och hur länge sändloggarna sparas är inte kontrollerade (kontrollistan A).
