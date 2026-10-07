Status: utkast

# Plan för omgång 6 av övningsbanken: fördjupning för 13–19 år

**Ägare:** fotbollsexpert · **Skriven:** 2026-10-07 · **Underlag:** `docs/doman/tackning-2026-10-07.md` (banken efter omgång 5B, 72 godkända övningar, frö `tackning-1`), `plan-omgang-5.md` (avsnitt 2.1, 4 och F1–F7), `plan-omgang-5b.md`, `granskning-omgang-5.md`, `granskning-planskisser.md`, `passuppbyggnad.md`, `generatorregler.md`, `fokusomraden.md`, `aldrar-och-fokus.md`, `nivaer.md`, `spelformer.md`, `ytreferenser.md`, `content/ovningar/README.md`, ADR 0012, 0018 och 0019, och de 21 övningsfilerna för 13–19 år, lästa på grenen `omgang/6` 2026-10-07.

Planen är skriven så att övningsförfattaren kan skriva varje övning direkt ur tabellen i avsnitt 2 och designkraven i avsnitt 3. Alla procenttal som inte står i täckningsrapporten är mina egna uträkningar, och de redovisas så att de går att kontrollera. Målen är mål, inte prognoser. De prövas genom att täckningsskriptet körs om när omgången är granskad.

## 0. Läget efter omgång 5B

### 0.1 Vad banken har för 13–19 år

- **15–19 år har 8 övningar**, alla från paket B i omgång 5 (B1–B8). Ingen annan övning i banken har en ålder över 14.
- **13–14 år har 21 övningar**: paket B och de 13 från omgång 4.
- Täckningsrapporten (`tackning-2026-10-07.md`, *Per cell i planen*):

| Cell | Typ | Körfall | Inget pass | Fylld kärna | Kärna på valt fokus |
|---|---|---|---|---|---|
| 13–14 år, 9 mot 9 | föreslagen | 29 280 | 2,5 % | 57,8 % | 21,7 % |
| 13–14 år, 7 mot 7 | granne | 29 280 | 3,7 % | 47,3 % | 14,9 % |
| 13–14 år, 11 mot 11 | granne | 29 280 | 2,5 % | 57,7 % | 21,4 % |
| 15–19 år, 11 mot 11 | föreslagen | 73 200 | 8,2 % | 32,0 % | 12,7 % |
| 15–19 år, 9 mot 9 | granne | 73 200 | 8,2 % | 32,0 % | 12,7 % |

15–19 år i 11 mot 11 är den enda föreslagna cellen som inte når huvudmålet om högst 5 procent "inget pass". Det är också den cell där kärnan oftast står tom.

### 0.2 Varför kärnan står tom för 15–19 år

Jag har gått igenom de åtta övningarna för 15–19 år mot sveparnas underlag (antal spelare 4–20, ledare 1–3, yta ingen, hel, halv eller kvarts plan, passlängd 30, 75 och 120 minuter). Fyra orsaker förklarar nästan allt. De är också designkraven för omgången.

1. **Spelövningarna är för korta för långa pass.** Med 120 minuter är måltiden för Spelövning 26 minuter, alltså 23–29 (R-032, R-035). B6, B7 och B8 har längst 20 minuter. Då måste delen fyllas med två moment som båda träffar valt fokus (R-041), och det finns sällan två. Med 75 minuter är måltiden 16 och fungerar.
2. **Spelövningarna är för långa för korta pass.** Med 30 minuter är måltiden för Spelövning 6 minuter, alltså 3–9. B7 och B8 har kortast 10 och kan inte användas. Bara B6 (kortast 8) fungerar. Öva tas bort helt i 30-minuterspass (R-033), så där är Spelövning hela kärnan.
3. **Kvarts plan med många spelare.** Kvarts plan är 52 × 32 meter (R-091). Två grupper sida vid sida får bara plats om varje grupp med 3 meters marginal är högst cirka 832 kvadratmeter (R-092). Ingen övning för 15–19 år med motståndare ryms då för fler än åtta spelare: B1 (36 × 20) ryms för en grupp men inte för två, och B7 och B8 inte för två. **Spelet går därför inte att fylla på kvarts plan med 10–20 spelare**, och då blir det "inget pass" så fort Öva inte heller kan fyllas med valt fokus.
4. **Fokusområdena saknas.** Rapportens tabell för 11 mot 11 (som också räknar 13–14 år i grannspelformen) visar vilka delar som inte kan fyllas för sig:

| Del (11 mot 11) | Fokus | Övningar | Kan inte fyllas för sig |
|---|---|---|---|
| `del-ovning` | `fasta-situationer`, `speluppbyggnad`, `omstallning`, `uthallighet`, `koordination` | 0 | 100 % |
| `del-ovning` | `forsvarsspel` | 1 | 92,9 % |
| `del-spelovning` | `fasta-situationer`, `malvaktsspel`, `uthallighet` | 0 | 100 % |
| `del-spelovning` | `forsvarsspel`, `omstallning` | 2–3 | 78,6 % |
| `del-spelovning` | `avslut` | 2 | 74,6 % |
| `del-spelovning` | `speluppbyggnad`, `passning-mottagning` | 1–2 | 66,5 % |
| `del-spelovning` | `spelbarhet` | 2 | 64,1 % |
| `del-spel` | alla | – | 12,8 % |

De vanligaste ersättningarna i hela banken (R-121) pekar åt samma håll: `forsvarsspel -> ett-mot-ett` 24 195 gånger, `fasta-situationer -> passning-mottagning` 22 254, `speluppbyggnad -> passning-mottagning` 20 400, `omstallning -> passning-mottagning` 19 122 och `malvaktsspel -> avslut` 13 764.

### 0.3 Vad som inte går att få till noll

- **Kvarts plan med 20 spelare och 30 minuters pass.** Öva tas bort (R-033), och varken spel eller spelövning med motståndare ryms: golvet 90 kvadratmeter per spelare ger 1 800 kvadratmeter för en grupp om 20, mer än kvarts planens 1 664, och två grupper om 10 ryms inte med marginal. Det är 1/3 av passlängderna × 1/4 av ytvalen × 1/8 av antalen, alltså **cirka 1,0 procent av körfallen i varje cell för 13–19 år. Det är golvet för "inget pass".**
- **Kvarts plan med 16 eller 20 spelare ger aldrig en spelövning med motståndare**, av samma skäl (två grupper om 8 ryms inte). Det är cirka 6 procent av körfallen och sätter ett tak för fylld kärna under 100 procent.
- **Kärna på valt fokus kan inte bli 100 procent.** `lek`, `koordination`, `skadeforebyggande` och `bollkansla` har inga egna spelövningar för 13–19 år, och det är rätt (`plan-omgang-5.md`, F5). De är 4 av de 16 fokusområden som enkelfokussvepet prövar, så taket ligger nära 75 procent av de körfall där kärnan alls ryms.

## 1. Mål

### 1.1 Mål per cell

Måtten är kolumnerna i rapportens tabell *Per cell i planen (åldersgrupp och spelform)* för "Banken nu", räknat efter att omgång 6 är godkänd, eller efter CI-rättningen när omgångens övningar är granskade men inte godkända. "Fylld kärna" och "Kärna på valt fokus" avser kolumnerna "av alla körfall".

| Cell | Typ | Mått | Nu | Mål efter omgång 6 | Prövas som |
|---|---|---|---|---|---|
| 15–19 år, 11 mot 11 | föreslagen | Inget pass | 8,2 % | högst 2,0 % | `<= 2.0` |
| 15–19 år, 11 mot 11 | föreslagen | Fylld kärna | 32,0 % | minst 65 % | `>= 65.0` |
| 15–19 år, 11 mot 11 | föreslagen | Kärna på valt fokus | 12,7 % | minst 30 % | `>= 30.0` |
| 15–19 år, 9 mot 9 | granne | Inget pass | 8,2 % | högst 2,0 % | `<= 2.0` |
| 15–19 år, 9 mot 9 | granne | Fylld kärna | 32,0 % | minst 65 % | `>= 65.0` |
| 15–19 år, 9 mot 9 | granne | Kärna på valt fokus | 12,7 % | minst 30 % | `>= 30.0` |
| 13–14 år, 9 mot 9 | föreslagen | Inget pass | 2,5 % | högst 2,0 % | `<= 2.0` |
| 13–14 år, 9 mot 9 | föreslagen | Fylld kärna | 57,8 % | minst 68 % | `>= 68.0` |
| 13–14 år, 9 mot 9 | föreslagen | Kärna på valt fokus | 21,7 % | minst 33 % | `>= 33.0` |
| 13–14 år, 11 mot 11 | granne | Inget pass | 2,5 % | högst 2,0 % | `<= 2.0` |
| 13–14 år, 11 mot 11 | granne | Fylld kärna | 57,7 % | minst 68 % | `>= 68.0` |
| 13–14 år, 11 mot 11 | granne | Kärna på valt fokus | 21,4 % | minst 33 % | `>= 33.0` |
| 13–14 år, 7 mot 7 | granne | Inget pass | 3,7 % | högst 3,0 % | `<= 3.0` |
| 13–14 år, 7 mot 7 | granne | Fylld kärna | 47,3 % | minst 58 % | `>= 58.0` |
| 13–14 år, 7 mot 7 | granne | Kärna på valt fokus | 14,9 % | minst 22 % | `>= 22.0` |
| Alla celler för 6–12 år | båda | alla tre | se rapporten | **exakt oförändrat** | lika med värdet i `tackning-2026-10-07.md` |

*Varför 9 mot 9 och 11 mot 11 har samma mål för 15–19 år:* alla nya övningar för 15–19 år märks både `9mot9` och `11mot11`, utom det stora spelet O6-01, som bara märks `11mot11` (F1 (c) i `plan-omgang-5.md`). O6-01 ligger i `del-spel` och påverkar varken kärnan eller "inget pass", eftersom B1 redan fyller spelet för 20 spelare i tre grupper. Den gör spelet bättre, inte fler pass möjliga.

*Varför 6–12 år ska vara exakt oförändrat:* ingen övning i omgången har en minsta ålder under 13 (R-023). Om en siffra för 6–12 år ändras är det ett fel i skriptet eller i en fil, inte en effekt av omgången. Det är en billig kontroll av att körningen är riktig.

*Varför "inget pass" inte sätts till noll:* golvet är cirka 1,0 procent (avsnitt 0.3). Målet 2,0 procent ger plats åt det och åt nivå- och ledarfall som jag inte kan räkna ut för hand.

### 1.2 Mål per spelform och del

Måttet är kolumnen "Kan inte fyllas för sig" i rapportens tabell *Per spelform, passdel och fokusområde* för 11 mot 11. Tabellen blandar 13–14 år (granne, 28,6 procent av körfallen i spelformen) och 15–19 år (föreslagen). Övningar som bara gäller 15–19 år kan därför aldrig få ett värde under cirka 29 procent, och målen tar hänsyn till det.

| Del | Fokus | Nu | Mål efter omgång 6 | Övningar som ska ta det |
|---|---|---|---|---|
| `del-ovning` | `fasta-situationer` | 100 % | högst 40 % | O6-03 |
| `del-ovning` | `speluppbyggnad` | 100 % | högst 40 % | O6-12 |
| `del-ovning` | `omstallning` | 100 % | högst 50 % | O6-09 |
| `del-ovning` | `forsvarsspel` | 92,9 % | högst 40 % | O6-09 |
| `del-ovning` | `uthallighet` | 100 % | högst 50 % | O6-08 (bara 15–19 år) |
| `del-ovning` | `koordination` | 100 % | högst 50 % | O6-08 (bara 15–19 år) |
| `del-spelovning` | `fasta-situationer` | 100 % | högst 40 % | O6-04, O6-05 |
| `del-spelovning` | `malvaktsspel` | 100 % | högst 40 % | O6-11 |
| `del-spelovning` | `uthallighet` | 100 % | högst 50 % | O6-07 (bara 15–19 år) |
| `del-spelovning` | `forsvarsspel` | 78,6 % | högst 40 % | O6-04, O6-10 |
| `del-spelovning` | `omstallning` | 78,6 % | högst 40 % | O6-07, O6-10, O6-11 |
| `del-spelovning` | `speluppbyggnad` | 66,5 % | högst 40 % | O6-10, O6-13 |
| `del-spelovning` | `avslut` | 74,6 % | högst 45 % | O6-11, O6-14 |
| `del-spelovning` | `spelbarhet` | 64,1 % | högst 40 % | O6-13, O6-14 |
| `del-spel` | alla fokus | 12,8 % | högst 6 % | O6-01, O6-02 |

### 1.3 Ersättningsfokus

Rapportens tabell *Ersättningsfokus (R-121)* per spelform:

| Spelform | Nu | Mål efter omgång 6 |
|---|---|---|
| 11mot11 | 53,7 % | högst 40 % |
| 9mot9 | 55,4 % | högst 48 % |

9 mot 9 sjunker mindre, eftersom spelformen också räknar 10–12 år (granne), som omgången inte berör. Målet om högst 40 procent för hela banken (`plan-omgang-5.md`, avsnitt 1.5) gäller fortfarande efter omgång 7.

### 1.4 Om mätningen

- Målen i 1.1 ska föras in i `PLAN_GOALS` i `scripts/tackning-celler.ts` på samma sätt som målen i plan-omgang-5, med nya kolumner för fylld kärna och kärna på valt fokus. Det är arbete för kvalitetssäkraren eller senior systemutvecklare, inte för mig.
- Målen i 1.2 och 1.3 prövas för hand mot rapportens tabeller. Skriptet behöver inte ändras för dem.
- Om beslut B2 (avsnitt 6) godkänns, alltså att B7 och B8 får nya tider, bör skriptet köras både före och efter den ändringen, så att effekten av de nya övningarna och effekten av tidsändringen går att skilja åt.

## 2. Övningarna i omgång 6

### 2.1 Designregler för alla övningar i omgången

Reglerna gäller utöver designreglerna i `plan-omgang-5.md`, avsnitt 2.1, som fortfarande gäller (brett spelarspann, ledarbehov 0 där det är rätt, nivå 1–3 när varianterna bär det, planskiss och ytreferens). Varje regel kommer ur en orsak i avsnitt 0.2 eller ur ett fel i granskningarna av omgång 5 och planskisserna.

**Tid** (orsak 1 och 2 i 0.2):

1. **Spelövning:** `tid.kortast` högst 8 och `tid.langst` 25. Då fyller en enda övning Spelövning i alla prövade passlängder: 6 minuter vid 30 minuter, 16 vid 75 och 26 vid 120 för 15–19 år, och 6, 12 och 19 för 13–14 år. Generatorn kapar själv vid 20 minuter för 13–14 år (R-034), så 25 är rätt också för en övning för 13–19 år. Övningen ska beskriva hur den håller i 25 minuter: perioder, vila, rollbyten eller en svårare regel efter halva tiden. Inget annat än perioder får motivera längden. Undantag: en övning med `nickspel` har längst 15 minuter, så att nickmängden hålls nere (O6-05).
2. **Öva:** `tid.kortast` högst 8 och `tid.langst` minst 15, helst 20. Måltiden är 9 och 16 minuter för 15–19 år och 7 och 11 för 13–14 år.
3. **Spel:** `tid.kortast` högst 15 och `tid.langst` minst 36 för spel som ska täcka 120-minuterspass. Måltiden för Spel är 13 minuter vid 30 minuter och 39 vid 120.
4. **Nickspel:** `tid.kortast` högst 10, så att övningen ryms under nicktaket 10 minuter för 13–14 år (R-082). Generatorn håller taket själv; övningen ska ändå säga hur många nickar en spelare gör.

**Yta** (orsak 3 och granskningarna):

5. **Golv och tak.** Golvet för en övning för 13–19 år är 90 kvadratmeter per spelare med motståndare och 25 utan, räknat på `spelare.max`. Taket prövas på `spelare.min`, mot 181 kvadratmeter för en övning som gäller 13–14 år och mot 273 för en övning som bara gäller 15–19 år (fråga F1). Taket får överskridas med högst ungefär hälften när spannet kräver det, och då ska skälet stå i `organisation`.
6. **Ingen övning ska ligga exakt på golvet.** B1 och B8 ligger på 90,0, och då kan `spelare.max` aldrig höjas utan ny yta. Sikta på minst 5 procent över golvet. Måtten i tabellen är räknade så.
7. **Kvarts plan.** En övning som ska kunna köras på kvarts plan med en grupp har en yta som ryms i 52 × 32 meter. Flera av omgångens övningar delar ytan **45 × 32 meter**: den ryms en gång på kvarts plan och två gånger på halv plan med 3 meters marginal (48 × 35 × 2 = 3 360 av 3 380 kvadratmeter). Ändra inte de måtten utan att räkna om det.
8. **Djupled.** En övning där en försvarslinje ska passeras, där offside gäller eller där laget bygger upp genom lagdelar ska vara minst 40 meter lång (`passuppbyggnad.md`, *Minsta längd*). Omgångens djupledsövningar är 45 meter.
9. **Mål.** Ett mål med `storlek` som är en spelform ritas i den spelform passet gäller (ADR 0019, punkt 1). Ska målet vara lika stort i alla spelformer, använd `smamal` eller `storlek: eget` med `bredd`, och skriv samma storlek i `material.anteckning`. Det gäller särskilt smålagsspel med målvakter, där ett fullstort mål i en smal yta blir orimligt stort (påpekat för `omstallningsspel-9mot9`, se avsnitt 5).

**Planskiss** (granskningarna av omgång 5 och planskisserna):

10. **`via` är kontrollpunkter i en Bézierkurva.** En kvadratisk kurva når bara halvvägs mot sin kontrollpunkt. Räkna kurvans läge och håll minst cirka 1,3 meter till spelare, koner och de platser som läggs till när gruppen växer.
11. **Avslut från ett läge som är rimligt i matchen.** Inget skott i en skiss får gå från egen planhalva eller från mer än cirka 20 meter, utom i O6-11 där distansskott mot målvakt är själva övningen, och där högst 20 meter. Visar skissen inget bra avslutsläge, rita inget skott.
12. **Köer står utanför ytan och inte i en skottlinje.** Den första i kön ska stå minst 0,6 meter utanför linjen räknat på symbolens mitt. Kön utgår alltid från en spelare (ADR 0018, punkt 5).
13. **Rörelser som sker samtidigt har samma `ordning`.** Rörelser där alla gör samma sak samtidigt har ingen `ordning`.
14. **Basskissen ritas för `spelare.min`**, och `skalning` visar var resten hamnar. Varva lag `a` och `b` i `platser`. Vid udda antal ska skissens `beskrivning` säga hur övningen löser det, om bilden inte visar det (ADR 0018, punkt 6).

**Text:**

15. **Rotationen ska vara entydig för varje antal i spannet.** Skriv vem som går vart efter varje försök, också för den udda spelaren och den första omgången. "Byt ofta" eller "turas om" räcker inte (B5 och B6 i omgång 5).
16. **Arbete och vila står i siffror** i varje övning med fokus `uthallighet` eller `snabbhet`, och i varje spel som kan bli längre än 15 minuter (`passuppbyggnad.md`, *Vila och vätska*).
17. **Fasta situationer utan nick i grundformen.** En övning med `fasta-situationer` som inte är märkt `nickspel` ska säga att inlägg och hörnor slås längs marken eller i höjd med midjan. Planerad nickning kräver märkningen `nickspel` (R-081).
18. **Målvakt.** Den som står i mål har målvaktshandskar, och står en utespelare i mål placeras skotten i stället för att skjutas med full kraft. Ingen tvingas stå i mål (samma som B5).
19. **Nivå 3 på riktigt.** Varje övning med `niva-3` har en svårare variant som gör något av det `nivaer.md` beskriver för nivå 3: press från motståndare, kortare tid, mindre yta, färre touchar eller fler val. "Högre tempo" räcker inte.
20. **Egna texter.** Inget får vara kopierat ur SvFF:s eller andras material. Skriv `kalla` som tidigare.

### 2.2 Spel och fasta situationer (O6-01 till O6-04)

Kolumnen *Yta* visar kvadratmeter per spelare vid `spelare.max` (mot golvet) och vid `spelare.min` (mot taket). Kolumnen *Hål* citerar rapporten `tackning-2026-10-07.md`.

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O6-01 | Stort spel tio mot tio till elva mot elva | `del-spel` | `forsvarsspel`, `speluppbyggnad`, `fasta-situationer` | 1–3 | 15–19 | `tva-lag`, 19–23 | 0 | `11mot11` | 15 / 30 / 45 | 100 × 60. 261 vid 23 (golv 90). 316 vid 19, 16 % över taket 273. 273 vid 22, matchens egen form | Spelet för 19–23 spelare, som granskningen av paket B lämnade öppet när B2 stannade vid 18. I dag fylls spelet för 20 spelare av B1 i tre grupper om sju, och bara på halv eller hel plan |
| O6-02 | Spel med målvakter på kvarts plan, fyra mot fyra till åtta mot åtta | `del-spel` | `omstallning`, `forsvarsspel`, `speluppbyggnad` | 1–3 | 13–19 | `tva-lag`, 8–16 | 0 | `9mot9`, `11mot11` | 10 / 25 / 40 | 48 × 32. 96 vid 16. 192 vid 8, 6 % över 181 | `del-spel` kan inte fyllas i 12,8 % av körfallen för 11 mot 11 och 19,0 % för 9 mot 9, nästan bara på kvarts plan med 10–16 spelare (avsnitt 0.2, orsak 3). Ingen spel för 13–19 år ryms där för fler än åtta |
| O6-03 | Inövade fasta situationer: inkast, hörna, frispark och inspark | `del-ovning` | `fasta-situationer`, `passning-mottagning`, `avslut` | 1–3 | 13–19 | `fri`, 5–9 | 0 | `7mot7`, `9mot9`, `11mot11` | 8 / 12 / 20 | 40 × 30, utan motståndare. 133 vid 9 (golv 25). 240 vid 5, 33 % över 181 | `fasta-situationer` i Öva: 0 övningar och 100 % i 7, 9 och 11 mot 11. `fasta-situationer -> passning-mottagning` är den tredje vanligaste ersättningen, 22 254 gånger |
| O6-04 | Fasta situationer, anfall mot försvar med kontring | `del-spelovning` | `fasta-situationer`, `forsvarsspel`, `omstallning` | 1–3 | 13–19 | `tva-lag`, 6–14 | 0 | `7mot7`, `9mot9`, `11mot11` | 8 / 15 / 25 | 42 × 32. 96 vid 14. 224 vid 6, 24 % över 181 | `fasta-situationer` i Spelövning: 0 övningar och 100 % i 7 och 11 mot 11, 98,3 % i 9 mot 9. `forsvarsspel` i Spelövning 78,6 % i 11 mot 11 |

**O6-01, stort spel.**
- *Varför bara 15–19 år och 11 mot 11:* för 13–14 år prövas taket mot 181, och 316 är 75 procent över. Ett 11 mot 11 är större än 9 mot 9, så `9mot9` är inte tillåtet (F1 (c) i `plan-omgang-5.md`).
- *Ytan* är 11 mot 11-planens minsta mått enligt `spelformer.md`. Den ryms bara på hel plan (R-091), vilket är rätt. Ytreferens: `hela 11 mot 11-planen`.
- *Regler:* matchens regler, med offside och alla fasta situationer. Skriv in en regel som gör att fasta situationer och uppbyggnad händer ofta, till exempel att en hörna eller frispark i anfallszonen ska slås med en variant som laget har bestämt före perioden, och att målvakten startar med kort utspel efter varje inspark.
- *Perioder:* två eller tre perioder om 12–15 minuter med vattenpaus emellan (regel 16).
- *Udda antal och 23 spelare:* den extra spelaren är avbytare och byts in var femte minut i tur och ordning. Ingen joker i 11 mot 11, eftersom en joker i fullt lagspel suddar ut positionerna som övningen tränar. Vid 19 spelare spelar ett lag med en utespelare mindre.
- *Planskiss:* 19 spelare i basskissen, två målvakter och 9 mot 8 utespelare i två formationer, och fyra `platser` för spelare 20–23, varvade `a` och `b`. Rörelser: bara två eller tre passningar från målvakten genom backlinjen, inget skott (regel 11).

**O6-02, spel på kvarts plan.**
- *Måtten är valda för kvarts plan:* 48 × 32 ryms i 52 × 32. Två grupper ryms inte på halv plan, men det behövs inte, eftersom B1 tar 20 spelare där.
- *Mål:* `storlek: eget`, `bredd: 5`, alltså 7 mot 7-mål, och `material`: `{ typ: mal, antal: 2, anteckning: 7 mot 7-mål, 5 x 2 meter }` (regel 9). Ett fullstort mål i en 32 meter bred yta blir för stort.
- *Regler:* offside gäller på hela ytan. Det gör att övningen inte får `7mot7` (F1 (b)), och 48 meter klarar djupledskravet. Målvakten startar efter varje räddning och inspark med kort utspel, och mål inom tio sekunder efter en bollvinst räknas dubbelt, så att omställningen händer ofta.
- *Perioder:* fyra till sex minuter med en till två minuters vila (som B1).
- *Spelare:* åtta är tre mot tre plus målvakter. Vid udda antal spelar ett lag med en utespelare mer.
- Ytreferens: `något längre än stora planens straffområde är brett`.

**O6-03, inövade fasta situationer.**
- *Form:* vid ett mål med målvakt. Fyra roller: slagare, två löpare och avslutare. Gruppen kör tre varianter i tur och ordning: inkast i anfallszonen till fötterna med vägg och avslut, kort hörna med inspel längs marken bakåt till avslut, och spelad frispark runt en mur av koner eller stänger. I 9 mot 9 och 11 mot 11 tillkommer inspark till en back som vänder upp, och i 7 mot 7 målvaktens utspel från marken. Inga höga inlägg i grundformen (regel 17).
- *Rotation och kö (regel 12 och 15):* slagare blir löpare 1, löpare 1 blir löpare 2, löpare 2 blir avslutare, och avslutaren hämtar sin boll och ställer sig sist i kön. Kön står utanför ytan bakom slagarens plats och aldrig i en skottlinje. Med nio spelare är kön fyra, och det är taket för fasen (`aldrar-och-fokus.md`).
- *Målvakt:* lagets målvakt eller en spelare som vill, med handskar (regel 18). Utan målvakt skjuter man på tomt mål.
- *Varför 5–9:* fem är målvakt plus en roll var. Med färre blir det ingen variant. Med fler än nio blir kön för lång, och generatorn delar gruppen i två vid två mål.
- *Utan motståndare:* målvakten gör inte övningen till en övning med motståndare (`passuppbyggnad.md`). Muren är koner.
- Ytreferens: `stora planens straffområde, nästan dubbelt så djupt`.

**O6-04, fasta situationer, anfall mot försvar.**
- *Form:* det anfallande laget slår fem fasta situationer i följd från olika platser runt straffområdet: kort hörna, låg hörna till första stolpen, inkast i anfallszonen och spelad frispark. Det försvarande laget har målvakt, försvarar och kontrar efter bollvinst mot två konportar på den motsatta kortlinjen. Efter fem fasta situationer byter lagen roll. Ingen planerad nick (regel 17).
- *Poäng:* mål på fast situation ger två poäng, mål inom åtta sekunder efter en fast situation en poäng, och kontringsmål en poäng för försvararna.
- *Udda antal:* den extra spelaren är alltid med det anfallande laget.
- *Perioder (regel 1):* en omgång är fem fasta situationer i varje riktning. Mellan omgångarna en minuts vila, och laget som anfaller bestämmer sina varianter då.
- Ytreferens: `stora planens straffområde, nästan dubbelt så djupt`.

### 2.3 Nick och uthållighet (O6-05 till O6-08)

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O6-05 | Hörnor och inlägg med nick mot försvar | `del-spelovning` | `fasta-situationer`, `nickspel`, `forsvarsspel` | 2–3 | 15–19 | `tva-lag`, 7–13 | 1 | `9mot9`, `11mot11` | 8 / 12 / 15 | Per spelform. `11mot11`: 30 × 60, 138 vid 13, 257 vid 7. `9mot9`: 30 × 50, 115 vid 13, 214 vid 7. Taket 273 | `fasta-situationer` i Spelövning 100 % i 11 mot 11. Den enda hörnövningen med nick, `hornor-med-nickar`, gäller bara 13–14 år och 9 mot 9 (`plan-omgang-5b.md`, avsnitt 3.1) |
| O6-06 | Nickteknik i par, från kast till nick | `del-ovning` | `nickspel`, `passning-mottagning` | 1–3 | 13–19 | `par` | 0 | `9mot9`, `11mot11` | 5 / 8 / 12 | 10 × 6 per par, utan motståndare. 30 per spelare (golv 25) | `nickspel` har 0 övningar i Öva och Spelövning för 11 mot 11 och 1 i Spelövning för 9 mot 9. Ingen övning lär ut grundtekniken med lätta bollar, som `aldrar-och-fokus.md` säger att nickningen ska börja med |
| O6-07 | Intervallspel två mot två till tre mot tre med joker | `del-spelovning`, `del-spel` | `uthallighet`, `omstallning`, `spelbarhet` | 1–3 | 15–19 | `tva-lag`, 4–7 | 0 | `9mot9`, `11mot11` | 8 / 18 / 25 | 33 × 20. 94 vid 7. 165 vid 4 (tak 273) | `uthallighet`: 0 övningar och 100 % i Spelövning för 9 och 11 mot 11, och 0 övningar i Spel. Ryms två gånger på kvarts plan (36 × 23 × 2 = 1 656 av 1 664), alltså för 14 spelare |
| O6-08 | Dribblingsbana i intervaller | `del-ovning` | `uthallighet`, `dribbling`, `koordination` | 1–3 | 15–19 | `fri`, 4–20 | 0 | `9mot9`, `11mot11` | 8 / 16 / 20 | 36 × 20, en bestämd bana (undantag 3) | `uthallighet` och `koordination` i Öva: 0 övningar och 100 % i 11 mot 11. Ger kvarts plan med 20 spelare en Öva för de fokus som saknar en i dag (se nedan) |

**O6-05, hörnor och inlägg med nick.**
- *Varför bara 15–19 år:* 13–14 år har redan `hornor-med-nickar`, med nicktaket 10 minuter som övningens längsta tid fyller ensam. För 15–19 år är taket 20 minuter (R-082), och nickade hörnor hör till den fördjupning i fasta situationer som fasen ska ha (`aldrar-och-fokus.md`).
- *Ytan följer matchplanens bredd*, så att hörnflaggan står på rätt avstånd från stolparna: 30 × 60 meter i 11 mot 11 och 30 × 50 i 9 mot 9. Ange `yta` och `ytreferens` per spelform, och skriv båda måtten i `beskrivning` (`plan-omgang-5b.md`, avsnitt 1.3). Ritmotorn skalar om skissen mellan dem, eftersom sidförhållandet ändras med 20 procent, alltså under gränsen 25 (ADR 0019, punkt 4). Rita skissen för 11 mot 11.
- *Ytreferens:* `11mot11`: `knappt en tredjedel av 11 mot 11-planen, på hela bredden`. `9mot9`: `knappt halva 9 mot 9-planen`. Den första är ny i biblioteket, se fråga F7.
- *Nickmängd i siffror:* en omgång är sex hörnor eller inlägg. Varje anfallare nickar högst två gånger per omgång, och högst tre omgångar per pass. De första inläggen slås lätta och från nära håll.
- *Ledare 1:* ledaren håller räkningen på nickarna, som i `hornor-med-nickar`. Det är en säkerhetsuppgift och ska inte lämnas till spelarna. `ledaruppgift` krävs.
- *Nivå 2–3:* nickade hörnor i fart och närkamp är det svåraste nickmomentet (samma bedömning som för `hornor-med-nickar`).
- *Försvar:* försvararna markerar och rensar. Vid bollvinst spelar de ut till en konport vid straffområdets förlängning, så att försvaret avslutas med en passning och inte med en lång rensning mot ingen.

**O6-06, nickteknik i par.**
- *Form:* en kastar med händerna från tre till fem meter, den andra nickar tillbaka till kastarens händer. Steg två: nicka nedåt så att bollen studsar en gång före kastaren. Steg tre, svårare variant: nicka efter ett kort ansats-steg i sidled. Byt roll efter tio kast.
- *Nickmängd:* högst tio nickar per spelare och omgång och högst två omgångar för 13–14 år, högst tre för 15–19 år. Boll storlek 4 för 13-åringar (`spelformer.md`).
- *Trion vid udda antal (R-058):* den tredje står bredvid kastaren och tar över kastet efter varje tionde kast. Kastaren blir nickare och nickaren går ut. Etikett för kön: `Kastar nästa varv`.
- *Varför inte `7mot7`:* SvFF för in nickningen i spelformen 9 mot 9 (`aldrar-och-fokus.md`, *Nickning*). Se fråga F2.
- *Ingen ytreferens:* för liten eller ingen plandel med rätt form.

**O6-07, intervallspel.**
- *Arbete och vila i siffror (regel 16):* två mot två spelar 1,5 minuter och vilar 1,5. Tre mot tre, med eller utan joker, spelar 2–3 minuter och vilar 1,5. Fyra till sex perioder. Under vilan passar spelarna lugnt i par vid sidan av ytan.
- *Varför både Spelövning och Spel:* intervallerna är den regel som gör att fokuset händer (F4 i `plan-omgang-5.md`). Längst 25 minuter gör att övningen inte räcker som enda spel i ett 120-minuterspass, och det är rätt: ett spel i 39 minuter ska inte vara intervaller.
- *Joker vid udda antal:* jokern spelar med laget som har bollen och byts efter varje period, så att ingen spelar alla perioder i överläge.
- *Mål:* två minimål per sida eller ett minimål i varje ände, utan målvakt, så att spelet går fort.
- *Varför bara 15–19 år:* intervaller med hög puls hör till fasen där kroppen tål målinriktad uthållighetsträning (`plan-omgang-5.md`, F3). 13–14 år får uthållighet genom vanliga smålagsspel och ersättningsfokus.
- Ytreferens: `ungefär tre fjärdedelar av stora planens straffområde, några steg djupare`.

**O6-08, dribblingsbana i intervaller.**
- *Form:* en sluten bana: slalom mellan koner med boll, en sträcka där bollen lämnas och spelaren tar sig över tre låga hinder och tar upp bollen igen, en vändning med bollen och en acceleration med bollen på raksträckan. Varje spelare har egen boll. Spelarna startar fem sekunder efter varandra.
- *Arbete och vila i siffror:* 3 minuter arbete och 1,5 minuters vila, fyra till fem omgångar. Spelaren ska klara samma antal varv i varje omgång.
- *Ytan bedöms enligt undantag 3,* eftersom alla följer en bestämd bana: minst 2 meter mellan banans delar, och delarna korsar inte varandra. Ingen ytreferens: stationer och fasta positioner.
- *Varför 4–20 i en grupp:* banan ryms på kvarts plan också med 20 spelare. Då finns en Öva för 20 spelare på kvarts plan, och den ger ersättning för fler fokus än i dag: `forsvarsspel`, `snabbhet` och `skadeforebyggande` via `koordination`, och `ett-mot-ett` och `lek` via `dribbling` (R-121). I dag har de inget alls i det läget.
- *Låga hinder* ritas som en liten `ruta` med etiketten `Hinder` (README, *Behov som saknar en egen form*).

### 2.4 Försvar i linje, djupled, målvakt och uppbyggnad (O6-09 till O6-12)

O6-09, O6-10 och O6-12 har samma yta, 45 × 32 meter (regel 7). Då kan Öva och Spelövning i samma pass använda samma koner, och ytan ryms på kvarts plan.

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O6-09 | Backlinjen i linje: kliv, fall och täck | `del-ovning` | `forsvarsspel`, `omstallning` | 1–3 | 13–19 | `tva-lag`, 8–15 | 0 | `9mot9`, `11mot11` | 8 / 12 / 20 | 45 × 32. 96 vid 15. 180 vid 8 (tak 181). Längd 45 | `forsvarsspel` i Öva 92,9 % i 11 mot 11 och 69,6 % i 9 mot 9. `omstallning` i Öva 0 övningar och 100 % i 11 mot 11. `forsvarsspel -> ett-mot-ett` är den näst vanligaste ersättningen, 24 195 gånger |
| O6-10 | Försvara djupet: backlinje mot anfall med offside | `del-spelovning` | `forsvarsspel`, `speluppbyggnad`, `omstallning` | 1–3 | 13–19 | `tva-lag`, 8–15 | 0 | `9mot9`, `11mot11` | 8 / 15 / 25 | 45 × 32. 96 vid 15. 180 vid 8. Längd 45 | Spelövning i 11 mot 11: `forsvarsspel` och `omstallning` 78,6 %, `speluppbyggnad` 66,5 %. I 9 mot 9: 80,7 %, 80,0 % och 74,6 %. Den enda spelövningen som ryms på kvarts plan med 9–15 spelare för de fokusen |
| O6-11 | Målvaktsduell: räddning och snabbt utspel | `del-spelovning` | `malvaktsspel`, `avslut`, `omstallning` | 1–3 | 13–19 | `tva-lag`, 6–10 | 0 | `7mot7`, `9mot9`, `11mot11` | 8 / 15 / 25 | 36 × 30. 108 vid 10. 180 vid 6 | `malvaktsspel` i Spelövning: 0 övningar och 100 % i 11 mot 11, 98,1 % i 9 mot 9 och 80,6 % i 7 mot 7. Målvaktsspel kan aldrig fyllas med ersättning (R-121). `malvaktsspel -> avslut` 13 764 gånger i Öva |
| O6-12 | Bygg upp från målvakten genom lagdelarna | `del-ovning` | `speluppbyggnad`, `malvaktsspel`, `passning-mottagning` | 1–3 | 13–19 | `fri`, 6–12 | 0 | `7mot7`, `9mot9`, `11mot11` | 8 / 12 / 20 | 45 × 32, med halvaktiv press. 120 vid 12. 240 vid 6, 33 % över 181. Längd 45 | `speluppbyggnad` i Öva: 0 övningar och 100 % i 11 mot 11, 80,4 % i 9 mot 9 och 76,3 % i 7 mot 7. `speluppbyggnad -> passning-mottagning` 20 400 gånger |

**O6-09, backlinjen i linje.**
- *Form:* ett mål med målvakt i ena kortsidan. Tre till fem försvarare i en linje framför målet. Tre till sex anfallare passar fritt i en zon framför linjen, med halvt tempo i början. Linjen rör sig efter bollen: den faller när bollhållaren är vänd framåt utan press, och den kliver upp när bollen spelas bakåt eller bollhållaren pressas. Anfallarna får löpa bakom linjen och få bollen där, och offside gäller. Vinner försvararna bollen spelar de den genom en av två konportar vid den motsatta kortlinjen (omställning).
- *Med motståndare:* anfallarna är halvaktiva, men de kan ta sig bakom linjen, så golvet 90 gäller (`passuppbyggnad.md`, *Med eller utan motståndare*).
- *Kommunikation i stället för ledare:* målvakten eller mittbacken ropar "upp" och "fall". Ledaren står bakom målet och rättar. Därför ledarbehov 0.
- *Fler än tolv spelare:* anfallarna går i två vågor som byter efter varje anfall. Vågen som väntar står utanför ytan bakom konportarna och räknas inte på ytan (`passuppbyggnad.md`, *Så räknas talet fram*, punkt 4).
- *Udda antal:* den extra spelaren är anfallare.
- *Bredden 32 meter* är smalare än stora planens straffområde. Det är avsiktligt: en kompakt backlinje på fyra täcker ungefär den bredden, och det är kompaktheten som övas.
- Ytreferens: `något längre än stora planens straffområde är brett`.

**O6-10, försvara djupet.**
- *Form:* samma yta som O6-09, men fullt spel. Försvarslaget har målvakt och tre till fem i backlinjen, anfallslaget tre till sex spelare och en joker vid udda antal som spelar med anfallarna. Anfallarna anfaller målet, offside gäller. Vinner försvararna bollen ska de bygga upp via målvakten eller en back och spela in bollen till en medspelare som tar emot i en zon på 5 meter vid den motsatta kortlinjen (speluppbyggnad). Lyckas det får försvarslaget en poäng.
- *Omstart:* efter mål, poäng eller utboll startar anfallarna med en ny boll från sin kortlinje.
- *Perioder:* tre minuter spel och en minuts vila. Byt roller mellan lagen varannan period.
- *Lättare variant för nivå 1:* ingen offside, och anfallarna har en spelare färre.
- Ytreferens: `något längre än stora planens straffområde är brett`.

**O6-11, målvaktsduell.**
- *Form:* två mål med målvakt, ingen mittzon. Två mot två till fyra mot fyra ute. Mål räknas bara på skott som tas utanför en markering ungefär 8 meter från målet, så att målvakterna får många skott men inga från nära håll. Efter varje räddning startar målvakten ett nytt anfall inom sex sekunder, med kast, utspel med foten eller i 9 mot 9 och 11 mot 11 en inspark. Det ger både målvaktsspel och omställning.
- *Avståndet (regel 11):* med 36 meter mellan målen är inget skott längre än cirka 20 meter. Skissen visar ett skott från cirka 12–15 meter.
- *Säkerhet (regel 18):* handskar till den som står i mål. Står en utespelare i mål placeras skotten.
- *Målvakter:* lagets egna målvakter står hela tiden om de finns. Annars byts målvakten varje period, och ingen tvingas.
- *Perioder:* tre minuter spel och en minuts vila.
- *Udda antal:* ett lag spelar med en utespelare mer.
- *Varför `7mot7` är tillåtet:* övningen bygger inte på någon regel som saknas i 7 mot 7. Insparken nämns bara som ett av tre sätt att starta.
- Ytreferens: `ungefär stora planens straffområde, nästan dubbelt så djupt`.

**O6-12, bygg upp från målvakten.**
- *Form:* målvakt, två till fyra backar, en eller två mittfältare och en anfallare bygger upp från målet till en målzon på 5 meter i den andra änden. En eller två spelare är halvaktiva pressare: de stänger passningsvägar men tar inte bollen. Efter tre uppbyggnader byter en pressare roll med en uppbyggare i tur och ordning, så att alla pressar lika ofta (regel 15).
- *Målvakten startar med bollen vid fötterna eller i händerna.* I 9 mot 9 och 11 mot 11 startar varannan uppbyggnad med inspark. I 7 mot 7 lägger målvakten ned bollen, som i matchen. Därför får övningen alla tre spelformerna (F1 (a)).
- *Med motståndare:* pressarna gör att golvet 90 gäller.
- *Djupled:* uppbyggnad genom lagdelar, alltså längd minst 40 (regel 8).
- *Svårare variant för nivå 3:* pressarna får vinna bollen, och då ska de göra mål inom åtta sekunder.
- Ytreferens: `något längre än stora planens straffområde är brett`.

### 2.5 Nivå 3, spelbarhet och avslut (O6-13 och O6-14)

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Ålder | Grupptyp, spelare | Ledare | Spelformer | Tid | Yta | Hål |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O6-13 | Spelvändning: byt sida och gör mål | `del-spelovning` | `spelbarhet`, `passning-mottagning`, `speluppbyggnad` | 2–3 | 13–19 | `tva-lag`, 6–11 | 0 | `7mot7`, `9mot9`, `11mot11` | 8 / 15 / 25 | 38 × 28. 97 vid 11. 177 vid 6 | Spelövning i 11 mot 11: `spelbarhet` 64,1 %, `passning-mottagning` och `speluppbyggnad` 66,5 %. Bara B7 har de fokusen i dag, med kortast 10 och längst 20. En nivå 3-övning där bollen ska hållas och vändas i matchtempo |
| O6-14 | Avslut i överläge vid straffområdet | `del-ovning`, `del-spelovning` | `avslut`, `spelbarhet`, `ett-mot-ett` | 1–3 | 13–19 | `tva-lag`, 4–9 | 0 | `7mot7`, `9mot9`, `11mot11` | 6 / 12 / 25 | 30 × 30. 100 vid 9. 225 vid 4, 24 % över 181 | `avslut` i Spelövning 74,6 % i 11 mot 11 och 62,2 % i 9 mot 9. Med 4 spelare finns i dag bara B6 i Spelövning för 15–19 år |

**O6-13, spelvändning.**
- *Form:* två lag med ett minimål i varje ände och en kantzon på 4 meter längs varje långsida. Ett mål räknas dubbelt om bollen under anfallet har tagits emot i båda kantzonerna, alltså om laget har vänt spelet. Ingen får stå kvar i en kantzon; man löper in, tar emot och spelar vidare.
- *Varför nivå 2–3:* att vända spelet förutsätter att laget kan hålla bollen över flera passningar i matchtempo, vilket är det `nivaer.md` beskriver för nivå 3. En nivå 1-grupp tappar bollen innan regeln hinner bli aktuell. Den lättare varianten, ett mål räknas efter en kantzon, gör den användbar på nivå 2.
- *Svårare variant (regel 19):* högst två touchar i kantzonen.
- *Perioder:* fyra minuter spel och en minuts vila.
- *Udda antal:* en joker som spelar med laget som har bollen och inte får göra mål.
- *Ingen offside och inget krav på längd:* ytan har ingen försvarslinje att passera.
- Ytreferens: `ungefär stora planens straffområde, nästan dubbelt så djupt`.

**O6-14, avslut i överläge.**
- *Form:* ett mål med målvakt. Anfallarna startar från en linje 25 meter från målet och anfaller i överläge: två mot en vid fyra spelare (med målvakten), upp till fyra mot tre vid åtta. Försvararna som vinner bollen spelar den över anfallarnas startlinje.
- *Rotation (regel 15):* skriv rotationen för varje antal 4–9 så att den är entydig. Förslag: efter varje anfall blir den som avslutade försvarare, den försvarare som har försvarat längst går till anfallarnas kö, och målvakten står kvar. Vid nio står en spelare i kö utanför ytan bakom startlinjen, inte i någon skottlinje.
- *Varför både Öva och Spelövning:* överlägen med riktning och mål får ha båda (F4 i `plan-omgang-5.md`). Generatorn lägger den aldrig i båda delarna i samma pass (R-070).
- *Skott (regel 11):* inget skott i skissen längre än cirka 16 meter.
- *Säkerhet (regel 18):* handskar till den som står i mål. Står en utespelare i mål placeras skotten.
- Ytreferens: `tre fjärdedelar av stora planens straffområde, nästan dubbelt så djupt`.

### 2.6 Kontroll: vilka fokus kärnan kan fylla direkt för 15–19 år

Efter omgång 6 har 15–19 år 22 övningar: B1–B8 och O6-01 till O6-14. Tabellen visar vilka övningar som träffar varje fokus direkt i Öva och Spelövning. Ett pass har bara kärna på valt fokus om två **olika** övningar fyller de två delarna (R-070).

| Fokus | Öva | Spelövning | Två olika övningar |
|---|---|---|---|
| `passning-mottagning` | B3, B5, O6-03, O6-06, O6-12 | B7, O6-13 | ja |
| `spelbarhet` | B3, O6-14 | B7, O6-07, O6-13, O6-14 | ja |
| `avslut` | B5, O6-03, O6-14 | B8, O6-11, O6-14 | ja |
| `ett-mot-ett` | B6, O6-14 | B6, O6-14 | ja |
| `dribbling` | B6, O6-08 | B6 | ja (O6-08 och B6) |
| `snabbhet` | B6 | B6 | nej, samma övning. Ersättning |
| `speluppbyggnad` | O6-12 | B7, O6-10, O6-13 | ja |
| `forsvarsspel` | O6-09 | B8, O6-04, O6-05, O6-10 | ja |
| `omstallning` | O6-09 | B8, O6-04, O6-07, O6-10, O6-11 | ja |
| `fasta-situationer` | O6-03 | O6-04, O6-05 | ja |
| `malvaktsspel` | B5, O6-12 | O6-11 | ja |
| `uthallighet` | O6-08 | O6-07 | ja |
| `koordination` | O6-08 | – | nej. Ersättning `snabbhet`, `ett-mot-ett` |
| `bollkansla` | – | – | nej. Ersättning |
| `lek` | – | – | nej. Ersättning |
| `skadeforebyggande` | – | – | nej. Hör hemma i uppvärmningen (R-044) |

12 av de 16 fokus som enkelfokussvepet prövar kan alltså ge kärna på valt fokus, mot 6 i dag. De fyra sista är R för fasen och klarar sig med ersättning (`plan-omgang-5.md`, F5). `nickspel` prövas bara tillsammans med ett annat fokus (R-083), och då fylls kärnan av det andra fokuset.

**Kvarts plan med 20 spelare, Öva.** B3, B5, O6-06 och O6-08 ryms. Med R-121 kan då varje fokus fylla Öva: `ett-mot-ett`, `lek` och `bollkansla` via `dribbling` (O6-08), `forsvarsspel`, `snabbhet` och `skadeforebyggande` via `koordination` (O6-08), `speluppbyggnad`, `omstallning` och `fasta-situationer` via `passning-mottagning` (B3) och `malvaktsspel` direkt (B5). Det är därför "inget pass" kan gå ned mot golvet i avsnitt 0.3.

### 2.7 Prioritet om omgången behöver bli mindre

Planen säger 12–14 övningar. Alla 14 behövs för målen i avsnitt 1. Om omgången ändå ska bli mindre tas de bort i den här ordningen, med minst effekt först:

1. **O6-05** (nickade hörnor för 15–19 år). Påverkar inget mått i enkelfokussvepet, eftersom `nickspel` inte prövas ensamt, och O6-04 täcker fasta situationer i Spelövning.
2. **O6-01** (stora spelet). Påverkar inget mått, eftersom B1 redan fyller spelet för 20 spelare. Men det är det enda matchlika 11 mot 11-spelet i banken, och granskningen av paket B lovade det till omgång 6.

Övriga tolv ska vara med.

## 3. Fotbollsfrågor som jag avgör

**F1. Vilket tak gäller för en övning för 13–19 år? 181 kvadratmeter per spelare, alltså 9 mot 9-matchens trängsta värde. En övning som bara gäller 15–19 år prövas mot 273.** Det är så jag räknade i granskningen av paket B, och det står öppet under *Kvarstår* där. Skälet: taket prövas mot den spelform som föreslås för övningens ålder (`plan-omgang-5.md`, F2), och när 13-åringar ingår är det 9 mot 9. Att pröva mot det högre taket skulle släppa igenom ytor som är för glesa för de yngsta i spannet. Se beslut B3 om att föra in det i `passuppbyggnad.md`.

**F2. Nickövningar märks `9mot9` och `11mot11`, inte `7mot7`, även för 13–14 år.** R-080 sätter gränsen vid 13 år, men SvFF för in nickningen i *spelformen* 9 mot 9 (`aldrar-och-fokus.md`, *Nickning*). Ett lag med 13-åringar som spelar 7 mot 7 har inte börjat med den spelformen, och spelformen är byggd för att bollen ska vara på marken. Det är en försiktigare läsning än regeln kräver, och den kostar ingenting i täckningen, eftersom `nickspel` aldrig är ersättningsfokus.

**F3. Uthållighet i intervaller gäller bara 15–19 år.** Det följer `plan-omgang-5.md`, F3. 13–14 år får uthållighet genom vanliga smålagsspel, och när `uthallighet` väljs fylls kärnan med ersättning (`spelbarhet`, `omstallning` i Spelövning). Under tillväxtspurten ska belastningen varieras, inte drivas med pulsintervaller (`aldrar-och-fokus.md`).

**F4. En övning för fasta situationer har ingen planerad nick, om den inte är märkt `nickspel`.** Korta hörnor, låga hörnor, inkast och spelade frisparkar är riktiga varianter som lag på alla nivåer använder. Därmed kan fasta situationer tränas i varje pass utan att nicktaket berörs, och nickningen hålls i övningar där den syns i märkningen (R-081). En boll som av en slump går i luften och nickas undan är ingen planerad nick.

**F5. En spelövning för 13–19 år får vara 25 minuter.** `aldrar-och-fokus.md` anger 15–25 minuter i samma form för 15–19 år, och R-034 kapar själv vid 20 minuter för 13–14 år. Villkoret är att övningen har perioder med vila eller rollbyten (designregel 1), så att det inte blir 25 minuter i samma intensitet.

**F6. Det stora spelet har avbytare, inte joker.** I 11 mot 11 är poängen att varje spelare har en position. En joker som alltid spelar med laget som har bollen gör att formationen inte går att träna. Den eller de som blir över byts in var femte minut. Vid 19 spelare spelar ett lag med en utespelare mindre, och det är matchlikt.

**F7. Två nya ytreferenser: *knappt en tredjedel av 11 mot 11-planen, på hela bredden* och *knappt halva 9 mot 9-planen*.** Biblioteket (`ytreferenser.md`, avsnitt 3.2) har *hela, halva, en fjärdedel* av en spelforms plan. En tredjedel på hela bredden är samma sorts jämförelse: ledaren ser mittlinjen och sidlinjerna och kan dela planens längd i tre. Jag för in raden i biblioteket när O6-05 granskas. Den kräver inget nytt beslut, eftersom den ryms inom konvention 3.

**F8. Ledarbehov 0 för försvar i linje, 1 för nickade hörnor.** I O6-09 och O6-10 styrs linjen av spelarnas egna rop, som i matchen, och ledaren rättar från sidan. Det ska spelarna lära sig, så övningen ska inte vara beroende av en ledare. I O6-05 räknar ledaren nickar, och det är en säkerhetsuppgift som inte lämnas till spelarna.

**F9. Bredden 32 meter räcker för en backlinje.** En kompakt backlinje på fyra står på ungefär 30–35 meters bredd när bollen är centralt. Det är kompaktheten som övas i O6-09 och O6-10, inte att täcka hela planens bredd. Den ger också ytan som ryms på kvarts plan (designregel 7).

**F10. Halvaktiva motståndare räknas som motståndare.** I O6-09 kan anfallarna löpa bakom linjen, och i O6-12 stänger pressarna passningsvägar. Golvet 90 gäller för båda (`passuppbyggnad.md`, *Med eller utan motståndare*). O6-03 och O6-08 har ingen motståndare, och där gäller 25.

**F11. Vad "fler övningar för nivå 3" betyder.** Alla övningar för 15–19 år utom B8 har redan `niva-3`, så nivå 3 saknar inte övningar i antal. Det som saknas är övningar som verkligen utmanar en nivå 3-grupp. Därför har varje ny övning en svårare variant enligt designregel 19, och två övningar, O6-05 och O6-13, är bara 2–3, eftersom innehållet förutsätter en grupp som håller bollen i matchtempo. Fler övningar med bara 2–3 vore fel, eftersom nivå 1 då förlorar övningar (R-025, R-026).

## 4. Förslag om två godkända övningar: tiderna i B7 och B8

Orsak 1 och 2 i avsnitt 0.2 gäller också de två spelövningar för 15–19 år som redan finns. Båda har kortast 10 och längst 20 minuter, och kan därför varken fylla Spelövning i 30-minuterspass (3–9 minuter) eller ensamma i 120-minuterspass (23–29). Ändringen är liten och ger effekt i alla celler för 13–19 år. Den kräver användarens beslut, eftersom filerna är godkända (beslut B2).

| Övning | Fält | Nu | Nytt |
|---|---|---|---|
| `spela-framat-i-positionsspel` (B7) | `tid` | 10 / 16 / 20 | 8 / 16 / 25 |
| `spela-framat-i-positionsspel` (B7) | `organisation`, ny mening sist | – | `Spela i perioder om fem till sex minuter med en minuts vila.` |
| `omstallning-i-overlage-till-mal` (B8) | `tid` | 10 / 15 / 20 | 8 / 15 / 25 |
| `omstallning-i-overlage-till-mal` (B8) | `organisation`, ny mening sist | – | `Spela i perioder om tre minuter med en minuts vila, eftersom de åtta sekunderna håller tempot högt hela tiden.` |

Inget annat ändras: ingen yta, inga spelare och ingen skiss. Meningen om perioder behövs för att 25 minuter ska vara försvarbart (F5). B7:s mening om att lagen byter sida efter halva tiden står kvar och säger inte emot perioderna.

*Kontroll:* med kortast 8 ryms båda i Spelövning för 30-minuterspass (måltid 6, alltså 3–9). Med längst 25 fyller var och en Spelövning ensam i 120-minuterspass för 15–19 år (måltid 26, alltså 23–29). För 13–14 år kapar R-034 vid 20 minuter som förut.

## 5. De fem småsakerna från genomgången av 5B

Alla fem är godkända övningar som jag såg när 5B gicks igenom (`plan-omgang-5b.md`, avsnitt 3.1, 4.1 och noten om mål i 2.3). Ingen av dem gör en övning farlig eller fel i sak, men alla ska rättas när filen öppnas nästa gång (`passuppbyggnad.md`, *Vad som händer när en övning inte håller måttet*, sista punkten). Varje ändrad fil får en ny post i `granskning` som säger vad som ändrats och varför.

| Övning | Ålder | Vad som är fel | Exakt ändring | I omgång 6? |
|---|---|---|---|---|
| `forsvara-tillsammans` | 8–9 | Över taket vid minsta antal: 20 × 14 = 280 kvadratmeter delat på 4 är 70 per spelare, 56 % över taket 45 (5 mot 5). Godkänd 2026-09-14, innan taket var formulerat | `organisation`, ny mening sist: `Med fyra eller fem spelare spelas på en mindre yta, ungefär 16 x 10 meter, eftersom två mot två annars blir för glest.` `planskiss.beskrivning`, ny mening sist: `Med fyra eller fem spelare används en mindre yta, ungefär 16 x 10 meter.` `yta` står kvar på 20 × 14, så att R-092 räknar med det största måttet (samma lösning som B2). *Kontroll:* 160 / 4 = 40, under taket 45. 160 / 5 = 32, över golvet 25. Skissens beskrivning blir cirka 280 tecken, under taket 300 | Nej, omgång 7, som öppnar 8–12 år |
| `driva-forbi-i-par` | 8–9 | Under golvet: 6 × 6 = 36 kvadratmeter för två är 18 per spelare, golvet är 25. Godkänd före golvet 2026-09-23 | `yta.alla` 8 × 7. `beskrivning` och `planskiss.beskrivning`: "6 x 6 meter" blir "8 x 7 meter". `planskiss.omrade` och `ruta` 8 × 7. Konerna `(0, 2.5)`, `(0, 4.5)`, `(8, 2.5)`, `(8, 4.5)`. `anf` till `(0.5, 3.5)` och bollen till `(0.8, 3.5)`. `fors` till `(5.5, 3.5)`. Dribblingen: `till: { x: 7.5, y: 3.5 }`, `via: [{ x: 4, y: 7.5 }]`. Löpningen: `till: { x: 4.5, y: 3.5 }`. Kön oförändrad, `riktning: 180`, `avstand: 2`. *Kontroll:* 56 / 2 = 28, över golvet 25 och under taket 45. Kurvan når y = 5,5 vid x = 4, alltså 1,5 meter innanför den nedre linjen. Räknad som Bézierkurva håller den minst cirka 1,4 meter till försvararens startpunkt och 1,9 meter till hans slutpunkt. Kön står på `(-1.5, 3.5)`, utanför ytan och bakom anfallarens port. Ingen ytreferens, som förut | Nej, omgång 7 |
| `fyra-horn-med-boll` | 8–9 | Saknar meningen om mindre yta för en liten grupp, som tillägget 2026-10-07 i `passuppbyggnad.md` kräver av övningar med egen boll utan motståndare | `organisation`, ny mening sist: `Är ni färre än nio, gör rutan ungefär 13 x 13 meter, så att spelarna måste titta upp för att inte krocka.` *Kontroll:* 169 / 6 = 28 kvadratmeter per spelare, över golvet 10 för egen boll. Skiss och `yta` oförändrade | Nej, omgång 7 |
| `omstallningsspel-9mot9` | 13–14 | Tre saker. Namnet säger 9 mot 9 men övningen visas i 7, 9 och 11 mot 11 sedan 5B. `material` säger `mal` utan storlek, så ett 11 mot 11-lag kan ta fullstora mål till en 22 meter bred yta. `anpassning.fler_spelare` säger "gör ytan större", vilket säger emot `yta` och `spelare.max` (samma fel som B8 hade) | `namn`: `Omställningsspel med målvakt` (`id` ändras inte). `material`, målen: `{ typ: mal, antal: 2, anteckning: 7 mot 7-mål eller 9 mot 9-mål, inte fullstora }`. `anpassning.fler_spelare`: `Vid fler än tio spelare, bygg en andra yta med samma mått bredvid.` Övningen har ingen planskiss, så inget annat ändras | **Ja.** Den hör till 13–19 år. Namnbytet var beslut B1 i `plan-omgang-5b.md` och är inte genomfört, se beslut B4 |
| `hornor-med-nickar` | 13–14 | Kan inte märkas 7 eller 11 mot 11, eftersom ytan följer 9 mot 9-planens bredd (`plan-omgang-5b.md`, avsnitt 3.1). Granskningen 2026-09-24 föreslog också att det står hur många inlägg en omgång är | Spelformerna står kvar som `[9mot9]`. Hörnor för andra spelformer tas av O6-04 (utan nick, 13–19 år, 7, 9 och 11 mot 11) och O6-05 (med nick, 15–19 år, 9 och 11 mot 11). I `beskrivning`, efter meningen om högst två nickar: `En omgång är sex hörnor.` | **Ja**, bara meningen. Om beslut B1 blir en ny regel behövs ingen ändring i filen |

*Varför de tre för 8–9 år väntar till omgång 7:* omgång 6 granskas mot reglerna för 13–19 år, och omgång 7 öppnar ändå 8–12 år för nya övningar. Två av ändringarna rör skissen och kräver att jag räknar om den, och det görs bäst i samma granskning som andra skisser för samma ålder. Ingen av de tre är en säkerhetsfråga: `driva-forbi-i-par` är trång, men duellen är för 8–9-åringar i låg fart, och försvararen spelar på bollen enligt coachningspunkten.

## 6. Beslut som behövs

**B1. Ska en övning med `nickspel` bara kunna väljas när ledaren har valt `nickspel`?** I dag räcker det att övningen träffar *något* av ledarens fokus (R-040, R-041). `hornor-med-nickar` kan därför hamna i ett pass för 13-åringar där ledaren bara har valt `fasta-situationer`, och O6-06 i ett pass där ledaren bara har valt `passning-mottagning`. Nicktaket (R-082) gäller fortfarande, så det blir aldrig mer än 10 minuter, men ledaren har inte bett om nickning. R-121 säger i sin motivering att "nickning ska bara förekomma när ledaren själv har valt den", men ingen regel kräver det. Jag har kontrollerat i `src/regelmotor/` att det enda som stoppar nickövningar, utöver åldern och taket, är att `nickspel` aldrig blir ersättningsfokus (`FOCUS_NEVER_SUBSTITUTE` i `keys.ts`). *Rekommendation:* en ny regel i grupp 9, **R-086**: "Krav. En övning som har `nickspel` bland sina fokusområden kan bara väljas av generatorn, och bara visas som alternativ vid byte (R-104, R-106), om ledaren har valt `nickspel`." Det är en säkerhetsregel och bör komma före omgång 6 godkänns. Om svaret är nej ska O6-06 bara ha fokus `nickspel`, så att den inte väljs för `passning-mottagning`.

**B2. Nya tider för B7 och B8** (avsnitt 4). Filerna är godkända, så ändringen kräver ett nytt godkännande. *Rekommendation:* ja, i omgång 6:s pull request som en egen commit, så att den kan granskas och mätas för sig.

**B3. Taket för övningar för 13–19 år ska stå i `passuppbyggnad.md`.** F1 avgör det för den här omgången, men dokumentet är godkänt och säger det inte. *Rekommendation:* för in en mening under *Matchens trängsta värde används som tak*: "En övning som gäller både 13–14 och 15–19 år prövas mot 9 mot 9-matchens värde, 181 kvadratmeter per spelare. En övning som bara gäller 15–19 år prövas mot 273." Det är ett granskningskriterium, ingen generatorregel.

**B4. Namnet på `omstallningsspel-9mot9`.** Beslut B1 i `plan-omgang-5b.md` föreslog *Omställningsspel med målvakt*, och det är inte genomfört. *Rekommendation:* gör det i omgång 6, tillsammans med de två andra ändringarna i filen (avsnitt 5). `id` ändras inte.

**B5. Antalet övningar.** *Rekommendation:* alla 14. Om omgången ska bli mindre gäller ordningen i avsnitt 2.7.

## 7. Källor

| Källa | Använd för | Läst |
|---|---|---|
| `docs/doman/tackning-2026-10-07.md` | Alla siffror om körfall, "inget pass", fylld kärna, kärna på valt fokus, delar som inte kan fyllas och ersättningar | 2026-10-07 |
| `content/ovningar/*.yaml`, de 21 övningarna för 13–19 år och de fem i avsnitt 5, grenen `omgang/6` | Ålder, spelformer, nivå, passdelar, spelare, tid, yta och text | 2026-10-07 |
| `src/regelmotor/` (sökning på `nickspel`) | Att ingen regel i koden begränsar nickövningar till pass där `nickspel` är valt (beslut B1) | 2026-10-07 |
| SvFF:s nationella spelformer och planstorleksdokumentet, via `docs/doman/spelformer.md` (hämtade 2026-09-11) | Planmått, målstorlekar, offside och inspark | 2026-10-07 |
| SvFF, *Får barn nicka?*, via `docs/doman/aldrar-och-fokus.md` (hämtad 2026-09-11) | Att nickning förs in i spelformen 9 mot 9 (F2) | 2026-10-07 |
| `docs/doman/granskning-omgang-5.md` och `granskning-planskisser.md` | Designreglerna 6 och 10–19 | 2026-10-07 |

Inga nya externa källor är hämtade för planen. Övningarnas innehåll, måtten, målen och frågorna F1–F11 är min bedömning som tränarutbildare. Övningarna är allmänna former (smålagsspel, fasta situationer, backlinjeträning, intervallspel, nickteknik, uppbyggnad från målvakten), och planen beskriver dem med egna ord.
