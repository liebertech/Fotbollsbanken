Status: godkänd (K2, 2026-09-12)

# Backlog – Fotbollsbanken

Prioritering enligt MoSCoW (Must, Should, Could, Won't), grupperad efter de sju inkrementen i `CLAUDE.md`, i den ordningen. Varje rad länkar till sin användarberättelse i `berattelser/`.

## Inkrement 1 – Generatorn

| # | Berättelse | Prioritet |
|---|---|---|
| 01 | [Ange underlag och få spelform föreslagen](berattelser/01-ange-underlag-och-spelform.md) | Must |
| 02 | [Generera ett träningspass](berattelser/02-generera-traningspass.md) | Must |
| 03 | [Inget matchande resultat](berattelser/03-inget-matchande-resultat.md) | Must |
| 04 | [Byta ut en övning i passet](berattelser/04-byta-ovning-i-pass.md) | Must |
| 05 | [Spara ett pass](berattelser/05-spara-pass.md) | Must |
| – | Materialfilter (antal bollar, koner, mål) i generatorn | Could. Kräver att material blir ett fält på övningen och i underlaget – ny fotbollsfråga innan den kan byggas. |
| – | Inomhushall som yta | Could. Kräver egna måttregler för inomhusytor (kompletterar R-091), som fotbollsexperten inte har tagit fram än. |
| – | Antal målvakter som eget fält i underlaget | Could. Skulle kunna styra hur många spelare som räknas i utespelargrupper och om ett eget målvaktsmoment väljs, men kräver att fotbollsexperten och senior-systemutvecklare först definierar hur målvakter påverkar grupp- och ledarreglerna. |
| – | Ändra ordningen på övningarna i ett genererat pass | Could |
| – | Appen förklarar varför en viss övning valdes ut | Could |

Beslutat vid K1 (2026-09-11, se `kravspec.md`): generatorn har ett valfritt ytfilter (hel/halv/kvarts plan) i version 1, inbyggt i berättelse 01 och 02 (R-090–R-094). Inget materialfilter i version 1.

## Inkrement 2 – Planskisser

| # | Berättelse | Prioritet |
|---|---|---|
| 06 | [Visa planskiss för en övning](berattelser/06-visa-planskiss-for-ovning.md) | Must |
| 07 | [Visa planskisser för alla övningar i ett pass](berattelser/07-visa-planskisser-i-pass.md) | Must |

Skärpt inför K4 (2026-09-28, förarbete på `feature/planskisser-forarbete`): ingen av bankens 58 övningar har i dag skissdata (`docs/adr/0012-planskissformat.md`, beslutad K2). Hur stor del av banken som behöver skissdata för att inkrementet ska räknas som klart är inte beslutat – se berättelse 06, *Beslut som behövs* i produktägarens rapport.

## Inkrement 3 – Konton med klubbar och lag

| # | Berättelse | Prioritet |
|---|---|---|
| 08 | [Registrera konto och logga in](berattelser/08-registrera-konto-och-logga-in.md) | Must |
| 09 | [Klubbadmin skapar klubb](berattelser/09-klubbadmin-skapar-klubb.md) | Must |
| 10 | [Klubbadmin hanterar lag](berattelser/10-klubbadmin-hanterar-lag.md) | Must |
| 11 | [Klubbadmin bjuder in ledare](berattelser/11-klubbadmin-bjuder-in-ledare.md) | Must |
| 12 | [Dela sparat pass inom laget](berattelser/12-dela-sparat-pass-inom-laget.md) | Must |
| 26 | [Radera sitt konto](berattelser/26-radera-konto.md) | Must |
| 27 | [Logga ut på alla enheter](berattelser/27-logga-ut-alla-enheter.md) | Must |
| – | Klubbadmin kan se en logg över vem som gjort vad i klubben | Could |
| – | En person kan vara medlem i flera klubbar samtidigt | Should (rimligt för ledare som tränar i flera klubbar, men inte grundflödet) |
| – | Egen domän för utskick av inloggningsmejl, för att minska risken att koden hamnar i skräpposten | Could. Beslutat vid K2 (2026-09-12), se berättelse 08, kriterium 6, och kravspec. |
| – | Exportera sina egna uppgifter innan radering (dataportabilitet enligt GDPR, artikel 20) | Could. Beslutat vid K2 (2026-09-12), se berättelse 26, Utanför. |

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
| – | Ledaren kan rita eller redigera en planskiss för sin egen övning | Could. Beslutat vid K2 (2026-09-12): ingen ritredigerare i version 1, så en egen övning saknar planskiss (se berättelse 06, kriterium 2, och berättelse 13, Utanför). |

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
