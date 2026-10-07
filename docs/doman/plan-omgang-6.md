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
