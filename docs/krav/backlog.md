Status: godkänd (K2, 2026-09-12); inkrement 3 skärpt 2026-10-13 och väntar på godkännande (K4 inkrement 3)

# Backlog – Fotbollsbanken

Prioritering enligt MoSCoW (Must, Should, Could, Won't), grupperad efter de sju inkrementen i `CLAUDE.md`, i den ordningen. Varje rad länkar till sin användarberättelse i `berattelser/`.

## Inkrement 1 – Generatorn

| # | Berättelse | Prioritet |
|---|---|---|
| 01 | [Ange underlag och få spelform föreslagen](berattelser/01-ange-underlag-och-spelform.md) | Must |
| 02 | [Generera ett träningspass](berattelser/02-generera-traningspass.md) | Must |
| 03 | [Inget matchande resultat](berattelser/03-inget-matchande-resultat.md) | Must |
| – | Materialfilter (antal bollar, koner, mål) i generatorn | Could. Kräver att material blir ett fält på övningen och i underlaget – ny fotbollsfråga innan den kan byggas. |
| – | Inomhushall som yta | Could. Kräver egna måttregler för inomhusytor (kompletterar R-091), som fotbollsexperten inte har tagit fram än. |
| – | Antal målvakter som eget fält i underlaget | Could. Skulle kunna styra hur många spelare som räknas i utespelargrupper och om ett eget målvaktsmoment väljs, men kräver att fotbollsexperten och senior-systemutvecklare först definierar hur målvakter påverkar grupp- och ledarreglerna. |
| – | Ändra ordningen på övningarna i ett genererat pass | Could |
| – | Appen förklarar varför en viss övning valdes ut | Could |

Beslutat vid K1 (2026-09-11, se `kravspec.md`): generatorn har ett valfritt ytfilter (hel/halv/kvarts plan) i version 1, inbyggt i berättelse 01 och 02 (R-090–R-094). Inget materialfilter i version 1.

**Rättelse 2026-10-02:** berättelse 04 (byta ut en övning i passet) och 05 (spara ett pass) stod som Must i det här inkrementet, och K4 för inkrement 1 godkändes 2026-09-23, men ingen av de två byggdes – kvalitetssäkraren upptäckte det i efterhand. Berättelse 06 påstod i kriterium 1 och i Beroenden felaktigt att de var "redan byggda i inkrement 1"; det är rättat där. Användaren beslutade 2026-10-02: **04 byggs nu**, som ett eget inkrement 2b direkt efter planskisserna (se nedan), eftersom den bara körs i appen och hör ihop med generatorn. **05 flyttas till inkrement 3** (se där), eftersom den kräver konton och lagring, som inte finns förrän kontona är byggda.

## Inkrement 2 – Planskisser

| # | Berättelse | Prioritet |
|---|---|---|
| 06 | [Visa planskiss för en övning](berattelser/06-visa-planskiss-for-ovning.md) | Must |
| 07 | [Visa planskisser för alla övningar i ett pass](berattelser/07-visa-planskisser-i-pass.md) | Must |
| – | Uppställning per antal spelare i skissen: en egen skalningsstrategi eller ett nytt fält som gör att en spelare med rollen `neutral` (joker) kan bli lagspelare i skalningen, i stället för att alltid ritas som utespelare med sin ursprungliga roll (dagens fyra strategier, `docs/adr/0012-planskissformat.md` avsnitt 4). Berör övningarna `en-mot-en-till-tva-mal`, `dribbling-genom-portar`, `dribbling-genom-mittzonen`, `omstallning-med-jokrar` och `en-mot-en-med-joker-till-mal`, som till K4 löses med en nödlösning inom dagens format. | Could. Beslutat 2026-09-29 (ADR 0018): nödlösningen räcker till K4, men den riktiga lösningen ändrar det frusna skissformatet och kräver att senior-systemutvecklare (som äger formatet) och fotbollsexperten (som avgör vad en joker ska visas som) utformar den tillsammans. |
| – | Symbol för låga hinder i planskissen, som saknas i dagens slutna objektlista (`docs/adr/0012-planskissformat.md` avsnitt 2). Berör `hinderbana-med-boll`, som till K4 löses med en nödlösning inom dagens format. | Could. Beslutat 2026-09-29 (ADR 0018): kräver ett nytt objekt i den frusna listan, ett fotbollsfackligt och formatbeslut, inte bara ett innehållsbeslut. |
| – | Etiketter på stationsmarkeringar i planskissen: `markering` saknar i dag fältet `etikett`, till skillnad från `zon` och `ruta` (`docs/adr/0012-planskissformat.md` avsnitt 2). Berör `knakontroll-uppvarmning`, som till K4 löses med en nödlösning inom dagens format. | Could. Beslutat 2026-09-29 (ADR 0018): litet formattillägg, men ändrar ändå den frusna listan över objektfält, så det är senior-systemutvecklares beslut när det tas upp. |
| – | Egen rörelsetyp för kast, rull, inkast och hörna, utöver dagens fyra (`passning`, `löpning`, `dribbling`, `skott`, `docs/adr/0012-planskissformat.md` avsnitt 3). Berör `malvaktstraning-grunder` och `smaspel-fasta-situationer`, som till K4 löser det med en nödlösning inom dagens format. | Could. Beslutat 2026-09-29 (ADR 0018): kräver att fotbollsexperten fastställer linjeform och benämning för den nya rörelsetypen, som gjordes för de fyra befintliga (ADR 0012 avsnitt 3, fotbollsfacklig granskning 2026-09-12). |

Skärpt inför K4 (2026-09-28, förarbete på `feature/planskisser-forarbete`): ingen av bankens 58 övningar har i dag skissdata (`docs/adr/0012-planskissformat.md`, beslutad K2). Användaren beslutade 2026-09-28: alla godkända övningar (i dag 42) ska ha skissdata innan K4, se berättelse 06.

Beslutat 2026-09-29 (ADR 0018, senior-systemutvecklare; säkerhetsgranskning `docs/sakerhet/granskning-inkrement-2-schema.md`): de fyra fotbollsbehov som dagens skissformat inte täcker fullt ut löses med nödlösningar inom formatet till K4, se raderna ovan – de riktiga behoven är Could i backloggen. Samtidigt beslutades att redaktörskön ska visa skissen i den läsbara storleken `normal` med alla skisstexter i klartext, så att redaktören kan upptäcka spelaruppgifter som smugit sig in i skissen (fynd F2 och krav RK-9 i säkerhetsgranskningen). Det hör till inkrement 4, berättelse 16, se kriterium 6–7 där.

## Inkrement 2b – Byta övning

Ett eget, litet inkrement, infogat direkt efter planskisserna. Beslutat av användaren 2026-10-02 (se rättelsen under inkrement 1 ovan): berättelse 04 byggs nu, eftersom den bara körs i appen – inget konto och ingen lagring behövs – och hör ihop med generatorn (inkrement 1), men förutsätter att planskisserna (inkrement 2) finns, eftersom varje alternativ vid byte visar en planskiss i miniatyrformat (se berättelse 06, kriterium 1, och berättelse 04, kriterium 6).

**Namnet:** "Inkrement 2b" är valt i stället för att skjuta in ett nytt inkrement 3 och numrera om resten. Inkrement 3–7 är redan refererade med sina nummer på många ställen – ADR:er, säkerhetsgranskningar, kontrollpunkter och de andra berättelserna – och en omnumrering hade krävt att varje sådan hänvisning letades upp och ändrades, med stor risk att missa någon. "2b" visar var inkrementet hör in i ordningen utan att rubba de andra.

| # | Berättelse | Prioritet |
|---|---|---|
| 04 | [Byta ut en övning i passet](berattelser/04-byta-ovning-i-pass.md) | Must |

**Not:** klubbens egna övningar som alternativ vid byte (R-106 i `docs/doman/generatorregler.md`, kravspec – Beslut vid K1, punkt 4) kan inte byggas eller testas förrän kontona (inkrement 3) och klubbens egna övningar (inkrement 4, berättelse 13–14) finns. Till dess visar byt-övning-vyn bara alternativ ur den gemensamma banken, se berättelse 04, Beroenden.

## Inkrement 3 – Konton med klubbar och lag

| # | Berättelse | Prioritet |
|---|---|---|
| 08 | [Registrera konto och logga in](berattelser/08-registrera-konto-och-logga-in.md) | Must |
| 09 | [Klubbadmin skapar klubb](berattelser/09-klubbadmin-skapar-klubb.md) | Must |
| 10 | [Klubbadmin hanterar lag](berattelser/10-klubbadmin-hanterar-lag.md) | Must |
| 11 | [Klubbadmin bjuder in ledare](berattelser/11-klubbadmin-bjuder-in-ledare.md) | Must |
| 05 | [Spara ett pass](berattelser/05-spara-pass.md) | Must |
| 12 | [Dela sparat pass inom laget](berattelser/12-dela-sparat-pass-inom-laget.md) | Must |
| 26 | [Radera sitt konto](berattelser/26-radera-konto.md) | Must |
| 27 | [Logga ut på alla enheter](berattelser/27-logga-ut-alla-enheter.md) | Must |
| 28 | [Databasens skydd och gränser](berattelser/28-databasens-skydd-och-granser.md). Samlar de tvärgående säkerhetskraven, bland annat spärren mot `planskiss` i klubbens egna övningar (se sista raden i tabellen) | Must. Ny 2026-10-13 |
| 29 | [Rensning och lagringstider](berattelser/29-rensning-och-lagringstider.md), kriterium 1–3, 5–6 | Must. Ny 2026-10-13 |
| 29 | Rensning och lagringstider, kriterium 4 (konton utan inloggning i 24 månader, påminnelse och radering) | Must, senast före K5. Beslutat 2026-10-13: byggs som ett eget delsteg efter inkrement 3 och före K5, utanför inkrementets K4 (tidigast hösten 2028 når ett konto gränsen) |
| 05 | Ta bort ett sparat pass (kriterium 13) | Must. Ny 2026-10-13: utan det går ett spelarnamn som råkat hamna i ett passnamn inte att rätta (S-19, S-20) |
| 05 | Osparat genererat pass överlever att webbläsaren stängs (kriterium 14) | Should. Ny 2026-10-13, ADR 0005 punkt 2 |
| 12 | Koppla ett personligt pass till ett lag i efterhand (kriterium 6) | Should. Ny 2026-10-13, godkänd av användaren samma dag |
| – | Byta namn på ett sparat pass | Could. Ny 2026-10-13 |
| – | Uppgradera ESLint (säkerhetsgranskningen av inkrement 2b, F5). Ett eget litet jobb, se översikten | Should. Beslutat 2026-10-13: görs först, som delsteg 3a |
| – | Mäta och redovisa leveransen av inloggningsmejl (berättelse 08, kriterium 14) | Must. Planerat vid K2 (ADR 0004) |
| – | Klubbadmin kan se en logg över vem som gjort vad i klubben | Could |
| – | En person kan vara medlem i flera klubbar samtidigt | Should (rimligt för ledare som tränar i flera klubbar, men inte grundflödet) |
| – | Egen domän för utskick av inloggningsmejl, för att minska risken att koden hamnar i skräpposten | Could. Beslutat vid K2 (2026-09-12), se berättelse 08, kriterium 6, och kravspec. |
| – | Exportera sina egna uppgifter innan radering (dataportabilitet enligt GDPR, artikel 20) | Could. Beslutat vid K2 (2026-09-12), se berättelse 26, Utanför. |
| – | Klubbens egna övningar får inte ha `planskiss` i version 1, eftersom det inte finns någon skisseditor och texten då aldrig granskas. Databasen nekar fältet med en `check` eller trigger | Must. Säkerhetsgranskningen av schemat för skissdata, uppföljningen 2026-09-29 (`docs/sakerhet/granskning-inkrement-2-schema.md`). |

**Not, flyttad hit 2026-10-02:** berättelse 05 (spara ett pass) stod tidigare som Must i inkrement 1, men byggdes aldrig där. Användaren beslutade 2026-10-02 att flytta den hit, eftersom ett sparat pass kräver ett konto att spara på och en databas att spara i, som inte finns förrän det här inkrementet är byggt. Berättelse 06, kriterium 9 (skissen i ett sparat pass) gäller också först från och med att 05 är byggd, se berättelse 06.

### Översikt inför bygget av inkrement 3 (2026-10-13)

Status: utkast, väntar på godkännande (K4 inkrement 3). Acceptanskriterierna för berättelserna ovan är skärpta 2026-10-13; varje berättelse har en tabell *Ändringar efter K2* (eller K1) och markerar vilka kriterier som är oförändrade, skärpta, ändrade eller nya.

**Vad som ingår, med MoSCoW**

| Berättelse och kriterier | MoSCoW | Anmärkning |
|---|---|---|
| 08 kriterium 1–14 | Must | 14 (mätning av mejlleveransen) är en redovisning, inget utfallskrav |
| 09 kriterium 1–7 | Must | |
| 10 kriterium 1–8 | Must | 6 (lagets ålder följer kalenderåret) kräver fotbollsexpertens bekräftelse |
| 11 kriterium 1–12 | Must | |
| 05 kriterium 1–13 | Must | 6 är markeringen `Session.swapped` som sparas med passet; 7 är slutkontrollen av lagrade pass |
| 05 kriterium 14 | Should | Osparat pass överlever omstart |
| 06 kriterium 9 | Must | Ögonblicksbild av skissen, skärpt med tre tester |
| 12 kriterium 1–5, 7–8 | Must | |
| 12 kriterium 6 | Should | Koppla personligt pass till lag i efterhand, godkänt 2026-10-13 |
| 26 kriterium 1–14 | Must | Vad som prövas i inkrement 3 respektive 4 står i berättelsen |
| 27 kriterium 1–6 | Must | Kriterium 2 och 4 rättade: andra enheter loggas ut inom högst en timme |
| 28 kriterium 1–15 | Must | Ny berättelse, tvärgående säkerhetskrav |
| 29 kriterium 1–3, 5–6 | Must | Ny berättelse |
| 29 kriterium 4 | Must, senast före K5 | Eget delsteg efter inkrement 3, utanför inkrementets K4 (beslut 2026-10-13) |
| ESLint-uppgradering (F5) | Should | Se *Kända punkter* nedan |

**Kända punkter som ska komma med**

- **`Session.swapped` sparas med passet.** Berättelse 05 kriterium 6 och 9. Markeringen kommer från lagrad data och kan därför inte litas på: den får bara släppa tidsmålen i R-035 och R-036 (R-105), aldrig R-080, R-082, R-022 eller resten av slutkontrollen (säkerhetsgranskningen av 2b, F3). F3:s tre åtgärder (regressionstest att `swapped: true` fortfarande fäller R-080, R-082 och R-022, test med byte efter byte, kommentar i typen) finns redan i `src/regelmotor/types.ts` och `src/regelmotor/swap/swapped-flag.test.ts` (kontrollerat 2026-10-13 genom att läsa filerna, testerna är inte körda). Det som återstår för inkrement 3 är att samma sak gäller för ett pass som har sparats och lästs tillbaka: se kriterium 6 och 7 i berättelse 05.
- **Säkerhetsfynd F5 (ESLint 9.39.5 rapporteras som utan stöd): ja, ta det i inkrement 3, och gör det först.** Det är en låg fyndnivå och ändrar ingen funktion, men inkrement 3 lägger till stora nya beroenden (Supabase-klient, Turnstile, cache-lagret) och det är när lintreglerna för `ref`, `innerHTML` och liknande (F1–F2 i samma granskning) behöver vara pålitliga. Förslag: ett litet eget jobb som första delsteg, i en egen pull request, skilt från konto-koden. Eventuellt behövs en ny version av `typescript-eslint` och regelpaketen samtidigt; det avgör senior-systemutvecklare.
- Från granskningen av inkrement 1 (`granskning-inkrement-1.md`, avsnitt 4, S-26, S-35, S-37) tas med: CSP:n utökas med Supabase och Turnstile (berättelse 28, kriterium 12), cachen töms vid utloggning och byte av konto (08, kriterium 10), och körtidsvägen för data kastar inte (28, kriterium 15). Importgränsen från S-29 (ingen import av den virtuella bankmodulen utanför `src/data/bank.ts`) rekommenderas som en automatisk regel före inkrement 4, inte i det här.
- Säkerhetsgranskningen av schemat för skissdata: spärren mot `planskiss` i klubbens egna övningar och pgTAP-testet av skissens storlek (F5 i den granskningen) ingår i berättelse 28, kriterium 10–11.

**Vad som uttryckligen inte ingår i inkrement 3**

- Skapa, hantera och skicka in egna övningar, redaktörskön och att utse eller flytta redaktörsroller i appen (inkrement 4, berättelse 13–18). Tabeller och regler som de behöver finns från början (berättelse 28), men det finns inget gränssnitt för dem.
- Klubbens egna övningar som alternativ vid byte (R-106, berättelse 04, inkrement 4).
- Planläge, utskrift och säsongsplanering. Tabellerna för säsongsplan skapas i inkrement 7. Testerna för att köra planläget utan nät hör till inkrement 5 (ADR 0005).
- Flytten av den gemensamma banken från det inbyggda paketet till Supabase. ADR 0015 gäller till och med inkrement 3 och utfasningen kräver en egen ADR före inkrement 4. I inkrement 3 är banken oförändrat inbyggd, och ett sparat pass bär sina övningar som ögonblicksbilder.
- Integritetspolicy, rättslig grund, biträdesavtal, säkerhetskopior, åldersfaserna mot SvFF och GitHub-appen i stället för deploy-nyckeln (fas 5, "Innan lansering"). Se dock förutsättningen nedan.
- Export av egna uppgifter, egen domän för mejl, loggen över vad som gjorts i klubben, flera klubbar per person i gränssnittet, byte av e-postadress och att återställa ett arkiverat lag.

**Användarens beslut om inkrement 3, 2026-10-13**

- Externa tjänster sätts upp nu. Bygget sker mot lokal databas och staging tills säkerhetsagentens granskning av avtal och region är klar och en integritetspolicy finns. Inga riktiga ledaruppgifter får finnas i produktion före det.
- Inloggningskoden har 8 siffror om Supabase tillåter det. UX-designern uppdaterar skiss och texter.
- Ett lagrat pass som inte klarar slutkontrollen visas inte; ledaren får ett begripligt besked och planläge och utskrift spärras (05.7).
- Den som är ensam medlem i sin klubb får klubben raderad med lag, pass och övningar efter tydlig förvarning (26.9).
- Arkiverade lag: passen får samma frist på 24 månader, och varningstexten säger det (10.3, 29.2).
- Borttappad telefon: upp till en timme godtas och texten ska vara ärlig (27). Senior-systemutvecklare undersöker om tiden kan kortas på gratisnivån.
- Koppla pass till lag i efterhand: Should (12.6). Alla ledare i laget får ta bort lagets pass (12.8).
- Konton utan inloggning i 24 månader: Must, eget delsteg efter inkrement 3 och före K5 (29.4).
- Dagligt anrop som håller produktionsdatabasen vaken: ja.
- ESLint-uppgraderingen görs först, som delsteg 3a.
- Kontrollpunkt: ett K4 för hela inkrementet. Varje delsteg granskas och mergas för sig.
- Fortfarande öppna: redaktörens ägarskap (26.10, tills vidare flyttas det i databasen), Brevo utan egen domän, lagets ålder som årgång (fotbollsexperten, 10.6) och frågorna till senior-systemutvecklare.

**Förutsättning före riktiga personuppgifter (användarens beslut 2026-09-23, `granskning-inkrement-1.md` avsnitt 4 och 5, punkt 3)**

Inget som innehåller riktiga ledares namn eller e-postadresser får läggas i produktionsprojektet förrän säkerhetsagenten har granskat de tre biträdesavtalen (Supabase, Cloudflare, Brevo), bekräftat Brevos lagringsort och Supabase-regionen, och en integritetspolicy med rättslig grund (avtal) finns nåbar utan inloggning. Utveckling och test mot lokal Supabase och stagingprojektet med påhittade uppgifter kan börja direkt. Detta flyttar integritetspolicyn tidigare än "innan K5" om riktiga ledare ska bjudas in före K5.

**Externa tjänster och vad användaren behöver sätta upp (inga nya kostnader, allt på gratisnivå enligt ADR 0002)**

| Tjänst | Vad som behövs | Anmärkning |
|---|---|---|
| Supabase Free | Ett konto och **två projekt**, produktion och staging, i EU (förstahandsval Stockholm, annars Frankfurt). Användaren noterar vilken region som faktiskt valdes. Lösenord till databasen sparas utanför repot. Projektets adress och publika nyckel (som är avsedd att ligga i bygget) lämnas till senior-systemutvecklare. Servicenyckeln lämnas aldrig i repot eller i CI. | Gratisnivån medger två aktiva projekt, vilket är exakt vad som behövs. Staging får innehålla bara påhittade uppgifter. Före bygget kontrollerar senior-systemutvecklare mot projektet: att `pg_cron` finns, kodgränserna i berättelse 08 kriterium 8 och om kodlängden 8 tillåts. |
| Brevo Free | Ett konto, en verifierad avsändaradress (ingen egen domän köps) och SMTP-uppgifter som läggs in i Supabase Auth. En API-nyckel som läggs som hemlighet i Edge Function för inbjudningar. | **Obekräftat:** om Brevo tillåter en avsändare utan egen domän på gratisnivån (ADR 0002, ADR 0004). Går det inte, lyfter produktägaren frågan till användaren igen. 300 mejl per dag. |
| Cloudflare | En Turnstile-widget (gratis): en publik nyckel för bygget och en hemlig nyckel som läggs i Supabase Auths inställningar. Pages-projektet för förhandsversioner och produktion, om det inte redan finns. | Turnstile är redan tillstyrkt av säkerhetsagenten (K2, avsnitt 4) på villkor att det nämns i integritetspolicyn. |
| GitHub | Hemligheter för att köra migrationer mot staging (automatiskt) och produktion (manuellt startat), knutna till en miljö med krav på godkännande, och en åtkomsttoken med minsta möjliga behörighet. | Servicenyckeln läggs inte i CI (ADR 0003). Migrationsfilerna ligger redan under kodägarskydd. |
| Redaktörens första konto | När produktionen sätts upp lägger användaren själv in sig som första redaktör och ägare, med ett engångsskript (ADR 0003). | Behövs för att kriterium 4 och 10 i berättelse 26 ska gå att pröva med en riktig rad. |
| Testadresser | Några e-postadresser hos Gmail, Outlook och en telefonoperatör som får ta emot testkoder. | För mätningen i berättelse 08 kriterium 14. |

Beslutat 2026-10-13: ett schemalagt dagligt anrop håller produktionsprojektet vaket (ADR 0002 punkt 5), eftersom ett projekt annars pausas efter en veckas uppehåll och ingen kan logga in. Behövs först när riktiga ledare använder produktionen.

**Föreslagen ordning att bygga i**

Inkrementet är stort. Förslaget är att dela det i delsteg, vart och ett i en egen pull request mot grenen eller `main` enligt senior-systemutvecklares val, med kvalitetssäkrarens granskning per delsteg och säkerhetsagentens granskning av 3b–3f. Beslutat 2026-10-13: ett K4 för hela inkrementet (3a–3f). Varje delsteg granskas och mergas för sig.

| Delsteg | Innehåll | Skäl för ordningen |
|---|---|---|
| 3a Förarbete | ESLint-uppgraderingen (F5). Användarens uppsättning av Supabase, Brevo och Turnstile. Kontroll av projektinställningarna. | Billigt och oberoende av konton. Uppsättningen tar tid och blockerar annars de följande stegen. |
| 3b Databas och skydd | Migrationer, åtkomstregler på radnivå på alla tabeller, pgTAP-tester med två klubbar, begränsningar och tak, säkerhetsheaders med Supabase och Turnstile (berättelse 28). Ingen användarvy. | Allt annat vilar på det. Säkerhetsgranskningen i K2 ville se policyerna och testerna först (S-01, S-02, S-06). Headern måste finnas innan förnyelsetoken hamnar i webbläsarens lagring. |
| 3c Konto och inloggning | Berättelse 08 och 27: registrering, kod, Turnstile, gränserna, åtskild cache per användare, *Mitt konto* med "Logga ut på alla enheter". | Utan inloggning går inget annat att prova. 27 är liten och hör till samma vy. |
| 3d Klubb, lag och inbjudan | Berättelse 09, 10, 11: skapa klubb, lag, utse klubbadmin, bjuda in via Brevo och Edge Function, acceptera, ta bort ur lag. | Ger de roller och lag som sparade pass delas via. |
| 3e Spara och dela pass | Berättelse 05 och 12, och 06 kriterium 9, `swapped`, slutkontroll av lagrade pass, borttagning, lagets flik. | Kräver lag (3d). |
| 3f Radering och rensning | Berättelse 26 och 29 kriterium 1–3, 5–6. | Funktionen rör alla tabeller och kan prövas fullt ut först när de finns. |
| 3g Efter inkrementet | Berättelse 29 kriterium 4 (konton utan inloggning). Eget delsteg efter inkrement 3, före K5, utanför inkrementets K4. | Beslutat 2026-10-13. Behöver inte vara klar förrän före K5. |

Mejlleveransen (berättelse 08 kriterium 14) mäts så snart 3c är i staging, inte först vid K4, så att en eventuell domänfråga kommer upp tidigt.

**Behov från andra roller innan bygget av respektive delsteg**

- **UX-designern:** navigeringsmönstret och var *Mitt konto* placeras (skiss 15 lämnar det till inkrement 3), uppdaterad skiss 14 och `texter.md` till koden (kodlängd, se *Beslut som behövs*), texter för: bekräftelse efter "Logga ut på alla enheter" (saknas), inbjudan som gått ut, återkallats, redan använts eller gäller en annan adress, Turnstile som inte kan laddas, väntetid och gränser (60 sekunder, 200 pass per dygn, 50 inbjudningsmejl per dygn), borttagning av pass, "Sparat av en tidigare ledare", radering när personen är ensam medlem eller redaktörsägare, arkiveringsvarningen med lagringstid samt mejlmallarna till inloggning och inbjudan. Skiss 05 och `floden.md` avsnitt 1.4 säger olika om lagval vid sparande (automatiskt eller val); berättelse 12 kriterium 1 utgår från skiss 05 (ledaren väljer, förvalt till senast använda lag).
- **Fotbollsexperten:** bekräfta att lagets ålder lagrad som årgång stämmer med R-010 och R-113 (berättelse 10, kriterium 6).
- **Senior-systemutvecklare:** hur ett sparat pass refererar till en bankövning när banken i inkrement 3 fortfarande är inbyggd (ADR 0003 har `exercise_id` mot `exercises`; passet bär ögonblicksbilden och `source_id`), antal och tid för gränsen för felaktiga försök med inbjudningsnyckel (11 kriterium 7), vilka tabeller som skapas i första migrationen, och om cache-lagret för offline byggs i inkrement 3 (S-12 förutsätter det).
- **Säkerhetsagenten:** granskning av biträdesavtalen enligt ovan, granskning av de faktiska migrationerna mot S-01, S-02, S-06 och S-16 före K4, och ställningstagande till restrisken med lokal kopia på en borttappad enhet (berättelse 27).

## Inkrement 4 – Egna och inskickade övningar med redaktörskö

| # | Berättelse | Prioritet |
|---|---|---|
| 13 | [Skapa egen övning](berattelser/13-skapa-egen-ovning.md) | Must |
| 14 | [Hantera klubbens egna övningar](berattelser/14-hantera-egna-ovningar.md) | Must |
| 15 | [Skicka in en övning till den gemensamma banken](berattelser/15-skicka-in-ovning-till-banken.md) | Must |
| 16 | [Redaktören granskar en inskickad övning](berattelser/16-redaktor-granskar-inskickad-ovning.md) | Must |
| 17 | [Åtgärda och skicka in igen](berattelser/17-atgarda-och-skicka-in-igen.md) | Must |
| 18 | [Utse ytterligare redaktör](berattelser/18-utse-ytterligare-redaktor.md) | Should |
| – | Formuläret för egna övningar frågar rakt ut om övningen innehåller nickning och märker den då med `nickspel` (beslut vid K1, punkt 13) | Could |
| – | Kommentera/diskutera en inskickad övning innan beslut | Could |
| – | Statistik över hur många övningar en klubb har fått godkända | Could |
| – | Ledaren kan rita eller redigera en planskiss för sin egen övning | Could. Beslutat vid K2 (2026-09-12): ingen ritredigerare i version 1, så en egen övning saknar planskiss (se berättelse 06, kriterium 2, och berättelse 13, Utanför). **Not (ADR 0018, säkerhetsgranskning `docs/sakerhet/granskning-inkrement-2-schema.md`, fynd F2 b):** byggs en sådan editor senare måste den upplysa om att skissens etiketter och beskrivning inte får innehålla spelarnamn, på samma sätt som appens övriga fritextfält (S-20). Inget att göra nu eftersom editorn inte finns i version 1. |

## Inkrement 5 – Planläge med timer

| # | Berättelse | Prioritet |
|---|---|---|
| 19 | [Starta planläget](berattelser/19-starta-planlage.md) | Must |
| 20 | [Använda timer per övning](berattelser/20-anvanda-timer-per-ovning.md) | Must |
| 21 | [Navigera mellan övningar i planläget](berattelser/21-navigera-mellan-ovningar-i-planlage.md) | Must |
| – | Ljudsignal med anpassningsbar volym/typ | Could |
| – | Röststyrd navigering mellan övningar (händerna fulla på planen) | Could |

## Inkrement 6 – Utskrift/PDF

| # | Berättelse | Prioritet |
|---|---|---|
| 22 | [Skriva ut ett pass som PDF](berattelser/22-skriva-ut-pass-som-pdf.md) | Must |
| – | Klubbanpassad logga/sidhuvud på utskriften | Could |

## Inkrement 7 – Säsongsplanering

| # | Berättelse | Prioritet |
|---|---|---|
| 23 | [Skapa en säsongsplan](berattelser/23-skapa-sasongsplan.md) | Must |
| 24 | [Lägga pass i säsongsplanen med progression](berattelser/24-lagga-pass-i-sasongsplan-med-progression.md), inklusive flera pass per vecka (R-110) och ålder över årsskifte (R-113) | Must |
| 25 | [Se översikt över säsongsplanen](berattelser/25-se-oversikt-over-sasongsplan.md) | Must |
| – | Dela en säsongsplan mellan flera lag i samma årgång | Could |
| – | Ledaren skriver in perioder och teman för ett block innan passen finns (`docs/doman/sasongsprogression.md`) | Could. Beslutat vid K1 (2026-09-11): Must är stödet för flera pass per vecka (se berättelse 24); perioder och teman är en tilläggsfunktion. |
| – | Varning om ett fokusområde (kärnområde) inte förekommit på länge (R-112) | Could |
| – | Appen anpassar eller föreslår ett kortare, lättare pass inför en match (`docs/doman/sasongsprogression.md`) | Could. Kräver att appen känner till lagets matchdatum, vilket inte finns i underlaget eller datamodellen för version 1. |

## Innan lansering (fas 5)

| # | Uppgift | Prioritet |
|---|---|---|
| – | Kontrollera åldersfaserna i `docs/doman/aldrar-och-fokus.md` mot SvFF:s spelarutbildningsplan, och justera fokusområdenas K/R-tabell i `docs/doman/fokusomraden.md` vid behov | Must, innan K5. Se `kravspec.md` – Beslut vid K1, punkt 3. |
| – | Fastställ rättslig grund för behandlingen av ledarnas kontouppgifter (avtal, inte samtycke) och att föreningen är ensam personuppgiftsansvarig, inte klubbarna gemensamt | Must, innan K5. Se säkerhetsgranskning K2 (`docs/sakerhet/granskning-k2.md`), avsnitt 3 och 5, punkt 1–2, och `kravspec.md` – Beslut vid K2, punkt 6. |
| – | Skriv och publicera en integritetspolicy, nåbar utan inloggning | Must, innan K5. Se säkerhetsgranskning K2 (`docs/sakerhet/granskning-k2.md`), avsnitt 3. |

## Won't – uttryckligen utanför version 1

Dessa är medvetet uteslutna, se `kravspec.md` – avgränsningar, och de fasta ramarna i `CLAUDE.md`.

- AI-genererat övningsinnehåll eller AI-genererade pass.
- Närvaroregistrering eller annan lagring av uppgifter om enskilda spelare.
- Publikt, inloggningsfritt läge för att bläddra i banken eller dela pass.
- Betalning eller prenumeration.
- Andra språk än svenska.
- Nativa mobilappar (endast PWA).
