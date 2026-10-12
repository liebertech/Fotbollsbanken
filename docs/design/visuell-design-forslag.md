Status: godkänd (riktningsval A, 2026-10-12)

Riktningsvalet är godkänt av användaren. Resten av dokumentet är beslutsunderlaget och står kvar som det skrevs. Det som ändras i `designsystem.md` finns beskrivet i avsnitt 10 och 11, och själva ändringarna i `designsystem.md` är utkast tills användaren godkänt dem.

# Visuell design – förslag till beslut

Beslutsunderlag inför inkrement 3. Bakgrund: användarens test 2026-10-05, där appen fungerade men "gränssnittet ser tråkigt ut". Inget är byggt, och `designsystem.md` är orört tills en riktning är vald.

Tre klickbara skisser ligger i `docs/design/skisser/visuell/`. De är fristående HTML-filer utan externa beroenden, med växlare för ljust och mörkt läge och för skärmarna "Underlag" och "Genererat pass". Öppna dem direkt i webbläsaren och gör fönstret smalt (390 px).

| Riktning | Fil |
|---|---|
| A. Gräsmattan | `docs/design/skisser/visuell/riktning-a-grasmattan.html` |
| B. Taktiktavlan | `docs/design/skisser/visuell/riktning-b-taktiktavlan.html` |
| C. Matchprogrammet | `docs/design/skisser/visuell/riktning-c-matchprogrammet.html` |

---

## 1. Läget i dag

Underlag för beskrivningen: `designsystem.md`, `floden.md`, `texter.md`, `skisser/01` och `02`, `src/app/app.css`, `InputForm.module.css`, `ExerciseCard.module.css`, `SessionView.module.css`, `planskiss.module.css` samt skärmbilderna i `skarmbilder/ritmotor/`. Jag startade inte appen, utan utgår från koden och de befintliga skärmbilderna (se *Kvarstår* i rapporten).

Det är inget fel på funktionen. Det som upplevs som tråkigt är att designsystemet har lösts som ett tillgänglighetsdokument och inte som en visuell identitet. Konkret:

1. **Färg.** Fotbollsgrönt `#0B6B3A` finns bara på knappen "Generera igen", länkarna och de valda valen. Resten är vitt, ljusgrått och svart text. Ytan `#F4F6F4` är nästan identisk med bakgrunden, så korten blir en svag grå ton. Mörkt läge är nästan svart med mörkgrå kort. Det finns ingen sekundär accentfärg, så ingenting får "dra" blicken.
2. **Typografi.** Systemtypsnitt i en enda vikt (400, med 600 på rubriker) och bara storlekarna 24, 18, 16 och 14 px. Delrubrikerna ("1. UPPVÄRMNING · 9 MIN") är versaler i samma storlek som brödtexten och är den enda hierarkin. Siffror som är passets verkliga innehåll (minuter, antal grupper) har samma vikt som löptext.
3. **Hierarki.** Allt på pass-skärmen väger lika mycket: sammanfattningsraden är en löptext, de två varningarna är lika stora som övningarna, och övningskortet har namn, syfte, gruppindelning, yta och knapp i nästan samma storlek och färg. Ledaren kan inte skanna passet i ett ögonkast. Vilken del man är på ("Öva") går inte att se på avstånd.
4. **Täthet och tomma ytor.** Sidan är en lång, jämn kolumn. Underlaget är en lodrät rad av etiketter, fält och hjälptexter utan gruppering. Övre delen av båda skärmarna är en vit rubrik på vit yta, så appen har inget "ansikte" vid första titten.
5. **Ikoner.** Det finns nästan inga. Varningarna använder tecknet ⚠ i en gul ruta, vattenpausen en liten blå droppe och allt annat är text. Det finns ingen logotyp eller varumärkesyta.
6. **Planskissernas roll.** Skissen är den mest fotbollslika bilden i appen, men den visas som en liten vit ruta på 96 × 72 px med tunna svartvita linjer i hörnet av kortet. Den ser ut som en miniatyr i ett dokument, inte som en taktiktavla. Den ligger i det kontrastsvaga skiktet (svag grön yta `#eef4ee`) och bär ingen färg som skiljer lag eller kon.
7. **Känslan av fotboll.** Den saknas helt. Appen skulle lika gärna kunna vara en kalender- eller receptapp. Inget i färg, form eller språk säger gräs, linjer, koner, västar eller matchdag.
8. **Knappar.** Sekundärknapparna ("Visa mer", "Ändra uppgifter") har samma storlek som primärknappen och kantad stil, vilket gör att de konkurrerar. Val av spelform och nivå ser ut som små kantade rutor, och det valda läget skiljs bara av en något tjockare kant och en grå fyllning. Det är tillgängligt men visuellt dovt.

Det som är bra och ska behållas: kontrasten, träffytorna, avstånden (8-pxskalan), de tre lägena, texterna i klarspråk och att inget bärs av bara färg.

---

## 2. Gemensamt för alla tre riktningarna

- **Tre lägen oförändrade.** Planläget behåller sitt eget, extremt kontrastrika tema (`designsystem.md` 2.3). Riktningarna gäller ljust och mörkt läge i planeringsläget, och bara formspråket (siffror, tjocka linjer, numrerade delar) får följa med in i planläget, aldrig paletten. Planläget är i sol viktigare än finess.
- **Träffytor och avstånd.** Alla interaktiva element i skisserna är minst 48 px, primärknappen 56 px, och 8 px mellan intilliggande ytor. Jag mätte det i Chromium vid 390 px: inga knappar, summary-rader, val-chips, kryssrutor eller talfält är mindre än 48 px i någon av de sex kombinationerna (tre riktningar, ljust och mörkt), och ingen sida scrollar i sidled.
- **Ikoner.** Skisserna använder bara egenritade inline-SVG (boll, varning, gult kort, droppe, bakåtpil) och tecknen ✓ och ▸ ▾. Ingen ikonuppsättning och ingen extern tjänst. Det går att bygga som egen liten ikonfil utan licens.
- **Offline.** Ingen riktning kräver nätverk för något utseende. Ingen kräver bakgrundsbilder, och typsnittsfrågan är enbart öppen för C (se nedan).
- **Kontrastvärden** är beräknade med WCAG:s formel (relativ luminans), samma som i `designsystem.md`. De ska kontrolleras igen mot byggda pixlar.
- **Planskisserna i skisserna är förenklade.** De ersätter inte ritmotorn. Vilka symboler, lagformer och linjetyper ritmotorn använder bestämmer planskissutvecklaren (ADR 0012). Skisserna visar bara hur färgerna runt skissen kan se ut. Se avsnitt 6 om vad det kräver av planskissmodulen.

---

## 3. Riktning A: Gräsmattan

**Idé.** Appen ser ut som en välskött gräsmatta: klippta ränder i sidhuvudet, vita kritlinjer, gula kort för varningar. Mjuk, rundad och glad, men fortfarande lugn. Utgår från dagens gröna primärfärg, så den är minst förändring och minst risk.

### Färgpalett

Ljust läge:

| Roll | Hex | Mot | Kontrast |
|---|---|---|---|
| Bakgrund | `#F4F7EE` | – | – |
| Kort | `#FFFFFF` | – | – |
| Text | `#14231A` | kort / bakgrund | 16,3 / 15,1:1 |
| Sekundär text | `#46564B` | kort / bakgrund | 7,8 / 7,2:1 |
| Primär (grön) | `#0B6B3A` | vit text | 6,6:1 |
| Sidhuvud | `#0B5A31` | vit text | 8,3:1 |
| Accent (gul) | `#FFD23F` | text `#14231A` | 11,3:1 |
| Fel | `#B3261E` | kort | 6,5:1 |
| Fältkant | `#7C8F80` | kort / bakgrund | 3,4 / 3,2:1 (icke-text, minst 3:1) |
| Varning | `#5C3A00` på `#FFF1C2` | – | 9,0:1 |

Mörkt läge:

| Roll | Hex | Mot | Kontrast |
|---|---|---|---|
| Bakgrund | `#0D1A12` | – | – |
| Kort | `#16271C` | – | – |
| Text | `#EEF4EA` | bakgrund / kort | 16,0 / 14,0:1 |
| Sekundär text | `#B9C7BC` | kort | 8,9:1 |
| Primär | `#57C98A` | text `#0D1A12` | 8,6:1 |
| Primär som länk | `#57C98A` | kort | 7,6:1 |
| Accent | `#FFD23F` | text `#14231A` | 11,3:1 |
| Fel | `#F08A80` | kort | 6,5:1 |
| Fältkant | `#6F8A76` | kort | 4,2:1 |
| Varning | `#FFE08A` på `#3A2E10` | – | 10,3:1 |

Planskissens linjer (vitt på gräsgrönt): `#FFFFFF` mot `#3E8E4F` (ljust) 4,0:1 och mot `#357847` (mörkt) 5,3:1, båda över 3:1 för icke-text. (Skissens mörka gräs justerades efter beslutet från `#2F6E3E` till `#357847`, så att den mörka konturen runt lag A och konen når 3:1. De slutliga värdena står i `designsystem.md` avsnitt 10.) Konen är orange med mörk kontur, så den syns även om orangen är svag mot grönt.

### Typografi
Systemets avrundade typsnitt när det finns (`ui-rounded`, annars samma system-stack som i dag). Sidrubrik 32 px/800, delrubrik 18 px/800 i versaler, kortnamn 17 px/700, brödtext 16 px, hjälptext 14–15 px. Inget nytt typsnitt.

### Komponenter
- **Sidhuvud:** gröna klippta ränder med en halv mittcirkel och mittlinje som dekor i högerkanten, gul kantlinje under. Logotyp: en liten boll plus ordet.
- **Passkort:** vitt kort med rundade hörn (16 px). Planskissen ligger kvar som miniatyr till vänster (96 × 72 px, som byggt i inkrement 2) på en gräsgrön yta med klippta ränder.
- **Delrubrik:** gul rund siffra, delnamn i versaler och en tidspill till höger ("9 min"). Minuterna syns därmed i första ögonkastet.
- **Varningar:** gula kort med en liten gult-kort-symbol. Texten ensam bär innebörden.
- **Underlaget:** val av spelform, nivå och yta som runda piller. Valt piller är mörkgrönt med vit text och ✓ (ljust läge) eller ljusgrönt med mörk text och ✓ (mörkt läge). Spelformsrader och sammanfattning blir därmed lätta att läsa som chips.
- **Knappar:** primär är grön med rundade hörn och en markerad "kant" undertill. Sekundär är kantad.

### Vad som ger fotbollskänsla
Gräsrändernas mönster, mittcirkeln i sidhuvudet, gult kort som varning, gräsgröna skisser med vita linjer och orange koner.

### Risker
- Det är den "snällaste" riktningen. Den kan bli lite lekfull för ledare i äldre åldrar (13–19) och den skiljer sig minst från dagens gröna.
- Gula varningskort och gula siffror konkurrerar om den enda accentfärgen. Vi bör hålla gult till siffror, varningar och slutrad.
- Ränderna i sidhuvudet är dekor. De ska inte finnas i planläge eller utskrift.
- Gräsgrön yta med vita linjer är inte svartvit. I utskrift (07) används fortfarande ritmotorns svartvita format.

---

## 4. Riktning B: Taktiktavlan

**Idé.** Passet ser ut som en tränares planering: en rutt med numrerade stopp, planskissen stor som en taktiktavla överst i varje kort, orange koner som accent och en lugn marinblå/pappersfärgad grund. Skissen är hjälten, inte miniatyren.

### Färgpalett

Ljust läge:

| Roll | Hex | Mot | Kontrast |
|---|---|---|---|
| Bakgrund (papper) | `#FAF7F0` | – | – |
| Kort | `#FFFFFF` | – | – |
| Text (bläck) | `#1B2430` | kort / bakgrund | 15,7 / 14,6:1 |
| Sekundär text | `#505A6B` | kort | 7,0:1 |
| Primär (marin) | `#1B2F52` | vit text | 13,3:1 |
| Accent (orange) | `#FF8A3D` | text `#1B2430` | 6,7:1 |
| Accenttext | `#A63D00` | kort | 6,4:1 |
| Fel | `#B3261E` | kort | 6,5:1 |
| Fältkant | `#7A8394` | kort | 3,8:1 |
| Valt val | `#FFD9BD` med text `#1B2430` och marin kant | – | 11,9:1 |
| Varning | `#6B4300` på `#FFF1D6` | – | 7,7:1 |

Mörkt läge:

| Roll | Hex | Mot | Kontrast |
|---|---|---|---|
| Bakgrund | `#111A24` | – | – |
| Kort | `#1B2735` | – | – |
| Text | `#F1EEE6` | bakgrund / kort | 15,1 / 13,0:1 |
| Sekundär text | `#B8C0CC` | kort | 8,2:1 |
| Primär (orange) | `#FF9D5C` | text `#111A24` | 8,5:1 |
| Primär som länk | `#FF9D5C` | kort | 7,4:1 |
| Fel | `#F08A80` | kort | 6,2:1 |
| Fältkant | `#7C8CA2` | kort | 4,4:1 |
| Varning | `#F5D98A` på `#3A2E10` | – | 9,6:1 |

Planskissens linjer: vitt mot tavlans gröna `#2E7D46` ger 5,1:1 i båda lägena. Orange kon `#FF8A3D` mot samma gröna ger bara 2,2:1, så konen har alltid en mörk kontur och är dessutom en triangel. Formen bär informationen, inte färgen.

### Typografi
Systemtypsnitt. Sidrubrik 32 px/800 med en tjock orange understrykning. Delrubriker i versaler 18 px/800, kortnamn 17 px/700, minuter i accentfärg och fet. Inget nytt typsnitt.

### Komponenter
- **Passkort:** planskissen fyller kortets hela bredd överst (cirka 326 × 212 px vid 390 px) och texten ligger under. Kortet har 14 px rundade hörn.
- **Passets rytm:** delarna sitter på en lodrät streckad rutt med en rund numrerad markör för varje del. Det visar passet som en väg från uppvärmning till avslutning och gör att man ser vilken del man är på.
- **Varningar:** ljus varmgul ruta med tjock orange kant till vänster.
- **Underlaget:** valen är rundade rutor. Valt val är ljusorange (ljust) eller mörkbrunt med orange kant (mörkt), alltid med ✓ och en tjock kant.
- **Knappar:** primär är marinblå (ljust) eller orange (mörkt) med en kraftig orange kant under. Sekundär är kantad.

### Vad som ger fotbollskänsla
Planskissen i stor storlek, orange koner, passet som en taktisk rutt, tränarens bläck och papper.

### Risker
- **Kräver ett beslut som ändrar K2:** `designsystem.md` avsnitt 7 anger att skissen i passvyn är en liten ruta på cirka 96 × 72 px. B gör den till full kortbredd. Det gör passet ungefär 25 procent längre (skisserna visar cirka 3 080 px mot cirka 2 440 px hos A), och ledaren får skrolla mer.
- Ritmotorns kontrast i stor storlek, med alla etiketter, ska verifieras av planskissutvecklaren. Små etiketter blir mer läsbara, men skissen får fler pixlar att fylla.
- Den streckade rutten bygger på en positionerad linje och ska följa med vid 200 procent textförstoring och när delarna har olika höjd.
- Marin primärfärg på ljust och orange på mörkt innebär att knappfärgen byter nyans mellan lägena. Det är medvetet (kontrasten kräver det) men det bryter mot den enhetliga gröna identiteten.

---

## 5. Riktning C: Matchprogrammet

**Idé.** Sporttidning och laguppställning: stora siffror, tjocka svarta linjer, hårda hörn, hårda skuggor och en enda skarp accent i matchgult. Appen ser ut som ett matchprogram, med delarna som numrerade skyltar och spelformen i versaler. Svart på vitt är samma estetik som planläget och utskriften, så ledaren möter samma språk i alla tre lägena.

### Färgpalett

Ljust läge:

| Roll | Hex | Mot | Kontrast |
|---|---|---|---|
| Bakgrund och kort | `#FFFFFF` | – | – |
| Text | `#0A0A0A` | bakgrund | 19,8:1 |
| Sekundär text | `#4A4A4A` | bakgrund | 8,9:1 |
| Primär (svart) | `#0A0A0A` | vit text | 19,8:1 |
| Accent (gul) | `#FFD400` | text `#0A0A0A` | 13,8:1 |
| Fel | `#B3140A` | bakgrund | 7,0:1 |
| Kant | `#0A0A0A` | bakgrund | 19,8:1 |
| Varning | `#0A0A0A` på `#FFD400` | – | 13,8:1 |
| Grön (bara skisser och status) | `#0B6B3A` | bakgrund | 6,6:1 |

Mörkt läge:

| Roll | Hex | Mot | Kontrast |
|---|---|---|---|
| Bakgrund | `#0A0A0A` | – | – |
| Kort | `#171717` | – | – |
| Text | `#FFFFFF` | bakgrund / kort | 19,8 / 17,9:1 |
| Sekundär text | `#C2C2C2` | kort | 10,1:1 |
| Primär (gul) | `#FFD400` | text `#0A0A0A` | 13,8:1 |
| Fel | `#FF8C82` | kort | 8,0:1 |
| Kant | `#E6E6E6` | bakgrund | 15,9:1 |
| Grön | `#57C98A` | bakgrund | 9,5:1 |

Planskissen blir svartvit i ljust läge och vit på svart i mörkt: samma ritning som i utskriften. Det gör C till den enda riktningen där det du ser på skärmen och det du skriver ut är samma sak.

### Typografi
Rubriker, delnamn, knappar och kortnamn i versaler, fet 800–900, i en smal sans-stack: `'Arial Narrow', 'Roboto Condensed', system-ui`. Sidrubrik 52 px, delsiffror 36 px, kortnamn 19 px. Brödtext 16 px i vanligt systemtypsnitt.

**Typsnittsfråga.** Skissen använder bara det som redan finns på enheten, och utseendet varierar då mellan plattformar (smalt på Windows och Android, bredare på iOS). För att få samma smala rubriker överallt behövs ett självhostat typsnitt med fri licens, till exempel Barlow Condensed eller Oswald (båda under SIL Open Font License, bara en eller två vikter, cirka 20–30 kB som woff2, cachas av tjänstearbetaren). Det kostar inget och ingen extern tjänst används. Det kräver ändå ett beslut eftersom det är ett nytt beroende och en ny licens att redovisa (`content/` är CC BY-SA, koden Apache-2.0; OFL ska nämnas i licensfilen). Utan det typsnittet fungerar C men ser mindre distinkt ut.

### Komponenter
- **Sidhuvud:** svart band med spärrad versal logotyp och jätterubrik ("NYTT PASS"), tjock gul list under.
- **Passkort:** vit ruta med 3 px svart kant och hård skugga (6 px, ingen oskärpa). Planskissen är miniatyr till vänster med svart kant. Namnet i versaler, minuterna som gul tagg.
- **Delrubrik:** en svart skylt över hela bredden. Till vänster en stor gul siffra (som ett tröjnummer), delnamnet i vitt och minuterna till höger. Passets fem delar går att skanna på avstånd.
- **Varningar:** gul remsa med svart text och svart kant. Svart text på gult är tydligast i solljus.
- **Underlaget:** valen är rektanglar med tjock kant. Valt val är svart med vit text och ✓ (ljust) eller gult med svart text och ✓ (mörkt), och har dessutom en hård skugga, så att valet syns även utan färg.
- **Knappar:** primär är svart (ljust) eller gul (mörkt) med hård skugga. Sekundär är tjockt kantad.

### Vad som ger fotbollskänsla
Matchprogrammets och tröjnummerns språk, gula kort, hårda linjer som kritlinjer, svartvita taktiktavlor. Mindre "gräs", mer "matchdag".

### Risker
- **Tonen.** Den är hårdast av de tre och kan upplevas som aggressiv eller sportbetonad, mindre barnvänlig. Ledarna är vuxna, men vissa kan tycka att den passar bättre för äldre åldersgrupper än för 6–9-åringar.
- **Typsnittet** (se ovan): bäst med ett självhostat OFL-typsnitt, och utan det skiljer sig utseendet mellan enheter.
- **Grönt blir en bisak.** Fotbollsgrönt är inte längre appens färg, bara skissernas och statusmarkeringarnas. Det är det största brottet mot dagens identitet och mot K2:s `Primär/knapp (grön)`. Knappens färg byter dessutom mellan svart (ljust) och gult (mörkt).
- Hårda skuggor och 3 px kanter tar plats. Planeringsläget blir något längre, och kanterna ska vara kvar i 200 procent förstoring.
- Versaler i långa namn ("PASSNINGSRUTA I RÖRELSE") är något tyngre att läsa. Vi bör hålla versaler till rubriker och namn, inte löptext, och skärmläsare påverkas inte (CSS-versaler).

---

## 6. Jämförelse

| | A. Gräsmattan | B. Taktiktavlan | C. Matchprogrammet |
|---|---|---|---|
| Känsla | Fotbollsplan, gräs, varm | Tränare och taktik | Matchdag, sporttidning |
| Ändring från dagens | Liten | Medel | Stor |
| Grön primärfärg kvar | Ja | Nej (marin/orange) | Nej (svart/gul) |
| Ny typsnittsfråga | Nej | Nej | Ja, valfritt (OFL) |
| Planskissens storlek | Som K2 (liten) | Stor, ändrar K2 avsnitt 7 | Som K2 (liten) |
| Skiss i planeringsläget | Grön yta, vit linje, färgade lag | Grön yta, vit linje, vita/blå lag | Svartvit, samma som utskrift |
| Passets längd | Som i dag + liten ökning | Cirka 25 % längre | Som i dag + liten ökning |
| Närhet till planläget och utskriften | Medel | Medel | Mycket nära |
| Risk | Lite lekfull | Längre sida, ändrar K2 | Hård ton, förlorar grönt |

**Vad det kräver av planskissmodulen (planskissutvecklarens område).** `planskiss.module.css` läser appens färgtokens (`--color-bg`, `--color-text`, `--color-primary` med flera). Byts palett följer skissen med automatiskt, men den gröna ytan i A och B, de vita linjerna och lagens former och färger måste sättas av planskissmodulen via sina egna `--skiss-*`-variabler. Dagens lagen skiljs på form och mönster, och det ska bestå i alla riktningar så att ingenting går förlorat i svartvitt. Jag anger bara färgönskemål och hur skissen får plats i vyn, inte hur den ritas.

---

## 7. Rekommendation

**Riktning A, Gräsmattan, med två lån.**

Skäl:
1. Den löser det användaren faktiskt sa, tråkigheten, utan att riva upp något som K2 redan godkänt: grön primärfärg, planskissen i miniatyr, samma lägen. Den enda riktning där `designsystem.md` mest ändras genom tillägg och inte genom omtag.
2. Den ger fotbollskänsla direkt (gräsränder, mittcirkel, gult kort) och hierarki på pass-skärmen (gula siffror, tidspiller), vilket var de två största bristerna i läget.
3. Den har lägst risk för tillgänglighet, utskrift och planläge, och kräver varken nytt typsnitt eller ändrat skissformat.

Lån:
- **Från C:** en andra, tydlig nivå för delnamnen. Om A:s siffror i gul cirkel inte räcker i test kan en svart delskylt som i C läggas till i planeringsläget.
- **Från B:** möjligheten att trycka på miniatyren för att få en stor skiss (som K2 redan beskriver: "klickbar för att förstora"). Det ger tavlan där den behövs, utan att passet blir längre.

Om användaren vill ha en riktigt avvikande identitet och kan avstå från grönt som huvudfärg är **C** den tydligaste och den som hänger ihop bäst med planläget och utskriften. **B** rekommenderas inte, eftersom den enda skillnaden mot A som spelar roll (stor skiss) kostar längre sidor och ändrar K2.

---

## 8. Vad som ändras i `designsystem.md` om en riktning väljs

Gemensamt: statusraden ändras till `godkänd (K<n>, datum)` av användaren, och beslutet noteras i en ändringslogg. Tillgänglighetskraven (avsnitt 5, 8) och planlägets tema (2.3) ändras inte.

**Om A väljs:**
- 2.1 och 2.2: nya värden för bakgrund, kort, text, sekundär text, fältkant och varning enligt tabellerna ovan. Ny roll *Accent* (`#FFD23F`) och *Sidhuvud* (`#0B5A31` ljust, `#123422` mörkt). Primärfärgerna `#0B6B3A` och `#57C98A` är oförändrade. Statusfärgerna i 2.4 behålls (blå, grön, röd) och kontrolleras mot nya kortfärger.
- 3: sidrubrik 32 px/800, delrubriker 18 px/800 versaler, nämn `ui-rounded` först i stacken. Hjälptext får vara 14–15 px (aldrig under 14 px).
- 4: oförändrat. Nytt: kortets innerpadding 16 px och hörnradie 16 px (kort), 12 px (fält), pill (val).
- 6.1: knapp får hörnradie 16 px och en 3 px markerad undre kant på primärknappen. 6.3: kort får 2 px kant `#C9D3C4`. 6.4: ikonerna blir egenritade SVG (gult kort, varning, info) i stället för emojitecken. 6.5: valda val blir fyllda och har ✓.
- Nytt avsnitt 6.10 *Sidhuvud och delrubrik* (gräsränder som dekor, bara i planeringsläget, `aria-hidden`; delnummer i gul cirkel och tidspill).
- 7: oförändrat, men en ny rad som anger att skissen ligger på gräsgrön yta i planeringsläget och att utskriften förblir svartvit.

**Om B väljs:** som A för typografi och avstånd, men dessutom ny palett (marin/orange), ny knappfärg i mörkt läge, avsnitt 7 skrivs om (passvyns skiss blir full kortbredd, 16:10, och byt övning-vyn behåller miniatyr), och tillägg om passrutten med numrerade markörer.

**Om C väljs:** ny palett (svart/vit/gul), primärfärgen ändras från grön till svart (ljust) och gul (mörkt), kantbredd 3 px och hård skugga som nya komponentegenskaper, rubriker i versaler, och beslut om ett självhostat OFL-typsnitt i avsnitt 3. Avsnitt 7 oförändrat. Skisserna för utskrift (`07`) och planläge (`06`) kan förenklas, eftersom språket är nästan detsamma.

Eftersom `app.css` bara innehåller tokens (färger, avstånd) är bygget för A och C i första hand en tokenändring plus delrubriken och sidhuvudet. Det avgörs av senior-systemutvecklare.

---

## 9. Användarens beslut 2026-10-12

| # | Fråga | Beslut |
|---|---|---|
| 1 | Vilken riktning? | **A, Gräsmattan.** Lånen i avsnitt 7 ("svart delskylt från C" om siffercirklarna inte räcker i test, och "tryck på miniatyren" från B) står kvar som de är. Det andra är redan beslutat vid K2 (avsnitt 7 i `designsystem.md`). |
| 2 | Ikoner | **Ja:** vi ritar en liten egen SVG-uppsättning i repot: boll, varning, gult kort, droppe och bakåtpil. Beskrivs i `designsystem.md` 6.11. |
| 3 | Skissens storlek i passvyn | **Nej.** Miniatyren behålls (96 × 72 px som byggt) och visas stor vid tryck, enligt K2. |
| 4 | Typsnitt | **Inget nytt.** Frågan gällde bara C. Systemets typsnitt behålls, med `ui-rounded` först i stacken. |

## 10. Vad som ändrades i `designsystem.md`

Enligt avsnitt 8 för riktning A. Ändringsloggen längst ner i `designsystem.md` har samma uppgifter.

- **2.1 och 2.2:** ny palett med kontrastvärden för ljust och mörkt läge. Nya roller: Accent (matchgul), Sidhuvud, Kortkant, Valt val. Fältkanten är nu `#7C8F80`/`#6F8A76` (minst 3:1).
- **2.4:** statusfärgerna kontrollräknade mot de nya korten. Den ljusblå statusfärgens värde rättat (6,3:1, inte 5,6:1), och "Åtgärda" i mörkt läge följer felfärgen `#F08A80`.
- **3:** typsnittsstack med `ui-rounded` och en storlekstabell (32/800, 18/800 versaler, 17/700, 16, 15, aldrig under 14).
- **4:** avstånd mellan delar och hörnradier.
- **6.1, 6.3, 6.4, 6.5:** knappar, kort och passets övningskort, varning som gult kort, val-piller.
- **Nytt 6.10:** sidhuvud med gräsränder, passdelens siffra, tidspill, vattenpaus, avslutningsrad.
- **Nytt 6.11:** ikonuppsättningen.
- **7:** raden för passvyn bekräftar miniatyren, med förstoring vid tryck.
- **Nytt 10:** planskissens `--skiss-*`-värden för ljust och mörkt läge (två nya variabler).
- **Oförändrat:** planläget (2.3), utskriften, träffytor (avsnitt 5) och WCAG-tabellen (avsnitt 8).

## 11. Byggbeskrivning

Se `docs/design/visuell-design-byggbeskrivning.md`.
