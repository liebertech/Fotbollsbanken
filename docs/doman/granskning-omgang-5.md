Status: utkast

# Fotbollsexpertens granskning av omgång 5, paket B (2026-10-06)

Granskningen gäller de åtta övningarna för 13–19 år på grenen `omgang/5-paket-b`, skrivna efter `docs/doman/plan-omgang-5.md`, avsnitt 2.3. Alla åtta får status `atgarda`. Ingen av dem har något grundfel. Felen går att rätta i texten och skissen utan att byta övning, och fem av dem har bara en eller två punkter.

Underlaget är `passuppbyggnad.md` (yta per spelare, minsta längd, grupper och taket per ledare), `generatorregler.md` (R-004, R-014, R-034, R-050–R-058), `ytreferenser.md`, `spelformer.md`, `content/ovningar/README.md`, ADR 0019 och planens frågor F1–F7.

## Så har jag räknat

- **Golv:** för en övning för 13–19 år gäller den strängaste fasens golv (planens F2): 90 kvadratmeter per spelare med motståndare och 25 utan, räknat på `spelare.max`. Minst 40 meter lång när övningen övar djupled.
- **Tak:** matchens trängsta värde i den föreslagna spelformen, räknat på `spelare.min`. Det är 181 för 13–14 år (9 mot 9) och 273 för 15–19 år (11 mot 11). En övning för båda åldrarna prövas mot 181. Taket får överskridas med ungefär hälften när spelarspannet kräver det, och då skriver jag varför (F2).
- **Planskiss:** `via` räknas som kontrollpunkt i en Bézierkurva. En pil ska hålla minst cirka 1,3 m till spelare, koner och de platser som läggs till när gruppen växer. Köer ska stå utanför ytan. Ett mål med `storlek` som är en spelform ritas med målbredden för den spelform skissen visas i (ADR 0019, punkt 1). Ett minimål ritas alltid 1 m brett.
- **Ingen validering har körts.** Jag har inget skal i den här uppgiften. Skissdatan är kontrollerad för hand mot README.

## Genomgående

- **Tre skisser slutade med ett skott från egen planhalva**, 26–36 meter mot ett minimål eller fullstort mål (B1, B2 och B8). Det är samma fel som i `tre-passningar-fore-skott` i omgång 3. Skissen ska visa ett bra avslutsläge eller inget skott alls.
- **Rotationen ska vara entydig.** I B5 och B6 går det inte att läsa ut vem som går vart efter ett försök. Det gäller särskilt trion i parövningen (R-058).
- **Aktiviteten ska hålla i hela spannet.** B3 har två bollar för sexton spelare och B5 en kö på sju. Båda spannen fungerar i ena änden och inte i den andra.
- **Ingen text innehåller namn.** Alla etiketter på spelare är högst tre versaler eller siffror, och alla övriga etiketter är högst 24 tecken.
- **Egna texter.** Inget är kopierat ur SvFF:s material. B4 är nästan ordagrant samma text som bankens egen `skadeforebyggande-9mot9`. Det är inget upphovsrättsproblem, men det ger två nästan likadana övningar i banken. Se *Beslut som behövs*.

## Svar på övningsförfattarens frågor

1. **B2, `storre-spel-6mot6-till-11mot11`:**
   - *Ytan vid tolv spelare:* 3 250 / 12 = 270,8 kvadratmeter per spelare. Det håller för 15–19 år (taket 273), men är 50 procent över taket 181 för 13–14 år. Det är sex mot sex med målvakter på en hel 9 mot 9-plan, och det är precis det läge där jag krävde en mindre yta i `matchspel-9mot9-brett`. **Krav:** vid 12–15 spelare spelas på ungefär 50 × 40 meter (167 per spelare vid 12, 133 vid 15). Från 16 spelare används hela ytan (203 vid 16, 12 procent över taket och nära matchens form). Ytan i `yta` står kvar på 65 × 50, så att R-092 räknar med det största måttet.
   - *Antalen med målvakt:* rätt. Spelformernas namn räknar målvakten, så sex mot sex till elva mot elva är 12–22 spelare.
   - *Märkningen 9 mot 9:* ja, den står emot F1(c), och inte bara mot planen. `passuppbyggnad.md`, som är godkänd vid K1, säger att spelet är "i dagens spelform eller mindre". Med `9mot9` och 19–22 spelare lägger generatorn hela gruppen i ett spel (R-057), alltså tio mot tio eller elva mot elva för ett lag som valt 9 mot 9. **Krav:** `spelare.max` 18 och namnet "Större spel, sex mot sex till nio mot nio". Följden för 11 mot 11 med 19–23 spelare: B2 kan då inte användas (grupperna blir under 12, R-052), och spelet fylls av B1 i stället. Ett spel 10 mot 10 till 11 mot 11 för 15–19 år, märkt bara `11mot11`, hör hemma i omgång 6.
2. **B4, `spelare.min` 7:** skälet håller inte. Vid sex spelare får balansstationen fortfarande två, och organisationen säger redan att färre stationer körs när gruppen är liten. Sätt `spelare.min` till 6, som i planen. Då står en station tom vid sex.
3. **B7, zonregeln:** godtas, med två förtydliganden. "En passning inne i mittzonen" kan läsas som att både den som passar och den som tar emot ska stå i zonen. Skriv i stället att någon i laget ska ha *tagit emot* en passning i mittzonen. Och ett lag som vinner bollen i anfallszonen ska få göra mål direkt. Annars straffar regeln den press som övningens egen coachningspunkt ber om.
4. **B8, jokrar och åtta sekunder:** godtas. Regeln om åtta sekunder gör att bollen byter lag även när överläget är stort, och det är det som ger omställningar. Men aldrig tre jokrar. Fem mot två när det stora laget har bollen ger samma problem som jag fällde i `omstallning-med-jokrar`. Udda antal ger en joker och jämnt antal två.
5. **Ytorna nära golv och tak:** alla håller.

   | Övning | Yta | Vid `spelare.max` | Golv | Vid `spelare.min` | Tak | Längd |
   |---|---|---|---|---|---|---|
   | B1 | 36 × 20 | 90,0 vid 8 | 90 | 180,0 vid 4 | 181 | Inte djupled, om texten säger "utan offside" (se nedan) |
   | B7 | 42 × 28 | 98,0 vid 12 | 90 | 196,0 vid 6 | 181 | 42 ≥ 40, djupled |
   | B8 | 36 × 25 | 90,0 vid 10 | 90 | 180,0 vid 5 | 181 | Inte djupled, omställning i liten yta |

   B1 och B8 ligger exakt på golvet. Det finns ingen marginal: höjs `spelare.max` måste ytan växa. B7 ligger 8 procent över taket vid sex spelare. Det godtar jag enligt F2, eftersom spannet tre mot tre till sex mot sex behöver samma zonindelning i båda ändar och 42 meter är det minsta som djupledskriteriet tillåter.

## Dom per övning

### B1 `smalagsspel-till-mal-13-19`: åtgärda

Fotbollen är rätt: litet spel till minimål, brett spann, självgående och bra för 13–19 år. Tre saker ska ändras.

1. **Regler:** "fri match med vanliga regler" betyder offside för ett 9 mot 9- eller 11 mot 11-lag, och då slår längdkriteriet till (minst 40 meter, ytan är 36). Skriv i `beskrivning`: `Ingen offside och ingen målvakt. Går bollen ut sätts den i spel med inspel eller indribbling.` Förslag, som inte krävs: `Ingen får stå och vakta det egna målet.`
2. **Belastning:** två mot två i upp till 40 minuter utan vila är ett uthållighetspass, inte ett spel. Lägg till i `organisation`: `Spela i perioder om fyra till sex minuter med en till två minuters vila. Vid två mot två är perioderna två till tre minuter.`
3. **Skissen:** skottet gick 26 m från egen planhalva mot ett minimål.
   - Ersätt rörelserna med:
     - `{ typ: passning, fran: { objekt: a1 }, till: { objekt: a2 }, ordning: 1 }`
     - `{ typ: dribbling, fran: { objekt: a2 }, till: { x: 26, y: 11 }, ordning: 2 }`
     - `{ typ: skott, fran: { x: 26, y: 11 }, till: { objekt: mal-b }, ordning: 3 }`
   - Dribblingen går mellan B1 och B2, 3 m från båda, och håller 3,7 m eller mer till de fyra platserna. Skottet blir 10 m.
   - Skissens `beskrivning`: byt "med fler spelare vid fler än fyra per lag" mot "upp till fyra mot fyra".

Udda antal: ett lag med en spelare mer godtas. Ytreferensen *ungefär stora planens straffområde* stämmer (720 mot 665 kvadratmeter, samma form) och används redan för 32 × 20. Märkningen `7mot7` följer F1(c), eftersom två mot två till fyra mot fyra är mindre än alla tre spelformerna.

### B2 `storre-spel-6mot6-till-11mot11`: åtgärda

1. **`spelare.max` 18**, namnet `Större spel, sex mot sex till nio mot nio`, och "sex till elva" ändras till "sex till nio" i `beskrivning` och `organisation`. Skäl: fråga 1 ovan. ID:t står kvar, eftersom ett ID aldrig byts. Det är missvisande men tillåtet.
2. **Mindre yta för små grupper.** Lägg till i `beskrivning` och `organisation`: `Vid tolv till femton spelare spelas på en mindre yta, ungefär 50 x 40 meter, eftersom hela ytan blir för gles för så små lag. Från sexton spelare används hela ytan.` Lägg till `{ typ: kon, antal: 8, anteckning: hörnen på hela ytan och på den mindre ytan }` i `material`.
3. **`anpassning.fler_spelare`:** `Vid fler än arton spelare, välj ett mindre spel. Från tjugofyra spelare kan gruppen spela två matcher på varsin yta.`
4. **`varianter.svarare`** säger emot syftet. Högst två passningar på egen planhalva tvingar fram långa bollar, och övningen ska lära laget att spela sig ut. Förslag: `Motståndarna får pressa högt direkt när målvakten har bollen, och målvakten måste spela ut kort längs marken.`
5. **Skissen:** skottet gick 36 m från egen planhalva och 1,6 m förbi en försvarare. Bollen låg hos A3 fast första passningen gick från målvakten.
   - Bollen till `(3, 25)`.
   - Ersätt rörelserna med:
     - `{ typ: passning, fran: { objekt: gk-a }, till: { objekt: a2 }, ordning: 1 }`
     - `{ typ: passning, fran: { objekt: a2 }, till: { objekt: a3 }, ordning: 2 }`
     - `{ typ: passning, fran: { objekt: a3 }, till: { objekt: a4 }, ordning: 3 }`
   - Behåll bara de sex första platserna, så att skissen räcker till arton.

Målen med `storlek: 9mot9` ritas 6 m i 9 mot 9 och 7,32 m i 11 mot 11 (ADR 0019). Det är rätt, eftersom det är lagets eget mål. Offside och inspark gör att övningen inte får märkas `7mot7` (F1(b)), och den är inte märkt så. Ytreferensen *hela 9 mot 9-planen, ungefär halva stora planen* stämmer. Udda antal: ett lag med en utespelare mer godtas.

### B3 `passningar-i-rorelse-13-19`: åtgärda

Ytan håller: 400 / 16 = 25,0, exakt golvet utan motståndare. Taket vid fyra är 100.

1. **Bollar:** två bollar för sexton spelare ger varje spelare en bollkontakt ungefär var tjugonde sekund. Skriv i `beskrivning`: `Två bollar vid fyra till åtta spelare, tre vid nio till tolv och fyra vid tretton till sexton.` Ändra `material` till `{ typ: boll, antal: 4, anteckning: två till fyra beroende på antal spelare }`.
2. **Skissen:** passningen P2 till P3 gick diagonalt genom mitten, där den femte platsen `(10, 10)` står när gruppen är nio eller fler. Löpningen slutade 1,4 m från samma passningslinje.
   - Ersätt rörelserna med:
     - `{ typ: passning, fran: { objekt: p1 }, till: { objekt: p2 }, ordning: 1 }`
     - `{ typ: lopning, fran: { objekt: p1 }, till: { x: 5, y: 12.5 }, ordning: 2 }`
     - `{ typ: passning, fran: { objekt: p2 }, till: { objekt: p4 }, ordning: 3 }`
   - Löpningen går 2 m från platserna `(3, 10)` och `(7, 10)`, och passningen 2 m från `(13, 10)` och `(17, 10)`.

Förslag, som inte krävs: `tid.langst` 20 i stället för 15, med svårare variant som steg två. Då kan Öva i ett 120-minuterspass fyllas med två moment i stället för att kräva B5 eller B6 bredvid. Ytreferensen *en ruta något större än stora planens mittcirkel* stämmer och är samma som för bankens andra 20 × 20.

### B4 `skadeforebyggande-uppvarmning-13-19`: åtgärda

Ledarbehov 1 är rätt (F6). Ytan godtas enligt undantag 3 (stationer, minst 2 m mellan arbetsplatserna). Ingen ytreferens: stationer (`ytreferenser.md`, avsnitt 4). Tiden 8–20 minuter ligger i nivå med Knäkontroll. Gruppdelningen går ihop: taket per ledare är 14 för 13–14 år och 16 för 15–19 år, och vid 15–16 spelare i 13–14 år blir det två grupper om minst sju.

1. **`spelare.min` 6** (fråga 2).
2. **Platserna räcker inte för rotationen.** Med balans 2, planka 3, sidohopp 3, höga knän 3, enbenshopp 3 och utfallssteg 2 är det sexton platser för sexton spelare. När blocken roterar medurs kommer ett block om tre till balansen och ett till utfallsstegen, och då finns ingen ledig plats. Skriv i `organisation`: `Varje station tar upp till tre spelare. Balansstationen har alltid minst två: en står på ett ben och en knuffar, och vid tre turas två om att knuffa. Vid sex spelare står en station tom.` Då finns arton platser.
3. **Skissen:**
   - Ta bort `ordning` från alla sex löpningar. Alla roterar samtidigt, som i `knakontroll-uppvarmning`.
   - Den första löpningens etikett: `Alla roterar medurs`.
   - Ta bort spelaren på `(13, 13)`, så att basskissen har sex spelare.
   - Lägg till `{ typ: ledare, x: 8, y: 7 }`.
   - `beskrivning`: `Yta 16 x 14 meter med sex stationer, tre på varje rad. Alla gör sin station samtidigt och roterar medurs på ledarens signal. Balansstationen har alltid minst två. Ledaren står i mitten och rättar knäläget.`

Förslag, som inte krävs: platser för den andra och tredje spelaren vid varje station, så att skissen visar hela gruppen.

### B5 `avslut-efter-passning-mot-malvakt`: åtgärda

1. **Kön:** upp till sju i kö ger ett skott per spelare i minuten eller mer sällan. Det är för lite för en Öva-övning. Sätt `spelare.max` till 7 (passare, avslutare, målvakt och högst fyra i kö). Det följer fortfarande designregeln i planen (7 ≥ 2 × 4 − 1). `anpassning.fler_spelare`: `Är ni fler än sju, bygg en till grupp vid ett annat mål.`
2. **Målvakten och rotationen säger emot varandra.** "Alla roterar en position efter varje försök" gör alla till målvakt i tur och ordning, medan "byts ofta och frivilligt" säger att ingen behöver stå. Ersätt med: `Utespelarna roterar efter varje försök: passaren blir avslutare, avslutaren hämtar sin boll och ställer sig sist i kön, och den första i kön blir passare. Målvakten står en serie om sex till åtta skott och byts sedan, helst mot lagets egen målvakt eller en spelare som vill. Ingen tvingas stå i mål.` Då får `malvaktsspel` också en mening, eftersom målvakten får en serie.
3. **Säkerheten för målvakten:** en 15–19-åring skjuter hårt med en boll i storlek 5 också från tio meter, och övningen räknar med en utespelare utan handskar. Skriv: `Den som står i mål har målvaktshandskar. Står en utespelare i mål placerar avslutaren skottet i stället för att skjuta med full kraft.` Lägg till `{ typ: ovrigt, antal: 1, anteckning: målvaktshandskar till den som står i mål }`. Den fjärde coachningspunkten blir: `Placera skottet när en utespelare står i mål, och skjut aldrig inifrån tio meter.`
4. **Skissen:**
   - Rotationspilen: `{ typ: lopning, fran: { objekt: sp-av }, till: { objekt: sp-k1 }, ordning: 3, etikett: Sist i kön }`. Den gick förut längs skottlinjen in i målet, och avslutaren blir inte längre målvakt. Pilen håller 3,8 m till passaren.
   - `beskrivning`: `Yta 18 x 14 meter med ett mål och en målvakt på högra kortsidan. Passaren spelar in från sidlinjen och avslutaren möter bollen centralt. Kön står utanför ytan vid sidan av målet, bortom skottlinjen. Avslutaren ställer sig sist i kön och den första i kön blir passare.`

Det som håller: skottavståndet är 12 m i skissen, kön står 2 m utanför ytan och 9 m från skottlinjen och räcker till fyra med `avstand` 1,5. Målet med `storlek: 9mot9` ritas i lagets egen målstorlek i varje spelform. Golvet utan motståndare håller (36 vid sju), eftersom målvakten inte gör övningen till en övning med motståndare. Ytreferensen stämmer.

### B6 `en-mot-en-till-mal-13-19`: åtgärda

Duellen är rätt: startavstånden 12 och 6 m, försvararen väntar tills anfallaren rört bollen, och 96 kvadratmeter per spelare i paret. Dribblingen håller 1,4 m till försvararens slutpunkt och 1,9 m till startpunkten, räknat som Bézierkurva. Ingen ytreferens: duell med startavstånd (`ytreferenser.md`, avsnitt 4).

1. **Trion:** texten säger inte vem som går vart. Ersätt `anpassning.udda_antal` med: `Vid udda antal blir en grupp en trio. Anfallet går alltid mot samma mål. Den tredje väntar med en boll strax utanför ytan, bakom anfallarens start. Efter varje duell blir anfallaren försvarare, försvararen hämtar bollen och ställer sig och väntar där, och den som väntade anfaller direkt. Då har alla varje roll en gång per varv.`
2. **Kön** stod 1,5 m från anfallaren, inne i ytan. Ändra till `{ vid: anf, riktning: 0, avstand: 5, etikett: Nästa anfallare väntar }`. Den tredje står då på `(17, 6)`, 1 m utanför kortlinjen och bort från målet. Lägg sist i skissens `beskrivning`: `Vid udda antal väntar en tredje bakom anfallarens start med en boll.`
3. **Snabbhet kräver vila.** "Startar nästa duell direkt" ger ingen återhämtning, och då blir snabbheten uthållighet. Skriv i `organisation`: `Kör serier om fyra till sex dueller per spelare med en minuts vila mellan serierna. Nästa duell startar när båda står på plats.`

### B7 `spela-framat-i-positionsspel`: åtgärda

Övningen är bra och skissen håller: A2 tar emot i mittzonen, och alla passningar och skottet håller minst 2 m till motståndare och platser. Djupled: 42 m, alltså minst 40. Ytreferensen *något längre än stora planens straffområde är brett* är samma som för `forsvara-med-offsidefalla`, 42 × 28.

1. **Zonregeln** (fråga 3). Ersätt meningen i `beskrivning` med: `Ett mål räknas bara om någon i laget har tagit emot en passning i mittzonen under anfallet. Vinner laget bollen i anfallszonen räknas målet utan krav.` Ändra `organisation` till "om någon har tagit emot i mittzonen" i stället för "om en passning gått i mittzonen".
2. **Omstart:** lägg till: `Efter mål, och när bollen går ut över en kortlinje, startar det anfallande laget med bollen i sin egen zon.` Det gör att uppbyggnaden, som är syftet, händer ofta.
3. **`varianter.svarare`:** `Två olika spelare måste ha tagit emot i mittzonen innan mål räknas.`

Udda antal: ett lag med en spelare mer godtas.

### B8 `omstallning-i-overlage-till-mal`: åtgärda

1. **Antal och jokrar** (fråga 4). `beskrivning` säger två jokrar och `organisation` fem till tio spelare, men vid fem finns bara en joker, och lösningen för udda antal ger tre. Skriv i `organisation`: `Fem spelare: två mot två och en joker. Sex: två mot två och två jokrar. Sju: tre mot tre och en joker. Åtta: tre mot tre och två jokrar. Nio: fyra mot fyra och en joker. Tio: fyra mot fyra och två jokrar.` `anpassning.udda_antal`: `Vid udda antal är det en joker, vid jämnt antal två. Aldrig tre jokrar, eftersom laget utan boll då nästan aldrig vinner bollen.` I `beskrivning`: "en eller två jokrar" i stället för "två jokrar".
2. **Målen och regeln.** Det finns ett mål i varje ände, men texten säger "något av målen" och "täcka båda målen". Skriv `mot motståndarnas mål` och ändra den tredje coachningspunkten till `Försvara kompakt framför ert mål när ni är i underläge.` Skriv också att regeln gäller varje anfall: `Varje gång ett lag får bollen, genom bollvinst eller en ny boll, har det åtta sekunder på sig att avsluta. Lyckas det inte, eller går bollen ut, startar motståndarna med en ny boll från sin kortlinje.`
3. **`anpassning.fler_spelare`** säger emot `yta` och `spelare.max`. Ersätt med `Vid fler än tio spelare, bygg en andra yta med samma mått bredvid.`
4. **`varianter.svarare`**: `Tidsgränsen sänks till sex sekunder.` "Med sin joker redan inne" går inte ihop med att jokrarna spelar med laget som har bollen.
5. **Skissen** visade ett anfall som slutade med ett skott från 26 m, och ingen omställning, fast det är syftet.
   - `b1` till `(16, 8)`, bollen till `(15.1, 8)` och `j1` till `(18, 14)`.
   - Ersätt rörelserna med:
     - `{ typ: dribbling, fran: { objekt: b1 }, till: { x: 13, y: 8 }, ordning: 1 }`
     - `{ typ: lopning, fran: { objekt: a1 }, till: { x: 12, y: 8 }, ordning: 1, etikett: Vinner bollen }`
     - `{ typ: passning, fran: { x: 12, y: 8 }, till: { objekt: j1 }, ordning: 2 }`
     - `{ typ: lopning, fran: { objekt: a2 }, till: { x: 28, y: 20 }, ordning: 2 }`
     - `{ typ: passning, fran: { objekt: j1 }, till: { x: 28, y: 20 }, ordning: 3 }`
     - `{ typ: skott, fran: { x: 28, y: 20 }, till: { objekt: mal-b }, ordning: 4 }`
   - Den sista platsen, jokern, flyttas till `{ x: 17, y: 22, lag: neutral }`. På `(18, 17)` stod den 1,3 m från A2:s löpning.
   - Platsordningen A, B, A, B och sist joker står kvar. Den visar fem, sju, nio och tio rätt. Vid sex och åtta visar den ett lag med en spelare mer, och det skrivs i `beskrivning` (nödlösningen i ADR 0018, punkt 6):
     `Yta 36 x 25 meter med ett minimål i var ände. Två mot två och en joker som spelar med laget som har bollen. A1 vinner bollen och lag A anfaller direkt med jokern. Vid sex och åtta spelare är den extra en andra joker, men bilden visar då ett lag med en spelare mer. Lag A anfaller åt höger.` (294 tecken)
   - A1 och B1 möts med flit i närkampen på `(12–13, 8)`. I övrigt håller alla pilar minst 1,5 m till motståndare och platser. Skottet blir 11 m.

Ytreferensen *ungefär halva 7 mot 7-planen* godtas. Den är samma som för `omstallning-med-jokrar`, 35 × 25, och nyckeln `7mot7` finns i övningens spelformer.

## Sammanfattning

| Övning | Dom | Vad som ändras |
|---|---|---|
| B1 `smalagsspel-till-mal-13-19` | åtgärda | Regler utan offside, perioder med vila, skissen |
| B2 `storre-spel-6mot6-till-11mot11` | åtgärda | `spelare.max` 18 och namnet, mindre yta vid 12–15, svårare variant, material, skissen |
| B3 `passningar-i-rorelse-13-19` | åtgärda | Antal bollar, skissen |
| B4 `skadeforebyggande-uppvarmning-13-19` | åtgärda | `spelare.min` 6, platser per station, skissen |
| B5 `avslut-efter-passning-mot-malvakt` | åtgärda | `spelare.max` 7, rotation och målvakt, handskar, skissen |
| B6 `en-mot-en-till-mal-13-19` | åtgärda | Trion, kön, serier med vila |
| B7 `spela-framat-i-positionsspel` | åtgärda | Zonregeln, omstart, svårare variant |
| B8 `omstallning-i-overlage-till-mal` | åtgärda | Jokrar per antal, mål och regel, anpassning, variant, skissen |

## Kvarstår

- **Ytreferenserna förs in i `ytreferenser.md`, avsnitt 6, när övningarna blir `granskad`.** Med referens: B1, B2, B3, B5, B7, B8. Utan: B4 (stationer) och B6 (duell med startavstånd).
- **11 mot 11 med 19–23 spelare får inget stort spel** när B2 stannar vid arton. Spelet fylls av B1 i flera grupper, så ett pass skapas ändå. Ett spel 10 mot 10 till 11 mot 11 för 15–19 år, märkt bara `11mot11`, bör läggas till i omgång 6.
- **Golvet utan marginal i B1 och B8.** Båda ligger exakt på 90. Det är rätt nu, men en senare höjning av `spelare.max` kräver större yta.
- **Taket för övningar för 13–19 år.** Jag har prövat mot 181, alltså 9 mot 9, eftersom 13-åringar ingår. Planens F2 säger inte uttryckligen vilket tak som gäller när två föreslagna spelformer ingår. Det bör skrivas in i `passuppbyggnad.md` när planen godkänns.

## Beslut som behövs

1. **Två nästan likadana skadeförebyggande uppvärmningar för 13–14 år.** B4 och `skadeforebyggande-9mot9` (omgång 4, `granskad`) har nästan samma text och samma stationer. Generatorn kan välja båda i samma uppvärmning i ett långt pass, eftersom R-070 bara förbjuder samma ID. Rekommendation: B4 ersätter `skadeforebyggande-9mot9`, som då inte förs in i banken med omgång 4. Annars bör `skadeforebyggande-9mot9` göras om till en annan uppsättning stationer. Det är redaktörens och användarens beslut, eftersom det rör en övning i en annan omgång.

## Paket B, andra omgången (2026-10-06)

Övningsförfattaren har fört in rättelserna, och alla åtta stod på `utkast` igen. Jag har läst varje fil och jämfört den med punkterna ovan. Skissdatan har jag kontrollerat koordinat för koordinat mot domarna, eftersom den fördes över för hand. Ingen validering är körd, och skissavstånden är räknade för hand som förut.

### Dom per övning

**B1 `smalagsspel-till-mal-13-19`: granskad.** Ingen offside och ingen målvakt står i beskrivningen, och perioderna med vila står i organisationen. I skissen går dribblingen från A2 till `(26, 11)` och skottet från samma punkt, precis som domen säger. Skissens beskrivning säger "upp till fyra mot fyra". Meningen "fri match med vanliga regler i litet format" står kvar, men den följs nu direkt av undantagen och säger inte längre emot dem.

**B2 `storre-spel-6mot6-till-11mot11`: granskad.** Spelare 12–18, det nya namnet, den mindre ytan för 12–15 spelare i både beskrivning och organisation, åtta koner, den nya anpassningen och den nya svårare varianten är införda. I skissen ligger bollen på `(3, 25)`, de tre passningarna går målvakten–A2–A3–A4 utan skott, och de sex första platserna står kvar. Förslag, som inte krävs: åtta västar räcker, eftersom ett lag har högst åtta utespelare.

**B3 `passningar-i-rorelse-13-19`: granskad.** Antalet bollar per antal spelare står i beskrivningen, och materialet är fyra bollar. Rörelserna i skissen är exakt de tre i domen.

**B4 `skadeforebyggande-uppvarmning-13-19`: granskad.** `spelare.min` är 6, och varje station tar upp till tre spelare, med minst två på balansstationen. Skissen har sex löpningar utan `ordning`, etiketten `Alla roterar medurs` på den första, sex spelare (den på `(13, 13)` är borttagen) och en ledare på `(8, 7)`. Skissens beskrivning är ordagrant den i domen. Beslutet om dubbletten med `skadeforebyggande-9mot9` står kvar.

**B5 `avslut-efter-passning-mot-malvakt`: granskad.** Spelare 4–7, en kö på en till fyra, entydig rotation, målvakt i serier utan tvång, handskar som `ovrigt` och en ny fjärde coachningspunkt. Rotationspilen går från `sp-av` till `sp-k1`, har `ordning: 3` och etiketten `Sist i kön`. Skissens beskrivning är den i domen. Förslag, som inte krävs: den första meningen i beskrivningen räknar fortfarande målvakten som en roll i rotationen.

**B6 `en-mot-en-till-mal-13-19`: åtgärda.** Trion, kön och serierna är införda. Kön är `{ vid: anf, riktning: 0, avstand: 5, etikett: Nästa anfallare väntar }` och skissens beskrivning nämner trion. En sak är kvar: `beskrivning` slutar fortfarande med "som startar nästa duell direkt". Det säger emot organisationen och tar bort vilan. Ersätt den sista meningen i `beskrivning` med exakt:
`Efter varje försök byter de två roller: den som blir ny försvarare hämtar reservbollen vid målet och rullar in den till den nya anfallaren. Nästa duell startar när båda står på plats.`

**B7 `spela-framat-i-positionsspel`: granskad.** Zonregeln, regeln om bollvinst i anfallszonen, omstarten i egen zon och den nya svårare varianten är införda med domens ordalydelse. Skissen var godkänd redan i första omgången och är oförändrad. Förslag, som inte krävs: i den lättare varianten kan "kravet på en passning i mittzonen" bli "kravet på mittzonen".

**B8 `omstallning-i-overlage-till-mal`: granskad.** Jokrarna per antal, målen, regeln för varje anfall, anpassningen och båda varianterna är införda. I skissen ligger `b1` på `(16, 8)`, bollen på `(15.1, 8)` och `j1` på `(18, 14)`. De sex rörelserna, med `ordning` 1, 1, 2, 2, 3, 4 och etiketten `Vinner bollen`, är exakt de i domen. Platserna är A, B, A, B och sist jokern på `(17, 22)`. Skissens beskrivning är ordagrant den i domen.

### Ytreferenser

Sex rader är införda i `ytreferenser.md`, avsnitt 6.1: B1, B2, B3, B5, B7 och B8. B4 är införd i 6.2 med kategorin stationer. Kolumnen *Var* är `omgang/5-paket-b`. B6 hör till 6.2 som duell med startavstånd, och den förs in när den blir granskad. Där står en mening om det.

### Sammanfattning

| Övning | Dom |
|---|---|
| B1 `smalagsspel-till-mal-13-19` | granskad |
| B2 `storre-spel-6mot6-till-11mot11` | granskad |
| B3 `passningar-i-rorelse-13-19` | granskad |
| B4 `skadeforebyggande-uppvarmning-13-19` | granskad |
| B5 `avslut-efter-passning-mot-malvakt` | granskad |
| B6 `en-mot-en-till-mal-13-19` | åtgärda, en mening i `beskrivning` |
| B7 `spela-framat-i-positionsspel` | granskad |
| B8 `omstallning-i-overlage-till-mal` | granskad |

Ingen etikett och ingen text innehåller namn. Det som står under *Kvarstår* och *Beslut som behövs* ovan gäller fortfarande. Punkten om att ytreferenserna ska föras in är gjord för sju av de åtta.

### B6, tredje kontrollen (2026-10-06)

**B6 `en-mot-en-till-mal-13-19`: granskad.** Huvudsessionen förde in rättelsen (commit 729056b). Den sista meningen i `beskrivning` står nu exakt som i domen ovan: "…rullar in den till den nya anfallaren. Nästa duell startar när båda står på plats." Den stämmer med organisationen. Jag har läst hela filen, och inget annat är ändrat. B6 är införd i `ytreferenser.md`, avsnitt 6.2, som duell med startavstånd. Därmed är alla åtta övningar i paket B granskade och alla åtta införda i ytreferenserna.
