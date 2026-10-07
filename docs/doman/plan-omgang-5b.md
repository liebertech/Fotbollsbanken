Status: utkast

# Omgång 5B: fler spelformer på befintliga övningar

**Ägare:** fotbollsexpert · **Skriven:** 2026-10-07 · **Underlag:** `plan-omgang-5.md` (avsnitt 4, F1 och F2), `spelformer.md`, `passuppbyggnad.md` (golv, tak och tillägget 2026-10-07 om egen boll), `ytreferenser.md`, `content/ovningar/README.md`, ADR 0010, 0012, 0017 och 0019, `generatorregler.md` (R-004, R-014, R-015, R-024, R-092) och de 57 övningsfilerna med en enda spelform, lästa på grenen `omgang/5b` 2026-10-07.

## 0. Syfte

Användaren beslutade 2026-10-06 att genomföra omgång 5B. Dokumentet är ändringslistan: vilka av bankens övningar som får fler spelformer, och exakt vad som ändras i varje fil. Den är skriven så att övningsförfattaren kan föra in den utan att tolka. Inga övningar läggs till och ingen ålder ändras.

Utgångsläge: 17 övningar är märkta bara `5mot5` (alla 8–9 år), 27 bara `7mot7` (alla 10–12 år) och 13 bara `9mot9` (alla 13–14 år). De övriga 15 har redan flera spelformer och berörs inte.

## 1. Så tillämpar jag F1 och F2

### 1.1 Vilka spelformer som alls är möjliga (R-004, R-014)

Varje spelform i `spelformer` ska vara tillåten för minst en ålder i övningens åldersspann. Alla 57 övningar har exakt en fas som ålder, så:

| Ålder | Möjliga spelformer |
|---|---|
| 8–9 | `3mot3`, `5mot5`, `7mot7` |
| 10–12 | `5mot5`, `7mot7`, `9mot9` |
| 13–14 | `7mot7`, `9mot9`, `11mot11` |

Spelformerna skrivs alltid i ordningen `3mot3`, `5mot5`, `7mot7`, `9mot9`, `11mot11`.

### 1.2 F1, villkoren

- **(a)** Övning utan matchregler (uppvärmning, Öva och de flesta spelövningar): alla möjliga spelformer i 1.1.
- **(b)** Övning som bygger på en spelforms egna regler: bara spelformer som har regeln. Retreatlinje finns i `5mot5` och `7mot7`. Offside och inspark finns i `9mot9` och `11mot11`. `3mot3` har ingen målvakt, så **ingen övning med målvakt får `3mot3`**.
- **(c)** Spel i `del-spel`: bara spelformer som är lika stora som spelet eller större. Ett spel med målvakt i 4 mot 4-format (3 utespelare + målvakt) är mindre än 5 mot 5 och får `5mot5`. Ett spel utan målvakt i 2 mot 2–3 mot 3 får `3mot3`.

### 1.3 F2: ytan ändras inte i 5B

Golvet följer åldern (R-015), och ingen ålder ändras. Taket bedöms mot matchen i den spelform som föreslås för övningens ålder (R-013), alltså samma spelform som i dag. **Därför ändras varken golv- eller takbedömningen för någon övning, och ingen övning behöver en egen `yta` per spelform.** Alla `yta` står kvar som `alla`.

Det har en viktig följd: nästan varje övning skriver sitt mått i `beskrivning` eller `organisation`, och de fälten ändras inte i 5B. En `yta` per spelform skulle då säga emot övningens egen text. Där en spelform skulle kräva andra mått än övningen har, får övningen **inte** den spelformen, i stället för att måtten ändras. Det gäller bara `hornor-med-nickar` (avsnitt 3).

### 1.4 `ytreferens` ändras inte i 5B

Varje referens i de 57 filerna är av ett av två slag:

1. **Stora planens linjer** (straffområde, målområde, mittcirkel). De ser likadana ut för alla lag, oavsett spelform (`ytreferenser.md`, konvention 1).
2. **En namngiven spelforms plan**, till exempel *ungefär halva 7 mot 7-planen*. Spelformen är utskriven (konvention 3), och referensen jämför storlek, den pekar inte ut en plats (konvention 2). Den gäller därför också för ett lag i en annan spelform. Det är samma bedömning som redan är gjord för paket B (`ytreferenser.md`, tillägget efter tabell 6.1, om `omstallning-i-overlage-till-mal`).

Ingen av filerna använder *ert eget straffområde*, som är den enda referensen som bara gäller en spelform. **Alla `ytreferens` står kvar som `alla`, och de övningar som saknar referens fortsätter att sakna den** (kategorierna i `ytreferenser.md`, avsnitt 4, beror inte på spelformen).

*Rättelse av min egen plan:* `plan-omgang-5.md`, avsnitt 4, säger att en referens som *halva 7 mot 7-planen* inte stämmer för ett 5 mot 5-lag och då ska anges per spelform. Det var för strängt. Referensen stämmer så länge spelformen står utskriven, och det gör den i alla filer. Avsnitt 1.4 ersätter den meningen.

### 1.5 Planskissen ändras inte i 5B

- `omrade` i varje skiss är lika med övningens `yta.alla`. Eftersom `yta` inte ändras skalar ritmotorn ingenting om (ADR 0012, avsnitt 1), och alla koordinater står kvar.
- Mål med `storlek: smamal` ritas 1 m breda i alla spelformer (ADR 0019, punkt 1). Det är rätt: minimålen är utrustning i övningen.
- Mål med `storlek` som är en spelform ritas med målbredden för den spelform passet gäller (ADR 0019, punkt 1). Det är också rätt: laget tränar med sin egen spelforms mål, och materialfältet `mal` betyder just *mål i en spelforms storlek* (`passuppbyggnad.md`, *Materialtyper*). Ingen övning med ett sådant mål får `3mot3` om den har målvakt (1.2 b), så det minsta mål som ritas med målvakt är 3 m.

Därför står det *ingen ändring* i skisskolumnen för varje rad nedan, med skälet i korthet: **Y** = ytan är oförändrad, så ingen omskalning; **S** = bara småmål, som inte påverkas; **M** = mål i spelformens storlek, som följer spelformen enligt ADR 0019; **–** = övningen har ingen planskiss.

### 1.6 Vad som ändras i varje fil

Bara två saker:

1. Listan `spelformer` byts mot den nya listan i tabellerna.
2. En ny post läggs sist i `granskning`:

```yaml
  - datum: <dagens datum>
    av: ovningsforfattare
    roll: ovningsforfattare
    kommentar: >-
      Omgång 5B: spelformer ändrade från <gamla> till <nya> enligt
      docs/doman/plan-omgang-5b.md. Inga andra fält ändrade.
```

`status` står kvar som `godkand`. Ändringen godkänns när användaren mergar pull requesten (beslut 2026-10-06).

## 2. Ändringslista

Kolumnerna *yta*, *ytreferens* och *skiss* säger om fältet behöver en egen post per spelform. Svaret är nej för alla 57 övningar, av skälen i 1.3–1.5. Skälet för skissen står med bokstav enligt 1.5.

### 2.1 Övningar med bara `5mot5` (8–9 år)

Möjliga spelformer: `3mot3`, `5mot5`, `7mot7`. 13 av 17 får alla tre, 4 får `5mot5` och `7mot7`.

| Övning | Passdel | Nu | Ny lista | F1 | yta | ytreferens | skiss |
|---|---|---|---|---|---|---|---|
| `avslut-efter-kort-passning` | Öva | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a). Tomt mål, ingen målvakt | ingen ändring | ingen ändring | ingen ändring, M (1,5 m mål i 3 mot 3, 5 m i 7 mot 7) |
| `behall-bollen-i-gruppen` | Spelövning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | saknas, oförändrat (positionsspel) | ingen ändring, Y |
| `dribbling-genom-portar` | Spelövning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `driva-forbi-i-par` | Öva | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | saknas, oförändrat (för liten) | ingen ändring, Y (konportar) |
| `en-mot-en-med-joker-till-mal` | Spelövning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `en-mot-en-till-mal` | Spelövning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a). Minimål, ingen målvakt | ingen ändring | saknas, oförändrat (duell med startavstånd) | – |
| `forsvara-tillsammans` | Spelövning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `fyra-horn-med-boll` | Uppvärmning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `kapplopning-med-boll` | Uppvärmning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `litet-spel-till-smamal` | Spel | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (c). 2 mot 2 till 3 mot 3 utan målvakt, lika stort som 3 mot 3 | ingen ändring | ingen ändring | ingen ändring, S |
| `malvaktstraning-grunder` | Öva | `[5mot5]` | `[5mot5, 7mot7]` | (b). Målvaktsträning, och 3 mot 3 har ingen målvakt | ingen ändring | saknas, oförändrat (station) | ingen ändring, Y (konport) |
| `matchspel-5mot5-med-malvakt` | Spel | `[5mot5]` | `[5mot5, 7mot7]` | (b) och (c). Målvakt och retreatregel, som finns i 7 mot 7. Spelet är större än 3 mot 3 | ingen ändring | ingen ändring (*nästan en hel 5 mot 5-plan* är utskriven) | ingen ändring, M |
| `matchspel-med-snabb-omstallning` | Spel | `[5mot5]` | `[5mot5, 7mot7]` | (b) och (c). Målvakt, spelet större än 3 mot 3 | ingen ändring | ingen ändring | ingen ändring, M |
| `rorelsebana-skadeforebyggande` | Uppvärmning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | saknas, oförändrat (station) | ingen ändring, Y |
| `snabbt-avslut-i-smaspel` | Spelövning | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `spela-ut-med-malvakten` | Spelövning | `[5mot5]` | `[5mot5, 7mot7]` | (b). Målvakt och retreatregel, som finns i 5 mot 5 och 7 mot 7 | ingen ändring | ingen ändring | ingen ändring, M |
| `triangelpass-med-rorelse` | Öva | `[5mot5]` | `[3mot3, 5mot5, 7mot7]` | (a) | ingen ändring | saknas, oförändrat (ingen plandel med rätt form) | ingen ändring, Y |

*Att veta om målen i 7 mot 7.* I de tre övningarna med målvakt och mål i spelformens storlek ritas målet 5 m brett när passet gäller 7 mot 7, på en yta som är 18 m bred. Det är relativt sett ungefär dubbelt så brett som i en 7 mot 7-match. Det är vanligt i smålagsspel på träning och inget säkerhetsproblem, eftersom målvakten inte får fler eller hårdare skott av ett större mål. Ledaren kan lika gärna använda 5 mot 5-mål. Jag ändrar inte skissen, eftersom ADR 0019 just har beslutat att målet följer spelformen.

### 2.2 Övningar med bara `7mot7` (10–12 år)

Möjliga spelformer: `5mot5`, `7mot7`, `9mot9`. 24 av 27 får alla tre, 1 får `7mot7` och `9mot9`, och 2 ändras inte (avsnitt 3).

| Övning | Passdel | Nu | Ny lista | F1 | yta | ytreferens | skiss |
|---|---|---|---|---|---|---|---|
| `avslut-efter-inspel` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a). Målvakten är en utespelare och finns i alla tre spelformerna | ingen ändring | ingen ändring | ingen ändring, M (3 m i 5 mot 5, 6 m i 9 mot 9) |
| `bollvaktslek` | Uppvärmning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `bygg-upp-fran-malvakten` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a). Uppbyggnad utan motståndare. Att målvakten lägger ner bollen är 7 mot 7-regel men en riktig träningsprincip också i 5 mot 5 och 9 mot 9, se not | ingen ändring | ingen ändring | ingen ändring, M |
| `dribbling-genom-mittzonen` | Spelövning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `dribbling-i-eget-tempo` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `dribbling-mot-tidspress` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `en-mot-en-till-smamal` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | saknas, oförändrat (ingen plandel med rätt form) | ingen ändring, S |
| `en-mot-en-till-tva-mal` | Spelövning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `forsvara-zonen` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `hinderbana-med-boll` | Uppvärmning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `jonglera-och-boll-i-rorelse` | Uppvärmning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `knakontroll-uppvarmning` | Uppvärmning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | saknas, oförändrat (station) | ingen ändring, Y |
| `matchspel-7mot7-litet-format` | Spel | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (c). Tre mot tre plus målvakter är mindre än 5 mot 5 (fyra utespelare plus målvakt). (b) hindrar inte: övningen använder ingen retreatlinje, och regeln om att lägga ner bollen är en riktig träningsregel i alla tre, se not och beslut B1 | ingen ändring | ingen ändring | – |
| `omstallning-med-jokrar` | Spelövning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring (*halva 7 mot 7-planen*, se 1.4) | ingen ändring, S |
| `overtal-i-forsvar` | Spelövning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `passningsruta-i-rorelse` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | saknas, oförändrat (ingen plandel med rätt form) | ingen ändring, Y |
| `reaktionskull-med-boll` | Uppvärmning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `slalomdribbling-mot-forsvarare` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, Y |
| `smaspel-fasta-situationer` | Spel | `[7mot7]` | `[7mot7, 9mot9]` | (c). Fullt 7 mot 7 på 7 mot 7-plan är större än 5 mot 5 men mindre än 9 mot 9. (b) hindrar inte 9 mot 9: hörna, inkast och frispark finns där, och övningen använder varken retreatlinje eller offside | ingen ändring | ingen ändring (*hela 7 mot 7-planen*) | ingen ändring, M (6 m i 9 mot 9) |
| `snabb-omstallning-tva-mot-en` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `spela-ut-bakifran` | Spelövning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a). Spelet använder ingen retreatlinje, pressen är verklig. Se not om målvaktens utspel | ingen ändring | ingen ändring | ingen ändring, M |
| `tre-mot-en-till-mal` | Spelövning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `tre-passningar-fore-skott` | Spelövning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `tva-mot-ett-till-mal` | Spelövning | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | ingen ändring | ingen ändring, S |
| `tva-touch-i-triangel` | Öva | `[7mot7]` | `[5mot5, 7mot7, 9mot9]` | (a) | ingen ändring | saknas, oförändrat (fasta positioner) | ingen ändring, Y |
| `malvaktsspel-i-smaspel` | Spel | `[7mot7]` | **oförändrad** | se avsnitt 3 | | | |
| `matchspel-7mot7-brett` | Spel | `[7mot7]` | **oförändrad** | se avsnitt 3 | | | |

*Not om målvaktens utspel.* `bygg-upp-fran-malvakten`, `spela-ut-bakifran` och `matchspel-7mot7-litet-format` säger att målvakten lägger ner bollen och passar i stället för att sparka ut den. I 7 mot 7 är det en regel (`spelformer.md`). I 5 mot 5 och 9 mot 9 är det ingen regel, men det är en riktig och vanlig träningsregel för att få laget att spela ut kort, och den står redan i `spela-ut-med-malvakten` för 8–9 år. Övningen blir alltså inte fel i de spelformerna, den blir en övning med en träningsregel. Det är därför (a) och inte (b) som gäller.

*Not om längdmåttet.* Minsta längd 35 m gäller bara `fas-13-14` och `fas-15-19`. Övningarna ovan är för 10–12 år och påverkas inte av att de märks `9mot9`, eftersom fasen följer åldern (R-015).

### 2.3 Övningar med bara `9mot9` (13–14 år)

Möjliga spelformer: `7mot7`, `9mot9`, `11mot11`. 8 av 13 får alla tre, 4 får `9mot9` och `11mot11`, och 1 ändras inte (avsnitt 3). Ingen av de 13 har en planskiss, så skisskolumnen är – för alla.

| Övning | Passdel | Nu | Ny lista | F1 | yta | ytreferens | skiss |
|---|---|---|---|---|---|---|---|
| `dribbling-genom-portar-i-tempo` | Öva | `[9mot9]` | `[7mot7, 9mot9, 11mot11]` | (a) | ingen ändring | ingen ändring | – |
| `forsvara-i-overtal` | Öva | `[9mot9]` | `[7mot7, 9mot9, 11mot11]` | (a). Positionsspel utan mål och riktning. Undantag 1 (minst 12 × 12 m för 13–19 år) gäller oförändrat | ingen ändring | saknas, oförändrat (positionsspel) | – |
| `forsvara-med-offsidefalla` | Spelövning | `[9mot9]` | `[9mot9, 11mot11]` | (b). Bygger på offside, som saknas i 7 mot 7 | ingen ändring | ingen ändring | – |
| `langre-passningar-i-rorelse` | Uppvärmning | `[9mot9]` | `[7mot7, 9mot9, 11mot11]` | (a) | ingen ändring | ingen ändring (exakt jämförelse, fasta positioner tillåtna enligt `ytreferenser.md`, avsnitt 4) | – |
| `matchspel-9mot9-brett` | Spel | `[9mot9]` | `[9mot9, 11mot11]` | (b) och (c). Offside gäller, och spelet är fullt 9 mot 9, alltså större än 7 mot 7 men mindre än 11 mot 11 | ingen ändring | ingen ändring (*hela 9 mot 9-planen*) | – |
| `omstallningsspel-9mot9` | Spel | `[9mot9]` | `[7mot7, 9mot9, 11mot11]` | (c). Tre till fyra utespelare plus målvakt är mindre än 7 mot 7. Ingen offside i texten. Se not om mål | ingen ändring | ingen ändring | – |
| `overtal-till-mal-9mot9` | Spelövning | `[9mot9]` | `[7mot7, 9mot9, 11mot11]` | (a). Avslut mot målvakt, ingen försvarslinje att passera | ingen ändring | ingen ändring | – |
| `passningsrutor-med-langre-passningar` | Öva | `[9mot9]` | `[7mot7, 9mot9, 11mot11]` | (a) | ingen ändring | ingen ändring | – |
| `rorelse-och-bollkansla-i-fart` | Uppvärmning | `[9mot9]` | `[7mot7, 9mot9, 11mot11]` | (a) | ingen ändring | ingen ändring | – |
| `smaspel-med-fasta-situationer-9mot9` | Spel | `[9mot9]` | `[9mot9, 11mot11]` | (b) och (c). Bygger på insparken, som bara finns i 9 mot 9 och 11 mot 11. Spelet är mindre än 11 mot 11 | ingen ändring | ingen ändring (*nästan en hel 7 mot 7-plan*, se 1.4) | – |
| `smaspel-till-mal-9mot9` | Spel | `[9mot9]` | `[7mot7, 9mot9, 11mot11]` | (c). Tre mot tre till fyra mot fyra till minimål, mindre än 7 mot 7 | ingen ändring | ingen ändring | – |
| `uppspel-bakom-forsvarslinjen` | Spelövning | `[9mot9]` | `[9mot9, 11mot11]` | (b). Bygger på offside. Längden 40 m klarar minsta längd 35 m för `fas-13-14`, som gäller oförändrat | ingen ändring | ingen ändring | – |
| `hornor-med-nickar` | Spelövning | `[9mot9]` | **oförändrad** | se avsnitt 3 | | | |

*Not om mål i `omstallningsspel-9mot9`.* Materialet säger `mal`, alltså ett mål i någon spelforms storlek. Ett lag i 11 mot 11 kan ta fullstora mål, 7,32 m, till en yta som är 22 m bred. Det är vanligt i smålagsspel med målvakter för 14-åringar och inte farligare än med 9 mot 9-mål, men målet blir mycket stort i förhållande till ytan. Granskningen 2026-09-23 påpekade redan att storleken borde stå i materialet. Det är fortfarande en fråga för övningsförfattaren i en senare omgång, eftersom 5B inte ändrar `material`.

*Not om offside i 7 mot 7.* De fyra övningar som bygger på offside eller inspark får inte `7mot7`. Ett lag med 13-åringar som spelar 7 mot 7 har ingen offside i match, och att träna offsidefälla för den matchen är att träna något spelformen inte frågar efter (`passuppbyggnad.md`, *Minsta längd*).

## 3. Övningar som medvetet inte får alla möjliga spelformer

### 3.1 Ingen ändring alls (3 övningar)

| Övning | Ålder | Kunde ha fått | Varför inte |
|---|---|---|---|
| `malvaktsspel-i-smaspel` | 10–12 | `5mot5`, `9mot9` | **(b)** Bygger på retreatlinjen 7 m från mittlinjen, som inte finns i 9 mot 9. **(c)** Spelet är upp till sju mot sju på hela 7 mot 7-planen, alltså större än 5 mot 5 |
| `matchspel-7mot7-brett` | 10–12 | `5mot5`, `9mot9` | Samma två skäl. Texten säger uttryckligen att vanliga 7 mot 7-regler gäller, inklusive retreatlinjen |
| `hornor-med-nickar` | 13–14 | `7mot7`, `11mot11` | Ytans bredd är vald efter matchplanens bredd, så att hörnflaggan står på rätt avstånd från stolparna, och texten säger det (*30 x 45 meter, matchens planbredd*). En 7 mot 7-plan är 30–35 m bred och en 11 mot 11-plan 64–68 m. Övningen skulle behöva en egen `yta` per spelform, och då säger den emot sin egen beskrivning, som 5B inte ändrar (1.3). Hörnor för 13–19 år i alla spelformer hör hemma i omgång 6, där fasta situationer redan är planerade |

### 3.2 Får några men inte alla möjliga spelformer

| Övning | Får inte | Skäl |
|---|---|---|
| `malvaktstraning-grunder` | `3mot3` | (b) Målvaktsträning. 3 mot 3 har ingen målvakt |
| `matchspel-5mot5-med-malvakt` | `3mot3` | (b) målvakt och (c) spelet är större än 3 mot 3 |
| `matchspel-med-snabb-omstallning` | `3mot3` | Samma |
| `spela-ut-med-malvakten` | `3mot3` | (b) Målvakt och retreatregel. 3 mot 3 har ingen av dem |
| `smaspel-fasta-situationer` | `5mot5` | (c) Fullt 7 mot 7 på hela 7 mot 7-planen är större än 5 mot 5 |
| `forsvara-med-offsidefalla` | `7mot7` | (b) Offside saknas i 7 mot 7 |
| `matchspel-9mot9-brett` | `7mot7` | (b) offside och (c) fullt 9 mot 9 är större än 7 mot 7 |
| `smaspel-med-fasta-situationer-9mot9` | `7mot7` | (b) Inspark saknas i 7 mot 7 |
| `uppspel-bakom-forsvarslinjen` | `7mot7` | (b) Offside saknas i 7 mot 7 |

### 3.3 Följd för cellerna

Med listan ovan får varje grannspelform minst en övning i varje passdel, med ett undantag: **10–12 år i 5 mot 5 får bara en övning i `del-spel`**, `matchspel-7mot7-litet-format`, som bara tar 8–9 spelare i en grupp. Med andra antal blir delen Spel tom i den cellen. Pass skapas ändå, eftersom Öva och Spelövning fylls (R-101), men passet blir utan spel. Det kan inte lösas med märkning, eftersom bankens övriga spel för 10–12 år är 7 mot 7 på hela planen. Jag lägger det som ett hål till omgång 7: ett smålagsspel för 10–12 år, 3 mot 3 till 4 mot 4, med ett brett spelarspann.

## 4. Golv och tak

**Ingen ny spelform påverkar bedömningen av golv eller tak, och ingen övning behöver ny yta.** Skälen är F2:

- **Golvet** följer åldern, och ingen ålder ändras. Inget golv räknas om.
- **Taket** bedöms mot matchen i den spelform som föreslås för övningens ålder (R-013): 5 mot 5 för 8–9 år, 7 mot 7 för 10–12 år och 9 mot 9 för 13–14 år. Det är samma spelform som övningen var märkt med före 5B, så ingen takbedömning ändras.
- **Minsta längd** för djupled följer fasen. `uppspel-bakom-forsvarslinjen` (40 m) och `forsvara-med-offsidefalla` (42 m) klarar 35 m för `fas-13-14` också när de märks `11mot11`, eftersom åldern fortfarande är 13–14.

### 4.1 Kontrollen där frågan ligger närmast: 8–9 år i 3 mot 3

Om taket i stället prövades mot grannspelformen skulle den mindre spelformen vara den som slår till: 3 mot 3-matchen ger bara 25–30 m² per spelare, 5 mot 5 för 10–12 år 45–60 och 7 mot 7 för 13–14 år 107–138. Därför redovisar jag de 13 övningarna som får `3mot3`, räknat vid `spelare.min`, mot det tak F2 säger (5 mot 5, 45 m²) och mot 3 mot 3-matchens värde (25 m²) som jämförelse. Golvet för 8–9 år är 25 m² med motståndare och 10 utan, räknat vid `spelare.max`.

| Övning | Yta (m²) | min–max | m² per spelare vid min (tak 45) | vid max (golv) | Bedömning |
|---|---|---|---|---|---|
| `avslut-efter-kort-passning` | 150 | 4–6 | 37,5 | 25,0 (utan motst., golv 10) | Inom |
| `behall-bollen-i-gruppen` | 168 | 4–7 | 42,0 | 24,0 | Undantag 1, positionsspel. Oförändrat |
| `dribbling-genom-portar` | 216 | 4–6 | 54,0 | 36,0 | 20 % över riktvärdet vid min. Inom F2:s halva |
| `driva-forbi-i-par` | 36 | 2–2 | 18,0 | 18,0 | Under golvet 25, men godkänd före 2026-09-23 och därför inte omprövad (`passuppbyggnad.md`, sista punkten under *Vad som händer*) |
| `en-mot-en-med-joker-till-mal` | 216 | 5–7 | 43,2 | 30,9 | Inom |
| `en-mot-en-till-mal` | 80 | 2–2 | 40,0 | 40,0 | Inom |
| `forsvara-tillsammans` | 280 | 4–8 | 70,0 | 35,0 | 56 % över riktvärdet vid min, se nedan |
| `fyra-horn-med-boll` | 324 | 6–12 | 54,0 | 27,0 (utan motst.) | Egen boll, taket prövas inte som gräns (tillägget 2026-10-07) |
| `kapplopning-med-boll` | 90 | 2–2 | 45,0 | 45,0 (utan motst.) | Inom |
| `litet-spel-till-smamal` | 216 | 4–7 | 54,0 | 30,9 | 20 % över vid min. Inom F2:s halva |
| `rorelsebana-skadeforebyggande` | 180 | 6–10 | – | – | Undantag 3, egna platser |
| `snabbt-avslut-i-smaspel` | 216 | 4–6 | 54,0 | 36,0 | 20 % över vid min. Inom F2:s halva |
| `triangelpass-med-rorelse` | 64 | 3–3 | – | – | Undantag 3, fasta positioner |

**Slutsats:** ingen siffra i tabellen ändras av 5B, och ingen av dem är ett skäl att avstå från `3mot3`. Prövat mot 3 mot 3-matchens 25 m² skulle nästan alla ligga över, och det är just det F2 säger att taket inte ska användas till: att straffa en övning för 8–9-åringar för att laget har valt en mindre spelform.

Tre saker som 5B inte orsakar men som syns i tabellen, och som tas upp när övningarna öppnas nästa gång: `forsvara-tillsammans` ligger 56 % över riktvärdet vid fyra spelare (godkänd 2026-09-14, före taket var formulerat), `driva-forbi-i-par` ligger under dagens golv (godkänd före golvet), och `fyra-horn-med-boll` saknar meningen om att ledaren gör ytan mindre för en liten grupp, som tillägget 2026-10-07 kräver av nya övningar med egen boll.

### 4.2 De andra grannspelformerna

- **Större grannspelform** (7 mot 7 för 8–9 år, 9 mot 9 för 10–12 år, 11 mot 11 för 13–14 år): grannens match är glesare, så även en strikt läsning skulle ge ett högre tak. Inget att pröva.
- **5 mot 5 för 10–12 år och 7 mot 7 för 13–14 år:** samma resonemang som för 3 mot 3. Taket prövas mot den föreslagna spelformen enligt F2, och bedömningen är oförändrad.

## 5. Ordning och pull requests

Planen för omgång 5 delade 5B i två pull requests, 8–12 år först och 13–14 år **när omgång 4 är godkänd**. Omgång 4 är nu godkänd (pull request #17, 2026-10-07), så skälet till att vänta är borta.

**Rekommendation: en pull request, med tre commits, en per åldersfas** (8–9, 10–12 och 13–14 år). Skälen:

- Varje fil får samma sorts ändring, en lista och en granskningspost, så diffen är lätt att läsa. Uppdelningen i commits gör att användaren ändå kan granska en fas i taget.
- Omfånget är hanterbart: 54 filer, se räkningen nedan.
- Två pull requests kräver två merger och två körningar av statusskrivningen (ADR 0013, 0020) för samma sorts ändring.

*Räkning:* 2.1 har 17 ändrade filer. 2.2 har 25 ändrade och 2 oförändrade. 2.3 har 12 ändrade och 1 oförändrad. **Totalt ändras 54 filer, och 3 lämnas orörda.**

Om användaren hellre vill ha två pull requests, för att granska mindre åt gången: 8–12 år (42 filer) först och 13–14 år (12 filer) därefter. Ordningen spelar ingen roll för innehållet, eftersom ingen övning i den ena delen påverkar den andra.

**Efter mergen:** täckningsskriptet körs om, och målen i `plan-omgang-5.md`, avsnitt 1.2, prövas per cell. Kolumnen *Spelform* i `ytreferenser.md`, tabell 6.1 och 6.2, uppdateras av mig så att den stämmer med filerna.

## 6. Beslut som behövs

**B1. Namn med en spelform i.** Två övningar får spelformer som deras namn inte nämner: `matchspel-7mot7-litet-format` heter *Matchspel 7 mot 7 i litet format* men visas nu också i 5 mot 5 och 9 mot 9, och `omstallningsspel-9mot9` heter *Omställningsspel 9 mot 9* men visas också i 7 mot 7 och 11 mot 11. Övningarna är rätt i sak, men namnet kan få en ledare att tro att det är en fullstor match. *Rekommendation:* låt 5B också ändra `namn` för just de två, till *Matchspel i litet format med målvakt* respektive *Omställningsspel med målvakt*. ID:na ändras inte. Alternativet är att låta namnen stå och ta dem i en senare omgång. 5B fungerar med båda valen.

**B2. En eller två pull requests.** *Rekommendation:* en, med en commit per åldersfas (avsnitt 5).

## 7. Källor

| Källa | Använd för | Läst |
|---|---|---|
| `content/ovningar/*.yaml`, de 57 filerna med en spelform, grenen `omgang/5b` | Ålder, passdel, spelare, yta, ytreferens, mål i skissen, regler i texten | 2026-10-07 |
| `docs/doman/plan-omgang-5.md`, avsnitt 4, F1 och F2 | Villkoren | 2026-10-07 |
| `docs/doman/spelformer.md` (SvFF:s spelformsblad 2025 och planstorleksdokumentet, hämtade 2026-09-11) | Retreatlinje, offside, inspark, målvakt, planmått | 2026-10-07 |
| `docs/doman/passuppbyggnad.md` | Golv, tak, undantag, minsta längd, tillägget 2026-10-07 | 2026-10-07 |
| `docs/doman/ytreferenser.md` | Konventionerna och kategorierna utan referens | 2026-10-07 |
| `docs/doman/generatorregler.md` | R-004, R-013, R-014, R-015, R-024, R-092 | 2026-10-07 |
| ADR 0010, 0012, 0017, 0019 | Nycklarna i `yta` och `ytreferens`, omskalning av skissen, målbredd per spelform | 2026-10-07 |

Inga nya externa källor är hämtade. Bedömningarna i avsnitt 2–4 är mina som tränarutbildare.
