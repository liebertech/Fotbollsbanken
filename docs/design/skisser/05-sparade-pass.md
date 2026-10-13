Status: godkänd (K2, 2026-09-12)

# Vy: Spara pass, Sparade pass, ett sparat pass och dess hantering

**Uppfyller:** berättelse 05 (spara ett pass, ta bort ett pass, spärrat pass), 12 (dela sparat pass inom laget, koppla ett personligt pass till ett lag i efterhand).

**Läge:** Planeringsläget.

**Startsida:** "Sparade pass" är appens startsida efter inloggning (`16-navigering.md`). Det som tidigare i `floden.md` kallades "Mina pass" är alltså den här vyn, och "Mina pass" är namnet på den första fliken i den.

## Wireframe, 360 px – Namnge och spara (dialog/steg), ledare med lag

Lagvalet är ett val som ledaren gör, förvalt till det lag hon eller han senast sparade ett pass i (berättelse 12, kriterium 1). Det är inte automatiskt: `floden.md` avsnitt 1.4 sade tidigare det motsatta och är rättat 2026-10-13. Valet "Inget lag, bara för mig" finns alltid (12.2).

```
┌────────────────────────────────┐
│ ✕ Spara pass                   │
│                                 │
│ Namn på passet                 │
│ ┌───────────────────────────┐  │
│ │ 11 år · 7 mot 7 ·          │  │  ← förifyllt namnförslag,
│ │ Passning 24 sep            │  │    redigerbart
│ └───────────────────────────┘  │
│ Skriv inga namn på spelare.     │
│                                 │
│ Lag                            │
│ ┌───────────────────────────┐  │
│ │ P11 Blå ▾                  │  │  ← förvalt: senast använda lag
│ └───────────────────────────┘  │     Alternativ: lagen + "Inget lag,
│ Delas med alla ledare i P11 Blå │     bara för mig"
│                                 │
│ ┌───────────────────────────┐  │
│ │        Spara pass          │  │  ← 48 px
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

Hjälptexten under lagvalet byter med valet: "Delas med alla ledare i {lagnamn}." eller "Sparas bara för dig, tills du kopplar det till ett lag."

## Wireframe, 360 px – Spara pass, ledare utan lag

Finns inget lag att välja visas inget lagfält, bara texten. Passet blir personligt (12.2).

```
┌────────────────────────────────┐
│ ✕ Spara pass                   │
│                                 │
│ Namn på passet                 │
│ ┌───────────────────────────┐  │
│ │ 11 år · 7 mot 7 ·          │  │
│ │ Passning 24 sep            │  │
│ └───────────────────────────┘  │
│ Skriv inga namn på spelare.     │
│                                 │
│ Sparas bara för dig, tills du   │
│ kopplar det till ett lag.       │
│                                 │
│ ┌───────────────────────────┐  │
│ │        Spara pass          │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Spara misslyckas (05.10, 05.11, 05.12)

Fel visas i dialogen, ovanför knappen, med `role="alert"`. Det ledaren skrivit ligger kvar och dialogen stängs inte.

```
Namn för långt (över 100)     Dygnsgränsen nådd           Nät saknas
┌──────────────────────┐    ┌──────────────────────┐   ┌──────────────────────┐
│ Namn på passet        │    │ ⛔ Du har sparat 200 │   │ ⛔ Du verkar sakna   │
│ [ … lång text …     ] │    │ pass det senaste     │   │ internetanslutning.  │
│ ⛔ Namnet får vara    │    │ dygnet, vilket är    │   │ Passet har inte      │
│ högst 100 tecken.     │    │ gränsen. Försök igen │   │ sparats. Det ligger  │
│ Du har skrivit 112.   │    │ senare.              │   │ kvar här – försök    │
│                       │    │                      │   │ igen när du är       │
│ [Spara pass]          │    │ [Spara pass]         │   │ uppkopplad.          │
└──────────────────────┘    └──────────────────────┘   └──────────────────────┘
```

## Wireframe, 360 px – Sparade pass (lista)

```
┌────────────────────────────────┐
│ Sparade pass                    │
│                                 │
│ ┌───────────────────────────┐  │
│ │      + Nytt pass           │  │  ← primärknapp, 56 px
│ └───────────────────────────┘  │
│                                 │
│ ┌─────────┬──────────────────┐ │
│ │ Mina pass│ P11 Blå          │ │  ← en flik per lag ledaren är med i
│ └─────────┴──────────────────┘ │
│                                 │
│ ┌───────────────────────────┐  │
│ │ 11 år · 7 mot 7 ·          │  │
│ │ Passning 24 sep             │  │
│ │ 58 min · Sparat av dig      │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ 11 år · 7 mot 7 · Avslut    │  │
│ │ 17 sep                      │  │
│ │ 60 min · Sparat av Björn    │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ 11 år · 7 mot 7 · Spel      │  │
│ │ 3 sep                       │  │
│ │ 60 min · Sparat av en       │  │
│ │ tidigare ledare             │  │
│ └───────────────────────────┘  │
│                                 │
│ (Skrollbar lista, senaste       │
│  överst)                        │
└────────────────────────────────┘
```

- **"+ Nytt pass"** ligger som en full knapp överst i listan och inte i sidhuvudet, där träffytan skulle bli för liten (6.10: inga kontroller under 48 px i bandet). Den är den vanligaste handlingen på startsidan.
- **Flikarna:** "Mina pass" visar ledarens personliga pass, utan lagkoppling. Varje lag ledaren är med i har en egen flik med lagets namn. Har ledaren inget lag visas inga flikar, bara listan.
- **"Sparat av"-raden har fyra former**, och bara dessa:
  1. "Sparat av dig" när ledaren själv sparade passet.
  2. "Sparat av {namn}" när passet sparats av en annan ledare i samma lag.
  3. "Sparat av en tidigare ledare" när den som sparade passet har lämnat laget men finns kvar som konto (12.3). Namnet visas inte, eftersom personer bara ser namn på dem de delar lag med (S-16).
  4. "Sparat av Borttagen användare" när kontot har raderats (26.2).
- **Tom lista (flik utan pass):** "Du har inga sparade pass än. Skapa ditt första pass." Knappen "+ Nytt pass" ligger kvar ovanför. I ett lags flik: "{lagnamn} har inga sparade pass än."
- **Arkiverade lag (beslutat av användaren 2026-10-13):** passen i ett arkiverat lag syns under en sista flik, "Arkiverade lag", där de kan läsas och skrivas ut tills laget rensas efter 24 månader. Spara, koppla och byta övning går inte att göra mot ett arkiverat lag (12.7). Fliken visas bara för ledare som var med i laget när det arkiverades. Passen kan fortfarande tas bort.

## Wireframe, 360 px – Ett sparat pass (personligt) med hantering

Ett sparat pass öppnas i samma passvy som `02-genererat-pass.md`, med möjlighet att byta övning, starta planläge, skriva ut eller koppla till en säsongsvecka. Ovanför passets sammanfattning ligger en rad som visar vem som ser passet, och längst ner hanteringen.

```
┌────────────────────────────────┐
│ ← Sparade pass                  │
│ 11 år · 7 mot 7 · Passning      │
│ 24 sep                          │
│                                 │
│ Bara synligt för dig            │  ← chip
│ ┌───────────────────────────┐  │
│ │ Koppla till lag            │  │  ← sekundär, öppnar dialogen
│ └───────────────────────────┘  │     nedan
│                                 │
│ 7 mot 7 · Fortsättning · 58 min │
│ … passet som i vy 02 …          │
│                                 │
│ ┌───────────────────────────┐  │
│ │     Starta planläge        │  │  ← primär
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Skriv ut / Ladda ner PDF   │  │
│ └───────────────────────────┘  │
│ ──────────────────────────────  │
│ ┌───────────────────────────┐  │
│ │ Ta bort pass               │  │  ← destruktiv, sist i vyn
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Chip under namnet:** "Bara synligt för dig" för ett personligt pass, "Delas med {lagnamn}" för ett lagpass. Texten bär betydelsen, inte färgen.
- **"Koppla till lag"** visas bara för ett personligt pass. "Ta bort pass" visas för det egna personliga passet och för alla lagets pass, för vilken ledare i laget som helst (användarens beslut 2026-10-13).
- **Byter ledaren övning i ett sparat pass och sparar igen** blir det ett nytt sparat pass, och det första ligger kvar oförändrat (05.9). Knappen heter då "Spara som nytt pass", inte "Spara pass", så att ledaren inte tror att det gamla skrivs över.
- **Visas från ögonblicksbilden (05.8):** passet läses ur den sparade kopian. Har en övning ändrats eller tagits ur banken efteråt, visas ändå den version passet sparades med. Ingen text behövs.

## Wireframe, 360 px – Koppla ett personligt pass till ett lag (12.6, Should)

Ingen skiss beskrev detta tidigare, trots att texten "tills du kopplar det till ett lag" lovar det. Åtgärden är **enkelriktad**: ett personligt pass kan kopplas till ett lag ledaren är med i, men inte flyttas till ett annat lag och inte göras personligt igen. Därför en bekräftelse med lagets namn i knappen.

```
┌────────────────────────────────┐
│ ✕ Koppla passet till ett lag    │
│                                 │
│ Lag                            │
│ ┌───────────────────────────┐  │
│ │ P11 Blå ▾                  │  │  ← bara lag ledaren är med i,
│ └───────────────────────────┘  │     inte arkiverade
│                                 │
│ Alla ledare i P11 Blå kan då    │
│ se, öppna och ta bort passet.   │
│ Du kan inte göra det personligt │
│ igen eller flytta det till ett  │
│ annat lag.                      │
│                                 │
│ Passets namn syns för dem:      │
│ "11 år · 7 mot 7 · Passning     │
│ 24 sep". Skriv inga namn på     │
│ spelare.                        │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Koppla till P11 Blå        │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Avbryt                     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Ledaren är med i flera lag:** lagväljaren visar alla, utan förval, så att ingen kopplar till fel lag av slentrian. Är ledaren med i ett enda lag är det förvalt.
- **Ledaren är inte med i något lag:** knappen "Koppla till lag" visas inte. Under chipen står i stället "Du är inte med i något lag än. Be klubbadmin bjuda in dig, så kan du dela passet." (utan knapp).
- **Efter kopplingen:** dialogen stängs, chipen byter till "Delas med P11 Blå", knappen "Koppla till lag" försvinner, och en bekräftelse visas: "Passet delas nu med {lagnamn}." Passet flyttar från fliken "Mina pass" till lagets flik.
- **Passets namn visas i dialogen** eftersom det är det andra ledare ser först, och det är där ett spelarnamn kan ha råkat hamna. Vill ledaren ändra namnet finns ingen väg i version 1 (Could i backloggen); hon eller han kan spara om passet som nytt med rätt namn och ta bort det gamla (05.9, 05.13).
- **Misslyckas det:** nät saknas ger den vanliga texten för handlingar som kräver nät, och ingenting påstås ha hänt. Är laget arkiverat under tiden: "Laget är arkiverat och kan inte tas emot pass."
- **Åtgärden är bara tillgänglig för den som sparade passet** (personliga pass ses bara av ägaren, så det följer av sig självt).

## Wireframe, 360 px – Ta bort ett pass (05.13, 12.8)

Två varianter av bekräftelsen i en dialog (`designsystem.md` 6.8). Lagpass kräver en tydligare text, eftersom borttagningen drabbar alla i laget.

```
Personligt pass                         Lagets pass
┌────────────────────────────┐        ┌────────────────────────────┐
│ ✕ Ta bort passet?           │        │ ✕ Ta bort passet för hela   │
│                             │        │ P11 Blå?                    │
│ "11 år · 7 mot 7 · Passning │        │                             │
│ 24 sep" försvinner ur dina  │        │ "11 år · 7 mot 7 · Avslut   │
│ listor. Det rensas helt     │        │ 17 sep" försvinner för alla │
│ efter 90 dagar.             │        │ ledare i P11 Blå. Det       │
│                             │        │ rensas helt efter 90 dagar. │
│ ┌─────────────────────────┐ │        │ Du kan inte ångra det i     │
│ │ Ta bort passet          │ │        │ appen.                      │
│ └─────────────────────────┘ │        │ ┌─────────────────────────┐ │
│ ┌─────────────────────────┐ │        │ │ Ta bort för hela laget  │ │
│ │ Avbryt                  │ │        │ └─────────────────────────┘ │
│ └─────────────────────────┘ │        │ ┌─────────────────────────┐ │
└────────────────────────────┘        │ │ Avbryt                  │ │
                                        │ └─────────────────────────┘ │
                                        └────────────────────────────┘
```

- **Alla ledare i laget får ta bort lagets pass** (användarens beslut 2026-10-13), även pass som någon annan sparat. Det gör att den som upptäcker ett spelarnamn i ett passnamn kan åtgärda det direkt, utan att vänta på den som sparade (S-19, S-20). Bekräftelsen säger tydligt vem det drabbar: hela laget.
- **Knapparna säger vad som händer:** "Ta bort passet" respektive "Ta bort för hela laget", aldrig "OK".
- **Efter borttagningen:** ledaren kommer tillbaka till listan och ser "Passet är borttaget. Det rensas helt efter 90 dagar." Den raden är kvar i flera sekunder (`role="status"`), så att den hinner läsas.
- **Någon annan har redan tagit bort passet:** "Passet är redan borttaget." och listan uppdateras.
- **Nät saknas:** den vanliga texten för handlingar som kräver nät. Passet ligger kvar.
- **Ingen "ångra" i appen.** Raden ligger kvar i databasen i 90 dagar enligt berättelse 29, men det finns ingen berättelse som ger ledaren en väg att hämta tillbaka den, och texten får därför inte lova det.

## Wireframe, 360 px – Pass som inte klarar slutkontrollen (05.7)

Ett lagrat pass som inte klarar slutkontrollen av säkerhetsreglerna visas inte som ett pass (användarens beslut 2026-10-13). Ledaren får ett begripligt besked utan teknisk felutskrift. Planläge och utskrift är spärrade för passet, och knapparna för dem visas inte alls. Sidan blir inte vit, och ingen stacktrace eller regelkod syns.

```
┌────────────────────────────────┐
│ ← Sparade pass                  │
│ Det här passet går inte att     │
│ använda                         │
│                                 │
│ ┌───────────────────────────┐  │
│ │ ⚠ Passet "11 år · 7 mot 7 · │  │
│ │ Passning 24 sep" klarar inte │  │
│ │ våra säkerhetskontroller,    │  │
│ │ till exempel för att en      │  │
│ │ övning inte är godkänd eller │  │
│ │ för att passet har mer       │  │
│ │ nickspel än åldern tillåter. │  │
│ │ Därför visar vi det inte.    │  │
│ │ Planläge och utskrift är     │  │
│ │ avstängda för det.           │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Skapa ett nytt pass        │  │  ← primär, till underlaget
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Ta bort passet             │  │  ← destruktiv, samma dialog som ovan
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Gäller var passet än öppnas:** från listan, via en adress, från en säsongsvecka (när den finns) eller direkt i planläget. Slutkontrollen körs varje gång ett lagrat pass läses, och ingen väg runt vyn får visa passet, starta planläget eller skriva ut det.
- **Passets namn visas** i rutan så att ledaren ser vilket pass det gäller. Namnet är vanlig text och aldrig markup.
- **Texten gissar inte orsaken.** "Till exempel" räknar upp de två vanligaste orsakerna men påstår inte att just någon av dem gäller. Texten skyller inte på ledaren och använder inga regelnummer.
- **Ingen "visa ändå"-knapp.** Spärren är avsiktlig; det är inte ett val ledaren ska kunna göra på planen.
- **I listan** ser passet ut som vilket annat pass som helst. Kontrollen körs när passet öppnas (05.7), och listan får inte bli långsam av att kontrollera alla pass i förväg.
- **Går att ta bort (S-51):** "Ta bort passet" finns alltid i den här vyn, också för ett lagpass (samma bekräftelse som ovan). Ett spärrat pass får aldrig fastna, eftersom ett spelarnamn i dess namn då inte skulle gå att rätta. Efter borttagningen ligger passet inte kvar i andra ledares lokala kopia efter nästa synk.
- **"Skapa ett nytt pass"** leder till underlaget (`01-underlag.md`) med förvalen. Underlaget från det spärrade passet används inte, eftersom raden inte går att lita på.

## Beteende och tillstånd

- **Namnförslag (05.3):** om ledaren inte skriver ett eget namn föreslås ett med datum, spelform och (huvud)fokus. Förslaget är redigerbart innan spara.
- **Hjälptext om spelarnamn (05.5):** under namnfältet står alltid "Skriv inga namn på spelare." (S-20).
- **Lag-koppling (12.1, 12.2, 12.5):** om ledaren tillhör ett eller flera lag visas ett val, förvalt till det senast använda laget. Ett pass hör till ett lag eller inget, aldrig flera. Väljer ledaren "Inget lag, bara för mig" (eller har inget lag), sparas passet privat, synligt bara för ledaren själv, inte heller för klubbadmin. Arkiverade lag går inte att välja (12.7).
- **Fortsätt använda appen (05.4):** efter spara stängs dialogen och ledaren är kvar i passvyn (nu markerad "Sparat"), eller kan direkt trycka "+ Nytt pass" för att börja om. Bekräftelsen säger var passet hamnade: "Passet är sparat i {lagnamn}." eller "Passet är sparat. Bara du ser det."
- **Dubbeltryck (05.12):** knappen visar "Sparar …" och kan inte tryckas två gånger. Försvinner svaret och ledaren försöker igen skapas inget dubblettpass.
- **Flikar Mina pass / lag (12.1, 12.3):** ett lags flik visar alla pass som är sparade för laget, oavsett vem som sparat dem. En ledare som lämnat laget ser inte längre den fliken eller de passen, men passen finns kvar för kvarvarande ledare (12.3).
- **Lag ledaren inte är med i (12.4):** syns aldrig, inte heller andra ledares personliga pass.
- **Öppna ett sparat pass:** leder till passvyn ovan, som bygger på `02-genererat-pass.md`.
- **Osparat pass efter omstart (05.14, Should):** har ledaren genererat men inte sparat ett pass och öppnar appen igen, visas passet på nytt, med raden "Det här passet är inte sparat än." och knappen "Spara pass". Det visas aldrig för en annan inloggad person på samma enhet.
- **Tom lista:** "Du har inga sparade pass än. Skapa ditt första pass." med en genväg till generatorn.

## Tillgänglighet

- Varje passkort är en enda länk/knapp med ett fullständigt tillgängligt namn (namn, datum, längd, vem som sparade), inte flera separata klickbara delar i samma kort.
- Flikarna är riktiga flikar (`role="tablist"`/motsvarande) med tydligt tangentbordsstöd.
- Dialogerna fångar fokus, stänger med Escape och återger fokus till knappen som öppnade dem (`designsystem.md` 6.8). Efter att ett pass tagits bort flyttas fokus till rubriken i listan (annars försvinner det med passet).
- Chipen "Bara synligt för dig" och "Delas med {lagnamn}" bär sin innebörd i texten. Felen i spara-dialogen har `role="alert"`, bekräftelser `role="status"`.
- Rutan i det spärrade passet har `role="alert"` och är en h2 under sidans h1, så att en skärmläsare möter förklaringen först.

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-13 | Lagval vid sparande är ett val (förvalt till senast använda lag) med "Inget lag, bara för mig", i linje med berättelse 12 kriterium 1. `floden.md` avsnitt 1.4 sade tidigare att kopplingen var automatisk, och är rättat. Nya vyer och lägen: spara utan lag, fel vid sparande (namn, dygnsgräns, nät), "Sparat av" i fyra former, sparat pass med chip och hantering, koppla ett personligt pass till ett lag i efterhand (12.6), ta bort ett pass (personligt och lagets, 05.13, 12.8), pass som inte klarar slutkontrollen (05.7), osparat pass efter omstart (05.14), arkiverade lag (väntar på beslut). Startsidan heter "Sparade pass". Statusraden ändras inte av en agent. |
