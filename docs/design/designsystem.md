Status: godkänd (K2, 2026-09-12)

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

### 2.1 Ljust läge

| Roll | Färg | Hex | Används mot | Kontrast | Klarar |
|---|---|---|---|---|---|
| Bakgrund | Vit | `#FFFFFF` | – | – | – |
| Yta/kort | Ljusgrå-grön | `#F4F6F4` | Text primär ovanpå | 16,9:1 | AAA |
| Text, primär | Nästan svart | `#1A1A1A` | Bakgrund `#FFFFFF` | 17,4:1 | AAA |
| Text, sekundär | Mörkgrå | `#595959` | Bakgrund `#FFFFFF` | 7,0:1 | AAA |
| Primär/knapp (grön) | Fotbollsgrön | `#0B6B3A` | Vit text `#FFFFFF` | 6,6:1 | AA (text), AA (UI) |
| Fel/varning, röd | Tegelröd | `#B3261E` | Vit text `#FFFFFF` | 6,5:1 | AA |
| Varningsruta, bakgrund | Ljus gul | `#FFF6DA` | Text `#6B4300` | 8,0:1 | AAA |
| Länk | Samma som primär | `#0B6B3A` | Bakgrund `#FFFFFF` | 6,6:1 | AA |
| Ram/avgränsare | Ljusgrå | `#D6D9D6` | – (icke-text, dekorativ) | – | – |
| Fokusram | Fotbollsgrön, 3 px | `#0B6B3A` | Bakgrund `#FFFFFF` | 6,6:1 | AA (icke-text, 3:1-krav) |

### 2.2 Mörkt läge

| Roll | Färg | Hex | Används mot | Kontrast | Klarar |
|---|---|---|---|---|---|
| Bakgrund | Nästan svart | `#121212` | – | – | – |
| Yta/kort | Mörk grön-grå | `#1E2620` | Text primär ovanpå | ca 15:1 | AAA |
| Text, primär | Nästan vit | `#F2F2F2` | Bakgrund `#121212` | 16,7:1 | AAA |
| Text, sekundär | Ljusgrå | `#C7C7C7` | Bakgrund `#121212` | ca 11:1 | AAA |
| Primär/knapp (grön) | Ljus fotbollsgrön | `#57C98A` | Mörk text `#121212` | 9,0:1 | AAA |
| Fel/varning, röd | Ljus tegelröd | `#E4685D` | Mörk text `#121212` | ca 8:1 | AAA |
| Varningsruta, bakgrund | Mörk gul-brun | `#3A2E10` | Text `#F5D98A` | ca 9:1 | AAA |
| Fokusram | Ljus fotbollsgrön, 3 px | `#57C98A` | Bakgrund `#121212` | 9,0:1 | AA (icke-text) |

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
| Inskickad, väntar på granskning | `submissions.status` | Blå `#1A5FB4` (kontrast 5,6:1 mot vitt) | Ljusblå `#7AB0F5` | "Inskickad, väntar på granskning" |
| Godkänd | `submissions.status` | Grön `#0B6B3A` | Ljusgrön `#57C98A` | "Godkänd" + ✔ |
| Åtgärda | `submissions.status` | Röd/orange `#B3261E` | `#E4685D` | "Åtgärda" + ⚠ |

---

## 3. Typografi

- **Typsnitt:** systemets standard sans serif (t.ex. den plattformsegna typsnittsstacken), för snabb inladdning utan extra kostnad och för att alltid följa användarens egna tillgänglighetsinställningar (textstorlek, fetstil).
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

---

## 5. Träffytor

- **Minsta träffyta för alla interaktiva element: 48 × 48 px**, genomgående i hela appen (överstiger WCAG 2.2:s minimikrav på 24 × 24 px i kriterium 2.5.8, vilket är medvetet eftersom appen används utomhus, ofta med handskar).
- **Planläget:** navigeringsknappar och timerkontroller är minst 56 × 56 px, eftersom de används mest under stress och med en hand.
- Träffytan får vara större än den synliga knappen (osynlig utfyllnad), så att en liten ikonknapp ändå uppfyller kravet.

---

## 6. Komponenter

### 6.1 Knappar

- **Primär:** fylld bakgrund i primärfärgen, används för det huvudsakliga handlingssteget per vy (till exempel "Generera pass", "Spara pass", "Godkänn"). Högst en primärknapp synlig samtidigt i normala vyer.
- **Sekundär:** kantlinje, transparent bakgrund, används för alternativa handlingar ("Ändra uppgifter", "Avbryt").
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

### 6.4 Meddelanden (info, tips, varning, fel)

Fyra typer, som alltid kombinerar ikon + färg + text (aldrig bara färg):

| Typ | Ikon | Exempel |
|---|---|---|
| Info | ⓘ | Hjälptext om hur ålder tolkas |
| Tips | 💡 | Tips om fler ledare (R-021) |
| Varning | ⚠ | Mål-påminnelse, benskyddspåminnelse, åldersvarning i säsongsplan |
| Fel | ⛔ | Ogiltigt fält, inloggning misslyckades |

### 6.5 Statustagg (chip)

Används för fokusområden, spelform, nivå och övningsstatus. Textbaserad, inte färg-only. Radbryts fritt på smal skärm, aldrig avklippt.

### 6.6 Flikar (tabs)

Används i "Sparade pass" (Mina pass/Lag) och i säsongsöversikten (perioder). Tangentbordsnavigerbara, tydligt vald flik med både färg och understrykning/kant.

### 6.7 Utfällbar panel (accordion)

Används för "Visa mer" i pass-vyer och för fokusgrupper i underlaget. `aria-expanded` krävs. Fällda paneler döljer innehållet helt för skärmläsare (inte bara visuellt), så att navigeringen inte blir onödigt lång.

**Symbolen "▾" i wireframes** (klargjort vid granskningen av ytförklaringen, 2026-09-28) markerar bara för ögat att kontrollen fäller ut eller ihop – den är inte del av knapptexten. Knapptexten är alltid den som står ordagrant i `texter.md`, till exempel "Visa mer"/"Visa mindre", utan "▾". Vill man visa en pil i det byggda gränssnittet ska den vara en dekorativ ikon (`aria-hidden`), aldrig inbakad i den klickbara texten eller i det tillgängliga namnet.

**Länkliknande utfällningsknapp** (tillagt vid samma granskning): en utfällningsknapp får se ut som en textlänk (primärfärg, understruken, ingen kantlinje) i stället för en kantad knapp, när den är en mindre framträdande hjälp till ett annat innehåll på kortet snarare än korets huvudhandling – till exempel ytförklaringen i `skisser/02-genererat-pass.md`, som annars skulle konkurrera visuellt med "Byt övning" och "Visa mer". Kraven i avsnitt 5 (minst 48 × 48 px träffyta) och avsnitt 8 (fokusram, kontrast) gäller som vanligt. Understrykningen är ett medvetet val, inte bara ett estetiskt: eftersom knappen ser ut som en länk ska den även vara urskiljbar utan att bara luta sig mot färg (WCAG 1.4.1).

### 6.8 Dialog/modal

Används för bekräftelser (ta bort, arkivera) och för att skicka åtgärda-kommentar. Fångar tangentbordsfokus, går att stänga med Escape, återger fokus till utlösande knapp vid stängning. Får aldrig vara det enda sättet att nå kritisk information (WCAG 2.4.11 – fokuserat innehåll får inte skymmas av annat gränssnitt, t.ex. en sticky-knapp som täcker en dialogs bekräftelseknapp).

### 6.9 Timer (planläget)

Se `skisser/06-planlage.md`. Egen komponent med tre tillstånd (redo, går, tiden slut) som var och en har unik kombination av färg, ram, ikon och text.

---

## 7. Planskisser i vyerna

Själva ritningen av en planskiss (SVG från skissdata) ägs av planskissutvecklaren. Det här avsnittet styr bara hur skissen ska rymmas i respektive vy:

| Vy | Storlek/plats | Krav |
|---|---|---|
| Genererat/sparat pass (`02`) | Litet kort, cirka 96 × 72 px eller motsvarande höjd/breddförhållande, till vänster om eller ovanför texten | Klickbar för att förstora (öppnar större vy eller "Visa mer") |
| Byt övning (`04`) | Samma miniatyrformat som ovan, i varje alternativkort | – |
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
