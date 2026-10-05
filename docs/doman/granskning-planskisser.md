Status: granskning av planskisser, inkrement 2 (2026-09-29)

# Fotbollsexpertens granskning av planskisserna

Granskningen gäller 29 av de 42 godkända övningarna: 16 i 5 mot 5 och 13 i 7 mot 7, på grenen `innehall/planskisser`. Huvudsessionen har sparat den i repot. De sista 13 övningarna i 7 mot 7 granskades 2026-10-02 och står i avsnittet *Andra omgången* sist i dokumentet.

## Genomgående

- **`via` är kontrollpunkter i en Bézierkurva, inte punkter som pilen går genom.** En kvadratisk kurva, med en via-punkt, når bara halvvägs mot sin kontrollpunkt. Flera dribblingar går därför rakt genom försvararen, fast via-punkten ligger vid sidan av. Koordinaterna nedan är uträknade så att kurvan håller minst cirka 1,3 m till kon eller försvarare.
- **Försvarare som agerar samtidigt som anfallaren får samma `ordning` som anfallaren**, inte 2 eller 3.
- **En slalom ritas som flera dribblingspilar efter varandra.** Två via-punkter räcker inte för en hel bana.

## Svar på övningsförfattarnas frågor

1. **`en-mot-en-med-joker-till-mal`, 3 mot 2 plus joker vid sex spelare:** godtagbart som nödlösningen i ADR 0018 punkt 6. Beskrivningen ska säga vad som gäller vid sex spelare.
2. **`forsvara-zonen`, växling två och två:** ordningen håller. Vid sex spelare blir bilden fel, och det skrivs i beskrivningen.
3. **`knakontroll-uppvarmning`, sex pilar:** inte för rörigt. Men alla roterar samtidigt, så pilarna ska inte ha någon `ordning`.
4. **`dribbling-i-eget-tempo` och `hinderbana-med-boll`:** inte godtagbart. Dribblingen delas i flera pilar, och returlöpningen får inte gå genom banan.
5. **`malvaktsspel-i-smaspel`, två ledare:** rätt.

## Dom per övning

### 5 mot 5

**`avslut-efter-kort-passning`: åtgärda.** Ersätt rörelserna med:
- `{ typ: passning, fran: { objekt: sp-a1 }, till: { x: 7, y: 6 }, ordning: 1 }`
- `{ typ: lopning, fran: { objekt: sp-b1 }, till: { x: 7, y: 6 }, ordning: 1 }`
- `{ typ: skott, fran: { x: 7, y: 6 }, till: { objekt: mal-1 }, ordning: 2 }`

**`behall-bollen-i-gruppen`: åtgärda.** Byt `{ typ: lopning, fran: { objekt: b1 }, till: { x: 7, y: 6 }, ordning: 1 }` mot `{ typ: lopning, fran: { objekt: b2 }, till: { x: 2.5, y: 4.5 }, ordning: 1 }`.

**`dribbling-genom-portar`: åtgärda.**
- Konerna: `(7, 1.5)` och `(7, 3.5)`, `(11, 5)` och `(11, 7)`, `(7, 8.5)` och `(7, 10.5)`.
- Rörelserna:
  - `{ typ: dribbling, fran: { objekt: a1 }, till: { x: 10, y: 2.5 }, via: [{ x: 7, y: 2.5 }], ordning: 1 }`
  - `{ typ: lopning, fran: { objekt: b1 }, till: { x: 11.5, y: 5.5 }, ordning: 1 }`
  - `{ typ: skott, fran: { x: 10, y: 2.5 }, till: { objekt: mal-b }, ordning: 2 }`

**`driva-forbi-i-par`: åtgärda.** Dribblingens `via` ändras till `[{ x: 3, y: 6.5 }]`.

**`en-mot-en-med-joker-till-mal`: åtgärda.**
- `beskrivning`: `Yta 18 x 12 meter med ett litet mål i varje ände. Två lag om två och en joker som alltid spelar med laget som har bollen. Extra poäng för mål efter en dribbling förbi en motståndare. Vid sex spelare är den sjätte en andra joker, vid sju blir det tre mot tre plus joker.`
- Ersätt skottet (ordning 3) med:
  - `{ typ: dribbling, fran: { objekt: a2 }, till: { x: 16, y: 8.8 }, via: [{ x: 11, y: 12 }], ordning: 3 }`
  - `{ typ: skott, fran: { x: 16, y: 8.8 }, till: { objekt: mal-b }, ordning: 4 }`

**`forsvara-tillsammans`: håller.**

**`fyra-horn-med-boll`: åtgärda.** Ersätt rörelserna med nedanstående. p4 får ingen pil.
- `{ typ: dribbling, fran: { objekt: p1 }, till: { x: 12.5, y: 15.5 }, ordning: 1 }`
- `{ typ: dribbling, fran: { objekt: p5 }, till: { x: 14, y: 17 }, ordning: 1 }`
- `{ typ: dribbling, fran: { objekt: p6 }, till: { x: 16.5, y: 16.5 }, ordning: 1 }`

**`kapplopning-med-boll`: åtgärda.**
- sp1: `till: { x: 0.6, y: 2 }` och `via: [{ x: 21, y: 0 }, { x: 21, y: 3 }]`.
- sp2: `till: { x: 0.6, y: 4 }` och `via: [{ x: 21, y: 2 }, { x: 21, y: 5 }]`.

**`litet-spel-till-smamal`: åtgärda.**
- Dribblingen: `till: { x: 13, y: 2.5 }` och `via: [{ x: 9, y: 1 }]`.
- Skottet: `fran: { x: 13, y: 2.5 }`.

**`malvaktstraning-grunder`: håller.**

**`matchspel-5mot5-med-malvakt`: åtgärda.** Ersätt rörelserna med:
- `{ typ: passning, fran: { objekt: mv-a }, till: { objekt: a1 }, ordning: 1 }`
- `{ typ: lopning, fran: { objekt: a2 }, till: { x: 14, y: 14 }, ordning: 2, etikett: Visar sig spelbar }`
- `{ typ: passning, fran: { objekt: a1 }, till: { x: 14, y: 14 }, ordning: 3 }`

**`matchspel-med-snabb-omstallning`: åtgärda.**
- Bollen till `(17.3, 9)`.
- Rörelserna:
  - `{ typ: dribbling, fran: { objekt: b2 }, till: { x: 15, y: 9 }, ordning: 1 }`
  - `{ typ: lopning, fran: { objekt: a2 }, till: { x: 14, y: 9 }, ordning: 1, etikett: Vinner bollen }`
  - `{ typ: lopning, fran: { objekt: a1 }, till: { x: 23, y: 6 }, via: [{ x: 15, y: 7 }], ordning: 2, etikett: Söker djup }`
  - `{ typ: passning, fran: { x: 14, y: 9 }, till: { x: 23, y: 6 }, ordning: 3 }`
  - `{ typ: skott, fran: { x: 23, y: 6 }, till: { objekt: mal-b }, ordning: 4 }`
- `beskrivning`: `Yta 28 x 18 meter med mål och målvakt i varje lag, tre mot tre ute. A2 vinner bollen från B2 och lag A anfaller direkt: A1 söker djup och får bollen innan lag B hinner organisera sig.`

**`rorelsebana-skadeforebyggande`: åtgärda.** De fyra platserna, i den här ordningen:
- `{ x: 4.5, y: 13, lag: a }`
- `{ x: 7.5, y: 13, lag: a }`
- `{ x: 1.5, y: 13, lag: a }`
- `{ x: 10.5, y: 13, lag: a }`

**`snabbt-avslut-i-smaspel`: åtgärda.** Ersätt rörelserna med:
- `{ typ: lopning, fran: { objekt: a2 }, till: { x: 13, y: 10 }, ordning: 1 }`
- `{ typ: passning, fran: { objekt: a1 }, till: { x: 13, y: 10 }, ordning: 2 }`
- `{ typ: lopning, fran: { objekt: b2 }, till: { x: 13, y: 8.5 }, ordning: 2 }`
- `{ typ: skott, fran: { x: 13, y: 10 }, till: { objekt: mal-b }, ordning: 3 }`

**`spela-ut-med-malvakten`: håller.**

**`triangelpass-med-rorelse`: åtgärda.**
- Konerna: `(4, 0.5)`, `(0, 7.4)` och `(8, 7.4)`.
- `p1` till `(4, 1.5)`, `p2` till `(1, 6.8)` och `p3` till `(7, 6.8)`.
- Bollen till `(4.3, 1.5)`.
- Kön: `avstand: 2.5`.

### 7 mot 7

**`avslut-efter-inspel`: åtgärda.**
- `sp-av` till `(6, 6)`, så att skottavståndet blir minst 10 m mot en målvakt utan handskar.
- Ge MV `id: mv`.
- `sp-p` till `(7, 11)` och bollen till `(7.3, 11)`.
- `sp-k1` till `(16, 13.5)` och `sp-k2` till `(14.5, 13.5)`. Kön får `riktning: 180`.
- Rotationspilen: `{ typ: lopning, fran: { objekt: sp-av }, till: { objekt: mv }, ordning: 3, etikett: Roterar en position }`.
- I `beskrivning`, byt "Kön (K) står vid sidan, bortanför skottlinjen" mot "Kön (K) står utanför ytan vid sidan av målet, bortom skottlinjen".

**`bollvaktslek`: håller.**

**`bygg-upp-fran-malvakten`: åtgärda.**
- Kön vid sp-mv får `avstand: 4`.
- Den sista rörelsen (C, "Över linjen") blir `typ: dribbling`.

**`dribbling-genom-mittzonen`: åtgärda.**
- B1:s löpning: `ordning: 1`.
- Dribblingen: `till: { x: 15, y: 2.5 }`, `via: [{ x: 10, y: 1.5 }]` och `ordning: 1`.
- Skottet: `fran: { x: 15, y: 2.5 }` och `ordning: 2`.

**`dribbling-i-eget-tempo`: åtgärda.**
- Slalomkonerna: `(8, 7.5)`, `(11, 7.5)`, `(14, 7.5)` och `(17, 7.5)`.
- Rörelserna:
  - `{ typ: dribbling, fran: { objekt: sp-1 }, till: { x: 12.5, y: 7.5 }, via: [{ x: 8.5, y: 1 }, { x: 10.5, y: 14 }], ordning: 1 }`
  - `{ typ: dribbling, fran: { x: 12.5, y: 7.5 }, till: { objekt: kon-mal }, via: [{ x: 14.5, y: 1 }, { x: 16.5, y: 14 }] }`
- Returlöpningen: `via: [{ x: 17, y: 14 }, { x: 5, y: 14 }]`.
- Förslag, som inte krävs: flytta `kon-start` till `x: 5`.

**`dribbling-mot-tidspress`: åtgärda.**
- Löpningen: `till: { x: 4.5, y: 5.5 }` och `ordning: 1`.
- Dribblingen: `via: [{ x: 6, y: 1.5 }, { x: 10, y: 2.5 }]`.

**`en-mot-en-till-smamal`: åtgärda.**
- Löpningen: `till: { x: 6.5, y: 5 }` och `ordning: 1`. Etiketten står kvar.
- Dribblingen: `till: { x: 9.5, y: 2.5 }` och `via: [{ x: 7, y: 1.5 }]`.
- Skottet: `fran: { x: 9.5, y: 2.5 }`.
- Ta bort `{ typ: boll, x: 7, y: 8.5 }` och skriv "En extra boll ligger vid sidan av ytan" i beskrivningen.

**`en-mot-en-till-tva-mal`: åtgärda.**
- B1: `{ typ: lopning, fran: { objekt: sp-b1 }, till: { x: 12, y: 6.5 }, ordning: 1 }`, utan etikett.
- Dribblingen: `till: { x: 17, y: 3 }`, `via: [{ x: 11, y: 1.5 }]` och `ordning: 1`.
- Skottet: `fran: { x: 17, y: 3 }` och `ordning: 2`.

**`forsvara-zonen`: åtgärda.**
- Ersätt rörelserna med:
  - `{ typ: dribbling, fran: { objekt: sp-p1 }, till: { x: 7.5, y: 7.5 }, ordning: 1 }`
  - `{ typ: lopning, fran: { objekt: sp-p2 }, till: { x: 9, y: 13 }, ordning: 1 }`
  - `{ typ: lopning, fran: { objekt: sp-f1 }, till: { x: 9, y: 7.5 }, ordning: 2, etikett: Pressar bollhållaren }`
  - `{ typ: lopning, fran: { objekt: sp-f2 }, till: { x: 11.5, y: 8.5 }, ordning: 2, etikett: Täcker bakom }`
  - `{ typ: lopning, fran: { objekt: sp-f3 }, till: { x: 9.5, y: 11 }, ordning: 2, etikett: Stänger passningen }`
- Lägg sist i `beskrivning`: `Vid udda antal går en trio igenom i stället för ett par.`

**`hinderbana-med-boll`: åtgärda.**
- Slalomkonerna: `(6, 7.5)`, `(8, 7.5)`, `(10, 7.5)` och `(12, 7.5)`.
- Hindren: `ruta` med `langd: 0.5`, `bredd: 1.5` och `y: 6.75`, vid `x` 13.25, 14.75, 16.25 och 17.75. Bara den första får `etikett: Hinder`.
- Rörelserna:
  - `{ typ: dribbling, fran: { objekt: sp-1 }, till: { x: 9, y: 7.5 }, via: [{ x: 6, y: 1 }, { x: 8, y: 14 }], ordning: 1 }`
  - `{ typ: dribbling, fran: { x: 9, y: 7.5 }, till: { x: 13, y: 7.5 }, via: [{ x: 10, y: 1 }, { x: 12, y: 14 }] }`
  - `{ typ: dribbling, fran: { x: 13, y: 7.5 }, till: { x: 19, y: 7.5 } }`
  - `{ typ: lopning, fran: { x: 19, y: 7.5 }, till: { objekt: sp-4 }, via: [{ x: 17, y: 14 }, { x: 5, y: 14 }], ordning: 2, etikett: Joggar tillbaka till kön }`

**`jonglera-och-boll-i-rorelse`: håller.**

**`knakontroll-uppvarmning`: åtgärda.**
- Ta bort `ordning` från alla sex löpningar.
- Den första löpningens etikett blir `Alla roterar medurs`.
- Lägg till `{ typ: ledare, x: 6, y: 5 }`.
- `beskrivning`: `Yta 12 x 10 meter med sex stationer i en cirkel, en eller två spelare vid varje. Alla gör övningen vid sin station samtidigt och joggar medurs till nästa på ledarens signal. Ledaren står i mitten och rättar knäläget.`

**`malvaktsspel-i-smaspel`: åtgärda.**
- Spelaren i lag A på `(8, 15)` flyttas till `(28, 15)`.
- Spelaren i lag B på `(30, 15)` flyttas till `(34, 15)`.

## Namn

Ingen etikett och ingen beskrivning innehåller namn.

## Kvarstår i övningarnas text, utanför skisserna

- `knakontroll-uppvarmning` säger både "rotation på ledarens signal" och "roterar i egen takt".
- `behall-bollen-i-gruppen` säger inte vad som gäller vid sex spelare.
- Rotationsordningen i `avslut-efter-inspel` står inte uttryckligen i texten.

## Beslut som behövs

1. **Par-övningar vid udda antal:** `en-mot-en-till-smamal`, `dribbling-mot-tidspress`, `malvaktstraning-grunder`, `kapplopning-med-boll` och `driva-forbi-i-par`. Rekommendation: en kö med en etikett som återger `udda_antal`. Planskissutvecklaren bekräftar först att ritmotorn lägger till spelare över `spelare.max` när generatorn har skapat en trio.
2. **Fler böjpunkter i banor:** förs in i backloggen. Tills vidare används flera dribblingspilar.

## Andra omgången: de sista 13 i 7 mot 7 (2026-10-02)

Samma regler som ovan: `via` räknas som kontrollpunkt i en Bézierkurva och kurvan ska hålla minst cirka 1,3 m till kon eller försvarare, försvarare som agerar samtidigt får samma `ordning`, köer står utanför ytan och bortom skottlinjen, och köns etikett ska återge övningens egen lösning i `anpassning.udda_antal` (ADR 0018 punkt 4).

### Genomgående i den här omgången

- **Köer hamnade inne i ytan.** I sju av de tretton hamnar den första köspelaren inne i ytan, 1,5 m från en spelare som är med i spelet. En kö kan bara gå 5 m från sin startspelare (ADR 0012 avsnitt 4) och måste utgå från en spelare (ADR 0018 punkt 5). Därför flyttas kön till en spelare nära kanten, och i ett par fall flyttas den spelaren.
- **Den som rullar in bollar ärver laget från sin startspelare.** I `tre-mot-en-till-mal`, `tva-mot-ett-till-mal` och `snabb-omstallning-tva-mot-en` står den extra spelaren nu vid sidan, bredvid en anfallare, och ritas därför i anfallarnas form. Etiketten säger rollen. Formatet kan inte ge en kö ett eget lag, och det valdes bort i ADR 0018.
- **Skissen ska visa syftet.** `overtal-i-forsvar` och `snabb-omstallning-tva-mot-en` visade ett anfall som slutade i mål, fast syftet är försvar respektive återpress. De får nya rörelser nedan.

### Svar på övningsförfattarens frågor

1. **`omstallning-med-jokrar`, tredje jokern som första plats: inte godtagbart.** Med den ordningen blir åtta spelare tre mot två med tre jokrar och tio spelare fyra mot tre med tre jokrar. Övningens egen text säger fyra mot fyra med två jokrar vid tio, och vid åtta finns inget skäl till ojämna lag. Tre mot två med tre jokrar ger dessutom sex mot två när det stora laget har bollen, och då vinner det lilla laget nästan aldrig bollen, så omställningen som är syftet uteblir. Ingen ordning av tillägg kan visa både jämna och udda antal rätt, eftersom jokern vid sju måste bli lagspelare vid åtta. Använd därför nödlösningen i ADR 0018 punkt 6: platserna fyller lagen A, B, A, B, och `beskrivning` säger hur den udda spelaren blir joker. Då stämmer bilden vid sex, åtta och tio, och texten förklarar sju och nio.
2. **`tva-touch-i-triangel`, tre hörn av en kvadrat: godtagbart.** Det är den enda formen där en fjärde kon gör triangeln till en kvadrat med åtta meters sidor, och det är så övningens lösning för udda antal är skriven ("tar en fjärde punkt med den extra konen"). Tre mot en i en rätvinklig triangel fungerar för 10–12 år, och diagonalen på 11,3 m är en rimlig passning med två touch. Två villkor: skissens `beskrivning` får inte säga "åtta meter mellan konerna", eftersom det inte stämmer för diagonalen, och jagarens löpning ska sluta minst 1,3 m från passningslinjen. Övningens egen text säger "en triangel med sidor på 8 meter", och det säger emot lösningen för udda antal. Det ligger utanför skissen och står under *Kvarstår* nedan.

### Dom per övning

**`matchspel-7mot7-brett`: håller.** Retreatlinjerna ligger rätt, 7 m från mittlinjen (x 18 och 32). Platserna fyller A, B, A, B upp till fjorton, och ingen tillagd spelare hamnar närmare än 3 m en annan.

**`omstallning-med-jokrar`: åtgärda.**
- Platserna, i den här ordningen:
  - `{ x: 6, y: 12.5, lag: a }`
  - `{ x: 29, y: 12.5, lag: b }`
  - `{ x: 13, y: 4, lag: a }`
  - `{ x: 22, y: 21, lag: b }`
- `beskrivning`: `Yta 35 x 25 meter med ett minimål i var ände. Två mot två med två jokrar som alltid spelar med laget som har bollen. Fler spelare går in i lagen, upp till fyra mot fyra. Vid udda antal blir den udda spelaren en tredje joker, men bilden visar då ett lag med en spelare mer.`

**`overtal-i-forsvar`: åtgärda.** Skissen visade en anfallare som dribblar förbi pressen och gör mål, och dribblingen gick 1 m från försvararen. Övningens syfte är att försvara tillsammans, så skissen ska visa press och täckning.
- `a1` till `(4, 5)`.
- Kön: `{ vid: a1, riktning: 180, avstand: 5, etikett: Rullar in bollar }`. Spelaren hamnar bakom anfallarnas kortlinje, i stället för inne i spelet.
- Ersätt rörelserna med:
  - `{ typ: lopning, fran: { objekt: b1 }, till: { x: 12, y: 8 }, ordning: 1, etikett: Pressar }`
  - `{ typ: lopning, fran: { objekt: b2 }, till: { x: 15, y: 9.5 }, ordning: 1, etikett: Täcker bakom }`
  - `{ typ: passning, fran: { objekt: a3 }, till: { objekt: a2 }, ordning: 2 }`
- `beskrivning`: `Yta 25 x 18 meter med två minimål på högra kortlinjen, tio meter mellan sig. Tre anfallare möter två försvarare. Den ena försvararen pressar bollhållaren och den andra täcker bakom, så att anfallaren måste spela bakåt. Lag A anfaller åt höger.`

**`passningsruta-i-rorelse`: åtgärda.**
- Kön: `avstand: 3.5`, så att den vilande spelaren står utanför rutan. Etiketten "Vilande, byter in" får stå kvar, eftersom den här övningens egen lösning är att en spelare vilar och byter in.
- p2:s löpning: `ordning: 2`. Den sker samtidigt som p1 rör sig efter sin passning.

**`reaktionskull-med-boll`: åtgärda.** Upp till arton spelare med boll bromsar i samma hörn. Hörnzonen på 3 × 3 m är för liten, och ledaren ser bara ett av fyra hörn.
- Hörnzonen: `langd: 4` och `bredd: 4`.
- Lägg till tre zoner till, utan etikett: `{ typ: zon, x: 21, y: 0, langd: 4, bredd: 4, monster: prickar }`, `{ typ: zon, x: 21, y: 16, langd: 4, bredd: 4, monster: prickar }` och `{ typ: zon, x: 0, y: 16, langd: 4, bredd: 4, monster: prickar }`.

Ingen spelare eller plats hamnar inne i en zon med de måtten.

**`slalomdribbling-mot-forsvarare`: åtgärda.** Dribblingen håller cirka 2 m till försvararen. Kön stod 1,5 m från försvararen, mitt i duellytan.
- Kön: `{ vid: a1, riktning: 135, avstand: 5, etikett: Roterar in }`. Den tredje spelaren hamnar utanför ytan, bakom startlinjen och vid sidan av konmålet.

**`smaspel-fasta-situationer`: åtgärda.** Skissen visade en hörna utan någon som slog den, och passningen gick 33 m längs marken till en spelare vid mittlinjen. Alla stod som i öppet spel.
- Objekten (id behålls):
  - `a1` till `(51, -1)`, alltså den som slår hörnan.
  - `a2` till `(40, 12)`.
  - `a3` till `(44, 4)`.
  - `b1` till `(46, 7)`.
  - `b2` till `(44, 12)`.
  - `b3` till `(45, 19)`.
  - Bollen står kvar på `(50, 0)`.
- Rörelsen står kvar: passningen från `(50, 0)` till `a3`, `ordning: 1`, `etikett: Hörna`. Den blir nu cirka 7 m.
- Platserna, i den här ordningen:
  - `{ x: 30, y: 8, lag: a }`
  - `{ x: 41, y: 22, lag: b }`
  - `{ x: 36, y: 22, lag: a }`
  - `{ x: 28, y: 15, lag: b }`
  - `{ x: 24, y: 20, lag: a }`
  - `{ x: 47, y: 10, lag: b }`
- `beskrivning`: `Yta 50 x 30 meter med ett mål och en målvakt på varje kortsida. Tre mot tre ute plus målvakter. Skissen visar en hörna för lag A som slås kort längs marken till en medspelare. Lag A anfaller åt höger.`

Spelformsbladet i `spelformer.md` anger inget avstånd för motståndarna vid hörna i 7 mot 7. Försvararna står därför inte på ett visst avstånd, bara inte intill bollen (b1 drygt 8 m bort).

**`snabb-omstallning-tva-mot-en`: åtgärda.** Syftet är att pressa direkt efter bollförlust, men skissen visade bara ett anfall som slutade i mål. Kön stod 1,5 m från försvararen inne i ytan.
- Ersätt rörelserna med:
  - `{ typ: dribbling, fran: { objekt: a1 }, till: { x: 9, y: 4 }, ordning: 1 }`
  - `{ typ: lopning, fran: { objekt: a2 }, till: { x: 10, y: 11 }, ordning: 1 }`
  - `{ typ: lopning, fran: { objekt: f1 }, till: { x: 10, y: 5 }, ordning: 1, etikett: Vinner bollen }`
  - `{ typ: dribbling, fran: { x: 10, y: 5 }, till: { x: 14, y: 2.5 }, ordning: 2 }`
  - `{ typ: lopning, fran: { x: 9, y: 4 }, till: { x: 13, y: 2 }, ordning: 2, etikett: Pressar direkt }`
  - `{ typ: lopning, fran: { x: 10, y: 11 }, till: { x: 14.5, y: 5 }, ordning: 2 }`
- Kön: `{ vid: a2, riktning: 90, avstand: 5, etikett: "Rullar in, byter in" }`.
- `beskrivning`: `Yta 20 x 15 meter med ett litet mål utan målvakt på högra kortsidan. Två anfallare möter en försvarare. Försvararen vinner bollen och båda anfallarna pressar tillbaka direkt. Lag A anfaller åt höger.`

Inga pilar korsar varandra.

**`spela-ut-bakifran`: åtgärda.**
- b1:s löpning: `till: { x: 15.5, y: 8.5 }`. Den slutade 0,7 m från passningslinjen a3–a1, så passningen gick rakt genom den som pressade.
- `b2` till `(18, 16)`.
- Kön: `{ vid: b2, riktning: 90, avstand: 5, etikett: "Vilande, byter in" }`. Den vilande spelaren hamnar utanför ytan och i lag B, som hen byter in i. Förslag, som inte krävs: etiketten `Vilar, byter in i press`, som säger mer om övningens egen lösning.

**`tre-mot-en-till-mal`: åtgärda.** Dribblingen håller 2,8 m till försvararen. Men försvararen gjorde ingenting, och då visar skissen inte varför passningen går till den som är fri.
- Lägg till `{ typ: lopning, fran: { objekt: f1 }, till: { x: 9.5, y: 6 }, ordning: 1, etikett: Pressar }`.
- Kön: `{ vid: a2, riktning: 90, avstand: 4, etikett: "Rullar in, byter in" }`.

**`tre-passningar-fore-skott`: åtgärda.** Skottet gick från egen planhalva, 22 m mot ett minimål på 1 m. Det är motsatsen till ett bra avslutsläge, som syftet talar om.
- Ersätt skottet med:
  - `{ typ: dribbling, fran: { objekt: a1 }, till: { x: 20, y: 8 }, ordning: 4 }`
  - `{ typ: skott, fran: { x: 20, y: 8 }, till: { objekt: mal-b }, ordning: 5 }`
- Dribblingen håller cirka 3 m till b3 och b1, och skottet blir 10 m med fri linje.

**`tva-mot-ett-till-mal`: åtgärda.** Dribblingen håller cirka 1,9 m till försvararen.
- Kön: `{ vid: a2, riktning: 90, avstand: 4, etikett: "Rullar in, byter in" }`. Den extra spelaren står vid sidan, där reservbollen ligger enligt övningens text.

**`tva-touch-i-triangel`: åtgärda.**
- Spelarna flyttas av konerna, så att konerna syns: `p1` till `(1.7, 1.7)`, `p2` till `(8.3, 1.7)` och `p3` till `(8.3, 8.3)`. Konerna står kvar.
- Platsen: `{ x: 1.7, y: 8.3, lag: a }`.
- Bollen till `(2.5, 1.7)`.
- Jagarens löpning: `till: { x: 5.5, y: 3.2 }`.
- `beskrivning`: `Yta 10 x 10 meter med en kon i vart och ett av triangelns tre hörn. Två av sidorna är åtta meter. Tre spelare passar med högst två touchar medan en fjärde jagar i mitten och pressar. Vid fem spelare tar den femte det fjärde hörnet, så att formen blir en kvadrat.`

### Namn

Ingen etikett och ingen beskrivning i de tretton innehåller namn.

### Kontroll av rättelserna i de första 29

Jag läste skissdatan i alla 24 filer som skulle åtgärdas och jämförde den med punkterna ovan. 23 är införda exakt. I `en-mot-en-till-smamal` ligger det fortfarande en extra boll, på `(5, 8.5)`. Den skulle tas bort. Jag godtar avvikelsen och behöver ingen ändring, eftersom bollen ligger strax utanför ytan och stämmer med den nya beskrivningen ("En extra boll ligger vid sidan av ytan"). Det stämmer alltså inte att alla 24 gick att göra exakt.

### Kvarstår i övningarnas text, utanför skisserna

- `tva-touch-i-triangel` säger "en triangel med sidor på 8 meter" men också att en fjärde kon gör formen till en kvadrat med åtta meters sidor. Båda kan inte stämma. Förslag till nästa revidering: "en triangel där två sidor är 8 meter, som tre hörn av en kvadrat".
- `slalomdribbling-mot-forsvarare` har grupptypen `par`. Den tredje spelaren syns bara om ritmotorn lägger till spelare över `spelare.max`. Det är samma fråga som beslut 1 i första omgången.
- `overtal-i-forsvar` och `spela-ut-bakifran` har `ledarbehov: 1` men ingen ledare i skissen. Det är inget fel, men skissen blir tydligare med en ledare vid sidan.

### Beslut som behövs

1. **Texten i `tva-touch-i-triangel`:** ska övningens beskrivning ändras till "två sidor är 8 meter", så att den stämmer med lösningen för udda antal och med skissen? Det ändrar en godkänd övning och går därför genom redaktören. Rekommendation: ja, vid nästa revidering.
2. **Beslut 1 från första omgången, par vid udda antal,** gäller nu också `slalomdribbling-mot-forsvarare`.

## Parövningar vid udda antal (2026-10-05)

Granskningen gäller de sex parövningarna på grenen `omgang/par-udda-antal`: den omskrivna texten i `anpassning.udda_antal` och kön i `planskiss.skalning`. Jag har prövat fyra saker per övning: att texten stämmer med organisationen och med R-058 (en trio vid udda antal), att kön står där texten säger att den tredje står, att kön står utanför ytan, minst cirka 1,3 m från spelare, koner och pilar och inte i en skottlinje, och att etiketten återger lösningen.

Köns läge är räknat som ritmotorn räknar det (`src/planskiss/skalning.ts`): den första köspelaren står `avstand` meter från startspelaren i `riktning`. Symbolens diameter är 1,2 m på alla sex ytorna, så en köspelare står helt utanför ytan först när mitten ligger minst 0,6 m utanför linjen. Pilarna med `via` är räknade som Bézierkurvor.

### Genomgående

- **Två av mina egna mallar hade en lucka i rotationen.** "Byter in för den som spelat två i rad" säger inte vem som går ut efter första duellen eller omgången, eftersom båda då har spelat en. Felet låg i min tabell, inte hos övningsförfattaren. Texterna nedan ger en rotation där alla spelar två gånger och vilar en, och där första bytet är bestämt.
- **Riktningen ska vara fast i trion.** Kön kan bara stå på ett ställe. När den tredje väntar vid anfallarens start måste anfallet alltid gå åt samma håll, och den som går ut ska gå till samma ställe.
- **Ingen kö står i en skottlinje.** I de övningar där anfallet har ett eget startmål eller en egen port står kön bakom eller bredvid det, och i trion anfalls det målet aldrig.

### Dom per övning

**`en-mot-en-till-smamal`: åtgärda (bara texten).**
- Kön håller. Den tredje står på `(4, 8.9)`, 0,9 m utanför nedre sidlinjen och intill reservbollen på `(5, 8.5)`, som texten säger. Avståndet till närmaste pil, löpningens slut på `(6.5, 5)`, är 4,6 m. Dribblingen och skottet går i övre halvan av ytan, och inget skott går mot kön. Etiketten "Väntar med ny boll" återger lösningen.
- Texten: efter första duellen har ingen spelat två dueller i rad, och efter andra har båda gjort det. Ersätt `anpassning.udda_antal` med:
  `Vid udda antal blir en grupp en trio. Den tredje väntar vid sidan av ytan med reservbollen. Efter varje duell går hen in med bollen och byter plats med den som har spelat längst. Efter första duellen går den som startade med bollen ut. Då spelar alla två dueller och vilar en.`

**`dribbling-mot-tidspress`: håller.**
- Rotationen är entydig: anfallare blir försvarare, försvararen går till starten, den som väntade anfaller. Alla har varje roll en gång per varv, och riktningen är fast mot porten. Att halvminutsvilan kan strykas stämmer med min bedömning 2026-09-21: i trion vilar var och en ett försök av tre.
- Kön står på `(-1, 5)`, bakom anfallaren vid starten och 1 m utanför kortlinjen. Hörnkonerna är 5,1 m bort, och dribblingen och löpningen går åt andra hållet. Porten står i bortre änden, så kön står inte i någon skottlinje. Etiketten "Nästa anfallare väntar" återger lösningen.

**`malvaktstraning-grunder`: åtgärda.**
- Kön som form är rätt. README säger `platser` när den tredje får en plats i övningen, till exempel som kastare. Men här kastar de två varannan gång från samma plats, och den som inte kastar väntar. Det är en roll utanför paret, alltså en kö, och etiketten "Två kastare turas om" återger lösningen.
- Kön står på `(5.5, 5.5)`, bara 0,5 m utanför den nedre linjen, så symbolen ligger på linjen. Ändra kön till `{ vid: kastare, riktning: 90, avstand: 3.5, etikett: Två kastare turas om }`. Då står den tredje på `(5.5, 6)`, helt utanför ytan och 3,5 m från kastlinjen. Platsen ryms inom marginalen.
- Texten säger inte var den andra kastaren står, och inte vem som blir målvakt. Ersätt `anpassning.udda_antal` med:
  `Vid udda antal blir en grupp en trio. En är målvakt och två kastar varannan gång från samma plats. Den som inte kastar står vid sidan. Byt målvakt efter fem bollar så att alla tre står i mål. Ingen behöver vila.`

**`kapplopning-med-boll`: åtgärda (bara texten).**
- Kön håller. Den tredje står på `(-1.7, 1.5)`, 1,7 m bakom startlinjen och bakom spelare 1. Spelare 2 är 2,8 m bort och slutet på spelare 1:s dribbling 2,3 m bort. Etiketten "Byter in nästa omgång" återger lösningen.
- Texten har samma lucka som `en-mot-en-till-smamal`: efter första omgången har ingen sprungit två i rad. En fast banväxling är enklast för 8–9-åringar. Spelare 1 springer i den vänstra banan sett i löpriktningen, och kön står bakom den. Ersätt `anpassning.udda_antal` med:
  `Vid udda antal blir en grupp en trio på samma bana. Två tävlar och den tredje väntar bakom startlinjen, bakom vänstra banan. Efter varje omgång går den som väntade in i vänstra banan, den som sprang där flyttar till högra banan och den som sprang i högra banan lämnar över sin boll och väntar. Då springer alla två omgångar och vilar en.`

**`driva-forbi-i-par`: håller.**
- Rotationen är entydig och riktningen fast: anfallet går alltid mot försvararens port. Den som går ut blir den som väntar vid anfallarens port.
- Kön står på `(-1.5, 3)`, bakom anfallarens port och 0,9 m utanför ytan. Portens koner är 1,8 m bort, och dribblingen böjer av åt höger direkt från anfallaren. I trion anfalls anfallarens port aldrig, så kön står inte i en skottlinje. Etiketten "Nästa anfallare väntar" återger lösningen.
- Förslag, som inte krävs: skriv "försvararen går ut och väntar vid anfallarens port" i stället för "försvararen går ut".

**`slalomdribbling-mot-forsvarare`: åtgärda (bara texten).**
- Kön håller. Den tredje står på `(-1.5, 8.5)`, utanför kortlinjen snett nedanför anfallarens konmål. Konerna på `(0, 7)` och `(0, 10)` är 2,1–2,2 m bort, och dribblingen går i övre halvan av ytan. I trion anfalls anfallarens konmål aldrig. Etiketten "Nästa anfallare väntar" återger lösningen.
- Texten: "försvararen går till andra konmålet" kan läsas som konmålet i bortre änden. Då skulle anfallet byta håll varannan gång och den som väntar stå på olika ställen, och då stämmer inte kön. Ersätt `anpassning.udda_antal` med:
  `Vid udda antal blir en grupp en trio. Anfallet går alltid åt samma håll. Den tredje väntar vid anfallarens konmål. Efter varje försök blir anfallaren försvarare, försvararen går till anfallarens konmål och väntar, och den som väntade får bollen och anfaller.`

### Sammanfattning

| Övning | Dom | Vad som ändras |
|---|---|---|
| `en-mot-en-till-smamal` | åtgärda | Texten |
| `dribbling-mot-tidspress` | håller | – |
| `malvaktstraning-grunder` | åtgärda | Texten och köns `avstand` till 3.5 |
| `kapplopning-med-boll` | åtgärda | Texten |
| `driva-forbi-i-par` | håller | – |
| `slalomdribbling-mot-forsvarare` | åtgärda | Texten |

Alla sex följer R-058: en trio vid udda antal och aldrig en grupp större än tre. Ingen etikett och ingen text innehåller namn. Alla etiketter är högst 24 tecken.
