Status: granskning av planskisser, inkrement 2 (2026-09-29)

# Fotbollsexpertens granskning av planskisserna

Granskningen gäller 29 av de 42 godkända övningarna: 16 i 5 mot 5 och 13 i 7 mot 7, på grenen `innehall/planskisser`. Huvudsessionen har sparat den i repot. De sista 13 övningarna i 7 mot 7 granskas senare och läggs till här.

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
