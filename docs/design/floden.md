Status: godkänd (K2, 2026-09-12)

# Användarflöden – Fotbollsbanken

Det här dokumentet beskriver de skärmflöden som täcker användarberättelserna 01-27 i `docs/krav/backlog.md`. Varje steg hänvisar till berättelsens nummer, till exempel (01). Wireframes för varje vy finns i `skisser/`.

Ledarens arbete sker i **två skilda lägen** som aldrig blandas i samma skärm:

- **Planeringsläget** – hemma i soffan eller på väg till planen. Vanlig skärm, vanlig text, tid att läsa och tänka.
- **Genomförandeläget (planläget)** – på planen, med boll och barn runt sig. Stor text, hög kontrast, en övning i taget, skärmen släcks aldrig.

Alla flöden nedan förutsätter inloggning (08), utom själva inloggningsflödet.

---

## 0. Inloggning och konto (alla roller)

**Vy:** `skisser/14-inloggning.md`

Inloggning sker med en engångskod via e-post, utan lösenord (`docs/adr/0004-inloggning.md`). Det finns ingen "Glömt lösenord?"-länk, eftersom det inte finns något lösenord.

1. Ny person öppnar appen, väljer "Skapa konto", anger namn och e-post, bekräftar en CAPTCHA-ruta och trycker "Skicka kod" (08.1, 08.5).
2. Personen loggar in genom att ange e-post, bekräfta CAPTCHA-rutan och trycka "Skicka kod" (08.2). Appen svarar likadant oavsett om adressen har ett konto eller inte: "Om adressen finns hos oss har vi skickat en kod" (S-13). Kodsteget visar en lugn upplysning om att även titta i skräpposten, eftersom appen inte har en egen avsändardomän i version 1.
3. Personen skriver in koden (8 siffror, användarens beslut 2026-10-13; 6 siffror är struket av säkerhetsskäl, S-40). Fel kod ger ett tydligt felmeddelande utan att avslöja om adressen har ett konto, ingen inloggning sker (08.3). En ny kod kan begäras tidigast efter en väntetid (60 sekunder). För många felaktiga försök gör koden ogiltig och kräver en ny. Går den automatiska kontrollen (Turnstile) inte att ladda får personen ett besked och en knapp för att försöka igen (08.9).
4. Utloggning, i menyn, kräver ny inloggning för att se sparade pass eller klubbens material (08.4) och rensar enhetens lokala kopia. "Logga ut på alla enheter" ligger i stället i *Mitt konto* (avsnitt 5) och är skild från den vanliga utloggningen (27.6).
5. En inbjuden ledare (11.1) kommer hit via en inbjudningslänk i sin e-post, med e-postfältet förifyllt och låst, skapar konto eller loggar in med kod, och kopplas automatiskt till laget hon eller han bjöds in till. Är länken utgången, återkallad, redan använd eller gäller en annan adress än den personen är inloggad med, visas vyn "Inbjudan fungerar inte" med en egen text för varje orsak, och ingen kopplas till något lag (11.4, 11.5).

Efter inloggning kommer ledaren till startsidan **Sparade pass** (`skisser/05-sparade-pass.md`; det som tidigare kallades "Mina pass" är nu första fliken i den vyn). En klubbadmin utan klubb kommer till "Skapa din klubb". Redaktören ser en extra menypunkt för redaktörskön om personen har den rollen. Hela navigeringen, med menyn i sidhuvudet och punkten *Mitt konto*, finns i `skisser/16-navigering.md`.

---

## 1. Ledare – Planeringsläget

### 1.1 Generera ett nytt pass (huvudflödet)

**Vyer:** `skisser/01-underlag.md`, `skisser/02-genererat-pass.md`, `skisser/03-inget-matchande-resultat.md`, `skisser/04-byt-ovning.md`

1. Ledaren väljer "Nytt pass" från startsidan.
2. **Underlag (01):** ledaren anger ålder. Appen föreslår spelform automatiskt (01.1). Ledaren kan byta till grannspelformen (01.2) men inte till någon annan. Ogiltig ålder blockerar och visar fel (01.3).
3. Ledaren väljer nivå, antal spelare, antal ledare, passlängd och 1–3 fokusområden ur en lista som bara visar de fokusområden som passar åldern (01.9). Yta är valfri (01.4, 01.12).
4. Fält som saknas eller är ogiltiga (antal spelare/ledare, passlängd, `nickspel` utan annat fokus) visas med tydliga fel utan att appen går vidare (01.5–01.8, 01.10).
5. Vid blandad ålder i gruppen informerar appen om att ange den vanligaste åldern (01.11).
6. Ledaren trycker "Generera pass".
   - **Om det går:** appen visar **genererat pass (02)** med alla fem delar, tider, tips vid behov (02.13) och säkerhetspåminnelser (02.15). En del som saknar övning visas tom med namn, måltid och texten att övning saknas (02.8, R-100), se `skisser/02-genererat-pass.md`.
   - **Om inget pass alls går att skapa:** appen visar **inget matchande resultat (03)**, se avsnitt 1.2 nedan.
7. Ledaren kan byta ut valfri övning i passet: se **byta övning (04)**, avsnitt 1.3 nedan.
8. Ledaren sparar passet: se avsnitt 1.4.

### 1.2 Inget matchande resultat (03)

**Vy:** `skisser/03-inget-matchande-resultat.md`

1. Om ingen av delarna Öva, Spelövning eller Spel kunde fyllas visar appen ett tydligt meddelande i stället för ett pass (03.1).
2. Appen pekar ut vilka av ledarens val (nivå, fokus, antal spelare, antal ledare, spelform, yta) som var för sig skulle kunna lösa det, utan att säga vilket nytt värde som är rätt (03.2).
3. Om en del i och för sig går att fylla men inte ihop med resten av passet, visar appen i stället att delens övningar inte gick att kombinera med resten av passet, utan att peka ut ett enskilt val (03.2, andra stycket).
4. Ledaren ändrar ett eller flera värden i underlaget (utan att börja om) och trycker "Försök igen" (03.3). Appen ändrar aldrig ledarens val själv.
5. Om minst en del av Öva/Spelövning/Spel kan fyllas visas i stället passet, med de tomma delarna markerade (03.4) – detta är alltså genererat pass (02), inte denna vy.

### 1.3 Byta ut en övning (04)

**Vy:** `skisser/04-byt-ovning.md`

1. Från genererat pass, sparat pass eller planläget väljer ledaren "Byt övning" på en övning X.
2. Appen visar alternativ i två grupper: övningar ur den gemensamma banken och klubbens egna övningar, filtrerade enligt R-104/R-106 (samma del, samma fokus-krav, plats för samma antal spelare/ledare, inte redan i passet) (04.1).
3. Klubbens egna övningar som saknar nödvändiga uppgifter, eller som bryter mot säkerhetsreglerna, visas inte som alternativ (04.1, R-106).
4. Ledaren väljer en ersättning. Passet uppdateras direkt, den nya övningen får den tid som ligger närmast originalets (04.2). Uppdaterad total tid visas (04.5).
5. Finns inget alternativ meddelar appen det, och originalövningen ligger kvar (04.3).
6. Ledaren kan byta ut fler övningar innan hon eller han sparar (04.4).

### 1.4 Spara ett pass (05) och dela inom laget (12)

**Vy:** del av `skisser/02-genererat-pass.md` (spara-knapp) och `skisser/05-sparade-pass.md`

1. Ledaren trycker "Spara pass". Dialogen frågar efter ett namn och, om ledaren är med i något lag, vilket lag passet ska delas med (05.1, 12.1). Passet sparas med övningar, ordning, tider och underlaget.
2. Om ledaren inte anger namn, föreslår appen ett namn med datum, spelform och fokus (05.3). Under namnfältet står att namnet inte ska innehålla namn på spelare (05.5).
3. **Ledaren väljer lag.** Lagvalet är förvalt till det lag ledaren senast sparade ett pass i, och valet "Inget lag, bara för mig" finns alltid (12.1, 12.2, 12.5). Ett pass hör till ett lag eller inget, aldrig flera. Arkiverade lag går inte att välja (12.7). Väljer ledaren ett lag blir passet synligt för lagets alla ledare. Väljer ledaren inget lag, eller har inget lag, är passet bara synligt för ledaren själv, inte heller för klubbadmin (12.2). *Rättat 2026-10-13: det här avsnittet sade tidigare att kopplingen var automatisk. Berättelse 12 kriterium 1 och skiss 05 gäller: ledaren väljer.*
4. Ledaren kan fortsätta genast med ett nytt pass eller andra uppgifter (05.4). Misslyckas sparandet (namnet för långt, 200 pass på ett dygn, inget nät) står det i dialogen, det ledaren skrivit ligger kvar och inget påstås vara sparat (05.10-05.12).
5. Ledaren öppnar "Sparade pass" och ser listan (05.2) med en flik för personliga pass och en för varje lag, inklusive lagets delade pass. Varje pass visar vem som sparade det: "Sparat av dig", "Sparat av {namn}", "Sparat av en tidigare ledare" eller "Sparat av Borttagen användare". Lämnar en ledare laget syns passen ändå för kvarvarande ledare, men inte längre för den som lämnat (12.3).
6. **Koppla ett personligt pass till ett lag i efterhand (12.6, Should).** I ett personligt pass väljer ledaren "Koppla till lag", väljer ett lag hon eller han är med i och bekräftar. Åtgärden är enkelriktad: passet kan inte flyttas till ett annat lag och inte göras personligt igen. Är ledaren inte med i något lag visas ingen knapp, bara en förklaring. Se `skisser/05-sparade-pass.md`.
7. **Ta bort ett pass (05.13, 12.8).** Ledaren väljer "Ta bort pass" och bekräftar. Är det ett lagpass kan vilken ledare som helst i laget ta bort det, och bekräftelsen säger att det försvinner för alla i laget. Passet rensas helt efter 90 dagar (berättelse 29).
8. **Ett pass som inte klarar slutkontrollen (05.7).** Öppnar ledaren ett lagrat pass som inte klarar säkerhetsreglerna visas inte passet. Ledaren får ett begripligt besked, planläge och utskrift är avstängda för det passet, och hon eller han kan skapa ett nytt pass eller ta bort det.

### 1.5 Visa planskisser (06, 07)

Ingen egen vy – planskisser visas inbäddade i genererat pass, sparat pass, byt övning och planläget. En övning utan skissdata visas ändå med sin text och en tydlig markering "Planskiss saknas" (06.2, 07.2). Se `designsystem.md` för storlek och placering.

### 1.6 Egna övningar och redaktörskö (13–18)

**Vyer:** `skisser/10-skapa-egen-ovning.md`, `skisser/11-hantera-egna-ovningar.md`, `skisser/12-redaktorsko.md`

**Skapa egen övning (13):**
1. Ledaren väljer "Skapa egen övning" och fyller i samma fält som en bankövning (13.1).
2. Saknas obligatoriska fält för att övningen ska kunna bytas in i ett pass, sparas den ändå, med markeringen "Ofullständig", men appen visar tydligt vilka fält som saknas och att övningen inte kan användas i ett pass förrän de är ifyllda (13.2). En egen övning har ingen granskningsstatus – den är antingen "Ofullständig" eller "Klar att använda" (`docs/adr/0010-ovningsformat-och-lagring.md`, avsnitt 4).
3. Version 1 har ingen ritredigerare för planskisser. En egen övning saknar planskiss och visas med "Planskiss saknas", precis som en bankövning utan skiss (13.3, jämför 06.2). En egen ritredigerare är inte en del av version 1.

**Hantera klubbens egna övningar (14):**
1. Ledaren öppnar "Klubbens övningar" och ser alla övningar som klubbens ledare skapat (14.1).
2. Ledaren redigerar en övning; ändringen syns för alla i klubben (14.2).
3. Ledaren tar bort en övning; den försvinner ur listan men befintliga pass som redan använder den påverkas inte (14.3).
4. En övning som väntar på granskning i den gemensamma banken kan inte redigeras eller tas bort utan en varning om att den är under granskning (14.4).

**Skicka in en övning (15):**
1. Från en egen övning med alla obligatoriska fält väljer ledaren "Skicka in till banken". Övningen får status `inskickad` i redaktörskön (15.1).
2. Saknas obligatoriska fält hindras insändningen och appen visar vad som saknas (15.2).
3. Ledaren ser status (inskickad, väntar, godkänd, åtgärda) i sin egen lista (15.3).
4. Försöker ledaren skicka in samma övning igen informeras hon eller han om att den redan är inskickad (15.4).

**Redaktören granskar (16), utser redaktörer (18):** se avsnitt 3 (Redaktör).

**Åtgärda och skicka in igen (17):**
1. Ledaren öppnar en övning med status `atgarda` och ser redaktörens kommentar (17.1).
2. Ledaren ändrar övningen och skickar in igen; status blir `inskickad` och övningen går till kön igen (17.2).
3. Ledaren kan se alla tidigare kommentarer i övningens historik, inte bara den senaste (17.3).

### 1.7 Säsongsplanering (23–25)

**Vyer:** `skisser/08-sasongsplan-vecka.md`, `skisser/09-sasongsplan-oversikt.md`

**Skapa säsongsplan (23):**
1. Ledaren, kopplad till ett lag, väljer "Ny säsongsplan", anger start- och slutdatum. Appen delar upp perioden i veckor (23.1).
2. Finns redan en plan för laget informeras ledaren om den, i stället för att den skrivs över (23.2).
3. Planen är gemensam för alla ledare i laget (23.3).

**Lägga pass i planen (24):**
1. Ledaren kopplar ett sparat eller nygenererat pass till en vecka (24.1). Flera pass samma vecka visas alla på veckan.
2. Veckans fokus visas som alla valda fokusområden för veckans pass, utan dubletter, i den ordning de först förekom (24.2, R-110).
3. Ledaren kan byta ut vilket pass som ligger på en vecka utan att andra veckor påverkas (24.3).
4. Passerar planen ett årsskifte visar appen att veckans ålder är ett år högre, vilket styr ny generering för just den veckan – ett redan sparat pass behåller sin egen ålder (24.3).
5. Tom vecka visas tydligt som tom, inte som fel (24.4).
6. Kopplar ledaren ett pass vars ålder skiljer sig från veckans ålder varnar appen. Innehåller passet en övning märkt `nickspel` och veckans ålder är under 13 år varnar appen alltid (24.5).

**Se översikt (25):**
1. Ledaren öppnar översikten och ser alla veckor kronologiskt med sina teman/fokus (25.1).
2. Ledaren väljer en vecka för att se dess pass; har veckan flera pass väljer ledaren vilket (25.2).
3. På mobil kan ledaren bläddra genom en lång period utan att gränssnittet blir oanvändbart, till exempel genom att bläddra månad för månad eller blocka i perioder (25.3).

### 1.8 Skriva ut/exportera (22)

**Vy:** `skisser/07-utskrift.md`

1. Från ett sparat eller genererat pass väljer ledaren "Skriv ut / Ladda ner PDF". Dokumentet visar alla övningar i ordning med planskiss, syfte, beskrivning och tid (22.1).
2. En övning utan planskiss visas ändå med sin text, utan att hela dokumentet påverkas (22.2).
3. Dokumentet är läsbart i svartvit utskrift (22.3).
4. Export sker utan extra kostnad för ledaren (22.4).

---

## 2. Ledare – Genomförandeläget (planläget)

**Vy:** `skisser/06-planlage.md`

1. Ledaren öppnar ett sparat eller genererat pass och trycker "Starta planläge" (19.1). Passets övningar visas en i taget, i ordning, med planskiss och kort info.
2. Ledaren kan öppna full beskrivning, coachningspunkter och varianter utan att lämna planläget, till exempel via en utfällbar panel eller en egen undersida i samma läge (19.2).
3. Text och knappar är stora nog att läsas och tryckas utan att zooma (19.3).
4. Ledaren startar timern för övningen; den visar tydligt återstående tid (20.1). Vid nedräkningen till noll ges en tydlig signal, visuellt och med ljud/vibration om enheten stödjer det (20.2).
5. Ledaren kan förlänga eller pausa timern utan att det påverkar nästa övnings timer (20.3).
6. Ledaren går vidare manuellt innan tiden är slut; den pågående timern stoppas och nästa övnings timer är redo (20.4).
7. Ledaren navigerar med "Föregående"/"Nästa" (21.1). Är hon eller han på sista övningen och trycker "Nästa" informeras ledaren om att passet är slut (21.2). På första övningen gör "Föregående" ingenting oväntat, till exempel genom att knappen är inaktiv (21.3).

Planläget ändrar aldrig ordningen på övningarna – den ordningen sätts i planeringsläget (04, 21:Utanför).

---

## 3. Redaktör

**Vy:** `skisser/12-redaktorsko.md`

1. Redaktören öppnar redaktörskön och ser alla inskickade övningar med den information som behövs för att bedöma dem (16.1).
2. Redaktören godkänner en övning; den får status `godkand` och blir valbar för generatorn i alla klubbar (16.2).
3. Redaktören sätter i stället status `atgarda` med en kommentar; den ledare som skickade in övningen meddelas, med kommentaren synlig (16.3).
4. Ingen övning får status `godkand` utan att en människa aktivt godkänt den (16.4).
5. Redaktören kan utse en annan registrerad person till redaktör (18.1). Personen måste redan ha ett konto (18.2).
6. Redaktören kan återkalla någons redaktörsbehörighet; personen behåller sina övriga roller (18.3).

---

## 4. Klubbadmin

**Vy:** `skisser/13-klubbadmin-lag.md`

**Skapa klubb (09):**
1. En inloggad person utan klubb skapar en klubb med ett namn och blir dess klubbadmin (09.1).
2. Finns klubben redan informeras personen om att kontrollera det, i stället för att en dubblett skapas (09.2).
3. Klubbadmin ser bara sin egen klubbs lag, ledare och övningar (09.3).

**Hantera lag (10):**
1. Klubbadmin skapar ett lag med namn och ålder (spelform föreslås) (10.1).
2. Klubbadmin redigerar lagets uppgifter; ändringen gäller för alla kopplade till laget (10.2).
3. Klubbadmin arkiverar ett lag; appen varnar i förväg om laget har sparade pass kopplade till sig, med exakt antal, och säger att laget och dess pass rensas helt efter 24 månader (10.3, användarens beslut 2026-10-13). Ett arkiverat lag går inte att återställa i appen.
4. Lagets ålder sparas så att den följer kalenderåret: ett lag som skapas som 11-åringar 2026 visar 12 år under 2027 utan att någon ändrar något (10.6).
5. Bara klubbadmin ändrar lag. En ledare ser sitt lag skrivskyddat, och en klubbadmin som inte är ledare i laget ser laget, ledarna och antalet pass men kan inte öppna passen (10.7).

**Bjuda in ledare (11):**
1. Klubbadmin bjuder in en person via e-post till ett visst lag (11.1).
2. Personen accepterar och får tillgång bara till det laget, inte klubbens övriga lag (11.2).
3. Klubbadmin tar bort en ledares åtkomst till laget; ledaren behåller sitt konto och det som inte enbart hör till laget (11.3).
4. En inbjudan gäller i 14 dagar och kan återkallas. Är den utgången kan klubbadmin bjuda in igen. Klubbadmin kan i stället kopiera inbjudningslänken och skicka den själv (11.1, 11.4, 11.8). Klubben kan skicka högst 50 inbjudningsmejl per dygn (11.9).

**Utse ytterligare klubbadmin (09.4):**
1. Klubbadmin väljer "Gör till klubbadmin" på en ledare som redan är medlem i klubben och bekräftar. Personen får samma rättigheter som klubbadmin, utöver sina lag.
2. En person som bara är inbjuden, eller som inte finns i klubben, kan inte utses. Det är den här vägen en ensam klubbadmin använder för att utse en efterträdare innan hon eller han raderar sitt konto (avsnitt 5).

---

## 5. Mitt konto: logga ut på alla enheter och radera sitt konto (alla roller)

**Vy:** `skisser/15-radera-konto.md`, nås från menypunkten *Mitt konto* (`skisser/16-navigering.md`).

**Uppfyller:** berättelse 26 och 27. Grunden är säkerhetsgranskningens fynd S-10 (rätten till radering är ovillkorlig och ska gå att utföra i appen) och S-11 (det måste gå att avbryta åtkomsten från en borttappad enhet).

**Logga ut på alla enheter (27):**
1. Ledaren väljer "Logga ut på alla enheter" i *Mitt konto* och bekräftar i en kort dialog. Knappen är skild från den vanliga utloggningen i menyn (27.6).
2. Den här enheten loggas ut direkt och dess lokala kopia rensas (27.1). Personen kommer till inloggningen med en bekräftelse som är ärlig om fördröjningen: andra enheter loggas ut inom 15 minuter, och en enhet utan nät behåller sin sparade kopia tills den får kontakt igen (27.2, 27.4).
3. Saknas nät händer ingenting: personen är kvar inloggad och appen säger att ingen enhet har loggats ut (27.5).

**Radera mitt konto (26):**
1. Ledaren väljer "Radera mitt konto" i *Mitt konto*.
2. Appen kontrollerar spärrarna. Personen hindras och ser alla orsaker som gäller, med en knapp till rätt åtgärd där en finns, om hon eller han är: den enda klubbadminen i en klubb där andra medlemmar finns kvar (26.3, länk till "Gör till klubbadmin", 09.4), den enda redaktören (26.4) eller redaktörernas ägare (26.10). Det finns inget sätt att flytta ägarskapet i appen än, vilket vyn säger ärligt.
3. Appen visar tydligt vad som raderas (profil, personliga pass utan lagkoppling, medlemskap och inbjudningar) och vad som blir kvar avidentifierat (lagets delade pass, klubbens egna övningar och godkända bidrag till den gemensamma banken, med skaparen ersatt av "Borttagen användare"). De två listorna syns hela tiden.
4. **Är personen ensam medlem i en klubb** (alltså både enda klubbadmin och enda ledare) visas en tydlig förvarning överst: klubben, dess lag, lagens pass och klubbens egna övningar raderas tillsammans med kontot, och går inte att få tillbaka (26.9, användarens beslut 2026-10-13). Listan "Det här raderas" visar antal lag, pass och övningar, och knappen heter "Radera mitt konto och klubben".
5. Ledaren bekräftar genom att skriva **sitt eget namn** i en textruta, och har en sista tydlig varning om att raderingen inte går att ångra (26.6). *Rättat 2026-10-13: det här avsnittet sade tidigare "klubbens eller sitt eget namn", medan skiss 15 sade bara eget namn. Berättelse 26 kriterium 6 gäller: eget namn, alltid, även när klubben raderas. Varningsrutan och knappens text bär skillnaden.*
6. Misslyckas ett steg i raderingen visas ett besked och samma radering går att göra om utan dubbletter (26.11). Saknas nät raderas ingenting och appen säger det (26.12).
7. Efter radering loggas personen ut och kan inte längre logga in med samma e-postadress på det gamla kontot, utan får skapa ett nytt konto utan koppling till det gamla (26.8, 26.13).

---

## Beroendekarta mellan flöden

```
08 Inloggning
 ├─ 09 Skapa klubb ─ 10 Hantera lag ─ 11 Bjud in ledare ─ 12 Dela pass i lag
 │                                                          │
 ├─ 01 Underlag ─ 02 Generera pass ─┬─ 03 Inget resultat    │
 │                                   ├─ 04 Byt övning        │
 │                                   └─ 05 Spara pass ───────┘
 ├─ 06/07 Planskisser (inbäddat i pass, byte, planläge, utskrift)
 ├─ 13 Skapa egen övning ─ 14 Hantera egna ─ 15 Skicka in ─ 16 Granska (redaktör) ─ 17 Åtgärda
 │                                                          └─ 18 Utse redaktör
 ├─ 19 Starta planläge ─ 20 Timer ─ 21 Navigera
 ├─ 22 Skriv ut/PDF
 ├─ 23 Skapa säsongsplan ─ 24 Lägg pass i vecka ─ 25 Översikt
 ├─ 26 Radera sitt konto (kräver att en klubbadmin, som inte är ensam medlem, först utser en efterträdare, se 09.4)
 └─ 27 Logga ut på alla enheter (i samma vy som 26, Mitt konto)
```

## Konstaterade motsägelser och gränsfall att lösa vid K2

Inget av nedanstående ändrar krav på egen hand – de läggs fram som *Beslut som behövs* i uppdragsrapporten.

1. **Rollmodellen är inte slutgiltig.** `kravspec.md` säger uttryckligen att roll- och behörighetsmodellen beslutas vid K2. Flödena ovan bygger på tre roller (ledare, klubbadmin, redaktör) som kan kombineras på en person, i linje med kravspecen, men den tekniska behörighetsmodellen ägs av senior-systemutvecklare/säkerhetsagenten.
2. **Två olika "inget matchande"-meddelanden** (R-100 andra punkten och R-103) kräver att texterna skiljer tydligt mellan "byt ett av dessa val" och "gick inte att kombinera med resten av passet", annars uppfattar ledaren dem som samma fel. Löst i `texter.md` och `skisser/03-inget-matchande-resultat.md`.

## Rättade motsägelser inför inkrement 3 (2026-10-13)

Produktägaren hittade två motsägelser mellan det här dokumentet och skisserna, en tredje fann UX-designern. Alla tre är rättade i linje med acceptanskriterierna.

1. **Lagval vid sparande.** Avsnitt 1.4 sade att passet automatiskt gick till lagets pass, medan skiss 05 lät ledaren välja lag. Rättat i linje med berättelse 12 kriterium 1: ledaren väljer, förvalt till det senast använda laget, med valet "Inget lag, bara för mig".
2. **Bekräftelse vid radering.** Avsnitt 5 sade "klubbens eller sitt eget namn", medan skiss 15 sade bara eget namn. Rättat i linje med berättelse 26 kriterium 6: personens eget namn.
3. **Startsidans namn.** Avsnitt 0 kallade startsidan "Mina pass", vilket också är namnet på en flik i skiss 05. Startsidan heter nu "Sparade pass"; "Mina pass" är fliken för personliga pass.
