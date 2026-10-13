Status: godkänd (K2, 2026-09-12)

# Vy: Klubbadmin – klubb, lag, ledare och inbjudningar

**Uppfyller:** berättelse 09 (skapa klubb, utse klubbadmin), 10 (hantera lag), 11 (bjuda in ledare).

**Läge:** Planeringsläget.

**Placering:** menypunkten "Klubb och lag" (`16-navigering.md`). Punkten visas för klubbadmin, och för en ledare i ett lag som en skrivskyddad vy över sina egna lag.

## Wireframe, 360 px – Skapa klubb (ingen klubb än)

```
┌────────────────────────────────┐
│  Skapa din klubb                │
│                                 │
│  Klubbnamn                     │
│  ┌───────────────────────────┐ │
│  │ IK Exempel                │ │
│  └───────────────────────────┘ │
│  Använd klubbens riktiga namn,  │
│  inte ett lags. Skriv inga      │
│  namn på spelare någonstans i   │
│  appen.                         │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Skapa klubb            │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

## Wireframe, 360 px – Klubbnamn upptaget (09.2)

```
┌────────────────────────────────┐
│  Skapa din klubb                │
│                                 │
│  Klubbnamn                     │
│  ┌───────────────────────────┐ │
│  │ IK Exempel                │ │
│  └───────────────────────────┘ │
│  ⚠ Det finns redan en klubb med │
│  det namnet. Kontrollera om     │
│  din klubb redan är registrerad │
│  innan du skapar en ny.         │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Skapa klubb ändå       │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

Varningen visar inget om den andra klubben utöver att namnet finns: inga lag, inga ledare, ingen ort. Den visas också när skillnaden bara är versaler eller extra blanksteg ("ik  exempel").

## Wireframe, 360 px – Klubbnamn för långt (09.5)

```
│  Klubbnamn                     │
│  ┌───────────────────────────┐ │
│  │ … över 100 tecken …       │ │
│  └───────────────────────────┘ │
│  ⛔ Klubbnamnet får vara högst  │
│  100 tecken. Du har skrivit 112.│
```

Samma mönster gäller lagnamn. Fältet stoppar inte inmatningen; felet visas när personen försöker spara, så att en inklistrad text inte klipps tyst.

## Wireframe, 360 px – Klubbens lag och ledare

Klubbadmins startvy. Den har tre delar: lagen, klubbens ledare och klubbens klubbadminer.

```
┌────────────────────────────────┐
│ IK Exempel                      │
│                                 │
│ Lag                             │  ← h2
│ ┌───────────────────────────┐  │
│ │ P11 Blå                     │  │
│ │ 11 år · 7 mot 7 · 3 ledare  │  │
│ │        [Öppna]             │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ F14 Vit                     │  │
│ │ 14 år · 9 mot 9 · 2 ledare  │  │
│ │        [Öppna]             │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │        + Lag               │  │
│ └───────────────────────────┘  │
│                                 │
│ Ledare i klubben                │  ← h2
│ ┌───────────────────────────┐  │
│ │ Björn Enbom · Klubbadmin    │  │
│ │ P11 Blå                     │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Anna Larsson                │  │
│ │ P11 Blå, F14 Vit            │  │
│ │ [Gör till klubbadmin]       │  │
│ └───────────────────────────┘  │
│                                 │
│ Arkiverade lag (1)    [Visa ▾]  │  ← hopfälld, se Arkivering
└────────────────────────────────┘
```

- **"Ledare i klubben"** visar bara dem som har accepterat en inbjudan (medlemmar), med de lag de är med i. Väntande inbjudningar visas inom respektive lag, inte här. Klubbadmin ser hela klubbens ledare; en vanlig ledare ser aldrig den här listan (S-16).
- **Klubbadmin-chipen** står bredvid namnet som text ("Klubbadmin"), inte som färg ensam.
- **Knappen "+ Lag"** ligger som en full knapp under lagen (inte i sidhuvudet, se `designsystem.md` 6.10: inga kontroller under 48 px i bandet).

## Wireframe, 360 px – Utse en klubbadmin (09.4)

Knappen "Gör till klubbadmin" finns bara på rader för personer som redan är medlemmar i klubben. En person som bara är inbjuden, eller som inte finns i klubben, kan inte utses; ingen knapp visas för dem.

```
┌────────────────────────────────┐
│ ✕ Gör Anna Larsson till         │
│ klubbadmin?                     │
│                                 │
│ Anna får samma rättigheter som  │
│ du: skapa och arkivera lag,     │
│ bjuda in och ta bort ledare     │
│ och utse fler klubbadminer.     │
│ Hon blir klubbadmin i IK        │
│ Exempel, utöver sina lag.       │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Gör till klubbadmin        │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ Avbryt                     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Efter bekräftelse:** "Anna Larsson är nu klubbadmin i IK Exempel." och raden får chipen "Klubbadmin".
- **Återkalla en klubbadmin** finns inte i version 1 (Could i backloggen, berättelse 09 *Utanför*), och ingen knapp för det visas.
- **Syftet visas där det behövs:** i blockeringen i `15-radera-konto.md` ("Utse en efterträdare") länkar knappen hit, till listan "Ledare i klubben". Finns ingen annan medlem i klubben att utse står det: "Ingen annan i klubben kan bli klubbadmin än. Bjud in en ledare till ett lag först." Då ligger knappen "Bjud in en ledare" kvar som genväg till ett lag.

## Wireframe, 360 px – Skapa lag

```
┌────────────────────────────────┐
│ ✕ Nytt lag                      │
│                                 │
│ Lagnamn                        │
│ ┌───────────────────────────┐  │
│ │ P11 Blå                    │  │
│ └───────────────────────────┘  │
│ Skriv inga namn på spelare.     │
│                                 │
│ Ålder                          │
│ ┌───────────────────────────┐  │
│ │ 11                         │  │
│ └───────────────────────────┘  │
│ Ange den ålder som flest i      │
│ laget fyller i år. Åldern       │
│ räknas upp av sig själv varje   │
│ nyår.                           │
│                                 │
│ Spelform                       │
│ ( ) 5 mot 5  (•) 7 mot 7        │
│ ( ) 9 mot 9                     │
│ Föreslagen utifrån åldern. Du   │
│ kan välja en annan.             │
│                                 │
│ ┌───────────────────────────┐  │
│ │        Skapa lag           │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Ålder är det år spelarna fyller under kalenderåret (R-010, 10.1, 10.6).** Laget sparas som en årgång, så att ett lag som skapas som 11-åringar 2026 visar 12 år under 2027 utan att någon ändrar något. I lagets vy står därför "11 år i år", inte bara "11 år", och en liten förklaring: "Åldern räknas upp av sig själv varje nyår." Ålder utanför 6–19 ger felet "Ange en ålder mellan 6 och 19 år." (samma som i underlaget).
- **Spelform** föreslås som i `01-underlag.md` men går att ändra fritt här (laget begränsas inte till grannspelformer). Alla fem spelformer är valbara.
- **Fältet Lagnamn** har hjälptexten "Skriv inga namn på spelare." (S-20).

## Wireframe, 360 px – Ett lag: ledare och inbjudan (klubbadmin)

```
┌────────────────────────────────┐
│ ← P11 Blå              [Redig.]│
│                                 │
│ Ålder: 11 år i år               │
│ Spelform: 7 mot 7 (föreslagen)  │
│ Sparade pass: 6                 │
│                                 │
│ Ledare i laget                  │  ← h2
│ ┌───────────────────────────┐  │
│ │ Björn Enbom                 │  │
│ │        [Ta bort från lag]  │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ anna@exempel.se             │  │  ← bara e-post: inbjudan har
│ │ Inbjuden, väntar på svar    │  │    inget namn än
│ │ Gäller till 27 okt          │  │
│ │ [Kopiera länk] [Återkalla]  │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │ kalle@exempel.se            │  │
│ │ Inbjudan har gått ut        │  │
│ │ [Bjud in igen]              │  │
│ └───────────────────────────┘  │
│                                 │
│ Bjud in ledare via e-post       │
│ ┌───────────────────────────┐  │
│ │ e-post@exempel.se          │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │      Skicka inbjudan       │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │   Kopiera inbjudningslänk  │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Arkivera laget             │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Väntande inbjudan visar e-postadressen, inte ett namn.** En inbjudan känner bara adressen (11.1). Wireframen tidigare visade ett namn ("Anna Larsson (inbjuden …)"), vilket inte går att få fram och är rättat.
- **Inbjudningens livslängd (11.4):** raden visar "Gäller till {datum}" (14 dagar). Har den gått ut visas "Inbjudan har gått ut" och knappen "Bjud in igen", som fyller i samma adress. En återkallad inbjudan försvinner ur listan direkt (11.8). En accepterad blir en vanlig rad under Ledare. E-postadressen i en utgången eller återkallad inbjudan rensas senast efter 30 dagar (11.10), och raden försvinner då.
- **Två vägar att bjuda in (11.1):** "Skicka inbjudan" skickar ett mejl. "Kopiera inbjudningslänk" (kräver en ifylld adress) skapar samma inbjudan och lägger länken på urklipp utan att skicka mejl; den gäller bara för den adressen. Båda ger samma rad i listan.
- **Efter "Skicka inbjudan":** "Inbjudan är skickad till anna@exempel.se." Svaret säger aldrig om adressen redan har ett konto (11.11).
- **Dygnsgräns (11.9):** efter 50 utskick på ett dygn visar "Skicka inbjudan" i stället "Klubben har skickat 50 inbjudningar det senaste dygnet, vilket är gränsen. Försök igen i morgon, eller kopiera länken och skicka den själv." Knappen "Kopiera inbjudningslänk" fungerar fortfarande.
- **Ogiltig adress:** "Skriv en giltig e-postadress, till exempel namn@exempel.se."
- **Nät saknas (11.12):** den vanliga texten för handlingar som kräver nät; adressen ligger kvar.

## Wireframe, 360 px – Ett lag, sett av en ledare som inte är klubbadmin (10.7)

En ledare i laget ser laget men kan inte ändra något. Inga knappar för att skapa, redigera, arkivera eller bjuda in visas, och inte heller inaktiverade knappar utan förklaring.

```
┌────────────────────────────────┐
│ ← P11 Blå                       │
│                                 │
│ Ålder: 11 år i år               │
│ Spelform: 7 mot 7               │
│                                 │
│ Ledare i laget                  │
│  • Björn Enbom                  │
│  • Anna Larsson                 │
│                                 │
│ Bara klubbadmin kan ändra laget │
│ och bjuda in ledare.            │
└────────────────────────────────┘
```

Väntande inbjudningar visas inte för en vanlig ledare (adresserna är klubbadmins sak).

## Wireframe, 360 px – Ett lag, sett av en klubbadmin som inte är ledare i laget (10.7)

Klubbadmin ser laget, dess ledare och antalet pass, men kan inte läsa passen eller säsongsplanen (minsta behörighet, ADR 0003).

```
│ Sparade pass: 6                 │
│ Du är inte ledare i P11 Blå, så │
│ du kan inte öppna lagets pass.  │
```

Raden "Sparade pass: 6" är ingen länk. Texten förklarar varför, så att klubbadmin inte tror att något är trasigt.

## Wireframe, 360 px – Varning vid arkivering (10.3)

Användarens beslut 2026-10-13: varningen ska säga att laget och dess pass rensas efter 24 månader. Varningen ersätter den tidigare formuleringen "De påverkas inte", som antydde att allt finns kvar för alltid.

```
┌────────────────────────────────┐
│ ✕ Arkivera P11 Blå?              │
│                                 │
│ ⚠ Laget har 6 sparade pass och  │
│ en säsongsplan. Laget tas bort   │
│ från de aktiva listorna och kan  │
│ inte längre väljas för nya pass. │
│                                 │
│ ⚠ Efter 24 månader rensas laget  │
│ och dess pass helt. Det går inte │
│ att återställa ett arkiverat     │
│ lag i appen.                     │
│                                 │
│ ┌───────────────────────────┐  │
│ │  Arkivera ändå               │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │  Avbryt                     │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

- **Två rutor, inte en:** vad som händer nu (listorna, nya pass) och vad som händer om 24 månader (rensning) är olika saker och får var sin varning, så att den viktigaste raden, rensningen, inte försvinner i en lång mening.
- **Har laget inga pass och ingen säsongsplan** visas bara den andra rutan, med texten "Laget {lagnamn} rensas helt efter 24 månader. Det går inte att återställa ett arkiverat lag i appen." Knappen heter då "Arkivera laget" och inte "Arkivera ändå", eftersom det inte finns något att "ändå" gå förbi.
- **Antalet pass visas, men inte vilka** (10.3, 10.7). Klubbadmin som inte är ledare i laget kan se antalet utan att kunna läsa passen.
- **Säsongsplan** nämns först när inkrement 7 är byggt.
- **Vad ledarna ser (väntar på beslut, se rapporten):** förslaget är att lagets pass finns kvar att läsa och skriva ut under "Arkiverade lag" (`05-sparade-pass.md`) tills rensningen. Beslutas något annat, ska varningen säga det. Texten ovan lovar inte mer än rensningen efter 24 månader.
- **Arkiverade lag i klubbvyn:** en hopfälld rad "Arkiverade lag ({antal})" längst ner. Utfälld visar den lagnamn och datum då laget rensas ("Rensas 14 sep 2028"), utan åtgärdsknappar. Återställ finns inte i version 1.
- **Nät saknas (10.8):** den vanliga texten för handlingar som kräver nät; ingenting arkiveras.

## Beteende och tillstånd

- **Skapa klubb (09.1, 09.6):** personen kopplas automatiskt som klubbadmin till den nya klubben, i samma åtgärd. Hjälptexten under Klubbnamn ("Skriv inga namn på spelare någonstans i appen") är den plats där en ny klubbadmin först möter regeln, eftersom hen ofta sätter tonen för hur laget/klubbens namn väljs (säkerhetsgranskningens fynd S-20).
- **Namnkrock (09.2):** varningen låter klubbadmin gå vidare ändå (appen kan inte veta om det verkligen är samma klubb), men gör det tydligt att kontrollera först. Ingen teknisk spärr, bara en tydlig varning.
- **En klubb ser bara sitt eget (09.3):** listor över lag, ledare och övningar innehåller aldrig data från andra klubbar – detta är i grunden en behörighetsfråga (se `docs/adr/`), men gränssnittet visar aldrig ens en antydan om att andra klubbar finns.
- **Skapa lag (10.1):** namn och ålder krävs; spelform föreslås utifrån åldern men går att ändra fritt. Fältet Lagnamn har hjälptexten "Skriv inga namn på spelare", eftersom lagnamnet är det som syns för hela klubben och följer med i varje pass (S-20).
- **Redigera lag (10.2):** ändringar (namn, ålder, spelform) gäller omedelbart för alla kopplade till laget.
- **Arkivera lag (10.3):** varningsdialogen visas alltid, med exakt antal pass om laget har sådana, innan arkiveringen bekräftas.
- **Bjuda in (11.1):** e-postadress räcker; personen får en länk till `14-inloggning.md` med förifylld inbjudan. Mejlets text finns i `texter.md` avsnitt 17.
- **Begränsad åtkomst (11.2):** en inbjuden ledare får bara tillgång till det laget hon eller han bjöds in till, aldrig klubbens övriga lag automatiskt.
- **Ta bort åtkomst (11.3):** "Ta bort från lag" har en kort bekräftelse. Ledaren förlorar bara åtkomst till det laget, kontot och övrigt (t.ex. andra lag, egna sparade pass som inte är kopplade till just detta lag) påverkas inte. Efteråt: "{namn} är borttagen från {lagnamn}." Lagets pass som ledaren sparat finns kvar för laget, och visas där som "Sparat av en tidigare ledare" (`05-sparade-pass.md`).
- **Nät saknas (09.7, 10.8, 11.12):** varje åtgärd i vyn (skapa klubb, skapa, ändra och arkivera lag, bjuda in, återkalla, ta bort ledare, utse klubbadmin) visar den vanliga texten för handlingar som kräver nät. Det som skrivits ligger kvar.

## Tillgänglighet

- Varje lagkort och ledarrad har tillräcklig träffyta (48 × 48 px) runt sina åtgärdsknappar, viktigt eftersom klubbadmin ofta gör detta på en dator med mus men appen ska fungera lika bra på mobil. Raderna med flera knappar ("Kopiera länk", "Återkalla") har minst 8 px mellan knapparna och bryter till två rader på smal skärm.
- Varningsdialoger fångar tangentbordsfokus (fokusfälla) tills de stängs, och återger fokus till den knapp som öppnade dem. Efter att en rad tagits bort (återkallad inbjudan, borttagen ledare) flyttas fokus till rubriken ovanför listan.
- Knapparna på ledarrader har tillgängliga namn med personens namn eller adress, till exempel "Gör till klubbadmin, Anna Larsson" och "Återkalla inbjudan till anna@exempel.se". Den synliga texten ingår ordagrant (WCAG 2.5.3).
- Statusen på en inbjudan ("Inbjuden, väntar på svar", "Inbjudan har gått ut") är text, inte färg.

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-13 | Ny: klubbens översikt med lag, ledare och klubbadminer, utse klubbadmin (09.4), lagets ålder som följer kalenderåret (10.6), lag sett av vanlig ledare och av klubbadmin som inte är ledare (10.7), inbjudan med livslängd, kopiera länk, återkalla, bjud in igen och dygnsgräns (11.1, 11.4, 11.8, 11.9), nät saknas. Arkiveringsvarningen säger att laget och dess pass rensas efter 24 månader (användarens beslut). Väntande inbjudan visar e-postadress i stället för ett namn. Statusraden ändras inte av en agent. |
