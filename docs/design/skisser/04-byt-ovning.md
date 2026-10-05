Status: godkänd (K2, 2026-09-12)

# Vy: Byta övning

**Uppfyller:** berättelse 04 (byta ut en övning i passet), R-104 till R-106.

**Läge:** Planeringsläget. Nås från genererat pass, sparat pass eller inför planläget (inte under pågående planläge, se `06-planlage.md`).

## Wireframe, 360 px

```
┌────────────────────────────────┐
│ ← Byt övning: Öva               │
│                                 │
│ Byter ut: "Passningar med       │
│ vändning" (Station A, 5 min)    │
│                                 │
│ ┌───────────────────────────┐  │
│ │ 🔍 Sök bland alternativen  │  │
│ └───────────────────────────┘  │
│                                 │
│ FRÅN DEN GEMENSAMMA BANKEN      │
│ ┌───────────────────────────┐  │
│ │ Passning i par              │  │
│ │ Passning och mottagning     │  │
│ │ 5–15 min · 4–12 spelare     │  │
│ │ [Skiss]                     │  │
│ │              [Välj denna]  │  │
│ ├───────────────────────────┤  │
│ │ Trekantspassning            │  │
│ │ Passning och mottagning     │  │
│ │ 5–10 min · 6–12 spelare     │  │
│ │ [Skiss]                     │  │
│ │              [Välj denna]  │  │
│ └───────────────────────────┘  │
│                                 │
│ KLUBBENS EGNA ÖVNINGAR          │
│ ┌───────────────────────────┐  │
│ │ Vår passningslek            │  │
│ │ Passning och mottagning     │  │
│ │ Skapad av Anna L.           │  │
│ │ [Skiss]                     │  │
│ │              [Välj denna]  │  │
│ └───────────────────────────┘  │
│                                 │
│ Ingen av era egna övningar med  │
│ ofullständiga uppgifter visas   │
│ här – de kan inte användas i    │
│ ett pass förrän de är           │
│ kompletta.                      │
└────────────────────────────────┘
```

Alternativen inom varje sektion sorteras på namn i svensk bokstavsordning (se granskningsanteckningen 2026-10-05 nedan). `[Skiss]` är en knapp som förstorar planskissen i kortet, samma mönster som på passets eget kort (`02-genererat-pass.md`, designsystem.md avsnitt 7).

## Alternativt tillstånd: inga alternativ finns

```
┌────────────────────────────────┐
│ ← Byt övning: Öva               │
│                                 │
│ Byter ut: "Passningar med       │
│ vändning" (Station A, 5 min)    │
│                                 │
│  Vi hittade ingen övning i      │
│  banken som passar precis här.  │
│  Övningen ligger kvar som den   │
│  är.                            │
│                                 │
│ ┌───────────────────────────┐  │
│ │      Tillbaka till passet  │  │
│ └───────────────────────────┘  │
└────────────────────────────────┘
```

**Texten ovan gäller till och med inkrement 2b** (ingen förväxling med klubbens egna övningar, som inte går att byta in förrän inkrement 4). Fastställt i `texter.md` avsnitt 6, med en anmärkning om att texten ska bytas tillbaka till en variant som nämner båda källorna när inkrement 4 är klart.

## Beteende och tillstånd

- **Två tydligt skilda grupper (04.1):** "Från den gemensamma banken" och "Klubbens egna övningar" visas som egna rubriker/sektioner, aldrig blandade i en lista, så att ledaren alltid vet varifrån en övning kommer (kvalitetssäkrad kontra egen).
- **Filtrering sker innan visning:** listan visar bara övningar som redan uppfyller alla villkor (samma del, säkerhetsregler, plats för momentets spelare/ledare/station, inte redan i passet). Ledaren behöver aldrig filtrera bort olämpliga förslag själv.
- **Klubbens ofullständiga övningar (04.1, R-106):** visas aldrig i listan. Texten längst ner förklarar varför, så att ledaren inte tror att appen "glömt" en övning hon eller han vet finns i klubben.
- **Sök** filtrerar listan på namn/fokus i realtid, men ändrar inte vilka övningar som är tillåtna.
- **Välja en övning (04.2):** en bekräftelsedialog är inte nödvändig – trycket på "Välj denna" byter direkt och för tillbaka till passet med en kort bekräftelse ("Bytt till: Passning i par") och den uppdaterade tiden synlig.
- **Inget alternativ (04.3):** se det alternativa tillståndet ovan. Originalövningen är oförändrad.
- **Flera byten (04.4):** efter ett byte är ledaren tillbaka i passet och kan trycka "Byt övning" på valfri annan rad.
- **Uppdaterad totaltid (04.5):** visas i passvyn direkt efter återgång, som i `02-genererat-pass.md`.

## Tillgänglighet

- Varje övningskort är en enda logisk enhet för skärmläsare: namn, fokus, tid, antal spelare, planskissens förstora-knapp läses i den ordningen innan knappen "Välj denna" nås.
- "Välj denna"-knappen är minst 48 × 48 px och har ett unikt tillgängligt namn per kort: **"Välj denna: {namn}"** (till exempel "Välj denna: Passning i par"), inte bara "Välj denna" upprepat utan sammanhang. Det tillgängliga namnet börjar med den synliga knapptexten ordagrant (WCAG 2.5.3) – se `texter.md` avsnitt 6 för varför det inte blev "Välj {namn}" som ett tidigare utkast av den här sidan föreslog.
- Sökfältet har en synlig etikett, inte bara en förstorningsglas-ikon.

## Granskning mot det byggda gränssnittet (2026-10-05, ux-designer, inkrement 2b)

Granskat: `src/app/swap/SwapView.tsx`, `src/app/session/ExerciseCard.tsx`, mot den här skissen, `designsystem.md` och `texter.md`. Ingen produktionskod ändrad av ux-designern; besluten nedan styr vad senior-systemutvecklare och kvalitetssäkraren ska utgå från.

- **Sortering:** alternativen sorteras på namn i svensk bokstavsordning (`localeCompare(..., 'sv')`) inom varje sektion. Godkänt, oförändrat.
- **Ordning på kortet:** namn → fokus → nyckeltal ("{tid} min · {spelare} spelare") → miniatyr → "Välj denna". Wireframen ovan är uppdaterad för att visa miniatyren under nyckeltalen (byggt så redan), inte till vänster om namnet som den ursprungliga ASCII-skissen antydde – `designsystem.md` avsnitt 7 tillåter båda placeringarna ("till vänster om eller ovanför texten"), och ordningen matchar den föreskrivna läsordningen i avsnittet ovan. **Behåll.**
- **Miniatyren går att förstora:** bekräftat, samma `KortSkiss`-komponent som på passets kort, med en egen knapp ("Förstora planskiss, {namn}") som fäller ut skissen i full storlek i samma kort.
- **Bekräftelsen efter ett byte** visas på det bytta kortet i passvyn ("Bytt till: {namn}."), inte intill totaltiden högst upp som meningen "med den uppdaterade tiden synlig" i avsnittet *Beteende och tillstånd* ovan kan läsas som. Totaltiden uppdateras ändå korrekt och automatiskt högst upp (04.5 är uppfyllt). Placeringen på kortet behålls – se motiveringen i `texter.md` avsnitt 4 (näst sista stycket, om varför: ledarens uppmärksamhet, en separat `role="status"`-region som redan når skärmläsare oavsett synlig placering, och att inte rycka bort tangentbordsfokus från kortet).
- **Fokus:** `ref` är i dag spärrad i appen, så fokus flyttas med `autoFocus`. Blir `ref` tillåten bör fokus vid öppning av vyn flyttas till vyns egen `<h1>` ("Byt övning: {del}") i stället för till "Tillbaka till passet", så att en skärmläsare hör vyns titel först. Fokus efter ett byte ska **inte** ändras även om `ref` blir tillåten – det ska fortsätta hamna på det nya kortets "Byt övning"-knapp, inte på bekräftelsetexten. Fullständig motivering i `texter.md` avsnitt 4.
- **"Inga alternativ":** texten i det alternativa tillståndet ovan är tillfälligt omskriven utan "era egna övningar", eftersom klubbens egna övningar inte går att byta in förrän inkrement 4. Ska bytas tillbaka då, se `texter.md` avsnitt 6.
