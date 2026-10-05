Status: godkänd (K2, 2026-09-12)

# Gränssnittstexter – Fotbollsbanken

Alla texter är på svenska och skrivna i klarspråk, med samma ord som ledare själva använder (spelform, station, coachningspunkter, med mera). Knappar säger exakt vad som händer när de trycks, inte bara "OK" eller "Skicka". Texterna nedan är förslag som senior-systemutvecklare implementerar och som kan finjusteras utan ny K2-behandling, så länge innebörden är densamma.

Platshållare skrivs inom `{hakparentes}`.

---

## 1. Allmänt, återkommande

| Sammanhang | Text |
|---|---|
| Primärknapp, generera | Generera pass |
| Primärknapp, spara pass | Spara pass |
| Primärknapp, spara övning | Spara övning |
| Byta övning | Byt övning |
| Ångra/avbryt | Avbryt |
| Ta bort (destruktiv, kräver bekräftelse) | Ta bort |
| Stäng dialog | Stäng |
| Ladda/vänta | Arbetar … |
| Obligatoriskt fält (skärmläsartext) | obligatoriskt |
| Generisk sparad-bekräftelse | Sparat. |

---

## 2. Inloggning och konto (berättelse 08, `skisser/14-inloggning.md`)

Inloggning sker med en engångskod via e-post, utan lösenord (`docs/adr/0004-inloggning.md`). Samma kodsteg används vid inloggning och registrering.

| Sammanhang | Text |
|---|---|
| Rubrik | Logga in |
| Rubrik, registrering | Skapa konto |
| Fält | E-post / Namn |
| Hjälptext, namn | Visas för andra ledare i dina lag. |
| Hjälptext, personuppgifter | Vi sparar bara det som behövs för ditt konto. Inga uppgifter om spelare. |
| Hjälptext, captcha | En kort kontroll som visar att det är en person som loggar in, inte ett program. |
| Knapp, steg 1 | Skicka kod |
| Knapp, logga ut | Logga ut |
| Rubrik, kodsteg | Skriv in koden |
| Ingress, kodsteg | Vi har skickat en kod till {e-post}. |
| Hjälptext, skräppost (lugn ton, ingen varningsikon) | Hittar du inget mejl om en liten stund? Kolla även i skräpposten. |
| Fält, kod | Kod (6 siffror) |
| Knapp, bekräfta kod | Bekräfta kod |
| Knapp, skicka ny kod (väntar) | Skicka ny kod ({sekunder} s) |
| Knapp, skicka ny kod (klar) | Skicka ny kod |
| Länk, fel adress angiven | Fel e-postadress? Gå tillbaka |
| Bekräftelse efter steg 1 (samma oavsett om kontot finns, S-13) | Om adressen finns hos oss har vi skickat en kod. |
| Fel: fel kod | Koden stämmer inte. Kontrollera siffrorna och försök igen. |
| Fel: för många felaktiga försök | Du har försökt för många gånger. Begär en ny kod för att fortsätta. |
| Fel: koden har gått ut | Koden har gått ut. Begär en ny kod. |
| Fel: obligatoriskt fält saknas | Fyll i {fältnamn} för att fortsätta. |
| Inbjudan, banner | Du är inbjuden till {lagnamn} i {klubbnamn}. |
| Efter accepterad inbjudan | Du är nu kopplad till {lagnamn}. |

**Viktigt:** appen ska aldrig säga att en adress "redan har ett konto" eller att uppgifter "inte stämmer" för en okänd adress (S-13). Vid fel kod, däremot, ska felmeddelandet vara tydligt – det handlar inte om att avslöja kontots existens, utan om att koden personen just skrev in är fel.

---

## 3. Underlag för generatorn (berättelse 01, `skisser/01-underlag.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Nytt pass |
| Fält, ålder | Ålder |
| Hjälptext, ålder | Ange den ålder som flest i gruppen fyller i år. Har ni två lika vanliga åldrar, ange den yngre. |
| Fel, ogiltig ålder | Ange en ålder mellan 6 och 19 år. |
| Fält, spelform | Spelform |
| Hjälptext, spelform | Föreslagen utifrån åldern. Du kan också välja spelformen närmast före eller efter. |
| Fält, nivå | Nivå |
| Hjälptext, nivå | Välj den nivå som stämmer för ungefär två av tre spelare i gruppen. |
| Fält, antal spelare | Antal spelare |
| Fel, antal spelare | Antal spelare måste vara mellan 1 och 40. |
| Fält, antal ledare | Antal ledare |
| Fel, antal ledare | Antal ledare måste vara mellan 1 och 10. |
| Fält, passlängd | Passets längd (minuter) |
| Fel, för kort pass | Passet måste vara minst 30 minuter. |
| Fel, för långt pass | Det längsta passet för den här åldern är {maxlängd} minuter. |
| Fält, fokusområden | Fokusområden (välj 1–3) |
| Fokusområden, väntar på ålder | Ange ålder först, så visar vi de fokusområden som passar åldern. |
| Fokusområden, kärnområde (skärmläsarord för "(K)", tillagd vid uppföljningen 2026-09-23) | kärnområde |
| Fel, inget fokus valt | Välj minst ett fokusområde. |
| Fel, för många fokus | Du kan välja högst tre fokusområden. Ta bort ett för att lägga till ett nytt. |
| Fel, bara nickspel valt | Nickspel måste väljas tillsammans med minst ett annat fokusområde. |
| Fält, yta | Yta (valfritt) |
| Alternativ, yta | Ingen / Hel plan / Halv plan / Kvarts plan |
| Fel, ofullständigt underlag (samlat) | Några uppgifter saknas eller stämmer inte – se markeringarna ovan. |
| Primärknapp | Generera pass |

**Kärnområde och "(K)" (tillagd vid uppföljningen 2026-09-23):** varje kärnområde (K) i fokuslistan visar "(K)" för ögat. Ordet "kärnområde" läggs till *efter* "(K)" i kryssrutans tillgängliga namn, det ersätter inte "(K)": till exempel "Passning och mottagning (K), kärnområde". Se `skisser/01-underlag.md`, avsnittet Tillgänglighet, för skälet – kortfattat att WCAG 2.5.3 kräver att den synliga texten, inklusive "(K)", ordagrant ingår i det tillgängliga namnet, samtidigt som en ensam bokstav "K" utan sammanhang är obegriplig för en skärmläsare.

---

## 4. Genererat pass (berättelse 02, `skisser/02-genererat-pass.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Ditt pass |
| Faktisk tid, avviker | Faktisk tid: {x} min (du bad om {y} min) |
| Del, namn | Uppvärmning / Öva / Spelövning / Spel / Avslutning |
| Stationsetikett | Station A / Station B / Station C / Station D |
| Yta på övningskortet | Yta: {mått} meter |
| Yta på övningskortet, med ytreferens (ADR 0017) | Yta: {mått} meter ({ytreferens}) |
| Knapp, ytförklaring (fälld) | Vad betyder måttet i parentes? |
| Knapp, ytförklaring (utfälld) | Dölj förklaringen |
| Hjälptext, ytförklaring | Referensen jämför storlek. Var målen står följer övningens beskrivning. |
| Knapp, mer info | Visa mer |
| Knapp, mindre info | Visa mindre |
| Knapp, byt övning | Byt övning |
| Tips, många spelare per ledare (R-021) | Ni är fler spelare per ledare än vad som brukar rekommenderas för den här åldern. Ta gärna hjälp av en förälder eller en äldre spelare. |
| Varning, mål (R-084) | Kom ihåg att alla mål, även små, ska vara förankrade så att de inte kan välta. |
| Varning, benskydd (R-085) | Använd benskydd på träningen – spel innehåller alltid närkamper. |
| Tom del, kan lösas med ett val (R-100/R-103) | Vi kunde inte hitta en övning som passar här. Testa att ändra ett av de här: {lista av fält, t.ex. "Nivå, Antal spelare"}. |
| Tom del, går inte att kombinera (R-100 andra punkten) | De övningar som annars skulle passa här gick inte att kombinera med resten av passet. |
| Tom del, inget enskilt val hjälper (R-100/R-103, tredje läget, tillagd K4 2026-09-23) | Vi hittade inga övningar som passar den här delen, och inget enskilt val skulle ensamt lösa det. Prova att ändra flera uppgifter i underlaget samtidigt. |
| Ersättningsfokus i en del (R-121, tillagd K4 2026-09-23) | Inga övningar för {missing} passade den här delen, så vi använde {substitute} i stället. Dina val i underlaget är oförändrade. |
| Del borttagen pga för kort tid (R-033) | (visas inte alls – delen tas bort helt och nämns inte i passet) |

**Tillagt vid granskningen inför K4 (2026-09-23):**

- **Ersättningsfokus (R-121):** visas som en egen informationsrad direkt under delens rubrik, före övningskortet, när `del-ovning` eller `del-spelovning` fylldes med ett annat fokus än det ledaren valde. `{missing}` är det eller de valda fokusområden som saknade övning i just den delen (kommaseparerat om flera), `{substitute}` är fokusområdet som användes i stället. Texten ändrar aldrig innebörden av R-102: underlagets fokusval står kvar precis som ledaren skrev dem.
- **Tom del, inget enskilt val hjälper:** en tredje variant av "tom del"-texten, som tidigare saknades. Den behövs för att "Tom del, går inte att kombinera" annars visas även när det inte stämmer att andra övningar skulle passa var för sig – till exempel när banken helt saknar övningar för den valda spelformen. Visas när delens `emptyReason` är `val-kan-andras` **och** listan över ändringsbara fält är tom (alltså varken en bekräftad kombinationskonflikt eller en lista att visa). `emptyReason` är en riktig, bekräftad signal från regelmotorn (samma prövning som `partCanBeFilled` gör för delen), inte en gissning utifrån att listan råkar vara tom – det gäller båda de två återstående lägena. Se `skisser/02-genererat-pass.md` för var i vyn den ska stå.

**Tillagt vid granskningen av ytreferensen (2026-09-28, ADR 0017):**

- **Yta på övningskortet:** en egen rad på varje övningskort, direkt under gruppindelningen (eller direkt under syftet om delen saknar gruppindelning), i samma stil som gruppindelningen (sekundär textfärg, mindre storlek). `{mått}` är längd × bredd i meter med svenskt decimaltecken, till exempel "18 × 12". Saknar övningen en ytreferens för spelformen visas bara måttet – ingen tom parentes, ingen platshållare. Referensen står aldrig ensam (se `docs/adr/0017-ytreferens-i-ovningsformatet.md` beslut 6). Se `skisser/02-genererat-pass.md`.
- **Radbrytning:** `{ytreferens}` kan bli upp till 90 tecken (fotbollsexpertens riktmärke ~70) och ska kunna radbryta fritt på en mobilskärm, precis som en statustagg (designsystem.md 6.5). Själva måttet – "Yta: {mått} meter" och parentesens inledande tecken – ska däremot hållas ihop med ett hårt mellanslag runt "×" och före "(", så att till exempel "×" eller "(" aldrig hamnar ensamt på en egen rad. Det är samma typ av åtgärd som redan finns i koden (`.visually-hidden`, se kärnområdes-noten i avsnitt 3), fast här för radbrytning i stället för tillgängligt namn.
- **Skärmläsare:** tecknet "×" ska läsas begripligt (till exempel som "gånger"). Kontrolleras av kvalitetssäkraren med en riktig skärmläsare (NVDA/VoiceOver). Läses det oklart, används samma mönster som för "(K)"/kärnområde ovan: den synliga symbolen står kvar, och ett `.visually-hidden`-tillägg ger en tydlig accessible name – inte en ersättning av den synliga texten.
- **Ytförklaring (tillagd 2026-09-28, uppföljning till ADR 0017):** fotbollsexperten påpekade vid granskningen att en ledare kan läsa ytreferensen som en plats – till exempel ställa målet på straffområdets riktiga mållinje – i stället för en jämförelse av storlek. Var målen står följer övningens beskrivning, inte referensen. Lösningen är en liten utfällbar förklaring, samma mönster som "Visa mer" (accordion, `designsystem.md` avsnitt 6.7: riktig disclosure-knapp med `aria-expanded`, innehållet helt dolt för skärmläsare när den är fälld, ingen information bara vid hovring). Den visas **bara på den första övningen i passet vars yta har en ytreferens** – inte upprepad på varje kort, för att inte göra varje kort tyngre. Fälld: "Vad betyder måttet i parentes?". Utfälld: "Referensen jämför storlek. Var målen står följer övningens beskrivning." och knapptexten byter till "Dölj förklaringen". Har inget kort i passet en ytreferens visas ingenting. Se `skisser/02-genererat-pass.md`.

---

## 5. Inget matchande resultat (berättelse 03, `skisser/03-inget-matchande-resultat.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Vi kunde inte skapa ett pass med de här uppgifterna |
| Ingress, val kan lösa det (R-103) | Det finns för få övningar som matchar allt du valt. Prova att ändra ett av de här: |
| Ingress, kan inte kombineras (R-100 andra punkten) | Det finns övningar som skulle kunna passa var för sig, men de går inte att kombinera till ett helt pass med dina val. |
| Ingress, inget enskilt val hjälper (tillagd K4 2026-09-23) | Vi hittade inga övningar som matchar de här valen, och vi kan inte peka ut ett enskilt val som skulle lösa det. Prova att ändra flera uppgifter i underlaget samtidigt. |
| Trygghetstext | Vi ändrar ingenting åt dig – gå tillbaka och justera det du vill testa. |
| Knapp | Ändra uppgifter |
| Sammanfattning, rubrik | Ditt underlag just nu |

**Viktigt:** de tre ingresserna ovan används aldrig samtidigt och ska vara tydligt olika formulerade, eftersom de betyder olika saker för ledaren (ett eget val löser det, ett kombinationsproblem som inget enskilt val löser, respektive att ingen övning matchar alls och inget enskilt val hjälper).

**Vilken av de tre som visas (rättat vid uppföljningen 2026-09-23):** `NoSessionReason` har fältet `cause` (`inget-matchar` eller `gar-inte-att-kombinera`), beräknat med samma prövning som `emptyReason` gör per del (se avsnitt 4 ovan). Ordningen: är listan över ändringsbara fält (`changeableFields`) inte tom, visas "val kan lösa det", oavsett `cause`. Är listan tom, avgör `cause`: `gar-inte-att-kombinera` ger "kan inte kombineras", `inget-matchar` ger "inget enskilt val hjälper" (se exemplet med 11 mot 11, där banken helt saknar övningar). En tidigare version av den här raden sa att en tom lista alltid skulle ge "inget enskilt val hjälper", i väntan på just den här signalen från regelmotorn – det gäller inte längre, se `skisser/03-inget-matchande-resultat.md`.

---

## 6. Byta övning (berättelse 04, `skisser/04-byt-ovning.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Byt övning: {delnamn} |
| Ingress | Byter ut: "{övningsnamn}" ({eventuell stationsetikett}, {tid} min) |
| Sektion | Från den gemensamma banken |
| Sektion | Klubbens egna övningar |
| Knapp per övning | Välj denna |
| Info, dolda ofullständiga egna övningar | Ingen av era egna övningar med ofullständiga uppgifter visas här – de kan inte användas i ett pass förrän de är kompletta. |
| Inga alternativ | Vi hittade ingen övning, varken i banken eller bland era egna, som passar precis här. Övningen ligger kvar som den är. |
| Bekräftelse efter byte | Bytt till: {nytt övningsnamn}. |

---

## 7. Spara pass och sparade pass (berättelse 05, 12, `skisser/05-sparade-pass.md`)

| Sammanhang | Text |
|---|---|
| Rubrik, dialog | Spara pass |
| Fält, namn | Namn på passet |
| Hjälptext, namn på passet | Skriv inga namn på spelare. |
| Namnförslag | {ålder} år · {spelform} · {huvudfokus} {datum} |
| Fält, lag | Lag |
| Hjälptext, lag | Delas med alla ledare i {lagnamn}. |
| Hjälptext, inget lag | Sparas bara för dig, tills du kopplar det till ett lag. |
| Rubrik, lista | Sparade pass |
| Flik | Mina pass / {lagnamn} |
| Tomt läge | Du har inga sparade pass än. Skapa ditt första pass. |
| Knapp, nytt | + Nytt pass |

---

## 8. Planskisser (berättelse 06, 07)

| Sammanhang | Text |
|---|---|
| Saknad skiss (kriterium 2) | Planskiss saknas |
| Skissdata kunde inte valideras vid läsning (kriterium 3) | Planskissen kunde inte visas |
| Tillgängligt namn, SVG:ns `<title>` (kriterium 8, ADR 0012 avsnitt 5) | {övningsnamn}, planskiss |
| Tillgänglig beskrivning, SVG:ns `<desc>`, när `skiss.beskrivning` finns | {skiss.beskrivning}, ordagrant och utan tillägg |
| Tillgänglig beskrivning, SVG:ns `<desc>`, när `skiss.beskrivning` saknas (genererad) | Se mallen nedan |
| Rubrik, teckenförklaring (ADR 0012 avsnitt 3) | Teckenförklaring |
| Spelare utanför taket på 40 ritade symboler, eller platser som tog slut (ADR 0012 avsnitt 4, S-5), en spelare | 1 spelare till står inte med i skissen. |
| Samma, flera spelare | {count} spelare till står inte med i skissen. |
| Miniatyrknappens tillgängliga namn, stängd (kriterium 4, se motivering nedan) | Förstora planskiss, {övningsnamn} |
| Miniatyrknappens tillgängliga namn, öppen | Dölj planskiss, {övningsnamn} |

**Löser motsägelsen mellan detta avsnitt och ADR 0012 (tillagd 2026-09-28, förarbete till inkrement 2, se berättelse 06 kriterium 8):** den tidigare enda raden här ("Planskiss: {övningsnamn}, yta {mått} meter") utgick från en `<img>`s `alt`-text. ADR 0012 (beslutad vid K2, ändras inte i efterhand) valde ett annat mönster: SVG med `role="img"` och `aria-labelledby` som pekar på ett `<title>` och ett `<desc>` (ADR 0012 avsnitt 5). Raderna ovan ersätter den gamla raden helt och följer ADR:ns struktur i stället för att gå runt den.

**`<title>`:** alltid "{övningsnamn}, planskiss" – aldrig ytans mått eller annan information, för att hålla namnet kort och stabilt oavsett spelform eller antal spelare.

**`<desc>`, mallen när `skiss.beskrivning` saknas** (algoritmen och fälten – yta, spelare per lag, mål, rörelser per typ – kommer från ADR 0012 avsnitt 5; ordningen, orden och uteslutningsreglerna fastställs här):

> Yta {langd} gånger {bredd} meter. [{spelare lag A} spelare i lag A][, {spelare lag B} i lag B][, {neutrala} neutral/neutrala][, {målvakter} målvakt/målvakter]. [{mål} mål.] [{rörelser per typ, uppräknade}.] [Så här ser en av {antal ytor} ytor ut.]

Regler för mallen:

- **Hakparenteser `[...]` markerar klausuler som tas bort helt** när antalet är noll eller fältet saknas i skissen – aldrig "0 mål.", ett kommatecken som pekar mot ingenting, eller en tom uppräkning. Saknar skissen spelare helt utelämnas hela den andra meningen, och "Yta {langd} gånger {bredd} meter." står då som en egen, fullständig mening.
- **Rörelsetyperna räknas upp i ADR 0012 avsnitt 3:s ordning** (`passning`, `lopning`, `dribbling`, `skott`), kommaseparerade, med "och" före den sista typ som förekommer – samma stil som ADR:ns eget exempel ("3 passningar och 2 löpningar"). `skott` skrivs ut som **"avslut"**, samma ord som ADR:ns teckenförklaring använder för rörelsetypen ("Avslut mot mål", ADR 0012 avsnitt 3), inte "skott".
- **Ytans mått och ytreferensen (ADR 0017) tas inte med.** `<desc>` innehåller bara metertalet, inte en eventuell ytreferens ("stora planens målområde …"). Skälet är dubbelt: ADR 0012 avsnitt 5 räknar uttryckligen upp vad sammanfattningen innehåller (yta, spelare, mål, rörelser) och nämner ingen ytreferens – fältet fanns inte när ADR:n beslutades, och att lägga till det nu vore att utöka en beslutad ADR i efterhand. Dessutom visas ytreferensen redan som synlig text i "Yta: {mått} meter ({ytreferens})" på övningskortet (avsnitt 4 ovan), som en skärmläsare når på egen hand – att upprepa den inuti `<desc>` skulle bara göra texten längre utan att ge ny information.
- **"Så här ser en av {antal ytor} ytor ut."** läggs till sist i `<desc>` bara när skissens `skalning.strategi` är `parallella-ytor` och det totala antalet spelare kräver fler än en yta (ADR 0012 avsnitt 4). Meningen läggs till **även när `skiss.beskrivning` finns** och används i stället för den genererade sammanfattningen – den beskriver hur just den här renderingen ska tolkas (en av flera identiska ytor), inte övningen i sig, och hör därför inte till valet mellan författarens text och den genererade sammanfattningen.

**Varför "gånger" ersätter tecknet "×" i title/desc, i stället för samma dolda tillägg som avsnitt 4** (samma öppna fråga som redan fanns för ytraden, löst här med samma grundidé): avsnitt 4 föreslår, om kvalitetssäkrarens skärmläsartest visar att tecknet "×" läses oklart, att lösa det med ett dolt `.visually-hidden`-tillägg *vid sidan av* den synliga texten – "till exempel som 'gånger'" – utan att ändra den synliga texten. Den lösningen förutsätter en synlig text och en separat dold text, och det går inte att bygga i `<title>`/`<desc>`: de är rena textnoder utan nästlad markup (ADR 0012 avsnitt 5, samma slutna elementlista som avsnitt 6 hänvisar till), och de visas aldrig för ögat – hela innehållet är redan bara till för skärmläsaren, så det finns ingen synlig variant att bevara vid sidan av ett tillägg. Den här texten använder därför **samma ord som avsnitt 4 redan föreslår** ("gånger") men skriver ut det direkt i stället för att lägga till det: "30 gånger 20 meter", inte "30 × 20 meter". Det görs oavsett vad testet i avsnitt 4 landar i, eftersom det – till skillnad från den synliga ytraden på kortet – inte kostar något att välja ordet här i förväg: ingen tappar något visuellt, eftersom `<desc>` aldrig visas.

**Teckenförklaringens benämningar (tillagd 2026-10-02, fastställer `src/planskiss/teckenforklaring.ts`):** planskissutvecklarens förslag i `LEGEND_NAMES` är granskat och godkänns ordagrant. En rad visas bara för de objekt- och rörelsetyper som faktiskt förekommer i den visade skissen (ADR 0012 avsnitt 3).

| `kind` | Benämning |
|---|---|
| `lag-a` | Spelare, lag A |
| `lag-b` | Spelare, lag B |
| `neutral` | Neutral spelare |
| `malvakt` | Målvakt |
| `ledare` | Ledare |
| `kon` | Kon |
| `boll` | Boll |
| `mal` | Mål |
| `platta` | Platta |
| `prick` | Prick |
| `linje` | Linje på marken |
| `zon` | Zon |
| `ruta` | Ruta |
| `passning` | Passning |
| `lopning` | Löpning utan boll |
| `dribbling` | Dribbling med boll |
| `skott` | Avslut |

`linje` skrivs "Linje på marken", inte bara "Linje", så att den inte läses ihop med rörelsepilarna (`passning`, `lopning`, `dribbling`, `skott`), som också är linjer i skissen men betyder något annat (en rörelse, inte en markering på marken). `skott` skrivs "Avslut", samma ord som i `<desc>` (se ovan) och i ADR 0012 avsnitt 3 ("Avslut mot mål"), aldrig "Skott".

**"N spelare till står inte med i skissen." (tillagd 2026-10-02, fastställer `src/planskiss/beskrivning.ts`):** texten används både som bildtext under skissen (tillsammans med `parallelAreasText`, dold för skärmläsare eftersom samma information redan finns i `<desc>`) och inuti `<desc>` när `skiss.beskrivning` saknas. Den visas när ritmotorn inte kan rita alla spelare: taket på 40 ritade spelarsymboler nåddes (ADR 0012 avsnitt 4, S-5), eller strategin `platser` tog slut på platser. Formuleringen namnger inte orsaken – ledaren behöver bara veta att några spelare inte syns i bilden, inte varför.

**Miniatyrknappens tillgängliga namn (tillagd 2026-10-02, svar på planskissutvecklarens fråga, kriterium 4):** i dag blir knappens tillgängliga namn den SVG-miniatyr den omsluter, alltså `<title>` **och** `<desc>` sammanslaget ("{övningsnamn}, planskiss. Yta … meter. … spelare …"), eftersom namnberäkningen för en knapp utan eget `aria-label` går igenom hela innehållet, inklusive `role="img"`-elementets egen `aria-labelledby`. Det blir långt och upprepar sig varje gång en skärmläsare möter ett övningskort i listan, vilket bryter mot principen att en knapp ska säga exakt vad som händer – inte läsa upp hela skissens innehåll innan den ens är öppnad.

Lösningen är ett eget `aria-label` på knappen, som ersätter hela den härledda texten:

- Stängd (`aria-expanded="false"`): "Förstora planskiss, {övningsnamn}"
- Öppen (`aria-expanded="true"`): "Dölj planskiss, {övningsnamn}"

`{övningsnamn}` tas med eftersom ett pass kan ha flera övningskort i listan efter varandra – utan namnet skulle flera knappar heta exakt likadant ("Förstora planskiss"), vilket gör det svårt att veta vilken man aktiverar när man navigerar med skärmläsarens knapplista. Mönstret följer samma princip som "Visa mer"/"Visa mindre" (`designsystem.md` avsnitt 6.7): verbet byter med tillståndet, texten säger vad som händer.

**Hur den fullständiga beskrivningen nås:** `<title>` och `<desc>` tas inte bort – de ska fortfarande alltid finnas, enligt ADR 0012 avsnitt 5 och testkravet i avsnitt 8 ("title och desc finns alltid"). De når bara inte fram genom den stängda miniatyrknappen längre, eftersom `aria-label` på knappen går före knappens innehåll i namnberäkningen. Den fullständiga beskrivningen når ledaren i stället genom den **förstorade** skissen: `KortSkiss` ritar då en andra, större `Planskissvy` direkt i kortet, utanför knappen, med sin egen `role="img"` och `aria-labelledby` till `<title>`/`<desc>` precis som i dag. En skärmläsare möter alltså en kort knapp ("Förstora planskiss, {övningsnamn}"), och efter att ha aktiverat den, bilden med den fulla beskrivningen direkt efter i läsordningen.

En sak till behöver kontrolleras när knappen byggs: miniatyrens egen `<svg role="img" aria-labelledby="…">` ligger kvar inuti knappen även efter ändringen, och vissa skärmläsare kan ändå annonsera den som ett eget nästlat objekt (utöver knappens `aria-label`), vilket skulle läsas upp två gånger i rad. `<title>`/`<desc>`-elementen ska finnas kvar i markupen (strukturtestet i ADR 0012 avsnitt 8 gäller oförändrat), men själva miniatyr-`<svg>`:n bör få `aria-hidden="true"` på den omslutande `<span>` (`styles.sketch`) när den visas som miniatyr inuti en knapp, så att bara knappens eget namn når skärmläsaren där. Kvalitetssäkraren kontrollerar det här med en riktig skärmläsare (NVDA/VoiceOver), på samma sätt som för "×" ovan.

---

## 9. Planläget (berättelse 19, 20, 21, `skisser/06-planlage.md`)

| Sammanhang | Text |
|---|---|
| Knapp, starta | Starta planläge |
| Statusrad | {delnamn} · {nummer} av {totalt} |
| Knapp, avsluta | Avsluta |
| Bekräftelse, avsluta | Vill du avsluta planläget? Passets ordning och tider påverkas inte. |
| Knapp, timer start | Starta timer |
| Knapp, timer paus | Pausa |
| Knapp, timer förläng | +1 minut |
| Timer, tiden slut | Tiden är slut |
| Knapp, navigera | ◀ Föregående / Nästa övning ▶ |
| Sista övningen, meddelande | Passet är slut |
| Ingress, passet slut | Bra jobbat! Ni har gått igenom alla övningar. |
| Knapp | Till avslutningen / Avsluta planläget |
| Utfällbar info | Visa fullständig beskrivning, coachningspunkter och varianter |

---

## 10. Utskrift/PDF (berättelse 22, `skisser/07-utskrift.md`)

| Sammanhang | Text |
|---|---|
| Knapp | Skriv ut / Ladda ner PDF |
| Sidfot | Skapat i Fotbollsbanken · {datum} |
| Saknad skiss i utskrift | Planskiss saknas |
| Tom del i utskrift | Övning saknas för den här delen |

---

## 11. Egna övningar (berättelse 13–17, `skisser/10-skapa-egen-ovning.md`, `11-hantera-egna-ovningar.md`)

| Sammanhang | Text |
|---|---|
| Rubrik, ny | Ny egen övning |
| Rubrik, lista | Klubbens egna övningar |
| Knapp | + Ny övning |
| Sparad med saknade fält | Övningen är sparad, men saknar: {lista}. Den kan inte användas i ett pass förrän de är ifyllda. |
| Komplett-markering i lista (egen övning, inte inskickad) | Ofullständig / Klar att använda |
| Status i lista (efter insändning, ur `submissions.status`) | Inskickad, väntar på granskning / Godkänd / Åtgärda |
| Under granskning, spärr | Den här övningen är inskickad och väntar på granskning i den gemensamma banken. Du kan inte ändra eller ta bort den förrän granskningen är klar. |
| Ta bort, bekräftelse | Ta bort "{övningsnamn}"? Pass som redan använder den påverkas inte. |
| Skicka in, ofullständig | Komplettera för att skicka in |
| Skicka in, redan inskickad | Den här övningen är redan inskickad och väntar på granskning. |
| Skicka in, lyckad | Skickad till redaktören. Du ser status i din lista. |
| Åtgärda, rubrik | Redaktören vill att du ändrar något innan övningen kan godkännas: |
| Åtgärda, historik | Tidigare kommentarer |
| Knapp | Spara och skicka in igen |
| Nickspel, för låg ålder | Nickspel kan bara användas för övningar med lägsta ålder 13 år eller äldre. |

**Viktigt:** en egen övning har antingen komplett-markeringen (Ofullständig/Klar att använda) eller status i redaktörskön (Inskickad/Godkänd/Åtgärda), aldrig båda samtidigt (`docs/adr/0010-ovningsformat-och-lagring.md`, avsnitt 4). Ordet "Utkast" används inte om egna övningar i appen – det finns bara som filstatus i `content/ovningar/`.

---

## 12. Redaktörskö (berättelse 16, 18, `skisser/12-redaktorsko.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Redaktörskö ({antal} väntar) |
| Tomt läge | Inga övningar väntar på granskning just nu. |
| Knapp | Granska |
| Knapp | Godkänn |
| Bekräftelse, godkänd | Godkänd – nu valbar för alla klubbar. |
| Knapp | Skicka åtgärda |
| Fält, kommentar | Kommentar till {ledarens namn} |
| Hjälptext, kommentar | Skriv inga namn på spelare. |
| Fel, tom kommentar | Skriv en kommentar som förklarar vad som behöver ändras. |
| Rubrik, redaktörer | Redaktörer |
| Knapp | Gör till redaktör |
| Fel, person saknar konto | Personen har inget konto än. Be personen registrera sig först. |
| Knapp | Ta bort behörighet |

---

## 13. Klubbadmin (berättelse 09, 10, 11, `skisser/13-klubbadmin-lag.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Skapa din klubb |
| Fält | Klubbnamn |
| Hjälptext, klubbnamn (S-20) | Använd klubbens riktiga namn, inte ett lags. Skriv inga namn på spelare någonstans i appen. |
| Varning, namn upptaget | Det finns redan en klubb med det namnet. Kontrollera om din klubb redan är registrerad innan du skapar en ny. |
| Knapp | Skapa klubb / Skapa klubb ändå |
| Knapp | + Lag |
| Fält, lag | Lagnamn / Ålder / Spelform |
| Hjälptext, lagnamn (S-20) | Skriv inga namn på spelare. |
| Varning, arkivera lag | Laget har {antal} sparade pass{ och en säsongsplan, om aktuellt}. De påverkas inte, men laget tas bort från de aktiva listorna och kan inte längre väljas för nya pass. |
| Knapp | Arkivera ändå |
| Fält, inbjudan | Bjud in ledare via e-post |
| Knapp | Skicka inbjudan |
| Status | Inbjuden, väntar på svar |
| Knapp | Ta bort från lag |
| Bekräftelse, ta bort | Ta bort {namn} från {lagnamn}? Personen behåller sitt konto och det som inte enbart hör till laget. |

---

## 14. Säsongsplan (berättelse 23–25, `skisser/08-sasongsplan-vecka.md`, `09-sasongsplan-oversikt.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Säsongsplan för {lagnamn} |
| Tomt läge | Ni har ingen säsongsplan än. |
| Fält | Startdatum / Slutdatum |
| Knapp | Skapa säsongsplan |
| Befintlig plan finns | {Lagnamn} har redan en säsongsplan ({start}–{slut}). Vill du öppna den? |
| Vecka, rubrik | Vecka {nummer} · {datumspann} |
| Ålder denna vecka | Ålder denna vecka: {ålder} år |
| Veckans fokus | Veckans fokus: {lista} |
| Tom vecka | Inget pass planerat den här veckan. |
| Knapp | + Lägg till pass |
| Val, källa | Välj bland sparade pass / Generera nytt pass för den här veckan |
| **Varning, ålder skiljer sig (24.5, R-113)** | Passet skapades för {passets ålder} år, men veckans ålder är {veckans ålder} år. Kontrollera att passet fortfarande passar. |
| **Varning, nickspel under 13 år (24.5, R-080)** | Det här passet innehåller en övning med nickspel, men veckans ålder är under 13 år. SvFF rekommenderar ingen nickträning före 13 år – kontrollera passet innan ni kör det. |
| Rubrik, översikt | Säsongsplan {lagnamn} |
| Genväg | ↑ Till idag / aktuell vecka |
| Flera pass på en vecka | {antal} pass |

---

## 15. Generella fel och tillstånd

Vad som faktiskt fungerar utan nät styrs av `docs/adr/0005-daligt-nat-och-offline.md`. Sparade pass, planläget och utskrift fungerar offline; allt som ändrar något i databasen kräver nät, och det finns ingen kö som skickar iväg en ändring automatiskt när nätet kommer tillbaka (ADR 0005, punkt 6). Texterna nedan får därför aldrig antyda att en ändring "sparas ändå" – bara att den ligger kvar ifylld tills ledaren försöker igen.

| Sammanhang | Text |
|---|---|
| Något gick fel (oväntat tekniskt fel) | Något gick fel just nu. Försök igen om en liten stund. |
| Anslutningsindikator (banderoll, `designsystem.md` avsnitt 9) | Ingen anslutning · Visar sparad data från {tidpunkt} |
| Anslutningsindikator, återställd | Uppdaterat |
| Fel, handling kräver nät (spara, ändra, skicka in, godkänna, bjuda in, logga in, radera konto) | Du verkar sakna internetanslutning. Det du skrivit finns kvar – försök igen när du är uppkopplad. |
| Bekräftelse, osparade ändringar | Du har ändringar som inte är sparade. Vill du lämna sidan ändå? |
| Laddar innehåll | Hämtar … |

---

## 16. Mitt konto och radera konto (berättelse 26, `skisser/15-radera-konto.md`)

| Sammanhang | Text |
|---|---|
| Rubrik | Mitt konto |
| Knapp | Logga ut på alla enheter |
| Knapp, destruktiv | Radera mitt konto |
| Rubrik, blockerad | Radera mitt konto |
| Blockerad, ensam klubbadmin | Du är den enda klubbadminen i {klubbnamn}. Utse en efterträdare innan du kan radera ditt konto. |
| Knapp, blockerad | Utse en efterträdare |
| Rubrik, vad som händer | Det här raderas |
| Rubrik, vad som blir kvar | Det här blir kvar, avidentifierat |
| Text, avidentifierat | Skaparen visas då som "Borttagen användare". |
| Varning, kan inte ångras | Det går inte att ångra. |
| Fält, bekräfta med namn | Skriv ditt namn för att bekräfta |
| Fel, namnet stämmer inte | Namnet du skrev stämmer inte. Kontrollera stavningen. |
| Knapp | Radera mitt konto |
| Knapp | Avbryt |
| Bekräftelse efter radering | Ditt konto är raderat. Du är utloggad. |

---

## Principer bakom formuleringarna

1. **Aktiv röst och konkret handling.** "Byt övning", inte "Övningsbyte". "Spara pass", inte "Spara".
2. **Fel förklarar både vad och varför.** Till exempel "Antal spelare måste vara mellan 1 och 40", inte bara "Ogiltigt värde".
3. **Appen ändrar aldrig ledarens val åt henne eller honom** – texterna säger alltid "testa att ändra" eller "kontrollera", aldrig "vi har ändrat".
4. **Samma ord som ledare använder:** spelform (inte "matchformat"), station (inte "grupp" när det gäller stationer), coachningspunkter (inte "tips till tränaren"), planskiss (inte "diagram").
5. **Varningar om säkerhet är alltid synliga, aldrig gömda** bakom en meny eller ett klick, eftersom de handlar om barns säkerhet (mål, benskydd, nickspel).

---

## Ändringar efter K2

Det här dokumentet godkändes vid K2, 2026-09-12. Ändringarna nedan är tillägg som gjordes vid granskningen av det byggda gränssnittet inför K4 (2026-09-23), eftersom R-121 (ersättningsfokus) och det tredje "inget matchande resultat"-läget tillkom efter K2. Statusraden överst ändras inte av en agent – det gör huvudsessionen tillsammans med användaren.

| Datum | Ändring |
|---|---|
| 2026-09-23 | **Avsnitt 3:** ny rad för texten som visas i stället för fokuslistan innan ålder är ifylld. |
| 2026-09-23 | **Avsnitt 4:** två nya rader – ersättningsfokus (R-121) och "tom del, inget enskilt val hjälper", det tredje läget för en tom del. Texter.md hade bara två lägen för en tom del sedan tidigare; det tredje saknades eftersom det upptäcktes först vid granskningen inför K4. |
| 2026-09-23 | **Avsnitt 5:** ny rad för "inget enskilt val hjälper" samt ett tillägg som förklarar vilken av de tre ingresserna som ska visas, eftersom vyn i praktiken bara kan skilja på "lista med fält" och "listan är tom" (se `skisser/03-inget-matchande-resultat.md`). |
| 2026-09-23 (uppföljning samma dag) | **Avsnitt 4 och 5:** förklaringarna om vilken "tom del"/"inget matchande resultat"-text som visas är omskrivna. Regelmotorn har fått den bekräftade signalen (`emptyReason` per del fanns redan, `NoSessionReason.cause` är ny) som avsnitten tidigare sa saknades – "kan inte kombineras" visas nu bara när orsaken är bekräftad, inte som en gissning utifrån en tom fältlista. |
| 2026-09-23 (uppföljning samma dag) | **Avsnitt 3:** ny rad för skärmläsarordet "kärnområde" och en förklaring av hur det vävs in i fokuskryssrutornas tillgängliga namn tillsammans med "(K)" (WCAG 2.5.3). |
| 2026-09-28 | **Avsnitt 4:** två nya rader för ytan på övningskortet och en förklaring av placering, radbrytning och skärmläsarläsning av "×" (ADR 0017, `feature/ytreferens`). Fältet fanns inte vid K2, och måttet visades inte alls på kortet innan den här ändringen. |
| 2026-09-28 (uppföljning samma dag) | **Avsnitt 4:** tre nya rader och en ny förklaring för ytförklaringen – en utfällbar text som säger att ytreferensen bara jämför storlek, inte pekar ut en plats. Tillagd efter att fotbollsexperten vid granskningen såg att en ledare kan läsa referensen som var målen ska stå. Grenen `design/ytreferens-hjalptext`. |
| 2026-09-28 (förarbete till inkrement 2) | **Avsnitt 8 skrivet om i sin helhet.** Löser motsägelsen mellan den gamla enda raden (en `alt`-text för en `<img>`) och ADR 0012 avsnitt 5 (beslutad, `<title>` + `<desc>` + `aria-labelledby`). Nytt: exakt text för `<title>` ("{övningsnamn}, planskiss"), en fullständig mall för `<desc>` med uteslutningsregler när fält saknas, ett beslut att ytreferensen (ADR 0017) inte tas med i `<desc>` eftersom den redan är synlig text på kortet och inte står i ADR 0012:s uppräkning, en rad för "Planskissen kunde inte visas" som saknades helt trots att ADR 0012 avsnitt 7 och berättelse 06 kriterium 3 redan förutsatte den, och en lösning på "×"-frågan (skrivs ut som "gånger" i title/desc, eftersom avsnitt 4:s dolda tillägg inte går att bygga i en textnod utan synlig motsvarighet). Grenen `feature/planskisser-forarbete`. Svarar på berättelse 06 kriterium 8. |
| 2026-10-02 (granskning av `feature/ritmotor`) | **Avsnitt 8:** fastställer de texter som saknades och som planskissutvecklaren hade som förslag i `src/app/text/texts.ts` och `src/planskiss/`: teckenförklaringens 17 benämningar (`LEGEND_NAMES`, godkända ordagrant), rubriken "Teckenförklaring", och "N spelare till står inte med i skissen." (`notDrawnText`). Nytt: miniatyrknappens tillgängliga namn, som saknades helt – i dag blir den den sammanslagna `<title>` + `<desc>`, vilket är långt och upprepas i varje kort. Fastställt till "Förstora planskiss, {övningsnamn}" / "Dölj planskiss, {övningsnamn}" via ett eget `aria-label`, med en förklaring av hur den fulla beskrivningen ändå nås (den förstorade skissen, utanför knappen) och en anmärkning om att miniatyr-`<svg>`:n bör få `aria-hidden` inuti knappen för att undvika dubbelupläsning – kvalitetssäkraren kontrollerar med en riktig skärmläsare. Grenen `design/ritmotor-texter`. Ingen kod ändrad av ux-designern. |
