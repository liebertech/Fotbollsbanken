Status: utkast

# Plan för omgång 8 av övningsbanken: fördjupningen för 6–7 år

**Ägare:** fotbollsexpert · **Skriven:** 2026-10-09 · **Underlag:** `docs/doman/tackning-2026-10-08-omgang-7.md` (frö `tackning-1`, kolumnen *Efter CI*, som är läget när omgång 6 och 7 är godkända, utan B4), `plan-omgang-5.md` (avsnitt 2.2, 4 och F1–F5), `plan-omgang-6.md` (designregel 10–20), `plan-omgang-7.md` (avsnitt 1, 2.1, 2.6, 4 och 5, särskilt B2 och B4), `generatorregler.md` (R-002, R-031–R-035, R-041–R-048, R-054, R-058, R-063, R-070, R-092, R-100, R-101, R-121), `passuppbyggnad.md` (*Så räknas tiden fram* och *Yta per spelare*), `aldrar-och-fokus.md` (fas 6–7), `fokusomraden.md`, `spelformer.md`, `ytreferenser.md`, `scripts/tackning.ts` (`lengthSample`), `scripts/tackning-celler.ts` (`PLAN_GOALS`), generatorns fyllning i `src/regelmotor/select/assemble.ts`, `select/fill.ts` och `score/improve.ts`, och de sju övningsfilerna för 6–7 år, lästa på grenen `omgang/8` 2026-10-09.

Planen är skriven så att övningsförfattaren kan skriva varje övning direkt ur tabellerna i avsnitt 2 och designreglerna i avsnitt 2.2. Alla procenttal som inte står i täckningsrapporten är mina egna uträkningar, och de redovisas så att de går att kontrollera. Målen är mål, inte prognoser. De prövas genom att täckningsskriptet körs om när omgången är granskad.

`plan-omgang-5.md`, avsnitt 4, lade 5–6 övningar för 6–7 år som fördjupning. Användaren flyttade dem till omgång 8 den 2026-10-08 (beslut B2 i `plan-omgang-7.md`). Den här planen tar bara 6–7 år. **8–19 år ska vara exakt oförändrade.**

## 0. Läget efter omgång 7

### 0.1 Vad banken har för 6–7 år

Sju övningar, alla från paket A i omgång 5, alla med `alder` 6–7, `spelformer` `3mot3` och `5mot5`, nivå 1–3 och ledarbehov 0. Ingen övning för andra åldrar gäller 6–7 år (R-023).

| Övning | Passdelar | Fokus (huvudfokus först) | Grupptyp, spelare | Tid | Yta |
|---|---|---|---|---|---|
| `lek-med-egen-boll` | Uppvärmning, Öva | `lek`, `bollkansla`, `koordination` | `fri`, 4–16 | 5 / 7 / 8 | 18 × 12 |
| `svansjakt-med-egen-boll` | Uppvärmning | `lek`, `koordination`, `snabbhet` | `fri`, 4–12 | 5 / 7 / 8 | 12 × 12 |
| `bollkansla-och-driv-med-egen-boll` | Öva | `bollkansla`, `dribbling`, `koordination` | `fri`, 4–16 | 5 / 7 / 8 | 15 × 10 |
| `driv-och-skjut-pa-smamal` | Öva | `dribbling`, `avslut`, `bollkansla` | `fri`, 2–4 | 5 / 7 / 8 | 10 × 5 |
| `duell-mot-tva-smamal` | **Öva och Spelövning** | `ett-mot-ett`, `dribbling`, `avslut` | `par` | 5 / 7 / 8 | 8 × 6 |
| `hitta-den-fria-i-overlage` | Spelövning | `spelbarhet`, `passning-mottagning`, `ett-mot-ett` | `tva-lag`, 3–5 | 5 / 7 / 8 | 12 × 8 |
| `tva-mot-tva-till-tre-mot-tre-med-smamal` | Spel | `ett-mot-ett`, `avslut`, `dribbling` | `tva-lag`, 4–7 | 10 / 15 / 20 | 15 × 10 |

Räknat per fokusområde för fasen (K fetstilt, `fokusomraden.md`):

| Fokus | Öva | Spelövning |
|---|---|---|
| **`bollkansla`** | 3 (`lek-med-egen-boll`, `bollkansla-och-driv…`, `driv-och-skjut…`) | **0** |
| **`dribbling`** | 3 (`bollkansla-och-driv…`, `driv-och-skjut…`, `duell…`) | 1 (`duell…`) |
| **`avslut`** | 2 (`driv-och-skjut…`, `duell…`) | 1 (`duell…`) |
| **`ett-mot-ett`** | 1 (`duell…`) | 2 (`duell…`, `hitta-den-fria…`) |
| **`koordination`** | 2 (`lek-med-egen-boll`, `bollkansla-och-driv…`) | **0** |
| **`lek`** | 1 (`lek-med-egen-boll`) | **0** |
| `passning-mottagning` | **0** | 1 (`hitta-den-fria…`) |
| `spelbarhet` | **0** | 1 (`hitta-den-fria…`) |
| `snabbhet` | **0** | **0** |

Två saker syns direkt: `lek` och `bollkansla`, som står i centrum för åldern, har ingen spelövning alls, och `duell-mot-tva-smamal` är den enda spelövningen för `dribbling` och `avslut` samtidigt som den är en av Öva-övningarna för samma fokus. Det andra är huvudorsaken till att kärnan inte fylls (avsnitt 0.4).

### 0.2 Täckningsrapportens siffror

Ur `tackning-2026-10-08-omgang-7.md`, kolumnen *Efter CI* (*Per cell i planen*):

| Cell | Typ | Körfall | Inget pass | Fylld kärna | Kärna på valt fokus | Kärndel borttagen (R-033) |
|---|---|---|---|---|---|---|
| 6–7 år, 3 mot 3 | föreslagen | 15 792 | 0,0 % | 85,7 % | 33,9 % | 32,8 % |
| 6–7 år, 5 mot 5 | granne | 15 792 | 0,0 % | 85,7 % | 33,9 % | 32,8 % |

Som jämförelse har 8–9 år 85,5 och 43,2–46,0 procent, 10–12 år 91,7 och 47,4 procent, 13–14 år i 9 mot 9 77,4 och 53,5 procent och 15–19 år 89,5 och 58,7 procent. **6–7 år har nu lägst kärna på valt fokus av alla åldrar.**

*Per spelform, passdel och fokusområde*, kolumnen "Kan inte fyllas för sig", efter CI. Tabellerna blandar åldrar: `3mot3` räknar 6–7 och 8–9 år, `5mot5` räknar 6–12 år. Per fokus har 6–7 år 1 728 körfall i Öva och 1 152 i Spelövning i varje spelform. Det är färre i Spelövning eftersom R-033 tar bort delen i 30-minuterspass. Fokus som bara gäller 8–9 år har 1 728 körfall i båda delarna, så resten av raden går att räkna ut.

| Spelform | Del | Fokus | Övningar | Körfall | Kan inte fyllas | Varav 6–7 år, min uträkning |
|---|---|---|---|---|---|---|
| `3mot3` | `del-spelovning` | `lek` | 1 | 2 880 | 47,5 % | 1 152 av 1 152, alltså 100 %. Den enda övningen är för 8–9 år |
| `3mot3` | `del-spelovning` | `bollkansla` | 1 | 2 880 | 47,5 % | 100 %, samma skäl |
| `3mot3` | `del-spelovning` | `snabbhet` | 0 | 2 880 | 100 % | 100 % |
| `3mot3` | `del-spelovning` | `koordination` | 0 | 2 880 | 100 % | 100 % |
| `3mot3` | `del-ovning` | `passning-mottagning` | 3 | 3 456 | 50,0 % | 1 728 av 1 728. Alla tre övningarna är för 8–9 år |
| `3mot3` | `del-ovning` | `spelbarhet` | 3 | 3 456 | 50,0 % | 100 %, samma skäl |
| `3mot3` | `del-ovning` | `snabbhet` | 0 | 3 456 | 100 % | 100 % |
| `3mot3` | `del-ovning` | `ett-mot-ett` | 2 | 3 456 | 33,3 % | 576, alla 60-minuterspass (avsnitt 0.3) |
| `3mot3` | `del-ovning` | `lek` | 3 | 3 456 | 18,8 % | 576, alla 60-minuterspass |
| `5mot5` | `del-spelovning` | `lek`, `bollkansla` | 1 | 5 472 | 72,4 % | 1 152 av 1 152 |
| `5mot5` | `del-ovning` | `passning-mottagning`, `spelbarhet` | 9 resp. 7 | 6 048 | 28,6 % | 1 728 av 1 728, alltså hela raden |

**Ersättningsfokus (R-121), efter CI:** `3mot3` 40,1 %, `5mot5` 36,1 %, `7mot7` 35,7 %, `9mot9` 33,3 %, `11mot11` 31,6 %, hela banken 34,7 %. `3mot3` är högst av spelformerna. De vanligaste ersättningarna efter CI är `lek -> dribbling` 29 724, `snabbhet -> dribbling` 26 928, `malvaktsspel -> avslut` 19 026, `koordination -> ett-mot-ett` 17 559, `bollkansla -> ett-mot-ett` 17 001, `skadeforebyggande -> koordination` 14 184, `speluppbyggnad -> passning-mottagning` 11 600, `fasta-situationer -> avslut` 10 209, `skadeforebyggande -> bollkansla` 9 864 och `koordination -> snabbhet` 9 576. (`bollkansla -> dribbling`, som uppdraget nämner, står i listan för *Banken nu* med 15 786. Efter CI har den fallit ur topp tio, och `bollkansla -> ett-mot-ett` har tagit platsen.)

**Hur stor del av ersättningarna som kommer från 6–7 år.** Rapporten delar inte upp ersättningarna per ålder. Min uträkning i avsnitt 0.4 ger att 6–7 år står för ungefär 20 400 ersättningar i enkelfokussvepet, varav ungefär 10 200 i `3mot3` och lika många i `5mot5`. Det är ungefär 43 procent av kärnmomenten för 6–7 år, mot ungefär 39 procent för 8–9 år i 3 mot 3. Av de vanligaste raderna kommer ungefär 1 500 av `lek -> dribbling`, 3 800 av `snabbhet -> dribbling`, 2 300 av `koordination -> ett-mot-ett` och 2 300 av `bollkansla -> ett-mot-ett` från 6–7 år. **Det mesta av `lek -> dribbling` och `snabbhet -> dribbling` kommer alltså från 10–19 år, och omgång 8 kan bara ta bort andelen för 6–7 år.**

### 0.3 Måltiderna som styr 6–7 år

Täckningsskriptet prövar passlängderna 30, 45 och 60 minuter för `fas-6-7` (`lengthSample`: kortast, mitten avrundad till 5 och längst). Med R-031 till R-033:

| Pass | Avslutning + vatten | Aktiv tid | Uppvärmning | Öva | Spelövning | Spel |
|---|---|---|---|---|---|---|
| 30 | 3 + 2 | 25 | 6 | 6 | 3, **tas bort** (R-033) | 10 + 3 = 13 |
| 45 | 3 + 4 | 38 | 9 | 9 | 5 | 15 |
| 60 | 3 + 6 | 51 | **12** | **12** | 7 | 20 |

Varje del får ligga inom ± 3 minuter (R-035), och en övning får vara högst 8 minuter i Uppvärmning, Öva och Spelövning för fasen (R-034). Fyra följder:

1. **60-minuterspass kräver två olika övningar i Öva**, båda med samma fokus (R-041, R-070). Måltiden 12 ger 9–15 minuter, och ingen övning får vara mer än 8.
2. **60-minuterspass kräver två olika uppvärmningar**, av samma skäl. Banken har bara två: `lek-med-egen-boll` och `svansjakt-med-egen-boll`. När Öva tar `lek-med-egen-boll` står uppvärmningen utan övning. Det mäts inte av skriptet (beslut B3), men det är ett hål.
3. **Spelövning behöver bara en övning** i alla passlängder (2–8 och 4–10 minuter).
4. **I 30-minuterspass är Öva hela kärnan.** Kärna på valt fokus avgörs där bara av Öva.

### 0.4 Varför kärnan inte fylls: samma övning kan inte fylla två delar

Generatorn fyller delarna i ordningen Öva, Spelövning, Spel, Uppvärmning (R-048, post 2, och `PART_PRIORITY_ORDER`). Inom en del väljer den först en uppsättning där alla övningar har huvudträff (R-042), sedan den som lägger till flest valda fokus och sist den med minst antal moment. Bland lika bra uppsättningar avgör slumpen (R-072). Ersättningsfokus används bara när en del inte kan fyllas *för sig* (R-121, steg 1). Om Öva har tagit den enda spelövning som har valt fokus, kan Spelövning fortfarande fyllas för sig, så någon ersättning används inte, och delen blir tom (R-100, andra punkten). Den lokala förbättringen (R-049) kan inte rätta det, eftersom det kräver två ändringar samtidigt.

Det är samma mekanism som gjorde att B4 i omgång 7 sänkte fylld kärna för 8–9 år från 85,5 till 83,2 procent: en övning som får både Öva och Spelövning tas av Öva och fattas i Spelövning.

För 6–7 år är det `duell-mot-tva-smamal`. Min genomgång, fokus för fokus och passlängd för passlängd, med de sju övningarna:

| Valt fokus | 30 min | 45 min | 60 min |
|---|---|---|---|
| `bollkansla` | valt | fylld, ersättning i Spelövning (`ett-mot-ett`) | fylld, ersättning i Spelövning |
| `dribbling` | valt | valt | **tom Spelövning i cirka 2 av 3**: Öva tar två av tre övningar, och två av tre par innehåller `duell…` |
| `avslut` | valt | **tom Spelövning i cirka hälften**: Öva tar `driv-och-skjut…` eller `duell…` på slump | **alltid tom Spelövning**: Öva behöver båda, och `duell…` är den enda spelövningen |
| `ett-mot-ett` | valt | valt (`duell…` i Öva, `hitta-den-fria…` i Spelövning) | fylld, ersättning i Öva (`dribbling`) |
| `koordination` | valt | fylld, ersättning i Spelövning | fylld, ersättning i Spelövning |
| `lek` | valt | fylld, ersättning i Spelövning | ersättning `dribbling` i båda delarna (R-121, steg 5), **tom Spelövning i cirka 2 av 3** |
| `passning-mottagning` | ersättning | fylld, ersättning i Öva | fylld, ersättning i Öva |
| `spelbarhet` | ersättning | fylld, ersättning i Öva | fylld, ersättning i Öva |
| `snabbhet` | ersättning | ersättning `dribbling` i båda delarna | ersättning `dribbling` i båda, **tom Spelövning i cirka 2 av 3** |

*Kontroll mot rapporten:* med nio fokus och tre passlängder lika ofta ger tabellen fylld kärna 1 − (0,5 + 3) / 27 = 87,0 procent och kärna på valt fokus (6 + 2,5 + 0,33) / 27 = 32,7 procent. Rapporten har 85,7 och 33,9. Skillnaden kommer av stationer när det finns två ledare, av kombinationssvepet och av att mina andelar för slumpen är avrundade. Uträkningen förklarar alltså nästan hela läget, och den används för målen nedan.

*Kontroll av ersättningarna:* per fokus och passlängd har 6–7 år 1 152 körfall i enkelfokussvepet (2 åldrar × 2 spelformer × 288). Tabellen ger då 20 352 ersättningar för 6–7 år, hälften i varje spelform. Det är talet i avsnitt 0.2.

### 0.5 Vad som inte kan bli 100 procent

- **`koordination` ger aldrig kärna på valt fokus i 45- och 60-minuterspass.** Den får ingen spelövning, och det är rätt (F3). Spelövning fylls med ersättning, efter omgången med `snabbhet` i stället för `ett-mot-ett`.
- **`spelbarhet` och `snabbhet` i 60-minuterspass.** Båda får en Öva-övning var i omgången. Två skulle krävas (avsnitt 0.3, punkt 1). Beslut B2 ger `snabbhet` sin andra.
- Taket för kärna på valt fokus är därför 23 av 27 fokus- och passlängdsfall, 85,2 procent, utan B2 och 24 av 27, 88,9 procent, med B2.

## 1. Mål

### 1.1 Mål per cell

Måtten är kolumnerna i rapportens tabell *Per cell i planen*, räknade efter att omgång 8 är godkänd, eller efter CI-rättningen när omgångens övningar är granskade men inte godkända. "Fylld kärna" och "Kärna på valt fokus" avser kolumnerna "av alla körfall". Kolumnen *Nu* är *Efter CI* i `tackning-2026-10-08-omgang-7.md`.

| Cell | Typ | Mått | Nu | Mål efter omgång 8 | Prövas som |
|---|---|---|---|---|---|
| 6–7 år, 3 mot 3 | föreslagen | Inget pass | 0,0 % | högst 0,0 % | `<= 0.0` |
| 6–7 år, 3 mot 3 | föreslagen | Fylld kärna | 85,7 % | minst 95 % | `>= 95.0` |
| 6–7 år, 3 mot 3 | föreslagen | Kärna på valt fokus | 33,9 % | minst 70 % | `>= 70.0` |
| 6–7 år, 5 mot 5 | granne | Inget pass | 0,0 % | högst 0,0 % | `<= 0.0` |
| 6–7 år, 5 mot 5 | granne | Fylld kärna | 85,7 % | minst 95 % | `>= 95.0` |
| 6–7 år, 5 mot 5 | granne | Kärna på valt fokus | 33,9 % | minst 70 % | `>= 70.0` |
| 8–9 år, 5 mot 5 | föreslagen | alla tre | 0,0 / 85,5 / 46,0 % | **exakt oförändrat** | lika med *Efter CI* |
| 8–9 år, 3 mot 3 | granne | alla tre | 0,0 / 85,5 / 43,2 % | **exakt oförändrat** | lika med *Efter CI* |
| 8–9 år, 7 mot 7 | granne | alla tre | 0,0 / 85,5 / 46,0 % | **exakt oförändrat** | lika med *Efter CI* |
| 10–12 år, 7 mot 7, 5 mot 5 och 9 mot 9 | båda | alla tre | 0,0 / 91,7 / 47,4 % | **exakt oförändrat** | lika med *Efter CI* |
| 13–14 år, 9 mot 9 och 11 mot 11 | båda | alla tre | 1,5 / 77,4 / 53,5 % | **exakt oförändrat** | lika med *Efter CI* |
| 13–14 år, 7 mot 7 | granne | alla tre | 2,8 / 75,5 / 44,6 % | **exakt oförändrat** | lika med *Efter CI* |
| 15–19 år, 11 mot 11 och 9 mot 9 | båda | alla tre | 1,0 / 89,5 / 58,7 % | **exakt oförändrat** | lika med *Efter CI* |

*Varför 8–19 år ska vara exakt oförändrade:* ingen ny eller ändrad övning har en ålder över 7 (R-023). Ändras en siffra där är det ett fel i skriptet eller i en fil, inte en effekt av omgången. Det gäller också om beslut B2 godkänns, eftersom den bara rör en övning för 6–7 år.

*Varför inget pass ska hållas på 0,0:* omgången har inget nytt spel, och en ny övning kan aldrig göra en del omöjlig att fylla, eftersom *Delen kan fyllas* bara kräver att någon övning passar.

*Varför fylld kärna kan gå till 95:* med de sex övningarna finns ingen övning kvar som är den enda för sitt fokus i Spelövning och samtidigt kan tas av Öva (avsnitt 2.5). Min uträkning ger 100 procent. Marginalen täcker stationer, kombinationssvepet och fall jag inte kan räkna fram för hand.

*Varför kärna på valt fokus kan gå till 70:* min uträkning ger 23 av 27 fall, 85,2 procent (avsnitt 2.5). Före omgången låg min uträkning 1,2 procentenheter under rapporten. Målet ger 15 procentenheters marginal, ungefär som omgång 7, där målen sattes ungefär halvvägs till uträkningen.

*Varför 3 mot 3 och 5 mot 5 har samma mål:* alla övningar för 6–7 år, också de nya, är märkta med båda spelformerna. Cellerna är i dag lika på alla tre mått. **Om de skiljer sig efter omgången är en övning fel märkt.** Det är en billig kontroll.

### 1.2 Mål per spelform och del

Måttet är kolumnen "Kan inte fyllas för sig" i rapportens tabell *Per spelform, passdel och fokusområde*, efter CI. Den påverkas inte av slumpen eller av R-070, bara av vilka övningar som finns, deras tider och antal spelare. Därför är målen här exakta uträkningar: andelen för 8–12 år ligger kvar, och andelen för 6–7 år räknas om. "Varför" anger vad som är kvar.

| Spelform | Del | Fokus | Nu | Mål | Övningar | Varför |
|---|---|---|---|---|---|---|
| `3mot3` | `del-spelovning` | `lek`, `bollkansla` | 47,5 % | högst 7,5 % | O8-01 | 6–7 år från 1 152 till 0. Kvar är 216 körfall för 8–9 år |
| `3mot3` | `del-spelovning` | `snabbhet` | 100 % | högst 60,0 % | O8-02 | 6–7 år till 0. 8–9 år, 1 728 av 2 880, har ingen och ligger kvar |
| `3mot3` | `del-spelovning` | `koordination` | 100 % | **oförändrat** 100 % | – | F3 |
| `3mot3` | `del-ovning` | `passning-mottagning` | 50,0 % | högst 0,0 % | O8-04, O8-05 | Två övningar räcker också i 60-minuterspass |
| `3mot3` | `del-ovning` | `spelbarhet` | 50,0 % | högst 16,7 % | O8-05 | En övning räcker inte i 60-minuterspass: 576 av 3 456 |
| `3mot3` | `del-ovning` | `ett-mot-ett` | 33,3 % | högst 16,7 % | O8-03 | 6–7 år till 0. 8–9 år har 576 kvar |
| `3mot3` | `del-ovning` | `lek` | 18,8 % | högst 2,1 % | O8-04 | 6–7 år till 0. 8–9 år har 72 kvar |
| `3mot3` | `del-ovning` | `snabbhet` | 100 % | högst 66,7 % | O8-06 | 60-minuterspass för 6–7 år ligger kvar (576) och 8–9 år (1 728). Med B2: 50,0 % |
| `5mot5` | `del-spelovning` | `lek`, `bollkansla` | 72,4 % | högst 51,4 % | O8-01 | 6–7 år, 1 152 av 5 472, till 0 |
| `5mot5` | `del-spelovning` | `snabbhet` | 100 % | högst 78,9 % | O8-02 | Samma |
| `5mot5` | `del-ovning` | `passning-mottagning` | 28,6 % | högst 0,0 % | O8-04, O8-05 | Hela raden är 6–7 år |
| `5mot5` | `del-ovning` | `spelbarhet` | 28,6 % | högst 9,5 % | O8-05 | 576 av 6 048 kvar |
| `5mot5` | `del-ovning` | `ett-mot-ett` | 24,4 % | högst 14,9 % | O8-03 | 576 av 6 048 bort |
| `5mot5` | `del-ovning` | `lek` | 53,6 % | högst 44,1 % | O8-04 | 576 av 6 048 bort. 10–12 år har ingen Öva för `lek` |
| `5mot5` | `del-ovning` | `snabbhet` | 100 % | högst 81,0 % | O8-06 | 1 152 av 6 048 bort. Med B2: 71,4 % |

Alla rader för `7mot7`, `9mot9` och `11mot11` ska vara exakt oförändrade.

### 1.3 Ersättningsfokus

Rapportens tabell *Ersättningsfokus (R-121)*, enkelfokussvepet:

| Spelform | Nu | Min uträkning | Mål efter omgång 8 | Varför |
|---|---|---|---|---|
| `3mot3` | 40,1 % | 27,8 % | **högst 31 %** | 6–7 år går från cirka 43 till cirka 9 procent ersättning. 8–9 år, cirka 39 procent, ändras inte |
| `5mot5` | 36,1 % | 30,2 % | högst 33 % | Samma minskning för 6–7 år, men 6–7 år är en mindre del av spelformen |
| `7mot7` | 35,7 % | 35,7 % | **exakt oförändrat** | Ingen övning för 6–7 år är märkt `7mot7` |
| `9mot9` | 33,3 % | 33,3 % | **exakt oförändrat** | Samma |
| `11mot11` | 31,6 % | 31,6 % | **exakt oförändrat** | Samma |
| Hela banken | 34,7 % | 32,3 % | högst 33,2 % | Följer av målen per spelform, se nedan |

*Så är uträkningen gjord:* före omgången har 6–7 år i varje spelform 23 904 kärnmoment (2 åldrar × 11 952) och 10 176 ersättningar (2 × 5 088), enligt avsnitt 0.4. Efter omgången fylls alla 25 920 kärnmoment (2 × 12 960), och ersättning återstår bara för `koordination` i Spelövning i 45 och 60 minuter och för `spelbarhet` och `snabbhet` i Öva i 60 minuter, alltså 4 av 27 fall eller 2 304 ersättningar per spelform. I `3mot3` har resten av spelformen, 8–9 år, 68 420 − 23 904 = 44 516 kärnmoment och 27 448 − 10 176 = 17 272 ersättningar. Efter omgången blir det (17 272 + 2 304) / (44 516 + 25 920) = 19 576 / 70 436 = 27,8 procent. I `5mot5` har 8–12 år 142 814 − 23 904 = 118 910 kärnmoment och 51 589 − 10 176 = 41 413 ersättningar, och efter omgången blir det (41 413 + 2 304) / (118 910 + 25 920) = 30,2 procent.

*Kontroll av målet för hela banken:* om `3mot3` och `5mot5` når sina mål precis och övriga spelformer är oförändrade blir det 70 436 × 0,31 + 144 830 × 0,33 + 56 393 + 73 638 + 46 329 = 245 989 ersättningar av 740 860 kärnmoment, alltså 33,2 procent.

*Förväntade ändringar i listan över vanligaste ersättningar,* inte mål: `snabbhet -> dribbling` minskar med cirka 3 800, `bollkansla -> ett-mot-ett` och `koordination -> ett-mot-ett` med cirka 2 300 var och `lek -> dribbling` med cirka 1 500. `koordination -> snabbhet` *ökar* med cirka 2 300, eftersom O8-02 blir den första ersättningen för `koordination` i Spelövning (R-121). Det är rätt innehåll: koordination i en duell är starter och riktningsändringar.

*Det här är omgångens osäkraste mål,* eftersom rapporten inte delar ersättningarna per ålder, och fördelningen mellan 6–7 och 8–9 år i `3mot3` bygger på min uträkning i avsnitt 0.4.

### 1.4 Om mätningen

- Målen i 1.1 ska föras in i `PLAN_GOALS` i `scripts/tackning-celler.ts` på samma sätt som för omgång 7, med ett nytt fält, till exempel `omgang8`: `raise(0.0, 95.0, 70.0)` för de två cellerna för 6–7 år och `keep(...)` med värdena ur *Efter CI* i `tackning-2026-10-08-omgang-7.md` för alla celler för 8–19 år. Det är arbete för kvalitetssäkraren eller senior systemutvecklare, inte för mig.
- Sammanfattningen för omgång 7 har i dag "exakt oförändrat" för 6–7 år. Efter omgång 8 ska de raderna stå som "ändras av omgång 8", på samma sätt som sammanfattningen för omgång 6 gör med 8–12 år.
- Målen i 1.2 och 1.3 prövas för hand mot rapportens tabeller. Skriptet behöver inte ändras för dem.
- Kontrollen att 6–7 år i 3 mot 3 och i 5 mot 5 är lika görs på antal körfall och antalen bakom de tre måtten, som kontrollen för 8–9 år i omgång 7.
- Om beslut B2 godkänns körs skriptet både före och efter den ändringen, så att effekten av de nya övningarna och effekten av ändringen i en godkänd fil går att skilja åt (avsnitt 3.4).

## 2. Övningarna i omgång 8

### 2.1 Utgångspunkten: lek, bollkänsla och glädjen i att göra mål

Det här är mina egna formuleringar. Källorna står i avsnitt 6.

- SvFF:s spelarutbildningsplan gäller 6–19 år och bygger på *Fotbollens spela, lek och lär*. Leken och glädjen står i centrum för de yngsta, och målet är ett livslångt intresse, inte resultat.
- Målet med spelformen 3 mot 3 är att både match och träning ska utgå från barnens behov, vara glädjefyllda och ge varje barn många fotbollsaktioner.
- I `aldrar-och-fokus.md` har jag omsatt det till fas 6–7: mycket tid med egen boll, lekar med fantasinamn och enkla regler, 1 mot 1 som grund, passningen som något som kommer när det finns en fri kompis, korta ryck och tät vila, instruktion på högst cirka 30 sekunder och ungefär 5–8 minuter i samma form.

Det betyder för omgången:

1. **Varje övning är en lek eller en tävling** med ett namn och en berättelse som en sexåring förstår, och en regel som kan visas på en halv minut.
2. **Bollen är barnets.** En boll per barn där det går, annars en per par. Ingen står i kö längre än en halv minut.
3. **Ingen åker ut.** Den som förlorar en boll eller en duell byter roll eller fortsätter direkt.
4. **Mål och poäng ska vara lätta att få.** Många små segrar per minut, inte en vinnare efter fem minuter.

### 2.2 Designregler för alla övningar i omgången

Reglerna gäller utöver planskiss- och textreglerna 10–20 i `plan-omgang-6.md`, avsnitt 2.1, som gäller för alla åldrar. Varje regel kommer ur en orsak i avsnitt 0.

**Passdelar** (orsak: avsnitt 0.4):

1. **Ingen ny övning får både `del-ovning` och `del-spelovning`** (F1). Det är lärdomen från B4 i omgång 7.
2. **O8-04 och O8-06 får `del-uppvarmning` och `del-ovning`.** Då har fasen fyra uppvärmningar, och Öva kan aldrig ta mer än två av dem (avsnitt 0.3, punkt 2, och F8).

**Fokus** (orsak: avsnitt 0.4):

3. **Huvudfokus står exakt som i tabellerna.** Generatorn väljer i första hand en uppsättning där alla övningar har huvudträff (R-042). Två Öva-övningar med samma huvudfokus blir då det par som väljs i 60-minuterspass. Byt inte ordningen utan att fråga mig (F2).
4. **Bara fokus som är K eller R för `fas-6-7`** (R-002): `bollkansla`, `dribbling`, `avslut`, `ett-mot-ett`, `koordination`, `lek`, `passning-mottagning`, `spelbarhet` och `snabbhet`.

**Ålder, spelformer, tid, antal och nivå:**

5. **`alder` 6–7** i alla. Ingen övning spänner till 8–9 år, eftersom golvet för 8–9 år, 25 kvadratmeter med motståndare, är lika med taket för 6–7 år (F2 i `plan-omgang-5.md`).
6. **`spelformer` `3mot3` och `5mot5`.** Ingen målvakt, inga regler som bara finns i 5 mot 5 (F1 (b) i `plan-omgang-5.md`). Mål är `minimal`, högst 1,6 × 1,15 meter (`spelformer.md`).
7. **`tid` 5 / 7 / 8** i alla. Längst 8 är fasens tak (R-034). Två övningar om 5–8 minuter ger 10–16, och 60-minuterspassets Öva ska ha 9–15.
8. **Ledarbehov 0** i alla. En ledare kan ge signaler till flera grupper samtidigt.
9. **Nivå 1–3** med en lättare variant som verkligen gör övningen möjlig för `niva-1` och en svårare som gör något av det `nivaer.md` beskriver för nivå 3 (designregel 19 i `plan-omgang-6.md`).
10. **Spelarspannet:** `fri` 4–16 för övningar med egen boll eller boll per par, `tva-lag` 4–8, `par` 2–2 med trio vid udda antal (R-058). Alla spann uppfyller `spelare.max` ≥ 2 × `spelare.min` − 1.

**Yta** (`passuppbyggnad.md`, *Yta per spelare*):

11. **Golv och tak för `fas-6-7`:** golv 15 kvadratmeter med motståndare och 8 utan, tak 25. Golvet räknas på `spelare.max`, taket på `spelare.min`. Minst 5 procent över golvet (designregel 6 i `plan-omgang-6.md`).
12. **Egen boll och ingen motståndare:** taket prövas inte, men `organisation` ska säga hur stor ytan görs med en liten grupp. **Kull- och jaktlekar, och övningar med en boll per par:** taket prövas, och en mindre yta för små grupper ska stå i `organisation`.
13. **Kvarts plan.** Varje övnings yta ska rymmas på kvarts plan, 52 × 32 meter, för det antal grupper som 20 spelare ger (R-092).

**Lek, säkerhet och text:**

14. **En lekberättelse och ett fantasinamn**, och en regel som kan visas på 30 sekunder (avsnitt 2.1). Övningen ska beskriva vad som ändras efter halva tiden, eftersom 5–8 minuter i samma form är gränsen för åldern.
15. **Kön** är högst 2–3 per boll, mål eller station, och ingen väntar mer än en halv minut. Den som väntar står utanför ytan och aldrig i en skottlinje.
16. **Spela på bollen.** Ingen tacklar, knuffar eller tar bollen bakifrån. Skott och passningar går längs marken, och ingen skjuter mot någon som hämtar en boll.
17. **Arbete och vila i siffror** i varje övning med `snabbhet` (designregel 16 i `plan-omgang-6.md`).
18. **Namnet ska inte likna en övning i SvFF:s övningsbank.** Arbetsnamnen nedan är förslag. Övningsförfattaren kontrollerar och byter vid behov, som med `svansjakt-med-egen-boll` i omgång 5.

### 2.3 Spelövningar (O8-01 och O8-02)

Kolumnen *Yta* visar kvadratmeter per spelare vid `spelare.max` mot golvet och vid `spelare.min` mot taket. Kolumnen *Hål* citerar `tackning-2026-10-08-omgang-7.md` efter CI, eller uträkningen i avsnitt 0.

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O8-01 | Skattjakten | `del-spelovning` | `lek`, `bollkansla`, `dribbling` | 1–3 | 6–7 | `tva-lag`, 4–8 | 0 | 3, 5 | 5 / 7 / 8 | 14 × 10 = 140. 17,5 vid 8 (golv 15). 35 vid 4, 40 % över taket, därför 10 × 8 för 4–5 spelare (20 och 16). Tre grupper på kvarts plan: 17 × 13 × 3 = 663 | **Mest effekt i omgången.** `lek` och `bollkansla`, båda K, har ingen spelövning för 6–7 år: `3mot3` `del-spelovning` 47,5 % och `5mot5` 72,4 %, där hela andelen för 6–7 år är 100 %. Ger en andra spelövning för `dribbling` och tar bort den tomma Spelövningen för `dribbling`, `lek` och `snabbhet` i 60-minuterspass (avsnitt 0.4). `bollkansla -> ett-mot-ett` 17 001 |
| O8-02 | Först till bollen | `del-spelovning` | `snabbhet`, `ett-mot-ett`, `avslut` | 1–3 | 6–7 | `par`, trio vid udda antal | 0 | 3, 5 | 5 / 7 / 8 | 10 × 6 = 60. 30 per spelare, 20 % över taket, för startsträckan. Tio par på kvarts plan: 13 × 9 × 10 = 1 170 | `snabbhet` har ingen spelövning i `3mot3` och `5mot5`: 100 %. Den andra spelövningen för `avslut`, som tar bort den alltid tomma Spelövningen för `avslut` i 60-minuterspass (avsnitt 0.4). `snabbhet -> dribbling` 26 928, varav cirka 3 800 från 6–7 år |

**O8-01, Skattjakten.**
- *Form:* två lag med varsitt bo, en zon cirka 2 meter djup på var kortsida. I en konring mitt på ytan ligger skatten, ungefär en och en halv boll per spelare, högst 12. På signal hämtar alla en boll i taget ur skatten, driver den till sitt bo och stoppar den med foten där, och springer tillbaka efter nästa. Den som inte har boll får försöka vinna en motståndares boll på vägen. Vinner man den driver man den till sitt eget bo. När skatten är tom och alla bollar ligger i ett bo räknar lagen sina bollar, och en ny omgång börjar.
- *Varför Spelövning:* motståndare, riktning (det egna boet) och mål (boet). Leken är formen, och det som övas mest är att driva bollen med kontroll under press och att skydda den. Den är inte märkt `del-ovning` (F1).
- *Inga bon plundras* (F7). Bollar som ligger i ett bo får inte tas, och ingen får stå i något bo och vakta. Det gör att lagen går åt var sitt håll från skatten, så att mötande trafik bara uppstår när någon jagar en boll.
- *Omgångar:* ungefär 1–2 minuter. Lagen byter bo efter varje omgång. Efter halva tiden ändras regeln enligt nivån nedan.
- *Udda antal:* ett lag har en spelare mer, och en spelare byter lag mellan omgångarna. Ingen joker.
- *Mindre yta:* `organisation` ska säga att ytan görs ungefär 10 × 8 meter med fyra eller fem spelare. `yta` står kvar på 14 × 10, så att R-092 räknar med det största måttet (samma lösning som `forsvara-tillsammans`).
- *Nivå 1:* den som försöker vinna en boll får bara gå. *Nivå 3:* boet byts mot en konport en meter bred som bollen ska drivas igenom och stoppas bakom, och en omgång är högst 45 sekunder.
- *Säkerhet:* bara på bollen, ingen tar bollen bakifrån.
- Ytreferens: `ungefär en fjärdedel av stora planens straffområde` (165 kvadratmeter, 15 procent större än 140, och samma avlånga form).

**O8-02, Först till bollen.**
- *Form:* ett minimål mitt på varje kortsida. De två i paret står sida vid sida vid mitten av ena långsidan, ungefär en och en halv meter isär. Bollen ligger mitt på ytan. Den ena anfaller alltid det högra målet och den andra det vänstra. På signal springer båda till bollen. Den som når den först anfaller sitt mål, och den andra försvarar och anfaller sitt eget mål om hen vinner bollen. Duellen är slut vid mål, när bollen går ut eller efter ungefär 15 sekunder.
- *Starten är leken:* paret startar varje gång i ett nytt läge, till exempel stående, sittande, på mage, på huk som en groda eller med ryggen mot bollen. Det är där snabbheten och reaktionen övas.
- *Signal:* ledaren klappar för alla par på en gång, eller så räknar den som förlorade förra duellen "ett, två, tre". Övningen kräver ingen egen ledare per par.
- *Arbete och vila:* en duell är högst cirka 15 sekunder, och paret vilar cirka 30 sekunder medan bollen läggs tillbaka och nästa startläge väljs (regel 17).
- *Udda antal (R-058):* trion har en tredje spelare som väntar utanför den andra långsidan med en reservboll. Efter varje duell går hen in och tar över målet från den som har spelat två dueller i rad. Skriv det entydigt för den första duellen.
- *Varför sida vid sida* (F6): två barn som springer mot varandra mot samma boll krockar med huvudet först. Sida vid sida möts de med axlarna, i låg fart och på kort sträcka.
- *Nivå 1:* båda startar stående med blicken mot bollen, och den som kom sist väntar en sekund innan hen får försvara. *Nivå 3:* start med ryggen mot bollen, och anfallaren har högst åtta sekunder på sig att göra mål.
- *Skillnad mot `duell-mot-tva-smamal`:* där startar duellen med bollen hos en spelare och pågår i en minut. Här är det kapplöpningen till bollen och starten som är övningen, och duellen är kort.
- *Ingen ytreferens:* duell med startavstånd (`ytreferenser.md`, avsnitt 4).

### 2.4 Öva och uppvärmning (O8-03 till O8-06)

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O8-03 | Smuggla in bollen, 1 mot 1 | `del-ovning` | `ett-mot-ett`, `dribbling` | 1–3 | 6–7 | `par`, trio vid udda antal | 0 | 3, 5 | 5 / 7 / 8 | 9 × 6 = 54. 27 per spelare, 8 % över taket. Tio par på kvarts plan: 12 × 9 × 10 = 1 080 | `ett-mot-ett`, K, har en Öva-övning för 6–7 år och kan inte fylla Öva i 60-minuterspass: `3mot3` `del-ovning` 33,3 % och `5mot5` 24,4 %. Med `duell…` blir den paret med huvudträff i 60-minuterspass |
| O8-04 | Rensa trädgården | `del-uppvarmning`, `del-ovning` | `lek`, `passning-mottagning`, `bollkansla` | 1–3 | 6–7 | `fri`, 4–16, boll till alla | 0 | 3, 5 | 5 / 7 / 8 | 18 × 12 = 216, utan motståndare. 13,5 vid 16 (golv 8). Taket prövas inte. Ungefär 14 × 9 med färre än åtta. Två grupper på kvarts plan: 21 × 15 × 2 = 630 | `lek`, K, har en Öva-övning för 6–7 år: `3mot3` `del-ovning` 18,8 % och `5mot5` 53,6 %. `passning-mottagning` har ingen för fasen: 50,0 % och 28,6 %, hela andelen 6–7 år. Fasen har bara två uppvärmningar |
| O8-05 | Portpassning i par | `del-ovning` | `passning-mottagning`, `spelbarhet`, `bollkansla` | 1–3 | 6–7 | `fri`, 4–16, i par, trio vid udda antal | 0 | 3, 5 | 5 / 7 / 8 | 18 × 12 = 216, utan motståndare. 13,5 vid 16 (golv 8). Taket prövas: 12 × 9 = 108 för 4–7 spelare, 27 vid 4. Två grupper på kvarts plan: 630 | `spelbarhet` och `passning-mottagning` har ingen Öva för 6–7 år: `3mot3` 50,0 % och `5mot5` 28,6 %, hela andelen 6–7 år. Den andra Öva-övningen för `passning-mottagning`, som 60-minuterspass kräver |
| O8-06 | Färgjakten | `del-uppvarmning`, `del-ovning` | `snabbhet`, `koordination`, `dribbling` | 1–3 | 6–7 | `fri`, 4–16, egen boll | 0 | 3, 5 | 5 / 7 / 8 | 18 × 18 = 324, utan motståndare. 20,3 vid 16 (golv 8). Taket prövas inte. Ungefär 12 × 12 med färre än åtta. Två grupper på kvarts plan: 21 × 21 × 2 = 882 | `snabbhet` har ingen Öva i `3mot3` och `5mot5`: 0 övningar och 100 %. `snabbhet -> dribbling` 26 928. Den fjärde uppvärmningen |

**O8-03, Smuggla in bollen, 1 mot 1.**
- *Form:* på ena kortsidan är en hamn, en zon cirka 2 meter djup över hela bredden. Smugglaren startar med bollen mitt på den andra kortsidan, och tullaren startar på hamnens linje. Smugglaren ska driva in bollen i hamnen och stoppa den med sulan där. Vinner tullaren bollen driver hen den över smugglarens startlinje.
- *Rotation:* efter varje försök byter de roller. Smugglaren går till hamnens linje och blir tullare, och tullaren tar bollen och går till startlinjen. De går längs var sin långsida, så att de inte möts.
- *Udda antal (R-058):* den tredje väntar bakom startlinjen, utanför ytan, med en egen boll och startar som smugglare. Efter varje försök: smugglaren blir tullare, tullaren går ut och väntar, och den som väntade blir smugglare. Skriv det så att det är entydigt för 2 och 3.
- *Varför bara Öva* (F1): det är upprepningar med en motståndare som kan göras halvaktiv, och den ska aldrig ta en spelövning från Spelövning. Huvudfokus `ett-mot-ett` gör att O8-03 och `duell-mot-tva-smamal` blir paret med huvudträff i 60-minuterspass, och då är `hitta-den-fria-i-overlage` och O8-02 kvar för Spelövning.
- *Skillnad mot `driva-forbi-i-par` (8–9 år):* där ska bollen genom en port. Här är målet en hel zon, så att sexåringen alltid har en väg och bara behöver välja sida.
- *Nivå 1:* tullaren får bara gå och startar först när smugglaren har tagit sin första touch. *Nivå 3:* hamnen byts mot två konportar en meter breda i hörnen, och smugglaren har högst sex sekunder.
- *Ingen ytreferens:* duell med startavstånd.

**O8-04, Rensa trädgården.**
- *Form:* två lag i var sin halva. Mitt på ytan finns en fri zon, ungefär 2 meter på var sida om mittlinjen, markerad med koner, där ingen får stå. Alla har en boll från start. På signal passar alla bollar längs marken med insidan över till den andra halvan, för att rensa sin egen trädgård. En boll som kommer in i den egna halvan ska stoppas under foten innan den passas tillbaka. På "stopp" fryser alla, och lagen räknar bollarna i sin halva. Färst bollar vinner.
- *Varför `passning-mottagning`:* det som görs hela tiden är att stoppa en rullande boll och passa den med insidan. Huvudfokus är `lek`, så att O8-04 och `lek-med-egen-boll` blir paret med huvudträff i 60-minuterspass (regel 3).
- *Uppvärmning och Öva* (F8): i uppvärmningen räcker att passa med insidan och stoppa. I Öva läggs till att varannan passning ska slås med den fot man tycker är svårast och att bollen ska stoppas helt innan den passas.
- *Utan motståndare* (F5): ingen kan vinna någon annans boll, och alla har boll från start. Golvet 8 gäller och taket prövas inte, men `organisation` ska säga att ytan görs ungefär 14 × 9 meter, med samma fria zon, när gruppen är färre än åtta.
- *Udda antal:* ett lag har en spelare mer, och en spelare byter lag mellan omgångarna.
- *Omgångar:* ungefär en minut, och lagen byter halva efter varje omgång.
- *Nivå 1:* bollen får stoppas med händerna innan den passas. *Nivå 3:* tre konportar, en meter breda, står i den fria zonen, och en boll räknas bara som rensad om den går genom en port. Mottagningen ska föra bollen åt sidan, inte stoppa den död.
- *Säkerhet:* bara längs marken och med insidan, ingen står i den fria zonen, och bollar som stannar där hämtas först efter "stopp".
- Ytreferens: `stora planens målområde, dubbelt så djupt`.

**O8-05, Portpassning i par.**
- *Form:* sex till åtta konportar, ungefär 1,5 meter breda, står utspridda i ytan. Paret har en boll. Den ena passar genom en port till kompisen på andra sidan, kompisen tar emot, och båda letar upp en ny port. Samma port får inte användas två gånger i rad. Paret räknar hur många portar de hinner på en minut och försöker slå sitt eget rekord.
- *Varför `spelbarhet`:* den som ska ta emot måste hitta en fri port och ställa sig så att kompisen ser hen genom porten. Det är spelbarhet i sin enklaste form, utan motståndare, och det coachas med en fråga: "Var kan du stå så att kompisen kan passa dig?"
- *Udda antal:* en trio passar i tur och ordning, ett till två till tre till ett.
- *Taket prövas* (F5): en boll per par är inte egen boll. 216 kvadratmeter vid fyra spelare är 54 per spelare, långt över taket. `organisation` ska säga att ytan görs ungefär 12 × 9 meter med fyra portar när gruppen är färre än åtta: 27 vid fyra och 15,4 vid sju.
- *Nivå 1:* kompisen står stilla vid porten, och avståndet är 3–4 meter. *Nivå 3:* portarna en meter breda, bollen tas emot i rörelse åt sidan och passas vidare med högst två touchar.
- *Säkerhet:* inga hårda passningar, och man tittar upp efter andra par innan man passar.
- Ytreferens: `stora planens målområde, dubbelt så djupt`.

**O8-06, Färgjakten.**
- *Form:* åtta koner i fyra färger står längs sidorna, två av varje färg på motsatta sidor. Alla driver lugnt med egen boll inne i rutan. Ledaren ropar en färg, eller håller upp en kon i färgen. Alla driver så snabbt de kan till en kon i den färgen, runt den och tillbaka in i rutan, och fortsätter lugnt.
- *Koordination i starten:* före spurten intar alla ett startläge som ledaren visar, till exempel sitta på bollen, ligga på rygg bredvid den eller stå på ett ben med foten på bollen.
- *Arbete och vila* (regel 17): spurten tar 5–8 sekunder. Mellan signalerna driver alla lugnt i 20–30 sekunder.
- *Uppvärmning och Öva* (F8): i uppvärmningen få signaler och lugnt tempo. I Öva två färger i rad ("röd, sedan blå") och vändningen runt konen med sulan.
- *Mindre yta:* `organisation` ska säga att rutan görs ungefär 12 × 12 meter när gruppen är färre än åtta (egen boll, taket prövas inte).
- *Nivå 1:* en färg i taget och inget startläge. *Nivå 3:* signalen visas bara med en kon, inte med rop, och två färger i rad med vändning med sulan.
- *Säkerhet:* två koner per färg, så att inte alla möts vid samma kon, och alla rundar konen åt samma håll. Titta upp när du vänder.
- *Skillnad mot `lek-med-egen-boll`:* där är signalerna konster på stället. Här är det reaktion, spurt och vändning, och huvudfokus är `snabbhet`.
- Ytreferens: `en ruta som rymmer stora planens mittcirkel`.

### 2.5 Kontroll: vilka fokus kärnan fyller efter omgång 8

Efter omgången har fasen åtta Öva-övningar och fyra spelövningar. `duell-mot-tva-smamal` är den enda som har båda.

| Fokus | Öva (huvudfokus fetstilt) | Spelövning |
|---|---|---|
| `bollkansla` | `lek-med…`, **`bollkansla-och-driv…`**, `driv-och-skjut…`, O8-04, O8-05 | O8-01 |
| `dribbling` | `bollkansla-och-driv…`, **`driv-och-skjut…`**, `duell…`, O8-03, O8-06 | `duell…`, O8-01 |
| `avslut` | `driv-och-skjut…`, `duell…` | `duell…`, O8-02 |
| `ett-mot-ett` | **`duell…`**, **O8-03** | `duell…`, `hitta-den-fria…`, O8-02 |
| `koordination` | `lek-med…`, `bollkansla-och-driv…`, O8-06 | – (F3) |
| `lek` | **`lek-med…`**, **O8-04** | O8-01 |
| `passning-mottagning` | O8-04, **O8-05** | `hitta-den-fria…` |
| `spelbarhet` | O8-05 | `hitta-den-fria…` |
| `snabbhet` | **O8-06** | O8-02 |

Varje fokus som har en spelövning har nu en spelövning som Öva aldrig kan ta, och det är det som ger fylld kärna. Resultat per fokus och passlängd, med samma metod som i avsnitt 0.4:

| Fokus | 30 min | 45 min | 60 min |
|---|---|---|---|
| `bollkansla` | valt | valt | valt |
| `dribbling` | valt | valt | valt |
| `avslut` | valt | valt | valt (Öva tar `driv-och-skjut…` och `duell…`, Spelövning O8-02) |
| `ett-mot-ett` | valt | valt | valt |
| `koordination` | valt | fylld, ersättning `snabbhet` i Spelövning | fylld, ersättning `snabbhet` i Spelövning |
| `lek` | valt | valt | valt |
| `passning-mottagning` | valt | valt | valt |
| `spelbarhet` | valt | valt | fylld, ersättning `passning-mottagning` i Öva |
| `snabbhet` | valt | valt | fylld, ersättning `koordination` i Öva. Med B2: valt |

Fylld kärna: 27 av 27. Kärna på valt fokus: 23 av 27 = 85,2 procent, med B2 24 av 27 = 88,9 procent.

*Uppvärmningen i 60-minuterspass:* fasen har fyra uppvärmningar (`lek-med…`, `svansjakt…`, O8-04 och O8-06). Öva tar högst två, så två finns kvar, och två övningar om 5–8 minuter ryms i 9–15 minuter.

### 2.6 Prioritet om omgången behöver bli mindre

Planen föreslår 6 övningar. Om omgången ska bli mindre tas de bort i den här ordningen, med minst effekt först. Målen i 1.1 och 1.3 sänks då enligt tabellen. Målen för fylld kärna och inget pass gäller oförändrade så länge O8-01 och O8-02 är med.

| Övningar | Tas bort | Kärna på valt fokus, uträkning / mål | `3mot3` ersättning, uträkning / mål | Vad som går förlorat |
|---|---|---|---|---|
| 6 | – | 85,2 / **minst 70** | 27,8 / **högst 31** | – |
| 5 | O8-03 | 81,5 / minst 66 | 28,6 / högst 32 | `ett-mot-ett` i 60-minuterspass |
| 4 | O8-03, O8-06 | 74,1 / minst 60 | 30,2 / högst 33 | `snabbhet` i 30 och 45 minuter, och den fjärde uppvärmningen. Då ska B2 inte göras |
| 3 | O8-03, O8-06, O8-05 | 63,0 / minst 50 | 32,7 / högst 36 | `spelbarhet` i 30 och 45 och `passning-mottagning` i 60 minuter |

**O8-01, O8-02 och O8-04 ska alltid vara med.** O8-01 ensam ger `lek` och `bollkansla` en spelövning och tar bort de flesta tomma Spelövningarna. O8-02 tar bort resten. O8-04 är leken i Öva och den tredje uppvärmningen. I alla varianter gäller `5mot5`-målet 2 procentenheter över `3mot3`-målet och målet för hela banken räknas om som i 1.3.

## 3. Ändringar i godkända övningar: ger de mer än nya övningar?

Uppdraget ber mig pröva om ändringar i godkända övningar ger mer än nya. Jag har prövat de tre ändringar som skulle kunna påverka kärnan för 6–7 år, med samma metod som i avsnitt 0.4, både mot dagens bank och mot banken med de sex nya övningarna. Varje ändring är ett enda fält, `passdelar`, och en ny post i `granskning`.

### 3.1 Ä1: `duell-mot-tva-smamal` förlorar `del-ovning`

*Mot dagens bank:* fylld kärna går från cirka 87 till 100 procent, eftersom ingen övning längre kan tas av Öva från Spelövning. Men `ett-mot-ett` förlorar sin enda Öva-övning, så 30- och 45-minuterspass med `ett-mot-ett` får ersättning, och `avslut` i 60 minuter får ersättning i Öva. Kärna på valt fokus sjunker med cirka 3 procentenheter.

*Med de sex nya:* fylld kärna är redan 100 procent, och ändringen tar bort valt fokus för `ett-mot-ett` och `avslut` i 60-minuterspass, 2 av 27 fall, alltså **minus 7,4 procentenheter**.

*Slutsats:* ändringen är det billigaste sättet att höja fylld kärna, men det sker på bekostnad av kärna på valt fokus, och de nya övningarna gör samma sak utan förlust. **Jag avråder.**

### 3.2 Ä2: `hitta-den-fria-i-overlage` får `del-ovning`

F4 i `plan-omgang-5.md` tillåter det, eftersom övningen är ett överläge med riktning och mål. Men den är den enda spelövningen för `spelbarhet` och `passning-mottagning`. Med de sex nya väljer Öva i 60-minuterspass med `spelbarhet` paret O8-05 och `hitta-den-fria…`, och då står Spelövning tom. Med `passning-mottagning` innehåller två av tre möjliga par den. Fylld kärna sjunker med cirka 6 procentenheter. **Det är exakt B4-felet från omgång 7. Jag avråder.**

### 3.3 Ä3: `svansjakt-med-egen-boll` får `del-ovning` (beslut B2)

*Mot banken med de sex nya:* `snabbhet` får en andra Öva-övning, och 60-minuterspass med `snabbhet` får kärna på valt fokus (O8-06 och `svansjakt…` i Öva, O8-02 i Spelövning). Det är 1 av 27 fall, **plus 3,7 procentenheter** kärna på valt fokus och 2 × 288 färre ersättningar per spelform. `svansjakt…` är inte märkt `del-spelovning`, så ingen Spelövning kan bli tom.

*Risken är uppvärmningen.* Med ändringen är alla fyra uppvärmningar också Öva-övningar. Öva tar fortfarande högst två, så två finns kvar. Men utan O8-04 eller O8-06 har fasen bara tre uppvärmningar, och då kan Öva lämna en enda kvar, som inte räcker i 60-minuterspass. **Ändringen ska alltså bara göras om både O8-04 och O8-06 är med.**

*Fotbollsmässigt:* en jaktlek där alla driver egen boll och samtidigt ska se fångarna är bra Öva för `lek` och `snabbhet` i åldern. Inga andra fält behöver ändras. Yta, tid och text gäller som de är granskade.

*Mot dagens bank:* ändringen ger mindre, eftersom `snabbhet` saknar spelövning och `lek` i 60 minuter ändå får ersättning i Spelövning. Den ska därför inte göras före de nya övningarna.

### 3.4 Slutsats och ordning för commits

**De nya övningarna ger mer än ändringarna.** Bara Ä3 är värd att göra, och den ger lite. Ordningen i omgångens pull request:

1. Planen.
2. De sex nya övningarna, när de är granskade.
3. Raderna i `ytreferenser.md`, avsnitt 6, för de sex, när jag granskar dem.
4. **Om B2 godkänns:** Ä3 som en egen commit, med en ny post i `granskning` som säger vad som ändrats och varför. Skriptet körs efter commit 2 och efter commit 4, så att effekten av ändringen syns för sig (avsnitt 1.4).

## 4. Fotbollsfrågor som jag avgör

**F1. Ingen ny övning i omgången får både Öva och Spelövning.** F4 i `plan-omgang-5.md` tillåter det för dueller och överlägen, och det står kvar. Men generatorn fyller Öva först (R-048, post 2), och en övning kan bara finnas en gång i passet (R-070). När en sådan övning är den enda spelövningen för ett fokus blir Spelövning tom. Det hände med B4 i omgång 7 och händer i dag med `duell-mot-tva-smamal`. För en fas med en liten bank väger det tyngre än att en duell får två platser.

**F2. Huvudfokus väljs med avsikt.** Generatorn föredrar en uppsättning där alla övningar har huvudträff (R-042). Därför har O8-03 och `duell-mot-tva-smamal` båda `ett-mot-ett` först, och O8-04 och `lek-med-egen-boll` båda `lek` först. Då blir det rätta paret valt i 60-minuterspass, inte ett slumpat par som tar en övning från en annan del. Huvudfokus ska ändå alltid vara det som övas mest, och det är det i alla sex.

**F3. `koordination` får ingen spelövning för 6–7 år.** Samma bedömning som F5 i `plan-omgang-5.md` och `plan-omgang-7.md`: i en spelövning visar sig koordination som starter och riktningsändringar i en duell. Efter omgången går ersättningen till O8-02, där starten i olika lägen är just det.

**F4. `spelbarhet` får en Öva-övning i par, men ingen ny spelövning.** För 6–7 år är passningen något som kommer när det finns en fri kompis, inte huvudsaken (`aldrar-och-fokus.md`). Att ställa sig så att kompisen ser en genom en port är den enklaste formen av spelbarhet, och den passar åldern. Mer än så är för abstrakt.

**F5. Rensa trädgården och Portpassning räknas som övningar utan motståndare.** I ingen av dem kan någon vinna en annans boll. I Rensa trädgården har alla boll från start, så taket prövas inte. I Portpassning har paret en boll, och då prövas taket som vanligt, därav den mindre ytan för små grupper.

**F6. Först till bollen startar sida vid sida, aldrig mot varandra.** Två barn som springer mot samma boll från var sitt håll kan krocka med huvudena. Sida vid sida blir kontakten en axel mot en axel i låg fart.

**F7. Skattjakten har ingen plundring av motståndarnas bo.** Det är vanligt i den här sortens lek, men det ger mötande trafik och spelare som vaktar sitt bo i stället för att spela. Utan plundring går lagen åt var sitt håll, och alla är i rörelse hela tiden.

**F8. Rensa trädgården och Färgjakten får vara både Uppvärmning och Öva.** De är lekar med egen boll, som `lek-med-egen-boll` i paket A och F4 i `plan-omgang-7.md`. Fasen behöver fler uppvärmningar, eftersom 60-minuterspass kräver två och Öva i dag kan ta den ena av de två som finns.

**F9. `snabbhet` för 6–7 år bara i lek- och tävlingsform med boll** (`fokusomraden.md`). Spurterna är 5–15 sekunder med vila emellan, och ingen springer utan boll för att springa.

## 5. Beslut som behövs

**B1. Antalet övningar.** *Rekommendation:* alla 6. Om omgången ska bli mindre gäller ordningen i avsnitt 2.6, och O8-01, O8-02 och O8-04 ska alltid vara med.

**B2. `svansjakt-med-egen-boll` (6–7 år, godkänd) får `del-ovning`** (avsnitt 3.3). Inga andra fält ändras. Det ger 3,7 procentenheter mer kärna på valt fokus för 6–7 år och tar inte bort någon spelövning. *Rekommendation:* ja, som en egen commit efter att de sex nya övningarna är granskade, och bara om O8-04 och O8-06 är med. Skriptet körs före och efter (avsnitt 1.4). Målen i avsnitt 1 gäller utan den här ändringen.

**B3. Mätning av tom uppvärmning.** Täckningsskriptet mäter bara kärnan och "inget pass". Uppvärmningen kan stå tom av samma skäl som Spelövning, när Öva har tagit den övning uppvärmningen behöver (avsnitt 0.3, punkt 2). I dag händer det troligen i en stor del av 60-minuterspassen för 6–7 år, men det syns inte. *Rekommendation:* ja, en kolumn "Uppvärmning saknar övning" per cell i rapporten. Det är arbete för kvalitetssäkraren eller senior systemutvecklare. Det påverkar inte målen i den här planen.

## 6. Källor

| Källa | Använd för | Läst eller hämtad |
|---|---|---|
| `docs/doman/tackning-2026-10-08-omgang-7.md`, kolumnen *Efter CI* | Alla siffror om körfall, inget pass, fylld kärna, kärna på valt fokus, delar som inte kan fyllas och ersättningar | 2026-10-09 |
| `content/ovningar/*.yaml`, de sju övningarna för 6–7 år, grenen `omgang/8` | Ålder, spelformer, nivå, passdelar, fokus, spelare, grupptyp, ledarbehov, tid och yta | 2026-10-09 |
| `src/regelmotor/select/assemble.ts` (`buildSelection`), `select/fill.ts` (`rankKey`, `blockSets`), `score/improve.ts` och `keys.ts` (`PART_PRIORITY_ORDER`) | Hur generatorn fyller delarna i tur och ordning och väljer bland lika bra uppsättningar, som uträkningen i avsnitt 0.4 och 2.5 bygger på | 2026-10-09 |
| `scripts/tackning.ts` (`lengthSample`) och `scripts/tackning-celler.ts` (`PLAN_GOALS`) | Passlängderna 30, 45 och 60 och hur målen förs in | 2026-10-09 |
| `docs/doman/generatorregler.md`, `passuppbyggnad.md`, `fokusomraden.md`, `ytreferenser.md` | Måltider, tidstak, grupper, yta, golv och tak, K och R för fasen, ytreferenser | 2026-10-09 |
| SvFF, *Svensk fotbolls spelarutbildningsplan*, https://aktiva.svenskfotboll.se/tranare/spelarutbildning/spelarutbildningsplan/ | Planen gäller 6–19 år, bygger på FSLL och syftar till långsiktig utveckling och livslångt intresse. Innehållet i den digitala boken för 3 mot 3 går fortfarande inte att läsa via hämtning | 2026-10-09 |
| SvFF, *Nationella spelformer, 3 mot 3, 6–7 år*, spelformsbladet i Norrbottens FF:s återgivning, https://www.svenskfotboll.se/4902eb/globalassets/distrikt/norrbotten/blockbilderdokument/3.-tavling/barn--ungdom/spelformer/3mot3-20.pdf | Målsättningen med 3 mot 3: glädjefylld träning och match utifrån barnens behov, och många fotbollsaktioner för alla. Läst som sökresultatets sammanfattning. PDF:en är ett bilddokument som jag inte kunnat läsa som text, och den kan vara en äldre version än 2025 års spelformer | 2026-10-09 |
| SvFF:s nationella spelformer via `docs/doman/spelformer.md` (2025 års versioner) | Ingen målvakt i 3 mot 3, målstorlek, start efter utboll | hämtade 2026-09-11, lästa 2026-10-09 |
| SvFF:s spelarutbildningsplan och FSLL via `docs/doman/aldrar-och-fokus.md` | Fas 6–7: lek, bollkänsla, 1 mot 1, instruktion, koncentration och kö | hämtade 2026-09-11, lästa 2026-10-09 |

Övningarnas innehåll, måtten, målen och frågorna F1–F9 är min bedömning som tränarutbildare. Övningarna är allmänt kända former (skattjakt med boll, kapplöpning till bollen med duell, 1 mot 1 in i en zon, bollar över en mittlinje, passning genom portar i par, signallek med färger), och planen beskriver dem med egna ord. Ingen text är kopierad ur SvFF:s eller andras material.

**Inte kontrollerat:** beskrivningen av fas 6–7 i `aldrar-och-fokus.md` är fortfarande inte kontrollerad mot SvFF:s digitala bok för 3 mot 3. Det ska göras före lansering (K5). Den här planen lutar sig mer än tidigare planer på den beskrivningen, och om kontrollen visar skillnader kan övningarna behöva ses över.
