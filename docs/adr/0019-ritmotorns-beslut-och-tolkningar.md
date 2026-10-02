# 0019: Ritmotorns beslut och tolkningar

Status: beslutad (2026-10-02)

## Kontext

ADR 0012 beslutade planskissformatet och ritmotorn vid K2, och ADR 0018 kompletterade formatet. Under bygget av ritmotorn i inkrement 2 har det visat sig att ritmotorn på några punkter gör på ett annat sätt än ADR 0012 säger, och att ADR 0012 på några punkter är så otydlig att ritmotorn har fått välja en tolkning. Den här ADR:n dokumenterar besluten och tolkningarna. Allt som inte nämns här gäller som det står i ADR 0012 och ADR 0018.

Underlaget är koden på grenen `feature/ritmotor`:

- Ritmotorn i `src/planskiss/`, särskilt `matt.ts` (mått och omskalning), `Planskiss.tsx` (målbredd och köns etikett) och `skalning.ts` (köer).
- Visningen i appen i `src/app/planskiss/`: `Planskissvy.tsx`, `KortSkiss.tsx`, `Teckenforklaring.tsx` och `Platshallare.tsx`.
- Lintreglerna i `eslint.config.js`.
- Säkerhetsgranskningen av ritmotorn, `docs/sakerhet/granskning-inkrement-2-ritmotor.md`, fynd R3.

Användaren fattade besluten 2026-10-02.

## Beslut

### 1 Målens bredd styrs av spelformen som skissen visas i

ADR 0012 avsnitt 2 låter ett mål ha `storlek` `3mot3`, `5mot5`, `7mot7`, `9mot9`, `11mot11`, `smamal` eller `eget`, och säger att bredden hämtas ur tabellen så att ”samma skiss ger rätt målstorlek i varje spelform”. ADR:n säger inte vad som gäller när `storlek` är en annan spelform än den skissen visas i. Beslutet:

| `storlek` | Bredd som ritas |
|---|---|
| En spelform, `3mot3` till `11mot11` | Målbredden för **den spelform som skissen visas i** (`spelform` till `Planskiss`). Är spelformen inte känd ritas bredden för målets egen `storlek` |
| `smamal` | Alltid 1,0 m |
| `eget` | Alltid målets eget fält `bredd` |

En `storlek` som är en spelform betyder alltså ”spelformens mål”, inte ett mål med fast bredd. En skiss skriven med `storlek: 7mot7` visas med 3 m breda mål i 5 mot 5 och 5 m breda i 7 mot 7. Behöver en övning ett mål med fast bredd oavsett spelform används `smamal` eller `eget`. Bredderna står i `GOAL_WIDTHS` i `src/planskiss/matt.ts`, och valet görs i `goalWidth` i `src/planskiss/Planskiss.tsx`.

**Skäl.** Samma övning visas i flera spelformer, och övningens yta byts redan efter spelformen (ADR 0012 avsnitt 1). Ett mål som behöll författarens spelform skulle rita ett 11 mot 11-mål på en 5 mot 5-yta. Små mål och egna mål är däremot ett val av utrustning i övningen och ska se likadana ut i alla spelformer.

### 2 Teckenförklaringen och platshållarna ligger i appen som HTML

ADR 0012 avsnitt 3 säger att ritmotorn exporterar komponenten `Teckenforklaring`, och avsnitt 7 att platshållarna `PlanskissSaknas` och `PlanskissFel` tar samma `storlek` som `Planskiss`, vilket läses som att de hör till ritmotorn. Det ersätts av följande:

| Del | Var den ligger | Vad den är |
|---|---|---|
| Ritmotorn, `src/planskiss/` | Ritar bara SVG med elementen och attributen i den slutna vitlistan i `src/planskiss/vitlista.ts` (ADR 0012 avsnitt 6). Exporterar `Planskiss`, symbolerna i förklaringen (`Teckensymbol`) och förklaringens innehåll (`legendEntries`, `LEGEND_NAMES`) | SVG |
| `src/app/planskiss/Teckenforklaring.tsx` | Teckenförklaringen: en lista med ritmotorns symbol och benämningen i ord | HTML |
| `src/app/planskiss/Platshallare.tsx` | `PlanskissSaknas` och `PlanskissFel` | HTML |
| `src/app/planskiss/PlanskissGrans.tsx` | Felgränsen runt varje skiss | React-komponent |
| `src/app/planskiss/Planskissvy.tsx` | Den enda vägen till en skiss i appen: läser utfallet av `readPlanskiss`, ritar `Planskiss` bara för `giltig`, lägger skissen i felgränsen och visar platshållare och teckenförklaring | HTML runt SVG |

Kraven på förklaringen och platshållarna i ADR 0012 avsnitt 3 och 7 gäller oförändrade, bara platsen är ny: förklaringen visas i alla läsbara storlekar, aldrig hopfälld, och platshållarna håller skissens mått.

**Lintskyddet i `src/app/**`.** Eftersom skissens text nu når HTML utanför ritmotorn gäller i hela `src/app/` de förbud som säkerhetsgranskningen kräver i fynd R3 (`eslint.config.js`):

- inget `dangerouslySetInnerHTML`
- inget `ref`, och ingen åtkomst till `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `setAttribute` eller `setAttributeNS`
- inga element utan JSX: `createElement`, `createElementNS`, `cloneElement`, `createFactory`, `react/jsx-runtime` och `react/jsx-dev-runtime`
- inget `createPortal` och inget `XMLSerializer`
- inget `style` med ett uttryck
- ingen typomvandling till `Planskissdata`, bara `readPlanskiss` eller `planskissSchema`
- typad lintning med `@typescript-eslint/no-unsafe-*`

Dessutom får **bara `src/app/planskiss/Planskissvy.tsx` importera `Planskiss`** ur ritmotorn. Övriga filer i appen visar skisser genom `Planskissvy`, så att ingen skiss kan ritas utan att ha passerat `readPlanskiss` och utan felgräns (RK-1).

**Skäl.** Säkerheten i ritmotorn vilar på att den bara kan skapa en sluten lista av SVG-element och attribut, och att den listan kontrolleras av både lint och test (S-07, F9). En HTML-lista eller en inramad yta med text skulle kräva att listan öppnades för `ul`, `li`, `div` och `p`, och därmed att vitlistan slutade vara SVG-specifik. Att lägga HTML-delarna i appen håller ritmotorns vitlista liten, och lintskyddet i `src/app/**` ger appen samma skydd mot de vägar som går förbi React.

### 3 Den extra spelaren vid udda antal visas med en kö med etikett

När gruppen i passet är större än övningens `spelare.max`, vilket generatorn tillåter för övningar med en lösning för udda antal (R-050), ritar ritmotorn fler spelare än `spelare.max`. Den extra spelaren visas i en kö med en etikett som återger övningens lösning, så som ADR 0018 punkt 4 beskriver, och ritas inte bort.

Planskissutvecklaren bygger det just nu på grenen `fix/ritmotor-ux`. Detaljerna, till exempel var kön och etiketten placeras och hur gruppstorleken förs fram till skissen, beskrivs där. Om skissformatet ändras av det arbetet dokumenteras ändringen på den grenen, och en ändring av formatet kräver då en egen ADR.

**Skäl.** Ledaren ska se var varje spelare i gruppen hör hemma. En skiss som ritar fyra spelare för en grupp på fem lämnar ledaren utan svar på var den femte ska stå, och det är just det fallet som lösningen för udda antal finns till för. Etiketten gör att kön inte läses som ytterligare en vanlig spelare i formen.

### 4 Tolkningar där ADR 0012 är otydlig

| Fråga | Tolkning | Var | Skäl |
|---|---|---|---|
| Vad betyder ”om förhållandet mellan sidorna ändras mer än 25 %” (avsnitt 1)? | Kvoten mellan den valda ytans sidförhållande och `omrade`:s sidförhållande räknas ut, och omskalningen uteblir när kvoten **eller dess invers** är större än 1,25. Gränsen är alltså faktorn 1,25 åt något håll, och exakt 1,25 skalas om | `MAX_ASPECT_CHANGE` och `areaFrame` i `src/planskiss/matt.ts` | Gränsen blir symmetrisk: en yta som är 25 % längre och en som är 25 % kortare behandlas lika. En gräns på 0,75 nedåt skulle tillåta en större förvrängning åt det ena hållet än åt det andra |
| För vilket antal ritas skissen när passet delar spelarna i flera grupper (avsnitt 4)? | För passets **största** grupp. Utan gruppindelning är antalet okänt, och basskissen ritas | `sketchPlayerCount` i `src/app/planskiss/KortSkiss.tsx` | Den extra spelaren vid udda antal finns bara i den största gruppen. Ritas skissen för den minsta syns inte spelaren som punkt 3 handlar om |
| När ritas köns etikett (avsnitt 4)? | Bara när kön har fått **minst en spelare**. En kö utan spelare ritas inte alls, inte heller dess etikett | `Planskiss.tsx`, som bara går igenom de köer som `skalning.ts` har fyllt | Etiketten beskriver spelarna i kön. Utan spelare skulle den stå ensam och påstå att någon står där |

## Alternativ

| Alternativ | Varför det valdes bort |
|---|---|
| **Målet behåller bredden för sin egen `storlek`** | Ger fel målstorlek så snart övningen visas i en annan spelform än den skissen skrevs för, och tvingar fram en skiss per spelform |
| **Även `smamal` följer spelformen** | Små mål är utrustning som övningen kräver, inte spelformens mål. De ska se likadana ut oavsett spelform |
| **Teckenförklaringen och platshållarna i ritmotorn, som ADR 0012 säger** | Kräver HTML-element i ritmotorns vitlista. Det försvagar det skydd som hela S-07 vilar på |
| **Teckenförklaringen ritad som SVG i ritmotorn** | Text i SVG bryts inte om och skalar med bilden, så förklaringen blir oläslig i miniatyr och utskrift. En HTML-lista följer textstorleken och läses av skärmläsare |
| **Ritmotorn ritar aldrig fler än `spelare.max`** | Den extra spelaren vid udda antal blir osynlig, vilket ADR 0012 avsnitt 4 och ADR 0018 punkt 4 vill undvika |
| **Skissen ritas för den minsta gruppen** | Visar inte den extra spelaren. Basskissen visar redan minsta gruppstorleken (S-1) |
| **Gränsen på 25 % räknad bara åt ett håll** | Gör gränsen beroende av vilken sida som är längst, och är svårare att förklara för en övningsförfattare |
| **Köns etikett ritas alltid** | En etikett utan spelare beskriver något som inte finns på planen |

## Konsekvenser

**Fördelar**

- En skiss räcker för alla spelformer en övning visas i, också för målen.
- Ritmotorns vitlista förblir sluten och bara SVG, och appen har samma skydd mot vägar förbi React som ritmotorn.
- Det finns en enda väg till en ritad skiss i appen, `Planskissvy`, med validering och felgräns.
- Ledaren ser varje spelare i den största gruppen, också den extra vid udda antal.
- Tolkningarna är dokumenterade, så att tester och framtida ändringar har något att pröva mot.

**Nackdelar och risker**

- **ADR 0012 och koden skiljer sig åt om var förklaringen och platshållarna ligger.** Den som läser bara ADR 0012 hittar dem inte i `src/planskiss/`. ADR 0012 får därför statusen `delvis ersatt av 0018, 0019`.
- **Lintskyddet i `src/app/**` gör vissa vanliga mönster förbjudna,** till exempel `ref` och `style` med ett uttryck. Behöver appen något av dem senare, till exempel `ref` för fokus i planläget, måste det tas upp med säkerhetsagenten och undantaget avgränsas till en fil.
- **Målen följer spelformen även när författaren menat ett fast mått.** Övningsförfattaren måste välja `smamal` eller `eget` för ett mål som inte ska ändras. `content/ovningar/README.md` bör säga det (övningsförfattaren).
- **Punkt 3 är inte färdigbyggd.** Den beror på arbetet på `fix/ritmotor-ux`, och den grenen kan behöva en egen ADR om den ändrar skissformatet.
- **Den största gruppen avgör bilden för alla grupper.** I ett pass med grupper på fyra och fem visar skissen fem, och ledaren får själv se att en grupp saknar den extra spelaren.
