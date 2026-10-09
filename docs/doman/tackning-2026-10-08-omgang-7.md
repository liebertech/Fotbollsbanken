# Täckningsmätning av generatorn, 2026-10-08

Siffror, inte tolkning. Skriptet är `scripts/tackning.ts` (`npm run tackning`) och körs mot den riktiga övningsbanken i `content/ovningar/` genom `src/regelmotor/index.ts`. Fotbollsfrågor avgörs inte här; fotbollsexperten äger tolkningen av målen.

## Sammanfattning: målen i plan-omgang-7.md, avsnitt 1.1

"Nu" är banken med 72 godkända övningar. "Efter CI" räknar också de 26 granskade som godkända (bara i minnet). Planen prövar målen mot "Banken nu" när omgång 7 är godkänd, eller mot "Efter CI" när omgångens övningar är granskade men inte godkända. Fylld kärna och kärna på valt fokus räknas av alla körfall. Målen i avsnitt 1.2 och 1.3 prövas för hand mot tabellerna längre ned (se *Metod*).

| Cell | Typ | Mått | Nu | Efter CI | Mål efter omgång 7 | Nått nu | Nått efter CI |
|---|---|---|---|---|---|---|---|
| 6–7 år, 3 mot 3 | föreslagen | Inget pass | 0.0 % | 0.0 % | = 0.0 % (oförändrat) | ja | ja |
| 6–7 år, 3 mot 3 | föreslagen | Fylld kärna | 85.7 % | 85.7 % | = 85.7 % (oförändrat) | ja | ja |
| 6–7 år, 3 mot 3 | föreslagen | Kärna på valt fokus | 33.9 % | 33.9 % | = 33.9 % (oförändrat) | ja | ja |
| 6–7 år, 5 mot 5 | granne | Inget pass | 0.0 % | 0.0 % | = 0.0 % (oförändrat) | ja | ja |
| 6–7 år, 5 mot 5 | granne | Fylld kärna | 85.7 % | 85.7 % | = 85.7 % (oförändrat) | ja | ja |
| 6–7 år, 5 mot 5 | granne | Kärna på valt fokus | 33.9 % | 33.9 % | = 33.9 % (oförändrat) | ja | ja |
| 8–9 år, 5 mot 5 | föreslagen | Inget pass | 0.0 % | 0.0 % | ≤ 0.3 % | ja | ja |
| 8–9 år, 5 mot 5 | föreslagen | Fylld kärna | 74.8 % | 85.5 % | ≥ 82.0 % | nej | ja |
| 8–9 år, 5 mot 5 | föreslagen | Kärna på valt fokus | 25.5 % | 46.0 % | ≥ 36.0 % | nej | ja |
| 8–9 år, 3 mot 3 | granne | Inget pass | 0.0 % | 0.0 % | ≤ 2.3 % | ja | ja |
| 8–9 år, 3 mot 3 | granne | Fylld kärna | 69.4 % | 85.5 % | ≥ 77.0 % | nej | ja |
| 8–9 år, 3 mot 3 | granne | Kärna på valt fokus | 22.6 % | 43.2 % | ≥ 32.0 % | nej | ja |
| 8–9 år, 7 mot 7 | granne | Inget pass | 0.0 % | 0.0 % | ≤ 0.3 % | ja | ja |
| 8–9 år, 7 mot 7 | granne | Fylld kärna | 74.8 % | 85.5 % | ≥ 82.0 % | nej | ja |
| 8–9 år, 7 mot 7 | granne | Kärna på valt fokus | 25.5 % | 46.0 % | ≥ 36.0 % | nej | ja |
| 10–12 år, 7 mot 7 | föreslagen | Inget pass | 4.0 % | 0.0 % | ≤ 0.5 % | nej | ja |
| 10–12 år, 7 mot 7 | föreslagen | Fylld kärna | 73.9 % | 91.7 % | ≥ 82.0 % | nej | ja |
| 10–12 år, 7 mot 7 | föreslagen | Kärna på valt fokus | 23.2 % | 47.4 % | ≥ 34.0 % | nej | ja |
| 10–12 år, 5 mot 5 | granne | Inget pass | 9.3 % | 0.0 % | ≤ 0.5 % | nej | ja |
| 10–12 år, 5 mot 5 | granne | Fylld kärna | 73.9 % | 91.7 % | ≥ 80.0 % | nej | ja |
| 10–12 år, 5 mot 5 | granne | Kärna på valt fokus | 23.2 % | 47.4 % | ≥ 33.0 % | nej | ja |
| 10–12 år, 9 mot 9 | granne | Inget pass | 4.0 % | 0.0 % | ≤ 0.5 % | nej | ja |
| 10–12 år, 9 mot 9 | granne | Fylld kärna | 73.9 % | 91.7 % | ≥ 82.0 % | nej | ja |
| 10–12 år, 9 mot 9 | granne | Kärna på valt fokus | 23.2 % | 47.4 % | ≥ 34.0 % | nej | ja |
| 13–14 år, 9 mot 9 | föreslagen | Inget pass | 2.5 % | 1.5 % | = 1.5 % (oförändrat) | nej | ja |
| 13–14 år, 9 mot 9 | föreslagen | Fylld kärna | 65.8 % | 77.4 % | = 77.4 % (oförändrat) | nej | ja |
| 13–14 år, 9 mot 9 | föreslagen | Kärna på valt fokus | 28.5 % | 53.5 % | = 53.5 % (oförändrat) | nej | ja |
| 13–14 år, 7 mot 7 | granne | Inget pass | 3.7 % | 2.8 % | = 2.8 % (oförändrat) | nej | ja |
| 13–14 år, 7 mot 7 | granne | Fylld kärna | 50.6 % | 75.5 % | = 75.5 % (oförändrat) | nej | ja |
| 13–14 år, 7 mot 7 | granne | Kärna på valt fokus | 17.7 % | 44.6 % | = 44.6 % (oförändrat) | nej | ja |
| 13–14 år, 11 mot 11 | granne | Inget pass | 2.5 % | 1.5 % | = 1.5 % (oförändrat) | nej | ja |
| 13–14 år, 11 mot 11 | granne | Fylld kärna | 65.8 % | 77.4 % | = 77.4 % (oförändrat) | nej | ja |
| 13–14 år, 11 mot 11 | granne | Kärna på valt fokus | 28.5 % | 53.5 % | = 53.5 % (oförändrat) | nej | ja |
| 15–19 år, 11 mot 11 | föreslagen | Inget pass | 7.3 % | 1.0 % | = 1.0 % (oförändrat) | nej | ja |
| 15–19 år, 11 mot 11 | föreslagen | Fylld kärna | 60.9 % | 89.5 % | = 89.5 % (oförändrat) | nej | ja |
| 15–19 år, 11 mot 11 | föreslagen | Kärna på valt fokus | 24.3 % | 58.7 % | = 58.7 % (oförändrat) | nej | ja |
| 15–19 år, 9 mot 9 | granne | Inget pass | 7.3 % | 1.0 % | = 1.0 % (oförändrat) | nej | ja |
| 15–19 år, 9 mot 9 | granne | Fylld kärna | 60.9 % | 89.5 % | = 89.5 % (oförändrat) | nej | ja |
| 15–19 år, 9 mot 9 | granne | Kärna på valt fokus | 24.3 % | 58.7 % | = 58.7 % (oförändrat) | nej | ja |

Målen för 8–12 år: 3 av 18 nådda nu och 18 av 18 efter CI. Värdena för 6–7 år och 13–19 år: 6 av 21 oförändrade nu och 21 av 21 efter CI; ett ändrat värde där är enligt planen ett fel i skriptet eller i en fil, inte en effekt av omgången.

Kontrollen i avsnitt 1.1, att 8–9 år, 5 mot 5 och 8–9 år, 7 mot 7 är lika i antal körfall och i de tre måtten (räknat i antal): ja nu och ja efter CI. Om de skiljer sig är en övning fel märkt.

## Sammanfattning: målen i plan-omgang-6.md, avsnitt 1.1

"Nu" är banken med 72 godkända övningar. "Efter CI" räknar också de 26 granskade som godkända (bara i minnet). Planen prövar målen mot "Banken nu" när omgång 6 är godkänd, eller mot "Efter CI" när omgångens övningar är granskade men inte godkända. Fylld kärna och kärna på valt fokus räknas av alla körfall. Målen i avsnitt 1.2 och 1.3 prövas för hand mot tabellerna längre ned (se *Metod*).

| Cell | Typ | Mått | Nu | Efter CI | Mål efter omgång 6 | Nått nu | Nått efter CI |
|---|---|---|---|---|---|---|---|
| 6–7 år, 3 mot 3 | föreslagen | Inget pass | 0.0 % | 0.0 % | = 0.0 % (oförändrat) | ja | ja |
| 6–7 år, 3 mot 3 | föreslagen | Fylld kärna | 85.7 % | 85.7 % | = 85.7 % (oförändrat) | ja | ja |
| 6–7 år, 3 mot 3 | föreslagen | Kärna på valt fokus | 33.9 % | 33.9 % | = 33.9 % (oförändrat) | ja | ja |
| 6–7 år, 5 mot 5 | granne | Inget pass | 0.0 % | 0.0 % | = 0.0 % (oförändrat) | ja | ja |
| 6–7 år, 5 mot 5 | granne | Fylld kärna | 85.7 % | 85.7 % | = 85.7 % (oförändrat) | ja | ja |
| 6–7 år, 5 mot 5 | granne | Kärna på valt fokus | 33.9 % | 33.9 % | = 33.9 % (oförändrat) | ja | ja |
| 8–9 år, 5 mot 5 | föreslagen | Inget pass | 0.0 % | 0.0 % | = 0.3 % (oförändrat) | ändras av omgång 7 | ändras av omgång 7 |
| 8–9 år, 5 mot 5 | föreslagen | Fylld kärna | 74.8 % | 85.5 % | = 74.8 % (oförändrat) | ja | ändras av omgång 7 |
| 8–9 år, 5 mot 5 | föreslagen | Kärna på valt fokus | 25.5 % | 46.0 % | = 25.5 % (oförändrat) | ja | ändras av omgång 7 |
| 8–9 år, 3 mot 3 | granne | Inget pass | 0.0 % | 0.0 % | = 2.3 % (oförändrat) | ändras av omgång 7 | ändras av omgång 7 |
| 8–9 år, 3 mot 3 | granne | Fylld kärna | 69.4 % | 85.5 % | = 69.4 % (oförändrat) | ja | ändras av omgång 7 |
| 8–9 år, 3 mot 3 | granne | Kärna på valt fokus | 22.6 % | 43.2 % | = 22.6 % (oförändrat) | ja | ändras av omgång 7 |
| 8–9 år, 7 mot 7 | granne | Inget pass | 0.0 % | 0.0 % | = 0.3 % (oförändrat) | ändras av omgång 7 | ändras av omgång 7 |
| 8–9 år, 7 mot 7 | granne | Fylld kärna | 74.8 % | 85.5 % | = 74.8 % (oförändrat) | ja | ändras av omgång 7 |
| 8–9 år, 7 mot 7 | granne | Kärna på valt fokus | 25.5 % | 46.0 % | = 25.5 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 7 mot 7 | föreslagen | Inget pass | 4.0 % | 0.0 % | = 4.0 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 7 mot 7 | föreslagen | Fylld kärna | 73.9 % | 91.7 % | = 73.9 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 7 mot 7 | föreslagen | Kärna på valt fokus | 23.2 % | 47.4 % | = 23.2 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 5 mot 5 | granne | Inget pass | 9.3 % | 0.0 % | = 9.3 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 5 mot 5 | granne | Fylld kärna | 73.9 % | 91.7 % | = 73.9 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 5 mot 5 | granne | Kärna på valt fokus | 23.2 % | 47.4 % | = 23.2 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 9 mot 9 | granne | Inget pass | 4.0 % | 0.0 % | = 4.0 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 9 mot 9 | granne | Fylld kärna | 73.9 % | 91.7 % | = 73.9 % (oförändrat) | ja | ändras av omgång 7 |
| 10–12 år, 9 mot 9 | granne | Kärna på valt fokus | 23.2 % | 47.4 % | = 23.2 % (oförändrat) | ja | ändras av omgång 7 |
| 13–14 år, 9 mot 9 | föreslagen | Inget pass | 2.5 % | 1.5 % | ≤ 2.0 % | nej | ja |
| 13–14 år, 9 mot 9 | föreslagen | Fylld kärna | 65.8 % | 77.4 % | ≥ 68.0 % | nej | ja |
| 13–14 år, 9 mot 9 | föreslagen | Kärna på valt fokus | 28.5 % | 53.5 % | ≥ 33.0 % | nej | ja |
| 13–14 år, 7 mot 7 | granne | Inget pass | 3.7 % | 2.8 % | ≤ 3.0 % | nej | ja |
| 13–14 år, 7 mot 7 | granne | Fylld kärna | 50.6 % | 75.5 % | ≥ 58.0 % | nej | ja |
| 13–14 år, 7 mot 7 | granne | Kärna på valt fokus | 17.7 % | 44.6 % | ≥ 22.0 % | nej | ja |
| 13–14 år, 11 mot 11 | granne | Inget pass | 2.5 % | 1.5 % | ≤ 2.0 % | nej | ja |
| 13–14 år, 11 mot 11 | granne | Fylld kärna | 65.8 % | 77.4 % | ≥ 68.0 % | nej | ja |
| 13–14 år, 11 mot 11 | granne | Kärna på valt fokus | 28.5 % | 53.5 % | ≥ 33.0 % | nej | ja |
| 15–19 år, 11 mot 11 | föreslagen | Inget pass | 7.3 % | 1.0 % | ≤ 2.0 % | nej | ja |
| 15–19 år, 11 mot 11 | föreslagen | Fylld kärna | 60.9 % | 89.5 % | ≥ 65.0 % | nej | ja |
| 15–19 år, 11 mot 11 | föreslagen | Kärna på valt fokus | 24.3 % | 58.7 % | ≥ 30.0 % | nej | ja |
| 15–19 år, 9 mot 9 | granne | Inget pass | 7.3 % | 1.0 % | ≤ 2.0 % | nej | ja |
| 15–19 år, 9 mot 9 | granne | Fylld kärna | 60.9 % | 89.5 % | ≥ 65.0 % | nej | ja |
| 15–19 år, 9 mot 9 | granne | Kärna på valt fokus | 24.3 % | 58.7 % | ≥ 30.0 % | nej | ja |

Målen för 13–19 år: 0 av 15 nådda nu och 15 av 15 efter CI. Värdena för 6–12 år: 21 av 24 oförändrade nu och 6 av 24 efter CI. Av de ändrade är 3 nu och 18 efter CI märkta "ändras av omgång 7": omgång 7 höjer målen för dem med avsikt, och de bedöms i sammanfattningen för omgång 7. Ett annat ändrat värde är enligt planen ett fel i skriptet eller i en fil, inte en effekt av omgången.

## Sammanfattning: målen i plan-omgang-5.md, avsnitt 1.1 och 1.2

"Nu" är banken med 72 godkända övningar. "Efter CI" räknar också de 26 granskade som godkända (bara i minnet). Målet gäller "inget pass" efter omgång 5; för fylld kärna sätter avsnitt 1.2 inget mål, så de kolumnerna redovisas utan bedömning (se *Metod*).

| Cell | Typ | Inget pass, nu | Inget pass, efter CI | Mål efter omgång 5 | Nått nu | Nått efter CI | Mål efter 5B | Fylld kärna, nu | Fylld kärna, efter CI | Kärna på valt fokus, nu | Kärna på valt fokus, efter CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 6–7 år, 3 mot 3 | föreslagen | 0.0 % | 0.0 % | ≤ 5 % | ja | ja | ≤ 5 % | 85.7 % | 85.7 % | 33.9 % | 33.9 % |
| 6–7 år, 5 mot 5 | granne | 0.0 % | 0.0 % | ≤ 5 % | ja | ja | ≤ 5 % | 85.7 % | 85.7 % | 33.9 % | 33.9 % |
| 8–9 år, 5 mot 5 | föreslagen | 0.0 % | 0.0 % | ≤ 5 % | ja | ja | ≤ 5 % | 74.8 % | 85.5 % | 25.5 % | 46.0 % |
| 8–9 år, 3 mot 3 | granne | 0.0 % | 0.0 % | inget mål | – | – | ≤ 5 % | 69.4 % | 85.5 % | 22.6 % | 43.2 % |
| 8–9 år, 7 mot 7 | granne | 0.0 % | 0.0 % | inget mål | – | – | ≤ 5 % | 74.8 % | 85.5 % | 25.5 % | 46.0 % |
| 10–12 år, 7 mot 7 | föreslagen | 4.0 % | 0.0 % | ≤ 5 % | ja | ja | ≤ 5 % | 73.9 % | 91.7 % | 23.2 % | 47.4 % |
| 10–12 år, 5 mot 5 | granne | 9.3 % | 0.0 % | inget mål | – | – | ≤ 10 % | 73.9 % | 91.7 % | 23.2 % | 47.4 % |
| 10–12 år, 9 mot 9 | granne | 4.0 % | 0.0 % | inget mål | – | – | ≤ 5 % | 73.9 % | 91.7 % | 23.2 % | 47.4 % |
| 13–14 år, 9 mot 9 | föreslagen | 2.5 % | 1.5 % | ≤ 5 % | ja | ja | ≤ 5 % | 65.8 % | 77.4 % | 28.5 % | 53.5 % |
| 13–14 år, 7 mot 7 | granne | 3.7 % | 2.8 % | ≤ 10 % | ja | ja | ≤ 5 % | 50.6 % | 75.5 % | 17.7 % | 44.6 % |
| 13–14 år, 11 mot 11 | granne | 2.5 % | 1.5 % | ≤ 5 % | ja | ja | ≤ 5 % | 65.8 % | 77.4 % | 28.5 % | 53.5 % |
| 15–19 år, 11 mot 11 | föreslagen | 7.3 % | 1.0 % | ≤ 5 % | nej | ja | ≤ 5 % | 60.9 % | 89.5 % | 24.3 % | 58.7 % |
| 15–19 år, 9 mot 9 | granne | 7.3 % | 1.0 % | ≤ 5 % | nej | ja | ≤ 5 % | 60.9 % | 89.5 % | 24.3 % | 58.7 % |
| **Föreslagna celler sammantaget** |  | 4.2 % | 0.6 % | uträknat ≤ 4 % (1.3) | – | – | – | 68.6 % | 87.2 % | 25.7 % | 51.5 % |
| **Grannceller sammantaget** |  | 4.5 % | 0.7 % | – | – | – | – | 67.5 % | 86.5 % | 24.2 % | 49.5 % |
| **Alla körfall** |  | 4.4 % | 0.7 % | uträknat ≤ 32 % (1.3) | – | – | – | 67.9 % | 86.8 % | 24.8 % | 50.3 % |

Huvudmålet i avsnitt 1.1 (högst 5 % "inget pass" i varje föreslagen cell): uppfyllt i 4 av 5 föreslagna celler nu och i 5 av 5 efter CI.

## Metod

### Celler och mått

- **Cell:** ålder gånger spelform. En cell är **föreslagen** när spelformen är den appen själv föreslår för åldern (R-013, funktionen `suggestedGameFormat` i `src/regelmotor/keys.ts`, som formuläret i `src/app/input/form.ts` använder) och **granne** annars (R-014). **Cell i planen** slår ihop åldrarna med samma föreslagna spelform, som i plan-omgang-5.md avsnitt 0, till exempel "6–7 år, 3 mot 3".
- **Inget pass:** generatorn svarade `none` (R-101). Andelen räknas av alla körfall i cellen.
- **Fylld kärna:** passet skapades och varje kärndel (`del-ovning`, `del-spelovning`) som finns kvar i passet har en övning. En kärndel som R-033 tar bort i ett kort pass räknas inte emot, eftersom reglerna kräver att den tas bort; kolumnen "Kärndel borttagen (R-033)" visar hur ofta det hände. Andelen redovisas både av alla körfall (det ledaren möter) och av de skapade passen.
- **Kärna på valt fokus:** kärnan är fylld och ingen kärndel fick ersättningsfokus (R-121). Då träffar varje kärndel minst ett av ledarens valda fokusområden (R-040, R-041). Andelen räknas av alla körfall.
- Måtten per cell bygger på **båda** sveparna nedan, så att cellernas körfall stämmer med planens tabell i avsnitt 0. Avsnittet om ersättningsfokus längre ned bygger, som förut, bara på enkelfokussvepet.

### Hur målen i plan-omgang-7.md avsnitt 1.1 är översatta

- Målen är avskrivna för hand i fältet `omgang7` i `PLAN_GOALS` i `scripts/tackning-celler.ts`: "högst" för inget pass och "minst" för fylld kärna och kärna på valt fokus i cellerna för 8–12 år.
- Jämförelsen görs, som för omgång 6, på andelen avrundad till en decimal, och gränsen räknas in.
- "Exakt oförändrat" för 6–7 år och 13–19 år betyder lika med värdet i `tackning-2026-10-08.md` (Efter CI-rättning, *Per cell i planen*), på rapportens precision. En ändring mindre än 0,05 procentenheter syns alltså inte.
- Planens kontroll att 8–9 år i 5 mot 5 och i 7 mot 7 är lika görs på antal körfall och antalen bakom de tre måtten, inte på avrundad procent.
- Målen i avsnitt 1.2 (per spelform och del) och 1.3 (ersättningsfokus) är inte inlagda i skriptet. Planen prövar dem för hand mot tabellerna *Per spelform, passdel och fokusområde* och *Ersättningsfokus (R-121)*.

### Hur målen i plan-omgang-6.md avsnitt 1.1 är översatta

- Planen har status `utkast`; målen är avskrivna för hand i fältet `omgang6` i `PLAN_GOALS` i `scripts/tackning-celler.ts`.
- Planen prövar målen som `<= 2.0` och `>= 65.0` mot rapportens värden. Jämförelsen görs därför på andelen avrundad till en decimal, som tabellerna skriver den, och gränsen räknas in.
- "Exakt oförändrat" för 6–12 år betyder lika med värdet i `tackning-2026-10-07.md` (Banken nu, *Per cell i planen*), på rapportens precision. En ändring mindre än 0,05 procentenheter syns alltså inte.
- Ett värde för 8–12 år som inte längre är oförändrat står som "ändras av omgång 7" i stället för "nej", eftersom plan-omgang-7.md höjer målen för de cellerna med avsikt. De bedöms i sammanfattningen för omgång 7.
- Målen i avsnitt 1.2 (per spelform och del) och 1.3 (ersättningsfokus) är inte inlagda i skriptet. Planen prövar dem för hand mot tabellerna *Per spelform, passdel och fokusområde* och *Ersättningsfokus (R-121)*.

### Hur målen i plan-omgang-5.md avsnitt 1.2 är översatta

- Målen jämförs med andelen "inget pass" per cell i planen. Planen har status `utkast`; målen är avskrivna för hand i `PLAN_GOALS` i `scripts/tackning-celler.ts`.
- "oförändrat" för 8–9 år i 5 mot 5 och 10–12 år i 7 mot 7 är översatt till huvudmålet i avsnitt 1.1, högst 5 % i varje föreslagen cell, i stället för dagens exakta värde.
- "100 %" i kolumnen för omgång 5 är ett läge, inte ett mål. De cellerna står som "inget mål" för omgång 5.
- Avsnitt 1.2 sätter inget mål för fylld kärna. Det närmaste är avsnitt 1.5 (ersättningsfokus högst 40 % efter omgång 7). Fylld kärna och kärna på valt fokus redovisas därför utan bedömning i sammanfattningen för omgång 5. Målen för dem i plan-omgang-6.md bedöms i sammanfattningen för omgång 6.
- Raderna "sammantaget" jämförs med de uträknade väntevärdena i avsnitt 1.3 (högst cirka 4 % i föreslagna celler och 32 % för alla körfall efter omgång 5). De är inte mål i planens mening.

### Underlagsrymden

Underlagsrymden är för stor för en fullständig korsprodukt av alla val (se huvudet av scripts/tackning.ts för uträkningen). Skriptet kör i stället två svep:

1. **Enkelfokussvepet** (441504 körfall): varje ålder 6–19, varje spelform och nivå som är tillåten för åldern, det angivna urvalet av antal spelare (4, 6, 8, 10, 12, 14, 16, 20) och ledare (1, 2, 3), varje yta formuläret tillåter plus att inte välja någon, passlängden vid kortast/mitten/längst tillåtna för åldersfasen, och **varje enskilt fokusområde** formuläret tillåter för åldern.
2. **Kombinationssvepet** (21306 körfall): för varje ålder och spelform, **alla** tillåtna kombinationer av två och tre fokusområden (R-019), mot ett representativt underlag i övrigt (nivå 2, 12 spelare, 2 ledare, mittlängden, ingen yta vald).

Frö: `tackning-1` för huvudsvepen. Frökänslighet prövades separat (se nedan) för körfall med orsaken `gar-inte-att-kombinera`, med fröna `tackning-2, tackning-3, tackning-4, tackning-5`, eftersom det bara är den orsaken som beror på slumptalskällan (R-072); `inget-matchar` avgörs av om banken strukturellt har en matchande övning, vilket inte beror på fröet.

Mätt körtid för hela skriptet (båda bankerna): 3404.5 s.

Frökänslighet: av 0 körfall med orsaken `gar-inte-att-kombinera` gav ett annat frö ett pass i 0 fall (–).

## Banken nu (72 godkända övningar)

Banken som regelmotorn fick: 72 övningar.

Körfall totalt: 462810. "Inget pass": 20186 (4.4 %). Pass skapat: 442624 (95.6 %).

### Per cell i planen (åldersgrupp och spelform)

| Cell | Typ | Körfall | Inget pass | Fylld kärna, av alla körfall | Fylld kärna, av skapade pass | Kärna på valt fokus, av alla körfall | Kärndel borttagen (R-033) |
|---|---|---|---|---|---|---|---|
| 6–7 år, 3 mot 3 | föreslagen | 15792 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 6–7 år, 5 mot 5 | granne | 15792 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 8–9 år, 5 mot 5 | föreslagen | 25102 | 0 (0.0 %) | 74.8 % | 74.8 % | 25.5 % | 0.0 % |
| 8–9 år, 3 mot 3 | granne | 25102 | 0 (0.0 %) | 69.4 % | 69.4 % | 22.6 % | 0.0 % |
| 8–9 år, 7 mot 7 | granne | 25102 | 0 (0.0 %) | 74.8 % | 74.8 % | 25.5 % | 0.0 % |
| 10–12 år, 7 mot 7 | föreslagen | 40560 | 1620 (4.0 %) | 73.9 % | 77.0 % | 23.2 % | 0.0 % |
| 10–12 år, 5 mot 5 | granne | 40560 | 3762 (9.3 %) | 73.9 % | 81.5 % | 23.2 % | 0.0 % |
| 10–12 år, 9 mot 9 | granne | 40560 | 1620 (4.0 %) | 73.9 % | 77.0 % | 23.2 % | 0.0 % |
| 13–14 år, 9 mot 9 | föreslagen | 29280 | 720 (2.5 %) | 65.8 % | 67.5 % | 28.5 % | 30.2 % |
| 13–14 år, 7 mot 7 | granne | 29280 | 1094 (3.7 %) | 50.6 % | 52.6 % | 17.7 % | 29.4 % |
| 13–14 år, 11 mot 11 | granne | 29280 | 720 (2.5 %) | 65.8 % | 67.5 % | 28.5 % | 30.2 % |
| 15–19 år, 11 mot 11 | föreslagen | 73200 | 5325 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 15–19 år, 9 mot 9 | granne | 73200 | 5325 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |

### Per cell (ålder och spelform)

| Ålder | Spelform | Typ | Körfall | Inget pass | Fylld kärna, av alla körfall | Fylld kärna, av skapade pass | Kärna på valt fokus, av alla körfall | Kärndel borttagen (R-033) |
|---|---|---|---|---|---|---|---|---|
| 6 | 3 mot 3 | föreslagen | 7896 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 6 | 5 mot 5 | granne | 7896 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 7 | 3 mot 3 | föreslagen | 7896 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 7 | 5 mot 5 | granne | 7896 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 8 | 3 mot 3 | granne | 12551 | 0 (0.0 %) | 69.4 % | 69.4 % | 22.6 % | 0.0 % |
| 8 | 5 mot 5 | föreslagen | 12551 | 0 (0.0 %) | 74.8 % | 74.8 % | 25.5 % | 0.0 % |
| 8 | 7 mot 7 | granne | 12551 | 0 (0.0 %) | 74.8 % | 74.8 % | 25.5 % | 0.0 % |
| 9 | 3 mot 3 | granne | 12551 | 0 (0.0 %) | 69.4 % | 69.4 % | 22.6 % | 0.0 % |
| 9 | 5 mot 5 | föreslagen | 12551 | 0 (0.0 %) | 74.8 % | 74.8 % | 25.5 % | 0.0 % |
| 9 | 7 mot 7 | granne | 12551 | 0 (0.0 %) | 74.8 % | 74.8 % | 25.5 % | 0.0 % |
| 10 | 5 mot 5 | granne | 13520 | 1254 (9.3 %) | 73.9 % | 81.5 % | 23.2 % | 0.0 % |
| 10 | 7 mot 7 | föreslagen | 13520 | 540 (4.0 %) | 73.9 % | 77.0 % | 23.2 % | 0.0 % |
| 10 | 9 mot 9 | granne | 13520 | 540 (4.0 %) | 73.9 % | 77.0 % | 23.2 % | 0.0 % |
| 11 | 5 mot 5 | granne | 13520 | 1254 (9.3 %) | 73.9 % | 81.5 % | 23.2 % | 0.0 % |
| 11 | 7 mot 7 | föreslagen | 13520 | 540 (4.0 %) | 73.9 % | 77.0 % | 23.2 % | 0.0 % |
| 11 | 9 mot 9 | granne | 13520 | 540 (4.0 %) | 73.9 % | 77.0 % | 23.2 % | 0.0 % |
| 12 | 5 mot 5 | granne | 13520 | 1254 (9.3 %) | 73.9 % | 81.5 % | 23.2 % | 0.0 % |
| 12 | 7 mot 7 | föreslagen | 13520 | 540 (4.0 %) | 73.9 % | 77.0 % | 23.2 % | 0.0 % |
| 12 | 9 mot 9 | granne | 13520 | 540 (4.0 %) | 73.9 % | 77.0 % | 23.2 % | 0.0 % |
| 13 | 7 mot 7 | granne | 14640 | 547 (3.7 %) | 50.6 % | 52.6 % | 17.7 % | 29.4 % |
| 13 | 9 mot 9 | föreslagen | 14640 | 360 (2.5 %) | 65.8 % | 67.5 % | 28.5 % | 30.2 % |
| 13 | 11 mot 11 | granne | 14640 | 360 (2.5 %) | 65.8 % | 67.5 % | 28.5 % | 30.2 % |
| 14 | 7 mot 7 | granne | 14640 | 547 (3.7 %) | 50.6 % | 52.6 % | 17.7 % | 29.4 % |
| 14 | 9 mot 9 | föreslagen | 14640 | 360 (2.5 %) | 65.8 % | 67.5 % | 28.5 % | 30.2 % |
| 14 | 11 mot 11 | granne | 14640 | 360 (2.5 %) | 65.8 % | 67.5 % | 28.5 % | 30.2 % |
| 15 | 9 mot 9 | granne | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 15 | 11 mot 11 | föreslagen | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 16 | 9 mot 9 | granne | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 16 | 11 mot 11 | föreslagen | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 17 | 9 mot 9 | granne | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 17 | 11 mot 11 | föreslagen | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 18 | 9 mot 9 | granne | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 18 | 11 mot 11 | föreslagen | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 19 | 9 mot 9 | granne | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |
| 19 | 11 mot 11 | föreslagen | 14640 | 1065 (7.3 %) | 60.9 % | 65.7 % | 24.3 % | 28.0 % |

### Andel "inget pass" per ålder

| Ålder | Körfall | Inget pass | Andel |
|---|---|---|---|
| 6 | 15792 | 0 | 0.0 % |
| 7 | 15792 | 0 | 0.0 % |
| 8 | 37653 | 0 | 0.0 % |
| 9 | 37653 | 0 | 0.0 % |
| 10 | 40560 | 2334 | 5.8 % |
| 11 | 40560 | 2334 | 5.8 % |
| 12 | 40560 | 2334 | 5.8 % |
| 13 | 43920 | 1267 | 2.9 % |
| 14 | 43920 | 1267 | 2.9 % |
| 15 | 29280 | 2130 | 7.3 % |
| 16 | 29280 | 2130 | 7.3 % |
| 17 | 29280 | 2130 | 7.3 % |
| 18 | 29280 | 2130 | 7.3 % |
| 19 | 29280 | 2130 | 7.3 % |

### Andel "inget pass" per spelform

| Spelform | Körfall | Inget pass | Andel |
|---|---|---|---|
| 3mot3 | 40894 | 0 | 0.0 % |
| 5mot5 | 81454 | 3762 | 4.6 % |
| 7mot7 | 94942 | 2714 | 2.9 % |
| 9mot9 | 143040 | 7665 | 5.4 % |
| 11mot11 | 102480 | 6045 | 5.9 % |

### Orsaker, enligt generatorns egna koder

| Orsak (regelmotorns kod) | Regel | Antal | Andel av alla "inget pass" |
|---|---|---|---|
| `inget-matchar` | R-101 (ingen av del-ovning, del-spelovning, del-spel kan fyllas, se R-100 "Delen kan fyllas") | 20186 | 100.0 % |
| `gar-inte-att-kombinera` | R-100, andra punkten (en del kan fyllas för sig men gick inte ihop med resten av passet) | 0 | 0.0 % |

### Vilket enskilt val som skulle kunna ge ett pass (R-103), bland "inget pass"

| Val som, ensamt ändrat, skulle kunna ge ett pass (R-103) | Antal "inget pass" där det hjälper | Andel |
|---|---|---|
| spelare | 17396 | 86.2 % |
| fokus | 14522 | 71.9 % |
| yta | 14048 | 69.6 % |
| spelform | 2504 | 12.4 % |
| niva | 2266 | 11.2 % |
| ledare | 166 | 0.8 % |

### Ersättningsfokus (R-121)

Av 625920 fyllda kärnmoment (del-ovning eller del-spelovning, över alla körfall i enkelfokussvepet som gav ett pass) fick 337065 ett ersättningsfokus (R-121): 53.9 %.

| Spelform | Fyllda kärnmoment | Med ersättningsfokus | Andel |
|---|---|---|---|
| 3mot3 | 62640 | 33312 | 53.2 % |
| 5mot5 | 127110 | 68019 | 53.5 % |
| 7mot7 | 134782 | 75379 | 55.9 % |
| 9mot9 | 182257 | 98539 | 54.1 % |
| 11mot11 | 119131 | 61816 | 51.9 % |

De tio vanligaste ersättningarna (valt fokus -> ersättningsfokus):

| Valt fokus -> ersättning | Antal |
|---|---|
| lek -> dribbling | 26394 |
| fasta-situationer -> passning-mottagning | 24576 |
| forsvarsspel -> ett-mot-ett | 21891 |
| speluppbyggnad -> passning-mottagning | 20400 |
| omstallning -> passning-mottagning | 19932 |
| snabbhet -> dribbling | 18618 |
| malvaktsspel -> avslut | 17364 |
| bollkansla -> dribbling | 15786 |
| koordination -> ett-mot-ett | 13455 |
| bollkansla -> passning-mottagning | 12486 |

### Per spelform, passdel och fokusområde: bankens täckning och om delen kan fyllas för sig

"Kan inte fyllas för sig" är andelen körfall i enkelfokussvepet där begreppet *Delen kan fyllas* (generatorregler.md) är falskt för just den delen, oavsett resten av passet. Delar som R-033 tar bort (måltid under 5 minuter) räknas inte in i "Körfall" här.

#### 3mot3

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 2 | 3456 | 0.3 % |
| dribbling | 0 | 3456 | 0.3 % |
| passning-mottagning | 0 | 3456 | 0.3 % |
| avslut | 0 | 3456 | 0.3 % |
| ett-mot-ett | 0 | 3456 | 0.3 % |
| spelbarhet | 0 | 3456 | 0.3 % |
| koordination | 4 | 3456 | 0.3 % |
| snabbhet | 2 | 3456 | 0.3 % |
| lek | 3 | 3456 | 0.3 % |
| speluppbyggnad | 0 | 1728 | 0.6 % |
| forsvarsspel | 0 | 1728 | 0.6 % |
| omstallning | 0 | 1728 | 0.6 % |
| malvaktsspel | 0 | 1728 | 0.6 % |
| skadeforebyggande | 1 | 1728 | 0.6 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 3 | 3456 | 50.0 % |
| dribbling | 4 | 3456 | 16.7 % |
| passning-mottagning | 2 | 3456 | 55.6 % |
| avslut | 3 | 3456 | 16.7 % |
| ett-mot-ett | 2 | 3456 | 33.3 % |
| spelbarhet | 1 | 3456 | 77.8 % |
| koordination | 2 | 3456 | 50.0 % |
| snabbhet | 0 | 3456 | 100.0 % |
| lek | 1 | 3456 | 66.7 % |
| speluppbyggnad | 0 | 1728 | 100.0 % |
| forsvarsspel | 0 | 1728 | 100.0 % |
| omstallning | 0 | 1728 | 100.0 % |
| malvaktsspel | 0 | 1728 | 100.0 % |
| skadeforebyggande | 0 | 1728 | 100.0 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 2880 | 100.0 % |
| dribbling | 2 | 2880 | 20.0 % |
| passning-mottagning | 2 | 2880 | 20.0 % |
| avslut | 4 | 2880 | 0.0 % |
| ett-mot-ett | 5 | 2880 | 0.0 % |
| spelbarhet | 3 | 2880 | 0.0 % |
| koordination | 0 | 2880 | 100.0 % |
| snabbhet | 0 | 2880 | 100.0 % |
| lek | 0 | 2880 | 100.0 % |
| speluppbyggnad | 0 | 1728 | 100.0 % |
| forsvarsspel | 1 | 1728 | 33.3 % |
| omstallning | 1 | 1728 | 33.3 % |
| malvaktsspel | 0 | 1728 | 100.0 % |
| skadeforebyggande | 0 | 1728 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 3456 | 0.0 % |
| dribbling | 1 | 3456 | 0.0 % |
| passning-mottagning | 0 | 3456 | 0.0 % |
| avslut | 2 | 3456 | 0.0 % |
| ett-mot-ett | 2 | 3456 | 0.0 % |
| spelbarhet | 0 | 3456 | 0.0 % |
| koordination | 0 | 3456 | 0.0 % |
| snabbhet | 0 | 3456 | 0.0 % |
| lek | 0 | 3456 | 0.0 % |
| speluppbyggnad | 0 | 1728 | 0.0 % |
| forsvarsspel | 0 | 1728 | 0.0 % |
| omstallning | 0 | 1728 | 0.0 % |
| malvaktsspel | 0 | 1728 | 0.0 % |
| skadeforebyggande | 0 | 1728 | 0.0 % |

#### 5mot5

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 5 | 6048 | 2.0 % |
| dribbling | 1 | 6048 | 2.0 % |
| passning-mottagning | 0 | 6048 | 2.0 % |
| avslut | 0 | 6048 | 2.0 % |
| ett-mot-ett | 0 | 6048 | 2.0 % |
| spelbarhet | 0 | 6048 | 2.0 % |
| koordination | 7 | 6048 | 2.0 % |
| snabbhet | 3 | 6048 | 2.0 % |
| lek | 5 | 6048 | 2.0 % |
| speluppbyggnad | 0 | 4320 | 2.7 % |
| forsvarsspel | 0 | 4320 | 2.7 % |
| omstallning | 0 | 4320 | 2.7 % |
| malvaktsspel | 0 | 4320 | 2.7 % |
| skadeforebyggande | 2 | 4320 | 2.7 % |
| fasta-situationer | 0 | 2592 | 4.2 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 4 | 6048 | 61.9 % |
| dribbling | 7 | 6048 | 20.5 % |
| passning-mottagning | 6 | 6048 | 30.4 % |
| avslut | 4 | 6048 | 31.0 % |
| ett-mot-ett | 5 | 6048 | 24.4 % |
| spelbarhet | 4 | 6048 | 46.2 % |
| koordination | 2 | 6048 | 71.4 % |
| snabbhet | 0 | 6048 | 100.0 % |
| lek | 1 | 6048 | 81.0 % |
| speluppbyggnad | 1 | 4320 | 70.0 % |
| forsvarsspel | 2 | 4320 | 60.0 % |
| omstallning | 1 | 4320 | 62.5 % |
| malvaktsspel | 2 | 4320 | 43.3 % |
| skadeforebyggande | 0 | 4320 | 100.0 % |
| fasta-situationer | 0 | 2592 | 100.0 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 5472 | 100.0 % |
| dribbling | 3 | 5472 | 36.8 % |
| passning-mottagning | 3 | 5472 | 39.5 % |
| avslut | 7 | 5472 | 15.8 % |
| ett-mot-ett | 7 | 5472 | 11.0 % |
| spelbarhet | 7 | 5472 | 3.3 % |
| koordination | 0 | 5472 | 100.0 % |
| snabbhet | 0 | 5472 | 100.0 % |
| lek | 0 | 5472 | 100.0 % |
| speluppbyggnad | 2 | 4320 | 72.8 % |
| forsvarsspel | 2 | 4320 | 64.7 % |
| omstallning | 2 | 4320 | 63.3 % |
| malvaktsspel | 2 | 4320 | 72.8 % |
| skadeforebyggande | 0 | 4320 | 100.0 % |
| fasta-situationer | 0 | 2592 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 35.7 % |
| dribbling | 1 | 6048 | 35.7 % |
| passning-mottagning | 2 | 6048 | 35.7 % |
| avslut | 2 | 6048 | 35.7 % |
| ett-mot-ett | 2 | 6048 | 35.7 % |
| spelbarhet | 2 | 6048 | 35.7 % |
| koordination | 0 | 6048 | 35.7 % |
| snabbhet | 0 | 6048 | 35.7 % |
| lek | 0 | 6048 | 35.7 % |
| speluppbyggnad | 0 | 4320 | 50.0 % |
| forsvarsspel | 1 | 4320 | 50.0 % |
| omstallning | 1 | 4320 | 50.0 % |
| malvaktsspel | 0 | 4320 | 50.0 % |
| skadeforebyggande | 0 | 4320 | 50.0 % |
| fasta-situationer | 0 | 2592 | 83.3 % |

#### 7mot7

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 5 | 6048 | 2.0 % |
| dribbling | 1 | 6048 | 2.0 % |
| passning-mottagning | 2 | 6048 | 2.0 % |
| avslut | 0 | 6048 | 2.0 % |
| ett-mot-ett | 0 | 6048 | 2.0 % |
| spelbarhet | 2 | 6048 | 2.0 % |
| speluppbyggnad | 0 | 6048 | 2.0 % |
| forsvarsspel | 0 | 6048 | 2.0 % |
| omstallning | 0 | 6048 | 2.0 % |
| malvaktsspel | 0 | 6048 | 2.0 % |
| koordination | 7 | 6048 | 2.0 % |
| snabbhet | 2 | 6048 | 2.0 % |
| skadeforebyggande | 3 | 6048 | 2.0 % |
| lek | 3 | 6048 | 2.0 % |
| fasta-situationer | 0 | 4320 | 2.6 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 1728 | 0.2 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 2 | 5472 | 75.4 % |
| dribbling | 6 | 5472 | 23.6 % |
| passning-mottagning | 9 | 5472 | 2.0 % |
| avslut | 3 | 5472 | 34.2 % |
| ett-mot-ett | 5 | 5472 | 19.1 % |
| spelbarhet | 6 | 5472 | 19.5 % |
| speluppbyggnad | 1 | 5472 | 76.3 % |
| forsvarsspel | 3 | 5472 | 63.2 % |
| omstallning | 1 | 5472 | 70.4 % |
| malvaktsspel | 3 | 5472 | 34.2 % |
| koordination | 0 | 5472 | 100.0 % |
| snabbhet | 1 | 5472 | 81.6 % |
| skadeforebyggande | 0 | 5472 | 100.0 % |
| lek | 0 | 5472 | 100.0 % |
| fasta-situationer | 0 | 3744 | 100.0 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 1152 | 100.0 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 100.0 % |
| dribbling | 3 | 6048 | 36.9 % |
| passning-mottagning | 2 | 6048 | 64.3 % |
| avslut | 8 | 6048 | 25.4 % |
| ett-mot-ett | 6 | 6048 | 13.5 % |
| spelbarhet | 7 | 6048 | 26.0 % |
| speluppbyggnad | 2 | 6048 | 80.6 % |
| forsvarsspel | 3 | 6048 | 60.5 % |
| omstallning | 3 | 6048 | 59.5 % |
| malvaktsspel | 2 | 6048 | 80.6 % |
| koordination | 0 | 6048 | 100.0 % |
| snabbhet | 1 | 6048 | 75.0 % |
| skadeforebyggande | 0 | 6048 | 100.0 % |
| lek | 0 | 6048 | 100.0 % |
| fasta-situationer | 0 | 4320 | 100.0 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 1728 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 17.2 % |
| dribbling | 0 | 6048 | 17.2 % |
| passning-mottagning | 3 | 6048 | 17.2 % |
| avslut | 4 | 6048 | 17.2 % |
| ett-mot-ett | 1 | 6048 | 17.2 % |
| spelbarhet | 5 | 6048 | 17.2 % |
| speluppbyggnad | 1 | 6048 | 17.2 % |
| forsvarsspel | 2 | 6048 | 17.2 % |
| omstallning | 3 | 6048 | 17.2 % |
| malvaktsspel | 1 | 6048 | 17.2 % |
| koordination | 0 | 6048 | 17.2 % |
| snabbhet | 0 | 6048 | 17.2 % |
| skadeforebyggande | 0 | 6048 | 17.2 % |
| lek | 0 | 6048 | 17.2 % |
| fasta-situationer | 1 | 4320 | 24.0 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 1728 | 10.1 % |

#### 9mot9

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 4 | 8640 | 4.1 % |
| dribbling | 1 | 8640 | 4.1 % |
| passning-mottagning | 2 | 8640 | 4.1 % |
| avslut | 0 | 8640 | 4.1 % |
| ett-mot-ett | 0 | 8640 | 4.1 % |
| spelbarhet | 2 | 8640 | 4.1 % |
| speluppbyggnad | 0 | 8640 | 4.1 % |
| forsvarsspel | 0 | 8640 | 4.1 % |
| omstallning | 0 | 8640 | 4.1 % |
| fasta-situationer | 0 | 8640 | 4.1 % |
| malvaktsspel | 0 | 8640 | 4.1 % |
| koordination | 5 | 8640 | 4.1 % |
| snabbhet | 1 | 8640 | 4.1 % |
| skadeforebyggande | 2 | 8640 | 4.1 % |
| lek | 2 | 8640 | 4.1 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 6048 | 4.0 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 2 | 6624 | 79.7 % |
| dribbling | 5 | 6624 | 16.2 % |
| passning-mottagning | 6 | 6624 | 1.6 % |
| avslut | 2 | 6624 | 19.6 % |
| ett-mot-ett | 4 | 6624 | 12.5 % |
| spelbarhet | 5 | 6624 | 1.6 % |
| speluppbyggnad | 1 | 6624 | 80.4 % |
| forsvarsspel | 3 | 6624 | 69.6 % |
| omstallning | 1 | 6624 | 75.5 % |
| fasta-situationer | 0 | 6624 | 100.0 % |
| malvaktsspel | 2 | 6624 | 19.6 % |
| koordination | 0 | 6624 | 100.0 % |
| snabbhet | 1 | 6624 | 46.7 % |
| skadeforebyggande | 0 | 6624 | 100.0 % |
| lek | 0 | 6624 | 100.0 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 4032 | 100.0 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 8640 | 100.0 % |
| dribbling | 2 | 8640 | 40.0 % |
| passning-mottagning | 2 | 8640 | 33.6 % |
| avslut | 5 | 8640 | 42.8 % |
| ett-mot-ett | 3 | 8640 | 30.3 % |
| spelbarhet | 6 | 8640 | 16.8 % |
| speluppbyggnad | 3 | 8640 | 43.4 % |
| forsvarsspel | 3 | 8640 | 60.7 % |
| omstallning | 4 | 8640 | 60.0 % |
| fasta-situationer | 1 | 8640 | 100.0 % |
| malvaktsspel | 1 | 8640 | 98.1 % |
| koordination | 0 | 8640 | 100.0 % |
| snabbhet | 1 | 8640 | 53.3 % |
| skadeforebyggande | 0 | 8640 | 100.0 % |
| lek | 0 | 8640 | 100.0 % |
| nickspel | 1 | 0 | – |
| uthallighet | 0 | 6048 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 8640 | 19.0 % |
| dribbling | 0 | 8640 | 19.0 % |
| passning-mottagning | 2 | 8640 | 19.0 % |
| avslut | 3 | 8640 | 19.0 % |
| ett-mot-ett | 0 | 8640 | 19.0 % |
| spelbarhet | 5 | 8640 | 19.0 % |
| speluppbyggnad | 1 | 8640 | 19.0 % |
| forsvarsspel | 3 | 8640 | 19.0 % |
| omstallning | 2 | 8640 | 19.0 % |
| fasta-situationer | 2 | 8640 | 19.0 % |
| malvaktsspel | 0 | 8640 | 19.0 % |
| koordination | 0 | 8640 | 19.0 % |
| snabbhet | 0 | 8640 | 19.0 % |
| skadeforebyggande | 0 | 8640 | 19.0 % |
| lek | 0 | 8640 | 19.0 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 6048 | 12.8 % |

#### 11mot11

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 1 | 6048 | 4.0 % |
| dribbling | 0 | 6048 | 4.0 % |
| passning-mottagning | 2 | 6048 | 4.0 % |
| avslut | 0 | 6048 | 4.0 % |
| nickspel | 0 | 0 | – |
| ett-mot-ett | 0 | 6048 | 4.0 % |
| spelbarhet | 2 | 6048 | 4.0 % |
| speluppbyggnad | 0 | 6048 | 4.0 % |
| forsvarsspel | 0 | 6048 | 4.0 % |
| omstallning | 0 | 6048 | 4.0 % |
| fasta-situationer | 0 | 6048 | 4.0 % |
| malvaktsspel | 0 | 6048 | 4.0 % |
| koordination | 2 | 6048 | 4.0 % |
| snabbhet | 0 | 6048 | 4.0 % |
| uthallighet | 0 | 6048 | 4.0 % |
| skadeforebyggande | 1 | 6048 | 4.0 % |
| lek | 0 | 6048 | 4.0 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 1 | 4032 | 81.0 % |
| dribbling | 2 | 4032 | 10.1 % |
| passning-mottagning | 3 | 4032 | 0.0 % |
| avslut | 1 | 4032 | 0.0 % |
| nickspel | 0 | 0 | – |
| ett-mot-ett | 1 | 4032 | 12.5 % |
| spelbarhet | 2 | 4032 | 0.0 % |
| speluppbyggnad | 0 | 4032 | 100.0 % |
| forsvarsspel | 1 | 4032 | 92.9 % |
| omstallning | 0 | 4032 | 100.0 % |
| fasta-situationer | 0 | 4032 | 100.0 % |
| malvaktsspel | 1 | 4032 | 0.0 % |
| koordination | 0 | 4032 | 100.0 % |
| snabbhet | 1 | 4032 | 12.5 % |
| uthallighet | 0 | 4032 | 100.0 % |
| skadeforebyggande | 0 | 4032 | 100.0 % |
| lek | 0 | 4032 | 100.0 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 100.0 % |
| dribbling | 1 | 6048 | 33.3 % |
| passning-mottagning | 1 | 6048 | 21.9 % |
| avslut | 2 | 6048 | 46.8 % |
| nickspel | 0 | 0 | – |
| ett-mot-ett | 1 | 6048 | 33.3 % |
| spelbarhet | 2 | 6048 | 21.1 % |
| speluppbyggnad | 2 | 6048 | 21.9 % |
| forsvarsspel | 2 | 6048 | 50.0 % |
| omstallning | 3 | 6048 | 50.0 % |
| fasta-situationer | 0 | 6048 | 100.0 % |
| malvaktsspel | 0 | 6048 | 100.0 % |
| koordination | 0 | 6048 | 100.0 % |
| snabbhet | 1 | 6048 | 33.3 % |
| uthallighet | 0 | 6048 | 100.0 % |
| skadeforebyggande | 0 | 6048 | 100.0 % |
| lek | 0 | 6048 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 12.8 % |
| dribbling | 0 | 6048 | 12.8 % |
| passning-mottagning | 1 | 6048 | 12.8 % |
| avslut | 2 | 6048 | 12.8 % |
| nickspel | 0 | 0 | – |
| ett-mot-ett | 0 | 6048 | 12.8 % |
| spelbarhet | 4 | 6048 | 12.8 % |
| speluppbyggnad | 1 | 6048 | 12.8 % |
| forsvarsspel | 3 | 6048 | 12.8 % |
| omstallning | 2 | 6048 | 12.8 % |
| fasta-situationer | 1 | 6048 | 12.8 % |
| malvaktsspel | 0 | 6048 | 12.8 % |
| koordination | 0 | 6048 | 12.8 % |
| snabbhet | 0 | 6048 | 12.8 % |
| uthallighet | 0 | 6048 | 12.8 % |
| skadeforebyggande | 0 | 6048 | 12.8 % |
| lek | 0 | 6048 | 12.8 % |

## Efter CI-rättning (72 godkända + 26 granskade räknade som godkända)

Banken som regelmotorn fick: 98 övningar.

Körfall totalt: 462810. "Inget pass": 3130 (0.7 %). Pass skapat: 459680 (99.3 %).

### Per cell i planen (åldersgrupp och spelform)

| Cell | Typ | Körfall | Inget pass | Fylld kärna, av alla körfall | Fylld kärna, av skapade pass | Kärna på valt fokus, av alla körfall | Kärndel borttagen (R-033) |
|---|---|---|---|---|---|---|---|
| 6–7 år, 3 mot 3 | föreslagen | 15792 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 6–7 år, 5 mot 5 | granne | 15792 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 8–9 år, 5 mot 5 | föreslagen | 25102 | 0 (0.0 %) | 85.5 % | 85.5 % | 46.0 % | 0.0 % |
| 8–9 år, 3 mot 3 | granne | 25102 | 0 (0.0 %) | 85.5 % | 85.5 % | 43.2 % | 0.0 % |
| 8–9 år, 7 mot 7 | granne | 25102 | 0 (0.0 %) | 85.5 % | 85.5 % | 46.0 % | 0.0 % |
| 10–12 år, 7 mot 7 | föreslagen | 40560 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 10–12 år, 5 mot 5 | granne | 40560 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 10–12 år, 9 mot 9 | granne | 40560 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 13–14 år, 9 mot 9 | föreslagen | 29280 | 432 (1.5 %) | 77.4 % | 78.6 % | 53.5 % | 30.5 % |
| 13–14 år, 7 mot 7 | granne | 29280 | 826 (2.8 %) | 75.5 % | 77.7 % | 44.6 % | 29.8 % |
| 13–14 år, 11 mot 11 | granne | 29280 | 432 (1.5 %) | 77.4 % | 78.6 % | 53.5 % | 30.5 % |
| 15–19 år, 11 mot 11 | föreslagen | 73200 | 720 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 15–19 år, 9 mot 9 | granne | 73200 | 720 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |

### Per cell (ålder och spelform)

| Ålder | Spelform | Typ | Körfall | Inget pass | Fylld kärna, av alla körfall | Fylld kärna, av skapade pass | Kärna på valt fokus, av alla körfall | Kärndel borttagen (R-033) |
|---|---|---|---|---|---|---|---|---|
| 6 | 3 mot 3 | föreslagen | 7896 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 6 | 5 mot 5 | granne | 7896 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 7 | 3 mot 3 | föreslagen | 7896 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 7 | 5 mot 5 | granne | 7896 | 0 (0.0 %) | 85.7 % | 85.7 % | 33.9 % | 32.8 % |
| 8 | 3 mot 3 | granne | 12551 | 0 (0.0 %) | 85.5 % | 85.5 % | 43.2 % | 0.0 % |
| 8 | 5 mot 5 | föreslagen | 12551 | 0 (0.0 %) | 85.5 % | 85.5 % | 46.0 % | 0.0 % |
| 8 | 7 mot 7 | granne | 12551 | 0 (0.0 %) | 85.5 % | 85.5 % | 46.0 % | 0.0 % |
| 9 | 3 mot 3 | granne | 12551 | 0 (0.0 %) | 85.5 % | 85.5 % | 43.2 % | 0.0 % |
| 9 | 5 mot 5 | föreslagen | 12551 | 0 (0.0 %) | 85.5 % | 85.5 % | 46.0 % | 0.0 % |
| 9 | 7 mot 7 | granne | 12551 | 0 (0.0 %) | 85.5 % | 85.5 % | 46.0 % | 0.0 % |
| 10 | 5 mot 5 | granne | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 10 | 7 mot 7 | föreslagen | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 10 | 9 mot 9 | granne | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 11 | 5 mot 5 | granne | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 11 | 7 mot 7 | föreslagen | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 11 | 9 mot 9 | granne | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 12 | 5 mot 5 | granne | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 12 | 7 mot 7 | föreslagen | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 12 | 9 mot 9 | granne | 13520 | 0 (0.0 %) | 91.7 % | 91.7 % | 47.4 % | 0.0 % |
| 13 | 7 mot 7 | granne | 14640 | 413 (2.8 %) | 75.5 % | 77.7 % | 44.6 % | 29.8 % |
| 13 | 9 mot 9 | föreslagen | 14640 | 216 (1.5 %) | 77.4 % | 78.6 % | 53.5 % | 30.5 % |
| 13 | 11 mot 11 | granne | 14640 | 216 (1.5 %) | 77.4 % | 78.6 % | 53.5 % | 30.5 % |
| 14 | 7 mot 7 | granne | 14640 | 413 (2.8 %) | 75.5 % | 77.7 % | 44.6 % | 29.8 % |
| 14 | 9 mot 9 | föreslagen | 14640 | 216 (1.5 %) | 77.4 % | 78.6 % | 53.5 % | 30.5 % |
| 14 | 11 mot 11 | granne | 14640 | 216 (1.5 %) | 77.4 % | 78.6 % | 53.5 % | 30.5 % |
| 15 | 9 mot 9 | granne | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 15 | 11 mot 11 | föreslagen | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 16 | 9 mot 9 | granne | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 16 | 11 mot 11 | föreslagen | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 17 | 9 mot 9 | granne | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 17 | 11 mot 11 | föreslagen | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 18 | 9 mot 9 | granne | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 18 | 11 mot 11 | föreslagen | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 19 | 9 mot 9 | granne | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |
| 19 | 11 mot 11 | föreslagen | 14640 | 144 (1.0 %) | 89.5 % | 90.4 % | 58.7 % | 30.5 % |

### Andel "inget pass" per ålder

| Ålder | Körfall | Inget pass | Andel |
|---|---|---|---|
| 6 | 15792 | 0 | 0.0 % |
| 7 | 15792 | 0 | 0.0 % |
| 8 | 37653 | 0 | 0.0 % |
| 9 | 37653 | 0 | 0.0 % |
| 10 | 40560 | 0 | 0.0 % |
| 11 | 40560 | 0 | 0.0 % |
| 12 | 40560 | 0 | 0.0 % |
| 13 | 43920 | 845 | 1.9 % |
| 14 | 43920 | 845 | 1.9 % |
| 15 | 29280 | 288 | 1.0 % |
| 16 | 29280 | 288 | 1.0 % |
| 17 | 29280 | 288 | 1.0 % |
| 18 | 29280 | 288 | 1.0 % |
| 19 | 29280 | 288 | 1.0 % |

### Andel "inget pass" per spelform

| Spelform | Körfall | Inget pass | Andel |
|---|---|---|---|
| 3mot3 | 40894 | 0 | 0.0 % |
| 5mot5 | 81454 | 0 | 0.0 % |
| 7mot7 | 94942 | 826 | 0.9 % |
| 9mot9 | 143040 | 1152 | 0.8 % |
| 11mot11 | 102480 | 1152 | 1.1 % |

### Orsaker, enligt generatorns egna koder

| Orsak (regelmotorns kod) | Regel | Antal | Andel av alla "inget pass" |
|---|---|---|---|
| `inget-matchar` | R-101 (ingen av del-ovning, del-spelovning, del-spel kan fyllas, se R-100 "Delen kan fyllas") | 3130 | 100.0 % |
| `gar-inte-att-kombinera` | R-100, andra punkten (en del kan fyllas för sig men gick inte ihop med resten av passet) | 0 | 0.0 % |

### Vilket enskilt val som skulle kunna ge ett pass (R-103), bland "inget pass"

| Val som, ensamt ändrat, skulle kunna ge ett pass (R-103) | Antal "inget pass" där det hjälper | Andel |
|---|---|---|
| spelare | 3130 | 100.0 % |
| yta | 3130 | 100.0 % |
| fokus | 730 | 23.3 % |
| spelform | 394 | 12.6 % |
| niva | 336 | 10.7 % |
| ledare | 90 | 2.9 % |

### Ersättningsfokus (R-121)

Av 736828 fyllda kärnmoment (del-ovning eller del-spelovning, över alla körfall i enkelfokussvepet som gav ett pass) fick 255397 ett ersättningsfokus (R-121): 34.7 %.

| Spelform | Fyllda kärnmoment | Med ersättningsfokus | Andel |
|---|---|---|---|
| 3mot3 | 68420 | 27448 | 40.1 % |
| 5mot5 | 142814 | 51589 | 36.1 % |
| 7mot7 | 157752 | 56393 | 35.7 % |
| 9mot9 | 221118 | 73638 | 33.3 % |
| 11mot11 | 146724 | 46329 | 31.6 % |

De tio vanligaste ersättningarna (valt fokus -> ersättningsfokus):

| Valt fokus -> ersättning | Antal |
|---|---|
| lek -> dribbling | 29724 |
| snabbhet -> dribbling | 26928 |
| malvaktsspel -> avslut | 19026 |
| koordination -> ett-mot-ett | 17559 |
| bollkansla -> ett-mot-ett | 17001 |
| skadeforebyggande -> koordination | 14184 |
| speluppbyggnad -> passning-mottagning | 11600 |
| fasta-situationer -> avslut | 10209 |
| skadeforebyggande -> bollkansla | 9864 |
| koordination -> snabbhet | 9576 |

### Per spelform, passdel och fokusområde: bankens täckning och om delen kan fyllas för sig

"Kan inte fyllas för sig" är andelen körfall i enkelfokussvepet där begreppet *Delen kan fyllas* (generatorregler.md) är falskt för just den delen, oavsett resten av passet. Delar som R-033 tar bort (måltid under 5 minuter) räknas inte in i "Körfall" här.

#### 3mot3

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 4 | 3456 | 0.0 % |
| dribbling | 1 | 3456 | 0.0 % |
| passning-mottagning | 0 | 3456 | 0.0 % |
| avslut | 0 | 3456 | 0.0 % |
| ett-mot-ett | 0 | 3456 | 0.0 % |
| spelbarhet | 0 | 3456 | 0.0 % |
| koordination | 6 | 3456 | 0.0 % |
| snabbhet | 2 | 3456 | 0.0 % |
| lek | 4 | 3456 | 0.0 % |
| speluppbyggnad | 0 | 1728 | 0.0 % |
| forsvarsspel | 0 | 1728 | 0.0 % |
| omstallning | 0 | 1728 | 0.0 % |
| malvaktsspel | 0 | 1728 | 0.0 % |
| skadeforebyggande | 1 | 1728 | 0.0 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 6 | 3456 | 0.0 % |
| dribbling | 6 | 3456 | 0.0 % |
| passning-mottagning | 3 | 3456 | 50.0 % |
| avslut | 4 | 3456 | 0.0 % |
| ett-mot-ett | 2 | 3456 | 33.3 % |
| spelbarhet | 3 | 3456 | 50.0 % |
| koordination | 4 | 3456 | 0.0 % |
| snabbhet | 0 | 3456 | 100.0 % |
| lek | 3 | 3456 | 18.8 % |
| speluppbyggnad | 0 | 1728 | 100.0 % |
| forsvarsspel | 1 | 1728 | 33.3 % |
| omstallning | 1 | 1728 | 33.3 % |
| malvaktsspel | 0 | 1728 | 100.0 % |
| skadeforebyggande | 0 | 1728 | 100.0 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 1 | 2880 | 47.5 % |
| dribbling | 3 | 2880 | 2.5 % |
| passning-mottagning | 2 | 2880 | 20.0 % |
| avslut | 4 | 2880 | 0.0 % |
| ett-mot-ett | 5 | 2880 | 0.0 % |
| spelbarhet | 4 | 2880 | 0.0 % |
| koordination | 0 | 2880 | 100.0 % |
| snabbhet | 0 | 2880 | 100.0 % |
| lek | 1 | 2880 | 47.5 % |
| speluppbyggnad | 0 | 1728 | 100.0 % |
| forsvarsspel | 2 | 1728 | 0.0 % |
| omstallning | 2 | 1728 | 0.0 % |
| malvaktsspel | 0 | 1728 | 100.0 % |
| skadeforebyggande | 0 | 1728 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 3456 | 0.0 % |
| dribbling | 1 | 3456 | 0.0 % |
| passning-mottagning | 0 | 3456 | 0.0 % |
| avslut | 2 | 3456 | 0.0 % |
| ett-mot-ett | 2 | 3456 | 0.0 % |
| spelbarhet | 0 | 3456 | 0.0 % |
| koordination | 0 | 3456 | 0.0 % |
| snabbhet | 0 | 3456 | 0.0 % |
| lek | 0 | 3456 | 0.0 % |
| speluppbyggnad | 0 | 1728 | 0.0 % |
| forsvarsspel | 0 | 1728 | 0.0 % |
| omstallning | 0 | 1728 | 0.0 % |
| malvaktsspel | 0 | 1728 | 0.0 % |
| skadeforebyggande | 0 | 1728 | 0.0 % |

#### 5mot5

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 7 | 6048 | 0.0 % |
| dribbling | 2 | 6048 | 0.0 % |
| passning-mottagning | 0 | 6048 | 0.0 % |
| avslut | 0 | 6048 | 0.0 % |
| ett-mot-ett | 0 | 6048 | 0.0 % |
| spelbarhet | 0 | 6048 | 0.0 % |
| koordination | 9 | 6048 | 0.0 % |
| snabbhet | 3 | 6048 | 0.0 % |
| lek | 6 | 6048 | 0.0 % |
| speluppbyggnad | 0 | 4320 | 0.0 % |
| forsvarsspel | 0 | 4320 | 0.0 % |
| omstallning | 0 | 4320 | 0.0 % |
| malvaktsspel | 0 | 4320 | 0.0 % |
| skadeforebyggande | 2 | 4320 | 0.0 % |
| fasta-situationer | 0 | 2592 | 0.0 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 7 | 6048 | 0.0 % |
| dribbling | 10 | 6048 | 0.0 % |
| passning-mottagning | 9 | 6048 | 28.6 % |
| avslut | 7 | 6048 | 0.0 % |
| ett-mot-ett | 5 | 6048 | 24.4 % |
| spelbarhet | 7 | 6048 | 28.6 % |
| koordination | 4 | 6048 | 0.0 % |
| snabbhet | 0 | 6048 | 100.0 % |
| lek | 3 | 6048 | 53.6 % |
| speluppbyggnad | 1 | 4320 | 70.0 % |
| forsvarsspel | 4 | 4320 | 15.8 % |
| omstallning | 3 | 4320 | 15.8 % |
| malvaktsspel | 2 | 4320 | 43.3 % |
| skadeforebyggande | 0 | 4320 | 100.0 % |
| fasta-situationer | 1 | 2592 | 15.6 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 1 | 5472 | 72.4 % |
| dribbling | 5 | 5472 | 7.2 % |
| passning-mottagning | 5 | 5472 | 12.5 % |
| avslut | 9 | 5472 | 0.2 % |
| ett-mot-ett | 8 | 5472 | 0.8 % |
| spelbarhet | 11 | 5472 | 0.7 % |
| koordination | 0 | 5472 | 100.0 % |
| snabbhet | 0 | 5472 | 100.0 % |
| lek | 1 | 5472 | 72.4 % |
| speluppbyggnad | 4 | 4320 | 19.2 % |
| forsvarsspel | 5 | 4320 | 2.5 % |
| omstallning | 5 | 4320 | 2.5 % |
| malvaktsspel | 2 | 4320 | 72.8 % |
| skadeforebyggande | 0 | 4320 | 100.0 % |
| fasta-situationer | 0 | 2592 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 0.0 % |
| dribbling | 1 | 6048 | 0.0 % |
| passning-mottagning | 2 | 6048 | 0.0 % |
| avslut | 3 | 6048 | 0.0 % |
| ett-mot-ett | 2 | 6048 | 0.0 % |
| spelbarhet | 2 | 6048 | 0.0 % |
| koordination | 0 | 6048 | 0.0 % |
| snabbhet | 0 | 6048 | 0.0 % |
| lek | 0 | 6048 | 0.0 % |
| speluppbyggnad | 0 | 4320 | 0.0 % |
| forsvarsspel | 2 | 4320 | 0.0 % |
| omstallning | 2 | 4320 | 0.0 % |
| malvaktsspel | 0 | 4320 | 0.0 % |
| skadeforebyggande | 0 | 4320 | 0.0 % |
| fasta-situationer | 0 | 2592 | 0.0 % |

#### 7mot7

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 7 | 6048 | 0.1 % |
| dribbling | 2 | 6048 | 0.1 % |
| passning-mottagning | 2 | 6048 | 0.1 % |
| avslut | 0 | 6048 | 0.1 % |
| ett-mot-ett | 0 | 6048 | 0.1 % |
| spelbarhet | 2 | 6048 | 0.1 % |
| speluppbyggnad | 0 | 6048 | 0.1 % |
| forsvarsspel | 0 | 6048 | 0.1 % |
| omstallning | 0 | 6048 | 0.1 % |
| malvaktsspel | 0 | 6048 | 0.1 % |
| koordination | 9 | 6048 | 0.1 % |
| snabbhet | 2 | 6048 | 0.1 % |
| skadeforebyggande | 3 | 6048 | 0.1 % |
| lek | 4 | 6048 | 0.1 % |
| fasta-situationer | 0 | 4320 | 0.1 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 1728 | 0.2 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 5 | 5472 | 7.0 % |
| dribbling | 9 | 5472 | 0.9 % |
| passning-mottagning | 14 | 5472 | 0.0 % |
| avslut | 8 | 5472 | 0.0 % |
| ett-mot-ett | 6 | 5472 | 19.1 % |
| spelbarhet | 10 | 5472 | 0.0 % |
| speluppbyggnad | 2 | 5472 | 59.9 % |
| forsvarsspel | 5 | 5472 | 28.3 % |
| omstallning | 3 | 5472 | 33.6 % |
| malvaktsspel | 4 | 5472 | 34.2 % |
| koordination | 2 | 5472 | 21.1 % |
| snabbhet | 1 | 5472 | 81.6 % |
| skadeforebyggande | 0 | 5472 | 100.0 % |
| lek | 2 | 5472 | 69.7 % |
| fasta-situationer | 2 | 3744 | 20.4 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 1152 | 100.0 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 1 | 6048 | 75.0 % |
| dribbling | 5 | 6048 | 10.1 % |
| passning-mottagning | 5 | 6048 | 25.6 % |
| avslut | 12 | 6048 | 2.9 % |
| ett-mot-ett | 8 | 6048 | 4.3 % |
| spelbarhet | 13 | 6048 | 3.7 % |
| speluppbyggnad | 5 | 6048 | 28.0 % |
| forsvarsspel | 7 | 6048 | 7.1 % |
| omstallning | 8 | 6048 | 7.1 % |
| malvaktsspel | 3 | 6048 | 59.1 % |
| koordination | 0 | 6048 | 100.0 % |
| snabbhet | 1 | 6048 | 75.0 % |
| skadeforebyggande | 0 | 6048 | 100.0 % |
| lek | 1 | 6048 | 75.0 % |
| fasta-situationer | 1 | 4320 | 67.5 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 1728 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 2.9 % |
| dribbling | 0 | 6048 | 2.9 % |
| passning-mottagning | 3 | 6048 | 2.9 % |
| avslut | 5 | 6048 | 2.9 % |
| ett-mot-ett | 1 | 6048 | 2.9 % |
| spelbarhet | 5 | 6048 | 2.9 % |
| speluppbyggnad | 1 | 6048 | 2.9 % |
| forsvarsspel | 3 | 6048 | 2.9 % |
| omstallning | 4 | 6048 | 2.9 % |
| malvaktsspel | 1 | 6048 | 2.9 % |
| koordination | 0 | 6048 | 2.9 % |
| snabbhet | 0 | 6048 | 2.9 % |
| skadeforebyggande | 0 | 6048 | 2.9 % |
| lek | 0 | 6048 | 2.9 % |
| fasta-situationer | 1 | 4320 | 4.0 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 1728 | 10.1 % |

#### 9mot9

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 5 | 8640 | 2.8 % |
| dribbling | 2 | 8640 | 2.8 % |
| passning-mottagning | 2 | 8640 | 2.8 % |
| avslut | 0 | 8640 | 2.8 % |
| ett-mot-ett | 0 | 8640 | 2.8 % |
| spelbarhet | 2 | 8640 | 2.8 % |
| speluppbyggnad | 0 | 8640 | 2.8 % |
| forsvarsspel | 0 | 8640 | 2.8 % |
| omstallning | 0 | 8640 | 2.8 % |
| fasta-situationer | 0 | 8640 | 2.8 % |
| malvaktsspel | 0 | 8640 | 2.8 % |
| koordination | 6 | 8640 | 2.8 % |
| snabbhet | 1 | 8640 | 2.8 % |
| skadeforebyggande | 2 | 8640 | 2.8 % |
| lek | 2 | 8640 | 2.8 % |
| nickspel | 0 | 0 | – |
| uthallighet | 0 | 6048 | 4.0 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 3 | 6624 | 49.3 % |
| dribbling | 8 | 6624 | 0.7 % |
| passning-mottagning | 11 | 6624 | 0.0 % |
| avslut | 6 | 6624 | 0.0 % |
| ett-mot-ett | 5 | 6624 | 12.5 % |
| spelbarhet | 7 | 6624 | 0.0 % |
| speluppbyggnad | 2 | 6624 | 32.9 % |
| forsvarsspel | 5 | 6624 | 19.2 % |
| omstallning | 3 | 6624 | 20.7 % |
| fasta-situationer | 2 | 6624 | 25.1 % |
| malvaktsspel | 3 | 6624 | 19.6 % |
| koordination | 2 | 6624 | 17.4 % |
| snabbhet | 1 | 6624 | 46.7 % |
| skadeforebyggande | 0 | 6624 | 100.0 % |
| lek | 0 | 6624 | 100.0 % |
| nickspel | 1 | 0 | – |
| uthallighet | 1 | 4032 | 28.6 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 8640 | 100.0 % |
| dribbling | 3 | 8640 | 27.1 % |
| passning-mottagning | 5 | 8640 | 16.6 % |
| avslut | 9 | 8640 | 8.3 % |
| ett-mot-ett | 5 | 8640 | 9.8 % |
| spelbarhet | 12 | 8640 | 4.9 % |
| speluppbyggnad | 7 | 8640 | 14.4 % |
| forsvarsspel | 8 | 8640 | 14.4 % |
| omstallning | 10 | 8640 | 8.1 % |
| fasta-situationer | 3 | 8640 | 43.1 % |
| malvaktsspel | 2 | 8640 | 45.6 % |
| koordination | 0 | 8640 | 100.0 % |
| snabbhet | 1 | 8640 | 53.3 % |
| skadeforebyggande | 0 | 8640 | 100.0 % |
| lek | 0 | 8640 | 100.0 % |
| nickspel | 2 | 0 | – |
| uthallighet | 1 | 6048 | 33.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 8640 | 2.2 % |
| dribbling | 0 | 8640 | 2.2 % |
| passning-mottagning | 2 | 8640 | 2.2 % |
| avslut | 4 | 8640 | 2.2 % |
| ett-mot-ett | 0 | 8640 | 2.2 % |
| spelbarhet | 6 | 8640 | 2.2 % |
| speluppbyggnad | 2 | 8640 | 2.2 % |
| forsvarsspel | 5 | 8640 | 2.2 % |
| omstallning | 5 | 8640 | 2.2 % |
| fasta-situationer | 2 | 8640 | 2.2 % |
| malvaktsspel | 0 | 8640 | 2.2 % |
| koordination | 0 | 8640 | 2.2 % |
| snabbhet | 0 | 8640 | 2.2 % |
| skadeforebyggande | 0 | 8640 | 2.2 % |
| lek | 0 | 8640 | 2.2 % |
| nickspel | 0 | 0 | – |
| uthallighet | 1 | 6048 | 3.1 % |

#### 11mot11

**del-uppvarmning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 1 | 6048 | 4.0 % |
| dribbling | 0 | 6048 | 4.0 % |
| passning-mottagning | 2 | 6048 | 4.0 % |
| avslut | 0 | 6048 | 4.0 % |
| nickspel | 0 | 0 | – |
| ett-mot-ett | 0 | 6048 | 4.0 % |
| spelbarhet | 2 | 6048 | 4.0 % |
| speluppbyggnad | 0 | 6048 | 4.0 % |
| forsvarsspel | 0 | 6048 | 4.0 % |
| omstallning | 0 | 6048 | 4.0 % |
| fasta-situationer | 0 | 6048 | 4.0 % |
| malvaktsspel | 0 | 6048 | 4.0 % |
| koordination | 2 | 6048 | 4.0 % |
| snabbhet | 0 | 6048 | 4.0 % |
| uthallighet | 0 | 6048 | 4.0 % |
| skadeforebyggande | 1 | 6048 | 4.0 % |
| lek | 0 | 6048 | 4.0 % |

**del-ovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 1 | 4032 | 81.0 % |
| dribbling | 3 | 4032 | 1.2 % |
| passning-mottagning | 6 | 4032 | 0.0 % |
| avslut | 3 | 4032 | 0.0 % |
| nickspel | 1 | 0 | – |
| ett-mot-ett | 2 | 4032 | 12.5 % |
| spelbarhet | 3 | 4032 | 0.0 % |
| speluppbyggnad | 1 | 4032 | 21.9 % |
| forsvarsspel | 2 | 4032 | 28.9 % |
| omstallning | 1 | 4032 | 31.3 % |
| fasta-situationer | 1 | 4032 | 31.3 % |
| malvaktsspel | 2 | 4032 | 0.0 % |
| koordination | 1 | 4032 | 28.6 % |
| snabbhet | 1 | 4032 | 12.5 % |
| uthallighet | 1 | 4032 | 28.6 % |
| skadeforebyggande | 0 | 4032 | 100.0 % |
| lek | 0 | 4032 | 100.0 % |

**del-spelovning**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 100.0 % |
| dribbling | 1 | 6048 | 33.3 % |
| passning-mottagning | 2 | 6048 | 21.9 % |
| avslut | 4 | 6048 | 11.7 % |
| nickspel | 1 | 0 | – |
| ett-mot-ett | 2 | 6048 | 13.2 % |
| spelbarhet | 5 | 6048 | 6.3 % |
| speluppbyggnad | 4 | 6048 | 18.8 % |
| forsvarsspel | 5 | 6048 | 18.8 % |
| omstallning | 7 | 6048 | 9.8 % |
| fasta-situationer | 2 | 6048 | 18.8 % |
| malvaktsspel | 1 | 6048 | 25.0 % |
| koordination | 0 | 6048 | 100.0 % |
| snabbhet | 1 | 6048 | 33.3 % |
| uthallighet | 1 | 6048 | 33.0 % |
| skadeforebyggande | 0 | 6048 | 100.0 % |
| lek | 0 | 6048 | 100.0 % |

**del-spel**

| Fokusområde | Godkända övningar som passar | Körfall | Kan inte fyllas för sig |
|---|---|---|---|
| bollkansla | 0 | 6048 | 3.1 % |
| dribbling | 0 | 6048 | 3.1 % |
| passning-mottagning | 1 | 6048 | 3.1 % |
| avslut | 2 | 6048 | 3.1 % |
| nickspel | 0 | 0 | – |
| ett-mot-ett | 0 | 6048 | 3.1 % |
| spelbarhet | 5 | 6048 | 3.1 % |
| speluppbyggnad | 3 | 6048 | 3.1 % |
| forsvarsspel | 5 | 6048 | 3.1 % |
| omstallning | 4 | 6048 | 3.1 % |
| fasta-situationer | 2 | 6048 | 3.1 % |
| malvaktsspel | 0 | 6048 | 3.1 % |
| koordination | 0 | 6048 | 3.1 % |
| snabbhet | 0 | 6048 | 3.1 % |
| uthallighet | 1 | 6048 | 3.1 % |
| skadeforebyggande | 0 | 6048 | 3.1 % |
| lek | 0 | 6048 | 3.1 % |
