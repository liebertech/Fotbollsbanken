Status: ändrad vid K3 (2026-09-14), två tillägg 2026-09-23, preciserade 2026-09-24

# Passuppbyggnad

**Ägare:** fotbollsexpert

*Ändring 2026-09-24. Två preciseringar av kriterierna i avsnittet "Yta per spelare". Inga siffror är ändrade, inget kriterium är tillagt och inget är borttaget:*

1. ***Golvet räknas på `spelare.max`, taket på `spelare.min`.** Punkt 2 i "Så räknas talet fram" sa tidigare `spelare.max` för båda. Det är rätt ände för golvet och fel ände för taket, eftersom ytan är fast medan antalet spelare är ett spann.*
2. ***Undantag 1 och 3 är styrande, inte valfria.** Är övningen av den typ undantaget beskriver gäller undantagets eget mått i stället för golvet. Golvet får alltså inte användas för att motivera en större yta än undantaget medger.*

*Båda preciseringarna kommer ur granskningen av omgång 4, där de gav fel i var sin riktning: ett matchspel i 9 mot 9 slapp undan taket vid sitt glesaste läge, och ett tre mot ett hade blåsts upp till golvet fast undantaget gällde. Användaren godkände dem 2026-09-24. De är fortfarande **granskningskriterier**, inte generatorregler, och ingen ny regel har lagts till i `generatorregler.md`.*

*Ändring 2026-09-23. Två tillägg i det nya avsnittet "Yta per spelare", som ligger efter "Tillgänglig yta":*

1. *Ett **golv** för hur liten yta per spelare en övning får ha i varje åldersfas, skilt för övningar med och utan motståndare, med matchens värden som referens och fyra uppräknade undantag.*
2. *Ett **minsta längdmått** för övningar i `fas-13-14` och `fas-15-19` som ska öva spel bakom en försvarslinje eller uppbyggnad genom lagdelar: minst 35 respektive 40 meter. Längdmåttet behövs därför att ett kvadratmetertal inte kan uttrycka djupled, och djupled är en del av skälet till att golvet för `fas-13-14` är satt så högt som det är.*

*Båda tilläggen är **granskningskriterier** som övningsförfattaren och jag använder innan en övning lämnas in och granskas. De är **inte generatorregler**, och ingen ny regel har lagts till i `generatorregler.md`. Användaren godkände båda tilläggen 2026-09-23. Inga siffror och inga andra principer i filen är ändrade.*

*Ändring 2026-09-14:* två tillägg om att taket per ledare inte gäller i delen Spel, i avsnitten *Hur spelarna delas i grupper* och *Hur många spelare en ledare kan ha*. Tilläggen speglar den nya regeln R-057 i `generatorregler.md`, godkänd av användaren 2026-09-14. Inga siffror och inga andra principer i filen är ändrade.

Den här filen beskriver hur ett träningspass byggs upp: vilka delar passet har, hur lång tid varje del får i olika åldrar, hur vila och vätska läggs in, hur antalet ledare påverkar upplägget och hur spelarna delas i grupper. Den är underlag för generatorn (berättelse 02–04) och för reglerna i `generatorregler.md`. Där det står ett regel-ID, till exempel R-040, är det regeln i `generatorregler.md` som gäller exakt.

Filen använder samma nycklar som de andra domänfilerna: spelformer (`3mot3` … `11mot11`) från `spelformer.md`, åldersfaser (`fas-6-7` … `fas-15-19`) från `aldrar-och-fokus.md`, nivåer (`niva-1` … `niva-3`) från `nivaer.md` och fokusområden från `fokusomraden.md`.

## Källäge

- Grundprinciperna (spelet lär ut spelet, många bollkontakter, alla får vara med, lek för de yngsta) kommer från SvFF:s riktlinjer *Fotbollens spela, lek och lär* och spelarutbildningsplanen. Se källorna i `aldrar-och-fokus.md`.
- SvFF rekommenderar skadeförebyggande program som en del av uppvärmningen. *FIFA 11+ Kids* är avsett för 7–14 år och FIFA 11+ för äldre. Båda ska användas minst två gånger i veckan för att ge effekt. *Knäkontroll* anges ta 10–15 minuter i uppvärmningen, två gånger i veckan. Källa: SvFF, Skadeförebyggande program, https://aktiva.svenskfotboll.se/spelare/halsa/skadeforebyggande-program/ (hämtad 2026-09-11).
- Allt annat i filen, alltså delarna, tidsandelarna, pausintervallen, gränserna för spelare per ledare och stationsreglerna, är **min bedömning som tränarutbildare**. SvFF anger så vitt jag vet inga sådana siffror. Siffrorna bygger på riktvärdena i `aldrar-och-fokus.md` och är valda så att en ideell ledare kan genomföra passet på en vanlig plan.

## Passets delar

Ett pass har fem delar i fast ordning. Nyckeln används i övningarnas nya fält `passdelar` (se nedan) och i generatorn.

| Ordning | Nyckel | Namn för ledaren | Fylls från banken | Vad som händer |
|---|---|---|---|---|
| 1 | `del-uppvarmning` | Uppvärmning | Ja | Kroppen och huvudet kommer igång. Lek, bollkänsla, rörelse och från 8 år skadeförebyggande moment. Alla är aktiva direkt, nästan ingen genomgång. |
| 2 | `del-ovning` | Öva | Ja | Dagens fokus övas med många upprepningar. Ingen eller begränsad motståndare, så att spelarna hinner lyckas. |
| 3 | `del-spelovning` | Spelövning | Ja | Samma fokus används i spel med motståndare, riktning och mål. Reglerna i spelet gör att fokuset händer ofta. |
| 4 | `del-spel` | Spel | Ja | Spel med två lag och mål, i dagens spelform eller mindre. Friare, med mycket speltid för alla. |
| 5 | `del-avslutning` | Avslutning | Nej, fast inslag | Lugn nedvarvning och samling: vad tränade vi på, vad gick bra. Kort och positivt. |

Tanken bakom ordningen är enkel: **värm upp, öva, använd det i spel och spela.** Delarna 2 och 3 är passets kärna och bär dagens fokusområde. Delarna 1 och 4 ska helst också träffa fokus, men får ha annat innehåll (R-044 till R-047).

### Övningens fält `passdelar`

En övning märks med en eller flera av de fyra delarna som fylls från banken, till exempel `[del-uppvarmning, del-spel]` för en lek som fungerar både i början och i slutet. `del-avslutning` används inte som märkning, eftersom avslutningen är ett fast inslag.

Riktlinjer till övningsförfattaren:

- `del-uppvarmning`: kommer igång snabbt, låg till medelhög intensitet i början, alla aktiva. Lekar, bollkänsla, rörelse, passningslekar, skadeförebyggande program.
- `del-ovning`: tydligt fokus, många upprepningar, ingen eller passiv motståndare, eller ett överläge som gör att spelarna lyckas (till exempel 2 mot 1).
- `del-spelovning`: motståndare, riktning och mål. Regler som gör att fokuset händer ofta (till exempel poäng för en passning till en kantspelare).
- `del-spel`: två lag, mål och riktning. Övningen ska ha grupptypen `tva-lag` (se nedan och R-008).

Fältet saknas i dag i fältlistan i `content/ovningar/README.md`. Innehållet regleras av R-005, och fältnamnet bestäms vid K2.

## Passlängd

- **Kortaste pass:** 30 minuter för alla åldrar (R-018). Kortare än så hinner passet inte både värma upp och spela.
- **Längsta pass:** beror på åldern, eftersom koncentration och ork är mindre hos de yngsta (R-018).

| Fas | Kortast | Längst |
|---|---|---|
| `fas-6-7` | 30 min | 60 min |
| `fas-8-9` | 30 min | 75 min |
| `fas-10-12` | 30 min | 90 min |
| `fas-13-14` | 30 min | 90 min |
| `fas-15-19` | 30 min | 120 min |

Passlängden är ett heltal i minuter. Tabellerna nedan visar 45, 60, 75 och 90 minuter. Andra längder räknas fram med samma regler (R-030 till R-034).

## Så räknas tiden fram

Tiden fördelas i fyra steg. Stegen är skrivna så att samma passlängd alltid ger samma tidsplan.

1. **Avslutningen** får en fast tid: 3 minuter för `fas-6-7` och `fas-8-9`. För äldre 3 minuter om passet är kortare än 60 minuter, annars 5 minuter.
2. **Vattenpauserna** är 2 minuter var. Antalet beror på hur ofta åldern behöver en paus (pausintervallet):

   | Fas | Pausintervall |
   |---|---|
   | `fas-6-7` | 15 min |
   | `fas-8-9` | 15 min |
   | `fas-10-12` | 20 min |
   | `fas-13-14` | 20 min |
   | `fas-15-19` | 25 min |

   Antal pauser = passlängden delad med pausintervallet, avrundat uppåt, minus 1. Exempel: 60 minuter för 8–9 år ger 60 / 15 = 4, minus 1 = 3 pauser. Pausen räcker också till att byta övning och flytta sig till nästa yta.
3. **Den aktiva tiden** är det som blir kvar: passlängd minus avslutning minus vattenpauser.
4. **Den aktiva tiden fördelas** på de fyra delarna med andelarna nedan. Uppvärmning, Öva och Spelövning avrundas nedåt till hela minuter. Spel får resten. Det gör att avrundningen alltid gynnar spelet.

| Fas | `del-uppvarmning` | `del-ovning` | `del-spelovning` | `del-spel` |
|---|---|---|---|---|
| `fas-6-7` | 25 % | 25 % | 15 % | 35 % |
| `fas-8-9` | 20 % | 25 % | 20 % | 35 % |
| `fas-10-12` | 20 % | 20 % | 25 % | 35 % |
| `fas-13-14` | 25 % | 15 % | 25 % | 35 % |
| `fas-15-19` | 25 % | 15 % | 25 % | 35 % |

Varför andelarna ser ut så (min bedömning):

- **Spel är alltid den största delen**, eftersom spelet lär ut spelet. Spelövning och spel tillsammans är 50–60 procent av den aktiva tiden.
- **De yngsta har mer tid för att öva** med egen boll och mer uppvärmning med lek.
- **Från 13 år är uppvärmningen längre** så att det skadeförebyggande programmet ryms (SvFF anger 10–15 minuter för Knäkontroll).
- **Övning utan motståndare minskar med åldern** till förmån för spelövning.

Om Öva eller Spelövning får mindre än 5 minuter tas delen bort, och minuterna läggs på Spel (R-033). Det händer bara i korta pass, till exempel 30 minuter för 13–19 år.

### Tidsplaner per fas

Alla tider i minuter. "Vatten" är alla vattenpauser tillsammans.

**`fas-6-7`** (längst 60 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 9 | 9 | 5 | 15 | 4 (2 st) | 3 | 45 |
| 60 | 12 | 12 | 7 | 20 | 6 (3 st) | 3 | 60 |

**`fas-8-9`** (längst 75 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 7 | 9 | 7 | 15 | 4 (2 st) | 3 | 45 |
| 60 | 10 | 12 | 10 | 19 | 6 (3 st) | 3 | 60 |
| 75 | 12 | 16 | 12 | 24 | 8 (4 st) | 3 | 75 |

**`fas-10-12`** (längst 90 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 7 | 7 | 9 | 15 | 4 (2 st) | 3 | 45 |
| 60 | 10 | 10 | 12 | 19 | 4 (2 st) | 5 | 60 |
| 75 | 12 | 12 | 16 | 24 | 6 (3 st) | 5 | 75 |
| 90 | 15 | 15 | 19 | 28 | 8 (4 st) | 5 | 90 |

**`fas-13-14`** (längst 90 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 9 | 5 | 9 | 15 | 4 (2 st) | 3 | 45 |
| 60 | 12 | 7 | 12 | 20 | 4 (2 st) | 5 | 60 |
| 75 | 16 | 9 | 16 | 23 | 6 (3 st) | 5 | 75 |
| 90 | 19 | 11 | 19 | 28 | 8 (4 st) | 5 | 90 |

**`fas-15-19`** (längst 120 minuter)

| Passlängd | Uppvärmning | Öva | Spelövning | Spel | Vatten | Avslutning | Summa |
|---|---|---|---|---|---|---|---|
| 45 | 10 | 6 | 10 | 14 | 2 (1 st) | 3 | 45 |
| 60 | 12 | 7 | 12 | 20 | 4 (2 st) | 5 | 60 |
| 75 | 16 | 9 | 16 | 25 | 4 (2 st) | 5 | 75 |
| 90 | 19 | 11 | 19 | 30 | 6 (3 st) | 5 | 90 |

Tiderna i tabellerna är **måltider**. Generatorn får avvika lite när den fyller delarna med övningar, se nästa avsnitt.

## Hur mycket passet får avvika från den begärda längden

Övningar har en tid som bara kan ändras inom vissa gränser, så delarna blir sällan exakt lika långa som måltiden. Det här är acceptabelt (berättelse 02, kriterium 8):

- **Hela passet:** högst 5 minuter kortare än den begärda längden och aldrig längre (R-036). Ett pass som blir några minuter kortare går alltid att använda, eftersom det nästan alltid tar lite extra tid att samla gruppen. Ett pass som drar över tiden kan krocka med nästa lag på planen.
- **Varje del:** högst 3 minuter från måltiden, uppåt eller nedåt (R-035).
- **Vattenpauser och avslutning** får aldrig kortas för att få tiden att gå ihop (R-031).
- **Om en del saknar övning** gäller inte gränsen för hela passet. De delar som har övningar ska fortfarande ligga inom 3 minuter från sin måltid. Passet visar den faktiska tiden och vad som saknas (R-039, R-100).

## Hur lång tid en övning får ta

En övning ska inte hålla på längre än gruppen orkar koncentrera sig på samma sak. Gränserna följer riktvärdena i `aldrar-och-fokus.md` (R-034).

| Fas | Kortast, alla delar | Längst i Uppvärmning, Öva och Spelövning | Längst i Spel |
|---|---|---|---|
| `fas-6-7` | 5 min | 8 min | 20 min |
| `fas-8-9` | 5 min | 10 min | 25 min |
| `fas-10-12` | 5 min | 15 min | 30 min |
| `fas-13-14` | 5 min | 20 min | 35 min |
| `fas-15-19` | 5 min | 25 min | 45 min |

Spel får vara längre än övningar, eftersom barn orkar spela länge när spelet byter motståndare eller spelas i korta perioder med paus emellan. En del kan innehålla en eller två övningar (R-038). Om en del är längre än den längsta tiden för en övning blir det två övningar.

**Tid i övningen:** i dag har en övning en rekommenderad tid. Generatorn behöver också veta hur kort och hur lång övningen kan göras, till exempel "10 minuter, går att köra 6–15". Därför har `tid` tre värden: kortast, rekommenderad och längst (R-009). Om en övning bara har ett värde gäller det som både kortast och längst. Fältnamnen bestäms vid K2.

## Vila och vätska

Barn blir varma och uttorkade fortare än vuxna. Därför är vattenpauserna ett fast inslag i varje pass, inte något som ledaren förväntas komma ihåg själv.

- **Pauserna räknas in i passets tid** och tas aldrig bort av generatorn (R-031).
- **Pausen läggs mellan två övningar** eller, i Spel, mellan två perioder av spelet. Aldrig mitt i en övning i de andra delarna, och normalt inte direkt före avslutningen. Om Spel saknar övning kan pauserna behöva ligga tätare, se undantaget i R-037.
- **Pauserna sprids ut** så att den längsta tiden utan paus blir så kort som möjligt (R-037).
- **Varje spelare har egen vattenflaska.** Det är ett råd till ledaren som appen kan visa. Det är inte en regel för generatorn.
- **Vid värme** bör ledaren lägga in fler pauser och sänka intensiteten. Appen vet inte hur vädret är, så det är ledarens bedömning. Samma sak gäller vid kyla, där korta genomgångar och snabb start är viktigast.
- **Vila inom övningen:** för de yngsta sker vilan naturligt, eftersom de springer i korta ryck. I intensiva spel för 13–19 år, till exempel spel för `uthallighet`, ska övningen själv beskriva arbete och vila (till exempel 3 minuter spel, 1 minut vila). Det kontrollerar jag när jag granskar övningen.

## Hur spelarna delas i grupper

Varje övning anger hur många spelare **en grupp** kan ha: minst och högst (fältet `spelare`). En grupp är de spelare som gör övningen tillsammans på en yta med en uppsättning material. Om det finns fler spelare än en grupp rymmer, körs övningen i flera grupper samtidigt, sida vid sida (R-051).

### Grupptyper

För att generatorn ska kunna dela gruppen och hantera udda antal behöver varje övning en grupptyp. Fältet saknas i dag i `content/ovningar/README.md`. Innehållet regleras av R-008, och fältnamnet bestäms vid K2.

| Nyckel | Betyder | Exempel | Udda antal |
|---|---|---|---|
| `fri` | Alla i samma yta, antalet behöver inte gå jämnt ut | Bollkänsla med egen boll, kull med boll | Inga problem |
| `par` | Spelarna jobbar två och två | Passningar i par | En grupp blir tre och passar i triangel |
| `tva-lag` | Två lag mot varandra | 3 mot 3, 4 mot 4 med jokrar | Passet visar att en spelare blir joker och alltid är med laget som har bollen, om inte övningens `anpassning` beskriver en annan lösning (R-054). *Min bedömning:* för 6–9 år kan ledaren på plats lika gärna låta ena laget ha en spelare mer |
| `fast-storlek` | Grupper med ett bestämt antal | Tre spelare där en anfaller mot två försvarare som roterar | Bara om övningen själv beskriver en lösning, till exempel att en spelare vilar och byter in |

Så gör generatorn (R-050 till R-057):

1. **Så få grupper som möjligt.** Generatorn väljer det minsta antal grupper där ingen grupp blir större än övningens största grupp. Det är oftast övningens högsta antal, men i en ledarstyrd övning får en grupp inte heller vara större än taket per ledare (se nedan), och en övning med fast storlek och en lösning för udda antal får ha grupper som är en spelare större (R-050). I delen Spel gäller inte taket per ledare: där spelas hela gruppen i ett spel så länge övningen rymmer den (R-057).
2. **Jämnt fördelat.** Grupperna skiljer sig med högst en spelare.
3. **Ingen grupp för liten.** Om någon grupp blir mindre än övningens minsta antal kan övningen inte användas med det antalet spelare.
4. **Udda antal** hanteras enligt tabellen ovan. Bara övningar med grupptypen `fast-storlek` kan väljas bort på grund av udda antal (berättelse 02, kriterium 7).
5. **För få spelare:** om det totala antalet spelare är mindre än övningens minsta antal väljs övningen inte (berättelse 02, kriterium 5).

*Min bedömning:* ledaren kan ofta vara med och spela för att få jämnt, men generatorn räknar aldrig med det. Ledaren ska kunna leda och se alla.

## Hur antalet ledare påverkar passet

### Två sätt att köra en del

En del i passet består av ett eller två **moment**. Ett moment körs på ett av två sätt:

- **Hela gruppen gör samma övning**, i en eller flera grupper sida vid sida. Det är det vanliga sättet.
- **Stationer**: spelarna delas i grupper som gör olika övningar samtidigt och byter station efter en bestämd tid. Alla grupper går igenom alla stationer.

### Självgående eller ledarstyrd

Varje övning anger hur många ledare **varje grupp** behöver (R-006). Jag föreslår att fältet `ledare` i övningen tolkas så här:

- **0, självgående:** spelarna kan köra övningen själva när den väl är igång, till exempel ett smålagsspel. En ledare kan ha uppsikt över flera sådana grupper som ligger bredvid varandra.
- **1, ledarstyrd:** en ledare måste vara med hela tiden, till exempel för att passa in bollar, skjuta på en målvakt eller hålla ordning på en övning där det annars blir farligt eller kö.
- **2:** används sällan, till exempel när två ledare servar bollar från var sin sida.

En station kräver alltid minst en egen ledare. Det följer av berättelse 02, kriterium 4: det får aldrig finnas fler stationer än ledare.

### Hur många spelare en ledare kan ha

Det här är det högsta antal spelare som en ledare rimligen kan ha hand om i en ledarstyrd grupp eller en station, och samtidigt se till att alla är aktiva och säkra (min bedömning):

| Fas | Högst antal spelare per ledare |
|---|---|
| `fas-6-7` | 8 |
| `fas-8-9` | 10 |
| `fas-10-12` | 12 |
| `fas-13-14` | 14 |
| `fas-15-19` | 16 |

Samma tal används när det är många spelare per ledare i hela passet (R-021, beslutad av användaren 2026-09-11). Passet genereras ändå, men ledaren får ett tips om att be en förälder eller äldre spelare om hjälp.

Taket gäller inte i delen Spel (R-057). Ett spel med två lag, mål och riktning driver sig självt, och ledaren dömer och coachar från sidan. Att dela ett 7 mot 7 i två mindre spel bara för att gruppen är större än taket skulle göra passets största del sämre, inte säkrare. Påminnelsen om förankrade mål gäller förstås fortfarande (R-084).

### Vad antalet ledare gör möjligt

| Antal ledare | Vad passet kan innehålla |
|---|---|
| 1 | Hela gruppen gör samma övning. Flera grupper samtidigt går bara om övningen är självgående, eller om det bara blir en grupp. Inga stationer (berättelse 02, kriterium 3). |
| 2 | Som ovan, men två ledarstyrda grupper samtidigt är möjligt. Upp till 2 stationer i Öva och Spelövning. |
| 3 | Upp till 3 stationer. |
| 4 eller fler | Upp till 4 stationer. Fler än 4 stationer används inte, eftersom det tar för lång tid att ställa i ordning och rotera. Extra ledare kan i stället vara med i en station eller ta hand om målvakterna. |

Regler för stationer (R-060 till R-066):

- **Bara i Öva och Spelövning.** Uppvärmningen görs tillsammans för att samla gruppen. Spelet görs lag mot lag.
- **Alla grupper går igenom alla stationer**, så att alla spelare får samma innehåll.
- **Lika lång tid på varje station**, minst 5 minuter och högst den längsta tiden för en övning i fasen. Bytet mellan stationer tar 1 minut.
- **Stationerna får plats i delens tid.** Två stationer kräver minst 11 minuter, tre stationer minst 17 minuter och fyra stationer minst 23 minuter. I korta pass blir det därför sällan stationer.
- **Varje station är en egen övning** som uppfyller alla krav, också kravet på fokusområde.

## Tillgänglig yta

Ledaren kan välja om passet ska göras på hel, halv eller kvarts plan, eller låta bli (beslut 2026-09-11). När ledaren har valt yta används bara moment som får plats på den, med 3 meter mellan grupper eller stationer som ligger bredvid varandra. Momenten görs efter varandra och får använda samma yta. Reglerna är R-090 till R-094. Appen tar inte hänsyn till hur mycket material klubben har, som antal bollar och koner, i version 1 (se nästa avsnitt). Inomhushall kommer i en senare version.

## Yta per spelare

*Avsnittet är tillagt 2026-09-23, godkänt av användaren samma dag. Två preciseringar 2026-09-24, godkända samma dag: taket räknas på `spelare.min` och golvet på `spelare.max`, och undantag 1 och 3 är styrande för sina övningstyper. Inga siffror är ändrade.*

### Det här är granskningskriterier, inte regler

Avsnittet innehåller **två** kriterier:

- **Golvet**, som säger hur stor en övnings yta måste vara i förhållande till antalet spelare på den. Gäller alla fem åldersfaser.
- **Minsta längd**, som säger hur lång ytan måste vara när övningen ska öva spel bakom en försvarslinje eller uppbyggnad genom lagdelar. Gäller bara `fas-13-14` och `fas-15-19`. Se sista underavsnittet.

Båda används på **ett** ställe: när en övning skrivs och när jag granskar den. Övningsförfattaren ska kunna räkna själv innan filen lämnas in, i stället för att jag räknar om samma sak i varje omgång.

**Generatorn använder inte de här talen.** Generatorn väljer aldrig bort en övning för att ytan är trång, rymlig eller kort. Den enda ytkontroll generatorn gör är R-092: att momentet får plats på den yta ledaren har valt, med 3 meters marginal mellan grupper. Ingenting i det här avsnittet ska läsas in som en ny regel: varken kvadratmetertalen, taket, längdmåtten, undantagens egna mått eller anvisningen om vilket spelarantal golvet och taket räknas på. Ingen ny regel har lagts till i `generatorregler.md`. Om något av det någon gång ska bli en regel för generatorn är det ett eget beslut av användaren och en egen ändring av regelfilen.

Bakgrunden är konkret: i tre omgångar i rad har övningar fällts för att måtten från en yngre spelform har återanvänts för en äldre. I omgång 3 föll `dribbling-mot-tidspress` med 40 kvadratmeter per spelare och `en-mot-en-till-tva-mal` med 36, båda för 10–12 år. Båda gick igenom efter att ytan gjorts större. Det är den sortens omtagning avsnittet ska ta bort.

### Referenspunkten: matchen i den egna spelformen

Det naturliga måttet på hur trångt fotboll ska vara är matchen. Talen nedan är uträknade ur planmåtten i `spelformer.md` (SvFF:s nationella spelformer och planstorleksdokumentet, hämtade 2026-09-11). Alla spelare som står på planen samtidigt räknas, alltså båda lagen och målvakterna där spelformen har målvakt.

| Spelform | Fas | Plan (m) | Spelare på planen | Yta per spelare i match (m²) |
|---|---|---|---|---|
| `3mot3` | `fas-6-7` | 15 × 10 till 15 × 12 | 6 | 25–30 |
| `5mot5` | `fas-8-9` | 30 × 15 till 30 × 20 | 10 | 45–60 |
| `7mot7` | `fas-10-12` | 50 × 30 till 55 × 35 | 14 | 107–138 |
| `9mot9` | `fas-13-14` | 65 × 50 till 72 × 55 | 18 | 181–220 |
| `11mot11` | `fas-15-19` | 100 × 60 till 110 × 68 | 22 | 273–340 |

Det viktiga i tabellen är hur stora stegen är. Matchen blir inte bara större med åldern, den blir **mycket** glesare per spelare: från 25 kvadratmeter för en sexåring till 273 för en sextonåring, alltså elva gånger mer. Ett mått som är lagom trångt i 5 mot 5 är därför extremt trångt i 9 mot 9, och det är precis det felet som har upprepats.

**Matchens trängsta värde används som tak.** En övning som ger mer yta per spelare än matchens lägsta värde i samma spelform är inte fotboll längre, utan löpning: spelarna hinner inte möta varandra, bollkontakterna blir få och avstånden blir längre än de någonsin blir i match. Undantaget är spel i matchens egen form på matchens egen plan, som ligger just på taket. Taket är ett riktvärde jag redan använder när jag granskar. Det användarbeslut som beskrivs här gäller golvet.

**Taket prövas vid övningens minsta antal spelare.** Det är där ytan är glesast, och det är den enda ände där en matchlik yta kan spricka. Det har också en följd för undantag 4: att en övning är matchens spelform på matchens egen plan är sant bara för de gruppstorlekar där den verkligen är det. Samma plan med färre spelare är inte längre matchens form, och då bär undantaget inte. Se punkt 2 i *Så räknas talet fram*.

### Golvet

Golvet är det minsta antal kvadratmeter per spelare en övning får ha. Talen är **min bedömning som tränarutbildare**. SvFF anger så vitt jag vet inga sådana tal, varken i spelformsbladen eller i *Fotbollens spela, lek och lär*. De är inte uträknade ur en formel, utan valda utifrån vad som händer i respektive ålder.

| Fas | Med motståndare | Utan motståndare | Matchens trängsta värde |
|---|---|---|---|
| `fas-6-7` | 15 m² | 8 m² | 25 m² |
| `fas-8-9` | 25 m² | 10 m² | 45 m² |
| `fas-10-12` | 45 m² | 15 m² | 107 m² |
| `fas-13-14` | 70 m² | 20 m² | 181 m² |
| `fas-15-19` | 90 m² | 25 m² | 273 m² |

Golvet ligger alltid under matchens värde, och det är meningen. Träning ska vara trängre än match, eftersom trängseln är det som ger fler dueller, fler beslut och fler bollkontakter per minut. Andelen sjunker med åldern, från ungefär 60 procent av matchen för de yngsta till ungefär en tredjedel för de äldsta, därför att den stora planen i 9 mot 9 och 11 mot 11 till stor del är löpyta och djupled som en övning inte behöver återskapa.

### Varför talen ser ut så

**`fas-6-7`, 15 kvadratmeter med motståndare.** Sexåringar spelar i en klunga. Bollen är nästan aldrig långt borta, farten är låg och en krock är mjuk. Matchen själv ger bara 25–30 kvadratmeter, alltså det trängsta av alla spelformer, så golvet måste ligga under det. 15 räcker för att ett barn ska hinna få bollen under kontroll och titta upp en gång, och det håller kvar de små rutorna som är själva poängen i den här åldern. Under 15 står barnen på varandras fötter, den som har bollen får aldrig en egen touch och de andra slutar försöka. Det är raka motsatsen till många bollkontakter och alla med.

**`fas-6-7`, 8 kvadratmeter utan motståndare.** Här är golvet relativt sett högre jämfört med duellen än i de äldre faserna. Det beror på att en sexåring med egen boll tittar ner, inte kan styra bollen dit hen tänkt och inte håller en rak linje. Två barn med varsin boll behöver mer marginal mellan sig än två äldre spelare, trots att de rör sig långsammare.

**`fas-8-9`, 25 kvadratmeter med motståndare.** Nu börjar passningen bära. I 5 mot 5 ger retreatlinjen laget tid att spela ut bollen, och det första spelförståelsesteget är att se en fri medspelare. Det kräver att det finns en fri medspelare att se: ytan måste rymma en passning på åtta till tio meter. 25 kvadratmeter per spelare gör att ett 4 mot 4 får ungefär 20 × 12 meter, vilket räcker för att en passning ska vara ett alternativ till att dribbla. Under det blir varje övning en närkamp, oavsett vad den heter.

**`fas-10-12`, 45 kvadratmeter med motståndare.** Det här är åldern då tekniken ska in i hög fart: driva förbi, vända bort från press, ta emot bollen bort från motståndaren. En elvaåring kan springa med bollen, och en duell där anfallaren inte hinner accelerera är ingen duell utan en brottningsmatch mot en kon. 45 ger ett par i ett ett mot ett ungefär 12 × 8 meter, vilket är precis så mycket att en finta-och-gå faktiskt går att genomföra. Det är samtidigt mindre än hälften av matchens 107, så trängseln finns kvar.

**`fas-13-14`, 70 kvadratmeter med motståndare.** Det här är fasen som öppnar i omgång 4 och som det inte finns någon erfarenhet av i banken än. Tre saker gör att golvet måste höjas rejält här:

- **Kroppen har vuxit ifrån kontrollen.** I tillväxtspurten blir armar och ben längre, vikten ökar och farten ökar, men balansen och bromsförmågan hänger inte med lika fort. Krockenergin i en närkamp är högre än i någon tidigare ålder, medan förmågan att undvika krocken är tillfälligt sämre. En trång yta är farligare här än både före och efter.
- **Touchen bär längre.** En fjortonåring som tar emot bollen med rätt teknik flyttar den fem till tio meter. Det avståndet måste finnas framför spelaren, annars är den tekniskt riktiga mottagningen fel i övningen och spelarna lär sig att stoppa bollen död i stället.
- **Offside och djupled kommer in.** Från 9 mot 9 gäller offside och inspark (`spelformer.md`). Spelet handlar nu om att spela bakom en försvarslinje och om att försvara ett djup. En övning med motståndare behöver ha ett djup att spela i, annars övar den något annat än det spelformen frågar efter.

70 kvadratmeter ger ett 4 mot 4 ungefär 30 × 20 meter och ett ett mot ett ungefär 16 × 10 meter. Det är fortfarande bara drygt en tredjedel av matchens 181, alltså tydligt trängre än match, men långt ifrån de mått som fungerar i 7 mot 7.

**`fas-15-19`, 90 kvadratmeter med motståndare.** Kroppen är färdigvuxen, toppfarten är den högsta som kommer att nås och tacklingar är hårda och tillåtna. Det som kräver yta är inte längre tekniken utan farten: bromssträckan efter en spurt, utrymmet att ta emot bollen med ryggen mot mål och vända, och avståndet mellan kedjorna. Steget från 70 till 90 är mindre än steget från 45 till 70, eftersom det stora hoppet i kroppsstorlek och löpfart sker mellan tolv och fjorton år, inte mellan fjorton och sjutton.

**Golven utan motståndare, 8 till 25 kvadratmeter.** En teknikbana med egen boll och en duell på samma yta är inte samma sak. Utan motståndare behöver ingen ta sig loss från press, och ingen ska ta sig förbi någon. Det enda ytan behöver klara är att spelaren kan driva, vända och stanna bollen utan att krocka med en annan spelare som tittar ner på sin egen boll. Därför ligger golven där på ungefär en tredjedel av duellgolvet i de äldre faserna. Talen stiger ändå med åldern, av samma skäl som duellgolvet: en sjuttonåring som driver bollen i hög fart behöver längre bromssträcka än en nioåring.

### Så räknas talet fram

1. **Ytan** är övningens `yta` för **en grupp**, längd gånger bredd. Om övningen anger olika ytor för olika spelformer räknas varje spelform för sig.
2. **Antalet spelare beror på vilket tal som prövas.** Golvet räknas på övningens `spelare.max`, alltså det trängsta läget. Taket räknas på `spelare.min`, alltså det glesaste. En övning med ett brett spann ska hålla i båda ändar, och ändarna är olika tal. Har övningen samma minsta och högsta antal räcker förstås ett tal.
3. **Målvakt och joker räknas med**, eftersom de står på ytan.
4. **En kö utanför den markerade ytan räknas inte.** Om övningen har rotation och de som väntar står utanför konerna räknas bara de som är inne. Då ska `organisation` säga tydligt att kön står utanför ytan, och kötiden bedöms som vanligt under punkten om aktivitet.
5. **Dela ytan med antalet spelare** och jämför: talet vid `spelare.max` mot golvet för fasen, talet vid `spelare.min` mot taket. Avrunda aldrig uppåt.

*Exempel:* 24 × 16 meter för en övning där minsta och högsta antal båda är 6 är 384 / 6 = 64 kvadratmeter per spelare. För `fas-10-12` med motståndare är golvet 45 och taket 107. Övningen ligger inom spannet.

**Varför båda ändarna behövs.** Ytan är fast medan antalet spelare är ett spann, så ett enda tal kan aldrig beskriva båda ytterlägena. `matchspel-9mot9-brett` i omgång 4 är exemplet. 65 × 50 meter vid övningens högsta antal, arton spelare, är 180,6 kvadratmeter per spelare, alltså precis på matchens värde i 9 mot 9 och helt rätt: det är fullstort 9 mot 9 på SvFF:s minsta planmått. Samma yta vid övningens minsta antal, tio spelare, är 325 kvadratmeter per spelare, alltså mer per spelare än en sextonåring får i en 11 mot 11-match och långt över taket 181. Räknat bara på `spelare.max` syns det inte, och övningen ser då felfri ut fast den vid ena änden av sitt spann är ett fyra mot fyra på en hel 9 mot 9-plan.

### Med eller utan motståndare, och övningar med båda

- **Med motståndare** betyder att någon på ytan kan vinna bollen eller ska passeras. Det gäller även när försvararen är halvaktiv eller styrd, och även i överlägeslägen som 2 mot 1 och 3 mot 1. Om en spelare ska ta sig förbi någon behöver hen yta att ta sig förbi i.
- **Utan motståndare** är teknikbanor, bollkänsla med egen boll, passningsövningar utan press och löp- och rörelseövningar. **En målvakt gör inte övningen till en övning med motståndare.** I en avslutsövning mot målvakt är det ingen som tar bollen från anfallaren i en närkamp, så det lägre golvet gäller. Säkerheten kring målvakten hanteras separat, genom skottavstånd och köns placering.
- **Övningar med båda delarna** bedöms så här: om något moment i övningen har motståndare på ytan gäller motståndargolvet för den ytan. Om övningen uttryckligen byter yta mellan delarna, till exempel att teknikdelen körs i en mindre ruta och duellen i en större, bedöms varje del för sig mot den yta den använder. Då ska båda måtten stå i `organisation`.

### Undantag

Det finns övningar där trängsel är själva poängen. Listan nedan är **sluten**. En övning som ligger under golvet och inte finns på listan är fel, inte en bedömningsfråga. Ett undantag gäller bara om övningens egen text i `beskrivning`, `organisation` eller `anpassning` gör det tydligt att det är den sortens övning. Ett undantag som inte syns i texten räknas inte.

**Undantag 1 och 3 är styrande, inte valfria.** Ett undantag är ingen lättnad som övningsförfattaren kan tacka nej till. Är övningen av den typ undantaget beskriver, så är undantagets eget mått det som gäller, och golvet gäller inte för den övningen. Det betyder också att **golvet inte får användas för att motivera en större yta**. En övning som har vuxit långt över undantagets mått bara för att nå golvet är fel på samma sätt som en övning som ligger under golvet utan undantag, och jag sätter `atgarda` med samma självklarhet.

*Varför den meningen behövs:* i omgång 4 var `forsvara-i-overtal` ett helt vanligt tre mot ett som hade lagts på 20 × 15 meter för att nå golvet 70 i `fas-13-14`. Följden blev att en ensam försvarare skulle täcka 300 kvadratmeter mot tre anfallare. Hen hinner då aldrig fram till den jockeyposition som övningens eget syfte beskriver, utan jagar, och pressen når aldrig bollhållaren på de par sekunder som är hela poängen med ett positionsspel. Golvet är satt för dueller och spel med riktning och säger ingenting vettigt om en rondo. Det var mitt eget tal som drog måttet dit, och därför står den här meningen nu i texten.

**Varför bara 1 och 3.** Undantag 2, lekar där alla har egen boll, har redan ett eget undre tal, 10 kvadratmeter per spelare i alla åldrar. Det biter av sig självt och det finns ingen vinst i att sprida ut sig. Undantag 4 har inget alternativt mått alls, eftersom spel i matchens egen form per definition ligger på matchens värde; där är frågan i stället om övningen verkligen är matchens form i hela sitt spelarspann, se *Matchens trängsta värde används som tak*.

1. **Positionsspel och bollhållningsspel i övertal, utan mål och utan riktning.** Till exempel 4 mot 2, 5 mot 2 eller behåll bollen med joker. Poängen är att pressen ska nå fram på ett par sekunder, så att spelaren tvingas välja passningen tidigt och med rätt fot. En stor yta förstör övningen. *I stället gäller:* ytan ska vara så stor att den som har bollen kan vända bort från press, alltså minst 10 × 10 meter för 8–12 år och minst 12 × 12 meter för 13–19 år. Undantaget gäller inte så fort det finns mål och riktning, för då ska laget kunna spela framåt. **De alternativa måtten är satta för positionsspel med upp till åtta spelare på ytan**, alltså storlekar som 4 mot 2 och 5 mot 2. För större positionsspel, till exempel 6 mot 3 och 7 mot 4, säger kriteriet ingenting: 12 × 12 meter är då en gräns som inte biter. Det talet sätts när banken har sådant innehåll att sätta det mot, och kräver ett eget beslut av användaren (öppen fråga 2026-09-23). Till dess bedömer jag stora positionsspel för hand och skriver motiveringen i `granskning`. **Måttet är både ett minsta mått och det mått som gäller i stället för golvet.** En yta som är väsentligt större än så är fel även om den klarar golvet, eftersom pressen då inte når fram.
2. **Lekar där alla har egen boll och poängen är att störa varandras boll.** Till exempel bollvaktslek. Ingen ska ta sig förbi någon, alla har boll och kontakten är låg, så trängseln ger fler bollkontakter i stället för färre. *I stället gäller:* varje spelare har egen boll, ingen tacklar eller sparkar mot ben, och ytan är minst 10 kvadratmeter per spelare i alla åldrar.
3. **Övningar där spelarna står på egna platser eller följer en bestämd bana.** Till exempel skadeförebyggande program som Knäkontroll och FIFA 11+ Kids, passningsrutor med fasta positioner och målvaktens grundteknik. Rörelsen är förutsägbar och ingen krockar med någon oväntat, så kvadratmeter per spelare säger ingenting. *I stället gäller:* minst 2 meter mellan två spelares arbetsplatser, och arbetsvägarna korsar inte varandra. **Det är ett minsta avstånd, inte ett riktvärde att bygga vidare på.** Ytan ska hållas så samlad att ledaren ser alla arbetsplatser och hinner rätta ett knäläge utan att gå långt, och att bytet mellan platser tar sekunder. Att sprida ut stationerna för att i stället nå golvet gör programmet sämre: hela poängen med ett skadeförebyggande program är att någon ser landningen varje gång, och en utspridd cirkel äter dessutom av uppvärmningens tid.
4. **Spel i matchens egen spelform på matchens egen plan.** Ligger per definition på matchens värde och är alltid rätt.

### Vad som händer när en övning inte håller måttet

- **Under golvet utan att träffas av ett undantag:** jag sätter status `atgarda` och skriver i `granskning` hur många kvadratmeter per spelare övningen har, vad golvet är och vilket mått som skulle räcka. Övningsförfattaren ökar ytan och sätter tillbaka `utkast`. Det är inte en förhandling.
- **Strax under golvet:** gäller som under golvet. Det finns ingen marginal och ingen avrundning uppåt. En övning på 44 kvadratmeter per spelare i `fas-10-12` ska göras större.
- **Under golvet men träffas av ett undantag:** övningen går vidare, och jag skriver i `granskning` vilket undantag som åberopats. Saknas motiveringen i övningens egen text sätts `atgarda` med kommentaren att texten ska säga varför ytan är trång.
- **Över undantagets mått i undantag 1 eller 3:** `atgarda`. Golvet gäller inte för den sortens övning, så det duger inte som skäl för en större yta. Jag skriver vilket mått övningen ska ha och varför den blir sämre av att växa.
- **Över taket:** räknat vid `spelare.min`. Inte automatiskt fel, men jag frågar varför. Oftast är svaret att ytan är kopierad från matchen när övningen har färre spelare än matchen, och det syns just vid minsta antal. Då sätts `atgarda`, och vägen framåt är antingen ett högre minsta antal eller en mindre yta för de mindre grupperna.
- **En godkänd övning som ligger under golvet** ändras inte i efterhand av det här avsnittet. Golvet gäller övningar som granskas från och med 2026-09-23. Om en sådan övning ändå öppnas för ändring tas ytan upp då.

### Minsta längd när övningen ska öva djupled

*Tillagt 2026-09-23, godkänt av användaren samma dag.*

Golvet mäter yta, och yta kan inte uttrycka djupled. Det är ett problem just i `fas-13-14`, eftersom en del av skälet till att golvet där är satt så högt som 70 kvadratmeter är att offside och inspark gäller från 9 mot 9 och att spelet börjar handla om att spela bakom en försvarslinje (`spelformer.md`). En övning kan klara golvet och ändå ha fel form för det den säger sig träna: 30 × 20 meter för ett 4 mot 4 ger 75 kvadratmeter per spelare och går igenom, men 30 meters längd räcker inte för att ett inspel bakom en linje ska hinna bli ett inspel. Därför finns ett eget mått för längden.

| Fas | Minsta längd |
|---|---|
| `fas-13-14` | 35 m |
| `fas-15-19` | 40 m |

**Kriteriet gäller inte `fas-6-7`, `fas-8-9` och `fas-10-12`.** Offside finns inte i 3 mot 3, 5 mot 5 och 7 mot 7, och i de spelformerna finns ingen försvarslinje att spela bakom. Att kräva längd av en övning för tioåringar vore att lägga in ett moment som spelformen inte har.

#### När kriteriet slår till

**Det är vad övningen gör enligt sin `beskrivning` som avgör, inte vad den är märkt med.** Fokusmärkningen i `fokusomraden` utlöser aldrig kriteriet på egen hand. En övning märkt `omstallning` som handlar om att kontra på tvären i en liten yta är inte en djupledsövning och ska inte tvingas bli 35 meter lång.

Frågan jag ställer vid granskning är denna: **finns det i beskrivningen ett bakre lag eller en försvarslinje som ska passeras i ytans längdriktning, och är poängen att bollen eller en spelare ska ta sig bakom den?** Är svaret ja gäller längdmåttet. Är svaret nej gäller det inte, oavsett märkning.

Kriteriet slår till på:

- inspel eller löpning bakom en försvarslinje, alltså timing mellan den som passar och den som löper,
- uppbyggnad från målvakt eller backlinje genom lagdelar fram till ett mål eller en målzon i andra änden,
- övningar som säger att offside gäller, eftersom offside bara är meningsfullt när det finns ett djup att spela i.

Kriteriet slår inte till på:

- omställningar och kontringar på tvären eller i en liten yta,
- avslutsövningar mot ett mål utan försvarslinje att passera,
- positionsspel och bollhållningsspel utan riktning,
- dueller som ett mot ett och två mot två, där poängen är att ta sig förbi en spelare och inte en linje.

#### Vad som händer när längden inte räcker

Här är det **inte** alltid ytan som ska ändras. Övningen gör anspråk på något den inte har plats för, och anspråket kan tas tillbaka. Jag sätter `atgarda` och skriver båda vägarna i `granskning`. Övningsförfattaren väljer:

1. **Förläng ytan** till måttet för fasen. Kontrollera då att golvet fortfarande stämmer med det nya måttet. En övning som bara blir längre och inte bredare får mer yta per spelare, och det är sällan ett problem, men om längdmåttet gör att övningen närmar sig taket är det ett tecken på att övningen behöver fler spelare, inte en smalare yta.
2. **Eller behåll ytan och skriv om övningen** så att den inte gör anspråk på djupled: ta bort försvarslinjen eller inspelet bakom ur beskrivningen och ändra fokusmärkningen därefter. Då är övningen inte fel, den är något annat, och den ska bedömas som det.

Det andra alternativet är ofta det bättre när ytan redan fungerar och övningen är bra på det den faktiskt gör. En kort och tät omställningsövning är fullt användbar för 13–14 år, så länge den inte påstår att den övar spel bakom en linje.

## Material

*Avsnittet är tillagt 2026-09-12, efter K1, på fråga från senior systemutvecklare.*

Varje övning listar vad den behöver i fältet `material` (`content/ovningar/README.md`, ADR 0010). Fältet gör två saker i version 1: det säger ledaren vad som ska plockas fram, och det gör att appen vet när passet ska påminna om att mål ska vara förankrade (R-084). **Det är inget filter.** Generatorn väljer aldrig bort en övning för att klubben saknar material (beslut 2026-09-11, `docs/krav/kravspec.md`, *Beslut vid K1*, punkt 1).

### Materialtyper

Listan är sluten (R-120). Nycklarna är stabila och ändras aldrig, precis som fokusområdenas nycklar. Namnet som visas för ledaren kan ändras. Listan är kort med flit: den ska täcka det en vanlig ungdomsledare har i bollpåsen och vid planen, inte allt som finns i en materialbod.

| Nyckel | Namn | Vad som avses |
|---|---|---|
| `boll` | Boll | Fotboll i den storlek spelformen anger (`spelformer.md`). Övningen behöver inte ange storleken. |
| `kon` | Kon | Strutkon att markera med. |
| `markering` | Markeringsplatta | Platt markering eller platt kona, som går att springa på utan att snubbla. |
| `vast` | Väst | Överdragsväst, för att skilja lag eller roller åt. |
| `mal` | Mål | Mål i en spelforms storlek, från 3 mot 3 till 11 mot 11, fast eller flyttbart (`spelformer.md`). |
| `minimal` | Minimål | Litet mål, ungefär 1–1,5 meter brett, av den typ som ofta ställs ut på träning. |
| `hinder` | Hinder | Häck, käpp, koordinationsstege eller liknande att ta sig över, runt eller igenom. |
| `ovrigt` | Övrigt | Allt annat, till exempel sarg i 3 mot 3. Kräver en anteckning som säger vad det är (R-120). |

Att tänka på:

- **Både `mal` och `minimal` utlöser säkerhetspåminnelsen** i R-084. Ett minimål är lätt och välter minst lika lätt som ett stort mål, och det är den viktigaste säkerhetsregeln i SvFF:s planstorleksdokument (`spelformer.md`).
- **Antalet avser en grupp**, precis som `spelare` och `ledarbehov`. En övning som körs i fyra grupper behöver alltså fyra uppsättningar. Ledaren räknar ihop det själv i version 1.
- **Målvaktens egen utrustning**, till exempel handskar, listas inte som material. Den hör till spelaren, inte till övningen.
- **Planskissen beskriver samma verklighet.** Skissobjekten `kon`, `markering`, `mal` och `boll` motsvarar materialtyperna med samma namn, och skissens målstorlek `smamal` motsvarar `minimal` (ADR 0012).
- **Ett materialfilter**, där ledaren anger hur många bollar och mål klubben har, är en Could-punkt i backloggen och kräver ett nytt beslut av användaren.

## Exempel

Underlag: 11 år (`fas-10-12`, `7mot7`), `niva-2`, 14 spelare, 2 ledare, 60 minuter, fokus `passning-mottagning`.

| Tid | Del | Innehåll | Grupper och ledare |
|---|---|---|---|
| 0–10 | Uppvärmning | En passningslek där alla rör sig i en ruta, med landningshopp inlagda (taggad `passning-mottagning` och `koordination`) | En grupp, typ `fri`, 1 ledare räcker |
| 10–21 | Öva | Två stationer à 5 minuter med 1 minuts byte: A är passningar med vändning (ledarstyrd), B är passningsbana i par | 2 grupper om 7, en ledare per station. I B blir en grupp tre |
| 21–23 | Vatten | Paus och flytt till nästa yta | |
| 23–35 | Spelövning | 3 mot 3 med joker, poäng för tre passningar i följd | 2 grupper om 7 sida vid sida, typ `tva-lag`, självgående |
| 35–37 | Vatten | Paus | |
| 37–55 | Spel | 7 mot 7 | En grupp om 14, typ `tva-lag` |
| 55–60 | Avslutning | Nedvarvning och samling | |

Delarnas tider jämfört med måltiden: Uppvärmning 10 (mål 10), Öva 11 (mål 10), Spelövning 12 (mål 12), Spel 18 (mål 19). Alla ligger inom 3 minuter. Summan blir 60 minuter. Pauserna ligger där den längsta tiden utan paus blir kortast, 21 minuter.
