Status: utkast

# Ytreferenser

Det här dokumentet är ordlistan för fältet `ytreferens` i övningsformatet (ADR 0017). Det säger vad en ytreferens får jämföra med, hur den skrivs, när den ska utelämnas och vilken referens var och en av bankens 58 övningar ska ha.

**Beslut som styr dokumentet (användaren, 2026-09-24):** metertalet står kvar som huvudmått, och referensen följer efter i parentes. Exempel: "18 × 12 meter (stora planens målområde, dubbelt så djupt)". Regelmotorn, planskissen och alla ytregler räknar vidare på metertalet. Referensen visas bara, och den ändrar aldrig en övning.

Den som skriver en övning läser avsnitt 2 till 4. Den som granskar läser också avsnitt 4 och 5.

## 1. Vad som faktiskt är uppritat på planerna

En referens får bara bygga på något som ledaren säkert kan se eller känna igen. Därför har jag kontrollerat vilka linjer som finns i varje spelform.

| Spelform | Ytterlinjer | Mittlinje | Straffområde | Målområde | Mittcirkel | Straffpunkt |
|---|---|---|---|---|---|---|
| 3 mot 3 | Linjer eller sarg | Nämns inte | Nej | Nej | Nej | Nej |
| 5 mot 5 | Linjer eller koner | Ja, linje eller koner. Är också retreatlinje | Nej, uttryckligen | Nej | Nämns inte | Nej |
| 7 mot 7 | Linjer eller koner | Ja, och en retreatlinje 7 meter från mittlinjen på varje planhalva | Ja, 19 × 7 meter | Nej | Nämns inte | Ja, 7 meter |
| 9 mot 9 | Linjer eller koner | Ja | Ja, 24 × 9 meter. Kan markeras med koner | Nej | Nämns inte | Ja, 9 meter |
| 11 mot 11 | Linjer | Ja | Ja, 40,3 × 16,5 meter | Ja, 18,3 × 5,5 meter | Ja, 18,3 meter tvärs över | Ja, 11 meter |

Korta belägg, med källa i avsnitt 8:

- 5 mot 5: "Straffområde markeras inte på planen." Mittlinjen markeras "med linje eller koner".
- 7 mot 7: straffområdet är sju meter längs mållinjen från vardera målstolpen och sju meter ut i planen, och "Ytan kan avgränsas med linjer eller med koner."
- 9 mot 9: straffområdet är 24 × 9 meter och "kan markeras med koner på kort- och sidlinjen".

Ingen av källorna nämner mittcirkel eller målområde i 5 mot 5, 7 mot 7 eller 9 mot 9. Det bevisar inte att de saknas, men tre oberoende beskrivningar som räknar upp mittlinje, retreatlinje, straffområde och straffpunkt utan att nämna dem är ett starkt tecken. **Dokumentet utgår därför från att mittcirkeln och målområdet bara säkert finns på en fullstor plan.** Skulle det visa sig att de finns även på mindre planer blir ingen formulering fel, bara försiktigare än nödvändigt.

Tre saker följer av tabellen:

1. De tre straffområdena skiljer sig med en faktor fem: 7 mot 7 ungefär 130 kvadratmeter, 9 mot 9 ungefär 215 och 11 mot 11 ungefär 665. Ordet *straffområdet* utan mer betyder alltså olika saker för olika lag.
2. Småplaner är ofta bara konmarkerade. En referens får inte skicka ledaren att leta efter en linje som kanske inte finns.
3. Den fullstora planen är det enda alla ledare har sett, även den som tränar på en grusplan.

## 2. Tre konventioner

**Konvention 1: straffområdet, målområdet och mittcirkeln är alltid stora planens, och det skrivs ut.**
Skriv *stora planens straffområde*, *stora planens målområde*, *stora planens mittcirkel*. Om lagets eget straffområde passar bättre skriver du *ert eget straffområde*, och då gäller referensen bara den spelformen (se konvention 3 och avsnitt 3.4).

**Konvention 2: referensen jämför storlek, den pekar inte ut en plats.**
Skriv "ungefär så stor som", inte "ställ upp i". Ledaren ska kunna bygga ytan var som helst, också på en plan utan de linjer som nämns. Det gäller också övningar som spelas vid ett mål: referensen säger hur stor ytan är, och var den läggs står i beskrivningen. Det finns inga undantag.

**Konvention 3: en andel av en spelforms plan skriver alltid ut spelformen.**
Skriv *halva 7 mot 7-planen*, aldrig *halva planen*. Halva planen är 15 × 15 meter för ett 8-årslag och 50 × 60 för ett 16-årslag.

Utöver konventionerna gäller formen i fältet (ADR 0017 och `content/ovningar/README.md`):

- Fri text, högst 90 tecken. Sikta på ungefär 70, så att texten ryms efter måttet på en mobilskärm.
- Inga måttenheter (*meter*, *m*, *cm*, *kvadratmeter* och liknande) och inget tal × tal. Siffror i spelformernas namn är tillåtna, liksom steg.
- Liten begynnelsebokstav och ingen punkt.
- Nyckeln är `alla` eller en spelform som finns i övningens `spelformer`.

## 3. Referensbiblioteket

En referens byggs av delarna nedan. Hitta inte på en egen jämförelse. Behövs en ny, fråga fotbollsexperten, så förs den in här.

### 3.1 Stora planens straffområde, delat på bredden

Stora planens straffområde är ungefär 40 meter brett och 16,5 meter djupt. **Andelar av det delas alltid på bredden, så att djupet är detsamma.** Ledaren står på straffområdeslinjen och stegar i sidled. Trappan täcker nästan hela bankens spann:

| Referens | Ungefär | Yta, ungefär |
|---|---|---|
| en fjärdedel av stora planens straffområde | 10 × 16,5 | 165 m² |
| en tredjedel av stora planens straffområde | 13 × 16,5 | 220 m² |
| halva stora planens straffområde | 20 × 16,5 | 330 m² |
| två tredjedelar av stora planens straffområde | 27 × 16,5 | 445 m² |
| tre fjärdedelar av stora planens straffområde | 30 × 16,5 | 500 m² |
| stora planens straffområde | 40 × 16,5 | 665 m² |
| stora planens straffområde, nästan dubbelt så djupt | 40 × 30 | 1 200–1 350 m² |

### 3.2 Övriga referenser

| Referens | Ungefär | Yta, ungefär | När den passar |
|---|---|---|---|
| stora planens målområde | 18 × 5,5 | 100 m² | Smala banor. Bredden 18 är ett av bankens vanligaste mått |
| stora planens målområde, *n* gånger så djupt | 18 × 5,5*n* | | 18 × 12 är "dubbelt så djupt" |
| en ruta som rymmer stora planens mittcirkel | 18 × 18 | 325 m² | Den enda referensen som ger en kvadrat |
| lika lång som stora planens straffområde är brett | 40 i längd | | Djupledsövningar, där längden är det som styr. Ledaren mäter längden mot straffområdeslinjen. Bredden står bara i metertalet |
| något längre än stora planens straffområde är brett | drygt 40 i längd | | Samma, när längden är några meter mer än 40 |
| ert eget straffområde (bara nyckeln `7mot7`) | 19 × 7 | 130 m² | Avlånga små ytor för 7 mot 7-lag |
| ert eget straffområde (bara nyckeln `9mot9`) | 24 × 9 | 215 m² | 9 mot 9-lag vid 18 × 12. Exakt samma yta |
| hela, halva, en fjärdedel av *spelformens* plan | se `spelformer.md` | | Bara stora spelövningar och matchspel |

Tillägg som får användas för att justera: *ungefär*, *nästan*, *något större än*, *några steg bredare* eller *smalare*, *djupare*, och ett stegtal som *tio steg utanför*.

### 3.3 Var gränsen går

Alla tre villkoren ska vara uppfyllda för att en referens ska ges:

1. **Storleken stämmer inom ungefär 20 procent.** Mer än så och referensen vilseleder.
2. **Formen stämmer.** Två ytor med samma antal kvadratmeter men olika form ger olika övningar. Ge ingen referens som skulle få ledaren att bygga fel form.
3. **Måttet är inte själva poängen i övningen.** Se avsnitt 4.

Skriv *ungefär* när storleken eller formen avviker märkbart, och utelämna det när referensen träffar.

### 3.4 En referens per spelform

Samma mått kan förtjäna olika referens beroende på vilken plan laget står på. Då anges referensen per spelformsnyckel i stället för med `alla`. Exempel: 18 × 12 meter är *stora planens målområde, dubbelt så djupt* för ett 5 mot 5-lag men *ert eget straffområde* för ett 9 mot 9-lag. I dagens bank har varje övning en enda spelform, så alla referenser i avsnitt 6 anges med `alla`.

### 3.5 Stegmåttet

Stegmåttet skrivs inte i referensen, eftersom metertalet redan står före parentesen. Det gäller en gång för alla:

> Ett långt vuxensteg är ungefär en meter. Alla mått i övningarna kan stegas i stället för mätas. Kontrollera ditt steg en gång: tio steg längs mållinjen ska vara ungefär hälften av bredden på stora planens målområde.

Steg står bara i referensen när de anger något som saknar egen linje, som det extra djupet i `omstallningsspel-9mot9` (*sex steg djupare*).

## 4. När referens inte ska ges

Ingen referens är ofta det rätta svaret. Det gäller i fyra fall:

| Kategori | Varför | Övningar i banken |
|---|---|---|
| **Positionsspel där måttet är både golv och tak** | En större yta förstör övningen, och en parentes som säger *ungefär* antyder att måttet går att förhandla om. | `behall-bollen-i-gruppen`, `forsvara-i-overtal` |
| **Stationer och fasta positioner, där avståndet är det som övas eller det som skyddar** | Det som styr är avståndet mellan spelare eller arbetsplatser, inte ytans storlek. En storleksjämförelse lockar till att sprida ut övningen. | `malvaktstraning-grunder`, `tva-touch-i-triangel`, `knakontroll-uppvarmning`, `rorelsebana-skadeforebyggande`, `skadeforebyggande-9mot9` |
| **Dueller med startavstånd** | Anfallarens och försvararens startavstånd är måttkritiska och får inte skuggas av en ungefärlig parentes. | `en-mot-en-till-mal` |
| **För liten eller ingen plandel med rätt form** | Ingenting på en fotbollsplan är så litet, eller har den formen. En långsökt jämförelse är sämre än ingen. | `driva-forbi-i-par`, `triangelpass-med-rorelse`, `en-mot-en-till-smamal`, `passningsruta-i-rorelse` |

De två första kategorierna motsvarar de ytundantag för positionsspel och stationer som infördes med omgång 4 (undantag 1 och undantag 3 i underlaget till den omgången). Där gäller redan ett eget, strängare mått i stället för kvadratmeter per spelare.

**Fasta positioner utesluter inte alltid en referens.** Risken med fasta positioner är att en ungefärlig jämförelse lockar ledaren att sprida ut övningen. Om jämförelsen är exakt finns inte den risken, och då får referensen ges. `langre-passningar-i-rorelse` har fyra spelare i hörnen av en kvadrat om 18 × 18 meter och får *en ruta som rymmer stora planens mittcirkel*, eftersom mittcirkeln är 18 meter tvärs över. Står det *ungefär*, *nästan* eller *något större* i referensen är jämförelsen inte exakt, och då ges ingen referens till en övning med fasta positioner.

**Referensen kan inte räknas fram ur måttet.** Om en övning ska ha en referens avgörs av vad som händer i ytan, inte bara av hur stor den är. Pröva därför varje övning för sig, också när en annan övning med samma mått redan har en referens eller saknar en. Två övningar med samma mått kan dessutom sakna referens av olika skäl: `passningsruta-i-rorelse` och `tva-touch-i-triangel` är båda 10 × 10 meter, men den första saknar referens för att ingen plandel har den formen, och den andra för att spelarna har fasta positioner.

## 5. En utelämnad referens är ett värde, inte en lucka

Fältet är valfritt, och ingen validering kan se skillnad på en referens som glömts och en som medvetet utelämnats. Därför gäller vid granskning:

- **Granskaren prövar varje övning utan `ytreferens`, och passerar den inte bara.** Frågan är: hör övningen till någon av kategorierna i avsnitt 4? Om ja, är utelämnandet rätt. Om nej, är referensen glömd, och övningen får status `atgarda` med en föreslagen referens.
- **Skälet skrivs i `granskning`.** När en övning medvetet saknar referens skriver granskaren kategorin i sin kommentar, till exempel "Ingen ytreferens: duell med startavstånd." Då ser nästa granskare att frågan är prövad.
- **Tabellen i avsnitt 6 är facit för bankens 58 övningar.** En ny övning läggs till i tabellen när den granskas, med referens eller med kategori.

## 6. Referens per övning

Den här tabellen är underlaget för att skriva in fältet i ett svep. Referensen skrivs exakt som i kolumnen, med nyckeln `alla`. Rader med *ingen* ska inte få fältet alls. Kolumnen *Var* anger var övningen finns 2026-09-28. Alla 58 övningar, också de 16 från omgång 4, finns nu i main, och mått och spelform är kontrollerade mot filerna samma dag (avsnitt 8).

### 6.1 Med referens (46 övningar, och sex från omgång 5)

| Övning | Spelform | Mått (m) | `ytreferens.alla` | Tecken | Var |
|---|---|---|---|---|---|
| `kapplopning-med-boll` | 5 mot 5 | 18 × 5 | stora planens målområde | 23 | main |
| `avslut-efter-kort-passning` | 5 mot 5 | 15 × 10 | ungefär en fjärdedel av stora planens straffområde | 50 | main |
| `dribbling-mot-tidspress` | 7 mot 7 | 15 × 10 | ungefär en fjärdedel av stora planens straffområde | 50 | main |
| `slalomdribbling-mot-forsvarare` | 7 mot 7 | 15 × 10 | ungefär en fjärdedel av stora planens straffområde | 50 | main |
| `tva-mot-ett-till-mal` | 7 mot 7 | 15 × 10 | ungefär en fjärdedel av stora planens straffområde | 50 | main |
| `dribbling-genom-portar` | 5 mot 5 | 18 × 12 | stora planens målområde, dubbelt så djupt | 41 | main |
| `en-mot-en-med-joker-till-mal` | 5 mot 5 | 18 × 12 | stora planens målområde, dubbelt så djupt | 41 | main |
| `litet-spel-till-smamal` | 5 mot 5 | 18 × 12 | stora planens målområde, dubbelt så djupt | 41 | main |
| `snabbt-avslut-i-smaspel` | 5 mot 5 | 18 × 12 | stora planens målområde, dubbelt så djupt | 41 | main |
| `avslut-efter-inspel` | 7 mot 7 | 18 × 12 | stora planens målområde, dubbelt så djupt | 41 | main |
| `tre-mot-en-till-mal` | 7 mot 7 | 18 × 12 | stora planens målområde, dubbelt så djupt | 41 | main |
| `dribbling-genom-portar-i-tempo` | 9 mot 9 | 18 × 14 | stora planens målområde, två och en halv gång så djupt | 54 | main |
| `forsvara-tillsammans` | 5 mot 5 | 20 × 14 | ungefär halva stora planens straffområde | 40 | main |
| `dribbling-genom-mittzonen` | 7 mot 7 | 20 × 14 | ungefär halva stora planens straffområde | 40 | main |
| `dribbling-i-eget-tempo` | 7 mot 7 | 20 × 15 | ungefär halva stora planens straffområde | 40 | main |
| `hinderbana-med-boll` | 7 mot 7 | 20 × 15 | ungefär halva stora planens straffområde | 40 | main |
| `snabb-omstallning-tva-mot-en` | 7 mot 7 | 20 × 15 | ungefär halva stora planens straffområde | 40 | main |
| `fyra-horn-med-boll` | 5 mot 5 | 18 × 18 | en ruta som rymmer stora planens mittcirkel | 43 | main |
| `bollvaktslek` | 7 mot 7 | 18 × 18 | en ruta som rymmer stora planens mittcirkel | 43 | main |
| `langre-passningar-i-rorelse` | 9 mot 9 | 18 × 18 | en ruta som rymmer stora planens mittcirkel | 43 | main |
| `en-mot-en-till-tva-mal` | 7 mot 7 | 24 × 16 | halva stora planens straffområde, några steg bredare | 52 | main |
| `jonglera-och-boll-i-rorelse` | 7 mot 7 | 20 × 20 | en ruta något större än stora planens mittcirkel | 48 | main |
| `passningsrutor-med-langre-passningar` | 9 mot 9 | 20 × 20 | en ruta något större än stora planens mittcirkel | 48 | main |
| `rorelse-och-bollkansla-i-fart` | 9 mot 9 | 24 × 18 | ungefär två tredjedelar av stora planens straffområde | 53 | main |
| `bygg-upp-fran-malvakten` | 7 mot 7 | 25 × 18 | ungefär två tredjedelar av stora planens straffområde | 53 | main |
| `forsvara-zonen` | 7 mot 7 | 25 × 18 | ungefär två tredjedelar av stora planens straffområde | 53 | main |
| `overtal-i-forsvar` | 7 mot 7 | 25 × 18 | ungefär två tredjedelar av stora planens straffområde | 53 | main |
| `spela-ut-med-malvakten` | 5 mot 5 | 26 × 18 | ungefär två tredjedelar av stora planens straffområde | 53 | main |
| `reaktionskull-med-boll` | 7 mot 7 | 25 × 20 | ungefär tre fjärdedelar av stora planens straffområde | 53 | main |
| `matchspel-5mot5-med-malvakt` | 5 mot 5 | 28 × 18 | nästan en hel 5 mot 5-plan | 26 | main |
| `matchspel-med-snabb-omstallning` | 5 mot 5 | 28 × 18 | nästan en hel 5 mot 5-plan | 26 | main |
| `spela-ut-bakifran` | 7 mot 7 | 30 × 20 | ungefär stora planens straffområde | 34 | main |
| `tre-passningar-fore-skott` | 7 mot 7 | 30 × 20 | ungefär stora planens straffområde | 34 | main |
| `overtal-till-mal-9mot9` | 9 mot 9 | 30 × 20 | ungefär stora planens straffområde | 34 | main |
| `matchspel-7mot7-litet-format` | 7 mot 7 | 32 × 20 | ungefär stora planens straffområde | 34 | main |
| `smaspel-till-mal-9mot9` | 9 mot 9 | 32 × 20 | ungefär stora planens straffområde | 34 | main |
| `omstallningsspel-9mot9` | 9 mot 9 | 36 × 22 | stora planens straffområde, lite smalare men sex steg djupare | 61 | main |
| `omstallning-med-jokrar` | 7 mot 7 | 35 × 25 | ungefär halva 7 mot 7-planen | 28 | main |
| `uppspel-bakom-forsvarslinjen` | 9 mot 9 | 40 × 26 | lika lång som stora planens straffområde är brett | 49 | main |
| `forsvara-med-offsidefalla` | 9 mot 9 | 42 × 28 | något längre än stora planens straffområde är brett | 51 | main |
| `hornor-med-nickar` | 9 mot 9 | 30 × 45 | stora planens straffområde, nästan dubbelt så djupt | 51 | main |
| `smaspel-med-fasta-situationer-9mot9` | 9 mot 9 | 45 × 30 | nästan en hel 7 mot 7-plan | 26 | main |
| `malvaktsspel-i-smaspel` | 7 mot 7 | 50 × 30 | hela 7 mot 7-planen, ungefär en fjärdedel av stora planen | 57 | main |
| `smaspel-fasta-situationer` | 7 mot 7 | 50 × 30 | hela 7 mot 7-planen, ungefär en fjärdedel av stora planen | 57 | main |
| `matchspel-7mot7-brett` | 7 mot 7 | 50 × 30 | hela 7 mot 7-planen, ungefär en fjärdedel av stora planen | 57 | main |
| `matchspel-9mot9-brett` | 9 mot 9 | 65 × 50 | hela 9 mot 9-planen, ungefär halva stora planen | 47 | main |
| `avslut-efter-passning-mot-malvakt` | 7, 9 och 11 mot 11 | 18 × 14 | stora planens målområde, två och en halv gång så djupt | 54 | omgang/5-paket-b |
| `passningar-i-rorelse-13-19` | 7, 9 och 11 mot 11 | 20 × 20 | en ruta något större än stora planens mittcirkel | 48 | omgang/5-paket-b |
| `smalagsspel-till-mal-13-19` | 7, 9 och 11 mot 11 | 36 × 20 | ungefär stora planens straffområde | 34 | omgang/5-paket-b |
| `omstallning-i-overlage-till-mal` | 7, 9 och 11 mot 11 | 36 × 25 | ungefär halva 7 mot 7-planen | 28 | omgang/5-paket-b |
| `spela-framat-i-positionsspel` | 9 och 11 mot 11 | 42 × 28 | något längre än stora planens straffområde är brett | 51 | omgang/5-paket-b |
| `storre-spel-6mot6-till-11mot11` | 9 och 11 mot 11 | 65 × 50 | hela 9 mot 9-planen, ungefär halva stora planen | 47 | omgang/5-paket-b |

*Tillägg 2026-10-06, omgång 5 paket B:* de sex sista raderna gäller övningar med flera spelformer. Alla har nyckeln `alla`, eftersom referensen håller för varje spelform de är märkta med (avsnitt 3.4). `omstallning-i-overlage-till-mal` jämförs med en 7 mot 7-plan också för 9 mot 9- och 11 mot 11-lag, på samma sätt som `omstallning-med-jokrar`. Det är en storleksjämförelse och pekar inte ut någon plats (konvention 2).

### 6.2 Utan referens (12 övningar, och en från omgång 5)

| Övning | Spelform | Mått (m) | Kategori (avsnitt 4) | Var |
|---|---|---|---|---|
| `malvaktstraning-grunder` | 5 mot 5 | 6 × 5 | Station, fasta positioner. Målvaktens grundteknik tar den plats den tar och ska inte spridas ut | main |
| `driva-forbi-i-par` | 5 mot 5 | 6 × 6 | För liten. Portarna är dessutom måttkritiska | main |
| `triangelpass-med-rorelse` | 5 mot 5 | 8 × 8 | Ingen plandel med rätt form | main |
| `en-mot-en-till-mal` | 5 mot 5 | 10 × 8 | Duell med startavstånd | main |
| `en-mot-en-till-smamal` | 7 mot 7 | 12 × 8 | För liten eller ingen plandel med rätt form. Övningen har inga bestämda startavstånd, båda spelarna rör sig fritt mellan två mål | main |
| `passningsruta-i-rorelse` | 7 mot 7 | 10 × 10 | För liten eller ingen plandel med rätt form. Spelarna rör sig fritt i rutan, så det är inte fasta positioner | main |
| `tva-touch-i-triangel` | 7 mot 7 | 10 × 10 | Fasta positioner. Tre spelare står i hörnen av en triangel, och avståndet mellan dem är det som övas | main |
| `knakontroll-uppvarmning` | 7 mot 7 | 12 × 10 | Station. Det som styr är avståndet mellan arbetsplatserna | main |
| `rorelsebana-skadeforebyggande` | 5 mot 5 | 12 × 15 | Station. Samma skäl | main |
| `behall-bollen-i-gruppen` | 5 mot 5 | 14 × 12 | Positionsspel där måttet är golv och tak | main |
| `forsvara-i-overtal` | 9 mot 9 | 14 × 12 | Positionsspel där måttet är golv och tak. Övningen fälldes en gång när ytan blåstes upp, eftersom pressen inte nådde fram | main |
| `skadeforebyggande-9mot9` | 9 mot 9 | 14 × 12 | Station | main |
| `skadeforebyggande-uppvarmning-13-19` | 7, 9 och 11 mot 11 | 16 × 14 | Station. Avståndet mellan arbetsplatserna styr, och ytan följer undantag 3 | omgang/5-paket-b |

`en-mot-en-till-mal-13-19` (16 × 12, duell med startavstånd, ingen referens) förs in här när den är granskad.

### 6.3 Anmärkningar

- **18 × 12** är bankens bästa träff. Målområdets bredd är ytans långsida, så ledaren behöver bara fördubbla djupet. Ingen av övningarna med det måttet är i dag en 9 mot 9-övning, så alternativet *ert eget straffområde* (avsnitt 3.4) används inte ännu.
- **15 × 10.** En fjärdedel av stora planens straffområde har samma yta men är något längre, därför *ungefär*. För 7 mot 7-lagen vore *ert eget straffområde* 11 procent mindre och tydligt mer avlångt. Jag har valt stora planens straffområde för att formen stämmer bättre.
- **40 × 26 och 42 × 28, de två djupledsövningarna.** I en djupledsövning är längden det som styr, och den ska inte luckras upp av en ungefärlig parentes. Referensen jämför därför bara längden, med stora planens straffområdes bredd, som är en uppritad linje på drygt 40 meter. Ledaren kan lägga ytans längd längs straffområdeslinjen i stället för att stega. 40 meter är *lika lång*, 42 meter *något längre*. Bredden, 26 och 28 meter, står bara i metertalet. *Stora planens* är nödvändigt, eftersom ett 9 mot 9-lags eget straffområde bara är 24 meter brett.
- **20 × 20, `passningsrutor-med-langre-passningar`.** Övningen stod först utan referens, med kategorin fasta positioner. Vid kontrollen mot filen visade det sig att spelarna rör sig fritt i rutan, så den får samma referens som `jonglera-och-boll-i-rorelse`.
- **28 × 18 för 5 mot 5.** *Nästan en hel 5 mot 5-plan* är vald framför *tre fjärdedelar av stora planens straffområde*, som är lika sant. Ett 8-årslags ledare vet exakt hur stor lagets matchplan är.
- **50 × 30 och 65 × 50** får både spelformens plan och stora planen. En klubb med en uppritad 7 mot 7-plan använder den. En klubb utan tar en fjärdedel av den stora.

## 7. Ändringslogg

### 7.1 Ändringar mot underlaget från 2026-09-24

Vid kontrollen inför det här dokumentet ändrade jag åtta formuleringar i mitt eget underlag, för sammanlagt 14 övningar. Ingen ändring påverkar någon övnings innehåll.

| Övning | Underlaget sa | Nu | Varför |
|---|---|---|---|
| `fyra-horn-med-boll`, `bollvaktslek`, `langre-passningar-i-rorelse` | en ruta som rymmer mittcirkeln | en ruta som rymmer stora planens mittcirkel | Konvention 1 gäller också mittcirkeln |
| `jonglera-och-boll-i-rorelse` | något större än mittcirkeln | en ruta något större än stora planens mittcirkel | Konvention 1, och *ruta* talar om formen: ytan är kvadratisk, inte rund |
| `spela-ut-med-malvakten` | straffområdets djup, två tredjedelar av dess bredd | stora planens straffområdes djup, två tredjedelar av bredden | Konvention 1 |
| `omstallningsspel-9mot9` | stora planens straffområde, några steg större åt varje håll | stora planens straffområde, lite smalare men sex steg djupare | Sakfel i underlaget. 36 meter är smalare än straffområdets 40, bara djupet är större |
| `uppspel-bakom-forsvarslinjen`, `forsvara-med-offsidefalla` | straffområdets bredd, från mållinjen till tio (tolv) steg utanför straffområdet | stora planens straffområdes bredd, från mållinjen till tio (tolv) steg utanför det | Konvention 1. Utan *stora planens* bygger ett 9 mot 9-lag 24 meter i stället för 40 |
| `hornor-med-nickar` | straffområdet och ytan strax utanför det | stora planens straffområde, nästan dubbelt så djupt | Konvention 1, och *strax utanför* underskattade djupet. Ytan går ungefär 13 meter utanför linjen |
| `smaspel-med-fasta-situationer-9mot9` | ungefär en 7 mot 7-plan | nästan en hel 7 mot 7-plan | Ytan är 10–30 procent mindre än en 7 mot 7-plan. *Ungefär* låg på gränsen till 20-procentsregeln, *nästan* säger vilket håll avvikelsen går |
| `malvaktsspel-i-smaspel`, `smaspel-fasta-situationer`, `matchspel-7mot7-brett`, `matchspel-9mot9-brett` | alltså en fjärdedel (halva) av stora planen | ungefär en fjärdedel (halva) av stora planen | Stämmer bara ungefär, 10–12 procent under |

Följden för ADR 0017: där står att den längsta färdiga formuleringen är 73 tecken. Efter ändringarna var den längsta 76. Taket på 90 höll. Efter ändringarna i 7.2 är den längsta 61 tecken.

### 7.2 Användarens beslut 2026-09-28

När de 16 övningarna i omgång 4 hade kommit in i main kontrollerade jag hela facit mot filerna och granskade varje övning. Användaren beslutade 2026-09-28 om det som kom fram. Inget beslut ändrar någon övnings innehåll, bara referensen eller skälet till att den saknas.

| Övning | Förut | Nu | Varför |
|---|---|---|---|
| `uppspel-bakom-forsvarslinjen` | stora planens straffområdes bredd, från mållinjen till tio steg utanför det | lika lång som stora planens straffområde är brett | Den gamla texten pekade ut en plats och var 75 tecken. Den nya jämför bara längden, som är det som styr i övningen. Ny konstruktion i avsnitt 3.2 |
| `forsvara-med-offsidefalla` | stora planens straffområdes bredd, från mållinjen till tolv steg utanför det | något längre än stora planens straffområde är brett | Samma skäl. 42 meter är något längre än 40 |
| `passningsrutor-med-langre-passningar` | ingen, fasta positioner | en ruta något större än stora planens mittcirkel | Spelarna rör sig fritt i rutan, så kategorin var fel. Flyttad från 6.2 till 6.1 |
| `langre-passningar-i-rorelse` | en ruta som rymmer stora planens mittcirkel | oförändrad | Övningen har fasta positioner, men jämförelsen är exakt. Avsnitt 4 har fått en mening om när fasta positioner får en referens |
| `spela-ut-med-malvakten` | stora planens straffområdes djup, två tredjedelar av bredden | ungefär två tredjedelar av stora planens straffområde | Samma form som i trappan i avsnitt 3.1. Undantaget i konvention 2 behövs inte längre och är struket |
| `hornor-med-nickar` | stora planens straffområde, nästan dubbelt så djupt | oförändrad | Användaren valde bort tillägget *några steg bredare*. Texten är redan ren storlek, så den ryms i konvention 2 utan undantag |
| `en-mot-en-till-smamal` | ingen, duell med startavstånd | ingen, för liten eller ingen plandel med rätt form | Övningen har inga bestämda startavstånd. Kategorin rättad så att den stämmer med granskningskommentaren |
| `passningsruta-i-rorelse` | ingen, fasta positioner | ingen, för liten eller ingen plandel med rätt form | Spelarna rör sig fritt. Kategorin rättad så att den stämmer med granskningskommentaren |

Exemplet i avsnitt 4 om att referensen inte kan räknas fram ur måttet byggde på att `jonglera-och-boll-i-rorelse` och `passningsrutor-med-langre-passningar` behandlades olika. Nu har de samma referens, så exemplet är utbytt.

## 8. Källor

| Källa | Använd för | Hämtad |
|---|---|---|
| SvFF, *Regler 5 mot 5*, i Östergötlands FF:s spelarutbildningsplan, https://sup.ostergotlandsfotbollforbund.se/spelformer/5-mot-5/regler-5-mot-5/ | Att straffområde inte markeras i 5 mot 5, och att mittlinjen markeras med linje eller koner | 2026-09-24 |
| SvFF, *Regler 7 mot 7*, samma källa, https://sup.ostergotlandsfotbollforbund.se/spelformer/7-mot-7/regler-7-mot-7/ | Straffområdet, straffpunkten, retreatlinjen, att ytan kan avgränsas med linjer eller koner | 2026-09-24 |
| *Spelregler 9 mot 9*, Kristianstad FC:s domarsida, https://www.svenskalag.se/kristianstadfc-domare/sida/64622/spelregler-9-mot-9 | Straffområdet 24 × 9 och att det kan konmarkeras, straffpunkten, att mittcirkel och målområde inte nämns | 2026-09-24 |
| SvFF, *Spelregler och planmått för fotbollens nationella spelformer*, https://aktiva.svenskfotboll.se/tranare/spelformer/spelregler/ | Att SvFF har ett dokument om hur spelformerna ryms på en 11 mot 11-yta | 2026-09-24 |
| `docs/doman/spelformer.md` | Planmått och målstorlekar per spelform | 2026-09-28 |
| `content/ovningar/` på grenen `feature/ytreferens` | Mått och spelform för de 42 övningarna från omgång 1–3. Kontrollerade mot filerna | 2026-09-28 |
| `content/ovningar/` på grenen `innehall/ytreferenser`, som utgår från main | Mått och spelform för de 16 övningarna från omgång 4, som nu finns i main. Kontrollerade mot filerna | 2026-09-28 |
| Fotbollsexpertens underlag om ytreferenser | Utgångspunkten för ändringarna i avsnitt 7.1 | 2026-09-24 |

**Inte läst i original:** SvFF:s planstorleksdokument och spelformsbladen är bilddokument som jag inte kunnat läsa som text. Uppgifterna ovan kommer från distriktsförbunds och klubbars återgivningar av samma regler, och de stämmer med `spelformer.md` där de överlappar. Måtten för 11 mot 11-planens straffområde, målområde och mittcirkel är fotbollens allmänna spelregelmått.

Inget i dokumentet är kopierat ur SvFF:s material utöver de korta regelcitaten i avsnitt 1, som är markerade som citat.
