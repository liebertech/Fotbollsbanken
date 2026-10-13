Status: godkänd (K2, 2026-09-12)

# Gränssnittstexter – Fotbollsbanken

Alla texter är på svenska och skrivna i klarspråk, med samma ord som ledare själva använder (spelform, station, coachningspunkter, med mera). Knappar säger exakt vad som händer när de trycks, inte bara "OK" eller "Skicka". Texterna nedan är förslag som senior-systemutvecklare implementerar och som kan finjusteras utan ny K2-behandling, så länge innebörden är densamma.

Platshållare skrivs inom `{hakparentes}`.

---

## 1. Allmänt, återkommande

| Sammanhang | Text |
|---|---|
| Varumärkesrad i sidhuvudet (visas bredvid bollikonen, `designsystem.md` 6.10) | Fotbollsbanken |
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
| Fält, kod | Kod ({kodlängd} siffror) |
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

**Kodlängd (användarens beslut 2026-10-13):** `{kodlängd}` är **8** om Supabase tillåter det och annars **6**. Det är det enda stället där längden finns i texterna. Visar kontrollen av projektet att bara 6 går, ändras värdet till 6 och ingen text behöver skrivas om. Samma värde gäller etiketten, felet "Koden ska ha {kodlängd} siffror." nedan och mejlet i avsnitt 17.

**Viktigt:** appen ska aldrig säga att en adress "redan har ett konto" eller att uppgifter "inte stämmer" för en okänd adress (S-13). Vid fel kod, däremot, ska felmeddelandet vara tydligt – det handlar inte om att avslöja kontots existens, utan om att koden personen just skrev in är fel.

### 2.1 Kodfel, väntetid, gränser och kontroll (tillagt 2026-10-13, berättelse 08 kriterium 3, 8, 9)

De fyra kodfelen i kriterium 3 har egna texter. Går de inte att skilja åt i Supabase används den gemensamma raden sist i första tabellen.

| Sammanhang | Text |
|---|---|
| Fel: koden har fel längd eller innehåller annat än siffror (innan något skickas) | Koden ska ha {kodlängd} siffror. |
| Fel: koden redan använd | Koden är redan använd. Begär en ny kod. |
| Fel: koden ersatt av en nyare | Du har begärt en nyare kod sedan den här. Använd koden i det senaste mejlet. |
| Fel: gemensam text om fallen ovan och "har gått ut" inte går att skilja åt | Koden stämmer inte eller har gått ut. Begär en ny kod. |
| Väntetid, skärmläsartext och text under knappen | Du kan begära en ny kod om {sekunder} sekunder. |
| Fel: för många kodbeställningar (servern nekar) | Du har begärt för många koder just nu. Vänta en stund och försök igen. |
| Fel: tjänstens gräns för mejl per timme nådd | Det går inte att skicka fler koder just nu. Försök igen om en liten stund. |
| Fel: e-postadressen ser inte rätt ut | Skriv en giltig e-postadress, till exempel namn@exempel.se. |
| Fel: namnet för långt | Namnet får vara högst 100 tecken. |
| Fel: kontrollen ej godkänd när "Skicka kod" trycks | Bekräfta först att du är en person. |
| Fel: kontrollen (Turnstile) kan inte laddas | Vi kunde inte göra kontrollen som visar att du är en person. Kontrollera din anslutning. Blockerar du innehåll från andra webbplatser kan du behöva tillåta Cloudflare. |
| Knapp, kontrollen kunde inte laddas | Försök kontrollen igen |
| Knapp, skicka kod, pågår | Skickar kod … |
| Knapp, bekräfta kod, pågår | Kontrollerar kod … |

**Ingen av texterna ovan får skilja mellan en känd och en okänd adress** (S-13). Väntetid och gränser gäller adressen oavsett om den har ett konto.

### 2.2 Inbjudan som inte fungerar (tillagt 2026-10-13, berättelse 11 kriterium 4, 5, 7)

Vyn har rubriken "Inbjudan fungerar inte". Texterna nämner varken klubb, lag eller den inbjudna adressen, eftersom länken kan ha hamnat hos fel person (S-14).

| Orsak | Text | Knapp |
|---|---|---|
| Har gått ut | Den här inbjudan har gått ut. Be den som bjöd in dig om en ny. | Logga in |
| Är återkallad | Den här inbjudan är återkallad. Be den som bjöd in dig om en ny om du tror att det är ett misstag. | Logga in |
| Är redan använd | Den här inbjudan är redan använd. Om det var du kan du logga in som vanligt. | Logga in |
| Gäller en annan adress | Den här inbjudan gäller en annan e-postadress än den du är inloggad med. Logga ut och logga in med adressen som inbjudan skickades till. | Logga ut och byt konto |
| Länken fungerar inte (okänd eller avkortad nyckel) | Länken fungerar inte. Kontrollera att du kopierat hela länken, eller be om en ny inbjudan. | Logga in |
| För många försök | Du har försökt för många gånger. Vänta en stund och försök igen. | (ingen) |

### 2.3 Efter "Logga ut på alla enheter" (tillagt 2026-10-13, berättelse 27 kriterium 2, 4)

Visas som informationsruta (ⓘ) överst på inloggningssidan som personen kommer till. Texten säger ärligt det ADR 0004 ger: andra enheter loggas ut inom högst en timme, och en enhet utan nät behåller sin kopia tills den får kontakt.

| Sammanhang | Text |
|---|---|
| Informationsruta på inloggningssidan | Du är utloggad på alla enheter. Det kan dröja upp till en timme innan en annan enhet har loggats ut. En enhet utan nät behåller sin sparade kopia tills den får kontakt igen. |
| Informationsruta på inloggningssidan efter radering (se avsnitt 16) | Ditt konto är raderat. Du är utloggad. |

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
| Knapp, byt övning, synlig text | Byt övning |
| Knapp, byt övning, tillgängligt namn | Byt övning, {kortets rubrik} |
| Bekräftelse efter byte, på det bytta kortet | Bytt till: {nytt övningsnamn}. (samma text som `swap.confirmation`, avsnitt 6) |
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
- **Radbrytning:** `{ytreferens}` kan bli upp till 90 tecken (fotbollsexpertens riktmärke ~70) och ska kunna radbryta fritt på en mobilskärm, precis som en statustagg (designsystem.md 6.5). Själva måttet ska däremot hållas ihop med hårda mellanslag (U+00A0) bara inuti "{längd} × {bredd} meter", alltså runt "×" och före "meter", så att "×" eller "meter" aldrig hamnar ensamt på en egen rad. Mellanslaget efter "Yta:" och mellanslaget före "(" är vanliga mellanslag (ändrat 2026-10-12): "(" sitter ihop med referensens första ord och kan därför inte stå ensamt, och en hård kedja från "Yta:" till första ordet i referensen, ungefär 27 tecken, är bredare än raden vid 200 % text på 390 px och bryts då mitt i ordet ("ung efär"). Grundregeln är att inget hårt mellanslag får knyta ihop ett helt ord med resten av raden. Det är samma typ av åtgärd som redan finns i koden (`.visually-hidden`, se kärnområdes-noten i avsnitt 3), fast här för radbrytning i stället för tillgängligt namn.
- **Skärmläsare:** tecknet "×" ska läsas begripligt (till exempel som "gånger"). Kontrolleras av kvalitetssäkraren med en riktig skärmläsare (NVDA/VoiceOver). Läses det oklart, används samma mönster som för "(K)"/kärnområde ovan: den synliga symbolen står kvar, och ett `.visually-hidden`-tillägg ger en tydlig accessible name – inte en ersättning av den synliga texten.
- **Ytförklaring (tillagd 2026-09-28, uppföljning till ADR 0017):** fotbollsexperten påpekade vid granskningen att en ledare kan läsa ytreferensen som en plats – till exempel ställa målet på straffområdets riktiga mållinje – i stället för en jämförelse av storlek. Var målen står följer övningens beskrivning, inte referensen. Lösningen är en liten utfällbar förklaring, samma mönster som "Visa mer" (accordion, `designsystem.md` avsnitt 6.7: riktig disclosure-knapp med `aria-expanded`, innehållet helt dolt för skärmläsare när den är fälld, ingen information bara vid hovring). Den visas **bara på den första övningen i passet vars yta har en ytreferens** – inte upprepad på varje kort, för att inte göra varje kort tyngre. Fälld: "Vad betyder måttet i parentes?". Utfälld: "Referensen jämför storlek. Var målen står följer övningens beskrivning." och knapptexten byter till "Dölj förklaringen". Har inget kort i passet en ytreferens visas ingenting. Se `skisser/02-genererat-pass.md`.

**Bekräftelsen efter ett byte visas på kortet, inte intill totaltiden (fastställt 2026-10-05, granskning av `feature/byt-ovning`, inkrement 2b):** `04-byt-ovning.md` beskrev bekräftelsen som att den visas "med den uppdaterade tiden synlig", vilket lästes som att texten skulle stå intill passets totaltid högst upp. Det byggda gränssnittet visar i stället "Bytt till: {namn}." som en egen rad direkt under namnet på det bytta kortet (`ExerciseCard.tsx`), medan passets totaltid (`Faktisk tid: …`) uppdateras automatiskt högst upp som vanligt – kriterium 04.5 är alltså uppfyllt utan att de två måste stå bredvid varandra. Beslutet: **behåll placeringen på kortet.** Skälen:

1. Ledarens uppmärksamhet ligger redan på kortet hon eller han just bytte, inte högst upp på sidan – bekräftelsen är tydligast där ögat redan är.
2. Bekräftelsen når skärmläsare oavsett var den står visuellt eller var tangentbordsfokus hamnar: samma text läggs samtidigt i en dold `role="status"`-region som ligger kvar genom hela vybytet (`Generator.tsx`), så den annonseras automatiskt. Att flytta den synliga texten skulle inte förbättra tillgängligheten, bara duplicera innehållet.
3. Att flytta tangentbordsfokus till en text högst upp på sidan efter ett byte skulle rycka bort ledaren från kortet hon eller han precis arbetade med, och tvinga en ny vandring ner igen för att fortsätta (till exempel byta ytterligare en övning). Se även nästa stycke om fokus och `ref`.

**Fokus efter ett byte (ref-frågan, samma granskning):** i dag flyttas fokus med `autoFocus` eftersom `ref` är spärrad i appen. Två separata ställen berörs, och de bör bedömas var för sig om `ref` tillåts:

- **När bytesvyn öppnas** flyttas fokus i dag till knappen "Tillbaka till passet", eftersom den råkar vara vyns första fokuserbara element. En skärmläsare hör alltså "Tillbaka till passet, knapp" innan den hör vyns egen rubrik ("Byt övning: {del}") eller vilken övning som byts ut. **Blir `ref` tillåtet bör fokus i stället flyttas till vyns `<h1>`** (med `tabIndex={-1}`), så att skärmläsaren annonserar den nya vyns titel direkt, innan något annat. "Tillbaka till passet" ligger kvar före rubriken i DOM:en och nås som vanligt med Shift+Tab – samma mönster som används på många webbplatser för en tillbaka-länk placerad ovanför sidans rubrik. **Blir `ref` inte tillåtet** är dagens lösning ett godtagbart, dokumenterat avsteg: fokus hamnar inte i tomma intet och knappen är fullt användbar, men den första annonseringen saknar sammanhang. Det bör noteras som en känd begränsning, inte åtgärdas med ytterligare `autoFocus`-trick.
- **Efter ett byte** flyttas fokus till det nya kortets knapp "Byt övning, {namn}". **Det här ska inte ändras även om `ref` blir tillåtet.** Bekräftelsen är redan annonserad via `role="status"`-regionen (se ovan), och nästa logiska handling för ledaren är ofta att fortsätta genom passet – byta ännu en övning, öppna "Visa mer", eller gå vidare till nästa kort. Att i stället flytta fokus till en bekräftelsetext längst upp på sidan skulle vara ett steg bakåt för tangentbords- och skärmläsaranvändare: de tappar sin plats i passet och måste navigera ner igen. `ref` behövs alltså inte för att "fokus kan hamna … på bekräftelsen" – det är redan löst genom live-regionen, och att även flytta synligt fokus dit vore en försämring.

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
| Knapp, tillbaka till passet | Tillbaka till passet |
| Fält, sök bland alternativen | Sök bland alternativen |
| Sektion | Från den gemensamma banken |
| Sektion (kommer med inkrement 4) | Klubbens egna övningar |
| Nyckeltal per alternativ | {tid} min · {spelare} spelare |
| Knapp per övning, synlig text | Välj denna |
| Knapp per övning, tillgängligt namn | Välj denna: {namn} |
| Info, dolda ofullständiga egna övningar (kommer med inkrement 4) | Ingen av era egna övningar med ofullständiga uppgifter visas här – de kan inte användas i ett pass förrän de är kompletta. |
| Inga alternativ (gäller till inkrement 4) | Vi hittade ingen övning i banken som passar precis här. Övningen ligger kvar som den är. |
| Ingen sökträff | Ingen av övningarna matchar sökningen. |
| Bekräftelse efter byte | Bytt till: {nytt övningsnamn}. |

**Fastställt vid granskningen av det byggda gränssnittet (2026-10-05, inkrement 2b, grenen `design/byt-ovning`):** raderna "Knapp, tillbaka till passet", "Fält, sök bland alternativen", "Nyckeltal per alternativ", "Knapp per övning, tillgängligt namn" och "Ingen sökträff" saknades i den här tabellen, trots att de redan stod i wireframen eller var nödvändiga för att bygga vyn. Texterna var redan föreslagna i `src/app/text/texts.ts` av senior-systemutvecklare och godkänns här ordagrant.

**"Inga alternativ" är tillfälligt omskriven.** Den ursprungliga texten ("varken i banken eller bland era egna") förutsatte att klubbens egna övningar redan gick att byta in, vilket kommer först med inkrement 4 (egna och inskickade övningar). Till dess visas bara bankens alternativ, så texten ska inte nämna "era egna" – annars låtsas appen ha ett alternativ som inte finns. **När inkrement 4 är klart ska raden bytas tillbaka** till en formulering som nämner båda källorna (till exempel den ursprungliga: "Vi hittade ingen övning, varken i banken eller bland era egna, som passar precis här."), och sektionen "Klubbens egna övningar" samt informationstexten om dolda ofullständiga övningar tas i bruk samtidigt. Markera då om ändringen i tabellen ovan.

**Knapparnas tillgängliga namn (WCAG 2.5.3):** wireframen i `04-byt-ovning.md` föreslog "Välj {namn}" för alternativknappen. Det tillgängliga namnet måste dock innehålla den synliga texten ordagrant, och den synliga texten är "Välj denna" (inte bara "Välj") – av samma skäl som bytesknappens namn på passets kort. Det tillgängliga namnet fastställs därför till **"Välj denna: {namn}"**, inte "Välj {namn}". Samma mönster gäller bytesknappen på passets kort (avsnitt 4): dess synliga text är "Byt övning", så det tillgängliga namnet är **"Byt övning, {kortets rubrik}"** – se tillägget i avsnitt 4 nedan.

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
| Tomt läge, lagets flik | {lagnamn} har inga sparade pass än. |
| Knapp, nytt | + Nytt pass |

### 7.1 Lagval, fel och bekräftelse vid sparande (tillagt 2026-10-13, berättelse 05 och 12)

| Sammanhang | Text |
|---|---|
| Alternativ i lagvalet, inget lag | Inget lag, bara för mig |
| Knapp, pågår | Sparar … |
| Bekräftelse, sparat i lag | Passet är sparat i {lagnamn}. |
| Bekräftelse, sparat personligt | Passet är sparat. Bara du ser det. |
| Knapp, spara ett ändrat sparat pass (05.9) | Spara som nytt pass |
| Fel: passnamnet för långt | Namnet får vara högst 100 tecken. Du har skrivit {antal}. |
| Fel: dygnsgränsen nådd (05.11) | Du har sparat 200 pass det senaste dygnet, vilket är gränsen. Försök igen senare. |
| Fel: nät saknas vid sparande (05.12) | Du verkar sakna internetanslutning. Passet har inte sparats. Det ligger kvar här – försök igen när du är uppkopplad. |
| Osparat pass efter omstart (05.14) | Det här passet är inte sparat än. |

### 7.2 Vem som sparade (tillagt 2026-10-13, berättelse 12 kriterium 1 och 3, berättelse 26 kriterium 2)

Raden på passkortet har exakt fyra former. Namnet på den som lämnat laget visas aldrig (S-16).

| Sammanhang | Text |
|---|---|
| Du sparade passet | Sparat av dig |
| Annan ledare i samma lag | Sparat av {namn} |
| Ledaren har lämnat laget men finns kvar som konto | Sparat av en tidigare ledare |
| Kontot är raderat | Sparat av Borttagen användare |

"Borttagen användare" är den exakta text berättelse 26 kriterium 2 anger. Den skrivs med stor bokstav, som ett namn, och översätts inte till "en borttagen användare".

### 7.3 Vem som ser passet och att koppla det till ett lag (tillagt 2026-10-13, berättelse 12 kriterium 2 och 6)

| Sammanhang | Text |
|---|---|
| Chip, personligt pass | Bara synligt för dig |
| Chip, lagpass | Delas med {lagnamn} |
| Knapp, koppla personligt pass | Koppla till lag |
| Rubrik, dialog | Koppla passet till ett lag |
| Fält | Lag |
| Förklaring i dialogen | Alla ledare i {lagnamn} kan då se, öppna och ta bort passet. Du kan inte göra det personligt igen eller flytta det till ett annat lag. |
| Påminnelse om passets namn | Passets namn syns för dem: "{passnamn}". Skriv inga namn på spelare. |
| Knapp, bekräfta | Koppla till {lagnamn} |
| Bekräftelse efter koppling | Passet delas nu med {lagnamn}. |
| Info, ledaren är inte med i något lag | Du är inte med i något lag än. Be klubbadmin bjuda in dig, så kan du dela passet. |
| Fel: laget arkiverades under tiden | Laget är arkiverat och kan inte tas emot pass. |

### 7.4 Ta bort ett pass (tillagt 2026-10-13, berättelse 05 kriterium 13, berättelse 12 kriterium 8)

Alla ledare i ett lag får ta bort lagets pass (användarens beslut 2026-10-13). Bekräftelsen för ett lagpass säger vem det drabbar.

| Sammanhang | Text |
|---|---|
| Knapp i passvyn | Ta bort pass |
| Rubrik, personligt pass | Ta bort passet? |
| Text, personligt pass | "{passnamn}" försvinner ur dina listor. Det rensas helt efter 90 dagar. |
| Knapp, bekräfta, personligt pass | Ta bort passet |
| Rubrik, lagpass | Ta bort passet för hela {lagnamn}? |
| Text, lagpass | "{passnamn}" försvinner för alla ledare i {lagnamn}. Det rensas helt efter 90 dagar. Du kan inte ångra det i appen. |
| Knapp, bekräfta, lagpass | Ta bort för hela laget |
| Bekräftelse efter borttagning | Passet är borttaget. Det rensas helt efter 90 dagar. |
| Info, någon annan hann före | Passet är redan borttaget. |

### 7.5 Pass som inte klarar slutkontrollen (tillagt 2026-10-13, berättelse 05 kriterium 7)

Användarens beslut 2026-10-13: ett lagrat pass som inte klarar slutkontrollen visas inte. Texten är ett begripligt besked utan teknisk utskrift, gissar inte orsaken och använder inga regelnummer. Planläge och utskrift är spärrade, och knapparna för dem visas inte alls.

| Sammanhang | Text |
|---|---|
| Rubrik (h1) | Det här passet går inte att använda |
| Text i rutan | Passet "{passnamn}" klarar inte våra säkerhetskontroller, till exempel för att en övning inte är godkänd eller för att passet har mer nickspel än åldern tillåter. Därför visar vi det inte. Planläge och utskrift är avstängda för det. |
| Knapp, primär | Skapa ett nytt pass |
| Knapp, destruktiv | Ta bort passet |

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
| Varning, arkivera lag, vad som händer nu (ersätter texten före 2026-10-13) | Laget har {antal} sparade pass{ och en säsongsplan, om aktuellt}. Laget tas bort från de aktiva listorna och kan inte längre väljas för nya pass. |
| Varning, arkivera lag, rensning efter 24 månader (användarens beslut 2026-10-13) | Efter 24 månader rensas laget och dess pass helt. Det går inte att återställa ett arkiverat lag i appen. |
| Varning, arkivera lag utan pass och säsongsplan (bara en ruta) | Laget {lagnamn} rensas helt efter 24 månader. Det går inte att återställa ett arkiverat lag i appen. |
| Rubrik, arkivera | Arkivera {lagnamn}? |
| Knapp | Arkivera ändå |
| Knapp, laget saknar pass | Arkivera laget |
| Rubrik, arkiverade lag (hopfälld) | Arkiverade lag ({antal}) |
| Rad, arkiverat lag | {lagnamn} · Rensas {datum} |
| Fält, inbjudan | Bjud in ledare via e-post |
| Knapp | Skicka inbjudan |
| Status | Inbjuden, väntar på svar |
| Knapp | Ta bort från lag |
| Bekräftelse, ta bort | Ta bort {namn} från {lagnamn}? Personen behåller sitt konto och det som inte enbart hör till laget. |

### 13.1 Lagets uppgifter (tillagt 2026-10-13, berättelse 10)

| Sammanhang | Text |
|---|---|
| Rubrik, nytt lag | Nytt lag |
| Hjälptext, ålder | Ange den ålder som flest i laget fyller i år. Åldern räknas upp av sig själv varje nyår. |
| Hjälptext, spelform | Föreslagen utifrån åldern. Du kan välja en annan. |
| Visning av ålder i lagets vy | {ålder} år i år |
| Fel: namnet för långt (klubbnamn, lagnamn) | {Fältnamn} får vara högst 100 tecken. Du har skrivit {antal}. |
| Knapp | Skapa lag |
| Rad, antal sparade pass i lagets vy | Sparade pass: {antal} |
| Förklaring, klubbadmin som inte är ledare i laget | Du är inte ledare i {lagnamn}, så du kan inte öppna lagets pass. |
| Förklaring, vanlig ledare i lagets vy | Bara klubbadmin kan ändra laget och bjuda in ledare. |

### 13.2 Utse klubbadmin (tillagt 2026-10-13, berättelse 09 kriterium 4)

| Sammanhang | Text |
|---|---|
| Rubrik, lista | Ledare i klubben |
| Chip | Klubbadmin |
| Knapp | Gör till klubbadmin |
| Knappens tillgängliga namn | Gör till klubbadmin, {namn} |
| Rubrik, dialog | Gör {namn} till klubbadmin? |
| Text, dialog | {namn} får samma rättigheter som du: skapa och arkivera lag, bjuda in och ta bort ledare och utse fler klubbadminer. {namn} blir klubbadmin i {klubbnamn}, utöver sina lag. |
| Knapp, bekräfta | Gör till klubbadmin |
| Bekräftelse | {namn} är nu klubbadmin i {klubbnamn}. |
| Info, ingen annan i klubben kan utses | Ingen annan i klubben kan bli klubbadmin än. Bjud in en ledare till ett lag först. |

### 13.3 Inbjudningar (tillagt 2026-10-13, berättelse 11)

| Sammanhang | Text |
|---|---|
| Status, giltighet | Gäller till {datum} |
| Status, utgången | Inbjudan har gått ut |
| Knapp, utgången inbjudan | Bjud in igen |
| Knapp | Kopiera inbjudningslänk |
| Knapp, på en inbjudan | Kopiera länk |
| Knapp | Återkalla |
| Knappens tillgängliga namn | Återkalla inbjudan till {e-post} |
| Bekräftelse efter kopiering | Länken är kopierad. Den fungerar bara för {e-post} och gäller i 14 dagar. |
| Bekräftelse efter utskick | Inbjudan är skickad till {e-post}. |
| Bekräftelse efter återkallande | Inbjudan till {e-post} är återkallad. Länken fungerar inte längre. |
| Bekräftelse efter borttagning ur lag | {namn} är borttagen från {lagnamn}. |
| Fel: dygnsgränsen för utskick nådd (11.9) | Klubben har skickat 50 inbjudningar det senaste dygnet, vilket är gränsen. Försök igen i morgon, eller kopiera länken och skicka den själv. |
| Fel: e-postadressen ser inte rätt ut | Skriv en giltig e-postadress, till exempel namn@exempel.se. |

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
| Fel, handling kräver nät (spara, ändra, skicka in, godkänna, bjuda in, logga in, skapa klubb, skapa eller arkivera lag, utse klubbadmin, ta bort ett pass, koppla ett pass till ett lag) | Du verkar sakna internetanslutning. Det du skrivit finns kvar – försök igen när du är uppkopplad. |
| Fel, spara pass utan nät (egen text, säger att passet inte är sparat) | Du verkar sakna internetanslutning. Passet har inte sparats. Det ligger kvar här – försök igen när du är uppkopplad. |
| Fel, ta bort pass utan nät | Du verkar sakna internetanslutning. Passet är inte borttaget. Försök igen när du är uppkopplad. |
| Fel, logga ut på alla enheter utan nät (27.5) | Du verkar sakna internetanslutning. Du är fortfarande inloggad och ingen enhet har loggats ut. Försök igen när du är uppkopplad. |
| Fel, radera konto utan nät (26.12) | Du verkar sakna internetanslutning. Ingenting har raderats. Försök igen när du är uppkopplad. |
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

### 16.1 Logga ut på alla enheter (tillagt 2026-10-13, berättelse 27)

| Sammanhang | Text |
|---|---|
| Rubrik, sektion | Om du tappat en telefon |
| Rubrik, dialog | Logga ut på alla enheter? |
| Text, dialog | Du loggas ut här direkt. Andra enheter loggas ut inom högst en timme. Därefter måste du logga in med en ny kod på varje enhet. |
| Knapp, bekräfta | Logga ut på alla enheter |
| Knapp | Avbryt |
| Fel, nät saknas (27.5) | Du verkar sakna internetanslutning. Du är fortfarande inloggad och ingen enhet har loggats ut. Försök igen när du är uppkopplad. |
| Bekräftelse på inloggningssidan | Se avsnitt 2.3 |

Bekräftelsen efteråt (avsnitt 2.3) säger ärligt att det kan dröja upp till en timme innan andra enheter loggas ut och att en enhet utan nät behåller sin sparade kopia tills den får kontakt. Ingen text i appen påstår att andra enheter redan är stängda ute.

### 16.2 Radera konto, fler lägen (tillagt 2026-10-13, berättelse 26 kriterium 3, 4, 9, 10, 11, 12)

| Sammanhang | Text |
|---|---|
| Ingress, blockerad | Du kan inte radera ditt konto än: |
| Blockerad, sista redaktören (26.4) | Du är den enda redaktören. Utse en annan redaktör innan du kan radera ditt konto. |
| Knapp, sista redaktören (visas först när inkrement 4 är byggt) | Utse en redaktör |
| Blockerad, redaktörernas ägare (26.10) | Du är redaktörernas ägare. Ägarskapet kan inte flyttas i appen än. Kontakta den som driver Fotbollsbanken. |
| Info, ingen annan i klubben kan utses | Ingen annan i klubben kan bli klubbadmin än. Bjud in en ledare till ett lag först. |
| Rubrik, ensam medlem (26.9, användarens beslut 2026-10-13) | Klubben {klubbnamn} raderas också |
| Varning, ensam medlem | Du är den enda medlemmen. Klubben, dess lag, lagens pass och klubbens egna övningar raderas för alltid och går inte att få tillbaka. |
| Listpunkt, raderas | Din profil (namn, e-post) |
| Listpunkt, raderas | Klubben {klubbnamn} |
| Listpunkt, raderas | {antal} lag |
| Listpunkt, raderas | {antal} sparade pass i lagen |
| Listpunkt, raderas | {antal} egna övningar i klubben |
| Listpunkt, raderas | Dina personliga pass |
| Listpunkt, raderas | Väntande inbjudningar |
| Knapp, ensam medlem i en klubb | Radera mitt konto och klubben |
| Knapp, ensam medlem i flera klubbar | Radera mitt konto och klubbarna |
| Förklaring, knappen verkningslös (`aria-describedby`) | Skriv ditt namn för att bekräfta. |
| Fel, raderingen blev inte klar (26.11) | Raderingen blev inte klar. Försök igen. Det går bra att göra om, och inget raderas två gånger. |
| Knapp, försök igen | Försök radera igen |
| Fel, nät saknas (26.12) | Du verkar sakna internetanslutning. Ingenting har raderats. Försök igen när du är uppkopplad. |

---

## 17. Mejl (berättelse 08 kriterium 11, berättelse 11 kriterium 1, `skisser/14-inloggning.md`)

Båda mejlen är rena textmejl på svenska, utan bilder och utan spårningslänkar. De säger vem som skickat dem. Platshållarna ersätts av tjänsten som skickar (Supabase Auth respektive Edge Function för inbjudningar); hur det görs tekniskt avgör senior-systemutvecklare.

### 17.1 Inloggningsmejl (samma text vid registrering och inloggning)

Mejlet innehåller **bara koden, ingen inloggningslänk** (ADR 0004 punkt 4). Samma text används för nya och befintliga konton, så att mejlet inte avslöjar något om kontots existens.

| Del | Text |
|---|---|
| Avsändarnamn | Fotbollsbanken |
| Ämne | Din inloggningskod till Fotbollsbanken |
| Brödtext | Hej!<br><br>Din kod är:<br><br>{kod}<br><br>Skriv in koden i Fotbollsbanken för att logga in. Koden gäller i 10 minuter och går bara att använda en gång.<br><br>Om du inte har försökt logga in kan du bortse från det här mejlet. Ingen har fått tillgång till ditt konto.<br><br>Fotbollsbanken<br>Det här mejlet går inte att svara på. |

- `{kod}` skrivs i grupper för läsbarhet: "1234 5678" vid 8 siffror, "123 456" vid 6. Grupperingen är bara visuell; koden som skrivs in i appen har inga mellanslag (appen tar bort dem om de klistras in).
- Koden står på en egen rad i större stil än brödtexten (om mejlmallen tillåter), så att den går att läsa av på en låsskärm.
- Texten innehåller ingen länk och inget som liknar en inloggningsknapp.

### 17.2 Inbjudningsmejl

Skickas från klubbadmins inbjudan (berättelse 11). Mejlet säger vem som bjuder in och till vad, så att mottagaren kan känna igen avsändaren.

| Del | Text |
|---|---|
| Avsändarnamn | Fotbollsbanken |
| Ämne | Du är inbjuden till {lagnamn} i Fotbollsbanken |
| Brödtext | Hej!<br><br>{inbjudarens namn} i {klubbnamn} har bjudit in dig som ledare för {lagnamn} i Fotbollsbanken, en app för att planera fotbollsträningar.<br><br>Öppna länken för att skapa ett konto eller logga in och gå med i laget:<br><br>{inbjudningslänk}<br><br>Inbjudan gäller i 14 dagar och bara för den här e-postadressen. Du loggar in med en kod som skickas till samma adress, så du behöver inget lösenord.<br><br>Känner du inte igen {inbjudarens namn} eller {klubbnamn} kan du bortse från mejlet. Ingenting händer om du inte öppnar länken.<br><br>Fotbollsbanken<br>Det här mejlet går inte att svara på. |

- Länken är ett vanligt textlänkfält, utskriven i sin helhet, så att den går att kopiera om mejlprogrammet inte gör den klickbar. Länkens nyckel ligger i URL-fragmentet (11.6).
- Mejlet nämner inte om adressen redan har ett konto (11.11).
- Inbjudarens namn är klubbadmins eget namn, och går alltså till en person som inte är medlem än. Det är avsiktligt (mottagaren ska kunna känna igen avsändaren) men ska bekräftas i integritetspolicyn (fas 5).

---

## 18. Meny (`skisser/16-navigering.md`)

| Sammanhang | Text |
|---|---|
| Knapp, meny stängd | Meny |
| Knapp, meny öppen | Stäng meny |
| Navigeringens namn (`nav`) | Huvudmeny |
| Punkt | Sparade pass |
| Punkt | Nytt pass |
| Punkt | Klubb och lag |
| Punkt (kommer med inkrement 4) | Klubbens övningar |
| Punkt (kommer med inkrement 4) | Redaktörskö ({antal}) |
| Punkt (kommer med inkrement 7) | Säsongsplan |
| Punkt | Mitt konto |
| Punkt | Logga ut |
| Redaktörskön, tillgängligt namn | Redaktörskö, {antal} väntar |
| Info på startsidan, person utan klubb | Du är inte med i någon klubb än. Skapa din klubb, eller be en klubbadmin bjuda in dig. |
| Knapp i den rutan | Skapa din klubb |

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
| 2026-10-05 (granskning av `feature/byt-ovning`, inkrement 2b) | **Avsnitt 4 och 6:** fastställer texterna som senior-systemutvecklare föreslagit i `src/app/text/texts.ts` för bytesvyn (berättelse 04): "Tillbaka till passet", "Sök bland alternativen", "Ingen av övningarna matchar sökningen.", nyckeltalsraden "{tid} min · {spelare} spelare", samt knapparnas tillgängliga namn "Byt övning, {kortets rubrik}" (avsnitt 4) och "Välj denna: {namn}" (avsnitt 6) – det senare ersätter skissens "Välj {namn}" eftersom det tillgängliga namnet måste innehålla den synliga texten ordagrant (WCAG 2.5.3). "Inga alternativ" skrivs om tillfälligt utan "era egna övningar", eftersom klubbens egna övningar inte går att byta in förrän inkrement 4 – ska bytas tillbaka då, se noten i avsnitt 6. Ordning och placering i bytesvyn (namn, fokus, nyckeltal, miniatyr, knapp; sortering på namn i svensk ordning; miniatyren under nyckeltalen) är granskad mot det byggda gränssnittet och behålls oförändrad. Ett nytt stycke i avsnitt 4 fastställer att bekräftelsen "Bytt till: …" visas på det bytta kortet, inte intill totaltiden, med en motivering kring `role="status"`-regionen i `Generator.tsx` och en rekommendation om var fokus bör hamna om `ref` tillåts (vyns `<h1>` vid öppning; oförändrat – det nya kortets bytesknapp – efter ett byte). Grenen `design/byt-ovning`. Ingen kod ändrad av ux-designern. |
| 2026-10-12 (granskning av helheten, riktning A) | **Avsnitt 4, ytraden:** hårda mellanslag bara inuti "{längd} × {bredd} meter"; vanligt mellanslag efter "Yta:" och före "(". Skälet: med hårda mellanslag hela vägen bröts "(ungefär" mitt i ordet vid stor text. Koden (`src/app/text/texts.ts`, `areaWithReference` och `area`) behöver ändras av senior-systemutvecklare. |
| 2026-10-13 (inkrement 3) | **Avsnitt 2:** kodlängd som platshållaren `{kodlängd}` (8, användarens beslut; 6 om Supabase inte tillåter 8), nya under-avsnitt 2.1 (kodfel, väntetid, gränser, Turnstile), 2.2 (inbjudan som inte fungerar) och 2.3 (bekräftelse efter "Logga ut på alla enheter"). **Avsnitt 7:** nya 7.1-7.5 (lagval och fel vid sparande, "Sparat av" i fyra former, koppla ett personligt pass till ett lag, ta bort pass, pass som inte klarar slutkontrollen). **Avsnitt 13:** arkiveringsvarningen säger att laget och dess pass rensas efter 24 månader (ersätter "De påverkas inte"), nya 13.1-13.3 (lagets uppgifter, utse klubbadmin, inbjudningar). **Avsnitt 15:** nätfel med egen text för spara, ta bort, logga ut på alla enheter och radera. **Avsnitt 16:** nya 16.1-16.2 (logga ut på alla enheter, radering när personen är ensam medlem, sista redaktör, redaktörsägare eller ett steg misslyckats). Nya avsnitt 17 (mejl) och 18 (meny). Statusraden ändras inte av en agent. |
