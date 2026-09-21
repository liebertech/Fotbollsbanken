Status: utkast (ändringar inför K4, 2026-09-21)

# 03. Inget matchande resultat

**Roll:** ledare

**Som** ledare **vill jag** få tydlig information när ingen övning matchar mina val, **så att** jag inte fastnar utan att förstå varför eller vad jag kan göra åt det.

## Acceptanskriterier

1. **Givet** att ingen av delarna `del-ovning`, `del-spelovning` och `del-spel` kan fyllas med en giltig övning (bland de delar som finns kvar efter att för korta delar tagits bort, se `docs/doman/passuppbyggnad.md`, och efter att fallbacken i kriterium 5 har prövats för varje del), **när** ledaren begär att generera passet, **då** skapas inget pass, och appen visar ett tydligt meddelande om att inget pass kunde skapas, i stället för ett tomt eller felaktigt pass (R-101). Ett pass där bara `del-spel` kunnat fyllas visas däremot, se kriterium 4.
2. **Givet** att inget pass kunde skapas, eller att en del saknar övning för att den inte gick att fylla för sig efter att fallbacken i kriterium 5 prövats, **då** pekar appen ut vilka av ledarens val (nivå, ett eller flera fokusområden, antal spelare, antal ledare, spelform och, om det är valt, yta) som var för sig skulle kunna ge ett giltigt pass eller en giltig del, utan att ange vilket nytt värde som skulle lösa det (R-103). Detta gäller även fokusområde: att fallbacken redan prövat ett eller flera närliggande fokusområden hindrar inte appen från att peka ut att ett annat, eget val av fokusområde också skulle kunna lösa det. **Givet** att en del i stället kan fyllas för sig men ändå saknar övning, för att den inte gick att kombinera med resten av passet (till exempel för att samma övning redan behövs i en annan del, för att nicktaket skulle överskridas eller för att passet skulle bli för långt), **då** pekar appen inte ut något enskilt val som orsak, utan visar i stället att delens övningar inte gick att kombinera med resten av passet (R-100, R-103).
3. **Givet** att inget pass kunde skapas, **när** ledaren ändrar ett av sina val och begär generering igen, **då** försöker appen på nytt utan att ledaren behöver fylla i hela underlaget från början. Appen ändrar aldrig ledarens val själv i underlaget (R-102). Den avgränsade fallbacken i kriterium 5 är ett undantag från att appen aldrig agerar utan att ledaren ber om det, men den ändrar inte det sparade underlaget, se kriterium 7.
4. **Givet** att det finns giltiga övningar för minst en av delarna `del-ovning`, `del-spelovning` och `del-spel`, men inte för alla delar som ska fyllas från banken enligt `docs/doman/passuppbyggnad.md`, **när** passet genereras, **då** visar appen passet med de delar som kunde fyllas, och varje del som saknar övning visas med sitt namn, sin måltid och texten att övning saknas, i stället för att tyst hoppa över delen (R-100).
5. **Givet** att ledaren har valt ett eller flera fokusområden, och en del (`del-uppvarmning`, `del-ovning`, `del-spelovning` eller `del-spel`) inte kan fyllas därför att ingen övning i banken som matchar övriga villkor (ålder, spelform, nivå, yta om vald, säkerhet) träffar något av de valda fokusområdena för just den delen, **när** passet genereras, **då** prövar appen automatiskt, innan delen räknas som att den saknar övning, om ett eller flera fokusområden som enligt den regel om närliggande fokusområden som fotbollsexperten lägger till i grupp 11 av `docs/doman/generatorregler.md` räknas som närliggande det ursprungligen valda fokusområdet ger en giltig övning för delen. **Då** fylls delen med en sådan övning, i stället för att visas som att övning saknas.

   *Exempel, mot bankens läge 2026-09-21:* för `7mot7` saknar `del-ovning` (Öva) övningar för `speluppbyggnad` och `omstallning`, och `del-spelovning` (Spelövning) saknar övningar för `ett-mot-ett` och `dribbling`. För `5mot5` saknar `del-spelovning` övningar för `avslut`, `ett-mot-ett` och `dribbling`. Båda spelformerna saknar övningar i kärnan (`del-ovning` och `del-spelovning`) för `lek` och `koordination`. Det gör dessa kombinationer lämpliga att testa fallbacken mot redan i dag, utan att vänta på fler övningar i banken.
6. **Givet** att fallbacken i kriterium 5 används för en del, **när** passet visas för ledaren, **då** framgår det tydligt av passet, vid den berörda delen, att ett annat fokusområde än det ledaren valde användes för just den delen, och varför (att det valda fokusområdet saknade en matchande övning för delen). Övningens egen fokusmärkning (namn, syfte, beskrivning) visas som vanligt (berättelse 02, kriterium 2). Exakt utformning av texten och var den visas avgörs av ux-designern. Ingen planskiss eller utskrift ingår i det här kriteriet (se berättelse 06–07 och 22).
7. **Givet** att fallbacken i kriterium 5 har använts för en eller flera delar, **då** ändras inte de fokusområden som ledaren valde i underlaget (R-102): ledarens val står kvar oförändrat om passet genereras igen eller om ledaren går tillbaka till underlagssteget. Fallbacken påverkar bara vilken övning som väljs till den berörda delen. Fallbacken gäller enbart fokusområde – för nivå, antal spelare, antal ledare, spelform, passlängd och yta gäller fortfarande att appen aldrig ändrar valet själv (R-102), utan bara pekar ut att ett annat värde skulle kunna hjälpa (kriterium 2).

## Beroenden

- 02 (generera ett träningspass).
- Kriterium 5–7 bygger på en ny generatorregel i grupp 11 av `docs/doman/generatorregler.md`, som fotbollsexperten skriver parallellt med detta dokument (beslut 2026-09-21). Regeln avgör vilka fokusområden som räknas som närliggande ett annat. Produktägaren tar inte själv ställning till vilka fokusområden som ligger nära varandra.

## Utanför denna berättelse

- Att appen ändrar andra delar av ledarens underlag än fokusområde för en enskild del, utan att ledaren själv gör ändringen (nivå, antal spelare, antal ledare, spelform, passlängd och yta ändras aldrig av appen, se kriterium 7).
- Att föreslå exakt vilket värde som skulle lösa problemet (till exempel "sänk antal spelare till 12") – appen pekar ut vilka fält som kan justeras, inte ett facit.
- Hur meddelandet om fallback eller om att en del saknar övning formuleras och visas grafiskt (ux-designerns ansvar) och hur det visas i en planskiss eller på en utskrift (inkrement 2 och 6).

## Ändringar efter K1

| Datum | Ändring |
|---|---|
| 2026-09-21 | Kriterium 5–7 tillagda. Beslut av användaren: när ett valt fokusområde gör en passdel tom ska generatorn inte ge upp, utan falla tillbaka på ett närliggande fokusområde och tala om för ledaren att den gjort det, och varför. Kriterium 1–3 fick smärre tillägg för att hänvisa till fallbacken. Vilka fokusområden som räknas som närliggande är en fotbollsfråga och avgörs av en ny regel i `docs/doman/generatorregler.md`, som fotbollsexperten skriver parallellt. |
