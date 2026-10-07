Status: utkast

# Plan för omgång 5 av övningsbanken

**Ägare:** fotbollsexpert · **Skriven:** 2026-10-06 · **Underlag:** `docs/doman/tackning-2026-10-05.md` (körning med frö `tackning-1`), bankens 58 övningsfiler läsda 2026-10-06, `generatorregler.md`, `passuppbyggnad.md`, `fokusomraden.md`, `nivaer.md`, `spelformer.md`, `aldrar-och-fokus.md`, `ytreferenser.md` och `content/ovningar/README.md`.

Planen bygger på täckningsrapportens siffror och på min genomgång av vilka åldrar, spelformer, nivåer och passdelar varje övning är märkt med. Alla procenttal som inte står i rapporten är mina egna uträkningar ur rapportens tabeller, och de redovisas så att de går att kontrollera. Målen är mål, inte prognoser. De ska prövas genom att täckningsskriptet körs om efter varje omgång.

## 0. Det viktigaste först: varför det blir "inget pass"

Rapporten säger att 86 procent av underlagen ger "inget pass" i dag, och 81 procent med de 16 övningarna från omgång 4. Siffran är riktig, men den blandar två helt olika saker.

**Ingen av bankens 58 övningar gäller mer än en spelform, och ingen gäller utanför sin egen åldersfas.** Varje övning är märkt med exakt en spelform och exakt åldrarna 8–9, 10–12 eller 13–14. Samtidigt låter R-014 ledaren välja spelformen närmast före eller efter den föreslagna, och täckningsskriptet prövar alla tillåtna spelformer lika ofta. Ett underlag med en grannspelform, till exempel 11 år och 5 mot 5, kan därför aldrig få en övning i dag.

Jag delar därför körfallen i **celler**: ålder gånger spelform. Antalet körfall per cell följer av rapportens tabell per ålder, eftersom körfallen för en ålder delas lika mellan de spelformer som är tillåtna för åldern (kontroll: 3 mot 3 får 2 × 7 896 + 2 × 12 551 = 40 894, samma som rapporten).

| Cell | Typ | Körfall | Andel av alla | "Inget pass" efter CI-rättningen |
|---|---|---|---|---|
| 6–7 år, 3 mot 3 | föreslagen | 15 792 | 3,4 % | 100 % |
| 8–9 år, 5 mot 5 | föreslagen | 25 102 | 5,4 % | 0,3 % |
| 10–12 år, 7 mot 7 | föreslagen | 40 560 | 8,8 % | 4,0 % |
| 13–14 år, 9 mot 9 | föreslagen | 29 280 | 6,3 % | 15,0 % |
| 15–19 år, 11 mot 11 | föreslagen | 73 200 | 15,8 % | 100 % |
| 6–7 år, 5 mot 5 | granne | 15 792 | 3,4 % | 100 % |
| 8–9 år, 3 mot 3 | granne | 25 102 | 5,4 % | 100 % |
| 8–9 år, 7 mot 7 | granne | 25 102 | 5,4 % | 100 % |
| 10–12 år, 5 mot 5 | granne | 40 560 | 8,8 % | 100 % |
| 10–12 år, 9 mot 9 | granne | 40 560 | 8,8 % | 100 % |
| 13–14 år, 7 mot 7 | granne | 29 280 | 6,3 % | 100 % |
| 13–14 år, 11 mot 11 | granne | 29 280 | 6,3 % | 100 % |
| 15–19 år, 9 mot 9 | granne | 73 200 | 15,8 % | 100 % |
| **Summa** | | **462 810** | | **80,8 %** |

*Så är talen i sista kolumnen framräknade:* för 8 år är "inget pass" 25 138 av 37 653 efter CI-rättningen. Grannspelformerna 3 mot 3 och 7 mot 7 ger 100 procent, alltså 2 × 12 551 = 25 102. Resten, 36 av 12 551, är 5 mot 5, det vill säga 0,3 procent. Samma räkning för 10 år ger 540 av 13 520 = 4,0 procent och för 13 år 2 195 av 14 640 = 15,0 procent. Summan av alla celler blir 373 950, precis rapportens tal.

Tre slutsatser:

1. **I den föreslagna spelformen fungerar banken redan för 8–12 år** (0,3 och 4,0 procent). Hålen är 6–7 år och 15–19 år, där det helt saknas övningar, och 13–14 år, där 15 procent ger "inget pass".
2. **Grannspelformerna står för 60 procent av körfallen och ger alla "inget pass".** Det löses inte bäst med nya övningar, utan med att befintliga övningar märks med fler spelformer där fotbollen tillåter det (se avsnitt 4 och fråga F1).
3. **R-101 räknar ett pass som skapat så snart en av Öva, Spelövning och Spel kan fyllas.** Ett enda brett spel i `del-spel` tar därför bort nästan all "inget pass" i en cell. Det ger ett pass, men inte ett bra pass. Därför har planen två mål: att pass alls skapas, och att kärnan, Öva och Spelövning, kan fyllas.

## 1. Mål

### 1.1 Huvudmål

**Den föreslagna spelformen ska alltid ge ett pass.** I varje föreslagen cell ska "inget pass" vara högst 5 procent efter omgång 5. Det är det ledaren möter när hen tar appens förslag, och det är den vanligaste vägen genom formuläret.

### 1.2 Mål per spelform och åldersfas

| Cell | I dag (efter CI) | Efter omgång 5 | Efter omgång 5B (märkning) | Vad som gör det |
|---|---|---|---|---|
| 6–7 år, 3 mot 3 | 100 % | ≤ 5 % | ≤ 5 % | Paket A i omgång 5 |
| 6–7 år, 5 mot 5 | 100 % | ≤ 5 % | ≤ 5 % | Paket A märks också 5 mot 5 |
| 8–9 år, 5 mot 5 | 0,3 % | oförändrat | oförändrat | |
| 8–9 år, 3 mot 3 | 100 % | 100 % | ≤ 5 % | 5B |
| 8–9 år, 7 mot 7 | 100 % | 100 % | ≤ 5 % | 5B |
| 10–12 år, 7 mot 7 | 4,0 % | oförändrat | oförändrat | |
| 10–12 år, 5 mot 5 | 100 % | 100 % | ≤ 10 % | 5B |
| 10–12 år, 9 mot 9 | 100 % | 100 % | ≤ 5 % | 5B |
| 13–14 år, 9 mot 9 | 15,0 % | ≤ 5 % | ≤ 5 % | Paket B märks 13–19 år och 9 mot 9 |
| 13–14 år, 7 mot 7 | 100 % | ≤ 10 % | ≤ 5 % | Paket B märks också 7 mot 7, sedan 5B |
| 13–14 år, 11 mot 11 | 100 % | ≤ 5 % | ≤ 5 % | Paket B |
| 15–19 år, 11 mot 11 | 100 % | ≤ 5 % | ≤ 5 % | Paket B |
| 15–19 år, 9 mot 9 | 100 % | ≤ 5 % | ≤ 5 % | Paket B märks också 9 mot 9 |

### 1.3 Vad det betyder för helheten

Uträknat med körfallen i tabellen i avsnitt 0 och målen ovan, där varje mål antas nås precis:

| Läge | "Inget pass", alla körfall | "Inget pass", föreslagna celler |
|---|---|---|
| I dag, 42 godkända | 86,2 % | uträknat 53 % |
| Efter CI-rättningen, 58 | 80,8 % | 51,7 % |
| Efter omgång 5 | högst cirka 32 % | högst cirka 4 % |
| Efter omgång 5B | högst cirka 6 % | högst cirka 4 % |

Efter omgång 5 står de fyra grannceller som bara 5B löser (8–9 år i 3 mot 3 och 7 mot 7, 10–12 år i 5 mot 5 och 9 mot 9) för nästan hela resten, 131 324 körfall eller 28 procent.

### 1.4 Det som inte går att få till noll

Vissa underlag kan inte ge ett pass med motståndare, hur många övningar banken än har. Exempel: 20 spelare i 15–19 år på en kvarts plan. Golvet för yta per spelare med motståndare är 90 kvadratmeter i `fas-15-19` (`passuppbyggnad.md`), och 20 × 90 = 1 800 är mer än kvartsplanens 1 664 kvadratmeter (R-091), redan innan marginalerna i R-092 räknas. Därför ska varje paket ha minst en Öva-övning utan motståndare, som ryms även då. Då skapas ett pass via `del-ovning`, även om spelet inte får plats.

### 1.5 Ersättningsfokus

Ersättningsfokus (R-121) användes i 58,5 procent av kärnmomenten efter CI-rättningen. Omgång 5 prioriterar att pass alls skapas, och för 6–7 år och 15–19 år blir ersättningsfokus vanligt, eftersom paketen är små. Jag räknar med att andelen ligger kvar på ungefär 55–65 procent efter omgång 5. Målet om högst 40 procent gäller efter omgång 7, där hålen i kärnan för 8–12 år fylls (avsnitt 4).

## 2. Prioriterad lista över övningar till omgång 5

### 2.1 Designregler för alla övningar i omgången

Reglerna följer direkt av generatorreglerna och av varför dagens 9 mot 9 för 13–14 år ger "inget pass" i 15 procent av fallen trots 14 övningar (fasta storlekar, ledarstyrda övningar och snäva spelarspann).

1. **Brett spelarspann.** För `fri` och `tva-lag`: `spelare.max` minst 2 × `spelare.min` − 1. Då fungerar varje antal från `spelare.min` och uppåt (R-051, R-052, not i `passuppbyggnad.md`). Minst en övning per passdel ska ha `spelare.min` högst 4, eftersom täckningssvepet och verkligheten har grupper om 4.
2. **Ledarbehov 0** där det är fotbollsmässigt rätt. En ledarstyrd övning faller bort med en ledare så fort gruppen måste delas (R-055).
3. **Nivå 1–3** när varianterna bär det. Nivåmatchningen är strikt (R-025, R-026). Varje passdel ska ha minst en övning för varje nivå.
4. **Tid som täcker måltiderna.**
   - 6–7 år: kortast 5, längst 8 i Uppvärmning, Öva och Spelövning. Spelet ska klara 10–20 minuter. Med 60 minuter är Öva 12 minuter och Uppvärmning 12 minuter, och båda kräver då två olika övningar (R-034, R-035). Därför två Öva-övningar som delar fokusområde.
   - 13–19 år: längst 25 minuter i Uppvärmning, Öva och Spelövning, och spelet längst 40 minuter. Med 120 minuter är måltiden för Spel 39 och för Uppvärmning och Spelövning 26.
5. **Flera passdelar där det är rätt** (se fråga F4).
6. **Flera spelformer** enligt fråga F1. Paket A märks `3mot3` och `5mot5`, paket B `9mot9` och `11mot11`, och `7mot7` där övningen inte är bunden till 9 mot 9- eller 11 mot 11-regler.
7. **Planskiss och ytreferens** på varje övning, enligt användarens beslut. Ytreferensen ska ges per spelform när måtten eller plandelarna skiljer sig (`ytreferenser.md`, avsnitt 3.4). Om en övning hör till kategorierna i `ytreferenser.md`, avsnitt 4, se beslut B4.
8. **Yta:** golvet för yta per spelare följer åldern som vanligt. För övningar som gäller både 13–14 och 15–19 år gäller det strängaste golvet: 90 kvadratmeter per spelare med motståndare och 25 utan, och minsta längd 40 meter när övningen övar djupled (`passuppbyggnad.md`, fråga F2).

### 2.2 Paket A: 6–7 år, 3 mot 3 (7 övningar)

Alla har ålder 6–7, `spelformer: [3mot3, 5mot5]`, ingen målvakt och fokusområden som är K eller R för `fas-6-7`. Fokus står i ordning med huvudfokus först.

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Grupptyp, spelare | Ledare | Fyller |
|---|---|---|---|---|---|---|---|
| A1 | Spel 2 mot 2 till 3 mot 3 till småmål | `del-spel` | `ett-mot-ett`, `avslut`, `dribbling` | 1–3 | `tva-lag`, 4–7 | 0 | **Mest effekt i paketet.** Ensam gör den att ett pass skapas i båda cellerna för 6–7 år (R-101). Rapporten: 0 övningar i varje del för 3 mot 3 |
| A2 | Lek med egen boll | `del-uppvarmning`, `del-ovning` | `lek`, `bollkansla`, `koordination` | 1–3 | `fri`, 4–16 | 0 | Uppvärmning (R-044 för `fas-6-7`) och Öva när lek eller koordination väljs |
| A3 | Kull eller rörelselek med boll | `del-uppvarmning` | `lek`, `koordination`, `snabbhet` | 1–3 | `fri`, 4–12 (rättat 2026-10-07) | 0 | Den andra uppvärmningen som 60-minuterspass kräver |
| A4 | Bollkänsla och driv med egen boll | `del-ovning` | `bollkansla`, `dribbling`, `koordination` | 1–3 | `fri`, 4–16 | 0 | Öva. Utan motståndare, ryms på liten yta |
| A5 | Driv och skjut på småmål | `del-ovning` | `dribbling`, `avslut`, `bollkansla` | 1–3 | `fri` eller `par` | 0 | Den andra Öva-övningen. Delar `dribbling` och `bollkansla` med A4, så att Öva kan fyllas med två moment |
| A6 | 1 mot 1 till småmål | `del-spelovning`, `del-ovning` | `ett-mot-ett`, `dribbling`, `avslut` | 1–3 | `par` | 0 | Spelövning. Med ersättningsfokus täcker den bollkänsla, dribbling, avslut, koordination, snabbhet och lek |
| A7 | Spela ihop, 2 mot 1 eller 3 mot 1 till mål | `del-spelovning` | `spelbarhet`, `passning-mottagning`, `ett-mot-ett` | 1–2, helst 1–3 | `tva-lag`, 3–6 | 0 | Spelövning när passning eller spelbarhet väljs |

*Rättelse 2026-10-07, beslutad av användaren samma dag efter granskningen av paket A.* Planen gav först A2, A3 och A4 spannet `fri`, 4–16. I `fas-6-7` går det inte att hålla både golvet för yta per spelare och taket med en och samma yta över hela det spannet. Felet låg i planen, inte hos övningsförfattaren. Nu gäller:

- **Övningar där varje spelare har egen boll och ingen motståndare finns (A2 och A4): 4–16.** Taket prövas inte som gräns för dem, eftersom antalet bollkontakter inte beror på ytan när alla har egen boll. Ledaren gör i stället ytan mindre när gruppen är liten, och övningens text ska säga det (`passuppbyggnad.md`, avsnittet *Vad som händer när en övning inte håller måttet*, punkten *Över taket*).
- **En kull- eller jaktlek (A3): 4–12.** Där är avståndet hela leken. På en för stor yta når fångaren aldrig fram, så leken får en mindre yta och ett lägre högsta antal. Med fler än tolv spelare lägger generatorn en andra yta bredvid.

Designregel 1 i avsnitt 2.1 håller för båda spannen (16 ≥ 2 × 4 − 1 och 12 ≥ 2 × 4 − 1).

**Kontroll av ersättningsfokus för 6–7 år.** Med A2–A7 kan varje fokusområde som kan väljas för fasen fylla både Öva och Spelövning, antingen direkt eller via listorna i R-121. Öva: allt som saknas faller på `bollkansla` eller `dribbling`, som A4 och A5 delar. Spelövning: allt faller på `ett-mot-ett` (A6) utom `passning-mottagning` och `spelbarhet`, som A7 tar.

### 2.3 Paket B: 13–19 år, 9 mot 9 och 11 mot 11 (8 övningar)

Alla har ålder 13–19 om inget annat står (fråga F3), `spelformer: [9mot9, 11mot11]`, och dessutom `7mot7` där det står.

| Nr | Arbetsnamn | Passdelar | Fokus | Nivå | Grupptyp, spelare | Ledare | Spelformer | Fyller |
|---|---|---|---|---|---|---|---|---|
| B1 | Smålagsspel 2 mot 2 till 4 mot 4 till mål | `del-spel` | `spelbarhet`, `avslut`, `omstallning` | 1–3 | `tva-lag`, 4–8 | 0 | 7, 9, 11 | **Mest effekt i hela omgången.** Gör att ett pass skapas i fem celler, 13–19 år, sammanlagt 233 520 körfall eller 50 procent. Rapporten: 0 i varje del för 11 mot 11, och spelet för 9 mot 9 kan inte fyllas i 86 procent av körfallen |
| B2 | Större spel 6 mot 6 till 11 mot 11 | `del-spel` | `spelbarhet`, `speluppbyggnad`, `forsvarsspel` | 1–3 | `tva-lag`, 12–22 | 0 | 9, 11 | Matchlikt spel för stora grupper och långa pass, längst 40 minuter |
| B3 | Passningar i rörelse | `del-uppvarmning`, `del-ovning` | `passning-mottagning`, `spelbarhet` | 1–3 | `fri`, 4–16 | 0 | 7, 9, 11 | Öva utan motståndare, ryms också på en kvarts plan med många spelare (avsnitt 1.4). Vanligaste ersättningen i rapporten är `passning-mottagning` |
| B4 | Skadeförebyggande uppvärmning | `del-uppvarmning` | `skadeforebyggande`, `koordination` | 1–3 | `fri`, 6–16 | 1 | 7, 9, 11 | R-044 för 13–19 år kräver `skadeforebyggande` i uppvärmningen. Längst 25 minuter |
| B5 | Avslut efter passning mot målvakt | `del-ovning` | `avslut`, `passning-mottagning`, `malvaktsspel` | 1–3 | `fri`, 4–10 | 0 | 7, 9, 11 | Öva för avslut och målvakt. Rapporten: `avslut` 0 i Öva för 9 mot 9 |
| B6 | 1 mot 1 till mål | `del-ovning`, `del-spelovning` | `ett-mot-ett`, `dribbling`, `snabbhet` | 1–3 | `par` | 0 | 7, 9, 11 | Bär ersättningen för bollkänsla, dribbling, koordination, snabbhet, uthållighet, försvarsspel och lek. Rapporten: `ett-mot-ett` 0 i Öva och Spelövning för 9 mot 9 |
| B7 | Spela framåt i positionsspel med riktning | `del-spelovning` | `spelbarhet`, `speluppbyggnad`, `passning-mottagning` | 1–3 | `tva-lag`, 6–12 | 0 | 9, 11 | Spelövning för passning, spelbarhet, uppbyggnad och målvakt. Den enda uppbyggnadsövningen för 9 mot 9 i dag är ledarstyrd och har fast storlek |
| B8 | Omställning i överläge till mål | `del-spelovning` | `omstallning`, `forsvarsspel`, `avslut` | 2–3 räcker | `tva-lag`, 5–10 | 0 | 7, 9, 11 | Spelövning för omställning, försvar, avslut, fasta situationer och nickspel (ersättning enligt R-121) |

*Tillägg 2026-10-07, beslutat av användaren samma dag:* B4, `skadeforebyggande-uppvarmning-13-19`, ersätter den tidigare övningen `skadeforebyggande-9mot9`, som tas bort ur banken i omgång 5.

**Kontroll av ersättningsfokus för 13–19 år.** I Öva (B3, B5, B6) kan alla 17 fokusområden fyllas direkt eller via R-121, med avvikelserna per fas, utom `skadeforebyggande` som enda val. Det har ersättningarna `koordination` och `bollkansla`, och ingen av dem finns i Öva. Då fylls Spelövning via `snabbhet` (B6), så passet skapas ändå. Jag godtar det, se fråga F5. I Spelövning (B6, B7, B8) kan alla fokusområden fyllas.

### 2.4 Hålen som ger mest effekt per övning

| Ordning | Hål (spelform, del, rapportens tabell) | Övning | Körfall som får ett pass, ungefär | Varför så mycket |
|---|---|---|---|---|
| 1 | 11 mot 11 och 9 mot 9, `del-spel`, 0 övningar respektive 86 % ej fyllbar | B1 | 233 520 | Fem celler med samma övning, och `del-spel` räcker för R-101 |
| 2 | 11 mot 11, `del-ovning`, 0 övningar | B3 | samma celler, när spelet inte ryms | Utan motståndare, ryms på kvarts plan |
| 3 | 3 mot 3, `del-spel`, 0 övningar | A1 | 31 584 | Två celler |
| 4 | 9 mot 9, `del-ovning` och `del-spelovning`, `ett-mot-ett` 0 | B6 | förbättrar kärnan i fem celler | Två passdelar och sju fokusområden via R-121 |
| 5 | 3 mot 3, `del-ovning`, 0 övningar | A4, A5 | kärnan i två celler | Två behövs för 60-minuterspass |
| 6 | 3 mot 3, `del-spelovning`, 0 övningar | A6, A7 | kärnan i två celler | |
| 7 | 9 mot 9 och 11 mot 11, `del-spelovning`, uppbyggnad och omställning | B7, B8 | kärnan | |
| 8 | Uppvärmning i båda paketen | A2, A3, B4 | påverkar inte R-101 | Behövs för fullständiga pass och för R-044 |

## 3. 3 mot 3 och 11 mot 11: minsta antal och var de hör hemma

### 3.1 Minsta antal för att ett pass alls ska skapas

**En övning per spelform**, nämligen ett spel i `del-spel` som uppfyller designreglerna i 2.1: brett spelarspann med `spelare.min` högst 4, nivå 1–3, ledarbehov 0, en yta som ryms på en kvarts plan och en tid som täcker måltiden för Spel. Det följer av R-101: ett pass skapas så snart `del-spel` kan fyllas, och `del-spel` kräver inget fokus (R-046 är en prioritet).

Ett sådant pass har bara ett spel och tomma delar för resten. Det är bättre än "inget pass", men det är inget träningspass jag vill att appen visar som standard.

### 3.2 Minsta antal för ett fullständigt pass i alla passlängder

| | 6–7 år (3 mot 3) | 13–19 år (9 mot 9 och 11 mot 11) |
|---|---|---|
| Uppvärmning | 2 (Uppvärmning är 12 minuter vid 60 minuters pass, och en övning får vara högst 8) | 1 med längst 23–25 minuter |
| Öva | 2 som delar fokusområde (samma skäl) | 1 |
| Spelövning | 1 | 1 med längst 23–25 minuter |
| Spel | 1 | 1 med längst minst 36 minuter |
| **Summa** | **6** | **4** |

Det minsta ger bara ett fokus i kärnan, och allt annat fylls med ersättningsfokus. Därför har paketen 7 och 8 övningar: det räcker för att varje fokusområde som kan väljas ska ge en fylld kärna, direkt eller via R-121 (kontrollerna i 2.2 och 2.3).

### 3.3 Rekommendation

**Båda ska ingå i omgång 5, som paket A och paket B, inte i egna omgångar.** Skälen:

- Huvudmålet är att den föreslagna spelformen alltid ska ge ett pass. Det nås bara om båda paketen kommer med.
- 15 övningar ryms i en omgång (tidigare omgångar var 11–16).
- Fördjupningen för båda åldrarna kommer i senare omgångar (avsnitt 4).
- Omgång 3 hade redan två spelformer i samma omgång, så granskningen kan hantera det.

Rapportens siffror gör att 15–19 år väger fem gånger mer än 6–7 år (73 200 mot 15 792 körfall i den föreslagna cellen). Det beror på att åldersfasen har fem årskullar och fler passlängder, inte på hur många lag klubben har. Om klubben har många lag för 6–7 år och få för 15–19 år, bör ordningen vändas. Se beslut B1.

## 4. Antal och uppdelning

| Omgång | Innehåll | Antal | Effekt |
|---|---|---|---|
| **5** | Paket A (6–7 år, 7 övningar) och paket B (13–19 år, 8 övningar) | **15 nya** | De föreslagna cellerna går till högst cirka 4 procent "inget pass". Alla celler till högst cirka 32 procent |
| **5B** | Märkning av befintliga övningar med fler spelformer enligt fråga F1. Inga nya övningar, ingen ändrad ålder. Fältet `spelformer`, och vid behov `yta`, `ytreferens` och planskissen per spelform | cirka 35 filer för 8–12 år, därefter cirka 14 filer för 13–14 år när omgång 4 är godkänd | Grannspelformerna, cirka 28 procent av körfallen, går från 100 procent till högst cirka 5–10 procent. Alla celler till högst cirka 6 procent |
| **6** | 13–19 år, fördjupning: fasta situationer (hörna, frispark, inkast och inspark), nickspel med kortast högst 10 minuter så att taket för 13–14 år håller (R-082), uthållighet i fotbollsform med arbete och vila, försvar i linje och djupled för 11 mot 11 (minst 40 meter), målvaktsspel, fler övningar för nivå 3 | 12–14 nya | Ersättningsfokus för 13–19 år ned. K-områdena `fasta-situationer`, `speluppbyggnad` och `forsvarsspel` får egna övningar |
| **7** | 6–7 år, fördjupning (5–6 övningar), och kärnhål för 8–12 år (8–10 övningar), se nedan | 13–16 nya | Ersättningsfokus för 8–12 år ned mot målet om högst 40 procent |

Varje ny övning har planskiss och ytreferens enligt designregel 7. Omgång 5B ändrar ytreferens och planskiss bara när måtten eller plandelarna skiljer sig mellan spelformerna. En referens som *halva 7 mot 7-planen* stämmer till exempel inte för ett 5 mot 5-lag och ska då anges per spelform.

**Kärnhålen för 8–12 år i omgång 7**, i prioritetsordning, med siffror ur rapportens tabell efter CI-rättningen:

| Prio | Spelform, del | Fokus | Varför |
|---|---|---|---|
| 1 | 5 mot 5, `del-ovning` | `bollkansla`, `koordination`, `lek` | K i `fas-8-9`, 0 övningar. `lek -> dribbling` 5 694 och `bollkansla -> dribbling` 3 966 är bland de vanligaste ersättningarna |
| 2 | 7 mot 7, `del-ovning` | `koordination`, `snabbhet` | `koordination` är K i `fas-10-12`, 0 övningar. `snabbhet -> dribbling` 5 694 är den vanligaste ersättningen |
| 3 | 7 mot 7, `del-spelovning` | `speluppbyggnad`, `forsvarsspel`, `omstallning`, nivå 1, ledarbehov 0, `tva-lag` | K, men delen kan inte fyllas för sig i 93–97 procent av körfallen, mot 57 procent som grannspelformerna ger av sig själva. De enda övningarna har fast storlek, ledare eller bara nivå 2–3 |
| 4 | 5 mot 5, `del-ovning` | `forsvarsspel`, `omstallning`, `speluppbyggnad` | R i `fas-8-9`, 0 övningar. `forsvarsspel -> ett-mot-ett` 4 209 och `omstallning -> passning-mottagning` 4 176 |
| 5 | 7 mot 7, `del-ovning` | `fasta-situationer`, med bollen längs marken | R i `fas-10-12`. `fasta-situationer -> passning-mottagning` 4 212 |
| 6 | 5 mot 5 och 7 mot 7, `del-uppvarmning` | `passning-mottagning` ihop med `koordination` | 0 uppvärmningar med passning. Ger R-044 och R-045 samtidigt |

## 5. Fotbollsfrågor som jag avgör

**F1. Får en övning märkas med grannspelformer utan att åldern ändras? Ja, med tre villkor.**

- (a) En övning utan matchregler, alltså uppvärmning, Öva och de flesta spelövningar, får märkas med alla spelformer som R-004 tillåter för övningens åldersspann.
- (b) En övning som bygger på en spelforms egna regler får bara märkas med spelformer som har regeln. Retreatlinjen finns i 5 mot 5 och 7 mot 7. Offside och inspark finns i 9 mot 9 och 11 mot 11. 3 mot 3 har ingen målvakt.
- (c) Ett spel i `del-spel` får bara märkas med spelformer som är lika stora som spelet eller större, eftersom spelet ska vara "i dagens spelform eller mindre" (`passuppbyggnad.md`). Ett 3 mot 3 får märkas 5 mot 5, men ett 7 mot 7 får inte märkas 5 mot 5.

*Motivering:* fältet anger vilka spelformer övningen är relevant för, inte att den spelas med spelformens antal (`spelformer.md`, *Vad spelformen betyder på träning*). Fasen, och med den säkerhet, tider och tak per ledare, följer alltid åldern (R-015). Ett lag med 11-åringar som spelar 5 mot 5 ska ha övningar för 11-åringar.

**F2. Hur bedöms ytan för en övning med flera spelformer eller två åldersfaser?** Golvet följer åldern som alltid. Spänner övningen över två faser gäller den strängaste fasens golv och längdmått. Taket, som är mitt riktvärde och inte ett beslutat kriterium, bedöms mot matchen i den spelform som föreslås för övningens ålder (R-013), inte mot grannspelformen. Taket får överskridas med ungefär hälften vid `spelare.min` när det behövs för att spannet ska täcka udda antal, och då skriver granskningen varför.

*Motivering:* taket finns för att fånga ytor som är kopierade från en större match, inte för att straffa en övning för att ett lag väljer en mindre spelform. Golvet, som användaren har beslutat, ändras inte. Därför kan paket A inte gälla 6–9 år: 3 mot 3-ytan skulle behöva ligga över golvet för 8–9 år (25 kvadratmeter per spelare) och under taket för 3 mot 3 (25) samtidigt. Paket A gäller 6–7 år, och 8–9-åringar som spelar 3 mot 3 får övningar genom 5B.

**F3. Får paket B ha åldern 13–19? Ja, som utgångspunkt.** K/R-tabellen i `fokusomraden.md` är likadan för `fas-13-14` och `fas-15-19`, så R-002 begränsar inte. Golvet 90 och längden 40 meter ger 13–14-åringar något större ytor, vilket är säkrare under tillväxtspurten. Övningar vars innehåll kräver en färdigvuxen kropp, som hårda närkamper, uthållighetsintervaller eller mycket nickning, får åldern 15–19 i stället. Bollstorleken, 4 för 13-åringar, väljer ledaren (`spelformer.md`).

**F4. Får en övning märkas med både `del-ovning` och `del-spelovning`? Ja, för dueller och överlägen** med riktning och mål, som 1 mot 1 och 2 mot 1. `passuppbyggnad.md` räknar redan med överlägen i Öva. Ett fullt smålagsspel märks inte `del-ovning`. Ett spel får märkas både `del-spelovning` och `del-spel` bara om det i grundformen har en regel som gör att fokuset händer ofta.

**F5. Behöver varje fokusområde egna övningar i kärnan? Nej.** `skadeforebyggande` hör hemma i uppvärmningen (R-044), och för det är ersättningen till koordination och snabbhet i kärnan rätt innehåll. `lek` från 10 år och `uthallighet` klarar sig med ersättning tills vidare. `lek`, `bollkansla` och `koordination` för 8–9 år och `koordination` för 10–12 år är däremot K och ska ha egna övningar (omgång 7).

**F6. Ledarbehov för skadeförebyggande uppvärmning i paket B: 1.** Att någon ser varje landning är hela poängen med programmet, och det väger tyngre än att uppvärmningen alltid kan fyllas med en ledare och stora grupper. B3 har ledarbehov 0 och tar uppvärmningen då. Det påverkar inte "inget pass", eftersom uppvärmningen inte räknas i R-101.

**F7. Ska de 14 granskade övningarna för 9 mot 9 ändras nu? Nej.** De godkänns som de är. Märkningen med fler spelformer tas i 5B, så att omgång 4 inte börjar om.

## 6. Beslut som behövs

**B1. Innehållet i omgång 5.** *Rekommendation:* paket A och paket B tillsammans, 15 övningar. Alternativ: bara paket B först (störst effekt i mätningen), eller bara paket A först (om klubbens lag för 6–7 år är många). Svaret hänger på vilka lag klubben har, och det vet bara användaren.

**B2. Omgång 5B, att märka befintliga och godkända övningar med fler spelformer.** Det kräver ny granskning och ett nytt godkännande av redan godkända filer. *Rekommendation:* ja, som en egen pull request efter omgång 5, med bara fälten i F1 ändrade och ingen ändrad ålder. Det är det billigaste sättet att ta bort "inget pass" för grannspelformerna, och de gamla versionerna ligger kvar i main tills pull requesten är mergad. Hur statusen hanteras under tiden är en fråga för huvudsessionen och senior systemutvecklare.

**B3. Mätningen.** *Rekommendation:* täckningsskriptet bör redovisa "inget pass" per cell (ålder gånger spelform, märkt föreslagen eller granne) och också andelen pass där både Öva och Spelövning är fyllda. I dag väger grannspelformerna 60 procent av siffran, och ett pass med bara spel räknas som lyckat. Målen i avsnitt 1 bör följas på cellnivå. Det är arbete för senior systemutvecklare eller kvalitetssäkraren.

**B4. Ytreferens på varje övning.** Användarens beslut säger att varje övning ska ha planskiss och ytreferens. `ytreferenser.md` (avsnitt 4) och `content/ovningar/README.md` säger att ytreferensen ska utelämnas för positionsspel där måttet är själva poängen, för stationer och fasta positioner, för dueller med startavstånd och för ytor utan någon plandel med rätt form. A6, B6 och kanske B4 och B7 hör till de kategorierna. *Rekommendation:* ytreferens krävs, utom i kategorierna i `ytreferenser.md`, avsnitt 4, där granskningen skriver kategorin. Planskiss krävs alltid.

## Källor

| Källa | Använd för | Hämtad eller läst |
|---|---|---|
| `docs/doman/tackning-2026-10-05.md` | Alla siffror om körfall, "inget pass" och ersättningsfokus | 2026-10-06 |
| `content/ovningar/*.yaml`, 58 filer, grenen `analys/tackning` | Ålder, spelformer, nivå, passdelar, spelare, grupptyp och ledarbehov per övning | 2026-10-06 |
| SvFF:s nationella spelformer och planstorleksdokumentet, via `docs/doman/spelformer.md` | Spelformernas regler och planer | 2026-09-11 |

Inga nya källor är hämtade för planen. Fördelningen av övningar, designreglerna, målen och frågorna F1–F7 är min bedömning som tränarutbildare.
