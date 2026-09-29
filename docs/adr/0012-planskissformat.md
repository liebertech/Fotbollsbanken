# 0012: Planskissformat och ritmotor

Status: beslutad (K2, 2026-09-12), delvis ersatt av 0018

## Kontext

ADR 0010 reserverar fältet `planskiss` i övningen: det får finnas, det är antingen frånvarande eller ett objekt med heltalsfältet `version`, och resten lämnas till den här ADR:n. Den bestämmer:

- **Skissdatans format:** koordinatsystem, objekt, rörelser och skalningsregler, så precist att ett Zod-schema kan skrivas direkt ur dokumentet.
- **Ritmotorn:** en ren funktion från skissdata till SVG i React, och hur resultatet blir läsbart på mobil, i utskrift, i mörkt läge och i svartvitt.
- **Hur fynd S-07 uppfylls:** skissdata från ledare är innehåll som en angripare styr och som sprids till alla klubbar.

Följande ramar styr besluten:

| Ram | Källa |
|---|---|
| Planskisser ritas som SVG från skissdata, utan externa bildresurser | `CLAUDE.md`, ADR 0001 |
| Koordinater anges i meter relativt övningsytan, inte i pixlar, och skissen skalar till spelformens mått | `CLAUDE.md`, agentbeskrivningen |
| Skissen ska vara läsbar och proportionerlig på mobil utan zoom, och måtten ska motsvara övningens `yta` och den spelform övningen visas för | Berättelse 06, kriterium 3 och 4 |
| En övning utan skiss visas ändå, med en tydlig markering om att skiss saknas | Berättelse 06, kriterium 2, `designsystem.md` avsnitt 7 |
| Ledare kan lägga till en planskiss i sin egen övning, eller lämna den tom | Berättelse 13, kriterium 3 |
| Skissen ska rymmas som miniatyr (ca 96 × 72 px), stor i planläget (minst 70 % av skärmbredden) och som ca 45 mm i A4-utskrift, svart på vitt utan färgberoende linjer | `designsystem.md` avsnitt 7 |
| Ingen information får bäras enbart av en färgnyans | `designsystem.md` avsnitt 2.3 och 8 (WCAG 1.4.1) |
| Planmått och målstorlekar per spelform, och att planskisser ska rita efter samma mått | `spelformer.md`, avsnitt *Vad spelformen betyder på träning* punkt 1 |
| Skissdata från ledare valideras strikt av Zod vid sparande, med sluten lista av former och bara primitiva värden. Ritmotorn skapar bara React-element, aldrig SVG som sträng, aldrig `dangerouslySetInnerHTML`, aldrig `foreignObject`. Längdgränser och tak krävs | `granskning-k2.md`, S-07 |
| Storleksgränser i databasen, eftersom innehåll från ledare annars kan fylla gratisnivån | `granskning-k2.md`, S-08 |
| Content-Security-Policy utan `unsafe-inline`, vilket skissen måste tåla | `granskning-k2.md`, S-17 |
| Övningens `yta` är en karta från spelformsnyckel eller `alla` till `{ langd, bredd }` i meter | ADR 0010, R-092 |
| TypeScript i `strict`, Zod för validering, Vitest och Playwright för tester. Modulen ligger i `src/planskiss/` | ADR 0001 |
| Innehållet lagras i `exercises.content` (jsonb), och sparade pass innehåller ögonblicksbilder | ADR 0003 |

Två saker gör problemet svårare än det ser ut. **Skalan varierar med två tiopotenser:** samma ritmotor ska rita en 12 × 12 m teknikyta och en 105 × 65 m fullstor plan, och en spelarsymbol som är läsbar på den ena är antingen osynlig eller enorm på den andra. **Antalet spelare är inte känt när övningen skrivs:** övningen anger ett intervall (`spelare.min`–`spelare.max`), och generatorn väljer antalet först när ledaren har angett sitt underlag. Skissen kan därför inte vara en fast bild, utan måste vara en mall med regler för var de extra spelarna hamnar.

## Beslut

### 1 Koordinatsystem

**Allt anges i meter, aldrig i pixlar.** Skissen beskriver en yta på marken, och ritmotorn räknar om till bildenheter först vid renderingen.

| Regel | Värde |
|---|---|
| Origo | Ytans övre vänstra hörn, `(0, 0)` |
| `x` | Längs ytans **längd**, växer åt höger |
| `y` | Längs ytans **bredd**, växer nedåt (samma riktning som SVG:s y-axel, så ingen spegling behövs) |
| Spelriktning | Positiv `x` är anfallsriktningen för lag A när skissen har mål. Skissen ritas alltid liggande, med längden vågrätt |
| Upplösning | Högst en decimal. Värden avrundas till närmaste decimeter vid validering |
| Marginal | Objekt får ligga upp till 3 m utanför ytan, alltså `-3 ≤ x ≤ langd + 3` och `-3 ≤ y ≤ bredd + 3`. Det är till för köer, avbytare, mål bakom kortlinjen och ledare vid sidan. Marginalen är samma 3 m som `spelformer.md` rekommenderar som säkerhetsavstånd |

**Ytans mått kommer från övningen, inte från skissen.** Skissen anger `omrade` som en *referensyta*, och ritmotorn får ytan att rita efter i den här ordningen:

1. Övningens `yta` för den spelform som visas (ADR 0010, R-092). En övning med `yta: { 7mot7: { langd: 30, bredd: 20 } }` ritas som 30 × 20 m när den visas för `7mot7`.
2. Övningens `yta.alla`, om spelformen inte har en egen nyckel.
3. Skissens `omrade`, om övningen saknar `yta`. Det gäller egna övningar, som får sakna fält (berättelse 13, kriterium 2).

**Koordinaterna är relativa.** Om den valda ytan har andra mått än `omrade` skalas alla koordinater om proportionellt: `x' = x × langd_vald / omrade.langd`, och på samma sätt för `y`. Objektens symbolstorlekar skalas *inte* med, se avsnitt 5. Skalfaktorerna för `x` och `y` beräknas var för sig, så en skiss som författats för 30 × 20 m och visas på 30 × 15 m trycks ihop på bredden i stället för att objekt hamnar utanför ytan. Om förhållandet mellan sidorna ändras mer än 25 % avstår ritmotorn från omskalningen och ritar `omrade` som det står, med den valda ytans mått i måttexten. Skälet är att en kraftigt förvrängd skiss blir missvisande, och att övningsförfattaren då hellre ska ange `yta` per spelform.

**Mål och spelformsmått** hämtas ur `spelformer.md` och finns som en konstant tabell i modulen, se avsnitt 2. Måtten är fasta värden i koden med källhänvisning till `spelformer.md`, och ett test jämför tabellen mot dokumentet så att de inte glider isär.

### 2 Objekt

Skissen är ett objekt med fyra fält på toppnivån. **Alla objekt i schemat är `strict`:** okända fält underkänns, aldrig ignoreras.

| Fält | Typ och regel | Krävs |
|---|---|---|
| `version` | Heltal, nu `1`. Samma fält som ADR 0010 reserverar | ja |
| `omrade` | `{ langd, bredd }` i meter, tal 5–120 respektive 5–80, högst en decimal | ja |
| `beskrivning` | Text 0–300 tecken, används som `desc` i SVG:n (avsnitt 5) | nej |
| `objekt` | Lista med 1–60 objekt enligt tabellen nedan | ja |
| `rorelser` | Lista med 0–30 rörelser enligt avsnitt 3 | nej |
| `skalning` | Regel enligt avsnitt 4. Utelämnad betyder `{ strategi: "fast" }` | nej |

**Gemensamma fält för varje objekt:** `typ` (sluten lista, avgör resten), `id` (slug `^[a-z0-9-]{1,24}$`, unikt i skissen) och positionen `x` och `y` i meter enligt avsnitt 1. `id` krävs bara för objekt som pekas ut från `rorelser` eller `skalning`, men ett `id` som finns måste vara unikt.

| `typ` | Egna fält | Betyder |
|---|---|---|
| `spelare` | `lag`: `a`, `b` eller `neutral`. `malvakt`: boolean, förval `false`. `etikett`: text 0–3 tecken. `riktning`: heltal 0–359 grader, valfritt, där 0 är positiv `x` | En spelare. Målvakt anges som `malvakt: true` på det lag hen tillhör, eller med `lag: neutral` när skissen har en gemensam målvakt |
| `ledare` | `etikett`: text 0–3 tecken, förval visas som `L` | Ledaren. Ritas alltid som samma symbol oavsett `ledarbehov` |
| `kon` | – | Strutkon |
| `markering` | `form`: `platta`, `prick` eller `linje`. `till`: `{ x, y }`, krävs och tillåts bara när `form` är `linje` | Platt markering, målad prick eller en rak linje på marken, till exempel en retreatlinje |
| `mal` | `storlek`: `3mot3`, `5mot5`, `7mot7`, `9mot9`, `11mot11`, `smamal` eller `eget`. `bredd`: meter 0,5–8, krävs och tillåts bara när `storlek` är `eget`. `riktning`: `hoger`, `vanster`, `upp` eller `ner`, anger vilket håll målöppningen vetter åt | Mål. `x` och `y` är målets mitt. Bredden hämtas ur tabellen nedan, så samma skiss ger rätt målstorlek i varje spelform |
| `boll` | – | En boll |
| `zon` | `langd`, `bredd`: meter. `monster`: `diagonal`, `prickar` eller `tom`. `etikett`: text 0–24 tecken | Rektangulär yta med mönsterfyllning, till exempel en fredad zon. `x` och `y` är övre vänstra hörnet |
| `ruta` | `langd`, `bredd`: meter. `stil`: `heldragen` eller `streckad`. `etikett`: text 0–24 tecken | Rektangel som bara ritas med kontur, till exempel spelytan eller ett straffområde. `x` och `y` är övre vänstra hörnet |

Listan är sluten. Ett `typ` som inte står i tabellen underkänns.

**Målbredder per spelform**, ur `spelformer.md`. Målets djup ritas som 1 m i alla spelformer, eftersom det bara är en symbol.

| `storlek` | Bredd (m) | Källa |
|---|---|---|
| `3mot3` | 1,5 | SvFF:s rekommendation, högst 1,6 |
| `5mot5` | 3,0 | |
| `7mot7` | 5,0 | Högst 5 |
| `9mot9` | 6,0 | |
| `11mot11` | 7,32 | |
| `smamal` | 1,0 | Minimål utan given spelform, det som ofta ställs ut på träning |
| `eget` | Fältet `bredd` | Används när övningen kräver ett annat mått |

**Symbolerna.** Formen bär informationen, färgen är ett tillägg. Alla former är läsbara i svartvitt och skiljer sig i kontur även vid 96 px bredd.

| Objekt | Symbol |
|---|---|
| Spelare, lag A | Fylld cirkel |
| Spelare, lag B | Ofylld kvadrat med kraftig kontur |
| Spelare, neutral | Ofylld romb |
| Målvakt | Lagets form med vågrätt randmönster och förvald etikett `MV` |
| Ledare | Ofylld triangel med spetsen uppåt |
| Kon | Liten fylld triangel |
| Markering `platta` | Liten ofylld kvadrat, halva spelarsymbolens storlek |
| Markering `prick` | Liten fylld cirkel, en tredjedel av spelarsymbolens storlek |
| Markering `linje` | Punktstreckad linje mellan `x, y` och `till` |
| Mål | Två stolpar och en tvärstreckad linje mellan dem, öppningen åt `riktning` |
| Boll | Liten cirkel med ett inskrivet kryss, så att den skiljs från en prick i svartvitt |
| Zon | Rektangel med mönsterfyllning och tunn kontur |
| Ruta | Rektangel med bara kontur |

`riktning` på en spelare ritas som en kort strecklinje ut från symbolen, inte som en pil, så att den inte förväxlas med en rörelse.

### 3 Rörelser och teckenförklaring

En rörelse är en pil från en punkt till en annan. Fälten:

| Fält | Typ och regel | Krävs |
|---|---|---|
| `typ` | `passning`, `lopning`, `dribbling` eller `skott`. Sluten lista | ja |
| `fran` | `{ x, y }` i meter, eller ett `id` på ett objekt i skissen. Anges som `{ x, y }` eller `{ objekt: "<id>" }` | ja |
| `till` | Samma form som `fran` | ja |
| `via` | Lista med 0–2 punkter `{ x, y }`. Med en punkt ritas en kvadratisk bézierkurva, med två en kubisk. Utan `via` ritas en rak linje | nej |
| `ordning` | Heltal 1–9. Ritas som en liten siffra i en ring vid pilens början, så att en sekvens går att följa | nej |
| `etikett` | Text 0–24 tecken, ritas vid pilens mitt | nej |

När `fran` eller `till` pekar på ett objekt börjar respektive slutar pilen vid symbolens kant, inte i dess mitt, så att pilspetsen syns. En rörelse som pekar på ett `id` som inte finns underkänns av valideringen.

**Teckenförklaring.** Konventionen följer den som är vanligast i svensk tränarlitteratur och i SvFF:s eget utbildningsmaterial: heldraget för bollen i luften eller längs marken mellan spelare, streckat för spelare utan boll, vågigt för spelare med boll och en kraftigare markering för avslut. Fotbollsexperten har tillstyrkt de fyra linjeformerna (granskning 2026-09-12).

| Rörelse | Linje | Pilspets | Läses som |
|---|---|---|---|
| `passning` | Heldragen, rak eller böjd | Enkel, fylld | Bollen går från A till B |
| `lopning` | Streckad, 1 : 1 i strecklängd | Enkel, fylld | Spelaren rör sig utan boll |
| `dribbling` | Vågig (sinusform längs banan) | Enkel, fylld | Spelaren rör sig med boll |
| `skott` | Dubbel heldragen linje, två parallella streck | Enkel, fylld | Avslut mot mål |

De fyra formerna skiljs åt av linjens form och inte av färg eller enbart av tjocklek, så de fungerar i svartvit utskrift och för den som är färgblind.

**Konventionen är vedertagen men inte standardiserad.** Det finns ingen norm som säger att just de här fyra linjeformerna betyder just det här, och olika tränarlitteratur skiljer sig i detaljerna. Valet är ändå oproblematiskt, men bara under ett villkor: **en skriven teckenförklaring visas alltid bredvid skissen.** En ideell ungdomsledare kan aldrig förutsättas kunna en ritkonvention utantill, och skissen ska gå att läsa av den som ser sin första planskiss. Villkoret är ett krav på formatet, inte en rekommendation.

**Förklaringen visas som text, inte bara som symboler.** Ritmotorn exporterar en komponent `Teckenforklaring` som renderar en HTML-lista med symbol **och utskriven benämning i ord** för de objekt- och rörelsetyper som faktiskt förekommer i den visade skissen. Att den bygger på skissens innehåll gör att en enkel skiss får en kort förklaring.

| Vy | Teckenförklaring |
|---|---|
| `normal` (öppnad övning) | Alltid, direkt under skissen |
| `planlage` | Alltid, under eller bredvid skissen |
| `utskrift` | Alltid, under skissen (`designsystem.md` avsnitt 7) |
| `miniatyr` | Nej. Miniatyren är ingen läsbar skiss utan en igenkänningsbild, och den är alltid klickbar för förstoring, där förklaringen finns |

Ingen vy där skissen visas i läsbar storlek får alltså sakna förklaringen, och den får inte vara hopfällbar bakom en knapp som är stängd från början. Kravet testas i avsnitt 8.

**Möjlig senare tilläggstyp: passning i luften jämfört med på marken.** Formatet har i dag en enda `passning`. Skillnaden mellan boll på marken och boll i luften spelar liten roll till och med 12 år, där bollen ska vara på marken, men blir fotbollsfackligt relevant från 13 år för inlägg, långpass och nickövningar (R-080 till R-082). En framtida `passning-luft` med egen linjeform, till exempel heldragen med korta tvärstreck, är ett rent tillägg i den slutna listan: befintliga skisser fortsätter gälla oförändrade, och tillägget kräver ingen migrering och ingen höjning av `version`. Det är inget hinder nu och tas upp först när banken har övningar för 13 år och uppåt som behöver skillnaden.

### 4 Skalning efter antal spelare

Övningen anger `spelare.min`–`spelare.max` **per grupp** (ADR 0010, R-007). Skissen ritas för ett bestämt antal, som ritmotorn får som indata från generatorn eller från övningsvyn.

**Grundregler:**

| Regel | Innebörd |
|---|---|
| S-1 | Basskissen, alltså objekten i `objekt`, ska visa övningens **minsta** gruppstorlek (`spelare.min`). Då kan antalet bara växa, aldrig krympa, och skissen behöver inga regler för att ta bort spelare |
| S-2 | Är antalet lika med eller mindre än basskissens antal ritas basskissen oförändrad |
| S-3 | Är antalet större fördelas överskottet enligt `skalning`, som är en av fyra strategier |
| S-4 | Skalningen är ren och deterministisk: samma skiss och samma antal ger alltid samma bild |
| S-5 | Ritmotorn skapar aldrig fler än 40 spelarsymboler. Överskott utöver det redovisas i text i stället, se `parallella-ytor` |
| S-6 | Skalningen ändrar aldrig `rorelser`. Pilarna hör till basskissens spelare. Tillagda spelare ritas utan pilar |
| S-7 | **En tillagd spelare ritas alltid som utespelare.** Målvaktsmarkeringen ärvs aldrig och kan aldrig sättas av en skalningsregel, oavsett vilket objekt tillägget utgår från. Se motiveringen nedan |

**Strategierna:**

| `strategi` | Fält | Så här fördelas överskottet |
|---|---|---|
| `fast` | – | Inget läggs till. Används när `grupptyp` är `fast-storlek` **och** `udda_antal_losning` är `false`, till exempel en fyrkant för fyra spelare. Är `udda_antal_losning` `true` används `koer` i stället, se *Den extra spelaren vid udda antal* nedan |
| `koer` | `koer`: lista med 1–6 poster `{ vid: "<objekt-id>", riktning: 0–359, avstand: 0,5–5 m (förval 1,5), etikett: text 0–24 tecken (valfri) }` | Överskottet fördelas cyklistiskt över köerna i listans ordning: spelare 1 till kö 1, spelare 2 till kö 2 och så vidare. Den `k`:te spelaren i en kö placeras `k × avstand` meter från köns startobjekt i riktningen `riktning`. Köspelaren ärver **bara laget** från startobjektet och ritas alltid som utespelare (S-7). Köspelaren får ingen egen etikett. Köns `etikett` ritas en gång vid köns början, inte på varje spelare, och utelämnas i `miniatyr` |
| `platser` | `platser`: ordnad lista med 1–20 poster `{ x, y, lag }` | Överskottet placeras på platserna i listans ordning. Räcker platserna inte till stannar utplaceringen, och resten redovisas som text. Används för två lag, där platserna varvas A, B, A, B i listan. En plats anger bara lag, aldrig målvakt: fältet `malvakt` finns inte i posten och underkänns av schemat (S-7) |
| `parallella-ytor` | `per_yta`: heltal 2–20, antal spelare per yta | Skissen visar **en** yta. Antalet ytor är `ceil(antal / per_yta)`. Ritmotorn ritar alltid bara en yta och skriver antalet i bildtexten och i `desc`: ”Så här ser en av 3 ytor ut.” Används när övningen körs i flera identiska uppställningar bredvid varandra |

`koer` och `platser` kan kombineras: anges båda fylls först `platser` i sin ordning, därefter `koer`. Det gör det möjligt att först fylla lagen till jämn storlek och sedan lägga resten i kö.

**Varför en tillagd spelare aldrig blir målvakt (S-7).** Från 5 mot 5 finns exakt en målvakt per lag och mål (`spelformer.md`). En regel som ärver målvaktsmarkeringen skulle rita två eller tre målvakter så snart en kö utgår från målvakten, till exempel i en avslutsövning där skyttarna köar vid målet. Det är ett fotbollsfel i bilden, inte bara en skönhetsfläck: ledaren skulle läsa skissen som att flera spelare ska stå i mål. Regeln gäller därför alla tre strategier som lägger till spelare:

| Strategi | Hur S-7 uppfylls |
|---|---|
| `koer` | Köspelaren ärver laget från startobjektet, men `malvakt` sätts alltid till `false`, även när startobjektet är en målvakt |
| `platser` | Posten kan inte uttrycka en målvakt. Fältet `malvakt` är borttaget ur schemat, så felet är omöjligt att skriva |
| `parallella-ytor` | Berörs inte: strategin lägger aldrig till någon spelare, utan ritar en yta och anger antalet ytor i text. Basskissens egen målvakt ritas som författaren angav den |
| `fast` | Berörs inte: inget läggs till |

Behöver en övning fler målvakter än basskissen visar, till exempel två mål med var sin målvakt, skrivs de som egna `spelare`-objekt med `malvakt: true` i `objekt`. Det är ett val som övningsförfattaren gör medvetet och som fotbollsexperten kan granska, till skillnad från en målvakt som en skalningsregel skapar automatiskt.

**Den extra spelaren vid udda antal.** R-050 tillåter att en grupp är en spelare större än övningens storlek när övningen har en lösning för udda antal (`udda_antal_losning` i ADR 0010, till exempel att en spelare vilar och byter in). Med `fast` skulle den spelaren bli osynlig i skissen: gruppen är fem, skissen visar fyra, och ledaren ser inte var den femte hör hemma. Ingen femte strategi införs för det. I stället gäller:

> En övning med `grupptyp: fast-storlek` och `udda_antal_losning: true` använder `strategi: koer` med **en** kö, placerad vid sidan av ytan eller vid ledaren, med `etikett: "Vilande, byter in"`.

Kön tar då emot den eller de spelare som gruppen är större än basskissen, och den vilande spelaren syns på skissen med sin roll utskriven. Är `udda_antal_losning: false` är `fast` fortsatt rätt, eftersom generatorn då aldrig ger övningen en större grupp (R-050). Valideringen kan inte kräva det här, eftersom skissen inte känner till övningens fält, men `content/ovningar/README.md` beskriver kopplingen för övningsförfattaren och fotbollsexperten kontrollerar den vid granskningen.

**Varför bara en yta ritas i `parallella-ytor`.** Tre 20 × 20 m-ytor bredvid varandra blir 60 m breda, och i en 96 px miniatyr eller 45 mm i en utskrift blir varje spelare mindre än en punkt. En yta i läsbar storlek plus en siffra ger ledaren mer. Regeln gäller även i planläget, där utrymmet är störst men läsbarheten viktigast.

**Två gränser som skyddar bilden:**

- Antalet spelare som ritmotorn tar emot klamras till intervallet `[basantal, basantal + 30]`. Ett orimligt värde ger alltså en full men läsbar skiss, aldrig en trasig.
- En kö ritas med högst 8 spelare. Blir den längre ritas 8 spelare och antalet skrivs som etikett vid köns slut, till exempel ”+4”.

**Reglerna är granskade av fotbollsexperten (2026-09-12).** De fyra strategierna räcker för barn- och ungdomsträning, S-1 (basskissen visar minsta gruppstorleken) stämmer med hur en övningsförfattare tänker, taket på 40 ritade spelarsymboler stämmer med R-017, och att `parallella-ytor` ritar en yta med antalet i text är det som ger ledaren mest. S-7 och regeln för udda antal ovan kom ur samma granskning.

### 5 Rendering

**Ritmotorn är en ren funktion.** Modulen `src/planskiss/` exporterar

```ts
function Planskiss(props: {
  skiss: Planskissdata;      // redan validerad av Zod, se avsnitt 6
  spelform?: Spelform;       // styr målstorlek och val av yta
  yta?: { langd: number; bredd: number };  // övningens yta för spelformen
  antalSpelare?: number;     // styr skalningen enligt avsnitt 4
  storlek: 'miniatyr' | 'normal' | 'planlage' | 'utskrift';
  titel: string;             // övningens namn, blir SVG:ns title
  instansId: string;         // prefix för alla id:n i SVG:n
}): ReactElement
```

Funktionen har inga sidoeffekter, läser ingen tid, inget slumptal och inget webbläsar-API, och hämtar ingen extern resurs. Samma indata ger alltid samma utdata, vilket är förutsättningen för snapshot-testerna i avsnitt 8. `storlek` styr bara detaljnivån, aldrig innehållet: i `miniatyr` utelämnas etiketter, måttext och rörelsernas ordningssiffror, eftersom de ändå inte går att läsa.

**Bildytan.** `viewBox` sätts till ytan plus marginalen, uttryckt i decimeter (1 m = 10 enheter) för att undvika många decimaler: `viewBox="-30 -30 (langd+6)*10 (bredd+6)*10"`. Bredden och höjden i CSS sätts av vyn, inte av komponenten, och `preserveAspectRatio` är förvalt, så skissen behåller sina proportioner i varje vy (berättelse 06, kriterium 3).

**Symbolstorlek skalas inte linjärt med ytan.** Spelarsymbolens diameter beräknas som

> `D = klamp(1,2 m; kortaste sidan av ytan / 18; 4,0 m)`

Det ger 1,2 m på en 15 × 15 m teknikyta och 3,6 m på en fullstor 105 × 65 m plan, alltså symboler som är läsbara i båda fallen. Övriga mått följer `D`: linjebredd `D / 8`, pilspets `D / 2`, etikettens teckenstorlek `0,6 × D`, kon `0,5 × D`, boll `0,35 × D`. Måttexten (”30 × 20 m”) ritas i ytans nedre vänstra hörn med samma teckenstorlek som etiketterna, utom i `miniatyr`.

**Färg och läge.** Ritmotorn skriver aldrig en färg direkt. Varje fyllning och kontur pekar på en CSS-variabel, till exempel `--skiss-lag-a`, `--skiss-linje` och `--skiss-yta`, som definieras i modulens CSS med värden för ljust läge, mörkt läge och planläget enligt `designsystem.md` avsnitt 2. Utskriften får en `@media print`-regel som sätter alla variabler till svart, vitt och grått. Eftersom lagen skiljs åt av form och mönster (avsnitt 2) och rörelserna av linjeform (avsnitt 3) går ingen information förlorad när färgen försvinner.

**Mönster och id:n.** Randmönstret för målvakt och zonernas mönster kräver `<pattern>`-element med id:n. Alla id:n i SVG:n prefixas med `instansId`, som anroparen sätter från övningens id och positionen i passet. Det är nödvändigt eftersom en utskrift av ett pass har flera skisser i samma dokument, och två `<pattern>` med samma id skulle göra att den ena används för båda.

**Storlekar per vy**, enligt `designsystem.md` avsnitt 7:

| Vy | `storlek` | Anmärkning |
|---|---|---|
| Pass och redaktörskö | `miniatyr` | Cirka 96 px bredd, inga etiketter, klickbar för förstoring |
| Byt övning | `miniatyr` | Samma |
| Öppnad övning | `normal` | Full bredd minus sidmarginal, alltså cirka 328 px på en 360 px skärm. Skriven teckenförklaring under skissen (avsnitt 3) |
| Planläget | `planlage` | Minst 70 % av skärmbredden, kraftigare linjer (`D / 6`) för solljus. Skriven teckenförklaring under eller bredvid skissen (avsnitt 3) |
| Utskrift | `utskrift` | Cirka 45 mm bredd, svart på vitt, skriven teckenförklaring under skissen (avsnitt 3) |

**Tillgänglighet.** SVG:n får `role="img"` och `aria-labelledby` som pekar på ett `<title>` och ett `<desc>` med id:n prefixade av `instansId`. `<title>` innehåller övningens namn följt av ”planskiss”. `<desc>` innehåller `skiss.beskrivning` om den finns, annars en genererad sammanfattning: yta, antal spelare per lag, mål, och antal rörelser per typ, till exempel ”Yta 30 × 20 meter. 4 spelare i lag A, 4 i lag B, 1 målvakt. 2 mål. 3 passningar och 2 löpningar.” Sammanfattningen är deterministisk och kan därför snapshot-testas. Skissen är dekorativ i den meningen att övningens text alltid finns bredvid: ingen information i skissen saknas i texten, vilket är kravet för att en bild inte ska behöva en fullständig textmotsvarighet.

**Ingen inline-CSS.** All formatering sker med presentationsattribut (`fill`, `stroke`, `stroke-width`) och CSS-klasser från en CSS-modul, aldrig med `style`-attribut som byggs av data. Då fungerar skissen under en Content-Security-Policy utan `style-src 'unsafe-inline'` (S-17).

### 6 Säkerhet: hur S-07 uppfylls

S-07 gäller att skissdata från en ledare är innehåll som en angripare styr fullt ut, att det sprids till alla klubbar när en inskickad övning godkänns, och att det ritas i klienten. Punkt för punkt:

| Krav i S-07 | Hur det uppfylls |
|---|---|
| Strikt Zod-validering **vid sparande** | Formuläret för egna övningar validerar `planskiss` med samma schema som repofilerna innan raden skickas till databasen. `submit_exercise` kontrollerar dessutom storleken, se nedan |
| Sluten lista av former | `objekt` är en `discriminatedUnion` på `typ` med exakt åtta varianter, `rorelser` en på `typ` med fyra. Varje variant är `.strict()`, så ett okänt fält underkänner hela skissen i stället för att tyst ignoreras |
| Bara primitiva värden | Schemat innehåller bara `number`, `string`, `boolean` och fasta punkter `{ x, y }`. Ingen fri nyckel, ingen `z.record`, ingen `z.any`, ingen `z.unknown`, inget godtyckligt djup. Alla tal är `finite` med undre och övre gräns, så `NaN`, `Infinity` och `1e308` underkänns |
| Bara React-element | Ritmotorn returnerar `ReactElement` och innehåller ingen strängkonkatenering till markup. En ESLint-regel förbjuder `dangerouslySetInnerHTML` (`react/no-danger` som `error`) och en enhetstest kontrollerar att modulens exporter aldrig returnerar en sträng |
| Aldrig `foreignObject` | Elementlistan i ritmotorn är sluten: `svg`, `title`, `desc`, `defs`, `pattern`, `g`, `rect`, `circle`, `polygon`, `line`, `path`, `text` och `tspan`. `foreignObject`, `image`, `use`, `script`, `style`, `a` och `animate` används inte, och en ESLint-regel (`no-restricted-syntax` på JSX-elementnamn) förbjuder dem i `src/planskiss/` |
| Längdgränser för etiketter | `spelare.etikett` och `ledare.etikett` 0–3 tecken, `zon.etikett`, `ruta.etikett`, `rorelse.etikett` och `skalning.koer[].etikett` 0–24 tecken, `beskrivning` 0–300 tecken, `id` 1–24 tecken |
| Tak för antal objekt | Högst 60 objekt, 30 rörelser, 6 köer, 20 platser och 40 ritade spelarsymboler per skiss |

**Teckenuppsättning i etiketter.** Fri text i etiketter begränsas till mönstret `^[\p{L}\p{N} .:\-\/+()]*$` med Unicode-flagga, alltså bokstäver, siffror och ett fåtal skiljetecken. Tecknen `<`, `>`, `&`, `"`, `'`, `\` och styrtecken underkänns. Det är inte skyddet mot XSS — React escapar redan text i `<text>`-noder — utan ett extra lager och ett sätt att hålla skisserna rena.

**Validering också vid läsning.** Skissdata parsas med Zod **både när den sparas och när den läses**, alltså också när den kommer ur `exercises.content`, ur en ögonblicksbild i ett sparat pass och ur den lokala cachen (IndexedDB, ADR 0005). Skälet är att databasen inte kan köra Zod: en rad som skrevs innan en schemaskärpning, eller av något annat än formuläret, får aldrig nå ritmotorn ovaliderad. Ritmotorn tar emot en redan parsad typ och behöver därför inga egna kontroller.

**Storleksgräns i databasen** (kopplar till S-08): en `check`-begränsning på `exercises` som kräver `pg_column_size(content -> 'planskiss') < 8192`. Gränsen är rundlig för en giltig skiss enligt taken ovan, som i praktiken blir 2–4 kB, och stoppar den som försöker fylla utrymmet via skissfältet. Gränsen ägs av senior systemutvecklare och behöver läggas till i migrationen för `exercises`.

**Undantaget i ADR 0010 rad 91** gäller repofiler och deras väg in i banken, inte innehåll från appen. Med den här ADR:n finns det inte längre något skäl att låta `planskiss` vara ogenomskinligt någonstans: valideringsskriptet i ADR 0010 avsnitt 5 bör från och med nu validera `planskiss` fullt ut när fältet finns. Ändringen i ADR 0010 tas upp i rapporten.

**Vad som inte skyddas här.** En giltig skiss kan vara fotbollsfackligt vilseledande, till exempel visa spelare utanför ytan eller pilar som inte hänger ihop med beskrivningen. Det är en granskningsfråga för fotbollsexperten och redaktören, inte en valideringsfråga.

### 7 Fel och tomma skisser

**Ritmotorn får aldrig kasta ett fel och aldrig rita en trasig bild.** Det uppnås genom att valideringen sker före renderingen, och att varje väg fram till ritmotorn har ett definierat utfall.

| Läge | Vad ledaren ser | Var det avgörs |
|---|---|---|
| Övningen saknar `planskiss` | En inramad yta i samma mått som skissen skulle haft, med texten ”Planskiss saknas”. Aldrig en tom lucka eller en bruten bildikon | Komponenten `PlanskissSaknas`, enligt `designsystem.md` avsnitt 7 och berättelse 06, kriterium 2 |
| Skissdata går inte att validera vid läsning | Samma inramade yta, med texten ”Planskissen kunde inte visas”. Övningens text visas som vanligt | Anroparen fångar Zod-felet och renderar `PlanskissFel`. Felet loggas i konsolen i utvecklingsläge |
| Skissdata är ogiltig i formuläret för egen övning | Ett fält-fel med Zods meddelande översatt till svenska, till exempel ”Spelarens etikett får vara högst 3 tecken”. Övningen kan sparas ändå, utan skissen, eftersom en egen övning får vara ofullständig (berättelse 13, kriterium 2) | Formulärvalideringen |
| Skissdata är ogiltig i en repofil | Valideringsskriptet underkänner filen med fil, fält och orsak, och avslutar med kod 1 | `npm run validera:ovningar`, ADR 0010 avsnitt 5 |
| Oväntat fel i renderingen trots giltig data | En felgräns (`ErrorBoundary`) runt varje skiss visar `PlanskissFel`. Resten av passet påverkas inte | Anroparen |

Felmeddelandena i gränssnittet ägs av UX-designern (`texter.md`). Texterna ovan är förslag och behöver granskas där.

**Måtten på platshållaren.** `PlanskissSaknas` och `PlanskissFel` tar samma `storlek`-prop som `Planskiss` och håller samma bredd och höjdförhållande, så att listan över övningar inte hoppar när en övning saknar skiss.

### 8 Tester

Testerna ägs av kvalitetssäkraren. Den här ADR:n anger vad som ska täckas.

**Enhetstester, Vitest** i `src/planskiss/`:

| Område | Vad som testas |
|---|---|
| Validering | Minst ett godkänt och ett underkänt fall per regel: okänt `typ`, okänt fält (`.strict()`), etikett för lång, otillåtet tecken i etikett, `NaN` och `Infinity` som koordinat, koordinat utanför marginalen, för många objekt, för många rörelser, dubblerat `id`, `rorelse` som pekar på ett `id` som inte finns, `bredd` angiven utan `storlek: eget`, `till` angiven utan `form: linje`, `malvakt` angiven i en `platser`-post (ska underkännas av `.strict()`) |
| Skalning | Varje strategi: `fast` ändrar inget, `koer` fördelar cykliskt och placerar den `k`:te spelaren rätt, `platser` fyller i ordning och stannar när platserna tar slut, `parallella-ytor` räknar `ceil` rätt. Gränsfallen: antal under basantalet, antal över taket, kö längre än 8, kombinationen `platser` + `koer` |
| Målvakt vid skalning (S-7) | En kö som utgår från ett objekt med `malvakt: true` ger tillagda spelare med `malvakt: false`, och antalet ritade målvaktssymboler är detsamma som i basskissen oavsett antal spelare. Testas för `koer`, `platser` och `parallella-ytor` |
| Udda antal | En skiss med `strategi: koer`, en kö och `etikett: "Vilande, byter in"` ritar den extra spelaren och etiketten en gång, inte per spelare |
| Teckenförklaring | `Teckenforklaring` innehåller en utskriven benämning för varje objekt- och rörelsetyp som förekommer i skissen, och renderas i `normal`, `planlage` och `utskrift` men inte i `miniatyr` |
| Koordinatomräkning | Omskalning mellan `omrade` och en avvikande `yta`, och att omskalningen uteblir när sidförhållandet ändras mer än 25 % |
| Symbolstorlek | `D` för en liten yta, en stor yta och båda klampgränserna |
| Renhet | Samma indata ger samma utdata två gånger. Ritmotorn returnerar aldrig en sträng, och inget förbjudet SVG-element förekommer i utdata |
| Målstorlekar | Tabellen i avsnitt 2 stämmer med `spelformer.md` |
| Tillgänglighet | `title` och `desc` finns alltid, `aria-labelledby` pekar på dem, och id:n är prefixade med `instansId` |

**Snapshot-tester** på den renderade SVG-strukturen, ett per fall, för att fånga oavsiktliga ändringar: en fast skiss, en med köer, en med platser, en med parallella ytor och en per `storlek`.

**Visuella tester, Playwright** med skärmbilder, mobil viewport:

| Fall | Varför |
|---|---|
| En representativ övning **per spelform**: `3mot3`, `5mot5`, `7mot7`, `9mot9` och `11mot11` | Skalan är det svåraste i formatet, och de fem spelformerna spänner över hela intervallet från 12 m till 105 m (`spelformer.md`) |
| Varje `storlek`: miniatyr, normal, planläge och utskrift | Läsbarhet på 360 px, i planläget och på A4 |
| Ljust läge, mörkt läge och planläget | `designsystem.md` avsnitt 2 |
| Svartvitt, framtvingat med en gråskalefilter i testet | Kravet att lagen skiljs åt utan färg |
| En övning utan skiss och en med ogiltig skiss | Avsnitt 7 |
| Ett helt pass i utskriftsvyn med flera skisser | Att `instansId` gör mönstren unika |

Två kontroller kan automatiseras utöver skärmbilderna: att den minsta ritade symbolen är minst 6 px i den renderade bilden vid 320 px bredd, och att axe inte hittar fel på den vy som innehåller skissen.

### 9 Komplett exempel

Skissen nedan hör till exempelövningen `passa-och-folj` i `content/ovningar/README.md`: fyra spelare i varsitt hörn av en 15 × 15 m kvadrat, som passar till nästa hörn och följer efter sin egen passning. Fältet läggs in i övningsfilen som `planskiss`.

```yaml
planskiss:
  version: 1
  omrade:
    langd: 15
    bredd: 15
  beskrivning: >-
    Kvadrat 15 x 15 meter med en kon i varje hörn och en spelare vid varje kon.
    Bollen börjar i övre vänstra hörnet och passas medsols.
  objekt:
    - { id: kon-1, typ: kon, x: 0, y: 0 }
    - { id: kon-2, typ: kon, x: 15, y: 0 }
    - { id: kon-3, typ: kon, x: 15, y: 15 }
    - { id: kon-4, typ: kon, x: 0, y: 15 }
    - { id: sp-1, typ: spelare, x: 1.2, y: 1.2, lag: a, etikett: "1" }
    - { id: sp-2, typ: spelare, x: 13.8, y: 1.2, lag: a, etikett: "2" }
    - { id: sp-3, typ: spelare, x: 13.8, y: 13.8, lag: a, etikett: "3" }
    - { id: sp-4, typ: spelare, x: 1.2, y: 13.8, lag: a, etikett: "4" }
    - { id: boll-1, typ: boll, x: 2.4, y: 2.0 }
    - id: ruta-1
      typ: ruta
      x: 0
      y: 0
      langd: 15
      bredd: 15
      stil: streckad
  rorelser:
    - typ: passning
      fran: { objekt: sp-1 }
      till: { objekt: sp-2 }
      ordning: 1
    - typ: lopning
      fran: { objekt: sp-1 }
      till: { objekt: sp-2 }
      via: [{ x: 7.5, y: 3.5 }]
      ordning: 2
    - typ: passning
      fran: { objekt: sp-2 }
      till: { objekt: sp-3 }
      ordning: 3
  skalning:
    strategi: parallella-ytor
    per_yta: 4
```

Med åtta spelare i gruppen ritar ritmotorn samma kvadrat en gång och skriver ”Så här ser en av 2 ytor ut” i bildtexten och i `desc`. Med fyra spelare ritas den utan tillägg. Skissen har inget `mal`-objekt och påverkas därför inte av spelformen, utom genom övningens `yta`.

Ett exempel på den andra vanliga strategin, en kö bakom startkonen i en dribblingsbana:

```yaml
  skalning:
    strategi: koer
    koer:
      - { vid: sp-1, riktning: 180, avstand: 1.5 }
```

Med `spelare.min: 3` i basskissen och sex spelare i gruppen placeras tre extra spelare 1,5, 3,0 och 4,5 meter till vänster om `sp-1`, med samma lag som `sp-1`, utan etikett och alltid som utespelare — även om `sp-1` hade varit målvakt (S-7).

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Koordinater i pixlar eller i 0–100 %** | Pixlar binder skissen till en bildstorlek och gör målstorlekar och avstånd omöjliga att uttrycka riktigt. Procent av ytan ser skalfritt ut men förvränger allt när ytan inte är kvadratisk: en kon 10 % in från kortsidan och 10 % in från långsidan hamnar på olika avstånd i meter. Meter är dessutom det språk ledaren och `spelformer.md` redan använder |
| **Färdiga SVG-filer per övning** | Enklast att komma igång med, men skissen kan då inte anpassas efter spelform eller antal spelare, vilket är hela poängen. Filerna skulle också vara externa resurser, som `CLAUDE.md` uttryckligen utesluter, och innehåll från ledare i SVG-form är en direkt XSS-väg (S-07) |
| **En ritad bild lagrad som SVG-sträng i `planskiss`** | Samma XSS-problem, och strängen går inte att granska i en diff eller validera med Zod på ett meningsfullt sätt |
| **Canvas i stället för SVG** | Canvas skalar inte i utskrift utan att bli suddig, saknar text som skärmläsare når och kräver en egen renderingsloop. SVG är vektor, tillgänglig och skrivbar som React-element |
| **Fri form med generella `shape`-objekt (polygon, path)** | Mer uttrycksfullt, men ett `path`-objekt med fri `d`-sträng är godtycklig data som en angripare styr och som inte kan valideras semantiskt. Den slutna listan i avsnitt 2 är ett medvetet val för S-07:s skull |
| **Automatisk placering ur beskrivningstexten** | Skulle spara arbete för övningsförfattaren, men kräver tolkning av fri text, alltså gissning, och `CLAUDE.md` utesluter AI i appen |
| **Att skissen själv anger absoluta mått i stället för att ärva övningens `yta`** | Skissen och `yta` skulle då kunna säga emot varandra, och R-092 räknar på `yta`. Med `yta` som styrande och `omrade` som referens finns en sanning |
| **Att rita alla parallella ytor** | Ärligare mot verkligheten, men obrukbart i en 96 px miniatyr eller 45 mm utskrift. En läsbar yta plus en siffra ger ledaren mer |
| **Egna former per lagfärg i stället för form och mönster** | Färg ensam faller i svartvit utskrift och för färgblinda (`designsystem.md` avsnitt 8, WCAG 1.4.1) |
| **Att låta `planskiss` fortsatt vara ogenomskinlig för valideringen** | Det som ADR 0010 rad 91 säger i dag. Går inte att förena med S-07, eftersom samma fält fylls av ledare i appen |
| **Ett eget filformat eller ett befintligt taktikformat** | Inget etablerat öppet format täcker svenska spelformer och skalning efter antal spelare, och ett externt beroende skulle behöva valideras lika hårt ändå |

## Konsekvenser

**Fördelar**

- Samma skiss fungerar i alla fem spelformerna och för hela intervallet av gruppstorlekar, eftersom måtten är meter och skalningen är en regel i stället för en bild.
- Formatet är läsbart i en diff och skrivbart för hand i YAML, så övningsförfattaren kan skapa skisser i fas 3 innan någon ritredigerare finns, och fotbollsexperten kan granska dem.
- S-07 kan stängas: sluten formlista, bara primitiva värden, tak och längdgränser, validering vid både skrivning och läsning, och en ritmotor som bara skapar React-element.
- Ritmotorn är en ren funktion, vilket gör snapshot-tester och visuella tester meningsfulla och gör att samma kod kan användas i pass, planläge, utskrift och redaktörskö.
- Ingen extern bildresurs, inget nytt beroende och ingen bildlagring. Supabase Storage behöver fortfarande inte aktiveras (S-24).
- **En övning är en uppställning, och det är ett medvetet val.** Skalningen fördelar fler spelare i en given uppställning, men byter aldrig uppställning. En rondo 4 mot 1 blir alltså inte 6 mot 2 genom skalning, utan är två övningar i banken. Fotbollsexperten bekräftar att det är rätt svar (granskning 2026-09-12): 4 mot 1 och 6 mot 2 är pedagogiskt olika övningar med olika krav på spelarna — annat tempo, andra vinklar, annan press och olika svårighetsgrad — och de bör kunna ha olika ålder, nivå och syfte. Att tvinga in dem i en skiss skulle dölja skillnaden för ledaren. Gränsen håller dessutom skalningen till fyra enkla, testbara regler.

**Nackdelar och risker**

- **Att skriva koordinater för hand är arbetsamt.** En skiss med tio objekt är tio rader med siffror som ingen ser förrän den renderas. Fas 3 behöver därför tidigt ett litet förhandsgranskningsverktyg, till exempel en sida i utvecklingsservern som ritar en YAML-fil. Utan det blir skisserna få eller felaktiga. Ritredigeraren för ledare (berättelse 13, kriterium 3) är ett större arbete som hör till inkrement 2 och behöver egen tid i backloggen.
- **Omskalningen mellan `omrade` och `yta` kan bli missvisande** när sidförhållandet skiljer sig. Regeln med 25 % gräns är en avvägning, inte en sanning, och behöver prövas mot verkliga övningar i fas 3.
- **Formatet är en gång till att hålla i synk.** Målmåtten finns både i `spelformer.md` och som konstant i koden. Testet som jämför dem minskar risken men tar inte bort den.
- **En formatändring efter fas 3 kostar.** Varje övning med skiss måste då migreras. Därför finns `version` från början: en höjning till `2` innebär att importen och klienten kan läsa båda, och att ett skript skriver om filerna. **I dag finns ingen övning med skiss i banken, så den här ADR:n kräver ingen migrering.** Det är också skälet att besluta formatet nu, före fas 3.
- **Läsbarheten i miniatyren är begränsad.** Vid 96 px och en fullstor plan är skissen en översiktsbild, inte något att läsa detaljer i. Det är accepterat i `designsystem.md` avsnitt 7, där miniatyren är klickbar för förstoring, men det bör bekräftas i den visuella granskningen.
- **Beroenden till andra dokument.** Tre filer som andra äger behöver ändras, och de listas i rapporten: `content/ovningar/README.md` (fältet `planskiss` behöver en kort beskrivning, en hänvisning hit och regeln att en övning med `udda_antal_losning: true` ritar den vilande spelaren som en kö enligt avsnitt 4), ADR 0010 (undantaget i rad 91 gäller inte längre, och valideringsskriptet ska validera `planskiss`) och migrationen för `exercises` (storleksgränsen i avsnitt 6). Jag har inte ändrat något av dem.
- **Teckenförklaringen är ett krav på varje läsbar vy, inte bara på ritmotorn.** Att förklaringen alltid ska visas bredvid skissen (avsnitt 3) binder också de vyer som UX-designern äger: öppnad övning, planläget och utskriften. Blir utrymmet trångt får skissen krympa, inte förklaringen tas bort. Det behöver bekräftas när `texter.md` och utskriftsvyn detaljeras.
