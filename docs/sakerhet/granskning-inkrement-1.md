Status: granskning inför K4, inkrement 1 (2026-09-21)

# Säkerhets- och dataskyddsgranskning: inkrement 1, generatorn

**Granskare:** agenten `sakerhet-integritet` · **Gren:** `feature/generatorn` (9fed605), 13 commits, 66 filer, +8 895 rader mot `main` · **Inför:** K4 inkrement 1

Rapporten är återgiven som agenten lämnade den. Huvudsessionen har sparat den i repot. Numreringen fortsätter serien från `granskning-k2.md`, som slutade på S-25. Användarens beslut på de tre frågorna togs 2026-09-23 och står i avsnitt 5.

## 1 Sammanfattning

Inkrement 1 behandlar **inga personuppgifter alls**. Det är kontrollerat, inte antaget: appen har inga fritextfält, inga nätanrop, ingen lagring i webbläsaren, ingen telemetri och inga hemligheter. Regelmotorn är ren och läser aldrig filer själv. Beroendekedjan är oförändrad och ren.

Huvudfrågan — att övningsbanken ligger öppet i det statiska paketet (ADR 0015) — **tillstyrks för inkrement 1 till och med 3, med villkor**, men den byggvägen får inte återanvändas för klubbens egna övningar i inkrement 4. Se S-29.

Två saker bör åtgärdas före merge: att granskningsraderna följer med ut i paketet (S-27) och att R-022:s gräns vilar på statusfältet i stället för på typerna (S-28). Säkerhetsheaders som ADR 0002 lade på just det här inkrementet saknas (S-26).

| Nr | Allvarlighet | Kort |
|---|---|---|
| S-26 | Medel | Säkerhetsheaders (`_headers`, CSP) saknas, trots att ADR 0002 lägger dem i inkrement 1 |
| S-27 | Medel | Redaktionella granskningsrader publiceras i klientpaketet, 48 % av bankens vikt |
| S-28 | Medel | R-022 vilar på `status`, inte på typerna; R-106 upphäver det i inkrement 4 |
| S-29 | Låg (villkorad) | Banken är läsbar utan inloggning, mot ADR 0001 |
| S-30 | Låg | `vite build` körs inte i CI, och statusgallringen är tyst utanför `validera:ovningar` |
| S-31 | Låg | Övningstext bäddas in som JS-källkod i stället för som data |
| S-32 | Låg | S-21-kontrollen täcker inte de stora fritextfälten |
| S-33 | Låg | `Math.random()` som frö får aldrig bli en identifierare |
| S-34 | Låg | `CONTENT_DIR` finns i två exemplar och kan glida isär |

## 2 Vad som kontrollerades och var rent

**Inga personuppgifter.** Sökning efter `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`, `caches.`, `navigator.storage` i `src/`, `scripts/` och `index.html`: noll träffar. Sökning efter `fetch(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`: noll träffar. Formuläret i `src/app/input/InputForm.tsx` har bara `type="number"`, `type="radio"` och `type="checkbox"` — **inget fritextfält alls**, så ramen att bara antal lagras och aldrig spelaruppgifter kan inte brytas av en ledare i det här inkrementet. Allt tillstånd bor i React-state och försvinner vid omladdning. Ingen service worker, ingen manifestfil, ingen PWA-registrering i bygget.

**Hemligheter.** Sökning efter `import.meta.env`, `process.env`, `VITE_`, `API_KEY`, `SECRET`, `TOKEN`, `password` i `src/`, `scripts/`, `vite.config.ts`, `index.html`: noll träffar. Sökning i hela grendiffen efter nyckelmönster: noll träffar. `.gitignore` täcker `.env*`, `*.key`, `*.pem`, `*.age`.

**XSS.** Noll träffar på `dangerouslySetInnerHTML`, `innerHTML`, `insertAdjacentHTML`, `eval(`, `new Function`, `document.write`. All övningstext renderas som React-barn (`src/app/session/ExerciseCard.tsx` rad 44–124) och escapas därmed. Inga `href`, inga `target="_blank"`, inga `window.open`.

**Beroenden.** `npm audit --audit-level=high` gav noll sårbarheter, slutkod 0. `npm audit --json` gav 0 på samtliga nivåer, 307 paket (5 prod, 303 dev, 27 optional). Diffen av `package.json` och `package-lock.json` mot main var **tom**: uppgiften att inga beroenden tillkommit stämmer. Produktionsberoendena är `react`, `react-dom`, `scheduler`, `zod`, samtliga MIT. `yaml` ligger rätt, som devDependency.

**Vad som faktiskt hamnar i paketet.** Provbygge till scratchpad-katalogen, utanför projektet: 3 filer, `index.html` plus en CSS och en JS på 445 kB (128 kB gzip). Sökning i paketet: **ingen YAML-tolk** (noll träffar på `parseDocument`, `YAMLParseError`, `lineCounter`) och **ingen Zod**. ADR 0015:s påstående att YAML och tolken aldrig når klienten stämmer alltså, kontrollerat mot det byggda paketet och inte bara mot koden. Inga e-postadresser i paketet.

**R-022, tre lager.** `scripts/bank.ts:48` (statusgallring vid inläsning), `src/regelmotor/filter/base.ts:28` (grundfiltret) och `src/regelmotor/check/session.ts:209` (slutkontrollen, som gör ett icke-godkänt pass omöjligt att lämna ut). Det är gott djupförsvar, men se S-28 om var gränsen egentligen går.

**Tester.** `npm test` gav 22 filer och **311 tester, samtliga gröna**, på 11,3 sekunder. Bland dem `scripts/regelmotor-mot-banken.test.ts:40` som kör `loadBank()` mot den riktiga banken och kräver att `problems` är tom och att alla övningar är `godkand`, samt `scripts/ovningsbanken-plugin.test.ts:33` som skriver en trasig fil till en temporär katalog och kräver att `buildBankModule` kastar. Statusfiltret och avbrottet är alltså verifierade med test, inte bara påstådda.

**Byggsteget som angreppsyta.** Insticket läser filer och skriver in innehållet i en genererad JS-modul via `JSON.stringify` (`scripts/ovningsbanken-plugin.ts:37`). Prövat om övningstext kan bryta ut ur modulen med en avslutande skripttagg, backtick-uttryck, mallsträngsuttryck, U+2028, citat plus omvänt snedstreck och nollbyte. **Samtliga sex tolkas som data, oförändrade.** Ingen kodinjektion via en övningsfil. `validera-ovningar.ts` importeras av insticket, men dess `invokedDirectly`-vakt (rad 165) gör att kommandoradsdelen inte körs vid bygget.

## 3 Fynd

### S-26 · Medel · Säkerhetsheaders levereras inte med bygget

**Var:** saknad fil `public/_headers`; `.github/workflows/ci.yml` saknar steget. Beslutet: `docs/adr/0002-hosting-drift-och-kostnad.md:65–68`.

ADR 0002 säger ordagrant att bygget ska levereras med `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` och `Referrer-Policy: no-referrer`, att CI ska underkänna ett bygge utan headerfilen, och att det **byggs i inkrement 1**. Bygget ger tre filer och ingen `_headers`. Det finns ingen `public/`-katalog och ingen deploy-arbetsflödesfil alls.

*Scenario:* varje gren får enligt ADR 0002 en publik förhandsadress på `pages.dev`. Appen serveras i dag utan `frame-ancestors`, så den kan ramas in. Allvarligare är tidsordningen: när inkrement 3 lägger förnyelsetoken i localStorage (ADR 0004, ADR 0005) är CSP:n enligt ADR 0002 rad 65 det verkliga skyddet för den token. Byggs headern först då, saknas den under hela den period då inloggningen provas fram.

*Åtgärd:* lägg `public/_headers` med de fyra headrarna nu. `connect-src 'self'` räcker tills Supabase-domänen finns; utöka i inkrement 3. Lägg till CI-steget som underkänner ett bygge där filen saknas, som ADR 0002 kräver. **Blockerande före inkrement 3, bör göras nu.**

### S-27 · Medel · Redaktionella granskningsrader publiceras med banken

**Var:** `scripts/bank.ts:60` och `scripts/ovningsbanken-plugin.ts:37` tar med hela objektet; fältet definieras i `src/regelmotor/schema/ovning.ts:241`.

Insticket serialiserar varje övning i sin helhet, inklusive `granskning`. Mätt mot den riktiga banken: JSON med granskning 166 182 byte, utan 86 910 byte. **Granskningsraderna är 79 272 byte, 48 procent av bankens vikt.** De innehåller 71 060 tecken intern granskningskritik och `av`-värdena `fotbollsexpert` och `benbom`. Bekräftat i det byggda paketet att texterna ligger där i klartext.

**Regelmotorn läser aldrig `granskning`** — sökning i `src/regelmotor/` ger träffar bara i schemat. Det är alltså ren dataspridning utan syfte, vilket är precis vad dataminimering i artikel 5.1 c handlar om.

*Scenario:* `benbom` är ett handtag knutet till en identifierbar fysisk person och är därmed en personuppgift, även om den redan är publik via `content/LICENSE`. Den publiceras här tillsammans med intern kritik av namngivna övningar. En läsare av paketet kan rekonstruera vem som underkände vad och varför. Ingen har tagit ställning till att det publiceras, och det finns ingen rättslig grund dokumenterad för det. Dessutom bär appen 79 kB som ingen användare har nytta av.

*Åtgärd:* projicera i `buildBankModule` ner till de fält motorn och gränssnittet faktiskt använder, med en **vitlista** och inte en svartlista, så att nya redaktionella fält inte slinker med av misstag. `status` måste vara kvar, eftersom R-022-kontrollerna läser det. Lägg ett test som underkänner om `granskning` finns i modulen. Samma vitlista ska gälla när banken senare kommer från Supabase.

### S-28 · Medel · R-022 vilar på statusfältet, inte på typerna, och R-106 upphäver det

**Var:** `src/regelmotor/index.ts:217` (`generateSession(input, bank: readonly Exercise[], seed)`), kommentaren rad 5–7; `src/regelmotor/filter/base.ts:28`; `src/regelmotor/check/session.ts:209`. Regeln: `docs/doman/generatorregler.md:201` och `:758`.

Uppgiften stämmer **för dagens kodläge**: `generateSession` har ingen parameter för egna övningar, appen anropar den på ett enda ställe (`src/app/generate.ts:38`) med `bank` från `src/data/bank.ts`, och den filen läser bara den inbyggda modulen.

Men påståendet att R-022 är en egenskap hos typerna håller inte vid närmare granskning. `bank` har typen `readonly Exercise[]`, och en egen klubbövning **är** en `Exercise` — inget i typen skiljer en bankövning från en klubbövning. Den faktiska gränsen är i dag `status === 'godkand'`, kontrollerad i tre lager. Och `docs/doman/generatorregler.md:758` säger uttryckligen om R-106 att Y:s status inte spelar någon roll, att det är det enda undantaget, och att kravet på status `godkand` i R-022 inte gäller där.

*Scenario:* i inkrement 4 ska ledaren kunna byta in en egen övning (R-106). Den naturliga implementationen ger klubbövningar en status som duger för visning, eller behandlar statusfältet som irrelevant. I samma stund upphör statusfiltret att vara en gräns mellan bank och klubb: ett anrop med bankens övningar och klubbens egna i samma lista skulle typkontrollera utan minsta varning, och de tre R-022-lagren skulle släppa igenom. Följden är att en klubbövning som ingen redaktör har sett hamnar i ett automatgenererat pass, vilket bryter mot både R-022 och ramen om mänskligt godkännande.

*Åtgärd:* gör gränsen till en verklig typegenskap **innan** inkrement 4 börjar byggas. Konkret: inför en distinkt typ för bankövningar, med status `godkand` och ett ursprungsfält, skapad av en smal konstruktor i `src/data/bank.ts`, och låt `generateSession` ta den typen. Då blir det ett kompileringsfel att blanda in klubbövningar, och R-106:s inbytesväg måste gå via en egen funktion som passerar säkerhetsreglerna separat. Låt `checkSession` nyckla R-022 mot ursprung, inte bara mot status, så att kontrollen inte börjar falsklarma när R-106 införs.

### S-29 · Låg, villkorad · Banken är läsbar utan inloggning

**Var:** `docs/adr/0015-ovningsbanken-i-webbappen.md:74–77`; byggvägen i `scripts/ovningsbanken-plugin.ts` och `src/data/bank.ts`.

**Bedömning: godtagbart till och med inkrement 3, med villkoren nedan.**

Skälen till att det är godtagbart: innehållet i `content/ovningar/` är 42 övningar under CC BY-SA 4.0 (`content/LICENSE`), skrivet för att spridas, och innehåller inga personuppgifter om spelare. Sökning efter e-postadresser i hela `content/`: noll träffar. Backloggens Won't-post gäller ett publikt, inloggningsfritt läge för att bläddra i banken eller dela pass (`docs/krav/backlog.md:105`) — det är en **funktion** som inte byggs, och inkrement 1 bygger den inte: ingen bläddringsvy, inga delningslänkar, ingen routing, ingenting som indexeras. Det som faktiskt inträffar är att den som öppnar appens adress kan läsa paketets JavaScript, vilket gäller varje statisk klientapp.

Skälet till att det ändå är ett fynd: `docs/adr/0001-teknikstack.md:12` är skarpare formulerat än backloggen och säger att allt innehåll ligger bakom inloggning. Inkrement 1 uppfyller inte den meningen, och ADR:er ändras enligt `CLAUDE.md` inte i efterhand utan skrivs om som nya beslut.

**Villkor för att det ska förbli godtagbart:**

1. Ingen vy som *presenterar* banken utan inloggning byggs. Det är skillnaden mot Won't-posten och den skillnaden måste hållas.
2. S-27 åtgärdas. Redaktionellt arbetsmaterial är inte CC BY-SA-innehåll och hör inte hemma i ett öppet paket.
3. Beslutet tas upp med användaren vid K4, och ADR 0001 rad 12 justeras eller får ett uttryckligt undantag.

**Följderna när klubbarnas egna övningar tillkommer i inkrement 4.** Om byggvägen återanvänds blir följden en tvärklubbsläcka av värsta sorten: alla klubbars egna övningar skulle ligga i **ett enda paket som levereras till alla**, oberoende av inloggning och oberoende av åtkomstregler på radnivå. Ingen RLS-policy hjälper då, eftersom datan aldrig passerar databasen vid läsning. Det måste därför vara sant om inbyggnaden i inkrement 4:

- **Bara den gemensamma banken får någonsin byggas in.** Klubbdata hämtas vid körning, efter inloggning, genom Supabase med åtkomstregler på radnivå, och cachas i IndexedDB per inloggad ledare (ADR 0005).
- **`src/data/bank.ts` är och förblir den enda vägen.** Den kontrollen bör automatiseras: en ESLint-regel eller ett test som underkänner varje import av den virtuella modulen utanför den filen. I dag vilar det bara på en kommentar i ADR 0015.
- **Klubbdata och bankdata får inte dela typ eller kanal.** Se S-28.
- **IndexedDB-cachen måste tömmas vid utloggning och vid byte av konto**, annars läcker en klubbs övningar till nästa ledare som använder samma enhet. Det är ett nytt krav som inte finns skrivet någonstans i dag.
- ADR 0015 säger själv att beslutet gäller till och med inkrement 3. Den utfasningen behöver en egen ADR innan inkrement 4 kodas.

### S-30 · Låg · Bygget körs inte i CI, och gallringen är tyst utanför valideringen

**Var:** `.github/workflows/ci.yml`, jobbet `kontroll`; `scripts/bank.ts:45–51`.

Statusfiltret tillämpas, och en fil som inte går att läsa **avbryter bygget** — båda verifierade med test. Men avbrottet täcker bara filer som passerat statusgrinden. `loadBank` hoppar vidare utan att lägga till i `problems` för en fil som inte är ett objekt eller vars `status` inte är exakt `godkand`. En fil med `status: godkänd` med prick, eller med ändelsen `.yml`, försvinner alltså **tyst** ur banken.

I praktiken fångas det av `npm run validera:ovningar` i CI. Men CI-jobbet kör formatkontroll, lint, typkontroll, tester, övningsvalidering och `npm audit` — **inte `npm run build`**. Cloudflare Pages kör bygget, och där körs ingen validering.

*Åtgärd:* lägg till `npm run build` som CI-steg; det är också vad S-26:s headerkontroll ska hänga på. Låt `loadBank` returnera en tredje lista över överhoppade filer, och låt insticket skriva ut hur många övningar som byggdes in och hur många som hoppades över, så att ett fall från 42 till 41 syns i byggloggen.

### S-31 · Låg · Övningstexten bäddas in som JS-källkod i stället för som data

**Var:** `scripts/ovningsbanken-plugin.ts:37`

Modulen skrivs som en exporterad konstant med `JSON.stringify` rakt i källkoden, vilket gör innehållet till kod som tolkas av esbuild. Utbrott är inte möjligt för de sex prövade teckenföljderna, så **det är inget fynd om dagens innehåll**. Risken ligger i att skyddet är implicit: det bygger på att modulen aldrig hamnar i ett skriptblock i HTML och att målversionen är ES2019 eller senare.

*Åtgärd:* billig härdning som också gör starten snabbare — låt modulen vara `JSON.parse` av en enda strängliteral. Då tolkas innehållet aldrig som kod, oavsett målversion och oavsett om modulen någon gång inlineras.

### S-32 · Låg · Kontrollen mot e-postadresser täcker inte de stora fritextfälten

**Var:** `src/regelmotor/schema/ovning.ts:437` och `:446`

`looksLikeEmail` tillämpas bara på `kalla` och `granskning[].av`. Fälten `beskrivning` (5 000 tecken), `organisation` (2 000), `coachningspunkter`, `varianter`, `anpassning`, `ledaruppgift` och `material[].anteckning` är **okontrollerade**, och alla publiceras i klientpaketet.

*Scenario:* det här är exakt den lucka som blir farlig i inkrement 4. En ledare som skriver en egen övning skriver in ett barns namn eller en e-postadress i organisationstexten, föreslår övningen till banken, redaktören missar det, och uppgiften publiceras i ett CC BY-SA-licensierat paket som ligger öppet.

*Åtgärd:* utvidga kontrollen till samtliga fritextfält i schemat, innan formuläret för egna övningar byggs. Komplettera i inkrement 4 med vägledning i gränssnittet vid fritextfälten. Texten ägs av ux-designern och `docs/design/texter.md`.

### S-33 · Låg · Slumpfröet får aldrig bli en identifierare

**Var:** `src/app/Generator.tsx:26–28`

`Math.random()` som frö är fullt rimligt för regelmotorn: fröet ska vara varierat, inte oförutsägbart. Fyndet är förebyggande. Fröet sparas i `Session.seed` (`src/regelmotor/types.ts:194`), och i inkrement 5 till 7 sparas och delas pass.

*Scenario:* om ett sparat eller delat pass någon gång adresseras med sitt frö blir länkarna gissningsbara, och ett klubbpass kan läsas av utomstående.

*Åtgärd:* ingen ändring nu. Skriv in i ADR 0011 eller i kommentaren att fröet är ett algoritmvärde och aldrig en identifierare, och använd `crypto.randomUUID()` för identifierare.

### S-34 · Låg · Sökvägen till övningarna finns i två exemplar

**Var:** `scripts/bank.ts:14` och `scripts/validera-ovningar.ts:17`; insticket importerar från den senare, men `loadBank` har sitt eget förval.

Värdena är lika i dag. Skulle de glida isär kan bygget läsa en annan katalog än den valideringen kontrollerar, och då försvinner sambandet som hela ADR 0015 bygger på: samma kod, samma schema, samma statusfilter. Sökvägen är dessutom relativ till processens arbetskatalog, inte till Vites rot.

*Åtgärd:* en definition, exporterad från `scripts/bank.ts`, som valideringsskriptet importerar. Överväg att göra sökvägen absolut.

## 4 Vad som måste vara på plats före inkrement 3

**Behörighet och isolering**

- Åtkomstregler på radnivå på **varje** tabell, med nekande som förval: ingen policy betyder ingen åtkomst.
- pgTAP-tester som visar isolering mellan klubbar, skrivna som negativa tester: en ledare i klubb A får noll rader ur klubb B, för läsning, insättning, uppdatering och borttagning på varje tabell.
- Motsägelsen som S-16 i K2-granskningen pekade ut mellan `profiles` och `club_members` måste vara avgjord i ADR 0003 innan policyerna skrivs.
- Typgränsen i S-28, så att inkrement 4 inte kan blanda bank och klubb.

**Inloggning**

- Gränserna i S-18: högst fem verifieringsförsök per engångskod, en ny kod ogiltigförklarar den föregående, minst 60 sekunders väntan mellan beställningar, och Supabase Auths timgräns satt. Verifierat mot det faktiska projektet, inte mot dokumentationen.
- Turnstile framför kodbeställningen, som komplement och inte ersättning.
- S-26: CSP med `connect-src` begränsad till Supabase-domänen och Turnstile. Det är förutsättningen för att förnyelsetoken i localStorage ska vara försvarbart.
- Utloggning på alla enheter.

**Dataskydd.** Allt detta först här, eftersom inkrement 1 inte behandlar några personuppgifter.

- Integritetspolicy och dokumenterad rättslig grund för ledarkontot.
- Personuppgiftsbiträdesavtal med **Supabase, Cloudflare och Brevo**, samt bekräftat att Brevo lagrar inom EU.
- Verifierat att Supabase-projektet faktiskt ligger i en EU-region.
- Radering av eget konto som en byggd funktion, inte ett manuellt handgrepp, samt vad som händer med pass och övningar som ledaren skapat.
- Beslutad lagringstid för konton, inbjudningar och loggar.
- Regeln att förhandsversioner pekar på staging och aldrig innehåller riktiga personuppgifter måste vara tekniskt genomdriven, inte bara skriven.

**Drift**

- Ett deploy-arbetsflöde med en Cloudflare-token med minsta möjliga behörighet. Det finns inget i dag, vilket också betyder att inkrement 1 ännu inte är driftsatt någonstans.
- `_headers` i bygget plus CI-kontrollen som underkänner utan den (S-26).

## 5 Användarens beslut, 2026-09-23

1. **Banken läsbar utan inloggning till och med inkrement 3: godkänt** enligt rekommendationen, alltså på de tre villkoren i S-29. ADR 0015 ska notera undantaget från ADR 0001, och byggvägen fasas ut i en egen ADR innan inkrement 4.
2. **Granskningsraderna ska inte publiceras.** S-27 åtgärdas med vitlista och test före merge.
3. **Konton, avtal och regionkontroll** hanteras enligt rekommendationen: Supabase-, Cloudflare- och Brevo-kontona skapas innan inkrement 3 börjar byggas, och säkerhetsagenten får ett eget uppdrag att granska de tre biträdesavtalen, Brevos lagringsort och Supabase-regionen.

## 6 Granskarens egen redovisning

**Ändrat:** ingenting. Granskningen är läsande. Inga filer i projektet skapades, ändrades eller togs bort, och inga git-kommandon som ändrar något kördes. Provbygget lades i sessionens scratchpad-katalog utanför projektet.

**Verifierat:** grendiffen mot main (13 commits, 66 filer, +8 895 rader); tom diff av `package.json` och `package-lock.json`; `npm audit --audit-level=high` med noll sårbarheter; licensavläsning av produktionsberoendena; `npm test` med 311 gröna tester; provbygge med sökning i det byggda paketet efter YAML-tolk, Zod, e-postadresser och granskningsrader; mätning av bankens storlek med och utan granskningsrader; mönstersökningar efter lagrings-API:er, nätanrops-API:er, farliga DOM-anrop, miljövariabler och hemligheter, samtliga utan träff; ett egenskrivet utbrottstest med sex farliga teckenföljder mot inbäddningen; sökning efter `_headers` och wrangler-filer i repot och i bygget, som saknas i båda.

**Kvarstår:** nio fynd, S-26 till S-34. Fotbollsinnehållet, tillgängligheten och kriterietäckningen ligger hos fotbollsexperten, ux-designern och kvalitetssäkraren. Playwright, pgTAP och tillgänglighetsjobben som ADR 0002 räknar upp finns inte ännu, så ingen av dem har kört mot den här koden. Storleksbudgeten som ADR 0015 säger ska sättas i inkrement 1 är inte satt: bygget ger i dag en enda klump på 445 kB, inte den separata bankdelen som ADR 0015 förutsätter. Ingenting är driftsatt, så bedömningen av S-29 gäller kodläget och inte en levande adress.
