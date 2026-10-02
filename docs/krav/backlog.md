Status: godkänd (K2, 2026-09-12)

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
| – | Klubbadmin kan se en logg över vem som gjort vad i klubben | Could |
| – | En person kan vara medlem i flera klubbar samtidigt | Should (rimligt för ledare som tränar i flera klubbar, men inte grundflödet) |
| – | Egen domän för utskick av inloggningsmejl, för att minska risken att koden hamnar i skräpposten | Could. Beslutat vid K2 (2026-09-12), se berättelse 08, kriterium 6, och kravspec. |
| – | Exportera sina egna uppgifter innan radering (dataportabilitet enligt GDPR, artikel 20) | Could. Beslutat vid K2 (2026-09-12), se berättelse 26, Utanför. |
| – | Klubbens egna övningar får inte ha `planskiss` i version 1, eftersom det inte finns någon skisseditor och texten då aldrig granskas. Databasen nekar fältet med en `check` eller trigger | Must. Säkerhetsgranskningen av schemat för skissdata, uppföljningen 2026-09-29 (`docs/sakerhet/granskning-inkrement-2-schema.md`). |

**Not, flyttad hit 2026-10-02:** berättelse 05 (spara ett pass) stod tidigare som Must i inkrement 1, men byggdes aldrig där. Användaren beslutade 2026-10-02 att flytta den hit, eftersom ett sparat pass kräver ett konto att spara på och en databas att spara i, som inte finns förrän det här inkrementet är byggt. Berättelse 06, kriterium 9 (skissen i ett sparat pass) gäller också först från och med att 05 är byggd, se berättelse 06.

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
