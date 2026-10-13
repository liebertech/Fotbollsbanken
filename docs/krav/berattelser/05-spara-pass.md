Status: skärpt inför inkrement 3 (2026-10-13), väntar på godkännande (K4 inkrement 3). Tidigare: ändrad vid K2 (2026-09-12); flyttad till inkrement 3 (2026-10-02)

# 05. Spara ett pass

**Roll:** ledare

**Som** ledare **vill jag** kunna spara ett genererat och eventuellt justerat träningspass, **så att** jag kan använda det igen senare, till exempel i planläget eller vid en liknande träning.

Markeringar nedan: **[Oförändrat]** är ett kriterium som redan är godkänt och som fortfarande stämmer. **[Skärpt]** och **[Ändrat]** är godkända kriterier som preciserats eller rättats 2026-10-13. **[Nytt]** är tillagt 2026-10-13. Se *Ändringar efter K2* sist.

## Acceptanskriterier

1. **[Skärpt]** **Givet** att ledaren är nöjd med ett genererat pass, **när** ledaren väljer att spara passet, **då** sparas allt som behövs för att öppna det igen utan att generera om: övningarna i ordning, varje moments tid, varje övnings innehåll som en ögonblicksbild (inklusive planskissdata, se berättelse 06, kriterium 9), passets totaltid och den längd ledaren bad om, påminnelser och tips som passet visade, och det underlag som användes (bara antal, aldrig spelaruppgifter). **Test:** spara ett pass, ladda om sidan, öppna det från listan. Passet visar samma övningar i samma ordning med samma minuter, samma totaltid, samma påminnelser och samma planskisser som när det sparades.
2. **[Oförändrat]** **Givet** att ett pass har sparats, **när** ledaren senare öppnar sin lista över sparade pass, **då** visas det sparade passet med de uppgifter det sparades med.
3. **[Oförändrat]** **Givet** att ledaren sparar ett pass utan att själv ange ett namn, **när** passet sparas, **då** får det ett namnförslag som gör det möjligt att känna igen det, till exempel med datum, spelform och fokusområde.
4. **[Oförändrat]** **Givet** att ledaren sparar ett pass, **när** sparandet är klart, **då** kan ledaren fortsätta använda appen (till exempel generera ett nytt pass) utan att det sparade passet påverkas.
5. **[Oförändrat]** **Givet** att ledaren skriver ett eget namn på passet i stället för att använda namnförslaget, **när** ledaren skriver, **då** upplyser appen om att namnet inte ska innehålla namn på spelare (säkerhetsgranskning K2, fynd S-20).
6. **[Nytt]** **Givet** att ledaren har bytt ut minst en övning i passet (berättelse 04), **när** passet sparas och senare öppnas, **då** är markeringen att passet har bytts ut sparad med passet, så att tidsmålen i R-035 och R-036 inte kontrolleras mot det öppnade passet, precis som innan det sparades (R-105). Markeringen får aldrig lyfta något annat än R-035 och R-036 (säkerhetsgranskningen av inkrement 2b, fynd F3). **Tester som ska finnas för det lagrade passet** (motsvarande tester för passet i minnet finns redan i `swap/swapped-flag.test.ts`): (a) ett sparat och öppnat pass med bytt övning är identiskt med originalet, (b) ett pass där byte gjorts flera gånger i rad sparas och öppnas oförändrat, (c) ett lagrat pass med markeringen satt men som bryter mot R-080, R-082 eller R-022 underkänns ändå av slutkontrollen när det har lästs tillbaka från databasen.
7. **[Nytt]** **Givet** att ett lagrat pass öppnas, **när** passet inte klarar slutkontrollen av säkerhetsreglerna (till exempel en övning som inte är godkänd, eller mer nickspel än åldern tillåter, om raden har ändrats utanför appen), **då** visar appen inte passet som ett vanligt pass. Ledaren får ett begripligt besked utan teknisk felutskrift, och planläget och utskriften går inte att starta för det passet. Appen kastar inget fel och sidan blir inte vit. **Beslut som behövs:** se rapporten, punkt 3.
8. **[Nytt]** **Givet** att ledaren öppnar ett lagrat pass, **när** passet visas, **då** visas det från den sparade ögonblicksbilden, aldrig från den aktuella banken (R-102: ett pass som redan finns genereras inte om). Om en övning senare har ändrats eller tagits ur banken, påverkas inte det sparade passet.
9. **[Nytt]** **Givet** att ledaren öppnar ett sparat pass och byter en övning och sparar igen, **när** sparandet är klart, **då** har det blivit ett nytt sparat pass med den nya markeringen om byte, och det ursprungliga passet är oförändrat (varje sparande skapar ett nytt pass).
10. **[Nytt]** **Givet** att ledaren skriver ett passnamn som är längre än 100 tecken, **när** ledaren försöker spara, **då** nekas sparandet med ett tydligt fel som säger den högsta längden, och inget pass skapas (databasen upprätthåller gränsen, inte bara formuläret, ADR 0003 princip 9).
11. **[Nytt]** **Givet** att ledaren redan har sparat 200 pass under det senaste dygnet, **när** ledaren försöker spara ett till, **då** nekas det med ett begripligt besked om att dygnsgränsen är nådd, och inget pass skapas (ADR 0003 princip 9, säkerhetsgranskning K2, S-08).
12. **[Nytt]** **Givet** att nätet saknas eller faller bort när ledaren sparar, **när** sparandet misslyckas, **då** säger appen att det kräver anslutning, det ledaren skrivit och passet ligger kvar, och inget påstås vara sparat (ADR 0005, `texter.md` avsnitt 15). **Givet** att samma sparande görs om efter ett avbrott där svaret försvann, **då** skapas inget dubblettpass (id:t skapas i klienten, ADR 0005 punkt 6).
13. **[Nytt]** **Givet** att ett pass är sparat, **när** ledaren väljer att ta bort det och bekräftar, **då** försvinner det ur ledarens listor (och, om det är ett lagpass, ur lagets lista för alla i laget, se berättelse 12). Borttagningen är mjuk och passet rensas hårt efter 90 dagar (berättelse 29). Utan en väg att ta bort ett pass går det inte att rätta ett namn eller en text där ett spelarnamn råkat hamna (säkerhetsgranskning K2, S-19, S-20).
14. **[Nytt, Should]** **Givet** att ett genererat pass ännu inte har sparats, **när** ledaren stänger webbläsaren eller appen och öppnar den igen på samma enhet och med samma konto, **då** finns det osparade passet kvar (ADR 0005 punkt 2). Det visas aldrig för en annan inloggad person på samma enhet (berättelse 08, kriterium 10).

## Beroenden

**Hör till inkrement 3, konton med klubbar och lag.** Berättelsen stod tidigare som Must i inkrement 1, men byggdes aldrig där trots att K4 för inkrement 1 godkändes 2026-09-23 (kvalitetssäkrarens fynd). Användaren beslutade 2026-10-02 att flytta den till inkrement 3, eftersom att spara ett pass kräver ett konto att spara det på och en databas att spara det i (se `docs/adr/`), som båda byggs i inkrement 3. Se backlog.

Beroende på kontona (berättelse 08, registrera konto och logga in) för att det ska finnas en ledare att knyta det sparade passet till. Att koppla ett sparat pass till ett lag och dela det med andra ledare byggs i samma inkrement (se berättelse 12) – fram till det är klart kan ett sparat pass vara knutet enbart till den ledare som skapade det.

Berättelse 06, kriterium 9 (ögonblicksbilden av planskissen) gäller från och med att den här berättelsen är byggd.

Berättelse 28 (databasens skydd och gränser) och 29 (rensning) gäller de tabeller och rensningar som den här berättelsen skapar.

## Utanför denna berättelse

- Att dela passet med andra ledare (se berättelse 12).
- Versionshantering av samma pass (till exempel att välja mellan att skriva över eller spara som nytt) – i version 1 skapar varje sparande ett nytt sparat pass.
- Att koppla passet till en säsongsplan (se berättelse 24).
- Att byta namn på ett sparat pass (Could i backloggen). Borttagning ingår, se kriterium 13.
- Att läsa sparade pass utan nät, och planläget utan nät. Cachen och dess rensning vid utloggning byggs i det här inkrementet (berättelse 08, kriterium 10), men testerna för att öppna sparade pass och köra planläget utan nät hör enligt ADR 0005 till inkrement 5.

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-10-13 | Skärpt inför inkrement 3. Kriterium 1 preciserat med exakt vad som sparas och ett test. Nya kriterier 6–9 om att markeringen för bytta övningar sparas med passet och inte kan lyfta säkerhetsreglerna (säkerhetsgranskning 2b, F3), om slutkontroll av lagrade pass, om ögonblicksbilden och om att spara om ett ändrat pass som ett nytt. Nya kriterier 10–11 om gränserna i databasen (ADR 0003 princip 9), kriterium 12 om att sparande kräver nät (ADR 0005), kriterium 13 om att ta bort ett pass (S-19) och kriterium 14 (Should) om att ett osparat pass överlever en omstart. Kriterium 1–5 från K2 är i sak oförändrade. |
