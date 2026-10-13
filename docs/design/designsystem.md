Status: godkänd (K2, 2026-09-12)

> **Ändringar 2026-10-12 är utkast tills användaren godkänt dem.** Användaren valde 2026-10-12 riktning A, Gräsmattan (se `visuell-design-forslag.md`). Avsnitt 2.1, 2.2, 2.4, 3, 4, 6.1, 6.3–6.5, 6.10, 6.11, 7 och 10 är uppdaterade efter det beslutet, och ändringarna är listade sist i dokumentet. Statusraden ovan gäller K2-versionen och ändras bara av användaren.

# Designsystem – Fotbollsbanken

Det här dokumentet beskriver färger, typografi, avstånd, komponenter och tillgänglighetskrav som gäller genom hela appen. Tekniskt genomförande (CSS-ramverk, komponentbibliotek) beslutas vid K2 av senior-systemutvecklare – det här dokumentet är teknikoberoende och beskriver *vad* som ska uppnås, inte *hur* det byggs.

Kontrastvärden nedan är beräknade med WCAG:s relativa luminans-formel (samma metod som WebAIM:s kontrastverktyg använder). De ska kontrolleras igen mot de faktiska pixelvärdena när komponenterna byggs, eftersom typsnitt, kantutjämning och skärm kan påverka den upplevda läsbarheten även när siffrorna klarar gränsen.

---

## 1. Tre lägen, inte två

Appen har tre färgtemat, inte bara ljust/mörkt:

1. **Ljust läge** – standard i planeringsläget på dagtid.
2. **Mörkt läge** – standard i planeringsläget i svagt ljus (kvällsplanering i soffan).
3. **Planläget** – ett eget, extra kontrastrikt tema som används *bara* i genomförandeläget (`skisser/06-planlage.md`), oavsett om enheten i övrigt står i ljust eller mörkt läge. Planläget prioriterar läsbarhet i starkt solljus över allt annat, inklusive grafisk finess.

Ljust och mörkt läge följer enhetens systeminställning som förval, med möjlighet att byta manuellt. Planläget växlar automatiskt in när planläget startar och växlar tillbaka när det avslutas.

---

## 2. Färger

Paletten gäller från beslutet om riktning A, Gräsmattan (2026-10-12, se `visuell-design-forslag.md`). De gröna primärfärgerna är desamma som tidigare. Bakgrund, kort, text och varning har nya värden, och två nya roller har tillkommit: *Accent* och *Sidhuvud*. Kontrasten är beräknad med samma formel som ovan.

### 2.1 Ljust läge

| Roll | Färg | Hex | Används mot | Kontrast | Klarar |
|---|---|---|---|---|---|
| Bakgrund | Ljus gräsgrön-vit | `#F4F7EE` | – | – | – |
| Yta/kort | Vit | `#FFFFFF` | Text primär ovanpå | 16,3:1 | AAA |
| Text, primär | Mörk skogsgrön-svart | `#14231A` | Kort `#FFFFFF` / bakgrund `#F4F7EE` | 16,3:1 / 15,1:1 | AAA |
| Text, sekundär | Mörk gröngrå | `#46564B` | Kort `#FFFFFF` / bakgrund `#F4F7EE` | 7,8:1 / 7,2:1 | AAA |
| Primär/knapp (grön) | Fotbollsgrön | `#0B6B3A` | Vit text `#FFFFFF` | 6,6:1 | AA (text), AA (UI) |
| Sidhuvud | Djup gräsgrön | `#0B5A31` | Vit text `#FFFFFF` | 8,3:1 | AAA |
| Accent (siffercirkel, slutrad) | Matchgul | `#FFD23F` | Text `#14231A` | 11,3:1 | AAA |
| Fel, röd | Tegelröd | `#B3261E` | Kort `#FFFFFF` / bakgrund `#F4F7EE` | 6,5:1 / 6,0:1 | AA |
| Varning, bakgrund (gult kort) | Ljus gul | `#FFF1C2` | Text `#5C3A00` | 9,0:1 | AAA |
| Länk | Samma som primär | `#0B6B3A` | Bakgrund `#F4F7EE` / kort | 6,1:1 / 6,6:1 | AA |
| Fältkant, valkant | Gröngrå | `#7C8F80` | Kort / bakgrund | 3,4:1 / 3,2:1 | AA (icke-text, 3:1-krav) |
| Kortkant | Ljus gröngrå, 2 px | `#C9D3C4` | – (dekorativ, kortet har dessutom en skugga, se 6.3) | 1,5:1 mot vitt | – |
| Valt val (piller) | Mörkgrön fyllning, vit text och ✓ | `#0B5A31` | Vit text `#FFFFFF` | 8,3:1 | AAA |
| Fokusram | Fotbollsgrön, 3 px | `#0B6B3A` | Bakgrund `#F4F7EE` / kort | 6,1:1 / 6,6:1 | AA (icke-text, 3:1-krav) |

### 2.2 Mörkt läge

| Roll | Färg | Hex | Används mot | Kontrast | Klarar |
|---|---|---|---|---|---|
| Bakgrund | Mörk skogsgrön | `#0D1A12` | – | – | – |
| Yta/kort | Mörk grön | `#16271C` | Text primär ovanpå | 14,0:1 | AAA |
| Text, primär | Nästan vit, grönton | `#EEF4EA` | Bakgrund `#0D1A12` / kort `#16271C` | 16,0:1 / 14,0:1 | AAA |
| Text, sekundär | Ljus gröngrå | `#B9C7BC` | Kort `#16271C` | 8,9:1 | AAA |
| Primär/knapp (grön) | Ljus fotbollsgrön | `#57C98A` | Mörk text `#0D1A12` | 8,6:1 | AAA |
| Primär som länk/text | Ljus fotbollsgrön | `#57C98A` | Kort `#16271C` | 7,6:1 | AAA |
| Sidhuvud | Mörk gräsgrön | `#123422` | Text `#EEF4EA` | 12,2:1 | AAA |
| Accent (siffercirkel, slutrad) | Matchgul | `#FFD23F` | Text `#14231A` | 11,3:1 | AAA |
| Fel, röd | Ljus tegelröd | `#F08A80` | Kort `#16271C` | 6,5:1 | AA |
| Varning, bakgrund (gult kort) | Mörk gul-brun | `#3A2E10` | Text `#FFE08A` | 10,3:1 | AAA |
| Fältkant, valkant | Gröngrå | `#6F8A76` | Kort `#16271C` | 4,2:1 | AA (icke-text) |
| Kortkant | Mörk grön, 2 px | `#2C4533` | – (dekorativ, se 6.3) | – | – |
| Valt val (piller) | Ljusgrön fyllning, mörk text och ✓ | `#57C98A` | Text `#0D1A12` | 8,6:1 | AAA |
| Fokusram | Ljus fotbollsgrön, 3 px | `#57C98A` | Bakgrund `#0D1A12` / kort | 8,6:1 / 7,6:1 | AA (icke-text) |

Planläget (2.3) påverkas inte av paletten ovan. Det har egna färger, och ingen gräsrand, gul accent eller dekor används där.

### 2.3 Planläget (hög kontrast för sol)

Planläget använder de mest extrema kombinationerna som går: ren svart text på ren vit botten som standard, med ett mörkt alternativ som följer enhetens systemval men behåller samma extrema kontrast.

| Roll | Ljust underläge | Mörkt underläge |
|---|---|---|
| Bakgrund | `#FFFFFF` | `#000000` |
| Text | `#000000` (21:1) | `#FFFFFF` (21:1) |
| Timer, normal | Text `#000000` på `#FFFFFF`, ram `#0B6B3A` 4 px | Text `#FFFFFF` på `#000000`, ram `#57C98A` 4 px |
| Timer, tiden slut | Bakgrund `#B3261E`, text `#FFFFFF` (6,5:1) + ikon + text "TIDEN ÄR SLUT" | Bakgrund `#E4685D`, text `#000000` (8:1) + samma text |
| Knappar | Text `#000000` på `#FFFFFF` med 3 px svart ram | Text `#FFFFFF` på `#000000` med 3 px vit ram |

**Princip:** i planläget bär ingen information bara av en färgnyans. Timerns "tiden slut"-tillstånd har alltid både färgbyte, ram, ikon och text samtidigt, eftersom starkt solljus kan göra subtila färgskillnader osynliga och eftersom vissa ledare är färgblinda.

### 2.4 Statusfärger för övningar (redaktörskö, egna övningar)

En egen övning som klubben äger har **ingen granskningsstatus** – bara en härledd komplett-markering. Först när den skickas in får den en status i redaktörskön. En övning visar aldrig båda samtidigt (`docs/adr/0010-ovningsformat-och-lagring.md`, avsnitt 4). Ordet "Utkast" förekommer inte i appen – det är bara en filstatus i `content/ovningar/`.

| Markering | Sammanhang | Färg (ljust) | Färg (mörkt) | Alltid tillsammans med text |
|---|---|---|---|---|
| Ofullständig | Egen övning, ej inskickad | Grå `#595959` | Grå `#C7C7C7` | "Ofullständig" |
| Klar att använda | Egen övning, ej inskickad | Grön `#0B6B3A` | Ljusgrön `#57C98A` | "Klar att använda" + ✔ |
| Inskickad, väntar på granskning | `submissions.status` | Blå `#1A5FB4` (6,3:1 mot vitt kort, 5,8:1 mot bakgrunden `#F4F7EE`) | Ljusblå `#7AB0F5` (7,0:1 mot kortet `#16271C`) | "Inskickad, väntar på granskning" |
| Godkänd | `submissions.status` | Grön `#0B6B3A` | Ljusgrön `#57C98A` | "Godkänd" + ✔ |
| Åtgärda | `submissions.status` | Röd/orange `#B3261E` | `#F08A80` (följer felfärgen i 2.2) | "Åtgärda" + varningstriangeln (6.11) |

Statusfärgerna är kontrollräknade mot de nya korten i 2.1 och 2.2 (grå `#595959` mot `#F4F7EE` 6,5:1 och `#C7C7C7` mot `#16271C` 9,3:1, båda över 4,5:1). Den ljusblå färgen i mörkt läge och den gröna är oförändrade.

---

## 3. Typografi

- **Typsnitt:** systemets egna typsnitt, inget nedladdat och inga externa typsnittstjänster (beslut 2026-10-12). Stacken är `ui-rounded, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`. `ui-rounded` ger avrundade former på Apple-enheter och faller tillbaka på systemets vanliga sans serif på övriga, vilket är medvetet. Det ger snabb inladdning utan extra kostnad och följer användarens tillgänglighetsinställningar (textstorlek, fetstil).
- **Storlekar och vikter, planeringsläget** (rem vid 16 px basstorlek):

  | Användning | Storlek | Vikt |
  |---|---|---|
  | Vynamn (h1) | 32 px (2 rem) | 800 |
  | Delnamn i passet (h2), versaler, 0,03 em teckenavstånd | 18 px | 800 |
  | Övningens namn (h3) och fältetikett | 17 px | 700 |
  | Brödtext, syfte | 16 px | 400 |
  | Nyckeltal (yta, grupper), hjälptext, tidspill | 15 px | 400 respektive 600 för tidspillen |
  | Minsta storlek var som helst | 14 px | – |

  Sidans varumärkesrad ("Fotbollsbanken" i sidhuvudet) är 15 px/700.
- **Basstorlek, planeringsläget:** 16 px (1 rem) för brödtext, aldrig mindre än 14 px någonstans i gränssnittet.
- **Basstorlek, planläget:** minst 20 px för brödtext och etiketter, minst 48 px för timerns siffror, minst 24 px för övningens namn. Planläget skalar aldrig ner för att få plats – innehållet radbryts eller skrollar i stället.
- **Radavstånd:** minst 1,5 gånger textstorleken i brödtext (WCAG 1.4.8/1.4.12-anpassat, gynnar läsbarhet i stress och dåligt ljus).
- **Rubriknivåer:** en tydlig hierarki per vy (h1 för vynamnet, h2 för sektioner som passets delar), så att skärmläsarnavigering blir begriplig.
- **Textstorlek ska kunna förstoras** till minst 200 % i webbläsaren utan att innehåll eller funktion går förlorad (WCAG 1.4.4).

---

## 4. Avstånd och grid

- **Basenhet:** 8 px. Marginaler och padding följer skalan 4, 8, 12, 16, 24, 32, 48 px.
- **Sidmarginal, mobil (360 px):** 16 px vänster/höger.
- **Avstånd mellan kort/sektioner:** 16–24 px, så att gränsen mellan två övningar aldrig är otydlig ens i solljus.
- **Avstånd mellan intilliggande träffytor:** minst 8 px, så att två knappar inte råkar tryckas samtidigt med våta fingrar eller handskar.
- **Avstånd mellan passets delar (h2 till h2):** 32 px. Mellan delrubrik och kort 12 px, kortets innerpadding 16 px.
- **Hörnradier (riktning A):** kort 16 px, passkortets planskissruta 10 px, varningskort och sekundärknappar 14–16 px, textfält 12 px, val-piller helt runda (999 px). Radierna är dekor och påverkar inga träffytor.

---

## 5. Träffytor

- **Minsta träffyta för alla interaktiva element: 48 × 48 px**, genomgående i hela appen (överstiger WCAG 2.2:s minimikrav på 24 × 24 px i kriterium 2.5.8, vilket är medvetet eftersom appen används utomhus, ofta med handskar).
- **Planläget:** navigeringsknappar och timerkontroller är minst 56 × 56 px, eftersom de används mest under stress och med en hand.
- Träffytan får vara större än den synliga knappen (osynlig utfyllnad), så att en liten ikonknapp ändå uppfyller kravet.

---

## 6. Komponenter

### 6.1 Knappar

- **Primär:** fylld bakgrund i primärfärgen, används för det huvudsakliga handlingssteget per vy (till exempel "Generera pass", "Spara pass", "Godkänn"). Högst en primärknapp synlig samtidigt i normala vyer. Hörnradie 16 px, höjd minst 56 px i den fasta knappraden längst ner (annars minst 48 px), text 18 px/700. I ljust läge har knappen en 3 px markerad undre kant i `#07502A`, i mörkt läge ingen extra kant (primärfärgen är då så ljus att den bär själv).
- **Sekundär:** kantlinje (2 px, fältkantens färg), transparent bakgrund, text i vanlig textfärg, används för alternativa handlingar ("Ändra uppgifter", "Avbryt"). Samma hörnradie som primärknappen, 16 px.
- **Destruktiv:** röd/tegelfärgad, används bara för oåterkalleliga handlingar ("Ta bort övning", "Arkivera lag"), alltid efter en bekräftelse.
- **Tillstånd:** vila, fokus (3 px synlig ram, aldrig bara skugga), tryckt, inaktiverad (fortsatt 4,5:1 textkontrast där möjligt; annars kompletterad med förklarande text, se `04-byt-ovning.md`).
- Text på knappar beskriver alltid handlingen, aldrig bara "OK" eller "Skicka" utan sammanhang (se `texter.md`).

### 6.2 Formulärfält

- Synlig etikett ovanför fältet (aldrig bara platshållartext som enda etikett).
- Hjälptext under fältet vid behov, i sekundär textfärg.
- Fel visas under fältet, i felfärg, med text (inte bara röd ram) och kopplas till fältet för skärmläsare.
- Kryssrutor och radioknappar har hela raden (etikett + ruta) som träffyta.

### 6.3 Kort (övning, pass, lag, klubb)

- Ram eller lätt skugga mot bakgrunden (aldrig bara en färgskiftning som enda avgränsning, för att fungera i svartvit utskrift och för synnedsättning).
- Innehållsordning: namn/titel → nyckeltal (tid, antal spelare, fokus) → åtgärdsknappar.
- **Utseende (riktning A):** vit (ljust) eller mörkgrön (mörkt) yta, 2 px kant i kortkantens färg (2.1, 2.2), hörnradie 16 px, 16 px innerpadding och en 2 px skugga rakt under kortet (`0 2px 0` i kantfärgen). Kantens kontrast mot sidans bakgrund är låg (1,5:1 i ljust läge), vilket är medvetet för ett kort som inte är en kontroll: kortets innehåll, knappar och planskissens ram bär avgränsningen och skuggan förstärker den. Det gäller bara kort. Fält, knappar och val har alltid kant på minst 3:1.
- **Passets övningskort:** rutnät med två kolumner: planskissen (96 × 72 px, som byggt, 2 px kant i fältkantens färg, hörnradie 10 px) till vänster, och övningens namn, minuter och syfte till höger. Gruppindelning, yta, ytförklaring och knappar ligger under över hela kortets bredd. Planskissen är en knapp som förstoras vid tryck, som i avsnitt 7. Eftersom miniatyren är en kontroll gäller regeln för kontroller, inte för kort: kanten är `--color-field-border` (`#7C8F80` ljust, 3,4:1 mot kortets vit; `#6F8A76` mörkt, 4,2:1 mot kortet), enligt WCAG 1.4.11. Miniatyrens egen fyllning och ritning bär inte avgränsningen (fyllningen är nästan lika ljus som kortet), så kanten får inte vara kortkantens färg (1,5:1). Utfälld ändras kanten till `--color-primary`. Bilderna i Byt övning är samma komponent och samma förstoringsknapp, alltså också kontroller, och har samma kant (`--color-field-border`) och samma utfällda kant. Namnet står till vänster och minuterna till höger på samma rad och radbryter fritt.

### 6.4 Meddelanden (info, tips, varning, fel)

Fyra typer, som alltid kombinerar ikon + färg + text (aldrig bara färg):

| Typ | Ikon | Exempel |
|---|---|---|
| Info | ⓘ | Hjälptext om hur ålder tolkas |
| Tips | 💡 | Tips om fler ledare (R-021) |
| Varning, påminnelse i passet | Gult kort (6.11) | Benskyddspåminnelse, mål-påminnelse |
| Varning, övrig | Varningstriangel (6.11) | Åldersvarning i säsongsplan, varning om att något saknas |
| Fel | ⛔ | Ogiltigt fält, inloggning misslyckades |

**Varning som gult kort (riktning A):** påminnelserna i passet visas som en ruta med varningsfärgen från 2.1/2.2 som bakgrund, 2 px kant i en ton av samma färg (`#E9C453` ljust, `#6B5518` mörkt), hörnradie 14 px, 12 px padding, ikonen "gult kort" till vänster och texten till höger. Ikonen är dekorativ (`aria-hidden`) och texten förmedlar hela innebörden utan den. Rutan ligger direkt under sammanfattningen, före passets första del, som tidigare. Tips-rutan (R-021) och informationsrader behåller sina egna ikoner och använder samma ruta, med kantfärg som är en ton av respektive bakgrund.

Ikonerna för Info, Tips och Fel är tecken tills vidare, eftersom ikonuppsättningen i 6.11 bara omfattar fem ikoner. De kan ritas om i samma stil senare utan nytt beslut.

### 6.5 Statustagg (chip)

Används för fokusområden, spelform, nivå och övningsstatus. Textbaserad, inte färg-only. Radbryts fritt på smal skärm, aldrig avklippt.

**Val-piller (riktning A):** val av spelform, nivå och yta i underlaget, samt sammanfattningen överst i ett pass, visas som runda piller med 2 px kant. Ett valt val har fyllning i "Valt val" (2.1, 2.2) och en ✓ före texten. ✓ ritas som dekor och ligger inte i det tillgängliga namnet (använd `content: "✓" / ""` eller ett `aria-hidden`-element), eftersom radioknappens markerade tillstånd redan läses upp. Minst 48 × 48 px, 8 px mellan pillren. Sammanfattningen överst i passet är en lista med korta piller (11 år, 7 mot 7, Fortsättning, 12 spelare, 2 ledare, 60 min) som inte är klickbara och därför ingen 48 px-yta.

### 6.6 Flikar (tabs)

Används i "Sparade pass" (Mina pass/Lag) och i säsongsöversikten (perioder). Tangentbordsnavigerbara, tydligt vald flik med både färg och understrykning/kant.

### 6.7 Utfällbar panel (accordion)

Används för "Visa mer" i pass-vyer och för fokusgrupper i underlaget. `aria-expanded` krävs. Fällda paneler döljer innehållet helt för skärmläsare (inte bara visuellt), så att navigeringen inte blir onödigt lång.

**Fokusgrupperna i underlaget är inte hopfällbara** (beslut vid granskningen 2026-10-12). De visas alltid öppna och får därför ingen ▸/▾-markör: en pil som inte går att trycka på vore vilseledande. Gruppen avgränsas av en linje i kortkantens färg ovanför och gruppnamnet i 700. Markören ▸/▾ införs först om grupperna görs hopfällbara (en funktionsändring med egen berättelse), och då som i stycket ovan.

**Symbolen "▾" i wireframes** (klargjort vid granskningen av ytförklaringen, 2026-09-28) markerar bara för ögat att kontrollen fäller ut eller ihop – den är inte del av knapptexten. Knapptexten är alltid den som står ordagrant i `texter.md`, till exempel "Visa mer"/"Visa mindre", utan "▾". Vill man visa en pil i det byggda gränssnittet ska den vara en dekorativ ikon (`aria-hidden`), aldrig inbakad i den klickbara texten eller i det tillgängliga namnet.

**Länkliknande utfällningsknapp** (tillagt vid samma granskning): en utfällningsknapp får se ut som en textlänk (primärfärg, understruken, ingen kantlinje) i stället för en kantad knapp, när den är en mindre framträdande hjälp till ett annat innehåll på kortet snarare än korets huvudhandling – till exempel ytförklaringen i `skisser/02-genererat-pass.md`, som annars skulle konkurrera visuellt med "Byt övning" och "Visa mer". Kraven i avsnitt 5 (minst 48 × 48 px träffyta) och avsnitt 8 (fokusram, kontrast) gäller som vanligt. Understrykningen är ett medvetet val, inte bara ett estetiskt: eftersom knappen ser ut som en länk ska den även vara urskiljbar utan att bara luta sig mot färg (WCAG 1.4.1).

### 6.8 Dialog/modal

Används för bekräftelser (ta bort, arkivera) och för att skicka åtgärda-kommentar. Fångar tangentbordsfokus, går att stänga med Escape, återger fokus till utlösande knapp vid stängning. Får aldrig vara det enda sättet att nå kritisk information (WCAG 2.4.11 – fokuserat innehåll får inte skymmas av annat gränssnitt, t.ex. en sticky-knapp som täcker en dialogs bekräftelseknapp).

### 6.9 Timer (planläget)

Se `skisser/06-planlage.md`. Egen komponent med tre tillstånd (redo, går, tiden slut) som var och en har unik kombination av färg, ram, ikon och text.

### 6.10 Sidhuvud, passdel och tidspill (riktning A)

Gäller bara planeringsläget. Planläget (2.3) och utskriften har ingen av dekorerna nedan.

**Sidhuvud.** Ett band över hela bredden överst i varje vy med en h1: bakgrund "Sidhuvud" (2.1, 2.2) med klippta gräsränder, det vill säga lodräta band om 36 px där vartannat band är något ljusare (bakgrunden blandad med 12 % vitt), samt en 4 px gul list (`#FFD23F`) under. Överst i bandet står varumärkesraden: bollikonen och ordet "Fotbollsbanken" (15 px/700). Därunder h1 (32 px/800) i vit (ljust) eller `#EEF4EA` (mörkt) text. Som dekor ligger en halv mittcirkel (diameter 150 px, 3 px linje, vit med 28 % täckning) och en lodrät mittlinje vid högerkanten. Dekorerna är rena bakgrunder (`::before`/`::after`), inte innehåll, och de påverkar inte textens kontrast, som är räknad mot den ljusare av de två bandfärgerna: vit text mot `#0E6636` 7,1:1. Bandet får inte innehålla knappar eller länkar som är mindre än 48 px. Bakåt, om det behövs, ritas med bakåtpilen (6.11) och texten "Ändra uppgifter" eller vynamnet, aldrig bara pilen. I Byt övning ligger "Tillbaka till passet" med bakåtpil i bandet, mellan varumärkesraden och h1 (beslut vid granskningen 2026-10-12): kontur 2 px i bandets textfärg, transparent bakgrund, minst 48 px hög. **Fokusramen i bandet är vit** (`--color-on-header`, 3 px, 2 px avstånd): den gröna fokusramen syns inte mot det gröna bandet, och vit mot bandet är minst 7:1.

**Smal skärm och stor text.** Under 20 em (320 px, vilket inträffar vid 200 % sidzoom på 390 px) blir övningskortet en kolumn och passets knapprad ligger i flödet i stället för att vara fast (godkänt vid granskningen). Det gäller bara när webbläsaren zoomar sidan. Vid enbart förstorad teckenstorlek (Androids inställning) är bredden oförändrad och knappraden är fast, men bara så länge den inte tar mer än en fjärdedel av den synliga höjden. Tar den mer (uppmätt: 171 px av 640 px, 27 %, vid 200 % text på 360 × 640) ligger den i flödet i stället. Kravet gäller höjden och inte bredden, och hur det genomförs (mätning av radens höjd eller mediefråga i höjd) väljer senior-systemutvecklare. Mediefrågan på bredd i em behöver inte ändras: den styr bara det som sker vid sidzoom, och när den slår till av en annan orsak, till exempel en större grundstorlek i webbläsaren, blir följden att knappraden ligger i flödet, vilket är säkert. Passrubriken (siffra, delnamn, tidspill) ska radbrytas som hela ord, aldrig mitt i ett ord. Under 320 px bredd med stor text är ett enskilt långt ord (till exempel delnamnet "Uppvärmning" vid 200 % text) tillåtet att gå utanför kanten, hellre än att brytas mitt i; 320 px är den smalaste bredden som krävs (1.4.10).

**Passdel (h2).** En rad: en rund siffra, delnamnet i versaler och tidspillen längst till höger.
- **Siffran:** cirkel 36 × 36 px med accentfärgen `#FFD23F`, siffra 17 px/800 i `#14231A` (11,3:1). Siffran är dekor (`aria-hidden`); den tillgängliga rubriken är "{n}. {delnamn}". Det gäller alla fem delarna, även Avslutning.
- **Delnamnet:** 18 px/800, versaler via CSS (texten i koden är fortfarande "Uppvärmning", så skärmläsare påverkas inte).
- **Tidspillen:** "{n} min", 15 px/600, pill med 2 px kant i kortkantens färg, kortets bakgrund och vanlig textfärg, padding 0 12 px, hörnradie 999 px.
- Vid tom del ("Övning saknas") används samma rad, och måltiden står i tidspillen.

**Vattenpaus.** Rad med droppikonen (6.11) i primärfärgen och texten "Vattenpaus · 2 min" i sekundär textfärg, 600. Ingen ram.

**Avslutningsraden.** Texten under delrubriken står i en ruta med kortets bakgrund, en 6 px bred gul vänsterkant och rundade hörn (12 px).

**Sticky knappraden längst ner** har sidans bakgrundsfärg, en 1 px linje i kortkantens färg och en svag skugga uppåt. Den får aldrig täcka fokus (WCAG 2.4.11), alltså ska sidan ha fri nederkant motsvarande knappradens höjd.

### 6.11 Ikoner

Appen har en egen liten ikonuppsättning (beslut 2026-10-12): fem enkla SVG-ikoner som ritas i repot, utan ikonbibliotek och utan extern tjänst. Samma uppsättning används i alla vyer.

| Ikon | Används för |
|---|---|
| Boll | Varumärkesraden i sidhuvudet. Får också användas som dekor på tomma tillstånd. |
| Varningstriangel | Varningar som inte är en påminnelse i passet (åldersvarning, "Åtgärda" i redaktörskön, överskriden gräns) |
| Gult kort | Påminnelserna i passet (benskydd, mål). Ett upprätt, något lutat rektangulärt kort. |
| Droppe | Vattenpaus |
| Bakåtpil | Tillbaka-knappen i sidhuvudet och i vyer med "Ändra uppgifter" |

Regler:
- Ritas på ett 24 × 24-raster och fylls eller linjeritas med `currentColor`, så att färgen följer sammanhanget och fungerar i ljust, mörkt läge och planläge. Linjetjocklek 2 px, rundade ändar.
- Visas i 1,25 em (20 px vid 16 px brödtext). Alltid `aria-hidden="true"` och `focusable="false"` när de står bredvid en text som förmedlar samma sak. En ikon som är hela innehållet i en knapp (till exempel bakåtpilen) får ett tillgängligt namn på knappen, och träffytan är minst 48 × 48 px (avsnitt 5).
- Ikoner förmedlar aldrig något ensamma (avsnitt 8, 1.4.1).
- Ikonerna ligger samlade i en enda fil i repot (ett SVG-"sprite" eller en liten komponent per ikon) och är en del av koden, inte av `content/`, så att de omfattas av kodens licens (Apache-2.0).

### 6.12 Huvudmeny (inkrement 3, utkast)

Se `skisser/16-navigering.md`. Under 720 px: en disclosure-knapp "Meny" (minst 48 × 48 px, synlig text) längst till höger på varumärkesraden i sidhuvudet (6.10) som fäller ut en lista under bandet. Raderna är minst 56 px höga, den aktuella markeras med `aria-current="page"`, fet stil och understrykning, och "Logga ut" ligger sist, skild av en linje. Från 720 px ligger punkterna i en rad i bandet. Fokusramen i bandet är vit, som i 6.10. Menyn finns inte i planläget och inte på utskrift. Det är ingen `role="menu"`, utan en `nav` med en vanlig länklista.

### 6.13 Varningsruta för oåterkalleliga följder (inkrement 3, utkast)

Används för "Klubben {klubbnamn} raderas också" i `skisser/15-radera-konto.md` och för arkiveringsvarningen i `skisser/13-klubbadmin-lag.md`. Samma ruta som varning, övrig (6.4): varningstriangeln (6.11), varningsfärgen som bakgrund och 2 px kant, men rubriken är en riktig rubrik (h2) i 700, och rutan ligger högst upp i vyn eller dialogen, aldrig bakom en panel. Två olika följder (till exempel "laget tas bort från listorna" och "efter 24 månader rensas laget och dess pass") får var sin ruta i stället för en lång mening. Knappen under rutan är destruktiv (6.1) och säger vad som händer.

---

## 7. Planskisser i vyerna

Själva ritningen av en planskiss (SVG från skissdata) ägs av planskissutvecklaren. Det här avsnittet styr bara hur skissen ska rymmas i respektive vy:

| Vy | Storlek/plats | Krav |
|---|---|---|
| Genererat/sparat pass (`02`) | Litet kort, 96 × 72 px (4:3, som byggt i inkrement 2) i en förstoringsknapp med 2 px kant i fältkantens färg (6.3), till vänster om texten (se 6.3) | Klickbar för att förstora (öppnar större vy eller "Visa mer"). Beslut 2026-10-12: miniatyren behålls och förstoras vid tryck, skissen görs inte till full kortbredd i passvyn |
| Byt övning (`04`) | Samma miniatyrformat och samma förstoringsknapp som ovan, i varje alternativkort | Miniatyren är en kontroll även här (kant enligt 6.3) |
| Planläget (`06`) | Stort, minst 70 % av skärmbredden, centralt placerat direkt under timern | Måste vara läsbar utan att zooma (19.3); proportionerlig oavsett spelform |
| Utskrift (`07`) | Fast bredd cirka 45 mm i A4-layouten, svart på vit, inga färgberoende linjer | Måste fungera i svartvit utskrift |
| Skapa egen övning (`10`) | Inget skissfält alls | Version 1 har ingen ritredigerare (beslutat i backlogen). En egen övning saknar alltid planskiss och visas med "Planskiss saknas", enligt den genomgående regeln nedan – formuläret lovar ingen ritfunktion |
| Redaktörskö (`12`) | Samma storlek som i pass-vyn, för att redaktören ska se samma sak som ledaren kommer se | – |

Genomgående regel: saknas skissdata visas alltid en tydligt inramad yta med texten "Planskiss saknas" i samma mått som skissen skulle haft, aldrig en tom lucka eller ett brutet bildikon (06.2, 07.2, jämför komponent 6.3). Är skissdatan ogiltig visas på samma sätt texten "Planskissen kunde inte visas" (06.3, 07.3, ADR 0012 avsnitt 7), så att ett fel inte kan tas för en skiss som ännu inte är ritad.

---

## 8. Hur WCAG 2.2 nivå AA uppfylls (urval, styr genomförandet)

| Kriterium | Hur det uppfylls här |
|---|---|
| 1.4.3 Kontrast (minimum) | Alla textfärger ovan är beräknade till minst 4,5:1 (normal text) eller 3:1 (stor text/UI), se tabellerna i avsnitt 2. |
| 1.4.11 Kontrast för icke-text | Ramar, fokusindikatorer och ikoner har minst 3:1 mot sin bakgrund. |
| 1.4.1 Användning av färg | Inget tillstånd (status, fel, varning, vald/ej vald) förmedlas enbart med färg – se komponenterna i avsnitt 6.4–6.5 och timerns tillstånd. |
| 1.4.4 Ändra textstorlek | Layouten tål 200 % textförstoring utan att innehåll eller funktion försvinner. |
| 1.4.10 Reflow | Inga horisontella scrollbara tabeller vid 360 px; listor och kort staplas i stället vertikalt. |
| 2.4.7 / 2.4.11 Fokus synligt / inte skymt | Fokusram enligt avsnitt 2, alltid minst 3 px, aldrig dold bakom sticky-element. |
| 2.5.8 Storlek på klickyta (minimum) | 48 × 48 px genomgående, se avsnitt 5 – klart över minimikravet på 24 × 24 px. |
| 2.5.7 Dragrörelser | Inga funktioner kräver drag-och-släpp (ordningen i planläget är låst, säsongsplanen har inga dra-kalendrar i version 1). |
| 3.3.7 Redundant inmatning | Namn/e-post frågas inte igen i samma flöde (t.ex. inbjudan förifyller e-post, se `14-inloggning.md`). |
| 3.3.8 Tillgänglig autentisering (minimum) | Det finns inget lösenord att komma ihåg (`docs/adr/0004-inloggning.md`). Inloggning sker med en engångskod som går att klistra in och som fylls i automatiskt av enheten (`autocomplete="one-time-code"`, se `skisser/14-inloggning.md`). Turnstile-kontrollen är i normalfallet osynlig/automatisk och kräver ingen kognitiv pusseluppgift som bild-CAPTCHA. |

Fullständig kontroll (till exempel automatiserad axe/Lighthouse-granskning och manuell skärmläsartest) görs av kvalitetssäkraren när komponenterna är byggda. Det här dokumentet anger målvärdena, inte ett genomfört testresultat.

---

## 9. Offline och anslutning

`docs/adr/0005-daligt-nat-och-offline.md` avgör vad som faktiskt fungerar utan nät. Det här avsnittet styr bara hur det syns för ledaren. Texterna finns i `texter.md`, avsnitt 15.

### 9.1 Anslutningsindikator

En smal rad högst upp i planeringsläget, aldrig i planläget (`skisser/06-planlage.md`), som aldrig hämtar något och inte ska störas av en statusrad ovanpå timern.

- **Visas** när appen saknar anslutning, eller när den senaste lyckade uppdateringen ligger en bit tillbaka.
- **Ikon + text, aldrig bara en färgprick**, med samma princip som komponent 6.4: "Ingen anslutning · Visar sparad data från {tidpunkt}".
- **Ljust läge:** bakgrund `#FFF6DA`, text `#6B4300` (samma som varningsrutan i 2.1).
- **Mörkt läge:** bakgrund `#3A2E10`, text `#F5D98A` (samma som varningsrutan i 2.2).
- **Skärmläsare:** raden finns i `aria-live="polite"`, så ändringen annonseras utan att ledaren behöver leta efter den.
- **Återställning:** när anslutningen kommer tillbaka och något hämtats på nytt visas kort "Uppdaterat", sedan försvinner raden.

### 9.2 Handlingar som kräver nät

Enligt ADR 0005 finns ingen kö som skickar en ändring automatiskt när nätet kommer tillbaka. Knappar för spara pass, koppla pass till säsongsplanen, skapa/ändra/skicka in/godkänna en övning, bjuda in, logga in och radera konto förblir klickbara (samma princip som `skisser/14-inloggning.md`: aldrig `disabled` utan förklaring), men visar vid tryck ett tydligt fel i stället för att låtsas köa handlingen:

> "Du verkar sakna internetanslutning. Det du skrivit finns kvar – försök igen när du är uppkopplad."

Ifyllt innehåll i formuläret rensas aldrig av detta fel.

### 9.3 Det som fungerar utan nät visar ingen indikator

Sparade pass, planläget och utskrift hämtar ingenting och ska kännas precis lika snabba och tillförlitliga utan nät som med, enligt tabellen "Det här fungerar utan nät" i ADR 0005. Anslutningsindikatorn (9.1) visas därför bara i vyer som faktiskt hämtar eller skriver mot servern.

---

## 10. Planskissens färger i planeringsläget (riktning A)

Det här avsnittet anger *vilka färger* planskissen ska ha i ljust och mörkt läge i planeringsläget. Hur den ritas (symboler, linjetyper, etiketter, kontrollen av trängsel) ägs av planskissutvecklaren (ADR 0012). Planskissmodulen har redan fasta CSS-variabler med namnet `--skiss-*` i `src/planskiss/planskiss.module.css`, och det är de som får nya värden. Planläget (`.planlage`), utskriften (`.utskrift`) och `@media print` behåller sina nuvarande svartvita värden oförändrade (2.3, avsnitt 7).

**Principen:** skissen ligger på en gräsgrön yta med vita linjer, som en plan, men all information bärs fortfarande av form, mönster och linjetyp, inte bara av färg. Lag A är fylld och lag B ofylld, som i ADR 0012 avsnitt 2. Inget i skissen förmedlas bara av gult eller orange.

| Variabel | Ljust läge | Mörkt läge | Roll och kontrast |
|---|---|---|---|
| `--skiss-yta` | `#3E8E4F` | `#357847` | Gräsyta, första ränder (ny nyans, se nedan) |
| `--skiss-yta-2` (ny) | `#46995A` | `#3B8350` | Gräsyta, andra ränder. Samma ränder löper över hela ytan, 9 enheter breda i skissens egen skala, och bär ingen information |
| `--skiss-linje` | `#FFFFFF` | `#FFFFFF` | Planlinjer, mål och rörelsepilar. Mot `--skiss-yta` 4,0:1 / 5,3:1 och mot `--skiss-yta-2` 3,5:1 / 4,6:1, alla över 3:1 (icke-text) |
| `--skiss-tunn` | `#FFFFFF` | `#FFFFFF` | Tunna hjälplinjer. Samma kontrast som linjerna, tunna linjer görs streckade i stället för blekare |
| `--skiss-monster` | `#FFFFFF` | `#FFFFFF` | Mönsterlinjer (streckning) |
| `--skiss-lag-a` | `#FFD23F` | `#FFD23F` | Lag A, fylld. Alltid med kant i `--skiss-lag-a-kant` |
| `--skiss-lag-a-kant` (ny) | `#14231A` | `#14231A` | Kant runt lag A och konen. Mot gult 11,3:1. Mot gräsytan 4,0:1 / 3,1:1 (ljust läge mot `--skiss-yta`, mörkt läge mot `--skiss-yta`), alltså minst 3:1 för figurens kontur i båda lägena. Kanten är minst 1,5 px |
| `--skiss-pa-lag-a` | `#14231A` | `#14231A` | Text eller nummer ovanpå lag A. Mot gult 11,3:1 |
| `--skiss-lag-b` | `#FFFFFF` | `#FFFFFF` | Lag B, ofylld: bara en vit kontur (2 px) mot gräset. Formen skiljer lagen åt som i dag |
| `--skiss-neutral` | `#FFFFFF` | `#FFFFFF` | Neutrala spelare, ofyllda som i dag, med vit kontur |
| `--skiss-ledare` | `#FFFFFF` | `#FFFFFF` | Ledare, med den form som ritmotorn redan ger |
| `--skiss-kon` | `#FF8A3D` | `#FF8A3D` | Konfyllning. Orange mot gräsytan är bara 1,7:1 / 2,3:1 och bär därför inget ensamt: konen är en triangel med mörk kant (`--skiss-lag-a-kant`) |
| `--skiss-text` | `#14231A` | `#14231A` | Etiketter och siffror. Står alltid på en ljus halo, så kontrasten blir 16,3:1 oavsett vad som ligger bakom |
| `--skiss-halo` | `#FFFFFF` | `#FFFFFF` | Halo bakom etiketter (samma teknik som i dag) |
| `--skiss-marginal` (ny) | samma som `--skiss-yta` | samma som `--skiss-yta` | Marginalen runt ytan (ADR 0012 avsnitt 1, 3 m åt alla håll) ritas som gräs, inte i kortets färg (beslut 2026-10-12 efter granskningen av helheten). Skälet: vita mål, köer och avbytare utanför ytan skulle annars försvinna mot det vita kortet. Marginalen har inga ränder och bär ingen information |
| `--skiss-bakgrund` | kortets yta (`#FFFFFF`) | kortets yta (`#16271C`) | Bara fallback utanför SVG:n. I planläget och på utskrift ritas ingen gräsmarginal, och bakgrunden är vit |
| Skissens ram | Ingen på den utfällda skissen. Miniatyrens knapp har 2 px fältkant (6.3) | Samma | Den utfällda skissen avgränsas av gräset självt (4,0:1 mot vitt kort i ljust läge, 2,9:1 mot kortet i mörkt, vilket räcker eftersom skissens kant inte är en kontroll och informationen bärs av de vita linjerna inuti). Ritas av vyn, inte av ritmotorn |

**Mörkt läge är lite ljusare än skissens gamla gröna** (`#357847` i stället för `#2F6E3E`), för att den mörka konturen på lag A och konen ska nå 3:1 mot gräset. I skissfilen `skisser/visuell/riktning-a-grasmattan.html` är mörkt läge ritat med de värden som gäller här. De två nya variablerna (`--skiss-yta-2`, `--skiss-lag-a-kant`) tillkommer eftersom en yta med ränder och en kontur i annan färg än fyllningen inte kan uttryckas med dagens variabler. Att lag B förblir ofylld på en färgad yta är en tolkning av ADR 0012 avsnitt 2 som planskissutvecklaren ska bekräfta; om det kräver ändrad fyllning ska det beslutas i en ny ADR och inte ändras här.

**Lag B med etikett (granskning av helheten 2026-10-12).** Etiketten (till exempel "B1") ritas på en vit halo, och i en så liten symbol fyller halon nästan hela kvadraten, så lag B ser vitfylld ut med mörk text. Det godtas: lagen skiljs åt av formen (kvadrat mot cirkel), etiketten är läsbar (16,3:1) och teckenförklaringens ofyllda kvadrat visar fortfarande formen. Utan etikett är kvadraten ofylld. Referensskissen i `skisser/visuell/riktning-a-grasmattan.html` ritar lag B vitfylld genomgående. Att göra B vitfylld också utan etikett vore ett byte av fyllning enligt ADR 0012 avsnitt 2 och kräver därför en ny ADR och användarens beslut; tills dess gäller ofylld enligt tabellen ovan, och skillnaden mot referensen är känd.

Skissens textetiketter (`--skiss-text` på `--skiss-halo`) är den enda text som ritas i skissen och kontrasten är den som är angiven ovan, inte kontrasten mot gräset.

---

## Ändringar efter K2

| Datum | Ändring |
|---|---|
| 2026-10-12 | Riktning A, Gräsmattan, vald av användaren (`visuell-design-forslag.md`). Nya paletter i 2.1 och 2.2 (bakgrund, kort, text, sekundär text, fel, varning, kant, nya roller *Accent*, *Sidhuvud*, *Kortkant*, *Valt val*), statusfärgerna i 2.4 kontrollräknade mot de nya korten (den ljusblå färgen stod som 5,6:1 mot vitt men är 6,3:1) och Åtgärda i mörkt läge följer nya felfärgen, typografin i avsnitt 3 (stack med `ui-rounded`, storlekstabell), avstånd och radier i avsnitt 4, knappar, kort, varning som gult kort, val-piller (6.1, 6.3–6.5), nya 6.10 (sidhuvud, passdel, tidspill, vattenpaus) och 6.11 (ikoner), uppdaterad rad för passvyn i avsnitt 7 och nytt avsnitt 10 (planskissens färger). Planläget (2.3) och utskriften är oförändrade. Statusraden ändras inte av en agent. |
| 2026-10-12 | Granskning av det byggda gränssnittet för riktning A: miniatyrknappens kant är fältkantens färg (6.3), fokusgrupperna får ingen ▸/▾ (6.7), bakåtknapp och vit fokusram i sidhuvudet samt beteende på smal skärm (6.10). |
| 2026-10-12 | Granskning av helheten (appen och planskisserna tillsammans): bilderna i Byt övning är kontroller och har samma kant som passets miniatyr (6.3, 7), knappraden fast bara om den tar högst en fjärdedel av höjden samt tillåtet långt ord vid stor text (6.10), marginalen runt skissen är gräs och utfälld skiss har ingen ram (avsnitt 10), lag B med etikett (avsnitt 10). |
| 2026-10-13 | Inkrement 3, utkast: nya komponenter 6.12 (huvudmeny) och 6.13 (varningsruta för oåterkalleliga följder). Inga färger eller mått ändras. Statusraden ändras inte av en agent. |
