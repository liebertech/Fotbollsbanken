Status: utkast

# Plan för omgång 7 av övningsbanken: kärnan för 8–12 år

**Ägare:** fotbollsexpert · **Skriven:** 2026-10-08 · **Underlag:** `docs/doman/tackning-2026-10-08.md` (banken efter omgång 6 med R-086, frö `tackning-1`, kolumnen *Efter CI*), `plan-omgang-5.md` (avsnitt 1.5, 2.1, 4 och F1–F5), `plan-omgang-6.md` (avsnitt 2.1 och 5), `generatorregler.md` (R-002, R-018, R-031–R-035, R-044, R-050–R-058, R-070, R-086, R-091, R-092, R-101, R-121), `passuppbyggnad.md` (*Yta per spelare*), `aldrar-och-fokus.md`, `fokusomraden.md`, `spelformer.md`, `ytreferenser.md`, ADR 0012 (S-1) och ADR 0019, `scripts/tackning.ts` (urvalet av passlängder), `scripts/tackning-celler.ts` (`PLAN_GOALS`) och de 44 övningsfilerna för 8–12 år, lästa på grenen `omgang/7` 2026-10-08.

Planen är skriven så att övningsförfattaren kan skriva varje övning direkt ur tabellerna i avsnitt 2 och designreglerna i avsnitt 2.1. Alla procenttal som inte står i täckningsrapporten är mina egna uträkningar, och de redovisas så att de går att kontrollera. Målen är mål, inte prognoser. De prövas genom att täckningsskriptet körs om när omgången är granskad.

`plan-omgang-5.md` (avsnitt 4) lade både fördjupningen för 6–7 år och kärnhålen för 8–12 år i omgång 7. `plan-omgang-6.md` (avsnitt 5) och uppdraget för den här planen säger 8–12 år. Planen tar därför bara 8–12 år, och 6–7 år ska vara exakt oförändrat. Att fördjupningen för 6–7 år flyttas är ett beslut för användaren, se B2.

## 0. Läget efter omgång 6

### 0.1 Vad banken har för 8–12 år

- **8–9 år har 17 övningar**, alla från omgång 2 och 3: 3 uppvärmningar, 4 i Öva, 7 i Spelövning och 3 spel. Alla är märkta `3mot3`, `5mot5` och `7mot7` utom de fyra som har målvakt eller retreatlinje, som är märkta `5mot5` och `7mot7`.
- **10–12 år har 27 övningar**, från omgång 1 och 3: 5 uppvärmningar, 10 i Öva, 8 i Spelövning och 4 spel. Alla är märkta `5mot5`, `7mot7` och `9mot9` utom tre spel: `matchspel-7mot7-brett` och `malvaktsspel-i-smaspel` (bara `7mot7`) och `smaspel-fasta-situationer` (`7mot7`, `9mot9`).
- Ingen övning spänner över både 8–9 och 10–12 år.

Täckningsrapporten (`tackning-2026-10-08.md`, *Per cell i planen*, kolumnen *Efter CI*, som är läget när omgång 6 är godkänd):

| Cell | Typ | Körfall | Inget pass | Fylld kärna | Kärna på valt fokus |
|---|---|---|---|---|---|
| 8–9 år, 5 mot 5 | föreslagen | 25 102 | 0,3 % | 74,8 % | 25,5 % |
| 8–9 år, 3 mot 3 | granne | 25 102 | 2,3 % | 69,4 % | 22,6 % |
| 8–9 år, 7 mot 7 | granne | 25 102 | 0,3 % | 74,8 % | 25,5 % |
| 10–12 år, 7 mot 7 | föreslagen | 40 560 | 4,0 % | 73,9 % | 23,2 % |
| 10–12 år, 5 mot 5 | granne | 40 560 | 9,3 % | 73,9 % | 23,2 % |
| 10–12 år, 9 mot 9 | granne | 40 560 | 4,0 % | 73,9 % | 23,2 % |

Som jämförelse har 13–14 år i 9 mot 9 efter omgång 6 kärna på valt fokus 53,5 procent och 15–19 år 58,7 procent. 8–12 år är nu den del av banken där kärnan oftast fylls med ersättningsfokus.

Ersättningsfokus (R-121) per spelform efter CI: `3mot3` 53,2 %, `5mot5` 53,5 %, `7mot7` 51,3 %, `9mot9` 39,6 %, `11mot11` 31,6 %, hela banken 44,1 %. Målet om högst 40 procent för hela banken (`plan-omgang-5.md`, avsnitt 1.5) gäller efter den här omgången. De vanligaste ersättningarna efter CI är `lek -> dribbling` 29 634 gånger, `bollkansla -> dribbling` 18 846, `snabbhet -> dribbling` 18 618, `forsvarsspel -> ett-mot-ett` 16 915, `koordination -> ett-mot-ett` 15 885, `omstallning -> passning-mottagning` 12 768 och `speluppbyggnad -> passning-mottagning` 12 272. Alla utom de två sista kommer nästan bara från 6–12 år, eftersom omgång 6 har tagit bort dem för 13–19 år.

### 0.2 Måltiderna som styr 8–12 år

Täckningsskriptet prövar tre passlängder per fas: kortast, mitten avrundad till 5 minuter och längst (`scripts/tackning.ts`, `lengthSample`). Med R-031 och R-032 blir måltiderna:

| Fas | Pass | Avslutning + vatten | Aktiv tid | Uppvärmning | Öva | Spelövning | Spel |
|---|---|---|---|---|---|---|---|
| `fas-8-9` | 30 | 3 + 2 | 25 | 5 | 6 | 5 | 9 |
| `fas-8-9` | 55 | 3 + 6 | 46 | 9 | 11 | 9 | 17 |
| `fas-8-9` | 75 | 3 + 8 | 64 | 12 | **16** | 12 | **24** |
| `fas-10-12` | 30 | 3 + 2 | 25 | 5 | 5 | 6 | 9 |
| `fas-10-12` | 60 | 5 + 4 | 51 | 10 | 10 | 12 | 19 |
| `fas-10-12` | 90 | 5 + 8 | 77 | 15 | 15 | **19** | **28** |

Varje del får ligga inom ± 3 minuter (R-035), och en övning får vara högst 10 minuter i Uppvärmning, Öva och Spelövning för 8–9 år och 15 för 10–12 år, och högst 25 respektive 30 minuter i Spel (R-034). Tre följder, som är designkraven för omgången:

1. **Öva för 8–9 år i 75-minuterspass kräver två olika övningar.** Måltiden 16 ger 13–19 minuter, och ingen övning får vara mer än 10. Båda ska träffa samma fokus, valt eller ersättning (R-041), och de får inte vara samma övning (R-070). I dag har varje fokus i Öva för 8–9 år högst en egen övning, utom `passning-mottagning`. Därför står Öva tom eller fylls med `passning-mottagning` i nästan varje 75-minuterspass.
2. **Spelövning för 10–12 år i 90-minuterspass kräver två olika övningar.** Måltiden 19 ger 16–22 minuter, och ingen övning får vara mer än 15. I dag har `dribbling`, `passning-mottagning`, `forsvarsspel`, `omstallning` och `speluppbyggnad` högst en spelövning per nivå, och ingen alls för `niva-1`.
3. **Spel kräver en övning med längst minst 21 minuter för 8–9 år och minst 25 för 10–12 år i de längsta passen.** `litet-spel-till-smamal`, det enda spelet för 8–9 år i 3 mot 3, har längst 20. `matchspel-7mot7-litet-format`, det enda spelet för 10–12 år i 5 mot 5, har längst 20 och dessutom bara 8–9 spelare.

### 0.3 Varför det blir "inget pass" för 10–12 år

Ett pass skapas så snart Spel kan fyllas (R-101). Spelen för 10–12 år har minsta antal 8 eller 10. **Med 4 eller 6 spelare kan Spel aldrig fyllas för 10–12 år, i någon spelform.** I 5 mot 5 är det värre: där finns bara `matchspel-7mot7-litet-format`, 8–9 spelare och längst 20 minuter, eftersom ett 7 mot 7 inte får märkas 5 mot 5 (`plan-omgang-5.md`, F1 (c)). Det går bara att använda med 8 eller 16 spelare och inte i 90-minuterspass.

Rapportens tabell *Per spelform, passdel och fokusområde* bekräftar det. `del-spel` för `5mot5` och fokus `speluppbyggnad` gäller bara 8–12 år (4 320 körfall, fem årskullar) och kan inte fyllas i 51,7 procent. Räknat ur spelens spann blir 10–12 år i 5 mot 5 83,3 procent (bara 2 av 8 antal, och bara i 2 av 3 passlängder: 1 − 2/8 × 2/3) och 8–9 år 4,2 procent (bara 4 spelare i 75-minuterspass: 1/8 × 1/3). Sammanvägt (2 × 4,2 + 3 × 83,3) / 5 = 51,7, precis rapportens tal. På samma sätt kan `del-spel` för `3mot3` och samma fokus, som bara gäller 8–9 år (1 728 körfall), inte fyllas i 33,3 procent, alltså exakt alla 75-minuterspass.

"Inget pass" uppstår när också Öva och Spelövning står tomma. Det är därför 10–12 år i 5 mot 5 har 9,3 procent och de två andra cellerna 4,0.

### 0.4 Vad som saknas helt i kärnan

Räknat ur övningsfilerna, med de fokus som är K eller R för fasen (`fokusomraden.md`). K är fetstilt.

**8–9 år, Öva:** inga egna övningar alls för **`bollkansla`**, **`koordination`**, **`lek`**, `snabbhet`, `forsvarsspel`, `omstallning`, `speluppbyggnad` och `skadeforebyggande`. En övning var för **`avslut`**, **`dribbling`**, **`ett-mot-ett`**, **`spelbarhet`** (inte `niva-3`) och `malvaktsspel`. Rapporten för `5mot5` `del-ovning`, som också räknar 6–7 och 10–12 år: `bollkansla` 61,9 %, `koordination` 71,4 %, `lek` 81,0 %, `forsvarsspel` 60,0 % och `omstallning` 62,5 % kan inte fyllas för sig. För `3mot3`, där bara 8–9 år har `forsvarsspel`, `omstallning` och `speluppbyggnad`: 100 %.

**8–9 år, Spelövning:** ingen övning för **`lek`** och **`bollkansla`**, ingen för **`dribbling`** på `niva-1` och ingen för **`passning-mottagning`** på `niva-3`.

**10–12 år, Öva:** inga egna övningar för **`koordination`**, `fasta-situationer`, `snabbhet`, `lek` och `skadeforebyggande`. Ingen övning för **`avslut`**, **`forsvarsspel`** och **`omstallning`** på `niva-1`. Rapporten för `7mot7` `del-ovning`: `koordination` 0 övningar och 100 %, `fasta-situationer` 78,8 %, `omstallning` 70,4 %, `forsvarsspel` 63,2 %.

**10–12 år, Spelövning:** ingen övning på `niva-1` för **`dribbling`**, **`passning-mottagning`**, **`speluppbyggnad`**, **`forsvarsspel`** och **`omstallning`**, och ingen på `niva-3` för **`avslut`**. De två spelövningarna för `forsvarsspel` och `speluppbyggnad` är ledarstyrda och har fast storlek (`overtal-i-forsvar`, 5, och `spela-ut-bakifran`, 7). Rapporten för `7mot7` `del-spelovning`: `speluppbyggnad` 66,3 %, `forsvarsspel` 51,6 %, `omstallning` 50,6 %, `passning-mottagning` 50,0 %. För `5mot5`: 72,8 %, 64,7 %, 63,3 % och 39,5 %.

### 0.5 Vad som inte kan bli 100 procent

- **Kärna på valt fokus.** `koordination`, `snabbhet` och `skadeforebyggande` får inga spelövningar i den här omgången, och det är rätt: i en spelövning är koordination och snabbhet riktningsändringar och starter i en duell, och det täcks av ersättningen till `ett-mot-ett` (R-121). `fasta-situationer`, `lek` och `bollkansla` för 10–12 år får ingen spelövning heller, och `speluppbyggnad` för 8–9 år ingen Öva. Det är 4 av 14 fokus för 8–9 år och 6 av 15 för 10–12 år. Taket ligger därför nära 70 respektive 60 procent av de körfall där kärnan alls ryms.
- **Öva för 8–9 år i 75-minuterspass** kräver två övningar med samma fokus. För R-fokus som får en enda Öva-övning i omgången (`forsvarsspel`, `omstallning`) fylls Öva då med ersättning.
- **Inget pass för 8–9 år** har ingen strukturell botten av yta: 20 spelare × golvet 25 = 500 kvadratmeter ryms gott på kvarts plan. Resten av "inget pass" i 3 mot 3 beror på att spelet inte räcker i 75-minuterspass (0.3). Det löses billigast med beslut B3.

## 1. Mål

### 1.1 Mål per cell

Måtten är kolumnerna i rapportens tabell *Per cell i planen (åldersgrupp och spelform)*, räknade efter att omgång 7 är godkänd, eller efter CI-rättningen när omgångens övningar är granskade men inte godkända. "Fylld kärna" och "Kärna på valt fokus" avser kolumnerna "av alla körfall". Utgångsläget, kolumnen *Nu*, är *Efter CI* i `tackning-2026-10-08.md`, som är banken när omgång 6 är godkänd.

| Cell | Typ | Mått | Nu | Mål efter omgång 7 | Prövas som |
|---|---|---|---|---|---|
| 8–9 år, 5 mot 5 | föreslagen | Inget pass | 0,3 % | högst 0,3 % | `<= 0.3` |
| 8–9 år, 5 mot 5 | föreslagen | Fylld kärna | 74,8 % | minst 82 % | `>= 82.0` |
| 8–9 år, 5 mot 5 | föreslagen | Kärna på valt fokus | 25,5 % | minst 36 % | `>= 36.0` |
| 8–9 år, 7 mot 7 | granne | Inget pass | 0,3 % | högst 0,3 % | `<= 0.3` |
| 8–9 år, 7 mot 7 | granne | Fylld kärna | 74,8 % | minst 82 % | `>= 82.0` |
| 8–9 år, 7 mot 7 | granne | Kärna på valt fokus | 25,5 % | minst 36 % | `>= 36.0` |
| 8–9 år, 3 mot 3 | granne | Inget pass | 2,3 % | högst 2,3 % | `<= 2.3` |
| 8–9 år, 3 mot 3 | granne | Fylld kärna | 69,4 % | minst 77 % | `>= 77.0` |
| 8–9 år, 3 mot 3 | granne | Kärna på valt fokus | 22,6 % | minst 32 % | `>= 32.0` |
| 10–12 år, 7 mot 7 | föreslagen | Inget pass | 4,0 % | högst 0,5 % | `<= 0.5` |
| 10–12 år, 7 mot 7 | föreslagen | Fylld kärna | 73,9 % | minst 82 % | `>= 82.0` |
| 10–12 år, 7 mot 7 | föreslagen | Kärna på valt fokus | 23,2 % | minst 34 % | `>= 34.0` |
| 10–12 år, 5 mot 5 | granne | Inget pass | 9,3 % | högst 0,5 % | `<= 0.5` |
| 10–12 år, 5 mot 5 | granne | Fylld kärna | 73,9 % | minst 80 % | `>= 80.0` |
| 10–12 år, 5 mot 5 | granne | Kärna på valt fokus | 23,2 % | minst 33 % | `>= 33.0` |
| 10–12 år, 9 mot 9 | granne | Inget pass | 4,0 % | högst 0,5 % | `<= 0.5` |
| 10–12 år, 9 mot 9 | granne | Fylld kärna | 73,9 % | minst 82 % | `>= 82.0` |
| 10–12 år, 9 mot 9 | granne | Kärna på valt fokus | 23,2 % | minst 34 % | `>= 34.0` |
| 6–7 år, 3 mot 3 och 5 mot 5 | båda | alla tre | 0,0 / 85,7 / 33,9 % | **exakt oförändrat** | lika med *Efter CI* i `tackning-2026-10-08.md` |
| 13–14 år, 9 mot 9 och 11 mot 11 | båda | alla tre | 1,5 / 77,4 / 53,5 % | **exakt oförändrat** | lika med *Efter CI* |
| 13–14 år, 7 mot 7 | granne | alla tre | 2,8 / 75,5 / 44,6 % | **exakt oförändrat** | lika med *Efter CI* |
| 15–19 år, 11 mot 11 och 9 mot 9 | båda | alla tre | 1,0 / 89,5 / 58,7 % | **exakt oförändrat** | lika med *Efter CI* |

*Varför 6–7 år och 13–19 år ska vara exakt oförändrade:* ingen ny eller ändrad övning har en ålder under 8 eller över 12 (R-023). Om en siffra där ändras är det ett fel i skriptet eller i en fil, inte en effekt av omgången. Det gäller också om beslut B3 och B4 godkänns, eftersom de bara rör övningar för 8–9 och 10–12 år.

*Varför "inget pass" för 10–12 år kan gå till 0,5:* O7-06 är ett spel för 4–10 spelare, alla nivåer, utan ledarbehov, med en yta som ryms två gånger på kvarts plan och längst 30 minuter. Med det kan Spel fyllas för varje antal i svepet (4–10 i en grupp, 12–20 i två) och i varje passlängd, och då skapas alltid ett pass (R-101). Min uträkning ger 0,0 procent. Målet 0,5 ger plats åt fall jag inte kan räkna ut för hand.

*Varför "inget pass" för 8–9 år bara ska hållas:* omgången innehåller inget nytt spel för 8–9 år. Ingen ny övning kan göra en del omöjlig att fylla, eftersom *Delen kan fyllas* bara kräver att någon övning passar, så värdet kan inte stiga. Om beslut B3 godkänns blir min uträkning 0,0 procent i alla tre celler för 8–9 år.

*Varför 8–9 år i 5 mot 5 och i 7 mot 7 har samma mål:* alla övningar för 8–9 år som är märkta `5mot5` är också märkta `7mot7`, och tvärtom, och det ska gälla också de nya. Cellerna är i dag lika på alla tre mått. **Om de skiljer sig efter omgången är en övning fel märkt.** Det är en billig kontroll.

*Varför 10–12 år i 5 mot 5 har lägre mål för fylld kärna:* de spelövningar som R-121 faller tillbaka på är märkta 5, 7 och 9 mot 9, men 5 mot 5 får aldrig `matchspel-7mot7-brett` och `smaspel-fasta-situationer` i Spel. Med O7-06 skapas passet ändå, men i 5 mot 5 kommer fler av de pass som tidigare var "inget pass" att ha bara spel, och de räknas som ofylld kärna.

### 1.2 Mål per spelform och del

Måttet är kolumnen "Kan inte fyllas för sig" i rapportens tabell *Per spelform, passdel och fokusområde*, efter CI. Tabellerna blandar åldrar: `3mot3` räknar 6–7 och 8–9 år, `5mot5` räknar 6–12 år, `7mot7` räknar 8–14 år. Målen tar hänsyn till de delar som omgången inte berör. Uträkningen per rad står i kolumnen *Varför*.

| Spelform | Del | Fokus | Nu | Mål | Övningar | Varför |
|---|---|---|---|---|---|---|
| `5mot5` | `del-spel` | alla | 36,9 % | högst 3 % | O7-06 | 6–7 år 0 %, 10–12 år går från 83 till 0 %. Kvar blir 8–9 år med 4 spelare i 75-minuterspass, 4,2 % av två av sju årskullar = 1,2 %. Med B3: 0 % |
| `7mot7` | `del-spel` | alla | 18,4 % | högst 8 % | O7-06 | 10–12 år går från cirka 29 till 0 % |
| `3mot3` | `del-spel` | alla | 16,7 % | högst 16,7 % | – | Ingen ändring utan B3. Med B3: 0 % |
| `5mot5` | `del-ovning` | `bollkansla` | 61,9 % | högst 20 % | O7-01, O7-02, O7-03 | 8–9 år från 100 %, 10–12 år från cirka 78 % |
| `5mot5` | `del-ovning` | `koordination` | 71,4 % | högst 20 % | O7-02, O7-03 | 8–9 och 10–12 år från 100 % |
| `5mot5` | `del-ovning` | `lek` | 81,0 % | högst 60 % | O7-01, O7-02 | `lek` för 10–12 år får inget i Öva och ligger kvar på 100 % |
| `5mot5` | `del-ovning` | `forsvarsspel`, `omstallning` | 60,0 / 62,5 % | högst 35 % | O7-05, O7-12 | 8–9 år har en övning och kan inte fylla 75-minuterspass |
| `5mot5` | `del-ovning` | `fasta-situationer` | 100 % | högst 20 % | O7-10 | Bara 10–12 år |
| `7mot7` | `del-ovning` | `koordination` | 100 % | högst 30 % | O7-02, O7-03 | 13–14 år, cirka 21 % av körfallen, har ingen och ligger kvar |
| `7mot7` | `del-ovning` | `fasta-situationer` | 78,8 % | högst 30 % | O7-10 | |
| `3mot3` | `del-ovning` | `forsvarsspel`, `omstallning` | 100 % | högst 40 % | O7-05 | En övning räcker inte i 75-minuterspass, alltså minst 33 % |
| `3mot3` | `del-ovning` | `spelbarhet` | 77,8 % | högst 45 % | O7-04, O7-05 | |
| `5mot5` | `del-spelovning` | `speluppbyggnad` | 72,8 % | högst 40 % | O7-07, O7-09 | 8–9 år har ingen på `niva-1` och ligger kvar högt |
| `5mot5` | `del-spelovning` | `forsvarsspel`, `omstallning` | 64,7 / 63,3 % | högst 35 % | O7-05, O7-06, O7-12 | |
| `5mot5` | `del-spelovning` | `dribbling`, `passning-mottagning` | 36,8 / 39,5 % | högst 25 % | O7-01, O7-07, O7-08, O7-09 | |
| `7mot7` | `del-spelovning` | `speluppbyggnad` | 66,3 % | högst 40 % | O7-07, O7-09 | |
| `7mot7` | `del-spelovning` | `forsvarsspel`, `omstallning`, `passning-mottagning` | 51,6 / 50,6 / 50,0 % | högst 35 % | O7-05, O7-06, O7-07, O7-09, O7-12 | |

### 1.3 Ersättningsfokus

Rapportens tabell *Ersättningsfokus (R-121)* per spelform:

| Spelform | Nu | Mål efter omgång 7 | Varför |
|---|---|---|---|
| `3mot3` | 53,2 % | högst 48 % | 6–7 år ändras inte |
| `5mot5` | 53,5 % | högst 44 % | 6–7 år ändras inte |
| `7mot7` | 51,3 % | högst 42 % | 13–14 år ändras inte |
| `9mot9` | 39,6 % | högst 37 % | 10–12 år är ungefär 30 % av körfallen i spelformen |
| `11mot11` | 31,6 % | **exakt oförändrat** | Ingen övning i omgången gäller 11 mot 11 |
| Hela banken | 44,1 % | **högst 40 %** | Målet i `plan-omgang-5.md`, avsnitt 1.5 |

*Kontroll av målet för hela banken:* om varje spelform når sitt mål precis, med rapportens antal fyllda kärnmoment, blir det 62 640 × 0,48 + 127 110 × 0,44 + 142 048 × 0,42 + 209 850 × 0,37 + 46 329 = 269 629 ersättningar av 688 372, alltså 39,2 procent. Målet för hela banken följer alltså av målen per spelform.

*Det här är omgångens osäkraste mål.* Omgång 6 sänkte `11mot11` med 20 procentenheter, men 8–12 år har fler fokus att välja bland och två faser att dela övningarna på. Om målet inte nås är nästa steg fördjupningen för 6–7 år (B2), som står för en stor del av `3mot3` och `5mot5`.

### 1.4 Om mätningen

- Målen i 1.1 ska föras in i `PLAN_GOALS` i `scripts/tackning-celler.ts` på samma sätt som målen för omgång 6, alltså ett nytt fält, till exempel `omgang7`, med "högst" för inget pass och "minst" för de två andra måtten i cellerna för 8–12 år, och "oförändrat" med värdena ur *Efter CI* i `tackning-2026-10-08.md` för 6–7 år och 13–19 år. Det är arbete för kvalitetssäkraren eller senior systemutvecklare, inte för mig.
- Målen i 1.2 och 1.3 prövas för hand mot rapportens tabeller. Skriptet behöver inte ändras för dem.
- Om beslut B3 eller B4 godkänns ska skriptet köras både före och efter de ändringarna, så att effekten av de nya övningarna och effekten av ändringarna i godkända filer går att skilja åt.
- Kontrollen i 1.1 att 8–9 år i 5 mot 5 och i 7 mot 7 är lika görs för hand mot rapporten.

## 2. Övningarna i omgång 7

### 2.1 Designregler för alla övningar i omgången

Reglerna gäller utöver designreglerna i `plan-omgang-5.md`, avsnitt 2.1 (brett spelarspann, ledarbehov 0 där det är rätt, nivå 1–3 när varianterna bär det, planskiss och ytreferens), och planskiss- och textreglerna 10–20 i `plan-omgang-6.md`, avsnitt 2.1, som gäller för alla åldrar. Varje regel nedan kommer ur en orsak i avsnitt 0.

**Ålder** (orsak: golv och tak, se F1):

1. **Övningar med motståndare gäller antingen 8–9 eller 10–12 år, aldrig båda.** Golvet för 10–12 år, 45 kvadratmeter per spelare, är lika med taket för 8–9 år. Ingen yta kan klara båda. Det är samma skäl som gjorde att paket A i omgång 5 gäller 6–7 år och inte 6–9.
2. **En övning där alla har egen boll och ingen motståndare finns får gälla 8–12 år.** Golvet är då det strängaste, 15 kvadratmeter (10–12 år), och taket prövas inte (`passuppbyggnad.md`, tillägget 2026-10-07). O7-03 är den enda sådana i omgången.

**Tid** (orsak: avsnitt 0.2):

3. **8–9 år, Öva och Spelövning:** `tid.kortast` 5 och `tid.langst` 10. Med kortast 5 kan två övningar kombineras till 13–19 minuter i 75-minuterspass (till exempel 5 + 8 eller 8 + 10), och med 5 ryms övningen i 30-minuterspass, där Spelövning är 5 minuter (2–8).
4. **10–12 år, Öva och Spelövning:** `tid.kortast` högst 6 och `tid.langst` 15. Längst 15 gör att en enda övning fyller Öva i 90-minuterspass (12–18). I Spelövning behövs två, 16–22 minuter, och kortast 6 gör det lätt att kombinera.
5. **10–12 år, Spel:** O7-06 har `tid.langst` 30, som är taket i R-034, och kortast 8. Måltiden för Spel är 9 minuter vid 30, 19 vid 60 och 28 vid 90 minuter. Övningen ska beskriva hur den håller i 30 minuter: perioder om 4–5 minuter med en kort vila och vattenpaus emellan, och ett regelbyte efter halva tiden. Koncentrationen räcker 10–15 minuter i samma form för fasen (`aldrar-och-fokus.md`), så formen ska ändras under tiden.

**Antal och nivå** (orsak: avsnitt 0.4):

6. **Spelarspannet:** `spelare.min` högst 4 där övningens form tillåter det, och `spelare.max` minst 2 × `spelare.min` − 1 för `fri` och `tva-lag`. Övningar med fast storlek har en lösning för udda antal (R-058).
7. **Ledarbehov 0** i alla övningar. Ingen övning i omgången behöver en ledare per grupp.
8. **Nivå 1–3** i alla övningar, med en lättare variant som verkligen gör övningen användbar för `niva-1` och en svårare som gör något av det `nivaer.md` beskriver för nivå 3 (designregel 19 i `plan-omgang-6.md`). `niva-1` är den nivå som saknar mest i kärnan för båda faserna.
9. **Två passdelar** bara enligt F4 i `plan-omgang-5.md`: dueller och överlägen med riktning och mål får vara både Öva och Spelövning, och ett spel får vara både Spelövning och Spel om grundformen har en regel som gör att fokuset händer ofta. Lekar med egen boll får vara både Uppvärmning och Öva, som `lek-med-egen-boll` i paket A.

**Spelformer:**

10. **8–9 år:** `3mot3`, `5mot5` och `7mot7`. Ingen ny övning för 8–9 år har målvakt, så alla får `3mot3`. Regeln håller 5 mot 5 och 7 mot 7 lika (avsnitt 1.1).
11. **10–12 år:** `5mot5`, `7mot7` och `9mot9`. Ingen övning får bygga på retreatlinjen, offside eller inspark (F1 (b) i `plan-omgang-5.md`). En regel som att pressarna startar bakom en linje är övningens egen regel och kan gälla i alla tre.
12. **Mål:** ett mål med målvakt för 10–12 år anges med `storlek: eget` och `bredd: 5`, och `material` säger `7 mot 7-mål, 5 x 2 meter, eller 5 mot 5-mål`. Annars ritas ett 9 mot 9-mål i 9 mot 9 (ADR 0019, punkt 1, och designregel 9 i `plan-omgang-6.md`). För 8–9 år används bara `smamal` eller `minimal`.

**Yta** (`passuppbyggnad.md`, *Yta per spelare*):

13. **Golv och tak.** 8–9 år: golv 25 med motståndare och 10 utan, tak 45. 10–12 år: golv 45 med motståndare och 15 utan, tak 107. Golvet räknas på `spelare.max`, taket på `spelare.min`. Taket får överskridas med högst ungefär hälften när spannet kräver det, och då ska skälet stå i `organisation`.
14. **Minst 5 procent över golvet**, så att `spelare.max` inte sitter fast på golvet (designregel 6 i `plan-omgang-6.md`). Måtten i tabellerna är räknade så.
15. **Kvarts plan.** Varje övnings yta ska rymmas på kvarts plan, 52 × 32 meter, för det antal grupper som 20 spelare ger, om inget annat står i tabellen. Två grupper ryms om varje grupp med 3 meters marginal är högst 832 kvadratmeter (R-092).
16. **Gemensamma ytor.** O7-06 och O7-08 delar ytan **30 × 16 meter**. O7-07, O7-09 och O7-12 delar **28 × 18 meter**. Då kan Öva, Spelövning och Spel i samma pass använda samma koner. Ändra inte måtten utan att räkna om golv, tak och kvarts plan.

**Text och säkerhet:**

17. **Kön** är högst 2–3 per boll eller mål för 8–9 år och 3–4 för 10–12 år (`aldrar-och-fokus.md`), och står utanför ytan och aldrig i en skottlinje.
18. **Ingen nickning** (R-080). Fasta situationer för 10–12 år slås längs marken eller till en spelare som tar emot (`aldrar-och-fokus.md`, *Nickning*).
19. **Skott mot målvakt** för 10–12 år tas från minst 10 meter, som i `avslut-efter-inspel`. Den som står i mål gör det frivilligt och har handskar om laget har. 8–9 år skjuter bara mot småmål utan målvakt i den här omgången.
20. **Jakt- och kull-lekar:** man spelar bara på bollen, aldrig mot ben, och ingen åker ut och står still. Den som tappar bollen byter roll i stället.

### 2.2 8–9 år (O7-01 till O7-05)

Kolumnen *Yta* visar kvadratmeter per spelare vid `spelare.max` (mot golvet) och vid `spelare.min` (mot taket). Kolumnen *Hål* citerar `tackning-2026-10-08.md`, efter CI, eller räkningen i avsnitt 0.

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O7-01 | Hajen, jaktlek med boll över havet | `del-ovning`, `del-spelovning` | `lek`, `dribbling`, `bollkansla` | 1–3 | 8–9 | `fri`, 6–12 | 0 | 3, 5, 7 | 5 / 8 / 10 | 22 × 15 = 330. 27,5 vid 12 (golv 25). 55 vid 6, 22 % över taket 45. Två grupper på kvarts plan: 25 × 18 × 2 = 900 | `lek`, K i fasen, har ingen spelövning i hela banken: `5mot5` `del-spelovning` `lek` 0 övningar och 100 %. `lek -> dribbling` är den vanligaste ersättningen, 29 634 gånger. `dribbling` saknar spelövning på `niva-1` |
| O7-02 | Trafikljuset med egen boll | `del-uppvarmning`, `del-ovning` | `lek`, `bollkansla`, `koordination` | 1–3 | 8–9 | `fri`, 4–16, egen boll | 0 | 3, 5, 7 | 5 / 8 / 10 | 20 × 20 = 400. 25 vid 16 (golv 10 utan motståndare). Taket prövas inte (egen boll). Mindre yta för små grupper, se nedan | `bollkansla`, `koordination` och `lek`, alla K, har ingen Öva för 8–9 år. `5mot5` `del-ovning`: 61,9, 71,4 och 81,0 %. `bollkansla -> dribbling` 18 846 gånger |
| O7-03 | Följ John med boll i par | `del-uppvarmning`, `del-ovning` | `koordination`, `bollkansla`, `dribbling` | 1–3 | **8–12** | `par`, egen boll | 0 | 3, 5, 7, 9 | 5 / 8 / 12 | 9 × 9 per par = 81. 40,5 per spelare, 27 i en trio (golv 15 utan motståndare för 10–12 år). Tio par på kvarts plan: 12 × 12 × 10 = 1 440 | `koordination` är K i båda faserna och har ingen Öva: `7mot7` `del-ovning` 0 övningar och 100 %. `koordination -> ett-mot-ett` 15 885 gånger. Längst 12 gör att den ensam fyller Öva i 90-minuterspass för 10–12 år |
| O7-04 | Vägg och avslut på småmål | `del-ovning` | `avslut`, `spelbarhet`, `passning-mottagning` | 1–3 | 8–9 | `fri`, 4–7 | 0 | 3, 5, 7 | 5 / 8 / 10 | 16 × 12 = 192, utan motståndare. 27,4 vid 7 (golv 10). 48 vid 4, 7 % över 45. Tre grupper på kvarts plan: 19 × 15 × 3 = 855 | `avslut` har en Öva för 8–9 år och `spelbarhet` en som inte gäller `niva-3`. `3mot3` `del-ovning` `spelbarhet` 77,8 %. I 75-minuterspass behövs två |
| O7-05 | Två mot en med kontring | `del-ovning`, `del-spelovning` | `omstallning`, `forsvarsspel`, `spelbarhet` | 1–3 | 8–9 | `fast-storlek` 3, lösning för udda antal | 0 | 3, 5, 7 | 5 / 8 / 10 | 14 × 10 = 140. 35 vid 4 (golv 25). 46,7 vid 3, 4 % över 45. Sex grupper på kvarts plan: 17 × 13 × 6 = 1 326 | `forsvarsspel` och `omstallning` i Öva: 0 övningar för 8–9 år, 100 % i `3mot3`, 60,0 och 62,5 % i `5mot5`. I Spelövning finns ingen på `niva-1`. `forsvarsspel -> ett-mot-ett` 16 915 gånger |

**O7-01, Hajen.**
- *Form:* fiskarna har varsin boll och står på ena kortsidan. Två hajar utan boll står i mitten. På signal ska fiskarna driva bollen över ytan till den andra kortsidan, och hajarna försöker peta ut bollarna ur ytan. Den som tappar sin boll lägger den vid sidan och blir haj. När två fiskar är kvar börjar en ny omgång med två nya hajar, i tur och ordning, så att alla får vara haj (regel 20, och regel 15 i `plan-omgang-6.md`).
- *Riktning och mål:* fiskarna ska över till andra sidan, hajarna ska vinna bollen. Därför får övningen både Öva och Spelövning (regel 9). Generatorn lägger den aldrig i båda delarna i samma pass (R-070).
- *Taket:* 55 kvadratmeter vid 6 spelare är 22 procent över taket. Det är en jaktlek, och där prövas taket (`passuppbyggnad.md`), men med två hajar och fyra fiskar behöver fiskarna yta att välja väg i. Skriv det i `organisation`. Med fler än tolv bygger generatorn en andra yta.
- *Nivå 3:* tre hajar, eller att fisken ska göra en vändning i en målzon innan den får driva tillbaka.
- *Säkerhet:* hajarna spelar bara på bollen, ingen tacklar bakifrån. Coachningspunkt till fiskarna: titta upp och välj luckan.
- Ytreferens: `ungefär halva stora planens straffområde`.

**O7-02, Trafikljuset.**
- *Form:* alla har egen boll och driver fritt i rutan. Ledaren visar eller ropar signaler: grönt betyder driva i fart, gult betyder driva med sulan, rött betyder stoppa bollen och stå på ett ben med foten på bollen. Lägg till signaler som tränar koordination: "rondell" (gå runt bollen med foten på den), "farthinder" (hoppa jämfota över bollen och landa mjukt) och "backa" (dra bollen bakåt med sulan).
- *Lek i Öva:* `lek` är K för 8–9 år, och leken är formen för att få många bollkontakter med båda fötterna. I Öva läggs fler och svårare signaler till efter några minuter, så att det blir övning och inte bara uppvärmning.
- *Mindre yta:* `organisation` ska säga att rutan görs ungefär 12 × 12 meter när gruppen är färre än åtta, så att spelarna måste titta upp (`passuppbyggnad.md`, *Över taket*, egen boll).
- *Ledarbehov 0:* ledaren ger signaler, men en ledare kan ge signaler till två rutor bredvid varandra, som i `fyra-horn-med-boll`.
- *Nivå 3:* signalen visas bara med en färgad kon eller handrörelse, inte med rop, och spelaren ska byta fot vid varje signal.
- Ytreferens: `en ruta något större än stora planens mittcirkel`.

**O7-03, Följ John med boll i par.**
- *Form:* båda i paret har egen boll. Den ena leder och gör rörelser med bollen: vändningar, sulan, hopp över bollen, byta fot, stanna och starta. Den andra följer efter och härmar. Byt ledare efter ungefär 45 sekunder. Steg två: "spegeln", där paret står mittemot varandra och den ena härmar den andra spegelvänt.
- *Varför 8–12 år:* alla har egen boll och det finns ingen motståndare (regel 2). `koordination` är K i båda faserna, `bollkansla` K för 8–9 och R för 10–12, `dribbling` K i båda (R-002).
- *Varianter som täcker åldersspannet:* lättare för 8-åringar: ledaren i paret gör bara en rörelse i taget i gångtempo. Svårare för 11–12-åringar och nivå 3: följaren ska göra rörelsen med den andra foten, och paret lägger till en riktningsändring i full fart.
- *Trio vid udda antal (R-058):* den tredje följer den andra, så att det blir en kedja. Ledarrollen går vidare ett steg efter varje byte. Etikett för kön behövs inte, eftersom ingen väntar.
- *Tid:* längst 12 minuter. Generatorn kapar själv vid 10 för 8–9 år (R-034). Övningen ska beskriva tre steg om ungefär fyra minuter.
- *Ingen ytreferens:* för liten för någon plandel (`ytreferenser.md`, avsnitt 4).

**O7-04, Vägg och avslut på småmål.**
- *Form:* ett småmål i varje ände av ytan och en väggspelare i mitten. Skytten driver från ena kortsidan, spelar en vägg med väggspelaren, tar emot i rörelse och skjuter på målet i motsatta änden. Nästa skytt startar från andra kortsidan när den förra har skjutit.
- *Rotation (regel 15 i `plan-omgang-6.md`):* skytten blir väggspelare, väggspelaren hämtar bollen och ställer sig sist i kön i den ände där bollen är. Med 6 och 7 spelare finns två väggspelare, en på var sida, och skytten väljer vilken. Skriv rotationen för varje antal 4–7.
- *Kö:* högst två per ände (regel 17).
- *Utan motståndare:* golvet 10 gäller. Väggspelaren är medspelare, inte motståndare.
- *Varför `spelbarhet`:* väggspelaren ska röra sig till en fri vinkel innan passningen kommer, och det är det som coachas.
- *Nivå 3:* väggen spelas direkt och skottet tas på högst två touchar.
- Ytreferens: `ungefär stora planens målområde, dubbelt så djupt`.

**O7-05, Två mot en med kontring.**
- *Form:* två anfallare startar vid ena kortsidan och anfaller ett småmål i den andra. Försvararen startar framför målet. Vinner försvararen bollen ska hen driva den över anfallarnas startlinje, och anfallarna ska vinna tillbaka den inom fem sekunder.
- *Rotation och udda antal:* efter varje försök blir försvararen anfallare, den anfallare som gjorde mål eller tappade bollen blir försvarare, och den andra anfallaren står kvar. Med fyra i gruppen väntar den fjärde vid startlinjen, utanför ytan, och går in som anfallare i stället för den som blir försvarare. Skriv det så att det är entydigt för 3 och 4.
- *Två passdelar:* överläge med riktning och mål (regel 9).
- *Varför `spelbarhet`:* anfallaren utan boll ska ställa sig så att passningen förbi försvararen är möjlig. Det ger `spelbarhet` på `niva-3` i Öva, som saknas.
- *Nivå 1:* försvararen får bara gå tills den första passningen är spelad. *Nivå 3:* tre sekunder för anfallarna att avsluta, och kontringen ska gå till ett av två småmål i stället för över en linje.
- Ytreferens: `ungefär en fjärdedel av stora planens straffområde`.

### 2.3 10–12 år, spel och spelövningar (O7-06 till O7-09)

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O7-06 | Smålagsspel med omställningsregel, 2 mot 2 till 5 mot 5 | `del-spelovning`, `del-spel` | `omstallning`, `forsvarsspel`, `avslut` | 1–3 | 10–12 | `tva-lag`, 4–10 | 0 | 5, 7, 9 | 8 / 15 / 30 | 30 × 16 = 480. 48 vid 10 (golv 45). 120 vid 4, 12 % över 107. Två grupper på kvarts plan: 33 × 19 × 2 = 1 254 | **Mest effekt i omgången.** Spel kan inte fyllas med 4 eller 6 spelare för 10–12 år i någon spelform, och i 5 mot 5 i 83 % av körfallen (avsnitt 0.3). `5mot5` `del-spel` 36,9 % och `7mot7` 18,4 %. `omstallning` och `forsvarsspel` har ingen spelövning på `niva-1` |
| O7-07 | Spela ut från målvakten mot press | `del-spelovning` | `speluppbyggnad`, `passning-mottagning`, `spelbarhet` | 1–3 | 10–12 | `tva-lag`, 5–10, med målvakt | 0 | 5, 7, 9 | 6 / 12 / 15 | 28 × 18 = 504. 50,4 vid 10. 100,8 vid 5. Två grupper på kvarts plan: 31 × 21 × 2 = 1 302 | `speluppbyggnad` i Spelövning: `7mot7` 66,3 %, `5mot5` 72,8 %. Den enda spelövningen för 10–12 år är ledarstyrd, har fast storlek 7 och gäller inte `niva-1`. `speluppbyggnad -> passning-mottagning` 12 272 gånger |
| O7-08 | Driv in eller gör mål | `del-spelovning` | `dribbling`, `ett-mot-ett`, `avslut` | 1–3 | 10–12 | `tva-lag`, 4–8 | 0 | 5, 7, 9 | 6 / 12 / 15 | 30 × 16 = 480. 60 vid 8. 120 vid 4, 12 % över. Två grupper på kvarts plan (16 spelare): 1 254. Tre grupper (20 spelare) ryms inte | `dribbling` har en spelövning för 10–12 år och ingen på `niva-1`. `avslut` har ingen på `niva-3`. `5mot5` `del-spelovning` `dribbling` 36,8 % |
| O7-09 | Spela genom portarna framåt | `del-spelovning` | `passning-mottagning`, `speluppbyggnad`, `spelbarhet` | 1–3 | 10–12 | `tva-lag`, 4–10 | 0 | 5, 7, 9 | 6 / 12 / 15 | 28 × 18 = 504. 50,4 vid 10. 126 vid 4, 18 % över. Två grupper på kvarts plan: 1 302 | `passning-mottagning` har en spelövning för 10–12 år och ingen på `niva-1`. `7mot7` `del-spelovning` 50,0 %, `5mot5` 39,5 %. Den andra övningen för `speluppbyggnad`, som 90-minuterspass kräver |

**O7-06, smålagsspel med omställningsregel.**
- *Form:* två lag, ett småmål i varje ände, utan målvakt. Mål inom åtta sekunder efter en bollvinst räknas dubbelt. Det är regeln som gör att omställningen händer ofta, och den gör att övningen får både Spelövning och Spel (regel 9).
- *Lagstorlek:* 4 spelare ger 2 mot 2, 10 ger 5 mot 5. Vid udda antal spelar ett lag med en spelare mer, och det byts efter varje period. Ingen joker, eftersom en joker suddar ut vem som ska försvara efter bolltapp.
- *Varför spelformerna 5, 7 och 9:* spelet är som störst 5 mot 5, och ett spel får märkas med spelformer som är lika stora eller större (F1 (c) i `plan-omgang-5.md`).
- *Perioder (regel 5):* 4–5 minuter spel och 1 minuts vila. I 30 minuter byts regeln efter halva tiden: då räknas mål efter bollvinst bara om laget har vunnit bollen på motståndarnas planhalva, så att försvaret övar att pressa högt tillsammans.
- *Nivå 1:* sex sekunder i stället för åtta, och laget som tappar bollen får inte pressa förrän bollhållaren har gjort en touch. *Nivå 3:* fyra sekunder, och bollhållaren får högst tre touchar.
- Ytreferens: `ungefär tre fjärdedelar av stora planens straffområde`.

**O7-07, spela ut från målvakten mot press.**
- *Form:* ett mål med målvakt i ena kortsidan, två konportar på den andra. Uppspelslaget har målvakten och två till fyra utespelare. Pressarna är en färre än uppspelslagets utespelare. Målvakten startar med bollen. Pressarna startar bakom en konlinje 10 meter från målet och får gå fram när målvakten har spelat den första passningen. Uppspelslaget får en poäng när en spelare tar emot bollen bakom en av konportarna. Vinner pressarna bollen ska de göra mål inom åtta sekunder.
- *Regeln om linjen är övningens egen* (regel 11). Den liknar retreatlinjen men bygger inte på den, och därför får övningen också `9mot9`.
- *Mål:* `storlek: eget`, `bredd: 5` (regel 12).
- *Rotation:* efter tre minuter byter två pressare roll med två uppspelare, i tur och ordning. Målvakten står hela tiden om laget har en målvakt som vill, annars byts den efter varje period. Skriv rotationen för varje antal 5–10.
- *Udda antal:* den extra spelaren är alltid i uppspelslaget.
- *Nivå 1:* pressarna är halvaktiva, de stänger passningsvägar men tar inte bollen. *Nivå 3:* lika många pressare som uppspelare.
- *Ingen djupledskrav:* minsta längd gäller inte `fas-10-12` (`passuppbyggnad.md`).
- Ytreferens: `ungefär två tredjedelar av stora planens straffområde`.

**O7-08, driv in eller gör mål.**
- *Form:* två lag, två småmål på varje kortlinje med ungefär 10 meter mellan, och en 3 meter djup zon framför varje kortlinje. Ett lag får en poäng för att driva in bollen i motståndarnas zon och stoppa den där, och två poäng för mål i ett av småmålen efter att en spelare har dribblat förbi en motståndare i samma anfall.
- *Varför två sätt att göra poäng:* på `niva-1` lönar det sig att våga dribbla, eftersom drivet in i zonen alltid ger poäng. På `niva-3` måste laget välja mellan säker poäng och dubbel poäng.
- *Udda antal:* ett lag spelar med en spelare mer, byt efter varje period.
- *Perioder:* 3–4 minuter spel, 1 minuts vila.
- *Samma yta som O7-06* (regel 16). Med 20 spelare på kvarts plan ryms inte tre grupper, och det godtar jag: O7-06 och O7-09 ryms.
- *Nivå 3:* zonen tas bort, bara mål ger poäng, och målet räknas bara om spelaren har dribblat förbi en motståndare.
- Ytreferens: `ungefär tre fjärdedelar av stora planens straffområde`.

**O7-09, spela genom portarna framåt.**
- *Form:* ytan delas på längden i tre zoner. I den mittersta zonen står tre konportar, två meter breda. Ett lag får en poäng när det spelar en passning genom en port i mittzonen till en medspelare som tar emot på andra sidan, och två poäng när det därefter passar till en medspelare som tar emot i motståndarnas bakre zon. Det är uppbyggnad genom lagdelar i liten form.
- *Riktning:* lagen anfaller åt var sitt håll och byter efter varje period.
- *Nivå 1:* bara den första poängen, och ingen får stå i en port. *Nivå 3:* högst två touchar, och portarna görs en meter smalare.
- *Udda antal:* en joker som spelar med laget som har bollen och inte får ta emot i den bakre zonen.
- Ytreferens: `ungefär två tredjedelar av stora planens straffområde`.

### 2.4 10–12 år, Öva (O7-10 till O7-12)

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O7-10 | Fasta situationer längs marken | `del-ovning` | `fasta-situationer`, `passning-mottagning`, `avslut` | 1–3 | 10–12 | `fri`, 5–9, med målvakt | 0 | 5, 7, 9 | 6 / 10 / 15 | 30 × 20 = 600, utan motståndare. 66,7 vid 9 (golv 15). 120 vid 5, 12 % över. Två grupper på kvarts plan: 33 × 23 × 2 = 1 518 | `fasta-situationer` i Öva: `5mot5` 0 övningar och 100 %, `7mot7` 78,8 %. R i fasen, och fasta situationer "blir en del av spelet" (`aldrar-och-fokus.md`) |
| O7-11 | Avslut från två håll mot målvakt | `del-ovning` | `avslut`, `passning-mottagning`, `dribbling` | 1–3 | 10–12 | `fri`, 4–10, med målvakt | 0 | 5, 7, 9 | 6 / 10 / 15 | 20 × 16 = 320, utan motståndare. 32 vid 10. 80 vid 4. Två grupper på kvarts plan: 23 × 19 × 2 = 874 | `avslut` har en Öva för 10–12 år, och den gäller inte `niva-1` (`avslut-efter-inspel`, nivå 2–3). `malvaktsspel -> avslut` 11 748 gånger |
| O7-12 | Tre mot två och kontra | `del-ovning`, `del-spelovning` | `omstallning`, `forsvarsspel`, `spelbarhet` | 1–3 | 10–12 | `tva-lag`, 5–10 | 0 | 5, 7, 9 | 6 / 12 / 15 | 28 × 18 = 504. 50,4 vid 10. 100,8 vid 5. Två grupper på kvarts plan: 1 302 | `forsvarsspel` och `omstallning` har ingen Öva och ingen spelövning på `niva-1` för 10–12 år. `7mot7` `del-ovning`: 63,2 och 70,4 %. `omstallning -> passning-mottagning` 12 768 gånger |

**O7-10, fasta situationer längs marken.**
- *Form:* vid ett mål med målvakt. Gruppen kör tre varianter i tur och ordning: inkast till fötterna med vägg och avslut, kort hörna med inspel längs marken bakåt till avslut, och spelad frispark runt en mur av koner. Inga höga bollar (regel 18).
- *5 mot 5:* fasta situationer börjar där med ett driv eller en passning längs marken, och mål får inte göras direkt (`spelformer.md`). Övningens varianter följer redan det. Skriv en mening om det, så att övningen kan märkas `5mot5`.
- *Rotation (regel 15 i `plan-omgang-6.md`):* slagare blir mottagare, mottagare blir avslutare, avslutaren hämtar bollen och ställer sig sist. Kön står bakom slagarens plats och aldrig i en skottlinje.
- *Målvakt (regel 19):* frivillig, med handskar om laget har. Avslut från minst 10 meter.
- *Utan motståndare:* muren är koner, och målvakten gör inte övningen till en övning med motståndare (`passuppbyggnad.md`).
- *Nivå 3:* en halvaktiv försvarare står i straffområdet, och varianten ska väljas tyst med ett tecken.
- Ytreferens: `ungefär tre fjärdedelar av stora planens straffområde, några steg djupare`.

**O7-11, avslut från två håll mot målvakt.**
- *Form:* ett mål med målvakt och två köer, en snett ut på var sida, ungefär 16 meter från målet. Den första i ena kön driver in mot en kon, passar till den första i andra kön, som tar emot och avslutar från minst 10 meter. Nästa anfall startar från andra sidan.
- *Rotation:* passaren går till andra kön, skytten hämtar bollen och går till den kö hen kom från. Med 9 och 10 spelare finns två mål, en grupp vid varje, och generatorn delar gruppen (R-051).
- *Varför `dribbling`:* drivet in mot konen och en finta före passningen är en del av övningen och coachas.
- *Säkerhet (regel 19):* köerna står vid sidan, aldrig bakom målet. Ingen skjuter förrän målvakten är klar.
- *Nivå 1:* passaren står still och spelar en rullande boll. *Nivå 3:* skytten har två touchar, och en halvaktiv försvarare följer skytten.
- Ytreferens: `ungefär halva stora planens straffområde`.

**O7-12, tre mot två och kontra.**
- *Form:* tre anfallare mot två försvarare anfaller ett mål med målvakt eller två småmål. Vinner försvararna bollen ska de spela den genom en av två konportar på anfallarnas startlinje, och anfallarna ska vinna tillbaka den. Med fler spelare växer det till fyra mot tre och fem mot fyra.
- *Varför både Öva och Spelövning:* överläge med riktning och mål (regel 9). Den skiljer sig från `overtal-i-forsvar`, som har fast storlek, ledarbehov 1 och bara nivå 2–3.
- *Rotation:* efter varje anfall går en anfallare till försvaret och en försvarare till anfallet, i tur och ordning. Skriv det för varje antal 5–10.
- *Udda antal:* den extra spelaren är anfallare.
- *Nivå 1:* försvararna får inte gå fram förrän första passningen är spelad. *Nivå 3:* anfallarna har sex sekunder att avsluta.
- *Samma yta som O7-07 och O7-09* (regel 16).
- Ytreferens: `ungefär två tredjedelar av stora planens straffområde`.

### 2.5 Kontroll: vilka fokus kärnan kan fylla direkt efter omgång 7

Ett pass har kärna på valt fokus bara om Öva och Spelövning fylls med valt fokus och med olika övningar (R-070). I de längsta passen krävs dessutom två övningar i en av delarna (avsnitt 0.2).

**8–9 år.** Öva i 75-minuterspass kräver två övningar, Spelövning en.

| Fokus | Öva | Spelövning | Kärna på valt fokus |
|---|---|---|---|
| `bollkansla` (K) | O7-01, O7-02, O7-03 | O7-01 | ja, också i 75 minuter (O7-02 + O7-03 i Öva, O7-01 i Spelövning) |
| `koordination` (K) | O7-02, O7-03 | – | nej. Ersättning `snabbhet`, `ett-mot-ett` i Spelövning |
| `lek` (K) | O7-01, O7-02 | O7-01 | ja i 30 och 55 minuter. I 75 behövs O7-01 i Öva, och då fylls Spelövning med ersättning |
| `dribbling` (K) | `driva-forbi-i-par`, O7-01, O7-03 | `dribbling-genom-portar` (2–3), O7-01 | ja, också på `niva-1` |
| `passning-mottagning` (K) | `avslut-efter-kort-passning`, `malvaktstraning-grunder`, `triangelpass-med-rorelse`, O7-04 | `behall-bollen-i-gruppen` (1–2) | ja på nivå 1–2. Nivå 3 ersättning |
| `avslut` (K) | `avslut-efter-kort-passning`, O7-04 | tre övningar | ja |
| `ett-mot-ett` (K) | `driva-forbi-i-par` | tre övningar | ja i 30 och 55 minuter. Med B4 också i 75 |
| `spelbarhet` (K) | `triangelpass-med-rorelse` (1–2), O7-04, O7-05 | tre övningar | ja |
| `forsvarsspel`, `omstallning` (R) | O7-05 | `forsvara-tillsammans` (2–3), O7-05 | ja i 30 och 55 minuter på nivå 2–3 |
| `speluppbyggnad` (R) | – | `spela-ut-med-malvakten` (2–3) | nej. Ersättning i Öva |
| `malvaktsspel` (R) | `malvaktstraning-grunder` | `spela-ut-med-malvakten` (2–3) | ja i 30 och 55 minuter, nivå 2–3, inte i 3 mot 3 |
| `snabbhet`, `skadeforebyggande` (R) | – | – | nej. Ersättning, och `skadeforebyggande` hör hemma i uppvärmningen (R-044) |

**10–12 år.** Öva kan fyllas med en övning i alla passlängder, om den har längst minst 12. Spelövning i 90-minuterspass kräver två.

| Fokus | Öva | Spelövning, antal per nivå 1 / 2 / 3 | Två spelövningar på varje nivå |
|---|---|---|---|
| `dribbling` (K) | fem, med O7-03 och O7-11 | 1 / 2 / 2 (O7-08, `dribbling-genom-mittzonen`) | nej på `niva-1`. B4 ger en tredje på `niva-3`, inte på `niva-1` |
| `passning-mottagning` (K) | fem, med O7-10 och O7-11 | 2 / 3 / 3 (O7-07, O7-09, `tre-passningar-fore-skott`) | ja |
| `avslut` (K) | tre, med O7-10 och O7-11 | 5 / 5 / 2 (O7-06, O7-08 och tre befintliga på nivå 1–2) | ja |
| `ett-mot-ett` (K) | tre | 2 / 3 / 2 (O7-08, `en-mot-en-till-tva-mal`, `dribbling-genom-mittzonen`) | ja |
| `spelbarhet` (K) | fyra, med O7-12 | 5 / 7 / 5 | ja |
| `speluppbyggnad` (K) | `bygg-upp-fran-malvakten` (1–2) | 2 / 3 / 3 (O7-07, O7-09, `spela-ut-bakifran`) | ja. Öva på `niva-3` ersättning |
| `forsvarsspel` (K) | O7-12, `forsvara-zonen`, `snabb-omstallning-tva-mot-en` | 2 / 3 / 3 (O7-06, O7-12, `overtal-i-forsvar`) | ja |
| `omstallning` (K) | O7-12, `snabb-omstallning-tva-mot-en` | 2 / 3 / 3 (O7-06, O7-12, `omstallning-med-jokrar`) | ja |
| `koordination` (K) | O7-03 | – | nej. Ersättning |
| `bollkansla` (R) | O7-03, `dribbling-i-eget-tempo` | – | nej. Ersättning |
| `fasta-situationer` (R) | O7-10 | – | nej. Ersättning `avslut`, `forsvarsspel` |
| `malvaktsspel` (R) | `bygg-upp-fran-malvakten` (1–2) | `spela-ut-bakifran` (2–3) | bara nivå 2 |
| `lek`, `snabbhet`, `skadeforebyggande` (R) | – | – | nej. Ersättning |

Efter omgången kan alla K-fokus utom `koordination` ge kärna på valt fokus i båda faserna, på varje nivå och i varje passlängd, med de undantag som står i tabellerna.

### 2.6 Prioritet om omgången behöver bli mindre

Planen föreslår 12 övningar. Om omgången ska bli mindre tas de bort i den här ordningen, med minst effekt först:

1. **O7-10** (fasta situationer, 10–12 år). `fasta-situationer` är R och får ingen spelövning, så den ger aldrig kärna på valt fokus. Ersättningen `passning-mottagning` i Öva fungerar redan.
2. **O7-11** (avslut i Öva, 10–12 år). Utan den får `avslut` på `niva-1` i Öva ersättning med `dribbling` eller `passning-mottagning`, som det finns gott om.
3. **O7-08** (driv in eller gör mål). Utan den har `dribbling` ingen spelövning på `niva-1` för 10–12 år, och `avslut` bara en på `niva-3`.

Övriga nio ska vara med. **O7-06 är viktigast i omgången**: den ensam tar bort "inget pass" för 10–12 år.

## 3. De tre uppskjutna ändringarna från omgång 6

`plan-omgang-6.md`, avsnitt 5, sköt upp tre ändringar i godkända övningar för 8–9 år till den här omgången. Ingen av dem gör övningen farlig eller fel i sak, men de ska rättas när filen öppnas (`passuppbyggnad.md`, *Vad som händer när en övning inte håller måttet*, sista punkten). Jag har räknat om geometrin 2026-10-08 mot filerna på grenen `omgang/7`. Varje ändrad fil får en ny post i `granskning` som säger vad som ändrats och varför. De läggs som en egen commit i omgångens pull request, så att de kan granskas för sig.

Ingen av ändringarna påverkar täckningen negativt: `forsvara-tillsammans` och `fyra-horn-med-boll` behåller `yta` och `spelare`, och `driva-forbi-i-par` får en större yta som fortfarande ryms tio gånger på kvarts plan (11 × 10 × 10 = 1 100 av 1 664).

### 3.1 `forsvara-tillsammans` (8–9 år)

*Fel:* över taket vid minsta antal. 20 × 14 = 280 kvadratmeter delat på 4 är 70 per spelare, 56 procent över taket 45. Övningen godkändes 2026-09-14, innan taket var formulerat.

*Ändring:*
- `organisation`, ny mening sist: `Med fyra eller fem spelare spelas på en mindre yta, ungefär 16 x 10 meter, eftersom två mot två annars blir för glest.`
- `planskiss.beskrivning`, ny mening sist: `Med fyra eller fem spelare används en mindre yta, ungefär 16 x 10 meter.`
- `yta` står kvar på 20 × 14, så att R-092 räknar med det största måttet. Det är samma lösning som i `storre-spel-6mot6-till-11mot11`.

*Kontroll:*
- 16 × 10 = 160. 160 / 4 = 40, under taket 45. 160 / 5 = 32, över golvet 25.
- 280 / 6 = 46,7, 4 procent över taket. Det godtar jag, eftersom tre mot tre är övningens grundläge.
- 280 / 8 = 35, över golvet 25.
- Skissens beskrivning är i dag cirka 206 tecken. Med den nya meningen, cirka 73 tecken, blir den cirka 280, under taket 300.
- Basskissen visar två mot två på 20 × 14 meter, alltså `spelare.min` enligt ADR 0012, S-1. Den visar det största måttet, och meningen talar om att små grupper använder en mindre yta. Det är samma sätt som `storre-spel-6mot6-till-11mot11` redan visar sin yta. Se F7.

### 3.2 `driva-forbi-i-par` (8–9 år)

*Fel:* under golvet. 6 × 6 = 36 kvadratmeter för två är 18 per spelare, golvet är 25. Övningen godkändes innan golvet beslutades 2026-09-23.

*Ändring:*

| Fält | Nu | Nytt |
|---|---|---|
| `yta.alla` | 6 × 6 | 8 × 7 (`langd: 8`, `bredd: 7`) |
| `beskrivning` och `planskiss.beskrivning` | "6 x 6 meter" | "8 x 7 meter" |
| `planskiss.omrade` och `ruta` | 6 × 6 | 8 × 7 |
| Konerna | `(0, 2)`, `(0, 4)`, `(6, 2)`, `(6, 4)` | `(0, 2.5)`, `(0, 4.5)`, `(8, 2.5)`, `(8, 4.5)` |
| `anf` | `(0.5, 3)` | `(0.5, 3.5)` |
| Bollen | `(0.8, 3)` | `(0.8, 3.5)` |
| `fors` | `(4, 3)` | `(5.5, 3.5)` |
| Dribblingen | `till: { x: 5.5, y: 3 }`, `via: [{ x: 3, y: 6.5 }]` | `till: { x: 7.5, y: 3.5 }`, `via: [{ x: 4, y: 7.5 }]` |
| Löpningen | `till: { x: 3, y: 3 }` | `till: { x: 4.5, y: 3.5 }` |
| Kön | `riktning: 180`, `avstand: 2` | oförändrad |

Ingen ytreferens, som förut: rutan är för liten för någon plandel.

*Kontroll:*
- 56 / 2 = 28 kvadratmeter per spelare, över golvet 25. Som trio 56 / 3 = 18,7, men trion har bara två på ytan åt gången, eftersom den tredje väntar utanför vid anfallarens port (R-058, `passuppbyggnad.md`, *Så räknas talet fram*, punkt 4). 28 är under taket 45.
- Portarna är 2 meter breda, mitt på kortsidorna (2,5–4,5).
- Dribblingen är en kvadratisk Bézierkurva från `(0.5, 3.5)` via `(4, 7.5)` till `(7.5, 3.5)`. Den kan skrivas x = 0,5 + 7t och y = 3,5 + 8t(1 − t). Högsta punkten är `(4, 5.5)`, 1,5 meter innanför den nedre linjen (y = 7).
- Avståndet från kurvan till försvararens startpunkt `(5.5, 3.5)` är minst cirka 1,39 meter (vid t ≈ 0,83), och till hans slutpunkt `(4.5, 3.5)` minst cirka 1,90 meter (vid t ≈ 0,67). Försvararens löpning går längs y = 3,5 mellan x = 4,5 och 5,5, och där ligger kurvan på y = 5,1–5,5, alltså minst 1,6 meter bort.
- Kurvan börjar i anfallarens port och slutar i försvararens port, och passerar därför cirka 1,05 meter från portkonerna i början och i slutet. Det är oundvikligt när bollen ska genom en port som är 2 meter bred, och det är inte en krock i bilden: portens mitt ligger 1 meter från varje kon. Regeln om 1,3 meter (designregel 10 i `plan-omgang-6.md`) gäller inte för konerna i den port som är målet för rörelsen.
- Kön står på `(-1.5, 3.5)`, 1,5 meter utanför ytan bakom anfallarens port, mer än kravet 0,6 meter.

### 3.3 `fyra-horn-med-boll` (8–9 år)

*Fel:* saknar meningen om mindre yta för en liten grupp, som tillägget 2026-10-07 i `passuppbyggnad.md` kräver av övningar där alla har egen boll och ingen motståndare finns.

*Ändring:* `organisation`, ny mening sist: `Är ni färre än nio, gör rutan ungefär 13 x 13 meter, så att spelarna måste titta upp för att inte krocka.`

*Kontroll:*
- 13 × 13 = 169. 169 / 6 = 28,2 och 169 / 8 = 21,1 kvadratmeter per spelare, över golvet 10 för egen boll.
- Med nio till tolv används hela rutan: 324 / 12 = 27.
- Skiss och `yta` oförändrade. Övningen är ingen jaktlek, så taket prövas inte.
- Krockrisken i hörnet, som granskningen 2026-09-14 tog upp: med åtta spelare på 169 kvadratmeter blir det 21 kvadratmeter per spelare, mot 27 med tolv på hela rutan. Det är trängre i rutan, men färre barn möts samtidigt vid samma kon än med tolv, och coachningspunkten om att sakta ner vid konen står kvar. Jag bedömer att risken inte ökar.

## 4. Fotbollsfrågor som jag avgör

**F1. Övningar med motståndare spänner inte över 8–12 år.** Golvet för 10–12 år, 45 kvadratmeter, är lika med taket för 8–9 år, 45. En yta som klarar golvet för den äldsta klarar inte taket för den yngsta. Taket är ett riktvärde, men en övning som ligger på eller över det redan i ena änden av sitt spann blir för gles för 8-åringar och för trång för 12-åringar. Det är samma bedömning som F2 i `plan-omgang-5.md`. Bara en övning med egen boll och utan motståndare (O7-03) får spänna över båda faserna, eftersom taket inte prövas där.

**F2. 30 minuter spel för 10–12 år är rätt med perioder.** R-034 tillåter 30 minuter i Spel för `fas-10-12`, och 90-minuterspass kräver 25–31. Koncentrationen räcker 10–15 minuter i samma form (`aldrar-och-fokus.md`). Därför ska O7-06 ha perioder om 4–5 minuter och en ändrad regel efter halva tiden. Det är samma princip som F5 i `plan-omgang-6.md`.

**F3. Hajen har ingen som åker ut.** I den klassiska formen åker de fångade ut och står still. Här blir den som tappar bollen haj, och en ny omgång börjar när två fiskar är kvar. Alla är i gång hela tiden (`aldrar-och-fokus.md`, grundprincip 3).

**F4. Trafikljuset och Följ John får vara både Uppvärmning och Öva.** De är lekar och rörelser med egen boll, som `lek-med-egen-boll` i paket A. I uppvärmningen är de uppvärmning, i Öva läggs svårare signaler och rörelser till. R-044 för `fas-8-9` och `fas-10-12` gynnas av fler uppvärmningar med `koordination` och `lek`.

**F5. Koordination får ingen spelövning.** I en spelövning visar sig koordinationen som riktningsändringar och starter i en duell. R-121 lägger det på `snabbhet` och `ett-mot-ett`, och det är rätt innehåll. Det följer F5 i `plan-omgang-5.md`.

**F6. Fasta situationer för 10–12 år får märkas `5mot5`.** I 5 mot 5 börjar varje fast situation med ett driv eller en passning längs marken, och mål får inte göras direkt (`spelformer.md`). O7-10 har bara sådana varianter. `fasta-situationer` är R för `fas-10-12`, och lag i den åldern som spelar 5 mot 5 har samma fasta situationer.

**F7. Skissen för `forsvara-tillsammans` ritar den största ytan.** ADR 0012, S-1, kräver att basskissen visar minsta antal spelare, inte minsta yta. Att rita om skissen till 16 × 10 skulle göra den fel för sex till åtta spelare, som är övningens vanligaste läge. Meningen i beskrivningen räcker.

**F8. Ingen joker i omställningsspelet O7-06.** En joker som alltid spelar med laget som har bollen gör att ingen behöver försvara direkt efter bolltapp, och det är just det spelet tränar. Vid udda antal spelar ett lag med en spelare mer, och det byts varje period.

**F9. Målet för 10–12 år med målvakt är 5 meter brett i alla spelformer.** 7 mot 7-målet är högst 5 × 2 meter (`spelformer.md`). Ett 9 mot 9-mål, 6 × 2,2, är onödigt stort i en yta som är 18 meter bred, och 10–12-åringar som spelar 9 mot 9 har sällan sådana mål på träning. Därför `storlek: eget` (regel 12).

## 5. Beslut som behövs

**B1. Antalet övningar.** *Rekommendation:* alla 12. Om omgången ska bli mindre gäller ordningen i avsnitt 2.6, och O7-06 ska alltid vara med.

**B2. Fördjupningen för 6–7 år flyttas från omgång 7.** `plan-omgang-5.md`, avsnitt 4, lade 5–6 övningar för 6–7 år i omgång 7. Den här planen tar bara 8–12 år, enligt uppdraget och `plan-omgang-6.md`. *Rekommendation:* fördjupningen för 6–7 år blir omgång 8. Om målet om högst 40 procent ersättningsfokus för hela banken (avsnitt 1.3) inte nås efter omgång 7, är omgång 8 också nästa steg för det målet. Jag rättar `plan-omgang-5.md` om användaren vill det.

**B3. Längre tid i `litet-spel-till-smamal` (8–9 år, godkänd).** Det är det enda spelet för 8–9 år i 3 mot 3 och har längst 20 minuter. 75-minuterspass kräver 21–27 minuter i Spel, och därför kan Spel aldrig fyllas i 75-minuterspass för 8–9 år i 3 mot 3 (avsnitt 0.3, rapportens 33,3 %). Ändringen: `tid` från 10 / 15 / 20 till 10 / 15 / 25, och en ny mening sist i `organisation`: `Spela i perioder om fyra till fem minuter med en minuts vila, och byt lag mellan perioderna.` Ingen yta, inga spelare och ingen skiss ändras. Med den kan Spel fyllas för varje antal och passlängd för 8–9 år, eftersom spannet 4–7 och ytan 18 × 12 ger tre grupper på kvarts plan (21 × 15 × 3 = 945), och min uträkning ger 0,0 procent "inget pass" i alla tre celler för 8–9 år. *Rekommendation:* ja, som en egen commit i omgångens pull request, som B2 i omgång 6.

**B4. Två godkända dueller får en passdel till.** F4 i `plan-omgang-5.md` tillåter att dueller med riktning och mål är både Öva och Spelövning.
- `en-mot-en-till-mal` (8–9 år, par, `ett-mot-ett`, `avslut`, nivå 1–2) får `del-ovning`. Då har `ett-mot-ett` två övningar i Öva för 8–9 år på nivå 1–2, och 75-minuterspass kan fyllas med valt fokus.
- `dribbling-mot-tidspress` (10–12 år, par, `dribbling`, `ett-mot-ett`, nivå 3) får `del-spelovning`. Då har `dribbling` och `ett-mot-ett` tre spelövningar på `niva-3`, och den enda spelövningen i par för fasen på den nivån, som fungerar också med 4 spelare och på liten yta.
- Inga andra fält ändras. Båda har redan riktning, mål och en rotation som fungerar i båda delarna.
*Rekommendation:* ja, som en egen commit, och skriptet körs före och efter (avsnitt 1.4). Målen i avsnitt 1 gäller utan den här ändringen.

## 6. Källor

| Källa | Använd för | Läst |
|---|---|---|
| `docs/doman/tackning-2026-10-08.md`, kolumnen *Efter CI* | Alla siffror om körfall, "inget pass", fylld kärna, kärna på valt fokus, delar som inte kan fyllas och ersättningar | 2026-10-08 |
| `content/ovningar/*.yaml`, de 44 övningarna för 8–12 år, grenen `omgang/7` | Ålder, spelformer, nivå, passdelar, spelare, grupptyp, ledarbehov, tid, yta och skissdata | 2026-10-08 |
| `scripts/tackning.ts` (`lengthSample`) och `scripts/tackning-celler.ts` (`PLAN_GOALS`) | Vilka passlängder svepet prövar, och hur målen förs in | 2026-10-08 |
| `docs/doman/generatorregler.md`, `passuppbyggnad.md`, `fokusomraden.md`, `ytreferenser.md` | Måltider, tidstak, grupper, yta, golv och tak, K och R per fas, ytreferenser | 2026-10-08 |
| `docs/adr/0012-planskissformat.md` (S-1) och ADR 0019 | Basskissen ritas för minsta antal, mål per spelform | 2026-10-08 |
| SvFF:s nationella spelformer och planstorleksdokumentet, via `docs/doman/spelformer.md` (hämtade 2026-09-11) | Fasta situationer i 5 mot 5, retreatlinje, offside och inspark, målstorlekar | 2026-10-08 |
| SvFF:s spelarutbildningsplan och FSLL, via `docs/doman/aldrar-och-fokus.md` (hämtade 2026-09-11) | Vad fas 8–9 och 10–12 betonar, kö, koncentration, nickning | 2026-10-08 |

Inga nya externa källor är hämtade för planen. Övningarnas innehåll, måtten, målen och frågorna F1–F9 är min bedömning som tränarutbildare. Övningarna är allmänt kända former (jaktlek med boll, signallek med egen boll, härmlek i par, väggspel och avslut, överlägen med kontring, smålagsspel med poängregler, uppbyggnad mot press, fasta situationer längs marken), och planen beskriver dem med egna ord. Ingen text är kopierad ur SvFF:s eller andras material.
