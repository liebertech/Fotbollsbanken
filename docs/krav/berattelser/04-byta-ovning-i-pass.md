Status: godkänd (K4 inkrement 2b, 2026-10-05)

# 04. Byta ut en övning i passet

**Roll:** ledare

**Som** ledare **vill jag** kunna byta ut en enskild övning i ett genererat pass mot en annan som passar samma plats i passet, **så att** jag kan anpassa passet efter mina egna önskemål utan att bygga om allt.

## Acceptanskriterier

1. **Givet** att ett genererat pass visas, **när** ledaren väljer att byta ut en övning X, **då** visar appen som alternativ de övningar ur den gemensamma banken som var för sig uppfyller: de uppfyller grundfiltret för övningar (bland annat ålder, spelform och att nivålistan innehåller den valda nivån), säkerhetsreglerna och, om ledaren har angett en yta, ytreglerna; de är märkta med samma del som X ligger i; de fungerar med momentets antal spelare och ledare (och, i ett stationsmoment, med stationens grupper, tid och ledare); och de finns inte redan någon annanstans i passet (R-104). Om delen är `del-ovning` eller `del-spelovning` ska alternativet dessutom träffa det fokus som faktiskt gäller för delen: ledarens valda fokus, eller – om delen fyllts med ett ersättningsfokus enligt R-121 (se berättelse 03, kriterium 5–7) – det ersättningsfokuset i stället (R-104, hänvisningen till R-121).
2. **Givet** att ledaren väljer en ersättningsövning bland alternativen, **när** bytet bekräftas, **då** ersätts övningen i passet, och den nya övningen får den tid inom sina egna gränser som ligger närmast den ursprungliga övningens tid (R-105).
3. **Givet** att det inte finns någon övning i den gemensamma banken som uppfyller kriterium 1 för delen, **när** ledaren försöker byta ut övningen, **då** informerar appen om att det saknas alternativ, och den ursprungliga övningen ligger kvar oförändrad (R-104).
4. **Givet** att ledaren har bytt ut en övning, **när** ledaren vill byta ut fler övningar i samma pass, **då** kan flera övningar bytas ut oberoende av varandra, utan att ett byte påverkar möjligheten att göra ett annat.
5. **Givet** att ett byte ändrar passets totala tid, **när** bytet är gjort, **då** visar appen den uppdaterade totaltiden så att ledaren ser eventuell avvikelse från den ursprungligt begärda passlängden, på samma sätt som vid generering (se berättelse 02, kriterium 8).
6. **Givet** att ledaren ser listan med alternativ vid byte, **då** visar varje alternativkort en planskiss i miniatyrformat för just den övningen, enligt `docs/design/designsystem.md` avsnitt 7 (raden "Byt övning"), med samma felhantering som berättelse 06 kriterium 2 och 3 ("Planskiss saknas" respektive "Planskissen kunde inte visas") när skissdata saknas eller inte går att validera. Hur ledaren väljer ett alternativ, i förhållande till att öppna en miniatyr i normal storlek (berättelse 06, kriterium 6), avgörs av ux-designern.

## Beroenden

- 02 (generera ett träningspass).
- 06 (visa planskiss för en övning), för att varje alternativ ska kunna visa en planskiss i miniatyrformat (kriterium 6). Det är skälet till att den här berättelsen byggs som ett eget inkrement 2b, efter planskisserna (inkrement 2) men före kontona (inkrement 3).
- 03 (inget matchande resultat), för ersättningsfokuset (R-121) som kriterium 1 hänvisar till.
- **Klubbens egna övningar som alternativ (R-106) byggs inte av den här berättelsen.** R-106 i `docs/doman/generatorregler.md` och kravspec – Beslut vid K1, punkt 4, beskriver att ledaren också ska kunna byta in en av klubbens egna övningar. Det förutsätter konton och klubbar (inkrement 3) och klubbens egna övningar (inkrement 4, berättelse 13–14), som inte finns när den här berättelsen byggs i inkrement 2b. Kriterium 1 och 3 ovan gäller därför bara alternativ ur den gemensamma banken i den här versionen av bygget. Regeln för hur en egen övning ska villkoras och visas (R-106) är redan fastställd och oförändrad; när kontona och inkrement 4 är byggda läggs ett nytt, eget kriterium till här som utökar kriterium 1 och 3 med klubbens egna övningar, i stället för att de nuvarande kriterierna ändras.

## Utanför denna berättelse

- Att lägga till en extra övning utöver det generatorn föreslagit, eller att ta bort en övning utan att ersätta den (se backlog, Could).
- Att ändra ordningen på övningarna i passet (se backlog, Could).
- Att spara ändringarna permanent (se berättelse 05, som hör till inkrement 3).
- Att klubbens egna övningar visas som alternativ vid byte – se Beroenden ovan.
- I vilken ordning alternativen listas, och hur gränssnittet låter ledaren välja mellan dem (ux-designerns ansvar). R-104 och R-106 avgör bara vilka övningar som får visas som alternativ, inte i vilken ordning eller hur listan ser ut.

## Ändringar efter K1

| Datum | Ändring |
|---|---|
| 2026-10-02 | Acceptanskriterierna skärpta inför bygget, som sker som ett eget inkrement 2b direkt efter planskisserna i stället för i inkrement 1, där berättelsen aldrig byggdes trots att K4 för inkrement 1 godkändes 2026-09-23 (kvalitetssäkrarens fynd, användarens beslut 2026-10-02, se backlog). Kriterium 1 avgränsat till alternativ ur den gemensamma banken, eftersom kontona och klubbens egna övningar (inkrement 3–4) ännu inte finns, och kompletterat med hur fokusträffen prövas i en del med ersättningsfokus (R-121). Kriterium 3 avgränsat på samma sätt. Kriterium 4 förtydligat. Nytt kriterium 6 tillagt om att varje alternativ visar en planskiss i miniatyrformat (berättelse 06). Beroendeavsnittet utökat med 06 och med en tydlig not om att klubbens egna övningar som alternativ hör till en senare utökning av den här berättelsen. "Utanför denna berättelse" utökat med en punkt om sortering och gränssnitt. |
