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
| `spelare` | `lag`: `a`, `b` eller `neutral` (krävs). `malvakt`: `true` eller `false`. `etikett`: 0–3 versaler eller siffror. `riktning`: grader, visas som ett kort streck | mitten |
| `ledare` | `etikett`: 0–3 versaler eller siffror. Utan etikett visas `L` | mitten |
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

- **Rita basskissen för övningens minsta grupp,** `spelare.min`. Då kan skissen bara växa. Antalet `spelare`-objekt i basskissen ska vara lika med `spelare.min`, och så räknar du:
  - **Målvakter räknas.**
  - **En joker räknas**, och ritas som en spelare med `lag: neutral`.
  - **Spelare som står i kö i basskissen räknas**, till exempel den andra spelaren i starthörnet.
  - **Ledaren räknas inte.** Ett `ledare`-objekt är aldrig en av spelarna.
- **`skalning` säger var de extra spelarna hamnar.** En tillagd spelare ritas alltid som utespelare, aldrig som målvakt. Behövs fler målvakter skriver du dem som egna objekt.
- **Pilarna hör till basskissen.** Tillagda spelare får inga pilar.

| `strategi` | Fält | Så fördelas de extra spelarna |
|---|---|---|
| `fast` | – | Inga läggs till |
| `koer` | `koer`: 1–6 köer `{ vid, riktning, avstand, etikett }`. `vid` är `id` på en **spelare** (krävs). `riktning` i grader (krävs). `avstand` 0,5–5 m, förval 1,5. `etikett` 0–24 tecken, visas en gång vid köns början | En i taget till köerna i tur och ordning. Köspelaren får samma lag som spelaren kön utgår från |
| `platser` | `platser`: 1–20 platser `{ x, y, lag }`. `lag` är `a`, `b` eller `neutral` | Platserna fylls i listans ordning. Varva `a` och `b` för två lag. En plats kan inte vara målvakt |
| `parallella-ytor` | `per_yta`: 2–20 | En yta ritas, och texten säger hur många likadana ytor gruppen behöver |

`koer` och `platser` kan kombineras: skriv båda listorna under samma `skalning`. Platserna fylls först, därefter köerna.

**En kö utgår alltid från en spelare** ([ADR 0018](../../docs/adr/0018-kompletteringar-av-planskissformatet.md), punkt 5). `vid` pekar på ett `spelare`-objekt, aldrig på en kon eller en ledare, eftersom köspelarna ärver spelarens lag. Ska kön stå bakom en kon eller vid ledaren ritar du den **första i kön** som en spelare vid konen eller ledaren, och låter kön utgå från den spelaren. Står redan två spelare i kön i basskissen låter du kön utgå från den bakersta, så att nästa spelare hamnar bakom dem. Välj `riktning` och `avstand` så att hela kön ryms inom ytan plus marginalen på 3 m, för det antal spelare övningen kan få. Ryms den inte, låter du kön gå längs linjen i stället för rakt ut.

Två regler i ritmotorn gör att kön alltid går att räkna:

- **Spelarna i en kö överlappar aldrig.** Är `avstand` kortare än symbolen ritas kön med symbolens bredd plus ett litet glapp i stället, det vill säga ungefär 1,2 gånger symbolens diameter `D`. På en liten yta är `D` 1,2 m, så ett `avstand` under ungefär 1,5 m gör ingen skillnad. På en stor yta är symbolen större och kön blir längre.
- **Kön stannar vid bildens kant.** En köspelare som inte ryms helt inom ytan plus marginalen ritas inte. Kön visar då så många som ryms och skriver resten som ”+N” vid köns slut. Ryms ingen, står antalet i texten under skissen.

**Fast storlek och udda antal** (ADR 0018, punkt 4). En övning med `grupptyp: fast-storlek` ritar med `fast` om `udda_antal_losning` är `false`. Är den `true` ska skissen visa den extra spelaren så som övningen löser udda antal i `anpassning.udda_antal`:

- **Har den extra spelaren en roll utanför formen**, använd `koer` med **en** kö. Etiketten återger övningens egen lösning med egna ord, högst 24 tecken, till exempel `Rullar in bollar`, `Nästa målvakt` eller `Byter in efter varvet`. Det finns ingen fast etikett.
- **Ger den extra spelaren en ny form**, till exempel en fjärde punkt så att en triangel blir en kvadrat, använd `platser` med platsen i den nya formen.

Valideringen kan inte se kopplingen till övningens fält; fotbollsexperten kontrollerar den.

**Par vid udda antal** (användarens beslut 2026-10-02). En övning med `grupptyp: par` kan få en trio i passet när antalet spelare är udda (R-054). Skissen ritas alltid för gruppens storlek i passet, också när den är större än `spelare.max`. Rita därför basskissen för paret och visa den tredje spelaren på samma sätt som för fast storlek ovan:

- **Har den tredje en roll utanför paret**, till exempel väntar med en ny boll eller vilar och byter in, använd `koer` med **en** kö. Etiketten återger övningens lösning i `anpassning.udda_antal` med egna ord, högst 24 tecken.
- **Får den tredje en plats i övningen**, till exempel som kastare eller målvakt, använd `platser` med den platsen.

Kön eller platsen syns bara när gruppen är en trio. I ett par ritas basskissen som den är. Exemplet visar ett mot ett till småmål, där övningens lösning för udda antal är att tre spelare turas om och den som väntar har en ny boll redo:

```yaml
# Spelform: 5mot5
planskiss:
  version: 1
  omrade:
    langd: 12
    bredd: 8
  beskrivning: >-
    Yta 12 x 8 meter med ett småmål på varje kortsida. Anfallaren startar med
    boll vid nedre sidlinjen och försvararen i mitten. Vid udda antal väntar en
    tredje spelare utanför sidlinjen med en ny boll.
  objekt:
    - { typ: ruta, x: 0, y: 0, langd: 12, bredd: 8, stil: heldragen }
    - { id: mal-a, typ: mal, x: 0, y: 4, storlek: smamal, riktning: hoger }
    - { id: mal-b, typ: mal, x: 12, y: 4, storlek: smamal, riktning: vanster }
    - { id: anf, typ: spelare, x: 2, y: 8, lag: a, etikett: A }
    - { id: forsv, typ: spelare, x: 8, y: 4, lag: b, etikett: F }
    - { typ: boll, x: 2.9, y: 7.6 }
  rorelser:
    - typ: dribbling
      fran: { objekt: anf }
      till: { x: 9, y: 2.5 }
      via: [{ x: 5, y: 4 }]
      ordning: 1
    - { typ: lopning, fran: { objekt: forsv }, till: { x: 7, y: 3 }, ordning: 1 }
    - { typ: skott, fran: { x: 9, y: 2.5 }, till: { objekt: mal-b }, ordning: 2 }
  skalning:
    strategi: koer
    koer:
      - { vid: anf, riktning: 90, etikett: Väntar med ny boll }
```

Med två spelare visar skissen paret. Med tre står den tredje utanför sidlinjen, under anfallaren, med etiketten ”Väntar med ny boll”. Kön utgår från anfallaren, så den tredje ritas i lag A. Formatet är oförändrat: det är samma `koer` som för fast storlek.

**Behov som saknar en egen form** (ADR 0018, punkt 6). Formatet har ännu ingen egen form för följande. Rita dem tills vidare så här:

| Behov | Så ritar du det |
|---|---|
| Jokrar som går in i lagen vid udda antal eller när gruppen växer | `platser` med platser för lag `a` och `b`. Skriv i `beskrivning` hur jokrarna går in i lagen, till exempel ”Vid udda antal blir en spelare joker.” Jokrar som finns redan i basskissen ritas med `lag: neutral` |
| Låga hinder | En liten `ruta` med etikett, till exempel `Hinder` |
| Stationer | En liten `ruta` med stationens etikett, till exempel `Station 2` |
| Kast, inkast och hörna | En `passning` med etikett, till exempel `Inkast` |

### Etiketter och text

- **Etiketten på en spelare eller en ledare** är högst 3 tecken och får bara innehålla **versaler och siffror**, till exempel `A`, `F`, `MV`, `L`, `1` eller `12`. Gemener, mellanslag och skiljetecken underkänns (ADR 0018, punkt 2).
- **Övriga etiketter**, på zoner, rutor, rörelser och köer, är högst 24 tecken och får innehålla bokstäver, siffror, mellanslag och tecknen `. , : - / + ( )`.
- **Appen flyttar en etikett som inte får plats.** En etikett ritas aldrig ovanpå en symbol eller en annan etikett och klipps aldrig av bildens kant. Står något i vägen flyttas etiketten till närmaste lediga plats, helst utåt. Ryms den inte hel kortas den med ”…”. Etiketten på en liten ruta, till exempel en station, står bredvid rutan. Måttexten står alltid i nedre vänstra hörnet och flyttas bara nedåt i marginalen. Korta etiketter ger alltså en lugnare bild: skriv `Station 1` hellre än `Station 1, hopp på ett ben`, och lägg resten i övningens text.
- **Skriv siffror inom citattecken:** `etikett: "1"`. Utan citattecken läser YAML det som ett tal, och det underkänns.
- **`beskrivning` skrivs på en rad.** Radbrytningar, tabbar och andra styrtecken underkänns. Skriv längre texter med `>-` i YAML, som i exemplen, så blir radbrytningarna i filen mellanslag.
- **Skriv inga namn, e-postadresser eller andra personuppgifter**, varken i etiketterna eller i `beskrivning`. En e-postadress underkänns av valideringen. Använd roller: `A`, `F`, `MV`, `Anfallare`.
- Hela skissen får vara högst 8 192 byte som JSON. En skiss som håller sig inom taken ovan brukar vara 2–4 kB.

### Exempel per spelform

Exemplen visar formatet, inte granskade skisser för bankens övningar. Varje exempel är giltigt, och ett test (`scripts/planskiss-readme.test.ts`) kontrollerar det, så exemplen kan kopieras som utgångspunkt. Raden `# Spelform:` används av testet.

**7 mot 7: passa och följ i en kvadrat, 15 × 15 meter, fem spelare.** Passa och följ med fyra hörn kräver minst fem spelare: den som passar springer till nästa hörn, och där måste någon stå kvar och ta emot. Basskissen har därför två spelare i starthörnet. Fler spelare ställs i kö vid hörnen 2, 3, 4 och 1, i den ordningen, med 1,5 m mellan spelarna i kön. Exemplet är fristående från exempelövningen längst ned i filen men gäller samma antal spelare, 5–9.

```yaml
# Spelform: 7mot7
planskiss:
  version: 1
  omrade:
    langd: 15
    bredd: 15
  beskrivning: >-
    Kvadrat 15 x 15 meter med en kon i varje hörn och en spelare vid varje kon.
    Två spelare står i övre vänstra hörnet, där bollen börjar. Bollen passas
    medsols och den som passar följer efter till nästa hörn.
  objekt:
    - { typ: ruta, x: 0, y: 0, langd: 15, bredd: 15, stil: streckad }
    - { typ: kon, x: 0, y: 0 }
    - { typ: kon, x: 15, y: 0 }
    - { typ: kon, x: 15, y: 15 }
    - { typ: kon, x: 0, y: 15 }
    - { id: sp-1, typ: spelare, x: -0.8, y: -0.8, lag: a, etikett: "1" }
    - { id: sp-5, typ: spelare, x: -1.9, y: -1.9, lag: a, etikett: "5" }
    - { id: sp-2, typ: spelare, x: 15.8, y: -0.8, lag: a, etikett: "2" }
    - { id: sp-3, typ: spelare, x: 15.8, y: 15.8, lag: a, etikett: "3" }
    - { id: sp-4, typ: spelare, x: -0.8, y: 15.8, lag: a, etikett: "4" }
    - { typ: boll, x: 0.3, y: 0.3 }
  rorelser:
    - { typ: passning, fran: { objekt: sp-1 }, till: { objekt: sp-2 }, ordning: 1 }
    - typ: lopning
      fran: { objekt: sp-1 }
      till: { x: 16.6, y: -1.6 }
      via: [{ x: 7.5, y: -2.5 }]
      ordning: 2
    - { typ: passning, fran: { objekt: sp-2 }, till: { objekt: sp-3 }, ordning: 3 }
  skalning:
    strategi: koer
    koer:
      - { vid: sp-2, riktning: 315 }
      - { vid: sp-3, riktning: 45 }
      - { vid: sp-4, riktning: 135 }
      - { vid: sp-5, riktning: 225 }
```

Kön vid hörn 1 utgår från spelare 5, den bakersta i starthörnet, så att nästa spelare ställer sig bakom hen. Med 1,5 m avstånd ryms en spelare till i varje kö inom marginalen, alltså upp till nio spelare.

**5 mot 5: ett mot ett till mål med målvakt, 15 × 9 meter.** Tre spelare i basskissen: målvakten, en anfallare och en försvarare. Två köer, en för anfallarna och en för försvararna. Köerna går längs linjerna, anfallarnas uppåt längs kortsidan och försvararnas åt vänster längs sidlinjen, så att flera spelare ryms i varje kö med förvalt avstånd.

```yaml
# Spelform: 5mot5
planskiss:
  version: 1
  omrade:
    langd: 15
    bredd: 9
  beskrivning: >-
    Yta 15 x 9 meter med ett mål och en målvakt på högra kortsidan. Anfallaren
    startar med boll vid vänstra kortsidan och försvararen vid nedre sidlinjen.
  objekt:
    - { typ: ruta, x: 0, y: 0, langd: 15, bredd: 9, stil: heldragen }
    - { id: mal-1, typ: mal, x: 15, y: 4.5, storlek: 5mot5, riktning: vanster }
    - { typ: spelare, x: 14.2, y: 4.5, lag: b, malvakt: true, etikett: MV }
    - { id: anf, typ: spelare, x: 0, y: 4.5, lag: a, etikett: A }
    - { id: forsv, typ: spelare, x: 7, y: 9, lag: b, etikett: F }
    - { typ: boll, x: 0.9, y: 4.5 }
  rorelser:
    - typ: dribbling
      fran: { objekt: anf }
      till: { x: 10, y: 3 }
      via: [{ x: 5, y: 3 }]
      ordning: 1
    - { typ: lopning, fran: { objekt: forsv }, till: { x: 9, y: 5 }, ordning: 1 }
    - { typ: skott, fran: { x: 10, y: 3 }, till: { objekt: mal-1 }, ordning: 2 }
  skalning:
    strategi: koer
    koer:
      - { vid: anf, riktning: 270, etikett: Anfallare }
      - { vid: forsv, riktning: 180, etikett: Försvarare }
```

**9 mot 9: smålagsspel med målvakter, 40 × 30 meter.** Tre mot tre ute. Fler spelare fyller på lagen i tur och ordning. Ytan har ingen mittlinje, eftersom 9 mot 9 inte har någon retreatlinje. Behöver en övning en linje, till exempel för en zon, ritar du den som en `markering` med `form: linje` och skriver i `beskrivning` vad den betyder.

```yaml
# Spelform: 9mot9
planskiss:
  version: 1
  omrade:
    langd: 40
    bredd: 30
  beskrivning: >-
    Yta 40 x 30 meter med ett mål och en målvakt på varje kortsida. Tre mot tre
    ute. Lag A anfaller åt höger.
  objekt:
    - { typ: ruta, x: 0, y: 0, langd: 40, bredd: 30, stil: heldragen }
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
      - { x: 20, y: 4, lag: a }
      - { x: 20, y: 26, lag: b }
      - { x: 8, y: 15, lag: a }
      - { x: 34, y: 9, lag: b }
```

**Parallella ytor.** När övningen körs i flera likadana uppställningar bredvid varandra ritar du en av dem och skriver hur många spelare den tar:

```yaml
  skalning:
    strategi: parallella-ytor
    per_yta: 4
```

De två sista exemplen är skisserna ur två övningar i omgång 5. Formatet är detsamma i alla spelformer. Målen i dem är småmål; en övning med fullstora mål väljer `storlek: 3mot3` eller `storlek: 11mot11`.

**3 mot 3: två mot två till småmål, 15 × 10 meter.** Ur `tva-mot-tva-till-tre-mot-tre-med-smamal.yaml`. Två mot två i basskissen, utan målvakt. Fler spelare går in i lagen på de tre platserna, upp till tre mot tre och en spelare till.

```yaml
# Spelform: 3mot3
planskiss:
  version: 1
  omrade:
    langd: 15
    bredd: 10
  beskrivning: >-
    Yta 15 x 10 meter med ett litet mål i varje ände, utan målvakt. Två mot två. A1 driver förbi B1,
    som pressar, och skjuter. Fler spelare går in i lagen upp till tre mot tre. Vid udda antal blir
    en spelare joker, men bilden visar då ett lag med en spelare mer. Lag A anfaller åt höger.
  objekt:
    - { typ: ruta, x: 0, y: 0, langd: 15, bredd: 10, stil: streckad }
    - { id: mal-a, typ: mal, x: 0, y: 5, storlek: smamal, riktning: hoger }
    - { id: mal-b, typ: mal, x: 15, y: 5, storlek: smamal, riktning: vanster }
    - { id: a1, typ: spelare, x: 3, y: 3, lag: a, etikett: A1 }
    - { id: a2, typ: spelare, x: 3, y: 7, lag: a, etikett: A2 }
    - { id: b1, typ: spelare, x: 10, y: 4.5, lag: b, etikett: B1 }
    - { id: b2, typ: spelare, x: 12, y: 7, lag: b, etikett: B2 }
    - { typ: boll, x: 3.3, y: 3 }
  rorelser:
    - typ: dribbling
      fran: { objekt: a1 }
      till: { x: 11, y: 3 }
      via: [{ x: 7, y: 0.5 }]
      ordning: 1
    - { typ: lopning, fran: { objekt: b1 }, till: { x: 7, y: 3.5 }, ordning: 1, etikett: Pressar }
    - { typ: skott, fran: { x: 11, y: 3 }, till: { objekt: mal-b }, ordning: 2 }
  skalning:
    strategi: platser
    platser:
      - { x: 7, y: 8, lag: a }
      - { x: 9, y: 6, lag: b }
      - { x: 5, y: 5, lag: a }
```

**11 mot 11: smålagsspel till minimål, 36 × 20 meter.** Ur `smalagsspel-till-mal-13-19.yaml`, som också används i 7 mot 7 och 9 mot 9. Två mot två i basskissen, utan målvakt och utan mittlinje. Fler spelare fyller på lagen på de fyra platserna, upp till fyra mot fyra.

```yaml
# Spelform: 11mot11
planskiss:
  version: 1
  omrade:
    langd: 36
    bredd: 20
  beskrivning: >-
    Yta 36 x 20 meter med ett minimål i varje kortsida, utan målvakt. Två mot två i grundläget, upp
    till fyra mot fyra. Lag A anfaller åt höger.
  objekt:
    - { typ: ruta, x: 0, y: 0, langd: 36, bredd: 20, stil: heldragen }
    - { id: mal-a, typ: mal, x: 0, y: 10, storlek: smamal, riktning: hoger }
    - { id: mal-b, typ: mal, x: 36, y: 10, storlek: smamal, riktning: vanster }
    - { typ: kon, x: 0, y: 0 }
    - { typ: kon, x: 36, y: 0 }
    - { typ: kon, x: 36, y: 20 }
    - { typ: kon, x: 0, y: 20 }
    - { id: a1, typ: spelare, x: 10, y: 6, lag: a }
    - { id: a2, typ: spelare, x: 10, y: 14, lag: a }
    - { id: b1, typ: spelare, x: 26, y: 6, lag: b }
    - { id: b2, typ: spelare, x: 26, y: 14, lag: b }
    - { typ: boll, x: 10.9, y: 6 }
  rorelser:
    - { typ: passning, fran: { objekt: a1 }, till: { objekt: a2 }, ordning: 1 }
    - { typ: dribbling, fran: { objekt: a2 }, till: { x: 26, y: 11 }, ordning: 2 }
    - { typ: skott, fran: { x: 26, y: 11 }, till: { objekt: mal-b }, ordning: 3 }
  skalning:
    strategi: platser
    platser:
      - { x: 14, y: 3, lag: a }
      - { x: 22, y: 3, lag: b }
      - { x: 14, y: 17, lag: a }
      - { x: 22, y: 17, lag: b }
```

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
  Fem spelare står vid en kvadrat: två i det första hörnet och en i vart
  och ett av de tre andra. Spelaren med boll passar till nästa hörn och
  följer efter sin egen passning, så att det alltid står någon kvar i
  hörnet som passar.
organisation: |
  En kvadrat per grupp om fem till nio spelare. En boll per grupp. Byt riktning efter halva tiden.
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
  min: 5
  max: 9
grupptyp: fri
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
  udda_antal: Spelar ingen roll. En extra spelare ställer sig bara i kö vid nästa hörn, precis som de andra.
  ledare: Med en ledare per grupp kan coachningen ske under gång.
kalla: Egen övning, inspirerad av allmänt känd passningsövning.
status: utkast
granskning: []
```
