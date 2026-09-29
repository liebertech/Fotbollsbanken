# Övningsbanken

**Skrivs av:** ovningsforfattare · **Granskas av:** fotbollsexpert · **Godkänns av:** redaktör (en människa)

Här finns övningarna som regelmotorn sätter ihop till träningspass. Formatet, valideringen och vägen in i appen beslutas i [`docs/adr/0010-ovningsformat-och-lagring.md`](../../docs/adr/0010-ovningsformat-och-lagring.md). Den här filen är den korta arbetsbeskrivningen.

## Filer

- En övning är en YAML-fil: `content/ovningar/<id>.yaml`.
- `<id>` är övningens stabila ID: gemener, siffror och bindestreck, 3–64 tecken, bara ASCII. Filnamnet och fältet `id` ska vara lika.
- Ett ID ändras aldrig och återanvänds aldrig. Byt inte namn på en fil som redan finns i banken.
- Filer som börjar med `_` hoppas över av valideringen och importen.

Repot är källan. Filerna läses in i appens databas av ett CI-jobb, och bara filer med status `godkand` importeras.

## Status

Statusarna nedan gäller **filerna i det här repot**. Appens redaktörskö har egna värden: en inskickad övning är `inskickad`, inte `utkast`, och en egen övning i en klubb har ingen status alls, bara markeringen om den är komplett. Se ADR 0010, avsnitt 4.

```
utkast ──► granskad ──► godkand
  ▲            │
  └─ atgarda ◄─┘
```

| Status | Sätts av | Betyder |
|---|---|---|
| `utkast` | ovningsforfattare | Ny eller åtgärdad övning som väntar på granskning |
| `atgarda` | fotbollsexpert eller redaktör | Behöver ändras. Kommentarerna står i `granskning` |
| `granskad` | fotbollsexpert | Fotbollsfackligt granskad och väntar på godkännande |
| `godkand` | **bara arbetsflödet `godkann-omgang`** | Publicerad i banken och kan väljas av generatorn |

**Skriv aldrig `godkand` för hand.** Varken en människa eller en agent sätter det värdet. Det skrivs av CI efter att användaren har mergat omgångens pull request med sitt eget GitHub-konto (ADR 0013). En pull request som ändrar en status till `godkand` på något annat sätt underkänns av kontrollen `godkannande`.

## Fälten

Fullständiga regler, typer och intervall står i ADR 0010, avsnitt 1. `Krävs` betyder att fältet måste finnas för att filen ska få status `granskad` eller `godkand`.

| Fält | Innehåll | Krävs | Regel |
|---|---|---|---|
| `schema` | Versionen av formatet. Just nu `1` | ja | |
| `id` | Samma som filnamnet | ja | |
| `namn` | Kort namn som ledare känner igen, 3–60 tecken | ja | |
| `syfte` | En mening om vad spelarna ska lära sig | ja | |
| `beskrivning` | Hur övningen går till | ja | |
| `organisation` | Uppställning, grupper och rotation | ja | |
| `fokusomraden` | 1–3 nycklar ur `docs/doman/fokusomraden.md`. Den första är huvudfokus | ja | R-002 |
| `alder` | `min` och `max`, 6–19 | ja | R-003 |
| `spelformer` | 1–5 nycklar ur `docs/doman/spelformer.md` | ja | R-004 |
| `niva` | Lista med `niva-1`, `niva-2` eller `niva-3`. Både 1 och 3 kräver att 2 finns med | ja | R-001 |
| `passdelar` | `del-uppvarmning`, `del-ovning`, `del-spelovning` eller `del-spel`. Aldrig `del-avslutning` | ja | R-005 |
| `ledarbehov` | 0, 1 eller 2 ledare **per grupp** | ja | R-006 |
| `ledaruppgift` | Vad ledaren gör. Krävs när `ledarbehov` är 1 eller 2 | villkorat | |
| `spelare` | `min` och `max` **per grupp**, 1–40 | ja | R-007 |
| `grupptyp` | `fri`, `par`, `tva-lag` eller `fast-storlek` | ja | R-008 |
| `udda_antal_losning` | `true` eller `false`. Bara för `fast-storlek` | villkorat | R-008 |
| `tid` | `kortast`, `rekommenderad` och `langst` i hela minuter, minst 5 | ja | R-009 |
| `yta` | Mått per spelform, eller `alla` för samma mått överallt | ja | R-092 |
| `ytreferens` | Kort text som säger hur stor ytan är, jämfört med något ledaren känner igen. Samma nycklar som `yta`. Se nedan | nej | |
| `material` | Lista med `typ`, `antal` och `anteckning`. `typ` väljs ur den slutna listan i `docs/doman/passuppbyggnad.md`: `boll`, `kon`, `markering`, `vast`, `mal`, `minimal`, `hinder`, `ovrigt`. `ovrigt` kräver en anteckning | ja | R-084, R-120 |
| `coachningspunkter` | 2–4 punkter | ja | |
| `varianter` | `lattare` och `svarare` | ja | R-029 |
| `anpassning` | `fler_spelare`, `udda_antal` och `ledare` | ja | |
| `planskiss` | Skissdata som appen ritar planskissen ur. Se avsnittet *`planskiss`, planskissen* nedan | nej | |
| `kalla` | Inspiration eller källa, om det finns någon | nej | |
| `status` | Se tabellen ovan | ja | |
| `granskning` | Lista med `datum`, `av`, `roll` och `kommentar` | ja | |

Att tänka på:

- **Nickning** märks med fokusområdet `nickspel`, inte med ett eget fält. En övning med `nickspel` måste ha `alder.min` minst 13 (R-081). En övning som innehåller nickning utan att vara märkt släpper förbi säkerhetsreglerna, så märk hellre en gång för mycket.
- **`spelare` och `ledarbehov` gäller en grupp**, inte hela laget. En övning för fyra spelare i taget har `spelare: min 4, max 4`, inte lagets storlek.
- **Skriv inga spelarnamn** någonstans i filen. Banken innehåller inga uppgifter om spelare.
- **Kopiera inte SvFF:s texter eller övningar ordagrant.** Bygg på principerna och ange källa i `kalla`.

### `ytreferens`, ytan i något ledaren känner igen

Ett mått som "30 × 20 meter" går inte att använda på en plan utan måttband. Appen visar därför måttet först och ytreferensen efter det, i parentes: **"30 × 20 meter (ungefär stora planens straffområde)"**. Beslutet står i [ADR 0017](../../docs/adr/0017-ytreferens-i-ovningsformatet.md).

```yaml
yta:
  alla:
    langd: 18
    bredd: 12
ytreferens:
  alla: stora planens målområde, dubbelt så djupt
```

Så här skriver du den:

- **Ordlistan står i `docs/doman/`.** Referensen bygger på den, och fotbollsexperten granskar att den gör det. Hitta inte på en egen jämförelse.
- **Skriv aldrig ett mått i texten.** Metertalet står redan före parentesen, och referensen är en jämförelse, inte ett andra mått. Valideringen underkänner `meter`, `m`, `cm`, `kvadratmeter` och deras släktingar, och mönstret tal × tal. Siffror är tillåtna i övrigt, eftersom spelformernas namn innehåller dem: *hela 7 mot 7-planen*. Steg är också tillåtna: *tio steg utanför straffområdet*.
- **Håll den kort**, ungefär 70 tecken, så att den ryms efter måttet på en mobilskärm. Taket är 90.
- **Skriv liten begynnelsebokstav och ingen punkt.** Texten står inuti en parentes mitt i en rad.
- **Säg vems plandel du menar.** *Straffområdet*, *målområdet* och *mittcirkeln* betyder alltid den fullstora planens, och formuleringen skriver ut det: *stora planens straffområde*. Menar du lagets eget, skriv *ert eget straffområde*. En andel av en spelforms plan skriver alltid ut spelformen: *halva 7 mot 7-planen*, aldrig bara *halva planen*.
- **Ange den per spelform när samma mått förtjänar olika referens.** 18 × 12 meter är *stora planens målområde, dubbelt så djupt* för ett 5 mot 5-lag och *ert eget straffområde* för ett 9 mot 9-lag. Nycklarna följer `yta`: `alla`, eller en spelform som finns i `spelformer`.
- **Utelämna fältet hellre än att hitta på.** Ingen status kräver det, och för en del övningar är det rätt svar att inte ge någon referens: positionsspel och stationer där måttet är själva poängen, och dueller med startavstånd. En parentes som antyder "ungefär" är direkt fel där.

Fältet visas bara. Det filtrerar ingenting och påverkar inte vilka övningar generatorn väljer: ytkontrollen räknar vidare på `langd` och `bredd` (R-092).

## `planskiss`, planskissen

Appen ritar planskissen själv ur fältet `planskiss`. Du skriver inga bilder, bara var saker står och hur de rör sig, i meter. Formatet beslutas i [ADR 0012](../../docs/adr/0012-planskissformat.md). Det här avsnittet räcker för att skriva en skiss.

Fältet får utelämnas. Då visar appen "Planskiss saknas". Finns fältet måste det vara giltigt: `npm run validera:ovningar` underkänner filen annars, med fältet och orsaken, till exempel `planskiss.objekt.3.etikett – etiketten får vara högst 3 tecken`.

### Koordinaterna

- **Allt anges i meter**, med högst en decimal. Fler decimaler avrundas till närmaste decimeter.
- **Origo är ytans övre vänstra hörn.** `x` går längs ytans längd åt höger, `y` längs bredden **nedåt**. Skissen ritas alltid liggande.
- **Lag A anfaller åt höger**, mot växande `x`, när skissen har mål.
- **Marginalen är 3 m.** Objekt får stå upp till 3 m utanför ytan, för köer, ledare vid sidan och mål på kortlinjen: `-3 ≤ x ≤ langd + 3` och `-3 ≤ y ≤ bredd + 3`.
- **Vinklar** (`riktning` på spelare och köer) anges i hela grader 0–359. 0 är åt höger (växande `x`), 90 nedåt (växande `y`), 180 åt vänster och 270 uppåt.
- **`omrade` ska vara samma mått som övningens `yta`.** Skriv måtten från `yta.alla`, eller från den spelform du ritar för. Appen ritar alltid efter övningens `yta` och skalar om koordinaterna när en spelform har andra mått. Skiljer sig sidornas förhållande mer än 25 % skalas skissen inte om. Ange då hellre `yta` per spelform och rita för den vanligaste.

### Fälten på toppnivån

| Fält | Innehåll | Krävs |
|---|---|---|
| `version` | Alltid `1` | ja |
| `omrade` | `langd` 5–120 och `bredd` 5–80 i meter | ja |
| `beskrivning` | Kort text om skissen, högst 300 tecken. Läses upp av skärmläsare | nej |
| `objekt` | 1–60 objekt, se nedan. Högst 40 av dem får vara spelare | ja |
| `rorelser` | 0–30 pilar, se nedan | nej |
| `skalning` | Var fler spelare hamnar, se nedan. Utelämnad betyder `fast` | nej |

Okända fält underkänns överallt i skissen. Ett stavfel blir alltså ett fel och inte ett fält som tyst ignoreras.

### Objekten

Alla objekt har `typ`, `x` och `y`. `id` behövs bara om en rörelse eller en kö pekar på objektet, och är då 1–24 tecken med gemena a–z, siffror och bindestreck, unikt i skissen.

| `typ` | Egna fält | `x`, `y` är |
|---|---|---|
| `spelare` | `lag`: `a`, `b` eller `neutral` (krävs). `malvakt`: `true` eller `false`. `etikett`: 0–3 tecken. `riktning`: grader, visas som ett kort streck | mitten |
| `ledare` | `etikett`: 0–3 tecken. Utan etikett visas `L` | mitten |
| `kon` | – | mitten |
| `boll` | – | mitten |
| `markering` | `form`: `platta`, `prick` eller `linje` (krävs). `till: { x, y }` krävs för `linje` och får inte anges annars | mitten, eller linjens ena ände |
| `mal` | `storlek` (krävs, se nedan). `riktning`: `hoger`, `vanster`, `upp` eller `ner`, åt vilket håll målöppningen vetter (krävs). `bredd`: 0,5–8 m, bara för `storlek: eget` och då krävs den | målets mitt |
| `zon` | `langd`, `bredd` i meter (krävs). `monster`: `diagonal`, `prickar` eller `tom` (krävs). `etikett`: 0–24 tecken | övre vänstra hörnet |
| `ruta` | `langd`, `bredd` i meter (krävs). `stil`: `heldragen` eller `streckad` (krävs). `etikett`: 0–24 tecken | övre vänstra hörnet |

En zon eller ruta ska rymmas inom ytan plus marginalen också med sitt bortre hörn.

Målets bredd hämtas ur `storlek`, så att samma skiss ger rätt mål i varje spelform:

| `storlek` | `3mot3` | `5mot5` | `7mot7` | `9mot9` | `11mot11` | `smamal` | `eget` |
|---|---|---|---|---|---|---|---|
| Bredd (m) | 1,5 | 3 | 5 | 6 | 7,32 | 1 | fältet `bredd` |

En målvakt skrivs som `malvakt: true` på det lag hen tillhör, eller med `lag: neutral` när övningen har en gemensam målvakt.

### Rörelserna

| Fält | Innehåll | Krävs |
|---|---|---|
| `typ` | `passning`, `lopning`, `dribbling` eller `skott` | ja |
| `fran`, `till` | En punkt `{ x: 5, y: 3 }` eller ett objekt `{ objekt: sp-1 }`. Pekar du på ett objekt börjar eller slutar pilen vid symbolens kant | ja |
| `via` | 0–2 punkter som gör pilen böjd | nej |
| `ordning` | 1–9, en siffra i en ring som visar i vilken ordning saker händer | nej |
| `etikett` | 0–24 tecken vid pilens mitt | nej |

Teckenförklaringen, som appen alltid visar bredvid skissen: **passning** heldragen linje, **löpning** streckad linje, **dribbling** vågig linje och **skott** dubbel linje.

### Skalningen: när gruppen har fler spelare

Skissen ritas för ett bestämt antal spelare, som appen känner till när passet är genererat.

- **Rita basskissen för övningens minsta grupp,** `spelare.min`. Då kan skissen bara växa. Räkna alla `spelare`-objekt, målvakterna inräknade.
- **`skalning` säger var de extra spelarna hamnar.** En tillagd spelare ritas alltid som utespelare, aldrig som målvakt. Behövs fler målvakter skriver du dem som egna objekt.
- **Pilarna hör till basskissen.** Tillagda spelare får inga pilar.

| `strategi` | Fält | Så fördelas de extra spelarna |
|---|---|---|
| `fast` | – | Inga läggs till |
| `koer` | `koer`: 1–6 köer `{ vid, riktning, avstand, etikett }`. `vid` är `id` på en **spelare** (krävs). `riktning` i grader (krävs). `avstand` 0,5–5 m, förval 1,5. `etikett` 0–24 tecken, visas en gång vid köns början | En i taget till köerna i tur och ordning. Köspelaren får samma lag som spelaren kön utgår från |
| `platser` | `platser`: 1–20 platser `{ x, y, lag }` | Platserna fylls i listans ordning. Varva `a` och `b` för två lag. En plats kan inte vara målvakt |
| `parallella-ytor` | `per_yta`: 2–20 | En yta ritas, och texten säger hur många likadana ytor gruppen behöver |

`koer` och `platser` kan kombineras: skriv båda listorna under samma `skalning`. Platserna fylls först, därefter köerna.

**Fast storlek och udda antal.** En övning med `grupptyp: fast-storlek` ritar med `fast` om `udda_antal_losning` är `false`. Är den `true` används i stället `koer` med **en** kö vid sidan av ytan, med `etikett: "Vilande, byter in"`, så att den extra spelaren syns. Valideringen kan inte se kopplingen till övningens fält; fotbollsexperten kontrollerar den.

### Etiketter och text

- Etiketter får bara innehålla bokstäver, siffror, mellanslag och tecknen `. , : - / + ( )`.
- **Skriv siffror inom citattecken:** `etikett: "1"`. Utan citattecken läser YAML det som ett tal, och det underkänns.
- **Skriv inga namn, e-postadresser eller andra personuppgifter**, varken i etiketterna eller i `beskrivning`. En e-postadress underkänns av valideringen. Använd roller: `A`, `F`, `MV`, `Anfallare`.
- Hela skissen får vara högst 8 192 byte som JSON. En skiss som håller sig inom taken ovan brukar vara 2–4 kB.

### Exempel per spelform

Exemplen visar formatet, inte granskade skisser för bankens övningar. Varje exempel är giltigt, och ett test (`scripts/planskiss-readme.test.ts`) kontrollerar det, så exemplen kan kopieras som utgångspunkt. Raden `# Spelform:` används av testet.

**7 mot 7: passa och följ i en kvadrat, 15 × 15 meter.** Exempelövningen längst ned i den här filen. Den har `grupptyp: fast-storlek` och `udda_antal_losning: true`, så den femte spelaren står i kö som vilande.

```yaml
# Spelform: 7mot7
planskiss:
  version: 1
  omrade:
    langd: 15
    bredd: 15
  beskrivning: >-
    Kvadrat 15 x 15 meter med en kon i varje hörn och en spelare vid varje kon.
    Bollen börjar i övre vänstra hörnet och passas medsols.
  objekt:
    - { id: ruta-1, typ: ruta, x: 0, y: 0, langd: 15, bredd: 15, stil: streckad }
    - { typ: kon, x: 0, y: 0 }
    - { typ: kon, x: 15, y: 0 }
    - { typ: kon, x: 15, y: 15 }
    - { typ: kon, x: 0, y: 15 }
    - { id: sp-1, typ: spelare, x: 1.2, y: 1.2, lag: a, etikett: "1" }
    - { id: sp-2, typ: spelare, x: 13.8, y: 1.2, lag: a, etikett: "2" }
    - { id: sp-3, typ: spelare, x: 13.8, y: 13.8, lag: a, etikett: "3" }
    - { id: sp-4, typ: spelare, x: 1.2, y: 13.8, lag: a, etikett: "4" }
    - { typ: boll, x: 2.4, y: 2.0 }
  rorelser:
    - { typ: passning, fran: { objekt: sp-1 }, till: { objekt: sp-2 }, ordning: 1 }
    - typ: lopning
      fran: { objekt: sp-1 }
      till: { objekt: sp-2 }
      via: [{ x: 7.5, y: 3.5 }]
      ordning: 2
    - { typ: passning, fran: { objekt: sp-2 }, till: { objekt: sp-3 }, ordning: 3 }
  skalning:
    strategi: koer
    koer:
      - { vid: sp-4, riktning: 90, avstand: 3, etikett: "Vilande, byter in" }
```

**5 mot 5: ett mot ett till mål med målvakt, 20 × 15 meter.** Två köer, en för anfallarna och en för försvararna.

```yaml
# Spelform: 5mot5
planskiss:
  version: 1
  omrade:
    langd: 20
    bredd: 15
  beskrivning: >-
    Yta 20 x 15 meter med ett mål och en målvakt på högra kortsidan. Anfallaren
    startar med boll vid vänstra kortsidan och försvararen vid nedre sidlinjen.
  objekt:
    - { typ: ruta, x: 0, y: 0, langd: 20, bredd: 15, stil: heldragen }
    - { id: mal-1, typ: mal, x: 20, y: 7.5, storlek: 5mot5, riktning: vanster }
    - { typ: spelare, x: 19, y: 7.5, lag: b, malvakt: true }
    - { id: anf, typ: spelare, x: 1, y: 7.5, lag: a, etikett: A }
    - { id: forsv, typ: spelare, x: 10, y: 15, lag: b, etikett: F }
    - { typ: boll, x: 2, y: 7.5 }
  rorelser:
    - typ: dribbling
      fran: { objekt: anf }
      till: { x: 13, y: 5.5 }
      via: [{ x: 7, y: 5 }]
      ordning: 1
    - { typ: lopning, fran: { objekt: forsv }, till: { x: 12, y: 8 }, ordning: 1 }
    - { typ: skott, fran: { x: 13, y: 5.5 }, till: { objekt: mal-1 }, ordning: 2 }
  skalning:
    strategi: koer
    koer:
      - { vid: anf, riktning: 180, etikett: Anfallare }
      - { vid: forsv, riktning: 90, etikett: Försvarare }
```

**9 mot 9: smålagsspel med målvakter, 40 × 30 meter.** Tre mot tre ute. Fler spelare fyller på lagen i tur och ordning.

```yaml
# Spelform: 9mot9
planskiss:
  version: 1
  omrade:
    langd: 40
    bredd: 30
  beskrivning: >-
    Yta 40 x 30 meter med ett mål och en målvakt på varje kortsida och en
    mittlinje. Tre mot tre ute. Lag A anfaller åt höger.
  objekt:
    - { typ: ruta, x: 0, y: 0, langd: 40, bredd: 30, stil: heldragen }
    - { typ: markering, form: linje, x: 20, y: 0, till: { x: 20, y: 30 } }
    - { id: mal-a, typ: mal, x: 0, y: 15, storlek: 9mot9, riktning: hoger }
    - { id: mal-b, typ: mal, x: 40, y: 15, storlek: 9mot9, riktning: vanster }
    - { typ: spelare, x: 1, y: 15, lag: a, malvakt: true }
    - { typ: spelare, x: 39, y: 15, lag: b, malvakt: true }
    - { id: a1, typ: spelare, x: 12, y: 8, lag: a }
    - { id: a2, typ: spelare, x: 12, y: 22, lag: a }
    - { id: a3, typ: spelare, x: 22, y: 15, lag: a, riktning: 0 }
    - { typ: spelare, x: 28, y: 8, lag: b }
    - { typ: spelare, x: 28, y: 22, lag: b }
    - { typ: spelare, x: 18, y: 12, lag: b }
    - { typ: boll, x: 13, y: 9 }
    - { typ: ledare, x: 20, y: 32 }
  rorelser:
    - { typ: passning, fran: { objekt: a1 }, till: { objekt: a3 }, ordning: 1 }
    - { typ: lopning, fran: { objekt: a2 }, till: { x: 30, y: 20 }, ordning: 2 }
    - { typ: passning, fran: { objekt: a3 }, till: { x: 30, y: 20 }, ordning: 3 }
    - { typ: skott, fran: { x: 30, y: 20 }, till: { objekt: mal-b }, ordning: 4 }
  skalning:
    strategi: platser
    platser:
      - { x: 20, y: 5, lag: a }
      - { x: 20, y: 25, lag: b }
      - { x: 30, y: 15, lag: a }
      - { x: 10, y: 15, lag: b }
```

**Parallella ytor.** När övningen körs i flera likadana uppställningar bredvid varandra ritar du en av dem och skriver hur många spelare den tar:

```yaml
  skalning:
    strategi: parallella-ytor
    per_yta: 4
```

Banken har i dag inga övningar för 3 mot 3 och 11 mot 11. Formatet är detsamma där; välj `storlek: 3mot3` eller `storlek: 11mot11` på målen.

## Validering

```
npm run validera:ovningar          # alla filer
npm run validera:ovningar -- <fil> # en fil
```

Kommandot finns när bygget har börjat i fas 4. Fram till dess granskas filerna för hand mot tabellen ovan. Valideringen körs också i CI vid varje ändring under `content/ovningar/`, och som första steg i importen till databasen.

## Exempel på filens form

Exemplet visar formatet, inte en granskad övning. Texterna är avsiktligt korta.

```yaml
schema: 1
id: passa-och-folj
namn: Passa och följ
syfte: Spelarna ska passa med rätt kraft och röra sig efter passningen.
beskrivning: |
  Fyra spelare står i varsitt hörn av en kvadrat. Spelaren med boll passar
  till nästa hörn och följer efter sin egen passning.
organisation: |
  En kvadrat per grupp om fyra. En boll per grupp. Byt riktning efter halva tiden.
fokusomraden:
  - passning-mottagning
  - spelbarhet
alder:
  min: 10
  max: 12
spelformer:
  - 7mot7
niva:
  - niva-1
  - niva-2
passdelar:
  - del-uppvarmning
  - del-ovning
ledarbehov: 0
spelare:
  min: 4
  max: 4
grupptyp: fast-storlek
udda_antal_losning: true
tid:
  kortast: 8
  rekommenderad: 12
  langst: 15
yta:
  alla:
    langd: 15
    bredd: 15
ytreferens:
  alla: ungefär en tredjedel av stora planens straffområde
material:
  - typ: boll
    antal: 1
    anteckning: en per grupp
  - typ: kon
    antal: 4
coachningspunkter:
  - Passa med insidan och lagom kraft.
  - Rör dig direkt efter passningen.
varianter:
  lattare: Stå stilla efter passningen.
  svarare: Två bollar i gång samtidigt.
anpassning:
  fler_spelare: Fler kvadrater bredvid varandra.
  udda_antal: Den femte spelaren vilar ett varv och byter in.
  ledare: Med en ledare per grupp kan coachningen ske under gång.
kalla: Egen övning, inspirerad av allmänt känd passningsövning.
status: utkast
granskning: []
```
