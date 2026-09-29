# 0018: Kompletteringar av planskissformatet

Status: beslutad (2026-09-29)

## Kontext

ADR 0012 beslutade planskissformatet och ritmotorn vid K2. Beslutet ändras inte i efterhand. Den här ADR:n kompletterar det och ersätter de delar som anges nedan. Allt som inte nämns här gäller som det står i ADR 0012.

Tre underlag har visat var ADR 0012 behöver kompletteras:

- **Schemat.** `src/regelmotor/schema/planskiss.ts` och avsnittet om `planskiss` i `content/ovningar/README.md` är skrivna efter ADR 0012. Där ADR:n är tyst har schemat gjort egna val, och på en punkt avviker det från ADR:n: kommatecknet i etiketterna.
- **Säkerhetsgranskningen** av schemat (`docs/sakerhet/granskning-inkrement-2-schema.md`). Fynd F2 visar att skyddet mot spelarnamn i skissen vilar på människor, och att redaktören enligt tabellen i ADR 0012 avsnitt 5 bara ser skissen som miniatyr, utan etiketter. F3 visar att kommatecknet är ofarligt men måste dokumenteras. RK-9 kräver att redaktörskön visar skissens texter.
- **Fotbollsexpertens genomgång** av hur bankens 58 övningar går att rita i formatet. Den visade att den fasta etiketten för udda antal inte stämmer med övningarnas egna lösningar, att exemplet i ADR 0012 avsnitt 9 är fotbollsmässigt fel, och att några behov saknar en egen form i formatet.

Användaren fattade besluten 2026-09-29. Inga övningar i banken har `planskiss` ännu (kontrollerat 2026-09-29: 0 av 58 filer), så inget av besluten kräver migrering av data.

## Beslut

### 1 Kommatecken tillåts i etiketter

Teckenmönstret för etiketter i ADR 0012 avsnitt 6 får kommatecknet som tillägg:

```text
^[\p{L}\p{N} .,:\-\/+()]*$     (Unicode-flagga)
```

Mönstret gäller de långa etiketterna, 0–24 tecken: `zon.etikett`, `ruta.etikett`, rörelsernas `etikett` och `skalning.koer[].etikett`. De korta etiketterna har ett snävare mönster, se punkt 2.

**Skäl.** ADR 0012 föreskrev själv en etikett med komma, ”Vilande, byter in”, som inte gick att skriva med ADR:ns eget mönster. Säkerhetsgranskningen (F3) bedömer kommat som ofarligt: det har ingen betydelse i text eller i attributvärden i HTML och XML. Bedömningen gäller under villkoret i RK-2, att text från skissen bara blir React-barn till `<text>`, `<tspan>`, `<title>` eller `<desc>` och aldrig värdet i ett attribut. Villkoret är därmed ett krav på ritmotorn.

### 2 Korta etiketter är versaler och siffror

Etiketten på `spelare` och `ledare` följer mönstret

```text
^[\p{Lu}\p{N}]{0,3}$     (Unicode-flagga)
```

alltså högst tre tecken, bara versaler och siffror, utan mellanslag och skiljetecken. Exempel på giltiga etiketter: `A`, `F`, `MV`, `L`, `1`, `12`. Versaler med diakritiska tecken, som `Ö`, är tillåtna.

Mönstret ersätter det allmänna etikettmönstret för `spelare.etikett` och `ledare.etikett` i ADR 0012 avsnitt 2 och 6. Längdgränsen på tre tecken är oförändrad.

**Skäl.** Ett spelarnamn går inte att upptäcka tekniskt, och tre tecken rymmer ”Ali” (F2). Med bara versaler och siffror blir ett namn onaturligt att skriva, medan rollförkortningarna som skisserna behöver fortfarande går att skriva. Det är ett stöd för S-07 och för principen att inga uppgifter om spelare lagras, inte ett fullständigt skydd: ”ALI” är giltigt.

### 3 Redaktörskön visar skissen läsbart och texterna i klartext

Raden *Pass och redaktörskö* i tabellen *Storlekar per vy* i ADR 0012 avsnitt 5 delas i två:

| Vy | `storlek` | Anmärkning |
|---|---|---|
| Pass | `miniatyr` | Som i ADR 0012: cirka 96 px bredd, inga etiketter, klickbar för förstoring |
| Redaktörens granskning av en inskickad övning | `normal` | Skissen med teckenförklaring som i en öppnad övning. Under skissen visas **alla skissens texter i klartext**: de som `planskissTexts` returnerar, alltså `beskrivning`, alla etiketter på objekt och rörelser och köernas etiketter |

Texterna i klartext visas också när de redan syns i skissen, eftersom en etikett kan klippas vid ytans kant (RK-7) och `beskrivning` bara finns i `<desc>`, som aldrig syns på skärmen. Vyn byggs i inkrement 4.

**Skäl.** Redaktörens godkännande är det som gör en inskickad övning synlig i alla klubbar. En redaktör som bara ser en miniatyr utan etiketter kan godkänna en övning utan att ha sett skissens texter (F2). Beslutet uppfyller RK-9.

### 4 Den extra spelaren vid udda antal ritas som övningens egen lösning

Regeln *Den extra spelaren vid udda antal* i ADR 0012 avsnitt 4 ersätts. Den gäller fortfarande bara övningar med `grupptyp: fast-storlek` och `udda_antal_losning: true`.

- **När den extra spelaren har en roll utanför formen** används `strategi: koer` med en kö. Köns `etikett` återger övningens egen lösning i fältet `anpassning.udda_antal`, med högst 24 tecken. Exempel: ”Rullar in bollar”, ”Nästa målvakt”, ”Byter in efter varvet”. Den fasta etiketten ”Vilande, byter in” utgår.
- **När den extra spelaren ger en ny form** används `strategi: platser` med platsen eller platserna i den nya formen. Exempel: i `tva-touch-i-triangel` tar en femte spelare en fjärde punkt, så att triangeln blir en kvadrat. Den spelaren ritas som en plats i fjärde hörnet, inte som en kö.

Kopplingen mellan skissen och `anpassning.udda_antal` kan inte valideras, eftersom skissen inte känner till övningens övriga fält. Fotbollsexperten kontrollerar den vid granskningen, som ADR 0012 redan förutsåg.

**Skäl.** Bankens övningar löser udda antal på olika sätt: en spelare rullar in bollar, står i tur som nästa målvakt, byts in efter varje varv eller gör formen större. En fast etikett om vila beskriver bara en av lösningarna och säger emot övningens text i de andra. En kö för en spelare som i själva verket står i ett hörn ger dessutom fel bild av uppställningen.

### 5 En kö utgår alltid från en spelare

`skalning.koer[].vid` ska peka på ett `spelare`-objekt i skissen. Köspelarna ärver den spelarens lag och ritas alltid som utespelare (S-7, oförändrad). Pekar `vid` på något annat objekt underkänns skissen.

ADR 0012 talar om en kö ”vid ledaren” (avsnitt 4) och ”bakom startkonen” (avsnitt 9). Båda uttrycks nu genom en spelare: kön utgår från den första spelaren i kön, och den spelaren står vid konen eller vid ledaren i basskissen.

**Skäl.** ADR 0012 säger att köspelaren ärver laget från startobjektet, men bara en spelare har ett lag. En kö från en kon eller en ledare skulle ge köspelare utan lag, alltså en regel utan svar. Att den första i kön står vid konen är också det ledaren ser på planen.

### 6 Nödlösningar för behov som saknar egen form

Fotbollsexperten har pekat ut fyra behov som formatet i dag saknar en egen form för. Formatet utökas inte nu. Tills vidare ritas de med befintliga former, och behoven förs in i backloggen:

| Behov | Nödlösning nu |
|---|---|
| Jokrar som blir lagspelare när gruppen växer, alltså en uppställning som beror på antalet spelare | `strategi: platser` med platser för lag `a` och `b`, och en mening i `beskrivning` som förklarar hur jokrarna går in i lagen |
| Symbol för låga hinder | En liten `ruta` med etikett, till exempel ”Hinder” |
| Etiketter på stationsmarkeringar | En liten `ruta` med stationens etikett |
| Egen rörelsetyp för kast och inkast | En `passning` med etikett, till exempel ”Inkast” |

Ett framtida tillägg av en objekt- eller rörelsetyp är ett rent tillägg i en sluten lista, på samma sätt som `passning-luft` i ADR 0012 avsnitt 3: befintliga skisser gäller oförändrade, och `version` behöver inte höjas. Övningar som ritats med nödlösningarna kan då ritas om, men måste inte.

### 7 Rättelse av exemplet i ADR 0012 avsnitt 9

Exemplet i ADR 0012 avsnitt 9 visar `passa-och-folj` med `strategi: parallella-ytor`, `per_yta: 4` och fyra spelare i en kvadrat. Det är fotbollsmässigt fel:

- **Passa och följ med n hörn kräver minst n + 1 spelare.** Den som passar springer till nästa hörn, och där måste någon stå kvar och ta emot. Fyra spelare i fyra hörn går inte att köra.
- **Övningen har fast storlek med en lösning för udda antal.** Den ska därför ritas med basskissen för sin minsta grupp och den extra spelaren enligt punkt 4, inte med `parallella-ytor`.

`parallella-ytor` passar i dag ingen av bankens övningar. Generatorn delar redan upp spelarna i grupper, och skissen visar en grupp, så det finns inget kvar för strategin att fördela. Strategin står kvar i formatet oförändrad, eftersom en borttagning vore en formatändring utan vinst, men ADR 0012 avsnitt 9 ska inte användas som förebild för den.

Exemplet i `content/ovningar/README.md` ritar redan `passa-och-folj` med en kö och inte med `parallella-ytor`.

### 8 Val som schemat gjort där ADR 0012 är tyst

Följande val finns i `src/regelmotor/schema/planskiss.ts` och `content/ovningar/README.md` och fastställs härmed:

| Fråga | Val | Skäl |
|---|---|---|
| Åt vilket håll vinklar räknas | 0° är åt höger (växande `x`), **90° är nedåt (växande `y`)**, 180° åt vänster och 270° uppåt. Vinkeln växer alltså medurs på skärmen | Samma riktning som SVG:s y-axel, som ADR 0012 avsnitt 1 redan valt, så ingen spegling behövs |
| Obligatoriska fält som ADR:n inte markerade | `koer[].riktning`, `zon.monster`, `ruta.stil` och `mal.riktning` krävs | Ett förval skulle tyst rita en kö åt ett håll eller en zon med ett mönster som författaren inte valt. Ett saknat fält blir i stället ett fel som pekar på fältet |
| Mått på `zon` och `ruta` | `langd` 0,5–126 m och `bredd` 0,5–86 m. Rektangelns bortre hörn ska dessutom ligga inom ytan plus marginalen | Den undre gränsen är minsta målbredden, den övre den största ytan (120 × 80 m) plus 3 m marginal på båda sidor. Kontrollen mot skissens `omrade` är den som styr i praktiken |
| `null` som värde på `planskiss` | Betyder att skiss saknas, som ett utelämnat fält. `readPlanskiss` returnerar `saknas` och vyn visar `PlanskissSaknas` | En JSON-kolumn i databasen har `null` där fältet saknas. Att behandla det som ogiltigt skulle visa ”Planskissen kunde inte visas” för en övning som bara saknar skiss |
| Hur `koer` och `platser` kombineras | Båda listorna skrivs under samma `skalning`. Med `strategi: koer` är `platser` valfri, och med `strategi: platser` är `koer` valfri. Platserna fylls först, därefter köerna, oavsett vilken strategi som anges | ADR 0012 tillåter kombinationen men säger inte hur den skrivs. Att båda strategierna tar emot den andra listan gör att ordningen i skissen inte beror på vilket namn författaren valde |

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Behålla ADR 0012:s teckenmönster och skriva ”Vilande – byter in”** | Skulle hålla ADR:n oförändrad, men etiketten utgår ändå enligt punkt 4, och etiketter som återger en lösning i en mening skulle tvingas till omskrivningar utan säkerhetsvinst (F3) |
| **Samma teckenmönster för korta och långa etiketter** | Enklare, men lämnar tre tecken fria för ett förnamn. Korta etiketter behöver bara roller och nummer |
| **Automatisk kontroll mot en namnlista** | Kan inte skilja ett namn från en förkortning på tre tecken, och en namnlista är i sig en uppgift att underhålla. Människan i redaktörskön, med texterna i klartext, är det skydd som faktiskt fungerar |
| **Visa etiketterna i miniatyren i redaktörskön** | Går inte att läsa vid 96 px bredd, och `beskrivning` syns ändå inte i bilden |
| **Behålla den fasta etiketten ”Vilande, byter in”** | Säger emot övningens egen lösning i de flesta av bankens övningar med udda antal |
| **En femte skalningsstrategi för udda antal** | ADR 0012 valde bort det, och `koer` och `platser` räcker för båda fallen i punkt 4 |
| **Tillåta köer från kon eller ledare, med ett eget `lag`-fält i kön** | Ett fält till att validera och en ny väg att skriva fel. Att den första i kön står vid konen ger samma bild |
| **Utöka formatet nu med jokrar, hinder, stationsetiketter och kast** | Behöver en egen genomgång med fotbollsexperten och planskissutvecklaren, och nödlösningarna räcker för bankens övningar i dag. Tilläggen kräver ingen migrering när de kommer |
| **Ta bort `parallella-ytor` ur formatet** | En formatändring utan vinst. Strategin gör ingen skada och kan behövas för egna övningar |

## Konsekvenser

**Fördelar**

- Den enda avvikelsen mellan schemat och ADR 0012, kommatecknet, är beslutad och dokumenterad.
- Skissen visar den extra spelaren så som övningen faktiskt löser udda antal, och exemplet i ADR 0012 leder inte längre övningsförfattaren fel.
- Redaktören ser allt i skissen som kan innehålla en personuppgift innan en övning publiceras för alla klubbar (F2, RK-9).
- Korta etiketter gör spelarnamn onaturliga att skriva.
- Inget beslut kräver migrering, eftersom ingen övning har `planskiss` ännu.

**Nackdelar och risker**

- **Namn går fortfarande att skriva.** ”ALI” är en giltig kort etikett och ”Kalle, Lisa, Omar” en giltig lång. Skyddet är redaktörens granskning av inskickade övningar. Klubbens egna övningar granskas inte av någon redaktör, och där återstår bara upplysningen i formuläret (F2 b).
- **Kopplingen mellan skissen och `anpassning.udda_antal` valideras inte.** Den vilar på fotbollsexpertens granskning.
- **Nödlösningarna i punkt 6 är mindre tydliga** än en egen symbol. En ruta med etiketten ”Hinder” läses rätt, men teckenförklaringen säger bara ”ruta”.
- **Redaktörens granskningsvy blir längre**, med skiss, teckenförklaring och en lista med texter. UX-designern granskar formen i inkrement 4.
- **Andra ägares filer behöver följa efter.** Schemat och testerna behöver mönstret för korta etiketter (planskissutvecklaren och kvalitetssäkraren). `content/ovningar/README.md` beskriver fortfarande etiketten ”Vilande, byter in” och det allmänna etikettmönstret för korta etiketter (övningsförfattaren). De fyra behoven i punkt 6 ska in i backloggen (produktägaren). Redaktörens checklista behöver punkten ”inga namn i skissens etiketter eller beskrivning” (F2 c). Den här ADR:n ändrar ingen av de filerna.
- **RK-2 är nu ett villkor för punkt 1.** Om ritmotorn någon gång sätter skisstext i ett attribut gäller inte längre bedömningen att kommatecknet är ofarligt, och inte heller att de andra tecknen i mönstret är det (F7).
